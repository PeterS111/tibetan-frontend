import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Lora, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import FeedbackWidget from "./components/FeedbackWidget";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learn Tibetan UK",
  description: "Tibetan Language AI Tutor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-serif bg-stone-50 text-stone-900">
        <ClerkProvider>
          {children}
          {/* We removed the <SignedIn> wrapper here */}
          <FeedbackWidget />
        </ClerkProvider>
      </body>
    </html>
  );
}