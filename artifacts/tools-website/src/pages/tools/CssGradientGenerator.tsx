import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock,
  Palette, Lightbulb, Copy, Check, Code,
  Pipette, Eye, Paintbrush, Layers,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary"><ChevronDown className="w-5 h-5" /></motion.span>
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

const PRESETS = [
  { name: "Ocean Blue", color1: "#667eea", color2: "#764ba2" },
  { name: "Sunset", color1: "#f093fb", color2: "#f5576c" },
  { name: "Mint", color1: "#4facfe", color2: "#00f2fe" },
  { name: "Fire", color1: "#fa709a", color2: "#fee140" },
  { name: "Forest", color1: "#0ba360", color2: "#3cba92" },
  { name: "Purple Haze", color1: "#a18cd1", color2: "#fbc2eb" },
  { name: "Dark Night", color1: "#0c3483", color2: "#a2b6df" },
  { name: "Warm Flame", color1: "#ff9a9e", color2: "#fecfef" },
];

const RELATED_TOOLS = [
  { title: "Color Converter", slug: "color-converter", icon: <Pipette className="w-5 h-5" />, color: 340 },
  { title: "Meta Tag Generator", slug: "meta-tag-generator", icon: <Code className="w-5 h-5" />, color: 217 },
  { title: "Password Generator", slug: "password-generator", icon: <Layers className="w-5 h-5" />, color: 152 },
  { title: "JSON Formatter", slug: "json-formatter", icon: <Code className="w-5 h-5" />, color: 25 },
  { title: "Lorem Ipsum Generator", slug: "lorem-ipsum-generator", icon: <Paintbrush className="w-5 h-5" />, color: 265 },
  { title: "Base64 Encoder/Decoder", slug: "base64-encoder-decoder", icon: <Eye className="w-5 h-5" />, color: 45 },
];

type GradientType = "linear" | "radial" | "conic";

