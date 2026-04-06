import { useMemo, useState } from "react";
import { AlertTriangle, Braces, CheckCircle2, FileCode2, Globe, RefreshCw, ScanText, ShieldCheck, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

function getLineColumn(input: string, index: number) {
  const safeIndex = Math.max(0, Math.min(index, input.length));
  const slice = input.slice(0, safeIndex);
  const lines = slice.split(/\r?\n/);
  return {
    line: lines.length,
    column: (lines.at(-1)?.length ?? 0) + 1,
  };
}

function extractErrorPosition(message: string) {
  const positionMatch = message.match(/position\s+(\d+)/i);
  if (positionMatch) return Number.parseInt(positionMatch[1], 10);

  const lineColumnMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (lineColumnMatch) {
    return { line: Number.parseInt(lineColumnMatch[1], 10), column: Number.parseInt(lineColumnMatch[2], 10) };
  }

  return null;
}

function countNodes(value: unknown): number {
  if (value === null || value === undefined) return 1;
  if (Array.isArray(value)) return 1 + value.reduce<number>((sum, item) => sum + countNodes(item), 0);
  if (typeof value === "object") return 1 + Object.values(value as Record<string, unknown>).reduce<number>((sum, item) => sum + countNodes(item), 0);
  return 1;
}

function countKeys(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (Array.isArray(value)) return value.reduce<number>((sum, item) => sum + countKeys(item), 0);
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    return entries.length + entries.reduce<number>((sum, [, item]) => sum + countKeys(item), 0);
  }
  return 0;
}

function countArrays(value: unknown): number {
  if (Array.isArray(value)) return 1 + value.reduce<number>((sum, item) => sum + countArrays(item), 0);
  if (value && typeof value === "object") return Object.values(value as Record<string, unknown>).reduce<number>((sum, item) => sum + countArrays(item), 0);
  return 0;
}

function getRootType(value: unknown) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

