import { useMemo, useState } from "react";
import { Check, Copy, Layers3, Move, Palette, RefreshCw, Sparkles, Type } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type Direction = "row" | "row-reverse" | "column" | "column-reverse";
type Wrap = "nowrap" | "wrap" | "wrap-reverse";
type Justify = "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
type AlignItems = "stretch" | "flex-start" | "center" | "flex-end" | "baseline";
type AlignContent = "stretch" | "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
type Surface = "light" | "dark" | "gradient";

interface Values {
  direction: Direction;
  wrap: Wrap;
  justify: Justify;
  alignItems: AlignItems;
  alignContent: AlignContent;
  gap: number;
  padding: number;
  minHeight: number;
  itemCount: number;
  itemWidth: number;
  itemHeight: number;
}

const DEFAULTS: Values = {
  direction: "row",
  wrap: "wrap",
  justify: "center",
  alignItems: "center",
  alignContent: "center",
  gap: 16,
  padding: 20,
  minHeight: 240,
  itemCount: 6,
  itemWidth: 92,
  itemHeight: 72,
};

const PRESETS = [
  {
    label: "Centered Grid",
    description: "Balanced multi-row layout for feature cards and dashboard blocks.",
    surface: "light" as Surface,
    values: DEFAULTS,
  },
  {
    label: "Toolbar",
    description: "Single-row distribution for actions, nav items, and utility bars.",
    surface: "dark" as Surface,
    values: { direction: "row", wrap: "nowrap", justify: "space-between", alignItems: "center", alignContent: "stretch", gap: 12, padding: 18, minHeight: 120, itemCount: 5, itemWidth: 88, itemHeight: 52 },
  },
  {
    label: "Feature Stack",
    description: "Vertical flow for onboarding cards, settings, and mobile layouts.",
    surface: "gradient" as Surface,
    values: { direction: "column", wrap: "nowrap", justify: "center", alignItems: "stretch", alignContent: "stretch", gap: 14, padding: 20, minHeight: 320, itemCount: 5, itemWidth: 220, itemHeight: 54 },
  },
  {
    label: "Wrapped Tags",
    description: "Fast chip layout for filters, tags, and category pills.",
    surface: "light" as Surface,
    values: { direction: "row", wrap: "wrap", justify: "flex-start", alignItems: "center", alignContent: "flex-start", gap: 10, padding: 18, minHeight: 220, itemCount: 8, itemWidth: 84, itemHeight: 42 },
  },
] as const;

function cssBlock(v: Values) {
  return [
    "display: flex;",
    `flex-direction: ${v.direction};`,
    `flex-wrap: ${v.wrap};`,
    `justify-content: ${v.justify};`,
    `align-items: ${v.alignItems};`,
    `align-content: ${v.alignContent};`,
    `gap: ${v.gap}px;`,
    `padding: ${v.padding}px;`,
    `min-height: ${v.minHeight}px;`,
  ].join("\n");
}

function directionClass(v: Direction) {
  return v === "row" ? "flex-row" : v === "row-reverse" ? "flex-row-reverse" : v === "column" ? "flex-col" : "flex-col-reverse";
}

function wrapClass(v: Wrap) {
  return v === "nowrap" ? "flex-nowrap" : v === "wrap-reverse" ? "flex-wrap-reverse" : "flex-wrap";
}

function justifyClass(v: Justify) {
  return v === "flex-start" ? "justify-start" : v === "flex-end" ? "justify-end" : v === "center" ? "justify-center" : v === "space-between" ? "justify-between" : v === "space-around" ? "justify-around" : "justify-evenly";
}

function itemsClass(v: AlignItems) {
  return v === "flex-start" ? "items-start" : v === "flex-end" ? "items-end" : v === "center" ? "items-center" : v === "baseline" ? "items-baseline" : "items-stretch";
}

function contentClass(v: AlignContent) {
  return v === "flex-start" ? "content-start" : v === "flex-end" ? "content-end" : v === "center" ? "content-center" : v === "space-between" ? "content-between" : v === "space-around" ? "content-around" : "content-stretch";
}

function tailwindHint(v: Values) {
  return [
    "flex",
    directionClass(v.direction),
    wrapClass(v.wrap),
    justifyClass(v.justify),
    itemsClass(v.alignItems),
    contentClass(v.alignContent),
    `gap-[${v.gap}px]`,
    `p-[${v.padding}px]`,
    `min-h-[${v.minHeight}px]`,
  ].join(" ");
}

