import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Timer, Play, Pause,
  RotateCcw, Flag, Clock, Zap, Smartphone, Shield,
  Lightbulb, Copy, Check, BadgeCheck, Lock
} from "lucide-react";

// Format time: MM:SS.CC (Centiseconds)
const formatTime = (ms: number) => {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  const centi = Math.floor((ms % 1000) / 10);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centi.toString().padStart(2, '0')}`;
};

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
  { title: "Countdown Timer", slug: "countdown-timer", icon: <Clock className="w-5 h-5" />, color: 25, benefit: "Count down to deadlines" },
  { title: "Time Duration", slug: "time-duration-calculator", icon: <Timer className="w-5 h-5" />, color: 140, benefit: "Calculate gap between times" },
  { title: "Work Hours", slug: "work-hours-calculator", icon: <Flag className="w-5 h-5" />, color: 210, benefit: "Track shift durations" },
];

export default function StopwatchTool() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<{ id: number; time: number; split: number }[]>([]);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time;
      timerRef.current = window.setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const toggle = () => setIsRunning(!isRunning);
  
  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const addLap = () => {
    const lastLapTime = laps.length > 0 ? laps[0].time : 0;
    const split = time - lastLapTime;
    setLaps([{ id: laps.length + 1, time, split }, ...laps]);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Online Stopwatch – Accurate Digital Timer with Lap Times"
        description="Free online digital stopwatch. Track elapsed time with precision, record lap splits, and manage intervals for sports, work, or study."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Stopwatch Tool</span>
        </nav>

        {/* Hero Section */}
        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Timer className="w-3.5 h-3.5" />
            Precision Tracking
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Online Stopwatch
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            A reliable, millisecond-accurate stopwatch featuring lap recording and instant reset. Perfect for timing athletes, cooking, studying, or workplace tasks.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> High Precision
            </span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" /> Zero Lag
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Shield className="w-3.5 h-3.5" /> Browser-Based
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-3 space-y-10">
            {/* Stopwatch Widget */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="bg-card p-6 md:p-12 text-center">
                  {/* Digital Display */}
                  <div className="mb-12 font-mono tabular-nums leading-none">
                     <span className="text-7xl md:text-9xl font-black text-foreground">{formatTime(time)}</span>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap justify-center gap-4 mb-10">
                    <button
                      onClick={toggle}
                      className={`flex items-center gap-2 px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-lg ${
                        isRunning 
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30' 
                          : 'bg-orange-600 text-white border-b-4 border-orange-800'
                      }`}
                    >
                      {isRunning ? <><Pause className="w-6 h-6 fill-current" /> Pause</> : <><Play className="w-6 h-6 fill-current" /> Start</>}
                    </button>

                    <button
                      onClick={addLap}
                      disabled={time === 0}
                      className="flex items-center gap-2 px-8 py-5 rounded-2xl font-black text-xl bg-muted border border-border transition-all hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Flag className="w-6 h-6" /> Lap
                    </button>

                    <button
                      onClick={reset}
                      className="flex items-center gap-2 px-8 py-5 rounded-2xl font-black text-xl bg-card border border-border transition-all hover:bg-muted"
                    >
                      <RotateCcw className="w-6 h-6" /> Reset
                    </button>
                  </div>

                  {/* Lap List */}
                  {laps.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="max-w-md mx-auto rounded-2xl border border-border overflow-hidden bg-muted/30"
                    >
                      <div className="bg-muted px-4 py-3 flex justify-between font-bold text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
                        <span>Lap</span>
                        <span>Time</span>
                        <span>Split</span>
                      </div>
                      <div className="max-h-60 overflow-y-auto divide-y divide-border">
                        {laps.map((lap) => (
                          <div key={lap.id} className="flex justify-between items-center px-4 py-3 text-sm font-mono tracking-tight">
                            <span className="text-muted-foreground font-bold">#{lap.id.toString().padStart(2, '0')}</span>
                            <span className="text-foreground font-bold">{formatTime(lap.time)}</span>
                            <span className="text-orange-500 font-bold">+{formatTime(lap.split)}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </section>

            {/* Content Sections */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Master Your Time</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
                <div className="p-5 rounded-xl bg-orange-500/5 border border-orange-500/10">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold mb-2">Sports & Fitness</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Time your sprints, resting intervals, or gym circuits with lap accuracy.</p>
                </div>
                <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/10">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold mb-2">Study Method</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Track Pomodoro sessions and focus blocks to improve productivity.</p>
                </div>
                <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold mb-2">Sync Anywhere</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Runs in any modern browser on mobile, tablet, or desktop systems.</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Our digital stopwatch is built for speed and reliability. Unlike physical stopwatches that may have mechanical delays, this online version triggers instantly upon interaction. Use the lap feature to measure intervals within a longer session without stopping the main clock.
              </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Stopwatch FAQ</h2>
              <div className="space-y-3">
                <FaqItem
                  q="Does the stopwatch continue if I switch tabs?"
                  a="Yes! The stopwatch uses the system timestamp to calculate elapsed time, meaning it will remain accurate even if you switch browser tabs or minimize the window. However, most browsers may pause UI updates while the tab is inactive."
                />
                <FaqItem
                  q="How precise is this digital timer?"
                  a="The stopwatch tracks time to the millisecond (1/1000th of a second). The display shows centiseconds (1/100th) for optimal readability while maintaining professional-grade timing under the hood."
                />
                <FaqItem
                  q="Can I export my lap times?"
                  a="Currently, you can view your lap history in the session list. If you need to save them, we recommend taking a screenshot or copying the values into a spreadsheet before resetting the clock."
                />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              {/* Related Tools */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={`/time-date/${tool.slug}`} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                      <div className="w-8 h-8 rounded-md bg-orange-500/10 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate group-hover:text-orange-500 transition-colors uppercase tracking-tight">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate font-medium">{tool.benefit}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-2">Share Tool</h3>
                <p className="text-xs text-muted-foreground mb-4 font-medium leading-relaxed">Help others track their timing with precision.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform shadow-md shadow-orange-500/10"
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
