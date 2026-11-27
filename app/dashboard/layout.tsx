// app/dashboard/layout.tsx
import type { Metadata } from "next";
import DashboardShellLayout from "./DashboardShell";

export const metadata: Metadata = {
  title: "Scholar's Dashboard",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShellLayout>{children}</DashboardShellLayout>;
}