function summary(v: Values) {
  if (v.direction.startsWith("column")) return "This behaves like a vertical stack, which is ideal for mobile flows, side panels, onboarding cards, and settings blocks where reading order matters more than row distribution.";
  if (v.wrap !== "nowrap" && v.justify === "center") return "This reads like a light adaptive grid built with flexbox. It works well for tags, compact feature cards, dashboard modules, and utility layouts that do not need full CSS Grid.";
  if (v.justify === "space-between" || v.justify === "space-evenly") return "This layout emphasizes horizontal distribution across the container, which makes it useful for nav rows, toolbars, stat bars, and promo strips where spacing carries structural weight.";
  return "This configuration stays close to a safe production default. It is useful for cards, actions, menus, chips, and responsive UI experiments where fast alignment control matters.";
}

function surfaceClass(v: Surface) {
  return v === "dark"
    ? "rounded-[30px] bg-[linear-gradient(135deg,#0F172A_0%,#111827_42%,#1E293B_100%)]"
    : v === "gradient"
      ? "rounded-[30px] bg-gradient-to-br from-fuchsia-500 via-blue-500 to-cyan-400"
      : "rounded-[30px] bg-slate-100 dark:bg-slate-900";
}

function itemTone(surface: Surface, index: number) {
  if (surface === "dark") return index % 2 === 0 ? "bg-white/12 text-white border-white/15" : "bg-cyan-400/12 text-white border-cyan-300/20";
  if (surface === "gradient") return index % 2 === 0 ? "bg-white/16 text-white border-white/20" : "bg-slate-950/14 text-white border-white/16";
  return index % 2 === 0 ? "bg-white text-slate-900 border-slate-200" : "bg-cyan-50 text-slate-900 border-cyan-200";
}

