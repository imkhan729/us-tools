import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight, ArrowLeftRight,
  Calculator, Lightbulb, Copy, Check,
  BadgeCheck, Zap, Lock, Shield, Smartphone, Star,
  Percent, BarChart3, Hash, Sigma, Divide,
} from "lucide-react";

// ── Math Logic ──
function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function decimalToFraction(dec: number): { num: number; den: number; mixed?: string } | null {
  if (!isFinite(dec)) return null;
  const sign = dec < 0 ? -1 : 1;
  dec = Math.abs(dec);
  const precision = 1e7;
  const num = Math.round(dec * precision);
  const den = precision;
  const d = gcd(num, den);
  const n = (num / d) * sign;
  const dn = den / d;
  const whole = Math.floor(Math.abs(n / dn)) * sign;
  const rem = Math.abs(n) % dn;
  const mixed = whole !== 0 && rem !== 0 ? `${whole} ${rem}/${dn}` : undefined;
  return { num: n, den: dn, mixed };
}

function fracToDecimal(num: number, den: number): number | null {
  if (den === 0 || !isFinite(num) || !isFinite(den)) return null;
  return num / den;
}

function isRepeating(num: number, den: number): boolean {
  if (den === 0) return false;
  const d = den / gcd(Math.abs(num), den);
  let dd = d;
  while (dd % 2 === 0) dd /= 2;
  while (dd % 5 === 0) dd /= 5;
  return dd !== 1;
}

type Mode = "frac2dec" | "dec2frac";

// ── Copy Button ──
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Copy">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
    </button>
  );
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-violet-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-violet-500">
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
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 217, benefit: "Find percentages of any number" },
  { title: "Average Calculator", slug: "average-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 45, benefit: "Mean, median, mode instantly" },
  { title: "Ratio Calculator", slug: "ratio-calculator", icon: <Divide className="w-5 h-5" />, color: 152, benefit: "Simplify and compare ratios" },
  { title: "GCD Calculator", slug: "online-gcd-calculator", icon: <Hash className="w-5 h-5" />, color: 35, benefit: "Greatest common divisor tool" },
  { title: "LCM Calculator", slug: "online-lcm-calculator", icon: <Sigma className="w-5 h-5" />, color: 300, benefit: "Least common multiple finder" },
];

// ── Common Fractions Reference ──
const COMMON_FRACTIONS = [
  { num: 1, den: 2,  dec: "0.5",     pct: "50%" },
  { num: 1, den: 3,  dec: "0.3333…", pct: "33.33%" },
  { num: 1, den: 4,  dec: "0.25",    pct: "25%" },
  { num: 1, den: 5,  dec: "0.2",     pct: "20%" },
  { num: 1, den: 6,  dec: "0.1666…", pct: "16.67%" },
  { num: 1, den: 8,  dec: "0.125",   pct: "12.5%" },
  { num: 2, den: 3,  dec: "0.6666…", pct: "66.67%" },
  { num: 3, den: 4,  dec: "0.75",    pct: "75%" },
  { num: 3, den: 8,  dec: "0.375",   pct: "37.5%" },
  { num: 5, den: 8,  dec: "0.625",   pct: "62.5%" },
  { num: 7, den: 8,  dec: "0.875",   pct: "87.5%" },
  { num: 1, den: 10, dec: "0.1",     pct: "10%" },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Online Fraction to Decimal Calculator",
      description: "Convert any fraction to decimal or decimal to fraction instantly. Shows simplified form, percentage equivalent, and repeating decimal detection.",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      url: "https://usonlinetools.com/math/fraction-to-decimal-calculator",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "How do I convert a fraction to a decimal?", acceptedAnswer: { "@type": "Answer", text: "Divide the numerator by the denominator. For example, 3/4 = 3 ÷ 4 = 0.75." } },
        { "@type": "Question", name: "What is a repeating decimal?", acceptedAnswer: { "@type": "Answer", text: "A repeating decimal has one or more digits that repeat infinitely, like 1/3 = 0.3333… or 1/7 = 0.142857…" } },
      ],
    },
  ],
};

