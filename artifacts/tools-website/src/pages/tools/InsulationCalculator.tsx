import { useMemo, useState } from "react";
import { Construction, Layers, Package } from "lucide-react";
import ConstructionToolPageShell from "./ConstructionToolPageShell";

function formatNumber(value: number, digits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

type Unit = "imperial" | "metric";

export default function InsulationCalculator() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [length, setLength] = useState("30");
  const [width, setWidth] = useState("20");
  const [layers, setLayers] = useState("1");
  const [waste, setWaste] = useState("10");
  const [coveragePerPack, setCoveragePerPack] = useState("58");

  const result = useMemo(() => {
    const areaLength = parseFloat(length);
    const areaWidth = parseFloat(width);
    const layerCount = parseFloat(layers);
    const wastePercent = parseFloat(waste);
    const packCoverage = parseFloat(coveragePerPack);

    if (
      !Number.isFinite(areaLength) ||
      !Number.isFinite(areaWidth) ||
      !Number.isFinite(layerCount) ||
      !Number.isFinite(wastePercent) ||
      !Number.isFinite(packCoverage) ||
      areaLength <= 0 ||
      areaWidth <= 0 ||
      layerCount <= 0 ||
      wastePercent < 0 ||
      packCoverage <= 0
    ) {
      return null;
    }

    const baseArea = areaLength * areaWidth;
    const adjustedCoverage = baseArea * layerCount * (1 + wastePercent / 100);
    const packsNeeded = Math.ceil(adjustedCoverage / packCoverage);
    const extraCoverage = Math.max(0, packsNeeded * packCoverage - adjustedCoverage);

    return {
      baseArea,
      adjustedCoverage,
      packsNeeded,
      extraCoverage,
    };
  }, [coveragePerPack, layers, length, waste, width]);

  const areaUnit = unit === "imperial" ? "sq ft" : "sq m";

  return (
    <ConstructionToolPageShell
      title="Insulation Calculator"
      seoTitle="Insulation Calculator - Estimate Coverage, Waste, And Packs"
      seoDescription="Calculate insulation coverage for attics, walls, and floors. Free insulation calculator with area, waste factor, and packs-needed estimates."
      canonical="https://usonlinetools.com/construction/insulation-calculator"
      heroDescription="Estimate how much insulation material you need for walls, ceilings, attics, or floors. This insulation calculator converts project area into adjusted coverage and pack counts with waste included."
      heroIcon={<Construction className="w-3.5 h-3.5" />}
      calculatorLabel="Insulation Coverage Estimator"
      calculatorDescription="Calculate base area, adjusted coverage, and estimated packs required."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg font-bold text-foreground">Project dimensions</h3>
            </div>

            <div className="flex rounded-lg overflow-hidden border border-border mb-4 sm:w-fit">
              <button onClick={() => setUnit("imperial")} className={`px-4 py-2 text-sm font-bold transition-colors ${unit === "imperial" ? "bg-amber-600 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>
                Imperial
              </button>
              <button onClick={() => setUnit("metric")} className={`px-4 py-2 text-sm font-bold transition-colors ${unit === "metric" ? "bg-amber-600 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>
                Metric
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Length ({unit === "imperial" ? "ft" : "m"})</label>
                <input type="number" min="0" value={length} onChange={(event) => setLength(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Width ({unit === "imperial" ? "ft" : "m"})</label>
                <input type="number" min="0" value={width} onChange={(event) => setWidth(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Layers</label>
                <input type="number" min="1" value={layers} onChange={(event) => setLayers(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Waste %</label>
                <input type="number" min="0" value={waste} onChange={(event) => setWaste(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Coverage Per Pack ({areaUnit})</label>
                <input type="number" min="0" value={coveragePerPack} onChange={(event) => setCoveragePerPack(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-500/20 bg-background p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Adjusted Coverage Needed</p>
                <p className="text-5xl font-black text-amber-700 dark:text-amber-400">{formatNumber(result.adjustedCoverage)}</p>
                <p className="text-sm text-muted-foreground mt-2">{areaUnit} after layers and waste</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Base Area</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.baseArea)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{areaUnit}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Packs Needed</p>
                  <p className="text-2xl font-black text-foreground">{result.packsNeeded}</p>
                  <p className="text-xs text-muted-foreground mt-1">Round up to full packs</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Extra Coverage</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.extraCoverage)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{areaUnit}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid project dimensions and pack coverage to estimate insulation needs.</p>
          )}

          <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-bold text-foreground">Practical note</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Coverage per pack varies by insulation type, thickness, and brand. Use the exact package label for the most reliable estimate.
            </p>
          </div>
        </div>
      }
      howToTitle="How to Use the Insulation Calculator"
      howToIntro="This calculator works best when you already know the approximate surface area you want to cover and the stated coverage on the insulation package."
      howSteps={[
        {
          title: "Enter the area dimensions",
          description: "Measure the wall, attic, ceiling, or floor section you want to insulate and enter the length and width in the same unit system.",
        },
        {
          title: "Add layers and waste",
          description: "If your build requires multiple layers, enter the layer count. Add a waste percentage to cover trimming, irregular edges, and offcuts.",
        },
        {
          title: "Enter pack coverage and review the result",
          description: "Use the coverage shown on the insulation pack or roll. The calculator will return adjusted area and the number of full packs to buy.",
        },
      ]}
      formulaTitle="Insulation Formulas"
      formulaIntro="Insulation purchasing is mostly a coverage calculation, not a weight calculation. The key is adjusting the raw area for layers and waste."
      formulaCards={[
        {
          label: "Base Area",
          formula: "Base Area = Length x Width",
          detail: "This gives the starting surface area to cover before any layers or waste are applied.",
        },
        {
          label: "Adjusted Coverage",
          formula: "Adjusted Coverage = Base Area x Layers x (1 + Waste / 100)",
          detail: "This accounts for multi-layer builds and the extra material usually needed around corners, cuts, and framing.",
        },
        {
          label: "Pack Count",
          formula: "Packs Needed = Adjusted Coverage / Coverage Per Pack",
          detail: "The result is rounded up because insulation is bought in full packs or rolls.",
        },
      ]}
      examplesTitle="Insulation Examples"
      examplesIntro="A few simple examples show how quickly waste and multiple layers change the amount of insulation you need to buy."
      examples={[
        {
          title: "Attic Floor",
          value: "600 sq ft",
          detail: "A 30 ft by 20 ft attic floor starts with 600 square feet before waste or extra layers are applied.",
        },
        {
          title: "10% Waste",
          value: "660 sq ft",
          detail: "Adding 10% waste to a 600 square foot project increases the target coverage to 660 square feet.",
        },
        {
          title: "58 sq ft Packs",
          value: "12 packs",
          detail: "If one pack covers 58 square feet, 660 square feet of adjusted coverage requires 12 full packs.",
        },
      ]}
      contentTitle="Why Coverage Estimates Matter For Insulation"
      contentIntro="Insulation projects are often underestimated because packaging covers ideal conditions, while real rooms include cuts, corners, and awkward shapes."
      contentSections={[
        {
          title: "Why waste should be included",
          paragraphs: [
            "Even simple rectangular rooms create waste once you work around joists, outlets, framing, and irregular edges. A modest waste factor helps prevent under-ordering.",
            "Waste percentages are especially useful for retrofit jobs, attic work, and rooms with multiple penetrations or awkward framing details.",
          ],
        },
        {
          title: "Why pack coverage varies",
          paragraphs: [
            "Insulation packs do not all cover the same area. Coverage depends on material type, thickness, density, and manufacturer packaging.",
            "That is why this calculator asks for coverage per pack instead of assuming a one-size-fits-all product specification.",
          ],
        },
        {
          title: "When to use layers",
          paragraphs: [
            "Some projects use multiple layers to reach a target thermal value or to stagger joints. In those cases, total material needed increases in direct proportion to layer count.",
            "If you are installing only one layer, keep the value at 1 so the calculator reflects a standard single-pass insulation job.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Does this insulation calculator estimate R-value?",
          a: "No. This tool estimates material coverage and packs needed. R-value depends on product type and thickness, so you should confirm that separately from the manufacturer label.",
        },
        {
          q: "Should I subtract windows and doors?",
          a: "For large openings, yes. For small openings, many people leave them in and let the waste factor absorb the difference.",
        },
        {
          q: "Why does the result round up packs?",
          a: "Insulation is usually purchased in full packs or rolls, so rounding up avoids running short partway through the project.",
        },
        {
          q: "Can I use this for walls, attics, and floors?",
          a: "Yes. As long as you know the surface area and product coverage, the calculator works for most insulation coverage estimates.",
        },
      ]}
      relatedTools={[
        { title: "Room Area Calculator", href: "/construction/room-area-calculator", benefit: "Measure the surface before estimating coverage." },
        { title: "Wall Area Calculator", href: "/construction/wall-area-calculator", benefit: "Measure paintable or board-covered wall area." },
        { title: "Material Cost Calculator", href: "/construction/material-cost-calculator", benefit: "Turn your quantity estimate into a budget." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Coverage Planning", detail: "Useful for walls, attics, ceilings, and floors." },
        { label: "Core Output", value: "Packs Needed", detail: "Shows adjusted coverage and rounds to full packs." },
        { label: "Important Input", value: "Pack Label", detail: "Use the exact stated coverage from your insulation brand." },
      ]}
    />
  );
}
