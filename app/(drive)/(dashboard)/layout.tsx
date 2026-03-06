import React, { ReactNode } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function DriveLayout({ children }: { children: ReactNode }) {
  return (
    // bg-dark-100 creates the deep OLED black background
    <div className="flex h-screen w-full overflow-hidden bg-dark-100 text-white relative">
      
      {/* Optional: Add a subtle glowing orb in the background to make the glassmorphism pop */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      {/* Sidebar now manages its own width and hide/show logic! */}
      <Sidebar />

      {/* Main right column: Header top, Content bottom */}
      <div className="flex flex-1 flex-col min-w-0 z-10 relative">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 remove-scrollbar">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}