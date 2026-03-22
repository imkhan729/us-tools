import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock,
  Code, Lightbulb, Copy, Check,
  FileCode, Binary, Lock, Hash, Braces,
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

const RELATED_TOOLS = [
  { title: "JSON Formatter", slug: "json-formatter", icon: <Braces className="w-5 h-5" />, color: 217 },
  { title: "URL Encoder/Decoder", slug: "url-encoder-decoder", icon: <Code className="w-5 h-5" />, color: 152 },
  { title: "Password Generator", slug: "password-generator", icon: <Lock className="w-5 h-5" />, color: 340 },
  { title: "Lorem Ipsum Generator", slug: "lorem-ipsum-generator", icon: <FileCode className="w-5 h-5" />, color: 25 },
  { title: "Hash Generator", slug: "hash-generator", icon: <Hash className="w-5 h-5" />, color: 265 },
  { title: "Word Counter", slug: "word-counter", icon: <Binary className="w-5 h-5" />, color: 45 },
];

export default function Base64EncoderDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);

  const handleConvert = () => {
    setError("");
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch {
      setError(mode === "decode" ? "Invalid Base64 string. Please check your input." : "Could not encode the input text.");
      setOutput("");
    }
  };

  const handleSwap = () => {
    setMode(m => m === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput("");
    setError("");
  };

  const copyResult = () => { navigator.clipboard.writeText(output); setCopiedResult(true); setTimeout(() => setCopiedResult(false), 2000); };
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <Layout>
      <SEO
        title="Base64 Encoder/Decoder - Free Online Tool | Encode & Decode Base64 Strings"
        description="Free online Base64 encoder and decoder. Convert text to Base64 and Base64 to text instantly. Supports UTF-8 characters. No signup required."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/developer" className="text-muted-foreground hover:text-foreground transition-colors">Developer Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Base64 Encoder/Decoder</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            <section>
              <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Code className="w-3.5 h-3.5" /> Developer Tools
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">Base64 Encoder / Decoder</h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Encode text to Base64 or decode Base64 strings back to readable text. Supports UTF-8 characters, instant conversion, and runs entirely in your browser — free and private.
              </p>
            </section>

            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Zap className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="font-bold text-foreground text-sm">Quick conversion</p>
                <p className="text-muted-foreground text-sm">Paste your text or Base64 string, choose encode/decode, and click Convert.</p>
              </div>
            </section>

            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 265 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Base64 Encoder / Decoder</h3>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => { setMode("encode"); setOutput(""); setError(""); }} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === "encode" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>Encode</button>
                  <button onClick={() => { setMode("decode"); setOutput(""); setError(""); }} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === "decode" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>Decode</button>
                  <button onClick={handleSwap} className="ml-auto px-3 py-2 rounded-lg text-sm font-bold bg-muted text-muted-foreground hover:text-foreground transition-all">⇄ Swap</button>
                </div>

                <div className="space-y-4 mb-5">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">{mode === "encode" ? "Text to Encode" : "Base64 to Decode"}</label>
                    <textarea
                      rows={5}
                      placeholder={mode === "encode" ? "Enter text to encode to Base64..." : "Enter Base64 string to decode..."}
                      className="tool-calc-input w-full resize-y font-mono text-sm"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                    />
                  </div>

                  <button onClick={handleConvert} className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                    {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
                  </button>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">{error}</div>
                  )}

                  {output && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm font-semibold text-muted-foreground">Result</label>
                        <button onClick={copyResult} className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1">
                          {copiedResult ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                        </button>
                      </div>
                      <textarea rows={5} readOnly className="tool-calc-input w-full resize-y font-mono text-sm bg-muted/30" value={output} />
                    </div>
                  )}
                </div>

                {output && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex gap-2 items-start">
                      <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {mode === "encode"
                          ? `Encoded ${input.length} characters into a ${output.length}-character Base64 string. Base64 encoding increases data size by approximately 33%.`
                          : `Decoded ${input.length}-character Base64 string into ${output.length} characters of plain text.`}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How Base64 Encoding Works</h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Binary Conversion</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Each character is converted to its 8-bit binary representation. For example, "Hi" becomes <code className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">01001000 01101001</code>.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">6-Bit Grouping</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">The binary stream is split into 6-bit groups. Each 6-bit group maps to one of 64 characters: A-Z, a-z, 0-9, +, and /. Padding (=) is added if needed.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Safe Text Output</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">The result is an ASCII-safe string that can be safely transmitted through text-based protocols like email, JSON, URLs, and HTML without data corruption.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2"><Code className="w-4 h-4 text-blue-500" /><h4 className="font-bold text-foreground text-sm">API Authentication</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">HTTP Basic Auth encodes <strong className="text-foreground">username:password</strong> to Base64 for secure header transmission.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2"><FileCode className="w-4 h-4 text-emerald-500" /><h4 className="font-bold text-foreground text-sm">Data URIs</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Embed small images directly in CSS/HTML using <strong className="text-foreground">data:image/png;base64,...</strong> format.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2"><Lock className="w-4 h-4 text-purple-500" /><h4 className="font-bold text-foreground text-sm">JWT Tokens</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">JSON Web Tokens use Base64URL encoding for the header, payload, and signature segments.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2"><Binary className="w-4 h-4 text-amber-500" /><h4 className="font-bold text-foreground text-sm">Email Attachments</h4></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">MIME encoding uses Base64 to send binary file attachments safely through email protocols.</p>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Tool?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Instant encode/decode with one click" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Full UTF-8 character support" },
                  { icon: <Shield className="w-4 h-4" />, text: "100% client-side — your data stays private" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Works on all devices and browsers" },
                  { icon: <Clock className="w-4 h-4" />, text: "No signup or installation required" },
                  { icon: <Code className="w-4 h-4" />, text: "Developer-friendly with copy button" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">What Is Base64 Encoding?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>Base64 is a binary-to-text encoding scheme that converts binary data into a set of 64 printable ASCII characters. It is widely used in web development, APIs, email protocols, and data storage to safely transmit binary data through text-based channels.</p>
                <p>This free online Base64 encoder/decoder helps developers, designers, and anyone who needs to quickly convert text to Base64 or decode Base64 strings. All processing happens locally in your browser — nothing is sent to any server.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">Common Uses for Base64 Encoding</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Embedding images in HTML/CSS using data URIs",
                    "Encoding API credentials for HTTP Basic Authentication headers",
                    "Storing binary data in JSON, XML, or other text formats",
                    "Creating and decoding JWT (JSON Web Token) payloads",
                    "Encoding email attachments via MIME protocol",
                    "Transmitting binary data through WebSocket text frames",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" /><span>{item}</span></li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is Base64 encoding?" a="Base64 is a method of encoding binary data using 64 printable ASCII characters (A-Z, a-z, 0-9, +, /). It converts binary or UTF-8 text into an ASCII-safe string that can be safely transmitted through text-based protocols." />
                <FaqItem q="Is Base64 encryption?" a="No. Base64 is encoding, not encryption. It does not provide any security — anyone can decode a Base64 string. For actual encryption, use AES, RSA, or other cryptographic methods." />
                <FaqItem q="Why does Base64 increase data size?" a="Base64 uses 6 bits per character instead of 8, which means every 3 bytes of input become 4 characters of output — a 33% size increase. This trade-off enables safe transmission through text channels." />
                <FaqItem q="Does this tool support UTF-8?" a="Yes. This encoder handles full UTF-8 text including emojis, accented characters, Chinese/Japanese/Korean characters, and other multi-byte Unicode characters." />
                <FaqItem q="Is my data safe?" a="100% safe. All encoding and decoding happens in your browser. No data is ever sent to any server." />
                <FaqItem q="What's the difference between Base64 and Base64URL?" a="Base64URL replaces '+' with '-' and '/' with '_', and omits padding '='. It is used in URLs, filenames, and JWTs where standard Base64 characters could cause issues." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Developer Tools</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">Explore JSON formatters, hash generators, URL encoders, and 400+ more free tools for developers.</p>
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
                <p className="text-sm text-muted-foreground mb-4">Help others encode & decode Base64 easily.</p>
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
