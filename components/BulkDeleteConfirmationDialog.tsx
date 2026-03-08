"use client";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";

interface BulkDeleteConfirmationDialogProps {
  isBulkDeleteDialogOpen: boolean;
  setIsBulkDeleteDialogOpen: (open: boolean) => void;
  selectedItems: any[]; // Replace with your actual item type
  handleBulkDelete: () => void;
  isLoading: boolean;
}

function BulkDeleteConfirmationDialog({
  isBulkDeleteDialogOpen,
  setIsBulkDeleteDialogOpen,
  selectedItems,
  handleBulkDelete,
  isLoading,
}: BulkDeleteConfirmationDialogProps) {
  return (
    <Dialog
      open={isBulkDeleteDialogOpen}
      onOpenChange={setIsBulkDeleteDialogOpen}
    >
      <DialogContent className="glass-panel sm:max-w-md p-0 overflow-hidden border-white/10">
        <div className="flex flex-col items-center justify-center pt-8 pb-4 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-5 border border-red-500/20 shadow-inner">
            <AlertTriangle
              className="w-8 h-8 text-red-500 drop-shadow-md"
              strokeWidth={2.5}
            />
          </div>
          <DialogTitle className="text-xl font-bold text-white tracking-tight">
            Delete {selectedItems.length} items?
          </DialogTitle>
          <DialogDescription className="mt-3 flex flex-col gap-2">
            <span className="text-[15px] text-gray-300">
              Are you sure you want to permanently delete these items and all
              their contents?
            </span>
            <span className="text-sm font-medium text-red-400 mt-2 bg-red-500/10 py-1.5 px-3 rounded-lg inline-block w-fit mx-auto">
              This action cannot be undone.
            </span>
          </DialogDescription>
        </div>
        <DialogFooter className="px-6 py-5 bg-dark-100/40 border-t border-white/5 flex flex-row justify-center sm:justify-center gap-3">
          <DialogClose asChild>
            <button className="w-full sm:w-auto rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors px-6 py-2">
              Cancel
            </button>
          </DialogClose>
          <button
            className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white rounded-full px-8 py-2 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center gap-2 font-semibold justify-center"
            onClick={handleBulkDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              "Deleting..."
            ) : (
              <>
                <Trash2 className="w-4 h-4" /> Delete
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BulkDeleteConfirmationDialog;
