import { useMemo, useState } from "react";
import { Check, Copy, Layers3, Palette, Play, RefreshCw, Sparkles } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type Direction = "up" | "down" | "left" | "right";
type Surface = "light" | "dark" | "gradient";

interface TriangleValues {
  width: number;
  height: number;
}

const DEFAULT_VALUES: TriangleValues = {
  width: 32,
  height: 18,
};

const PRESETS: Array<{
  label: string;
  description: string;
  direction: Direction;
  values: TriangleValues;
  color: string;
  surface: Surface;
}> = [
  {
    label: "Tooltip Arrow",
    description: "Small directional pointer for bubbles, popovers, and helper UI.",
    direction: "down",
    values: { width: 20, height: 12 },
    color: "#0F172A",
    surface: "light",
  },
  {
    label: "Hero Chevron",
    description: "Larger directional shape for banners, dividers, and section transitions.",
    direction: "down",
    values: { width: 56, height: 30 },
    color: "#2563EB",
    surface: "gradient",
  },
  {
    label: "Ribbon Point",
    description: "Side-facing triangle that works well for labels and tags.",
    direction: "right",
    values: { width: 28, height: 20 },
    color: "#DC2626",
    surface: "light",
  },
  {
    label: "Badge Peak",
    description: "Up-facing accent for cards, pointers, and layered graphic treatments.",
    direction: "up",
    values: { width: 34, height: 18 },
    color: "#14B8A6",
    surface: "dark",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeHex(value: string) {
  const trimmed = value.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(trimmed)) {
    return `#${trimmed.split("").map((char) => `${char}${char}`).join("").toUpperCase()}`;
  }
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) {
    return `#${trimmed.toUpperCase()}`;
  }
  return null;
}

function triangleStyle(direction: Direction, values: TriangleValues, color: string) {
  const halfWidth = values.width / 2;

  if (direction === "up") {
    return {
      borderLeft: `${halfWidth}px solid transparent`,
      borderRight: `${halfWidth}px solid transparent`,
      borderBottom: `${values.height}px solid ${color}`,
    };
  }

  if (direction === "left") {
    return {
      borderTop: `${halfWidth}px solid transparent`,
      borderBottom: `${halfWidth}px solid transparent`,
      borderRight: `${values.height}px solid ${color}`,
    };
  }

  if (direction === "right") {
    return {
      borderTop: `${halfWidth}px solid transparent`,
      borderBottom: `${halfWidth}px solid transparent`,
      borderLeft: `${values.height}px solid ${color}`,
    };
  }

  return {
    borderLeft: `${halfWidth}px solid transparent`,
    borderRight: `${halfWidth}px solid transparent`,
    borderTop: `${values.height}px solid ${color}`,
  };
}

function cssBlock(direction: Direction, values: TriangleValues, color: string) {
  const halfWidth = values.width / 2;

  if (direction === "up") {
    return [
      "width: 0;",
      "height: 0;",
      `border-left: ${halfWidth}px solid transparent;`,
      `border-right: ${halfWidth}px solid transparent;`,
      `border-bottom: ${values.height}px solid ${color};`,
    ].join("\n");
  }

  if (direction === "left") {
    return [
      "width: 0;",
      "height: 0;",
      `border-top: ${halfWidth}px solid transparent;`,
      `border-bottom: ${halfWidth}px solid transparent;`,
      `border-right: ${values.height}px solid ${color};`,
    ].join("\n");
  }

  if (direction === "right") {
    return [
      "width: 0;",
      "height: 0;",
      `border-top: ${halfWidth}px solid transparent;`,
      `border-bottom: ${halfWidth}px solid transparent;`,
      `border-left: ${values.height}px solid ${color};`,
    ].join("\n");
  }

  return [
    "width: 0;",
    "height: 0;",
    `border-left: ${halfWidth}px solid transparent;`,
    `border-right: ${halfWidth}px solid transparent;`,
    `border-top: ${values.height}px solid ${color};`,
  ].join("\n");
}

