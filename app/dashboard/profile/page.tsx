"use client";

import { UserProfile } from "@clerk/clerk-react";
import Link from "next/link";
import { ChevronRight, HelpCircle, Heart, Info, FileText, Shield } from "lucide-react";
import { usePlatform } from "@/hooks/usePlatform";

export default function ProfilePage() {
  const { isNative } = usePlatform();

  return (
    <div className="max-w-4xl mx-auto pb-24 animate-in fade-in">
      
      {/* NATIVE APP MENU (Only shows on mobile app) */}
      {isNative && (
        <div className="mb-12 space-y-8">
          <div>
            <div className="text-eyebrow mb-3 px-1">About & Help</div>
            <div className="bg-surface border border-border-subtle divide-y divide-border-subtle shadow-sm">
              <Link href="/about" className="flex items-center justify-between p-4 active:bg-surface-muted transition-colors"><div className="flex items-center gap-3 text-sm font-medium text-ink"><Info size={18} className="text-ink-muted"/> About</div><ChevronRight size={16} className="text-ink-muted"/></Link>
              <Link href="/support" className="flex items-center justify-between p-4 active:bg-surface-muted transition-colors"><div className="flex items-center gap-3 text-sm font-medium text-ink"><HelpCircle size={18} className="text-ink-muted"/> Support</div><ChevronRight size={16} className="text-ink-muted"/></Link>
              <Link href="/donate" className="flex items-center justify-between p-4 active:bg-surface-muted transition-colors"><div className="flex items-center gap-3 text-sm font-bold text-brand-dark"><Heart size={18} className="text-brand"/> Donate</div><ChevronRight size={16} className="text-ink-muted"/></Link>
            </div>
          </div>

          <div>
            <div className="text-eyebrow mb-3 px-1">Legal</div>
            <div className="bg-surface border border-border-subtle divide-y divide-border-subtle shadow-sm">
              <Link href="/privacy" className="flex items-center justify-between p-4 active:bg-surface-muted transition-colors"><div className="flex items-center gap-3 text-sm font-medium text-ink"><Shield size={18} className="text-ink-muted"/> Privacy Policy</div><ChevronRight size={16} className="text-ink-muted"/></Link>
              <Link href="/terms" className="flex items-center justify-between p-4 active:bg-surface-muted transition-colors"><div className="flex items-center gap-3 text-sm font-medium text-ink"><FileText size={18} className="text-ink-muted"/> Terms of Service</div><ChevronRight size={16} className="text-ink-muted"/></Link>
            </div>
          </div>
        </div>
      )}

      {/* CLERK ACCOUNT SETTINGS */}
      <div className="text-eyebrow mb-3 px-1">Account Settings</div>
      <div className="overflow-hidden border border-border-subtle shadow-sm bg-surface">
        <UserProfile 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "rounded-none shadow-none border-none w-full max-w-full",
              headerTitle: "font-serif text-2xl text-ink",
            }
          }}
        />
      </div>
    </div>
  );
}