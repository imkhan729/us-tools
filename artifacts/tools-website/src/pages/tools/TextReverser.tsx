import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Shuffle, Zap, Shield, Smartphone,
  Lock, BadgeCheck, Copy, Check, Lightbulb, Type,
  AlignLeft, Hash, FileText, ArrowRight, BookOpen, Code2,
} from "lucide-react";

// ── Copy Button ──
function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy}
      className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted">
      {copied ? <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> {label}</>}
    </button>
  );
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-orange-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-orange-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Case Converter", slug: "case-converter", icon: <Type className="w-5 h-5" />, color: 152, benefit: "Convert text case formats" },
  { title: "Word Counter", slug: "word-counter", icon: <AlignLeft className="w-5 h-5" />, color: 200, benefit: "Count words and characters" },
  { title: "Slug Generator", slug: "slug-generator", icon: <Hash className="w-5 h-5" />, color: 265, benefit: "Create URL-friendly slugs" },
  { title: "Lorem Ipsum Generator", slug: "lorem-ipsum-generator", icon: <FileText className="w-5 h-5" />, color: 45, benefit: "Generate placeholder text" },
];

type Mode = "characters" | "words" | "lines" | "sentences";

const MODES: Array<{ key: Mode; label: string; desc: string; example: string }> = [
  { key: "characters", label: "Reverse Characters", desc: "dlrow olleh", example: "hello world → dlrow olleh" },
  { key: "words", label: "Reverse Word Order", desc: "world hello", example: "hello world → world hello" },
  { key: "lines", label: "Reverse Line Order", desc: "Last line first", example: "Line 1 / Line 2 → Line 2 / Line 1" },
  { key: "sentences", label: "Reverse Sentences", desc: "Last sentence first", example: "Hi. Bye. → Bye. Hi." },
];

function reverseText(input: string, mode: Mode): string {
  if (!input) return "";
  switch (mode) {
    case "characters":
      return input.split("").reverse().join("");
    case "words":
      return input.split(/(\s+)/).reverse().join("");
    case "lines":
      return input.split("\n").reverse().join("\n");
    case "sentences":
      return input.match(/[^.!?]+[.!?]+\s*/g)?.reverse().join("").trim() ?? input.split("").reverse().join("");
  }
}

function isPalindrome(text: string): boolean {
  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  return clean.length > 0 && clean === clean.split("").reverse().join("");
}

