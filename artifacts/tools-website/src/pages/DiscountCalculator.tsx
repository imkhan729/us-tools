import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ReceiptText, TrendingUp, Tag } from "lucide-react";

export default function DiscountCalculator() {
  const [mode, setMode] = useState<"pct" | "amount" | "final">("pct");
  const [original, setOriginal] = useState("");
  const [discount, setDiscount] = useState("");
  const [finalPrice, setFinalPrice] = useState("");

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const calc = () => {
    const orig = parseFloat(original);
    const disc = parseFloat(discount);
    const fin = parseFloat(finalPrice);
    if (mode === "pct") {
      if (!orig || isNaN(disc)) return null;
      const saving = (orig * disc) / 100;
      return { saving, final: orig - saving, pct: disc };
    }
    if (mode === "amount") {
      if (!orig || isNaN(disc)) return null;
      return { saving: disc, final: orig - disc, pct: (disc / orig) * 100 };
    }
    if (mode === "final") {
      if (!orig || isNaN(fin)) return null;
      const saving = orig - fin;
      return { saving, final: fin, pct: (saving / orig) * 100 };
    }
    return null;
  };

  const result = calc();
  const inputCls = "w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-medium focus:outline-none focus:border-primary transition-colors text-base";

  const ToolUI = (
    <div className="space-y-6">
      {/* Mode tabs */}
      <div>
        <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Calculate by</label>
        <div className="flex rounded-xl border-2 border-border overflow-hidden">
          {[
            { key: "pct", label: "% Discount" },
            { key: "amount", label: "$ Off Amount" },
            { key: "final", label: "Final Price" },
          ].map(m => (
            <button
              key={m.key}
              onClick={() => setMode(m.key as typeof mode)}
              className={`flex-1 py-3 font-black uppercase text-xs tracking-wider transition-colors ${mode === m.key ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Original Price ($)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground">$</span>
            <input type="number" placeholder="0.00" className={`${inputCls} pl-8`} value={original} onChange={e => setOriginal(e.target.value)} />
          </div>
        </div>
        {mode === "pct" && (
          <div>
            <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Discount (%)</label>
            <div className="relative">
              <input type="number" placeholder="e.g. 30" className={`${inputCls} pr-8`} value={discount} onChange={e => setDiscount(e.target.value)} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground">%</span>
            </div>
          </div>
        )}
        {mode === "amount" && (
          <div>
            <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Discount Amount ($)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground">$</span>
              <input type="number" placeholder="0.00" className={`${inputCls} pl-8`} value={discount} onChange={e => setDiscount(e.target.value)} />
            </div>
          </div>
        )}
        {mode === "final" && (
          <div>
            <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Final Price ($)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground">$</span>
              <input type="number" placeholder="0.00" className={`${inputCls} pl-8`} value={finalPrice} onChange={e => setFinalPrice(e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {result ? (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-5 text-center">
            <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">You Save</p>
            <p className="text-2xl font-black text-primary">{fmt(result.saving)}</p>
          </div>
          <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl p-5 text-center">
            <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">Final Price</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{fmt(result.final)}</p>
          </div>
          <div className="bg-card border-2 border-border rounded-xl p-5 text-center">
            <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1">Discount %</p>
            <p className="text-2xl font-black text-foreground">{result.pct.toFixed(1)}%</p>
          </div>
        </div>
      ) : (
        <div className="bg-muted/30 rounded-xl p-8 text-center border-2 border-dashed border-border">
          <Tag className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-bold text-muted-foreground">Enter values above to calculate your savings</p>
        </div>
      )}
    </div>
  );

  return (
    <ToolPageLayout
      title="Discount Calculator"
      description="Calculate the final price after a discount, how much you save, and the discount percentage."
      tool={ToolUI}
      howToUse={
        <>
          <p>Three ways to calculate a discount:</p>
          <ol>
            <li><strong>% Discount</strong> — enter the original price and the percentage off to get the final price and savings.</li>
            <li><strong>$ Off Amount</strong> — enter the original price and the dollar amount off to find the final price and percentage.</li>
            <li><strong>Final Price</strong> — enter the original and final price to discover how much you saved and what the discount percentage was.</li>
          </ol>
        </>
      }
      faq={[
        { q: "How do I calculate a 20% discount?", a: "Multiply the original price by 0.20 to get the discount amount, then subtract from the original price. Example: $50 × 0.20 = $10 off → final price is $40." },
        { q: "What is the formula for discount?", a: "Final Price = Original Price × (1 − Discount% / 100). Savings = Original Price − Final Price. Discount% = (Savings / Original Price) × 100." },
        { q: "Can I calculate the original price from a discount?", a: "Yes — use the 'Final Price' mode. Enter what you know (original and final), and the calculator will work out the rest." },
      ]}
      related={[
        { title: "Tip Calculator", path: "/tools/tip-calculator", icon: <ReceiptText className="w-5 h-5" /> },
        { title: "Profit Margin Calculator", path: "/tools/profit-margin-calculator", icon: <TrendingUp className="w-5 h-5" /> },
        { title: "GST Calculator", path: "/tools/gst-calculator", icon: <ReceiptText className="w-5 h-5" /> },
      ]}
    />
  );
}
