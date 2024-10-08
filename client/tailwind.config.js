/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        hero: "url('/src/assets/hero.png')",
        "blur-ellipse": "url('/src/assets/ellipse.png')",
        "blur-ellipse-small": "url('/src/assets/ellipse-small.png')",

        "sunset-on-venus": "url('/src/assets/background/sunset-on-venus.png')",
        "poseidons-realm": "url('/src/assets/background/poseidons-realm.png')",
        "fragment-of-saturn":
          "url('/src/assets/background/fragment-of-saturn.png')",
        "distance-nebulae":
          "url('/src/assets/background/distance-nebulae.png')",
        "alfheim-forest": "url('/src/assets/background/alfheim-forest.png')",
        "cosmic-butterfly-original":
          "url('/src/assets/background/cosmic-butterfly-original.png')",
        "cosmic-butterfly":
          "url('/src/assets/background/cosmic-butterfly.png')",
        "cosmic-butterfly-right":
          "url('/src/assets/background/cosmic-butterfly-right.png')",
        "cosmic-butterfly-left":
          "url('/src/assets/background/cosmic-butterfly-left.png')",
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-100% 0" },
          "100%": { backgroundPosition: "100% 0" },
        },
        bounceNotify: {
          "0%, 100%": {
            transform: "translateY(0.25px)",
            opacity: "0.7",
          },
          "50%": {
            transform: "translateY(-0.75px)",
            opacity: "1",
          },
        },
        bounceDot: {
          "0%, 100%": { transform: "translateY(2.5px)" },
          "50%": { transform: "translateY(-2.5px)" },
        },
        breatheAndSlide: {
          "0%": {
            transform: "translateX(0) scale(1)",
          },
          "50%": {
            transform: "translateX(15px) scale(1.025)",
          },
          "100%": {
            transform: "translateX(0) scale(1)",
          },
        },
        slowRotate: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        smallBounce: {
          '0%, 100%': {
            transform: 'translateY(-5px)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(7px)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
      animation: {
        shimmer: "shimmer 1s infinite",
        breatheAndSlide: "breatheAndSlide 3.5s ease-in-out infinite",
        slowRotate: "slowRotate 25s ease-in-out infinite",
        bounceNotify: "bounceNotify 1.25s ease-in-out infinite",
        bounceDot0: "bounceDot 1s infinite",
        bounceDot1: "bounceDot 1s infinite 0.1s",
        bounceDot2: "bounceDot 1s infinite 0.2s",
        smallBounce: 'smallBounce 2s infinite'
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
