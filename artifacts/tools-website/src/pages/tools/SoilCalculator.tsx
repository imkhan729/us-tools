import { useMemo, useState } from "react";
import { Construction, Ruler, Target } from "lucide-react";
import ConstructionToolPageShell from "./ConstructionToolPageShell";

type Unit = "metric" | "imperial";

function formatNumber(value: number, digits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export default function SoilCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [length, setLength] = useState("2.4");
  const [width, setWidth] = useState("1.2");
  const [depth, setDepth] = useState("30");
  const [beds, setBeds] = useState("3");
  const [extraFillPercent, setExtraFillPercent] = useState("5");
  const [bagSize, setBagSize] = useState("40");

  const result = useMemo(() => {
    const bedLength = parseFloat(length);
    const bedWidth = parseFloat(width);
    const bedDepth = parseFloat(depth);
    const bedCount = parseFloat(beds);
    const extra = parseFloat(extraFillPercent);
    const bag = parseFloat(bagSize);

    if (
      !Number.isFinite(bedLength) ||
      !Number.isFinite(bedWidth) ||
      !Number.isFinite(bedDepth) ||
      !Number.isFinite(bedCount) ||
      !Number.isFinite(extra) ||
      !Number.isFinite(bag) ||
      bedLength <= 0 ||
      bedWidth <= 0 ||
      bedDepth <= 0 ||
      bedCount <= 0 ||
      extra < 0 ||
      bag <= 0
    ) {
      return null;
    }

    if (unit === "metric") {
      const baseVolumeM3 = bedLength * bedWidth * (bedDepth / 100) * bedCount;
      const adjustedVolumeM3 = baseVolumeM3 * (1 + extra / 100);
      const liters = adjustedVolumeM3 * 1000;
      const bagsNeeded = Math.ceil(liters / bag);

      return {
        area: bedLength * bedWidth * bedCount,
        baseVolume: baseVolumeM3,
        adjustedVolume: adjustedVolumeM3,
        secondaryVolume: liters,
        bagsNeeded,
        primaryLabel: "cubic m",
        secondaryLabel: "L",
      };
    }

    const baseVolumeCubicFt = bedLength * bedWidth * (bedDepth / 12) * bedCount;
    const adjustedVolumeCubicFt = baseVolumeCubicFt * (1 + extra / 100);
    const cubicYards = adjustedVolumeCubicFt / 27;
    const bagsNeeded = Math.ceil(adjustedVolumeCubicFt / bag);

    return {
      area: bedLength * bedWidth * bedCount,
      baseVolume: cubicYards,
      adjustedVolume: adjustedVolumeCubicFt,
      secondaryVolume: adjustedVolumeCubicFt,
      bagsNeeded,
      primaryLabel: "cubic yd",
      secondaryLabel: "cubic ft",
    };
  }, [bagSize, beds, depth, extraFillPercent, length, unit, width]);

  const lengthLabel = unit === "metric" ? "m" : "ft";
  const depthLabel = unit === "metric" ? "cm" : "in";
  const areaLabel = unit === "metric" ? "sq m" : "sq ft";

  return (
    <ConstructionToolPageShell
      title="Soil Calculator"
      seoTitle="Soil Calculator - Estimate Soil Volume for Garden Beds"
      seoDescription="Calculate soil volume and bag count for raised beds, garden beds, and planters. Free soil calculator with depth, quantity, and extra fill allowance."
      canonical="https://usonlinetools.com/construction/soil-calculator"
      heroDescription="Estimate how much soil your raised beds or planting areas need, including extra fill allowance for settling, leveling, and practical installation loss."
      heroIcon={<Construction className="w-3.5 h-3.5" />}
      calculatorLabel="Garden Soil Estimator"
      calculatorDescription="Calculate base soil volume, extra fill allowance, and the bag count needed for beds and planters."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg font-bold text-foreground">Bed and fill inputs</h3>
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
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Bed Length ({lengthLabel})</label>
                <input type="number" min="0" value={length} onChange={(event) => setLength(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Bed Width ({lengthLabel})</label>
                <input type="number" min="0" value={width} onChange={(event) => setWidth(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Fill Depth ({depthLabel})</label>
                <input type="number" min="0" value={depth} onChange={(event) => setDepth(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Number of Beds</label>
                <input type="number" min="1" value={beds} onChange={(event) => setBeds(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Extra Fill %</label>
                <input type="number" min="0" value={extraFillPercent} onChange={(event) => setExtraFillPercent(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Bag Size ({unit === "metric" ? "L" : "cubic ft"})
                </label>
                <input type="number" min="0" value={bagSize} onChange={(event) => setBagSize(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-500/20 bg-background p-5 text-center">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Soil Bags Needed</p>
                <p className="text-5xl font-black text-amber-700 dark:text-amber-400">{result.bagsNeeded}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Adjusted fill volume: {formatNumber(unit === "metric" ? result.adjustedVolume : result.baseVolume)} {unit === "metric" ? result.primaryLabel : result.primaryLabel}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Bed Area</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.area)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{areaLabel}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Base Volume</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.baseVolume)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{result.primaryLabel}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Adjusted Fill</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.adjustedVolume)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{unit === "metric" ? "cubic m" : "cubic ft"}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Secondary Volume</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.secondaryVolume)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{result.secondaryLabel}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid bed dimensions, fill depth, quantity, and bag size to estimate soil needs.</p>
          )}

          <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-bold text-foreground">Settling note</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Fresh soil often settles after watering and planting. The extra-fill percentage helps cover top-up material so the beds do not finish lower than planned.
            </p>
          </div>
        </div>
      }
      howToTitle="How to Use the Soil Calculator"
      howToIntro="Soil estimating is similar to other fill calculations, but it often needs a small extra allowance because soil settles and compacts after placement."
      howSteps={[
        {
          title: "Enter the bed length, width, and fill depth",
          description: "Use the inside dimensions of the raised bed, planter, or garden zone you intend to fill with soil.",
        },
        {
          title: "Add the number of identical beds and extra fill allowance",
          description: "Multiple beds can be estimated at once, and the extra-fill percentage adds a practical margin for settling and leveling.",
        },
        {
          title: "Convert the result into bag count",
          description: "Enter the bag size you plan to buy so the page can translate the soil volume into a realistic purchase quantity.",
        },
      ]}
      formulaTitle="Soil Estimating Formulas"
      formulaIntro="Soil fill starts with bed volume, then adds a small margin when settling or top-up allowance is expected."
      formulaCards={[
        {
          label: "Base Volume",
          formula: "Volume = Length x Width x Depth x Number Of Beds",
          detail: "This gives the soil quantity needed to fill the measured bed volume before any allowance is added.",
        },
        {
          label: "Adjusted Fill",
          formula: "Adjusted Volume = Base Volume x (1 + Extra Fill %)",
          detail: "The extra-fill margin helps cover settling, grading, and final top-up after the soil is placed.",
        },
      ]}
      examplesTitle="Soil Examples"
      examplesIntro="These examples show why soil estimates are often slightly higher than the pure geometric bed volume."
      examples={[
        {
          title: "Raised Beds",
          value: "Repeatable",
          detail: "If all beds are the same size, one set of dimensions can be multiplied across the whole garden area.",
        },
        {
          title: "Settling Margin",
          value: "Useful Buffer",
          detail: "A small top-up allowance helps avoid a second trip when freshly filled soil settles after watering.",
        },
        {
          title: "Bag Conversion",
          value: "Store Ready",
          detail: "The bag count makes it easier to compare bagged products with bulk-delivery pricing.",
        },
      ]}
      contentTitle="Why Soil Estimates Often Need Extra Allowance"
      contentIntro="Unlike rigid fill materials, soil can settle, compact, and level out after placement. That is why a purely geometric estimate is often a little too tight in practice."
      contentSections={[
        {
          title: "Why settling changes the real fill need",
          paragraphs: [
            "Fresh garden soil usually settles after it is watered, planted, and leveled. That means the initial filled height can drop below the target finish line.",
            "A modest extra-fill allowance helps avoid leaving the bed underfilled after the first round of settling.",
          ],
        },
        {
          title: "Why bag size matters in planning",
          paragraphs: [
            "Garden soil is sold in many bag sizes, so the same bed volume can produce very different bag counts depending on the product you choose.",
            "Converting the volume into bags early makes price comparison much easier at the store or supplier.",
          ],
        },
        {
          title: "When bulk soil may be better",
          paragraphs: [
            "Once the volume grows across several raised beds, bulk soil delivery can become more practical than carrying many small bags.",
            "The volume outputs on this page help compare that decision before you buy.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How do I calculate how much soil I need for a raised bed?",
          a: "Measure the inside length, width, and fill depth of the bed, multiply for volume, then add a small allowance for settling if needed.",
        },
        {
          q: "Why is the soil estimate higher than the simple bed volume?",
          a: "The extra-fill percentage is added to account for settling, leveling, and practical top-up material.",
        },
        {
          q: "Can I use this for planters and pots?",
          a: "Yes, as long as you approximate the container as a rectangular volume or use an equivalent length-width-depth measurement.",
        },
        {
          q: "Should I buy bagged soil or bulk soil?",
          a: "For small projects bagged soil is convenient. For larger bed volumes, the total output may show that bulk delivery is more efficient.",
        },
      ]}
      relatedTools={[
        { title: "Mulch Calculator", href: "/construction/mulch-calculator", benefit: "Estimate the mulch layer that goes on top of the soil." },
        { title: "Material Cost Calculator", href: "/construction/material-cost-calculator", benefit: "Turn the soil quantity into a rough budget." },
        { title: "Gravel Calculator", href: "/construction/gravel-calculator", benefit: "Estimate base material for drainage or bed preparation." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Raised Beds and Garden Fill", detail: "Useful for beds, planters, and small landscape soil projects." },
        { label: "Core Output", value: "Volume and Bags", detail: "Shows base volume, adjusted fill, and bag count." },
        { label: "Important Note", value: "Allow for Settling", detail: "Soil usually needs a small top-up margin after installation." },
      ]}
    />
  );
}
