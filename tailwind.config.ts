import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'pan-slow': 'pan-slow 20s ease-in-out infinite',
        'zoom-slow': 'zoom-slow 15s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
        'twinkle-delayed': 'twinkle-delayed 4s ease-in-out infinite 1s',
        'twinkle-delayed-2': 'twinkle-delayed-2 5s ease-in-out infinite 2s',
        mist: 'mist 25s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
