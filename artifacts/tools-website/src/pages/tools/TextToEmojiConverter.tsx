import { useMemo, useState } from "react";
import { BadgeCheck, Copy, Instagram, Linkedin, MessageCircleMore, Sparkles, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";
import { getCanonicalToolPath } from "@/data/tools";

type Platform = "instagram" | "tiktok" | "twitter" | "discord";
type Intensity = "light" | "balanced" | "bold";

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  twitter: "Twitter/X",
  discord: "Discord",
};

const INTENSITY_LABELS: Record<Intensity, string> = {
  light: "Light",
  balanced: "Balanced",
  bold: "Bold",
};

const PLATFORM_NOTES: Record<Platform, string> = {
  instagram: "Instagram usually handles emoji-rich captions well, but readability still matters when the first line has to do the selling.",
  tiktok: "TikTok captions benefit from sharper hooks and fewer decorative extras because the viewer attention window is short.",
  twitter: "Twitter/X rewards compact phrasing, so emoji use should support the message rather than inflate the line.",
  discord: "Discord can handle more playful emoji styling, especially for community updates, announcements, and reaction-driven copy.",
};

const WORD_EMOJI_MAP: Array<[RegExp, string]> = [
  [/\blaunch\b/gi, "launch 🚀"],
  [/\bgrowth\b/gi, "growth 📈"],
  [/\bsale\b/gi, "sale 🔥"],
  [/\bdeal\b/gi, "deal 💸"],
  [/\bnew\b/gi, "new ✨"],
  [/\bupdate\b/gi, "update 🛠️"],
  [/\btip(s)?\b/gi, "tip 💡"],
  [/\bguide\b/gi, "guide 🧭"],
  [/\bvideo\b/gi, "video 🎥"],
  [/\bpost\b/gi, "post 📝"],
  [/\bcontent\b/gi, "content 📣"],
  [/\bcommunity\b/gi, "community 🤝"],
  [/\bwin\b/gi, "win 🏆"],
  [/\bworkshop\b/gi, "workshop 🎓"],
];

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function countCharacters(value: string) {
  return Array.from(value).length;
}

function emphasizeWords(value: string) {
  return WORD_EMOJI_MAP.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), value);
}

function firstRelevantEmoji(value: string) {
  const match = WORD_EMOJI_MAP.find(([pattern]) => pattern.test(value));
  if (match) {
    match[0].lastIndex = 0;
    return match[1].split(" ").pop() ?? "✨";
  }

  return "✨";
}

function decorateLine(value: string, emoji: string, style: Intensity) {
  if (!value) return "";

  if (style === "light") {
    return `${emoji} ${value}`;
  }

  if (style === "balanced") {
    return `${emoji} ${value} ${emoji}`;
  }

  return `${emoji} ${emoji} ${value} ${emoji}`;
}

function generateVariants(input: string, intensity: Intensity, platform: Platform) {
  const cleaned = normalizeText(input);
  if (!cleaned) return [];

  const emoji = firstRelevantEmoji(cleaned);
  const emphasized = emphasizeWords(cleaned);
  const punchy = cleaned.replace(/[.!?]+$/g, "").trim();

  const variants =
    intensity === "light"
      ? [
          decorateLine(cleaned, emoji, "light"),
          `${emoji} ${emphasized}`,
          `${cleaned} ${platform === "twitter" ? "👇" : "✨"}`,
        ]
      : intensity === "balanced"
        ? [
            decorateLine(emphasized, emoji, "balanced"),
            `${emoji} ${punchy} ${platform === "discord" ? "🙌" : "🔥"}`,
            `${emoji} ${emphasized} ${platform === "instagram" ? "💬" : "👇"}`,
          ]
        : [
            `${emoji} ${emoji} ${emphasized.toUpperCase()} ${platform === "tiktok" ? "🎬" : "🔥"}`,
            `${emoji} ${punchy} ${emoji} ${platform === "discord" ? "🚨" : "📣"} ${emoji}`,
            `${emoji} ${emphasized} ${platform === "instagram" ? "💥 Save this" : platform === "twitter" ? "⚡ RT if this hits" : "✨ Don't miss it"}`,
          ];

  return variants.map((text, index) => ({
    id: index + 1,
    text: text.replace(/\s+/g, " ").trim(),
  }));
}

