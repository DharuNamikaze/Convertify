import type { Metadata } from "next";
import NavBar from "../../components/NavBar";
import { Toaster } from "../../components/ui/toaster";
import "./globals.css";
import React from "react";


export const metadata: Metadata = {
  title: "Convertify | convert any files unlimited",
  description: "Convert any file into any filetype, unlimited file conversion",
  creator: "github.com/DharuNamikaze",
  keywords: "convertor, file converter, unlimited file converter, audio video converter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <head>
        <style>@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        </style>
      </head>
      <body>
        <NavBar />
        <Toaster />
        {children}
      </body>
    </html>
  );
}