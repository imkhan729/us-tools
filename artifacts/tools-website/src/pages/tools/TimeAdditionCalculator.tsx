import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Clock, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, PlusCircle, Timer, CalendarClock
} from "lucide-react";

// ── Calculator Logic ──
function useCalc() {
  const [h1, setH1] = useState("2");
  const [m1, setM1] = useState("45");
  const [s1, setS1] = useState("0");

  const [h2, setH2] = useState("1");
  const [m2, setM2] = useState("30");
  const [s2, setS2] = useState("0");
  
  const result = useMemo(() => {
    const hours1 = parseInt(h1) || 0;
    const mins1 = parseInt(m1) || 0;
    const secs1 = parseInt(s1) || 0;

    const hours2 = parseInt(h2) || 0;
    const mins2 = parseInt(m2) || 0;
    const secs2 = parseInt(s2) || 0;

    let totalSecs = secs1 + secs2;
    let totalMins = mins1 + mins2 + Math.floor(totalSecs / 60);
    totalSecs %= 60;

    let totalHours = hours1 + hours2 + Math.floor(totalMins / 60);
    totalMins %= 60;

    const decimalHours = +(totalHours + (totalMins / 60) + (totalSecs / 3600)).toFixed(3);
    const overallMinutes = (totalHours * 60) + totalMins + (totalSecs > 0 ? (totalSecs / 60) : 0);

    return {
      totalHours,
      totalMins,
      totalSecs,
      decimalHours,
      overallMinutes,
    };
  }, [h1, m1, s1, h2, m2, s2]);
  
  return {
    h1, setH1, m1, setM1, s1, setS1,
    h2, setH2, m2, setM2, s2, setS2,
    result
  };
}

