import { useState, useEffect, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Calendar, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Clock, Info, Timer, PartyPopper
} from "lucide-react";

function useCountdown() {
  // Try to load from URL if possible
  const getInitial = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      title: params.get('name') || "My Special Event",
      date: params.get('date') || new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16)
    };
  };

  const [eventData, setEventData] = useState(getInitial);
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(eventData.date).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        clearInterval(timer);
      } else {
        setTimeLeft({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [eventData.date]);

  const updateEvent = (field: 'title' | 'date', val: string) => {
    setEventData(prev => ({ ...prev, [field]: val }));
  };

  const shareUrl = useMemo(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('name', eventData.title);
    url.searchParams.set('date', eventData.date);
    return url.toString();
  }, [eventData]);

  return { eventData, updateEvent, timeLeft, shareUrl };
}

function CounterUnit({ val, label }: { val: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
       <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-card border border-border shadow-inner flex items-center justify-center mb-2">
          <span className="text-2xl md:text-5xl font-black text-orange-600 tabular-nums leading-none">
             {val.toString().padStart(2, '0')}
          </span>
       </div>
       <span className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-widest">{label}</span>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-orange-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-orange-500">
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

const RELATED_TOOLS = [
  { title: "Deadline Calc", slug: "deadline-calculator", icon: <BadgeCheck className="w-5 h-5" />, color: 25, benefit: "Project end dates" },
  { title: "Working Days", slug: "working-days-calculator", icon: <Clock className="w-5 h-5" />, color: 140, benefit: "Business gap count" },
  { title: "Half Birthday", slug: "half-birthday-calculator", icon: <PartyPopper className="w-5 h-5" />, color: 210, benefit: "Fun milestones" },
];

export default function EventCountdownTimer() {
  const calc = useCountdown();
  const [copied, setCopied] = useState(false);

  const copyShare = () => {
    navigator.clipboard.writeText(calc.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Event Countdown Timer – Personalize Your Countdown Clock"
        description="Create a custom countdown for your next big event. Whether it's a wedding, vacation, or product launch, track every second in style."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Event Countdown</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <PartyPopper className="w-3.5 h-3.5" />
            Milestone Tracking
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Event Countdown Timer
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Celebrate the anticipation. Create a beautiful, live-updating countdown for your special moments and share the excitement with a unique link.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> Live Updates
            </span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" /> Shareable
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            {/* Tool Widget */}
            <section className="space-y-6">
              <div className="rounded-2xl border border-orange-500/20 shadow-xl bg-card overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="p-6 md:p-12 space-y-12">
                  {/* Setup */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-3">
                       <label className="text-xs font-black text-muted-foreground uppercase tracking-widest block">Event Name</label>
                       <input 
                         type="text" 
                         className="tool-calc-input w-full font-bold py-3" 
                         value={calc.eventData.title} 
                         onChange={e => calc.updateEvent('title', e.target.value)} 
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-xs font-black text-muted-foreground uppercase tracking-widest block">Event Date & Time</label>
                       <input 
                         type="datetime-local" 
                         className="tool-calc-input w-full font-bold py-3" 
                         value={calc.eventData.date} 
                         onChange={e => calc.updateEvent('date', e.target.value)} 
                       />
                    </div>
                  </div>

                  {/* Visual Counter */}
                  <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-black text-foreground mb-8 text-center px-4">
                       {calc.eventData.title}
                    </h2>
                    
                    {calc.timeLeft ? (
                      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                         <CounterUnit val={calc.timeLeft.d} label="Days" />
                         <CounterUnit val={calc.timeLeft.h} label="Hours" />
                         <CounterUnit val={calc.timeLeft.m} label="Minutes" />
                         <CounterUnit val={calc.timeLeft.s} label="Seconds" />
                      </div>
                    ) : (
                      <div className="animate-pulse flex justify-center gap-8">
                         {[1,2,3,4].map(i => <div key={i} className="w-24 h-24 rounded-2xl bg-muted" />)}
                      </div>
                    )}

                    {calc.timeLeft?.d === 0 && calc.timeLeft?.h === 0 && calc.timeLeft?.m === 0 && calc.timeLeft?.s === 0 && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }}
                        className="mt-10 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-black uppercase tracking-[0.3em]"
                      >
                         The moment is here!
                      </motion.div>
                    )}
                  </div>

                  <div className="pt-8 border-t border-border mt-8 flex flex-col items-center">
                     <p className="text-xs font-bold text-muted-foreground uppercase mb-4 tracking-widest">Share This Countdown</p>
                     <div className="flex w-full max-w-md gap-2">
                        <input 
                          readOnly 
                          className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-2 text-xs font-mono text-muted-foreground overflow-hidden text-ellipsis"
                          value={calc.shareUrl}
                        />
                        <button 
                          onClick={copyShare}
                          className="px-6 py-2 bg-orange-600 text-white font-black text-xs uppercase rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20"
                        >
                           {copied ? 'Copied' : 'Copy'}
                        </button>
                     </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Content Section */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
               <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use a Live Countdown?</h2>
               <p className="text-muted-foreground leading-relaxed mb-6">
                 Time feels abstract until we see it ticking away. A live countdown creates a psychological shift from "eventually" to "imminent," making it perfect for launch marketing or personal milestones.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <h3 className="font-bold text-foreground italic flex items-center gap-2">
                        <Timer className="w-4 h-4 text-orange-600" /> For Product Launches
                     </h3>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                        Generate "Hype" by sharing your unique countdown link in emails or social media. Customers can watch the final hours tick down before your release.
                     </p>
                  </div>
                  <div className="space-y-4">
                     <h3 className="font-bold text-foreground italic flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-600" /> For Personal Goals
                     </h3>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                        Whether it's a fitness deadline or the start of a sabbatical, having a visual representation of how close you are helps maintain motivation and focus.
                     </p>
                  </div>
               </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Countdown FAQ</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How do I set the exact time?"
                  a="Use the 'Event Date & Time' picker. It supports hours and minutes, allowing you to countdown to a midnight release or a specific afternoon ceremony."
                />
                <FaqItem
                  q="Does the countdown stop if I close my browser?"
                  a="No! The countdown is based on the system clock. When you or anyone else opens your unique link, the tool calculates the remaining time from that moment to your target date instantly."
                />
                <FaqItem
                  q="Is there a limit to how far in the future I can count?"
                  a="Technically, no. You can count down to events years away. The display will correctly show thousands of days if needed!"
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
             <div className="sticky top-28 space-y-6">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-500 text-white shadow-xl relative overflow-hidden">
                   <PartyPopper className="w-10 h-10 absolute -right-2 -bottom-2 opacity-10" />
                   <h4 className="font-black text-sm mb-2 italic">Ready to Party?</h4>
                   <p className="text-[11px] leading-relaxed opacity-90">
                     Share the link with your guests so they can stay hyped as the big moment approaches!
                   </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5">
                   <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">Related Tools</h3>
                   <div className="space-y-4">
                      {RELATED_TOOLS.map(t => (
                        <Link key={t.slug} href={`/time-date/${t.slug}`} className="flex items-center gap-3 group">
                           <div className="w-8 h-8 rounded bg-muted flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                              {t.icon}
                           </div>
                           <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">{t.title}</span>
                        </Link>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
