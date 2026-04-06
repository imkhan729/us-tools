import { useMemo, useState } from "react";
import { FileText, Copy } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "to", "of", "for", "in", "on", "at",
  "by", "with", "from", "as", "is", "are", "was", "were", "be", "been", "being",
  "this", "that", "these", "those", "it", "its", "your", "you", "we", "our",
  "i", "me", "my", "they", "them", "their", "he", "she", "his", "her",
]);

type WordRow = { word: string; count: number; percent: number };

export default function WordFrequencyCounter() {
  const [text, setText] = useState("");
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(true);
  const [minLength, setMinLength] = useState(3);
  const [maxRows, setMaxRows] = useState(25);
  const [copied, setCopied] = useState(false);

  const { rows, totalWords } = useMemo(() => {
    const tokens = text.match(/[a-zA-Z0-9']+/g) ?? [];
    const normalized = tokens.map((token) => (ignoreCase ? token.toLowerCase() : token));
    const filtered = normalized.filter((token) => token.length >= minLength);
    const finalTokens = removeStopWords
      ? filtered.filter((token) => !STOP_WORDS.has(token.toLowerCase()))
      : filtered;

    const counts = new Map<string, number>();
    finalTokens.forEach((token) => counts.set(token, (counts.get(token) ?? 0) + 1));

    const total = finalTokens.length;
    const rows: WordRow[] = Array.from(counts.entries())
      .map(([word, count]) => ({
        word,
        count,
        percent: total === 0 ? 0 : (count / total) * 100,
      }))
      .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
      .slice(0, Math.max(1, maxRows));

    return { rows, totalWords: total };
  }, [text, ignoreCase, removeStopWords, minLength, maxRows]);

  const copyCsv = async () => {
    if (!rows.length) return;
    const csv = ["word,count,percent", ...rows.map((row) => `${row.word},${row.count},${row.percent.toFixed(2)}`)].join("\n");
    await navigator.clipboard.writeText(csv);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <UtilityToolPageShell
      title="Word Frequency Counter"
      seoTitle="Word Frequency Counter"
      seoDescription="Analyze how often each word appears in a text. Generate a sorted word frequency table instantly."
      canonical="https://usonlinetools.com/productivity/word-frequency-counter"
      categoryName="Productivity & Text"
      categoryHref="/category/productivity"
      heroDescription="Count how often each word appears in a document, article, or pasted dataset. Filter stop words, set minimum length, and export a clean frequency table."
      heroIcon={<FileText className="w-3.5 h-3.5" />}
      calculatorLabel="Frequency Analyzer"
      calculatorDescription="Paste text and review the most frequent words."
      calculator={
        <div className="space-y-5">
          <div>
            <label htmlFor="frequency-input" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Text Input
            </label>
            <textarea
              id="frequency-input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="tool-calc-input min-h-[200px] w-full resize-y"
              placeholder="Paste an article, draft, or dataset..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Case</p>
              <button
                onClick={() => setIgnoreCase((value) => !value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:border-blue-500/40"
              >
                {ignoreCase ? "Ignore Case" : "Case Sensitive"}
              </button>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Stop Words</p>
              <button
                onClick={() => setRemoveStopWords((value) => !value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:border-blue-500/40"
              >
                {removeStopWords ? "Remove" : "Keep"}
              </button>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Min Length</p>
              <input
                type="number"
                min={1}
                max={10}
                value={minLength}
                onChange={(event) => setMinLength(Number(event.target.value))}
                className="tool-calc-input w-full"
              />
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Rows</p>
              <input
                type="number"
                min={5}
                max={100}
                value={maxRows}
                onChange={(event) => setMaxRows(Number(event.target.value))}
                className="tool-calc-input w-full"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Top Words</p>
              <button
                onClick={copyCsv}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-xs font-bold text-white"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? "Copied" : "Copy CSV"}
              </button>
            </div>
            {rows.length ? (
              <div className="overflow-x-auto rounded-xl border border-border bg-card">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-foreground">Word</th>
                      <th className="px-4 py-3 text-left font-bold text-foreground">Count</th>
                      <th className="px-4 py-3 text-left font-bold text-foreground">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rows.map((row) => (
                      <tr key={row.word}>
                        <td className="px-4 py-3 font-mono text-foreground">{row.word}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.count}</td>
                        <td className="px-4 py-3 text-blue-600 font-semibold">{row.percent.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Paste text to generate a frequency table.</p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">Total counted words: {totalWords}</p>
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste your text", description: "Add the article, transcript, or dataset you want to analyze." },
        { title: "Adjust filters", description: "Toggle case sensitivity, stop-word removal, and minimum word length." },
        { title: "Review the table", description: "The highest-frequency words appear first with counts and percent share." },
        { title: "Copy if needed", description: "Export the top rows as CSV for reports or further analysis." },
      ]}
      interpretationCards={[
        { title: "Word share", description: "Percent share shows how much of your text is dominated by each term.", className: "bg-blue-500/5 border-blue-500/20" },
        { title: "Stop-word filtering", description: "Removing filler words helps highlight meaningful topics.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Minimum length", description: "Raising the minimum length hides short tokens that add noise.", className: "bg-emerald-500/5 border-emerald-500/20" },
      ]}
      examples={[
        { scenario: "Blog draft", input: "1,200-word article", output: "Top keywords with % share" },
        { scenario: "SEO review", input: "Landing page copy", output: "Keyword repetition check" },
        { scenario: "Research notes", input: "Interview transcript", output: "Frequently used terms" },
        { scenario: "Content cleanup", input: "Long caption", output: "Overused words flagged" },
      ]}
      whyChoosePoints={[
        "Instant word frequency table without uploading content anywhere.",
        "Flexible filters let you focus on meaningful terms instead of filler words.",
        "CSV export makes it easy to move results into reports or spreadsheets.",
      ]}
      faqs={[
        { q: "Does this count numbers and contractions?", a: "Yes. Numbers and tokens with apostrophes are included if they meet your minimum length." },
        { q: "What are stop words?", a: "Stop words are common filler words like \"the\" or \"and\" that usually add noise to frequency analysis." },
        { q: "Is my text stored?", a: "No. Everything runs locally in your browser." },
        { q: "Can I export the full list?", a: "The table shows the top rows. Increase the row limit or copy the CSV output for longer lists." },
      ]}
      relatedTools={[
        { title: "Word Counter", slug: "word-counter", icon: <FileText className="w-4 h-4" />, color: 180, benefit: "Count words and reading time" },
        { title: "Character Counter Tool", slug: "character-counter-tool", icon: <FileText className="w-4 h-4" />, color: 30, benefit: "Track character totals" },
        { title: "Line Counter Tool", slug: "line-counter-tool", icon: <FileText className="w-4 h-4" />, color: 220, benefit: "Count lines and blanks" },
        { title: "Keyword Density Checker", slug: "online-keyword-density-checker", icon: <FileText className="w-4 h-4" />, color: 260, benefit: "Analyze keyword density" },
        { title: "Remove Extra Spaces Tool", slug: "remove-extra-spaces-tool", icon: <FileText className="w-4 h-4" />, color: 300, benefit: "Clean text spacing" },
        { title: "Text Formatter Tool", slug: "text-formatter-tool", icon: <FileText className="w-4 h-4" />, color: 340, benefit: "Change casing quickly" },
      ]}
    />
  );
}
