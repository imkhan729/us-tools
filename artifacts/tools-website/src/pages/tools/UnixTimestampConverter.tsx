import { useState, useMemo, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Clock, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Database, Hourglass, RefreshCw
} from "lucide-react";

// ── Calculator Logic ──
function useCalc() {
  const [timestamp, setTimestamp] = useState("");
  const [dateInput, setDateInput] = useState("");
  
  // Set current time on mount
  useEffect(() => {
    const now = new Date();
    setTimestamp(Math.floor(now.getTime() / 1000).toString());
    
    // Format YYYY-MM-DDTHH:mm
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - tzoffset)).toISOString().slice(0, 16);
    setDateInput(localISOTime);
  }, []);
  
  const handleTimestampChange = (val: string) => {
    setTimestamp(val);
    const parsed = parseInt(val);
    if (!isNaN(parsed)) {
      // Auto-detect if it's ms or seconds. If digits > 12, likely ms.
      const isMs = val.length > 11;
      const date = new Date(isMs ? parsed : parsed * 1000);
      
      if (!isNaN(date.getTime())) {
        const tzoffset = (new Date()).getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, 16);
        setDateInput(localISOTime);
      }
    }
  };

  const handleDateChange = (val: string) => {
    setDateInput(val);
    const date = new Date(val);
    if (!isNaN(date.getTime())) {
      setTimestamp(Math.floor(date.getTime() / 1000).toString());
    }
  };

  const result = useMemo(() => {
    if (!timestamp) return null;
    
    const parsed = parseInt(timestamp);
    if (isNaN(parsed)) return null;

    const isMs = timestamp.length > 11;
    const msValue = isMs ? parsed : parsed * 1000;
    const date = new Date(msValue);
    
    if (isNaN(date.getTime())) return null;

    const formattedUTC = date.toUTCString();
    const formattedLocal = date.toLocaleString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long', 
      day: 'numeric', hour: '2-digit', minute:'2-digit', second:'2-digit', timeZoneName: 'short'
    });
    
    const isoString = date.toISOString();

    return {
      msValue,
      secondsValue: Math.floor(msValue / 1000),
      formattedUTC,
      formattedLocal,
      isoString,
      isMs
    };
  }, [timestamp]);
  
  return {
    timestamp, handleTimestampChange,
    dateInput, handleDateChange,
    result
  };
}

// ── Result Insight Component ──
function ResultInsight({ result }: { result: any }) {
  if (!result) return null;

  let message = `This timestamp represents exactly ${result.formattedUTC} in Universal Coordinated Time (UTC). `;
  
  if (result.isMs) {
    message += "We auto-detected that this value is formatted in milliseconds rather than standard Unix seconds.";
  }

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
  { title: "Time Zone Converter", slug: "time-zone-converter", icon: <RefreshCw className="w-5 h-5" />, color: 25, benefit: "Swap times across the globe" },
  { title: "Date Difference", slug: "date-difference-calculator", icon: <Hourglass className="w-5 h-5" />, color: 140, benefit: "Measure gaps between timestamps" },
  { title: "Age Calculator", slug: "age-calculator", icon: <Clock className="w-5 h-5" />, color: 210, benefit: "Calculate exact elapsed lifetime" },
];

