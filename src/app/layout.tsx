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
  title: "Dispositivo Aural de Escucha Compartida",
  description: "350 horas de selva valdiviana, grabadas durante las cuatro estaciones del 2023, en la cordillera de la costa de la comuna de Valdivia",
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