// ── Result Insight Component ──
function ResultInsight({ result }: { result: any }) {
  if (!result) return null;

  let message = `Adding the two time values yields exactly ${result.totalHours} hours, ${result.totalMins} minutes, and ${result.totalSecs} seconds. `;
  
  message += `In decimal format, this equals ${result.decimalHours} total hours.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
        <p className="text-[15px] font-medium text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-orange-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-orange-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Time Subtraction", slug: "time-subtraction-calculator", icon: <Clock className="w-5 h-5" />, color: 25, benefit: "Subtract hours and minutes easily" },
  { title: "Time Duration", slug: "time-duration-calculator", icon: <CalendarClock className="w-5 h-5" />, color: 140, benefit: "Find duration between two clock times" },
  { title: "Work Hours Tracker", slug: "work-hours-calculator", icon: <Timer className="w-5 h-5" />, color: 210, benefit: "Log your weekly shift hours" },
];

export default function TimeAdditionCalculator() {
  const calc = useCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Time Addition Calculator – Add Hours, Minutes, and Seconds"
        description="Free online Time Addition Calculator. Easily add various lengths of hours, minutes, and seconds together. No signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Time Addition Calculator</span>
        </nav>

        {/* ── HERO SECTION ── */}
        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <PlusCircle className="w-3.5 h-3.5" />
            Time &amp; Math
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Time Addition Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Accumulating time values by hand can get tricky due to standard 60-base math logic. Use this arithmetic calculator to correctly add blocks of hours, minutes, and seconds together instantly.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" /> Base-60 Arithmetics
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
          </div>

          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Time &amp; Date &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── 2. TOOL WIDGET ── */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Time Adder</p>
                      <p className="text-sm text-muted-foreground">Enter hours, minutes, and seconds for two times below.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 30 } as React.CSSProperties}>
                    
                    {/* Time 1 Input row */}
                    <div className="mb-6 p-4 rounded-xl bg-muted/40 border border-border">
                      <p className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">Time Period 1</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Hours</label>
                          <input type="number" min="0" className="tool-calc-input text-lg py-3 w-full" value={calc.h1} onChange={e => calc.setH1(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Mins</label>
                          <input type="number" min="0" className="tool-calc-input text-lg py-3 w-full" value={calc.m1} onChange={e => calc.setM1(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Secs</label>
                          <input type="number" min="0" className="tool-calc-input text-lg py-3 w-full" value={calc.s1} onChange={e => calc.setS1(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center -my-3 relative z-10">
                      <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center border-4 border-card outline outline-neutral-200 dark:outline-neutral-800 shadow-sm">
                        <PlusCircle className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Time 2 Input row */}
                    <div className="mb-6 p-4 rounded-xl bg-muted/40 border border-border">
                      <p className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">Time Period 2</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Hours</label>
                          <input type="number" min="0" className="tool-calc-input text-lg py-3 w-full" value={calc.h2} onChange={e => calc.setH2(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Mins</label>
                          <input type="number" min="0" className="tool-calc-input text-lg py-3 w-full" value={calc.m2} onChange={e => calc.setM2(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Secs</label>
                          <input type="number" min="0" className="tool-calc-input text-lg py-3 w-full" value={calc.s2} onChange={e => calc.setS2(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {calc.result && (
                      <div className="mt-8">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 text-center">Total Addition Result</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-center relative overflow-hidden h-32">
                            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-1 uppercase tracking-widest relative z-10">Standard Format</span>
                            <span className="text-3xl font-black text-orange-600 dark:text-orange-400 relative z-10">
                              {calc.result.totalHours}h {calc.result.totalMins}m {calc.result.totalSecs}s
                            </span>
                          </div>
                          
                          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[hsl(var(--calc-hue),70%,96%)] dark:bg-[hsl(var(--calc-hue),70%,14%)] border border-[hsl(var(--calc-hue),50%,80%)] dark:border-[hsl(var(--calc-hue),50%,30%)] text-center h-32">
                            <span className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-widest">Decimal Hours Form</span>
                            <span className="text-3xl font-black text-foreground">
                              {calc.result.decimalHours}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <ResultInsight result={calc.result} />
                  </div>
                </div>
              </div>
            </section>

            {/* ── 3. HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Time Addition Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Whenever you need to merge flight durations, log multiple work shifts into a single sum, or track long distance driving trips, simple math becomes difficult. A regular calculator uses a base-10 counting system, while clocks rely upon base-60.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter File Duration 1</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Begin by inputting your first chronological chunk block inside the <em>Time Period 1</em> fields. You only have to insert values into the metrics you have — leaving seconds empty is just treated as zero.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter External Duration 2</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Follow up by typing your second block in the bottom set of inputs. If you add "90 minutes", the tool natively filters that extra spillage into rolling hours automatically.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Evaluate Rollover Differences</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Take notice of your final calculation standardizing to a precise H:M:S breakdown, alongside exactly what the combined span resolves down into standard decimal blocks if doing freelance wage billing.
                    </p>
                  </div>
                </li>
              </ol>
            </section>

            {/* ── 5. QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Common Time Addition Pairings</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Time Period 1</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Time Period 2</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Total Output Form</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Decimal Match</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">0h 45m</td>
                      <td className="px-4 py-3 font-mono text-foreground">0h 30m</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">1h 15m</td>
                      <td className="px-4 py-3 text-muted-foreground">1.25</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">1h 20m</td>
                      <td className="px-4 py-3 font-mono text-foreground">1h 50m</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">3h 10m</td>
                      <td className="px-4 py-3 text-muted-foreground">3.167</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">2h 45m</td>
                      <td className="px-4 py-3 font-mono text-foreground">2h 45m</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">5h 30m</td>
                      <td className="px-4 py-3 text-muted-foreground">5.50</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">11h 59m 30s</td>
                      <td className="px-4 py-3 font-mono text-foreground">0h 1m 30s</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">12h 01m 00s</td>
                      <td className="px-4 py-3 text-muted-foreground">12.017</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── 7. FAQ ── */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="Why are manual additions often miscalculated?"
                  a="Most people intuitively add decimalized numbers because standard calculators group values out of 10 or 100. Adding 30 to 45 naturally makes 75 conventionally, but in 'clock math', this surpasses the base-60 cap — properly yielding 1 rolled hour and 15 extra leftover minutes."
                />
                <FaqItem
                  q="Can I add values over 60 directly into the minutes column?"
                  a="Absolutely! The calculator dynamically reads any minutes exceeding past the standard 60-metric limit and immediately refines them. Tying '90 minutes' into period 2 operates identical to pasting '1 hour and 30 minutes'."
                />
                <FaqItem
                  q="Is this useful for calculating timesheets or payroll?"
                  a="Yes, especially since it provides a 'Decimal Form' read output automatically for tracking wage multiplying integrations precisely. If your wage software needs 7.75 instead of 7 hours and 45 minutes, this will hand it over fast."
                />
              </div>
            </section>

            {/* ── 8. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need to Reduce Times Instead?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Instantly compute differences across times. Proceed to our official Time Subtraction Calculator to trim clock durations efficiently.
                </p>
                <Link
                  href="/time-date/time-subtraction-calculator"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Go to Time Subtraction <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Related Tools */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/time-date/${tool.slug}`}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-orange-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others manipulate clock arithmetic easily.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    "Calculator",
                    "How to Use",
                    "Quick Examples",
                    "FAQ",
                  ].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-orange-500 font-medium py-1.5 transition-colors"
                    >
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