export default function CssGradientGenerator() {
  const [color1, setColor1] = useState("#667eea");
  const [color2, setColor2] = useState("#764ba2");
  const [angle, setAngle] = useState(135);
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [copied, setCopied] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);

  const gradientCSS = useMemo(() => {
    if (gradientType === "linear") return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    if (gradientType === "radial") return `radial-gradient(circle, ${color1}, ${color2})`;
    return `conic-gradient(from ${angle}deg, ${color1}, ${color2})`;
  }, [color1, color2, angle, gradientType]);

  const fullCSS = `background: ${gradientCSS};`;

  const copyCss = () => { navigator.clipboard.writeText(fullCSS); setCopiedCss(true); setTimeout(() => setCopiedCss(false), 2000); };
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <Layout>
      <SEO
        title="CSS Gradient Generator - Free Online Tool | Create Beautiful CSS Gradients"
        description="Free CSS gradient generator. Create beautiful linear, radial, and conic gradients visually. Copy CSS code instantly. No signup required."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/css-design" className="text-muted-foreground hover:text-foreground transition-colors">CSS & Design</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">CSS Gradient Generator</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            <section>
              <div className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Palette className="w-3.5 h-3.5" /> CSS & Design
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">CSS Gradient Generator</h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Create stunning CSS gradients visually. Choose colors, adjust angles, pick presets, and copy production-ready CSS code — free, instant, and no signup needed.
              </p>
            </section>

            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Zap className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="font-bold text-foreground text-sm">Visual gradient builder</p>
                <p className="text-muted-foreground text-sm">Pick colors, choose a type, and see your gradient update in real-time.</p>
              </div>
            </section>

            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 290 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">CSS Gradient Generator</h3>
                </div>

                {/* Preview */}
                <div className="w-full h-48 rounded-xl mb-5 border border-border" style={{ background: gradientCSS }} />

                {/* Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Color 1</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                      <input type="text" value={color1} onChange={e => setColor1(e.target.value)} className="tool-calc-input w-full font-mono text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Color 2</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                      <input type="text" value={color2} onChange={e => setColor2(e.target.value)} className="tool-calc-input w-full font-mono text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Angle: {angle}°</label>
                    <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(parseInt(e.target.value))} className="w-full mt-2" />
                  </div>
                </div>

                {/* Type selector */}
                <div className="flex items-center gap-2 mb-5">
                  {(["linear", "radial", "conic"] as const).map(t => (
                    <button key={t} onClick={() => setGradientType(t)} className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${gradientType === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{t}</button>
                  ))}
                </div>

                {/* Presets */}
                <div className="mb-5">
                  <label className="text-sm font-semibold text-muted-foreground mb-2 block">Presets</label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {PRESETS.map(p => (
                      <button key={p.name} onClick={() => { setColor1(p.color1); setColor2(p.color2); }} className="w-full aspect-square rounded-lg border border-border hover:scale-110 transition-transform" style={{ background: `linear-gradient(135deg, ${p.color1}, ${p.color2})` }} title={p.name} />
                    ))}
                  </div>
                </div>

                {/* CSS Output */}
                <div className="relative">
                  <pre className="tool-calc-result p-4 rounded-xl font-mono text-sm overflow-x-auto">{fullCSS}</pre>
                  <button onClick={copyCss} className="absolute top-3 right-3 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:-translate-y-0.5 transition-transform">
                    {copiedCss ? "Copied!" : "Copy CSS"}
                  </button>
                </div>

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex gap-2 items-start">
                    <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      Your {gradientType} gradient uses colors {color1} and {color2}{gradientType === "linear" ? ` at ${angle}°` : ""}. Copy the CSS code above and paste it into your stylesheet.
                    </p>
                  </div>
                </motion.div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How CSS Gradients Work</h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Linear Gradients</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Create smooth color transitions along a straight line. Use <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">linear-gradient(angle, color1, color2)</code> to define direction and colors.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Radial Gradients</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Create circular or elliptical color transitions that radiate from a center point. Perfect for spotlight effects and button backgrounds.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Conic Gradients</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Create pie-chart-like color transitions that rotate around a center point. Great for progress indicators and decorative elements.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Generator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Real-time visual gradient preview" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Linear, radial, and conic gradient types" },
                  { icon: <Shield className="w-4 h-4" />, text: "Copy production-ready CSS instantly" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Mobile-friendly gradient builder" },
                  { icon: <Clock className="w-4 h-4" />, text: "8 beautiful preset gradients included" },
                  { icon: <Palette className="w-4 h-4" />, text: "Full color picker with hex input" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">CSS Gradients: A Complete Guide</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>CSS gradients allow you to create smooth color transitions between two or more colors without using images. They render at the resolution of the device, scale perfectly, and are significantly faster to load than gradient images.</p>
                <p>This free CSS gradient generator tool lets web developers and designers create beautiful gradients visually and copy the CSS code directly into their projects. Whether you need a subtle background, a vibrant hero section, or a sleek button effect, gradients make your design stand out.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">Best Practices for CSS Gradients</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Use complementary or analogous colors for harmonious gradients",
                    "Add a solid fallback color for older browsers that don't support gradients",
                    "Keep gradients subtle on text-heavy sections for readability",
                    "Use linear gradients for headers and radial for spotlight effects",
                    "Test gradients on both light and dark backgrounds",
                    "Consider accessibility — ensure sufficient contrast with text",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" /><span>{item}</span></li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is a CSS gradient?" a="A CSS gradient is a smooth transition between two or more colors rendered by the browser. It replaces image-based gradients with code, resulting in faster loading, perfect scaling, and smaller file sizes." />
                <FaqItem q="What's the difference between linear and radial gradients?" a="Linear gradients transition along a straight line (defined by an angle), while radial gradients transition outward from a center point in a circular or elliptical shape. Linear is great for backgrounds; radial is great for spotlight effects." />
                <FaqItem q="Do CSS gradients work in all browsers?" a="Yes. CSS gradients are supported in all modern browsers including Chrome, Firefox, Safari, Edge, and mobile browsers. For very old browsers, always include a solid background-color fallback." />
                <FaqItem q="Can I add more than 2 colors?" a="Yes! CSS supports multi-stop gradients with unlimited colors. This generator uses 2 colors for simplicity, but you can manually add more color stops in the CSS code." />
                <FaqItem q="Is this tool free?" a="100% free with no ads, no signup, and no limitations. Create as many gradients as you need and copy the CSS instantly." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Explore More Design Tools</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">Try our color converter, meta tag generator, and 400+ more free tools for designers and developers.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={getToolPath(tool.slug)} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">{tool.title}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help others create CSS gradients easily.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
