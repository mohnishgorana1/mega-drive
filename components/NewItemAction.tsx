"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Plus, FolderPlus, FileUp } from "lucide-react";
import CreateFolderModal from "./CreateFolderModal";
import UploadFileModal from "./UploadFileModal";

interface NewItemActionProps {
  isCollapsed?: boolean;
}

export default function NewItemAction({ isCollapsed }: NewItemActionProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathName = usePathname();

  // segments will be like ["dashboard"] or ["dashboard", "66dd..."]
  const segments = pathName.split("/").filter(Boolean);
  const isSpecialRoute = pathName === "/favourites" || pathName === "/trash";

  // Agar hum /dashboard pe hain toh null, agar /dashboard/abc pe hain toh abc
  const currentFolderId =
    segments.length > 1 && !isSpecialRoute ? segments[1] : null;

  console.log("Current Folder ID:", currentFolderId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full " ref={dropdownRef}>
      {/* The Trigger Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold hover:bg-blue-700 transition-all shadow-md ${isCollapsed ? "w-full px-0" : "w-full"}`}
      >
        <Plus
          className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isDropdownOpen ? "rotate-45" : ""}`}
        />
        {!isCollapsed && <span>New</span>}
      </button>

      {/* The Dropdown Menu */}
      {isDropdownOpen && (
        <div
          className={`absolute z-50 mt-2 flex w-48 flex-col rounded-xl border border-dark-400 bg-dark-200 py-2 shadow-2xl ${
            isCollapsed ? "left-16 top-0" : "left-0 top-full"
          }`}
        >
          <button
            onClick={() => {
              setIsFolderModalOpen(true);
              setIsDropdownOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-dark-400 hover:text-white transition-colors"
          >
            <FolderPlus className="h-4 w-4 text-teal-500" />
            Create Folder
          </button>

          <div className="my-1 border-t border-dark-400" />

          <button
            onClick={() => {
              setIsFileModalOpen(true);
              setIsDropdownOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-dark-400 hover:text-white transition-colors"
          >
            <FileUp className="h-4 w-4 text-blue-500" />
            Upload File
          </button>
        </div>
      )}

      {/* The Modals - Invisible until triggered */}
      <CreateFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        currentFolderId={currentFolderId}
      />
      <UploadFileModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        currentFolderId={currentFolderId}
      />
    </div>
  );
}
