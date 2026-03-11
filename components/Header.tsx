"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { IoSearch } from "react-icons/io5";
import MobileSideNav from "./MobileSideNav";
import { useDebounce } from "@/hooks/useDebounce";
import axios from "axios";
import { FileIcon, Folder, Loader2 } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 👈 NAYA IMPORT
import Logo from "./Logo"; // 👈 NAYA IMPORT (Aapka logo component)

export default function Header() {
  const { user } = useUser();
  const userMongoId = user?.publicMetadata?.userMongoId as string | undefined;
  const pathname = usePathname(); // Get current URL

  const isHomePage = pathname === "/";
  // Check if we are on a share page
  const isSharePage = pathname.startsWith("/share");
  // Search bar sirf dashboard routes pe dikhe
  const showSearch = pathname.startsWith("/dashboard");

  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedKeyword = useDebounce(searchKeyword, 300);
  const [results, setResults] = useState<{ folders: any[]; files: any[] }>({
    folders: [],
    files: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedKeyword.trim()) {
        setResults({ folders: [], files: [] });
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      setShowDropdown(true);
      try {
        const response = await axios.post("/api/items/search", {
          query: debouncedKeyword,
          userId: userMongoId,
        });
        if (response.status === 200) setResults(response.data);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    };

    if (userMongoId && !isHomePage) {
      // Landing page pe search hit na ho
      fetchSearchResults();
    }
  }, [debouncedKeyword, userMongoId, isHomePage]);

  return (
    <header
      className={`${
        isHomePage || isSharePage
          ? "fixed top-0 left-0 right-0 border-b border-white/5 bg-[#0a0a0a]/60 backdrop-blur-xl"
          : "glass-header sticky top-0"
      } flex h-16 shrink-0 items-center justify-between px-4 sm:px-6 lg:px-8 z-50`}
    >
      {/* 🚀 LEFT SECTION: Logo (Home) OR Mobile Nav (Dashboard) */}
      {isHomePage || isSharePage ? (
        <div className="flex items-center">
          <Logo isCollapsed={false} />
        </div>
      ) : (
        <div className="flex items-center gap-3 md:hidden">
          <MobileSideNav />
        </div>
      )}

      {/* small screen middle part for dashboard  only*/}
      {
        !isHomePage  && (
          <div className="flex md:hidden items-center ms-auto">
            <Logo isCollapsed={false} />
          </div>
        )
      }

      {/* 🔍 MIDDLE SECTION: Global Search Bar (Hide on Home Page and Share Page) */}
      {showSearch && (
        <div
          className="flex-1 items-center justify-center px-4 max-w-2xl mx-auto hidden sm:flex relative"
          ref={dropdownRef}
        >
          <div className="flex w-full items-center gap-2 rounded-full bg-dark-500/40 backdrop-blur-md px-4 py-2 border border-white/10 focus-within:border-blue-500/50 focus-within:bg-dark-500/60 transition-all shadow-inner">
            <IoSearch className="text-gray-400 text-xl shrink-0" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                if (e.target.value.length > 0) setShowDropdown(true);
              }}
              onFocus={() => {
                if (searchKeyword.length > 0) setShowDropdown(true);
              }}
              placeholder="Search files and folders..."
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-gray-500"
            />
            {isSearching && (
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            )}
          </div>

          {/* Search Dropdown */}
          {showDropdown && debouncedKeyword.trim().length > 0 && (
            <div className="absolute top-[120%] left-4 right-4 border border-white/10 shadow-2xl bg-dark-200/90 backdrop-blur-xl rounded-2xl p-2 max-h-[60vh] overflow-y-auto remove-scrollbar flex flex-col gap-1 z-50">
              {/* ... (Aapka bacha hua search dropdown code same rahega) ... */}
              {results.folders.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-3 py-2">
                    Folders
                  </p>
                  {results.folders.map((folder) => (
                    <Link
                      key={folder._id}
                      href={`/dashboard/${folder._id}`}
                      onClick={() => setShowDropdown(false)}
                      className=" flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-dark-400/50 transition-colors group cursor-pointer"
                    >
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                        <Folder size={16} strokeWidth={2.5} />
                      </div>
                      <span className="text-sm font-medium text-gray-200 group-hover:text-white truncate">
                        {folder.folderName}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {results.files.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-3 py-2">
                    Files
                  </p>
                  {results.files.map((file) => (
                    <a
                      key={file._id}
                      href={file.databaseLocations.secure_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-dark-400/50 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 rounded-lg bg-white/5 text-gray-400 group-hover:text-white transition-colors">
                          <FileIcon size={16} strokeWidth={2} />
                        </div>
                        <span className="text-sm font-medium text-gray-200 group-hover:text-white truncate">
                          {file.fileName}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 shrink-0 pl-2">
                        {formatFileSize(file.fileSize)}
                      </span>
                    </a>
                  ))}
                </div>
              )}

              {!isSearching &&
                results.folders.length === 0 &&
                results.files.length === 0 && (
                  <div className="px-4 py-8 text-center flex flex-col items-center">
                    <IoSearch className="text-gray-600 text-3xl mb-2" />
                    <p className="text-sm text-gray-400">
                      No results found for{" "}
                      <span className="text-white font-medium">
                        {debouncedKeyword}
                      </span>
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>
      )}

      {/* 🧑‍💻 RIGHT SECTION: User Auth Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {(isHomePage || isSharePage) && userMongoId && (
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block mr-2"
          >
            Go to Dashboard
          </Link>
        )}

        <SignedOut>
          <SignInButton mode="modal">
            <button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 border border-white/10 shadow-sm",
              },
            }}
          />
        </SignedIn>
      </div>
    </header>
  );
}
