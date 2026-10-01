/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "420px",
      },
      colors: {
        brand: {
          magenta: "#E6007E",
          purple: "#4B0082",
          navy: "#1A1A4E",
          "navy-deep": "#0A0A2E",
          ink: "#05050F",
          gold: "#FFD700",
          "gold-light": "#FDB813",
          pink: "#FF69B4",
          cream: "#FDF0F6",
          whatsapp: "#25D366",
        }
      },
      boxShadow: {
        glow: '0 0 15px rgba(230, 0, 126, 0.3)',
        card: '0 1px 2px rgba(26,26,78,0.06), 0 8px 24px -12px rgba(26,26,78,0.18)',
        float: '0 12px 40px -8px rgba(10,10,46,0.45)',
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-lilita)", "var(--font-jakarta)", "sans-serif"],
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
};
