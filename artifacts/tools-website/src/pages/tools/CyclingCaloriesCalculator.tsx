import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Bike, Flame, Timer, Share2, Check } from "lucide-react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";

// MET values from Ainsworth's Compendium 2011
const CYCLING_TYPES = [
  { label: "Very light — leisure (< 16 km/h / 10 mph)", met: 4.0 },
  { label: "Light — leisure (16–19 km/h / 10–12 mph)", met: 6.0 },
  { label: "Moderate — recreational (19–22 km/h / 12–14 mph)", met: 8.0 },
  { label: "Vigorous — racing (22–25 km/h / 14–16 mph)", met: 10.0 },
  { label: "Very vigorous — fast race (25–32 km/h / 16–20 mph)", met: 12.0 },
  { label: "Racing — elite (> 32 km/h / 20+ mph)", met: 16.0 },
  { label: "Stationary bike — light effort", met: 5.5 },
  { label: "Stationary bike — moderate effort", met: 7.0 },
  { label: "Stationary bike — vigorous effort", met: 10.5 },
  { label: "Mountain biking — off road", met: 8.5 },
  { label: "Spinning / indoor cycling class", met: 9.5 },
];

const INTENSITY_TIERS = [
  { label: "Leisure", range: "MET 4–6", desc: "Easy riding, flat terrain, casual pace — sustainable for hours", dot: "bg-teal-500", bg: "bg-teal-500/5 border-teal-500/20" },
  { label: "Recreational", range: "MET 7–9", desc: "Consistent effort, occasional hills, moderate speed", dot: "bg-violet-500", bg: "bg-violet-500/5 border-violet-500/20" },
  { label: "Vigorous", range: "MET 10–12", desc: "Hard effort, fast pace, challenging terrain or intervals", dot: "bg-amber-500", bg: "bg-amber-500/5 border-amber-500/20" },
  { label: "Racing", range: "MET 12–16", desc: "Near-maximal output, competitive riding, sprint efforts", dot: "bg-red-500", bg: "bg-red-500/5 border-red-500/20" },
  { label: "Indoor Cycling", range: "MET 5.5–10.5", desc: "Stationary bike and spinning — from light to vigorous", dot: "bg-blue-500", bg: "bg-blue-500/5 border-blue-500/20" },
];

const faqs = [
  {
    q: "How many calories does cycling burn?",
    a: "Cycling burns approximately 6–16 calories per minute depending on weight, speed, and terrain. A 70 kg (154 lb) person cycling at moderate pace (19–22 km/h) for 30 minutes burns roughly 280–320 calories. Cycling is one of the most efficient calorie-burning cardiovascular exercises.",
  },
  {
    q: "Does cycling burn more calories than walking?",
    a: "At the same duration, cycling typically burns 50–100% more calories than walking due to higher intensity. However, walking at 10,000 steps also accumulates in everyday life, while cycling is a dedicated activity. Both are excellent for health; cycling offers greater calorie burn per session for time-pressed individuals.",
  },
  {
    q: "What is MET and how is it used here?",
    a: "MET (Metabolic Equivalent of Task) is a standardized measure of exercise intensity. Sitting at rest = 1 MET. Moderate cycling = 8 METs (8× the resting metabolic rate). Calorie burn = MET × weight (kg) × hours. This calculator uses MET values from the official 2011 Ainsworth Compendium of Physical Activities.",
  },
  {
    q: "Does cycling uphill burn more calories?",
    a: "Yes, substantially. Climbing increases calorie burn by 50–100% compared to flat cycling at the same speed. However, cycling speed naturally decreases on uphills. Mountain biking, with its mixed terrain, has a MET of 8.5 — similar to vigorous flat cycling — because the technical difficulty and climbing compensate for slower speeds.",
  },
  {
    q: "Is stationary biking as effective as outdoor cycling?",
    a: "Stationary cycling at equivalent intensity burns similar calories to outdoor cycling. At vigorous effort, indoor bikes (10.5 MET) approach outdoor recreational pace calorie burn. The advantage of indoor cycling is consistent intensity control — you can't coast or benefit from momentum, meaning constant effort.",
  },
  {
    q: "How long should I cycle to lose weight?",
    a: "To create a meaningful calorie deficit through cycling alone, aim for 45–60 minutes at moderate intensity, 3–5 days per week. This burns 1,200–2,400 extra calories per week — equivalent to 0.15–0.3 kg of fat. Combined with moderate dietary adjustments, cycling can create substantial, sustainable weight loss.",
  },
];

