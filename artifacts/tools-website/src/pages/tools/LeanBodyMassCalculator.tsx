import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Scale, Activity, Info } from "lucide-react";
import { Layout } from "../../components/Layout";
import { SEO } from "../../components/SEO";

const FORMULAS = [
  {
    name: "Boer",
    note: "Most widely used clinical formula",
    male: (w: number, h: number) => 0.407 * w + 0.267 * h - 19.2,
    female: (w: number, h: number) => 0.252 * w + 0.473 * h - 48.3,
  },
  {
    name: "James",
    note: "Simple anthropometric formula",
    male: (w: number, h: number) => 1.1 * w - 128 * Math.pow(w / h, 2),
    female: (w: number, h: number) => 1.07 * w - 148 * Math.pow(w / h, 2),
  },
  {
    name: "Hume",
    note: "Validated across populations",
    male: (w: number, h: number) => 0.3281 * w + 0.33929 * h - 29.5336,
    female: (w: number, h: number) => 0.29569 * w + 0.41813 * h - 43.2933,
  },
];

const faqs = [
  {
    q: "What is lean body mass?",
    a: "Lean Body Mass (LBM) is the total weight of your body minus all fat mass. It includes muscles, bones, organs, blood, skin, and all other non-fat tissue. LBM is a more precise fitness metric than total weight because it reflects the metabolically active portion of your body composition.",
  },
  {
    q: "What's the difference between LBM and muscle mass?",
    a: "Lean Body Mass includes all non-fat tissues: muscles, bones, organs, blood, and water. Muscle mass is just one component of LBM. Skeletal muscle typically accounts for 40–50% of LBM in healthy adults. This is why LBM is a broader metric than just muscle mass.",
  },
  {
    q: "Why is LBM important for fitness?",
    a: "LBM directly determines your Basal Metabolic Rate (BMR) — the more lean mass you have, the more calories you burn at rest. Higher LBM improves insulin sensitivity, physical performance, and bone density. Preserving LBM during weight loss is a key goal in evidence-based fat loss programs.",
  },
  {
    q: "How do I use LBM to calculate protein needs?",
    a: "The ISSN (International Society of Sports Nutrition) recommends 1.6–2.2 g of protein per kg of LBM (not total body weight) for muscle preservation and growth. Using LBM rather than total weight gives a more accurate protein target for those with higher body fat percentages.",
  },
  {
    q: "Which formula is most accurate?",
    a: "All three formulas provide estimates. The Boer formula is the most commonly used in clinical settings. The most accurate method for measuring LBM is DEXA scanning, which directly measures fat vs. lean mass. These formulas are validated approximations that correlate well with DEXA in normal-weight individuals.",
  },
  {
    q: "How can I increase my lean body mass?",
    a: "The primary driver of LBM gain is progressive resistance training combined with adequate protein intake. Eating in a slight caloric surplus (200–300 calories) while consuming 1.6–2.2 g protein/kg LBM maximizes muscle synthesis. Sufficient sleep (7–9 hours) and managing stress (which raises cortisol) also support LBM retention and growth.",
  },
];

