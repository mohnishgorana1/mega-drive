"use client";

import { Cloud, Github, Twitter, Linkedin, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import Logo from "../Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#" },
        { name: "Security", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Updates", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Privacy", href: "#" },
        { name: "Terms", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Contact", href: "#" },
        { name: "Status", href: "#" },
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <footer className="relative z-10 py-16 px-6 border-t border-white/5 bg-[#0a0a0a]">
      <motion.div 
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-16">
          {/* 🚀 Brand Section */}
          <div className="col-span-2 md:col-span-2">
            <Logo />
          </div>

          {/* 🔗 Links Sections */}
          {footerLinks.map((group, idx) => (
            <div key={idx} className="col-span-1">
              <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest">{group.title}</h4>
              <ul className="space-y-4">
                {group.links.map((link, i) => (
                  <motion.li key={i} variants={itemVariants}>
                    <Link 
                      href={link.href} 
                      className="text-gray-500 hover:text-blue-400 text-sm transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 🏁 Bottom Bar */}
        <motion.div 
          variants={itemVariants}
          className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <p className="text-xs text-gray-600 font-medium">
            &copy; {currentYear} Mega Drive Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
            Made with <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" /> by Mohnish Gorana
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}

// Subtle Social Icon Component
function SocialIcon({ Icon }: { Icon: any }) {
  return (
    <Link 
      href="#" 
      className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-gray-500 hover:text-white hover:bg-white/5 hover:border-white/10 transition-all duration-300"
    >
      <Icon size={18} />
    </Link>
  );
}