function FaqItem({ faq, open, onToggle }: { faq: { q: string; a: string }; open: boolean; onToggle: () => void }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition-colors">
        <span className="font-medium text-foreground pr-4">{faq.q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <p className="px-5 pb-4 text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const relatedTools = [
  { label: "Walking Calories", href: "/health/walking-calories-calculator", color: "142 71 150" },
  { label: "Running Pace", href: "/health/running-pace-calculator", color: "239 68 68" },
  { label: "Calorie Deficit", href: "/health/calorie-deficit-calculator", color: "16 185 129" },
  { label: "BMR Calculator", href: "/health/bmr-calculator", color: "59 130 246" },
];

const tocItems = [
  { label: "Overview", href: "#overview" },
  { label: "Calculator", href: "#calculator" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Intensity Guide", href: "#intensity-guide" },
  { label: "Quick Examples", href: "#examples" },
  { label: "Why Use This", href: "#why-use" },
  { label: "FAQ", href: "#faq" },
];

export default function CyclingCaloriesCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState("");
  const [duration, setDuration] = useState("");
  const [cyclingType, setCyclingType] = useState(8.0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    let w = parseFloat(weight);
    const mins = parseFloat(duration);
    if (!w || !mins || w <= 0 || mins <= 0) return null;
    if (unit === "imperial") w = w * 0.453592;

    const hours = mins / 60;
    const calories = Math.round(cyclingType * w * hours);
    const caloriesPerMin = Math.round((calories / mins) * 10) / 10;
    const caloriesPerHour = Math.round(caloriesPerMin * 60);
    const minutesFor500Cal = Math.round(500 / caloriesPerMin);

    return { calories, caloriesPerMin, caloriesPerHour, minutesFor500Cal };
  }, [weight, duration, cyclingType, unit]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Cycling Calories Calculator – How Many Calories Does Cycling Burn?"
        description="Calculate calories burned while cycling based on your weight, speed, and duration. Covers outdoor, indoor, and mountain biking using validated MET values."
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-4 px-4 lg:px-0" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-violet-500 transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href="/health" className="hover:text-violet-500 transition-colors">Health &amp; Fitness</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">Cycling Calories Calculator</li>
        </ol>
      </nav>

      {/* Hero */}
      <section id="overview" className="mb-8 px-4 lg:px-0">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-medium px-3 py-1 rounded-full mb-4">
          <Bike className="w-4 h-4" />
          Health &amp; Fitness · MET-Based Calculator
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">Cycling Calories Calculator</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Find out how many calories you burn cycling. Covers road, stationary, mountain biking, and spinning
          using MET values from Ainsworth's Compendium of Physical Activities.
        </p>

        {/* Stat grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { value: "6–16", label: "cal/min range", sub: "by intensity level" },
            { value: "~500", label: "cal per 45–60 min", sub: "at moderate pace" },
            { value: "4–16", label: "MET range", sub: "leisure to elite" },
            { value: "11", label: "cycling types", sub: "indoor & outdoor" },
          ].map((s) => (
            <div key={s.label} className="bg-violet-500/5 border border-violet-500/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{s.value}</p>
              <p className="text-xs font-medium text-foreground mt-0.5">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 lg:px-0">
        {/* Main content */}
        <div className="lg:col-span-3 space-y-8">

          {/* Calculator */}
          <section id="calculator">
            <div className="tool-calc-card overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-violet-500 to-purple-400 rounded-t-xl" />
              <div className="p-6">
                <div className="flex gap-2 mb-6">
                  {(["metric", "imperial"] as const).map((u) => (
                    <button key={u} onClick={() => setUnit(u)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${unit === u ? "bg-violet-500 text-white shadow" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                      {u === "metric" ? "Metric (kg)" : "Imperial (lbs)"}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Your weight ({unit === "metric" ? "kg" : "lbs"})</label>
                    <input type="number" min="30" max="400" value={weight} onChange={(e) => setWeight(e.target.value)}
                      placeholder={unit === "metric" ? "e.g. 70" : "e.g. 155"} className="tool-calc-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Duration (minutes)</label>
                    <input type="number" min="1" max="600" value={duration} onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 45" className="tool-calc-input" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-1">Cycling type / intensity</label>
                  <select value={cyclingType} onChange={(e) => setCyclingType(parseFloat(e.target.value))} className="tool-calc-input">
                    {CYCLING_TYPES.map((t) => (
                      <option key={t.met} value={t.met}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <AnimatePresence>
                  {result && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                      <div className="tool-calc-result bg-violet-500/5 border-violet-500/20 text-center">
                        <p className="text-sm text-violet-600 dark:text-violet-400 font-medium mb-1 flex items-center justify-center gap-1.5">
                          <Flame className="w-4 h-4" /> Calories Burned
                        </p>
                        <p className="text-6xl font-bold text-violet-600 dark:text-violet-400">{result.calories.toLocaleString()}</p>
                        <p className="text-xl text-violet-500 font-medium">calories</p>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Cal/min", value: result.caloriesPerMin, icon: <Timer className="w-4 h-4" /> },
                          { label: "Cal/hour", value: result.caloriesPerHour.toLocaleString(), icon: <Flame className="w-4 h-4" /> },
                          { label: "Min for 500 cal", value: result.minutesFor500Cal, icon: <Bike className="w-4 h-4" /> },
                        ].map((item) => (
                          <div key={item.label} className="bg-violet-500/5 border border-violet-500/10 rounded-xl p-3 text-center">
                            <div className="text-violet-500 flex justify-center mb-1">{item.icon}</div>
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <p className="text-lg font-bold text-foreground">{item.value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Intensity comparison */}
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2">Intensity comparison ({duration} min)</p>
                        <div className="space-y-2">
                          {CYCLING_TYPES.slice(0, 6).map((t) => {
                            const wKg = parseFloat(weight) * (unit === "imperial" ? 0.453592 : 1);
                            const cal = Math.round(t.met * wKg * (parseFloat(duration) / 60));
                            const maxCal = Math.round(CYCLING_TYPES[5].met * wKg * (parseFloat(duration) / 60));
                            return (
                              <div key={t.met} className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground w-32 shrink-0 truncate">{t.label.split("—")[0].trim()}</span>
                                <div className="flex-1 bg-muted rounded-full h-3">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${(cal / maxCal) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                    className={`h-3 rounded-full ${t.met === cyclingType ? "bg-violet-500" : "bg-violet-300 dark:bg-violet-700"}`} />
                                </div>
                                <span className={`text-sm font-semibold w-16 text-right ${t.met === cyclingType ? "text-violet-600 dark:text-violet-400" : "text-muted-foreground"}`}>{cal} cal</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section id="how-it-works">
            <h2 className="text-2xl font-bold text-foreground mb-4">How the Cycling Calories Calculator Works</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              This calculator uses the <strong className="text-foreground">MET (Metabolic Equivalent of Task) method</strong> from
              Ainsworth's Compendium of Physical Activities (2011) — the gold standard for estimating exercise energy expenditure.
            </p>
            <div className="bg-muted/50 border border-border rounded-xl p-4 mb-4 font-mono text-sm text-center text-foreground">
              Calories = MET × Weight (kg) × Duration (hours)
            </div>
            <p className="text-muted-foreground leading-relaxed">
              MET values quantify exercise intensity relative to rest (1 MET = sitting still). Leisure cycling (4 MET) burns
              4× more energy than resting. Elite racing (16 MET) burns 16×. Results are estimates accurate to ±10–20% due
              to individual variation in fitness, terrain, drafting, and bike setup.
            </p>
          </section>

          {/* Intensity Guide */}
          <section id="intensity-guide">
            <h2 className="text-2xl font-bold text-foreground mb-4">Cycling Intensity Level Guide</h2>
            <div className="space-y-3">
              {INTENSITY_TIERS.map((t) => (
                <div key={t.label} className={`flex items-start gap-4 p-4 rounded-xl border ${t.bg}`}>
                  <div className="mt-1.5">
                    <span className={`inline-block w-3 h-3 rounded-full ${t.dot}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-foreground">{t.label}</span>
                      <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{t.range}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Examples */}
          <section id="examples">
            <h2 className="text-2xl font-bold text-foreground mb-2">Calorie Burn Reference by Weight &amp; Intensity</h2>
            <p className="text-muted-foreground text-sm mb-4">Estimated calories burned per hour by body weight and cycling intensity.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-violet-500/10">
                    <th className="border border-violet-500/20 px-4 py-2 text-left font-semibold text-foreground">Intensity</th>
                    <th className="border border-violet-500/20 px-4 py-2 text-left font-semibold text-foreground">Speed</th>
                    <th className="border border-violet-500/20 px-4 py-2 text-left font-semibold text-foreground">55 kg (121 lb)</th>
                    <th className="border border-violet-500/20 px-4 py-2 text-left font-semibold text-foreground">70 kg (154 lb)</th>
                    <th className="border border-violet-500/20 px-4 py-2 text-left font-semibold text-foreground">90 kg (198 lb)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Leisure", "< 16 km/h", "220/hr", "280/hr", "360/hr"],
                    ["Light", "16–19 km/h", "330/hr", "420/hr", "540/hr"],
                    ["Moderate", "19–22 km/h", "440/hr", "560/hr", "720/hr"],
                    ["Vigorous", "22–25 km/h", "550/hr", "700/hr", "900/hr"],
                    ["Racing", "25–32 km/h", "660/hr", "840/hr", "1,080/hr"],
                    ["Spinning class", "varies", "523/hr", "665/hr", "855/hr"],
                  ].map(([intensity, speed, a, b, c]) => (
                    <tr key={intensity} className="odd:bg-background even:bg-muted/30">
                      <td className="border border-border px-4 py-2 font-medium text-foreground">{intensity}</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">{speed}</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">{a}</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">{b}</td>
                      <td className="border border-border px-4 py-2 text-muted-foreground">{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Why Use This */}
          <section id="why-use">
            <h2 className="text-2xl font-bold text-foreground mb-4">Why Use This Cycling Calories Calculator</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Science-backed MET values", desc: "Uses the 2011 Ainsworth Compendium — the standard reference for exercise energy expenditure used in academic research worldwide." },
                { title: "11 cycling types covered", desc: "From gentle leisure rides to elite racing, indoor spinning, and mountain biking — all with specific MET values." },
                { title: "Weight-adjusted accuracy", desc: "Calories scale with your actual body weight, not generic averages, giving you personalized estimates." },
                { title: "Intensity comparison chart", desc: "Visualize how different cycling speeds compare for your session length, helping optimize training decisions." },
                { title: "Metric & imperial units", desc: "Switch between kg and lbs instantly. The calculator converts automatically with no manual math needed." },
                { title: "Completely private", desc: "All calculations happen in your browser. No data is stored, shared, or sent to any server." },
              ].map((f) => (
                <div key={f.title} className="flex gap-3 p-4 bg-violet-500/5 border border-violet-500/10 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{f.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq">
            <h2 className="text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <FaqItem key={i} faq={faq} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">Want to compare other exercises?</h3>
            <p className="text-muted-foreground text-sm mb-4">Calculate calories for walking, estimate your daily calorie burn, or explore all health tools.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/health/walking-calories-calculator"
                className="px-5 py-2.5 bg-violet-500 text-white rounded-xl font-medium text-sm hover:bg-violet-600 transition-colors">
                Walking Calories Calculator →
              </Link>
              <Link href="/health"
                className="px-5 py-2.5 bg-muted text-foreground rounded-xl font-medium text-sm hover:bg-muted/80 transition-colors">
                All Health Tools
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">

          {/* Related Tools */}
          <div className="tool-calc-card p-5">
            <h3 className="font-semibold text-foreground mb-3">Related Tools</h3>
            <ul className="space-y-2">
              {relatedTools.map((t) => (
                <li key={t.href}>
                  <Link href={t.href} className="flex items-center gap-3 text-sm text-foreground hover:text-violet-500 transition-colors">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `rgb(${t.color} / 0.12)` }}>
                      <Bike className="w-3.5 h-3.5" style={{ color: `rgb(${t.color})` }} />
                    </span>
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Share */}
          <div className="tool-calc-card p-5">
            <h3 className="font-semibold text-foreground mb-3">Share</h3>
            <button onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm text-foreground transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
              {copied ? "Link copied!" : "Copy link"}
            </button>
          </div>

          {/* On This Page */}
          <div className="tool-calc-card p-5">
            <h3 className="font-semibold text-foreground mb-3">On This Page</h3>
            <ul className="space-y-1.5">
              {tocItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm text-muted-foreground hover:text-violet-500 transition-colors block py-0.5">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* MET Quick Reference */}
          <div className="bg-violet-500/5 border border-violet-500/10 rounded-xl p-5">
            <h3 className="font-semibold text-violet-600 dark:text-violet-400 mb-3 flex items-center gap-2">
              <Bike className="w-4 h-4" /> MET Quick Reference
            </h3>
            <ul className="space-y-1.5 text-sm">
              {[
                { label: "Leisure ride", value: "4.0" },
                { label: "Moderate pace", value: "8.0" },
                { label: "Vigorous race", value: "10.0" },
                { label: "Elite racing", value: "16.0" },
                { label: "Spinning class", value: "9.5" },
                { label: "Mountain biking", value: "8.5" },
              ].map((r) => (
                <li key={r.label} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="font-mono font-bold text-violet-600 dark:text-violet-400">{r.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