function tailwindHint(direction: Direction, values: TriangleValues, color: string) {
  const halfWidth = values.width / 2;

  if (direction === "up") {
    return `w-0 h-0 border-l-[${halfWidth}px] border-r-[${halfWidth}px] border-b-[${values.height}px] border-l-transparent border-r-transparent border-b-[${color}]`;
  }
  if (direction === "left") {
    return `w-0 h-0 border-t-[${halfWidth}px] border-b-[${halfWidth}px] border-r-[${values.height}px] border-t-transparent border-b-transparent border-r-[${color}]`;
  }
  if (direction === "right") {
    return `w-0 h-0 border-t-[${halfWidth}px] border-b-[${halfWidth}px] border-l-[${values.height}px] border-t-transparent border-b-transparent border-l-[${color}]`;
  }
  return `w-0 h-0 border-l-[${halfWidth}px] border-r-[${halfWidth}px] border-t-[${values.height}px] border-l-transparent border-r-transparent border-t-[${color}]`;
}

function previewSurfaceClass(surface: Surface) {
  if (surface === "dark") {
    return "rounded-[32px] bg-[linear-gradient(135deg,#020617_0%,#0F172A_42%,#1E293B_100%)]";
  }
  if (surface === "gradient") {
    return "rounded-[32px] bg-gradient-to-br from-fuchsia-500 via-blue-500 to-cyan-400";
  }
  return "rounded-[32px] bg-slate-100 dark:bg-slate-900";
}

function directionSummary(direction: Direction, values: TriangleValues) {
  if (values.width <= 18 && values.height <= 12) {
    return "This size is best for compact UI pointers such as tooltips, dropdown arrows, speech bubbles, and tiny directional affordances.";
  }
  if (values.width >= 48 || values.height >= 28) {
    return "This is a display-sized triangle. Use it for hero separators, ribbons, section breaks, and decorative graphic shapes rather than small UI arrows.";
  }
  if (direction === "left" || direction === "right") {
    return "Side-facing triangles work well for labels, tags, chevrons, and stepped card layouts because they imply direction without taking much vertical space.";
  }
  return "This shape stays in the practical middle range. It is flexible enough for tooltips, accents, badges, and content markers across product interfaces.";
}

