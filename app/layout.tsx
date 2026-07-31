// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Merriweather, Inter, Jomolhari } from "next/font/google";
import "./globals.css";

import FeedbackWidget from "./components/FeedbackWidget";

// Merriweather matches the sturdy, heavy slab-like serifs in the screenshots
const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// Inter matches the clean body copy with the single-story 'g'
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
      className={`${merriweather.variable} ${inter.variable} ${jomolhari.variable} h-full antialiased`}
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