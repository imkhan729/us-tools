import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  DollarSign,
  Calendar,
  BarChart3,
  Calculator,
  CheckCircle2,
  Info,
  RefreshCw,
} from "lucide-react";
import { SEO } from "../../components/SEO";
import { Link } from "wouter";

// ─── helpers ────────────────────────────────────────────────────────────────
const fmtCur = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

const fmtPct = (n: number) => `${n.toFixed(2)}%`;

// ─── FAQ accordion ──────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-foreground hover:bg-muted/40 transition-colors"
      >
        <span>{q}</span>
        {open ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── frequency options ───────────────────────────────────────────────────────
type Freq = "monthly" | "quarterly" | "semiannual" | "annual";
const FREQ_OPTS: { value: Freq; label: string; perYear: number }[] = [
  { value: "monthly", label: "Monthly", perYear: 12 },
  { value: "quarterly", label: "Quarterly", perYear: 4 },
  { value: "semiannual", label: "Semi-Annual", perYear: 2 },
  { value: "annual", label: "Annual", perYear: 1 },
];

// ─── DRIP projection row ─────────────────────────────────────────────────────
interface DripRow {
  year: number;
  shares: number;
  dividendIncome: number;
  portfolioValue: number;
  cumulativeIncome: number;
}

function buildDrip(shares: number, price: number, annualDividend: number, growthRate: number, priceGrowth: number, years: number): DripRow[] {
  const rows: DripRow[] = [];
  let curShares = shares;
  let curPrice = price;
  let cumulativeIncome = 0;
  for (let y = 1; y <= years; y++) {
    curPrice = curPrice * (1 + priceGrowth / 100);
    const divPerShare = annualDividend * Math.pow(1 + growthRate / 100, y - 1);
    const income = curShares * divPerShare;
    cumulativeIncome += income;
    const newShares = curPrice > 0 ? income / curPrice : 0;
    curShares += newShares;
    rows.push({ year: y, shares: curShares, dividendIncome: income, portfolioValue: curShares * curPrice, cumulativeIncome });
  }
  return rows;
}

// ─── main component ─────────────────────────────────────────────────────────
export default function DividendCalculator() {
  const [sharePrice, setSharePrice] = useState("50");
  const [shares, setShares] = useState("100");
  const [dividendPerShare, setDividendPerShare] = useState("2.00");
  const [frequency, setFrequency] = useState<Freq>("quarterly");
  const [growthRate, setGrowthRate] = useState("5");
  const [priceGrowth, setPriceGrowth] = useState("3");
  const [projYears, setProjYears] = useState("10");
  const [drip, setDrip] = useState(true);
  const [showAllYears, setShowAllYears] = useState(false);

  const freqObj = FREQ_OPTS.find((f) => f.value === frequency)!;

  const result = useMemo(() => {
    const price = parseFloat(sharePrice) || 0;
    const sh = parseFloat(shares) || 0;
    const dpas = parseFloat(dividendPerShare) || 0;
    const gr = parseFloat(growthRate) || 0;
    const pg = parseFloat(priceGrowth) || 0;
    const yrs = Math.min(parseInt(projYears) || 10, 50);
    if (price <= 0 || sh <= 0 || dpas <= 0) return null;

    const annualDividend = dpas * freqObj.perYear;
    const dividendYield = price > 0 ? (annualDividend / price) * 100 : 0;
    const investmentValue = price * sh;
    const annualIncome = annualDividend * sh;
    const perPayment = annualIncome / freqObj.perYear;
    const monthlyEquivalent = annualIncome / 12;

    const projection = buildDrip(sh, price, annualDividend, gr, pg, yrs);
    const finalRow = projection[projection.length - 1];

    return {
      annualDividend,
      dividendYield,
      investmentValue,
      annualIncome,
      perPayment,
      monthlyEquivalent,
      projection,
      finalRow,
      yrs,
    };
  }, [sharePrice, shares, dividendPerShare, frequency, growthRate, priceGrowth, projYears, freqObj]);

  const displayRows = result
    ? showAllYears ? result.projection : result.projection.slice(0, 5)
    : [];

  return (
    <div style={{ "--calc-hue": "38" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Dividend Calculator — Estimate Dividend Income & DRIP Growth"
        description="Calculate annual dividend income, yield, and DRIP reinvestment growth over time. Plan your passive income strategy with our free dividend calculator."
      />

      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/category/finance" className="hover:text-foreground transition-colors">Finance & Cost</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Dividend Calculator</span>
      </nav>

      {/* Hero */}
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),80%,40%)] bg-[hsl(var(--calc-hue),90%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">
          Finance & Cost
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
          Dividend Calculator
        </h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free", "No Signup", "DRIP Projection", "Instant Results"].map((b) => (
            <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>
          ))}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Calculate your annual dividend income and model long-term DRIP (Dividend Reinvestment Plan) growth. See exactly how compounding dividends can build wealth over time.
        </p>
      </header>

      {/* Main grid */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ── Calculator ─────────────────────────────────────── */}
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[hsl(var(--calc-hue),80%,40%)]" />
              Dividend Details
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="tool-calc-label">Share Price ($)</label>
                <input className="tool-calc-input" type="number" min="0" step="0.01" value={sharePrice} onChange={(e) => setSharePrice(e.target.value)} placeholder="50.00" />
              </div>
              <div>
                <label className="tool-calc-label">Number of Shares</label>
                <input className="tool-calc-input" type="number" min="1" value={shares} onChange={(e) => setShares(e.target.value)} placeholder="100" />
              </div>
              <div>
                <label className="tool-calc-label">Dividend per Share (per payment)</label>
                <input className="tool-calc-input" type="number" min="0" step="0.01" value={dividendPerShare} onChange={(e) => setDividendPerShare(e.target.value)} placeholder="0.50" />
              </div>
              <div>
                <label className="tool-calc-label">Payment Frequency</label>
                <select className="tool-calc-input" value={frequency} onChange={(e) => setFrequency(e.target.value as Freq)}>
                  {FREQ_OPTS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 mt-5">DRIP Projection Settings</p>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="tool-calc-label">Dividend Growth Rate (%/yr)</label>
                <input className="tool-calc-input" type="number" min="0" step="0.1" value={growthRate} onChange={(e) => setGrowthRate(e.target.value)} placeholder="5" />
              </div>
              <div>
                <label className="tool-calc-label">Stock Price Growth (%/yr)</label>
                <input className="tool-calc-input" type="number" min="0" step="0.1" value={priceGrowth} onChange={(e) => setPriceGrowth(e.target.value)} placeholder="3" />
              </div>
              <div>
                <label className="tool-calc-label">Projection Years</label>
                <input className="tool-calc-input" type="number" min="1" max="50" value={projYears} onChange={(e) => setProjYears(e.target.value)} placeholder="10" />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setDrip(!drip)}
                className={`relative w-12 h-6 rounded-full transition-colors ${drip ? "bg-[hsl(var(--calc-hue),80%,50%)]" : "bg-muted"}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${drip ? "left-7" : "left-1"}`} />
              </button>
              <label className="text-sm font-medium flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),80%,40%)]" />
                Reinvest Dividends (DRIP)
              </label>
            </div>

            {result ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${sharePrice}-${shares}-${dividendPerShare}-${frequency}-${growthRate}-${priceGrowth}-${projYears}-${drip}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Income summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Dividend Yield", value: fmtPct(result.dividendYield), icon: <BarChart3 className="w-4 h-4" />, color: "text-amber-600" },
                      { label: `Per ${freqObj.label.replace("ly", "")} Payment`, value: fmtCur(result.perPayment), icon: <Calendar className="w-4 h-4" />, color: "text-blue-600" },
                      { label: "Annual Income", value: fmtCur(result.annualIncome), icon: <DollarSign className="w-4 h-4" />, color: "text-green-600" },
                      { label: "Monthly Equiv.", value: fmtCur(result.monthlyEquivalent), icon: <TrendingUp className="w-4 h-4" />, color: "text-purple-600" },
                    ].map((c) => (
                      <div key={c.label} className="tool-calc-result text-center">
                        <div className={`flex justify-center mb-1 ${c.color}`}>{c.icon}</div>
                        <div className={`tool-calc-number text-lg font-bold ${c.color}`}>{c.value}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{c.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Investment snapshot */}
                  <div className="bg-muted/30 rounded-xl p-4 text-sm flex flex-wrap gap-4">
                    <div><span className="text-muted-foreground">Investment Value: </span><span className="font-semibold">{fmtCur(result.investmentValue)}</span></div>
                    <div><span className="text-muted-foreground">Annual DPS: </span><span className="font-semibold">{fmtCur(result.annualDividend)}</span></div>
                    <div><span className="text-muted-foreground">Payments/Year: </span><span className="font-semibold">{freqObj.perYear}</span></div>
                  </div>

                  {/* DRIP projection */}
                  <div>
                    <p className="font-semibold mb-2 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-[hsl(var(--calc-hue),80%,40%)]" />
                      {drip ? "DRIP" : "Without DRIP"} Projection — Year {result.yrs} Summary
                    </p>
                    <div className="grid sm:grid-cols-3 gap-3 mb-3">
                      {[
                        { label: "Portfolio Value", value: fmtCur(result.finalRow.portfolioValue) },
                        { label: "Annual Income (Yr " + result.yrs + ")", value: fmtCur(result.finalRow.dividendIncome) },
                        { label: "Cumulative Income", value: fmtCur(result.finalRow.cumulativeIncome) },
                      ].map((c) => (
                        <div key={c.label} className="tool-calc-result text-center">
                          <div className="tool-calc-number text-base font-bold text-[hsl(var(--calc-hue),80%,40%)]">{c.value}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{c.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            {["Year", "Shares", "Annual Income", "Portfolio Value", "Cumul. Income"].map((h) => (
                              <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {displayRows.map((row) => (
                            <tr key={row.year} className="border-t border-border hover:bg-muted/20 transition-colors">
                              <td className="px-3 py-2 text-muted-foreground">{row.year}</td>
                              <td className="px-3 py-2 font-medium">{drip ? row.shares.toFixed(2) : parseFloat(shares).toFixed(2)}</td>
                              <td className="px-3 py-2 text-green-600">{fmtCur(drip ? row.dividendIncome : row.dividendIncome * (parseFloat(shares) / row.shares))}</td>
                              <td className="px-3 py-2">{fmtCur(row.portfolioValue)}</td>
                              <td className="px-3 py-2">{fmtCur(row.cumulativeIncome)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {result.yrs > 5 && (
                      <button
                        onClick={() => setShowAllYears(!showAllYears)}
                        className="mt-3 w-full py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted/40 transition-colors flex items-center justify-center gap-2"
                      >
                        {showAllYears ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {showAllYears ? "Show First 5 Years" : `Show All ${result.yrs} Years`}
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Calculator className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>Enter dividend details above to calculate income.</p>
              </div>
            )}
          </div>

          {/* How to Use */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">How to Use This Calculator</h2>
            <ol className="space-y-3">
              {[
                ["Share Price & Count", "Enter the stock's current price and how many shares you hold."],
                ["Dividend per Share", "Enter the dividend paid per share per payment (from the company's declaration)."],
                ["Set Frequency", "Choose how often dividends are paid: monthly, quarterly, semi-annual, or annual."],
                ["Configure DRIP", "Toggle on to model reinvestment of all dividends into additional shares."],
                ["Review Projection", "View annual income, portfolio value, and cumulative income over your chosen horizon."],
              ].map(([step, desc], i) => (
                <li key={step} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[hsl(var(--calc-hue),80%,45%)] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-semibold">{step}: </span>
                    <span className="text-muted-foreground">{desc}</span>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-5 bg-muted/40 rounded-xl p-4 font-mono text-sm">
              <p className="font-semibold mb-1 text-foreground">Key Formulas:</p>
              <code className="text-[hsl(var(--calc-hue),70%,38%)] block mb-1">Annual Income = DPS × Payments/Year × Shares</code>
              <code className="text-[hsl(var(--calc-hue),70%,38%)] block mb-1">Dividend Yield = (Annual DPS / Share Price) × 100</code>
              <code className="text-[hsl(var(--calc-hue),70%,38%)] block">DRIP: new shares = dividend income / current price</code>
            </div>
          </div>

          {/* Understanding Results */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Understanding Your Results</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Dividend Yield", desc: "Annual dividend as a percentage of the current share price. A 4% yield on a $50 stock means $2 annual dividend per share.", color: "border-l-amber-500" },
                { title: "Annual Income", desc: "Total dividends received in a year based on your current share count, before any reinvestment.", color: "border-l-green-500" },
                { title: "DRIP Growth", desc: "When reinvesting dividends, each payment buys new shares. Over time, you earn dividends on a growing number of shares — compounding accelerates returns.", color: "border-l-blue-500" },
                { title: "Portfolio Value", desc: "Total value of all shares held (including DRIP-acquired shares) at projected prices. Shows how wealth builds over the holding period.", color: "border-l-purple-500" },
              ].map((c) => (
                <div key={c.title} className={`border-l-4 ${c.color} pl-4 py-2 bg-muted/30 rounded-r-xl`}>
                  <p className="font-semibold mb-1">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Examples */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Quick Examples</h2>
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-3 py-2 text-left font-semibold">Investment</th>
                    <th className="px-3 py-2 text-left font-semibold">Yield</th>
                    <th className="px-3 py-2 text-left font-semibold">Annual Income</th>
                    <th className="px-3 py-2 text-left font-semibold">10-yr DRIP Value*</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["$5,000 @ $50/share", "4%", "$200", "~$8,200"],
                    ["$10,000 @ $100/share", "3%", "$300", "~$14,800"],
                    ["$50,000 @ $50/share", "5%", "$2,500", "~$95,000"],
                    ["$100,000 @ $25/share", "6%", "$6,000", "~$200,000"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-border">
                      {row.map((cell, i) => (
                        <td key={i} className="px-3 py-2">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-muted-foreground mt-1">*Approximate, assuming 5% dividend growth, 3% price growth, dividends reinvested</p>
            </div>

            <p className="text-muted-foreground mb-3">
              <strong>DRIP is one of the most powerful compounding tools available to individual investors.</strong> When you reinvest dividends, each new share you acquire also earns dividends, which buy more shares, which earn more dividends. Over a 20–30 year horizon, a significant portion of your portfolio's total return can come from this compounding effect alone.
            </p>
            <p className="text-muted-foreground mb-3">
              <strong>Dividend growth rate matters as much as current yield.</strong> A stock yielding 2% that grows its dividend by 10% annually will eventually pay more in absolute dollars than a 5% yielder with no dividend growth. Dividend growth investors often focus on this metric rather than raw yield.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Dividend income provides cash flow without selling shares.</strong> For retirees or income-focused investors, this creates passive income that doesn't require liquidating positions — the portfolio can continue growing while income is distributed.
            </p>

            <blockquote className="border-l-4 border-[hsl(var(--calc-hue),80%,45%)] pl-4 italic text-muted-foreground bg-muted/30 rounded-r-xl py-3 pr-4">
              "Do you know the only thing that gives me pleasure? It's to see my dividends coming in." — John D. Rockefeller
            </blockquote>
          </div>

          {/* Why Use This Tool */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Why Use This Dividend Calculator?</h2>
            <p className="text-muted-foreground mb-3">
              Dividend investing requires modeling not just current yield but future income growth. This calculator lets you project how a position grows over years — showing the power of dividend compounding alongside stock price appreciation.
            </p>
            <p className="text-muted-foreground mb-3">
              The DRIP toggle lets you directly compare reinvestment vs. taking dividends as cash. The difference over 10–20 years is substantial, helping you decide whether reinvestment makes sense for your income needs.
            </p>
            <p className="text-muted-foreground mb-3">
              Income-seeking investors — particularly those planning for retirement — can use this to estimate when their dividend income will cover a target monthly expense, helping model the "live off dividends" milestone.
            </p>
            <p className="text-muted-foreground mb-3">
              Portfolio builders can compare multiple dividend stocks side by side: a high-yield, no-growth stock versus a lower-yield, high-growth stock. Often the latter wins decisively over long time horizons.
            </p>
            <p className="text-xs text-muted-foreground border border-border rounded-xl p-4 mt-2">
              <Info className="inline w-3.5 h-3.5 mr-1 mb-0.5" />
              <strong>Disclaimer:</strong> Dividend income and stock prices are not guaranteed. Past dividend growth does not guarantee future dividends. This tool is for educational modeling purposes only.
            </p>
          </div>

          {/* FAQ */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <FaqItem q="What is dividend yield?" a="Dividend yield is the annual dividend per share divided by the stock's current price, expressed as a percentage. A $2 annual dividend on a $50 stock gives a 4% yield. It shows your income return relative to what you paid for the stock." />
              <FaqItem q="What is DRIP (Dividend Reinvestment Plan)?" a="DRIP automatically reinvests dividend payments into additional shares of the same stock, often commission-free. This accelerates compounding: you earn dividends on an ever-growing number of shares, not just your original position." />
              <FaqItem q="How are dividends taxed?" a="In the US, qualified dividends (held over 60 days, from qualifying corporations) are taxed at long-term capital gains rates (0%, 15%, 20%). Non-qualified dividends are taxed as ordinary income. Always check your specific tax situation." />
              <FaqItem q="What is a good dividend yield?" a="There's no universal answer. Yields above 5–6% warrant scrutiny — they can signal that the stock price has fallen (which inflates the yield ratio) or that a dividend cut may be coming. Many quality dividend investors target 2–4% yields with strong growth." />
              <FaqItem q="How do I find a stock's dividend per share?" a="Check the company's investor relations page, your broker's stock detail page, or financial data sites. The dividend per share is usually stated as an annual amount or per-payment amount. Multiply per-payment by payment frequency for the annual total." />
              <FaqItem q="Can dividend income fund retirement?" a="Yes — this is the 'dividend income' retirement strategy. The goal is to accumulate enough shares that annual dividends cover living expenses without selling shares. The portfolio continues to grow while funding income, unlike the 4% withdrawal rule which draws down principal." />
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),80%,50%)] to-[hsl(var(--calc-hue),70%,38%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Build Your Passive Income Plan</h2>
            <p className="mb-5 opacity-90">Combine dividend modeling with our other investment tools to map your full financial picture.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/finance/online-compound-interest-calculator" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">
                Compound Interest
              </Link>
              <Link href="/finance/online-retirement-calculator" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">
                Retirement Calculator
              </Link>
            </div>
          </div>
        </section>

        {/* ── Sidebar ────────────────────────────────────────── */}
        <aside className="space-y-5">
          <div className="sticky top-4 space-y-5">
            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">On This Page</p>
              <nav className="space-y-1 text-sm">
                {["Calculator", "How to Use", "Understanding Results", "Quick Examples", "Why Use This Tool", "FAQ"].map((s) => (
                  <a key={s} href={`#${s.toLowerCase().replace(/ /g, "-")}`} className="block py-1 text-muted-foreground hover:text-foreground transition-colors">{s}</a>
                ))}
              </nav>
            </div>

            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1.5 text-sm">
                {[
                  ["/finance/stock-profit-calculator", "Stock Profit Calculator"],
                  ["/finance/online-compound-interest-calculator", "Compound Interest"],
                  ["/finance/online-roi-calculator", "ROI Calculator"],
                  ["/finance/online-retirement-calculator", "Retirement Calculator"],
                  ["/finance/savings-calculator", "Savings Calculator"],
                ].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),80%,45%)] shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["Free to use, no login", "DRIP modeling included", "Works on all devices", "No data stored"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
