import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Clock, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Info, Sparkles, Moon, Sun, Star
} from "lucide-react";

const ZODIAC_SIGNS = [
  { name: "Aries", start: "03-21", end: "04-19", symbol: "♈", element: "Fire", personality: "Courageous, determined, confident, enthusiastic." },
  { name: "Taurus", start: "04-20", end: "05-20", symbol: "♉", element: "Earth", personality: "Reliable, patient, practical, devoted, stable." },
  { name: "Gemini", start: "05-21", end: "06-20", symbol: "♊", element: "Air", personality: "Affectionate, curious, adaptable, ability to learn quickly." },
  { name: "Cancer", start: "06-21", end: "07-22", symbol: "♋", element: "Water", personality: "Tenacious, highly imaginative, loyal, emotional, sympathetic." },
  { name: "Leo", start: "07-23", end: "08-22", symbol: "♌", element: "Fire", personality: "Creative, passionate, generous, warm-hearted, cheerful." },
  { name: "Virgo", start: "08-23", end: "09-22", symbol: "♍", element: "Earth", personality: "Loyal, analytical, kind, hardworking, practical." },
  { name: "Libra", start: "09-23", end: "10-22", symbol: "♎", element: "Air", personality: "Cooperative, diplomatic, gracious, fair-minded, social." },
  { name: "Scorpio", start: "10-23", end: "11-21", symbol: "♏", element: "Water", personality: "Resourceful, brave, passionate, stubborn, a true friend." },
  { name: "Sagittarius", start: "11-22", end: "12-21", symbol: "♐", element: "Fire", personality: "Generous, idealistic, great sense of humor." },
  { name: "Capricorn", start: "12-22", end: "01-19", symbol: "♑", element: "Earth", personality: "Responsible, disciplined, self-control, good managers." },
  { name: "Aquarius", start: "01-20", end: "02-18", symbol: "♒", element: "Air", personality: "Progressive, original, independent, humanitarian." },
  { name: "Pisces", start: "02-19", end: "03-20", symbol: "♓", element: "Water", personality: "Compassionate, artistic, intuitive, gentle, wise." }
];

function useZodiacCalc() {
  const [birthDate, setBirthDate] = useState("1995-05-15");

  const sign = useMemo(() => {
    if (!birthDate) return null;
    const date = new Date(birthDate);
    const m = date.getMonth() + 1;
    const d = date.getDate();
    
    return ZODIAC_SIGNS.find(s => {
      const [sm, sd] = s.start.split("-").map(Number);
      const [em, ed] = s.end.split("-").map(Number);
      
      if (sm === em) return m === sm && d >= sd && d <= ed;
      if (m === sm) return d >= sd;
      if (m === em) return d <= ed;
      return false;
    }) || ZODIAC_SIGNS[8]; // Fallback for Capricorn which spans across years
  }, [birthDate]);

  return { birthDate, setBirthDate, sign };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-purple-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-purple-500">
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
  { title: "Chinese Zodiac", slug: "chinese-zodiac-calculator", icon: <Sparkles className="w-5 h-5" />, color: 25, benefit: "Lunar animal signs" },
  { title: "Age Calculator", slug: "age-calculator", icon: <Clock className="w-5 h-5" />, color: 140, benefit: "Precise lifespan" },
  { title: "Half Birthday", slug: "half-birthday-calculator", icon: <Sun className="w-5 h-5" />, color: 210, benefit: "Solar milestones" },
];

