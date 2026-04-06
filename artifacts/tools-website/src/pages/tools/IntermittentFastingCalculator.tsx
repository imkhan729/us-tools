import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Moon, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Clock, Timer, Sun, Flame, Droplets
} from "lucide-react";

const PROTOCOLS = [
  { name: "16:8", fasting: 16, eating: 8, description: "16 hours fasting, 8 hours eating. The most popular protocol for beginners." },
  { name: "18:6", fasting: 18, eating: 6, description: "18 hours fasting, 6 hours eating. An intermediate-level approach." },
  { name: "20:4", fasting: 20, eating: 4, description: "20 hours fasting, 4 hours eating. The 'Warrior Diet' method." },
  { name: "OMAD",  fasting: 23, eating: 1, description: "One Meal A Day. 23 hours fasting, 1 eating window." },
];

function useCalc() {
  const [protocol, setProtocol] = useState(PROTOCOLS[0]);
  const [startTime, setStartTime] = useState("20:00");

  const result = useMemo(() => {
    const [h, m] = startTime.split(":").map(Number);
    const start = new Date();
    start.setHours(h, m, 0, 0);
    const eatingStart = new Date(start.getTime() + protocol.fasting * 3600000);
    const eatingEnd   = new Date(eatingStart.getTime() + protocol.eating * 3600000);
    const fmt = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    return { fastingStart: fmt(start), eatingStart: fmt(eatingStart), eatingEnd: fmt(eatingEnd) };
  }, [protocol, startTime]);

  return { protocol, setProtocol, startTime, setStartTime, result };
}

function ResultInsight({ result, protocol }: { result: any; protocol: any }) {
  const message = `On the ${protocol.name} protocol, if your last meal was at ${result.fastingStart}, your next eating window opens at ${result.eatingStart} and closes at ${result.eatingEnd}. Your total eating duration is ${protocol.eating} hours each day.`;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
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
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Calorie Calculator",           slug: "calorie-calculator",           icon: <Flame className="w-5 h-5" />,    color: 25,  benefit: "Track your daily energy intake" },
  { title: "Body Fat % Calculator",        slug: "body-fat-percentage-calculator",icon: <Droplets className="w-5 h-5" />, color: 205, benefit: "Measure fat vs lean mass" },
  { title: "Water Intake Calculator",      slug: "water-intake-calculator",      icon: <Droplets className="w-5 h-5" />, color: 195, benefit: "Stay hydrated during your fast" },
  { title: "Keto Macro Calculator",        slug: "keto-calculator",              icon: <Moon className="w-5 h-5" />,     color: 265, benefit: "Pair fasting with ketogenic diet" },
];

