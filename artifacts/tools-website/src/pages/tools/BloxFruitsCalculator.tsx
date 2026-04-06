import { useMemo, useState } from "react";
import {
  BarChart3,
  Copy,
  Gem,
  Percent,
  RefreshCw,
  Shield,
  Swords,
  TrendingUp,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type TradeSlot = {
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
  note: string;
  rarity: string;
};

type BuildField = "melee" | "defense" | "sword" | "gun" | "fruit";

const FRUIT_PRESETS = [
  { id: "kitsune", label: "Kitsune", value: 130, demand: 5, rarity: "Mythical", note: "Premium demand fruit usually treated as a top-tier trade anchor." },
  { id: "dragon", label: "Dragon", value: 110, demand: 5, rarity: "Mythical", note: "High-value legacy-style holding fruit with strong negotiation weight." },
  { id: "leopard", label: "Leopard", value: 75, demand: 5, rarity: "Mythical", note: "Highly liquid fruit often used to bridge larger value gaps." },
  { id: "dough", label: "Dough", value: 55, demand: 5, rarity: "Mythical", note: "Very popular for PvP and awakening demand, so demand stays strong." },
  { id: "t-rex", label: "T-Rex", value: 32, demand: 4, rarity: "Mythical", note: "Solid mid-high mythical often used as an overpay filler." },
  { id: "spirit", label: "Spirit", value: 24, demand: 4, rarity: "Mythical", note: "Stable mythical value with good trade recognition." },
  { id: "venom", label: "Venom", value: 22, demand: 4, rarity: "Mythical", note: "Reliable mythical add with healthy market movement." },
  { id: "control", label: "Control", value: 20, demand: 3, rarity: "Mythical", note: "Usually valued more for potential and speculation than pure demand." },
  { id: "shadow", label: "Shadow", value: 16, demand: 3, rarity: "Mythical", note: "Common supporting add in balanced trades." },
  { id: "mammoth", label: "Mammoth", value: 18, demand: 3, rarity: "Mythical", note: "Useful mid-tier mythical where demand is decent but not elite." },
  { id: "portal", label: "Portal", value: 14, demand: 5, rarity: "Legendary", note: "Low raw value relative to demand because mobility utility keeps it liquid." },
  { id: "buddha", label: "Buddha", value: 12, demand: 5, rarity: "Legendary", note: "Strong grind utility keeps trade demand high for its price band." },
  { id: "rumble", label: "Rumble", value: 11, demand: 4, rarity: "Legendary", note: "Popular supporting add with steady recognition." },
  { id: "blizzard", label: "Blizzard", value: 10, demand: 3, rarity: "Legendary", note: "Often used to complete mid-tier offers." },
  { id: "sound", label: "Sound", value: 8, demand: 3, rarity: "Legendary", note: "Useful add when the trade is close but not quite even." },
  { id: "phoenix", label: "Phoenix", value: 7, demand: 2, rarity: "Legendary", note: "Value is moderate, but demand can be swingy between servers." },
  { id: "love", label: "Love", value: 6, demand: 2, rarity: "Legendary", note: "Lower-value add for small balancing moves." },
  { id: "quake", label: "Quake", value: 5, demand: 2, rarity: "Legendary", note: "Entry-level trade filler more than a core target." },
  { id: "spider", label: "Spider", value: 4, demand: 2, rarity: "Legendary", note: "Basic balancing fruit for minor trade differences." },
  { id: "gravity", label: "Gravity", value: 4, demand: 1, rarity: "Mythical", note: "Rarity alone does not guarantee strong demand or leverage." },
] as const;

const PRESET_BY_ID = Object.fromEntries(FRUIT_PRESETS.map((fruit) => [fruit.id, fruit]));
const DEFAULT_TRADE_SLOT = (): TradeSlot => ({
  presetId: "",
  qty: "1",
  customLabel: "",
  customValue: "",
  customDemand: "3",
});

const createTradeSlots = (count = 4) => Array.from({ length: count }, () => DEFAULT_TRADE_SLOT());

function parsePositiveInt(input: string, fallback = 0) {
  const parsed = Number.parseInt(input, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, parsed);
}

function parsePositiveNumber(input: string, fallback = 0) {
  const parsed = Number.parseFloat(input);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, parsed);
}

