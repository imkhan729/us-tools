import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ReceiptText, Users, DollarSign } from "lucide-react";

export default function TipCalculator() {
  const [bill, setBill] = useState("");
  const [tipPct, setTipPct] = useState(18);
  const [customTip, setCustomTip] = useState("");
  const [people, setPeople] = useState("1");

  const PRESETS = [10, 15, 18, 20, 25];

  const effectiveTip = customTip !== "" ? parseFloat(customTip) : tipPct;
  const billNum = parseFloat(bill) || 0;
  const peopleNum = Math.max(1, parseInt(people) || 1);
  const tipAmount = (billNum * effectiveTip) / 100;
  const total = billNum + tipAmount;
  const perPerson = total / peopleNum;
  const tipPerPerson = tipAmount / peopleNum;

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const inputCls = "w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-medium focus:outline-none focus:border-primary transition-colors text-lg";

  const ToolUI = (
    <div className="space-y-6">
      {/* Bill amount */}
      <div>
        <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Bill Amount</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-muted-foreground">$</span>
          <input
            type="number"
            placeholder="0.00"
            className={`${inputCls} pl-9`}
            value={bill}
            onChange={e => setBill(e.target.value)}
          />
        </div>
      </div>

      {/* Tip % presets */}
      <div>
        <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Tip Percentage</label>
        <div className="flex gap-2 flex-wrap mb-3">
          {PRESETS.map(p => (
            <button
              key={p}
              onClick={() => { setTipPct(p); setCustomTip(""); }}
              className={`px-4 py-2 rounded-xl font-black text-sm border-2 transition-all ${customTip === "" && tipPct === p ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:border-primary"}`}
            >
              {p}%
            </button>
          ))}
          <input
            type="number"
            placeholder="Custom %"
            className="px-4 py-2 rounded-xl border-2 border-border bg-card text-foreground font-bold text-sm focus:outline-none focus:border-primary w-28 transition-colors"
            value={customTip}
            onChange={e => setCustomTip(e.target.value)}
          />
        </div>
      </div>

      {/* Number of people */}
      <div>
        <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Split Between</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPeople(p => String(Math.max(1, parseInt(p) - 1)))}
            className="w-12 h-12 rounded-xl border-2 border-border bg-card text-foreground font-black text-xl hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
          >−</button>
          <input
            type="number"
            min="1"
            className="flex-1 text-center px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground font-black text-lg focus:outline-none focus:border-primary transition-colors"
            value={people}
            onChange={e => setPeople(e.target.value)}
          />
          <button
            onClick={() => setPeople(p => String(parseInt(p) + 1))}
            className="w-12 h-12 rounded-xl border-2 border-border bg-card text-foreground font-black text-xl hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
          >+</button>
          <span className="text-muted-foreground font-bold text-sm">{peopleNum === 1 ? "person" : "people"}</span>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Tip Amount", value: fmt(tipAmount), accent: true },
          { label: "Total Bill", value: fmt(total), accent: false },
          { label: "Tip / Person", value: fmt(tipPerPerson), accent: false },
          { label: "Total / Person", value: fmt(perPerson), accent: true },
        ].map(item => (
          <div key={item.label} className={`rounded-xl p-4 text-center border-2 ${item.accent ? "bg-primary/10 border-primary/30" : "bg-card border-border"}`}>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
            <p className={`text-2xl font-black ${item.accent ? "text-primary" : "text-foreground"}`}>{billNum > 0 ? item.value : "$0.00"}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ToolPageLayout
      title="Tip Calculator"
      description="Calculate the right tip amount and split the bill evenly between any number of people."
      tool={ToolUI}
      howToUse={
        <>
          <p>Getting the right tip is easy with this calculator:</p>
          <ol>
            <li><strong>Enter the bill amount</strong> — type the total before tip.</li>
            <li><strong>Select a tip percentage</strong> — choose 10%, 15%, 18%, 20%, 25%, or enter a custom amount.</li>
            <li><strong>Set the number of people</strong> — use + / − or type directly to split evenly.</li>
            <li><strong>Read the breakdown</strong> — see total tip, total bill, and each person's share instantly.</li>
          </ol>
        </>
      }
      faq={[
        { q: "How much should I tip at a restaurant?", a: "In the US, 15–20% is standard for sit-down restaurants. 10% is acceptable for counter service. 20–25% is considered generous for excellent service." },
        { q: "Do I tip on the pre-tax or post-tax amount?", a: "Traditionally, tips are calculated on the pre-tax amount, but tipping on the total (including tax) is common and widely accepted." },
        { q: "Should I tip at fast food restaurants?", a: "Tipping at fast food restaurants is not required but is increasingly appreciated. A small tip (10–15%) at counter-service spots is a kind gesture." },
      ]}
      related={[
        { title: "Discount Calculator", path: "/tools/discount-calculator", icon: <ReceiptText className="w-5 h-5" /> },
        { title: "Budget Calculator", path: "/tools/budget-calculator", icon: <DollarSign className="w-5 h-5" /> },
        { title: "Tax Calculator", path: "/tools/tax-calculator", icon: <ReceiptText className="w-5 h-5" /> },
      ]}
    />
  );
}
