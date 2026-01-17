/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Sakura 品牌色系 - Soft UI Evolution */
        primary: {
          50: '#FFF0F5',    /* lavender blush */
          100: '#FFE4E9',   /* light pink */
          200: '#FFD1DA',   /* soft pink */
          300: '#FFAEC2',   /* medium pink */
          400: '#FF7F9E',   /* pink rose */
          500: '#EC4899',   /* brand pink */
          600: '#DB2777',   /* deep pink */
          700: '#B92775',   /* dark pink */
          800: '#9D1C58',   /* darker pink */
          900: '#781646',   /* darkest pink */
          950: '#540D2F',   /* ultra dark */
        },
        /* 奶油金点缀 */
        gold: {
          50: '#FFFBF0',
          100: '#FFF5D6',
          200: '#FFEBB8',
          300: '#FFDF8A',
          400: '#FFCF55',
          500: '#FFBF30',
          600: '#F59E0B',
          700: '#D97706',
        },
        /* 鼠尾草绿点缀 */
        sage: {
          50: '#F6FAF7',
          100: '#E8F5EB',
          200: '#C8EBD0',
          300: '#99DDB1',
          400: '#68CA94',
          500: '#42B57B',
          600: '#319169',
          700: '#2A7A5B',
        },
        /* 樱花色系别名 */
        sakura: {
          50: '#FFF0F5',
          100: '#FFE4E9',
          200: '#FFD1DA',
          300: '#FFAEC2',
          400: '#FF7F9E',
          500: '#EC4899',
          600: '#DB2777',
          700: '#B92775',
          800: '#9D1C58',
          900: '#781646',
          950: '#540D2F',
        },
        /* 传统颜色别名（向后兼容） */
        secondary: '#FF7F9E',   /* primary-400 */
        cta: '#FFBF30',         /* gold-500 */
        background: '#FFF0F5',  /* primary-50 */
        text: '#781646',        /* primary-900 */
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        display: ['Cormorant Infant', 'Great Vibes', 'serif'],
        script: ['Great Vibes', 'cursive'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(236, 72, 153, 0.08), 0 10px 20px -2px rgba(236, 72, 153, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(236, 72, 153, 0.12), 0 4px 6px -2px rgba(236, 72, 153, 0.06)',
        'glow': '0 0 20px rgba(236, 72, 153, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
