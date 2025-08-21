export default function Background({ children }) {
    return (
        <div className="relative min-h-screen bg-black overflow-hidden">
            {/* Multiple gradient orbs for depth */}
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-32 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/25 to-blue-400/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>

            {/* Additional smaller orbs for more depth */}
            <div className="absolute top-1/4 right-1/3 w-48 h-48 bg-gradient-to-r from-purple-300/15 to-blue-300/15 rounded-full blur-2xl animate-pulse delay-700"></div>
            <div className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-2xl animate-pulse delay-300"></div>
            <div className="absolute top-3/4 left-1/6 w-40 h-40 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-xl animate-pulse delay-1200"></div>

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    )
}
