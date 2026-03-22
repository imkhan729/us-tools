import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Code2, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, Braces,
  Copy, Check, Lightbulb, FileJson, AlignLeft, Minimize2,
  Trash2, Settings, Globe, FileCode,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Result Insight Component ──
function ResultInsight({ input, output, error }: { input: string; output: string; error: string | null }) {
  if (!input.trim() && !error) return null;

  let message = "";
  if (error) {
    message = `Your JSON contains an error: ${error}. Check for missing commas, brackets, or quotes and try again.`;
  } else if (output) {
    const inputLines = input.split("\n").length;
    const outputLines = output.split("\n").length;
    const inputChars = input.length;
    const outputChars = output.length;
    if (outputChars < inputChars) {
      message = `Minified successfully! Reduced from ${inputChars.toLocaleString()} to ${outputChars.toLocaleString()} characters (${Math.round(((inputChars - outputChars) / inputChars) * 100)}% smaller). Perfect for production deployments.`;
    } else {
      message = `Formatted successfully! Expanded from ${inputLines.toLocaleString()} to ${outputLines.toLocaleString()} lines with proper indentation. Your JSON is valid and beautifully structured.`;
    }
  }

  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "JSON Validator", slug: "json-validator", icon: <CheckCircle2 className="w-5 h-5" />, color: 152 },
  { title: "JSON Minifier", slug: "json-minifier", icon: <Minimize2 className="w-5 h-5" />, color: 217 },
  { title: "JSON to CSV", slug: "json-to-csv", icon: <FileJson className="w-5 h-5" />, color: 25 },
  { title: "XML Formatter", slug: "xml-formatter", icon: <FileCode className="w-5 h-5" />, color: 340 },
  { title: "YAML to JSON", slug: "yaml-to-json", icon: <Code2 className="w-5 h-5" />, color: 265 },
  { title: "Base64 Encoder", slug: "base64-encoder-decoder", icon: <Braces className="w-5 h-5" />, color: 45 },
];

