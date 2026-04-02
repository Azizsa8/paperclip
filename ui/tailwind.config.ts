import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0800',
        surface: '#1A1400',
        'gold-border': '#FFD700',
        'text-primary': '#F0EDE6',
        'text-secondary': '#9E9B94',
        accent: '#FFD700',
        'accent-hover': '#FFE44D',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        heading: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Courier New', 'monospace'],
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
export default config
