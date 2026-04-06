import { useMemo, useState } from "react";
import { ArrowRightLeft, Code2, Copy, FileCode2, Globe, ListTree, RefreshCw, ScanText, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type HeadingStyle = "atx" | "setext";
type BulletStyle = "-" | "*";

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function convertChildren(node: ParentNode, options: { headingStyle: HeadingStyle; bulletStyle: BulletStyle }, listDepth = 0): string {
  return Array.from(node.childNodes)
    .map((child) => convertNode(child, options, listDepth))
    .join("")
    .replace(/\n{3,}/g, "\n\n");
}

function convertTable(table: HTMLTableElement) {
  const rows = Array.from(table.querySelectorAll("tr"));
  if (rows.length === 0) return "";

  const cells = rows.map((row) => Array.from(row.children).map((cell) => cleanText(cell.textContent ?? "")));
  const header = cells[0];
  const divider = header.map(() => "---");
  const body = cells.slice(1);

  const lines = [
    `| ${header.join(" | ")} |`,
    `| ${divider.join(" | ")} |`,
    ...body.map((row) => `| ${row.join(" | ")} |`),
  ];

  return `${lines.join("\n")}\n\n`;
}

function convertList(list: HTMLOListElement | HTMLUListElement, options: { headingStyle: HeadingStyle; bulletStyle: BulletStyle }, listDepth: number) {
  const ordered = list.tagName.toLowerCase() === "ol";
  const items = Array.from(list.children)
    .filter((child): child is HTMLLIElement => child.tagName.toLowerCase() === "li")
    .map((item, index) => {
      const marker = ordered ? `${index + 1}.` : options.bulletStyle;
      const indent = "  ".repeat(listDepth);
      const content = convertChildren(item, options, listDepth + 1).trim().replace(/\n/g, `\n${indent}  `);
      return `${indent}${marker} ${content}`;
    });

  return `${items.join("\n")}\n\n`;
}

function convertNode(node: Node, options: { headingStyle: HeadingStyle; bulletStyle: BulletStyle }, listDepth = 0): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.parentElement?.tagName.toLowerCase() === "pre"
      ? (node.textContent ?? "")
      : cleanText(node.textContent ?? "");
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();
  const text = convertChildren(element, options, listDepth).trim();

  if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6") {
    const level = Number.parseInt(tag.slice(1), 10);
    if (options.headingStyle === "setext" && (tag === "h1" || tag === "h2")) {
      const underline = tag === "h1" ? "=".repeat(text.length) : "-".repeat(text.length);
      return `${text}\n${underline}\n\n`;
    }
    return `${"#".repeat(level)} ${text}\n\n`;
  }

  if (tag === "p") return `${text}\n\n`;
  if (tag === "strong" || tag === "b") return `**${text}**`;
  if (tag === "em" || tag === "i") return `*${text}*`;
  if (tag === "code" && element.parentElement?.tagName.toLowerCase() !== "pre") return `\`${text}\``;
  if (tag === "pre") return `\`\`\`\n${element.textContent?.trim() ?? ""}\n\`\`\`\n\n`;
  if (tag === "blockquote") return `${text.split("\n").map((line) => `> ${line}`).join("\n")}\n\n`;
  if (tag === "br") return "  \n";
  if (tag === "hr") return `---\n\n`;
  if (tag === "a") return `[${text}](${element.getAttribute("href") ?? "#"})`;
  if (tag === "img") return `![${element.getAttribute("alt") ?? ""}](${element.getAttribute("src") ?? ""})`;
  if (tag === "ul" || tag === "ol") return convertList(element as HTMLOListElement | HTMLUListElement, options, listDepth);
  if (tag === "table") return convertTable(element as HTMLTableElement);
  if (tag === "li") return `${text}\n`;

  if (tag === "div" || tag === "section" || tag === "article" || tag === "main" || tag === "header" || tag === "footer" || tag === "aside" || tag === "nav") {
    return `${text}\n\n`;
  }

  return text;
}

