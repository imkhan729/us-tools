import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Hash, Calculator, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  Copy, Check, BadgeCheck, Lock, Star, Sparkles,
  Target, Users, Search, BarChart3, Lightbulb,
} from "lucide-react";

// ── Hashtag Generation Logic ──
function useHashtagGenerator() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState<'camel' | 'snake' | 'kebab' | 'pascal'>('camel');
  const [maxLength, setMaxLength] = useState(30);

  const hashtags = useMemo(() => {
    if (!input.trim()) return [];

    const words = input.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);

    if (words.length === 0) return [];

    const baseHashtag = words.map((word, index) => {
      switch (style) {
        case 'camel':
          return index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1);
        case 'pascal':
          return word.charAt(0).toUpperCase() + word.slice(1);
        case 'snake':
          return word;
        case 'kebab':
          return word;
        default:
          return word;
      }
    }).join(style === 'snake' ? '_' : style === 'kebab' ? '-' : '');

    const variations = [
      `#${baseHashtag}`,
      `#${baseHashtag}2024`,
      `#${baseHashtag}Tips`,
      `#${baseHashtag}Guide`,
      `#${baseHashtag}Life`,
    ].filter(tag => tag.length <= maxLength);

    return variations;
  }, [input, style, maxLength]);

  return { input, setInput, style, setStyle, maxLength, setMaxLength, hashtags };
}

