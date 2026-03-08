"use client";

import React from "react";
import { Star } from "lucide-react";
import { motion } from "motion/react";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Freelance Designer",
    content:
      "Mega Drive has completely changed how I share assets with my clients. The nested folders save me hours every week.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Software Engineer",
    content:
      "I love the clean, dark UI. It feels like a native Mac app. Incredibly responsive and built with modern tech.",
    rating: 5,
  },
  {
    name: "Amit Singh",
    role: "Student",
    content:
      "The free 2GB tier is perfect for my college projects. Managing files is so much easier than other drives.",
    rating: 5,
  },
  // Duplicate items for seamless infinite scroll
  {
    name: "Rahul Sharma",
    role: "Freelance Designer",
    content:
      "Mega Drive has completely changed how I share assets with my clients. The nested folders save me hours every week.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Software Engineer",
    content:
      "I love the clean, dark UI. It feels like a native Mac app. Incredibly responsive and built with modern tech.",
    rating: 5,
  },
];

export default function TestimonialSection() {
  return (
    <section
      className="relative z-10 py-32 bg-[#0a0a0a] overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter"
        >
          Trusted by <span className="text-blue-500">Creative Minds.</span>
        </motion.h2>
        <p className="text-gray-500 text-lg max-w-xl mx-auto font-medium">
          Join a growing community of users who have simplified their digital
          life.
        </p>
      </div>

      {/* 🚀 INFINITE MARQUEE CONTAINER */}
      <div className="flex relative items-center overflow-hidden">
        {/* Left & Right Fades (Glass effect on edges) */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-[#0a0a0a] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-[#0a0a0a] to-transparent z-20 pointer-events-none" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }} // Move halfway (since we duplicated items)
          transition={{
            repeat: Infinity,
            duration: 20, // Animation speed
            ease: "linear",
          }}
          className="flex gap-6 whitespace-nowrap"
          style={{ width: "max-content" }}
          // ⏸️ Pause on Hover logic
          whileHover={{ transition: { duration: 60 } }} // Slows down significantly on hover
        >
          {testimonials.map((testial, idx) => (
            <article
              key={idx}
              className="w-[350px] md:w-[450px] shrink-0 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm flex flex-col hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>
              <p className="text-gray-300 mb-8 text-base md:text-lg leading-relaxed whitespace-normal italic">
                {`
                  "${testial.content}"
                `}
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">
                  {testial.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <h4 className="text-white font-bold text-sm tracking-tight">
                    {testial.name}
                  </h4>
                  <p className="text-gray-500 text-xs font-mono tracking-tighter uppercase">
                    {testial.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      </div>

      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/5 blur-[120px] pointer-events-none" />
    </section>
  );
}

// // components/home_components/TestimonialSection.tsx
// import { Star } from "lucide-react";

// export default function TestimonialSection() {
//   const testimonials = [
//     {
//       name: "Rahul Sharma",
//       role: "Freelance Designer",
//       content: "Mega Drive has completely changed how I share assets with my clients. The nested folders and fast upload speeds save me hours every week.",
//       rating: 5,
//     },
//     {
//       name: "Priya Patel",
//       role: "Software Engineer",
//       content: "I love the clean, dark UI. It feels like a native Mac app. The fact that it's built with modern web tech makes it incredibly responsive.",
//       rating: 5,
//     },
//     {
//       name: "Amit Singh",
//       role: "Student",
//       content: "The free 2GB tier is perfect for my college projects. Finding and managing files is so much easier than other clunky cloud drives.",
//       rating: 5,
//     },
//   ];

//   return (
//     <section className="relative z-10 py-24 px-6 bg-[#0a0a0a]" aria-labelledby="testimonials-heading">
//       <div className="max-w-7xl mx-auto">
//         <header className="text-center mb-16">
//           <h2 id="testimonials-heading" className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
//             Loved by people like you
//           </h2>
//           <p className="text-gray-400 text-lg max-w-xl mx-auto">
//             Don&apos;t just take our word for it. See what our users have to say about Mega Drive.
//           </p>
//         </header>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {testimonials.map((testial, idx) => (
//             <article key={idx} className="flex flex-col p-8 rounded-3xl bg-dark-400/20 border border-white/5 hover:border-white/10 transition-colors">
//               <div className="flex items-center gap-1 mb-6">
//                 {[...Array(testial.rating)].map((_, i) => (
//                   <Star key={i} size={18} className="text-yellow-500 fill-yellow-500" />
//                 ))}
//               </div>
//               <p className="text-gray-300 mb-8 flex-1 italic">{testial.content}</p>
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-inner">
//                   {testial.name.charAt(0)}
//                 </div>
//                 <div>
//                   <h4 className="text-white font-semibold text-sm">{testial.name}</h4>
//                   <p className="text-gray-500 text-xs">{testial.role}</p>
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