export default function FractionToDecimalCalculator() {
  const [mode, setMode] = useState<Mode>("frac2dec");
  const [num, setNum] = useState("3");
  const [den, setDen] = useState("4");
  const [decInput, setDecInput] = useState("0.75");
  const [copied, setCopied] = useState(false);

  const f2d = useMemo(() => {
    const n = parseFloat(num);
    const d = parseFloat(den);
    const res = fracToDecimal(n, d);
    if (res === null) return null;
    const simplified_d = gcd(Math.abs(n), Math.abs(d));
    return {
      decimal: parseFloat(res.toPrecision(12)).toString(),
      simplified: `${n / simplified_d}/${d / simplified_d}`,
      repeating: isRepeating(n, d),
      percentage: `${parseFloat((res * 100).toPrecision(8))}%`,
    };
  }, [num, den]);

  const d2f = useMemo(() => decimalToFraction(parseFloat(decInput)), [decInput]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const insight = (() => {
    if (mode === "frac2dec" && f2d) {
      return `${num}/${den} = ${f2d.decimal} (${f2d.percentage}). ${f2d.repeating ? "This is a repeating decimal — the digits continue infinitely." : "This is a terminating decimal — it ends at a finite number of digits."} Simplified form: ${f2d.simplified}.`;
    }
    if (mode === "dec2frac" && d2f) {
      return `${decInput} as a fraction is ${d2f.num}/${d2f.den}${d2f.mixed ? ` or the mixed number ${d2f.mixed}` : ""}. This was found by multiplying both parts by a power of 10 and simplifying via GCD.`;
    }
    return null;
  })();

  return (
    <Layout>
      <SEO
        title="Online Fraction to Decimal Calculator – Convert Fractions & Decimals Free"
        description="Free online fraction to decimal calculator. Convert any fraction to decimal or decimal to fraction instantly. Shows simplified form, percentage, and repeating decimal detection. No signup required."
        canonical="https://usonlinetools.com/math/fraction-to-decimal-calculator"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <span className="text-foreground">Fraction to Decimal Calculator</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-violet-500/15 bg-gradient-to-br from-violet-500/5 via-card to-purple-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" />
            Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Online Fraction to Decimal Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Convert any fraction to a decimal or decimal to a fraction instantly. Shows simplified form, percentage equivalent, and detects repeating decimals. No login required.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Results
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs px-3 py-1.5 rounded-full border border-purple-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Math &amp; Calculators &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-violet-500/20 shadow-lg shadow-violet-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 to-purple-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center flex-shrink-0">
                      <ArrowLeftRight className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Two-Way Converter</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  {/* Mode Toggle */}
                  <div className="flex gap-2 bg-muted rounded-xl p-1">
                    {([["frac2dec", "Fraction → Decimal"], ["dec2frac", "Decimal → Fraction"]] as [Mode, string][]).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setMode(key)}
                        className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                          mode === key
                            ? "bg-card shadow text-foreground border border-border"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {key === "frac2dec" ? <>½ <ArrowLeftRight className="w-3.5 h-3.5" /> 0.5</> : <>0.5 <ArrowLeftRight className="w-3.5 h-3.5" /> ½</>}
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Fraction → Decimal */}
                  {mode === "frac2dec" ? (
                    <div className="tool-calc-card" style={{ "--calc-hue": 270 } as React.CSSProperties}>
                      <h3 className="text-lg font-bold text-foreground mb-5">Fraction to Decimal</h3>
                      <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
                        <div className="text-center">
                          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Numerator</label>
                          <input
                            type="number"
                            value={num}
                            onChange={e => setNum(e.target.value)}
                            className="tool-calc-input w-28 text-center text-xl"
                          />
                        </div>
                        <div className="text-3xl font-black text-muted-foreground select-none mt-4">/</div>
                        <div className="text-center">
                          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Denominator</label>
                          <input
                            type="number"
                            value={den}
                            onChange={e => setDen(e.target.value)}
                            className="tool-calc-input w-28 text-center text-xl"
                          />
                        </div>
                        <span className="text-lg font-black text-muted-foreground mt-4">=</span>
                        <div className="flex-1 w-full">
                          {f2d ? (
                            <div className="space-y-3">
                              <div className="tool-calc-result w-full flex items-center justify-between">
                                <span className="text-xl font-black text-violet-600 dark:text-violet-400">{f2d.decimal}</span>
                                <CopyBtn text={f2d.decimal} />
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="tool-calc-result text-center p-2">
                                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Simplified</p>
                                  <p className="text-sm font-bold text-foreground">{f2d.simplified}</p>
                                </div>
                                <div className="tool-calc-result text-center p-2">
                                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Percentage</p>
                                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{f2d.percentage}</p>
                                </div>
                                <div className="tool-calc-result text-center p-2">
                                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Type</p>
                                  <p className={`text-sm font-bold ${f2d.repeating ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"}`}>
                                    {f2d.repeating ? "Repeating" : "Terminating"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="tool-calc-result w-full text-muted-foreground text-center">--</div>
                          )}
                        </div>
                      </div>

                      {insight && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                          <div className="flex gap-2 items-start">
                            <Lightbulb className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-foreground/80 leading-relaxed">{insight}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    /* Decimal → Fraction */
                    <div className="tool-calc-card" style={{ "--calc-hue": 270 } as React.CSSProperties}>
                      <h3 className="text-lg font-bold text-foreground mb-5">Decimal to Fraction</h3>
                      <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
                        <div className="flex-1 w-full">
                          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Decimal Number</label>
                          <input
                            type="number"
                            step="any"
                            value={decInput}
                            onChange={e => setDecInput(e.target.value)}
                            placeholder="e.g. 0.75"
                            className="tool-calc-input w-full text-xl"
                          />
                        </div>
                        <span className="text-lg font-black text-muted-foreground">=</span>
                        <div className="flex-1 w-full">
                          {d2f ? (
                            <div className="space-y-3">
                              <div className="tool-calc-result w-full flex items-center justify-between">
                                <span className="text-xl font-black text-violet-600 dark:text-violet-400">{d2f.num}/{d2f.den}</span>
                                <CopyBtn text={`${d2f.num}/${d2f.den}`} />
                              </div>
                              {d2f.mixed && (
                                <div className="tool-calc-result w-full">
                                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Mixed Number</p>
                                  <p className="font-bold text-foreground">{d2f.mixed}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="tool-calc-result w-full text-muted-foreground text-center">--</div>
                          )}
                        </div>
                      </div>

                      {insight && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                          <div className="flex gap-2 items-start">
                            <Lightbulb className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-foreground/80 leading-relaxed">{insight}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ── COMMON FRACTIONS REFERENCE ── */}
            <section id="reference-table" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Common Fraction to Decimal Reference</h2>
              <p className="text-sm text-muted-foreground mb-5">Click any row to load it into the calculator above.</p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Fraction</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Decimal</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {COMMON_FRACTIONS.map((f, i) => (
                      <tr
                        key={i}
                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => { setMode("frac2dec"); setNum(f.num.toString()); setDen(f.den.toString()); }}
                      >
                        <td className="px-4 py-3 font-bold text-violet-600 dark:text-violet-400">{f.num}/{f.den}</td>
                        <td className="px-4 py-3 font-mono text-foreground">{f.dec}</td>
                        <td className="px-4 py-3 text-muted-foreground">{f.pct}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use This Calculator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Choose conversion direction</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Toggle between "Fraction → Decimal" (convert 3/4 to 0.75) and "Decimal → Fraction" (convert 0.75 to 3/4). Both modes update results in real time as you type.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter your values</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">For fractions, type the numerator and denominator separately. For decimals, enter any finite decimal like 0.333 or 1.5. The calculator accepts negative values and numbers greater than 1.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Read the full result breakdown</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">For fraction-to-decimal, you get the decimal result, simplified fraction form, percentage equivalent, and whether it's a terminating or repeating decimal. The plain-English insight below the result explains exactly what the number means.</p>
                  </div>
                </li>
              </ol>

              <div className="mt-6 p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formulas</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-violet-500 font-bold w-4 flex-shrink-0">→</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Decimal = Numerator ÷ Denominator</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-purple-500 font-bold w-4 flex-shrink-0">←</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Fraction = Decimal × 10ⁿ / 10ⁿ, then simplify by GCD</code>
                  </div>
                </div>
              </div>
            </section>

            {/* ── RESULT INTERPRETATION ── */}
            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Interpretation</h2>
              <p className="text-sm text-muted-foreground mb-6">Understanding terminating vs repeating decimals:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Terminating decimal (e.g. 0.75)</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">The decimal ends at a fixed number of digits. This happens when the denominator (in lowest terms) has no prime factors other than 2 and 5. Examples: 1/4 = 0.25, 1/8 = 0.125, 3/20 = 0.15.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Repeating decimal (e.g. 0.3333…)</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">The digits repeat infinitely. This occurs when the denominator contains prime factors other than 2 or 5. Examples: 1/3 = 0.333…, 1/7 = 0.142857…, 2/9 = 0.222… The calculator shows a truncated approximation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                  <div className="w-3 h-3 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Simplified fraction form</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">The calculator reduces every fraction to its lowest terms using the Greatest Common Divisor (GCD). For 6/8: GCD(6,8)=2, so 6/8 simplifies to 3/4. This is the most useful form for math problems and comparisons.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Fraction</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Decimal</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">%</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { frac: "1/2", dec: "0.5", pct: "50%", type: "Terminating" },
                      { frac: "1/3", dec: "0.3333…", pct: "33.33%", type: "Repeating" },
                      { frac: "3/4", dec: "0.75", pct: "75%", type: "Terminating" },
                      { frac: "2/3", dec: "0.6666…", pct: "66.67%", type: "Repeating" },
                      { frac: "5/8", dec: "0.625", pct: "62.5%", type: "Terminating" },
                    ].map(row => (
                      <tr key={row.frac} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-violet-600 dark:text-violet-400">{row.frac}</td>
                        <td className="px-4 py-3 font-mono text-foreground">{row.dec}</td>
                        <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold">{row.pct}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{row.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-5 rounded-xl bg-violet-500/5 border border-violet-500/15">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"The reference table is incredibly handy — I click a common fraction and it instantly shows me the decimal. Saved me a lot of time on my homework."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2026</p>
              </div>
            </section>

            {/* ── WHY CHOOSE THIS ── */}
            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Fraction to Decimal Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Two-way conversion in one tool.</strong> Most converters only go one direction. This tool handles both fraction-to-decimal and decimal-to-fraction, eliminating the need to switch between tools or tabs.</p>
                <p><strong className="text-foreground">Repeating decimal detection.</strong> The calculator automatically tells you whether your result is a terminating or repeating decimal — a distinction that matters in math, science, and engineering contexts where exact representation is required.</p>
                <p><strong className="text-foreground">Full result breakdown — not just the number.</strong> You get the decimal, simplified fraction, percentage equivalent, and a plain-English explanation of what the result means. Ideal for students, teachers, and anyone who wants to understand the math, not just the answer.</p>
                <p><strong className="text-foreground">Click-to-load reference table.</strong> The common fractions table isn't just decorative — clicking any row loads it directly into the calculator, letting you verify and explore relationships between fractions and decimals interactively.</p>
                <p><strong className="text-foreground">100% private, 100% instant.</strong> All calculations run in your browser. Nothing is sent to a server. Results appear the moment you type, with no button press required.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> The decimal-to-fraction conversion uses a precision of 10,000,000 (1e7) for the multiplication step. Very long repeating decimals entered manually may produce slightly different simplified fractions than the mathematically exact result. For highest accuracy, enter the fraction directly in fraction mode.
                </p>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How do I convert a fraction to a decimal?" a="Divide the numerator by the denominator. For example, 3/4 = 3 ÷ 4 = 0.75. If the result is a repeating decimal, it means the denominator (in lowest terms) has prime factors other than 2 and 5." />
                <FaqItem q="How do I convert a decimal to a fraction?" a="Write the decimal over 1 (e.g., 0.75/1), then multiply both by 10 for each decimal place (75/100), then simplify by dividing by the GCD. 75/100 → divide by 25 → 3/4." />
                <FaqItem q="What is a repeating decimal?" a="A repeating decimal has one or more digits that repeat infinitely, like 1/3 = 0.3333… or 1/7 = 0.142857142857…. Any fraction with a denominator whose prime factors include anything other than 2 or 5 will produce a repeating decimal." />
                <FaqItem q="What is a mixed number?" a="A mixed number combines a whole number and a proper fraction, like 2½ (two and one-half = 2.5). To convert to an improper fraction: multiply the whole by the denominator and add the numerator: 2½ = (2×2+1)/2 = 5/2." />
                <FaqItem q="What is GCD and why does it matter for fractions?" a="GCD (Greatest Common Divisor) is the largest number that divides both the numerator and denominator evenly. Dividing both by the GCD gives the simplest form. For example, GCD(6,9)=3, so 6/9 = 2/3." />
                <FaqItem q="Is 0.1 exactly representable in binary?" a="No — 0.1 in decimal is a repeating fraction in binary (0.000110011…). This is why floating-point arithmetic in computers can produce tiny rounding errors like 0.1 + 0.2 = 0.30000000000000004." />
                <FaqItem q="Can I convert negative fractions?" a="Yes. Enter a negative numerator like -3 with denominator 4 to get -0.75. The simplified fraction will preserve the negative sign." />
                <FaqItem q="Is this calculator free and private?" a="100% free with no signup required. All calculations run locally in your browser — no data is transmitted or stored anywhere." />
              </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Math Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore 400+ free tools including percentage calculators, unit converters, developer tools, and more — all free, all instant.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-violet-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others convert fractions easily.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-500 to-purple-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    { label: "Calculator", href: "#calculator" },
                    { label: "Reference Table", href: "#reference-table" },
                    { label: "How to Use", href: "#how-to-use" },
                    { label: "Result Interpretation", href: "#result-interpretation" },
                    { label: "Quick Examples", href: "#quick-examples" },
                    { label: "Why Choose This", href: "#why-choose-this" },
                    { label: "FAQ", href: "#faq" },
                  ].map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-violet-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500/30 flex-shrink-0" />
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
