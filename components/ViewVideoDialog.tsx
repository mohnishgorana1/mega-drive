"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";
import { Button } from "./ui/button";
import { Download, Film, AlertCircle } from "lucide-react";

interface ViewVideoDialogProps {
  isOpen: boolean;
  videoUrl: string;
  downloadUrl: string;
  onClose: () => void;
}

const ViewVideoDialog = ({
  isOpen,
  videoUrl,
  downloadUrl,
  onClose,
}: ViewVideoDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Wide lightbox feel, no default padding, deep dark background */}
      <DialogContent className="bg-dark-200 border border-dark-400 shadow-2xl rounded-2xl w-[95vw] max-w-5xl p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-dark-400 bg-dark-300/30 shrink-0">
          <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Film className="text-blue-500 w-5 h-5" strokeWidth={2.5} />
            Video Preview
          </DialogTitle>
          <DialogDescription className="sr-only">
            Watch and download your video
          </DialogDescription>
        </DialogHeader>

        {/* Main Cinematic Area */}
        <div className="flex-1 w-full bg-black/80 relative flex flex-col items-center justify-center">
          {videoUrl ? (
            <>
              {/* Video Player Container */}
              <div className="w-full flex items-center justify-center overflow-hidden">
                {/* We wrap it to ensure it scales nicely inside the modal */}
                <div className="w-full max-h-[70vh] flex items-center justify-center bg-black">
                  <CldVideoPlayer
                    id={`video-player-${videoUrl}`}
                    width="1920"
                    height="1080"
                    src={videoUrl}
                    pictureInPictureToggle
                    className="max-h-[70vh] object-contain"
                  />
                </div>
              </div>

              {/* Floating Footer Action Area */}
              <div className="w-full p-4 bg-dark-300/80 border-t border-dark-400 flex justify-end shrink-0 backdrop-blur-md">
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 py-5 transition-all shadow-lg hover:shadow-blue-500/25 flex gap-2 items-center text-base font-semibold">
                    <Download className="w-5 h-5" strokeWidth={2.5} />
                    Download Video
                  </Button>
                </a>
              </div>
            </>
          ) : (
            // Premium Empty/Error State
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" strokeWidth={2} />
              </div>
              <h1 className="text-gray-300 font-semibold text-lg">
                Video Unavailable
              </h1>
              <p className="text-sm text-gray-500">
                The video file could not be loaded or processed.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewVideoDialog;
