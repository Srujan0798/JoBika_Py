/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#FF6B35", // Vibrant Orange
                secondary: "#004E98", // Deep Blue
                success: "#06D6A0", // Teal
                warning: "#FFB400", // Amber
                danger: "#EF476F", // Coral
                neutral: "#2E3440", // Dark Gray
                background: "#ECEFF4", // Light Gray
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },
        },
    },
    plugins: [],
}
