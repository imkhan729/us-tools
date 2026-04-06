import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, BadgeCheck, Lock, Shield, Smartphone,
  Copy, Check, Heart, Activity, Star,
  Lightbulb,
} from "lucide-react";

// ── Cat Age Conversion Logic (International Cat Care method) ──
function catToHuman(catAge: number): number {
  if (catAge <= 0) return 0;
  if (catAge <= 1) return 15 * catAge;
  if (catAge <= 2) return 15 + 9 * (catAge - 1);
  return 24 + 4 * (catAge - 2);
}

type LifeStage = {
  label: string;
  description: string;
  color: string;
  dotColor: string;
};

function getLifeStage(catAge: number): LifeStage {
  if (catAge < 0.5) {
    return {
      label: "Kitten",
      description: "Rapid growth, high energy, and peak curiosity. Needs frequent feeding and socialization.",
      color: "text-pink-600 dark:text-pink-400",
      dotColor: "bg-pink-500",
    };
  }
  if (catAge < 2) {
    return {
      label: "Junior",
      description: "Still growing and developing. Playful, mischievous, and learning their world.",
      color: "text-violet-600 dark:text-violet-400",
      dotColor: "bg-violet-500",
    };
  }
  if (catAge <= 6) {
    return {
      label: "Prime",
      description: "At peak physical condition. Healthy, active, and fully socially developed.",
      color: "text-indigo-600 dark:text-indigo-400",
      dotColor: "bg-indigo-500",
    };
  }
  if (catAge <= 10) {
    return {
      label: "Mature",
      description: "Equivalent to a middle-aged human. May begin to slow down slightly.",
      color: "text-purple-600 dark:text-purple-400",
      dotColor: "bg-purple-500",
    };
  }
  if (catAge <= 14) {
    return {
      label: "Senior",
      description: "Older cat with changing needs. Regular vet checkups become more important.",
      color: "text-amber-600 dark:text-amber-400",
      dotColor: "bg-amber-500",
    };
  }
  return {
    label: "Super Senior",
    description: "A remarkable age! Gentle care, comfort, and close monitoring support quality of life.",
    color: "text-rose-600 dark:text-rose-400",
    dotColor: "bg-rose-500",
  };
}

function expectedRemaining(catAge: number): string {
  const avgLifespan = 15;
  const remaining = avgLifespan - catAge;
  if (remaining <= 0) return "Beyond average lifespan — every day is a bonus!";
  const yrs = Math.floor(remaining);
  const months = Math.round((remaining - yrs) * 12);
  if (yrs === 0) return `About ${months} month${months !== 1 ? "s" : ""} (avg. indoor lifespan)`;
  if (months === 0) return `About ${yrs} year${yrs !== 1 ? "s" : ""} (avg. indoor lifespan)`;
  return `About ${yrs} yr${yrs !== 1 ? "s" : ""} ${months} mo (avg. indoor lifespan)`;
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-violet-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-violet-500">
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
  { title: "BMI Calculator", slug: "bmi-calculator", icon: <Activity className="w-5 h-5" />, color: 271, benefit: "Check body mass index for you or your pet" },
  { title: "Age Calculator", slug: "age-calculator", icon: <Heart className="w-5 h-5" />, color: 340, benefit: "Calculate exact age from a birthdate" },
  { title: "Ideal Weight Calculator", slug: "ideal-weight-calculator", icon: <Activity className="w-5 h-5" />, color: 152, benefit: "Find healthy weight ranges" },
  { title: "Calorie Deficit Calculator", slug: "calorie-deficit-calculator", icon: <Heart className="w-5 h-5" />, color: 25, benefit: "Plan nutrition and calorie goals" },
  { title: "Water Intake Calculator", slug: "water-intake-calculator", icon: <Activity className="w-5 h-5" />, color: 217, benefit: "Daily hydration recommendations" },
];

// ── Comparison table data (cat ages 1–20) ──
const COMPARISON_ROWS = Array.from({ length: 20 }, (_, i) => {
  const catAge = i + 1;
  const humanAge = Math.round(catToHuman(catAge));
  const stage = getLifeStage(catAge);
  return { catAge, humanAge, stage: stage.label };
});

