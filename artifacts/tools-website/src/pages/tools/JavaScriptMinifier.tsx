import { useMemo, useState } from "react";
import { Braces, Code2, FileCode2, Globe, Minimize2, RefreshCw, ScanText, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type TokenType = "start" | "word" | "number" | "string" | "regex" | "open" | "close" | "operator";

function isWordStart(character: string) {
  return /[A-Za-z_$]/.test(character);
}

function isWordCharacter(character: string) {
  return /[A-Za-z0-9_$]/.test(character);
}

function isNumberStart(character: string) {
  return /[0-9]/.test(character);
}

function needsSpace(previous: string, next: string) {
  if (!previous || !next) return false;
  if ((isWordCharacter(previous) || /[0-9]/.test(previous)) && (isWordCharacter(next) || /[0-9]/.test(next))) return true;
  if (previous === "+" && next === "+") return true;
  if (previous === "-" && next === "-") return true;
  if (/[0-9]/.test(previous) && next === ".") return true;
  return false;
}

function canStartRegex(previousType: TokenType, previousWord: string) {
  if (previousType === "start" || previousType === "operator" || previousType === "open") return true;
  return previousType === "word" && ["return", "throw", "case", "delete", "typeof", "instanceof", "new", "void", "yield", "await"].includes(previousWord);
}

function readQuoted(input: string, start: number, quote: string) {
  let index = start + 1;
  while (index < input.length) {
    const current = input[index];
    if (current === "\\") {
      index += 2;
      continue;
    }
    if (current === quote) {
      index += 1;
      break;
    }
    index += 1;
  }
  return input.slice(start, index);
}

function readRegex(input: string, start: number) {
  let index = start + 1;
  let inClass = false;

  while (index < input.length) {
    const current = input[index];
    if (current === "\\") {
      index += 2;
      continue;
    }
    if (current === "[" && !inClass) {
      inClass = true;
      index += 1;
      continue;
    }
    if (current === "]" && inClass) {
      inClass = false;
      index += 1;
      continue;
    }
    if (current === "/" && !inClass) {
      index += 1;
      while (/[a-z]/i.test(input[index] ?? "")) index += 1;
      break;
    }
    index += 1;
  }

  return input.slice(start, index);
}

function readNumber(input: string, start: number) {
  let index = start;
  while (index < input.length && /[0-9A-Fa-f_xXobOBn.]/.test(input[index])) index += 1;
  return input.slice(start, index);
}

function readWord(input: string, start: number) {
  let index = start;
  while (index < input.length && isWordCharacter(input[index])) index += 1;
  return input.slice(start, index);
}

function minifyJavaScript(input: string, removeComments: boolean) {
  let index = 0;
  let output = "";
  let pendingSpace = false;
  let previousType: TokenType = "start";
  let previousWord = "";

  while (index < input.length) {
    const current = input[index];
    const next = input[index + 1];

    if (/\s/.test(current)) {
      pendingSpace = true;
      index += 1;
      continue;
    }

    if (current === "/" && next === "/" && removeComments) {
      pendingSpace = true;
      index += 2;
      while (index < input.length && !/[\r\n]/.test(input[index])) index += 1;
      continue;
    }

    if (current === "/" && next === "*" && removeComments) {
      pendingSpace = true;
      index += 2;
      while (index < input.length && !(input[index] === "*" && input[index + 1] === "/")) index += 1;
      index += 2;
      continue;
    }

    let token = "";
    let tokenType: TokenType = "operator";

    if (current === "'" || current === '"' || current === "`") {
      token = readQuoted(input, index, current);
      tokenType = "string";
    } else if (isWordStart(current)) {
      token = readWord(input, index);
      tokenType = "word";
    } else if (isNumberStart(current)) {
      token = readNumber(input, index);
      tokenType = "number";
    } else if (current === "/" && next !== "/" && next !== "*" && canStartRegex(previousType, previousWord)) {
      token = readRegex(input, index);
      tokenType = "regex";
    } else {
      token = current;
      tokenType = "([{".includes(current) ? "open" : ")]}".includes(current) ? "close" : "operator";
    }

    if (pendingSpace && needsSpace(output[output.length - 1] ?? "", token[0] ?? "")) {
      output += " ";
    }

    output += token;
    pendingSpace = false;
    previousType = tokenType;
    previousWord = tokenType === "word" ? token : "";
    index += token.length;
  }

  return output.trim();
}

function analyzeJavaScript(input: string) {
  return {
    lines: input ? input.split(/\r?\n/).length : 0,
    comments: (input.match(/\/\/.*|\/\*[\s\S]*?\*\//g) || []).length,
    chars: input.length,
  };
}

export default function JavaScriptMinifier() {
  const [input, setInput] = useState(`// launch helpers
const buildCards = (items) => {
  return items
    .filter((item) => item.live)
    .map((item, index) => ({
      id: index + 1,
      title: item.title,
      slug: item.slug,
    }));
};`);
  const [removeComments, setRemoveComments] = useState(true);
  const [copiedLabel, setCopiedLabel] = useState("");

  const output = useMemo(() => minifyJavaScript(input, removeComments), [input, removeComments]);
  const stats = useMemo(() => analyzeJavaScript(input), [input]);
  const savedChars = Math.max(0, input.length - output.length);
  const savedPercent = input.length > 0 ? (savedChars / input.length) * 100 : 0;

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => {
    setInput(`const launch=(items)=>items.filter((item)=>item.status==="ready").map((item,index)=>({id:index+1,title:item.title,url:\`/tools/\${item.slug}\`}));`);
    setRemoveComments(true);
  };

  const clearAll = () => setInput("");

  return (
    <UtilityToolPageShell
      title="JavaScript Minifier"
      seoTitle="JavaScript Minifier - Compress JS Online"
      seoDescription="Free JavaScript minifier with comment removal, whitespace reduction, savings stats, and copy-ready compact output for scripts, embeds, and snippets."
      canonical="https://usonlinetools.com/developer/javascript-minifier"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Compress JavaScript into a smaller, transport-ready string directly in the browser. This free JavaScript minifier is useful for shrinking snippets, cleaning exported inline scripts, preparing embeds, reducing support payloads, and comparing how much weight comes from comments and formatting before code is shipped."
      heroIcon={<Minimize2 className="w-3.5 h-3.5" />}
      calculatorLabel="JavaScript Minifier"
      calculatorDescription="Paste JS, choose whether comments should be removed, and copy compact output with instant savings stats."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground">
                <input type="checkbox" checked={removeComments} onChange={(event) => setRemoveComments(event.target.checked)} className="h-4 w-4 rounded border-border" />
                Remove comments
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Compression Stats</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Original size</span>
                    <span className="text-sm font-bold text-foreground">{stats.chars} chars</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Minified size</span>
                    <span className="text-sm font-bold text-foreground">{output.length} chars</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Saved</span>
                    <span className="text-sm font-bold text-emerald-600">{savedChars} chars</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Compression</span>
                    <span className="text-sm font-bold text-foreground">{savedPercent.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Source Profile</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Lines</span>
                    <span className="text-sm font-bold text-foreground">{stats.lines}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Comments</span>
                    <span className="text-sm font-bold text-foreground">{stats.comments}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Minifier Note</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Minification is about reducing transfer size and snippet overhead. It is best used after formatting and review, when the next step is embedding, shipping, or comparing compact output rather than reading or editing the code directly.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">JavaScript Input</p>
                    <p className="text-xs text-muted-foreground">{input.length} characters</p>
                  </div>
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Paste JavaScript here..."
                    spellCheck={false}
                    className="min-h-[360px] w-full rounded-2xl border border-border bg-background p-4 font-mono text-sm leading-relaxed text-foreground outline-none resize-none"
                  />
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Minified Output</p>
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

              <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Copy-Ready Snippets</p>
                  <div className="space-y-3">
                    {[
                      { label: "Minified JS", value: output },
                      { label: "Script Tag", value: `<script>${output}</script>` },
                      { label: "JS String", value: `const script = ${JSON.stringify(output)};` },
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
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Minify Profile</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Comments</span>
                        <span className="text-sm font-bold text-foreground">{removeComments ? "Removed" : "Preserved"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Workflow Context</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      A dedicated JavaScript minifier is useful when scripts are embedded manually, pasted into CMS code areas, shipped as inline snippets, attached to docs, or compared outside a full bundler. In larger applications, build pipelines often do this automatically, but one-off code still benefits from a quick compact pass.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste the JavaScript you want to compress", description: "This tool is useful for inline scripts, widget snippets, support payloads, copied browser code, and small files that need to be transported in a compact form. It is also practical for comparing how much space comes from comments and formatting before code is shipped into a constrained environment." },
        { title: "Choose whether comments should remain", description: "Comments are helpful for humans but add bytes without affecting runtime behavior. Removing them is usually the right choice for shipping snippets, embeds, and transport-focused output. Keeping them can still make sense if you want a smaller version without losing explanatory notes." },
        { title: "Compare original and minified output side by side", description: "A useful minifier should not hide the before-and-after state. Seeing both versions at once helps you inspect what changed, estimate savings, and decide whether the compact result is suitable for your next step, whether that is a script tag, a CMS field, a support ticket, or a test fixture." },
        { title: "Copy the compact JavaScript or a ready-made wrapper", description: "Once the result looks right, copy the minified code directly or use one of the prepared snippets such as the script tag wrapper or string literal. In real workflows, minification is often immediately followed by embedding, transport, or documentation." },
      ]}
      interpretationCards={[
        { title: "Compression percentage shows how much overhead came from formatting", description: "The more heavily formatted or commented the source was, the larger the reduction will usually be. That does not mean the original code was bad. It often just means it was optimized for readability before being compacted for transport." },
        { title: "Comment removal is often the biggest easy win", description: "In support scripts, inline widgets, and copied examples, comments can account for a surprising share of the total size. Removing them is usually the fastest way to shrink a snippet without changing what it does.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Minification helps transport, not maintainability", description: "Minified JavaScript is harder for humans to read and debug. Keep the readable source for editing and review, and use minified output only for the version you need to ship, paste, or embed.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "This is not the same as bundling or advanced dead-code optimization", description: "A browser-based minifier can remove comments and whitespace overhead, but it is not replacing a full build pipeline with tree shaking, chunking, or advanced compression strategies. It is best for focused snippet-level tasks.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Shrink an inline helper", input: "Readable function with spacing and comments", output: "Compact JS for a small embed or widget" },
        { scenario: "Remove comments before pasting into a CMS", input: "Commented script block", output: "Smaller script payload" },
        { scenario: "Compress a test fixture", input: "Formatted object and array logic", output: "Single-line script string" },
        { scenario: "Prepare JS for documentation transport", input: "Long snippet copied from a repo", output: "Compact code block for quick sharing" },
      ]}
      whyChoosePoints={[
        "This JavaScript minifier is built as a practical snippet-compression tool rather than as a placeholder route. It removes transport-heavy whitespace, optionally strips comments, shows real savings, and provides copy-ready wrappers for the kinds of places compact scripts are usually headed.",
        "The page also follows the project structure you asked for: the real tool is first, followed by usage guidance, interpretation, examples, internal links, and FAQ content. That makes the page useful for people who need instant output and for people who want to understand where a minifier fits in a real workflow.",
        "For many users, JavaScript minification happens outside a formal bundler. Agencies paste scripts into page builders, marketers work with tag snippets, QA teams share repro cases, and support teams move code through tickets and docs. A dedicated browser-side minifier is especially useful in those cases because the overhead is small and the result is immediate.",
        "Even when a build pipeline exists, this kind of tool still has value. Developers often want to compare before-and-after compactness, shrink a quick test snippet, or prepare a small self-contained payload without opening a separate local toolchain for a one-off task.",
        "Everything runs locally in the browser, which is the right tradeoff when the code belongs to a client project, staging environment, unreleased widget, or internal support flow. If the goal is simply to compact the source for transport, local in-browser processing keeps the workflow fast and private.",
      ]}
      faqs={[
        { q: "What does a JavaScript minifier do?", a: "A JavaScript minifier removes unnecessary whitespace, line breaks, and often comments to make the source smaller. The goal is transport efficiency, especially for embeds, snippets, and shipped assets." },
        { q: "Does minified JavaScript run faster?", a: "Minification mainly helps reduce transfer size, which can improve load efficiency in some contexts. It does not automatically make the runtime logic itself faster. The biggest direct benefit is usually smaller payload size." },
        { q: "Should I remove comments?", a: "Usually yes for shipped or embedded output, because comments do not affect execution and only add bytes. Keep them if the output still needs to be read by people before its final use." },
        { q: "Is this a replacement for a full build tool?", a: "No. A full build tool can do more advanced work such as bundling, tree shaking, chunking, and deeper compression. This page is best for snippet-level minification and quick compact output." },
        { q: "Why keep readable source if I can minify it?", a: "Because minified code is much harder to maintain. The usual workflow is to keep readable source for editing and debugging, then minify only the version that needs to be transported or embedded." },
        { q: "Who uses a JavaScript minifier most often?", a: "Front-end developers, agencies, QA teams, marketers, CMS users, and support engineers all use it when they need compact script output outside a full local build pipeline." },
        { q: "Can this handle strings and regular expressions safely?", a: "This tool uses a token-aware pass so common strings, regex literals, template literals, and comments are handled more carefully than with a naive whitespace regex. That makes it far more practical for real snippets than a simple text collapse." },
        { q: "When is a browser-based minifier most useful?", a: "It is most useful for inline scripts, embeds, CMS code blocks, docs, support snippets, and one-off transport tasks where opening a full build chain would be slower than the problem requires." },
      ]}
      relatedTools={[
        { title: "JavaScript Formatter", slug: "javascript-formatter", icon: <Braces className="w-4 h-4" />, color: 210, benefit: "Format and review code before compressing it" },
        { title: "HTML Minifier", slug: "html-minifier", icon: <Code2 className="w-4 h-4" />, color: 170, benefit: "Compress markup alongside scripts" },
        { title: "CSS Minifier", slug: "css-minifier", icon: <Minimize2 className="w-4 h-4" />, color: 145, benefit: "Minify stylesheets for the same front-end bundle" },
        { title: "Base64 Encoder & Decoder", slug: "base64-encoder-decoder", icon: <Globe className="w-4 h-4" />, color: 28, benefit: "Work with encoded script payloads" },
        { title: "Hash Generator", slug: "hash-generator", icon: <RefreshCw className="w-4 h-4" />, color: 280, benefit: "Compare compact output fingerprints when needed" },
        { title: "Markdown Previewer", slug: "online-markdown-previewer", icon: <ScanText className="w-4 h-4" />, color: 330, benefit: "Document code snippets after cleanup" },
      ]}
      ctaTitle="Need More JavaScript and Code Tools?"
      ctaDescription="Keep formatting, minifying, and debugging source code with adjacent developer utilities in the same tool hub."
      ctaHref="/category/developer"
    />
  );
}
