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
        <link rel="icon" type="image/x-icon" href="/logo.svg" />
      </head>
      <body>
        <NavBar />
        <Toaster />
        {children}
      </body>
    </html>
  );
}