export default function CssFlexboxGenerator() {
  const [values, setValues] = useState<Values>(DEFAULTS);
  const [surface, setSurface] = useState<Surface>("light");
  const [copiedLabel, setCopiedLabel] = useState("");

  const cssText = useMemo(() => cssBlock(values), [values]);
  const tailwindText = useMemo(() => tailwindHint(values), [values]);
  const explanation = useMemo(() => summary(values), [values]);
  const previewItems = Array.from({ length: values.itemCount }, (_, index) => index + 1);

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
    const directions: Direction[] = ["row", "row-reverse", "column", "column-reverse"];
    const wraps: Wrap[] = ["nowrap", "wrap", "wrap-reverse"];
    const justifies: Justify[] = ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"];
    const aligns: AlignItems[] = ["stretch", "flex-start", "center", "flex-end", "baseline"];
    const contents: AlignContent[] = ["stretch", "flex-start", "center", "flex-end", "space-between", "space-around"];
    const surfaces: Surface[] = ["light", "dark", "gradient"];
    setSurface(surfaces[Math.floor(Math.random() * surfaces.length)]);
    setValues({
      direction: directions[Math.floor(Math.random() * directions.length)],
      wrap: wraps[Math.floor(Math.random() * wraps.length)],
      justify: justifies[Math.floor(Math.random() * justifies.length)],
      alignItems: aligns[Math.floor(Math.random() * aligns.length)],
      alignContent: contents[Math.floor(Math.random() * contents.length)],
      gap: 6 + Math.floor(Math.random() * 23),
      padding: 12 + Math.floor(Math.random() * 17),
      minHeight: 140 + Math.floor(Math.random() * 201),
      itemCount: 4 + Math.floor(Math.random() * 5),
      itemWidth: 72 + Math.floor(Math.random() * 81),
      itemHeight: 40 + Math.floor(Math.random() * 61),
    });
  };

  return (
    <UtilityToolPageShell
      title="CSS Flexbox Generator"
      seoTitle="CSS Flexbox Generator - Free Visual Flex Layout Builder"
      seoDescription="Free CSS flexbox generator with live preview, layout presets, control panels, and copyable CSS output. Build flex layouts visually and export production-ready code instantly."
      canonical="https://usonlinetools.com/css-design/css-flexbox-generator"
      categoryName="CSS & Design Tools"
      categoryHref="/category/css-design"
      heroDescription="Build flexbox layouts visually instead of memorizing alignment combinations in the browser inspector. Tune direction, wrapping, justification, item alignment, content alignment, gap, padding, and preview density, then copy production-ready CSS for cards, toolbars, hero strips, chips, actions, onboarding stacks, and responsive interface blocks."
      heroIcon={<Move className="w-3.5 h-3.5" />}
      calculatorLabel="Flex Layout Builder"
      calculatorDescription="Preview flex alignment live, refine spacing and flow, and export clean CSS or Tailwind-friendly utilities instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="direction" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Direction</label>
                  <select id="direction" value={values.direction} onChange={(event) => updateValue("direction", event.target.value)} className="tool-calc-input w-full">
                    <option value="row">row</option><option value="row-reverse">row-reverse</option><option value="column">column</option><option value="column-reverse">column-reverse</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="wrap" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Wrap</label>
                  <select id="wrap" value={values.wrap} onChange={(event) => updateValue("wrap", event.target.value)} className="tool-calc-input w-full">
                    <option value="nowrap">nowrap</option><option value="wrap">wrap</option><option value="wrap-reverse">wrap-reverse</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="justify" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Justify</label>
                  <select id="justify" value={values.justify} onChange={(event) => updateValue("justify", event.target.value)} className="tool-calc-input w-full">
                    <option value="flex-start">flex-start</option><option value="center">center</option><option value="flex-end">flex-end</option><option value="space-between">space-between</option><option value="space-around">space-around</option><option value="space-evenly">space-evenly</option>
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
                  <label htmlFor="align-items" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Align Items</label>
                  <select id="align-items" value={values.alignItems} onChange={(event) => updateValue("alignItems", event.target.value)} className="tool-calc-input w-full">
                    <option value="stretch">stretch</option><option value="flex-start">flex-start</option><option value="center">center</option><option value="flex-end">flex-end</option><option value="baseline">baseline</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="align-content" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Align Content</label>
                  <select id="align-content" value={values.alignContent} onChange={(event) => updateValue("alignContent", event.target.value)} className="tool-calc-input w-full">
                    <option value="stretch">stretch</option><option value="flex-start">flex-start</option><option value="center">center</option><option value="flex-end">flex-end</option><option value="space-between">space-between</option><option value="space-around">space-around</option>
                  </select>
                </div>
              </div>

              {[
                { key: "gap", label: "Gap", min: 0, max: 40, suffix: "px" },
                { key: "padding", label: "Padding", min: 0, max: 40, suffix: "px" },
                { key: "minHeight", label: "Container Height", min: 100, max: 360, suffix: "px" },
                { key: "itemCount", label: "Item Count", min: 3, max: 10, suffix: "" },
                { key: "itemWidth", label: "Item Width", min: 56, max: 180, suffix: "px" },
                { key: "itemHeight", label: "Item Height", min: 36, max: 120, suffix: "px" },
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
                    style={{ display: "flex", flexDirection: values.direction, flexWrap: values.wrap, justifyContent: values.justify, alignItems: values.alignItems, alignContent: values.alignContent, gap: `${values.gap}px`, padding: `${values.padding}px`, minHeight: `${values.minHeight}px` }}
                  >
                    {previewItems.map((item, index) => (
                      <div key={item} className={`rounded-2xl border text-sm font-black shadow-sm ${itemTone(surface, index)}`} style={{ width: values.direction.startsWith("column") ? "100%" : `${values.itemWidth}px`, minHeight: `${values.itemHeight}px`, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px" }}>
                        Item {item}
                      </div>
                    ))}
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
                <p className="text-sm text-muted-foreground mt-1">Start from common flexbox patterns used in product UI.</p>
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
        { title: "Set the layout direction first", description: "Choose whether items should flow in rows or columns before tuning spacing. That single decision changes how the rest of the alignment controls behave." },
        { title: "Decide whether the layout should wrap", description: "Use wrap when items should move onto multiple lines. Keep nowrap when the layout should stay on one row or one column, such as a toolbar or controlled promo strip." },
        { title: "Tune justify-content and align-items together", description: "Justify-content controls distribution on the main axis, while align-items controls alignment on the cross axis. Seeing both live is the fastest way to understand the difference." },
        { title: "Adjust gap, padding, and density", description: "Spacing values change whether a layout feels compact, premium, calm, crowded, or promotional. Previewing item count and item size makes those calls much easier." },
        { title: "Copy the final CSS or utility hint", description: "Once the preview matches the intended arrangement, copy the standard flexbox CSS or the Tailwind-oriented utility hint and move it straight into production code." },
      ]}
      interpretationCards={[
        { title: "Flexbox is strongest for one-dimensional flow", description: "Use flexbox when the core question is how items distribute across a row or a column. For stricter two-dimensional placement, CSS Grid is usually a better fit." },
        { title: "Wrap changes the feel of the whole system", description: "A wrapped layout often feels like a light adaptive grid, while nowrap feels more controlled and bar-like. That decision often matters as much as the alignment settings.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Gap is usually cleaner than margin-based spacing", description: "Using gap keeps spacing logic in the container instead of pushing it onto every child. That becomes more important as wrapping and responsiveness increase.", className: "bg-indigo-500/5 border-indigo-500/20" },
        { title: "Align-content matters only with multiple lines", description: "If the layout does not wrap into more than one line, align-content will not do much. That is one reason flexbox feels confusing when learned from syntax alone.", className: "bg-violet-500/5 border-violet-500/20" },
      ]}
      examples={[
        { scenario: "Centered card cluster", input: "row + wrap + justify-center + items-center", output: "Balanced multi-row feature layout" },
        { scenario: "Toolbar", input: "row + nowrap + justify-between + items-center", output: "Distributed action bar" },
        { scenario: "Mobile stack", input: "column + nowrap + gap 14px", output: "Clean vertical card flow" },
        { scenario: "Tag cloud", input: "row + wrap + justify-start + gap 10px", output: "Flexible chip layout" },
        { scenario: "Promo strip", input: "row + nowrap + justify-evenly", output: "Wide spaced highlight row" },
      ]}
      whyChoosePoints={[
        "A CSS flexbox generator is useful because flexbox is conceptually simple but practically slippery. Developers usually remember that flexbox aligns items, but still lose time flipping between row and column, testing wrap, adjusting justification, and trying to remember why align-items and align-content do not behave the same way. A visual builder removes that guesswork.",
        "That matters because flexbox is everywhere in modern UI. Buttons, nav bars, chips, toolbars, cards, form rows, onboarding stacks, pricing layouts, filter groups, and action blocks all lean on flexbox. A fast way to preview the layout logic before touching production code saves time and reduces the trial-and-error loop inside the browser inspector.",
        "This generator is built around real interface patterns rather than toy examples. The preview includes adjustable density, item count, and surface styles so the output is closer to what a real product component looks like. That makes the exported CSS more trustworthy because you are not judging alignment on a blank demo row.",
        "It also produces both standard CSS and a Tailwind-friendly utility hint. That matters because some teams want raw CSS for modules or components, while others want utility-first values they can move straight into a class list. The generator is designed to shorten that path, not just demonstrate syntax.",
        "From a broader workflow perspective, flexbox decisions rarely exist in isolation. Layout direction, spacing, surface treatment, depth, color, and motion all influence how a component feels. That is why this page links back into the rest of the CSS and design toolset instead of treating layout as a standalone decision with no relationship to the surrounding visual system.",
      ]}
      faqs={[
        { q: "What is flexbox best used for?", a: "Flexbox is best for one-dimensional layout problems, meaning cases where items primarily need to align and distribute along a row or a column. It is excellent for nav bars, chip groups, card rows, action stacks, media objects, and interface surfaces where flow matters more than strict two-dimensional placement." },
        { q: "What is the difference between justify-content and align-items?", a: "Justify-content controls distribution along the main axis, which depends on the flex direction. Align-items controls alignment along the cross axis. In a row layout, justify-content works horizontally while align-items works vertically. In a column layout, that relationship flips." },
        { q: "When should I use wrap in flexbox?", a: "Use wrap when items should move onto additional lines as space runs out, such as tags, cards, chips, or small modules. Keep nowrap when the layout is intended to stay on one line, like a toolbar, top nav, or controlled promo row." },
        { q: "What is align-content and why does it sometimes seem to do nothing?", a: "Align-content only affects the spacing between multiple flex lines. If your items do not wrap into more than one line, align-content will not have much visible effect. That is a common source of confusion when learning flexbox." },
        { q: "Should I use gap or margins between flex items?", a: "In most modern layouts, gap is cleaner and easier to maintain. It keeps spacing logic inside the layout container instead of pushing that responsibility onto each child. That usually becomes more important once wrapping or responsive changes are introduced." },
        { q: "Can I use the generated output directly in production?", a: "Yes. The exported CSS is standard flexbox syntax and can be pasted into stylesheets, CSS modules, styled components, inline styles, or any other production workflow. The Tailwind hint is also useful when you work in a utility-first system." },
      ]}
      relatedTools={[
        { title: "CSS Filter Generator", slug: "css-filter-generator", icon: <Palette className="w-5 h-5" />, color: 220, benefit: "Tune the look of media inside the layout" },
        { title: "CSS Box Shadow Generator", slug: "css-box-shadow-generator", icon: <Sparkles className="w-5 h-5" />, color: 250, benefit: "Add depth once the layout is set" },
        { title: "CSS Border Radius Generator", slug: "css-border-radius-generator", icon: <Layers3 className="w-5 h-5" />, color: 310, benefit: "Refine the shape of cards and controls" },
        { title: "CSS Animation Generator", slug: "css-animation-generator", icon: <Move className="w-5 h-5" />, color: 170, benefit: "Animate layout surfaces more intentionally" },
        { title: "Color Palette Generator", slug: "color-palette-generator", icon: <Type className="w-5 h-5" />, color: 140, benefit: "Apply a stronger color system after layout" },
      ]}
      ctaTitle="Keep Building Your Layout System"
      ctaDescription="Continue into filters, shadows, radius, animation, and color tools to shape not just alignment, but the full visual system around the component."
      ctaHref="/category/css-design"
    />
  );
}
