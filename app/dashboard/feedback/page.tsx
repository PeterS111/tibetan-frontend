// app/dashboard/feedback/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, CheckCircle2, Heart, MessageSquarePlus } from "lucide-react";
import { Card } from "@/app/components/ui/Card";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const { getToken, isLoaded, isSignedIn } = useAuth();

  // FIX: Return a loading UI instead of `null` to satisfy Next.js's rendering engine
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 size={40} className="animate-spin text-brand" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <div className="p-8 text-center text-ink-light">Please sign in to leave feedback.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication error");

      const formData = new FormData();
      formData.append("page_url", "Dedicated Feedback Page");
      formData.append("feedback_text", feedback);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error("Failed to submit feedback");
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-ink mb-2">Send Feedback</h1>
        <p className="text-sm text-ink-light leading-relaxed">
          Notice a bug? Have a suggestion for a new feature? We are constantly improving Learn Tibetan and we read every message.
        </p>
      </div>

      <Card className="p-8">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-2xl font-serif text-ink mb-2">Thank you!</h3>
            <p className="text-sm text-ink-light flex items-center justify-center gap-1.5">
              Your feedback helps us grow. <Heart size={16} className="text-rose-500 fill-rose-500" />
            </p>
            <button 
              onClick={() => { setFeedback(""); setIsSuccess(false); }}
              className="mt-8 text-sm font-bold text-brand-dark hover:text-brand transition-colors uppercase tracking-widest"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Type your feedback here..."
                className="w-full h-40 p-5 text-sm border border-border-strong bg-surface focus:bg-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand resize-none transition-all placeholder:text-ink-muted/50 text-ink rounded-none"
                required
                autoFocus
              />
              {error && (
                <div className="mt-3 bg-rose-50 text-rose-700 px-4 py-3 text-sm font-medium border border-rose-200">
                  {error}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !feedback.trim()}
                className="px-8 py-3 bg-brand hover:bg-brand-dark disabled:bg-surface-muted disabled:text-ink-muted disabled:border disabled:border-border-subtle text-ink text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 rounded-none"
              >
                {isSubmitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Sending...</>
                ) : (
                  <><MessageSquarePlus size={16} /> Submit Feedback</>
                )}
              </button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}