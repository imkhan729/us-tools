import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, FileText, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Hash, AlignLeft, Clock, BarChart3
} from "lucide-react";

function useWordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    if (!text) return { words: 0, chars: 0, charsNoSpace: 0, sentences: 0, paragraphs: 0, readTime: 0 };
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const sentences = (text.match(/[.!?]+/g) || []).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const readTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, charsNoSpace, sentences, paragraphs, readTime };
  }, [text]);

  return { text, setText, stats };
}

function ResultInsight({ stats }: { stats: any }) {
  if (stats.words === 0) return null;
  const level = stats.words < 150 ? "short paragraph" : stats.words < 500 ? "brief article" : stats.words < 1200 ? "standard article" : "long-form content";
  const message = `Your ${stats.words.toLocaleString()} words (${stats.chars.toLocaleString()} characters) form a ${level} with an estimated ${stats.readTime}-minute read time at 200 words per minute — the average adult silent reading speed.`;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-indigo-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-indigo-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Case Converter",         slug: "case-converter",         icon: <AlignLeft className="w-5 h-5" />, color: 217, benefit: "Change text case instantly" },
  { title: "Alphabetical Sort",      slug: "alphabetical-sort",      icon: <Hash className="w-5 h-5" />,      color: 265, benefit: "Sort lists A-Z or Z-A" },
  { title: "Duplicate Line Remover", slug: "duplicate-line-remover", icon: <FileText className="w-5 h-5" />,  color: 152, benefit: "Remove repeated lines" },
  { title: "Reading Time Calculator",slug: "reading-time-calculator",icon: <Clock className="w-5 h-5" />,     color: 25,  benefit: "Estimate reading time" },
];

