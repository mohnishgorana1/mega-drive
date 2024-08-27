'use client'
import React from 'react'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from './ui/sheet'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { navLinks } from '@/constants'

function MobileSideNav() {
    const pathName = usePathname()
    return (
        <section className='w-full max-w-[264px]'>
            <Sheet>
                <SheetTrigger asChild>
                    <Button className='sm:hidden'>OpenMobileNav</Button>
                </SheetTrigger>
                <SheetContent side={"left"} className='border-none bg-dark-1'>
                    <Link href={"/"} className='flex items-center gap-2'>
                        <p className='text-[26px] font-extrabold text-white'>Meetup</p>
                    </Link>
                    <div className='flex flex-col justify-between overflow-y-auto h-[calc(100vh-72px)]'>
                        <SheetClose asChild>
                            <section className='h-full flex flex-col gap-6 pt-16 text-white'>
                                {
                                    navLinks.map((link:any) => {
                                        const isActive = pathName === link.route
                                        return (
                                            <SheetClose key={link} asChild>
                                                <Link
                                                    key={link} href={link.route}
                                                    className={`${isActive && "bg-blue-1"} flex gap-4 items-center p-4 rounded-lg w-full max-w-60`}
                                                >
                                                    <p className='font-semibold'>
                                                        {link.label}
                                                    </p>
                                                </Link>
                                            </SheetClose>
                                        )
                                    })
                                }
                            </section>
                        </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>
        </section>
    )
}

export default MobileSideNav