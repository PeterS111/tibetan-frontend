"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Star, Users, User, X, Calendar as CalendarIcon, Loader2, Info } from "lucide-react";

type Teacher = { id: number; name: string; dialect: string; rating: string; sessions: number; description: string; price: number; initial: string; color: string; };
type BookedSlot = { day: string; time: string; };

const DAYS = ["MON 21", "TUE 22", "WED 23", "THU 24", "FRI 25", "SAT 26", "SUN 27"];
const TIMES = ["09:00", "10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];

export default function TutorsPage() {
  const { getToken } = useAuth();
  
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);

  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const [sessionType, setSessionType] = useState<"Individual" | "Group">("Individual");
  const [selectedSlot, setSelectedSlot] = useState<BookedSlot | null>(null);
  
  const [isBooking, setIsBooking] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  // 1. Fetch Teachers from Supabase
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teachers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.teachers && data.teachers.length > 0) {
          setTeachers(data.teachers);
          setSelectedTeacherId(data.teachers[0].id);
        }
      } catch (e) { console.error(e); }
      setIsLoadingTeachers(false);
    };
    fetchTeachers();
  }, [getToken]);

  // 2. Fetch Booked Slots when a Teacher is selected
  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedTeacherId) return;
      try {
        const token = await getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings?teacher_id=${selectedTeacherId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setBookedSlots(data.bookings || []);
      } catch (e) { console.error(e); }
    };
    fetchBookings();
  }, [selectedTeacherId, getToken]);

  const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);

  // 3. Dynamic Availability Checker
  const isSlotFree = (day: string, time: string) => {
    return !bookedSlots.some(b => b.day === day && b.time === time);
  };

  const handleSlotClick = (day: string, time: string) => {
    if (isSlotFree(day, time)) {
      setSelectedSlot({ day, time });
    }
  };

  // 4. Save Booking to Database
  const handleConfirmBooking = async () => {
    if (!selectedTeacherId || !selectedSlot) return;
    setIsBooking(true);
    
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("teacher_id", selectedTeacherId.toString());
      formData.append("day", selectedSlot.day);
      formData.append("time", selectedSlot.time);
      formData.append("session_type", sessionType);

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      // Add it to local state immediately so it vanishes from the UI
      setBookedSlots(prev => [...prev, { day: selectedSlot.day, time: selectedSlot.time }]);
      setSelectedSlot(null);

    } catch (e) { console.error(e); }

    setIsBooking(false);
    
    // TEMPORARY INTERCEPTOR: Show this message even though it successfully saved to DB.
    setShowComingSoon(true);
  };

  if (isLoadingTeachers) {
    return <div className="flex items-center justify-center h-[60vh]"><Loader2 size={40} className="animate-spin text-amber-500" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 pb-32 animate-in fade-in duration-500 font-sans">
      
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-[11px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-3">Beginner · 1-on-1 & Small Group</h2>
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-stone-900 border-b border-[#e8e4d9] pb-6">
          Live Teachers
        </h1>
      </div>

      {/* Teacher Selection */}
      <div className="mb-12">
        <h3 className="text-[11px] font-bold text-amber-600 uppercase tracking-[0.15em] mb-4">Verified Native Speakers</h3>
        <h2 className="text-2xl font-bold text-stone-900 font-serif mb-6">Find your teacher</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => {
            const isSelected = selectedTeacherId === teacher.id;
            return (
              <div 
                key={teacher.id} 
                onClick={() => { setSelectedTeacherId(teacher.id); setSelectedSlot(null); }}
                className={`bg-white border rounded-2xl p-6 cursor-pointer transition-all duration-300 flex flex-col ${isSelected ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md' : 'border-[#e8e4d9] hover:border-amber-300 shadow-sm'}`}
              >
                <div className="flex gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-none ${teacher.color} flex items-center justify-center text-white font-serif text-2xl shrink-0`}>
                    {teacher.initial}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-stone-900">{teacher.name}</h3>
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">{teacher.dialect}</div>
                    <div className="flex items-center gap-1 text-sm font-medium text-stone-600">
                      <Star size={14} className="fill-amber-500 text-amber-500" /> {teacher.rating} · {teacher.sessions} sessions
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-stone-500 mb-6 flex-1 leading-relaxed">
                  {teacher.description}
                </p>
                
                <div className="flex items-center justify-between border-t border-[#e8e4d9] pt-4">
                  <div className="text-lg font-serif text-stone-900">£{teacher.price}<span className="text-sm text-stone-400 font-sans">/hour</span></div>
                  <button className="text-sm font-bold text-stone-600 border border-stone-200 px-4 py-2 rounded-lg hover:bg-stone-50 transition">
                    View profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Calendar */}
      {selectedTeacher && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-[11px] font-bold text-amber-600 uppercase tracking-[0.15em] mb-1">Availability · This Week</h3>
              <h2 className="text-2xl font-bold text-stone-900 font-serif">Book a session with {selectedTeacher.name}</h2>
            </div>
            
            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 w-fit shrink-0">
              <button 
                onClick={() => setSessionType("Group")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition ${sessionType === "Group" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
              >
                <Users size={16} /> Group
              </button>
              <button 
                onClick={() => setSessionType("Individual")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition ${sessionType === "Individual" ? "bg-stone-800 text-white shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
              >
                <User size={16} /> Individual
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#e8e4d9] rounded-2xl shadow-sm overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Calendar Header */}
              <div className="grid grid-cols-8 border-b border-[#e8e4d9]">
                <div className="p-4 bg-[#fdfbf7]"></div> {/* Empty top-left cell */}
                {DAYS.map(day => (
                  <div key={day} className="p-4 text-center text-[10px] font-bold text-stone-500 uppercase tracking-widest border-l border-[#e8e4d9]">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Body */}
              {TIMES.map(time => (
                <div key={time} className="grid grid-cols-8 border-b border-[#e8e4d9] last:border-b-0">
                  <div className="p-4 text-center text-xs font-bold text-stone-600 bg-[#fdfbf7] flex items-center justify-center">
                    {time}
                  </div>
                  {DAYS.map(day => {
                    const free = isSlotFree(day, time);
                    const isSelected = selectedSlot?.day === day && selectedSlot?.time === time;
                    
                    return (
                      <div key={`${day}-${time}`} className="p-2 border-l border-[#e8e4d9] flex items-center justify-center h-16">
                        {free ? (
                          <button 
                            onClick={() => handleSlotClick(day, time)}
                            className={`w-full h-full rounded-lg text-xs font-bold transition-all ${isSelected ? 'bg-amber-500 text-white shadow-md scale-95' : 'bg-white hover:bg-stone-50 text-stone-600 border border-[#e8e4d9]'}`}
                          >
                            {isSelected ? "Selected" : "Free"}
                          </button>
                        ) : (
                          <div className="w-full h-full rounded-lg text-stone-300 bg-stone-50 flex items-center justify-center">
                            Booked
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Bar */}
      {selectedSlot && selectedTeacher && (
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-[#fdfbf7] border-t border-[#e8e4d9] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] p-4 sm:p-6 z-40 animate-in slide-in-from-bottom-full duration-300">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-full md:w-auto text-center md:text-left">
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mb-1">Ready to confirm</div>
              <h3 className="text-lg font-bold text-stone-800 font-serif mb-1">
                {selectedSlot.day} · {selectedSlot.time} · 60 min with {selectedTeacher.name}
              </h3>
              <p className="text-sm text-stone-500">
                {sessionType} session · meeting link will be sent via Zoom and Google Meet.
              </p>
            </div>
            
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <div className="text-2xl font-bold font-serif text-stone-900">£{selectedTeacher.price}</div>
                <div className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Including VAT</div>
              </div>
              <button 
                onClick={handleConfirmBooking}
                disabled={isBooking}
                className="bg-[#9c531d] hover:bg-[#864618] text-white px-8 py-3.5 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70 min-w-[200px] justify-center"
              >
                {isBooking ? <Loader2 size={18} className="animate-spin" /> : <>✓ Confirm booking</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setShowComingSoon(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowComingSoon(false)} className="absolute top-4 right-4 text-stone-400 hover:bg-stone-100 p-2 rounded-lg transition"><X size={20}/></button>
            
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 border border-amber-200">
              <CalendarIcon size={32} />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 font-serif mb-3">Live Tutoring is Coming Soon!</h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              (Note: Your booking was successfully saved in the database for testing). 
              <br/><br/>
              We are currently onboarding our certified native Tibetan teachers to the platform. The 1-on-1 and Group booking feature will be fully unlocked in our upcoming platform update.
            </p>
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-start gap-3 mb-8">
              <Info size={18} className="text-stone-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-stone-600">
                In the meantime, continue utilizing Dolma AI in the Chat tab for 24/7 conversational practice.
              </p>
            </div>
            <button onClick={() => setShowComingSoon(false)} className="w-full bg-stone-800 hover:bg-stone-700 text-white font-bold py-3.5 rounded-xl transition-colors">
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
}