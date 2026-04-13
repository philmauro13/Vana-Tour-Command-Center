import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#050508',
          card: '#0c0c14',
          elevated: '#12121c',
        },
        border: '#1a1a2a',
        dim: '#6a6a8a',
        muted: '#444460',
        accent: '#d90429',
        cyan: '#00f0ff',
        success: '#00ff88',
        warning: '#ffaa00',
        purple: '#a855f7',
        pink: '#ff2d78',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        gridMove: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(60px)' },
        },
        logoPulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 20px rgba(0,240,255,0.3))' },
          '50%': { filter: 'drop-shadow(0 0 40px rgba(0,240,255,0.6))' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        statusPulse: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(0,255,136,0.4)' },
          '50%': { opacity: '0.6', boxShadow: '0 0 0 6px rgba(0,255,136,0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        gridMove: 'gridMove 20s linear infinite',
        logoPulse: 'logoPulse 3s ease-in-out infinite',
        gradientShift: 'gradientShift 4s ease-in-out infinite',
        statusPulse: 'statusPulse 2s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
        spin: 'spin 1s linear',
      },
    },
  },
  plugins: [],
};

export default config;
