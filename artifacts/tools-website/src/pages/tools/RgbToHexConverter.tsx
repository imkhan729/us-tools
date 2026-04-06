import { useMemo, useState } from "react";
import { Check, Copy, Palette, Pipette, RefreshCw, SlidersHorizontal, Type } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

interface HslColor {
  h: number;
  s: number;
  l: number;
}

function clampChannel(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(255, Math.max(0, Math.round(value)));
}

function normalizeChannelInput(value: string) {
  if (value.trim() === "") return "";
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return "";
  return String(clampChannel(parsed));
}

function componentToHex(value: number) {
  return clampChannel(value).toString(16).padStart(2, "0").toUpperCase();
}

function rgbToHex(red: number, green: number, blue: number) {
  return `#${componentToHex(red)}${componentToHex(green)}${componentToHex(blue)}`;
}

function rgbToShortHex(red: number, green: number, blue: number) {
  const full = rgbToHex(red, green, blue);
  const [r1, r2, g1, g2, b1, b2] = full.slice(1).split("");
  return r1 === r2 && g1 === g2 && b1 === b2 ? `#${r1}${g1}${b1}` : null;
}

function rgbToHsl(red: number, green: number, blue: number): HslColor {
  const r = clampChannel(red) / 255;
  const g = clampChannel(green) / 255;
  const b = clampChannel(blue) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) {
    return { h: 0, s: 0, l: Math.round(lightness * 100) };
  }

  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;

  if (max === r) hue = (g - b) / delta + (g < b ? 6 : 0);
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;

  return {
    h: Math.round(hue * 60),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

function getToneLabel(hsl: HslColor) {
  if (hsl.s <= 8) return "neutral";
  if (hsl.h < 30 || hsl.h >= 330) return "red-leaning";
  if (hsl.h < 75) return "warm";
  if (hsl.h < 165) return "green-leaning";
  if (hsl.h < 255) return "cool";
  return "violet-leaning";
}

function getReadableTextColor(red: number, green: number, blue: number) {
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
  return luminance > 0.52 ? "#111827" : "#FFFFFF";
}

function parseColorPickerHex(hex: string) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return null;
  return {
    red: Number.parseInt(hex.slice(1, 3), 16),
    green: Number.parseInt(hex.slice(3, 5), 16),
    blue: Number.parseInt(hex.slice(5, 7), 16),
  };
}

function buildShadeScale(red: number, green: number, blue: number) {
  const makeShade = (ratio: number) => {
    const mix = (channel: number) => clampChannel(channel + (255 - channel) * ratio);
    return rgbToHex(mix(red), mix(green), mix(blue));
  };

  return {
    500: rgbToHex(red, green, blue),
    400: makeShade(0.12),
    300: makeShade(0.24),
    200: makeShade(0.4),
    100: makeShade(0.64),
  };
}

