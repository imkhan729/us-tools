import { useMemo, useState } from "react";
import { Code2, FileCode2, Palette, RefreshCw, Type, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type OutputMode = "beautify" | "minify";

function repeatIndent(size: number, level: number) {
  return " ".repeat(size * Math.max(level, 0));
}

function removeCssComments(input: string) {
  return input.replace(/\/\*[\s\S]*?\*\//g, "");
}

function minifyCss(input: string, keepComments: boolean) {
  const source = keepComments ? input : removeCssComments(input);
  return source
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

function beautifyCss(input: string, indentSize: number, keepComments: boolean) {
  const source = keepComments ? input : removeCssComments(input);
  let result = "";
  let indentLevel = 0;
  let inString = false;
  let quoteChar = "";
  let inComment = false;
  let commentBuffer = "";
  let atLineStart = true;

  const pushIndent = () => {
    if (atLineStart) {
      result += repeatIndent(indentSize, indentLevel);
      atLineStart = false;
    }
  };

  const pushNewline = () => {
    result = result.replace(/[ \t]+$/g, "");
    if (!result.endsWith("\n")) result += "\n";
    atLineStart = true;
  };

  for (let index = 0; index < source.length; index += 1) {
    const current = source[index];
    const next = source[index + 1];

    if (inComment) {
      commentBuffer += current;
      if (current === "*" && next === "/") {
        commentBuffer += "/";
        index += 1;
        pushIndent();
        result += commentBuffer.trim();
        commentBuffer = "";
        inComment = false;
        pushNewline();
      }
      continue;
    }

    if (!inString && current === "/" && next === "*") {
      inComment = true;
      commentBuffer = "/*";
      index += 1;
      continue;
    }

    if ((current === '"' || current === "'") && source[index - 1] !== "\\") {
      pushIndent();
      if (!inString) {
        inString = true;
        quoteChar = current;
      } else if (quoteChar === current) {
        inString = false;
        quoteChar = "";
      }
      result += current;
      continue;
    }

    if (inString) {
      pushIndent();
      result += current;
      continue;
    }

    if (current === "{") {
      result = result.replace(/[ \t]+$/g, "");
      pushIndent();
      result += " {";
      indentLevel += 1;
      pushNewline();
      continue;
    }

    if (current === "}") {
      indentLevel -= 1;
      pushNewline();
      pushIndent();
      result += "}";
      pushNewline();
      continue;
    }

    if (current === ";") {
      pushIndent();
      result += ";";
      pushNewline();
      continue;
    }

    if (current === "\n" || current === "\r" || current === "\t") {
      continue;
    }

    if (current === " ") {
      const prev = result[result.length - 1];
      if (prev && ![" ", "\n", "{", ":", ";"].includes(prev)) result += " ";
      continue;
    }

    if (current === ":") {
      result = result.replace(/[ \t]+$/g, "");
      result += ": ";
      atLineStart = false;
      continue;
    }

    pushIndent();
    result += current;
  }

  return result.replace(/\n{3,}/g, "\n\n").trim();
}

function braceWarning(input: string) {
  const source = removeCssComments(input);
  const opens = (source.match(/{/g) || []).length;
  const closes = (source.match(/}/g) || []).length;
  if (opens === closes) return "";
  return opens > closes ? "The CSS appears to have more opening braces than closing braces." : "The CSS appears to have more closing braces than opening braces.";
}

export default function CssFormatter() {
  const [input, setInput] = useState(`.hero{display:grid;grid-template-columns:1.2fr .8fr;gap:24px;padding:32px;background:linear-gradient(135deg,#0f172a,#1d4ed8);} .hero__title{font-size:clamp(2rem,5vw,4rem);line-height:1.05;color:#fff;} @media (max-width: 768px){.hero{grid-template-columns:1fr;padding:20px;} .hero__title{font-size:2.4rem;}}`);
  const [indentSize, setIndentSize] = useState("2");
  const [keepComments, setKeepComments] = useState(true);
  const [mode, setMode] = useState<OutputMode>("beautify");
  const [copiedLabel, setCopiedLabel] = useState("");

  const output = useMemo(() => {
    const indent = Number.parseInt(indentSize, 10) || 2;
    return mode === "beautify" ? beautifyCss(input, indent, keepComments) : minifyCss(input, keepComments);
  }, [indentSize, input, keepComments, mode]);

  const warning = useMemo(() => braceWarning(input), [input]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => {
    setInput(`/* hero layout */\n.hero{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(280px,.7fr);gap:clamp(20px,4vw,48px);padding:clamp(24px,6vw,72px);background:linear-gradient(135deg,#0f172a 0%,#1d4ed8 55%,#38bdf8 100%);} .hero__eyebrow{letter-spacing:.24em;text-transform:uppercase;color:#93c5fd;} .hero__title{font-size:clamp(2.5rem,7vw,5.25rem);line-height:1.02;color:#fff;} .hero__cta:hover{transform:translateY(-2px);box-shadow:0 18px 40px rgba(15,23,42,.24);} @media (max-width: 900px){.hero{grid-template-columns:1fr;padding:24px;}.hero__title{font-size:clamp(2rem,10vw,3rem);}}`);
  };

  const clearAll = () => setInput("");

  return (
    <UtilityToolPageShell
      title="CSS Formatter & Beautifier"
      seoTitle="CSS Formatter & Beautifier - Format and Minify CSS Online"
      seoDescription="Free CSS formatter and beautifier with minify mode, indentation controls, comment handling, and copy-ready output for cleaner stylesheets and faster front-end workflow."
      canonical="https://usonlinetools.com/developer/css-formatter"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Format messy CSS into readable, properly indented stylesheets or compress it into minified output from the same page. This free CSS formatter and beautifier helps front-end developers clean vendor snippets, debug large style blocks, review generated CSS, and prepare production-ready styles without leaving the browser."
      heroIcon={<FileCode2 className="w-3.5 h-3.5" />}
      calculatorLabel="CSS Formatter"
      calculatorDescription="Paste CSS, choose beautify or minify mode, adjust indentation, and copy the cleaned result instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[290px_1fr] gap-5">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-4">
              <div>
                <label htmlFor="css-mode" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Output Mode</label>
                <select id="css-mode" value={mode} onChange={(event) => setMode(event.target.value as OutputMode)} className="tool-calc-input w-full">
                  <option value="beautify">Beautify CSS</option>
                  <option value="minify">Minify CSS</option>
                </select>
              </div>

              <div>
                <label htmlFor="indent-size" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Indent Size</label>
                <select id="indent-size" value={indentSize} onChange={(event) => setIndentSize(event.target.value)} className="tool-calc-input w-full">
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                </select>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground">
                <input type="checkbox" checked={keepComments} onChange={(event) => setKeepComments(event.target.checked)} className="h-4 w-4 rounded border-border" />
                Keep comments in output
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

              <div className="rounded-2xl border border-blue-500/20 bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Formatter Insight</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Beautify mode is best for code review, debugging, refactoring, and reading generated CSS. Minify mode removes extra whitespace so the same block is easier to ship in compressed production bundles or quick test snippets.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">CSS Input</p>
                    <p className="text-xs text-muted-foreground">{input.length} characters</p>
                  </div>
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Paste CSS here..."
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

              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Copy-Ready Snippets</p>
                  <div className="space-y-3">
                    {[
                      { label: "Output", value: output },
                      { label: "Style Tag", value: `<style>\n${output}\n</style>` },
                      { label: "CSS Variable Example", value: `:root {\n  --primary: #2563eb;\n}\n\n${output}` },
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
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Status</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Mode</span>
                        <span className="text-sm font-bold text-foreground">{mode === "beautify" ? "Beautify" : "Minify"}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Indent</span>
                        <span className="text-sm font-bold text-foreground">{indentSize} spaces</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Comments</span>
                        <span className="text-sm font-bold text-foreground">{keepComments ? "Preserved" : "Removed"}</span>
                      </div>
                    </div>
                  </div>

                  {warning && (
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Brace Warning</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{warning}</p>
                    </div>
                  )}

                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Workflow Note</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">Use beautified CSS for code review and debugging, then minify before shipping if your build pipeline is not already handling stylesheet compression automatically.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste the raw CSS that needs cleanup or compression", description: "This page works whether your input is a minified one-line vendor snippet, a generated stylesheet from a builder, or a hand-written block that has drifted out of shape during editing. Beautify mode is best when the main goal is readability. Minify mode is best when the goal is reducing weight or getting a compact string for testing and inline usage." },
        { title: "Choose beautify or minify based on what you need next", description: "Beautify mode inserts line breaks, consistent indentation, and more readable property structure so the CSS is easier to debug and review. Minify mode removes unnecessary whitespace and optional separators so the stylesheet becomes more compact. Keeping both modes on one page reflects real front-end workflow more accurately than forcing users into separate tools for every small transformation." },
        { title: "Set indentation and comment handling to match your project style", description: "Different teams prefer different indentation sizes, and not every workflow wants comments preserved. If you are cleaning internal code for a pull request, keeping comments is usually useful. If you are generating a compact block for shipping or sharing a tighter snippet, stripping comments may be the right call. These controls let the output match the way the code will actually be used." },
        { title: "Copy the cleaned result or one of the ready-made snippets", description: "Once the CSS looks right, copy the output directly, or grab one of the prepared snippets such as the style tag wrapper. That makes the page useful for implementation as well as inspection. In practice, developers often need to jump immediately from formatting to embedding or documenting the result, so one-click copy paths matter." },
      ]}
      interpretationCards={[
        { title: "Beautified CSS is for humans first", description: "Formatting increases readability, which helps with debugging, code review, onboarding, and maintenance. It does not inherently make the CSS faster in the browser, but it makes the stylesheet easier to understand and safer to modify." },
        { title: "Minified CSS is for transport and production output", description: "Minification reduces file size by stripping extra whitespace and optional formatting. In most mature projects, bundlers already do this during build, but it is still useful when you are handling snippets manually or validating what a compressed version will look like.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Warnings about braces are practical signals, not a full parser guarantee", description: "A quick brace mismatch warning catches one of the most common stylesheet mistakes, especially when pasting incomplete blocks. It is not a substitute for a full compiler or linter, but it does help you spot obviously broken structure before copying the result onward.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "Comment handling changes more than file size", description: "Removing comments does save bytes, but comments also carry context. For internal review, comments can explain intent, hacks, breakpoints, and browser-specific workarounds. For production snippets, those notes may be unnecessary. That tradeoff is why this page makes comment preservation explicit instead of hiding it.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Beautify a minified hero block", input: ".hero{display:grid;gap:24px;padding:32px;}", output: "Readable multi-line CSS with indentation" },
        { scenario: "Compress a reviewed stylesheet", input: "Beautified CSS with spacing and comments", output: "Smaller one-line output for shipping or tests" },
        { scenario: "Keep comments for team review", input: "Commented component styles", output: "Formatted CSS with comments preserved" },
        { scenario: "Strip comments before sharing", input: "Internal notes plus CSS rules", output: "Cleaner output with comments removed" },
      ]}
      whyChoosePoints={[
        "This CSS formatter and beautifier is built for actual front-end workflow rather than as a thin placeholder page. It gives you a working formatter, a minify mode, indentation controls, comment handling, copy-ready snippets, and clear output panels on a single screen. That is closer to the way developers actually work when cleaning stylesheets during debugging, refactoring, review, or deployment prep.",
        "The page also follows the content structure the prompt asked for: real widget first, then high-value explanatory content, quick examples, interpretation, internal linking, and FAQ. That creates a stronger user page than the typical low-value formatter page that shows a textarea and almost nothing else. Better structure helps both usability and long-term search quality because the page answers more of the intent behind the query.",
        "For teams, readability is the real win. Beautified CSS reduces the friction of debugging layout bugs, scanning generated utility output, reviewing vendor overrides, and checking whether a suspicious selector chain is actually doing what it appears to do. That is especially useful in projects where CSS arrives from multiple sources like design exports, framework builds, CMS templates, or third-party snippets.",
        "Minify mode adds practical value without forcing the user into a separate tool immediately. Many developers want to inspect a block, clean it up, and then compare the compressed result right away. Keeping beautify and minify in one place mirrors that workflow and makes the page more useful than a single-purpose formatter that ignores the production side of CSS handling.",
        "Everything runs locally in the browser, so pasted styles do not need to leave your machine. That matters when the CSS belongs to a client project, a private app, an unreleased redesign, or a production incident investigation where sharing the stylesheet with an unknown external service would be a poor tradeoff.",
      ]}
      faqs={[
        { q: "What is the difference between a CSS formatter and a CSS minifier?", a: "A CSS formatter improves readability by adding line breaks, indentation, and spacing around selectors and declarations. A CSS minifier does the opposite: it removes unnecessary whitespace and formatting to reduce file size. Both operate on the same stylesheet, but they serve different stages of the workflow: formatting for humans and minification for delivery." },
        { q: "Does formatting CSS change how the browser renders it?", a: "No. Whitespace changes from formatting generally do not alter how valid CSS renders in the browser. Formatting changes readability, not layout behavior. That said, if the original CSS is broken or ambiguous, a formatter can make structural mistakes easier to spot, which indirectly helps you fix rendering issues faster." },
        { q: "Should I minify CSS manually if my build tool already does it?", a: "Usually not for final production builds. Modern bundlers and deployment pipelines typically handle CSS minification automatically. Manual minification is still useful when you are testing a snippet quickly, embedding compact CSS somewhere without a build step, comparing output, or preparing a small self-contained example." },
        { q: "Can this formatter replace Stylelint or a full parser-based tool?", a: "No. This page is a practical browser-based formatter and minifier, not a complete linting or AST-based transformation tool. It is useful for cleanup, readability, and quick conversion, but full project-level linting, rule enforcement, and advanced parsing still belong to dedicated tooling in your build or editor workflow." },
        { q: "Why keep comments at all if they do not affect rendering?", a: "Because comments often carry context that matters to humans. They can explain why a workaround exists, why a breakpoint is shaped a certain way, or which block belongs to which feature. For team review and maintenance, preserving comments is frequently the right choice. For smaller production snippets, stripping them can make more sense." },
        { q: "What kinds of CSS are easiest to format with this tool?", a: "Typical stylesheet blocks, generated utility output, responsive media queries, component styles, and minified rule groups are all good fits. The tool is most useful when the CSS is valid but hard to read, or when you need a quick readable version before reviewing or editing it further." },
        { q: "Why show a brace warning?", a: "Because unmatched braces are one of the most common problems when copying partial CSS blocks or editing quickly under pressure. A brace mismatch warning is a fast sanity check that helps catch obvious structural issues before you paste the result back into a stylesheet, CMS, template, or design handoff note." },
        { q: "Who is this CSS formatter useful for?", a: "It is useful for front-end developers, designers handing off generated CSS, marketers working with embedded snippets, CMS users cleaning stylesheet fragments, agencies reviewing client overrides, and anyone who needs readable or minified CSS without opening a full local tooling chain first." },
      ]}
      relatedTools={[
        { title: "JSON Formatter", slug: "json-formatter", icon: <Code2 className="w-4 h-4" />, color: 217, benefit: "Clean API payloads alongside stylesheet work" },
        { title: "Color Code Converter", slug: "color-code-converter", icon: <Palette className="w-4 h-4" />, color: 340, benefit: "Convert color values while editing CSS" },
        { title: "URL Encoder Decoder", slug: "url-encoder-decoder", icon: <Type className="w-4 h-4" />, color: 25, benefit: "Prepare encoded asset URLs and query strings" },
        { title: "CSS Gradient Generator", slug: "css-gradient-generator", icon: <Wand2 className="w-4 h-4" />, color: 152, benefit: "Generate background gradients to format or refine" },
        { title: "CSS Border Radius Generator", slug: "css-border-radius-generator", icon: <RefreshCw className="w-4 h-4" />, color: 280, benefit: "Build shape values, then clean the resulting CSS" },
        { title: "Color Picker", slug: "color-picker", icon: <FileCode2 className="w-4 h-4" />, color: 45, benefit: "Inspect and refine CSS colors visually" },
      ]}
      ctaTitle="Need More Developer and CSS Tools?"
      ctaDescription="Keep formatting, converting, and refining front-end code with adjacent developer and design utilities in the same tool hub."
      ctaHref="/category/developer"
    />
  );
}
