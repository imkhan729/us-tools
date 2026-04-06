import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  Calculator, Lightbulb, Copy, Check,
  DollarSign, Car, Percent, Landmark, Wallet, Building2,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

function useCarLoanCalc() {
  const [price, setPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [tradeIn, setTradeIn] = useState("");
  const [rate, setRate] = useState("");
  const [term, setTerm] = useState("60");

  const result = useMemo(() => {
    const p = parseFloat(price) || 0;
    const dp = parseFloat(downPayment) || 0;
    const ti = parseFloat(tradeIn) || 0;
    const r = parseFloat(rate);
    const t = parseInt(term);
    if (p <= 0 || isNaN(r) || r < 0 || t <= 0) return null;
    const loanAmount = Math.max(0, p - dp - ti);
    let monthlyPayment: number;
    if (r === 0) {
      monthlyPayment = loanAmount / t;
    } else {
      const mr = r / 100 / 12;
      monthlyPayment = loanAmount * (mr * Math.pow(1 + mr, t)) / (Math.pow(1 + mr, t) - 1);
    }
    const totalPaid = monthlyPayment * t;
    const totalInterest = totalPaid - loanAmount;
    return { loanAmount, monthlyPayment, totalPaid, totalInterest, totalCost: totalPaid + dp + ti };
  }, [price, downPayment, tradeIn, rate, term]);

  return { price, setPrice, downPayment, setDownPayment, tradeIn, setTradeIn, rate, setRate, term, setTerm, result };
}

function ResultInsight({ result }: { result: ReturnType<typeof useCarLoanCalc>["result"] }) {
  if (!result) return null;
  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  const interestPct = ((result.totalInterest / result.totalCost) * 100).toFixed(1);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          Your monthly payment is <strong>{fmt(result.monthlyPayment)}</strong>. Over the loan term you'll pay <strong>{fmt(result.totalInterest)}</strong> in interest ({interestPct}% of total cost). Total cost of ownership including down payment is <strong>{fmt(result.totalCost)}</strong>.
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
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary"><ChevronDown className="w-5 h-5" /></motion.span>
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
  { title: "Loan EMI Calculator", slug: "online-loan-emi-calculator", icon: <Landmark className="w-5 h-5" />, color: 217 },
  { title: "Mortgage Payment Calculator", slug: "online-mortgage-payment-calculator", icon: <Building2 className="w-5 h-5" />, color: 152 },
  { title: "Compound Interest Calculator", slug: "online-compound-interest-calculator", icon: <TrendingUp className="w-5 h-5" />, color: 265 },
  { title: "Salary Calculator", slug: "online-salary-calculator", icon: <DollarSign className="w-5 h-5" />, color: 45 },
  { title: "ROI Calculator", slug: "online-roi-calculator", icon: <Percent className="w-5 h-5" />, color: 340 },
  { title: "Savings Calculator", slug: "savings-calculator", icon: <Wallet className="w-5 h-5" />, color: 25 },
];

export default function CarLoanCalculator() {
  const calc = useCarLoanCalc();
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const fmt = (n: number | undefined) => n === undefined ? "--" : "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <Layout>
      <SEO
        title="Car Loan Calculator - Monthly Auto Loan Payment Estimator | Free Tool"
        description="Free car loan calculator. Estimate monthly auto loan payments, total interest, and total cost. Enter vehicle price, down payment, interest rate, and loan term."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "WebApplication", "name": "Car Loan Calculator", "url": "https://usonlinetools.com/finance/online-car-loan-calculator", "applicationCategory": "FinanceApplication", "operatingSystem": "Any", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } },
          { "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": "How is a car loan payment calculated?", "acceptedAnswer": { "@type": "Answer", "text": "Monthly payment = P × [r(1+r)^n] / [(1+r)^n - 1], where P = loan amount, r = monthly interest rate, n = number of payments." } }] }
        ]
      })}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Car Loan Calculator</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            <section>
              <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Car className="w-3.5 h-3.5" />
                Auto Finance
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">Car Loan Calculator</h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Calculate your monthly car payment, total interest paid, and full loan cost. Enter the vehicle price, down payment, trade-in value, APR, and loan term to get an instant estimate — free, no signup required.
              </p>
            </section>

            {/* QUICK ANSWER */}
            <section className="p-5 rounded-xl bg-blue-500/5 border-2 border-blue-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-blue-500" />
                <h2 className="font-black text-foreground text-base">Auto Loan Formula</h2>
              </div>
              <div className="font-mono text-sm bg-background rounded-lg p-3 border border-border">
                Monthly Payment = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]
              </div>
              <p className="text-xs text-muted-foreground mt-2">P = loan amount, r = monthly rate (APR/12), n = number of months</p>
            </section>

            {/* QUICK ACTION */}
            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Zap className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="font-bold text-foreground text-sm">Estimate your car payment in seconds</p>
                <p className="text-muted-foreground text-sm">Enter vehicle price and loan details — see monthly payment, total interest, and total cost instantly.</p>
              </div>
            </section>

            {/* TOOL */}
            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 210 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Auto Loan Calculator</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Vehicle Price ($)</label>
                    <input type="number" placeholder="30000" className="tool-calc-input w-full" value={calc.price} onChange={e => calc.setPrice(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Down Payment ($)</label>
                    <input type="number" placeholder="5000" className="tool-calc-input w-full" value={calc.downPayment} onChange={e => calc.setDownPayment(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Trade-In Value ($)</label>
                    <input type="number" placeholder="0" className="tool-calc-input w-full" value={calc.tradeIn} onChange={e => calc.setTradeIn(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Annual Interest Rate (APR %)</label>
                    <input type="number" placeholder="6.5" className="tool-calc-input w-full" value={calc.rate} onChange={e => calc.setRate(e.target.value)} step="0.1" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-semibold text-muted-foreground mb-2 block">Loan Term</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["24", "36", "48", "60", "72", "84"].map(t => (
                        <button key={t} onClick={() => calc.setTerm(t)} className={`py-2 rounded-xl border font-bold text-sm transition-all ${calc.term === t ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40 text-muted-foreground"}`}>
                          {t} mo
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {calc.result && (
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                    <div className="tool-calc-result text-center col-span-2">
                      <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Monthly Payment</div>
                      <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{fmt(calc.result.monthlyPayment)}</div>
                    </div>
                    <div className="tool-calc-result text-center">
                      <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Loan Amount</div>
                      <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{fmt(calc.result.loanAmount)}</div>
                    </div>
                    <div className="tool-calc-result text-center">
                      <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Total Interest</div>
                      <div className="text-lg font-black text-rose-600 dark:text-rose-400">{fmt(calc.result.totalInterest)}</div>
                    </div>
                    <div className="tool-calc-result text-center">
                      <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Total Paid</div>
                      <div className="text-lg font-black text-amber-600 dark:text-amber-400">{fmt(calc.result.totalPaid)}</div>
                    </div>
                    <div className="tool-calc-result text-center">
                      <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Total Cost</div>
                      <div className="text-lg font-black text-purple-600 dark:text-purple-400">{fmt(calc.result.totalCost)}</div>
                    </div>
                  </div>
                )}
                <ResultInsight result={calc.result} />
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How It Works</h2>
              <div className="space-y-5">
                {[
                  { color: "blue", title: "Calculate Loan Amount", desc: "Vehicle price minus down payment and trade-in value equals your financed amount. A larger down payment or trade-in reduces monthly payments and total interest paid." },
                  { color: "emerald", title: "Apply Amortization Formula", desc: "The standard auto loan formula calculates your monthly payment based on loan amount, annual percentage rate (APR), and number of monthly payments." },
                  { color: "amber", title: "See Total Interest Cost", desc: "Total interest = (monthly payment × months) − loan amount. A longer term lowers monthly payments but increases total interest paid significantly." },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-lg bg-${step.color}-500/10 text-${step.color}-600 dark:text-${step.color}-400 flex items-center justify-center flex-shrink-0 font-bold text-sm`}>{i + 1}</div>
                    <div><h4 className="font-bold text-foreground mb-1">{step.title}</h4><p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p></div>
                  </div>
                ))}
              </div>
            </section>

            {/* REAL-LIFE EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2"><Car className="w-4 h-4 text-blue-500" /><h4 className="font-bold text-foreground text-sm">New Car Purchase</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">$30K car, $5K down, 6.5% APR, 60 months → <strong className="text-foreground">$483/mo</strong>, $3,978 total interest.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2"><DollarSign className="w-4 h-4 text-emerald-500" /><h4 className="font-bold text-foreground text-sm">Used Car, Short Term</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">$15K used car, $3K down, 8% APR, 36 months → <strong className="text-foreground">$376/mo</strong>, only $1,537 in interest.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2"><Wallet className="w-4 h-4 text-amber-500" /><h4 className="font-bold text-foreground text-sm">Luxury Car, Long Term</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">$60K car, $10K down, 7% APR, 84 months → <strong className="text-foreground">$752/mo</strong> but $13,168 in interest — the cost of stretching payments.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-purple-500" /><h4 className="font-bold text-foreground text-sm">Trade-In Impact</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Adding a $5K trade-in on a $25K car saves the same as a $5K down payment — reduces loan to $20K and cuts monthly payment by ~$96 (60 mo, 6%).</p>
                </div>
              </div>
            </section>

            {/* BENEFITS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Calculator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Car className="w-4 h-4" />, text: "Includes trade-in value in calculations" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Shows total interest and full loan cost" },
                  { icon: <Shield className="w-4 h-4" />, text: "No data stored or sent to servers" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Use at the dealership on your phone" },
                  { icon: <Clock className="w-4 h-4" />, text: "Instant results, 6 term options" },
                  { icon: <Calculator className="w-4 h-4" />, text: "Based on standard amortization formula" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SEO CONTENT */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Understanding Auto Loan Costs</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>An <strong className="text-foreground">auto loan calculator</strong> helps you understand the true cost of financing a vehicle before you sign at the dealership. The monthly payment is just one part — the total interest paid over the loan term can add thousands of dollars to the vehicle's actual cost.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">How APR Affects Your Payment</h3>
                <p>APR (Annual Percentage Rate) is the annual interest rate charged on your loan. Even a 1% difference in APR can significantly change total interest: on a $25,000 loan over 60 months, going from 5% to 7% APR adds over $1,300 in interest. Always shop for the best rate before accepting dealer financing.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">Tips to Reduce Your Car Loan Cost</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Make a larger down payment to reduce the financed amount",
                    "Choose a shorter loan term (36 or 48 months) to pay less interest",
                    "Get pre-approved by a bank or credit union before visiting the dealer",
                    "Include your trade-in value to reduce the loan principal",
                    "Improve your credit score before applying to qualify for lower APR",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How is a car loan monthly payment calculated?" a="Monthly payment = P × [r(1+r)^n] / [(1+r)^n - 1], where P is the loan amount, r is the monthly interest rate (APR ÷ 12), and n is the number of monthly payments. The calculator applies this formula instantly." />
                <FaqItem q="What is a good APR for a car loan in 2024?" a="As of 2024, average new car loan rates range from 5–8% for borrowers with good credit (700+). Used car rates are typically 1–3% higher. Credit unions often offer lower rates than dealerships. Excellent credit (750+) may qualify for 0% promotional rates." />
                <FaqItem q="Should I choose a shorter or longer loan term?" a="A shorter term (36–48 months) means higher monthly payments but significantly less total interest. A longer term (72–84 months) lowers monthly payments but you pay more total and may be underwater on the loan (owe more than the car's value)." />
                <FaqItem q="How does a trade-in affect my car loan?" a="A trade-in reduces the vehicle purchase price, directly lowering your loan amount and monthly payment. It's equivalent to a down payment. If you owe money on your trade-in (negative equity), that balance may be rolled into the new loan." />
                <FaqItem q="What is the 20/4/10 car buying rule?" a="A popular guideline: put 20% down, finance for no more than 4 years, and keep total monthly transportation costs (payment + insurance) under 10% of gross monthly income. This helps avoid being financially overextended on a vehicle." />
                <FaqItem q="Does this calculator include taxes and fees?" a="No, this calculator estimates the financing cost based on the vehicle price, down payment, rate, and term. Actual costs include sales tax, registration fees, dealer fees, and GAP insurance. Add these to the vehicle price for a more complete estimate." />
              </div>
            </section>

            {/* FINAL CTA */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Finance Tools</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">Explore mortgage calculators, savings tools, ROI calculators, and 400+ more free tools.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
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
                <p className="text-sm text-muted-foreground mb-4">Help car buyers estimate their monthly payments.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
