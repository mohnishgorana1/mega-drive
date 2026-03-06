"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "./ui/button";
import { Download, Image as ImageIcon, AlertCircle } from "lucide-react";

interface ViewImageDialogProps {
  isOpen: boolean;
  imageUrl: string;
  downloadUrl: string;
  onClose: () => void;
}

const ViewImageDialog = ({
  isOpen,
  imageUrl,
  downloadUrl,
  onClose,
}: ViewImageDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* 🚀 Changed to use glass-panel for that premium iOS frosted look */}
      <DialogContent className="glass-panel w-[95vw] max-w-5xl p-0 overflow-hidden flex flex-col border-white/10">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-white/5 bg-dark-100/40 shrink-0">
          <DialogTitle className="text-lg font-bold text-white flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400">
              <ImageIcon size={16} strokeWidth={2.5} />
            </div>
            Image Preview
          </DialogTitle>
          <DialogDescription className="sr-only">
            View and download your image
          </DialogDescription>
        </DialogHeader>

        {/* Main Content Area - Deep OLED Black for media contrast */}
        <div className="flex-1 w-full bg-dark-100 relative flex flex-col items-center justify-center">
          {imageUrl ? (
            <>
              <div className="relative w-full h-[60vh] md:h-[70vh] p-4">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-contain drop-shadow-2xl"
                  quality={100}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                />
              </div>

              {/* Footer / Action Area */}
              <div className="w-full p-4 bg-dark-200/50 border-t border-white/5 flex justify-end shrink-0 backdrop-blur-md">
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  {/* 🚀 Using the pill-shaped glowing button */}
                  <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 py-5 transition-all shadow-lg shadow-blue-500/20 flex gap-2 items-center text-base font-semibold">
                    <Download className="w-5 h-5" strokeWidth={2.5} />
                    Download Image
                  </Button>
                </a>
              </div>
            </>
          ) : (
            // Premium Empty/Error State
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-inner">
                <AlertCircle className="w-8 h-8 text-red-500" strokeWidth={2} />
              </div>
              <div className="text-center">
                <h1 className="text-gray-200 font-semibold text-lg">
                  Image Unavailable
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  The source file could not be loaded.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewImageDialog;
