import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Code, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, ArrowLeftRight, Hash, FileText, Terminal
} from "lucide-react";

function textToBinary(text: string, sep: string): string {
  return text.split("").map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(sep);
}
function binaryToText(bin: string): string {
  const clean = bin.replace(/[^01\s]/g, "").trim();
  const bytes = clean.split(/\s+/).filter(b => b.length > 0);
  try { return bytes.map(b => String.fromCharCode(parseInt(b, 2))).join(""); }
  catch { return ""; }
}
function textToHex(text: string): string {
  return text.split("").map(c => c.charCodeAt(0).toString(16).padStart(2, "0").toUpperCase()).join(" ");
}
function textToDecimal(text: string): string {
  return text.split("").map(c => c.charCodeAt(0)).join(" ");
}
function textToAscii(text: string): string {
  return text.split("").map(c => `${c}=${c.charCodeAt(0)}`).join("  ");
}

type Mode = "textToBin" | "binToText";
type Format = "binary" | "hex" | "decimal" | "ascii";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-cyan-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-cyan-500">
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
  { title: "Base64 Encoder/Decoder", slug: "base64-encoder-decoder",   cat: "developer",    icon: <Terminal className="w-5 h-5" />,  color: 25,  benefit: "Encode & decode Base64 strings" },
  { title: "Binary to Decimal",      slug: "binary-to-decimal-converter", cat: "conversion", icon: <Hash className="w-5 h-5" />,      color: 217, benefit: "Convert binary to decimal numbers" },
  { title: "Hex to RGB Converter",   slug: "hex-to-rgb-converter",     cat: "css-design",   icon: <Code className="w-5 h-5" />,       color: 300, benefit: "Convert hex color codes to RGB" },
  { title: "Case Converter",         slug: "case-converter",           cat: "productivity", icon: <FileText className="w-5 h-5" />,   color: 152, benefit: "Change text case formatting" },
];

