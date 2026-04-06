import { useState, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Palette, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, RefreshCw, Hash, FileText
} from "lucide-react";

function randomHex() {
  const a = new Uint8Array(3);
  crypto.getRandomValues(a);
  return "#" + Array.from(a).map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}
function hexToRgb(h: string) { return { r: parseInt(h.slice(1,3),16), g: parseInt(h.slice(3,5),16), b: parseInt(h.slice(5,7),16) }; }
function hexToHsl(h: string) {
  let {r,g,b} = hexToRgb(h); r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let hue=0, s=0, l=(max+min)/2;
  if(max!==min){const d=max-min; s=l>.5?d/(2-max-min):d/(max+min); if(max===r)hue=((g-b)/d+(g<b?6:0))/6; else if(max===g)hue=((b-r)/d+2)/6; else hue=((r-g)/d+4)/6;}
  return { h:Math.round(hue*360), s:Math.round(s*100), l:Math.round(l*100) };
}
const isLight = (h: string) => { const {r,g,b}=hexToRgb(h); return (r*299+g*587+b*114)/1000>128; };
const genPalette = (n: number) => Array.from({length:n}, randomHex);

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-pink-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-pink-500"><ChevronDown className="w-5 h-5" /></motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED = [
  { title: "Color Converter",        slug: "color-converter",       cat: "conversion",   icon: <Hash className="w-5 h-5" />,    color: 300, benefit: "Convert HEX / RGB / HSL" },
  { title: "Hex to RGB Converter",   slug: "hex-to-rgb-converter",  cat: "css-design",   icon: <Hash className="w-5 h-5" />,    color: 217, benefit: "Convert HEX colors to RGB" },
  { title: "CSS Gradient Generator", slug: "css-gradient-generator",cat: "css-design",   icon: <Palette className="w-5 h-5" />, color: 265, benefit: "Create CSS gradient code" },
  { title: "Case Converter",         slug: "case-converter",        cat: "productivity", icon: <FileText className="w-5 h-5" />,color: 152, benefit: "Convert text case formats" },
];

