"use client";

import axios from "axios";
import {
  Loader2,
  LayoutGrid,
  List as ListIcon,
  Folder,
  Star,
  Trash2,
  CheckCircle2,
  X,
  ArchiveRestore,
  ClipboardPaste,
  Scissors,
  Copy,
  Share2,
  LinkIcon,
  XCircle,
  Globe,
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
import ShareModal from "./ShareModal";
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
import BulkDeleteConfirmationDialog from "./BulkDeleteConfirmationDialog";

interface DisplayFilesAndFolderProps {
  currentFolderId: string | null;
}

type FilterType = "all" | "file" | "folder";

type SelectedItem = {
  id: string;
  type: "File" | "Folder";
  name: string;
};

type ClipboardState = {
  action: "cut" | "copy";
  items: SelectedItem[];
} | null;

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
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

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

  // multi selections
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const [deleteItemType, setDeleteItemType] = useState<"File" | "Folder" | "">(
    "",
  );
  const [deleteItemId, setDeleteItemId] = useState("");
  const [deleteItemName, setDeleteItemName] = useState("");

  // clipboard
  const [clipboard, setClipboard] = useState<ClipboardState>(null);

  // share states
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareItemData, setShareItemData] = useState<{
    id: string;
    name: string;
    type: "file" | "folder";
  } | null>(null);

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

  const toggleSelection = (
    e: React.MouseEvent,
    id: string,
    type: "File" | "Folder",
    name: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedItems((prev) => {
      const isSelected = prev.some((item) => item.id === id);
      if (isSelected) {
        return prev.filter((item) => item.id !== id);
      } else {
        return [...prev, { id, type: type, name }];
      }
    });
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

  // --- BULK ACTION HANDLERS ---
  const handleBulkTrashStatus = async (isTrashed: boolean) => {
    if (selectedItems.length === 0) return;
    setIsLoading(true);
    try {
      const response = await axios.post("/api/items/bulk-trash", {
        items: selectedItems,
        isTrashed,
      });
      if (response.status === 200) {
        setSelectedItems([]);
        window.dispatchEvent(new Event("drive-item-changed"));
      }
    } catch (error) {
      console.error("Bulk trash action failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0 || !userMongoId) return;
    setIsLoading(true);
    try {
      const response = await axios.post("/api/items/bulk-delete", {
        items: selectedItems,
        userId: userMongoId,
      });
      if (response.status === 200) {
        setSelectedItems([]);
        setIsBulkDeleteDialogOpen(false);
        window.dispatchEvent(new Event("drive-item-changed"));
      }
    } catch (error) {
      console.error("Bulk delete failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCutCopy = (action: "cut" | "copy") => {
    if (selectedItems.length === 0) return;

    const clipboardData: ClipboardState = {
      action,
      items: selectedItems,
    };

    setClipboard(clipboardData);
    sessionStorage.setItem("drive-clipboard", JSON.stringify(clipboardData));

    setSelectedItems([]);
  };

  const handlePaste = async () => {
    if (!clipboard || !userMongoId || clipboard.items.length === 0) return;

    setIsLoading(true);

    try {
      const response = await axios.post("/api/items/bulk-paste", {
        action: clipboard.action,
        items: clipboard.items,
        destinationFolderId:
          currentFolderId === "favourites" || currentFolderId === "trash"
            ? null
            : currentFolderId,
        userId: userMongoId,
      });

      if (response.status === 200) {
        setClipboard(null);
        sessionStorage.removeItem("drive-clipboard");
        window.dispatchEvent(new Event("drive-item-changed"));
      }
    } catch (error) {
      console.error("Failed to paste items", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- SHARE HANDLERS ---
  const handleShareClick = (
    id: string,
    name: string,
    type: "file" | "folder",
  ) => {
    setShareItemData({ id, name, type });
    setIsShareModalOpen(true);
  };

  const handleRevoke = async (itemId: string, itemType: string) => {
    try {
      const res = await axios.post("/api/items/revoke-access", {
        itemId,
        itemType,
      });
      if (res.status === 200) {
        window.dispatchEvent(new Event("drive-item-changed"));
      }
    } catch (error) {
      console.error("Revoke failed", error);
    }
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

  const sortedFolders = useMemo(
    () => sortItems(folders, sortKey, sortOrder),
    [folders, sortKey, sortOrder],
  );
  const sortedFiles = useMemo(
    () => sortItems(files, sortKey, sortOrder),
    [files, sortKey, sortOrder],
  );

  useEffect(() => {
    if (isLoaded && userMongoId) fetchFilesAndFolders();
    const handleItemChanged = () => fetchFilesAndFolders(false);
    window.addEventListener("drive-item-changed", handleItemChanged);
    return () =>
      window.removeEventListener("drive-item-changed", handleItemChanged);
  }, [isLoaded, userMongoId, currentFolderId]);

  useEffect(() => {
    setSelectedItems([]);
  }, [currentFolderId]);

  useEffect(() => {
    const saved = sessionStorage.getItem("drive-clipboard");
    if (saved) {
      try {
        setClipboard(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse clipboard", e);
      }
    }
  }, []);

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
      {/* --- TOP BAR SECTION --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div className="flex-1 min-w-0 overflow-x-auto remove-scrollbar pb-1 lg:pb-0">
          <BreadCrumb currentFolderId={currentFolderId} />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:justify-end shrink-0">
          {/* PREMIUM PASTE BUTTON */}
          {clipboard &&
            clipboard.items.length > 0 &&
            currentFolderId !== "trash" && (
              <div className="flex items-center bg-blue-500/10 border border-blue-500/20 rounded-full overflow-hidden shadow-lg shadow-blue-500/5 animate-in fade-in zoom-in duration-300 h-10">
                <button
                  onClick={handlePaste}
                  className="flex items-center gap-2 px-4 h-full text-sm font-semibold text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                >
                  <ClipboardPaste size={16} />
                  <span className="hidden sm:inline">Paste</span>{" "}
                  {clipboard.items.length}
                </button>
                <div className="w-px h-5 bg-blue-500/20"></div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setClipboard(null);
                    sessionStorage.removeItem("drive-clipboard");
                  }}
                  className="px-3 h-full text-blue-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center group"
                  title="Clear Clipboard"
                >
                  <X
                    size={16}
                    strokeWidth={2.5}
                    className="group-hover:scale-110 transition-transform"
                  />
                </button>
              </div>
            )}

          {/* Grid / List View Toggles */}
          <div className="flex items-center glass rounded-full p-1 border border-white/5 h-10">
            <button
              onClick={() => setIsGridView(true)}
              className={`p-1.5 rounded-full transition-all duration-300 ${isGridView ? "bg-blue-500 text-white shadow-md shadow-blue-500/20" : "text-gray-400 hover:text-white"}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              className={`p-1.5 rounded-full transition-all duration-300 ${!isGridView ? "bg-blue-500 text-white shadow-md shadow-blue-500/20" : "text-gray-400 hover:text-white"}`}
            >
              <ListIcon size={16} />
            </button>
          </div>

          <Select
            value={filter}
            onValueChange={(val) => setFilter(val as FilterType)}
          >
            <SelectTrigger className="w-[120px] sm:w-[130px] h-10 rounded-full glass border-white/5 text-white">
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
              className="bg-red-600 hover:bg-red-500 text-white rounded-full px-5 h-10 transition-all shadow-lg shadow-red-500/20 font-semibold flex items-center gap-2"
            >
              <Trash2 size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">Empty Trash</span>
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
                  href={
                    currentFolderId === "trash"
                      ? "#"
                      : `/dashboard/${folder._id}`
                  }
                >
                  <div className="relative group">
                    {/* 🌟 ICONS WRAPPER (Top Right) */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
                      {/* 🌍 PUBLIC GLOBE BADGE */}
                      {folder.isPublic && currentFolderId !== "trash" && (
                        <div
                          className="p-1.5 rounded-lg bg-green-500/20 border border-green-500/30 backdrop-blur-md shadow-lg shadow-green-500/10"
                          title="Shared publicly"
                        >
                          <Globe
                            size={12}
                            className="text-green-400 animate-pulse"
                          />
                        </div>
                      )}
                      {/* ⭐ STAR INDICATOR */}
                      {folder.isFavourite && currentFolderId !== "trash" && (
                        <div className="drop-shadow-md">
                          <Star
                            size={14}
                            className="text-yellow-500"
                            fill="currentColor"
                          />
                        </div>
                      )}
                    </div>

                    {isGridView ? (
                      <div
                        className={`flex flex-col items-center justify-center p-5 rounded-3xl bg-dark-400/30 border border-white/5 hover:bg-dark-400/60 hover:border-white/10 transition-all duration-300 gap-4 cursor-pointer backdrop-blur-sm ${currentFolderId === "trash" && "opacity-60 grayscale hover:opacity-100 hover:grayscale-0"}
                        ${
                          selectedItems.some((item) => item.id === folder._id)
                            ? "bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/20"
                            : "bg-dark-400/30 border-white/5 hover:bg-dark-400/60 hover:border-white/10"
                        }
                      `}
                      >
                        {/* 🟢 Selection Checkbox (Top Left) */}
                        <div
                          onClick={(e) =>
                            toggleSelection(
                              e,
                              folder._id,
                              "Folder",
                              folder.folderName!,
                            )
                          }
                          className="absolute top-3 left-3 z-20 w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-blue-400 transition-colors"
                          style={{
                            background: selectedItems.some(
                              (item) => item.id === folder._id,
                            )
                              ? "#3b82f6"
                              : "transparent",
                            borderColor: selectedItems.some(
                              (item) => item.id === folder._id,
                            )
                              ? "#3b82f6"
                              : "",
                          }}
                        >
                          {selectedItems.some(
                            (item) => item.id === folder._id,
                          ) && (
                            <CheckCircle2 size={14} className="text-white" />
                          )}
                        </div>
                        <div className="p-3 rounded-2xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors mt-2">
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
                        className={`grid grid-cols-12 gap-4 px-6 py-3.5 items-center rounded-2xl hover:bg-dark-400/40 cursor-pointer transition-all border border-transparent hover:border-white/5 relative ${currentFolderId === "trash" && "opacity-60 hover:opacity-100"}`}
                      >
                        <div className="col-span-6 md:col-span-5 flex items-center gap-4 overflow-hidden relative pl-6">
                          <div
                            onClick={(e) =>
                              toggleSelection(
                                e,
                                folder._id,
                                "Folder",
                                folder.folderName!,
                              )
                            }
                            className="absolute left-0 w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-blue-400 transition-colors"
                            style={{
                              background: selectedItems.some(
                                (item) => item.id === folder._id,
                              )
                                ? "#3b82f6"
                                : "transparent",
                              borderColor: selectedItems.some(
                                (item) => item.id === folder._id,
                              )
                                ? "#3b82f6"
                                : "",
                            }}
                          >
                            {selectedItems.some(
                              (item) => item.id === folder._id,
                            ) && (
                              <CheckCircle2 size={10} className="text-white" />
                            )}
                          </div>

                          <div className="p-2 rounded-xl bg-blue-500/10 shrink-0 relative">
                            <Folder
                              className="text-blue-500"
                              size={18}
                              strokeWidth={2.5}
                            />
                            {folder.isPublic && currentFolderId !== "trash" && (
                              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                                <Globe size={8} className="text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-white truncate flex items-center gap-2">
                            {folder.folderName}
                            {folder.isFavourite && (
                              <Star
                                size={12}
                                className="text-yellow-500"
                                fill="currentColor"
                              />
                            )}
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
                  <>
                    <ContextMenuItem
                      asChild
                      className="hover:bg-blue-500/20 focus:bg-blue-500/20 rounded-xl cursor-pointer py-2.5 px-3"
                    >
                      <Link href={`/dashboard/${folder._id}`}>Open Folder</Link>
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
                      className="hover:bg-blue-500/20 focus:bg-blue-500/20 rounded-xl cursor-pointer py-2.5 px-3 flex items-center justify-between"
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
                      className="hover:bg-dark-400 focus:bg-dark-400 rounded-xl cursor-pointer py-2.5 px-3"
                    >
                      Rename
                    </ContextMenuItem>

                    {!folder.isPublic ? (
                      <ContextMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareClick(
                            folder._id,
                            folder.folderName!,
                            "folder",
                          );
                        }}
                        className="hover:bg-blue-500/20 focus:bg-blue-500/20 rounded-xl cursor-pointer py-2.5 px-3 flex items-center gap-2"
                      >
                        <Share2 size={16} className="text-blue-400" />
                        Share Link
                      </ContextMenuItem>
                    ) : (
                      <>
                        <ContextMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = `${window.location.origin}/share/${folder.shareToken}?type=folder`;
                            navigator.clipboard.writeText(url);
                          }}
                          className="hover:bg-green-500/20 focus:bg-green-500/20 rounded-xl cursor-pointer py-2.5 px-3 flex items-center gap-2"
                        >
                          <LinkIcon size={16} className="text-green-400" />
                          Copy Shared Link
                        </ContextMenuItem>
                        <ContextMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRevoke(folder._id, "folder");
                          }}
                          className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20 rounded-xl cursor-pointer py-2.5 px-3 flex items-center gap-2 font-medium"
                        >
                          <XCircle size={16} />
                          Stop Sharing
                        </ContextMenuItem>
                      </>
                    )}

                    <ContextMenuSeparator className="bg-white/10" />
                    <ContextMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveToTrash(folder._id, "Folder");
                      }}
                      className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20 rounded-xl cursor-pointer py-2.5 px-3 font-medium"
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
                  {/* 🌟 ICONS WRAPPER (Top Right) */}
                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
                    {/* 🌍 PUBLIC GLOBE BADGE */}
                    {file.isPublic && currentFolderId !== "trash" && (
                      <div
                        className="p-1.5 rounded-lg bg-green-500/20 border border-green-500/30 backdrop-blur-md shadow-lg shadow-green-500/10"
                        title="Shared publicly"
                      >
                        <Globe
                          size={12}
                          className="text-green-400 animate-pulse"
                        />
                      </div>
                    )}
                    {/* ⭐ STAR INDICATOR */}
                    {file.isFavourite && currentFolderId !== "trash" && (
                      <div className="drop-shadow-md">
                        <Star
                          size={14}
                          className="text-yellow-500"
                          fill="currentColor"
                        />
                      </div>
                    )}
                  </div>

                  {isGridView ? (
                    <div
                      className={`flex flex-col items-center justify-between p-4 rounded-3xl bg-dark-400/30 border border-white/5 hover:bg-dark-400/60 hover:border-white/10 transition-all duration-300 cursor-pointer backdrop-blur-sm h-[140px] ${currentFolderId === "trash" && "opacity-60 grayscale hover:opacity-100 hover:grayscale-0"}
                      ${
                        selectedItems.some((item) => item.id === file._id)
                          ? "bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/20"
                          : "bg-dark-400/30 border-white/5 hover:bg-dark-400/60 hover:border-white/10"
                      }
                      `}
                    >
                      {/* 🟢 Selection Checkbox (Top Left) */}
                      <div
                        onClick={(e) =>
                          toggleSelection(e, file._id, "File", file.fileName!)
                        }
                        className="absolute top-3 left-3 z-20 w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-blue-400 transition-colors bg-dark-400/50"
                        style={{
                          background: selectedItems.some(
                            (item) => item.id === file._id,
                          )
                            ? "#3b82f6"
                            : "",
                          borderColor: selectedItems.some(
                            (item) => item.id === file._id,
                          )
                            ? "#3b82f6"
                            : "",
                        }}
                      >
                        {selectedItems.some((item) => item.id === file._id) && (
                          <CheckCircle2 size={14} className="text-white" />
                        )}
                      </div>
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
                      className={`grid grid-cols-12 gap-4 px-6 py-3 items-center rounded-2xl hover:bg-dark-400/40 cursor-pointer transition-all border border-transparent hover:border-white/5 relative ${currentFolderId === "trash" && "opacity-60 hover:opacity-100"}`}
                    >
                      <div className="col-span-6 md:col-span-5 flex items-center gap-4 overflow-hidden pl-6 relative">
                        <div
                          onClick={(e) =>
                            toggleSelection(e, file._id, "File", file.fileName!)
                          }
                          className="absolute left-0 w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-blue-400 transition-colors"
                          style={{
                            background: selectedItems.some(
                              (item) => item.id === file._id,
                            )
                              ? "#3b82f6"
                              : "transparent",
                            borderColor: selectedItems.some(
                              (item) => item.id === file._id,
                            )
                              ? "#3b82f6"
                              : "",
                          }}
                        >
                          {selectedItems.some(
                            (item) => item.id === file._id,
                          ) && (
                            <CheckCircle2 size={10} className="text-white" />
                          )}
                        </div>

                        <div className="w-10 h-10 flex items-center justify-center bg-dark-500/50 rounded-xl shrink-0 overflow-hidden relative">
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
                          {file.isPublic && currentFolderId !== "trash" && (
                            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 z-10">
                              <Globe size={8} className="text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-200 truncate flex items-center gap-2">
                          {file.fileName}
                          {file.isFavourite && (
                            <Star
                              size={12}
                              className="text-yellow-500"
                              fill="currentColor"
                            />
                          )}
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
                  <>
                    <ContextMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(file._id, "File");
                      }}
                      className="text-green-400 hover:bg-green-500/20 focus:bg-green-500/20 rounded-xl cursor-pointer py-2.5 px-3 font-medium"
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
                      className="text-red-500 hover:bg-red-500/20 focus:bg-red-500/20 rounded-xl cursor-pointer py-2.5 px-3 font-bold"
                    >
                      Delete Permanently
                    </ContextMenuItem>
                  </>
                ) : (
                  <>
                    <ContextMenuItem
                      onClick={() => handleActionClick(file)}
                      className="hover:bg-blue-500/20 focus:bg-blue-500/20 rounded-xl cursor-pointer py-2.5 px-3"
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
                      className="hover:bg-blue-500/20 focus:bg-blue-500/20 rounded-xl cursor-pointer py-2.5 px-3 flex items-center justify-between"
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
                      className="hover:bg-dark-400 focus:bg-dark-400 rounded-xl cursor-pointer py-2.5 px-3"
                    >
                      Rename
                    </ContextMenuItem>

                    {!file.isPublic ? (
                      <ContextMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareClick(file._id, file.fileName!, "file");
                        }}
                        className="hover:bg-blue-500/20 focus:bg-blue-500/20 rounded-xl cursor-pointer py-2.5 px-3 flex items-center gap-2"
                      >
                        <Share2 size={16} className="text-blue-400" />
                        Share Link
                      </ContextMenuItem>
                    ) : (
                      <>
                        <ContextMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = `${window.location.origin}/share/${file.shareToken}?type=file`;
                            navigator.clipboard.writeText(url);
                          }}
                          className="hover:bg-green-500/20 focus:bg-green-500/20 rounded-xl cursor-pointer py-2.5 px-3 flex items-center gap-2"
                        >
                          <LinkIcon size={16} className="text-green-400" />
                          Copy Shared Link
                        </ContextMenuItem>

                        <ContextMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRevoke(file._id, "file");
                          }}
                          className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20 rounded-xl cursor-pointer py-2.5 px-3 flex items-center gap-2 font-medium"
                        >
                          <XCircle size={16} />
                          Stop Sharing
                        </ContextMenuItem>
                      </>
                    )}

                    <ContextMenuSeparator className="bg-white/10" />
                    <ContextMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveToTrash(file._id, "File");
                      }}
                      className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20 rounded-xl cursor-pointer py-2.5 px-3 font-medium"
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
      <BulkDeleteConfirmationDialog
        isBulkDeleteDialogOpen={isBulkDeleteDialogOpen}
        setIsBulkDeleteDialogOpen={setIsBulkDeleteDialogOpen}
        selectedItems={selectedItems}
        handleBulkDelete={handleBulkDelete}
        isLoading={isLoading}
      />

      {/* 🚀 SHARE MODAL */}
      {isShareModalOpen && shareItemData && (
        <ShareModal
          itemId={shareItemData.id}
          itemName={shareItemData.name}
          itemType={shareItemData.type}
          onClose={() => {
            setIsShareModalOpen(false);
            setShareItemData(null);
          }}
        />
      )}

      {/* 🚀 FLOATING ACTION BAR FOR MULTI-SELECT */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 sm:gap-4 px-4 sm:px-6 py-3 rounded-full bg-dark-200/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 text-white animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="flex items-center gap-2 mr-2 sm:mr-4">
            <div className="flex items-center justify-center bg-blue-500 text-white rounded-full w-6 h-6 text-xs font-bold shadow-sm shadow-blue-500/30">
              {selectedItems.length}
            </div>
            <span className="text-sm font-medium hidden sm:block text-gray-200">
              Selected
            </span>
          </div>

          <div className="w-px h-6 bg-white/10 mx-1 sm:mx-2"></div>

          {currentFolderId === "trash" ? (
            <>
              <button
                onClick={() => handleBulkTrashStatus(false)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-green-500/20 rounded-full text-green-400 transition-colors"
                title="Restore Selected"
              >
                <ArchiveRestore size={18} />
                <span className="text-sm font-medium hidden sm:block">
                  Restore
                </span>
              </button>

              <button
                onClick={() => setIsBulkDeleteDialogOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-red-500/20 rounded-full text-red-400 transition-colors"
                title="Delete Permanently"
              >
                <Trash2 size={18} />
                <span className="text-sm font-bold hidden sm:block">
                  Delete Forever
                </span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleCutCopy("cut")}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-blue-500/20 rounded-full text-blue-400 transition-colors"
                title="Cut"
              >
                <Scissors size={18} />
                <span className="text-sm font-medium hidden sm:block">Cut</span>
              </button>

              <button
                onClick={() => handleCutCopy("copy")}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-green-500/20 rounded-full text-green-400 transition-colors"
                title="Copy"
              >
                <Copy size={18} />
                <span className="text-sm font-medium hidden sm:block">
                  Copy
                </span>
              </button>

              <button
                onClick={() => handleBulkTrashStatus(true)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-red-500/20 rounded-full text-red-400 transition-colors"
                title="Move to Trash"
              >
                <Trash2 size={18} />
                <span className="text-sm font-medium hidden sm:block">
                  Move to Trash
                </span>
              </button>
            </>
          )}

          <div className="w-px h-6 bg-white/10 mx-1 sm:mx-2"></div>

          <button
            onClick={() => setSelectedItems([])}
            className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
            title="Clear Selection"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </main>
  );
}
