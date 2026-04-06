import { useMemo, useState } from "react";
import { Hash, Sparkles, Copy } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "to", "of", "for", "in", "on", "at",
  "by", "with", "from", "as", "is", "are", "was", "were", "be", "been", "being",
  "this", "that", "these", "those", "it", "its", "your", "you", "we", "our",
  "i", "me", "my", "they", "them", "their", "he", "she", "his", "her",
]);

function normalizePhrase(input: string) {
  return input
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(words: string[]) {
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

function lowerCase(words: string[]) {
  return words.map((word) => word.toLowerCase()).join("");
}

export default function HashtagGenerator() {
  const [input, setInput] = useState("");
  const [maxTags, setMaxTags] = useState(20);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeTitle, setIncludeTitle] = useState(true);
  const [copied, setCopied] = useState(false);

  const tags = useMemo(() => {
    const cleaned = normalizePhrase(input);
    if (!cleaned) return [];

    const hasDelimiters = /[,\\n]/.test(input);
    const rawParts = hasDelimiters
      ? input.split(/[,\\n]/)
      : cleaned.split(/\s+/);

    const phrases = rawParts
      .map((part) => normalizePhrase(part))
      .filter((part) => part.length > 0);

    const seedPhrases = hasDelimiters
      ? phrases
      : phrases.filter((word) => !STOP_WORDS.has(word.toLowerCase()));

    const results: string[] = [];
    const seen = new Set<string>();

    seedPhrases.forEach((phrase) => {
      const words = phrase.split(/\s+/).filter(Boolean);
      if (words.length === 0) return;

      if (includeLower) {
        const tag = `#${lowerCase(words)}`;
        if (!seen.has(tag)) {
          seen.add(tag);
          results.push(tag);
        }
      }

      if (includeTitle) {
        const tag = `#${titleCase(words)}`;
        if (!seen.has(tag)) {
          seen.add(tag);
          results.push(tag);
        }
      }
    });

    return results.slice(0, Math.max(1, maxTags));
  }, [input, includeLower, includeTitle, maxTags]);

  const copyTags = async () => {
    if (tags.length === 0) return;
    await navigator.clipboard.writeText(tags.join(" "));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <UtilityToolPageShell
      title="Hashtag Generator Tool"
      seoTitle="Hashtag Generator Tool"
      seoDescription="Generate relevant hashtags for Instagram, TikTok, and Twitter. Create clean hashtag lists from keywords or phrases instantly."
      canonical="https://usonlinetools.com/productivity/hashtag-generator"
      categoryName="Productivity & Text"
      categoryHref="/category/productivity"
      heroDescription="Generate clean hashtag lists from your keywords or phrases. Paste topics or a caption, choose the style, and copy a ready-to-post hashtag set instantly."
      heroIcon={<Hash className="w-3.5 h-3.5" />}
      calculatorLabel="Hashtag Builder"
      calculatorDescription="Paste keywords or phrases and get hashtag-ready output."
      calculator={
        <div className="space-y-5">
          <div>
            <label htmlFor="hashtag-input" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Keywords or Phrases
            </label>
            <textarea
              id="hashtag-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="tool-calc-input min-h-[160px] w-full resize-y"
              placeholder="Example: summer travel, city breaks, weekend getaway"
            />
            <p className="mt-2 text-xs text-muted-foreground">Separate phrases with commas or new lines. If you paste a sentence, the tool will extract meaningful words.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Max Tags</p>
              <input
                type="number"
                min={5}
                max={50}
                value={maxTags}
                onChange={(event) => setMaxTags(Number(event.target.value))}
                className="tool-calc-input w-full"
              />
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Lowercase</p>
              <button
                onClick={() => setIncludeLower((value) => !value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:border-blue-500/40"
              >
                {includeLower ? "Enabled" : "Disabled"}
              </button>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Title Case</p>
              <button
                onClick={() => setIncludeTitle((value) => !value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:border-blue-500/40"
              >
                {includeTitle ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Generated Hashtags</p>
              <button
                onClick={copyTags}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-xs font-bold text-white"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.length ? (
                tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-card px-3 py-1 text-sm font-semibold text-foreground border border-border">
                    {tag}
                  </span>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Enter keywords to generate hashtags.</p>
              )}
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Add your keywords", description: "Paste comma-separated phrases or a draft caption to seed the generator." },
        { title: "Choose the style", description: "Toggle lowercase or TitleCase hashtags to match your posting style." },
        { title: "Adjust the limit", description: "Set how many hashtags you want, then copy the final list." },
        { title: "Paste into your post", description: "Use the generated list in Instagram, TikTok, or Twitter drafts." },
      ]}
      interpretationCards={[
        { title: "Keyword-driven", description: "Hashtags are created directly from your words to keep them relevant.", className: "bg-blue-500/5 border-blue-500/20" },
        { title: "Style control", description: "Lowercase tags feel casual; TitleCase tags stand out for branded phrases.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Limit aware", description: "Keep the output count aligned with platform limits and readability goals.", className: "bg-emerald-500/5 border-emerald-500/20" },
      ]}
      examples={[
        { scenario: "Travel post", input: "summer travel, city breaks", output: "#summertravel #CityBreaks" },
        { scenario: "Product launch", input: "new running shoes", output: "#newrunningshoes #NewRunningShoes" },
        { scenario: "Creator caption", input: "weekly vlog", output: "#weeklyvlog #WeeklyVlog" },
        { scenario: "Brand keyword list", input: "fitness coaching, habit tracker", output: "#fitnesscoaching #HabitTracker" },
      ]}
      whyChoosePoints={[
        "Instantly transforms keywords into usable hashtags without leaving the page.",
        "Gives you both lowercase and TitleCase outputs for different platform styles.",
        "Keeps the output list short and easy to copy so you can post faster.",
      ]}
      faqs={[
        { q: "How many hashtags should I use?", a: "Use enough to support discovery without overwhelming the caption. Start with 5-15 for most posts and adjust per platform." },
        { q: "Does this tool find trending hashtags?", a: "No. It builds hashtags from your keywords. Use it to create relevant tags, then supplement with trend research if needed." },
        { q: "Will it remove duplicate hashtags?", a: "Yes. The list is deduplicated and limited to your selected count." },
        { q: "Is this free to use?", a: "Yes. The generator runs locally in your browser with no signup." },
      ]}
      relatedTools={[
        { title: "Emoji Picker", slug: "emoji-picker", icon: <Sparkles className="w-4 h-4" />, color: 217, benefit: "Add emojis to captions" },
        { title: "Word Counter", slug: "word-counter", icon: <Hash className="w-4 h-4" />, color: 152, benefit: "Check caption length" },
        { title: "Text to Emoji", slug: "text-to-emoji", icon: <Sparkles className="w-4 h-4" />, color: 300, benefit: "Decorate your copy quickly" },
        { title: "Character Counter Tool", slug: "character-counter-tool", icon: <Hash className="w-4 h-4" />, color: 30, benefit: "Track character limits" },
        { title: "LinkedIn Post Formatter", slug: "online-linkedin-post-formatter", icon: <Hash className="w-4 h-4" />, color: 260, benefit: "Format social copy" },
        { title: "Social Media Bio Generator", slug: "bio-generator", icon: <Sparkles className="w-4 h-4" />, color: 120, benefit: "Generate profile bios" },
      ]}
    />
  );
}