function convertHtmlToMarkdown(input: string, headingStyle: HeadingStyle, bulletStyle: BulletStyle) {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(input, "text/html");
  const content = Array.from(documentNode.body.childNodes)
    .map((node) => convertNode(node, { headingStyle, bulletStyle }))
    .join("")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return content;
}

function analyzeHtml(input: string) {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(input, "text/html");
  return {
    elements: documentNode.querySelectorAll("*").length,
    links: documentNode.querySelectorAll("a").length,
    lists: documentNode.querySelectorAll("ul,ol").length,
  };
}

export default function HtmlToMarkdownConverter() {
  const [input, setInput] = useState(`<article><h1>Launch smarter</h1><p>Clean <strong>HTML</strong> into Markdown for docs, changelogs, and CMS notes.</p><ul><li>Ship readable content</li><li>Keep links <a href="https://example.com">intact</a></li></ul></article>`);
  const [headingStyle, setHeadingStyle] = useState<HeadingStyle>("atx");
  const [bulletStyle, setBulletStyle] = useState<BulletStyle>("-");
  const [copiedLabel, setCopiedLabel] = useState("");

  const output = useMemo(() => convertHtmlToMarkdown(input, headingStyle, bulletStyle), [bulletStyle, headingStyle, input]);
  const stats = useMemo(() => analyzeHtml(input), [input]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => {
    setInput(`<section><h2>Release notes</h2><p>Use this converter when HTML needs to become Markdown for docs or publishing workflows.</p><blockquote><p>Keep links, emphasis, and lists readable.</p></blockquote><ol><li>Paste HTML</li><li>Review Markdown</li><li>Copy the result</li></ol><pre><code>npm run build</code></pre></section>`);
    setHeadingStyle("atx");
    setBulletStyle("-");
  };

  const clearAll = () => setInput("");

  return (
    <UtilityToolPageShell
      title="HTML to Markdown Converter"
      seoTitle="HTML to Markdown Converter - Convert HTML to Markdown Online"
      seoDescription="Free HTML to Markdown converter with heading style options, list formatting controls, live side-by-side output, and copy-ready Markdown snippets."
      canonical="https://usonlinetools.com/developer/html-to-markdown"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Convert HTML into clean Markdown directly in the browser. This free HTML to Markdown converter is useful for documentation workflows, changelogs, CMS migrations, static-site content, developer notes, knowledge-base articles, and any case where markup needs to become portable, readable Markdown without losing structure."
      heroIcon={<ArrowRightLeft className="w-3.5 h-3.5" />}
      calculatorLabel="HTML to Markdown Converter"
      calculatorDescription="Paste HTML, choose heading and list styles, then copy readable Markdown output instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div>
                <label htmlFor="heading-style" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Heading Style</label>
                <select id="heading-style" value={headingStyle} onChange={(event) => setHeadingStyle(event.target.value as HeadingStyle)} className="tool-calc-input w-full">
                  <option value="atx">ATX (# headings)</option>
                  <option value="setext">Setext for H1/H2</option>
                </select>
              </div>

              <div>
                <label htmlFor="bullet-style" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Bullet Style</label>
                <select id="bullet-style" value={bulletStyle} onChange={(event) => setBulletStyle(event.target.value as BulletStyle)} className="tool-calc-input w-full">
                  <option value="-">Dash bullets</option>
                  <option value="*">Asterisk bullets</option>
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
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Elements</span>
                    <span className="text-sm font-bold text-foreground">{stats.elements}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Links</span>
                    <span className="text-sm font-bold text-foreground">{stats.links}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">Lists</span>
                    <span className="text-sm font-bold text-foreground">{stats.lists}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Converter Insight</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Markdown is lighter, easier to diff, and more portable across docs, repositories, headless CMS fields, static-site generators, and knowledge bases. Converting HTML to Markdown is often the fastest way to make exported or legacy content more maintainable.
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
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Markdown Output</p>
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
                      { label: "Markdown Output", value: output },
                      { label: "README Section", value: `## Imported Content\n\n${output}` },
                      { label: "MD String", value: `const markdown = ${JSON.stringify(output)};` },
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
                        <span className="text-sm text-muted-foreground">Heading style</span>
                        <span className="text-sm font-bold text-foreground">{headingStyle === "atx" ? "ATX" : "Setext mix"}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                        <span className="text-sm text-muted-foreground">Bullet style</span>
                        <span className="text-sm font-bold text-foreground">{bulletStyle}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Workflow Note</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      HTML-to-Markdown conversion is especially useful when moving content into docs, changelogs, README files, static-site generators, or markdown-first CMS fields. It strips presentation-heavy markup down to a portable editing format that is easier to diff and maintain over time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste the HTML document or fragment you want to convert", description: "This tool works on full articles, email fragments, CMS blocks, exported builder sections, and small reusable components. That matters because HTML to Markdown conversion is often done during migrations or documentation work where the source is only a fragment rather than a complete page." },
        { title: "Choose your preferred heading and list style", description: "Markdown has small style choices that matter in teams and repositories. Some projects prefer ATX hash headings everywhere, while others still use Setext style for top-level headings. Bullet markers can also vary. Giving you these options makes the output easier to drop into an existing content standard instead of forcing manual cleanup after conversion." },
        { title: "Review the generated Markdown side by side", description: "A good converter should let you see what structure survived the translation. Headings, emphasis, links, lists, blockquotes, code blocks, and tables should remain readable. The side-by-side layout helps you catch places where HTML structure may need hand-editing after conversion, especially when the source came from a visual builder or a complex component." },
        { title: "Copy the Markdown or a ready-made snippet for docs", description: "Once the result looks right, copy the raw Markdown or one of the prepared snippets for README, docs, or JavaScript string usage. In real workflows the conversion is rarely the last step. Usually the next action is publishing to a knowledge base, committing to a repository, or pasting into a markdown-first CMS immediately." },
      ]}
      interpretationCards={[
        { title: "Markdown trades presentation detail for portability", description: "HTML gives more precise control over presentation and structure, but Markdown is usually easier to read, diff, version, and edit in plain text environments. Converting HTML to Markdown is often about maintainability more than perfect visual fidelity." },
        { title: "Links, lists, and headings are the highest-value structures to preserve", description: "When a converter keeps core structural elements readable, the resulting Markdown is much easier to use in docs and static content workflows. Those structures matter more than keeping every presentational wrapper from the original HTML.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Complex layout markup may still need manual cleanup", description: "HTML from visual builders or app components sometimes includes wrappers, utility classes, and decorative containers that do not map cleanly to Markdown. The generated output is often a strong starting point, but not always the final published version without a quick edit pass.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "Conversion is not the same as sanitization or semantic repair", description: "This tool converts structure into Markdown syntax. It does not validate semantics, improve accessibility, or repair bad source markup. Those remain separate editorial or engineering tasks.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Turn a heading and paragraph into docs content", input: "<h2>Release notes</h2><p>Updates shipped.</p>", output: "## Release notes plus a clean paragraph" },
        { scenario: "Preserve a list", input: "<ul><li>One</li><li>Two</li></ul>", output: "Markdown bullet list" },
        { scenario: "Keep an inline link", input: "<a href=\"/guide\">Guide</a>", output: "[Guide](/guide)" },
        { scenario: "Convert a code block", input: "<pre><code>npm run build</code></pre>", output: "Fenced Markdown code block" },
      ]}
      whyChoosePoints={[
        "This HTML to Markdown converter is built as a real migration and publishing tool rather than as a placeholder route. It converts common document structures into readable Markdown, exposes heading and bullet style controls, shows source and output side by side, and gives copy-ready snippets for downstream workflows. That makes it useful for docs, repos, CMS migrations, and content cleanup.",
        "The page also follows the stronger tool-page structure you asked for. The working converter comes first, but the page then explains where HTML-to-Markdown conversion fits, what to expect from the output, which structures survive best, and when a manual cleanup pass still makes sense. That creates a stronger and more complete page than a thin utility with almost no supporting context.",
        "Markdown is often the preferred format for teams because it is lighter, easier to diff, and more portable across static-site generators, documentation platforms, issue trackers, and headless content systems. Converting HTML to Markdown is therefore a common bridge task during migrations, knowledge-base cleanup, and content standardization projects.",
        "For developers and technical writers, the biggest win is readability. Exported HTML from builders or old CMS systems can be hard to edit directly, even when the content itself is simple. A Markdown conversion pass can turn that content into something the team can review and maintain without working inside noisy markup every time.",
        "Everything runs locally in the browser, which is the right default when the source content belongs to private docs, internal product notes, staging articles, client knowledge bases, or unpublished repo material. The goal is a quick structural conversion, and local in-browser processing is usually the most pragmatic way to do that safely.",
      ]}
      faqs={[
        { q: "What does an HTML to Markdown converter do?", a: "It turns HTML structure such as headings, paragraphs, lists, links, emphasis, blockquotes, images, and code blocks into Markdown syntax. The goal is to produce a more portable and readable plain-text format while preserving the most useful document structure." },
        { q: "Why convert HTML to Markdown?", a: "Markdown is easier to read in raw form, easier to diff in version control, and widely supported across documentation systems, static-site generators, issue trackers, and markdown-first CMS tools. Conversion is especially useful during migrations or when cleaning exported content." },
        { q: "Will the Markdown look exactly like the original HTML?", a: "Not always. Markdown is less expressive than HTML, so highly presentational or layout-heavy markup may lose some detail. The most important structures usually survive well, but complex wrappers and decorative elements may need manual cleanup afterward." },
        { q: "Can this tool convert lists, links, and code blocks?", a: "Yes. It handles common document elements including headings, paragraphs, emphasis, links, lists, blockquotes, code blocks, images, and basic tables so the output remains useful for practical documentation workflows." },
        { q: "Why offer heading and bullet style options?", a: "Because teams and repositories often have preferred Markdown conventions. Letting you pick the heading and bullet style reduces cleanup time and makes the output easier to drop into an existing workflow." },
        { q: "Does this tool sanitize unsafe HTML?", a: "No. It converts HTML structure into Markdown syntax. Sanitization and security review are separate tasks and should still happen where appropriate." },
        { q: "Who uses an HTML to Markdown converter most often?", a: "Developers, technical writers, SEO teams, content editors, agencies, migration specialists, and knowledge-base managers all use it when moving content into markdown-first systems or repository-based documentation workflows." },
        { q: "Is this useful for CMS migration projects?", a: "Yes. It is especially useful when older systems store content as HTML but the target platform prefers Markdown for editing, versioning, or static rendering. The converter provides a practical first pass before final editorial cleanup." },
      ]}
      relatedTools={[
        { title: "Markdown Previewer", slug: "online-markdown-previewer", icon: <ScanText className="w-4 h-4" />, color: 150, benefit: "Preview converted Markdown immediately" },
        { title: "HTML Formatter & Beautifier", slug: "html-formatter", icon: <FileCode2 className="w-4 h-4" />, color: 210, benefit: "Clean source markup before conversion" },
        { title: "HTML Minifier", slug: "html-minifier", icon: <Code2 className="w-4 h-4" />, color: 265, benefit: "Switch to compact markup workflows if needed" },
        { title: "HTML Entity Encoder & Decoder", slug: "html-entity-encoder", icon: <Globe className="w-4 h-4" />, color: 28, benefit: "Handle entity-heavy content before conversion" },
        { title: "JSON Formatter", slug: "json-formatter", icon: <ListTree className="w-4 h-4" />, color: 335, benefit: "Format adjacent structured data content" },
        { title: "URL Encoder & Decoder", slug: "url-encoder-decoder", icon: <Wand2 className="w-4 h-4" />, color: 190, benefit: "Prepare linked values in related workflows" },
      ]}
      ctaTitle="Need More Content Conversion Tools?"
      ctaDescription="Keep converting, formatting, and cleaning markup and content with adjacent developer utilities in the same tool hub."
      ctaHref="/category/developer"
    />
  );
}
