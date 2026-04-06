import { useMemo, useState } from "react";
import { ArrowUpDown, BarChart3, Hash, ListOrdered } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type SortType = "alphabetic" | "length" | "numeric";
type SortOrder = "asc" | "desc";

export default function SortTextLinesTool() {
  const [text, setText] = useState("");
  const [sortType, setSortType] = useState<SortType>("alphabetic");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [removeBlankLines, setRemoveBlankLines] = useState(false);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [copied, setCopied] = useState(false);

  const inputLines = useMemo(() => text.split(/\r?\n/), [text]);

  const sortedLines = useMemo(() => {
    let lines = [...inputLines];
    if (removeBlankLines) lines = lines.filter((line) => line.trim().length > 0);
    if (removeDuplicates) lines = Array.from(new Set(lines));

    lines.sort((left, right) => {
      if (sortType === "length") return left.length - right.length;
      if (sortType === "numeric") return (Number(left) || 0) - (Number(right) || 0);

      const a = ignoreCase ? left.toLowerCase() : left;
      const b = ignoreCase ? right.toLowerCase() : right;
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: ignoreCase ? "accent" : "variant" });
    });

    if (sortOrder === "desc") lines.reverse();
    return lines;
  }, [ignoreCase, inputLines, removeBlankLines, removeDuplicates, sortOrder, sortType]);

  const output = sortedLines.join("\n");

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <UtilityToolPageShell
      title="Sort Text Lines Tool"
      seoTitle="Sort Text Lines Tool"
      seoDescription="Sort text lines alphabetically, by length, or numerically with options for duplicates, case sensitivity, and blank-line cleanup."
      canonical="https://usonlinetools.com/productivity/sort-text-lines-tool"
      categoryName="Productivity & Text"
      categoryHref="/category/productivity"
      heroDescription="Sort any list of lines in seconds. Choose alphabetical, numeric, or length-based sorting, reverse the order, remove duplicates, and clean blank lines before copying the result."
      heroIcon={<ArrowUpDown className="w-3.5 h-3.5" />}
      calculatorLabel="Line Sorting"
      calculatorDescription="Sort multi-line text with list-focused controls."
      calculator={
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 md:p-6 space-y-5">
          <div>
            <label htmlFor="sort-input" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Input Lines
            </label>
            <textarea
              id="sort-input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="tool-calc-input min-h-[180px] w-full resize-y"
              placeholder="Paste one item per line..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Sort Type</label>
              <select value={sortType} onChange={(event) => setSortType(event.target.value as SortType)} className="tool-calc-input w-full">
                <option value="alphabetic">Alphabetic</option>
                <option value="numeric">Numeric</option>
                <option value="length">Length</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Order</label>
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)} className="tool-calc-input w-full">
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <label className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center gap-3 mt-6 md:mt-0">
              <input type="checkbox" checked={ignoreCase} onChange={(event) => setIgnoreCase(event.target.checked)} />
              Ignore case
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center gap-3">
              <input type="checkbox" checked={removeBlankLines} onChange={(event) => setRemoveBlankLines(event.target.checked)} />
              Remove blank lines
            </label>
            <label className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center gap-3">
              <input type="checkbox" checked={removeDuplicates} onChange={(event) => setRemoveDuplicates(event.target.checked)} />
              Remove duplicates
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-blue-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Input Lines</p>
              <p className="text-2xl font-black text-blue-600">{inputLines.filter((line) => line.length > 0 || text.length > 0).length}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Output Lines</p>
              <p className="text-2xl font-black text-emerald-600">{sortedLines.filter((line) => line.length > 0 || output.length > 0).length}</p>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Type</p>
              <p className="text-lg font-black text-violet-600">{sortType}</p>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Order</p>
              <p className="text-lg font-black text-cyan-600">{sortOrder}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <label htmlFor="sort-output" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Sorted Output
              </label>
              <button
                onClick={copyOutput}
                disabled={!output}
                className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {copied ? "Copied" : "Copy Output"}
              </button>
            </div>
            <textarea
              id="sort-output"
              readOnly
              value={output}
              className="tool-calc-input min-h-[160px] w-full resize-y bg-muted/40"
              placeholder="Sorted lines appear here..."
            />
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste one item per line", description: "Add names, numbers, tags, or any other line-based list into the input box." },
        { title: "Choose the sort logic", description: "Sort alphabetically, numerically, or by line length depending on how you want the list organized." },
        { title: "Apply cleanup options", description: "Ignore case, remove duplicates, or strip blank lines so the final list is easier to reuse." },
        { title: "Copy the sorted list", description: "Use the output as a cleaned list for spreadsheets, checklists, CMS data, or text processing." },
      ]}
      interpretationCards={[
        { title: "Alphabetic sorting", description: "Best for names, tags, cities, and plain-text lists where lexical order matters most." },
        { title: "Numeric sorting", description: "Treats each line like a number, which is useful for rankings, IDs, and ordered datasets.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Length sorting", description: "Sorts by line size instead of content, which can help with UI labels, content audits, or pattern checks.", className: "bg-violet-500/5 border-violet-500/20" },
      ]}
      examples={[
        { scenario: "Alphabetic list", input: "pear\\napple\\nbanana", output: "apple\\nbanana\\npear" },
        { scenario: "Numeric list", input: "20\\n3\\n100", output: "3\\n20\\n100" },
        { scenario: "By length", input: "alpha\\nbe\\nzebra", output: "be\\nalpha\\nzebra" },
        { scenario: "Remove duplicates", input: "red\\nred\\nblue", output: "blue\\nred" },
      ]}
      whyChoosePoints={[
        "Faster than sorting manually in plain text editors. You can clean and reorder the list in one place.",
        "Flexible enough for both content and data. The same interface works for names, IDs, tags, and line-based numeric sets.",
        "Simple browser workflow. Paste, sort, review, and copy without formatting files or moving data into another app.",
      ]}
      faqs={[
        { q: "Does numeric sorting handle invalid numbers?", a: "Lines that are not valid numbers are treated as zero in numeric mode, so review the result if your list mixes labels and numbers." },
        { q: "What does ignore case do?", a: "It compares uppercase and lowercase letters as the same value, so Apple and apple sort together more predictably." },
        { q: "Will duplicate removal preserve order?", a: "It preserves the first occurrence that remains after the initial cleanup step and before final sorting is applied." },
        { q: "Can I sort long multi-line content?", a: "Yes, but the tool is designed for line-based lists. Each line is treated as one sortable unit." },
      ]}
      relatedTools={[
        { title: "Remove Extra Spaces Tool", slug: "remove-extra-spaces-tool", icon: <BarChart3 className="w-4 h-4" />, color: 152, benefit: "Clean lines before sorting" },
        { title: "Text Formatter Tool", slug: "text-formatter-tool", icon: <Hash className="w-4 h-4" />, color: 217, benefit: "Adjust case after sorting" },
        { title: "Line Counter Tool", slug: "line-counter-tool", icon: <ListOrdered className="w-4 h-4" />, color: 274, benefit: "Check total line count" },
        { title: "Alphabetical Sort", slug: "alphabetical-sort", icon: <ArrowUpDown className="w-4 h-4" />, color: 28, benefit: "Simple alphabetic sorting" },
        { title: "Duplicate Line Remover", slug: "duplicate-line-remover", icon: <Hash className="w-4 h-4" />, color: 340, benefit: "Remove repeated entries" },
        { title: "Random Picker Tool", slug: "random-picker-tool", icon: <BarChart3 className="w-4 h-4" />, color: 185, benefit: "Pick from a final sorted list" },
      ]}
    />
  );
}
