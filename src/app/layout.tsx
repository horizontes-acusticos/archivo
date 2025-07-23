import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AudioPlayer } from "@/components/HowlerAudioPlayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Improves loading performance
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false, // Don't preload mono font if not immediately used
});

export const metadata: Metadata = {
  title: "Archivo Horizontes Acústicos",
  description: "Archivo de audio para https://horizontesacusticos.cl/",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* No more AudioProvider needed - using Zustand! */}
        {children}
        <AudioPlayer />
        <Toaster />
      </body>
    </html>
  );
}
