import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, TrendingUp, DollarSign, BarChart3,
  Zap, CheckCircle2, Shield, Clock, Calculator, Lightbulb,
  BadgeCheck, Star, Plus, Trash2,
} from "lucide-react";

interface ProductRow {
  id: number;
  name: string;
  price: string;
  units: string;
  discount: string;
}

function useRevenueCalc() {
  const [products, setProducts] = useState<ProductRow[]>([
    { id: 1, name: "Product A", price: "", units: "", discount: "0" },
  ]);

  const addProduct = () => {
    setProducts((prev) => [...prev, { id: Date.now(), name: `Product ${String.fromCharCode(64 + prev.length + 1)}`, price: "", units: "", discount: "0" }]);
  };

  const removeProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProduct = (id: number, field: keyof ProductRow, value: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const result = useMemo(() => {
    const rows = products.map((p) => {
      const price = parseFloat(p.price) || 0;
      const units = parseFloat(p.units) || 0;
      const discount = parseFloat(p.discount) || 0;
      const grossRevenue = price * units;
      const discountAmount = grossRevenue * (discount / 100);
      const netRevenue = grossRevenue - discountAmount;
      return { ...p, price, units, discount, grossRevenue, discountAmount, netRevenue };
    });

    const totalGross = rows.reduce((sum, r) => sum + r.grossRevenue, 0);
    const totalDiscount = rows.reduce((sum, r) => sum + r.discountAmount, 0);
    const totalNet = rows.reduce((sum, r) => sum + r.netRevenue, 0);
    const hasData = rows.some((r) => r.grossRevenue > 0);

    return hasData ? { rows, totalGross, totalDiscount, totalNet } : null;
  }, [products]);

  return { products, addProduct, removeProduct, updateProduct, result };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors">
        <span className="font-semibold text-foreground text-sm pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RevenueCalculator() {
  const { products, addProduct, removeProduct, updateProduct, result } = useRevenueCalc();
  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Layout>
      <SEO
        title="Revenue Calculator — Calculate Total Revenue from Price and Volume"
        description="Calculate total revenue, net revenue after discounts, and per-product breakdown instantly. Free online Revenue Calculator for businesses, sales teams, and students."
      />
      <div style={{ "--calc-hue": "175" } as React.CSSProperties} className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/category/finance" className="hover:text-foreground transition-colors">Finance & Cost</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Revenue Calculator</span>
        </nav>

        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-500 bg-teal-500/10 px-3 py-1 rounded-full">Finance & Cost</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Zap className="w-3 h-3" /> Instant results</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-3">
            Revenue Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Calculate total revenue from price and sales volume for one product or many. Add discounts, track multiple products, and see gross vs. net revenue — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            {["Free to Use", "No Signup", "Multi-Product", "Discount Support"].map((b) => (
              <span key={b} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full border border-border">
                <CheckCircle2 className="w-3 h-3 text-green-500" /> {b}
              </span>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">

            {/* Calculator */}
            <div className="tool-calc-card rounded-2xl p-6">
              <div className="h-1.5 w-full rounded-full mb-6 overflow-hidden bg-muted">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: result ? "100%" : "0%", background: "linear-gradient(90deg, hsl(175,60%,45%), hsl(200,60%,50%))" }} />
              </div>

              {/* Product Rows */}
              <div className="space-y-3 mb-4">
                <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
                  <div className="col-span-3">Product Name</div>
                  <div className="col-span-3">Price ($)</div>
                  <div className="col-span-3">Units Sold</div>
                  <div className="col-span-2">Discount %</div>
                  <div className="col-span-1" />
                </div>
                {products.map((p, idx) => (
                  <div key={p.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-12 sm:col-span-3">
                      <input value={p.name} onChange={(e) => updateProduct(p.id, "name", e.target.value)}
                        placeholder={`Product ${idx + 1}`}
                        className="tool-calc-input w-full px-3 py-2.5 rounded-xl border text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none" />
                    </div>
                    <div className="col-span-4 sm:col-span-3">
                      <input type="number" value={p.price} onChange={(e) => updateProduct(p.id, "price", e.target.value)}
                        placeholder="0.00"
                        className="tool-calc-input w-full px-3 py-2.5 rounded-xl border text-foreground placeholder:text-muted-foreground/50 text-sm font-mono focus:outline-none" />
                    </div>
                    <div className="col-span-4 sm:col-span-3">
                      <input type="number" value={p.units} onChange={(e) => updateProduct(p.id, "units", e.target.value)}
                        placeholder="0"
                        className="tool-calc-input w-full px-3 py-2.5 rounded-xl border text-foreground placeholder:text-muted-foreground/50 text-sm font-mono focus:outline-none" />
                    </div>
                    <div className="col-span-3 sm:col-span-2">
                      <input type="number" value={p.discount} onChange={(e) => updateProduct(p.id, "discount", e.target.value)}
                        placeholder="0"
                        className="tool-calc-input w-full px-3 py-2.5 rounded-xl border text-foreground placeholder:text-muted-foreground/50 text-sm font-mono focus:outline-none" />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      {products.length > 1 && (
                        <button onClick={() => removeProduct(p.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={addProduct}
                className="flex items-center gap-2 text-sm text-teal-500 hover:text-teal-400 font-semibold mb-4 transition-colors">
                <Plus className="w-4 h-4" /> Add Another Product
              </button>

              {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Gross Revenue", value: fmt(result.totalGross), sub: "before discounts" },
                      { label: "Discount Amount", value: fmt(result.totalDiscount), sub: "total deducted" },
                      { label: "Net Revenue", value: fmt(result.totalNet), sub: "after discounts" },
                    ].map((item) => (
                      <div key={item.label} className="tool-calc-result rounded-xl p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                        <p className="tool-calc-number text-xl font-black">{item.value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Per-product breakdown */}
                  {result.rows.filter((r) => r.grossRevenue > 0).length > 1 && (
                    <div className="p-4 rounded-xl bg-muted/40 border border-border">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Per-Product Breakdown</p>
                      <div className="space-y-2">
                        {result.rows.filter((r) => r.grossRevenue > 0).map((row) => {
                          const share = (row.netRevenue / result.totalNet) * 100;
                          return (
                            <div key={row.id}>
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span className="font-medium text-foreground">{row.name}</span>
                                <span>{fmt(row.netRevenue)} ({share.toFixed(1)}%)</span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${share}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/20">
                    <div className="flex gap-2 items-start">
                      <Lightbulb className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        Net revenue is {fmt(result.totalNet)}.{" "}
                        {result.totalDiscount > 0 ? `Discounts reduced gross revenue by ${fmt(result.totalDiscount)} (${((result.totalDiscount / result.totalGross) * 100).toFixed(1)}%). ` : ""}
                        To find profit, subtract your total costs from net revenue.
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* How to Use */}
            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">How to Use the Revenue Calculator</h2>
              <div className="space-y-3 mb-6">
                {[
                  { step: "1", title: "Enter Product Name", desc: "Label each product or service line for easy identification in the breakdown. For a single product, just fill in the price and units." },
                  { step: "2", title: "Enter Price per Unit", desc: "The selling price for each unit — before any discount. Use your standard retail, wholesale, or contract price." },
                  { step: "3", title: "Enter Units Sold", desc: "The number of units sold or expected to be sold. This can be actual sales data or a projection for planning." },
                  { step: "4", title: "Add Discount (Optional)", desc: "Enter a discount percentage if applicable. The calculator shows both gross and net revenue, clearly separating the discount amount." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <span className="w-7 h-7 rounded-full bg-teal-500/10 text-teal-500 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{item.step}</span>
                    <div>
                      <p className="font-bold text-foreground text-sm">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Formulas</h3>
                <div className="space-y-3">
                  {[
                    { expr: "Gross Revenue = Price per Unit × Units Sold", desc: "Total revenue before any discounts or deductions. The top-line sales number." },
                    { expr: "Discount Amount = Gross Revenue × (Discount % ÷ 100)", desc: "The total value deducted from gross revenue due to promotions, negotiations, or pricing adjustments." },
                    { expr: "Net Revenue = Gross Revenue − Discount Amount", desc: "Actual revenue earned after discounts — the figure used for profit margin calculations." },
                    { expr: "Total Revenue = Sum of Net Revenue Across All Products", desc: "Combined net revenue across all product lines or SKUs." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-teal-500/10 text-teal-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                      <div>
                        <code className="px-2 py-1.5 bg-background rounded text-xs font-mono inline-block mb-1 break-all">{item.expr}</code>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Understanding Results */}
            <section id="understanding-results" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Revenue vs. Profit: What Your Results Mean</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Revenue is not profit. Revenue is the total amount earned from sales — profit is what remains after subtracting all costs. Understanding this distinction is fundamental to financial literacy and business planning.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Gross Revenue", color: "text-teal-600 bg-teal-500/10 border-teal-500/20", desc: "Total sales before deductions. Useful for measuring sales volume and market share, but not actual earnings." },
                  { label: "Net Revenue", color: "text-blue-600 bg-blue-500/10 border-blue-500/20", desc: "Revenue after discounts and returns. This is what you actually receive — the starting point for profit calculations." },
                  { label: "Gross Profit", color: "text-green-600 bg-green-500/10 border-green-500/20", desc: "Net Revenue minus Cost of Goods Sold (COGS). Shows manufacturing/sourcing efficiency. Use our Profit Margin Calculator." },
                  { label: "Net Profit", color: "text-purple-600 bg-purple-500/10 border-purple-500/20", desc: "After all operating expenses, taxes, and interest. The true bottom line — what actually goes in your pocket." },
                ].map((item) => (
                  <div key={item.label} className={`p-4 rounded-xl border ${item.color}`}>
                    <p className="font-bold text-sm mb-1">{item.label}</p>
                    <p className="text-xs leading-relaxed opacity-80">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Examples */}
            <section id="examples" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Revenue Calculation Examples</h2>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-3 font-bold text-foreground">Business Type</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Price</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Units</th>
                      <th className="text-right py-2 pr-3 font-bold text-foreground">Discount</th>
                      <th className="text-right py-2 font-bold text-foreground">Net Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    {[
                      { type: "E-commerce store", price: "$49.99", units: "200", disc: "10%", net: "$8,998" },
                      { type: "SaaS monthly plan", price: "$99", units: "500", disc: "0%", net: "$49,500" },
                      { type: "Freelance project", price: "$1,200", units: "8", disc: "5%", net: "$9,120" },
                      { type: "Food truck daily", price: "$12", units: "150", disc: "0%", net: "$1,800" },
                      { type: "Wholesale order", price: "$25", units: "1,000", disc: "15%", net: "$21,250" },
                    ].map((row) => (
                      <tr key={row.type} className="border-b border-border/50">
                        <td className="py-2.5 pr-3">{row.type}</td>
                        <td className="py-2.5 pr-3 text-right font-mono">{row.price}</td>
                        <td className="py-2.5 pr-3 text-right">{row.units}</td>
                        <td className="py-2.5 pr-3 text-right">{row.disc}</td>
                        <td className="py-2.5 text-right font-bold text-teal-500">{row.net}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p><strong className="text-foreground">SaaS businesses</strong> benefit most from revenue calculators at the product planning stage. A $99/month plan sold to 500 subscribers generates $49,500/month in revenue — but the real metric is MRR (monthly recurring revenue) and what % of that covers operating costs.</p>
                <p><strong className="text-foreground">Wholesale and bulk discounts</strong> illustrate how quickly discounts impact top-line revenue. A 15% discount on a $25,000 wholesale order reduces revenue by $3,750 — something that must be factored into pricing strategy and minimum order quantities.</p>
                <p><strong className="text-foreground">Service businesses</strong> like freelancers often overlook the revenue calculation step when quoting. Eight projects at $1,200 each with a 5% client discount nets $9,120 — knowing this upfront helps set monthly income targets and client minimums.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-muted/40 border border-border">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-sm text-muted-foreground italic leading-relaxed">"I run a small Etsy shop with 6 product types. This calculator finally let me see total revenue with all the different prices and quantities in one place. Changed how I think about which products to focus on."</p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">— Small business owner</p>
              </div>
            </section>

            {/* Why */}
            <section id="why-this-tool" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Why Use This Revenue Calculator</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>Revenue calculation is the first step in any financial model. Before you can calculate profit margin, break-even point, ROI, or pricing strategy, you need an accurate picture of what you're bringing in. This calculator makes that fast and visual.</p>
                <p>The <strong className="text-foreground">multi-product support</strong> is what sets this apart from a simple price × quantity multiplication. Real businesses sell multiple SKUs, service tiers, or product lines. This tool handles all of them simultaneously and shows each product's share of total revenue as a visual breakdown.</p>
                <p>The <strong className="text-foreground">discount field</strong> solves a common pain point: many businesses quote gross revenue but forget to account for promotional discounts, trade discounts, or negotiated pricing. The calculator separates gross and net clearly so you always see both figures.</p>
                <p>Use this for sales forecasting, investor presentations, pricing reviews, or just checking the math before a big order. The calculation is instant, the results are accurate, and no data ever leaves your browser.</p>
                <p>After calculating revenue, use the <Link href="/finance/profit-margin-calculator" className="text-teal-500 hover:underline">Profit Margin Calculator</Link> to find net profit, or the <Link href="/finance/break-even-calculator" className="text-teal-500 hover:underline">Break-Even Calculator</Link> to find how many units you need to sell to cover costs.</p>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground">
                <strong className="text-foreground">Disclaimer:</strong> This calculator computes revenue only — not profit, tax liability, or cash flow. Consult an accountant for financial reporting and tax purposes.
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Frequently Asked Questions</h2>
              <div className="space-y-2">
                <FaqItem q="What is the difference between revenue and profit?" a="Revenue is the total money earned from sales before any expenses are deducted. Profit is what's left after subtracting all costs (COGS, operating expenses, taxes, etc.) from revenue. A business can have high revenue but low or negative profit if costs are not managed." />
                <FaqItem q="What is the difference between gross and net revenue?" a="Gross revenue is the total sales amount before discounts, returns, or allowances. Net revenue deducts those items. For example, if you sell $10,000 worth of goods but offer $500 in discounts and process $200 in returns, your net revenue is $9,300. Most financial reporting uses net revenue." />
                <FaqItem q="How do I calculate revenue for a subscription business?" a="For subscription (SaaS or recurring) businesses, revenue = number of paying subscribers × subscription price. MRR (Monthly Recurring Revenue) = monthly subscribers × monthly price. ARR (Annual Recurring Revenue) = MRR × 12. Factor in churn rate (cancellations) to get a realistic ongoing revenue figure." />
                <FaqItem q="What is average revenue per unit (ARPU)?" a="ARPU = Total Revenue ÷ Number of Units (or customers). It shows how much revenue you generate per product sold or per customer. Increasing ARPU through upselling, bundles, or premium tiers is one of the most effective ways to grow revenue without increasing customer count." />
                <FaqItem q="How does discounting affect revenue?" a="Every percentage point of discount directly reduces net revenue. A 10% discount on $100,000 in gross sales costs $10,000 in revenue. If your profit margin is 20%, that $10,000 discount can eliminate half your profit. This is why discount strategy must be carefully tied to volume increases that offset the per-unit revenue loss." />
                <FaqItem q="Can I use this calculator for revenue projections?" a="Yes — enter your projected or expected prices and units to forecast revenue. For more advanced projections that account for growth rates, seasonality, and multiple time periods, you'd use a spreadsheet model. But for quick scenario testing (e.g., what if we sell 20% more units?), this calculator handles it instantly." />
              </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent border border-teal-500/20 rounded-2xl p-6 text-center">
              <h2 className="text-xl font-black text-foreground mb-2">Build a Complete Financial Picture</h2>
              <p className="text-muted-foreground text-sm mb-4">Revenue is just the start. Calculate profit margins, break-even points, and ROI with our free tools.</p>
              <Link href="/category/finance" className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
                Browse Finance Tools <ChevronRight className="w-4 h-4" />
              </Link>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4 sticky top-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">On This Page</p>
              <nav className="space-y-1">
                {[
                  { href: "#how-to-use", label: "How to Use" },
                  { href: "#understanding-results", label: "Understanding Results" },
                  { href: "#examples", label: "Examples" },
                  { href: "#why-this-tool", label: "Why This Tool" },
                  { href: "#faq", label: "FAQ" },
                ].map((item) => (
                  <a key={item.href} href={item.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />{item.label}
                  </a>
                ))}
              </nav>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1">
                {[
                  { href: "/finance/profit-margin-calculator", label: "Profit Margin Calculator", icon: TrendingUp },
                  { href: "/finance/break-even-calculator", label: "Break-Even Calculator", icon: BarChart3 },
                  { href: "/finance/markup-calculator", label: "Markup Calculator", icon: DollarSign },
                  { href: "/finance/discount-calculator", label: "Discount Calculator", icon: Calculator },
                  { href: "/finance/online-roi-calculator", label: "ROI Calculator", icon: TrendingUp },
                  { href: "/finance/online-tax-calculator", label: "Tax Calculator", icon: Shield },
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 group">
                    <item.icon className="w-3.5 h-3.5 group-hover:text-teal-500 transition-colors" />{item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="space-y-2">
                {[
                  { icon: Shield, text: "No data stored" },
                  { icon: Zap, text: "Multi-product support" },
                  { icon: BadgeCheck, text: "Gross & net revenue" },
                  { icon: Clock, text: "Instant calculation" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <item.icon className="w-3.5 h-3.5 text-teal-500" />{item.text}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
