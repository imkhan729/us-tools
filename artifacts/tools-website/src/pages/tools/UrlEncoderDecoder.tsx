import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Globe, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, ArrowLeftRight, Code, Terminal, Hash
} from "lucide-react";

type Mode = "encode" | "decode" | "encodeComponent" | "decodeComponent";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-orange-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-orange-500">
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
  { title: "Base64 Encoder/Decoder", slug: "base64-encoder-decoder",   cat: "developer",    icon: <Code className="w-5 h-5" />,     color: 25,  benefit: "Encode and decode Base64 strings" },
  { title: "JSON Formatter",         slug: "json-formatter",            cat: "developer",    icon: <Terminal className="w-5 h-5" />, color: 152, benefit: "Format and validate JSON data" },
  { title: "Text to Binary",         slug: "text-to-binary-converter",  cat: "developer",    icon: <Hash className="w-5 h-5" />,     color: 190, benefit: "Convert text to binary code" },
  { title: "Meta Tag Generator",     slug: "meta-tag-generator",        cat: "seo",          icon: <Globe className="w-5 h-5" />,    color: 217, benefit: "Generate SEO meta tags" },
];

const MODES: { key: Mode; label: string; desc: string }[] = [
  { key: "encodeComponent", label: "Encode URI Component", desc: "Encodes a query param value (most common)" },
  { key: "decodeComponent", label: "Decode URI Component", desc: "Decodes %XX-encoded query param values" },
  { key: "encode",          label: "Encode Full URI",       desc: "Encodes a full URL (preserves : / ? # &)" },
  { key: "decode",          label: "Decode Full URI",       desc: "Decodes a full percent-encoded URL" },
];

function convert(input: string, mode: Mode): { result: string; error: string } {
  try {
    let result = "";
    if (mode === "encodeComponent") result = encodeURIComponent(input);
    else if (mode === "decodeComponent") result = decodeURIComponent(input);
    else if (mode === "encode") result = encodeURI(input);
    else result = decodeURI(input);
    return { result, error: "" };
  } catch (e: any) {
    return { result: "", error: e.message || "Invalid input for decoding." };
  }
}

