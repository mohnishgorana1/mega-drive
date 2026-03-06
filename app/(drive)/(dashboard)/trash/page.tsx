"use client";

import React, { useState } from "react";
import DisplayFilesAndFolder from "@/components/DisplayFilesAndFolder";

import axios from "axios";

export default function TrashPage() {
  return (
    <div className="flex flex-col w-full h-full relative">
      <DisplayFilesAndFolder currentFolderId="trash" />
    </div>
  );
}
