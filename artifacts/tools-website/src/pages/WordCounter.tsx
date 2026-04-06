import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Type, AlignLeft, Hash, Clock, FileText,
  ArrowRight, Zap, Smartphone, Shield, BadgeCheck, Lock, Copy, Check,
  Calculator, Star, Lightbulb
} from "lucide-react";

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-orange-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-orange-500">
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
  { title: "Character Counter", slug: "character-counter", icon: <Hash className="w-4 h-4" />, color: 217, benefit: "Count characters for any limit" },
  { title: "Case Converter", slug: "case-converter", icon: <Type className="w-4 h-4" />, color: 45, benefit: "Change text case instantly" },
  { title: "Text Repeater", slug: "text-repeater", icon: <AlignLeft className="w-4 h-4" />, color: 152, benefit: "Repeat any text multiple times" },
  { title: "Password Generator", slug: "password-generator", icon: <Shield className="w-4 h-4" />, color: 275, benefit: "Generate secure passwords" },
  { title: "Lorem Ipsum Generator", slug: "lorem-ipsum-generator", icon: <FileText className="w-4 h-4" />, color: 25, benefit: "Generate placeholder text" },
  { title: "Remove Duplicate Lines", slug: "remove-duplicate-lines", icon: <Calculator className="w-4 h-4" />, color: 340, benefit: "Clean up duplicate text lines" },
];

