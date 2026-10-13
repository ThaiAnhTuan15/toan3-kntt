/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/data/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'from-amber-400', 'to-orange-500',
    'from-emerald-400', 'to-teal-600',
    'from-blue-400', 'to-indigo-600',
    'from-rose-400', 'to-red-500', 'to-red-600',
    'from-cyan-400', 'from-cyan-500', 'to-blue-600',
    'from-purple-500', 'to-pink-600',
    'bg-gradient-to-br', 'bg-gradient-to-r',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-nunito)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
