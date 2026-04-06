import { useMemo, useState } from "react";
import { BarChart3, Check, Copy, Palette, Pipette, RefreshCw, Type } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type HarmonyMode = "monochrome" | "analogous" | "complementary" | "triadic" | "split";

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

interface HslColor {
  h: number;
  s: number;
  l: number;
}

interface PaletteSwatch {
  label: string;
  hex: string;
  hsl: HslColor;
  textHex: string;
}

const HARMONY_LABELS: Record<HarmonyMode, string> = {
  monochrome: "Monochrome",
  analogous: "Analogous",
  complementary: "Complementary",
  triadic: "Triadic",
  split: "Split Complementary",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function wrapHue(value: number) {
  return ((value % 360) + 360) % 360;
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

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

function rgbToHsl(r: number, g: number, b: number): HslColor {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) {
    return { h: 0, s: 0, l: Math.round(lightness * 100) };
  }

  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;

  if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
  else if (max === green) hue = (blue - red) / delta + 2;
  else hue = (red - green) / delta + 4;

  return { h: Math.round(hue * 60), s: Math.round(saturation * 100), l: Math.round(lightness * 100) };
}

function hslToRgb(h: number, s: number, l: number): RgbColor {
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = wrapHue(h) / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));

  let red = 0;
  let green = 0;
  let blue = 0;

  if (huePrime >= 0 && huePrime < 1) [red, green, blue] = [chroma, x, 0];
  else if (huePrime < 2) [red, green, blue] = [x, chroma, 0];
  else if (huePrime < 3) [red, green, blue] = [0, chroma, x];
  else if (huePrime < 4) [red, green, blue] = [0, x, chroma];
  else if (huePrime < 5) [red, green, blue] = [x, 0, chroma];
  else [red, green, blue] = [chroma, 0, x];

  const match = lightness - chroma / 2;
  return {
    r: Math.round((red + match) * 255),
    g: Math.round((green + match) * 255),
    b: Math.round((blue + match) * 255),
  };
}

