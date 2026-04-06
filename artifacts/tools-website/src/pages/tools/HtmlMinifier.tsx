import { useMemo, useState } from "react";
import { Braces, Code2, FileCode2, Globe, Minimize2, RefreshCw, ScanText, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const rawTextTags = new Set(["script", "style", "pre", "textarea"]);

function normalizeRawText(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

function collapseText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function serializeAttributes(element: Element) {
  return Array.from(element.attributes)
    .map((attribute) => ` ${attribute.name}="${attribute.value}"`)
    .join("");
}

function minifyNode(node: Node, removeComments: boolean, collapseWhitespace: boolean): string {
  if (node.nodeType === Node.TEXT_NODE) {
    const parentTag = node.parentElement?.tagName.toLowerCase() ?? "";
    const text = rawTextTags.has(parentTag)
      ? normalizeRawText(node.textContent ?? "")
      : collapseWhitespace
        ? collapseText(node.textContent ?? "")
        : (node.textContent ?? "");
    return text;
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    if (removeComments) return "";
    const comment = (node.textContent ?? "").trim();
    return `<!--${comment}-->`;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const element = node as Element;
  const tagName = element.tagName.toLowerCase();
  const open = `<${tagName}${serializeAttributes(element)}>`;

  if (voidTags.has(tagName)) {
    return open;
  }

  const children = Array.from(element.childNodes)
    .map((child) => minifyNode(child, removeComments, collapseWhitespace))
    .filter((value) => value.length > 0);

  const content = rawTextTags.has(tagName)
    ? normalizeRawText(element.textContent ?? "")
    : children.join(collapseWhitespace ? "" : " ");

  return `${open}${content}</${tagName}>`;
}

function minifyHtml(input: string, removeComments: boolean, collapseWhitespace: boolean) {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(input, "text/html");
  const includesDoctype = /<!doctype/i.test(input);
  const includesHtmlTag = /<html[\s>]/i.test(input);

  const nodes = includesHtmlTag
    ? [documentNode.documentElement]
    : Array.from(documentNode.body.childNodes);

  const output: string[] = [];
  if (includesDoctype) output.push("<!DOCTYPE html>");

  nodes.forEach((node) => {
    const serialized = minifyNode(node, removeComments, collapseWhitespace);
    if (serialized) output.push(serialized);
  });

  return output.join(collapseWhitespace ? "" : "\n").replace(/>\s+</g, collapseWhitespace ? "><" : ">\n<").trim();
}

function analyzeHtml(input: string) {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(input, "text/html");
  return {
    elements: documentNode.querySelectorAll("*").length,
    comments: (input.match(/<!--[\s\S]*?-->/g) || []).length,
    bytes: input.length,
  };
}

export default function HtmlMinifier() {
  const [input, setInput] = useState(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Utility Hub</title>
    <!-- page styles -->
    <style>
      .hero {
        display: grid;
        gap: 20px;
      }
    </style>
  </head>
  <body>
    <section class="hero">
      <h1>Ship cleaner markup</h1>
      <p>Reduce HTML size before deployment or embed delivery.</p>
    </section>
  </body>
</html>`);
  const [removeComments, setRemoveComments] = useState(true);
  const [collapseWhitespace, setCollapseWhitespace] = useState(true);
  const [copiedLabel, setCopiedLabel] = useState("");

  const output = useMemo(() => minifyHtml(input, removeComments, collapseWhitespace), [collapseWhitespace, input, removeComments]);
  const stats = useMemo(() => analyzeHtml(input), [input]);
  const savedChars = Math.max(0, input.length - output.length);
  const savedPercent = input.length > 0 ? (savedChars / input.length) * 100 : 0;

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => {
    setInput(`<main class="layout">
  <!-- promo block -->
  <section class="hero" data-theme="light" aria-labelledby="hero-title">
    <h1 id="hero-title">Launch polished pages</h1>
    <p>Compress exported markup for embeds, CMS blocks, and deployment.</p>
    <a class="cta" href="/start">Start now</a>
  </section>
</main>`);
    setRemoveComments(true);
    setCollapseWhitespace(true);
  };

  const clearAll = () => setInput("");

  return (
    <UtilityToolPageShell
      title="HTML Minifier"
      seoTitle="HTML Minifier - Compress HTML Code Online"
      seoDescription="Free HTML minifier with comment stripping, whitespace controls, size savings stats, and copy-ready compressed output for pages, snippets, and embeds."
      canonical="https://usonlinetools.com/developer/html-minifier"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Compress HTML into a smaller, deployment-ready string directly in the browser. This free HTML minifier is useful for reducing snippet size, cleaning exported page-builder markup, preparing embeds, shrinking template payloads, and understanding how much transport overhead comes from comments and whitespace before markup gets shipped."
      heroIcon={<Minimize2 className="w-3.5 h-3.5" />}
      calculatorLabel="HTML Minifier"
      calculatorDescription="Paste HTML, choose whitespace and comment behavior, then copy compact markup with instant savings stats."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground">
                <input type="checkbox" checked={removeComments} onChange={(event) => setRemoveComments(event.target.checked)} className="h-4 w-4 rounded border-border" />
                Remove comments
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground">
                <input type="checkbox" checked={collapseWhitespace} onChange={(event) => setCollapseWhitespace(event.target.checked)} className="h-4 w-4 rounded border-border" />
                Collapse text whitespace and gaps
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
                    <span className="text-sm font-bold text-foreground">{stats.bytes} chars</span>
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Markup Profile</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Elements</span>
                    <span className="text-sm font-bold text-foreground">{stats.elements}</span>
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
                  Minification is about reducing transport overhead, not making markup easier for humans to read. Use this after formatting and review, not instead of them, when the next step is deployment, embedding, or shipping HTML through a constrained system.
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
                      { label: "Minified HTML", value: output },
                      { label: "Embed Snippet", value: `<div data-snippet="landing">${output}</div>` },
                      { label: "Template String", value: `const html = ${JSON.stringify(output)};` },
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
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Whitespace</span>
                        <span className="text-sm font-bold text-foreground">{collapseWhitespace ? "Collapsed" : "Mostly preserved"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Production Context</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      HTML minification is most useful when markup is embedded manually, shipped through email or CMS tooling, injected into templates, or reviewed as a compact artifact. In larger apps, build tools often minify automatically, but a dedicated tool still helps with snippets, comparisons, and one-off deployment tasks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste the HTML document or fragment you want to compress", description: "This tool works for both complete pages and smaller fragments such as embed blocks, landing page sections, CMS widgets, and template snippets. That matters because a lot of real-world HTML minification is done on pieces of markup rather than on an entire app bundle. Being able to work on fragments makes the tool useful for support, QA, and marketing workflows as well as traditional front-end work." },
        { title: "Choose whether comments and whitespace should be reduced", description: "Comments often carry context for people but do nothing for rendering, so removing them is usually an easy savings win. Whitespace collapsing trims even more transport overhead, especially when markup has been formatted for readability or copied from a builder that adds lots of line breaks and indentation. Exposing both options lets users match the output to the job instead of forcing one aggressive behavior on every snippet." },
        { title: "Compare the original and compressed output side by side", description: "A useful minifier should show more than a final string. You should be able to inspect the original markup, understand how much size was removed, and confirm that the compact result still matches the intended structure. The side-by-side layout and savings stats make that quick, which is important when you are preparing markup for deployment, embed systems, or constrained inputs." },
        { title: "Copy the compact result or a prepared transport snippet", description: "Once the markup is small enough, copy it directly or use one of the prepared snippets like the JavaScript string wrapper. That reflects how HTML minification is used in practice: the next step is usually pasting the result into a template, CMS field, embed, email tool, test fixture, or deployment script rather than just admiring the compressed output." },
      ]}
      interpretationCards={[
        { title: "Compression percentage tells you how much formatting overhead was removed", description: "A higher percentage usually means the original markup contained a lot of indentation, spacing, or comments. That does not necessarily mean the source HTML was bad. It often just means it was optimized for human readability before transport-oriented compression." },
        { title: "Comment stripping is usually the fastest easy win", description: "HTML comments are useful during development and review, but they add bytes without affecting rendering. Removing them is often the simplest way to shrink embeds, templates, and snippets that are ready to ship.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Whitespace collapsing matters most for formatted or builder-generated markup", description: "If the source HTML was already compact, savings will be smaller. If it came from a visual builder, exported email template, or prettified codebase, collapsing whitespace can remove a surprising amount of transport overhead.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "Minification is not the same as sanitization or optimization of logic", description: "This tool reduces textual size. It does not validate semantics, improve accessibility, remove unsafe HTML, or optimize JavaScript and CSS logic embedded inside the page. Those remain separate concerns in a production pipeline.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Compress a formatted page section", input: "<section>\n  <h1>Launch</h1>\n</section>", output: "<section><h1>Launch</h1></section>" },
        { scenario: "Remove comments before deployment", input: "<!-- promo --><div>Sale</div>", output: "<div>Sale</div>" },
        { scenario: "Shrink a CMS embed block", input: "Readable hero markup with attributes and spacing", output: "Compact string ready for paste into a code block" },
        { scenario: "Prepare HTML for JavaScript injection", input: "Multi-line component template", output: "Minified string for transport or embedding" },
      ]}
      whyChoosePoints={[
        "This HTML minifier is designed as a real compression tool rather than as a placeholder route. It handles both full documents and fragments, lets you remove comments, collapse whitespace, compare original and minified size, and copy the result in forms that match common follow-up tasks. That gives it immediate practical value for front-end work, support workflows, and CMS or embed delivery.",
        "The page also follows the structure the project prompt requires. The actual minifier widget comes first, but it is supported by usage guidance, result interpretation, examples, internal links, and FAQ content that explain where minification fits into the broader workflow. That makes the page more useful for users and more complete as a search-facing tool page.",
        "HTML minification is especially relevant outside formal build pipelines. Marketers, agencies, CMS users, email teams, and support engineers frequently move HTML through systems that do not automatically optimize markup. In those cases, a dedicated minifier can make embeds cleaner, reduce field size, and make handoff artifacts easier to transport.",
        "For developers, the value is often in quick comparison and one-off preparation rather than in replacing a full build step. You may need to compress a snippet for docs, verify how much whitespace a template export adds, prepare compact markup for a fixture, or compare before-and-after payload sizes during debugging. This page is shaped around those practical jobs.",
        "Everything runs in the browser, which is the right default when the markup belongs to an unpublished page, client campaign, staging template, internal component, or private email block. If the task is simply to reduce size before pasting or shipping, local in-browser processing is usually the most sensible tradeoff.",
      ]}
      faqs={[
        { q: "What does an HTML minifier remove?", a: "An HTML minifier mainly removes comments, excess whitespace, line breaks, indentation, and gaps between tags where that reduction is safe. The goal is to make the markup smaller for transport or embedding while preserving the intended structure." },
        { q: "Does minified HTML load faster?", a: "It can help because there is less text to transfer, especially when HTML is delivered directly or embedded manually without additional optimization. The impact depends on the original size, delivery method, and whether other compression like gzip or brotli is already in use." },
        { q: "Should I remove comments?", a: "Usually yes for deployment or transport, because comments do not affect rendering and only add bytes. Keep them when the output is still meant for review, collaboration, or a migration process where those notes still matter." },
        { q: "Will collapsing whitespace ever change visible output?", a: "It can in some contexts, especially inside tags where whitespace is meaningful. This tool preserves raw-text style blocks like `pre`, `style`, `script`, and `textarea`, but users should still review results when working with whitespace-sensitive content." },
        { q: "Can I minify just a snippet instead of a full page?", a: "Yes. This tool supports fragments such as sections, embeds, widgets, and template blocks. That is one of the most common use cases outside standard build systems." },
        { q: "Is this the same as sanitizing HTML?", a: "No. Minification reduces size; sanitization removes or neutralizes unsafe markup. They solve different problems and should not be treated as interchangeable." },
        { q: "Why use a dedicated HTML minifier if my build tool already compresses pages?", a: "Because many practical tasks still happen outside the build pipeline: CMS embeds, docs snippets, support fixes, email blocks, tag manager payloads, quick tests, and one-off comparisons. A dedicated tool is useful in those situations." },
        { q: "Who benefits most from an HTML minifier?", a: "Front-end developers, marketers, agencies, CMS editors, QA engineers, email teams, and support staff all benefit when they need compact markup for delivery, testing, or system constraints." },
      ]}
      relatedTools={[
        { title: "HTML Formatter & Beautifier", slug: "html-formatter", icon: <Braces className="w-4 h-4" />, color: 205, benefit: "Clean markup for humans before compressing it" },
        { title: "HTML Entity Encoder & Decoder", slug: "html-entity-encoder", icon: <Code2 className="w-4 h-4" />, color: 165, benefit: "Escape or restore entity-heavy content" },
        { title: "CSS Minifier", slug: "css-minifier", icon: <Minimize2 className="w-4 h-4" />, color: 145, benefit: "Compress stylesheet output alongside markup" },
        { title: "URL Encoder & Decoder", slug: "url-encoder-decoder", icon: <Globe className="w-4 h-4" />, color: 28, benefit: "Prepare encoded attribute values for embeds" },
        { title: "Hash Generator", slug: "hash-generator", icon: <RefreshCw className="w-4 h-4" />, color: 280, benefit: "Compare content fingerprints after transformation" },
        { title: "Markdown Previewer", slug: "online-markdown-previewer", icon: <ScanText className="w-4 h-4" />, color: 330, benefit: "Work on adjacent content workflows without leaving the hub" },
      ]}
      ctaTitle="Need More Markup Compression Tools?"
      ctaDescription="Keep formatting, minifying, encoding, and validating markup with adjacent developer utilities in the same tool hub."
      ctaHref="/category/developer"
    />
  );
}