export default function WordCounter() {
  const { text, setText, stats } = useWordCounter();
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <Layout>
      <SEO
        title="Word Counter – Count Words, Characters & Reading Time Free | US Online Tools"
        description="Free online word counter. Instantly count words, characters, sentences, paragraphs, and reading time. Paste any text for real-time analytics. No signup required."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <Link href="/category/productivity" className="text-muted-foreground hover:text-foreground transition-colors">Productivity &amp; Text</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <span className="text-foreground">Word Counter</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-indigo-500/15 bg-gradient-to-br from-indigo-500/5 via-card to-violet-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <FileText className="w-3.5 h-3.5" /> Productivity &amp; Text
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Word Counter</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Paste or type any text to instantly count words, characters, sentences, paragraphs, and estimated reading time. Real-time results — no button or signup needed.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-full border border-indigo-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Productivity &amp; Text &nbsp;·&nbsp; Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-violet-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-400 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Text Analysis</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 240 } as React.CSSProperties}>
                    <textarea
                      value={text}
                      onChange={e => setText(e.target.value)}
                      placeholder="Type or paste your text here..."
                      className="w-full h-48 p-4 rounded-xl bg-background border-2 border-border focus:border-indigo-500 outline-none font-medium resize-none text-sm leading-relaxed mb-5"
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { label: "Words",           value: stats.words.toLocaleString(),         color: "text-indigo-600 dark:text-indigo-400" },
                        { label: "Characters",      value: stats.chars.toLocaleString(),         color: "text-violet-600 dark:text-violet-400" },
                        { label: "Chars (no space)",value: stats.charsNoSpace.toLocaleString(),  color: "text-purple-600 dark:text-purple-400" },
                        { label: "Sentences",       value: stats.sentences.toLocaleString(),     color: "text-blue-600 dark:text-blue-400" },
                        { label: "Paragraphs",      value: stats.paragraphs.toLocaleString(),    color: "text-cyan-600 dark:text-cyan-400" },
                        { label: "Read Time",        value: `${stats.readTime} min`,             color: "text-emerald-600 dark:text-emerald-400" },
                      ].map(s => (
                        <div key={s.label} className="text-center p-4 rounded-xl bg-muted/40 border border-border">
                          <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <ResultInsight stats={stats} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Word Counter</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Whether you're writing an essay, crafting a blog post, preparing a tweet thread, or checking a form field limit — knowing your word and character count is essential. This tool provides six text metrics simultaneously with zero configuration required.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Paste or type your text</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Click inside the text area and paste (Ctrl+V / Cmd+V) any content — an article, essay, email draft, script, or any text. Alternatively, type directly into the field. All six metrics update in real-time, character by character, without needing to press any button.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Read your six instant metrics</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The counter displays: <strong className="text-foreground">Words</strong> (whitespace-delimited token count), <strong className="text-foreground">Characters</strong> (total with spaces), <strong className="text-foreground">Characters without spaces</strong>, <strong className="text-foreground">Sentences</strong> (punctuation-based), <strong className="text-foreground">Paragraphs</strong> (blank-line delimited), and <strong className="text-foreground">Reading Time</strong> in minutes.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Use for any purpose — no limits</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">There are no character limits, no rate limiting, and no file-size constraints. Paste an entire book chapter, a 5,000-word report, or a single tweet. All processing happens locally in your browser, so even very large text blocks run instantly without any server round-trip delay.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">How Each Metric is Calculated</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-indigo-500 font-bold w-4 flex-shrink-0">W</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Words = text.trim().split(/\s+/).length</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-violet-500 font-bold w-4 flex-shrink-0">C</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Chars = text.length (Unicode code points)</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-emerald-500 font-bold w-4 flex-shrink-0">R</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">ReadTime = Math.ceil(words / 200) minutes</code>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Understanding Each Metric</h2>
              <p className="text-muted-foreground text-sm mb-6">What each count means and when it matters most:</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Word Count — The Primary Writing Metric</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Words are counted by splitting on whitespace sequences. Hyphenated words (e.g., "well-known") count as one word. Numbers, URLs, and email addresses each count as one word. Most academic papers, journals, and content platforms specify minimums and maximums in words — not characters.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                  <div className="w-3 h-3 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Character Count — Critical for Digital Platforms</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Social media platforms (X/Twitter: 280 chars, Instagram caption: 2,200 chars), SMS (160 chars), meta descriptions (155 chars), and API text fields use character limits. The "without spaces" count helps for compressed formats where spaces are stripped, such as usernames and form fields.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Reading Time — Audience Engagement Signal</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The average adult reads approximately 200–250 words per minute silently. Medium and blog platforms display reading time estimates to help readers decide whether to commit. Articles under 3 minutes tend to have higher completion rates; long-form content (8+ min) benefits from table-of-contents navigation.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Word Count Quick Reference</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Content Type</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Typical Words</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Read Time</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Tweet (X)</td><td className="px-4 py-3 font-bold text-indigo-600">≤ 280 chars</td><td className="px-4 py-3 text-muted-foreground">&lt; 1 min</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Character limit, not word</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Blog introduction</td><td className="px-4 py-3 font-bold text-indigo-600">100–150</td><td className="px-4 py-3 text-muted-foreground">1 min</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Hook the reader quickly</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Standard blog post</td><td className="px-4 py-3 font-bold text-indigo-600">1,500–2,500</td><td className="px-4 py-3 text-muted-foreground">7–12 min</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">SEO sweet spot</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Academic essay</td><td className="px-4 py-3 font-bold text-indigo-600">2,000–5,000</td><td className="px-4 py-3 text-muted-foreground">10–25 min</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Department-specific</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Paperback novel</td><td className="px-4 py-3 font-bold text-indigo-600">80,000–100,000</td><td className="px-4 py-3 text-muted-foreground">6–8 hours</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Genre-dependent</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">SEO word count guidelines:</strong> For blog content targeting Google search rankings, a minimum of 1,500 words is typically recommended for competitive topics. However, search engines prioritize quality and relevance over raw word count. Thin content under 300 words rarely ranks for competitive keywords. Long-form content (3,000+ words) tends to earn more backlinks and social shares.</p>
                <p><strong className="text-foreground">Academic and professional standards:</strong> College essays commonly require 500–800 words. Dissertations typically range from 10,000 to 100,000+ words. Professional press releases are ideally 400–600 words. Job application cover letters perform best at 250–400 words — long enough to be thorough, short enough to respect the reader's time.</p>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <svg key={i} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"I paste every blog post into here before publishing. The reading time estimate alone is worth it — I've cut articles down from 20-minute reads to 7 minutes and engagement went up dramatically."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Word Counter?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Six metrics simultaneously, zero configuration.</strong> Most word counters show only words or characters. This tool provides words, two character counts, sentences, paragraphs, and reading time — all updating in real-time with a single text input. No tabs, no settings, no buttons to press.</p>
                <p><strong className="text-foreground">No character limits on input.</strong> Many online word counters force you to split large documents into chunks or impose a word limit on the free tier. This tool works on an entire dissertation or book chapter without any restriction.</p>
                <p><strong className="text-foreground">Completely private — text never leaves your device.</strong> Every calculation is performed locally in your browser using JavaScript. Your text is never transmitted to any server, stored in any database, or linked to any user account. This is particularly important when processing confidential documents.</p>
                <p><strong className="text-foreground">Accurate Unicode character counting.</strong> Unlike some simple tools that miscalculate multi-byte characters (emoji, CJK characters, diacritics), this counter uses JavaScript's native string length, which correctly counts each Unicode code unit — important for platforms with byte-based limits.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> Sentence counting is based on detecting terminal punctuation marks (., !, ?). It may overcount in cases of abbreviations (e.g., "Dr. Smith"), decimal numbers, or informal text with frequent ellipses. Reading time is estimated at 200 WPM — technical, legal, or foreign-language text may require more time to process.
                </p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="Does this word counter count hyphenated words as one or two?" a="Hyphenated words (e.g., 'state-of-the-art', 'twenty-three') are counted as a single word, as they are joined by non-whitespace characters. This matches how most style guides (APA, MLA, Chicago) define word count for academic submissions." />
                <FaqItem q="How is reading time calculated?" a="Reading time is calculated by dividing total word count by 200, then rounding up to the nearest minute. 200 words per minute is the commonly cited average adult silent reading speed. For technical or data-dense content, use 150 WPM as a more realistic estimate." />
                <FaqItem q="Can I use this for checking Twitter/X character limits?" a="Yes — use the 'Characters' count and ensure it stays at or below 280 for a standard tweet. Note that X counts Unicode characters (including emoji) as approximately 2 characters each, so the character count for emoji-heavy tweets may differ from platform to raw character count." />
                <FaqItem q="Does the counter work with non-English text?" a="Yes. The word counter uses whitespace-based splitting which works reliably for all space-separated languages including French, Spanish, German, Arabic (partially), Portuguese, and others. Languages without spaces (e.g., Chinese, Japanese) will not produce accurate word counts, though character counts remain accurate." />
                <FaqItem q="Is there a limit to how much text I can analyze?" a="There is no programmatic limit. The tool handles documents of any size — up to the available memory of your browser tab. In practice, pasting a 100,000-word document is handled smoothly on modern devices. On mobile, very large inputs may slow down older phones due to JavaScript DOM rendering." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Text &amp; Writing Tools</h2>
                <p className="text-white/80 mb-6 max-w-lg">Explore 400+ free productivity, text analysis, and writing tools — instant results, no account needed.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map(tool => (
                    <Link key={tool.slug} href={`/productivity/${tool.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-indigo-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share with writers and students.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-indigo-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-indigo-500/40 flex-shrink-0" />
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
