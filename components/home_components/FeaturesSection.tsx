// "use client";

// import React from "react";
// import { ShieldCheck, FolderSync, MousePointer2, Smartphone } from "lucide-react";
// import { motion } from "motion/react";

// // --- 🛠️ REUSABLE ANIMATED CARD ---
// const FeatureCard = ({ 
//   children, 
//   className, 
//   delay = 0 
// }: { 
//   children: React.ReactNode; 
//   className?: string; 
//   delay?: number 
// }) => (
//   <motion.article
//     initial={{ opacity: 0, y: 30, scale: 0.95 }}
//     whileInView={{ opacity: 1, y: 0, scale: 1 }}
//     viewport={{ once: true, margin: "-50px" }}
//     transition={{ 
//       duration: 0.7, 
//       delay, 
//       ease: [0.23, 1, 0.32, 1] // Apple-style quint ease
//     }}
//     whileHover={{ 
//       y: -8,
//       transition: { duration: 0.3, ease: "easeOut" }
//     }}
//     className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 p-8 transition-colors group ${className}`}
//   >
//     {children}
//     {/* Subtle Inner Glow on Hover */}
//     <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 via-blue-500/0 to-blue-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//   </motion.article>
// );

// export default function FeaturesSection() {
//   return (
//     <section className="relative z-10 py-32 px-6" aria-labelledby="features-heading">
//       <div className="max-w-7xl mx-auto">
//         <header className="text-center mb-24">
//           <motion.h2 
//             initial={{ opacity: 0, filter: "blur(10px)" }}
//             whileInView={{ opacity: 1, filter: "blur(0px)" }}
//             viewport={{ once: true }}
//             className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter"
//           >
//             Everything you <span className="text-blue-500 italic">actually</span> need.
//           </motion.h2>
//           <motion.p 
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.2 }}
//             className="text-gray-500 text-lg max-w-2xl mx-auto font-medium"
//           >
//             Mega Drive is designed to stay out of your way while giving you absolute power over your files.
//           </motion.p>
//         </header>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          
//           {/* Card 1: Large - Folders */}
//           <FeatureCard className="md:col-span-2 group hover:border-blue-500/20">
//             <motion.div 
//               animate={{ rotate: [0, 5, 0] }}
//               transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
//               className="absolute -top-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-700"
//             >
//               <FolderSync size={240} className="text-blue-400" />
//             </motion.div>
            
//             <div className="relative z-10 w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-8 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
//               <FolderSync size={28} />
//             </div>
            
//             <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">Nested Folders & Organization</h3>
//             <p className="text-gray-400 max-w-md leading-relaxed">
//               Create deep architectures. Move, copy, and duplicate items with a specialized logic that prevents recursion errors and keeps your data structured.
//             </p>
//           </FeatureCard>

//           {/* Card 2: Small - Security */}
//           <FeatureCard delay={0.1} className="hover:border-purple-500/20">
//             <div className="relative z-10 w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-8 border border-purple-500/20 group-hover:scale-110 transition-transform duration-500">
//               <ShieldCheck size={28} />
//             </div>
//             <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Bank-grade Security</h3>
//             <p className="text-gray-400 text-sm leading-relaxed">
//               Cloudinary signed uploads and Clerk auth ensure that your binary data is invisible to everyone but you.
//             </p>
//           </FeatureCard>

//           {/* Card 3: Small - Multi-select */}
//           <FeatureCard delay={0.2} className="hover:border-green-500/20">
//              <div className="relative z-10 w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 mb-8 border border-green-500/20 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500">
//               <MousePointer2 size={28} />
//             </div>
//             <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Snappy Multi-select</h3>
//             <p className="text-gray-400 text-sm leading-relaxed">
//               Perform bulk actions in milliseconds. Delete, Restore, or Move dozens of items with our optimized batch processing API.
//             </p>
//           </FeatureCard>

//           {/* Card 4: Large - Mobile */}
//           <FeatureCard delay={0.3} className="md:col-span-2 hover:border-yellow-500/20">
//              <motion.div 
//               animate={{ y: [0, 15, 0] }}
//               transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
//               className="absolute -bottom-10 -right-10 p-8 opacity-[0.03] group-hover:opacity-10 transition-all duration-700"
//             >
//               <Smartphone size={240} className="text-yellow-400" />
//             </motion.div>

//             <div className="relative z-10 w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 mb-8 border border-yellow-500/20">
//               <Smartphone size={28} />
//             </div>
//             <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">Native Mobile Experience</h3>
//             <p className="text-gray-400 max-w-md leading-relaxed">
//               No compromise on mobile. Experience fluid touch interactions, optimized layouts, and fast loading even on slow connections.
//             </p>
//           </FeatureCard>

