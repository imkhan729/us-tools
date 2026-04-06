import { useState } from "react";
import { BarChart3, Palette, Pipette, Type } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

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
  const value = normalizeHex(hex);
  if (!value) return null;
  return {
    r: Number.parseInt(value.slice(1, 3), 16),
    g: Number.parseInt(value.slice(3, 5), 16),
    b: Number.parseInt(value.slice(5, 7), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

function rgbToHsl(r: number, g: number, b: number) {
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

  return {
    h: Math.round(hue * 60),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

function hslToHex(h: number, s: number, l: number) {
  const saturation = s / 100;
  const lightness = l / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = h / 60;
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
  return rgbToHex(
    Math.round((red + match) * 255),
    Math.round((green + match) * 255),
    Math.round((blue + match) * 255),
  );
}

export default function ColorPickerTool() {
  const [hexInput, setHexInput] = useState("#2563EB");
  const [copiedLabel, setCopiedLabel] = useState("");

  const resolvedHex = normalizeHex(hexInput) ?? "#2563EB";
  const rgb = hexToRgb(resolvedHex) ?? { r: 37, g: 99, b: 235 };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const palette = [
    { label: "Current", value: resolvedHex },
    { label: "Light", value: hslToHex(hsl.h, hsl.s, Math.min(92, hsl.l + 18)) },
    { label: "Dark", value: hslToHex(hsl.h, hsl.s, Math.max(12, hsl.l - 18)) },
    { label: "Complement", value: hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l) },
  ];

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 2000);
  };

  return (
    <UtilityToolPageShell
      title="Color Picker Tool"
      seoTitle="Color Picker Tool"
      seoDescription="Pick colors, inspect HEX RGB HSL values, and copy matching palette variants instantly with this free browser-based color picker."
      canonical="https://usonlinetools.com/css-design/color-picker"
      categoryName="CSS & Design Tools"
      categoryHref="/category/css-design"
      heroDescription="Pick a color visually, inspect its HEX, RGB, and HSL values, and copy ready-to-use codes for design systems, websites, branding work, and quick UI experiments."
      heroIcon={<Palette className="w-3.5 h-3.5" />}
      calculatorLabel="Color Inspector"
      calculatorDescription="Pick, inspect, and copy CSS-ready color values."
      calculator={
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 md:p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5">
            <div className="space-y-3">
              <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Visual Picker</label>
              <input
                type="color"
                value={resolvedHex}
                onChange={(event) => setHexInput(event.target.value)}
                className="h-36 w-full rounded-2xl border border-border bg-card p-2 cursor-pointer"
              />
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Preview</p>
                <div className="h-20 rounded-xl border border-white/30" style={{ backgroundColor: resolvedHex }} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="hex-input" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  HEX Value
                </label>
                <input
                  id="hex-input"
                  type="text"
                  value={hexInput}
                  onChange={(event) => setHexInput(event.target.value)}
                  onBlur={() => setHexInput(resolvedHex)}
                  className="tool-calc-input w-full font-mono"
                  placeholder="#2563EB"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button onClick={() => copyValue("HEX", resolvedHex)} className="rounded-xl border border-border bg-card px-4 py-3 text-left hover:bg-muted">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">HEX</p>
                  <p className="font-mono font-bold text-foreground">{resolvedHex}</p>
                  <p className="text-xs text-blue-600 mt-1">{copiedLabel === "HEX" ? "Copied" : "Copy HEX"}</p>
                </button>
                <button onClick={() => copyValue("RGB", `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)} className="rounded-xl border border-border bg-card px-4 py-3 text-left hover:bg-muted">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">RGB</p>
                  <p className="font-mono font-bold text-foreground">{`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}</p>
                  <p className="text-xs text-blue-600 mt-1">{copiedLabel === "RGB" ? "Copied" : "Copy RGB"}</p>
                </button>
                <button onClick={() => copyValue("HSL", `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)} className="rounded-xl border border-border bg-card px-4 py-3 text-left hover:bg-muted">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">HSL</p>
                  <p className="font-mono font-bold text-foreground">{`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}</p>
                  <p className="text-xs text-blue-600 mt-1">{copiedLabel === "HSL" ? "Copied" : "Copy HSL"}</p>
                </button>
              </div>

              <div>
                <p className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Quick Palette</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {palette.map((swatch) => (
                    <button key={swatch.label} onClick={() => copyValue(swatch.label, swatch.value)} className="rounded-2xl border border-border bg-card p-3 text-left hover:bg-muted">
                      <div className="h-16 rounded-xl border border-white/30 mb-3" style={{ backgroundColor: swatch.value }} />
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{swatch.label}</p>
                      <p className="font-mono text-sm font-bold text-foreground mt-1">{swatch.value}</p>
                      <p className="text-xs text-blue-600 mt-1">{copiedLabel === swatch.label ? "Copied" : "Copy"}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Pick a base color", description: "Use the browser color control or type a HEX code manually into the input field." },
        { title: "Check the code formats", description: "Review the live HEX, RGB, and HSL conversions depending on what your workflow requires." },
        { title: "Inspect supporting swatches", description: "Use the quick palette to grab lighter, darker, or complementary versions of the same color." },
        { title: "Copy the value you need", description: "Click any format or swatch card to copy it into code, design tools, or documentation." },
      ]}
      interpretationCards={[
        { title: "HEX values", description: "Most common in CSS variables, design tokens, and many visual design tools." },
        { title: "RGB values", description: "Helpful for CSS, canvas work, and interfaces that expect separate red, green, and blue channels.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "HSL values", description: "Useful when you want to reason about hue, saturation, and lightness rather than raw channel numbers.", className: "bg-violet-500/5 border-violet-500/20" },
      ]}
      examples={[
        { scenario: "Primary brand blue", input: "#2563EB", output: "rgb(37, 99, 235)" },
        { scenario: "Soft accent", input: "lighter swatch", output: "copy a brighter variant" },
        { scenario: "Complementary color", input: "base hue + 180 degrees", output: "paired opposite hue" },
        { scenario: "Manual HEX entry", input: "#F97316", output: "live RGB and HSL values" },
      ]}
      whyChoosePoints={[
        "Useful for both designers and developers. You can move between visual selection and code-ready formats in the same place.",
        "Faster than doing manual conversions. The tool keeps HEX, RGB, and HSL synchronized while you experiment.",
        "Includes practical palette helpers so you can quickly try lighter, darker, or complementary choices without leaving the page.",
      ]}
      faqs={[
        { q: "Can I type a 3-digit HEX code?", a: "Yes. The tool expands valid 3-digit HEX values into standard 6-digit form automatically." },
        { q: "What happens if I enter an invalid HEX value?", a: "The visual output falls back to the last valid color and the input resets to a valid value when you leave the field." },
        { q: "Are the palette swatches exact color-theory presets?", a: "They are quick practical variants based on the selected HSL values, intended for fast exploration rather than full brand-system generation." },
        { q: "Can I use these values directly in CSS?", a: "Yes. The copied HEX, RGB, and HSL strings are ready to paste into CSS or design-token files." },
      ]}
      relatedTools={[
        { title: "Color Contrast Checker", slug: "color-contrast-checker", icon: <Pipette className="w-4 h-4" />, color: 217, benefit: "Check accessibility contrast" },
        { title: "CSS Gradient Generator", slug: "css-gradient-generator", icon: <BarChart3 className="w-4 h-4" />, color: 152, benefit: "Build gradients from colors" },
        { title: "Random Color Generator", slug: "random-color-generator", icon: <Palette className="w-4 h-4" />, color: 274, benefit: "Explore random palettes" },
        { title: "Text Formatter Tool", slug: "text-formatter-tool", icon: <Type className="w-4 h-4" />, color: 28, benefit: "Prepare color labels and names" },
        { title: "Emoji Picker Tool", slug: "emoji-picker", icon: <Pipette className="w-4 h-4" />, color: 340, benefit: "Pair colors with social content" },
        { title: "Twitter Character Counter", slug: "twitter-character-counter", icon: <BarChart3 className="w-4 h-4" />, color: 185, benefit: "Check social post length" },
      ]}
    />
  );
}
