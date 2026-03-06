"use client";

import { motion } from "framer-motion";

interface HeroTextProps {
    badgeText: string;
    headingPrimary: string;
    headingSecondary: string;
    description: string;
    trustIndicators: string[];
}

export default function HeroText({
    badgeText,
    headingPrimary,
    headingSecondary,
    description,
    trustIndicators,
}: HeroTextProps) {
    return (
        <div className="flex flex-col items-center text-center">

            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full 
        border border-white/20 bg-white/10 backdrop-blur-md 
        px-4 py-1.5 text-xs text-white font-medium"
            >
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                {badgeText}
            </motion.div>

            {/* Heading */}
            <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="font-bold leading-tight tracking-tight
        text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white"
            >
                {headingPrimary}
                <span className="block text-red-500 mt-2">
                    {headingSecondary}
                </span>
            </motion.h1>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mt-2 max-w-2xl text-white/90 text-sm sm:text-base md:text-lg leading-relaxed"
            >
                {description}
            </motion.p>

            {/* Trust Indicators */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-3 flex flex-wrap justify-center gap-4 sm:gap-6 text-white/90 text-xs sm:text-sm font-medium"
            >
                {trustIndicators.map((indicator, index) => (
                    <span key={index} className="flex items-center gap-1">
                        <span className="text-red-500">✓</span> {indicator}
                    </span>
                ))}
            </motion.div>

        </div>
    );
}