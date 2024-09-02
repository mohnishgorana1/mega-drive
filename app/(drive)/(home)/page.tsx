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
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


// # Main page for displaying files and folders at the root level
export default function Home() {
  const [isGridView, setIsGridView] = useState(true)
  const router = useRouter();

  const [parentFolderId, setParentFolderId] = useState(null)

  const [folders, setFolders] = useState<[]>([])
  const [files, setFiles] = useState<[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [Error, setError] = useState("")

  const fetchFilesAndFolders = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post("/api/folder/get-folder-list", {
        parentFolderId: parentFolderId
      })

      if (response?.status === 201) {
        console.log(response);
        setFolders(response.data?.folders)
        setFiles(response?.data?.files)
      }
    } catch (error: any) {
      console.log("Error Fetching Folders and Files", error);
      setError(error?.message || error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchFilesAndFolders()
  }, [])


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
        {
          folders.length > 0 && (
            folders.map((folder: any, idx) => (
              <Link
                href={`/${folder._id}`}
                key={idx}
                className="rounded-xl h-16 w-16 sm:h-36 sm:w-36 flex items-center justify-center text-black  font-bold bg-amber-200 hover:scale-105 ease-in-out duration-300 cursor-pointer">
                {folder?.folderName}
              </Link>
            ))
          )
        }
        {
          files.length > 0 && (
            files.map((file: any, idx) => {
              const fileType = file.type;
              return (
                <div key={idx}>
                  {
                    fileType.startsWith("image/") ? (
                      <div className="flex flex-col gap-1 bg-white text-black">
                        <Image
                          src={file?.databaseLocations.secure_url}
                          height={150}
                          width={150}
                          alt="file/image"
                          className="border rounded-xl"
                        />
                        <p>{file?.fileName}</p>
                      </div>

                    ) : (
                      <h1 key={idx}>Hello</h1>
                    )
                  }
                </div>
              )


            })
          )
        }
        <Button className="bg-blue-700 rounded-xl hover:scale-105 ease-in-out duration-500" onClick={fetchFilesAndFolders}>Fetch Folders</Button>

        {
          isLoading && <Loader2 className="animate-spin text-purple-800" />
        }

      </div>

    </section>
  )
}

