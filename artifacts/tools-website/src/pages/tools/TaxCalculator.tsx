import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  Calculator, Lightbulb, Copy, Check,
  DollarSign, Percent, Landmark, Briefcase, Building2, Wallet, FileText,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── US 2024 Federal Tax Brackets (Married Filing Jointly / Single) ──
type FilingStatus = "single" | "married" | "hoh";
type TaxBracket = { rate: number; min: number; max: number };

const BRACKETS: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { rate: 0.10, min: 0,      max: 11600 },
    { rate: 0.12, min: 11600,  max: 47150 },
    { rate: 0.22, min: 47150,  max: 100525 },
    { rate: 0.24, min: 100525, max: 191950 },
    { rate: 0.32, min: 191950, max: 243725 },
    { rate: 0.35, min: 243725, max: 609350 },
    { rate: 0.37, min: 609350, max: Infinity },
  ],
  married: [
    { rate: 0.10, min: 0,      max: 23200 },
    { rate: 0.12, min: 23200,  max: 94300 },
    { rate: 0.22, min: 94300,  max: 201050 },
    { rate: 0.24, min: 201050, max: 383900 },
    { rate: 0.32, min: 383900, max: 487450 },
    { rate: 0.35, min: 487450, max: 731200 },
    { rate: 0.37, min: 731200, max: Infinity },
  ],
  hoh: [
    { rate: 0.10, min: 0,      max: 16550 },
    { rate: 0.12, min: 16550,  max: 63100 },
    { rate: 0.22, min: 63100,  max: 100500 },
    { rate: 0.24, min: 100500, max: 191950 },
    { rate: 0.32, min: 191950, max: 243700 },
    { rate: 0.35, min: 243700, max: 609350 },
    { rate: 0.37, min: 609350, max: Infinity },
  ],
};

const STANDARD_DEDUCTIONS: Record<FilingStatus, number> = { single: 14600, married: 29200, hoh: 21900 };

function useTaxCalc() {
  const [income, setIncome] = useState("");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [deductions, setDeductions] = useState("");
  const [stateRate, setStateRate] = useState("5");

  const result = useMemo(() => {
    const gross = parseFloat(income);
    if (isNaN(gross) || gross <= 0) return null;

    const standardDed = STANDARD_DEDUCTIONS[filingStatus];
    const itemizedDed = parseFloat(deductions) || 0;
    const totalDed = Math.max(standardDed, itemizedDed);
    const taxableIncome = Math.max(0, gross - totalDed);

    // Federal tax
    let federalTax = 0;
    let marginalRate = 0;
    const brackets = BRACKETS[filingStatus];
    for (const b of brackets) {
      if (taxableIncome > b.min) {
        const taxed = Math.min(taxableIncome, b.max) - b.min;
        federalTax += taxed * b.rate;
        marginalRate = b.rate;
      }
    }

    // FICA (Social Security 6.2% up to $168,600, Medicare 1.45%)
    const ssWage = Math.min(gross, 168600);
    const fica = ssWage * 0.062 + gross * 0.0145;

    // State tax
    const stateTax = taxableIncome * ((parseFloat(stateRate) || 0) / 100);

    const totalTax = federalTax + fica + stateTax;
    const effectiveRate = (totalTax / gross) * 100;
    const takeHome = gross - totalTax;

    return {
      gross, taxableIncome, totalDed, standardDed, itemizedDed,
      federalTax, fica, stateTax, totalTax,
      effectiveRate, marginalRate: marginalRate * 100,
      takeHome,
      monthlyTakeHome: takeHome / 12,
      biweeklyTakeHome: takeHome / 26,
    };
  }, [income, filingStatus, deductions, stateRate]);

  return { income, setIncome, filingStatus, setFilingStatus, deductions, setDeductions, stateRate, setStateRate, result };
}

