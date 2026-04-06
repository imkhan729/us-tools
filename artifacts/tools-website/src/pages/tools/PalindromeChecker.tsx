import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getToolPath } from "@/data/tools";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Lock,
  Shield,
  Smartphone,
  Sparkles,
  Type,
  X,
} from "lucide-react";

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

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
          className="flex-shrink-0 text-rose-500"
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

const EXAMPLES = [
  "racecar",
  "Never odd or even",
  "A man, a plan, a canal: Panama!",
  "Was it a car or a cat I saw?",
];

const RELATED_TOOLS = [
  { title: "Character Counter Tool", slug: "character-counter-tool", benefit: "Count letters, words, and limits" },
  { title: "Text Reverser", slug: "text-reverser", benefit: "Reverse text instantly" },
  { title: "Case Converter", slug: "case-converter", benefit: "Clean up letter casing" },
  { title: "Word Counter", slug: "word-counter", benefit: "Analyze text length and reading time" },
];

export default function PalindromeChecker() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const analysis = useMemo(() => {
    const trimmed = input.trim();
    const normalized = normalizeText(trimmed);
    const reversed = normalized.split("").reverse().join("");
    const isPalindrome = normalized.length > 0 && normalized === reversed;

    return {
      normalized,
      reversed,
      isPalindrome,
      rawLength: trimmed.length,
      filteredLength: normalized.length,
      ignoredCharacters: Math.max(trimmed.length - normalized.length, 0),
    };
  }, [input]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Palindrome Checker - Check Words and Phrases Online"
        description="Free online palindrome checker. Test whether a word or phrase reads the same forwards and backwards after removing spaces and punctuation."
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center text-sm font-bold uppercase tracking-wider">
          <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="mx-2 h-4 w-4 text-rose-500" strokeWidth={3} />
          <Link href="/category/productivity" className="text-muted-foreground transition-colors hover:text-foreground">
            Productivity &amp; Text
          </Link>
          <ChevronRight className="mx-2 h-4 w-4 text-rose-500" strokeWidth={3} />
          <span className="text-foreground">Palindrome Checker</span>
        </nav>

        <section className="mb-10 overflow-hidden rounded-2xl border border-rose-500/15 bg-gradient-to-br from-rose-500/5 via-card to-orange-500/5 px-8 py-10 md:px-12 md:py-14">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            <Type className="h-3.5 w-3.5" /> Productivity &amp; Text
          </div>
          <h1 className="mb-4 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-foreground md:text-6xl">
            Palindrome Checker
          </h1>
          <p className="mb-6 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
            Check whether a word, sentence, or phrase reads the same forwards and backwards. This checker ignores spaces,
            punctuation, and letter casing so you can test real phrases instead of only single words.
          </p>
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <BadgeCheck className="h-3.5 w-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
              <Sparkles className="h-3.5 w-3.5" /> Instant Check
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-500/20 bg-slate-500/10 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
              <Lock className="h-3.5 w-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold text-violet-600 dark:text-violet-400">
              <Shield className="h-3.5 w-3.5" /> Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400">
              <Smartphone className="h-3.5 w-3.5" /> Mobile Ready
            </span>
          </div>
          <p className="text-xs font-medium text-muted-foreground/70">
            Category: Productivity &amp; Text · Phrase-safe normalization · Updated March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          <div className="space-y-10 lg:col-span-3">
            <section>
              <div className="overflow-hidden rounded-2xl border border-rose-500/20 shadow-lg shadow-rose-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 to-orange-400" />
                <div className="space-y-6 bg-card p-6 md:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-400">
                      <Type className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Palindrome Test</p>
                      <p className="text-sm text-muted-foreground">Paste text, then review the cleaned comparison below.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Text</label>
                    <textarea
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      placeholder="Try: Never odd or even"
                      className="tool-calc-input min-h-[180px] w-full resize-none text-sm leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {EXAMPLES.map((example) => (
                      <button
                        key={example}
                        onClick={() => setInput(example)}
                        className="rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-500/15 dark:text-rose-400"
                      >
                        {example}
                      </button>
                    ))}
                  </div>

                  {input.trim() ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                      <div
                        className={`rounded-2xl border p-5 ${
                          analysis.isPalindrome
                            ? "border-emerald-500/25 bg-emerald-500/8"
                            : "border-amber-500/25 bg-amber-500/8"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl ${
                              analysis.isPalindrome ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                            }`}
                          >
                            {analysis.isPalindrome ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                          </div>
                          <div>
                            <h2 className="text-xl font-black text-foreground">
                              {analysis.isPalindrome ? "Yes, this is a palindrome." : "No, this is not a palindrome."}
                            </h2>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                              The checker compares only letters and numbers. Spaces, punctuation, and uppercase letters are ignored.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-border bg-background/70 p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Original Length</p>
                          <p className="mt-2 text-3xl font-black text-foreground">{analysis.rawLength}</p>
                        </div>
                        <div className="rounded-xl border border-border bg-background/70 p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Checked Characters</p>
                          <p className="mt-2 text-3xl font-black text-foreground">{analysis.filteredLength}</p>
                        </div>
                        <div className="rounded-xl border border-border bg-background/70 p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ignored Characters</p>
                          <p className="mt-2 text-3xl font-black text-foreground">{analysis.ignoredCharacters}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-xl border border-border bg-card p-4">
                          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Normalized Text</p>
                          <div className="rounded-lg bg-muted/60 p-3 font-mono text-sm text-foreground break-all">
                            {analysis.normalized || "-"}
                          </div>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-4">
                          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Reversed Normalized Text</p>
                          <div className="rounded-lg bg-muted/60 p-3 font-mono text-sm text-foreground break-all">
                            {analysis.reversed || "-"}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <h2 className="mb-4 text-2xl font-black tracking-tight text-foreground">How This Checker Works</h2>
              <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
                <p>
                  The checker first normalizes your text by converting it to lowercase and removing everything except letters and
                  numbers. That means phrases like "Never odd or even" still pass because the comparison happens against the cleaned
                  version, not the raw spacing or punctuation.
                </p>
                <p>
                  After normalization, the tool reverses the cleaned string and compares it character by character. If both versions
                  match exactly, the phrase is a palindrome. If they differ at any position, the phrase fails the test.
                </p>
                <p>
                  This approach is useful for language puzzles, classroom exercises, code challenges, and quick content checks where
                  manual cleanup is repetitive and error-prone.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <h2 className="mb-6 text-2xl font-black tracking-tight text-foreground">Common Palindrome Use Cases</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Language puzzles",
                    text: "Check candidate phrases quickly when writing riddles, games, or classroom exercises.",
                  },
                  {
                    title: "Programming practice",
                    text: "Verify sample inputs while building palindrome logic in JavaScript, Python, or interview prep problems.",
                  },
                  {
                    title: "Content cleanup",
                    text: "Test phrases without manually stripping commas, spaces, apostrophes, or mixed capitalization first.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl border border-border bg-background/60 p-4">
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="faq" className="space-y-4">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Frequently Asked Questions</h2>
              <FaqItem
                q="Does the palindrome checker ignore spaces and punctuation?"
                a="Yes. The checker removes spaces, punctuation, and symbols before testing. It also compares in lowercase, so uppercase and lowercase letters are treated the same."
              />
              <FaqItem
                q="Can I test full sentences, not just single words?"
                a="Yes. The tool is built for words, phrases, and longer sentences. As long as the cleaned string reads the same in reverse, it will count as a palindrome."
              />
              <FaqItem
                q="Why did my phrase fail even though it looks symmetric?"
                a="Usually one extra letter, digit, or typo breaks the mirror pattern. Check the normalized text and reversed normalized text panels to see exactly where they differ."
              />
              <FaqItem
                q="Does this tool send my text to a server?"
                a="No. The check runs in your browser, so your text stays local on your device while you test it."
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
                Share this page with students, puzzle creators, or developers who need a quick phrase-safe palindrome test.
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
                    <div className="mt-0.5 rounded-lg bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400">
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
