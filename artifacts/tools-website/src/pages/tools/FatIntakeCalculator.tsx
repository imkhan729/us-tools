import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Activity, Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Info, Heart, Flame, Scale, Droplet, Droplets, Utensils
} from "lucide-react";

function useFatIntakeCalc() {
  const [totalCalories, setTotalCalories] = useState(2000);
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');

  const results = useMemo(() => {
     // Fat intake guidelines: 20-35% of total calories
     // 1g fat = 9 calories
     
     const percentages = {
        lose: { min: 0.20, max: 0.25, label: 'Weight Loss' },
        maintain: { min: 0.25, max: 0.30, label: 'Balanced Health' },
        gain: { min: 0.30, max: 0.35, label: 'Mass Gain / Muscle Support' }
     };

     const activeGoal = percentages[goal];
     const minGrams = Math.round((totalCalories * activeGoal.min) / 9);
     const maxGrams = Math.round((totalCalories * activeGoal.max) / 9);
     const avgGrams = Math.round((minGrams + maxGrams) / 2);

     return {
        minGrams,
        maxGrams,
        avgGrams,
        label: activeGoal.label,
        caloriesFromFat: Math.round(avgGrams * 9)
     };
  }, [totalCalories, goal]);

  return { totalCalories, setTotalCalories, goal, setGoal, results };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-white/5 hover:border-amber-500/40 transition-colors shadow-sm">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left bg-card">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-amber-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-muted/5 border-t border-border">
             <p className="p-5 text-muted-foreground leading-relaxed text-sm font-medium">{a}</p>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Calorie Tool", slug: "calorie-calculator", icon: <Flame className="w-5 h-5" />, color: 10, benefit: "Fuel tracking" },
  { title: "Protein Count", slug: "protein-intake-calculator", icon: <Activity className="w-5 h-5" />, color: 200, benefit: "Muscle building" },
  { title: "Keto Macro", slug: "keto-calculator", icon: <Droplets className="w-5 h-5" />, color: 40, benefit: "Ketosis planning" },
];

