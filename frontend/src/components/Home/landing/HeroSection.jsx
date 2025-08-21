import Link from "next/link"

export default function HeroSection() {
    return (
        <section className="flex-1 flex items-center justify-center px-6 pt-1 pb-15 min-h-screen">
            <div className="max-w-4xl mx-auto text-center">
                {/* Main Heading */}
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-10 leading-tight">
                    <span className="block">Control the Future</span>
                    <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        with QR Auctions
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed">
                    Join our revolutionary auction platform where the highest bidder controls where
                    the QR code points. Connect, bid, and take control of the digital future.{" "}
                </p>

                {/* CTA Buttons */}
                <div className="flex items-center justify-center mb-20">
                    <Link href="/auction">
                        <button className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 min-w-[200px]">
                            Start Bidding →
                        </button>
                    </Link>
                </div>

                {/* Stats or Social Proof */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                        <span className="text-sm">Live Auctions</span>
                    </div>
                    <div className="hidden sm:block w-px h-4 bg-gray-600"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Built on Stellar Network</span>
                        <svg
                            className="w-4 h-4 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    )
}
