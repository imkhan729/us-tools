import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Moon, Zap, Shield, Smartphone,
  Lock, BadgeCheck, Copy, Check, Lightbulb, Sun, Clock,
  Heart, Activity, AlarmClock, ArrowRight,
} from "lucide-react";

// ── Sleep Logic ──
const CYCLE_DURATION = 90; // minutes per cycle
const FALL_ASLEEP_TIME = 14; // avg minutes to fall asleep

function formatTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const suffix = h < 12 ? "AM" : "PM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m.toString().padStart(2, "0")} ${suffix}`;
}

type Mode = "wakeup" | "bedtime";

function useSleepCalc() {
  const [mode, setMode] = useState<Mode>("wakeup");
  const [time, setTime] = useState("07:00");
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");

  const suggestions = useMemo(() => {
    const [hStr, mStr] = time.split(":");
    let h = parseInt(hStr) || 0;
    const m = parseInt(mStr) || 0;
    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    const inputMinutes = h * 60 + m;

    const cycles = [6, 5, 4, 3]; // 9h, 7.5h, 6h, 4.5h

    if (mode === "wakeup") {
      return cycles.map(c => {
        const sleepDuration = c * CYCLE_DURATION;
        const bedtime = ((inputMinutes - sleepDuration - FALL_ASLEEP_TIME) + 24 * 60) % (24 * 60);
        const hours = sleepDuration / 60;
        return {
          cycles: c,
          time: formatTime(bedtime),
          duration: `${Math.floor(hours)}h ${sleepDuration % 60 > 0 ? (sleepDuration % 60) + "m" : ""}`.trim(),
          quality: c >= 6 ? "Optimal" : c === 5 ? "Good" : c === 4 ? "Fair" : "Minimal",
        };
      });
    } else {
      return cycles.map(c => {
        const sleepDuration = c * CYCLE_DURATION;
        const wakeTime = (inputMinutes + FALL_ASLEEP_TIME + sleepDuration) % (24 * 60);
        const hours = sleepDuration / 60;
        return {
          cycles: c,
          time: formatTime(wakeTime),
          duration: `${Math.floor(hours)}h ${sleepDuration % 60 > 0 ? (sleepDuration % 60) + "m" : ""}`.trim(),
          quality: c >= 6 ? "Optimal" : c === 5 ? "Good" : c === 4 ? "Fair" : "Minimal",
        };
      });
    }
  }, [time, ampm, mode]);

  return { mode, setMode, time, setTime, ampm, setAmpm, suggestions };
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-indigo-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-indigo-500">
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
  { title: "TDEE Calculator", slug: "tdee-calculator", icon: <Activity className="w-5 h-5" />, color: 0, benefit: "Total daily calorie burn" },
  { title: "Water Intake Calculator", slug: "water-intake-calculator", icon: <Heart className="w-5 h-5" />, color: 200, benefit: "Daily hydration goal" },
  { title: "BMR Calculator", slug: "bmr-calculator", icon: <Moon className="w-5 h-5" />, color: 265, benefit: "Resting metabolic rate" },
  { title: "Age Calculator", slug: "age-calculator", icon: <AlarmClock className="w-5 h-5" />, color: 152, benefit: "Calculate your exact age" },
];

const QUALITY_COLORS: Record<string, string> = {
  Optimal: "emerald",
  Good: "blue",
  Fair: "amber",
  Minimal: "red",
};

