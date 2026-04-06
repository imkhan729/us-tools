import { useMemo, useState } from "react";
import { BarChart3, Check, Copy, Layers3, Palette, Pipette, RefreshCw, SlidersHorizontal, Type } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

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

interface ShadeEntry {
  step: number;
  hex: string;
  textColor: string;
}

const LIGHT_STEPS: Record<number, number> = {
  50: 0.94,
  100: 0.86,
  200: 0.72,
  300: 0.54,
  400: 0.28,
};

const DARK_STEPS: Record<number, number> = {
  600: 0.12,
  700: 0.24,
  800: 0.38,
  900: 0.54,
  950: 0.74,
};

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

function hexToRgb(hex: string): RgbColor | null {
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

function luminance({ r, g, b }: RgbColor) {
  const channels = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function getReadableTextColor(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#111827";
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 17, g: 24, b: 39 };
  const ratioWithWhite = (Math.max(luminance(rgb), luminance(white)) + 0.05) / (Math.min(luminance(rgb), luminance(white)) + 0.05);
  const ratioWithBlack = (Math.max(luminance(rgb), luminance(black)) + 0.05) / (Math.min(luminance(rgb), luminance(black)) + 0.05);
  return ratioWithWhite >= ratioWithBlack ? "#FFFFFF" : "#111827";
}

function mixChannel(start: number, end: number, amount: number) {
  return clamp(Math.round(start + (end - start) * amount), 0, 255);
}

function mixRgb(first: RgbColor, second: RgbColor, amount: number) {
  return {
    r: mixChannel(first.r, second.r, amount),
    g: mixChannel(first.g, second.g, amount),
    b: mixChannel(first.b, second.b, amount),
  };
}

function sanitizeScaleName(value: string) {
  const cleaned = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return cleaned || "brand";
}

function describeColor(hsl: HslColor) {
  if (hsl.s <= 10) return "neutral";
  if (hsl.h < 25 || hsl.h >= 335) return "red";
  if (hsl.h < 55) return "orange";
  if (hsl.h < 85) return "amber";
  if (hsl.h < 160) return "green";
  if (hsl.h < 210) return "teal";
  if (hsl.h < 255) return "blue";
  if (hsl.h < 300) return "violet";
  return "pink";
}

function generateScale(baseHex: string, contrast: number) {
  const baseRgb = hexToRgb(baseHex) ?? { r: 37, g: 99, b: 235 };
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 2, g: 6, b: 23 };
  const factor = 0.72 + (contrast / 100) * 0.6;

  const entries: ShadeEntry[] = [
    ...Object.entries(LIGHT_STEPS).map(([step, amount]) => {
      const mixed = mixRgb(baseRgb, white, clamp(amount * factor, 0.05, 0.97));
      const hex = rgbToHex(mixed.r, mixed.g, mixed.b);
      return { step: Number(step), hex, textColor: getReadableTextColor(hex) };
    }),
    { step: 500, hex: baseHex, textColor: getReadableTextColor(baseHex) },
    ...Object.entries(DARK_STEPS).map(([step, amount]) => {
      const mixed = mixRgb(baseRgb, black, clamp(amount * factor, 0.05, 0.92));
      const hex = rgbToHex(mixed.r, mixed.g, mixed.b);
      return { step: Number(step), hex, textColor: getReadableTextColor(hex) };
    }),
  ].sort((first, second) => first.step - second.step);

  const scale = Object.fromEntries(entries.map((entry) => [entry.step, entry.hex])) as Record<number, string>;
  return { entries, scale };
}

