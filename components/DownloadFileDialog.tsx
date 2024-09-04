'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import 'next-cloudinary/dist/cld-video-player.css';
import { Button } from './ui/button';
import { IoMdCloudDownload } from "react-icons/io";



interface DownloadFileDialogProps {
    isOpen: boolean;
    fileUrl: string;
    onClose: () => void;
}


const DownloadFileDialog = ({ isOpen, fileUrl, onClose }: DownloadFileDialogProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="bg-dark-400 p-4 w-[96vw]">
                    <DialogHeader className='flex items-center justify-center gap-1'>
                        <DialogTitle className="text-xl font-semibold">File Preview Not Available</DialogTitle>
                        <p className='text-dark-600 text-sm mt-4'>Please download file</p>
                        <DialogClose />
                    </DialogHeader>
                    {
                        fileUrl ? (
                            <div className='w-full items-center flex justify-center my-5'>
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="p-1 rounded-xl gap-2 flex flex-col items-center justify-between w-fit self"
                                >
                                    {/* <p className="text-sm truncate">{file?.fileName}</p> */}
                                    <Button className='bg-blue-700 hover:bg-transparent hover:border-blue-700 hover:text-blue-700 border border-transparent w-64  text-white flex gap-2 items-center text-lg duration-300 ease-linear rounded-xl'>
                                        Download
                                        <IoMdCloudDownload className='text-2xl' />
                                    </Button>
                                </a>
                            </div>
                        ) : (
                            <div className='flex items-center justify-center min-h-36'>
                                <h1 className='text-red-700 font-bold text-2xl p-5 '>File is Unavailable to Download</h1>
                            </div>
                        )
                    }

                </DialogContent>
            </Dialog>
        </>

    )
}

export default DownloadFileDialog