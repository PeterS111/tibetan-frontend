// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Lora, Geist, Geist_Mono, Jomolhari } from "next/font/google";
import "./globals.css";

import FeedbackWidget from "./components/FeedbackWidget";

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${geistSans.variable} ${geistMono.variable} ${jomolhari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-paper text-ink selection:bg-brand-light">
        <ClerkProvider>
          {children}
          <FeedbackWidget />
        </ClerkProvider>
      </body>
    </html>
  );
}