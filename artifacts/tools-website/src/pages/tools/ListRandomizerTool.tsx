import { useMemo, useState } from "react";
import { ArrowUpDown, Copy, ListOrdered, Shuffle, Sparkles } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

function fisherYatesShuffle(items: string[]) {
  const output = [...items];

  for (let index = output.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [output[index], output[randomIndex]] = [output[randomIndex], output[index]];
  }

  return output;
}

export default function ListRandomizerTool() {
  const [text, setText] = useState("");
  const [removeBlankLines, setRemoveBlankLines] = useState(true);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [randomized, setRandomized] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const preparedLines = useMemo(() => {
    let lines = text.split(/\r?\n/);
    if (removeBlankLines) lines = lines.filter((line) => line.trim().length > 0);
    lines = lines.map((line) => line.trim());
    if (removeDuplicates) lines = Array.from(new Set(lines));
    return lines.filter((line) => line.length > 0 || !removeBlankLines);
  }, [removeBlankLines, removeDuplicates, text]);

  const output = randomized.join("\n");

  const randomizeList = () => {
    if (preparedLines.length === 0) {
      setRandomized([]);
      return;
    }

    setRandomized(fisherYatesShuffle(preparedLines));
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <UtilityToolPageShell
      title="List Randomizer Tool"
      seoTitle="List Randomizer Tool"
      seoDescription="Shuffle the order of any line-based list with optional duplicate removal and blank-line cleanup using this free list randomizer."
      canonical="https://usonlinetools.com/productivity/list-randomizer-tool"
      categoryName="Productivity & Text"
      categoryHref="/category/productivity"
      heroDescription="Randomize the full order of any list in one click. Shuffle names, tasks, prompts, agenda items, or entries, then copy the randomized order for meetings, games, planning, or classroom use."
      heroIcon={<Shuffle className="w-3.5 h-3.5" />}
      calculatorLabel="List Shuffle"
      calculatorDescription="Shuffle an entire line-based list and copy the new order."
      calculator={
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 md:p-6 space-y-5">
          <div>
            <label htmlFor="randomizer-input" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Input List
            </label>
            <textarea
              id="randomizer-input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="tool-calc-input min-h-[180px] w-full resize-y"
              placeholder={"One item per line\nTask 1\nTask 2\nTask 3"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center gap-3">
              <input type="checkbox" checked={removeBlankLines} onChange={(event) => setRemoveBlankLines(event.target.checked)} />
              Remove blank lines
            </label>
            <label className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center gap-3">
              <input type="checkbox" checked={removeDuplicates} onChange={(event) => setRemoveDuplicates(event.target.checked)} />
              Remove duplicates first
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-blue-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Prepared Lines</p>
              <p className="text-2xl font-black text-blue-600">{preparedLines.length}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Output Lines</p>
              <p className="text-2xl font-black text-emerald-600">{randomized.length}</p>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Cleanup</p>
              <p className="text-lg font-black text-violet-600">{removeDuplicates ? "Deduped" : "Raw"}</p>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Last Action</p>
              <p className="text-lg font-black text-cyan-600">{randomized.length > 0 ? "Shuffled" : "Waiting"}</p>
            </div>
          </div>

          <button
            onClick={randomizeList}
            className="w-full rounded-xl bg-blue-500 py-3 text-sm font-black text-white hover:bg-blue-600 transition-colors"
          >
            Randomize List
          </button>

          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <label htmlFor="randomizer-output" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Randomized Output
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
              id="randomizer-output"
              readOnly
              value={output}
              className="tool-calc-input min-h-[180px] w-full resize-y bg-muted/40"
              placeholder="Randomized lines appear here..."
            />
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste one item per line", description: "Add the list you want to shuffle, such as names, agenda items, prompts, or task order." },
        { title: "Choose cleanup rules", description: "Remove blank lines and optionally strip duplicates before the shuffle is generated." },
        { title: "Randomize the list", description: "The tool applies a full shuffle so the entire order changes, not just one selected item." },
        { title: "Copy the new order", description: "Paste the randomized list into notes, spreadsheets, assignments, or team workflows." },
      ]}
      interpretationCards={[
        { title: "Full shuffle", description: "Every prepared line is kept, but the order is randomized so the whole list becomes a new sequence." },
        { title: "Duplicate cleanup", description: "When duplicate removal is enabled, repeated lines are collapsed before randomization starts.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Blank-line cleanup", description: "Removing empty rows keeps the final output cleaner and prevents visual gaps in the shuffled list.", className: "bg-violet-500/5 border-violet-500/20" },
      ]}
      examples={[
        { scenario: "Speaking order", input: "Alice\\nBob\\nCharlie", output: "Charlie\\nAlice\\nBob" },
        { scenario: "Prompt queue", input: "idea A\\nidea B\\nidea C\\nidea D", output: "one randomized order" },
        { scenario: "Task planning", input: "design\\nreview\\ndeploy", output: "fresh execution order" },
        { scenario: "Duplicate cleanup", input: "red\\nred\\nblue", output: "two-line shuffled result" },
      ]}
      whyChoosePoints={[
        "Useful when you need the entire order shuffled instead of just selecting one winner from the list.",
        "Quick cleanup options help you avoid empty rows and repeated entries before randomizing.",
        "The output stays line-based, so it is easy to paste into spreadsheets, task docs, and chat messages.",
      ]}
      faqs={[
        { q: "How is this different from a random picker?", a: "A random picker chooses one or a few items. A list randomizer shuffles the entire order of the list and keeps all entries." },
        { q: "Will duplicate removal happen before or after shuffling?", a: "Before shuffling. The list is cleaned first, then the randomized order is generated from the remaining unique lines." },
        { q: "Can I randomize a numbered list?", a: "Yes. Each line is treated as plain text, so numbered entries can still be shuffled in a new order." },
        { q: "Does the tool save the shuffled list?", a: "No. The randomized output stays in the browser until you copy it or replace it with another run." },
      ]}
      relatedTools={[
        { title: "Random Picker Tool", slug: "random-picker-tool", icon: <Shuffle className="w-4 h-4" />, color: 217, benefit: "Choose one or more winners" },
        { title: "Spin Wheel Generator", slug: "spin-wheel-generator", icon: <Sparkles className="w-4 h-4" />, color: 152, benefit: "Use a visual random wheel" },
        { title: "Sort Text Lines Tool", slug: "sort-text-lines-tool", icon: <ArrowUpDown className="w-4 h-4" />, color: 274, benefit: "Sort lists instead of shuffling" },
        { title: "Remove Extra Spaces Tool", slug: "remove-extra-spaces-tool", icon: <Copy className="w-4 h-4" />, color: 28, benefit: "Clean the list before randomizing" },
        { title: "Duplicate Line Remover", slug: "duplicate-line-remover", icon: <ListOrdered className="w-4 h-4" />, color: 340, benefit: "Strip repeated rows first" },
        { title: "Line Counter Tool", slug: "line-counter-tool", icon: <ListOrdered className="w-4 h-4" />, color: 185, benefit: "Check the total number of entries" },
      ]}
    />
  );
}
