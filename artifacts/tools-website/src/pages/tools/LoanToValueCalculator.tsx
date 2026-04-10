import { useMemo, useState } from "react";
import { Building, Calculator, Home, Landmark, Percent, Wallet } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

function fmt(n: number, digits = 2) {
  return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export default function LoanToValueCalculator() {
  const [loanAmount, setLoanAmount] = useState("320000");
  const [propertyValue, setPropertyValue] = useState("400000");

  const result = useMemo(() => {
    const loan = Number(loanAmount);
    const value = Number(propertyValue);
    if (!Number.isFinite(loan) || !Number.isFinite(value)) return null;
    if (loan <= 0 || value <= 0) return null;
    const ltv = (loan / value) * 100;
    return { loan, value, ltv, equity: value - loan };
  }, [loanAmount, propertyValue]);

  const status = !result ? "n/a" : result.ltv <= 80 ? "Strong" : result.ltv <= 90 ? "Moderate" : "High LTV";

  return (
    <UtilityToolPageShell
      title="Loan-to-Value Calculator"
      seoTitle="Loan-to-Value Calculator - LTV Ratio"
      seoDescription="Free online loan-to-value calculator. Calculate LTV ratio and equity from loan amount and property value."
      canonical="https://usonlinetools.com/finance/online-loan-to-value-calculator"
      categoryName="Finance & Cost"
      categoryHref="/category/finance"
      heroDescription="Calculate loan-to-value (LTV) ratio for mortgages and secured loans to assess lender risk, approval strength, PMI exposure, and equity position."
      heroIcon={<Landmark className="w-3.5 h-3.5" />}
      calculatorLabel="LTV Ratio Calculator"
      calculatorDescription="Enter loan amount and property value to calculate your LTV percentage and available equity."
      calculator={
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="tool-calc-input" type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="Loan amount" />
            <input className="tool-calc-input" type="number" value={propertyValue} onChange={(e) => setPropertyValue(e.target.value)} placeholder="Property value" />
          </div>
          {result ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="tool-calc-result">
                <p className="text-xs text-muted-foreground">LTV Ratio</p>
                <p className="text-2xl font-black text-blue-600">{fmt(result.ltv)}%</p>
              </div>
              <div className="tool-calc-result">
                <p className="text-xs text-muted-foreground">Equity</p>
                <p className="text-2xl font-black text-blue-600">${fmt(result.equity)}</p>
              </div>
              <div className="tool-calc-result">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-2xl font-black text-blue-600">{status}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid positive values to calculate LTV.</p>
          )}
        </div>
      }
      howSteps={[
        { title: "Enter current loan amount", description: "Use principal balance for refinance checks or proposed loan amount for new applications." },
        { title: "Enter property value", description: "Use purchase price or appraised market value based on your lending context." },
        { title: "Review LTV and equity", description: "Lower LTV generally improves rates and can reduce insurance requirements." },
      ]}
      interpretationCards={[
        { title: "80% LTV or below is often preferred", description: "Many lenders provide better terms and lower fees in this range." },
        { title: "High LTV can increase borrowing costs", description: "LTV above common thresholds may trigger extra conditions such as mortgage insurance.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Equity improves financial resilience", description: "Higher equity can help with refinancing options and lower repayment risk.", className: "bg-violet-500/5 border-violet-500/20" },
      ]}
      examples={[
        { scenario: "Standard mortgage", input: "Loan 320,000 | Value 400,000", output: "80.00% LTV" },
        { scenario: "Higher leverage", input: "Loan 360,000 | Value 400,000", output: "90.00% LTV" },
        { scenario: "Conservative leverage", input: "Loan 250,000 | Value 400,000", output: "62.50% LTV" },
      ]}
      whyChoosePoints={[
        "This LTV calculator gives quick underwriting context before purchase or refinance decisions.",
        "It follows the same content depth as your top-performing calculator pages, not a thin one-line tool.",
        "All math runs locally in the browser for fast planning and private use.",
      ]}
      faqs={[
        { q: "What is LTV ratio?", a: "LTV is loan amount divided by property value, expressed as a percentage." },
        { q: "Why does LTV matter?", a: "Lenders use LTV to assess risk. Lower LTV can improve rates and approval flexibility." },
        { q: "What is a good LTV?", a: "Many programs prefer 80% or lower, but acceptable limits vary by lender and loan type." },
        { q: "Can property value changes affect LTV?", a: "Yes. If property value falls, LTV rises even when loan balance stays unchanged." },
      ]}
      relatedTools={[
        { title: "Mortgage Payment Calculator", slug: "online-mortgage-payment-calculator", icon: <Home className="w-4 h-4" />, color: 150, benefit: "Estimate monthly mortgage costs" },
        { title: "Loan EMI Calculator", slug: "online-loan-emi-calculator", icon: <Calculator className="w-4 h-4" />, color: 210, benefit: "Plan repayment amounts" },
        { title: "Debt-to-Income Calculator", slug: "online-debt-to-income-calculator", icon: <Percent className="w-4 h-4" />, color: 265, benefit: "Check affordability profile" },
        { title: "Down Payment Calculator", slug: "down-payment-calculator", icon: <Wallet className="w-4 h-4" />, color: 28, benefit: "Estimate upfront cash needed" },
        { title: "Budget Calculator", slug: "online-budget-calculator", icon: <Building className="w-4 h-4" />, color: 330, benefit: "Estimate monthly housing budget" },
      ]}
      ctaTitle="Need More Mortgage Tools?"
      ctaDescription="Use mortgage, EMI, and DTI tools together to evaluate borrowing scenarios clearly."
      ctaHref="/category/finance"
    />
  );
}

