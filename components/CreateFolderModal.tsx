"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FolderPlus } from "lucide-react";
import toast from "react-hot-toast"; // 🚀 Import Toast

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFolderId: string | null;
}

export default function CreateFolderModal({
  isOpen,
  onClose,
  currentFolderId,
}: CreateFolderModalProps) {
  const router = useRouter();
  const [folderName, setFolderName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const userMongoId = user?.publicMetadata?.userMongoId;

  const handleCreateFolder = async () => {
    setIsLoading(true);

    const folderData = {
      folderName: folderName.trim() || "Untitled Folder",
      parentFolderId: currentFolderId,
      userId: userMongoId,
    };

    // 🚀 THE MAGIC: toast.promise handles Loading, Success, and Error automatically!
    toast.promise(
      axios.post("/api/folder/create-folder", folderData),
      {
        loading: "Creating folder...",
        success: <b>Folder created!</b>,
        error: <b>Failed to create folder.</b>,
      }
    )
      .then(() => {
        // Success hone par UI reset karo
        setFolderName("");
        onClose();
        window.dispatchEvent(new Event("drive-item-changed"));
      })
      .catch((error) => {
        console.error("Error Creating Folder:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCancel = () => {
    setFolderName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      {/* 🚀 Updated to use glass-panel */}
      <DialogContent className="glass-panel sm:max-w-md p-0 overflow-hidden border-white/10">
        {/* Header Section */}
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-white">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-blue-400">
              <FolderPlus size={20} strokeWidth={2.5} />
            </div>
            Create New Folder
          </DialogTitle>
          <DialogDescription className="text-gray-400 mt-2">
            Organize your files by creating a new folder in your drive.
          </DialogDescription>
        </DialogHeader>

        {/* Input Section */}
        <div className="px-6 py-4">
          <Input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="e.g. Project Documents"
            // Using the global iOS input styling
            className="w-full text-white rounded-2xl bg-dark-100/50 border-white/5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-12 px-4 placeholder:text-gray-600 transition-all"
            autoFocus
          />
        </div>

        {/* Footer Actions */}
        <DialogFooter className="px-6 py-4 bg-dark-100/40 border-t border-white/5 flex sm:justify-end gap-2">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            onClick={handleCreateFolder}
            disabled={isLoading || !folderName.trim()}
          >
            {isLoading ? "Creating..." : "Create Folder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}