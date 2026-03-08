"use client";

import { CheckCircle2, Clock, Zap } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "motion/react";

export default function PricingSection({ userId }: { userId: string | null }) {
  const freeFeatures = ["2 GB Storage limit", "Unlimited folders", "Basic file sharing", "Standard encryption"];
  const proFeatures = ["100 GB Storage limit", "Priority upload speeds", "Advanced analytics", "24/7 Priority support"];

  // 🎬 Animation: Container for staggered cards
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  // 🎬 Animation: Card popping effect
  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
  };

  return (
    <section className="relative z-10 py-32 px-6 overflow-hidden" aria-labelledby="pricing-heading">
      <div className="max-w-5xl mx-auto">
        
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 id="pricing-heading" className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            Scales with <span className="text-blue-500">You.</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto font-medium">
            Start for free, upgrade when your digital life demands more space.
          </p>
        </motion.header>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* --- BASIC PLAN --- */}
          <motion.article 
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className="flex flex-col p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors relative group"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
            <p className="text-gray-500 text-sm mb-8 font-medium">Perfect for individuals just starting out.</p>
            
            <div className="mb-10 flex items-baseline gap-1">
              <span className="text-6xl font-black text-white">$0</span>
              <span className="text-gray-500 font-mono text-sm uppercase tracking-widest">/mo</span>
            </div>

            <ul className="flex flex-col gap-5 mb-10 flex-1">
              {freeFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                  <CheckCircle2 size={18} className="text-blue-500" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link 
              href={userId ? "/dashboard" : "/sign-up"}
              className="w-full py-4 rounded-2xl font-bold text-center bg-white text-black hover:bg-gray-200 transition-all shadow-xl shadow-white/5 active:scale-95"
            >
              Get Started Free
            </Link>
          </motion.article>

          {/* --- PRO PLAN (Coming Soon) --- */}
          <motion.article 
            variants={cardVariants}
            whileHover={{ y: -5 }}
            className="flex flex-col p-10 rounded-[2.5rem] bg-gradient-to-b from-blue-600/[0.08] to-transparent border border-blue-500/20 relative overflow-hidden group"
          >
            {/* 🚀 Moving "Coming Soon" Badge */}
            <motion.div 
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute top-0 right-0 bg-blue-500/20 border-b border-l border-blue-500/30 text-blue-400 text-[10px] font-bold px-5 py-2 rounded-bl-2xl uppercase tracking-[0.2em] backdrop-blur-md flex items-center gap-2"
            >
              <Clock size={12} className="animate-spin-slow" />
              Reserved
            </motion.div>
            
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              Pro <Zap size={20} className="text-blue-400 fill-blue-400" />
            </h3>
            <p className="text-blue-200/40 text-sm mb-8 font-medium">Built for power users & creators.</p>
            
            <div className="mb-10 flex items-baseline gap-1 opacity-50">
              <span className="text-6xl font-black text-white">$9</span>
              <span className="text-gray-500 font-mono text-sm uppercase tracking-widest">/mo</span>
            </div>

            <ul className="flex flex-col gap-5 mb-10 flex-1 opacity-60">
              {proFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                  <CheckCircle2 size={18} className="text-blue-400/50" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Inactive Button with subtle pulse */}
            <motion.button 
              disabled
              animate={{ boxShadow: ["0 0 0px rgba(59,130,246,0)", "0 0 20px rgba(59,130,246,0.1)", "0 0 0px rgba(59,130,246,0)"] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-full py-4 rounded-2xl font-bold text-center bg-blue-500/10 text-blue-400/60 border border-blue-500/20 cursor-not-allowed flex items-center justify-center gap-2 transition-colors group-hover:bg-blue-500/20"
            >
              Join the Waitlist
            </motion.button>

            {/* Background Glow */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/10 blur-[80px] pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700" />
          </motion.article>

        </motion.div>
      </div>

      <style jsx>{`
        :global(.animate-spin-slow) {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}


// // components/home_components/PricingSection.tsx
// import { CheckCircle2, Clock } from "lucide-react"; // Imported Clock icon
// import Link from "next/link";

// export default function PricingSection({ userId }: { userId: string | null }) {
//   const freeFeatures = ["2 GB Storage limit", "Unlimited folders", "Basic file sharing", "Standard encryption"];
//   const proFeatures = ["100 GB Storage limit", "Priority upload speeds", "Advanced analytics", "24/7 Priority support"];

//   return (
//     <section className="relative z-10 py-24 px-6 bg-black/40 border-y border-white/5" aria-labelledby="pricing-heading">
//       <div className="max-w-5xl mx-auto">
//         <header className="text-center mb-16">
//           <h2 id="pricing-heading" className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
//             Simple, transparent pricing
//           </h2>
//           <p className="text-gray-400 text-lg max-w-xl mx-auto">
//             Start for free, upgrade when you need more space.
//           </p>
//         </header>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
//           {/* Free Plan */}
//           <article className="flex flex-col p-8 rounded-3xl bg-dark-400/30 border border-white/5 hover:border-white/10 transition-all">
//             <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
//             <p className="text-gray-400 text-sm mb-6">Perfect for personal use and getting started.</p>
//             <div className="mb-8">
//               <span className="text-5xl font-extrabold text-white">$0</span>
//               <span className="text-gray-500 font-medium">/month</span>
//             </div>
//             <ul className="flex flex-col gap-4 mb-8 flex-1" aria-label="Basic plan features">
//               {freeFeatures.map((feature, idx) => (
//                 <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
//                   <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
//                   {feature}
//                 </li>
//               ))}
//             </ul>
//             <Link 
//               href={userId ? "/dashboard" : "/sign-up"}
//               className="w-full py-4 rounded-full font-bold text-center bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/5"
//             >
//               Get Started Free
//             </Link>
//           </article>

//           {/* Pro Plan (Coming Soon) */}
//           <article className="flex flex-col p-8 rounded-3xl bg-gradient-to-b from-blue-900/10 to-dark-400/20 border border-blue-500/20 opacity-80 relative overflow-hidden grayscale-[30%] hover:grayscale-0 transition-all duration-300">
            
//             {/* 🚀 Coming Soon Badge */}
//             <div className="absolute top-0 right-0 bg-blue-500/20 border-b border-l border-blue-500/30 text-blue-400 text-xs font-bold px-4 py-2 rounded-bl-2xl uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md">
//               <Clock size={14} />
//               Coming Soon
//             </div>
            
//             <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
//             <p className="text-blue-200/50 text-sm mb-6">For power users who need maximum space and speed.</p>
//             <div className="mb-8">
//               <span className="text-5xl font-extrabold text-white opacity-50">$9</span>
//               <span className="text-gray-500 font-medium">/month</span>
//             </div>
            
//             {/* Features (Slightly dimmed to indicate inactive state) */}
//             <ul className="flex flex-col gap-4 mb-8 flex-1 opacity-70" aria-label="Pro plan features">
//               {proFeatures.map((feature, idx) => (
//                 <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
//                   <CheckCircle2 size={18} className="text-blue-400/50 shrink-0" />
//                   {feature}
//                 </li>
//               ))}
//             </ul>

//             {/* Disabled/Waitlist Button */}
//             <button 
//               disabled
//               className="w-full py-4 rounded-full font-bold text-center bg-blue-600/20 text-blue-300 border border-blue-500/20 cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               <Clock size={18} />
//               Available Soon
//             </button>
//           </article>
//         </div>
//       </div>
//     </section>
//   );
// }