'use client'
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { RiFileVideoFill } from "react-icons/ri";
import { FaFilePdf, FaFolderOpen } from "react-icons/fa6";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import ViewVideoDialog from './ViewVideoDialog';

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


    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState('');

    const handleVideoClick = (url: string) => {
        setSelectedVideoUrl(url);
        setIsDialogOpen(true);
    };

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

        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-6 text-center pt-4">
            {folders.length > 0 && folders.map((folder, idx) => (
                <Link
                    href={`/${folder._id}`}
                    key={idx}
                    className="hover:bg-dark-500 p-1 rounded-xl gap-2 flex flex-col items-center justify-between"
                >
                    <Image
                        src={"/assets/icons/folder.svg"}
                        height={100}
                        width={100}
                        alt={folder?.folderName}
                        className="w-20 h-20"
                    />
                    <p className="text-sm truncate">{folder?.folderName}</p>
                </Link>
            ))}

            {
                files.length > 0 && files.map((file, idx) => {
                    const fileType = file.type;
                    let iconSrc = "/assets/icons/default-file.svg"; // default icon

                    if (fileType.startsWith("image/")) {
                        return (
                            <div key={idx} className="hover:bg-dark-500 p-1 rounded-xl gap-2 flex flex-col items-center justify-between">
                                <Image
                                    src={file?.databaseLocations.secure_url}
                                    height={100}
                                    width={150}
                                    alt="file/image"
                                    quality={80}
                                    className="w-20 h-20 border rounded-xl"
                                />
                                <p className="text-sm truncate">{file?.fileName}</p>
                            </div>
                        );
                    }
                    if (fileType.startsWith("video/")) {
                        return (
                            <div
                                key={idx}
                                onClick={() => handleVideoClick(file?.databaseLocations?.public_id)}
                                className="hover:bg-dark-500 p-1 rounded-xl gap-2 flex flex-col items-center justify-between"
                            >
                                <RiFileVideoFill className='w-20 h-20 text-blue-400' />
                                <p className="text-sm truncate">{file?.fileName}</p>

                            </div>
                        )
                    }
                    if (fileType === "application/pdf") {
                        return (
                            <a
                                key={idx}
                                href={file?.databaseLocations.download_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="hover:bg-dark-500 p-1 rounded-xl gap-2 flex flex-col items-center justify-between"
                            >
                                <FaFilePdf className='w-20 h-20 text-red-500' />
                                <p className="text-sm truncate">{file?.fileName}</p>
                            </a>
                        );
                    } else if (fileType.startsWith("text/")) {
                        iconSrc = "/assets/icons/text-icon.svg";
                    } else if (fileType.includes("word")) {
                        iconSrc = "/assets/icons/word-icon.svg";
                    }
                    return (
                        <div key={idx} className="hover:bg-dark-500 p-1 rounded-xl gap-2 flex flex-col items-center justify-between">
                            <Image
                                src={iconSrc}
                                height={100}
                                width={100}
                                alt={file?.fileName}
                                className="w-20 h-20"
                            />
                            <p className="text-sm truncate">{file?.fileName}</p>
                        </div>
                    );
                })
            }
            {isLoading && <Loader2 className="animate-spin text-purple-800 col-span-full" />}
            <ViewVideoDialog
                isOpen={isDialogOpen}
                videoUrl={selectedVideoUrl}
                onClose={() => setIsDialogOpen(false)}
            />
        </section >

    )
}

export default DisplayFilesAndFolder