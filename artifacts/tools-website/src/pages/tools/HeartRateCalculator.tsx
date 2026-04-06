import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Heart, CheckCircle, ChevronDown, Share2, Star, Shield, Zap, Clock } from "lucide-react";
import { Layout } from "../../components/Layout";
import { SEO } from "../../components/SEO";

const zones = [
  { zone: 1, name: "Very Light", pctLow: 50, pctHigh: 60, color: "bg-sky-400", textColor: "text-sky-600", desc: "Warm up, recovery, fat burning", benefit: "Active recovery, improves base aerobic fitness" },
  { zone: 2, name: "Light", pctLow: 60, pctHigh: 70, color: "bg-blue-500", textColor: "text-blue-600", desc: "Easy aerobic, fat burning zone", benefit: "Builds aerobic base, improves fat metabolism" },
  { zone: 3, name: "Aerobic", pctLow: 70, pctHigh: 80, color: "bg-green-500", textColor: "text-green-600", desc: "Aerobic fitness, tempo training", benefit: "Improves cardiovascular efficiency and endurance" },
  { zone: 4, name: "Threshold", pctLow: 80, pctHigh: 90, color: "bg-amber-500", textColor: "text-amber-600", desc: "Hard effort, improves speed", benefit: "Increases lactate threshold and race pace" },
  { zone: 5, name: "Maximum", pctLow: 90, pctHigh: 100, color: "bg-red-500", textColor: "text-red-600", desc: "Max effort, sprints, intervals", benefit: "Improves maximum speed and VO2 max" },
];

const faqs = [
  {
    q: "How do I calculate my maximum heart rate?",
    a: "The most widely used formula is 220 minus your age (Fox formula). More accurate alternatives include 208 − (0.7 × age) (Tanaka formula, better for older adults) and 211 − (0.64 × age) (Gulati formula for women). All are estimates — lab testing is the gold standard.",
  },
  {
    q: "What is a normal resting heart rate?",
    a: "A healthy resting heart rate for adults is 60–100 bpm. Athletes typically range 40–60 bpm due to cardiac efficiency. Below 60 is called bradycardia; above 100 is tachycardia. Measure first thing in the morning before getting out of bed for the most accurate reading.",
  },
  {
    q: "What heart rate zone is best for fat burning?",
    a: "Zone 2 (60–70% MHR) is often called the 'fat-burning zone' because fat provides a higher proportion of energy at lower intensities. However, higher-intensity exercise burns more total calories and fat overall. Both have a place in a balanced training program.",
  },
  {
    q: "What is the Karvonen formula?",
    a: "The Karvonen formula uses your heart rate reserve (HRR = max HR − resting HR) to calculate training zones: Target HR = Resting HR + (HRR × intensity%). This is more personalized than percentage of max HR alone because it accounts for your fitness level.",
  },
  {
    q: "How can I lower my resting heart rate?",
    a: "Regular aerobic exercise is the most effective way. Consistent cardio training (4–5 days/week) can lower resting HR by 10–15 bpm over several months. Other factors: reducing stress, improving sleep, limiting caffeine, and staying hydrated.",
  },
  {
    q: "What heart rate is too high during exercise?",
    a: "Exercising above 85–90% of your maximum heart rate for extended periods is generally considered very high intensity. Beginners should stay under 70% MHR. If you feel dizzy, chest pain, or shortness of breath, stop immediately and seek medical advice.",
  },
];

