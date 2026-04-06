import { useMemo, useState } from "react";
import { Check, Copy, Grid3X3, Layers3, Palette, RefreshCw, Sparkles, Type } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type Surface = "light" | "dark" | "gradient";
type Align = "stretch" | "start" | "center" | "end";
type Content = "stretch" | "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly";
type AutoFlow = "row" | "column" | "dense" | "row dense" | "column dense";

interface Values {
  columns: number;
  rows: number;
  gap: number;
  padding: number;
  minHeight: number;
  itemCount: number;
  rowHeight: number;
  justifyItems: Align;
  alignItems: Align;
  justifyContent: Content;
  alignContent: Content;
  autoFlow: AutoFlow;
  featuredColSpan: number;
  featuredRowSpan: number;
}

const DEFAULTS: Values = {
  columns: 4,
  rows: 3,
  gap: 14,
  padding: 18,
  minHeight: 280,
  itemCount: 8,
  rowHeight: 72,
  justifyItems: "stretch",
  alignItems: "stretch",
  justifyContent: "stretch",
  alignContent: "stretch",
  autoFlow: "row",
  featuredColSpan: 2,
  featuredRowSpan: 1,
};

const PRESETS = [
  {
    label: "Dashboard Blocks",
    description: "Balanced app-style layout for stats, cards, and overview modules.",
    surface: "light" as Surface,
    values: DEFAULTS,
  },
  {
    label: "Magazine Hero",
    description: "Featured first tile with supporting cards around it.",
    surface: "gradient" as Surface,
    values: { columns: 4, rows: 3, gap: 16, padding: 20, minHeight: 300, itemCount: 7, rowHeight: 76, justifyItems: "stretch", alignItems: "stretch", justifyContent: "stretch", alignContent: "stretch", autoFlow: "row dense", featuredColSpan: 2, featuredRowSpan: 2 },
  },
  {
    label: "Stats Panel",
    description: "Simple equal cells for KPI and metric rows.",
    surface: "dark" as Surface,
    values: { columns: 3, rows: 2, gap: 12, padding: 18, minHeight: 220, itemCount: 6, rowHeight: 78, justifyItems: "stretch", alignItems: "center", justifyContent: "stretch", alignContent: "center", autoFlow: "row", featuredColSpan: 1, featuredRowSpan: 1 },
  },
  {
    label: "Gallery Mosaic",
    description: "Denser flow with featured tile emphasis for media layouts.",
    surface: "gradient" as Surface,
    values: { columns: 5, rows: 3, gap: 10, padding: 16, minHeight: 300, itemCount: 10, rowHeight: 62, justifyItems: "stretch", alignItems: "stretch", justifyContent: "stretch", alignContent: "stretch", autoFlow: "dense", featuredColSpan: 2, featuredRowSpan: 2 },
  },
] as const;

function cssBlock(v: Values) {
  return [
    "display: grid;",
    `grid-template-columns: repeat(${v.columns}, minmax(0, 1fr));`,
    `grid-template-rows: repeat(${v.rows}, minmax(${v.rowHeight}px, 1fr));`,
    `grid-auto-flow: ${v.autoFlow};`,
    `justify-items: ${v.justifyItems};`,
    `align-items: ${v.alignItems};`,
    `justify-content: ${v.justifyContent};`,
    `align-content: ${v.alignContent};`,
    `gap: ${v.gap}px;`,
    `padding: ${v.padding}px;`,
    `min-height: ${v.minHeight}px;`,
  ].join("\n");
}

function alignClass(value: Align, axis: "justify" | "items") {
  if (axis === "justify") return value === "start" ? "justify-items-start" : value === "center" ? "justify-items-center" : value === "end" ? "justify-items-end" : "justify-items-stretch";
  return value === "start" ? "items-start" : value === "center" ? "items-center" : value === "end" ? "items-end" : "items-stretch";
}

