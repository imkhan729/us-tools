import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Scale, Zap, Shield, Smartphone,
  Lock, BadgeCheck, Copy, Check, Lightbulb, Activity,
  Heart, Flame, Dumbbell,
} from "lucide-react";

// ── Calculator Logic ──
function useIdealWeightCalc() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [heightUnit, setHeightUnit] = useState<"imperial" | "metric">("imperial");

  const result = useMemo(() => {
    let hCm: number;
    let hInch: number;

    if (heightUnit === "imperial") {
      const ft = parseFloat(heightFt);
      const inch = parseFloat(heightIn) || 0;
      if (isNaN(ft) || ft <= 0) return null;
      hInch = ft * 12 + inch;
      hCm = hInch * 2.54;
    } else {
      hCm = parseFloat(heightCm);
      if (isNaN(hCm) || hCm <= 0) return null;
      hInch = hCm / 2.54;
    }

    const inchOver5ft = Math.max(0, hInch - 60);

    // Robinson Formula (1983)
    const robinson = gender === "male"
      ? 52 + 1.9 * inchOver5ft
      : 49 + 1.7 * inchOver5ft;

    // Miller Formula (1983)
    const miller = gender === "male"
      ? 56.2 + 1.41 * inchOver5ft
      : 53.1 + 1.36 * inchOver5ft;

    // Devine Formula (1974)
    const devine = gender === "male"
      ? 50 + 2.3 * inchOver5ft
      : 45.5 + 2.3 * inchOver5ft;

    // Hamwi Formula (1964)
    const hamwi = gender === "male"
      ? 48 + 2.7 * inchOver5ft
      : 45.5 + 2.2 * inchOver5ft;

    // Average
    const avgKg = (robinson + miller + devine + hamwi) / 4;

    // Healthy BMI range (18.5–24.9) at given height
    const hM = hCm / 100;
    const bmiLow = 18.5 * hM * hM;
    const bmiHigh = 24.9 * hM * hM;

    const toKgLbs = (kg: number) => ({ kg: +kg.toFixed(1), lbs: +(kg * 2.20462).toFixed(1) });

    return {
      robinson: toKgLbs(robinson),
      miller: toKgLbs(miller),
      devine: toKgLbs(devine),
      hamwi: toKgLbs(hamwi),
      average: toKgLbs(avgKg),
      bmiRange: { low: toKgLbs(bmiLow), high: toKgLbs(bmiHigh) },
    };
  }, [gender, heightFt, heightIn, heightCm, heightUnit]);

  return { gender, setGender, heightFt, setHeightFt, heightIn, setHeightIn, heightCm, setHeightCm, heightUnit, setHeightUnit, result };
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-green-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-green-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "BMI Calculator", slug: "bmi-calculator", icon: <Scale className="w-5 h-5" />, color: 200, benefit: "Body Mass Index check" },
  { title: "TDEE Calculator", slug: "tdee-calculator", icon: <Flame className="w-5 h-5" />, color: 0, benefit: "Daily calorie burn" },
  { title: "Body Fat Calculator", slug: "body-fat-calculator", icon: <Activity className="w-5 h-5" />, color: 340, benefit: "Estimate body fat %" },
  { title: "Water Intake Calculator", slug: "water-intake-calculator", icon: <Heart className="w-5 h-5" />, color: 217, benefit: "Daily hydration target" },
  { title: "BMR Calculator", slug: "bmr-calculator", icon: <Dumbbell className="w-5 h-5" />, color: 152, benefit: "Resting metabolic rate" },
];

const FORMULAS = [
  { key: "robinson", name: "Robinson (1983)", desc: "Most widely used in clinical settings" },
  { key: "miller", name: "Miller (1983)", desc: "Tends to give slightly higher estimates" },
  { key: "devine", name: "Devine (1974)", desc: "Originally used for medication dosing" },
  { key: "hamwi", name: "Hamwi (1964)", desc: "Older formula, still used by dietitians" },
] as const;