export default function JsonValidator() {
  const [input, setInput] = useState(`{
  "launch": true,
  "items": [
    { "id": 1, "title": "Formatter" },
    { "id": 2, "title": "Validator" }
  ],
  "meta": {
    "owner": "Utility Hub"
  }
}`);
  const [copiedLabel, setCopiedLabel] = useState("");

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      return {
        valid: true,
        error: "",
        parsed,
        formatted: JSON.stringify(parsed, null, 2),
        minified: JSON.stringify(parsed),
        location: null as null | { line: number; column: number },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON";
      const extracted = extractErrorPosition(message);

      if (typeof extracted === "number") {
        return {
          valid: false,
          error: message,
          parsed: null,
          formatted: "",
          minified: "",
          location: getLineColumn(input, extracted),
        };
      }

      return {
        valid: false,
        error: message,
        parsed: null,
        formatted: "",
        minified: "",
        location: typeof extracted === "object" ? extracted : null,
      };
    }
  }, [input]);

  const stats = useMemo(() => {
    if (!result.valid) {
      return { rootType: "invalid", nodes: 0, keys: 0, arrays: 0 };
    }
    return {
      rootType: getRootType(result.parsed),
      nodes: countNodes(result.parsed),
      keys: countKeys(result.parsed),
      arrays: countArrays(result.parsed),
    };
  }, [result]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => {
    setInput(`{
  "release": "2026.03",
  "features": ["json-validator", "json-minifier", "json-to-xml"],
  "live": true,
  "meta": {
    "author": "Utility Hub",
    "updated": "2026-03-28"
  }
}`);
  };

  const loadInvalidSample = () => {
    setInput(`{
  "release": "2026.03",
  "features": [
    "json-validator",
    "json-minifier",
  ],
}`);
  };

  const clearAll = () => setInput("");

  return (
    <UtilityToolPageShell
      title="JSON Validator"
      seoTitle="JSON Validator - Validate JSON Syntax Online"
      seoDescription="Free JSON validator with live syntax checks, error feedback, root-type and node stats, formatted output, and minified JSON copy helpers."
      canonical="https://usonlinetools.com/developer/json-validator"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Validate JSON syntax instantly in the browser and get clearer feedback before payloads go into APIs, configs, fixtures, docs, or import pipelines. This free JSON validator checks whether the input parses correctly, highlights useful error context, and gives you clean formatted and minified output when the payload is valid."
      heroIcon={<ShieldCheck className="w-3.5 h-3.5" />}
      calculatorLabel="JSON Validator"
      calculatorDescription="Paste JSON, validate it live, inspect parsing results, and copy formatted or minified output when the payload is valid."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={loadSample} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                  <Wand2 className="w-4 h-4" />
                  Valid Sample
                </button>
                <button onClick={loadInvalidSample} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                  <AlertTriangle className="w-4 h-4" />
                  Invalid Sample
                </button>
              </div>

              <button onClick={clearAll} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                <RefreshCw className="w-4 h-4" />
                Clear
              </button>

              <div className={`rounded-2xl border p-4 ${result.valid ? "border-emerald-500/20 bg-emerald-500/5" : "border-rose-500/20 bg-rose-500/5"}`}>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Validation Status</p>
                <div className="flex items-start gap-3">
                  {result.valid ? <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" /> : <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5" />}
                  <div>
                    <p className="font-bold text-foreground mb-1">{result.valid ? "Valid JSON" : "Invalid JSON"}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {result.valid
                        ? "The payload parses successfully and is safe to format, minify, or send to JSON-aware systems."
                        : "The payload could not be parsed. Fix the reported syntax issue before using it in APIs, configs, fixtures, or documentation."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Payload Stats</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Root type</span>
                    <span className="text-sm font-bold text-foreground capitalize">{stats.rootType}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Nodes</span>
                    <span className="text-sm font-bold text-foreground">{stats.nodes}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Keys</span>
                    <span className="text-sm font-bold text-foreground">{stats.keys}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Arrays</span>
                    <span className="text-sm font-bold text-foreground">{stats.arrays}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Validator Note</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  A JSON validator should do more than say valid or invalid. It should help you understand whether the payload parses, what kind of root structure it contains, and where the likely syntax issue sits when parsing fails.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">JSON Input</p>
                    <p className="text-xs text-muted-foreground">{input.length} characters</p>
                  </div>
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Paste JSON here..."
                    spellCheck={false}
                    className="min-h-[360px] w-full rounded-2xl border border-border bg-background p-4 font-mono text-sm leading-relaxed text-foreground outline-none resize-none"
                  />
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">{result.valid ? "Formatted JSON" : "Validation Feedback"}</p>
                    {result.valid && (
                      <button onClick={() => copyValue("formatted", result.formatted)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                        {copiedLabel === "formatted" ? "Copied" : "Copy"}
                      </button>
                    )}
                  </div>
                  <textarea
                    readOnly
                    value={result.valid ? result.formatted : result.error}
                    spellCheck={false}
                    className="min-h-[360px] w-full rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none resize-none"
                  />
                </div>
              </div>

              {!result.valid && result.location && (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Error Location</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    The parser error points near line <strong className="text-foreground">{result.location.line}</strong>, column <strong className="text-foreground">{result.location.column}</strong>.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Copy-Ready Snippets</p>
                  <div className="space-y-3">
                    {[
                      { label: "Formatted JSON", value: result.formatted },
                      { label: "Minified JSON", value: result.minified },
                      { label: "Fetch Body", value: result.minified ? `fetch('/api/example',{method:'POST',body:${JSON.stringify(result.minified)}})` : "" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                          <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!item.value}>
                            {copiedLabel === item.label ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                          <code>{item.value || "Available when the JSON is valid."}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Common Failure Signals</p>
                    <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Trailing commas after the last item</p>
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Keys not wrapped in double quotes</p>
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Missing closing braces or brackets</p>
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Using comments in strict JSON</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Workflow Context</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      JSON validation is most useful before API requests, config imports, fixture generation, or payload transformations. Catching syntax errors early keeps bad data from leaking into downstream tooling where failures are usually harder to diagnose.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste the JSON payload you want to verify", description: "This tool is designed for strict JSON, which means keys must use double quotes, comments are not allowed, and trailing commas will break parsing. That makes it useful for checking API payloads, config blobs, fixtures, and exported data before they move any further in the workflow." },
        { title: "Watch the live status to confirm whether parsing succeeds", description: "A validator should respond immediately because the most common job is answering a simple but important question: will this payload parse? That instant feedback helps you catch syntax errors before the JSON is copied into an API request body, a config file, or a test fixture." },
        { title: "Use the stats and formatted output when the payload is valid", description: "Once the JSON parses successfully, the page gives you more than a green status. It also shows the root type, node count, key count, array count, and clean formatted and minified variants. That makes the tool useful not just for validation but also for fast inspection and downstream reuse." },
        { title: "Use the error location and feedback when the payload is invalid", description: "If parsing fails, the tool helps narrow the issue with the parser message and any position details that can be extracted from the error. That matters because malformed JSON is often only a missing quote, a stray comma, or an extra bracket, and quick context speeds up the fix." },
      ]}
      interpretationCards={[
        { title: "Valid JSON means the parser accepted strict JSON syntax", description: "If the validator says the payload is valid, it parsed successfully as real JSON rather than as a looser JavaScript object literal. That distinction matters because many APIs, config loaders, and data tools expect strict JSON only." },
        { title: "Root type tells you what kind of payload you are actually dealing with", description: "Knowing whether the top-level value is an object, array, string, number, boolean, or null helps you reason about how that payload should be handled downstream. Many integration issues start with incorrect assumptions about the root shape.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Validation failures are usually structural, not semantic", description: "Most JSON parser failures come from syntax problems such as trailing commas, missing quotes, comments, or mismatched braces. Those are different from business-logic or schema-validation issues, which happen later and require separate checks.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "Validation is a prerequisite for formatting, minifying, or converting", description: "If the input does not parse correctly, any later formatting, minification, or data conversion step becomes unreliable. A validator is often the fastest way to stop bad payloads at the edge of the workflow.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Check an API request body", input: `{ "live": true }`, output: "Valid JSON with formatted and minified variants" },
        { scenario: "Catch a trailing comma", input: `{ "live": true, }`, output: "Invalid JSON with parser error" },
        { scenario: "Inspect an array payload", input: `[1,2,3]`, output: "Valid array root with stats" },
        { scenario: "Diagnose a broken fixture", input: `Missing quotes or closing brace`, output: "Error feedback with likely location" },
      ]}
      whyChoosePoints={[
        "This JSON validator is built as a real validation and inspection tool rather than a placeholder route. It checks strict JSON parsing, reports useful status, shows payload stats, and gives you formatted and minified outputs when the input is valid, which makes it useful before and after debugging.",
        "The page also follows the stronger structure used across the implemented developer tools. The working validator comes first, but it is supported by interpretation guidance, examples, FAQ answers, and related links that explain what valid JSON actually means and where validation fits in a real workflow.",
        "Validation is one of the highest-leverage steps in any JSON-based workflow. If the payload is broken, everything after it becomes noise. Catching errors before they hit API clients, config loaders, fixtures, and transformations saves time and reduces the number of downstream systems you have to inspect.",
        "The extra payload stats also matter because validation is often followed immediately by inspection. Once the parser says the JSON is valid, people usually want to understand whether the payload is an object or array, how large it is structurally, and whether it can be copied in formatted or compact form.",
        "Everything runs locally in the browser, which is the right tradeoff when the JSON contains internal payloads, client-side config, staging records, or unpublished docs examples that should not be sent anywhere just to answer whether the syntax is valid.",
      ]}
      faqs={[
        { q: "What is a JSON validator?", a: "A JSON validator checks whether a payload is valid strict JSON syntax. It parses the input and tells you whether it succeeds or fails, often with an error message that helps identify the problem." },
        { q: "What kinds of mistakes does it catch?", a: "It catches syntax errors such as trailing commas, unquoted keys, missing braces or brackets, invalid string quoting, and comments that are not allowed in strict JSON." },
        { q: "Is JSON the same as a JavaScript object literal?", a: "No. JSON is stricter. Keys must use double quotes, comments are not allowed, and some JavaScript expressions that work in object literals are not valid JSON." },
        { q: "Why show formatted and minified output after validation?", a: "Because once a payload is valid, the next common task is either making it easier to read or preparing it for compact transport. Putting those outputs on the same page makes the validator more practical in day-to-day workflows." },
        { q: "Can this validate arrays as well as objects?", a: "Yes. Valid JSON can have an array, object, string, number, boolean, or null as the root value. The validator reports the root type so you know exactly what parsed." },
        { q: "Does validation mean the data matches my API schema?", a: "No. Syntax validation only confirms that the payload is valid JSON. Schema validation, business rules, and required-field checks are separate steps." },
        { q: "Who uses a JSON validator most often?", a: "Developers, QA teams, support engineers, technical writers, agencies, and analysts all use it when working with API payloads, fixtures, config records, and docs examples that must parse correctly." },
        { q: "Why validate JSON in the browser?", a: "Because it is fast, private, and good enough for syntax checking. When the task is simply to confirm whether a payload parses and inspect the result, local browser-side validation is usually the most pragmatic option." },
      ]}
      relatedTools={[
        { title: "JSON Formatter", slug: "json-formatter", icon: <Braces className="w-4 h-4" />, color: 205, benefit: "Beautify valid payloads for review" },
        { title: "JSON Minifier", slug: "json-minifier", icon: <FileCode2 className="w-4 h-4" />, color: 170, benefit: "Compress valid JSON for transport" },
        { title: "JSON to CSV Converter", slug: "json-to-csv", icon: <Globe className="w-4 h-4" />, color: 145, benefit: "Move structured payloads into tabular exports" },
        { title: "JSON to XML Converter", slug: "json-to-xml", icon: <ShieldCheck className="w-4 h-4" />, color: 28, benefit: "Transform valid JSON into XML feeds" },
        { title: "JavaScript Formatter", slug: "javascript-formatter", icon: <ScanText className="w-4 h-4" />, color: 280, benefit: "Work on adjacent code snippets around payloads" },
        { title: "Hash Generator", slug: "hash-generator", icon: <AlertTriangle className="w-4 h-4" />, color: 330, benefit: "Compare validated payload fingerprints when needed" },
      ]}
      ctaTitle="Need More JSON and Validation Tools?"
      ctaDescription="Keep validating, formatting, minifying, and converting structured payloads with adjacent developer utilities in the same tool hub."
      ctaHref="/category/developer"
    />
  );
}
