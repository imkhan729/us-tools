import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Check,
  Text, Copy, BookOpen, PenTool, LayoutTemplate, Layers
} from "lucide-react";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-violet-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-violet-500">
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
  { title: "Word Counter", slug: "word-counter", cat: "productivity", icon: <PenTool className="w-5 h-5"/>, color: 170, benefit: "Count words & characters" },
  { title: "Slug Generator", slug: "slug-generator", cat: "developer", icon: <LayoutTemplate className="w-5 h-5"/>, color: 150, benefit: "Create URL-friendly text" },
  { title: "JSON Formatter", slug: "json-formatter", cat: "developer", icon: <Layers className="w-5 h-5"/>, color: 200, benefit: "Prettify code strings" },
];

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed",
  "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua",
  "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris",
  "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in",
  "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
  "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa",
  "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

function generateSentence(wordCount: number): string {
    const words = [];
    for (let i = 0; i < wordCount; i++) {
        const randIndex = Math.floor(Math.random() * LOREM_WORDS.length);
        words.push(LOREM_WORDS[randIndex]);
    }
    const sentence = words.join(" ");
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

function generateParagraph(sentencesLength: number): string {
    const sentences = [];
    for (let i = 0; i < sentencesLength; i++) {
        const sentenceLen = Math.floor(Math.random() * (12 - 5 + 1) + 5); 
        sentences.push(generateSentence(sentenceLen));
    }
    return sentences.join(" ");
}

export default function LoremIpsumGenerator() {
  const [type, setType] = useState<"paragraphs" | "words" | "sentences">("paragraphs");
  const [count, setCount] = useState<number>(3);
  const [copied, setCopied] = useState(false);

  const generatedHTML = useMemo(() => {
    let result = [];
    if (type === "words") {
         const words = [];
         for(let w=0; w < count; w++) {
            words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
         }
         return words.join(" ").charAt(0).toUpperCase() + words.join(" ").slice(1) + ".";
    }

    for (let x = 0; x < count; x++) {
       if (type === "paragraphs") {
           result.push(generateParagraph(Math.floor(Math.random() * 4) + 4)); // 4 to 7 sentences per paragraph
       } else if (type === "sentences") {
           result.push(generateSentence(Math.floor(Math.random() * 8) + 6)); // 6 to 13 words
       }
    }
    
    // Default paragraphs join with double newline
    return type === "paragraphs" ? result.join("\n\n") : result.join(" ");
  }, [type, count]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Lorem Ipsum Generator – Dummy Text Placeholder Tool"
        description="Free online Lorem Ipsum Generator. Create placeholder text for prototypes, wireframes, and design mockups via custom paragraphs, sentences, or word counts."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <Link href="/category/productivity-text" className="text-muted-foreground hover:text-foreground transition-colors">Productivity</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <span className="text-foreground">Lorem Generator</span>
        </nav>

        {/* HERO */}
        <section className="rounded-2xl overflow-hidden border border-violet-500/15 bg-gradient-to-br from-violet-500/5 via-card to-purple-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <BookOpen className="w-3.5 h-3.5" /> Text Utilities
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Lorem Ipsum Generator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Populate client wireframes and web layouts instantly with structured dummy latin copy. Output specific quantities partitioned by generic words, short phrases, or heavy paragraph blocks.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Layers className="w-3.5 h-3.5" /> Structured Output</span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><Check className="w-3.5 h-3.5" /> Typographic Integrity</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* INTEGRATED BUILDER */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-violet-500/20 shadow-lg shadow-violet-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-violet-400 to-indigo-600" />
                <div className="bg-card p-6 md:p-8">

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    <div className="md:col-span-2">
                       <label className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest block">Output Formatting Style</label>
                       <div className="flex bg-muted p-1 rounded-xl w-fit">
                          {["paragraphs", "sentences", "words"].map((t) => (
                             <button
                                key={t}
                                onClick={() => setType(t as any)}
                                className={`px-4 sm:px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${type === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                             >
                                {t}
                             </button>
                          ))}
                       </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest block">Total Count</label>
                      <input 
                        type="number" 
                        min="1" max="100" 
                        className="tool-calc-input w-full"
                        value={count} 
                        onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))} 
                      />
                    </div>
                  </div>

                  <div className="bg-muted/30 p-6 rounded-xl border border-border relative group min-h-[250px] shadow-inner">
                     <textarea readOnly value={generatedHTML} className="w-full h-full min-h-[250px] bg-transparent font-medium text-foreground text-sm resize-none focus:outline-none placeholder-muted-foreground leading-relaxed selection:bg-violet-500/30 selection:text-violet-200" />
                     
                     <div className="absolute top-4 right-4 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={handleCopy} className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-violet-600 hover:bg-violet-500 text-white'}`}>
                            {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Output</>}
                         </button>
                     </div>
                  </div>

                </div>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="documentation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why We Use Lorem Ipsum</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available to test layout proportions and geometric constraints.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div className="p-5 border border-border rounded-xl bg-muted/30">
                   <h3 className="text-sm font-bold text-foreground mb-2 uppercase tracking-widest flex items-center gap-2"><Text className="w-4 h-4 text-violet-500"/> Typography Checking</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">It consists of a somewhat natural spread of letters, preventing the visual rhythm disruption caused by writing `content here, content here` which tricks the eye towards pattern repeating rather than font weighting.</p>
                </div>
                <div className="p-5 border border-border rounded-xl bg-muted/30">
                   <h3 className="text-sm font-bold text-foreground mb-2 uppercase tracking-widest flex items-center gap-2"><PenTool className="w-4 h-4 text-indigo-500"/> Avoiding Distractions</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">A client viewing a mockup filled with readable logic will naturally read the logic, skipping visual evaluation of UX. Unintelligible latin maintains pure visual UX focus during sprint reviews.</p>
                </div>
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-4">
              <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Text Options</h3>
              <div className="space-y-0.5">
                {RELATED.map(t => (
                  <Link key={t.slug} href={`/${t.cat}/${t.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                    <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${t.color} 70% 55%), hsl(${t.color} 75% 42%))` }}>{t.icon}</div>
                    <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{t.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{t.benefit}</p></div>
                    <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-violet-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
