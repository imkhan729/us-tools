import { useEffect, useMemo, useState } from "react";
import { Braces, Code2, Copy, FileCode2, Globe, RefreshCw, ScanText, Wand2 } from "lucide-react";
import { format } from "prettier/standalone";
import * as babelPlugin from "prettier/plugins/babel";
import * as estreePlugin from "prettier/plugins/estree";
import UtilityToolPageShell from "./UtilityToolPageShell";

type ParserMode = "babel" | "babel-ts" | "json";

function countLines(value: string) {
  return value ? value.split(/\r?\n/).length : 0;
}

export default function JavaScriptFormatter() {
  const [input, setInput] = useState(`const launch=(items)=>items.map((item,index)=>({id:index+1,...item,live:item.status==="ready"})).filter((item)=>item.live);`);
  const [parserMode, setParserMode] = useState<ParserMode>("babel");
  const [tabWidth, setTabWidth] = useState("2");
  const [semi, setSemi] = useState(true);
  const [singleQuote, setSingleQuote] = useState(true);
  const [trailingComma, setTrailingComma] = useState<"all" | "es5" | "none">("all");
  const [printWidth, setPrintWidth] = useState("80");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copiedLabel, setCopiedLabel] = useState("");

  useEffect(() => {
    let cancelled = false;

    format(input || "", {
      parser: parserMode,
      plugins: [babelPlugin, estreePlugin],
      tabWidth: Number.parseInt(tabWidth, 10) || 2,
      semi,
      singleQuote,
      trailingComma,
      printWidth: Number.parseInt(printWidth, 10) || 80,
    })
      .then((value) => {
        if (!cancelled) {
          setOutput(value);
          setError("");
        }
      })
      .catch((nextError: unknown) => {
        if (!cancelled) {
          setOutput("");
          setError(nextError instanceof Error ? nextError.message : "Formatting failed.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [input, parserMode, printWidth, semi, singleQuote, tabWidth, trailingComma]);

  const stats = useMemo(
    () => ({
      inputLines: countLines(input),
      outputLines: countLines(output),
      chars: input.length,
    }),
    [input, output],
  );

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => {
    setInput(`export const buildCards=(items)=>items.filter((item)=>item.live).map((item)=>({title:item.title,slug:item.slug,cta:()=>window.location.assign(\`/tools/\${item.slug}\`)}));`);
    setParserMode("babel");
    setTabWidth("2");
    setSemi(true);
    setSingleQuote(true);
    setTrailingComma("all");
    setPrintWidth("80");
  };

  const clearAll = () => setInput("");

  return (
    <UtilityToolPageShell
      title="JavaScript Formatter"
      seoTitle="JavaScript Formatter - Beautify JS, JSX, and TS Online"
      seoDescription="Free JavaScript formatter powered by Prettier with support for JS, JSX, TS-style syntax, print width, quotes, semicolons, and trailing comma controls."
      canonical="https://usonlinetools.com/developer/javascript-formatter"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Format JavaScript, JSX, and TypeScript-style code in the browser with a real Prettier-based formatter. This free JavaScript formatter helps developers clean minified snippets, normalize code style before review, inspect generated code, and prepare readable output for debugging, documentation, and collaboration."
      heroIcon={<FileCode2 className="w-3.5 h-3.5" />}
      calculatorLabel="JavaScript Formatter"
      calculatorDescription="Paste code, choose parser and style rules, then copy consistently formatted output instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div>
                <label htmlFor="js-parser" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Parser</label>
                <select id="js-parser" value={parserMode} onChange={(event) => setParserMode(event.target.value as ParserMode)} className="tool-calc-input w-full">
                  <option value="babel">JavaScript / JSX</option>
                  <option value="babel-ts">TypeScript / TSX style</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div>
                <label htmlFor="js-tab-width" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Indent Size</label>
                <select id="js-tab-width" value={tabWidth} onChange={(event) => setTabWidth(event.target.value)} className="tool-calc-input w-full">
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                </select>
              </div>

              <div>
                <label htmlFor="js-print-width" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Print Width</label>
                <select id="js-print-width" value={printWidth} onChange={(event) => setPrintWidth(event.target.value)} className="tool-calc-input w-full">
                  <option value="80">80</option>
                  <option value="100">100</option>
                  <option value="120">120</option>
                </select>
              </div>

              <div>
                <label htmlFor="js-trailing-comma" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Trailing Commas</label>
                <select id="js-trailing-comma" value={trailingComma} onChange={(event) => setTrailingComma(event.target.value as "all" | "es5" | "none")} className="tool-calc-input w-full">
                  <option value="all">All</option>
                  <option value="es5">ES5</option>
                  <option value="none">None</option>
                </select>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground">
                <input type="checkbox" checked={semi} onChange={(event) => setSemi(event.target.checked)} className="h-4 w-4 rounded border-border" />
                Use semicolons
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground">
                <input type="checkbox" checked={singleQuote} onChange={(event) => setSingleQuote(event.target.checked)} className="h-4 w-4 rounded border-border" />
                Prefer single quotes
              </label>

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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Code Stats</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Input lines</span>
                    <span className="text-sm font-bold text-foreground">{stats.inputLines}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Output lines</span>
                    <span className="text-sm font-bold text-foreground">{stats.outputLines}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Characters</span>
                    <span className="text-sm font-bold text-foreground">{stats.chars}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Formatter Insight</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  A real formatter is more than line breaks. It gives your code predictable structure, reduces review noise, and makes generated or copied snippets readable enough to inspect safely before they enter a repository, ticket, doc, or deployment workflow.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Code Input</p>
                    <p className="text-xs text-muted-foreground">{parserMode.toUpperCase()} mode</p>
                  </div>
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Paste JavaScript, JSX, TypeScript-style code, or JSON here..."
                    spellCheck={false}
                    className="min-h-[360px] w-full rounded-2xl border border-border bg-background p-4 font-mono text-sm leading-relaxed text-foreground outline-none resize-none"
                  />
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Formatted Output</p>
                    <button onClick={() => copyValue("output", output)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === "output" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={output}
                    spellCheck={false}
                    className="min-h-[360px] w-full rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none resize-none"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Formatting Error</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Copy-Ready Snippets</p>
                  <div className="space-y-3">
                    {[
                      { label: "Formatted Code", value: output },
                      { label: "Code Fence", value: `\`\`\`${parserMode === "json" ? "json" : "js"}\n${output}\`\`\`` },
                      { label: "String Literal", value: `const source = ${JSON.stringify(output)};` },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                          <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                            {copiedLabel === item.label ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                          <code>{item.value}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Formatting Profile</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Semicolons</span>
                        <span className="text-sm font-bold text-foreground">{semi ? "On" : "Off"}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Quotes</span>
                        <span className="text-sm font-bold text-foreground">{singleQuote ? "Single" : "Double"}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Trailing commas</span>
                        <span className="text-sm font-bold text-foreground">{trailingComma}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Prettier-Based Output</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      This page uses a real formatter engine instead of a fragile regex pass. That means the output is consistent with modern formatting workflows used in repositories, editors, CI pipelines, and code review tooling.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste the JavaScript, JSX, TypeScript-style code, or JSON you want to clean up", description: "This tool is useful when a snippet has been minified, copied from a browser console, generated by a tool, or pulled from a legacy codebase with inconsistent formatting. A real formatter helps turn that raw code into something you can actually inspect, review, and maintain." },
        { title: "Choose the parser and style options that match your project", description: "Different codebases have different formatting conventions. Some prefer semicolons, some do not. Some use single quotes, some prefer double. Print width and trailing comma behavior also matter for diffs and line wrapping. Exposing these settings lets the output match the style your team already uses." },
        { title: "Review the formatted output side by side", description: "A formatter is not just about making code look nicer. It reveals actual structure by adding predictable spacing, wrapping, and indentation. That is especially useful when debugging generated snippets, reading unfamiliar logic, or preparing a cleaner version of code for documentation or a pull request discussion." },
        { title: "Copy the cleaned output or a ready-made snippet", description: "Once the code is readable, you can copy it directly, wrap it in a code fence for documentation, or grab a string-literal version for test fixtures and scripted output. In practice, formatting is often the step just before code review, ticket handoff, documentation, or migration work." },
      ]}
      interpretationCards={[
        { title: "Formatting reduces review noise and style drift", description: "Consistent formatting keeps reviewers focused on behavior and logic rather than on incidental style differences. That is one of the main reasons teams rely on formatters in repositories and CI pipelines." },
        { title: "Parser choice matters when syntax changes", description: "JavaScript, JSX, TypeScript-style syntax, and JSON each have different parsing rules. Picking the right parser mode helps the formatter interpret the source correctly and avoids misleading output or syntax errors.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Errors usually mean the input is incomplete or uses the wrong parser", description: "If formatting fails, the issue is often missing punctuation, truncated code, or selecting a parser that does not match the syntax. The error panel is there so you can diagnose that quickly instead of guessing.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "Formatting is not the same as linting or minification", description: "A formatter reorganizes code for readability and consistency. It does not enforce all correctness rules, catch semantic issues, or reduce size for transport. Linting and minification are adjacent but separate concerns.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Clean a minified function", input: "const x=(a)=>a.map(v=>v*2)", output: "Readable arrow function with consistent spacing" },
        { scenario: "Format JSON for docs", input: "{\"live\":true,\"items\":[1,2,3]}", output: "Pretty JSON with indentation" },
        { scenario: "Normalize JSX-style code", input: "<Card title=\"Launch\"/>", output: "Readable JSX aligned to project style" },
        { scenario: "Prepare code for a ticket or README", input: "Copied snippet from console or builder", output: "Formatted code fence-ready output" },
      ]}
      whyChoosePoints={[
        "This JavaScript formatter uses a real Prettier-based formatting engine rather than a fragile heuristic pass. That matters because JavaScript, JSX, and TypeScript-style syntax are complex, and reliable formatting should follow real parser rules instead of relying on approximate string manipulation.",
        "The page is also shaped around actual workflow needs. It lets you choose parser mode, indentation, quote preference, semicolon behavior, print width, and trailing comma rules, then shows the result side by side with copy-ready outputs. That makes it useful for developers, technical writers, QA teams, and agencies working with code snippets outside a full editor setup.",
        "A dedicated browser formatter is especially helpful when you are away from your normal editor tooling or when a snippet comes from a source that does not preserve formatting well. Console output, copied embeds, generated component props, CMS script blocks, and issue-tracker snippets all become easier to inspect after a proper formatting pass.",
        "The page also supports search intent more completely than a bare code box. Some users want instant formatting, some want help choosing settings, and some want to understand what a formatter is actually doing. Combining the real tool with explanatory content, examples, and FAQ answers creates a much stronger page overall.",
        "Because everything runs locally in the browser, the tool works well for internal snippets, staging code, client-side embeds, unpublished components, and issue reproductions where sending source code to a remote formatter would be a poor tradeoff for a job the browser can handle directly.",
      ]}
      faqs={[
        { q: "What is a JavaScript formatter?", a: "A JavaScript formatter rewrites code into a consistent layout with predictable indentation, spacing, wrapping, and punctuation style. The goal is readability and consistency, not changing program behavior." },
        { q: "Why use a formatter instead of formatting by hand?", a: "Manual formatting is slow, inconsistent, and easy to drift on across a team. A formatter makes the output predictable, reduces review noise, and lets people focus on logic rather than spacing and punctuation decisions." },
        { q: "Can this tool format JSX and TypeScript-style code?", a: "Yes. The page includes parser modes for standard JavaScript and JSX as well as TypeScript-style syntax, so you can match the code you are pasting rather than forcing everything through one parser." },
        { q: "Why did formatting fail?", a: "Formatting usually fails because the input is incomplete, contains a syntax error, or is being parsed with the wrong mode. Selecting the correct parser and checking for missing brackets or punctuation usually resolves it." },
        { q: "Does formatting change how the code runs?", a: "A formatter is intended to preserve behavior while changing presentation. It reorganizes whitespace, wrapping, and style details, but it should not alter the code's meaning when the input is valid." },
        { q: "Is formatting the same as linting?", a: "No. Formatting focuses on presentation and consistency. Linting enforces rules and can catch certain categories of mistakes or risky patterns. Teams often use both together." },
        { q: "Should I use the JSON parser mode for JSON data?", a: "Yes. If the content is actual JSON rather than JavaScript object literal syntax, the JSON parser mode is the right choice because it applies the correct parsing rules and output behavior." },
        { q: "Who uses a JavaScript formatter most often?", a: "Front-end developers, full-stack engineers, QA teams, technical writers, agencies, and support engineers all use formatters when cleaning snippets, documenting code, reviewing logic, or working outside a full editor setup." },
      ]}
      relatedTools={[
        { title: "JavaScript Minifier", slug: "javascript-minifier", icon: <Braces className="w-4 h-4" />, color: 210, benefit: "Compress code after formatting and review" },
        { title: "JSON Formatter", slug: "json-formatter", icon: <Code2 className="w-4 h-4" />, color: 170, benefit: "Switch to JSON-focused formatting workflows" },
        { title: "HTML Formatter & Beautifier", slug: "html-formatter", icon: <FileCode2 className="w-4 h-4" />, color: 30, benefit: "Clean markup alongside script snippets" },
        { title: "Base64 Encoder & Decoder", slug: "base64-encoder-decoder", icon: <Globe className="w-4 h-4" />, color: 280, benefit: "Work with encoded payloads in adjacent workflows" },
        { title: "Hash Generator", slug: "hash-generator", icon: <RefreshCw className="w-4 h-4" />, color: 145, benefit: "Validate output fingerprints when needed" },
        { title: "Markdown Previewer", slug: "online-markdown-previewer", icon: <ScanText className="w-4 h-4" />, color: 330, benefit: "Document code snippets after formatting" },
      ]}
      ctaTitle="Need More Code Formatting Tools?"
      ctaDescription="Keep formatting, minifying, encoding, and debugging source code with adjacent developer utilities in the same tool hub."
      ctaHref="/category/developer"
    />
  );
}
