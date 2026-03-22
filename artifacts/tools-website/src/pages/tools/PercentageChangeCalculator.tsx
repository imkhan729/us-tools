import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { TrendingUp, TrendingDown, Percent, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "increase" | "decrease" | "difference";

function useCalc(mode: Mode, v1: string, v2: string) {
  return useMemo(() => {
    const a = parseFloat(v1);
    const b = parseFloat(v2);
    if (!isFinite(a) || !isFinite(b)) return null;
    if (a === 0 && mode !== "difference") return null;

    let pct: number;
    let change: number;

    if (mode === "increase") {
      change = b - a;
      pct = ((b - a) / Math.abs(a)) * 100;
    } else if (mode === "decrease") {
      change = a - b;
      pct = ((a - b) / Math.abs(a)) * 100;
    } else {
      // Percentage difference: |v1 - v2| / ((v1+v2)/2) * 100
      change = Math.abs(a - b);
      const avg = (Math.abs(a) + Math.abs(b)) / 2;
      pct = avg === 0 ? 0 : (change / avg) * 100;
    }

    return { pct: parseFloat(pct.toFixed(4)), change: parseFloat(change.toFixed(4)), a, b };
  }, [mode, v1, v2]);
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[hsl(var(--border))] rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left font-semibold hover:bg-[hsl(var(--muted))] transition-colors">
        <span>{q}</span>
        {open ? <ChevronUp size={18} className="shrink-0" /> : <ChevronDown size={18} className="shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <p className="px-5 pb-4 text-[hsl(var(--muted-foreground))] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FAQS = [
  { q: "What is the formula for percentage increase?", a: "Percentage Increase = ((New Value − Old Value) / |Old Value|) × 100. For example, from 50 to 75: ((75−50)/50)×100 = 50% increase." },
  { q: "How do I calculate percentage decrease?", a: "Percentage Decrease = ((Old Value − New Value) / |Old Value|) × 100. For example, from 200 to 150: ((200−150)/200)×100 = 25% decrease." },
  { q: "What is the difference between percentage change and percentage difference?", a: "Percentage change compares a new value to a specific original value (directional). Percentage difference compares two values symmetrically using their average as the base — neither value is treated as the 'original'." },
  { q: "Can percentage increase exceed 100%?", a: "Yes! A value increasing from 10 to 30 is a 200% increase (tripled). A 100% increase means doubling. There is no upper limit on percentage increase." },
  { q: "How do I reverse a percentage increase?", a: "To reverse, do NOT subtract the same percentage. If a price increased 25%, to find the original: Original = New ÷ 1.25. For a 50% increase: Original = New ÷ 1.50." },
  { q: "What is a CAGR (Compound Annual Growth Rate)?", a: "CAGR = (Ending Value / Beginning Value)^(1/Years) − 1. It smooths out yearly fluctuations to show the steady growth rate that would achieve the same end result." },
];

const EXAMPLES = [
  { desc: "Stock goes from $100 to $135", type: "increase", result: "+35%" },
  { desc: "Price drops from $80 to $60", type: "decrease", result: "−25%" },
  { desc: "Population changes from 1,000 to 1,200", type: "increase", result: "+20%" },
  { desc: "Test score drops from 95 to 76", type: "decrease", result: "−20%" },
  { desc: "Sales: 400 vs 480 (which is better?)", type: "difference", result: "18.18% diff" },
  { desc: "Salary: $50k to $75k raise", type: "increase", result: "+50%" },
];

const LD_JSON = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", "name": "Percentage Change Calculator", "description": "Calculate percentage increase, decrease, and difference between any two numbers.", "applicationCategory": "UtilityApplication", "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } },
    { "@type": "FAQPage", "mainEntity": FAQS.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) },
  ],
};

const TABS: { key: Mode; label: string; icon: React.ReactNode }[] = [
  { key: "increase", label: "Increase", icon: <TrendingUp size={16} /> },
  { key: "decrease", label: "Decrease", icon: <TrendingDown size={16} /> },
  { key: "difference", label: "Difference", icon: <Percent size={16} /> },
];

