/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'fr24-dark': '#1a1a1a',
                'fr24-charcoal': '#2b2b2b',
                'fr24-yellow': '#ffcc00',
                'fr24-blue': '#3b82f6',
            },
        },
    },
    plugins: [],
}
