import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  Copy,
  Eraser,
  Hash,
  MessageCircle,
  ScanText,
  Sparkles,
  Type,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

const TIKTOK_CAPTION_LIMIT = 4000;
const PREVIEW_TARGET = 90;
const SOFT_HASHTAG_TARGET = 5;

const PRESETS = {
  hook: `3 edits that made my short-form videos perform better:

1. Start with the payoff
2. Cut the intro in half
3. End with one clear CTA

#tiktoktips #contentcreator #videomarketing`,
  product: `New drop is live and the details matter:

- limited stock
- ships this week
- link in bio for the full collection

#newarrival #smallbusiness #shopnow`,
  tutorial: `How I batch 7 videos in one afternoon without burning out:

plan the hooks first
film all intros in one block
edit the strongest clips first

#creatortips #productivity #shortformvideo`,
} as const;

function countCharacters(value: string) {
  return Array.from(value).length;
}

function takeCharacters(value: string, amount: number) {
  return Array.from(value).slice(0, amount).join("");
}

function countHashtags(value: string) {
  return (value.match(/(^|\s)#[^\s#]+/g) ?? []).length;
}

export default function TikTokCaptionCounter() {
  const [caption, setCaption] = useState<string>(PRESETS.hook);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const characters = countCharacters(caption);
    const hashtags = countHashtags(caption);
    const words = caption.trim() ? caption.trim().split(/\s+/).length : 0;
    const lineBreaks = (caption.match(/\n/g) ?? []).length;
    const nonEmptyLines = caption.split("\n").filter((line) => line.trim().length > 0).length;
    const previewText = takeCharacters(caption, PREVIEW_TARGET);
    const charactersRemaining = TIKTOK_CAPTION_LIMIT - characters;
    const previewRemaining = PREVIEW_TARGET - characters;

    let publishState = "Ready to post";
    if (!caption.trim()) {
      publishState = "Start drafting";
    } else if (charactersRemaining < 0) {
      publishState = "Over planning limit";
    } else if (characters > 3500) {
      publishState = "Close to the limit";
    }

    let hashtagState = "No hashtags";
    if (hashtags === 0) {
      hashtagState = "No hashtags";
    } else if (hashtags > SOFT_HASHTAG_TARGET) {
      hashtagState = "Heavy hashtag load";
    } else {
      hashtagState = "Balanced hashtag load";
    }

    let structureState = "Compact";
    if (!caption.trim()) {
      structureState = "No caption yet";
    } else if (nonEmptyLines >= 4) {
      structureState = "Hook + body + CTA structure";
    } else if (lineBreaks >= 2) {
      structureState = "Readable";
    } else if (characters > 240) {
      structureState = "Dense";
    }

    return {
      characters,
      hashtags,
      words,
      lineBreaks,
      nonEmptyLines,
      previewText,
      charactersRemaining,
      previewRemaining,
      publishState,
      hashtagState,
      structureState,
    };
  }, [caption]);

  const copyCaption = async () => {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const checklist = [
    {
      title: "Step 1: Lead with the hook",
      text: caption.trim()
        ? stats.previewRemaining >= 0
          ? `Your opening fits within the first ${PREVIEW_TARGET} characters, which is a cleaner planning target for feed visibility.`
          : `Your opening runs ${Math.abs(stats.previewRemaining)} characters past the first ${PREVIEW_TARGET}. Tighten the hook if the first line needs to carry the click.`
        : "Write the opening line first. TikTok captions work best when the first visible words give the outcome, question, or tension immediately.",
      tone: stats.previewRemaining < 0 ? "border-amber-500/20 bg-amber-500/5" : "border-emerald-500/20 bg-emerald-500/5",
    },
    {
      title: "Step 2: Keep the caption deployable",
      text: caption.trim()
        ? stats.charactersRemaining >= 0
          ? `${stats.charactersRemaining} characters remain before this tool's ${TIKTOK_CAPTION_LIMIT}-character planning cap.`
          : `Trim ${Math.abs(stats.charactersRemaining)} characters to get back under the ${TIKTOK_CAPTION_LIMIT}-character planning cap.`
        : "As you draft, the full caption count updates live so you can keep the copy usable before posting.",
      tone: stats.charactersRemaining < 0 ? "border-rose-500/20 bg-rose-500/5" : "border-blue-500/20 bg-blue-500/5",
    },
    {
      title: "Step 3: Use hashtags deliberately",
      text: caption.trim()
        ? stats.hashtags > SOFT_HASHTAG_TARGET
          ? `${stats.hashtags} hashtags detected. That is still usable, but the caption is starting to feel hashtag-heavy for a short-form hook-first post.`
          : `${stats.hashtags} hashtags detected. This is still light enough that the caption can lead with the message first.`
        : "Add hashtags only after the hook is doing its job. Discovery terms should support the caption, not replace it.",
      tone: stats.hashtags > SOFT_HASHTAG_TARGET ? "border-amber-500/20 bg-amber-500/5" : "border-cyan-500/20 bg-cyan-500/5",
    },
  ];

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setCaption(PRESETS.hook)} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">Hook Preset</button>
        <button onClick={() => setCaption(PRESETS.product)} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">Product Preset</button>
        <button onClick={() => setCaption(PRESETS.tutorial)} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">Tutorial Preset</button>
        <button onClick={() => setCaption("")} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">Clear</button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Caption Draft</p>
                <p className="text-sm text-muted-foreground">Draft the TikTok caption exactly how you plan to post it, including line breaks and hashtags.</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCaption("")} className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40">
                  <Eraser className="w-3.5 h-3.5" />
                  Clear
                </button>
                <button onClick={copyCaption} className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700">
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <textarea
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder="Write your TikTok caption here..."
              className="tool-calc-input min-h-[260px] w-full resize-y text-base leading-7"
            />

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Characters</p>
                <p className={`mt-2 text-2xl font-black ${stats.charactersRemaining < 0 ? "text-rose-600" : "text-foreground"}`}>{stats.characters}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Hashtags</p>
                <p className="mt-2 text-2xl font-black text-foreground">{stats.hashtags}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Line Breaks</p>
                <p className="mt-2 text-2xl font-black text-foreground">{stats.lineBreaks}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Words</p>
                <p className="mt-2 text-2xl font-black text-foreground">{stats.words}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Publishing Readout</p>
                <p className="text-sm text-muted-foreground">Use the checklist to tighten the hook, control caption length, and keep discovery terms from taking over.</p>
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
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Short-Form Preview</p>
                <p className="text-sm text-muted-foreground">Use this preview block as a practical hook check rather than a guaranteed UI simulation.</p>
              </div>
              <MessageCircle className="w-5 h-5 text-blue-500" />
            </div>

            <div className="rounded-[28px] border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">youraccount</p>
                  <p className="text-xs text-muted-foreground">TikTok caption planning view</p>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-foreground">
                {stats.previewText || "Your first 90 characters will appear here."}
                {stats.previewRemaining < 0 ? "..." : ""}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4 text-blue-500" />
                  <p className="font-bold text-foreground">Hook window</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stats.previewRemaining >= 0
                    ? `${stats.previewRemaining} characters remain inside the first ${PREVIEW_TARGET}.`
                    : `${Math.abs(stats.previewRemaining)} characters extend beyond the first ${PREVIEW_TARGET}.`}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-blue-500" />
                  <p className="font-bold text-foreground">Hashtag balance</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{stats.hashtagState}. Soft planning target: {SOFT_HASHTAG_TARGET} or fewer hashtags.</p>
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                  <ScanText className="h-4 w-4 text-blue-500" />
                  <p className="font-bold text-foreground">Structure signal</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{stats.structureState}. {stats.nonEmptyLines} non-empty lines detected in the draft.</p>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl border p-5 ${stats.charactersRemaining < 0 ? "border-rose-500/20 bg-rose-500/5" : stats.publishState === "Close to the limit" ? "border-amber-500/20 bg-amber-500/5" : "border-emerald-500/20 bg-emerald-500/5"}`}>
            <div className="flex items-start gap-3">
              {stats.charactersRemaining < 0 ? <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600" /> : <BadgeCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />}
              <div>
                <p className="font-bold text-foreground">Publish status: {stats.publishState}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  This tool uses a 4,000-character TikTok planning cap and a tighter first-line preview target so the caption can stay both publishable and readable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="TikTok Caption Counter"
      seoTitle="TikTok Caption Counter - Track Characters, Hashtags, and Hook Length"
      seoDescription="Free TikTok caption counter with live character count, hashtag tracking, and hook-first preview guidance for short-form posts."
      canonical="https://usonlinetools.com/social-media/tiktok-character-counter"
      categoryName="Social Media Tools"
      categoryHref="/category/social-media"
      heroDescription="Check TikTok caption length before publishing, keep the hook tight, and track hashtag load without leaving the browser. Draft exactly as you plan to post, then use the live readout to clean up the caption before it goes live."
      heroIcon={<MessageCircle className="w-3.5 h-3.5" />}
      calculatorLabel="TikTok Caption Workspace"
      calculatorDescription="Count characters, hashtags, and structure signals while you draft short-form caption copy."
      calculator={calculator}
      howSteps={[
        { title: "Draft the caption exactly as it will appear", description: "Paste or write the full caption with the line breaks, hashtags, and CTA blocks you actually plan to publish so the count reflects the real post." },
        { title: "Check the opening before the full body", description: "The first visible line carries most of the attention in short-form feeds. Tighten the hook first, then expand only if the rest of the caption earns the extra length." },
        { title: "Use hashtags to support discovery, not replace the message", description: "TikTok can use hashtags for context, but stuffing the caption with them weakens the hook. Keep the main idea clear before you layer in discovery terms." },
        { title: "Use line breaks to keep long captions scannable", description: "If you need a longer caption for context, break it into short visual chunks so the reader can process the hook, body, and CTA quickly on mobile." },
      ]}
      interpretationCards={[
        { title: "The 4,000-character threshold is a planning cap", description: "This tool uses a 4,000-character planning limit for modern TikTok captions. Account rollouts and product surfaces can vary, so treat it as a practical publishing guardrail.", className: "bg-emerald-500/5 border-emerald-500/20" },
        { title: "The first 90 characters matter for readability", description: "This is not a hard platform error. It is a practical preview target so the hook can land before the caption feels buried.", className: "bg-blue-500/5 border-blue-500/20" },
        { title: "Hashtag overload is a quality issue before it is a counting issue", description: "Even when the caption still fits, too many hashtags can weaken the hook and make the copy feel generic or spammy.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Line breaks improve scan speed on mobile", description: "A caption can be technically within the limit and still read badly. Spacing is one of the fastest ways to improve readability.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Short creator hook", input: "Outcome-first line with 3 hashtags", output: "Check whether the first line still does the selling" },
        { scenario: "Product promo caption", input: "Launch note, CTA, and link-in-bio prompt", output: "Keep the CTA visible without drowning the message in extras" },
        { scenario: "Tutorial caption", input: "Step summary with educational keywords", output: "Use line breaks so the body stays scannable" },
        { scenario: "Affiliate or trend post", input: "Short hook plus discovery hashtags", output: "Balance reach terms against a cleaner opening line" },
      ]}
      whyChoosePoints={[
        "This page gives you a working TikTok caption analyzer instead of a generic textarea or placeholder route.",
        "Character count, hashtag load, hook preview, and structure guidance are shown together because short-form caption quality depends on more than one metric.",
        "The page is built around the same long-form layout pattern as the stronger calculator pages, so the tool also works as a publishing guide.",
        "Everything runs locally in the browser, which is useful for unreleased campaign copy, creator drafts, or client work.",
        "The checker focuses on realistic posting decisions: hook length, scan speed, and caption clarity before publish time.",
      ]}
      faqs={[
        { q: "What TikTok limit does this tool use?", a: "This page uses a 4,000-character planning cap for modern TikTok captions. Platform rollouts can change, so use it as a practical guardrail rather than a permanent contract." },
        { q: "Do hashtags count toward the caption total?", a: "Yes. Hashtags are part of the caption text, so they add to the total length and affect readability." },
        { q: "Why does the first 90 characters matter here?", a: "It is a readability and hook target. Short-form captions work better when the strongest idea appears immediately instead of getting buried deep in the text." },
        { q: "Should TikTok captions always be short?", a: "Not always. Longer captions can work for educational or SEO-led content, but the opening still needs to justify the extra text." },
        { q: "How many hashtags should I use?", a: "There is no single perfect number, but a smaller set usually keeps the caption cleaner. This page uses five hashtags as a soft balance target, not a hard platform rule." },
        { q: "Do line breaks help TikTok captions?", a: "They help readability. Breaking the caption into smaller chunks makes longer posts easier to scan on mobile." },
        { q: "Does this send my caption anywhere?", a: "No. Counting and previewing happen locally in the browser." },
        { q: "Can I use this for TikTok photo posts too?", a: "Yes. The counter is useful anywhere you need to plan TikTok caption text before posting." },
      ]}
      relatedTools={[
        { title: "Instagram Caption Counter", slug: "instagram-caption-counter", icon: <BadgeCheck className="h-4 w-4" />, color: 330, benefit: "Compare how the same social draft behaves on another caption-heavy platform" },
        { title: "Unicode Text Converter", slug: "unicode-text-converter", icon: <Type className="h-4 w-4" />, color: 280, benefit: "Style short headline text after the core caption is set" },
        { title: "Text to Emoji Converter", slug: "text-to-emoji", icon: <Sparkles className="h-4 w-4" />, color: 35, benefit: "Generate punchier social variants after checking raw length" },
        { title: "LinkedIn Post Formatter", slug: "linkedin-post-formatter", icon: <Copy className="h-4 w-4" />, color: 210, benefit: "Switch to cleaner formatting when the copy is heading to a different platform" },
        { title: "Social Media Bio Generator", slug: "bio-generator", icon: <MessageCircle className="h-4 w-4" />, color: 145, benefit: "Create short profile copy with platform-aware limits" },
        { title: "Social Post Planner", slug: "social-post-scheduler-planner", icon: <Hash className="h-4 w-4" />, color: 185, benefit: "Plan where the caption fits inside a larger posting schedule" },
      ]}
      ctaTitle="Need Another Social Tool?"
      ctaDescription="Use the rest of the social-media suite for caption formatting, stylized text, image prep, and content planning."
      ctaHref="/category/social-media"
    />
  );
}
