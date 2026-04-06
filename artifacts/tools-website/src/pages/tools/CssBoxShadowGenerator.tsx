import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Layers3,
  Palette,
  RefreshCw,
  Sparkles,
  SquareStack,
  SunMoon,
  Type,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type SurfaceMode = "card" | "glass" | "button";
type BackgroundMode = "light" | "dark" | "gradient";

interface ShadowValues {
  x: number;
  y: number;
  blur: number;
  spread: number;
  opacity: number;
  inset: boolean;
}

const DEFAULT_VALUES: ShadowValues = {
  x: 0,
  y: 18,
  blur: 40,
  spread: -12,
  opacity: 22,
  inset: false,
};

const PRESETS: Array<{
  label: string;
  description: string;
  color: string;
  values: ShadowValues;
  surface?: SurfaceMode;
  background?: BackgroundMode;
}> = [
  {
    label: "Soft Card",
    description: "Balanced product-card depth for dashboards and content blocks.",
    color: "#0F172A",
    values: { x: 0, y: 18, blur: 42, spread: -12, opacity: 18, inset: false },
    surface: "card",
    background: "light",
  },
  {
    label: "Floating CTA",
    description: "More dramatic lift for call-to-action buttons and pricing highlights.",
    color: "#1D4ED8",
    values: { x: 0, y: 20, blur: 34, spread: -10, opacity: 30, inset: false },
    surface: "button",
    background: "gradient",
  },
  {
    label: "Editorial Panel",
    description: "Directional offset that feels more layered and art-directed.",
    color: "#111827",
    values: { x: 10, y: 16, blur: 30, spread: -8, opacity: 24, inset: false },
    surface: "card",
    background: "light",
  },
  {
    label: "Glass Edge",
    description: "Subtle halo-style depth that works on translucent surfaces.",
    color: "#0F172A",
    values: { x: 0, y: 14, blur: 34, spread: -6, opacity: 22, inset: false },
    surface: "glass",
    background: "gradient",
  },
  {
    label: "Inset Well",
    description: "Sunken treatment for input fields, panels, and neumorphic wells.",
    color: "#0F172A",
    values: { x: 0, y: 6, blur: 18, spread: 0, opacity: 18, inset: true },
    surface: "card",
    background: "light",
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
  return `${values.inset ? "inset " : ""}${values.x}px ${values.y}px ${values.blur}px ${values.spread}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(values.opacity / 100).toFixed(2)})`;
}

function cssBlock(values: ShadowValues, color: string) {
  return `box-shadow: ${shadowString(values, color)};`;
}

function tailwindHint(values: ShadowValues, color: string) {
  const normalizedColor = normalizeHex(color) ?? "#0F172A";
  return `shadow-[${shadowString(values, normalizedColor).replace(/ /g, "_")}]`;
}

function elevationSummary(values: ShadowValues) {
  if (values.inset) {
    return "This is an inset shadow, so the surface feels pressed in rather than lifted out. That works best for inputs, wells, toggles, and quiet neumorphic treatments.";
  }

  const distanceScore = values.y + values.blur / 4 + Math.abs(values.spread);
  if (distanceScore < 18) {
    return "This shadow stays close to the edge, so it reads as a low-elevation UI treatment. Use it for quiet cards, compact controls, and layouts where separation should stay subtle.";
  }
  if (distanceScore < 38) {
    return "This sits in the mid-elevation range, which is usually the safest default for product cards, drawers, filters, and layered content surfaces.";
  }
  return "This is a high-elevation shadow with obvious depth. It works best for premium callouts, floating panels, popovers, and hero surfaces that need stronger separation from the background.";
}

function surfaceClass(mode: SurfaceMode) {
  if (mode === "glass") {
    return "rounded-[28px] border border-white/25 bg-white/18 backdrop-blur-xl";
  }
  if (mode === "button") {
    return "rounded-[26px] border border-white/20 bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-300 text-white";
  }
  return "rounded-[28px] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950";
}

function previewBackground(mode: BackgroundMode) {
  if (mode === "dark") return "rounded-[32px] bg-slate-950";
  if (mode === "gradient") return "rounded-[32px] bg-gradient-to-br from-sky-100 via-cyan-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950";
  return "rounded-[32px] bg-slate-100 dark:bg-slate-900";
}

export default function CssBoxShadowGenerator() {
  const [values, setValues] = useState<ShadowValues>(DEFAULT_VALUES);
  const [surface, setSurface] = useState<SurfaceMode>("card");
  const [background, setBackground] = useState<BackgroundMode>("light");
  const [shadowColor, setShadowColor] = useState("#0F172A");
  const [copiedLabel, setCopiedLabel] = useState("");

  const resolvedColor = normalizeHex(shadowColor) ?? "#0F172A";
  const boxShadow = useMemo(() => shadowString(values, resolvedColor), [resolvedColor, values]);
  const cssText = useMemo(() => cssBlock(values, resolvedColor), [resolvedColor, values]);
  const tailwindText = useMemo(() => tailwindHint(values, resolvedColor), [resolvedColor, values]);
  const explanation = useMemo(() => elevationSummary(values), [values]);

  const updateValue = (key: keyof ShadowValues, nextValue: number | boolean) => {
    setValues((current) => ({ ...current, [key]: nextValue }));
  };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setValues(preset.values);
    setShadowColor(preset.color);
    if (preset.surface) setSurface(preset.surface);
    if (preset.background) setBackground(preset.background);
  };

  const randomize = () => {
    const surfaces: SurfaceMode[] = ["card", "glass", "button"];
    const backgrounds: BackgroundMode[] = ["light", "dark", "gradient"];
    setSurface(surfaces[Math.floor(Math.random() * surfaces.length)]);
    setBackground(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
    setValues({
      x: Math.floor(Math.random() * 31) - 15,
      y: Math.floor(Math.random() * 41),
      blur: 8 + Math.floor(Math.random() * 57),
      spread: Math.floor(Math.random() * 33) - 16,
      opacity: 10 + Math.floor(Math.random() * 31),
      inset: Math.random() > 0.7,
    });
    const chars = "0123456789ABCDEF";
    let nextHex = "#";
    for (let index = 0; index < 6; index += 1) nextHex += chars[Math.floor(Math.random() * 16)];
    setShadowColor(nextHex);
  };

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  return (
    <UtilityToolPageShell
      title="CSS Box Shadow Generator"
      seoTitle="CSS Box Shadow Generator - Free Visual box-shadow Builder"
      seoDescription="Free CSS box shadow generator with live preview, presets, inset controls, color tuning, and copyable CSS output. Create softer cards, floating buttons, and elevated UI surfaces instantly."
      canonical="https://usonlinetools.com/css-design/css-box-shadow-generator"
      categoryName="CSS & Design Tools"
      categoryHref="/category/css-design"
      heroDescription="Generate polished CSS box shadows visually without tuning raw values by trial and error. Control horizontal offset, vertical offset, blur, spread, opacity, inset mode, surface style, and shadow color, then copy production-ready CSS for cards, buttons, modals, dashboards, hero blocks, pricing tables, and layered product UI."
      heroIcon={<SquareStack className="w-3.5 h-3.5" />}
      calculatorLabel="Shadow Builder"
      calculatorDescription="Tune shadow depth visually, preview the result on real UI surfaces, and export clean CSS instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="surface-mode" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Surface
                  </label>
                  <select id="surface-mode" value={surface} onChange={(event) => setSurface(event.target.value as SurfaceMode)} className="tool-calc-input w-full">
                    <option value="card">Card</option>
                    <option value="glass">Glass</option>
                    <option value="button">Button</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="background-mode" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Background
                  </label>
                  <select id="background-mode" value={background} onChange={(event) => setBackground(event.target.value as BackgroundMode)} className="tool-calc-input w-full">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="gradient">Gradient</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Shadow Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={resolvedColor} onChange={(event) => setShadowColor(event.target.value)} className="h-11 w-12 rounded-xl border border-border bg-transparent p-1" />
                  <input
                    type="text"
                    value={shadowColor}
                    onChange={(event) => setShadowColor(event.target.value)}
                    className="tool-calc-input w-full font-mono uppercase"
                    placeholder="#0F172A"
                  />
                </div>
              </div>

              {[
                { key: "x", label: "Horizontal Offset", min: -40, max: 40, suffix: "px" },
                { key: "y", label: "Vertical Offset", min: -10, max: 60, suffix: "px" },
                { key: "blur", label: "Blur Radius", min: 0, max: 80, suffix: "px" },
                { key: "spread", label: "Spread Radius", min: -30, max: 30, suffix: "px" },
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
                    value={values[control.key as keyof ShadowValues] as number}
                    onChange={(event) => updateValue(control.key as keyof ShadowValues, Number(event.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              ))}

              <button
                onClick={() => updateValue("inset", !values.inset)}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${
                  values.inset ? "bg-blue-600 text-white" : "border border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                <Layers3 className="w-4 h-4" />
                {values.inset ? "Inset Shadow On" : "Toggle Inset"}
              </button>

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
                    setValues(DEFAULT_VALUES);
                    setSurface("card");
                    setBackground("light");
                    setShadowColor("#0F172A");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted"
                >
                  <SunMoon className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Live Preview</p>
                <div className={`${previewBackground(background)} p-5`}>
                  <div className="flex min-h-[280px] items-center justify-center rounded-[28px] border border-dashed border-white/25 p-6">
                    <div
                      className={`${surfaceClass(surface)} max-w-sm p-6 transition-all`}
                      style={{ boxShadow }}
                    >
                      {surface === "button" ? (
                        <div className="space-y-3">
                          <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Primary Action</p>
                          <p className="text-sm leading-relaxed opacity-90">
                            Stronger shadows make a surface feel more clickable and more elevated than the layers around it.
                          </p>
                        </div>
                      ) : (
                        <div className={surface === "glass" ? "text-white" : "text-foreground"}>
                          <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-3">Preview Surface</p>
                          <h3 className="text-2xl font-black mb-2">Shadows define depth before color and typography do.</h3>
                          <p className="text-sm leading-relaxed opacity-80">
                            Tuning offset, blur, and spread changes whether the component feels quiet, premium, pressed in, or dramatically lifted.
                          </p>
                        </div>
                      )}
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
                <p className="text-sm font-bold text-foreground mb-1">Elevation Summary</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Preset Library</p>
                <p className="text-sm text-muted-foreground mt-1">Start from common market-ready shadow styles.</p>
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
          title: "Choose a starting surface",
          description: "Pick whether you are styling a neutral card, a translucent glass panel, or a stronger button-style surface. This keeps your preview closer to the real UI context where the shadow will be used.",
        },
        {
          title: "Set the shadow direction and softness",
          description: "Use horizontal and vertical offset to place the shadow, then adjust blur and spread to control how tight or diffused the edge feels. These four settings shape most of the visual personality of a box shadow.",
        },
        {
          title: "Tune color and opacity",
          description: "Change the shadow color and opacity to match the palette and mood of the design. Neutral deep shadows are safest, while tinted shadows can feel more branded or expressive when used carefully.",
        },
        {
          title: "Switch to inset when needed",
          description: "Turn on inset mode when you want the element to feel pressed into the page instead of floating above it. This is especially useful for inputs, filters, wells, and soft neumorphic layouts.",
        },
        {
          title: "Copy the CSS or Tailwind output",
          description: "Once the preview feels right, copy the plain CSS declaration or the Tailwind arbitrary value hint and drop it straight into your component or stylesheet.",
        },
      ]}
      interpretationCards={[
        {
          title: "Higher vertical offset usually means stronger lift",
          description: "When the Y offset increases, the shadow reads as farther away from the surface beneath it. Use small values for calm interfaces and larger values for popovers, modals, and promotional blocks.",
        },
        {
          title: "Blur affects realism more than most people expect",
          description: "A sharp low-blur shadow can feel harsh or old-fashioned. Increasing blur softens the transition and usually makes the interface feel more modern, premium, and less mechanical.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Spread controls the weight at the edge",
          description: "Negative spread keeps shadows tighter and cleaner, which works well for cards and buttons. Positive spread creates a larger halo and can feel heavier or more atmospheric depending on the blur level.",
          className: "bg-indigo-500/5 border-indigo-500/20",
        },
        {
          title: "Inset shadows should stay restrained",
          description: "Inset mode works best when it is subtle. Overusing heavy inset shadows can make a layout feel dated, muddy, or overly decorative, especially in dense product interfaces.",
          className: "bg-violet-500/5 border-violet-500/20",
        },
      ]}
      examples={[
        { scenario: "Quiet dashboard card", input: "0 12px 28px -10px rgba(15, 23, 42, 0.16)", output: "Low to mid elevation with soft product depth" },
        { scenario: "Hero CTA button", input: "0 18px 34px -10px rgba(29, 78, 216, 0.30)", output: "More obvious lift and stronger focus" },
        { scenario: "Inset input well", input: "inset 0 4px 14px 0 rgba(15, 23, 42, 0.18)", output: "Pressed-in field treatment" },
        { scenario: "Editorial panel", input: "10px 16px 30px -8px rgba(17, 24, 39, 0.24)", output: "Directional layered depth" },
        { scenario: "Glass card halo", input: "0 14px 34px -6px rgba(15, 23, 42, 0.22)", output: "Clean floating separation on soft backgrounds" },
      ]}
      whyChoosePoints={[
        "This CSS box shadow generator is built to solve the real problem most designers and frontend developers have: shadows are easy to add, but difficult to tune well. Offset, blur, spread, opacity, inset mode, and shadow color all interact with each other, and a small change in one can completely alter how a component feels. A visual generator lets you see those changes immediately instead of editing raw values blindly inside the browser inspector.",
        "That matters because box shadows do much more than decorate a component. They create hierarchy, clarify interaction, separate layers, and influence whether a design feels calm, premium, soft, dramatic, tactile, or outdated. A strong shadow system is one of the fastest ways to make a UI feel intentional, especially in cards, pricing sections, forms, tool panels, modals, and product marketing surfaces.",
        "This tool is also useful because it previews the shadow on realistic surfaces instead of a bare rectangle on a blank page. Seeing the same shadow on a card, button, or glass panel against different backgrounds helps you avoid one of the most common mistakes in UI work: building a shadow that looks acceptable in isolation but breaks when placed into a real interface.",
        "For practical implementation, the generator produces clean CSS and a Tailwind-friendly arbitrary value hint. That makes it useful whether you write traditional CSS, use utility-first classes, or prototype design ideas quickly before hardening them into a design system. The goal is to reduce friction between visual experimentation and actual production use.",
        "It also supports a better SEO and internal-linking pattern for design workflows inside this site. Developers and designers rarely use box shadow in isolation. They usually need it alongside border radius, gradients, motion, color systems, and other design utilities. That is why this page intentionally connects to the related CSS tools rather than pretending box-shadow exists as a standalone decision.",
      ]}
      faqs={[
        {
          q: "What does each box-shadow value mean?",
          a: "The standard order is horizontal offset, vertical offset, blur radius, spread radius, and color. Horizontal offset moves the shadow left or right. Vertical offset moves it up or down. Blur softens the edge. Spread expands or contracts the shadow before blur is applied. Color controls the tint and opacity of the final shadow.",
        },
        {
          q: "What is the difference between blur and spread?",
          a: "Blur controls how soft the edge becomes, while spread changes the underlying size of the shadow shape. A high blur with negative spread often creates a cleaner modern card shadow. A positive spread with moderate blur can create a larger ambient halo or a more dramatic promotional effect.",
        },
        {
          q: "When should I use inset box shadows?",
          a: "Use inset shadows when the element should feel recessed rather than elevated. Inputs, segmented controls, soft wells, and some neumorphic interfaces use inset shadows effectively. They are usually less appropriate for primary cards or interactive panels that need to feel lifted above the page.",
        },
        {
          q: "Should shadows always be pure black?",
          a: "No. Neutral dark shadows are the safest default, but slight color tinting can work well when it matches the palette of the interface. Blue-tinted shadows, for example, often feel cleaner in bright UI, while warm shadows can complement editorial or brand-heavy layouts. The key is restraint.",
        },
        {
          q: "Why do many modern shadows use negative spread values?",
          a: "Negative spread keeps the shadow tighter before blur is applied, which often produces a cleaner and more controlled result. This helps prevent the shadow from looking muddy, oversized, or too obviously rectangular around modern cards and components.",
        },
        {
          q: "Can I use the exported value directly in production?",
          a: "Yes. The generated CSS is standard box-shadow syntax and can be dropped into a stylesheet, CSS module, inline style, or component style object. The Tailwind hint is also useful if you work with arbitrary utility values in a utility-first workflow.",
        },
      ]}
      relatedTools={[
        { title: "CSS Border Radius Generator", slug: "css-border-radius-generator", icon: <Layers3 className="w-5 h-5" />, color: 220, benefit: "Pair depth with corner shape decisions" },
        { title: "CSS Animation Generator", slug: "css-animation-generator", icon: <Sparkles className="w-5 h-5" />, color: 250, benefit: "Combine motion and elevation cleanly" },
        { title: "CSS Gradient Generator", slug: "css-gradient-generator", icon: <Palette className="w-5 h-5" />, color: 310, benefit: "Build stronger surfaces before shadowing them" },
        { title: "Color Palette Generator", slug: "color-palette-generator", icon: <Type className="w-5 h-5" />, color: 170, benefit: "Tune shadow color against a real palette" },
        { title: "Color Picker", slug: "color-picker", icon: <Palette className="w-5 h-5" />, color: 140, benefit: "Extract exact shadow tints and UI colors" },
      ]}
      ctaTitle="Keep Building Your CSS Toolkit"
      ctaDescription="Continue into gradients, radius, animation, and color tools to shape the full visual language of a component instead of styling one property in isolation."
      ctaHref="/category/css-design"
    />
  );
}
