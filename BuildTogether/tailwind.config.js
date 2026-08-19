/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#090A0F',
        card: '#12141C',
        'card-hover': '#171A24',
        border: '#1F2433',
        'border-subtle': '#181D2A',
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          light: '#818CF8',
          glow: 'rgba(99, 102, 241, 0.15)',
        },
        accent: {
          blue: '#38BDF8',
          cyan: '#22D3EE',
          emerald: '#34D399',
          amber: '#FBBF24',
          purple: '#A855F7',
          rose: '#FB7185',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(99, 102, 241, 0.3)',
        'glow-emerald': '0 0 25px -5px rgba(52, 211, 153, 0.3)',
        'glow-amber': '0 0 25px -5px rgba(251, 191, 36, 0.3)',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
