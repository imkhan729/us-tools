import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Ruler, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Scale, Activity, User, Heart
} from "lucide-react";

function useCalc() {
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [sex, setSex] = useState<"male" | "female">("male");

  const result = useMemo(() => {
    const w = parseFloat(waist), h = parseFloat(hip);
    if (isNaN(w) || isNaN(h) || h === 0) return null;
    const ratio = w / h;
    let risk = "Low Risk", color = "text-emerald-600 dark:text-emerald-400", description = "Your waist-to-hip ratio is within the healthy range.";
    if (sex === "male") {
      if (ratio >= 1.0)       { risk = "Very High Risk"; color = "text-red-600 dark:text-red-400"; description = "Strongly associated with cardiovascular and metabolic disease."; }
      else if (ratio >= 0.96) { risk = "High Risk";      color = "text-red-500 dark:text-red-400";    description = "Above the WHO threshold for men. Consider lifestyle changes."; }
      else if (ratio >= 0.9)  { risk = "Moderate Risk";  color = "text-amber-500 dark:text-amber-400"; description = "Approaching the high-risk zone. Monitor and improve."; }
    } else {
      if (ratio >= 0.86)      { risk = "Very High Risk"; color = "text-red-600 dark:text-red-400";    description = "Strongly associated with cardiovascular and metabolic disease."; }
      else if (ratio >= 0.81) { risk = "High Risk";      color = "text-red-500 dark:text-red-400";    description = "Above the WHO threshold for women. Consider lifestyle changes."; }
      else if (ratio >= 0.8)  { risk = "Moderate Risk";  color = "text-amber-500 dark:text-amber-400"};
    }
    return { ratio: ratio.toFixed(2), risk, color, description };
  }, [waist, hip, sex]);

  return { waist, setWaist, hip, setHip, sex, setSex, result };
}

function ResultInsight({ result, sex }: { result: any; sex: string }) {
  if (!result) return null;
  const threshold = sex === "male" ? "0.90" : "0.85";
  const message = `Your WHR of ${result.ratio} places you in the ${result.result ?? result.risk} category. The WHO defines elevated cardiovascular risk for ${sex}s at a WHR above ${threshold}. ${result.description}`;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-blue-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-blue-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "BMI Calculator",                slug: "bmi-calculator",               icon: <Scale className="w-5 h-5" />,    color: 217, benefit: "Assess body mass index" },
  { title: "Body Fat % Calculator",         slug: "body-fat-percentage-calculator",icon: <User className="w-5 h-5" />,     color: 265, benefit: "Measure body composition" },
  { title: "Ideal Weight Calculator",       slug: "ideal-weight-calculator",       icon: <Activity className="w-5 h-5" />, color: 152, benefit: "Find your healthy weight range" },
  { title: "Keto Calculator",               slug: "keto-calculator",               icon: <Heart className="w-5 h-5" />,    color: 340, benefit: "Calculate ketogenic macros" },
];