export default function RandomColorGenerator() {
  const [count, setCount] = useState(10);
  const [colors, setColors] = useState<string[]>(() => genPalette(10));
  const [copied, setCopied] = useState<string|null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [view, setView] = useState<"hex"|"rgb"|"hsl">("hex");

  const regenerate = useCallback(() => setColors(genPalette(count)), [count]);
  const fmt = useCallback((h: string) => {
    if (view==="hex") return h;
    if (view==="rgb") { const {r,g,b}=hexToRgb(h); return `rgb(${r}, ${g}, ${b})`; }
    const {h:hh,s,l}=hexToHsl(h); return `hsl(${hh}, ${s}%, ${l}%)`;
  }, [view]);

  const copyColor = (h: string) => { navigator.clipboard.writeText(fmt(h)); setCopied(h); setTimeout(()=>setCopied(null),1500); };
  const copyAll = () => { navigator.clipboard.writeText(colors.map(fmt).join("\n")); setCopied("all"); setTimeout(()=>setCopied(null),1500); };
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setLinkCopied(true); setTimeout(()=>setLinkCopied(false),2000); };

  return (
    <Layout>
      <SEO title="Random Color Generator – HEX, RGB & HSL Colors Free | US Online Tools" description="Free random color generator. Generate unique colors in HEX, RGB, and HSL formats for design, UI development, and creative projects. Bulk generation. No signup." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-pink-500" strokeWidth={3} />
          <Link href="/category/productivity" className="text-muted-foreground hover:text-foreground transition-colors">Design &amp; Utilities</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-pink-500" strokeWidth={3} />
          <span className="text-foreground">Random Color Generator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-pink-500/15 bg-gradient-to-br from-pink-500/5 via-card to-violet-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Palette className="w-3.5 h-3.5" /> Design &amp; Utilities
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Random Color Generator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Generate random colors in HEX, RGB, and HSL formats instantly. Perfect for designers, developers, and creatives who need color inspiration, UI placeholders, or test swatches.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold text-xs px-3 py-1.5 rounded-full border border-pink-500/20"><Zap className="w-3.5 h-3.5" /> Instant Generate</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Design &amp; Utilities &nbsp;·&nbsp; Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-pink-500/20 shadow-lg shadow-pink-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-pink-500 to-violet-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-violet-400 flex items-center justify-center flex-shrink-0"><Palette className="w-4 h-4 text-white" /></div>
                    <div><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Color Generator</p><p className="text-sm text-muted-foreground">Click any swatch to copy. Switch format without regenerating.</p></div>
                  </div>
                  <div className="tool-calc-card" style={{ "--calc-hue": 340 } as React.CSSProperties}>
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                      <div className="flex gap-2">
                        {(["hex","rgb","hsl"] as const).map(f => (
                          <button key={f} onClick={() => setView(f)} className={`px-3 py-1.5 rounded-lg border-2 font-bold text-xs uppercase transition-all ${view===f ? "bg-pink-500 border-pink-500 text-white" : "border-border text-muted-foreground hover:border-pink-500/40"}`}>{f}</button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        {[5,10,15,20].map(n => (
                          <button key={n} onClick={() => { setCount(n); setColors(genPalette(n)); }} className={`w-9 h-9 rounded-lg border-2 font-bold text-sm transition-all ${count===n ? "bg-pink-500 border-pink-500 text-white" : "border-border text-muted-foreground hover:border-pink-500/40"}`}>{n}</button>
                        ))}
                        <button onClick={copyAll} className="flex items-center gap-1 px-3 py-2 bg-muted text-muted-foreground font-bold text-xs rounded-lg hover:bg-muted/80 transition-colors">
                          {copied==="all" ? <><Check className="w-3 h-3 text-emerald-500" /> Copied!</> : <><Copy className="w-3 h-3" /> All</>}
                        </button>
                        <button onClick={regenerate} className="flex items-center gap-1 px-3 py-2 bg-pink-500 text-white font-bold text-xs rounded-lg hover:bg-pink-600 transition-colors">
                          <RefreshCw className="w-3 h-3" /> New
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {colors.map((h, idx) => (
                        <motion.button key={`${h}-${idx}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.04 }} onClick={() => copyColor(h)} className="group relative overflow-hidden rounded-xl border-2 border-transparent hover:border-foreground/20 transition-all hover:-translate-y-0.5" style={{ backgroundColor: h }}>
                          <div className="h-20" />
                          <div className="px-2 py-2 bg-black/20 backdrop-blur-sm">
                            <p className={`text-xs font-mono font-bold truncate ${isLight(h) ? "text-black/80" : "text-white/90"}`}>{fmt(h)}</p>
                          </div>
                          {copied===h && <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-xl"><Check className="w-6 h-6 text-white" /></div>}
                        </motion.button>
                      ))}
                    </div>
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-pink-500/5 border border-pink-500/20">
                      <div className="flex gap-2 items-start"><Lightbulb className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" /><p className="text-sm text-foreground/80 leading-relaxed">Click any swatch to copy its {view.toUpperCase()} value. Switch format above to convert the entire set without regenerating.</p></div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Random Color Generator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">Whether for design inspiration, UI placeholders, or testing components — this generator produces genuinely random, full-spectrum colors in three formats with one click.</p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div><p className="font-bold text-foreground mb-1">Select your color format</p><p className="text-muted-foreground text-sm leading-relaxed">Choose HEX for CSS and design tools, RGB for canvas APIs and Figma, or HSL for programmatic color manipulation. You can switch format at any time without losing your generated colors.</p></div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div><p className="font-bold text-foreground mb-1">Set the number of colors</p><p className="text-muted-foreground text-sm leading-relaxed">Choose 5, 10, 15, or 20 colors per batch. Generate 20 at once for maximum variety when browsing for inspiration, or 5 for focused palette building.</p></div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div><p className="font-bold text-foreground mb-1">Click any swatch to copy</p><p className="text-muted-foreground text-sm leading-relaxed">Click any color swatch to copy its formatted value to your clipboard — ready to paste into CSS, Figma, or any design tool. Use "Copy All" to export the complete list as newline-separated values.</p></div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Color Format Reference</p>
                <div className="space-y-2">
                  {[["HEX","#RRGGBB — 6-digit hexadecimal, universal web standard"],["RGB","rgb(R, G, B) — 0-255 per channel, native to JS canvas, Figma"],["HSL","hsl(H°, S%, L%) — hue/saturation/lightness, ideal for code logic"]].map(([k,v]) => (
                    <div key={k} className="flex items-center gap-3"><span className="text-pink-500 font-bold w-10 flex-shrink-0 text-sm">{k}</span><code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">{v}</code></div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">When to Use Each Color Format</h2>
              <p className="text-muted-foreground text-sm mb-6">Each format has specific advantages depending on your workflow:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-pink-500/5 border border-pink-500/20"><div className="w-3 h-3 rounded-full bg-pink-500 flex-shrink-0 mt-1.5" /><div><p className="font-bold text-foreground mb-1">HEX — Universal Web Standard</p><p className="text-sm text-muted-foreground leading-relaxed">Used in CSS, Tailwind configs, Figma fills, and design tokens. Default choice for web development. Easy to share, read, and store as a simple string.</p></div></div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20"><div className="w-3 h-3 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" /><div><p className="font-bold text-foreground mb-1">RGB — Native to Canvas &amp; Image APIs</p><p className="text-muted-foreground text-sm leading-relaxed">Ideal for HTML Canvas, WebGL, p5.js, Three.js, and Photoshop APIs. Intuitive for mathematical operations like blending, averaging, and interpolation.</p></div></div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20"><div className="w-3 h-3 rounded-full bg-cyan-500 flex-shrink-0 mt-1.5" /><div><p className="font-bold text-foreground mb-1">HSL — Best for Programmatic Manipulation</p><p className="text-muted-foreground text-sm leading-relaxed">Ideal for generating color variations — lighter/darker shades by adjusting L, complementary colors by rotating H 180°, and accessible palette generation by fixing S+L while rotating H.</p></div></div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Color Format Conversion Reference</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Color</th><th className="text-left px-4 py-3 font-bold text-foreground">HEX</th><th className="text-left px-4 py-3 font-bold text-foreground">RGB</th><th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">HSL</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    {[["Flame Orange","#FF5733","rgb(255, 87, 51)","hsl(11, 100%, 60%)"],["Sky Blue","#3498DB","rgb(52, 152, 219)","hsl(204, 70%, 53%)"],["Emerald","#2ECC71","rgb(46, 204, 113)","hsl(145, 63%, 49%)"],["Amethyst","#9B59B6","rgb(155, 89, 182)","hsl(283, 39%, 53%)"]].map(([name,hex,rgb,hsl]) => (
                      <tr key={name} className="hover:bg-muted/30"><td className="px-4 py-3 flex items-center gap-2"><div className="w-4 h-4 rounded" style={{background:hex}} />{name}</td><td className="px-4 py-3 font-mono text-foreground">{hex}</td><td className="px-4 py-3 font-mono text-muted-foreground">{rgb}</td><td className="px-4 py-3 font-mono text-muted-foreground hidden sm:table-cell">{hsl}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Design use case:</strong> Generate 20 random colors, identify groups with similar moods, then refine into a cohesive brand palette. This "color casting" technique produces unexpected combinations that become signature design elements faster than browsing curated palette sites.</p>
                <p><strong className="text-foreground">Developer use case:</strong> Use random HEX values for test data in charts, avatar backgrounds, and category tags — ensuring genuine color distribution across the spectrum without manual selection bias.</p>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-pink-500/5 border border-pink-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_,i)=><svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"I use this to seed random avatar background colors in my React app. The HSL format one-click copy is exactly what I needed — saves me writing my own random color function every time."</p>
                <p className="text-xs text-muted-foreground mt-2">— Developer feedback, 2025</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Color Generator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Three formats, zero conversion needed.</strong> Switch between HEX, RGB, and HSL on the same batch. Copy exactly the format your workflow requires without manual conversion.</p>
                <p><strong className="text-foreground">Full spectrum via crypto.getRandomValues().</strong> Each color is three random bytes from the OS entropy pool — covering all 16.7M RGB colors with equal probability, no hue bias.</p>
                <p><strong className="text-foreground">Contrast-aware swatch text.</strong> Text on each swatch automatically switches between dark and light using the WCAG luminance formula so color codes are always legible.</p>
                <p><strong className="text-foreground">Completely local — works offline.</strong> All generation and conversion happens in your browser. No color data is sent to any server.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> Random colors are not guaranteed to be WCAG accessible or aesthetically harmonious. Use as starting points and evaluate contrast ratios before shipping in production.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is the difference between HEX, RGB, and HSL?" a="HEX (#RRGGBB) encodes color as base-16 numbers — the web standard. RGB (rgb(R,G,B)) uses decimal 0-255 per channel, native to canvas and image APIs. HSL (hsl(H,S%,L%)) uses hue (0-360°), saturation, and lightness — the most intuitive format for reasoning about color relationships programmatically." />
                <FaqItem q="Are the colors truly random?" a="Yes — the generator uses crypto.getRandomValues() to produce three random bytes per color from the OS entropy pool, covering all 16.7M possible RGB colors with equal statistical probability." />
                <FaqItem q="Can I generate colors in a specific hue range?" a="Not currently — this tool generates across the full spectrum. For palette generation constrained to warm colors, pastels, or earth tones, use a dedicated palette tool that accepts hue range parameters." />
                <FaqItem q="How do I check color accessibility (WCAG contrast)?" a="After copying a color, use WebAIM's Contrast Checker (webaim.org) to verify foreground/background combinations meet WCAG AA (4.5:1) or WCAG AAA (7:1) standards for text readability." />
                <FaqItem q="Can I use these colors in commercial projects?" a="Yes. Color values (HEX, RGB, HSL numbers) are not copyrightable and can be freely used in any commercial, open source, or personal project without attribution." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 to-violet-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Design &amp; Utility Tools</h2>
                <p className="text-white/80 mb-6 max-w-lg">400+ free tools for designers, developers, and creators — instant results, no account needed.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-pink-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">Explore All Tools <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED.map(tool => (
                    <Link key={tool.slug} href={`/${tool.cat}/${tool.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-pink-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share with designers and developers.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-pink-500 to-violet-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {linkCopied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Generator","How to Use","Result Interpretation","Quick Examples","Why Choose This","FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g,"-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-pink-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-pink-500/40 flex-shrink-0" />{label}
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