function hslToHex(h: number, s: number, l: number) {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function luminance({ r, g, b }: RgbColor) {
  const channels = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function getContrastRatio(firstHex: string, secondHex: string) {
  const first = hexToRgb(firstHex);
  const second = hexToRgb(secondHex);
  if (!first || !second) return 1;
  const firstLum = luminance(first);
  const secondLum = luminance(second);
  return (Math.max(firstLum, secondLum) + 0.05) / (Math.min(firstLum, secondLum) + 0.05);
}

function readableTextColor(backgroundHex: string) {
  return getContrastRatio(backgroundHex, "#FFFFFF") >= getContrastRatio(backgroundHex, "#111827") ? "#FFFFFF" : "#111827";
}

function createSwatch(label: string, h: number, s: number, l: number): PaletteSwatch {
  const hsl = { h: wrapHue(h), s: clamp(Math.round(s), 0, 100), l: clamp(Math.round(l), 6, 94) };
  const hex = hslToHex(hsl.h, hsl.s, hsl.l);
  return { label, hex, hsl, textHex: readableTextColor(hex) };
}

function generatePalette(baseHex: string, mode: HarmonyMode, intensity: number) {
  const rgb = hexToRgb(baseHex) ?? { r: 37, g: 99, b: 235 };
  const base = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const spread = Math.round(12 + intensity * 0.45);
  const depth = Math.round(10 + intensity * 0.18);
  const lift = Math.round(14 + intensity * 0.2);

  if (mode === "monochrome") {
    return [
      createSwatch("Shade 700", base.h, base.s + 6, base.l - depth - 8),
      createSwatch("Shade 500", base.h, base.s + 2, base.l - Math.round(depth * 0.55)),
      createSwatch("Base", base.h, base.s, base.l),
      createSwatch("Tint 300", base.h, base.s - 6, base.l + Math.round(lift * 0.55)),
      createSwatch("Tint 100", base.h, base.s - 12, base.l + lift + 8),
    ];
  }

  if (mode === "analogous") {
    return [
      createSwatch("Lead Accent", base.h - spread * 1.35, base.s - 3, base.l + 4),
      createSwatch("Support Accent", base.h - spread * 0.65, base.s + 2, base.l + 1),
      createSwatch("Base", base.h, base.s, base.l),
      createSwatch("Fresh Accent", base.h + spread * 0.7, base.s + 4, base.l + 2),
      createSwatch("Edge Accent", base.h + spread * 1.45, base.s - 2, base.l + 7),
    ];
  }

  if (mode === "complementary") {
    return [
      createSwatch("Base Shadow", base.h, base.s + 4, base.l - depth),
      createSwatch("Base", base.h, base.s, base.l),
      createSwatch("Bridge", base.h + 24, base.s - 10, base.l + Math.round(lift * 0.45)),
      createSwatch("Complement", base.h + 180, base.s + 6, base.l),
      createSwatch("Complement Tint", base.h + 180, base.s - 12, base.l + lift),
    ];
  }

  if (mode === "triadic") {
    return [
      createSwatch("Primary", base.h, base.s, base.l),
      createSwatch("Secondary", base.h + 120, base.s - 2, base.l + 2),
      createSwatch("Tertiary", base.h + 240, base.s + 1, base.l + 1),
      createSwatch("Highlight", base.h + 120, base.s - 14, base.l + lift),
      createSwatch("Depth", base.h + 240, base.s + 6, base.l - depth),
    ];
  }

  return [
    createSwatch("Base", base.h, base.s, base.l),
    createSwatch("Split A", base.h + 150, base.s + 2, base.l + 4),
    createSwatch("Bridge Tint", base.h + 180, base.s - 16, base.l + lift),
    createSwatch("Split B", base.h + 210, base.s + 3, base.l + 3),
    createSwatch("Ground", base.h - 12, base.s - 18, base.l - depth),
  ];
}

function summarizePalette(mode: HarmonyMode, swatches: PaletteSwatch[]) {
  const base = swatches.find((swatch) => swatch.label === "Base") ?? swatches[0];
  const temperature = base.hsl.h < 60 || base.hsl.h >= 300 ? "warm" : base.hsl.h < 180 ? "fresh" : "cool";
  const saturation = base.hsl.s >= 70 ? "high-energy" : base.hsl.s >= 40 ? "balanced" : "muted";

  if (mode === "monochrome") {
    return `This ${temperature}, ${saturation} monochrome palette keeps one hue and changes the depth. It works well when you want clean hierarchy, safer branding consistency, and a design system that feels intentional instead of noisy.`;
  }
  if (mode === "analogous") {
    return "This analogous palette stays within neighboring hues, so it feels cohesive and low-friction. It is a good fit for editorial layouts, SaaS dashboards, landing pages, and interface themes that need variety without visual conflict.";
  }
  if (mode === "complementary") {
    return "This complementary palette balances the base color with its opposite on the wheel. Use it when you need stronger calls to action, sharper contrast between sections, or a brand system with a clear primary and secondary story.";
  }
  if (mode === "triadic") {
    return "This triadic palette spreads color across three major hue families, which creates a lively and flexible system. It suits creative brands, product marketing pages, illustration-led interfaces, and projects that need multiple accents without losing structure.";
  }
  return "This split-complementary palette gives you more contrast than analogous schemes but feels more controlled than a full complementary pair. It is a practical middle ground for UI kits, app themes, and websites that want energy without harsh clashes.";
}

export default function ColorPaletteGenerator() {
  const [hexInput, setHexInput] = useState("#2563EB");
  const [mode, setMode] = useState<HarmonyMode>("analogous");
  const [intensity, setIntensity] = useState(52);
  const [copiedLabel, setCopiedLabel] = useState("");

  const resolvedHex = normalizeHex(hexInput) ?? "#2563EB";
  const palette = useMemo(() => generatePalette(resolvedHex, mode, intensity), [resolvedHex, mode, intensity]);
  const paletteSummary = useMemo(() => summarizePalette(mode, palette), [mode, palette]);
  const cssVariables = useMemo(
    () => `:root {\n${palette.map((swatch) => `  --${swatch.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}: ${swatch.hex};`).join("\n")}\n}`,
    [palette],
  );

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const randomize = () => {
    const randomHex = rgbToHex(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
    const modes: HarmonyMode[] = ["monochrome", "analogous", "complementary", "triadic", "split"];
    setHexInput(randomHex);
    setMode(modes[Math.floor(Math.random() * modes.length)]);
    setIntensity(30 + Math.floor(Math.random() * 51));
  };

  return (
    <UtilityToolPageShell
      title="Color Palette Generator"
      seoTitle="Color Palette Generator - Free Online Color Scheme Creator"
      seoDescription="Free color palette generator for websites, branding, and UI design. Create monochrome, analogous, complementary, triadic, and split-complementary color schemes instantly."
      canonical="https://usonlinetools.com/css-design/color-palette-generator"
      categoryName="CSS & Design Tools"
      categoryHref="/category/css-design"
      heroDescription="Generate polished color palettes from a single base color in seconds. Build monochrome, analogous, complementary, triadic, and split-complementary schemes for websites, product UI, brand systems, dashboards, landing pages, and social graphics without leaving your browser."
      heroIcon={<Palette className="w-3.5 h-3.5" />}
      calculatorLabel="Palette Builder"
      calculatorDescription="Pick a base color, choose a harmony mode, and copy ready-to-use swatches or CSS variables."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Base Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={resolvedHex} onChange={(event) => setHexInput(event.target.value)} className="h-16 w-16 rounded-2xl border border-border bg-card p-1 cursor-pointer" />
                  <input type="text" value={hexInput} onChange={(event) => setHexInput(event.target.value)} onBlur={() => setHexInput(resolvedHex)} className="tool-calc-input w-full font-mono uppercase" placeholder="#2563EB" />
                </div>
              </div>

              <div>
                <label htmlFor="palette-mode" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Harmony Mode</label>
                <select id="palette-mode" value={mode} onChange={(event) => setMode(event.target.value as HarmonyMode)} className="tool-calc-input w-full">
                  <option value="monochrome">Monochrome</option>
                  <option value="analogous">Analogous</option>
                  <option value="complementary">Complementary</option>
                  <option value="triadic">Triadic</option>
                  <option value="split">Split Complementary</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <label htmlFor="intensity" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Palette Intensity</label>
                  <span className="text-xs font-bold text-blue-600">{intensity}</span>
                </div>
                <input id="intensity" type="range" min={0} max={100} value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} className="w-full accent-blue-500" />
                <p className="mt-2 text-xs text-muted-foreground">Lower values stay softer. Higher values push contrast and separation harder.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={randomize} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                  <RefreshCw className="w-4 h-4" />
                  Random
                </button>
                <button onClick={() => copyValue("all-swatches", palette.map((swatch) => swatch.hex).join(", "))} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
                  {copiedLabel === "all-swatches" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copy All
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-5">
                  {palette.map((swatch) => (
                    <button key={swatch.label} onClick={() => copyValue(swatch.label, swatch.hex)} className="min-h-[172px] p-4 text-left transition-transform hover:-translate-y-0.5 border-b sm:border-b-0 sm:border-r last:border-r-0 border-white/10" style={{ backgroundColor: swatch.hex, color: swatch.textHex }}>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] opacity-80">{swatch.label}</p>
                      <p className="mt-7 text-lg font-black">{swatch.hex}</p>
                      <p className="mt-1 text-xs opacity-85">{`hsl(${swatch.hsl.h}, ${swatch.hsl.s}%, ${swatch.hsl.l}%)`}</p>
                      <p className="mt-6 text-[11px] font-bold opacity-80">{copiedLabel === swatch.label ? "Copied to clipboard" : "Click to copy"}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Palette Insight</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{paletteSummary}</p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">CSS Variables</p>
                    <button onClick={() => copyValue("css-vars", cssVariables)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === "css-vars" ? "Copied" : "Copy CSS"}
                    </button>
                  </div>
                  <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                    <code>{cssVariables}</code>
                  </pre>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Live Usage Preview</p>
                <div className="rounded-2xl overflow-hidden border border-border">
                  <div className="p-6" style={{ backgroundColor: palette[0].hex, color: palette[0].textHex }}>
                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-75 mb-2">{HARMONY_LABELS[mode]} Palette</p>
                    <h3 className="text-2xl font-black mb-2">Design a system, not just a single color.</h3>
                    <p className="text-sm leading-relaxed max-w-xl opacity-90">Use your base color for brand recognition, then assign the supporting swatches to UI states, cards, callouts, charts, badges, and action buttons.</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4">
                    {palette.slice(1).map((swatch) => (
                      <div key={`preview-${swatch.label}`} className="p-4" style={{ backgroundColor: swatch.hex, color: swatch.textHex }}>
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] opacity-80">{swatch.label}</p>
                        <p className="mt-1 text-sm font-bold">{swatch.hex}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Choose the base color that should anchor the palette", description: "Start with the color you already know belongs in the project. That might be a product brand color, a button color from an existing interface, a client logo color, or a starting point from a design brief. The visual picker is fastest for exploration, while the HEX field is better when you already have an exact code from Figma, Adobe, Tailwind, or a design token file." },
        { title: "Select the harmony model that matches the tone of the design", description: "Use monochrome when you want a controlled system with minimal risk, analogous when you want smooth transitions and editorial cohesion, complementary when you need strong primary-versus-accent contrast, triadic when you want a more playful multi-accent system, and split complementary when you want energy without the sharper tension of a straight complement." },
        { title: "Adjust intensity to control how bold the separation should feel", description: "The intensity slider changes how far the palette leans into depth, lift, and color separation. Lower intensity creates softer, more restrained palettes that often work well for dashboards, editorial pages, and understated brands. Higher intensity is better for campaigns, SaaS marketing sites, social graphics, and interfaces that need clear visual hierarchy between accents." },
        { title: "Copy single swatches or export the whole palette as CSS variables", description: "Each swatch card copies its HEX value with one click, which is useful when you only need one accent or background color. If you are building a real design system, use the CSS variables export so you can paste the entire palette into a stylesheet, token file, prototype, or front-end codebase immediately." },
      ]}
      interpretationCards={[
        { title: "Monochrome palettes reduce decision fatigue", description: "If your palette stays in one hue family, you can build hierarchy with lightness instead of introducing more colors than the product actually needs. This is usually the safest option for software interfaces, forms, admin panels, and brand refreshes where consistency matters more than novelty." },
        { title: "Analogous palettes feel cohesive and editorial", description: "Neighboring hues tend to blend smoothly, so analogous output often feels polished with very little tuning. This works well for blogs, product landing pages, hero sections, illustrations, and section backgrounds where you want variety but do not want the colors to fight each other.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Complementary and split-complementary palettes create separation", description: "When you need a call to action, badge, chart highlight, or promotional block to stand apart from the base brand color, opposite-side hues are the most efficient tool. Split complementary keeps that energy but softens the clash, which usually makes it easier to use in real interfaces.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "Triadic palettes are flexible, but they need role discipline", description: "A triadic palette can cover primary UI, accent actions, marketing surfaces, and data visualization, but only if each color has a job. If every triadic color gets equal visual weight, the interface becomes noisy. Assign clear roles such as primary, support, accent, and neutral to keep the palette useful.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "SaaS dashboard refresh", input: "Base #2563EB + analogous", output: "A reliable blue-led UI palette with soft neighboring accents" },
        { scenario: "Ecommerce CTA system", input: "Base #0F766E + complementary", output: "Strong action contrast for buttons, promos, and sale highlights" },
        { scenario: "Creative brand kit", input: "Base #DB2777 + triadic", output: "Three energetic color families for campaigns and social assets" },
        { scenario: "Editorial landing page", input: "Base #F59E0B + split complementary", output: "Warm hero color with contrast accents that still feel controlled" },
      ]}
      whyChoosePoints={[
        "This tool is built for actual design workflow rather than novelty output. It does not just randomize pretty colors and hope one combination looks acceptable. It starts from a base color you already care about, uses familiar harmony models, and gives you swatches you can apply to backgrounds, cards, call-to-action buttons, charts, labels, illustrations, and supporting surfaces right away.",
        "The page is useful for both designers and developers. Designers can evaluate whether a base brand color has enough range to support a complete interface system. Developers can copy exact HEX values or paste the CSS variable block into a stylesheet, component library, or token file. That reduces the common gap between exploration in design tools and implementation in code.",
        "It works well for on-page design systems and SEO-conscious site builds because stronger palette structure improves readability, section separation, and perceived polish. Better color systems can indirectly improve engagement metrics by making pages easier to scan, helping key actions stand out, and reducing confusion around calls to action, navigation zones, and interactive components.",
        "Everything happens in the browser. No signup is required, there is no upload step, and no palette data is sent to a server. That matters when you are experimenting with unreleased brand work, agency concepts, redesign proposals, private client systems, or early-stage product themes that are still confidential.",
        "Internal linking is easier when your visual system is coherent. Once you generate a palette here, you can move directly into related tools such as the Color Picker, Color Contrast Checker, CSS Gradient Generator, and HEX to RGB Converter to refine accessibility, extract alternate formats, and build production-ready CSS. That makes this page a practical entry point rather than an isolated gimmick tool.",
      ]}
      faqs={[
        { q: "What is the best harmony mode for a website color palette?", a: "For most websites, analogous or monochrome is the safest starting point because both create consistent visual rhythm and are harder to misuse. Choose complementary if you need strong contrast for call-to-action elements or campaign sections. Choose triadic if the brand needs several expressive accent colors and you are willing to assign those colors disciplined roles." },
        { q: "Can I use this palette generator for UI design systems?", a: "Yes. The output is especially useful for UI systems because the swatches are not limited to decorative inspiration. You can use darker swatches for headers or emphasis, lighter ones for surfaces and panels, and higher-contrast accents for buttons, badges, charts, and notifications. The CSS variables export is there specifically to speed up design-system setup." },
        { q: "Does this tool replace accessibility testing?", a: "No. A good palette is not automatically an accessible palette. After choosing a scheme, you should still test important foreground and background pairs in the Color Contrast Checker to confirm WCAG-friendly combinations. Palette generation helps with harmony and structure, while contrast testing validates readability and compliance." },
        { q: "Why does the same base color look different across harmony modes?", a: "Because each harmony mode changes the relationship around the base hue. Monochrome keeps the hue stable and changes lightness, analogous shifts into neighboring hues, complementary introduces the opposite hue, and triadic distributes accents across three distant hue families. The base color stays recognizable, but the supporting emotional tone changes significantly." },
        { q: "Should I always use every swatch in the generated palette?", a: "No. Most strong interfaces do not use every available color with equal emphasis. Treat the palette as a system of options. Pick a primary color, one or two support accents, and a few lighter or darker surface values. The best result usually comes from restraint, not from forcing every swatch onto the same page." },
        { q: "Can I copy these values into Tailwind, CSS variables, or design tokens?", a: "Yes. Individual swatches copy as HEX values, and the generated CSS variables block can be pasted into a stylesheet or token source quickly. If you want additional formats such as RGB or HSL for a specific swatch, open the related Color Picker or HEX to RGB Converter and continue from there with the same base color." },
        { q: "Is a monochrome palette too boring for marketing pages?", a: "Not necessarily. Monochrome palettes can look premium, technical, or highly editorial when typography, spacing, gradients, and imagery are handled well. If a strict monochrome system feels too flat, split complementary is often the next best move because it adds controlled contrast without making the page feel chaotic." },
        { q: "Who is this color palette generator useful for?", a: "It is useful for front-end developers building UI themes, designers creating brand systems, marketers preparing landing pages and campaign graphics, agencies drafting client concepts, ecommerce teams refining promotional colors, and founders who need a fast starting palette before moving into a full visual identity process." },
      ]}
      relatedTools={[
        { title: "Color Picker", slug: "color-picker", icon: <Palette className="w-4 h-4" />, color: 217, benefit: "Inspect HEX, RGB, and HSL values" },
        { title: "Color Contrast Checker", slug: "color-contrast-checker", icon: <Pipette className="w-4 h-4" />, color: 320, benefit: "Test accessible text and background pairs" },
        { title: "CSS Gradient Generator", slug: "css-gradient-generator", icon: <BarChart3 className="w-4 h-4" />, color: 152, benefit: "Turn palette swatches into gradients" },
        { title: "HEX to RGB Converter", slug: "hex-to-rgb-converter", icon: <Type className="w-4 h-4" />, color: 270, benefit: "Convert palette colors into alternate formats" },
        { title: "Random Color Generator", slug: "random-color-generator", icon: <Palette className="w-4 h-4" />, color: 28, benefit: "Explore unexpected new starting colors" },
        { title: "Meta Tag Generator", slug: "meta-tag-generator", icon: <Pipette className="w-4 h-4" />, color: 45, benefit: "Polish page metadata after styling the site" },
      ]}
      ctaTitle="Need More CSS & Design Tools?"
      ctaDescription="Refine your palette, validate contrast, convert color formats, and build production-ready CSS without leaving the tool hub."
      ctaHref="/category/css-design"
    />
  );
}
