import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import NavBar from "../../components/NavBar";
import { Toaster } from "../../components/ui/toaster";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import "./globals.css";
import React from "react";

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
}); 
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
    <html lang="en" suppressHydrationWarning className={poppins.variable}>
      <head>
        <link rel="icon" type="image/x-icon" href="/logo.svg" />
        {/* Load only @ffmpeg/ffmpeg UMD — util is broken as a browser script, we implement toBlobURL inline */}
        <Script src="https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.js" strategy="beforeInteractive" crossOrigin="anonymous" />
      </head>
      <body className={poppins.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavBar />
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}