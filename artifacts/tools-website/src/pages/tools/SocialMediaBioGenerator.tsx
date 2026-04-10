import { useMemo, useState } from "react";
import { BadgeCheck, Copy, Instagram, Linkedin, Sparkles, Type, UserRound } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";
import { getCanonicalToolPath } from "@/data/tools";

type Platform = "instagram" | "linkedin" | "tiktok";
type Tone = "professional" | "friendly" | "bold";

const PLATFORM_LIMITS: Record<Platform, number> = {
  instagram: 150,
  linkedin: 220,
  tiktok: 80,
};

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
};

const TONE_LABELS: Record<Tone, string> = {
  professional: "Professional",
  friendly: "Friendly",
  bold: "Bold",
};

const CTA_BY_PLATFORM: Record<Platform, string> = {
  instagram: "DM for collabs",
  linkedin: "Open to partnerships",
  tiktok: "New drops weekly",
};

function countCharacters(value: string) {
  return Array.from(value).length;
}

function sentenceCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.trim())
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function trimToLimit(value: string, limit: number) {
  const chars = Array.from(value);
  if (chars.length <= limit) return value;
  return chars.slice(0, Math.max(0, limit - 1)).join("").trimEnd() + "…";
}

function generateBioVariants({
  platform,
  tone,
  niche,
  keywords,
  cta,
}: {
  platform: Platform;
  tone: Tone;
  niche: string;
  keywords: string[];
  cta: string;
}) {
  const limit = PLATFORM_LIMITS[platform];
  const voice =
    tone === "professional"
      ? {
          opener: "Helping",
          separator: " | ",
          closer: cta || CTA_BY_PLATFORM[platform],
        }
      : tone === "friendly"
        ? {
            opener: "Sharing",
            separator: " • ",
            closer: cta || "Let’s connect",
          }
        : {
            opener: "Building",
            separator: " • ",
            closer: cta || "Follow the journey",
          };

  const cleanNiche = sentenceCase(niche) || "Creators and brands";
  const focusA = keywords[0] || "strategy";
  const focusB = keywords[1] || "content";
  const focusC = keywords[2] || "growth";

  const candidates = [
    `${voice.opener} ${cleanNiche.toLowerCase()} with ${focusA}, ${focusB}, and ${focusC}${voice.separator}${voice.closer}`,
    `${cleanNiche}${voice.separator}${focusA} + ${focusB}${voice.separator}${voice.closer}`,
    `${focusA} | ${focusB} | ${focusC}${voice.separator}${cleanNiche}${voice.separator}${voice.closer}`,
  ];

  return candidates.map((candidate, index) => ({
    id: index + 1,
    text: trimToLimit(candidate, limit),
  }));
}

