"use client";
import { Wrench } from "lucide-react";
import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="max-w-5xl mx-auto p-8 pb-24 flex justify-center animate-in fade-in duration-500">
      {/* We can just drop in the built-in Clerk component for now! */}
      <UserProfile />
    </div>
  );
}