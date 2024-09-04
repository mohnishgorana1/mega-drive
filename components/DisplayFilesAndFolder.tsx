'use client'
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { RiFileVideoFill } from "react-icons/ri";
import { FaFile, FaFilePdf } from "react-icons/fa6";
import 'next-cloudinary/dist/cld-video-player.css';
import ViewVideoDialog from './ViewVideoDialog';
import { AiFillFile } from "react-icons/ai";
import ViewImageDialog from './ViewImageDialog';
import DownloadFileDialog from './DownloadFileDialog';



interface DisplayFilesAndFolderProps {
    isGridView: boolean;
    currentFolderId: string | null;
}


function DisplayFilesAndFolder({ isGridView, currentFolderId }: DisplayFilesAndFolderProps) {

    const router = useRouter()
    const [folders, setFolders] = useState<[]>([])
    const [files, setFiles] = useState<[]>([])

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)


    const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)

    const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
    const [selectedVideoDownloadUrl, setSelectedVideoDownloadUrl] = useState('');

    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const [selectedImageDownloadUrl, setSelectedImageDownloadUrl] = useState('');

    const [selectedFileUrl, setSelectedFileUrl] = useState("")
    // const [selectedFileDownloadUrl, setSelectedFileDownloadUrl] = useState("")



    const handleVideoClick = (url: string, downloadUrl: string) => {
        console.log("Video URL", url);

        setSelectedVideoUrl(url);
        setSelectedVideoDownloadUrl(downloadUrl)
        setIsVideoDialogOpen(true);
    };
    const handleImageClick = (url: string, downloadUrl: string) => {
        console.log("Image URL", url);

        setSelectedImageUrl(url);
        setSelectedImageDownloadUrl(downloadUrl)
        setIsImageDialogOpen(true);
    };
    const handleFileClick = (url: string, downloadUrl: string) => {
        console.log("File URL", url);

        setSelectedFileUrl(url);
        setIsFileDialogOpen(true);
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



    if (error) {
        return (
            <section className='flex items-center justify-center w-full '>
                <p className="text-red-700 text-2xl">{error}</p>
                {/* <Image
                    src={"/assets/gifs/error.gif"}
                    width={100}
                    height={100}
                    alt='error gif'
                /> */}
            </section>
        )
    }



    if (error) {
        return (
            <section className='flex items-center justify-center w-full mt-36'>
                <Loader2 className="animate-spin text-purple-800 size-12" />
            </section>
        )
    }

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
                            <div
                                key={idx}
                                onClick={() => handleImageClick(file?.databaseLocations?.secure_url, file?.databaseLocations?.download_url)}
                                className="hover:bg-dark-500 p-1 rounded-xl gap-2 flex flex-col items-center justify-between">
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
                                onClick={() => handleVideoClick(file?.databaseLocations.public_id, file?.databaseLocations?.download_url)}
                                className="hover:bg-dark-500 p-1 rounded-xl gap-2 flex flex-col items-center justify-between"
                            >
                                <RiFileVideoFill className='w-20 h-20 text-blue-400' />
                                <p className="text-sm truncate">{file?.fileName}</p>
                            </div>
                        )
                    }
                    if (fileType === "application/pdf") {
                        return (
                            <div
                                key={idx}
                                onClick={() => handleFileClick(file?.databaseLocations?.download_url)}
                                className="hover:bg-dark-500 p-1 rounded-xl gap-2 flex flex-col items-center justify-between"
                            >
                                <FaFilePdf className='w-20 h-20 text-red-500' />
                                <p className="text-sm truncate">{file?.fileName}</p>
                            </div>

                        );
                    } else if (fileType.startsWith("text/")) {
                        iconSrc = "/assets/icons/text-icon.svg";
                    } else if (fileType.includes("word")) {
                        iconSrc = "/assets/icons/word-icon.svg";
                    }
                    return (
                        <div
                            key={idx}
                            onClick={() => handleFileClick(file?.databaseLocations?.download_url)}
                            className="hover:bg-dark-500 p-1 rounded-xl gap-2 flex flex-col items-center justify-between"
                        >
                            <FaFile className='w-20 h-20 text-dark-600' />
                            <p className="text-sm truncate">{file?.fileName}</p>
                        </div>
                    );
                })
            }
            <ViewVideoDialog
                isOpen={isVideoDialogOpen}
                videoUrl={selectedVideoUrl}
                downloadUrl={selectedVideoDownloadUrl}
                onClose={() => setIsVideoDialogOpen(false)}
            />
            <ViewImageDialog
                isOpen={isImageDialogOpen}
                imageUrl={selectedImageUrl}
                downloadUrl={selectedImageDownloadUrl}
                onClose={() => setIsImageDialogOpen(false)}
            />
            <DownloadFileDialog
                isOpen={isFileDialogOpen}
                fileUrl={selectedFileUrl}
                onClose={() => setIsFileDialogOpen(false)}
            />
        </section >

    )
}

export default DisplayFilesAndFolder