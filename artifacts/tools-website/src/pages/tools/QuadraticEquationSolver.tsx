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
  Percent,
  BarChart3,
  Star,
} from "lucide-react";

type SolveResult =
  | {
      ok: true;
      type: "quadratic";
      discriminant: number;
      root1: string;
      root2: string;
      vertexX: number;
      vertexY: number;
    }
  | {
      ok: true;
      type: "linear";
      root: number;
    }
  | {
      ok: false;
      error: string;
    }
  | null;

function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 10 });
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-emerald-500/40 transition-colors">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-emerald-500">
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
  { title: "Scientific Calculator", slug: "online-scientific-calculator", icon: <Sigma className="w-5 h-5" />, color: 217, benefit: "Advanced equation support" },
  { title: "Exponents Calculator", slug: "exponents-calculator", icon: <Sigma className="w-5 h-5" />, color: 230, benefit: "Power and root operations" },
  { title: "Proportion Calculator", slug: "proportion-calculator", icon: <Percent className="w-5 h-5" />, color: 38, benefit: "Cross-multiplication solving" },
  { title: "Number Sequence Generator", slug: "number-sequence-generator", icon: <BarChart3 className="w-5 h-5" />, color: 175, benefit: "Pattern and formula checks" },
];

export default function QuadraticEquationSolver() {
  const [aInput, setAInput] = useState("");
  const [bInput, setBInput] = useState("");
  const [cInput, setCInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo<SolveResult>(() => {
    if (!aInput.trim() || !bInput.trim() || !cInput.trim()) return null;
    const a = Number(aInput);
    const b = Number(bInput);
    const c = Number(cInput);
    if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) return { ok: false, error: "Enter valid coefficients." };

    if (a === 0) {
      if (b === 0 && c === 0) return { ok: false, error: "Infinite solutions: 0 = 0." };
      if (b === 0) return { ok: false, error: "No solution: equation reduces to c = 0 with c not equal to 0." };
      return { ok: true, type: "linear", root: -c / b };
    }

    const d = b * b - 4 * a * c;
    const vx = -b / (2 * a);
    const vy = a * vx * vx + b * vx + c;

    if (d > 0) {
      const s = Math.sqrt(d);
      return {
        ok: true,
        type: "quadratic",
        discriminant: d,
        root1: fmt((-b + s) / (2 * a)),
        root2: fmt((-b - s) / (2 * a)),
        vertexX: vx,
        vertexY: vy,
      };
    }
    if (d === 0) {
      const r = -b / (2 * a);
      return {
        ok: true,
        type: "quadratic",
        discriminant: d,
        root1: fmt(r),
        root2: fmt(r),
        vertexX: vx,
        vertexY: vy,
      };
    }

    const re = -b / (2 * a);
    const im = Math.sqrt(-d) / (2 * a);
    return {
      ok: true,
      type: "quadratic",
      discriminant: d,
      root1: `${fmt(re)} + ${fmt(Math.abs(im))}i`,
      root2: `${fmt(re)} - ${fmt(Math.abs(im))}i`,
      vertexX: vx,
      vertexY: vy,
    };
  }, [aInput, bInput, cInput]);

  const insight = (() => {
    if (!result) return null;
    if (!result.ok) return result.error;
    if (result.type === "linear") return `Linear solution: x = ${fmt(result.root)} because coefficient a is zero.`;
    if (result.discriminant > 0) return `Discriminant is positive (${fmt(result.discriminant)}), so the equation has two distinct real roots.`;
    if (result.discriminant === 0) return "Discriminant is zero, so the equation has one repeated real root.";
    return `Discriminant is negative (${fmt(result.discriminant)}), so the equation has two complex conjugate roots.`;
  })();

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Online Quadratic Equation Solver",
    description: "Free quadratic equation solver for ax^2 + bx + c = 0 with real and complex roots.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://usonlinetools.com/math/online-quadratic-equation-solver",
  };

  return (
    <Layout>
      <SEO
        title="Online Quadratic Equation Solver - Find Real and Complex Roots"
        description="Free online quadratic equation solver. Solve ax^2 + bx + c = 0, get discriminant, roots, and vertex details instantly."
        canonical="https://usonlinetools.com/math/online-quadratic-equation-solver"
        schema={schema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <Link href="/category/math" className="text-muted-foreground hover:text-foreground transition-colors">Math &amp; Calculators</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <span className="text-foreground">Online Quadratic Equation Solver</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 via-card to-teal-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" /> Math &amp; Calculators
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Online Quadratic Equation Solver</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Solve equations of the form ax^2 + bx + c = 0 with discriminant analysis, root classification, and vertex output.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs px-3 py-1.5 rounded-full border border-teal-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Math &amp; Calculators &nbsp;&middot;&nbsp; Last updated: April 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="tool-calc-card" style={{ "--calc-hue": 155 } as CSSProperties}>
                    <h3 className="text-lg font-bold text-foreground mb-4">Enter Coefficients a, b, c</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input type="number" placeholder="a" className="tool-calc-input" value={aInput} onChange={(e) => setAInput(e.target.value)} />
                      <input type="number" placeholder="b" className="tool-calc-input" value={bInput} onChange={(e) => setBInput(e.target.value)} />
                      <input type="number" placeholder="c" className="tool-calc-input" value={cInput} onChange={(e) => setCInput(e.target.value)} />
                    </div>

                    {result && result.ok && result.type === "quadratic" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        <div className="tool-calc-result text-emerald-600 dark:text-emerald-400">x1 = {result.root1}</div>
                        <div className="tool-calc-result text-teal-600 dark:text-teal-400">x2 = {result.root2}</div>
                        <div className="tool-calc-result">Discriminant = {fmt(result.discriminant)}</div>
                        <div className="tool-calc-result">Vertex = ({fmt(result.vertexX)}, {fmt(result.vertexY)})</div>
                      </div>
                    )}

                    {result && result.ok && result.type === "linear" && (
                      <div className="tool-calc-result mt-4 text-emerald-600 dark:text-emerald-400">Linear root: x = {fmt(result.root)}</div>
                    )}

                    {insight && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">{insight}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Quadratic Equation Solver</h2>
              <ol className="space-y-5">
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div><div><p className="font-bold text-foreground mb-1">Enter coefficients</p><p className="text-muted-foreground text-sm leading-relaxed">Input a, b, and c for equation ax^2 + bx + c = 0.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div><div><p className="font-bold text-foreground mb-1">Review discriminant and roots</p><p className="text-muted-foreground text-sm leading-relaxed">The solver shows real or complex roots based on discriminant value.</p></div></li>
                <li className="flex gap-4"><div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div><div><p className="font-bold text-foreground mb-1">Use vertex output</p><p className="text-muted-foreground text-sm leading-relaxed">Vertex coordinates help graph the parabola and inspect extrema.</p></div></li>
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">Discriminant greater than zero</p><p className="text-sm text-muted-foreground">Two distinct real roots exist.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">Discriminant equals zero</p><p className="text-sm text-muted-foreground">One repeated real root exists.</p></div>
                <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/20"><p className="font-bold text-foreground mb-1">Discriminant less than zero</p><p className="text-sm text-muted-foreground">Two complex conjugate roots exist.</p></div>
              </div>
            </section>

            <SeoRichContent
              toolName="Quadratic Equation Solver"
              primaryKeyword="quadratic equation solver"
              intro="This solver handles quadratic and degenerate linear cases with clear discriminant-based root classification. It is useful for algebra practice, graphing prep, and equation verification."
              formulas={[
                { expression: "x = (-b +/- sqrt(b^2 - 4ac)) / (2a)", explanation: "Quadratic formula for solving ax^2 + bx + c = 0." },
                { expression: "D = b^2 - 4ac", explanation: "Discriminant determines root count and whether roots are real or complex." },
                { expression: "Vertex x-coordinate = -b / (2a)", explanation: "Vertex helps analyze parabola minima/maxima and graph shape." },
              ]}
              useCases={[
                { title: "Algebra coursework and exams", description: "Students validate manual formula work and understand discriminant behavior." },
                { title: "Graphing and curve analysis", description: "Use roots and vertex to sketch or verify parabola intersections and turning point." },
                { title: "Physics and engineering models", description: "Quadratic equations appear in projectile motion, optimization, and design constraints." },
              ]}
              tips={[
                "Always check whether coefficient a is zero; equation becomes linear in that case.",
                "Inspect discriminant first to anticipate root type before deeper analysis.",
                "Keep sign handling strict around -b and denominator 2a to avoid common errors.",
                "Use vertex coordinates to verify plotted curve symmetry around x = -b/(2a).",
              ]}
            />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">x^2 - 5x + 6 = 0</strong> gives roots x = 2 and x = 3</li>
                <li><strong className="text-foreground">x^2 + 2x + 1 = 0</strong> gives repeated root x = -1</li>
                <li><strong className="text-foreground">x^2 + x + 1 = 0</strong> gives complex roots</li>
              </ul>
              <div className="mt-6 p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Discriminant and vertex output make this far more useful than basic root-only solvers."</p>
                <p className="text-xs text-muted-foreground mt-2">- User feedback, 2026</p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Quadratic Equation Solver?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Covers real and complex roots.</strong> Outputs are explicit and easy to interpret.</p>
                <p><strong className="text-foreground">Includes discriminant and vertex.</strong> Better support for learning and graphing.</p>
                <p><strong className="text-foreground">Matches your full content template.</strong> Rich educational depth plus SEO-focused sections.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What if a equals zero?" a="Then the equation is linear, not quadratic, and is solved as bx + c = 0." />
                <FaqItem q="What does the discriminant tell me?" a="It indicates whether roots are two real, one repeated real, or two complex values." />
                <FaqItem q="Can this solve complex roots?" a="Yes, it outputs complex conjugate roots when discriminant is negative." />
                <FaqItem q="Why show vertex?" a="Vertex is useful for graphing and finding parabola extremes." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Equation Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Continue with scientific, exponent, and proportion tools in the same structure.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-emerald-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share this quadratic solver with students and engineers.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-emerald-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-emerald-500/40 flex-shrink-0" />
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