function contentClass(value: Content, axis: "justify" | "content") {
  if (axis === "justify") return value === "start" ? "justify-start" : value === "center" ? "justify-center" : value === "end" ? "justify-end" : value === "space-between" ? "justify-between" : value === "space-around" ? "justify-around" : value === "space-evenly" ? "justify-evenly" : "justify-stretch";
  return value === "start" ? "content-start" : value === "center" ? "content-center" : value === "end" ? "content-end" : value === "space-between" ? "content-between" : value === "space-around" ? "content-around" : value === "space-evenly" ? "content-evenly" : "content-stretch";
}

function flowClass(value: AutoFlow) {
  return value === "row" ? "grid-flow-row" : value === "column" ? "grid-flow-col" : value === "dense" ? "grid-flow-dense" : value === "row dense" ? "grid-flow-row-dense" : "grid-flow-col-dense";
}

function tailwindHint(v: Values) {
  return [
    "grid",
    `grid-cols-[repeat(${v.columns},minmax(0,1fr))]`,
    `grid-rows-[repeat(${v.rows},minmax(${v.rowHeight}px,1fr))]`,
    flowClass(v.autoFlow),
    alignClass(v.justifyItems, "justify"),
    alignClass(v.alignItems, "items"),
    contentClass(v.justifyContent, "justify"),
    contentClass(v.alignContent, "content"),
    `gap-[${v.gap}px]`,
    `p-[${v.padding}px]`,
    `min-h-[${v.minHeight}px]`,
  ].join(" ");
}

function summary(v: Values) {
  if (v.featuredColSpan > 1 || v.featuredRowSpan > 1) return "This grid uses featured-item spanning, which makes it especially useful for magazine-style cards, dashboards, media mosaics, and layouts where one item needs to carry more visual importance than the rest.";
  if (v.autoFlow.includes("dense")) return "Dense auto-flow helps the browser backfill available space, which is useful for galleries, compact dashboard modules, and any layout where reducing holes matters more than keeping source order visually simple.";
  if (v.columns >= 4 && v.rows >= 3) return "This reads as a structured dashboard or feature grid. CSS Grid is the right choice here because the layout is doing real two-dimensional work rather than just lining items up on one axis.";
  return "This configuration stays close to a safe production grid default. It works well for stats, cards, media, pricing sections, and any layout where rows and columns both matter at the same time.";
}

function surfaceClass(v: Surface) {
  return v === "dark"
    ? "rounded-[30px] bg-[linear-gradient(135deg,#0F172A_0%,#111827_42%,#1E293B_100%)]"
    : v === "gradient"
      ? "rounded-[30px] bg-gradient-to-br from-fuchsia-500 via-blue-500 to-cyan-400"
      : "rounded-[30px] bg-slate-100 dark:bg-slate-900";
}

function itemTone(surface: Surface, featured: boolean, index: number) {
  if (surface === "dark") return featured ? "bg-cyan-400/16 text-white border-cyan-300/25" : index % 2 === 0 ? "bg-white/12 text-white border-white/15" : "bg-slate-400/12 text-white border-slate-300/20";
  if (surface === "gradient") return featured ? "bg-white/20 text-white border-white/25" : index % 2 === 0 ? "bg-white/16 text-white border-white/20" : "bg-slate-950/14 text-white border-white/16";
  return featured ? "bg-cyan-100 text-slate-900 border-cyan-300" : index % 2 === 0 ? "bg-white text-slate-900 border-slate-200" : "bg-cyan-50 text-slate-900 border-cyan-200";
}

