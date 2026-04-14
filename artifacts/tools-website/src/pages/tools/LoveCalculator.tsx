import { useMemo, useState } from "react";
import { Heart, Shuffle, Smile, Type } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeName(value: string): string {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 1000003;
  }
  return hash;
}

function buildShipName(first: string, second: string): string {
  const left = first.slice(0, Math.max(1, Math.ceil(first.length / 2)));
  const right = second.slice(Math.max(0, Math.floor(second.length / 2)));
  return `${left}${right}` || "--";
}

export default function LoveCalculator() {
  const [nameA, setNameA] = useState("Alex");
  const [nameB, setNameB] = useState("Taylor");

  const result = useMemo(() => {
    const first = normalizeName(nameA);
    const second = normalizeName(nameB);

    if (!first || !second) return null;

    const frequency = new Map<string, number>();
    for (const letter of first) {
      frequency.set(letter, (frequency.get(letter) ?? 0) + 1);
    }

    let sharedCount = 0;
    for (const letter of second) {
      const current = frequency.get(letter) ?? 0;
      if (current > 0) {
        sharedCount += 1;
        frequency.set(letter, current - 1);
      }
    }

    const overlapRatio = sharedCount / Math.max(first.length, second.length);
    const lengthBalance = 1 - Math.abs(first.length - second.length) / Math.max(first.length, second.length);
    const seed = hashString([first, second].sort().join(":")) % 100;
    const score = clamp(Math.round(38 + overlapRatio * 28 + lengthBalance * 12 + seed * 0.22), 12, 99);

    const band =
      score >= 85
        ? "Electric match"
        : score >= 70
          ? "Strong chemistry"
          : score >= 55
            ? "Promising vibe"
            : score >= 35
              ? "Fun wildcard"
              : "Chaotic energy";

    const message =
      score >= 85
        ? "This pairing lands in the high-compatibility zone. If nothing else, the ship name is already doing work."
        : score >= 70
          ? "There is enough overlap here for a fun, believable match. Good balance, good rhythm, good score."
          : score >= 55
            ? "The names play well together and the score lands in the playful middle. Not guaranteed, but definitely not boring."
            : score >= 35
              ? "This pair feels unpredictable. That can be a warning or the whole appeal, depending on your mood."
              : "The calculator is sensing maximum turbulence. Sometimes that still makes the best story.";

    return {
      score,
      band,
      message,
      shipName: buildShipName(first, second),
    };
  }, [nameA, nameB]);

  return (
    <UtilityToolPageShell
      title="Love Calculator"
      seoTitle="Love Calculator - Name Compatibility Score"
      seoDescription="Free online love calculator. Enter two names to get a fun compatibility score, match band, and ship name instantly."
      canonical="https://usonlinetools.com/productivity/love-calculator"
      categoryName="Productivity & Text"
      categoryHref="/category/productivity"
      heroDescription="Use this browser-based love calculator to generate a fun compatibility score from two names, get a quick match band, and create a built-in ship name for chats, captions, and inside jokes."
      heroIcon={<Heart className="w-3.5 h-3.5" />}
      calculatorLabel="Name Match Generator"
      calculatorDescription="Enter two names and the compatibility score updates instantly. This tool is for fun, not science."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 md:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">First Name</label>
                <input className="tool-calc-input w-full" type="text" value={nameA} onChange={(e) => setNameA(e.target.value)} placeholder="Enter first name" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">Second Name</label>
                <input className="tool-calc-input w-full" type="text" value={nameB} onChange={(e) => setNameB(e.target.value)} placeholder="Enter second name" />
              </div>
            </div>

            {result ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  <div className="tool-calc-result">
                    <p className="text-xs text-muted-foreground">Compatibility</p>
                    <p className="text-2xl font-black text-rose-600">{result.score}%</p>
                  </div>
                  <div className="tool-calc-result">
                    <p className="text-xs text-muted-foreground">Match Band</p>
                    <p className="text-2xl font-black text-rose-600">{result.band}</p>
                  </div>
                  <div className="tool-calc-result">
                    <p className="text-xs text-muted-foreground">Ship Name</p>
                    <p className="text-2xl font-black text-rose-600">{result.shipName}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-rose-500/20 bg-background/80 p-4">
                  <p className="text-sm font-bold text-foreground mb-1">Compatibility note</p>
                  <p className="text-sm text-muted-foreground">{result.message}</p>
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Enter two names to generate a match score.</p>
            )}
          </div>
        </div>
      }
      howSteps={[
        { title: "Enter two names", description: "Type the two names you want to compare. The calculator works best with simple name inputs rather than full sentences." },
        { title: "Read the compatibility score", description: "The score gives a playful percentage match, while the band explains whether the pair feels strong, moderate, or chaotic." },
        { title: "Use the generated ship name if you want", description: "The ship-name card blends both names into a quick nickname for jokes, chats, and captions." },
      ]}
      interpretationCards={[
        { title: "This tool is for entertainment", description: "The compatibility score is generated from the structure of the names and is meant to be fun, not predictive." },
        { title: "Scores are deterministic for the same pair", description: "If you enter the same two names again, the page will return the same compatibility score and ship name.", className: "bg-rose-500/5 border-rose-500/20" },
        { title: "Name spelling changes the output", description: "Nicknames, abbreviations, and alternate spellings can shift the score because the calculator reads letter patterns.", className: "bg-pink-500/5 border-pink-500/20" },
      ]}
      examples={[
        { scenario: "Nickname check", input: "Alex + Taylor", output: "Promising vibe" },
        { scenario: "Ship-name idea", input: "Mia + Daniel", output: "Midaniel-style blend" },
        { scenario: "Funny group chat use", input: "Sam + Jordan", output: "Quick score and shared joke" },
      ]}
      whyChoosePoints={[
        "Love calculator is a simple high-interest browser tool that fits the site's quick-result utility model without needing any backend.",
        "The page still follows the same stronger long-form structure as the percentage-style tools, so it is not just a bare widget dropped onto the site.",
        "Because the result is deterministic and instant, users can retry with nicknames or alternate spellings without any friction.",
      ]}
      faqs={[
        { q: "Is this love calculator scientifically accurate?", a: "No. It is an entertainment tool designed for fun compatibility checks, not a real relationship model." },
        { q: "Why did the score change when I used a nickname?", a: "The calculator uses the entered letters, so a different spelling can change the overlap and the seeded score." },
        { q: "Will the same names always produce the same result?", a: "Yes. The score is deterministic for the same pair of names." },
        { q: "Can I use this with celebrity names, friends, or fictional characters?", a: "Yes. Any two names will work as long as the inputs contain letters." },
      ]}
      relatedTools={[
        { title: "Random Name Generator", slug: "random-name-generator", icon: <Shuffle className="w-4 h-4" />, color: 210, benefit: "Generate names to test instantly" },
        { title: "Username Generator", slug: "username-generator", icon: <Type className="w-4 h-4" />, color: 275, benefit: "Turn a pair into handle ideas" },
        { title: "Emoji Picker", slug: "emoji-picker", icon: <Smile className="w-4 h-4" />, color: 45, benefit: "Add a reaction for the result" },
        { title: "Text to Emoji Converter", slug: "text-to-emoji", icon: <Heart className="w-4 h-4" />, color: 155, benefit: "Dress up the match message" },
        { title: "Random Picker Tool", slug: "random-picker-tool", icon: <Shuffle className="w-4 h-4" />, color: 330, benefit: "Let chance pick the next fun prompt" },
      ]}
      ctaTitle="Need More Fun Utilities?"
      ctaDescription="Browse randomizers, name tools, emoji tools, and text utilities for the rest of the same playful workflow."
      ctaHref="/category/productivity"
    />
  );
}
