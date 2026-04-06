import { useMemo, useState } from "react";
import {
  Compass,
  Copy,
  Crosshair,
  Gauge,
  Mouse,
  RotateCcw,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type BuildMode = "filled" | "hollow";

type Segment = {
  start: number;
  length: number;
};

function toNumber(input: string, fallback = 0) {
  const value = Number.parseFloat(input);
  return Number.isFinite(value) ? value : fallback;
}

function positive(input: string, fallback = 0) {
  return Math.max(0, toNumber(input, fallback));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function format(value: number, digits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

function buildPatternLabel(segments: Segment[]) {
  if (segments.length === 0) return "No blocks";
  if (segments.length === 1) return `${segments[0].length} blocks`;
  if (segments.length === 2) {
    const gap = segments[1].start - (segments[0].start + segments[0].length);
    return `${segments[0].length} blocks | ${gap} gap | ${segments[1].length} blocks`;
  }
  return segments.map((segment) => `${segment.length} blocks`).join(" | ");
}

export default function MinecraftCircleCalculator() {
  const [diameterInput, setDiameterInput] = useState("17");
  const [thicknessInput, setThicknessInput] = useState("1");
  const [mode, setMode] = useState<BuildMode>("hollow");
  const [copiedLabel, setCopiedLabel] = useState("");

  const circle = useMemo(() => {
    const diameter = clamp(Math.round(positive(diameterInput, 17)), 3, 64);
    const radius = diameter / 2;
    const thickness = clamp(Math.round(positive(thicknessInput, 1)), 1, Math.max(1, Math.floor(diameter / 2)));
    const center = (diameter - 1) / 2;
    const rows: Array<{ row: number; count: number; leftPad: number; segments: Segment[] }> = [];
    const cells: boolean[][] = [];
    let blockCount = 0;

    for (let y = 0; y < diameter; y += 1) {
      const row: boolean[] = [];
      const segments: Segment[] = [];
      let currentStart = -1;
      let count = 0;

      for (let x = 0; x < diameter; x += 1) {
        const dx = x - center;
        const dy = y - center;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const filled = mode === "filled"
          ? distance <= radius
          : distance <= radius && distance > Math.max(0, radius - thickness);

        row.push(filled);

        if (filled) {
          count += 1;
          blockCount += 1;
          if (currentStart === -1) currentStart = x;
        } else if (currentStart !== -1) {
          segments.push({ start: currentStart, length: x - currentStart });
          currentStart = -1;
        }
      }

      if (currentStart !== -1) {
        segments.push({ start: currentStart, length: diameter - currentStart });
      }

      rows.push({
        row: y + 1,
        count,
        leftPad: segments[0]?.start ?? diameter,
        segments,
      });
      cells.push(row);
    }

    const topHalfRows = rows.slice(0, Math.ceil(diameter / 2)).filter((row) => row.count > 0);
    const uniquePatterns = new Set(topHalfRows.map((row) => buildPatternLabel(row.segments))).size;
    const circumferenceEstimate = 2 * Math.PI * radius;
    const areaEstimate = Math.PI * radius * radius;

    return {
      diameter,
      radius,
      thickness,
      blockCount,
      rows,
      cells,
      topHalfRows,
      uniquePatterns,
      circumferenceEstimate,
      areaEstimate,
    };
  }, [diameterInput, mode, thicknessInput]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const resetAll = () => {
    setDiameterInput("17");
    setThicknessInput("1");
    setMode("hollow");
  };

  const loadSpawnPreset = () => {
    setDiameterInput("33");
    setThicknessInput("1");
    setMode("hollow");
  };

  const loadFilledPreset = () => {
    setDiameterInput("21");
    setThicknessInput("2");
    setMode("filled");
  };

  const dimensionSnippet = [
    `Minecraft circle mode: ${mode}`,
    `Diameter: ${circle.diameter} blocks`,
    `Radius: ${format(circle.radius, 1)} blocks`,
    `Block count: ${circle.blockCount}`,
    `Unique top-half row patterns: ${circle.uniquePatterns}`,
  ].join("\n");

  const buildSnippet = circle.topHalfRows
    .map((row) => `Row ${row.row}: pad ${row.leftPad}, ${buildPatternLabel(row.segments)}`)
    .join("\n");

  const previewSize = `${Math.max(circle.diameter * 14, 260)}px`;

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={loadSpawnPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load 33 Block Ring
        </button>
        <button onClick={loadFilledPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Filled Dome Base
        </button>
        <button onClick={resetAll} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Circle Dimensions</p>
                <p className="text-sm text-muted-foreground">Generate a Minecraft circle grid from diameter, then switch between hollow and filled builds.</p>
              </div>
              <Target className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Diameter</label>
                <input type="number" min="3" max="64" step="1" value={diameterInput} onChange={(event) => setDiameterInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Wall Thickness</label>
                <input type="number" min="1" step="1" value={thicknessInput} onChange={(event) => setThicknessInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Mode</label>
                <select value={mode} onChange={(event) => setMode(event.target.value as BuildMode)} className="tool-calc-input w-full">
                  <option value="hollow">Hollow Ring</option>
                  <option value="filled">Filled Circle</option>
                </select>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Radius</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(circle.radius, 1)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Blocks Needed</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(circle.blockCount, 0)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Circumference</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(circle.circumferenceEstimate, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Area</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(circle.areaEstimate, 2)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Block Preview</p>
                <p className="text-sm text-muted-foreground">Each square is a Minecraft block. Use the preview to confirm the pattern before you place it in a survival build.</p>
              </div>
              <Crosshair className="w-5 h-5 text-blue-500" />
            </div>

            <div className="overflow-auto rounded-xl border border-border bg-slate-950 p-3">
              <div
                className="grid gap-[2px] mx-auto"
                style={{ gridTemplateColumns: `repeat(${circle.diameter}, minmax(0, 1fr))`, width: previewSize, minWidth: previewSize }}
              >
                {circle.cells.flatMap((row, rowIndex) =>
                  row.map((filled, cellIndex) => (
                    <span
                      key={`${rowIndex}-${cellIndex}`}
                      className={`aspect-square rounded-[2px] ${filled ? "bg-emerald-400" : "bg-slate-800"}`}
                    />
                  )),
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Top-Half Build Instructions</p>
                <p className="text-sm text-muted-foreground">Build the top half row by row, then mirror the pattern downward to finish the full circle.</p>
              </div>
              <Compass className="w-5 h-5 text-blue-500" />
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60">
                    <th className="px-4 py-3 text-left font-bold text-foreground">Row</th>
                    <th className="px-4 py-3 text-left font-bold text-foreground">Left Pad</th>
                    <th className="px-4 py-3 text-left font-bold text-foreground">Pattern</th>
                    <th className="px-4 py-3 text-left font-bold text-foreground">Blocks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {circle.topHalfRows.map((row) => (
                    <tr key={row.row}>
                      <td className="px-4 py-3 text-muted-foreground">{row.row}</td>
                      <td className="px-4 py-3 font-mono text-foreground">{row.leftPad}</td>
                      <td className="px-4 py-3 text-foreground">{buildPatternLabel(row.segments)}</td>
                      <td className="px-4 py-3 font-bold text-blue-600">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Reading</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Block Budget</p>
                <p className="mt-1">This {circle.diameter}-block {mode} circle uses about {format(circle.blockCount, 0)} blocks, which is the number to plan around before you start laying foundations or gathering materials.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Instruction Count</p>
                <p className="mt-1">You only need {circle.topHalfRows.length} unique top-half rows. After that, mirror the same sequence downward to finish the bottom half cleanly.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Pattern Variety</p>
                <p className="mt-1">This build uses {circle.uniquePatterns} unique row patterns in the top half, which gives you a quick sense of how repetitive or detailed the layout will feel during placement.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            <div className="space-y-3">
              {[
                { label: "Dimension summary", value: dimensionSnippet },
                { label: "Top-half build plan", value: buildSnippet },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                    <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === item.label ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                    <code>{item.value}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Minecraft circles are still block approximations. This calculator helps you stay consistent, but very small diameters will always look more angular than large circles because block resolution is limited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Minecraft Circle Calculator"
      seoTitle="Online Minecraft Circle Calculator - Build Perfect Block Circles"
      seoDescription="Free online Minecraft circle calculator. Generate hollow or filled Minecraft circle patterns, row-by-row build instructions, and block counts from any diameter."
      canonical="https://usonlinetools.com/gaming/minecraft-circle-calculator"
      categoryName="Gaming Calculators"
      categoryHref="/category/gaming"
      heroDescription="Use this online Minecraft circle calculator to generate clean circle layouts before you start placing blocks in game. Enter a diameter, switch between hollow and filled patterns, preview the full grid, and copy the top-half row plan so you can build quickly in survival or creative mode. The page is designed for domes, spawn hubs, towers, arenas, and any build where a rough hand-made circle would waste time or materials."
      heroIcon={<Target className="w-3.5 h-3.5" />}
      calculatorLabel="Minecraft Circle Builder"
      calculatorDescription="Generate a row-by-row Minecraft circle plan from diameter, wall thickness, and build mode."
      calculator={calculator}
      howSteps={[
        {
          title: "Choose the diameter first because it controls every other decision",
          description:
            "In Minecraft circle planning, the diameter is the anchor measurement. It determines the radius, total block count, the width of each row, and how much open space the circle will create once it is built. Starting from diameter keeps the planning workflow concrete. Instead of guessing the shape visually, you define the footprint directly and let the calculator translate that into a usable block pattern.",
        },
        {
          title: "Switch between hollow and filled depending on the structure you are making",
          description:
            "A hollow circle is useful for walls, towers, ring roads, and outlines where the center stays empty. A filled circle is better when you are laying a platform, dome base, roof disc, or floor plan. Keeping both modes in the same page matters because many builders iterate between the outer shell and the filled interior while refining a design.",
        },
        {
          title: "Use the preview to sanity-check the shape before placing blocks",
          description:
            "Minecraft circles are approximations made from square blocks, so the quality of the pattern depends heavily on how the rows step in and out. The preview gives you a direct visual check before you spend time or materials in game. This is especially helpful for survival builds where correcting a bad foundation after the fact is annoying and expensive.",
        },
        {
          title: "Build only the top half manually, then mirror it",
          description:
            "The row table is intentionally focused on the top half because most Minecraft circle layouts are symmetrical. Once you place those rows correctly, the lower half is just a mirror. That cuts the instruction list in half without losing any information and makes the page more practical to use during an actual build session.",
        },
      ]}
      interpretationCards={[
        {
          title: "Larger diameters produce smoother-looking circles",
          description:
            "When the diameter increases, each stair-step row change represents a smaller proportion of the overall curve. That makes the shape look more rounded and less blocky from most viewing distances.",
        },
        {
          title: "Hollow mode is usually better for wall outlines and ring builds",
          description:
            "If you only need the boundary of the circle, hollow mode saves blocks and keeps the center open for later design work such as paths, towers, or arenas.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Filled mode is better for floors, roofs, and dome foundations",
          description:
            "A filled circle is more block-heavy, but it removes the need to work out the interior by hand. That usually speeds up platform and roof construction.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Top-half instructions are enough because the pattern mirrors",
          description:
            "Minecraft circles are symmetrical across the horizontal center. Once the first half is correct, the rest is just a reflected copy, which is why the build table stays focused and short.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Small starter tower", input: "9 block hollow circle", output: "Compact ring with limited smoothing but fast material cost" },
        { scenario: "Spawn platform", input: "21 block filled circle", output: "Large filled footprint for a clean central hub base" },
        { scenario: "Arena wall", input: "33 block hollow circle", output: "Smoother ring shape with more repeatable mirrored rows" },
        { scenario: "Thick wall ring", input: "25 block hollow circle with 2 block thickness", output: "Wider circular wall with preserved open center" },
      ]}
      whyChoosePoints={[
        "This Minecraft Circle Calculator is built as an actual build aid rather than a placeholder geometry page. It gives you a live block preview, block counts, row-by-row build instructions, and mode switching for hollow or filled layouts, which makes it useful during real Minecraft construction instead of only during rough planning.",
        "The row table matters because Minecraft builders usually do not want abstract formulas alone. They want a pattern they can follow block by block. Translating the circle into row width and padding instructions makes the page materially more useful in survival and creative workflows.",
        "The preview is also important because block circles are visual approximations. Even if the math is technically correct, builders still want to see how the stair-stepped edges will look before they commit to a shape. That visual confirmation is part of what turns this into a practical tool page.",
        "The calculator keeps the workflow efficient by showing only the top half of the circle instructions. That is enough to complete the full build while reducing clutter. In practice, it means you can glance at the table beside your game and work through the plan faster.",
        "Everything runs in the browser with no setup. Open the page, enter the diameter, confirm the pattern, copy the row plan, and start building. That is the right interaction model for a Minecraft utility page.",
      ]}
      faqs={[
        {
          q: "How do you make a circle in Minecraft?",
          a: "You build it row by row using a stepped block pattern that approximates a round shape on Minecraft's square grid. This calculator generates that pattern from the diameter you choose.",
        },
        {
          q: "Why do Minecraft circles still look blocky?",
          a: "Because Minecraft uses square blocks. The calculator improves consistency and symmetry, but very small circles will always look more angular than large ones because the available resolution is limited.",
        },
        {
          q: "What is the difference between hollow and filled mode?",
          a: "Hollow mode creates only the ring or outer boundary, while filled mode fills the entire circle area with blocks. Hollow is better for walls and outlines; filled is better for floors and platforms.",
        },
        {
          q: "Why are only the top rows listed in the build table?",
          a: "Because the lower half mirrors the upper half. Listing the full circle would repeat the same information and make the build guide harder to scan.",
        },
        {
          q: "What does wall thickness change?",
          a: "In hollow mode, thickness controls how wide the circular ring becomes. A larger thickness creates a chunkier wall and uses more blocks.",
        },
        {
          q: "Can I use this for domes or towers?",
          a: "Yes. Builders often use circle calculators for tower footprints, domes, arena walls, circular roads, and any large round base that needs consistent symmetry.",
        },
        {
          q: "Does the block count represent the exact Minecraft placement count?",
          a: "It represents the exact count of filled cells in the generated grid pattern shown on the page, which is the number of blocks you would place for that layout.",
        },
        {
          q: "Does the calculator save my build patterns?",
          a: "No. The page keeps the values in the current browser state only. It is designed for quick planning and copy-paste use while building.",
        },
      ]}
      relatedTools={[
        { title: "Roblox Tax Calculator", slug: "roblox-tax-calculator", icon: <Gauge className="w-4 h-4" />, color: 35, benefit: "Move to another completed gaming utility" },
        { title: "Fortnite DPI Calculator", slug: "fortnite-dpi-calculator", icon: <Mouse className="w-4 h-4" />, color: 210, benefit: "Check another live gaming page" },
        { title: "Valorant Sensitivity Calculator", slug: "valorant-sensitivity-calculator", icon: <Crosshair className="w-4 h-4" />, color: 345, benefit: "Stay inside the gaming calculator category" },
        { title: "Blox Fruits Calculator", slug: "blox-fruits-calculator", icon: <TrendingUp className="w-4 h-4" />, color: 150, benefit: "Open another completed gaming route" },
        { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Copy className="w-4 h-4" />, color: 265, benefit: "Use a quick general-purpose math tool" },
        { title: "D&D Dice Roller", slug: "dnd-dice-roller", icon: <RotateCcw className="w-4 h-4" />, color: 25, benefit: "Browse another gaming utility page" },
      ]}
      ctaTitle="Need Another Gaming Builder Tool?"
      ctaDescription="Keep moving through the gaming calculator category and replace more placeholder routes with real utilities."
      ctaHref="/category/gaming"
    />
  );
}
