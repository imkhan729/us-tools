import { useMemo, useState } from "react";
import { BarChart3, Dices, Hash, Shuffle, Type } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

export default function RandomPickerTool() {
  const [itemsInput, setItemsInput] = useState("");
  const [count, setCount] = useState("1");
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [pickedItems, setPickedItems] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const items = useMemo(
    () =>
      itemsInput
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean),
    [itemsInput],
  );

  const pickItems = () => {
    if (items.length === 0) {
      setPickedItems([]);
      return;
    }

    const requested = Math.max(1, Number.parseInt(count, 10) || 1);
    const limit = allowDuplicates ? requested : Math.min(requested, items.length);
    const pool = [...items];
    const result: string[] = [];

    for (let index = 0; index < limit; index += 1) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      result.push(pool[randomIndex]);
      if (!allowDuplicates) pool.splice(randomIndex, 1);
    }

    setPickedItems(result);
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(pickedItems.join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <UtilityToolPageShell
      title="Random Picker Tool"
      seoTitle="Random Picker Tool"
      seoDescription="Pick one or more random items from any custom list with optional duplicate picks using this free browser-based random picker."
      canonical="https://usonlinetools.com/productivity/random-picker-tool"
      categoryName="Productivity & Text"
      categoryHref="/category/productivity"
      heroDescription="Pick random names, choices, tasks, prompts, or raffle entries from any custom list. Choose one winner or multiple selections, with or without duplicates, and copy the result instantly."
      heroIcon={<Shuffle className="w-3.5 h-3.5" />}
      calculatorLabel="Random Selection"
      calculatorDescription="Choose winners or selections from your own list."
      calculator={
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 md:p-6 space-y-5">
          <div>
            <label htmlFor="picker-items" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
              List Items
            </label>
            <textarea
              id="picker-items"
              value={itemsInput}
              onChange={(event) => setItemsInput(event.target.value)}
              className="tool-calc-input min-h-[180px] w-full resize-y"
              placeholder={"One item per line\nAlice\nBob\nCharlie"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
            <div>
              <label htmlFor="picker-count" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Number of Picks
              </label>
              <input
                id="picker-count"
                type="number"
                min="1"
                value={count}
                onChange={(event) => setCount(event.target.value)}
                className="tool-calc-input w-full"
              />
            </div>
            <label className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center gap-3 self-end">
              <input type="checkbox" checked={allowDuplicates} onChange={(event) => setAllowDuplicates(event.target.checked)} />
              Allow duplicates
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-blue-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Items</p>
              <p className="text-2xl font-black text-blue-600">{items.length}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Requested</p>
              <p className="text-2xl font-black text-emerald-600">{Math.max(1, Number.parseInt(count, 10) || 1)}</p>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Mode</p>
              <p className="text-lg font-black text-violet-600">{allowDuplicates ? "Repeatable" : "Unique"}</p>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Last Run</p>
              <p className="text-lg font-black text-cyan-600">{pickedItems.length || 0} picked</p>
            </div>
          </div>

          <button onClick={pickItems} className="w-full rounded-xl bg-blue-500 py-3 text-sm font-black text-white hover:bg-blue-600 transition-colors">
            Pick Random Items
          </button>

          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Results</p>
              <button
                onClick={copyOutput}
                disabled={pickedItems.length === 0}
                className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {copied ? "Copied" : "Copy Results"}
              </button>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 min-h-[120px]">
              {pickedItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pickedItems.map((item, index) => (
                    <div key={`${item}-${index}`} className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Pick {index + 1}</p>
                      <p className="font-bold text-foreground break-words">{item}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Add a list and run the picker to see random results here.</p>
              )}
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Enter one item per line", description: "Paste names, prompts, entries, or any other options into the list box." },
        { title: "Choose how many results you want", description: "Pick a single winner or multiple selections depending on the use case." },
        { title: "Decide whether repeats are allowed", description: "Leave duplicates off for unique winners, or turn them on for repeatable random draws." },
        { title: "Run the picker and copy the results", description: "The chosen items appear instantly and can be copied into messages, spreadsheets, or notes." },
      ]}
      interpretationCards={[
        { title: "Unique mode", description: "Each picked item can appear only once. This is best for raffle winners, assigning turns, or fair one-time selection." },
        { title: "Duplicate mode", description: "The same item can be selected more than once. This is useful for simulations, repeated prompts, or random trials.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Pick count vs list size", description: "If duplicates are off, the tool caps picks at the number of available unique items.", className: "bg-violet-500/5 border-violet-500/20" },
      ]}
      examples={[
        { scenario: "Single winner", input: "Alice\\nBob\\nCharlie", output: "1 random name" },
        { scenario: "Three unique picks", input: "task A\\ntask B\\ntask C\\ntask D", output: "3 non-repeating results" },
        { scenario: "Repeatable draw", input: "red\\nblue\\ngreen", output: "possible duplicate picks" },
        { scenario: "Classroom chooser", input: "student list", output: "random caller order" },
      ]}
      whyChoosePoints={[
        "Works for real lists instead of requiring predefined choices. You control the exact pool of names or entries.",
        "Flexible enough for raffles, classrooms, planning, and creative prompts because you can switch between single and multiple picks.",
        "Fast and private. The list stays in the browser, and the results are ready to copy immediately.",
      ]}
      faqs={[
        { q: "Can I pick more items than the list contains?", a: "Yes only when duplicates are enabled. Otherwise the tool limits the result to the number of unique items available." },
        { q: "Does the tool ignore empty lines?", a: "Yes. Blank lines are removed automatically before random selection." },
        { q: "Is the selection weighted?", a: "No. Every valid line has the same chance of being picked." },
        { q: "Can I use it for raffles or giveaways?", a: "Yes. Unique mode is especially useful when you need a fair non-repeating winner selection from a list of entries." },
      ]}
      relatedTools={[
        { title: "Random Letter Generator", slug: "random-letter-generator", icon: <Hash className="w-4 h-4" />, color: 217, benefit: "Generate random letters" },
        { title: "Random Number Generator", slug: "random-number-generator", icon: <BarChart3 className="w-4 h-4" />, color: 152, benefit: "Generate numeric ranges" },
        { title: "Dice Roller", slug: "dice-roller", icon: <Dices className="w-4 h-4" />, color: 274, benefit: "Roll virtual dice" },
        { title: "Coin Flip", slug: "coin-flip", icon: <Shuffle className="w-4 h-4" />, color: 28, benefit: "Simple yes or no choice" },
        { title: "Sort Text Lines Tool", slug: "sort-text-lines-tool", icon: <Type className="w-4 h-4" />, color: 340, benefit: "Sort the list before drawing" },
        { title: "Duplicate Line Remover", slug: "duplicate-line-remover", icon: <Hash className="w-4 h-4" />, color: 185, benefit: "Clean repeated entries first" },
      ]}
    />
  );
}
