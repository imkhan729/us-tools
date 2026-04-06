import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { SeoRichContent } from "@/components/SeoRichContent";
import { Link } from "wouter";
import { ChevronRight, Calculator } from "lucide-react";

const UNIT_TO_ML: Record<string, number> = {
  tsp: 4.92892,
  tbsp: 14.7868,
  cup: 236.588,
  ml: 1,
  l: 1000,
  floz: 29.5735,
};

const UNIT_LABEL: Record<string, string> = {
  tsp: "Teaspoon (tsp)",
  tbsp: "Tablespoon (tbsp)",
  cup: "Cup",
  ml: "Milliliter (ml)",
  l: "Liter (L)",
  floz: "Fluid Ounce (fl oz)",
};

function format(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

export default function CookingConverter() {
  const [amount, setAmount] = useState("1");
  const [fromUnit, setFromUnit] = useState("cup");
  const [toUnit, setToUnit] = useState("ml");

  const result = useMemo(() => {
    const value = Number(amount);
    if (!Number.isFinite(value)) return null;
    return (value * UNIT_TO_ML[fromUnit]) / UNIT_TO_ML[toUnit];
  }, [amount, fromUnit, toUnit]);

  return (
    <Layout>
      <SEO
        title="Cooking Converter"
        description="Free cooking converter. Convert cups, tablespoons, teaspoons, milliliters, liters, and fluid ounces for recipes."
        canonical="https://usonlinetools.com/conversion/cooking-converter"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link href="/category/conversion" className="text-muted-foreground hover:text-foreground transition-colors">Conversion Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">Cooking Converter</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-blue-500/15 bg-gradient-to-br from-blue-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Calculator className="w-3.5 h-3.5" />
            Conversion Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Cooking Converter</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl">
            Convert cooking measurements instantly between cups, tablespoons, teaspoons, milliliters, liters, and fluid ounces.
          </p>
        </section>

        <div className="space-y-10">
          <section id="calculator" className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Cooking Measurement Converter</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input type="number" className="tool-calc-input w-full" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <select className="tool-calc-input w-full" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                {Object.entries(UNIT_LABEL).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
              <select className="tool-calc-input w-full" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
                {Object.entries(UNIT_LABEL).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
              <div className="tool-calc-result text-blue-600 dark:text-blue-400">{result === null ? "--" : format(result)}</div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {result === null ? "Enter a valid numeric amount." : `${format(Number(amount))} ${UNIT_LABEL[fromUnit]} = ${format(result)} ${UNIT_LABEL[toUnit]}`}
            </p>
          </section>

          <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Cooking Converter</h2>
            <ol className="space-y-3 text-muted-foreground">
              <li>1. Enter your recipe quantity in the amount field.</li>
              <li>2. Select the source cooking unit.</li>
              <li>3. Select the target unit to get instant conversion.</li>
            </ol>
          </section>

          <SeoRichContent
            toolName="Cooking Converter"
            primaryKeyword="cooking converter"
            intro="This recipe measurement converter standardizes kitchen units so home cooks and professionals can scale recipes accurately across metric and US customary measurements."
            formulas={[
              { expression: "Converted Value = Amount x (From Unit in ml) / (To Unit in ml)", explanation: "Converts all units through a milliliter base for consistent results." },
              { expression: "1 cup = 236.588 ml", explanation: "Standard US cup conversion used in most recipe tools." },
              { expression: "1 tbsp = 14.7868 ml, 1 tsp = 4.92892 ml", explanation: "Common tablespoon and teaspoon references for baking and cooking." },
            ]}
            useCases={[
              { title: "Recipe scaling", description: "Convert ingredient measures when doubling or halving recipes." },
              { title: "International recipes", description: "Switch between US and metric volume units quickly." },
              { title: "Meal prep consistency", description: "Keep ingredient amounts accurate across repeated batches." },
            ]}
            tips={[
              "Use level measuring spoons and cups for better repeatability.",
              "For baking, weight-based conversion is usually more precise than volume.",
              "Keep unit system consistent throughout the full recipe workflow.",
              "Round only at the final step when scaling large recipes.",
            ]}
          />

          <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>- 1 cup = 16 tablespoons</li>
              <li>- 2 tablespoons = 6 teaspoons</li>
              <li>- 500 ml = 2.11338 cups</li>
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
}
