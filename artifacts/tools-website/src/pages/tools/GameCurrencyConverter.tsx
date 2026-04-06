import { useMemo, useState } from "react";
import {
  BarChart3,
  Coins,
  Copy,
  Gauge,
  RotateCcw,
  Shield,
  ShoppingCart,
  Target,
  TrendingUp,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

function toNumber(input: string, fallback = 0) {
  const value = Number.parseFloat(input);
  return Number.isFinite(value) ? value : fallback;
}

function positive(input: string, fallback = 0) {
  return Math.max(0, toNumber(input, fallback));
}

function format(value: number, digits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

type PackState = {
  name: string;
  price: string;
  currency: string;
  bonus: string;
};

export default function GameCurrencyConverter() {
  const [packA, setPackA] = useState<PackState>({ name: "Small Pack", price: "4.99", currency: "500", bonus: "0" });
  const [packB, setPackB] = useState<PackState>({ name: "Medium Pack", price: "9.99", currency: "1100", bonus: "100" });
  const [packC, setPackC] = useState<PackState>({ name: "Large Pack", price: "19.99", currency: "2400", bonus: "400" });
  const [targetCostInput, setTargetCostInput] = useState("1800");
  const [ownedCurrencyInput, setOwnedCurrencyInput] = useState("250");
  const [dailyFreeInput, setDailyFreeInput] = useState("60");
  const [copiedLabel, setCopiedLabel] = useState("");

  const analysis = useMemo(() => {
    const packs = [packA, packB, packC].map((pack, index) => {
      const price = positive(pack.price, 0);
      const currency = positive(pack.currency, 0);
      const bonus = positive(pack.bonus, 0);
      const totalCurrency = currency + bonus;
      const costPer100 = totalCurrency > 0 ? (price / totalCurrency) * 100 : 0;
      return {
        id: index,
        name: pack.name.trim() || `Pack ${index + 1}`,
        price,
        currency,
        bonus,
        totalCurrency,
        costPer100,
      };
    });

    const validPacks = packs.filter((pack) => pack.price > 0 && pack.totalCurrency > 0);
    const sortedByValue = [...validPacks].sort((a, b) => a.costPer100 - b.costPer100);
    const bestPack = sortedByValue[0] ?? null;
    const targetCost = positive(targetCostInput, 0);
    const ownedCurrency = positive(ownedCurrencyInput, 0);
    const dailyFree = positive(dailyFreeInput, 0);
    const currencyGap = Math.max(0, targetCost - ownedCurrency);
    const grindDays = dailyFree > 0 ? currencyGap / dailyFree : 0;

    const purchasePlans = validPacks.map((pack) => {
      const quantity = pack.totalCurrency > 0 ? Math.ceil(currencyGap / pack.totalCurrency) : 0;
      const totalSpend = quantity * pack.price;
      const totalCurrencyBought = quantity * pack.totalCurrency;
      const overshoot = Math.max(0, totalCurrencyBought - currencyGap);
      return {
        name: pack.name,
        quantity,
        totalSpend,
        totalCurrencyBought,
        overshoot,
        costPer100: pack.costPer100,
      };
    });

    const cheapestTargetPlan = [...purchasePlans]
      .filter((plan) => plan.quantity > 0)
      .sort((a, b) => a.totalSpend - b.totalSpend)[0] ?? null;

    return {
      packs,
      bestPack,
      targetCost,
      ownedCurrency,
      dailyFree,
      currencyGap,
      grindDays,
      purchasePlans,
      cheapestTargetPlan,
    };
  }, [dailyFreeInput, ownedCurrencyInput, packA, packB, packC, targetCostInput]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const resetAll = () => {
    setPackA({ name: "Small Pack", price: "4.99", currency: "500", bonus: "0" });
    setPackB({ name: "Medium Pack", price: "9.99", currency: "1100", bonus: "100" });
    setPackC({ name: "Large Pack", price: "19.99", currency: "2400", bonus: "400" });
    setTargetCostInput("1800");
    setOwnedCurrencyInput("250");
    setDailyFreeInput("60");
  };

  const loadGachaPreset = () => {
    setPackA({ name: "Starter Pulls", price: "4.99", currency: "300", bonus: "30" });
    setPackB({ name: "Monthly Stack", price: "14.99", currency: "980", bonus: "120" });
    setPackC({ name: "Whale Bundle", price: "29.99", currency: "2100", bonus: "500" });
    setTargetCostInput("1600");
    setOwnedCurrencyInput("150");
    setDailyFreeInput("50");
  };

  const loadShooterPreset = () => {
    setPackA({ name: "Starter Coins", price: "4.99", currency: "600", bonus: "0" });
    setPackB({ name: "Battle Pass Coins", price: "9.99", currency: "1400", bonus: "100" });
    setPackC({ name: "Vault Bundle", price: "24.99", currency: "3500", bonus: "700" });
    setTargetCostInput("2200");
    setOwnedCurrencyInput("500");
    setDailyFreeInput("80");
  };

  const valueSnippet = analysis.packs
    .map((pack) => `${pack.name}: ${format(pack.totalCurrency, 0)} currency for $${format(pack.price, 2)} | ${format(pack.costPer100, 3)} per 100`)
    .join("\n");

  const targetSnippet = [
    `Target item cost: ${format(analysis.targetCost, 0)}`,
    `Owned currency: ${format(analysis.ownedCurrency, 0)}`,
    `Currency gap: ${format(analysis.currencyGap, 0)}`,
    `Best value pack: ${analysis.bestPack?.name ?? "N/A"}`,
    `Cheapest target plan: ${analysis.cheapestTargetPlan ? `${analysis.cheapestTargetPlan.quantity} x ${analysis.cheapestTargetPlan.name} for $${format(analysis.cheapestTargetPlan.totalSpend, 2)}` : "N/A"}`,
  ].join("\n");

  const grindSnippet = [
    `Daily free currency: ${format(analysis.dailyFree, 0)}`,
    `Currency gap: ${format(analysis.currencyGap, 0)}`,
    `Estimated grind days: ${analysis.dailyFree > 0 ? format(analysis.grindDays, 2) : "N/A"}`,
    `Best value paid shortcut: ${analysis.bestPack ? analysis.bestPack.name : "N/A"}`,
  ].join("\n");

  const renderPackCard = (
    title: string,
    pack: PackState,
    setPack: (value: PackState) => void,
    metrics: { totalCurrency: number; costPer100: number },
  ) => (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
      <input value={pack.name} onChange={(event) => setPack({ ...pack, name: event.target.value })} className="tool-calc-input w-full" />
      <div className="grid grid-cols-3 gap-3">
        <input type="number" min="0" step="0.01" value={pack.price} onChange={(event) => setPack({ ...pack, price: event.target.value })} className="tool-calc-input w-full" />
        <input type="number" min="0" step="1" value={pack.currency} onChange={(event) => setPack({ ...pack, currency: event.target.value })} className="tool-calc-input w-full" />
        <input type="number" min="0" step="1" value={pack.bonus} onChange={(event) => setPack({ ...pack, bonus: event.target.value })} className="tool-calc-input w-full" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Total Currency</p>
          <p className="mt-1 text-xl font-black text-foreground">{format(metrics.totalCurrency, 0)}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Cost / 100</p>
          <p className="mt-1 text-xl font-black text-foreground">${format(metrics.costPer100, 3)}</p>
        </div>
      </div>
    </div>
  );

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={loadGachaPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Gacha Shop
        </button>
        <button onClick={loadShooterPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Shooter Shop
        </button>
        <button onClick={resetAll} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Currency Pack Value</p>
                <p className="text-sm text-muted-foreground">Compare up to three in-game currency packs by effective total and cost efficiency.</p>
              </div>
              <Coins className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {renderPackCard("Pack 1", packA, setPackA, {
                totalCurrency: analysis.packs[0].totalCurrency,
                costPer100: analysis.packs[0].costPer100,
              })}
              {renderPackCard("Pack 2", packB, setPackB, {
                totalCurrency: analysis.packs[1].totalCurrency,
                costPer100: analysis.packs[1].costPer100,
              })}
              {renderPackCard("Pack 3", packC, setPackC, {
                totalCurrency: analysis.packs[2].totalCurrency,
                costPer100: analysis.packs[2].costPer100,
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Item Cost Planner</p>
                <p className="text-sm text-muted-foreground">Estimate how much currency and money you need for a target skin, summon, crate, or battle pass unlock.</p>
              </div>
              <ShoppingCart className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Target Item Cost</label>
                <input type="number" min="0" step="1" value={targetCostInput} onChange={(event) => setTargetCostInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Owned Currency</label>
                <input type="number" min="0" step="1" value={ownedCurrencyInput} onChange={(event) => setOwnedCurrencyInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Daily Free Currency</label>
                <input type="number" min="0" step="1" value={dailyFreeInput} onChange={(event) => setDailyFreeInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Currency Gap</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(analysis.currencyGap, 0)}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Best Value Pack</p>
                <p className="mt-2 text-xl font-black text-emerald-600">{analysis.bestPack?.name ?? "N/A"}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Best Pack Cost / 100</p>
                <p className="mt-2 text-2xl font-black text-foreground">
                  {analysis.bestPack ? `$${format(analysis.bestPack.costPer100, 3)}` : "N/A"}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Cheapest Paid Plan</p>
                <p className="mt-2 text-2xl font-black text-foreground">
                  {analysis.cheapestTargetPlan ? `$${format(analysis.cheapestTargetPlan.totalSpend, 2)}` : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Purchase Plan Table</p>
                <p className="text-sm text-muted-foreground">See how each pack performs if you buy only that pack type until you reach the target currency gap.</p>
              </div>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60">
                    <th className="px-4 py-3 text-left font-bold text-foreground">Pack</th>
                    <th className="px-4 py-3 text-left font-bold text-foreground">Qty</th>
                    <th className="px-4 py-3 text-left font-bold text-foreground">Spend</th>
                    <th className="px-4 py-3 text-left font-bold text-foreground">Currency Bought</th>
                    <th className="px-4 py-3 text-left font-bold text-foreground">Overshoot</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {analysis.purchasePlans.map((plan) => (
                    <tr key={plan.name}>
                      <td className="px-4 py-3 text-muted-foreground">{plan.name}</td>
                      <td className="px-4 py-3 font-mono text-foreground">{plan.quantity}</td>
                      <td className="px-4 py-3 font-mono text-foreground">${format(plan.totalSpend, 2)}</td>
                      <td className="px-4 py-3 font-mono text-foreground">{format(plan.totalCurrencyBought, 0)}</td>
                      <td className="px-4 py-3 font-bold text-blue-600">{format(plan.overshoot, 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Reading</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Pack Efficiency</p>
                <p className="mt-1">
                  {analysis.bestPack
                    ? `${analysis.bestPack.name} currently gives the best raw value at about $${format(analysis.bestPack.costPer100, 3)} per 100 currency.`
                    : "Enter at least one valid pack to compare value."}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Target Shortcut</p>
                <p className="mt-1">
                  {analysis.cheapestTargetPlan
                    ? `To cover a gap of ${format(analysis.currencyGap, 0)} currency, the cheapest single-pack strategy here is ${analysis.cheapestTargetPlan.quantity} x ${analysis.cheapestTargetPlan.name} for about $${format(analysis.cheapestTargetPlan.totalSpend, 2)}.`
                    : "Increase the target item cost or add a valid pack price to generate a paid shortcut plan."}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Grind Alternative</p>
                <p className="mt-1">
                  {analysis.dailyFree > 0
                    ? `At roughly ${format(analysis.dailyFree, 0)} free currency per day, the same gap would take about ${format(analysis.grindDays, 2)} days to earn without paying.`
                    : "Add a daily free-currency estimate if you want to compare grind time against spending."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            <div className="space-y-3">
              {[
                { label: "Pack values", value: valueSnippet },
                { label: "Target plan", value: targetSnippet },
                { label: "Grind comparison", value: grindSnippet },
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

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                This page is intentionally generic. It compares the currency economics you enter, but it does not fetch live prices or region-specific storefront rules. Update the pack values manually to match the game you are evaluating.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Online Game Currency Converter"
      seoTitle="Online Game Currency Converter - Compare Packs, Item Cost, and Value"
      seoDescription="Free online game currency converter. Compare in-game currency pack value, calculate target item costs, and estimate grind days versus spending for any game shop."
      canonical="https://usonlinetools.com/gaming/game-currency-converter"
      categoryName="Gaming Calculators"
      categoryHref="/category/gaming"
      heroDescription="Use this online game currency converter to compare in-game currency packs, translate shop prices into real-money estimates, and decide whether a bundle is actually good value. Enter the pack prices and currency totals from any game, then compare cost-per-100, target item purchase plans, and the number of free-grind days needed if you skip spending. The page is designed for players who want a cleaner pricing decision before they buy skins, pulls, crates, coins, gems, or premium tokens."
      heroIcon={<Coins className="w-3.5 h-3.5" />}
      calculatorLabel="Game Shop Value Planner"
      calculatorDescription="Compare up to three currency packs, plan a target item purchase, and estimate grind time versus spend."
      calculator={calculator}
      howSteps={[
        {
          title: "Enter the exact pack values from the game shop you are checking",
          description:
            "The most important step is entering the pack prices and total currency correctly, including any bonus currency that comes with the bundle. Bonus amounts are often what make a larger pack genuinely more efficient than a smaller one. If you skip the bonus or only compare sticker prices, the result becomes misleading very quickly.",
        },
        {
          title: "Use cost-per-100 to compare pack value cleanly",
          description:
            "Comparing total price alone is rarely enough because larger packs cost more in absolute terms but can still be better value per unit. This page converts each pack into a normalized cost-per-100 currency figure so you can compare value directly even when the bundle sizes are very different. That is usually the most practical way to spot which pack is really carrying the best ratio.",
        },
        {
          title: "Model the actual item you want instead of stopping at the pack comparison",
          description:
            "A pack can be the best value per unit and still be the wrong purchase for a specific target because it may overshoot the amount you need too heavily. The item planner addresses that by calculating the currency gap between your current balance and the desired item, then estimating how many copies of each pack would cover that gap. This is often the difference between a value check and a real buying decision.",
        },
        {
          title: "Compare the paid shortcut against the free grind route",
          description:
            "Many games let you earn some currency through dailies, events, or repeated matches. The daily free-currency field turns that into a rough day estimate so you can compare time-to-item against spend-to-item. Even if the result is only approximate, it is useful because it frames the purchase in terms of time tradeoffs rather than just raw pricing.",
        },
      ]}
      interpretationCards={[
        {
          title: "Lower cost-per-100 means better raw bundle value",
          description:
            "If one pack gives the same currency at a lower cost-per-100 than the others, it is the most efficient option in pure value terms.",
        },
        {
          title: "Best value is not always the cheapest way to hit a target item",
          description:
            "A larger bundle can be more efficient overall but still force you to buy more currency than you need. That is why the purchase-plan table matters as much as the pack-value ranking.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Bonus currency changes the economics more than many players expect",
          description:
            "A small increase in listed bonus can dramatically improve the effective value of a bundle, especially when comparing medium and large packs.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Grind-day comparisons help you decide if the shortcut is worth it",
          description:
            "Once you see both the money cost and the estimated free-grind time side by side, the decision is usually much clearer than looking at currency totals alone.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Small versus large bundle", input: "500 for $4.99 versus 2,800 for $19.99", output: "The larger bundle often wins on cost-per-100 if bonus currency is included" },
        { scenario: "Target skin planning", input: "Need 1,800 currency and already own 250", output: "The page calculates the remaining gap and the cheapest single-pack path" },
        { scenario: "Bonus-heavy gacha bundle", input: "2,100 base plus 500 bonus", output: "Bonus currency can move a high-tier pack into the best-value slot" },
        { scenario: "Grind versus buy", input: "60 free currency per day with a 1,550 gap", output: "About 25.8 days of free progress if you skip spending" },
      ]}
      whyChoosePoints={[
        "This Game Currency Converter is designed as a real pricing workflow rather than a fake static shop page. It compares editable bundles, normalizes their value, estimates target purchases, and puts grind time beside spending so the result is useful for actual decision-making.",
        "The cost-per-100 normalization is important because it removes the confusion caused by bundle size. Players often know which pack feels expensive, but not which one is actually efficient. The normalized view makes that obvious.",
        "The target planner is equally valuable because many players are not buying currency in the abstract. They are trying to unlock one skin, one pass, one crate sequence, or one pity threshold. Planning around the actual item is what turns the tool into something practical.",
        "The free-currency comparison adds context that bundle calculators often ignore. Money value and time value should be compared together, especially in games where daily play slowly fills the same currency balance.",
        "Everything runs locally in the browser and works with any game shop you want to model. That makes the page flexible enough for shooters, gacha games, mobile RPGs, Roblox economies, and any other premium-currency system with pack bundles.",
      ]}
      faqs={[
        {
          q: "How do I compare in-game currency packs fairly?",
          a: "Use the total currency including bonus, then convert each pack into a normalized cost-per-100 or cost-per-unit figure. That removes the distortion caused by different pack sizes.",
        },
        {
          q: "Why is the best-value pack not always the cheapest way to buy one item?",
          a: "Because the most efficient pack may contain more currency than you actually need. A slightly worse-value pack can still be cheaper overall if it covers the target with less overshoot.",
        },
        {
          q: "What should I enter as bonus currency?",
          a: "Enter any extra premium currency bundled with the purchase beyond the base amount shown in the pack. If the game offers no bonus, leave it at zero.",
        },
        {
          q: "Can I use this for any game?",
          a: "Yes. The calculator is generic and works with whatever pack prices, currency totals, and target item cost you enter manually.",
        },
        {
          q: "What does daily free currency mean?",
          a: "It is the amount of premium or target currency you expect to earn per day from missions, events, login rewards, or gameplay. The page uses it to estimate how long the free route would take.",
        },
        {
          q: "Does this page fetch live pack prices automatically?",
          a: "No. The values are manual inputs, which keeps the page flexible across different games, stores, and regions.",
        },
        {
          q: "Can I compare more than three packs?",
          a: "This version focuses on three editable packs for speed and clarity. For most storefronts, that is enough to compare the small, medium, and large bundle tiers that matter most.",
        },
        {
          q: "Does the calculator save my shop setups?",
          a: "No. The values stay in the current page state only. The tool is meant for quick local comparison and copy-paste planning.",
        },
      ]}
      relatedTools={[
        { title: "Roblox Tax Calculator", slug: "roblox-tax-calculator", icon: <TrendingUp className="w-4 h-4" />, color: 35, benefit: "Compare another gaming economy workflow" },
        { title: "XP Level Calculator", slug: "xp-level-calculator", icon: <Gauge className="w-4 h-4" />, color: 210, benefit: "Plan progression after pricing your currency target" },
        { title: "Blox Fruits Trade Calculator", slug: "blox-fruits-trade-calculator", icon: <Target className="w-4 h-4" />, color: 145, benefit: "Use another value-comparison gaming page" },
        { title: "Minecraft Circle Calculator", slug: "minecraft-circle-calculator", icon: <BarChart3 className="w-4 h-4" />, color: 270, benefit: "Stay inside the gaming calculator category" },
        { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Copy className="w-4 h-4" />, color: 320, benefit: "Measure bonus percentages and price deltas" },
        { title: "D&D Dice Roller", slug: "dnd-dice-roller", icon: <RotateCcw className="w-4 h-4" />, color: 20, benefit: "Browse another gaming utility page" },
      ]}
      ctaTitle="Need Another Gaming Economy Tool?"
      ctaDescription="Keep moving through the gaming calculator category and continue replacing placeholder routes with real tools."
      ctaHref="/category/gaming"
    />
  );
}
