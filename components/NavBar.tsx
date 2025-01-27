import React from 'react'
import Image from 'next/image'
// import Button form './ui/button'
import Link from 'next/link'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger, 
} from '@/components/ui/sheet';


export default function NavBar({}): any{
    return (
        <nav className='p-5 w-full bg-linear-to-r from-cyan-500 to-blue-500'>
            <Link href="/">
                <Image 
                alt="logo"
                className="cursor-pointer inline"
                src="./logo.svg"
                height={25}
                width={25}
                ></Image>
            </Link>

            <Link href="/">
                <Image 
                alt="logo"
                className="cursor-pointer inline"
                src="./logo.svg"
                height={25}
                width={25}
                ></Image>
            </Link>
        </nav>
    )
}