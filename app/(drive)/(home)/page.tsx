'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


// # Main page for displaying files and folders at the root level
export default function Home() {
  const [isGridView, setIsGridView] = useState(true)
  useEffect(() => {
    console.log(isGridView);
    

  }, [isGridView, setIsGridView])
  return (
    <section className="flex flex-col w-full gap-3">
      <div className="w-full flex md:items-center gap-4 md:gap-0 flex-col md:flex-row">
        <h1 className="md:w-[70%] ">All Files/All Files/All Files/All Files/All Files/All Files/All Files/All Files/All Files/</h1>
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
      <div className="grid grid-cols-5 flex-wrap gap-y-12 text-center  pt-4">
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
        <div className="border h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center">File</div>
      </div>

    </section>
  )
}

