import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart2,
  Calculator,
  CheckCircle2,
  Info,
  Percent,
} from "lucide-react";
import { SEO } from "../../components/SEO";
import { Link } from "wouter";

// ─── helpers ────────────────────────────────────────────────────────────────
const fmtCur = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

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

// ─── main component ─────────────────────────────────────────────────────────
export default function StockProfitCalculator() {
  const [buyPrice, setBuyPrice] = useState("50");
  const [sellPrice, setSellPrice] = useState("75");
  const [shares, setShares] = useState("100");
  const [buyFee, setBuyFee] = useState("0");
  const [sellFee, setSellFee] = useState("0");
  const [taxRate, setTaxRate] = useState("20");

  const result = useMemo(() => {
    const bp = parseFloat(buyPrice) || 0;
    const sp = parseFloat(sellPrice) || 0;
    const sh = parseFloat(shares) || 0;
    const bf = parseFloat(buyFee) || 0;
    const sf = parseFloat(sellFee) || 0;
    const tr = parseFloat(taxRate) || 0;
    if (bp <= 0 || sh <= 0) return null;

    const totalCost = bp * sh + bf;
    const totalRevenue = sp * sh - sf;
    const grossProfit = sp * sh - bp * sh;
    const netProfit = totalRevenue - totalCost;
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
    const taxOwed = netProfit > 0 ? netProfit * (tr / 100) : 0;
    const afterTaxProfit = netProfit - taxOwed;
    const priceChangeRaw = sp > 0 ? ((sp - bp) / bp) * 100 : 0;

    return { totalCost, totalRevenue, grossProfit, netProfit, roi, taxOwed, afterTaxProfit, priceChangeRaw, isProfit: netProfit >= 0 };
  }, [buyPrice, sellPrice, shares, buyFee, sellFee, taxRate]);

  return (
    <div style={{ "--calc-hue": "142" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Stock Profit Calculator — Calculate Gains & Losses from Trades"
        description="Calculate your stock trade profit or loss including commissions and taxes. See ROI, net profit, and after-tax returns. Free online stock profit calculator."
      />

      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/category/finance" className="hover:text-foreground transition-colors">Finance & Cost</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Stock Profit Calculator</span>
      </nav>

      {/* Hero */}
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),70%,45%)] bg-[hsl(var(--calc-hue),80%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">
          Finance & Cost
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
          Stock Profit Calculator
        </h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free", "No Signup", "Includes Fees & Tax", "Instant Results"].map((b) => (
            <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>
          ))}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Calculate exact profit or loss from any stock trade — including brokerage commissions and capital gains tax. Know your real return before you sell.
        </p>
      </header>

      {/* Main grid */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ── Calculator ─────────────────────────────────────── */}
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[hsl(var(--calc-hue),70%,45%)]" />
              Trade Details
            </h2>

            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="tool-calc-label">Buy Price (per share)</label>
                <input className="tool-calc-input" type="number" min="0" step="0.01" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} placeholder="50.00" />
              </div>
              <div>
                <label className="tool-calc-label">Sell Price (per share)</label>
                <input className="tool-calc-input" type="number" min="0" step="0.01" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="75.00" />
              </div>
              <div>
                <label className="tool-calc-label">Number of Shares</label>
                <input className="tool-calc-input" type="number" min="1" value={shares} onChange={(e) => setShares(e.target.value)} placeholder="100" />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="tool-calc-label">Buy Commission ($)</label>
                <input className="tool-calc-input" type="number" min="0" step="0.01" value={buyFee} onChange={(e) => setBuyFee(e.target.value)} placeholder="0" />
              </div>
              <div>
                <label className="tool-calc-label">Sell Commission ($)</label>
                <input className="tool-calc-input" type="number" min="0" step="0.01" value={sellFee} onChange={(e) => setSellFee(e.target.value)} placeholder="0" />
              </div>
              <div>
                <label className="tool-calc-label">Capital Gains Tax Rate (%)</label>
                <input className="tool-calc-input" type="number" min="0" max="100" step="0.1" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} placeholder="20" />
              </div>
            </div>

            {result ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${buyPrice}-${sellPrice}-${shares}-${buyFee}-${sellFee}-${taxRate}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Profit/loss banner */}
                  <div className={`rounded-xl p-4 flex items-center gap-4 ${result.isProfit ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"}`}>
                    {result.isProfit
                      ? <TrendingUp className="w-8 h-8 text-green-600 shrink-0" />
                      : <TrendingDown className="w-8 h-8 text-red-500 shrink-0" />}
                    <div>
                      <p className="text-sm text-muted-foreground">Net Profit / Loss</p>
                      <p className={`text-3xl font-extrabold ${result.isProfit ? "text-green-600" : "text-red-500"}`}>
                        {fmtCur(result.netProfit)}
                      </p>
                      <p className="text-sm text-muted-foreground">{fmtPct(result.roi)} ROI</p>
                    </div>
                  </div>

                  {/* Metric cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { label: "Total Cost", value: fmtCur(result.totalCost), icon: <DollarSign className="w-4 h-4" />, color: "text-muted-foreground" },
                      { label: "Total Revenue", value: fmtCur(result.totalRevenue), icon: <BarChart2 className="w-4 h-4" />, color: "text-blue-600" },
                      { label: "Gross Profit", value: fmtCur(result.grossProfit), icon: <TrendingUp className="w-4 h-4" />, color: "text-emerald-600" },
                      { label: "Tax Owed", value: fmtCur(result.taxOwed), icon: <Percent className="w-4 h-4" />, color: "text-amber-600" },
                      { label: "After-Tax Profit", value: fmtCur(result.afterTaxProfit), icon: <CheckCircle2 className="w-4 h-4" />, color: result.afterTaxProfit >= 0 ? "text-green-600" : "text-red-500" },
                      { label: "Price Change", value: fmtPct(result.priceChangeRaw), icon: <BarChart2 className="w-4 h-4" />, color: result.priceChangeRaw >= 0 ? "text-green-600" : "text-red-500" },
                    ].map((c) => (
                      <div key={c.label} className="tool-calc-result">
                        <div className={`flex items-center gap-1.5 mb-1 ${c.color}`}>{c.icon}<span className="text-xs text-muted-foreground">{c.label}</span></div>
                        <div className={`tool-calc-number text-lg font-bold ${c.color}`}>{c.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Visual breakdown bar */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Profit composition: cost basis → gross profit → tax → after-tax</p>
                    <div className="w-full h-4 rounded-full overflow-hidden bg-muted flex">
                      {result.totalRevenue > 0 && (() => {
                        const total = result.totalRevenue;
                        const costW = (result.totalCost / total) * 100;
                        const grossW = Math.max(0, (result.grossProfit / total) * 100);
                        const taxW = (result.taxOwed / total) * 100;
                        return (
                          <>
                            <div className="h-full bg-slate-400" style={{ width: `${Math.min(costW, 100)}%` }} />
                            <div className="h-full bg-[hsl(var(--calc-hue),70%,50%)]" style={{ width: `${Math.max(0, grossW - taxW)}%` }} />
                            <div className="h-full bg-amber-400" style={{ width: `${taxW}%` }} />
                          </>
                        );
                      })()}
                    </div>
                    <div className="flex gap-4 mt-1.5 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-slate-400 inline-block" />Cost Basis</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[hsl(var(--calc-hue),70%,50%)] inline-block" />After-Tax Profit</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" />Tax</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Calculator className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>Enter trade details above to calculate your profit.</p>
              </div>
            )}
          </div>

          {/* How to Use */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">How to Use This Calculator</h2>
            <ol className="space-y-3">
              {[
                ["Enter Buy Price", "The price per share when you purchased the stock."],
                ["Enter Sell Price", "The price per share at which you sold (or plan to sell)."],
                ["Set Share Count", "Number of shares bought and sold in this trade."],
                ["Add Commissions", "Optional: Include brokerage fees for buy and sell legs."],
                ["Set Tax Rate", "Enter your applicable capital gains tax rate (0 if not applicable)."],
              ].map(([step, desc], i) => (
                <li key={step} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[hsl(var(--calc-hue),70%,45%)] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
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
              <p className="font-semibold mb-1 text-foreground">Profit Formulas:</p>
              <code className="text-[hsl(var(--calc-hue),60%,40%)] block mb-1">Gross Profit = (Sell − Buy) × Shares</code>
              <code className="text-[hsl(var(--calc-hue),60%,40%)] block mb-1">Net Profit = Gross − Buy Fee − Sell Fee</code>
              <code className="text-[hsl(var(--calc-hue),60%,40%)] block">After-Tax = Net Profit × (1 − Tax Rate)</code>
            </div>
          </div>

          {/* Understanding Results */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Understanding Your Results</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Gross Profit", desc: "The raw gain before fees and taxes. Calculated as (Sell Price − Buy Price) × Shares.", color: "border-l-green-500" },
                { title: "Net Profit", desc: "Gross profit minus all commissions. This is what you actually made before taxes.", color: "border-l-cyan-500" },
                { title: "ROI", desc: "Return on Investment — net profit as a percentage of your total cost basis including buy commissions.", color: "border-l-blue-500" },
                { title: "After-Tax Profit", desc: "Your real take-home after capital gains tax is deducted. Short-term and long-term rates differ significantly.", color: "border-l-amber-500" },
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
                    <th className="px-3 py-2 text-left font-semibold">Trade</th>
                    <th className="px-3 py-2 text-left font-semibold">Shares</th>
                    <th className="px-3 py-2 text-left font-semibold">Gross Profit</th>
                    <th className="px-3 py-2 text-left font-semibold">ROI</th>
                    <th className="px-3 py-2 text-left font-semibold">After Tax (20%)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["$50 → $75", "100", "+$2,500", "+50%", "+$2,000"],
                    ["$100 → $90", "50", "−$500", "−5%", "−$500"],
                    ["$25 → $40", "200", "+$3,000", "+60%", "+$2,400"],
                    ["$200 → $180", "10", "−$200", "−10%", "−$200"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-border">
                      {row.map((cell, i) => (
                        <td key={i} className={`px-3 py-2 ${cell.startsWith("−") ? "text-red-500" : cell.startsWith("+") ? "text-green-600" : ""}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-muted-foreground mb-3">
              <strong>Commissions matter more than you think.</strong> On small trades, a $9.99 commission each way ($19.98 total) on a 10-share trade can eat 20–30% of your gains. Many modern brokers offer commission-free trading, but some still charge for options or certain order types.
            </p>
            <p className="text-muted-foreground mb-3">
              <strong>Short-term vs long-term capital gains</strong> is a critical distinction. Holding a stock for over one year typically qualifies for lower long-term rates (0%, 15%, or 20% in the US depending on income). Short-term gains are taxed as ordinary income, potentially at rates above 37%.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Losses can offset gains.</strong> If you have losing trades, they can reduce the taxable amount of your profitable trades — a strategy known as tax-loss harvesting. This calculator shows individual trade results, so factor in your portfolio context for full tax planning.
            </p>

            <blockquote className="border-l-4 border-[hsl(var(--calc-hue),70%,45%)] pl-4 italic text-muted-foreground bg-muted/30 rounded-r-xl py-3 pr-4">
              "It's not about what you make, it's about what you keep. Always calculate after-tax returns before comparing investment options."
            </blockquote>
          </div>

          {/* Why Use This Tool */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Why Use This Stock Profit Calculator?</h2>
            <p className="text-muted-foreground mb-3">
              Most stock apps show you paper gains based on current price — but they rarely show you what you'll actually walk away with after transaction costs and taxes. This calculator closes that gap.
            </p>
            <p className="text-muted-foreground mb-3">
              For active traders, tracking commissions is essential. Even zero-commission brokers may charge spreads or payment-for-order-flow fees that affect your effective buy and sell prices. Knowing your true cost basis matters for both performance tracking and tax reporting.
            </p>
            <p className="text-muted-foreground mb-3">
              Investors comparing stocks or assets can use this tool to normalize returns. A stock that returned 30% but was held for 6 months (short-term) may net less after tax than one that returned 20% over 18 months (long-term).
            </p>
            <p className="text-muted-foreground mb-3">
              For tax planning, knowing your expected tax bill before selling helps you decide whether to wait for long-term treatment, harvest losses, or spread gains across tax years.
            </p>
            <p className="text-xs text-muted-foreground border border-border rounded-xl p-4 mt-2">
              <Info className="inline w-3.5 h-3.5 mr-1 mb-0.5" />
              <strong>Disclaimer:</strong> This calculator is for educational purposes. Tax rates vary by jurisdiction, income level, and holding period. Consult a qualified tax advisor for personalized advice.
            </p>
          </div>

          {/* FAQ */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <FaqItem q="How is stock profit calculated?" a="Gross profit equals (Sell Price − Buy Price) × Number of Shares. Net profit subtracts any commissions paid. After-tax profit further deducts capital gains tax owed on the net gain." />
              <FaqItem q="What is capital gains tax on stocks?" a="Capital gains tax is levied on profits from selling investments. In the US, short-term gains (held under 1 year) are taxed as ordinary income. Long-term gains (held over 1 year) qualify for preferential rates of 0%, 15%, or 20% depending on income." />
              <FaqItem q="What if I sold at a loss?" a="A capital loss can offset other capital gains, reducing your overall tax bill. If losses exceed gains, you may deduct up to $3,000 against ordinary income per year in the US, with excess carried forward to future years." />
              <FaqItem q="Does ROI account for time?" a="ROI as calculated here is a simple return, not annualized. A 50% ROI over 5 years is far less impressive than the same return over 6 months. For time-adjusted comparisons, convert to CAGR (Compound Annual Growth Rate)." />
              <FaqItem q="How do stock splits affect my calculation?" a="After a stock split, your per-share buy price is adjusted proportionally (e.g., a 2:1 split halves your buy price but doubles your shares). Use the adjusted basis, not the original price." />
              <FaqItem q="Should I include dividends in profit?" a="This calculator focuses on capital gains. If you received dividends during the holding period, add them to your gross profit for a total return picture. Dividends are typically taxed separately from capital gains." />
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),70%,45%)] to-[hsl(var(--calc-hue),60%,35%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Explore More Investment Tools</h2>
            <p className="mb-5 opacity-90">Dive deeper into your investment returns with our full suite of financial calculators.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/finance/online-roi-calculator" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">
                ROI Calculator
              </Link>
              <Link href="/finance/dividend-calculator" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">
                Dividend Calculator
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
                  ["/finance/online-roi-calculator", "ROI Calculator"],
                  ["/finance/online-compound-interest-calculator", "Compound Interest"],
                  ["/finance/dividend-calculator", "Dividend Calculator"],
                  ["/finance/profit-margin-calculator", "Profit Margin"],
                  ["/finance/savings-calculator", "Savings Calculator"],
                ].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),70%,45%)] shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["Free to use, no login", "Includes fees & tax", "Works on all devices", "No data stored"].map((t) => (
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
