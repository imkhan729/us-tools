import { useMemo, useState } from "react";
import { BarChart3, Hash, Search, Smile, Type } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

const EMOJIS = [
  { char: "\u{1F600}", label: "grinning face", category: "Smileys" },
  { char: "\u{1F602}", label: "tears of joy", category: "Smileys" },
  { char: "\u{1F60D}", label: "heart eyes", category: "Smileys" },
  { char: "\u{1F60E}", label: "sunglasses face", category: "Smileys" },
  { char: "\u{1F621}", label: "angry face", category: "Smileys" },
  { char: "\u{1F44D}", label: "thumbs up", category: "Hands" },
  { char: "\u{1F44E}", label: "thumbs down", category: "Hands" },
  { char: "\u{1F44F}", label: "clapping hands", category: "Hands" },
  { char: "\u{1F64C}", label: "raised hands", category: "Hands" },
  { char: "\u{270C}", label: "victory hand", category: "Hands" },
  { char: "\u{2764}\u{FE0F}", label: "red heart", category: "Symbols" },
  { char: "\u{1F49A}", label: "green heart", category: "Symbols" },
  { char: "\u{1F49B}", label: "yellow heart", category: "Symbols" },
  { char: "\u{2728}", label: "sparkles", category: "Symbols" },
  { char: "\u{1F525}", label: "fire", category: "Symbols" },
  { char: "\u{1F389}", label: "party popper", category: "Objects" },
  { char: "\u{1F4A1}", label: "light bulb", category: "Objects" },
  { char: "\u{1F680}", label: "rocket", category: "Objects" },
  { char: "\u{1F4BB}", label: "laptop", category: "Objects" },
  { char: "\u{1F4F1}", label: "mobile phone", category: "Objects" },
  { char: "\u{1F355}", label: "pizza", category: "Food" },
  { char: "\u{1F354}", label: "burger", category: "Food" },
  { char: "\u{1F37F}", label: "popcorn", category: "Food" },
  { char: "\u{1F369}", label: "doughnut", category: "Food" },
  { char: "\u{2615}", label: "hot coffee", category: "Food" },
  { char: "\u{1F436}", label: "dog face", category: "Nature" },
  { char: "\u{1F431}", label: "cat face", category: "Nature" },
  { char: "\u{1F984}", label: "unicorn", category: "Nature" },
  { char: "\u{1F33B}", label: "sunflower", category: "Nature" },
  { char: "\u{1F338}", label: "cherry blossom", category: "Nature" },
];

const CATEGORIES = ["Smileys", "Hands", "Symbols", "Objects", "Food", "Nature"] as const;

