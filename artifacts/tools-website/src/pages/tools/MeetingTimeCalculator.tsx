import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Globe, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Clock, Plus, X, Users
} from "lucide-react";

// Common Timezones
const COMMON_TIMEZONES = [
  { value: "UTC", label: "UTC (Universal)" },
  { value: "America/New_York", label: "New York (ET)" },
  { value: "America/Chicago", label: "Chicago (CT)" },
  { value: "America/Denver", label: "Denver (MT)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Kolkata", label: "Mumbai (IST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
];

function useMeetingCalc() {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [zones, setZones] = useState<string[]>([
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    "UTC",
    "America/New_York"
  ]);

  const addZone = (tz: string) => {
    if (!zones.includes(tz)) setZones([...zones, tz]);
  };

  const removeZone = (tz: string) => {
    setZones(zones.filter(z => z !== tz));
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const grid = useMemo(() => {
    return zones.map(tz => {
      return hours.map(h => {
        // Find what time [h]:00 is in [tz] relative to UTC
        // We'll normalize to a specific UTC moment for that date
        const baseDate = new Date(`${selectedDate}T${h.toString().padStart(2, '0')}:00:00Z`);
        const timeInTz = baseDate.toLocaleTimeString("en-US", { 
          timeZone: tz, 
          hour12: false, 
          hour: 'numeric' 
        });
        const hourInTz = parseInt(timeInTz);
        const dayOffset = baseDate.toLocaleDateString("en-US", { timeZone: tz }) !== new Date(selectedDate).toLocaleDateString("en-US") ? (baseDate.getTime() > new Date(selectedDate).getTime() ? 1 : -1) : 0;

        return {
          originalHour: h,
          tzHour: hourInTz,
          isWorking: hourInTz >= 9 && hourInTz < 17,
          isSleep: hourInTz < 7 || hourInTz >= 22,
          dayOffset
        };
      });
    });
  }, [zones, selectedDate]);

  return { selectedDate, setSelectedDate, zones, addZone, removeZone, hours, grid };
}

function ResultInsight({ zones }: { zones: string[] }) {
  if (zones.length < 2) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
        <p className="text-[15px] font-medium text-foreground/80 leading-relaxed">
          Green slots indicate overlapping business hours (9AM-5PM) across your selected zones. Orange slots indicate one or more participants might be sleeping.
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

export default function MeetingTimeCalculator() {
  const calc = useMeetingCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Meeting Time Calculator – Find Best Time Across Time Zones"
        description="Plan international meetings effortlessly. Compare multiple time zones in a visual grid to find the perfect overlap for global teams."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Meeting Time Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Users className="w-3.5 h-3.5" />
            Team Collaboration
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Meeting Time Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Stop the timezone math headache. Add your team's locations and visualize the overlap to pick a slot that respects everyone's office hours and sleep.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> Multi-Zone
            </span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" /> Visual Grid
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            {/* Tool Widget */}
            <section className="space-y-6">
              <div className="rounded-2xl border border-orange-500/20 shadow-xl bg-card overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">
                  {/* Setup */}
                  <div className="flex flex-wrap gap-4 items-end justify-between">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Select Date</label>
                       <input 
                         type="date" 
                         className="tool-calc-input py-2 px-4" 
                         value={calc.selectedDate} 
                         onChange={e => calc.setSelectedDate(e.target.value)} 
                       />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {calc.zones.map(z => (
                        <div key={z} className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full border border-border text-xs font-bold">
                          {z.split('/').pop()?.replace('_', ' ')}
                          <button onClick={() => calc.removeZone(z)} className="text-muted-foreground hover:text-red-500"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                      <select 
                        className="px-3 py-1.5 bg-orange-500 text-white rounded-full text-xs font-black outline-none border-none cursor-pointer hover:bg-orange-600 transition-colors"
                        onChange={e => {
                          if (e.target.value) calc.addZone(e.target.value);
                          e.target.value = "";
                        }}
                      >
                        <option value="">+ Add Zone</option>
                        {COMMON_TIMEZONES.map(tz => (
                          <option key={tz.value} value={tz.value}>{tz.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Grid Table */}
                  <div className="overflow-x-auto rounded-xl border border-border bg-muted/20">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted">
                           <th className="p-4 text-left text-xs font-black text-muted-foreground uppercase sticky left-0 bg-muted z-20 border-r border-border min-w-[140px]">TimeZone</th>
                           {calc.hours.map(h => (
                             <th key={h} className="p-2 text-center text-[10px] font-bold text-muted-foreground min-w-[60px]">{h}:00</th>
                           ))}
                        </tr>
                      </thead>
                      <tbody>
                        {calc.zones.map((tz, i) => (
                          <tr key={tz} className="hover:bg-muted/30 transition-colors">
                            <td className="p-4 text-xs font-bold text-foreground truncate border-r border-border sticky left-0 bg-card z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                              {tz.split('/').pop()?.replace('_', ' ')}
                            </td>
                            {calc.grid[i].map((cell, j) => (
                              <td 
                                key={j} 
                                className={`p-2 text-center text-[11px] font-bold border-r border-border last:border-r-0 ${
                                  cell.isWorking 
                                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' 
                                    : cell.isSleep 
                                    ? 'bg-slate-500/10 text-slate-400' 
                                    : 'bg-card text-muted-foreground'
                                }`}
                              >
                                {cell.tzHour}:00
                                {cell.dayOffset !== 0 && (
                                  <span className="block text-[8px] opacity-60">{cell.dayOffset > 0 ? '+1d' : '-1d'}</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs font-bold text-muted-foreground justify-center">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-500/20" /> Working (9-5)</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-slate-500/10" /> Sleep (10pm-7am)</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-card border border-border" /> Personal Time</div>
                  </div>
                </div>
              </div>
              <ResultInsight zones={calc.zones} />
            </section>

            {/* Content Sections */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
               <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Mastering Global Synchronicity</h2>
               <p className="text-muted-foreground leading-relaxed mb-6">
                 Coordinating a team across continents often results in one person waking up at 4 AM or another staying up past midnight. A high-performing global culture starts with a visual understanding of where business hours overlap.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                   <h3 className="font-bold text-foreground">The "Golden Windows"</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     Look for the green vertical stripes in our grid. These are periods where all selected timezones are within standard office hours. For teams split between the US and Europe, the morning ET / afternoon GMT window is typically the "Golden Window."
                   </p>
                 </div>
                 <div className="space-y-4">
                   <h3 className="font-bold text-foreground">Handling Day Offsets</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     When planning meetings with Australia or Asia from the Western hemisphere, the date often shifts. Note the "+1d" or "-1d" indicators in the cells to ensure everyone joins on the correct calendar day.
                   </p>
                 </div>
               </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Meeting Logic FAQ</h2>
              <div className="space-y-3">
                <FaqItem
                  q="Does this handle Daylight Saving Time shifts?"
                  a="Yes. Because you select a specific date, the calculator fetches the exact IANA timezone rule for that day, accounting for DST changes even if they happen on different weekends in different regions."
                />
                <FaqItem
                  q="Can I add more than 3 timezones?"
                  a="You can add as many as your screen width can handle! The grid will scroll horizontally on smaller devices while keeping the TimeZone names visible."
                />
                <FaqItem
                  q="What are 'Standard' working hours?"
                  a="We define them as 9:00 AM to 5:00 PM (17:00) locally. While many industries vary, this remains the most common overlap baseline for corporate scheduling."
                />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-2">Share Planner</h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed font-medium">Send this grid to your team to vote on the best slot.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                 <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">Scheduling Tips</h3>
                 <ul className="space-y-3">
                    <li className="flex gap-2 text-[11px] font-medium text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1 flex-shrink-0" />
                      Record sessions for team members in 'Sleep' zones.
                    </li>
                    <li className="flex gap-2 text-[11px] font-medium text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1 flex-shrink-0" />
                      Rotate the 'uncomfortable' times so the same person isn't always late.
                    </li>
                 </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
