"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import {
  Globe,
  FileText,
  Folder,
  Loader2,
  Copy,
  Check,
  XCircle,
  Search,
  ExternalLink,
} from "lucide-react";
import { formatFileSize, timeAgo } from "@/lib/utils";
import Link from "next/link";

export default function SharedItemsPage() {
  const { user } = useUser();
  const userMongoId = user?.publicMetadata?.userMongoId;

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState("");

  const fetchSharedItems = async () => {
    if (!userMongoId) return;
    try {
      const res = await axios.post("/api/items/get-shared-items", {
        userId: userMongoId,
      });
      const merged = [
        ...res.data.folders.map((f: any) => ({ ...f, itemType: "folder" })),
        ...res.data.files.map((f: any) => ({ ...f, itemType: "file" })),
      ];
      setItems(merged);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (itemId: string, itemType: string) => {
    try {
      await axios.post("/api/items/revoke-access", { itemId, itemType });
      setItems((prev) => prev.filter((item) => item._id !== itemId));
      // Optional: Success toast yahan dalo
    } catch (err) {
      console.error("Failed to revoke access");
    }
  };

  const copyLink = (token: string, type: string, id: string) => {
    const url = `${window.location.origin}/share/${token}?type=${type}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };

  useEffect(() => {
    fetchSharedItems();
  }, [userMongoId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-500 size-10 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">
          Scanning shared links...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
            <Globe size={24} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
            Shared Items
          </h1>
        </div>
        <p className="text-gray-500 font-medium">
          Publicly accessible files and folders. Anyone with these links can
          view them.
        </p>
      </header>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[2.5rem] bg-dark-400/20 border border-white/5 hover:border-blue-500/30 hover:bg-dark-400/40 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex items-center gap-5 mb-6 sm:mb-0">
                <div
                  className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center shadow-2xl ${
                    item.itemType === "folder"
                      ? "bg-purple-500/10 text-purple-500"
                      : "bg-blue-500/10 text-blue-500"
                  }`}
                >
                  {item.itemType === "folder" ? (
                    <Folder size={28} />
                  ) : (
                    <FileText size={28} />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-bold text-lg truncate max-w-[180px] md:max-w-xs group-hover:text-blue-400 transition-colors">
                    {item.folderName || item.fileName}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 bg-white/5 px-2 py-0.5 rounded-md">
                      {item.itemType}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      Shared {timeAgo(item.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center">
                <button
                  onClick={() =>
                    copyLink(item.shareToken, item.itemType, item._id)
                  }
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-200 transition-all active:scale-95"
                >
                  {copiedId === item._id ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} className="text-blue-400" />
                  )}
                  {copiedId === item._id ? "Link Copied" : "Copy Link"}
                </button>

                <button
                  onClick={() => handleRevoke(item._id, item.itemType)}
                  className="flex items-center justify-center p-3 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all group/revoke"
                  title="Make Private"
                >
                  <XCircle
                    size={20}
                    className="group-hover/revoke:rotate-90 transition-transform"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3.5rem] bg-white/[0.01]">
          <div className="w-20 h-20 bg-dark-400/50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
            <Globe size={40} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            No public links yet
          </h2>
          <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
            Your private files are safe. When you share an item, it will appear
            here for management.
          </p>
        </div>
      )}
    </div>
  );
}