export default function TailwindColorGenerator() {
  const [hexInput, setHexInput] = useState("#2563EB");
  const [scaleNameInput, setScaleNameInput] = useState("brand");
  const [contrast, setContrast] = useState(58);
  const [copiedLabel, setCopiedLabel] = useState("");

  const baseHex = normalizeHex(hexInput) ?? "#2563EB";
  const scaleName = sanitizeScaleName(scaleNameInput);

  const model = useMemo(() => {
    const baseRgb = hexToRgb(baseHex) ?? { r: 37, g: 99, b: 235 };
    const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
    const { entries, scale } = generateScale(baseHex, contrast);

    const tailwindV3 = `export default {\n  theme: {\n    extend: {\n      colors: {\n        ${scaleName}: {\n${entries.map((entry) => `          ${entry.step}: "${entry.hex}",`).join("\n")}\n        },\n      },\n    },\n  },\n};`;
    const tailwindV4 = `@theme {\n${entries.map((entry) => `  --color-${scaleName}-${entry.step}: ${entry.hex};`).join("\n")}\n}`;
    const cssVariables = `:root {\n${entries.map((entry) => `  --${scaleName}-${entry.step}: ${entry.hex};`).join("\n")}\n}`;
    const tokenJson = JSON.stringify({ [scaleName]: scale }, null, 2);

    return {
      baseHsl,
      entries,
      scale,
      tailwindV3,
      tailwindV4,
      cssVariables,
      tokenJson,
      summary: `This ${describeColor(baseHsl)}-leaning scale keeps ${baseHex} as the 500 anchor and expands it into a Tailwind-style 50 to 950 ramp. That gives you usable surfaces, borders, hover states, active states, accents, and dark backgrounds without hand-tuning every shade.`,
    };
  }, [baseHex, contrast, scaleName]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const randomize = () => {
    const randomHex = rgbToHex(
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    );
    const names = ["brand", "primary", "ocean", "moss", "sunset", "ember", "indigo"];
    setHexInput(randomHex);
    setScaleNameInput(names[Math.floor(Math.random() * names.length)]);
    setContrast(32 + Math.floor(Math.random() * 49));
  };

  return (
    <UtilityToolPageShell
      title="Tailwind CSS Color Generator"
      seoTitle="Tailwind CSS Color Generator - Create Custom 50-950 Color Scales"
      seoDescription="Free Tailwind CSS color generator for building custom 50-950 color scales, Tailwind config snippets, v4 theme tokens, CSS variables, and design-token JSON from one base color."
      canonical="https://usonlinetools.com/css-design/tailwind-color-generator"
      categoryName="CSS & Design Tools"
      categoryHref="/category/css-design"
      heroDescription="Generate a complete Tailwind-style color scale from one base color in seconds. Build clean 50 through 950 shades for buttons, backgrounds, cards, borders, charts, badges, dark sections, and brand systems, then copy Tailwind config code, v4 theme tokens, CSS variables, or JSON tokens without leaving the browser."
      heroIcon={<Layers3 className="w-3.5 h-3.5" />}
      calculatorLabel="Tailwind Palette Builder"
      calculatorDescription="Pick a base color, name the scale, tune the contrast, and copy a full Tailwind-ready palette."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[290px_1fr] gap-5">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Base Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={baseHex} onChange={(event) => setHexInput(event.target.value)} className="h-16 w-16 rounded-2xl border border-border bg-card p-1 cursor-pointer" />
                  <input type="text" value={hexInput} onChange={(event) => setHexInput(event.target.value)} onBlur={() => setHexInput(baseHex)} className="tool-calc-input w-full font-mono uppercase" placeholder="#2563EB" />
                </div>
              </div>

              <div>
                <label htmlFor="scale-name" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Scale Name</label>
                <input id="scale-name" type="text" value={scaleNameInput} onChange={(event) => setScaleNameInput(event.target.value)} className="tool-calc-input w-full font-mono" placeholder="brand" />
                <p className="mt-2 text-xs text-muted-foreground">Sanitized output: <span className="font-mono font-bold text-foreground">{scaleName}</span></p>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <label htmlFor="contrast" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Scale Contrast</label>
                  <span className="text-xs font-bold text-blue-600">{contrast}</span>
                </div>
                <input id="contrast" type="range" min={0} max={100} value={contrast} onChange={(event) => setContrast(Number(event.target.value))} className="w-full accent-blue-500" />
                <p className="mt-2 text-xs text-muted-foreground">Lower values keep the ramp softer. Higher values push lighter lights and deeper darks harder.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={randomize} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                  <RefreshCw className="w-4 h-4" />
                  Random
                </button>
                <button onClick={() => copyValue("all-hex", model.entries.map((entry) => entry.hex).join(", "))} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
                  {copiedLabel === "all-hex" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copy All
                </button>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Base Color Insight</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{model.summary}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
                  {model.entries.map((entry) => (
                    <button key={entry.step} onClick={() => copyValue(String(entry.step), entry.hex)} className="min-h-[172px] border-b lg:border-b-0 sm:border-r border-white/10 p-4 text-left transition-transform hover:-translate-y-0.5" style={{ backgroundColor: entry.hex, color: entry.textColor }}>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] opacity-80">{entry.step}</p>
                      <p className="mt-8 text-lg font-black">{entry.hex}</p>
                      <p className="mt-1 text-xs opacity-85">{copiedLabel === String(entry.step) ? "Copied to clipboard" : "Click to copy"}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Tailwind v3 Config</p>
                    <button onClick={() => copyValue("tailwind-v3", model.tailwindV3)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === "tailwind-v3" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-100"><code>{model.tailwindV3}</code></pre>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Tailwind v4 Theme Tokens</p>
                    <button onClick={() => copyValue("tailwind-v4", model.tailwindV4)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === "tailwind-v4" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-100"><code>{model.tailwindV4}</code></pre>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Live UI Preview</p>
                  <div className="rounded-2xl overflow-hidden border border-border">
                    <div className="p-6" style={{ backgroundColor: model.scale[50], color: model.scale[900] }}>
                      <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-2">{scaleName} palette</p>
                      <h3 className="text-2xl font-black mb-2">A complete Tailwind-ready scale, not a single swatch.</h3>
                      <p className="max-w-xl text-sm leading-relaxed opacity-90">Use 50 and 100 for surfaces, 200 and 300 for borders and low-emphasis fills, 500 as the anchor brand color, and 600 through 950 for actions, dark panels, data accents, and states that need stronger visual weight.</p>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <button className="rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm" style={{ backgroundColor: model.scale[600], color: model.entries.find((entry) => entry.step === 600)?.textColor ?? "#FFFFFF" }}>Primary Button</button>
                        <button className="rounded-xl border px-4 py-2.5 text-sm font-bold" style={{ borderColor: model.scale[300], color: model.scale[700], backgroundColor: "#FFFFFF" }}>Secondary Action</button>
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em]" style={{ backgroundColor: model.scale[200], color: model.scale[800] }}>Badge</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3">
                      {[200, 400, 800].map((step) => {
                        const hex = model.scale[step];
                        const textColor = model.entries.find((entry) => entry.step === step)?.textColor ?? "#111827";
                        return (
                          <div key={step} className="p-4" style={{ backgroundColor: hex, color: textColor }}>
                            <p className="text-[11px] font-black uppercase tracking-[0.18em] opacity-80">{step}</p>
                            <p className="mt-1 text-sm font-bold">{hex}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">CSS Variables</p>
                      <button onClick={() => copyValue("css-vars", model.cssVariables)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                        {copiedLabel === "css-vars" ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-100"><code>{model.cssVariables}</code></pre>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Token JSON</p>
                      <button onClick={() => copyValue("tokens", model.tokenJson)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                        {copiedLabel === "tokens" ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-100"><code>{model.tokenJson}</code></pre>
                  </div>

                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Tailwind Workflow Note</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">Most teams treat 500 as the anchor shade, use 600 for primary buttons and links, 50 or 100 for tinted surfaces, and 700 through 950 for stronger emphasis or dark sections. That is the logic this generator is optimized around.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Choose the base color that should become the 500 shade", description: "In most Tailwind workflows, the middle shade acts as the anchor of the palette, so this generator treats your chosen color as the 500 step. Start with the brand color, UI accent, or campaign color you already know belongs in the project. The tool expands that one decision into the lighter and darker shades that are usually needed across cards, buttons, borders, hovers, alerts, charts, and section backgrounds." },
        { title: "Name the scale the way you want it to appear in Tailwind", description: "The scale name feeds directly into the generated output, so if you type brand, the code exports brand.50 through brand.950. If you type ocean, the generator outputs ocean.50, ocean.100, and so on. This is useful when you are matching an existing design token naming system, setting up a project theme quickly, or handing code to another developer who expects consistent naming across Tailwind config, CSS variables, and JSON tokens." },
        { title: "Adjust contrast to control how soft or dramatic the ramp feels", description: "A softer scale keeps the lighter and darker shades closer to the base color, which is often better for dashboards, editorial interfaces, and restrained product design. A stronger scale creates more separation between steps, which helps when you need obvious light surfaces, clearly distinct hover states, and deep dark accents for hero sections, calls to action, charts, or badge systems. The live preview lets you see those tradeoffs instead of guessing from raw hex values." },
        { title: "Copy the export format that matches your stack", description: "Use the Tailwind v3 snippet if your project still extends theme.colors inside tailwind.config.js or tailwind.config.ts. Use the v4 theme output if you are working with the newer CSS-first token model. If you are integrating with a design system or non-Tailwind stack, the CSS variables and JSON token exports give you the same palette in formats that are easy to drop into component libraries, token pipelines, documentation, or app theming layers." },
      ]}
      interpretationCards={[
        { title: "50 through 200 are usually surface and border territory", description: "These shades are best used for pale backgrounds, subtle fills, low-emphasis badges, and borders. If you try to force them into primary button roles, they often look washed out, but they are excellent for layered UI surfaces and lightly branded sections." },
        { title: "500 is the anchor, not the whole system", description: "Teams often focus too heavily on the main brand color and ignore the supporting shades that make the interface usable. A Tailwind palette is valuable because it turns one decision into a structured system that supports emphasis, de-emphasis, hierarchy, and state changes across the whole product.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "600 and 700 usually carry interactive weight better than 500", description: "A lot of production interfaces use 600 or 700 for clickable elements because those shades often provide stronger contrast and a more confident visual signal than the base 500 step. The 500 shade still matters, but it often works best as the center of the scale rather than the default choice for every component.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "900 and 950 are useful for dark mode, hero sections, and heavy contrast", description: "Very dark shades are not just decorative extras. They are often the missing ingredient when you need a deep panel, footer, callout background, chart contrast, or dark theme accent that still feels connected to the same brand family instead of looking like an unrelated neutral.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "SaaS product theme", input: "brand + #2563EB", output: "brand.50 through brand.950 for UI states" },
        { scenario: "Marketing landing page", input: "sunset + #F97316", output: "warm action, badge, and surface shades" },
        { scenario: "Green data dashboard", input: "moss + #15803D", output: "clean chart, hover, and panel color system" },
        { scenario: "Design tokens export", input: "ocean + CSS variables or JSON", output: "portable palette for non-Tailwind stacks" },
      ]}
      whyChoosePoints={[
        "This Tailwind CSS color generator is designed for production workflow, not just visual experimentation. Instead of giving you a single color or a loose palette of unrelated swatches, it outputs the structured 50 through 950 ramp that developers actually need when building buttons, surfaces, border states, text accents, charts, hero sections, and dark panels inside a Tailwind project.",
        "The tool supports both older and newer Tailwind setups. Some teams still extend colors inside a JavaScript or TypeScript config file, while others are moving toward the v4 CSS-first token model. By generating both formats side by side, the page saves time during migrations and avoids the common mistake of using ad hoc conversions that only work for one codebase version.",
        "It also helps with broader design quality and on-page performance outcomes. Stronger color systems make interfaces easier to scan, clarify which actions deserve attention, and create cleaner visual hierarchy between sections. While a palette generator does not directly improve rankings on its own, better readability and more intentional design can support engagement metrics that matter for real-world site performance.",
        "Internal linking is built into the workflow. After generating the scale, you can move into the Color Contrast Checker to validate accessibility, use the Color Picker or RGB and HEX converters to inspect individual shades, and turn the resulting palette into gradients or broader design systems with the related CSS tools. That keeps the tool useful beyond a single copy action.",
        "Everything stays local to the browser and is immediately reusable. No signup, no upload flow, no hidden premium export step. You get the color ramp, the code, the theme tokens, and the starter preview in one place, which makes this page useful for solo developers, agencies, product teams, and founders who need a credible Tailwind-ready palette quickly.",
      ]}
      faqs={[
        { q: "How does this Tailwind CSS color generator choose the 50 to 950 shades?", a: "The generator treats your chosen base color as the 500 step, then builds lighter and darker variants by mixing the base toward white and deep near-black values. The contrast control changes how aggressively those lighter and darker shades spread away from the center. The result is a practical Tailwind-style ramp intended for interface work rather than a random collection of nearby colors." },
        { q: "Should my brand color always be the 500 shade?", a: "In many projects, yes, because 500 is a natural center point and easy reference for the rest of the scale. That said, some teams intentionally anchor the brand closer to 600 if the original color is too light for interactive elements. This tool uses 500 as the default because it is the most common pattern and the easiest starting point for a balanced palette." },
        { q: "Can I use this output in Tailwind v4?", a: "Yes. The page includes an @theme export that maps each shade to the --color-name-step pattern used in newer Tailwind workflows. If your project is still on v3 or earlier conventions, you can use the config object output instead. Both snippets come from the same generated scale, so you do not need to recreate the palette twice." },
        { q: "Does this replace accessibility testing?", a: "No. A well-structured palette is not automatically an accessible one. After generating the ramp, you should still test important foreground and background combinations in the Color Contrast Checker, especially for text on 50 through 200 surfaces and light text on 700 through 950 backgrounds." },
        { q: "What scale name should I use in Tailwind?", a: "Use a name that matches your project language. brand, primary, accent, ocean, or a specific product namespace can all work. The important part is consistency. If the palette is going to be reused across components, docs, tokens, and marketing pages, a clear stable name is better than an overly clever one." },
        { q: "Why generate CSS variables and JSON tokens too?", a: "Because many teams do not live entirely inside Tailwind. A design system may need CSS variables for runtime theming, JSON for tokens, and Tailwind config for utility classes, all from the same source color. Exporting multiple formats reduces drift between systems and makes the generated palette more useful in mixed stacks." },
        { q: "Can I use this Tailwind color generator for dark mode?", a: "Yes. The deeper shades such as 800, 900, and 950 are often the most useful part of the output when building dark sections, dark mode surfaces, or strong contrast hero blocks. You will still want to test final text contrast, but the generated darker tones are intended to support that workflow." },
        { q: "Who is this tool useful for?", a: "It is useful for front-end developers setting up Tailwind themes, designers creating dev-friendly handoff palettes, agencies building branded landing pages, startup teams shipping dashboards quickly, and anyone who wants a structured Tailwind-ready color system without manually inventing ten supporting shades around one base color." },
      ]}
      relatedTools={[
        { title: "Color Palette Generator", slug: "color-palette-generator", icon: <Palette className="w-4 h-4" />, color: 217, benefit: "Explore broader harmony systems around the same base" },
        { title: "Color Contrast Checker", slug: "color-contrast-checker", icon: <Pipette className="w-4 h-4" />, color: 320, benefit: "Validate important text and background pairs" },
        { title: "Color Picker", slug: "color-picker", icon: <Type className="w-4 h-4" />, color: 152, benefit: "Inspect individual shades in multiple formats" },
        { title: "RGB to HEX Converter", slug: "rgb-to-hex-converter", icon: <SlidersHorizontal className="w-4 h-4" />, color: 25, benefit: "Convert source brand values before building the scale" },
        { title: "HEX to RGB Converter", slug: "hex-to-rgb-converter", icon: <Layers3 className="w-4 h-4" />, color: 280, benefit: "Move generated shades into channel-based workflows" },
        { title: "CSS Gradient Generator", slug: "css-gradient-generator", icon: <BarChart3 className="w-4 h-4" />, color: 45, benefit: "Turn palette shades into backgrounds and hero treatments" },
      ]}
      ctaTitle="Need More CSS & Design Tools?"
      ctaDescription="Keep refining the palette with contrast checks, format converters, broader color systems, and production-ready CSS utilities."
      ctaHref="/category/css-design"
    />
  );
}
