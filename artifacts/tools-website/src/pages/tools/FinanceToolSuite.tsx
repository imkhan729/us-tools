import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { SeoRichContent } from "@/components/SeoRichContent";
import { Link, useParams } from "wouter";
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
import ToolPlaceholder from "../ToolPlaceholder";
import { getToolBySlug } from "@/data/tools";

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
  const normalizedSlug = slug.startsWith("online-") ? slug.replace(/^online-/, "") : slug;
  const config = FINANCE_TOOLS[normalizedSlug];
  const tool = getToolBySlug(slug);
  const isSupported = Boolean(config && tool && tool.category === "Finance & Cost");

  const [values, setValues] = useState<Record<string, string>>(() => buildInitialValues(config?.inputs ?? []));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (config) {
      setValues(buildInitialValues(config.inputs));
    }
  }, [slug, config]);

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
    return <ToolPlaceholder />;
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: config.title,
    description: config.metaDescription,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: `https://usonlinetools.com/finance/${slug}`,
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
      <SEO title={config.title} description={config.metaDescription} canonical={`https://usonlinetools.com/finance/${slug}`} schema={schema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-green-500" strokeWidth={3} />
          <Link href="/category/finance" className="text-muted-foreground hover:text-foreground transition-colors">Finance &amp; Cost</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-green-500" strokeWidth={3} />
          <span className="text-foreground">{config.title}</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-green-500/15 bg-gradient-to-br from-green-500/5 via-card to-emerald-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" />
            Finance &amp; Cost
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">{config.title}</h1>
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
                  {RELATED_TOOLS.filter((item) => item.slug !== slug).map((item) => (
                    <Link key={item.slug} href={`/tools/${item.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
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
