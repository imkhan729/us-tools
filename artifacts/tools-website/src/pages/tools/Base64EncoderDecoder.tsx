import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Check, ArrowRight, ArrowLeftRight,
  Zap, Shield, Copy, Code2, Webhook, FileJson
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
  { title: "JSON Formatter", slug: "json-formatter", cat: "developer", icon: <FileJson className="w-5 h-5"/>, color: 170, benefit: "Beautify & validate JSON" },
  { title: "URL Encoder", slug: "url-encoder-decoder", cat: "developer", icon: <Webhook className="w-5 h-5"/>, color: 100, benefit: "Parse custom URLs" },
  { title: "Text to Binary", slug: "text-to-binary-converter", cat: "developer", icon: <Code2 className="w-5 h-5"/>, color: 90, benefit: "Convert string to bytes" },
];

export default function Base64EncoderDecoder() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [errorStr, setErrorStr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const processText = (text: string, currentMode: "encode" | "decode") => {
    setInput(text);
    setErrorStr(null);
    if (!text) { setOutput(""); return; }

    try {
      if (currentMode === "encode") {
        // Handle utf-8 characters properly
        const encoded = btoa(unescape(encodeURIComponent(text)));
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(text)));
        setOutput(decoded);
      }
    } catch (e: any) {
      setOutput("");
      setErrorStr(currentMode === "decode" ? "Malformed string: Invalid Base64 payload." : "Encoding failed.");
    }
  };

  const flipMode = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    processText(output, newMode);
  };

  const copyResult = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Base64 Encoder & Decoder – Convert Text and Data Online"
        description="Free online Base64 Encoder and Decoder. Instantly convert ASCII text to Base64 hashes, or decode Base64 back into human-readable strings."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-500" strokeWidth={3} />
          <Link href="/category/developer" className="text-muted-foreground hover:text-foreground transition-colors">Developer Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-500" strokeWidth={3} />
          <span className="text-foreground">Base64 Encoder/Decoder</span>
        </nav>

        {/* HERO */}
        <section className="rounded-2xl overflow-hidden border border-slate-500/15 bg-gradient-to-br from-slate-500/5 via-card to-gray-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Code2 className="w-3.5 h-3.5" /> String Manipulation
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Base64 Converter</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            A fast, client-side utility for translating raw ASCII string data into Base64 format and vice versa. Fully supports UTF-8 Unicode characters and emojis natively.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><Shield className="w-3.5 h-3.5" /> Client-Side Only</span>
            <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs px-3 py-1.5 rounded-full border border-sky-500/20"><Webhook className="w-3.5 h-3.5" /> UTF-8 Support</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* PROCESSOR */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-slate-500/20 shadow-lg shadow-slate-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-slate-400 to-gray-600" />
                <div className="bg-card p-6 md:p-8">
                  
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex bg-muted p-1 rounded-xl">
                      <button onClick={() => { setMode("encode"); processText(input,"encode"); }} className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${mode === "encode" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Encode text</button>
                      <button onClick={() => { setMode("decode"); processText(input,"decode"); }} className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${mode === "decode" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Decode hash</button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <label className="text-xs font-bold text-muted-foreground mb-2 flex justify-between items-end uppercase tracking-widest">
                        <span>{mode === "encode" ? 'Input String' : 'Input Base64'}</span>
                      </label>
                      <textarea 
                        value={input}
                        onChange={(e) => processText(e.target.value, mode)}
                        placeholder={mode === "encode" ? "Type raw text here (e.g., Hello World)..." : "Type base64 hash here (e.g., SGVsbG8gV29ybGQ=)..."}
                        className="w-full h-40 font-mono text-sm p-4 bg-background border border-border rounded-xl focus:ring-2 focus:ring-slate-500/50 transition-all resize-none placeholder:opacity-50"
                      />
                    </div>

                    <div className="flex justify-center -my-2 relative z-10">
                      <button onClick={flipMode} className="bg-slate-600 hover:bg-slate-700 text-white p-3 rounded-full border-4 border-card transition-colors shadow-md" title="Swap input and output">
                        <ArrowLeftRight className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="relative">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                          <span>{mode === "encode" ? 'Base64 Output' : 'Plain Text Output'}</span>
                        </label>
                        {errorStr && <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md">{errorStr}</span>}
                      </div>

                      <div className="relative group">
                        <textarea
                          readOnly
                          value={output}
                          className={`w-full h-40 font-mono text-sm p-4 bg-zinc-950 text-slate-300 border border-border rounded-xl transition-all resize-none shadow-inner ${errorStr ? 'border-red-500/50 ring-1 ring-red-500/20' : ''}`}
                        />
                        <button onClick={copyResult} className={`absolute bottom-4 right-4 p-2.5 rounded-lg flex items-center gap-2 font-bold text-sm transition-all shadow-md ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-zinc-950 hover:bg-white'}`}>
                           {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* DOCUMENTATION */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="documentation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How Base64 Encoding Actually Works</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Base64 is not an encryption algorithm—it is an *encoding sequence*. It strictly translates binary payloads (or arbitrary ASCII text strings) into a radix-64 representation using exclusively printable ASCII characters (`A-Z`, `a-z`, `0-9`, `+`, and `/`).
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start p-4 hover:bg-muted/30 rounded-xl transition-colors">
                  <div className="bg-slate-500/10 text-slate-600 dark:text-slate-400 p-2.5 rounded-lg flex-shrink-0"><Code2 className="w-5 h-5"/></div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1 text-sm uppercase tracking-widest">Why do we use it?</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Most legacy network protocols (like Email via SMTP or HTTP Body APIs) were historically built to only handle raw text. Transmitting binary like images or specialized JSON payloads via deep HTTP URLs caused massive data-loss and breaking syntax drops. Base64 wraps that data in a completely safe text format that all routers inherently support, preventing corruption.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start p-4 hover:bg-muted/30 rounded-xl transition-colors">
                  <div className="bg-slate-500/10 text-slate-600 dark:text-slate-400 p-2.5 rounded-lg flex-shrink-0"><Webhook className="w-5 h-5"/></div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1 text-sm uppercase tracking-widest">Does Base64 secure data?</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">No. Because it calculates on a public padding-dictionary (often denoted by the `=` equal-signs at the end), any machine can decode it instantly without a key. Never store passwords directly in Base64—use Bcrypt or SHA-hashing for actual security.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">FAQ</h2>
              <div className="space-y-3">
                <FaqItem q="What does the equal sign (=) at the end mean?" a="MIME Base64 algorithm requires the generated string length to perfectly formulate into multiples of 3 bytes. The equals signs (=) act strictly as padding elements appended to the end of the payload to fulfill the boundary length when the text falls short." />
                <FaqItem q="Can I encode emojis with this tool?" a="Absolutely. Older Base64 encoders crash on multi-byte unicode symbols (emojis), throwing rendering errors explicitly. We securely compile strings via Window.encodeURIComponent() parsing out UTF-8 payload lengths properly before compressing to radix-64 format." />
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
                  {["I/O Processor", "Algorithm Documentation", "FAQ"].map(label => (
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
