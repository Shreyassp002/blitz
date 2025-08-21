import React, { useState, useEffect, useRef } from "react"

export default function SafeIframe({ src }) {
    const [isAllowed, setIsAllowed] = useState(null)
    const timeoutRef = useRef(null)

    useEffect(() => {
        setIsAllowed(null)
        // Check embeddability via API
        const checkEmbeddable = async () => {
            try {
                const res = await fetch("/api/checkurl", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url: src }),
                })
                const data = await res.json()
                setIsAllowed(data.embeddable)
            } catch {
                setIsAllowed(false)
            }
        }
        checkEmbeddable()
        // Fallback timeout (optional, can be removed)
        timeoutRef.current = setTimeout(() => {
            if (isAllowed === null) setIsAllowed(false)
        }, 5000)
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [src])

    const handleLoad = () => {
        setIsAllowed(true)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }

    return (
        <>
            {isAllowed === true && (
                <div
                    style={{
                        width: "100%",
                        height: "500px",
                        borderRadius: "12px",
                        // overflow: "auto",
                        margin: "10px 0",
                    }}
                >
                    <iframe
                        src={src}
                        title="Embedded content"
                        width="100%"
                        height="100%"
                        style={{
                            border: "none",
                            borderRadius: "12px",
                            display: "block",
                        }}
                        onLoad={handleLoad}
                        onError={() => setIsAllowed(false)}
                        scrolling="yes"
                    />
                </div>
            )}
            {isAllowed === false && (
                <div>
                    <p className="text-blue-500 text-center py-5">
                        Embedding this site is not allowed.{" "}
                        <a href={src} target="_blank" rel="noopener noreferrer">
                            Open in new tab
                        </a>
                    </p>
                </div>
            )}
        </>
    )
}
