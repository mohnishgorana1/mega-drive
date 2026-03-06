import Link from "next/link";
import { Boxes } from "lucide-react"; // This represents layered data/structure

interface LogoProps {
  isCollapsed?: boolean;
}

export default function Logo({ isCollapsed = false }: LogoProps) {
  return (
    <div
      className={`flex h-16 shrink-0 items-center transition-all duration-300 ${
        isCollapsed ? "justify-center px-2" : "px-6"
      }`}
    >
      <Link
        href="/"
        className="flex items-center gap-x-3 overflow-hidden whitespace-nowrap group px-2"
      >
        {/* 🚀 New, Animation-Free Abstract Storage Logo */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 
        shadow-blue-500/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/50">
          <Boxes className="h-5 w-5 text-white mx-1.5" strokeWidth={2.5} />
        </div>

        {/* --- Text Display for "MDrive" --- */}
        {!isCollapsed && (
          <div className="flex flex-col">
            {/* MDrive Brand Text */}
            <span className="font-extrabold text-2xl tracking-tighter bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
              M<span className="text-white">Drive</span>
            </span>
            {/* Subtitle */}
            <span className="text-[9px] -mt-1 font-medium text-blue-300 tracking-[1.5px] uppercase opacity-70">
              Cloud Storage
            </span>
          </div>
        )}
      </Link>
    </div>
  );
}