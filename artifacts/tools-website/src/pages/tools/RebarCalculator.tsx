import { useMemo, useState } from "react";
import { Construction, Ruler, Target } from "lucide-react";
import ConstructionToolPageShell from "./ConstructionToolPageShell";

type Unit = "metric" | "imperial";

function formatNumber(value: number, digits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export default function RebarCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [length, setLength] = useState("12");
  const [width, setWidth] = useState("6");
  const [spacing, setSpacing] = useState("0.2");
  const [stockLength, setStockLength] = useState("12");
  const [wastePercent, setWastePercent] = useState("10");

  const result = useMemo(() => {
    const slabLength = parseFloat(length);
    const slabWidth = parseFloat(width);
    const barSpacing = parseFloat(spacing);
    const stock = parseFloat(stockLength);
    const waste = parseFloat(wastePercent);

    if (
      !Number.isFinite(slabLength) ||
      !Number.isFinite(slabWidth) ||
      !Number.isFinite(barSpacing) ||
      !Number.isFinite(stock) ||
      !Number.isFinite(waste) ||
      slabLength <= 0 ||
      slabWidth <= 0 ||
      barSpacing <= 0 ||
      stock <= 0 ||
      waste < 0
    ) {
      return null;
    }

    const barsAlongWidth = Math.floor(slabWidth / barSpacing) + 1;
    const barsAlongLength = Math.floor(slabLength / barSpacing) + 1;
    const totalLength = barsAlongWidth * slabLength + barsAlongLength * slabWidth;
    const totalLengthWithWaste = totalLength * (1 + waste / 100);
    const stockPieces = Math.ceil(totalLengthWithWaste / stock);

    return {
      barsAlongWidth,
      barsAlongLength,
      totalLength,
      totalLengthWithWaste,
      stockPieces,
    };
  }, [length, spacing, stockLength, wastePercent, width]);

  const unitLabel = unit === "metric" ? "m" : "ft";

  return (
    <ConstructionToolPageShell
      title="Rebar Calculator"
      seoTitle="Rebar Calculator - Estimate Rebar Quantity and Bar Length"
      seoDescription="Calculate rebar quantity, spacing layout, total bar length, and stock pieces for slabs and concrete work. Free rebar calculator for construction planning."
      canonical="https://usonlinetools.com/construction/rebar-calculator"
      heroDescription="Estimate how many reinforcing bars a slab layout needs based on spacing, total bar run length, and the stock bar lengths you plan to order."
      heroIcon={<Construction className="w-3.5 h-3.5" />}
      calculatorLabel="Rebar Layout Estimator"
      calculatorDescription="Calculate bar count by spacing, total run length, and stock pieces for slab reinforcement planning."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg font-bold text-foreground">Slab and spacing inputs</h3>
            </div>

            <div className="mb-4 flex overflow-hidden rounded-lg border border-border sm:w-fit">
              <button
                onClick={() => setUnit("metric")}
                className={`px-4 py-2 text-sm font-bold transition-colors ${unit === "metric" ? "bg-amber-600 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
              >
                Metric
              </button>
              <button
                onClick={() => setUnit("imperial")}
                className={`px-4 py-2 text-sm font-bold transition-colors ${unit === "imperial" ? "bg-amber-600 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
              >
                Imperial
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Slab Length ({unitLabel})</label>
                <input type="number" min="0" value={length} onChange={(event) => setLength(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Slab Width ({unitLabel})</label>
                <input type="number" min="0" value={width} onChange={(event) => setWidth(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Bar Spacing ({unitLabel})</label>
                <input type="number" min="0" value={spacing} onChange={(event) => setSpacing(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Stock Bar Length ({unitLabel})</label>
                <input type="number" min="0" value={stockLength} onChange={(event) => setStockLength(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Waste Allowance %</label>
                <input type="number" min="0" value={wastePercent} onChange={(event) => setWastePercent(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-500/20 bg-background p-5 text-center">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Stock Pieces Needed</p>
                <p className="text-5xl font-black text-amber-700 dark:text-amber-400">{result.stockPieces}</p>
                <p className="mt-2 text-sm text-muted-foreground">Based on {formatNumber(result.totalLengthWithWaste)} {unitLabel} of total bar length including waste</p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Bars One Way</p>
                  <p className="text-2xl font-black text-foreground">{result.barsAlongWidth}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Bars Other Way</p>
                  <p className="text-2xl font-black text-foreground">{result.barsAlongLength}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Base Length</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.totalLength)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{unitLabel}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">With Waste</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.totalLengthWithWaste)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{unitLabel}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid slab dimensions, spacing, and stock bar length to calculate the rebar layout.</p>
          )}

          <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-bold text-foreground">Planning note</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This tool is best for quick slab-grid estimation. Final structural design should still follow the engineer's bar size, lap splice, cover, and placement details.
            </p>
          </div>
        </div>
      }
      howToTitle="How to Use the Rebar Calculator"
      howToIntro="This rebar calculator is designed for the common estimating step where you know the slab size, the intended spacing, and the stock bar length you can buy."
      howSteps={[
        {
          title: "Enter the slab length and width",
          description: "Use the overall concrete footprint that needs a reinforcement grid. This tool assumes a rectangular slab layout.",
        },
        {
          title: "Set the bar spacing and stock bar length",
          description: "Spacing controls how many bars run in each direction, while the stock length helps convert total bar run length into orderable pieces.",
        },
        {
          title: "Add a waste allowance before ordering",
          description: "Cutting losses, laps, and layout adjustments usually require extra material. The waste percentage helps you avoid under-ordering.",
        },
      ]}
      formulaTitle="Rebar Estimating Formulas"
      formulaIntro="A quick slab-grid estimate comes from counting the number of spaces across the slab and then converting that layout into total run length."
      formulaCards={[
        {
          label: "Bars Per Direction",
          formula: "Bars = floor(Dimension / Spacing) + 1",
          detail: "This counts the bars required to cover the slab dimension at the chosen center-to-center spacing.",
        },
        {
          label: "Total Bar Length",
          formula: "Total Length = (Bars x Run Length) in both directions",
          detail: "Once you know the bar count in each direction, multiply by the run length to estimate the full amount of reinforcement required.",
        },
      ]}
      examplesTitle="Rebar Examples"
      examplesIntro="These examples show how spacing and stock length quickly change the material list."
      examples={[
        {
          title: "Slab Grid",
          value: "Two Directions",
          detail: "Most slab reinforcement layouts require bars running both ways, so both slab dimensions matter in the final count.",
        },
        {
          title: "Tighter Spacing",
          value: "More Bars",
          detail: "Reducing spacing from 300 mm to 200 mm or from 12 in to 8 in raises the total bar count quickly.",
        },
        {
          title: "Stock Conversion",
          value: "Order Pieces",
          detail: "The stock-piece result helps turn layout math into a practical order quantity for the yard or supplier.",
        },
      ]}
      contentTitle="Why Rebar Estimation Should Happen Early"
      contentIntro="Rebar is one of the first materials that can disrupt a concrete schedule if it is under-ordered. A quick estimator helps builders validate the quantity before placement day."
      contentSections={[
        {
          title: "Why spacing drives the estimate",
          paragraphs: [
            "Rebar quantity is mostly controlled by the chosen center-to-center spacing. Tighter spacing means more bars, more cutting, and more total stock length.",
            "That is why the spacing input is often the single fastest way to test how a structural requirement changes material demand.",
          ],
        },
        {
          title: "Why stock length matters",
          paragraphs: [
            "Suppliers sell reinforcement in fixed stock lengths, not in custom total-run-length bundles. Converting the total length into pieces makes the estimate easier to order.",
            "That conversion also highlights when short stock lengths create more waste and more lap or cutting work.",
          ],
        },
        {
          title: "What this estimate does not replace",
          paragraphs: [
            "This calculator does not replace structural drawings or detailing. Lap lengths, hooks, cover, bar diameter, and engineer-specified reinforcement zones still control the final shop or site layout.",
            "Use it for planning and budgeting, then verify the final bar schedule against the real structural design.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How do I calculate rebar quantity for a slab?",
          a: "Enter the slab dimensions and bar spacing to count bars in each direction, then convert the combined run length into stock bar pieces.",
        },
        {
          q: "Why does the calculator add one extra bar after dividing by spacing?",
          a: "Because the grid needs a bar at the far edge after all the full spacing intervals are counted.",
        },
        {
          q: "Should I include waste in rebar ordering?",
          a: "Yes. Waste allowance is common because cutting, laps, and layout adjustments almost always consume extra stock length.",
        },
        {
          q: "Can I use this for structural design?",
          a: "No. It is a planning tool, not a replacement for structural engineering or an approved rebar schedule.",
        },
      ]}
      relatedTools={[
        { title: "Concrete Calculator", href: "/construction/concrete-calculator", benefit: "Estimate the concrete volume for the same slab footprint." },
        { title: "Steel Weight Calculator", href: "/construction/steel-weight-calculator", benefit: "Convert bar dimensions into approximate steel weight." },
        { title: "Material Cost Calculator", href: "/construction/material-cost-calculator", benefit: "Turn the material estimate into a budget." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Slab Grid Estimates", detail: "Useful for rectangular slab reinforcement planning." },
        { label: "Core Output", value: "Bar Count and Pieces", detail: "Shows bars each way, total run length, and stock pieces needed." },
        { label: "Important Note", value: "Add Real Detailing Later", detail: "Final design still depends on engineer-specified cover, laps, and bar size." },
      ]}
    />
  );
}
