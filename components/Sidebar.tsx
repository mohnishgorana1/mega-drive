"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, HardDrive } from "lucide-react"; 
import { navLinks } from "@/constants";
import NewItemAction from "./NewItemAction";
import Logo from "./Logo";

export default function Sidebar() {
  const pathName = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`glass-sidebar hidden md:flex flex-col transition-all duration-300 relative z-50 ${
        isCollapsed ? "w-24" : "w-64" // Adjusted w-28 to w-24 for a tighter collapsed look
      }`}
    >
      {/* Collapse Toggle Button - Glass style */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-16 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-dark-400 border border-white/10 text-gray-300 hover:text-white hover:bg-blue-500 transition-all shadow-md"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand Logo */}
      <Logo isCollapsed={isCollapsed} />

      {/* Primary Action Button ("New") */}
      <div
        className={`px-4 py-4 transition-all duration-300 ${isCollapsed && "px-2"}`}
      >
        <NewItemAction isCollapsed={isCollapsed} />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 remove-scrollbar">
        {navLinks.map((link: any, idx) => {
          const isActive =
            pathName === link.route || pathName.startsWith(`${link.route}/`);
          const Icon = link?.icon || HardDrive;

          return (
            <Link
              key={idx}
              href={link.route}
              className={`flex items-center rounded-2xl py-3 transition-all group ${
                isCollapsed ? "justify-center px-0" : "gap-3 px-4"
              } ${
                isActive
                  ? "bg-blue-500/15 text-blue-500 font-semibold shadow-inner border border-blue-500/20"
                  : "text-gray-400 hover:bg-dark-400/50 hover:text-white border border-transparent"
              }`}
              title={isCollapsed ? link.label : ""} 
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition-colors ${isActive ? "text-blue-500" : "text-gray-400 group-hover:text-white"}`}
              />

              {!isCollapsed && (
                <span className="text-sm overflow-hidden whitespace-nowrap transition-all duration-300">
                  {link.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}