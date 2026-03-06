"use client";

import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "./ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, HardDrive } from "lucide-react";
import { navLinks } from "@/constants";
import NewItemAction from "./NewItemAction";
import Logo from "./Logo"; // <-- Import the fresh Logo

export default function MobileSideNav() {
  const pathName = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden p-2 text-gray-300 hover:text-white bg-dark-500/30 hover:bg-dark-500 rounded-xl transition-all border border-white/5">
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>

      {/* Use extreme blur for the mobile slide-out menu */}
      <SheetContent
        side="left"
        className="w-[280px] border-r border-white/10 bg-dark-100/80 backdrop-blur-3xl p-0 text-white"
      >
        <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>

        {/* Brand Logo */}
        <div className="border-b border-white/10">
            <Logo isCollapsed={false} />
        </div>

        <div className="px-4 py-4">
          <NewItemAction isCollapsed={false} />
        </div>

        <div className="flex flex-col gap-1.5 p-3 overflow-y-auto remove-scrollbar h-[calc(100vh-160px)]">
          {navLinks.map((link: any) => {
            const isActive =
              pathName === link.route || pathName.startsWith(`${link.route}/`);
            const Icon = link.icon || HardDrive;

            return (
              <SheetClose key={link.label} asChild>
                <Link
                  href={link.route}
                  className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${
                    isActive
                      ? "bg-blue-500/15 text-blue-500 font-semibold border border-blue-500/20"
                      : "text-gray-400 hover:bg-dark-400/50 hover:text-white border border-transparent"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${isActive ? "text-blue-500" : "text-gray-400"}`}
                  />
                  <span className="text-sm">{link.label}</span>
                </Link>
              </SheetClose>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}