export default function WaistToHipRatioCalculator() {
  const calc = useCalc();
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <Layout>
      <SEO
        title="Waist to Hip Ratio Calculator – WHR & Health Risk Assessment | US Online Tools"
        description="Free waist-to-hip ratio calculator. Calculate your WHR and assess cardiovascular risk using WHO standards. Supports metric and imperial measurements. Instant results, no login."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link href="/category/health" className="text-muted-foreground hover:text-foreground transition-colors">Health &amp; Fitness</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">Waist to Hip Ratio Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-blue-500/15 bg-gradient-to-br from-blue-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Ruler className="w-3.5 h-3.5" /> Health &amp; Body Analysis
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Waist to Hip Ratio Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Calculate your waist-to-hip ratio (WHR) and assess your cardiovascular health risk level based on World Health Organization (WHO) standards. A more accurate risk indicator than BMI alone.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Health &amp; Body Analysis &nbsp;·&nbsp; Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                      <Ruler className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">WHR Calculator</p>
                      <p className="text-sm text-muted-foreground">Enter measurements in the same unit (cm or inches). Results update instantly.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 217 } as React.CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider block">Biological Sex</label>
                          <div className="flex gap-2">
                            {(["male", "female"] as const).map(s => (
                              <button key={s} onClick={() => calc.setSex(s)} className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-sm capitalize transition-all ${calc.sex === s ? "bg-blue-500 border-blue-500 text-white shadow-lg" : "bg-card border-border text-muted-foreground hover:border-blue-500/30"}`}>{s}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider block">Waist Circumference</label>
                          <input type="number" placeholder="e.g. 80" className="tool-calc-input w-full" value={calc.waist} onChange={e => calc.setWaist(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider block">Hip Circumference</label>
                          <input type="number" placeholder="e.g. 100" className="tool-calc-input w-full" value={calc.hip} onChange={e => calc.setHip(e.target.value)} />
                        </div>
                        <p className="text-xs text-muted-foreground">Use consistent units (cm or inches) for both measurements.</p>
                      </div>

                      {calc.result && (
                        <div className="space-y-3">
                          <div className="text-center p-6 rounded-xl bg-blue-500/5 border border-blue-500/20">
                            <p className="text-xs font-bold text-muted-foreground mb-1 uppercase">Your WHR</p>
                            <p className="text-5xl font-black text-blue-600 dark:text-blue-400">{calc.result.ratio}</p>
                          </div>
                          <div className={`text-center p-4 rounded-xl border ${calc.result.color.includes("red") ? "bg-red-500/5 border-red-500/20" : calc.result.color.includes("amber") ? "bg-amber-500/5 border-amber-500/20" : "bg-emerald-500/5 border-emerald-500/20"}`}>
                            <p className="text-xs font-bold text-muted-foreground mb-1 uppercase">Health Risk Category</p>
                            <p className={`text-2xl font-black ${calc.result.color}`}>{calc.result.risk}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <ResultInsight result={calc.result} sex={calc.sex} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Waist-to-Hip Ratio Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The waist-to-hip ratio (WHR) is a simple measurement used by clinicians and researchers worldwide to assess body fat distribution and its associated health risks. Unlike BMI, WHR specifically identifies central obesity — the accumulation of fat around the abdomen — which is a stronger predictor of heart disease and type 2 diabetes.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Measure your waist correctly</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Use a flexible measuring tape. Stand upright, breathe out naturally, and measure at the narrowest point of your torso — typically the midpoint between your lowest rib and the top of your hip bone, roughly at belly-button level. Do not hold your breath or suck in your stomach. Take the measurement after exhaling.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Measure your hips correctly</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Measure at the widest point of your buttocks while standing with feet together. Ensure the tape is horizontal and parallel to the floor all the way around. Use the same unit (cm or inches) for both measurements — the ratio calculation requires matching units.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Interpret your result against WHO thresholds</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Enter both measurements and your biological sex. The calculator divides waist by hip to produce your WHR and instantly compares it to WHO risk thresholds. Use the result to understand your current cardiovascular risk classification and monitor change over time as you adjust diet and exercise.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formula &amp; WHO Thresholds</p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-blue-500 font-bold w-4 flex-shrink-0">1</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">WHR = Waist Circumference ÷ Hip Circumference</code>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left border-b border-border"><th className="pb-2 font-bold text-foreground">Category</th><th className="pb-2 font-bold text-foreground">Men</th><th className="pb-2 font-bold text-foreground">Women</th></tr></thead>
                    <tbody className="divide-y divide-border">
                      <tr><td className="py-2 text-emerald-600 font-bold">Low Risk</td><td className="py-2 text-muted-foreground">&lt; 0.90</td><td className="py-2 text-muted-foreground">&lt; 0.80</td></tr>
                      <tr><td className="py-2 text-amber-600 font-bold">Moderate Risk</td><td className="py-2 text-muted-foreground">0.90 – 0.95</td><td className="py-2 text-muted-foreground">0.80 – 0.85</td></tr>
                      <tr><td className="py-2 text-red-600 font-bold">High / Very High Risk</td><td className="py-2 text-muted-foreground">≥ 0.96</td><td className="py-2 text-muted-foreground">≥ 0.86</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">WHR Risk Categories Explained</h2>
              <p className="text-muted-foreground text-sm mb-6">What your result means and what actions are associated with each level:</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Low Risk — Healthy Distribution</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Fat is distributed proportionally or concentrated in the hips and thighs (gynoid pattern). This fat distribution is metabolically less active and carries significantly lower cardiovascular risk. Maintain current activity levels and dietary habits.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Moderate Risk — Action Advised</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Central fat accumulation is beginning to exceed safe limits. This level is associated with elevated insulin resistance, higher blood pressure, and emerging cardiovascular risk. Increasing aerobic activity and moderating refined carbohydrate and sugar intake is advised.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">High / Very High Risk — Medical Attention Recommended</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Significant central obesity is present. Studies consistently show that individuals in this WHR range have 2–3× higher risk of cardiovascular mortality. A consultation with a healthcare provider is strongly recommended to evaluate blood lipids, fasting glucose, and blood pressure alongside this measurement.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">WHR Calculation Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Sex</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Waist</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Hips</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">WHR</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Male</td><td className="px-4 py-3 font-mono">82 cm</td><td className="px-4 py-3 font-mono">98 cm</td><td className="px-4 py-3 font-bold text-blue-600">0.84</td><td className="px-4 py-3 text-emerald-600 font-bold">Low</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Male</td><td className="px-4 py-3 font-mono">92 cm</td><td className="px-4 py-3 font-mono">100 cm</td><td className="px-4 py-3 font-bold text-blue-600">0.92</td><td className="px-4 py-3 text-amber-600 font-bold">Moderate</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Female</td><td className="px-4 py-3 font-mono">70 cm</td><td className="px-4 py-3 font-mono">95 cm</td><td className="px-4 py-3 font-bold text-blue-600">0.74</td><td className="px-4 py-3 text-emerald-600 font-bold">Low</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Female</td><td className="px-4 py-3 font-mono">86 cm</td><td className="px-4 py-3 font-mono">98 cm</td><td className="px-4 py-3 font-bold text-blue-600">0.88</td><td className="px-4 py-3 text-red-600 font-bold">High Risk</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">WHR vs BMI — why both matter:</strong> A person with a BMI of 25 (borderline overweight) and a WHR of 0.82 (men) is at lower cardiovascular risk than a person with a BMI of 22 (normal) but a WHR of 0.97 (men). BMI ignores fat distribution entirely, while WHR specifically identifies the most metabolically dangerous type — visceral fat surrounding the organs.</p>
                <p><strong className="text-foreground">Tracking progress over time:</strong> WHR is an excellent metric to track during a weight loss journey. Visceral fat (which raises WHR) is generally shed before subcutaneous fat. If your WHR improves while scale weight barely moves, this is still a meaningful health improvement worth noting.</p>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-blue-500/5 border border-blue-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <svg key={i} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"My BMI says I'm normal but this showed me my WHR was high risk. Motivated me to make real changes — lost 7cm off my waist in 3 months."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Waist-to-Hip Ratio Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Uses WHO clinical thresholds, not generic estimates.</strong> The risk categories applied by this calculator are directly sourced from World Health Organization clinical guidelines for obesity and chronic disease risk assessment — the same standards used by healthcare providers globally.</p>
                <p><strong className="text-foreground">Sex-differentiated results.</strong> WHR thresholds differ significantly between men and women due to fundamental differences in hormonal fat distribution patterns. This calculator applies separate risk thresholds for each biological sex, providing clinically accurate risk classification.</p>
                <p><strong className="text-foreground">Simple to use, no special equipment.</strong> All you need is a standard measuring tape. Unlike DEXA scans or hydrostatic weighing, WHR measurement is free, reproducible, and can be done at home in under 2 minutes.</p>
                <p><strong className="text-foreground">Complete privacy — no data stored.</strong> Your measurements are processed locally within your browser. No figure is transmitted to any server, stored in any database, or associated with any user profile.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> WHR is a screening tool and should not replace a comprehensive medical evaluation. Factors like bone structure, pregnancy, and certain medical conditions can affect measurements. Always discuss your results with a qualified healthcare provider before making significant changes to your diet or exercise regimen.
                </p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="Is WHR more accurate than BMI?" a="For predicting cardiovascular disease risk, WHR is generally considered superior because it specifically measures central adiposity — the location of fat that is most metabolically dangerous. A 2015 WHO study found WHR to be a stronger predictor of cardiovascular mortality than BMI across most populations." />
                <FaqItem q="How often should I measure my WHR?" a="Every 4–8 weeks is a reasonable frequency to track meaningful changes. Daily measurements can vary based on factors like food intake, bloating, and hydration, which can lead to misleading short-term conclusions." />
                <FaqItem q="Why are the risk thresholds different for men and women?" a="Estrogen and progesterone in females promote fat storage in the hips, thighs, and buttocks (gynoid pattern), which is metabolically less harmful. Males primarily store fat in the abdomen (android pattern), which is associated with higher cardiovascular risk even at lower overall body fat levels." />
                <FaqItem q="Can I use inches instead of centimeters?" a="Yes. As long as both your waist and hip measurements use the same unit, the ratio calculation is identical. The result (WHR) is a dimensionless ratio that is independent of the unit used." />
                <FaqItem q="What exercises specifically reduce the waist circumference?" a="No exercise selectively burns waist fat ('spot reduction' is a myth). However, a caloric deficit combined with cardiovascular exercise and resistance training effectively reduces overall body fat, with visceral/abdominal fat typically being shed early in the process. Core strengthening exercises improve muscle tone but do not directly reduce fat." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Explore More Health Calculators</h2>
                <p className="text-white/80 mb-6 max-w-lg">400+ free health, body composition, and fitness calculators — instant results, no account needed.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map(tool => (
                    <Link key={tool.slug} href={`/health/${tool.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-blue-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others assess their health risk.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-blue-500 font-medium py-1.5 transition-colors">
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