export default function EmojiPickerTool() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Smileys");
  const [lastCopied, setLastCopied] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return EMOJIS.filter((emoji) => {
      const matchesCategory = emoji.category === category;
      if (!term) return matchesCategory;
      return emoji.label.toLowerCase().includes(term) || emoji.category.toLowerCase().includes(term);
    });
  }, [category, search]);

  const copyEmoji = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setLastCopied(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <UtilityToolPageShell
      title="Emoji Picker Tool"
      seoTitle="Emoji Picker Tool"
      seoDescription="Browse, search, and copy useful emojis by category with this free browser-based emoji picker."
      canonical="https://usonlinetools.com/social-media/emoji-picker"
      categoryName="Social Media Tools"
      categoryHref="/category/social-media"
      heroDescription="Browse practical emoji categories, search by label, and copy the character you need for captions, comments, bios, docs, and messages without leaving the browser."
      heroIcon={<Smile className="w-3.5 h-3.5" />}
      calculatorLabel="Emoji Browser"
      calculatorDescription="Browse, search, and copy emoji characters instantly."
      calculator={
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 md:p-6 space-y-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="tool-calc-input w-full pl-10"
              placeholder="Search by label or category..."
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors ${
                  category === item ? "border-blue-600 bg-blue-500 text-white" : "border-border bg-card hover:bg-muted"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-blue-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Category</p>
              <p className="text-lg font-black text-blue-600">{category}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Visible</p>
              <p className="text-2xl font-black text-emerald-600">{filtered.length}</p>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Search</p>
              <p className="text-lg font-black text-violet-600">{search ? "Active" : "Off"}</p>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Last Copied</p>
              <p className="text-2xl font-black text-cyan-600">{lastCopied || "-"}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {filtered.map((emoji) => (
                  <button key={`${emoji.category}-${emoji.label}`} onClick={() => copyEmoji(emoji.char)} className="rounded-2xl border border-border bg-background px-3 py-4 hover:bg-muted transition-colors">
                    <p className="text-3xl mb-2">{emoji.char}</p>
                    <p className="text-[11px] font-bold text-muted-foreground leading-snug">{emoji.label}</p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No emoji matched your search. Try a broader term like heart, food, smile, or hands.</p>
            )}
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-card p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Clipboard Status</p>
            <p className="text-sm text-foreground">{copied ? `Copied ${lastCopied} to clipboard.` : "Click any emoji tile to copy it."}</p>
          </div>
        </div>
      }
      howSteps={[
        { title: "Pick a category", description: "Choose smileys, symbols, hands, objects, food, or nature depending on the type of emoji you want." },
        { title: "Search when needed", description: "Use the search field to narrow the visible list by category or by descriptive label." },
        { title: "Click the emoji tile", description: "Each emoji button copies the character directly to your clipboard." },
        { title: "Paste it anywhere", description: "Use the copied emoji in captions, bios, comments, docs, notes, or chat messages." },
      ]}
      interpretationCards={[
        { title: "Category browsing", description: "Best when you want to scan a visual group quickly without guessing labels first." },
        { title: "Search mode", description: "Useful when you already know the type of emoji you need, such as heart, rocket, coffee, or dog.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Clipboard output", description: "The tool copies the actual emoji character, so you can paste it directly into most modern apps and browsers.", className: "bg-violet-500/5 border-violet-500/20" },
      ]}
      examples={[
        { scenario: "Caption emoji", input: "search: sparkles", output: "copy ✨" },
        { scenario: "Reaction icon", input: "Hands category", output: "copy 👍 or 👏" },
        { scenario: "Food post", input: "Food category", output: "copy 🍕 or ☕" },
        { scenario: "Tech message", input: "search: rocket", output: "copy 🚀" },
      ]}
      whyChoosePoints={[
        "Faster than opening a system emoji panel when you want a small curated set of useful options.",
        "Searchable labels make it easier to find the right emoji without scrolling through massive category walls.",
        "Copying happens in one click, which is practical for social captions, quick replies, or content planning work.",
      ]}
      faqs={[
        { q: "Does this include every emoji in Unicode?", a: "No. This page focuses on a curated practical set of common emojis across major categories." },
        { q: "Can I search by meaning?", a: "Yes. Search works against the label and category text, so terms like heart, rocket, coffee, or smile can help." },
        { q: "Will copied emojis work on social media?", a: "Yes. Standard emojis generally paste correctly into modern social platforms, browsers, and messaging apps." },
        { q: "Why is the set curated instead of huge?", a: "A smaller practical set is faster to browse and more useful for everyday posting than a massive raw Unicode dump." },
      ]}
      relatedTools={[
        { title: "Hashtag Generator", slug: "hashtag-generator", icon: <Hash className="w-4 h-4" />, color: 217, benefit: "Build captions and tags" },
        { title: "Twitter Character Counter", slug: "twitter-character-counter", icon: <BarChart3 className="w-4 h-4" />, color: 152, benefit: "Check post length" },
        { title: "Text Formatter Tool", slug: "text-formatter-tool", icon: <Type className="w-4 h-4" />, color: 274, benefit: "Adjust caption casing" },
        { title: "Color Picker Tool", slug: "color-picker", icon: <Smile className="w-4 h-4" />, color: 28, benefit: "Pair visuals with brand colors" },
        { title: "Random Letter Generator", slug: "random-letter-generator", icon: <Hash className="w-4 h-4" />, color: 340, benefit: "Generate random text prompts" },
        { title: "Word Counter", slug: "word-counter", icon: <BarChart3 className="w-4 h-4" />, color: 185, benefit: "Measure content length" },
      ]}
    />
  );
}
