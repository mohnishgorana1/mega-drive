'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';

interface ViewVideoDialogProps {
    isOpen: boolean;
    videoUrl: string;
    onClose: () => void;
}


const ViewVideoDialog = ({ isOpen, videoUrl, onClose }: ViewVideoDialogProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState('');

    const handleVideoClick = (url: string) => {
        setSelectedVideoUrl(url);
        setIsDialogOpen(true);
    };
    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="bg-dark-400 p-4">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Video Preview</DialogTitle>
                        <DialogClose />
                    </DialogHeader>
                    <CldVideoPlayer
                        id="adaptive-bitrate-streaming"
                        width="1920"
                        height="1080"
                        src={videoUrl}
                        pictureInPictureToggle
                    />
                </DialogContent>
            </Dialog>
        </>

    )
}

export default ViewVideoDialog