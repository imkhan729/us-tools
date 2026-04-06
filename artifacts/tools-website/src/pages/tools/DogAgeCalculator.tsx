import { useState, useMemo } from "react";
import { Layout } from "../../components/Layout";
import { SEO } from "../../components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, Smartphone, Shield, Heart,
  BadgeCheck, Lock, Copy, Check, Lightbulb, Star,
} from "lucide-react";

// ── Types ──
type DogSize = "small" | "medium" | "large" | "giant";

interface SizeConfig {
  label: string;
  range: string;
  base: number;
  multiplier: number;
  lifespan: string;
  lifespanYears: number;
}

const SIZE_CONFIG: Record<DogSize, SizeConfig> = {
  small:  { label: "Small",  range: "< 10 kg / < 22 lbs",   base: 24, multiplier: 4, lifespan: "12–16 years", lifespanYears: 14 },
  medium: { label: "Medium", range: "10–25 kg / 22–55 lbs",  base: 24, multiplier: 5, lifespan: "10–14 years", lifespanYears: 12 },
  large:  { label: "Large",  range: "25–45 kg / 55–100 lbs", base: 24, multiplier: 6, lifespan: "8–12 years",  lifespanYears: 10 },
  giant:  { label: "Giant",  range: "> 45 kg / > 100 lbs",   base: 24, multiplier: 7, lifespan: "6–10 years",  lifespanYears: 8  },
};

// ── Conversion logic ──
function dogToHuman(dogAge: number, size: DogSize): number {
  if (dogAge <= 0) return 0;
  if (dogAge <= 1) return dogAge * 15;
  if (dogAge <= 2) return 15 + (dogAge - 1) * 9;
  const cfg = SIZE_CONFIG[size];
  return cfg.base + (dogAge - 2) * cfg.multiplier;
}

function getLifeStage(dogAge: number, size: DogSize): { stage: string; color: string; description: string } {
  const ly = SIZE_CONFIG[size].lifespanYears;
  if (dogAge < 1) return { stage: "Puppy",    color: "emerald", description: "Rapid growth, learning, and socialization phase." };
  if (dogAge < (size === "large" || size === "giant" ? 2 : 3))
    return { stage: "Junior",   color: "green",   description: "Adolescent stage — energetic, still maturing physically." };
  if (dogAge < ly * 0.5) return { stage: "Adult",    color: "blue",    description: "Prime of life — healthy, active, and fully mature." };
  if (dogAge < ly * 0.7) return { stage: "Mature",   color: "amber",   description: "Middle age — energy may start to decrease slightly." };
  if (dogAge < ly * 0.9) return { stage: "Senior",   color: "orange",  description: "Senior years — regular vet checkups become important." };
  return { stage: "Geriatric", color: "red",     description: "Very senior dog — needs extra care and monitoring." };
}

// ── Comparison table ──
const COMPARISON_TABLE = Array.from({ length: 15 }, (_, i) => {
  const age = i + 1;
  return {
    dogAge: age,
    small:  Math.round(dogToHuman(age, "small")),
    medium: Math.round(dogToHuman(age, "medium")),
    large:  Math.round(dogToHuman(age, "large")),
    giant:  Math.round(dogToHuman(age, "giant")),
  };
});

const STAGE_COLORS: Record<string, string> = {
  emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  green:   "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20",
  blue:    "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  amber:   "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  orange:  "text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20",
  red:     "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
};

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-amber-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-amber-500">
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
  { title: "BMI Calculator",             slug: "bmi-calculator",             icon: <Heart className="w-5 h-5" />, color: 340, benefit: "Check healthy weight ranges" },
  { title: "Age Calculator",             slug: "age-calculator",             icon: <Star className="w-5 h-5" />,  color: 217, benefit: "Calculate exact age in days" },
  { title: "Calorie Deficit Calculator", slug: "calorie-deficit-calculator", icon: <Zap className="w-5 h-5" />,   color: 152, benefit: "Plan weight management goals" },
  { title: "Ideal Weight Calculator",    slug: "ideal-weight-calculator",    icon: <Shield className="w-5 h-5" />, color: 45,  benefit: "Find your healthy weight range" },
  { title: "Water Intake Calculator",    slug: "water-intake-calculator",    icon: <Smartphone className="w-5 h-5" />, color: 200, benefit: "Daily hydration recommendations" },
];

