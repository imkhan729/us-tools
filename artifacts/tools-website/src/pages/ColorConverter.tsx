import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getCanonicalToolPath } from "@/data/tools";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Palette, Copy, Check, Hash as HashIcon,
  ArrowRight, Zap, Smartphone, Shield, BadgeCheck, Lock,
  Calculator, Star, Lightbulb, Pipette,
} from "lucide-react";

// ── Color Conversion Logic ──
const hexToRgb = (hex: string) => {
  const sanitized = hex.replace(/^#/, "");
  if (sanitized.length !== 6) return null;
  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number) => {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
};

const rgbToHsl = (r: number, g: number, b: number) => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    if (max === rn) {
      h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      h = (bn - rn) / delta + 2;
    } else {
      h = (rn - gn) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-purple-500/40 transition-colors">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-purple-500"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Color Palette Generator", slug: "color-palette-generator", icon: <Palette className="w-4 h-4" />, color: 275, benefit: "Generate harmonious color palettes" },
  { title: "Contrast Checker", slug: "contrast-checker", icon: <Shield className="w-4 h-4" />, color: 217, benefit: "Check WCAG color contrast ratio" },
  { title: "Gradient Generator", slug: "gradient-generator", icon: <Pipette className="w-4 h-4" />, color: 340, benefit: "Create CSS gradients visually" },
  { title: "Image Color Picker", slug: "image-color-picker", icon: <HashIcon className="w-4 h-4" />, color: 45, benefit: "Pick colors from any image" },
  { title: "CSS Formatter", slug: "css-formatter", icon: <Calculator className="w-4 h-4" />, color: 152, benefit: "Format and minify CSS instantly" },
  { title: "Base64 Encoder", slug: "base64-encoder", icon: <Zap className="w-4 h-4" />, color: 25, benefit: "Encode images and text to Base64" },
];

// ── Main Component ──
export default function ColorConverter() {
  const [hex, setHex] = useState("#00E5FF");
  const [rgb, setRgb] = useState({ r: 0, g: 229, b: 255 });
  const [hsl, setHsl] = useState({ h: 186, s: 100, l: 50 });
  const [isValid, setIsValid] = useState(true);

  const [copiedHex, setCopiedHex] = useState(false);
  const [copiedRgb, setCopiedRgb] = useState(false);
  const [copiedHsl, setCopiedHsl] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleHexChange = (value: string) => {
    const normalized = value.startsWith("#") ? value : `#${value}`;
    setHex(normalized);
    const parsed = hexToRgb(normalized);
    if (parsed) {
      setRgb(parsed);
      setHsl(rgbToHsl(parsed.r, parsed.g, parsed.b));
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const copyToClipboard = (text: string, field: "hex" | "rgb" | "hsl") => {
    navigator.clipboard.writeText(text).catch(() => {});
    if (field === "hex") {
      setCopiedHex(true);
      setTimeout(() => setCopiedHex(false), 2000);
    } else if (field === "rgb") {
      setCopiedRgb(true);
      setTimeout(() => setCopiedRgb(false), 2000);
    } else {
      setCopiedHsl(true);
      setTimeout(() => setCopiedHsl(false), 2000);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  useEffect(() => {
    handleHexChange("#00E5FF");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const displayHex = hex.startsWith("#") ? hex : `#${hex}`;

  // suppress unused warning — rgbToHex is part of the public API surface kept per spec
  void rgbToHex;

  return (
    <Layout>
      <SEO
        title="Color Converter – HEX to RGB to HSL Converter Free Online | US Online Tools"
        description="Free color converter. Convert colors between HEX, RGB, and HSL instantly. Enter any HEX code and get all three formats with one-click copy. Essential for web designers and developers."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-purple-500" strokeWidth={3} />
          <Link href="/category/developer" className="text-muted-foreground hover:text-foreground transition-colors">Design &amp; Developer Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-purple-500" strokeWidth={3} />
          <span className="text-foreground">Color Converter</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-purple-500/15 bg-gradient-to-br from-purple-500/5 via-card to-pink-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          {/* Category pill */}
          <div className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Palette className="w-3.5 h-3.5" />
            Design &amp; Developer Tools
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Color Converter
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Convert colors instantly between HEX, RGB, and HSL formats. Enter any HEX code and see all three formats simultaneously. Essential for web designers, developers, and UI/UX professionals.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs px-3 py-1.5 rounded-full border border-purple-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Conversion
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Shield className="w-3.5 h-3.5" /> 3 Formats
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>

          {/* Meta */}
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Design &amp; Developer Tools &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── 1. TOOL WIDGET ── */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-purple-500/20 shadow-lg shadow-purple-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-pink-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">

                  {/* Widget header */}
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center flex-shrink-0">
                      <Palette className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">HEX · RGB · HSL</p>
                      <p className="text-sm text-muted-foreground">Enter a HEX code — all formats update instantly.</p>
                    </div>
                  </div>

                  {/* Color preview swatch */}
                  <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div
                      className="relative h-32 w-full transition-colors duration-200 group"
                      style={{ backgroundColor: isValid ? displayHex : "#cccccc" }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                        <p className="font-mono font-bold text-white text-lg tracking-widest drop-shadow">
                          {isValid ? displayHex.toUpperCase() : "—"}
                        </p>
                        <p className="font-mono text-white/80 text-xs drop-shadow mt-1">
                          {isValid ? rgbString : ""}
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-muted/30 border-t border-border flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-border flex-shrink-0"
                        style={{ backgroundColor: isValid ? displayHex : "#ccc" }}
                      />
                      <p className="text-xs text-muted-foreground font-mono">
                        {isValid
                          ? `Preview — ${displayHex.toUpperCase()} · Hover to inspect`
                          : "Invalid color — check HEX input"}
                      </p>
                    </div>
                  </div>

                  {/* HEX Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      HEX Color Code
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <HashIcon className="w-4 h-4 text-pink-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={hex.replace(/^#/, "")}
                          onChange={(e) => handleHexChange(e.target.value)}
                          placeholder="00E5FF"
                          maxLength={7}
                          className="w-full pl-10 pr-4 py-4 text-xl font-mono bg-background border-2 border-border rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>
                      <button
                        onClick={() => copyToClipboard(displayHex.toUpperCase(), "hex")}
                        disabled={!isValid}
                        className="flex-shrink-0 w-12 h-14 flex items-center justify-center rounded-xl border-2 border-border bg-background hover:border-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title="Copy HEX"
                      >
                        {copiedHex ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    {!isValid && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500 font-medium"
                      >
                        Invalid Color Format — enter a valid 6-digit HEX code (e.g. FF5733)
                      </motion.p>
                    )}
                  </div>

                  {/* RGB Output */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      RGB Format
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-purple-500 flex-shrink-0 pointer-events-none" />
                        <input
                          type="text"
                          value={isValid ? rgbString : ""}
                          readOnly
                          placeholder="rgb(0, 229, 255)"
                          className="w-full pl-10 pr-4 py-4 text-xl font-mono bg-background border-2 border-border rounded-xl focus:outline-none focus:border-purple-500 transition-colors cursor-default text-muted-foreground"
                        />
                      </div>
                      <button
                        onClick={() => copyToClipboard(rgbString, "rgb")}
                        disabled={!isValid}
                        className="flex-shrink-0 w-12 h-14 flex items-center justify-center rounded-xl border-2 border-border bg-background hover:border-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title="Copy RGB"
                      >
                        {copiedRgb ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* HSL Output */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      HSL Format
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <div
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex-shrink-0 pointer-events-none"
                          style={{
                            background: isValid
                              ? `linear-gradient(135deg, hsl(${hsl.h}, 80%, 55%), hsl(${(hsl.h + 60) % 360}, 80%, 45%))`
                              : "#ccc",
                          }}
                        />
                        <input
                          type="text"
                          value={isValid ? hslString : ""}
                          readOnly
                          placeholder="hsl(186, 100%, 50%)"
                          className="w-full pl-10 pr-4 py-4 text-xl font-mono bg-background border-2 border-border rounded-xl focus:outline-none focus:border-purple-500 transition-colors cursor-default text-muted-foreground"
                        />
                      </div>
                      <button
                        onClick={() => copyToClipboard(hslString, "hsl")}
                        disabled={!isValid}
                        className="flex-shrink-0 w-12 h-14 flex items-center justify-center rounded-xl border-2 border-border bg-background hover:border-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        title="Copy HSL"
                      >
                        {copiedHsl ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* RGB channel breakdown bars */}
                  {isValid && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-3 gap-3 pt-2"
                    >
                      {[
                        { label: "Red", value: rgb.r, max: 255, color: "bg-red-500" },
                        { label: "Green", value: rgb.g, max: 255, color: "bg-emerald-500" },
                        { label: "Blue", value: rgb.b, max: 255, color: "bg-blue-500" },
                      ].map((ch) => (
                        <div key={ch.label} className="p-3 rounded-xl bg-muted/40 border border-border text-center">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{ch.label}</p>
                          <p className="text-xl font-black text-foreground font-mono">{ch.value}</p>
                          <div className="mt-2 h-1.5 rounded-full bg-border overflow-hidden">
                            <div
                              className={`h-full rounded-full ${ch.color} transition-all`}
                              style={{ width: `${(ch.value / ch.max) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </section>

            {/* ── 2. HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Color Converter</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                This tool converts any valid HEX color code into its RGB and HSL equivalents in a single step. Whether you're writing CSS, building a design system, or exploring color theory, here's how to get the most out of it.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter a HEX color code in the top field (e.g. #FF5733)</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Type or paste a 6-digit HEX code into the HEX input. You can include or omit the leading <code className="px-1 py-0.5 bg-muted rounded text-xs font-mono">#</code> — the tool handles both. HEX codes are the most common format in web development and are accepted by all major browsers and design tools including Figma, Sketch, and Adobe XD. Make sure your code is exactly 6 hexadecimal characters (0–9, A–F). Shorthand 3-digit codes like <code className="px-1 py-0.5 bg-muted rounded text-xs font-mono">#FFF</code> are not yet supported and will show an invalid format message.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">RGB and HSL values auto-populate instantly</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      As soon as you type a valid HEX code, the RGB and HSL fields update in real time — no button press needed. The color preview swatch at the top also updates immediately, giving you a live visual reference. The RGB channel breakdown bars at the bottom show each channel's proportion at a glance. If you enter an invalid code, the RGB and HSL fields will clear and you'll see an error message below the HEX input.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Click the copy icon next to any format to copy it to clipboard</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Each output field has its own copy button. Click it to copy that specific value — for example, <code className="px-1 py-0.5 bg-muted rounded text-xs font-mono">rgb(255, 87, 51)</code> or <code className="px-1 py-0.5 bg-muted rounded text-xs font-mono">hsl(14, 100%, 60%)</code> — directly to your clipboard, ready to paste into your stylesheet, design tool, or documentation. The button turns green briefly to confirm the copy was successful.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Color Format Reference</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <span className="text-purple-500 font-bold flex-shrink-0 mt-0.5">HEX</span>
                    <div>
                      <code className="px-2 py-1 bg-background rounded text-xs font-mono">#RRGGBB</code>
                      <span className="text-muted-foreground ml-2 text-xs">6-digit base-16, used in HTML/CSS</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <span className="text-pink-500 font-bold flex-shrink-0 mt-0.5">RGB</span>
                    <div>
                      <code className="px-2 py-1 bg-background rounded text-xs font-mono">rgb(R, G, B)</code>
                      <span className="text-muted-foreground ml-2 text-xs">0–255 per channel, used in CSS and image editors</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <span className="text-violet-500 font-bold flex-shrink-0 mt-0.5">HSL</span>
                    <div>
                      <code className="px-2 py-1 bg-background rounded text-xs font-mono">hsl(H, S%, L%)</code>
                      <span className="text-muted-foreground ml-2 text-xs">0–360 hue, 0–100% saturation and lightness, used for design systems</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 3. RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Categories &amp; Interpretation</h2>
              <p className="text-muted-foreground text-sm mb-6">How to read your HSL lightness value and apply it in UI design:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-500/5 border border-slate-500/20">
                  <div className="w-3 h-3 rounded-full bg-slate-800 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Low lightness (L &lt; 20%) — Very dark, near black</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Colors in this range are deep and near-black — ideal for text on light backgrounds, dark mode base surfaces, and primary navigation backgrounds. They provide maximum contrast against white or light-colored content and are a staple in dark UI design systems. Use sparingly as accent backgrounds to avoid visual heaviness on smaller UI elements.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <div className="w-3 h-3 rounded-full bg-purple-700 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Mid-low lightness (20–50%) — Deep, saturated tones</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">This range captures rich, saturated colors — think navy blues, deep purples, forest greens. They work exceptionally well as strong UI accents, primary action button backgrounds, active tab indicators, and focused states. These tones carry enough contrast against white text to meet WCAG AA accessibility standards in many cases, though you should always verify with a contrast checker.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-pink-500/5 border border-pink-500/20">
                  <div className="w-3 h-3 rounded-full bg-pink-400 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Mid-high lightness (50–80%) — Medium tones</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">The most versatile range for UI design — medium tones work as card backgrounds, hover states, sidebar fills, and badge colors. They're bright enough to be visually engaging but not so light that they disappear against white. This is where most "accent" and "secondary" color tokens in design systems live, since they balance vibrancy with readability across both light and dark themes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">High lightness (L &gt; 80%) — Light, near white</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Very light colors in this range are best used as subtle backgrounds, tinted surfaces, and hover overlays in light-mode interfaces. They're often called "tints" — the hue is still visible but significantly muted. Use them for frosted-glass effects, input field backgrounds, info banners, and code block backgrounds. Avoid using them for text or interactive elements where legibility is critical.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 p-4 rounded-xl bg-muted/40 border border-border">
                <Lightbulb className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> HSL lightness in this tool refers to the HSL color model, not perceptual lightness (which accounts for the human eye's unequal sensitivity to red, green, and blue). For perceptual lightness, consider tools that use the CIELAB or OKLCH color spaces. Alpha/opacity values are not supported in this version.
                </p>
              </div>
            </section>

            {/* ── 4. QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">HEX</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">RGB</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">HSL</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border border-border flex-shrink-0" style={{ backgroundColor: "#FF0000" }} />
                          <code className="font-mono text-foreground">#FF0000</code>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">rgb(255, 0, 0)</td>
                      <td className="px-4 py-3 font-mono text-purple-600 dark:text-purple-400 font-bold">hsl(0, 100%, 50%)</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Pure red</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border border-border flex-shrink-0" style={{ backgroundColor: "#00FF00" }} />
                          <code className="font-mono text-foreground">#00FF00</code>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">rgb(0, 255, 0)</td>
                      <td className="px-4 py-3 font-mono text-purple-600 dark:text-purple-400 font-bold">hsl(120, 100%, 50%)</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Pure green</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border border-border flex-shrink-0" style={{ backgroundColor: "#0000FF" }} />
                          <code className="font-mono text-foreground">#0000FF</code>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">rgb(0, 0, 255)</td>
                      <td className="px-4 py-3 font-mono text-purple-600 dark:text-purple-400 font-bold">hsl(240, 100%, 50%)</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Pure blue</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border border-border flex-shrink-0 bg-white" />
                          <code className="font-mono text-foreground">#FFFFFF</code>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">rgb(255, 255, 255)</td>
                      <td className="px-4 py-3 font-mono text-purple-600 dark:text-purple-400 font-bold">hsl(0, 0%, 100%)</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">White</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border border-border flex-shrink-0" style={{ backgroundColor: "#1A1A2E" }} />
                          <code className="font-mono text-foreground">#1A1A2E</code>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">rgb(26, 26, 46)</td>
                      <td className="px-4 py-3 font-mono text-purple-600 dark:text-purple-400 font-bold">hsl(240, 28%, 14%)</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Dark navy, dark mode bg</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Primary colors in all three formats:</strong> The first three rows illustrate the three primary light colors — red, green, and blue. In RGB, each is represented as a single channel at maximum (255) while the others are zero. In HSL, they map to hue angles of 0°, 120°, and 240° respectively — evenly spaced around the color wheel. These are the building blocks of the additive color model used in all digital screens.
                </p>
                <p>
                  <strong className="text-foreground">White (#FFFFFF) — a special case:</strong> White is the combination of all RGB channels at full intensity. In HSL, it has a lightness of 100% and a saturation of 0% — meaning hue is irrelevant since there's no color information present, only pure brightness. This is why white, black, and all grays always have 0% saturation in HSL regardless of their hue value.
                </p>
                <p>
                  <strong className="text-foreground">Dark navy (#1A1A2E) — real-world use case:</strong> This popular dark mode background color has very low lightness (14%) and moderate saturation (28%), giving it a subtle blue-purple tint that feels warmer and less harsh than pure black. It's widely used in developer-focused apps and dashboards as a primary background. The HSL representation makes it easy to create lighter or darker variants by adjusting the L value — a key advantage of the HSL format.
                </p>
                <p>
                  <strong className="text-foreground">Why convert between formats at all?</strong> Different tools and workflows expect different formats. HTML and most CSS properties accept HEX. CSS <code className="px-1 py-0.5 bg-muted rounded text-xs font-mono">color()</code> functions and canvas APIs often expect RGB. Design tokens and design systems frequently use HSL because it's the most intuitive for creating color scales — you can increment lightness in equal steps to build a full palette from a single base hue. This converter bridges those formats instantly.
                </p>
              </div>

              {/* Testimonial */}
              <div className="mt-6 p-5 rounded-xl bg-purple-500/5 border border-purple-500/15">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">
                  "I use this every day when moving between Figma and code. Copying the HSL value directly into my design tokens file saves so much time."
                </p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* ── 5. WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Color Converter?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">It's genuinely free — no strings attached.</strong> Many color tools online are free to open but quickly prompt you to register, disable an ad blocker, or subscribe for "pro" features like additional format support. This converter has no paywall, no advertisements, and no registration. Enter any HEX code and get your results immediately — every time, on any device.
                </p>
                <p>
                  <strong className="text-foreground">All three formats in one instant view.</strong> Most converters require you to select an output format from a dropdown or navigate between tabs. This tool shows HEX, RGB, and HSL simultaneously the moment you enter a color. If you're unsure which format you need — or need to supply the color in multiple formats to different team members — you see all three in one glance without any extra clicks.
                </p>
                <p>
                  <strong className="text-foreground">Copy per format with a single click.</strong> Each output field has its own dedicated copy button. Whether you need <code className="px-1 py-0.5 bg-muted rounded text-xs font-mono">rgb(255, 87, 51)</code> for a CSS animation or <code className="px-1 py-0.5 bg-muted rounded text-xs font-mono">hsl(14, 100%, 60%)</code> for a design token, click once and it's in your clipboard — formatted correctly, no manual editing required.
                </p>
                <p>
                  <strong className="text-foreground">Live color preview with channel breakdown.</strong> The full-color swatch at the top updates as you type, giving you an immediate visual sanity check. The RGB channel bars below show you exactly how much red, green, and blue contribute to the color — useful for color theory work, accessibility analysis, and building mental models of the RGB color space. Hover over the swatch to see the HEX and RGB values overlaid directly on the preview.
                </p>
                <p>
                  <strong className="text-foreground">Part of a 400+ tool ecosystem for designers and developers.</strong> This converter is one of hundreds of free tools spanning CSS utilities, image tools, developer encoders, and design helpers. All tools share the same design language, dark/light mode support, and keyboard-accessible layout. Once you've used one, the rest feel immediately familiar — making the whole suite a reliable daily companion for creative and technical work.
                </p>
              </div>

              {/* Note / Limitation */}
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> This tool converts HEX to RGB and HSL only. Alpha/opacity values (e.g. <code className="px-1 py-0.5 bg-muted rounded text-xs font-mono">#FF000080</code> or <code className="px-1 py-0.5 bg-muted rounded text-xs font-mono">rgba()</code>) are not supported in this version. Shorthand HEX codes (<code className="px-1 py-0.5 bg-muted rounded text-xs font-mono">#FFF</code>) must be expanded to 6 digits before entry. Results are computed using standard mathematical formulas and are accurate to integer precision for HSL and exact integer values for RGB channels.
                </p>
              </div>
            </section>

            {/* ── 6. FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="What is the difference between HEX and RGB?"
                  a="HEX and RGB represent the same color model (red, green, blue channels) but in different notations. HEX encodes each channel as two base-16 digits — for example, FF is 255, 80 is 128, 00 is 0. RGB expresses those same channel values as plain decimal numbers from 0 to 255. So #FF8000 and rgb(255, 128, 0) are identical colors — just written differently. HEX is preferred in HTML attributes and CSS, while RGB is common in canvas APIs, JavaScript color manipulation, and image processing libraries."
                />
                <FaqItem
                  q="When should I use HSL instead of RGB?"
                  a="HSL is best when you want to think about color intuitively. Because HSL separates hue, saturation, and lightness into independent values, it's easy to create color variants — for example, a full palette of blues at different lightness levels simply by incrementing the L value while keeping H and S fixed. This is why HSL is widely used in design systems and CSS custom properties. RGB is more natural when working directly with pixel data, image processing, or graphics APIs that deal in raw channel values."
                />
                <FaqItem
                  q="Can I convert RGB to HEX?"
                  a="This tool currently converts in one direction only: HEX → RGB and HEX → HSL. If you need to convert RGB to HEX, you can use the mathematical inverse: take each channel value (0–255), convert it to base-16, and prefix the result with #. For example, rgb(255, 87, 51) → FF in hex is 255, 57 in hex is 87, 33 in hex is 51 → #FF5733. We plan to add reverse conversion (RGB and HSL input) in a future update."
                />
                <FaqItem
                  q="What does the # symbol mean in HEX colors?"
                  a="The # (hash) symbol is simply a prefix that signals to a browser or CSS parser that what follows is a hexadecimal color code. It carries no mathematical meaning — removing it gives the raw hex string (e.g. FF5733). In some contexts like SVG attributes or JavaScript strings, the # must be present; in others like CSS preprocessors or design tool color pickers, you can sometimes omit it. This tool accepts input both with and without the # prefix."
                />
                <FaqItem
                  q="Are shorthand HEX codes supported (e.g. #FFF)?"
                  a="Not currently. Shorthand HEX codes like #FFF (which expands to #FFFFFF) or #ABC (which expands to #AABBCC) must be manually expanded to the full 6-digit form before entering them. This is intentional to keep the conversion logic straightforward and unambiguous. A future version may add automatic shorthand expansion. In the meantime, doubling each digit of a 3-digit code gives the full 6-digit equivalent."
                />
                <FaqItem
                  q="Why does my HEX input show 'Invalid Color Format'?"
                  a="This message appears when the entered value doesn't form a valid 6-digit hexadecimal color code. Common causes include: entering only 3 or 5 digits, using characters outside 0–9 and A–F (such as G, H, or special symbols), pasting a color name like 'red' instead of its HEX equivalent, or accidentally including a space. Double-check that your code is exactly 6 characters of valid hex digits. Color names are not supported — use the HEX code directly."
                />
                <FaqItem
                  q="Can I convert CMYK or Pantone colors?"
                  a="Not directly with this tool, which focuses on the HEX/RGB/HSL triad used in web and screen design. CMYK (used in print) and Pantone (a proprietary spot color system) require separate conversion tables or formulas. For CMYK, you'd first convert to RGB using the standard formula, then paste the HEX equivalent here. For Pantone, you'd need Pantone's official color bridge references since Pantone colors don't have a one-to-one mathematical mapping to screen colors."
                />
                <FaqItem
                  q="Is this tool useful for Tailwind CSS or design tokens?"
                  a="Yes — particularly the HSL output. Tailwind CSS v3+ uses HSL-based CSS custom properties internally, and many design token systems (Style Dictionary, Token Studio, etc.) store colors as HSL for easy manipulation. The HEX output is directly usable in any Tailwind config file or CSS variable definition. The RGB output works well with Tailwind's opacity modifier syntax, which requires RGB channel values. This converter streamlines the workflow of translating a brand color swatch into all three formats needed by modern frontend tooling."
                />
              </div>
            </section>

            {/* ── 7. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Design Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore 400+ free tools including CSS utilities, gradient generators, contrast checkers, and more — all free, all instant, no account needed.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Related Tools */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={getCanonicalToolPath(tool.slug)}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-purple-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help designers and developers convert colors easily.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-500 to-pink-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copiedLink ? (
                    <><Check className="w-3.5 h-3.5" /> Copied!</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> Copy Link</>
                  )}
                </button>
              </div>

              {/* On This Page */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    "Color Converter",
                    "How to Use",
                    "Result Interpretation",
                    "Quick Examples",
                    "Why Choose This",
                    "FAQ",
                  ].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-purple-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-purple-500/40 flex-shrink-0" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