export default function UrlEncoderDecoder() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("encodeComponent");
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const { result, error } = useMemo(() => convert(input, mode), [input, mode]);

  const copyResult = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); };

  const encodedChars = result ? (result.match(/%[0-9A-F]{2}/g) || []).length : 0;

  return (
    <Layout>
      <SEO
        title="URL Encoder Decoder – Encode & Decode URLs Online Free | US Online Tools"
        description="Free URL encoder and decoder. Encode or decode percent-encoded URLs and URI components instantly. Supports encodeURIComponent, decodeURIComponent, encodeURI, and decodeURI. No signup required."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/developer" className="text-muted-foreground hover:text-foreground transition-colors">Developer Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">URL Encoder / Decoder</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Globe className="w-3.5 h-3.5" /> Developer Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">URL Encoder / Decoder</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Encode or decode percent-encoded URLs and URI components instantly. Supports all four JavaScript URL encoding methods. Essential for web developers, API testing, link building, and debugging URL-related issues.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20"><Zap className="w-3.5 h-3.5" /> Instant Encode</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Developer Tools &nbsp;·&nbsp; Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            <section>
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0"><Globe className="w-4 h-4 text-white" /></div>
                    <div><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">URL Encoder / Decoder</p><p className="text-sm text-muted-foreground">Results update as you type — choose your encoding mode below.</p></div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 30 } as React.CSSProperties}>
                    {/* Mode selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                      {MODES.map(m => (
                        <button key={m.key} onClick={() => setMode(m.key)} className={`p-3 rounded-xl border-2 text-left transition-all ${mode === m.key ? "bg-orange-500 border-orange-500 text-white" : "border-border hover:border-orange-500/40"}`}>
                          <p className={`text-xs font-bold ${mode === m.key ? "text-white" : "text-foreground"}`}>{m.label}</p>
                          <p className={`text-[10px] mt-0.5 ${mode === m.key ? "text-orange-100" : "text-muted-foreground"}`}>{m.desc}</p>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest block">
                          Input {input && <span className="text-orange-500">({input.length} chars)</span>}
                        </label>
                        <textarea
                          value={input}
                          onChange={e => setInput(e.target.value)}
                          placeholder={mode.startsWith("encode") ? "https://example.com/search?q=hello world&lang=en" : "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world"}
                          className="w-full h-44 p-4 rounded-xl bg-background border-2 border-border focus:border-orange-500 outline-none font-mono text-sm leading-relaxed resize-none"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Output {encodedChars > 0 && <span className="text-orange-500">({encodedChars} encoded chars)</span>}
                          </label>
                          {result && (
                            <button onClick={copyResult} className="flex items-center gap-1.5 text-xs text-orange-600 font-bold hover:text-orange-700 transition-colors">
                              {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                            </button>
                          )}
                        </div>
                        <textarea
                          readOnly
                          value={error || result}
                          placeholder="Output appears here…"
                          className={`w-full h-44 p-4 rounded-xl border-2 font-mono text-sm leading-relaxed resize-none break-all ${error ? "bg-red-500/5 border-red-500/20 text-red-600" : "bg-orange-500/5 border-orange-500/20 text-orange-700 dark:text-orange-300"}`}
                        />
                      </div>
                    </div>

                    {result && !error && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {mode === "encodeComponent" && `${encodedChars} special character${encodedChars === 1 ? "" : "s"} percent-encoded. This output is safe to use as a query parameter value — spaces become %20, & becomes %26, = becomes %3D, and / becomes %2F.`}
                            {mode === "decodeComponent" && `Decoded successfully. ${encodedChars === 0 ? "No percent-encoded sequences found in the original." : `${encodedChars} percent-encoded sequences converted back to literal characters.`}`}
                            {mode === "encode" && `Full URI encoded. Preserves URL structure characters (: / ? # & =). Only unsafe characters like spaces and non-ASCII are encoded.`}
                            {mode === "decode" && `Full URI decoded. Structure characters are preserved; only percent-encoded characters are restored.`}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the URL Encoder / Decoder</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                URLs can only contain a limited set of ASCII characters. Special characters — spaces, accents, symbols, and non-ASCII text — must be percent-encoded before they can appear safely in a URL. This tool handles all four standard JavaScript URL encoding methods.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Choose the right encoding mode</p>
                    <p className="text-muted-foreground text-sm leading-relaxed"><strong className="text-foreground">Encode URI Component</strong> — Use this for encoding individual query parameter values, form field values, or path segments that will be inserted into a URL. This is the most commonly needed function. <strong className="text-foreground">Encode Full URI</strong> — Use this only when encoding a complete URL that already has slashes and query structure — it preserves the URL's structural characters.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Paste your URL or text into the input</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">For encoding: paste raw text containing spaces, special characters, or non-ASCII content that needs to be URL-safe. For decoding: paste a percent-encoded URL or query string (e.g., copied from a browser address bar, API response, or server log) to convert it back to readable form.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Copy the encoded or decoded output</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The output is instantly ready to copy and paste into your code, API request, browser, or documentation. The insight message explains exactly what was encoded and which characters were transformed.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Mode Reference</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-border"><th className="text-left py-2 font-bold text-foreground">Function</th><th className="text-left py-2 font-bold text-foreground">Encodes</th><th className="text-left py-2 font-bold text-foreground hidden sm:table-cell">Preserves</th></tr></thead>
                    <tbody className="divide-y divide-border">
                      <tr><td className="py-2 font-mono text-orange-600">encodeURIComponent</td><td className="py-2 text-muted-foreground">All except A-Z a-z 0-9 - _ . ! ~ * ' ( )</td><td className="py-2 text-muted-foreground hidden sm:table-cell">Unreserved chars</td></tr>
                      <tr><td className="py-2 font-mono text-orange-600">encodeURI</td><td className="py-2 text-muted-foreground">Spaces, non-ASCII</td><td className="py-2 text-muted-foreground hidden sm:table-cell">: / ? # & = @ + , ;</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Understanding Percent Encoding</h2>
              <p className="text-muted-foreground text-sm mb-6">What percent encoding is and why it matters:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">What is Percent Encoding?</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Percent encoding (also called URL encoding) replaces special characters with a "%" sign followed by their two-digit hexadecimal ASCII code. A space becomes %20 (since 32 in decimal = 20 in hex), the "at" sign (@) becomes %40, and a forward slash becomes %2F. This makes the URL universally transmissible over HTTP.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">encodeURIComponent vs. encodeURI</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The key difference: <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">encodeURIComponent</code> is stricter — it encodes nearly everything including &, =, /, ?, and :. Use it for query parameter values. <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">encodeURI</code> is for complete URLs — it preserves the structural characters that define URL anatomy so the URL remains functional.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Common Encoding Mistakes</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The most common mistake is double-encoding — encoding a string that's already been encoded, resulting in %2520 (encoding the % of %20). If you're decoding and getting %25 in your output, your input was double-encoded. Decode once, and if you still see % symbols, decode again to get the original value.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">URL Encoding Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Character</th><th className="text-left px-4 py-3 font-bold text-foreground">Encoded</th><th className="text-left px-4 py-3 font-bold text-foreground">Usage Context</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    {[["Space"," ","→ %20","In query values (not + in URI Component)"],["Ampersand","&","→ %26","Separate params; use %26 in values"],["Equals","=","→ %3D","Key=value pairs; use %3D in values"],["Forward slash","/","→ %2F","Path separator; encode in param values"],["Question mark","?","→ %3F","Query start; encode in param values"],["At sign","@","→ %40","Email addresses in URLs"]].map(([n,c,enc,ctx])=>(
                      <tr key={n} className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">{n} (<code className="font-mono">{c}</code>)</td><td className="px-4 py-3 font-mono text-orange-600 font-bold">{enc}</td><td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">{ctx}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">API development and testing:</strong> When constructing API requests with query parameters that contain user-generated content (search terms, email addresses, product names with special characters), always encode parameter values using encodeURIComponent before appending them to your URL string. Failing to encode can break request parsing or introduce security vulnerabilities.</p>
                <p><strong className="text-foreground">Debugging URL issues:</strong> Paste a broken or garbled URL from a server log, API error response, or analytics dashboard into the decoder to instantly see what the original unencoded URL looked like. This is particularly useful when debugging redirects, tracking parameters, and affiliate URL chains that pass through multiple encode/decode cycles.</p>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-orange-500/5 border border-orange-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_,i)=><svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Finally understand the difference between encodeURI and encodeURIComponent. The mode descriptions saved me hours of debugging a broken API request."</p>
                <p className="text-xs text-muted-foreground mt-2">— Backend developer feedback, 2025</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This URL Encoder / Decoder?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">All four standard methods, not just one.</strong> Most online URL encoders only implement one variant. This tool exposes all four JavaScript URL functions — encodeURI, decodeURI, encodeURIComponent, and decodeURIComponent — with plain-English descriptions of when to use each, eliminating the guesswork.</p>
                <p><strong className="text-foreground">Error handling for malformed input.</strong> If you paste a malformed percent-encoded string (e.g., a truncated %E2 sequence), the tool displays a clear error message instead of crashing or producing garbage output — critical for debugging corrupted URLs from logs.</p>
                <p><strong className="text-foreground">Live insight message explains what changed.</strong> The result message tells you exactly how many characters were encoded/decoded, making it easy to verify that the encoding worked correctly and identify any remaining issues in the output.</p>
                <p><strong className="text-foreground">Completely client-side — URLs stay private.</strong> URL strings often contain sensitive data: search queries, user IDs, authentication tokens, and email addresses. This tool processes all encoding and decoding entirely in your browser without transmitting any data to a server.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> This tool uses JavaScript's built-in encoding functions which follow RFC 3986. Some older systems use "+" for spaces in form data (application/x-www-form-urlencoded format) — if your use case requires "+" for spaces, replace %20 with + in the output manually after encoding.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is the difference between URL encoding and Base64 encoding?" a="URL encoding (percent encoding) replaces unsafe URL characters with %XX sequences using the character's ASCII hex value — primarily to make text safe within a URL string. Base64 encoding converts binary data into a 64-character ASCII alphabet — used to safely transmit binary data (like images or files) through text-based protocols. They serve different purposes and are not interchangeable." />
                <FaqItem q="Why does a space sometimes become + instead of %20?" a="Two different encoding standards exist: RFC 3986 (URI encoding) uses %20 for spaces — this is what encodeURIComponent produces. HTML form encoding (application/x-www-form-urlencoded) uses + for spaces — this appears in HTML form POST requests and some older API implementations. Browsers and web frameworks handle this automatically, but when manually constructing URLs, use %20 for consistency with RFC 3986." />
                <FaqItem q="When should I use encodeURI vs. encodeURIComponent?" a="Use encodeURIComponent when encoding a single piece of data that will be inserted into a URL — a search query, username, email, or any value that goes inside a query parameter. Use encodeURI only when you have a complete URL that you need to make safe for transmission but must preserve its structural characters (://?#&=)." />
                <FaqItem q="What does 'malformed URI sequence' error mean?" a="This error occurs when trying to decode a percent-encoded string that contains an incomplete or invalid escape sequence — for example, a URL that was truncated mid-encoding (ending with %2 instead of %2F). The input may be corrupted. Try decoding only a portion of the string, or verify the source of the encoded URL." />
                <FaqItem q="Can this tool encode non-English characters like Chinese or Arabic?" a="Yes. encodeURIComponent correctly handles any Unicode character by first converting it to its UTF-8 byte sequence, then percent-encoding each byte. For example, the Chinese character 你 (U+4F60) encodes to %E4%BD%A0 — its 3-byte UTF-8 representation expressed as percent-encoded hex values." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Developer &amp; Encoding Tools</h2>
                <p className="text-white/80 mb-6 max-w-lg">400+ free developer tools for encoding, formatting, and conversion — instant results, no account needed.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">Explore All Tools <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED.map(t => (
                    <Link key={t.slug} href={`/${t.cat}/${t.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${t.color} 70% 55%), hsl(${t.color} 75% 42%))` }}>{t.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{t.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{t.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-orange-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share with developers and designers.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {linkCopied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Encoder / Decoder","How to Use","Result Interpretation","Quick Examples","Why Choose This","FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/[\s/]+/g,"-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-orange-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-orange-500/40 flex-shrink-0" />{label}
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
