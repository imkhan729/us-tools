import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Target, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Calculator, BarChart3, BookOpen
} from "lucide-react";

function calcPercentError(experimental: number, theoretical: number, absolute: boolean) {
  const error = experimental - theoretical;
  const pct = (Math.abs(error) / Math.abs(theoretical)) * 100;
  const relativePct = (error / Math.abs(theoretical)) * 100;
  return {
    absoluteError: Math.abs(error),
    relativeError: Math.abs(error) / Math.abs(theoretical),
    percentError: Math.abs(pct),
    signedPercentError: relativePct,
    overUnder: error > 0 ? "over" : error < 0 ? "under" : "exact",
  };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-rose-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-rose-500">
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

const RELATED = [
  { title: "Percentage Calculator",    slug: "percentage-calculator",    cat: "math",      icon: <Calculator className="w-5 h-5" />,  color: 217, benefit: "Calculate any percentage" },
  { title: "Ratio Calculator",         slug: "ratio-calculator",         cat: "math",      icon: <Calculator className="w-5 h-5" />,  color: 152, benefit: "Compare values and proportions" },
  { title: "Standard Deviation",       slug: "online-standard-deviation-calculator", cat: "math", icon: <BarChart3 className="w-5 h-5" />,   color: 25,  benefit: "Calculate statistical spread" },
  { title: "Average Calculator",       slug: "average-calculator",       cat: "math",      icon: <BookOpen className="w-5 h-5" />,    color: 265, benefit: "Find mean, median, mode" },
];

export default function PercentageErrorCalculator() {
  const [experimental, setExperimental] = useState("");
  const [theoretical, setTheoretical] = useState("");
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const exp = parseFloat(experimental);
  const theo = parseFloat(theoretical);
  const isValid = !isNaN(exp) && !isNaN(theo) && theo !== 0;
  const result = useMemo(() => isValid ? calcPercentError(exp, theo, true) : null, [exp, theo, isValid]);

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(`Percentage Error: ${result.percentError.toFixed(4)}%`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); };

  const errorLevel = result ? (result.percentError < 1 ? "excellent" : result.percentError < 5 ? "good" : result.percentError < 10 ? "acceptable" : "high") : null;
  const errorColors: Record<string, string> = { excellent: "emerald", good: "blue", acceptable: "amber", high: "red" };
  const color = errorLevel ? errorColors[errorLevel] : "rose";

  return (
    <Layout>
      <SEO
        title="Percentage Error Calculator – Find % Error Formula Online Free | US Online Tools"
        description="Free percentage error calculator. Calculate percent error between experimental and theoretical values using the standard formula. Instant results for science, lab reports, and engineering. No signup."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-rose-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Science</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-rose-500" strokeWidth={3} />
          <span className="text-foreground">Percentage Error Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-rose-500/15 bg-gradient-to-br from-rose-500/5 via-card to-pink-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Target className="w-3.5 h-3.5" /> Math &amp; Science
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Percentage Error Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate the percentage error between an experimental (measured) value and a theoretical (accepted) value. Used in physics, chemistry, biology, and engineering labs to quantify measurement accuracy.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs px-3 py-1.5 rounded-full border border-rose-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold text-xs px-3 py-1.5 rounded-full border border-pink-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Math &amp; Science &nbsp;·&nbsp; Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            <section>
              <div className="rounded-2xl overflow-hidden border border-rose-500/20 shadow-lg shadow-rose-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 to-pink-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-400 flex items-center justify-center flex-shrink-0"><Target className="w-4 h-4 text-white" /></div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Percentage Error Calculator</p>
                      <p className="text-sm text-muted-foreground">Enter experimental and theoretical values — results update instantly.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 350 } as React.CSSProperties}>
                    {/* Formula display */}
                    <div className="mb-5 p-4 rounded-xl bg-muted/60 border border-border">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Formula</p>
                      <code className="text-sm font-mono text-foreground">% Error = |Experimental − Theoretical| ÷ |Theoretical| × 100</code>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Experimental Value (Measured)</label>
                        <input type="number" placeholder="e.g. 9.65" className="tool-calc-input w-full" value={experimental} onChange={e => setExperimental(e.target.value)} />
                        <p className="text-xs text-muted-foreground mt-1.5">Your measured / observed result</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest block">Theoretical Value (Accepted)</label>
                        <input type="number" placeholder="e.g. 9.81" className="tool-calc-input w-full" value={theoretical} onChange={e => setTheoretical(e.target.value)} />
                        <p className="text-xs text-muted-foreground mt-1.5">Known / accepted / expected value (cannot be 0)</p>
                      </div>
                    </div>

                    {result && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-3">
                        {/* Main result */}
                        <div className={`p-5 rounded-xl border-2 bg-${color}-500/5 border-${color}-500/30 text-center`}>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Percentage Error</p>
                          <p className={`text-5xl font-black text-${color}-600 dark:text-${color}-400`}>{result.percentError.toFixed(4)}<span className="text-2xl ml-1">%</span></p>
                          <p className="text-sm text-muted-foreground mt-2 font-medium">
                            Your measurement was <strong className="text-foreground">{result.overUnder === "exact" ? "exact" : `${result.overUnder}estimated`}</strong>
                            {result.overUnder !== "exact" && ` by ${result.absoluteError.toFixed(4)} units (${result.signedPercentError.toFixed(4)}%)`}
                          </p>
                        </div>

                        {/* Detail stats */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-3 rounded-xl bg-muted/60 border border-border">
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Absolute Error</p>
                            <p className="text-lg font-black text-foreground">{result.absoluteError.toFixed(4)}</p>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-muted/60 border border-border">
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Relative Error</p>
                            <p className="text-lg font-black text-foreground">{result.relativeError.toFixed(6)}</p>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-muted/60 border border-border">
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Rating</p>
                            <p className={`text-lg font-black capitalize text-${color}-600 dark:text-${color}-400`}>{errorLevel}</p>
                          </div>
                        </div>

                        <button onClick={copyResult} className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500 text-white font-bold text-sm rounded-xl hover:bg-rose-600 transition-colors">
                          {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Result</>}
                        </button>
                      </motion.div>
                    )}

                    {isValid === false && experimental && theoretical && (
                      <p className="mt-3 text-sm text-red-500 font-medium">⚠ Theoretical value cannot be zero (division by zero).</p>
                    )}

                    {result && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            A {result.percentError.toFixed(2)}% error is considered <strong className="text-foreground">{errorLevel}</strong> for most lab experiments. {errorLevel === "excellent" ? "Values under 1% indicate highly accurate measurement technique and equipment." : errorLevel === "good" ? "Values 1–5% are acceptable in most undergraduate physics and chemistry labs." : errorLevel === "acceptable" ? "Values 5–10% are within acceptable range for introductory lab experiments with basic equipment." : "Values above 10% may indicate measurement errors, contamination, or incorrect technique — review your experimental method."}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Calculate Percentage Error</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Percentage error measures how accurate an experimental result is compared to the accepted theoretical value. It's a fundamental metric in science and engineering — used in lab reports, quality control, and measurement verification across all STEM disciplines.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter your experimental (measured) value</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">This is the value you measured or observed in your experiment. Examples: the density you calculated from your sample (8.92 g/cm³), the acceleration due to gravity you measured on an inclined plane (9.65 m/s²), or the boiling point you recorded in your chemistry lab (101.2°C).</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter the theoretical (accepted) value</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">This is the known, accepted, or expected value from a reference source. Examples: the accepted density of copper (8.96 g/cm³), standard gravity (9.81 m/s²), or the standard boiling point of water at 1 atm (100°C). The theoretical value cannot be zero (it's the denominator in the formula).</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Read and interpret your result</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The calculator shows the percentage error, absolute error, relative error, and whether your measurement was an overestimate or underestimate. The rating (Excellent/Good/Acceptable/High) contextualizes your error within standard lab accuracy expectations.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Error Metrics Reference</p>
                <div className="space-y-2">
                  {[["% Error","|(Exp − Theo)| ÷ |Theo| × 100  — main lab report metric"],["Absolute Error","|Experimental − Theoretical|  — error in original units"],["Relative Error","Absolute Error ÷ |Theoretical|  — dimensionless ratio"],["Signed Error","(Exp − Theo) ÷ |Theo| × 100  — shows over/under direction"]].map(([k,v])=>(
                    <div key={k} className="flex items-start gap-3">
                      <span className="text-rose-500 font-bold text-xs w-28 flex-shrink-0 pt-1">{k}</span>
                      <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">{v}</code>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Interpreting Your Percentage Error</h2>
              <p className="text-muted-foreground text-sm mb-6">What different error ranges typically mean for lab work:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Under 1% — Excellent Accuracy</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Exceptional laboratory technique. Typical of professional research labs, calibrated instruments, and carefully controlled experimental conditions. In most undergraduate lab reports, anything under 1% would receive full marks for accuracy and warrants comment on the precision of technique used.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">1%–5% — Good Accuracy</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Standard accuracy range for university-level lab experiments using quality equipment. Measurement uncertainty from instrument precision, environmental factors, and human technique typically falls in this range. Expected for experiments measuring well-known constants like g, specific heat capacity, and refractive index.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">5%–10% — Acceptable for Introductory Labs</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Acceptable range for high school science experiments and introductory college labs with basic equipment. Sources of error at this level are usually identifiable — instrument resolution limits, heat loss in calorimetry, friction in mechanics experiments. Should be discussed in your error analysis section.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Above 10% — Significant Error, Review Required</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Errors above 10% typically indicate systematic errors: incorrect technique, miscalibrated equipment, contaminated samples, or flawed experimental design. These should be identified and addressed in your error analysis. Re-running the experiment with corrections is advisable.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Percentage Error Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Experiment</th><th className="text-left px-4 py-3 font-bold text-foreground">Experimental</th><th className="text-left px-4 py-3 font-bold text-foreground">Theoretical</th><th className="text-left px-4 py-3 font-bold text-foreground">% Error</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    {[["Gravity (inclined plane)","9.65 m/s²","9.81 m/s²","1.63%"],["Copper density","8.92 g/cm³","8.96 g/cm³","0.45%"],["Water boiling point","101.2°C","100.0°C","1.20%"],["Speed of sound","340 m/s","343 m/s","0.87%"],["Newton's 2nd Law","4.85 N","5.00 N","3.00%"]].map(([e,ex,th,pct])=>(
                      <tr key={e} className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">{e}</td><td className="px-4 py-3 font-mono text-foreground">{ex}</td><td className="px-4 py-3 font-mono text-muted-foreground">{th}</td><td className="px-4 py-3 font-bold text-rose-600">{pct}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Writing percentage error in lab reports:</strong> Always state whether your error was an overestimate or underestimate, identify potential sources of systematic and random error, and explain how your percentage error compares to the acceptable range for that type of experiment. A well-written error analysis is often more valuable to lab instructors than the numerical result itself.</p>
                <p><strong className="text-foreground">Percentage error vs. percentage difference:</strong> Percentage error compares a measurement to a known theoretical value. Percentage difference compares two measured values when neither is the accepted standard — using the average of both values as the denominator. Use this tool for percentage error (experimental vs. theory), and the Percentage Change Calculator for comparing two experimental measurements.</p>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-rose-500/5 border border-rose-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_,i)=><svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Used for my physics lab report — gave me all three error metrics at once (absolute, relative, percentage) so I didn't have to calculate them separately. The rating system helped me contextualize my 2.1% error as 'good'."</p>
                <p className="text-xs text-muted-foreground mt-2">— Physics student feedback, 2025</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Percentage Error Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Three error metrics in one calculation.</strong> Most percentage error calculators only show the single percentage result. This tool simultaneously calculates absolute error (in original units), relative error (dimensionless), and percentage error — plus signed error showing direction (overestimate vs. underestimate), giving you everything needed for a complete error analysis.</p>
                <p><strong className="text-foreground">Contextual accuracy rating with colour coding.</strong> The Excellent / Good / Acceptable / High rating system translates the raw percentage into lab-relevant context — saving you from looking up "what is a good percentage error" after every calculation. The colour-coded display also makes results immediately interpretable at a glance.</p>
                <p><strong className="text-foreground">Over/under direction explicitly shown.</strong> Many contexts require knowing not just the magnitude of error, but whether the experimental value was an overestimate or underestimate of the theoretical. This signed error information helps identify systematic biases in experimental technique (e.g., consistently reading a meniscus above the actual level).</p>
                <p><strong className="text-foreground">Works for any scientific field and any units.</strong> Whether you're calculating the percentage error on a density measurement (g/cm³), temperature reading (°C or K), force (N), voltage (V), or time (s), the formula works identically — just enter the values and the tool handles the rest regardless of units.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> The theoretical value must be non-zero (it's the denominator). If your theoretical value is zero, percentage error is undefined — use absolute error instead. When comparing two experimental values neither of which is the "accepted" value, use percentage difference (average of both values as denominator) rather than percentage error.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is the percentage error formula?" a="Percentage Error = (|Experimental Value − Theoretical Value| ÷ |Theoretical Value|) × 100. The absolute value (| |) signs ensure the result is always positive regardless of whether the experimental value is higher or lower than theoretical. Multiply by 100 to express as a percentage rather than a decimal." />
                <FaqItem q="What is a good percentage error for a lab experiment?" a="The acceptable range depends on the experiment type and level. Under 1% is excellent (professional-grade). 1-5% is good (standard undergraduate lab). 5-10% is acceptable for introductory labs. Above 10% warrants investigation of systematic errors. Your instructor may have specific expectations — check your lab manual for the acceptable error threshold for each experiment." />
                <FaqItem q="What is the difference between percentage error and percentage difference?" a="Percentage error compares one value (experimental) to a known standard (theoretical): |Exp − Theo| ÷ |Theo| × 100. Percentage difference compares two measured values with no accepted standard: |A − B| ÷ ((A + B)/2) × 100. Use percentage error when a theoretical value is known; use percentage difference when comparing two experiments of equal validity." />
                <FaqItem q="Can percentage error be negative?" a="The standard percentage error formula uses absolute values, so the result is always positive (or zero for exact measurements). The signed percentage error (shown as the undirected result in this calculator) can be negative — a negative signed error means your experimental value was lower than the theoretical value (an underestimate)." />
                <FaqItem q="My percentage error was over 20% — what went wrong?" a="Large errors typically indicate: systematic error (faulty equipment, incorrect calibration, or a consistent technique mistake), contamination of reagents or samples, incorrect identification of the theoretical value, a mathematical error in calculating the experimental result, or environmental factors not controlled (temperature, humidity, air resistance). Review each step methodically, check your calculations, and re-run the experiment if possible." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-pink-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Math &amp; Science Calculators</h2>
                <p className="text-white/80 mb-6 max-w-lg">400+ free calculators for students, scientists, and engineers — instant results, no account needed.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-rose-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">Explore All Tools <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED.map(t => (
                    <Link key={t.slug} href={`/${t.cat}/${t.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${t.color} 70% 55%), hsl(${t.color} 75% 42%))` }}>{t.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{t.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{t.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-rose-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share with students and researchers.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-rose-500 to-pink-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {linkCopied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator","How to Use","Result Interpretation","Quick Examples","Why Choose This","FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g,"-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-rose-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-rose-500/40 flex-shrink-0" />{label}
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
