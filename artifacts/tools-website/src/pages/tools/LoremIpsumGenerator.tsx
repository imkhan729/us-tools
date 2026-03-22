import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock,
  FileText, Lightbulb, Copy, Check, Code, Type,
  Braces, Hash, AlignLeft,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

const LOREM_WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function generateWords(count: number): string {
  const result: string[] = [];
  for (let i = 0; i < count; i++) result.push(LOREM_WORDS[i % LOREM_WORDS.length]);
  result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1);
  return result.join(" ") + ".";
}

function generateSentences(count: number): string {
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    const len = 8 + Math.floor(Math.random() * 12);
    const start = Math.floor(Math.random() * (LOREM_WORDS.length - len));
    const words = LOREM_WORDS.slice(start, start + len);
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    sentences.push(words.join(" ") + ".");
  }
  return sentences.join(" ");
}

function generateParagraphs(count: number): string {
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) paragraphs.push(generateSentences(4 + Math.floor(Math.random() * 4)));
  return paragraphs.join("\n\n");
}

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

const RELATED_TOOLS = [
  { title: "Word Counter", slug: "word-counter", icon: <AlignLeft className="w-5 h-5" />, color: 217 },
  { title: "JSON Formatter", slug: "json-formatter", icon: <Braces className="w-5 h-5" />, color: 152 },
  { title: "Base64 Encoder/Decoder", slug: "base64-encoder-decoder", icon: <Code className="w-5 h-5" />, color: 340 },
  { title: "Password Generator", slug: "password-generator", icon: <Hash className="w-5 h-5" />, color: 25 },
  { title: "Meta Tag Generator", slug: "meta-tag-generator", icon: <FileText className="w-5 h-5" />, color: 265 },
  { title: "CSS Gradient Generator", slug: "css-gradient-generator", icon: <Type className="w-5 h-5" />, color: 45 },
];

export default function LoremIpsumGenerator() {
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState("3");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);

  const handleGenerate = () => {
    const n = parseInt(count) || 1;
    const clamped = Math.min(Math.max(n, 1), 100);
    if (type === "paragraphs") setOutput(generateParagraphs(clamped));
    else if (type === "sentences") setOutput(generateSentences(clamped));
    else setOutput(generateWords(clamped));
  };

  const copyResult = () => { navigator.clipboard.writeText(output); setCopiedResult(true); setTimeout(() => setCopiedResult(false), 2000); };
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const wordCount = output ? output.split(/\s+/).filter(Boolean).length : 0;
  const charCount = output.length;

  return (
    <Layout>
      <SEO
        title="Lorem Ipsum Generator - Free Online Placeholder Text Tool"
        description="Generate lorem ipsum placeholder text instantly. Create paragraphs, sentences, or words of dummy text for web design and development. Free, no signup required."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/developer" className="text-muted-foreground hover:text-foreground transition-colors">Developer Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Lorem Ipsum Generator</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            <section>
              <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Code className="w-3.5 h-3.5" /> Developer Tools
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">Lorem Ipsum Generator</h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Generate placeholder text for your designs, mockups, and prototypes. Create paragraphs, sentences, or words of lorem ipsum text instantly — free and no signup needed.
              </p>
            </section>

            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Zap className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="font-bold text-foreground text-sm">Quick generation</p>
                <p className="text-muted-foreground text-sm">Select type, choose quantity, and click Generate for instant placeholder text.</p>
              </div>
            </section>

            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 175 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Lorem Ipsum Generator</h3>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <div className="flex items-center gap-2">
                    {(["paragraphs", "sentences", "words"] as const).map(t => (
                      <button key={t} onClick={() => setType(t)} className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${type === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{t}</button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-muted-foreground">Count:</label>
                    <input type="number" min="1" max="100" className="tool-calc-input w-20 text-center" value={count} onChange={e => setCount(e.target.value)} />
                  </div>
                  <button onClick={handleGenerate} className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">Generate</button>
                </div>

                {output && (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                        <span>{wordCount} words</span>
                        <span>•</span>
                        <span>{charCount} characters</span>
                      </div>
                      <button onClick={copyResult} className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1">
                        {copiedResult ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                      </button>
                    </div>
                    <textarea readOnly rows={10} className="tool-calc-input w-full resize-y text-sm bg-muted/30 leading-relaxed" value={output} />

                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <div className="flex gap-2 items-start">
                        <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          Generated {count} {type} of placeholder text ({wordCount} words, {charCount} characters). This text is commonly used for design mockups, wireframes, and layout testing.
                        </p>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">What Is Lorem Ipsum?</h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Ancient Origins</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Lorem ipsum text originates from a 1st century BC Latin work by Cicero called "De Finibus Bonorum et Malorum." It has been the industry standard dummy text since the 1500s.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Why Designers Use It</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Lorem ipsum provides realistic text distribution without distracting readers with meaningful content. This lets designers focus on layout, typography, and visual hierarchy.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Modern Usage</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Used in web design, graphic design, typography, print publishing, app development, and anywhere placeholder text is needed before final content is ready.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Generator?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Generate paragraphs, sentences, or words" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Classic lorem ipsum with natural flow" },
                  { icon: <Shield className="w-4 h-4" />, text: "No ads, no tracking, fully private" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Works perfectly on mobile devices" },
                  { icon: <Clock className="w-4 h-4" />, text: "No signup or downloads needed" },
                  { icon: <Copy className="w-4 h-4" />, text: "One-click copy to clipboard" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is Lorem Ipsum?" a="Lorem ipsum is placeholder text used in design and publishing. It originates from a 1st century BC work by Cicero and has been the industry standard since the 1500s when a printer scrambled type to create a specimen book." />
                <FaqItem q="Why use lorem ipsum instead of real text?" a="Lorem ipsum has a natural letter and word distribution that closely resembles real content. This prevents readers from being distracted by the text and lets them focus on the visual design, layout, and typography." />
                <FaqItem q="Can I use this for commercial projects?" a="Yes. Lorem ipsum is in the public domain. You can use the generated placeholder text in any personal or commercial project without attribution or licensing." />
                <FaqItem q="How many paragraphs can I generate?" a="You can generate up to 100 paragraphs, sentences, or words at a time. For larger amounts, simply generate multiple times and combine the results." />
                <FaqItem q="Is this generator free?" a="100% free with no ads, no signup, and no limitations. Generate as much placeholder text as you need." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Developer Tools?</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">Explore JSON formatters, Base64 encoders, password generators, and 400+ more free tools.</p>
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
                <p className="text-sm text-muted-foreground mb-4">Help others generate placeholder text easily.</p>
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
