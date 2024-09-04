'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import Image from 'next/image';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Button } from './ui/button';
import { IoMdCloudDownload } from 'react-icons/io';

interface ViewImageDialogProps {
    isOpen: boolean;
    imageUrl: string;
    downloadUrl: string
    onClose: () => void;
}


const ViewImageDialog = ({ isOpen, imageUrl, downloadUrl, onClose }: ViewImageDialogProps) => {

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="bg-dark-400 p-4 w-[96vw]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Image Preview</DialogTitle>
                        <DialogClose />
                    </DialogHeader>
                    <DialogDescription>
                        {
                            imageUrl ? (
                                <div className='flex items-center justify-between gap-2 flex-col'>
                                    <Image
                                        width="2620"
                                        height="2000"
                                        src={imageUrl}
                                        alt={imageUrl}
                                    />
                                    <a
                                        href={downloadUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className="mt-5 p-1 rounded-xl gap-2 flex flex-col items-center justify-between w-fit self"
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
                                    <h1 className='text-red-700 font-bold text-2xl p-5 '>Image is Unavailable</h1>
                                </div>
                            )
                        }
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </>

    )
}

export default ViewImageDialog