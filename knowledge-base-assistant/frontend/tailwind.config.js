import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // "Archive" palette — a knowledge base reads as a research library,
        // not a generic SaaS dashboard. Deep ledger-blue + warm stamp-amber.
        ink: {
          50: '#F6F7F5',   // page background — cool paper, not the cliché warm cream
          100: '#ECEEEA',
          200: '#D8DCD4',
          400: '#8B92A0',
          600: '#4B5468',
          800: '#232B3D',
          900: '#171B26',  // primary text
        },
        ledger: {
          50: '#EEF2F9',
          100: '#D7E1F0',
          400: '#4A6FA5',
          500: '#2A4B7C',  // primary brand color
          600: '#1F3A63',
          700: '#17304F',
        },
        stamp: {
          400: '#F0B95C',
          500: '#E8A33D',  // accent — used sparingly, like an ink stamp
          600: '#C7841F',
        },
        signal: {
          error: '#B3402B',
          success: '#2F6F4E',
        },
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [typography],
};
