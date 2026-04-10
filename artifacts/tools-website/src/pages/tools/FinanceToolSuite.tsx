import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { SeoRichContent } from "@/components/SeoRichContent";
import { Link, useLocation, useParams } from "wouter";
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
  Percent,
  DollarSign,
  BarChart3,
} from "lucide-react";
import NotFound from "../not-found";
import { getCanonicalToolPath, getToolBySlug } from "@/data/tools";

type NumberInput = {
  type: "number";
  key: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
};

type SelectInput = {
  type: "select";
  key: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  defaultValue: string;
};

type InputField = NumberInput | SelectInput;

type OutputField = {
  key: string;
  label: string;
  format: "currency" | "percent" | "number";
  accent?: "green" | "emerald" | "blue" | "purple";
};

type CalcResult =
  | { values: Record<string, number>; insight: string }
  | { error: string }
  | null;

type FinanceToolConfig = {
  title: string;
  description: string;
  metaDescription: string;
  primaryKeyword: string;
  intro: string;
  inputs: InputField[];
  outputs: OutputField[];
  calculate: (numbers: Record<string, number>, raw: Record<string, string>) => CalcResult;
  formulas: Array<{ expression: string; explanation: string }>;
  useCases: Array<{ title: string; description: string }>;
  tips: string[];
  quickExamples: string[];
};

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-green-500/40 transition-colors">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-green-500">
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
  { title: "Markup Calculator", slug: "markup-calculator", icon: <Percent className="w-5 h-5" />, color: 145, benefit: "Price from cost and markup" },
  { title: "Break Even Calculator", slug: "break-even-calculator", icon: <BarChart3 className="w-5 h-5" />, color: 205, benefit: "Units to recover fixed costs" },
  { title: "ROI Calculator", slug: "roi-calculator", icon: <Percent className="w-5 h-5" />, color: 265, benefit: "Return on investment %" },
  { title: "Loan EMI Calculator", slug: "loan-emi-calculator", icon: <DollarSign className="w-5 h-5" />, color: 25, benefit: "Monthly loan payment estimate" },
];

const DEFAULT_TIPS = [
  "Use consistent units and time periods in all input fields.",
  "Round values only after calculation to keep better precision.",
  "Verify assumptions for rates, costs, and quantity before relying on output.",
  "Run multiple scenarios to compare best-case and worst-case outcomes.",
];

