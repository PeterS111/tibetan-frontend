"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { MessageSquarePlus, X, Loader2, CheckCircle2, Heart } from "lucide-react";

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const pathname = usePathname();
  const { getToken } = useAuth();

  // Lock body scrolling when the popup window is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const resetForm = () => {
    setFeedback("");
    setIsSuccess(false);
    setError("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetForm, 300); // Wait for fade-out before resetting text
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
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error("Failed to submit feedback");

      setIsSuccess(true);
      setTimeout(() => handleClose(), 2500);

    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 
        HIGHLY VISIBLE TOP BUTTON 
        A large, prominent pill floating at the top-center of the screen.
      */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-lg flex justify-center pointer-events-none">
        <button
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto group flex items-center justify-center gap-3 bg-amber-600/95 backdrop-blur-md text-white shadow-lg px-6 py-3 rounded-full hover:bg-amber-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-amber-500"
        >
          <MessageSquarePlus size={24} className="text-amber-100 group-hover:scale-110 transition-transform hidden sm:block" />
          <div className="flex flex-col text-center sm:text-left">
            <span className="font-bold text-base md:text-lg leading-tight tracking-wide">
              Please leave feedback
            </span>
            <span className="text-xs md:text-sm text-amber-100 font-medium">
              Help us improve the website!
            </span>
          </div>
        </button>
      </div>

      {/* 
        POPUP WINDOW MODAL (Not fullscreen)
        A nicely sized window centered on the screen with a dark dimming overlay.
      */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Window Header */}
            <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center justify-between">
              <h2 className="font-serif font-bold text-xl text-amber-900">
                Send Feedback
              </h2>
              <button 
                onClick={handleClose}
                className="text-amber-700 hover:bg-amber-200/50 p-1.5 rounded-lg transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Window Body */}
            <div className="p-6 bg-white">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} className="text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-800 mb-1">Thank you!</h3>
                  <p className="text-sm text-stone-500 flex items-center justify-center gap-1.5">
                    Your feedback helps us grow. <Heart size={16} className="text-rose-500 fill-rose-500" />
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Notice a bug? Have a suggestion? We're listening..."
                    className="w-full h-32 p-4 text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 resize-none transition-all placeholder:text-stone-400 text-stone-800"
                    required
                    autoFocus
                  />
                  
                  {error && (
                    <div className="bg-rose-50 text-rose-600 px-3 py-2 rounded-lg text-xs font-medium border border-rose-100">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2.5 text-stone-600 text-sm font-medium hover:bg-stone-100 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !feedback.trim()}
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 disabled:text-stone-500 text-white text-sm font-bold rounded-xl transition-all shadow flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}