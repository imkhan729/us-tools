import { useMemo, useState } from "react";
import { Check, Copy, Layers3, Palette, RefreshCw, Sparkles, Type } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type Surface = "light" | "dark" | "gradient";

interface ShadowValues {
  x: number;
  y: number;
  blur: number;
  opacity: number;
}

const DEFAULT_VALUES: ShadowValues = {
  x: 0,
  y: 8,
  blur: 20,
  opacity: 24,
};

const PRESETS: Array<{
  label: string;
  description: string;
  values: ShadowValues;
  text: string;
  textColor: string;
  shadowColor: string;
  surface: Surface;
  fontSize: number;
}> = [
  {
    label: "Soft Heading",
    description: "Subtle lift for headlines, cards, and polished editorial labels.",
    values: { x: 0, y: 8, blur: 20, opacity: 18 },
    text: "Layered type feels clearer",
    textColor: "#0F172A",
    shadowColor: "#0F172A",
    surface: "light",
    fontSize: 52,
  },
  {
    label: "Neon Glow",
    description: "High-energy luminous glow for promo banners and gaming UI.",
    values: { x: 0, y: 0, blur: 18, opacity: 72 },
    text: "Launch tonight",
    textColor: "#F8FAFC",
    shadowColor: "#22D3EE",
    surface: "dark",
    fontSize: 58,
  },
  {
    label: "Editorial Drop",
    description: "Directional shadow that feels more designed than generic blur.",
    values: { x: 7, y: 9, blur: 10, opacity: 28 },
    text: "Issue No. 05",
    textColor: "#111827",
    shadowColor: "#1E293B",
    surface: "gradient",
    fontSize: 56,
  },
  {
    label: "Retro Poster",
    description: "Chunkier offset shadow for bold display text and hero callouts.",
    values: { x: 8, y: 8, blur: 0, opacity: 40 },
    text: "Bold by design",
    textColor: "#111827",
    shadowColor: "#F97316",
    surface: "light",
    fontSize: 60,
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

function hexToRgb(hex: string) {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  };
}

function shadowString(values: ShadowValues, color: string) {
  const rgb = hexToRgb(color) ?? { r: 15, g: 23, b: 42 };
  return `${values.x}px ${values.y}px ${values.blur}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(values.opacity / 100).toFixed(2)})`;
}

function cssBlock(values: ShadowValues, color: string) {
  return `text-shadow: ${shadowString(values, color)};`;
}

function tailwindHint(values: ShadowValues, color: string) {
  const normalizedColor = normalizeHex(color) ?? "#0F172A";
  return `[text-shadow:${shadowString(values, normalizedColor).replace(/ /g, "_")}]`;
}

function previewSurfaceClass(surface: Surface) {
  if (surface === "dark") {
    return "rounded-[32px] bg-[linear-gradient(135deg,#020617_0%,#0F172A_42%,#1E293B_100%)]";
  }
  if (surface === "gradient") {
    return "rounded-[32px] bg-gradient-to-br from-amber-100 via-rose-50 to-sky-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950";
  }
  return "rounded-[32px] bg-slate-100 dark:bg-slate-900";
}

function treatmentSummary(values: ShadowValues) {
  if (values.blur === 0 && Math.abs(values.x) + Math.abs(values.y) >= 12) {
    return "This reads like a hard poster shadow, so it works best for expressive hero text, badges, and graphic display typography rather than body copy.";
  }
  if (values.blur >= 16 && Math.abs(values.x) + Math.abs(values.y) <= 4) {
    return "This behaves more like a glow than a directional shadow. It works best on dark surfaces, neon treatments, and promotional headings where atmosphere matters.";
  }
  if (values.opacity <= 18) {
    return "This is a restrained text shadow. Use it when you want slightly better separation from the background without making the effect obvious.";
  }
  return "This sits in the middle ground between clarity and style. It is a safe choice for hero headings, section labels, prominent counters, and card titles.";
}

export default function CssTextShadowGenerator() {
  const [values, setValues] = useState<ShadowValues>(DEFAULT_VALUES);
  const [surface, setSurface] = useState<Surface>("light");
  const [previewText, setPreviewText] = useState("Build cleaner display type");
  const [fontSize, setFontSize] = useState(56);
  const [textColor, setTextColor] = useState("#0F172A");
  const [shadowColor, setShadowColor] = useState("#0F172A");
  const [copiedLabel, setCopiedLabel] = useState("");

  const resolvedTextColor = normalizeHex(textColor) ?? "#0F172A";
  const resolvedShadowColor = normalizeHex(shadowColor) ?? "#0F172A";
  const textShadow = useMemo(() => shadowString(values, resolvedShadowColor), [resolvedShadowColor, values]);
  const cssText = useMemo(() => cssBlock(values, resolvedShadowColor), [resolvedShadowColor, values]);
  const tailwindText = useMemo(() => tailwindHint(values, resolvedShadowColor), [resolvedShadowColor, values]);
  const explanation = useMemo(() => treatmentSummary(values), [values]);

  const updateValue = (key: keyof ShadowValues, nextValue: number) => {
    setValues((current) => ({ ...current, [key]: nextValue }));
  };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setValues(preset.values);
    setPreviewText(preset.text);
    setTextColor(preset.textColor);
    setShadowColor(preset.shadowColor);
    setSurface(preset.surface);
    setFontSize(preset.fontSize);
  };

  const randomize = () => {
    const surfaces: Surface[] = ["light", "dark", "gradient"];
    setSurface(surfaces[Math.floor(Math.random() * surfaces.length)]);
    setValues({
      x: Math.floor(Math.random() * 21) - 10,
      y: Math.floor(Math.random() * 21) - 2,
      blur: Math.floor(Math.random() * 25),
      opacity: 14 + Math.floor(Math.random() * 63),
    });
    setFontSize(36 + Math.floor(Math.random() * 33));
  };

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  return (
    <UtilityToolPageShell
      title="CSS Text Shadow Generator"
      seoTitle="CSS Text Shadow Generator - Free Visual text-shadow Builder"
      seoDescription="Free CSS text shadow generator with live preview, presets, typography controls, and copyable CSS output. Build subtle depth, directional drop shadows, and glow effects visually."
      canonical="https://usonlinetools.com/css-design/css-text-shadow-generator"
      categoryName="CSS & Design Tools"
      categoryHref="/category/css-design"
      heroDescription="Build CSS text-shadow effects visually instead of nudging raw values inside DevTools. Control offset, blur, opacity, text color, shadow color, preview surface, and type scale, then copy production-ready CSS for hero headlines, badges, promo sections, display labels, counters, callouts, and landing-page typography."
      heroIcon={<Type className="w-3.5 h-3.5" />}
      calculatorLabel="Text Shadow Builder"
      calculatorDescription="Preview shadow treatments on realistic surfaces, refine the typography treatment, and export clean CSS instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-4">
              <div>
                <label htmlFor="preview-text" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Preview Text
                </label>
                <input
                  id="preview-text"
                  value={previewText}
                  onChange={(event) => setPreviewText(event.target.value)}
                  className="tool-calc-input w-full"
                  placeholder="Build cleaner display type"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label htmlFor="font-size" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Font Size
                  </label>
                  <input
                    id="font-size"
                    type="range"
                    min="24"
                    max="88"
                    value={fontSize}
                    onChange={(event) => setFontSize(Number(event.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <p className="text-xs font-bold text-blue-600 mt-1">{fontSize}px</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={resolvedTextColor} onChange={(event) => setTextColor(event.target.value)} className="h-11 w-12 rounded-xl border border-border bg-transparent p-1" />
                    <input value={textColor} onChange={(event) => setTextColor(event.target.value)} className="tool-calc-input w-full font-mono uppercase" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Shadow Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={resolvedShadowColor} onChange={(event) => setShadowColor(event.target.value)} className="h-11 w-12 rounded-xl border border-border bg-transparent p-1" />
                    <input value={shadowColor} onChange={(event) => setShadowColor(event.target.value)} className="tool-calc-input w-full font-mono uppercase" />
                  </div>
                </div>
              </div>

              {[
                { key: "x", label: "Horizontal Offset", min: -24, max: 24, suffix: "px" },
                { key: "y", label: "Vertical Offset", min: -8, max: 24, suffix: "px" },
                { key: "blur", label: "Blur", min: 0, max: 36, suffix: "px" },
                { key: "opacity", label: "Opacity", min: 0, max: 100, suffix: "%" },
              ].map((control) => (
                <div key={control.key}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label htmlFor={control.key} className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      {control.label}
                    </label>
                    <span className="text-xs font-bold text-blue-600">
                      {values[control.key as keyof ShadowValues]}
                      {control.suffix}
                    </span>
                  </div>
                  <input
                    id={control.key}
                    type="range"
                    min={control.min}
                    max={control.max}
                    value={values[control.key as keyof ShadowValues]}
                    onChange={(event) => updateValue(control.key as keyof ShadowValues, clamp(Number(event.target.value), control.min, control.max))}
                    className="w-full accent-blue-500"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                <button onClick={randomize} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                  <RefreshCw className="w-4 h-4" />
                  Random
                </button>
                <button
                  onClick={() => {
                    setValues(DEFAULT_VALUES);
                    setSurface("light");
                    setPreviewText("Build cleaner display type");
                    setFontSize(56);
                    setTextColor("#0F172A");
                    setShadowColor("#0F172A");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted"
                >
                  <Layers3 className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            <div className={`p-4 md:p-6 ${previewSurfaceClass(surface)}`}>
              <div className="rounded-[28px] border border-white/20 bg-white/10 p-4 md:p-6 backdrop-blur-sm">
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

                <div className="min-h-[320px] rounded-[24px] border border-white/20 bg-white/80 dark:bg-slate-950/65 px-5 py-8 md:px-8 md:py-10 flex items-center justify-center text-center overflow-hidden">
                  <p
                    className="font-black tracking-tight leading-[0.95] break-words max-w-[12ch]"
                    style={{
                      fontSize: `${fontSize}px`,
                      color: resolvedTextColor,
                      textShadow,
                    }}
                  >
                    {previewText || "Build cleaner display type"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  <div className="rounded-2xl border border-white/20 bg-white/75 p-4 dark:bg-slate-950/55">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">CSS Output</p>
                    <p className="text-sm font-mono break-all text-foreground">{cssText}</p>
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
          title: "Enter the text you want to preview",
          description: "Use a realistic heading, badge label, or promo phrase so the shadow treatment feels close to the production layout you are designing.",
        },
        {
          title: "Adjust offset, blur, and opacity",
          description: "Smaller blur values create harder graphic shadows, while larger blur values behave more like glow or atmospheric separation.",
        },
        {
          title: "Check the effect on different surfaces",
          description: "A text shadow that works on a dark hero image can feel too heavy on a light card, so test against the kind of background you will actually ship.",
        },
        {
          title: "Copy the CSS or Tailwind-safe hint",
          description: "Export the final value directly once the preview reads clearly and the effect matches the level of emphasis you want.",
        },
      ]}
      interpretationCards={[
        {
          title: "Subtle shadows improve separation, not decoration",
          description: "For most interface typography, a light shadow should simply make the text sit more clearly on layered or photographic backgrounds.",
        },
        {
          title: "Hard offsets are a graphic choice",
          description: "Large offset with low blur creates a poster-like treatment. That is useful for marketing pages and display type, but usually too expressive for utility UI.",
        },
        {
          title: "Glow effects need contrast",
          description: "Blur-heavy shadows show up most clearly when the text and the background already have strong contrast, especially on dark or richly colored surfaces.",
          className: "border-cyan-500/30 bg-cyan-500/5",
        },
      ]}
      examples={[
        {
          scenario: "Hero headline",
          input: "0px 8px 20px at 18% opacity",
          output: "Soft lift that makes large copy sit clearly over gradients and photography.",
        },
        {
          scenario: "Promo banner glow",
          input: "0px 0px 18px at 72% opacity",
          output: "Neon-style glow that amplifies energy and atmosphere on dark sections.",
        },
        {
          scenario: "Display poster type",
          input: "8px 8px 0px at 40% opacity",
          output: "Hard graphic shadow that adds bold direction to launch and campaign headings.",
        },
      ]}
      whyChoosePoints={[
        "Tune text-shadow visually instead of hand-editing raw values in the inspector.",
        "Preview typography treatments on light, dark, and gradient surfaces before copying CSS.",
        "Use presets as a fast starting point for soft editorial depth, neon glow, or poster-style offsets.",
        "Export clean CSS or a Tailwind arbitrary-value hint without extra dependencies or signup friction.",
      ]}
      faqs={[
        {
          q: "When should I use text-shadow instead of box-shadow?",
          a: "Use text-shadow when the effect belongs to the glyphs themselves. box-shadow affects the element box, not the letterforms, so it is better for cards, badges, buttons, and containers.",
        },
        {
          q: "Can text-shadow improve readability?",
          a: "Yes, when used lightly. A restrained shadow can help text separate from busy imagery or gradients, but heavy blur and strong offsets can reduce clarity instead of improving it.",
        },
        {
          q: "Why does my glow look weak on a white background?",
          a: "Glow effects rely on contrast. On very light backgrounds, bright shadows often wash out, so either lower the surface brightness or use a darker, more directional shadow instead.",
        },
        {
          q: "Is the Tailwind value production-ready?",
          a: "It is intended as a practical shortcut. If your team prefers named utilities or a plugin-based approach, you can convert the same text-shadow value into your own design-token system.",
        },
      ]}
      relatedTools={[
        {
          title: "CSS Box Shadow Generator",
          slug: "/css-design/css-box-shadow-generator",
          icon: <Layers3 className="w-4 h-4" />,
          color: 215,
          benefit: "Build matching depth for cards and surfaces around the typography.",
        },
        {
          title: "CSS Filter Generator",
          slug: "/css-design/css-filter-generator",
          icon: <Sparkles className="w-4 h-4" />,
          color: 188,
          benefit: "Add blur, contrast, and glow-style treatments to the background behind your text.",
        },
        {
          title: "Color Palette Generator",
          slug: "/css-design/color-palette-generator",
          icon: <Palette className="w-4 h-4" />,
          color: 32,
          benefit: "Choose text and shadow colors that fit the rest of your interface palette.",
        },
        {
          title: "CSS Gradient Generator",
          slug: "/css-design/css-gradient-generator",
          icon: <Sparkles className="w-4 h-4" />,
          color: 292,
          benefit: "Pair the shadow treatment with backgrounds that need readable display type.",
        },
      ]}
    />
  );
}
