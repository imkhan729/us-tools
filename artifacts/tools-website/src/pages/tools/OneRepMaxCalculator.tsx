import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Dumbbell, TrendingUp, Trophy } from "lucide-react";
import { Layout } from "../../components/Layout";
import { SEO } from "../../components/SEO";

const FORMULAS = [
  { name: "Epley", fn: (w: number, r: number) => w * (1 + r / 30) },
  { name: "Brzycki", fn: (w: number, r: number) => w * (36 / (37 - r)) },
  { name: "Lander", fn: (w: number, r: number) => (100 * w) / (101.3 - 2.67123 * r) },
  { name: "Lombardi", fn: (w: number, r: number) => w * Math.pow(r, 0.1) },
  { name: "O'Conner", fn: (w: number, r: number) => w * (1 + r / 40) },
];

const PERCENTAGES = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50];
const PERCENT_REPS = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15];

const EXERCISES = ["Back Squat", "Bench Press", "Deadlift", "Overhead Press", "Barbell Row", "Other"];

const faqs = [
  {
    q: "What is a one rep max (1RM)?",
    a: "Your one rep max (1RM) is the maximum amount of weight you can lift for a single full repetition of a given exercise with proper form. It's the gold standard for measuring raw strength and is used to calculate training loads as percentages of your 1RM.",
  },
  {
    q: "Which formula is most accurate?",
    a: "The Epley and Brzycki formulas are the most widely used and generally most accurate for rep ranges of 1–10. Accuracy decreases as rep count increases beyond 10. The average of all formulas (shown as 'Consensus') provides the most balanced estimate.",
  },
  {
    q: "Can I use this for more than 10 reps?",
    a: "1RM estimates become less reliable above 10 reps because muscular endurance plays a larger role relative to pure strength. For best accuracy, test with 3–6 reps. The formulas are mathematically valid up to ~20 reps, but treat results beyond 10 reps as rough estimates.",
  },
  {
    q: "Should I actually lift my 1RM to test it?",
    a: "Not necessarily. Direct 1RM testing carries a higher injury risk, especially for beginners. Using a submaximal test (e.g., 5 reps at a challenging weight) and plugging those numbers into this calculator is a safe and reliable alternative.",
  },
  {
    q: "How do percentages relate to training?",
    a: "Strength training programs typically prescribe loads as a percentage of 1RM. Hypertrophy (muscle building) is often trained at 65–80% 1RM for 6–12 reps. Strength work typically uses 80–90% for 2–5 reps. Power training uses 55–75% for explosive movements.",
  },
  {
    q: "How often should I test my 1RM?",
    a: "Most programs retest 1RM every 4–12 weeks at the end of a training cycle (deload week). Retesting too frequently is fatiguing and counterproductive. Instead, use this calculator after any solid submaximal performance to track your estimated 1RM progress over time.",
  },
];

