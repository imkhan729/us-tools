import { useMemo, useState } from "react";
import { Construction, LayoutGrid, Package } from "lucide-react";
import ConstructionToolPageShell from "./ConstructionToolPageShell";

function formatNumber(value: number, digits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

type Unit = "imperial" | "metric";

export default function ConcreteBlockCalculator() {
  const [unit, setUnit] = useState<Unit>("imperial");
  const [wallLength, setWallLength] = useState("24");
  const [wallHeight, setWallHeight] = useState("8");
  const [blockLength, setBlockLength] = useState("16");
  const [blockHeight, setBlockHeight] = useState("8");
  const [waste, setWaste] = useState("5");

  const result = useMemo(() => {
    const length = parseFloat(wallLength);
    const height = parseFloat(wallHeight);
    const blockL = parseFloat(blockLength);
    const blockH = parseFloat(blockHeight);
    const wastePercent = parseFloat(waste);

    if (
      !Number.isFinite(length) ||
      !Number.isFinite(height) ||
      !Number.isFinite(blockL) ||
      !Number.isFinite(blockH) ||
      !Number.isFinite(wastePercent) ||
      length <= 0 ||
      height <= 0 ||
      blockL <= 0 ||
      blockH <= 0 ||
      wastePercent < 0
    ) {
      return null;
    }

    const wallArea = length * height;
    const blockArea =
      unit === "imperial"
        ? (blockL / 12) * (blockH / 12)
        : (blockL / 1000) * (blockH / 1000);

    if (blockArea <= 0) return null;

    const rawBlocks = wallArea / blockArea;
    const blocksWithWaste = Math.ceil(rawBlocks * (1 + wastePercent / 100));
    const courses =
      unit === "imperial"
        ? Math.ceil(height / (blockH / 12))
        : Math.ceil(height / (blockH / 1000));

    return {
      wallArea,
      blockArea,
      rawBlocks,
      blocksWithWaste,
      courses,
    };
  }, [blockHeight, blockLength, unit, wallHeight, wallLength, waste]);

  const wallUnit = unit === "imperial" ? "ft" : "m";
  const blockUnit = unit === "imperial" ? "in" : "mm";
  const areaUnit = unit === "imperial" ? "sq ft" : "sq m";

  return (
    <ConstructionToolPageShell
      title="Concrete Block Calculator"
      seoTitle="Concrete Block Calculator - Estimate Wall Blocks And Waste"
      seoDescription="Estimate how many concrete blocks you need for a wall. Free concrete block calculator with wall area, block area, courses, and waste allowance."
      canonical="https://usonlinetools.com/construction/concrete-block-calculator"
      heroDescription="Estimate the number of concrete blocks required for a wall project. This block calculator compares total wall area with block face area and adds a waste allowance for breakage and cuts."
      heroIcon={<Construction className="w-3.5 h-3.5" />}
      calculatorLabel="Wall Block Estimator"
      calculatorDescription="Calculate wall area, block count, and full-order quantity with waste."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <LayoutGrid className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg font-bold text-foreground">Wall and block dimensions</h3>
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
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Wall Length ({wallUnit})</label>
                <input type="number" min="0" value={wallLength} onChange={(event) => setWallLength(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Wall Height ({wallUnit})</label>
                <input type="number" min="0" value={wallHeight} onChange={(event) => setWallHeight(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Block Length ({blockUnit})</label>
                <input type="number" min="0" value={blockLength} onChange={(event) => setBlockLength(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Block Height ({blockUnit})</label>
                <input type="number" min="0" value={blockHeight} onChange={(event) => setBlockHeight(event.target.value)} className="tool-calc-input w-full" />
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
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Concrete Blocks Needed</p>
                <p className="text-5xl font-black text-amber-700 dark:text-amber-400">{result.blocksWithWaste}</p>
                <p className="text-sm text-muted-foreground mt-2">Rounded up with waste included</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Wall Area</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.wallArea)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{areaUnit}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Block Face Area</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.blockArea, 3)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{areaUnit}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Raw Blocks</p>
                  <p className="text-2xl font-black text-foreground">{formatNumber(result.rawBlocks, 1)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Before waste</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Courses</p>
                  <p className="text-2xl font-black text-foreground">{result.courses}</p>
                  <p className="text-xs text-muted-foreground mt-1">Rows of block</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid wall and block dimensions to calculate block quantity.</p>
          )}

          <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-lg font-bold text-foreground">Practical note</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This estimate uses face area only. Mortar joints, reinforcement, openings, and specific bond patterns can change the final order quantity.
            </p>
          </div>
        </div>
      }
      howToTitle="How to Use the Concrete Block Calculator"
      howToIntro="Concrete block estimates are usually based on wall face area divided by the face area of a single block, then adjusted upward for practical site waste."
      howSteps={[
        {
          title: "Measure the wall",
          description: "Enter total wall length and height in the selected unit system. For large windows or doors, you can reduce the wall area manually before ordering.",
        },
        {
          title: "Enter block size",
          description: "Use the nominal face dimensions of the concrete block you plan to buy. The default values match common block sizes but should be checked against your supplier.",
        },
        {
          title: "Add waste and review courses",
          description: "A modest waste percentage helps cover cuts, damage, and breakage. The calculator also estimates how many courses of block your wall height represents.",
        },
      ]}
      formulaTitle="Concrete Block Formulas"
      formulaIntro="Concrete block takeoffs are area-based. The wall surface is compared with the face coverage of a single block."
      formulaCards={[
        {
          label: "Wall Area",
          formula: "Wall Area = Wall Length x Wall Height",
          detail: "This is the total surface area of the wall before deductions for openings or allowances for waste.",
        },
        {
          label: "Raw Block Count",
          formula: "Raw Blocks = Wall Area / Block Face Area",
          detail: "A block count based on face area is a fast estimating method for standard masonry walls.",
        },
        {
          label: "Order Quantity",
          formula: "Blocks Needed = Raw Blocks x (1 + Waste / 100)",
          detail: "Waste is added and then rounded up so the result reflects a realistic purchasing quantity.",
        },
      ]}
      examplesTitle="Concrete Block Examples"
      examplesIntro="The numbers below show how standard wall dimensions translate into a fast block estimate."
      examples={[
        {
          title: "Wall Face",
          value: "192 sq ft",
          detail: "A wall measuring 24 feet long by 8 feet high has 192 square feet of face area.",
        },
        {
          title: "Standard Block",
          value: "0.89 sq ft",
          detail: "A 16 inch by 8 inch block covers about 0.89 square feet of wall face.",
        },
        {
          title: "5% Waste",
          value: "227 blocks",
          detail: "A wall needing roughly 215 raw blocks becomes about 227 blocks after a 5% waste allowance.",
        },
      ]}
      contentTitle="Why Concrete Block Estimates Need A Waste Allowance"
      contentIntro="Block walls may look repetitive on paper, but real masonry work still creates breakage, cuts, and layout adjustments that affect final ordering."
      contentSections={[
        {
          title: "Why face area is a useful estimate",
          paragraphs: [
            "Face area gives a quick and practical starting point for estimating concrete blocks. It works well for straight walls using standard block sizes.",
            "This method is widely used early in planning because it is simple, transparent, and easy to adjust as the wall layout changes.",
          ],
        },
        {
          title: "What this calculator does not include",
          paragraphs: [
            "The result does not automatically deduct doors, windows, bond beams, lintels, or special corner pieces. Those details should be reviewed before placing a final order.",
            "Mortar thickness and local block dimensions can also change the exact count, so this is best treated as a planning estimate rather than a shop drawing takeoff.",
          ],
        },
        {
          title: "Why courses are helpful",
          paragraphs: [
            "The course count is useful for visualizing wall height and planning layout. It also helps identify when a wall height may require cut blocks or special top-course adjustments.",
            "Even if the total block count is correct, the number of courses can influence labor, reinforcement layout, and cutting time.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Does this calculator subtract window and door openings?",
          a: "Not automatically. For a rough estimate you can keep small openings in the total, but for large openings it is better to reduce the wall area manually.",
        },
        {
          q: "Why do I need a waste percentage for block?",
          a: "Blocks can chip, crack, or require cuts around corners and wall ends. A waste allowance helps avoid ordering too few units.",
        },
        {
          q: "Can I use metric block sizes?",
          a: "Yes. Switch the calculator to metric and enter wall dimensions in meters and block sizes in millimeters.",
        },
        {
          q: "Is this enough for a final material order?",
          a: "It is a strong planning estimate, but supplier-specific sizes, openings, reinforcement, and wall details should still be checked before final purchase.",
        },
      ]}
      relatedTools={[
        { title: "Brick Calculator", href: "/construction/brick-calculator", benefit: "Estimate smaller masonry units for brick walls." },
        { title: "Cement Calculator", href: "/construction/cement-calculator", benefit: "Plan cement needs for mortar or related work." },
        { title: "Material Cost Calculator", href: "/construction/material-cost-calculator", benefit: "Convert block counts into a project budget." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Wall Planning", detail: "Useful for straight walls and early takeoff estimates." },
        { label: "Core Output", value: "Block Count", detail: "Shows raw blocks, waste-adjusted quantity, and courses." },
        { label: "Important Note", value: "Openings Matter", detail: "Large windows and doors should be deducted manually." },
      ]}
    />
  );
}
