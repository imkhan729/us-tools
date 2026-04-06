import { useMemo, useState } from "react";
import {
  BookOpenText,
  CheckCircle2,
  Copy,
  FileText,
  Gauge,
  Search,
  Shield,
  Sparkles,
  Type,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

const SAMPLE_TEXT = `Clear writing usually wins because it lets the reader understand the point without rereading every sentence. When a page uses long paragraphs, stacked clauses, and vague wording, the message slows down. A readability check does not replace good judgment, but it does help reveal when the copy becomes harder to scan than it needs to be.`;

function splitWords(text: string): string[] {
  return text.toLowerCase().match(/\b[\p{L}\p{N}'-]+\b/gu) ?? [];
}

function countSyllables(word: string) {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!cleaned) return 0;
  if (cleaned.length <= 3) return 1;
  const matches = cleaned
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "")
    .match(/[aeiouy]{1,2}/g);
  return Math.max(1, matches ? matches.length : 1);
}

function readabilityBand(score: number) {
  if (score >= 90) return "Very easy";
  if (score >= 80) return "Easy";
  if (score >= 70) return "Fairly easy";
  if (score >= 60) return "Standard";
  if (score >= 50) return "Fairly difficult";
  if (score >= 30) return "Difficult";
  return "Very difficult";
}

export default function ReadabilityChecker() {
  const [text, setText] = useState<string>(SAMPLE_TEXT);
  const [copied, setCopied] = useState(false);

  const analysis = useMemo(() => {
    const words = splitWords(text);
    const sentences = text.split(/[.!?]+/).map((sentence) => sentence.trim()).filter(Boolean);
    const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
    const characters = words.reduce((sum, word) => sum + word.length, 0);
    const wordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0;
    const syllablesPerWord = words.length > 0 ? syllables / words.length : 0;
    const fleschReadingEase =
      words.length > 0 && sentences.length > 0
        ? 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord
        : 0;
    const fkGrade =
      words.length > 0 && sentences.length > 0
        ? 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59
        : 0;
    const longSentences = sentences.filter((sentence) => splitWords(sentence).length >= 24).length;
    const passiveHints = text.match(/\b(?:was|were|is|are|been|be)\s+\w+ed\b/gi)?.length ?? 0;

    const notes: string[] = [];
    if (!text.trim()) {
      notes.push("Paste content to calculate readability.");
    }
    if (wordsPerSentence > 22) {
      notes.push("Average sentence length is high. Shorter sentences would improve scan speed.");
    }
    if (syllablesPerWord > 1.7) {
      notes.push("Word complexity is elevated. Simpler wording may lower reading difficulty.");
    }
    if (passiveHints >= 2) {
      notes.push("Possible passive voice patterns were detected. Review whether active phrasing would read more clearly.");
    }

    const state =
      !text.trim()
        ? "No text yet"
        : fleschReadingEase >= 60
          ? "Accessible"
          : fleschReadingEase >= 40
            ? "Moderate"
            : "Dense";

    return {
      words: words.length,
      sentences: sentences.length,
      characters,
      syllables,
      wordsPerSentence,
      syllablesPerWord,
      fleschReadingEase,
      fkGrade,
      longSentences,
      passiveHints,
      notes,
      state,
      band: readabilityBand(fleschReadingEase),
    };
  }, [text]);

  const checklist = [
    {
      title: "Step 1: Check reading ease against the page goal",
      text:
        text.trim()
          ? `The current Flesch Reading Ease score is ${analysis.fleschReadingEase.toFixed(1)}, which falls into the "${analysis.band}" range.`
          : "Paste content first so the readability score can be calculated.",
      tone: analysis.fleschReadingEase >= 60 ? "border-emerald-500/20 bg-emerald-500/5" : "border-amber-500/20 bg-amber-500/5",
    },
    {
      title: "Step 2: Review sentence length pressure",
      text:
        analysis.sentences > 0
          ? `Average sentence length is ${analysis.wordsPerSentence.toFixed(1)} words, with ${analysis.longSentences} long sentence${analysis.longSentences === 1 ? "" : "s"} above the heavier threshold.`
          : "Sentence-level metrics will appear once content is added.",
      tone: analysis.wordsPerSentence <= 20 ? "border-blue-500/20 bg-blue-500/5" : "border-amber-500/20 bg-amber-500/5",
    },
    {
      title: "Step 3: Check complexity and passive hints",
      text:
        analysis.words > 0
          ? `Average syllables per word: ${analysis.syllablesPerWord.toFixed(2)}. Passive-voice hints detected: ${analysis.passiveHints}.`
          : "Word complexity and passive-voice hints will update with the text.",
      tone: "border-cyan-500/20 bg-cyan-500/5",
    },
  ];

  const copySummary = async () => {
    const summary = [
      `State: ${analysis.state}`,
      `Reading ease: ${analysis.fleschReadingEase.toFixed(1)} (${analysis.band})`,
      `Grade level: ${analysis.fkGrade.toFixed(1)}`,
      `Words: ${analysis.words}`,
      `Sentences: ${analysis.sentences}`,
      `Average sentence length: ${analysis.wordsPerSentence.toFixed(1)}`,
      `Passive hints: ${analysis.passiveHints}`,
      ...(analysis.notes.length ? ["Notes:", ...analysis.notes.map((note) => `- ${note}`)] : []),
    ].join("\n");

    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setText(SAMPLE_TEXT)} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Sample Text
        </button>
        <button onClick={() => setText("")} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Clear
        </button>
        <button onClick={copySummary} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-blue-600 hover:border-blue-500/40">
          {copied ? "Copied" : "Copy Summary"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <label className="mb-3 block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Paste Content</label>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Paste article copy, email text, documentation, or landing page content..."
              className="tool-calc-input min-h-[260px] w-full resize-y text-sm leading-7"
            />
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Readability Snapshot</p>
                <p className="text-sm text-muted-foreground">Core metrics for sentence length, grade level, and reading ease.</p>
              </div>
              <Gauge className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Reading Ease</p>
                <p className="mt-2 text-2xl font-black text-foreground">{analysis.fleschReadingEase.toFixed(1)}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Grade Level</p>
                <p className="mt-2 text-2xl font-black text-foreground">{analysis.fkGrade.toFixed(1)}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Band</p>
                <p className="mt-2 text-2xl font-black text-foreground">{analysis.band}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Words</p>
                <p className="mt-2 text-2xl font-black text-foreground">{analysis.words}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Sentences</p>
                <p className="mt-2 text-2xl font-black text-foreground">{analysis.sentences}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Passive Hints</p>
                <p className="mt-2 text-2xl font-black text-foreground">{analysis.passiveHints}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Readability Readout</p>
                <p className="text-sm text-muted-foreground">Use these signals to decide whether the copy needs simplification.</p>
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Text Pressure Signals</p>
                <p className="text-sm text-muted-foreground">These values usually explain why a score is drifting up or down.</p>
              </div>
              <Type className="w-5 h-5 text-blue-500" />
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Average sentence length</p>
                <p className="mt-1 text-sm text-muted-foreground">{analysis.wordsPerSentence.toFixed(1)} words per sentence.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Average syllables per word</p>
                <p className="mt-1 text-sm text-muted-foreground">{analysis.syllablesPerWord.toFixed(2)} syllables per word.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Long sentence count</p>
                <p className="mt-1 text-sm text-muted-foreground">{analysis.longSentences} sentence{analysis.longSentences === 1 ? "" : "s"} above the heavier threshold.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Analysis Notes</p>
                <p className="text-sm text-muted-foreground">Writing issues surfaced from the current text block.</p>
              </div>
              <FileText className="w-5 h-5 text-blue-500" />
            </div>

            <div className="space-y-3">
              {analysis.notes.length === 0 ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="font-bold text-foreground">No immediate warnings</p>
                  <p className="mt-1 text-sm text-muted-foreground">The current text has enough structure to score without obvious readability pressure warnings.</p>
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
      title="Online Readability Score Checker"
      seoTitle="Online Readability Score Checker - Measure Reading Ease and Grade Level"
      seoDescription="Free online readability checker with Flesch Reading Ease, Flesch-Kincaid grade level, sentence-length analysis, passive hints, and live readability notes."
      canonical="https://usonlinetools.com/seo/online-readability-checker"
      categoryName="SEO Tools"
      categoryHref="/category/seo"
      heroDescription="Score written content for clarity, sentence pressure, and reading difficulty. Paste a draft, calculate reading ease and grade level instantly, and review the live notes that explain when copy is becoming too dense for the intended audience."
      heroIcon={<Search className="w-3.5 h-3.5" />}
      calculatorLabel="Readability Workspace"
      calculatorDescription="Measure reading ease, grade level, and sentence complexity in the browser."
      calculator={calculator}
      howSteps={[
        {
          title: "Paste the full text block you actually want readers to consume",
          description:
            "Readability scores are most useful when they reflect the real experience. Analyze the complete section, article, email, or landing page copy instead of one isolated paragraph.",
        },
        {
          title: "Use reading ease and grade level together",
          description:
            "A readability score is easier to interpret when paired with its rough grade level. Together they tell you how heavy the text feels and who can process it comfortably.",
        },
        {
          title: "Check sentence pressure before rewriting individual words",
          description:
            "Long sentences often create more reading friction than any single complex word. Tightening sentence length is usually the fastest way to improve clarity.",
        },
        {
          title: "Treat passive voice hints as review prompts, not automatic errors",
          description:
            "Some passive patterns are fine, but repeated passive phrasing can slow the copy down. Use the hint count to decide whether the draft needs a stronger active voice.",
        },
      ]}
      interpretationCards={[
        {
          title: "Higher reading-ease scores usually mean easier copy",
          description:
            "A higher Flesch Reading Ease score generally means shorter sentences and simpler word choices, which makes the text easier to scan.",
        },
        {
          title: "Grade level estimates how demanding the text feels",
          description:
            "The Flesch-Kincaid grade level is not a perfect audience model, but it is useful for comparing one draft against another when clarity matters.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Long sentences are often the fastest fix",
          description:
            "When readability drops, sentence length is frequently the first lever worth pulling. Breaking one overloaded sentence into two can move the score more than small word swaps.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Readable does not mean oversimplified",
          description:
            "The goal is not to strip all nuance out of the text. The goal is to match the writing difficulty to the audience and the job the page needs to do.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Blog editing", input: "Educational article draft", output: "Check whether the explanations are still easy to scan" },
        { scenario: "Landing page copy", input: "Sales-focused website section", output: "Reduce sentence friction before launch" },
        { scenario: "Documentation review", input: "Instructional product content", output: "Measure whether the text is too dense for new users" },
        { scenario: "Email draft QA", input: "Internal or client communication", output: "Check whether the message is too complex for a quick read" },
      ]}
      whyChoosePoints={[
        "This page runs real readability formulas in the browser instead of acting like a generic text box with no scoring logic.",
        "The output combines reading ease, grade level, long-sentence counts, and passive hints so the score is easier to act on.",
        "The notes focus on practical editing moves rather than abstract scoring alone.",
        "The page follows the same stronger recent tool structure, so it works as both a checker and a writing reference.",
        "Everything stays local to the browser session, which is useful for unpublished drafts, client copy, and internal documents.",
      ]}
      faqs={[
        {
          q: "What does the readability score mean?",
          a: "The reading-ease score estimates how easy a text is to read based on sentence length and word complexity. Higher scores usually mean easier reading.",
        },
        {
          q: "Is the grade level exact?",
          a: "No. It is an estimate based on standard readability formulas. It is most useful as a comparative signal between drafts rather than as a strict audience label.",
        },
        {
          q: "Does a lower readability score mean the content is bad?",
          a: "Not always. Some technical or legal writing is naturally denser. The real question is whether the difficulty matches the audience and the page's purpose.",
        },
        {
          q: "Why does sentence length matter so much?",
          a: "Long sentences create processing pressure. Even strong ideas become harder to follow when too many clauses are stacked together.",
        },
        {
          q: "How accurate are the passive voice hints?",
          a: "They are heuristic hints, not a grammar engine. Use them as prompts to review the copy rather than as perfect judgments.",
        },
        {
          q: "Can this be used for SEO writing?",
          a: "Yes. Readability is useful for blog posts, service pages, and explanatory content where clarity supports engagement and understanding.",
        },
        {
          q: "Should I rewrite until the score is perfect?",
          a: "No. Chasing a perfect score can flatten useful nuance. Aim for clarity that matches the audience rather than a single target number.",
        },
        {
          q: "Does this tool store my text?",
          a: "No. The analysis runs locally in the browser, so the pasted content stays in the page session.",
        },
      ]}
      relatedTools={[
        { title: "Keyword Density Checker", slug: "keyword-density-checker", icon: <Type className="w-4 h-4" />, color: 95, benefit: "Check topical repetition alongside readability" },
        { title: "HTML Heading Tag Checker", slug: "heading-tag-checker", icon: <FileText className="w-4 h-4" />, color: 145, benefit: "Pair writing clarity with clean heading structure" },
        { title: "LinkedIn Post Formatter", slug: "linkedin-post-formatter", icon: <BookOpenText className="w-4 h-4" />, color: 210, benefit: "Reformat professional posts after readability cleanup" },
        { title: "Google SERP Preview", slug: "serp-preview-tool", icon: <Gauge className="w-4 h-4" />, color: 275, benefit: "Check search snippet messaging after edits" },
        { title: "Robots.txt Generator", slug: "robots-txt-generator", icon: <Shield className="w-4 h-4" />, color: 20, benefit: "Finish technical SEO setup after on-page cleanup" },
      ]}
      ctaTitle="Need Another Content Clarity Tool?"
      ctaDescription="Keep replacing the remaining placeholder analyzers and generators with real browser-side workflows."
      ctaHref="/category/seo"
    />
  );
}