export default function RgbToHexConverter() {
  const [redInput, setRedInput] = useState("37");
  const [greenInput, setGreenInput] = useState("99");
  const [blueInput, setBlueInput] = useState("235");
  const [copiedLabel, setCopiedLabel] = useState("");

  const color = useMemo(() => {
    const red = clampChannel(Number.parseInt(redInput || "0", 10));
    const green = clampChannel(Number.parseInt(greenInput || "0", 10));
    const blue = clampChannel(Number.parseInt(blueInput || "0", 10));
    const hex = rgbToHex(red, green, blue);
    const shortHex = rgbToShortHex(red, green, blue);
    const hsl = rgbToHsl(red, green, blue);
    const textColor = getReadableTextColor(red, green, blue);
    const shades = buildShadeScale(red, green, blue);

    return {
      red,
      green,
      blue,
      hex,
      shortHex,
      hsl,
      textColor,
      shades,
      cssRgb: `rgb(${red}, ${green}, ${blue})`,
      cssHsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      cssVarBlock: `:root {\n  --brand-500: ${hex};\n  --brand-400: ${shades[400]};\n  --brand-300: ${shades[300]};\n  --brand-200: ${shades[200]};\n  --brand-100: ${shades[100]};\n}`,
      summary:
        hsl.s <= 8
          ? `This color is a neutral tone with very low saturation. ${hex} behaves like a gray-scale utility color, which makes it useful for borders, muted text, dividers, and low-emphasis UI chrome.`
          : `${hex} is a ${getToneLabel(hsl)} color with ${hsl.s}% saturation and ${hsl.l}% lightness. It is vivid enough for branding or calls to action while still being easy to convert into HSL, CSS variables, or related UI shades.`,
    };
  }, [blueInput, greenInput, redInput]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const randomize = () => {
    setRedInput(String(Math.floor(Math.random() * 256)));
    setGreenInput(String(Math.floor(Math.random() * 256)));
    setBlueInput(String(Math.floor(Math.random() * 256)));
  };

  const syncFromPicker = (hex: string) => {
    const parsed = parseColorPickerHex(hex);
    if (!parsed) return;
    setRedInput(String(parsed.red));
    setGreenInput(String(parsed.green));
    setBlueInput(String(parsed.blue));
  };

  return (
    <UtilityToolPageShell
      title="RGB to HEX Converter"
      seoTitle="RGB to HEX Converter - Free Online RGB Color Code to HEX Tool"
      seoDescription="Free RGB to HEX converter with live color preview, shorthand HEX detection, CSS copy buttons, HSL output, and browser-ready shade suggestions for UI and web design."
      canonical="https://usonlinetools.com/css-design/rgb-to-hex-converter"
      categoryName="CSS & Design Tools"
      categoryHref="/category/css-design"
      heroDescription="Convert RGB values into exact HEX color codes instantly. Use this free RGB to HEX converter to translate red, green, and blue channel values into browser-ready color strings, preview the result live, copy CSS formats, and build cleaner design system tokens for websites, apps, Tailwind themes, landing pages, and brand kits."
      heroIcon={<Palette className="w-3.5 h-3.5" />}
      calculatorLabel="RGB Color Converter"
      calculatorDescription="Enter channel values from 0 to 255, adjust the preview, and copy the HEX or CSS output you need."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-5">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-5">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Color Picker</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(event) => syncFromPicker(event.target.value)}
                    className="h-16 w-16 rounded-2xl border border-border bg-card p-1 cursor-pointer"
                  />
                  <div>
                    <p className="text-sm font-bold text-foreground">{color.hex}</p>
                    <p className="text-xs text-muted-foreground">Drag the swatch or edit channels manually.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Red", value: redInput, setter: setRedInput, accent: "text-rose-600" },
                  { label: "Green", value: greenInput, setter: setGreenInput, accent: "text-emerald-600" },
                  { label: "Blue", value: blueInput, setter: setBlueInput, accent: "text-blue-600" },
                ].map((channel) => (
                  <div key={channel.label}>
                    <label className="block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground mb-2">{channel.label}</label>
                    <input
                      type="number"
                      min={0}
                      max={255}
                      inputMode="numeric"
                      value={channel.value}
                      onChange={(event) => channel.setter(normalizeChannelInput(event.target.value))}
                      onBlur={(event) => channel.setter(normalizeChannelInput(event.target.value || "0"))}
                      className={`tool-calc-input w-full font-mono ${channel.accent}`}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="red-range" className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Channel Sliders</label>
                  <button onClick={randomize} className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Random
                  </button>
                </div>

                {[
                  { id: "red-range", label: "R", value: color.red, setter: setRedInput, accent: "accent-rose-500" },
                  { id: "green-range", label: "G", value: color.green, setter: setGreenInput, accent: "accent-emerald-500" },
                  { id: "blue-range", label: "B", value: color.blue, setter: setBlueInput, accent: "accent-blue-500" },
                ].map((slider) => (
                  <div key={slider.id} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-black text-muted-foreground">{slider.label}</span>
                    <input
                      id={slider.id}
                      type="range"
                      min={0}
                      max={255}
                      value={slider.value}
                      onChange={(event) => slider.setter(event.target.value)}
                      className={`w-full ${slider.accent}`}
                    />
                    <span className="w-10 text-right text-xs font-mono text-muted-foreground">{slider.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-border bg-card">
                <div className="p-8 sm:p-10" style={{ backgroundColor: color.hex, color: color.textColor }}>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] opacity-75 mb-3">Live Preview</p>
                  <h3 className="text-3xl font-black tracking-tight mb-2">{color.hex}</h3>
                  <p className="max-w-2xl text-sm leading-relaxed opacity-90">
                    {color.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 border-t border-border">
                  {[
                    { label: "HEX", value: color.hex, copy: color.hex },
                    { label: "Short HEX", value: color.shortHex ?? "Not available", copy: color.shortHex ?? color.hex },
                    { label: "CSS RGB", value: color.cssRgb, copy: color.cssRgb },
                    { label: "CSS HSL", value: color.cssHsl, copy: color.cssHsl },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => copyValue(item.label, item.copy)}
                      className="border-r last:border-r-0 border-border p-4 text-left hover:bg-muted/40 transition-colors"
                    >
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground mb-2">{item.label}</p>
                      <p className="text-sm font-mono font-bold text-foreground break-all">{item.value}</p>
                      <p className="mt-3 text-xs font-semibold text-blue-600">
                        {copiedLabel === item.label ? "Copied" : "Click to copy"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Suggested Shade Ramp</p>
                    <button onClick={() => copyValue("CSS Variables", color.cssVarBlock)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === "CSS Variables" ? "Copied" : "Copy CSS"}
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(color.shades).map(([shade, hex]) => (
                      <div key={shade} className="rounded-xl overflow-hidden border border-border">
                        <div className="h-20" style={{ backgroundColor: hex }} />
                        <div className="p-2">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">#{shade}</p>
                          <p className="mt-1 text-[11px] font-mono font-bold text-foreground">{hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
                    <code>{color.cssVarBlock}</code>
                  </pre>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Channel Summary</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "R", value: color.red, accent: "text-rose-600" },
                        { label: "G", value: color.green, accent: "text-emerald-600" },
                        { label: "B", value: color.blue, accent: "text-blue-600" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3 text-center">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                          <p className={`mt-1 text-xl font-black ${item.accent}`}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">HSL Interpretation</p>
                    <div className="space-y-2">
                      {[
                        { label: "Hue", value: `${color.hsl.h}deg` },
                        { label: "Saturation", value: `${color.hsl.s}%` },
                        { label: "Lightness", value: `${color.hsl.l}%` },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <span className="text-sm font-bold text-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Formula Snippet</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Convert each channel to a two-digit hexadecimal pair, then join them in `#RRGGBB` order. Example: `rgb(37, 99, 235)` becomes `25`, `63`, `EB`, which produces <span className="font-mono font-bold text-foreground">#2563EB</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        {
          title: "Enter each RGB channel as a number between 0 and 255",
          description:
            "RGB stands for red, green, and blue. Every channel in the converter accepts whole numbers from 0 through 255, which mirrors how browsers, design tools, and front-end frameworks represent digital color. You can type directly into the numeric inputs if you already know the exact channel values, or use the sliders when you want to explore shades visually and watch the HEX code update in real time.",
        },
        {
          title: "Use the live preview to validate the color before copying code",
          description:
            "The preview panel is more than decoration. It gives you immediate feedback about how the resulting color actually feels on screen, whether it reads as a strong accent, a muted neutral, or a bright interface color. This is useful when you are translating values from design software, reproducing a brand color, or checking whether a manually entered RGB combination matches what you expected.",
        },
        {
          title: "Copy the format that matches your workflow",
          description:
            "Most people arrive here for the HEX output, but the page also exposes shorthand HEX when a shorter code exists, plus CSS-ready RGB and HSL strings. That matters in real projects because some teams standardize on HEX tokens, others keep RGB for animation or opacity work, and many designers prefer to reason about hue and lightness in HSL while still shipping HEX to production.",
        },
        {
          title: "Reuse the generated shade ramp and CSS variables for internal consistency",
          description:
            "The built-in shade block is designed for practical UI work. Once you find the right base color, you can copy a starter variable map and reuse it for buttons, cards, highlights, badges, hover states, or lighter section backgrounds. That is a faster path than manually hunting for five related tints every time you need a simple color system for a landing page or product interface.",
        },
      ]}
      interpretationCards={[
        {
          title: "A shorthand HEX result means the color compresses cleanly",
          description:
            "If the converter shows a three-character HEX code such as #0AF, each RGB pair is made from identical digits. That shorthand is functionally equivalent to the six-character version and is safe to use anywhere standard CSS accepts HEX colors.",
        },
        {
          title: "Low saturation means the color behaves more like a neutral utility tone",
          description:
            "When saturation drops close to zero, the color loses hue intensity and starts acting like gray, charcoal, or off-white depending on lightness. These tones are often better for body text, borders, dividers, and surfaces than for high-emphasis branding moments.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "High lightness usually needs darker text for accessibility",
          description:
            "Very light colors can look attractive as surfaces, but they usually need dark foreground text to remain readable. The preview uses an automatic readable text suggestion so you can spot whether the color is better suited to a background role or an accent role.",
          className: "bg-violet-500/5 border-violet-500/20",
        },
        {
          title: "HEX is concise, but RGB remains useful in production code",
          description:
            "HEX is ideal for tokens, style guides, and component props because it is compact and familiar. RGB is still valuable when you need alpha channels, interpolation, filters, canvas work, or programmatic color transformations, which is why this page exposes both formats side by side instead of forcing one notation.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Tailwind blue token", input: "rgb(37, 99, 235)", output: "#2563EB" },
        { scenario: "Warning orange", input: "rgb(249, 115, 22)", output: "#F97316" },
        { scenario: "Soft neutral card", input: "rgb(241, 245, 249)", output: "#F1F5F9" },
        { scenario: "Pure white surface", input: "rgb(255, 255, 255)", output: "#FFFFFF" },
      ]}
      whyChoosePoints={[
        "This RGB to HEX converter is built for the way developers and designers actually work. It does not stop at one raw conversion output. It gives you the exact HEX code, detects shorthand when available, exposes HSL, preserves the original RGB string, and surfaces a preview that helps you judge whether the result belongs in a button, hero section, border, chart, or text style. That makes the tool practical for real interface work rather than a one-line novelty utility.",
        "The page is useful for on-page SEO and product quality because color systems affect how readable and scannable a website feels. Better color decisions can improve engagement signals indirectly by making important actions clearer, creating stronger section hierarchy, and reducing friction around navigation, calls to action, and visual emphasis. A converter like this supports that process by making it easier to move from raw design values into consistent production tokens quickly.",
        "Internal linking is part of the workflow here instead of an afterthought. Once you convert RGB to HEX, you can move directly into the related HEX to RGB Converter, Color Picker, Color Contrast Checker, CSS Gradient Generator, and Color Palette Generator to keep refining the same color. That is closer to how modern teams work across design inspection, token definition, accessibility checks, and final CSS implementation.",
        "The built-in shade suggestions help bridge the gap between a single chosen color and a usable design system. Many competing converters stop after returning one HEX value, which means you still need another tool or manual experimentation to build supporting tones. Here, you get a quick variable block that can seed a landing page, admin UI, component library, marketing section, or starter Tailwind theme immediately.",
        "Everything runs entirely in the browser, so it stays fast and private. No uploaded files, no accounts, and no stored project data. That matters if you are working on unreleased brand systems, client redesigns, product themes, or internal dashboards where even seemingly harmless color references should stay local to your machine.",
      ]}
      faqs={[
        {
          q: "How do you convert RGB to HEX manually?",
          a: "Convert each channel from base 10 into a two-digit hexadecimal pair, then join the pairs in red-green-blue order. For example, red 37 becomes 25 in hex, green 99 becomes 63, and blue 235 becomes EB. Put those together and you get #2563EB. If any channel converts to a single hexadecimal digit, add a leading zero so every pair stays two characters long.",
        },
        {
          q: "What RGB range is valid for web colors?",
          a: "Each channel must stay between 0 and 255 inclusive. Zero means no intensity for that color channel, while 255 means full intensity. Browsers, canvas APIs, design tools, and CSS color functions all use that same range, so if you stay inside it, the output is standard and safe to use anywhere typical front-end code accepts RGB or HEX values.",
        },
        {
          q: "When does a three-digit HEX code exist?",
          a: "A shorthand three-digit HEX code exists only when each two-digit channel pair repeats the same character, such as FF, 00, or AA. In those cases #FF00AA can be shortened to #F0A. If even one pair does not repeat, the color must stay in six-digit form. The converter checks that automatically and only shows shorthand when it is truly equivalent.",
        },
        {
          q: "Is HEX better than RGB for CSS?",
          a: "Neither format is universally better. HEX is compact and widely used for tokens, theme files, docs, and component props. RGB is often better when you need transparency, animated interpolation, or direct control over channel math. Most real-world CSS codebases use both, which is why this page gives you multiple output formats instead of pretending one notation solves every problem.",
        },
        {
          q: "Why does this converter also show HSL?",
          a: "HSL helps you interpret the result instead of just copying it. Hue tells you roughly where the color sits on the wheel, saturation tells you how vivid or muted it is, and lightness tells you whether it behaves more like a dark accent, middle-value brand color, or pale surface color. That makes HSL useful when adjusting design direction after you have already converted from RGB to HEX.",
        },
        {
          q: "Can I use this RGB to HEX converter for Tailwind or design tokens?",
          a: "Yes. The HEX output works well in Tailwind config files, CSS variables, design token JSON, Figma handoff notes, SCSS maps, and component libraries. The extra shade suggestions on this page are especially useful when you need a quick starter ramp around the chosen base color before you fine-tune a more complete palette.",
        },
        {
          q: "Is the conversion accurate enough for production use?",
          a: "Yes. RGB to HEX conversion is deterministic and exact as long as the channels are valid integers from 0 to 255. There is no estimation involved in the core conversion step. The only rounding in this tool appears in the derived HSL interpretation and generated tint suggestions, not in the main HEX result itself.",
        },
        {
          q: "What should I do after converting a color?",
          a: "If you only needed the HEX code, copy it and move on. If you are building a real UI, the next useful step is usually checking the color in the Color Contrast Checker, generating supporting tones in the Color Palette Generator, or converting the same value back through HEX to RGB when working across different CSS functions, JavaScript logic, or design tooling constraints.",
        },
      ]}
      relatedTools={[
        { title: "HEX to RGB Converter", slug: "hex-to-rgb-converter", icon: <Pipette className="w-4 h-4" />, color: 280, benefit: "Convert HEX values back into channel numbers" },
        { title: "Color Picker", slug: "color-picker", icon: <Palette className="w-4 h-4" />, color: 170, benefit: "Inspect and refine color values visually" },
        { title: "Color Contrast Checker", slug: "color-contrast-checker", icon: <Type className="w-4 h-4" />, color: 330, benefit: "Test readability against backgrounds" },
        { title: "Color Palette Generator", slug: "color-palette-generator", icon: <SlidersHorizontal className="w-4 h-4" />, color: 217, benefit: "Build supporting shades and accents" },
        { title: "CSS Gradient Generator", slug: "css-gradient-generator", icon: <RefreshCw className="w-4 h-4" />, color: 25, benefit: "Use your color in backgrounds and hero sections" },
        { title: "Meta Tag Generator", slug: "meta-tag-generator", icon: <Copy className="w-4 h-4" />, color: 45, benefit: "Polish metadata once the page design is ready" },
      ]}
      ctaTitle="Need More CSS & Design Tools?"
      ctaDescription="Keep refining the same color system with format converters, contrast checks, palette building, and production-ready CSS helpers."
      ctaHref="/category/css-design"
    />
  );
}
