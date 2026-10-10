// app/onboarding/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Loader2, ArrowRight, Check } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

const GOAL_OPTIONS = [
  { id: "dharma", label: "To study the Dharma" },
  { id: "culture", label: "To connect with Tibetan culture" },
  { id: "travel", label: "Preparing for travel" },
  { id: "brain", label: "Mental exercise / Challenge" },
  { id: "heritage", label: "Family / Heritage" },
  { id: "other", label: "Other" }
];

export default function OnboardingPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useUser();
  
  const [step, setStep] = useState<"survey" | "ready">("survey");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const saveSurveyAndContinue = async () => {
    if (selectedGoals.length === 0 || !user) return;
    setIsSaving(true);
    
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("goals", JSON.stringify(selectedGoals));
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/onboarding`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${res.status}`);
      }
      
      // Only move forward if the database actually saved!
      setStep("ready"); 
    } catch (err: any) {
      console.error("Failed to save goals", err);
      // Alert the user exactly why it failed so we can fix it easily
      alert(`Could not save to database: ${err.message}. Check if Render is deployed and Supabase column exists.`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-paper flex flex-col items-center px-6 py-12">
      
      {step === "survey" && (
        <div className="w-full max-w-md flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="font-serif text-3xl md:text-4xl text-ink mb-3 text-center">
              Why are you learning Tibetan?
            </h1>
            <p className="text-ink-light text-center mb-10 text-[15px]">
              Select all that apply to help us tailor your experience.
            </p>
            
            <div className="space-y-3 mb-10">
              {GOAL_OPTIONS.map(goal => {
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`w-full flex items-center justify-between p-5 rounded-[1.25rem] border transition-all active:scale-[0.98] ${
                      isSelected 
                        ? "bg-brand/10 border-brand text-brand-dark shadow-sm" 
                        : "bg-white border-border-subtle text-ink hover:border-brand/40"
                    }`}
                  >
                    <span className="font-bold text-[15px]">{goal.label}</span>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected ? "bg-brand border-brand text-white" : "border-border-strong bg-surface-muted"
                    }`}>
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pb-safe w-full">
            <Button 
              onClick={saveSurveyAndContinue} 
              disabled={selectedGoals.length === 0 || isSaving}
              className="w-full py-4 text-[17px] bg-ink text-white hover:bg-ink-light shadow-xl disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" /> : "Continue"}
            </Button>
          </div>
        </div>
      )}

      {step === "ready" && (
        <div className="w-full max-w-md flex flex-col flex-1 justify-center animate-in fade-in slide-in-from-right-8">
          <div className="bg-white rounded-[1.5rem] border border-border-subtle p-8 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <Check size={32} strokeWidth={2.5} />
            </div>
            
            <h2 className="font-serif text-3xl text-ink mb-2">You're all set!</h2>
            <p className="text-[15px] text-ink-light mb-8">
              Your scholarly journey begins with the 30 root letters of the Tibetan script.
            </p>
            
            <div className="w-full bg-surface-muted border border-border-subtle rounded-2xl p-4 flex items-center gap-4 mb-8 text-left">
              <div className="w-12 h-12 rounded-full border border-border-strong flex items-center justify-center font-serif text-xl bg-white text-ink shrink-0">
                1
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-0.5">Up Next</div>
                <div className="font-serif font-bold text-ink">The 30 Consonants</div>
              </div>
            </div>

            <Button 
              onClick={() => router.push("/dashboard")} 
              className="w-full py-4 text-[17px] bg-ink text-white hover:bg-ink-light shadow-xl"
            >
              Start learning <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}