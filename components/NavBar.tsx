import React from 'react'
import Image from 'next/image'
// import Button form './ui/button'
import Link from 'next/link'
import { Button } from "./ui/button"
import { BsGithub } from "react-icons/bs";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '../components/ui/sheet';


export default function NavBar({ }): any {
    return (
        <nav className='w-full px-5 py-5 justify-evenly flex backdrop-blur-md bg-white bg-opacity-30 '>
            <Link href="/">
                <Image
                    alt="logo"
                    className="cursor-pointer"
                    src="./logo.svg"
                    height={30}
                    width={30}
                ></Image>
            </Link>
            <div className='gap-1 flex justify-evenly'>
                <Button variant='ghost' className='text-md'>
                    <Link href='/'> Home</Link>
                </Button>
                <Link href='/about'>
                    <Button variant="ghost" className="text-md">
                        About
                    </Button>
                </Link>
                <Link href='/who'>
                    <Button variant='ghost' className='text-md'>
                        Who
                    </Button>
                </Link>

            </div>
            <Link href="https://github.com/DharuNamikaze/Convertify">
                <Button
                    variant="default"
                    className='px-3 rounded-full bg-violet-900 hover:bg-violet-600 '
                    size="lg">
                    <span className='rounded-full'>
                        <BsGithub />
                    </span>
                </Button>
            </Link>
        </nav>
    )
}