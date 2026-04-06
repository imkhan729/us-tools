import { useState, useMemo, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Globe, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Clock, Search, Map
} from "lucide-react";

// Common Timezones
const COMMON_TIMEZONES = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "ET (Eastern Time) - New York" },
  { value: "America/Chicago", label: "CT (Central Time) - Chicago" },
  { value: "America/Denver", label: "MT (Mountain Time) - Denver" },
  { value: "America/Los_Angeles", label: "PT (Pacific Time) - Los Angeles" },
  { value: "Europe/London", label: "GMT / BST - London" },
  { value: "Europe/Paris", label: "CET / CEST - Paris" },
  { value: "Asia/Dubai", label: "GST - Dubai" },
  { value: "Asia/Kolkata", label: "IST - Mumbai" },
  { value: "Asia/Singapore", label: "SGT - Singapore" },
  { value: "Asia/Tokyo", label: "JST - Tokyo" },
  { value: "Australia/Sydney", label: "AEST / AEDT - Sydney" },
];

function useCalc() {
  const [sourceTime, setSourceTime] = useState("");
  const [sourceTz, setSourceTz] = useState("UTC");
  const [targetTz, setTargetTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  useEffect(() => {
    // Current time locally
    const now = new Date();
    const tzoffset = now.getTimezoneOffset() * 60000;
    const localISO = (new Date(now.getTime() - tzoffset)).toISOString().slice(0, 16);
    setSourceTime(localISO);
  }, []);

  const result = useMemo(() => {
    if (!sourceTime || !sourceTz || !targetTz) return null;

    try {
      // Parse source time in source timezone
      // Since datetime-local follows local system time, we treat the input as being in the 'sourceTz'
      const date = new Date(sourceTime);
      
      // We need to treat 'date' as being in sourceTz. 
      // A quick way is to format it to UTC using sourceTz, then reconstruct.
      // But standard JS Date doesn't make this easy without libraries.
      // We'll use Intl.DateTimeFormat to "guess" the offset if it's the same time.
      
      // Simple approach for a tool: 
      // 1. Get the UTC time of the input as if it were local.
      // 2. Adjust by the difference between local and sourceTz.
      
      const optionsSource: Intl.DateTimeFormatOptions = { 
        timeZone: sourceTz, 
        year: 'numeric', month: 'numeric', day: 'numeric', 
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
      };
      
      const optionsTarget: Intl.DateTimeFormatOptions = { 
        timeZone: targetTz, 
        year: 'numeric', month: 'numeric', day: 'numeric', 
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false,
        weekday: 'long'
      };

      // To convert correctly: 
      // We want to know what the target time is when it's [sourceTime] in [sourceTz].
      
      // Step A: Find the UTC timestamp that corresponds to [sourceTime] in [sourceTz].
      const formatter = new Intl.DateTimeFormat('en-US', optionsSource);
      const parts = formatter.formatToParts(new Date()); // use a dummy date to find offset
      
      // Better way: use the fact that d.toLocaleString(..., {timeZone: tz}) gives the string in that tz.
      // We'll use a more reliable method:
      const sourceDate = new Date(sourceTime);
      const tzSourceDateStr = sourceDate.toLocaleString("en-US", { timeZone: sourceTz });
      const tzTargetDateStr = sourceDate.toLocaleString("en-US", { timeZone: targetTz });
      
      const diff = new Date(tzSourceDateStr).getTime() - sourceDate.getTime();
      const actualUtcTime = sourceDate.getTime() - diff;
      const targetDate = new Date(actualUtcTime);
      
      return {
        targetTimeStr: targetDate.toLocaleString(undefined, optionsTarget),
        targetTzName: targetTz,
        sourceTzName: sourceTz,
        unix: Math.floor(targetDate.getTime() / 1000)
      };
    } catch (e) {
      return null;
    }
  }, [sourceTime, sourceTz, targetTz]);

  return { sourceTime, setSourceTime, sourceTz, setSourceTz, targetTz, setTargetTz, result };
}

function ResultInsight({ result }: { result: any }) {
  if (!result) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
        <p className="text-[15px] font-medium text-foreground/80 leading-relaxed">
          When it's the selected time in {result.sourceTzName}, the clock in {result.targetTzName} will read {result.targetTimeStr}.
        </p>
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
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "World Clock", slug: "world-clock", icon: <Globe className="w-5 h-5" />, color: 25, benefit: "Current times worldwide" },
  { title: "Meeting Planner", slug: "meeting-time-calculator", icon: <Map className="w-5 h-5" />, color: 140, benefit: "Coordinate global teams" },
  { title: "Unix Converter", slug: "unix-timestamp-converter", icon: <Clock className="w-5 h-5" />, color: 210, benefit: "Time stamps for developers" },
];