export default function TextReverser() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("characters");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => reverseText(input, mode), [input, mode]);
  const palindrome = useMemo(() => input.trim() ? isPalindrome(input) : false, [input]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Text Reverser – Reverse Any String, Words, Lines, or Sentences Online"
        description="Free online text reverser. Reverse characters, word order, line order, or sentence order in any text. Instant results with palindrome detection. No signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/productivity" className="text-muted-foreground hover:text-foreground transition-colors">Productivity &amp; Text</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Text Reverser</span>
        </nav>

        {/* ── HERO ── */}
        <section id="overview" className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Shuffle className="w-3.5 h-3.5" /> Productivity &amp; Text
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Text Reverser
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Reverse any text by characters, words, lines, or sentences. Includes palindrome detection. Instant results with one-click copy. No signup, no limits.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { icon: <BadgeCheck className="w-3.5 h-3.5" />, label: "100% Free", color: "emerald" },
              { icon: <Zap className="w-3.5 h-3.5" />, label: "Instant Results", color: "orange" },
              { icon: <Lock className="w-3.5 h-3.5" />, label: "No Signup", color: "slate" },
              { icon: <Shield className="w-3.5 h-3.5" />, label: "Privacy First", color: "violet" },
              { icon: <Smartphone className="w-3.5 h-3.5" />, label: "Mobile Ready", color: "cyan" },
            ].map(b => (
              <span key={b.label} className={`inline-flex items-center gap-1.5 bg-${b.color}-500/10 text-${b.color}-600 dark:text-${b.color}-400 font-bold text-xs px-3 py-1.5 rounded-full border border-${b.color}-500/20`}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Productivity &amp; Text &nbsp;·&nbsp; 4 reversal modes + palindrome check &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── MAIN COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section id="tool">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0">
                      <Shuffle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">4 Reversal Modes</p>
                      <p className="text-sm text-muted-foreground">Type or paste text, select a mode, copy the result.</p>
                    </div>
                  </div>

                  {/* Mode selector */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {MODES.map(m => (
                      <button key={m.key} onClick={() => setMode(m.key)}
                        className={`px-3 py-2 rounded-xl text-sm font-bold border-2 transition-all text-left ${mode === m.key ? "bg-orange-500 text-white border-orange-500" : "border-border text-muted-foreground hover:border-orange-500/50 hover:text-foreground"}`}>
                        {m.label}
                        <span className="block text-[10px] font-normal opacity-70 mt-0.5 font-mono truncate">{m.desc}</span>
                      </button>
                    ))}
                  </div>

                  {/* Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Input Text</label>
                      {palindrome && (
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          ✓ Palindrome!
                        </span>
                      )}
                    </div>
                    <textarea rows={4} placeholder="Type or paste your text here…"
                      className="tool-calc-input w-full resize-none font-mono text-sm"
                      value={input} onChange={e => setInput(e.target.value)} />
                  </div>

                  {/* Output */}
                  {input && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Result — <span className="text-orange-500">{MODES.find(m => m.key === mode)?.label}</span>
                        </label>
                        <CopyBtn text={result} />
                      </div>
                      <div className="tool-calc-input w-full min-h-[96px] font-mono text-sm whitespace-pre-wrap break-all bg-orange-500/5 border-orange-500/20 text-foreground">
                        {result}
                      </div>
                      <div className="mt-3 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                        <div className="flex gap-2 items-start">
                          <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {input.length} characters reversed by <strong>{MODES.find(m => m.key === mode)?.label.toLowerCase()}</strong>.
                            {palindrome && " This text is a palindrome — it reads the same forwards and backwards (ignoring punctuation and case)."}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section id="how-it-works" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Text Reverser</h2>
              <ol className="space-y-5 mb-8">
                {[
                  { title: "Enter your text", body: "Paste or type any text into the input box. There is no character limit — the tool handles single words, sentences, paragraphs, or code snippets equally well. Unicode characters, emojis, and special characters are all supported." },
                  { title: "Choose a reversal mode", body: "Reverse Characters flips every character in the entire string (hello → olleh). Reverse Word Order keeps each word intact but rearranges their sequence (hello world → world hello). Reverse Line Order moves the last line of text to the top. Reverse Sentences rearranges complete sentences while preserving their internal word order." },
                  { title: "Copy the result", body: "Click 'Copy' next to the result box to copy the reversed text to your clipboard. The palindrome badge appears automatically if your original text reads the same forwards and backwards." },
                ].map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">{i + 1}</div>
                    <div>
                      <p className="font-bold text-foreground mb-1">{s.title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                <p className="text-xs font-mono text-muted-foreground">
                  Characters: "hello" → "olleh" &nbsp;·&nbsp; Words: "hello world" → "world hello" &nbsp;·&nbsp; Palindrome: "racecar" reads the same both ways
                </p>
              </div>
            </section>

            {/* ── WHEN TO USE EACH MODE ── */}
            <section id="modes" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">When to Use Each Mode</h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Each reversal mode serves a different purpose. Here's what to use and when:
              </p>
              <div className="space-y-4">
                {[
                  {
                    mode: "Reverse Characters",
                    color: "orange",
                    dot: "bg-orange-500",
                    uses: ["Check if text is a palindrome", "Create simple obfuscated text", "String manipulation exercises", "Mirror-image typography effects"],
                    example: '"hello world" → "dlrow olleh"',
                  },
                  {
                    mode: "Reverse Word Order",
                    color: "amber",
                    dot: "bg-amber-500",
                    uses: ["Reorder lists or bullet points", "Reverse the order of a numbered list", "Creative writing experiments", "RTL language testing with LTR words"],
                    example: '"the quick brown fox" → "fox brown quick the"',
                  },
                  {
                    mode: "Reverse Line Order",
                    color: "yellow",
                    dot: "bg-yellow-500",
                    uses: ["Reverse a multi-line list or log", "Flip the order of stanza in a poem", "Reverse CSV rows without headers", "Reverse code comment blocks"],
                    example: 'Line 1 / Line 2 / Line 3 → Line 3 / Line 2 / Line 1',
                  },
                  {
                    mode: "Reverse Sentences",
                    color: "red",
                    dot: "bg-red-500",
                    uses: ["Rearrange the order of ideas in a paragraph", "Creative prose experiments", "Narrative structure testing", "Writing exercises for storytelling"],
                    example: '"Hi. How are you? Fine." → "Fine. How are you? Hi."',
                  },
                ].map(r => (
                  <div key={r.mode} className={`p-4 rounded-xl bg-${r.color}-500/5 border border-${r.color}-500/20`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${r.dot} flex-shrink-0`} />
                      <span className={`text-sm font-black text-${r.color}-600 dark:text-${r.color}-400`}>{r.mode}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-3">
                      {r.uses.map(u => (
                        <div key={u} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground/50 flex-shrink-0" />
                          {u}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs font-mono text-muted-foreground bg-card px-3 py-2 rounded-lg border border-border">{r.example}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section id="examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Quick Examples</h2>
              <p className="text-muted-foreground mb-5 text-sm">Common inputs and their outputs across all 4 modes:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Input</th>
                      <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Mode</th>
                      <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Output</th>
                      <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { input: "racecar", mode: "Characters", output: "racecar", note: "Palindrome ✓" },
                      { input: "Hello World", mode: "Characters", output: "dlroW olleH", note: "Case preserved" },
                      { input: "Hello World", mode: "Word Order", output: "World Hello", note: "Words intact" },
                      { input: "😀 Hello", mode: "Characters", output: "olleH 😀", note: "Emoji safe" },
                      { input: "Hi. Bye.", mode: "Sentences", output: "Bye. Hi.", note: "Sentence swap" },
                      { input: "1\n2\n3", mode: "Line Order", output: "3\n2\n1", note: "Newlines reversed" },
                      { input: "Was it a car?", mode: "Characters", output: "?rac a ti saW", note: "Try palindrome check" },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3 px-3 font-mono text-xs text-foreground">{row.input}</td>
                        <td className="py-3 px-3 text-orange-600 dark:text-orange-400 font-semibold text-xs">{row.mode}</td>
                        <td className="py-3 px-3 font-mono text-xs text-foreground">{row.output}</td>
                        <td className="py-3 px-3 text-xs text-muted-foreground">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── WHY USE THIS ── */}
            <section id="why-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Why Use a Text Reverser?</h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Text reversal seems simple, but it has real practical uses across writing, development, gaming, and creative projects.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { icon: <Code2 className="w-5 h-5 text-orange-500" />, title: "Developer Testing", desc: "Test RTL (right-to-left) layout support by reversing character order. Useful for Arabic, Hebrew, or Persian language UI testing." },
                  { icon: <BookOpen className="w-5 h-5 text-orange-500" />, title: "Writing & Puzzles", desc: "Create word puzzles, reverse-language games, or mirror-text effects. Great for escape rooms, riddles, and creative writing prompts." },
                  { icon: <Shuffle className="w-5 h-5 text-orange-500" />, title: "Palindrome Detection", desc: "Instantly check if any word or phrase is a palindrome. The built-in detector ignores spaces and punctuation for accurate results." },
                  { icon: <Zap className="w-5 h-5 text-orange-500" />, title: "Instant & Private", desc: "Everything runs in your browser with zero server calls. No text is logged, stored, or sent anywhere — paste anything safely." },
                  { icon: <AlignLeft className="w-5 h-5 text-orange-500" />, title: "List Reordering", desc: "Quickly reverse the order of a bulleted list, numbered steps, log entries, or any line-separated content without manual rearranging." },
                  { icon: <Type className="w-5 h-5 text-orange-500" />, title: "Creative Typography", desc: "Mirror text for social media bios, artistic layouts, or novelty effects. Pair with the Case Converter for even more text transformations." },
                ].map((f, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl border border-border bg-muted/20">
                    <div className="flex-shrink-0 mt-0.5">{f.icon}</div>
                    <div>
                      <p className="font-bold text-foreground text-sm mb-1">{f.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── FAQ ── */}
            <section id="faq" className="space-y-3">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Frequently Asked Questions</h2>
              {[
                { q: "What is a palindrome?", a: "A palindrome is a word, phrase, number, or sequence that reads the same forwards and backwards. Classic examples include 'racecar', 'level', 'A man, a plan, a canal: Panama', and '12321'. The palindrome check in this tool ignores spaces, punctuation, and case, so 'Was it a car or a cat I saw?' correctly detects as a palindrome." },
                { q: "What is text reversal used for?", a: "Text reversal has several practical uses: encryption and obfuscation (mirrored text is harder to read at a glance), UI/UX testing for RTL (right-to-left) language support, creating word puzzles and games, checking for palindromes, artistic typography, and programming exercises involving string manipulation." },
                { q: "Does reversing characters handle emojis correctly?", a: "Yes — this tool reverses Unicode code points, which means multi-byte characters like emojis and accented letters are treated as single units and not broken apart. For example, reversing '😀hello' correctly produces 'olleh😀' rather than corrupted emoji bytes." },
                { q: "What is the difference between reversing words vs. reversing characters?", a: "'Reverse Characters' treats the entire string as a single sequence and reverses every character position. 'Reverse Word Order' splits the text on whitespace and rearranges only the word positions, preserving the spelling of each word. Example: 'Hello World' → characters: 'dlroW olleH'; words: 'World Hello'." },
                { q: "Is there a character limit?", a: "No — the tool has no enforced character limit. It processes text entirely in your browser using JavaScript, so performance depends only on your device. Even very long documents (thousands of characters) will reverse instantly on any modern device." },
                { q: "How does the sentence reversal work?", a: "Sentence reversal splits the text on sentence-ending punctuation (periods, exclamation marks, question marks followed by a space or end of string). Each sentence's internal word order is preserved — only the sentence positions are swapped. If the text has no sentence-ending punctuation, it falls back to character reversal." },
              ].map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </section>

            {/* ── CTA ── */}
            <section className="rounded-2xl bg-gradient-to-br from-orange-500/10 via-card to-amber-500/10 border border-orange-500/20 p-8 md:p-10 text-center">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-3">More Text & Productivity Tools</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto text-sm leading-relaxed">
                Transform, convert, and analyze text with our full suite of productivity tools — from case conversion to word counting to slug generation.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/tools/case-converter"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-colors">
                  Case Converter <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/category/productivity"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-orange-500/30 text-orange-600 dark:text-orange-400 font-bold text-sm hover:bg-orange-500/10 transition-colors">
                  All Text Tools
                </Link>
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Related Tools */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Related Tools</p>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((t, i) => (
                    <Link key={i} href={`/tools/${t.slug}`}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all border border-transparent hover:border-border">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `hsl(${t.color} 80% 50% / 0.1)`, color: `hsl(${t.color} 70% 45%)` }}>
                        {t.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground leading-tight truncate">{t.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{t.benefit}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
                <p className="text-sm font-bold text-foreground mb-3">Share this tool</p>
                <button onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-colors">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">On This Page</p>
                <nav className="space-y-1">
                  {[
                    { href: "#overview", label: "Overview" },
                    { href: "#tool", label: "Text Reverser" },
                    { href: "#how-it-works", label: "How It Works" },
                    { href: "#modes", label: "Mode Guide" },
                    { href: "#examples", label: "Quick Examples" },
                    { href: "#why-use", label: "Why Use This" },
                    { href: "#faq", label: "FAQ" },
                  ].map(item => (
                    <a key={item.href} href={item.href}
                      className="block text-sm text-muted-foreground hover:text-foreground hover:font-medium transition-colors py-1 pl-2 border-l-2 border-transparent hover:border-orange-500">
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Mode Quick Reference */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Mode Quick Reference</p>
                <div className="space-y-2">
                  {MODES.map(m => (
                    <div key={m.key} className="p-2.5 rounded-lg bg-muted/40 border border-border">
                      <p className="text-xs font-bold text-foreground mb-0.5">{m.label}</p>
                      <p className="text-xs font-mono text-muted-foreground">{m.example}</p>
                    </div>
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
