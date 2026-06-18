import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Lora, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Introducing an elegant Serif font to match the LopLao aesthetic
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
      // Apply the Lora serif font globally alongside the others
      className={`${lora.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* We set the default font to the new Serif font, and background to a warm stone color */}
      <body className="min-h-full flex flex-col font-serif bg-stone-50 text-stone-900">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}