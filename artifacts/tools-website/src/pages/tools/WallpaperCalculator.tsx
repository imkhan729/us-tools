import { useMemo, useState } from "react";
import { Construction, Layers, Target } from "lucide-react";
import ConstructionToolPageShell from "./ConstructionToolPageShell";

type Unit = "metric" | "imperial";

function formatNumber(value: number, digits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export default function WallpaperCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [perimeter, setPerimeter] = useState("18");
  const [wallHeight, setWallHeight] = useState("2.6");
  const [openingsArea, setOpeningsArea] = useState("2");
  const [rollWidth, setRollWidth] = useState("0.53");
  const [rollLength, setRollLength] = useState("10");
  const [wastePercent, setWastePercent] = useState("10");

  const result = useMemo(() => {
    const roomPerimeter = parseFloat(perimeter);
    const height = parseFloat(wallHeight);
    const openings = parseFloat(openingsArea);
    const width = parseFloat(rollWidth);
    const length = parseFloat(rollLength);
    const waste = parseFloat(wastePercent);

    if (
      !Number.isFinite(roomPerimeter) ||
      !Number.isFinite(height) ||
      !Number.isFinite(openings) ||
      !Number.isFinite(width) ||
      !Number.isFinite(length) ||
      !Number.isFinite(waste) ||
      roomPerimeter <= 0 ||
      height <= 0 ||
      openings < 0 ||
      width <= 0 ||
      length <= 0 ||
      waste < 0
    ) {
      return null;
    }

    const wallArea = Math.max(0, roomPerimeter * height - openings);
    const stripsNeeded = Math.ceil(roomPerimeter / width);
    const stripsPerRoll = Math.floor(length / height);

    if (stripsPerRoll <= 0) {
      return {
        wallArea,
        stripsNeeded,
        stripsPerRoll,
        rollsNeeded: null,
        coveragePerRoll: width * length,
      };
    }

    const rollsNeeded = Math.ceil((stripsNeeded * (1 + waste / 100)) / stripsPerRoll);

    return {
      wallArea,
      stripsNeeded,
      stripsPerRoll,
      rollsNeeded,
      coveragePerRoll: width * length,
    };
  }, [openingsArea, perimeter, rollLength, rollWidth, wallHeight, wastePercent]);

  const unitLabel = unit === "metric" ? "m" : "ft";
  const areaLabel = unit === "metric" ? "sq m" : "sq ft";

  return (
    <ConstructionToolPageShell
      title="Wallpaper Calculator"
      seoTitle="Wallpaper Calculator - Estimate Wallpaper Rolls for a Room"
      seoDescription="Calculate wallpaper rolls needed for a room with perimeter, wall height, roll size, and waste allowance. Free wallpaper calculator for room finishing projects."
      canonical="https://usonlinetools.com/construction/wallpaper-calculator"
      heroDescription="Estimate how many wallpaper rolls a room needs by combining room perimeter, wall height, roll dimensions, openings, and a practical waste allowance."
      heroIcon={<Construction className="w-3.5 h-3.5" />}
      calculatorLabel="Wallpaper Roll Estimator"
      calculatorDescription="Calculate wall coverage, strips per roll, and total wallpaper rolls required for room finishing."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg font-bold text-foreground">Room and roll dimensions</h3>
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
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Room Perimeter ({unitLabel})</label>
                <input type="number" min="0" value={perimeter} onChange={(event) => setPerimeter(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Wall Height ({unitLabel})</label>
                <input type="number" min="0" value={wallHeight} onChange={(event) => setWallHeight(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Openings ({areaLabel})</label>
                <input type="number" min="0" value={openingsArea} onChange={(event) => setOpeningsArea(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Roll Width ({unitLabel})</label>
                <input type="number" min="0" value={rollWidth} onChange={(event) => setRollWidth(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Roll Length ({unitLabel})</label>
                <input type="number" min="0" value={rollLength} onChange={(event) => setRollLength(event.target.value)} className="tool-calc-input w-full" />
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
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Wallpaper Rolls Needed</p>
                <p className="text-5xl font-black text-amber-700 dark:text-amber-400">
                  {result.rollsNeeded === null ? "--" : result.rollsNeeded}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {result.rollsNeeded === null ? "Roll length is shorter than the wall height." : "Estimated with roll-strip logic and waste allowance."}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Wall Area</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.wallArea)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{areaLabel}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Strips Needed</p>
                  <p className="text-2xl font-black text-foreground">{result.stripsNeeded}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Strips Per Roll</p>
                  <p className="text-2xl font-black text-foreground">{result.stripsPerRoll}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Coverage Per Roll</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.coveragePerRoll)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{areaLabel}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid room and roll dimensions to estimate wallpaper quantity.</p>
          )}

          <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-bold text-foreground">Pattern note</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Large pattern repeats can increase waste beyond the default margin. If your wallpaper needs pattern matching, add extra allowance beyond the base waste percentage.
            </p>
          </div>
        </div>
      }
      howToTitle="How to Use the Wallpaper Calculator"
      howToIntro="Wallpaper estimating works best when the room is measured by perimeter and the paper is estimated by strips rather than only total area."
      howSteps={[
        {
          title: "Enter room perimeter and wall height",
          description: "These two dimensions define the full wall wrap that needs covering before doors and windows are deducted.",
        },
        {
          title: "Enter the roll width and roll length",
          description: "The roll dimensions determine how many full strips each roll can produce and how much surface one roll can cover.",
        },
        {
          title: "Add openings and waste allowance",
          description: "Subtracting doors and windows improves the estimate, while the waste margin helps account for trimming, alignment, and handling loss.",
        },
      ]}
      formulaTitle="Wallpaper Estimating Formulas"
      formulaIntro="Wallpaper is usually estimated strip by strip because wall height controls how many usable drops can be cut from each roll."
      formulaCards={[
        {
          label: "Strips Needed",
          formula: "Strips Needed = ceil(Room Perimeter / Roll Width)",
          detail: "This estimates how many vertical drops are required to wrap the room walls.",
        },
        {
          label: "Roll Count",
          formula: "Rolls = ceil((Strips Needed x Waste Factor) / Strips Per Roll)",
          detail: "The roll count depends on how many full-height strips one roll can provide after the wall height is considered.",
        },
      ]}
      examplesTitle="Wallpaper Examples"
      examplesIntro="These examples show why roll size and wall height matter as much as the room size."
      examples={[
        {
          title: "Tall Walls",
          value: "Fewer Strips Per Roll",
          detail: "As wall height increases, each roll yields fewer full drops, which raises the total roll count.",
        },
        {
          title: "Wider Paper",
          value: "Fewer Total Strips",
          detail: "A wider wallpaper roll reduces the number of strips needed around the room perimeter.",
        },
        {
          title: "Pattern Waste",
          value: "Extra Rolls",
          detail: "Pattern-matching papers often require more waste than plain or lightly textured rolls.",
        },
      ]}
      contentTitle="Why Wallpaper Is Better Estimated by Strips"
      contentIntro="Wallpaper may look like a simple area problem, but actual ordering depends heavily on the roll geometry and the wall height."
      contentSections={[
        {
          title: "Why wall height changes the roll count",
          paragraphs: [
            "A roll can only produce an exact number of full drops, so taller walls reduce the number of usable strips per roll.",
            "That is why wallpaper ordering often feels less intuitive than paint or drywall estimating.",
          ],
        },
        {
          title: "Why total area alone can be misleading",
          paragraphs: [
            "Area-only estimates may miss the strip-cutting reality of wallpaper rolls, especially when roll width is narrow or wall height is large.",
            "Using strip logic produces a better planning number before ordering begins.",
          ],
        },
        {
          title: "Why waste should be treated seriously",
          paragraphs: [
            "Wallpaper usually needs trimming at corners, edges, and around openings. Pattern repeats can increase loss even further.",
            "A waste allowance is one of the simplest ways to avoid running short partway through installation.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How do I calculate wallpaper rolls for a room?",
          a: "Measure the room perimeter and wall height, enter the wallpaper roll width and length, then calculate how many strips and rolls are needed with waste included.",
        },
        {
          q: "Why does wall height matter so much?",
          a: "Because each roll must be cut into full-height strips. Taller walls reduce the number of usable strips that fit into one roll.",
        },
        {
          q: "Should I subtract windows and doors?",
          a: "Yes, they can reduce the net wall area, although many installers still keep a healthy waste margin because trimming losses remain.",
        },
        {
          q: "Does this include pattern repeat matching?",
          a: "Not directly. If your wallpaper has a strong repeat, increase the waste percentage to cover the extra trimming and alignment loss.",
        },
      ]}
      relatedTools={[
        { title: "Drywall Calculator", href: "/construction/drywall-calculator", benefit: "Estimate wall boarding before decorative finishing starts." },
        { title: "Paint Calculator", href: "/construction/paint-calculator", benefit: "Compare wallpaper finishing with paint coverage planning." },
        { title: "Room Area Calculator", href: "/construction/room-area-calculator", benefit: "Measure the same room surfaces before selecting finishes." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Room Wallcovering Orders", detail: "Useful for bedrooms, living rooms, hallways, and renovation planning." },
        { label: "Core Output", value: "Roll Count", detail: "Shows wall area, strips needed, strips per roll, and rolls required." },
        { label: "Important Note", value: "Patterns Increase Waste", detail: "Pattern repeat matching usually needs more allowance than plain wallpaper." },
      ]}
    />
  );
}