// ── Stat Card Component ──
function StatCard({
  value,
  label,
  icon,
  iconBg,
}: {
  value: number | string;
  label: string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center text-center"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${iconBg}`}>
        {icon}
      </div>
      <p className="text-3xl font-black text-foreground">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
}

// ── Main Component ──
export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  // ── Core calculations ──
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const paragraphs = text.trim() === "" ? 0 : text.split(/\n+/).filter(p => p.trim().length > 0).length;
  const sentences = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 225));

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Word Counter – Count Words, Characters & Reading Time Free | US Online Tools"
        description="Free online word counter and text analyzer. Count words, characters, sentences, paragraphs, and estimate reading time in real time. Perfect for essays, social media, and SEO content."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/text" className="text-muted-foreground hover:text-foreground transition-colors">Text Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Word Counter</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          {/* Category pill */}
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Type className="w-3.5 h-3.5" />
            Text Tools
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Word Counter &amp; Text Analyzer
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Instantly count words, characters, sentences, and paragraphs in any text. Estimate reading time, check character limits for social media, and analyze your writing — all in real time.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" /> Real-Time Count
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Clock className="w-3.5 h-3.5" /> Reading Time
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>

          {/* Meta */}
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Text Tools &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── 1. TOOL WIDGET ── */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">

                  {/* Widget header */}
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0">
                      <Type className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">5 Metrics in 1</p>
                      <p className="text-sm text-muted-foreground">Stats update as you type — no button needed.</p>
                    </div>
                  </div>

                  {/* Stat Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <StatCard
                      value={words.toLocaleString()}
                      label="Words"
                      icon={<Type className="w-4 h-4 text-white" />}
                      iconBg="bg-gradient-to-br from-orange-500 to-red-500"
                    />
                    <StatCard
                      value={characters.toLocaleString()}
                      label="Characters"
                      icon={<Hash className="w-4 h-4 text-white" />}
                      iconBg="bg-gradient-to-br from-blue-500 to-indigo-600"
                    />
                    <StatCard
                      value={sentences.toLocaleString()}
                      label="Sentences"
                      icon={<AlignLeft className="w-4 h-4 text-white" />}
                      iconBg="bg-gradient-to-br from-emerald-500 to-teal-600"
                    />
                    <StatCard
                      value={paragraphs.toLocaleString()}
                      label="Paragraphs"
                      icon={<FileText className="w-4 h-4 text-white" />}
                      iconBg="bg-gradient-to-br from-purple-500 to-pink-600"
                    />
                    <StatCard
                      value={`${readingTimeMinutes} min`}
                      label="Reading Time"
                      icon={<Clock className="w-4 h-4 text-white" />}
                      iconBg="bg-gradient-to-br from-cyan-500 to-blue-600"
                    />
                  </div>

                  {/* Textarea */}
                  <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-border bg-muted/30 flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Text</span>
                      <button
                        onClick={() => setText("")}
                        className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
                      >
                        Clear
                      </button>
                    </div>
                    <textarea
                      value={text}
                      onChange={e => setText(e.target.value)}
                      placeholder="Type or paste your text here..."
                      className="w-full h-96 bg-transparent p-5 text-foreground text-base focus:outline-none resize-none placeholder:text-muted-foreground/50"
                    />
                  </div>

                  {/* Characters without spaces */}
                  <p className="text-xs text-muted-foreground text-center">
                    Characters without spaces: <strong className="text-foreground">{charactersNoSpaces.toLocaleString()}</strong>
                  </p>
                </div>
              </div>
            </section>

            {/* ── 2. HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Word Counter</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                This tool gives you five text metrics instantly, with zero friction. Whether you're writing a tweet, a blog post, an academic essay, or a novel chapter, here's exactly how to use it.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Type or paste text into the large text area</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Click inside the text box and start typing, or use <strong className="text-foreground">Ctrl+V</strong> (Windows) / <strong className="text-foreground">Cmd+V</strong> (Mac) to paste existing text. The tool accepts any plain text including essays, social media posts, code comments, emails, and more. There is no character limit — paste entire documents if needed.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Stats update in real time — no button needed</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      All five metrics — words, characters, sentences, paragraphs, and reading time — recalculate with every keystroke. Watch the counters update as you write. This is especially useful when writing to a specific word count target, like a 1,000-word blog post or a 280-character tweet.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Use the Clear button to reset and start fresh</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Click the <strong className="text-foreground">Clear</strong> button in the top-right corner of the text area to erase all text and reset all counters to zero. This is faster than selecting all and deleting, especially on mobile. Note that refreshing the page also clears all text — your input is never saved to any server.
                    </p>
                  </div>
                </li>
              </ol>

              {/* What Each Metric Means */}
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">What Each Metric Means</p>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <div className="flex gap-3">
                    <span className="text-orange-500 font-bold w-28 flex-shrink-0">Words</span>
                    <span>Sequences of characters separated by whitespace. "Hello world" = 2 words.</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-blue-500 font-bold w-28 flex-shrink-0">Characters</span>
                    <span>Total count including spaces and punctuation. Every keystroke adds 1.</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-emerald-500 font-bold w-28 flex-shrink-0">Sentences</span>
                    <span>Split by <code className="px-1 py-0.5 bg-background rounded text-xs font-mono">. ! ?</code> delimiters. Consecutive punctuation counts as one boundary.</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-purple-500 font-bold w-28 flex-shrink-0">Paragraphs</span>
                    <span>Non-empty lines separated by line breaks. Blank lines between blocks are ignored.</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyan-500 font-bold w-28 flex-shrink-0">Reading Time</span>
                    <span>Estimated at 225 words per minute — the average adult silent reading speed. Minimum shown is 1 minute.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 3. RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Interpretation by Content Type</h2>
              <p className="text-muted-foreground text-sm mb-6">Use these benchmarks to understand where your text fits and what platform or format it suits best:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Tweet / Social Post (under 280 characters) — Quick updates, social media</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Perfect for quick updates, reactions, announcements, or social media captions. Twitter/X enforces a hard 280-character limit. Instagram captions can be longer but are typically truncated after 125 characters. Keep it punchy, direct, and single-idea focused for the best engagement on short-form platforms.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Short-Form Content (280–1,000 words) — Blog intro, product description, email</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Ideal for blog introductions, product descriptions, email newsletters, LinkedIn posts, and press releases. At this length, readers expect a clear point with supporting detail but no deep dive. SEO studies suggest 300–500 words as a minimum for Google indexing, while email open rates drop significantly above 600 words.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Long-Form Article (1,000–3,000 words) — Blog post, news article, case study</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">The sweet spot for blog posts, news articles, how-to guides, and case studies. HubSpot research shows blog posts between 2,100–2,400 words generate the most organic search traffic. At 1,500 words and 225 WPM, your reader is looking at roughly a 7-minute commitment — enough to build a compelling argument or teach a concept thoroughly.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <div className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Deep Content (3,000+ words) — White paper, guide, academic paper</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Territory for white papers, comprehensive guides, academic papers, and technical documentation. Readers in this zone are highly engaged and seeking expertise. Long-form content tends to earn more backlinks and performs well in Google's "helpful content" evaluations. Structure is critical at this length — use clear headings, bullet points, and a table of contents to keep readers oriented.</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Word count benchmarks are guidelines, not rules. A compelling 300-word piece can outperform a padded 3,000-word article. Focus on clarity and value, then use the word counter to verify you're within the expected range for your chosen format or platform.
              </p>
            </section>

            {/* ── 4. QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Content Type</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Characters</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Words</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Reading Time</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Use Case</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Tweet</td>
                      <td className="px-4 py-3 font-mono text-foreground">≤ 280</td>
                      <td className="px-4 py-3 font-mono text-foreground">~50</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">1 min</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Twitter / X post</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Product description</td>
                      <td className="px-4 py-3 font-mono text-foreground">~1,200</td>
                      <td className="px-4 py-3 font-mono text-foreground">150–300</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">1–2 min</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">E-commerce listing</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Blog post</td>
                      <td className="px-4 py-3 font-mono text-foreground">~9,000</td>
                      <td className="px-4 py-3 font-mono text-foreground">1,000–2,000</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">5–9 min</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">SEO article</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Novel chapter</td>
                      <td className="px-4 py-3 font-mono text-foreground">~28,000</td>
                      <td className="px-4 py-3 font-mono text-foreground">~5,000</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">~22 min</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Fiction writing</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Academic essay</td>
                      <td className="px-4 py-3 font-mono text-foreground">~17,000</td>
                      <td className="px-4 py-3 font-mono text-foreground">~3,000</td>
                      <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">~14 min</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">University assignment</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Social media character limits:</strong> Twitter/X enforces 280 characters — paste your tweet into the text area and watch the character counter in real time. Instagram captions can technically reach 2,200 characters, but only the first 125 show before the "more" cutoff. LinkedIn posts cap at 3,000 characters for personal profiles. The word counter helps you hit these targets precisely without manually counting.
                </p>
                <p>
                  <strong className="text-foreground">Academic and professional word limits:</strong> University assignments typically specify word counts (e.g., "2,500–3,000 words"). Pasting your draft here gives you an immediate count that matches what your word processor shows — useful for a quick sanity check before submission. Most style guides include the bibliography and notes in the word count; check your institution's policy.
                </p>
                <p>
                  <strong className="text-foreground">SEO content planning:</strong> Search engine optimization research consistently finds that comprehensive content outranks thin content. Tools like Clearscope and MarketMuse recommend target word counts based on competitor analysis. A typical pillar page for a competitive keyword lands between 2,500–4,500 words. Use this word counter during drafting to track progress toward your content brief's word target.
                </p>
                <p>
                  <strong className="text-foreground">Reading time in newsletters and email:</strong> Email marketing platforms like Mailchimp and ConvertKit display an estimated read time next to your subject line. Knowing your reading time before sending helps you decide whether to cut content or split a long issue into two. The sweet spot for B2B newsletters is typically 3–5 minutes (roughly 675–1,125 words at 225 WPM).
                </p>
              </div>

              {/* Testimonial */}
              <div className="mt-6 p-5 rounded-xl bg-orange-500/5 border border-orange-500/15">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"I paste every blog draft in here before publishing. The reading time estimate alone has saved me from publishing pieces that were way too long for my audience."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* ── 5. WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Word Counter?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Completely free with no hidden costs.</strong> This tool is free to use with no paywalls, no account creation, and no ad-gating. Many competing word counters require you to sign up for a free trial or accept cookie tracking. This tool loads instantly, works immediately, and never prompts you to upgrade.
                </p>
                <p>
                  <strong className="text-foreground">Real-time counts with no button to press.</strong> Every metric recalculates the moment you type or paste. There's no submit button, no delay, and no page reload. This live feedback loop is the fastest way to write toward a target word count or stay within a character limit — you always know exactly where you stand.
                </p>
                <p>
                  <strong className="text-foreground">Five statistics at once, not just word count.</strong> Most standalone word counters give you one number. This tool simultaneously tracks words, characters (with and without spaces), sentences, paragraphs, and reading time — the complete picture you need when editing professional content, academic writing, or social media copy.
                </p>
                <p>
                  <strong className="text-foreground">Your text never leaves your browser.</strong> Every calculation runs locally in JavaScript on your device. No text is transmitted to any server, saved to any database, or linked to any user profile. This is critical for writers working with confidential drafts, journalists protecting sources, legal professionals, or anyone handling sensitive content.
                </p>
                <p>
                  <strong className="text-foreground">Fully mobile-friendly with a thumb-optimized layout.</strong> The text area and stat cards reflow elegantly on any screen size. On a phone, the cards stack in a readable grid and the textarea is large enough for extended writing sessions. On a desktop, everything is visible side-by-side for maximum efficiency. No app download required — it runs in any modern browser.
                </p>
              </div>

              {/* Note / Limitation */}
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <div className="flex gap-2 items-start">
                  <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Note:</strong> Reading time is an estimate based on the average adult silent reading speed of 225 words per minute. Actual reading speed varies considerably based on text complexity, reader familiarity with the subject, and formatting. Dense technical or academic writing may be read at 150–175 WPM, while simple conversational text may be read at 250–300 WPM. Additionally, refreshing the page clears all text — your input is never saved automatically.
                  </p>
                </div>
              </div>
            </section>

            {/* ── 6. FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="How is reading time calculated?"
                  a="Reading time is calculated by dividing your total word count by 225, which is the commonly cited average silent reading speed for adults in words per minute (WPM). The result is rounded up to the nearest whole minute, with a minimum of 1 minute displayed. For example, a 500-word piece reads in approximately 3 minutes (500 ÷ 225 = 2.2, rounded up to 3). This aligns with how platforms like Medium and Substack display reading time estimates."
                />
                <FaqItem
                  q="Does this count characters with or without spaces?"
                  a="Both. The main character counter includes all characters — letters, numbers, punctuation, and spaces. The 'Characters without spaces' figure shown below the text area excludes all whitespace, including spaces, tabs, and newlines. This is useful when platforms specify character limits that exclude spaces, or when you need to know the raw printable character count for SEO or data entry purposes."
                />
                <FaqItem
                  q="What counts as a sentence?"
                  a="The sentence counter splits text on period (.), exclamation mark (!), and question mark (?) characters, then filters out empty segments. This means 'Hello world! How are you?' counts as 2 sentences. Consecutive punctuation like '...' or '?!' is treated as a single sentence boundary. Abbreviations like 'Dr.' or 'U.S.' may cause slight over-counting, which is a known limitation of punctuation-based sentence detection."
                />
                <FaqItem
                  q="How is a paragraph counted?"
                  a="A paragraph is counted as any non-empty block of text separated from other blocks by one or more blank lines (line breaks). If you press Enter once to move to the next line, it's treated as a new paragraph only if the previous line had content. Consecutive blank lines are collapsed into a single separator. This matches the conventional definition of a paragraph as a distinct block of continuous text."
                />
                <FaqItem
                  q="Does this work for non-English text?"
                  a="Yes, the tool works with any Unicode text, including languages like Spanish, French, German, Arabic, Chinese, Japanese, Korean, and Hindi. Word counting is based on whitespace splitting, which works well for space-separated languages. For languages that don't use spaces between words — like Chinese and Japanese — the 'word count' will reflect character clusters rather than linguistic words. Characters, sentences, and paragraphs are counted accurately regardless of language."
                />
                <FaqItem
                  q="Is there a character limit?"
                  a="No. The text area accepts unlimited input. You can paste entire documents, book chapters, or lengthy reports and the counters will handle them instantly. Performance remains smooth in modern browsers even with very large text blocks (tens of thousands of words). The only practical limit is your browser's memory, which is rarely a concern for typical text content."
                />
                <FaqItem
                  q="Can I use this for Twitter/X character limits?"
                  a="Yes. Paste your tweet draft into the text area and watch the character counter in real time. Twitter/X enforces a 280-character limit per tweet (for standard accounts). Keep an eye on the 'Characters' metric — when it reaches 280, you've hit the limit. Note that Twitter may count URLs differently (all URLs count as 23 characters regardless of length), so verify character count directly in the Twitter compose box before posting."
                />
                <FaqItem
                  q="Is my text saved anywhere?"
                  a="No. All calculations run entirely in your browser using JavaScript. Your text is never sent to any server, never stored in cookies, and never logged or analyzed by any analytics system. When you close the browser tab or refresh the page, all text is permanently gone. There are no user accounts and no data retention of any kind — what you type stays exclusively on your device."
                />
              </div>
            </section>

            {/* ── 7. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Text Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore 400+ free tools including case converters, text generators, character counters, and more — all free, all instant, no signup required.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-orange-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others count words and analyze text easily.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    "Tool Widget",
                    "How to Use",
                    "Result Interpretation",
                    "Quick Examples",
                    "Why Choose This",
                    "FAQ",
                  ].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-orange-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-orange-500/40 flex-shrink-0" />
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