const FINANCE_TOOLS: Record<string, FinanceToolConfig> = {
  "break-even-calculator": {
    title: "Break Even Calculator",
    description: "Find break-even units and revenue from fixed costs, variable costs, and selling price.",
    metaDescription: "Free break-even calculator. Calculate break-even point in units and revenue for your business model.",
    primaryKeyword: "break even calculator",
    intro: "This break even calculator estimates how many units must be sold before profit starts.",
    inputs: [
      { type: "number", key: "fixedCost", label: "Fixed Costs", placeholder: "15000" },
      { type: "number", key: "variableCost", label: "Variable Cost / Unit", placeholder: "12" },
      { type: "number", key: "sellingPrice", label: "Selling Price / Unit", placeholder: "25" },
    ],
    outputs: [
      { key: "breakEvenUnits", label: "Break-Even Units", format: "number", accent: "green" },
      { key: "breakEvenRevenue", label: "Break-Even Revenue", format: "currency", accent: "emerald" },
      { key: "contributionMargin", label: "Contribution Margin / Unit", format: "currency", accent: "blue" },
      { key: "contributionMarginRate", label: "Contribution Margin %", format: "percent", accent: "purple" },
    ],
    calculate: (n) => {
      const { fixedCost, variableCost, sellingPrice } = n;
      if (sellingPrice <= variableCost) return { error: "Selling price must be greater than variable cost per unit." };
      const contributionMargin = sellingPrice - variableCost;
      const breakEvenUnits = fixedCost / contributionMargin;
      const breakEvenRevenue = breakEvenUnits * sellingPrice;
      const contributionMarginRate = (contributionMargin / sellingPrice) * 100;
      return {
        values: { breakEvenUnits, breakEvenRevenue, contributionMargin, contributionMarginRate },
        insight: `You need approximately ${breakEvenUnits.toFixed(2)} units to break even.`,
      };
    },
    formulas: [
      { expression: "Contribution Margin = Selling Price - Variable Cost", explanation: "Per-unit amount available to cover fixed costs." },
      { expression: "Break-Even Units = Fixed Costs / Contribution Margin", explanation: "Units required before net profit turns positive." },
      { expression: "Break-Even Revenue = Break-Even Units x Selling Price", explanation: "Revenue threshold for zero profit and zero loss." },
    ],
    useCases: [
      { title: "Product pricing", description: "Set realistic sales targets for new products." },
      { title: "Service packages", description: "Validate price levels before launching new plans." },
      { title: "Cost planning", description: "Estimate impact of variable cost changes." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: [
      "Fixed 20,000, variable 15, selling 35 -> break-even units 1,000",
      "Fixed 8,000, variable 5, selling 12 -> break-even units 1,142.86",
      "Fixed 50,000, variable 45, selling 70 -> break-even revenue 140,000",
    ],
  },
  "gst-calculator": {
    title: "GST Calculator",
    description: "Add or remove GST from any amount using a custom tax rate.",
    metaDescription: "Free GST calculator. Add GST to net price or remove GST from gross amount instantly.",
    primaryKeyword: "gst calculator",
    intro: "Use this GST calculator to add tax to a base amount or extract GST from tax-inclusive pricing.",
    inputs: [
      { type: "number", key: "amount", label: "Amount", placeholder: "1000" },
      { type: "number", key: "rate", label: "GST Rate (%)", placeholder: "5" },
      { type: "select", key: "mode", label: "Mode", defaultValue: "add", options: [{ value: "add", label: "Add GST" }, { value: "remove", label: "Remove GST" }] },
    ],
    outputs: [
      { key: "netAmount", label: "Net Amount", format: "currency", accent: "green" },
      { key: "gstAmount", label: "GST Amount", format: "currency", accent: "emerald" },
      { key: "grossAmount", label: "Gross Amount", format: "currency", accent: "blue" },
      { key: "effectiveRate", label: "Effective GST %", format: "percent", accent: "purple" },
    ],
    calculate: (n, raw) => {
      const { amount, rate } = n;
      if (rate < 0) return { error: "GST rate cannot be negative." };
      if (raw.mode === "remove") {
        const grossAmount = amount;
        const netAmount = grossAmount / (1 + rate / 100);
        const gstAmount = grossAmount - netAmount;
        const effectiveRate = netAmount === 0 ? 0 : (gstAmount / netAmount) * 100;
        return { values: { netAmount, gstAmount, grossAmount, effectiveRate }, insight: `GST extracted from gross amount is ${gstAmount.toFixed(2)}.` };
      }
      const netAmount = amount;
      const gstAmount = netAmount * (rate / 100);
      const grossAmount = netAmount + gstAmount;
      return { values: { netAmount, gstAmount, grossAmount, effectiveRate: rate }, insight: `Final amount after GST is ${grossAmount.toFixed(2)}.` };
    },
    formulas: [
      { expression: "GST = Net x (Rate/100)", explanation: "Tax amount added to base price." },
      { expression: "Gross = Net + GST", explanation: "Tax-inclusive final amount." },
      { expression: "Net = Gross / (1 + Rate/100)", explanation: "Back-calculate pre-tax value." },
    ],
    useCases: [
      { title: "Invoice creation", description: "Add GST and show proper tax breakup." },
      { title: "Retail checks", description: "Verify if posted prices include tax." },
      { title: "Accounting reconciliation", description: "Split gross receipts into tax and net." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: [
      "Net 200 at 5% GST -> GST 10, gross 210",
      "Gross 118 at 18% GST removal -> net 100, GST 18",
      "Net 2,500 at 12% GST -> gross 2,800",
    ],
  },
  "commission-calculator": {
    title: "Commission Calculator",
    description: "Calculate sales commission, total payout, and effective compensation rate.",
    metaDescription: "Free commission calculator. Calculate commission amount and total payout from sales and commission rate.",
    primaryKeyword: "commission calculator",
    intro: "This commission calculator helps estimate payout for sales-driven compensation plans.",
    inputs: [
      { type: "number", key: "sales", label: "Sales Amount", placeholder: "50000" },
      { type: "number", key: "rate", label: "Commission Rate (%)", placeholder: "7.5" },
      { type: "number", key: "basePay", label: "Base Pay (Optional)", placeholder: "1500", defaultValue: "0" },
    ],
    outputs: [
      { key: "commissionAmount", label: "Commission Amount", format: "currency", accent: "green" },
      { key: "totalPay", label: "Total Payout", format: "currency", accent: "emerald" },
      { key: "effectiveCompRate", label: "Effective Comp %", format: "percent", accent: "blue" },
      { key: "salesPer1000", label: "Commission per $1,000 Sales", format: "currency", accent: "purple" },
    ],
    calculate: (n) => {
      const { sales, rate, basePay } = n;
      if (sales < 0 || rate < 0 || basePay < 0) return { error: "Enter non-negative numbers for sales, rate, and base pay." };
      const commissionAmount = sales * (rate / 100);
      const totalPay = commissionAmount + basePay;
      const effectiveCompRate = sales === 0 ? 0 : (totalPay / sales) * 100;
      const salesPer1000 = 1000 * (rate / 100);
      return { values: { commissionAmount, totalPay, effectiveCompRate, salesPer1000 }, insight: `At ${rate}% commission, every $1,000 in sales earns $${salesPer1000.toFixed(2)}.` };
    },
    formulas: [
      { expression: "Commission = Sales x (Rate/100)", explanation: "Performance pay based on total sales volume." },
      { expression: "Total Pay = Base + Commission", explanation: "Combined fixed and variable payout." },
      { expression: "Effective Rate = Total Pay / Sales x 100", explanation: "Compensation share against generated revenue." },
    ],
    useCases: [
      { title: "Sales payroll", description: "Estimate monthly or quarterly commission payout." },
      { title: "Plan design", description: "Test how different commission rates impact cost." },
      { title: "Freelance contracts", description: "Project revenue share outcomes quickly." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: [
      "Sales 40,000 at 8% -> commission 3,200",
      "Sales 75,000 at 5% + base 2,000 -> total pay 5,750",
      "Sales 10,000 at 12% -> commission per $1,000 sales = 120",
    ],
  },
  "investment-growth-calculator": {
    title: "Investment Growth Calculator",
    description: "Project future value with annual contributions, expected return, and time horizon.",
    metaDescription: "Free investment growth calculator. Forecast portfolio value with contributions and annual return assumptions.",
    primaryKeyword: "investment growth calculator",
    intro: "This investment growth calculator projects portfolio value by combining compounding and recurring contributions.",
    inputs: [
      { type: "number", key: "initial", label: "Initial Investment", placeholder: "10000" },
      { type: "number", key: "annualContribution", label: "Annual Contribution", placeholder: "6000" },
      { type: "number", key: "annualRate", label: "Expected Annual Return (%)", placeholder: "8" },
      { type: "number", key: "years", label: "Years", placeholder: "20" },
    ],
    outputs: [
      { key: "futureValue", label: "Projected Future Value", format: "currency", accent: "green" },
      { key: "totalContributions", label: "Total Contributions", format: "currency", accent: "emerald" },
      { key: "investmentGain", label: "Estimated Growth", format: "currency", accent: "blue" },
      { key: "growthShare", label: "Growth Share %", format: "percent", accent: "purple" },
    ],
    calculate: (n) => {
      const { initial, annualContribution, annualRate, years } = n;
      if (years <= 0) return { error: "Years must be greater than zero." };
      const r = annualRate / 100;
      const futureValue =
        r === 0
          ? initial + annualContribution * years
          : initial * Math.pow(1 + r, years) + annualContribution * ((Math.pow(1 + r, years) - 1) / r);
      const totalContributions = initial + annualContribution * years;
      const investmentGain = futureValue - totalContributions;
      const growthShare = futureValue === 0 ? 0 : (investmentGain / futureValue) * 100;
      return { values: { futureValue, totalContributions, investmentGain, growthShare }, insight: `Compounding adds approximately ${investmentGain.toFixed(2)} over ${years} years.` };
    },
    formulas: [
      { expression: "FV = P(1+r)^n + C[((1+r)^n - 1)/r]", explanation: "Future value with recurring annual contributions." },
      { expression: "Contributions = Initial + (Annual Contribution x Years)", explanation: "Total capital you directly invest." },
      { expression: "Growth = Future Value - Contributions", explanation: "Amount created by investment returns." },
    ],
    useCases: [
      { title: "Retirement planning", description: "Estimate long-term outcomes with consistent investing." },
      { title: "Goal funding", description: "Check if annual contributions can reach target value." },
      { title: "Rate sensitivity", description: "Compare projections at different return assumptions." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: [
      "Initial 20,000 + 5,000/year at 7% for 15 years -> strong compounding",
      "Initial 5,000 + 2,400/year at 6% for 25 years -> long-term growth",
      "Initial 100,000, no contribution at 4% for 10 years -> passive growth baseline",
    ],
  },
  "budget-calculator": {
    title: "Budget Calculator",
    description: "Track monthly income, expenses, and leftover cash flow for budget control.",
    metaDescription: "Free budget calculator. Plan monthly spending, savings, and leftover cash from income and expenses.",
    primaryKeyword: "budget calculator",
    intro: "This monthly budget calculator gives a clear income-versus-expense snapshot for better decisions.",
    inputs: [
      { type: "number", key: "income", label: "Monthly Income", placeholder: "5000" },
      { type: "number", key: "housing", label: "Housing", placeholder: "1500" },
      { type: "number", key: "utilities", label: "Utilities", placeholder: "250" },
      { type: "number", key: "transport", label: "Transport", placeholder: "350" },
      { type: "number", key: "food", label: "Food", placeholder: "700" },
      { type: "number", key: "other", label: "Other Expenses", placeholder: "400" },
    ],
    outputs: [
      { key: "totalExpenses", label: "Total Monthly Expenses", format: "currency", accent: "green" },
      { key: "remaining", label: "Remaining Cash Flow", format: "currency", accent: "emerald" },
      { key: "savingsRate", label: "Savings Rate", format: "percent", accent: "blue" },
      { key: "dailySpendAvg", label: "Daily Spending Average", format: "currency", accent: "purple" },
    ],
    calculate: (n) => {
      const { income, housing, utilities, transport, food, other } = n;
      const totalExpenses = housing + utilities + transport + food + other;
      const remaining = income - totalExpenses;
      const savingsRate = income === 0 ? 0 : (remaining / income) * 100;
      const dailySpendAvg = totalExpenses / 30;
      return { values: { totalExpenses, remaining, savingsRate, dailySpendAvg }, insight: `Current budget leaves ${remaining.toFixed(2)} after planned monthly expenses.` };
    },
    formulas: [
      { expression: "Total Expenses = Housing + Utilities + Transport + Food + Other", explanation: "Sum of key recurring monthly categories." },
      { expression: "Remaining = Income - Total Expenses", explanation: "Available amount for savings or debt repayment." },
      { expression: "Savings Rate = Remaining / Income x 100", explanation: "Share of income not consumed by expenses." },
    ],
    useCases: [
      { title: "Personal budgeting", description: "Track monthly cash flow and control overspending." },
      { title: "Debt planning", description: "Estimate available surplus for faster debt payoff." },
      { title: "Household review", description: "Compare budget structure month-over-month." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: [
      "Income 4,000 and expenses 3,200 -> remaining 800, savings rate 20%",
      "Income 6,500 and expenses 6,200 -> thin margin to improve",
      "Reducing transport by 100/month adds 1,200 to annual surplus",
    ],
  },
  "expense-calculator": {
    title: "Expense Calculator",
    description: "Calculate total expenses, annual spend, and expense-to-income ratio.",
    metaDescription: "Free expense calculator. Track category-wise expenses and estimate annual spending levels.",
    primaryKeyword: "expense calculator",
    intro: "This expense calculator consolidates recurring costs and shows their impact on monthly income.",
    inputs: [
      { type: "number", key: "income", label: "Monthly Income", placeholder: "4500" },
      { type: "number", key: "housing", label: "Housing", placeholder: "1400" },
      { type: "number", key: "food", label: "Food", placeholder: "650" },
      { type: "number", key: "transport", label: "Transport", placeholder: "300" },
      { type: "number", key: "bills", label: "Bills & Subscriptions", placeholder: "250" },
      { type: "number", key: "misc", label: "Miscellaneous", placeholder: "450" },
    ],
    outputs: [
      { key: "monthlyExpense", label: "Total Monthly Expense", format: "currency", accent: "green" },
      { key: "annualExpense", label: "Estimated Annual Expense", format: "currency", accent: "emerald" },
      { key: "expenseRatio", label: "Expense-to-Income %", format: "percent", accent: "blue" },
      { key: "monthlyBuffer", label: "Monthly Buffer", format: "currency", accent: "purple" },
    ],
    calculate: (n) => {
      const { income, housing, food, transport, bills, misc } = n;
      const monthlyExpense = housing + food + transport + bills + misc;
      const annualExpense = monthlyExpense * 12;
      const expenseRatio = income === 0 ? 0 : (monthlyExpense / income) * 100;
      const monthlyBuffer = income - monthlyExpense;
      return { values: { monthlyExpense, annualExpense, expenseRatio, monthlyBuffer }, insight: `Expenses currently use ${expenseRatio.toFixed(2)}% of monthly income.` };
    },
    formulas: [
      { expression: "Monthly Expense = Sum of all categories", explanation: "Total recurring monthly spending figure." },
      { expression: "Annual Expense = Monthly Expense x 12", explanation: "Estimated yearly spending based on current level." },
      { expression: "Expense Ratio = Monthly Expense / Income x 100", explanation: "How much of income is consumed by expenses." },
    ],
    useCases: [
      { title: "Expense tracking", description: "Monitor spending trends over time." },
      { title: "Cost reduction", description: "Find categories with highest optimization potential." },
      { title: "Emergency planning", description: "Estimate true annual cash outflow." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: [
      "Monthly expense 3,000 means annual expense 36,000",
      "Income 5,000 and expense 3,750 -> expense ratio 75%",
      "Reducing miscellaneous by 200 saves 2,400 annually",
    ],
  },
  "cost-per-unit-calculator": {
    title: "Cost Per Unit Calculator",
    description: "Calculate unit cost from total production cost and quantity.",
    metaDescription: "Free cost per unit calculator. Find per-unit production cost instantly.",
    primaryKeyword: "cost per unit calculator",
    intro: "Use this cost per unit calculator to set pricing floors and assess production efficiency.",
    inputs: [
      { type: "number", key: "totalCost", label: "Total Cost", placeholder: "12000" },
      { type: "number", key: "units", label: "Total Units", placeholder: "800" },
    ],
    outputs: [
      { key: "costPerUnit", label: "Cost Per Unit", format: "currency", accent: "green" },
      { key: "costPer100Units", label: "Cost per 100 Units", format: "currency", accent: "emerald" },
      { key: "unitsPer1000", label: "Units per $1,000", format: "number", accent: "blue" },
      { key: "totalCost", label: "Total Cost", format: "currency", accent: "purple" },
    ],
    calculate: (n) => {
      const { totalCost, units } = n;
      if (units <= 0) return { error: "Units must be greater than zero." };
      const costPerUnit = totalCost / units;
      const costPer100Units = costPerUnit * 100;
      const unitsPer1000 = costPerUnit === 0 ? 0 : 1000 / costPerUnit;
      return { values: { costPerUnit, costPer100Units, unitsPer1000, totalCost }, insight: `Each unit currently costs ${costPerUnit.toFixed(4)}.` };
    },
    formulas: [
      { expression: "Cost Per Unit = Total Cost / Total Units", explanation: "Standard measure used in pricing and margin analysis." },
      { expression: "Cost per 100 Units = Cost Per Unit x 100", explanation: "Scaled view for batch production planning." },
      { expression: "Units per $1,000 = 1000 / Cost Per Unit", explanation: "Output efficiency from fixed spend amount." },
    ],
    useCases: [
      { title: "Manufacturing", description: "Set minimum selling price above cost base." },
      { title: "Batch planning", description: "Estimate cost changes across output levels." },
      { title: "Supplier comparison", description: "Compare unit economics under different cost structures." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: [
      "Total 10,000 cost over 500 units -> 20 per unit",
      "Total 2,400 over 300 units -> 8 per unit",
      "If cost per unit is 5, then 100 units cost 500",
    ],
  },
  "price-per-unit-calculator": {
    title: "Price Per Unit Calculator",
    description: "Compare item value by calculating price per unit from total price and quantity.",
    metaDescription: "Free price per unit calculator. Compare products by computing unit price instantly.",
    primaryKeyword: "price per unit calculator",
    intro: "This price per unit calculator helps compare package deals fairly across different sizes.",
    inputs: [
      { type: "number", key: "totalPrice", label: "Total Price", placeholder: "18.99" },
      { type: "number", key: "quantity", label: "Quantity", placeholder: "12" },
    ],
    outputs: [
      { key: "pricePerUnit", label: "Price Per Unit", format: "currency", accent: "green" },
      { key: "pricePer10", label: "Price per 10 Units", format: "currency", accent: "emerald" },
      { key: "unitsPer10Dollars", label: "Units per $10", format: "number", accent: "blue" },
      { key: "totalPrice", label: "Total Price", format: "currency", accent: "purple" },
    ],
    calculate: (n) => {
      const { totalPrice, quantity } = n;
      if (quantity <= 0) return { error: "Quantity must be greater than zero." };
      const pricePerUnit = totalPrice / quantity;
      const pricePer10 = pricePerUnit * 10;
      const unitsPer10Dollars = pricePerUnit === 0 ? 0 : 10 / pricePerUnit;
      return { values: { pricePerUnit, pricePer10, unitsPer10Dollars, totalPrice }, insight: `Normalized price per unit is ${pricePerUnit.toFixed(4)}.` };
    },
    formulas: [
      { expression: "Price Per Unit = Total Price / Quantity", explanation: "Standardized cost for apples-to-apples comparison." },
      { expression: "Price per 10 Units = Price Per Unit x 10", explanation: "Quick scaled estimate for larger quantities." },
      { expression: "Units per $10 = 10 / Price Per Unit", explanation: "Buying power at a fixed budget amount." },
    ],
    useCases: [
      { title: "Grocery shopping", description: "Find the best deal across different pack sizes." },
      { title: "Wholesale buying", description: "Compare supplier offers at unit level." },
      { title: "Procurement", description: "Normalize pricing for fair bidding analysis." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: [
      "Pack price 24 for 8 units -> 3 per unit",
      "Pack price 14.5 for 20 units -> 0.725 per unit",
      "If unit price is 2.5, then 10 units cost 25",
    ],
  },
  "net-worth-calculator": {
    title: "Net Worth Calculator",
    description: "Calculate net worth by comparing total assets and total liabilities.",
    metaDescription: "Free net worth calculator. Track assets minus liabilities and monitor your personal financial position.",
    primaryKeyword: "net worth calculator",
    intro: "This net worth calculator gives a clear personal balance-sheet view by subtracting liabilities from assets.",
    inputs: [
      { type: "number", key: "cash", label: "Cash & Savings", placeholder: "12000" },
      { type: "number", key: "investments", label: "Investments", placeholder: "45000" },
      { type: "number", key: "property", label: "Property Value", placeholder: "250000" },
      { type: "number", key: "otherAssets", label: "Other Assets", placeholder: "8000", defaultValue: "0" },
      { type: "number", key: "mortgage", label: "Mortgage Balance", placeholder: "180000", defaultValue: "0" },
      { type: "number", key: "loans", label: "Other Loans", placeholder: "12000", defaultValue: "0" },
      { type: "number", key: "creditCard", label: "Credit Card Debt", placeholder: "2500", defaultValue: "0" },
      { type: "number", key: "otherLiabilities", label: "Other Liabilities", placeholder: "1500", defaultValue: "0" },
    ],
    outputs: [
      { key: "totalAssets", label: "Total Assets", format: "currency", accent: "green" },
      { key: "totalLiabilities", label: "Total Liabilities", format: "currency", accent: "emerald" },
      { key: "netWorth", label: "Net Worth", format: "currency", accent: "blue" },
      { key: "debtToAssetRatio", label: "Debt-to-Asset %", format: "percent", accent: "purple" },
    ],
    calculate: (n) => {
      const totalAssets = n.cash + n.investments + n.property + n.otherAssets;
      const totalLiabilities = n.mortgage + n.loans + n.creditCard + n.otherLiabilities;
      const netWorth = totalAssets - totalLiabilities;
      const debtToAssetRatio = totalAssets === 0 ? 0 : (totalLiabilities / totalAssets) * 100;
      return {
        values: { totalAssets, totalLiabilities, netWorth, debtToAssetRatio },
        insight: `Your current net worth is ${netWorth.toFixed(2)} based on the assets and liabilities entered.`,
      };
    },
    formulas: [
      { expression: "Total Assets = Cash + Investments + Property + Other Assets", explanation: "Sum of everything you own that has financial value." },
      { expression: "Total Liabilities = Mortgage + Loans + Credit Cards + Other Liabilities", explanation: "Sum of all outstanding debt obligations." },
      { expression: "Net Worth = Total Assets - Total Liabilities", explanation: "Core balance-sheet indicator of personal financial position." },
    ],
    useCases: [
      { title: "Personal finance tracking", description: "Measure financial progress month by month with one simple snapshot." },
      { title: "Debt reduction planning", description: "See how reducing liabilities impacts your overall net worth trajectory." },
      { title: "Retirement readiness checks", description: "Evaluate whether current asset accumulation matches long-term goals." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: [
      "Assets 300,000 and liabilities 190,000 -> net worth 110,000",
      "Assets 75,000 and liabilities 12,500 -> debt-to-asset ratio 16.67%",
      "Paying down 10,000 debt increases net worth by the same amount",
    ],
  },
  "depreciation-calculator": {
    title: "Depreciation Calculator",
    description: "Calculate straight-line depreciation and yearly book value for an asset.",
    metaDescription: "Free depreciation calculator. Compute annual depreciation, accumulated depreciation, and ending book value.",
    primaryKeyword: "depreciation calculator",
    intro: "This depreciation calculator helps estimate annual asset value reduction using a straight-line approach.",
    inputs: [
      { type: "number", key: "assetCost", label: "Asset Cost", placeholder: "50000" },
      { type: "number", key: "salvageValue", label: "Salvage Value", placeholder: "5000", defaultValue: "0" },
      { type: "number", key: "usefulLife", label: "Useful Life (Years)", placeholder: "5" },
      { type: "number", key: "yearNumber", label: "Year to Evaluate", placeholder: "3", defaultValue: "1" },
    ],
    outputs: [
      { key: "annualDepreciation", label: "Annual Depreciation", format: "currency", accent: "green" },
      { key: "accumulatedDepreciation", label: "Accumulated Depreciation", format: "currency", accent: "emerald" },
      { key: "bookValue", label: "Book Value (Year End)", format: "currency", accent: "blue" },
      { key: "depreciationRate", label: "Depreciation Rate %", format: "percent", accent: "purple" },
    ],
    calculate: (n) => {
      const { assetCost, salvageValue, usefulLife, yearNumber } = n;
      if (assetCost <= 0) return { error: "Asset cost must be greater than zero." };
      if (usefulLife <= 0) return { error: "Useful life must be greater than zero." };
      if (salvageValue < 0) return { error: "Salvage value cannot be negative." };
      if (salvageValue >= assetCost) return { error: "Salvage value must be lower than asset cost." };
      const year = Math.max(1, Math.min(usefulLife, Math.floor(yearNumber)));
      const annualDepreciation = (assetCost - salvageValue) / usefulLife;
      const accumulatedDepreciation = annualDepreciation * year;
      const bookValue = Math.max(salvageValue, assetCost - accumulatedDepreciation);
      const depreciationRate = (annualDepreciation / assetCost) * 100;
      return {
        values: { annualDepreciation, accumulatedDepreciation, bookValue, depreciationRate },
        insight: `By year ${year}, estimated book value is ${bookValue.toFixed(2)} using straight-line depreciation.`,
      };
    },
    formulas: [
      { expression: "Annual Depreciation = (Cost - Salvage Value) / Useful Life", explanation: "Evenly spreads depreciable amount across asset life." },
      { expression: "Accumulated Depreciation = Annual Depreciation x Year", explanation: "Total depreciation recognized up to selected year." },
      { expression: "Book Value = Cost - Accumulated Depreciation", explanation: "Remaining carrying value after depreciation." },
    ],
    useCases: [
      { title: "Business accounting", description: "Estimate annual depreciation expense for planning and reporting." },
      { title: "Asset replacement timing", description: "Track value decline when deciding upgrade cycles." },
      { title: "Budget forecasting", description: "Model depreciation impact on financial statements." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: [
      "Cost 50,000, salvage 5,000, life 5 -> annual depreciation 9,000",
      "Cost 20,000, salvage 2,000, life 6, year 3 -> accumulated 9,000",
      "Higher salvage value reduces annual depreciation expense",
    ],
  },
  "revenue-calculator": {
    title: "Revenue Calculator",
    description: "Estimate revenue from units sold, unit price, discount, and refund percentage.",
    metaDescription: "Free revenue calculator. Calculate gross revenue, net revenue, and average realized price.",
    primaryKeyword: "revenue calculator",
    intro: "This revenue calculator estimates gross and net revenue after discounts and expected refunds.",
    inputs: [
      { type: "number", key: "unitsSold", label: "Units Sold", placeholder: "1200" },
      { type: "number", key: "unitPrice", label: "Unit Price", placeholder: "49.99" },
      { type: "number", key: "discountRate", label: "Discount Rate (%)", placeholder: "10", defaultValue: "0" },
      { type: "number", key: "refundRate", label: "Refund Rate (%)", placeholder: "3", defaultValue: "0" },
    ],
    outputs: [
      { key: "grossRevenue", label: "Gross Revenue", format: "currency", accent: "green" },
      { key: "netRevenue", label: "Net Revenue", format: "currency", accent: "emerald" },
      { key: "discountAmount", label: "Discount Amount", format: "currency", accent: "blue" },
      { key: "avgRealizedPrice", label: "Avg Realized Price", format: "currency", accent: "purple" },
    ],
    calculate: (n) => {
      const { unitsSold, unitPrice, discountRate, refundRate } = n;
      if (unitsSold < 0 || unitPrice < 0) return { error: "Units sold and unit price must be non-negative." };
      if (discountRate < 0 || refundRate < 0) return { error: "Rates cannot be negative." };
      if (discountRate > 100 || refundRate > 100) return { error: "Rates cannot exceed 100%." };
      const grossRevenue = unitsSold * unitPrice;
      const discountAmount = grossRevenue * (discountRate / 100);
      const postDiscountRevenue = grossRevenue - discountAmount;
      const refundAmount = postDiscountRevenue * (refundRate / 100);
      const netRevenue = postDiscountRevenue - refundAmount;
      const avgRealizedPrice = unitsSold === 0 ? 0 : netRevenue / unitsSold;
      return {
        values: { grossRevenue, netRevenue, discountAmount, avgRealizedPrice },
        insight: `Estimated net revenue is ${netRevenue.toFixed(2)} after discounts and refunds.`,
      };
    },
    formulas: [
      { expression: "Gross Revenue = Units Sold x Unit Price", explanation: "Top-line revenue before deductions." },
      { expression: "Net Revenue = (Gross - Discounts) - Refunds", explanation: "Revenue after common post-sale adjustments." },
      { expression: "Avg Realized Price = Net Revenue / Units Sold", explanation: "Effective per-unit revenue after deductions." },
    ],
    useCases: [
      { title: "Sales planning", description: "Project net revenue under different pricing and discount assumptions." },
      { title: "Campaign analysis", description: "Measure the tradeoff between discounts and realized revenue." },
      { title: "Forecast modeling", description: "Stress-test expected revenue with refund scenarios." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: [
      "1,000 units at 50 -> gross 50,000 before deductions",
      "10% discount on 80,000 gross -> discount amount 8,000",
      "Apply refund rate after discount to estimate net realized revenue",
    ],
  },
  "payback-period-calculator": {
    title: "Payback Period Calculator",
    description: "Calculate how long it takes to recover an initial investment from net cash inflows.",
    metaDescription: "Free payback period calculator. Estimate investment recovery time from annual net cash flow.",
    primaryKeyword: "payback period calculator",
    intro: "This payback period calculator estimates how quickly an investment can recover its upfront cost.",
    inputs: [
      { type: "number", key: "initialInvestment", label: "Initial Investment", placeholder: "50000" },
      { type: "number", key: "annualCashInflow", label: "Annual Cash Inflow", placeholder: "18000" },
      { type: "number", key: "annualOperatingCost", label: "Annual Operating Cost", placeholder: "3000", defaultValue: "0" },
    ],
    outputs: [
      { key: "netAnnualCashFlow", label: "Net Annual Cash Flow", format: "currency", accent: "green" },
      { key: "paybackYears", label: "Payback Period (Years)", format: "number", accent: "emerald" },
      { key: "paybackMonths", label: "Payback Period (Months)", format: "number", accent: "blue" },
      { key: "firstYearRecovery", label: "Year-1 Recovery %", format: "percent", accent: "purple" },
    ],
    calculate: (n) => {
      const { initialInvestment, annualCashInflow, annualOperatingCost } = n;
      if (initialInvestment <= 0) return { error: "Initial investment must be greater than zero." };
      if (annualCashInflow < 0 || annualOperatingCost < 0) return { error: "Annual values cannot be negative." };
      const netAnnualCashFlow = annualCashInflow - annualOperatingCost;
      if (netAnnualCashFlow <= 0) return { error: "Net annual cash flow must be positive for payback." };
      const paybackYears = initialInvestment / netAnnualCashFlow;
      const paybackMonths = paybackYears * 12;
      const firstYearRecovery = (netAnnualCashFlow / initialInvestment) * 100;
      return {
        values: { netAnnualCashFlow, paybackYears, paybackMonths, firstYearRecovery },
        insight: `Estimated payback period is ${paybackYears.toFixed(2)} years with current cash flow assumptions.`,
      };
    },
    formulas: [
      { expression: "Net Annual Cash Flow = Annual Inflow - Annual Operating Cost", explanation: "Cash generated each year after operating expenses." },
      { expression: "Payback Period (Years) = Initial Investment / Net Annual Cash Flow", explanation: "Time needed to recover upfront cost." },
      { expression: "Year-1 Recovery % = Net Annual Cash Flow / Initial Investment x 100", explanation: "Share of initial cost recovered in first year." },
    ],
    useCases: [
      { title: "Capex prioritization", description: "Compare projects by how quickly they recover invested capital." },
      { title: "Equipment upgrades", description: "Estimate recovery timeline for machinery replacement." },
      { title: "Business proposals", description: "Provide simple payback view for stakeholder decisions." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: [
      "Initial 60,000 with net annual 15,000 -> 4-year payback",
      "Higher operating costs increase payback duration",
      "Use payback with ROI/NPV for a fuller investment view",
    ],
  },
  "loan-interest-calculator": {
    title: "Loan Interest Calculator",
    description: "Estimate total interest and total repayment for fixed-rate loans.",
    metaDescription: "Free loan interest calculator. Calculate monthly payment, total interest, and total repayment.",
    primaryKeyword: "loan interest calculator",
    intro: "This loan interest calculator estimates repayment burden from principal, annual interest rate, and loan term.",
    inputs: [
      { type: "number", key: "principal", label: "Loan Principal", placeholder: "250000" },
      { type: "number", key: "annualRate", label: "Annual Interest Rate (%)", placeholder: "7.5" },
      { type: "number", key: "termYears", label: "Loan Term (Years)", placeholder: "15" },
    ],
    outputs: [
      { key: "monthlyPayment", label: "Monthly Payment", format: "currency", accent: "green" },
      { key: "totalRepayment", label: "Total Repayment", format: "currency", accent: "emerald" },
      { key: "totalInterest", label: "Total Interest", format: "currency", accent: "blue" },
      { key: "interestShare", label: "Interest Share %", format: "percent", accent: "purple" },
    ],
    calculate: (n) => {
      const { principal, annualRate, termYears } = n;
      if (principal <= 0) return { error: "Loan principal must be greater than zero." };
      if (annualRate < 0) return { error: "Interest rate cannot be negative." };
      if (termYears <= 0) return { error: "Loan term must be greater than zero." };
      const months = Math.round(termYears * 12);
      const monthlyRate = annualRate / 100 / 12;
      const monthlyPayment =
        monthlyRate === 0
          ? principal / months
          : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
      const totalRepayment = monthlyPayment * months;
      const totalInterest = totalRepayment - principal;
      const interestShare = totalRepayment === 0 ? 0 : (totalInterest / totalRepayment) * 100;
      return {
        values: { monthlyPayment, totalRepayment, totalInterest, interestShare },
        insight: `Estimated total interest over the term is ${totalInterest.toFixed(2)}.`,
      };
    },
    formulas: [
      { expression: "M = P x r / (1 - (1+r)^-n)", explanation: "Standard fixed-rate loan payment formula." },
      { expression: "Total Repayment = Monthly Payment x Total Months", explanation: "Total amount paid over full term." },
      { expression: "Total Interest = Total Repayment - Principal", explanation: "Cost of borrowing excluding principal." },
    ],
    useCases: [
      { title: "Loan comparison", description: "Compare lenders using total interest and monthly burden." },
      { title: "Refinance checks", description: "Test different rate and term combinations quickly." },
      { title: "Debt planning", description: "Estimate long-term repayment obligations." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: [
      "Lower rates reduce both monthly payment and lifetime interest",
      "Longer terms reduce monthly payment but may increase total interest",
      "Even small rate differences can materially change total repayment",
    ],
  },
  "savings-goal-calculator": {
    title: "Savings Goal Calculator",
    description: "Calculate monthly contribution needed to reach a savings target.",
    metaDescription: "Free savings goal calculator. Find required monthly savings to hit your target by deadline.",
    primaryKeyword: "savings goal calculator",
    intro: "This savings goal calculator estimates how much you need to save each month to reach a target amount.",
    inputs: [
      { type: "number", key: "targetAmount", label: "Target Amount", placeholder: "50000" },
      { type: "number", key: "currentSavings", label: "Current Savings", placeholder: "8000", defaultValue: "0" },
      { type: "number", key: "annualRate", label: "Expected Annual Return (%)", placeholder: "4", defaultValue: "0" },
      { type: "number", key: "timelineYears", label: "Timeline (Years)", placeholder: "5" },
    ],
    outputs: [
      { key: "requiredMonthlySavings", label: "Required Monthly Savings", format: "currency", accent: "green" },
      { key: "projectedContributions", label: "Projected Contributions", format: "currency", accent: "emerald" },
      { key: "projectedGrowth", label: "Projected Growth", format: "currency", accent: "blue" },
      { key: "fundedPercentToday", label: "Already Funded %", format: "percent", accent: "purple" },
    ],
    calculate: (n) => {
      const { targetAmount, currentSavings, annualRate, timelineYears } = n;
      if (targetAmount <= 0) return { error: "Target amount must be greater than zero." };
      if (currentSavings < 0) return { error: "Current savings cannot be negative." };
      if (annualRate < 0) return { error: "Expected return cannot be negative." };
      if (timelineYears <= 0) return { error: "Timeline must be greater than zero." };
      const months = Math.round(timelineYears * 12);
      const monthlyRate = annualRate / 100 / 12;
      const fvCurrent = currentSavings * Math.pow(1 + monthlyRate, months);
      const remainingTarget = Math.max(0, targetAmount - fvCurrent);
      const requiredMonthlySavings =
        remainingTarget === 0
          ? 0
          : monthlyRate === 0
            ? remainingTarget / months
            : remainingTarget / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      const projectedContributions = requiredMonthlySavings * months;
      const projectedGrowth = targetAmount - currentSavings - projectedContributions;
      const fundedPercentToday = (currentSavings / targetAmount) * 100;
      return {
        values: { requiredMonthlySavings, projectedContributions, projectedGrowth, fundedPercentToday },
        insight: `You need approximately ${requiredMonthlySavings.toFixed(2)} per month to reach the target on time.`,
      };
    },
    formulas: [
      { expression: "FV(current) = Current Savings x (1 + r)^n", explanation: "Future value of amount you already saved." },
      { expression: "PMT = Remaining Target / [((1+r)^n - 1) / r]", explanation: "Monthly contribution needed when earnings compound monthly." },
      { expression: "Funded % = Current Savings / Target x 100", explanation: "Progress toward target before future contributions." },
    ],
    useCases: [
      { title: "Emergency fund planning", description: "Set monthly savings needed to build a safety buffer." },
      { title: "Major purchase goals", description: "Plan for a car, home down payment, or education expense." },
      { title: "Milestone budgeting", description: "Translate long-term goals into manageable monthly targets." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: [
      "Target 30,000 in 3 years -> monthly target depends on current savings and return rate",
      "Higher current savings lowers required monthly contribution",
      "Longer timelines reduce monthly burden but increase sensitivity to assumptions",
    ],
  },
  "cost-split-calculator": {
    title: "Cost Split Calculator",
    description: "Split costs evenly or proportionally among participants.",
    metaDescription: "Free cost split calculator. Split a bill evenly or by custom participation percentages.",
    primaryKeyword: "cost split calculator",
    intro: "This cost split calculator helps divide total expenses fairly across people or teams.",
    inputs: [
      { type: "number", key: "totalCost", label: "Total Cost", placeholder: "2400" },
      { type: "number", key: "participants", label: "Number of Participants", placeholder: "4" },
      { type: "number", key: "yourSharePercent", label: "Your Share (%)", placeholder: "25", defaultValue: "25" },
    ],
    outputs: [
      { key: "equalShare", label: "Equal Share per Person", format: "currency", accent: "green" },
      { key: "yourShareAmount", label: "Your Share Amount", format: "currency", accent: "emerald" },
      { key: "othersCombined", label: "Others Combined Share", format: "currency", accent: "blue" },
      { key: "remainingPerPerson", label: "Remaining Per Other Person", format: "currency", accent: "purple" },
    ],
    calculate: (n) => {
      const { totalCost, participants, yourSharePercent } = n;
      const people = Math.floor(participants);
      if (totalCost < 0) return { error: "Total cost cannot be negative." };
      if (people <= 0) return { error: "Participants must be at least 1." };
      if (yourSharePercent < 0 || yourSharePercent > 100) return { error: "Your share percent must be between 0 and 100." };
      const equalShare = people === 0 ? 0 : totalCost / people;
      const yourShareAmount = totalCost * (yourSharePercent / 100);
      const othersCombined = totalCost - yourShareAmount;
      const remainingPerPerson = people <= 1 ? 0 : othersCombined / (people - 1);
      return {
        values: { equalShare, yourShareAmount, othersCombined, remainingPerPerson },
        insight: `Equal split is ${equalShare.toFixed(2)} per person. Your configured share is ${yourShareAmount.toFixed(2)}.`,
      };
    },
    formulas: [
      { expression: "Equal Share = Total Cost / Participants", explanation: "Standard even split across all participants." },
      { expression: "Your Share = Total Cost x (Your Share % / 100)", explanation: "Custom split based on your selected percentage." },
      { expression: "Remaining Per Other Person = (Total - Your Share) / (Participants - 1)", explanation: "Evenly distributes remaining amount among others." },
    ],
    useCases: [
      { title: "Trip expenses", description: "Split accommodation, transport, and activity costs quickly." },
      { title: "Shared household bills", description: "Divide rent or utilities with custom participation." },
      { title: "Team purchases", description: "Allocate common costs among team members fairly." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: [
      "Total 1,200 among 4 people -> equal share 300 each",
      "If your share is 40% on 2,000, your amount is 800",
      "Custom share is useful when one person consumes more resources",
    ],
  },
  "credit-card-payoff-calculator": {
    title: "Credit Card Payoff Calculator",
    description: "Estimate payoff time and interest cost based on balance, APR, and monthly payment.",
    metaDescription: "Free credit card payoff calculator. Calculate months to debt-free and total interest paid.",
    primaryKeyword: "credit card payoff calculator",
    intro: "This credit card payoff calculator helps estimate how long debt repayment takes under your current payment plan.",
    inputs: [
      { type: "number", key: "balance", label: "Current Balance", placeholder: "8500" },
      { type: "number", key: "apr", label: "APR (%)", placeholder: "22.99" },
      { type: "number", key: "monthlyPayment", label: "Monthly Payment", placeholder: "300" },
    ],
    outputs: [
      { key: "monthsToPayoff", label: "Months to Payoff", format: "number", accent: "green" },
      { key: "yearsToPayoff", label: "Years to Payoff", format: "number", accent: "emerald" },
      { key: "totalInterestPaid", label: "Total Interest Paid", format: "currency", accent: "blue" },
      { key: "totalPaid", label: "Total Paid", format: "currency", accent: "purple" },
    ],
    calculate: (n) => {
      const { balance, apr, monthlyPayment } = n;
      if (balance <= 0) return { error: "Balance must be greater than zero." };
      if (apr < 0) return { error: "APR cannot be negative." };
      if (monthlyPayment <= 0) return { error: "Monthly payment must be greater than zero." };

      const monthlyRate = apr / 100 / 12;
      let remaining = balance;
      let totalInterestPaid = 0;
      let monthsToPayoff = 0;
      const maxMonths = 1200;

      while (remaining > 0 && monthsToPayoff < maxMonths) {
        const interest = remaining * monthlyRate;
        totalInterestPaid += interest;
        const principalPaid = monthlyPayment - interest;
        if (principalPaid <= 0) return { error: "Payment is too low to cover monthly interest. Increase monthly payment." };
        remaining = Math.max(0, remaining - principalPaid);
        monthsToPayoff += 1;
      }

      if (monthsToPayoff >= maxMonths) return { error: "Payoff period is too long under current payment assumptions." };
      const yearsToPayoff = monthsToPayoff / 12;
      const totalPaid = balance + totalInterestPaid;
      return {
        values: { monthsToPayoff, yearsToPayoff, totalInterestPaid, totalPaid },
        insight: `At this payment level, estimated payoff time is ${monthsToPayoff} months.`,
      };
    },
    formulas: [
      { expression: "Monthly Interest = Balance x (APR/12)", explanation: "Interest added each month before payment is applied." },
      { expression: "Principal Paid = Monthly Payment - Monthly Interest", explanation: "Amount reducing debt balance each cycle." },
      { expression: "Total Paid = Principal + Total Interest", explanation: "Full out-of-pocket cost to eliminate balance." },
    ],
    useCases: [
      { title: "Debt payoff planning", description: "Test payment scenarios to become debt-free faster." },
      { title: "Interest minimization", description: "See savings from raising monthly payment amounts." },
      { title: "Budget strategy", description: "Align debt reduction goals with monthly cash flow." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: [
      "Higher monthly payments reduce both payoff time and total interest",
      "High APR cards become expensive with minimum-only payments",
      "Even modest payment increases can save significant long-term interest",
    ],
  },
  "hourly-to-salary-calculator": {
    title: "Hourly to Salary Calculator",
    description: "Convert hourly wage into weekly, monthly, and annual salary estimates.",
    metaDescription: "Free hourly to salary calculator. Convert hourly pay to weekly, monthly, and yearly income.",
    primaryKeyword: "hourly to salary calculator",
    intro: "This hourly to salary calculator converts hourly earnings into annualized income for planning and offer comparisons.",
    inputs: [
      { type: "number", key: "hourlyRate", label: "Hourly Rate", placeholder: "28" },
      { type: "number", key: "hoursPerWeek", label: "Hours per Week", placeholder: "40" },
      { type: "number", key: "weeksPerYear", label: "Working Weeks per Year", placeholder: "52" },
    ],
    outputs: [
      { key: "weeklyPay", label: "Weekly Pay", format: "currency", accent: "green" },
      { key: "monthlyPay", label: "Monthly Pay", format: "currency", accent: "emerald" },
      { key: "annualSalary", label: "Annual Salary", format: "currency", accent: "blue" },
      { key: "biweeklyPay", label: "Biweekly Pay", format: "currency", accent: "purple" },
    ],
    calculate: (n) => {
      const { hourlyRate, hoursPerWeek, weeksPerYear } = n;
      if (hourlyRate < 0 || hoursPerWeek < 0 || weeksPerYear < 0) return { error: "Inputs cannot be negative." };
      if (weeksPerYear === 0) return { error: "Working weeks per year must be greater than zero." };
      const weeklyPay = hourlyRate * hoursPerWeek;
      const annualSalary = weeklyPay * weeksPerYear;
      const monthlyPay = annualSalary / 12;
      const biweeklyPay = weeklyPay * 2;
      return {
        values: { weeklyPay, monthlyPay, annualSalary, biweeklyPay },
        insight: `Estimated annual salary is ${annualSalary.toFixed(2)} under the current assumptions.`,
      };
    },
    formulas: [
      { expression: "Weekly Pay = Hourly Rate x Hours per Week", explanation: "Expected pay for one standard working week." },
      { expression: "Annual Salary = Weekly Pay x Weeks per Year", explanation: "Yearly earnings estimate from working schedule." },
      { expression: "Monthly Pay = Annual Salary / 12", explanation: "Average monthly equivalent salary estimate." },
    ],
    useCases: [
      { title: "Job offer comparison", description: "Compare hourly and salaried offers on a common annual basis." },
      { title: "Budget forecasting", description: "Estimate monthly income for expense planning." },
      { title: "Contract planning", description: "Model earnings under different weekly hour assumptions." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: [
      "30/hour at 40 hours/week for 52 weeks -> 62,400 annual",
      "Reducing working weeks lowers annualized estimate",
      "Use realistic hours and unpaid time for better projections",
    ],
  },
  "simple-interest-calculator": {
    title: "Simple Interest Calculator",
    description: "Calculate simple interest and total amount from principal, annual rate, and time.",
    metaDescription: "Free simple interest calculator. Find interest earned and ending balance from principal, rate, and time period.",
    primaryKeyword: "simple interest calculator",
    intro: "This simple interest calculator uses I = P x R x T with time in years for fast estimates.",
    inputs: [
      { type: "number", key: "principal", label: "Principal", placeholder: "10000" },
      { type: "number", key: "annualRate", label: "Annual Interest Rate (%)", placeholder: "6" },
      { type: "number", key: "years", label: "Time (Years)", placeholder: "3" },
    ],
    outputs: [
      { key: "interest", label: "Simple Interest", format: "currency", accent: "green" },
      { key: "total", label: "Total Amount", format: "currency", accent: "emerald" },
      { key: "effectiveAnnual", label: "Effective Total Return %", format: "percent", accent: "blue" },
    ],
    calculate: (n) => {
      const { principal, annualRate, years } = n;
      if (principal <= 0) return { error: "Principal must be greater than zero." };
      if (years < 0) return { error: "Time cannot be negative." };
      const interest = principal * (annualRate / 100) * years;
      const total = principal + interest;
      const effectiveAnnual = principal === 0 ? 0 : (interest / principal) * 100;
      return { values: { interest, total, effectiveAnnual }, insight: `Interest earned is ${interest.toFixed(2)} over ${years} year(s).` };
    },
    formulas: [
      { expression: "Interest = Principal x (Rate/100) x Time", explanation: "Linear interest with no compounding between periods." },
      { expression: "Total = Principal + Interest", explanation: "Maturity value before taxes or fees." },
    ],
    useCases: [
      { title: "Short-term notes", description: "Estimate interest on simple-interest loans or bonds." },
      { title: "Education", description: "Compare simple vs compound growth assumptions." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: ["10,000 at 5% for 2 years -> 1,000 interest", "2,500 at 8% for 0.5 years -> 100 interest", "50,000 at 4% for 5 years -> 10,000 interest"],
  },
  "compound-interest-calculator": {
    title: "Compound Interest Calculator",
    description: "Project future value from a lump sum with periodic compounding.",
    metaDescription: "Free compound interest calculator. Estimate future value with annual, quarterly, or monthly compounding.",
    primaryKeyword: "compound interest calculator",
    intro: "This calculator uses discrete compounding: balance grows by (1 + APR/m) each of m periods per year.",
    inputs: [
      { type: "number", key: "principal", label: "Principal", placeholder: "5000" },
      { type: "number", key: "annualRate", label: "Annual Interest Rate (%)", placeholder: "7" },
      { type: "number", key: "years", label: "Years", placeholder: "10" },
      {
        type: "select",
        key: "periodsPerYear",
        label: "Compound Frequency",
        defaultValue: "12",
        options: [
          { value: "1", label: "Annually" },
          { value: "2", label: "Semiannually" },
          { value: "4", label: "Quarterly" },
          { value: "12", label: "Monthly" },
        ],
      },
    ],
    outputs: [
      { key: "futureValue", label: "Future Value", format: "currency", accent: "green" },
      { key: "interestEarned", label: "Interest Earned", format: "currency", accent: "emerald" },
      { key: "effectiveApr", label: "Effective Annual Rate %", format: "percent", accent: "blue" },
    ],
    calculate: (n, raw) => {
      const { principal, annualRate, years } = n;
      const m = Number(raw.periodsPerYear ?? "12");
      if (!Number.isFinite(m) || m <= 0) return { error: "Invalid compounding frequency." };
      if (years <= 0) return { error: "Years must be greater than zero." };
      if (principal < 0) return { error: "Principal cannot be negative." };
      const rPeriod = annualRate / 100 / m;
      const periods = years * m;
      const futureValue = principal * Math.pow(1 + rPeriod, periods);
      const interestEarned = futureValue - principal;
      const effectiveApr = principal === 0 ? 0 : (Math.pow(futureValue / principal, 1 / years) - 1) * 100;
      return { values: { futureValue, interestEarned, effectiveApr }, insight: `Balance grows to about ${futureValue.toFixed(2)} after ${years} year(s).` };
    },
    formulas: [
      { expression: "Future Value = Principal x (1 + APR/m)^(m x Years)", explanation: "Standard discrete periodic compounding." },
      { expression: "Effective annual rate = (FV / Principal)^(1/Years) - 1", explanation: "Constant annual rate that matches the result." },
    ],
    useCases: [
      { title: "Savings projection", description: "Compare growth at different compounding frequencies." },
      { title: "Compare to simple interest", description: "Higher frequency increases yield at the same stated APR." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: ["5,000 at 6% monthly for 10 years beats annual compounding at the same APR", "APR stays fixed; effective yield rises with frequency", "For regular deposits use the savings calculator"],
  },
  "loan-emi-calculator": {
    title: "Loan EMI Calculator",
    description: "Estimate monthly payment, total interest, and payoff for amortizing loans.",
    metaDescription: "Free loan EMI calculator. Compute monthly payment and total interest from loan amount, APR, and term.",
    primaryKeyword: "loan emi calculator",
    intro: "This EMI calculator applies a standard amortizing payment formula for fixed-rate loans.",
    inputs: [
      { type: "number", key: "principal", label: "Loan Amount", placeholder: "250000" },
      { type: "number", key: "annualRate", label: "Annual Interest Rate (%)", placeholder: "6.5" },
      { type: "number", key: "years", label: "Loan Term (Years)", placeholder: "30" },
    ],
    outputs: [
      { key: "emi", label: "Monthly Payment (EMI)", format: "currency", accent: "green" },
      { key: "totalPaid", label: "Total Payments", format: "currency", accent: "emerald" },
      { key: "totalInterest", label: "Total Interest", format: "currency", accent: "blue" },
    ],
    calculate: (n) => {
      const { principal, annualRate, years } = n;
      if (principal <= 0) return { error: "Loan amount must be greater than zero." };
      if (years <= 0) return { error: "Loan term must be greater than zero." };
      const nMonths = Math.round(years * 12);
      const r = annualRate / 100 / 12;
      let emi: number;
      if (Math.abs(r) < 1e-12) emi = principal / nMonths;
      else emi = (principal * r * Math.pow(1 + r, nMonths)) / (Math.pow(1 + r, nMonths) - 1);
      const totalPaid = emi * nMonths;
      const totalInterest = totalPaid - principal;
      return { values: { emi, totalPaid, totalInterest }, insight: `Monthly EMI is approximately ${emi.toFixed(2)} over ${nMonths} months.` };
    },
    formulas: [
      { expression: "EMI = P x r x (1+r)^n / ((1+r)^n - 1)", explanation: "Equal monthly payments on a fixed-rate amortizing loan." },
      { expression: "r = APR / 12 as decimal", explanation: "Monthly interest rate from annual percentage rate." },
    ],
    useCases: [
      { title: "Mortgage or auto preview", description: "Translate rate and term into a monthly payment." },
      { title: "Refinance checks", description: "Compare total interest under different APRs." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: ["250k at 6.5% for 30 years -> mid-four-digit EMI range", "Shorter terms raise EMI but cut total interest", "0% APR implies flat principal/term payment"],
  },
  "discount-calculator": {
    title: "Discount Calculator",
    description: "Find sale price, savings, and discount impact from list price and percent off.",
    metaDescription: "Free discount calculator. Calculate final price and savings from original price and discount percentage.",
    primaryKeyword: "discount calculator",
    intro: "Enter list price and discount percent to see what you pay and how much you save.",
    inputs: [
      { type: "number", key: "listPrice", label: "Original Price", placeholder: "89.99" },
      { type: "number", key: "discountPercent", label: "Discount (%)", placeholder: "25" },
    ],
    outputs: [
      { key: "salePrice", label: "Sale Price", format: "currency", accent: "green" },
      { key: "savings", label: "You Save", format: "currency", accent: "emerald" },
      { key: "youPayRatio", label: "You Pay % of List", format: "percent", accent: "blue" },
    ],
    calculate: (n) => {
      const { listPrice, discountPercent } = n;
      if (listPrice < 0) return { error: "Original price cannot be negative." };
      if (discountPercent < 0 || discountPercent > 100) return { error: "Discount must be between 0 and 100%." };
      const savings = listPrice * (discountPercent / 100);
      const salePrice = listPrice - savings;
      const youPayRatio = listPrice === 0 ? 0 : (salePrice / listPrice) * 100;
      return { values: { salePrice, savings, youPayRatio }, insight: `Sale price is ${salePrice.toFixed(2)} after ${discountPercent}% off.` };
    },
    formulas: [
      { expression: "Savings = List Price x (Discount/100)", explanation: "Dollar amount removed by the promotion." },
      { expression: "Sale Price = List Price - Savings", explanation: "Amount actually charged before tax." },
    ],
    useCases: [
      { title: "Retail shopping", description: "Stack mental math for coupons and sales." },
      { title: "Invoicing", description: "Verify line-item discounts on quotes." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: ["100 list, 20% off -> pay 80", "49.99 list, 15% off", "0% discount leaves price unchanged"],
  },
  "profit-margin-calculator": {
    title: "Profit Margin Calculator",
    description: "Compute gross margin, profit dollars, and markup from revenue and cost.",
    metaDescription: "Free profit margin calculator. Find margin percent, profit amount, and markup from revenue and cost of goods sold.",
    primaryKeyword: "profit margin calculator",
    intro: "Margin is profit as a share of revenue; markup compares profit to cost.",
    inputs: [
      { type: "number", key: "revenue", label: "Revenue (Sales)", placeholder: "120000" },
      { type: "number", key: "cost", label: "Cost of Goods Sold", placeholder: "72000" },
    ],
    outputs: [
      { key: "profit", label: "Gross Profit", format: "currency", accent: "green" },
      { key: "marginPct", label: "Gross Margin %", format: "percent", accent: "emerald" },
      { key: "markupPct", label: "Markup on Cost %", format: "percent", accent: "blue" },
    ],
    calculate: (n) => {
      const { revenue, cost } = n;
      if (revenue <= 0) return { error: "Revenue must be greater than zero." };
      if (cost < 0) return { error: "Cost cannot be negative." };
      const profit = revenue - cost;
      const marginPct = (profit / revenue) * 100;
      const markupPct = cost === 0 ? 0 : (profit / cost) * 100;
      return { values: { profit, marginPct, markupPct }, insight: `Gross margin is ${marginPct.toFixed(2)}% on this revenue base.` };
    },
    formulas: [
      { expression: "Margin % = (Revenue - Cost) / Revenue x 100", explanation: "Share of each sale that is profit." },
      { expression: "Markup % = (Revenue - Cost) / Cost x 100", explanation: "Profit expressed relative to cost." },
    ],
    useCases: [
      { title: "Pricing reviews", description: "Sanity-check whether costs support your price." },
      { title: "Reporting", description: "Translate P&L figures into margin metrics." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: ["120k revenue, 72k COGS -> 40% margin", "Higher COGS squeezes both margin and profit dollars", "Margin can be negative if cost exceeds revenue"],
  },
  "markup-calculator": {
    title: "Markup Calculator",
    description: "Calculate selling price, profit dollars, and revenue multiples from cost and markup percent.",
    metaDescription: "Free markup calculator. Convert cost plus markup percent into selling price and profit.",
    primaryKeyword: "markup calculator",
    intro: "Markup adds a percentage on top of cost to reach a resale price.",
    inputs: [
      { type: "number", key: "cost", label: "Unit Cost", placeholder: "45" },
      { type: "number", key: "markupPercent", label: "Markup (%)", placeholder: "60" },
    ],
    outputs: [
      { key: "sellingPrice", label: "Selling Price", format: "currency", accent: "green" },
      { key: "profit", label: "Profit per Unit", format: "currency", accent: "emerald" },
      { key: "marginPct", label: "Implied Margin %", format: "percent", accent: "blue" },
    ],
    calculate: (n) => {
      const { cost, markupPercent } = n;
      if (cost < 0) return { error: "Cost cannot be negative." };
      if (markupPercent < 0) return { error: "Markup cannot be negative." };
      const sellingPrice = cost * (1 + markupPercent / 100);
      const profit = sellingPrice - cost;
      const marginPct = sellingPrice === 0 ? 0 : (profit / sellingPrice) * 100;
      return { values: { sellingPrice, profit, marginPct }, insight: `Selling price is ${sellingPrice.toFixed(2)} with ${markupPercent}% markup on cost.` };
    },
    formulas: [
      { expression: "Selling Price = Cost x (1 + Markup/100)", explanation: "Classic cost-plus pricing." },
      { expression: "Margin % = Profit / Selling Price x 100", explanation: "Margin implied by the marked-up price." },
    ],
    useCases: [
      { title: "Product pricing", description: "Set shelves or menu prices from wholesale cost." },
      { title: "Quotes", description: "Back-solve customer price from internal cost targets." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: ["Cost 50, markup 100% -> price 100", "Cost 12, markup 25% -> price 15", "0% markup simply passes through cost"],
  },
  "roi-calculator": {
    title: "ROI Calculator",
    description: "Calculate return on investment percent and profit from starting and ending amounts.",
    metaDescription: "Free ROI calculator. Find return on investment percentage and dollar gain from invested vs returned amount.",
    primaryKeyword: "roi calculator",
    intro: "ROI compares net gain to amount invested for a single-period view.",
    inputs: [
      { type: "number", key: "invested", label: "Amount Invested", placeholder: "15000" },
      { type: "number", key: "returned", label: "Ending Value", placeholder: "18900" },
    ],
    outputs: [
      { key: "gain", label: "Dollar Gain", format: "currency", accent: "green" },
      { key: "roiPct", label: "ROI %", format: "percent", accent: "emerald" },
      { key: "multiple", label: "Return Multiple (x)", format: "number", accent: "blue" },
    ],
    calculate: (n) => {
      const { invested, returned } = n;
      if (invested <= 0) return { error: "Invested amount must be greater than zero." };
      const gain = returned - invested;
      const roiPct = (gain / invested) * 100;
      const multiple = returned / invested;
      return { values: { gain, roiPct, multiple }, insight: `ROI is ${roiPct.toFixed(2)}% on the capital deployed.` };
    },
    formulas: [
      { expression: "Gain = Ending Value - Invested", explanation: "Absolute profit or loss on the position." },
      { expression: "ROI % = Gain / Invested x 100", explanation: "Return scaled by original capital." },
    ],
    useCases: [
      { title: "Investments", description: "Compare outcomes across projects or assets." },
      { title: "Marketing", description: "Relate spend to attributable returns." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: ["10k -> 11.5k is 15% ROI", "Losses produce negative ROI", "ROI ignores time; pair with CAGR for horizons"],
  },
  "savings-calculator": {
    title: "Savings Calculator",
    description: "Project ending balance from starting savings, monthly deposits, and annual interest.",
    metaDescription: "Free savings calculator. Estimate future balance with monthly contributions and compound interest.",
    primaryKeyword: "savings calculator",
    intro: "Combines lump-sum compounding with monthly contributions at a steady annual rate.",
    inputs: [
      { type: "number", key: "starting", label: "Starting Balance", placeholder: "2000" },
      { type: "number", key: "monthly", label: "Monthly Deposit", placeholder: "250" },
      { type: "number", key: "annualRate", label: "Annual Interest Rate (%)", placeholder: "4.5" },
      { type: "number", key: "years", label: "Years", placeholder: "8" },
    ],
    outputs: [
      { key: "futureValue", label: "Estimated Balance", format: "currency", accent: "green" },
      { key: "contributed", label: "You Contributed", format: "currency", accent: "emerald" },
      { key: "fromGrowth", label: "Growth Only", format: "currency", accent: "blue" },
    ],
    calculate: (n) => {
      const { starting, monthly, annualRate, years } = n;
      if (years <= 0) return { error: "Years must be greater than zero." };
      if (starting < 0 || monthly < 0) return { error: "Balances and deposits cannot be negative." };
      const months = Math.round(years * 12);
      const r = annualRate / 100 / 12;
      const fvLump = starting * Math.pow(1 + r, months);
      let fvFlow = 0;
      if (Math.abs(r) < 1e-12) fvFlow = monthly * months;
      else fvFlow = monthly * ((Math.pow(1 + r, months) - 1) / r);
      const futureValue = fvLump + fvFlow;
      const contributed = starting + monthly * months;
      const fromGrowth = futureValue - contributed;
      return { values: { futureValue, contributed, fromGrowth }, insight: `Balance reaches about ${futureValue.toFixed(2)} after ${years} year(s).` };
    },
    formulas: [
      { expression: "Future value = Lump sum growth + Annuity of monthly deposits", explanation: "Standard monthly compounding model." },
      { expression: "Monthly rate = APR / 12", explanation: "Convert annual rate to periodic savings rate." },
    ],
    useCases: [
      { title: "Emergency fund", description: "Model steady contributions to a cash buffer." },
      { title: "Goals", description: "Tie monthly savings to a target date." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: ["Higher APR or longer horizon increases growth share", "Even small monthly deposits compound", "Taxes and fees not modeled here"],
  },
  "cagr-calculator": {
    title: "CAGR Calculator",
    description: "Compute compound annual growth rate from starting value, ending value, and years.",
    metaDescription: "Free CAGR calculator. Find annualized growth rate between two balances over time.",
    primaryKeyword: "cagr calculator",
    intro: "CAGR smooths performance into one equivalent yearly growth rate.",
    inputs: [
      { type: "number", key: "begin", label: "Starting Value", placeholder: "10000" },
      { type: "number", key: "end", label: "Ending Value", placeholder: "18500" },
      { type: "number", key: "years", label: "Years", placeholder: "7" },
    ],
    outputs: [
      { key: "cagr", label: "CAGR %", format: "percent", accent: "green" },
      { key: "totalReturnPct", label: "Total Return %", format: "percent", accent: "emerald" },
      { key: "multiple", label: "Ending Multiple (x)", format: "number", accent: "blue" },
    ],
    calculate: (n) => {
      const { begin, end, years } = n;
      if (begin <= 0) return { error: "Starting value must be greater than zero." };
      if (years <= 0) return { error: "Years must be greater than zero." };
      if (end < 0) return { error: "Ending value cannot be negative." };
      const multiple = end / begin;
      const cagr = (Math.pow(multiple, 1 / years) - 1) * 100;
      const totalReturnPct = (multiple - 1) * 100;
      return { values: { cagr, totalReturnPct, multiple }, insight: `Annualized growth is about ${cagr.toFixed(2)}% per year.` };
    },
    formulas: [
      { expression: "CAGR = (End / Start)^(1/Years) - 1", explanation: "Geometric mean return per year." },
      { expression: "Total Return = End / Start - 1", explanation: "Overall gain without annualizing." },
    ],
    useCases: [
      { title: "Portfolio review", description: "Compare investments on a common annual scale." },
      { title: "Business metrics", description: "Track revenue or user growth over long windows." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: ["10k to 20k in 7 years ~10.4% CAGR", "Negative ending vs start yields negative CAGR", "Volatility between years is not captured in CAGR"],
  },
  "debt-to-income-calculator": {
    title: "Debt-to-Income Calculator",
    description: "Compute debt-to-income ratio from monthly debt payments and gross monthly income.",
    metaDescription: "Free debt-to-income calculator. Find DTI percent for mortgage qualification and budgeting.",
    primaryKeyword: "debt to income calculator",
    intro: "DTI shows how much of gross monthly income services debt.",
    inputs: [
      { type: "number", key: "monthlyDebt", label: "Monthly Debt Payments", placeholder: "2100" },
      { type: "number", key: "grossIncome", label: "Gross Monthly Income", placeholder: "7200" },
    ],
    outputs: [
      { key: "dtiPct", label: "DTI %", format: "percent", accent: "green" },
      { key: "leftover", label: "Income After Debt", format: "currency", accent: "emerald" },
      { key: "perThousand", label: "Debt per $1k Income", format: "currency", accent: "blue" },
    ],
    calculate: (n) => {
      const { monthlyDebt, grossIncome } = n;
      if (grossIncome <= 0) return { error: "Gross monthly income must be greater than zero." };
      if (monthlyDebt < 0) return { error: "Debt payments cannot be negative." };
      const dtiPct = (monthlyDebt / grossIncome) * 100;
      const leftover = grossIncome - monthlyDebt;
      const perThousand = grossIncome === 0 ? 0 : (1000 * monthlyDebt) / grossIncome;
      return { values: { dtiPct, leftover, perThousand }, insight: `DTI is ${dtiPct.toFixed(2)}% with ${leftover.toFixed(2)} left after debt.` };
    },
    formulas: [
      { expression: "DTI % = Monthly Debt / Gross Monthly Income x 100", explanation: "Standard front-end style ratio when debt is all-inclusive." },
      { expression: "Leftover income = Gross income - Debt", explanation: "Cash flow after required payments." },
    ],
    useCases: [
      { title: "Mortgage planning", description: "See how close you are to common DTI guidelines." },
      { title: "Budgeting", description: "Track changes after paying down balances." },
    ],
    tips: DEFAULT_TIPS,
    quickExamples: ["2,100 debt on 7,200 gross -> ~29% DTI", "Lower debt or higher income improves ratio", "Lenders may use different debt definitions"],
  },
  "loan-to-value-calculator": {
    title: "Loan-to-Value Calculator",
    description: "Calculate LTV ratio and equity from loan amount and property value.",
    metaDescription: "Free loan-to-value calculator. Find LTV percentage and ownership equity for mortgage planning.",
    primaryKeyword: "loan to value calculator",
    intro: "LTV compares the loan balance to property value and is commonly used in mortgage risk checks.",
    inputs: [
      { type: "number", key: "loanAmount", label: "Loan Amount", placeholder: "280000" },
      { type: "number", key: "propertyValue", label: "Property Value", placeholder: "350000" },
    ],
    outputs: [
      { key: "ltv", label: "LTV %", format: "percent", accent: "green" },
      { key: "equityAmount", label: "Equity Amount", format: "currency", accent: "emerald" },
      { key: "equityPercent", label: "Equity %", format: "percent", accent: "blue" },
    ],
    calculate: (n) => {
      const { loanAmount, propertyValue } = n;
      if (propertyValue <= 0) return { error: "Property value must be greater than zero." };
      if (loanAmount < 0) return { error: "Loan amount cannot be negative." };
      const ltv = (loanAmount / propertyValue) * 100;
      const equityAmount = propertyValue - loanAmount;
      const equityPercent = (equityAmount / propertyValue) * 100;
      return { values: { ltv, equityAmount, equityPercent }, insight: `Current LTV is ${ltv.toFixed(2)}%.` };
    },
    formulas: [
      { expression: "LTV % = Loan Amount / Property Value x 100", explanation: "Core ratio for mortgage leverage." },
      { expression: "Equity = Property Value - Loan Amount", explanation: "Owner value after debt." },
    ],
    useCases: [{ title: "Refinance planning", description: "Estimate whether you meet lender LTV thresholds." }],
    tips: DEFAULT_TIPS,
    quickExamples: ["280k loan on 350k home -> 80% LTV", "Lower loan balance improves equity share", "Rising property value also lowers LTV"],
  },
  "tip-calculator": {
    title: "Tip Calculator",
    description: "Calculate tip amount, total bill, and per-person split.",
    metaDescription: "Free tip calculator. Add a custom tip percentage and split the total bill among people.",
    primaryKeyword: "tip calculator",
    intro: "Use this tip calculator to quickly estimate gratuity and split costs fairly.",
    inputs: [
      { type: "number", key: "billAmount", label: "Bill Amount", placeholder: "86.5" },
      { type: "number", key: "tipPercent", label: "Tip (%)", placeholder: "18" },
      { type: "number", key: "people", label: "People", placeholder: "3", defaultValue: "1" },
    ],
    outputs: [
      { key: "tipAmount", label: "Tip Amount", format: "currency", accent: "green" },
      { key: "totalAmount", label: "Total Bill", format: "currency", accent: "emerald" },
      { key: "perPerson", label: "Per Person", format: "currency", accent: "blue" },
    ],
    calculate: (n) => {
      const { billAmount, tipPercent, people } = n;
      if (billAmount < 0) return { error: "Bill amount cannot be negative." };
      if (tipPercent < 0) return { error: "Tip percentage cannot be negative." };
      if (people <= 0) return { error: "People must be greater than zero." };
      const tipAmount = billAmount * (tipPercent / 100);
      const totalAmount = billAmount + tipAmount;
      const perPerson = totalAmount / people;
      return { values: { tipAmount, totalAmount, perPerson }, insight: `Each person pays about ${perPerson.toFixed(2)} with ${tipPercent}% tip.` };
    },
    formulas: [{ expression: "Tip = Bill x Tip %", explanation: "Standard gratuity amount." }],
    useCases: [{ title: "Restaurant checks", description: "Quickly split and round group bills." }],
    tips: DEFAULT_TIPS,
    quickExamples: ["100 bill + 20% tip -> total 120", "Split total among group members", "Adjust tip percentage for service quality"],
  },
  "salary-calculator": {
    title: "Salary Calculator",
    description: "Convert annual salary to monthly, biweekly, weekly, and hourly equivalents.",
    metaDescription: "Free salary calculator. Convert annual pay to monthly, weekly, and hourly income estimates.",
    primaryKeyword: "salary calculator",
    intro: "This calculator converts annual compensation into common pay periods for budgeting.",
    inputs: [
      { type: "number", key: "annualSalary", label: "Annual Salary", placeholder: "72000" },
      { type: "number", key: "hoursPerWeek", label: "Hours per Week", placeholder: "40" },
      { type: "number", key: "weeksPerYear", label: "Weeks per Year", placeholder: "52" },
    ],
    outputs: [
      { key: "monthly", label: "Monthly Pay", format: "currency", accent: "green" },
      { key: "biweekly", label: "Biweekly Pay", format: "currency", accent: "emerald" },
      { key: "weekly", label: "Weekly Pay", format: "currency", accent: "blue" },
      { key: "hourly", label: "Hourly Equivalent", format: "currency", accent: "purple" },
    ],
    calculate: (n) => {
      const { annualSalary, hoursPerWeek, weeksPerYear } = n;
      if (annualSalary < 0) return { error: "Annual salary cannot be negative." };
      if (hoursPerWeek <= 0 || weeksPerYear <= 0) return { error: "Hours and weeks must be greater than zero." };
      const monthly = annualSalary / 12;
      const biweekly = annualSalary / 26;
      const weekly = annualSalary / weeksPerYear;
      const hourly = annualSalary / (hoursPerWeek * weeksPerYear);
      return { values: { monthly, biweekly, weekly, hourly }, insight: `Equivalent hourly rate is ${hourly.toFixed(2)}.` };
    },
    formulas: [{ expression: "Hourly = Annual / (Hours per Week x Weeks per Year)", explanation: "Annual pay converted to hourly equivalent." }],
    useCases: [{ title: "Offer comparison", description: "Compare compensation formats consistently." }],
    tips: DEFAULT_TIPS,
    quickExamples: ["72k annual -> 6k monthly", "Biweekly divides annual by 26", "Hourly estimate depends on work schedule"],
  },
  "tax-calculator": {
    title: "Tax Calculator",
    description: "Estimate tax amount and net income from taxable income and tax rate.",
    metaDescription: "Free tax calculator. Estimate tax owed and after-tax income from your taxable amount.",
    primaryKeyword: "tax calculator",
    intro: "Use this simple tax estimator for quick planning with an effective tax rate.",
    inputs: [
      { type: "number", key: "taxableIncome", label: "Taxable Income", placeholder: "85000" },
      { type: "number", key: "taxRate", label: "Effective Tax Rate (%)", placeholder: "22" },
    ],
    outputs: [
      { key: "taxOwed", label: "Tax Owed", format: "currency", accent: "green" },
      { key: "afterTaxIncome", label: "After-Tax Income", format: "currency", accent: "emerald" },
      { key: "taxShare", label: "Tax Share %", format: "percent", accent: "blue" },
    ],
    calculate: (n) => {
      const { taxableIncome, taxRate } = n;
      if (taxableIncome < 0) return { error: "Taxable income cannot be negative." };
      if (taxRate < 0 || taxRate > 100) return { error: "Tax rate must be between 0 and 100." };
      const taxOwed = taxableIncome * (taxRate / 100);
      const afterTaxIncome = taxableIncome - taxOwed;
      const taxShare = taxableIncome === 0 ? 0 : (taxOwed / taxableIncome) * 100;
      return { values: { taxOwed, afterTaxIncome, taxShare }, insight: `Estimated tax is ${taxOwed.toFixed(2)} at ${taxRate}% effective rate.` };
    },
    formulas: [{ expression: "Tax = Taxable Income x Tax Rate", explanation: "Flat effective-rate estimate." }],
    useCases: [{ title: "Planning", description: "Estimate net income for budgeting or savings targets." }],
    tips: DEFAULT_TIPS,
    quickExamples: ["85k at 22% -> 18.7k tax estimate", "Use effective rate for best quick estimate", "Jurisdiction rules may differ from this simple model"],
  },
  "mortgage-payment-calculator": {
    title: "Mortgage Payment Calculator",
    description: "Estimate monthly mortgage payment from principal, APR, and term.",
    metaDescription: "Free mortgage payment calculator. Calculate monthly principal-and-interest payments quickly.",
    primaryKeyword: "mortgage payment calculator",
    intro: "This mortgage calculator estimates fixed monthly principal-and-interest payments.",
    inputs: [
      { type: "number", key: "loanAmount", label: "Loan Amount", placeholder: "320000" },
      { type: "number", key: "annualRate", label: "Annual Interest Rate (%)", placeholder: "6.25" },
      { type: "number", key: "years", label: "Loan Term (Years)", placeholder: "30" },
    ],
    outputs: [
      { key: "payment", label: "Monthly Payment", format: "currency", accent: "green" },
      { key: "totalInterest", label: "Total Interest", format: "currency", accent: "emerald" },
      { key: "totalPaid", label: "Total Paid", format: "currency", accent: "blue" },
    ],
    calculate: (n) => {
      const { loanAmount, annualRate, years } = n;
      if (loanAmount <= 0) return { error: "Loan amount must be greater than zero." };
      if (years <= 0) return { error: "Term must be greater than zero." };
      const months = years * 12;
      const r = annualRate / 100 / 12;
      const payment = Math.abs(r) < 1e-12 ? loanAmount / months : (loanAmount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      const totalPaid = payment * months;
      const totalInterest = totalPaid - loanAmount;
      return { values: { payment, totalInterest, totalPaid }, insight: `Estimated monthly payment is ${payment.toFixed(2)}.` };
    },
    formulas: [{ expression: "Payment = P x r x (1+r)^n / ((1+r)^n - 1)", explanation: "Fixed-rate amortizing loan formula." }],
    useCases: [{ title: "Home affordability", description: "Compare payment impact from rate and term changes." }],
    tips: DEFAULT_TIPS,
    quickExamples: ["Lower rate reduces both payment and total interest", "Shorter term raises payment but lowers interest", "Excludes taxes/insurance/HOA"],
  },
  "inflation-calculator": {
    title: "Inflation Calculator",
    description: "Estimate future value after inflation and purchasing-power decline.",
    metaDescription: "Free inflation calculator. Estimate future prices and purchasing power at a chosen inflation rate.",
    primaryKeyword: "inflation calculator",
    intro: "Inflation erodes purchasing power over time; this tool projects that effect.",
    inputs: [
      { type: "number", key: "currentAmount", label: "Current Amount", placeholder: "1000" },
      { type: "number", key: "inflationRate", label: "Annual Inflation Rate (%)", placeholder: "3.5" },
      { type: "number", key: "years", label: "Years", placeholder: "10" },
    ],
    outputs: [
      { key: "futureCost", label: "Future Cost", format: "currency", accent: "green" },
      { key: "purchasingPower", label: "Future Purchasing Power", format: "currency", accent: "emerald" },
      { key: "lossPercent", label: "Purchasing Power Loss %", format: "percent", accent: "blue" },
    ],
    calculate: (n) => {
      const { currentAmount, inflationRate, years } = n;
      if (currentAmount < 0) return { error: "Current amount cannot be negative." };
      if (years < 0) return { error: "Years cannot be negative." };
      const f = Math.pow(1 + inflationRate / 100, years);
      const futureCost = currentAmount * f;
      const purchasingPower = f === 0 ? 0 : currentAmount / f;
      const lossPercent = currentAmount === 0 ? 0 : ((currentAmount - purchasingPower) / currentAmount) * 100;
      return { values: { futureCost, purchasingPower, lossPercent }, insight: `At this rate, ${currentAmount.toFixed(2)} costs about ${futureCost.toFixed(2)} in ${years} years.` };
    },
    formulas: [{ expression: "Future cost = Current x (1 + inflation)^years", explanation: "Compounded inflation estimate." }],
    useCases: [{ title: "Long-term planning", description: "Set savings goals that account for inflation." }],
    tips: DEFAULT_TIPS,
    quickExamples: ["3% inflation doubles prices in about 24 years", "Higher inflation reduces future purchasing power faster", "Use scenario ranges for conservative planning"],
  },
  "retirement-calculator": {
    title: "Retirement Calculator",
    description: "Project retirement savings growth with contributions and expected return.",
    metaDescription: "Free retirement calculator. Estimate retirement balance from current savings, contributions, and return assumptions.",
    primaryKeyword: "retirement calculator",
    intro: "Model long-term compounding to estimate your retirement portfolio at target age.",
    inputs: [
      { type: "number", key: "currentSavings", label: "Current Savings", placeholder: "50000" },
      { type: "number", key: "annualContribution", label: "Annual Contribution", placeholder: "12000" },
      { type: "number", key: "annualReturn", label: "Expected Annual Return (%)", placeholder: "7" },
      { type: "number", key: "yearsToRetirement", label: "Years to Retirement", placeholder: "25" },
    ],
    outputs: [
      { key: "projectedBalance", label: "Projected Balance", format: "currency", accent: "green" },
      { key: "totalContributed", label: "Total Contributed", format: "currency", accent: "emerald" },
      { key: "growth", label: "Growth from Returns", format: "currency", accent: "blue" },
    ],
    calculate: (n) => {
      const { currentSavings, annualContribution, annualReturn, yearsToRetirement } = n;
      if (yearsToRetirement <= 0) return { error: "Years to retirement must be greater than zero." };
      const r = annualReturn / 100;
      const projectedBalance = Math.abs(r) < 1e-12
        ? currentSavings + annualContribution * yearsToRetirement
        : currentSavings * Math.pow(1 + r, yearsToRetirement) + annualContribution * ((Math.pow(1 + r, yearsToRetirement) - 1) / r);
      const totalContributed = currentSavings + annualContribution * yearsToRetirement;
      const growth = projectedBalance - totalContributed;
      return { values: { projectedBalance, totalContributed, growth }, insight: `Projected retirement balance is ${projectedBalance.toFixed(2)}.` };
    },
    formulas: [{ expression: "FV = P(1+r)^n + C[((1+r)^n - 1)/r]", explanation: "Lump sum plus recurring annual contribution model." }],
    useCases: [{ title: "Retirement readiness", description: "Check if contributions track toward your target." }],
    tips: DEFAULT_TIPS,
    quickExamples: ["More years usually matter more than tiny rate changes", "Contribution consistency improves outcomes", "Use conservative returns for planning"],
  },
  "car-loan-calculator": {
    title: "Car Loan Calculator",
    description: "Estimate monthly auto loan payment, total paid, and total interest.",
    metaDescription: "Free car loan calculator. Compute monthly payment and total interest for auto financing.",
    primaryKeyword: "car loan calculator",
    intro: "Use this auto loan calculator to estimate payment before visiting a dealership.",
    inputs: [
      { type: "number", key: "loanAmount", label: "Loan Amount", placeholder: "28000" },
      { type: "number", key: "annualRate", label: "APR (%)", placeholder: "7.2" },
      { type: "number", key: "months", label: "Loan Term (Months)", placeholder: "60" },
    ],
    outputs: [
      { key: "monthlyPayment", label: "Monthly Payment", format: "currency", accent: "green" },
      { key: "totalInterest", label: "Total Interest", format: "currency", accent: "emerald" },
      { key: "totalPaid", label: "Total Paid", format: "currency", accent: "blue" },
    ],
    calculate: (n) => {
      const { loanAmount, annualRate, months } = n;
      if (loanAmount <= 0) return { error: "Loan amount must be greater than zero." };
      if (months <= 0) return { error: "Loan term must be greater than zero." };
      const r = annualRate / 100 / 12;
      const monthlyPayment = Math.abs(r) < 1e-12 ? loanAmount / months : (loanAmount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      const totalPaid = monthlyPayment * months;
      const totalInterest = totalPaid - loanAmount;
      return { values: { monthlyPayment, totalInterest, totalPaid }, insight: `Estimated monthly payment is ${monthlyPayment.toFixed(2)}.` };
    },
    formulas: [{ expression: "Auto payment uses the same amortizing formula as EMI.", explanation: "Fixed payment each month across term." }],
    useCases: [{ title: "Vehicle affordability", description: "Compare term lengths and APR scenarios." }],
    tips: DEFAULT_TIPS,
    quickExamples: ["Longer term lowers payment but increases interest", "Higher APR raises both payment and total paid", "Add taxes/fees separately for full out-the-door cost"],
  },
  "down-payment-calculator": {
    title: "Down Payment Calculator",
    description: "Calculate down payment amount, financed balance, and cash needed at purchase.",
    metaDescription: "Free down payment calculator. Estimate required upfront payment and remaining financed amount.",
    primaryKeyword: "down payment calculator",
    intro: "Convert target down-payment percentages into actual dollars and financing amounts.",
    inputs: [
      { type: "number", key: "purchasePrice", label: "Purchase Price", placeholder: "420000" },
      { type: "number", key: "downPercent", label: "Down Payment (%)", placeholder: "20" },
      { type: "number", key: "closingCosts", label: "Closing Costs (Optional)", placeholder: "6000", defaultValue: "0" },
    ],
    outputs: [
      { key: "downAmount", label: "Down Payment Amount", format: "currency", accent: "green" },
      { key: "financedAmount", label: "Financed Amount", format: "currency", accent: "emerald" },
      { key: "cashToClose", label: "Cash to Close", format: "currency", accent: "blue" },
    ],
    calculate: (n) => {
      const { purchasePrice, downPercent, closingCosts } = n;
      if (purchasePrice <= 0) return { error: "Purchase price must be greater than zero." };
      if (downPercent < 0 || downPercent > 100) return { error: "Down payment percent must be between 0 and 100." };
      if (closingCosts < 0) return { error: "Closing costs cannot be negative." };
      const downAmount = purchasePrice * (downPercent / 100);
      const financedAmount = purchasePrice - downAmount;
      const cashToClose = downAmount + closingCosts;
      return { values: { downAmount, financedAmount, cashToClose }, insight: `You need ${cashToClose.toFixed(2)} cash at close under these assumptions.` };
    },
    formulas: [{ expression: "Down payment = Price x Down %", explanation: "Upfront equity contribution." }],
    useCases: [{ title: "Home and auto purchases", description: "Compare financing needs at different down-payment levels." }],
    tips: DEFAULT_TIPS,
    quickExamples: ["20% down on 420k -> 84k down", "Higher down payment reduces financed principal", "Include closing costs for realistic cash target"],
  },
  "amortization-calculator": {
    title: "Amortization Calculator",
    description: "Estimate payment split between principal and interest with remaining balance over time.",
    metaDescription: "Free amortization calculator. View monthly payment and principal/interest breakdown for loans.",
    primaryKeyword: "amortization calculator",
    intro: "This calculator shows payment amount and first/last payment composition for fixed-rate loans.",
    inputs: [
      { type: "number", key: "principal", label: "Loan Principal", placeholder: "250000" },
      { type: "number", key: "annualRate", label: "APR (%)", placeholder: "6" },
      { type: "number", key: "years", label: "Term (Years)", placeholder: "30" },
    ],
    outputs: [
      { key: "payment", label: "Monthly Payment", format: "currency", accent: "green" },
      { key: "firstMonthInterest", label: "First Month Interest", format: "currency", accent: "emerald" },
      { key: "firstMonthPrincipal", label: "First Month Principal", format: "currency", accent: "blue" },
      { key: "totalInterest", label: "Total Interest", format: "currency", accent: "purple" },
    ],
    calculate: (n) => {
      const { principal, annualRate, years } = n;
      if (principal <= 0) return { error: "Principal must be greater than zero." };
      if (years <= 0) return { error: "Years must be greater than zero." };
      const months = years * 12;
      const r = annualRate / 100 / 12;
      const payment = Math.abs(r) < 1e-12 ? principal / months : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      const firstMonthInterest = principal * r;
      const firstMonthPrincipal = payment - firstMonthInterest;
      const totalInterest = payment * months - principal;
      return { values: { payment, firstMonthInterest, firstMonthPrincipal, totalInterest }, insight: `First payment applies ${firstMonthPrincipal.toFixed(2)} to principal.` };
    },
    formulas: [{ expression: "Interest first month = Principal x monthly rate", explanation: "Interest starts highest and declines over time." }],
    useCases: [{ title: "Loan comparison", description: "Understand long-term interest cost before borrowing." }],
    tips: DEFAULT_TIPS,
    quickExamples: ["Early payments are interest-heavy", "Shorter terms shift more payment to principal", "Extra payments reduce total interest"],
  },
  "stock-profit-calculator": {
    title: "Stock Profit Calculator",
    description: "Calculate stock trade profit/loss with fees and return percentage.",
    metaDescription: "Free stock profit calculator. Compute gain or loss from buy and sell price, shares, and fees.",
    primaryKeyword: "stock profit calculator",
    intro: "Estimate realized profit after purchase, sale, and trading fees.",
    inputs: [
      { type: "number", key: "buyPrice", label: "Buy Price per Share", placeholder: "42" },
      { type: "number", key: "sellPrice", label: "Sell Price per Share", placeholder: "49" },
      { type: "number", key: "shares", label: "Number of Shares", placeholder: "120" },
      { type: "number", key: "fees", label: "Total Fees", placeholder: "15", defaultValue: "0" },
    ],
    outputs: [
      { key: "netProfit", label: "Net Profit/Loss", format: "currency", accent: "green" },
      { key: "costBasis", label: "Cost Basis", format: "currency", accent: "emerald" },
      { key: "returnPct", label: "Return %", format: "percent", accent: "blue" },
    ],
    calculate: (n) => {
      const { buyPrice, sellPrice, shares, fees } = n;
      if (buyPrice < 0 || sellPrice < 0 || shares <= 0 || fees < 0) return { error: "Enter valid non-negative prices, fees, and shares > 0." };
      const costBasis = buyPrice * shares + fees;
      const proceeds = sellPrice * shares - fees;
      const netProfit = proceeds - costBasis;
      const returnPct = costBasis === 0 ? 0 : (netProfit / costBasis) * 100;
      return { values: { netProfit, costBasis, returnPct }, insight: `Net ${netProfit >= 0 ? "profit" : "loss"} is ${Math.abs(netProfit).toFixed(2)}.` };
    },
    formulas: [{ expression: "Net Profit = (Sell x Shares - Fees) - (Buy x Shares + Fees)", explanation: "Round-trip trade P/L with simple fee treatment." }],
    useCases: [{ title: "Trade review", description: "Quickly evaluate completed or planned exits." }],
    tips: DEFAULT_TIPS,
    quickExamples: ["Include all fees for realistic net results", "Small price moves can still be negative after costs", "Return % depends on full cost basis"],
  },
  "dividend-calculator": {
    title: "Dividend Calculator",
    description: "Estimate annual dividend income and yield from shares and payout rate.",
    metaDescription: "Free dividend calculator. Compute yearly dividend income and dividend yield from holdings.",
    primaryKeyword: "dividend calculator",
    intro: "Estimate passive income from dividend-paying stocks using annualized payout assumptions.",
    inputs: [
      { type: "number", key: "shares", label: "Shares Owned", placeholder: "300" },
      { type: "number", key: "dividendPerShare", label: "Annual Dividend per Share", placeholder: "1.6" },
      { type: "number", key: "sharePrice", label: "Current Share Price", placeholder: "38" },
    ],
    outputs: [
      { key: "annualIncome", label: "Annual Dividend Income", format: "currency", accent: "green" },
      { key: "portfolioValue", label: "Position Value", format: "currency", accent: "emerald" },
      { key: "yieldPct", label: "Dividend Yield %", format: "percent", accent: "blue" },
    ],
    calculate: (n) => {
      const { shares, dividendPerShare, sharePrice } = n;
      if (shares < 0 || dividendPerShare < 0 || sharePrice < 0) return { error: "Inputs cannot be negative." };
      const annualIncome = shares * dividendPerShare;
      const portfolioValue = shares * sharePrice;
      const yieldPct = sharePrice === 0 ? 0 : (dividendPerShare / sharePrice) * 100;
      return { values: { annualIncome, portfolioValue, yieldPct }, insight: `Estimated annual dividend income is ${annualIncome.toFixed(2)}.` };
    },
    formulas: [{ expression: "Annual income = Shares x Dividend per Share", explanation: "Yearly dividend cash flow estimate." }],
    useCases: [{ title: "Income planning", description: "Project dividend cash flow under different holding sizes." }],
    tips: DEFAULT_TIPS,
    quickExamples: ["Yield = annual dividend per share / share price", "Higher yield may imply higher risk", "Real payouts can change over time"],
  },
  "currency-exchange-calculator": {
    title: "Currency Exchange Calculator",
    description: "Convert currency amounts using exchange rate and optional fee spread.",
    metaDescription: "Free currency exchange calculator. Convert an amount between currencies with optional fee adjustment.",
    primaryKeyword: "currency exchange calculator",
    intro: "Convert source amount to target currency and account for fees or spread if needed.",
    inputs: [
      { type: "number", key: "amount", label: "Source Amount", placeholder: "1000" },
      { type: "number", key: "rate", label: "Exchange Rate", placeholder: "0.92" },
      { type: "number", key: "feePercent", label: "Conversion Fee (%)", placeholder: "1.5", defaultValue: "0" },
    ],
    outputs: [
      { key: "grossConverted", label: "Gross Converted", format: "currency", accent: "green" },
      { key: "feeAmount", label: "Fee Amount", format: "currency", accent: "emerald" },
      { key: "netConverted", label: "Net Converted", format: "currency", accent: "blue" },
    ],
    calculate: (n) => {
      const { amount, rate, feePercent } = n;
      if (amount < 0 || rate < 0 || feePercent < 0) return { error: "Inputs cannot be negative." };
      const grossConverted = amount * rate;
      const feeAmount = grossConverted * (feePercent / 100);
      const netConverted = grossConverted - feeAmount;
      return { values: { grossConverted, feeAmount, netConverted }, insight: `Net converted amount is ${netConverted.toFixed(2)} after fees.` };
    },
    formulas: [{ expression: "Net = Amount x Rate x (1 - Fee/100)", explanation: "Simple conversion with percentage fee/spread." }],
    useCases: [{ title: "Travel and transfers", description: "Estimate received amount before exchanging funds." }],
    tips: DEFAULT_TIPS,
    quickExamples: ["1,000 at 0.92 rate -> 920 gross", "Fees reduce final received amount", "Live rates can change throughout the day"],
  },
};

function buildInitialValues(inputs: InputField[]): Record<string, string> {
  return inputs.reduce<Record<string, string>>((acc, input) => {
    acc[input.key] = input.defaultValue ?? "";
    return acc;
  }, {});
}

function formatValue(value: number, format: OutputField["format"]): string {
  if (format === "currency") return value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (format === "percent") return `${value.toLocaleString("en-US", { maximumFractionDigits: 4 })}%`;
  return value.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

function accentClass(accent: OutputField["accent"]): string {
  switch (accent) {
    case "green":
      return "text-green-600 dark:text-green-400";
    case "emerald":
      return "text-emerald-600 dark:text-emerald-400";
    case "blue":
      return "text-blue-600 dark:text-blue-400";
    case "purple":
      return "text-purple-600 dark:text-purple-400";
    default:
      return "";
  }
}

export default function FinanceToolSuite() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [location, setLocation] = useLocation();
  const normalizedSlug = slug.startsWith("online-") ? slug.replace(/^online-/, "") : slug;
  const suiteConfig = FINANCE_TOOLS[normalizedSlug];
  const tool = getToolBySlug(slug);
  const config = suiteConfig;
  const isFinanceTool = Boolean(tool && tool.category === "Finance & Cost");
  const isSupported = Boolean(config && isFinanceTool);
  const destination = isFinanceTool && tool ? getCanonicalToolPath(tool.slug) : undefined;

  const [values, setValues] = useState<Record<string, string>>(() => buildInitialValues(config?.inputs ?? []));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (config) {
      setValues(buildInitialValues(config.inputs));
    }
  }, [slug, config]);

  useEffect(() => {
    if (!destination) return;
    if (location === destination) return;
    setLocation(destination, { replace: true });
  }, [destination, location, setLocation]);

  const result = useMemo<CalcResult>(() => {
    if (!config || !isSupported) return null;
    const numbers: Record<string, number> = {};
    for (const input of config.inputs) {
      if (input.type === "number") {
        const raw = values[input.key];
        if (!raw?.trim()) return null;
        const parsed = Number(raw);
        if (!Number.isFinite(parsed)) return { error: `Invalid value for ${input.label}.` };
        numbers[input.key] = parsed;
      }
    }
    return config.calculate(numbers, values);
  }, [values, config, isSupported]);

  if (!config || !tool || !isSupported) {
    return <NotFound />;
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canonicalPath = getCanonicalToolPath(tool.slug);
  const pageHeading = /^online\b/i.test(config.title) ? config.title : `Online ${config.title}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: pageHeading,
    description: config.metaDescription,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: `https://usonlinetools.com${canonicalPath}`,
  };

  const faq = [
    { q: `How does this ${config.title.toLowerCase()} work?`, a: `It applies standard formulas to your inputs and calculates outputs instantly in-browser.` },
    { q: "Can I use decimals and large values?", a: "Yes. Decimal and large values are supported. Keep units and periods consistent." },
    { q: "Is this tool free and private?", a: "Yes. It is free and runs in your browser without signup." },
    { q: "Should I rely on this for formal advice?", a: "Use it for estimation and planning. Validate critical decisions with professionals." },
  ];

  const howTo = [
    `Enter required values for ${config.title.toLowerCase()} in the calculator fields.`,
    "Set optional modes or values to match your scenario.",
    "Review result cards and test multiple scenarios before deciding.",
  ];

  return (
    <Layout>
      <SEO title={pageHeading} description={config.metaDescription} canonical={`https://usonlinetools.com${canonicalPath}`} schema={schema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-green-500" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance &amp; Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-green-500" strokeWidth={3} />
          <span className="text-foreground">{pageHeading}</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-green-500/15 bg-gradient-to-br from-green-500/5 via-card to-emerald-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" />
            Finance &amp; Cost
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">{pageHeading}</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">{config.description}</p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs px-3 py-1.5 rounded-full border border-green-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs px-3 py-1.5 rounded-full border border-teal-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Finance &amp; Cost | Last updated: March 2026</p>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-green-500/20 shadow-lg shadow-green-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-green-500 to-emerald-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="tool-calc-card" style={{ "--calc-hue": 145 } as CSSProperties}>
                    <h2 className="text-xl font-bold text-foreground mb-4">{config.title} Tool</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {config.inputs.map((input) => (
                        <label key={input.key} className="space-y-1.5">
                          <span className="text-sm font-semibold text-muted-foreground">{input.label}</span>
                          {input.type === "number" ? (
                            <input type="number" placeholder={input.placeholder} className="tool-calc-input w-full" value={values[input.key] ?? ""} onChange={(e) => setValues((prev) => ({ ...prev, [input.key]: e.target.value }))} />
                          ) : (
                            <select className="tool-calc-input w-full" value={values[input.key] ?? input.defaultValue} onChange={(e) => setValues((prev) => ({ ...prev, [input.key]: e.target.value }))}>
                              {input.options.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                          )}
                        </label>
                      ))}
                    </div>

                    {result && "values" in result && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {config.outputs.map((output) => (
                          <div key={output.key} className="tool-calc-result">
                            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{output.label}</div>
                            <div className={`text-base font-black ${accentClass(output.accent)}`}>
                              {formatValue(result.values[output.key] ?? 0, output.format)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {result && "error" in result && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">{result.error}</p>
                        </div>
                      </motion.div>
                    )}

                    {result && "values" in result && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">{result.insight}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the {config.title}</h2>
              <ol className="space-y-5">
                {howTo.map((step, idx) => (
                  <li key={step} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">{idx + 1}</div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Result Interpretation</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"><p className="font-bold text-foreground mb-1">Use the primary result first</p><p className="text-sm text-muted-foreground">Start from the top metric, then use supporting ratios for context.</p></div>
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20"><p className="font-bold text-foreground mb-1">Compare scenarios</p><p className="text-sm text-muted-foreground">Small changes in rates or costs can significantly impact outcomes.</p></div>
                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20"><p className="font-bold text-foreground mb-1">Validate assumptions</p><p className="text-sm text-muted-foreground">Results are only as reliable as the values entered.</p></div>
              </div>
            </section>

            <SeoRichContent toolName={config.title} primaryKeyword={config.primaryKeyword} intro={config.intro} formulas={config.formulas} useCases={config.useCases} tips={config.tips} />

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <ul className="space-y-2 text-muted-foreground">
                {config.quickExamples.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This {config.title}?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Consistent structure.</strong> Calculator, formulas, examples, and FAQ in one page.</p>
                <p><strong className="text-foreground">SEO-focused content.</strong> Built with intent-matched headings and explanatory copy for discoverability.</p>
                <p><strong className="text-foreground">Fast and private.</strong> Runs locally in browser with no signup requirement.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faq.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Finance Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Explore all finance and pricing tools with the same structure and SEO depth.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
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
                  {RELATED_TOOLS.filter((item) => item.slug !== normalizedSlug).map((item) => (
                    <Link key={item.slug} href={getCanonicalToolPath(item.slug)} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${item.color} 70% 55%), hsl(${item.color} 75% 42%))` }}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{item.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-green-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share this calculator with your team.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map((label) => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-green-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-green-500/40 flex-shrink-0" />
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
