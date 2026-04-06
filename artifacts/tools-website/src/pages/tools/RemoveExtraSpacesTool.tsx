import { useMemo, useState } from "react";
import { BarChart3, Eraser, Hash, Type } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

export default function RemoveExtraSpacesTool() {
  const [text, setText] = useState("");
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [removeBlankLines, setRemoveBlankLines] = useState(false);
  const [copied, setCopied] = useState(false);

  const cleaned = useMemo(() => {
    let lines = text.split(/\r?\n/);

    lines = lines.map((line) => {
      let value = line.replace(/\t/g, " ");
      if (collapseSpaces) value = value.replace(/ {2,}/g, " ");
      if (trimLines) value = value.trim();
      return value;
    });

    if (removeBlankLines) {
      lines = lines.filter((line) => line.length > 0);
    }

    return lines.join("\n");
  }, [collapseSpaces, removeBlankLines, text, trimLines]);

  const charsSaved = Math.max(0, text.length - cleaned.length);
  const lineDelta = text ? text.split(/\r?\n/).length - cleaned.split(/\r?\n/).length : 0;

  const copyOutput = async () => {
    await navigator.clipboard.writeText(cleaned);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <UtilityToolPageShell
      title="Remove Extra Spaces Tool"
      seoTitle="Remove Extra Spaces Tool"
      seoDescription="Clean up extra spaces, tabs, and optional blank lines instantly with this free text cleanup tool."
      canonical="https://usonlinetools.com/productivity/remove-extra-spaces-tool"
      categoryName="Productivity & Text"
      categoryHref="/category/productivity"
      heroDescription="Clean messy text without manually fixing every line. Remove repeated spaces, trim line edges, turn tabs into spaces, and optionally strip blank lines before you copy the cleaned result."
      heroIcon={<Eraser className="w-3.5 h-3.5" />}
      calculatorLabel="Whitespace Cleanup"
      calculatorDescription="Normalize spaces and copy the cleaned result."
      calculator={
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 md:p-6 space-y-5">
          <div>
            <label htmlFor="spaces-input" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Original Text
            </label>
            <textarea
              id="spaces-input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="tool-calc-input min-h-[180px] w-full resize-y"
              placeholder="Paste text with extra spaces, tabs, or blank lines..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center gap-3">
              <input type="checkbox" checked={collapseSpaces} onChange={(event) => setCollapseSpaces(event.target.checked)} />
              Collapse repeated spaces
            </label>
            <label className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center gap-3">
              <input type="checkbox" checked={trimLines} onChange={(event) => setTrimLines(event.target.checked)} />
              Trim each line
            </label>
            <label className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center gap-3">
              <input type="checkbox" checked={removeBlankLines} onChange={(event) => setRemoveBlankLines(event.target.checked)} />
              Remove blank lines
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-blue-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Before</p>
              <p className="text-2xl font-black text-blue-600">{text.length}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">After</p>
              <p className="text-2xl font-black text-emerald-600">{cleaned.length}</p>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Saved</p>
              <p className="text-2xl font-black text-violet-600">{charsSaved}</p>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Line Delta</p>
              <p className="text-2xl font-black text-cyan-600">{lineDelta}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <label htmlFor="spaces-output" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Cleaned Output
              </label>
              <button
                onClick={copyOutput}
                disabled={!cleaned}
                className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {copied ? "Copied" : "Copy Output"}
              </button>
            </div>
            <textarea
              id="spaces-output"
              readOnly
              value={cleaned}
              className="tool-calc-input min-h-[160px] w-full resize-y bg-muted/40"
              placeholder="Cleaned text appears here..."
            />
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste the messy text", description: "Drop in copied content from documents, spreadsheets, code, or chat exports." },
        { title: "Choose cleanup rules", description: "Turn on or off repeated-space cleanup, line trimming, and blank-line removal depending on how strict you want the cleanup to be." },
        { title: "Review the cleaned version", description: "Compare the before and after counts to see how much whitespace was removed." },
        { title: "Copy the result", description: "Use the cleaned text in editors, forms, code snippets, or content management fields." },
      ]}
      interpretationCards={[
        { title: "Collapse repeated spaces", description: "Best for ordinary text where multiple spaces are accidental and should be reduced to one." },
        { title: "Trim each line", description: "Useful when each line should start and end cleanly, especially in lists or imported data.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Remove blank lines", description: "Good for dense lists, CSV-like cleanup, or code comments where empty rows are unnecessary.", className: "bg-violet-500/5 border-violet-500/20" },
      ]}
      examples={[
        { scenario: "Repeated spaces", input: "red   blue   green", output: "red blue green" },
        { scenario: "Trimmed lines", input: "  alpha  ", output: "alpha" },
        { scenario: "Tabs to spaces", input: "name\\tvalue", output: "name value" },
        { scenario: "Blank lines removed", input: "one\\n\\n\\ntwo", output: "one\\ntwo" },
      ]}
      whyChoosePoints={[
        "Saves time on routine cleanup. You do not need to hand-edit every line after pasting from inconsistent sources.",
        "Flexible enough for different text jobs. You can keep blank lines when formatting prose or remove them for list cleanup.",
        "Runs locally in the browser, so you can clean snippets and documents without uploading them anywhere.",
      ]}
      faqs={[
        { q: "Does this remove line breaks by default?", a: "No. It keeps line breaks unless you explicitly choose to remove blank lines." },
        { q: "Will tabs be preserved?", a: "Tabs are converted to spaces as part of the cleanup so the output is more consistent." },
        { q: "Can I use this for code?", a: "Yes, but be careful. For code or YAML where spacing can matter, review the output before pasting it back into production files." },
        { q: "What happens if my text is already clean?", a: "The output stays effectively the same, and the saved-character count will remain close to zero." },
      ]}
      relatedTools={[
        { title: "Text Formatter Tool", slug: "text-formatter-tool", icon: <Type className="w-4 h-4" />, color: 217, benefit: "Adjust case after cleanup" },
        { title: "Sort Text Lines Tool", slug: "sort-text-lines-tool", icon: <Hash className="w-4 h-4" />, color: 152, benefit: "Sort cleaned lists" },
        { title: "Line Counter Tool", slug: "line-counter-tool", icon: <BarChart3 className="w-4 h-4" />, color: 274, benefit: "Check line totals" },
        { title: "Character Counter Tool", slug: "character-counter-tool", icon: <Type className="w-4 h-4" />, color: 28, benefit: "Measure final length" },
        { title: "Duplicate Line Remover", slug: "duplicate-line-remover", icon: <Hash className="w-4 h-4" />, color: 340, benefit: "Clean repeated rows" },
        { title: "Alphabetical Sort", slug: "alphabetical-sort", icon: <BarChart3 className="w-4 h-4" />, color: 185, benefit: "Sort simple text quickly" },
      ]}
    />
  );
}
