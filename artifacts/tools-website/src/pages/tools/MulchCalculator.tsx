import { useMemo, useState } from "react";
import { Construction, Ruler, Target } from "lucide-react";
import ConstructionToolPageShell from "./ConstructionToolPageShell";

type Unit = "metric" | "imperial";

function formatNumber(value: number, digits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export default function MulchCalculator() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [length, setLength] = useState("20");
  const [width, setWidth] = useState("6");
  const [depth, setDepth] = useState("3");
  const [beds, setBeds] = useState("2");
  const [bagSize, setBagSize] = useState("2");

  const result = useMemo(() => {
    const bedLength = parseFloat(length);
    const bedWidth = parseFloat(width);
    const bedDepth = parseFloat(depth);
    const bedCount = parseFloat(beds);
    const bag = parseFloat(bagSize);

    if (
      !Number.isFinite(bedLength) ||
      !Number.isFinite(bedWidth) ||
      !Number.isFinite(bedDepth) ||
      !Number.isFinite(bedCount) ||
      !Number.isFinite(bag) ||
      bedLength <= 0 ||
      bedWidth <= 0 ||
      bedDepth <= 0 ||
      bedCount <= 0 ||
      bag <= 0
    ) {
      return null;
    }

    if (unit === "imperial") {
      const volumeCubicFeet = bedLength * bedWidth * (bedDepth / 12) * bedCount;
      const volumeCubicYards = volumeCubicFeet / 27;
      const bagsNeeded = Math.ceil(volumeCubicFeet / bag);

      return {
        area: bedLength * bedWidth * bedCount,
        volumePrimary: volumeCubicYards,
        volumeSecondary: volumeCubicFeet,
        bagsNeeded,
        primaryLabel: "cubic yd",
        secondaryLabel: "cubic ft",
      };
    }

    const volumeCubicMeters = bedLength * bedWidth * (bedDepth / 100) * bedCount;
    const volumeLiters = volumeCubicMeters * 1000;
    const bagsNeeded = Math.ceil(volumeLiters / bag);

    return {
      area: bedLength * bedWidth * bedCount,
      volumePrimary: volumeCubicMeters,
      volumeSecondary: volumeLiters,
      bagsNeeded,
      primaryLabel: "cubic m",
      secondaryLabel: "L",
    };
  }, [bagSize, beds, depth, length, unit, width]);

  const lengthLabel = unit === "imperial" ? "ft" : "m";
  const depthLabel = unit === "imperial" ? "in" : "cm";
  const areaLabel = unit === "imperial" ? "sq ft" : "sq m";

  return (
    <ConstructionToolPageShell
      title="Mulch Calculator"
      seoTitle="Mulch Calculator - Estimate Mulch Volume and Bags Needed"
      seoDescription="Estimate mulch volume and bag count for garden beds with length, width, depth, and bed count. Free mulch calculator for landscaping projects."
      canonical="https://usonlinetools.com/construction/mulch-calculator"
      heroDescription="Estimate how much mulch a landscape bed needs based on bed size, mulch depth, number of beds, and the bag size you plan to buy."
      heroIcon={<Construction className="w-3.5 h-3.5" />}
      calculatorLabel="Landscape Mulch Estimator"
      calculatorDescription="Calculate mulch volume in bulk units and convert the result into bag count for practical purchasing."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg font-bold text-foreground">Bed dimensions</h3>
            </div>

            <div className="mb-4 flex overflow-hidden rounded-lg border border-border sm:w-fit">
              <button
                onClick={() => setUnit("imperial")}
                className={`px-4 py-2 text-sm font-bold transition-colors ${unit === "imperial" ? "bg-amber-600 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
              >
                Imperial
              </button>
              <button
                onClick={() => setUnit("metric")}
                className={`px-4 py-2 text-sm font-bold transition-colors ${unit === "metric" ? "bg-amber-600 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
              >
                Metric
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
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Mulch Depth ({depthLabel})</label>
                <input type="number" min="0" value={depth} onChange={(event) => setDepth(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Number of Beds</label>
                <input type="number" min="1" value={beds} onChange={(event) => setBeds(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Bag Size ({unit === "imperial" ? "cubic ft" : "L"})
                </label>
                <input type="number" min="0" value={bagSize} onChange={(event) => setBagSize(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-500/20 bg-background p-5 text-center">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Bags Needed</p>
                <p className="text-5xl font-black text-amber-700 dark:text-amber-400">{result.bagsNeeded}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Volume required: {formatNumber(result.volumePrimary)} {result.primaryLabel}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Bed Area</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.area)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{areaLabel}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Primary Volume</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.volumePrimary)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{result.primaryLabel}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Secondary Volume</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.volumeSecondary)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{result.secondaryLabel}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Beds Counted</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(parseFloat(beds), 0)}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid bed dimensions, depth, quantity, and bag size to estimate mulch requirements.</p>
          )}

          <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-bold text-foreground">Depth note</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Decorative mulch is often spread at a shallower depth than soil fill. If the goal is weed suppression and moisture retention, check the depth recommended for the specific mulch type.
            </p>
          </div>
        </div>
      }
      howToTitle="How to Use the Mulch Calculator"
      howToIntro="Mulch estimating is mostly a bed-volume problem. This page converts the bed footprint and target depth into the mulch quantity you need in both bulk and bag form."
      howSteps={[
        {
          title: "Measure the bed length and width",
          description: "Use the main rectangular footprint of the landscape bed or average the dimensions if the bed shape is only slightly irregular.",
        },
        {
          title: "Enter the mulch depth and number of beds",
          description: "The depth determines the final volume, and the bed count lets you repeat the same bed size across multiple planting areas.",
        },
        {
          title: "Convert the volume into bag count",
          description: "Enter the mulch bag size you plan to buy so the tool can turn the bulk volume into a practical store quantity.",
        },
      ]}
      formulaTitle="Mulch Estimating Formulas"
      formulaIntro="Mulch quantity is found by multiplying bed area by spread depth, then converting the result into the bulk unit or bag size you plan to purchase."
      formulaCards={[
        {
          label: "Volume",
          formula: "Volume = Length x Width x Depth x Number Of Beds",
          detail: "The spread depth must be converted into the same base unit system as the bed dimensions before the volume is calculated.",
        },
        {
          label: "Bag Count",
          formula: "Bags = ceil(Total Volume / Bag Size)",
          detail: "Bag count is rounded up because mulch is purchased in whole bags, not fractional units.",
        },
      ]}
      examplesTitle="Mulch Examples"
      examplesIntro="These examples show where mulch estimates usually change most."
      examples={[
        {
          title: "Shallow Decorative Layer",
          value: "Lower Volume",
          detail: "A thin mulch cover for appearance uses far less material than a deeper layer intended for weed suppression.",
        },
        {
          title: "Multiple Beds",
          value: "Fast Scale Up",
          detail: "Repeating the same bed size across several areas quickly increases the bag count even when each bed is modest.",
        },
        {
          title: "Bag Conversion",
          value: "Purchase Ready",
          detail: "The bag result helps compare whether bulk delivery or bagged material is the better buy.",
        },
      ]}
      contentTitle="Why Mulch Should Be Estimated by Volume"
      contentIntro="Mulch covers surface area, but it is sold and spread by volume. That is why a simple area estimate is not enough when purchasing material."
      contentSections={[
        {
          title: "Why depth matters",
          paragraphs: [
            "The same bed footprint can need very different mulch quantities depending on whether the material is spread lightly for appearance or more deeply for practical coverage.",
            "Depth is the main factor that turns a flat area into a realistic material estimate.",
          ],
        },
        {
          title: "Why bag size changes the order quickly",
          paragraphs: [
            "Landscape supply shops and home-improvement stores often sell mulch in different bag sizes, so the same project can have very different bag counts depending on the product chosen.",
            "Converting volume to bags on the same page makes the estimate easier to buy without mental conversion.",
          ],
        },
        {
          title: "When bulk delivery may be better",
          paragraphs: [
            "Once the volume grows beyond a moderate bag count, bulk delivery can become more cost-effective and easier to install.",
            "The primary volume output helps compare that bulk option before you commit to the bagged route.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How do I calculate how much mulch I need?",
          a: "Measure the bed length and width, choose the mulch depth, calculate the total volume, and then convert that result into bags or bulk units.",
        },
        {
          q: "Why is mulch measured by volume instead of area?",
          a: "Because mulch is a spread layer with depth. Area alone does not show how much material is required until the thickness is included.",
        },
        {
          q: "Should I buy a little extra mulch?",
          a: "Often yes, especially if the bed edges are irregular or the surface is uneven. Small variations in depth can change the real quantity needed.",
        },
        {
          q: "Can I use this for bark, wood chips, and decorative mulch?",
          a: "Yes. The calculator works for common loose-cover landscape materials as long as the goal is volume and bag estimation.",
        },
      ]}
      relatedTools={[
        { title: "Soil Calculator", href: "/construction/soil-calculator", benefit: "Estimate garden soil fill for beds and planters." },
        { title: "Material Cost Calculator", href: "/construction/material-cost-calculator", benefit: "Turn the mulch quantity into a budget estimate." },
        { title: "Gravel Calculator", href: "/construction/gravel-calculator", benefit: "Estimate loose-fill material for heavier landscape bases." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Landscape Beds", detail: "Useful for garden borders, planting strips, and decorative cover zones." },
        { label: "Core Output", value: "Volume and Bags", detail: "Shows bulk volume and converts it to bag count." },
        { label: "Important Note", value: "Depth Drives Quantity", detail: "Small depth changes can alter the final mulch order substantially." },
      ]}
    />
  );
}
