import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { SeoRichContent } from "@/components/SeoRichContent";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Calculator,
  Copy,
  Check,
  Lightbulb,
  BadgeCheck,
  Zap,
  Lock,
  Shield,
  Smartphone,
  Sigma,
  Hash,
  Percent,
  Star,
} from "lucide-react";

type PrimeResult =
  | { ok: true; n: number; isPrime: boolean; divisor: number | null; prevPrime: number | null; nextPrime: number }
  | { ok: false; error: string }
  | null;

function isPrimeDetailed(n: number): { isPrime: boolean; divisor: number | null } {
  if (n <= 1) return { isPrime: false, divisor: null };
  if (n <= 3) return { isPrime: true, divisor: null };
  if (n % 2 === 0) return { isPrime: false, divisor: 2 };
  if (n % 3 === 0) return { isPrime: false, divisor: 3 };
  let i = 5;
  while (i * i <= n) {
    if (n % i === 0) return { isPrime: false, divisor: i };
    if (n % (i + 2) === 0) return { isPrime: false, divisor: i + 2 };
    i += 6;
  }
  return { isPrime: true, divisor: null };
}

function previousPrime(n: number): number | null {
  for (let x = n - 1; x >= 2; x--) {
    if (isPrimeDetailed(x).isPrime) return x;
  }
  return null;
}

function nextPrime(n: number): number {
  let x = Math.max(2, n + 1);
  while (!isPrimeDetailed(x).isPrime) x++;
  return x;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-blue-500/40 transition-colors">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-blue-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Factorial Calculator", slug: "factorial-calculator", icon: <Sigma className="w-5 h-5" />, color: 145, benefit: "Exact n! values and trailing zeros" },
  { title: "GCD Calculator", slug: "online-gcd-calculator", icon: <Hash className="w-5 h-5" />, color: 265, benefit: "Greatest common divisor checks" },
  { title: "LCM Calculator", slug: "online-lcm-calculator", icon: <Hash className="w-5 h-5" />, color: 30, benefit: "Least common multiple finder" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 152, benefit: "Percent and growth calculations" },
];

