// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Newsreader, Inter, Jomolhari } from "next/font/google";
import "./globals.css";

import FeedbackWidget from "./components/FeedbackWidget";

const newsreader = Newsreader({
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${inter.variable} ${jomolhari.variable} h-full antialiased`}
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