"use client";

import axios from "axios";
import {
  Loader2,
  LayoutGrid,
  List as ListIcon,
  ArrowUpDown,
  Folder,
  Star,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { RiFileVideoFill } from "react-icons/ri";
import { FaFile, FaFilePdf } from "react-icons/fa6";
import "next-cloudinary/dist/cld-video-player.css";

import ViewVideoDialog from "./ViewVideoDialog";
import ViewImageDialog from "./ViewImageDialog";
import DownloadFileDialog from "./DownloadFileDialog";
import RenameFileOrFolder from "./RenameFileOrFolder";
import DeleteFileOrFolder from "./DeleteFileOrFolder";
import BreadCrumb from "./BreadCrumb";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatFileSize,
  timeAgo,
  sortItems,
  SortKey,
  SortOrder,
} from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import EmptyTrashDialog from "./EmptyTrashDialog";

interface DisplayFilesAndFolderProps {
  currentFolderId: string | null;
}

type FilterType = "all" | "file" | "folder";

export default function DisplayFilesAndFolder({
  currentFolderId,
}: DisplayFilesAndFolderProps) {
  const { user, isLoaded } = useUser();
  const userMongoId = user?.publicMetadata?.userMongoId;

  const [folders, setFolders] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isGridView, setIsGridView] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filter, setFilter] = useState<FilterType>("all");

  // Dialog States
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEmptyTrashDialogOpen, setIsEmptyTrashDialogOpen] = useState(false);

  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [selectedVideoDownloadUrl, setSelectedVideoDownloadUrl] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedImageDownloadUrl, setSelectedImageDownloadUrl] = useState("");
  const [selectedFileUrl, setSelectedFileUrl] = useState("");

  const [selectedItemType, setSelectedItemType] = useState<
    "File" | "Folder" | ""
  >("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItemCurrentName, setSelectedItemCurrentName] = useState("");

  const [deleteItemType, setDeleteItemType] = useState<"File" | "Folder" | "">(
    "",
  );
  const [deleteItemId, setDeleteItemId] = useState("");
  const [deleteItemName, setDeleteItemName] = useState("");

  // --- 🔥 FAVORITE TOGGLE HANDLER ---
  const handleToggleFavourite = async (
    itemId: string,
    itemType: "File" | "Folder",
    currentStatus: boolean = false,
  ) => {
    try {
      const response = await axios.post("/api/items/toggle-favourite", {
        itemId,
        itemType,
        isFavourite: currentStatus,
      });
      if (response.status === 200) {
        window.dispatchEvent(new Event("drive-item-changed"));
      }
    } catch (error) {
      console.error("Failed to toggle favourite", error);
    }
  };

  // --- 🗑️ TRASH HANDLERS ---
  const handleMoveToTrash = async (
    itemId: string,
    itemType: "File" | "Folder",
  ) => {
    try {
      const response = await axios.post("/api/items/toggle-trash", {
        itemId,
        itemType,
        isTrashed: false, // Currently NOT trashed
      });
      if (response.status === 200)
        window.dispatchEvent(new Event("drive-item-changed"));
    } catch (error) {
      console.error("Failed to move item to trash", error);
    }
  };

  const handleRestore = async (itemId: string, itemType: "File" | "Folder") => {
    try {
      const response = await axios.post("/api/items/toggle-trash", {
        itemId,
        itemType,
        isTrashed: true, // Currently IS trashed
      });
      if (response.status === 200)
        window.dispatchEvent(new Event("drive-item-changed"));
    } catch (error) {
      console.error("Failed to restore item", error);
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleActionClick = (file: any) => {
    const type = file.type;
    if (type.startsWith("image/"))
      return handleImageClick(
        file.databaseLocations.secure_url,
        file.databaseLocations.download_url,
      );
    if (type.startsWith("video/"))
      return handleVideoClick(
        file.databaseLocations.public_id,
        file.databaseLocations.download_url,
      );
    return handleFileClick(file.databaseLocations.download_url);
  };

  const handleVideoClick = (url: string, downloadUrl: string) => {
    setSelectedVideoUrl(url);
    setSelectedVideoDownloadUrl(downloadUrl);
    setIsVideoDialogOpen(true);
  };

  const handleImageClick = (url: string, downloadUrl: string) => {
    setSelectedImageUrl(url);
    setSelectedImageDownloadUrl(downloadUrl);
    setIsImageDialogOpen(true);
  };

  const handleFileClick = (url: string) => {
    setSelectedFileUrl(url);
    setIsFileDialogOpen(true);
  };

  const handleRenameClick = (
    itemId: string,
    itemType: "File" | "Folder",
    currentName: string,
  ) => {
    setSelectedItemId(itemId);
    setSelectedItemType(itemType);
    setSelectedItemCurrentName(currentName);
    setIsRenameDialogOpen(true);
  };

  const handleDelete = (
    itemId: string,
    itemType: "File" | "Folder",
    itemName: string,
  ) => {
    setDeleteItemId(itemId);
    setDeleteItemType(itemType);
    setDeleteItemName(itemName);
    setIsDeleteDialogOpen(true);
  };

  const fetchFilesAndFolders = async (showLoadingState = true) => {
    if (showLoadingState) setIsLoading(true);
    try {
      const endpoint =
        currentFolderId === "favourites"
          ? "/api/folder/get-favourites"
          : currentFolderId === "trash"
            ? "/api/folder/get-trash"
            : "/api/folder/get-folder-list";

      const response = await axios.post(endpoint, {
        currentFolderId:
          currentFolderId === "favourites" || currentFolderId === "trash"
            ? null
            : currentFolderId,
        userId: userMongoId,
      });

      if (response?.status === 201 || response?.status === 200) {
        setFolders(response.data?.folders || []);
        setFiles(response.data?.files || []);
      }
    } catch (error: any) {
      setError(error?.message || "Failed to fetch items.");
    } finally {
      if (showLoadingState) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && userMongoId) fetchFilesAndFolders();
    const handleItemChanged = () => fetchFilesAndFolders(false);
    window.addEventListener("drive-item-changed", handleItemChanged);
    return () =>
      window.removeEventListener("drive-item-changed", handleItemChanged);
  }, [isLoaded, userMongoId, currentFolderId]);

  const sortedFolders = useMemo(
    () => sortItems(folders, sortKey, sortOrder),
    [folders, sortKey, sortOrder],
  );
  const sortedFiles = useMemo(
    () => sortItems(files, sortKey, sortOrder),
    [files, sortKey, sortOrder],
  );

  const getFileIcon = (type: string, url: string) => {
    if (type.startsWith("image/"))
      return (
        <Image
          src={url}
          alt="img"
          width={80}
          height={80}
          className="w-full h-full object-cover"
        />
      );
    if (type.startsWith("video/"))
      return (
        <RiFileVideoFill className="w-10 h-10 text-blue-500 drop-shadow-md" />
      );
    if (type === "application/pdf")
      return <FaFilePdf className="w-9 h-9 text-red-500 drop-shadow-md" />;
    return <FaFile className="w-9 h-9 text-gray-400 drop-shadow-md" />;
  };

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (isLoading)
    return (
      <div className="flex justify-center mt-36">
        <Loader2 className="animate-spin text-blue-500 size-12" />
      </div>
    );

  return (
    <main className="flex flex-col w-full h-full">
      {/* Top Bar Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <BreadCrumb currentFolderId={currentFolderId} />
        <div className="flex items-center gap-3">
          <div className="flex items-center glass rounded-full p-1 border border-white/5">
            <button
              onClick={() => setIsGridView(true)}
              className={`p-2 rounded-full transition-all duration-300 ${isGridView ? "bg-blue-500 text-white shadow-md shadow-blue-500/20" : "text-gray-400 hover:text-white"}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              className={`p-2 rounded-full transition-all duration-300 ${!isGridView ? "bg-blue-500 text-white shadow-md shadow-blue-500/20" : "text-gray-400 hover:text-white"}`}
            >
              <ListIcon size={16} />
            </button>
          </div>
          <Select
            value={filter}
            onValueChange={(val) => setFilter(val as FilterType)}
          >
            <SelectTrigger className="w-[130px] rounded-full glass border-white/5 text-white">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="glass-panel border-white/10 text-white">
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="file">Files Only</SelectItem>
              <SelectItem value="folder">Folders Only</SelectItem>
            </SelectContent>
          </Select>
          {currentFolderId === "trash" && (
            <Button
              onClick={() => setIsEmptyTrashDialogOpen(true)}
              className="bg-red-600 hover:bg-red-500 text-white rounded-full px-6 py-5 transition-all shadow-lg shadow-red-500/20 font-semibold flex items-center gap-2"
            >
              <Trash2 size={18} strokeWidth={2.5} />
              Empty Trash
            </Button>
          )}
        </div>
      </div>

      <section
        className={
          isGridView
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 pb-20"
            : "flex flex-col gap-1 pb-20"
        }
      >
        {/* --- FOLDERS --- */}
        {(filter === "all" || filter === "folder") &&
          sortedFolders.map((folder) => (
            <ContextMenu key={folder._id}>
              <ContextMenuTrigger>
                <Link
                  href={currentFolderId === "trash" ? "#" : `/${folder._id}`}
                >
                  <div className="relative group">
                    {/* VISUAL STAR INDICATOR (Hidden in Trash) */}
                    {folder.isFavourite && currentFolderId !== "trash" && (
                      <div className="absolute top-2 right-3 z-10 text-yellow-500 drop-shadow-md">
                        <Star size={14} fill="currentColor" />
                      </div>
                    )}
                    {isGridView ? (
                      <div
                        className={`flex flex-col items-center justify-center p-5 rounded-3xl bg-dark-400/30 border border-white/5 hover:bg-dark-400/60 hover:border-white/10 transition-all duration-300 gap-4 cursor-pointer backdrop-blur-sm ${currentFolderId === "trash" && "opacity-60 grayscale hover:opacity-100 hover:grayscale-0"}`}
                      >
                        <div className="p-3 rounded-2xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                          <Folder
                            className="text-blue-500 drop-shadow-md size-10"
                            strokeWidth={2}
                          />
                        </div>
                        <p className="text-sm font-semibold text-white truncate w-full text-center">
                          {folder.folderName}
                        </p>
                      </div>
                    ) : (
                      <div
                        className={`grid grid-cols-12 gap-4 px-6 py-3.5 items-center rounded-2xl hover:bg-dark-400/40 cursor-pointer transition-all border border-transparent hover:border-white/5 ${currentFolderId === "trash" && "opacity-60 hover:opacity-100"}`}
                      >
                        <div className="col-span-6 md:col-span-5 flex items-center gap-4 overflow-hidden">
                          <div className="p-2 rounded-xl bg-blue-500/10 shrink-0">
                            <Folder
                              className="text-blue-500"
                              size={18}
                              strokeWidth={2.5}
                            />
                          </div>
                          <p className="text-sm font-semibold text-white truncate">
                            {folder.folderName}
                          </p>
                        </div>
                        <p className="col-span-3 md:col-span-2 text-xs font-medium text-gray-400">
                          {formatFileSize(folder.folderSize || 0)}
                        </p>
                        <p className="hidden md:block col-span-3 text-xs font-medium text-gray-400">
                          {timeAgo(folder.createdAt)}
                        </p>
                        <p className="col-span-3 md:col-span-2 text-xs font-medium text-gray-400">
                          Folder
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              </ContextMenuTrigger>
              <ContextMenuContent className="glass-panel border-white/10 text-white px-2">
                {currentFolderId === "trash" ? (
                  // 🗑️ TRASH VIEW FOLDER OPTIONS
                  <>
                    <ContextMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(folder._id, "Folder");
                      }}
                      className="text-green-400 hover:bg-green-500/20 focus:bg-green-500/20 rounded-xl cursor-pointer py-2 px-1 font-medium"
                    >
                      Restore Folder
                    </ContextMenuItem>
                    <ContextMenuSeparator className="bg-white/10" />
                    <ContextMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(
                          folder._id,
                          "Folder",
                          folder.folderName || "Unknown",
                        );
                      }}
                      className="text-red-500 hover:bg-red-500/20 focus:bg-red-500/20 rounded-xl cursor-pointer py-2 font-bold"
                    >
                      Delete Permanently
                    </ContextMenuItem>
                  </>
                ) : (
                  // 📁 NORMAL DRIVE FOLDER OPTIONS
                  <>
                    <ContextMenuItem
                      asChild
                      className="hover:bg-blue-500/20 focus:bg-blue-500/20 rounded-xl cursor-pointer py-2 px-3"
                    >
                      <Link href={`/${folder._id}`}>Open Folder</Link>
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavourite(
                          folder._id,
                          "Folder",
                          folder.isFavourite ?? false,
                        );
                      }}
                      className="hover:bg-blue-500/20 focus:bg-blue-500/20 rounded-xl cursor-pointer py-2 px-3 flex items-center justify-between"
                    >
                      {folder.isFavourite
                        ? "Remove from Favourites"
                        : "Mark as Favourite"}
                      <Star
                        size={14}
                        className={
                          folder.isFavourite
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }
                        fill={folder.isFavourite ? "currentColor" : "none"}
                      />
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() =>
                        handleRenameClick(
                          folder._id,
                          "Folder",
                          folder.folderName || "Unknown",
                        )
                      }
                      className="hover:bg-dark-400 focus:bg-dark-400 rounded-xl cursor-pointer py-2 px-3"
                    >
                      Rename
                    </ContextMenuItem>
                    <ContextMenuSeparator className="bg-white/10" />
                    <ContextMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveToTrash(folder._id, "Folder");
                      }}
                      className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20 rounded-xl cursor-pointer py-2 px-3 font-medium"
                    >
                      Move to Trash
                    </ContextMenuItem>
                  </>
                )}
              </ContextMenuContent>
            </ContextMenu>
          ))}

        {/* --- FILES --- */}
        {(filter === "all" || filter === "file") &&
          sortedFiles.map((file) => (
            <ContextMenu key={file._id}>
              <ContextMenuTrigger>
                <div
                  onClick={() =>
                    currentFolderId !== "trash" && handleActionClick(file)
                  }
                  className="relative group"
                >
                  {/* VISUAL STAR INDICATOR (Hidden in Trash) */}
                  {file.isFavourite && currentFolderId !== "trash" && (
                    <div className="absolute top-2 right-2 z-10 text-yellow-500 drop-shadow-md">
                      <Star size={14} fill="currentColor" />
                    </div>
                  )}

                  {isGridView ? (
                    <div
                      className={`flex flex-col items-center justify-between p-4 rounded-3xl bg-dark-400/30 border border-white/5 hover:bg-dark-400/60 hover:border-white/10 transition-all duration-300 cursor-pointer backdrop-blur-sm h-[140px] ${currentFolderId === "trash" && "opacity-60 grayscale hover:opacity-100 hover:grayscale-0"}`}
                    >
                      <div className="flex-1 w-full flex items-center justify-center bg-dark-500/30 rounded-2xl overflow-hidden mb-3 group-hover:scale-[1.02] transition-transform">
                        {getFileIcon(
                          file.type,
                          file.databaseLocations?.secure_url,
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-200 group-hover:text-white truncate w-full text-center tracking-tight px-1">
                        {file.fileName}
                      </p>
                    </div>
                  ) : (
                    <div
                      className={`grid grid-cols-12 gap-4 px-6 py-3 items-center rounded-2xl hover:bg-dark-400/40 cursor-pointer transition-all border border-transparent hover:border-white/5 ${currentFolderId === "trash" && "opacity-60 hover:opacity-100"}`}
                    >
                      <div className="col-span-6 md:col-span-5 flex items-center gap-4 overflow-hidden">
                        <div className="w-10 h-10 flex items-center justify-center bg-dark-500/50 rounded-xl shrink-0 overflow-hidden">
                          {file.type.startsWith("image/") ? (
                            <Image
                              src={file.databaseLocations.secure_url}
                              alt="img"
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <RiFileVideoFill className="text-blue-500 text-lg" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-200 truncate">
                          {file.fileName}
                        </p>
                      </div>
                      <p className="col-span-3 md:col-span-2 text-xs font-medium text-gray-400">
                        {formatFileSize(file.fileSize || 0)}
                      </p>
                      <p className="hidden md:block col-span-3 text-xs font-medium text-gray-400">
                        {timeAgo(file.createdAt)}
                      </p>
                      <p className="col-span-3 md:col-span-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        {file.type.split("/")[0]}
                      </p>
                    </div>
                  )}
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="glass-panel border-white/10 text-white px-2">
                {currentFolderId === "trash" ? (
                  // 🗑️ TRASH VIEW FILE OPTIONS
                  <>
                    <ContextMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(file._id, "File");
                      }}
                      className="text-green-400 hover:bg-green-500/20 focus:bg-green-500/20 rounded-xl cursor-pointer py-2 px-3 font-medium"
                    >
                      Restore File
                    </ContextMenuItem>
                    <ContextMenuSeparator className="bg-white/10" />
                    <ContextMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(
                          file._id,
                          "File",
                          file.fileName || "Unknown",
                        );
                      }}
                      className="text-red-500 hover:bg-red-500/20 focus:bg-red-500/20 rounded-xl cursor-pointer py-2 px-3 font-bold"
                    >
                      Delete Permanently
                    </ContextMenuItem>
                  </>
                ) : (
                  // 📄 NORMAL DRIVE FILE OPTIONS
                  <>
                    <ContextMenuItem
                      onClick={() => handleActionClick(file)}
                      className="hover:bg-blue-500/20 focus:bg-blue-500/20 rounded-xl cursor-pointer py-2 px-3"
                    >
                      Open File
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavourite(
                          file._id,
                          "File",
                          file.isFavourite ?? false,
                        );
                      }}
                      className="hover:bg-blue-500/20 focus:bg-blue-500/20 rounded-xl cursor-pointer py-2 px-3 flex items-center justify-between"
                    >
                      {file.isFavourite
                        ? "Remove from Favourites"
                        : "Mark as Favourite"}
                      <Star
                        size={14}
                        className={
                          file.isFavourite
                            ? "text-yellow-500 ml-1"
                            : "text-gray-400 ml-1"
                        }
                        fill={file.isFavourite ? "currentColor" : "none"}
                      />
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() =>
                        handleRenameClick(
                          file._id,
                          "File",
                          file.fileName || "Unknown",
                        )
                      }
                      className="hover:bg-dark-400 focus:bg-dark-400 rounded-xl cursor-pointer py-2 px-3"
                    >
                      Rename
                    </ContextMenuItem>
                    <ContextMenuSeparator className="bg-white/10" />
                    <ContextMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveToTrash(file._id, "File");
                      }}
                      className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20 rounded-xl cursor-pointer py-2 px-3 font-medium"
                    >
                      Move to Trash
                    </ContextMenuItem>
                  </>
                )}
              </ContextMenuContent>
            </ContextMenu>
          ))}
      </section>

      {/* Modals Section */}
      <ViewVideoDialog
        isOpen={isVideoDialogOpen}
        videoUrl={selectedVideoUrl}
        downloadUrl={selectedVideoDownloadUrl}
        onClose={() => setIsVideoDialogOpen(false)}
      />
      <ViewImageDialog
        isOpen={isImageDialogOpen}
        imageUrl={selectedImageUrl}
        downloadUrl={selectedImageDownloadUrl}
        onClose={() => setIsImageDialogOpen(false)}
      />
      <DownloadFileDialog
        isOpen={isFileDialogOpen}
        fileUrl={selectedFileUrl}
        onClose={() => setIsFileDialogOpen(false)}
      />
      <EmptyTrashDialog
        isOpen={isEmptyTrashDialogOpen}
        setIsOpen={setIsEmptyTrashDialogOpen}
        onClose={() => setIsEmptyTrashDialogOpen(false)}
      />
      <RenameFileOrFolder
        isOpen={isRenameDialogOpen}
        itemId={selectedItemId}
        itemType={selectedItemType}
        itemCurrentName={selectedItemCurrentName}
        onClose={() => setIsRenameDialogOpen(false)}
        setFiles={setFiles}
        setFolders={setFolders}
      />
      <DeleteFileOrFolder
        isOpen={isDeleteDialogOpen}
        itemId={deleteItemId}
        itemType={deleteItemType}
        itemName={deleteItemName}
        onClose={() => setIsDeleteDialogOpen(false)}
        setFiles={setFiles}
        setFolders={setFolders}
      />
    </main>
  );
}
