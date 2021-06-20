module.exports = {
    mode: "jit",
    purge: [
        "./src/components/**/*.{js,ts,jsx,tsx}",
        "./src/context/**/*.{js,ts,jsx,tsx}",
        "./src/layouts/**/*.{js,ts,jsx,tsx}",
        "./src/pages/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: "class",
    theme: {
        extend: {
            borderRadius: {
                none: "0",
                xs: "0.0625rem",
                sm: "0.125rem",
                default: "0.13641467690467834rem",
                lg: "0.25rem",
                xl: "0.2874999940395355rem",
                "2xl": "0.3125rem",
                "3xl": "0.5rem",
                "4xl": "0.8184880614280701rem",
                "5xl": "1.5rem",
                "6xl": "3.410367012023926rem",
                full: "9999px"
            },
            boxShadow: {
                "shadow-level-1":
                    "0px 2px 4px 0px rgba(0,0,0,0.05), 0px 3px 9px 0px rgba(0,0,0,0.08)",
                "shadow-level-2":
                    "0px 4px 7px 0px rgba(0,0,0,0.1), 0px 8px 24px 0px rgba(0,0,0,0.15)",
                "shadow-level-3":
                    "0px 16px 32px 0px rgba(0,0,0,0.08), 0px 4px 8px 0px rgba(0,0,0,0.12)",
                "field-default": "inset 0px 1px 2px 0px rgba(0,0,0,0.15)",
                "field-error":
                    "inset 0px 1px 2px 0px rgba(0,0,0,0.15), inset 0px -2px 0px 0px rgba(217,53,53,1)",
                "button-innershadow":
                    "inset -1px -1px 0px 0px rgba(0,0,0,0.1), inset 1px -1px 0px 0px rgba(0,0,0,0.1)"
            },
            colors: {
                "danger-1": "#730004",
                "danger-2": "#A31920",
                "danger-3": "#D93535",
                "danger-4": "#EF6262",
                "danger-5": "#FFAEB2",
                dark: "#121212",
                "info-1": "#00249C",
                "info-2": "#074DB6",
                "info-3": "#307FE2",
                "info-4": "#65A5F5",
                "info-5": "#A2CFFF",
                "gray-1": "#000000",
                "gray-2": "#262626",
                "gray-3": "#4D4D4D",
                "gray-4": "#707070",
                "gray-5": "#999999",
                "gray-6": "#C4C4C4",
                "gray-7": "#E0E0E0",
                "gray-8": "#f2f2f2",
                "gray-9": "#ffffff",
                "primary-1": "#512179",
                "primary-2": "#6D42A1",
                "primary-3": "#9063CD",
                "primary-4": "#B28FE0",
                "primary-5": "#DABDFF",
                "secondary-1": "#005D58",
                "secondary-2": "#057A68",
                "secondary-3": "#00A88B",
                "secondary-4": "#5FCEBD",
                "secondary-5": "#86F0D9",
                "success-1": "#005736",
                "success-2": "#037D48",
                "success-3": "#09A854",
                "success-4": "#54C981",
                "success-5": "#8AF0B5",
                "warning-1": "#665200",
                "warning-2": "#8A7100",
                "warning-3": "#BF9F00",
                "warning-4": "#EFCA43",
                "warning-5": "#FFE26C"
            },
            fontFamily: {
                "sf-pro-text": "SF Pro Text",
                "sf-pro-display": "SF Pro Display"
            },
            fontSize: {
                "2xs": "0.5625rem",
                xs: "0.75rem",
                sm: "0.875rem",
                base: "1rem",
                lg: "10rem",
                xl: "1.0625rem",
                "2xl": "1.125rem",
                "3xl": "1.1875rem",
                "4xl": "1.3125rem",
                "5xl": "1.5rem",
                "6xl": "1.8125rem",
                "7xl": "2.3125rem",
                "8xl": "3.125rem",
                "9xl": "4.4375rem"
            },
            transformOrigin: {
                0: "0%"
            },
            zIndex: {
                "-1": "-1"
            }
        }
    },
    plugins: [
        require("@tailwindcss/forms")({
            strategy: "class"
        })
    ]
};
