'use client'

import { navLinks } from '@/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function Sidebar() {
    const pathName = usePathname()

    return (
        <section className='bg-dark-200 sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]'>
            <div className="flex flex-1 flex-col gap-6">
                {
                    navLinks.map((link, idx) => {
                        // const isActive = pathName === link.route 
                        const isActive = pathName === link.route || pathName.startsWith(`${link.route}/`)
                        return (
                            <Link
                                key={idx} href={link.route}
                                className={`${isActive && "bg-blue-1"} flex gap-4 items-center p-4 rounded-lg justify-start`}
                            >
                                <p className='text-lg font-semibold max-lg:hidden'>
                                    {link.label}
                                </p>
                            </Link>
                        )
                    })
                }
            </div>
        </section>
    )
}

export default Sidebar