export default function IntermittentFastingCalculator() {
  const calc = useCalc();
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <Layout>
      <SEO
        title="Intermittent Fasting Calculator – Schedule Your 16:8, 18:6, OMAD Windows | US Online Tools"
        description="Free intermittent fasting calculator. Find your ideal eating and fasting windows for 16:8, 18:6, 20:4, and OMAD protocols based on your last meal time. Instant, no signup."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* BREADCRUMB */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health &amp; Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Intermittent Fasting Calculator</span>
        </nav>

        {/* HERO */}
        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Moon className="w-3.5 h-3.5" /> Health &amp; Fitness
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Intermittent Fasting Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Enter your last meal time and fasting protocol to instantly calculate your eating window. Supports 16:8, 18:6, 20:4, and OMAD — no account required.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Health &amp; Fitness &nbsp;·&nbsp; Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-3 space-y-10">

            {/* TOOL WIDGET */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0">
                      <Moon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Fasting Window Calculator</p>
                      <p className="text-sm text-muted-foreground">Select your protocol and last meal time.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 30 } as React.CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider block">Fasting Protocol</label>
                        <div className="grid grid-cols-2 gap-2">
                          {PROTOCOLS.map(p => (
                            <button
                              key={p.name}
                              onClick={() => calc.setProtocol(p)}
                              className={`py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${calc.protocol.name === p.name ? "bg-orange-500 border-orange-500 text-white shadow-lg" : "bg-card border-border text-muted-foreground hover:border-orange-500/30"}`}
                            >{p.name}</button>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{calc.protocol.description}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider block">Last Meal Time (Fasting Starts)</label>
                        <input
                          type="time"
                          value={calc.startTime}
                          onChange={e => calc.setStartTime(e.target.value)}
                          className="tool-calc-input w-full text-lg py-3"
                        />
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-orange-500/5 border border-orange-500/15">
                            <span className="text-xs font-bold text-muted-foreground uppercase">Eating Window Opens</span>
                            <span className="text-lg font-black text-orange-600 dark:text-orange-400">{calc.result.eatingStart}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
                            <span className="text-xs font-bold text-muted-foreground uppercase">Eating Window Closes</span>
                            <span className="text-lg font-black text-amber-600 dark:text-amber-400">{calc.result.eatingEnd}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ResultInsight result={calc.result} protocol={calc.protocol} />
                  </div>
                </div>
              </div>
            </section>

            {/* HOW TO USE */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Intermittent Fasting Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Intermittent fasting (IF) is not a diet — it's an eating schedule. The goal is to restrict your eating to a specific time window each day and fast for the remaining hours. Our calculator makes scheduling effortless.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Choose your fasting protocol</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Select from 16:8, 18:6, 20:4, or OMAD. The 16:8 protocol is the most popular and easiest for beginners — it simply means skipping breakfast and eating between, say, noon and 8 PM. The 18:6 offers more metabolic benefits. 20:4 and OMAD are advanced protocols best reserved once the body has adapted to fasting.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter your last meal time</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Choose the time you plan to finish your last meal of the day. This is when your fasting clock starts. Many people find 7–8 PM a natural and sustainable time, as it aligns with dinner and prevents late-night snacking.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Follow your eating window</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The calculator instantly shows you when your fast ends and your eating window opens and closes. During the fasting period, consume only water, black coffee, or plain tea. During the eating window, consume all your daily calories within the allotted time frame.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Protocol Reference</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-border">
                        <th className="pb-2 font-bold text-foreground">Protocol</th>
                        <th className="pb-2 font-bold text-foreground">Fasting</th>
                        <th className="pb-2 font-bold text-foreground">Eating</th>
                        <th className="pb-2 font-bold text-foreground hidden sm:table-cell">Best For</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {PROTOCOLS.map(p => (
                        <tr key={p.name} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2 font-bold text-orange-600">{p.name}</td>
                          <td className="py-2 text-muted-foreground">{p.fasting}h</td>
                          <td className="py-2 text-muted-foreground">{p.eating}h</td>
                          <td className="py-2 text-muted-foreground hidden sm:table-cell">{p.description.split(".")[0]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* RESULT INTERPRETATION */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Understanding Your Fasting Schedule</h2>
              <p className="text-muted-foreground text-sm mb-6">What the different components of your fasting window mean:</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Fasting Period — Metabolic Repair</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">After 12–14 hours of fasting, your body depletes its glycogen stores and begins oxidizing fat for energy. Beyond 16–18 hours, cellular autophagy is triggered — a housekeeping process where the body recycles damaged cell components, associated with longevity and metabolic health.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Eating Window — Nutrient Loading</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Your eating window is when you consume all daily calories and nutrients. A compressed eating window (especially 4–6 hours) reduces the total number of insulin spikes per day, which may improve insulin sensitivity over time. Focus on whole foods, lean proteins, healthy fats, and complex carbohydrates during this window.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Breaking the Fast — Optimal First Meals</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The first meal after a fasting window should be easily digestible and protein-rich. Avoid high-sugar or high-carbohydrate options immediately after fasting, as they cause rapid insulin spikes. Eggs, nuts, leafy greens, and lean meats are ideal choices to break a fast without disrupting the metabolic benefits gained.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* QUICK EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Sample Fasting Schedules</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Protocol</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Last Meal</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Eating Starts</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Eating Ends</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Typical User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-bold text-orange-600">16:8</td>
                      <td className="px-4 py-3 font-mono text-foreground">8:00 PM</td>
                      <td className="px-4 py-3 font-bold text-orange-600">12:00 PM</td>
                      <td className="px-4 py-3 font-bold text-amber-600">8:00 PM</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Beginners, office workers</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-bold text-orange-600">18:6</td>
                      <td className="px-4 py-3 font-mono text-foreground">6:00 PM</td>
                      <td className="px-4 py-3 font-bold text-orange-600">12:00 PM</td>
                      <td className="px-4 py-3 font-bold text-amber-600">6:00 PM</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Intermediate fasters</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-bold text-orange-600">20:4</td>
                      <td className="px-4 py-3 font-mono text-foreground">7:00 PM</td>
                      <td className="px-4 py-3 font-bold text-orange-600">3:00 PM</td>
                      <td className="px-4 py-3 font-bold text-amber-600">7:00 PM</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Warrior Diet practitioners</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-bold text-orange-600">OMAD</td>
                      <td className="px-4 py-3 font-mono text-foreground">7:00 PM</td>
                      <td className="px-4 py-3 font-bold text-orange-600">6:00 PM</td>
                      <td className="px-4 py-3 font-bold text-amber-600">7:00 PM</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Advanced / weight loss</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">16:8 Example — The Classic Skip-Breakfast:</strong> A professional skips breakfast and has their first meal at 12 PM (lunch) and their last meal at 8 PM (dinner). That's a 16-hour fast from 8 PM to noon the following day — the single most popular entry point into IF because it requires no food preparation adjustments beyond dropping breakfast.</p>
                <p><strong className="text-foreground">18:6 Example — The Refined Window:</strong> An intermediate faster extends their fast by 2 hours, delaying their first meal to 2 PM. This deeper fasting period more consistently triggers autophagy and fat oxidation. Studies suggest this protocol leads to more pronounced improvements in blood sugar and metabolic markers compared to 16:8.</p>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-orange-500/5 border border-orange-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <svg key={i} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"I've been using this to plan my 18:6 schedule for 3 months. Lost 12 pounds without changing what I eat, just when I eat. The schedule calculator keeps me on track perfectly."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* WHY CHOOSE THIS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Intermittent Fasting Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">All four major protocols in one tool.</strong> Rather than needing separate apps or manual math for each protocol, this calculator supports 16:8, 18:6, 20:4, and OMAD simultaneously. Switching between protocols to experiment is instant.</p>
                <p><strong className="text-foreground">Personalized to your schedule, not a template.</strong> Most fasting guides give you a fixed schedule (e.g., "eat 12–8 PM"). This tool lets you start your fast at any time of day — whether you're a night shift worker, early riser, or follow an unconventional sleep schedule.</p>
                <p><strong className="text-foreground">No app download, no subscription, no tracking.</strong> Many fasting apps drive revenue through subscription models or require registration. This calculator works entirely in your browser, requires no personal data, and will never send you a marketing email.</p>
                <p><strong className="text-foreground">Private and offline-capable.</strong> No data is transmitted to any server. Your fasting schedule is computed locally in your browser using JavaScript. Once loaded, the page functions even without an internet connection.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Medical Disclaimer:</strong> Intermittent fasting is not appropriate for everyone. Pregnant or breastfeeding individuals, people with a history of eating disorders, those with type 1 diabetes, and individuals on certain medications should consult a qualified healthcare provider before beginning any fasting protocol. This tool provides scheduling assistance only and does not constitute medical advice.
                </p>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="Can I drink coffee or tea during the fasting window?" a="Yes — black coffee, plain tea, and water do not contain calories and are generally considered acceptable during the fasting period. They may also help suppress appetite. Avoid adding milk, sugar, or creamers, as these introduce calories and can break the fast." />
                <FaqItem q="What is the best intermittent fasting protocol for beginners?" a="The 16:8 protocol is universally recommended for beginners. It simply requires skipping breakfast and confining eating to a midday-to-evening window. Most people find it easy to sustain since a large portion of the fast occurs during sleep." />
                <FaqItem q="Will intermittent fasting slow my metabolism?" a="Short-term fasting (under 24 hours) has not been shown to reduce basal metabolic rate. In fact, studies show a slight increase in metabolic rate during short fasts due to elevated norepinephrine. Prolonged multi-day fasting, however, can reduce muscle mass and metabolic rate." />
                <FaqItem q="Can I exercise during the fasting window?" a="Yes. Many practitioners train in a fasted state, particularly for fat-burning benefits. However, high-intensity or strength training sessions may be better scheduled near or during your eating window to ensure access to glucose and protein for recovery." />
                <FaqItem q="How long does it take to see results from intermittent fasting?" a="Most people notice improvements in energy and reduced cravings within 1–2 weeks. Measurable weight loss or metabolic improvements are typically observed after 4–8 weeks of consistent adherence, provided calories are not significantly overeaten during the eating window." />
                <FaqItem q="Does the specific time of my eating window matter?" a="Research suggests that earlier eating windows (e.g., 8 AM–4 PM) may offer superior metabolic benefits due to circadian alignment with daylight cortisol cycles. However, adherence is the most critical factor — a later eating window you can maintain consistently outperforms an early window you abandon within a week." />
              </div>
            </section>

            {/* FINAL CTA */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Optimize Your Health Routine</h2>
                <p className="text-white/80 mb-6 max-w-lg">Explore 400+ free health, fitness, and lifestyle calculators — all free, all instant, no signup needed.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map(tool => (
                    <Link key={tool.slug} href={`/health/${tool.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-orange-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others plan their fasting schedule.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-orange-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-orange-500/40 flex-shrink-0" />
                      {label}
                    </a>
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
