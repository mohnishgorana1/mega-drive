"use client";

import React, { useRef, useState } from "react";
import { CloudUpload, FolderTree, Globe } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

// --- 🛠️ 3D TILT CARD COMPONENT ---
const TiltCard = ({ step, index }: { step: any; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse positions for spotlight and tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for tilt
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;

    mouseX.set(mouseXFromCenter / width);
    mouseY.set(mouseYFromCenter / height);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative group h-full flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-dark-400/10 border border-white/5 backdrop-blur-sm cursor-none sm:cursor-default"
    >
      {/* 🔦 INTERACTIVE SPOTLIGHT GLOW */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
          // Adjusting coordinates for the CSS radial gradient based on motion values
        }}
      />

      {/* 🚀 ICON WITH FLOATING ANIMATION */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: index * 0.5 }}
        style={{ transform: "translateZ(50px)" }} // Pop the icon out in 3D space
        className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/10"
      >
        {React.cloneElement(step.icon as React.ReactElement, { size: 40 })}
      </motion.div>

      {/* TEXT CONTENT */}
      <div style={{ transform: "translateZ(30px)" }}>
        <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
          {step.title}
        </h3>
        <p className="text-gray-400 leading-relaxed text-sm">
          {step.description}
        </p>
      </div>

      {/* DECORATIVE CORNER GRADIENT */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] -z-10 group-hover:bg-blue-500/10 transition-colors" />
    </motion.article>
  );
};

// --- 🌐 MAIN SECTION COMPONENT ---
export default function HowItWorksSection() {
  const steps = [
    {
      icon: <CloudUpload className="text-blue-400" />,
      title: "1. Upload Instantly",
      description: "Drag and drop your files into a secure, end-to-end encrypted environment in milliseconds.",
    },
    {
      icon: <FolderTree className="text-purple-400" />,
      title: "2. Smart Organization",
      description: "Our intelligent file system helps you nest folders and manage bulk items with lightning speed.",
    },
    {
      icon: <Globe className="text-green-400" />,
      title: "3. Global Access",
      description: "Your digital life, synced everywhere. Access your data from any device, anywhere on the planet.",
    },
  ];

  return (
    <section className="relative z-10 py-32 px-6 bg-[#0a0a0a] overflow-hidden" aria-labelledby="how-it-works-heading">
      {/* 🌌 AMBIENT BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <header className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6"
          >
            Seamless Flow
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter"
          >
            Designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Speed.</span>
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="text-gray-500 text-lg max-w-2xl mx-auto font-medium"
          >
            Stop fighting with clunky interfaces. Mega Drive works at the speed of thought.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <TiltCard key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}