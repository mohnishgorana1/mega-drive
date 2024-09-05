'use client'
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter } from "next/navigation";

import DisplayFilesAndFolder from "@/components/DisplayFilesAndFolder";
import BreadCrumb from "@/components/BreadCrumb";


// # Main page for displaying files and folders at the root level
export default function Home() {
  const [isGridView, setIsGridView] = useState(true)
  const router = useRouter();

  return (
    <main className="flex flex-col w-full gap-3">

      <div className="w-full flex md:items-center gap-4 md:gap-0 flex-col md:flex-row">
        <BreadCrumb currentFolderId={null} /> {/* Add the breadcrumb */}
        <div className="text-center md:w-[30%] flex items-center justify-between gap-4">
          <div className="border rounded-xl flex">
            <button
              className={`px-5 rounded-xl ${isGridView && "bg-blue-700 "}`}
              onClick={(e) => setIsGridView(true)}
            >
              Grid
            </button>
            <button
              className={`px-5 rounded-xl ${!isGridView && "bg-blue-700 "}`}
              onClick={(e) => setIsGridView(false)}
            >
              List
            </button>
          </div>
          <Select>
            <SelectTrigger className="w-[100px] h-[30px] rounded-xl bg-black">
              <SelectValue placeholder="All Files" />
            </SelectTrigger>
            <SelectContent className="bg-dark-200 rounded-xl p-0">
              <SelectItem value="file" className="border-b hover:bg-slate-800">Files</SelectItem>
              <SelectItem value="folder" className=" hover:bg-slate-800">Folder</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <DisplayFilesAndFolder
          isGridView={isGridView}
          currentFolderId={null}
        />
      </div>

    </main>
  )
}