export default function OneRepMaxCalculator() {
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [exercise, setExercise] = useState("Back Squat");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeFormula, setActiveFormula] = useState("Epley");

  const result = useMemo(() => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    if (!w || !r || w <= 0 || r < 1 || r > 30) return null;
    if (r === 1) {
      return {
        values: FORMULAS.map((f) => ({ name: f.name, value: w })),
        consensus: w,
        weight: w,
        reps: r,
      };
    }
    const values = FORMULAS.map((f) => ({ name: f.name, value: f.fn(w, r) }));
    const consensus = values.reduce((sum, v) => sum + v.value, 0) / values.length;
    return { values, consensus, weight: w, reps: r };
  }, [weight, reps]);

  const activeMax = useMemo(() => {
    if (!result) return null;
    if (activeFormula === "Consensus") return result.consensus;
    return result.values.find((v) => v.name === activeFormula)?.value ?? result.consensus;
  }, [result, activeFormula]);

  return (
    <Layout>
      <SEO
        title="One Rep Max Calculator – Estimate Your 1RM Strength"
        description="Calculate your one rep max (1RM) for any lift using 5 proven formulas. Get a full rep-percentage table to plan your training loads."
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 px-4 lg:px-0" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5">
          <li><a href="/" className="hover:text-red-600 transition-colors">Home</a></li>
          <li>/</li>
          <li><a href="/health" className="hover:text-red-600 transition-colors">Health & Fitness</a></li>
          <li>/</li>
          <li className="text-gray-800 font-medium">One Rep Max Calculator</li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="mb-8 px-4 lg:px-0">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
          One Rep Max Calculator
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Estimate your 1RM for any exercise without a dangerous max-effort lift. Uses 5 validated
          formulas and generates a full training percentage chart.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 lg:px-0">
        {/* Main Tool */}
        <div className="lg:col-span-3">
          <div className="tool-calc-card overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-red-600 to-rose-400 rounded-t-xl" />

            <div className="p-6">
              {/* Unit Toggle */}
              <div className="flex gap-2 mb-6">
                {(["kg", "lbs"] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      unit === u
                        ? "bg-red-600 text-white shadow"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {/* Exercise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exercise</label>
                  <select
                    value={exercise}
                    onChange={(e) => setExercise(e.target.value)}
                    className="tool-calc-input"
                  >
                    {EXERCISES.map((ex) => (
                      <option key={ex} value={ex}>{ex}</option>
                    ))}
                  </select>
                </div>

                {/* Weight lifted */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight lifted ({unit})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder={unit === "kg" ? "e.g. 100" : "e.g. 225"}
                    className="tool-calc-input"
                  />
                </div>

                {/* Reps */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reps performed</label>
                  <input
                    type="number"
                    min="1" max="30"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    placeholder="e.g. 5"
                    className="tool-calc-input"
                  />
                </div>
              </div>

              {/* Results */}
              <AnimatePresence>
                {result && activeMax && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    {/* Formula selector */}
                    <div>
                      <p className="text-xs text-gray-500 mb-2 font-medium">Select formula:</p>
                      <div className="flex flex-wrap gap-2">
                        {["Consensus", ...FORMULAS.map((f) => f.name)].map((name) => (
                          <button
                            key={name}
                            onClick={() => setActiveFormula(name)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                              activeFormula === name
                                ? "bg-red-600 text-white border-red-600"
                                : "bg-white text-gray-600 border-gray-200 hover:border-red-300"
                            }`}
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Primary result */}
                    <div className="tool-calc-result bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-center">
                      <p className="text-sm text-red-600 font-medium mb-1 flex items-center justify-center gap-1.5">
                        <Trophy className="w-4 h-4" /> Estimated 1RM — {exercise} ({activeFormula})
                      </p>
                      <p className="text-5xl font-bold text-red-600">
                        {Math.round(activeMax).toLocaleString()}
                        <span className="text-2xl font-medium ml-1">{unit}</span>
                      </p>
                      <p className="text-sm text-red-400 mt-1">
                        From {result.reps} {result.reps === 1 ? "rep" : "reps"} at {result.weight} {unit}
                      </p>
                    </div>

                    {/* Formula comparison */}
                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 border-b border-gray-50">
                        Formula comparison
                      </p>
                      <div className="divide-y divide-gray-50">
                        {[{ name: "Consensus (avg)", value: result.consensus }, ...result.values].map((item) => {
                          const pct = (item.value / result.consensus) * 100;
                          return (
                            <div key={item.name} className="flex items-center gap-3 px-4 py-2.5">
                              <span className="text-sm text-gray-600 w-32 shrink-0">{item.name}</span>
                              <div className="flex-1 bg-gray-100 rounded-full h-2">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(pct, 105)}%` }}
                                  transition={{ duration: 0.5 }}
                                  className="h-2 rounded-full bg-gradient-to-r from-red-500 to-rose-400"
                                />
                              </div>
                              <span className="text-sm font-semibold text-gray-800 w-20 text-right">
                                {Math.round(item.value)} {unit}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Percentage table */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-red-500" />
                        Training load chart (based on {activeFormula})
                      </p>
                      <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-red-50">
                              <th className="px-3 py-2 text-left font-semibold text-gray-700">% 1RM</th>
                              <th className="px-3 py-2 text-left font-semibold text-gray-700">Weight ({unit})</th>
                              <th className="px-3 py-2 text-left font-semibold text-gray-700">~Reps</th>
                              <th className="px-3 py-2 text-left font-semibold text-gray-700">Training Zone</th>
                            </tr>
                          </thead>
                          <tbody>
                            {PERCENTAGES.map((pct, idx) => {
                              const load = (activeMax * pct) / 100;
                              const zone =
                                pct >= 93 ? "Max strength" :
                                pct >= 85 ? "Heavy strength" :
                                pct >= 75 ? "Strength / power" :
                                pct >= 65 ? "Hypertrophy" : "Endurance";
                              return (
                                <tr key={pct} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                  <td className="px-3 py-2 font-bold text-red-600">{pct}%</td>
                                  <td className="px-3 py-2 text-gray-800 font-medium">{load.toFixed(1)}</td>
                                  <td className="px-3 py-2 text-gray-600">{PERCENT_REPS[idx]}</td>
                                  <td className="px-3 py-2 text-gray-500 text-xs">{zone}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-800 pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Rich Content */}
          <div className="mt-10 prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">One Rep Max — The Foundation of Strength Training</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Your <strong>one rep max (1RM)</strong> is the single most important number in strength training. It tells you exactly how strong you are on a specific movement and allows you to structure every workout precisely — removing guesswork from loading decisions. Whether you're following a powerlifting program like 5/3/1, an Olympic weightlifting cycle, or a general hypertrophy plan, 1RM percentages are the universal language of loading.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-3">The 5 Formulas Explained</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-red-50">
                    <th className="border border-red-100 px-4 py-2 text-left font-semibold text-gray-700">Formula</th>
                    <th className="border border-red-100 px-4 py-2 text-left font-semibold text-gray-700">Equation</th>
                    <th className="border border-red-100 px-4 py-2 text-left font-semibold text-gray-700">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Epley (1985)", "w × (1 + r/30)", "General — most widely used"],
                    ["Brzycki (1993)", "w × 36/(37 − r)", "Low rep ranges (1–6)"],
                    ["Lander (1985)", "100w / (101.3 − 2.67×r)", "Powerlifting"],
                    ["Lombardi (1989)", "w × r^0.1", "Olympic lifting"],
                    ["O'Conner (1989)", "w × (1 + r/40)", "Conservative estimate"],
                  ].map(([name, eq, best]) => (
                    <tr key={name} className="odd:bg-white even:bg-gray-50">
                      <td className="border border-gray-100 px-4 py-2 font-medium text-gray-700">{name}</td>
                      <td className="border border-gray-100 px-4 py-2 text-gray-600 font-mono text-xs">{eq}</td>
                      <td className="border border-gray-100 px-4 py-2 text-gray-500">{best}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3">How to Use Your 1RM for Programming</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-4">
              <li><strong>Max strength (90–100%):</strong> 1–3 reps. True neural and strength adaptations. Used by powerlifters on competition days and near-max training sessions.</li>
              <li><strong>Strength building (80–90%):</strong> 3–5 reps. The sweet spot for building strength efficiently. Core of programs like 5×5 and 3×3.</li>
              <li><strong>Hypertrophy (65–80%):</strong> 6–12 reps. Optimal range for maximizing muscle size. Used in most bodybuilding programs.</li>
              <li><strong>Muscular endurance (50–65%):</strong> 12–20+ reps. Improves work capacity and local endurance.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-3">Safety Tips for 1RM Testing</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-4">
              <li>Always warm up thoroughly — work up through 50%, 70%, 85%, 95% before attempting a true max.</li>
              <li>Use a spotter or safety equipment (squat rack pins, bench safeties) for barbell lifts.</li>
              <li>Do not test 1RM when fatigued. Choose a fresh training day after a deload or rest day.</li>
              <li>Consider using 3–5 rep submaximal tests and letting this calculator estimate your 1RM instead.</li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-red-50 border border-red-100 rounded-xl p-5">
            <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <Dumbbell className="w-4 h-4" /> Training Zones
            </h3>
            <ul className="space-y-2 text-sm text-red-700">
              <li className="flex justify-between"><span>Max strength</span><strong>93–100%</strong></li>
              <li className="flex justify-between"><span>Heavy strength</span><strong>85–92%</strong></li>
              <li className="flex justify-between"><span>Strength/power</span><strong>75–84%</strong></li>
              <li className="flex justify-between"><span>Hypertrophy</span><strong>65–74%</strong></li>
              <li className="flex justify-between"><span>Endurance</span><strong>50–64%</strong></li>
            </ul>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Accuracy Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Test with 3–6 reps for best accuracy</li>
              <li>• Use your most challenging set</li>
              <li>• Reps must be clean (no grinding)</li>
              <li>• Retest every 4–8 weeks</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Related Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/health/calorie-deficit-calculator" className="text-red-600 hover:underline">Calorie Deficit</a></li>
              <li><a href="/health/protein-intake-calculator" className="text-red-600 hover:underline">Protein Intake</a></li>
              <li><a href="/health/bmi-calculator" className="text-red-600 hover:underline">BMI Calculator</a></li>
              <li><a href="/health/tdee-calculator" className="text-red-600 hover:underline">TDEE Calculator</a></li>
              <li><a href="/health/running-pace-calculator" className="text-red-600 hover:underline">Running Pace</a></li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