// ── Result Insight Component ──
function ResultInsight({ hashtags }: { hashtags: string[] }) {
  if (hashtags.length === 0) return null;

  const totalChars = hashtags.join(' ').length;
  const avgLength = Math.round(totalChars / hashtags.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20"
    >
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          Generated {hashtags.length} hashtag variations with an average length of {avgLength} characters.
          {hashtags.some(tag => tag.length > 20) && " Consider shorter versions for better readability."}
        </p>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-purple-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-purple-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Word Counter", slug: "word-counter", icon: <BarChart3 className="w-5 h-5" />, color: 217, benefit: "Count words and characters in text" },
  { title: "Case Converter", slug: "case-converter", icon: <Target className="w-5 h-5" />, color: 45, benefit: "Convert text case and formatting" },
  { title: "Slug Generator", slug: "slug-generator", icon: <Hash className="w-5 h-5" />, color: 265, benefit: "Create URL-friendly slugs" },
  { title: "Random Name Generator", slug: "random-name-generator", icon: <Users className="w-5 h-5" />, color: 152, benefit: "Generate random names for any use" },
  { title: "Username Generator", slug: "username-generator", icon: <Sparkles className="w-5 h-5" />, color: 340, benefit: "Create unique usernames" },
];

// ── Main Component ──
export default function HashtagGenerator() {
  const generator = useHashtagGenerator();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyHashtag = (hashtag: string, index: number) => {
    navigator.clipboard.writeText(hashtag);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllHashtags = () => {
    navigator.clipboard.writeText(generator.hashtags.join(' '));
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Hashtag Generator – Create Trending Hashtags for Social Media | Free Online Tool"
        description="Free online hashtag generator. Create relevant hashtags for Instagram, Twitter, TikTok. Generate trending hashtags from keywords instantly. No signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-purple-500" strokeWidth={3} />
          <Link href="/category/productivity-text" className="text-muted-foreground hover:text-foreground transition-colors">Productivity & Text</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-purple-500" strokeWidth={3} />
          <span className="text-foreground">Hashtag Generator</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-purple-500/15 bg-gradient-to-br from-purple-500/5 via-card to-pink-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          {/* Category pill */}
          <div className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Hash className="w-3.5 h-3.5" />
            Productivity &amp; Text
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Hashtag Generator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Generate relevant, trending hashtags for Instagram, Twitter, TikTok, and all social media platforms. Create hashtag variations from any keyword or phrase instantly.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs px-3 py-1.5 rounded-full border border-purple-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Results
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-pink-500/10 text-pink-600 dark:text-pink-400 font-bold text-xs px-3 py-1.5 rounded-full border border-pink-500/20">
              <TrendingUp className="w-3.5 h-3.5" /> Trending Ready
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>

          {/* Meta */}
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Productivity &amp; Text &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── 2. TOOL WIDGET ── */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-purple-500/20 shadow-lg shadow-purple-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-pink-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center flex-shrink-0">
                      <Hash className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Smart Generation</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  {/* Input Section */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">Enter your keyword or phrase</label>
                      <textarea
                        placeholder="e.g., digital marketing, coffee lover, fitness journey"
                        className="w-full h-24 p-4 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                        value={generator.input}
                        onChange={e => generator.setInput(e.target.value)}
                      />
                    </div>

                    {/* Style Options */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-2">Style</label>
                        <select
                          value={generator.style}
                          onChange={e => generator.setStyle(e.target.value as any)}
                          className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                        >
                          <option value="camel">camelCase</option>
                          <option value="pascal">PascalCase</option>
                          <option value="snake">snake_case</option>
                          <option value="kebab">kebab-case</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-2">Max Length</label>
                        <input
                          type="number"
                          min="10"
                          max="100"
                          value={generator.maxLength}
                          onChange={e => generator.setMaxLength(Number(e.target.value))}
                          className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Results */}
                  {generator.hashtags.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-foreground">Generated Hashtags</h3>
                        <button
                          onClick={copyAllHashtags}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-sm rounded-lg hover:bg-purple-500/20 transition-colors"
                        >
                          {copiedIndex === -1 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copiedIndex === -1 ? "Copied!" : "Copy All"}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {generator.hashtags.map((hashtag, index) => (
                          <button
                            key={index}
                            onClick={() => copyHashtag(hashtag, index)}
                            className="group p-3 rounded-xl border border-border bg-background hover:border-purple-500/40 hover:bg-purple-500/5 transition-all text-left"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-mono text-purple-600 dark:text-purple-400 font-bold">
                                {hashtag}
                              </span>
                              {copiedIndex === index ? (
                                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              ) : (
                                <Copy className="w-4 h-4 text-muted-foreground group-hover:text-purple-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {hashtag.length} chars
                            </span>
                          </button>
                        ))}
                      </div>

                      <ResultInsight hashtags={generator.hashtags} />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ── 3. HOW TO USE ── */}
            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Hashtag Generator</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                Creating effective hashtags for social media doesn't have to be complicated. This tool helps you generate relevant, trending hashtags from any keyword or phrase, with multiple style options to match different platforms and audiences.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Enter your main keyword or topic</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Start with a clear, descriptive phrase that represents your content. For example, "digital marketing" will generate more targeted hashtags than just "marketing". The tool automatically cleans and processes your input, removing special characters and extra spaces.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Choose your hashtag style</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Select from camelCase (#digitalMarketing), PascalCase (#DigitalMarketing), snake_case (#digital_marketing), or kebab-case (#digital-marketing). Different platforms and communities prefer different styles — camelCase is popular on Twitter, while snake_case works well for technical content.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Set maximum length (optional)</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Adjust the character limit to ensure your hashtags fit platform constraints. Instagram allows up to 30 characters per hashtag, while Twitter is more flexible. The tool automatically filters out hashtags that exceed your chosen limit.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">4</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Copy and use your hashtags</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Click any individual hashtag to copy it, or use "Copy All" to get the entire set. The tool generates multiple variations including trending suffixes like "2024", "Tips", "Guide", "Life" to increase discoverability across different social media algorithms.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  <strong className="text-foreground">Pro tip:</strong> Mix popular hashtags (high volume) with niche-specific ones (lower competition) for better engagement. Research trending hashtags in your niche using platform search tools, then combine them with your generated variations.
                </p>
              </div>
            </section>

            {/* ── 4. HASHTAG STRATEGIES ── */}
            <section id="hashtag-strategies" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Hashtag Strategies & Best Practices</h2>
              <p className="text-muted-foreground text-sm mb-6">Optimize your social media reach with smart hashtag usage:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Mix popularity levels</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Combine 1-2 ultra-popular hashtags (#love, #instagood) with 3-5 mid-tier hashtags and 2-3 niche-specific ones. This strategy maximizes reach while maintaining relevance to your target audience.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Platform-specific optimization</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Instagram favors visual hashtags, Twitter prefers conversational ones, and TikTok responds well to trending challenges. Research each platform's algorithm and adapt your hashtag strategy accordingly.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Trending awareness</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Monitor trending hashtags in your niche and incorporate them strategically. However, avoid forcing irrelevant trending hashtags just for visibility — authenticity matters more than virality.</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Remember: hashtags are tools for discoverability, not guarantees of success. Focus on creating high-quality content first, then use hashtags to help the right audience find it.
              </p>
            </section>

            {/* ── 5. QUICK EXAMPLES ── */}
            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Input</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Style</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Generated Hashtags</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">fitness journey</td>
                      <td className="px-4 py-3 font-mono text-foreground">camelCase</td>
                      <td className="px-4 py-3 font-mono text-purple-600 dark:text-purple-400">#fitnessJourney #fitnessJourney2024 #fitnessJourneyTips</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Instagram fitness</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">digital marketing</td>
                      <td className="px-4 py-3 font-mono text-foreground">snake_case</td>
                      <td className="px-4 py-3 font-mono text-purple-600 dark:text-purple-400">#digital_marketing #digital_marketing2024</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">LinkedIn B2B</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">coffee lover</td>
                      <td className="px-4 py-3 font-mono text-foreground">kebab-case</td>
                      <td className="px-4 py-3 font-mono text-purple-600 dark:text-purple-400">#coffee-lover #coffee-lover-life</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Twitter lifestyle</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Example 1 – Fitness content:</strong> Starting with "fitness journey" generates relevant hashtags like #fitnessJourney, #fitnessJourney2024, and #fitnessJourneyTips. These work well for Instagram Reels and Stories about workout progress, meal prep, and transformation stories. The camelCase style is popular among fitness communities for its readability.
                </p>
                <p>
                  <strong className="text-foreground">Example 2 – B2B marketing:</strong> "Digital marketing" with snake_case produces #digital_marketing and #digital_marketing2024. This style is preferred on LinkedIn and Twitter for professional content. The underscore makes it clear and searchable for B2B audiences looking for industry insights and thought leadership.
                </p>
                <p>
                  <strong className="text-foreground">Example 3 – Lifestyle content:</strong> "Coffee lover" in kebab-case creates #coffee-lover and #coffee-lover-life. Perfect for casual, community-driven content on platforms like Twitter and TikTok. The hyphen style feels friendly and approachable, matching the warm, inviting nature of coffee culture content.
                </p>
              </div>
            </section>

            {/* ── 6. WHY CHOOSE THIS ── */}
            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Hashtag Generator?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Multiple style formats for every platform.</strong> From camelCase for Twitter threads to snake_case for technical communities, this generator supports all major hashtag conventions. No more manually converting between formats or guessing which style works best for your audience.
                </p>
                <p>
                  <strong className="text-foreground">Smart variation generation.</strong> The tool doesn't just create one hashtag — it generates multiple variations with trending suffixes, current year markers, and popular modifiers. This gives you options for different content types and audience segments without manual brainstorming.
                </p>
                <p>
                  <strong className="text-foreground">Platform-aware length limits.</strong> Automatically respects character limits for different social media platforms. Instagram's 30-character limit, Twitter's flexibility, and TikTok's preferences are all considered to ensure your hashtags work wherever you post.
                </p>
                <p>
                  <strong className="text-foreground">One-click copying for efficiency.</strong> Copy individual hashtags or the entire set with a single click. No more highlighting, right-clicking, or manual selection — just click and paste directly into your social media posts or captions.
                </p>
                <p>
                  <strong className="text-foreground">Privacy-first design.</strong> All hashtag generation happens locally in your browser. Your keywords and generated hashtags never leave your device or get stored anywhere. Perfect for sensitive topics, business strategies, or personal branding work.
                </p>
              </div>

              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> While this tool helps generate relevant hashtags, social media algorithms and trending topics change frequently. For best results, combine generated hashtags with current trending topics and platform-specific research. Hashtag performance should be monitored and adjusted based on engagement metrics.
                </p>
              </div>
            </section>

            {/* ── 7. FAQ ── */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How many hashtags should I use per post?"
                  a="It depends on the platform. Instagram recommends 3-5 hashtags for optimal reach, Twitter works well with 1-3, and TikTok performs best with 3-5. Focus on relevance over quantity — better engagement comes from targeted hashtags that match your content and audience."
                />
                <FaqItem
                  q="Do hashtags with spaces work?"
                  a="No, hashtags cannot contain spaces. This tool automatically removes spaces and special characters, converting them to the style you choose (underscores, hyphens, or camelCase). For multi-word concepts, the tool intelligently combines words into a single, readable hashtag."
                />
                <FaqItem
                  q="Should I use the same hashtags on every post?"
                  a="Mix it up! While having 2-3 consistent brand hashtags is good for building recognition, varying your other hashtags keeps your content discoverable to different audiences. Use this tool to generate fresh variations for each post while maintaining some consistency."
                />
                <FaqItem
                  q="Do hashtags work on all social media platforms?"
                  a="Most major platforms support hashtags: Instagram, Twitter, Facebook, LinkedIn, TikTok, Pinterest, and YouTube. However, each platform handles hashtags differently in their algorithm. Research platform-specific best practices for maximum impact."
                />
                <FaqItem
                  q="Can I use special characters in hashtags?"
                  a="Most special characters (except underscores and hyphens in some styles) are automatically removed by this tool. Stick to letters, numbers, underscores, and hyphens to ensure maximum compatibility across all social media platforms."
                />
                <FaqItem
                  q="How do I know if my hashtags are effective?"
                  a="Track engagement metrics like reach, impressions, and saves. Use platform analytics tools to see which hashtags drive the most interaction. Consider A/B testing different hashtag combinations on similar content to find what works best for your audience."
                />
              </div>
            </section>

            {/* ── 8. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Boost Your Social Media Reach</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore 400+ free tools including social media schedulers, content creators, and analytics tools — all free, all instant.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Related Tools */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-purple-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others create better hashtags.</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopiedIndex(-2);
                    setTimeout(() => setCopiedIndex(null), 2000);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-500 to-pink-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copiedIndex === -2 ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    "Generator",
                    "How to Use",
                    "Hashtag Strategies",
                    "Quick Examples",
                    "Why Choose This",
                    "FAQ",
                  ].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-purple-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-purple-500/40 flex-shrink-0" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}