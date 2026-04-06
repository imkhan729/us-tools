import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle2, ShoppingCart, Plus, Trash2 } from "lucide-react";
import { SEO } from "../../components/SEO";
import { Link } from "wouter";

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

const UNITS = ["oz", "lb", "g", "kg", "fl oz", "ml", "L", "count", "ft", "m", "sq ft", "sq m"];

interface Item {
  id: number;
  name: string;
  price: string;
  qty: string;
  unit: string;
}

let nextId = 3;

export default function UnitPriceConverter() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Brand A", price: "3.49", qty: "16", unit: "oz" },
    { id: 2, name: "Brand B", price: "5.99", qty: "32", unit: "oz" },
  ]);

  const results = useMemo(() => {
    return items.map(item => {
      const price = parseFloat(item.price);
      const qty = parseFloat(item.qty);
      if (isNaN(price) || isNaN(qty) || qty <= 0) return { ...item, unitPrice: null };
      return { ...item, unitPrice: price / qty };
    });
  }, [items]);

  const validResults = results.filter(r => r.unitPrice !== null) as (Item & { unitPrice: number })[];
  const bestDeal = validResults.length > 0 ? validResults.reduce((a, b) => a.unitPrice < b.unitPrice ? a : b) : null;

  function updateItem(id: number, field: keyof Item, value: string) {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  }

  function addItem() {
    setItems(prev => [...prev, { id: nextId++, name: `Brand ${String.fromCharCode(65 + prev.length)}`, price: "", qty: "", unit: "oz" }]);
  }

  function removeItem(id: number) {
    setItems(prev => prev.filter(item => item.id !== id));
  }

  return (
    <div style={{ "--calc-hue": "25" } as React.CSSProperties} className="min-h-screen bg-background">
      <SEO
        title="Unit Price Converter — Compare Price Per Unit Across Products"
        description="Compare unit prices across different package sizes to find the best value. Free online unit price calculator — enter price and quantity to instantly see cost per unit."
      />
      <nav className="max-w-6xl mx-auto px-4 pt-4 pb-0 text-sm text-muted-foreground flex gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link><span>/</span>
        <Link href="/category/conversion" className="hover:text-foreground transition-colors">Conversion Tools</Link><span>/</span>
        <span className="text-foreground font-medium">Unit Price Converter</span>
      </nav>
      <header className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--calc-hue),65%,40%)] bg-[hsl(var(--calc-hue),80%,95%)] dark:bg-[hsl(var(--calc-hue),40%,20%)] px-3 py-1 rounded-full mb-3">Conversion Tools</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Unit Price Converter</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {["Free","Compare Any Package","Find Best Value","No Signup"].map(b => <span key={b} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">{b}</span>)}
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">Compare unit prices across different package sizes to instantly find the best value. Perfect for grocery shopping, bulk buying, and price comparisons.</p>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-3 space-y-6">
          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-[hsl(var(--calc-hue),65%,40%)]" />Compare Unit Prices</h2>

            <div className="space-y-3 mb-4">
              {items.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3">
                    {idx === 0 && <label className="tool-calc-label">Product Name</label>}
                    <input className="tool-calc-input text-sm" type="text" value={item.name} onChange={e => updateItem(item.id, "name", e.target.value)} placeholder="Brand A" />
                  </div>
                  <div className="col-span-3">
                    {idx === 0 && <label className="tool-calc-label">Price ($)</label>}
                    <input className="tool-calc-input text-sm font-mono" type="number" min="0" step="0.01" value={item.price} onChange={e => updateItem(item.id, "price", e.target.value)} placeholder="3.49" />
                  </div>
                  <div className="col-span-3">
                    {idx === 0 && <label className="tool-calc-label">Quantity</label>}
                    <input className="tool-calc-input text-sm font-mono" type="number" min="0" step="0.1" value={item.qty} onChange={e => updateItem(item.id, "qty", e.target.value)} placeholder="16" />
                  </div>
                  <div className="col-span-2">
                    {idx === 0 && <label className="tool-calc-label">Unit</label>}
                    <select className="tool-calc-input text-sm" value={item.unit} onChange={e => updateItem(item.id, "unit", e.target.value)}>
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <div className="col-span-1 flex items-end pb-1">
                    {idx === 0 && <div className="tool-calc-label invisible">x</div>}
                    {items.length > 2 && (
                      <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={addItem} className="flex items-center gap-2 text-sm text-[hsl(var(--calc-hue),65%,40%)] hover:text-[hsl(var(--calc-hue),65%,30%)] font-semibold transition-colors mb-6">
              <Plus className="w-4 h-4" /> Add Another Product
            </button>

            {validResults.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-3">
                  {validResults
                    .sort((a, b) => a.unitPrice - b.unitPrice)
                    .map((r, rank) => {
                      const isBest = bestDeal && r.id === bestDeal.id;
                      const pctMore = bestDeal ? ((r.unitPrice - bestDeal.unitPrice) / bestDeal.unitPrice * 100) : 0;
                      return (
                        <div key={r.id} className={`tool-calc-result flex items-center justify-between ${isBest ? "ring-2 ring-[hsl(var(--calc-hue),65%,40%)] ring-offset-1" : ""}`}>
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isBest ? "bg-[hsl(var(--calc-hue),65%,40%)] text-white" : "bg-muted text-muted-foreground"}`}>{rank + 1}</span>
                            <div>
                              <p className="font-semibold">{r.name}</p>
                              <p className="text-xs text-muted-foreground">${parseFloat(r.price).toFixed(2)} for {r.qty} {r.unit}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold font-mono">${r.unitPrice.toFixed(4)}<span className="text-xs font-normal text-muted-foreground">/{r.unit}</span></p>
                            {isBest ? (
                              <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-full">Best Value</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">+{pctMore.toFixed(1)}% more</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">How Unit Price Comparison Works</h2>
            <div className="space-y-3">
              <div className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-[hsl(var(--calc-hue),65%,40%)] text-white text-sm font-bold flex items-center justify-center shrink-0">1</span>
                <div><p className="font-semibold">Enter the total price</p><p className="text-sm text-muted-foreground">The price you pay at the register for the entire package.</p></div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-[hsl(var(--calc-hue),65%,40%)] text-white text-sm font-bold flex items-center justify-center shrink-0">2</span>
                <div><p className="font-semibold">Enter the quantity and unit</p><p className="text-sm text-muted-foreground">Net weight, volume, or count printed on the package.</p></div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="w-7 h-7 rounded-full bg-[hsl(var(--calc-hue),65%,40%)] text-white text-sm font-bold flex items-center justify-center shrink-0">3</span>
                <div><p className="font-semibold">Compare unit prices</p><p className="text-sm text-muted-foreground">The lowest price-per-unit is always the best value — regardless of package size.</p></div>
              </div>
            </div>
            <div className="mt-4 bg-muted/40 rounded-xl p-4 text-sm font-mono">
              <p className="font-semibold text-foreground mb-1">Formula:</p>
              <p className="text-muted-foreground">Unit Price = Total Price ÷ Quantity</p>
              <p className="text-muted-foreground mt-1">Example: $3.49 ÷ 16 oz = $0.218/oz</p>
            </div>
          </div>

          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Smart Shopping Tips</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Compare same units only", desc: "Always compare products measured in the same unit. Mixing oz with ml needs conversion first." },
                { title: "Watch for sales distortion", desc: "A sale price on a small package can make it cheaper per unit than the 'value' size — always check." },
                { title: "Consider storage & expiry", desc: "Buying bulk is only a value if you'll use it before it expires. Factor in spoilage for perishables." },
                { title: "Club stores aren't always cheaper", desc: "Warehouse club prices often beat grocery stores on unit price, but not always. Compare before assuming." },
              ].map(c => (
                <div key={c.title} className="bg-muted/30 rounded-xl p-4">
                  <p className="font-semibold mb-1">{c.title}</p>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="tool-calc-card">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <FaqItem q="What is unit price?" a="Unit price is the cost per single unit of measurement — per ounce, per gram, per count, etc. It lets you compare products of different sizes on a common basis." />
              <FaqItem q="Why is unit price better than comparing package prices?" a="A larger package usually has a higher sticker price but a lower unit price. Comparing package prices directly is misleading — unit price reveals true value regardless of size." />
              <FaqItem q="Do grocery stores display unit prices?" a="Many supermarkets are legally required to display unit prices on shelf tags. However, the units used (per oz vs per lb) can differ by store, making direct comparison tricky. That's where this tool helps." />
              <FaqItem q="Is bulk always cheaper per unit?" a="Not always. Stores sometimes price smaller packages at a lower unit rate to move inventory. Sales, coupons, and store brands can all flip the equation. Always check." />
              <FaqItem q="Can I compare products with different units?" a="Not directly — you'd need to convert first. For example, to compare oz and ml, convert both to the same unit (28.35g per oz) before entering quantities here." />
              <FaqItem q="How do loyalty card prices affect unit price?" a="Enter the loyalty/member price instead of the regular price when comparing. If you always have the card, that's your real price." />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--calc-hue),65%,40%)] to-[hsl(var(--calc-hue),55%,30%)] p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">More Shopping & Finance Tools</h2>
            <p className="mb-5 opacity-90">Save more money with our free calculators.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/finance/discount-calculator" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Discount Calculator</Link>
              <Link href="/finance/tip-calculator" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">Tip Calculator</Link>
            </div>
          </div>
        </section>
        <aside className="space-y-5">
          <div className="sticky top-4 space-y-5">
            <div className="tool-calc-card p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Related Tools</p>
              <div className="space-y-1.5 text-sm">
                {[["/finance/discount-calculator","Discount Calculator"],["/finance/tip-calculator","Tip Calculator"],["/conversion/cooking-converter","Cooking Converter"],["/conversion/weight-converter","Weight Converter"],["/math/percentage-calculator","Percentage Calculator"]].map(([href, label]) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--calc-hue),65%,40%)] shrink-0" />{label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="tool-calc-card p-4">
              <div className="space-y-2 text-xs text-muted-foreground">
                {["Up to 10 products","Ranked by value","Best deal highlighted","Free, no login"].map(t => (
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
