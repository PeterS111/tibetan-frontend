"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { MessageSquarePlus, X, Loader2, CheckCircle2 } from "lucide-react";

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const pathname = usePathname();
  const { getToken } = useAuth();
  const formRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset success state if they closed it after a success
        if (isSuccess) resetForm();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSuccess]);

  const resetForm = () => {
    setFeedback("");
    setIsSuccess(false);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication error");

      const formData = new FormData();
      formData.append("page_url", pathname || "unknown");
      formData.append("feedback_text", feedback);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) throw new Error("Failed to submit feedback");

      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setTimeout(resetForm, 300); // Wait for closing animation before resetting
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Popover Form */}
      <div 
        ref={formRef}
        className={`mb-4 w-80 bg-white border border-[#e8e4d9] shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-amber-50 px-4 py-3 border-b border-amber-100 flex items-center justify-between">
          <h3 className="font-serif font-bold text-amber-900">Send Feedback</h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-amber-700 hover:bg-amber-200/50 p-1 rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 bg-white">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={40} className="text-emerald-500 mb-3" />
              <p className="font-medium text-stone-800">Thank you!</p>
              <p className="text-sm text-stone-500 mt-1">Your feedback helps us improve.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Notice a bug? Have a suggestion? Let us know..."
                className="w-full h-28 p-3 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none transition-all placeholder:text-stone-400 text-stone-700"
                required
              />
              {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting || !feedback.trim()}
                className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 disabled:text-stone-500 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen ? "bg-stone-800 text-white rotate-12" : "bg-white text-stone-700 border border-[#e8e4d9] hover:text-amber-600"
        }`}
        aria-label="Feedback"
      >
        <MessageSquarePlus size={22} className={isOpen ? "scale-90" : "scale-100"} />
      </button>
    </div>
  );
}