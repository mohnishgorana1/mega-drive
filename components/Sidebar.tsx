"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, HardDrive, Loader2 } from "lucide-react";
import { navLinks } from "@/constants";
import NewItemAction from "./NewItemAction";
import Logo from "./Logo";
import { motion } from "motion/react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

export default function Sidebar() {
  const pathName = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 🚀 Storage States
  const { user, isLoaded } = useUser();
  const userMongoId = user?.publicMetadata?.userMongoId;
  const [storageData, setStorageData] = useState({ used: 0, limit: 524288000 }); // Default 500MB
  const [isFetchingStorage, setIsFetchingStorage] = useState(true);

  // 🕒 Timeout ref for Debouncing
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch Storage Data
  const fetchStorage = async () => {
    if (!userMongoId) return;
    setIsFetchingStorage(true);
    try {
      const res = await axios.post("/api/user/storage", {
        userId: userMongoId,
      });
      if (res.status === 200) {
        setStorageData(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch storage", error);
    } finally {
      setIsFetchingStorage(false);
    }
  };

  // Run on mount aur debounced event listener
  useEffect(() => {
    if (isLoaded && userMongoId) {
      // Pehli baar aane par turant fetch karo
      fetchStorage();

      // 🧠 DEBOUNCED LISTENER
      const handleStorageChange = () => {
        // Agar pehle se koi timer chal raha hai, toh use cancel karo
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // Naya timer set karo (1 second ka)
        // Agar 1 sec ke andar 10 events aayenge, toh purane 9 cancel ho jayenge
        timeoutRef.current = setTimeout(() => {
          fetchStorage();
        }, 1000);
      };

      window.addEventListener("drive-item-changed", handleStorageChange);

      return () => {
        window.removeEventListener("drive-item-changed", handleStorageChange);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [isLoaded, userMongoId]);

  // 🧮 Calculations
  // Ensure percentage is always between 0 and 100
  const rawPercentage = (storageData.used / storageData.limit) * 100;
  const percentage = Math.max(0, Math.min(rawPercentage, 100));

  // Math.max laga diya taaki minus mein na jaye (safety check)
  const usedMB = Math.max(0, storageData.used / (1024 * 1024)).toFixed(1);
  const limitMB = (storageData.limit / (1024 * 1024)).toFixed(0);

  // 🚦 Dynamic Color Logic
  let progressColor =
    "bg-gradient-to-r from-blue-600 to-indigo-500 shadow-blue-500/50";
  if (percentage >= 70 && percentage < 90) {
    progressColor =
      "bg-gradient-to-r from-yellow-500 to-orange-500 shadow-yellow-500/50";
  } else if (percentage >= 90) {
    progressColor =
      "bg-gradient-to-r from-red-600 to-rose-500 shadow-red-500/50";
  }

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
      <div
        className={`px-4 py-4 mb-4 transition-all duration-300 ${isCollapsed ? "px-3" : "px-4"}`}
      >
        <NewItemAction isCollapsed={isCollapsed} />
      </div>

      {/* 🚀 Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-2 remove-scrollbar">
        {navLinks.map((link: any, idx) => {
          const isActive = pathName === link.route;
          const Icon = link.icon;

          return (
            <Link
              key={idx}
              href={link.route}
              className={`relative flex items-center rounded-2xl py-3.5 transition-all duration-300 group ${
                isCollapsed ? "justify-center px-0" : "gap-4 px-5"
              } ${
                isActive ? "text-blue-500" : "text-gray-500 hover:text-gray-200"
              }`}
              title={isCollapsed ? link.label : ""}
            >
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
                    isActive
                      ? "text-blue-500 scale-110"
                      : "text-gray-500 group-hover:text-gray-300"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {!isCollapsed && (
                  <span
                    className={`text-sm font-bold tracking-tight transition-all duration-300 ${
                      isActive
                        ? "opacity-100"
                        : "opacity-70 group-hover:opacity-100"
                    }`}
                  >
                    {link.label}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* 📊 DYNAMIC STORAGE WIDGET */}
      <div
        className={`p-4 mt-auto border-t border-white/5 transition-all duration-300 ${isCollapsed ? "opacity-0 invisible h-0" : "opacity-100"}`}
      >
        <div className="flex items-center justify-between mb-2 text-gray-500">
          <div className="flex items-center gap-2">
            <HardDrive size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Cloud Pulse
            </span>
          </div>
          {isFetchingStorage && (
            <Loader2 size={12} className="animate-spin text-blue-500" />
          )}
        </div>

        {/* Progress Bar Container */}
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2 relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, type: "spring" }}
            className={`h-full shadow-[0_0_10px] rounded-full ${progressColor}`}
          />
        </div>

        {/* Storage Text */}
        <p className="text-[11px] text-gray-400 font-medium">
          <span
            className={`font-bold ${percentage > 90 ? "text-red-400" : "text-gray-200"}`}
          >
            {usedMB} MB
          </span>{" "}
          of {limitMB} MB used
        </p>
      </div>
    </aside>
  );
}
