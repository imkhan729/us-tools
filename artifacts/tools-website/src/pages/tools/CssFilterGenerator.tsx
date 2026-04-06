import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Droplets,
  Image as ImageIcon,
  Layers3,
  Palette,
  RefreshCw,
  Sparkles,
  SunMedium,
  Type,
  Wand2,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type PreviewSurface = "photo" | "card" | "gradient";

interface FilterValues {
  blur: number;
  brightness: number;
  contrast: number;
  saturate: number;
  hueRotate: number;
  grayscale: number;
  sepia: number;
  invert: number;
  opacity: number;
}

const DEFAULT_VALUES: FilterValues = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  saturate: 100,
  hueRotate: 0,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  opacity: 100,
};

const PRESETS: Array<{
  label: string;
  description: string;
  values: FilterValues;
  surface?: PreviewSurface;
}> = [
  {
    label: "Clean Lift",
    description: "Slight brightness and contrast for product cards and polished screenshots.",
    values: { blur: 0, brightness: 108, contrast: 108, saturate: 110, hueRotate: 0, grayscale: 0, sepia: 0, invert: 0, opacity: 100 },
    surface: "photo",
  },
  {
    label: "Muted Editorial",
    description: "Lower saturation and a touch of contrast for more restrained visual tone.",
    values: { blur: 0, brightness: 96, contrast: 112, saturate: 72, hueRotate: 0, grayscale: 8, sepia: 0, invert: 0, opacity: 100 },
    surface: "photo",
  },
  {
    label: "Glass Frost",
    description: "Blur plus lower opacity for frosted overlays and background layers.",
    values: { blur: 10, brightness: 120, contrast: 94, saturate: 130, hueRotate: 0, grayscale: 0, sepia: 0, invert: 0, opacity: 78 },
    surface: "gradient",
  },
  {
    label: "Warm Vintage",
    description: "Sepia-heavy treatment for editorial cards and retro visuals.",
    values: { blur: 0, brightness: 102, contrast: 96, saturate: 90, hueRotate: -8, grayscale: 10, sepia: 42, invert: 0, opacity: 100 },
    surface: "photo",
  },
  {
    label: "Utility Dark",
    description: "Invert-friendly treatment for monochrome icon or UI adaptation.",
    values: { blur: 0, brightness: 95, contrast: 120, saturate: 80, hueRotate: 0, grayscale: 36, sepia: 0, invert: 100, opacity: 100 },
    surface: "card",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildFilter(values: FilterValues) {
  return [
    `blur(${values.blur}px)`,
    `brightness(${values.brightness}%)`,
    `contrast(${values.contrast}%)`,
    `saturate(${values.saturate}%)`,
    `hue-rotate(${values.hueRotate}deg)`,
    `grayscale(${values.grayscale}%)`,
    `sepia(${values.sepia}%)`,
    `invert(${values.invert}%)`,
    `opacity(${values.opacity}%)`,
  ].join(" ");
}

function cssBlock(filter: string) {
  return `filter: ${filter};`;
}

function tailwindHint(values: FilterValues) {
  const parts = [
    values.blur ? `blur-[${values.blur}px]` : "blur-0",
    `brightness-[${values.brightness}%]`,
    `contrast-[${values.contrast}%]`,
    `saturate-[${values.saturate}%]`,
    values.hueRotate ? `hue-rotate-[${values.hueRotate}deg]` : "hue-rotate-0",
    values.grayscale ? `grayscale-[${values.grayscale}%]` : "grayscale-0",
    values.sepia ? `sepia-[${values.sepia}%]` : "sepia-0",
    values.invert ? `invert` : "",
    values.opacity !== 100 ? `opacity-[${values.opacity}%]` : "",
  ].filter(Boolean);

  return parts.join(" ");
}

function treatmentSummary(values: FilterValues) {
  if (values.blur >= 8 && values.opacity < 90) {
    return "This filter set is strongest for frosted-glass overlays, background layers, and decorative surfaces where you want atmosphere instead of crisp detail.";
  }
  if (values.invert >= 90) {
    return "This treatment flips light and dark values aggressively, which is useful for icon adaptation, dark-mode experiments, and graphic transformations more than natural photography.";
  }
  if (values.sepia >= 25 || values.grayscale >= 20) {
    return "This reads as a stylized editorial treatment rather than a neutral enhancement. It works best when the brand tone supports a more curated, photographic mood.";
  }
  if (values.saturate > 115 || values.contrast > 115 || values.brightness > 105) {
    return "This is an enhancement-style filter that adds visual punch. Use it for product surfaces, thumbnails, hero media, and any UI where the source feels slightly flat.";
  }
  return "This configuration stays close to the source image and is safest for UI work where clarity matters more than obvious special effects.";
}

function previewBackground(surface: PreviewSurface) {
  if (surface === "gradient") return "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600";
  if (surface === "card") return "bg-[linear-gradient(135deg,#0F172A_0%,#111827_40%,#1E293B_100%)]";
  return "bg-[url('https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center";
}

export default function CssFilterGenerator() {
  const [values, setValues] = useState<FilterValues>(DEFAULT_VALUES);
  const [surface, setSurface] = useState<PreviewSurface>("photo");
  const [copiedLabel, setCopiedLabel] = useState("");

  const filterText = useMemo(() => buildFilter(values), [values]);
  const cssText = useMemo(() => cssBlock(filterText), [filterText]);
  const tailwindText = useMemo(() => tailwindHint(values), [values]);
  const explanation = useMemo(() => treatmentSummary(values), [values]);

  const updateValue = (key: keyof FilterValues, nextValue: number) => {
    setValues((current) => ({ ...current, [key]: nextValue }));
  };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setValues(preset.values);
    if (preset.surface) setSurface(preset.surface);
  };

  const randomize = () => {
    const surfaces: PreviewSurface[] = ["photo", "card", "gradient"];
    setSurface(surfaces[Math.floor(Math.random() * surfaces.length)]);
    setValues({
      blur: Math.floor(Math.random() * 13),
      brightness: 70 + Math.floor(Math.random() * 61),
      contrast: 70 + Math.floor(Math.random() * 71),
      saturate: 40 + Math.floor(Math.random() * 121),
      hueRotate: Math.floor(Math.random() * 361) - 180,
      grayscale: Math.floor(Math.random() * 61),
      sepia: Math.floor(Math.random() * 61),
      invert: Math.random() > 0.78 ? 100 : 0,
      opacity: 60 + Math.floor(Math.random() * 41),
    });
  };

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  return (
    <UtilityToolPageShell
      title="CSS Filter Generator"
      seoTitle="CSS Filter Generator - Free Visual CSS Filter Builder"
      seoDescription="Free CSS filter generator with live preview, presets, sliders, and copyable CSS output. Tune blur, brightness, contrast, saturation, hue rotation, grayscale, sepia, invert, and opacity visually."
      canonical="https://usonlinetools.com/css-design/css-filter-generator"
      categoryName="CSS & Design Tools"
      categoryHref="/category/css-design"
      heroDescription="Generate polished CSS filter effects visually without guessing raw values in the browser inspector. Tune blur, brightness, contrast, saturation, hue rotation, grayscale, sepia, invert, and opacity, then copy production-ready CSS for photos, cards, glassmorphism layers, thumbnails, media blocks, promotional banners, and modern interface surfaces."
      heroIcon={<Wand2 className="w-3.5 h-3.5" />}
      calculatorLabel="Filter Builder"
      calculatorDescription="Preview filter effects on realistic surfaces, refine the treatment, and export clean CSS instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-4">
              <div>
                <label htmlFor="preview-surface" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Preview Surface
                </label>
                <select id="preview-surface" value={surface} onChange={(event) => setSurface(event.target.value as PreviewSurface)} className="tool-calc-input w-full">
                  <option value="photo">Photo</option>
                  <option value="card">Dark Card</option>
                  <option value="gradient">Gradient Surface</option>
                </select>
              </div>

              {[
                { key: "blur", label: "Blur", min: 0, max: 20, suffix: "px" },
                { key: "brightness", label: "Brightness", min: 0, max: 200, suffix: "%" },
                { key: "contrast", label: "Contrast", min: 0, max: 200, suffix: "%" },
                { key: "saturate", label: "Saturation", min: 0, max: 250, suffix: "%" },
                { key: "hueRotate", label: "Hue Rotate", min: -180, max: 180, suffix: "deg" },
                { key: "grayscale", label: "Grayscale", min: 0, max: 100, suffix: "%" },
                { key: "sepia", label: "Sepia", min: 0, max: 100, suffix: "%" },
                { key: "invert", label: "Invert", min: 0, max: 100, suffix: "%" },
                { key: "opacity", label: "Opacity", min: 0, max: 100, suffix: "%" },
              ].map((control) => (
                <div key={control.key}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label htmlFor={control.key} className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      {control.label}
                    </label>
                    <span className="text-xs font-bold text-blue-600">
                      {values[control.key as keyof FilterValues]}
                      {control.suffix}
                    </span>
                  </div>
                  <input
                    id={control.key}
                    type="range"
                    min={control.min}
                    max={control.max}
                    value={values[control.key as keyof FilterValues]}
                    onChange={(event) => updateValue(control.key as keyof FilterValues, clamp(Number(event.target.value), control.min, control.max))}
                    className="w-full accent-blue-500"
                  />
                </div>
              ))}

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
                    setSurface("photo");
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
                  <div className="flex min-h-[300px] items-center justify-center rounded-[28px] border border-dashed border-white/20 p-6 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-950 dark:to-slate-900">
                    <div
                      className={`${previewBackground(surface)} relative h-[250px] w-full max-w-xl overflow-hidden rounded-[30px] border border-white/15 shadow-xl`}
                      style={{ filter: filterText }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                      <div className="absolute left-6 bottom-6 right-6 text-white">
                        <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-2">Preview Surface</p>
                        <h3 className="text-2xl font-black mb-2">Filters should shape mood and clarity, not just add effects.</h3>
                        <p className="text-sm leading-relaxed opacity-90">
                          Use them to lift dull media, mute noisy visuals, create glass layers, or adapt assets to a stronger interface system.
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
                <p className="text-sm font-bold text-foreground mb-1">Treatment Summary</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Preset Library</p>
                <p className="text-sm text-muted-foreground mt-1">Start with common visual treatments used in modern UI work.</p>
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
          title: "Choose the preview surface",
          description: "Start on a photo, dark card, or gradient surface so the filter is tested in a realistic context rather than on an empty rectangle.",
        },
        {
          title: "Tune clarity first",
          description: "Brightness, contrast, saturation, and opacity usually matter more than flashy effects. Get the image or surface reading correctly before adding heavier stylistic changes.",
        },
        {
          title: "Use blur and opacity carefully",
          description: "Blur is most useful for frosted overlays, atmospheric backgrounds, and decorative layers. On primary content or product imagery, too much blur quickly reduces usability.",
        },
        {
          title: "Add stylization only with intent",
          description: "Hue rotation, grayscale, sepia, and invert are strongest when they support a visual system or brand mood. They are less useful as random one-off effects.",
        },
        {
          title: "Copy the CSS when the treatment feels balanced",
          description: "Once the preview reads correctly, copy the standard CSS filter declaration or the Tailwind-friendly utility hint and apply it directly in your component or stylesheet.",
        },
      ]}
      interpretationCards={[
        {
          title: "Brightness and contrast are the practical foundation",
          description: "Most usable filter treatments start here. If the base media feels too flat, slight contrast and brightness changes often do more than heavy stylistic filters.",
        },
        {
          title: "Saturation should support the palette, not overpower it",
          description: "Higher saturation can help product shots and hero media, but too much can make a page feel cheap or inconsistent with the rest of the design system.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Blur belongs more in layers than in core content",
          description: "Blur is excellent for glassmorphism, soft backdrops, and depth cues, but it usually harms legibility when applied to primary information or detailed images.",
          className: "bg-indigo-500/5 border-indigo-500/20",
        },
        {
          title: "Invert, grayscale, and sepia are stylistic commitments",
          description: "These filters can be very effective, but they shift the character of the entire surface. Use them to reinforce a design direction, not just because the slider exists.",
          className: "bg-violet-500/5 border-violet-500/20",
        },
      ]}
      examples={[
        { scenario: "Product image enhancement", input: "brightness(108%) contrast(108%) saturate(110%)", output: "Cleaner, slightly punchier media" },
        { scenario: "Editorial mute", input: "brightness(96%) contrast(112%) saturate(72%) grayscale(8%)", output: "Restrained, calmer photography" },
        { scenario: "Glass overlay", input: "blur(10px) brightness(120%) saturate(130%) opacity(78%)", output: "Soft frosted-layer treatment" },
        { scenario: "Warm vintage card", input: "brightness(102%) contrast(96%) sepia(42%) grayscale(10%)", output: "Retro or editorial mood shift" },
        { scenario: "Dark utility adaptation", input: "contrast(120%) grayscale(36%) invert(100%)", output: "Graphic or icon inversion treatment" },
      ]}
      whyChoosePoints={[
        "A CSS filter generator is useful because filter syntax becomes hard to reason about once multiple effects are combined. A single brightness tweak is easy, but once blur, contrast, saturation, hue rotation, grayscale, and opacity all interact, it becomes difficult to predict the outcome from raw CSS alone. A visual builder closes that gap immediately.",
        "That matters in real UI work because CSS filters are rarely used for novelty anymore. They are often used to solve practical design problems: lifting a flat hero image, muting a noisy photo behind text, creating a frosted overlay, adapting imagery to a dark interface, or making a card system feel visually cohesive without re-editing source assets.",
        "This tool is especially useful because it previews filters on realistic surfaces instead of abstract swatches only. A filter that looks acceptable on a plain square may perform badly on photography or on a translucent card. Testing against multiple surface types reduces that mismatch before implementation.",
        "It also produces both standard CSS and a Tailwind-oriented output hint, which makes it easier to move from experimentation to production. Whether you use CSS modules, inline styles, component libraries, or a utility-first workflow, the export is aimed at reducing friction instead of just generating a demo string.",
        "From a broader workflow perspective, CSS filters are often paired with gradients, shadows, clip-path, border radius, and motion. That is why the internal linking around this tool matters. Filter decisions usually live inside a fuller component system, not as isolated visual effects, and the page is designed around that more realistic usage pattern.",
      ]}
      faqs={[
        {
          q: "What does the CSS filter property do?",
          a: "The filter property applies visual effects to an element after it has been rendered. You can blur it, change brightness, adjust contrast and saturation, rotate hue, convert it toward grayscale or sepia, invert it, or change its opacity without editing the source asset itself.",
        },
        {
          q: "Which filter controls are most useful in real UI work?",
          a: "Brightness, contrast, saturation, and opacity are usually the most useful. They help refine images and surfaces without making them feel gimmicky. Blur is powerful for overlays, while hue rotation, sepia, grayscale, and invert are stronger stylistic choices.",
        },
        {
          q: "When should I use blur in CSS filters?",
          a: "Use blur mainly for background treatments, frosted glass layers, and decorative depth. It is much less useful on core content because it reduces clarity. Most production blur values stay relatively low unless the element is intentionally atmospheric.",
        },
        {
          q: "Can I combine multiple CSS filters at once?",
          a: "Yes. Multiple filters are typically combined in one filter declaration. That is where generators become helpful, because the combined result is harder to judge mentally once several values are stacked together.",
        },
        {
          q: "Does filter work well for dark mode adaptations?",
          a: "Sometimes. Filters like invert, grayscale, brightness, and contrast can help in graphic or icon contexts, but they are not a universal dark-mode solution. They work best when you understand exactly how the source content should transform.",
        },
        {
          q: "Can I use the exported CSS directly in production?",
          a: "Yes. The generated output is standard CSS filter syntax and can be pasted into stylesheets, component styles, or utility-first frameworks that support arbitrary values or custom properties.",
        },
      ]}
      relatedTools={[
        { title: "CSS Clip-Path Generator", slug: "css-clip-path-generator", icon: <Layers3 className="w-5 h-5" />, color: 220, benefit: "Shape the media after tuning its treatment" },
        { title: "CSS Box Shadow Generator", slug: "css-box-shadow-generator", icon: <Droplets className="w-5 h-5" />, color: 250, benefit: "Add depth to filtered cards and images" },
        { title: "CSS Gradient Generator", slug: "css-gradient-generator", icon: <Palette className="w-5 h-5" />, color: 310, benefit: "Pair filtered layers with stronger surfaces" },
        { title: "Color Palette Generator", slug: "color-palette-generator", icon: <Type className="w-5 h-5" />, color: 170, benefit: "Match filter treatment to a broader palette" },
        { title: "Glassmorphism Generator", slug: "glassmorphism-generator", icon: <ImageIcon className="w-5 h-5" />, color: 140, benefit: "Combine blur and transparency patterns next" },
      ]}
      ctaTitle="Keep Building More Polished Visual UI"
      ctaDescription="Continue into shadows, gradients, clip-path, and glassmorphism tools to shape not just the media treatment, but the full visual system around it."
      ctaHref="/category/css-design"
    />
  );
}
