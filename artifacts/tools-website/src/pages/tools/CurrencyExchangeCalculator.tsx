import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  ArrowLeftRight,
  DollarSign,
  Globe,
  TrendingUp,
  CheckCircle2,
  Info,
  Calculator,
} from "lucide-react";
import { SEO } from "../../components/SEO";
import { Link } from "wouter";

// ─── helpers ────────────────────────────────────────────────────────────────
const fmtNum = (n: number, decimals = 4) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: decimals });

// ─── currency list ───────────────────────────────────────────────────────────
const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", flag: "🇩🇰" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "🇲🇽" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", flag: "🇵🇱" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", flag: "🇵🇰" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", flag: "🇪🇬" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
];

// Approximate static rates vs USD (updated reference rates, for educational use)
const RATES_TO_USD: Record<string, number> = {
  USD: 1, EUR: 1.085, GBP: 1.27, JPY: 0.0067, CAD: 0.74, AUD: 0.655,
  CHF: 1.115, CNY: 0.138, HKD: 0.128, SGD: 0.745, SEK: 0.096, NOK: 0.095,
  DKK: 0.146, NZD: 0.608, MXN: 0.058, BRL: 0.195, INR: 0.012, KRW: 0.00073,
  TRY: 0.031, ZAR: 0.055, AED: 0.272, SAR: 0.267, PLN: 0.248, THB: 0.028,
  IDR: 0.000063, MYR: 0.214, PHP: 0.017, PKR: 0.0036, EGP: 0.032, NGN: 0.00065,
};

function convert(amount: number, from: string, to: string): number {
  const fromRate = RATES_TO_USD[from] ?? 1;
  const toRate = RATES_TO_USD[to] ?? 1;
  return amount * (fromRate / toRate);
}

