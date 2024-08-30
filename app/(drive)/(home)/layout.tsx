'use client'
import CreateFolderModal from '@/components/CreateFolderModal'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import UploadFileModal from '@/components/UploadFileModal'
import { useUser } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import React, { ReactNode, useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";


function HomeLayout({ children }: { children: ReactNode }) {
    const pathName = usePathname()
    const [searchKeyword, setSearchKeyword] = useState("")
    const [isValidLocationToCreateFolder, setIsValidLocationToCreateFolder] = useState(false)

  

    useEffect(() => {
        // Check if the pathname is valid for folder creation (i.e., "/" or "/[folderId]")
        // const isRootOrFolder = pathName === "/" || /^\/[a-zA-Z0-9]+$/.test(pathName)
        const isTrashOrFavourites = pathName === "/favourites" || pathName === "/trash"
        setIsValidLocationToCreateFolder(!isTrashOrFavourites);
    }, [pathName])

    return (
        <main className="p-1 w-full min-h-screen">
            <header className="h-10 sm:h-16">
                <Header />
            </header>
            <div className='flex '>
                <Sidebar />
                <section className="flex min-h-screen flex-1 flex-col px-4 sm:px-6 pb-6 pt-12 sm:pt-5  max-md:pb-14 ">
                    <div className="w-full">
                        <header className="flex w-full justify-between items-center">
                            <div className="flex items-center justify-between pr-2 border-[1px] pl-4 border-[#ffffff37] rounded-xl sm:w-[30%] ">
                                <input
                                    type="text"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    className="border-transparent bg-transparent w-[90%] outline-none focus:outline-none focus:ring-0 focus:border-transparent"
                                    placeholder="Search File.."
                                />
                                <IoSearch className="text-2xl font-thin hover:scale-105 duration-300 cursor-pointer" />
                            </div>
                            <div className='sm:w-[40%] flex gap-x-4 gap-y-2 sm:items-center items-start flex-col sm:flex-row'>
                                {
                                    isValidLocationToCreateFolder && (
                                        <CreateFolderModal />
                                    )
                                }
                                <UploadFileModal />
                            </div>
                        </header>
                        <main className='mt-5'>
                            {children}
                        </main>
                    </div>
                </section>

            </div>
        </main>
    )
}

export default HomeLayout