export default function TextToBinaryConverter() {
  const [mode, setMode] = useState<Mode>("textToBin");
  const [format, setFormat] = useState<Format>("binary");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    if (mode === "textToBin") {
      if (format === "binary")  return textToBinary(input, " ");
      if (format === "hex")     return textToHex(input);
      if (format === "decimal") return textToDecimal(input);
      if (format === "ascii")   return textToAscii(input);
    } else {
      return binaryToText(input);
    }
    return "";
  }, [input, mode, format]);

  const charCount = mode === "textToBin" ? input.length : (output.length || 0);
  const copyResult = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); };

  const FORMATS: { key: Format; label: string; example: string }[] = [
    { key: "binary",  label: "Binary",  example: "01001000 01101001" },
    { key: "hex",     label: "Hex",     example: "48 69" },
    { key: "decimal", label: "Decimal", example: "72 105" },
    { key: "ascii",   label: "ASCII",   example: "H=72  i=105" },
  ];

  return (
    <Layout>
      <SEO
        title="Text to Binary Converter – Convert Text to Binary Code Free | US Online Tools"
        description="Free text to binary converter. Convert text to binary (0s and 1s), hexadecimal, decimal, and ASCII codes instantly. Also converts binary code back to readable text. No signup required."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-cyan-500" strokeWidth={3} />
          <Link href="/category/developer" className="text-muted-foreground hover:text-foreground transition-colors">Developer Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-cyan-500" strokeWidth={3} />
          <span className="text-foreground">Text to Binary Converter</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-cyan-500/15 bg-gradient-to-br from-cyan-500/5 via-card to-blue-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Code className="w-3.5 h-3.5" /> Developer &amp; Encoding Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Text to Binary Converter</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Convert any text to binary code (0s and 1s), hexadecimal, decimal, or ASCII character codes instantly. Also decode binary back to readable text. Used by students, developers, and cybersecurity learners worldwide.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Zap className="w-3.5 h-3.5" /> Instant Convert</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Developer &amp; Encoding Tools &nbsp;·&nbsp; Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* TOOL WIDGET */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 to-blue-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center flex-shrink-0">
                      <Code className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Text ↔ Binary Converter</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 190 } as React.CSSProperties}>
                    {/* Mode toggle */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                      <button onClick={() => setMode("textToBin")} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all ${mode === "textToBin" ? "bg-cyan-500 border-cyan-500 text-white" : "border-border text-muted-foreground hover:border-cyan-500/40"}`}>
                        Text → Binary
                      </button>
                      <button onClick={() => setMode("binToText")} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all ${mode === "binToText" ? "bg-cyan-500 border-cyan-500 text-white" : "border-border text-muted-foreground hover:border-cyan-500/40"}`}>
                        <ArrowLeftRight className="w-3.5 h-3.5" /> Binary → Text
                      </button>
                    </div>

                    {/* Format selector (only for text→bin) */}
                    {mode === "textToBin" && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {FORMATS.map(f => (
                          <button key={f.key} onClick={() => setFormat(f.key)} className={`px-3 py-1.5 rounded-lg border-2 font-bold text-xs transition-all ${format === f.key ? "bg-cyan-500 border-cyan-500 text-white" : "border-border text-muted-foreground hover:border-cyan-500/40"}`}>
                            {f.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest block">
                          {mode === "textToBin" ? "Input Text" : "Binary Input (space-separated bytes)"}
                          {input && <span className="text-cyan-500 ml-2">({input.length} chars)</span>}
                        </label>
                        <textarea
                          value={input}
                          onChange={e => setInput(e.target.value)}
                          placeholder={mode === "textToBin" ? "Type or paste text here…" : "01001000 01100101 01101100 01101100 01101111"}
                          className="w-full h-44 p-4 rounded-xl bg-background border-2 border-border focus:border-cyan-500 outline-none font-mono text-sm leading-relaxed resize-none"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            {mode === "textToBin" ? FORMATS.find(f => f.key === format)?.label + " Output" : "Decoded Text"}
                          </label>
                          {output && (
                            <button onClick={copyResult} className="flex items-center gap-1.5 text-xs text-cyan-600 font-bold hover:text-cyan-700 transition-colors">
                              {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                            </button>
                          )}
                        </div>
                        <textarea
                          readOnly
                          value={output}
                          placeholder="Output appears here…"
                          className="w-full h-44 p-4 rounded-xl bg-cyan-500/5 border-2 border-cyan-500/20 font-mono text-sm leading-relaxed resize-none text-cyan-700 dark:text-cyan-300 break-all"
                        />
                      </div>
                    </div>

                    {output && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {mode === "textToBin"
                              ? `${input.length} character${input.length === 1 ? "" : "s"} converted. Each character is represented as an 8-bit (1 byte) value. The output uses UTF-8/ASCII encoding — each character maps to a number 0–127 (standard ASCII) or higher for extended characters.`
                              : `Binary decoded to ${output.length} character${output.length === 1 ? "" : "s"}. Each space-separated 8-bit group is converted from base-2 to its ASCII character equivalent.`}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* HOW TO USE */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Text to Binary Converter</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Binary representation — sequences of 0s and 1s — is the foundational language of all digital computing. This converter makes it easy to see how any piece of text is represented at the byte level, and to decode binary messages back into readable text.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Choose conversion direction</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Select <strong className="text-foreground">Text → Binary</strong> to convert human-readable text into binary (or other numeric formats). Select <strong className="text-foreground">Binary → Text</strong> to decode a binary string back into readable text — useful for decoding binary-encoded messages, puzzle answers, or educational exercises.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Select your output format (Text → Binary mode)</p>
                    <p className="text-muted-foreground text-sm leading-relaxed"><strong className="text-foreground">Binary</strong> — 8-bit groups of 0s and 1s (e.g., 01001000). <strong className="text-foreground">Hex</strong> — two-digit hexadecimal (base-16) values (e.g., 48). <strong className="text-foreground">Decimal</strong> — base-10 ASCII code (e.g., 72 for "H"). <strong className="text-foreground">ASCII</strong> — character-and-code pairs for quick reference (e.g., H=72).</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Type or paste your input, then copy the output</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Conversion is instant as you type. Click "Copy" to grab the output for use in code, documentation, or messaging. For binary-to-text decoding, enter space-separated 8-bit binary groups (each group represents one character).</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Format Reference — "Hello" (H=72, e=101, l=108, l=108, o=111)</p>
                <div className="space-y-2">
                  {FORMATS.map(f => (
                    <div key={f.key} className="flex items-center gap-3">
                      <span className="text-cyan-500 font-bold text-xs w-16 flex-shrink-0">{f.label}</span>
                      <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">{f.example}</code>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* RESULT INTERPRETATION */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Understanding Binary Encoding</h2>
              <p className="text-muted-foreground text-sm mb-6">What the different output formats represent:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                  <div className="w-3 h-3 rounded-full bg-cyan-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Binary — The Machine's Native Language</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Binary (base-2) is how computers natively store and process data. Each character is encoded as 8 bits (one byte). The letter "A" is stored as 01000001, "a" as 01100001. The difference between uppercase and lowercase is a single bit — bit 5 (the 32 position), which is 0 for uppercase and 1 for lowercase.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Hexadecimal — Compact Binary Representation</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Hexadecimal (base-16) is a human-friendlier way to write binary data. Each hexadecimal digit represents exactly 4 bits, so two hex digits represent one byte. Developers use hex extensively: CSS color codes (#FF5733), memory addresses (0x0040F000), and cryptographic hashes (SHA-256 outputs) are all hex-encoded binary data.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                  <div className="w-3 h-3 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">ASCII Code — The Character Encoding Standard</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The ASCII (American Standard Code for Information Interchange) table defines 128 characters (0-127), including uppercase letters (65-90), lowercase letters (97-122), digits (48-57), and control characters (0-31). Knowing ASCII codes is fundamental for low-level programming, network protocol parsing, and byte manipulation.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* QUICK EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Common Text to Binary Conversions</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Character</th><th className="text-left px-4 py-3 font-bold text-foreground">Binary</th><th className="text-left px-4 py-3 font-bold text-foreground">Hex</th><th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Decimal (ASCII)</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    {[["A","01000001","41","65"],["a","01100001","61","97"],["0","00110000","30","48"],["Space","00100000","20","32"],["!","00100001","21","33"]].map(([c,b,h,d]) => (
                      <tr key={c} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-mono font-bold text-foreground">{c}</td>
                        <td className="px-4 py-3 font-mono text-cyan-600 dark:text-cyan-400">{b}</td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">{h}</td>
                        <td className="px-4 py-3 font-mono text-muted-foreground hidden sm:table-cell">{d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Educational applications:</strong> This tool is widely used in computer science education. Students learning about data representation, networking, cryptography, and low-level programming frequently need to verify binary conversions. Converting a word to its binary representation makes the concept of "data as numbers" tangible and verifiable.</p>
                <p><strong className="text-foreground">Cybersecurity and CTF challenges:</strong> Capture The Flag (CTF) competitions frequently encode hidden messages in binary, hex, or ASCII sequences. This tool's bidirectional conversion (especially the Binary → Text decoder) is useful for decoding binary-encoded flags, steganographic messages, and obfuscated text across a wide range of encoding challenges.</p>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_,i)=><svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Finally a text-to-binary tool that also does hex and decimal in the same place. Perfect for my CS homework — I can verify all three representations at once without switching tools."</p>
                <p className="text-xs text-muted-foreground mt-2">— Student feedback, 2025</p>
              </div>
            </section>

            {/* WHY CHOOSE THIS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Text to Binary Converter?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Four output formats in one tool.</strong> Most text-to-binary converters only produce binary. This tool outputs binary, hexadecimal, decimal ASCII codes, and character-code pairs — giving you everything you need for CS homework, debugging, or reference without switching between multiple tools.</p>
                <p><strong className="text-foreground">Bidirectional: decode binary back to text.</strong> The Binary → Text mode decodes space-separated 8-bit binary sequences back to readable text — essential for decoding messages, verifying encoding, and checking CTF challenge outputs. This reverse direction is often missing from simpler converters.</p>
                <p><strong className="text-foreground">Real-time conversion as you type.</strong> Conversion happens character by character as you type — no submit button, no page reload. This makes the tool ideal for interactive learning where you can watch the binary representation change live as you add characters.</p>
                <p><strong className="text-foreground">Full UTF-8/ASCII support.</strong> Any printable ASCII character (space, punctuation, digits) is correctly encoded. Extended ASCII and basic special characters are also supported since the converter uses JavaScript's native charCodeAt() method, which handles the full Unicode code point range.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> This tool uses ASCII/UTF-8 single-byte encoding (charCode 0-255). Multi-byte Unicode characters (emoji, CJK characters, etc.) will be encoded as their Unicode code point value, not their UTF-8 multi-byte sequence. For multi-byte UTF-8 binary encoding, specialized tools are required.</p>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What does text to binary conversion mean?" a="Every character on your keyboard has a numeric code assigned by the ASCII (American Standard Code for Information Interchange) standard. For example, 'H' is 72, 'i' is 105. Converting text to binary means expressing each character's ASCII number in base-2 (binary) — 72 becomes 01001000, 105 becomes 01101001. Computers store all text this way internally." />
                <FaqItem q="Why is each binary group 8 digits (bits) long?" a="Eight bits make one byte — the fundamental unit of computer memory. The ASCII standard uses 7 bits (128 characters), but modern systems use 8-bit bytes as the standard storage unit. The leading zero pads 7-bit ASCII values to fit the 8-bit byte format. One character = one byte = eight binary digits." />
                <FaqItem q="How do I decode binary back to text?" a="Switch to 'Binary → Text' mode using the toggle button. Paste your binary string with spaces between each 8-bit byte group (e.g., '01001000 01100101 01101100 01101100 01101111'). Each 8-bit group is converted from binary to its decimal ASCII code, then mapped to the corresponding character." />
                <FaqItem q="What is the difference between binary and hexadecimal?" a="Binary (base-2) uses digits 0 and 1. Hexadecimal (base-16) uses digits 0-9 and A-F. Four binary digits equal one hex digit, so two hex digits represent one byte — making hex a much more compact notation. The letter 'H' (01000001 in binary) is simply '41' in hex — the same value, far fewer characters to write." />
                <FaqItem q="Can I convert numbers to binary with this tool?" a="Yes — type any digit characters and the tool converts them. Note that typing '65' converts the text characters '6' and '5' (ASCII 54 and 53) to binary, not the number 65. To convert the number 65 to binary, use the Binary to Decimal Converter which handles numeric base conversion specifically." />
              </div>
            </section>

            {/* CTA */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Explore More Developer Tools</h2>
                <p className="text-white/80 mb-6 max-w-lg">400+ free encoding, conversion, and developer utilities — instant results, no account needed.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-cyan-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">Explore All Tools <ArrowRight className="w-4 h-4" /></Link>
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-cyan-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share with students and developers.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {linkCopied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Converter","How to Use","Result Interpretation","Quick Examples","Why Choose This","FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g,"-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-cyan-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-cyan-500/40 flex-shrink-0" />{label}
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