// ── Main Component ──
export default function CatAgeCalculator() {
  const [catAgeInput, setCatAgeInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const age = parseFloat(catAgeInput);
    if (isNaN(age) || age < 0) return null;
    const humanAge = catToHuman(age);
    const stage = getLifeStage(age);
    const remaining = expectedRemaining(age);
    return { humanAge, stage, remaining };
  }, [catAgeInput]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { maximumFractionDigits: 1 });

  return (
    <Layout>
      <SEO
        title="Cat Age Calculator – Convert Cat Years to Human Years | US Online Tools"
        description="Free cat age calculator. Convert your cat's age to human years using the International Cat Care method. Find your cat's life stage: kitten, junior, prime, mature, senior, or super senior."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health &amp; Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <span className="text-foreground">Cat Age Calculator</span>
        </nav>

        {/* ── HERO SECTION ── */}
        <section id="overview" className="rounded-2xl overflow-hidden border border-violet-500/15 bg-gradient-to-br from-violet-500/5 via-card to-indigo-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Heart className="w-3.5 h-3.5" />
            Health &amp; Fitness
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Cat Age Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Convert your cat&apos;s age to human years using the International Cat Care method. Discover your cat&apos;s life stage, human age equivalent, and expected remaining years — instantly, no button needed.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Results
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-full border border-indigo-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs px-3 py-1.5 rounded-full border border-purple-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>

          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Health &amp; Fitness &nbsp;&middot;&nbsp; Last updated: March 2026
          </p>

          {/* Stat grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Average indoor lifespan", value: "12–18", sub: "years" },
              { label: "Average outdoor lifespan", value: "2–5", sub: "years" },
              { label: "Year 1 equals", value: "15", sub: "human years" },
              { label: "Each year after 2 equals", value: "4", sub: "human years" },
            ].map((s) => (
              <div key={s.label} className="bg-card/80 border border-violet-500/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-violet-600 dark:text-violet-400 leading-none mb-1">{s.value}</p>
                <p className="text-xs font-semibold text-muted-foreground">{s.sub}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-violet-500/20 shadow-lg shadow-violet-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 to-indigo-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-400 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">ICC Method</p>
                      <p className="text-sm text-muted-foreground">Enter your cat&apos;s age — results appear instantly.</p>
                    </div>
                  </div>

                  {/* Input Card */}
                  <div className="tool-calc-card" style={{ "--calc-hue": 271 } as React.CSSProperties}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="tool-calc-number">1</div>
                      <h3 className="text-lg font-bold text-foreground">Enter Your Cat&apos;s Age</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <span className="text-sm font-semibold text-muted-foreground">My cat is</span>
                      <input
                        type="number"
                        placeholder="3"
                        min="0"
                        step="0.5"
                        className="tool-calc-input w-32"
                        value={catAgeInput}
                        onChange={e => setCatAgeInput(e.target.value)}
                      />
                      <span className="text-sm font-semibold text-muted-foreground">years old</span>
                    </div>
                    <p className="text-xs text-muted-foreground/60 mt-3">Decimals supported — e.g. enter 0.5 for a 6-month-old kitten.</p>
                  </div>

                  {/* Animated Results */}
                  <AnimatePresence>
                    {result !== null && (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        {/* Human Age */}
                        <div className="tool-calc-card" style={{ "--calc-hue": 271 } as React.CSSProperties}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="tool-calc-number">2</div>
                            <h3 className="text-lg font-bold text-foreground">Human Age Equivalent</h3>
                          </div>
                          <div className="tool-calc-result text-violet-600 dark:text-violet-400 text-4xl">
                            {fmt(result.humanAge)} <span className="text-lg font-semibold text-muted-foreground">human years</span>
                          </div>
                        </div>

                        {/* Life Stage + Remaining */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="rounded-xl border border-border bg-muted/30 p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Life Stage</p>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${result.stage.dotColor}`} />
                              <span className={`text-xl font-black ${result.stage.color}`}>{result.stage.label}</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{result.stage.description}</p>
                          </div>
                          <div className="rounded-xl border border-border bg-muted/30 p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Expected Remaining</p>
                            <p className="text-base font-bold text-foreground mb-1">{result.remaining}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">Based on a 15-year average indoor lifespan. Indoor cats often live longer than outdoor cats.</p>
                          </div>
                        </div>

                        {/* Insight */}
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20"
                        >
                          <div className="flex gap-2 items-start">
                            <Lightbulb className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-foreground/80 leading-relaxed">
                              A {catAgeInput}-year-old cat is roughly equivalent to a <strong>{fmt(result.humanAge)}-year-old human</strong>.{" "}
                              At this age, your cat is in the <strong>{result.stage.label}</strong> life stage &mdash; {result.stage.description.toLowerCase()}
                            </p>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* ── CAT AGE COMPARISON TABLE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Cat Age to Human Years: Full Reference Table</h2>
              <p className="text-muted-foreground text-sm mb-6">Ages 1–20 converted using the International Cat Care methodology.</p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Cat Age (years)</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Human Years</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Life Stage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {COMPARISON_ROWS.map(({ catAge, humanAge, stage }) => (
                      <tr key={catAge} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-foreground">{catAge}</td>
                        <td className="px-4 py-3 font-bold text-violet-600 dark:text-violet-400">{humanAge}</td>
                        <td className="px-4 py-3 text-muted-foreground">{stage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How do you convert cat years to human years?"
                  a="The International Cat Care (ICC) method is the most widely accepted approach. The first year of a cat's life equals 15 human years, capturing the rapid development from newborn to sexually mature adult. The second year adds 9 more human years (totaling 24), reflecting continued growth and maturation. From year three onward, each additional cat year equals approximately 4 human years. This non-linear scale better reflects feline biology than any fixed ratio."
                />
                <FaqItem
                  q="Is the '1 cat year = 7 human years' formula correct?"
                  a="No — the '1 year equals 7 human years' rule is a popular myth and is biologically inaccurate for cats. It originated as a rough rule of thumb for dogs and was never scientifically derived for felines. Cats develop far more quickly in their first two years than the 1:7 ratio implies. A one-year-old cat is already equivalent to a 15-year-old human, not a 7-year-old. The International Cat Care method used here is far more accurate."
                />
                <FaqItem
                  q="At what age is a cat considered senior?"
                  a="According to the International Cat Care classification, cats enter the Senior life stage at 11 years old, which corresponds to roughly 60 human years. The Super Senior category begins at 15 years (approximately 76 human years). Many veterinarians recommend twice-yearly health checkups once a cat reaches 7–10 years (the Mature stage), as age-related conditions such as kidney disease, hyperthyroidism, and dental disease become more common."
                />
                <FaqItem
                  q="Do indoor cats live longer than outdoor cats?"
                  a="Yes, significantly. Indoor cats typically live 12–18 years on average, with many reaching their late teens or even early twenties. Outdoor cats average just 2–5 years due to hazards including traffic, predators, disease transmission, and exposure to toxins. Indoor-outdoor cats fall somewhere between. The longest-verified cat lifespan on record is 38 years (Creme Puff of Austin, Texas). Keeping your cat indoors or in a safely enclosed outdoor space is one of the single most impactful decisions for longevity."
                />
                <FaqItem
                  q="What is the average lifespan of a cat?"
                  a="The average lifespan for a domestic cat is approximately 12–15 years, though this varies considerably by genetics, lifestyle, diet, and veterinary care. Indoor-only cats commonly live 15–20 years. Certain breeds tend to be particularly long-lived, including Siamese (often 15–20 years), Balinese, and Burmese. Mixed-breed cats often have fewer hereditary health problems compared to some pedigree breeds, which can contribute to longer lifespans."
                />
                <FaqItem
                  q="How can I tell my cat's age if I don't know their birthday?"
                  a="A veterinarian can estimate a cat's age through several physical indicators. Teeth are the most reliable — kittens have baby teeth at 2–4 weeks, adult teeth by 6 months, and tartar buildup increases gradually with age. Eye clarity can also indicate age; older cats often develop a slight cloudiness (nuclear sclerosis). Coat condition, muscle tone, and joint flexibility provide additional clues. For an adult rescue cat, a vet's estimate is typically accurate to within 1–2 years."
                />
              </div>
            </section>

            {/* ── SEO RICH CONTENT ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Converting Cat Years to Human Years</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  The concept of converting cat years to human years has fascinated pet owners for decades, but the popular &quot;multiply by seven&quot; rule was never scientifically validated for felines. In 2019, the <strong className="text-foreground">International Cat Care (ICC)</strong> organization published a refined life stage framework that better maps feline biological aging to its human equivalent. This calculator uses that methodology.
                </p>
                <p>
                  The ICC formula recognizes that cats age at dramatically different rates throughout their lives. A cat reaches sexual maturity around 6 months — the equivalent of a 10-year-old human — and achieves full adult development by age 2, roughly comparable to a 24-year-old person. After that, the pace of aging slows considerably: each additional year of cat life corresponds to only 4 human years.
                </p>
              </div>

              <h3 className="text-xl font-black text-foreground tracking-tight">The ICC Life Stage Framework</h3>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Life Stage</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Cat Age</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Human Equivalent</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Key Characteristics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ["Kitten", "0–6 months", "0–10 years", "Rapid growth, learning, vaccinations"],
                      ["Junior", "6 months–2 years", "10–24 years", "Still growing, reaching sexual maturity"],
                      ["Prime", "3–6 years", "28–40 years", "Peak health, optimal condition"],
                      ["Mature", "7–10 years", "44–56 years", "Slower pace, watch for early health signs"],
                      ["Senior", "11–14 years", "60–72 years", "Regular vet checkups essential"],
                      ["Super Senior", "15+ years", "76+ years", "Special care, comfort, and close monitoring"],
                    ].map(([stage, catAge, humanAge, chars]) => (
                      <tr key={stage} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-semibold text-violet-600 dark:text-violet-400">{stage}</td>
                        <td className="px-4 py-3 font-mono text-foreground">{catAge}</td>
                        <td className="px-4 py-3 text-foreground">{humanAge}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{chars}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-black text-foreground tracking-tight">Tips for Extending Your Cat&apos;s Longevity</h3>

              <div className="space-y-3">
                {[
                  {
                    title: "Keep them indoors or in a safe enclosure",
                    text: "Indoor cats live 3–4 times longer on average than outdoor cats. Cat-proof balconies and enclosed garden runs offer the best of both worlds.",
                    color: "bg-violet-500/5 border-violet-500/20",
                    dot: "bg-violet-500",
                  },
                  {
                    title: "Schedule regular veterinary checkups",
                    text: "Annual wellness exams until age 7, then biannual visits. Bloodwork, dental cleanings, and blood pressure checks become increasingly important in mature and senior cats.",
                    color: "bg-indigo-500/5 border-indigo-500/20",
                    dot: "bg-indigo-500",
                  },
                  {
                    title: "Feed a high-quality, age-appropriate diet",
                    text: "Cats are obligate carnivores. High-protein, low-carbohydrate diets support healthy weight and organ function. Senior-specific formulas often include joint and kidney support.",
                    color: "bg-purple-500/5 border-purple-500/20",
                    dot: "bg-purple-500",
                  },
                  {
                    title: "Maintain a healthy weight",
                    text: "Obesity is linked to diabetes, arthritis, and heart disease in cats. A body condition score assessment from your vet can determine if your cat needs dietary adjustment.",
                    color: "bg-pink-500/5 border-pink-500/20",
                    dot: "bg-pink-500",
                  },
                  {
                    title: "Provide mental stimulation and enrichment",
                    text: "Interactive toys, puzzle feeders, window perches, and regular playtime reduce stress and prevent cognitive decline in aging cats.",
                    color: "bg-rose-500/5 border-rose-500/20",
                    dot: "bg-rose-500",
                  },
                ].map(({ title, text, color, dot }) => (
                  <div key={title} className={`flex items-start gap-4 p-4 rounded-xl border ${color}`}>
                    <div className={`w-3 h-3 rounded-full ${dot} flex-shrink-0 mt-1.5`} />
                    <div>
                      <p className="font-bold text-foreground mb-1">{title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> The human-year equivalents shown in this calculator are based on the International Cat Care life stage framework and are intended as educational estimates. They do not account for breed-specific variation or individual health conditions. Always consult a licensed veterinarian for personalized advice about your cat&apos;s health, age-related needs, or life expectancy.
                </p>
              </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Explore More Health Tools</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  From BMI to calorie calculators, discover 400+ free tools for health, fitness, finance, and more — all instant and private.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Quick Reference */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Quick Reference</h3>
                <div className="space-y-2">
                  {[
                    { label: "Kitten", range: "0–6 months", color: "bg-pink-500" },
                    { label: "Junior", range: "6m–2 years", color: "bg-violet-500" },
                    { label: "Prime", range: "3–6 years", color: "bg-indigo-500" },
                    { label: "Mature", range: "7–10 years", color: "bg-purple-500" },
                    { label: "Senior", range: "11–14 years", color: "bg-amber-500" },
                    { label: "Super Senior", range: "15+ years", color: "bg-rose-500" },
                  ].map(({ label, range, color }) => (
                    <div key={label} className="flex items-center gap-2.5 py-1">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
                      <span className="text-xs font-semibold text-foreground flex-1">{label}</span>
                      <span className="text-xs text-muted-foreground">{range}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                    ICC life stages. Avg. indoor lifespan: 12–18 years. Avg. outdoor lifespan: 2–5 years.
                  </p>
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-violet-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help other cat owners find this calculator.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
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
                    "Reference Table",
                    "FAQ",
                    "ICC Methodology",
                    "Longevity Tips",
                  ].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-violet-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-violet-500/40 flex-shrink-0" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Fun Fact */}
              <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/5 border border-violet-500/20 rounded-2xl p-4">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xs text-foreground/80 italic leading-relaxed">
                  &quot;The oldest cat on record, Creme Puff of Austin, Texas, lived to 38 years and 3 days — equivalent to roughly 169 human years!&quot;
                </p>
                <p className="text-[10px] text-muted-foreground mt-2">— Guinness World Records</p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
