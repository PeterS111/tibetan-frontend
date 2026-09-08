"use client"; // <-- This tells Next.js it's safe to run client hooks here!

import { ClerkProvider } from "@clerk/clerk-react";

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function ClerkClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={clerkPubKey!}>
      {children}
    </ClerkProvider>
  );
}