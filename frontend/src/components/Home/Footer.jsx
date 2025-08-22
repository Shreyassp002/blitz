"use client"
import { Github, Twitter } from "lucide-react"

export default function Footer() {
    const currentYear = new Date().getFullYear()

    const socialLinks = [
        {
            name: "GitHub",
            url: "https://github.com/Shreyassp002/blitz",
            icon: Github,
            hoverColor: "hover:text-gray-300",
        },
        {
            name: "Twitter",
            url: "https://x.com/Darkreyyy",
            icon: Twitter,
            hoverColor: "hover:text-blue-400",
        },
    ]

    return (
        <footer className="relative border-t border-gray-700/30 bg-black/30 backdrop-blur-md mt-auto">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-pink-900/10 pointer-events-none"></div>

            <div className="relative max-w-6xl mx-auto px-4 py-3">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Copyright */}
                    <div className="text-sm text-gray-500">
                        <span>© {currentYear} Blitz</span>
                    </div>

                    {/* Built on Ethereum */}
                    <div className="text-sm text-gray-400 font-medium">
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Built on Stellar Network
                        </span>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-2">
                        {socialLinks.map((social) => {
                            const IconComponent = social.icon
                            return (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`relative z-10 inline-flex items-center justify-center w-8 h-8 bg-gray-800/60 rounded-md border border-gray-700/40 text-gray-400 ${social.hoverColor} transition-all duration-200 hover:scale-110 hover:bg-gray-700/60 hover:border-gray-600/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                                    aria-label={`Visit ${social.name}`}
                                >
                                    <IconComponent className="w-4 h-4" />
                                </a>
                            )
                        })}
                    </div>
                </div>

                {/* Background Decorations */}
                <div className="absolute top-2 right-12 w-20 h-20 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-2 left-12 w-16 h-16 bg-gradient-to-r from-pink-500/5 to-red-500/5 rounded-full blur-xl pointer-events-none"></div>
            </div>
        </footer>
    )
}
