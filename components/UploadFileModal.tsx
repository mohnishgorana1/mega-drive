
'use client'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import Image from 'next/image'

function UploadFileModal({ currentFolderId }:
    {
        currentFolderId: string | null,
    }
) {
    const pathName = usePathname()
    const router = useRouter();
    const { user } = useUser();
    const userMongoId = user?.publicMetadata?.userMongoId as string | undefined
    const [isLoading, setIsLoading] = useState(false)

    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | ArrayBuffer | null>(null)
    const [fileType, setFileType] = useState<string>('');



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setFileType(selectedFile.type);

            if (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')) {
                setPreviewUrl(URL.createObjectURL(selectedFile)); // Preview images and videos
            } else if (selectedFile.type.startsWith('text/')) {
                const reader = new FileReader();
                reader.onload = (event) => setPreviewUrl(event?.target?.result!);
                reader.readAsText(selectedFile);
            } else {
                setPreviewUrl(null); // No preview available for other file types
            }
        }
    };

    const handleFileUpload = async () => {
        if (!file || !userMongoId) return;

        setIsLoading(true)

        console.log("FILE", file);
        console.log("usermongoID", userMongoId);
        console.log("currentFolderID", currentFolderId);



        const formData = new FormData();
        formData.append('userId', userMongoId);
        formData.append('file', file);
        formData.append("currentFolderId", currentFolderId!)


        try {
            const response = await axios.post('/api/file/create-file', formData);
            if (response?.status === 201) {
                console.log('File uploaded successfully:', response.data);
                setOpen(false)
                router.refresh()
            }
        } catch (error) {
            console.log("ERROR: File Not Uploaded", error);
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className='upload-file-modal-btn w-full'>
                    Upload File 
                    {/* <span className='ml-1 text-neutral-500'>{currentFolderId === null ? "null" : currentFolderId} {typeof(currentFolderId!)}</span> */}
                </button>
            </DialogTrigger>
            <DialogContent className='border bg-dark-400 px-8 py-12'>
                <DialogHeader className=''>
                    <DialogTitle className='text-center font-bold tracking-wide text-2xl text-light-200'>Upload File</DialogTitle>
                    <div className='border border-dark-700 mt-12' />
                    <DialogDescription className='pt-12 flex items-center justify-center flex-col gap-8'>
                        {/* TODO: UPLOAD FILE FUNCTionality and styling */}
                        <label
                            className="flex items-center cursor-pointer"
                        >
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <span className="bg-[#ffffff] px-6 py-2 rounded-xl text-blue-700 border-2 border-blue-700 font-bold">Select File</span>
                        </label>
                        {fileType.startsWith('image/') && previewUrl && (
                            <Image
                                src={previewUrl as string}
                                alt="File preview"
                                width={200}
                                height={150}
                                className="max-w-[300px] max-h-[300px] mt-4"
                            />
                        )}
                        {fileType.startsWith('video/') && previewUrl && (
                            <video src={previewUrl as string} controls className="file-preview" />
                        )}
                        {fileType.startsWith('text/') && previewUrl && (
                            <pre className="file-preview">
                                {typeof previewUrl === 'string' ? previewUrl : "Unable to display file content."}
                            </pre>
                        )}
                        {!fileType.startsWith('image/') && !fileType.startsWith('video/') && !fileType.startsWith('text/') && (
                            <div className="file-icon">
                                <span>File Preview Not Available</span>
                            </div>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='-mb-8 mt-8 flex flex-row place-self-end items-center gap-x-5'>
                    <DialogClose asChild>
                        <Button
                            className='bg-dark-400 rounded-xl font-bold border border-transparent text-blue-700 hover:border hover:border-blue-700'
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        className='bg-blue-700 rounded-xl tracking-wide border border-blue-700 text-white hover:bg-blue-800 hover:border-transparent'
                        onClick={handleFileUpload}
                        disabled={isLoading}
                    >
                        {isLoading ? "Uploading..." : "Upload"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

export default UploadFileModal

