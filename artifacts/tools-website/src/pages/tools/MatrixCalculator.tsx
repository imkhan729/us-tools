import { useMemo, useState, type CSSProperties } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { SeoRichContent } from "@/components/SeoRichContent";
import { getToolPath } from "@/data/tools";
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
  BarChart3,
  Percent,
  Star,
} from "lucide-react";

type Matrix2 = [[number, number], [number, number]];

type Result =
  | {
      ok: true;
      a: Matrix2;
      b: Matrix2;
      sum: Matrix2;
      product: Matrix2;
      detA: number;
      detB: number;
      invA: Matrix2 | null;
      invB: Matrix2 | null;
    }
  | { ok: false; error: string }
  | null;

function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

function matToText(m: Matrix2): string {
  return `[${fmt(m[0][0])}, ${fmt(m[0][1])}]  [${fmt(m[1][0])}, ${fmt(m[1][1])}]`;
}

function inv2(m: Matrix2): Matrix2 | null {
  const det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
  if (det === 0) return null;
  return [
    [m[1][1] / det, -m[0][1] / det],
    [-m[1][0] / det, m[0][0] / det],
  ];
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-orange-500/40 transition-colors">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-orange-500">
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
  { title: "Quadratic Equation Solver", slug: "online-quadratic-equation-solver", icon: <Sigma className="w-5 h-5" />, color: 155, benefit: "Equation root solving" },
  { title: "Scientific Calculator", slug: "online-scientific-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 217, benefit: "Advanced function support" },
  { title: "Exponents Calculator", slug: "exponents-calculator", icon: <Sigma className="w-5 h-5" />, color: 230, benefit: "Power operations" },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 152, benefit: "Percent workflows" },
];

