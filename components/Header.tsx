'use client'
import Link from 'next/link'
import React from 'react'
import MobileSideNav from './MobileSideNav'
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
const Header = () => {
  const { user } = useUser()
  const userMongoId = user?.publicMetadata?.userMongoId

  return (
    <nav className='flex items-center justify-between fixed z-50 w-full bg-dark-200 px-6 py-4 lg:px-10'>
      <Link href='/' className='flex items-center'>
        <p className='font-extrabold text-[26px] text-white'>Mega Drive</p>
      </Link>
      <p className='text-purple-800 text-[5px] sm:text-xl line-clamp-2 sm:block'>USER: {userMongoId}</p>
      <div className="flex items-center justify-between gap-5">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <MobileSideNav />
      </div>
    </nav>
  )
}

export default Header