export default function IdealWeightCalculator() {
  const calc = useIdealWeightCalc();
  const [unit, setUnit] = useState<"kg" | "lbs">("lbs");
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Ideal Weight Calculator – Find Your Healthy Target Weight by Height"
        description="Calculate your ideal body weight using 4 medical formulas: Robinson, Miller, Devine, and Hamwi. Get results in kg and lbs. Plus healthy BMI weight range. Free, no signup."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-green-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health &amp; Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-green-500" strokeWidth={3} />
          <span className="text-foreground">Ideal Weight Calculator</span>
        </nav>

        {/* ── HERO ── */}
        <section className="rounded-2xl overflow-hidden border border-green-500/15 bg-gradient-to-br from-green-500/5 via-card to-emerald-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Scale className="w-3.5 h-3.5" /> Health &amp; Fitness
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Ideal Weight Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Find your ideal body weight based on height and gender using 4 proven medical formulas. Also shows your healthy weight range by BMI. Results in kg and lbs.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { icon: <BadgeCheck className="w-3.5 h-3.5" />, label: "100% Free", color: "emerald" },
              { icon: <Zap className="w-3.5 h-3.5" />, label: "Instant Results", color: "green" },
              { icon: <Lock className="w-3.5 h-3.5" />, label: "No Signup", color: "slate" },
              { icon: <Shield className="w-3.5 h-3.5" />, label: "Privacy First", color: "violet" },
              { icon: <Smartphone className="w-3.5 h-3.5" />, label: "Mobile Ready", color: "cyan" },
            ].map(b => (
              <span key={b.label} className={`inline-flex items-center gap-1.5 bg-${b.color}-500/10 text-${b.color}-600 dark:text-${b.color}-400 font-bold text-xs px-3 py-1.5 rounded-full border border-${b.color}-500/20`}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Health &amp; Fitness &nbsp;·&nbsp; 4 medical formulas + BMI range &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── MAIN COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-green-500/20 shadow-lg shadow-green-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-green-500 to-emerald-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Scale className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">4 Medical Formulas</p>
                      <p className="text-sm text-muted-foreground">Results update as you type.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Gender */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Biological Sex</label>
                      <div className="flex gap-2">
                        {(["male", "female"] as const).map(g => (
                          <button key={g} onClick={() => calc.setGender(g)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${calc.gender === g ? "bg-green-500 text-white border-green-500" : "border-border text-muted-foreground hover:border-green-500/50"}`}>
                            {g === "male" ? "Male" : "Female"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Height */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Height</label>
                      <div className="flex gap-2 flex-wrap">
                        {calc.heightUnit === "imperial" ? (
                          <>
                            <input type="number" placeholder="5" min="1"
                              className="tool-calc-input w-16"
                              value={calc.heightFt} onChange={e => calc.setHeightFt(e.target.value)} />
                            <span className="self-center text-sm font-bold text-muted-foreground">ft</span>
                            <input type="number" placeholder="10" min="0" max="11"
                              className="tool-calc-input w-16"
                              value={calc.heightIn} onChange={e => calc.setHeightIn(e.target.value)} />
                            <span className="self-center text-sm font-bold text-muted-foreground">in</span>
                          </>
                        ) : (
                          <>
                            <input type="number" placeholder="178"
                              className="tool-calc-input flex-1"
                              value={calc.heightCm} onChange={e => calc.setHeightCm(e.target.value)} />
                            <span className="self-center text-sm font-bold text-muted-foreground">cm</span>
                          </>
                        )}
                        <div className="flex rounded-xl border-2 border-border overflow-hidden">
                          {(["imperial", "metric"] as const).map(u => (
                            <button key={u} onClick={() => calc.setHeightUnit(u)}
                              className={`px-2.5 py-2 text-xs font-bold transition-all ${calc.heightUnit === u ? "bg-green-500 text-white" : "text-muted-foreground hover:bg-muted"}`}>
                              {u === "imperial" ? "ft" : "cm"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results */}
                  {calc.result && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      {/* Unit toggle */}
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Results by Formula</p>
                        <div className="flex rounded-xl border-2 border-border overflow-hidden">
                          {(["lbs", "kg"] as const).map(u => (
                            <button key={u} onClick={() => setUnit(u)}
                              className={`px-3 py-1.5 text-xs font-bold transition-all ${unit === u ? "bg-green-500 text-white" : "text-muted-foreground hover:bg-muted"}`}>
                              {u}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Average highlight */}
                      <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-xs font-bold uppercase tracking-widest text-green-500 mb-1">Average Ideal Weight</p>
                          <p className="text-4xl font-black text-foreground">
                            {unit === "lbs" ? calc.result.average.lbs : calc.result.average.kg}
                            <span className="text-lg font-medium text-muted-foreground ml-1">{unit}</span>
                          </p>
                        </div>
                        <Scale className="w-10 h-10 text-green-500/30" />
                      </div>

                      {/* By formula */}
                      <div className="space-y-2">
                        {FORMULAS.map(f => {
                          const val = calc.result![f.key];
                          return (
                            <div key={f.key} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-foreground">{f.name}</p>
                                <p className="text-xs text-muted-foreground">{f.desc}</p>
                              </div>
                              <p className="text-base font-black text-foreground flex-shrink-0">
                                {unit === "lbs" ? val.lbs : val.kg} <span className="text-xs font-medium text-muted-foreground">{unit}</span>
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* BMI range */}
                      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">Healthy Weight Range (BMI 18.5–24.9)</p>
                        <p className="text-lg font-black text-foreground">
                          {unit === "lbs"
                            ? `${calc.result.bmiRange.low.lbs} – ${calc.result.bmiRange.high.lbs} lbs`
                            : `${calc.result.bmiRange.low.kg} – ${calc.result.bmiRange.high.kg} kg`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Any weight in this range is considered medically healthy for your height.</p>
                      </div>

                      <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            These formulas were developed for medical dosing, not body image. Your actual healthy weight depends on muscle mass, bone density, and genetics. The BMI range above is the most clinically relevant target — any weight within <strong>{unit === "lbs" ? `${calc.result.bmiRange.low.lbs}–${calc.result.bmiRange.high.lbs} lbs` : `${calc.result.bmiRange.low.kg}–${calc.result.bmiRange.high.kg} kg`}</strong> is healthy for your height.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">About the Ideal Weight Formulas</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                There is no single universally agreed "ideal" weight — the concept is a medical approximation. These formulas were originally developed by physicians and pharmacologists in the 1960s–1980s to standardize drug dosing based on lean body mass, not aesthetic standards.
              </p>
              <div className="space-y-4">
                {[
                  { name: "Robinson Formula (1983)", desc: "Published by J.D. Robinson in 1983 and considered the most widely cited formula in modern clinical settings. It uses 52 kg (male) or 49 kg (female) as a base for 5 feet, then adds 1.9 kg (male) or 1.7 kg (female) per inch above 5 feet." },
                  { name: "Devine Formula (1974)", desc: "Developed by B.J. Devine in 1974, originally for creatinine clearance calculations in renal patients. Despite its pharmaceutical origin, it became one of the most common ideal weight references. It uses 50 kg (male) or 45.5 kg (female) as a base, with 2.3 kg added per inch over 5 feet." },
                  { name: "Miller Formula (1983)", desc: "Proposed by D.R. Miller in the same year as Robinson's formula, it tends to produce slightly higher estimates and is less conservative than Devine. Used less frequently in clinical practice but included here for completeness." },
                  { name: "Hamwi Formula (1964)", desc: "The oldest formula here, developed by G.J. Hamwi in 1964 for diabetic patients. Uses 48 kg (male) or 45.5 kg (female) as a base, with 2.7 kg (male) or 2.2 kg (female) per inch above 5 feet. Tends to give the highest estimates for tall individuals." },
                ].map(f => (
                  <div key={f.name} className="p-4 rounded-xl bg-muted/40 border border-border">
                    <p className="font-bold text-foreground mb-1">{f.name}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── FAQ ── */}
            <section className="space-y-3">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Frequently Asked Questions</h2>
              {[
                { q: "Is there a single 'ideal' weight for my height?", a: "No — ideal weight is a range, not a single number. The formulas here give estimates based on height and gender alone, which ignores muscle mass, bone density, ethnicity, and age. Two people of the same height and gender can have significantly different healthy weights due to body composition differences. The BMI range of 18.5–24.9 is a broader, more clinically valid target." },
                { q: "Why do the four formulas give different numbers?", a: "Each formula was developed at different times, using different patient populations, and for different clinical purposes (medication dosing, diabetes management, renal function). None were developed as universal ideal weight standards — they converge to a similar range but differ in their base assumptions and adjustment rates per inch." },
                { q: "Should I aim for the average of the four formulas?", a: "The average of the four formulas is a reasonable starting point for a weight goal, but your actual target should account for your current fitness level, body composition, and health markers (blood pressure, cholesterol, blood glucose). Consult a healthcare provider or registered dietitian before setting specific weight goals." },
                { q: "What if I'm very tall or short?", a: "These formulas work best for people between 5'0\" and 6'5\" (152–196 cm). For very short individuals (under 5'), the formulas may underestimate ideal weight. For very tall individuals (over 6'5\"), they may overestimate. The BMI range remains more accurate across the full height spectrum." },
              ].map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </section>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Why Use This Tool</p>
                {[
                  { icon: <Zap className="w-4 h-4 text-green-500" />, text: "4 medical formulas + BMI range" },
                  { icon: <Shield className="w-4 h-4 text-green-500" />, text: "No data stored — 100% private" },
                  { icon: <BadgeCheck className="w-4 h-4 text-green-500" />, text: "Results in both kg and lbs" },
                  { icon: <Smartphone className="w-4 h-4 text-green-500" />, text: "Works on phone, tablet, desktop" },
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">{t.icon}</div>
                    <p className="text-sm text-muted-foreground">{t.text}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
                <p className="text-sm font-bold text-foreground mb-3">Share this calculator</p>
                <button onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-colors">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Related Tools</p>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((t, i) => (
                    <Link key={i} href={`/tools/${t.slug}`}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all border border-transparent hover:border-border">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `hsl(${t.color},80%,50%,0.1)`, color: `hsl(${t.color},70%,45%)` }}>
                        {t.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground leading-tight truncate">{t.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{t.benefit}</p>
                      </div>
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