export default function SleepCalculator() {
  const calc = useSleepCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setNow = () => {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const period = h >= 12 ? "PM" : "AM";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    calc.setTime(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    calc.setAmpm(period as "AM" | "PM");
  };

  return (
    <Layout>
      <SEO
        title="Sleep Calculator – Best Bedtime & Wake-Up Times Based on Sleep Cycles"
        description="Calculate the best time to go to sleep or wake up based on 90-minute sleep cycles. Avoid waking mid-cycle and feel refreshed. Free online sleep calculator, no signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health &amp; Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <span className="text-foreground">Sleep Calculator</span>
        </nav>

        {/* ── HERO ── */}
        <section id="overview" className="rounded-2xl overflow-hidden border border-indigo-500/15 bg-gradient-to-br from-indigo-500/5 via-card to-violet-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Moon className="w-3.5 h-3.5" /> Health &amp; Fitness
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Sleep Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Find the best bedtime or wake-up time based on 90-minute sleep cycles. Wake up at the end of a cycle feeling refreshed, not groggy.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { icon: <BadgeCheck className="w-3.5 h-3.5" />, label: "100% Free", color: "emerald" },
              { icon: <Zap className="w-3.5 h-3.5" />, label: "Instant Results", color: "indigo" },
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
            Category: Health &amp; Fitness &nbsp;·&nbsp; Based on 90-minute sleep cycle science &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── MAIN COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section id="calculator">
              <div className="rounded-2xl overflow-hidden border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-violet-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-400 flex items-center justify-center flex-shrink-0">
                      <Moon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">90-Minute Sleep Cycles</p>
                      <p className="text-sm text-muted-foreground">Calculate optimal sleep times. Assumes ~14 min to fall asleep.</p>
                    </div>
                  </div>

                  {/* Mode toggle */}
                  <div className="flex gap-2">
                    <button onClick={() => calc.setMode("wakeup")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${calc.mode === "wakeup" ? "bg-indigo-500 text-white border-indigo-500" : "border-border text-muted-foreground hover:border-indigo-500/50"}`}>
                      <Sun className="w-4 h-4" /> I want to wake up at…
                    </button>
                    <button onClick={() => calc.setMode("bedtime")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${calc.mode === "bedtime" ? "bg-indigo-500 text-white border-indigo-500" : "border-border text-muted-foreground hover:border-indigo-500/50"}`}>
                      <Moon className="w-4 h-4" /> I'm going to bed at…
                    </button>
                  </div>

                  {/* Time input */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                      {calc.mode === "wakeup" ? "Wake-up Time" : "Bedtime"}
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      <input type="time"
                        className="tool-calc-input flex-1 min-w-[130px]"
                        value={calc.time}
                        onChange={e => calc.setTime(e.target.value)} />
                      <div className="flex rounded-xl border-2 border-border overflow-hidden">
                        {(["AM", "PM"] as const).map(p => (
                          <button key={p} onClick={() => calc.setAmpm(p)}
                            className={`px-4 py-2 text-sm font-bold transition-all ${calc.ampm === p ? "bg-indigo-500 text-white" : "text-muted-foreground hover:bg-muted"}`}>
                            {p}
                          </button>
                        ))}
                      </div>
                      <button onClick={setNow}
                        className="px-4 py-2 rounded-xl border-2 border-border text-sm font-bold text-muted-foreground hover:border-indigo-500/50 hover:text-foreground transition-all">
                        <Clock className="w-4 h-4 inline mr-1" />Now
                      </button>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {calc.mode === "wakeup" ? "Go to sleep at…" : "Wake up at…"}
                    </p>
                    {calc.suggestions.map((s, i) => {
                      const color = QUALITY_COLORS[s.quality];
                      return (
                        <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border bg-${color}-500/5 border-${color}-500/20`}>
                          <div className="text-center flex-shrink-0 w-20">
                            <p className="text-xl font-black text-foreground">{s.time}</p>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-${color}-500/10 text-${color}-600 dark:text-${color}-400`}>{s.quality}</span>
                              <span className="text-sm text-muted-foreground">{s.cycles} cycles · {s.duration} of sleep</span>
                            </div>
                          </div>
                          <Moon className={`w-4 h-4 text-${color}-500 flex-shrink-0`} />
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                    <div className="flex gap-2 items-start">
                      <Lightbulb className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        Each sleep cycle lasts ~90 minutes and includes all 4 stages: light sleep, deep sleep, and REM. Waking at the <strong>end of a cycle</strong> (not mid-cycle) makes you feel refreshed. The calculator adds 14 minutes for average sleep onset time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section id="how-it-works" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How the Sleep Cycle Calculator Works</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Sleep is not a uniform state — it cycles through 4 stages every 90 minutes. Waking mid-cycle, especially during deep sleep (Stage 3) or REM, causes sleep inertia — that heavy, groggy feeling that can last 1–4 hours. This calculator finds times that land at the end of a cycle, so you wake naturally during light sleep.
              </p>
              <ol className="space-y-5 mb-8">
                {[
                  { title: "Choose your mode", body: "Select 'I want to wake up at…' if you have a fixed alarm time and want to know when to go to bed. Select 'I'm going to bed at…' if you know your bedtime and want to find the best alarm times. Both modes calculate optimal times based on complete 90-minute cycles." },
                  { title: "Enter your time", body: "Type a time or click the clock inputs. Use the 'Now' button to instantly calculate from the current time — useful if you're already in bed and want to know the best time to set your alarm right now." },
                  { title: "Choose from the suggestions", body: "The calculator shows four options: 6 cycles (9 hours, optimal), 5 cycles (7.5 hours, good), 4 cycles (6 hours, fair), and 3 cycles (4.5 hours, minimal). Adults need 7–9 hours for optimal health; 6 cycles gives the best rest." },
                ].map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">{i + 1}</div>
                    <div>
                      <p className="font-bold text-foreground mb-1">{s.title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { stage: "Stage 1", name: "Light Sleep", min: "1–5 min", color: "indigo" },
                  { stage: "Stage 2", name: "Light Sleep", min: "10–60 min", color: "violet" },
                  { stage: "Stage 3", name: "Deep Sleep", min: "20–40 min", color: "purple" },
                  { stage: "REM", name: "Dream Sleep", min: "10–60 min", color: "fuchsia" },
                ].map(s => (
                  <div key={s.stage} className={`p-3 rounded-xl bg-${s.color}-500/5 border border-${s.color}-500/20 text-center`}>
                    <p className={`text-xs font-bold text-${s.color}-500 mb-1`}>{s.stage}</p>
                    <p className="text-sm font-bold text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.min}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── SLEEP QUALITY GUIDE ── */}
            <section id="quality-guide" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Sleep Quality by Cycle Count</h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Not all sleep amounts are equal. Here's what each option means for how you'll feel and function:
              </p>
              <div className="space-y-4">
                {[
                  { quality: "Optimal", cycles: "6 cycles", hours: "9 hours", color: "emerald", dot: "bg-emerald-500", description: "Ideal for athletes, teenagers, and people recovering from illness. Supports full REM and deep sleep stages. You'll wake feeling genuinely refreshed with strong focus and mood." },
                  { quality: "Good", cycles: "5 cycles", hours: "7.5 hours", color: "blue", dot: "bg-blue-500", description: "The sweet spot for most healthy adults. Meets the NSF guideline of 7–9 hours. Cognitive function, mood, and immune health are well-supported." },
                  { quality: "Fair", cycles: "4 cycles", hours: "6 hours", color: "amber", dot: "bg-amber-500", description: "Adequate for occasional use, but chronic 6-hour sleep is linked to impaired memory, increased cortisol, and higher risk of metabolic disease. Add caffeine strategically." },
                  { quality: "Minimal", cycles: "3 cycles", hours: "4.5 hours", color: "red", dot: "bg-red-500", description: "Emergency use only. Short-term cognitive performance drops significantly. Reaction time, emotional regulation, and decision-making are impaired. Not sustainable." },
                ].map(r => (
                  <div key={r.quality} className={`flex gap-4 p-4 rounded-xl bg-${r.color}-500/5 border border-${r.color}-500/20`}>
                    <div className="flex-shrink-0 flex items-start pt-1">
                      <span className={`w-3 h-3 rounded-full ${r.dot} mt-0.5`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-sm font-black text-${r.color}-600 dark:text-${r.color}-400`}>{r.quality}</span>
                        <span className="text-xs text-muted-foreground">{r.cycles} · {r.hours}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{r.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section id="examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Quick Examples</h2>
              <p className="text-muted-foreground mb-5 text-sm">Common scenarios with optimal bedtimes (wake-up mode, 14 min fall-asleep time):</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Wake-up Goal</th>
                      <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">6 Cycles (9h)</th>
                      <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">5 Cycles (7.5h)</th>
                      <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">4 Cycles (6h)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { wake: "6:00 AM", c6: "8:46 PM", c5: "10:16 PM", c4: "11:46 PM" },
                      { wake: "6:30 AM", c6: "9:16 PM", c5: "10:46 PM", c4: "12:16 AM" },
                      { wake: "7:00 AM", c6: "9:46 PM", c5: "11:16 PM", c4: "12:46 AM" },
                      { wake: "7:30 AM", c6: "10:16 PM", c5: "11:46 PM", c4: "1:16 AM" },
                      { wake: "8:00 AM", c6: "10:46 PM", c5: "12:16 AM", c4: "1:46 AM" },
                    ].map(row => (
                      <tr key={row.wake} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3 px-3 font-bold text-foreground">{row.wake}</td>
                        <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-semibold">{row.c6}</td>
                        <td className="py-3 px-3 text-blue-600 dark:text-blue-400 font-semibold">{row.c5}</td>
                        <td className="py-3 px-3 text-amber-600 dark:text-amber-400 font-semibold">{row.c4}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── WHY USE THIS ── */}
            <section id="why-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Why Use a Sleep Calculator?</h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Sleep timing is as important as sleep duration. The same number of hours can feel very different depending on when you wake in the cycle.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { icon: <Moon className="w-5 h-5 text-indigo-500" />, title: "Avoid Sleep Inertia", desc: "Wake at the end of a cycle, not mid-deep-sleep, to avoid that groggy, confused feeling that can last hours." },
                  { icon: <Zap className="w-5 h-5 text-indigo-500" />, title: "Optimize Every Night", desc: "Even on short nights, choosing the right alarm time can make 6 hours feel better than an unaligned 7." },
                  { icon: <Activity className="w-5 h-5 text-indigo-500" />, title: "Support Recovery", desc: "Athletes and high performers know that deep sleep (Stage 3) repairs muscle and consolidates motor skills — make sure you get enough cycles." },
                  { icon: <Clock className="w-5 h-5 text-indigo-500" />, title: "Plan Naps Better", desc: "Either a 20-minute nap (before deep sleep) or a full 90-minute nap (one cycle). Avoid the 30–60 minute danger zone." },
                  { icon: <Shield className="w-5 h-5 text-indigo-500" />, title: "100% Private", desc: "Your sleep schedule is calculated entirely in your browser. No data is ever stored or transmitted anywhere." },
                  { icon: <BadgeCheck className="w-5 h-5 text-indigo-500" />, title: "Science-Backed", desc: "Built on the 90-minute sleep cycle model validated by decades of sleep research from institutions including the National Sleep Foundation." },
                ].map((f, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl border border-border bg-muted/20">
                    <div className="flex-shrink-0 mt-0.5">{f.icon}</div>
                    <div>
                      <p className="font-bold text-foreground text-sm mb-1">{f.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Disclaimer:</strong> This calculator is for informational purposes only. Individual sleep needs vary. If you experience chronic sleep issues, consult a healthcare provider or sleep specialist.
                </p>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section id="faq" className="space-y-3">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Frequently Asked Questions</h2>
              {[
                { q: "How long is a sleep cycle exactly?", a: "A complete sleep cycle averages 90 minutes, though it can range from 70–120 minutes depending on the individual and where you are in the night. Earlier cycles in the night have more deep sleep (Stage 3); later cycles have more REM. The 90-minute baseline used in this calculator is the widely accepted scientific average." },
                { q: "Why does waking mid-cycle feel so bad?", a: "Waking during Stage 3 (deep/slow-wave) sleep causes sleep inertia — a state of impaired alertness, confusion, and sluggishness caused by high levels of sleep-promoting chemicals still circulating in the brain. Recovery from sleep inertia takes 15 minutes to 4 hours. Waking during Stage 1 or Stage 2 (light sleep) avoids this, which is why the right alarm time can transform your mornings." },
                { q: "How many sleep cycles should I aim for?", a: "Most adults need 5–6 complete cycles per night (7.5–9 hours). Athletes, teenagers, and people recovering from illness often need 6+ cycles. Consistently getting fewer than 5 cycles (under 7.5 hours) is associated with increased risk of cardiovascular disease, weakened immunity, weight gain, and impaired cognitive function." },
                { q: "Should I use this to plan naps?", a: "Yes. Effective naps are either 20 minutes (before entering deep sleep, so you wake feeling refreshed) or 90 minutes (one full cycle). Naps of 30–60 minutes tend to be the worst: you wake mid-deep-sleep and feel groggy. The 20-minute 'power nap' is the most practical for most people during the day." },
                { q: "Does it matter what time I go to sleep?", a: "Yes — sleep timing matters, not just duration. Sleep before midnight tends to contain more slow-wave (restorative) deep sleep, while the later half of the night is richer in REM (memory, mood, creativity). Consistently sleeping at irregular times disrupts your circadian rhythm, reducing sleep quality even at the same total hours." },
                { q: "Why 14 minutes for fall-asleep time?", a: "Sleep onset latency — the time from lying down to actually falling asleep — averages about 14 minutes in healthy adults, according to polysomnography studies. If you typically fall asleep faster or slower, adjust your target time slightly earlier or later. The 14-minute buffer ensures the suggested times account for this transition period." },
              ].map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </section>

            {/* ── CTA ── */}
            <section className="rounded-2xl bg-gradient-to-br from-indigo-500/10 via-card to-violet-500/10 border border-indigo-500/20 p-8 md:p-10 text-center">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-3">Explore More Health Tools</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto text-sm leading-relaxed">
                Sleep is one part of a healthy lifestyle. Pair your sleep schedule with TDEE tracking, hydration goals, and BMR to get a full picture of your daily health.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/tools/tdee-calculator"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-600 transition-colors">
                  TDEE Calculator <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/category/health"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-500/10 transition-colors">
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
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
                <p className="text-sm font-bold text-foreground mb-3">Share this calculator</p>
                <button onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-600 transition-colors">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">On This Page</p>
                <nav className="space-y-1">
                  {[
                    { href: "#overview", label: "Overview" },
                    { href: "#calculator", label: "Sleep Calculator" },
                    { href: "#how-it-works", label: "How It Works" },
                    { href: "#quality-guide", label: "Sleep Quality Guide" },
                    { href: "#examples", label: "Quick Examples" },
                    { href: "#why-use", label: "Why Use This" },
                    { href: "#faq", label: "FAQ" },
                  ].map(item => (
                    <a key={item.href} href={item.href}
                      className="block text-sm text-muted-foreground hover:text-foreground hover:font-medium transition-colors py-1 pl-2 border-l-2 border-transparent hover:border-indigo-500">
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Sleep Cycle Quick Reference */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Sleep Cycle Reference</p>
                <div className="space-y-2">
                  {[
                    { cycles: "3 cycles", hours: "4.5h", quality: "Minimal", color: "red" },
                    { cycles: "4 cycles", hours: "6h", quality: "Fair", color: "amber" },
                    { cycles: "5 cycles", hours: "7.5h", quality: "Good", color: "blue" },
                    { cycles: "6 cycles", hours: "9h", quality: "Optimal", color: "emerald" },
                  ].map(r => (
                    <div key={r.cycles} className={`flex items-center justify-between p-2.5 rounded-lg bg-${r.color}-500/5 border border-${r.color}-500/20`}>
                      <div>
                        <p className="text-xs font-bold text-foreground">{r.cycles}</p>
                        <p className="text-xs text-muted-foreground">{r.hours} sleep</p>
                      </div>
                      <span className={`text-xs font-bold text-${r.color}-600 dark:text-${r.color}-400`}>{r.quality}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">+14 min fall-asleep time included</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
