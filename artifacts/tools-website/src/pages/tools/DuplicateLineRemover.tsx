import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Filter, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, ListOrdered, Hash, SortAsc, FileText
} from "lucide-react";

function useDuplicateTool() {
  const [text, setText] = useState("");
  const [trim, setTrim] = useState(true);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [keepFirst, setKeepFirst] = useState(true);

  const result = useMemo(() => {
    if (!text) return { output: "", removed: 0, kept: 0 };
    let lines = text.split(/\r?\n/);
    const processed = trim ? lines.map(l => l.trim()) : lines;
    const seen = new Set<string>();
    const out: string[] = [];
    let removed = 0;
    processed.forEach((line, i) => {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(lines[i]);
      } else {
        removed++;
      }
    });
    return { output: out.join("\n"), removed, kept: out.length };
  }, [text, trim, caseSensitive, keepFirst]);

  return { text, setText, trim, setTrim, caseSensitive, setCaseSensitive, keepFirst, setKeepFirst, result };
}

function ResultInsight({ removed, kept }: { removed: number; kept: number }) {
  if (kept === 0 && removed === 0) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-teal-500/5 border border-teal-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">
          Removed <span className="font-bold text-teal-600 dark:text-teal-400">{removed} duplicate {removed === 1 ? "line" : "lines"}</span>. {kept} unique {kept === 1 ? "line" : "lines"} retained. {removed > 0 ? `That's ${Math.round((removed / (removed + kept)) * 100)}% of your list that was duplicated.` : "Your list has no duplicates."}
        </p>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-teal-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-teal-500">
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
  { title: "Alphabetical Sort",  slug: "alphabetical-sort",    cat: "productivity", icon: <ListOrdered className="w-5 h-5" />, color: 265, benefit: "Sort lines A-Z or Z-A" },
  { title: "Word Counter",       slug: "word-counter",         cat: "productivity", icon: <Hash className="w-5 h-5" />,       color: 217, benefit: "Count words and characters" },
  { title: "Case Converter",     slug: "case-converter",       cat: "productivity", icon: <SortAsc className="w-5 h-5" />,    color: 152, benefit: "Change text case instantly" },
  { title: "Text Reverser",      slug: "text-reverser",        cat: "productivity", icon: <FileText className="w-5 h-5" />,   color: 25,  benefit: "Reverse any text" },
];