export default function FatIntakeCalculator() {
  const calc = useFatIntakeCalc();
  const [copied, setCopied] = useState(false);

  return (
    <Layout>
      <SEO
        title="Fat Intake Calculator – Calculate Daily Fat Needs in Grams"
        description="Determine your ideal daily fat intake based on your calorie goals and activity level. Free online tool for macro balancing and nutrition planning."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-black uppercase tracking-[0.2em] mb-10 text-muted-foreground">
          <Link href="/" className="hover:text-amber-500 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <Link href="/category/health" className="hover:text-amber-500 transition-colors">Health & Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <span className="text-foreground">Fat Intake Calculator</span>
        </nav>

        <section className="rounded-3xl overflow-hidden border-2 border-amber-500/10 bg-gradient-to-br from-amber-500/5 via-card to-orange-500/5 px-10 md:px-14 py-12 md:py-20 mb-12 shadow-2xl relative">
           <div className="absolute right-0 top-0 p-12 opacity-10 hidden lg:block">
              <Droplet className="w-48 h-48 text-amber-600" />
           </div>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black text-[10px] uppercase tracking-[0.3em] px-5 py-2 rounded-full mb-6 border border-amber-500/20">
            <Utensils className="w-4 h-4" />
            Nutritional Balance
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-[0.9] mb-6 max-w-2xl italic">
            Fat Intake Calculator
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-semibold leading-relaxed mb-8 max-w-xl">
             Calculate how many grams of fat you should consume daily to support your health and fitness objectives.
          </p>
          <div className="flex flex-wrap gap-3">
             <span className="px-4 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 font-black text-[10px] tracking-widest border border-emerald-500/20 uppercase">Macro-Friendly</span>
             <span className="px-4 py-2 rounded-2xl bg-amber-500/10 text-amber-600 font-black text-[10px] tracking-widest border border-amber-500/20 uppercase">Goal Oriented</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3 space-y-12">
            {/* Widget */}
            <div className="rounded-[2.5rem] border-4 border-border shadow-2xl bg-card overflow-hidden">
               <div className="h-2 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500" />
               <div className="p-10 md:p-14 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                     <div className="space-y-10">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.25em] flex justify-between items-center italic">
                              Daily Calories <span className="text-amber-500">{calc.totalCalories} kCal</span>
                           </label>
                           <input 
                              type="range" min="1000" max="5000" step="50" value={calc.totalCalories} 
                              onChange={e => calc.setTotalCalories(parseInt(e.target.value))}
                              className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer accent-amber-500"
                           />
                        </div>

                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.25em] italic">Current Goal</label>
                           <div className="flex flex-col gap-3">
                              {(['lose', 'maintain', 'gain'] as const).map(g => (
                                 <button
                                    key={g}
                                    onClick={() => calc.setGoal(g)}
                                    className={`py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all text-left flex items-center justify-between ${calc.goal === g ? 'bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-600/40' : 'bg-muted/30 border-border opacity-70 hover:opacity-100 hover:border-amber-500/40'}`}
                                 >
                                    <span className="italic">{g === 'lose' ? 'Aggressive Cut' : g === 'maintain' ? 'Healthy Balance' : 'Lean Bulk'}</span>
                                    {calc.goal === g && <BadgeCheck className="w-5 h-5" />}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="h-full flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                           <motion.div 
                              key={calc.results.avgGrams}
                              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                              className="rounded-[2rem] bg-amber-500/5 border-2 border-amber-500/20 p-10 text-center space-y-6 shadow-inner"
                           >
                              <div className="space-y-2">
                                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">Daily Target Range</p>
                                 <div className="text-6xl md:text-8xl font-black text-foreground tracking-tighter">
                                    {calc.results.minGrams}-{calc.results.maxGrams}
                                 </div>
                                 <p className="text-sm font-bold text-muted-foreground opacity-60">Grams of Fat</p>
                              </div>

                              <div className="py-6 border-y border-amber-500/10 flex justify-between items-center bg-card/50 rounded-2xl px-8">
                                 <div className="text-left">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Average Goal</p>
                                    <p className="text-2xl font-black text-foreground">{calc.results.avgGrams}g</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Energy Contribution</p>
                                    <p className="text-2xl font-black text-amber-600">{calc.results.caloriesFromFat} kCal</p>
                                 </div>
                              </div>
                              
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] italic text-muted-foreground">{calc.results.label}</p>
                           </motion.div>
                        </AnimatePresence>
                     </div>
                  </div>
               </div>
            </div>

            {/* Educational Content */}
            <section className="bg-card border-2 border-border rounded-[2.5rem] p-10 md:p-14 space-y-10 shadow-xl">
               <h2 className="text-3xl md:text-4xl font-black tracking-tight italic">Why Fat Matters</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <p className="text-sm text-foreground/80 leading-relaxed font-semibold">
                        Fats are essential for hormone production, brain function, and the absorption of fat-soluble vitamins (A, D, E, and K). Without adequate fat intake, your body cannot maintain optimal cognitive health or energy levels. 
                     </p>
                     <div className="p-5 bg-muted/40 rounded-2xl border border-border">
                        <h4 className="font-black text-xs uppercase mb-2 flex items-center gap-2 text-amber-600"><Droplets className="w-4 h-4" /> Healthy Sources</h4>
                        <p className="text-[11px] font-medium text-muted-foreground">Avocados, nuts, seeds, extra virgin olive oil, and fatty fish like salmon are superior choices for meeting your daily fat targets.</p>
                     </div>
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                       <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex-shrink-0 flex items-center justify-center font-black text-emerald-600">01</div>
                       <div>
                          <p className="text-xs font-black uppercase italic mb-1">Energy Storage</p>
                          <p className="text-[11px] text-muted-foreground font-semibold">Fat is the most calorie-dense macro, providing 9 calories per gram compared to 4 for protein/carbs.</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4">
                       <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex-shrink-0 flex items-center justify-center font-black text-amber-600">02</div>
                       <div>
                          <p className="text-xs font-black uppercase italic mb-1">Cell Protection</p>
                          <p className="text-[11px] text-muted-foreground font-semibold">Healthy fats help build the membranes that protect every single cell in your body.</p>
                       </div>
                    </div>
                  </div>
               </div>
            </section>

            {/* FAQ Area */}
            <section className="space-y-6 px-4 uppercase italic tracking-wider">
               <h2 className="text-3xl font-black text-foreground">Nutrient FAQ</h2>
               <div className="space-y-4">
                  <FaqItem 
                    q="Should I be afraid of high fat intake?"
                    a="Not necessarily. The quality of fat matters more than the quantity. Monounsaturated and polyunsaturated fats (like those found in plants and fish) are highly beneficial. Saturated fats should be consumed in moderation, while trans fats should be avoided entirely."
                  />
                  <FaqItem 
                    q="How does fat affect weight loss?"
                    a="Fat is highly satiating, meaning it helps you feel full for longer. Including a moderate amount of fat in your diet can prevent overeating, even though fat itself has more calories per gram than other nutrients."
                  />
                  <FaqItem 
                    q="What happens if fat intake is too low?"
                    a="Extremely low-fat diets can lead to hormonal imbalances, dry skin, mood swings, and nutrient deficiencies, as your body loses its ability to absorb vital vitamins."
                  />
               </div>
            </section>
          </div>

          <div className="space-y-8">
             <div className="sticky top-28 space-y-8">
                <div className="bg-gradient-to-br from-amber-600 to-orange-600 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                   <Droplets className="w-20 h-20 absolute -right-6 -bottom-6 opacity-20 group-hover:scale-125 transition-transform duration-1000" />
                   <h4 className="font-black italic text-lg uppercase mb-4 flex items-center gap-2">
                       Essential Fuel
                   </h4>
                   <p className="text-[11px] font-bold leading-relaxed opacity-80">
                      "Nutrition is a marathon, not a sprint. Balance your macros to ensure your body has everything it needs to perform at its peak."
                   </p>
                </div>

                <div className="bg-card border-2 border-border p-8 rounded-[2rem] shadow-xl">
                   <h3 className="text-[10px] font-black uppercase text-amber-500 tracking-[0.3em] mb-6 italic">Related Insights</h3>
                   <div className="space-y-6">
                      {RELATED_TOOLS.map(t => (
                        <Link key={t.slug} href={`/health/${t.slug}`} className="flex items-center gap-4 group">
                           <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-amber-600 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-amber-500/20">
                              <span className="group-hover:text-white group-hover:rotate-12 transition-transform">{t.icon}</span>
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase text-muted-foreground group-hover:text-foreground transition-colors">{t.title}</p>
                              <p className="text-[8px] font-black uppercase text-amber-600 opacity-60">{t.benefit}</p>
                           </div>
                        </Link>
                      ))}
                   </div>
                </div>

                <div className="p-8 rounded-[2rem] border-4 border-amber-500/20 bg-card text-center group">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 italic">Social Share</p>
                   <button className="w-full h-12 rounded-2xl bg-amber-600 text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-amber-600/30 italic">
                      Copy Link
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