// ── Main Component ──
export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentation, setIndentation] = useState<number | "tab">(2);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  const inputStats = useMemo(() => {
    return {
      chars: input.length,
      lines: input ? input.split("\n").length : 0,
    };
  }, [input]);

  const outputStats = useMemo(() => {
    return {
      chars: output.length,
      lines: output ? output.split("\n").length : 0,
    };
  }, [output]);

  const formatJson = () => {
    if (!input.trim()) {
      setError("Please enter some JSON to format.");
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const indent = indentation === "tab" ? "\t" : indentation;
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setError(null);
    } catch (e: any) {
      const msg = e.message || "Invalid JSON";
      const lineMatch = msg.match(/position (\d+)/);
      if (lineMatch) {
        const pos = parseInt(lineMatch[1], 10);
        const upToPos = input.substring(0, pos);
        const lineNum = upToPos.split("\n").length;
        setError(`${msg} (around line ${lineNum})`);
      } else {
        setError(msg);
      }
      setOutput("");
    }
  };

  const minifyJson = () => {
    if (!input.trim()) {
      setError("Please enter some JSON to minify.");
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Invalid JSON");
      setOutput("");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="JSON Formatter & Beautifier - Free Online JSON Pretty Print Tool"
        description="Free online JSON formatter and beautifier. Format, validate, and minify JSON data instantly. Pretty print JSON with custom indentation. No signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/developer" className="text-muted-foreground hover:text-foreground transition-colors">Developer Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">JSON Formatter</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* ── 1. PAGE HEADER ── */}
            <section>
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Code2 className="w-3.5 h-3.5" />
                Developer Tools
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">
                JSON Formatter & Beautifier
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Format, beautify, and validate your JSON data instantly. Pretty print with custom indentation, minify for production, and catch syntax errors with helpful line numbers. Free and private.
              </p>
            </section>

            {/* ── 2. QUICK ACTION ── */}
            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">Paste your JSON and click Format</p>
                <p className="text-muted-foreground text-sm">Your data never leaves your browser. Choose indentation level and beautify or minify instantly.</p>
              </div>
            </section>

            {/* ── 3. TOOL SECTION ── */}
            <section id="formatter" className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 152 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number"><Braces className="w-4 h-4" /></div>
                  <h3 className="text-lg font-bold text-foreground">JSON Input</h3>
                </div>

                {/* Controls Row */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-muted-foreground">Indent:</span>
                    <select
                      value={String(indentation)}
                      onChange={e => setIndentation(e.target.value === "tab" ? "tab" : parseInt(e.target.value, 10))}
                      className="tool-calc-input py-1.5 px-3 text-sm w-auto"
                    >
                      <option value="2">2 Spaces</option>
                      <option value="4">4 Spaces</option>
                      <option value="tab">Tab</option>
                    </select>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <button
                      onClick={formatJson}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:-translate-y-0.5 active:translate-y-0 transition-transform text-sm"
                    >
                      <AlignLeft className="w-4 h-4" /> Format
                    </button>
                    <button
                      onClick={minifyJson}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground font-bold rounded-lg hover:-translate-y-0.5 active:translate-y-0 transition-transform text-sm border border-border"
                    >
                      <Minimize2 className="w-4 h-4" /> Minify
                    </button>
                    <button
                      onClick={clearAll}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground font-bold rounded-lg hover:-translate-y-0.5 active:translate-y-0 transition-transform text-sm border border-border"
                    >
                      <Trash2 className="w-4 h-4" /> Clear
                    </button>
                  </div>
                </div>

                {/* Input Textarea */}
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder='{"name": "John", "age": 30, "city": "New York"}'
                  className="w-full h-56 p-4 rounded-xl bg-muted border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  spellCheck={false}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                  <span>{inputStats.chars.toLocaleString()} characters</span>
                  <span>{inputStats.lines.toLocaleString()} lines</span>
                </div>

                {/* Error Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Output Section */}
              <div className="tool-calc-card" style={{ "--calc-hue": 217 } as React.CSSProperties}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="tool-calc-number"><FileJson className="w-4 h-4" /></div>
                    <h3 className="text-lg font-bold text-foreground">Formatted Output</h3>
                  </div>
                  <button
                    onClick={copyOutput}
                    disabled={!output}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary font-bold rounded-lg hover:-translate-y-0.5 active:translate-y-0 transition-transform text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {copiedOutput ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                </div>

                <textarea
                  value={output}
                  readOnly
                  placeholder="Formatted JSON will appear here..."
                  className="w-full h-56 p-4 rounded-xl bg-muted border border-border font-mono text-sm text-foreground placeholder:text-muted-foreground resize-y focus:outline-none"
                  spellCheck={false}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                  <span>{outputStats.chars.toLocaleString()} characters</span>
                  <span>{outputStats.lines.toLocaleString()} lines</span>
                </div>

                {/* 4. Result Insight */}
                <ResultInsight input={input} output={output} error={error} />
              </div>
            </section>

            {/* ── 5. HOW IT WORKS ── */}
            <section id="how-it-works" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How It Works</h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Paste Your JSON</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Paste raw JSON data from your API response, configuration file, or any other source into the input textarea. The tool accepts any valid JSON structure.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Choose Your Options</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Select your preferred indentation (2 spaces, 4 spaces, or tabs). Then click <strong>Format</strong> to beautify or <strong>Minify</strong> to compress the JSON.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Copy the Result</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">The formatted or minified JSON appears in the output area. Click <strong>Copy</strong> to copy it to your clipboard. If there are syntax errors, you will see a descriptive error message with the approximate line number.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 6. REAL-LIFE EXAMPLES ── */}
            <section id="examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Real-Life Examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-emerald-500" />
                    <h4 className="font-bold text-foreground text-sm">API Debugging</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Paste a compact API response to format it with proper indentation, making it easy to <strong className="text-foreground">inspect nested objects</strong> and debug issues.</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <FileJson className="w-4 h-4 text-blue-500" />
                    <h4 className="font-bold text-foreground text-sm">Config Files</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Beautify package.json, tsconfig.json, or any configuration file for <strong className="text-foreground">easier reading and editing</strong> before committing to version control.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <Minimize2 className="w-4 h-4 text-purple-500" />
                    <h4 className="font-bold text-foreground text-sm">Production Optimization</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Minify JSON payloads before sending them over the network to <strong className="text-foreground">reduce bandwidth usage</strong> and improve application performance.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-foreground text-sm">Data Validation</h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">Quickly validate JSON data from third-party sources. Catch <strong className="text-foreground">syntax errors with line numbers</strong> before your application crashes.</p>
                </div>
              </div>
            </section>

            {/* ── 7. BENEFITS ── */}
            <section id="benefits" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This JSON Formatter?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Instant formatting with one click" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Detailed error messages with line numbers" },
                  { icon: <Shield className="w-4 h-4" />, text: "100% client-side — data never leaves your browser" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Works on desktop, tablet, and mobile" },
                  { icon: <Clock className="w-4 h-4" />, text: "No signup, no ads, completely free" },
                  { icon: <Settings className="w-4 h-4" />, text: "Customizable indentation (2, 4 spaces, or tabs)" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 9. SEO CONTENT ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">What is JSON Formatting?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  JSON (JavaScript Object Notation) is the most widely used data interchange format on the web. APIs, configuration files, databases, and web applications all rely on JSON to transmit and store structured data. However, raw JSON — especially from API responses — is often delivered as a single compressed line that is nearly impossible to read.
                </p>
                <p>
                  A JSON formatter (also called a JSON beautifier or JSON pretty printer) takes compact JSON and adds proper indentation, line breaks, and spacing to make it human-readable. This is essential for debugging API responses, reviewing configuration files, and understanding complex nested data structures. Our free online JSON formatter handles all of this instantly in your browser.
                </p>

                <h3 className="text-xl font-bold text-foreground pt-2">When Should You Use a JSON Formatter?</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Debugging REST API responses that arrive as compressed single-line JSON",
                    "Reviewing and editing package.json, tsconfig.json, or other config files",
                    "Validating JSON data before importing into databases or applications",
                    "Minifying JSON payloads to reduce file size for production deployment",
                    "Sharing formatted JSON with teammates for code reviews",
                    "Converting between readable and compact JSON for different environments",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-bold text-foreground pt-2">JSON Formatting Best Practices</h3>
                <p>
                  For development and debugging, use 2-space or 4-space indentation for clarity. When deploying to production or transmitting over the network, always minify your JSON to remove unnecessary whitespace and reduce payload size. Modern APIs can save significant bandwidth by serving minified JSON responses, which directly impacts page load times and user experience.
                </p>
                <p>
                  Always validate your JSON before using it in applications. Even a single misplaced comma or missing bracket can cause parsing failures. This tool catches syntax errors and reports approximate line numbers, helping you fix issues quickly. For related developer utilities, check out our <Link href={getToolPath("base64-encoder-decoder")} className="text-primary hover:underline font-semibold">Base64 Encoder/Decoder</Link> and other developer tools.
                </p>
              </div>
            </section>

            {/* ── 10. FAQ ── */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="What is JSON?"
                  a="JSON (JavaScript Object Notation) is a lightweight data interchange format. It uses human-readable text to store and transmit data objects consisting of key-value pairs and arrays. JSON is the standard format for web APIs and configuration files across virtually all programming languages."
                />
                <FaqItem
                  q="What does JSON formatting do?"
                  a="JSON formatting (also called beautifying or pretty printing) adds proper indentation, line breaks, and spacing to compressed JSON data. This transforms a single unreadable line into a well-structured, hierarchical view that is easy to read, debug, and edit. Minifying does the opposite — removing all whitespace to create the smallest possible file."
                />
                <FaqItem
                  q="Is my data safe when using this tool?"
                  a="Absolutely. This JSON formatter runs entirely in your browser using JavaScript. Your JSON data is never sent to any server, stored anywhere, or shared with third parties. All processing happens locally on your device, making it safe for sensitive data including API keys and configuration secrets."
                />
                <FaqItem
                  q="Can I format large JSON files?"
                  a="Yes, this tool can handle JSON files of significant size. Since all processing happens in your browser, performance depends on your device's memory and processing power. For files over 10MB, you may experience slight delays. For extremely large files, consider using a desktop JSON editor."
                />
                <FaqItem
                  q="What happens with invalid JSON?"
                  a="When you try to format invalid JSON, the tool displays a descriptive error message with the approximate line number where the error was detected. Common issues include missing commas between elements, unquoted property names, trailing commas, and mismatched brackets or braces."
                />
                <FaqItem
                  q="Is this JSON formatter completely free?"
                  a="Yes, 100% free with no limitations, no ads, no signup, and no data collection. You can use it as many times as you want for JSON files of any size. It works on all modern browsers including Chrome, Firefox, Safari, and Edge."
                />
              </div>
            </section>

            {/* ── 11. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Explore More Developer Tools</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">
                  Discover 400+ free online tools including Base64 encoders, hash generators, code formatters, and more — all free, all instant.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* ── 8. RELATED TOOLS ── */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={getToolPath(tool.slug)}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                        {tool.title}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help other developers format JSON easily.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              {/* Quick Links */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">On This Page</h3>
                <div className="space-y-1.5">
                  {["Formatter", "How It Works", "Examples", "Benefits", "FAQ"].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-medium py-1 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                      {label}
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
