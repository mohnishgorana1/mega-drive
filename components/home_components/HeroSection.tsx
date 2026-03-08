"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface HeroSectionProps {
  userId: string | null;
}

export default function HeroSection({ userId }: HeroSectionProps) {
  // 🎬 ANIMATION VARIANTS (Parent container ke liye)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Har element me 0.2s ka gap
        delayChildren: 0.1, // Start hone se pehle thoda delay
      },
    },
  };

  // 🎬 ANIMATION VARIANTS (Individual items ke liye)
  const itemVariants = {
    hidden: { opacity: 0, y: 30 }, // Niche aur transparent
    visible: {
      opacity: 1,
      y: 0, // Apni original position pe aayega
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }, // Smooth Apple-like ease
    },
  };

  return (
    <section
      className="relative z-10 pt-8 pb-20 px-6"
      aria-label="Introduction"
    >
      {/* 🚀 Wrapper element */}
      <motion.div
        className="max-w-5xl mx-auto text-center flex flex-col items-center mt-10 md:mt-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Sparkle Badge */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 hover:bg-blue-500/20 transition-colors cursor-default">
            <SparklesIcon /> Introducing the all-new architecture
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]"
        >
          Store everything.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
            Compromise nothing.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12"
        >
          A secure, lightning-fast, and beautiful cloud storage solution built
          for modern teams and individuals. Keep your files safe and accessible
          from anywhere.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link
            href={userId ? "/dashboard" : "/sign-up"}
            className="group flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-blue-500/25 w-full sm:w-auto text-lg hover:shadow-blue-500/40 hover:-translate-y-1"
          >
            {userId ? "Open Dashboard" : "Start for free"}
            <ArrowRight
              className="group-hover:translate-x-1 transition-transform"
              size={20}
            />
          </Link>

          {!userId && (
            <Link
              href="/sign-in"
              className="flex items-center justify-center bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold transition-all border border-white/10 w-full sm:w-auto text-lg backdrop-blur-md hover:-translate-y-1"
            >
              Sign In
            </Link>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

// Sparkle SVG Component
function SparklesIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1-1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
