import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Calculator, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Star, DivideSquare, Scale, BarChart3, TrendingUp
} from "lucide-react";

// ── Calculator Logic ──
function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function useCalc() {
  const [decimalInput, setDecimalInput] = useState("");
  
  const result = useMemo(() => {
    const dec = parseFloat(decimalInput);
    if (isNaN(dec) || !isFinite(dec)) return null;
    
    const isNegative = dec < 0;
    const absDec = Math.abs(dec);
    const precision = 1e7;
    const num = Math.round(absDec * precision);
    const den = precision;
    const d = gcd(num, den);
    const n = num / d;
    const dn = den / d;
    
    const whole = Math.floor(n / dn);
    const mixedNum = n % dn;
    
    return {
      n: isNegative ? -n : n,
      dn,
      whole: isNegative ? -whole : whole,
      mixedNum,
      isNegative,
      original: dec
    };
  }, [decimalInput]);
  
  return { decimalInput, setDecimalInput, result };
}

// ── Result Insight Component ──
function ResultInsight({ result }: { result: any }) {
  if (!result) return null;

  let message = "";
  if (result.dn === 1) {
    message = `${result.original} is an integer, so it can simply be written as ${result.original}/1.`;
  } else if (result.whole !== 0 && result.mixedNum !== 0) {
    message = `${result.original} can be expressed as the improper fraction ${result.n}/${result.dn}, or as the mixed number ${result.whole} ${result.mixedNum}/${result.dn}.`;
  } else {
    message = `${result.original} can be expressed exactly as the simplified fraction ${result.n}/${result.dn}.`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

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
  { title: "Fraction to Decimal Calculator", slug: "fraction-to-decimal-calculator", icon: <DivideSquare className="w-5 h-5" />, color: 280, benefit: "Convert fractions back to decimals" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 217, benefit: "Calculate percentages instantly" },
  { title: "Ratio Calculator", slug: "ratio-calculator", icon: <Scale className="w-5 h-5" />, color: 265, benefit: "Simplify and compare ratios" },
  { title: "Average Calculator", slug: "average-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 217, benefit: "Mean, median, mode tool" },
];

export default function DecimalToFractionCalculator() {
  const calc = useCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Decimal to Fraction Calculator – Quick & Accurate Conversions | US Online Tools"
        description="Free online decimal to fraction calculator. Convert any decimal number to a simplified fraction and mixed number instantly. No signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math & Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">Decimal to Fraction Calculator</span>
        </nav>

        {/* ── HERO SECTION ── */}
        <section className="rounded-2xl overflow-hidden border border-blue-500/15 bg-gradient-to-br from-blue-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" />
            Math &amp; Calculators
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Decimal to Fraction Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Convert decimal numbers to fractions instantly. Easily simplify decimals to proper and improper fractions, or mixed numbers. Fully free, no login needed.
          </p>

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

            {/* ── 2. TOOL WIDGET ── */}
            <section className="space-y-5" id="calculator">
              <div className="rounded-2xl overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                      <DivideSquare className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Converter</p>
                      <p className="text-sm text-muted-foreground">Type a decimal to instantly convert it.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 217 } as React.CSSProperties}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="tool-calc-number">1</div>
                      <h3 className="text-lg font-bold text-foreground">Decimal to Fraction Conversion</h3>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative w-full sm:w-auto">
                        <input
                          type="number"
                          step="any"
                          placeholder="0.75"
                          className="tool-calc-input w-full sm:w-48 text-lg py-3"
                          value={calc.decimalInput}
                          onChange={e => calc.setDecimalInput(e.target.value)}
                        />
                      </div>
                      <span className="text-xl font-black text-muted-foreground hidden sm:block">=</span>
                      
                      <div className="flex-1 w-full flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 flex flex-col items-center justify-center p-4 rounded-xl bg-[hsl(var(--calc-hue),70%,96%)] dark:bg-[hsl(var(--calc-hue),70%,14%)] border border-[hsl(var(--calc-hue),50%,80%)] dark:border-[hsl(var(--calc-hue),50%,30%)] text-center">
                          <span className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Fraction</span>
                          <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                            {calc.result ? `${calc.result.n}/${calc.result.dn}` : "--"}
                          </span>
                        </div>
                        
                        <div className="flex-1 flex flex-col items-center justify-center p-4 rounded-xl bg-[hsl(var(--calc-hue),70%,96%)] dark:bg-[hsl(var(--calc-hue),70%,14%)] border border-[hsl(var(--calc-hue),50%,80%)] dark:border-[hsl(var(--calc-hue),50%,30%)] text-center">
                          <span className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Mixed Number</span>
                          <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
                            {calc.result ? (
                              calc.result.whole !== 0 && calc.result.mixedNum !== 0
                                ? `${calc.result.whole} ${calc.result.mixedNum}/${calc.result.dn}`
                                : "--"
                            ) : "--"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <ResultInsight result={calc.result} />
                  </div>
                </div>
              </div>
            </section>

            {/* ── 3. HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Decimal to Fraction Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Converting a decimal number to a fraction can be tricky by hand. This tool makes the process automatic and foolproof, giving you simplified proper and improper fractions along with mixed numbers. Here is a step-by-step guide on how to make the most of it.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter a Decimal Value</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Simply type any valid decimal number into the input field. The decimal can be positive (like 0.125) or negative (like -2.5). The calculator updates instantly; you do not need to click a "Calculate" button.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Read the Fraction Result</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The "Fraction" box gives you the exact answer simplified into lowest terms. If you type in a value greater than 1, like 1.75, this field will show you an improper fraction, such as 7/4.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Check the Mixed Number</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      If your number contains a whole value (e.g., 2.25), you will see it in the "Mixed Number" section as a combination of an integer and a proper fraction (like 2 1/4). If your input is purely a fraction of 1, this box remains empty.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Conversion Process</p>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">Step 1: Write it Out:</strong> Write the decimal as a fraction over 1. For example, 0.75 becomes 0.75 / 1.
                  </p>
                  <p>
                    <strong className="text-foreground">Step 2: Multiply:</strong> Multiply both the top and bottom by 10 for every place past the decimal. Since 0.75 has two decimal places, multiply by 100 to get 75 / 100.
                  </p>
                  <p>
                    <strong className="text-foreground">Step 3: Simplify:</strong> Find the Greatest Common Divisor (GCD) for both numbers (which is 25 in this case) and divide them to get the final simplified fraction: 3 / 4.
                  </p>
                </div>
              </div>
            </section>

            {/* ── 4. RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Categories & Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">Understand how to read different combinations of fractions and mixed numbers:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <div className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Proper Fractions</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">When the value in the numerator (top number) is smaller than the value in the denominator (bottom number). Examples include 1/2, 3/4, or 7/8. This always results from inputting a decimal between -1 and 1.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Improper Fractions</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">When the numerator is equal to or larger than the denominator, such as 5/4 or 11/2. Improper fractions are the standard way of representing values greater than 1 inside of formulas and equations.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Mixed Numbers</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">A combination of a whole number and a proper fraction. Examples include 1 1/4 or 5 1/2. Often used in casual settings and everyday calculations for items like cooking recipes and building measurements.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 5. QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Decimal</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Fraction (Simplified)</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Mixed Number</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">0.5</td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">1/2</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">--</td>
                      <td className="px-4 py-3 font-mono text-foreground">50%</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">0.75</td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">3/4</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">--</td>
                      <td className="px-4 py-3 font-mono text-foreground">75%</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">1.25</td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">5/4</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">1 1/4</td>
                      <td className="px-4 py-3 font-mono text-foreground">125%</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">2.5</td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">5/2</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">2 1/2</td>
                      <td className="px-4 py-3 font-mono text-foreground">250%</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">0.125</td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">1/8</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">--</td>
                      <td className="px-4 py-3 font-mono text-foreground">12.5%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── 6. WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Converter?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Total Privacy and Security.</strong> Your data stays completely inside your web browser. Nothing is ever sent to an external server, making it absolutely safe for calculating financial values, academic tasks, and sensitive research data.
                </p>
                <p>
                  <strong className="text-foreground">Blazing Fast Results.</strong> Powered by real-time reactive JavaScript logic, the result appears simultaneously as you type. No waiting, no loading screens, no forced button clicks.
                </p>
                <p>
                  <strong className="text-foreground">Ad-Free and Hassle-Free.</strong> Enjoy a premium aesthetic experience entirely free of distracting popups or restrictive paywalls. Unrestricted usage forever.
                </p>
              </div>
            </section>

            {/* ── 7. FAQ ── */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How can I manually convert a decimal to a fraction?"
                  a="Write your decimal over 1. Then multiply the top and bottom by 10 for every digit after the decimal point. Finally, simplify it down by dividing both top and bottom with their greatest common divisor."
                />
                <FaqItem
                  q="Does the tool support negative decimals?"
                  a="Yes, just add a minus sign (-) before your input number. The tool will parse negative decimals to output the accurate negative fractions."
                />
                <FaqItem
                  q="What is the difference between proper and improper fractions?"
                  a="Proper fractions have numerators (top) that are smaller than the denominator (bottom). Improper fractions have numerators larger than denominators."
                />
                <FaqItem
                  q="Why doesn't the mixed number row show anything for values under 1?"
                  a="Mixed numbers are formatted to have a whole number and a fractional piece. A value under 1 has no whole number, effectively making it simply a proper fraction."
                />
              </div>
            </section>

            {/* ── 8. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Calculators?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore 400+ free tools including financial calculators, unit converters, developer tools, and more — all free, all instant.
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
                      href={`/math/${tool.slug}`}
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
                <p className="text-xs text-muted-foreground mb-3">Help others calculate fractions easily.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
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
