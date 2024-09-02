'use client'
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface DisplayFilesAndFolderProps {
    isGridView: boolean;
    currentFolderId: string | null;
}

function DisplayFilesAndFolder({ isGridView, currentFolderId }: DisplayFilesAndFolderProps) {

    const router = useRouter()
    const [folders, setFolders] = useState<[]>([])
    const [files, setFiles] = useState<[]>([])

    const [isLoading, setIsLoading] = useState(false)
    const [Error, setError] = useState("")

    const fetchFilesAndFolders = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post("/api/folder/get-folder-list", {
                currentFolderId: currentFolderId
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
    }, [router])
    return (
        <section className="grid grid-cols-5 flex-wrap gap-y-12 text-center  pt-4">
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

            {
                isLoading && <Loader2 className="animate-spin text-purple-800" />
            }
        </section>
    )
}

export default DisplayFilesAndFolder