import Link from 'next/link'
import React from 'react'
import MobileSideNav from './MobileSideNav'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
const Header = () => {
  return (
    <nav className='flex items-center justify-between fixed z-50 w-full bg-dark-200 px-6 py-4 lg:px-10'>
      <Link href='/' className='flex items-center'>
        <p className='font-extrabold text-[26px] text-white'>Mega Drive</p>
      </Link>
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