export default function PercentageChangeCalculator() {
  const [mode, setMode] = useState<Mode>("increase");
  const [v1, setV1] = useState("100");
  const [v2, setV2] = useState("135");
  const result = useCalc(mode, v1, v2);

  const label1 = mode === "difference" ? "Value A" : "Original Value";
  const label2 = mode === "difference" ? "Value B" : "New Value";

  const isPositive = result && result.pct >= 0;

  return (
    <>
      <Helmet>
        <title>Percentage Change Calculator – Increase, Decrease & Difference | US Online Tools</title>
        <meta name="description" content="Free percentage change calculator. Calculate percentage increase, decrease, or difference between two numbers. Includes formulas and examples." />
        <meta name="keywords" content="percentage change calculator, percentage increase calculator, percentage decrease calculator, percentage difference calculator, percent change formula" />
        <link rel="canonical" href="https://us-online.tools/math/percentage-change-calculator" />
        <script type="application/ld+json">{JSON.stringify(LD_JSON)}</script>
      </Helmet>

      <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]" style={{"--calc-hue": "142"} as React.CSSProperties}>

        <section className="bg-gradient-to-br from-[hsl(var(--calc-hue),70%,18%)] to-[hsl(var(--calc-hue),60%,28%)] text-white py-14 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Percentage Change Calculator</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">Calculate percentage increase, decrease, or difference between any two numbers — with step-by-step formulas.</p>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

          {/* Quick Answer */}
          <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-2xl p-5">
            <h2 className="font-bold text-green-800 dark:text-green-300 mb-2">⚡ Quick Formulas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-green-900 dark:text-green-200">
              <div className="bg-white/60 dark:bg-white/10 rounded-lg p-3">
                <p className="font-semibold mb-1">% Increase</p>
                <code className="text-xs">((New − Old) / |Old|) × 100</code>
              </div>
              <div className="bg-white/60 dark:bg-white/10 rounded-lg p-3">
                <p className="font-semibold mb-1">% Decrease</p>
                <code className="text-xs">((Old − New) / |Old|) × 100</code>
              </div>
              <div className="bg-white/60 dark:bg-white/10 rounded-lg p-3">
                <p className="font-semibold mb-1">% Difference</p>
                <code className="text-xs">|A − B| / ((|A|+|B|)/2) × 100</code>
              </div>
            </div>
          </div>

          {/* Calculator */}
          <div className="tool-calc-card rounded-2xl p-6 md:p-8 shadow-xl">
            {/* Mode Tabs */}
            <div className="flex gap-2 mb-6 bg-[hsl(var(--muted))] rounded-xl p-1">
              {TABS.map(t => (
                <button key={t.key} onClick={() => setMode(t.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${mode === t.key ? "bg-white dark:bg-[hsl(var(--background))] shadow text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div>
                <label className="block text-sm font-semibold mb-1">{label1}</label>
                <input type="number" value={v1} onChange={e => setV1(e.target.value)} className="tool-calc-input w-full text-xl" placeholder="e.g. 100" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">{label2}</label>
                <input type="number" value={v2} onChange={e => setV2(e.target.value)} className="tool-calc-input w-full text-xl" placeholder="e.g. 135" />
              </div>
            </div>

            {result ? (
              <div className="space-y-4">
                {/* Main Result */}
                <div className={`rounded-2xl p-6 text-center ${isPositive ? "bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800"}`}>
                  <p className="text-sm font-semibold text-[hsl(var(--muted-foreground))] mb-2">
                    {mode === "difference" ? "Percentage Difference" : mode === "increase" ? "Percentage Increase" : "Percentage Decrease"}
                  </p>
                  <p className={`text-5xl font-extrabold ${isPositive ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                    {mode !== "difference" && (isPositive ? "+" : "−")}{Math.abs(result.pct)}%
                  </p>
                </div>

                {/* Supporting metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="tool-calc-result rounded-xl p-4 text-center">
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">{label1}</p>
                    <p className="tool-calc-number font-bold text-lg">{result.a}</p>
                  </div>
                  <div className="tool-calc-result rounded-xl p-4 text-center">
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">{label2}</p>
                    <p className="tool-calc-number font-bold text-lg">{result.b}</p>
                  </div>
                  <div className="tool-calc-result rounded-xl p-4 text-center">
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Absolute Change</p>
                    <p className="tool-calc-number font-bold text-lg">{result.change >= 0 ? "+" : ""}{result.change}</p>
                  </div>
                </div>

                {/* Step-by-step */}
                <div className="bg-[hsl(var(--muted))] rounded-xl p-4 text-sm font-mono">
                  <p className="font-semibold mb-2 font-sans">Step-by-step:</p>
                  {mode === "increase" && <>
                    <p>1. Change = {result.b} − {result.a} = {result.b - result.a}</p>
                    <p>2. % = ({result.b - result.a} ÷ {Math.abs(result.a)}) × 100</p>
                    <p>3. = <strong>{result.pct}%</strong></p>
                  </>}
                  {mode === "decrease" && <>
                    <p>1. Change = {result.a} − {result.b} = {result.a - result.b}</p>
                    <p>2. % = ({result.a - result.b} ÷ {Math.abs(result.a)}) × 100</p>
                    <p>3. = <strong>{result.pct}%</strong></p>
                  </>}
                  {mode === "difference" && <>
                    <p>1. |A − B| = |{result.a} − {result.b}| = {result.change}</p>
                    <p>2. Avg = ({Math.abs(result.a)} + {Math.abs(result.b)}) / 2 = {((Math.abs(result.a) + Math.abs(result.b)) / 2).toFixed(4)}</p>
                    <p>3. % = ({result.change} ÷ {((Math.abs(result.a) + Math.abs(result.b)) / 2).toFixed(4)}) × 100</p>
                    <p>4. = <strong>{result.pct}%</strong></p>
                  </>}
                </div>
              </div>
            ) : (
              <p className="text-center text-[hsl(var(--muted-foreground))] py-6">Enter two values above to calculate.</p>
            )}
          </div>

          {/* Examples */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Real-World Examples</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {EXAMPLES.map((ex, i) => (
                <div key={i} className="tool-calc-result rounded-xl p-4">
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">{ex.type.charAt(0).toUpperCase() + ex.type.slice(1)}</p>
                  <p className="text-sm font-medium mb-2">{ex.desc}</p>
                  <p className="tool-calc-number font-bold text-lg">{ex.result}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Content */}
          <section className="prose prose-neutral dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-4">Understanding Percentage Change</h2>
            <p>Percentage change is one of the most widely used calculations in everyday life — from stock market returns to sale discounts to grade improvements. Understanding the three types of percentage calculations helps you analyze data correctly.</p>

            <h3 className="text-xl font-bold mt-6 mb-3">Percentage Increase</h3>
            <p>Used when a value goes up from a known starting point. The base is always the original (older/smaller) value. A salary increase from $50,000 to $60,000 is a <strong>20% increase</strong>: (10,000 / 50,000) × 100 = 20%.</p>

            <h3 className="text-xl font-bold mt-6 mb-3">Percentage Decrease</h3>
            <p>Used when a value falls from a known starting point. A product marked down from $200 to $150 is a <strong>25% decrease</strong>: (50 / 200) × 100 = 25%. Note: a 25% decrease is NOT reversed by a 25% increase — you'd need a ~33.3% increase to return to the original price.</p>

            <h3 className="text-xl font-bold mt-6 mb-3">Percentage Difference</h3>
            <p>Used when comparing two values without a defined "original" — like comparing test scores from two different people, or prices from two stores. The base is the average of both values, making it symmetrical (swapping A and B gives the same result).</p>

            <h3 className="text-xl font-bold mt-6 mb-3">Common Mistakes</h3>
            <ul>
              <li><strong>Wrong base value:</strong> Always use the original as the denominator for increase/decrease.</li>
              <li><strong>Reversing a decrease with the same %:</strong> A 50% decrease needs a 100% increase to recover.</li>
              <li><strong>Confusing increase with difference:</strong> Use "difference" only when neither value is a clear starting point.</li>
            </ul>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-5">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </section>

          {/* Related */}
          <section>
            <h2 className="text-xl font-bold mb-4">Related Tools</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Percentage Calculator", href: "/math/percentage-calculator" },
                { label: "Average Calculator", href: "/math/average-calculator" },
                { label: "Fraction to Decimal", href: "/math/fraction-to-decimal-calculator" },
                { label: "ROI Calculator", href: "/finance/roi-calculator" },
                { label: "Discount Calculator", href: "/finance/discount-calculator" },
              ].map(t => (
                <a key={t.href} href={t.href} className="px-4 py-2 rounded-full border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors text-sm font-medium">{t.label}</a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
