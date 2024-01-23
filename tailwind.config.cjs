module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#001529',
        secondary: '#1e40af',
        list1: '#0047cc',
        list2: '#e3342f',
        textAside: '#ffffff'
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};