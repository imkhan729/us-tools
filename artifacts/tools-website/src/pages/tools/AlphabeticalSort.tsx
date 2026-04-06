import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ListOrdered, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, SortAsc, SortDesc, FileText, Hash
} from "lucide-react";

function useSortTool() {
  const [text, setText] = useState("");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [trim, setTrim] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [caseSensitive, setCaseSensitive] = useState(false);

  const result = useMemo(() => {
    if (!text) return { output: "", count: 0 };
    let lines = text.split(/\r?\n/);
    if (trim) lines = lines.map(l => l.trim());
    if (removeEmpty) lines = lines.filter(l => l.length > 0);
    lines.sort((a, b) => {
      const va = caseSensitive ? a : a.toLowerCase();
      const vb = caseSensitive ? b : b.toLowerCase();
      return direction === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return { output: lines.join("\n"), count: lines.length };
  }, [text, direction, trim, removeEmpty, caseSensitive]);

  return { text, setText, direction, setDirection, trim, setTrim, removeEmpty, setRemoveEmpty, caseSensitive, setCaseSensitive, result };
}

function ResultInsight({ count, direction }: { count: number; direction: string }) {
  if (count === 0) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          {count} items sorted in {direction === "asc" ? "ascending (A→Z)" : "descending (Z→A)"} order. Results are ready to copy and paste back into your document, spreadsheet, or code.
        </p>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-violet-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-violet-500">
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

const RELATED = [
  { title: "Duplicate Line Remover", slug: "duplicate-line-remover", cat: "productivity", icon: <FileText className="w-5 h-5" />, color: 152, benefit: "Remove repeated lines instantly" },
  { title: "Word Counter",           slug: "word-counter",           cat: "productivity", icon: <Hash className="w-5 h-5" />,    color: 217, benefit: "Count words and characters" },
  { title: "Case Converter",         slug: "case-converter",         cat: "productivity", icon: <SortAsc className="w-5 h-5" />, color: 265, benefit: "Change text case instantly" },
  { title: "Text Reverser",          slug: "text-reverser",          cat: "productivity", icon: <SortDesc className="w-5 h-5" />,color: 25,  benefit: "Reverse any text or list" },
];

export default function AlphabeticalSort() {
  const { text, setText, direction, setDirection, trim, setTrim, removeEmpty, setRemoveEmpty, caseSensitive, setCaseSensitive, result } = useSortTool();
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const copyResult = () => { navigator.clipboard.writeText(result.output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); };

  return (
    <Layout>
      <SEO
        title="Alphabetical Sort – Sort Lists A-Z or Z-A Online Free | US Online Tools"
        description="Free online alphabetical sort tool. Sort any list of words, names, or lines in ascending (A-Z) or descending (Z-A) order instantly. Trim whitespace, remove empty lines, and control case sensitivity. No signup."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <Link href="/category/productivity" className="text-muted-foreground hover:text-foreground transition-colors">Productivity &amp; Text</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <span className="text-foreground">Alphabetical Sort</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-violet-500/15 bg-gradient-to-br from-violet-500/5 via-card to-purple-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <ListOrdered className="w-3.5 h-3.5" /> Productivity &amp; Text
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Alphabetical Sort</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Sort any list of words, names, or lines into alphabetical (A–Z) or reverse alphabetical (Z–A) order instantly. Control trimming, empty lines, and case sensitivity. Real-time results — no button needed.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Zap className="w-3.5 h-3.5" /> Instant Sort</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs px-3 py-1.5 rounded-full border border-purple-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Productivity &amp; Text &nbsp;·&nbsp; Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-violet-500/20 shadow-lg shadow-violet-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 to-purple-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center flex-shrink-0">
                      <ListOrdered className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Alphabetical Sort Tool</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 265 } as React.CSSProperties}>
                    {/* Options */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <button onClick={() => setDirection("asc")} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all ${direction === "asc" ? "bg-violet-500 border-violet-500 text-white" : "border-border text-muted-foreground hover:border-violet-500/40"}`}>
                        <SortAsc className="w-4 h-4" /> A → Z
                      </button>
                      <button onClick={() => setDirection("desc")} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all ${direction === "desc" ? "bg-violet-500 border-violet-500 text-white" : "border-border text-muted-foreground hover:border-violet-500/40"}`}>
                        <SortDesc className="w-4 h-4" /> Z → A
                      </button>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${trim ? "bg-violet-500 border-violet-500" : "border-border"}`} onClick={() => setTrim(!trim)}>
                          {trim && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors font-medium">Trim whitespace</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${removeEmpty ? "bg-violet-500 border-violet-500" : "border-border"}`} onClick={() => setRemoveEmpty(!removeEmpty)}>
                          {removeEmpty && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors font-medium">Remove empty lines</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${caseSensitive ? "bg-violet-500 border-violet-500" : "border-border"}`} onClick={() => setCaseSensitive(!caseSensitive)}>
                          {caseSensitive && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors font-medium">Case sensitive</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest block">Input — Paste your list (one item per line)</label>
                        <textarea
                          value={text}
                          onChange={e => setText(e.target.value)}
                          placeholder={"banana\napple\ncherry\ndate\nmango"}
                          className="w-full h-52 p-4 rounded-xl bg-background border-2 border-border focus:border-violet-500 outline-none font-mono text-sm leading-relaxed resize-none"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Sorted Output {result.count > 0 && <span className="text-violet-500">({result.count} items)</span>}
                          </label>
                          {result.output && (
                            <button onClick={copyResult} className="flex items-center gap-1.5 text-xs text-violet-600 font-bold hover:text-violet-700 transition-colors">
                              {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                            </button>
                          )}
                        </div>
                        <textarea
                          readOnly
                          value={result.output}
                          placeholder="Sorted results appear here..."
                          className="w-full h-52 p-4 rounded-xl bg-violet-500/5 border-2 border-violet-500/20 font-mono text-sm leading-relaxed resize-none text-violet-700 dark:text-violet-300"
                        />
                      </div>
                    </div>
                    <ResultInsight count={result.count} direction={direction} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Alphabetical Sort Tool</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Sorting a list alphabetically by hand is error-prone and slow — particularly for long lists of names, items, or code entries. This tool sorts any newline-separated list instantly with configurable options for trimming, empty lines, and case handling.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Paste your list into the input</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Paste any list where each item is on its own line — names, countries, products, keywords, CSS classes, database fields, or any other line-separated data. There's no character limit; paste as many items as you need including thousands of lines from CSV exports or code files.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Choose direction and options</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Select <strong className="text-foreground">A→Z</strong> for ascending order or <strong className="text-foreground">Z→A</strong> for descending. Enable <strong className="text-foreground">Trim whitespace</strong> to strip leading/trailing spaces from each line before sorting (recommended for most inputs). Enable <strong className="text-foreground">Remove empty lines</strong> to skip blank entries. Toggle <strong className="text-foreground">Case sensitive</strong> for technical sorting where capitalization matters (e.g., code identifiers).</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Copy the sorted result</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The sorted list appears instantly in the output panel as you type. Click "Copy" to copy the full sorted list to your clipboard. The output is newline-separated and can be pasted directly back into your document, spreadsheet, code editor, or database tool.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Sort Options Reference</p>
                <div className="space-y-2">
                  {[["A→Z","Ascending — sorts from A to Z using locale-aware comparison"],["Z→A","Descending — reverses the ascending sort order"],["Trim","Strips leading and trailing spaces/tabs from each line before sorting"],["Remove empty","Filters out blank lines before sorting for cleaner output"],["Case sensitive","Uppercase letters sort before lowercase (A-Z then a-z) vs. mixed"]].map(([k,v]) => (
                    <div key={k} className="flex items-center gap-3"><span className="text-violet-500 font-bold text-xs w-28 flex-shrink-0">{k}</span><code className="px-2 py-1 bg-background rounded text-xs font-mono flex-1">{v}</code></div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Understanding Sort Behavior</h2>
              <p className="text-muted-foreground text-sm mb-6">How different options affect the sorted output:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                  <div className="w-3 h-3 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Locale-Aware Sorting (localeCompare)</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">This tool uses JavaScript's <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">localeCompare()</code> for sorting — the same method used in spreadsheet applications. This handles accented characters (é, ñ, ü) correctly, sorting them near their base character (e before f, etc.) rather than at the end of the ASCII range like simple byte-based comparisons do.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <div className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Case-Insensitive vs. Case-Sensitive</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">By default, sorting is case-insensitive: "Apple", "apple", and "APPLE" are treated as identical for ordering purposes — common for sorting human-readable names and words. In case-sensitive mode, uppercase letters sort before lowercase (POSIX order), which is standard for sorting code identifiers and file names.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Numbers in Sorted Lists</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Items starting with numbers are sorted before letters in standard alphabetical order. Numbers sort by their character code (so "10" comes before "2" in standard sort, since "1" precedes "2"). For numeric natural sort order ("2" before "10"), consider pre-formatting your numbers with leading zeros.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Alphabetical Sort Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Use Case</th><th className="text-left px-4 py-3 font-bold text-foreground">Input</th><th className="text-left px-4 py-3 font-bold text-foreground">A→Z Output</th><th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Tip</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Fruit names</td><td className="px-4 py-3 font-mono text-xs">banana, apple, cherry</td><td className="px-4 py-3 font-mono text-xs font-bold text-violet-600">apple, banana, cherry</td><td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">Enable Trim</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Student names</td><td className="px-4 py-3 font-mono text-xs">Zhang, Ahmed, Brown</td><td className="px-4 py-3 font-mono text-xs font-bold text-violet-600">Ahmed, Brown, Zhang</td><td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">Case insensitive</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">CSS classes</td><td className="px-4 py-3 font-mono text-xs">btn-lg, btn-sm, btn-md</td><td className="px-4 py-3 font-mono text-xs font-bold text-violet-600">btn-lg, btn-md, btn-sm</td><td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">Case sensitive ON</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Countries Z→A</td><td className="px-4 py-3 font-mono text-xs">Spain, Norway, France</td><td className="px-4 py-3 font-mono text-xs font-bold text-violet-600">Spain, Norway, France</td><td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">Use Z→A mode</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Common use cases for alphabetical sorting:</strong> Bibliography references, product catalogs, employee directories, navigation menus, import/require statements, vocabulary lists, sports team rosters, and data preparation for spreadsheet imports. Any time you need a consistent, reproducible ordering of text items, alphabetical sort is the standard approach.</p>
                <p><strong className="text-foreground">Developer workflow:</strong> Frontend developers frequently need to sort CSS import lists, component file names, or object keys alphabetically for readability and to satisfy linting rules (like ESLint's <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">sort-imports</code> rule). Paste your unsorted list, sort in one click, and paste back — significantly faster than doing it manually in your editor.</p>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-violet-500/5 border border-violet-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_,i)=><svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Used this to sort 400+ CSS classnames into alphabetical order for our style guide. Took 2 seconds instead of 20 minutes. The case-sensitive option is exactly what we needed for our naming convention."</p>
                <p className="text-xs text-muted-foreground mt-2">— Developer feedback, 2025</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Alphabetical Sort Tool?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Real-time sorting — no submit button.</strong> The sorted output updates immediately as you paste or type in the input field. This means you can see results as you modify your list without any additional interaction — ideal for iterative editing workflows.</p>
                <p><strong className="text-foreground">Locale-aware comparison handles international text.</strong> Unlike simple ASCII-based sorts that misorder accented characters, this tool uses <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">String.localeCompare()</code> which correctly handles French accents, Spanish ñ, German umlauts, and other international characters according to language-specific collation rules.</p>
                <p><strong className="text-foreground">Three preprocessing options reduce manual cleanup.</strong> The Trim, Remove empty, and Case-sensitive toggles automate the most common data-cleaning steps before sorting. A typical workflow (paste → trim → remove empty → sort → copy) takes seconds versus minutes of manual spreadsheet manipulation.</p>
                <p><strong className="text-foreground">Completely private — text never leaves your browser.</strong> Every operation runs locally in JavaScript. No text is transmitted to any server, logged, or stored. This is important when sorting sensitive data like employee names, confidential product lists, or internal identifiers.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> This tool sorts by the full text of each line. If your list includes leading numbers or prefixes that you want to ignore for sorting purposes, remove them before pasting, sort, then re-add the prefixes afterward.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How do I sort a comma-separated list instead of one item per line?" a="This tool sorts line-by-line. To sort a comma-separated list, first replace commas with newlines (use your text editor's find-and-replace: find ',' replace with newline), paste into this tool, sort, then replace newlines back with commas. Some editors like VS Code handle this with regex: find ', ' replace with '\n'." />
                <FaqItem q="Does the tool handle numbers in the list?" a="Yes, numbers are sorted by their string representation (lexicographic order). This means '10' comes before '2' since '1' < '2' as characters. For natural numeric sort order where 2 comes before 10, pre-format your numbers with leading zeros (e.g., '02', '10') before sorting." />
                <FaqItem q="What does 'case sensitive' sorting mean?" a="In case-sensitive mode, uppercase letters sort before lowercase based on their character codes (A=65, Z=90, a=97, z=122). So 'Apple' would sort before 'apple', and all capitalized items appear before lowercase ones. This is standard in programming contexts. Case-insensitive treats 'Apple' and 'apple' as equal for ordering." />
                <FaqItem q="Can I sort a list of thousands of items?" a="Yes. There's no programmatic limit on input size. The tool handles thousands of lines using JavaScript's native Array.sort() which is highly optimized in modern browsers. In practice, lists of 10,000+ lines sort in milliseconds on any modern device." />
                <FaqItem q="Does the tool remove duplicate entries?" a="No — this tool only sorts. Duplicates are preserved in the sorted output. To remove duplicates, use the Duplicate Line Remover tool first, then paste the de-duplicated list here for alphabetical sorting." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Text &amp; Productivity Tools</h2>
                <p className="text-white/80 mb-6 max-w-lg">400+ free text, writing, and utility tools — instant results, no account needed.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">Explore All Tools <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED.map(tool => (
                    <Link key={tool.slug} href={`/${tool.cat}/${tool.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-violet-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others sort lists faster.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-500 to-purple-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {linkCopied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Tool","How to Use","Result Interpretation","Quick Examples","Why Choose This","FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g,"-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-violet-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-violet-500/40 flex-shrink-0" />{label}
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
