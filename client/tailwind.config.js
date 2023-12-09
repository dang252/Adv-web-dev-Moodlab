/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'dark-text': '#fffffe',
        'dark-btn': '#7f5af0',
        'dark-p': '#94a1b2',
        'dark-bg': '#16161a',
        'dark-sec': '#72757e',
        'light-text': '#272343',
        'light-btn': '#ffd803',
        'light-p': '#2d334a',
        'light-bg': '#fffffe',
        'light-sec': '#e3f6f5'
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
