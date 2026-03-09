"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check, X, Share2, Globe, Folder, FileText, ShieldAlert, Info } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast"; // 🚀 Import Toast

interface ShareModalProps {
  itemId: string;
  itemName: string;
  itemType: "file" | "folder";
  isAlreadyPublic?: boolean; 
  onClose: () => void;
}

export default function ShareModal({
  itemId,
  itemName,
  itemType,
  isAlreadyPublic = false,
  onClose,
}: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    
    // 🚀 Wrapped in toast.promise for smooth UX
    toast.promise(
      axios.post("/api/items/share", { itemId, itemType }),
      {
        loading: "Generating public link...",
        success: <b>Link generated successfully!</b>,
        error: <b>Failed to generate link.</b>,
      }
    )
      .then((res) => {
        setShareUrl(res.data.shareUrl);
        // 🔥 Trigger event to immediately show the Globe 🌍 badge on the dashboard
        window.dispatchEvent(new Event("drive-item-changed"));
      })
      .catch((err) => {
        console.error("Sharing failed", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!"); // 🚀 Success Toast
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-dark-200 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className={`p-3 rounded-2xl ${itemType === "folder" ? "bg-purple-500/10 text-purple-500" : "bg-blue-500/10 text-blue-500"}`}>
            {itemType === "folder" ? <Folder size={24} /> : <FileText size={24} />}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Title & Item Name */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            Share {itemType === "folder" ? "Folder" : "File"}
          </h3>
          <p className="text-gray-400 text-sm font-medium line-clamp-1 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 italic w-fit">
            {`"${itemName}"`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!shareUrl ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* ⚠️ Warning Messaging */}
              <div className="flex gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200/80">
                <ShieldAlert className="shrink-0" size={20} />
                <div className="text-xs leading-relaxed">
                  <p className="font-bold text-amber-400 mb-1">Public Access Warning</p>
                  Creating a shareable link will make this {itemType} **public**. Anyone with the link will be able to view and download the content.
                </div>
              </div>

              <button
                onClick={handleShare}
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold transition-all disabled:opacity-50 text-white flex items-center justify-center gap-2 shadow-lg ${
                  itemType === "folder"
                    ? "bg-purple-600 hover:bg-purple-500 shadow-purple-500/20"
                    : "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
                }`}
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Share2 size={18} />
                    Generate Public Link
                  </>
                )}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* ✅ Success Messaging */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                <Globe size={16} />
                Link is now active and public.
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative flex items-center gap-2 p-4 bg-black/60 border border-white/10 rounded-2xl">
                  <input
                    readOnly
                    value={shareUrl}
                    className="bg-transparent border-none outline-none text-xs text-blue-100/70 flex-1 truncate font-mono"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-xl transition-all font-bold text-xs"
                  >
                    {copied ? (
                      <> <Check size={14} /> Copied </>
                    ) : (
                      <> <Copy size={14} /> Copy </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2 text-[10px] text-gray-500 px-2 leading-tight">
                <Info size={12} className="shrink-0 mt-0.5" />
                <p>You can revoke access anytime from the item settings to make it private again.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative Background Glow */}
        <div className={`absolute -bottom-10 -right-10 w-40 h-40 blur-[80px] -z-10 opacity-20 ${itemType === 'folder' ? 'bg-purple-500' : 'bg-blue-500'}`} />
      </motion.div>
    </div>
  );
}