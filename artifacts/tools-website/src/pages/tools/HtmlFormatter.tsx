import { useMemo, useState } from "react";
import { Braces, Code2, FileCode2, Globe, RefreshCw, ScanText, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const rawTextTags = new Set(["script", "style", "pre", "textarea"]);

function repeatIndent(size: number, level: number) {
  return " ".repeat(size * Math.max(level, 0));
}

function formatAttributes(element: Element, multilineAttributes: boolean, indentSize: number, level: number) {
  const attributes = Array.from(element.attributes);
  if (attributes.length === 0) return "";

  if (!multilineAttributes || attributes.length === 1) {
    return attributes.map((attribute) => ` ${attribute.name}="${attribute.value}"`).join("");
  }

  return attributes
    .map((attribute) => `\n${repeatIndent(indentSize, level + 1)}${attribute.name}="${attribute.value}"`)
    .join("");
}

function formatTextContent(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function formatRawBlock(value: string, indentSize: number, level: number) {
  const trimmed = value.replace(/\r\n/g, "\n").trim();
  if (!trimmed) return "";
  return trimmed
    .split("\n")
    .map((line) => `${repeatIndent(indentSize, level)}${line.trimEnd()}`)
    .join("\n");
}

function formatNode(node: Node, indentSize: number, level: number, keepComments: boolean, multilineAttributes: boolean): string {
  if (node.nodeType === Node.TEXT_NODE) {
    const parentTag = node.parentElement?.tagName.toLowerCase() ?? "";
    if (rawTextTags.has(parentTag)) {
      return formatRawBlock(node.textContent ?? "", indentSize, level);
    }

    const text = formatTextContent(node.textContent ?? "");
    return text ? `${repeatIndent(indentSize, level)}${text}` : "";
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    if (!keepComments) return "";
    const comment = (node.textContent ?? "").trim();
    return `${repeatIndent(indentSize, level)}<!--${comment}-->`;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const element = node as Element;
  const tagName = element.tagName.toLowerCase();
  const attributeString = formatAttributes(element, multilineAttributes, indentSize, level);
  const openingTag = multilineAttributes && element.attributes.length > 1
    ? `${repeatIndent(indentSize, level)}<${tagName}${attributeString}\n${repeatIndent(indentSize, level)}>`
    : `${repeatIndent(indentSize, level)}<${tagName}${attributeString}>`;

  if (voidTags.has(tagName)) {
    return openingTag;
  }

  if (rawTextTags.has(tagName)) {
    const rawContent = formatRawBlock(element.textContent ?? "", indentSize, level + 1);
    if (!rawContent) {
      return `${openingTag}</${tagName}>`;
    }
    return `${openingTag}\n${rawContent}\n${repeatIndent(indentSize, level)}</${tagName}>`;
  }

  const children = Array.from(element.childNodes)
    .map((child) => formatNode(child, indentSize, level + 1, keepComments, multilineAttributes))
    .filter(Boolean);

  if (children.length === 0) {
    return `${openingTag}</${tagName}>`;
  }

  if (children.length === 1 && children[0] && !children[0].includes("\n") && !children[0].startsWith(repeatIndent(indentSize, level + 2))) {
    const inlineText = children[0].trim();
    if (inlineText && inlineText.length <= 80) {
      return `${openingTag}${inlineText}</${tagName}>`;
    }
  }

  return `${openingTag}\n${children.join("\n")}\n${repeatIndent(indentSize, level)}</${tagName}>`;
}

function formatHtml(input: string, indentSize: number, keepComments: boolean, multilineAttributes: boolean) {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(input, "text/html");
  const includesDoctype = /<!doctype/i.test(input);
  const includesHtmlTag = /<html[\s>]/i.test(input);

  const output: string[] = [];
  if (includesDoctype) {
    output.push("<!DOCTYPE html>");
  }

  const nodes = includesHtmlTag
    ? [documentNode.documentElement]
    : Array.from(documentNode.body.childNodes);

  nodes.forEach((node) => {
    const formatted = formatNode(node, indentSize, 0, keepComments, multilineAttributes);
    if (formatted) output.push(formatted);
  });

  return output.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function analyzeHtml(input: string) {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(input, "text/html");
  return {
    elements: documentNode.querySelectorAll("*").length,
    comments: (input.match(/<!--[\s\S]*?-->/g) || []).length,
    entities: (input.match(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g) || []).length,
  };
}

export default function HtmlFormatter() {
  const [input, setInput] = useState(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Utility Hub</title><style>.hero{display:grid;gap:20px}.hero strong{color:#2563eb}</style></head><body><section class="hero"><h1>Launch faster</h1><p>Clean <strong>HTML</strong> for reviews & debugging.</p></section></body></html>`);
  const [indentSize, setIndentSize] = useState("2");
  const [keepComments, setKeepComments] = useState(true);
  const [multilineAttributes, setMultilineAttributes] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState("");

  const output = useMemo(
    () => formatHtml(input, Number.parseInt(indentSize, 10) || 2, keepComments, multilineAttributes),
    [indentSize, input, keepComments, multilineAttributes],
  );

  const stats = useMemo(() => analyzeHtml(input), [input]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => {
    setInput(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Product launch</title></head><body><main class="layout"><section class="hero" data-theme="light" aria-labelledby="hero-title"><h1 id="hero-title">Ship polished pages</h1><p>Format exported markup before review, QA, or deployment.</p><a class="cta" href="/start">Start now</a></section></main></body></html>`);
    setIndentSize("2");
    setKeepComments(true);
    setMultilineAttributes(false);
  };

  const clearAll = () => setInput("");

  return (
    <UtilityToolPageShell
      title="HTML Formatter & Beautifier"
      seoTitle="HTML Formatter & Beautifier - Format HTML Online"
      seoDescription="Free HTML formatter and beautifier with indentation controls, comment handling, multiline attribute formatting, and copy-ready output for cleaner markup."
      canonical="https://usonlinetools.com/developer/html-formatter"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Format compact or messy HTML into readable, indented markup directly in the browser. This free HTML formatter and beautifier helps developers, marketers, QA teams, and CMS users clean exported markup, inspect generated templates, review components, and prepare readable code for debugging, publishing, and collaboration."
      heroIcon={<FileCode2 className="w-3.5 h-3.5" />}
      calculatorLabel="HTML Formatter"
      calculatorDescription="Paste markup, choose indentation and attribute layout, then copy clean HTML output instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div>
                <label htmlFor="html-indent" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Indent Size</label>
                <select id="html-indent" value={indentSize} onChange={(event) => setIndentSize(event.target.value)} className="tool-calc-input w-full">
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                </select>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground">
                <input type="checkbox" checked={keepComments} onChange={(event) => setKeepComments(event.target.checked)} className="h-4 w-4 rounded border-border" />
                Preserve comments
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground">
                <input type="checkbox" checked={multilineAttributes} onChange={(event) => setMultilineAttributes(event.target.checked)} className="h-4 w-4 rounded border-border" />
                Wrap multiple attributes to new lines
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Markup Stats</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Elements</span>
                    <span className="text-sm font-bold text-foreground">{stats.elements}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Comments</span>
                    <span className="text-sm font-bold text-foreground">{stats.comments}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Entities</span>
                    <span className="text-sm font-bold text-foreground">{stats.entities}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Formatter Insight</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Beautified HTML is easier to review, diff, annotate, and debug. It will not speed up rendering by itself, but it reduces human error during editing and helps teams inspect the real structure of templates, exported builders, and generated components.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">HTML Input</p>
                    <p className="text-xs text-muted-foreground">{input.length} characters</p>
                  </div>
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Paste HTML here..."
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

              <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Copy-Ready Snippets</p>
                  <div className="space-y-3">
                    {[
                      { label: "Formatted HTML", value: output },
                      { label: "HTML Document", value: /<!doctype/i.test(output) ? output : `<!DOCTYPE html>\n${output}` },
                      { label: "Template String", value: `const markup = ${JSON.stringify(output)};` },
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
                        <span className="text-sm text-muted-foreground">Indent</span>
                        <span className="text-sm font-bold text-foreground">{indentSize} spaces</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Comments</span>
                        <span className="text-sm font-bold text-foreground">{keepComments ? "Preserved" : "Removed"}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Attributes</span>
                        <span className="text-sm font-bold text-foreground">{multilineAttributes ? "Wrapped" : "Single line"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Workflow Note</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Use a formatter before code review, CMS cleanup, template debugging, component refactors, or when inspecting builder output. If your deployment pipeline also minifies HTML later, that is a separate step. Formatting is for humans; minification is for transport.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste the HTML you want to clean up", description: "This page handles both full HTML documents and smaller fragments such as sections, components, embed snippets, or CMS blocks. That matters because developers and content teams often need to format partial markup just as often as complete pages. A good HTML formatter should not force you to wrap fragments artificially before it becomes useful." },
        { title: "Choose indentation, comments, and attribute layout", description: "Different teams have different markup conventions. Some prefer compact attributes on one line, while others want long tag attributes wrapped for easier scanning. Some workflows need comments preserved for handoff or review, while others want them removed from the formatted output. Exposing those controls makes the result more practical than a rigid one-style formatter." },
        { title: "Review the beautified output side by side", description: "The value of an HTML formatter is not only the final copy action. It is also the ability to understand the true nesting, spot unexpected wrappers, inspect generated attributes, and confirm whether builder or CMS output matches your expectations. The side-by-side layout makes that inspection fast without switching tools or windows." },
        { title: "Copy the cleaned markup or use one of the snippets", description: "Once the markup is readable, copy it directly or grab one of the ready-made snippets such as a full document wrapper or a JavaScript template string. In practice, formatted HTML is usually headed into a code review, template file, CMS editor, or support note immediately, so quick downstream copy paths make the tool materially more useful." },
      ]}
      interpretationCards={[
        { title: "Formatted HTML improves maintainability, not browser speed", description: "Beautifying markup makes it easier for humans to read, debug, review, and edit. It does not inherently make a page render faster, but it does reduce the chance of structural mistakes going unnoticed during implementation or maintenance." },
        { title: "Wrapped attributes help on complex components", description: "Tags with many classes, ARIA labels, data attributes, or inline configuration become easier to scan when each attribute can sit on its own line. That is especially useful in design-system components, generated blocks, and marketing templates with long attribute chains.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Comments can be either context or clutter", description: "Comments help explain intent during review, migration, and handoff, but they also add visual noise when you only care about the live markup structure. Making comment preservation optional is the practical compromise.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "Formatting is not the same as validation or sanitization", description: "This tool reorganizes markup for readability. It does not guarantee semantic correctness, accessibility quality, or safety of untrusted HTML. Validation, sanitization, and linting are still separate concerns in a full production workflow.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Beautify a minified landing page", input: "<section><h1>Launch</h1><p>Fast</p></section>", output: "Readable nested markup with indentation" },
        { scenario: "Review builder-generated attributes", input: "<div class=\"hero\" data-id=\"42\" aria-label=\"Promo\"></div>", output: "Optional wrapped attributes for easier scanning" },
        { scenario: "Keep comments during migration", input: "<!-- old hero --><section>...</section>", output: "Formatted HTML with comments preserved" },
        { scenario: "Clean a fragment for documentation", input: "<button class=\"cta\">Start</button>", output: "Readable snippet ready for docs or review" },
      ]}
      whyChoosePoints={[
        "This HTML formatter and beautifier is built as a real inspection and cleanup tool rather than a placeholder page. It formats full documents and fragments, gives you indentation control, supports optional comment preservation, and can wrap multiple attributes across lines for better readability. That reflects how people actually work with markup in modern CMS, front-end, and QA workflows.",
        "The page also follows the project structure you asked for: the working widget comes first, then explanatory content, examples, interpretation, internal linking, and FAQ. That makes the page stronger for users who want instant output and for search intent where people also need help understanding what a formatter does and when it fits into a workflow.",
        "In practice, HTML formatting is often part of debugging and review rather than a standalone transformation. Developers use it to inspect exported blocks, compare generated templates, read minified embeds, and spot unexpected wrappers or attributes. Content teams use it to clean up markup copied from page builders, editors, or email tools. This page is shaped around those real use cases rather than around a bare textarea.",
        "Readable markup lowers the cost of collaboration. Whether the next step is a pull request, a support ticket, a CMS update, or an implementation note, clean HTML helps another person understand structure faster and with less risk. That is particularly useful when markup contains nested components, utility-heavy class strings, embedded data attributes, or accessibility metadata.",
        "Everything runs in the browser, which is the right tradeoff for formatting client snippets, unpublished templates, internal prototype code, or marketing blocks that should not be sent to a remote service just to add indentation. It is fast, local, and focused on the actual formatting task.",
      ]}
      faqs={[
        { q: "What does an HTML formatter do?", a: "An HTML formatter reorganizes markup into a cleaner, more readable structure with consistent indentation, spacing, and line breaks. It is mainly for human readability, debugging, collaboration, and maintenance rather than for browser performance." },
        { q: "Can I format just an HTML fragment instead of a full document?", a: "Yes. This page supports both full documents and smaller fragments such as sections, components, snippets, embeds, or CMS blocks. That is important because many day-to-day formatting tasks involve partial markup rather than complete pages." },
        { q: "Does formatting HTML make it load faster?", a: "No. Formatting is for human readability. Production performance improvements usually come from minification, compression, caching, and efficient delivery. A formatter helps before that stage by making the markup easier to inspect and edit correctly." },
        { q: "Should I preserve comments?", a: "Preserve comments when they carry context for review, migration, or handoff. Remove them when you only care about the active markup structure. The right choice depends on whether the output is mainly for people or just for a cleaner visual representation of the code." },
        { q: "Why would I wrap attributes onto multiple lines?", a: "Wrapped attributes improve readability when a tag has many classes, data attributes, ARIA labels, or configuration values. Long single-line tags become hard to scan, especially in reviews or when debugging generated markup." },
        { q: "Is formatting the same as validating HTML?", a: "No. Formatting improves presentation of the code, but it does not confirm semantic quality, accessibility, or full standards compliance. Validation and linting are separate steps." },
        { q: "Can this tool safely sanitize untrusted HTML?", a: "No. Sanitization is a security task and requires its own logic. This page is designed to format markup, not to remove unsafe content." },
        { q: "Who uses an HTML formatter most often?", a: "Front-end developers, QA engineers, agencies, technical writers, CMS editors, SEO teams, and marketers all use HTML formatters when reviewing markup, cleaning snippets, documenting components, or troubleshooting generated output." },
      ]}
      relatedTools={[
        { title: "HTML Entity Encoder & Decoder", slug: "html-entity-encoder", icon: <Braces className="w-4 h-4" />, color: 190, benefit: "Escape or restore special characters in markup" },
        { title: "CSS Formatter & Beautifier", slug: "css-formatter", icon: <Code2 className="w-4 h-4" />, color: 220, benefit: "Clean stylesheets alongside markup" },
        { title: "Markdown Previewer", slug: "online-markdown-previewer", icon: <ScanText className="w-4 h-4" />, color: 145, benefit: "Check content flow before or after HTML work" },
        { title: "URL Encoder & Decoder", slug: "url-encoder-decoder", icon: <Globe className="w-4 h-4" />, color: 30, benefit: "Prepare encoded URLs inside attributes" },
        { title: "Hash Generator", slug: "hash-generator", icon: <RefreshCw className="w-4 h-4" />, color: 275, benefit: "Validate content fingerprints in adjacent workflows" },
        { title: "JSON Formatter", slug: "json-formatter", icon: <FileCode2 className="w-4 h-4" />, color: 350, benefit: "Format structured data used by templates" },
      ]}
      ctaTitle="Need More Markup and Developer Tools?"
      ctaDescription="Keep formatting, encoding, and debugging front-end content with adjacent developer utilities in the same tool hub."
      ctaHref="/category/developer"
    />
  );
}
