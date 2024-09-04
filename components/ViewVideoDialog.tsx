'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import { IoMdCloudDownload } from 'react-icons/io';
import { Button } from './ui/button';

interface ViewVideoDialogProps {
    isOpen: boolean;
    videoUrl: string;
    downloadUrl: string
    onClose: () => void;
}


const ViewVideoDialog = ({ isOpen, videoUrl, downloadUrl, onClose }: ViewVideoDialogProps) => {

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="bg-dark-400 p-4">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold mb-8 w-fit pr-2 border-b-2">Video Preview</DialogTitle>
                        <DialogClose />
                    </DialogHeader>
                    <DialogDescription className=''>
                        {
                            videoUrl ? (
                                <div className='flex items-center justify-center flex-col gap-2'>
                                    <CldVideoPlayer
                                        id="adaptive-bitrate-streaming"
                                        width="1920"
                                        height="1080"
                                        src={videoUrl}
                                        pictureInPictureToggle
                                    />
                                    <a
                                        href={downloadUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className="p-1 rounded-xl gap-2 flex flex-col items-center justify-between w-fit mt-5"
                                    >
                                        {/* <p className="text-sm truncate">{file?.fileName}</p> */}
                                        <Button className='bg-blue-700 hover:bg-transparent hover:border-blue-700 hover:text-blue-700 border border-transparent w-64  text-white flex gap-2 items-center text-lg duration-300 ease-linear rounded-xl'>
                                            Download Video
                                            <IoMdCloudDownload className='text-2xl' />
                                        </Button>
                                    </a>
                                </div>
                            ) : (
                                <div className='flex items-center justify-center min-h-36'>
                                    <h1 className='text-red-700 font-bold text-2xl p-5 '>Video is Unavailable</h1>
                                </div>
                            )
                        }
                    </DialogDescription>

                </DialogContent>
            </Dialog>
        </>

    )
}

export default ViewVideoDialog