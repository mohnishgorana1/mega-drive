'use client'
import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Button } from './ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Trash2 } from 'lucide-react'; // 🔥 Added icons


interface DeleteFileOrFolderProps {
    itemId: string;
    itemType: string;
    itemName: string;
    isOpen: boolean;
    onClose: () => void;
    setFiles: any,
    setFolders: any
}

function DeleteFileOrFolder({ itemId, itemType, itemName, isOpen, onClose, setFiles, setFolders }: DeleteFileOrFolderProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        setIsLoading(true)
        try {
            let response;
            if (itemType === "Folder") {
                response = await axios.post("/api/folder/delete-folder", {
                    folderIdToDelete: itemId,
                })
                if (response.status === 201) {
                    setFolders((prevFolders: any) => prevFolders.filter((folder: any) => folder._id !== itemId))
                }

            } else if (itemType === "File") {
                response = await axios.post("/api/file/delete-file", {
                    fileIdToDelete: itemId,
                })
                if (response.status === 201) {
                    setFiles((prevFiles: any) => prevFiles.filter((file: any) => file._id !== itemId))
                }
            }
            onClose();
        } catch (error) {
            console.log(`Error Deleting ${itemType}`, error);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            {/* 🚀 Centered, highly visual danger alert style */}
            <DialogContent className='glass-panel sm:max-w-md p-0 overflow-hidden border-white/10'>
                
                <div className="flex flex-col items-center justify-center pt-8 pb-4 px-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-5 border border-red-500/20 shadow-inner">
                        <AlertTriangle className="w-8 h-8 text-red-500 drop-shadow-md" strokeWidth={2.5} />
                    </div>
                    
                    <DialogTitle className='text-xl font-bold text-white tracking-tight'>
                        Delete {itemType}
                    </DialogTitle>
                    
                    <DialogDescription className='mt-3 flex flex-col gap-2'>
                        <span className='text-[15px] text-gray-300'>
                            Are you sure you want to permanently delete <br/>
                            <span className='text-white font-bold break-all px-1'>"{itemName}"</span>?
                        </span>
                        <span className='text-sm font-medium text-red-400 mt-2 bg-red-500/10 py-1.5 px-3 rounded-lg inline-block w-fit mx-auto'>
                            This action cannot be undone.
                        </span>
                    </DialogDescription>
                </div>

                <DialogFooter className='px-6 py-5 bg-dark-100/40 border-t border-white/5 flex flex-row justify-center sm:justify-center gap-3'>
                    <DialogClose asChild>
                        <Button variant="ghost" className='w-full sm:w-auto rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors px-6'>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        className='w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white rounded-full px-8 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center gap-2 font-semibold'
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            "Deleting..."
                        ) : (
                            <>
                                <Trash2 size={18} strokeWidth={2.5} />
                                Delete
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteFileOrFolder