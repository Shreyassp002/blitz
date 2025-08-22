// src/app/api/crypto/route.js
import { getCryptoData } from "@/lib/cryptoData"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const cryptoData = await getCryptoData()
        return NextResponse.json(cryptoData)
    } catch (error) {
        console.error("Error in crypto API route:", error)
        return NextResponse.json({ error: "Failed to fetch crypto data" }, { status: 500 })
    }
}
