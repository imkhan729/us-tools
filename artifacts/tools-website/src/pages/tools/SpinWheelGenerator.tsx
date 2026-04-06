import { useMemo, useState } from "react";
import { Dices, ListOrdered, RotateCw, Shuffle, Trophy } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

function getWheelGradient(count: number) {
  if (count === 0) {
    return "conic-gradient(from 0deg, #E2E8F0 0deg 360deg)";
  }

  const slice = 360 / count;
  const colors = ["#2563EB", "#06B6D4", "#14B8A6", "#8B5CF6", "#F97316", "#EC4899", "#84CC16", "#F59E0B"];

  return `conic-gradient(from 0deg, ${Array.from({ length: count }, (_, index) => {
    const start = index * slice;
    const end = (index + 1) * slice;
    return `${colors[index % colors.length]} ${start}deg ${end}deg`;
  }).join(", ")})`;
}

export default function SpinWheelGenerator() {
  const [itemsInput, setItemsInput] = useState("Alice\nBob\nCharlie\nDiana\nEthan\nFarah");
  const [rotation, setRotation] = useState(0);
  const [selectedItem, setSelectedItem] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [copied, setCopied] = useState(false);

  const items = useMemo(
    () =>
      itemsInput
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean),
    [itemsInput],
  );

  const segmentAngle = items.length > 0 ? 360 / items.length : 0;
  const wheelGradient = useMemo(() => getWheelGradient(items.length), [items.length]);

  const spinWheel = () => {
    if (items.length === 0 || spinning) return;

    const winnerIndex = Math.floor(Math.random() * items.length);
    const midpoint = winnerIndex * segmentAngle + segmentAngle / 2;
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const requiredDelta = ((360 - midpoint - normalizedRotation) % 360 + 360) % 360;
    const nextRotation = rotation + 1800 + requiredDelta;

    setSpinning(true);
    setSelectedItem("");
    setRotation(nextRotation);

    window.setTimeout(() => {
      setSelectedItem(items[winnerIndex]);
      setSpinning(false);
    }, 4200);
  };

  const copyWinner = async () => {
    if (!selectedItem) return;
    await navigator.clipboard.writeText(selectedItem);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <UtilityToolPageShell
      title="Spin Wheel Generator"
      seoTitle="Spin Wheel Generator"
      seoDescription="Create a custom spin wheel from your own list and pick a random winner with a visual spinning wheel in the browser."
      canonical="https://usonlinetools.com/productivity/spin-wheel-generator"
      categoryName="Productivity & Text"
      categoryHref="/category/productivity"
      heroDescription="Turn any list into a visual lucky wheel for classrooms, giveaways, meetings, prompts, or team decisions. Add your own options, spin the wheel, and reveal a random winner instantly."
      heroIcon={<RotateCw className="w-3.5 h-3.5" />}
      calculatorLabel="Wheel Spinner"
      calculatorDescription="Build a custom wheel and spin for a random result."
      calculator={
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 md:p-6 space-y-5">
          <div>
            <label htmlFor="wheel-items" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Wheel Items
            </label>
            <textarea
              id="wheel-items"
              value={itemsInput}
              onChange={(event) => setItemsInput(event.target.value)}
              className="tool-calc-input min-h-[160px] w-full resize-y"
              placeholder={"One option per line\nAlice\nBob\nCharlie"}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-blue-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Options</p>
              <p className="text-2xl font-black text-blue-600">{items.length}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Slice Size</p>
              <p className="text-2xl font-black text-emerald-600">{segmentAngle ? `${Math.round(segmentAngle)}°` : "-"}</p>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Status</p>
              <p className="text-lg font-black text-violet-600">{spinning ? "Spinning" : "Ready"}</p>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Winner</p>
              <p className="text-lg font-black text-cyan-600 truncate">{selectedItem || "-"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_260px] gap-6 items-start">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="relative mx-auto w-full max-w-[360px] aspect-square">
                <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
                  <div className="h-0 w-0 border-l-[16px] border-r-[16px] border-t-[28px] border-l-transparent border-r-transparent border-t-blue-600" />
                </div>
                <div
                  className="absolute inset-0 rounded-full border-[10px] border-white shadow-lg transition-transform duration-[4000ms] ease-[cubic-bezier(0.18,0.9,0.2,1)]"
                  style={{ background: wheelGradient, transform: `rotate(${rotation}deg)` }}
                />
                <div className="absolute inset-[20%] rounded-full border border-white/50 bg-card/95 backdrop-blur flex flex-col items-center justify-center text-center px-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Spin Wheel</p>
                  <p className="mt-2 text-2xl font-black text-foreground">{items.length || 0}</p>
                  <p className="text-xs text-muted-foreground">custom options</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={spinWheel}
                disabled={items.length < 2 || spinning}
                className="w-full rounded-xl bg-blue-500 py-3 text-sm font-black text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {spinning ? "Spinning..." : "Spin the Wheel"}
              </button>

              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Selected Result</p>
                  <button
                    onClick={copyWinner}
                    disabled={!selectedItem}
                    className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="text-2xl font-black text-foreground break-words">{selectedItem || (spinning ? "Waiting for winner..." : "Spin to pick a winner")}</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Wheel Order</p>
                <div className="space-y-2 max-h-[220px] overflow-auto pr-1">
                  {items.length > 0 ? (
                    items.map((item, index) => (
                      <div key={`${item}-${index}`} className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-xs font-black text-blue-600">{index + 1}</span>
                        <span className="text-sm font-medium text-foreground break-words">{item}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Add at least two options to build the wheel.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Enter one option per line", description: "Add names, prompts, tasks, prizes, or any other choices you want the wheel to include." },
        { title: "Check the wheel order", description: "The list becomes the wheel segment order, so review it before spinning." },
        { title: "Spin the wheel", description: "The wheel rotates visually and lands on one random item." },
        { title: "Copy the winner", description: "Use the result for a raffle, classroom turn, prompt selection, or team decision." },
      ]}
      interpretationCards={[
        { title: "Segment count", description: "More segments mean each individual option takes a smaller angle on the wheel, but every option still has equal probability." },
        { title: "Visual draw", description: "The wheel is useful when you want random selection to feel visible and interactive instead of hidden behind a plain result box.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Winner output", description: "The final chosen item is also shown in text, so you can copy it even after the wheel stops spinning.", className: "bg-violet-500/5 border-violet-500/20" },
      ]}
      examples={[
        { scenario: "Classroom chooser", input: "student names", output: "next student selected randomly" },
        { scenario: "Team lunch picker", input: "restaurant list", output: "one place chosen visually" },
        { scenario: "Content prompts", input: "video or blog ideas", output: "random prompt for the next post" },
        { scenario: "Giveaway draw", input: "raffle entries", output: "one winner revealed on the wheel" },
      ]}
      whyChoosePoints={[
        "More engaging than a plain random picker when you want people to see the draw happen on screen.",
        "Still practical for real work. The winning option is also shown as text and can be copied immediately.",
        "Fast to customize because the wheel is generated directly from any pasted line list.",
      ]}
      faqs={[
        { q: "Does every option have the same chance?", a: "Yes. Each non-empty line becomes one equal segment on the wheel, so the probability is evenly distributed across items." },
        { q: "What happens if I only enter one item?", a: "The tool expects at least two options for a meaningful spin, so the spin button stays disabled until the list is large enough." },
        { q: "Can I use this for raffles or classroom decisions?", a: "Yes. The visual wheel format is especially useful when you want a random choice to be obvious to everyone watching." },
        { q: "Is the wheel saved anywhere?", a: "No. The options and results stay in the browser session unless you copy them somewhere else." },
      ]}
      relatedTools={[
        { title: "Random Picker Tool", slug: "random-picker-tool", icon: <Shuffle className="w-4 h-4" />, color: 217, benefit: "Pick from a list without a wheel" },
        { title: "List Randomizer Tool", slug: "list-randomizer-tool", icon: <ListOrdered className="w-4 h-4" />, color: 152, benefit: "Shuffle the full order of a list" },
        { title: "Random Number Generator", slug: "random-number-generator", icon: <Dices className="w-4 h-4" />, color: 274, benefit: "Generate random numeric ranges" },
        { title: "Coin Flip", slug: "coin-flip", icon: <RotateCw className="w-4 h-4" />, color: 28, benefit: "Make a simple binary choice" },
        { title: "Dice Roller", slug: "dice-roller", icon: <Dices className="w-4 h-4" />, color: 340, benefit: "Roll virtual dice" },
        { title: "Random Letter Generator", slug: "random-letter-generator", icon: <Trophy className="w-4 h-4" />, color: 185, benefit: "Generate random letters and prompts" },
      ]}
    />
  );
}
