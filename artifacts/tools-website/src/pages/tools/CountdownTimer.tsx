import { useState, useEffect, useRef, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Timer, Zap, Shield, Smartphone,
  Lock, BadgeCheck, Copy, Check, Play, Pause, RotateCcw,
  Plus, Clock, Calendar, ArrowRight, CalendarDays, BookOpen,
} from "lucide-react";

// ── Timer Logic ──
type TimerState = "idle" | "running" | "paused" | "done";

function useCountdown() {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [state, setState] = useState<TimerState>("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = () => { if (intervalRef.current) clearInterval(intervalRef.current); };

  const start = useCallback(() => {
    if (remaining <= 0) return;
    setState("running");
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(intervalRef.current!); setState("done"); return 0; }
        return r - 1;
      });
    }, 1000);
  }, [remaining]);

  const pause = () => { clear(); setState("paused"); };
  const resume = () => start();
  const reset = () => { clear(); setRemaining(totalSeconds); setState("idle"); };

  useEffect(() => () => clear(), []);

  const set = (s: number) => { clear(); setTotalSeconds(s); setRemaining(s); setState("idle"); };

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  const pct = totalSeconds > 0 ? (remaining / totalSeconds) * 100 : 0;

  return { state, remaining, totalSeconds, h, m, s, pct, set, start, pause, resume, reset };
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-violet-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-violet-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Presets ──
const PRESETS = [
  { label: "1 min",  s: 60   },
  { label: "5 min",  s: 300  },
  { label: "10 min", s: 600  },
  { label: "15 min", s: 900  },
  { label: "25 min", s: 1500, note: "Pomodoro" },
  { label: "30 min", s: 1800 },
  { label: "45 min", s: 2700 },
  { label: "1 hour", s: 3600 },
];

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Work Hours Calculator",      slug: "work-hours-calculator",      icon: <Clock className="w-5 h-5" />,       color: 200, benefit: "Track and sum up work hours" },
  { title: "Business Days Calculator",   slug: "business-days-calculator",   icon: <CalendarDays className="w-5 h-5" />, color: 217, benefit: "Count working days between dates" },
  { title: "Age Calculator",             slug: "age-calculator",             icon: <Calendar className="w-5 h-5" />,     color: 340, benefit: "Find your exact age" },
  { title: "Grade Calculator",           slug: "grade-calculator",           icon: <BookOpen className="w-5 h-5" />,     color: 265, benefit: "Calculate your current grade" },
];

