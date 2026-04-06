import { useMemo, useState } from "react";
import {
  BarChart3,
  Copy,
  Gauge,
  RefreshCw,
  Scale,
  Shield,
  Swords,
  TrendingUp,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type Slot = {
  presetId: string;
  qty: string;
  customLabel: string;
  customValue: string;
  customDemand: string;
};

type ResolvedSlot = {
  label: string;
  qty: number;
  unitValue: number;
  totalValue: number;
  demand: number;
  rarity: string;
  note: string;
};

type DemandMode = "low" | "medium" | "high";

const FRUITS = [
  { id: "kitsune", label: "Kitsune", value: 130, demand: 5, rarity: "Mythical", note: "Top-end anchor fruit with elite trade pull." },
  { id: "dragon", label: "Dragon", value: 110, demand: 5, rarity: "Mythical", note: "Premium mythical with strong market leverage." },
  { id: "leopard", label: "Leopard", value: 75, demand: 5, rarity: "Mythical", note: "Very liquid and easy to center large deals around." },
  { id: "dough", label: "Dough", value: 55, demand: 5, rarity: "Mythical", note: "High demand because utility and PvP interest stay strong." },
  { id: "t-rex", label: "T-Rex", value: 32, demand: 4, rarity: "Mythical", note: "Often used as a serious balancing piece in larger deals." },
  { id: "spirit", label: "Spirit", value: 24, demand: 4, rarity: "Mythical", note: "Healthy mythical value with reliable recognition." },
  { id: "venom", label: "Venom", value: 22, demand: 4, rarity: "Mythical", note: "Useful mid-high mythical with decent resale." },
  { id: "control", label: "Control", value: 20, demand: 3, rarity: "Mythical", note: "More speculative than liquid in many trade rooms." },
  { id: "shadow", label: "Shadow", value: 16, demand: 3, rarity: "Mythical", note: "Common support add rather than a premium target." },
  { id: "mammoth", label: "Mammoth", value: 18, demand: 3, rarity: "Mythical", note: "Useful mid-tier mythical with moderate demand." },
  { id: "portal", label: "Portal", value: 14, demand: 5, rarity: "Legendary", note: "Low raw value but very high liquidity and utility." },
  { id: "buddha", label: "Buddha", value: 12, demand: 5, rarity: "Legendary", note: "Grind utility keeps the market active." },
  { id: "rumble", label: "Rumble", value: 11, demand: 4, rarity: "Legendary", note: "Steady supporting fruit with healthy demand." },
  { id: "blizzard", label: "Blizzard", value: 10, demand: 3, rarity: "Legendary", note: "Commonly used as a middle add in fair trades." },
  { id: "sound", label: "Sound", value: 8, demand: 3, rarity: "Legendary", note: "Useful balancing fruit when the gap is small." },
  { id: "phoenix", label: "Phoenix", value: 7, demand: 2, rarity: "Legendary", note: "Tradable, but market speed is inconsistent." },
  { id: "love", label: "Love", value: 6, demand: 2, rarity: "Legendary", note: "Lower-value add for minor overpay adjustments." },
  { id: "quake", label: "Quake", value: 5, demand: 2, rarity: "Legendary", note: "Filler fruit more than a headline trade piece." },
  { id: "spider", label: "Spider", value: 4, demand: 2, rarity: "Legendary", note: "Mostly useful for small balancing moves." },
  { id: "gravity", label: "Gravity", value: 4, demand: 1, rarity: "Mythical", note: "Rarity does not automatically translate into demand." },
] as const;

const FRUIT_BY_ID = Object.fromEntries(FRUITS.map((fruit) => [fruit.id, fruit]));
const createSlots = () => Array.from({ length: 4 }, () => ({
  presetId: "",
  qty: "1",
  customLabel: "",
  customValue: "",
  customDemand: "3",
}));

function toInt(input: string, fallback = 0) {
  const value = Number.parseInt(input, 10);
  return Number.isFinite(value) ? Math.max(0, value) : fallback;
}

function toNumber(input: string, fallback = 0) {
  const value = Number.parseFloat(input);
  return Number.isFinite(value) ? Math.max(0, value) : fallback;
}

function formatUnits(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

function formatPercent(value: number) {
  return `${value.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
}

function resolveSlot(slot: Slot): ResolvedSlot | null {
  if (!slot.presetId) return null;

  const qty = Math.max(1, toInt(slot.qty, 1));
  if (slot.presetId === "custom") {
    const unitValue = toNumber(slot.customValue, 0);
    if (unitValue <= 0) return null;
    const demand = Math.min(5, Math.max(1, toInt(slot.customDemand, 3)));
    return {
      label: slot.customLabel.trim() || "Custom Line",
      qty,
      unitValue,
      totalValue: unitValue * qty,
      demand,
      rarity: "Custom",
      note: "Manual row for perm deals, private-server pricing, or fast-moving community estimates.",
    };
  }

  const fruit = FRUIT_BY_ID[slot.presetId as keyof typeof FRUIT_BY_ID];
  if (!fruit) return null;

  return {
    label: fruit.label,
    qty,
    unitValue: fruit.value,
    totalValue: fruit.value * qty,
    demand: fruit.demand,
    rarity: fruit.rarity,
    note: fruit.note,
  };
}

function demandWeight(mode: DemandMode) {
  if (mode === "low") return 0.04;
  if (mode === "high") return 0.12;
  return 0.08;
}

function classifyResult(rawGapPercent: number, adjustedGap: number, targetMet: boolean) {
  if (targetMet && adjustedGap >= 0) {
    return { label: "Target Met", tone: "text-emerald-600", card: "border-emerald-500/20 bg-emerald-500/5" };
  }
  if (Math.abs(rawGapPercent) <= 5) {
    return { label: "Tight Fair Trade", tone: "text-blue-600", card: "border-blue-500/20 bg-blue-500/5" };
  }
  if (adjustedGap > 0) {
    return { label: "Good Value In", tone: "text-emerald-600", card: "border-emerald-500/20 bg-emerald-500/5" };
  }
  if (Math.abs(rawGapPercent) <= 15) {
    return { label: "Marginal Overpay", tone: "text-amber-600", card: "border-amber-500/20 bg-amber-500/5" };
  }
  return { label: "Clear Overpay", tone: "text-rose-600", card: "border-rose-500/20 bg-rose-500/5" };
}

export default function BloxFruitsTradeCalculator() {
  const [mySlots, setMySlots] = useState<Slot[]>(() => createSlots());
  const [theirSlots, setTheirSlots] = useState<Slot[]>(() => createSlots());
  const [targetOverpay, setTargetOverpay] = useState("5");
  const [mode, setMode] = useState<DemandMode>("medium");
  const [copiedLabel, setCopiedLabel] = useState("");

  const setSlot = (side: "mine" | "theirs", index: number, field: keyof Slot, value: string) => {
    const setter = side === "mine" ? setMySlots : setTheirSlots;
    setter((current) =>
      current.map((slot, slotIndex) => (slotIndex === index ? { ...slot, [field]: value } : slot)),
    );
  };

  const trade = useMemo(() => {
    const mine = mySlots.map(resolveSlot).filter(Boolean) as ResolvedSlot[];
    const theirs = theirSlots.map(resolveSlot).filter(Boolean) as ResolvedSlot[];
    const myTotal = mine.reduce((sum, item) => sum + item.totalValue, 0);
    const theirTotal = theirs.reduce((sum, item) => sum + item.totalValue, 0);
    const myDemand = mine.reduce((sum, item) => sum + item.demand * item.qty, 0);
    const theirDemand = theirs.reduce((sum, item) => sum + item.demand * item.qty, 0);
    const myCount = mine.reduce((sum, item) => sum + item.qty, 0);
    const theirCount = theirs.reduce((sum, item) => sum + item.qty, 0);
    const myAvgDemand = myCount ? myDemand / myCount : 0;
    const theirAvgDemand = theirCount ? theirDemand / theirCount : 0;
    const weight = demandWeight(mode);
    const myAdjusted = mine.reduce((sum, item) => sum + item.totalValue * (1 + (item.demand - 3) * weight), 0);
    const theirAdjusted = theirs.reduce((sum, item) => sum + item.totalValue * (1 + (item.demand - 3) * weight), 0);
    const rawGap = theirTotal - myTotal;
    const adjustedGap = theirAdjusted - myAdjusted;
    const rawGapPercent = Math.max(myTotal, theirTotal, 1) ? (rawGap / Math.max(myTotal, 1)) * 100 : 0;
    const targetPercent = toNumber(targetOverpay, 0);
    const targetNeeded = myTotal * (1 + targetPercent / 100);
    const unitsNeeded = Math.max(0, targetNeeded - theirTotal);
    const targetMet = theirTotal >= targetNeeded;
    const classification = classifyResult(rawGapPercent, adjustedGap, targetMet);
    const summary =
      adjustedGap >= 0
        ? "Demand-adjusted scoring says the incoming side is at least as liquid as the offer you are sending."
        : "Demand-adjusted scoring says the incoming side is weaker once liquidity and ease of re-trade are considered.";

    return {
      mine,
      theirs,
      myTotal,
      theirTotal,
      myDemand,
      theirDemand,
      myAvgDemand,
      theirAvgDemand,
      myAdjusted,
      theirAdjusted,
      rawGap,
      rawGapPercent,
      adjustedGap,
      targetPercent,
      targetNeeded,
      unitsNeeded,
      targetMet,
      classification,
      summary,
    };
  }, [mode, mySlots, targetOverpay, theirSlots]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const reset = () => {
    setMySlots(createSlots());
    setTheirSlots(createSlots());
    setTargetOverpay("5");
    setMode("medium");
  };

  const loadFairExample = () => {
    setMySlots([
      { presetId: "dough", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
      { presetId: "portal", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
      { presetId: "", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
      { presetId: "", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
    ]);
    setTheirSlots([
      { presetId: "leopard", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
      { presetId: "love", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
      { presetId: "", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
      { presetId: "", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
    ]);
  };

  const loadUtilityExample = () => {
    setMySlots([
      { presetId: "t-rex", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
      { presetId: "blizzard", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
      { presetId: "", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
      { presetId: "", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
    ]);
    setTheirSlots([
      { presetId: "buddha", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
      { presetId: "portal", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
      { presetId: "rumble", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
      { presetId: "", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
    ]);
  };

  const tradeSnippet = [
    `My offer: ${trade.mine.map((item) => `${item.label} x${item.qty}`).join(", ") || "No fruits"}`,
    `Their offer: ${trade.theirs.map((item) => `${item.label} x${item.qty}`).join(", ") || "No fruits"}`,
    `Raw totals: ${formatUnits(trade.myTotal)} out vs ${formatUnits(trade.theirTotal)} in`,
    `Demand-adjusted totals: ${formatUnits(trade.myAdjusted)} out vs ${formatUnits(trade.theirAdjusted)} in`,
    `Result: ${trade.classification.label}`,
  ].join("\n");

  const negotiationSnippet = [
    `Target overpay: ${formatPercent(trade.targetPercent)}`,
    `Target receive total: ${formatUnits(trade.targetNeeded)}`,
    `Additional value needed: ${formatUnits(trade.unitsNeeded)}`,
    `Demand mode: ${mode}`,
    `Summary: ${trade.summary}`,
  ].join("\n");

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={loadFairExample} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Fair Example
        </button>
        <button onClick={loadUtilityExample} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Utility Example
        </button>
        <button onClick={reset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Reset Trade
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Target minimum overpay</label>
                <div className="relative">
                  <input type="number" min="0" value={targetOverpay} onChange={(event) => setTargetOverpay(event.target.value)} className="tool-calc-input w-full pr-10" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Use this when you only want to accept deals that beat your current inventory by a defined margin.</p>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Demand sensitivity</label>
                <div className="flex overflow-hidden rounded-xl border border-border">
                  {([
                    ["low", "Low"],
                    ["medium", "Medium"],
                    ["high", "High"],
                  ] as [DemandMode, string][]).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setMode(value)}
                      className={`flex-1 py-2 text-sm font-bold transition-colors ${mode === value ? "bg-blue-500 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Higher sensitivity rewards liquid fruits like Portal and Buddha more aggressively in the adjusted score.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[
              { title: "Your Trade Side", rows: mySlots, side: "mine" as const },
              { title: "Incoming Trade Side", rows: theirSlots, side: "theirs" as const },
            ].map((panel) => (
              <div key={panel.title} className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">{panel.title}</p>
                    <p className="text-sm text-muted-foreground">Build the exact four-slot offer instead of checking one fruit at a time.</p>
                  </div>
                  <Swords className="w-5 h-5 text-blue-500" />
                </div>

                <div className="space-y-3">
                  {panel.rows.map((slot, index) => {
                    const resolved = resolveSlot(slot);
                    return (
                      <div key={`${panel.title}-${index}`} className="rounded-2xl border border-border bg-card p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-[1.6fr_0.6fr] gap-3">
                          <div>
                            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Slot {index + 1}</label>
                            <select value={slot.presetId} onChange={(event) => setSlot(panel.side, index, "presetId", event.target.value)} className="tool-calc-input w-full">
                              <option value="">Empty slot</option>
                              <option value="custom">Custom value row</option>
                              {FRUITS.map((fruit) => (
                                <option key={fruit.id} value={fruit.id}>
                                  {fruit.label} | {fruit.value} units
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Qty</label>
                            <input type="number" min="1" value={slot.qty} onChange={(event) => setSlot(panel.side, index, "qty", event.target.value)} className="tool-calc-input w-full" />
                          </div>
                        </div>

                        {slot.presetId === "custom" && (
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input type="text" placeholder="Custom label" value={slot.customLabel} onChange={(event) => setSlot(panel.side, index, "customLabel", event.target.value)} className="tool-calc-input w-full" />
                            <input type="number" min="0" placeholder="Value units" value={slot.customValue} onChange={(event) => setSlot(panel.side, index, "customValue", event.target.value)} className="tool-calc-input w-full" />
                            <select value={slot.customDemand} onChange={(event) => setSlot(panel.side, index, "customDemand", event.target.value)} className="tool-calc-input w-full">
                              <option value="1">Demand 1/5</option>
                              <option value="2">Demand 2/5</option>
                              <option value="3">Demand 3/5</option>
                              <option value="4">Demand 4/5</option>
                              <option value="5">Demand 5/5</option>
                            </select>
                          </div>
                        )}

                        <div className="mt-3 rounded-xl border border-border bg-muted/40 p-3">
                          {resolved ? (
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm font-bold text-foreground">{resolved.label}</p>
                                <div className="flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-widest">
                                  <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-blue-600">{resolved.rarity}</span>
                                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-emerald-600">{formatUnits(resolved.totalValue)} units</span>
                                  <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-violet-600">Demand {resolved.demand}/5</span>
                                </div>
                              </div>
                              <p className="text-xs leading-relaxed text-muted-foreground">{resolved.note}</p>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">Use an empty slot for a later add or switch it to custom mode for a private-market estimate.</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className={`rounded-2xl border p-5 ${trade.classification.card}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Trade Verdict</p>
                <h3 className={`mt-1 text-2xl font-black ${trade.classification.tone}`}>{trade.classification.label}</h3>
              </div>
              <Scale className="w-6 h-6 text-blue-500" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Raw out</p>
                <p className="mt-2 text-2xl font-black text-foreground">{formatUnits(trade.myTotal)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Raw in</p>
                <p className="mt-2 text-2xl font-black text-foreground">{formatUnits(trade.theirTotal)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Adj. out</p>
                <p className="mt-2 text-2xl font-black text-foreground">{formatUnits(trade.myAdjusted)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Adj. in</p>
                <p className="mt-2 text-2xl font-black text-foreground">{formatUnits(trade.theirAdjusted)}</p>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              <div className="rounded-xl border border-border bg-card p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Raw gap</span>
                  <strong className={trade.rawGap >= 0 ? "text-emerald-600" : "text-rose-600"}>{trade.rawGap >= 0 ? "+" : "-"}{formatUnits(Math.abs(trade.rawGap))} units</strong>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Raw gap %</span>
                  <strong className="text-foreground">{formatPercent(trade.rawGapPercent)}</strong>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Units needed for target</span>
                  <strong className="text-foreground">{formatUnits(trade.unitsNeeded)}</strong>
                </div>
              </div>

              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{trade.summary}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Negotiation Metrics</p>
            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Target receive total</span>
                  <strong className="text-foreground">{formatUnits(trade.targetNeeded)}</strong>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Your avg demand</span>
                  <strong className="text-foreground">{trade.myAvgDemand.toLocaleString("en-US", { maximumFractionDigits: 2 })}</strong>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Incoming avg demand</span>
                  <strong className="text-foreground">{trade.theirAvgDemand.toLocaleString("en-US", { maximumFractionDigits: 2 })}</strong>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Demand mode</span>
                  <strong className="text-foreground">{mode}</strong>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex items-start gap-3">
                  <Gauge className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Use the adjusted totals when the deal is close and you care about how easily the incoming fruits can be flipped later. Use the raw totals when both sides contain similarly liquid fruits and you only want a straightforward value check.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            <div className="space-y-3">
              {[
                { label: "Trade summary", value: tradeSnippet },
                { label: "Negotiation notes", value: negotiationSnippet },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                    <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                      {copiedLabel === item.label ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                    <code>{item.value}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
              <div>
                <p className="text-sm font-bold text-foreground">Why this page separates raw and demand-adjusted value</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Many Blox Fruits trades fail because the numbers look close but one side is full of slower fruits that are harder to move later. This page lets you inspect both the raw total and a demand-weighted version so you can decide whether a close trade is actually worth taking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Blox Fruits Trade Calculator"
      seoTitle="Blox Fruits Trade Calculator - Fairness, Overpay, and Demand Check"
      seoDescription="Free Blox Fruits trade calculator with editable fruit values, overpay targets, demand-weighted scoring, and copy-ready trade summaries."
      canonical="https://usonlinetools.com/gaming/blox-fruits-trade-calculator"
      categoryName="Gaming Calculators"
      categoryHref="/category/gaming"
      heroDescription="Use this dedicated Blox Fruits trade calculator to compare both sides of a fruit deal, measure raw value and demand-adjusted value, set a required overpay target, and decide whether the incoming side is actually worth accepting. The page is built for real trade-chat decisions instead of static lookup-only lists."
      heroIcon={<Scale className="w-3.5 h-3.5" />}
      calculatorLabel="Dedicated Trade Fairness Analyzer"
      calculatorDescription="Model the exact four-slot deal, adjust demand sensitivity, and see whether the offer clears your own minimum margin."
      calculator={calculator}
      howSteps={[
        {
          title: "Build the actual four-slot deal instead of estimating from memory",
          description:
            "Real Blox Fruits trades usually break down when players compare only the headline fruit and ignore the add structure. This page forces the full four-slot view on both sides because that is how the deal actually happens in-game. A trade calculator is only useful when it reflects the full bundle rather than a simplified version that hides the balancing pieces.",
        },
        {
          title: "Set the overpay target that matches your own trading style",
          description:
            "Not every player wants only a mathematically fair trade. Some players will not move a liquid fruit unless they get at least five or ten percent more value back. Others accept a dead-even swap when the incoming side fits their build better. The minimum overpay control exists because a trade calculator should adapt to the way you negotiate instead of assuming every player has the same threshold.",
        },
        {
          title: "Use demand sensitivity when liquidity matters more than nominal value",
          description:
            "One of the biggest differences between a weak trade checker and a useful one is whether it can reflect liquidity. A bundle of slower fruits can look equal on paper and still be worse to hold. The demand modes on this page let you decide how much that should matter. Low mode keeps the analysis close to raw value. High mode gives much more weight to fruits that move fast in active trading circles.",
        },
        {
          title: "Copy the summary when you want to negotiate instead of just checking once",
          description:
            "A practical Blox Fruits trade calculator should help you continue the conversation, not only judge it privately. The copy-ready summary and negotiation notes make it easy to paste the current totals, target gap, and demand-adjusted position into Discord or chat. That saves time and makes your counteroffer clearer when the other side asks what they still need to add.",
        },
      ]}
      interpretationCards={[
        {
          title: "Target met means the offer clears your chosen threshold",
          description:
            "This is stronger than simple fairness. If the target is set at five percent and the incoming side clears it, the offer is not only balanced under the current model, it also meets the margin you asked for before accepting.",
        },
        {
          title: "A tight fair trade can still be rejectable",
          description:
            "Fair only means the value gap is small. It does not mean the fruits fit your plan, your resale goals, or your preferred inventory shape. A tight deal is often where demand quality matters most.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Demand-adjusted wins are useful when the raw gap is small",
          description:
            "If the offer is close on raw value but better on adjusted value, the incoming side may be easier to move later. That is often enough to turn a borderline deal into an acceptable one for active traders.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Clear overpay means your inventory is carrying the deal",
          description:
            "When both the raw and adjusted numbers lean against you, the calculator is telling you the counterparty still needs to add more value or stronger demand pieces before the trade makes sense.",
          className: "bg-rose-500/5 border-rose-500/20",
        },
      ]}
      examples={[
        { scenario: "Headline fair trade", input: "Dough + Portal out, Leopard + Love in", output: "Close deal that can become acceptable if your overpay target is low" },
        { scenario: "Utility-heavy receive side", input: "T-Rex + Blizzard out, Buddha + Portal + Rumble in", output: "Demand-adjusted scoring may rate the incoming side more favorably" },
        { scenario: "Strict negotiator", input: "10% target overpay with medium demand sensitivity", output: "Shows how far the other side still is from your minimum" },
        { scenario: "Private server estimate", input: "Custom row with manual value and demand", output: "Lets you model non-standard offers without leaving the page" },
      ]}
      whyChoosePoints={[
        "This Blox Fruits Trade Calculator is narrower and more negotiation-focused than the broader Blox Fruits page. That is intentional. Players searching specifically for a trade calculator usually want a dedicated fairness verdict, a clear overpay number, and a way to compare liquidity without extra progression tools getting in the way. This route is built for that more focused intent.",
        "The widget handles the practical reality of the Blox Fruits market better than a simple total-sum checker because it separates raw value from demand-adjusted value. That matters when a deal includes fruits that are technically worth something but much harder to move. A trade tool that ignores liquidity often gives answers that feel wrong in actual chat rooms and community servers.",
        "The target overpay control also makes the page more useful than copycat calculators that only tell you whether a deal is roughly fair. Many traders do not want rough fairness. They want enough edge to justify giving up a premium liquid fruit. This page lets you encode that preference directly into the output instead of forcing you to do the margin math separately.",
        "The page also keeps the design and content structure consistent with the stronger tools already completed in this project. The calculator is supported by use guidance, interpretation notes, examples, FAQ content, snippets, and internal links. That makes the route stronger for both users and search intent instead of being just a thin utility panel with no context.",
        "Everything runs locally in the browser, which is appropriate for a fast game-trading workflow. You can adjust rows, change demand mode, test a counteroffer, and copy the result immediately without signing in or pushing private negotiation details to a backend service.",
      ]}
      faqs={[
        {
          q: "Does this calculator use official Blox Fruits values?",
          a: "No. It uses editable estimate units so the tool can stay useful even when the live community market shifts. There is no permanent official trade sheet that makes every server identical. The presets give you a quick baseline, and the custom rows let you adapt to the market you are actually in.",
        },
        {
          q: "Why would I use this instead of the broader Blox Fruits calculator page?",
          a: "Use this page when the trade itself is the whole question. It is focused on fairness, overpay targets, and demand-adjusted scoring. The broader page is better when you also want fragment planning and build allocation on the same route.",
        },
        {
          q: "What does demand-adjusted value mean here?",
          a: "It means the raw fruit value is modified by a demand sensitivity setting. Higher-demand fruits get a boost because they are typically easier to trade again later. Lower-demand fruits contribute less in the adjusted model even if their nominal value looks similar.",
        },
        {
          q: "Should I always accept if the page says target met?",
          a: "No. It means the offer clears the threshold you configured under the current value assumptions. You still need to consider whether the incoming fruits fit your own use case, whether you want the inventory shape, and whether the underlying preset values match your trade room.",
        },
        {
          q: "Why can a raw fair trade still look weak on adjusted scoring?",
          a: "Because two deals with similar totals can have very different liquidity. If the incoming side is made of slower fruits, the trade may be harder to recover from later even when the raw value looks balanced. That is exactly the situation adjusted scoring is meant to surface.",
        },
        {
          q: "Can I use custom rows for perm offers or special side deals?",
          a: "Yes. That is one of the main reasons the tool includes manual rows. You can enter a custom label, value, and demand score for special offers that are not represented well by the preset fruit ladder.",
        },
        {
          q: "Does the calculator save my offers?",
          a: "No. The offer state lives in the browser while the page is open. It is designed for quick local analysis and copy-paste negotiation rather than long-term trade tracking.",
        },
        {
          q: "Is this good on mobile during live trading?",
          a: "Yes. The layout is responsive and the controls are built to be usable on smaller screens, which matters when you are checking a live offer from Roblox chat or Discord on a phone.",
        },
      ]}
      relatedTools={[
        { title: "Blox Fruits Calculator", slug: "blox-fruits-calculator", icon: <Swords className="w-4 h-4" />, color: 210, benefit: "Use the broader values, fragments, and build page" },
        { title: "Percentage Calculator", slug: "percentage-calculator", icon: <TrendingUp className="w-4 h-4" />, color: 260, benefit: "Check custom overpay percentages manually" },
        { title: "Random Number Generator", slug: "random-number-generator", icon: <Gauge className="w-4 h-4" />, color: 145, benefit: "Quick randomizer for side decisions" },
        { title: "Random Picker Tool", slug: "random-picker-tool", icon: <BarChart3 className="w-4 h-4" />, color: 35, benefit: "Pick raids, fruits, or challenge goals" },
        { title: "Spin Wheel Generator", slug: "spin-wheel-generator", icon: <RefreshCw className="w-4 h-4" />, color: 20, benefit: "Randomize trade challenges or grind tasks" },
        { title: "D&D Dice Roller", slug: "dnd-dice-roller", icon: <Copy className="w-4 h-4" />, color: 320, benefit: "Another completed gaming route in the same category" },
      ]}
      ctaTitle="Need the Broader Blox Fruits Toolkit?"
      ctaDescription="Jump to the larger Blox Fruits page for fragments planning, build allocation, and a wider progression workflow."
      ctaHref="/gaming/blox-fruits-calculator"
    />
  );
}