export default function SocialMediaBioGenerator() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [tone, setTone] = useState<Tone>("professional");
  const [niche, setNiche] = useState("Founders who want clearer product messaging");
  const [keywordsInput, setKeywordsInput] = useState("product marketing, positioning, launch strategy");
  const [cta, setCta] = useState("DM for audits");
  const [copied, setCopied] = useState("");

  const keywords = useMemo(
    () =>
      keywordsInput
        .split(",")
        .map((item) => sentenceCase(item))
        .filter(Boolean)
        .slice(0, 5),
    [keywordsInput],
  );

  const variants = useMemo(
    () =>
      generateBioVariants({
        platform,
        tone,
        niche,
        keywords,
        cta,
      }),
    [cta, keywords, niche, platform, tone],
  );

  const stats = useMemo(
    () =>
      variants.map((variant) => ({
        ...variant,
        characters: countCharacters(variant.text),
        remaining: PLATFORM_LIMITS[platform] - countCharacters(variant.text),
      })),
    [platform, variants],
  );

  const summary = useMemo(
    () =>
      [
        `Platform: ${PLATFORM_LABELS[platform]}`,
        `Tone: ${TONE_LABELS[tone]}`,
        `Niche: ${sentenceCase(niche)}`,
        `Keywords: ${keywords.join(", ") || "None"}`,
        `CTA: ${cta || CTA_BY_PLATFORM[platform]}`,
      ].join("\n"),
    [cta, keywords, niche, platform, tone],
  );

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
            setTone("friendly");
            setNiche("Creator helping small brands shoot better content");
            setKeywordsInput("content tips, reels, small business");
            setCta("DM for collabs");
          }}
          className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted"
        >
          Creator Preset
        </button>
        <button
          onClick={() => {
            setPlatform("linkedin");
            setTone("professional");
            setNiche("B2B marketer simplifying demand generation for SaaS teams");
            setKeywordsInput("positioning, pipeline, GTM");
            setCta("Open to advisory work");
          }}
          className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted"
        >
          LinkedIn Preset
        </button>
        <button
          onClick={() => {
            setPlatform("tiktok");
            setTone("bold");
            setNiche("Fitness coach turning busy schedules into simple training plans");
            setKeywordsInput("workouts, habits, coaching");
            setCta("New drops weekly");
          }}
          className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted"
        >
          TikTok Preset
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Bio Controls</p>
                <p className="text-sm text-muted-foreground">Pick the platform, tone, and niche details, then generate short bios that fit the profile space cleanly.</p>
              </div>
              <UserRound className="h-5 w-5 text-blue-500" />
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
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Tone</label>
                <select value={tone} onChange={(event) => setTone(event.target.value as Tone)} className="tool-calc-input w-full">
                  {Object.entries(TONE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Niche or Role</label>
                <input value={niche} onChange={(event) => setNiche(event.target.value)} spellCheck={false} className="tool-calc-input w-full" placeholder="What do you help people with?" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Keywords</label>
                <input value={keywordsInput} onChange={(event) => setKeywordsInput(event.target.value)} spellCheck={false} className="tool-calc-input w-full" placeholder="content strategy, reels, growth" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Call To Action</label>
                <input value={cta} onChange={(event) => setCta(event.target.value)} spellCheck={false} className="tool-calc-input w-full" placeholder="DM for collabs" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Platform Limit</p><p className="mt-2 text-2xl font-black text-foreground">{PLATFORM_LIMITS[platform]}</p></div>
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Keywords Used</p><p className="mt-2 text-2xl font-black text-foreground">{keywords.length}</p></div>
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Tone</p><p className="mt-2 text-xl font-black text-foreground">{TONE_LABELS[tone]}</p></div>
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">CTA</p><p className="mt-2 text-sm font-black text-foreground">{(cta || CTA_BY_PLATFORM[platform]).slice(0, 28)}</p></div>
            </div>
          </div>

          <div className="space-y-4">
            {stats.map((variant) => (
              <div key={variant.id} className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Bio Variant {variant.id}</p>
                    <p className="text-sm text-muted-foreground">{variant.characters} characters used, {variant.remaining} remaining for {PLATFORM_LABELS[platform]}.</p>
                  </div>
                  <button onClick={() => copyValue(`variant-${variant.id}`, variant.text)} className="text-xs font-bold text-blue-600">
                    {copied === `variant-${variant.id}` ? "Copied" : "Copy"}
                  </button>
                </div>
                <textarea readOnly value={variant.text} spellCheck={false} className="min-h-[92px] w-full resize-y rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Platform Guidance</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Instagram</p>
                <p className="mt-1">Shorter bios work better when they combine role, niche, and one action. Space is limited, so every phrase has to earn its place.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">LinkedIn</p>
                <p className="mt-1">Lead with the business value you deliver, then add one or two domain keywords that make your profile easier to understand at a glance.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">TikTok</p>
                <p className="mt-1">Keep the line sharp and memorable. Short bios usually work best when they sound decisive instead of descriptive.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Notes</p>
            {[{ label: "Profile setup summary", value: summary }, { label: "Keyword list", value: keywords.join("\n") || "Add comma-separated keywords to generate a list." }].map((item) => (
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
      title="Social Media Bio Generator"
      seoTitle="Social Media Bio Generator - Create Short Bios For Instagram, LinkedIn, and TikTok"
      seoDescription="Free social media bio generator. Create short profile bios for Instagram, LinkedIn, and TikTok with platform limits, tone controls, and copy-ready variations."
      canonical={`https://usonlinetools.com${getCanonicalToolPath("bio-generator")}`}
      categoryName="Social Media Tools"
      categoryHref="/category/social-media"
      heroDescription="Generate short bios for creator, business, and personal-brand profiles. Choose the platform, tone, niche, keywords, and CTA, then copy clean bio variations that fit the profile space without sounding generic."
      heroIcon={<Sparkles className="h-3.5 w-3.5" />}
      calculatorLabel="Profile Bio Builder"
      calculatorDescription="Build short bios around platform limits, niche keywords, and one clear action for Instagram, LinkedIn, or TikTok."
      calculator={calculator}
      howSteps={[
        { title: "Choose the platform first", description: "Each platform has different space and different profile expectations, so the generator starts by matching the character limit and style to the destination." },
        { title: "Describe the niche and add a few high-signal keywords", description: "Focus on the clearest role, audience, or outcome you want profile visitors to understand quickly." },
        { title: "Pick a tone and add one CTA", description: "The tone changes how direct or warm the bio feels, while the CTA gives people a next action instead of ending with a vague description." },
        { title: "Copy the strongest variation and refine manually if needed", description: "Generated bios are best used as tight first drafts. Keep the version that sounds the most like the profile owner and trim anything unnecessary." },
      ]}
      interpretationCards={[
        { title: "Shorter bios usually land better", description: "Profiles are scanned quickly, so concise bios often outperform longer ones even when the platform allows more characters.", className: "bg-emerald-500/5 border-emerald-500/20" },
        { title: "Keywords should clarify, not clutter", description: "Use a few terms that explain the niche or specialty. Too many keywords make the bio read like a tag dump.", className: "bg-blue-500/5 border-blue-500/20" },
        { title: "One CTA is enough", description: "A single clear action is easier to follow than stacking multiple asks into the same short profile line.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Platform voice matters", description: "The same person may need a more direct LinkedIn bio, a warmer Instagram bio, and a sharper TikTok line.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Instagram creator profile", input: "Creator niche + content keywords + DM CTA", output: "Compact creator bio for profile visitors and collab inquiries" },
        { scenario: "LinkedIn consultant profile", input: "Professional tone + B2B niche + advisory CTA", output: "Clear value-first profile summary for leads and recruiters" },
        { scenario: "TikTok coach bio", input: "Bold tone + short niche description + weekly CTA", output: "Fast, memorable bio line that fits tight character space" },
        { scenario: "Small business brand refresh", input: "Friendly tone + product or service keywords", output: "Sharper brand intro without rewriting from scratch" },
      ]}
      whyChoosePoints={[
        "This page generates real bio variations instead of placeholder social-media copy.",
        "Platform-specific limits are built into the output so the suggestions stay usable for the destination.",
        "Tone, niche, keywords, and CTA controls make the output more practical than a one-click generic generator.",
        "The copy-ready variants are short enough to test quickly across personal, creator, and business profiles.",
        "The page follows the same long-form structure as the site's flagship calculator pages while keeping the working generator above the fold.",
      ]}
      faqs={[
        { q: "Should a bio focus on who I am or what I do?", a: "Usually what you do and who you help matters more. Visitors should understand the value or niche first, then any personality details can support that." },
        { q: "How many keywords should I use?", a: "Two or three strong keywords are usually enough. More than that often makes the bio feel stuffed instead of clear." },
        { q: "Do I need a CTA in a bio?", a: "Not always, but a simple CTA often improves the bio because it tells profile visitors what to do next." },
        { q: "Why are the TikTok bios shorter?", a: "TikTok profiles reward sharper, punchier wording. The generator trims more aggressively to fit that tighter style." },
        { q: "Can I use emojis in these bios?", a: "Yes, but use them sparingly. A couple of relevant emojis can help on Instagram, while LinkedIn usually works better with cleaner text." },
        { q: "Will this replace manual editing?", a: "No. It is best used to create fast, structured first drafts that you can tune to match the person or brand voice more closely." },
        { q: "Does this send my profile text anywhere?", a: "No. The bio generation happens locally in the browser session." },
        { q: "Which version should I pick?", a: "Choose the one that sounds the clearest when read quickly. If two versions feel similar, keep the shorter one." },
      ]}
      relatedTools={[
        { title: "LinkedIn Post Formatter", slug: "linkedin-post-formatter", icon: <Linkedin className="h-4 w-4" />, color: 210, benefit: "Format longer profile-adjacent content after the bio is set" },
        { title: "Instagram Caption Counter", slug: "instagram-caption-counter", icon: <Instagram className="h-4 w-4" />, color: 145, benefit: "Check longer profile-linked captions and post copy" },
        { title: "Text to Emoji Converter", slug: "text-to-emoji", icon: <BadgeCheck className="h-4 w-4" />, color: 40, benefit: "Add lighter emoji styling to casual social copy" },
        { title: "Unicode Text Converter", slug: "unicode-text-converter", icon: <Type className="h-4 w-4" />, color: 280, benefit: "Test stylized profile text when the platform supports it" },
        { title: "Social Media Image Resizer", slug: "social-media-image-resizer", icon: <Copy className="h-4 w-4" />, color: 90, benefit: "Update profile and banner graphics alongside the bio" },
        { title: "Twitter/X Character Counter", slug: "twitter-character-counter", icon: <Sparkles className="h-4 w-4" />, color: 15, benefit: "Keep short-form profile-adjacent messaging concise" },
      ]}
      ctaTitle="Need Another Social Tool?"
      ctaDescription="Keep replacing the remaining social-media placeholder routes with working generators and profile-ready utilities."
      ctaHref="/category/social-media"
    />
  );
}
