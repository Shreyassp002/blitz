import Link from "next/link";

export default function FeaturesGrid() {
  const features = [
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Real-Time Bidding",
      description:
        "Experience lightning-fast bidding with instant updates and seamless blockchain integration.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="currentColor"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14.25 1.5h-2.12c-.35 0-.62.28-.62.62s.28.62.62.62h2.12v2.52c0 .35.28.62.62.62s.62-.28.62-.62V2.75c0-.69-.56-1.25-1.25-1.25zM1.12 5.89c.35 0 .62-.28.62-.62V2.75h2.15c.35 0 .62-.28.62-.62s-.28-.62-.62-.62H1.75C1.06 1.51.5 2.07.5 2.76v2.52c0 .35.28.62.62.62zm2.77 7.36H1.75v-2.52c0-.35-.28-.62-.62-.62s-.62.28-.62.62v2.52c0 .69.56 1.25 1.25 1.25h2.13c.35 0 .62-.28.62-.62s-.28-.62-.62-.62zm10.99-3.14c-.35 0-.62.28-.62.62v2.52h-2.12c-.35 0-.62.28-.62.62s.28.62.62.62h2.12c.69 0 1.25-.56 1.25-1.25v-2.52c0-.35-.28-.62-.62-.62z" />
          <path d="M6.12 3.55H4.03c-.69 0-1.25.56-1.25 1.25v1.54c0 .69.56 1.25 1.25 1.25h2.09c.69 0 1.25-.56 1.25-1.25V4.8c0-.69-.56-1.25-1.25-1.25zm0 2.79H4.03V4.8h2.09v1.54zm7.1 4.86V9.66c0-.69-.56-1.25-1.25-1.25H9.88c-.69 0-1.25.56-1.25 1.25v1.54c0 .69.56 1.25 1.25 1.25h2.09c.69 0 1.25-.56 1.25-1.25zM9.88 9.66h2.09v1.54H9.88V9.66zM8.63 5.85h2.52V7.1H8.63zm0-1.8h4.59V5.3H8.63zM4.85 8.9h2.52v1.25H4.85zm-2.07 1.8h4.59v1.25H2.78z" />
        </svg>
      ),
      title: "QR Code Control",
      description:
        "Winners gain complete control over QR code destinations, creating unique digital experiences.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: "Secure Wallet Integration",
      description:
        "Connect safely with leading wallet providers through our smart contract system.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
      title: "Transparent Auctions",
      description:
        "Every bid is recorded on the blockchain, ensuring complete transparency and fairness for all participants.",
    },
    {
      icon: (
        <svg
          className="w-11 h-11"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
      title: "Instant Settlements",
      description:
        "Automated smart contracts ensure immediate and secure settlement of winning bids without delays.",
    },
    {
      icon: (
        <svg
          className="w-7 h-7 "
          fill="currentColor"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <title>Stellar icon</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12.283 1.851A10.154 10.154 0 001.846 12.002c0 .259.01.516.03.773A1.847 1.847 0 01.872 14.56L0 15.005v2.074l2.568-1.309.832-.424.82-.417 14.71-7.496 1.653-.842L24 4.85V2.776l-3.387 1.728-2.89 1.473-13.955 7.108a8.376 8.376 0 01-.07-1.086 8.313 8.313 0 0112.366-7.247l1.654-.843.247-.126a10.154 10.154 0 00-5.682-1.932zM24 6.925L5.055 16.571l-1.653.844L0 19.15v2.072L3.378 19.5l2.89-1.473 13.97-7.117a8.474 8.474 0 01.07 1.092A8.313 8.313 0 017.93 19.248l-.101.054-1.793.914a10.154 10.154 0 0016.119-8.214c0-.26-.01-.522-.03-.78a1.848 1.848 0 011.003-1.785L24 8.992Z"
          />
        </svg>
      ),
      title: "Powered by Stellar",
      description:
        "Built on the Stellar blockchain for fast, secure, and low-cost transactions across the globe.",
    },
  ];

  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              QR Auction
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of digital auctions with cutting-edge
            blockchain technology and user-centric design.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 group hover:border-transparent transition-all duration-500 overflow-hidden"
            >
              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20 blur-sm"></div>
                <div className="absolute inset-[1px] rounded-2xl bg-gray-900/80 backdrop-blur-sm"></div>
              </div>

              {/* Animated dots border */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-blue-400/40 animate-pulse"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:text-purple-400 transition-colors duration-300 group-hover:shadow-lg group-hover:shadow-purple-400/25">
                    {feature.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>

              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-300 mb-6">
            Ready to experience the future of digital auctions?
          </p>
          <Link href="/auction">
            <button className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25">
              Get Started Today
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