export default function CssGridGenerator() {
  const [values, setValues] = useState<Values>(DEFAULTS);
  const [surface, setSurface] = useState<Surface>("light");
  const [copiedLabel, setCopiedLabel] = useState("");

  const cssText = useMemo(() => cssBlock(values), [values]);
  const tailwindText = useMemo(() => tailwindHint(values), [values]);
  const explanation = useMemo(() => summary(values), [values]);
  const items = Array.from({ length: values.itemCount }, (_, index) => index + 1);

  const updateValue = (key: keyof Values, value: number | string) => setValues((current) => ({ ...current, [key]: value }));
  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setValues(preset.values);
    setSurface(preset.surface);
  };

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const randomize = () => {
    const surfaces: Surface[] = ["light", "dark", "gradient"];
    const aligns: Align[] = ["stretch", "start", "center", "end"];
    const contents: Content[] = ["stretch", "start", "center", "end", "space-between", "space-around", "space-evenly"];
    const flows: AutoFlow[] = ["row", "column", "dense", "row dense", "column dense"];
    setSurface(surfaces[Math.floor(Math.random() * surfaces.length)]);
    setValues({
      columns: 2 + Math.floor(Math.random() * 4),
      rows: 2 + Math.floor(Math.random() * 3),
      gap: 8 + Math.floor(Math.random() * 17),
      padding: 12 + Math.floor(Math.random() * 17),
      minHeight: 180 + Math.floor(Math.random() * 161),
      itemCount: 4 + Math.floor(Math.random() * 7),
      rowHeight: 56 + Math.floor(Math.random() * 41),
      justifyItems: aligns[Math.floor(Math.random() * aligns.length)],
      alignItems: aligns[Math.floor(Math.random() * aligns.length)],
      justifyContent: contents[Math.floor(Math.random() * contents.length)],
      alignContent: contents[Math.floor(Math.random() * contents.length)],
      autoFlow: flows[Math.floor(Math.random() * flows.length)],
      featuredColSpan: 1 + Math.floor(Math.random() * 2),
      featuredRowSpan: 1 + Math.floor(Math.random() * 2),
    });
  };

  return (
    <UtilityToolPageShell
      title="CSS Grid Generator"
      seoTitle="CSS Grid Generator - Free Visual CSS Grid Layout Builder"
      seoDescription="Free CSS Grid generator with live preview, grid presets, span controls, and copyable CSS output. Build CSS Grid layouts visually and export production-ready code instantly."
      canonical="https://usonlinetools.com/css-design/css-grid-generator"
      categoryName="CSS & Design Tools"
      categoryHref="/category/css-design"
      heroDescription="Build CSS Grid layouts visually instead of hand-tuning rows, columns, alignment, and spans in the browser inspector. Control columns, rows, gap, item spanning, grid flow, content alignment, and preview density, then copy production-ready CSS for dashboards, media galleries, stat blocks, pricing sections, feature grids, and modern interface layouts."
      heroIcon={<Grid3X3 className="w-3.5 h-3.5" />}
      calculatorLabel="Grid Layout Builder"
      calculatorDescription="Preview two-dimensional grid structure live, refine row and column behavior, and export clean CSS or Tailwind-friendly utilities instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="columns" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Columns</label>
                  <input id="columns" type="range" min="1" max="6" value={values.columns} onChange={(event) => updateValue("columns", Number(event.target.value))} className="w-full accent-blue-500" />
                  <p className="text-xs font-bold text-blue-600 mt-1">{values.columns}</p>
                </div>
                <div>
                  <label htmlFor="rows" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Rows</label>
                  <input id="rows" type="range" min="1" max="5" value={values.rows} onChange={(event) => updateValue("rows", Number(event.target.value))} className="w-full accent-blue-500" />
                  <p className="text-xs font-bold text-blue-600 mt-1">{values.rows}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="auto-flow" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Auto Flow</label>
                  <select id="auto-flow" value={values.autoFlow} onChange={(event) => updateValue("autoFlow", event.target.value)} className="tool-calc-input w-full">
                    <option value="row">row</option><option value="column">column</option><option value="dense">dense</option><option value="row dense">row dense</option><option value="column dense">column dense</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="surface" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Surface</label>
                  <select id="surface" value={surface} onChange={(event) => setSurface(event.target.value as Surface)} className="tool-calc-input w-full">
                    <option value="light">light</option><option value="dark">dark</option><option value="gradient">gradient</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="justify-items" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Justify Items</label>
                  <select id="justify-items" value={values.justifyItems} onChange={(event) => updateValue("justifyItems", event.target.value)} className="tool-calc-input w-full">
                    <option value="stretch">stretch</option><option value="start">start</option><option value="center">center</option><option value="end">end</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="align-items" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Align Items</label>
                  <select id="align-items" value={values.alignItems} onChange={(event) => updateValue("alignItems", event.target.value)} className="tool-calc-input w-full">
                    <option value="stretch">stretch</option><option value="start">start</option><option value="center">center</option><option value="end">end</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="justify-content" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Justify Content</label>
                  <select id="justify-content" value={values.justifyContent} onChange={(event) => updateValue("justifyContent", event.target.value)} className="tool-calc-input w-full">
                    <option value="stretch">stretch</option><option value="start">start</option><option value="center">center</option><option value="end">end</option><option value="space-between">space-between</option><option value="space-around">space-around</option><option value="space-evenly">space-evenly</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="align-content" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Align Content</label>
                  <select id="align-content" value={values.alignContent} onChange={(event) => updateValue("alignContent", event.target.value)} className="tool-calc-input w-full">
                    <option value="stretch">stretch</option><option value="start">start</option><option value="center">center</option><option value="end">end</option><option value="space-between">space-between</option><option value="space-around">space-around</option><option value="space-evenly">space-evenly</option>
                  </select>
                </div>
              </div>

              {[
                { key: "gap", label: "Gap", min: 0, max: 40, suffix: "px" },
                { key: "padding", label: "Padding", min: 0, max: 40, suffix: "px" },
                { key: "minHeight", label: "Container Height", min: 120, max: 380, suffix: "px" },
                { key: "rowHeight", label: "Row Height", min: 40, max: 120, suffix: "px" },
                { key: "itemCount", label: "Item Count", min: 3, max: 12, suffix: "" },
                { key: "featuredColSpan", label: "Feature Col Span", min: 1, max: 3, suffix: "" },
                { key: "featuredRowSpan", label: "Feature Row Span", min: 1, max: 2, suffix: "" },
              ].map((control) => (
                <div key={control.key}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label htmlFor={control.key} className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">{control.label}</label>
                    <span className="text-xs font-bold text-blue-600">{values[control.key as keyof Values]}{control.suffix}</span>
                  </div>
                  <input id={control.key} type="range" min={control.min} max={control.max} value={values[control.key as keyof Values] as number} onChange={(event) => updateValue(control.key as keyof Values, Number(event.target.value))} className="w-full accent-blue-500" />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                <button onClick={randomize} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted"><RefreshCw className="w-4 h-4" />Random</button>
                <button onClick={() => { setValues(DEFAULTS); setSurface("light"); }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted"><Layers3 className="w-4 h-4" />Reset</button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Live Preview</p>
                <div className={`${surfaceClass(surface)} p-5`}>
                  <div
                    className="rounded-[24px] border border-white/15 bg-white/8"
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${values.columns}, minmax(0, 1fr))`,
                      gridTemplateRows: `repeat(${values.rows}, minmax(${values.rowHeight}px, 1fr))`,
                      gridAutoFlow: values.autoFlow,
                      justifyItems: values.justifyItems,
                      alignItems: values.alignItems,
                      justifyContent: values.justifyContent,
                      alignContent: values.alignContent,
                      gap: `${values.gap}px`,
                      padding: `${values.padding}px`,
                      minHeight: `${values.minHeight}px`,
                    }}
                  >
                    {items.map((item, index) => {
                      const featured = index === 0;
                      return (
                        <div
                          key={item}
                          className={`rounded-2xl border text-sm font-black shadow-sm ${itemTone(surface, featured, index)}`}
                          style={{
                            gridColumn: featured ? `span ${Math.min(values.featuredColSpan, values.columns)} / span ${Math.min(values.featuredColSpan, values.columns)}` : undefined,
                            gridRow: featured ? `span ${Math.min(values.featuredRowSpan, values.rows)} / span ${Math.min(values.featuredRowSpan, values.rows)}` : undefined,
                            minHeight: `${values.rowHeight}px`,
                            width: values.justifyItems === "stretch" ? "100%" : "84%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "12px",
                          }}
                        >
                          Item {item}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">CSS Output</p>
                    <button onClick={() => copyValue("css", cssText)} className="text-xs font-bold text-blue-600 hover:text-blue-700">{copiedLabel === "css" ? "Copied" : "Copy CSS"}</button>
                  </div>
                  <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100"><code>{cssText}</code></pre>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Tailwind Hint</p>
                    <button onClick={() => copyValue("tailwind", tailwindText)} className="text-xs font-bold text-blue-600 hover:text-blue-700">{copiedLabel === "tailwind" ? "Copied" : "Copy Hint"}</button>
                  </div>
                  <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100"><code>{tailwindText}</code></pre>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-4">
                <p className="text-sm font-bold text-foreground mb-1">Layout Summary</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Preset Library</p>
                <p className="text-sm text-muted-foreground mt-1">Start from common grid layouts used in product UI.</p>
              </div>
              <Sparkles className="w-4 h-4 text-blue-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PRESETS.map((preset) => (
                <button key={preset.label} onClick={() => applyPreset(preset)} className="rounded-2xl border border-border bg-muted/30 p-4 text-left hover:border-blue-500/40 hover:bg-blue-500/5 transition-colors">
                  <p className="font-bold text-foreground mb-1">{preset.label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Set columns and rows first", description: "Choose the broad structure before tuning anything else. Grid is most useful when the row and column logic is explicit rather than inferred." },
        { title: "Choose auto-flow and alignment", description: "Grid auto-flow controls how new items are placed, while justify/align settings control how items and tracks behave within the container." },
        { title: "Tune spacing and density", description: "Gap, padding, row height, and item count change whether the layout feels editorial, dashboard-like, compact, or promotional." },
        { title: "Use featured spans intentionally", description: "Span controls let one item take more space than the others, which is useful for hero tiles, KPI highlights, editorial leads, and media mosaics." },
        { title: "Copy the final CSS", description: "Once the preview matches the intended structure, copy the production CSS or Tailwind-style utility hint and move it straight into your component." },
      ]}
      interpretationCards={[
        { title: "Grid is best for real two-dimensional layout", description: "Use CSS Grid when both rows and columns matter. If the layout problem is mostly one-axis alignment, flexbox is usually simpler." },
        { title: "Spanning changes hierarchy immediately", description: "A featured tile with larger row or column span can create a much more editorial and intentional composition without changing the overall grid system.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Dense flow is useful but should be intentional", description: "Dense packing can reduce awkward holes in gallery-style layouts, but it can also make visual order feel less straightforward. Use it when compactness matters more than strict reading order.", className: "bg-indigo-500/5 border-indigo-500/20" },
        { title: "Alignment settings matter more when space is available", description: "Justify-content and align-content become more visible when the grid container has extra room. On tightly packed layouts, their effect may feel subtle.", className: "bg-violet-500/5 border-violet-500/20" },
      ]}
      examples={[
        { scenario: "Dashboard cards", input: "4 cols + 3 rows + gap 14px", output: "Structured app-style overview grid" },
        { scenario: "Magazine lead", input: "Featured tile spans 2 cols and 2 rows", output: "Editorial hero composition" },
        { scenario: "Stats grid", input: "3 cols + 2 rows + equal cells", output: "KPI or metric block layout" },
        { scenario: "Gallery mosaic", input: "5 cols + dense flow + featured tile", output: "Compact media arrangement" },
        { scenario: "Promo section", input: "4 cols + generous spacing + stretch", output: "Balanced marketing layout" },
      ]}
      whyChoosePoints={[
        "A CSS Grid generator is useful because Grid is powerful but not always intuitive to build from memory. Once rows, columns, auto-flow, track sizing, item spanning, and container alignment all interact, it becomes difficult to reason about the final layout from syntax alone. A visual builder makes those relationships obvious immediately.",
        "That matters because Grid is often the right tool for dashboards, pricing sections, media mosaics, stat blocks, editorial cards, product showcases, and layouts where both rows and columns do meaningful structural work. Trying to approximate those patterns with flexbox often leads to more fragility and more workaround code than necessary.",
        "This generator is designed around realistic product layout concerns instead of toy examples. It lets you vary density, spacing, row height, span behavior, and item count while previewing the result on actual styled surfaces. That makes it easier to judge whether the grid feels premium, calm, dense, promotional, or just visually unbalanced.",
        "It also exports both standard CSS and a Tailwind-friendly hint. That shortens the path from experimentation to production whether you work with CSS modules, styled components, a design system, or a utility-first framework. The goal is not just to demonstrate syntax, but to help you ship cleaner layout decisions faster.",
        "Grid decisions also rarely exist in isolation. Once the structure is set, you still need shadows, border radius, filters, animation, and a coherent color system to make the component feel finished. That is why this page connects to the rest of the CSS and design toolset rather than pretending layout is the only thing that matters.",
      ]}
      faqs={[
        { q: "What is CSS Grid best used for?", a: "CSS Grid is best for two-dimensional layouts where both rows and columns matter. It is excellent for dashboards, card systems, pricing sections, editorial layouts, media galleries, and any interface where explicit placement or spanning is useful." },
        { q: "What is the difference between Grid and Flexbox?", a: "Grid is designed for two-dimensional layout, while Flexbox is designed for one-dimensional flow. If you mainly need alignment along a row or column, flexbox is often simpler. If you need explicit tracks, spanning, and stronger control across both axes, Grid is usually the better choice." },
        { q: "What does grid-auto-flow do?", a: "Grid auto-flow controls how automatically placed items move through the grid. Row flow fills rows first, column flow fills columns first, and dense packing lets the browser backfill earlier gaps when possible." },
        { q: "When should I use item spanning in Grid?", a: "Use spanning when one item should have more visual weight than the others, such as a lead article, featured product, hero card, or important KPI block. It is one of the fastest ways to create hierarchy in a grid layout." },
        { q: "Why do justify-content and align-content sometimes seem subtle?", a: "Those properties affect the grid tracks as a group, so their impact becomes more visible when the container has extra free space. In tightly packed grids, the effect may feel small because there is not much leftover room to distribute." },
        { q: "Can I use the generated output directly in production?", a: "Yes. The exported CSS is standard Grid syntax and can be pasted into stylesheets, CSS modules, component-level styles, or utility-first workflows that support arbitrary values." },
      ]}
      relatedTools={[
        { title: "CSS Flexbox Generator", slug: "css-flexbox-generator", icon: <Layers3 className="w-5 h-5" />, color: 220, benefit: "Compare one-axis and two-axis layout logic" },
        { title: "CSS Box Shadow Generator", slug: "css-box-shadow-generator", icon: <Sparkles className="w-5 h-5" />, color: 250, benefit: "Add depth once the structure is set" },
        { title: "CSS Border Radius Generator", slug: "css-border-radius-generator", icon: <Palette className="w-5 h-5" />, color: 310, benefit: "Refine the shape of tiles and cards" },
        { title: "CSS Animation Generator", slug: "css-animation-generator", icon: <Grid3X3 className="w-5 h-5" />, color: 170, benefit: "Animate grid surfaces more intentionally" },
        { title: "Color Palette Generator", slug: "color-palette-generator", icon: <Type className="w-5 h-5" />, color: 140, benefit: "Apply a stronger visual system after layout" },
      ]}
      ctaTitle="Keep Building Your Layout System"
      ctaDescription="Continue into shadows, radius, animation, and color tools to shape not just grid structure, but the full visual system around the component."
      ctaHref="/category/css-design"
    />
  );
}