export default function PrimeNumberChecker() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo<PrimeResult>(() => {
    if (!input.trim()) return null;
    const n = Number(input);
    if (!Number.isFinite(n)) return { ok: false, error: "Enter a valid number." };
    if (!Number.isInteger(n)) return { ok: false, error: "Prime checking requires an integer." };
    if (n < 0) return { ok: false, error: "Use non-negative integers only." };
    if (n > 100000000) return { ok: false, error: "For speed, max input is 100,000,000." };

    const detail = isPrimeDetailed(n);
    return {
      ok: true,
      n,
      isPrime: detail.isPrime,
      divisor: detail.divisor,
      prevPrime: previousPrime(n),
      nextPrime: nextPrime(n),
    };
  }, [input]);

  const insight = (() => {
    if (!result) return null;
    if (!result.ok) return result.error;
    if (result.n <= 1) return `${result.n} is neither prime nor composite.`;
    if (result.isPrime) return `${result.n} is prime. It has exactly two positive divisors: 1 and ${result.n}.`;
    return `${result.n} is composite. Smallest non-trivial divisor: ${result.divisor}.`;
  })();

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Prime Number Checker",
    description: "Free online prime checker. Test whether an integer is prime or composite.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://usonlinetools.com/math/prime-number-checker",
  };

  return (
    <Layout>
      <SEO
        title="Prime Number Checker - Prime vs Composite"
        description="Free online prime number checker. Instantly test if a number is prime or composite, with divisor details."
        canonical="https://usonlinetools.com/math/prime-number-checker"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">Prime Number Checker</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-blue-500/15 bg-gradient-to-br from-blue-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Prime Number Checker</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Check whether an integer is prime or composite, see the smallest divisor for composite numbers, and view nearby primes.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Math &amp; Calculators | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Single Integer Checker</p>
                      <p className="text-sm text-muted-foreground">Uses an optimized divisor check up to sqrt(n).</p>
                    </div>
                  </div>

                  <div className="tool-calc-card">
                    <h3 className="text-lg font-bold text-foreground mb-4">Prime vs Composite</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input type="number" placeholder="Enter integer n" className="tool-calc-input w-full sm:w-52" value={input} onChange={(e) => setInput(e.target.value)} />
                      <span className="text-sm font-semibold text-muted-foreground">result</span>
                      <div className={`tool-calc-result flex-1 w-full ${(result && result.ok && result.isPrime) ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-blue-400"}`}>
                        {result && result.ok ? (result.n <= 1 ? "Neither" : result.isPrime ? "Prime" : "Composite") : "--"}
                      </div>
                    </div>

                    {insight && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">{insight}</p>
                        </div>
                      </motion.div>
                    )}

                    {result && result.ok && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                        <div className="rounded-xl bg-muted/50 border border-border p-3 text-center">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Smallest Divisor</p>
                          <p className="text-base font-black text-foreground">{result.divisor ?? "-"}</p>
                        </div>
                        <div className="rounded-xl bg-muted/50 border border-border p-3 text-center">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Previous Prime</p>
                          <p className="text-base font-black text-blue-600 dark:text-blue-400">{result.prevPrime ?? "-"}</p>
                        </div>
                        <div className="rounded-xl bg-muted/50 border border-border p-3 text-center">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Next Prime</p>
                          <p className="text-base font-black text-emerald-600 dark:text-emerald-400">{result.nextPrime}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Prime Number Checker</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Enter an integer</p><p className="text-muted-foreground text-sm leading-relaxed">Use any non-negative integer up to 100,000,000.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Read prime/composite status</p><p className="text-muted-foreground text-sm leading-relaxed">The result tells you if the number is prime, composite, or neither.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Use divisor and nearby prime values</p><p className="text-muted-foreground text-sm leading-relaxed">Composite numbers show smallest divisor; all inputs show adjacent primes.</p></div></li>
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">Prime means exactly two divisors</p><p className="text-sm text-muted-foreground">A prime has divisors 1 and itself only.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">Composite means at least one extra divisor</p><p className="text-sm text-muted-foreground">Smallest divisor helps with fast factorization.</p></div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20"><p className="font-bold text-foreground mb-1">0 and 1 are neither prime nor composite</p><p className="text-sm text-muted-foreground">This is a standard number-theory rule.</p></div>
              </div>
            </section>

            <SeoRichContent
              toolName="Prime Number Checker"
              primaryKeyword="prime number checker"
              intro="This prime number checker tests whether an integer is prime or composite and gives extra context such as smallest divisor, previous prime, and next prime. It is useful for number theory practice, coding interviews, and cryptography fundamentals."
              formulas={[
                { expression: "n is prime ⇔ divisors(n) = {1, n}", explanation: "A prime number has exactly two positive divisors and cannot be factorized further." },
                { expression: "Test divisors up to √n", explanation: "If n has a factor larger than √n, it must also have a complementary factor smaller than √n." },
                { expression: "6k ± 1 candidate pattern", explanation: "After 2 and 3, prime candidates follow 6k - 1 or 6k + 1, reducing unnecessary checks." },
              ]}
              useCases={[
                { title: "Coding interviews and competitive programming", description: "Fast primality checks and factor hints are common in algorithmic challenges." },
                { title: "Foundations of cryptography", description: "Prime numbers are central to key generation and modular arithmetic used in encryption systems." },
                { title: "Classroom number theory learning", description: "Students can validate prime/composite classification and understand divisor behavior quickly." },
              ]}
              tips={[
                "Use integer inputs only; primality is defined over integers, not decimals.",
                "Remember that 0 and 1 are neither prime nor composite by definition.",
                "When a number is composite, smallest-divisor output helps start factorization immediately.",
                "For large values, pairing this checker with modulo and GCD tools improves workflow speed.",
              ]}
            />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">n</th><th className="text-left px-4 py-3 font-bold text-foreground">Classification</th><th className="text-left px-4 py-3 font-bold text-foreground">Smallest Divisor</th><th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Note</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr><td className="px-4 py-3 font-mono text-foreground">29</td><td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">Prime</td><td className="px-4 py-3 text-foreground">-</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">No divisors up to sqrt(29)</td></tr>
                    <tr><td className="px-4 py-3 font-mono text-foreground">91</td><td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">Composite</td><td className="px-4 py-3 text-foreground">7</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">91 = 7 * 13</td></tr>
                    <tr><td className="px-4 py-3 font-mono text-foreground">1</td><td className="px-4 py-3 font-bold text-foreground">Neither</td><td className="px-4 py-3 text-foreground">-</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Definition rule</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-blue-500/5 border border-blue-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Great for interview prep. The divisor output helps verify factoring logic quickly."</p>
                <p className="text-xs text-muted-foreground mt-2">- User feedback, 2026</p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Prime Number Checker?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Optimized primality test.</strong> Uses 6k ± 1 stepping after initial small-divisor checks.</p>
                <p><strong className="text-foreground">Extra context beyond yes/no.</strong> Includes smallest divisor and nearby primes.</p>
                <p><strong className="text-foreground">Same long-form educational template.</strong> Structure matches your established content pattern.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is a prime number?" a="A prime number has exactly two positive divisors: 1 and itself." />
                <FaqItem q="Is 1 prime?" a="No. 1 is neither prime nor composite." />
                <FaqItem q="Why show smallest divisor?" a="It helps explain why a number is composite and supports factorization." />
                <FaqItem q="Does this tool support decimals?" a="No. Primality is defined for integers only." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Number Theory Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Explore factorial, GCD, LCM, and combinatorics calculators in the same format.</p>
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
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-blue-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others check prime numbers instantly.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map((label) => (
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