function ResultInsight({ result }: { result: ReturnType<typeof useTaxCalc>["result"] }) {
  if (!result) return null;
  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          On a gross income of {fmt(result.gross)}, your estimated total tax is {fmt(result.totalTax)} ({result.effectiveRate.toFixed(1)}% effective rate). Your marginal federal rate is <strong>{result.marginalRate.toFixed(0)}%</strong>. Your annual take-home pay is <strong>{fmt(result.takeHome)}</strong> ({fmt(result.monthlyTakeHome)}/month).
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
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Salary Calculator", slug: "salary-calculator", icon: <DollarSign className="w-5 h-5" />, color: 152 },
  { title: "Compound Interest Calculator", slug: "compound-interest-calculator", icon: <Landmark className="w-5 h-5" />, color: 217 },
  { title: "ROI Calculator", slug: "roi-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 265 },
  { title: "Mortgage Payment Calculator", slug: "mortgage-payment-calculator", icon: <Building2 className="w-5 h-5" />, color: 340 },
  { title: "Savings Calculator", slug: "savings-calculator", icon: <Wallet className="w-5 h-5" />, color: 45 },
  { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-5 h-5" />, color: 25 },
];

export default function TaxCalculator() {
  const calc = useTaxCalc();
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const fmt = (n: number | null | undefined, isPercent = false) => {
    if (n === null || n === undefined) return "--";
    if (isPercent) return n.toFixed(1) + "%";
    return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  return (
    <Layout>
      <SEO
        title="Tax Calculator 2024 - Estimate Federal Income Tax | Free US Tax Estimator"
        description="Free 2024 US income tax calculator. Estimate federal tax, FICA, state tax, effective tax rate, and take-home pay. Based on IRS tax brackets — no signup required."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebApplication", "name": "Tax Calculator", "url": "https://usonlinetools.com/finance/tax-calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } },
          { "@type": "FAQPage", "mainEntity": [
            { "@type": "Question", "name": "What is the difference between marginal and effective tax rate?", "acceptedAnswer": { "@type": "Answer", "text": "The marginal rate is the highest bracket rate applied to your last dollar of income. The effective rate is the total tax paid divided by gross income — always lower than the marginal rate." } },
            { "@type": "Question", "name": "What is the standard deduction for 2024?", "acceptedAnswer": { "@type": "Answer", "text": "For 2024, the standard deduction is $14,600 for single filers, $29,200 for married filing jointly, and $21,900 for head of household." } },
          ]}
        ]
      })}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Tax Calculator</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            {/* 1. PAGE HEADER */}
            <section>
              <div className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <FileText className="w-3.5 h-3.5" />
                Finance & Tax
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">
                Tax Calculator 2024
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Estimate your US federal income tax, FICA (Social Security + Medicare), state tax, effective tax rate, and annual take-home pay. Based on 2024 IRS tax brackets — free, instant, no signup required.
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-3 font-medium">⚠ For estimation purposes only. Consult a tax professional for filing guidance.</p>
            </section>

            {/* QUICK ANSWER BOX */}
            <section className="p-5 rounded-xl bg-green-500/5 border-2 border-green-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-green-500" />
                <h2 className="font-black text-foreground text-base">2024 Federal Tax Brackets (Single)</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                {[
                  { rate: "10%", range: "Up to $11,600" },
                  { rate: "12%", range: "$11,601 – $47,150" },
                  { rate: "22%", range: "$47,151 – $100,525" },
                  { rate: "24%", range: "$100,526 – $191,950" },
                  { rate: "32%", range: "$191,951 – $243,725" },
                  { rate: "35%", range: "$243,726 – $609,350" },
                  { rate: "37%", range: "Over $609,350" },
                ].map((b, i) => (
                  <div key={i} className="bg-background rounded px-2 py-1.5 border border-border">
                    <div className="font-black text-primary">{b.rate}</div>
                    <div className="text-muted-foreground text-[10px]">{b.range}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. QUICK ACTION */}
            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Estimate your 2024 taxes instantly</p>
                <p className="text-muted-foreground text-sm">Enter your gross income and filing status — see federal tax, FICA, state tax, and take-home pay in real time.</p>
              </div>
            </section>

            {/* 3. TOOL SECTION */}
            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 142 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Income Tax Estimator</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Annual Gross Income ($)</label>
                    <input type="number" placeholder="75000" className="tool-calc-input w-full" value={calc.income} onChange={e => calc.setIncome(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Filing Status</label>
                    <select className="tool-calc-input w-full" value={calc.filingStatus} onChange={e => calc.setFilingStatus(e.target.value as FilingStatus)}>
                      <option value="single">Single</option>
                      <option value="married">Married Filing Jointly</option>
                      <option value="hoh">Head of Household</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">
                      Itemized Deductions ($) <span className="text-xs font-normal">(leave blank to use standard)</span>
                    </label>
                    <input type="number" placeholder={`${STANDARD_DEDUCTIONS[calc.filingStatus].toLocaleString()} (standard)`} className="tool-calc-input w-full" value={calc.deductions} onChange={e => calc.setDeductions(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">State Income Tax Rate (%)</label>
                    <input type="number" placeholder="5" className="tool-calc-input w-full" value={calc.stateRate} onChange={e => calc.setStateRate(e.target.value)} />
                  </div>
                </div>

                {/* Results */}
                {calc.result && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="tool-calc-result text-center">
                        <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Federal Tax</div>
                        <div className="text-lg font-black text-rose-600 dark:text-rose-400">{fmt(calc.result.federalTax)}</div>
                      </div>
                      <div className="tool-calc-result text-center">
                        <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">FICA Tax</div>
                        <div className="text-lg font-black text-orange-600 dark:text-orange-400">{fmt(calc.result.fica)}</div>
                      </div>
                      <div className="tool-calc-result text-center">
                        <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">State Tax</div>
                        <div className="text-lg font-black text-amber-600 dark:text-amber-400">{fmt(calc.result.stateTax)}</div>
                      </div>
                      <div className="tool-calc-result text-center">
                        <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Total Tax</div>
                        <div className="text-lg font-black text-red-600 dark:text-red-400">{fmt(calc.result.totalTax)}</div>
                      </div>
                      <div className="tool-calc-result text-center">
                        <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Effective Rate</div>
                        <div className="text-lg font-black text-purple-600 dark:text-purple-400">{fmt(calc.result.effectiveRate, true)}</div>
                      </div>
                      <div className="tool-calc-result text-center">
                        <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Marginal Rate</div>
                        <div className="text-lg font-black text-blue-600 dark:text-blue-400">{fmt(calc.result.marginalRate, true)}</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground">Annual Take-Home Pay</span>
                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{fmt(calc.result.takeHome)}</span>
                      </div>
                      <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                        <span>Monthly: <strong className="text-foreground">{fmt(calc.result.monthlyTakeHome)}</strong></span>
                        <span>Biweekly: <strong className="text-foreground">{fmt(calc.result.biweeklyTakeHome)}</strong></span>
                      </div>
                    </div>
                  </div>
                )}

                <ResultInsight result={calc.result} />
              </div>
            </section>

            {/* 5. HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How It Works</h2>
              <div className="space-y-5">
                {[
                  { color: "green", title: "Calculate Taxable Income", desc: "Your taxable income = Gross income − deductions. The calculator automatically uses the higher of the standard deduction or your itemized amount." },
                  { color: "blue", title: "Apply Federal Tax Brackets", desc: "The US uses a progressive tax system — each bracket only applies to income within that range. The calculator applies the 2024 IRS brackets accurately." },
                  { color: "purple", title: "Add FICA & State Tax", desc: "Social Security (6.2% up to $168,600) and Medicare (1.45%) are added separately. State tax is estimated using your input rate on taxable income." },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-lg bg-${step.color}-500/10 text-${step.color}-600 dark:text-${step.color}-400 flex items-center justify-center flex-shrink-0 font-bold text-sm`}>{i + 1}</div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">{step.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. REAL-LIFE EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/15">
                  <div className="flex items-center gap-2 mb-2"><Briefcase className="w-4 h-4 text-green-500" /><h4 className="font-bold text-foreground text-sm">Entry-Level Professional</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">$50,000 gross, single: Federal tax ~<strong className="text-foreground">$4,694</strong>, FICA ~<strong className="text-foreground">$3,825</strong>, ~10% effective rate, take-home ~<strong className="text-foreground">$37,481</strong>/year.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2"><Building2 className="w-4 h-4 text-blue-500" /><h4 className="font-bold text-foreground text-sm">Married Couple, Dual Income</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">$130,000 gross, married: Federal tax ~<strong className="text-foreground">$14,220</strong>, 22% marginal rate, effective rate ~<strong className="text-foreground">16.5%</strong>, take-home ~<strong className="text-foreground">$96,000</strong>.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2"><Wallet className="w-4 h-4 text-purple-500" /><h4 className="font-bold text-foreground text-sm">High Earner, Single</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">$200,000, single: Marginal rate 32%, effective ~<strong className="text-foreground">25%</strong>. FICA capped after $168,600 in Social Security wages. Take-home ~<strong className="text-foreground">$147,000</strong>.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2"><FileText className="w-4 h-4 text-amber-500" /><h4 className="font-bold text-foreground text-sm">Freelancer / 1099 Worker</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Self-employed pay 15.3% FICA (both halves). $80,000 net income means ~$12,240 in self-employment tax plus federal income tax on top.</p>
                </div>
              </div>
            </section>

            {/* 7. BENEFITS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Tax Calculator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <FileText className="w-4 h-4" />, text: "Uses 2024 IRS federal tax brackets" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Calculates FICA, state tax, and federal tax" },
                  { icon: <Shield className="w-4 h-4" />, text: "100% private — no data sent to servers" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Works on mobile and desktop" },
                  { icon: <Clock className="w-4 h-4" />, text: "Results update instantly as you type" },
                  { icon: <Calculator className="w-4 h-4" />, text: "Shows both effective and marginal rates" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 9. SEO CONTENT */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Understanding US Income Tax</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>The <strong className="text-foreground">United States federal income tax</strong> is progressive, meaning higher income levels are taxed at higher rates — but only the income in each bracket pays that rate. This is a common misconception: earning $50,000 doesn't mean all income is taxed at 22%. Only the portion above $47,150 (the 22% bracket threshold for single filers in 2024) is taxed at that rate.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">Marginal Rate vs. Effective Rate</h3>
                <p>Your <strong className="text-foreground">marginal rate</strong> is the tax bracket that applies to your highest dollar of income. Your <strong className="text-foreground">effective rate</strong> is the total tax you pay divided by your gross income — always lower than the marginal rate. For example, someone in the 22% bracket might have an effective rate of 14%.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">What Are FICA Taxes?</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Social Security: 6.2% on wages up to $168,600 (2024 wage base)",
                    "Medicare: 1.45% on all wages (no cap), plus 0.9% surtax over $200K (single)",
                    "Employers match these amounts — self-employed pay both halves (15.3% total)",
                    "FICA is paid in addition to income tax and is shown separately on your W-2",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 10. FAQ */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is the difference between marginal and effective tax rate?" a="Your marginal rate is the rate applied to your last dollar of income (the highest bracket you're in). Your effective rate is total taxes divided by gross income — it's always lower than the marginal rate because lower income is taxed at lower rates." />
                <FaqItem q="What is the standard deduction for 2024?" a="For tax year 2024: $14,600 for single filers, $29,200 for married filing jointly, and $21,900 for head of household. You can only deduct the higher of the standard deduction or your itemized deductions." />
                <FaqItem q="Does this include state taxes?" a="This calculator lets you enter a custom state income tax rate. Average US state income tax is around 4–6%, but it ranges from 0% (TX, FL, WA, NV) to over 13% (CA). Enter your state's rate for a complete estimate." />
                <FaqItem q="How accurate is this tax calculator?" a="This tool provides a close estimate based on 2024 IRS tax brackets and standard deductions. It does not account for tax credits (child tax credit, EITC, etc.), capital gains taxes, AMT, or self-employment tax. For exact filing, consult a CPA or use IRS Free File." />
                <FaqItem q="What is FICA and why is it separate from income tax?" a="FICA (Federal Insurance Contributions Act) funds Social Security and Medicare. It's a flat rate (Social Security: 6.2% up to $168,600; Medicare: 1.45%) separate from income tax brackets. It applies to earned wages regardless of your tax bracket." />
                <FaqItem q="Can this estimate taxes for married filing jointly?" a="Yes, select 'Married Filing Jointly' in the filing status dropdown. The 2024 standard deduction for MFJ is $29,200, and the tax brackets are roughly double the single filer thresholds, benefiting couples who are in a 22%+ bracket individually." />
              </div>
            </section>

            {/* 11. FINAL CTA */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Finance Tools</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">Explore salary calculators, ROI tools, mortgage calculators, and 400+ more free tools — all instant, all free.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={getToolPath(tool.slug)} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>
                        {tool.icon}
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">{tool.title}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help others estimate their 2024 taxes.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">On This Page</h3>
                <div className="space-y-1.5">
                  {["Calculator", "Tax Brackets", "How It Works", "Examples", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-medium py-1 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
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
