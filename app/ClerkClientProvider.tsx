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
          card: "rounded-none border border-border-strong shadow-xl bg-[#FAF6EC]",
          headerTitle__text: "font-serif text-2xl text-ink",
          formButtonPrimary: "bg-[#FFB600] hover:bg-[#D49700] text-ink font-bold rounded-none shadow-sm transition-colors border-none",
          formFieldInput: "rounded-none border-border-strong focus:border-[#FFB600] focus:ring-[#FFB600]/20 bg-white",
          footerActionLink: "text-ink-light hover:text-ink font-medium transition-colors", 
		  
          socialButtonsBlockButton: "rounded-none border border-stone-200 hover:bg-stone-50",
          userButtonAvatarBox: "rounded-full",
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
}