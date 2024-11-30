// /** @type {import('tailwindcss').Config} */
// export default {
//     content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//     theme: {
//         extend: {
//             screens: {
//                 xs: "480px",
//             },
//             fontFamily: {
//                 sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
//               },
//         },
//     },
//     plugins: [require("daisyui")],
//     daisyui: {
//         themes: ["light"],
//     },
// };

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontSize: {
                small: ['0.8rem', { lineHeight: '1.2' }],
                base: ['1rem', { lineHeight: '1.5' }],
                large: ['1.2rem', { lineHeight: '1.75' }],
                xlarge: ['1.5rem', { lineHeight: '2' }],
            },
            screens: {
                xs: "480px",
            },
            fontFamily: {
                sans: ['Mulish', 'Manrope', 'Asap', 'PT Sans', 'DM Sans', 'sans-serif'], // Adding more professional sans-serif options
              },
        },
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: ["light", "mytheme"], // You can extend this with your custom themes
    },
};
