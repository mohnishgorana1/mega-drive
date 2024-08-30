'use client'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from './ui/input'
import { Button } from './ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import axios from 'axios'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

const CreateFolderModal = () => {
  const pathName = usePathname();
  const router = useRouter()
  const [folderName, setFolderName] = useState("Untitled Folder")
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser();
  const userMongoId = user?.publicMetadata?.userMongoId


  const handleCreateFolder = async () => {

    setIsLoading(true);
    setError(null)

    const parentFolderId = pathName === "/" ? null : pathName.slice(1)

    const payload = {
      folderName,
      parentFolderId,
      userId: userMongoId
    }
    console.log("Payload to creaye folder", payload);

    try {
      const response = await axios.post('/api/folder/create-folder', {
        folderName,
        parentFolderId,
        userId: userMongoId
      })
      console.log("RESPONSE", response);

      if (response.status === 201) {
        setOpen(false);
        const folderId = response.data?.folder._id || '/'
        router.push(`/${folderId}`)
        // router.replace(`/${folderId}`)
      }
    } catch (error) {
      console.log("Response Error : Error Creating a Folder ");
      setError("Error Creating Folder")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className='create-folder-btn w-full'>
          Create Folder
        </button>
      </DialogTrigger>
      <DialogContent className='bg-dark-400 border-0 px-8 '>
        <DialogHeader className='flex flex-col gap-8'>
          <DialogTitle className='font-bold tracking-wide text-2xl text-teal-700'>Create Folder</DialogTitle>
          <DialogDescription className='mt-16'>
            <Input
              type='text'
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder='Enter Folder Name'
              className='text-white rounded-xl font-extrabold bg-dark-300 outline outline-teal-700 outline-[1px] focus:ring-1 focus:ring-teal-700 focus:outline-0 focus:border-0'
            />
          </DialogDescription>
          <DialogFooter className='flex flex-row place-self-end items-center gap-x-5'>
            <DialogClose asChild onClick={() => setFolderName("Untitled Folder")}>
              <Button
                className='bg-dark-400 rounded-xl font-bold border border-transparent text-teal-700 hover:border hover:border-teal-700'
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className='bg-teal-700 rounded-xl tracking-wide border border-teal-700 text-white hover:bg-teal-800 hover:border-transparent'
              onClick={handleCreateFolder}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>

  )
}

export default CreateFolderModal