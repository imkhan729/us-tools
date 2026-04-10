import { useMemo, useState } from "react";
import { Building2, Calculator, CreditCard, HandCoins, PiggyBank, Wallet } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

function fmt(n: number, digits = 2) {
  return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export default function DebtToIncomeCalculator() {
  const [monthlyDebt, setMonthlyDebt] = useState("1200");
  const [grossMonthlyIncome, setGrossMonthlyIncome] = useState("4800");

  const result = useMemo(() => {
    const debt = Number(monthlyDebt);
    const income = Number(grossMonthlyIncome);
    if (!Number.isFinite(debt) || !Number.isFinite(income)) return null;
    if (debt < 0 || income <= 0) return null;
    const dti = (debt / income) * 100;
    return { debt, income, dti };
  }, [grossMonthlyIncome, monthlyDebt]);

  const riskBand =
    !result ? "n/a" : result.dti <= 20 ? "Excellent" : result.dti <= 36 ? "Good" : result.dti <= 43 ? "Caution" : "High Risk";

  return (
    <UtilityToolPageShell
      title="Debt-to-Income Calculator"
      seoTitle="Debt-to-Income Calculator - DTI Ratio"
      seoDescription="Free online debt-to-income calculator. Calculate DTI ratio from monthly debt payments and gross monthly income."
      canonical="https://usonlinetools.com/finance/online-debt-to-income-calculator"
      categoryName="Finance & Cost"
      categoryHref="/category/finance"
      heroDescription="Calculate your debt-to-income (DTI) ratio to understand borrowing capacity for mortgages, auto loans, credit approvals, and monthly cashflow health."
      heroIcon={<CreditCard className="w-3.5 h-3.5" />}
      calculatorLabel="DTI Ratio Calculator"
      calculatorDescription="Enter monthly debt obligations and gross monthly income to calculate your DTI percentage instantly."
      calculator={
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="tool-calc-input" type="number" value={monthlyDebt} onChange={(e) => setMonthlyDebt(e.target.value)} placeholder="Monthly debt payments" />
            <input className="tool-calc-input" type="number" value={grossMonthlyIncome} onChange={(e) => setGrossMonthlyIncome(e.target.value)} placeholder="Gross monthly income" />
          </div>
          {result ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="tool-calc-result">
                <p className="text-xs text-muted-foreground">DTI Ratio</p>
                <p className="text-2xl font-black text-blue-600">{fmt(result.dti)}%</p>
              </div>
              <div className="tool-calc-result">
                <p className="text-xs text-muted-foreground">Net After Debt</p>
                <p className="text-2xl font-black text-blue-600">${fmt(result.income - result.debt)}</p>
              </div>
              <div className="tool-calc-result">
                <p className="text-xs text-muted-foreground">Risk Band</p>
                <p className="text-2xl font-black text-blue-600">{riskBand}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid monthly values to calculate DTI.</p>
          )}
        </div>
      }
      howSteps={[
        { title: "Sum monthly debt payments", description: "Include minimum payments for credit cards, loans, mortgage/rent obligations required by lender criteria." },
        { title: "Enter gross monthly income", description: "Use income before taxes and deductions for standard DTI evaluation." },
        { title: "Review DTI percentage and band", description: "Lower DTI generally improves approval odds and access to better rates." },
      ]}
      interpretationCards={[
        { title: "Below 20% is usually strong", description: "A low DTI indicates comfortable debt servicing relative to income." },
        { title: "21% to 36% is commonly acceptable", description: "Many borrowers fall in this range for mainstream lending products.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Above 43% often reduces approval probability", description: "High DTI can trigger stricter conditions or denial depending on lender policy.", className: "bg-violet-500/5 border-violet-500/20" },
      ]}
      examples={[
        { scenario: "Balanced profile", input: "Debt 1,200 | Income 4,800", output: "25.00% DTI" },
        { scenario: "Low leverage", input: "Debt 900 | Income 6,000", output: "15.00% DTI" },
        { scenario: "High leverage", input: "Debt 2,500 | Income 5,200", output: "48.08% DTI" },
      ]}
      whyChoosePoints={[
        "This DTI calculator is practical for pre-approval checks before you apply for a mortgage, personal loan, or auto financing.",
        "It keeps the same deep, SEO-focused structure as your percentage calculator pages so visitors get both quick answer and educational context.",
        "Everything runs in-browser for fast private calculations during budgeting or lender preparation.",
      ]}
      faqs={[
        { q: "What is debt-to-income ratio?", a: "DTI is monthly debt payments divided by gross monthly income, expressed as a percentage." },
        { q: "What debts should I include?", a: "Include recurring mandatory debt payments such as credit cards, auto loans, personal loans, and housing obligations used in lender underwriting." },
        { q: "Is lower DTI better?", a: "Yes. Lower DTI usually indicates lower risk and can improve approval chances and rates." },
        { q: "Does DTI guarantee loan approval?", a: "No. Lenders also evaluate credit score, history, collateral, assets, and program rules." },
      ]}
      relatedTools={[
        { title: "Loan EMI Calculator", slug: "online-loan-emi-calculator", icon: <Calculator className="w-4 h-4" />, color: 150, benefit: "Estimate monthly payment amounts" },
        { title: "Mortgage Payment Calculator", slug: "online-mortgage-payment-calculator", icon: <Building2 className="w-4 h-4" />, color: 210, benefit: "Model home loan affordability" },
        { title: "Savings Calculator", slug: "savings-calculator", icon: <PiggyBank className="w-4 h-4" />, color: 265, benefit: "Plan reserve and emergency funds" },
        { title: "Budget Calculator", slug: "online-budget-calculator", icon: <Wallet className="w-4 h-4" />, color: 28, benefit: "Track monthly spending limits" },
        { title: "Tip Calculator", slug: "tip-calculator", icon: <HandCoins className="w-4 h-4" />, color: 330, benefit: "Quick expense split checks" },
      ]}
      ctaTitle="Need More Borrowing Tools?"
      ctaDescription="Use EMI, mortgage, and budget tools to improve repayment planning and loan readiness."
      ctaHref="/category/finance"
    />
  );
}

