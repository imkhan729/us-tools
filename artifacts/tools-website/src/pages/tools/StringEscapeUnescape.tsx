import { useMemo, useState } from "react";
import { ArrowRightLeft, Code2, Copy, Globe, RefreshCw, ScanText, Shield, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type Mode = "javascript" | "json" | "url" | "html";
type Direction = "escape" | "unescape";

function escapeHtmlEntities(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function unescapeHtmlEntities(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

function runConversion(value: string, mode: Mode, direction: Direction) {
  if (!value) return { output: "", error: "" };

  try {
    if (mode === "javascript") {
      return direction === "escape"
        ? { output: JSON.stringify(value).slice(1, -1), error: "" }
        : { output: JSON.parse(`"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`).replace(/\\\\/g, "\\"), error: "" };
    }

    if (mode === "json") {
      return direction === "escape"
        ? { output: JSON.stringify(value), error: "" }
        : { output: JSON.parse(value), error: "" };
    }

    if (mode === "url") {
      return direction === "escape"
        ? { output: encodeURIComponent(value), error: "" }
        : { output: decodeURIComponent(value), error: "" };
    }

    return direction === "escape"
      ? { output: escapeHtmlEntities(value), error: "" }
      : { output: unescapeHtmlEntities(value), error: "" };
  } catch (error) {
    return {
      output: "",
      error: error instanceof Error ? error.message : "Conversion failed.",
    };
  }
}

const SAMPLE_INPUT = `Line one\nPath: C:\\Users\\Roy\\docs\\launch-notes.md\nQuery: name=Ava Stone&role=admin`;

export default function StringEscapeUnescape() {
  const [mode, setMode] = useState<Mode>("javascript");
  const [direction, setDirection] = useState<Direction>("escape");
  const [input, setInput] = useState(SAMPLE_INPUT);
  const [copiedLabel, setCopiedLabel] = useState("");

  const result = useMemo(() => runConversion(input, mode, direction), [direction, input, mode]);

  const copyValue = async (label: string, value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => {
    setMode("javascript");
    setDirection("escape");
    setInput(SAMPLE_INPUT);
  };

  const clearAll = () => setInput("");

  return (
    <UtilityToolPageShell
      title="String Escape & Unescape"
      seoTitle="String Escape & Unescape - Encode Special Characters Online"
      seoDescription="Free string escape and unescape tool for JavaScript, JSON, URL encoding, and HTML entities with live conversion and copy-ready snippets."
      canonical="https://usonlinetools.com/developer/string-escape-unescape"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Escape or unescape special characters instantly for JavaScript strings, JSON payloads, URLs, and HTML entities. This tool is built for real developer workflows where copied text needs to move safely between code, payloads, query strings, and markup-heavy environments."
      heroIcon={<ArrowRightLeft className="w-3.5 h-3.5" />}
      calculatorLabel="Escape Workspace"
      calculatorDescription="Choose the encoding mode, switch between escape and unescape, and copy the transformed string or snippets immediately."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Mode</label>
                <select value={mode} onChange={(event) => setMode(event.target.value as Mode)} className="tool-calc-input w-full">
                  <option value="javascript">JavaScript string</option>
                  <option value="json">JSON string literal</option>
                  <option value="url">URL component</option>
                  <option value="html">HTML entities</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Direction</label>
                <select value={direction} onChange={(event) => setDirection(event.target.value as Direction)} className="tool-calc-input w-full">
                  <option value="escape">Escape</option>
                  <option value="unescape">Unescape</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={loadSample} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                  <Wand2 className="w-4 h-4" />
                  Sample
                </button>
                <button onClick={clearAll} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                  <RefreshCw className="w-4 h-4" />
                  Clear
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Conversion Snapshot</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">Mode</span><span className="text-sm font-bold text-foreground capitalize">{mode}</span></div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">Direction</span><span className="text-sm font-bold text-foreground capitalize">{direction}</span></div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">Input length</span><span className="text-sm font-bold text-foreground">{input.length}</span></div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">Output length</span><span className="text-sm font-bold text-foreground">{result.output.length}</span></div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Workflow Note</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Escaping is usually about making text safe for a specific destination. Unescaping is about recovering the original readable form. This page keeps both operations in the same place because most debugging work moves back and forth between those states.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Input</p>
                    <p className="text-xs text-muted-foreground">{input.length} characters</p>
                  </div>
                  <textarea value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} className="min-h-[320px] w-full rounded-2xl border border-border bg-background p-4 font-mono text-sm leading-relaxed text-foreground outline-none resize-none" />
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Output</p>
                    <button onClick={() => copyValue("output", result.output)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!result.output}>
                      {copiedLabel === "output" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <textarea readOnly value={result.output || result.error} spellCheck={false} className="min-h-[320px] w-full rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none resize-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Copy-Ready Snippets</p>
                  <div className="space-y-3">
                    {[
                      { label: "Converted string", value: result.output },
                      { label: "JS const", value: `const value = ${JSON.stringify(result.output)};` },
                      { label: "Console preview", value: `console.log(${JSON.stringify(result.output)});` },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                          <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!item.value}>
                            {copiedLabel === item.label ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100"><code>{item.value || "Available after conversion."}</code></pre>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Mode Guidance</p>
                    <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Use JavaScript mode for escaped line breaks, tabs, quotes, and backslashes inside code strings.</p>
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Use JSON mode when a string needs to become a valid JSON string literal.</p>
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Use URL mode for query parameters and URL-safe text.</p>
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Use HTML mode when text needs to be safe inside markup.</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Practical Tip</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      If text looks double-escaped, switch the direction before changing the mode. Many debugging issues come from applying the right transformation in the wrong order rather than from using the wrong encoding family entirely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Choose the destination format first", description: "Escaping is only meaningful in context. JavaScript strings, JSON literals, URLs, and HTML all treat special characters differently. Starting with the right target mode prevents the most common category of mistakes, which is correctly escaping text for the wrong environment and then wondering why it still breaks after being pasted elsewhere." },
        { title: "Switch between escape and unescape depending on the problem", description: "When text looks unreadable, the real task is often to unescape it back to plain content. When text breaks code, markup, or query strings, the task is usually to escape it properly. Keeping both directions next to each other makes debugging easier because real workflows often involve moving from raw text to escaped text and then back again to verify the result." },
        { title: "Compare the output length and copy the transformed value", description: "Length changes can reveal a lot about what happened during conversion. URL-escaped text usually grows because reserved characters become percent sequences. JSON and JavaScript escaping can add slashes and quotes. HTML entity escaping expands specific characters into named forms. Seeing the output and its length together helps confirm whether the transformation behaved as expected." },
        { title: "Use the prepared snippets when the next step is code", description: "After conversion, the usual next action is not theory. It is copying the value into a script, payload, config file, or browser console. That is why this page includes ready-made snippets. They reduce friction between conversion and actual use, which is where a developer tool proves whether it is practical or just decorative." },
      ]}
      interpretationCards={[
        { title: "Escaping is destination-specific", description: "A string escaped correctly for a URL is not automatically correct for JSON or HTML. The visible output may still look encoded, but the rules and safe character sets differ by context." },
        { title: "JSON and JavaScript escaping are related but not identical in use", description: "Both involve string literal rules, but JSON mode is stricter because the output needs to become valid JSON text, not just a string that JavaScript can hold in memory.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "HTML entity escaping protects markup boundaries", description: "Replacing characters like `<`, `>`, `&`, and quotes is useful when plain text needs to appear safely inside HTML without accidentally being interpreted as markup or breaking attribute boundaries.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "Unescaping is often the first debugging step", description: "When logs, copied payloads, or encoded fields look unreadable, turning them back into plain text is often the fastest way to understand what the original data actually contained.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Escape a path for JS code", input: `C:\\Users\\Roy\\docs`, output: `C:\\\\Users\\\\Roy\\\\docs` },
        { scenario: "Unescape a query string", input: `name%3DAva%20Stone`, output: `name=Ava Stone` },
        { scenario: "Make markup-safe text", input: `<div>\"hello\"</div>`, output: `&lt;div&gt;&quot;hello&quot;&lt;/div&gt;` },
        { scenario: "Create a JSON string literal", input: `Line one`, output: `\"Line one\"` },
      ]}
      whyChoosePoints={[
        "This string escape and unescape tool is built as a real conversion workspace instead of a placeholder. It handles four common developer modes, supports both directions of conversion, exposes the result live, and includes copy-ready snippets for immediate reuse in scripts and payloads. That makes it practical for debugging, not just demonstrative.",
        "The page is designed around the most common source of confusion in escaping work: context. Text often looks encoded without making it obvious whether the destination is JavaScript, JSON, URL-safe text, or HTML. Making the mode explicit at the top keeps the workflow grounded and reduces the guesswork that leads to double-escaping or wrong-format output.",
        "Keeping escape and unescape together on the same page is a deliberate choice because real debugging moves in both directions. Developers routinely receive text that is already encoded and need to inspect the raw meaning before deciding whether it then needs to be re-escaped for a different destination. A one-direction-only tool slows that loop down.",
        "This page is especially useful in integration workflows where strings cross boundaries between browsers, APIs, logs, templates, and code editors. In those environments, subtle formatting characters like quotes, line breaks, backslashes, ampersands, and URL separators can break otherwise correct logic if they are not represented in the right form.",
        "Everything runs locally in the browser, which is the right default when the source text includes internal paths, client data, auth fragments, support payloads, or unpublished content. Escaping is a transformation task, and local execution keeps it fast without sending the text to another service just to encode or decode a few characters.",
      ]}
      faqs={[
        { q: "What is string escaping used for?", a: "String escaping is used to represent special characters safely inside a particular destination such as code, JSON, URLs, or HTML. It prevents those characters from being interpreted in a way that breaks syntax or structure." },
        { q: "Why would I unescape a string?", a: "Unescaping is useful when text is already encoded and you need to recover the original readable form, inspect what the content actually says, or prepare it for a different transformation later in the workflow." },
        { q: "What is the difference between JavaScript and JSON escaping?", a: "They are similar but not interchangeable in every use case. JavaScript string handling is more permissive in practice, while JSON mode is intended to produce or consume valid JSON string literals specifically." },
        { q: "When should I use URL encoding?", a: "Use it when text needs to be safe inside query parameters, path segments, or URL-adjacent contexts where reserved characters would otherwise break the URL or change how it is parsed." },
        { q: "When should I use HTML entity escaping?", a: "Use it when text needs to appear safely inside HTML without being treated as markup or without breaking attribute values. It is especially useful for pasted text that includes brackets, quotes, or ampersands." },
        { q: "Why does escaped text get longer?", a: "Because special characters are replaced with longer escape sequences such as percent codes, slashes, or entity names. That length increase is expected and often signals that the encoding step actually happened." },
        { q: "What causes double-escaped text?", a: "Double-escaping usually happens when already-escaped content is escaped again instead of being unescaped first or when the same text is passed through multiple encoding steps without a clear destination model." },
        { q: "Who uses a string escape and unescape tool most often?", a: "Developers, QA teams, support engineers, technical writers, and integration teams use it when moving text between code, logs, payloads, URLs, templates, and markup-heavy systems." },
      ]}
      relatedTools={[
        { title: "Regex Tester", slug: "regex-tester", icon: <ScanText className="w-4 h-4" />, color: 150, benefit: "Test patterns against escaped or unescaped strings" },
        { title: "URL Encoder & Decoder", slug: "url-encoder-decoder", icon: <Globe className="w-4 h-4" />, color: 210, benefit: "Work on URL-specific encoding workflows" },
        { title: "HTML Entity Encoder & Decoder", slug: "html-entity-encoder", icon: <Shield className="w-4 h-4" />, color: 265, benefit: "Go deeper on entity-focused markup workflows" },
        { title: "JSON Validator", slug: "json-validator", icon: <Code2 className="w-4 h-4" />, color: 28, benefit: "Validate JSON strings after conversion" },
        { title: "Text Diff Checker", slug: "diff-checker", icon: <Copy className="w-4 h-4" />, color: 330, benefit: "Compare before-and-after transformed text" },
        { title: "Markdown Previewer", slug: "online-markdown-previewer", icon: <Wand2 className="w-4 h-4" />, color: 185, benefit: "Review cleaned text in content workflows" },
      ]}
      ctaTitle="Need More Encoding and Text Tools?"
      ctaDescription="Keep escaping, validating, diffing, and transforming developer text workflows with adjacent utilities in the same hub."
      ctaHref="/category/developer"
    />
  );
}
