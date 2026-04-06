import { useMemo, useState } from "react";
import { BarChart3, CaseSensitive, Hash, Type } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type FormatMode = "upper" | "lower" | "title" | "sentence" | "invert";

const MODES: Array<{ key: FormatMode; label: string }> = [
  { key: "upper", label: "UPPERCASE" },
  { key: "lower", label: "lowercase" },
  { key: "title", label: "Title Case" },
  { key: "sentence", label: "Sentence case" },
  { key: "invert", label: "iNVERT cASE" },
];

function toTitleCase(text: string) {
  return text.toLowerCase().replace(/\b([a-z])/g, (match) => match.toUpperCase());
}

function toSentenceCase(text: string) {
  return text.toLowerCase().replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (match) => match.toUpperCase());
}

function invertCase(text: string) {
  return text.replace(/[a-z]/gi, (char) => (char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()));
}

export default function TextFormatterTool() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<FormatMode>("title");
  const [copied, setCopied] = useState(false);

  const formatted = useMemo(() => {
    if (!text) return "";
    if (mode === "upper") return text.toUpperCase();
    if (mode === "lower") return text.toLowerCase();
    if (mode === "title") return toTitleCase(text);
    if (mode === "sentence") return toSentenceCase(text);
    return invertCase(text);
  }, [mode, text]);

  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  const copyOutput = async () => {
    await navigator.clipboard.writeText(formatted);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <UtilityToolPageShell
      title="Text Formatter Tool"
      seoTitle="Text Formatter Tool"
      seoDescription="Convert text to uppercase, lowercase, title case, sentence case, or invert case instantly with this free browser-based formatter."
      canonical="https://usonlinetools.com/productivity/text-formatter-tool"
      categoryName="Productivity & Text"
      categoryHref="/category/productivity"
      heroDescription="Format text instantly for cleaner documents, social captions, titles, and copy editing. Switch between uppercase, lowercase, title case, sentence case, and invert case without leaving the browser."
      heroIcon={<Type className="w-3.5 h-3.5" />}
      calculatorLabel="Text Formatter"
      calculatorDescription="Convert casing instantly and copy the result."
      calculator={
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 md:p-6 space-y-5">
          <div>
            <label htmlFor="formatter-input" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Input Text
            </label>
            <textarea
              id="formatter-input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="tool-calc-input min-h-[180px] w-full resize-y"
              placeholder="Paste or type the text you want to reformat..."
            />
          </div>

          <div>
            <p className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Format Mode</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {MODES.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setMode(item.key)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors ${
                    mode === item.key ? "border-blue-600 bg-blue-500 text-white" : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-blue-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Characters</p>
              <p className="text-2xl font-black text-blue-600">{chars}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Words</p>
              <p className="text-2xl font-black text-emerald-600">{words}</p>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Mode</p>
              <p className="text-lg font-black text-violet-600">{MODES.find((item) => item.key === mode)?.label}</p>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Ready</p>
              <p className="text-lg font-black text-cyan-600">{formatted ? "Yes" : "Enter text"}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <label htmlFor="formatter-output" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Formatted Output
              </label>
              <button
                onClick={copyOutput}
                disabled={!formatted}
                className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {copied ? "Copied" : "Copy Output"}
              </button>
            </div>
            <textarea
              id="formatter-output"
              readOnly
              value={formatted}
              className="tool-calc-input min-h-[160px] w-full resize-y bg-muted/40"
              placeholder="Formatted text will appear here..."
            />
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste or type your text", description: "Enter the original text in the input box. Multi-line text works the same as short titles or captions." },
        { title: "Choose the format style", description: "Switch between uppercase, lowercase, title case, sentence case, or invert case depending on the result you need." },
        { title: "Review the transformed output", description: "The output updates immediately, so you can compare the original and formatted text without extra clicks." },
        { title: "Copy the finished version", description: "Use the copy button to move the formatted text into documents, emails, CMS fields, or social posts." },
      ]}
      interpretationCards={[
        { title: "Title case", description: "Good for headings, article titles, and labels where you want each word to start with a capital letter." },
        { title: "Sentence case", description: "Useful for body copy and natural-looking paragraphs because it lowers everything and then capitalizes sentence starts.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Invert case", description: "Best for quick transformations or novelty formatting. It flips every letter rather than trying to preserve grammar.", className: "bg-violet-500/5 border-violet-500/20" },
      ]}
      examples={[
        { scenario: "Uppercase heading", input: "launch checklist", output: "LAUNCH CHECKLIST" },
        { scenario: "Lowercase cleanup", input: "EMAIL SUBJECT LINE", output: "email subject line" },
        { scenario: "Title case", input: "best productivity apps 2026", output: "Best Productivity Apps 2026" },
        { scenario: "Sentence case", input: "hello WORLD. this IS a TEST.", output: "Hello world. This is a test." },
        { scenario: "Invert case", input: "Plan B", output: "pLAN b" },
      ]}
      whyChoosePoints={[
        "Fast for repetitive editing. Instead of manually retyping case changes, you can reformat the whole block in one pass.",
        "Useful across multiple workflows. The same tool works for titles, document cleanup, CMS entry, classroom notes, and social captions.",
        "Browser-based and private. Your text stays in the page while you work, with no account requirement or upload step.",
      ]}
      faqs={[
        { q: "Does this tool change punctuation or numbers?", a: "No. It only transforms letter casing. Punctuation, numbers, and line breaks stay in place." },
        { q: "What is the difference between title case and sentence case?", a: "Title case capitalizes the first letter of each word, while sentence case mainly capitalizes the beginning of each sentence." },
        { q: "Can I format multiple paragraphs at once?", a: "Yes. You can paste long multi-paragraph text and the formatter will preserve line breaks in the output." },
        { q: "Is invert case meant for formal writing?", a: "Usually no. Invert case is mainly useful for quick transformations, experiments, or playful formatting." },
      ]}
      relatedTools={[
        { title: "Remove Extra Spaces Tool", slug: "remove-extra-spaces-tool", icon: <BarChart3 className="w-4 h-4" />, color: 152, benefit: "Clean whitespace before formatting" },
        { title: "Sort Text Lines Tool", slug: "sort-text-lines-tool", icon: <Hash className="w-4 h-4" />, color: 217, benefit: "Sort line-by-line content" },
        { title: "Line Counter Tool", slug: "line-counter-tool", icon: <CaseSensitive className="w-4 h-4" />, color: 274, benefit: "Count lines after cleanup" },
        { title: "Character Counter Tool", slug: "character-counter-tool", icon: <Type className="w-4 h-4" />, color: 28, benefit: "Track output length" },
        { title: "Word Counter", slug: "word-counter", icon: <BarChart3 className="w-4 h-4" />, color: 340, benefit: "Count words and reading length" },
        { title: "Case Converter", slug: "case-converter", icon: <CaseSensitive className="w-4 h-4" />, color: 180, benefit: "Alternative text conversion tool" },
      ]}
    />
  );
}