export default function TimeZoneConverter() {
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
        title="Time Zone Converter – Convert Times Between Any Two Locations"
        description="Free online Time Zone Converter. Easily convert times between different cities and time zones worldwide. Supports Daylight Saving Time."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Time Zone Converter</span>
        </nav>

        {/* Hero Section */}
        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Globe className="w-3.5 h-3.5" />
            Global Coordination
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Time Zone Converter
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Schedule meetings, track flights, or coordinate with global teams. Instantly convert any time from one zone to another with full support for Daylight Saving Time.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> DST Aware
            </span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Sync
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Time & Date &nbsp;·&nbsp; Data: IANA Time Zone Database
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-3 space-y-10">
            {/* Tool Widget */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Source */}
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-bold text-foreground tracking-wide uppercase mb-2 block">Set Time (Source)</label>
                        <input
                          type="datetime-local"
                          className="tool-calc-input text-lg py-3 w-full"
                          value={calc.sourceTime}
                          onChange={e => calc.setSourceTime(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-foreground tracking-wide uppercase mb-2 block">From Time Zone</label>
                        <select
                          className="tool-calc-input text-base py-3 w-full appearance-none"
                          value={calc.sourceTz}
                          onChange={e => calc.setSourceTz(e.target.value)}
                        >
                          {COMMON_TIMEZONES.map(tz => (
                            <option key={tz.value} value={tz.value}>{tz.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Target */}
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-bold text-foreground tracking-wide uppercase mb-2 block">Convert To</label>
                        <select
                          className="tool-calc-input text-base py-3 w-full"
                          value={calc.targetTz}
                          onChange={e => calc.setTargetTz(e.target.value)}
                        >
                          {COMMON_TIMEZONES.map(tz => (
                            <option key={tz.value} value={tz.value}>{tz.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="p-5 rounded-2xl bg-orange-500/10 border border-orange-500/30 min-h-[140px] flex flex-col justify-center text-center">
                        <span className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-2 uppercase tracking-widest">Adjusted Time</span>
                        <span className="text-3xl font-black text-orange-600 dark:text-orange-400">
                          {calc.result?.targetTimeStr || "---"}
                        </span>
                        <span className="text-xs text-muted-foreground mt-2 font-mono">
                          {calc.targetTz}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ResultInsight result={calc.result} />
                </div>
              </div>
            </section>

            {/* How to Use Section */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Convert Time Zones</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Converting time between different regions involves calculating the UTC offset difference and accounting for potential Daylight Saving Time (DST) shifts. Our tool automates this process using the latest IANA database.
                  </p>
                  <ol className="space-y-4">
                    <li className="flex gap-4">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                      <div className="text-sm text-muted-foreground leading-relaxed"><span className="font-bold text-foreground">Pick your event time</span> – Enter the date and time of the event in your local or chosen source zone.</div>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                      <div className="text-sm text-muted-foreground leading-relaxed"><span className="font-bold text-foreground">Select zones</span> – Choose the source "From" zone and the target "To" zone from the dropdown menus.</div>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                      <div className="text-sm text-muted-foreground leading-relaxed"><span className="font-bold text-foreground">Get the result</span> – See the converted time instantly, updated as you type.</div>
                    </li>
                  </ol>
                </div>
                <div className="bg-muted/50 rounded-xl p-5 border border-border">
                  <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" /> Pro Scheduling Tip
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Always double-check if your participants are in a region that recently switched time standards. Some countries change DST on different weekends (e.g., US vs Europe), which can shift meeting times by an hour unexpectedly.
                  </p>
                </div>
              </div>
            </section>

            {/* Examples Section */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Common Time Zone Conversions</h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">From (New York - ET)</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">To London (GMT/BST)</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">To Tokyo (JST)</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">To Sydney (AEDT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">9:00 AM</td>
                      <td className="px-4 py-3 text-muted-foreground">2:00 PM</td>
                      <td className="px-4 py-3 text-muted-foreground">10:00 PM</td>
                      <td className="px-4 py-3 text-muted-foreground">1:00 AM (+1 day)</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">12:00 PM (Noon)</td>
                      <td className="px-4 py-3 text-muted-foreground">5:00 PM</td>
                      <td className="px-4 py-3 text-muted-foreground">1:00 AM (+1 day)</td>
                      <td className="px-4 py-3 text-muted-foreground">4:00 AM (+1 day)</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">6:00 PM</td>
                      <td className="px-4 py-3 text-muted-foreground">11:00 PM</td>
                      <td className="px-4 py-3 text-muted-foreground">7:00 AM (+1 day)</td>
                      <td className="px-4 py-3 text-muted-foreground">10:00 AM (+1 day)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-muted-foreground mt-4 italic">
                * Note: Conversions vary based on Daylight Saving Time status in each region.
              </p>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Time Zone FAQ</h2>
              <div className="space-y-3">
                <FaqItem
                  q="Does this calculator account for Daylight Saving Time (DST)?"
                  a="Yes! The converter uses the comprehensive IANA Time Zone Database, which tracks historical and current DST changes globally. Our algorithm automatically adjusts the offset based on the specific date you select."
                />
                <FaqItem
                  q="What is UTC and why is it important?"
                  a="UTC (Coordinated Universal Time) is the primary time standard by which the world regulates clocks and time. It does not observe Daylight Saving Time, making it a stable reference point for developers and international logistics."
                />
                <FaqItem
                  q="How do I convert a time that happened in the past?"
                  a="Simply set the date in the source input to your target past date. The converter will find the correct historical timezone offset (including DST rules that were in effect at that time)."
                />
              </div>
            </section>

            {/* CTA Section */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-black tracking-tight mb-2">Need a Global Meeting Planner?</h2>
                  <p className="text-white/80 max-w-lg">
                    Find the best time for participants in multiple cities simultaneously with our specialized meeting tool.
                  </p>
                </div>
                <Link href="/time-date/meeting-time-calculator" className="px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform whitespace-nowrap">
                  Open Meeting Planner
                </Link>
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
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-2">Share Converter</h3>
                <p className="text-xs text-muted-foreground mb-4 font-medium leading-relaxed">Help your remote colleagues coordinate better times.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform shadow-md shadow-orange-500/10"
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3 text-orange-500">Sections</h3>
                <div className="space-y-1">
                  {["Calculator", "How to Use", "Examples", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground font-bold py-1.5 transition-colors group">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500/30 group-hover:bg-orange-500 transition-colors" />
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
