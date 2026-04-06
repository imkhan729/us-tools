import { useMemo, useState } from "react";
import { Construction, Droplets, Waves } from "lucide-react";
import ConstructionToolPageShell from "./ConstructionToolPageShell";

function formatNumber(value: number, digits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

type Unit = "imperial" | "metric";

export default function PoolSaltCalculator() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [length, setLength] = useState("30");
  const [width, setWidth] = useState("15");
  const [averageDepth, setAverageDepth] = useState("5");
  const [currentPpm, setCurrentPpm] = useState("2200");
  const [targetPpm, setTargetPpm] = useState("3200");

  const result = useMemo(() => {
    const poolLength = parseFloat(length);
    const poolWidth = parseFloat(width);
    const depth = parseFloat(averageDepth);
    const current = parseFloat(currentPpm);
    const target = parseFloat(targetPpm);

    if (
      !Number.isFinite(poolLength) ||
      !Number.isFinite(poolWidth) ||
      !Number.isFinite(depth) ||
      !Number.isFinite(current) ||
      !Number.isFinite(target) ||
      poolLength <= 0 ||
      poolWidth <= 0 ||
      depth <= 0 ||
      current < 0 ||
      target < 0
    ) {
      return null;
    }

    const volumeLiters =
      unit === "imperial"
        ? poolLength * poolWidth * depth * 28.3168
        : poolLength * poolWidth * depth * 1000;

    const volumeDisplay =
      unit === "imperial"
        ? poolLength * poolWidth * depth * 7.48052
        : volumeLiters;

    const increasePpm = Math.max(0, target - current);
    const saltKg = (volumeLiters * increasePpm) / 1_000_000;
    const saltLb = saltKg * 2.20462;
    const bags40lb = Math.ceil(saltLb / 40);

    return {
      volumeDisplay,
      increasePpm,
      saltKg,
      saltLb,
      bags40lb,
    };
  }, [averageDepth, currentPpm, length, targetPpm, unit, width]);

  const lengthUnit = unit === "imperial" ? "ft" : "m";
  const volumeUnit = unit === "imperial" ? "gallons" : "liters";

  return (
    <ConstructionToolPageShell
      title="Pool Salt Calculator"
      seoTitle="Pool Salt Calculator - Estimate Salt Needed For A Saltwater Pool"
      seoDescription="Calculate pool salt needed to raise salt levels in a saltwater pool. Free pool salt calculator with volume, ppm increase, pounds, kilograms, and bag estimates."
      canonical="https://usonlinetools.com/construction/pool-salt-calculator"
      heroDescription="Estimate how much salt to add to a saltwater pool based on pool size and the difference between current and target salt levels. This calculator converts pool volume and ppm change into practical bag counts."
      heroIcon={<Construction className="w-3.5 h-3.5" />}
      calculatorLabel="Saltwater Pool Salt Estimator"
      calculatorDescription="Calculate pool volume, salt increase needed, and the amount of salt to add."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Waves className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg font-bold text-foreground">Pool dimensions and salt level</h3>
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
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Length ({lengthUnit})</label>
                <input type="number" min="0" value={length} onChange={(event) => setLength(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Width ({lengthUnit})</label>
                <input type="number" min="0" value={width} onChange={(event) => setWidth(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Average Depth ({lengthUnit})</label>
                <input type="number" min="0" value={averageDepth} onChange={(event) => setAverageDepth(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Current Salt Level (ppm)</label>
                <input type="number" min="0" value={currentPpm} onChange={(event) => setCurrentPpm(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Target Salt Level (ppm)</label>
                <input type="number" min="0" value={targetPpm} onChange={(event) => setTargetPpm(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-500/20 bg-background p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Salt To Add</p>
                <p className="text-5xl font-black text-amber-700 dark:text-amber-400">{formatNumber(result.saltLb)}</p>
                <p className="text-sm text-muted-foreground mt-2">lb ({formatNumber(result.saltKg)} kg)</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Pool Volume</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.volumeDisplay, 0)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{volumeUnit}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Increase Needed</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.increasePpm, 0)}</p>
                  <p className="text-xs text-muted-foreground mt-1">ppm</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">40 lb Bags</p>
                  <p className="text-2xl font-black text-foreground">{result.bags40lb}</p>
                  <p className="text-xs text-muted-foreground mt-1">Rounded up</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                  <p className="text-2xl font-black text-foreground">{result.increasePpm > 0 ? "Add Salt" : "On Target"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Based on current vs target ppm</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid pool dimensions and salt levels to calculate how much salt to add.</p>
          )}

          <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-bold text-foreground">Practical note</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Always verify the target salt range recommended by your salt chlorine generator or pool manufacturer before adding salt.
            </p>
          </div>
        </div>
      }
      howToTitle="How to Use the Pool Salt Calculator"
      howToIntro="Saltwater pools work within a target salt range. This calculator estimates how much salt is needed to move from the current ppm reading to your desired level."
      howSteps={[
        {
          title: "Enter your pool size",
          description: "Measure pool length, width, and average depth using either imperial or metric units. The calculator converts those dimensions into total pool volume.",
        },
        {
          title: "Enter current and target salt levels",
          description: "Use a recent pool test result for the current salt level and the manufacturer recommendation for the target salt level.",
        },
        {
          title: "Review the amount of salt to add",
          description: "The result shows the required increase in ppm, the equivalent amount of salt in pounds and kilograms, and the approximate number of 40-pound bags.",
        },
      ]}
      formulaTitle="Pool Salt Formulas"
      formulaIntro="Pool salt calculations are based on pool volume and the difference between current and target salt concentration."
      formulaCards={[
        {
          label: "Pool Volume",
          formula: "Volume = Length x Width x Average Depth",
          detail: "A rectangular pool estimate starts with geometric volume, then converts that volume into gallons or liters.",
        },
        {
          label: "Salt Increase",
          formula: "Increase Needed = Target ppm - Current ppm",
          detail: "Only the difference between the two readings matters for the salt addition estimate.",
        },
        {
          label: "Salt Required",
          formula: "Salt kg = Liters x Increase ppm / 1,000,000",
          detail: "Because 1 ppm is 1 milligram per liter, the required salt mass comes directly from liters multiplied by the ppm increase.",
        },
      ]}
      examplesTitle="Pool Salt Examples"
      examplesIntro="These examples show how pool size and ppm difference affect the amount of salt needed."
      examples={[
        {
          title: "Pool Volume",
          value: "16,831 gal",
          detail: "A 30 foot by 15 foot pool with 5 feet average depth holds about 16,831 gallons.",
        },
        {
          title: "PPM Increase",
          value: "1,000 ppm",
          detail: "Raising the pool from 2,200 ppm to 3,200 ppm means increasing salt concentration by 1,000 ppm.",
        },
        {
          title: "Salt Needed",
          value: "140 lb",
          detail: "For that example pool, a 1,000 ppm increase needs roughly 140 pounds of salt, or about four 40 pound bags.",
        },
      ]}
      contentTitle="Why Pool Salt Estimates Should Start With Volume"
      contentIntro="Salt additions should be based on pool water volume rather than guesswork. Even small errors in volume can noticeably change the amount of salt added."
      contentSections={[
        {
          title: "Why average depth matters",
          paragraphs: [
            "Pools rarely have a flat bottom, so average depth is the most practical way to estimate water volume. A shallow-to-deep pool should use the average of the main depth range.",
            "If the pool has an unusual shape, this rectangular estimate still provides a useful planning number, but the final adjustment may need a real measured pool volume.",
          ],
        },
        {
          title: "Why ppm difference is more important than target alone",
          paragraphs: [
            "The amount of salt needed depends on how far below target your current reading is. A large pool with a small ppm difference may need less salt than a smaller pool with a bigger ppm gap.",
            "That is why both current and target salt levels are required for a realistic estimate.",
          ],
        },
        {
          title: "How to use the result safely",
          paragraphs: [
            "Pool operators often add most of the estimated salt first, let it dissolve and circulate, and then retest before adding more. That avoids overshooting the target range.",
            "Different salt systems have slightly different recommended ranges, so always confirm the correct target level from your equipment documentation.",
          ],
        },
      ]}
      faqs={[
        {
          q: "What is a good target salt level for a saltwater pool?",
          a: "The correct target depends on your chlorinator or pool system. Many systems operate within a manufacturer-specified range, so use that recommendation instead of guessing.",
        },
        {
          q: "Does this calculator work for non-rectangular pools?",
          a: "It provides a useful estimate, but irregular pools may need a more precise volume measurement for final adjustment.",
        },
        {
          q: "Why does the calculator show 40 pound bags?",
          a: "That is a common retail packaging size, so it helps convert the calculated salt requirement into a practical purchase estimate.",
        },
        {
          q: "Should I add the full amount at once?",
          a: "Many pool owners add most of the estimate, circulate the water, and retest before adding more. That helps prevent overshooting the target salt level.",
        },
      ]}
      relatedTools={[
        { title: "Water Tank Calculator", href: "/construction/water-tank-calculator", benefit: "Estimate water volume for tanks and storage." },
        { title: "Material Cost Calculator", href: "/construction/material-cost-calculator", benefit: "Budget the salt quantity before purchase." },
        { title: "Room Area Calculator", href: "/construction/room-area-calculator", benefit: "Use dimensions carefully before calculating volume." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Saltwater Pools", detail: "Useful when adjusting salt levels after testing." },
        { label: "Core Output", value: "Salt To Add", detail: "Shows pounds, kilograms, bags, and ppm increase." },
        { label: "Important Note", value: "Check Equipment Range", detail: "Target ppm should come from the pool system guidance." },
      ]}
    />
  );
}
