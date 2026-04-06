import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Clock, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Info, Target, Calendar, User, TrendingUp
} from "lucide-react";

function useRetirementAgeCalc() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);

  const results = useMemo(() => {
    const yearsLeft = retirementAge - currentAge;
    const monthsLeft = yearsLeft * 12;
    const weeksLeft = yearsLeft * 52;
    const targetYear = new Date().getFullYear() + yearsLeft;

    return {
      yearsLeft: Math.max(0, yearsLeft),
      monthsLeft: Math.max(0, monthsLeft),
      weeksLeft: Math.max(0, weeksLeft),
      targetYear: yearsLeft >= 0 ? targetYear : "Already retired!"
    };
  }, [currentAge, retirementAge]);

  return { currentAge, setCurrentAge, retirementAge, setRetirementAge, results };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-white dark:bg-slate-900 hover:border-emerald-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-sm font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-emerald-500">
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
             <p className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Age Calculator", slug: "age-calculator", icon: <User className="w-5 h-5" />, color: 25, benefit: "Current age precision" },
  { title: "Deadline Tracker", slug: "deadline-calculator", icon: <Calendar className="w-5 h-5" />, color: 140, benefit: "Goal planning" },
  { title: "Working Days", slug: "working-days-calculator", icon: <Clock className="w-5 h-5" />, color: 210, benefit: "Effort mapping" },
];

export default function RetirementAgeCalculator() {
  const calc = useRetirementAgeCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Retirement Age Calculator – Plan Your Future"
        description="Calculate how many years, months, and weeks until your retirement. Free online tool for future planning and goal setting."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <span className="text-foreground">Retirement Age Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 via-card to-teal-500/5 px-8 md:px-12 py-10 md:py-14 mb-10 relative">
          <div className="absolute top-0 right-0 p-10 opacity-5 hidden lg:block">
             <TrendingUp className="w-48 h-48 text-emerald-600" />
          </div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5 transition-transform hover:scale-105">
            <Target className="w-3.5 h-3.5" />
            Future Roadmap
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Retirement Age Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Visualize the finish line. Calculate exactly how many years remain until your target retirement and start planning your next chapter today.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> Precise
            </span>
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-full border border-indigo-500/20">
              <Calendar className="w-3.5 h-3.5" /> Clear Projection
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            {/* Tool Widget */}
            <section className="space-y-6">
              <div className="rounded-2xl border border-emerald-500/20 shadow-xl bg-card overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 to-teal-600" />
                <div className="p-8 md:p-12">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                      <div className="space-y-8">
                         <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-muted-foreground">
                               <span>Current Age</span>
                               <span className="text-emerald-600">{calc.currentAge}</span>
                            </div>
                            <input 
                              type="range" 
                              min="1" 
                              max="100" 
                              value={calc.currentAge}
                              onChange={e => calc.setCurrentAge(parseInt(e.target.value))}
                              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                         </div>
                         <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-muted-foreground">
                               <span>Retirement Target</span>
                               <span className="text-emerald-600">{calc.retirementAge}</span>
                            </div>
                            <input 
                              type="range" 
                              min="1" 
                              max="120" 
                              value={calc.retirementAge}
                              onChange={e => calc.setRetirementAge(parseInt(e.target.value))}
                              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                         </div>
                      </div>

                      <div className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 text-center space-y-4">
                         <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Countdown to freedom</p>
                         <h2 className="text-6xl font-black text-foreground tabular-nums">{calc.results.yearsLeft}</h2>
                         <p className="text-lg font-bold text-emerald-600 -mt-2 uppercase tracking-tighter">Years Remaining</p>
                         <div className="pt-4 grid grid-cols-2 gap-4 border-t border-emerald-500/15 mt-4">
                            <div>
                               <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Target Year</p>
                               <p className="text-lg font-black text-foreground">{calc.results.targetYear}</p>
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Total Months</p>
                               <p className="text-lg font-black text-foreground">{calc.results.monthsLeft}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </section>

            {/* Content Section */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
               <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Defining Your Age Threshold Matters</h2>
               <p className="text-muted-foreground leading-relaxed mb-6 text-lg font-medium italic underline decoration-emerald-500/20 underline-offset-8">
                 Retirement isn't just a number—it's a psychological and temporal boundary that defines the structure of your professional life.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <h3 className="font-black text-foreground text-sm uppercase flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-emerald-500" /> Digital Planning
                     </h3>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                        In an era of career pivots, knowing your time horizon helps you decide whether to invest in new certifications or focus on wealth preservation.
                     </p>
                  </div>
                  <div className="space-y-4">
                     <h3 className="font-black text-foreground text-sm uppercase flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-500" /> Financial Defense
                     </h3>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                        Compounding interest is the "eighth wonder of the world," but its impact depend heavily on the *duration* of your contributions. 
                     </p>
                  </div>
               </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Strategy FAQ</h2>
              <div className="space-y-3">
                <FaqItem
                  q="What is the standard retirement age?"
                  a="In most developed nations, the statutory retirement age ranges between 65 and 68. However, many individuals aim for 'FIRE' (Financial Independence, Retire Early) at much younger ages."
                />
                <FaqItem
                  q="How does this tool help with savings?"
                  a="By seeing the years in a hard number, you can divide your total savings goal by that number to find your required annual contribution."
                />
                <FaqItem
                  q="Does life expectancy affect the number?"
                  a="This tool calculates the time *to* retirement. It is equally important to plan for the *duration* of retirement, which often lasts 20-30 years."
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
             <div className="sticky top-28 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                   <h3 className="text-[10px] font-black text-foreground tracking-tight uppercase mb-2">Track Plan</h3>
                   <button
                    onClick={copyLink}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white text-xs font-black uppercase rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-emerald-600/20"
                  >
                    {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                  </button>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                   <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">More Tools</h3>
                   <div className="space-y-4">
                      {RELATED_TOOLS.map(t => (
                        <Link key={t.slug} href={`/time-date/${t.slug}`} className="flex items-center gap-3 group">
                           <div className="w-8 h-8 rounded bg-muted flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
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
