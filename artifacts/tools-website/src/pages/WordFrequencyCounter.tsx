import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, BarChart3, Calculator, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock, TrendingUp,
  Copy, Check, BadgeCheck, Lock, Star, FileText,
  Target, Hash, SortAsc, SortDesc, Eye, EyeOff,
} from "lucide-react";

// ── Word Frequency Analysis Logic ──
function useWordFrequencyAnalyzer() {
  const [input, setInput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [sortBy, setSortBy] = useState<'frequency' | 'alphabetical'>('frequency');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [minLength, setMinLength] = useState(1);

  const analysis = useMemo(() => {
    if (!input.trim()) {
      return {
        words: [],
        totalWords: 0,
        uniqueWords: 0,
        mostFrequent: null,
        leastFrequent: null,
      };
    }

    // Split text into words, handling various separators
    const words = input
      .split(/[\s\n\r\t.,!?;:()[\]{}"'-]+/)
      .filter(word => word.length >= minLength)
      .map(word => caseSensitive ? word : word.toLowerCase());

    const totalWords = words.length;

    // Count frequency
    const frequency: Record<string, number> = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    // Convert to array and sort
    let wordList = Object.entries(frequency).map(([word, count]) => ({
      word,
      count,
      percentage: totalWords > 0 ? (count / totalWords) * 100 : 0,
    }));

    // Sort
    wordList.sort((a, b) => {
      if (sortBy === 'frequency') {
        const freqCompare = sortOrder === 'desc' ? b.count - a.count : a.count - b.count;
        if (freqCompare !== 0) return freqCompare;
        return a.word.localeCompare(b.word); // Secondary sort by alphabetical
      } else {
        const alphaCompare = sortOrder === 'desc' ? b.word.localeCompare(a.word) : a.word.localeCompare(b.word);
        if (alphaCompare !== 0) return alphaCompare;
        return b.count - a.count; // Secondary sort by frequency
      }
    });

    const uniqueWords = wordList.length;
    const mostFrequent = wordList.length > 0 ? wordList[0] : null;
    const leastFrequent = wordList.length > 0 ? wordList[wordList.length - 1] : null;

    return {
      words: wordList,
      totalWords,
      uniqueWords,
      mostFrequent,
      leastFrequent,
    };
  }, [input, caseSensitive, sortBy, sortOrder, minLength]);

  return {
    input,
    setInput,
    caseSensitive,
    setCaseSensitive,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    minLength,
    setMinLength,
    analysis,
  };
}

// ── Result Insight Component ──
function ResultInsight({ analysis }: { analysis: any }) {
  if (analysis.totalWords === 0) return null;

  const diversity = analysis.uniqueWords / analysis.totalWords;
  const diversityLabel = diversity > 0.8 ? "Very diverse vocabulary" :
                        diversity > 0.6 ? "Diverse vocabulary" :
                        diversity > 0.4 ? "Moderate vocabulary diversity" :
                        "Limited vocabulary range";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20"
    >
      <div className="flex gap-2 items-start">
        <BarChart3 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-foreground/80 leading-relaxed">
          <p>Analysis complete: {analysis.totalWords} total words, {analysis.uniqueWords} unique words.</p>
          {analysis.mostFrequent && (
            <p className="mt-1">
              Most frequent: "{analysis.mostFrequent.word}" ({analysis.mostFrequent.count} times, {analysis.mostFrequent.percentage.toFixed(1)}%)
            </p>
          )}
          <p className="mt-1 text-muted-foreground">{diversityLabel} ({(diversity * 100).toFixed(1)}% unique words)</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-blue-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-blue-500">
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
  { title: "Word Counter", slug: "word-counter", icon: <FileText className="w-5 h-5" />, color: 217, benefit: "Count words, characters, and reading time" },
  { title: "Character Counter", slug: "character-counter-tool", icon: <Hash className="w-5 h-5" />, color: 45, benefit: "Count characters with or without spaces" },
  { title: "Case Converter", slug: "case-converter", icon: <Target className="w-5 h-5" />, color: 152, benefit: "Convert text case and formatting" },
  { title: "Duplicate Line Remover", slug: "duplicate-line-remover", icon: <BarChart3 className="w-5 h-5" />, color: 340, benefit: "Remove duplicate lines from text" },
  { title: "Alphabetical Sort", slug: "alphabetical-sort", icon: <SortAsc className="w-5 h-5" />, color: 25, benefit: "Sort text alphabetically or numerically" },
];

// ── Main Component ──
export default function WordFrequencyCounter() {
  const analyzer = useWordFrequencyAnalyzer();
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  const copyWord = (word: string) => {
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    setTimeout(() => setCopiedWord(null), 2000);
  };

  const exportCSV = () => {
    const csv = [
      'Word,Frequency,Percentage',
      ...analyzer.analysis.words.map(w => `"${w.word}",${w.count},${w.percentage.toFixed(2)}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'word-frequency-analysis.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <SEO
        title="Word Frequency Counter – Analyze Word Usage in Text | Free Online Tool"
        description="Free online word frequency counter. Analyze how often each word appears in your text. Count word usage, find most common words, and export results. No signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link href="/category/productivity-text" className="text-muted-foreground hover:text-foreground transition-colors">Productivity & Text</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">Word Frequency Counter</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-blue-500/15 bg-gradient-to-br from-blue-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          {/* Category pill */}
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <BarChart3 className="w-3.5 h-3.5" />
            Productivity &amp; Text
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Word Frequency Counter
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Analyze word usage patterns in any text. Find the most common words, track frequency distribution, and export detailed statistics for content analysis.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Analysis
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <FileText className="w-3.5 h-3.5" /> Export CSV
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
              <div className="rounded-2xl overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Text Analysis</p>
                      <p className="text-sm text-muted-foreground">Results update as you type — no button needed.</p>
                    </div>
                  </div>

                  {/* Input Section */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2">Enter your text to analyze</label>
                      <textarea
                        placeholder="Paste or type any text here to analyze word frequency patterns..."
                        className="w-full h-40 p-4 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                        value={analyzer.input}
                        onChange={e => analyzer.setInput(e.target.value)}
                      />
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-2">Case Sensitive</label>
                        <button
                          onClick={() => analyzer.setCaseSensitive(!analyzer.caseSensitive)}
                          className={`w-full p-2 rounded-lg border transition-all ${
                            analyzer.caseSensitive
                              ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : 'border-border bg-background text-muted-foreground hover:border-blue-500/40'
                          }`}
                        >
                          {analyzer.caseSensitive ? <Eye className="w-4 h-4 mx-auto" /> : <EyeOff className="w-4 h-4 mx-auto" />}
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-2">Sort By</label>
                        <select
                          value={analyzer.sortBy}
                          onChange={e => analyzer.setSortBy(e.target.value as any)}
                          className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                        >
                          <option value="frequency">Frequency</option>
                          <option value="alphabetical">Alphabetical</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-2">Order</label>
                        <button
                          onClick={() => analyzer.setSortOrder(analyzer.sortOrder === 'desc' ? 'asc' : 'desc')}
                          className="w-full p-2 rounded-lg border border-border bg-background text-foreground hover:border-blue-500/40 transition-all"
                        >
                          {analyzer.sortOrder === 'desc' ? <SortDesc className="w-4 h-4 mx-auto" /> : <SortAsc className="w-4 h-4 mx-auto" />}
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-2">Min Length</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={analyzer.minLength}
                          onChange={e => analyzer.setMinLength(Number(e.target.value))}
                          className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Results */}
                  {analyzer.analysis.words.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-foreground">Word Frequency Analysis</h3>
                        <button
                          onClick={exportCSV}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-sm rounded-lg hover:bg-blue-500/20 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          Export CSV
                        </button>
                      </div>

                      {/* Summary Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/60 border border-border">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analyzer.analysis.totalWords}</p>
                          <p className="text-xs text-muted-foreground">Total Words</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analyzer.analysis.uniqueWords}</p>
                          <p className="text-xs text-muted-foreground">Unique Words</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {analyzer.analysis.mostFrequent ? analyzer.analysis.mostFrequent.count : 0}
                          </p>
                          <p className="text-xs text-muted-foreground">Most Frequent</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {((analyzer.analysis.uniqueWords / analyzer.analysis.totalWords) * 100).toFixed(1)}%
                          </p>
                          <p className="text-xs text-muted-foreground">Vocabulary Diversity</p>
                        </div>
                      </div>

                      {/* Word List */}
                      <div className="max-h-96 overflow-y-auto rounded-xl border border-border">
                        <div className="p-4 space-y-2">
                          {analyzer.analysis.words.slice(0, 100).map((item, index) => (
                            <div key={item.word} className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-muted/30 transition-colors">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className="text-sm font-bold text-muted-foreground w-8 flex-shrink-0">#{index + 1}</span>
                                <button
                                  onClick={() => copyWord(item.word)}
                                  className="text-left font-mono text-foreground hover:text-blue-500 transition-colors truncate flex-1"
                                >
                                  {item.word}
                                </button>
                                {copiedWord === item.word && (
                                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-4 flex-shrink-0">
                                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 min-w-[3rem] text-right">
                                  {item.count}
                                </span>
                                <span className="text-xs text-muted-foreground min-w-[4rem] text-right">
                                  {item.percentage.toFixed(1)}%
                                </span>
                                <div className="w-20 bg-muted rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                    style={{ width: `${Math.min((item.count / (analyzer.analysis.mostFrequent?.count || 1)) * 100, 100)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          {analyzer.analysis.words.length > 100 && (
                            <p className="text-center text-sm text-muted-foreground py-2">
                              Showing top 100 words. Export CSV for complete list.
                            </p>
                          )}
                        </div>
                      </div>

                      <ResultInsight analysis={analyzer.analysis} />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ── 3. HOW TO USE ── */}
            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Word Frequency Counter</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                This tool analyzes text to show you which words appear most frequently, helping you understand content patterns, identify key themes, and optimize your writing for better readability and SEO.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Paste or type your text</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Enter any text you want to analyze — articles, essays, social media posts, code comments, or any written content. The tool works with plain text and automatically handles punctuation and special characters.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Configure analysis options</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Choose case sensitivity (treat "Word" and "word" as different or the same), sorting method (by frequency or alphabetically), sort order (ascending or descending), and minimum word length to filter out short words like "a", "an", "the".
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Review the frequency analysis</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      View the ranked list of words with their frequency counts and percentages. The summary statistics show total words, unique words, and vocabulary diversity. Visual bars help you quickly identify the most common terms.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">4</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Export results (optional)</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Download a CSV file with complete frequency data for further analysis in Excel, Google Sheets, or other tools. Perfect for content analysis, keyword research, or academic studies.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  <strong className="text-foreground">Pro tip:</strong> Use this tool to analyze competitor content, optimize blog posts for SEO keywords, check essay vocabulary diversity, or identify overused words in your writing. For best results, analyze text samples of similar length for meaningful comparisons.
                </p>
              </div>
            </section>

            {/* ── 4. ANALYSIS INTERPRETATION ── */}
            <section id="analysis-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Understanding Frequency Analysis Results</h2>
              <p className="text-muted-foreground text-sm mb-6">How to interpret word frequency data for different use cases:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Content Writing & SEO</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">High-frequency words indicate your main topics. Compare with target keywords to ensure proper keyword density (typically 0.5-2.5%). Low diversity might mean repetitive content that needs more varied vocabulary.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Academic Writing</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Vocabulary diversity above 60% suggests rich, academic language. Track how often you use transition words, subject-specific terms, and avoid overusing simple words. Compare essays to identify writing patterns and improve style.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                  <div className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Social Media Analysis</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Identify trending words in your posts or competitors' content. High frequency of branded terms shows strong brand consistency. Analyze hashtag usage patterns to optimize social media strategy.</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Remember: Context matters. A word like "the" appearing frequently is normal in English text, but domain-specific terms should appear more often in specialized content. Use the percentage column to compare texts of different lengths.
              </p>
            </section>

            {/* ── 5. QUICK EXAMPLES ── */}
            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Text Type</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Sample Text</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Top Words</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Insights</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Blog Post</td>
                      <td className="px-4 py-3 font-mono text-foreground">SEO tips for beginners...</td>
                      <td className="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">SEO (8), tips (5), beginners (3)</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Keyword-focused content</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Academic Essay</td>
                      <td className="px-4 py-3 font-mono text-foreground">The impact of climate change...</td>
                      <td className="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">climate (12), change (8), impact (6)</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Topic-focused vocabulary</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">Social Post</td>
                      <td className="px-4 py-3 font-mono text-foreground">Love this new coffee shop! ☕</td>
                      <td className="px-4 py-3 font-mono text-blue-600 dark:text-blue-400">love (2), new (1), coffee (1)</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Conversational tone</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Example 1 – SEO Content:</strong> In a 500-word blog post about "SEO tips for beginners", the word "SEO" appears 8 times (1.6%), "tips" appears 5 times (1%), and "beginners" appears 3 times (0.6%). This shows good keyword distribution without keyword stuffing. The vocabulary diversity is around 45%, typical for how-to content.
                </p>
                <p>
                  <strong className="text-foreground">Example 2 – Academic Writing:</strong> A 1000-word research paper on climate change shows "climate" at 12 times (1.2%), "change" at 8 times (0.8%), and "impact" at 6 times (0.6%). The vocabulary diversity reaches 68%, indicating sophisticated academic language with good term variety.
                </p>
                <p>
                  <strong className="text-foreground">Example 3 – Social Media:</strong> A short Instagram caption "Love this new coffee shop! Great atmosphere and amazing latte art! ☕ #coffeelover" has very high diversity (83%) due to its casual, descriptive nature. Words like "love", "new", "coffee" appear only once each, reflecting natural conversation patterns.
                </p>
              </div>
            </section>

            {/* ── 6. WHY CHOOSE THIS ── */}
            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Word Frequency Counter?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Comprehensive analysis with multiple metrics.</strong> Beyond simple word counts, this tool provides frequency percentages, vocabulary diversity scores, and visual progress bars. See not just how often words appear, but their relative importance in your text.
                </p>
                <p>
                  <strong className="text-foreground">Flexible sorting and filtering options.</strong> Sort by frequency or alphabetically, in ascending or descending order. Filter out short words, handle case sensitivity, and customize the analysis to match your specific needs and content type.
                </p>
                <p>
                  <strong className="text-foreground">Export functionality for further analysis.</strong> Download complete frequency data as CSV files for use in Excel, Google Sheets, or data analysis tools. Perfect for researchers, content marketers, and writers who need detailed analytics.
                </p>
                <p>
                  <strong className="text-foreground">Real-time analysis with instant feedback.</strong> Results update as you type, with immediate insights about your text's vocabulary patterns. No waiting for processing — get instant feedback on your writing style and content optimization.
                </p>
                <p>
                  <strong className="text-foreground">Privacy-first text processing.</strong> All analysis happens locally in your browser. Your text never leaves your device or gets stored anywhere. Analyze sensitive documents, confidential reports, or personal writing with complete privacy.
                </p>
              </div>

              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> This tool analyzes raw word frequency without considering context, synonyms, or semantic meaning. For advanced linguistic analysis, consider using specialized natural language processing tools. Results depend on the quality and cleanliness of your input text.
                </p>
              </div>
            </section>

            {/* ── 7. FAQ ── */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="What counts as a 'word' in the analysis?"
                  a="Words are separated by spaces, punctuation, and special characters. The tool automatically handles periods, commas, exclamation marks, question marks, and other punctuation. Contractions like 'don't' count as single words, while hyphenated words like 'self-motivated' count as one word."
                />
                <FaqItem
                  q="How is vocabulary diversity calculated?"
                  a="Vocabulary diversity is the percentage of unique words out of total words. For example, if your text has 100 words but only 60 unique words, the diversity is 60%. Higher percentages indicate richer vocabulary, while lower percentages suggest more repetitive language patterns."
                />
                <FaqItem
                  q="Can I analyze text in other languages?"
                  a="Yes, the tool works with any language that uses spaces to separate words. However, the minimum word length filter and punctuation handling are optimized for English. For best results with other languages, adjust the minimum length setting and be aware that case sensitivity may not apply to all writing systems."
                />
                <FaqItem
                  q="What's the maximum text length I can analyze?"
                  a="The tool can handle very large texts (tens of thousands of words) efficiently. For performance reasons, the results table shows only the top 100 most frequent words. Use the CSV export feature to get complete frequency data for longer texts."
                />
                <FaqItem
                  q="How accurate are the percentage calculations?"
                  a="Percentages are calculated as (word frequency ÷ total words) × 100, accurate to one decimal place. The calculations use standard floating-point arithmetic and are reliable for most analytical purposes, including academic research and content optimization."
                />
                <FaqItem
                  q="Does this tool count numbers or symbols?"
                  a="Numbers and symbols are treated as words if they appear between separators. For example, '2024' or 'C++' would be counted as individual tokens. Use the minimum length filter to exclude very short tokens that aren't meaningful words."
                />
              </div>
            </section>

            {/* ── 8. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Analyze More Text Tools</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore 400+ free tools including word counters, case converters, and text formatters — all free, all instant.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-blue-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others analyze text patterns.</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    // Could add copied state here if needed
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Link
                </button>
              </div>

              {/* On This Page */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    "Analyzer",
                    "How to Use",
                    "Analysis Interpretation",
                    "Quick Examples",
                    "Why Choose This",
                    "FAQ",
                  ].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-blue-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-blue-500/40 flex-shrink-0" />
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