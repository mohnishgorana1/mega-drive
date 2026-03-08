"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const faqs = [
  {
    question: "Is my data really secure?",
    answer:
      "Yes. Your files are encrypted and stored securely using enterprise-grade cloud architecture (Cloudinary & MongoDB). Only you have access to your account via Clerk authentication.",
  },
  {
    question: "Can I access my files on mobile?",
    answer:
      "Absolutely! Mega Drive is fully responsive. You can upload, organize, and view your files seamlessly from any smartphone, tablet, or computer.",
  },
  {
    question: "What happens when I delete a file?",
    answer:
      "Deleted files are moved to the Trash, where they stay until you explicitly empty the trash. You can restore them anytime before that.",
  },
  {
    question: "Are there any file size limits?",
    answer:
      "Currently, you can upload individual files up to 10MB on the free tier to ensure smooth performance for everyone.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="relative z-10 py-32 px-6 bg-black/40 border-t border-white/5"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-3xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            <HelpCircle size={14} /> Support Center
          </div>
          <h2
            id="faq-heading"
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter"
          >
            Got{" "}
            <span className="text-blue-500 font-serif italic">Questions?</span>
          </h2>
          <p className="text-gray-500 text-lg font-medium">
            Everything you need to know about Mega Drive.
          </p>
        </motion.header>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                layout // 🚀 Magic prop: handles smooth layout shifts
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 40,
                }}
                className={`relative border transition-colors duration-500 rounded-[2rem] overflow-hidden ${
                  isOpen
                    ? "border-blue-500/30 bg-white/[0.03]"
                    : "border-white/5 bg-dark-400/20 hover:border-white/10"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex items-center justify-between w-full p-8 text-left group"
                >
                  <span
                    className={`text-lg md:text-xl font-bold transition-colors duration-300 ${isOpen ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}
                  >
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={`p-2 rounded-full transition-all duration-300 ${isOpen ? "bg-blue-500 text-white rotate-180" : "bg-white/5 text-gray-500"}`}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 25,
                        mass: 2, // Adding a bit of weight to the spring
                      }}
                    >
                      <div className="px-8 pb-8">
                        <motion.p
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{
                            delay: 0.1,
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                          }}
                          className="text-gray-400 text-base md:text-lg leading-relaxed border-t border-white/5 pt-6"
                        >
                          {faq.answer}
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Subtle Glow background for open items */}
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-blue-500/5 blur-[40px] -z-10 pointer-events-none"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// // components/home_components/FaqSection.tsx
// "use client";
// import { useState } from "react";
// import { ChevronDown } from "lucide-react";

// export default function FaqSection() {
//   const [openIndex, setOpenIndex] = useState<number | null>(0);

//   const faqs = [
//     {
//       question: "Is my data really secure?",
//       answer: "Yes. Your files are encrypted and stored securely using enterprise-grade cloud architecture (Cloudinary & MongoDB). Only you have access to your account via Clerk authentication.",
//     },
//     {
//       question: "Can I access my files on mobile?",
//       answer: "Absolutely! Mega Drive is fully responsive. You can upload, organize, and view your files seamlessly from any smartphone, tablet, or computer.",
//     },
//     {
//       question: "What happens when I delete a file?",
//       answer: "Deleted files are moved to the Trash, where they stay until you explicitly empty the trash. You can restore them anytime before that.",
//     },
//     {
//       question: "Are there any file size limits?",
//       answer: "Currently, you can upload individual files up to 10MB on the free tier to ensure smooth performance for everyone.",
//     },
//   ];

//   return (
//     <section className="relative z-10 py-24 px-6 bg-black/40 border-t border-white/5" aria-labelledby="faq-heading">
//       <div className="max-w-3xl mx-auto">
//         <header className="text-center mb-16">
//           <h2 id="faq-heading" className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
//             Frequently asked questions
//           </h2>
//           <p className="text-gray-400 text-lg">
//             Got questions? We&apos;ve got answers.
//           </p>
//         </header>

//         <div className="flex flex-col gap-4">
//           {faqs.map((faq, index) => {
//             const isOpen = openIndex === index;
//             return (
//               <div
//                 key={index}
//                 className="border border-white/5 bg-dark-400/20 rounded-2xl overflow-hidden transition-colors hover:border-white/10"
//               >
//                 <button
//                   onClick={() => setOpenIndex(isOpen ? null : index)}
//                   className="flex items-center justify-between w-full p-6 text-left"
//                 >
//                   <span className="text-white font-medium text-lg">{faq.question}</span>
//                   <ChevronDown
//                     className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
//                   />
//                 </button>
//                 <div
//                   className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
//                 >
//                   <div className="overflow-hidden">
//                     <p className="p-6 pt-0 text-gray-400 leading-relaxed">
//                       {faq.answer}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }
