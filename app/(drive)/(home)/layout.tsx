import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import React, { ReactNode } from 'react'

function HomeLayout({ children }: { children: ReactNode }) {
    let size: any = []
    for (let index = 0; index < 100; index++) {
      size.push(index)
    }
  
    return (
        <main className="p-1 w-full min-h-screen">
            <header className="h-10 sm:h-16">
                <Header />
            </header>
            <div className='flex '>
                <Sidebar />
                <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
                    <div className="w-full">
                        {children}
                    </div>
                </section>

            </div>
        </main>
    )
}

export default HomeLayout