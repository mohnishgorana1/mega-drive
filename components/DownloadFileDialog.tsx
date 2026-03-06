'use client'
import React from 'react'
import { 
    Dialog, 
    DialogContent, 
    DialogTitle, 
    DialogDescription 
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Download, FileQuestion, AlertCircle } from 'lucide-react';

interface DownloadFileDialogProps {
    isOpen: boolean;
    fileUrl: string;
    onClose: () => void;
}

const DownloadFileDialog = ({ isOpen, fileUrl, onClose }: DownloadFileDialogProps) => {

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            {/* 🚀 Changed to glass-panel with overflow-hidden for premium look */}
            <DialogContent className="glass-panel sm:max-w-md p-0 overflow-hidden border-white/10">
                
                {/* Visual Header / Alert Area */}
                <div className="flex flex-col items-center justify-center pt-12 pb-6 px-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-5 border border-blue-500/20 shadow-inner">
                        <FileQuestion className="w-10 h-10 text-blue-500 drop-shadow-md" strokeWidth={2} />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-white tracking-tight">
                        Preview Not Available
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 mt-3 text-sm max-w-[280px] mx-auto">
                        This file format cannot be viewed directly in the browser. Please download it to your device to open it.
                    </DialogDescription>
                </div>

                {/* Action Area */}
                <div className="px-6 pb-10 flex justify-center">
                    {fileUrl ? (
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="w-full sm:w-auto"
                        >
                            {/* 🚀 Sleek glowing pill button */}
                            <Button className="w-full sm:w-64 bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 py-6 transition-all shadow-lg shadow-blue-500/20 flex gap-3 items-center justify-center text-base font-semibold">
                                <Download className="w-5 h-5" strokeWidth={2.5} />
                                Download File
                            </Button>
                        </a>
                    ) : (
                        // Premium Error State
                        <div className="flex flex-col items-center justify-center p-6 gap-3 rounded-3xl bg-dark-100/50 border border-white/5 w-full">
                            <AlertCircle className="w-8 h-8 text-red-500" strokeWidth={2} />
                            <p className="text-gray-300 font-medium">File source is unavailable</p>
                        </div>
                    )}
                </div>
                
            </DialogContent>
        </Dialog>
    )
}

export default DownloadFileDialog