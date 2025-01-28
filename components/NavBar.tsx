import React from 'react'
import Image from 'next/image'
// import Button form './ui/button'
import Link from 'next/link'
import { Button } from "./ui/button"
import { BsGithub } from "react-icons/bs";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../components/ui/sheet"

import { FiMenu } from "react-icons/fi";

export default function NavBar({ }): any {
    return (

        <nav className='w-full px-5 py-5 justify-between flex backdrop-blur-md bg-white bg-opacity-30 '>

            {/* Laptop Navibar */}

            <Link href="/" className='flex items-center font-semibold'>
                <Image
                    alt="logo"
                    className="cursor-pointer"
                    src="./logo.svg"
                    height={30}
                    width={30}
                ></Image>Convertify
            </Link>
            <div className='gap-1 flex justify-evenly max-md:hidden '>
                <Button variant='ghost' className='text-md'>
                    <Link href='/'> Home</Link>
                </Button>
                <Link href='/about'>
                    <Button variant="ghost" className="text-md">
                        About
                    </Button>
                </Link>
                <Link href='https://github.com/DharuNamikaze'>
                    <Button variant='ghost' className='text-md'>
                        Who
                    </Button>
                </Link>

            </div>
            <Link href="https://github.com/DharuNamikaze/Convertify" className='max-md:hidden'>
                <Button
                    variant="default"
                    className='px-3 rounded-full bg-violet-900 hover:bg-black'
                    size="lg">
                    <span className='rounded-full'>
                        <BsGithub />
                    </span>
                </Button>
            </Link>

            {/* Mobile Navibar */}
            <Sheet>
                <SheetTrigger className="block md:hidden p-2"><FiMenu className='w-5 h-5'/></SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle></SheetTitle>
                        <SheetDescription>
                            <p className='flex flex-col gap-2'>
                                <Button variant='ghost' className='text-md'>
                                    <Link href='/'> Home</Link>
                                </Button>
                                <Button variant="ghost">
                                    <Link href='/about' className="text-md">
                                        About
                                    </Link>
                                </Button>
                                <Button variant='ghost' className='text-md'>
                                    <Link href='https://github.com/DharuNamikaze'>
                                        Who
                                    </Link>
                                </Button>

                                <Link href="https://github.com/DharuNamikaze/Convertify" >
                                    <Button
                                        variant="default"
                                        className='px-3 rounded-full bg-violet-900 hover:bg-black '
                                        size="lg">
                                        <span className='rounded-full'>
                                            <BsGithub />
                                        </span>
                                    </Button>
                                </Link>
                            </p>

                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </nav>
    )
}