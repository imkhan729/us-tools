import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Activity, Zap, Shield, Smartphone,
  Lock, BadgeCheck, Copy, Check, Trophy, Timer, Target,
  ArrowRight, BookOpen, Flame, Droplets, Heart,
} from "lucide-react";

type Unit = "miles" | "km";
type Mode = "pace" | "time" | "distance";

const RACE_DISTANCES_MI = [
  { label: "1 Mile", mi: 1 },
  { label: "5K", mi: 3.10686 },
  { label: "10K", mi: 6.21371 },
  { label: "Half Marathon", mi: 13.1094 },
  { label: "Marathon", mi: 26.2188 },
];

function toSeconds(h: number, m: number, s: number) {
  return h * 3600 + m * 60 + s;
}

function formatTime(totalSec: number) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.round(totalSec % 60);
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

function formatPace(secPerUnit: number) {
  const m = Math.floor(secPerUnit / 60);
  const s = Math.round(secPerUnit % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-orange-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-orange-500">
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

const RELATED_TOOLS = [
  { title: "TDEE Calculator", slug: "tdee-calculator", icon: <Flame className="w-5 h-5" />, color: 0, benefit: "Total daily calorie needs" },
  { title: "Water Intake Calculator", slug: "water-intake-calculator", icon: <Droplets className="w-5 h-5" />, color: 200, benefit: "Daily hydration goal" },
  { title: "BMI Calculator", slug: "bmi-calculator", icon: <Activity className="w-5 h-5" />, color: 160, benefit: "Check your Body Mass Index" },
  { title: "BMR Calculator", slug: "bmr-calculator", icon: <Heart className="w-5 h-5" />, color: 340, benefit: "Resting metabolic rate" },
  { title: "Walking Calories Calculator", slug: "walking-calories-calculator", icon: <Target className="w-5 h-5" />, color: 100, benefit: "Calories burned walking" },
];

const PACE_LEVELS = [
  { label: "Beginner", paceMin: "12:00", paceKm: "7:27", desc: "Just starting out. Focus on completing the distance before worrying about speed. Conversational pace — can hold a full sentence while running.", dot: "bg-blue-500", color: "blue" },
  { label: "Casual", paceMin: "10:00–12:00", paceKm: "6:12–7:27", desc: "Comfortable recreational runner. Can sustain a light conversation. This pace is sustainable for long distances with minimal training.", dot: "bg-cyan-500", color: "cyan" },
  { label: "Intermediate", paceMin: "8:00–10:00", paceKm: "4:58–6:12", desc: "Regular runner with a solid aerobic base. Represents many 5K and 10K participants. Comfortable for 30–60 min runs.", dot: "bg-green-500", color: "green" },
  { label: "Advanced", paceMin: "6:00–8:00", paceKm: "3:44–4:58", desc: "Strong runner with consistent training. Can maintain this pace for half marathons. Speech is limited to short phrases.", dot: "bg-orange-500", color: "orange" },
  { label: "Elite Amateur", paceMin: "< 6:00", paceKm: "< 3:44", desc: "Competitive runners and serious athletes. Sub-20 min 5K territory. Requires high weekly mileage and structured training plans.", dot: "bg-red-500", color: "red" },
];

export default function RunningPaceCalculator() {
  const [mode, setMode] = useState<Mode>("pace");
  const [unit, setUnit] = useState<Unit>("miles");
  const [distVal, setDistVal] = useState("5");
  const [timeH, setTimeH] = useState("0");
  const [timeM, setTimeM] = useState("30");
  const [timeS, setTimeS] = useState("0");
  const [paceM, setPaceM] = useState("6");
  const [paceS, setPaceS] = useState("00");
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const result = useMemo(() => {
    const dist = parseFloat(distVal);
    const timeSec = toSeconds(parseInt(timeH) || 0, parseInt(timeM) || 0, parseInt(timeS) || 0);
    const paceSec = (parseInt(paceM) || 0) * 60 + (parseInt(paceS) || 0);

    if (mode === "pace") {
      if (!dist || !timeSec) return null;
      const pacePerUnit = timeSec / dist;
      const speedMph = unit === "miles" ? dist / (timeSec / 3600) : (dist * 0.621371) / (timeSec / 3600);
      const paceAlt = unit === "miles" ? pacePerUnit * 1.60934 : pacePerUnit / 1.60934;
      return {
        type: "pace",
        pace: formatPace(pacePerUnit),
        paceAlt: formatPace(paceAlt),
        speed: speedMph.toFixed(1),
        splits: RACE_DISTANCES_MI.map(r => ({ label: r.label, time: formatTime((pacePerUnit * (unit === "miles" ? 1 : 1.60934)) * r.mi) })),
      };
    }

    if (mode === "time") {
      if (!dist || !paceSec) return null;
      const total = paceSec * dist;
      const paceAlt = unit === "miles" ? paceSec * 1.60934 : paceSec / 1.60934;
      const speedMph = unit === "miles" ? 3600 / paceSec : (3600 / paceSec) * 0.621371;
      return {
        type: "time",
        totalTime: formatTime(total),
        paceAlt: formatPace(paceAlt),
        speed: speedMph.toFixed(1),
        splits: RACE_DISTANCES_MI.map(r => ({ label: r.label, time: formatTime(paceSec * (unit === "miles" ? 1 : 1.60934) * r.mi) })),
      };
    }

    if (mode === "distance") {
      if (!timeSec || !paceSec) return null;
      const calcDist = timeSec / paceSec;
      const distAlt = unit === "miles" ? calcDist * 1.60934 : calcDist / 1.60934;
      const speedMph = unit === "miles" ? calcDist / (timeSec / 3600) : (calcDist * 0.621371) / (timeSec / 3600);
      return {
        type: "distance",
        dist: calcDist.toFixed(2),
        distAlt: distAlt.toFixed(2),
        speed: speedMph.toFixed(1),
        altUnit: unit === "miles" ? "km" : "miles",
      };
    }

    return null;
  }, [mode, unit, distVal, timeH, timeM, timeS, paceM, paceS]);

  return (
    <Layout>
      <SEO
        title="Running Pace Calculator – Calculate Pace, Time & Distance | Free"
        description="Calculate your running pace, projected finish time, or total distance. Supports miles and km with a built-in race time predictor for 5K, 10K, half marathon, and marathon. Free, no signup."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health &amp; Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Running Pace Calculator</span>
        </nav>

        {/* ── HERO ── */}
        <section id="overview" className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Activity className="w-3.5 h-3.5" /> Health &amp; Fitness
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Running Pace Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate your running pace, projected finish time, or total distance. Includes a race time predictor for 5K, 10K, half marathon, and marathon. Supports miles and kilometers.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { icon: <BadgeCheck className="w-3.5 h-3.5" />, label: "100% Free", color: "emerald" },
              { icon: <Zap className="w-3.5 h-3.5" />, label: "Instant Results", color: "orange" },
              { icon: <Lock className="w-3.5 h-3.5" />, label: "No Signup", color: "slate" },
              { icon: <Shield className="w-3.5 h-3.5" />, label: "Privacy First", color: "violet" },
              { icon: <Smartphone className="w-3.5 h-3.5" />, label: "Mobile Ready", color: "cyan" },
            ].map(b => (
              <span key={b.label} className={`inline-flex items-center gap-1.5 bg-${b.color}-500/10 text-${b.color}-600 dark:text-${b.color}-400 font-bold text-xs px-3 py-1.5 rounded-full border border-${b.color}-500/20`}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Health &amp; Fitness &nbsp;·&nbsp; Modes: Pace · Time · Distance &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        {/* ── STAT GRID ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "9:09/mi", label: "pace needed for sub-4hr marathon", icon: <Trophy className="w-5 h-5" /> },
            { value: "10–14 min", label: "comfortable beginner pace (per mile)", icon: <Activity className="w-5 h-5" /> },
            { value: "1.609×", label: "km per mile conversion factor", icon: <Timer className="w-5 h-5" /> },
            { value: "3 modes", label: "find pace, time, or distance", icon: <BookOpen className="w-5 h-5" /> },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-orange-500/15 bg-orange-500/5 p-5 text-center">
              <div className="flex justify-center mb-2 text-orange-500">{s.icon}</div>
              <p className="text-2xl font-black text-foreground mb-1">{s.value}</p>
              <p className="text-xs text-muted-foreground leading-snug">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── MAIN COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pace · Time · Distance Calculator</p>
                      <p className="text-sm text-muted-foreground">Select a mode and enter two values to find the third.</p>
                    </div>
                  </div>

                  {/* Mode selector */}
                  <div className="flex rounded-xl border-2 border-border overflow-hidden w-fit">
                    {([
                      { v: "pace", label: "Find Pace" },
                      { v: "time", label: "Find Time" },
                      { v: "distance", label: "Find Distance" },
                    ] as { v: Mode; label: string }[]).map(({ v, label }) => (
                      <button key={v} onClick={() => setMode(v)}
                        className={`px-4 py-2.5 text-sm font-bold transition-colors ${mode === v ? "bg-orange-500 text-white" : "text-muted-foreground hover:bg-muted"}`}>
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Unit toggle */}
                  <div className="flex gap-2">
                    {(["miles", "km"] as Unit[]).map(u => (
                      <button key={u} onClick={() => setUnit(u)}
                        className={`px-4 py-2 rounded-xl border-2 text-sm font-bold capitalize transition-all ${unit === u ? "bg-orange-500 text-white border-orange-500" : "border-border text-muted-foreground hover:border-orange-500/50"}`}>
                        {u === "miles" ? "Miles" : "Kilometers"}
                      </button>
                    ))}
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {mode !== "distance" && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Distance ({unit})</label>
                        <input type="number" className="tool-calc-input w-full" value={distVal}
                          onChange={e => setDistVal(e.target.value)} min={0.1} step={0.1} placeholder="e.g. 5" />
                      </div>
                    )}

                    {mode !== "time" && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Time (h / min / sec)</label>
                        <div className="flex gap-2">
                          <input type="number" className="tool-calc-input text-center w-full" value={timeH}
                            onChange={e => setTimeH(e.target.value)} placeholder="0h" min={0} max={99} />
                          <input type="number" className="tool-calc-input text-center w-full" value={timeM}
                            onChange={e => setTimeM(e.target.value)} placeholder="30m" min={0} max={59} />
                          <input type="number" className="tool-calc-input text-center w-full" value={timeS}
                            onChange={e => setTimeS(e.target.value)} placeholder="0s" min={0} max={59} />
                        </div>
                      </div>
                    )}

                    {mode !== "pace" && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                          Pace (min:sec per {unit === "miles" ? "mile" : "km"})
                        </label>
                        <div className="flex gap-2 items-center">
                          <input type="number" className="tool-calc-input text-center w-full" value={paceM}
                            onChange={e => setPaceM(e.target.value)} placeholder="6" min={0} max={60} />
                          <span className="text-muted-foreground font-black text-lg">:</span>
                          <input type="number" className="tool-calc-input text-center w-full" value={paceS}
                            onChange={e => setPaceS(e.target.value)} placeholder="00" min={0} max={59} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Results */}
                  <AnimatePresence mode="wait">
                    {result && (
                      <motion.div key={`${mode}-${unit}-${distVal}-${timeH}-${timeM}-${paceM}-${paceS}`}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">

                        {result.type === "pace" && (
                          <>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 text-center">
                                <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Pace / {unit === "miles" ? "mi" : "km"}</p>
                                <p className="text-3xl font-black text-foreground">{result.pace}</p>
                              </div>
                              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center">
                                <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Pace / {unit === "miles" ? "km" : "mi"}</p>
                                <p className="text-3xl font-black text-foreground">{result.paceAlt}</p>
                              </div>
                              <div className="p-4 rounded-xl bg-muted/60 border border-border text-center">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Speed (mph)</p>
                                <p className="text-3xl font-black text-foreground">{result.speed}</p>
                              </div>
                            </div>
                            <div className="rounded-xl border border-border bg-muted/40 p-4">
                              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-amber-500" /> Projected Race Times at This Pace
                              </p>
                              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                {result.splits?.map(s => (
                                  <div key={s.label} className="bg-background rounded-lg p-2.5 text-center border border-border">
                                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                                    <p className="font-black text-sm text-foreground">{s.time}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                        {result.type === "time" && (
                          <>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 text-center">
                                <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Finish Time</p>
                                <p className="text-2xl font-black text-foreground">{result.totalTime}</p>
                              </div>
                              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center">
                                <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Alt Pace</p>
                                <p className="text-2xl font-black text-foreground">{result.paceAlt}/{unit === "miles" ? "km" : "mi"}</p>
                              </div>
                              <div className="p-4 rounded-xl bg-muted/60 border border-border text-center">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Speed (mph)</p>
                                <p className="text-2xl font-black text-foreground">{result.speed}</p>
                              </div>
                            </div>
                            <div className="rounded-xl border border-border bg-muted/40 p-4">
                              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-amber-500" /> Projected Race Times at This Pace
                              </p>
                              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                {result.splits?.map(s => (
                                  <div key={s.label} className="bg-background rounded-lg p-2.5 text-center border border-border">
                                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                                    <p className="font-black text-sm text-foreground">{s.time}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                        {result.type === "distance" && (
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 text-center">
                              <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Distance ({unit})</p>
                              <p className="text-3xl font-black text-foreground">{result.dist}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center">
                              <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Distance ({result.altUnit})</p>
                              <p className="text-3xl font-black text-foreground">{result.distAlt}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/60 border border-border text-center">
                              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Speed (mph)</p>
                              <p className="text-3xl font-black text-foreground">{result.speed}</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section id="how-it-works" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Running Pace Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Running pace, time, and distance are three variables in one equation. Knowing any two lets you calculate the third. This calculator covers all three modes for training planning, race goal setting, and workout analysis.
              </p>
              <ol className="space-y-5 mb-8">
                {[
                  { title: "Select a calculation mode", body: "Find Pace: enter distance and time to get your pace. Find Time: enter distance and pace to project your finish time. Find Distance: enter time and pace to see how far you'll run. Switch modes instantly — your values are preserved." },
                  { title: "Choose miles or kilometers", body: "Toggle between miles and km at the top. The calculator automatically shows your pace in both units in the results. Race splits are always shown in standard race distances (1 mi, 5K, 10K, half marathon, marathon)." },
                  { title: "Read your race time projections", body: "After finding your pace or time, the Race Predictor table shows projected finish times for all major race distances at that pace. Use this to set realistic race goals and plan training blocks around target pace zones." },
                ].map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">{i + 1}</div>
                    <div>
                      <p className="font-bold text-foreground mb-1">{s.title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">The Formula</p>
                <div className="space-y-2 font-mono text-xs mb-3">
                  <code className="block px-3 py-2 bg-background rounded">Pace = Time ÷ Distance</code>
                  <code className="block px-3 py-2 bg-background rounded">Time = Pace × Distance</code>
                  <code className="block px-3 py-2 bg-background rounded">Distance = Time ÷ Pace</code>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Pace is expressed as minutes:seconds per mile or per kilometer. Speed (mph or km/h) is the reciprocal: Speed = Distance ÷ Time.
                </p>
              </div>
            </section>

            {/* ── PACE LEVEL GUIDE ── */}
            <section id="pace-guide">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Running Pace Levels Explained</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Where does your pace fall? Here's how common pace ranges map to runner experience and fitness level.
              </p>
              <div className="space-y-3">
                {PACE_LEVELS.map((level) => (
                  <div key={level.label} className="rounded-xl border border-border bg-card p-4 flex gap-4 items-start">
                    <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${level.dot}`} />
                    <div>
                      <div className="flex items-center flex-wrap gap-3 mb-1">
                        <span className="font-bold text-foreground">{level.label}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-${level.color}-500/10 text-${level.color}-600 dark:text-${level.color}-400`}>
                          {level.paceMin}/mi &nbsp;·&nbsp; {level.paceKm}/km
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{level.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section id="examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Common Pace Reference Chart</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Reference finish times by runner level across popular race distances. Use the calculator above for your exact pace.
              </p>
              <div className="rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60 border-b border-border">
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Level</th>
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Pace/mi</th>
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Pace/km</th>
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">5K</th>
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">10K</th>
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Marathon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Elite", "4:40", "2:54", "14:28", "28:55", "~2:02"],
                      ["Advanced", "6:00", "3:44", "18:38", "37:16", "~2:37"],
                      ["Intermediate", "8:00", "4:58", "24:51", "49:42", "~3:30"],
                      ["Beginner", "10:00", "6:12", "31:04", "62:08", "~4:22"],
                      ["Casual", "12:00", "7:27", "37:16", "74:33", "~5:14"],
                    ].map((row, i) => (
                      <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                        <td className="px-4 py-3 font-bold text-foreground">{row[0]}</td>
                        <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">{row[1]}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row[2]}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row[3]}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row[4]}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row[5]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── WHY USE ── */}
            <section id="why-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Why Use a Running Pace Calculator?</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Running without knowing your pace is like driving without a speedometer. A pace calculator turns raw effort into structured training.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <Trophy className="w-5 h-5" />, title: "Race Goal Setting", desc: "Know exactly what pace you need for a PR. Set realistic time goals for your next 5K, 10K, half marathon, or marathon based on current fitness.", color: "orange" },
                  { icon: <Activity className="w-5 h-5" />, title: "Training Zone Planning", desc: "Easy runs, tempo runs, and intervals each require specific pace ranges. Calculate your zones from a recent race effort and structure your weekly training.", color: "amber" },
                  { icon: <Timer className="w-5 h-5" />, title: "3-in-1 Calculator", desc: "Find pace from a run you completed, project finish times for upcoming races, or calculate how far you'll go in a given time — all from one tool.", color: "blue" },
                  { icon: <Target className="w-5 h-5" />, title: "Race Time Predictor", desc: "Enter your recent 5K pace to instantly see projected splits for 10K through marathon. Useful for selecting a realistic pace group before race day.", color: "green" },
                  { icon: <BadgeCheck className="w-5 h-5" />, title: "Miles & Kilometers", desc: "Toggle between imperial and metric instantly. Results always show both pace units simultaneously so you can communicate pace in any context.", color: "violet" },
                  { icon: <Shield className="w-5 h-5" />, title: "100% Private", desc: "No account required. All calculations happen in your browser — your training data stays yours, never transmitted or stored.", color: "slate" },
                ].map((f, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-5 flex gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-${f.color}-500/10 text-${f.color}-500 flex items-center justify-center flex-shrink-0`}>{f.icon}</div>
                    <div>
                      <p className="font-bold text-foreground mb-1">{f.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── FAQ ── */}
            <section id="faq" className="space-y-3">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Frequently Asked Questions</h2>
              {[
                { q: "What is running pace?", a: "Running pace is the time it takes to cover one unit of distance (mile or kilometer). It's expressed as minutes:seconds per mile or per km. A pace of 8:30/mile means each mile takes 8 minutes 30 seconds." },
                { q: "What is a good running pace for a beginner?", a: "For most beginners, a comfortable running pace is 10–14 minutes per mile (6:12–8:42 per km). Elite recreational runners average 7–9 min/mile. Focus on finishing before speed in your first months of running." },
                { q: "How do I calculate my pace?", a: "Pace = Total Time ÷ Distance. If you ran 5 km in 30 minutes, your pace is 30 ÷ 5 = 6:00 per km. Our calculator handles all three variables — enter any two and get the third instantly." },
                { q: "What is the difference between pace and speed?", a: "Speed is distance per unit of time (mph or km/h). Pace is time per unit of distance (min/mile or min/km). Runners typically use pace; cyclists and swimmers use speed. They're reciprocals of each other." },
                { q: "What pace do I need for a sub-4-hour marathon?", a: "To finish a marathon in under 4 hours you need to maintain a pace of 9:09 per mile or 5:41 per km. Use the Race Time Predictor in Find Time mode — enter 26.2 miles and a 9:09 pace." },
                { q: "What is negative splitting in running?", a: "Negative splitting means running the second half of a race faster than the first. It's considered the optimal racing strategy as it conserves energy and avoids early fatigue. Most world records are run on negative splits." },
              ].map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </section>

            {/* ── CTA ── */}
            <section className="rounded-2xl bg-gradient-to-br from-orange-500/10 via-card to-amber-500/10 border border-orange-500/20 p-8 text-center">
              <h2 className="text-2xl font-black text-foreground mb-2">Track Your Full Fitness Picture</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Pair your pace targets with calorie tracking. Calculate walking calories burned or find your total daily energy expenditure to fuel training properly.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/tools/walking-calories-calculator"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                  Walking Calories Calculator <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/category/health"
                  className="inline-flex items-center gap-2 bg-card hover:bg-muted text-foreground font-bold px-6 py-3 rounded-xl border border-border transition-colors">
                  All Health Tools
                </Link>
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Related Tools */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Related Tools</p>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((t, i) => (
                    <Link key={i} href={`/tools/${t.slug}`}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all border border-transparent hover:border-border">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `hsl(${t.color} 80% 50% / 0.1)`, color: `hsl(${t.color} 70% 45%)` }}>
                        {t.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground leading-tight truncate">{t.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{t.benefit}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
                <p className="text-sm font-bold text-foreground mb-3">Share this calculator</p>
                <button onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-colors">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">On This Page</p>
                <nav className="space-y-1">
                  {[
                    { label: "Overview", href: "#overview" },
                    { label: "Calculator", href: "#calculator" },
                    { label: "How It Works", href: "#how-it-works" },
                    { label: "Pace Levels", href: "#pace-guide" },
                    { label: "Reference Chart", href: "#examples" },
                    { label: "Why Use This", href: "#why-use" },
                    { label: "FAQ", href: "#faq" },
                  ].map(item => (
                    <a key={item.href} href={item.href}
                      className="block text-sm text-muted-foreground hover:text-foreground hover:bg-muted px-2 py-1.5 rounded-lg transition-colors">
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Pace Quick Conversions */}
              <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-3">Quick Pace Conversions</p>
                <div className="space-y-2 font-mono text-xs">
                  {[
                    { from: "6:00/mi", to: "3:44/km" },
                    { from: "8:00/mi", to: "4:58/km" },
                    { from: "10:00/mi", to: "6:12/km" },
                    { from: "5:00/km", to: "8:03/mi" },
                    { from: "6:00/km", to: "9:39/mi" },
                    { from: "1 mile", to: "1.609 km" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{row.from}</span>
                      <span className="text-orange-600 dark:text-orange-400 font-bold">→ {row.to}</span>
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
