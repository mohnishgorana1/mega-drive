'use client'
import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from './ui/button';
import { Input } from './ui/input';
import axios from 'axios';
import { useRouter } from 'next/navigation';


interface DeleteFileOrFolderProps {
    itemId: string;
    itemType: string;
    itemName: string;
    isOpen: boolean;
    onClose: () => void;
}

function DeleteFileOrFolder({ itemId, itemType, itemName, isOpen, onClose }: DeleteFileOrFolderProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    console.log("PROPS", itemId, itemType);


    const handleDelete = async () => {

        setIsLoading(true)

        try {
            let response;
            if (itemType === "Folder") {
                response = await axios.post("/api/folder/delete-folder", {
                    folderIdToDelete: itemId,
                })

            } else if (itemType === "File") {
                response = await axios.post("/api/file/delete-file", {
                    fileIdToDelete: itemId,
                })
            } else {
                console.log("Invalid Item Type to Delete", itemType);
                return;
            }

            if (response.status === 201) {
                console.log(`${itemType} Deleted", ${response}`);
                setTimeout(() => {
                    router.refresh();  // Refresh the page
                }, 100); // 100ms delay
                onClose()
            }
        } catch (error) {
            console.log(`Error Deleting ${itemType}`, error);
        } finally {
            setIsLoading(false)
        }



    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>

            <DialogContent className='bg-dark-200 border-0 px-8 '>
                <DialogHeader className='flex flex-col gap-8'>
                    <DialogTitle className='font-bold tracking-wide text-2xl text-red-700'>Delete {itemType}</DialogTitle>
                    <DialogDescription className='mt-16 flex flex-col gap-4'>
                        <p className='text-xl'>Are you sure you want to delete &nbsp;
                            <span className='text-red-400 font-semibold'>
                                {` "${itemName}"`}
                            </span>
                        </p>
                        <p className='text-sm font-light text-gray-400'>This will permanently delete your {itemType}.</p>
                    </DialogDescription>
                    <DialogFooter className='flex flex-row place-self-end items-center gap-x-5'>
                        <DialogClose asChild>
                            <Button className='bg-dark-400 rounded-xl font-bold border border-transparent text-red-700 hover:border hover:border-red-700'>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            className='bg-red-800 rounded-xl tracking-wide border border-red-800 text-white hover:bg-red-900 hover:border-transparent'
                            onClick={handleDelete}
                            disabled={isLoading}
                        >
                            {isLoading ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}

export default DeleteFileOrFolder