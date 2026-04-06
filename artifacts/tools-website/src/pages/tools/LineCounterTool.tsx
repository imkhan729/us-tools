import { useMemo, useState } from "react";
import { BarChart3, FileText, Hash, Type } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

export default function LineCounterTool() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const lines = text.length === 0 ? [] : text.split(/\r?\n/);
    const totalLines = lines.length;
    const nonEmptyLines = lines.filter((line) => line.trim().length > 0).length;
    const emptyLines = totalLines - nonEmptyLines;
    const charCounts = lines.map((line) => line.length);
    const longestLine = charCounts.length ? Math.max(...charCounts) : 0;
    const shortestNonEmpty = lines.filter((line) => line.length > 0).map((line) => line.length);
    const shortestLine = shortestNonEmpty.length ? Math.min(...shortestNonEmpty) : 0;
    const averageChars = nonEmptyLines ? Math.round(lines.filter((line) => line.trim().length > 0).join("").length / nonEmptyLines) : 0;
    return { totalLines, nonEmptyLines, emptyLines, longestLine, shortestLine, averageChars };
  }, [text]);

  return (
    <UtilityToolPageShell
      title="Line Counter Tool"
      seoTitle="Line Counter Tool"
      seoDescription="Count total lines, non-empty lines, empty lines, and line-length statistics instantly for any text or code block."
      canonical="https://usonlinetools.com/productivity/line-counter-tool"
      categoryName="Productivity & Text"
      categoryHref="/category/productivity"
      heroDescription="Count lines in documents, code, notes, or pasted datasets instantly. See total lines, content lines, empty lines, and basic line-length stats without exporting the text anywhere."
      heroIcon={<FileText className="w-3.5 h-3.5" />}
      calculatorLabel="Line Analysis"
      calculatorDescription="Paste any text and get immediate line statistics."
      calculator={
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 md:p-6 space-y-5">
          <div>
            <label htmlFor="line-counter-input" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Text Input
            </label>
            <textarea
              id="line-counter-input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="tool-calc-input min-h-[200px] w-full resize-y"
              placeholder="Paste code, notes, or any multi-line text..."
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-blue-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Total Lines</p>
              <p className="text-3xl font-black text-blue-600">{stats.totalLines}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Content Lines</p>
              <p className="text-3xl font-black text-emerald-600">{stats.nonEmptyLines}</p>
            </div>
            <div className="rounded-xl border border-orange-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Empty Lines</p>
              <p className="text-3xl font-black text-orange-600">{stats.emptyLines}</p>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Longest Line</p>
              <p className="text-3xl font-black text-violet-600">{stats.longestLine}</p>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Shortest Non-Empty</p>
              <p className="text-3xl font-black text-cyan-600">{stats.shortestLine}</p>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Avg Chars / Line</p>
              <p className="text-3xl font-black text-rose-600">{stats.averageChars}</p>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste the text block", description: "Add any content with line breaks, including code, lists, copied logs, or draft copy." },
        { title: "Read the counts immediately", description: "The tool updates as you type or paste, so you do not need to run a separate calculation." },
        { title: "Use the line metrics", description: "Check total lines, content-only lines, and empty lines for audits, formatting, or submission requirements." },
        { title: "Review length stats if needed", description: "Line-length figures can help with code reviews, content limits, or line-based formatting work." },
      ]}
      interpretationCards={[
        { title: "Total lines", description: "Counts every line break, including blank rows, so it reflects the full shape of the pasted text." },
        { title: "Content lines", description: "Counts only lines with visible characters. This is useful when empty rows should not be treated as real content.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Line length stats", description: "Longest, shortest, and average line lengths help identify outliers and formatting issues in dense text or code.", className: "bg-violet-500/5 border-violet-500/20" },
      ]}
      examples={[
        { scenario: "Short note", input: "3 written lines", output: "3 total lines" },
        { scenario: "Text with blanks", input: "5 lines with 2 blank rows", output: "5 total, 3 content, 2 empty" },
        { scenario: "Code review", input: "multi-line function", output: "line count plus longest line" },
        { scenario: "Submission check", input: "essay draft", output: "content-only line count" },
      ]}
      whyChoosePoints={[
        "More useful than a basic total count because it separates blank lines from content-bearing lines.",
        "Helpful for both writing and technical work. The same stats work for essays, exports, logs, and code snippets.",
        "Instant browser-side feedback makes it easy to test formatting changes without saving files or opening another tool.",
      ]}
      faqs={[
        { q: "Does the tool count an empty final line?", a: "It counts based on the actual line breaks present in the pasted text, so the displayed total follows the structure of your input." },
        { q: "Can I use it for source code?", a: "Yes. It is useful for code snippets, logs, config files, and other technical text." },
        { q: "What is shortest non-empty line?", a: "That metric ignores completely blank rows and shows the shortest line that still contains characters." },
        { q: "Does this upload my text anywhere?", a: "No. The counting happens directly in the browser." },
      ]}
      relatedTools={[
        { title: "Character Counter Tool", slug: "character-counter-tool", icon: <Type className="w-4 h-4" />, color: 217, benefit: "Measure text length" },
        { title: "Word Counter", slug: "word-counter", icon: <BarChart3 className="w-4 h-4" />, color: 152, benefit: "Count words and reading time" },
        { title: "Remove Extra Spaces Tool", slug: "remove-extra-spaces-tool", icon: <Hash className="w-4 h-4" />, color: 274, benefit: "Clean whitespace before counting" },
        { title: "Sort Text Lines Tool", slug: "sort-text-lines-tool", icon: <BarChart3 className="w-4 h-4" />, color: 28, benefit: "Reorder lists line by line" },
        { title: "Text Formatter Tool", slug: "text-formatter-tool", icon: <Type className="w-4 h-4" />, color: 340, benefit: "Adjust casing of your text" },
        { title: "Word Frequency Counter", slug: "word-frequency-counter", icon: <FileText className="w-4 h-4" />, color: 185, benefit: "Inspect repeated words" },
      ]}
    />
  );
}