// ─── FAQ accordion ──────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-foreground hover:bg-muted/40 transition-colors">
        <span>{q}</span>
        {open ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <p className="px-5 pb-4 text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── main component ─────────────────────────────────────────────────────────
export default function CurrencyExchangeCalculator() {
  const [amount, setAmount] = useState("1000");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  const result = useMemo(() => {
    const a = parseFloat(amount) || 0;
    if (a <= 0) return null;
    const converted = convert(a, from, to);
    const rate = convert(1, from, to);
    const inverseRate = convert(1, to, from);
    const fromCur = CURRENCIES.find((c) => c.code === from)!;
    const toCur = CURRENCIES.find((c) => c.code === to)!;
    // Common cross amounts
    const commonAmounts = [100, 500, 1000, 5000, 10000];
    const crossRates = commonAmounts.map((n) => ({ amount: n, result: convert(n, from, to) }));
    return { converted, rate, inverseRate, fromCur, toCur, crossRates };
  }, [amount, from, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div style={{ "--calc-hue": "210" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Currency Exchange Calculator — Convert Any Currency Instantly"
        description="Convert between 30+ world currencies with our free currency exchange calculator. See live reference rates, cross-currency conversions, and travel money tips."
      />

      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/category/finance" className="hover:text-foreground transition-colors">Finance & Cost</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Currency Exchange Calculator</span>
      </nav>

      {/* Hero */}
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),70%,50%)] bg-[hsl(var(--calc-hue),80%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">
          Finance & Cost
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
          Currency Exchange Calculator
        </h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free", "30+ Currencies", "No Signup", "Instant Results"].map((b) => (
            <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>
          ))}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Convert between 30+ world currencies instantly. View exchange rates, cross-conversions, and quick reference tables for travel and international transactions.
        </p>
      </header>

      {/* Main grid */}
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[hsl(var(--calc-hue),70%,50%)]" />
              Currency Converter
            </h2>

            <div className="grid sm:grid-cols-5 gap-3 items-end mb-6">
              <div className="sm:col-span-2">
                <label className="tool-calc-label">Amount</label>
                <input className="tool-calc-input" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1000" />
              </div>
              <div className="sm:col-span-2">
                <label className="tool-calc-label">From</label>
                <select className="tool-calc-input" value={from} onChange={(e) => setFrom(e.target.value)}>
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <button
                  onClick={swap}
                  className="w-full h-[42px] rounded-xl border border-border flex items-center justify-center hover:bg-muted/40 transition-colors text-[hsl(var(--calc-hue),70%,50%)]"
                  title="Swap currencies"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="tool-calc-label">To</label>
              <select className="tool-calc-input" value={to} onChange={(e) => setTo(e.target.value)}>
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                ))}
              </select>
            </div>

            {result ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${amount}-${from}-${to}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Main result */}
                  <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),70%,50%)] to-[hsl(var(--calc-hue),60%,40%)] p-6 text-white">
                    <p className="text-sm opacity-80 mb-1">
                      {result.fromCur.flag} {fmtNum(parseFloat(amount) || 0, 2)} {from} =
                    </p>
                    <p className="text-4xl font-extrabold">
                      {result.toCur.symbol}{fmtNum(result.converted, 2)} <span className="text-2xl font-bold">{to}</span>
                    </p>
                    <p className="text-sm opacity-75 mt-2">
                      1 {from} = {fmtNum(result.rate)} {to} &nbsp;|&nbsp; 1 {to} = {fmtNum(result.inverseRate)} {from}
                    </p>
                  </div>

                  {/* Rate cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="tool-calc-result">
                      <div className="flex items-center gap-1.5 mb-1 text-blue-600"><TrendingUp className="w-4 h-4" /><span className="text-xs text-muted-foreground">Exchange Rate</span></div>
                      <div className="tool-calc-number text-lg">1 {from} = {fmtNum(result.rate)} {to}</div>
                    </div>
                    <div className="tool-calc-result">
                      <div className="flex items-center gap-1.5 mb-1 text-purple-600"><ArrowLeftRight className="w-4 h-4" /><span className="text-xs text-muted-foreground">Inverse Rate</span></div>
                      <div className="tool-calc-number text-lg">1 {to} = {fmtNum(result.inverseRate)} {from}</div>
                    </div>
                  </div>

                  {/* Cross amounts table */}
                  <div>
                    <p className="font-semibold mb-2 text-sm">Quick Reference: {from} → {to}</p>
                    <div className="overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-4 py-2 text-left font-semibold text-muted-foreground">{result.fromCur.flag} {from}</th>
                            <th className="px-4 py-2 text-left font-semibold text-muted-foreground">{result.toCur.flag} {to}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.crossRates.map((row) => (
                            <tr key={row.amount} className="border-t border-border hover:bg-muted/20 transition-colors">
                              <td className="px-4 py-2 font-medium">{result.fromCur.symbol}{fmtNum(row.amount, 2)}</td>
                              <td className="px-4 py-2 text-[hsl(var(--calc-hue),70%,50%)]">{result.toCur.symbol}{fmtNum(row.result, 2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    Rates shown are reference rates for educational purposes. Actual exchange rates from banks, credit cards, or currency exchanges will differ and typically include a spread or fee.
                  </p>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <DollarSign className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>Enter an amount and select currencies to convert.</p>
              </div>
            )}
          </div>

          {/* How to Use */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">How to Use This Calculator</h2>
            <ol className="space-y-3">
              {[
                ["Enter Amount", "Type the amount of money you want to convert."],
                ["Select Source Currency", "Choose the currency you're converting from."],
                ["Select Target Currency", "Choose the currency you want to convert to."],
                ["View Results", "The converted amount and exchange rate appear instantly."],
                ["Swap Currencies", "Use the ⇄ button to reverse the conversion direction."],
              ].map(([step, desc], i) => (
                <li key={step} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[hsl(var(--calc-hue),70%,50%)] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <div><span className="font-semibold">{step}: </span><span className="text-muted-foreground">{desc}</span></div>
                </li>
              ))}
            </ol>
            <div className="mt-5 bg-muted/40 rounded-xl p-4 font-mono text-sm">
              <p className="font-semibold mb-1 text-foreground">Exchange Rate Formula:</p>
              <code className="text-[hsl(var(--calc-hue),60%,45%)] block">Converted = Amount × (Rate_from / Rate_to)</code>
              <p className="mt-1 text-xs text-muted-foreground">Where rates are expressed vs. a common base currency (USD)</p>
            </div>
          </div>

          {/* Understanding Results */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Understanding Currency Exchange</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Exchange Rate", desc: "The price of one currency in terms of another. A EUR/USD rate of 1.085 means 1 euro buys $1.085.", color: "border-l-blue-500" },
                { title: "Bid/Ask Spread", desc: "Banks and exchanges charge slightly different rates to buy vs. sell. The gap (spread) is their profit. Credit cards typically add 1–3%.", color: "border-l-amber-500" },
                { title: "Mid-Market Rate", desc: "The midpoint between buy and sell rates — this is the 'true' rate. Services like Wise use mid-market rates plus a transparent fee.", color: "border-l-green-500" },
                { title: "Currency Volatility", desc: "Exchange rates fluctuate constantly based on economic data, central bank policy, and market sentiment. Rates here are static references.", color: "border-l-red-400" },
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
            <h2 className="text-xl font-bold mb-4">Quick Reference: Major Currency Pairs</h2>
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-3 py-2 text-left font-semibold">Pair</th>
                    <th className="px-3 py-2 text-left font-semibold">Rate (approx)</th>
                    <th className="px-3 py-2 text-left font-semibold">$1,000 USD =</th>
                    <th className="px-3 py-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["USD/EUR", "0.92", "€920", "World's most traded pair"],
                    ["USD/GBP", "0.79", "£790", "Sterling often called 'Cable'"],
                    ["USD/JPY", "149", "¥149,000", "Key carry trade currency"],
                    ["USD/CAD", "1.36", "C$1,360", "Correlated with oil prices"],
                    ["USD/AUD", "1.53", "A$1,530", "Commodity-linked currency"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-border">
                      {row.map((cell, i) => <td key={i} className="px-3 py-2">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-muted-foreground mb-3">
              <strong>Airport exchange kiosks offer the worst rates.</strong> They can markup by 10–15% over mid-market. For travel, using a credit card with no foreign transaction fees or a multi-currency account typically gives you rates much closer to the mid-market rate.
            </p>
            <p className="text-muted-foreground mb-3">
              <strong>Currency pairs are always quoted in terms of each other.</strong> EUR/USD of 1.085 means 1 euro = $1.085. If the rate rises to 1.10, the euro strengthened (or the dollar weakened). Understanding which currency is the "base" and which is the "quote" prevents calculation errors.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>For large international transfers</strong>, specialist services often offer significantly better rates than banks. For personal and business transfers, comparing rates across providers before transacting can save hundreds of dollars on large amounts.
            </p>

            <blockquote className="border-l-4 border-[hsl(var(--calc-hue),70%,50%)] pl-4 italic text-muted-foreground bg-muted/30 rounded-r-xl py-3 pr-4">
              "Currency exchange rates are the prices that connect economies. Understanding them is essential for any international financial decision."
            </blockquote>
          </div>

          {/* Why Use This Tool */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Why Use This Currency Calculator?</h2>
            <p className="text-muted-foreground mb-3">
              Whether you're planning international travel, sending money abroad, pricing products for foreign markets, or simply curious about exchange rates, this calculator gives you a fast, clean reference point for currency conversions.
            </p>
            <p className="text-muted-foreground mb-3">
              The quick-reference table for common amounts saves time when you need to check multiple values — useful when budgeting for a trip or comparing prices across currencies.
            </p>
            <p className="text-muted-foreground mb-3">
              The swap function makes it easy to see both directions of a rate: not just "how many euros does $1,000 buy?" but also "how many dollars does €920 buy?" — important for understanding cross-border pricing.
            </p>
            <p className="text-muted-foreground mb-3">
              Businesses doing international pricing, e-commerce stores deciding whether to display local currency prices, or freelancers invoicing overseas clients all benefit from a simple reference converter with no login required.
            </p>
            <p className="text-xs text-muted-foreground border border-border rounded-xl p-4 mt-2">
              <Info className="inline w-3.5 h-3.5 mr-1 mb-0.5" />
              <strong>Disclaimer:</strong> Rates are static reference rates for educational purposes only. Use a live rate service for financial transactions. Rates do not include bank fees, spreads, or transaction charges.
            </p>
          </div>

          {/* FAQ */}
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <FaqItem q="Are these exchange rates real-time?" a="No — the rates in this calculator are static reference rates for educational purposes. For live rates, use a financial data provider or check with your bank. Exchange rates fluctuate by the second in live markets." />
              <FaqItem q="Why is my bank rate different?" a="Banks and exchange services add a markup over the mid-market rate. This spread can range from 0.5% to 3% or more. Airport kiosks and some exchange bureaus can charge 5–15% above mid-market." />
              <FaqItem q="What is the strongest currency in the world?" a="By absolute exchange rate, the Kuwaiti Dinar (KWD) is often cited as the highest-valued single unit vs. USD. However, 'strength' in practice reflects economic stability, purchasing power parity, and market trust — not just the quoted rate." />
              <FaqItem q="What currencies are pegged to the USD?" a="Several currencies maintain fixed or managed pegs: the Saudi Riyal (SAR) at ~3.75, UAE Dirham (AED) at ~3.67, and Hong Kong Dollar (HKD) at ~7.78. These rates are intentionally stable and rarely change." />
              <FaqItem q="How do I get the best exchange rate for travel?" a="Options ranked best to worst: 1) Multi-currency debit accounts (Wise, Revolut) — near mid-market. 2) Credit cards with no foreign transaction fees. 3) ATM withdrawals abroad. 4) Bank branches. 5) Exchange bureaus. 6) Airport kiosks — worst." />
              <FaqItem q="What is currency hedging?" a="Hedging is protecting against exchange rate risk using financial instruments like forward contracts or options. Businesses with international revenues often hedge to lock in a known rate for future transactions, eliminating uncertainty." />
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),70%,50%)] to-[hsl(var(--calc-hue),60%,40%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Plan Your International Finances</h2>
            <p className="mb-5 opacity-90">Combine currency conversion with our other financial tools for complete trip and transfer planning.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/finance/discount-calculator" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Discount Calculator</Link>
              <Link href="/finance/tip-calculator" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Tip Calculator</Link>
            </div>
          </div>
        </section>

        {/* Sidebar */}
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
                  ["/finance/discount-calculator", "Discount Calculator"],
                  ["/finance/tip-calculator", "Tip Calculator"],
                  ["/finance/online-tax-calculator", "Tax Calculator"],
                  ["/finance/online-salary-calculator", "Salary Calculator"],
                  ["/finance/hourly-to-salary-calculator", "Hourly to Salary"],
                ].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),70%,50%)] shrink-0" />{label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["30+ currencies supported", "Free to use, no login", "Works on all devices", "No data stored"].map((t) => (
                  <div key={t} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />{t}</div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
