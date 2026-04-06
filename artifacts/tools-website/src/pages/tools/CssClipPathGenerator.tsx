import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Crop,
  Layers3,
  Palette,
  RefreshCw,
  Sparkles,
  SquareDashedMousePointer,
  Type,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type ShapeMode = "circle" | "ellipse" | "inset" | "polygon";
type PolygonPreset = "triangle" | "diamond" | "hexagon" | "chevron" | "message" | "star";
type PreviewMode = "photo" | "gradient" | "panel";

interface CircleValues {
  radius: number;
  x: number;
  y: number;
}

interface EllipseValues {
  radiusX: number;
  radiusY: number;
  x: number;
  y: number;
}

interface InsetValues {
  top: number;
  right: number;
  bottom: number;
  left: number;
  round: number;
}

const POLYGON_MAP: Record<PolygonPreset, { label: string; points: string; note: string }> = {
  triangle: {
    label: "Triangle",
    points: "50% 0%, 0% 100%, 100% 100%",
    note: "Useful for directional badges, hero art, and sharp decorative accents.",
  },
  diamond: {
    label: "Diamond",
    points: "50% 0%, 100% 50%, 50% 100%, 0% 50%",
    note: "Good for logo treatments, tiles, profile markers, and editorial graphics.",
  },
  hexagon: {
    label: "Hexagon",
    points: "25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%",
    note: "A reliable choice for badges, product categories, and modular UI blocks.",
  },
  chevron: {
    label: "Chevron",
    points: "0% 0%, 78% 0%, 100% 50%, 78% 100%, 0% 100%, 14% 50%",
    note: "Strong for navigation, pricing banners, directional labels, and calls to action.",
  },
  message: {
    label: "Speech Bubble",
    points: "0% 0%, 100% 0%, 100% 78%, 60% 78%, 44% 100%, 46% 78%, 0% 78%",
    note: "Useful for chat UI, testimonial highlights, and dialogue-style design blocks.",
  },
  star: {
    label: "Star",
    points: "50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%",
    note: "Best for gamified interfaces, awards, ratings, and promotion-heavy layouts.",
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildClipPath(
  mode: ShapeMode,
  circle: CircleValues,
  ellipse: EllipseValues,
  inset: InsetValues,
  polygon: PolygonPreset,
) {
  if (mode === "circle") {
    return `circle(${circle.radius}% at ${circle.x}% ${circle.y}%)`;
  }
  if (mode === "ellipse") {
    return `ellipse(${ellipse.radiusX}% ${ellipse.radiusY}% at ${ellipse.x}% ${ellipse.y}%)`;
  }
  if (mode === "inset") {
    return `inset(${inset.top}% ${inset.right}% ${inset.bottom}% ${inset.left}% round ${inset.round}px)`;
  }
  return `polygon(${POLYGON_MAP[polygon].points})`;
}

function cssBlock(clipPath: string) {
  return `clip-path: ${clipPath};\n-webkit-clip-path: ${clipPath};`;
}

function tailwindHint(clipPath: string) {
  return `[clip-path:${clipPath.replace(/ /g, "_")}]`;
}

function shapeSummary(mode: ShapeMode, polygon: PolygonPreset) {
  if (mode === "circle") {
    return "Circle clipping is ideal for avatars, product crops, spotlight imagery, and softer editorial framing. It feels clean, familiar, and naturally balanced.";
  }
  if (mode === "ellipse") {
    return "Ellipse clipping creates a more cinematic crop than a circle. It is useful for wide artwork, hero imagery, logos, and decorative media surfaces that need softer custom framing.";
  }
  if (mode === "inset") {
    return "Inset clipping removes edges from a rectangle while keeping the general card geometry intact. It works well for tickets, stepped cards, banners, and shaped content blocks that still need predictable layout behavior.";
  }
  return POLYGON_MAP[polygon].note;
}

function previewBackground(mode: PreviewMode) {
  if (mode === "gradient") {
    return "bg-gradient-to-br from-fuchsia-500 via-cyan-400 to-lime-300";
  }
  if (mode === "panel") {
    return "bg-[linear-gradient(135deg,#111827_0%,#0F172A_35%,#1E293B_100%)]";
  }
  return "bg-[url('https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center";
}

export default function CssClipPathGenerator() {
  const [mode, setMode] = useState<ShapeMode>("polygon");
  const [polygonPreset, setPolygonPreset] = useState<PolygonPreset>("hexagon");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("photo");
  const [circle, setCircle] = useState<CircleValues>({ radius: 42, x: 50, y: 50 });
  const [ellipse, setEllipse] = useState<EllipseValues>({ radiusX: 44, radiusY: 34, x: 50, y: 50 });
  const [inset, setInset] = useState<InsetValues>({ top: 8, right: 10, bottom: 12, left: 10, round: 24 });
  const [copiedLabel, setCopiedLabel] = useState("");

  const clipPath = useMemo(() => buildClipPath(mode, circle, ellipse, inset, polygonPreset), [mode, circle, ellipse, inset, polygonPreset]);
  const cssText = useMemo(() => cssBlock(clipPath), [clipPath]);
  const tailwindText = useMemo(() => tailwindHint(clipPath), [clipPath]);
  const explanation = useMemo(() => shapeSummary(mode, polygonPreset), [mode, polygonPreset]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const randomize = () => {
    const modes: ShapeMode[] = ["circle", "ellipse", "inset", "polygon"];
    const previews: PreviewMode[] = ["photo", "gradient", "panel"];
    const polygons: PolygonPreset[] = ["triangle", "diamond", "hexagon", "chevron", "message", "star"];
    const nextMode = modes[Math.floor(Math.random() * modes.length)];
    setMode(nextMode);
    setPreviewMode(previews[Math.floor(Math.random() * previews.length)]);
    setPolygonPreset(polygons[Math.floor(Math.random() * polygons.length)]);
    setCircle({
      radius: 28 + Math.floor(Math.random() * 33),
      x: 28 + Math.floor(Math.random() * 45),
      y: 28 + Math.floor(Math.random() * 45),
    });
    setEllipse({
      radiusX: 26 + Math.floor(Math.random() * 34),
      radiusY: 22 + Math.floor(Math.random() * 28),
      x: 28 + Math.floor(Math.random() * 45),
      y: 28 + Math.floor(Math.random() * 45),
    });
    setInset({
      top: Math.floor(Math.random() * 20),
      right: Math.floor(Math.random() * 20),
      bottom: Math.floor(Math.random() * 20),
      left: Math.floor(Math.random() * 20),
      round: Math.floor(Math.random() * 41),
    });
  };

  return (
    <UtilityToolPageShell
      title="CSS Clip-Path Generator"
      seoTitle="CSS Clip-Path Generator - Free Visual clip-path Builder"
      seoDescription="Free CSS clip-path generator with live preview, circle, ellipse, inset, and polygon presets, plus copyable CSS output for modern web UI and graphics."
      canonical="https://usonlinetools.com/css-design/css-clip-path-generator"
      categoryName="CSS & Design Tools"
      categoryHref="/category/css-design"
      heroDescription="Generate custom CSS clip-path shapes visually instead of hand-writing syntax from scratch. Build circles, ellipses, inset crops, and reusable polygon shapes for hero media, badges, cards, banners, avatars, decorative art, product grids, and modern frontend layouts, then copy production-ready CSS instantly."
      heroIcon={<Crop className="w-3.5 h-3.5" />}
      calculatorLabel="Shape Builder"
      calculatorDescription="Preview clip-path shapes on realistic surfaces, tweak the shape controls, and export clean CSS instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-4">
              <div>
                <label htmlFor="shape-mode" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Shape Mode
                </label>
                <select id="shape-mode" value={mode} onChange={(event) => setMode(event.target.value as ShapeMode)} className="tool-calc-input w-full">
                  <option value="circle">Circle</option>
                  <option value="ellipse">Ellipse</option>
                  <option value="inset">Inset</option>
                  <option value="polygon">Polygon</option>
                </select>
              </div>

              <div>
                <label htmlFor="preview-mode" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Preview Surface
                </label>
                <select id="preview-mode" value={previewMode} onChange={(event) => setPreviewMode(event.target.value as PreviewMode)} className="tool-calc-input w-full">
                  <option value="photo">Photo</option>
                  <option value="gradient">Gradient</option>
                  <option value="panel">Dark Panel</option>
                </select>
              </div>

              {mode === "circle" && (
                <>
                  {[
                    { key: "radius", label: "Radius", min: 10, max: 60, suffix: "%" },
                    { key: "x", label: "Center X", min: 0, max: 100, suffix: "%" },
                    { key: "y", label: "Center Y", min: 0, max: 100, suffix: "%" },
                  ].map((control) => (
                    <div key={control.key}>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <label htmlFor={control.key} className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                          {control.label}
                        </label>
                        <span className="text-xs font-bold text-blue-600">
                          {circle[control.key as keyof CircleValues]}
                          {control.suffix}
                        </span>
                      </div>
                      <input
                        id={control.key}
                        type="range"
                        min={control.min}
                        max={control.max}
                        value={circle[control.key as keyof CircleValues]}
                        onChange={(event) =>
                          setCircle((current) => ({ ...current, [control.key]: clamp(Number(event.target.value), control.min, control.max) }))
                        }
                        className="w-full accent-blue-500"
                      />
                    </div>
                  ))}
                </>
              )}

              {mode === "ellipse" && (
                <>
                  {[
                    { key: "radiusX", label: "Radius X", min: 10, max: 70, suffix: "%" },
                    { key: "radiusY", label: "Radius Y", min: 10, max: 70, suffix: "%" },
                    { key: "x", label: "Center X", min: 0, max: 100, suffix: "%" },
                    { key: "y", label: "Center Y", min: 0, max: 100, suffix: "%" },
                  ].map((control) => (
                    <div key={control.key}>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <label htmlFor={control.key} className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                          {control.label}
                        </label>
                        <span className="text-xs font-bold text-blue-600">
                          {ellipse[control.key as keyof EllipseValues]}
                          {control.suffix}
                        </span>
                      </div>
                      <input
                        id={control.key}
                        type="range"
                        min={control.min}
                        max={control.max}
                        value={ellipse[control.key as keyof EllipseValues]}
                        onChange={(event) =>
                          setEllipse((current) => ({ ...current, [control.key]: clamp(Number(event.target.value), control.min, control.max) }))
                        }
                        className="w-full accent-blue-500"
                      />
                    </div>
                  ))}
                </>
              )}

              {mode === "inset" && (
                <>
                  {[
                    { key: "top", label: "Top Cut", min: 0, max: 40, suffix: "%" },
                    { key: "right", label: "Right Cut", min: 0, max: 40, suffix: "%" },
                    { key: "bottom", label: "Bottom Cut", min: 0, max: 40, suffix: "%" },
                    { key: "left", label: "Left Cut", min: 0, max: 40, suffix: "%" },
                    { key: "round", label: "Corner Round", min: 0, max: 48, suffix: "px" },
                  ].map((control) => (
                    <div key={control.key}>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <label htmlFor={control.key} className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                          {control.label}
                        </label>
                        <span className="text-xs font-bold text-blue-600">
                          {inset[control.key as keyof InsetValues]}
                          {control.suffix}
                        </span>
                      </div>
                      <input
                        id={control.key}
                        type="range"
                        min={control.min}
                        max={control.max}
                        value={inset[control.key as keyof InsetValues]}
                        onChange={(event) =>
                          setInset((current) => ({ ...current, [control.key]: clamp(Number(event.target.value), control.min, control.max) }))
                        }
                        className="w-full accent-blue-500"
                      />
                    </div>
                  ))}
                </>
              )}

              {mode === "polygon" && (
                <div>
                  <label htmlFor="polygon-preset" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Polygon Preset
                  </label>
                  <select id="polygon-preset" value={polygonPreset} onChange={(event) => setPolygonPreset(event.target.value as PolygonPreset)} className="tool-calc-input w-full">
                    {Object.entries(POLYGON_MAP).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{POLYGON_MAP[polygonPreset].note}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={randomize}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted"
                >
                  <RefreshCw className="w-4 h-4" />
                  Random
                </button>
                <button
                  onClick={() => {
                    setMode("polygon");
                    setPolygonPreset("hexagon");
                    setPreviewMode("photo");
                    setCircle({ radius: 42, x: 50, y: 50 });
                    setEllipse({ radiusX: 44, radiusY: 34, x: 50, y: 50 });
                    setInset({ top: 8, right: 10, bottom: 12, left: 10, round: 24 });
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted"
                >
                  <Layers3 className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Live Preview</p>
                <div className="rounded-[32px] bg-slate-100 p-5 dark:bg-slate-900">
                  <div className="flex min-h-[300px] items-center justify-center rounded-[28px] border border-dashed border-white/25 p-6 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-950 dark:to-slate-900">
                    <div
                      className={`${previewBackground(previewMode)} relative h-[250px] w-full max-w-xl overflow-hidden rounded-[32px] border border-white/15 shadow-xl`}
                      style={{ clipPath, WebkitClipPath: clipPath }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                      <div className="absolute left-6 bottom-6 right-6 text-white">
                        <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-2">Preview Surface</p>
                        <h3 className="text-2xl font-black mb-2">Clip-path changes the silhouette before the layout even moves.</h3>
                        <p className="text-sm leading-relaxed opacity-90">
                          Use it to create shaped media, decorative callouts, brand motifs, and less generic interface surfaces.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">CSS Output</p>
                    <button onClick={() => copyValue("css", cssText)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === "css" ? "Copied" : "Copy CSS"}
                    </button>
                  </div>
                  <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                    <code>{cssText}</code>
                  </pre>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Tailwind Hint</p>
                    <button onClick={() => copyValue("tailwind", tailwindText)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === "tailwind" ? "Copied" : "Copy Hint"}
                    </button>
                  </div>
                  <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                    <code>{tailwindText}</code>
                  </pre>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-4">
                <p className="text-sm font-bold text-foreground mb-1">Shape Summary</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        {
          title: "Choose the clipping strategy",
          description: "Start with circle, ellipse, inset, or polygon depending on whether you need a soft crop, a geometric card edge, or a more branded silhouette.",
        },
        {
          title: "Adjust the shape controls",
          description: "For circles and ellipses, control the size and position of the crop. For inset shapes, define how much of each edge gets cut away and whether the remaining shape should keep rounded corners.",
        },
        {
          title: "Switch polygon presets when you need a stronger silhouette",
          description: "Polygon presets are useful when the goal is not just cropping but creating a distinctive shape that helps a card, badge, or media block feel less generic.",
        },
        {
          title: "Test the shape on a realistic preview",
          description: "Use the photo, gradient, and panel surfaces to make sure the clip-path still feels intentional when it sits on real content instead of an empty square.",
        },
        {
          title: "Copy the final CSS",
          description: "When the shape looks right, copy the plain CSS declaration or the Tailwind arbitrary utility hint and apply it directly to your component.",
        },
      ]}
      interpretationCards={[
        {
          title: "Clip-path changes the silhouette, not the box model",
          description: "The visible shape changes, but layout sizing and document flow usually remain tied to the original element box. That matters when spacing and overlap need to stay predictable.",
        },
        {
          title: "Circle and ellipse are the safest for media crops",
          description: "These modes are easy to reason about and tend to stay resilient across responsive breakpoints. Use them for avatars, thumbnails, hero media, and decorative images.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Inset shapes are often more practical than wild polygons",
          description: "If you still need a component to behave like a card while looking more custom, inset clipping is usually a better production choice than a complex polygon.",
          className: "bg-indigo-500/5 border-indigo-500/20",
        },
        {
          title: "Polygon shapes work best when they reinforce a real design system",
          description: "Geometric clipping should support a brand motif, navigation pattern, or promotional style. Random polygons without a clear reason can make a UI feel chaotic rather than distinctive.",
          className: "bg-violet-500/5 border-violet-500/20",
        },
      ]}
      examples={[
        { scenario: "Avatar crop", input: "circle(40% at 50% 50%)", output: "Soft centered circular crop" },
        { scenario: "Editorial hero image", input: "ellipse(44% 34% at 50% 50%)", output: "Wider cinematic crop" },
        { scenario: "Ticket card", input: "inset(8% 10% 12% 10% round 24px)", output: "Structured cut-card silhouette" },
        { scenario: "Promo badge", input: "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)", output: "Clean hexagon badge" },
        { scenario: "Directional banner", input: "polygon(0% 0%, 78% 0%, 100% 50%, 78% 100%, 0% 100%, 14% 50%)", output: "Chevron-style content label" },
      ]}
      whyChoosePoints={[
        "A CSS clip-path generator is useful because clip-path syntax is powerful but awkward to build by hand. Even basic shapes like circles and ellipses require trial and error when positioning the crop, while polygon coordinates become slow to tune manually. A visual builder removes that friction and makes the shape readable immediately instead of forcing you to imagine it from raw percentages.",
        "That matters because clip-path is not just a decorative CSS feature. It changes the silhouette of a component before typography, color, or spacing even enter the conversation. A shaped image card, cropped hero banner, or geometric callout can shift the entire feel of a layout from generic to intentional when the silhouette supports the content correctly.",
        "This tool is especially helpful for modern marketing pages, editorial layouts, product showcases, dashboards, and design systems that need more than rectangles with rounded corners. Teams often want more visual distinction but do not want to commit to a heavy custom SVG workflow for every shaped block. Clip-path offers a clean middle ground when used carefully.",
        "The preview matters because clip-path often looks acceptable on an empty box but fails on real content. A shape that feels sharp and stylish on a gradient may become awkward on photography, while a crop that works for media can break readability on a text-heavy card. Testing on multiple surfaces reduces that mismatch before implementation.",
        "This page also fits the broader workflow of the CSS and design tools category. Designers and frontend developers often pair clip-path with gradients, shadows, rounded corners, and motion. That is why the internal links here matter: shaping the silhouette is only one part of the visual system, and it works best when the rest of the component language is considered alongside it.",
      ]}
      faqs={[
        {
          q: "What does clip-path do in CSS?",
          a: "Clip-path hides parts of an element so only a defined shape remains visible. You can use simple built-in shapes like circle, ellipse, inset, or polygon to crop images, cards, videos, decorative layers, and interface components without editing the source asset itself.",
        },
        {
          q: "Does clip-path change the element's layout size?",
          a: "Usually no. The visible area changes, but the element still occupies its original layout box in normal document flow. That means margins, spacing, and overlap behavior still need to be planned around the full box dimensions.",
        },
        {
          q: "When should I use clip-path instead of border-radius?",
          a: "Use border-radius when you only need softer corners or pills. Use clip-path when the silhouette itself needs to become a circle, ellipse, custom inset crop, or polygon shape. Clip-path is stronger and more flexible, but it should be used with clearer intent.",
        },
        {
          q: "Are polygon clip-path values hard to maintain?",
          a: "They can be if they are written manually without a visual system. That is why using reusable presets or generated values is helpful. Once the coordinates are stable, they are easy to keep in production, especially when tied to named components or design tokens.",
        },
        {
          q: "Can I animate clip-path?",
          a: "Yes, in many cases clip-path can be animated, especially between compatible values. It is commonly used for reveals, hover states, masks, and storytelling transitions, though you should test performance and browser behavior for more complex cases.",
        },
        {
          q: "Can I use the exported CSS directly in production?",
          a: "Yes. The generated syntax uses standard clip-path and -webkit-clip-path declarations so you can paste it into CSS, CSS modules, component styles, or utility-first frameworks that support arbitrary properties.",
        },
      ]}
      relatedTools={[
        { title: "CSS Box Shadow Generator", slug: "css-box-shadow-generator", icon: <SquareDashedMousePointer className="w-5 h-5" />, color: 220, benefit: "Add depth after shaping the silhouette" },
        { title: "CSS Border Radius Generator", slug: "css-border-radius-generator", icon: <Layers3 className="w-5 h-5" />, color: 250, benefit: "Compare edge softening against full clipping" },
        { title: "CSS Gradient Generator", slug: "css-gradient-generator", icon: <Palette className="w-5 h-5" />, color: 310, benefit: "Build shaped gradient surfaces" },
        { title: "CSS Animation Generator", slug: "css-animation-generator", icon: <Sparkles className="w-5 h-5" />, color: 170, benefit: "Animate reveals and shape-led motion" },
        { title: "Color Palette Generator", slug: "color-palette-generator", icon: <Type className="w-5 h-5" />, color: 140, benefit: "Pair shape choices with a stronger palette" },
      ]}
      ctaTitle="Keep Building More Distinctive UI"
      ctaDescription="Continue into shadows, gradients, radius, and animation tools to shape not just the crop, but the full visual language of the component."
      ctaHref="/category/css-design"
    />
  );
}