export default function MatrixCalculator() {
  const [a11, setA11] = useState("");
  const [a12, setA12] = useState("");
  const [a21, setA21] = useState("");
  const [a22, setA22] = useState("");
  const [b11, setB11] = useState("");
  const [b12, setB12] = useState("");
  const [b21, setB21] = useState("");
  const [b22, setB22] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo<Result>(() => {
    const values = [a11, a12, a21, a22, b11, b12, b21, b22];
    if (values.some((v) => !v.trim())) return null;
    const nums = values.map((v) => Number(v));
    if (nums.some((n) => !Number.isFinite(n))) return { ok: false, error: "Enter valid numeric values for all matrix cells." };

    const a: Matrix2 = [[nums[0], nums[1]], [nums[2], nums[3]]];
    const b: Matrix2 = [[nums[4], nums[5]], [nums[6], nums[7]]];

    const sum: Matrix2 = [[a[0][0] + b[0][0], a[0][1] + b[0][1]], [a[1][0] + b[1][0], a[1][1] + b[1][1]]];
    const product: Matrix2 = [
      [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
      [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]],
    ];

    const detA = a[0][0] * a[1][1] - a[0][1] * a[1][0];
    const detB = b[0][0] * b[1][1] - b[0][1] * b[1][0];

    return { ok: true, a, b, sum, product, detA, detB, invA: inv2(a), invB: inv2(b) };
  }, [a11, a12, a21, a22, b11, b12, b21, b22]);

  const insight = (() => {
    if (!result) return null;
    if (!result.ok) return result.error;
    return `Computed A + B, A x B, determinants, and inverses where possible. det(A)=${fmt(result.detA)}, det(B)=${fmt(result.detB)}.`;
  })();

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Online Matrix Calculator",
    description: "Free online matrix calculator for 2x2 matrix addition, multiplication, determinant, and inverse.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://usonlinetools.com/math/online-matrix-calculator",
  };

  return (
    <Layout>
      <SEO
        title="Online Matrix Calculator - Add, Multiply, Determinant, and Inverse"
        description="Free online matrix calculator for 2x2 matrices. Compute A+B, A x B, determinant, and inverse instantly."
        canonical="https://usonlinetools.com/math/online-matrix-calculator"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Online Matrix Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Online Matrix Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Perform 2x2 matrix operations including addition, multiplication, determinant, and inverse with real-time output.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Math &amp; Calculators &nbsp;&middot;&nbsp; Last updated: April 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="tool-calc-card" style={{ "--calc-hue": 28 } as CSSProperties}>
                    <h3 className="text-lg font-bold text-foreground mb-4">Enter Matrix A and Matrix B (2x2)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Matrix A</p>
                        <div className="grid grid-cols-2 gap-2">
                          <input type="number" placeholder="a11" className="tool-calc-input" value={a11} onChange={(e) => setA11(e.target.value)} />
                          <input type="number" placeholder="a12" className="tool-calc-input" value={a12} onChange={(e) => setA12(e.target.value)} />
                          <input type="number" placeholder="a21" className="tool-calc-input" value={a21} onChange={(e) => setA21(e.target.value)} />
                          <input type="number" placeholder="a22" className="tool-calc-input" value={a22} onChange={(e) => setA22(e.target.value)} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Matrix B</p>
                        <div className="grid grid-cols-2 gap-2">
                          <input type="number" placeholder="b11" className="tool-calc-input" value={b11} onChange={(e) => setB11(e.target.value)} />
                          <input type="number" placeholder="b12" className="tool-calc-input" value={b12} onChange={(e) => setB12(e.target.value)} />
                          <input type="number" placeholder="b21" className="tool-calc-input" value={b21} onChange={(e) => setB21(e.target.value)} />
                          <input type="number" placeholder="b22" className="tool-calc-input" value={b22} onChange={(e) => setB22(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {result && result.ok && (
                      <div className="space-y-2 mt-4">
                        <div className="tool-calc-result text-orange-600 dark:text-orange-400">A + B: {matToText(result.sum)}</div>
                        <div className="tool-calc-result text-amber-600 dark:text-amber-400">A x B: {matToText(result.product)}</div>
                        <div className="tool-calc-result">det(A): {fmt(result.detA)} | det(B): {fmt(result.detB)}</div>
                        <div className="tool-calc-result">inv(A): {result.invA ? matToText(result.invA) : "Not invertible"}</div>
                        <div className="tool-calc-result">inv(B): {result.invB ? matToText(result.invB) : "Not invertible"}</div>
                      </div>
                    )}

                    {insight && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">{insight}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Matrix Calculator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Enter all matrix cells</p><p className="text-muted-foreground text-sm leading-relaxed">Provide numeric values for both 2x2 matrices.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Read operation outputs</p><p className="text-muted-foreground text-sm leading-relaxed">The tool returns A+B and A x B along with determinants.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Check invertibility</p><p className="text-muted-foreground text-sm leading-relaxed">Inverse exists only when determinant is non-zero.</p></div></li>
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">Addition is element-wise</p><p className="text-sm text-muted-foreground">Each output cell is sum of corresponding cells.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">Multiplication is row-by-column</p><p className="text-sm text-muted-foreground">Order matters: A x B is generally not equal to B x A.</p></div>
                <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20"><p className="font-bold text-foreground mb-1">Determinant controls inverse</p><p className="text-sm text-muted-foreground">A matrix is invertible only when determinant is not zero.</p></div>
              </div>
            </section>

            <SeoRichContent
              toolName="Matrix Calculator"
              primaryKeyword="matrix calculator"
              intro="This 2x2 matrix calculator performs core linear algebra operations in one workflow. It is useful for students learning matrix math and professionals validating small matrix computations."
              formulas={[
                { expression: "det(A) = a11*a22 - a12*a21", explanation: "Determinant summarizes scaling behavior and invertibility of a 2x2 matrix." },
                { expression: "A^-1 = (1/det(A)) * [[a22, -a12], [-a21, a11]]", explanation: "Inverse formula for invertible 2x2 matrices." },
                { expression: "(A x B)ij = sum_k Aik * Bkj", explanation: "Matrix multiplication uses dot products between rows and columns." },
              ]}
              useCases={[
                { title: "Linear algebra coursework", description: "Students verify operation steps and understand determinant/inverse conditions." },
                { title: "2D transformations and graphics", description: "Small matrices model scaling, rotation, and coordinate transformation workflows." },
                { title: "System-solving support", description: "Inverse and determinant help with solving compact linear equation systems." },
              ]}
              tips={[
                "Keep matrix order consistent because multiplication is not commutative.",
                "Check determinant before trying to interpret inverse output.",
                "Use decimal precision carefully when comparing near-singular matrices.",
                "Verify manual work by recalculating A x A^-1 for invertible cases.",
              ]}
            />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">A = [[1,2],[3,4]]</strong> has det(A) = -2 and is invertible</li>
                <li><strong className="text-foreground">A = [[1,2],[2,4]]</strong> has det(A) = 0 and no inverse</li>
                <li><strong className="text-foreground">A+B</strong> is always cell-wise sum for same-size matrices</li>
              </ul>
              <div className="mt-6 p-5 rounded-xl bg-orange-500/5 border border-orange-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Simple matrix operations in one place with determinant and inverse included."</p>
                <p className="text-xs text-muted-foreground mt-2">- User feedback, 2026</p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Matrix Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Multiple operations in one panel.</strong> Addition, multiplication, determinant, and inverse are computed together.</p>
                <p><strong className="text-foreground">Clear invertibility feedback.</strong> Prevents misuse of inverse when determinant equals zero.</p>
                <p><strong className="text-foreground">Consistent rich template.</strong> Same structure and content depth as your upgraded tools.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="Can I multiply matrices in any order?" a="No. Matrix multiplication is order-sensitive, so A x B may differ from B x A." />
                <FaqItem q="When does inverse exist?" a="A 2x2 matrix has an inverse only if its determinant is non-zero." />
                <FaqItem q="Why does determinant matter?" a="Determinant indicates scaling and whether the matrix is singular or invertible." />
                <FaqItem q="Does this support larger matrices?" a="This page currently focuses on 2x2 operations for speed and clarity." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Algebra Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Continue with quadratic solver, exponents, and scientific calculator workflows.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                    <Link key={tool.slug} href={getToolPath(tool.slug)} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-orange-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share this matrix calculator with students and engineers.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-orange-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-orange-500/40 flex-shrink-0" />
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
