import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  FileSearch,
  Heading,
  ListTree,
  Search,
  Shield,
  Sparkles,
  Workflow,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

interface HeadingItem {
  level: number;
  tag: string;
  text: string;
  id: string;
}

const SAMPLE_HTML = `<main>
  <article>
    <h1>Technical SEO Checklist for New Websites</h1>
    <p>Launch-ready guidance for site owners and marketers.</p>

    <h2>Why heading structure matters</h2>
    <p>Good headings help both readers and crawlers understand the page.</p>

    <h2>Pre-launch heading audit</h2>
    <h3>Homepage H1 check</h3>
    <h3>Service page hierarchy review</h3>

    <h2>Common mistakes</h2>
    <h4>Skipping straight to H4</h4>
    <h3>Using multiple H1 tags</h3>
  </article>
</main>`;

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function HeadingTagChecker() {
  const [html, setHtml] = useState(SAMPLE_HTML);
  const [copied, setCopied] = useState(false);

  const analysis = useMemo(() => {
    const trimmed = html.trim();
    if (!trimmed) {
      return {
        headings: [] as HeadingItem[],
        issues: ["Paste HTML to analyze the heading structure."],
        stats: { h1Count: 0, total: 0, skipped: 0, empty: 0, duplicates: 0 },
        outlineState: "No HTML yet",
      };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(trimmed, "text/html");
    const nodes = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6"));
    const headings: HeadingItem[] = nodes.map((node, index) => {
      const level = Number(node.tagName.slice(1));
      const text = node.textContent?.replace(/\s+/g, " ").trim() ?? "";
      const id = node.getAttribute("id")?.trim() || slugify(text) || `heading-${index + 1}`;
      return {
        level,
        tag: node.tagName.toLowerCase(),
        text,
        id,
      };
    });

    const issues: string[] = [];
    const h1Count = headings.filter((heading) => heading.level === 1).length;
    const empty = headings.filter((heading) => !heading.text).length;
    const duplicateMap = new Map<string, number>();
    let skipped = 0;

    headings.forEach((heading, index) => {
      const normalized = heading.text.toLowerCase();
      if (normalized) {
        duplicateMap.set(normalized, (duplicateMap.get(normalized) ?? 0) + 1);
      }

      if (index > 0) {
        const previous = headings[index - 1];
        if (heading.level > previous.level + 1) {
          skipped += 1;
          issues.push(`Skipped from ${previous.tag.toUpperCase()} to ${heading.tag.toUpperCase()} before "${heading.text || heading.tag.toUpperCase()}".`);
        }
      }
    });

    const duplicates = Array.from(duplicateMap.entries()).filter(([, count]) => count > 1).length;

    if (headings.length === 0) {
      issues.push("No heading tags were found in the pasted HTML.");
    }
    if (h1Count === 0) {
      issues.push("No H1 tag detected. Most pages should expose one clear primary heading.");
    }
    if (h1Count > 1) {
      issues.push(`Multiple H1 tags detected (${h1Count}). This can blur the page's main topic.`);
    }
    if (empty > 0) {
      issues.push(`${empty} empty heading tag${empty === 1 ? "" : "s"} detected.`);
    }
    if (duplicates > 0) {
      issues.push(`${duplicates} duplicate heading text pattern${duplicates === 1 ? "" : "s"} detected.`);
    }

    const outlineState =
      issues.length === 0
        ? "Clean hierarchy"
        : issues.length <= 2
          ? "Mostly usable"
          : "Needs cleanup";

    return {
      headings,
      issues,
      stats: {
        h1Count,
        total: headings.length,
        skipped,
        empty,
        duplicates,
      },
      outlineState,
    };
  }, [html]);

  const copySummary = async () => {
    const summary = [
      `Outline state: ${analysis.outlineState}`,
      `Total headings: ${analysis.stats.total}`,
      `H1 count: ${analysis.stats.h1Count}`,
      ...analysis.headings.map((heading) => `${"  ".repeat(Math.max(0, heading.level - 1))}${heading.tag.toUpperCase()}: ${heading.text || "(empty)"}`),
      ...(analysis.issues.length ? ["Issues:", ...analysis.issues.map((issue) => `- ${issue}`)] : ["Issues: none"]),
    ].join("\n");

    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const checklist = [
    {
      title: "Step 1: Confirm the page has one clear H1",
      text:
        analysis.stats.h1Count === 1
          ? "Exactly one H1 is present, which is usually the cleanest pattern for a standard page."
          : analysis.stats.h1Count === 0
            ? "No H1 was found. Most pages should expose one primary heading."
            : `${analysis.stats.h1Count} H1 tags were found. Consolidate the page to one main heading when possible.`,
      tone: analysis.stats.h1Count === 1 ? "border-emerald-500/20 bg-emerald-500/5" : "border-amber-500/20 bg-amber-500/5",
    },
    {
      title: "Step 2: Review heading order for skipped levels",
      text:
        analysis.stats.skipped === 0
          ? "No skipped heading levels were detected in the current HTML outline."
          : `${analysis.stats.skipped} skipped hierarchy jump${analysis.stats.skipped === 1 ? "" : "s"} detected. Move through heading levels more gradually.`,
      tone: analysis.stats.skipped === 0 ? "border-blue-500/20 bg-blue-500/5" : "border-amber-500/20 bg-amber-500/5",
    },
    {
      title: "Step 3: Remove duplicates and empty tags",
      text:
        analysis.stats.empty === 0 && analysis.stats.duplicates === 0
          ? "No empty headings or duplicate heading labels were found."
          : `${analysis.stats.empty} empty heading${analysis.stats.empty === 1 ? "" : "s"} and ${analysis.stats.duplicates} duplicate text pattern${analysis.stats.duplicates === 1 ? "" : "s"} need review.`,
      tone: analysis.stats.empty === 0 && analysis.stats.duplicates === 0 ? "border-cyan-500/20 bg-cyan-500/5" : "border-amber-500/20 bg-amber-500/5",
    },
  ];

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setHtml(SAMPLE_HTML)} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Sample HTML
        </button>
        <button onClick={() => setHtml("")} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Clear
        </button>
        <button onClick={copySummary} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-blue-600 hover:border-blue-500/40">
          {copied ? "Copied" : "Copy Summary"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <label className="mb-3 block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Paste HTML</label>
            <textarea
              value={html}
              onChange={(event) => setHtml(event.target.value)}
              placeholder="<h1>Page title</h1>"
              spellCheck={false}
              className="tool-calc-input min-h-[260px] w-full resize-y font-mono text-sm leading-6"
            />
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Extracted Heading Outline</p>
                <p className="text-sm text-muted-foreground">The order below follows the exact sequence found in the pasted HTML.</p>
              </div>
              <ListTree className="w-5 h-5 text-blue-500" />
            </div>

            <div className="space-y-3">
              {analysis.headings.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                  No headings extracted yet.
                </div>
              ) : (
                analysis.headings.map((heading, index) => (
                  <div key={`${heading.tag}-${heading.id}-${index}`} className="rounded-xl border border-border bg-muted/30 p-4" style={{ marginLeft: `${(heading.level - 1) * 14}px` }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded-md bg-blue-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">{heading.tag.toUpperCase()}</span>
                      <span className="text-xs text-muted-foreground">id: {heading.id || "none"}</span>
                    </div>
                    <p className="font-medium text-foreground">{heading.text || "(empty heading)"}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Structure Readout</p>
                <p className="text-sm text-muted-foreground">Track the outline quality as the HTML changes.</p>
              </div>
              <Sparkles className="w-5 h-5 text-blue-500" />
            </div>

            <div className="space-y-3">
              {checklist.map((item) => (
                <div key={item.title} className={`rounded-2xl border p-4 ${item.tone}`}>
                  <p className="font-bold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Outline Snapshot</p>
                <p className="text-sm text-muted-foreground">Quick summary of the current hierarchy health.</p>
              </div>
              <Heading className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">State</p>
                <p className="mt-2 text-xl font-black text-foreground">{analysis.outlineState}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Total Headings</p>
                <p className="mt-2 text-xl font-black text-foreground">{analysis.stats.total}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">H1 Count</p>
                <p className="mt-2 text-xl font-black text-foreground">{analysis.stats.h1Count}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Issues</p>
                <p className="mt-2 text-xl font-black text-foreground">{analysis.issues.filter((issue) => issue !== "Paste HTML to analyze the heading structure.").length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Detected Issues</p>
                <p className="text-sm text-muted-foreground">Review these before publishing or shipping the template.</p>
              </div>
              <FileSearch className="w-5 h-5 text-blue-500" />
            </div>

            <div className="space-y-3">
              {analysis.issues.length === 0 ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="font-bold text-foreground">No issues detected</p>
                  <p className="mt-1 text-sm text-muted-foreground">The current outline has one clear H1 and no obvious hierarchy or duplicate-text warnings.</p>
                </div>
              ) : (
                analysis.issues.map((issue) => (
                  <div key={issue} className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <p className="text-sm text-muted-foreground">{issue}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Online HTML Heading Tag Checker"
      seoTitle="Online HTML Heading Tag Checker - Validate H1 to H6 Structure"
      seoDescription="Free online heading tag checker. Paste HTML, extract H1 to H6 tags, inspect heading order, and detect skipped levels, duplicate headings, and missing H1 issues."
      canonical="https://usonlinetools.com/seo/online-heading-tag-checker"
      categoryName="SEO Tools"
      categoryHref="/category/seo"
      heroDescription="Paste HTML and inspect the heading outline before a page goes live. This checker extracts `H1` through `H6`, shows the hierarchy in order, and flags skipped levels, duplicate labels, empty headings, and missing or multiple `H1` patterns."
      heroIcon={<Search className="w-3.5 h-3.5" />}
      calculatorLabel="Heading Outline Checker"
      calculatorDescription="Parse HTML in the browser and review the structure instantly."
      calculator={calculator}
      howSteps={[
        {
          title: "Paste the rendered HTML or template output exactly as it will ship",
          description:
            "The checker works best when you analyze the actual HTML structure, not a rough content draft. This is especially useful for CMS templates and landing page builders.",
        },
        {
          title: "Review the extracted heading order from top to bottom",
          description:
            "The output list shows headings in document order so you can see whether the outline reads like a clean progression or jumps around unpredictably.",
        },
        {
          title: "Fix structural issues before they turn into template debt",
          description:
            "Missing H1 tags, multiple H1s, skipped levels, and empty headings are easiest to correct before a component or page layout spreads across multiple pages.",
        },
        {
          title: "Use the final summary as a quick QA record",
          description:
            "The copy summary action is useful during content reviews, developer QA, or client handoff when you need a simple record of what the heading structure looks like.",
        },
      ]}
      interpretationCards={[
        {
          title: "One strong H1 is usually the cleanest default",
          description:
            "A standard page usually benefits from one primary H1 that expresses the main topic, followed by H2 and H3 sections that support it.",
        },
        {
          title: "Skipped heading levels can confuse the outline",
          description:
            "Jumping from H2 straight to H4 often signals either a templating issue or a section that was structured visually rather than semantically.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Duplicate heading text usually weakens clarity",
          description:
            "Repeating the same heading text across multiple sections can make the outline harder to scan for readers and can reduce topical clarity in the page structure.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Empty headings are usually a template or styling bug",
          description:
            "When a heading tag has no usable text, it often means a dynamic field failed, a placeholder was left behind, or the design used semantic tags for spacing alone.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Blog audit", input: "Article HTML pasted from CMS", output: "Confirm one H1 and clean H2/H3 progression" },
        { scenario: "Landing page QA", input: "Page builder export with multiple hero blocks", output: "Catch duplicate H1 issues before launch" },
        { scenario: "Template review", input: "Reusable section component HTML", output: "Detect skipped heading levels in repeated layouts" },
        { scenario: "Accessibility cleanup", input: "Legacy content page markup", output: "Identify empty or decorative headings that need fixing" },
      ]}
      whyChoosePoints={[
        "This page parses real HTML in the browser instead of acting like a static checklist with no structure analysis.",
        "The extracted outline view is practical for developers, SEOs, and content teams because it reflects the actual tag order in the document.",
        "The warnings focus on common hierarchy problems that are easy to miss in visual QA but obvious once the heading sequence is listed plainly.",
        "The long-form layout matches the stronger recent tools and keeps the page useful as both a validator and an implementation reference.",
        "Everything runs locally in the browser, which is useful when checking unpublished templates or staging markup.",
      ]}
      faqs={[
        {
          q: "Why does heading order matter for SEO?",
          a: "Heading order helps communicate page structure and topic grouping. It is not a magic ranking factor by itself, but a clean hierarchy usually supports clarity for both readers and crawlers.",
        },
        {
          q: "Should every page have exactly one H1?",
          a: "For most standard pages, one H1 is still the clearest default. Some modern systems can technically work with more than one, but one primary H1 usually keeps intent clearer.",
        },
        {
          q: "Is skipping from H2 to H4 always wrong?",
          a: "It is usually a sign that the structure should be reviewed. Sometimes the visual design caused the jump, but semantically the outline is often cleaner when levels progress more gradually.",
        },
        {
          q: "Can duplicate headings be a problem?",
          a: "Yes. Repeating the same heading text across multiple sections can reduce clarity and make the outline feel generic or confusing.",
        },
        {
          q: "Does this checker fetch live URLs?",
          a: "No. This version checks pasted HTML only, which keeps the workflow browser-side and avoids depending on external requests.",
        },
        {
          q: "Can I use this for CMS templates?",
          a: "Yes. It is especially useful for CMS templates, reusable components, and landing page exports where heading mistakes repeat at scale.",
        },
        {
          q: "What if no headings are found?",
          a: "That usually means the pasted HTML does not contain H1 to H6 tags, or the content is being styled visually without semantic heading tags.",
        },
        {
          q: "Does this tool change my HTML?",
          a: "No. It analyzes the structure and reports the outline and detected issues. It does not rewrite the markup.",
        },
      ]}
      relatedTools={[
        { title: "Robots.txt Generator", slug: "robots-txt-generator", icon: <Shield className="w-4 h-4" />, color: 95, benefit: "Pair structure QA with crawl guidance" },
        { title: "XML Sitemap Generator", slug: "sitemap-generator", icon: <Workflow className="w-4 h-4" />, color: 145, benefit: "Keep discovery files aligned with final pages" },
        { title: "Canonical Tag Generator", slug: "canonical-tag-generator", icon: <ListTree className="w-4 h-4" />, color: 210, benefit: "Review preferred URLs alongside page structure" },
        { title: "Schema Markup Generator", slug: "schema-markup-generator", icon: <Sparkles className="w-4 h-4" />, color: 275, benefit: "Add structured data after hierarchy cleanup" },
        { title: "Meta Tag Generator", slug: "meta-tag-generator", icon: <Copy className="w-4 h-4" />, color: 20, benefit: "Finish page metadata once headings are settled" },
      ]}
      ctaTitle="Need Another On-Page SEO Checker?"
      ctaDescription="Keep replacing the remaining SEO placeholders with real validators and content-analysis tools."
      ctaHref="/category/seo"
    />
  );
}