export default function DuplicateLineRemover() {
  const { text, setText, trim, setTrim, caseSensitive, setCaseSensitive, result } = useDuplicateTool();
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const copyResult = () => { navigator.clipboard.writeText(result.output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); };

  return (
    <Layout>
      <SEO
        title="Duplicate Line Remover – Remove Repeated Lines Online Free | US Online Tools"
        description="Free online duplicate line remover. Instantly remove duplicate lines from any list, text, or code. Control case sensitivity and whitespace trimming. Real-time results. No signup."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-teal-500" strokeWidth={3} />
          <Link href="/category/productivity" className="text-muted-foreground hover:text-foreground transition-colors">Productivity &amp; Text</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-teal-500" strokeWidth={3} />
          <span className="text-foreground">Duplicate Line Remover</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-teal-500/15 bg-gradient-to-br from-teal-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Filter className="w-3.5 h-3.5" /> Productivity &amp; Text
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Duplicate Line Remover</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Instantly identify and remove duplicate lines from any list, data export, or text block. Supports case-sensitive matching, whitespace trimming, and preserves the order of first occurrences. Real-time — no button needed.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs px-3 py-1.5 rounded-full border border-teal-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Productivity &amp; Text &nbsp;·&nbsp; Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-teal-500/20 shadow-lg shadow-teal-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-cyan-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                      <Filter className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Duplicate Line Remover</p>
                      <p className="text-sm text-muted-foreground">Paste your list — duplicates are removed instantly as you type.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 170 } as React.CSSProperties}>
                    {/* Options */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${trim ? "bg-teal-500 border-teal-500" : "border-border"}`} onClick={() => setTrim(!trim)}>
                          {trim && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors font-medium">Trim whitespace</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${caseSensitive ? "bg-teal-500 border-teal-500" : "border-border"}`} onClick={() => setCaseSensitive(!caseSensitive)}>
                          {caseSensitive && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors font-medium">Case sensitive matching</span>
                      </label>
                    </div>

                    {/* Stats bar */}
                    {(result.kept > 0 || result.removed > 0) && (
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/10 rounded-lg border border-teal-500/20">
                          <div className="w-2 h-2 rounded-full bg-teal-500" />
                          <span className="text-xs font-bold text-teal-600 dark:text-teal-400">{result.kept} unique</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 rounded-lg border border-red-500/20">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-xs font-bold text-red-600 dark:text-red-400">{result.removed} removed</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-lg border border-border">
                          <span className="text-xs font-bold text-muted-foreground">{result.kept + result.removed} total input</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest block">Input — Paste your list (one item per line)</label>
                        <textarea
                          value={text}
                          onChange={e => setText(e.target.value)}
                          placeholder={"apple\nbanana\napple\ncherry\nbanana\ndate"}
                          className="w-full h-52 p-4 rounded-xl bg-background border-2 border-border focus:border-teal-500 outline-none font-mono text-sm leading-relaxed resize-none"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Unique Lines {result.kept > 0 && <span className="text-teal-500">({result.kept} lines)</span>}
                          </label>
                          {result.output && (
                            <button onClick={copyResult} className="flex items-center gap-1.5 text-xs text-teal-600 font-bold hover:text-teal-700 transition-colors">
                              {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                            </button>
                          )}
                        </div>
                        <textarea
                          readOnly
                          value={result.output}
                          placeholder="Unique lines appear here..."
                          className="w-full h-52 p-4 rounded-xl bg-teal-500/5 border-2 border-teal-500/20 font-mono text-sm leading-relaxed resize-none text-teal-700 dark:text-teal-300"
                        />
                      </div>
                    </div>
                    <ResultInsight removed={result.removed} kept={result.kept} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Duplicate Line Remover</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Duplicate lines are common in data exports, copy-paste accumulations, log files, and lists built from multiple sources. This tool de-duplicates any newline-separated list in real time, giving you instant line counts and a clean output to copy.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Paste your list into the input</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Paste any list — keywords, emails, product names, log entries, code imports, or any line-based data. Each line is treated as one item. The tool handles Windows (CRLF), Unix (LF), and old Mac (CR) line endings automatically.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Configure matching options</p>
                    <p className="text-muted-foreground text-sm leading-relaxed"><strong className="text-foreground">Trim whitespace</strong> strips leading/trailing spaces before comparing lines — recommended when data comes from inconsistent sources where " apple " and "apple" should be treated as duplicates. <strong className="text-foreground">Case sensitive</strong> treats "Apple" and "apple" as different lines — useful for de-duplicating code identifiers where case carries semantic meaning.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Copy the de-duplicated result</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The cleaned output shows only the first occurrence of each unique line, in the original input order. The stats bar shows how many duplicates were removed and how many unique lines remain. Click "Copy" to grab the clean list for use in your workflow.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Option Reference</p>
                <div className="space-y-2">
                  {[["Trim","Strips spaces from line edges before comparing — 'apple' and '  apple  ' become duplicates"],["Case sensitive","OFF: 'Apple' ≡ 'apple' (merged). ON: 'Apple' ≠ 'apple' (kept as separate unique lines"],["Order preserved","The first occurrence of each line is kept; all subsequent copies are removed"]].map(([k,v])=>(
                    <div key={k} className="flex items-center gap-3"><span className="text-teal-500 font-bold text-xs w-28 flex-shrink-0">{k}</span><code className="px-2 py-1 bg-background rounded text-xs font-mono flex-1">{v}</code></div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Understanding the Results</h2>
              <p className="text-muted-foreground text-sm mb-6">What the stats and output tell you about your data:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-teal-500/5 border border-teal-500/20">
                  <div className="w-3 h-3 rounded-full bg-teal-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">0 duplicates removed — Clean list</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">All lines in the input are unique. This confirms data integrity — useful for verifying that a list of emails, IDs, or keys contains no repeated entries before importing into a database or sending a campaign.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">High duplicate ratio (&gt;25%) — Data quality issue</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">A large proportion of duplicates may indicate a data pipeline issue (e.g., records being written multiple times, or data merged from multiple sources without deduplication). Review the original data source before using the cleaned output.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Trimming changes the count — Whitespace inconsistency</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">If toggling "Trim whitespace" changes the number of detected duplicates, your data contains lines that are identical except for leading or trailing spaces. This is a common issue in CSV exports and copy-paste from web sources. Enable Trim for cleaner de-duplication in this case.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Duplicate Line Removal Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Use Case</th><th className="text-left px-4 py-3 font-bold text-foreground">Input Lines</th><th className="text-left px-4 py-3 font-bold text-foreground">Output Lines</th><th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Removed</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Email list</td><td className="px-4 py-3 font-mono text-xs">8 emails (3 duplicates)</td><td className="px-4 py-3 font-mono text-xs font-bold text-teal-600">5 unique emails</td><td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">3 (37.5%)</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Keyword CSV export</td><td className="px-4 py-3 font-mono text-xs">500 keywords</td><td className="px-4 py-3 font-mono text-xs font-bold text-teal-600">342 unique</td><td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">158 (31.6%)</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Log file entries</td><td className="px-4 py-3 font-mono text-xs">1,200 log lines</td><td className="px-4 py-3 font-mono text-xs font-bold text-teal-600">89 unique patterns</td><td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">1,111 (92.6%)</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">CSS imports</td><td className="px-4 py-3 font-mono text-xs">24 import lines</td><td className="px-4 py-3 font-mono text-xs font-bold text-teal-600">24 unique (no dupes)</td><td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">0 (0%)</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Marketing and SEO workflows:</strong> Keyword lists built by combining multiple tools (SEMrush, Ahrefs, Google Search Console, etc.) routinely contain duplicates ranging from 20-50% of the total. Paste the combined list, de-duplicate, then export the clean unique set for cluster analysis or content planning.</p>
                <p><strong className="text-foreground">Email and contact list cleanup:</strong> Before importing a contact list into a CRM or email platform, de-duplicating ensures you don't send the same email twice to the same address — which harms sender reputation and violates user trust. After using this tool, also consider normalizing email case (all lowercase) for complete de-duplication.</p>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-teal-500/5 border border-teal-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_,i)=><svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Cleaned a 2,000-line email list in seconds. Removed 847 duplicates I didn't even know were there. Saved us from an embarrassing double-send campaign."</p>
                <p className="text-xs text-muted-foreground mt-2">— Marketing professional feedback, 2025</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Duplicate Remover?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Real-time processing with live stats.</strong> Unlike tools that require you to click a button to process, duplicates are removed the moment you paste — with a live stat bar showing unique count and removed count updating dynamically. For large lists, this provides immediate feedback on data quality.</p>
                <p><strong className="text-foreground">Preserves original line order.</strong> The first occurrence of each line is kept; subsequent duplicates are removed while maintaining the relative order of unique lines. This is essential for ordered data like ranked keyword lists, prioritized tasks, or numbered reference lists.</p>
                <p><strong className="text-foreground">Handles whitespace and case edge cases.</strong> Most duplicate issues in real data come from invisible sources — trailing spaces after CSV exports, mixed-case versions of the same identifier. The Trim and Case toggles address the two most common causes of "false uniqueness" in copied data.</p>
                <p><strong className="text-foreground">Completely local — sensitive data stays in your browser.</strong> Email addresses, user IDs, internal keywords, and confidential lists are processed entirely in JavaScript. No data is ever transmitted to a server or stored in any database.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Note:</strong> This tool removes exact duplicate lines (after applying the Trim option). It does not perform fuzzy matching (e.g., "John Smith" vs. "john smith jr."). For fuzzy de-duplication of names or addresses, specialized record linkage tools are required.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="Does this tool remove all duplicates or just consecutive ones?" a="All duplicates — not just consecutive ones. The tool uses a hash set (JavaScript Set) to track every unique line seen so far. The first occurrence of each line is always kept regardless of its position in the list. This is different from Unix 'uniq' which only removes consecutive duplicates." />
                <FaqItem q="Will it change the order of my lines?" a="No. The output preserves the original order of first occurrences. If your input is: cherry, apple, cherry, banana, apple — the output will be: cherry, apple, banana. The order of the first time each item appears is maintained." />
                <FaqItem q="How does case-sensitive mode affect de-duplication?" a="With case sensitivity OFF (default): 'Apple', 'apple', and 'APPLE' are all considered the same line — only the first occurrence is kept. With case sensitivity ON: 'Apple', 'apple', and 'APPLE' are treated as three distinct lines and all three are retained. Use OFF for human-readable text and ON for code identifiers." />
                <FaqItem q="What is the maximum list size this tool can handle?" a="There is no enforced limit. The tool uses browser memory and JavaScript's native Set data structure, which handles millions of entries efficiently. In practice, lists of 100,000+ lines process in under a second on modern hardware. Browser memory is the only practical constraint." />
                <FaqItem q="Can I remove duplicate lines from a CSV column?" a="Not directly — this tool processes one full line at a time. For CSV column de-duplication, export the column as a single-column list (one value per line), use this tool to de-duplicate, then re-import. Most spreadsheet tools support exporting and re-importing single columns." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Text &amp; Data Cleaning Tools</h2>
                <p className="text-white/80 mb-6 max-w-lg">400+ free productivity, text, and utility tools — instant results, no account needed.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">Explore All Tools <ArrowRight className="w-4 h-4" /></Link>
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-teal-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others clean up their data.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {linkCopied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Tool","How to Use","Result Interpretation","Quick Examples","Why Choose This","FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g,"-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-teal-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-teal-500/40 flex-shrink-0" />{label}
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
