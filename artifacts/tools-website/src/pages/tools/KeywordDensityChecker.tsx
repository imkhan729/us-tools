import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  FileText,
  Search,
  Shield,
  Sparkles,
  Tag,
  TrendingUp,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

const SAMPLE_CONTENT = `Technical SEO is easier to manage when the page structure, metadata, and crawl guidance all point in the same direction. A technical SEO workflow should review headings, canonical tags, sitemap coverage, and robots directives together instead of treating them as isolated tasks. When technical SEO issues pile up, even strong content can become harder to discover and harder to trust.`;

const STOP_WORDS = new Set([
  "a","an","and","are","as","at","be","but","by","for","from","has","have","he","her","his","if","in","into","is","it","its","of","on","or","that","the","their","them","they","this","to","was","we","were","will","with","you","your",
]);

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}\s-]+/gu, " ").replace(/\s+/g, " ").trim();
}

export default function KeywordDensityChecker() {
  const [content, setContent] = useState(SAMPLE_CONTENT);
  const [targetKeyword, setTargetKeyword] = useState("technical SEO");
  const [excludeStopWords, setExcludeStopWords] = useState(true);
  const [copied, setCopied] = useState(false);

  const analysis = useMemo(() => {
    const normalizedContent = normalizeText(content);
    const normalizedTarget = normalizeText(targetKeyword);
    const words = normalizedContent ? normalizedContent.split(" ") : [];
    const filteredWords = excludeStopWords ? words.filter((word) => !STOP_WORDS.has(word)) : words;
    const totalWords = words.length;
    const uniqueWords = new Map<string, number>();

    filteredWords.forEach((word) => {
      if (!word) return;
      uniqueWords.set(word, (uniqueWords.get(word) ?? 0) + 1);
    });

    const topTerms = Array.from(uniqueWords.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([term, count]) => ({
        term,
        count,
        density: totalWords > 0 ? (count / totalWords) * 100 : 0,
      }));

    const targetWords = normalizedTarget ? normalizedTarget.split(" ") : [];
    let matches = 0;

    if (targetWords.length === 1 && targetWords[0]) {
      matches = words.filter((word) => word === targetWords[0]).length;
    } else if (targetWords.length > 1) {
      for (let index = 0; index <= words.length - targetWords.length; index += 1) {
        const slice = words.slice(index, index + targetWords.length).join(" ");
        if (slice === normalizedTarget) {
          matches += 1;
        }
      }
    }

    const density = totalWords > 0 && targetWords.length > 0 ? (matches * targetWords.length / totalWords) * 100 : 0;
    const sentences = content.split(/[.!?]+/).map((sentence) => sentence.trim()).filter(Boolean);
    const averageSentenceLength = sentences.length > 0 ? totalWords / sentences.length : 0;

    const notes: string[] = [];
    if (!content.trim()) {
      notes.push("Paste content to analyze keyword usage.");
    }
    if (!targetKeyword.trim()) {
      notes.push("Enter a target keyword or phrase to calculate focused density.");
    }
    if (density > 4.5) {
      notes.push("Target density is high. Review the copy for repetition or over-optimization.");
    } else if (density > 0 && density < 0.5) {
      notes.push("Target density is very low. If this is the primary topic, the phrase may be underrepresented.");
    }
    if (averageSentenceLength > 24) {
      notes.push("Average sentence length is high. Dense writing can make keyword-heavy content harder to read.");
    }

    const state =
      !content.trim()
        ? "No content yet"
        : density >= 0.8 && density <= 3.5
          ? "Balanced usage"
          : density > 3.5
            ? "Heavy usage"
            : "Light usage";

    return {
      totalWords,
      sentences: sentences.length,
      averageSentenceLength,
      matches,
      density,
      topTerms,
      notes,
      state,
    };
  }, [content, excludeStopWords, targetKeyword]);

  const checklist = [
    {
      title: "Step 1: Confirm the target phrase appears naturally",
      text:
        targetKeyword.trim()
          ? `"${targetKeyword}" appears ${analysis.matches} time${analysis.matches === 1 ? "" : "s"} in the current text.`
          : "Enter the main keyword or phrase you want to audit.",
      tone: "border-emerald-500/20 bg-emerald-500/5",
    },
    {
      title: "Step 2: Review density, not just raw count",
      text:
        analysis.totalWords > 0
          ? `The current keyword density is ${analysis.density.toFixed(2)}% across ${analysis.totalWords} words.`
          : "Paste content to calculate density percentage and supporting term frequency.",
      tone: analysis.density > 4.5 ? "border-amber-500/20 bg-amber-500/5" : "border-blue-500/20 bg-blue-500/5",
    },
    {
      title: "Step 3: Check related word frequency and readability pressure",
      text:
        analysis.topTerms.length > 0
          ? `Top repeated terms are listed below. Average sentence length is ${analysis.averageSentenceLength.toFixed(1)} words.`
          : "Once content is added, the table will surface repeated terms and sentence pressure signals.",
      tone: "border-cyan-500/20 bg-cyan-500/5",
    },
  ];

  const copySummary = async () => {
    const summary = [
      `Keyword: ${targetKeyword || "(none)"}`,
      `State: ${analysis.state}`,
      `Matches: ${analysis.matches}`,
      `Density: ${analysis.density.toFixed(2)}%`,
      `Total words: ${analysis.totalWords}`,
      `Top terms:`,
      ...analysis.topTerms.map((item) => `- ${item.term}: ${item.count} (${item.density.toFixed(2)}%)`),
      ...(analysis.notes.length ? ["Notes:", ...analysis.notes.map((note) => `- ${note}`)] : []),
    ].join("\n");

    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setContent(SAMPLE_CONTENT)} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Sample Copy
        </button>
        <button onClick={() => setContent("")} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Clear
        </button>
        <button onClick={copySummary} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-blue-600 hover:border-blue-500/40">
          {copied ? "Copied" : "Copy Summary"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="grid grid-cols-1 md:grid-cols-[0.9fr_auto] gap-4">
              <input value={targetKeyword} onChange={(event) => setTargetKeyword(event.target.value)} placeholder="Target keyword or phrase" className="tool-calc-input w-full" />
              <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={excludeStopWords} onChange={(event) => setExcludeStopWords(event.target.checked)} />
                Exclude stop words from top-term table
              </label>
            </div>

            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Paste article copy, service page text, or landing page content..."
              className="tool-calc-input mt-4 min-h-[250px] w-full resize-y text-sm leading-7"
            />
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Top Term Frequency</p>
                <p className="text-sm text-muted-foreground">Use this table to spot repeated language beyond the main target keyword.</p>
              </div>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60">
                    <th className="text-left px-4 py-3 font-bold text-foreground">Term</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">Count</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">Density</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {analysis.topTerms.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4 text-muted-foreground" colSpan={3}>Add content to generate a term frequency table.</td>
                    </tr>
                  ) : (
                    analysis.topTerms.map((item) => (
                      <tr key={item.term}>
                        <td className="px-4 py-3 font-medium text-foreground">{item.term}</td>
                        <td className="px-4 py-3 text-muted-foreground">{item.count}</td>
                        <td className="px-4 py-3 font-bold text-blue-600">{item.density.toFixed(2)}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Density Readout</p>
                <p className="text-sm text-muted-foreground">Check the target phrase, the overall density, and the surrounding repetition pattern.</p>
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Keyword Snapshot</p>
                <p className="text-sm text-muted-foreground">High-level view of the current content balance.</p>
              </div>
              <Tag className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">State</p>
                <p className="mt-2 text-xl font-black text-foreground">{analysis.state}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Matches</p>
                <p className="mt-2 text-xl font-black text-foreground">{analysis.matches}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Density</p>
                <p className="mt-2 text-xl font-black text-foreground">{analysis.density.toFixed(2)}%</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Words</p>
                <p className="mt-2 text-xl font-black text-foreground">{analysis.totalWords}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Analysis Notes</p>
                <p className="text-sm text-muted-foreground">These are the main warnings surfaced from the current text.</p>
              </div>
              <FileText className="w-5 h-5 text-blue-500" />
            </div>

            <div className="space-y-3">
              {analysis.notes.length === 0 ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="font-bold text-foreground">No immediate warnings</p>
                  <p className="mt-1 text-sm text-muted-foreground">The current content has enough signal to analyze without obvious overuse warnings.</p>
                </div>
              ) : (
                analysis.notes.map((note) => (
                  <div key={note} className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <p className="text-sm text-muted-foreground">{note}</p>
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
      title="Online Keyword Density Checker"
      seoTitle="Online Keyword Density Checker - Analyze Keyword Usage and Frequency"
      seoDescription="Free online keyword density checker with target phrase analysis, stop-word filtering, top-term table, density percentage, and live content warnings."
      canonical="https://usonlinetools.com/seo/online-keyword-density-checker"
      categoryName="SEO Tools"
      categoryHref="/category/seo"
      heroDescription="Analyze how often a target keyword or phrase appears in your content, review the supporting term frequency table, and spot repetition before copy starts sounding forced. Paste text, set the target phrase, and check the density live."
      heroIcon={<Search className="w-3.5 h-3.5" />}
      calculatorLabel="Keyword Density Workspace"
      calculatorDescription="Measure keyword usage and surface repeated terms instantly."
      calculator={calculator}
      howSteps={[
        {
          title: "Paste the full content block, not only a paragraph fragment",
          description:
            "Density is most useful when it reflects the real page length. A short fragment can make a phrase look far more or far less prominent than it is in the full article or landing page.",
        },
        {
          title: "Set the exact keyword or phrase you want to review",
          description:
            "The checker supports both single-word and multi-word targets. This helps you review the main topic directly instead of relying only on generic term frequency tables.",
        },
        {
          title: "Use the density number alongside the repetition table",
          description:
            "The target percentage matters, but it is not the whole story. Repeated supporting words and sentence heaviness can reveal stuffing or awkward copy even when the main percentage looks acceptable.",
        },
        {
          title: "Treat the output as a writing signal, not a scoring game",
          description:
            "The purpose is to improve clarity and topical balance, not to hit an arbitrary percentage. If the copy sounds strained, the page needs editing even if the number looks neat.",
        },
      ]}
      interpretationCards={[
        {
          title: "Keyword density is a signal, not a ranking formula",
          description:
            "Useful density analysis helps you spot underuse or overuse, but it does not replace content quality, intent alignment, or page usefulness.",
        },
        {
          title: "Very high density usually points to repetition pressure",
          description:
            "If the phrase appears too often relative to the total word count, the writing can start sounding robotic or over-optimized.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Very low density can mean the page drifts off topic",
          description:
            "If the core phrase barely appears, the page may not reinforce its primary subject clearly enough, especially for focused service or product pages.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Top-term repetition shows broader wording habits",
          description:
            "Sometimes the main keyword looks fine, but the surrounding language still repeats heavily. The supporting term table helps you catch that pattern.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Blog draft review", input: "Primary phrase + 1,200-word article", output: "Check whether the core topic is reinforced naturally" },
        { scenario: "Service page optimization", input: "Main service keyword + landing page copy", output: "Spot underuse or overuse before publishing" },
        { scenario: "Client content QA", input: "Outsourced page copy with target phrase", output: "Review repetition before handing off for approval" },
        { scenario: "Content refresh", input: "Old article with updated target phrase", output: "Measure whether the revised topic appears often enough" },
      ]}
      whyChoosePoints={[
        "This page gives you live phrase-level density and a supporting term table instead of a placeholder route or a raw word counter.",
        "The checker handles both single terms and multi-word phrases, which is more useful for practical SEO writing than only counting isolated words.",
        "Stop-word filtering keeps the frequency table focused on meaningful repeated language instead of filler words.",
        "The long-form page structure matches the stronger recent tools and keeps the output useful as both an analyzer and a writing guide.",
        "Everything runs in the browser, which is useful when reviewing unpublished drafts, client copy, or internal service pages.",
      ]}
      faqs={[
        {
          q: "What is keyword density?",
          a: "Keyword density is the percentage of total words taken up by a target term or phrase. It is one way to review how strongly a topic is represented in a text block.",
        },
        {
          q: "Is there a perfect keyword density percentage?",
          a: "No single percentage guarantees better rankings. The better use of density is to identify obvious underuse or overuse while keeping the writing natural.",
        },
        {
          q: "Can this checker analyze multi-word phrases?",
          a: "Yes. The target field supports phrases as well as single words, which is useful for reviewing realistic search topics instead of isolated terms.",
        },
        {
          q: "Why exclude stop words from the term table?",
          a: "Filtering stop words makes the frequency table more useful by surfacing repeated topical words instead of common filler like 'the' or 'and'.",
        },
        {
          q: "Does a higher keyword count always help SEO?",
          a: "No. Repetition can make copy weaker and less trustworthy. The goal is relevance and clarity, not stuffing a phrase into every paragraph.",
        },
        {
          q: "Should I optimize only for the exact keyword phrase?",
          a: "No. Good content also uses natural supporting vocabulary, related concepts, and clear structure around the target phrase.",
        },
        {
          q: "Can I use this for landing pages and product pages?",
          a: "Yes. It is useful for any focused text block where the page should stay aligned with a clear primary topic.",
        },
        {
          q: "Does this tool send my content anywhere?",
          a: "No. The analysis runs locally in the browser, so the pasted text stays in the page session.",
        },
      ]}
      relatedTools={[
        { title: "HTML Heading Tag Checker", slug: "heading-tag-checker", icon: <Tag className="w-4 h-4" />, color: 95, benefit: "Review heading structure alongside keyword usage" },
        { title: "Google SERP Preview", slug: "serp-preview-tool", icon: <Search className="w-4 h-4" />, color: 145, benefit: "Check title and description messaging after copy edits" },
        { title: "Canonical Tag Generator", slug: "canonical-tag-generator", icon: <Shield className="w-4 h-4" />, color: 210, benefit: "Keep preferred URLs aligned with optimized pages" },
        { title: "Robots.txt Generator", slug: "robots-txt-generator", icon: <FileText className="w-4 h-4" />, color: 275, benefit: "Finish crawl guidance after page optimization" },
        { title: "XML Sitemap Generator", slug: "sitemap-generator", icon: <TrendingUp className="w-4 h-4" />, color: 20, benefit: "Submit optimized pages in a clean sitemap" },
      ]}
      ctaTitle="Need Another Content SEO Analyzer?"
      ctaDescription="Keep moving through the remaining SEO placeholders and replace them with real on-page analysis tools."
      ctaHref="/category/seo"
    />
  );
}
