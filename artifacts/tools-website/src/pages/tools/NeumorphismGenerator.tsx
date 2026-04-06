import { useMemo, useState } from "react";
import { Check, Copy, Layers3, Palette, RefreshCw, Sparkles, SunMedium } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type DepthMode = "raised" | "inset";
type LightSource = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface NeuValues {
  distance: number;
  blur: number;
  intensity: number;
  radius: number;
}

const DEFAULT_VALUES: NeuValues = {
  distance: 14,
  blur: 28,
  intensity: 22,
  radius: 28,
};

const PRESETS: Array<{
  label: string;
  description: string;
  mode: DepthMode;
  source: LightSource;
  base: string;
  values: NeuValues;
}> = [
  {
    label: "Soft Card",
    description: "Classic raised neumorphic card for calm product UI and widgets.",
    mode: "raised",
    source: "top-left",
    base: "#E7ECF3",
    values: { distance: 14, blur: 28, intensity: 22, radius: 28 },
  },
  {
    label: "Inset Well",
    description: "Sunken treatment for toggles, inputs, and quiet control surfaces.",
    mode: "inset",
    source: "top-left",
    base: "#E6EBF2",
    values: { distance: 10, blur: 22, intensity: 20, radius: 24 },
  },
  {
    label: "Dense Tile",
    description: "Heavier raised block with stronger separation and softer corners.",
    mode: "raised",
    source: "bottom-right",
    base: "#DCE3EC",
    values: { distance: 18, blur: 34, intensity: 26, radius: 30 },
  },
  {
    label: "Compact Chip",
    description: "Rounded control treatment for pills, tags, and micro-components.",
    mode: "raised",
    source: "top-right",
    base: "#EDF1F7",
    values: { distance: 9, blur: 18, intensity: 18, radius: 999 },
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

function rgba(hex: string, alpha: number) {
  const rgb = hexToRgb(hex) ?? { r: 15, g: 23, b: 42 };
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.toFixed(2)})`;
}

function adjustColor(hex: string, amount: number) {
  const rgb = hexToRgb(hex) ?? { r: 230, g: 235, b: 242 };
  const clampColor = (value: number) => Math.min(255, Math.max(0, value));
  const next = {
    r: clampColor(rgb.r + amount),
    g: clampColor(rgb.g + amount),
    b: clampColor(rgb.b + amount),
  };
  return `rgb(${next.r}, ${next.g}, ${next.b})`;
}

function offsets(source: LightSource, distance: number) {
  if (source === "top-right") return { lightX: -distance, lightY: -distance, darkX: distance, darkY: distance };
  if (source === "bottom-left") return { lightX: distance, lightY: distance, darkX: -distance, darkY: -distance };
  if (source === "bottom-right") return { lightX: -distance, lightY: distance, darkX: distance, darkY: -distance };
  return { lightX: -distance, lightY: -distance, darkX: distance, darkY: distance };
}

function shadowValue(base: string, values: NeuValues, mode: DepthMode, source: LightSource) {
  const { lightX, lightY, darkX, darkY } = offsets(source, values.distance);
  const lightColor = rgba(adjustColor(base, 26), values.intensity / 100);
  const darkColor = rgba(adjustColor(base, -42), (values.intensity + 4) / 100);
  const prefix = mode === "inset" ? "inset " : "";
  return `${prefix}${lightX}px ${lightY}px ${values.blur}px ${lightColor}, ${prefix}${darkX}px ${darkY}px ${values.blur}px ${darkColor}`;
}

function cssBlock(base: string, values: NeuValues, mode: DepthMode, source: LightSource) {
  const radius = values.radius >= 999 ? "999px" : `${values.radius}px`;
  return [
    `background: ${base};`,
    `border-radius: ${radius};`,
    `box-shadow: ${shadowValue(base, values, mode, source)};`,
  ].join("\n");
}

function tailwindHint(base: string, values: NeuValues, mode: DepthMode, source: LightSource) {
  const radius = values.radius >= 999 ? "rounded-full" : `rounded-[${values.radius}px]`;
  const shadow = shadowValue(base, values, mode, source).replace(/ /g, "_");
  return `${radius} bg-[${base}] shadow-[${shadow}]`;
}

function summary(values: NeuValues, mode: DepthMode, source: LightSource) {
  if (mode === "inset") {
    return "This is a recessed neumorphic treatment, so it works best for quiet wells, toggles, segmented controls, and surfaces that should feel pressed into the background.";
  }
  if (values.radius >= 999) {
    return "This reads as a soft neumorphic chip or pill rather than a content card. It is more useful for small controls than for dense information blocks.";
  }
  if (source === "bottom-right" || source === "bottom-left") {
    return "The light source is flipped away from the common top-left convention, which creates a more stylized result. That can work, but it needs consistency across the interface.";
  }
  return "This stays close to the safer neumorphic middle ground: a soft raised surface with enough separation to feel tactile without becoming muddy.";
}

export default function NeumorphismGenerator() {
  const [values, setValues] = useState<NeuValues>(DEFAULT_VALUES);
  const [mode, setMode] = useState<DepthMode>("raised");
  const [source, setSource] = useState<LightSource>("top-left");
  const [baseColor, setBaseColor] = useState("#E7ECF3");
  const [copiedLabel, setCopiedLabel] = useState("");

  const resolvedBase = normalizeHex(baseColor) ?? "#E7ECF3";
  const cssText = useMemo(() => cssBlock(resolvedBase, values, mode, source), [mode, resolvedBase, source, values]);
  const tailwindText = useMemo(() => tailwindHint(resolvedBase, values, mode, source), [mode, resolvedBase, source, values]);
  const explanation = useMemo(() => summary(values, mode, source), [mode, source, values]);
  const radius = values.radius >= 999 ? "999px" : `${values.radius}px`;
  const cardShadow = useMemo(() => shadowValue(resolvedBase, values, mode, source), [mode, resolvedBase, source, values]);

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setValues(preset.values);
    setMode(preset.mode);
    setSource(preset.source);
    setBaseColor(preset.base);
  };

  const randomize = () => {
    const modes: DepthMode[] = ["raised", "inset"];
    const sources: LightSource[] = ["top-left", "top-right", "bottom-left", "bottom-right"];
    setMode(modes[Math.floor(Math.random() * modes.length)]);
    setSource(sources[Math.floor(Math.random() * sources.length)]);
    setValues({
      distance: 6 + Math.floor(Math.random() * 15),
      blur: 12 + Math.floor(Math.random() * 29),
      intensity: 12 + Math.floor(Math.random() * 19),
      radius: Math.random() > 0.82 ? 999 : 16 + Math.floor(Math.random() * 17),
    });
  };

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  return (
    <UtilityToolPageShell
      title="Neumorphism Generator"
      seoTitle="Neumorphism Generator - Free Soft UI CSS Shadow Builder"
      seoDescription="Free neumorphism generator with live preview, raised and inset modes, dual-shadow controls, light-source tuning, and copyable CSS output."
      canonical="https://usonlinetools.com/css-design/neumorphism-generator"
      categoryName="CSS & Design Tools"
      categoryHref="/category/css-design"
      heroDescription="Build soft neumorphic UI visually instead of manually balancing highlight and shadow pairs. Control distance, blur, intensity, radius, mode, light source, and base color, then copy production-ready CSS for cards, toggles, input wells, chips, buttons, and tactile interface components."
      heroIcon={<SunMedium className="w-3.5 h-3.5" />}
      calculatorLabel="Soft UI Builder"
      calculatorDescription="Preview neumorphic surfaces live, tune highlight and shadow balance, and export clean CSS instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="mode" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Depth Mode
                  </label>
                  <select id="mode" value={mode} onChange={(event) => setMode(event.target.value as DepthMode)} className="tool-calc-input w-full">
                    <option value="raised">Raised</option>
                    <option value="inset">Inset</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="source" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Light Source
                  </label>
                  <select id="source" value={source} onChange={(event) => setSource(event.target.value as LightSource)} className="tool-calc-input w-full">
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Base Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={resolvedBase} onChange={(event) => setBaseColor(event.target.value)} className="h-11 w-12 rounded-xl border border-border bg-transparent p-1" />
                  <input value={baseColor} onChange={(event) => setBaseColor(event.target.value)} className="tool-calc-input w-full font-mono uppercase" />
                </div>
              </div>

              {[
                { key: "distance", label: "Shadow Distance", min: 2, max: 24, suffix: "px" },
                { key: "blur", label: "Shadow Blur", min: 4, max: 48, suffix: "px" },
                { key: "intensity", label: "Intensity", min: 4, max: 40, suffix: "%" },
              ].map((control) => (
                <div key={control.key}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label htmlFor={control.key} className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      {control.label}
                    </label>
                    <span className="text-xs font-bold text-blue-600">
                      {values[control.key as keyof NeuValues]}
                      {control.suffix}
                    </span>
                  </div>
                  <input
                    id={control.key}
                    type="range"
                    min={control.min}
                    max={control.max}
                    value={values[control.key as keyof NeuValues]}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        [control.key]: clamp(Number(event.target.value), control.min, control.max),
                      }))
                    }
                    className="w-full accent-blue-500"
                  />
                </div>
              ))}

              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <label htmlFor="radius" className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    Corner Radius
                  </label>
                  <span className="text-xs font-bold text-blue-600">{values.radius >= 999 ? "Full" : `${values.radius}px`}</span>
                </div>
                <input
                  id="radius"
                  type="range"
                  min="10"
                  max="40"
                  value={values.radius >= 999 ? 40 : values.radius}
                  onChange={(event) => setValues((current) => ({ ...current, radius: Number(event.target.value) }))}
                  className="w-full accent-blue-500"
                />
                <button
                  onClick={() => setValues((current) => ({ ...current, radius: current.radius >= 999 ? 28 : 999 }))}
                  className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${
                    values.radius >= 999 ? "bg-blue-600 text-white" : "border border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  <Layers3 className="w-4 h-4" />
                  {values.radius >= 999 ? "Pill Radius On" : "Toggle Pill Radius"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={randomize} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                  <RefreshCw className="w-4 h-4" />
                  Random
                </button>
                <button
                  onClick={() => {
                    setValues(DEFAULT_VALUES);
                    setMode("raised");
                    setSource("top-left");
                    setBaseColor("#E7ECF3");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted"
                >
                  <Sparkles className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            <div className="rounded-[34px] p-4 md:p-6" style={{ background: resolvedBase }}>
              <div className="min-h-[420px] rounded-[30px] p-5 md:p-7" style={{ background: adjustColor(resolvedBase, 4) }}>
                <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-5 items-center">
                  <div
                    className="p-7"
                    style={{
                      background: resolvedBase,
                      borderRadius: radius,
                      boxShadow: cardShadow,
                    }}
                  >
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Neumorphic Surface</p>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight text-slate-800 mb-3">Soft UI works when the shadows feel cohesive.</h3>
                    <p className="text-sm leading-relaxed text-slate-600 mb-4">
                      Keep the base color, highlight, and shadow pair close enough together that the component feels tactile instead of muddy or artificially embossed.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full px-3 py-1.5 text-xs font-bold text-slate-700" style={{ background: adjustColor(resolvedBase, 10), boxShadow: shadowValue(resolvedBase, { ...values, distance: Math.max(4, values.distance - 4), blur: Math.max(8, values.blur - 10) }, "raised", source) }}>
                        {mode === "inset" ? "Inset" : "Raised"}
                      </span>
                      <span className="rounded-full px-3 py-1.5 text-xs font-bold text-slate-700" style={{ background: adjustColor(resolvedBase, 10) }}>
                        {source.replace("-", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div className="rounded-2xl border border-white/50 bg-white/55 p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">CSS Output</p>
                      <pre className="text-sm font-mono whitespace-pre-wrap break-words text-slate-800">{cssText}</pre>
                    </div>
                    <div className="rounded-2xl border border-white/50 bg-white/55 p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Tailwind Hint</p>
                      <p className="text-sm break-all font-mono text-slate-800">{tailwindText}</p>
                    </div>
                    <div className="rounded-2xl border border-white/50 bg-white/55 p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Reading</p>
                      <p className="text-sm text-slate-600">{explanation}</p>
                    </div>
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
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-900 hover:bg-slate-100"
                  >
                    {copiedLabel === "tailwind" ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    Copy Tailwind Hint
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Preset Library</p>
                <p className="text-sm text-muted-foreground mt-1">Use common raised and inset soft-UI treatments as a practical starting point.</p>
              </div>
              <Sparkles className="w-4 h-4 text-blue-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  className="rounded-2xl border border-border bg-muted/30 p-4 text-left hover:border-blue-500/40 hover:bg-blue-500/5 transition-colors"
                >
                  <p className="font-bold text-foreground mb-1">{preset.label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      }
      howSteps={[
        {
          title: "Choose the base surface color",
          description: "Neumorphism depends on the component blending closely with its background, so start with a soft neutral base instead of a highly contrasting panel color.",
        },
        {
          title: "Set whether the element is raised or inset",
          description: "Raised mode makes the component feel lifted above the surface, while inset mode makes it feel pressed in.",
        },
        {
          title: "Tune distance, blur, and intensity together",
          description: "These values define how far the highlight and shadow sit from the component, how soft they feel, and how visible the effect is overall.",
        },
        {
          title: "Keep the light source consistent",
          description: "If one card is lit from the top-left and another from the bottom-right, the interface starts to feel visually incoherent.",
        },
      ]}
      interpretationCards={[
        {
          title: "Neumorphism works best on quiet backgrounds",
          description: "The style relies on subtle contrast, so noisy imagery and strong gradients usually fight against the effect instead of supporting it.",
        },
        {
          title: "Raised and inset surfaces should be used intentionally",
          description: "Raised blocks are better for cards and buttons, while inset treatments usually belong to wells, fields, and embedded controls.",
        },
        {
          title: "Too much intensity makes the UI feel muddy",
          description: "When both shadows become too dark or too bright, the component stops looking soft and starts feeling embossed or dated.",
          className: "border-cyan-500/30 bg-cyan-500/5",
        },
      ]}
      examples={[
        {
          scenario: "Soft dashboard tile",
          input: "Raised, 14px distance, 28px blur, 22% intensity",
          output: "Balanced tactile card with enough lift to separate from the background.",
        },
        {
          scenario: "Inset input well",
          input: "Inset, 10px distance, 22px blur, 20% intensity",
          output: "Pressed-in surface that works for form fields and segmented controls.",
        },
        {
          scenario: "Compact pill control",
          input: "Raised, full radius, 9px distance, 18px blur",
          output: "Rounded soft-UI chip for filters, tabs, and compact actions.",
        },
      ]}
      whyChoosePoints={[
        "Tune paired light and dark shadows visually instead of manually balancing two opposing values every time.",
        "Switch between raised and inset neumorphic treatments with realistic preview feedback.",
        "Use presets for common cards, wells, and chips rather than rebuilding the style from scratch.",
        "Export clean CSS or a Tailwind-style hint as soon as the surface feels coherent.",
      ]}
      faqs={[
        {
          q: "What makes neumorphism different from regular box shadows?",
          a: "Neumorphism typically uses two coordinated shadows, one lighter and one darker, so the component appears to emerge from or sink into the same background color instead of floating above a different surface.",
        },
        {
          q: "Why does neumorphism often look washed out?",
          a: "The effect falls apart when the base color, highlight, and shadow contrast are not balanced. Too little contrast makes it vanish, while too much contrast makes it look embossed or muddy.",
        },
        {
          q: "Is neumorphism good for every UI?",
          a: "No. It works best for calm, tactile, minimal interfaces. It is usually weaker for dense information systems, accessibility-heavy products, or designs that require very strong contrast boundaries.",
        },
        {
          q: "Can I still use neumorphism with Tailwind?",
          a: "Yes, usually through arbitrary shadow values or extracted component classes. The generated hint is useful as a quick implementation shortcut.",
        },
      ]}
      relatedTools={[
        {
          title: "CSS Box Shadow Generator",
          slug: "/css-design/css-box-shadow-generator",
          icon: <Layers3 className="w-4 h-4" />,
          color: 215,
          benefit: "Switch to conventional depth treatments when soft UI is too subtle for the layout.",
        },
        {
          title: "Glassmorphism Generator",
          slug: "/css-design/glassmorphism-generator",
          icon: <Sparkles className="w-4 h-4" />,
          color: 188,
          benefit: "Compare soft UI against frosted-glass styling for more layered interfaces.",
        },
        {
          title: "CSS Border Radius Generator",
          slug: "/css-design/css-border-radius-generator",
          icon: <Layers3 className="w-4 h-4" />,
          color: 280,
          benefit: "Match the corner language of buttons, cards, and pills in the same component set.",
        },
        {
          title: "Color Palette Generator",
          slug: "/css-design/color-palette-generator",
          icon: <Palette className="w-4 h-4" />,
          color: 34,
          benefit: "Pick softer neutral tones that suit tactile neumorphic surfaces.",
        },
      ]}
    />
  );
}
