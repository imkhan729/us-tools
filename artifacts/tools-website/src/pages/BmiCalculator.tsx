import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Activity, Scale, Heart, Ruler,
  ArrowRight, Zap, Smartphone, Shield, BadgeCheck, Lock, Copy, Check,
  Calculator, TrendingUp, Star, Lightbulb
} from "lucide-react";

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-blue-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-blue-500">
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
  { title: "BMR Calculator", slug: "bmr-calculator", icon: <Activity className="w-4 h-4" />, color: 217, benefit: "Find your base metabolic rate" },
  { title: "Ideal Weight Calculator", slug: "ideal-weight-calculator", icon: <Scale className="w-4 h-4" />, color: 152, benefit: "Find your healthy weight range" },
  { title: "Calorie Calculator", slug: "calorie-intake-calculator", icon: <Heart className="w-4 h-4" />, color: 340, benefit: "Calculate daily calorie needs" },
  { title: "Body Fat Calculator", slug: "body-fat-calculator", icon: <Ruler className="w-4 h-4" />, color: 275, benefit: "Estimate your body fat %" },
  { title: "Age Calculator", slug: "age-calculator", icon: <Calculator className="w-4 h-4" />, color: 45, benefit: "Calculate your exact age" },
  { title: "Weight Converter", slug: "weight-converter", icon: <Scale className="w-4 h-4" />, color: 25, benefit: "Convert kg, lbs, stone instantly" },
];