export default function HeartRateCalculator() {
  const [age, setAge] = useState("30");
  const [restingHR, setRestingHR] = useState("65");
  const [formula, setFormula] = useState<"fox" | "tanaka" | "gulati">("fox");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(() => {
    const ageN = parseInt(age);
    const restN = parseInt(restingHR);
    if (!ageN || ageN < 10 || ageN > 100) return null;

    let maxHR: number;
    if (formula === "fox") maxHR = 220 - ageN;
    else if (formula === "tanaka") maxHR = Math.round(208 - 0.7 * ageN);
    else maxHR = Math.round(211 - 0.64 * ageN);

    const hrr = restN && restN > 30 ? maxHR - restN : null;

    const zoneData = zones.map(z => {
      const bpmLow = Math.round(maxHR * (z.pctLow / 100));
      const bpmHigh = Math.round(maxHR * (z.pctHigh / 100));
      const karvonenLow = hrr ? Math.round(restN + hrr * (z.pctLow / 100)) : null;
      const karvonenHigh = hrr ? Math.round(restN + hrr * (z.pctHigh / 100)) : null;
      return { ...z, bpmLow, bpmHigh, karvonenLow, karvonenHigh };
    });

    return { maxHR, hrr, zoneData, restN };
  }, [age, restingHR, formula]);

  return (
    <Layout>
      <SEO
        title="Heart Rate Calculator — Max HR & Training Zones | Free Tool"
        description="Calculate your maximum heart rate and all 5 training zones. Uses Fox, Tanaka, and Gulati formulas. Includes Karvonen heart rate reserve method. Free online tool."
      />

      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground px-4 md:px-8 pt-4 max-w-7xl mx-auto">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/category/health" className="hover:text-foreground transition-colors">Health & Fitness</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium">Heart Rate Calculator</span>
      </nav>

      <section className="bg-gradient-to-br from-rose-500 via-red-500 to-pink-600 text-white py-12 px-4 md:px-8 mt-4">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-sm font-medium mb-4">
            <Heart className="w-4 h-4" />
            Health & Fitness
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-3xl">
            Heart Rate Calculator
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mb-6">
            Calculate your maximum heart rate and all 5 training zones. Supports Fox, Tanaka, and Gulati MHR formulas, plus the Karvonen heart rate reserve method for personalized targets.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            {[
              { icon: Zap, label: "3 MHR formulas" },
              { icon: Heart, label: "All 5 training zones" },
              { icon: CheckCircle, label: "Karvonen method" },
              { icon: Shield, label: "100% free" },
              { icon: Clock, label: "No signup needed" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">

          <div className="tool-calc-card overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-rose-500 to-pink-500" />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-5">Your Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Age (years)</label>
                  <input type="number" className="tool-calc-input text-xl font-bold" value={age} onChange={e => setAge(e.target.value)} min={10} max={100} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Resting Heart Rate (bpm) <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <input type="number" className="tool-calc-input text-xl font-bold" value={restingHR} onChange={e => setRestingHR(e.target.value)} placeholder="e.g. 65" min={30} max={120} />
                  <p className="text-xs text-muted-foreground mt-1">Enables Karvonen (heart rate reserve) method</p>
                </div>
              </div>

              {/* Formula */}
              <div>
                <label className="block text-sm font-medium mb-2">Max HR Formula</label>
                <div className="space-y-2">
                  {[
                    { v: "fox", label: "Fox (220 − age)", desc: "Standard — most widely used" },
                    { v: "tanaka", label: "Tanaka (208 − 0.7 × age)", desc: "More accurate for adults over 40" },
                    { v: "gulati", label: "Gulati (211 − 0.64 × age)", desc: "Validated for women" },
                  ].map(f => (
                    <button key={f.v} onClick={() => setFormula(f.v as typeof formula)} className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-colors ${formula === f.v ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30" : "border-border hover:bg-muted"}`}>
                      <span className="font-semibold font-mono">{f.label}</span>
                      <span className="text-muted-foreground text-xs">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {result && (
                  <motion.div key={`${age}-${formula}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-5">

                    <div className="grid grid-cols-2 gap-4">
                      <div className="tool-calc-result text-center py-5">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Max Heart Rate</p>
                        <p className="text-5xl font-bold text-rose-600">{result.maxHR}</p>
                        <p className="text-muted-foreground text-sm">bpm</p>
                      </div>
                      {result.hrr && (
                        <div className="tool-calc-result text-center py-5">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Heart Rate Reserve</p>
                          <p className="text-5xl font-bold text-pink-600">{result.hrr}</p>
                          <p className="text-muted-foreground text-sm">bpm (HRR)</p>
                        </div>
                      )}
                    </div>

                    {/* Training zones */}
                    <div className="space-y-3">
                      <p className="font-semibold text-sm">Training Zones</p>
                      {result.zoneData.map(z => (
                        <div key={z.zone} className="rounded-xl border border-border overflow-hidden">
                          <div className="flex items-center gap-3 p-3">
                            <div className={`w-3 h-12 rounded-full shrink-0 ${z.color}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-sm">Zone {z.zone} — {z.name}</p>
                                <p className={`text-sm font-bold ${z.textColor}`}>{z.bpmLow}–{z.bpmHigh} bpm</p>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden mb-1.5">
                                <motion.div
                                  className={`h-full ${z.color}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${z.pctHigh}%` }}
                                  transition={{ duration: 0.6, ease: "easeOut", delay: z.zone * 0.1 }}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">{z.pctLow}–{z.pctHigh}% MHR · {z.desc}</p>
                              {result.hrr && z.karvonenLow && (
                                <p className="text-xs text-muted-foreground mt-0.5">Karvonen: {z.karvonenLow}–{z.karvonenHigh} bpm</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* FAQ */}
          <div className="tool-calc-card p-6">
            <h2 className="text-xl font-bold mb-5">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-border rounded-xl overflow-hidden">
                  <button className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/40 transition-colors" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="font-medium text-sm pr-4">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="tool-calc-card p-5">
            <h3 className="font-bold mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500" /> Why Use This Tool</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["3 different MHR formulas", "All 5 training zones shown", "Karvonen method included", "Animated zone bar chart", "Completely free"].map(item => (
                <li key={item} className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />{item}</li>
              ))}
            </ul>
          </div>

          <div className="tool-calc-card p-5">
            <h3 className="font-bold mb-3 text-sm">Zone Benefits</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              {zones.map(z => (
                <div key={z.zone} className="flex gap-2">
                  <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${z.color}`} />
                  <p><strong className="text-foreground">Z{z.zone}</strong> — {z.benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="tool-calc-card p-5">
            <h3 className="font-bold mb-3 flex items-center gap-2"><Share2 className="w-4 h-4 text-blue-500" /> Share</h3>
            <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="w-full text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-lg px-4 py-2.5 font-medium transition-colors">
              Copy Link
            </button>
          </div>

          <div className="tool-calc-card p-5">
            <h3 className="font-bold mb-3 text-sm">Related Tools</h3>
            <div className="space-y-2">
              {[
                { label: "Running Pace Calculator", href: "/health/running-pace-calculator" },
                { label: "TDEE Calculator", href: "/health/tdee-calculator" },
                { label: "BMI Calculator", href: "/health/bmi-calculator" },
                { label: "Calorie Calculator", href: "/health/calorie-calculator" },
                { label: "Sleep Calculator", href: "/health/sleep-calculator" },
              ].map(({ label, href }) => (
                <Link key={href} href={href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                  <ChevronRight className="w-3.5 h-3.5 text-rose-500" />{label}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <section className="bg-muted/30 border-t border-border py-14 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-8 text-sm text-muted-foreground leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Heart Rate Calculator — Complete Training Zone Guide</h2>
            <p>Your <strong>maximum heart rate (MHR)</strong> is the highest number of times your heart can beat per minute under maximum exertion. Training in different heart rate zones produces different physiological adaptations — from fat-burning efficiency to VO2 max improvement.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Which MHR Formula Should You Use?</h3>
            <p>The <strong>Fox formula (220 − age)</strong> is simple and widely used but can be off by ±10–20 bpm for individuals. The <strong>Tanaka formula</strong> was validated in a 2001 meta-analysis of 351 studies and is more accurate for adults over 40. The <strong>Gulati formula</strong> was specifically developed from studies on women and provides better accuracy for female athletes.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">The Karvonen Method Explained</h3>
            <p>The Karvonen formula accounts for your fitness level by using Heart Rate Reserve (HRR = max HR − resting HR). A trained athlete with a resting HR of 45 and the same age as an untrained person with a 75 resting HR will have very different training zones. The Karvonen method captures this difference, making it the most personalized approach for setting accurate training targets.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
