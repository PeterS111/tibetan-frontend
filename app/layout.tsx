import type { Metadata, Viewport } from "next";
import { Merriweather, Inter, Jomolhari } from "next/font/google";
import "./globals.css";

// 1. IMPORT OUR NEW WRAPPER
import ClerkClientProvider from "./ClerkClientProvider"; 

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jomolhari = Jomolhari({
  weight: "400",
  variable: "--font-tibetan",
  subsets: ["tibetan"],
});

export const metadata: Metadata = {
  title: "Learn Tibetan UK",
  description: "Tibetan Language AI Tutor",
};

// 3. THIS LOCKS THE MOBILE SCREEN BOUNDARIES
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
	<html lang="en" className={`${merriweather.variable} ${inter.variable} ${jomolhari.variable} h-full antialiased overflow-x-hidden`}>
      <body className="min-h-full flex flex-col font-sans bg-paper text-ink selection:bg-brand-light w-full max-w-[100vw] overflow-x-hidden">
	
        {/* 2. USE THE WRAPPER INSTEAD OF CLERK PROVIDER DIRECTLY */}
        <ClerkClientProvider>
          {children}
   
        </ClerkClientProvider>
      </body>
    </html>
  );
}