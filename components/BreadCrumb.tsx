"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronRight, Home, Loader2, Trash2, Star } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  id: string;
}

export default function BreadCrumb({
  currentFolderId,
  classNames = "",
}: {
  currentFolderId: string | null;
  classNames?: string;
}) {
  const pathName = usePathname();
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBreadcrumbPath = async (folderId: string) => {
    setIsLoading(true);
    const path: BreadcrumbItem[] = [];
    let currentId = folderId;

    try {
      // Your exact recursive logic
      while (currentId) {
        const response = await axios.post(
          "/api/folder/get-breadCrumb-details",
          {
            folderId: currentId,
          },
        );

        if (response?.status === 201 || response?.status === 200) {
          const folder = response.data.folder;
          path.unshift({
            name: folder.folderName,
            id: folder._id,
          });
          currentId = folder.parentFolderId;
        } else {
          break;
        }
      }
    } catch (error) {
      console.error("Error fetching breadcrumb path", error);
    } finally {
      // Add the root folder (Home) at the beginning of the path
      path.unshift({ name: "My Drive", id: "" });
      setBreadcrumb(path);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentFolderId) {
      fetchBreadcrumbPath(currentFolderId);
    } else {
      setBreadcrumb([{ name: "My Drive", id: "" }]);
    }
  }, [currentFolderId]);

  // Handle static root routes (Trash / Favourites)
  if (pathName === "/dashboard/trash") {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full glass bg-red-500/10 text-red-500 border border-red-500/20 shadow-lg shadow-red-500/10 shrink-0">
          <Trash2 size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Trash
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Items here can be restored or deleted permanently
          </p>
        </div>
      </div>
    );
  }
  if (pathName === "/dashboard/favourites") {
    return (
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-3xl glass bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-lg shadow-yellow-500/10">
          <Star size={24} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Favourites
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Quick access to your starred items
          </p>
        </div>
      </div>
    );
  }

  return (
    <nav
      className={`flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-medium overflow-x-auto remove-scrollbar max-w-full pb-2 md:pb-0 md:w-[70%] ${classNames}`}
    >
      {breadcrumb.map((folder, index) => {
        const isLastItem = index === breadcrumb.length - 1;
        const isHome = index === 0;

        return (
          <div
            key={folder.id || "home"}
            className="flex items-center gap-1 sm:gap-2 shrink-0"
          >
            {/* Render Chevron separator for all items EXCEPT the first one (Home) */}
            {!isHome && (
              <ChevronRight size={16} className="text-gray-600 shrink-0" />
            )}

            {/* 🚀 FIXED: Agar ID nahi hai (yani Home hai), toh /dashboard pe jao */}
            <Link
              href={folder.id ? `/dashboard/${folder.id}` : "/dashboard"}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 max-w-[120px] sm:max-w-[200px] ${
                isLastItem
                  ? "text-white bg-dark-400 shadow-sm cursor-default" // Active Folder
                  : "text-gray-400 hover:text-white hover:bg-dark-400 cursor-pointer" // Parent Folders
              }`}
              // Prevent clicking if we are already in this exact folder
              aria-disabled={isLastItem}
              tabIndex={isLastItem ? -1 : 0}
              onClick={(e) => isLastItem && e.preventDefault()}
            >
              {/* Attach the Home icon only to the first item */}
              {isHome && (
                <Home size={18} className={isLastItem ? "text-blue-500" : ""} />
              )}

              <span className={`${isHome ? "hidden sm:inline" : "truncate"}`}>
                {folder.name}
              </span>

              {/* Mobile short-name for Home */}
              {isHome && <span className="sm:hidden">Drive</span>}
            </Link>
          </div>
        );
      })}

      {/* Loading State Spinner */}
      {isLoading && (
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <ChevronRight size={16} className="text-gray-600 shrink-0" />
          <div className="px-3 py-1.5">
            <Loader2
              size={16}
              className="animate-spin text-blue-500 shrink-0"
            />
          </div>
        </div>
      )}
    </nav>
  );
}