export default function LeanBodyMassCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(() => {
    let w = parseFloat(weight);
    let h = 0;
    if (unit === "metric") {
      h = parseFloat(height);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      h = ft * 30.48 + inches * 2.54;
      w = w * 0.453592;
    }
    if (!w || !h || w <= 0 || h <= 0) return null;

    const vals = FORMULAS.map((f) => ({
      name: f.name,
      note: f.note,
      lbm: Math.max(0, Math.round((sex === "male" ? f.male(w, h) : f.female(w, h)) * 10) / 10),
    }));
    const consensus = vals.reduce((sum, v) => sum + v.lbm, 0) / vals.length;

    // If body fat provided, use direct calculation
    const bf = bodyFat ? parseFloat(bodyFat) : null;
    const directLbm = bf ? Math.round((w * (1 - bf / 100)) * 10) / 10 : null;

    const primary = directLbm ?? Math.round(consensus * 10) / 10;
    const fatMass = Math.round((w - primary) * 10) / 10;
    const bfPct = bf ?? Math.round(((w - primary) / w) * 100 * 10) / 10;

    return {
      primary,
      fatMass,
      bfPct,
      vals,
      directLbm,
      totalWeight: Math.round(w * 10) / 10,
      proteinMin: Math.round(primary * 1.6 * 10) / 10,
      proteinMax: Math.round(primary * 2.2 * 10) / 10,
    };
  }, [sex, weight, height, heightFt, heightIn, unit, bodyFat]);

  return (
    <Layout>
      <SEO
        title="Lean Body Mass Calculator – Calculate Your LBM"
        description="Calculate your Lean Body Mass (LBM) using Boer, James, and Hume formulas. Understand your body composition and ideal protein intake based on your lean mass."
      />

      <nav className="text-sm text-gray-500 mb-4 px-4 lg:px-0" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5">
          <li><a href="/" className="hover:text-cyan-600 transition-colors">Home</a></li>
          <li>/</li>
          <li><a href="/health" className="hover:text-cyan-600 transition-colors">Health &amp; Fitness</a></li>
          <li>/</li>
          <li className="text-gray-800 font-medium">Lean Body Mass Calculator</li>
        </ol>
      </nav>

      <div className="mb-8 px-4 lg:px-0">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Lean Body Mass Calculator</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Calculate your Lean Body Mass (LBM) — the weight of everything in your body except fat. Uses three
          validated clinical formulas and supports optional body fat percentage input.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 lg:px-0">
        <div className="lg:col-span-3">
          <div className="tool-calc-card overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-cyan-500 to-teal-400 rounded-t-xl" />
            <div className="p-6">
              <div className="flex gap-2 mb-6">
                {(["metric", "imperial"] as const).map((u) => (
                  <button key={u} onClick={() => setUnit(u)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${unit === u ? "bg-cyan-500 text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {u === "metric" ? "Metric (kg/cm)" : "Imperial (lb/ft)"}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Biological sex</label>
                  <div className="flex gap-2">
                    {(["male", "female"] as const).map((s) => (
                      <button key={s} onClick={() => setSex(s)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${sex === s ? "bg-cyan-50 border-cyan-400 text-cyan-700" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-cyan-300"}`}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight ({unit === "metric" ? "kg" : "lbs"})</label>
                  <input type="number" min="30" max="400" value={weight} onChange={(e) => setWeight(e.target.value)}
                    placeholder={unit === "metric" ? "e.g. 80" : "e.g. 175"} className="tool-calc-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height ({unit === "metric" ? "cm" : "ft / in"})</label>
                  {unit === "metric" ? (
                    <input type="number" min="100" max="250" value={height} onChange={(e) => setHeight(e.target.value)}
                      placeholder="e.g. 178" className="tool-calc-input" />
                  ) : (
                    <div className="flex gap-2">
                      <input type="number" min="4" max="8" value={heightFt} onChange={(e) => setHeightFt(e.target.value)}
                        placeholder="ft" className="tool-calc-input w-24" />
                      <input type="number" min="0" max="11" value={heightIn} onChange={(e) => setHeightIn(e.target.value)}
                        placeholder="in" className="tool-calc-input w-24" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body fat % (optional — for direct calculation)</label>
                  <input type="number" min="5" max="60" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)}
                    placeholder="e.g. 22" className="tool-calc-input" />
                  <p className="text-xs text-gray-400 mt-1">Leave blank to use formula estimates</p>
                </div>
              </div>

              <AnimatePresence>
                {result && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="tool-calc-result bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-200 text-center">
                      <p className="text-sm text-cyan-600 font-medium mb-1 flex items-center justify-center gap-1.5">
                        <Scale className="w-4 h-4" /> Lean Body Mass
                        {result.directLbm ? " (from body fat %)" : " (formula average)"}
                      </p>
                      <p className="text-5xl font-bold text-cyan-600">
                        {result.primary}
                        <span className="text-2xl font-medium ml-1">kg</span>
                      </p>
                    </div>

                    {/* Body composition breakdown */}
                    <div className="bg-cyan-50 rounded-xl p-4">
                      <p className="text-sm font-semibold text-cyan-700 mb-3">Body composition breakdown</p>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        {[
                          { label: "Total Weight", value: `${result.totalWeight} kg`, color: "text-gray-700" },
                          { label: "Lean Mass", value: `${result.primary} kg`, color: "text-cyan-600" },
                          { label: "Fat Mass", value: `${result.fatMass} kg`, color: "text-rose-500" },
                        ].map((item) => (
                          <div key={item.label} className="bg-white rounded-lg p-3">
                            <p className="text-xs text-gray-500">{item.label}</p>
                            <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                          </div>
                        ))}
                      </div>
                      {/* Visual bar */}
                      <div className="mt-3 flex rounded-full overflow-hidden h-4">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${100 - result.bfPct}%` }}
                          transition={{ duration: 0.6 }}
                          className="bg-cyan-500 flex items-center justify-center text-white text-xs font-bold"
                        >
                          {100 - result.bfPct}% lean
                        </motion.div>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.bfPct}%` }}
                          transition={{ duration: 0.6 }}
                          className="bg-rose-400 flex items-center justify-center text-white text-xs font-bold"
                        >
                          {result.bfPct}% fat
                        </motion.div>
                      </div>
                    </div>

                    {/* Formula comparison */}
                    {!result.directLbm && (
                      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 border-b border-gray-50">Formula comparison</p>
                        {result.vals.map((f) => (
                          <div key={f.name} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{f.name}</p>
                              <p className="text-xs text-gray-400">{f.note}</p>
                            </div>
                            <p className="text-xl font-bold text-cyan-600">{f.lbm} <span className="text-xs font-normal text-gray-400">kg</span></p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Protein recommendations */}
                    <div className="bg-white border border-cyan-100 rounded-xl p-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-cyan-500" /> Protein intake recommendation (based on LBM)
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="bg-cyan-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Minimum (1.6 g/kg)</p>
                          <p className="text-2xl font-bold text-cyan-600">{result.proteinMin}g</p>
                          <p className="text-xs text-gray-400">per day</p>
                        </div>
                        <div className="bg-teal-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Optimal (2.2 g/kg)</p>
                          <p className="text-2xl font-bold text-teal-600">{result.proteinMax}g</p>
                          <p className="text-xs text-gray-400">per day</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 text-center">Based on ISSN 2017 recommendations for muscle preservation and growth</p>
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
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-800 pr-4">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <p className="px-5 pb-4 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Lean Body Mass Matters More Than Total Weight</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The number on the scale tells you very little about your actual health or fitness. Two people can weigh
              exactly the same yet have vastly different body compositions — one may be 15% body fat and another 30%.
              Their metabolisms, athletic capabilities, and health risks will differ dramatically. <strong>Lean Body Mass (LBM)</strong>
              cuts through this ambiguity by isolating the functional, metabolically active portion of your body.
            </p>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Healthy Body Fat Ranges</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-cyan-50">
                  <th className="border border-cyan-100 px-4 py-2 text-left font-semibold text-gray-700">Category</th>
                  <th className="border border-cyan-100 px-4 py-2 text-left font-semibold text-gray-700">Men</th>
                  <th className="border border-cyan-100 px-4 py-2 text-left font-semibold text-gray-700">Women</th>
                </tr></thead>
                <tbody>
                  {[
                    ["Essential fat (minimum)", "2–5%", "10–13%"],
                    ["Athlete", "6–13%", "14–20%"],
                    ["Fitness", "14–17%", "21–24%"],
                    ["Average", "18–24%", "25–31%"],
                    ["Obese", "25%+", "32%+"],
                  ].map(([cat, men, women]) => (
                    <tr key={cat} className="odd:bg-white even:bg-gray-50">
                      <td className="border border-gray-100 px-4 py-2 text-gray-700 font-medium">{cat}</td>
                      <td className="border border-gray-100 px-4 py-2 text-gray-600">{men}</td>
                      <td className="border border-gray-100 px-4 py-2 text-gray-600">{women}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-5">
            <h3 className="font-semibold text-cyan-800 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" /> LBM Components
            </h3>
            <ul className="space-y-2 text-sm text-cyan-700">
              <li className="flex justify-between"><span>Skeletal muscle</span><strong>~40–50%</strong></li>
              <li className="flex justify-between"><span>Bone</span><strong>~15%</strong></li>
              <li className="flex justify-between"><span>Organs</span><strong>~15%</strong></li>
              <li className="flex justify-between"><span>Blood/water</span><strong>~20–30%</strong></li>
            </ul>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Related Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/health/bmi-calculator" className="text-cyan-600 hover:underline">BMI Calculator</a></li>
              <li><a href="/health/protein-intake-calculator" className="text-cyan-600 hover:underline">Protein Intake</a></li>
              <li><a href="/health/calorie-deficit-calculator" className="text-cyan-600 hover:underline">Calorie Deficit</a></li>
              <li><a href="/health/bmr-calculator" className="text-cyan-600 hover:underline">BMR Calculator</a></li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