export default function CssTriangleGenerator() {
  const [direction, setDirection] = useState<Direction>("down");
  const [surface, setSurface] = useState<Surface>("light");
  const [values, setValues] = useState<TriangleValues>(DEFAULT_VALUES);
  const [triangleColor, setTriangleColor] = useState("#2563EB");
  const [copiedLabel, setCopiedLabel] = useState("");

  const resolvedColor = normalizeHex(triangleColor) ?? "#2563EB";
  const previewStyle = useMemo(() => triangleStyle(direction, values, resolvedColor), [direction, resolvedColor, values]);
  const cssText = useMemo(() => cssBlock(direction, values, resolvedColor), [direction, resolvedColor, values]);
  const tailwindText = useMemo(() => tailwindHint(direction, values, resolvedColor), [direction, resolvedColor, values]);
  const explanation = useMemo(() => directionSummary(direction, values), [direction, values]);

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setDirection(preset.direction);
    setValues(preset.values);
    setTriangleColor(preset.color);
    setSurface(preset.surface);
  };

  const randomize = () => {
    const directions: Direction[] = ["up", "down", "left", "right"];
    const surfaces: Surface[] = ["light", "dark", "gradient"];
    setDirection(directions[Math.floor(Math.random() * directions.length)]);
    setSurface(surfaces[Math.floor(Math.random() * surfaces.length)]);
    setValues({
      width: 12 + Math.floor(Math.random() * 53),
      height: 8 + Math.floor(Math.random() * 33),
    });
  };

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  return (
    <UtilityToolPageShell
      title="CSS Triangle Generator"
      seoTitle="CSS Triangle Generator - Free Visual CSS Triangle Builder"
      seoDescription="Free CSS triangle generator with live preview, direction controls, size presets, and copyable border-based CSS output. Build tooltip arrows, chevrons, ribbons, and graphic pointers instantly."
      canonical="https://usonlinetools.com/css-design/css-triangle-generator"
      categoryName="CSS & Design Tools"
      categoryHref="/category/css-design"
      heroDescription="Create CSS triangles visually instead of rebuilding border tricks from memory every time. Choose the direction, width, height, and color, preview the shape on different surfaces, and copy clean border-based CSS for tooltip arrows, chevrons, ribbons, speech bubbles, badges, dividers, and directional UI accents."
      heroIcon={<Play className="w-3.5 h-3.5" />}
      calculatorLabel="Triangle Builder"
      calculatorDescription="Preview border-based triangles live, tune direction and size, and export production-ready CSS instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="direction" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Direction
                  </label>
                  <select id="direction" value={direction} onChange={(event) => setDirection(event.target.value as Direction)} className="tool-calc-input w-full">
                    <option value="up">Up</option>
                    <option value="down">Down</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="surface" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Surface
                  </label>
                  <select id="surface" value={surface} onChange={(event) => setSurface(event.target.value as Surface)} className="tool-calc-input w-full">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="gradient">Gradient</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Triangle Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={resolvedColor} onChange={(event) => setTriangleColor(event.target.value)} className="h-11 w-12 rounded-xl border border-border bg-transparent p-1" />
                  <input value={triangleColor} onChange={(event) => setTriangleColor(event.target.value)} className="tool-calc-input w-full font-mono uppercase" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <label htmlFor="width" className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    Base Width
                  </label>
                  <span className="text-xs font-bold text-blue-600">{values.width}px</span>
                </div>
                <input
                  id="width"
                  type="range"
                  min="6"
                  max="80"
                  value={values.width}
                  onChange={(event) => setValues((current) => ({ ...current, width: clamp(Number(event.target.value), 6, 80) }))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <label htmlFor="height" className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    Height
                  </label>
                  <span className="text-xs font-bold text-blue-600">{values.height}px</span>
                </div>
                <input
                  id="height"
                  type="range"
                  min="4"
                  max="48"
                  value={values.height}
                  onChange={(event) => setValues((current) => ({ ...current, height: clamp(Number(event.target.value), 4, 48) }))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={randomize} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                  <RefreshCw className="w-4 h-4" />
                  Random
                </button>
                <button
                  onClick={() => {
                    setDirection("down");
                    setSurface("light");
                    setValues(DEFAULT_VALUES);
                    setTriangleColor("#2563EB");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted"
                >
                  <Layers3 className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            <div className={`p-4 md:p-6 ${previewSurfaceClass(surface)}`}>
              <div className="rounded-[28px] border border-white/20 bg-white/12 p-4 md:p-6 backdrop-blur-sm">
                <div className="flex flex-wrap gap-2 mb-4">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => applyPreset(preset)}
                      className="rounded-full border border-white/20 bg-white/70 px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-white dark:bg-slate-950/60 dark:text-white dark:hover:bg-slate-950"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="min-h-[320px] rounded-[24px] border border-white/20 bg-white/85 dark:bg-slate-950/65 px-5 py-8 md:px-8 md:py-10 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div style={{ width: 0, height: 0, ...previewStyle }} />
                    <div className="text-center">
                      <p className="text-sm font-bold text-foreground">Border Triangle Preview</p>
                      <p className="text-sm text-muted-foreground">
                        Direction: <span className="font-semibold text-foreground capitalize">{direction}</span> | Width:{" "}
                        <span className="font-semibold text-foreground">{values.width}px</span> | Height:{" "}
                        <span className="font-semibold text-foreground">{values.height}px</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  <div className="rounded-2xl border border-white/20 bg-white/75 p-4 dark:bg-slate-950/55">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">CSS Output</p>
                    <pre className="text-sm font-mono whitespace-pre-wrap break-words text-foreground">{cssText}</pre>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/75 p-4 dark:bg-slate-950/55">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Tailwind Hint</p>
                    <p className="text-sm font-mono break-all text-foreground">{tailwindText}</p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/75 p-4 dark:bg-slate-950/55">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Reading</p>
                    <p className="text-sm text-muted-foreground">{explanation}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={() => copyValue("css", cssText)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"
                  >
                    {copiedLabel === "css" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Copy CSS
                  </button>
                  <button
                    onClick={() => copyValue("tailwind", tailwindText)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-bold text-foreground hover:bg-muted dark:bg-slate-950"
                  >
                    {copiedLabel === "tailwind" ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    Copy Tailwind Hint
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        {
          title: "Choose the direction first",
          description: "Direction determines which border becomes visible, so start there before refining the exact base width and height.",
        },
        {
          title: "Set the triangle width and height",
          description: "Width controls the base spread, while height controls how deep the point extends. Small changes make a visible difference.",
        },
        {
          title: "Preview on the target surface",
          description: "Triangles used as tooltip arrows or chevrons need to read clearly against the real background they will sit on.",
        },
        {
          title: "Copy the border-based CSS",
          description: "Once the shape feels right, copy the output directly into your tooltip, ribbon, divider, badge, or pseudo-element styles.",
        },
      ]}
      interpretationCards={[
        {
          title: "CSS triangles are border tricks",
          description: "The rendered shape comes from visible borders on a zero-sized box. That is why direction changes which border gets the solid color.",
        },
        {
          title: "Small triangles behave like pointers",
          description: "Compact dimensions work best for speech bubbles, dropdown pointers, tabs, and helper UI where the triangle is functional rather than decorative.",
        },
        {
          title: "Larger triangles become graphic accents",
          description: "As width and height increase, the shape stops reading like a pointer and starts behaving more like a banner notch, divider, or section treatment.",
          className: "border-cyan-500/30 bg-cyan-500/5",
        },
      ]}
      examples={[
        {
          scenario: "Tooltip arrow",
          input: "20px width, 12px height, down direction",
          output: "Tight downward pointer that fits popovers and helper bubbles cleanly.",
        },
        {
          scenario: "Ribbon tag",
          input: "28px width, 20px height, right direction",
          output: "Side-facing point that works for labels, tags, and badge treatments.",
        },
        {
          scenario: "Hero section divider",
          input: "56px width, 30px height, down direction",
          output: "Display-sized chevron effect for banners, transitions, and graphic sections.",
        },
      ]}
      whyChoosePoints={[
        "Generate border-based CSS triangles without re-deriving the border math from scratch.",
        "Preview direction, size, and color visually before dropping the shape into a tooltip or badge.",
        "Use presets as a fast starting point for arrows, ribbons, chevrons, and decorative accents.",
        "Copy clean CSS or a Tailwind-style hint immediately after tuning the final shape.",
      ]}
      faqs={[
        {
          q: "Why is the element width and height set to zero?",
          a: "That is how the border trick works. The triangle is created by making one border visible and the others transparent around a zero-sized box.",
        },
        {
          q: "Can I use this for tooltip arrows?",
          a: "Yes. Small down, up, left, or right triangles are one of the most common uses for this technique, especially on pseudo-elements like ::before and ::after.",
        },
        {
          q: "Should I use clip-path instead of border triangles?",
          a: "Use border triangles when you want a lightweight, simple pointer shape. Use clip-path when you need more complex geometric shapes or custom polygon control.",
        },
        {
          q: "Is the Tailwind output exact?",
          a: "It is a practical shortcut for arbitrary values. Depending on your Tailwind setup, you may still prefer to move the final shape into a component class or design token.",
        },
      ]}
      relatedTools={[
        {
          title: "CSS Clip-Path Generator",
          slug: "/css-design/css-clip-path-generator",
          icon: <Sparkles className="w-4 h-4" />,
          color: 278,
          benefit: "Switch to more complex polygons and non-triangle shapes when borders are too limiting.",
        },
        {
          title: "CSS Grid Generator",
          slug: "/css-design/css-grid-generator",
          icon: <Layers3 className="w-4 h-4" />,
          color: 215,
          benefit: "Place pointers and accents within structured card and dashboard layouts.",
        },
        {
          title: "CSS Text Shadow Generator",
          slug: "/css-design/css-text-shadow-generator",
          icon: <Sparkles className="w-4 h-4" />,
          color: 190,
          benefit: "Pair graphic pointers with stronger display typography for hero and promo sections.",
        },
        {
          title: "Color Palette Generator",
          slug: "/css-design/color-palette-generator",
          icon: <Palette className="w-4 h-4" />,
          color: 35,
          benefit: "Choose triangle colors that match the rest of your component system.",
        },
      ]}
    />
  );
}
