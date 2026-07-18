"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { Check, X, Trophy, ArrowRight, BrainCircuit, RefreshCcw, Loader2, List, Play } from "lucide-react";

type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const MODULE_OPTIONS = [
  "Module 1: The 30 Consonants", 
  "Module 2: The Four Vowels",
  "Module 3: The Three Superscripts"
];

export default function ExercisesPage() {
  const { getToken, userId } = useAuth();
  const { user } = useUser();
  
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Default selection
  const [selectedModule, setSelectedModule] = useState(MODULE_OPTIONS[0]);

  const startQuiz = async (moduleToFetch: string) => {
    setHasStarted(true);
    setIsLoading(true);
    
    // Reset state for new quiz
    setCurrentStep(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setQuizData([]);
    
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("topic", moduleToFetch); 

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate-quiz`, {
         method: "POST",
         headers: { Authorization: `Bearer ${token}` },
         body: formData
      });
      const data = await res.json();
      if (data.quiz) {
        setQuizData(data.quiz);
      }
    } catch(e) {
      console.error("Failed to generate AI quiz", e);
    }
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null) return;
    
    if (!isAnswered) {
      if (selectedAnswer === quizData[currentStep].correctIndex) {
        setScore(prev => prev + 1);
      }
      setIsAnswered(true);
    } else {
      if (currentStep < quizData.length - 1) {
        setCurrentStep(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setIsFinished(true);
        saveScoreToDatabase();
      }
    }
  };

  const saveScoreToDatabase = async () => {
    if (!userId || score === 0) return;
    setIsSaving(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("new_words", (score * 2).toString()); 
      
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/update-words`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
    } catch (e) {}
    setIsSaving(false);
  };

  // --- 1. START SCREEN ---
  if (!hasStarted) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-8 pt-20 animate-in fade-in duration-500 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-amber-200">
          <BrainCircuit size={40} />
        </div>
        <h1 className="text-3xl font-bold font-serif text-stone-900 mb-4">Module Exercises</h1>
        <p className="text-stone-600 mb-8 max-w-md">
          Select a module from the syllabus to generate a dynamic quiz. Dolma will test your grammar and vocabulary based on the textbook.
        </p>
        
        <div className="bg-white p-6 rounded-2xl border border-[#e8e4d9] shadow-sm w-full max-w-sm flex flex-col gap-4">
          <div className="relative">
            <List size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <select 
              value={selectedModule} 
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full appearance-none bg-stone-50 border border-stone-200 text-stone-800 font-bold text-[16px] rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm cursor-pointer"
            >
              {MODULE_OPTIONS.map((mod, i) => <option key={i} value={mod}>{mod}</option>)}
            </select>
          </div>
          
          <button 
            onClick={() => startQuiz(selectedModule)}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Play size={18} className="fill-stone-900" /> Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // --- 2. LOADING SCREEN ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-stone-500 animate-pulse">
        <Loader2 size={48} className="animate-spin text-amber-500 mb-4" />
        <h2 className="text-xl font-bold font-serif text-stone-800">Reading {selectedModule}...</h2>
        <p className="text-sm">Dolma is writing a unique quiz for you.</p>
      </div>
    );
  }

  // --- 3. ERROR SCREEN ---
  if (quizData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-8">
        <h2 className="text-2xl font-bold font-serif text-stone-800 mb-2">Quiz Generation Failed</h2>
        <p className="text-stone-500">Could not connect to the AI engine. Please try again.</p>
        <button onClick={() => setHasStarted(false)} className="mt-6 px-6 py-2 bg-amber-500 rounded-lg text-white font-bold">Go Back</button>
      </div>
    );
  }

  const progressPercent = Math.round((currentStep / quizData.length) * 100);

  // --- 4. FINISHED SCREEN ---
  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto p-8 pt-20 animate-in zoom-in-95 duration-500 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-amber-200">
          <Trophy size={48} className="text-amber-500" />
        </div>
        <h1 className="text-4xl font-bold font-serif text-stone-900 mb-4">Training Complete!</h1>
        <p className="text-lg text-stone-600 mb-8 max-w-md">
          Excellent work, {user?.firstName}. You answered {score} out of {quizData.length} questions correctly on {selectedModule}. 
        </p>
        
        <div className="bg-white border border-[#e8e4d9] rounded-2xl p-6 w-full max-w-sm mb-8 shadow-sm">
          <div className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-1">Rewards Earned</div>
          <div className="flex items-center justify-center gap-2 text-3xl font-bold text-amber-600">
             {isSaving ? <Loader2 className="animate-spin" size={24}/> : `+${score * 2}`} 
             <span className="text-lg text-stone-800">Words Known</span>
          </div>
        </div>

        <div className="flex gap-4 w-full max-w-sm">
          <button onClick={() => setHasStarted(false)} disabled={isSaving} className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50">
            <RefreshCcw size={18} /> New Quiz
          </button>
          <Link href="/dashboard" className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm">
            Dashboard <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  // --- 5. ACTIVE QUIZ SCREEN ---
  const currentQ = quizData[currentStep];

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 pb-24 animate-in fade-in duration-500">
      
      {/* HEADER & PROGRESS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h2 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Vocabulary Drill</h2>
            <div className="font-bold text-stone-800">Module Review</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          {/* Active Module Selector */}
          <div className="relative">
            <List size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <select 
              value={selectedModule} 
              onChange={(e) => {
                setSelectedModule(e.target.value);
                startQuiz(e.target.value); // Re-fetch immediately if changed during a quiz
              }}
              className="appearance-none bg-white border border-stone-200 text-stone-700 font-bold text-sm rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm cursor-pointer"
            >
              {MODULE_OPTIONS.map((mod, i) => <option key={i} value={mod}>{mod}</option>)}
            </select>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-amber-600 mb-1">{currentStep + 1} of {quizData.length}</div>
            <div className="w-24 h-2 bg-stone-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="bg-white border border-[#e8e4d9] rounded-2xl p-6 sm:p-10 shadow-sm mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mb-8 leading-tight">
          {currentQ.question}
        </h1>

        <div className="space-y-3">
          {currentQ.options.map((opt, i) => {
            let stateClass = "bg-stone-50 border-stone-200 hover:border-amber-400 hover:bg-amber-50 text-stone-700";
            let icon = null;

            if (isAnswered) {
              if (i === currentQ.correctIndex) {
                stateClass = "bg-emerald-50 border-emerald-400 text-emerald-800";
                icon = <Check size={20} className="text-emerald-600" />;
              } else if (i === selectedAnswer) {
                stateClass = "bg-rose-50 border-rose-300 text-rose-700";
                icon = <X size={20} className="text-rose-500" />;
              } else {
                stateClass = "bg-stone-50 border-stone-200 text-stone-400 opacity-60";
              }
            } else if (selectedAnswer === i) {
              stateClass = "bg-amber-50 border-amber-400 text-amber-800 ring-1 ring-amber-400";
            }

            return (
              <button 
                key={i}
                onClick={() => { if (!isAnswered) setSelectedAnswer(i); }}
                disabled={isAnswered}
                className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all flex items-center justify-between font-medium text-lg ${stateClass} ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span>{opt}</span>
                {icon}
              </button>
            );
          })}
        </div>
        
        {/* EXPLANATION BLOCK */}
        {isAnswered && (
          <div className="mt-6 p-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 animate-in slide-in-from-top-4">
            <div className="flex items-center gap-2 font-bold mb-2">
              <BrainCircuit size={18} className="text-amber-600" /> Dolma's Explanation:
            </div>
            <p className="text-sm font-medium leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}
      </div>

      {/* ACTION BUTTON */}
      <div className="flex justify-end">
        <button 
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm ${selectedAnswer !== null ? 'bg-amber-500 text-stone-900 hover:bg-amber-400' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
        >
          {isAnswered ? (
             currentStep < quizData.length - 1 ? <>Next Question <ArrowRight size={18}/></> : <>Finish <Trophy size={18}/></>
          ) : (
            "Check Answer"
          )}
        </button>
      </div>
    </div>
  );
}