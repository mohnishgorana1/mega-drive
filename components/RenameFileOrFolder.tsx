'use client'
import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from './ui/button';
import { Input } from './ui/input';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Pencil } from 'lucide-react'; // 🔥 Added icon

interface RenameFileOrFolderProps {
    itemId: string;
    itemType: string;
    itemCurrentName: string;
    isOpen: boolean;
    onClose: () => void;
    setFiles: any,
    setFolders: any
}

function RenameFileOrFolder({ itemId, itemType, itemCurrentName, isOpen, onClose, setFiles, setFolders }: RenameFileOrFolderProps) {
    const router = useRouter()
    const [itemNewName, setItemNewName] = useState(itemCurrentName)
    const [isLoading, setIsLoading] = useState(false)

    const handleRename = async () => {
        setIsLoading(true)
        try {
            if (itemType === "Folder") {
                const response = await axios.post("/api/folder/rename-folder", {
                    folderIdToRename: itemId,
                    folderNewName: itemNewName
                })
                if (response.status === 201) {
                    setFolders((prevFolders: any) => prevFolders.map((folder: any) =>
                        folder._id === itemId ? { ...folder, folderName: itemNewName } : folder // Note: changed name to folderName based on your schema
                    ));
                }
            } else if (itemType === "File") {
                const response = await axios.post("/api/file/rename-file", {
                    fileIdToRename: itemId,
                    fileNewName: itemNewName
                })
                if (response.status === 201) {
                    setFiles((prevFiles: any) =>
                        prevFiles.map((file: any) =>
                            file._id === itemId ? { ...file, fileName: itemNewName } : file // Note: changed name to fileName based on your schema
                        )
                    );
                }
            }
            onClose();
        } catch (error) {
            console.log(`Error Renaming ${itemType}`, error);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            {/* 🚀 Applied iOS Glassmorphism styling */}
            <DialogContent className='glass-panel sm:max-w-md p-0 overflow-hidden border-white/10'>
                <DialogHeader className='px-6 pt-6 pb-2'>
                    <DialogTitle className='flex items-center gap-3 text-xl font-bold text-white'>
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-blue-400">
                            <Pencil size={20} strokeWidth={2.5} />
                        </div>
                        Rename {itemType}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 mt-2">
                        Enter a new name for this {itemType.toLowerCase()}.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-4">
                    <Input
                        type='text'
                        value={itemNewName}
                        onChange={(e) => setItemNewName(e.target.value)}
                        placeholder={itemCurrentName}
                        className='w-full text-white rounded-2xl bg-dark-100/50 border-white/5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-12 px-4 placeholder:text-gray-600 transition-all'
                        autoFocus
                    />
                </div>

                <DialogFooter className='px-6 py-4 bg-dark-100/40 border-t border-white/5 flex sm:justify-end gap-2'>
                    <DialogClose asChild onClick={() => setItemNewName(itemCurrentName)}>
                        <Button variant="ghost" className='rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors'>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        className='bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50'
                        onClick={handleRename}
                        disabled={isLoading || !itemNewName.trim() || itemNewName === itemCurrentName}
                    >
                        {isLoading ? "Renaming..." : "Rename"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RenameFileOrFolder