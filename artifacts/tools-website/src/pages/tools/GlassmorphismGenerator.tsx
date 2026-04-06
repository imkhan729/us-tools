import { useMemo, useState } from "react";
import { Check, Copy, Droplets, Layers3, Palette, RefreshCw, Sparkles } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type Background = "aurora" | "sunset" | "night";

interface GlassValues {
  blur: number;
  opacity: number;
  borderOpacity: number;
  saturation: number;
  shadowY: number;
  shadowBlur: number;
  shadowOpacity: number;
  radius: number;
}

const DEFAULT_VALUES: GlassValues = {
  blur: 18,
  opacity: 18,
  borderOpacity: 26,
  saturation: 150,
  shadowY: 18,
  shadowBlur: 42,
  shadowOpacity: 18,
  radius: 28,
};

const PRESETS: Array<{
  label: string;
  description: string;
  background: Background;
  fill: string;
  values: GlassValues;
}> = [
  {
    label: "Soft Card",
    description: "Balanced frosted panel for dashboards, hero stats, and premium cards.",
    background: "aurora",
    fill: "#FFFFFF",
    values: { blur: 18, opacity: 18, borderOpacity: 28, saturation: 150, shadowY: 18, shadowBlur: 42, shadowOpacity: 18, radius: 28 },
  },
  {
    label: "Dense Frost",
    description: "Higher blur and fill for overlays that need stronger separation.",
    background: "sunset",
    fill: "#F8FAFC",
    values: { blur: 26, opacity: 28, borderOpacity: 34, saturation: 165, shadowY: 20, shadowBlur: 38, shadowOpacity: 20, radius: 30 },
  },
  {
    label: "Bright Chip",
    description: "Compact glossy treatment for nav pills, filters, and floating controls.",
    background: "aurora",
    fill: "#FFFFFF",
    values: { blur: 14, opacity: 24, borderOpacity: 36, saturation: 145, shadowY: 12, shadowBlur: 28, shadowOpacity: 14, radius: 999 },
  },
  {
    label: "Dark Glass",
    description: "Tinted panel for darker hero sections and immersive landing-page UI.",
    background: "night",
    fill: "#0F172A",
    values: { blur: 22, opacity: 34, borderOpacity: 24, saturation: 180, shadowY: 22, shadowBlur: 46, shadowOpacity: 28, radius: 26 },
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

function rgbaFromHex(hex: string, opacity: number) {
  const rgb = hexToRgb(hex) ?? { r: 255, g: 255, b: 255 };
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(opacity / 100).toFixed(2)})`;
}

function backgroundClass(value: Background) {
  if (value === "sunset") {
    return "rounded-[34px] bg-[radial-gradient(circle_at_top_left,#FDE68A_0%,#FB7185_36%,#A855F7_68%,#2563EB_100%)]";
  }
  if (value === "night") {
    return "rounded-[34px] bg-[radial-gradient(circle_at_top_left,#38BDF8_0%,#1D4ED8_20%,#0F172A_62%,#020617_100%)]";
  }
  return "rounded-[34px] bg-[radial-gradient(circle_at_top_left,#67E8F9_0%,#60A5FA_28%,#818CF8_55%,#F9A8D4_100%)]";
}

function cssBlock(values: GlassValues, fill: string) {
  const solid = rgbaFromHex(fill, values.opacity);
  const border = rgbaFromHex("#FFFFFF", values.borderOpacity);
  const shadow = rgbaFromHex("#0F172A", values.shadowOpacity);
  const radius = values.radius >= 999 ? "999px" : `${values.radius}px`;

  return [
    `background: ${solid};`,
    `border: 1px solid ${border};`,
    `border-radius: ${radius};`,
    `box-shadow: 0 ${values.shadowY}px ${values.shadowBlur}px ${shadow};`,
    `backdrop-filter: blur(${values.blur}px) saturate(${values.saturation}%);`,
    `-webkit-backdrop-filter: blur(${values.blur}px) saturate(${values.saturation}%);`,
  ].join("\n");
}

function tailwindHint(values: GlassValues, fill: string) {
  const radius = values.radius >= 999 ? "rounded-full" : `rounded-[${values.radius}px]`;
  return [
    radius,
    `bg-[${rgbaFromHex(fill, values.opacity).replace(/ /g, "")}]`,
    "border",
    `border-[${rgbaFromHex("#FFFFFF", values.borderOpacity).replace(/ /g, "")}]`,
    `shadow-[0_${values.shadowY}px_${values.shadowBlur}px_${rgbaFromHex("#0F172A", values.shadowOpacity).replace(/ /g, "")}]`,
    `backdrop-blur-[${values.blur}px]`,
    `backdrop-saturate-[${values.saturation}%]`,
  ].join(" ");
}

function summary(values: GlassValues, fill: string) {
  const isDarkFill = (hexToRgb(fill)?.r ?? 255) < 80;

  if (values.blur >= 24 && values.opacity >= 24) {
    return "This is a dense frosted treatment. It separates the panel strongly from the background, which works well for overlays, hero cards, and modal-style layers.";
  }
  if (values.radius >= 999) {
    return "This configuration reads more like a glass chip or pill than a content card. It works best for nav items, compact badges, and floating controls.";
  }
  if (isDarkFill) {
    return "This uses a darker tinted glass surface rather than classic white frost. That is useful when the surrounding interface is already immersive or night-themed.";
  }
  return "This stays in the safe middle range for glassmorphism: visible blur, restrained transparency, and enough border contrast to keep the panel readable.";
}

export default function GlassmorphismGenerator() {
  const [values, setValues] = useState<GlassValues>(DEFAULT_VALUES);
  const [background, setBackground] = useState<Background>("aurora");
  const [fillColor, setFillColor] = useState("#FFFFFF");
  const [copiedLabel, setCopiedLabel] = useState("");

  const resolvedFill = normalizeHex(fillColor) ?? "#FFFFFF";
  const cssText = useMemo(() => cssBlock(values, resolvedFill), [resolvedFill, values]);
  const tailwindText = useMemo(() => tailwindHint(values, resolvedFill), [resolvedFill, values]);
  const explanation = useMemo(() => summary(values, resolvedFill), [resolvedFill, values]);
  const radius = values.radius >= 999 ? "999px" : `${values.radius}px`;
  const darkFill = (hexToRgb(resolvedFill)?.r ?? 255) < 80;

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setValues(preset.values);
    setBackground(preset.background);
    setFillColor(preset.fill);
  };

  const randomize = () => {
    const backgrounds: Background[] = ["aurora", "sunset", "night"];
    setBackground(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
    setValues({
      blur: 10 + Math.floor(Math.random() * 19),
      opacity: 12 + Math.floor(Math.random() * 27),
      borderOpacity: 14 + Math.floor(Math.random() * 29),
      saturation: 110 + Math.floor(Math.random() * 91),
      shadowY: 8 + Math.floor(Math.random() * 19),
      shadowBlur: 20 + Math.floor(Math.random() * 33),
      shadowOpacity: 10 + Math.floor(Math.random() * 23),
      radius: Math.random() > 0.8 ? 999 : 18 + Math.floor(Math.random() * 18),
    });
  };

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  return (
    <UtilityToolPageShell
      title="Glassmorphism Generator"
      seoTitle="Glassmorphism Generator - Free Frosted Glass CSS Builder"
      seoDescription="Free glassmorphism generator with live preview, blur controls, transparency tuning, border styling, shadow depth, and copyable CSS output."
      canonical="https://usonlinetools.com/css-design/glassmorphism-generator"
      categoryName="CSS & Design Tools"
      categoryHref="/category/css-design"
      heroDescription="Build polished glassmorphism UI visually instead of guessing blur, transparency, and border values by trial and error. Tune backdrop blur, panel opacity, border opacity, saturation, radius, and shadow depth, then copy production-ready CSS for hero cards, floating panels, nav pills, modals, stat blocks, login forms, and premium landing-page surfaces."
      heroIcon={<Droplets className="w-3.5 h-3.5" />}
      calculatorLabel="Glass Builder"
      calculatorDescription="Preview frosted-glass treatments on layered backgrounds, adjust the panel styling, and export clean CSS instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="background" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Background
                  </label>
                  <select id="background" value={background} onChange={(event) => setBackground(event.target.value as Background)} className="tool-calc-input w-full">
                    <option value="aurora">Aurora</option>
                    <option value="sunset">Sunset</option>
                    <option value="night">Night</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Fill Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={resolvedFill} onChange={(event) => setFillColor(event.target.value)} className="h-11 w-12 rounded-xl border border-border bg-transparent p-1" />
                    <input value={fillColor} onChange={(event) => setFillColor(event.target.value)} className="tool-calc-input w-full font-mono uppercase" />
                  </div>
                </div>
              </div>

              {[
                { key: "blur", label: "Backdrop Blur", min: 0, max: 40, suffix: "px" },
                { key: "opacity", label: "Fill Opacity", min: 0, max: 60, suffix: "%" },
                { key: "borderOpacity", label: "Border Opacity", min: 0, max: 60, suffix: "%" },
                { key: "saturation", label: "Backdrop Saturation", min: 50, max: 220, suffix: "%" },
                { key: "shadowY", label: "Shadow Offset", min: 0, max: 32, suffix: "px" },
                { key: "shadowBlur", label: "Shadow Blur", min: 0, max: 64, suffix: "px" },
                { key: "shadowOpacity", label: "Shadow Opacity", min: 0, max: 40, suffix: "%" },
              ].map((control) => (
                <div key={control.key}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label htmlFor={control.key} className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      {control.label}
                    </label>
                    <span className="text-xs font-bold text-blue-600">
                      {values[control.key as keyof GlassValues]}
                      {control.suffix}
                    </span>
                  </div>
                  <input
                    id={control.key}
                    type="range"
                    min={control.min}
                    max={control.max}
                    value={values[control.key as keyof GlassValues]}
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
                    setBackground("aurora");
                    setFillColor("#FFFFFF");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted"
                >
                  <Sparkles className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            <div className={`p-4 md:p-6 ${backgroundClass(background)}`}>
              <div className="min-h-[420px] rounded-[30px] border border-white/15 bg-white/8 p-5 md:p-7 backdrop-blur-[2px]">
                <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-5 items-center">
                  <div
                    className="border p-6 md:p-7"
                    style={{
                      background: rgbaFromHex(resolvedFill, values.opacity),
                      borderColor: rgbaFromHex("#FFFFFF", values.borderOpacity),
                      borderRadius: radius,
                      boxShadow: `0 ${values.shadowY}px ${values.shadowBlur}px ${rgbaFromHex("#0F172A", values.shadowOpacity)}`,
                      backdropFilter: `blur(${values.blur}px) saturate(${values.saturation}%)`,
                      WebkitBackdropFilter: `blur(${values.blur}px) saturate(${values.saturation}%)`,
                      color: darkFill ? "#F8FAFC" : "#0F172A",
                    }}
                  >
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-70 mb-3">Glass Surface</p>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-3">Frosted UI should feel airy, not washed out.</h3>
                    <p className="text-sm leading-relaxed opacity-85 mb-4">
                      Balance blur, border contrast, and fill opacity so the panel stays readable while still showing enough of the background to feel translucent.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border px-3 py-1.5 text-xs font-bold" style={{ borderColor: rgbaFromHex("#FFFFFF", 26), background: rgbaFromHex("#FFFFFF", darkFill ? 8 : 24) }}>
                        Blur {values.blur}px
                      </span>
                      <span className="rounded-full border px-3 py-1.5 text-xs font-bold" style={{ borderColor: rgbaFromHex("#FFFFFF", 26), background: rgbaFromHex("#FFFFFF", darkFill ? 8 : 24) }}>
                        Fill {values.opacity}%
                      </span>
                      <span className="rounded-full border px-3 py-1.5 text-xs font-bold" style={{ borderColor: rgbaFromHex("#FFFFFF", 26), background: rgbaFromHex("#FFFFFF", darkFill ? 8 : 24) }}>
                        Saturation {values.saturation}%
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {[
                      { label: "CSS Output", value: cssText, code: true },
                      { label: "Tailwind Hint", value: tailwindText, code: false },
                      { label: "Reading", value: explanation, code: false },
                    ].map((card) => (
                      <div key={card.label} className="rounded-2xl border border-white/20 bg-white/75 p-4 dark:bg-slate-950/55">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">{card.label}</p>
                        {card.code ? (
                          <pre className="text-sm font-mono whitespace-pre-wrap break-words text-foreground">{card.value}</pre>
                        ) : (
                          <p className="text-sm break-words text-muted-foreground">{card.value}</p>
                        )}
                      </div>
                    ))}
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

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Preset Library</p>
                <p className="text-sm text-muted-foreground mt-1">Start from common frosted-card treatments instead of dialing values from zero.</p>
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
          title: "Pick the background context first",
          description: "Glassmorphism only works when there is enough visual information behind the panel, so start by previewing the card against a layered or colorful background.",
        },
        {
          title: "Balance blur and fill opacity",
          description: "Backdrop blur creates the frosted effect, while panel opacity decides how much the background still shows through. These two settings do most of the visual work.",
        },
        {
          title: "Use the border to define the edge",
          description: "A faint light border is what keeps glass panels readable. Without it, the surface often looks muddy instead of intentionally translucent.",
        },
        {
          title: "Add enough shadow for separation",
          description: "A soft shadow helps the panel lift off the background. Too little separation makes the glass disappear, while too much makes it feel heavy.",
        },
      ]}
      interpretationCards={[
        {
          title: "Glassmorphism needs contrast behind the panel",
          description: "If the background is too flat, the effect loses most of its identity. Frosted glass works best when it can blur something visually interesting.",
        },
        {
          title: "Border contrast matters more than most people expect",
          description: "The highlight border is what makes the panel edge feel crisp. Reducing it too far usually causes the component to look washed out or unfinished.",
        },
        {
          title: "Heavy opacity stops reading as glass",
          description: "When the fill becomes too opaque, the panel starts behaving like a tinted card instead of a translucent surface. That can still look good, but it is a different design direction.",
          className: "border-cyan-500/30 bg-cyan-500/5",
        },
      ]}
      examples={[
        {
          scenario: "Hero stat card",
          input: "18px blur, 18% fill, 28% border, 42px shadow blur",
          output: "Balanced frosted panel that still lets the background atmosphere show through.",
        },
        {
          scenario: "Modal overlay card",
          input: "26px blur, 28% fill, 34% border, 20px shadow offset",
          output: "Denser glass layer with stronger separation and easier text readability.",
        },
        {
          scenario: "Floating filter chip",
          input: "14px blur, pill radius, 24% fill, 12px shadow offset",
          output: "Compact glossy control that feels lightweight and tactile.",
        },
      ]}
      whyChoosePoints={[
        "Tune glassmorphism visually instead of juggling backdrop-filter, border alpha, fill transparency, and shadow depth by hand.",
        "Preview the panel on layered gradients so you can judge whether the glass effect is actually visible in a realistic setting.",
        "Start from practical presets for hero cards, dense overlays, chips, and darker tinted glass treatments.",
        "Export clean CSS or a Tailwind-friendly hint immediately after the panel feels production-ready.",
      ]}
      faqs={[
        {
          q: "What makes glassmorphism look convincing?",
          a: "The effect usually needs four things working together: a visually rich background, enough backdrop blur, a translucent fill, and a faint high-contrast border to define the surface edge.",
        },
        {
          q: "Why does my glass card look muddy?",
          a: "That usually happens when the blur is too low, the fill is too opaque, or the border contrast is too weak. Flat backgrounds can also make the effect look muddy because there is nothing interesting to blur.",
        },
        {
          q: "Should glassmorphism always use white panels?",
          a: "No. White or very light fills are the classic approach, but darker tinted glass can work well in immersive interfaces, gaming pages, or premium dark landing pages.",
        },
        {
          q: "Is backdrop-filter supported everywhere?",
          a: "Modern browsers support it broadly, but you should still test in your target environments. For older or stricter setups, a graceful fallback can be a slightly opaque card without blur.",
        },
      ]}
      relatedTools={[
        {
          title: "CSS Box Shadow Generator",
          slug: "/css-design/css-box-shadow-generator",
          icon: <Layers3 className="w-4 h-4" />,
          color: 215,
          benefit: "Refine the depth layer that makes the glass panel separate from the background.",
        },
        {
          title: "CSS Filter Generator",
          slug: "/css-design/css-filter-generator",
          icon: <Sparkles className="w-4 h-4" />,
          color: 188,
          benefit: "Experiment with blur and saturation behavior in other parts of the UI.",
        },
        {
          title: "Color Palette Generator",
          slug: "/css-design/color-palette-generator",
          icon: <Palette className="w-4 h-4" />,
          color: 34,
          benefit: "Pick gradient and panel colors that keep the frosted surface readable.",
        },
        {
          title: "CSS Border Radius Generator",
          slug: "/css-design/css-border-radius-generator",
          icon: <Layers3 className="w-4 h-4" />,
          color: 280,
          benefit: "Match the corner treatment of the glass panel to the rest of your interface.",
        },
      ]}
    />
  );
}
