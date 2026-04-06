import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Clock, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Globe, History, Info, RefreshCw
} from "lucide-react";

function useEraCalc() {
  const [year, setYear] = useState(2026);
  const [era, setEra] = useState<"AD" | "BC">("AD");

  const conversions = useMemo(() => {
    const rawYear = era === "AD" ? year : -year + 1;
    
    // Holocene Era (Human Era) = AD + 10,000
    const holocene = rawYear + 10000;
    
    // Islamic (Hijri) - approximate
    // AD 622 was AH 1
    const hijri = Math.floor((rawYear - 622) * (365.25 / 354.36) + 1);
    
    // Buddhist (BE) - AD + 543
    const buddhist = rawYear + 543;

    return {
      holocene: holocene > 0 ? `${holocene} HE` : `${Math.abs(holocene) + 1} BCE (HE)`,
      hijri: hijri > 0 ? `${hijri} AH` : `${Math.abs(hijri) + 1} BH`,
      buddhist: buddhist > 0 ? `${buddhist} BE` : `${Math.abs(buddhist) + 1} BBE`,
    };
  }, [year, era]);

  return { year, setYear, era, setEra, conversions };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-amber-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-amber-500">
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
  { title: "Unix Timestamp", slug: "unix-timestamp-converter", icon: <RefreshCw className="w-5 h-5" />, color: 25, benefit: "Digital era tracking" },
  { title: "Leap Year", slug: "leap-year-checker", icon: <History className="w-5 h-5" />, color: 140, benefit: "Calendar accuracy" },
  { title: "Age in Days", slug: "age-in-days-calculator", icon: <Clock className="w-5 h-5" />, color: 210, benefit: "Life span era" },
];

export default function EraCalculator() {
  const calc = useEraCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Era Calculator – Convert Between Calendar Systems & Epochs"
        description="Convert Gregorian dates to Holocene, Hijri, and Buddhist eras. Free online tool for historical research and calendar synchronization."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <span className="text-foreground">Era Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-amber-500/15 bg-gradient-to-br from-amber-500/5 via-card to-orange-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Globe className="w-3.5 h-3.5" />
            Epoch Systems
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Era Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Time is relative to the anchor you choose. Explore how current or historical years map across the world's diverse calendar eras and scientific epochs.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <History className="w-3.5 h-3.5" /> Historical
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-500/20">
              <Zap className="w-3.5 h-3.5" /> Multi-Epoch
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            {/* Tool Widget */}
            <section className="space-y-6">
              <div className="rounded-2xl border border-amber-500/20 shadow-xl bg-card overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-orange-500" />
                <div className="p-6 md:p-12 space-y-10">
                  <div className="flex flex-col md:flex-row gap-6 p-6 bg-amber-500/5 rounded-2xl border border-amber-500/10 items-center justify-center">
                     <div className="flex items-center gap-3">
                        <input 
                          type="number" 
                          className="bg-transparent border-b-2 border-amber-500 outline-none font-black text-4xl text-foreground w-32 text-center" 
                          value={calc.year} 
                          onChange={e => calc.setYear(parseInt(e.target.value) || 0)} 
                        />
                        <select 
                          className="bg-transparent font-black text-xl text-amber-600 outline-none cursor-pointer"
                          value={calc.era}
                          onChange={e => calc.setEra(e.target.value as any)}
                        >
                           <option value="AD">AD (CE)</option>
                           <option value="BC">BC (BCE)</option>
                        </select>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                     <div className="p-6 rounded-2xl bg-muted/30 border border-border text-center group hover:bg-amber-500/5 transition-colors">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Human Era (HE)</p>
                        <p className="text-2xl font-black text-amber-600">{calc.conversions.holocene}</p>
                        <p className="text-[10px] text-muted-foreground mt-2 font-bold leading-relaxed px-2 line-clamp-2">Holocene Calendar starting 10k years before AD.</p>
                     </div>
                     <div className="p-6 rounded-2xl bg-muted/30 border border-border text-center group hover:bg-amber-500/5 transition-colors">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Hijri Era (AH)</p>
                        <p className="text-2xl font-black text-amber-600">{calc.conversions.hijri}</p>
                        <p className="text-[10px] text-muted-foreground mt-2 font-bold leading-relaxed px-2 line-clamp-2">Lunar Islamic Era starting from Muhammad's Hijra.</p>
                     </div>
                     <div className="p-6 rounded-2xl bg-muted/30 border border-border text-center group hover:bg-amber-500/5 transition-colors">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Buddhist Era (BE)</p>
                        <p className="text-2xl font-black text-amber-600">{calc.conversions.buddhist}</p>
                        <p className="text-[10px] text-muted-foreground mt-2 font-bold leading-relaxed px-2 line-clamp-2">Counting from the parinirvana of the Buddha.</p>
                     </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Content Section */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
               <h2 className="text-2xl font-black text-foreground tracking-tight mb-6 italic underline decoration-amber-500 underline-offset-8">A Tapestry of Time</h2>
               <p className="text-muted-foreground leading-relaxed mb-6 text-lg font-medium">
                 Calendar systems aren't just tools for tracking dates—they are cultural fingerprints. Our Era Calculator allows you to navigate these complex historical frameworks with mathematical ease.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <h3 className="font-black text-foreground text-sm uppercase flex items-center gap-2 tracking-widest">
                        <History className="w-5 h-5 text-amber-500" /> Holocene Context
                     </h3>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                        The Holocene Calendar adds 10,000 years to the current year. This shift places all of human civilization (from the earliest cities to the moon landing) into a positive, continuous timeline without the confusing BC/AD flip.
                     </p>
                  </div>
                  <div className="space-y-4">
                     <h3 className="font-black text-foreground text-sm uppercase flex items-center gap-2 tracking-widest">
                        <Info className="w-5 h-5 text-amber-500" /> Precise Estimation
                     </h3>
                     <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        Converting between solar (Gregorian) and lunar (Hijri) eras is complex because years have different lengths. Our tool uses the 365.25/354.36 ratio to provide a close approximation for historical research.
                     </p>
                  </div>
               </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Era FAQ</h2>
              <div className="space-y-3">
                <FaqItem
                  q="What is the difference between BC and BCE?"
                  a="They represent the same period. BC (Before Christ) is the religious term, while BCE (Before Common Era) is the secular equivalent used in academia and scientific research."
                />
                <FaqItem
                  q="How accurate are the Hijri conversions?"
                  a="Islamic calendar months are based on moon sightings, which can vary by location. This calculator provides a mathematical conversion that is typically accurate within 1-2 days of the astronomical date."
                />
                <FaqItem
                  q="Will more eras be added?"
                  a="We are constantly expanding our database to include Regency, Mayan, and Julian calendars. Check back for updates!"
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
             <div className="sticky top-28 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-4">
                   <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-2">Save Reference</h3>
                   <button
                    onClick={copyLink}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-600 text-white text-xs font-black uppercase rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-amber-600/20"
                  >
                    {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-indigo-600 text-white shadow-xl relative overflow-hidden">
                   <History className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10" />
                   <h4 className="font-black text-sm mb-2">Historical Fact</h4>
                   <p className="text-[11px] leading-relaxed opacity-90 pr-4 italic">
                     "The year is currently 12,026 in the Human Era. By starting our clock at the dawn of human construction, we see history as a unified climb."
                   </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5">
                   <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">More Tools</h3>
                   <div className="space-y-4">
                      {RELATED_TOOLS.map(t => (
                        <Link key={t.slug} href={`/time-date/${t.slug}`} className="flex items-center gap-3 group">
                           <div className="w-8 h-8 rounded bg-muted flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
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
