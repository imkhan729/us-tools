import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeftRight, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "frac2dec" | "dec2frac";

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

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <button onClick={copy} className="p-1.5 rounded hover:bg-white/20 transition-colors" title="Copy">
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="opacity-60" />}
    </button>
  );
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

const FAQS = [
  { q: "How do I convert a fraction to a decimal?", a: "Divide the numerator by the denominator. For example, 3/4 = 3 ÷ 4 = 0.75. If the result is a repeating decimal, it means the denominator (in lowest terms) has prime factors other than 2 and 5." },
  { q: "How do I convert a decimal to a fraction?", a: "Write the decimal over 1 (e.g., 0.75/1), then multiply both by 10 for each decimal place (75/100), then simplify by dividing by the GCD. 75/100 → divide by 25 → 3/4." },
  { q: "What is a repeating decimal?", a: "A repeating decimal has one or more digits that repeat infinitely, like 1/3 = 0.3333… or 1/7 = 0.142857142857…. Any fraction with a denominator whose prime factors include anything other than 2 or 5 will produce a repeating decimal." },
  { q: "What is a mixed number?", a: "A mixed number combines a whole number and a proper fraction, like 2½ (two and one-half = 2.5). To convert to an improper fraction: multiply the whole by the denominator and add the numerator: 2½ = (2×2+1)/2 = 5/2." },
  { q: "What is GCD and why is it important for fractions?", a: "GCD (Greatest Common Divisor) is the largest number that divides both the numerator and denominator evenly. Dividing both by the GCD gives the simplest (fully reduced) form of the fraction. For example, GCD(6,9)=3, so 6/9 = 2/3." },
  { q: "Is 0.1 exactly representable in binary?", a: "No — 0.1 in decimal is a repeating fraction in binary (0.000110011…). This is why floating-point arithmetic in computers can produce tiny rounding errors like 0.1 + 0.2 = 0.30000000000000004." },
];

const LD_JSON = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", "name": "Fraction to Decimal Calculator", "description": "Convert fractions to decimals and decimals to fractions instantly. Shows simplification steps.", "applicationCategory": "UtilityApplication", "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } },
    { "@type": "FAQPage", "mainEntity": FAQS.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) },
  ],
};

