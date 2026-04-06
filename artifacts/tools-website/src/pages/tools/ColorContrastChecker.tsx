import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  Edit3, Type, Maximize2, Layers, ShieldCheck, Palette,
  Star, BadgeCheck, Lock, RefreshCw,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── Color Math ──
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

function luminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1: string, hex2: string) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 1;
  const l1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-fuchsia-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-fuchsia-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Color Picker", slug: "color-picker", cat: "css-design", icon: <Palette className="w-5 h-5" />, color: 170, benefit: "Pick HEX, RGB, HSL colors" },
  { title: "CSS Gradient Generator", slug: "css-gradient-generator", cat: "css-design", icon: <Layers className="w-5 h-5" />, color: 320, benefit: "Create CSS gradients" },
  { title: "Box Shadow Generator", slug: "css-box-shadow-generator", cat: "css-design", icon: <Maximize2 className="w-5 h-5" />, color: 250, benefit: "Generate box shadows" },
  { title: "Border Radius Generator", slug: "border-radius-generator", cat: "css-design", icon: <Edit3 className="w-5 h-5" />, color: 200, benefit: "Preview border radius" },
];

// ── Main Component ──
export default function ColorContrastChecker() {
  const [textHex, setTextHex] = useState("#FFFFFF");
  const [bgHex, setBgHex] = useState("#8B5CF6");
  const [copied, setCopied] = useState(false);

  const contrast = useMemo(() => {
    let ratio = getContrastRatio(textHex, bgHex);
    if (isNaN(ratio)) ratio = 1;
    return parseFloat(ratio.toFixed(2));
  }, [textHex, bgHex]);

  const wcag = useMemo(() => ({
    aaNormal: contrast >= 4.5,
    aaLarge: contrast >= 3.0,
    aaaNormal: contrast >= 7.0,
    aaaLarge: contrast >= 4.5,
  }), [contrast]);

  const randomize = () => {
    const chars = "0123456789ABCDEF";
    let hex1 = "#", hex2 = "#";
    for (let i = 0; i < 6; i++) { hex1 += chars[Math.floor(Math.random() * 16)]; hex2 += chars[Math.floor(Math.random() * 16)]; }
    setTextHex(hex1); setBgHex(hex2);
  };

  const swap = () => { const temp = textHex; setTextHex(bgHex); setBgHex(temp); };

  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <Layout>
      <SEO
        title="Color Contrast Checker – WCAG Accessibility Validator, Free Online Tool | US Online Tools"
        description="Free online color contrast checker. Test WCAG 2.1 AA and AAA accessibility compliance with any foreground and background hex color combination. Instant ratio scoring, no signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-fuchsia-500" strokeWidth={3} />
          <Link href="/category/css-design" className="text-muted-foreground hover:text-foreground transition-colors">CSS &amp; Design</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-fuchsia-500" strokeWidth={3} />
          <span className="text-foreground">Color Contrast Checker</span>
        </nav>

        {/* ── HERO ── */}
        <section className="rounded-2xl overflow-hidden border border-fuchsia-500/15 bg-gradient-to-br from-fuchsia-500/5 via-card to-pink-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Edit3 className="w-3.5 h-3.5" /> CSS &amp; Design
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Color Contrast Checker</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Validate your typography's foreground-to-background contrast ratio against WCAG 2.1 AA and AAA standards. Ensure your designs are accessible to all users — including those with visual impairments.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 font-bold text-xs px-3 py-1.5 rounded-full border border-fuchsia-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: CSS &amp; Design &nbsp;·&nbsp; Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-fuchsia-500/20 shadow-lg shadow-fuchsia-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-fuchsia-500 to-pink-500" />
                <div className="bg-card p-6 md:p-8">
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center flex-shrink-0"><Edit3 className="w-4 h-4 text-white" /></div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">WCAG Contrast Validator</p>
                        <p className="text-sm text-muted-foreground">Pick colors to check — results update live.</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={swap} className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-fuchsia-500 transition-colors" title="Swap Colors"><RefreshCw className="w-4 h-4" /></button>
                      <button onClick={randomize} className="px-3 py-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-fuchsia-500 transition-colors text-xs font-bold">Random</button>
                    </div>
                  </div>

                  {/* Color Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-muted/40 p-5 rounded-xl border border-border">
                      <label className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest block">Text / Foreground</label>
                      <div className="flex items-center gap-4">
                        <input type="color" value={textHex.length === 7 ? textHex : "#FFFFFF"} onChange={e => setTextHex(e.target.value)} className="w-14 h-14 rounded-xl cursor-pointer flex-shrink-0 bg-transparent border-0 p-0" />
                        <input type="text" value={textHex} onChange={e => setTextHex(e.target.value)} className="tool-calc-input w-full font-mono uppercase text-lg h-12" maxLength={7} />
                      </div>
                    </div>
                    <div className="bg-muted/40 p-5 rounded-xl border border-border">
                      <label className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest block">Background</label>
                      <div className="flex items-center gap-4">
                        <input type="color" value={bgHex.length === 7 ? bgHex : "#FFFFFF"} onChange={e => setBgHex(e.target.value)} className="w-14 h-14 rounded-xl cursor-pointer flex-shrink-0 bg-transparent border-0 p-0" />
                        <input type="text" value={bgHex} onChange={e => setBgHex(e.target.value)} className="tool-calc-input w-full font-mono uppercase text-lg h-12" maxLength={7} />
                      </div>
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div className="p-8 rounded-2xl border border-border shadow-inner mb-6 transition-colors" style={{ backgroundColor: bgHex.length === 7 ? bgHex : "#000000" }}>
                    <div className="max-w-xl mx-auto text-center transition-colors" style={{ color: textHex.length === 7 ? textHex : "#FFFFFF" }}>
                      <h2 className="text-4xl font-black tracking-tight mb-3">Sample Display</h2>
                      <p className="text-base font-medium leading-relaxed opacity-90">This text previews how your color combination looks across heading and paragraph typography. Check for readability before using these colors in production.</p>
                    </div>
                  </div>

                  {/* WCAG Results */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 border border-border rounded-xl bg-card text-center">
                      <p className="text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-widest">Ratio</p>
                      <p className={`text-3xl font-black tracking-tight ${contrast < 3 ? "text-rose-500" : contrast < 4.5 ? "text-amber-500" : "text-emerald-500"}`}>{contrast}:1</p>
                    </div>
                    {[
                      { label: "AA Normal", pass: wcag.aaNormal, req: "4.5:1" },
                      { label: "AAA Normal", pass: wcag.aaaNormal, req: "7.0:1" },
                      { label: "AA Large", pass: wcag.aaLarge, req: "3.0:1" },
                    ].map(item => (
                      <div key={item.label} className={`p-4 rounded-xl border text-center ${item.pass ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"}`}>
                        <p className="text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-widest">{item.label}</p>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${item.pass ? "text-emerald-600 bg-emerald-500/20" : "text-rose-600 bg-rose-500/20"}`}>
                          {item.pass ? <><Check className="w-3 h-3" /> Pass</> : "Fail"} ({item.req})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Color Contrast Checker</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Ensuring accessible color contrast is a fundamental part of web design and a legal requirement under the Americans with Disabilities Act (ADA), the European Web Accessibility Directive, and Section 508 of the U.S. Rehabilitation Act. This tool makes compliance checking effortless — pick your colors and see instant pass/fail results.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Set your text (foreground) color</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Use the color picker or type a hex code directly (e.g., <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">#333333</code>). This represents the color of your body text, headings, links, or icons — any element rendered on top of the background.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Set your background color</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">This is the surface behind your text — a page background, card surface, or button fill. The contrast ratio measures the luminance difference between these two colors. You can click <strong className="text-foreground">Swap</strong> to quickly reverse the colors, or <strong className="text-foreground">Random</strong> to test arbitrary combinations.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Read the contrast ratio and WCAG pass/fail badges</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The tool shows the computed contrast ratio (from 1:1 to 21:1) and whether the combination passes WCAG <strong className="text-foreground">AA Normal</strong> (4.5:1), <strong className="text-foreground">AAA Normal</strong> (7.0:1), and <strong className="text-foreground">AA Large</strong> (3.0:1) thresholds. A live preview panel shows how the combination looks on actual heading and paragraph text.</p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Algorithm</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm"><span className="text-fuchsia-500 font-bold w-20 flex-shrink-0">Luminance</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">0.2126 × R + 0.7152 × G + 0.0722 × B (linearised)</code></div>
                  <div className="flex items-center gap-3 text-sm"><span className="text-fuchsia-500 font-bold w-20 flex-shrink-0">Ratio</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">(Lighter L + 0.05) ÷ (Darker L + 0.05)</code></div>
                </div>
              </div>
            </section>

            {/* ── RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">WCAG Levels Explained</h2>
              <p className="text-muted-foreground text-sm mb-6">What each compliance level means in practice:</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Level AA — The Legal Baseline (4.5:1 normal, 3:1 large text)</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">This is the minimum standard required by most accessibility laws worldwide. Normal text (under 18pt, or under 14pt bold) must meet 4.5:1. Large text (18pt+ or 14pt+ bold) gets a more lenient 3.0:1 threshold because bigger characters are easier to read. Nearly all commercial websites should meet AA.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Level AAA — The Gold Standard (7:1 normal, 4.5:1 large text)</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">AAA is the highest accessibility tier. It is required for government portals, healthcare interfaces, and applications specifically targeting users with low vision. Meeting AAA for all text on a site is ideal but not always practical, especially with brand colors that tend toward mid-range saturation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Below AA — Fails Accessibility (under 3:1)</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">A contrast ratio below 3:1 means the text is likely unreadable for users with moderate visual impairments, and is non-compliant with accessibility laws. Common offenders include light grey text on white backgrounds and low-contrast placeholder text. Adjust the text or background color until at least AA is met.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60">
                    <th className="text-left px-4 py-3 font-bold text-foreground">Text</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">Background</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">Ratio</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">AA</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Use Case</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-mono text-xs">#000000</td><td className="px-4 py-3 font-mono text-xs">#FFFFFF</td><td className="px-4 py-3 font-bold text-emerald-600">21:1</td><td className="px-4 py-3"><span className="text-emerald-600 font-bold">Pass</span></td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Maximum contrast</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-mono text-xs">#767676</td><td className="px-4 py-3 font-mono text-xs">#FFFFFF</td><td className="px-4 py-3 font-bold text-amber-600">4.54:1</td><td className="px-4 py-3"><span className="text-emerald-600 font-bold">Pass</span></td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Minimum AA grey</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-mono text-xs">#999999</td><td className="px-4 py-3 font-mono text-xs">#FFFFFF</td><td className="px-4 py-3 font-bold text-rose-600">2.85:1</td><td className="px-4 py-3"><span className="text-rose-600 font-bold">Fail</span></td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Common light grey (fails)</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-mono text-xs">#FFFFFF</td><td className="px-4 py-3 font-mono text-xs">#2563EB</td><td className="px-4 py-3 font-bold text-emerald-600">5.47:1</td><td className="px-4 py-3"><span className="text-emerald-600 font-bold">Pass</span></td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">White on blue button</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Example 1 – The lightest acceptable grey:</strong> <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">#767676</code> on white produces a contrast ratio of exactly 4.54:1 — just above the 4.5:1 AA threshold. This is the lightest grey you can legally use for body text on a white background. Many popular design systems use this as their "muted text" color.</p>
                <p><strong className="text-foreground">Example 2 – A common failure:</strong> <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">#999999</code> on white (2.85:1) is used by many websites for placeholder text and secondary labels. While it "looks" readable to users with normal vision, it fails WCAG AA for all text sizes and is a frequent target of accessibility audits and lawsuits.</p>
                <p><strong className="text-foreground">Example 3 – Maximum contrast caution:</strong> Pure black (#000000) on pure white (#FFFFFF) achieves the maximum 21:1 ratio but can cause "halation" — a visual illusion where white bleeds into dark text on bright screens. For sustained reading, a ratio between 10:1 and 15:1 (e.g., <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">#1F2937</code> on white) is often recommended.</p>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-fuchsia-500/5 border border-fuchsia-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-fuchsia-400 text-fuchsia-400" />)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Caught three accessibility failures in our design system before launch. The live preview made it obvious how unreadable our muted text was."</p>
                <p className="text-xs text-muted-foreground mt-2">— Front-end developer, 2025</p>
              </div>
            </section>

            {/* ── WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Color Contrast Checker?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Real-time live preview.</strong> Unlike checkers that only show numbers, this tool renders your exact color combination on heading and paragraph text — so you see how the combination actually looks before copy-pasting hex codes into your CSS. The preview updates instantly as you pick colors.</p>
                <p><strong className="text-foreground">All three WCAG thresholds in one view.</strong> The results panel shows AA Normal (4.5:1), AAA Normal (7.0:1), and AA Large (3.0:1) simultaneously. This means you can check compliance for body text, headings, and large buttons in a single test — no switching between tabs or modes.</p>
                <p><strong className="text-foreground">Swap and Randomize buttons save time.</strong> Testing a design often means checking both the normal view (dark text on light) and the inverted view (light text on dark). The Swap button reverses the colors instantly. The Random button is useful for exploring new accessible color combinations you might not have considered.</p>
                <p><strong className="text-foreground">Uses the official W3C luminance algorithm.</strong> The contrast ratio is computed using the exact formula specified in WCAG 2.1 Success Criterion 1.4.3 — linearizing sRGB values before applying the luminance weights (0.2126 R, 0.7152 G, 0.0722 B). This matches the output of official WCAG evaluation tools.</p>
                <p><strong className="text-foreground">No data leaves your browser.</strong> Your brand colors are not sent to any server. The entire calculation runs locally in JavaScript. This makes the tool safe for agencies and design teams working under NDA on unreleased brand identities.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> This tool evaluates opaque solid hex colors only. For translucent RGBA colors, composit the overlay onto the background first, then test the resulting solid hex. For dark mode interfaces, test both your light and dark theme color pairs.</p>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What contrast ratio is required by law?" a="WCAG Level AA (4.5:1 for normal text, 3:1 for large text) is the standard referenced by the ADA, the EU Web Accessibility Directive, and Section 508. Failure to meet AA can result in lawsuits — accessibility-related legal actions have increased by over 300% since 2018." />
                <FaqItem q="What counts as 'large text' in WCAG?" a="Text that is 18pt (24px) or larger, or 14pt (approximately 18.5px) bold or larger. These sizes are considered large because the increased character size provides inherently better legibility, allowing a more lenient 3.0:1 contrast threshold." />
                <FaqItem q="Is pure black on pure white the best for accessibility?" a="Not necessarily. While #000000 on #FFFFFF has the maximum 21:1 ratio, extremely high contrast can cause 'halation' — a visual phenomenon where bright white bleeds into dark text on LED screens, especially for users with astigmatism. A ratio between 10:1 and 15:1 is often more comfortable for extended reading." />
                <FaqItem q="Does opacity affect the contrast ratio?" a="Yes. If your text uses an RGBA color like rgba(255,255,255,0.5) on a dark background, the effective rendered color is different from pure white. You need to calculate the composited solid color first, then test that hex value. This tool works with opaque hex codes only." />
                <FaqItem q="Can I use this for mobile app design?" a="Absolutely. WCAG guidelines apply to all digital interfaces — web, iOS, Android, and desktop applications. The same contrast thresholds (4.5:1 AA, 7:1 AAA) apply regardless of platform. Enter your app's hex colors and verify compliance." />
                <FaqItem q="How does the luminance calculation work?" a="Each RGB channel (0–255) is first converted to a linear value using the sRGB transfer function, then weighted: Red × 0.2126, Green × 0.7152, Blue × 0.0722. Green has the highest weight because human eyes are most sensitive to green light. The ratio is (lighter + 0.05) / (darker + 0.05)." />
                <FaqItem q="What if my brand color fails AA?" a="You have several options: darken the text or lighten the background until the ratio reaches 4.5:1; use the failing color only for decorative elements (not text); increase the font size to 18pt+ so the Large text threshold (3.0:1) applies instead; or pair the brand color with a higher-contrast companion." />
                <FaqItem q="Does this tool work on mobile phones?" a="Yes. The layout is fully responsive — color pickers and inputs stack vertically on small screens. The tool runs entirely in your browser with no app download. Works on iOS Safari, Android Chrome, and all modern desktop browsers." />
              </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Explore More CSS &amp; Design Tools</h2>
                <p className="text-white/80 mb-6 max-w-lg">Color pickers, gradient generators, shadow builders, and more — all free, all instant.</p>
                <Link href="/category/css-design" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-fuchsia-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  View CSS Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map(tool => (
                    <Link key={tool.slug} href={`/${tool.cat}/${tool.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-fuchsia-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help designers check accessibility.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Contrast Checker", "How to Use", "WCAG Levels", "Quick Examples", "Why Choose This", "FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-fuchsia-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-fuchsia-500/40 flex-shrink-0" />{label}
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
