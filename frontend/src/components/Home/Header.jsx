"use client";
import Link from "next/link";
import WalletConnect from "@/components/WalletConnect";

import { Zap } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header({ currentPage = "home" }) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrolled = currentScrollY > 50;
      
      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Hide header when scrolling down
      } else {
        setIsVisible(true); // Show header when scrolling up
      }
      
      setScrolled(isScrolled);
      setLastScrollY(currentScrollY);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const getHeaderBackground = () => {
    return scrolled 
      ? "bg-black/80 backdrop-blur-lg border-b border-white/10" 
      : "bg-transparent";
  };

  const getHeaderShadow = () => {
    return scrolled ? "shadow-lg shadow-black/20" : "";
  };

  const getHeaderTransform = () => {
    return isVisible ? "translate-y-0" : "-translate-y-full";
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-black/80 backdrop-blur-lg border-b border-white/10 shadow-lg shadow-black/20 transition-transform duration-200 ease-out">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xl font-bold">Blitz</span>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`transition-colors font-medium ${
                currentPage === "home"
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/auction"
              className={`transition-colors font-medium ${
                currentPage === "auction"
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Auction
            </Link>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <WalletConnect />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white p-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-transform duration-200 ease-out ${getHeaderBackground()} ${getHeaderShadow()} ${getHeaderTransform()}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-xl font-bold">Blitz</span>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className={`transition-colors font-medium ${
              currentPage === "home"
                ? "text-blue-400 hover:text-blue-300"
                : "text-gray-300 hover:text-white"
            }`}
            prefetch={true}
          >
            Home
          </Link>
          <Link
            href="/auction"
            className={`transition-colors font-medium ${
              currentPage === "auction"
                ? "text-blue-400 hover:text-blue-300"
                : "text-gray-300 hover:text-white"
            }`}
            prefetch={true}
          >
            Auction
          </Link>
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center space-x-4">
          <WalletConnect />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button className="text-gray-300 hover:text-white p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