export default function DogAgeCalculator() {
  const [dogAge, setDogAge] = useState("");
  const [size, setSize] = useState<DogSize>("medium");
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const result = useMemo(() => {
    const age = parseFloat(dogAge);
    if (isNaN(age) || age < 0) return null;
    return {
      humanAge: dogToHuman(age, size),
      lifeStage: getLifeStage(age, size),
      cfg: SIZE_CONFIG[size],
      dogAge: age,
    };
  }, [dogAge, size]);

  const sizeKeys: DogSize[] = ["small", "medium", "large", "giant"];

  return (
    <Layout>
      <SEO
        title="Dog Age Calculator – Convert Dog Years to Human Years | US Online Tools"
        description="Free dog age calculator. Convert your dog's age to human years based on size (small, medium, large, giant). Instant results with life stage, expected lifespan, and a full comparison table."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health &amp; Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <span className="text-foreground">Dog Age Calculator</span>
        </nav>

        {/* ── HERO SECTION ── */}
        <section className="rounded-2xl overflow-hidden border border-amber-500/15 bg-gradient-to-br from-amber-500/5 via-card to-yellow-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Heart className="w-3.5 h-3.5" />
            Health &amp; Fitness
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Dog Age Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Find out how old your dog is in human years. Enter their age and size for an accurate conversion based on veterinary research — plus life stage, expected lifespan, and a full age comparison table.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Results
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Health &amp; Fitness &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-amber-500/20 shadow-lg shadow-amber-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-yellow-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Dog Age Converter</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 38 } as React.CSSProperties}>
                    {/* Size selector */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-foreground mb-3">
                        <span className="tool-calc-number inline-flex mr-2">1</span>
                        Select Dog Size
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {sizeKeys.map((s) => (
                          <button
                            key={s}
                            onClick={() => setSize(s)}
                            className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border text-xs font-bold transition-all ${
                              size === s
                                ? "bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300"
                                : "border-border text-muted-foreground hover:border-amber-500/40 hover:text-foreground"
                            }`}
                          >
                            <span className="text-lg">{s === "small" ? "🐩" : s === "medium" ? "🐕" : s === "large" ? "🦮" : "🐕"}</span>
                            <span>{SIZE_CONFIG[s].label}</span>
                            <span className="font-normal text-[10px] text-muted-foreground leading-tight text-center">{SIZE_CONFIG[s].range}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Age input */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-foreground mb-2">
                        <span className="tool-calc-number inline-flex mr-2">2</span>
                        Dog&apos;s Age
                        <span className="font-normal text-muted-foreground ml-1">(years — decimals OK, e.g. 0.5 for 6 months)</span>
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 3"
                        min="0"
                        step="0.1"
                        className="tool-calc-input w-48"
                        value={dogAge}
                        onChange={e => setDogAge(e.target.value)}
                      />
                    </div>

                    {/* Results */}
                    <AnimatePresence>
                      {result !== null && (
                        <motion.div
                          key="result"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
                              <p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-1">Human Age Equivalent</p>
                              <div className="tool-calc-result text-amber-600 dark:text-amber-400">
                                {Math.round(result.humanAge * 10) / 10} years
                              </div>
                            </div>
                            <div className="flex-1 p-4 rounded-xl bg-muted/50 border border-border">
                              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Expected Lifespan</p>
                              <div className="text-xl font-black text-foreground">{result.cfg.lifespan}</div>
                            </div>
                          </div>

                          <div className={`inline-flex flex-wrap items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold ${STAGE_COLORS[result.lifeStage.color]}`}>
                            <span>Life Stage:</span>
                            <span className="font-black">{result.lifeStage.stage}</span>
                            <span className="font-normal opacity-80">— {result.lifeStage.description}</span>
                          </div>

                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20"
                          >
                            <div className="flex gap-2 items-start">
                              <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-foreground/80 leading-relaxed">
                                Your <strong>{SIZE_CONFIG[size].label.toLowerCase()} dog</strong> is {result.dogAge} year{result.dogAge !== 1 ? "s" : ""} old, which is roughly equivalent to a <strong>{Math.round(result.humanAge)}-year-old human</strong>. {SIZE_CONFIG[size].label} dogs typically live {result.cfg.lifespan}, so your dog is in the <strong>{result.lifeStage.stage.toLowerCase()}</strong> stage of life.
                              </p>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {result === null && dogAge !== "" && (
                      <p className="text-sm text-muted-foreground mt-2">Please enter a valid age (0 or above).</p>
                    )}
                  </div>

                  {/* Comparison Table */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="tool-calc-number">3</div>
                      <h3 className="text-lg font-bold text-foreground">Dog Age Comparison Table (Ages 1–15)</h3>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/60">
                            <th className="text-left px-4 py-3 font-bold text-foreground">Dog Age</th>
                            <th className="text-left px-4 py-3 font-bold text-amber-600 dark:text-amber-400">Small</th>
                            <th className="text-left px-4 py-3 font-bold text-yellow-600 dark:text-yellow-400">Medium</th>
                            <th className="text-left px-4 py-3 font-bold text-orange-600 dark:text-orange-400">Large</th>
                            <th className="text-left px-4 py-3 font-bold text-red-600 dark:text-red-400">Giant</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {COMPARISON_TABLE.map((row) => (
                            <tr key={row.dogAge} className="hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-2.5 font-bold text-foreground">{row.dogAge} yr{row.dogAge !== 1 ? "s" : ""}</td>
                              <td className="px-4 py-2.5 text-muted-foreground">{row.small}</td>
                              <td className="px-4 py-2.5 text-muted-foreground">{row.medium}</td>
                              <td className="px-4 py-2.5 text-muted-foreground">{row.large}</td>
                              <td className="px-4 py-2.5 text-muted-foreground">{row.giant}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">All values shown in equivalent human years. Based on Pedigree/AKC research data.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How is dog age converted to human years?"
                  a="The conversion is not a simple multiplication — it depends on the dog's size and age. During the first year, all dogs age rapidly regardless of size (roughly 15 human years). By year two, that reaches about 24 human years. After that, smaller dogs age more slowly (about 4 human years per dog year) while giant breeds age faster (up to 7 human years per dog year). This is because large dogs have faster metabolisms and tend to develop age-related conditions earlier in life."
                />
                <FaqItem
                  q="Do small dogs live longer than large dogs?"
                  a="Yes — smaller dog breeds consistently outlive larger breeds. Small dogs (under 10 kg) typically live 12–16 years, medium dogs 10–14 years, large dogs 8–12 years, and giant breeds often only 6–10 years. The exact reason is not fully understood, but researchers believe it relates to the accelerated growth rates of large breeds, which may increase cellular damage over time. Individual genetics, diet, exercise, and veterinary care all play significant roles too."
                />
                <FaqItem
                  q="What age is a dog considered a senior?"
                  a="It depends on size. Small and medium dogs are generally considered senior around 10–11 years old. Large dogs enter their senior years earlier, around 8–9 years, and giant breeds may be considered senior as early as 6–7 years. In human age equivalents, senior dogs roughly correspond to humans in their 60s. Once your dog reaches senior status, more frequent vet checkups (every 6 months rather than annually) are typically recommended."
                />
                <FaqItem
                  q="Is the '1 dog year = 7 human years' rule accurate?"
                  a="No — the 7-to-1 rule is a popular oversimplification that does not hold up to scrutiny. It does not account for size differences, and it gets the early years badly wrong. A 1-year-old dog is sexually mature and fully grown, which is far more comparable to a 15-year-old human than a 7-year-old. The rule may have originated from dividing a human lifespan (~70 years) by an average dog lifespan (~10 years), but it is not scientifically grounded."
                />
                <FaqItem
                  q="What is the average lifespan of a dog?"
                  a="Average dog lifespan varies significantly by size: small breeds (Chihuahua, Dachshund) average 12–16 years; medium breeds (Beagle, Cocker Spaniel) average 10–14 years; large breeds (Labrador, Golden Retriever) average 8–12 years; and giant breeds (Great Dane, Saint Bernard) average 6–10 years. Mixed-breed dogs often benefit from hybrid vigor and may live slightly longer than purebreds of the same size. Diet, exercise, genetics, and preventive care all significantly influence individual lifespan."
                />
                <FaqItem
                  q="How can I help my dog live longer?"
                  a="Several evidence-backed strategies can extend a dog's healthy lifespan: maintain a healthy weight (obesity is linked to shorter lifespan in dogs just as in humans), provide regular moderate exercise appropriate for the breed and age, feed high-quality nutrition, schedule annual or biannual vet checkups including dental cleanings, keep vaccinations and parasite prevention current, provide mental stimulation and social interaction, and minimize prolonged stress. Spaying or neutering may also reduce the risk of certain cancers and infections."
                />
              </div>
            </section>

            {/* ── SEO RICH CONTENT ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">How Old Is Your Dog in Human Years?</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The question of how old a dog is in human years is one every dog owner eventually asks. The answer is more nuanced than most people expect. Unlike the famous multiply-by-7 shortcut, modern veterinary research shows that dog aging is nonlinear and strongly influenced by the dog's size and weight class.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Key findings from studies published through organizations like the American Kennel Club (AKC) and Pedigree Foundation show that dogs age very rapidly in their first two years — comparable to reaching young adulthood in humans — and then slow down, with the rate depending on body size. A 1-year-old dog of any size is roughly equivalent to a 15-year-old teenager. By age 2, all sizes converge around 24 human years. After that, the paths diverge: small dogs add about 4 human years per dog year, while giant breeds add 7.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This calculator uses that research-backed framework to give you an accurate conversion for your specific dog — not a one-size-fits-all approximation.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-black text-foreground tracking-tight mb-4">Average Dog Lifespan by Breed Size</h3>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/60">
                        <th className="text-left px-4 py-3 font-bold text-foreground">Size Category</th>
                        <th className="text-left px-4 py-3 font-bold text-foreground">Weight Range</th>
                        <th className="text-left px-4 py-3 font-bold text-foreground">Typical Lifespan</th>
                        <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Example Breeds</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">Small</td>
                        <td className="px-4 py-3 text-muted-foreground">&lt; 10 kg (&lt; 22 lbs)</td>
                        <td className="px-4 py-3 font-semibold text-foreground">12–16 years</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Chihuahua, Dachshund, Pomeranian</td>
                      </tr>
                      <tr className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-yellow-600 dark:text-yellow-400">Medium</td>
                        <td className="px-4 py-3 text-muted-foreground">10–25 kg (22–55 lbs)</td>
                        <td className="px-4 py-3 font-semibold text-foreground">10–14 years</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Beagle, Cocker Spaniel, Border Collie</td>
                      </tr>
                      <tr className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">Large</td>
                        <td className="px-4 py-3 text-muted-foreground">25–45 kg (55–100 lbs)</td>
                        <td className="px-4 py-3 font-semibold text-foreground">8–12 years</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Labrador, Golden Retriever, Husky</td>
                      </tr>
                      <tr className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-red-600 dark:text-red-400">Giant</td>
                        <td className="px-4 py-3 text-muted-foreground">&gt; 45 kg (&gt; 100 lbs)</td>
                        <td className="px-4 py-3 font-semibold text-foreground">6–10 years</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Great Dane, Saint Bernard, Mastiff</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-foreground tracking-tight mb-4">Dog Life Stage Guide</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Knowing your dog's life stage helps you tailor their care, nutrition, and veterinary schedule. While the exact boundaries shift by size, these general stages apply across all breeds:
                </p>
                <div className="space-y-3">
                  {[
                    { stage: "Puppy (0–1 year)", color: "emerald", desc: "The fastest growth phase. Puppies need frequent feeding, vaccinations, socialization, and basic training. Their immune systems are developing and they are most vulnerable to disease." },
                    { stage: "Junior (1–3 years)", color: "green", desc: "Adolescence. Physically mature but may still exhibit puppy energy and behavioral immaturity. Continued training and socialization remain important. Spaying or neutering typically occurs during this stage." },
                    { stage: "Adult (3–7 years)", color: "blue", desc: "Peak health and energy. Annual vet checkups, consistent exercise, and balanced nutrition maintain vitality. Dogs in this stage are typically easiest to care for." },
                    { stage: "Mature (7–10 years)", color: "amber", desc: "Middle age. Energy may decrease and weight management becomes more important. Biannual vet visits are recommended. Watch for early signs of arthritis, dental disease, and vision changes." },
                    { stage: "Senior (10–13 years)", color: "orange", desc: "Senior dogs benefit from joint supplements, softer food, gentler exercise, and more frequent health monitoring. Pain management and comfort become priorities." },
                    { stage: "Geriatric (13+ years)", color: "red", desc: "Geriatric dogs require intensive care, frequent vet visits, and close attention to comfort and quality of life. Many dogs remain happy and alert well into this stage with proper support." },
                  ].map(({ stage, color, desc }) => (
                    <div key={stage} className={`flex gap-3 p-4 rounded-xl border ${STAGE_COLORS[color]}`}>
                      <div className="w-2.5 h-2.5 rounded-full bg-current flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold mb-1">{stage}</p>
                        <p className="text-sm opacity-80 leading-relaxed text-foreground/70">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> This calculator provides general estimates based on published veterinary research. Individual dogs vary widely based on genetics, breed, diet, exercise, and healthcare history. Always consult a licensed veterinarian for advice specific to your dog's health and life stage. The life stage boundaries and lifespan figures shown here are approximations and should not replace professional veterinary assessment.
                </p>
              </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Explore More Health Tools</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  From BMI to calorie tracking, browse 400+ free tools for health, fitness, finance, and more.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Quick Reference: Lifespans */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Average Lifespans</h3>
                <div className="space-y-2">
                  {(Object.keys(SIZE_CONFIG) as DogSize[]).map((s) => (
                    <div key={s} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                      <div>
                        <p className="text-xs font-bold text-foreground">{SIZE_CONFIG[s].label}</p>
                        <p className="text-[10px] text-muted-foreground leading-tight">{SIZE_CONFIG[s].range}</p>
                      </div>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{SIZE_CONFIG[s].lifespan}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Tools */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-amber-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help other dog owners find this calculator.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "Comparison Table", "FAQ", "Lifespan by Size", "Life Stage Guide"].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-amber-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-amber-500/40 flex-shrink-0" />
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
