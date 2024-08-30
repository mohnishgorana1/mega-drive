'use client'
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

// Displays the contents of a specific folder (files and subfolders)
function FolderPage({ params }: { params: { folderId: string } }) {
    const currentFolderId = params.folderId;
    const router = useRouter()

    const [folders, setFolders] = useState<[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [Error, setError] = useState("")
    const fetchFolders = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post("/api/folder/get-folder-list", {
                parentFolderId: currentFolderId
            })

            if (response?.status === 201) {
                console.log(response);
                setFolders(response.data?.folders)
            }
        } catch (error: any) {
            console.log("Error Fetching Folders", error);
            setError(error?.message || error)
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchFolders()
    }, [])


    return (
        <div>
            <h1 className='text-2xl font-bold text-teal-600'>FolderPage Folder ID {currentFolderId}</h1>
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
                <Button className="bg-blue-700 rounded-xl hover:scale-105 ease-in-out duration-500" onClick={fetchFolders}>Fetch Folders</Button>

                {
                    isLoading && <Loader2 className="animate-spin text-purple-800" />
                }

            </div>
        </div>
    )
}

export default FolderPage