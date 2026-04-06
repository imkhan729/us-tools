import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Code, ArrowRight,
  Zap, Smartphone, Shield, Copy, Check,
  BadgeCheck, Settings, FileJson, AlertTriangle, Play, RefreshCcw
} from "lucide-react";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-slate-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-slate-500">
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
  { title: "Base64 Encoder",    slug: "base64-encoder-decoder",cat: "developer", icon: <Code className="w-5 h-5" />,       color: 217, benefit: "Safely encode data objects" },
  { title: "URL Slug Generator",slug: "slug-generator",        cat: "developer", icon: <FileJson className="w-5 h-5" />,   color: 220, benefit: "Generate readable slugs" },
  { title: "Text to Binary",    slug: "text-to-binary-converter",cat:"developer",icon: <Settings className="w-5 h-5" />,   color: 160, benefit: "Convert ASCII text to binary" },
];

export default function JsonFormatter() {
  const [inputVal, setInputVal] = useState("");
  const [indent, setIndent] = useState("2");
  
  const [copied, setCopied] = useState(false);

  const formatted = useMemo(() => {
    if (!inputVal.trim()) return { text: "", error: "" };
    try {
      // 1. Parse JSON
      // Handle edge case where users paste JS objects instead of strict JSON (unquoted keys, single quotes)
      // For strict true JSON:
      let parsed = JSON.parse(inputVal);
      // 2. Stringify with indent
      let spacing = indent === "tab" ? "\t" : parseInt(indent);
      return { text: JSON.stringify(parsed, null, spacing), error: "" };
    } catch (e: any) {
      return { text: "", error: e.message || "Invalid JSON syntax." };
    }
  }, [inputVal, indent]);

  const copyResult = () => {
    if (!formatted.text) return;
    navigator.clipboard.writeText(formatted.text);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  
  const minify = () => {
    try {
      const parsed = JSON.parse(inputVal);
      setInputVal(JSON.stringify(parsed));
    } catch(e) {}
  };

  const sampleJson = () => {
    setInputVal(`{"product":{"name":"Coffee Maker","available":false,"tags":["home","kitchen","electric"]},"price":49.99}`);
  };

  return (
    <Layout>
      <SEO
        title="JSON Formatter & Beautifier – Validate and Format JSON Online | US Online Tools"
        description="Free online JSON formatter, validator, and beautifier. Format messy JSON strings into readable indented code, validate syntax, and minify JSON data instantly."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-500" strokeWidth={3} />
          <Link href="/category/developer" className="text-muted-foreground hover:text-foreground transition-colors">Developer Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-500" strokeWidth={3} />
          <span className="text-foreground">JSON Formatter &amp; Beautifier</span>
        </nav>

        {/* HERO */}
        <section className="rounded-2xl overflow-hidden border border-slate-500/15 bg-gradient-to-br from-slate-500/5 via-card to-gray-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <FileJson className="w-3.5 h-3.5" /> Data Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">JSON Formatter <span className="text-slate-500">&amp;</span> Beautifier</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Format, validate, prettify, and minify messy JSON data seamlessly. Our client-side parser instantly catches syntax errors and outputs perfectly indented JSON blocks ready for copy-pasting.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Zap className="w-3.5 h-3.5" /> Instant Validation</span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-500/20"><Shield className="w-3.5 h-3.5" /> Private (Client-Side)</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* TOOL WIDGET */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-slate-500/20 shadow-lg shadow-slate-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-slate-500 to-gray-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-500 to-gray-400 flex items-center justify-center flex-shrink-0">
                        <Code className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">JSON Input block</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button onClick={sampleJson} className="px-3 py-1.5 bg-muted text-foreground text-xs font-bold rounded hover:bg-muted/80 transition-colors">
                        Load Sample
                      </button>
                      <button onClick={() => setInputVal("")} className="px-3 py-1.5 bg-muted text-foreground text-xs font-bold rounded hover:bg-muted/80 transition-colors">
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 210 } as React.CSSProperties}>
                    <div className="mb-4">
                      <textarea
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder="Paste your raw JSON or JavaScript Object array here..."
                        className="tool-calc-textarea h-48 md:h-64 min-h-[12rem]"
                        spellCheck="false"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Indent Space:</label>
                        <select
                          value={indent}
                          onChange={(e) => setIndent(e.target.value)}
                          className="px-3 py-2 rounded-lg bg-background border border-border text-sm font-bold outline-none focus:border-slate-500"
                        >
                          <option value="2">2 Spaces</option>
                          <option value="3">3 Spaces</option>
                          <option value="4">4 Spaces</option>
                          <option value="tab">Tab Character</option>
                        </select>
                      </div>
                      
                      <button onClick={minify} disabled={!inputVal || !!formatted.error} className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${!inputVal || formatted.error ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed" : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 hover:bg-slate-500/20"}`}>
                        Minify (Compress)
                      </button>
                    </div>

                    {/* Results / Error View */}
                    <AnimatePresence mode="wait">
                      {inputVal.trim() && formatted.error && (
                        <motion.div key="error" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-red-600 dark:text-red-400 mb-1 leading-snug">Invalid JSON Error</p>
                            <p className="text-sm text-red-600/80 dark:text-red-400/80 font-mono break-all">{formatted.error}</p>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">Please ensure keys are wrapped in double quotes (") and all brackets/braces map correctly without hanging commas.</p>
                          </div>
                        </motion.div>
                      )}
                      
                      {formatted.text && !formatted.error && (
                         <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                          <div className="relative group">
                            <div className="absolute top-0 right-0 p-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={copyResult} className="px-3 py-1.5 bg-slate-600 text-white font-bold text-xs rounded shadow hover:bg-slate-700 transition-colors flex items-center gap-1.5">
                                 {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy JSON</>}
                               </button>
                            </div>
                            <pre className="tool-calc-output w-full h-96 overflow-auto overflow-x-auto p-5 text-sm shadow-inner">
                              <code>{formatted.text}</code>
                            </pre>
                          </div>
                       </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How JSON Validation Works</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                JSON (JavaScript Object Notation) is a lightweight format for data exchange used extensively in developing modern APIs and web configurations. Formatting massive, single-line JSON responses manually is notoriously difficult.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Catch Hanging Commas &amp; String Quotes</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Unlike JavaScript, pure JSON demands that all Object layer 'keys' be enclosed entirely within double-quotes (<code>"name": "john"</code>). Our validator catches single quotes or missing structural brackets instantaneously inside your browser cache.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Prettify Unreadable Arrays</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Most server-side databases compress payload exports via Minification to minimize network transfer speeds. You can paste those massive blocks here—our tool automatically recursively expands nodes back into human-readable indentations.</p>
                  </div>
                </li>
              </ol>
            </section>

            {/* QUICK EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Common JSON Errors</h2>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 border border-border rounded-xl">
                  <p className="text-sm font-bold text-red-500 mb-2">Wrong (Trailing Comma)</p>
                  <pre className="text-xs font-mono bg-background p-3 flex rounded border border-border text-foreground">
                    <code>{"{\n  \"key\": \"value\",\n}"}</code>
                  </pre>
                  <p className="text-sm text-emerald-500 mt-3 mb-2 font-bold">Right (No Trailing Comma)</p>
                  <pre className="text-xs font-mono bg-background p-3 flex rounded border border-border text-foreground">
                    <code>{"{\n  \"key\": \"value\"\n}"}</code>
                  </pre>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">FAQ</h2>
              <div className="space-y-3">
                <FaqItem q="Does my JSON data go to a server?" a="No. For privacy & security reasons, our formatter relies exclusively on your web browser's built-in V8 Javascript runtime engine via `JSON.parse()`. There are zero API calls transmitting your typed text to remote servers." />
                <FaqItem q="Why does the validator highlight errors on 'false', '0', or text keys?" a="Raw JSON specifications strictly disallow unquoted strings for property keys. Furthermore, Boolean values must exactly match `true` or `false` (all lowercase without quotes) and integer arrays must not have leading zeroes." />
                <FaqItem q="What is Minifying?" a="JSON Minifying reverses formatting. It strips out spaces, tabs, and line-breaks. Generating a single, continuous string line heavily reduces file sizes for database inserts." />
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-slate-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Parser Tool","How to Use", "JSON Errors", "FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g,"-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-slate-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-slate-500/40 flex-shrink-0" />{label}
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
