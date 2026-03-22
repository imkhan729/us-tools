import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  Lightbulb, Copy, Check, Palette, Hash, Pipette,
  Eye, RefreshCw, Code2, Lock, Globe, Type,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Converter Logic ──
type Mode = "hex-to-rgb" | "rgb-to-hex";

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

function hexToRgb(hex: string): RgbColor | null {
  let cleaned = hex.replace(/^#/, "").trim();
  if (/^[0-9A-Fa-f]{3}$/.test(cleaned)) {
    cleaned = cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2];
  }
  if (!/^[0-9A-Fa-f]{6}$/.test(cleaned)) return null;
  return {
    r: parseInt(cleaned.substring(0, 2), 16),
    g: parseInt(cleaned.substring(2, 4), 16),
    b: parseInt(cleaned.substring(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): HslColor {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function useColorConverter() {
  const [mode, setMode] = useState<Mode>("hex-to-rgb");
  const [hexInput, setHexInput] = useState("");
  const [rInput, setRInput] = useState("");
  const [gInput, setGInput] = useState("");
  const [bInput, setBInput] = useState("");

  const result = useMemo(() => {
    if (mode === "hex-to-rgb") {
      const rgb = hexToRgb(hexInput);
      if (!rgb) return null;
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      return { rgb, hsl, hex };
    } else {
      const r = parseInt(rInput);
      const g = parseInt(gInput);
      const b = parseInt(bInput);
      if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
      if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) return null;
      const hsl = rgbToHsl(r, g, b);
      const hex = rgbToHex(r, g, b);
      return { rgb: { r, g, b }, hsl, hex };
    }
  }, [mode, hexInput, rInput, gInput, bInput]);

  return { mode, setMode, hexInput, setHexInput, rInput, setRInput, gInput, setGInput, bInput, setBInput, result };
}

// ── Result Insight Component ──
function ResultInsight({ result }: { result: { rgb: RgbColor; hsl: HslColor; hex: string } | null }) {
  if (!result) return null;

  const { rgb, hsl, hex } = result;
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  const tone = brightness > 186 ? "light" : brightness > 80 ? "medium" : "dark";
  const warmCool = hsl.h >= 0 && hsl.h < 60 ? "warm" : hsl.h >= 60 && hsl.h < 180 ? "cool" : hsl.h >= 180 && hsl.h < 270 ? "cool" : "warm";

  const message = `The color ${hex} is a ${tone}, ${warmCool}-toned color with an RGB breakdown of (${rgb.r}, ${rgb.g}, ${rgb.b}) and HSL values of (${hsl.h}\u00B0, ${hsl.s}%, ${hsl.l}%). ${hsl.s < 10 ? "This is an achromatic (grayscale) color with very low saturation." : `It has ${hsl.s > 70 ? "high" : hsl.s > 30 ? "moderate" : "low"} saturation, making it appear ${hsl.s > 70 ? "vivid and vibrant" : hsl.s > 30 ? "balanced and natural" : "muted and subtle"}.`}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary">
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
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Color Converter", slug: "color-converter", icon: <Palette className="w-5 h-5" />, color: 280 },
  { title: "CSS Gradient Generator", slug: "css-gradient-generator", icon: <Pipette className="w-5 h-5" />, color: 320 },
  { title: "Password Generator", slug: "password-generator", icon: <Lock className="w-5 h-5" />, color: 217 },
  { title: "Base64 Encoder Decoder", slug: "base64-encoder-decoder", icon: <Code2 className="w-5 h-5" />, color: 152 },
  { title: "Lorem Ipsum Generator", slug: "lorem-ipsum-generator", icon: <Type className="w-5 h-5" />, color: 25 },
  { title: "Meta Tag Generator", slug: "meta-tag-generator", icon: <Globe className="w-5 h-5" />, color: 45 },
];

// ── Main Component ──
export default function HexToRgbConverter() {
  const conv = useColorConverter();
  const [copied, setCopied] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyValue = (value: string, format: string) => {
    navigator.clipboard.writeText(value);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const CopyBtn = ({ value, format }: { value: string; format: string }) => (
    <button
      onClick={() => copyValue(value, format)}
      className="ml-2 p-1.5 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
      title={`Copy ${format}`}
    >
      {copiedFormat === format
        ? <Check className="w-3.5 h-3.5 text-emerald-500" />
        : <Copy className="w-3.5 h-3.5 text-muted-foreground" />
      }
    </button>
  );

  return (
    <Layout>
      <SEO
        title="HEX to RGB Converter - Free Online Color Converter | HEX RGB HSL"
        description="Free online HEX to RGB converter. Convert hex color codes to RGB and HSL values instantly. Bidirectional conversion, color preview, copy CSS values. No signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/css-design" className="text-muted-foreground hover:text-foreground transition-colors">CSS & Design Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">HEX to RGB Converter</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* ── 1. PAGE HEADER ── */}
            <section>
              <div className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Palette className="w-3.5 h-3.5" />
                CSS & Design Tools
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">
                HEX to RGB Converter
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Convert HEX color codes to RGB and HSL values instantly. Supports bidirectional conversion, 3-digit and 6-digit hex codes, live color preview, and one-click CSS copying — free, instant, and no signup needed.
              </p>
            </section>

            {/* ── 2. QUICK ACTION ── */}
            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Get instant results</p>
                <p className="text-muted-foreground text-sm">Enter a HEX or RGB value below — results update as you type. No button needed.</p>
              </div>
            </section>

            {/* ── 3. TOOL SECTION ── */}
            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 280 } as React.CSSProperties}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="tool-calc-number">1</div>
                    <h3 className="text-lg font-bold text-foreground">Color Converter</h3>
                  </div>
                  {/* Mode Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => conv.setMode("hex-to-rgb")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${conv.mode === "hex-to-rgb" ? "bg-purple-500/15 text-purple-600 dark:text-purple-400" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      HEX &rarr; RGB
                    </button>
                    <button
                      onClick={() => conv.setMode("rgb-to-hex")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${conv.mode === "rgb-to-hex" ? "bg-purple-500/15 text-purple-600 dark:text-purple-400" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      RGB &rarr; HEX
                    </button>
                  </div>
                </div>

                {/* Input */}
                {conv.mode === "hex-to-rgb" ? (
                  <div className="mb-5">
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">HEX Color Code</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono font-bold">#</span>
                      <input
                        type="text"
                        placeholder="FF5733"
                        maxLength={7}
                        className="tool-calc-input w-full pl-8 font-mono uppercase"
                        value={conv.hexInput}
                        onChange={e => conv.setHexInput(e.target.value.replace(/^#/, ""))}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">Supports 3-digit (#F00) and 6-digit (#FF0000) hex codes</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Red (0-255)</label>
                      <input
                        type="number"
                        placeholder="255"
                        min={0}
                        max={255}
                        className="tool-calc-input w-full font-mono"
                        value={conv.rInput}
                        onChange={e => conv.setRInput(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Green (0-255)</label>
                      <input
                        type="number"
                        placeholder="87"
                        min={0}
                        max={255}
                        className="tool-calc-input w-full font-mono"
                        value={conv.gInput}
                        onChange={e => conv.setGInput(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Blue (0-255)</label>
                      <input
                        type="number"
                        placeholder="51"
                        min={0}
                        max={255}
                        className="tool-calc-input w-full font-mono"
                        value={conv.bInput}
                        onChange={e => conv.setBInput(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Color Preview Swatch */}
                <div className="mb-5">
                  <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Color Preview</label>
                  <div
                    className="w-full h-24 rounded-xl border-2 border-border transition-colors"
                    style={{
                      backgroundColor: conv.result ? conv.result.hex : "#E5E7EB",
                    }}
                  />
                </div>

                {/* Results */}
                <div className="space-y-3">
                  {/* RGB Values */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="tool-calc-result text-center">
                      <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Red</div>
                      <div className="text-lg font-black text-red-600 dark:text-red-400">
                        {conv.result ? conv.result.rgb.r : "--"}
                      </div>
                    </div>
                    <div className="tool-calc-result text-center">
                      <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Green</div>
                      <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                        {conv.result ? conv.result.rgb.g : "--"}
                      </div>
                    </div>
                    <div className="tool-calc-result text-center">
                      <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Blue</div>
                      <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                        {conv.result ? conv.result.rgb.b : "--"}
                      </div>
                    </div>
                  </div>

                  {/* HSL Values */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="tool-calc-result text-center">
                      <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Hue</div>
                      <div className="text-lg font-black text-purple-600 dark:text-purple-400">
                        {conv.result ? `${conv.result.hsl.h}\u00B0` : "--"}
                      </div>
                    </div>
                    <div className="tool-calc-result text-center">
                      <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Saturation</div>
                      <div className="text-lg font-black text-purple-600 dark:text-purple-400">
                        {conv.result ? `${conv.result.hsl.s}%` : "--"}
                      </div>
                    </div>
                    <div className="tool-calc-result text-center">
                      <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Lightness</div>
                      <div className="text-lg font-black text-purple-600 dark:text-purple-400">
                        {conv.result ? `${conv.result.hsl.l}%` : "--"}
                      </div>
                    </div>
                  </div>

                  {/* CSS Strings with Copy Buttons */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">HEX</div>
                        <code className="text-sm font-mono font-bold text-foreground">{conv.result ? conv.result.hex : "--"}</code>
                      </div>
                      {conv.result && <CopyBtn value={conv.result.hex} format="hex" />}
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">CSS RGB</div>
                        <code className="text-sm font-mono font-bold text-foreground">
                          {conv.result ? `rgb(${conv.result.rgb.r}, ${conv.result.rgb.g}, ${conv.result.rgb.b})` : "--"}
                        </code>
                      </div>
                      {conv.result && <CopyBtn value={`rgb(${conv.result.rgb.r}, ${conv.result.rgb.g}, ${conv.result.rgb.b})`} format="rgb" />}
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">CSS HSL</div>
                        <code className="text-sm font-mono font-bold text-foreground">
                          {conv.result ? `hsl(${conv.result.hsl.h}, ${conv.result.hsl.s}%, ${conv.result.hsl.l}%)` : "--"}
                        </code>
                      </div>
                      {conv.result && <CopyBtn value={`hsl(${conv.result.hsl.h}, ${conv.result.hsl.s}%, ${conv.result.hsl.l}%)`} format="hsl" />}
                    </div>
                  </div>
                </div>

                <ResultInsight result={conv.result} />
              </div>
            </section>

            {/* ── 5. HOW IT WORKS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How It Works</h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Parse the HEX Code</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">The 6-digit hex code is split into three pairs: <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">#RRGGBB</code>. Each pair represents a color channel (Red, Green, Blue) in base-16. For 3-digit shorthand like <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">#F0A</code>, each digit is doubled to <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">#FF00AA</code>.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Convert to Decimal (RGB)</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Each hex pair is converted from base-16 to base-10 to produce values between 0 and 255. For example, <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">#FF5733</code> becomes R: 255, G: 87, B: 51 because FF=255, 57=87, 33=51.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Calculate HSL Values</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">The RGB values are normalized to 0-1 range, then the hue (0-360), saturation (0-100%), and lightness (0-100%) are calculated using standard color space conversion formulas. HSL is often more intuitive for designers working with color relationships.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 6. REAL-LIFE EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: "#FF5733" }} />
                    <h4 className="font-bold text-foreground text-sm">Vibrant Orange-Red</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed"><code className="font-mono text-xs">#FF5733</code> converts to <strong className="text-foreground">rgb(255, 87, 51)</strong> and <strong className="text-foreground">hsl(11, 100%, 60%)</strong>. Popular in call-to-action buttons and warning elements.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: "#3498DB" }} />
                    <h4 className="font-bold text-foreground text-sm">Flat Blue</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed"><code className="font-mono text-xs">#3498DB</code> converts to <strong className="text-foreground">rgb(52, 152, 219)</strong> and <strong className="text-foreground">hsl(204, 70%, 53%)</strong>. A go-to blue for web interfaces and dashboards.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: "#2ECC71" }} />
                    <h4 className="font-bold text-foreground text-sm">Emerald Green</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed"><code className="font-mono text-xs">#2ECC71</code> converts to <strong className="text-foreground">rgb(46, 204, 113)</strong> and <strong className="text-foreground">hsl(145, 63%, 49%)</strong>. Widely used for success states and confirmation messages.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: "#9B59B6" }} />
                    <h4 className="font-bold text-foreground text-sm">Amethyst Purple</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed"><code className="font-mono text-xs">#9B59B6</code> converts to <strong className="text-foreground">rgb(155, 89, 182)</strong> and <strong className="text-foreground">hsl(283, 39%, 53%)</strong>. Perfect for creative branding and accent elements.</p>
                </div>
              </div>
            </section>

            {/* ── 7. BENEFITS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Converter?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Instant color conversion as you type" },
                  { icon: <RefreshCw className="w-4 h-4" />, text: "Bidirectional: HEX to RGB and RGB to HEX" },
                  { icon: <Eye className="w-4 h-4" />, text: "Live color preview swatch" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Works perfectly on mobile devices" },
                  { icon: <Shield className="w-4 h-4" />, text: "No data collection or tracking" },
                  { icon: <Clock className="w-4 h-4" />, text: "No signup or downloads required" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 9. SEO CONTENT ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Understanding HEX and RGB Color Codes</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  HEX and RGB are two of the most commonly used color formats in web development, graphic design, and digital media. A HEX color code is a six-character (or three-character shorthand) hexadecimal representation of a color, prefixed with a hash symbol (#). An RGB color value specifies the intensity of Red, Green, and Blue channels, each ranging from 0 to 255. Both formats describe the same colors but in different notations.
                </p>
                <p>
                  This free online hex to rgb converter instantly translates any HEX color code into its RGB equivalent, along with the HSL (Hue, Saturation, Lightness) representation. Whether you are a web developer writing CSS, a designer matching brand colors, or a student learning about color theory, this tool gives you accurate conversions with a live color preview and one-click CSS code copying.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">When Do You Need a HEX to RGB Converter?</h3>
                <p>
                  Designers and developers frequently need to convert between color formats. CSS supports both HEX and RGB notation, but certain situations call for one over the other. RGB is preferred when you need to programmatically adjust individual color channels or apply opacity using RGBA. HEX is the standard shorthand used in design tools like Figma, Sketch, and Adobe XD. HSL is favored when you want to intuitively adjust a color's brightness or saturation.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">Common Use Cases for Color Conversion</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Converting brand color HEX codes to RGB for CSS stylesheets and JavaScript",
                    "Translating design mockup colors from Figma or Sketch into code-ready values",
                    "Adjusting color opacity by converting HEX to RGBA format",
                    "Matching colors across different platforms that use different color notations",
                    "Generating accessible color palettes with proper contrast ratios",
                    "Learning color theory by exploring the relationship between HEX, RGB, and HSL",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ── 10. FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="What is the difference between HEX and RGB color codes?"
                  a="HEX uses a six-character hexadecimal string (e.g., #FF5733) to represent colors, while RGB uses three decimal numbers from 0 to 255 (e.g., rgb(255, 87, 51)). Both describe the same colors using Red, Green, and Blue channels — HEX is base-16 notation and RGB is base-10."
                />
                <FaqItem
                  q="How do I convert a 3-digit HEX code to RGB?"
                  a="A 3-digit HEX code is shorthand where each digit is doubled. For example, #F0A becomes #FF00AA. Each pair is then converted to decimal: FF=255, 00=0, AA=170, giving you rgb(255, 0, 170)."
                />
                <FaqItem
                  q="What is HSL and why is it included?"
                  a="HSL stands for Hue, Saturation, and Lightness. Hue is the color angle (0-360 degrees), Saturation is the color intensity (0-100%), and Lightness is the brightness (0-100%). HSL is included because it is more intuitive for adjusting colors — you can easily make a color lighter, darker, or more muted by changing one value."
                />
                <FaqItem
                  q="Can I convert RGB back to HEX?"
                  a="Yes! This tool supports bidirectional conversion. Click the 'RGB to HEX' toggle at the top of the converter to switch modes. Enter your R, G, and B values (0-255 each) and get the HEX code instantly."
                />
                <FaqItem
                  q="Are the conversions accurate?"
                  a="Yes, the conversions are mathematically exact. HEX to RGB conversion is a direct base-16 to base-10 translation with no rounding. HSL values are calculated using the standard color space algorithm and rounded to the nearest integer for readability."
                />
                <FaqItem
                  q="Is this converter free to use?"
                  a="100% free with no ads, no signup, and no data collection. The converter runs entirely in your browser — your color values never leave your device."
                />
              </div>
            </section>

            {/* ── 11. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Design Tools?</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">
                  Explore 400+ free tools including CSS gradient generators, color palette builders, contrast checkers, and more — all free, all instant.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* ── 8. RELATED TOOLS ── */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={getToolPath(tool.slug)}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                        {tool.title}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help others convert colors easily.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              {/* Quick Links */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">On This Page</h3>
                <div className="space-y-1.5">
                  {["Converter", "How It Works", "Examples", "Benefits", "FAQ"].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-medium py-1 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
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
