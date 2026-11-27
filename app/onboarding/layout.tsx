// app/onboarding/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome Onboarding",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
