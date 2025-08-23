"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.3,
        duration: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.0,
        ease: "backOut",
        delay: 0.2,
      },
    },
    hover: {
      scale: 1.08,
      boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.4)",
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.92,
      transition: { duration: 0.2 },
    },
  };

  const gradientTextVariants = {
    hidden: { opacity: 0, backgroundPosition: "0% 50%" },
    visible: {
      opacity: 1,
      backgroundPosition: "100% 50%",
      transition: {
        duration: 2.0,
        ease: "easeInOut",
        delay: 0.5,
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.0,
        delay: 1.5,
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.3, 1],
      opacity: [1, 0.6, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="flex-1 flex items-center justify-center px-6 pt-1 pb-15 min-h-screen">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-white mb-10 leading-tight"
          variants={itemVariants}
        >
          <motion.span
            className="block"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.5,
              ease: "easeOut",
            }}
          >
            Control the Future
          </motion.span>
          <motion.span
            className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto]"
            variants={gradientTextVariants}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              transition: {
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            with QR Auctions
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed"
          variants={itemVariants}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.0,
            delay: 1.0,
            ease: "easeOut",
          }}
        >
          Join our revolutionary auction platform where the highest bidder
          controls where the QR code points. Connect, bid, and take control of
          the digital future.
        </motion.p>

        <motion.div
          className="flex items-center justify-center mb-20"
          variants={itemVariants}
        >
          <Link href="/auction">
            <motion.button
              className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 min-w-[200px] relative overflow-hidden"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial="hidden"
              animate="visible"
            >
              <motion.span
                className="relative z-10"
                initial={{ x: 0 }}
                whileHover={{
                  x: 8,
                  transition: { duration: 0.4 },
                }}
              >
                Start Bidding →
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0"
                whileHover={{
                  opacity: 1,
                  transition: { duration: 0.4 },
                }}
              />
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400"
          variants={statsVariants}
        >
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1.0,
              delay: 2.0,
              ease: "easeOut",
            }}
          >
            <motion.div
              className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
              variants={pulseVariants}
              animate="animate"
            />
            <span className="text-sm">Live Auctions</span>
          </motion.div>

          <motion.div
            className="hidden sm:block w-px h-4 bg-gray-600"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{
              duration: 0.8,
              delay: 2.2,
              ease: "easeOut",
            }}
          />

          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1.0,
              delay: 2.1,
              ease: "easeOut",
            }}
          >
            <span className="text-sm">Built on Stellar Network</span>
            <motion.svg
              className="w-4 h-4 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.8,
                delay: 2.5,
                type: "spring",
                stiffness: 150,
                damping: 12,
              }}
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </motion.svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
