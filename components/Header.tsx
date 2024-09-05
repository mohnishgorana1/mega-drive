'use client'
import Link from 'next/link'
import React from 'react'
import MobileSideNav from './MobileSideNav'
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import { MdDriveFolderUpload } from "react-icons/md";
const Header = () => {
  const { user } = useUser()
  const userMongoId = user?.publicMetadata?.userMongoId

  return (
    <nav className='flex items-center justify-between fixed z-50 w-full bg-dark-200 px-6 py-4 lg:px-12'>
      <Link href='/' className='flex items-center'>
        <p className='font-extrabold text-[26px] text-white flex gap-x-2 items-center'>
          Mega Drive <MdDriveFolderUpload className='text-white'/>
        </p>
      </Link>
      <div className="flex items-center justify-between gap-5">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        {/* <MobileSideNav /> */}
      </div>
    </nav>
  )
}

export default Header