'use client'

import { navLinks } from '@/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Separator } from './ui/separator'

function Sidebar() {
    const pathName = usePathname()

    return (
        <section className='bg-dark-200 sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-dark-1  pt-20 text-white max-sm:hidden lg:w-[264px]'>
            <div className="flex flex-1 flex-col gap-6">
                {
                    navLinks.map((link, idx) => {
                        // const isActive = pathName === link.route 
                        const isActive = pathName === link.route || pathName.startsWith(`${link.route}/`)
                        return (
                            <div key={idx}>
                                <Link
                                    href={link.route}
                                    className={`${isActive && "font-bold bg-dark-300"} flex px-5 gap-4 items-center py-4 rounded-lg justify-start`}
                                >
                                    <p className='text-xl font-semibold max-lg:hidden'>
                                        {link.label}
                                    </p>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </section>
    )
}

export default Sidebar