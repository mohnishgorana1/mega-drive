"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import {
  CloudUpload,
  File as FileIcon,
  X,
  Film,
  Image as ImageIcon,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFolderId: string | null;
}

export default function UploadFileModal({
  isOpen,
  onClose,
  currentFolderId,
}: UploadFileModalProps) {
  const router = useRouter();
  const { user } = useUser();
  const userMongoId = user?.publicMetadata?.userMongoId as string | undefined;

  // 🚀 New States for Step-by-Step Progress
  const [uploadStep, setUploadStep] = useState<"idle" | "uploading" | "saving">(
    "idle",
  );
  const [uploadProgress, setUploadProgress] = useState(0);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | ArrayBuffer | null>(
    null,
  );
  const [fileType, setFileType] = useState<string>("");

  const [storageError, setStorageError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setStorageError(null);
    setUploadProgress(0);
    setUploadStep("idle");

    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileType(selectedFile.type);

      // 🛑 FRONTEND STORAGE CHECK
      if (userMongoId) {
        try {
          const res = await axios.post("/api/user/storage", {
            userId: userMongoId,
          });
          const { used, limit } = res.data;

          if (used + selectedFile.size > limit) {
            const neededMB = (
              (used + selectedFile.size - limit) /
              (1024 * 1024)
            ).toFixed(2);
            setStorageError(
              `Storage full! You need ${neededMB} MB more space to upload this file.`,
            );
          }
        } catch (err) {
          console.error("Failed to check storage limits");
        }
      }

      if (
        selectedFile.type.startsWith("image/") ||
        selectedFile.type.startsWith("video/")
      ) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else if (selectedFile.type.startsWith("text/")) {
        const reader = new FileReader();
        reader.onload = (event) => setPreviewUrl(event?.target?.result!);
        reader.readAsText(selectedFile);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleFileUpload = async () => {
    if (!file || !userMongoId || storageError) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = "megadrive_unsigned"; // Apni step 1 wali preset

    if (!cloudName) {
      toast.error("Cloudinary config missing");
      return;
    }

    try {
      // ---------------------------------------------------------
      // ☁️ STEP 1: DIRECT UPLOAD TO CLOUDINARY
      // ---------------------------------------------------------
      setUploadStep("uploading"); // UI update for Step 1
      setUploadProgress(0);

      const cloudFormData = new FormData();
      cloudFormData.append("file", file);
      cloudFormData.append("upload_preset", uploadPreset);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

      const cloudResponse = await axios.post(cloudinaryUrl, cloudFormData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || file.size),
          );
          setUploadProgress(percentCompleted);
        },
      });

      // ---------------------------------------------------------
      // 💾 STEP 2: SAVE DATA TO OUR MONGODB
      // ---------------------------------------------------------
      setUploadStep("saving"); // UI update for Step 2

      const dbPayload = {
        userId: userMongoId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        currentFolderId: currentFolderId || "null",
        cloudinaryData: cloudResponse.data,
      };

      const dbResponse = await axios.post("/api/file/save-record", dbPayload);

      if (dbResponse?.status === 201) {
        toast.success("File uploaded successfully!");
        handleCancel();
        window.dispatchEvent(new Event("drive-item-changed"));
      }
    } catch (error: any) {
      console.log("ERROR: File Upload Failed", error);
      toast.error("Upload failed. Please try again.");
      setStorageError("Upload failed");
    } finally {
      setUploadStep("idle");
      setUploadProgress(0);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreviewUrl(null);
    setFileType("");
    setStorageError(null);
    setUploadStep("idle");
    setUploadProgress(0);
    onClose();
  };

  const renderFileIcon = () => {
    if (fileType.startsWith("image/"))
      return <ImageIcon className="text-blue-400 w-7 h-7" />;
    if (fileType.startsWith("video/"))
      return <Film className="text-purple-400 w-7 h-7" />;
    if (fileType.startsWith("text/"))
      return <FileText className="text-gray-400 w-7 h-7" />;
    return <FileIcon className="text-red-400 w-7 h-7" />;
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Prevent closing modal if upload is in progress
        if (!open && uploadStep === "idle") handleCancel();
      }}
    >
      <DialogContent className="glass-panel sm:max-w-md p-0 overflow-hidden border-white/10">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-white">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-blue-400">
              <CloudUpload size={20} strokeWidth={2.5} />
            </div>
            Upload File
          </DialogTitle>
          <DialogDescription className="text-gray-400 mt-2">
            Select a file from your device to upload to MDrive.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4">
          {!file ? (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-3xl bg-dark-100/30 hover:bg-dark-100/50 hover:border-blue-500/50 transition-all cursor-pointer group">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 group-hover:bg-blue-500/20 mb-3 transition-colors">
                <CloudUpload className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </div>
              <p className="text-sm font-medium text-white">
                Click to browse files
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Ensure you have enough Cloud Pulse space.
              </p>
            </label>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center p-3 bg-dark-100/50 border border-white/5 rounded-2xl relative shadow-inner">
                <div className="flex items-center justify-center w-12 h-12 bg-white/5 rounded-xl shrink-0">
                  {renderFileIcon()}
                </div>
                <div className="min-w-0 flex flex-col justify-center">
                  <p
                    className="text-sm font-medium text-white truncate"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={handleCancel}
                  disabled={uploadStep !== "idle"} // Disable cancel if uploading
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors shrink-0 ${uploadStep !== "idle" ? "text-gray-600 cursor-not-allowed" : "text-gray-400 hover:text-red-400 hover:bg-red-500/10"}`}
                >
                  <X size={16} />
                </button>
              </div>

              {/* FRONTEND ERROR DISPLAY */}
              {storageError && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium animate-in fade-in zoom-in">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <p>{storageError}</p>
                </div>
              )}

              {/* Modal Media Preview (Hidden during upload for cleaner UI) */}
              {previewUrl && !storageError && uploadStep === "idle" && (
                <div className="w-full bg-black/50 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center max-h-48 backdrop-blur-sm animate-in fade-in zoom-in">
                  {fileType.startsWith("image/") && (
                    <Image
                      src={previewUrl as string}
                      alt="preview"
                      width={300}
                      height={200}
                      className="object-contain w-full h-full"
                    />
                  )}
                  {fileType.startsWith("video/") && (
                    <video
                      src={previewUrl as string}
                      controls
                      className="w-full h-full object-contain"
                    />
                  )}
                  {fileType.startsWith("text/") && (
                    <pre className="text-xs text-gray-300 p-4 w-full overflow-auto max-h-48 text-left bg-dark-100/50">
                      {typeof previewUrl === "string"
                        ? previewUrl
                        : "Cannot preview text"}
                    </pre>
                  )}
                </div>
              )}

              {/* 🚀 STEP-BY-STEP PROGRESS BAR IN MODAL */}
              {uploadStep !== "idle" && (
                <div className="flex flex-col gap-3 p-4 bg-dark-400/50 border border-white/5 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                  {/* Step 1: Cloud Upload */}
                  <div
                    className={`flex items-center justify-between text-xs font-medium transition-all ${uploadStep === "saving" ? "text-gray-500" : "text-blue-400"}`}
                  >
                    <div className="flex items-center gap-2">
                      {uploadStep === "saving" ? (
                        <CheckCircle2 size={14} className="text-green-500" />
                      ) : (
                        <Loader2 size={14} className="animate-spin" />
                      )}
                      <span>Step 1: Uploading to Cloud</span>
                    </div>
                    <span>
                      {uploadStep === "saving" ? "100%" : `${uploadProgress}%`}
                    </span>
                  </div>

                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${uploadStep === "saving" ? "bg-green-500" : "bg-blue-500 shadow-[0_0_10px] shadow-blue-500/50"}`}
                      style={{
                        width:
                          uploadStep === "saving"
                            ? "100%"
                            : `${uploadProgress}%`,
                      }}
                    ></div>
                  </div>

                  {/* Step 2: Database Save */}
                  <div
                    className={`flex items-center justify-between text-xs font-medium transition-all mt-1 ${uploadStep === "saving" ? "text-blue-400" : "text-gray-600"}`}
                  >
                    <div className="flex items-center gap-2">
                      {uploadStep === "saving" ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <div className="w-3.5 h-3.5 border-2 border-gray-600 rounded-full" />
                      )}
                      <span>Step 2: Saving to MDrive</span>
                    </div>
                    <span>
                      {uploadStep === "saving" ? "Processing..." : "Waiting"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 bg-dark-100/40 border-t border-white/5 flex sm:justify-end gap-2">
          <Button
            onClick={handleCancel}
            variant="ghost"
            disabled={uploadStep !== "idle"}
            className="rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            Cancel
          </Button>
          <Button
            className={`rounded-full px-6 transition-all shadow-lg flex items-center gap-2 ${
              storageError
                ? "bg-gray-600 cursor-not-allowed opacity-50"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
            }`}
            onClick={handleFileUpload}
            disabled={uploadStep !== "idle" || !file || !!storageError}
          >
            {uploadStep !== "idle" && (
              <CloudUpload className="animate-bounce w-4 h-4" />
            )}
            {uploadStep === "uploading"
              ? `Uploading...`
              : uploadStep === "saving"
                ? `Saving...`
                : storageError
                  ? "Storage Full"
                  : "Upload File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
