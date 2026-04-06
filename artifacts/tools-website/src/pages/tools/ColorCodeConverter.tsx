import { useMemo, useState } from "react";
import { Check, Copy, Droplets, Palette, Pipette, RefreshCw, SlidersHorizontal, Type } from "lucide-react";
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

interface CmykColor {
  c: number;
  m: number;
  y: number;
  k: number;
}

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

function hslToRgb(h: number, s: number, l: number): RgbColor {
  const hue = ((h % 360) + 360) % 360;
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = hue / 60;
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
    r: clamp(Math.round((red + match) * 255), 0, 255),
    g: clamp(Math.round((green + match) * 255), 0, 255),
    b: clamp(Math.round((blue + match) * 255), 0, 255),
  };
}

function rgbToCmyk(r: number, g: number, b: number): CmykColor {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const key = 1 - Math.max(red, green, blue);

  if (key >= 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  return {
    c: Math.round(((1 - red - key) / (1 - key)) * 100),
    m: Math.round(((1 - green - key) / (1 - key)) * 100),
    y: Math.round(((1 - blue - key) / (1 - key)) * 100),
    k: Math.round(key * 100),
  };
}

function cmykToRgb(c: number, m: number, y: number, k: number): RgbColor {
  const cyan = clamp(c, 0, 100) / 100;
  const magenta = clamp(m, 0, 100) / 100;
  const yellow = clamp(y, 0, 100) / 100;
  const key = clamp(k, 0, 100) / 100;

  return {
    r: Math.round(255 * (1 - cyan) * (1 - key)),
    g: Math.round(255 * (1 - magenta) * (1 - key)),
    b: Math.round(255 * (1 - yellow) * (1 - key)),
  };
}

function parseNumericInput(value: string, min: number, max: number) {
  if (value.trim() === "") return "";
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) return "";
  return String(clamp(Math.round(parsed), min, max));
}

function describeColor(hsl: HslColor) {
  if (hsl.s <= 8) return "neutral";
  if (hsl.h < 25 || hsl.h >= 335) return "red-leaning";
  if (hsl.h < 60) return "warm";
  if (hsl.h < 170) return "green-leaning";
  if (hsl.h < 255) return "cool";
  return "violet-leaning";
}

function getReadableTextColor(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#111827";
  const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  return luminance > 0.56 ? "#111827" : "#FFFFFF";
}

