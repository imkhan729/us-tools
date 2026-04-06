import { useMemo, useState } from "react";
import { Construction, Grid2X2, Layers3 } from "lucide-react";
import ConstructionToolPageShell from "./ConstructionToolPageShell";

function formatNumber(value: number, digits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

type Unit = "imperial" | "metric";

export default function PaverCalculator() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [areaLength, setAreaLength] = useState("18");
  const [areaWidth, setAreaWidth] = useState("12");
  const [paverLength, setPaverLength] = useState("8");
  const [paverWidth, setPaverWidth] = useState("4");
  const [waste, setWaste] = useState("8");

  const result = useMemo(() => {
    const length = parseFloat(areaLength);
    const width = parseFloat(areaWidth);
    const stoneLength = parseFloat(paverLength);
    const stoneWidth = parseFloat(paverWidth);
    const wastePercent = parseFloat(waste);

    if (
      !Number.isFinite(length) ||
      !Number.isFinite(width) ||
      !Number.isFinite(stoneLength) ||
      !Number.isFinite(stoneWidth) ||
      !Number.isFinite(wastePercent) ||
      length <= 0 ||
      width <= 0 ||
      stoneLength <= 0 ||
      stoneWidth <= 0 ||
      wastePercent < 0
    ) {
      return null;
    }

    const projectArea = length * width;
    const paverArea =
      unit === "imperial"
        ? (stoneLength / 12) * (stoneWidth / 12)
        : (stoneLength / 100) * (stoneWidth / 100);

    if (paverArea <= 0) return null;

    const rawPavers = projectArea / paverArea;
    const paversNeeded = Math.ceil(rawPavers * (1 + wastePercent / 100));
    const purchasedArea = paversNeeded * paverArea;

    return {
      projectArea,
      paverArea,
      rawPavers,
      paversNeeded,
      purchasedArea,
    };
  }, [areaLength, areaWidth, paverLength, paverWidth, unit, waste]);

  const areaUnit = unit === "imperial" ? "sq ft" : "sq m";
  const areaDimUnit = unit === "imperial" ? "ft" : "m";
  const paverDimUnit = unit === "imperial" ? "in" : "cm";

  return (
    <ConstructionToolPageShell
      title="Paver Calculator"
      seoTitle="Paver Calculator - Estimate Patio And Driveway Pavers"
      seoDescription="Calculate how many pavers you need for patios, walkways, and driveways. Free paver calculator with area, waste, and count estimates."
      canonical="https://usonlinetools.com/construction/paver-calculator"
      heroDescription="Estimate pavers for patios, driveways, and walkways in seconds. This paver calculator compares project area with individual paver size and adds waste for cuts, edges, and breakage."
      heroIcon={<Construction className="w-3.5 h-3.5" />}
      calculatorLabel="Paver Count Estimator"
      calculatorDescription="Calculate project area, paver count, and waste-adjusted purchase quantity."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Grid2X2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg font-bold text-foreground">Project and paver size</h3>
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
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Project Length ({areaDimUnit})</label>
                <input type="number" min="0" value={areaLength} onChange={(event) => setAreaLength(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Project Width ({areaDimUnit})</label>
                <input type="number" min="0" value={areaWidth} onChange={(event) => setAreaWidth(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Paver Length ({paverDimUnit})</label>
                <input type="number" min="0" value={paverLength} onChange={(event) => setPaverLength(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Paver Width ({paverDimUnit})</label>
                <input type="number" min="0" value={paverWidth} onChange={(event) => setPaverWidth(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Waste %</label>
                <input type="number" min="0" value={waste} onChange={(event) => setWaste(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-500/20 bg-background p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Pavers Needed</p>
                <p className="text-5xl font-black text-amber-700 dark:text-amber-400">{result.paversNeeded}</p>
                <p className="text-sm text-muted-foreground mt-2">Rounded up with waste included</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Project Area</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.projectArea)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{areaUnit}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Paver Area</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.paverArea, 3)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{areaUnit}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Raw Count</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.rawPavers, 1)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Before waste</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Purchased Coverage</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.purchasedArea)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{areaUnit}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid project and paver dimensions to estimate paver quantity.</p>
          )}

          <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Layers3 className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-bold text-foreground">Practical note</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Complex patterns, curves, and border cuts usually need more waste than simple straight layouts. For intricate layouts, use a higher waste allowance.
            </p>
          </div>
        </div>
      }
      howToTitle="How to Use the Paver Calculator"
      howToIntro="Paver estimates start with total project area and compare that area with the footprint of one paver. Waste is then added to cover cuts, breakage, and pattern losses."
      howSteps={[
        {
          title: "Measure the area to be paved",
          description: "Enter the project length and width in the selected unit system. This works well for patios, walkways, and rectangular driveway sections.",
        },
        {
          title: "Enter the paver face size",
          description: "Use the stated face dimensions of the paver itself. The calculator converts each paver into a comparable coverage area.",
        },
        {
          title: "Add a realistic waste percentage",
          description: "Waste is especially important for herringbone, circular, diagonal, or heavily cut layouts. The final result is rounded up to a full paver count.",
        },
      ]}
      formulaTitle="Paver Formulas"
      formulaIntro="The count estimate is built from area coverage. Once the project and paver areas are in the same unit, the rest is straightforward."
      formulaCards={[
        {
          label: "Project Area",
          formula: "Project Area = Length x Width",
          detail: "This is the total paved surface before any waste allowance is added.",
        },
        {
          label: "Raw Paver Count",
          formula: "Raw Count = Project Area / Paver Area",
          detail: "This gives the ideal paver quantity if there were no cuts, no breakage, and no edge waste.",
        },
        {
          label: "Adjusted Count",
          formula: "Pavers Needed = Raw Count x (1 + Waste / 100)",
          detail: "The adjusted count is rounded up because pavers are bought as whole units and waste is unavoidable on most jobs.",
        },
      ]}
      examplesTitle="Paver Examples"
      examplesIntro="A few simple examples show how quickly a clean layout estimate turns into a real purchase quantity."
      examples={[
        {
          title: "Patio Size",
          value: "216 sq ft",
          detail: "An 18 foot by 12 foot patio covers 216 square feet.",
        },
        {
          title: "Standard Paver",
          value: "0.22 sq ft",
          detail: "An 8 inch by 4 inch paver covers about 0.22 square feet.",
        },
        {
          title: "8% Waste",
          value: "1,050 pavers",
          detail: "A layout needing about 972 raw pavers rises to roughly 1,050 pieces after 8% waste is added.",
        },
      ]}
      contentTitle="Why Paver Estimates Need More Than Just Area"
      contentIntro="Paving projects are often underestimated because installers focus on surface area alone and forget how much material is lost at borders, cuts, and pattern changes."
      contentSections={[
        {
          title: "Why waste matters for pavers",
          paragraphs: [
            "A perfectly rectangular grid layout creates less waste than curved edges or decorative patterns. That is why waste percentage is one of the most important inputs in a paver estimate.",
            "Even if the surface area is measured correctly, the actual number of pavers needed can change noticeably once cuts and breakage are taken into account.",
          ],
        },
        {
          title: "Why paver size should match the real product",
          paragraphs: [
            "Pavers are sold in many nominal sizes, and the real installed dimensions can vary slightly by manufacturer. Using the exact paver face size gives a more reliable count.",
            "If the layout includes mixed sizes, border units, or accent pieces, run separate estimates rather than forcing everything into one number.",
          ],
        },
        {
          title: "What this tool helps you plan",
          paragraphs: [
            "This calculator is best for planning paver quantities early in the job, pricing material, and checking whether a supplier quote is in the right range.",
            "Base material, bedding sand, edging, and compaction are separate requirements and should be estimated with their own tools or supplier guidance.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How much waste should I allow for pavers?",
          a: "Simple straight layouts may need only a modest waste percentage, while complex patterns and curved edges usually need more. The right allowance depends on the layout complexity.",
        },
        {
          q: "Does this calculator include base gravel or sand?",
          a: "No. This tool estimates paver quantity only. Base layers and bedding materials should be calculated separately.",
        },
        {
          q: "Can I use metric measurements?",
          a: "Yes. Switch to metric and enter project dimensions in meters and paver dimensions in centimeters.",
        },
        {
          q: "Why is the result rounded up?",
          a: "Pavers are installed as whole pieces, and even a very accurate estimate still needs a full-unit order with waste included.",
        },
      ]}
      relatedTools={[
        { title: "Gravel Calculator", href: "/construction/gravel-calculator", benefit: "Estimate base material beneath pavers." },
        { title: "Material Cost Calculator", href: "/construction/material-cost-calculator", benefit: "Price the paver quantity you plan to order." },
        { title: "Room Area Calculator", href: "/construction/room-area-calculator", benefit: "Double-check project area before ordering." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Patios And Walkways", detail: "Useful for paver surfaces with repeated unit sizes." },
        { label: "Core Output", value: "Paver Count", detail: "Shows raw count, waste-adjusted count, and purchased coverage." },
        { label: "Important Note", value: "Pattern Affects Waste", detail: "Curves and decorative patterns need more overage." },
      ]}
    />
  );
}
