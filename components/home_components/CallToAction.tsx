"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function CallToActionSection({ userId }: { userId: string | null }) {
  return (
    <section className="relative z-10 py-32 px-6 overflow-hidden" aria-label="Call to action">
      
      {/* 🌌 DYNAMIC BACKGROUND GLOW (Breathing Effect) */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1] 
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] max-w-4xl h-full bg-blue-600/30 blur-[120px] rounded-full pointer-events-none" 
        aria-hidden="true" 
      />
      
      {/* 🚀 MAIN CTA CARD */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 20,
          delay: 0.2 
        }}
        className="max-w-4xl mx-auto text-center relative z-10 p-10 md:p-20 rounded-[3rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden group"
      >
        {/* Subtle decorative particles (Animated) */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 text-blue-500/30"
        >
          <Sparkles size={40} />
        </motion.div>

        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-none">
          Ready to take control of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 italic">
            your digital life?
          </span>
        </h2>
        
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          Join thousands of users who trust Mega Drive for their daily storage needs. 
          Sign up today and get 2GB of storage completely free.
        </p>

        {/* 🖱️ SPRINGY BUTTON */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link 
            href={userId ? "/dashboard" : "/sign-up"} 
            className="group relative inline-flex items-center justify-center gap-3 bg-white text-black hover:bg-blue-50 px-10 py-5 rounded-full font-black transition-colors text-xl shadow-2xl shadow-white/10"
          >
            {userId ? "Go to Dashboard" : "Start your journey"}
            <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
            
            {/* Button Outer Glow */}
            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </motion.div>

        {/* Floating background shape for extra depth */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
      </motion.div>
    </section>
  );
}


// // components/home_components/CallToActionSection.tsx
// import Link from "next/link";
// import { ArrowRight } from "lucide-react";

// export default function CallToActionSection({ userId }: { userId: string | null }) {
//   return (
//     <section className="relative z-10 py-24 px-6 overflow-hidden" aria-label="Call to action">
//       {/* Glowing background specific to CTA */}
//       <div className="absolute inset-0 bg-blue-600/5" aria-hidden="true" />
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-3xl h-full bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />
      
//       <div className="max-w-4xl mx-auto text-center relative z-10 p-10 md:p-16 rounded-3xl bg-dark-400/40 border border-white/10 backdrop-blur-xl shadow-2xl">
//         <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
//           Ready to take control of your files?
//         </h2>
//         <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
//           Join thousands of users who trust Mega Drive for their daily storage needs. Sign up today and get 2GB of storage completely free.
//         </p>
//         <Link 
//           href={userId ? "/dashboard" : "/sign-up"} 
//           className="group inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-bold transition-all text-lg shadow-xl shadow-white/10"
//         >
//           {userId ? "Go to Dashboard" : "Create your free account"}
//           <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
//         </Link>
//       </div>
//     </section>
//   );
// }