//         </div>
//       </div>
//     </section>
//   );
// }



// "use client";

// import React, { useRef } from "react";
// import {
//   ShieldCheck,
//   FolderSync,
//   MousePointer2,
//   Smartphone,
// } from "lucide-react";
// import { motion, useScroll, useTransform, useSpring } from "motion/react";

// export default function FeaturesSection() {
//   const containerRef = useRef(null);

//   // 🌀 PARALLAX EFFECT: Jaise hi user scroll karega, cards alag-alag speed pe move honge
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start end", "end start"],
//   });

//   const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
//   const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
//   const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

//   return (
//     <section
//       ref={containerRef}
//       className="relative z-10 py-32 px-6 overflow-hidden"
//     >
//       <div className="max-w-7xl mx-auto">
//         {/* ✨ SECTION HEADER with GLITCH-IN EFFECT */}
//         <div className="mb-32 text-left md:text-center">
//           <motion.span
//             initial={{ opacity: 0, x: -20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             className="text-blue-500 font-mono text-sm tracking-widest uppercase mb-4 block"
//           >
//             {`

//              // Capability_Report_v2.0
//              `}
//           </motion.span>
//           <motion.h2
//             initial={{ opacity: 0, scale: 0.9 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter"
//           >
//             CORE <br className="md:hidden" />{" "}
//             <span className="text-outline text-transparent">ENGINE.</span>
//           </motion.h2>
//         </div>

//         {/* 🚀 THE GRAVITY GRID */}
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative min-h-[800px]">
//           {/* Card 1: The 'Folders' Giant */}
//           <motion.div
//             style={{ y: y1 }}
//             className="md:col-span-7 h-[400px] relative group"
//           >
//             <div className="absolute inset-0 bg-blue-600/20 blur-[100px] group-hover:bg-blue-600/40 transition-all duration-700 opacity-20" />
//             <div className="relative h-full w-full rounded-[3rem] bg-dark-400/10 border border-white/5 p-12 backdrop-blur-3xl overflow-hidden flex flex-col justify-end">
//               <FolderSync
//                 size={200}
//                 className="absolute -top-10 -right-10 text-white/5 group-hover:text-blue-500/20 group-hover:rotate-12 transition-all duration-700"
//               />
//               <h3 className="text-3xl font-bold mb-4">Deep Structure</h3>
//               <p className="text-gray-500 max-w-sm">
//                 Infinite nested folders. No recursion limits. Just pure
//                 organizational freedom.
//               </p>
//             </div>
//           </motion.div>

//           {/* Card 2: The 'Security' Pillar */}
//           <motion.div
//             style={{ y: y2 }}
//             className="md:col-span-5 h-[500px] md:-mt-20 group"
//           >
//             <div className="relative h-full w-full rounded-[3rem] bg-gradient-to-b from-purple-500/10 to-transparent border border-white/5 p-12 backdrop-blur-sm flex flex-col items-center justify-center text-center">
//               <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center mb-8 group-hover:scale-125 transition-transform duration-500">
//                 <ShieldCheck size={40} className="text-purple-400" />
//               </div>
//               <h3 className="text-3xl font-bold mb-4">Encrypted_IO</h3>
//               <p className="text-gray-500 text-sm">
//                 Every byte is signed and sealed. Your data, your rules.
//               </p>
//             </div>
//           </motion.div>

//           {/* Card 3: The 'Multi-select' Snappy Box */}
//           <motion.div
//             style={{ y: y3 }}
//             className="md:col-span-5 h-[350px] group"
//           >
//             <div className="relative h-full w-full rounded-[3rem] bg-dark-400/20 border border-white/10 p-10 flex flex-col justify-between hover:bg-dark-400/40 transition-all">
//               <div className="flex justify-between items-start">
//                 <MousePointer2
//                   size={32}
//                   className="text-green-400 group-hover:rotate-[-45deg] transition-transform"
//                 />
//                 <span className="text-[10px] font-mono text-gray-600 tracking-tighter">
//                   BULK_PROCESSOR_ON
//                 </span>
//               </div>
//               <div>
//                 <h3 className="text-2xl font-bold">Mass Control</h3>
//                 <p className="text-gray-500 text-sm">
//                   Select 100+ items. Drag. Drop. Done.
//                 </p>
//               </div>
//             </div>
//           </motion.div>