// ── Main Component ──
export default function BmiCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [copied, setCopied] = useState(false);

  const calcBmi = () => {
    if (unit === "metric") {
      const h = parseFloat(height) / 100;
      const w = parseFloat(weight);
      if (!h || !w || h <= 0) return null;
      return w / (h * h);
    } else {
      const totalIn = parseFloat(heightFt) * 12 + parseFloat(heightIn || "0");
      const w = parseFloat(weight);
      if (!totalIn || !w) return null;
      return (w / (totalIn * totalIn)) * 703;
    }
  };

  const bmi = calcBmi();

  const getCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500", bar: "bg-blue-500", pct: 15 };
    if (bmi < 25)   return { label: "Normal weight", color: "text-emerald-500", bar: "bg-emerald-500", pct: 40 };
    if (bmi < 30)   return { label: "Overweight", color: "text-yellow-500", bar: "bg-yellow-500", pct: 65 };
    return { label: "Obese", color: "text-red-500", bar: "bg-red-500", pct: 90 };
  };

  const cat = bmi ? getCategory(bmi) : null;

  const inputCls = "w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-medium focus:outline-none focus:border-blue-500 transition-colors";

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="BMI Calculator – Calculate Body Mass Index Free, Metric & Imperial | US Online Tools"
        description="Free BMI calculator for adults. Calculate your Body Mass Index in metric (cm/kg) or imperial (ft/lb) units instantly. See your weight category — underweight, normal, overweight, or obese."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health &amp; Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">BMI Calculator</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-blue-500/15 bg-gradient-to-br from-blue-500/5 via-card to-indigo-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          {/* Category pill */}
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Activity className="w-3.5 h-3.5" />
            Health &amp; Fitness
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            BMI Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate your Body Mass Index instantly using metric (cm/kg) or imperial (ft/lb) units. See your BMI score, weight category, and reference chart in seconds — no signup needed.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Results
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Shield className="w-3.5 h-3.5" /> Metric &amp; Imperial
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>

          {/* Meta */}
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Health &amp; Fitness &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── 2. TOOL WIDGET ── */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-400 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">BMI Calculator</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  {/* Unit toggle */}
                  <div className="flex rounded-xl border-2 border-border overflow-hidden">
                    {(["metric", "imperial"] as const).map(u => (
                      <button
                        key={u}
                        onClick={() => setUnit(u)}
                        className={`flex-1 py-3 font-black uppercase text-sm tracking-wider transition-colors ${unit === u ? "bg-blue-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                      >
                        {u === "metric" ? "Metric (cm / kg)" : "Imperial (ft / lb)"}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Height */}
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wider text-foreground mb-2">
                        Height {unit === "metric" ? "(cm)" : "(ft & in)"}
                      </label>
                      {unit === "metric" ? (
                        <input
                          type="number"
                          placeholder="e.g. 175"
                          className={inputCls}
                          value={height}
                          onChange={e => setHeight(e.target.value)}
                        />
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="ft"
                            className={inputCls}
                            value={heightFt}
                            onChange={e => setHeightFt(e.target.value)}
                          />
                          <input
                            type="number"
                            placeholder="in"
                            className={inputCls}
                            value={heightIn}
                            onChange={e => setHeightIn(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                    {/* Weight */}
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wider text-foreground mb-2">
                        Weight {unit === "metric" ? "(kg)" : "(lbs)"}
                      </label>
                      <input
                        type="number"
                        placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
                        className={inputCls}
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Result */}
                  {bmi && cat ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-muted/40 rounded-xl p-6 border-2 border-border space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Your BMI</p>
                          <p className="text-5xl font-black text-foreground mt-1">{bmi.toFixed(1)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Category</p>
                          <p className={`text-2xl font-black mt-1 ${cat.color}`}>{cat.label}</p>
                        </div>
                      </div>
                      {/* Visual bar */}
                      <div className="space-y-1">
                        <div className="h-3 rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 via-yellow-400 to-red-400 relative overflow-hidden">
                          <div
                            className="absolute top-0 bottom-0 w-1 bg-foreground rounded-full shadow"
                            style={{ left: `${Math.min(cat.pct, 97)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
                        </div>
                      </div>
                      {/* Insight */}
                      <div className="mt-2 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            Your BMI of {bmi.toFixed(1)} falls in the <span className={`font-bold ${cat.color}`}>{cat.label}</span> category.{" "}
                            {cat.label === "Underweight" && "Consider speaking with a healthcare provider about healthy ways to reach your target weight."}
                            {cat.label === "Normal weight" && "You're within the healthy BMI range for most adults. Maintain your current habits with regular activity and balanced nutrition."}
                            {cat.label === "Overweight" && "Modest lifestyle adjustments — more movement and balanced nutrition — can help bring your BMI into the normal range."}
                            {cat.label === "Obese" && "Medical consultation is recommended to discuss a safe and effective plan for improving your health metrics."}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-muted/30 rounded-xl p-8 text-center border-2 border-dashed border-border">
                      <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="font-bold text-muted-foreground">Enter your height and weight to calculate BMI</p>
                    </div>
                  )}

                  {/* Reference table */}
                  <div className="rounded-xl border-2 border-border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="py-3 px-4 text-left font-black uppercase tracking-wider text-foreground">BMI Range</th>
                          <th className="py-3 px-4 text-left font-black uppercase tracking-wider text-foreground">Category</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {[
                          { range: "Below 18.5", label: "Underweight", color: "text-blue-500" },
                          { range: "18.5 – 24.9", label: "Normal weight", color: "text-emerald-500" },
                          { range: "25.0 – 29.9", label: "Overweight", color: "text-yellow-500" },
                          { range: "30.0 and above", label: "Obese", color: "text-red-500" },
                        ].map(r => (
                          <tr key={r.range} className="bg-card">
                            <td className="py-3 px-4 font-mono font-bold text-foreground">{r.range}</td>
                            <td className={`py-3 px-4 font-bold ${r.color}`}>{r.label}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 3. HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the BMI Calculator</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                This BMI calculator supports both metric and imperial units, making it suitable for users anywhere in the world. Whether you prefer centimeters and kilograms or feet, inches, and pounds, here's exactly how to get an accurate reading in four simple steps.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Choose metric or imperial units</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Click either the <strong className="text-foreground">Metric (cm / kg)</strong> or <strong className="text-foreground">Imperial (ft / lb)</strong> toggle at the top of the calculator. The input fields will adapt immediately — metric mode shows a single centimeter field for height, while imperial mode splits into separate feet and inches fields. Your previously entered values are cleared when switching units to avoid accidental cross-unit calculations.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter your height</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      In metric mode, type your height in centimeters — for example, 175 for 5'9". In imperial mode, enter feet in the first box and remaining inches in the second. For example, 5 feet 9 inches would be "5" and "9". Decimal values are supported in metric mode (e.g. 175.5 cm). The inches field in imperial mode accepts values from 0 to 11.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter your weight</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Type your weight in kilograms (metric) or pounds (imperial). Use your most recent measurement, ideally taken in the morning before meals for the most consistent reading. Decimal values are fully supported — for example, 70.5 kg or 154.3 lbs. Avoid rounding to the nearest 5 or 10 as this can meaningfully shift your BMI result near category boundaries.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">4</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Read your BMI score and category</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Your BMI score appears instantly as you type, displayed to one decimal place. Below the score, a color-coded bar shows where your result falls across the four standard WHO weight categories. A plain-English interpretation sentence gives you immediate context — no medical knowledge required. The reference table at the bottom of the calculator lets you compare your result against all four BMI ranges at a glance.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formulas</p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-blue-500 font-bold w-16 flex-shrink-0 text-xs">Metric</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">BMI = Weight(kg) ÷ Height(m)²</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-indigo-500 font-bold w-16 flex-shrink-0 text-xs">Imperial</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">BMI = (Weight(lb) ÷ Height(in)²) × 703</code>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">The metric formula</strong> is the standard established by the World Health Organization. Height in centimeters is first divided by 100 to convert to meters, then squared. Weight in kilograms is divided by that squared value. For example, a person who is 175 cm (1.75 m) and 70 kg has a BMI of 70 ÷ (1.75²) = 70 ÷ 3.0625 ≈ 22.9.
                  </p>
                  <p>
                    <strong className="text-foreground">The imperial formula</strong> applies a conversion factor of 703 to produce the same numeric result as the metric version. Total height in inches is calculated by multiplying feet by 12 and adding remaining inches. For example, 5'9" = 69 inches. A 160 lb person at 5'9" has a BMI of (160 ÷ 69²) × 703 = (160 ÷ 4761) × 703 ≈ 23.6.
                  </p>
                </div>
              </div>
            </section>

            {/* ── 4. RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">BMI Categories &amp; Result Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">What each BMI range means for your health:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Underweight — BMI below 18.5</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">A BMI below 18.5 indicates that a person may not be getting adequate nutrition for their height. This can be associated with nutritional deficiencies, weakened immune function, bone density loss, and in women, disrupted reproductive health. Underweight status can result from inadequate caloric intake, underlying medical conditions, or high physical activity levels. If you fall in this range, consulting a healthcare provider or registered dietitian is recommended to identify the cause and develop a plan to achieve a healthy weight safely. Do not attempt to address underweight status through unguided rapid weight gain, which carries its own health risks.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Normal Weight — BMI 18.5 to 24.9</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">A BMI between 18.5 and 24.9 is considered the healthy range for most adults according to the World Health Organization. People in this range generally have a lower risk of weight-related chronic diseases including type 2 diabetes, cardiovascular disease, and certain cancers. That said, BMI is not the only indicator of good health — diet quality, physical fitness, sleep, and stress levels all play major roles. Maintaining a normal BMI through a balanced diet and regular physical activity is associated with longer life expectancy and better quality of life across multiple studies.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Overweight — BMI 25.0 to 29.9</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">A BMI in the overweight range signals increased risk for metabolic conditions including hypertension, high cholesterol, insulin resistance, and sleep apnea. However, this range is also where the limitations of BMI are most apparent — many people with BMIs of 25–29.9 are perfectly healthy, particularly those with significant muscle mass. Athletes, bodybuilders, and individuals with large bone structures may register as overweight on the BMI scale without carrying excess body fat. If you're in this category, waist circumference and body fat percentage are useful additional metrics. Modest lifestyle adjustments — 30 minutes of moderate activity most days and reducing processed food intake — can often bring BMI back into the normal range.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Obese — BMI 30.0 and above</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">A BMI of 30 or higher is classified as obese and is associated with significantly elevated risk of type 2 diabetes, heart disease, stroke, certain cancers, joint problems, and sleep disorders. Obesity is further subdivided into Class I (30–34.9), Class II (35–39.9), and Class III or "severe obesity" (40+). Medical consultation is strongly recommended for anyone in this range, as a healthcare professional can provide personalized guidance on safe weight loss targets and whether medical interventions such as prescription medications or bariatric evaluation may be appropriate. Attempting significant weight loss without professional guidance can lead to nutritional deficiencies and muscle loss.</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                BMI thresholds for overweight and obesity may differ for certain ethnic groups. Research has shown that people of Asian descent may face increased metabolic risk at lower BMI values, and some health organizations recommend adjusted cutoffs (e.g., overweight at BMI ≥ 23 for Asian populations). Always discuss your specific results with a qualified healthcare provider who can account for your individual background and risk factors.
              </p>
            </section>

            {/* ── 5. QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Height</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Weight</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">BMI</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Category</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">5'9" (175 cm)</td>
                      <td className="px-4 py-3 font-mono text-foreground">160 lb (73 kg)</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">23.6</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">Normal</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Mid-range healthy weight</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">5'4" (163 cm)</td>
                      <td className="px-4 py-3 font-mono text-foreground">120 lb (54 kg)</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">20.6</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">Normal</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Lower-normal range</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">6'0" (183 cm)</td>
                      <td className="px-4 py-3 font-mono text-foreground">220 lb (100 kg)</td>
                      <td className="px-4 py-3 font-bold text-yellow-600 dark:text-yellow-400">29.8</td>
                      <td className="px-4 py-3 font-bold text-yellow-600 dark:text-yellow-400">Overweight</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Near overweight boundary</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">5'5" (165 cm)</td>
                      <td className="px-4 py-3 font-mono text-foreground">100 lb (45 kg)</td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">16.6</td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">Underweight</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Medical review advised</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">5'7" (170 cm)</td>
                      <td className="px-4 py-3 font-mono text-foreground">250 lb (113 kg)</td>
                      <td className="px-4 py-3 font-bold text-red-600 dark:text-red-400">39.2</td>
                      <td className="px-4 py-3 font-bold text-red-600 dark:text-red-400">Obese Class II</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Consult a healthcare provider</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Example 1 – Average adult male (5'9", 160 lb):</strong> This represents a person close to the statistical average height and weight for adult men in many Western countries. A BMI of 23.6 sits comfortably in the middle of the normal range (18.5–24.9), suggesting a well-balanced ratio of weight to height. For someone in this category, maintaining current weight through regular physical activity and balanced nutrition is typically all that is needed to stay healthy over the long term.
                </p>
                <p>
                  <strong className="text-foreground">Example 2 – Average adult female (5'4", 120 lb):</strong> With a BMI of 20.6, this falls in the healthy lower-middle portion of the normal range. This is a common profile for physically active individuals who maintain a diet with adequate calories but without excess. While the BMI looks healthy, it is still important to ensure caloric intake is sufficient to support energy expenditure — particularly for those engaged in endurance sports or strength training.
                </p>
                <p>
                  <strong className="text-foreground">Example 3 – Tall, heavier individual (6'0", 220 lb):</strong> A BMI of 29.8 places this person just below the obese threshold. This is a common profile for taller men who carry extra weight but may also have notable muscle mass. Before drawing conclusions from this result alone, waist circumference and body fat percentage are worth measuring — a waist under 40 inches for men generally indicates lower metabolic risk even at higher BMI values. Modest weight reduction of 10–15 lbs could bring the BMI into the normal range.
                </p>
                <p>
                  <strong className="text-foreground">Example 4 – High BMI classification (5'7", 250 lb):</strong> A BMI of 39.2 places this individual in the Class II obesity range (35–39.9), one step below severe obesity. At this level, the elevated risk of chronic diseases is clinically significant. A structured weight management program overseen by a healthcare team — potentially including dietary counseling, supervised exercise, and evaluation for medical interventions — is the recommended course of action. Even a 5–10% reduction in body weight has been shown to produce meaningful improvements in blood pressure, cholesterol, and blood sugar levels.
                </p>
              </div>

              {/* Testimonial */}
              <div className="mt-6 p-5 rounded-xl bg-blue-500/5 border border-blue-500/15">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Simple, accurate, and works perfectly on my phone. I use it to check my progress every few weeks — the visual bar makes it really easy to see where I'm headed."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* ── 6. WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This BMI Calculator?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">It's completely free with no hidden upsells.</strong> Many health tools online are free to open but quickly push you toward premium subscriptions for features like history tracking, PDF exports, or "advanced" metrics. This BMI calculator has no paywall, no subscription tier, and no registration wall — ever. You get the full, accurate calculation immediately, every time you visit. Bookmark it, share it, and rely on it freely.
                </p>
                <p>
                  <strong className="text-foreground">Your data is never collected or stored.</strong> Every calculation runs entirely inside your browser using JavaScript. The height and weight values you enter are never transmitted to any server, stored in any database, or associated with any user profile. This is important for health data in particular, which many people prefer to keep entirely private. When you close the browser tab, your values disappear immediately — there is no record of your input anywhere.
                </p>
                <p>
                  <strong className="text-foreground">Both metric and imperial units are fully supported.</strong> Most BMI tools online default to one unit system and require manual conversion for the other. This calculator natively supports both — select your preferred system with a single click and enter your measurements directly without any mental math. Imperial mode intelligently handles the feet-plus-inches format so you don't need to convert to total inches yourself.
                </p>
                <p>
                  <strong className="text-foreground">Instant visual feedback with the color-coded bar.</strong> Rather than displaying just a number, this calculator includes a gradient progress bar that shows where your BMI falls across the full spectrum from underweight to obese. This visual representation makes the result immediately intuitive — you can see at a glance not just which category you're in, but how close you are to the boundary of neighboring categories. This is particularly useful for goal-setting during a weight management journey.
                </p>
                <p>
                  <strong className="text-foreground">An integrated reference table is included.</strong> The WHO BMI reference table is displayed directly below your result, so you can see all four categories and their ranges in context. This eliminates the need to cross-reference another page or source. The table also serves as a quick educational resource for anyone learning about BMI for the first time.
                </p>
              </div>

              {/* Note / Limitation */}
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Important note:</strong> BMI is a screening tool, not a diagnostic measure. It does not account for muscle mass, bone density, age, sex, or ethnicity — all of which significantly affect what constitutes a healthy body composition. A highly muscular athlete may have a BMI classified as overweight or obese while carrying very little body fat. Conversely, a person with a "normal" BMI may still carry excess visceral fat that poses health risks. Always consult a qualified healthcare professional before making medical or dietary decisions based on your BMI result.
                </p>
              </div>
            </section>

            {/* ── 7. FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="What is a healthy BMI for adults?"
                  a="For most adults aged 20 and older, a BMI between 18.5 and 24.9 is considered healthy by the World Health Organization. A BMI below 18.5 is classified as underweight, 25.0 to 29.9 as overweight, and 30.0 or higher as obese. These ranges apply broadly to adults of all sexes but may need adjustment based on ethnicity — research suggests that Asian populations face increased health risks at lower BMI thresholds, closer to 23.0 for overweight and 27.5 for obesity."
                />
                <FaqItem
                  q="Is BMI accurate for athletes and muscular people?"
                  a="BMI is not a reliable measure for highly muscular individuals such as athletes, bodybuilders, and physically active people with above-average lean muscle mass. Muscle is denser than fat, meaning a muscular person can weigh more for their height and register a higher BMI without carrying excess body fat. In such cases, body fat percentage — measured through DEXA scan, hydrostatic weighing, or skinfold calipers — is a much more meaningful indicator of body composition and health risk."
                />
                <FaqItem
                  q="What is the BMI formula?"
                  a="There are two versions depending on your unit system. The metric formula is: BMI = weight in kilograms ÷ (height in meters)². For example, 70 kg at 1.75 m gives BMI = 70 ÷ 3.0625 ≈ 22.9. The imperial formula is: BMI = (weight in pounds ÷ (height in inches)²) × 703. The multiplier 703 converts from lb/in² to the equivalent kg/m² scale. Both formulas produce the same result when the correct unit inputs are used."
                />
                <FaqItem
                  q="Can children use this calculator?"
                  a="This calculator is designed specifically for adults aged 20 and older. BMI interpretation for children and teenagers (ages 2–19) is fundamentally different — rather than fixed cutoffs, pediatric BMI is evaluated using age- and sex-specific percentile charts developed by the CDC. A BMI at the 85th percentile or above indicates overweight for children, and 95th percentile or above indicates obesity. Using adult BMI thresholds for children and teens will produce misleading and potentially harmful conclusions."
                />
                <FaqItem
                  q="Does BMI account for body fat percentage?"
                  a="No — BMI is a ratio of weight to height squared and does not directly measure body fat. Two people with identical BMIs can have very different body fat percentages depending on their muscle mass, bone density, and fat distribution. BMI is best used as a general population-level screening tool rather than an individual diagnostic measure. For a more accurate assessment of body composition, consider combining BMI with waist circumference measurement, waist-to-hip ratio, or a professional body fat analysis."
                />
                <FaqItem
                  q="What BMI is considered obese?"
                  a="A BMI of 30.0 or higher is classified as obese by the WHO and most major health organizations. Obesity is further subdivided into three classes: Class I (30.0–34.9), Class II (35.0–39.9), and Class III — also called severe or morbid obesity — at 40.0 and above. Each class carries progressively higher risk for obesity-related conditions including type 2 diabetes, cardiovascular disease, hypertension, and certain cancers. Medical consultation becomes increasingly important at higher obesity classes."
                />
                <FaqItem
                  q="How often should I check my BMI?"
                  a="For most adults, checking BMI once a month is sufficient to monitor trends over time without becoming overly fixated on daily fluctuations. Body weight naturally varies by 1–3 lbs throughout the day due to hydration, meals, and activity — so daily BMI checks can be misleading. A monthly check, measured at the same time of day under similar conditions (e.g., morning, before eating), provides the most meaningful trend data for tracking weight management progress. Some people check quarterly during routine health reviews."
                />
                <FaqItem
                  q="Is BMI different for men and women?"
                  a="The standard WHO BMI formula and category thresholds are the same for both men and women. However, in practice, body composition differs significantly between sexes — women typically carry more essential fat (12–20%) compared to men (2–5%), and fat is distributed differently. This means that a woman and a man with identical BMIs may have different body fat percentages and different associated health risks. Some researchers advocate for sex-specific BMI thresholds, though no universal alternative standard has yet replaced the current WHO classification in clinical use."
                />
              </div>
            </section>

            {/* ── 8. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Explore More Health Tools</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Calculate your BMR, ideal weight, daily calorie needs, and body fat percentage — all free, all instant, no signup needed.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-blue-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others calculate their BMI easily.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
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
                    "How to Use",
                    "Result Interpretation",
                    "Quick Examples",
                    "Why Choose This",
                    "FAQ",
                  ].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-blue-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-blue-500/40 flex-shrink-0" />
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
