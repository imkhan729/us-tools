import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  Copy,
  Linkedin,
  List,
  ListOrdered,
  MessageSquareText,
  Sparkles,
  Type,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type SpacingPreset = "tight" | "balanced" | "airy";
type HookStyle = "keep" | "uppercase" | "question";

const PRESETS = {
  founder: `We almost shipped the wrong feature this quarter.

Customer interviews told us one story. Usage data told us another.

The mistake would have been building for the loudest requests instead of the most repeated workflow.

We paused for one week, rechecked the problem, and changed the roadmap.

The result: less noise, clearer positioning, and a product that actually solves the daily job.`,
  hiring: `We are hiring a product designer.

You will work directly with engineering, shape early workflows, and help simplify a tool suite used every day by real customers.

We care about clear thinking, strong taste, and designers who can move between systems work and hands-on problem solving.

Remote is fine. Async is normal. Ownership matters.`,
  caseStudy: `A landing page rewrite lifted demo requests without changing ad spend.

What changed?

We replaced generic feature copy with one sharp promise.
We moved proof higher on the page.
We reduced CTA choices from three to one.

Traffic stayed flat. Conversion improved.

Small structural edits usually beat loud redesigns.`,
} as const;

function normalizeLine(line: string) {
  return line.replace(/\s+/g, " ").trim();
}

function splitIntoUnits(value: string) {
  const blocks = value
    .replace(/\r\n/g, "\n")
    .split(/\n+/)
    .map((line) => normalizeLine(line))
    .filter(Boolean);

  const units: string[] = [];

  blocks.forEach((block) => {
    if (/^[-*•]/.test(block) || /^\d+[.)]/.test(block)) {
      units.push(block);
      return;
    }

    const sentences = block
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => normalizeLine(sentence))
      .filter(Boolean);

    if (sentences.length === 0) {
      return;
    }

    if (sentences.length === 1) {
      units.push(sentences[0]);
      return;
    }

    units.push(...sentences);
  });

  return units;
}

function formatHook(hook: string, style: HookStyle) {
  if (!hook) {
    return "";
  }

  if (style === "uppercase") {
    return hook.toUpperCase();
  }

  if (style === "question") {
    return hook.replace(/[.!]+$/, "").replace(/\?*$/, "") + "?";
  }

  return hook;
}

function groupUnits(units: string[], spacing: SpacingPreset) {
  const groupSize = spacing === "airy" ? 1 : spacing === "balanced" ? 2 : 3;
  const groups: string[][] = [];
  let current: string[] = [];

  units.forEach((unit) => {
    const isBullet = /^[-*•]/.test(unit) || /^\d+[.)]/.test(unit);

    if (isBullet) {
      if (current.length > 0) {
        groups.push(current);
        current = [];
      }
      groups.push([unit]);
      return;
    }

    current.push(unit);
    if (current.length >= groupSize) {
      groups.push(current);
      current = [];
    }
  });

  if (current.length > 0) {
    groups.push(current);
  }

  return groups;
}

function countCharacters(value: string) {
  return Array.from(value).length;
}

