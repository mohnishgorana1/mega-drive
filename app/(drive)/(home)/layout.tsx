'use client'
import CreateFolderModal from '@/components/CreateFolderModal'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import UploadFileModal from '@/components/UploadFileModal'
import { usePathname } from 'next/navigation'
import React, { ReactNode, useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";


function HomeLayout({ children }: { children: ReactNode }) {
    const pathName = usePathname()
    const [searchKeyword, setSearchKeyword] = useState("")
    const [isValidLocationToCreateFolder, setIsValidLocationToCreateFolder] = useState(false)
    const [isValidLocationToUploadFile, setIsValidLocationToUploadFile] = useState(false)
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)

    useEffect(() => {

        const isTrashOrFavourites = pathName === "/favourites" || pathName === "/trash"
        setIsValidLocationToCreateFolder(!isTrashOrFavourites);
        setIsValidLocationToUploadFile(!isTrashOrFavourites);

        const folderId = pathName.split("/")[1] === "" ? null : pathName.split("/")[1]
        setCurrentFolderId(folderId)

    }, [pathName])

    return (
        <main className="p-1 w-full min-h-screen">
            <header className="h-10 sm:h-16">
                <Header />
            </header>
            <div className='flex '>
                {/* <Sidebar /> */}
                <section className="flex min-h-screen flex-1 flex-col px-4 sm:px-6 pb-6 pt-12 sm:pt-5  max-md:pb-14 ">
                    <div className="w-full">
                        <header className="flex w-full justify-between items-center">
                            {/* <div className="flex items-center justify-between pr-2 border-[1px] pl-4 border-[#ffffff37] rounded-xl sm:w-[30%] ">
                                <input
                                    type="text"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    className="border-transparent bg-transparent w-[90%] outline-none focus:outline-none focus:ring-0 focus:border-transparent"
                                    placeholder="Search File.."
                                />
                                <IoSearch className="text-2xl font-thin hover:scale-105 duration-300 cursor-pointer" />
                            </div> */}
                            <div className='w-full flex flex-row gap-x-16 sm:gap-x-[70vw] gap-y-2 sm:items-center items-end sm:flex-row'>
                                {
                                    isValidLocationToCreateFolder && (
                                        <CreateFolderModal />
                                    )
                                }
                                {
                                    isValidLocationToUploadFile && (
                                        <UploadFileModal currentFolderId={currentFolderId} />
                                    )
                                }
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