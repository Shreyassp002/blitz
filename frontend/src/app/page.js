import HeroSection from "@/components/Home/landing/HeroSection";
import FeaturesGrid from "@/components/Home/landing/FeaturesGrid";
import Footer from "@/components/Home/Footer";
import Background from "@/components/Home/Background";
import Header from "@/components/Home/Header";
import PageTransition from "@/components/Home/transitions/PageTransition";
import CryptoTicker from "@/components/CryptoTicker";
import { getCryptoData } from "@/lib/cryptoData";
import { Suspense } from "react";

function CryptoTickerFallback() {
  return (
    <div className="bg-gray-900 text-white py-3">
      <div className="max-w-7xl mx-auto px-6 relative overflow-hidden">
        <div className="flex items-center space-x-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-8 h-4 bg-gray-700 rounded animate-pulse"></div>
              <div className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
              <div className="w-12 h-4 bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <Background>
      <div className="min-h-screen flex flex-col">
        {/* Header skeleton */}
        <div className="fixed top-0 left-0 right-0 z-50 w-full bg-black/80 backdrop-blur-lg border-b border-white/10 shadow-lg shadow-black/20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg animate-pulse"></div>
              <span className="text-white text-xl font-bold">Blitz</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <div className="w-12 h-6 bg-gray-700 rounded animate-pulse"></div>
              <div className="w-16 h-6 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="w-32 h-10 bg-blue-500/50 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Crypto ticker skeleton */}
        <div className="pt-20">
          <CryptoTickerFallback />
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="w-64 h-12 bg-gray-700 rounded mb-4 animate-pulse mx-auto"></div>
            <div className="w-48 h-8 bg-gray-700 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    </Background>
  );
}

export default async function LandingPage() {
  const initialCryptoData = await getCryptoData();

  return (
    <Background>
      <Suspense fallback={<LoadingFallback />}>
        {/* Header - outside PageTransition to avoid transform conflicts */}
        <Header currentPage="home" />
        
        <PageTransition delay={150}>
          <div className="min-h-screen flex flex-col">
            {/* Crypto Price Ticker */}
            <div className="pt-20">
              <Suspense fallback={<CryptoTickerFallback />}>
                <CryptoTicker initialData={initialCryptoData} />
              </Suspense>
            </div>

            {/* Main content */}
            <div className="pt-4">
              <PageTransition delay={150}>
                <HeroSection />
              </PageTransition>
              <PageTransition delay={300}>
                <FeaturesGrid />
              </PageTransition>
              <PageTransition delay={450}>
                <Footer />
              </PageTransition>
            </div>
          </div>
        </PageTransition>
      </Suspense>
    </Background>
  );
}
