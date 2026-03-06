"use client";

import React from "react";
import DisplayFilesAndFolder from "@/components/DisplayFilesAndFolder";
import { Star } from "lucide-react";

export default function FavouritesPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Passing "favourites" as the ID triggers the logic in Step 3 */}
      <DisplayFilesAndFolder currentFolderId="favourites" />
    </div>
  );
}
