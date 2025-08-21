"use client"
import { useEffect, useState } from "react"

export default function PageTransition({
    children,
    className = "",
    delay = 0,
    duration = "duration-700",
}) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 50 + delay)

        return () => clearTimeout(timer)
    }, [delay])

    return (
        <div
            className={`transition-all ${duration} ease-out ${
                isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-4 scale-95"
            } ${className}`}
            style={{
                transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    )
}
