import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Clock, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, RefreshCw, Calculator, Info, Languages
} from "lucide-react";

function useMilitaryCalc() {
  const [standardTime, setStandardTime] = useState("01:30 PM");
  const [militaryTime, setMilitaryTime] = useState("1330");

  const results = useMemo(() => {
    // Standard to Military
    const convertToMilitary = (std: string) => {
      const match = std.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!match) return "Invalid";
      let [_, h, m, period] = match;
      let hours = parseInt(h);
      if (period.toUpperCase() === "PM" && hours < 12) hours += 12;
      if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, '0')}${m}`;
    };

    // Military to Standard
    const convertToStandard = (mil: string) => {
      const clean = mil.replace(/\D/g, '');
      if (clean.length !== 4) return "Invalid";
      let h = parseInt(clean.substring(0, 2));
      let m = clean.substring(2, 4);
      if (h >= 24) return "Invalid";
      let period = h >= 12 ? "PM" : "AM";
      let displayH = h % 12;
      if (displayH === 0) displayH = 12;
      return `${displayH}:${m} ${period}`;
    };

    return {
      toMil: convertToMilitary(standardTime),
      toStd: convertToStandard(militaryTime)
    };
  }, [standardTime, militaryTime]);

  return { standardTime, setStandardTime, militaryTime, setMilitaryTime, results };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-indigo-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-indigo-500">
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
  { title: "Time Converter", slug: "time-converter", icon: <RefreshCw className="w-5 h-5" />, color: 25, benefit: "Units conversion" },
  { title: "Unix Timestamp", slug: "unix-timestamp-converter", icon: <Calculator className="w-5 h-5" />, color: 140, benefit: "Epoch precision" },
  { title: "Time Tracking", slug: "time-tracking-calculator", icon: <Clock className="w-5 h-5" />, color: 210, benefit: "Task logging" },
];

export default function MilitaryTimeConverter() {
  const calc = useMilitaryCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Military Time Converter – 12-Hour to 24-Hour Clock"
        description="Convert standard AM/PM time to military (24-hour) format instantly. Free online tool for medical, aviation, and military time synchronization."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <span className="text-foreground">Military Time Converter</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-indigo-500/15 bg-gradient-to-br from-indigo-500/5 via-card to-blue-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Languages className="w-3.5 h-3.5" />
            Time Formats
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Military Time Converter
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Switch effortlessly between 12-hour and 24-hour clocks. Precision time conversion for professionals in global logistics, emergency services, and aviation.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> Precise
            </span>
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-full border border-indigo-500/20">
              <Zap className="w-3.5 h-3.5" /> Two-Way
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            {/* Tool Widget */}
            <section className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Standard to Military */}
                 <div className="rounded-2xl border border-indigo-500/20 shadow-xl bg-card overflow-hidden">
                    <div className="h-1.5 w-full bg-indigo-600" />
                    <div className="p-8 space-y-6 text-center">
                       <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">12-Hour → 24-Hour</p>
                       <div className="space-y-4">
                          <input 
                            type="text" 
                            className="tool-calc-input text-2xl font-black text-center w-full" 
                            placeholder="e.g. 02:30 PM"
                            value={calc.standardTime} 
                            onChange={e => calc.setStandardTime(e.target.value)} 
                          />
                          <div className="flex justify-center py-2">
                             <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                                <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0" />
                             </div>
                          </div>
                          <div className="p-4 rounded-xl bg-muted/50 border border-border">
                             <p className="text-3xl font-black text-indigo-600 tabular-nums">{calc.results.toMil}</p>
                             <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Hours</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Military to Standard */}
                 <div className="rounded-2xl border border-blue-500/20 shadow-xl bg-card overflow-hidden">
                    <div className="h-1.5 w-full bg-blue-600" />
                    <div className="p-8 space-y-6 text-center">
                       <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">24-Hour → 12-Hour</p>
                       <div className="space-y-4">
                          <input 
                            type="text" 
                            className="tool-calc-input text-2xl font-black text-center w-full" 
                            placeholder="e.g. 1430"
                            value={calc.militaryTime} 
                            onChange={e => calc.setMilitaryTime(e.target.value)} 
                          />
                          <div className="flex justify-center py-2">
                             <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                                <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0" />
                             </div>
                          </div>
                          <div className="p-4 rounded-xl bg-muted/50 border border-border">
                             <p className="text-3xl font-black text-blue-600 tabular-nums">{calc.results.toStd}</p>
                             <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Clock Time</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </section>

            {/* Content Section */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
               <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use 24-Hour Time?</h2>
               <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                 Military time eliminates the ambiguity of AM and PM. In critical sectors like medicine and aviation, a mistake between 7:00 AM and 7:00 PM can have serious consequences.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                     <h4 className="font-bold text-foreground flex items-center gap-2">
                        <Shield className="w-5 h-5 text-indigo-500" /> Professional Standards
                     </h4>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                        Military and emergency services use the 24-hour clock to ensure clear communication across time zones and during high-stress operations where clarity is paramount.
                     </p>
                  </div>
                  <div className="space-y-3">
                     <h4 className="font-bold text-foreground flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-blue-500" /> Global Computing
                     </h4>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                        Most computer systems and log files use 24-hour formats internally because they are numerically sequential and easier to parse for duration calculations.
                     </p>
                  </div>
               </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Time Formats FAQ</h2>
              <div className="space-y-3">
                <FaqItem
                  q="What is the difference between military and 24-hour time?"
                  a="They are nearly identical, but military time often omits the colon (e.g., 1430) and may use leading zeros (e.g., 0800), whereas standard 24-hour time usually includes the colon (14:30)."
                />
                <FaqItem
                  q="Is 12:00 AM 0000 or 2400?"
                  a="Technically, both can be used, but 0000 is the standard for the beginning of a day. 2400 is sometimes used to denote the exact end of a day."
                />
                <FaqItem
                  q="Do I need to include leading zeros?"
                  a="In formal military time, yes. 9:00 AM should be entered as 0900 to ensure the string is always 4 digits long for sorting and logging."
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
             <div className="sticky top-28 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-4">
                   <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-2">Sync Time</h3>
                   <button
                    onClick={copyLink}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-indigo-600/20"
                  >
                    {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                  </button>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5">
                   <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">More Tools</h3>
                   <div className="space-y-4">
                      {RELATED_TOOLS.map(t => (
                        <Link key={t.slug} href={`/time-date/${t.slug}`} className="flex items-center gap-3 group">
                           <div className="w-8 h-8 rounded bg-muted flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                              {t.icon}
                           </div>
                           <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">{t.title}</span>
                        </Link>
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