export default function ZodiacSignCalculator() {
  const calc = useZodiacCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Zodiac Sign Calculator – Find Your Sun Sign"
        description="Discover your zodiac sign based on your birth date. Free online tool with personality traits, elements, and symbols for all 12 star signs."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-purple-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-purple-500" strokeWidth={3} />
          <span className="text-foreground">Zodiac Sign Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-purple-500/15 bg-gradient-to-br from-purple-500/5 via-card to-indigo-500/5 px-8 md:px-12 py-10 md:py-14 mb-10 text-center md:text-left relative">
           <div className="absolute top-0 right-0 p-10 opacity-10 hidden md:block">
              <Sparkles className="w-32 h-32 text-purple-600" />
           </div>
          <div className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Star className="w-3.5 h-3.5" />
            Astrological Mapping
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Zodiac Sign Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Your place in the cosmos revealed. Find your sun sign and explore the core elemental traits that define your astrological identity.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> Accurate
            </span>
            <span className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs px-3 py-1.5 rounded-full border border-purple-500/20">
              <Moon className="w-3.5 h-3.5" /> Astral Data
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            {/* Tool Widget */}
            <section className="space-y-6">
              <div className="rounded-2xl border border-purple-500/20 shadow-xl bg-card overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 to-indigo-600" />
                <div className="p-8 md:p-12">
                   <div className="max-w-md mx-auto space-y-8">
                      <div className="space-y-3 text-center">
                         <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Enter Birth Date</label>
                         <input 
                           type="date" 
                           className="tool-calc-input text-2xl font-black text-center w-full" 
                           value={calc.birthDate} 
                           onChange={e => calc.setBirthDate(e.target.value)} 
                         />
                      </div>

                      <AnimatePresence mode="wait">
                        {calc.sign && (
                          <motion.div 
                            key={calc.sign.name}
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="p-8 rounded-3xl bg-purple-500/5 border border-purple-500/20 text-center relative overflow-hidden"
                          >
                             <div className="absolute -top-4 -right-4 text-8xl opacity-10 rotate-12">{calc.sign.symbol}</div>
                             <p className="text-sm font-black text-purple-600 uppercase tracking-widest mb-2 italic">You are a</p>
                             <h2 className="text-5xl font-black text-foreground mb-4">{calc.sign.name}</h2>
                             <div className="flex justify-center gap-4 mb-6">
                                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 text-xs font-bold ring-1 ring-inset ring-indigo-500/20">{calc.sign.element} Element</span>
                                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-xs font-bold ring-1 ring-inset ring-purple-500/20">{calc.sign.symbol} Symbol</span>
                             </div>
                             <p className="text-muted-foreground leading-relaxed font-medium italic underline decoration-purple-500/30 underline-offset-4 px-4">
                               "{calc.sign.personality}"
                             </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                </div>
              </div>
            </section>

            {/* Content Section */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
               <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">The Four Elements of Astrology</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { name: 'Fire', traits: 'Passionate, energetic', signs: 'Aries, Leo, Sag', color: 'text-orange-500' },
                    { name: 'Earth', traits: 'Practical, grounded', signs: 'Taurus, Virgo, Cap', color: 'text-amber-700' },
                    { name: 'Air', traits: 'Intellectual, social', signs: 'Gemini, Libra, Aqua', color: 'text-blue-400' },
                    { name: 'Water', traits: 'Intuitive, emotional', signs: 'Cancer, Scorpio, Pisces', color: 'text-indigo-500' }
                  ].map(el => (
                    <div key={el.name} className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border group hover:bg-white dark:hover:bg-slate-900 transition-colors">
                       <h4 className={`font-black uppercase text-xs tracking-widest ${el.color}`}>{el.name}</h4>
                       <p className="text-xs font-bold text-foreground">{el.traits}</p>
                       <p className="text-[10px] text-muted-foreground italic">{el.signs}</p>
                    </div>
                  ))}
               </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Astrology FAQ</h2>
              <div className="space-y-3">
                <FaqItem
                  q="What is a 'cusp'?"
                  a="Being born on a cusp means your birthday falls near the date where one sign ends and another begins. Many astrologers believe cusp-born individuals blend traits of both signs."
                />
                <FaqItem
                  q="Does the year affect my zodiac sign?"
                  a="In Western astrology, your 'Sun Sign' is determined solely by the day and month. However, your 'Rising Sign' and 'Moon Sign' depend on the exact time and location of birth."
                />
                <FaqItem
                  q="Is this the same as Chinese Zodiac?"
                  a="No. Western astrology follows the path of the sun through constellations over a year. Chinese astrology is based on a 12-year lunar cycle where each year is represented by an animal."
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
             <div className="sticky top-28 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-4">
                   <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-2 italic">Share Your Sign</h3>
                   <button
                    onClick={copyLink}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-600 text-white text-xs font-black uppercase rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-purple-600/20"
                  >
                    {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-purple-900 text-white shadow-xl relative overflow-hidden group">
                   <Star className="w-16 h-16 absolute -right-4 -top-4 opacity-20 group-hover:rotate-45 transition-transform duration-700" />
                   <h4 className="font-black text-sm mb-2 flex items-center gap-2">
                      <Moon className="w-4 h-4" /> Astral Insight
                   </h4>
                   <p className="text-[11px] leading-relaxed opacity-80 font-medium italic">
                     "Astrology is a map of potential, not a locked cage. Understanding your sign helps you navigate your natural resonance with the elements."
                   </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5">
                   <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">More Tools</h3>
                   <div className="space-y-4">
                      {RELATED_TOOLS.map(t => (
                        <Link key={t.slug} href={`/time-date/${t.slug}`} className="flex items-center gap-3 group">
                           <div className="w-8 h-8 rounded bg-muted flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
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
