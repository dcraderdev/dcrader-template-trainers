#!/usr/bin/env node
/**
 * a11y-audit.mjs — axe-core sweep across a list of URLs.
 *
 * Runs each URL through Playwright + @axe-core/playwright and writes a
 * single JSON report. Designed to be invoked per industry repo:
 *
 *   node scripts/a11y-audit.mjs --base http://localhost:4321 \
 *        --paths /v1-warm-italian /v2-modern-minimal /v3-rustic-farm
 *
 * Or with a urls.json file:
 *   node scripts/a11y-audit.mjs --urls scripts/a11y-urls.json
 *
 * Required devDeps (install per repo):
 *   npm i -D playwright @axe-core/playwright
 *
 * Output:
 *   ./a11y-report.json — array of { url, violations[], passes, incomplete }
 *   Exits non-zero if any violation has impact 'serious' or 'critical'.
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const args = parseArgs(process.argv.slice(2));
const baseUrl = args.base ?? 'http://localhost:4321';
const outFile = args.out ?? 'a11y-report.json';
const tagsArg = args.tags ?? 'wcag2a,wcag2aa,wcag21a,wcag21aa';
const tags = tagsArg.split(',').map((t) => t.trim()).filter(Boolean);

let urls = [];
if (args.urls) {
  const data = JSON.parse(fs.readFileSync(args.urls, 'utf8'));
  if (!Array.isArray(data)) {
    console.error(`--urls file must contain a JSON array of URL strings or {url,...} objects`);
    process.exit(2);
  }
  urls = data.map((entry) => (typeof entry === 'string' ? entry : entry.url));
} else if (args.paths) {
  const paths = Array.isArray(args.paths) ? args.paths : [args.paths];
  urls = paths.map((p) => new URL(p, baseUrl).toString());
} else {
  urls = [baseUrl];
}

if (urls.length === 0) {
  console.error('No URLs to audit. Provide --paths, --urls, or --base.');
  process.exit(2);
}

let chromium;
let AxeBuilder;
try {
  ({ chromium } = await import('playwright'));
  AxeBuilder = (await import('@axe-core/playwright')).default;
} catch (err) {
  console.error(
    '\n[a11y-audit] Missing peer deps. Install with:\n' +
      '  npm i -D playwright @axe-core/playwright\n',
  );
  console.error(String(err?.message ?? err));
  process.exit(2);
}

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();

const report = [];
let blockingViolations = 0;

for (const url of urls) {
  process.stdout.write(`[a11y-audit] ${url} … `);
  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
    if (!resp || !resp.ok()) {
      console.log(`HTTP ${resp?.status() ?? 'n/a'} — skipping`);
      report.push({ url, error: `HTTP ${resp?.status() ?? 'no-response'}` });
      continue;
    }
    const results = await new AxeBuilder({ page }).withTags(tags).analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    blockingViolations += blocking.length;
    console.log(
      `${results.violations.length} violation(s) ` +
        `(${blocking.length} blocking), ${results.passes.length} passes`,
    );
    report.push({
      url,
      violations: results.violations.map(slimViolation),
      passCount: results.passes.length,
      incompleteCount: results.incomplete.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
    report.push({ url, error: err.message });
  }
}

await browser.close();

fs.writeFileSync(path.resolve(outFile), JSON.stringify(report, null, 2));
console.log(`\n[a11y-audit] Wrote ${report.length} result(s) → ${outFile}`);
console.log(`[a11y-audit] Blocking (serious/critical) violations: ${blockingViolations}`);

if (blockingViolations > 0) process.exit(1);

function slimViolation(v) {
  return {
    id: v.id,
    impact: v.impact,
    description: v.description,
    help: v.help,
    helpUrl: v.helpUrl,
    tags: v.tags,
    nodeCount: v.nodes.length,
    nodes: v.nodes.slice(0, 8).map((n) => ({
      target: n.target,
      html: (n.html || '').slice(0, 240),
      failureSummary: n.failureSummary,
    })),
  };
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      out[key] = true;
    } else {
      // collect repeated occurrences into arrays (for --paths a b c)
      const values = [];
      while (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
        values.push(argv[++i]);
      }
      out[key] = values.length === 1 ? values[0] : values;
    }
  }
  return out;
}
