import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, BookOpen, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Clock, Calendar, GraduationCap,
  Plus, Trash2
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  difficulty: 1 | 2 | 3; // 1: Easy, 2: Medium, 3: Hard
}

function useStudyCalc() {
  const [examDate, setExamDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [dailyHours, setDailyHours] = useState(3);
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: 'Mathematics', difficulty: 3 },
    { id: '2', name: 'History', difficulty: 1 }
  ]);

  const addSubject = () => {
    setSubjects([...subjects, { id: Math.random().toString(), name: '', difficulty: 2 }]);
  };

  const updateSubject = (id: string, field: keyof Subject, value: any) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const result = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const target = new Date(examDate + 'T00:00:00');
    const daysLeft = Math.max(0, Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    
    const totalAvailableHours = daysLeft * dailyHours;
    
    const totalWeight = subjects.reduce((acc, s) => acc + s.difficulty, 0);
    
    const schedule = subjects.map(s => {
      const share = totalWeight > 0 ? (s.difficulty / totalWeight) : 0;
      const hours = totalAvailableHours * share;
      return {
        ...s,
        allocatedHours: Math.round(hours * 10) / 10,
        dailyMinutes: Math.round((hours / Math.max(1, daysLeft)) * 60)
      };
    });

    return {
      daysLeft,
      totalAvailableHours,
      schedule
    };
  }, [examDate, dailyHours, subjects]);

  return {
    examDate, setExamDate,
    dailyHours, setDailyHours,
    subjects, addSubject, updateSubject, removeSubject,
    result
  };
}

function ResultInsight({ result }: { result: any }) {
  if (!result || result.daysLeft <= 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20"
    >
       <div className="flex gap-4 items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg">
             <GraduationCap className="w-6 h-6" />
          </div>
          <div className="text-left">
             <h3 className="font-black text-foreground text-xl">Your Study Roadmap</h3>
             <p className="text-sm text-muted-foreground font-medium">{result.daysLeft} days remaining • {result.totalAvailableHours} total study hours</p>
          </div>
       </div>

       <div className="space-y-3">
          {result.schedule.map((s: any) => (
            <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
               <div>
                  <p className="font-bold text-foreground">{s.name || 'Untitled Subject'}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                     {s.difficulty === 1 ? 'Focus: Light' : s.difficulty === 2 ? 'Focus: Moderate' : 'Focus: Heavy'}
                  </p>
               </div>
               <div className="text-right">
                  <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">{s.allocatedHours}h</p>
                  <p className="text-[10px] text-muted-foreground font-bold">{s.dailyMinutes} mins / day</p>
               </div>
            </div>
          ))}
       </div>
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-indigo-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-indigo-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
             <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StudyTimeCalculator() {
  const calc = useStudyCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Study Time Calculator – Plan Your Exam Preparation Schedule"
        description="Optimize your study sessions. Calculate exactly how many hours to spend on each subject based on your exam date and difficulty levels."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <span className="text-foreground">Study Time Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-indigo-500/15 bg-gradient-to-br from-indigo-500/5 via-card to-blue-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            Academic Success
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Study Time Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Don't just study hard, study smart. Allocate your limited time proportionally to subject difficulty and ensure you cover everything before the big day.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> Logical
            </span>
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-full border border-indigo-500/20">
              <Zap className="w-3.5 h-3.5" /> Efficient
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            {/* Tool Widget */}
            <section className="space-y-6">
              <div className="rounded-2xl border border-indigo-500/20 shadow-xl bg-card overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-blue-400" />
                <div className="p-6 md:p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest block">Goal: Exam Date</label>
                      <input 
                        type="date" 
                        className="tool-calc-input w-full font-bold" 
                        value={calc.examDate} 
                        onChange={e => calc.setExamDate(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest block">Daily Study Hours</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="24"
                        className="tool-calc-input w-full font-bold" 
                        value={calc.dailyHours} 
                        onChange={e => calc.setDailyHours(parseInt(e.target.value) || 0)} 
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                       <label className="text-xs font-black text-muted-foreground uppercase tracking-widest block">Subjects & Difficulty</label>
                       <button onClick={calc.addSubject} className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                          <Plus className="w-3 h-3" /> Add Subject
                       </button>
                    </div>
                    <div className="space-y-3">
                       {calc.subjects.map(s => (
                         <div key={s.id} className="flex flex-wrap md:flex-nowrap gap-3 items-center p-3 rounded-xl bg-muted/30 border border-border">
                            <input 
                              type="text" 
                              placeholder="Subject Name" 
                              className="bg-transparent border-none outline-none font-bold text-sm flex-1 min-w-[150px]" 
                              value={s.name} 
                              onChange={e => calc.updateSubject(s.id, 'name', e.target.value)}
                            />
                            <div className="flex gap-1 bg-card rounded-lg p-1 border border-border">
                               {[1, 2, 3].map(lvl => (
                                 <button
                                   key={lvl}
                                   onClick={() => calc.updateSubject(s.id, 'difficulty', lvl)}
                                   className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${
                                     s.difficulty === lvl 
                                       ? 'bg-indigo-500 text-white shadow-sm' 
                                       : 'text-muted-foreground hover:bg-muted'
                                   }`}
                                 >
                                   {lvl === 1 ? 'Easy' : lvl === 2 ? 'Mid' : 'Hard'}
                                 </button>
                               ))}
                            </div>
                            <button onClick={() => calc.removeSubject(s.id)} className="text-muted-foreground hover:text-red-500 p-1">
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                       ))}
                    </div>
                  </div>

                  <ResultInsight result={calc.result} />
                </div>
              </div>
            </section>

            {/* Content Section */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
               <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">The Science of Study Allocation</h2>
               <p className="text-muted-foreground leading-relaxed mb-6">
                 Revision is a race against time. The most common mistake is spending too much time on easy subjects (where you feel confident) and avoiding the difficult ones until it's too late.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                   <h3 className="font-bold text-foreground">Proportional Intensity</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     Our calculator uses a weighting system. "Hard" subjects get 3x the time of "Easy" ones. This ensures your mental energy is focused where the biggest grade improvements are possible.
                   </p>
                 </div>
                 <div className="space-y-4">
                   <h3 className="font-bold text-foreground">Interleaving Effect</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     Try switching subjects every hour. Even though our tool gives you total hours, breaking them into smaller daily chunks across all subjects improves long-term retention compared to "cramming" one subject for three days.
                   </p>
                 </div>
               </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Revision FAQ</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How much study is too much?"
                  a="Research suggests that focus dips significantly after 4-5 hours of intense cognitive work. If you find your 'Daily Hours' exceeding 6, consider starting your preparation earlier to spread the load."
                />
                <FaqItem
                  q="What defines a 'Hard' subject?"
                  a="Hard subjects are typically those involving complex problem-solving (Physics, Math) or massive memorization (Biology, Law). If you consistently score lower in a subject's mock tests, mark it as 'Hard'."
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
             <div className="sticky top-28 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-4 text-center">
                   <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-2">Save Plan</h3>
                   <p className="text-[10px] text-muted-foreground mb-4 font-medium">Coming soon: Export to PDF/Calendar.</p>
                   <button
                    onClick={copyLink}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 transition-transform shadow-md"
                  >
                    {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                  </button>
                </div>
                
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
                   <GraduationCap className="w-8 h-8 mb-4 opacity-50" />
                   <h4 className="font-black text-sm mb-2">Final Push?</h4>
                   <p className="text-[11px] leading-relaxed opacity-90">
                     Use the Pomodoro technique (25m study / 5m break) to stay sharp during your allocated hours.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
