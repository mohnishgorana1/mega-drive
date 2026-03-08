"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, HardDrive } from "lucide-react"; 
import { navLinks } from "@/constants";
import NewItemAction from "./NewItemAction";
import Logo from "./Logo";
import { motion } from "motion/react";

export default function Sidebar() {
  const pathName = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`glass-sidebar hidden md:flex flex-col transition-all duration-500 relative z-50 border-r border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl ${
        isCollapsed ? "w-24" : "w-64"
      }`}
    >
      {/* 🛠️ Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 z-50 flex h-7 w-7 items-center justify-center rounded-full bg-dark-400 border border-white/10 text-gray-400 hover:text-white hover:bg-blue-600 transition-all shadow-xl shadow-black/50 group"
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ChevronLeft size={16} />
        </motion.div>
      </button>

      {/* Brand Logo Section */}
      <div className="p-6">
        <Logo isCollapsed={isCollapsed} />
      </div>

      {/* Primary Action Button ("New") */}
      <div className={`px-4 py-4 mb-4 transition-all duration-300 ${isCollapsed ? "px-3" : "px-4"}`}>
        <NewItemAction isCollapsed={isCollapsed} />
      </div>

      {/* 🚀 Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-2 remove-scrollbar">
        {navLinks.map((link: any, idx) => {
          // Check if active: includes sub-paths for dashboard
          const isActive = pathName === link.route;
          const Icon = link.icon;

          return (
            <Link
              key={idx}
              href={link.route}
              className={`relative flex items-center rounded-2xl py-3.5 transition-all duration-300 group ${
                isCollapsed ? "justify-center px-0" : "gap-4 px-5"
              } ${
                isActive
                  ? "text-blue-500"
                  : "text-gray-500 hover:text-gray-200"
              }`}
              title={isCollapsed ? link.label : ""}
            >
              {/* 🔵 Active Background Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-blue-500/10 border border-blue-500/20 rounded-2xl z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-4">
                <Icon
                  className={`h-5 w-5 shrink-0 transition-all duration-300 ${
                    isActive ? "text-blue-500 scale-110" : "text-gray-500 group-hover:text-gray-300"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />

                {!isCollapsed && (
                  <span className={`text-sm font-bold tracking-tight transition-all duration-300 ${
                    isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                  }`}>
                    {link.label}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* 📊 MINI STORAGE WIDGET (Optional Bottom Section) */}
      <div className={`p-4 mt-auto border-t border-white/5 transition-all duration-300 ${isCollapsed ? "opacity-0 invisible h-0" : "opacity-100"}`}>
        <div className="flex items-center gap-2 mb-2 text-gray-500">
           <HardDrive size={14} />
           <span className="text-[10px] font-black uppercase tracking-widest">Cloud Pulse</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: "35%" }} // Baad mein isse dynamic storage se connect karenge
             className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
           />
        </div>
        <p className="text-[10px] text-gray-600 font-bold">175MB / 500MB</p>
      </div>
    </aside>
  );
}