import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getToolPath } from "@/data/tools";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "wouter";
import {
  AlignLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Lock,
  Shield,
  Smartphone,
  TextCursorInput,
} from "lucide-react";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold leading-snug text-foreground">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-sky-500"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="border-t border-border px-5 pb-5 pt-4 leading-relaxed text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Word Counter", slug: "word-counter", benefit: "Word, line, and reading metrics" },
  { title: "Palindrome Checker", slug: "palindrome-checker", benefit: "Test mirrored phrases" },
  { title: "Twitter Character Counter", slug: "twitter-character-counter", benefit: "Stay inside tweet limits" },
  { title: "Case Converter", slug: "case-converter", benefit: "Clean and transform copied text" },
];

const EXAMPLE_TEXT =
  "Utility Hub helps users count words, characters, and line breaks before publishing product copy, meta descriptions, and social posts.";

export default function CharacterCounterTool() {
  const [text, setText] = useState(EXAMPLE_TEXT);
  const [customLimit, setCustomLimit] = useState("160");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean).length : 0;
    const lines = text.length === 0 ? 0 : text.split(/\r?\n/).length;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean).length : 0;
    const readingMinutes = words / 200;
    const limit = Number(customLimit);
    const hasLimit = Number.isFinite(limit) && limit > 0;
    const remaining = hasLimit ? limit - characters : null;

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      lines,
      paragraphs,
      readingMinutes,
      remaining,
      hasLimit,
    };
  }, [customLimit, text]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Character Counter Tool - Count Characters, Words, and Limits"
        description="Free online character counter tool. Count characters with and without spaces, words, sentences, lines, and custom limit remaining."
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center text-sm font-bold uppercase tracking-wider">
          <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="mx-2 h-4 w-4 text-sky-500" strokeWidth={3} />
          <Link href="/category/productivity" className="text-muted-foreground transition-colors hover:text-foreground">
            Productivity &amp; Text
          </Link>
          <ChevronRight className="mx-2 h-4 w-4 text-sky-500" strokeWidth={3} />
          <span className="text-foreground">Character Counter Tool</span>
        </nav>

        <section className="mb-10 overflow-hidden rounded-2xl border border-sky-500/15 bg-gradient-to-br from-sky-500/5 via-card to-indigo-500/5 px-8 py-10 md:px-12 md:py-14">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
            <AlignLeft className="h-3.5 w-3.5" /> Productivity &amp; Text
          </div>
          <h1 className="mb-4 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-foreground md:text-6xl">
            Character Counter Tool
          </h1>
          <p className="mb-6 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
            Count characters with and without spaces, plus words, sentences, lines, paragraphs, and a custom limit
            remaining meter. Useful for SEO snippets, social posts, forms, and editorial review.
          </p>
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <BadgeCheck className="h-3.5 w-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-xs font-bold text-sky-600 dark:text-sky-400">
              <TextCursorInput className="h-3.5 w-3.5" /> Live Counts
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-500/20 bg-slate-500/10 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
              <Lock className="h-3.5 w-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold text-violet-600 dark:text-violet-400">
              <Shield className="h-3.5 w-3.5" /> Browser Only
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400">
              <Smartphone className="h-3.5 w-3.5" /> Mobile Ready
            </span>
          </div>
          <p className="text-xs font-medium text-muted-foreground/70">
            Category: Productivity &amp; Text · Includes custom limit tracking · Updated March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          <div className="space-y-10 lg:col-span-3">
            <section>
              <div className="overflow-hidden rounded-2xl border border-sky-500/20 shadow-lg shadow-sky-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 to-indigo-400" />
                <div className="space-y-6 bg-card p-6 md:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-400">
                      <AlignLeft className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Text Metrics</p>
                      <p className="text-sm text-muted-foreground">Paste content once and watch all counts update immediately.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
                    <div className="space-y-3">
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">Text Input</label>
                      <textarea
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        placeholder="Type or paste your text here..."
                        className="tool-calc-input min-h-[220px] w-full resize-none text-sm leading-relaxed"
                      />
                    </div>

                    <div className="rounded-xl border border-border bg-background/70 p-4">
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">Custom Limit</label>
                      <input
                        type="number"
                        min="1"
                        value={customLimit}
                        onChange={(event) => setCustomLimit(event.target.value)}
                        placeholder="160"
                        className="tool-calc-input mt-3 w-full"
                      />
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        Use this for meta descriptions, app fields, form validation, or any editorial character cap.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-border bg-background/70 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Characters</p>
                      <p className="mt-2 text-3xl font-black text-foreground">{stats.characters}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/70 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">No Spaces</p>
                      <p className="mt-2 text-3xl font-black text-foreground">{stats.charactersNoSpaces}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/70 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Words</p>
                      <p className="mt-2 text-3xl font-black text-foreground">{stats.words}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/70 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sentences</p>
                      <p className="mt-2 text-3xl font-black text-foreground">{stats.sentences}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/70 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Lines</p>
                      <p className="mt-2 text-3xl font-black text-foreground">{stats.lines}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background/70 p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Paragraphs</p>
                      <p className="mt-2 text-3xl font-black text-foreground">{stats.paragraphs}</p>
                    </div>
                  </div>

                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-sky-500/20 bg-sky-500/8 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-sky-700 dark:text-sky-300">Limit Status</p>
                        <h2 className="mt-1 text-xl font-black text-foreground">
                          {stats.hasLimit
                            ? stats.remaining! >= 0
                              ? `${stats.remaining} characters remaining`
                              : `${Math.abs(stats.remaining!)} characters over limit`
                            : "Enter a custom limit to track remaining characters"}
                        </h2>
                      </div>
                      <div className="rounded-xl bg-card px-4 py-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Estimated Reading Time</p>
                        <p className="mt-1 text-lg font-black text-foreground">
                          {stats.words === 0 ? "0 sec" : stats.readingMinutes < 1 ? "< 1 min" : `${stats.readingMinutes.toFixed(1)} min`}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <h2 className="mb-4 text-2xl font-black tracking-tight text-foreground">When This Tool Is Useful</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  {
                    title: "SEO metadata",
                    text: "Track title and meta description length before publishing so snippets are not cut off in search results.",
                  },
                  {
                    title: "Social publishing",
                    text: "Check captions and post copy against platform limits without switching to a separate editor.",
                  },
                  {
                    title: "Forms and CMS fields",
                    text: "Validate summaries, bios, and product blurbs when a UI or CMS enforces strict maximum lengths.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl border border-border bg-background/60 p-4">
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <h2 className="mb-4 text-2xl font-black tracking-tight text-foreground">Common Character Limits</h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  ["Meta description", "About 150 to 160 characters"],
                  ["Meta title", "Usually 50 to 60 characters"],
                  ["Short bio field", "Often 80 to 160 characters"],
                  ["App or CMS excerpt", "Varies, but commonly 140 to 300 characters"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3">
                    <span className="font-semibold text-foreground">{label}</span>
                    <span className="text-sm text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="faq" className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Frequently Asked Questions</h2>
              <FaqItem
                q="What is the difference between characters and characters without spaces?"
                a="Characters includes every visible letter, number, symbol, line break, and space. Characters without spaces removes whitespace so you can measure the tighter content length."
              />
              <FaqItem
                q="How are words counted?"
                a="Words are counted by splitting the text on whitespace and ignoring empty gaps. This works well for normal writing, notes, and pasted editorial copy."
              />
              <FaqItem
                q="Can I use this for SEO titles and descriptions?"
                a="Yes. The custom limit field is useful for testing search snippet lengths before publishing metadata in your CMS or page builder."
              />
              <FaqItem
                q="Does the counter store my text anywhere?"
                a="No. Counting runs directly in your browser, so your text stays on your device while you work."
              />
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Share</h3>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy Link"}
                </button>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Use this page when you need a quick count for SEO snippets, captions, forms, or editorial QA.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-foreground">Related Tools</h3>
              <div className="space-y-2">
                {RELATED_TOOLS.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={getToolPath(tool.slug)}
                    className="group flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted"
                  >
                    <div className="mt-0.5 rounded-lg bg-sky-500/10 p-2 text-sky-600 dark:text-sky-400">
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{tool.title}</p>
                      <p className="text-xs leading-relaxed text-muted-foreground">{tool.benefit}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
