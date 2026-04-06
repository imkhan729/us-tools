import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Activity, Zap, Shield, Smartphone,
  Lock, BadgeCheck, Copy, Check, Lightbulb, Scale, Flame, Dumbbell, Heart,
} from "lucide-react";

// ── Types ──
type Sex = "male" | "female";
type FrameSize = "small" | "medium" | "large";
type Somatotype = "ectomorph" | "mesomorph" | "endomorph";

interface BodyTypeResult {
  bmi: number;
  frameSize: FrameSize;
  somatotype: Somatotype;
  description: string;
  characteristics: string[];
  training: string[];
  nutrition: string[];
}

// ── Calculator Logic ──
function useBodyTypeCalc() {
  const [sex, setSex] = useState<Sex>("male");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ftIn">("ftIn");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("lbs");
  const [weight, setWeight] = useState("");
  const [wrist, setWrist] = useState("");
  const [ankle, setAnkle] = useState("");

  const result = useMemo<BodyTypeResult | null>(() => {
    // Resolve height in cm
    let hCm: number;
    if (heightUnit === "cm") {
      hCm = parseFloat(heightCm);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      hCm = (ft * 12 + inches) * 2.54;
    }
    if (!hCm || hCm <= 0) return null;

    // Resolve weight in kg
    const rawWeight = parseFloat(weight);
    if (isNaN(rawWeight) || rawWeight <= 0) return null;
    const wKg = weightUnit === "lbs" ? rawWeight * 0.453592 : rawWeight;

    // Wrist in cm
    const wristCm = parseFloat(wrist);
    if (isNaN(wristCm) || wristCm <= 0) return null;

    // BMI
    const hM = hCm / 100;
    const bmi = wKg / (hM * hM);

    // Frame size: height / wrist ratio
    const frameRatio = hCm / wristCm;
    let frameSize: FrameSize;
    if (sex === "female") {
      if (frameRatio > 10.75) frameSize = "small";
      else if (frameRatio >= 9.75) frameSize = "medium";
      else frameSize = "large";
    } else {
      if (frameRatio > 10.4) frameSize = "small";
      else if (frameRatio >= 9.6) frameSize = "medium";
      else frameSize = "large";
    }

    // Somatotype determination
    const ectoThreshold = sex === "female" ? 20 : 22;
    const endoThreshold = sex === "female" ? 25 : 27;
    let somatotype: Somatotype;

    if (bmi < ectoThreshold) {
      somatotype = "ectomorph";
    } else if (bmi > endoThreshold) {
      somatotype = "endomorph";
    } else {
      // Within normal BMI range — frame size refines the classification
      if (frameSize === "small") somatotype = "ectomorph";
      else if (frameSize === "large") somatotype = "endomorph";
      else somatotype = "mesomorph";
    }

    const data: Record<Somatotype, Omit<BodyTypeResult, "bmi" | "frameSize" | "somatotype">> = {
      ectomorph: {
        description:
          "Ectomorphs are naturally lean and slender with a fast metabolism. They tend to have smaller bone structures, narrow shoulders and hips, and find it harder to gain both muscle and fat.",
        characteristics: [
          "Lean, thin build with low body fat",
          "Fast metabolism — burns calories quickly",
          "Smaller frame and bone structure",
          "Difficulty gaining weight or muscle mass",
          "Long limbs relative to torso",
        ],
        training: [
          "Focus on compound lifts: squats, deadlifts, bench press, rows",
          "Keep cardio minimal — 1–2 short sessions per week",
          "Train 3–4 days per week with heavy weights and low reps (5–8)",
          "Prioritize progressive overload to stimulate hypertrophy",
          "Ensure adequate rest — at least 48 hours between muscle groups",
        ],
        nutrition: [
          "Eat in a caloric surplus — aim for 300–500 kcal above TDEE",
          "High carbohydrate intake (50–60% of calories) to fuel muscle growth",
          "Eat frequently — 5–6 meals or snacks per day",
          "Prioritize calorie-dense foods: nuts, nut butters, whole grains, olive oil",
          "Protein target: 1.6–2.2 g per kg of body weight",
        ],
      },
      mesomorph: {
        description:
          "Mesomorphs are naturally muscular with a medium frame. They respond well to both strength training and cardiovascular exercise, gain muscle relatively easily, and can manage body fat with moderate effort.",
        characteristics: [
          "Naturally muscular and athletic build",
          "Medium bone structure and frame",
          "Efficient metabolism — gains muscle and loses fat with moderate effort",
          "Well-proportioned shoulders and hips",
          "Responds quickly to exercise stimulus",
        ],
        training: [
          "Versatile responders — both strength and endurance training work well",
          "Train 4–5 days per week with varied rep ranges (6–15)",
          "Include a mix of compound and isolation exercises",
          "Moderate cardio (2–3 sessions weekly) for cardiovascular health",
          "Periodize training — vary intensity every 4–6 weeks to avoid plateaus",
        ],
        nutrition: [
          "Balanced macros: 30–35% protein, 35–40% carbs, 25–30% fat",
          "Eat at maintenance or a slight surplus for muscle gain",
          "Time carbohydrates around workouts for optimal performance",
          "Protein target: 1.6–2.0 g per kg of body weight",
          "Moderate calorie tracking — mesomorphs can handle small variations well",
        ],
      },
      endomorph: {
        description:
          "Endomorphs tend to have a larger, rounder frame with a slower metabolism. They gain weight more easily and find fat loss more challenging, but they often have significant strength potential and a solid base for muscle building.",
        characteristics: [
          "Larger, rounder body frame with wider hips",
          "Slower metabolism — higher tendency to store fat",
          "Gains weight (both muscle and fat) relatively easily",
          "Strong and powerful, especially in lower body",
          "Higher body fat percentage at baseline",
        ],
        training: [
          "Prioritize cardio: 3–5 sessions per week of moderate-intensity exercise",
          "Strength training 3–4 days per week with moderate weights and higher reps (10–15)",
          "Circuit training and HIIT are highly effective for fat loss",
          "Focus on consistency — metabolism responds to regular activity over time",
          "Include low-impact steady-state cardio (walking, cycling) for active recovery",
        ],
        nutrition: [
          "Eat in a caloric deficit — aim for 300–500 kcal below TDEE",
          "Lower carbohydrate intake (25–35%) and higher protein (35–40%)",
          "Choose complex, high-fiber carbs to manage blood sugar and satiety",
          "Avoid processed foods and refined sugars which promote fat storage",
          "Protein target: 2.0–2.4 g per kg of body weight to preserve muscle",
        ],
      },
    };

    return {
      bmi: +bmi.toFixed(1),
      frameSize,
      somatotype,
      ...data[somatotype],
    };
  }, [sex, heightUnit, heightCm, heightFt, heightIn, weightUnit, weight, wrist, ankle]);

  return {
    sex, setSex,
    heightUnit, setHeightUnit,
    heightCm, setHeightCm,
    heightFt, setHeightFt,
    heightIn, setHeightIn,
    weightUnit, setWeightUnit,
    weight, setWeight,
    wrist, setWrist,
    ankle, setAnkle,
    result,
  };
}

