import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#F8F9FB',
          100: '#EEF1F6',
          200: '#D9DFE9',
          300: '#B4BFCF',
          400: '#7C8BA1',
          500: '#4E5D75',
          600: '#2F3B52',
          700: '#1E2738',
          800: '#141B28',
          900: '#0B0F17',
          950: '#070A11',
        },
        // RICH editorial section colors
        crimson: {
          50: '#FFF1F2',
          100: '#FFE0E2',
          200: '#FFB8BC',
          300: '#FF8A92',
          400: '#FF5560',
          500: '#E0142B',  // PRIMARY rich red
          600: '#B8101F',
          700: '#950C18',
          800: '#750913',
          900: '#5C070F',
        },
        navy: {
          50: '#F0F3FA',
          100: '#DCE3F2',
          200: '#B5C2E0',
          300: '#869CC8',
          400: '#5775B0',
          500: '#2E5298',
          600: '#1A3A7F',
          700: '#0D2861',  // PRIMARY dark navy
          800: '#091E48',
          900: '#061535',
          950: '#030B1F',
        },
        mustard: {
          50: '#FFFBEB',
          100: '#FFF5C8',
          200: '#FFE885',
          300: '#FFD43D',
          400: '#FFC107',
          500: '#E8A800',  // PRIMARY golden mustard
          600: '#BF8800',
          700: '#966800',
          800: '#704D00',
          900: '#523800',
        },
        // Accent colors still available
        cobalt: {
          50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC',
          400: '#818CF8', 500: '#3B5BFF', 600: '#2342E8', 700: '#1E32C2',
          800: '#1A2899', 900: '#172278',
        },
        coral: {
          50: '#FFF1EE', 100: '#FFE0D9', 200: '#FFC2B5', 300: '#FF9C85',
          400: '#FF7A5C', 500: '#FF5A38', 600: '#E84423', 700: '#C5341A',
          800: '#9B2918', 900: '#7A2117',
        },
        emerald: {
          50: '#EAFBF4', 100: '#CFF6E3', 200: '#9EE8C5', 300: '#65D6A1',
          400: '#2FBE7A', 500: '#16A35C', 600: '#0E854A', 700: '#0B6A3D',
          800: '#0A5232', 900: '#08412A',
        },
        lavender: {
          50: '#F5F1FE', 100: '#EBE3FD', 200: '#D6C5FB', 300: '#B89FF7',
          400: '#9A77F2', 500: '#7E54E9', 600: '#6638D4', 700: '#522BAE',
          800: '#41258A', 900: '#36206E',
        },
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        sans: ['var(--font-inter-tight)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        'marquee-reverse': 'marquee-reverse 50s linear infinite',
        float: 'float 8s ease-in-out infinite',
        'beam-sweep': 'beam-sweep 6s ease-in-out infinite',
        'blob-spin': 'blob-spin 30s linear infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        'spin-slow': 'spin 30s linear infinite',
        'spin-slower': 'spin 60s linear infinite reverse',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'beam-sweep': {
          '0%, 100%': { transform: 'translateX(-100%) skewX(-12deg)', opacity: '0' },
          '50%': { transform: 'translateX(100%) skewX(-12deg)', opacity: '0.6' },
        },
        'blob-spin': {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
