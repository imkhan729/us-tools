import { useMemo, useState } from "react";
import { Construction, Home, Target } from "lucide-react";
import ConstructionToolPageShell from "./ConstructionToolPageShell";

type Unit = "metric" | "imperial";

const SHEET_OPTIONS = {
  imperial: [
    { label: "4 x 8 ft", area: 32 },
    { label: "4 x 10 ft", area: 40 },
    { label: "4 x 12 ft", area: 48 },
  ],
  metric: [
    { label: "1.2 x 2.4 m", area: 2.88 },
    { label: "1.2 x 2.7 m", area: 3.24 },
    { label: "1.2 x 3.0 m", area: 3.6 },
  ],
};

function formatNumber(value: number, digits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export default function DrywallCalculator() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [roomLength, setRoomLength] = useState("20");
  const [roomWidth, setRoomWidth] = useState("12");
  const [roomHeight, setRoomHeight] = useState("8");
  const [openingsArea, setOpeningsArea] = useState("21");
  const [includeCeiling, setIncludeCeiling] = useState(true);
  const [sheetOption, setSheetOption] = useState("0");
  const [wastePercent, setWastePercent] = useState("10");

  const result = useMemo(() => {
    const length = parseFloat(roomLength);
    const width = parseFloat(roomWidth);
    const height = parseFloat(roomHeight);
    const openings = parseFloat(openingsArea);
    const waste = parseFloat(wastePercent);
    const selectedSheet = SHEET_OPTIONS[unit][parseInt(sheetOption, 10)] ?? SHEET_OPTIONS[unit][0];

    if (
      !Number.isFinite(length) ||
      !Number.isFinite(width) ||
      !Number.isFinite(height) ||
      !Number.isFinite(openings) ||
      !Number.isFinite(waste) ||
      length <= 0 ||
      width <= 0 ||
      height <= 0 ||
      openings < 0 ||
      waste < 0
    ) {
      return null;
    }

    const wallArea = Math.max(0, 2 * (length + width) * height - openings);
    const ceilingArea = includeCeiling ? length * width : 0;
    const netArea = wallArea + ceilingArea;
    const adjustedArea = netArea * (1 + waste / 100);
    const sheetsNeeded = Math.ceil(adjustedArea / selectedSheet.area);

    return {
      wallArea,
      ceilingArea,
      netArea,
      adjustedArea,
      sheetsNeeded,
      sheetLabel: selectedSheet.label,
    };
  }, [includeCeiling, openingsArea, roomHeight, roomLength, roomWidth, sheetOption, unit, wastePercent]);

  const unitLabel = unit === "imperial" ? "ft" : "m";
  const areaLabel = unit === "imperial" ? "sq ft" : "sq m";

  return (
    <ConstructionToolPageShell
      title="Drywall Calculator"
      seoTitle="Drywall Calculator - Estimate Sheets for Walls and Ceilings"
      seoDescription="Estimate drywall sheets needed for walls and ceilings with waste allowance. Free drywall calculator for room size, sheet size, and openings."
      canonical="https://usonlinetools.com/construction/drywall-calculator"
      heroDescription="Estimate how many drywall sheets a room needs by combining wall area, optional ceiling area, sheet size, door and window openings, and a practical waste allowance."
      heroIcon={<Construction className="w-3.5 h-3.5" />}
      calculatorLabel="Drywall Sheet Estimator"
      calculatorDescription="Calculate net wall and ceiling coverage, then convert that area into drywall sheet count."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Home className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg font-bold text-foreground">Room and sheet inputs</h3>
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
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Room Length ({unitLabel})</label>
                <input type="number" min="0" value={roomLength} onChange={(event) => setRoomLength(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Room Width ({unitLabel})</label>
                <input type="number" min="0" value={roomWidth} onChange={(event) => setRoomWidth(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Wall Height ({unitLabel})</label>
                <input type="number" min="0" value={roomHeight} onChange={(event) => setRoomHeight(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Doors and Windows ({areaLabel})</label>
                <input type="number" min="0" value={openingsArea} onChange={(event) => setOpeningsArea(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Sheet Size</label>
                <select value={sheetOption} onChange={(event) => setSheetOption(event.target.value)} className="tool-calc-input w-full">
                  {SHEET_OPTIONS[unit].map((option, index) => (
                    <option key={option.label} value={index}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Waste Allowance %</label>
                <input type="number" min="0" value={wastePercent} onChange={(event) => setWastePercent(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setIncludeCeiling(true)}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${includeCeiling ? "bg-amber-600 text-white" : "border border-border bg-card text-muted-foreground hover:text-foreground"}`}
              >
                Include Ceiling
              </button>
              <button
                onClick={() => setIncludeCeiling(false)}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${!includeCeiling ? "bg-amber-600 text-white" : "border border-border bg-card text-muted-foreground hover:text-foreground"}`}
              >
                Walls Only
              </button>
            </div>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-500/20 bg-background p-5 text-center">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Drywall Sheets Needed</p>
                <p className="text-5xl font-black text-amber-700 dark:text-amber-400">{result.sheetsNeeded}</p>
                <p className="mt-2 text-sm text-muted-foreground">Using {result.sheetLabel} sheets with waste included</p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Wall Area</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.wallArea)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{areaLabel}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Ceiling Area</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.ceilingArea)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{areaLabel}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Net Area</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.netArea)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{areaLabel}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">With Waste</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.adjustedArea)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{areaLabel}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid room dimensions, openings, and a sheet size to estimate drywall quantity.</p>
          )}

          <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-bold text-foreground">Coverage note</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This estimate is for sheet quantity planning. Mud, tape, corner bead, framing irregularities, and code-specific layer requirements should still be checked separately.
            </p>
          </div>
        </div>
      }
      howToTitle="How to Use the Drywall Calculator"
      howToIntro="Drywall estimating starts with surface area. This page combines the room perimeter and wall height, optionally adds the ceiling, subtracts openings, and converts the result into sheet count."
      howSteps={[
        {
          title: "Enter the room size and wall height",
          description: "Use the basic room footprint and wall height to calculate the wall area around the full perimeter.",
        },
        {
          title: "Subtract doors and windows, then choose whether to include the ceiling",
          description: "Openings reduce the sheet coverage needed on walls, while the ceiling adds another full surface area if you are boarding it too.",
        },
        {
          title: "Choose a sheet size and add waste",
          description: "The sheet-size option converts surface area into orderable boards, and the waste allowance covers offcuts and installation loss.",
        },
      ]}
      formulaTitle="Drywall Estimating Formulas"
      formulaIntro="Drywall sheet counts come from translating room surface area into standard board coverage."
      formulaCards={[
        {
          label: "Wall Area",
          formula: "Wall Area = 2 x (Length + Width) x Height - Openings",
          detail: "This gives the net wall surface after door and window openings are removed.",
        },
        {
          label: "Sheets Needed",
          formula: "Sheets = ceil((Net Area x Waste Factor) / Sheet Area)",
          detail: "Waste is applied before dividing by the selected drywall board size so the order includes a practical installation margin.",
        },
      ]}
      examplesTitle="Drywall Examples"
      examplesIntro="These examples show where sheet quantity changes most quickly."
      examples={[
        {
          title: "Walls Only",
          value: "Lower Count",
          detail: "Leaving the ceiling out can reduce the sheet total significantly in standard rooms.",
        },
        {
          title: "Larger Boards",
          value: "Fewer Sheets",
          detail: "Longer boards often reduce the sheet count, but handling and transport still need to be considered.",
        },
        {
          title: "Waste Margin",
          value: "Safer Order",
          detail: "A waste allowance helps avoid being short after cuts around outlets, corners, and openings.",
        },
      ]}
      contentTitle="Why Drywall Estimates Need Surface Logic"
      contentIntro="Drywall is sold by board size, but the project itself is measured in surface area. A good estimate bridges that gap before delivery and installation start."
      contentSections={[
        {
          title: "Why board count is not just wall area",
          paragraphs: [
            "Drywall boards come in fixed dimensions, so the estimate must translate room coverage into sheet count instead of just area.",
            "That is why sheet size matters as much as the room dimensions themselves when the final order is placed.",
          ],
        },
        {
          title: "Why openings and ceilings change the result",
          paragraphs: [
            "Doors and windows reduce the net area on walls, while ceilings add another large rectangular surface that is easy to forget during quick estimating.",
            "Handling both adjustments on the same page gives a closer order quantity before work begins.",
          ],
        },
        {
          title: "Why waste should be included",
          paragraphs: [
            "Drywall work involves offcuts around outlets, corners, openings, and framing irregularities. A small waste margin is standard planning practice.",
            "Ordering too tightly often means an avoidable extra trip for just one or two missing boards.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How do I calculate drywall sheets for a room?",
          a: "Calculate the wall area from the room perimeter and height, subtract openings, add the ceiling if needed, then divide by the sheet area and round up.",
        },
        {
          q: "Should doors and windows be subtracted?",
          a: "Yes, if you want a closer net wall-area estimate. Many installers still keep a waste margin because cuts and layout loss remain unavoidable.",
        },
        {
          q: "Why include a waste allowance?",
          a: "Waste covers offcuts, damage, and fitting losses around corners and openings, which is why most drywall orders include a margin.",
        },
        {
          q: "Does this estimate include studs, tape, or compound?",
          a: "No. This page is specifically for drywall board quantity, not the full finishing-material package.",
        },
      ]}
      relatedTools={[
        { title: "Wallpaper Calculator", href: "/construction/wallpaper-calculator", benefit: "Estimate wall-covering rolls for the same room." },
        { title: "Paint Calculator", href: "/construction/paint-calculator", benefit: "Estimate paint quantity after the drywall stage." },
        { title: "Room Area Calculator", href: "/construction/room-area-calculator", benefit: "Measure room surfaces before choosing finishing materials." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Room Board Estimates", detail: "Useful for walls, optional ceilings, and quick material planning." },
        { label: "Core Output", value: "Sheet Count", detail: "Shows wall area, ceiling area, net coverage, and required boards." },
        { label: "Important Note", value: "Finishing Materials Separate", detail: "Tape, mud, beads, and framing details are not included." },
      ]}
    />
  );
}