// ── Somatotype display config ──
const SOMATOTYPE_CONFIG: Record<Somatotype, { emoji: string; color: string; label: string }> = {
  ectomorph: { emoji: "⚡", color: "blue", label: "Ectomorph" },
  mesomorph: { emoji: "💪", color: "amber", label: "Mesomorph" },
  endomorph: { emoji: "🔥", color: "orange", label: "Endomorph" },
};

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string | React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-amber-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-amber-500"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="a"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "BMI Calculator", slug: "bmi-calculator", icon: <Scale className="w-5 h-5" />, color: 200, benefit: "Body Mass Index check" },
  { title: "Ideal Weight Calculator", slug: "ideal-weight-calculator", icon: <Heart className="w-5 h-5" />, color: 152, benefit: "Find your target weight" },
  { title: "TDEE Calculator", slug: "tdee-calculator", icon: <Flame className="w-5 h-5" />, color: 0, benefit: "Daily calorie burn" },
  { title: "Water Intake Calculator", slug: "water-intake-calculator", icon: <Dumbbell className="w-5 h-5" />, color: 217, benefit: "Daily hydration target" },
];

export default function BodyTypeCalculator() {
  const calc = useBodyTypeCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cfg = calc.result ? SOMATOTYPE_CONFIG[calc.result.somatotype] : null;

  return (
    <Layout>
      <SEO
        title="Body Type Calculator – Find Your Somatotype (Ectomorph, Mesomorph, Endomorph)"
        description="Determine your body type (ectomorph, mesomorph, or endomorph) based on physical measurements. Understand how your somatotype affects training and nutrition."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health &amp; Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-amber-500" strokeWidth={3} />
          <span className="text-foreground">Body Type Calculator</span>
        </nav>

        {/* ── HERO ── */}
        <section id="overview" className="rounded-2xl overflow-hidden border border-amber-500/15 bg-gradient-to-br from-amber-500/5 via-card to-orange-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Activity className="w-3.5 h-3.5" /> Health &amp; Fitness
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Body Type Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Discover your somatotype — ectomorph, mesomorph, or endomorph — based on your height, weight, and frame measurements. Get personalized training and nutrition recommendations for your body type.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { icon: <BadgeCheck className="w-3.5 h-3.5" />, label: "100% Free", color: "emerald" },
              { icon: <Zap className="w-3.5 h-3.5" />, label: "Instant Results", color: "amber" },
              { icon: <Lock className="w-3.5 h-3.5" />, label: "No Signup", color: "slate" },
              { icon: <Shield className="w-3.5 h-3.5" />, label: "Privacy First", color: "violet" },
              { icon: <Smartphone className="w-3.5 h-3.5" />, label: "Mobile Ready", color: "cyan" },
            ].map(b => (
              <span
                key={b.label}
                className={`inline-flex items-center gap-1.5 bg-${b.color}-500/10 text-${b.color}-600 dark:text-${b.color}-400 font-bold text-xs px-3 py-1.5 rounded-full border border-${b.color}-500/20`}
              >
                {b.icon} {b.label}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Health &amp; Fitness &nbsp;·&nbsp; Frame size + BMI somatotype classification &nbsp;·&nbsp; Last updated: March 2026
          </p>

          {/* Stat grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { value: "3", label: "body types", sub: "ecto, meso, endo" },
              { value: "BMI +", label: "frame size", sub: "dual-method classification" },
              { value: "15+", label: "training tips", sub: "per body type" },
              { value: "100%", label: "private", sub: "no data stored" },
            ].map((s) => (
              <div key={s.label} className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{s.value}</p>
                <p className="text-xs font-medium text-foreground mt-0.5">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* ── MAIN COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section id="calculator">
              <div className="rounded-2xl overflow-hidden border border-amber-500/20 shadow-lg shadow-amber-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-orange-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Frame Size + BMI Method</p>
                      <p className="text-sm text-muted-foreground">Enter your measurements for instant results.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Sex */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Biological Sex</label>
                      <div className="flex gap-2">
                        {(["male", "female"] as Sex[]).map(s => (
                          <button
                            key={s}
                            onClick={() => calc.setSex(s)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${calc.sex === s ? "bg-amber-500 text-white border-amber-500" : "border-border text-muted-foreground hover:border-amber-500/50"}`}
                          >
                            {s === "male" ? "Male" : "Female"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Height */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Height</label>
                      <div className="flex gap-2 flex-wrap items-center">
                        {calc.heightUnit === "ftIn" ? (
                          <>
                            <input
                              type="number"
                              placeholder="5"
                              min="1"
                              className="tool-calc-input w-16"
                              value={calc.heightFt}
                              onChange={e => calc.setHeightFt(e.target.value)}
                            />
                            <span className="text-sm font-bold text-muted-foreground">ft</span>
                            <input
                              type="number"
                              placeholder="10"
                              min="0"
                              max="11"
                              className="tool-calc-input w-16"
                              value={calc.heightIn}
                              onChange={e => calc.setHeightIn(e.target.value)}
                            />
                            <span className="text-sm font-bold text-muted-foreground">in</span>
                          </>
                        ) : (
                          <>
                            <input
                              type="number"
                              placeholder="178"
                              className="tool-calc-input flex-1 min-w-[80px]"
                              value={calc.heightCm}
                              onChange={e => calc.setHeightCm(e.target.value)}
                            />
                            <span className="text-sm font-bold text-muted-foreground">cm</span>
                          </>
                        )}
                        <div className="flex rounded-xl border-2 border-border overflow-hidden">
                          {(["ftIn", "cm"] as const).map(u => (
                            <button
                              key={u}
                              onClick={() => calc.setHeightUnit(u)}
                              className={`px-2.5 py-2 text-xs font-bold transition-all ${calc.heightUnit === u ? "bg-amber-500 text-white" : "text-muted-foreground hover:bg-muted"}`}
                            >
                              {u === "ftIn" ? "ft" : "cm"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Weight */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Weight</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          placeholder={calc.weightUnit === "lbs" ? "165" : "75"}
                          className="tool-calc-input flex-1"
                          value={calc.weight}
                          onChange={e => calc.setWeight(e.target.value)}
                        />
                        <div className="flex rounded-xl border-2 border-border overflow-hidden">
                          {(["lbs", "kg"] as const).map(u => (
                            <button
                              key={u}
                              onClick={() => calc.setWeightUnit(u)}
                              className={`px-3 py-2 text-xs font-bold transition-all ${calc.weightUnit === u ? "bg-amber-500 text-white" : "text-muted-foreground hover:bg-muted"}`}
                            >
                              {u}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Wrist */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                        Wrist Circumference <span className="font-normal normal-case">(cm)</span>
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          placeholder="17.5"
                          step="0.1"
                          className="tool-calc-input flex-1"
                          value={calc.wrist}
                          onChange={e => calc.setWrist(e.target.value)}
                        />
                        <span className="text-sm font-bold text-muted-foreground">cm</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Measure at the narrowest point, just above the wrist bone.</p>
                    </div>

                    {/* Ankle — collected for display context, not currently used in formula */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                        Ankle Circumference <span className="font-normal normal-case">(cm, optional)</span>
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          placeholder="22.0"
                          step="0.1"
                          className="tool-calc-input flex-1"
                          value={calc.ankle}
                          onChange={e => calc.setAnkle(e.target.value)}
                        />
                        <span className="text-sm font-bold text-muted-foreground">cm</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Measure at the narrowest point above the ankle bone.</p>
                    </div>
                  </div>

                  {/* Results */}
                  <AnimatePresence initial={false}>
                    {calc.result && cfg && (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        {/* Primary somatotype result */}
                        <div className={`p-5 rounded-xl bg-${cfg.color}-500/5 border border-${cfg.color}-500/20`}>
                          <p className={`text-xs font-bold uppercase tracking-widest text-${cfg.color}-500 mb-2`}>Your Primary Body Type</p>
                          <div className="flex items-center gap-4">
                            <span className="text-5xl">{cfg.emoji}</span>
                            <div>
                              <p className="text-3xl font-black text-foreground">{cfg.label}</p>
                              <p className="text-sm text-muted-foreground mt-1">{calc.result.description}</p>
                            </div>
                          </div>
                        </div>

                        {/* BMI + frame */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-4 rounded-xl bg-muted/40 border border-border">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">BMI</p>
                            <p className="text-2xl font-black text-foreground">{calc.result.bmi}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-muted/40 border border-border">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Frame Size</p>
                            <p className="text-2xl font-black text-foreground capitalize">{calc.result.frameSize}</p>
                          </div>
                        </div>

                        {/* Characteristics */}
                        <div className="p-4 rounded-xl bg-muted/30 border border-border">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Key Characteristics</p>
                          <ul className="space-y-1.5">
                            {calc.result.characteristics.map((c, i) => (
                              <li key={i} className="flex gap-2 text-sm text-foreground/80">
                                <span className={`text-${cfg.color}-500 font-bold mt-0.5 flex-shrink-0`}>·</span>
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Training + Nutrition */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className={`p-4 rounded-xl bg-${cfg.color}-500/5 border border-${cfg.color}-500/20`}>
                            <p className={`text-xs font-bold uppercase tracking-widest text-${cfg.color}-500 mb-3`}>Training Recommendations</p>
                            <ul className="space-y-2">
                              {calc.result.training.map((t, i) => (
                                <li key={i} className="text-sm text-foreground/80 leading-snug flex gap-2">
                                  <span className={`text-${cfg.color}-500 font-bold flex-shrink-0`}>→</span>
                                  {t}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                            <p className="text-xs font-bold uppercase tracking-widest text-green-500 mb-3">Nutrition Recommendations</p>
                            <ul className="space-y-2">
                              {calc.result.nutrition.map((n, i) => (
                                <li key={i} className="text-sm text-foreground/80 leading-snug flex gap-2">
                                  <span className="text-green-500 font-bold flex-shrink-0">→</span>
                                  {n}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                          <div className="flex gap-2 items-start">
                            <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-foreground/80 leading-relaxed">
                              Most people are a <strong>blend of two body types</strong>. These recommendations are starting points — adjust based on your results, preferences, and how your body responds to training over 8–12 weeks.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* ── COMPARISON TABLE ── */}
            <section id="comparison" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">All 3 Body Types Compared</h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left p-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Trait</th>
                      <th className="text-center p-3 font-bold text-blue-500 text-xs uppercase tracking-widest">⚡ Ectomorph</th>
                      <th className="text-center p-3 font-bold text-amber-500 text-xs uppercase tracking-widest">💪 Mesomorph</th>
                      <th className="text-center p-3 font-bold text-orange-500 text-xs uppercase tracking-widest">🔥 Endomorph</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { trait: "Build", ecto: "Lean, thin", meso: "Muscular, athletic", endo: "Rounded, larger frame" },
                      { trait: "Metabolism", ecto: "Fast", meso: "Moderate", endo: "Slow" },
                      { trait: "Muscle gain", ecto: "Difficult", meso: "Easy", endo: "Moderate" },
                      { trait: "Fat gain", ecto: "Difficult", meso: "Moderate", endo: "Easy" },
                      { trait: "Fat loss", ecto: "Easy", meso: "Moderate", endo: "Challenging" },
                      { trait: "Frame", ecto: "Small bones", meso: "Medium bones", endo: "Large bones" },
                      { trait: "Best at", ecto: "Endurance sports", meso: "Most sports", endo: "Powerlifting, strength sports" },
                      { trait: "Diet focus", ecto: "Caloric surplus", meso: "Balanced macros", endo: "Caloric deficit, low carb" },
                    ].map((row, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="p-3 font-bold text-foreground">{row.trait}</td>
                        <td className="p-3 text-center text-muted-foreground">{row.ecto}</td>
                        <td className="p-3 text-center text-muted-foreground">{row.meso}</td>
                        <td className="p-3 text-center text-muted-foreground">{row.endo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section id="faq" className="space-y-3">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Frequently Asked Questions</h2>
              {[
                {
                  q: "What are the 3 body types?",
                  a: "The three somatotypes are ectomorph (naturally lean, fast metabolism, difficulty gaining weight), mesomorph (naturally muscular, medium frame, adapts well to exercise), and endomorph (larger frame, slower metabolism, tends to store fat more easily). The theory was developed by psychologist William Sheldon in the 1940s as a way to classify human physique.",
                },
                {
                  q: "Are body types real science?",
                  a: "The original somatotype theory by Sheldon was largely discredited because he linked body types to personality traits (which was pseudoscience). However, the physical classification itself — the idea that people have different baseline metabolic rates, frame sizes, and body composition tendencies — is supported by modern research. It's a useful practical framework for personalizing training and nutrition, even if it's not a rigid biological classification.",
                },
                {
                  q: "Can you be a mix of body types?",
                  a: "Absolutely — most people are a blend of two types. Common combinations include ecto-mesomorphs (lean but athletic, like many distance runners), meso-endomorphs (strong and muscular but carrying higher body fat), and ecto-endomorphs (skinny-fat: low muscle mass but higher body fat percentage). Pure types are the exception, not the rule.",
                },
                {
                  q: "Does body type affect weight loss?",
                  a: "Yes, to a degree. Endomorphs tend to be more insulin-sensitive and store carbohydrates as fat more readily, making lower-carb approaches more effective. Ectomorphs rarely need to worry about fat loss but struggle to maintain muscle during caloric restriction. Mesomorphs tend to respond well to most diets. However, the fundamentals of energy balance apply to all body types — a caloric deficit will result in fat loss regardless of somatotype.",
                },
                {
                  q: "How does body type affect training?",
                  a: "Ectomorphs should minimize cardio and maximize heavy resistance training with sufficient recovery time to stimulate muscle growth. Mesomorphs are versatile — they respond well to both strength and endurance training and can train with higher frequency. Endomorphs benefit most from a mix of strength training (to build metabolism-boosting muscle) and cardio (to burn calories), with higher rep ranges and shorter rest periods.",
                },
                {
                  q: "Is body type genetic?",
                  a: "Genetics play a significant role in body type — factors like bone structure, metabolic rate, hormonal baseline, and muscle fiber type distribution are largely inherited. That said, your expressed phenotype (how your body actually looks and performs) is significantly shaped by diet, exercise, sleep, and lifestyle over time. You can't change your fundamental frame, but you can dramatically change your body composition regardless of somatotype.",
                },
              ].map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </section>

            {/* ── CTA ── */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">Know your type — now optimize your training</h3>
              <p className="text-muted-foreground text-sm mb-4">Calculate your BMI, find your ideal weight, or explore all health tools.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/health/bmi-calculator"
                  className="px-5 py-2.5 bg-amber-500 text-white rounded-xl font-medium text-sm hover:bg-amber-600 transition-colors">
                  BMI Calculator →
                </Link>
                <Link href="/health"
                  className="px-5 py-2.5 bg-muted text-foreground rounded-xl font-medium text-sm hover:bg-muted/80 transition-colors">
                  All Health Tools
                </Link>
              </div>
            </div>

            {/* ── SEO RICH CONTENT ── */}
            <section id="science" className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Understanding Somatotypes: Science, Limits &amp; Practical Application</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The concept of somatotypes was introduced by American psychologist William Herbert Sheldon in 1940 in his book <em>The Varieties of Human Physique</em>. Sheldon proposed three primary body types as part of a broader (and now discredited) theory linking physique to personality and temperament. While the psychological component was rejected by the scientific community, the physical classification framework became widely adopted in sports science, fitness coaching, and nutrition.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Modern exercise science treats somatotypes as a practical starting point, not a deterministic label. Research consistently shows that body composition is highly malleable with the right training and nutrition protocol. Your body type tells you where you're starting from — it doesn't determine where you can go.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-black text-foreground tracking-tight mb-4">How Frame Size Is Calculated</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Frame size in this calculator is determined using the height-to-wrist ratio method, which divides height (in cm) by wrist circumference (in cm). Wrist size is used because it reflects skeletal bone structure — it cannot be reduced through diet or exercise, making it a reliable marker of natural frame size.
                </p>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/60">
                        <th className="text-left p-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Sex</th>
                        <th className="text-left p-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Small Frame</th>
                        <th className="text-left p-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Medium Frame</th>
                        <th className="text-left p-3 font-bold text-muted-foreground text-xs uppercase tracking-widest">Large Frame</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { sex: "Female", small: "Height / Wrist > 10.75", medium: "9.75 – 10.75", large: "< 9.75" },
                        { sex: "Male", small: "Height / Wrist > 10.4", medium: "9.6 – 10.4", large: "< 9.6" },
                      ].map((row, i) => (
                        <tr key={i} className="border-t border-border">
                          <td className="p-3 font-bold text-foreground">{row.sex}</td>
                          <td className="p-3 text-muted-foreground">{row.small}</td>
                          <td className="p-3 text-muted-foreground">{row.medium}</td>
                          <td className="p-3 text-muted-foreground">{row.large}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-foreground tracking-tight mb-4">Can You Change Your Body Type?</h3>
                <div className="space-y-3">
                  {[
                    {
                      title: "Frame size is fixed",
                      body: "Your skeletal structure — bone length, joint width, and wrist/ankle circumference — is genetic and cannot be changed through diet or training. An endomorph will always have a larger frame than an ectomorph of the same height.",
                    },
                    {
                      title: "Body composition is highly changeable",
                      body: "While frame size is fixed, the fat and muscle on top of that frame are entirely within your control. An endomorph can achieve a lean, muscular physique through consistent training and a well-structured diet. An ectomorph can build significant muscle mass with proper programming and nutrition.",
                    },
                    {
                      title: "Metabolism adapts over time",
                      body: "Metabolic rate is influenced by muscle mass, activity level, and hormonal environment — all of which change with training and diet. Building more muscle increases your basal metabolic rate (BMR), meaning an endomorph who builds muscle will burn more calories at rest over time.",
                    },
                    {
                      title: "Consistency beats somatotype",
                      body: "Longitudinal studies consistently show that adherence to training and nutrition protocols is a far stronger predictor of body composition outcomes than initial somatotype. Your body type is a starting condition, not a ceiling.",
                    },
                  ].map(item => (
                    <div key={item.title} className="p-4 rounded-xl bg-muted/40 border border-border">
                      <p className="font-bold text-foreground mb-1">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Quick-reference card */}
              <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Body Type Quick Guide</p>
                <div className="space-y-3">
                  {[
                    { emoji: "⚡", type: "Ectomorph", tip: "Eat more, lift heavy, minimize cardio" },
                    { emoji: "💪", type: "Mesomorph", tip: "Balanced approach works well" },
                    { emoji: "🔥", type: "Endomorph", tip: "Prioritize cardio, watch carbs" },
                  ].map((row, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                      <span className="text-2xl flex-shrink-0">{row.emoji}</span>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground text-sm">{row.type}</p>
                        <p className="text-xs text-muted-foreground">{row.tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why use this tool */}
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Why Use This Tool</p>
                {[
                  { icon: <Zap className="w-4 h-4 text-amber-500" />, text: "Personalized training & nutrition tips" },
                  { icon: <Shield className="w-4 h-4 text-amber-500" />, text: "No data stored — 100% private" },
                  { icon: <BadgeCheck className="w-4 h-4 text-amber-500" />, text: "Frame size + BMI classification" },
                  { icon: <Smartphone className="w-4 h-4 text-amber-500" />, text: "Works on phone, tablet, desktop" },
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">{t.icon}</div>
                    <p className="text-sm text-muted-foreground">{t.text}</p>
                  </div>
                ))}
              </div>

              {/* On This Page */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">On This Page</p>
                <ul className="space-y-1.5">
                  {[
                    { label: "Overview", href: "#overview" },
                    { label: "Calculator", href: "#calculator" },
                    { label: "Body Type Comparison", href: "#comparison" },
                    { label: "FAQ", href: "#faq" },
                    { label: "Science & Background", href: "#science" },
                  ].map((item) => (
                    <li key={item.href}>
                      <a href={item.href} className="text-sm text-muted-foreground hover:text-amber-500 transition-colors block py-0.5">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Share */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                <p className="text-sm font-bold text-foreground mb-3">Share this calculator</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-colors"
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              {/* Related tools */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Related Tools</p>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((t, i) => (
                    <Link
                      key={i}
                      href={`/tools/${t.slug}`}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all border border-transparent hover:border-border"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `hsl(${t.color} 80% 50% / 0.1)`, color: `hsl(${t.color} 70% 45%)` }}
                      >
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