//           {/* Card 4: The 'Mobile' Horizontal */}
//           <motion.div
//             style={{ y: y1 }}
//             className="md:col-span-7 h-[350px] group"
//           >
//             <div className="relative h-full w-full rounded-[3rem] bg-white/[0.02] border border-white/5 p-12 overflow-hidden flex items-center">
//               <Smartphone
//                 size={300}
//                 className="absolute -right-20 text-white/[0.02] group-hover:text-yellow-500/10 transition-all"
//               />
//               <div className="relative z-10">
//                 <h3 className="text-4xl font-black italic tracking-tighter">
//                   ZERO_LAG.
//                 </h3>
//                 <p className="text-gray-500 text-lg mt-4 font-medium">
//                   Desktop power on your mobile browser.
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       <style jsx>{`
//         .text-outline {
//           -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
//         }
//       `}</style>
//     </section>
//   );
// }


"use client";

import React, { useState } from "react";
import { ShieldCheck, FolderSync, MousePointer2, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const features = [
  {
    id: "01",
    title: "Deep_Structure",
    desc: "Infinite nesting for the ultra-organized. No lag, just pure architecture.",
    icon: <FolderSync size={32} />,
    color: "#3b82f6",
  },
  {
    id: "02",
    title: "Vault_Protocol",
    desc: "Military-grade encryption layers. Your files exist in a ghost state.",
    icon: <ShieldCheck size={32} />,
    color: "#a855f7",
  },
  {
    id: "03",
    title: "Mass_Control",
    desc: "Select, move, and wipe hundreds of items with a single gesture.",
    icon: <MousePointer2 size={32} />,
    color: "#22c55e",
  },
  {
    id: "04",
    title: "Mobile_Fluid",
    desc: "The desktop engine squeezed into your pocket. Zero compromise.",
    icon: <Smartphone size={32} />,
    color: "#eab308",
  },
];

export default function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative z-10 py-32 px-6 bg-black flex flex-col items-center">
      <div className="max-w-6xl w-full">
        {/* ✨ SECTION LABEL */}
        <div className="flex items-center gap-4 mb-20 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            className="h-px bg-blue-500"
          />
          <span className="font-mono text-blue-500 tracking-[0.3em] text-xs uppercase">
            System_Capabilities_v2
          </span>
        </div>

        {/* 🚀 THE KINETIC LIST */}
        <div className="flex flex-col border-t border-white/10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative group border-b border-white/10 cursor-none sm:cursor-default py-10 flex flex-col md:flex-row md:items-center justify-between transition-all"
            >
              {/* 🌈 DYNAMIC HOVER BACKGROUND */}
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="liquid-bg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-r from-white/[0.03] to-transparent z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </AnimatePresence>

              {/* 🏷️ ID & TITLE */}
              <div className="relative z-10 flex items-center gap-8">
                <span className="font-mono text-gray-600 text-lg">{feature.id}</span>
                <motion.h3 
                  animate={{ 
                    x: hoveredIndex === index ? 20 : 0,
                    color: hoveredIndex === index ? "#fff" : "#4b5563"
                  }}
                  className="text-4xl md:text-6xl font-black tracking-tighter transition-colors"
                >
                  {feature.title.toUpperCase()}
                </motion.h3>
              </div>

              {/* 📱 INTERACTIVE CONTENT REVEAL */}
              <div className="relative z-10 mt-6 md:mt-0 flex items-center gap-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: hoveredIndex === index ? 1 : 0,
                    scale: hoveredIndex === index ? 1 : 0.5,
                    rotate: hoveredIndex === index ? 0 : -45
                  }}
                  style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                  className="hidden md:flex w-20 h-20 rounded-2xl items-center justify-center border border-current transition-all"
                >
                  {feature.icon}
                </motion.div>

                <motion.p 
                  animate={{ 
                    opacity: hoveredIndex === index ? 1 : 0,
                    x: hoveredIndex === index ? 0 : 20
                  }}
                  className="max-w-xs text-gray-400 text-sm md:text-base font-medium leading-relaxed"
                >
                  {feature.desc}
                </motion.p>
              </div>

              {/* 🎈 FLOATING ORB (FOLLOWS CURSOR FEEL) */}
              {hoveredIndex === index && (
                <motion.div
                  layoutId="cursor-orb"
                  className="absolute right-10 top-1/2 -translate-y-1/2 w-32 h-32 blur-[60px] rounded-full pointer-events-none"
                  style={{ backgroundColor: feature.color, opacity: 0.15 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🧩 CSS FOR TEXT OUTLINE & SPECIAL CURSOR IF NEEDED */}
      <style jsx>{`
        section {
          background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.02) 1px, transparent 0);
          background-size: 40px 40px;
        }
      `}</style>
    </section>
  );
}