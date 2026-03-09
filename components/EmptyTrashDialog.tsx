"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast"; // 🚀 Import Toast

interface EmptyTrashDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onClose: () => void;
}

function EmptyTrashDialog({
  isOpen,
  setIsOpen,
  onClose,
}: EmptyTrashDialogProps) {
  const { user } = useUser();
  const userMongoId = user?.publicMetadata?.userMongoId;
  const [isLoading, setIsLoading] = useState(false);

  const handleEmptyTrash = async () => {
    if (!userMongoId) return;

    setIsLoading(true);

    // 🚀 Wrap the API call in toast.promise
    toast.promise(
      axios.post("/api/items/empty-trash", { userId: userMongoId }),
      {
        loading: "Emptying trash...",
        success: <b>Trash emptied successfully!</b>,
        error: <b>Failed to empty trash.</b>,
      }
    )
      .then((response) => {
        if (response.status === 200) {
          setIsOpen(false);
          // 🔥 Global event tells DisplayFilesAndFolder and Sidebar to refresh!
          window.dispatchEvent(new Event("drive-item-changed"));
        }
      })
      .catch((error) => {
        console.error("Failed to empty trash", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
      <DialogContent className="glass-panel sm:max-w-md p-0 overflow-hidden border-white/10">
        <div className="flex flex-col items-center justify-center pt-8 pb-4 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-5 border border-red-500/20 shadow-inner">
            <AlertTriangle
              className="w-8 h-8 text-red-500 drop-shadow-md"
              strokeWidth={2.5}
            />
          </div>

          <DialogTitle className="text-xl font-bold text-white tracking-tight">
            Empty Trash?
          </DialogTitle>

          <DialogDescription className="mt-3 flex flex-col gap-2">
            <span className="text-[15px] text-gray-300">
              Are you sure you want to permanently delete all items currently in
              the trash?
            </span>
            <span className="text-sm font-medium text-red-400 mt-2 bg-red-500/10 py-1.5 px-3 rounded-lg inline-block w-fit mx-auto">
              This action cannot be undone.
            </span>
          </DialogDescription>
        </div>

        <DialogFooter className="px-6 py-5 bg-dark-100/40 border-t border-white/5 flex flex-row justify-center sm:justify-center gap-3">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="w-full sm:w-auto rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors px-6"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white rounded-full px-8 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center gap-2 font-semibold"
            onClick={handleEmptyTrash}
            disabled={isLoading}
          >
            {isLoading ? (
              "Emptying..."
            ) : (
              <>
                <Trash2 size={18} strokeWidth={2.5} />
                Empty Trash
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EmptyTrashDialog;