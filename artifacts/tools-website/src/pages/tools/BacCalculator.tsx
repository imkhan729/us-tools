import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Wine, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Clock, Activity, Droplets, AlertTriangle
} from "lucide-react";

function useCalc() {
  const [drinks, setDrinks] = useState("2");
  const [weight, setWeight] = useState("70");
  const [hours, setHours] = useState("1");
  const [sex, setSex] = useState<"male" | "female">("male");

  const result = useMemo(() => {
    const d = parseFloat(drinks), w = parseFloat(weight), h = parseFloat(hours);
    if (isNaN(d) || isNaN(w) || isNaN(h) || w === 0) return null;
    const r = sex === "male" ? 0.68 : 0.55;
    const bac = (d * 14 * 5.14) / (w * 2.2046 * r) - 0.015 * h;
    const bacVal = Math.max(0, bac);
    let status = "Sober", color = "text-emerald-600 dark:text-emerald-400", description = "Below detectable impairment levels.";
    if (bacVal >= 0.25)      { status = "Dangerously Drunk";   color = "text-red-700 dark:text-red-500";    description = "Life-threatening. Loss of consciousness risk."; }
    else if (bacVal >= 0.16) { status = "Severely Impaired";   color = "text-red-600 dark:text-red-400";    description = "Disorientation, vomiting, blackout risk."; }
    else if (bacVal >= 0.08) { status = "Legally Drunk (US)";  color = "text-red-500 dark:text-red-400";    description = "Above legal driving limit in most US states."; }
    else if (bacVal >= 0.04) { status = "Mildly Impaired";     color = "text-amber-500 dark:text-amber-400"; description = "Early impairment. Do not drive."; }
    else if (bacVal > 0)     { status = "Slight Effect";        color = "text-amber-400 dark:text-amber-400"; description = "Minor relaxation. Below legal limits."; }
    return { bac: bacVal.toFixed(3), status, color, description };
  }, [drinks, weight, hours, sex]);

  return { drinks, setDrinks, weight, setWeight, hours, setHours, sex, setSex, result };
}

function ResultInsight({ result }: { result: any }) {
  if (!result) return null;
  const message = `Estimated BAC: ${result.bac}%. Status: ${result.status}. ${result.description} Note: BAC varies significantly by individual metabolism, food intake, and drink strength. This estimate should not be used to determine fitness to drive.`;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

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
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Calorie Calculator",  slug: "calorie-calculator",  icon: <Activity className="w-5 h-5" />, color: 152, benefit: "Track your daily energy intake" },
  { title: "Water Intake",         slug: "water-intake-calculator", icon: <Droplets className="w-5 h-5" />, color: 205, benefit: "Stay hydrated and counter effects" },
  { title: "Sleep Time Calculator", slug: "sleep-time-calculator", icon: <Clock className="w-5 h-5" />,    color: 265, benefit: "Plan sleep after a night out" },
];

