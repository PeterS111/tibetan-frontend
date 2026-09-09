// app/ClerkClientProvider.tsx
"use client";

import { ClerkProvider } from "@clerk/clerk-react";

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function ClerkClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider 
      publishableKey={clerkPubKey!}
      appearance={{
        layout: {
          logoImageUrl: "/icon.png", 
          logoPlacement: "inside",
        },
        elements: {
          // This is what removes "Welcome to Clerk"
          headerTitle: "Learn Tibetan",
          headerSubtitle: "Sign in to access your scholar's dashboard",
          
          // These match your app's minimalist, print-like aesthetic
          card: "rounded-none border border-stone-200 shadow-xl bg-[#FCFBF9]",
          headerTitle__text: "font-serif text-2xl text-stone-900",
          formButtonPrimary: "bg-[#EAB308] hover:bg-[#E5AC00] text-stone-900 font-bold rounded-none shadow-sm transition-colors border-none",
          formFieldInput: "rounded-none border-stone-300 focus:border-[#EAB308] focus:ring-[#EAB308]/20 bg-white",
          footerActionLink: "text-[#B45309] hover:text-stone-900 font-medium transition-colors",
          socialButtonsBlockButton: "rounded-none border border-stone-200 hover:bg-stone-50",
          userButtonAvatarBox: "rounded-full",
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
}