'use client'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'

function UploadFileModal() {
    const pathName = usePathname()
    const [open, setOpen] = useState(false)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className='upload-file-modal-btn w-full'>
                    Upload File
                </button>
            </DialogTrigger>
            <DialogContent className='bg-dark-400 border-0 px-8 py-16 '>
                <DialogHeader>
                    <DialogTitle className='text-center font-bold tracking-wide text-2xl text-light-200'>Upload File</DialogTitle>
                    <div className='border border-dark-700 mt-12'/>
                    <DialogDescription className='mt-8'>
                        {/* TODO: UPLOAD FILE FUNCTionality and styling */}
                        <input type="file"/>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}

export default UploadFileModal