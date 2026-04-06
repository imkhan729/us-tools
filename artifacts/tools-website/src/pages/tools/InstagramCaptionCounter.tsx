import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  Copy,
  Eraser,
  Hash,
  Instagram,
  MessageSquare,
  ScanText,
  Sparkles,
  SquarePen,
  Type,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

const INSTAGRAM_CAPTION_LIMIT = 2200;
const PREVIEW_LIMIT = 125;
const HASHTAG_LIMIT = 30;
const SOFT_HASHTAG_TARGET = 8;

const PRESETS = {
  reel: `3 editing changes that instantly made my Reels feel cleaner:

1. Open with the outcome, not the intro
2. Cut every pause longer than half a second
3. End with one clear CTA instead of five mixed signals

Save this before your next edit session.
#contentcreator #reeltips #videomarketing #creatoreconomy`,
  giveaway: `GIVEAWAY TIME

We are picking 3 winners for our spring bundle.

How to enter:
Follow this page
Like this post
Comment with your favorite product
Share to your story for a bonus entry

Entries close Friday at 8 PM.
#giveaway #smallbusiness #shoponline #communitylove`,
  carousel: `If your carousel is getting swipes but not clicks, check these 4 caption fixes:

Lead with the payoff in line one.
Break your CTA onto its own line.
Keep hashtags at the bottom.
Leave breathing room between ideas.

Comment "caption" if you want the posting checklist.
#instagramtips #socialmediastrategy #contentmarketing`,
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

export default function InstagramCaptionCounter() {
  const [caption, setCaption] = useState<string>(PRESETS.reel);
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const characters = countCharacters(caption);
    const hashtags = countHashtags(caption);
    const lineBreaks = (caption.match(/\n/g) ?? []).length;
    const lines = caption.split("\n");
    const nonEmptyLines = lines.filter((line) => line.trim().length > 0).length;
    const paragraphs = caption.trim() ? caption.split(/\n\s*\n/).filter((block) => block.trim().length > 0).length : 0;
    const words = caption.trim() ? caption.trim().split(/\s+/).length : 0;
    const previewText = takeCharacters(caption, PREVIEW_LIMIT);
    const charactersRemaining = INSTAGRAM_CAPTION_LIMIT - characters;
    const previewRemaining = PREVIEW_LIMIT - characters;
    const hashtagsRemaining = HASHTAG_LIMIT - hashtags;

    let publishState = "Ready to post";
    if (characters > INSTAGRAM_CAPTION_LIMIT || hashtags > HASHTAG_LIMIT) {
      publishState = "Over hard limit";
    } else if (characters > 2000 || hashtags > 25) {
      publishState = "Close to the limit";
    } else if (!caption.trim()) {
      publishState = "Start drafting";
    }

    let structureState = "Needs structure";
    if (!caption.trim()) {
      structureState = "No caption yet";
    } else if (paragraphs >= 2 || nonEmptyLines >= 4) {
      structureState = "Mobile-friendly";
    } else if (characters <= 180) {
      structureState = "Short and compact";
    } else {
      structureState = "Readable but dense";
    }

    let hashtagState = "No hashtags used";
    if (hashtags > HASHTAG_LIMIT) {
      hashtagState = "Too many hashtags";
    } else if (hashtags > SOFT_HASHTAG_TARGET) {
      hashtagState = "Heavy hashtag load";
    } else if (hashtags > 0) {
      hashtagState = "Balanced hashtag use";
    }

    return {
      characters,
      hashtags,
      lineBreaks,
      nonEmptyLines,
      paragraphs,
      words,
      previewText,
      charactersRemaining,
      previewRemaining,
      hashtagsRemaining,
      publishState,
      structureState,
      hashtagState,
    };
  }, [caption]);

  const copyCaption = async () => {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const checklist = [
    {
      title: "Step 1: Hook preview",
      text: caption.trim()
        ? stats.previewRemaining >= 0
          ? `Your opening stays within the first ${PREVIEW_LIMIT} characters. Readers can see the hook before the fold.`
          : `Your first visible preview overflows by ${Math.abs(stats.previewRemaining)} characters. Tighten the opening if the hook matters.`
        : "Add your opening line first. Instagram often truncates long captions after the first preview block.",
      tone: stats.previewRemaining < 0 ? "border-amber-500/20 bg-amber-500/5" : "border-emerald-500/20 bg-emerald-500/5",
    },
    {
      title: "Step 2: Body length",
      text: caption.trim()
        ? stats.charactersRemaining >= 0
          ? `You have ${stats.charactersRemaining} characters left before the ${INSTAGRAM_CAPTION_LIMIT}-character limit.`
          : `Trim ${Math.abs(stats.charactersRemaining)} characters to fit Instagram's maximum caption length.`
        : "Start drafting the body of your caption. Character count, word count, and formatting will update instantly.",
      tone: stats.charactersRemaining < 0 ? "border-rose-500/20 bg-rose-500/5" : "border-blue-500/20 bg-blue-500/5",
    },
    {
      title: "Step 3: Hashtag review",
      text: caption.trim()
        ? stats.hashtagsRemaining >= 0
          ? `${stats.hashtags} hashtags detected. You can still add ${stats.hashtagsRemaining} more before the hard cap of ${HASHTAG_LIMIT}.`
          : `Remove ${Math.abs(stats.hashtagsRemaining)} hashtags. Instagram caps a caption at ${HASHTAG_LIMIT} hashtags.`
        : "Add hashtags only if they help discovery or categorization. Avoid dumping them in without context.",
      tone: stats.hashtagsRemaining < 0 ? "border-rose-500/20 bg-rose-500/5" : stats.hashtags > SOFT_HASHTAG_TARGET ? "border-amber-500/20 bg-amber-500/5" : "border-cyan-500/20 bg-cyan-500/5",
    },
  ];

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setCaption(PRESETS.reel)} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Reel Preset
        </button>
        <button onClick={() => setCaption(PRESETS.giveaway)} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Giveaway Preset
        </button>
        <button onClick={() => setCaption(PRESETS.carousel)} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Carousel Preset
        </button>
        <button onClick={() => setCaption("")} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Caption Draft</p>
                <p className="text-sm text-muted-foreground">Paste or write your Instagram caption and watch the counts update in real time.</p>
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
              placeholder="Write your Instagram caption here..."
              className="tool-calc-input min-h-[260px] w-full resize-y text-base leading-7"
            />

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Characters</p>
                <p className={`mt-2 text-2xl font-black ${stats.charactersRemaining < 0 ? "text-rose-600" : "text-foreground"}`}>{stats.characters}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Hashtags</p>
                <p className={`mt-2 text-2xl font-black ${stats.hashtagsRemaining < 0 ? "text-rose-600" : "text-foreground"}`}>{stats.hashtags}</p>
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Publishing Status</p>
                <p className="text-sm text-muted-foreground">Use this step-by-step readout to check preview length, body length, and hashtag load before posting.</p>
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Feed Preview</p>
                <p className="text-sm text-muted-foreground">The first visible block matters most because long captions get truncated in the feed.</p>
              </div>
              <Instagram className="w-5 h-5 text-blue-500" />
            </div>

            <div className="rounded-[28px] border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 text-white">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">yourbrand</p>
                  <p className="text-xs text-muted-foreground">Caption preview</p>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-foreground">
                {stats.previewText || "Your first 125 characters will appear here."}
                {stats.previewRemaining < 0 ? "..." : ""}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4 text-blue-500" />
                  <p className="font-bold text-foreground">Preview room</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stats.previewRemaining >= 0
                    ? `${stats.previewRemaining} characters left before the caption spills past the visible preview block.`
                    : `${Math.abs(stats.previewRemaining)} characters past the visible preview block.`}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-blue-500" />
                  <p className="font-bold text-foreground">Hashtag state</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{stats.hashtagState}. Hard limit: {HASHTAG_LIMIT} hashtags.</p>
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                  <ScanText className="h-4 w-4 text-blue-500" />
                  <p className="font-bold text-foreground">Structure signal</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stats.structureState}. {stats.paragraphs} paragraph{stats.paragraphs === 1 ? "" : "s"} and {stats.nonEmptyLines} non-empty line{stats.nonEmptyLines === 1 ? "" : "s"} detected.
                </p>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl border p-5 ${stats.charactersRemaining < 0 || stats.hashtagsRemaining < 0 ? "border-rose-500/20 bg-rose-500/5" : stats.publishState === "Close to the limit" ? "border-amber-500/20 bg-amber-500/5" : "border-emerald-500/20 bg-emerald-500/5"}`}>
            <div className="flex items-start gap-3">
              {stats.charactersRemaining < 0 || stats.hashtagsRemaining < 0 ? <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600" /> : <BadgeCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />}
              <div>
                <p className="font-bold text-foreground">Publish status: {stats.publishState}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Instagram allows up to {INSTAGRAM_CAPTION_LIMIT} characters and {HASHTAG_LIMIT} hashtags per caption. Keep the first line tight if you want more of the hook visible in-feed.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Quick Counts</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                  <SquarePen className="h-4 w-4 text-blue-500" />
                  <p className="font-bold text-foreground">Caption room left</p>
                </div>
                <p className="mt-2">{stats.charactersRemaining >= 0 ? `${stats.charactersRemaining} characters remaining.` : `${Math.abs(stats.charactersRemaining)} characters over the limit.`}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <p className="font-bold text-foreground">Readability spacing</p>
                </div>
                <p className="mt-2">{stats.lineBreaks} line breaks create {stats.nonEmptyLines} readable line groups in the draft.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-blue-500" />
                  <p className="font-bold text-foreground">Discovery balance</p>
                </div>
                <p className="mt-2">{stats.hashtagsRemaining >= 0 ? `${stats.hashtagsRemaining} hashtags still available.` : `Reduce hashtags to get back under the platform cap.`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Online Instagram Caption Counter"
      seoTitle="Online Instagram Caption Counter - Count Characters, Hashtags, and Line Breaks"
      seoDescription="Free online Instagram caption counter with live character count, hashtag tracking, line-break checks, and feed-preview guidance before you post."
      canonical="https://usonlinetools.com/social-media/online-instagram-caption-counter"
      categoryName="Social Media Tools"
      categoryHref="/category/social-media"
      heroDescription="Check Instagram caption length, hashtag count, and line breaks before posting. Draft inside the browser, see the feed preview window, and use the live step-by-step publishing readout to keep long captions structured and within Instagram limits."
      heroIcon={<Instagram className="w-3.5 h-3.5" />}
      calculatorLabel="Instagram Caption Workspace"
      calculatorDescription="Count caption characters, hashtags, and spacing instantly while you draft."
      calculator={calculator}
      howSteps={[
        {
          title: "Paste or draft the caption exactly as you plan to publish it",
          description:
            "The counter reads the caption live, so line breaks, emojis, hashtags, and CTA blocks all affect the output immediately. Keep the formatting as close as possible to the real post.",
        },
        {
          title: "Check the first 125 characters before anything else",
          description:
            "Instagram often truncates longer captions in the feed, so the first visible block has to carry the hook. If the preview overflows too early, tighten the opening before adding more context lower in the caption.",
        },
        {
          title: "Use hashtags deliberately, not as filler",
          description:
            "Instagram allows up to 30 hashtags, but a smaller, targeted set is usually easier to read and easier to maintain. The tool shows the hard cap and warns when you start overloading the caption with tags.",
        },
        {
          title: "Use line breaks to make the caption scannable on mobile",
          description:
            "Dense caption blocks are harder to read in the app. Break out the hook, the body, and the CTA so the caption reads like a sequence of quick visual chunks instead of one wall of text.",
        },
      ]}
      interpretationCards={[
        {
          title: "The 2,200-character limit is the hard publish cap",
          description:
            "If the draft goes over 2,200 characters, Instagram will not accept the caption as written. Trim the body or move extra context into a comment.",
        },
        {
          title: "The preview threshold is about attention, not a publish error",
          description:
            "Going beyond the first visible preview does not block publishing, but it can hide your strongest hook. Treat that threshold as a visibility check rather than a hard rule.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Hashtag count affects readability before it affects the platform limit",
          description:
            "You can technically use up to 30 hashtags, but readability often drops well before that point. A tighter set is easier for readers to scan and easier to keep relevant.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Line breaks are a practical formatting tool",
          description:
            "Extra spacing helps mobile readers process the caption faster. Use clear separation between the hook, proof, CTA, and hashtags instead of compressing everything into one paragraph.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Reel caption draft", input: "Quick editing lesson with 4 hashtags", output: "Check if the hook stays visible before the fold" },
        { scenario: "Giveaway post", input: "Rules, deadline, CTA, and branded hashtags", output: "Confirm the entry instructions fit cleanly within the limit" },
        { scenario: "Carousel CTA caption", input: "Educational carousel summary with comment CTA", output: "Use line breaks to separate the lesson from the CTA" },
        { scenario: "Product launch caption", input: "Feature bullets, launch note, and purchase CTA", output: "Track dense captions before they become hard to scan on mobile" },
      ]}
      whyChoosePoints={[
        "This page gives you a real working caption analyzer instead of a placeholder text area with no publish logic behind it.",
        "The live preview and step-by-step status cards make the tool useful for real posting workflows, not just raw character counting.",
        "Hashtag count, line-break count, and structure guidance are shown together because caption quality is more than one number.",
        "Everything runs locally in the browser, which is useful when you are drafting unreleased campaign copy or client captions.",
        "The page follows the longer percentage-calculator-style content structure so the tool is useful both as a checker and as a reference guide.",
      ]}
      faqs={[
        {
          q: "What is the Instagram caption limit?",
          a: "Instagram captions support up to 2,200 characters. If your caption goes over that length, you need to trim it before publishing.",
        },
        {
          q: "How many hashtags can I use on Instagram?",
          a: "Instagram allows up to 30 hashtags in a caption. This tool tracks that hard cap live and also warns when the hashtag load starts getting heavy.",
        },
        {
          q: "Why does the first 125 characters matter?",
          a: "Long captions are often truncated in the feed, so the first visible block is where the hook has to work hardest. A strong opening makes the rest of the caption more likely to be expanded and read.",
        },
        {
          q: "Do line breaks help Instagram captions perform better?",
          a: "Line breaks do not create a ranking boost by themselves, but they make the caption easier to scan on mobile. That usually improves clarity, especially for educational, promotional, or CTA-heavy posts.",
        },
        {
          q: "Does this tool count emojis too?",
          a: "Yes. The character counter reads the caption as entered, including emojis, punctuation, hashtags, and line breaks.",
        },
        {
          q: "Should I always use 30 hashtags?",
          a: "No. Thirty is the hard maximum, not a requirement. Many captions read better with a smaller set of tightly related hashtags.",
        },
        {
          q: "Can I use this for Threads, TikTok, or LinkedIn captions too?",
          a: "You can use it as a drafting aid, but the limits and formatting expectations are different on each platform. Use platform-specific tools when the publish rules differ.",
        },
        {
          q: "Does the caption text leave my browser?",
          a: "No. The counter runs locally in the page session, so your draft stays in the browser while you work.",
        },
      ]}
      relatedTools={[
        { title: "Twitter/X Character Counter", slug: "twitter-character-counter", icon: <MessageSquare className="w-4 h-4" />, color: 205, benefit: "Check short-form post limits for X" },
        { title: "Hashtag Generator", slug: "hashtag-generator", icon: <Hash className="w-4 h-4" />, color: 150, benefit: "Generate new hashtag ideas for campaigns" },
        { title: "Emoji Picker & Copier", slug: "emoji-picker", icon: <Sparkles className="w-4 h-4" />, color: 35, benefit: "Add and copy emojis without leaving the draft flow" },
        { title: "Word Counter", slug: "word-counter", icon: <Type className="w-4 h-4" />, color: 265, benefit: "Check word count and reading time for longer copy" },
        { title: "Duplicate Line Remover", slug: "duplicate-line-remover", icon: <ScanText className="w-4 h-4" />, color: 320, benefit: "Clean repeated lines before publishing" },
      ]}
      ctaTitle="Need Another Social Media Tool?"
      ctaDescription="Keep moving through the remaining social-media placeholders and replace them with real browser-side workflows."
      ctaHref="/category/social-media"
    />
  );
}