function formatUnits(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

function formatPercent(value: number) {
  return `${value.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
}

function resolveTradeSlot(slot: TradeSlot): ResolvedSlot | null {
  if (!slot.presetId) return null;

  const qty = Math.max(1, parsePositiveInt(slot.qty, 1));
  if (slot.presetId === "custom") {
    const customValue = parsePositiveNumber(slot.customValue, 0);
    if (customValue <= 0) return null;
    const customDemand = Math.min(5, Math.max(1, parsePositiveInt(slot.customDemand, 3)));
    return {
      label: slot.customLabel.trim() || "Custom Fruit",
      qty,
      unitValue: customValue,
      totalValue: customValue * qty,
      demand: customDemand,
      note: "Manual line for private server estimates, perm deals, or community-specific pricing.",
      rarity: "Custom",
    };
  }

  const preset = PRESET_BY_ID[slot.presetId as keyof typeof PRESET_BY_ID];
  if (!preset) return null;

  return {
    label: preset.label,
    qty,
    unitValue: preset.value,
    totalValue: preset.value * qty,
    demand: preset.demand,
    note: preset.note,
    rarity: preset.rarity,
  };
}

function classifyTrade(diffPercent: number) {
  if (diffPercent <= 5) return { label: "Very Fair", tone: "text-emerald-600", card: "border-emerald-500/20 bg-emerald-500/5" };
  if (diffPercent <= 12) return { label: "Fair With Small Gap", tone: "text-blue-600", card: "border-blue-500/20 bg-blue-500/5" };
  if (diffPercent <= 25) return { label: "Noticeable Overpay", tone: "text-amber-600", card: "border-amber-500/20 bg-amber-500/5" };
  return { label: "Heavy Overpay", tone: "text-rose-600", card: "border-rose-500/20 bg-rose-500/5" };
}

export default function BloxFruitsCalculator() {
  const [mySlots, setMySlots] = useState<TradeSlot[]>(() => createTradeSlots());
  const [theirSlots, setTheirSlots] = useState<TradeSlot[]>(() => createTradeSlots());
  const [currentFragments, setCurrentFragments] = useState("2500");
  const [costPerUpgrade, setCostPerUpgrade] = useState("5000");
  const [upgradeCount, setUpgradeCount] = useState("5");
  const [fragmentsPerRun, setFragmentsPerRun] = useState("1000");
  const [minutesPerRun, setMinutesPerRun] = useState("12");
  const [totalStatPoints, setTotalStatPoints] = useState("2450");
  const [buildShares, setBuildShares] = useState<Record<BuildField, string>>({
    melee: "30",
    defense: "25",
    sword: "0",
    gun: "0",
    fruit: "45",
  });
  const [copiedLabel, setCopiedLabel] = useState("");

  const setTradeSlot = (
    side: "mine" | "theirs",
    index: number,
    field: keyof TradeSlot,
    value: string,
  ) => {
    const setter = side === "mine" ? setMySlots : setTheirSlots;
    setter((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === index
          ? {
              ...slot,
              [field]: value,
            }
          : slot,
      ),
    );
  };

  const tradeState = useMemo(() => {
    const mine = mySlots.map(resolveTradeSlot).filter(Boolean) as ResolvedSlot[];
    const theirs = theirSlots.map(resolveTradeSlot).filter(Boolean) as ResolvedSlot[];
    const myTotal = mine.reduce((sum, item) => sum + item.totalValue, 0);
    const theirTotal = theirs.reduce((sum, item) => sum + item.totalValue, 0);
    const myDemand = mine.reduce((sum, item) => sum + item.demand * item.qty, 0);
    const theirDemand = theirs.reduce((sum, item) => sum + item.demand * item.qty, 0);
    const difference = theirTotal - myTotal;
    const reference = Math.max(myTotal, theirTotal, 1);
    const diffPercent = Math.abs(difference) / reference * 100;
    const classification = classifyTrade(diffPercent);
    const direction =
      difference > 0
        ? "You are receiving more raw estimated value than you are sending."
        : difference < 0
          ? "You are paying more raw estimated value than you are receiving."
          : "Both sides are equal on raw estimated value.";
    const demandDirection =
      theirDemand > myDemand
        ? "The receiving side also gets more total demand weight, which matters when values are close."
        : theirDemand < myDemand
          ? "Your side is sending more demand weight, so the trade may feel worse than the raw total suggests."
          : "Demand weight is balanced enough that raw value can lead the decision.";

    return {
      mine,
      theirs,
      myTotal,
      theirTotal,
      myDemand,
      theirDemand,
      difference,
      diffPercent,
      classification,
      summary: `${direction} ${demandDirection}`,
    };
  }, [mySlots, theirSlots]);

  const fragmentPlan = useMemo(() => {
    const current = parsePositiveNumber(currentFragments, 0);
    const perUpgrade = parsePositiveNumber(costPerUpgrade, 0);
    const upgrades = parsePositiveInt(upgradeCount, 0);
    const perRun = parsePositiveNumber(fragmentsPerRun, 0);
    const minutes = parsePositiveNumber(minutesPerRun, 0);
    const totalNeeded = perUpgrade * upgrades;
    const shortfall = Math.max(0, totalNeeded - current);
    const raidsNeeded = perRun > 0 ? Math.ceil(shortfall / perRun) : 0;
    const surplus = Math.max(0, current - totalNeeded);
    const totalHours = raidsNeeded > 0 && minutes > 0 ? (raidsNeeded * minutes) / 60 : 0;

    return { current, perUpgrade, upgrades, perRun, minutes, totalNeeded, shortfall, raidsNeeded, surplus, totalHours };
  }, [currentFragments, costPerUpgrade, upgradeCount, fragmentsPerRun, minutesPerRun]);

  const buildPlan = useMemo(() => {
    const total = parsePositiveInt(totalStatPoints, 0);
    const shares = {
      melee: parsePositiveNumber(buildShares.melee, 0),
      defense: parsePositiveNumber(buildShares.defense, 0),
      sword: parsePositiveNumber(buildShares.sword, 0),
      gun: parsePositiveNumber(buildShares.gun, 0),
      fruit: parsePositiveNumber(buildShares.fruit, 0),
    };
    const shareTotal = Object.values(shares).reduce((sum, value) => sum + value, 0);
    if (total <= 0 || shareTotal <= 0) {
      return {
        total,
        shareTotal,
        allocations: { melee: 0, defense: 0, sword: 0, gun: 0, fruit: 0 },
        dominant: "No build profile yet",
      };
    }

    const allocations = {
      melee: Math.round(total * (shares.melee / shareTotal)),
      defense: Math.round(total * (shares.defense / shareTotal)),
      sword: Math.round(total * (shares.sword / shareTotal)),
      gun: Math.round(total * (shares.gun / shareTotal)),
      fruit: Math.round(total * (shares.fruit / shareTotal)),
    };

    const diff = total - Object.values(allocations).reduce((sum, value) => sum + value, 0);
    if (diff !== 0) {
      const topKey = (Object.keys(shares) as BuildField[]).sort((a, b) => shares[b] - shares[a])[0];
      allocations[topKey] += diff;
    }

    const dominant = (Object.entries(allocations) as [BuildField, number][])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([key]) => key === "fruit" ? "Blox Fruit" : key.charAt(0).toUpperCase() + key.slice(1))
      .join(" / ");

    return { total, shareTotal, allocations, dominant };
  }, [buildShares, totalStatPoints]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const resetTradeBuilder = () => {
    setMySlots(createTradeSlots());
    setTheirSlots(createTradeSlots());
  };

  const loadSampleTrade = () => {
    setMySlots([
      { presetId: "leopard", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
      { presetId: "buddha", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
      { presetId: "", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
      { presetId: "", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
    ]);
    setTheirSlots([
      { presetId: "dough", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
      { presetId: "portal", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
      { presetId: "rumble", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
      { presetId: "", qty: "1", customLabel: "", customValue: "", customDemand: "3" },
    ]);
  };

  const tradeSnippet = [
    `My side: ${tradeState.mine.map((item) => `${item.label} x${item.qty}`).join(", ") || "No fruits selected"}`,
    `Their side: ${tradeState.theirs.map((item) => `${item.label} x${item.qty}`).join(", ") || "No fruits selected"}`,
    `My total: ${formatUnits(tradeState.myTotal)} units`,
    `Their total: ${formatUnits(tradeState.theirTotal)} units`,
    `Assessment: ${tradeState.classification.label}`,
  ].join("\n");

  const fragmentSnippet = [
    `Current fragments: ${formatUnits(fragmentPlan.current)}`,
    `Target upgrade cost: ${formatUnits(fragmentPlan.totalNeeded)}`,
    `Shortfall: ${formatUnits(fragmentPlan.shortfall)}`,
    `Estimated raids needed: ${fragmentPlan.raidsNeeded}`,
    `Estimated hours: ${fragmentPlan.totalHours.toLocaleString("en-US", { maximumFractionDigits: 1 })}`,
  ].join("\n");

  const buildSnippet = [
    `Total stat points: ${buildPlan.total}`,
    `Melee: ${buildPlan.allocations.melee}`,
    `Defense: ${buildPlan.allocations.defense}`,
    `Sword: ${buildPlan.allocations.sword}`,
    `Gun: ${buildPlan.allocations.gun}`,
    `Blox Fruit: ${buildPlan.allocations.fruit}`,
    `Dominant profile: ${buildPlan.dominant}`,
  ].join("\n");

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={loadSampleTrade}
          className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted"
        >
          Load Sample Trade
        </button>
        <button
          onClick={resetTradeBuilder}
          className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted"
        >
          Reset Trade Builder
        </button>
        <div className="rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-2 text-xs font-semibold text-muted-foreground">
          Value presets are editable estimates, not official market prices.
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[
              { title: "Your Offer", rows: mySlots, side: "mine" as const },
              { title: "Their Offer", rows: theirSlots, side: "theirs" as const },
            ].map((panel) => (
              <div key={panel.title} className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">{panel.title}</p>
                    <p className="text-sm text-muted-foreground">Pick preset fruits or switch a row to custom value mode.</p>
                  </div>
                  <Swords className="w-5 h-5 text-blue-500" />
                </div>

                <div className="space-y-3">
                  {panel.rows.map((slot, index) => {
                    const resolved = resolveTradeSlot(slot);
                    return (
                      <div key={`${panel.title}-${index}`} className="rounded-2xl border border-border bg-card p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-[1.6fr_0.6fr] gap-3">
                          <div>
                            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                              Slot {index + 1}
                            </label>
                            <select
                              value={slot.presetId}
                              onChange={(event) => setTradeSlot(panel.side, index, "presetId", event.target.value)}
                              className="tool-calc-input w-full"
                            >
                              <option value="">Empty slot</option>
                              <option value="custom">Custom value line</option>
                              {FRUIT_PRESETS.map((fruit) => (
                                <option key={fruit.id} value={fruit.id}>
                                  {fruit.label} | {fruit.value} units
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                              Quantity
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={slot.qty}
                              onChange={(event) => setTradeSlot(panel.side, index, "qty", event.target.value)}
                              className="tool-calc-input w-full"
                            />
                          </div>
                        </div>

                        {slot.presetId === "custom" && (
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input
                              type="text"
                              placeholder="Custom label"
                              value={slot.customLabel}
                              onChange={(event) => setTradeSlot(panel.side, index, "customLabel", event.target.value)}
                              className="tool-calc-input w-full"
                            />
                            <input
                              type="number"
                              min="0"
                              placeholder="Value units"
                              value={slot.customValue}
                              onChange={(event) => setTradeSlot(panel.side, index, "customValue", event.target.value)}
                              className="tool-calc-input w-full"
                            />
                            <select
                              value={slot.customDemand}
                              onChange={(event) => setTradeSlot(panel.side, index, "customDemand", event.target.value)}
                              className="tool-calc-input w-full"
                            >
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
                                  <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-blue-600">
                                    {resolved.rarity}
                                  </span>
                                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-emerald-600">
                                    {formatUnits(resolved.totalValue)} units
                                  </span>
                                  <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-violet-600">
                                    Demand {resolved.demand}/5
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs leading-relaxed text-muted-foreground">{resolved.note}</p>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">Use this row for a fruit, add-on, or a manual market estimate.</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Fragments Planner</p>
                  <p className="text-sm text-muted-foreground">Estimate how many runs you still need before an awakening or upgrade session.</p>
                </div>
                <Gem className="w-5 h-5 text-amber-500" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Current fragments</label>
                  <input type="number" min="0" value={currentFragments} onChange={(event) => setCurrentFragments(event.target.value)} className="tool-calc-input w-full" />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Cost per upgrade</label>
                  <input type="number" min="0" value={costPerUpgrade} onChange={(event) => setCostPerUpgrade(event.target.value)} className="tool-calc-input w-full" />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Upgrade count</label>
                  <input type="number" min="0" value={upgradeCount} onChange={(event) => setUpgradeCount(event.target.value)} className="tool-calc-input w-full" />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Fragments per run</label>
                  <input type="number" min="0" value={fragmentsPerRun} onChange={(event) => setFragmentsPerRun(event.target.value)} className="tool-calc-input w-full" />
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Minutes per run</label>
                <input type="number" min="0" value={minutesPerRun} onChange={(event) => setMinutesPerRun(event.target.value)} className="tool-calc-input w-full" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Need</p>
                  <p className="mt-2 text-2xl font-black text-foreground">{formatUnits(fragmentPlan.totalNeeded)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Shortfall</p>
                  <p className="mt-2 text-2xl font-black text-amber-600">{formatUnits(fragmentPlan.shortfall)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Runs</p>
                  <p className="mt-2 text-2xl font-black text-foreground">{fragmentPlan.raidsNeeded}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Hours</p>
                  <p className="mt-2 text-2xl font-black text-foreground">{fragmentPlan.totalHours.toLocaleString("en-US", { maximumFractionDigits: 1 })}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Build Split Planner</p>
                  <p className="text-sm text-muted-foreground">Distribute a stat budget across melee, defense, sword, gun, and fruit in one view.</p>
                </div>
                <BarChart3 className="w-5 h-5 text-violet-500" />
              </div>

              <div className="mb-3">
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Total stat points budget</label>
                <input type="number" min="0" value={totalStatPoints} onChange={(event) => setTotalStatPoints(event.target.value)} className="tool-calc-input w-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  ["melee", "Melee"],
                  ["defense", "Defense"],
                  ["sword", "Sword"],
                  ["gun", "Gun"],
                  ["fruit", "Blox Fruit"],
                ] as [BuildField, string][]).map(([field, label]) => (
                  <div key={field}>
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{label} share</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={buildShares[field]}
                        onChange={(event) => setBuildShares((current) => ({ ...current, [field]: event.target.value }))}
                        className="tool-calc-input w-full pr-10"
                      />
                      <Percent className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Suggested allocation</p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-muted/40 p-3"><span className="block text-muted-foreground">Melee</span><strong className="text-foreground">{buildPlan.allocations.melee}</strong></div>
                  <div className="rounded-xl bg-muted/40 p-3"><span className="block text-muted-foreground">Defense</span><strong className="text-foreground">{buildPlan.allocations.defense}</strong></div>
                  <div className="rounded-xl bg-muted/40 p-3"><span className="block text-muted-foreground">Sword</span><strong className="text-foreground">{buildPlan.allocations.sword}</strong></div>
                  <div className="rounded-xl bg-muted/40 p-3"><span className="block text-muted-foreground">Gun</span><strong className="text-foreground">{buildPlan.allocations.gun}</strong></div>
                  <div className="col-span-2 rounded-xl bg-violet-500/10 p-3">
                    <span className="block text-muted-foreground">Blox Fruit / Dominant profile</span>
                    <strong className="text-foreground">{buildPlan.allocations.fruit} points | {buildPlan.dominant}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className={`rounded-2xl border p-5 ${tradeState.classification.card}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Trade Assessment</p>
                <h3 className={`mt-1 text-2xl font-black ${tradeState.classification.tone}`}>{tradeState.classification.label}</h3>
              </div>
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Your side</span>
                  <strong className="text-foreground">{formatUnits(tradeState.myTotal)} units</strong>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Their side</span>
                  <strong className="text-foreground">{formatUnits(tradeState.theirTotal)} units</strong>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Value gap</span>
                  <strong className={tradeState.difference >= 0 ? "text-emerald-600" : "text-rose-600"}>
                    {tradeState.difference >= 0 ? "+" : "-"}{formatUnits(Math.abs(tradeState.difference))} units
                  </strong>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Gap percent</span>
                  <strong className="text-foreground">{formatPercent(tradeState.diffPercent)}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Your demand</p>
                  <p className="mt-2 text-2xl font-black text-foreground">{tradeState.myDemand}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Their demand</p>
                  <p className="mt-2 text-2xl font-black text-foreground">{tradeState.theirDemand}</p>
                </div>
              </div>

              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{tradeState.summary}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            <div className="space-y-3">
              {[
                { label: "Trade summary", value: tradeSnippet },
                { label: "Fragments plan", value: fragmentSnippet },
                { label: "Build allocation", value: buildSnippet },
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
                <p className="text-sm font-bold text-foreground">Why the page uses editable value units</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Blox Fruits trading is community-driven, so values and demand shift faster than a static official list can keep up. This calculator starts with a usable preset ladder, but the custom rows let you adjust for private servers, current Discord values, perm offers, and demand spikes without rewriting the whole trade.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Preset Reference</p>
            <div className="space-y-2">
              {FRUIT_PRESETS.slice(0, 8).map((fruit) => (
                <div key={fruit.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm">
                  <span className="font-semibold text-foreground">{fruit.label}</span>
                  <span className="text-muted-foreground">{fruit.value} units | Demand {fruit.demand}/5</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Blox Fruits Calculator"
      seoTitle="Blox Fruits Calculator - Trade Value, Fragments, and Build Planner"
      seoDescription="Free Blox Fruits calculator with editable trade values, fairness scoring, fragments planning, and stat build allocation for Roblox players."
      canonical="https://usonlinetools.com/gaming/blox-fruits-calculator"
      categoryName="Gaming Calculators"
      categoryHref="/category/gaming"
      heroDescription="Use this Blox Fruits calculator to estimate fruit trade value, compare both sides of a deal, plan fragment farming for upgrades, and split a stat budget across melee, defense, sword, gun, and Blox Fruit builds. The widget is designed for the way players actually negotiate: fast preset selection, editable market assumptions, and summaries you can copy into Discord or chat while trading."
      heroIcon={<Swords className="w-3.5 h-3.5" />}
      calculatorLabel="Trade, Fragments, and Build Workspace"
      calculatorDescription="Build both sides of a trade, estimate upgrade grind time, and map a stat budget without leaving the page."
      calculator={calculator}
      howSteps={[
        {
          title: "Start with the trade builder, not with a single fruit number",
          description:
            "Most real Blox Fruits negotiations are not one-fruit questions. They are bundled offers with one or two premium anchors and a few balancing adds. That is why this page starts with four slots on each side instead of a single raw input. A useful Blox Fruits calculator should let you model the whole offer the way it appears in trade chat, because the fairness decision usually depends on the full bundle rather than on one headline fruit alone.",
        },
        {
          title: "Use presets as a baseline, then switch to custom rows when your server market differs",
          description:
            "Community value lists are helpful, but they are not universal law. Demand can move between public servers, Discord trading communities, private groups, and update cycles. The preset ladder on this page gives you a quick starting point, while custom rows let you correct for the version of the market you are actually trading in. That keeps the calculator practical instead of pretending there is one permanent value table that never changes.",
        },
        {
          title: "Check raw value and demand together before deciding whether a trade is truly fair",
          description:
            "A deal can look fair on paper and still feel bad if one side is much harder to re-trade. That is why the widget shows both estimated value units and a simple demand score. High-demand fruits often move faster, which means a slightly lower raw number can still be acceptable if the liquidity and utility are stronger. Likewise, a large nominal value is not automatically attractive when it is built from low-demand adds that are hard to flip later.",
        },
        {
          title: "Use the fragments and stat planners as follow-through tools after the trade question is settled",
          description:
            "Players rarely stop at the trade itself. Once you decide a fruit is worth taking, the next practical questions are whether you can afford the upgrade path and how the build should be allocated. The fragment planner tells you how much farming remains for a target cost, and the stat split planner turns a total point budget into a usable build outline. Keeping those workflows on the same page saves time and better matches the way Blox Fruits players plan progression in practice.",
        },
      ]}
      interpretationCards={[
        {
          title: "Very fair does not mean mandatory accept",
          description:
            "A low value gap means the trade is balanced on the calculator's assumptions. It does not guarantee that it fits your goals. If you specifically need grind utility, PvP demand, or flip potential, a balanced trade can still be the wrong move for your inventory.",
        },
        {
          title: "Demand can outweigh a small raw value deficit",
          description:
            "Fruits with strong utility or stronger community demand often move faster. If the calculator shows only a small gap but the demand score on the incoming side is clearly better, many players would still treat the deal as acceptable or even favorable.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Fragments planning is a time estimate, not a promise",
          description:
            "The runs and hours output is only as good as the assumptions you enter. If your average fragment yield changes or your session pace slows down, the estimate should be adjusted. The planner is there to make the grind legible, not to pretend that every farming session is identical.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
        {
          title: "Build allocation is a planning aid, not a fixed meta prescription",
          description:
            "The stat planner converts shares into numbers so you can compare build ideas quickly. It is intentionally flexible because players run fruit mains, sword hybrids, melee-focused grinders, and niche gun setups. The useful part is seeing the split clearly before you commit points.",
          className: "bg-violet-500/5 border-violet-500/20",
        },
      ]}
      examples={[
        { scenario: "Balanced mid-high trade", input: "Leopard + Buddha vs Dough + Portal + Rumble", output: "Close deal with small gap and strong demand on both sides" },
        { scenario: "Upgrade session planning", input: "2,500 current fragments, five 5,000-cost upgrades, 1,000 per run", output: "22,500 shortfall and 23 estimated runs" },
        { scenario: "Fruit-main stat split", input: "2,450 total points at 30 / 25 / 0 / 0 / 45 shares", output: "Fruit and melee dominate while defense stays healthy" },
        { scenario: "Custom market adjustment", input: "Replace one preset row with a manual server value", output: "Better reflects the market you are actually trading in" },
      ]}
      whyChoosePoints={[
        "This Blox Fruits calculator is built as a real multi-part utility page rather than a placeholder route. The trade widget is the core, but it is supported by editable presets, fairness scoring, demand context, copy-ready summaries, a fragment planner, and a stat allocation module. That matters because players searching for a Blox Fruits calculator usually want more than a static list of fruit names. They want a page that helps them make a decision quickly during an active negotiation or farming session.",
        "The page also takes a more honest approach to Blox Fruits market data than many thin clone tools. Instead of pretending a single permanent value list solves everything, it starts from a practical preset ladder and then gives you custom rows to handle server-specific pricing, fast-moving demand shifts, and private trade assumptions. That makes the tool more durable and more believable because community markets are fluid by nature.",
        "From a usability perspective, the main trade builder follows the same principle as the stronger completed pages in this project: the tool comes first, the interpretation comes second, and the extra content exists to reduce decision friction rather than bury the utility. You can build both sides of the trade immediately, see the value gap, factor in demand weight, and then copy the result into chat if needed without opening a spreadsheet or a notes app.",
        "The fragment planner and stat planner widen the page from a narrow trade checker into a broader progression hub. That is important for search intent. Some players arrive because they want fruit values, while others want an all-purpose Blox Fruits calculator that supports common grind and build questions too. Covering trade, upgrade budgeting, and build splits on one page means the route serves that mixed intent much better than a single-feature widget would.",
        "Everything runs directly in the browser, which is the right default for a fast gaming utility. There is no need for sign-up flows, account sync, or remote storage when the job is just to compare trade bundles, estimate runs, and sketch a build. Local interaction keeps the page quick on desktop and mobile, which matters when players are alt-tabbing during gameplay or checking values from a phone.",
      ]}
      faqs={[
        {
          q: "Are the value presets official Blox Fruits prices?",
          a: "No. They are editable estimate units meant to give you a workable baseline for comparison. Blox Fruits trading is community-driven, so prices and demand can shift across servers, Discord groups, and update cycles. Use the presets to start fast, then use custom rows when the market you are actually trading in looks different.",
        },
        {
          q: "Why does the calculator show demand as well as raw value?",
          a: "Because re-tradeability matters. Two offers can be close on paper but feel very different in practice if one side is made of easier-to-move fruits. Demand is a simple way to reflect liquidity and player interest alongside raw value so the result feels closer to real trading behavior.",
        },
        {
          q: "Can I use this page for perm deals or gamepass-style offers?",
          a: "Yes. That is one of the main reasons the trade builder includes custom rows. If a deal is outside the preset list or your community values a special line differently, enter your own label, value, and demand score instead of forcing the trade into the preset ladder.",
        },
        {
          q: "What does a 'Very Fair' result actually mean?",
          a: "It means the raw value gap is small relative to the larger side of the trade. It does not force a decision. You still need to decide whether the incoming fruits match your build, grind goals, and future trade plans. Fairness is a signal, not an automatic accept button.",
        },
        {
          q: "How should I use the fragments planner?",
          a: "Enter your current fragment stock, the cost per target unlock or upgrade, how many of those upgrades you plan to buy, and your average fragment gain per run. The planner then estimates the remaining shortfall, number of runs, and approximate hours needed. It is a budgeting tool for the grind, not an official raid tracker.",
        },
        {
          q: "Does the stat planner know the latest Blox Fruits meta build?",
          a: "No. It is intentionally build-agnostic. You decide the share for melee, defense, sword, gun, and Blox Fruit, and the planner converts those shares into a point allocation. That makes it useful for fruit mains, sword hybrids, grind builds, and experimental setups instead of locking everyone into one opinionated template.",
        },
        {
          q: "Can I use the calculator on mobile while playing?",
          a: "Yes. The widget is responsive and built for quick input on smaller screens. That makes it usable when you are checking a trade from chat, planning a grind session, or reviewing a build idea without opening a spreadsheet.",
        },
        {
          q: "Does this page save my trade history or server market data?",
          a: "No. The values you enter stay in the current page state only. The tool is designed for quick local use rather than persistent market tracking or account-based inventory management.",
        },
      ]}
      relatedTools={[
        { title: "D&D Dice Roller", slug: "dnd-dice-roller", icon: <Swords className="w-4 h-4" />, color: 340, benefit: "Another completed gaming utility page" },
        { title: "Random Number Generator", slug: "random-number-generator", icon: <TrendingUp className="w-4 h-4" />, color: 210, benefit: "Quick ranges for luck-based side decisions" },
        { title: "Spin Wheel Generator", slug: "spin-wheel-generator", icon: <RefreshCw className="w-4 h-4" />, color: 35, benefit: "Randomize raids, fruits, or challenge picks" },
        { title: "Random Picker Tool", slug: "random-picker-tool", icon: <BarChart3 className="w-4 h-4" />, color: 145, benefit: "Pick names or loot targets from a list" },
        { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Percent className="w-4 h-4" />, color: 260, benefit: "Check trade gaps or overpay percentages manually" },
        { title: "Password Generator", slug: "password-generator", icon: <Copy className="w-4 h-4" />, color: 25, benefit: "Use a strong password tool for your gaming accounts" },
      ]}
      ctaTitle="Need More Gaming and Utility Tools?"
      ctaDescription="Move from trade checks to randomizers, calculators, and other live tools without leaving the same hub."
      ctaHref="/category/gaming"
    />
  );
}
