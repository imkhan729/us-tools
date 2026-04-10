import { useMemo, useState } from "react";
import { BadgePercent, ChartNoAxesCombined, Percent, PiggyBank, TrendingUp, Wallet } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

function fmt(n: number, digits = 2) {
  return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export default function CagrCalculator() {
  const [startingValue, setStartingValue] = useState("10000");
  const [endingValue, setEndingValue] = useState("18000");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    const start = Number(startingValue);
    const end = Number(endingValue);
    const period = Number(years);

    if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(period)) return null;
    if (start <= 0 || end <= 0 || period <= 0) return null;

    const cagr = (Math.pow(end / start, 1 / period) - 1) * 100;
    return { start, end, period, cagr };
  }, [endingValue, startingValue, years]);

  return (
    <UtilityToolPageShell
      title="CAGR Calculator"
      seoTitle="CAGR Calculator - Compound Annual Growth Rate"
      seoDescription="Free online CAGR calculator. Calculate compound annual growth rate from starting value, ending value, and time period."
      canonical="https://usonlinetools.com/finance/online-cagr-calculator"
      categoryName="Finance & Cost"
      categoryHref="/category/finance"
      heroDescription="Calculate compound annual growth rate (CAGR) to compare investments, business revenue growth, portfolio performance, and long-term return trends in one consistent annualized metric."
      heroIcon={<ChartNoAxesCombined className="w-3.5 h-3.5" />}
      calculatorLabel="Growth Rate Calculator"
      calculatorDescription="Enter start value, end value, and number of years to get annualized growth percentage."
      calculator={
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input className="tool-calc-input" type="number" value={startingValue} onChange={(e) => setStartingValue(e.target.value)} placeholder="Starting value" />
            <input className="tool-calc-input" type="number" value={endingValue} onChange={(e) => setEndingValue(e.target.value)} placeholder="Ending value" />
            <input className="tool-calc-input" type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="Years" />
          </div>

          {result ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="tool-calc-result">
                <p className="text-xs text-muted-foreground">CAGR</p>
                <p className="text-2xl font-black text-blue-600">{fmt(result.cagr)}%</p>
              </div>
              <div className="tool-calc-result">
                <p className="text-xs text-muted-foreground">Total Growth</p>
                <p className="text-2xl font-black text-blue-600">{fmt(((result.end - result.start) / result.start) * 100)}%</p>
              </div>
              <div className="tool-calc-result">
                <p className="text-xs text-muted-foreground">Value Multiple</p>
                <p className="text-2xl font-black text-blue-600">{fmt(result.end / result.start, 3)}x</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid positive values to calculate CAGR.</p>
          )}
        </div>
      }
      howSteps={[
        { title: "Enter start and end values", description: "Use beginning and ending value for an investment, revenue stream, or portfolio period." },
        { title: "Set total years", description: "Input the exact duration in years. Use decimals like 2.5 for partial years." },
        { title: "Read CAGR output", description: "The CAGR result shows annualized growth as if growth happened at a steady rate each year." },
      ]}
      interpretationCards={[
        { title: "CAGR normalizes volatility", description: "It smooths irregular year-to-year growth into one annual rate so options are easier to compare." },
        { title: "Higher CAGR usually signals better compounding", description: "Small CAGR differences can create large long-term value differences.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Use same period for fair comparison", description: "Comparing CAGR across different durations can mislead if periods are not aligned.", className: "bg-violet-500/5 border-violet-500/20" },
      ]}
      examples={[
        { scenario: "Investment growth", input: "10,000 -> 18,000 in 5 years", output: "12.47% CAGR" },
        { scenario: "Revenue growth", input: "2M -> 3.1M in 4 years", output: "11.59% CAGR" },
        { scenario: "Portfolio decline", input: "50,000 -> 40,000 in 3 years", output: "-7.16% CAGR" },
      ]}
      whyChoosePoints={[
        "This CAGR calculator provides a clean annualized growth metric that works for investments, startup revenue, ecommerce sales, and long-term financial planning.",
        "The page follows your richer content structure with calculator, interpretation, examples, and FAQs so users get both numbers and context.",
        "All calculations run directly in the browser, making it fast for scenario testing while staying private.",
      ]}
      faqs={[
        { q: "What is CAGR?", a: "CAGR is compound annual growth rate. It shows the constant yearly growth rate that would turn a starting value into an ending value over a set period." },
        { q: "How is CAGR different from average return?", a: "Average return is arithmetic and can overstate performance when volatility is high. CAGR reflects compounding and gives a truer long-term annualized rate." },
        { q: "Can CAGR be negative?", a: "Yes. If ending value is lower than starting value, CAGR will be negative." },
        { q: "When should I use CAGR?", a: "Use it when comparing investments or business growth over multi-year periods where compounding matters." },
      ]}
      relatedTools={[
        { title: "ROI Calculator", slug: "online-roi-calculator", icon: <Percent className="w-4 h-4" />, color: 150, benefit: "Quick one-period return checks" },
        { title: "Inflation Calculator", slug: "online-inflation-calculator", icon: <BadgePercent className="w-4 h-4" />, color: 210, benefit: "Adjust nominal growth for inflation" },
        { title: "Savings Calculator", slug: "savings-calculator", icon: <PiggyBank className="w-4 h-4" />, color: 265, benefit: "Project savings over time" },
        { title: "Profit Margin Calculator", slug: "profit-margin-calculator", icon: <TrendingUp className="w-4 h-4" />, color: 30, benefit: "Track business profitability" },
        { title: "Loan EMI Calculator", slug: "online-loan-emi-calculator", icon: <Wallet className="w-4 h-4" />, color: 330, benefit: "Plan financing costs" },
      ]}
      ctaTitle="Need More Finance Tools?"
      ctaDescription="Explore ROI, EMI, margin, and savings tools for complete financial planning."
      ctaHref="/category/finance"
    />
  );
}

