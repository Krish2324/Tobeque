/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        'on-background': '#111111',
        primary: '#111111',
        'on-primary': '#ffffff',
        surface: '#ffffff',
        'surface-container': '#f3f4f6',
        secondary: '#6b7280',
        'outline-variant': '#e5e7eb',
        'on-primary-fixed-variant': '#374151',
        'secondary-fixed-dim': '#9ca3af',
      },
      fontFamily: {
        'body-md': ['Inter', 'sans-serif'],
        'body-lg': ['Inter', 'sans-serif'],
        'label-caps': ['Inter', 'sans-serif'],
        'headline-md': ['Playfair Display', 'serif'],
        'headline-lg': ['Playfair Display', 'serif'],
        'display-lg': ['Playfair Display', 'serif'],
      },
      fontSize: {
        'label-caps': ['0.75rem', { letterSpacing: '0.1em', fontWeight: '500' }],
        'body-md': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-lg': ['1.125rem', { lineHeight: '1.5', fontWeight: '400' }],
        'headline-md': ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'headline-lg': ['2.25rem', { lineHeight: '1.2', fontWeight: '600' }],
        'display-lg': ['4.5rem', { lineHeight: '1', fontWeight: '700' }],
        'price-lg': ['1rem', { fontWeight: '600' }],
      },
      spacing: {
        'outer-margin': '2rem',
        'section-padding-mobile': '4rem',
        'section-padding-desktop': '6rem',
        'stack-md': '2rem',
        'gutter': '1.5rem',
      }
    },
  },
  plugins: [],
};
