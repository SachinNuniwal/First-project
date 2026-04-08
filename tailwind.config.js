/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        'github-dark': {
          'bg-primary': '#0d1117',
          'bg-secondary': '#161b22',
          'bg-tertiary': '#21262d',
          'border': '#30363d',
          'text-primary': '#e6edf3',
          'text-secondary': '#8b949e',
          'text-tertiary': '#484f58',
        },
        // Light theme colors
        'github-light': {
          'bg-primary': '#ffffff',
          'bg-secondary': '#f6f8fa',
          'bg-tertiary': '#eaeef2',
          'border': '#d0d7de',
          'text-primary': '#24292f',
          'text-secondary': '#57606a',
          'text-tertiary': '#8c959f',
        },
      },
    },
  },
  plugins: [],
}