export default function UnixTimestampConverter() {
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
        title="Online Unix Timestamp Converter – Epoch to Human Readable Date"
        description="Convert Unix epoch timestamps to human-readable dates, or translate a calendar date back into seconds instantly. Free Unix time calculator."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Online Unix Timestamp Converter</span>
        </nav>

        {/* ── HERO SECTION ── */}
        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Database className="w-3.5 h-3.5" />
            Developer Tools
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Online Unix Timestamp Converter
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Translate machine-readable epoch timestamps into your exact local time natively. Support for standard 10-digit seconds or 13-digit JavaScript millisecond variants.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" /> Auto-Detect Format
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup Required
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
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Epoch Decoder</p>
                      <p className="text-sm text-muted-foreground">Paste an integer timestamp or select a target date.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 30 } as React.CSSProperties}>
                    
                    {/* Dual Binding Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                      <div className="hidden md:flex absolute inset-y-0 left-1/2 -translate-x-1/2 items-center justify-center pointer-events-none z-10">
                        <div className="bg-card w-8 h-8 rounded-full border-2 border-border flex items-center justify-center shadow-sm">
                          <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-muted/40 border border-border">
                        <label className="text-xs font-bold text-foreground uppercase tracking-widest mb-3 block text-center">Unix Epoch Integer</label>
                        <input
                          type="number"
                          className="tool-calc-input text-xl py-4 w-full text-center font-mono"
                          value={calc.timestamp}
                          onChange={e => calc.handleTimestampChange(e.target.value)}
                          placeholder="e.g. 1711284800"
                        />
                        <p className="text-xs text-muted-foreground mt-3 text-center">Seconds or Milliseconds.</p>
                      </div>

                      <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/20">
                        <label className="text-xs font-bold text-foreground uppercase tracking-widest mb-3 block text-center">Local Calendar Input</label>
                        <input
                          type="datetime-local"
                          className="tool-calc-input text-lg py-4 w-full border-orange-500/30 focus:border-orange-500 text-center"
                          value={calc.dateInput}
                          onChange={e => calc.handleDateChange(e.target.value)}
                        />
                        <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-3 text-center">Defaults to your local device timezone.</p>
                      </div>
                    </div>

                    {calc.result && (
                      <div className="mt-8">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 pl-1">Decoded Properties</p>
                        
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[hsl(var(--calc-hue),70%,96%)] dark:bg-[hsl(var(--calc-hue),70%,14%)] border border-[hsl(var(--calc-hue),50%,80%)] dark:border-[hsl(var(--calc-hue),50%,30%)]">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-0">Your Local Time</span>
                            <span className="text-base sm:text-lg font-black text-foreground">
                              {calc.result.formattedLocal}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-card border border-border">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-0">Strict UTC Server Time</span>
                            <span className="text-sm font-mono text-muted-foreground">
                              {calc.result.formattedUTC}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-card border border-border">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-0">ISO 8601 String</span>
                            <span className="text-sm font-mono text-muted-foreground">
                              {calc.result.isoString}
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
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Decoding Epoch Time Strings</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Most computing systems and databases fundamentally store dates as a singular integer tallying the number of seconds that have passed since an arbitrary starting node in the distant past (January 1st, 1970). 
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Paste Your Integer</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Insert your integer code into the left pane. We automatically evaluate its length to decipher whether your server outputs values in seconds (Standard Unix) or milliseconds (JavaScript standard).
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Translate Dates in Reverse</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Conversely, if you are attempting to configure a system that strictly requires a timestamp entry, you can plug your target human-date into the right menu to forge an integer backward.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Read Your Results Contextually</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Our calculator unpacks that integer into three main forms explicitly. We yield your exact timezone representation simultaneously against a strict UTC marker and ISO 8601.
                    </p>
                  </div>
                </li>
              </ol>
            </section>

            {/* ── 5. QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Historical Epoch Timestamps</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Significance</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Epoch Value (Seconds)</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Human Readable Output</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">Zero Point (The Epoch)</td>
                      <td className="px-4 py-3 font-mono font-bold text-orange-600 dark:text-orange-400">0</td>
                      <td className="px-4 py-3 text-muted-foreground">Jan 1, 1970 00:00:00 UTC</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">1 Billion Seconds</td>
                      <td className="px-4 py-3 font-mono font-bold text-orange-600 dark:text-orange-400">1000000000</td>
                      <td className="px-4 py-3 text-muted-foreground">Sep 9, 2001 01:46:40 UTC</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">The Year 2020</td>
                      <td className="px-4 py-3 font-mono font-bold text-orange-600 dark:text-orange-400">1577836800</td>
                      <td className="px-4 py-3 text-muted-foreground">Jan 1, 2020 00:00:00 UTC</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">The Y2038 Problem Limit</td>
                      <td className="px-4 py-3 font-mono font-bold text-orange-600 dark:text-orange-400">2147483647</td>
                      <td className="px-4 py-3 text-muted-foreground">Jan 19, 2038 03:14:07 UTC</td>
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
                  q="What is the Unix Epoch Timestamp originally based on?"
                  a="The Unix Epoch is merely a unified time tracking convention utilized in programming systems worldwide. It denotes the exact amount of seconds that have permanently transpired since January 1st, 1970, at 00:00:00 Coordinated Universal Time (UTC). It intentionally excludes leap seconds."
                />
                <FaqItem
                  q="What is the Year 2038 Problem?"
                  a="Also known mathematically as 'Y2K38', the original 32-bit timestamp architecture caps itself out natively at an integer value of exactly 2,147,483,647. If outdated systems pass January 19, 2038, the clock integer flips negatively, causing potential cascading software failures."
                />
                <FaqItem
                  q="Does Epoch consider time tracking zones naturally?"
                  a="No! The epoch string is inherently localized to UTC globally. It is an absolute measure of objective passed time. Your local web browser takes that pure integer and injects geography back into it to shift the result out to your local formatting layer."
                />
              </div>
            </section>

            {/* ── 8. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Want to Compare File Versions?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Need to check the elapsed dates between multiple generated timestamps? Convert them to local dates inside our tool, then calculate their exact separation metrics securely using our Date Difference utility.
                </p>
                <Link
                  href="/time-date/date-difference-calculator"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Measure Date Differences <ArrowRight className="w-4 h-4" />
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
                <p className="text-xs text-muted-foreground mb-3">Help a developer decode timestamps easily.</p>
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
