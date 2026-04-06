import { useState } from "react";
import { BarChart3, Dices, Hash, Shuffle, Type } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

const VOWELS = "AEIOU";
const CONSONANTS = "BCDFGHJKLMNPQRSTVWXYZ";

export default function RandomLetterGenerator() {
  const [count, setCount] = useState("12");
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [includeVowels, setIncludeVowels] = useState(true);
  const [includeConsonants, setIncludeConsonants] = useState(true);
  const [letters, setLetters] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateLetters = () => {
    const amount = Math.min(500, Math.max(1, Number.parseInt(count, 10) || 1));
    const pool = [
      ...(includeVowels ? VOWELS.split("") : []),
      ...(includeConsonants ? CONSONANTS.split("") : []),
    ];

    if (pool.length === 0 || (!useUppercase && !useLowercase)) {
      setLetters([]);
      return;
    }

    const result: string[] = [];
    for (let index = 0; index < amount; index += 1) {
      const base = pool[Math.floor(Math.random() * pool.length)];
      const useLower = useLowercase && (!useUppercase || Math.random() >= 0.5);
      result.push(useLower ? base.toLowerCase() : base);
    }

    setLetters(result);
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(letters.join(""));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const vowelCount = letters.filter((letter) => "AEIOUaeiou".includes(letter)).length;
  const consonantCount = letters.length - vowelCount;

  return (
    <UtilityToolPageShell
      title="Random Letter Generator"
      seoTitle="Random Letter Generator"
      seoDescription="Generate random letters with uppercase, lowercase, vowel, and consonant controls using this free browser-based letter generator."
      canonical="https://usonlinetools.com/productivity/random-letter-generator"
      categoryName="Productivity & Text"
      categoryHref="/category/productivity"
      heroDescription="Generate random letters for games, classroom activities, code experiments, word prompts, or creative exercises. Control case and restrict the output to vowels, consonants, or both."
      heroIcon={<Dices className="w-3.5 h-3.5" />}
      calculatorLabel="Letter Generator"
      calculatorDescription="Create one or many random letters with category controls."
      calculator={
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 md:p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="letter-count" className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Number of Letters
              </label>
              <input
                id="letter-count"
                type="number"
                min="1"
                max="500"
                value={count}
                onChange={(event) => setCount(event.target.value)}
                className="tool-calc-input w-full"
              />
            </div>
            <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center justify-between gap-3 self-end">
              <span>Ready to generate</span>
              <span className="font-black text-blue-600">{letters.length} output</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center gap-3">
              <input type="checkbox" checked={useUppercase} onChange={(event) => setUseUppercase(event.target.checked)} />
              Include uppercase
            </label>
            <label className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center gap-3">
              <input type="checkbox" checked={useLowercase} onChange={(event) => setUseLowercase(event.target.checked)} />
              Include lowercase
            </label>
            <label className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center gap-3">
              <input type="checkbox" checked={includeVowels} onChange={(event) => setIncludeVowels(event.target.checked)} />
              Include vowels
            </label>
            <label className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center gap-3">
              <input type="checkbox" checked={includeConsonants} onChange={(event) => setIncludeConsonants(event.target.checked)} />
              Include consonants
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-blue-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Letters</p>
              <p className="text-2xl font-black text-blue-600">{letters.length}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Vowels</p>
              <p className="text-2xl font-black text-emerald-600">{vowelCount}</p>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Consonants</p>
              <p className="text-2xl font-black text-violet-600">{consonantCount}</p>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-card p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Pool Size</p>
              <p className="text-2xl font-black text-cyan-600">{(includeVowels ? VOWELS.length : 0) + (includeConsonants ? CONSONANTS.length : 0)}</p>
            </div>
          </div>

          <button onClick={generateLetters} className="w-full rounded-xl bg-blue-500 py-3 text-sm font-black text-white hover:bg-blue-600 transition-colors">
            Generate Letters
          </button>

          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Generated Output</p>
              <button
                onClick={copyOutput}
                disabled={letters.length === 0}
                className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {copied ? "Copied" : "Copy Letters"}
              </button>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 min-h-[120px]">
              {letters.length > 0 ? (
                <>
                  <p className="font-mono text-lg break-all text-foreground mb-3">{letters.join("")}</p>
                  <div className="flex flex-wrap gap-2">
                    {letters.map((letter, index) => (
                      <span key={`${letter}-${index}`} className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-blue-500/20 bg-blue-500/5 font-black text-blue-700">
                        {letter}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Choose your options and generate a fresh set of random letters.</p>
              )}
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Set the number of letters", description: "Choose how many characters you want in the random output." },
        { title: "Pick case options", description: "Enable uppercase, lowercase, or both depending on the format you need." },
        { title: "Filter by vowels or consonants", description: "Keep the full alphabet or narrow the pool to a specific letter type." },
        { title: "Generate and copy", description: "Create a fresh sequence instantly and copy it for games, prompts, or experiments." },
      ]}
      interpretationCards={[
        { title: "Uppercase and lowercase", description: "If both are enabled, each generated letter can appear in either case." },
        { title: "Vowel-only mode", description: "Useful for phonics exercises, game design, or creative constraints where you only want AEIOU output.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Consonant-heavy output", description: "Good for puzzle creation or testing patterns where consonants matter more than pronounceable words.", className: "bg-violet-500/5 border-violet-500/20" },
      ]}
      examples={[
        { scenario: "Single random letter", input: "1, uppercase only", output: "Q" },
        { scenario: "Mixed case output", input: "6, upper + lower", output: "aTZqBp" },
        { scenario: "Vowels only", input: "8, vowels enabled", output: "AEoIiUaa" },
        { scenario: "Consonants only", input: "5, consonants enabled", output: "RkmTZ" },
      ]}
      whyChoosePoints={[
        "Fast for games and exercises. You can generate usable letter sets without shuffling physical tiles or cards.",
        "Configurable enough for classroom, coding, and creative workflows because case and letter-category rules are separate.",
        "Immediate browser output means you can regenerate sequences quickly until the pattern fits what you need.",
      ]}
      faqs={[
        { q: "What happens if I disable both vowels and consonants?", a: "The tool returns no result because there are no letters left in the available pool." },
        { q: "Can I generate only lowercase letters?", a: "Yes. Turn off uppercase and leave lowercase enabled." },
        { q: "Is every letter equally likely?", a: "Yes. Each available letter in the active pool has the same random chance of being selected." },
        { q: "Can I use this for word games or classroom activities?", a: "Yes. It works well for prompts, phonics drills, random initials, and simple puzzle setups." },
      ]}
      relatedTools={[
        { title: "Random Picker Tool", slug: "random-picker-tool", icon: <Shuffle className="w-4 h-4" />, color: 217, benefit: "Pick from custom lists" },
        { title: "Random Number Generator", slug: "random-number-generator", icon: <BarChart3 className="w-4 h-4" />, color: 152, benefit: "Generate random numbers" },
        { title: "Coin Flip", slug: "coin-flip", icon: <Dices className="w-4 h-4" />, color: 274, benefit: "Simple binary randomness" },
        { title: "Dice Roller", slug: "dice-roller", icon: <Dices className="w-4 h-4" />, color: 28, benefit: "Roll virtual dice" },
        { title: "Text Formatter Tool", slug: "text-formatter-tool", icon: <Type className="w-4 h-4" />, color: 340, benefit: "Reformat generated text" },
        { title: "Username Generator", slug: "username-generator", icon: <Hash className="w-4 h-4" />, color: 185, benefit: "Build names from random characters" },
      ]}
    />
  );
}
