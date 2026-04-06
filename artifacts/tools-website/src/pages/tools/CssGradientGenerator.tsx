import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Check,
  Zap, Shield, Copy, Wand2, PaintBucket,
  Palette, RefreshCw, Code2, Move
} from "lucide-react";

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
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED = [
  { title: "Border Radius", slug: "css-border-radius-generator", cat: "css-design", icon: <Move className="w-5 h-5"/>, color: 250, benefit: "Generate corner radii" },
  { title: "Box Shadow", slug: "css-box-shadow-generator", cat: "css-design", icon: <Wand2 className="w-5 h-5"/>, color: 200, benefit: "Create box-shadow CSS" },
  { title: "Color Picker", slug: "color-picker", cat: "css-design", icon: <Palette className="w-5 h-5"/>, color: 150, benefit: "Extract HEX / RGB codes" },
];

export default function CssGradientGenerator() {
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(135);
  const [color1, setColor1] = useState("#ec4899");
  const [color2, setColor2] = useState("#8b5cf6");
  
  const [copied, setCopied] = useState(false);

  // Compile the actual CSS payload
  const generatedCSS = useMemo(() => {
    if (gradientType === "linear") {
      return `background: linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%);`;
    }
    return `background: radial-gradient(circle, ${color1} 0%, ${color2} 100%);`;
  }, [gradientType, angle, color1, color2]);

  const copyResult = () => {
    navigator.clipboard.writeText(generatedCSS);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const randomize = () => {
    const chars = "0123456789ABCDEF";
    let hex1 = "#"; let hex2 = "#";
    for (let i = 0; i < 6; i++) {
        hex1 += chars[Math.floor(Math.random() * 16)];
        hex2 += chars[Math.floor(Math.random() * 16)];
    }
    setColor1(hex1);
    setColor2(hex2);
    setAngle(Math.floor(Math.random() * 360));
  };

  return (
    <Layout>
      <SEO
        title="CSS Gradient Generator – Create Beautiful Blends Visually"
        description="Free online CSS Gradient Generator. Create, optimize, and preview beautiful linear and radial CSS backgrounds visually and copy the clean CSS output code."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-fuchsia-500" strokeWidth={3} />
          <Link href="/category/css-design" className="text-muted-foreground hover:text-foreground transition-colors">CSS &amp; Design</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-fuchsia-500" strokeWidth={3} />
          <span className="text-foreground">Gradient Generator</span>
        </nav>

        {/* HERO */}
        <section className="rounded-2xl overflow-hidden border border-fuchsia-500/15 bg-gradient-to-br from-fuchsia-500/5 via-card to-pink-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <PaintBucket className="w-3.5 h-3.5" /> Frontend Builder
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">CSS Gradient Generator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Visually assemble rich modern linear or radial gradient layers for modern UI backgrounds instantly, and copy the strict cross-browser compliant CSS `background:` declaration.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold text-xs px-3 py-1.5 rounded-full border border-pink-500/20"><Palette className="w-3.5 h-3.5" /> Hex / RGB Modes</span>
            <span className="inline-flex items-center gap-1.5 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 font-bold text-xs px-3 py-1.5 rounded-full border border-fuchsia-500/20"><Code2 className="w-3.5 h-3.5" /> Instant CSS Export</span>
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-full border border-indigo-500/20"><Shield className="w-3.5 h-3.5" /> Client Side Output</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* INTEGRATED BUILDER */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-fuchsia-500/20 shadow-lg shadow-fuchsia-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-fuchsia-400 to-pink-600" />
                <div className="bg-card p-6 md:p-8">

                  {/* Top Preview */}
                  <div className="w-full h-48 md:h-64 rounded-xl border border-border shadow-inner mb-8 transform transition-colors"
                       style={{ background: generatedCSS.replace("background: ", "").replace(";", "") }} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     
                     {/* Controls Left */}
                     <div className="space-y-6">
                        <div>
                          <label className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest block">Gradient Style (Linear / Radial)</label>
                          <div className="flex bg-muted p-1 rounded-xl w-fit">
                            <button onClick={() => setGradientType("linear")} className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${gradientType === "linear" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Linear</button>
                            <button onClick={() => setGradientType("radial")} className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${gradientType === "radial" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Radial / Circle</button>
                          </div>
                        </div>

                        {gradientType === "linear" && (
                           <div>
                              <div className="flex justify-between items-center mb-1.5">
                                 <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Flow Rotation Angle</label>
                                 <span className="text-xs font-bold text-fuchsia-500">{angle}° Deg</span>
                              </div>
                              <input type="range" min="0" max="360" value={angle} onChange={(e)=>setAngle(parseInt(e.target.value))} className="w-full accent-fuchsia-500" />
                           </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest block">Color Drop 1 (Hex)</label>
                              <div className="flex items-center gap-3">
                                 <input type="color" value={color1} onChange={(e)=>setColor1(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer flex-shrink-0 bg-transparent border-0 p-0" />
                                 <input type="text" value={color1} onChange={(e)=>setColor1(e.target.value)} className="tool-calc-input w-full font-mono uppercase text-sm" />
                              </div>
                           </div>
                           <div>
                              <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest block">Color Drop 2 (Hex)</label>
                              <div className="flex items-center gap-3">
                                 <input type="color" value={color2} onChange={(e)=>setColor2(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer flex-shrink-0 bg-transparent border-0 p-0" />
                                 <input type="text" value={color2} onChange={(e)=>setColor2(e.target.value)} className="tool-calc-input w-full font-mono uppercase text-sm" />
                              </div>
                           </div>
                        </div>

                        <button onClick={randomize} className="text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400 hover:text-fuchsia-500 transition-colors flex items-center gap-2 py-2">
                           <RefreshCw className="w-4 h-4" /> Randomize Colors
                        </button>
                     </div>

                     {/* Export Right */}
                     <div className="bg-muted/30 p-6 rounded-xl border border-border flex flex-col justify-between">
                         <div>
                           <label className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-2 uppercase tracking-widest"><Code2 className="w-4 h-4 text-fuchsia-500"/> CSS Export Value</label>
                           <textarea readOnly value={generatedCSS} className="w-full h-32 bg-zinc-950 font-mono text-fuchsia-400 text-sm p-4 rounded-xl border-border resize-none select-all focus:ring-1 focus:ring-fuchsia-500 transition-all shadow-inner" />
                         </div>

                         <button onClick={copyResult} className={`w-full py-3.5 mt-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md ${copied ? 'bg-emerald-500 text-white' : 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white'}`}>
                            {copied ? <><Check className="w-5 h-5" /> Copied CSS Chunk</> : <><Copy className="w-5 h-5" /> Copy Code</>}
                         </button>
                     </div>

                  </div>

                </div>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="documentation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Mastering CSS Gradients</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Web browsers render CSS gradient rules as actual dynamically drawn `image` properties—not strictly as base background colors. This prevents image loads, HTTP requests overhead, and creates perfect scalable high-fidelity retina vectors spanning multiple viewports.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div className="p-5 border border-border rounded-xl bg-muted/30">
                   <h3 className="text-sm font-bold text-foreground mb-2 uppercase tracking-widest relative z-10 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-sky-500" /> Linear Layouts</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed relative z-10">Creates color blending strictly passing across a parallel straight grid intersecting defined angles (0 to 360 Degrees) mapped edge to edge universally.</p>
                </div>
                <div className="p-5 border border-border rounded-xl bg-muted/30">
                   <h3 className="text-sm font-bold text-foreground mb-2 uppercase tracking-widest relative z-10 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-fuchsia-500" /> Radial Spheres</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed relative z-10">Constructs color blends projecting heavily outwards in 360 orientations starting aggressively from a designated central point (such as `circle` or `ellipse`).</p>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">FAQ</h2>
              <div className="space-y-3">
                <FaqItem q="Are the exported codes web-safe?" a="Yes! Standard linear-gradient and radial-gradient syntax without prefix handles standard browsers dating 10+ years back. We don't include bloated legacy WebKit tags as standard w3c specification runs automatically in modern Webkit / Gecko." />
                <FaqItem q="Can I apply a CSS gradient to text instead of a background box?" a="Yes! By applying the background logic to text alongside WebKit masking: background-clip: text; -webkit-background-clip: text; color: transparent; it will crop the gradient explicitly to the font geometry." />
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED.map(t => (
                    <Link key={t.slug} href={`/${t.cat}/${t.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${t.color} 70% 55%), hsl(${t.color} 75% 42%))` }}>{t.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{t.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{t.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-fuchsia-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Visual Engine", "Export Syntaxes", "FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g,"-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-fuchsia-500 font-medium py-1.5 transition-colors">
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
