import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "simplify" | "equivalent" | "proportion" | "scale";

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a * 1e6));
  b = Math.abs(Math.round(b * 1e6));
  while (b) { [a, b] = [b, a % b]; }
  return a / 1e6;
}

function fmtRatio(a: number, b: number): string {
  if (a === 0 && b === 0) return "0 : 0";
  const g = gcd(a, b);
  return `${parseFloat((a / g).toPrecision(10))} : ${parseFloat((b / g).toPrecision(10))}`;
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
  { q: "How do you simplify a ratio?", a: "Divide both parts of the ratio by their Greatest Common Divisor (GCD). For 12:8, GCD(12,8)=4, so 12:8 = 3:2. The simplified ratio has the same relationship but uses the smallest whole numbers." },
  { q: "How do you solve a proportion?", a: "In a proportion A:B = C:D, the cross-products are equal: A×D = B×C. To find the missing value, isolate it. For example: 2:3 = x:12 → x = (2×12)/3 = 8." },
  { q: "What is the difference between a ratio and a fraction?", a: "A fraction represents a part of a whole (3/4 = three-quarters of something). A ratio compares two separate quantities (3:4 = for every 3 of A there are 4 of B). Fractions are a special case of ratios." },
  { q: "How do you scale a ratio up or down?", a: "Multiply or divide both parts by the same number. If a recipe calls for 2:3 (flour:sugar) and you want to double it, multiply both by 2 to get 4:6 (which simplifies back to 2:3)." },
  { q: "What is a ratio in baking or cooking?", a: "Cooking ratios help scale recipes. The classic bread ratio is 5:3 (flour:water) by weight. The pasta dough ratio is 2:1 (flour:eggs). Knowing ratios lets you scale any recipe up or down correctly." },
  { q: "How do you express a ratio as a percentage?", a: "In ratio A:B, the total is A+B. A% = A/(A+B) × 100, B% = B/(A+B) × 100. For example, 3:7 → 3 is 30% and 7 is 70% of the total." },
];

const EXAMPLES = [
  { label: "Map scale (1:1000)", a: 1, b: 1000 },
  { label: "Golden ratio (≈1.618:1)", a: 1.618, b: 1 },
  { label: "HD aspect ratio (16:9)", a: 16, b: 9 },
  { label: "Recipe (2:3 flour:water)", a: 2, b: 3 },
  { label: "Concrete mix (1:2:4)", a: 1, b: 4 },
];

const LD_JSON = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", "name": "Ratio Calculator", "description": "Free online ratio calculator. Simplify ratios, solve proportions, find equivalent ratios, and scale ratios.", "applicationCategory": "UtilityApplication", "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } },
    { "@type": "FAQPage", "mainEntity": FAQS.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) },
  ],
};

const TABS: { key: Mode; label: string }[] = [
  { key: "simplify",    label: "Simplify Ratio" },
  { key: "equivalent",  label: "Equivalent Ratio" },
  { key: "proportion",  label: "Solve Proportion" },
  { key: "scale",       label: "Scale Ratio" },
];