export default function FractionToDecimalCalculator() {
  const [mode, setMode] = useState<Mode>("frac2dec");
  const [num, setNum] = useState("3");
  const [den, setDen] = useState("4");
  const [decInput, setDecInput] = useState("0.75");

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

  return (
    <>
      <Helmet>
        <title>Fraction to Decimal Calculator – Convert Fractions & Decimals | US Online Tools</title>
        <meta name="description" content="Free fraction to decimal calculator. Convert any fraction to decimal or decimal to fraction with simplification steps. Includes common fraction reference table." />
        <meta name="keywords" content="fraction to decimal calculator, decimal to fraction, convert fraction, simplify fractions, mixed number calculator, repeating decimal" />
        <link rel="canonical" href="https://us-online.tools/math/fraction-to-decimal-calculator" />
        <script type="application/ld+json">{JSON.stringify(LD_JSON)}</script>
      </Helmet>

      <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]" style={{"--calc-hue": "280"} as React.CSSProperties}>

        <section className="bg-gradient-to-br from-[hsl(var(--calc-hue),70%,18%)] to-[hsl(var(--calc-hue),60%,28%)] text-white py-14 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Fraction ↔ Decimal Calculator</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">Convert any fraction to a decimal (or decimal to fraction) instantly, with simplified form and percentage equivalent.</p>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

          {/* Quick Answer */}
          <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl p-5">
            <h2 className="font-bold text-purple-800 dark:text-purple-300 mb-2">⚡ Quick Answer</h2>
            <p className="text-sm text-purple-900 dark:text-purple-200">
              To convert a fraction to decimal: <strong>divide numerator ÷ denominator</strong>. Example: 3/4 = 3 ÷ 4 = <strong>0.75</strong> = 75%.<br />
              To convert decimal to fraction: write over 1, multiply to clear decimals, then simplify. Example: 0.75 = 75/100 = <strong>3/4</strong>.
            </p>
          </div>

          {/* Calculator */}
          <div className="tool-calc-card rounded-2xl p-6 md:p-8 shadow-xl">
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6 bg-[hsl(var(--muted))] rounded-xl p-1">
              {([["frac2dec", "Fraction → Decimal"], ["dec2frac", "Decimal → Fraction"]] as [Mode, string][]).map(([key, label]) => (
                <button key={key} onClick={() => setMode(key)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${mode === key ? "bg-white dark:bg-[hsl(var(--background))] shadow text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"}`}>
                  {key === "frac2dec" ? <>½ <ArrowLeftRight size={14} /> 0.5</> : <>0.5 <ArrowLeftRight size={14} /> ½</>} {label}
                </button>
              ))}
            </div>

            {mode === "frac2dec" ? (
              <>
                <div className="flex items-center gap-4 mb-8 justify-center">
                  <div className="text-center">
                    <label className="block text-xs font-semibold mb-1 text-[hsl(var(--muted-foreground))]">Numerator</label>
                    <input type="number" value={num} onChange={e => setNum(e.target.value)} className="tool-calc-input w-28 text-center text-2xl" />
                  </div>
                  <div className="text-4xl font-bold text-[hsl(var(--muted-foreground))] select-none mt-4">/</div>
                  <div className="text-center">
                    <label className="block text-xs font-semibold mb-1 text-[hsl(var(--muted-foreground))]">Denominator</label>
                    <input type="number" value={den} onChange={e => setDen(e.target.value)} className="tool-calc-input w-28 text-center text-2xl" />
                  </div>
                </div>

                {f2d ? (
                  <div className="space-y-4">
                    <div className="tool-calc-result rounded-2xl p-6 text-center">
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">Decimal Result</p>
                      <div className="flex items-center justify-center gap-2">
                        <p className="tool-calc-number text-4xl font-extrabold">{f2d.decimal}</p>
                        <CopyBtn text={f2d.decimal} />
                      </div>
                      {f2d.repeating && <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">⚠ Repeating decimal (shown truncated)</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="tool-calc-result rounded-xl p-4 text-center">
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Simplified Fraction</p>
                        <p className="tool-calc-number font-bold text-xl">{f2d.simplified}</p>
                      </div>
                      <div className="tool-calc-result rounded-xl p-4 text-center">
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Percentage</p>
                        <p className="tool-calc-number font-bold text-xl">{f2d.percentage}</p>
                      </div>
                      <div className="tool-calc-result rounded-xl p-4 text-center">
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Decimal Type</p>
                        <p className="font-bold text-xl">{f2d.repeating ? "Repeating" : "Terminating"}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-[hsl(var(--muted-foreground))] py-6">Enter numerator and denominator above.</p>
                )}
              </>
            ) : (
              <>
                <div className="mb-8">
                  <label className="block text-sm font-semibold mb-1">Decimal Number</label>
                  <input type="number" step="any" value={decInput} onChange={e => setDecInput(e.target.value)} className="tool-calc-input w-full text-2xl" placeholder="e.g. 0.75" />
                </div>

                {d2f ? (
                  <div className="space-y-4">
                    <div className="tool-calc-result rounded-2xl p-6 text-center">
                      <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">Fraction Result</p>
                      <div className="flex items-center justify-center gap-2">
                        <p className="tool-calc-number text-4xl font-extrabold">{d2f.num}/{d2f.den}</p>
                        <CopyBtn text={`${d2f.num}/${d2f.den}`} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {d2f.mixed && (
                        <div className="tool-calc-result rounded-xl p-4 text-center">
                          <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Mixed Number</p>
                          <p className="tool-calc-number font-bold text-xl">{d2f.mixed}</p>
                        </div>
                      )}
                      <div className={`tool-calc-result rounded-xl p-4 text-center ${!d2f.mixed ? "sm:col-span-2" : ""}`}>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Percentage</p>
                        <p className="tool-calc-number font-bold text-xl">{parseFloat((parseFloat(decInput) * 100).toPrecision(8))}%</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-[hsl(var(--muted-foreground))] py-6">Enter a decimal value above.</p>
                )}
              </>
            )}
          </div>

          {/* Common Fractions Table */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Common Fraction to Decimal Reference</h2>
            <div className="overflow-x-auto rounded-2xl border border-[hsl(var(--border))]">
              <table className="w-full text-sm">
                <thead className="bg-[hsl(var(--muted))]">
                  <tr>{["Fraction", "Decimal", "Percentage"].map(h => <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {COMMON_FRACTIONS.map((f, i) => (
                    <tr key={i} className={`cursor-pointer hover:bg-[hsl(var(--muted))] transition-colors ${i % 2 === 0 ? "bg-[hsl(var(--background))]" : "bg-[hsl(var(--muted))/30]"}`}
                      onClick={() => { setMode("frac2dec"); setNum(f.num.toString()); setDen(f.den.toString()); }}>
                      <td className="px-4 py-3 font-bold text-[hsl(var(--primary))]">{f.num}/{f.den}</td>
                      <td className="px-4 py-3">{f.dec}</td>
                      <td className="px-4 py-3">{f.pct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">Click any row to load it into the calculator.</p>
          </section>

          {/* Content */}
          <section className="prose prose-neutral dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-4">How to Convert Fractions to Decimals</h2>
            <p>Every fraction represents a division problem. The numerator (top number) is divided by the denominator (bottom number). For <strong>3/4</strong>: 3 ÷ 4 = <strong>0.75</strong>.</p>

            <h3 className="text-xl font-bold mt-6 mb-3">Terminating vs Repeating Decimals</h3>
            <p>A fraction produces a <strong>terminating decimal</strong> (like 0.25 or 0.125) only when the denominator (in its simplified form) has no prime factors other than 2 and 5. All other fractions produce <strong>repeating decimals</strong> — like 1/3 = 0.333… or 1/7 = 0.142857142857…</p>

            <h3 className="text-xl font-bold mt-6 mb-3">Converting Decimals to Fractions</h3>
            <p>To convert a terminating decimal: count the decimal places (n), write the decimal over 10^n, then simplify. For <strong>0.375</strong>: 375/1000 → GCD(375,1000)=125 → <strong>3/8</strong>.</p>

            <h3 className="text-xl font-bold mt-6 mb-3">Simplifying Fractions</h3>
            <p>Always reduce fractions to their simplest form by dividing both numerator and denominator by their GCD. For 6/8: GCD(6,8)=2, so 6/8 = <strong>3/4</strong>.</p>
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
                { label: "Percentage Change Calculator", href: "/math/percentage-change-calculator" },
                { label: "Standard Deviation Calculator", href: "/math/standard-deviation-calculator" },
                { label: "Binary to Decimal Converter", href: "/conversion/binary-to-decimal-converter" },
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
