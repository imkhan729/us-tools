import { useMemo, useState } from "react";
import { Construction, Droplets, Truck } from "lucide-react";
import ConstructionToolPageShell from "./ConstructionToolPageShell";

function formatNumber(value: number, digits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

type Unit = "imperial" | "metric";

export default function BitumenCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [length, setLength] = useState("50");
  const [width, setWidth] = useState("6");
  const [applicationRate, setApplicationRate] = useState("1.2");
  const [coats, setCoats] = useState("1");

  const result = useMemo(() => {
    const projectLength = parseFloat(length);
    const projectWidth = parseFloat(width);
    const rate = parseFloat(applicationRate);
    const coatCount = parseFloat(coats);

    if (
      !Number.isFinite(projectLength) ||
      !Number.isFinite(projectWidth) ||
      !Number.isFinite(rate) ||
      !Number.isFinite(coatCount) ||
      projectLength <= 0 ||
      projectWidth <= 0 ||
      rate <= 0 ||
      coatCount <= 0
    ) {
      return null;
    }

    const area = projectLength * projectWidth;
    const totalWeight = area * rate * coatCount;
    const tons = unit === "metric" ? totalWeight / 1000 : totalWeight / 2000;

    return {
      area,
      totalWeight,
      tons,
    };
  }, [applicationRate, coats, length, unit, width]);

  const lengthUnit = unit === "metric" ? "m" : "ft";
  const areaUnit = unit === "metric" ? "sq m" : "sq ft";
  const rateUnit = unit === "metric" ? "kg/sq m" : "lb/sq ft";
  const weightUnit = unit === "metric" ? "kg" : "lb";
  const tonUnit = unit === "metric" ? "metric tons" : "short tons";

  return (
    <ConstructionToolPageShell
      title="Bitumen Calculator"
      seoTitle="Bitumen Calculator - Estimate Bitumen By Area And Application Rate"
      seoDescription="Calculate bitumen quantity for road surfacing and waterproofing jobs. Free bitumen calculator with area, application rate, coats, and total tonnage."
      canonical="https://usonlinetools.com/construction/bitumen-calculator"
      heroDescription="Estimate bitumen quantity from project area, application rate, and number of coats. This calculator is useful for surfacing, waterproofing, and coating jobs where material is specified by coverage rate."
      heroIcon={<Construction className="w-3.5 h-3.5" />}
      calculatorLabel="Bitumen Quantity Estimator"
      calculatorDescription="Calculate total bitumen weight from area, rate, and number of coats."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg font-bold text-foreground">Area and application rate</h3>
            </div>

            <div className="flex rounded-lg overflow-hidden border border-border mb-4 sm:w-fit">
              <button onClick={() => setUnit("metric")} className={`px-4 py-2 text-sm font-bold transition-colors ${unit === "metric" ? "bg-amber-600 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>
                Metric
              </button>
              <button onClick={() => setUnit("imperial")} className={`px-4 py-2 text-sm font-bold transition-colors ${unit === "imperial" ? "bg-amber-600 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>
                Imperial
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Length ({lengthUnit})</label>
                <input type="number" min="0" value={length} onChange={(event) => setLength(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Width ({lengthUnit})</label>
                <input type="number" min="0" value={width} onChange={(event) => setWidth(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Application Rate ({rateUnit})</label>
                <input type="number" min="0" value={applicationRate} onChange={(event) => setApplicationRate(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Coats</label>
                <input type="number" min="1" value={coats} onChange={(event) => setCoats(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-500/20 bg-background p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Bitumen Required</p>
                <p className="text-5xl font-black text-amber-700 dark:text-amber-400">{formatNumber(result.totalWeight)}</p>
                <p className="text-sm text-muted-foreground mt-2">{weightUnit} total</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Project Area</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.area)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{areaUnit}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Tonnage</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.tons, 3)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tonUnit}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Coats Applied</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(parseFloat(coats), 0)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Coverage repeated per coat</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid dimensions, application rate, and coats to calculate bitumen quantity.</p>
          )}

          <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-bold text-foreground">Practical note</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This calculator is best for bitumen applied by surface coverage rate. For full asphalt mix tonnage by compacted thickness, use an asphalt calculator instead.
            </p>
          </div>
        </div>
      }
      howToTitle="How to Use the Bitumen Calculator"
      howToIntro="Bitumen jobs are often priced and specified by coverage rate rather than by full compacted depth, so this calculator focuses on area, rate, and coats."
      howSteps={[
        {
          title: "Measure the coated area",
          description: "Enter the total project length and width in the selected unit system. This could represent a roadway section, waterproofed surface, or coated slab area.",
        },
        {
          title: "Enter the application rate",
          description: "Use the product specification or engineering requirement for the bitumen coverage rate. This is usually given as weight per unit area.",
        },
        {
          title: "Add the number of coats",
          description: "If the system requires more than one coat, the calculator multiplies the material requirement by the number of passes.",
        },
      ]}
      formulaTitle="Bitumen Formulas"
      formulaIntro="Surface-applied bitumen is usually estimated by multiplying project area by the specified rate, then accounting for the number of coats."
      formulaCards={[
        {
          label: "Area",
          formula: "Area = Length x Width",
          detail: "This gives the total surface area receiving the bitumen application.",
        },
        {
          label: "Bitumen Quantity",
          formula: "Total Weight = Area x Application Rate x Coats",
          detail: "Each coat repeats the same coverage rate, so the quantity scales linearly with the number of coats.",
        },
        {
          label: "Tonnage",
          formula: "Tons = Total Weight / 1000 or / 2000",
          detail: "Metric calculations divide kilograms by 1000, while imperial calculations divide pounds by 2000.",
        },
      ]}
      examplesTitle="Bitumen Examples"
      examplesIntro="These simple examples show how coverage-rate planning works for bitumen jobs."
      examples={[
        {
          title: "Road Section",
          value: "300 sq m",
          detail: "A 50 meter by 6 meter section has a surface area of 300 square meters.",
        },
        {
          title: "Single Coat",
          value: "360 kg",
          detail: "At an application rate of 1.2 kilograms per square meter, 300 square meters needs 360 kilograms of bitumen.",
        },
        {
          title: "Two Coats",
          value: "720 kg",
          detail: "If the same section needs two coats, the required bitumen doubles to 720 kilograms.",
        },
      ]}
      contentTitle="Why Bitumen Estimates Should Match The Specification Rate"
      contentIntro="Bitumen can be used in different ways across paving and waterproofing work, which is why the right estimating method depends on how the material is being specified."
      contentSections={[
        {
          title: "Why application rate matters",
          paragraphs: [
            "When bitumen is applied as a surface coating, tack coat, or waterproofing layer, the specification is usually a weight-per-area number. That makes application rate the critical input.",
            "Using a thickness-based asphalt estimate for these cases can produce the wrong answer because the material is not being applied as a full-depth compacted mix.",
          ],
        },
        {
          title: "Why coats must be counted separately",
          paragraphs: [
            "Every coat repeats the material demand across the same area. Even when the coverage rate stays constant, doubling the number of coats doubles the total quantity required.",
            "This is especially useful for waterproofing and seal systems where one coat is not enough to meet the project specification.",
          ],
        },
        {
          title: "How to use this estimate",
          paragraphs: [
            "This tool is ideal for early planning, budgeting, and checking whether a supplier quantity looks reasonable. For final procurement, always use the actual project specification and product data sheet.",
            "If the specification is given in unfamiliar units, convert the rate first so the project dimensions and the application rate stay consistent.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Is this the same as an asphalt calculator?",
          a: "No. This calculator estimates bitumen by area and application rate. Asphalt calculators usually estimate hot mix by compacted thickness and density.",
        },
        {
          q: "What should I enter for application rate?",
          a: "Use the product label, engineering drawing, or project specification. The right rate depends on the bitumen type and the intended application.",
        },
        {
          q: "Why does the result change with coats?",
          a: "Each coat covers the full project area again, so the material quantity increases in direct proportion to the number of coats.",
        },
        {
          q: "Can I use imperial units?",
          a: "Yes. Switch to imperial to enter project dimensions in feet and application rate in pounds per square foot.",
        },
      ]}
      relatedTools={[
        { title: "Asphalt Calculator", href: "/construction/asphalt-calculator", benefit: "Estimate asphalt mix by area, depth, and density." },
        { title: "Material Cost Calculator", href: "/construction/material-cost-calculator", benefit: "Convert the required weight into a budget." },
        { title: "Room Area Calculator", href: "/construction/room-area-calculator", benefit: "Double-check the coated surface area." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Rate-Based Applications", detail: "Useful for coatings, tack coats, and waterproofing." },
        { label: "Core Output", value: "Weight And Tons", detail: "Shows total required weight and approximate tonnage." },
        { label: "Important Note", value: "Use The Spec", detail: "Application rate should come from the real project requirement." },
      ]}
    />
  );
}
