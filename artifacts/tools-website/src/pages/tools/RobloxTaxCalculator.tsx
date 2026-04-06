import { useMemo, useState } from "react";
import {
  Calculator,
  Copy,
  Coins,
  PiggyBank,
  Receipt,
  RotateCcw,
  Shield,
  TrendingUp,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

const ROBLOX_TAX_RATE = 0.3;
const ROBLOX_KEEP_RATE = 1 - ROBLOX_TAX_RATE;

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

function parsePrices(input: string) {
  return input
    .split(/[\s,]+/)
    .map((item) => Number.parseFloat(item))
    .filter((value) => Number.isFinite(value) && value > 0);
}

export default function RobloxTaxCalculator() {
  const [salePrice, setSalePrice] = useState("100");
  const [targetNet, setTargetNet] = useState("100");
  const [priceList, setPriceList] = useState("50, 75, 100, 250");
  const [copiedLabel, setCopiedLabel] = useState("");

  const saleResult = useMemo(() => {
    const gross = positive(salePrice, 0);
    const tax = gross * ROBLOX_TAX_RATE;
    const net = gross * ROBLOX_KEEP_RATE;
    return { gross, tax, net };
  }, [salePrice]);

  const reverseResult = useMemo(() => {
    const desiredNet = positive(targetNet, 0);
    const exactGross = ROBLOX_KEEP_RATE > 0 ? desiredNet / ROBLOX_KEEP_RATE : 0;
    const roundedGross = Math.ceil(exactGross);
    const extraNet = roundedGross * ROBLOX_KEEP_RATE - desiredNet;
    return { desiredNet, exactGross, roundedGross, extraNet };
  }, [targetNet]);

  const batchResult = useMemo(() => {
    const prices = parsePrices(priceList);
    const gross = prices.reduce((sum, value) => sum + value, 0);
    const tax = gross * ROBLOX_TAX_RATE;
    const net = gross * ROBLOX_KEEP_RATE;
    const averageNet = prices.length > 0 ? net / prices.length : 0;
    return { prices, gross, tax, net, averageNet };
  }, [priceList]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const resetAll = () => {
    setSalePrice("100");
    setTargetNet("100");
    setPriceList("50, 75, 100, 250");
  };

  const loadGamepassPreset = () => {
    setSalePrice("399");
    setTargetNet("500");
    setPriceList("99, 149, 249, 399");
  };

  const loadCatalogPreset = () => {
    setSalePrice("75");
    setTargetNet("200");
    setPriceList("15, 25, 35, 75, 120");
  };

  const saleSnippet = [
    `Sale price: ${format(saleResult.gross, 0)} Robux`,
    `Roblox tax: ${format(saleResult.tax, 2)} Robux`,
    `You receive: ${format(saleResult.net, 2)} Robux`,
  ].join("\n");

  const reverseSnippet = [
    `Target net: ${format(reverseResult.desiredNet, 2)} Robux`,
    `Exact gross needed: ${format(reverseResult.exactGross, 3)} Robux`,
    `Rounded listing price: ${format(reverseResult.roundedGross, 0)} Robux`,
    `Rounded extra net: ${format(reverseResult.extraNet, 2)} Robux`,
  ].join("\n");

  const batchSnippet = [
    `Price list: ${batchResult.prices.join(", ") || "None"}`,
    `Gross total: ${format(batchResult.gross, 2)} Robux`,
    `Total tax: ${format(batchResult.tax, 2)} Robux`,
    `Net total: ${format(batchResult.net, 2)} Robux`,
    `Average net per item: ${format(batchResult.averageNet, 2)} Robux`,
  ].join("\n");

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={loadGamepassPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Gamepass Preset
        </button>
        <button onClick={loadCatalogPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Catalog Preset
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Sale to Net Calculator</p>
                <p className="text-sm text-muted-foreground">Enter a Roblox item price and see the platform cut and your actual Robux received.</p>
              </div>
              <Coins className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Listing Price (Robux)</label>
                <input type="number" min="0" step="1" value={salePrice} onChange={(event) => setSalePrice(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">You Keep</p>
                <p className="mt-2 text-3xl font-black text-emerald-600">{format(saleResult.net, 2)} Robux</p>
                <p className="mt-1 text-xs text-muted-foreground">Roblox keeps 30%, so creators usually receive 70% of the sale price.</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Gross</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(saleResult.gross, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Tax</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(saleResult.tax, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Net</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(saleResult.net, 2)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Net to Required Price</p>
                <p className="text-sm text-muted-foreground">Work backwards when you know how much Robux you want to receive after the platform fee.</p>
              </div>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Target Net (Robux)</label>
                <input type="number" min="0" step="1" value={targetNet} onChange={(event) => setTargetNet(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Rounded Listing Price</p>
                <p className="mt-2 text-3xl font-black text-emerald-600">{format(reverseResult.roundedGross, 0)} Robux</p>
                <p className="mt-1 text-xs text-muted-foreground">Rounded up so you still clear at least your target after tax.</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Exact Gross</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(reverseResult.exactGross, 3)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Target Net</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(reverseResult.desiredNet, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Extra Net</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(reverseResult.extraNet, 2)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Batch Earnings Planner</p>
                <p className="text-sm text-muted-foreground">Paste multiple Roblox prices and estimate the total tax and creator payout across the batch.</p>
              </div>
              <Receipt className="w-5 h-5 text-blue-500" />
            </div>

            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Price List</label>
            <textarea value={priceList} onChange={(event) => setPriceList(event.target.value)} rows={4} className="tool-calc-input min-h-[120px] w-full resize-y" />

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Items</p>
                <p className="mt-2 text-2xl font-black text-foreground">{batchResult.prices.length}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Gross Total</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(batchResult.gross, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Tax Total</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(batchResult.tax, 2)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Net Total</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(batchResult.net, 2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Breakdown</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Direct Sale Result</p>
                <p className="mt-1">A {format(saleResult.gross, 0)} Robux listing returns about {format(saleResult.net, 2)} Robux to the creator after the standard 30% platform cut.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Reverse Pricing</p>
                <p className="mt-1">If you want to net {format(reverseResult.desiredNet, 0)} Robux, you should list at about {format(reverseResult.roundedGross, 0)} Robux so the after-tax result stays above your goal.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Batch Planning</p>
                <p className="mt-1">Across this price list, Roblox keeps about {format(batchResult.tax, 2)} Robux and the creator side receives about {format(batchResult.net, 2)} Robux.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            <div className="space-y-3">
              {[
                { label: "Sale result", value: saleSnippet },
                { label: "Required price", value: reverseSnippet },
                { label: "Batch planner", value: batchSnippet },
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
                This calculator models the standard 30% Roblox marketplace cut. Special creator programs, premium payouts, and off-platform monetization are different workflows and should be calculated separately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Roblox Tax Calculator"
      seoTitle="Online Roblox Tax Calculator - 30% Robux Fee and Required Price"
      seoDescription="Free online Roblox tax calculator. Calculate how much Robux you keep after the 30% fee, how much to charge to hit a target net payout, and batch earnings totals."
      canonical="https://usonlinetools.com/gaming/roblox-tax-calculator"
      categoryName="Gaming Calculators"
      categoryHref="/category/gaming"
      heroDescription="Use this online Roblox tax calculator to estimate how much Robux you actually receive after the standard 30% marketplace fee. Check the payout on a single sale, work backwards from a target net amount, and total up a full list of prices when you are planning a shop, pass lineup, or creator release. The page is built to remove the guesswork from Roblox pricing decisions."
      heroIcon={<Calculator className="w-3.5 h-3.5" />}
      calculatorLabel="Roblox Fee Planner"
      calculatorDescription="Calculate Roblox sale tax, required gross price, and batch totals from one calculator page."
      calculator={calculator}
      howSteps={[
        {
          title: "Start with the item price if you want the fastest answer",
          description:
            "Most Roblox sellers begin with a listing price they already have in mind. The sale-to-net calculator handles that immediately. Enter the gross price and the page shows the 30% platform cut and the remaining Robux that the creator receives. This is the quickest way to check whether a price point actually makes sense before publishing it.",
        },
        {
          title: "Use reverse pricing when you care about net payout more than sticker price",
          description:
            "Sometimes the real question is not what you should charge, but what price is needed to receive a certain amount after tax. The reverse calculator solves that by dividing your target net by the creator keep-rate. It also rounds up the result so the final listing still clears your goal once Roblox takes its share.",
        },
        {
          title: "Batch planning is useful for passes, items, and seasonal price sheets",
          description:
            "If you manage more than one item, checking each price manually is slow and error-prone. The batch planner accepts a list of Roblox prices and totals the gross Robux, tax amount, and creator-side payout. That makes it useful for shop balancing, creator dashboards, and launch planning across multiple listings.",
        },
        {
          title: "Copy the summaries when you need to share pricing decisions",
          description:
            "Pricing work often involves a quick discussion with a teammate, co-owner, or client. The copy-ready snippets let you move those numbers into a note, message, or planning doc without retyping them. That keeps the workflow fast and reduces the chance of sending the wrong rounded value.",
        },
      ]}
      interpretationCards={[
        {
          title: "A 100 Robux listing does not mean you receive 100 Robux",
          description:
            "The standard Roblox marketplace flow takes 30% first. That means a 100 Robux listing normally returns about 70 Robux to the creator before you account for any other business decisions.",
        },
        {
          title: "Reverse pricing is usually better for target earnings",
          description:
            "If you need a specific payout, working backwards from net to gross is more reliable than guessing a sticker price and checking the result later.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Rounding up protects the target payout",
          description:
            "Since Roblox prices are typically set in whole Robux values, the calculator rounds the required gross price upward so you do not accidentally undershoot your target after tax.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Batch totals are useful for planning, not just accounting",
          description:
            "Seeing total tax and total creator payout across multiple prices helps with store design, progression pacing, and revenue expectations before you ship the lineup.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Simple single sale", input: "100 Robux listing", output: "About 70 Robux net after the 30% fee" },
        { scenario: "Target net payout", input: "Need 100 Robux after tax", output: "List at about 143 Robux" },
        { scenario: "Large creator item", input: "399 Robux listing", output: "About 279.3 Robux net" },
        { scenario: "Batch store planning", input: "50, 75, 100, 250", output: "475 gross, 142.5 tax, 332.5 net" },
      ]}
      whyChoosePoints={[
        "This Roblox Tax Calculator handles the two pricing directions creators actually need. You can start from a gross listing price and see what you keep, or start from the net amount you want and calculate the required selling price. That makes it more useful than a one-way fee widget.",
        "The batch planner is also practical for real Roblox workflows because shops rarely contain only one item. When you are pricing several passes, cosmetic items, or upgrade tiers, summing the total tax and payout across the whole list is faster and easier to reason about than checking each one by hand.",
        "The page is designed as a real utility route rather than a thin placeholder. It includes clear fee math, reverse pricing, copy-ready summaries, explanatory content, and internal related links so the page can stand on its own as a fully developed tool.",
        "The math is transparent. Roblox keeps 30%, creators keep 70%, and the calculator shows both the tax amount and the resulting payout. That clarity matters because pricing mistakes can compound quickly across multiple products.",
        "Everything runs locally in the browser with no sign-in and no setup. That matches the way most users approach a Roblox tax lookup: open the page, check a number, copy the result, and move on.",
      ]}
      faqs={[
        {
          q: "How much tax does Roblox take?",
          a: "This calculator uses the standard 30% Roblox marketplace cut, which means creators usually receive about 70% of the gross listing price.",
        },
        {
          q: "How do I calculate the Robux I receive after tax?",
          a: "Multiply the listing price by 0.7, or use the calculator to see the gross amount, tax amount, and final net payout instantly.",
        },
        {
          q: "How do I set a price to receive a specific amount of Robux?",
          a: "Enter your target net amount in the reverse pricing section. The page calculates the exact gross value and then rounds up to a whole Robux price so you still meet the goal after tax.",
        },
        {
          q: "Why does the calculator round the required price up?",
          a: "Because Roblox prices are normally set in whole Robux values. Rounding up protects your target payout, while rounding down could leave you short after the fee is applied.",
        },
        {
          q: "Can I paste more than one price at once?",
          a: "Yes. The batch planner accepts multiple values separated by commas or spaces, then totals the gross, tax, and net amounts across the full list.",
        },
        {
          q: "Does this include Premium payouts or special creator programs?",
          a: "No. This page is focused on the standard 30% sale tax workflow. Other Roblox monetization systems should be treated separately.",
        },
        {
          q: "Is this useful for game passes and avatar items?",
          a: "Yes. Any time you want to estimate creator-side Robux after the standard platform fee, this calculator is a practical starting point.",
        },
        {
          q: "Does the calculator save my shop prices?",
          a: "No. The numbers stay in the current page state only. The tool is built for quick local calculations rather than account-based storage.",
        },
      ]}
      relatedTools={[
        { title: "Blox Fruits Calculator", slug: "blox-fruits-calculator", icon: <Coins className="w-4 h-4" />, color: 35, benefit: "Stay inside another Roblox gaming workflow" },
        { title: "Blox Fruits Trade Calculator", slug: "blox-fruits-trade-calculator", icon: <TrendingUp className="w-4 h-4" />, color: 150, benefit: "Check a second Robux-adjacent gaming route" },
        { title: "Fortnite DPI Calculator", slug: "fortnite-dpi-calculator", icon: <Receipt className="w-4 h-4" />, color: 210, benefit: "Move to another newly built gaming tool" },
        { title: "Valorant Sensitivity Calculator", slug: "valorant-sensitivity-calculator", icon: <PiggyBank className="w-4 h-4" />, color: 345, benefit: "Browse another completed gaming calculator" },
        { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Copy className="w-4 h-4" />, color: 265, benefit: "Work with percentage changes and fee math directly" },
        { title: "D&D Dice Roller", slug: "dnd-dice-roller", icon: <RotateCcw className="w-4 h-4" />, color: 25, benefit: "Open another live gaming utility page" },
      ]}
      ctaTitle="Need Another Gaming Utility?"
      ctaDescription="Continue through the gaming calculator category and keep replacing placeholder routes with real tools."
      ctaHref="/category/gaming"
    />
  );
}
