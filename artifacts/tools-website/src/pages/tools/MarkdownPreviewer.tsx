import { useMemo, useState } from "react";
import { Code2, Copy, Eye, FileCode2, Sparkles, Type } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

const SAMPLE_MARKDOWN = `# Project Notes

Write Markdown on the left and preview it on the right.

## Checklist

- Finish the landing page
- Review the FAQ copy
- Publish the update

> Markdown is useful for docs, READMEs, notes, and content drafts.

Visit [Utility Hub](https://usonlinetools.com) for more tools.

\`\`\`ts
const status = "ready";
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

  html = html.replace(/`([^`]+)`/g, '<code class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-900 dark:bg-slate-800 dark:text-slate-100">$1</code>');
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="font-semibold text-blue-600 underline decoration-blue-300 underline-offset-4">$1</a>');
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
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push(`<pre class="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-100"><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
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
      blocks.push('<hr class="my-6 border-slate-200 dark:border-slate-700" />');
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push(`<blockquote class="border-l-4 border-blue-500 bg-blue-500/5 px-4 py-3 italic text-slate-700 dark:text-slate-300">${quoteLines.map((item) => renderInline(item)).join("<br />")}</blockquote>`);
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

export default function MarkdownPreviewer() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [copied, setCopied] = useState<"" | "markdown" | "html">("");

  const renderedHtml = useMemo(() => renderMarkdown(markdown), [markdown]);
  const stats = useMemo(() => {
    const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
    const chars = markdown.length;
    const headings = (markdown.match(/^#{1,6}\s+/gm) || []).length;
    const links = (markdown.match(/\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/g) || []).length;

    return { words, chars, headings, links };
  }, [markdown]);

  const copyValue = async (type: "markdown" | "html", value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    window.setTimeout(() => setCopied(""), 2000);
  };

  return (
    <UtilityToolPageShell
      title="Markdown Previewer"
      seoTitle="Online Markdown Previewer"
      seoDescription="Write Markdown and preview the rendered output in real time with headings, lists, quotes, code blocks, and links."
      canonical="https://usonlinetools.com/developer/online-markdown-previewer"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Write Markdown and preview the rendered result instantly for README drafts, docs, notes, content briefs, or developer documentation. Review the structure visually before you publish or paste it elsewhere."
      heroIcon={<FileCode2 className="w-3.5 h-3.5" />}
      calculatorLabel="Live Markdown Preview"
      calculatorDescription="Edit Markdown source and inspect the rendered output side by side."
      calculator={
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 md:p-6 space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-blue-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Words</p>
              <p className="text-2xl font-black text-blue-600">{stats.words}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Characters</p>
              <p className="text-2xl font-black text-emerald-600">{stats.chars}</p>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Headings</p>
              <p className="text-2xl font-black text-violet-600">{stats.headings}</p>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Links</p>
              <p className="text-2xl font-black text-cyan-600">{stats.links}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => setMarkdown(SAMPLE_MARKDOWN)} className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold hover:bg-muted">
              Load Sample
            </button>
            <button onClick={() => setMarkdown("")} className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold hover:bg-muted">
              Clear Editor
            </button>
            <button onClick={() => copyValue("markdown", markdown)} className="rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-600">
              {copied === "markdown" ? "Markdown Copied" : "Copy Markdown"}
            </button>
            <button onClick={() => copyValue("html", renderedHtml)} className="rounded-xl border border-blue-500/20 bg-card px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-muted">
              {copied === "html" ? "HTML Copied" : "Copy Rendered HTML"}
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Type className="w-4 h-4 text-blue-600" />
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Markdown Input</p>
              </div>
              <textarea
                value={markdown}
                onChange={(event) => setMarkdown(event.target.value)}
                className="tool-calc-textarea min-h-[340px]"
                placeholder="# Title&#10;&#10;Write your markdown here..."
              />
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-blue-600" />
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Rendered Preview</p>
              </div>
              <div
                className="prose prose-slate max-w-none min-h-[340px] rounded-xl border border-border bg-background p-5 dark:prose-invert prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-li:text-slate-700 dark:prose-li:text-slate-300"
                dangerouslySetInnerHTML={{ __html: renderedHtml || "<p>Start typing Markdown to preview it here.</p>" }}
              />
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Write or paste Markdown", description: "Use the editor for README files, documentation snippets, notes, release drafts, or formatted content blocks." },
        { title: "Preview the rendered result", description: "The preview panel updates as you edit so you can verify headings, lists, quotes, links, and code blocks." },
        { title: "Inspect structure and counts", description: "Use the quick stats to check document size, heading count, and whether links are present." },
        { title: "Copy Markdown or HTML", description: "Copy the raw source or the rendered HTML depending on where the content needs to go next." },
      ]}
      interpretationCards={[
        { title: "Source panel", description: "This is the raw Markdown document. It is useful when you are drafting content intended for GitHub, docs systems, or note apps." },
        { title: "Preview panel", description: "The preview helps you catch formatting issues before publishing, especially heading depth, list spacing, and code block layout.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Rendered HTML", description: "The copied HTML version is useful when you need a quick formatted output for editors or systems that accept HTML rather than Markdown.", className: "bg-violet-500/5 border-violet-500/20" },
      ]}
      examples={[
        { scenario: "README draft", input: "# Project\\n\\n- install\\n- run", output: "heading plus rendered checklist" },
        { scenario: "Documentation note", input: "## API\\nUse `fetch()`", output: "formatted heading and inline code" },
        { scenario: "Quoted insight", input: "> Keep docs current", output: "styled blockquote preview" },
        { scenario: "External link", input: "[Docs](https://example.com)", output: "clickable rendered link" },
      ]}
      whyChoosePoints={[
        "Useful for both productivity and developer workflows because Markdown often sits between drafting and publishing.",
        "The live preview cuts down on formatting mistakes before you paste content into a README, CMS, or documentation system.",
        "Copying the rendered HTML gives you a practical bridge when a destination supports HTML but not raw Markdown.",
      ]}
      faqs={[
        { q: "Does this support every Markdown feature?", a: "No. The preview focuses on common blocks such as headings, paragraphs, lists, quotes, links, inline code, and fenced code blocks." },
        { q: "Is the preview safe to use with pasted content?", a: "Yes. The renderer escapes HTML first and only converts a limited set of Markdown patterns into formatted output." },
        { q: "Can I use this for README or docs drafting?", a: "Yes. That is one of the main use cases, especially when you want a quick browser preview before committing or publishing the file." },
        { q: "Why copy rendered HTML as well as Markdown?", a: "Some editors and CMS tools accept HTML more reliably than Markdown, so both outputs can be useful depending on the destination." },
      ]}
      relatedTools={[
        { title: "JSON Formatter", slug: "json-formatter", icon: <Code2 className="w-4 h-4" />, color: 217, benefit: "Format data blocks for docs" },
        { title: "HTML Formatter", slug: "html-formatter", icon: <Code2 className="w-4 h-4" />, color: 152, benefit: "Clean generated HTML later" },
        { title: "Text Formatter Tool", slug: "text-formatter-tool", icon: <Type className="w-4 h-4" />, color: 274, benefit: "Adjust source text before writing" },
        { title: "Slug Generator", slug: "slug-generator", icon: <Sparkles className="w-4 h-4" />, color: 28, benefit: "Create clean heading anchors" },
        { title: "Character Counter Tool", slug: "character-counter-tool", icon: <Copy className="w-4 h-4" />, color: 340, benefit: "Check document size quickly" },
        { title: "URL Encoder Decoder", slug: "url-encoder-decoder", icon: <FileCode2 className="w-4 h-4" />, color: 185, benefit: "Prepare safe link values" },
      ]}
    />
  );
}