export default function BacCalculator() {
  const calc = useCalc();
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <Layout>
      <SEO
        title="BAC Calculator – Blood Alcohol Content Estimator | US Online Tools"
        description="Free blood alcohol content (BAC) calculator. Estimate your BAC based on drinks consumed, body weight, time elapsed, and biological sex. For educational purposes only."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health &amp; Wellness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <span className="text-foreground">BAC Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-violet-500/15 bg-gradient-to-br from-violet-500/5 via-card to-purple-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Wine className="w-3.5 h-3.5" /> Health &amp; Wellness
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">BAC Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Estimate your Blood Alcohol Content (BAC) based on drinks consumed, body weight, time elapsed, and biological sex. Educational tool based on the Widmark formula — for awareness only, not for driving decisions.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-500/20"><AlertTriangle className="w-3.5 h-3.5" /> Educational Only</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Health &amp; Wellness &nbsp;·&nbsp; Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-violet-500/20 shadow-lg shadow-violet-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 to-purple-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center flex-shrink-0">
                      <Wine className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">BAC Estimator (Widmark Formula)</p>
                      <p className="text-sm text-muted-foreground">Results update as you type. For educational use only.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 270 } as React.CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider block">Biological Sex</label>
                          <div className="flex gap-2">
                            {(["male", "female"] as const).map(s => (
                              <button key={s} onClick={() => calc.setSex(s)} className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-sm capitalize transition-all ${calc.sex === s ? "bg-violet-500 border-violet-500 text-white shadow-lg" : "bg-card border-border text-muted-foreground hover:border-violet-500/30"}`}>{s}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider block">Standard Drinks Consumed</label>
                          <input type="number" placeholder="2" className="tool-calc-input w-full" value={calc.drinks} onChange={e => calc.setDrinks(e.target.value)} />
                          <p className="text-xs text-muted-foreground mt-1">1 standard drink = 12oz beer / 5oz wine / 1.5oz spirit</p>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider block">Body Weight (kg)</label>
                          <input type="number" placeholder="70" className="tool-calc-input w-full" value={calc.weight} onChange={e => calc.setWeight(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider block">Hours Since First Drink</label>
                          <input type="number" placeholder="1" step="0.5" className="tool-calc-input w-full" value={calc.hours} onChange={e => calc.setHours(e.target.value)} />
                        </div>
                      </div>

                      {calc.result && (
                        <div className="space-y-3">
                          <div className="text-center p-6 rounded-xl bg-violet-500/5 border border-violet-500/20">
                            <p className="text-xs font-bold text-muted-foreground mb-1 uppercase">Estimated BAC</p>
                            <p className="text-5xl font-black text-violet-600 dark:text-violet-400">{calc.result.bac}%</p>
                          </div>
                          <div className={`text-center p-4 rounded-xl border ${calc.result.color.includes("red") ? "bg-red-500/5 border-red-500/20" : calc.result.color.includes("amber") ? "bg-amber-500/5 border-amber-500/20" : "bg-emerald-500/5 border-emerald-500/20"}`}>
                            <p className="text-xs font-bold text-muted-foreground mb-1 uppercase">Status</p>
                            <p className={`text-xl font-black ${calc.result.color}`}>{calc.result.status}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <ResultInsight result={calc.result} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the BAC Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Blood Alcohol Content (BAC) measures the concentration of alcohol in your bloodstream, expressed as a percentage. This calculator uses the Widmark formula — the industry-standard method used by law enforcement and clinical toxicologists — to estimate your BAC based on four variables.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Count your standard drinks accurately</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">One standard drink contains approximately 14g of pure alcohol: a 12oz regular beer (5% ABV), a 5oz glass of wine (12% ABV), or 1.5oz of 80-proof spirits. A large cocktail at a bar or a craft beer at 8% ABV may count as 1.5–2 standard drinks. Use actual ABV percentages to convert non-standard drinks.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter weight and sex accurately</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Body weight and biological sex are the two most important variables after alcohol quantity. The Widmark body water constant for males (r = 0.68) is higher than for females (r = 0.55), reflecting that male bodies contain more total body water relative to fat — resulting in lower peak BAC per drink at the same weight.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Track time since your first drink</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The liver metabolizes alcohol at approximately 0.015% BAC per hour — a relatively fixed rate regardless of coffee, food, or exercise. The calculator subtracts this elimination rate from your estimated peak BAC. The longer you wait, the lower your BAC will be, but this cannot be accelerated.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Widmark Formula</p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-violet-500 font-bold w-4 flex-shrink-0">1</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">BAC = (Drinks × 5.14) ÷ (Weight_lbs × r) − 0.015 × Hours</code>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Where r = 0.68 (males) or 0.55 (females). The constant 5.14 = 14g alcohol per drink × 100 ÷ 27.2 (conversion factor). BAC is floored at 0 — negative values simply mean you've eliminated all alcohol.</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">BAC Levels & Their Effects</h2>
              <p className="text-muted-foreground text-sm mb-6">Understanding what each BAC range means for cognitive and physical function:</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">0.00–0.03% — No Detectable Impairment</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Alcohol is below measurable influence thresholds. Normal behavior and cognition. Safe for driving and operation of machinery.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">0.04–0.07% — Mild Impairment</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Mild euphoria, reduced inhibition, slight impairment of reasoning and depth perception. Not legally drunk in most jurisdictions, but reaction times are measurably reduced. Do not drive.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">0.08%+ — Legally Impaired (Most US States)</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Above the legal limit for driving in all US states. Significant impairment of motor control, judgment, and reaction time. Risk increases sharply with each additional 0.02% beyond this level, including nausea, blackout, and respiratory depression above 0.25%.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">BAC Estimation Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Scenario</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">BAC Est.</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Male 80kg, 2 drinks, 1 hour</td><td className="px-4 py-3 font-bold text-violet-600">∼0.033%</td><td className="px-4 py-3 text-emerald-600 font-bold">Slight Effect</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Female 60kg, 3 drinks, 1 hour</td><td className="px-4 py-3 font-bold text-violet-600">∼0.092%</td><td className="px-4 py-3 text-red-600 font-bold">Legally Drunk</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Male 90kg, 4 drinks, 2 hours</td><td className="px-4 py-3 font-bold text-violet-600">∼0.058%</td><td className="px-4 py-3 text-amber-600 font-bold">Mildly Impaired</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Female 65kg, 1 drink, 0.5 hours</td><td className="px-4 py-3 font-bold text-violet-600">∼0.020%</td><td className="px-4 py-3 text-emerald-600 font-bold">Slight Effect</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Female vs Male BAC disparity:</strong> A 60kg female reaches legally drunk levels (0.08%) with approximately 3 drinks in one hour, while an 80kg male requires about 4+ drinks to reach the same BAC. This difference stems from lower total body water ratio (r factor) in females, meaning alcohol is distributed through a smaller physiological "volume."</p>
                <p><strong className="text-foreground">Time and metabolism:</strong> The liver clears alcohol at ~0.015% per hour. A person at 0.09% BAC would theoretically need approximately 6 hours to reach 0.00%, regardless of water consumption or coffee. Plan accordingly when scheduling early morning activities after a night of drinking.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex gap-2 items-start">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground/80 leading-relaxed"><strong>Important:</strong> This calculator provides an estimate only. Real BAC varies due to food intake, hydration, medication interactions, and individual metabolic variation. Never use this tool to determine if you are safe to drive — call a rideshare or designate a sober driver.</p>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This BAC Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Uses the clinically established Widmark formula.</strong> Developed by Swedish physician Erik Widmark in the 1920s, this formula remains the standard method for BAC estimation used in forensic toxicology and law enforcement. Our implementation faithfully applies the formula's constants for males and females.</p>
                <p><strong className="text-foreground">Shows real alcohol elimination over time.</strong> Many BAC calculators only estimate peak BAC without accounting for time-based elimination. This calculator subtracts the 0.015%/hour clearance rate from your estimate, giving you a more realistic picture of where you stand hours after drinking.</p>
                <p><strong className="text-foreground">Transparent formula, private results.</strong> No data is transmitted. Your inputs stay in your browser only. We believe informed users make safer decisions — and this tool exists specifically to provide that information without tracking or monetization.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Disclaimer:</strong> This BAC calculator is for educational and awareness purposes only. It cannot replace a breathalyzer or clinical blood test. Individual BAC varies based on factors including body composition, food consumed, medications, and liver health. Never drive if you have consumed alcohol. If you or someone you know is struggling with alcohol use, contact SAMHSA's National Helpline at 1-800-662-4357.
                </p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How accurate is this BAC calculator?" a="The Widmark formula is accurate within approximately ±15-20% of true BAC under standard conditions. Factors that affect accuracy include food consumption (slows absorption), carbonation (speeds absorption), medication interactions, liver enzyme levels, and whether drinks were consumed rapidly or spread over time." />
                <FaqItem q="Does food affect BAC?" a="Yes, significantly. Eating a high-fat, high-protein meal before drinking slows gastric emptying and reduces peak BAC by 30–50% compared to drinking on an empty stomach. However, food does not change the elimination rate — it only reduces how fast alcohol is absorbed." />
                <FaqItem q="What is a 'standard drink'?" a="In the US, one standard drink contains 14 grams (0.6 fl oz) of pure alcohol. This equals: 12 fl oz of regular 5% beer, 5 fl oz of 12% wine, or 1.5 fl oz of 80-proof (40%) spirits. Craft beers (7-9% ABV) or oversized pours count as more than one standard drink." />
                <FaqItem q="Can I sober up faster with coffee or water?" a="No. Caffeine may make you feel more alert but does not accelerate alcohol metabolism. Water prevents dehydration but does not lower BAC. Only time and liver metabolism can reduce BAC, at the fixed rate of approximately 0.015% per hour." />
                <FaqItem q="Is it legal to drink below 0.08% and drive?" a="In most US states, the legal limit is 0.08% for adults 21+. However, below 0.08% does not mean unimpaired — studies show measurable reaction time degradation starts at 0.02-0.03%. Additionally, for drivers under 21, commercial drivers, and in certain states, lower limits (0.02%, 0.04%) apply." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Health &amp; Wellness Tools</h2>
                <p className="text-white/80 mb-6 max-w-lg">Explore 400+ free health, fitness, and lifestyle calculators — all free, all instant.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-violet-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others make informed decisions.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-500 to-purple-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-violet-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-violet-500/40 flex-shrink-0" />
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