// ── Main Component ──
export default function CountdownTimer() {
  const timer = useCountdown();
  const [hrs, setHrs] = useState("0");
  const [mins, setMins] = useState("5");
  const [secs, setSecs] = useState("0");
  const [copied, setCopied] = useState(false);

  const applyCustom = () => {
    const total = (parseInt(hrs) || 0) * 3600 + (parseInt(mins) || 0) * 60 + (parseInt(secs) || 0);
    if (total > 0) timer.set(total);
  };

  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const pad = (n: number) => n.toString().padStart(2, "0");

  const stateColor = timer.state === "done" ? "hsl(152,70%,45%)" : timer.state === "paused" ? "hsl(38,92%,50%)" : "hsl(265,70%,60%)";

  return (
    <Layout>
      <SEO
        title="Countdown Timer – Free Online Timer with Presets, Pomodoro Ready | US Online Tools"
        description="Free online countdown timer. Set any duration from seconds to hours. Includes Pomodoro 25-min preset, pause/resume, reset, and custom time input. No signup required, works on any device."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time &amp; Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <span className="text-foreground">Countdown Timer</span>
        </nav>

        {/* ── HERO ── */}
        <section className="rounded-2xl overflow-hidden border border-violet-500/15 bg-gradient-to-br from-violet-500/5 via-card to-purple-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Timer className="w-3.5 h-3.5" /> Time &amp; Date
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Countdown Timer
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Free online countdown timer with one-click presets, custom time input, pause/resume, and Pomodoro mode. No install, no signup — works instantly on any device.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Start
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Time &amp; Date &nbsp;·&nbsp; Includes Pomodoro 25-min preset &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── MAIN COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-violet-500/20 shadow-lg shadow-violet-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 to-purple-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">

                  {/* Presets */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Quick Presets</p>
                    <div className="flex flex-wrap gap-2">
                      {PRESETS.map(p => (
                        <button key={p.s} onClick={() => timer.set(p.s)}
                          className={`px-3 py-2 rounded-xl text-sm font-bold border-2 transition-all ${timer.remaining === p.s && timer.state !== "done" ? "bg-violet-500 text-white border-violet-500" : "border-border text-muted-foreground hover:border-violet-500/50 hover:text-foreground"}`}>
                          {p.label}{p.note && <span className="ml-1 text-[10px] opacity-70">({p.note})</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom input */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Custom Duration</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <input type="number" min="0" max="99" placeholder="0"
                        className="tool-calc-input w-20 text-center" value={hrs} onChange={e => setHrs(e.target.value)} />
                      <span className="text-sm font-bold text-muted-foreground">h</span>
                      <input type="number" min="0" max="59" placeholder="5"
                        className="tool-calc-input w-20 text-center" value={mins} onChange={e => setMins(e.target.value)} />
                      <span className="text-sm font-bold text-muted-foreground">m</span>
                      <input type="number" min="0" max="59" placeholder="0"
                        className="tool-calc-input w-20 text-center" value={secs} onChange={e => setSecs(e.target.value)} />
                      <span className="text-sm font-bold text-muted-foreground">s</span>
                      <button onClick={applyCustom}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-violet-500 text-white font-bold rounded-xl text-sm hover:bg-violet-600 transition-colors">
                        <Plus className="w-4 h-4" /> Set
                      </button>
                    </div>
                  </div>

                  {/* Timer display */}
                  <div className="flex flex-col items-center gap-6 py-4">
                    <div className="relative w-52 h-52">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                        <motion.circle
                          cx="60" cy="60" r="54" fill="none"
                          stroke={stateColor}
                          strokeWidth="8" strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 54}
                          strokeDashoffset={2 * Math.PI * 54 * (1 - timer.pct / 100)}
                          transition={{ duration: 0.5 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                        {timer.state === "done" ? (
                          <>
                            <p className="text-2xl font-black text-emerald-500">Done!</p>
                            <p className="text-xs text-muted-foreground">Time's up</p>
                          </>
                        ) : timer.totalSeconds === 0 ? (
                          <p className="text-sm font-bold text-muted-foreground text-center px-4">Select a preset or set custom time</p>
                        ) : (
                          <>
                            <p className="text-4xl font-black text-foreground font-mono tracking-tight">
                              {pad(timer.h)}:{pad(timer.m)}:{pad(timer.s)}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">{timer.state}</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-3">
                      {timer.state === "idle" && timer.remaining > 0 && (
                        <button onClick={timer.start}
                          className="flex items-center gap-2 px-6 py-3 bg-violet-500 text-white font-black rounded-xl hover:bg-violet-600 transition-colors">
                          <Play className="w-5 h-5" /> Start
                        </button>
                      )}
                      {timer.state === "running" && (
                        <button onClick={timer.pause}
                          className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-black rounded-xl hover:bg-amber-600 transition-colors">
                          <Pause className="w-5 h-5" /> Pause
                        </button>
                      )}
                      {timer.state === "paused" && (
                        <button onClick={timer.resume}
                          className="flex items-center gap-2 px-6 py-3 bg-violet-500 text-white font-black rounded-xl hover:bg-violet-600 transition-colors">
                          <Play className="w-5 h-5" /> Resume
                        </button>
                      )}
                      {(timer.state === "paused" || timer.state === "done" || timer.state === "running") && (
                        <button onClick={timer.reset}
                          className="flex items-center gap-2 px-4 py-3 border-2 border-border text-muted-foreground font-bold rounded-xl hover:border-foreground hover:text-foreground transition-colors">
                          <RotateCcw className="w-4 h-4" /> Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Countdown Timer</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                This timer covers everything from 30-second drills to all-day work sessions. Here's how to get the most out of it for productivity, study, exercise, and everyday timing needs.
              </p>
              <ol className="space-y-5 mb-8">
                {[
                  { title: "Select a preset or set a custom time", body: "Click any quick preset button for the most common durations — 1 min, 5 min, 25 min Pomodoro, 1 hour, and more. For a specific duration, enter hours, minutes, and seconds in the custom fields and click 'Set'. The timer resets automatically when you select a new preset, so you don't need to click Reset first." },
                  { title: "Start, pause, and resume", body: "Click 'Start' to begin the countdown. The circular progress ring depletes as time passes, giving you an at-a-glance visual of how much time remains. 'Pause' halts the timer at the exact second — useful for brief interruptions during a Pomodoro session or workout. 'Resume' continues from exactly where you stopped, not from the beginning." },
                  { title: "Reset to repeat or adjust", body: "Click 'Reset' at any time to return the timer to the full duration you originally set. This is ideal for repeating Pomodoro cycles, timed exercise sets, meeting time blocks, or board game turns without re-entering the duration each time. After the timer reaches zero, click 'Reset' to restart it." },
                ].map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">{i + 1}</div>
                    <div>
                      <p className="font-bold text-foreground mb-1">{s.title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">How the Timer Works</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The countdown uses <code className="px-1 py-0.5 bg-background rounded text-xs font-mono">setInterval</code> with a 1-second tick, decrementing a seconds counter each tick. The circular progress ring is an SVG circle whose <code className="px-1 py-0.5 bg-background rounded text-xs font-mono">stroke-dashoffset</code> is calculated as a percentage of total time elapsed. This approach is lightweight, battery-friendly, and runs entirely in your browser tab with no network requests.
                </p>
              </div>
            </section>

            {/* ── TIMER USE CASES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Timer Duration Guide</h2>
              <p className="text-muted-foreground text-sm mb-6">What each preset duration is best suited for:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                  <div className="w-3 h-3 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">25 minutes — Pomodoro Technique</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Developed by Francesco Cirillo in the late 1980s, the Pomodoro Technique uses 25-minute focused work intervals followed by 5-minute breaks. After 4 Pomodoros, take a longer 15–30 minute break. Research supports this rhythm for reducing mental fatigue and maintaining deep focus. The 25-minute window is long enough for meaningful progress but short enough to stay mentally fresh. This is the most popular productivity preset in the tool — use it for writing, coding, studying, or any task requiring uninterrupted concentration.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">5–10 minutes — Short breaks &amp; quick tasks</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">5-minute timers are standard Pomodoro break durations. They're also ideal for short meditations, brief stretching routines, timed warm-ups before exercise, and microwave or stovetop cooking checkpoints. 10 minutes covers longer breaks, a focused email triage session, a quick walk, or a standing desk interval. Both durations are short enough to stay mentally anchored to the task you'll return to.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">45–60 minutes — Deep work sessions</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">45 minutes is a common university lecture duration and a natural human attention cycle. 1-hour timers are used for time-boxed meetings, extended writing sessions, uninterrupted study blocks, and workout sessions. For meetings, set the timer at the start to enforce time discipline without watching a clock. After 60 minutes, most knowledge workers benefit from at least a 10-minute physical break before another deep work block.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">1–2 minutes — Exercise intervals &amp; short limits</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">1-minute timers are standard for high-intensity interval training (HIIT) rest periods, 60-second speech drills, game turn limits, and timed quiz questions. Use the custom input to set precise intervals like 1:30 (90 seconds) for exercises like planks or kettlebell swings. The visual ring makes it easy to see at a glance how much of the rest period remains without looking away from your workout.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Use Case</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Duration</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">How to Set</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Tip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { use: "Pomodoro work block",    dur: "25 min",    how: "Click '25 min' preset",   tip: "Follow with 5 min break" },
                      { use: "Coffee break",            dur: "5 min",     how: "Click '5 min' preset",    tip: "Walk or stretch" },
                      { use: "Meeting time box",        dur: "30 min",    how: "Click '30 min' preset",   tip: "Start at meeting start" },
                      { use: "HIIT rest period",        dur: "1:30",      how: "Custom: 0h 1m 30s",       tip: "Repeat between sets" },
                      { use: "Exam practice question",  dur: "2 min",     how: "Custom: 0h 2m 0s",        tip: "Simulate timed tests" },
                      { use: "Pasta cooking timer",     dur: "12 min",    how: "Custom: 0h 12m 0s",       tip: "Set when water boils" },
                      { use: "Board game turn limit",   dur: "30 sec",    how: "Custom: 0h 0m 30s",       tip: "Keeps game moving" },
                    ].map(row => (
                      <tr key={row.use} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">{row.use}</td>
                        <td className="px-4 py-3 font-bold text-violet-600 dark:text-violet-400">{row.dur}</td>
                        <td className="px-4 py-3 text-foreground text-xs">{row.how}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs">{row.tip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                The custom duration input is the most flexible option — enter any combination of hours, minutes, and seconds. It accepts values beyond 60 for minutes and seconds (e.g., entering 90 minutes works as a shorthand for 1 hour 30 minutes), making it fast to type without mental conversion.
              </p>
            </section>

            {/* ── WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Countdown Timer</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { title: "Pomodoro preset built in", desc: "The 25-minute Pomodoro work block is a one-click preset, labeled clearly. No need to type the duration manually. Follow it with the 5-minute preset for the standard Pomodoro break cycle." },
                  { title: "Visual ring progress display", desc: "The SVG circle ring depletes in real time, giving you an instant visual of remaining time without reading the numbers. Color changes from violet (running) to amber (paused) to green (done)." },
                  { title: "Pause and resume exactly", desc: "Pausing stops the timer at the exact second — not rounded. Resuming continues from that exact point. This is more accurate than some phone timers that round to the nearest second when paused." },
                  { title: "No install, works offline", desc: "Once the page is loaded, this timer requires no internet connection to run. Save the page as a bookmark and it works from cache. No app to install, no push notifications to manage." },
                  { title: "Custom duration down to seconds", desc: "The custom input lets you set hours, minutes, and seconds independently. Set 1:30 for a 90-second interval, 2:00 for 2 minutes, or 1:15:00 for a 75-minute session — exact precision without a separate settings screen." },
                  { title: "Session-only, privacy-safe", desc: "No data is stored. The timer state resets when you reload. There are no accounts, synced sessions, or usage tracking. What you time stays completely private." },
                ].map(f => (
                  <div key={f.title} className="p-4 rounded-xl bg-muted/50 border border-border">
                    <p className="font-bold text-foreground mb-1 text-sm">{f.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
              <div className="p-5 rounded-xl bg-muted/60 border border-border text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Note:</strong> This timer uses <code className="px-1 py-0.5 bg-background rounded text-xs font-mono">setInterval</code> and runs entirely in your browser tab. If you switch to another tab or minimize the browser, the timer continues running in the background — browser tabs are not paused when hidden in most modern browsers. However, if your device enters deep sleep or you close the tab, the timer will stop. For mission-critical timing (medical, industrial), use a dedicated hardware timer.
              </div>
            </section>

            {/* ── FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {[
                  { q: "What is the Pomodoro Technique?", a: "The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It involves working for 25 minutes (one 'Pomodoro'), then taking a 5-minute break. After 4 Pomodoros, take a longer 15–30 minute break. Studies show this method improves focus, reduces mental fatigue, and helps manage procrastination by breaking large tasks into timed increments. The name comes from the tomato-shaped kitchen timer Cirillo used as a student." },
                  { q: "Does the timer keep running if I switch tabs?", a: "Yes — the timer continues running in the background when you switch to another tab. Modern browsers keep JavaScript running for tabs that are open (though they may throttle heavily inactive tabs). However, if you close the tab entirely or reload the page, the timer stops and resets. For mission-critical timing, keep the tab visible or use a dedicated hardware timer." },
                  { q: "Can I use this timer on my phone?", a: "Yes — the timer is fully responsive and works on iOS and Android browsers. The circular ring and preset buttons scale for touch screens, and the Start/Pause controls are large enough for thumb interaction. Note that mobile browsers may throttle background tabs more aggressively than desktop browsers, which could affect timer accuracy if your phone enters low-power mode." },
                  { q: "What is the maximum duration I can set?", a: "The custom time input accepts up to 99 hours, 59 minutes, and 59 seconds — approximately 4 days of countdown time. For most practical purposes (study sessions, cooking, exercise, meetings), this covers any realistic duration. For countdowns measured in days or weeks (e.g., until an event), use a dedicated event countdown tool instead." },
                  { q: "Why is there no alarm or sound when the timer ends?", a: "Browser security restrictions prevent auto-playing audio without a user gesture on most modern browsers. The timer visually signals completion with a green 'Done!' display and color change on the progress ring. For an audible alarm, keep the browser tab visible and watch for the visual indicator, or use your device's native clock app alongside this timer." },
                ].map((item, i) => (
                  <FaqItem key={i} q={item.q} a={item.a} />
                ))}
              </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Time &amp; Productivity Tools</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore 400+ free tools including work hour calculators, business day counters, age calculators, and more — all free, all instant.
                </p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Related Tools */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={`/tools/${tool.slug}`}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-violet-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share a focused timer with your team or study group.</p>
                <button onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-500 to-purple-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Timer", "How to Use", "Duration Guide", "Quick Examples", "Why Use This", "FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-violet-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-violet-500/40 flex-shrink-0" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Pomodoro Guide */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">Pomodoro Cycle</h3>
                <div className="space-y-2">
                  {[
                    { step: "Work", dur: "25 min", color: "text-violet-600 dark:text-violet-400" },
                    { step: "Break", dur: "5 min", color: "text-emerald-600 dark:text-emerald-400" },
                    { step: "Work", dur: "25 min", color: "text-violet-600 dark:text-violet-400" },
                    { step: "Break", dur: "5 min", color: "text-emerald-600 dark:text-emerald-400" },
                    { step: "Work ×2 more", dur: "×2", color: "text-muted-foreground" },
                    { step: "Long break", dur: "15–30 min", color: "text-blue-600 dark:text-blue-400" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-0.5">
                      <span className="text-muted-foreground">{row.step}</span>
                      <span className={`font-bold ${row.color}`}>{row.dur}</span>
                    </div>
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
