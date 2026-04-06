import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Clock, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Info, Sparkles, Moon, Sun, Star, Globe
} from "lucide-react";

const CHINESE_ZODIAC = [
  { name: "Monkey", icon: "🐒", year: 0, personality: "Witty, intelligent, mischievous, inquisitive." },
  { name: "Rooster", icon: "🐓", year: 1, personality: "Observant, hardworking, courageous, talented." },
  { name: "Dog", icon: "🐕", year: 2, personality: "Loyal, honest, amiable, kind, cautious." },
  { name: "Pig", icon: "🐖", year: 3, personality: "Diligent, compassionate, generous, calm." },
  { name: "Rat", icon: "🐀", year: 4, personality: "Quick-witted, resourceful, versatile, kind." },
  { name: "Ox", icon: "🐂", year: 5, personality: "Diligent, dependable, strong, determined." },
  { name: "Tiger", icon: "🐅", year: 6, personality: "Brave, confident, competitive, charming." },
  { name: "Rabbit", icon: "🐇", year: 7, personality: "Quiet, elegant, kind, responsible." },
  { name: "Dragon", icon: "🐉", year: 8, personality: "Confident, intelligent, enthusiastic, ambitious." },
  { name: "Snake", icon: "🐍", year: 9, personality: "Enigmatic, intelligent, wise, analytical." },
  { name: "Horse", icon: "🐎", year: 10, personality: "Animated, active, energetic, optimistic." },
  { name: "Goat", icon: "🐐", year: 11, personality: "Gentle, shy, stable, sympathetic, kind." }
];

function useChineseZodiacCalc() {
  const [birthYear, setBirthYear] = useState(new Date().getFullYear());

  const animal = useMemo(() => {
    if (!birthYear) return null;
    const index = birthYear % 12;
    return CHINESE_ZODIAC[index];
  }, [birthYear]);

  return { birthYear, setBirthYear, animal };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-red-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-red-500">
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
  { title: "Western Zodiac", slug: "zodiac-sign-calculator", icon: <Star className="w-5 h-5" />, color: 25, benefit: "Solar star signs" },
  { title: "Era Calculator", slug: "era-calculator", icon: <Globe className="w-5 h-5" />, color: 140, benefit: "Global calendars" },
  { title: "Age Calculator", slug: "age-calculator", icon: <Clock className="w-5 h-5" />, color: 210, benefit: "Precise lifespan" },
];

export default function ChineseZodiacCalculator() {
  const calc = useChineseZodiacCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Chinese Zodiac Calculator – Find Your Lunar Year Animal"
        description="Discover your Chinese zodiac animal and elemental traits. Free online tool based on the 12-year lunar cycle and ancient eastern wisdom."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-red-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-red-500" strokeWidth={3} />
          <span className="text-foreground">Chinese Zodiac Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-red-500/15 bg-gradient-to-br from-red-500/5 via-card to-orange-500/5 px-8 md:px-12 py-10 md:py-14 mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Moon className="w-3.5 h-3.5" />
            Lunar Cycles
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Chinese Zodiac Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            The 12-year cycle of the moon carries deep animal wisdom. Find your animal sign and discover the enduring traits tied to your birth year.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> Traditional
            </span>
            <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs px-3 py-1.5 rounded-full border border-red-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Ancient Wisdom
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            {/* Tool Widget */}
            <section className="space-y-6">
              <div className="rounded-2xl border border-red-500/20 shadow-xl bg-card overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-red-600 to-orange-600" />
                <div className="p-8 md:p-12">
                   <div className="max-w-md mx-auto space-y-8 text-center">
                      <div className="space-y-3">
                         <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Enter Birth Year</label>
                         <input 
                           type="number" 
                           className="tool-calc-input text-4xl font-black text-center w-full" 
                           value={calc.birthYear} 
                           onChange={e => calc.setBirthYear(parseInt(e.target.value) || 0)} 
                         />
                      </div>

                      <AnimatePresence mode="wait">
                        {calc.animal && (
                          <motion.div 
                            key={calc.animal.name}
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -20 }}
                            className="p-10 rounded-3xl bg-red-500/5 border border-red-500/20 relative"
                          >
                             <div className="text-8xl mb-6">{calc.animal.icon}</div>
                             <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-1 italic">Year of the</p>
                             <h2 className="text-5xl font-black text-foreground mb-4 tracking-tight">{calc.animal.name}</h2>
                             <p className="text-muted-foreground leading-relaxed font-medium italic underline decoration-red-500/20 underline-offset-4">
                               "{calc.animal.personality}"
                             </p>
                             <div className="mt-8 pt-8 border-t border-red-500/10 text-xs font-bold text-muted-foreground">
                                Next {calc.animal.name} Year: {calc.birthYear + (12 - (calc.birthYear % 12)) + calc.animal.year}
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                </div>
              </div>
            </section>

            {/* Content Section */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
               <h2 className="text-2xl font-black text-foreground tracking-tight mb-6 flex items-center gap-2">
                 <Globe className="w-6 h-6 text-red-500" /> Eastern vs Western Timing
               </h2>
               <p className="text-muted-foreground leading-relaxed mb-6 font-medium">
                 The Chinese Zodiac is based on the lunar calendar, which begins typically in late January or early February. While this tool uses the standard Gregorian year for simplicity, most animals remain the same for those born later in the year.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">The 12 Animals</h4>
                     <p className="text-xs text-muted-foreground leading-relaxed">
                        Legend says the Jade Emperor held a race to determine the order of the zodiac. The Rat won by riding on the Ox's back, explaining their positions in the cycle.
                     </p>
                  </div>
                  <div className="space-y-3">
                     <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Cycle of Elements</h4>
                     <p className="text-xs text-muted-foreground leading-relaxed">
                        Beyond the animals, each year is also associated with one of five elements: Wood, Fire, Earth, Metal, and Water, creating a larger 60-year energetic cycle.
                     </p>
                  </div>
               </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight italic">Zodiac Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="Does my animal change every year?"
                  a="No. Your Chinese zodiac animal is fixed based on your birth year. It only 'repeats' every 12 years (e.g., Year of the Tiger occurs in 1998, 2010, 2022)."
                />
                <FaqItem
                  q="What if I was born in January?"
                  a="Since the Lunar New Year falls between Jan 21 and Feb 20, individuals born in early January usually belong to the animal of the previous calendar year."
                />
                <FaqItem
                  q="Is one animal 'luckier' than others?"
                  a="In Chinese culture, every animal has its own strengths. Dragons are often seen as symbols of power, while Pigs are linked to wealth and prosperity."
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
             <div className="sticky top-28 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-4">
                   <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-2">Share Animal</h3>
                   <button
                    onClick={copyLink}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white text-xs font-black uppercase rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-red-600/20"
                  >
                    {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl relative overflow-hidden ring-1 ring-white/10">
                   <Moon className="w-16 h-16 absolute -right-4 -bottom-4 opacity-10" />
                   <h4 className="font-black text-xs uppercase text-red-500 mb-2">Lunar Wisdom</h4>
                   <p className="text-[11px] leading-relaxed opacity-80 italic font-medium">
                     "The Chinese zodiac is not just about personality; it's about the timing of your life within the great celestial rotation."
                   </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5">
                   <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">More Tools</h3>
                   <div className="space-y-4">
                      {RELATED_TOOLS.map(t => (
                        <Link key={t.slug} href={`/time-date/${t.slug}`} className="flex items-center gap-3 group">
                           <div className="w-8 h-8 rounded bg-muted flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
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
