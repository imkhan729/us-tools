import { useMemo, useState } from "react";
import { ArrowRightLeft, Braces, Code2, Copy, Eye, FileCode2, RefreshCw, ScanText, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type OutputMode = "fragment" | "article" | "document";

const SAMPLE_MARKDOWN = `# Launch Notes

Convert Markdown into clean HTML for docs, CMS fields, help centers, and static-site workflows.

## Highlights

- Preserve headings, lists, and links
- Generate HTML fragments or full documents
- Preview the rendered result before copying

> Markdown is easy to draft. HTML is often what the next system expects.

Visit [Utility Hub](https://usonlinetools.com) for more tools.

\`\`\`js
const status = "published";
console.log(status);
\`\`\`
`;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInline(value: string) {
  let html = escapeHtml(value);

  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/~~([^~]+)~~/g, "<del>$1</del>");

  return html;
}

function renderMarkdown(markdown: string) {
  const lines = markdown.replace(/\r/g, "").split("\n");
  const blocks: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.trim() === "") {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      const languageClass = language ? ` class="language-${escapeHtml(language)}"` : "";
      blocks.push(`<pre><code${languageClass}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      blocks.push(`<h${level}>${renderInline(headingMatch[2])}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      blocks.push("<hr />");
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push(`<blockquote><p>${quoteLines.map((item) => renderInline(item)).join("<br />")}</p></blockquote>`);
      continue;
    }

    if (/^[-*+]\s+/.test(line)) {
      const listItems: string[] = [];
      while (index < lines.length && /^[-*+]\s+/.test(lines[index])) {
        listItems.push(lines[index].replace(/^[-*+]\s+/, ""));
        index += 1;
      }
      blocks.push(`<ul>${listItems.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const listItems: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        listItems.push(lines[index].replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push(`<ol>${listItems.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ol>`);
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() !== "" &&
      !lines[index].startsWith("```") &&
      !/^(#{1,6})\s+/.test(lines[index]) &&
      !/^>\s?/.test(lines[index]) &&
      !/^[-*+]\s+/.test(lines[index]) &&
      !/^\d+\.\s+/.test(lines[index]) &&
      !/^(-{3,}|\*{3,})$/.test(lines[index].trim())
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }
    blocks.push(`<p>${renderInline(paragraphLines.join(" "))}</p>`);
  }

  return blocks.join("\n");
}

function wrapHtml(fragment: string, mode: OutputMode) {
  if (mode === "fragment") return fragment;
  if (mode === "article") return `<article class="markdown-body">\n${fragment}\n</article>`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Markdown Output</title>
</head>
<body>
${fragment}
</body>
</html>`;
}

export default function MarkdownToHtmlConverter() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [outputMode, setOutputMode] = useState<OutputMode>("fragment");
  const [copiedLabel, setCopiedLabel] = useState("");

  const htmlFragment = useMemo(() => renderMarkdown(markdown), [markdown]);
  const htmlOutput = useMemo(() => wrapHtml(htmlFragment, outputMode), [htmlFragment, outputMode]);
  const stats = useMemo(() => {
    const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
    const headings = (markdown.match(/^#{1,6}\s+/gm) || []).length;
    const links = (markdown.match(/\[[^\]]+\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g) || []).length;
    const codeBlocks = (markdown.match(/^```/gm) || []).length / 2;
    return { words, headings, links, codeBlocks };
  }, [markdown]);

  const copyValue = async (label: string, value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => {
    setMarkdown(SAMPLE_MARKDOWN);
    setOutputMode("fragment");
  };

  const clearAll = () => setMarkdown("");

  return (
    <UtilityToolPageShell
      title="Markdown to HTML Converter"
      seoTitle="Markdown to HTML Converter - Convert Markdown to HTML Online"
      seoDescription="Free Markdown to HTML converter with fragment and full-document output modes, live preview, stats, and copy-ready HTML snippets for docs and CMS workflows."
      canonical="https://usonlinetools.com/developer/markdown-to-html"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Convert Markdown into clean HTML directly in the browser for documentation, CMS publishing, static-site workflows, support articles, and content migrations. This Markdown to HTML converter is built for real publishing work where the source starts as Markdown but the next system expects HTML output."
      heroIcon={<ArrowRightLeft className="w-3.5 h-3.5" />}
      calculatorLabel="Markdown to HTML Converter"
      calculatorDescription="Paste Markdown, choose the output mode, preview the rendered result, and copy production-ready HTML instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div>
                <label htmlFor="output-mode" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Output Mode</label>
                <select id="output-mode" value={outputMode} onChange={(event) => setOutputMode(event.target.value as OutputMode)} className="tool-calc-input w-full">
                  <option value="fragment">HTML fragment</option>
                  <option value="article">Article wrapper</option>
                  <option value="document">Full HTML document</option>
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Source Stats</p>
                <div className="space-y-2">
                  {[
                    { label: "Words", value: stats.words },
                    { label: "Headings", value: stats.headings },
                    { label: "Links", value: stats.links },
                    { label: "Code blocks", value: stats.codeBlocks },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm font-bold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Converter Insight</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Markdown is excellent for authoring and version control, but many CMS editors, email tools, and embedded content systems still expect HTML. This converter bridges that gap without forcing you into a separate publishing stack.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Markdown Input</p>
                    <p className="text-xs text-muted-foreground">{markdown.length} characters</p>
                  </div>
                  <textarea
                    value={markdown}
                    onChange={(event) => setMarkdown(event.target.value)}
                    placeholder="Paste Markdown here..."
                    spellCheck={false}
                    className="tool-calc-textarea min-h-[360px]"
                  />
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">HTML Output</p>
                    <button onClick={() => copyValue("output", htmlOutput)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === "output" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={htmlOutput}
                    spellCheck={false}
                    className="tool-calc-textarea tool-calc-output min-h-[360px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Copy-Ready Snippets</p>
                  <div className="space-y-3">
                    {[
                      { label: "HTML Output", value: htmlOutput },
                      { label: "Body Fragment", value: `<section>\n${htmlFragment}\n</section>` },
                      { label: "JS String", value: `const html = ${JSON.stringify(htmlOutput)};` },
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
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Output Profile</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Mode</span>
                        <span className="text-sm font-bold text-foreground capitalize">{outputMode}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Fragment lines</span>
                        <span className="text-sm font-bold text-foreground">{htmlFragment ? htmlFragment.split("\n").length : 0}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Output length</span>
                        <span className="text-sm font-bold text-foreground">{htmlOutput.length} chars</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Workflow Note</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Markdown-to-HTML conversion is especially useful when your drafting workflow lives in Markdown but the destination is an HTML field, a CMS editor, a documentation embed, or a system that stores formatted content as markup.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Rendered Preview</p>
                </div>
                <div
                  className="prose prose-slate max-w-none rounded-2xl border border-border bg-background p-5 dark:prose-invert prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-li:text-slate-700 dark:prose-li:text-slate-300"
                  dangerouslySetInnerHTML={{ __html: htmlFragment || "<p>Start typing Markdown to preview the rendered HTML here.</p>" }}
                />
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste or write the Markdown you want to publish", description: "This tool is built for the common workflow where content starts as Markdown because it is easy to draft, review, and store in version control, but the destination system expects HTML. That includes CMS fields, embedded docs blocks, support platforms, static-site build steps, and content migration tasks where raw Markdown cannot be used directly." },
        { title: "Choose the right HTML output mode for the destination", description: "Sometimes you need only an HTML fragment to paste into an editor. Sometimes you want a wrapped article block so the markup has a predictable container. And sometimes you want a full document shell for testing or export. Exposing those modes directly saves cleanup time because the output can match the next system more closely." },
        { title: "Review the generated HTML and the rendered preview together", description: "Good content conversion is not only about producing a string. You also need to confirm that headings, quotes, lists, links, and code blocks survive the trip in a useful form. Seeing the rendered preview next to the output helps you catch structural issues before the HTML is pasted into a CMS, a help article, or a static template." },
        { title: "Copy the final HTML or one of the prepared snippets", description: "Once the result looks right, the next step is usually immediate: paste it into a publishing field, commit it into a project, or embed it into another template. The copy actions and prepared snippets reduce the friction between conversion and actual use, which is what separates a practical tool page from a simple demo." },
      ]}
      interpretationCards={[
        { title: "Markdown is the authoring format, HTML is often the delivery format", description: "Markdown is easier to write, scan, and diff. HTML is often what publishing systems, embeds, email tools, and rich content fields actually consume. Converting between the two is a common bridge task rather than an edge case." },
        { title: "Fragments are usually better for CMS fields", description: "If the next destination already provides its own page shell, styles, or layout wrapper, an HTML fragment is usually the cleanest output. Full document mode is more useful when you need a standalone export or a quick testing shell.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Rendered preview matters because HTML strings are hard to scan by eye", description: "A converter can generate technically valid markup and still surprise you visually. Previewing the rendered result makes it easier to check heading hierarchy, list structure, link preservation, and code block readability before the HTML is published anywhere.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "Conversion does not replace sanitization or policy checks", description: "This tool converts Markdown into HTML structure. It does not perform destination-specific sanitization, styling policy enforcement, or editorial review. Those still belong in the receiving system or the team workflow.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Convert a section heading and paragraph", input: "## Release notes", output: "<h2>Release notes</h2> plus paragraph markup" },
        { scenario: "Publish a checklist", input: "- Item one\\n- Item two", output: "<ul> with list items" },
        { scenario: "Preserve an external link", input: "[Docs](https://example.com)", output: "<a href=\"https://example.com\">Docs</a>" },
        { scenario: "Convert fenced code", input: "```js ... ```", output: "<pre><code class=\"language-js\">" },
      ]}
      whyChoosePoints={[
        "This Markdown to HTML converter is built as a real publishing utility rather than a thin preview page. It transforms Markdown into usable HTML, lets you choose between fragment, article, and full-document output, shows a rendered preview, and provides copy-ready snippets for immediate downstream use. That makes it practical for docs, CMS fields, support content, templates, and migration workflows.",
        "The page also mirrors the stronger structure used across the implemented developer tools. The working converter comes first, but it is supported by explanation, examples, interpretation guidance, FAQ coverage, and related internal links that make the page useful for both direct tool intent and broader search intent around Markdown and HTML workflows.",
        "Markdown remains popular because it is easier to author and maintain than raw HTML, especially in repository-based documentation, technical notes, changelogs, and content drafts. But HTML is still the required output in many environments. Converting cleanly between the two is therefore a common operational task, not just a convenience feature.",
        "For teams, the biggest advantage is reduction of manual cleanup. Without a converter, authors often end up copying Markdown into another app, reformatting lists and links manually, and trying to preserve code blocks by hand. A good converter removes most of that repetitive work while keeping the structure readable enough to validate before publishing.",
        "Everything runs locally in the browser, which is the right tradeoff for internal notes, unpublished docs, client drafts, help-center copy, and content that should not be sent to another service just to produce HTML. Local conversion keeps the workflow fast and keeps the source under your control.",
      ]}
      faqs={[
        { q: "What does a Markdown to HTML converter do?", a: "It turns Markdown syntax into HTML markup so headings, paragraphs, lists, links, code blocks, blockquotes, and other common structures can be used in systems that expect HTML instead of raw Markdown." },
        { q: "Why convert Markdown to HTML?", a: "Because many drafting and documentation workflows start in Markdown, but the destination system may require HTML for rendering, embedding, storage, or publishing. Conversion bridges that gap without forcing you to reformat everything manually." },
        { q: "What is the difference between fragment, article, and document output?", a: "Fragment mode gives you only the converted markup. Article mode wraps that markup in a container element. Document mode produces a standalone HTML page shell with head and body tags. The right choice depends on where the output is going next." },
        { q: "Does this support every Markdown feature?", a: "No. It focuses on common practical structures such as headings, paragraphs, lists, links, emphasis, blockquotes, inline code, horizontal rules, and fenced code blocks. That covers a large share of real content conversion workflows without pretending to match every Markdown dialect." },
        { q: "Why include a preview if I already have the HTML output?", a: "Because raw HTML is harder to scan visually. The preview helps confirm that the converted content still looks structurally correct before you paste it into a CMS, support tool, template, or publishing system." },
        { q: "Can I use this for README and docs content?", a: "Yes. It is especially useful when README or docs content is authored in Markdown but later needs to be embedded in HTML-based pages, CMS blocks, or richer content systems." },
        { q: "Does this sanitize the HTML for my destination platform?", a: "No. The tool generates HTML from Markdown, but destination-specific sanitization and policy checks are separate concerns handled by the receiving platform or your publishing workflow." },
        { q: "Who uses a Markdown to HTML converter most often?", a: "Developers, technical writers, content teams, SEO teams, support teams, agencies, and migration specialists use it when Markdown-authored content needs to move into HTML-based systems without losing core document structure." },
      ]}
      relatedTools={[
        { title: "Markdown Previewer", slug: "online-markdown-previewer", icon: <ScanText className="w-4 h-4" />, color: 150, benefit: "Draft and review Markdown before conversion" },
        { title: "HTML to Markdown Converter", slug: "html-to-markdown", icon: <ArrowRightLeft className="w-4 h-4" />, color: 210, benefit: "Move the other direction when content starts in HTML" },
        { title: "HTML Formatter & Beautifier", slug: "html-formatter", icon: <FileCode2 className="w-4 h-4" />, color: 265, benefit: "Clean generated HTML before publishing" },
        { title: "HTML Minifier", slug: "html-minifier", icon: <Code2 className="w-4 h-4" />, color: 28, benefit: "Compress markup after conversion when needed" },
        { title: "JSON Formatter", slug: "json-formatter", icon: <Braces className="w-4 h-4" />, color: 330, benefit: "Format adjacent structured data in docs workflows" },
        { title: "CSS Formatter & Beautifier", slug: "css-formatter", icon: <Wand2 className="w-4 h-4" />, color: 185, benefit: "Clean related styling snippets in content embeds" },
      ]}
      ctaTitle="Need More Markdown and HTML Tools?"
      ctaDescription="Keep converting, previewing, formatting, and cleaning content with adjacent developer utilities in the same tool hub."
      ctaHref="/category/developer"
    />
  );
}