export default function RatioCalculator() {
  const [mode, setMode] = useState<Mode>("simplify");
  // Simplify
  const [sa, setSa] = useState("12");
  const [sb, setSb] = useState("8");
  // Equivalent
  const [ea, setEa] = useState("3");
  const [eb, setEb] = useState("4");
  const [emul, setEmul] = useState("5");
  // Proportion A:B = C:?
  const [pa, setPa] = useState("2");
  const [pb, setPb] = useState("3");
  const [pc, setPc] = useState("8");
  // Scale
  const [sca, setSca] = useState("3");
  const [scb, setScb] = useState("5");
  const [scfactor, setScfactor] = useState("3");

  const simplifyResult = useMemo(() => {
    const a = parseFloat(sa), b = parseFloat(sb);
    if (!isFinite(a) || !isFinite(b) || a < 0 || b < 0) return null;
    const g = gcd(a, b);
    const ra = parseFloat((a / g).toPrecision(10));
    const rb = parseFloat((b / g).toPrecision(10));
    const total = a + b;
    return { simplified: `${ra} : ${rb}`, pctA: total > 0 ? parseFloat(((a / total) * 100).toFixed(2)) : 0, pctB: total > 0 ? parseFloat(((b / total) * 100).toFixed(2)) : 0, decimal: parseFloat((a / b).toPrecision(6)) };
  }, [sa, sb]);

  const equivalentResult = useMemo(() => {
    const a = parseFloat(ea), b = parseFloat(eb), m = parseFloat(emul);
    if (!isFinite(a) || !isFinite(b) || !isFinite(m)) return null;
    return { a: parseFloat((a * m).toPrecision(10)), b: parseFloat((b * m).toPrecision(10)) };
  }, [ea, eb, emul]);

  const proportionResult = useMemo(() => {
    const a = parseFloat(pa), b = parseFloat(pb), c = parseFloat(pc);
    if (!isFinite(a) || !isFinite(b) || !isFinite(c) || a === 0) return null;
    return { d: parseFloat(((b * c) / a).toPrecision(10)) };
  }, [pa, pb, pc]);

  const scaleResult = useMemo(() => {
    const a = parseFloat(sca), b = parseFloat(scb), f = parseFloat(scfactor);
    if (!isFinite(a) || !isFinite(b) || !isFinite(f)) return null;
    return { a: parseFloat((a * f).toPrecision(10)), b: parseFloat((b * f).toPrecision(10)) };
  }, [sca, scb, scfactor]);

  return (
    <>
      <Helmet>
        <title>Ratio Calculator – Simplify, Solve & Scale Ratios | US Online Tools</title>
        <meta name="description" content="Free online ratio calculator. Simplify ratios, find equivalent ratios, solve proportions (A:B = C:?), and scale ratios up or down. Includes step-by-step solutions." />
        <meta name="keywords" content="ratio calculator, simplify ratio, equivalent ratio, proportion calculator, solve proportion, ratio simplifier, ratio to fraction" />
        <link rel="canonical" href="https://us-online.tools/math/ratio-calculator" />
        <script type="application/ld+json">{JSON.stringify(LD_JSON)}</script>
      </Helmet>

      <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]" style={{"--calc-hue": "172"} as React.CSSProperties}>

        <section className="bg-gradient-to-br from-[hsl(172,70%,16%)] to-[hsl(172,60%,26%)] text-white py-14 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Ratio Calculator</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">Simplify ratios, find equivalent ratios, solve proportions, and scale — with step-by-step solutions.</p>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

          {/* Quick Answer */}
          <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl p-5">
            <h2 className="font-bold text-teal-800 dark:text-teal-300 mb-2">⚡ Quick Reference</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-teal-900 dark:text-teal-200">
              <p>• <strong>Simplify A:B</strong> — divide both by GCD(A,B)</p>
              <p>• <strong>Equivalent</strong> — multiply both parts by same number</p>
              <p>• <strong>A:B = C:D</strong> — cross multiply: A×D = B×C</p>
              <p>• <strong>Scale factor 3</strong> on 2:5 → 6:15 (same ratio)</p>
            </div>
          </div>

          {/* Calculator */}
          <div className="tool-calc-card rounded-2xl p-6 md:p-8 shadow-xl">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 bg-[hsl(var(--muted))] rounded-xl p-1">
              {TABS.map(t => (
                <button key={t.key} onClick={() => setMode(t.key)}
                  className={`flex-1 min-w-[130px] py-2 px-2 rounded-lg text-xs font-semibold transition-all text-center ${mode === t.key ? "bg-white dark:bg-[hsl(var(--background))] shadow text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Simplify */}
            {mode === "simplify" && (
              <div>
                <div className="flex items-center gap-3 mb-6 justify-center">
                  <input type="number" value={sa} onChange={e => setSa(e.target.value)} className="tool-calc-input w-28 text-center text-2xl" placeholder="A" />
                  <span className="text-3xl font-bold text-[hsl(var(--muted-foreground))]">:</span>
                  <input type="number" value={sb} onChange={e => setSb(e.target.value)} className="tool-calc-input w-28 text-center text-2xl" placeholder="B" />
                </div>
                {simplifyResult ? (
                  <div className="space-y-4">
                    <div className="tool-calc-result rounded-2xl p-5 text-center">
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Simplified Ratio</p>
                      <p className="tool-calc-number text-4xl font-extrabold">{simplifyResult.simplified}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="tool-calc-result rounded-xl p-4 text-center">
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">A is</p>
                        <p className="tool-calc-number font-bold text-xl">{simplifyResult.pctA}%</p>
                      </div>
                      <div className="tool-calc-result rounded-xl p-4 text-center">
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">B is</p>
                        <p className="tool-calc-number font-bold text-xl">{simplifyResult.pctB}%</p>
                      </div>
                      <div className="tool-calc-result rounded-xl p-4 text-center">
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">A ÷ B</p>
                        <p className="tool-calc-number font-bold text-xl">{simplifyResult.decimal}</p>
                      </div>
                    </div>
                    <div className="bg-[hsl(var(--muted))] rounded-xl p-4 text-sm font-mono">
                      <p className="font-sans font-semibold mb-1">Steps:</p>
                      <p>1. GCD({sa}, {sb}) = {parseFloat(gcd(parseFloat(sa), parseFloat(sb)).toPrecision(6))}</p>
                      <p>2. {sa} ÷ GCD = {simplifyResult.simplified.split(":")[0].trim()}</p>
                      <p>3. {sb} ÷ GCD = {simplifyResult.simplified.split(":")[1].trim()}</p>
                      <p>4. Simplified: <strong>{simplifyResult.simplified}</strong></p>
                    </div>
                  </div>
                ) : <p className="text-center text-[hsl(var(--muted-foreground))] py-6">Enter two positive numbers above.</p>}
              </div>
            )}

            {/* Equivalent */}
            {mode === "equivalent" && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <div className="flex-1">
                      <label className="text-xs text-[hsl(var(--muted-foreground))] mb-1 block">A</label>
                      <input type="number" value={ea} onChange={e => setEa(e.target.value)} className="tool-calc-input w-full text-xl text-center" />
                    </div>
                    <span className="text-2xl font-bold text-[hsl(var(--muted-foreground))] mt-5">:</span>
                    <div className="flex-1">
                      <label className="text-xs text-[hsl(var(--muted-foreground))] mb-1 block">B</label>
                      <input type="number" value={eb} onChange={e => setEb(e.target.value)} className="tool-calc-input w-full text-xl text-center" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[hsl(var(--muted-foreground))] mb-1 block">Multiplier</label>
                    <input type="number" value={emul} onChange={e => setEmul(e.target.value)} className="tool-calc-input w-full text-xl text-center" />
                  </div>
                </div>
                {equivalentResult ? (
                  <div className="tool-calc-result rounded-2xl p-5 text-center">
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Equivalent Ratio ({ea}:{eb} × {emul})</p>
                    <p className="tool-calc-number text-4xl font-extrabold">{equivalentResult.a} : {equivalentResult.b}</p>
                  </div>
                ) : <p className="text-center text-[hsl(var(--muted-foreground))] py-6">Enter values above.</p>}
              </div>
            )}

            {/* Proportion */}
            {mode === "proportion" && (
              <div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4 text-center">Solve: A : B = C : <strong>?</strong></p>
                <div className="flex flex-wrap items-center gap-3 mb-6 justify-center text-2xl">
                  <input type="number" value={pa} onChange={e => setPa(e.target.value)} className="tool-calc-input w-24 text-center" />
                  <span className="font-bold text-[hsl(var(--muted-foreground))]">:</span>
                  <input type="number" value={pb} onChange={e => setPb(e.target.value)} className="tool-calc-input w-24 text-center" />
                  <span className="font-bold text-[hsl(var(--muted-foreground))]">=</span>
                  <input type="number" value={pc} onChange={e => setPc(e.target.value)} className="tool-calc-input w-24 text-center" />
                  <span className="font-bold text-[hsl(var(--muted-foreground))]">: ?</span>
                </div>
                {proportionResult ? (
                  <div className="space-y-4">
                    <div className="tool-calc-result rounded-2xl p-5 text-center">
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Missing Value</p>
                      <p className="tool-calc-number text-4xl font-extrabold">D = {proportionResult.d}</p>
                    </div>
                    <div className="bg-[hsl(var(--muted))] rounded-xl p-4 text-sm font-mono">
                      <p className="font-sans font-semibold mb-1">Cross-multiplication:</p>
                      <p>{pa} × D = {pb} × {pc}</p>
                      <p>D = ({pb} × {pc}) ÷ {pa} = <strong>{proportionResult.d}</strong></p>
                    </div>
                  </div>
                ) : <p className="text-center text-[hsl(var(--muted-foreground))] py-6">Enter values above.</p>}
              </div>
            )}

            {/* Scale */}
            {mode === "scale" && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <div className="flex-1">
                      <label className="text-xs text-[hsl(var(--muted-foreground))] mb-1 block">A</label>
                      <input type="number" value={sca} onChange={e => setSca(e.target.value)} className="tool-calc-input w-full text-xl text-center" />
                    </div>
                    <span className="text-2xl font-bold text-[hsl(var(--muted-foreground))] mt-5">:</span>
                    <div className="flex-1">
                      <label className="text-xs text-[hsl(var(--muted-foreground))] mb-1 block">B</label>
                      <input type="number" value={scb} onChange={e => setScb(e.target.value)} className="tool-calc-input w-full text-xl text-center" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[hsl(var(--muted-foreground))] mb-1 block">Scale Factor</label>
                    <input type="number" value={scfactor} onChange={e => setScfactor(e.target.value)} className="tool-calc-input w-full text-xl text-center" />
                  </div>
                </div>
                {scaleResult ? (
                  <div className="tool-calc-result rounded-2xl p-5 text-center">
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Scaled Ratio ({sca}:{scb} × {scfactor})</p>
                    <p className="tool-calc-number text-4xl font-extrabold">{scaleResult.a} : {scaleResult.b}</p>
                  </div>
                ) : <p className="text-center text-[hsl(var(--muted-foreground))] py-6">Enter values above.</p>}
              </div>
            )}
          </div>

          {/* Common Ratios */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Common Real-World Ratios</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: "HD Screen (16:9)", ratio: "16 : 9" },
                { name: "Standard Photo (4:3)", ratio: "4 : 3" },
                { name: "Golden Ratio", ratio: "1.618 : 1" },
                { name: "Map Scale (1:10,000)", ratio: "1 : 10,000" },
                { name: "Concrete Mix", ratio: "1 : 2 : 4" },
                { name: "Pi Approx (22:7)", ratio: "22 : 7" },
                { name: "Marathon distance", ratio: "26.2 : 1 mi" },
                { name: "Coffee to water", ratio: "1 : 15 to 18" },
                { name: "Human DNA A:T G:C", ratio: "1 : 1 each" },
              ].map((ex, i) => (
                <div key={i} className="tool-calc-result rounded-xl p-4">
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">{ex.name}</p>
                  <p className="tool-calc-number font-bold text-lg">{ex.ratio}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Examples click-to-load */}
          <section>
            <h2 className="text-xl font-bold mb-3">Load an Example</h2>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex, i) => (
                <button key={i} onClick={() => { setSa(ex.a.toString()); setSb(ex.b.toString()); setMode("simplify"); }}
                  className="px-4 py-2 rounded-full border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors text-sm">{ex.label}</button>
              ))}
            </div>
          </section>

          {/* Content */}
          <section className="prose prose-neutral dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-4">How to Work with Ratios</h2>
            <p>A ratio compares two or more quantities. The ratio 3:4 means "for every 3 of the first quantity, there are 4 of the second." Ratios are used in cooking, maps, models, finance, and throughout mathematics.</p>
            <h3 className="text-xl font-bold mt-6 mb-3">Simplifying Ratios</h3>
            <p>To simplify, find the GCD of both numbers and divide each by it. For 18:24 — GCD(18,24)=6 — so 18:24 = <strong>3:4</strong>. A simplified ratio uses the smallest possible whole numbers.</p>
            <h3 className="text-xl font-bold mt-6 mb-3">Solving Proportions</h3>
            <p>A proportion states two ratios are equal: A:B = C:D. Use cross-multiplication: A×D = B×C. This is fundamental in scaling recipes, unit conversion, and similarity in geometry.</p>
            <h3 className="text-xl font-bold mt-6 mb-3">Ratio in Finance</h3>
            <p>Key financial ratios include the <strong>P/E ratio</strong> (price-to-earnings), <strong>debt-to-equity ratio</strong>, and <strong>current ratio</strong>. These compare financial metrics to assess a company's health and valuation.</p>
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
                { label: "Fraction to Decimal", href: "/math/fraction-to-decimal-calculator" },
                { label: "Percentage Calculator", href: "/math/percentage-calculator" },
                { label: "Average Calculator", href: "/math/average-calculator" },
                { label: "Percentage Change Calculator", href: "/math/percentage-change-calculator" },
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