export default function TextToEmojiConverter() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [intensity, setIntensity] = useState<Intensity>("balanced");
  const [input, setInput] = useState("New launch this week with practical tips for faster content planning");
  const [copied, setCopied] = useState("");

  const variants = useMemo(() => generateVariants(input, intensity, platform), [input, intensity, platform]);

  const summary = useMemo(
    () =>
      [
        `Platform: ${PLATFORM_LABELS[platform]}`,
        `Intensity: ${INTENSITY_LABELS[intensity]}`,
        `Original text: ${normalizeText(input) || "None"}`,
        `Generated variants: ${variants.length}`,
      ].join("\n"),
    [input, intensity, platform, variants.length],
  );

  const platformPreview = useMemo(() => {
    if (!variants.length) return "Add text to generate emoji-enhanced copy.";
    return variants[0].text;
  }, [variants]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  };

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setPlatform("instagram");
            setIntensity("balanced");
            setInput("New reel dropping tonight with easy editing tips for small brands");
          }}
          className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted"
        >
          Creator Preset
        </button>
        <button
          onClick={() => {
            setPlatform("twitter");
            setIntensity("light");
            setInput("New update today with faster workflow changes and cleaner exports");
          }}
          className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted"
        >
          Product Preset
        </button>
        <button
          onClick={() => {
            setPlatform("discord");
            setIntensity("bold");
            setInput("Community challenge starts tonight with rewards for the best submission");
          }}
          className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted"
        >
          Community Preset
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Emoji Styling Controls</p>
                <p className="text-sm text-muted-foreground">Paste a line of copy, choose the platform and emoji intensity, then generate multiple social-ready versions without making the text unreadable.</p>
              </div>
              <Wand2 className="h-5 w-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Platform</label>
                <select value={platform} onChange={(event) => setPlatform(event.target.value as Platform)} className="tool-calc-input w-full">
                  {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Intensity</label>
                <select value={intensity} onChange={(event) => setIntensity(event.target.value as Intensity)} className="tool-calc-input w-full">
                  {Object.entries(INTENSITY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Plain Text Input</label>
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  spellCheck={false}
                  className="tool-calc-input min-h-[132px] w-full resize-y"
                  placeholder="Paste your draft post line here"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Input Chars</p><p className="mt-2 text-2xl font-black text-foreground">{countCharacters(normalizeText(input))}</p></div>
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Variants</p><p className="mt-2 text-2xl font-black text-foreground">{variants.length}</p></div>
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Platform</p><p className="mt-2 text-xl font-black text-foreground">{PLATFORM_LABELS[platform]}</p></div>
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Style</p><p className="mt-2 text-xl font-black text-foreground">{INTENSITY_LABELS[intensity]}</p></div>
            </div>
          </div>

          <div className="space-y-4">
            {variants.length ? (
              variants.map((variant) => (
                <div key={variant.id} className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Variant {variant.id}</p>
                      <p className="text-sm text-muted-foreground">{countCharacters(variant.text)} characters with {INTENSITY_LABELS[intensity].toLowerCase()} emoji styling.</p>
                    </div>
                    <button onClick={() => copyValue(`variant-${variant.id}`, variant.text)} className="text-xs font-bold text-blue-600">
                      {copied === `variant-${variant.id}` ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <textarea readOnly value={variant.text} spellCheck={false} className="min-h-[92px] w-full resize-y rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none" />
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
                Add some text above to generate emoji-enhanced variations.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Platform Guidance</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">{PLATFORM_LABELS[platform]} note</p>
                <p className="mt-1">{PLATFORM_NOTES[platform]}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Readability guardrail</p>
                <p className="mt-1">If the emoji version starts feeling louder than the message, step the intensity down one level. The copy should still read clearly without the emoji layer.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Best use case</p>
                <p className="mt-1">This works best for hooks, promo lines, creator captions, and community updates rather than formal announcements or accessibility-sensitive text.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Notes</p>
            {[
              { label: "Setup summary", value: summary },
              { label: "Preview line", value: platformPreview },
            ].map((item) => (
              <div key={item.label} className="mb-3 rounded-xl border border-border bg-muted/40 p-3 last:mb-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                  <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600">
                    {copied === item.label ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100"><code>{item.value}</code></pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Text to Emoji Converter"
      seoTitle="Text to Emoji Converter - Generate Emoji-Enhanced Social Copy"
      seoDescription="Free text to emoji converter. Turn plain text into emoji-enhanced social copy with platform and intensity controls."
      canonical={`https://usonlinetools.com${getCanonicalToolPath("text-to-emoji")}`}
      categoryName="Social Media Tools"
      categoryHref="/category/social-media"
      heroDescription="Turn plain text into emoji-enhanced social copy without making it unreadable. Choose the platform, adjust the emoji intensity, and copy cleaner social-ready versions for captions, hooks, and community posts."
      heroIcon={<Sparkles className="h-3.5 w-3.5" />}
      calculatorLabel="Emoji Copy Builder"
      calculatorDescription="Add a line of plain copy, choose a platform and emoji intensity, then generate readable variations with different levels of decoration."
      calculator={calculator}
      howSteps={[
        { title: "Paste the plain text first", description: "Start with the clean version of the message so the generator has a readable baseline instead of trying to improve text that is already overdecorated." },
        { title: "Choose the platform and intensity", description: "Platform guidance changes how aggressive the emoji styling should feel, while the intensity control lets you keep the output subtle, balanced, or loud." },
        { title: "Compare the generated variations", description: "The page produces multiple options so you can keep the cleanest version instead of being forced into one fixed emoji style." },
        { title: "Copy the strongest line and refine manually", description: "Emoji styling works best as a fast draft layer. Keep the version that supports the message and trim anything that feels forced." },
      ]}
      interpretationCards={[
        { title: "Emoji should support the message", description: "If the emoji layer becomes the main thing a reader notices, the styling is too aggressive for most social use cases.", className: "bg-emerald-500/5 border-emerald-500/20" },
        { title: "Different platforms tolerate different density", description: "Instagram and Discord can handle more decorative styling, while Twitter/X and many TikTok hooks usually work better with lighter emoji use.", className: "bg-blue-500/5 border-blue-500/20" },
        { title: "Readability matters more than novelty", description: "A slightly decorated line that stays clear usually performs better than a heavily stylized line that feels cluttered or childish.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Manual cleanup is still useful", description: "The generator speeds up the first draft, but the final version should still match the brand voice, audience, and context of the post.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Creator promo caption", input: "New reel tonight with editing tips", output: "Emoji-enhanced hook that still reads cleanly" },
        { scenario: "Community announcement", input: "Challenge starts tonight with rewards", output: "More playful Discord-ready variation" },
        { scenario: "Product update post", input: "New workflow update now live", output: "Lighter emoji version for announcement copy" },
        { scenario: "Casual social teaser", input: "Big launch this week", output: "Readable promo line with extra energy" },
      ]}
      whyChoosePoints={[
        "This page generates real emoji-enhanced text variations instead of placeholder social-media content.",
        "Platform and intensity controls make the output more usable than a one-style emoji replacer.",
        "Multiple generated variants let users choose the cleanest social-ready line instead of copying the first decorative result.",
        "The built-in guidance keeps readability and platform fit visible so the output does not drift into clutter.",
        "The page follows the same long-form structure as the stronger tool pages while keeping the generator above the fold.",
      ]}
      faqs={[
        { q: "Does this replace every letter with emoji?", a: "No. This page focuses on emoji-enhanced social copy, not unreadable full-symbol substitution. The goal is to support the message, not bury it." },
        { q: "Which intensity should I start with?", a: "Start with light or balanced for most public-facing posts. Bold styling works better for playful communities, hype drops, or informal creator content." },
        { q: "Will this work for formal brand copy?", a: "Usually only in moderation. The lighter settings are safer for brand announcements, while heavier emoji styling is better for casual or creator-led content." },
        { q: "Why are there multiple output variants?", a: "Different emoji placements create different moods. Multiple variants let you pick the one that matches the platform and brand voice best." },
        { q: "Can emoji hurt readability?", a: "Yes. Too many emoji can make the line harder to scan, especially on tighter platforms. That is why the page includes intensity controls and readability guidance." },
        { q: "Should I use emoji on every post?", a: "No. Emoji are a styling option, not a requirement. Some posts perform better with clean plain text, especially when the message already has a strong hook." },
        { q: "Does this send my text anywhere?", a: "No. The conversion runs locally in the browser session." },
        { q: "What should I do after generating a version?", a: "Copy the strongest line, then trim or swap any emoji that feels off-brand, repetitive, or unnecessary for the final post." },
      ]}
      relatedTools={[
        { title: "Unicode Text Converter", slug: "unicode-text-converter", icon: <Wand2 className="h-4 w-4" />, color: 280, benefit: "Try stylized text after the emoji layer is set" },
        { title: "Social Media Bio Generator", slug: "bio-generator", icon: <Sparkles className="h-4 w-4" />, color: 35, benefit: "Build short profile copy with a cleaner platform-aware structure" },
        { title: "Instagram Caption Counter", slug: "instagram-caption-counter", icon: <Instagram className="h-4 w-4" />, color: 145, benefit: "Check caption length after emoji styling changes the line" },
        { title: "LinkedIn Post Formatter", slug: "linkedin-post-formatter", icon: <Linkedin className="h-4 w-4" />, color: 210, benefit: "Switch back to cleaner formatting when emoji are not the right fit" },
        { title: "TikTok Caption Counter", slug: "tiktok-character-counter", icon: <BadgeCheck className="h-4 w-4" />, color: 320, benefit: "Keep short-form caption drafts inside platform limits" },
        { title: "Social Post Planner", slug: "social-post-scheduler-planner", icon: <MessageCircleMore className="h-4 w-4" />, color: 195, benefit: "Plan where the emoji-styled copy fits into a broader posting calendar" },
      ]}
      ctaTitle="Need Another Social Tool?"
      ctaDescription="Keep replacing the remaining social-media placeholder routes with working generators, counters, and publishing utilities."
      ctaHref="/category/social-media"
    />
  );
}
