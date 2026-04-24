export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './context/**/*.{js,jsx,ts,tsx}',
    './utils/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#f59e0b',
        accent: '#10b981',
        dark: '#1f2937',
      },
    },
  },
  plugins: [],
};