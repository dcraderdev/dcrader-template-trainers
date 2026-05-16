/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        barlow: ['"Barlow Condensed"', 'sans-serif'],
        dm: ['"DM Sans"', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        oswald: ['Oswald', 'sans-serif'],
        source: ['"Source Serif 4"', 'serif'],
      },
    },
  },
  plugins: [],
};
