'use client'
import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from './ui/button';
import { Input } from './ui/input';
import axios from 'axios';
import { useRouter } from 'next/navigation';


interface RenameFileOrFolderProps {
    itemId: string;
    itemType: string;
    itemCurrentName: string;
    isOpen: boolean;
    onClose: () => void;
}

function RenameFileOrFolder({ itemId, itemType, itemCurrentName, isOpen, onClose }: RenameFileOrFolderProps) {
    const router = useRouter()
    const [itemNewName, setItemNewName] = useState(itemCurrentName)
    const [isLoading, setIsLoading] = useState(false)

    console.log("PROPS", itemId, itemType, itemCurrentName);


    const handleRename = async () => {

        console.log("Currname", itemCurrentName);

        console.log("newNAme", itemNewName);

        setIsLoading(true)

        try {
            if (itemType === "Folder") {
                const response = await axios.post("/api/folder/rename-folder", {
                    folderIdToRename: itemId,
                    folderNewName: itemNewName
                })
                if (response.status === 201) {
                    console.log("Folder Renamed", response);
                    setItemNewName("")
                    onClose()
                    setTimeout(() => {
                        router.refresh();  // Refresh the page
                    }, 100); // 100ms delay
                }

            } else if (itemType === "File") {
                const response = await axios.post("/api/file/rename-file", {
                    fileIdToRename: itemId,
                    fileNewName: itemNewName
                })
                if (response.status === 201) {
                    console.log("File Renamed", response);
                    setItemNewName("")
                    onClose()
                    setTimeout(() => {
                        router.refresh();  // Refresh the page
                    }, 100); // 100ms delay
                }
            } else {
                console.log("Invalid Item Type to Rename", itemType);
                return;
            }
        } catch (error) {
            console.log(`Error Renaming ${itemType}`, error);
        } finally {
            setIsLoading(false)
        }



    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>

            <DialogContent className='bg-dark-200 border-0 px-8 '>
                <DialogHeader className='flex flex-col gap-8'>
                    <DialogTitle className='font-bold tracking-wide text-2xl text-blue-700'>Rename {itemType}</DialogTitle>
                    <DialogDescription className='mt-16'>
                        {/* <p>{itemNewName}</p> */}
                        <Input
                            type='text'
                            value={itemNewName}
                            onChange={(e) => setItemNewName(e.target.value)}
                            placeholder={`Enter ${itemType} Name`}
                            className='text-blue-500 rounded-xl font-extrabold bg-dark-300 outline outline-blue-700 outline-[1px] focus:ring-1 focus:ring-blue-700  focus:outline-0 focus:border-0'
                        />
                    </DialogDescription>
                    <DialogFooter className='flex flex-row place-self-end items-center gap-x-5'>
                        <DialogClose asChild onClick={() => setItemNewName(itemCurrentName)}>
                            <Button className='bg-dark-400 rounded-xl font-bold border border-transparent text-blue-700 hover:border hover:border-blue-700'>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            className='bg-blue-700 rounded-xl tracking-wide border border-blue-700 text-white hover:bg-blue-800 hover:border-transparent'
                            onClick={handleRename}
                        >
                            {isLoading ? "Renaming..." : "Rename"}
                        </Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}

export default RenameFileOrFolder