export default function ColorCodeConverter() {
  const [rgbInput, setRgbInput] = useState({ r: "37", g: "99", b: "235" });
  const [hexInput, setHexInput] = useState("#2563EB");
  const [hslInput, setHslInput] = useState({ h: "221", s: "83", l: "53" });
  const [cmykInput, setCmykInput] = useState({ c: "84", m: "58", y: "0", k: "8" });
  const [copiedLabel, setCopiedLabel] = useState("");

  const rgb = useMemo(() => {
    const parsed = {
      r: clamp(Number.parseInt(rgbInput.r || "0", 10), 0, 255),
      g: clamp(Number.parseInt(rgbInput.g || "0", 10), 0, 255),
      b: clamp(Number.parseInt(rgbInput.b || "0", 10), 0, 255),
    };
    return {
      ...parsed,
      hex: rgbToHex(parsed.r, parsed.g, parsed.b),
      hsl: rgbToHsl(parsed.r, parsed.g, parsed.b),
      cmyk: rgbToCmyk(parsed.r, parsed.g, parsed.b),
    };
  }, [rgbInput]);

  const syncFromHex = (value: string) => {
    setHexInput(value);
    const parsed = hexToRgb(value);
    if (!parsed) return;
    const hsl = rgbToHsl(parsed.r, parsed.g, parsed.b);
    const cmyk = rgbToCmyk(parsed.r, parsed.g, parsed.b);
    setRgbInput({ r: String(parsed.r), g: String(parsed.g), b: String(parsed.b) });
    setHslInput({ h: String(hsl.h), s: String(hsl.s), l: String(hsl.l) });
    setCmykInput({ c: String(cmyk.c), m: String(cmyk.m), y: String(cmyk.y), k: String(cmyk.k) });
  };

  const syncFromRgb = (next: typeof rgbInput) => {
    setRgbInput(next);
    const parsed = {
      r: clamp(Number.parseInt(next.r || "0", 10), 0, 255),
      g: clamp(Number.parseInt(next.g || "0", 10), 0, 255),
      b: clamp(Number.parseInt(next.b || "0", 10), 0, 255),
    };
    const nextHex = rgbToHex(parsed.r, parsed.g, parsed.b);
    const hsl = rgbToHsl(parsed.r, parsed.g, parsed.b);
    const cmyk = rgbToCmyk(parsed.r, parsed.g, parsed.b);
    setHexInput(nextHex);
    setHslInput({ h: String(hsl.h), s: String(hsl.s), l: String(hsl.l) });
    setCmykInput({ c: String(cmyk.c), m: String(cmyk.m), y: String(cmyk.y), k: String(cmyk.k) });
  };

  const syncFromHsl = (next: typeof hslInput) => {
    setHslInput(next);
    const parsed = {
      h: clamp(Number.parseInt(next.h || "0", 10), 0, 360),
      s: clamp(Number.parseInt(next.s || "0", 10), 0, 100),
      l: clamp(Number.parseInt(next.l || "0", 10), 0, 100),
    };
    const nextRgb = hslToRgb(parsed.h, parsed.s, parsed.l);
    const nextHex = rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b);
    const cmyk = rgbToCmyk(nextRgb.r, nextRgb.g, nextRgb.b);
    setRgbInput({ r: String(nextRgb.r), g: String(nextRgb.g), b: String(nextRgb.b) });
    setHexInput(nextHex);
    setCmykInput({ c: String(cmyk.c), m: String(cmyk.m), y: String(cmyk.y), k: String(cmyk.k) });
  };

  const syncFromCmyk = (next: typeof cmykInput) => {
    setCmykInput(next);
    const parsed = {
      c: clamp(Number.parseInt(next.c || "0", 10), 0, 100),
      m: clamp(Number.parseInt(next.m || "0", 10), 0, 100),
      y: clamp(Number.parseInt(next.y || "0", 10), 0, 100),
      k: clamp(Number.parseInt(next.k || "0", 10), 0, 100),
    };
    const nextRgb = cmykToRgb(parsed.c, parsed.m, parsed.y, parsed.k);
    const nextHex = rgbToHex(nextRgb.r, nextRgb.g, nextRgb.b);
    const hsl = rgbToHsl(nextRgb.r, nextRgb.g, nextRgb.b);
    setRgbInput({ r: String(nextRgb.r), g: String(nextRgb.g), b: String(nextRgb.b) });
    setHexInput(nextHex);
    setHslInput({ h: String(hsl.h), s: String(hsl.s), l: String(hsl.l) });
  };

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const randomize = () => {
    syncFromRgb({
      r: String(Math.floor(Math.random() * 256)),
      g: String(Math.floor(Math.random() * 256)),
      b: String(Math.floor(Math.random() * 256)),
    });
  };

  const cssRgb = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const cssHsl = `hsl(${rgb.hsl.h}, ${rgb.hsl.s}%, ${rgb.hsl.l}%)`;
  const cssCmyk = `cmyk(${rgb.cmyk.c}%, ${rgb.cmyk.m}%, ${rgb.cmyk.y}%, ${rgb.cmyk.k}%)`;
  const colorDescription = `${hexInput} is a ${describeColor(rgb.hsl)} digital color with RGB channels ${rgb.r}, ${rgb.g}, and ${rgb.b}. Its HSL values show ${rgb.hsl.s}% saturation and ${rgb.hsl.l}% lightness, while the CMYK conversion estimates how the same hue maps into print-oriented ink percentages.`;

  return (
    <UtilityToolPageShell
      title="Color Code Converter"
      seoTitle="Color Code Converter - Convert HEX, RGB, HSL, and CMYK Online"
      seoDescription="Free color code converter for HEX, RGB, HSL, and CMYK. Convert color values instantly, preview the result live, and copy developer-ready CSS and design-token snippets."
      canonical="https://usonlinetools.com/developer/color-code-converter"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Convert color values across HEX, RGB, HSL, and CMYK in one place. This free color code converter helps developers, designers, and marketers move between browser-ready screen colors and print-oriented color percentages without guessing, spreadsheet math, or switching tabs."
      heroIcon={<Palette className="w-3.5 h-3.5" />}
      calculatorLabel="Multi-Format Color Converter"
      calculatorDescription="Edit any supported format, preview the color instantly, and copy the exact code you need."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Visual Picker</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={hexInput} onChange={(event) => syncFromHex(event.target.value)} className="h-16 w-16 rounded-2xl border border-border bg-card p-1 cursor-pointer" />
                  <div>
                    <p className="text-sm font-bold text-foreground">{hexInput}</p>
                    <p className="text-xs text-muted-foreground">Use the picker for quick exploration or edit any code format below.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-border bg-card">
                <div className="p-6" style={{ backgroundColor: hexInput, color: getReadableTextColor(hexInput) }}>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-75 mb-2">Preview</p>
                  <h3 className="text-2xl font-black mb-2">{hexInput}</h3>
                  <p className="text-sm leading-relaxed opacity-90">{colorDescription}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={randomize} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                  <RefreshCw className="w-4 h-4" />
                  Random
                </button>
                <button onClick={() => copyValue("all-formats", [hexInput, cssRgb, cssHsl, cssCmyk].join("\n"))} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
                  {copiedLabel === "all-formats" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copy All
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">HEX</p>
                    <button onClick={() => copyValue("hex", hexInput)} className="text-xs font-bold text-blue-600 hover:text-blue-700">{copiedLabel === "hex" ? "Copied" : "Copy"}</button>
                  </div>
                  <input type="text" value={hexInput} onChange={(event) => setHexInput(event.target.value)} onBlur={() => syncFromHex(hexInput)} className="tool-calc-input w-full font-mono uppercase" placeholder="#2563EB" />
                  <p className="text-xs text-muted-foreground">Supports 3-digit and 6-digit hex input. Blur the field to apply and sync all other formats.</p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">RGB</p>
                    <button onClick={() => copyValue("rgb", cssRgb)} className="text-xs font-bold text-blue-600 hover:text-blue-700">{copiedLabel === "rgb" ? "Copied" : "Copy"}</button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {(["r", "g", "b"] as const).map((key) => (
                      <input
                        key={key}
                        type="number"
                        min={0}
                        max={255}
                        value={rgbInput[key]}
                        onChange={(event) => syncFromRgb({ ...rgbInput, [key]: parseNumericInput(event.target.value, 0, 255) })}
                        className="tool-calc-input w-full font-mono"
                        placeholder={key.toUpperCase()}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Best for CSS functions, canvas work, and channel-by-channel color debugging.</p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">HSL</p>
                    <button onClick={() => copyValue("hsl", cssHsl)} className="text-xs font-bold text-blue-600 hover:text-blue-700">{copiedLabel === "hsl" ? "Copied" : "Copy"}</button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <input type="number" min={0} max={360} value={hslInput.h} onChange={(event) => syncFromHsl({ ...hslInput, h: parseNumericInput(event.target.value, 0, 360) })} className="tool-calc-input w-full font-mono" placeholder="H" />
                    <input type="number" min={0} max={100} value={hslInput.s} onChange={(event) => syncFromHsl({ ...hslInput, s: parseNumericInput(event.target.value, 0, 100) })} className="tool-calc-input w-full font-mono" placeholder="S" />
                    <input type="number" min={0} max={100} value={hslInput.l} onChange={(event) => syncFromHsl({ ...hslInput, l: parseNumericInput(event.target.value, 0, 100) })} className="tool-calc-input w-full font-mono" placeholder="L" />
                  </div>
                  <p className="text-xs text-muted-foreground">Useful when you want to reason about hue, saturation, and lightness instead of raw channel values.</p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">CMYK</p>
                    <button onClick={() => copyValue("cmyk", cssCmyk)} className="text-xs font-bold text-blue-600 hover:text-blue-700">{copiedLabel === "cmyk" ? "Copied" : "Copy"}</button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {(["c", "m", "y", "k"] as const).map((key) => (
                      <input
                        key={key}
                        type="number"
                        min={0}
                        max={100}
                        value={cmykInput[key]}
                        onChange={(event) => syncFromCmyk({ ...cmykInput, [key]: parseNumericInput(event.target.value, 0, 100) })}
                        className="tool-calc-input w-full font-mono"
                        placeholder={key.toUpperCase()}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Helpful for rough print conversions, handoff notes, and bridging screen colors into print-oriented workflows.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Copy-Ready Output Snippets</p>
                  <div className="space-y-3">
                    {[
                      { label: "HEX", value: hexInput },
                      { label: "CSS RGB", value: cssRgb },
                      { label: "CSS HSL", value: cssHsl },
                      { label: "CMYK", value: cssCmyk },
                      { label: "CSS Variable", value: `--brand-color: ${hexInput};` },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 p-3">
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                          <p className="mt-1 text-sm font-mono font-bold text-foreground break-all">{item.value}</p>
                        </div>
                        <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                          {copiedLabel === item.label ? "Copied" : "Copy"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Live Breakdown</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "R", value: rgb.r, accent: "text-rose-600" },
                        { label: "G", value: rgb.g, accent: "text-emerald-600" },
                        { label: "B", value: rgb.b, accent: "text-blue-600" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3 text-center">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                          <p className={`mt-1 text-xl font-black ${item.accent}`}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Developer Note</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">HEX, RGB, and HSL are screen-first formats used across CSS, design tokens, and front-end systems. CMYK is primarily useful as an approximation when a print-oriented workflow still needs to reference the same color family.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Start from whichever color format you already have", description: "Some workflows begin with a brand HEX code from a design system, others start with RGB values from a canvas API, and some print-oriented briefs still arrive as CMYK percentages. This converter is built so you can begin from any of those entry points. As soon as you update one format, the other representations sync to match the same underlying color." },
        { title: "Use the live preview to confirm the conversion visually", description: "Exact values matter, but a color conversion tool is still easier to trust when it shows what the result actually looks like. The preview card helps you verify that the converted color behaves like the tone you expect before you copy it into CSS, Tailwind tokens, design documentation, email templates, graphics briefs, or print handoff notes." },
        { title: "Copy the format that matches the next step in your workflow", description: "Developers often need HEX or RGB for CSS, HSL for easier palette manipulation, and occasionally CMYK percentages for external vendor communication. Instead of switching between separate converters or rebuilding the same value manually, this page lets you grab the exact snippet you need in one click, including CSS-friendly strings and a token-style variable line." },
        { title: "Use the result as a bridge between design, development, and marketing teams", description: "Color handoff often breaks when one team speaks in design-tool swatches, another works in CSS, and another references print values. A complete color code converter reduces that friction by showing multiple standard representations together, making it easier to keep everyone aligned on the same actual color rather than a rough visual approximation." },
      ]}
      interpretationCards={[
        { title: "HEX is compact and common in front-end code", description: "HEX is the shortest and most widely recognized format for web color tokens, utility classes, quick docs, and component props. It is often the easiest format to scan in code reviews and design specs." },
        { title: "RGB is useful when individual channels matter", description: "If you are working with canvas APIs, image processing, opacity math, or anything that needs per-channel manipulation, RGB is often the most direct format. It also maps cleanly to JavaScript and browser color APIs.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "HSL is easier to reason about when building systems", description: "HSL separates hue, saturation, and lightness, which makes it easier to understand whether a color is too dull, too bright, or too dark. That is one reason designers and token authors often like HSL for palette work.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "CMYK is best treated as a print-oriented approximation here", description: "CMYK is useful for discussing ink percentages and print expectations, but it does not map perfectly to every screen color space. Use it as a practical bridge, not as a guarantee that every monitor and print device will render the color identically.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Tailwind brand token", input: "#2563EB", output: "rgb(37, 99, 235) and hsl(221, 83%, 53%)" },
        { scenario: "Canvas debugging", input: "rgb(255, 87, 51)", output: "#FF5733" },
        { scenario: "Design palette tuning", input: "hsl(160, 84%, 39%)", output: "matching HEX and RGB values" },
        { scenario: "Print handoff reference", input: "cmyk(84%, 58%, 0%, 8%)", output: "screen color approximation in HEX and RGB" },
      ]}
      whyChoosePoints={[
        "This color code converter solves a broader workflow than single-format tools. Many pages online will convert HEX to RGB or RGB to HEX, but real teams move across several formats in the same project: HEX in docs, RGB in CSS functions, HSL in system thinking, and CMYK in print conversations. Putting all four together makes the tool more useful for actual day-to-day work.",
        "The page is also aligned with the kind of content structure that performs better for users and search. It gives an immediate working widget, clear explanations, copy-ready snippets, internal links to related tools, and practical interpretation instead of a thin placeholder page with almost no useful context. That improves both usability and the likelihood that the page can rank for genuine conversion intent rather than feeling autogenerated or incomplete.",
        "For front-end developers, this page reduces friction when moving between design and code. You can inspect a value from Figma, convert it for CSS or tokens, validate the same shade in related contrast or palette tools, and keep the workflow inside one ecosystem. That internal linking is useful for people too, not just crawlers, because color work usually involves several adjacent tasks rather than one isolated copy action.",
        "For agencies, marketers, and brand teams, having CMYK alongside screen-oriented formats is a practical advantage. It does not replace formal print proofing, but it gives a fast reference point when the same campaign color has to appear in a landing page, social graphic, PDF, ad creative, and vendor brief. That makes the page useful outside pure software development as well.",
        "Everything is immediate and local. No upload step, no account, no modal gate, and no forced app flow. You change a value and the rest of the formats update instantly, which is exactly what a mature color conversion tool should do if it is meant to be used repeatedly rather than once.",
      ]}
      faqs={[
        { q: "What is the difference between HEX, RGB, HSL, and CMYK?", a: "HEX, RGB, and HSL are all common ways of describing digital screen color. HEX is compact, RGB expresses red, green, and blue channel values directly, and HSL separates hue, saturation, and lightness for easier visual reasoning. CMYK is a print-oriented model based on cyan, magenta, yellow, and key black ink percentages. The same visual color can be expressed in all of these formats, but they are optimized for different workflows." },
        { q: "Is the CMYK conversion exact?", a: "Not in an absolute device-independent sense. CMYK depends on print conditions, paper, ink, and color profiles, so a browser-based CMYK conversion should be treated as a practical approximation rather than a final proof. It is still useful for rough handoff, planning, and communication, but production print work should ultimately rely on calibrated profiles and proofing." },
        { q: "Why would a developer need HSL if HEX already works?", a: "HEX is excellent for storage and quick reference, but HSL is often easier when you want to think about what to change. If a color feels too dark, too washed out, or too intense, HSL makes that relationship clearer because lightness and saturation are expressed independently. That is why many design-token systems and palette-building workflows still expose HSL even if the final shipped value is HEX." },
        { q: "Can I start by typing RGB instead of HEX?", a: "Yes. This page is built so that RGB, HSL, CMYK, and the visual picker can all act as entry points. As soon as one format changes, the other formats are recalculated to match it. That means you do not need separate tools for each direction of conversion." },
        { q: "Does this tool help with Tailwind CSS or design tokens?", a: "Yes. HEX and RGB are both useful in Tailwind and CSS variable workflows, while HSL is often valuable when designing or documenting a broader color system. If you need a full Tailwind-style ramp after finding the right base color, the related Tailwind CSS Color Generator is the next logical step." },
        { q: "Why include a live preview in a developer converter?", a: "Because color conversion is still visual work. Seeing the output instantly helps you catch mistakes, confirm that a typed value is the shade you meant, and decide whether the color belongs in a background, button, border, or text role. Without a preview, you often end up pasting values back into another tool just to verify the result." },
        { q: "Can I use this tool for print work?", a: "You can use it for print-adjacent planning, rough references, and communication, especially when you need to relate a digital brand color to CMYK percentages quickly. For final print production, though, you should still rely on proper print proofs, vendor guidance, and color-managed workflows." },
        { q: "Who is this color code converter useful for?", a: "It is useful for front-end developers, UI designers, brand designers, marketers preparing campaign assets, agencies bridging screen and print deliverables, and anyone who needs to move accurately between common color formats without juggling multiple separate converters." },
      ]}
      relatedTools={[
        { title: "HEX to RGB Converter", slug: "hex-to-rgb-converter", icon: <Pipette className="w-4 h-4" />, color: 217, benefit: "Inspect hex colors with focused channel output" },
        { title: "RGB to HEX Converter", slug: "rgb-to-hex-converter", icon: <SlidersHorizontal className="w-4 h-4" />, color: 280, benefit: "Convert RGB values into exact hex tokens" },
        { title: "Color Picker", slug: "color-picker", icon: <Palette className="w-4 h-4" />, color: 152, benefit: "Explore and sample colors visually" },
        { title: "Color Contrast Checker", slug: "color-contrast-checker", icon: <Type className="w-4 h-4" />, color: 340, benefit: "Validate accessibility after conversion" },
        { title: "Tailwind CSS Color Generator", slug: "tailwind-color-generator", icon: <Droplets className="w-4 h-4" />, color: 25, benefit: "Expand a converted color into a full scale" },
        { title: "Color Palette Generator", slug: "color-palette-generator", icon: <Copy className="w-4 h-4" />, color: 45, benefit: "Turn one color into a broader system" },
      ]}
      ctaTitle="Need More Developer and Color Tools?"
      ctaDescription="Keep going with format-specific converters, palette builders, contrast checks, and token-ready color utilities in the same tool hub."
      ctaHref="/category/developer"
    />
  );
}