export default function LinkedinPostFormatter() {
  const [draft, setDraft] = useState<string>(PRESETS.founder);
  const [spacing, setSpacing] = useState<SpacingPreset>("balanced");
  const [hookStyle, setHookStyle] = useState<HookStyle>("keep");
  const [cta, setCta] = useState("Comment \"framework\" and I will send the checklist.");
  const [copied, setCopied] = useState(false);

  const formatted = useMemo(() => {
    const units = splitIntoUnits(draft);
    const [firstUnit = "", ...rest] = units;
    const hook = formatHook(firstUnit, hookStyle);
    const groups = groupUnits(rest, spacing);

    const bodyParagraphs = groups.map((group) => {
      if (group.every((line) => /^[-*•]/.test(line) || /^\d+[.)]/.test(line))) {
        return group.join("\n");
      }
      return group.join(" ");
    });

    return [hook, ...bodyParagraphs, cta.trim()].filter(Boolean).join("\n\n");
  }, [cta, draft, hookStyle, spacing]);

  const stats = useMemo(() => {
    const rawWords = draft.trim() ? draft.trim().split(/\s+/).length : 0;
    const outputWords = formatted.trim() ? formatted.trim().split(/\s+/).length : 0;
    const rawCharacters = countCharacters(draft);
    const outputCharacters = countCharacters(formatted);
    const outputParagraphs = formatted.trim() ? formatted.split(/\n\s*\n/).filter((block) => block.trim()).length : 0;
    const outputLines = formatted.trim() ? formatted.split("\n").filter((line) => line.trim()).length : 0;
    const hook = formatted.split(/\n\s*\n/)[0] ?? "";
    const hookCharacters = countCharacters(hook);
    const hasCta = Boolean(cta.trim()) || /(comment|dm|message|apply|download|book|reply|visit|follow)/i.test(formatted);

    let hookState = "Missing hook";
    if (hookCharacters > 0 && hookCharacters <= 120) {
      hookState = "Strong opening";
    } else if (hookCharacters <= 220) {
      hookState = "Readable opening";
    } else if (hookCharacters > 220) {
      hookState = "Long opening";
    }

    let structureState = "Needs paragraph breaks";
    if (outputParagraphs >= 4 && outputParagraphs <= 7) {
      structureState = "Feed-friendly structure";
    } else if (outputParagraphs >= 2) {
      structureState = "Usable but dense";
    } else if (!formatted.trim()) {
      structureState = "No formatted output yet";
    }

    return {
      rawWords,
      outputWords,
      rawCharacters,
      outputCharacters,
      outputParagraphs,
      outputLines,
      hookCharacters,
      hasCta,
      hookState,
      structureState,
    };
  }, [cta, draft, formatted]);

  const copyOutput = async () => {
    await navigator.clipboard.writeText(formatted);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const checklist = [
    {
      title: "Step 1: Hook check",
      text: draft.trim()
        ? `${stats.hookState}. Your first paragraph is ${stats.hookCharacters} characters long.`
        : "Start with the strongest single idea from the post. The hook should earn the second paragraph.",
      tone: stats.hookCharacters > 220 ? "border-amber-500/20 bg-amber-500/5" : "border-emerald-500/20 bg-emerald-500/5",
    },
    {
      title: "Step 2: Body spacing",
      text: formatted.trim()
        ? `${stats.outputParagraphs} paragraphs and ${stats.outputLines} visible lines create a ${stats.structureState.toLowerCase()} reading pattern.`
        : "Once text is added, the formatter will break the draft into short LinkedIn-style paragraphs.",
      tone: stats.outputParagraphs >= 4 ? "border-blue-500/20 bg-blue-500/5" : "border-amber-500/20 bg-amber-500/5",
    },
    {
      title: "Step 3: CTA finish",
      text: stats.hasCta
        ? "A CTA is present, so the post ends with a next action instead of fading out."
        : "Add a CTA if you want comments, DMs, profile visits, or a clear next step from readers.",
      tone: stats.hasCta ? "border-cyan-500/20 bg-cyan-500/5" : "border-amber-500/20 bg-amber-500/5",
    },
  ];

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setDraft(PRESETS.founder)} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Founder Update
        </button>
        <button onClick={() => setDraft(PRESETS.hiring)} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Hiring Post
        </button>
        <button onClick={() => setDraft(PRESETS.caseStudy)} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Case Study
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Raw Draft</p>
                <p className="text-sm text-muted-foreground">Paste your draft, then tighten the hook, spacing, and CTA before copying the final post.</p>
              </div>
              <button onClick={() => setDraft("")} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40">
                Clear
              </button>
            </div>

            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Paste a rough LinkedIn post draft here..."
              className="tool-calc-input min-h-[240px] w-full resize-y text-base leading-7"
            />

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Hook Style</label>
                <select value={hookStyle} onChange={(event) => setHookStyle(event.target.value as HookStyle)} className="tool-calc-input w-full">
                  <option value="keep">Keep natural hook</option>
                  <option value="uppercase">Uppercase hook</option>
                  <option value="question">Turn hook into question</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Spacing</label>
                <select value={spacing} onChange={(event) => setSpacing(event.target.value as SpacingPreset)} className="tool-calc-input w-full">
                  <option value="tight">Tight paragraphs</option>
                  <option value="balanced">Balanced spacing</option>
                  <option value="airy">Airy spacing</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">CTA Line</label>
                <input
                  value={cta}
                  onChange={(event) => setCta(event.target.value)}
                  placeholder="Add a final call to action"
                  className="tool-calc-input w-full"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Draft Chars</p>
                <p className="mt-2 text-2xl font-black text-foreground">{stats.rawCharacters}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Output Chars</p>
                <p className="mt-2 text-2xl font-black text-foreground">{stats.outputCharacters}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Paragraphs</p>
                <p className="mt-2 text-2xl font-black text-foreground">{stats.outputParagraphs}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Words</p>
                <p className="mt-2 text-2xl font-black text-foreground">{stats.outputWords}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Formatted Output</p>
                <p className="text-sm text-muted-foreground">This is the post-ready version with cleaner paragraph spacing and a deliberate ending CTA.</p>
              </div>
              <button onClick={copyOutput} className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700">
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy Output"}
              </button>
            </div>

            <textarea readOnly value={formatted} className="min-h-[280px] w-full resize-y rounded-2xl border border-border bg-slate-950 p-4 font-sans text-sm leading-7 text-slate-100 outline-none" />
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Formatting Readout</p>
                <p className="text-sm text-muted-foreground">Follow these steps to keep the post clear and scan-friendly in the LinkedIn feed.</p>
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">LinkedIn Preview</p>
                <p className="text-sm text-muted-foreground">See how the spaced version reads when broken into short feed paragraphs.</p>
              </div>
              <Linkedin className="w-5 h-5 text-blue-500" />
            </div>

            <div className="rounded-3xl border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a66c2] text-white">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Your Name</p>
                  <p className="text-xs text-muted-foreground">Post preview</p>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground">
                {formatted || "Your formatted LinkedIn post will appear here."}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                LinkedIn posts usually read better when the hook stands alone, the body is split into short sections, and the final line asks for one clear next action.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Output Signals</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4 text-blue-500" />
                  <p className="font-bold text-foreground">Hook length</p>
                </div>
                <p className="mt-2">{stats.hookState}. Shorter openings are easier to scan before the reader commits.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                  <List className="h-4 w-4 text-blue-500" />
                  <p className="font-bold text-foreground">Paragraph spacing</p>
                </div>
                <p className="mt-2">{stats.structureState}. Balanced spacing keeps the post from turning into one wall of text.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                  <ListOrdered className="h-4 w-4 text-blue-500" />
                  <p className="font-bold text-foreground">CTA presence</p>
                </div>
                <p className="mt-2">{stats.hasCta ? "A CTA is included in the output." : "No CTA detected yet."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Online LinkedIn Post Formatter"
      seoTitle="Online LinkedIn Post Formatter - Format Posts for Readability"
      seoDescription="Free online LinkedIn post formatter with hook styling, paragraph spacing, CTA insertion, live preview, and copy-ready output."
      canonical="https://usonlinetools.com/social-media/online-linkedin-post-formatter"
      categoryName="Social Media Tools"
      categoryHref="/category/social-media"
      heroDescription="Format rough LinkedIn drafts into cleaner, easier-to-scan posts. Adjust the opening hook, choose paragraph spacing, add a CTA, and copy the final version with a live feed-style preview and step-by-step formatting readout."
      heroIcon={<Linkedin className="w-3.5 h-3.5" />}
      calculatorLabel="LinkedIn Post Formatter"
      calculatorDescription="Turn a rough draft into a feed-friendly post with cleaner paragraph rhythm."
      calculator={calculator}
      howSteps={[
        {
          title: "Paste the rough draft before you try to polish the wording",
          description:
            "Start with the core idea exactly as you wrote it. The formatter works best when it can first separate the hook, the supporting points, and the CTA without you manually spacing everything.",
        },
        {
          title: "Decide how assertive the opening should feel",
          description:
            "A natural hook keeps the original tone, an uppercase hook makes the opening louder, and a question-style hook turns the first line into a prompt designed to pull the reader downward.",
        },
        {
          title: "Choose paragraph spacing based on how conversational the post should read",
          description:
            "Airy spacing creates more visual separation, while tighter spacing keeps the post more compact. Balanced spacing is usually the safest default for professional posts that still need breathing room.",
        },
        {
          title: "Finish with one CTA, not several competing asks",
          description:
            "A LinkedIn post usually performs better when the final line gives the reader a single next step. Ask for a comment, DM, reply, or click, but avoid stacking multiple actions together.",
        },
      ]}
      interpretationCards={[
        {
          title: "The hook should carry one idea, not the whole argument",
          description:
            "If the opening line is trying to explain everything, the rest of the post loses tension. Keep the first paragraph sharp and let the body do the proof work.",
        },
        {
          title: "Paragraph rhythm matters more than total length",
          description:
            "Readers tolerate long posts when the structure is easy to scan. A clear hook and short paragraph blocks usually beat a short but dense wall of text.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Formatting should clarify the message, not decorate it",
          description:
            "The goal is not to make the post look unusual. The goal is to make the argument easier to follow in a busy feed.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "A CTA should feel earned by the post",
          description:
            "The final action request works best when it naturally follows the lesson, insight, or story. If the CTA feels disconnected, the post will read like a template.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Founder update", input: "Dense company update pasted as 1 block", output: "Formatted into a hook, short body sections, and one CTA" },
        { scenario: "Hiring post", input: "Role summary with responsibilities and culture note", output: "Cleaner spacing for job details and application CTA" },
        { scenario: "Case study post", input: "Results, changes made, and outcome paragraph", output: "Structured into proof-driven sections that are easier to scan" },
        { scenario: "Personal lesson", input: "Story + takeaway + audience question", output: "Hook isolated, body shortened, question CTA preserved" },
      ]}
      whyChoosePoints={[
        "This page does real text restructuring and live previewing instead of showing a placeholder editor with no output logic.",
        "The hook, spacing, and CTA controls mirror how people actually tune LinkedIn posts before publishing.",
        "The formatter is useful even if you already know how to write because it quickly exposes dense openings and weak ending structure.",
        "Everything runs locally in the browser, so client drafts, internal updates, and unpublished launch notes stay on the device.",
        "The page keeps the same long-form content and sidebar structure used on the better recent tools instead of falling back to a minimal widget.",
      ]}
      faqs={[
        {
          q: "What does this LinkedIn formatter actually change?",
          a: "It restructures a rough draft into shorter paragraphs, styles the hook according to your chosen mode, preserves list items where possible, and appends a final CTA line if you provide one.",
        },
        {
          q: "Does this tool rewrite my tone completely?",
          a: "No. It mainly changes spacing and structure. The words stay close to the original draft unless the hook-style setting transforms the first line.",
        },
        {
          q: "Should I use airy spacing on every LinkedIn post?",
          a: "Not always. Airy spacing can help conversational or story-based posts, but it can make short posts feel fragmented. Balanced spacing is usually the safest default.",
        },
        {
          q: "Why does the hook matter so much on LinkedIn?",
          a: "The first line determines whether the post feels worth reading. If the opening is vague or overloaded, the rest of the content has a harder time holding attention.",
        },
        {
          q: "Can I use this for hiring posts too?",
          a: "Yes. Hiring posts often benefit from clearer separation between the role summary, what the person will do, and the application CTA.",
        },
        {
          q: "Does the tool add emojis automatically?",
          a: "No. It focuses on structure and readability. If you want emojis, add them deliberately after the formatting is in place.",
        },
        {
          q: "Will this make a bad post perform well?",
          a: "No formatter can fix a weak idea. What it can do is stop a good idea from being buried inside a dense, hard-to-scan block of text.",
        },
        {
          q: "Does my draft get uploaded anywhere?",
          a: "No. The formatting happens in the browser, so your draft remains local while you work.",
        },
      ]}
      relatedTools={[
        { title: "Instagram Caption Counter", slug: "instagram-caption-counter", icon: <Sparkles className="w-4 h-4" />, color: 210, benefit: "Check caption structure for Instagram too" },
        { title: "Twitter/X Character Counter", slug: "twitter-character-counter", icon: <MessageSquareText className="w-4 h-4" />, color: 190, benefit: "Switch to tighter short-form drafting on X" },
        { title: "Word Counter", slug: "word-counter", icon: <Type className="w-4 h-4" />, color: 260, benefit: "Track total word count and reading time" },
        { title: "Hashtag Generator", slug: "hashtag-generator", icon: <Sparkles className="w-4 h-4" />, color: 135, benefit: "Build supporting hashtags for adjacent channels" },
        { title: "Duplicate Line Remover", slug: "duplicate-line-remover", icon: <List className="w-4 h-4" />, color: 320, benefit: "Remove repeated lines from messy draft notes" },
      ]}
      ctaTitle="Need Another Social Content Tool?"
      ctaDescription="Continue through the remaining undeveloped social-media pages and replace placeholders with real editing workflows."
      ctaHref="/category/social-media"
    />
  );
}
