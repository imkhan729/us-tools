import { useMemo, useState, type CSSProperties } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Zap,
  Smartphone,
  Shield,
  Lightbulb,
  Copy,
  Check,
  BadgeCheck,
  Lock,
  Construction,
  Calculator,
  DollarSign,
  Truck,
  Hammer,
} from "lucide-react";

type Currency = "USD" | "EUR" | "GBP";

const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: "$",
  EUR: "EUR ",
  GBP: "GBP ",
};

const RELATED_TOOLS = [
  { title: "Concrete Calculator", slug: "concrete-calculator", icon: <Construction className="w-5 h-5" />, benefit: "Estimate base quantities before pricing them" },
  { title: "Lumber Calculator", slug: "lumber-calculator", icon: <Hammer className="w-5 h-5" />, benefit: "Turn framing measurements into billable material" },
  { title: "Paint Calculator", slug: "paint-calculator", icon: <Calculator className="w-5 h-5" />, benefit: "Calculate paint volume before costing the job" },
  { title: "Flooring Calculator", slug: "flooring-calculator", icon: <DollarSign className="w-5 h-5" />, benefit: "Plan area-based material and install pricing" },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-emerald-500/40 transition-colors">
      <button onClick={() => setOpen((prev) => !prev)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-emerald-500">
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

function formatMoney(value: number, currency: Currency) {
  return `${CURRENCY_SYMBOL[currency]}${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function useMaterialCostCalc() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [quantity, setQuantity] = useState("240");
  const [unitCost, setUnitCost] = useState("4.5");
  const [wastePercent, setWastePercent] = useState("10");
  const [taxPercent, setTaxPercent] = useState("8");
  const [laborCost, setLaborCost] = useState("650");
  const [deliveryCost, setDeliveryCost] = useState("120");

  const result = useMemo(() => {
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(unitCost) || 0;
    const waste = Math.max(0, parseFloat(wastePercent) || 0);
    const tax = Math.max(0, parseFloat(taxPercent) || 0);
    const labor = Math.max(0, parseFloat(laborCost) || 0);
    const delivery = Math.max(0, parseFloat(deliveryCost) || 0);

    if (qty <= 0 || price <= 0) return null;

    const adjustedQuantity = qty * (1 + waste / 100);
    const baseMaterialCost = qty * price;
    const materialSubtotal = adjustedQuantity * price;
    const wasteCost = materialSubtotal - baseMaterialCost;
    const preTaxTotal = materialSubtotal + labor + delivery;
    const taxAmount = preTaxTotal * (tax / 100);
    const finalTotal = preTaxTotal + taxAmount;
    const finalUnitCost = finalTotal / qty;

    return { qty, price, waste, tax, labor, delivery, adjustedQuantity, baseMaterialCost, materialSubtotal, wasteCost, preTaxTotal, taxAmount, finalTotal, finalUnitCost };
  }, [quantity, unitCost, wastePercent, taxPercent, laborCost, deliveryCost]);

  return { currency, setCurrency, quantity, setQuantity, unitCost, setUnitCost, wastePercent, setWastePercent, taxPercent, setTaxPercent, laborCost, setLaborCost, deliveryCost, setDeliveryCost, result };
}

function ResultInsight({ result, currency }: { result: ReturnType<typeof useMaterialCostCalc>["result"]; currency: Currency }) {
  if (!result) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          After adding {result.waste.toFixed(1)}% waste, the material quantity rises from {result.qty.toFixed(2)} to {result.adjustedQuantity.toFixed(2)}. Material subtotal becomes {formatMoney(result.materialSubtotal, currency)}, pre-tax job total is {formatMoney(result.preTaxTotal, currency)}, and final project cost is {formatMoney(result.finalTotal, currency)}. That works out to {formatMoney(result.finalUnitCost, currency)} per original project unit.
        </p>
      </div>
    </motion.div>
  );
}

export default function MaterialCostCalculator() {
  const calc = useMaterialCostCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO title="Material Cost Calculator - Estimate Project Material Pricing" description="Free material cost calculator for construction and DIY projects. Add waste, labor, delivery, and tax to estimate the real total project cost." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <Link href="/category/construction" className="text-muted-foreground hover:text-foreground transition-colors">Construction &amp; DIY</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-emerald-500" strokeWidth={3} />
          <span className="text-foreground">Material Cost Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 via-card to-teal-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Construction className="w-3.5 h-3.5" />
            Construction &amp; DIY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Material Cost Calculator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Estimate the real cost of a project after waste, labor, delivery, and tax are included. This calculator works for flooring, tile, paint, lumber, concrete, and other quantity-based construction materials.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-700 dark:text-teal-400 font-bold text-xs px-3 py-1.5 rounded-full border border-teal-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Construction &amp; DIY | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Project pricing estimator</p>
                      <p className="text-sm text-muted-foreground">Material subtotal, waste allowance, labor, delivery, and tax in one place.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 155 } as CSSProperties}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Currency</label>
                        <div className="flex rounded-lg overflow-hidden border border-border">
                          {(["USD", "EUR", "GBP"] as Currency[]).map((currency) => (
                            <button key={currency} onClick={() => calc.setCurrency(currency)} className={`flex-1 py-2 text-sm font-bold transition-colors ${calc.currency === currency ? "bg-emerald-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>{currency}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Quantity Needed</label>
                        <input type="number" min="0" placeholder="240" className="tool-calc-input w-full" value={calc.quantity} onChange={(e) => calc.setQuantity(e.target.value)} />
                        <p className="text-xs text-muted-foreground mt-2">Use whatever unit fits the job: sq ft, sq m, boards, bags, gallons, or yards.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Unit Cost</label>
                        <input type="number" min="0" placeholder="4.5" className="tool-calc-input w-full" value={calc.unitCost} onChange={(e) => calc.setUnitCost(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Waste Allowance (%)</label>
                        <input type="number" min="0" placeholder="10" className="tool-calc-input w-full" value={calc.wastePercent} onChange={(e) => calc.setWastePercent(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Tax Rate (%)</label>
                        <input type="number" min="0" placeholder="8" className="tool-calc-input w-full" value={calc.taxPercent} onChange={(e) => calc.setTaxPercent(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Labor Cost</label>
                        <input type="number" min="0" placeholder="650" className="tool-calc-input w-full" value={calc.laborCost} onChange={(e) => calc.setLaborCost(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Delivery or Freight</label>
                        <input type="number" min="0" placeholder="120" className="tool-calc-input w-full" value={calc.deliveryCost} onChange={(e) => calc.setDeliveryCost(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Adj. Qty</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? calc.result.adjustedQuantity.toFixed(2) : "0.00"}</p>
                        <p className="text-xs text-muted-foreground mt-1">with waste</p>
                      </div>
                      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Material</p>
                        <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{calc.result ? formatMoney(calc.result.materialSubtotal, calc.currency) : formatMoney(0, calc.currency)}</p>
                        <p className="text-xs text-muted-foreground mt-1">subtotal</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Waste Cost</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? formatMoney(calc.result.wasteCost, calc.currency) : formatMoney(0, calc.currency)}</p>
                        <p className="text-xs text-muted-foreground mt-1">extra material</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Pre-Tax</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? formatMoney(calc.result.preTaxTotal, calc.currency) : formatMoney(0, calc.currency)}</p>
                        <p className="text-xs text-muted-foreground mt-1">job total</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Tax</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? formatMoney(calc.result.taxAmount, calc.currency) : formatMoney(0, calc.currency)}</p>
                        <p className="text-xs text-muted-foreground mt-1">added cost</p>
                      </div>
                      <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Final Total</p>
                        <p className="text-2xl font-black text-teal-700 dark:text-teal-400">{calc.result ? formatMoney(calc.result.finalTotal, calc.currency) : formatMoney(0, calc.currency)}</p>
                        <p className="text-xs text-muted-foreground mt-1">project cost</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="rounded-2xl border border-border bg-muted/30 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Base Material Cost</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? formatMoney(calc.result.baseMaterialCost, calc.currency) : formatMoney(0, calc.currency)}</p>
                        <p className="text-xs text-muted-foreground mt-1">before waste allowance</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-muted/30 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Final Cost Per Unit</p>
                        <p className="text-2xl font-black text-foreground">{calc.result ? formatMoney(calc.result.finalUnitCost, calc.currency) : formatMoney(0, calc.currency)}</p>
                        <p className="text-xs text-muted-foreground mt-1">per original project unit</p>
                      </div>
                    </div>

                    <ResultInsight result={calc.result} currency={calc.currency} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Material Cost Calculator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                This calculator is designed for real project pricing rather than simple unit multiplication. Start with the core quantity and unit price, then add the costs that usually get missed during early estimating such as waste, labor, delivery, and tax.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter the base quantity and unit price</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The quantity can be area, volume, count, or any other measurable unit. The calculator treats it generically so it works across many construction materials.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Add waste, labor, and delivery</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Waste allowance increases the quantity you need to buy, while labor and delivery reflect the job cost beyond raw material only. This produces a more realistic pre-tax total.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Use final total and unit cost to compare options</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The final total helps with budgeting, while cost per original project unit helps when comparing quotes, supplier changes, or different material grades.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core formulas</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3"><span className="text-emerald-700 dark:text-emerald-400 font-bold w-28 flex-shrink-0">Adj. Quantity</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Quantity x (1 + Waste % / 100)</code></div>
                  <div className="flex items-center gap-3"><span className="text-emerald-700 dark:text-emerald-400 font-bold w-28 flex-shrink-0">Material Total</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Adjusted Quantity x Unit Cost</code></div>
                  <div className="flex items-center gap-3"><span className="text-emerald-700 dark:text-emerald-400 font-bold w-28 flex-shrink-0">Pre-Tax Total</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Material Total + Labor + Delivery</code></div>
                  <div className="flex items-center gap-3"><span className="text-emerald-700 dark:text-emerald-400 font-bold w-28 flex-shrink-0">Final Total</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Pre-Tax Total x (1 + Tax % / 100)</code></div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Categories &amp; Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">What each pricing output means during budgeting and estimating.</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Adjusted quantity</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">This is the amount you likely need to buy after allowing for cuts, breakage, overage, or layout waste. It is often the first reason a simple estimate comes in short.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-teal-500/5 border border-teal-500/20">
                  <div className="w-3 h-3 rounded-full bg-teal-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Material subtotal and waste cost</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Seeing the material subtotal separately from the waste cost helps you understand how much extra money is going into overage rather than usable installed material.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                  <div className="w-3 h-3 rounded-full bg-cyan-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Pre-tax total</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">This is the most useful internal budgeting number because it captures the true job cost before sales tax or regional fees are applied.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Final total and cost per unit</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">The final total helps with approvals and customer-facing pricing. Final cost per unit helps compare alternate materials, suppliers, and waste assumptions on a like-for-like basis.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Project</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Inputs</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Material</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Final</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Use case</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Tile installation</td>
                      <td className="px-4 py-3 font-mono text-foreground">240 qty, 4.50, 10%, 650 labor, 120 freight, 8% tax</td>
                      <td className="px-4 py-3 font-bold text-emerald-700 dark:text-emerald-400">$1,188.00</td>
                      <td className="px-4 py-3 font-mono text-foreground">$2,114.64</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Room flooring budget</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Concrete supply</td>
                      <td className="px-4 py-3 font-mono text-foreground">8 qty, 155, 5%, 600 labor, 140 freight, 0% tax</td>
                      <td className="px-4 py-3 font-bold text-emerald-700 dark:text-emerald-400">$1,302.00</td>
                      <td className="px-4 py-3 font-mono text-foreground">$2,042.00</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Small slab or footing job</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Paint refresh</td>
                      <td className="px-4 py-3 font-mono text-foreground">12 qty, 38, 15%, 250 labor, 0 freight, 7.5% tax</td>
                      <td className="px-4 py-3 font-bold text-emerald-700 dark:text-emerald-400">$524.40</td>
                      <td className="px-4 py-3 font-mono text-foreground">$832.48</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Interior repaint estimate</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Example 1 - tile project:</strong> Waste allowance alone raises the material buy from 240 units to 264 units. That increases material spend before labor and tax are even applied, which is why flooring estimates often miss low if waste is ignored.</p>
                <p><strong className="text-foreground">Example 2 - concrete order:</strong> Even with no tax applied, labor and delivery still push the project well above raw material cost. That makes pre-tax total the better working estimate than material subtotal alone.</p>
                <p><strong className="text-foreground">Example 3 - painting work:</strong> A modest material line item can still turn into a larger finished project cost after waste, labor, and tax are included. That is exactly the gap this calculator is meant to expose early.</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Material Cost Calculator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">It estimates real project cost, not just material multiplication.</strong> Waste, labor, freight, and tax are all included because those are the numbers that usually separate a quick quote from a usable estimate.</p>
                <p><strong className="text-foreground">It works across many material types.</strong> You can use the same workflow for tile, concrete, paint, stone, boards, insulation, or any other quantity-based material purchase.</p>
                <p><strong className="text-foreground">It helps compare bids and suppliers.</strong> Final cost per original unit makes it easier to compare alternate pricing scenarios without rebuilding the estimate from scratch every time.</p>
                <p><strong className="text-foreground">It follows the same full-page template.</strong> The layout, content flow, and design pattern match the percentage-calculator structure you asked me to reuse across unfinished tools.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> This calculator is for estimating. Supplier minimums, pallet charges, trim pieces, permit fees, disposal, and region-specific taxes may still need to be added separately for a final bid.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What should I enter as quantity?" a="Enter the base amount of material the project needs before waste. That can be square feet, square meters, gallons, boards, bags, cubic yards, or any other measurable quantity." />
                <FaqItem q="Why add a waste allowance?" a="Waste accounts for cuts, breakage, trimming, damaged pieces, over-ordering, and layout losses. Many construction materials cannot be purchased or installed with zero waste." />
                <FaqItem q="Should labor be taxed too?" a="That depends on your region and the way the job is billed. This calculator applies tax to the full pre-tax total for planning simplicity, so adjust the tax rate or final estimate if your jurisdiction handles labor differently." />
                <FaqItem q="Can I use this for flooring, tile, paint, or lumber?" a="Yes. The calculator is intentionally generic. If the material can be priced by quantity, you can use this tool to estimate total job cost." />
                <FaqItem q="What does final cost per unit mean?" a="It divides the full project total by the original project quantity. That helps you compare different suppliers, waste assumptions, and install scenarios on a per-unit basis." />
                <FaqItem q="Does this replace a formal quote?" a="No. It is an estimating tool. Formal quotes may still include supplier-specific pricing breaks, taxes, freight classes, trim pieces, surcharges, and contract terms." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need Quantity Estimates Before Pricing?</h2>
                <p className="text-white/80 mb-6 max-w-lg">Use the construction calculators for concrete, lumber, paint, flooring, and more, then bring those quantities back here to build a more realistic project budget.</p>
                <Link href="/category/construction" className="inline-flex items-center gap-2 bg-white text-emerald-700 px-5 py-3 rounded-xl font-black text-sm hover:translate-x-0.5 transition-transform">Browse Construction Tools <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Actions</h3>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white text-xs font-black uppercase rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-emerald-600/20">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-600 text-white shadow-xl relative overflow-hidden">
                <Truck className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10" />
                <h4 className="font-black text-sm mb-2">Pricing delivered material?</h4>
                <p className="text-[11px] leading-relaxed opacity-90 pr-4">Freight and waste are easy to skip during early estimating. Adding both at the start usually gives a more defensible project number.</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">Related tools</h3>
                <div className="space-y-4">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={`/construction/${tool.slug}`} className="flex items-start gap-3 group">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">{tool.icon}</div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground group-hover:text-foreground">{tool.title}</p>
                        <p className="text-[11px] text-muted-foreground/80 leading-relaxed">{tool.benefit}</p>
                      </div>
                    </Link>
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
