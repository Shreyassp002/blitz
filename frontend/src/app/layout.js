import localFont from "next/font/local"

import "./globals.css"

const blancGroove = localFont({
    src: [
        {
            path: "./fonts/BlancGroove-Thin.ttf",
            weight: "100",
            style: "normal",
        },
        {
            path: "./fonts/BlancGroove-ThinItalic.ttf",
            weight: "100",
            style: "italic",
        },
        {
            path: "./fonts/BlancGroove-ExtraLight.ttf",
            weight: "200",
            style: "normal",
        },
        {
            path: "./fonts/BlancGroove-ExtraLightItalic.ttf",
            weight: "200",
            style: "italic",
        },
        {
            path: "./fonts/BlancGroove-Light.ttf",
            weight: "300",
            style: "normal",
        },
        {
            path: "./fonts/BlancGroove-LightItalic.ttf",
            weight: "300",
            style: "italic",
        },
        {
            path: "./fonts/BlancGroove-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "./fonts/BlancGroove-Italic.ttf",
            weight: "400",
            style: "italic",
        },
        {
            path: "./fonts/BlancGroove-Medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "./fonts/BlancGroove-MediumItalic.ttf",
            weight: "500",
            style: "italic",
        },
        {
            path: "./fonts/BlancGroove-SemiBold.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "./fonts/BlancGroove-SemiBoldItalic.ttf",
            weight: "600",
            style: "italic",
        },
        {
            path: "./fonts/BlancGroove-Bold.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "./fonts/BlancGroove-BoldItalic.ttf",
            weight: "700",
            style: "italic",
        },
        {
            path: "./fonts/BlancGroove-ExtraBold.ttf",
            weight: "800",
            style: "normal",
        },
        {
            path: "./fonts/BlancGroove-ExtraBoldItalic.ttf",
            weight: "800",
            style: "italic",
        },
        {
            path: "./fonts/BlancGroove-Black.ttf",
            weight: "900",
            style: "normal",
        },
        {
            path: "./fonts/BlancGroove-BlackItalic.ttf",
            weight: "900",
            style: "italic",
        },
    ],
    display: "swap",
    variable: "--font-blanc-groove",
})

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={blancGroove.variable}>
            <body className={blancGroove.className}>
                <>{children}</>
            </body>
        </html>
    )
}

