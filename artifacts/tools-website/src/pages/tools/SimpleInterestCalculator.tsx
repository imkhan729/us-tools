import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  DollarSign, Calculator, Lightbulb, Copy, Check,
  PiggyBank, BarChart3, Percent, Landmark,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

function useSimpleInterestCalc() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");

  const result = useMemo(() => {
    const P = parseFloat(principal);
    const R = parseFloat(rate);
    const T = parseFloat(time);
    if (isNaN(P) || isNaN(R) || isNaN(T) || P <= 0 || T <= 0) return null;
    const interest = (P * R * T) / 100;
    const total = P + interest;
    return { interest, total, principal: P, rate: R, time: T };
  }, [principal, rate, time]);

  return { principal, setPrincipal, rate, setRate, time, setTime, result };
}

function ResultInsight({ result }: { result: { interest: number; total: number; principal: number; rate: number; time: number } | null }) {
  if (!result) return null;
  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          Your principal of ${fmt(result.principal)} at {result.rate}% simple interest for {result.time} year{result.time !== 1 ? "s" : ""} earns ${fmt(result.interest)} in interest. Your total amount will be ${fmt(result.total)}. Simple interest is calculated only on the original principal, making it straightforward and predictable.
        </p>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary">
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
  { title: "Compound Interest Calculator", slug: "compound-interest-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 152 },
  { title: "Loan EMI Calculator", slug: "loan-emi-calculator", icon: <Landmark className="w-5 h-5" />, color: 340 },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 217 },
  { title: "Discount Calculator", slug: "discount-calculator", icon: <DollarSign className="w-5 h-5" />, color: 25 },
  { title: "Tip Calculator", slug: "tip-calculator", icon: <PiggyBank className="w-5 h-5" />, color: 265 },
  { title: "ROI Calculator", slug: "roi-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 45 },
];

export default function SimpleInterestCalculator() {
  const calc = useSimpleInterestCalc();
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const fmt = (n: number | null) => n === null ? "--" : n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

  return (
    <Layout>
      <SEO
        title="Simple Interest Calculator - Free Online Tool | Calculate Interest Instantly"
        description="Free simple interest calculator online. Calculate interest on loans, deposits, and investments instantly. Formula: SI = P × R × T / 100. No signup required."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Simple Interest Calculator</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            <section>
              <div className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <DollarSign className="w-3.5 h-3.5" /> Finance & Cost
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">Simple Interest Calculator</h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Calculate simple interest on loans, savings, and investments instantly. Get exact interest amounts using the SI = P × R × T / 100 formula — free, accurate, and no signup needed.
              </p>
            </section>

            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Instant calculation</p>
                <p className="text-muted-foreground text-sm">Enter principal, rate, and time — results appear as you type.</p>
              </div>
            </section>

            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 217 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Simple Interest Calculator</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Principal Amount ($)</label>
                    <input type="number" placeholder="10000" className="tool-calc-input w-full" value={calc.principal} onChange={e => calc.setPrincipal(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Annual Rate (%)</label>
                    <div className="relative">
                      <input type="number" placeholder="5" className="tool-calc-input w-full" value={calc.rate} onChange={e => calc.setRate(e.target.value)} />
                      <Percent className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Time (years)</label>
                    <input type="number" placeholder="3" className="tool-calc-input w-full" value={calc.time} onChange={e => calc.setTime(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Simple Interest</div>
                    <div className="text-lg font-black text-blue-600 dark:text-blue-400">${calc.result ? fmt(calc.result.interest) : "--"}</div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Total Amount</div>
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">${calc.result ? fmt(calc.result.total) : "--"}</div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Principal</div>
                    <div className="text-lg font-black text-purple-600 dark:text-purple-400">${calc.principal ? fmt(parseFloat(calc.principal)) : "--"}</div>
                  </div>
                </div>
                <ResultInsight result={calc.result} />
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How Simple Interest Works</h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">The Simple Interest Formula</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Simple Interest = <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">SI = (P × R × T) / 100</code> where P = principal, R = annual interest rate (%), T = time in years.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Total Amount</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Total Amount = <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">A = P + SI</code>. For example, $10,000 at 5% for 3 years: SI = (10000 × 5 × 3) / 100 = $1,500. Total = $11,500.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Simple vs Compound Interest</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Simple interest charges interest only on the original principal. Compound interest charges interest on both the principal and accumulated interest. Simple interest is easier to predict and commonly used for short-term loans.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-blue-500" />
                    <h4 className="font-bold text-foreground text-sm">Personal Loan</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Borrow $5,000 at 8% for 2 years. Simple interest = <strong className="text-foreground">$800</strong>. You repay $5,800 total.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <PiggyBank className="w-4 h-4 text-emerald-500" />
                    <h4 className="font-bold text-foreground text-sm">Certificate of Deposit</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Deposit $20,000 at 4.5% for 1 year. Interest earned = <strong className="text-foreground">$900</strong>. Total value: $20,900.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Landmark className="w-4 h-4 text-purple-500" />
                    <h4 className="font-bold text-foreground text-sm">Car Loan</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Finance $15,000 at 6% for 4 years. Simple interest = <strong className="text-foreground">$3,600</strong>. Total payback: $18,600.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-foreground text-sm">Treasury Bond</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Invest $50,000 in a bond at 3.5% for 5 years. Interest = <strong className="text-foreground">$8,750</strong>. Maturity value: $58,750.</p>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Calculator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Instant simple interest calculation as you type" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Accurate results to 2 decimal places" },
                  { icon: <Shield className="w-4 h-4" />, text: "100% private — no data stored or tracked" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Mobile-friendly responsive design" },
                  { icon: <Clock className="w-4 h-4" />, text: "No signup, no downloads required" },
                  { icon: <Calculator className="w-4 h-4" />, text: "Uses standard SI = PRT/100 formula" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">What Is Simple Interest?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>Simple interest is a method of calculating the interest charge on a loan or investment based only on the original principal amount. Unlike compound interest, simple interest does not factor in previously accumulated interest. This makes it easier to calculate and predict costs over time.</p>
                <p>This free online simple interest calculator helps you quickly determine the interest earned on savings or owed on loans. Whether you are comparing personal loan options, evaluating a fixed deposit, or studying for a math exam, this tool gives you precise results instantly.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">When Is Simple Interest Used?</h3>
                <p>Simple interest is commonly used for short-term loans, auto loans, personal loans, and some certificates of deposit. Banks and lenders prefer simple interest for car loans because the borrower pays less total interest compared to compound interest loans. It is also widely used in education for teaching fundamental financial mathematics.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">Simple Interest vs Compound Interest</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Simple interest is calculated only on the original principal amount",
                    "Compound interest is calculated on principal plus accumulated interest",
                    "Simple interest grows linearly; compound interest grows exponentially",
                    "Short-term loans typically use simple interest for predictable payments",
                    "Long-term investments benefit more from compound interest",
                    "Simple interest formula: SI = (P × R × T) / 100",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is simple interest?" a="Simple interest is interest calculated only on the original principal amount. The formula is SI = (P × R × T) / 100, where P is principal, R is rate, and T is time in years. It does not compound — meaning interest does not earn interest." />
                <FaqItem q="How is simple interest different from compound interest?" a="Simple interest charges interest only on the initial principal. Compound interest charges interest on both the principal and any previously earned interest. Over time, compound interest produces significantly higher returns (or costs) than simple interest." />
                <FaqItem q="Where is simple interest used in real life?" a="Simple interest is used for auto loans, personal loans, short-term bank deposits, Treasury bonds, student loans during grace periods, and consumer installment credit. Many lenders prefer it for car financing." />
                <FaqItem q="Is this simple interest calculator accurate?" a="Yes. It uses the standard formula SI = (P × R × T) / 100 with results rounded to 2 decimal places. All calculations happen in real-time in your browser." />
                <FaqItem q="Can I calculate monthly simple interest?" a="Yes — enter the time as a fraction of a year. For 6 months, enter 0.5. For 3 months, enter 0.25. The calculator supports any decimal value for the time period." />
                <FaqItem q="Is this calculator free?" a="100% free. No ads, no signup, and no data collection. Your financial information never leaves your browser." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Explore More Financial Calculators</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">Try our compound interest calculator, loan EMI calculator, ROI calculator, and 400+ more free tools.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={getToolPath(tool.slug)} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">{tool.title}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help others calculate simple interest easily.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">On This Page</h3>
                <div className="space-y-1.5">
                  {["Calculator", "How It Works", "Examples", "Benefits", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-medium py-1 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />{label}
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
