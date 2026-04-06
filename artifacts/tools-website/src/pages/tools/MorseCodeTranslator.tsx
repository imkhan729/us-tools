import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  Copy,
  Radio,
  RotateCcw,
  Search,
  Shield,
  Target,
  Type,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type Mode = "textToMorse" | "morseToText";

const TEXT_TO_MORSE: Record<string, string> = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
  0: "-----",
  1: ".----",
  2: "..---",
  3: "...--",
  4: "....-",
  5: ".....",
  6: "-....",
  7: "--...",
  8: "---..",
  9: "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "!": "-.-.--",
  "/": "-..-.",
  "-": "-....-",
  "(": "-.--.",
  ")": "-.--.-",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "@": ".--.-.",
  "'": ".----.",
  "\"": ".-..-.",
  "&": ".-...",
};

const MORSE_TO_TEXT = Object.fromEntries(Object.entries(TEXT_TO_MORSE).map(([key, value]) => [value, key]));

function textToMorse(text: string) {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) =>
      word
        .split("")
        .map((char) => TEXT_TO_MORSE[char] ?? "")
        .filter(Boolean)
        .join(" "),
    )
    .join(" / ");
}

function morseToText(input: string) {
  return input
    .trim()
    .split(/\s*\/\s*/)
    .map((word) =>
      word
        .split(/\s+/)
        .map((token) => MORSE_TO_TEXT[token] ?? "")
        .join(""),
    )
    .join(" ");
}

export default function MorseCodeTranslator() {
  const [mode, setMode] = useState<Mode>("textToMorse");
  const [inputText, setInputText] = useState("SOS help");
  const [copiedLabel, setCopiedLabel] = useState("");

  const output = useMemo(() => {
    return mode === "textToMorse" ? textToMorse(inputText) : morseToText(inputText);
  }, [inputText, mode]);

  const analysis = useMemo(() => {
    const letters = inputText.replace(/[^A-Za-z0-9]/g, "").length;
    const words = inputText.trim().length > 0 ? inputText.trim().split(/\s+/).length : 0;
    const symbols = output.replace(/\s+/g, "").length;
    return { letters, words, symbols };
  }, [inputText, output]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const resetAll = () => {
    setMode("textToMorse");
    setInputText("SOS help");
  };

  const loadDecodePreset = () => {
    setMode("morseToText");
    setInputText("... --- ... / .... . .-.. .--.");
  };

  const summarySnippet = [
    `Mode: ${mode}`,
    `Input words: ${analysis.words}`,
    `Input letters: ${analysis.letters}`,
    `Output symbols: ${analysis.symbols}`,
    `Output: ${output}`,
  ].join("\n");

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={loadDecodePreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Decode Example
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Translator Controls</p>
                <p className="text-sm text-muted-foreground">Translate plain text to Morse code or decode Morse back into text using dots, dashes, spaces, and slashes between words.</p>
              </div>
              <Radio className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Mode</label>
                <select value={mode} onChange={(event) => setMode(event.target.value as Mode)} className="tool-calc-input w-full">
                  <option value="textToMorse">Text to Morse</option>
                  <option value="morseToText">Morse to Text</option>
                </select>
              </div>
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Word Separator</p>
                <p className="mt-2 text-lg font-black text-foreground">Use `/` between words</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Input</label>
                <textarea value={inputText} onChange={(event) => setInputText(event.target.value)} rows={8} className="tool-calc-input min-h-[180px] w-full resize-y" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Output</label>
                  <button onClick={() => copyValue("output", output)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                    {copiedLabel === "output" ? "Copied" : "Copy"}
                  </button>
                </div>
                <textarea value={output} readOnly rows={8} className="tool-calc-input min-h-[180px] w-full resize-y" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Words</p>
                <p className="mt-2 text-2xl font-black text-foreground">{analysis.words}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Letters</p>
                <p className="mt-2 text-2xl font-black text-foreground">{analysis.letters}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Output Symbols</p>
                <p className="mt-2 text-2xl font-black text-emerald-600">{analysis.symbols}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Direction</p>
                <p className="mt-2 text-xl font-black text-foreground">{mode === "textToMorse" ? "Encode" : "Decode"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Quick Reference</p>
                <p className="text-sm text-muted-foreground">Common Morse mappings for the letters and signals most people reach for first.</p>
              </div>
              <Search className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
              {[
                ["A", ".-"],
                ["E", "."],
                ["H", "...."],
                ["O", "---"],
                ["S", "..."],
                ["T", "-"],
                ["1", ".----"],
                ["5", "....."],
                ["0", "-----"],
                ["SOS", "... --- ..."],
                ["Word gap", "/"],
                ["Space", "single / double separator"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                  <p className="mt-2 font-mono text-lg font-black text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Reading</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Current Translation</p>
                <p className="mt-1">The current {mode === "textToMorse" ? "encoding" : "decoding"} run processes {analysis.words} word(s) and returns the translated output instantly as you type.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Spacing Rule</p>
                <p className="mt-1">Letters inside the same Morse word should be separated by spaces, while full word breaks are marked with a slash. That is the main formatting rule to keep in mind when decoding by hand.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Best Use</p>
                <p className="mt-1">This tool is useful for puzzles, learning, radio-history references, scavenger hunts, and quick text experiments rather than secure communication.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            <div className="space-y-3">
              {[{ label: "Translation summary", value: summarySnippet }].map((item) => (
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
                Morse code is a signaling and encoding system, not a secure cipher. It is easy to read once the mapping is known and should not be treated as encryption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Online Morse Code Translator"
      seoTitle="Online Morse Code Translator - Text to Morse and Morse to Text"
      seoDescription="Free online Morse code translator. Convert text to Morse code, decode Morse back to text, and use a quick-reference table for common letters and signals."
      canonical="https://usonlinetools.com/security/online-morse-code-translator"
      categoryName="Security & Encryption"
      categoryHref="/category/security"
      heroDescription="Use this online Morse code translator to convert plain text into Morse sequences and decode Morse back into readable text. The page supports letters, numbers, and common punctuation, preserves word boundaries with slash separators, and includes a quick reference section for fast lookup. It is designed for learning, puzzles, scavenger hunts, and radio-style signal practice."
      heroIcon={<Type className="w-3.5 h-3.5" />}
      calculatorLabel="Morse Translation Workspace"
      calculatorDescription="Translate text and Morse code in either direction directly in the browser with word and symbol counting."
      calculator={calculator}
      howSteps={[
        {
          title: "Choose the direction first",
          description:
            "Morse code work becomes much easier when you make the direction explicit before typing. Text-to-Morse is best when you are composing a puzzle or signal string, while Morse-to-text is best when you are decoding a received sequence. The page keeps both directions in the same interface so you can switch instantly.",
        },
        {
          title: "Use spaces for letters and slashes for words",
          description:
            "A Morse line is much easier to decode correctly when spacing is consistent. Letters should be separated by spaces, while full word breaks should be separated with a slash. The tool uses that same convention in its output, which makes it practical both for learning and for copy-paste use in games or puzzle docs.",
        },
        {
          title: "Decode unknown strings by checking word boundaries first",
          description:
            "When a Morse sequence looks confusing, the first useful check is often the word structure rather than the individual letters. Slash markers show where words begin and end, which makes the rest of the decoding process much easier. That is why the word separator is surfaced prominently in the page instead of being hidden in help text.",
        },
        {
          title: "Use the quick-reference grid for the common symbols you forget",
          description:
            "Most users do not need the full Morse table memorized. They need a fast reminder for common letters, digits, SOS, or spacing rules. The reference section keeps those high-frequency mappings visible while you work, which makes the page more useful than a bare converter alone.",
        },
      ]}
      interpretationCards={[
        {
          title: "Morse translation is deterministic when formatting is correct",
          description:
            "If the dots, dashes, spaces, and word separators are entered consistently, the output should decode cleanly without ambiguity for the supported symbols.",
        },
        {
          title: "Word separators matter as much as the signal tokens",
          description:
            "A correct Morse sequence with missing word boundaries can still be much harder to read. The slash separator is a practical part of clean formatting.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Output symbol counts help estimate signal length",
          description:
            "If you are building a puzzle, clue, or radio-style message, symbol count is a quick way to judge how dense or long the translated output will feel.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Morse is encoding, not security",
          description:
            "Anyone who knows the mapping can read it. Morse is useful for communication format and puzzles, not modern secrecy.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Classic distress call", input: "SOS", output: "... --- ..." },
        { scenario: "Two-word phrase", input: "help now", output: ".... . .-.. .--. / -. --- .--" },
        { scenario: "Decode a clue", input: "... --- ... / .... . .-.. .--.", output: "sos help" },
        { scenario: "Mixed symbols", input: "Code 5!", output: "-.-. --- -.. . / ..... -.-.--" },
      ]}
      whyChoosePoints={[
        "This Morse Code Translator is a real two-way utility rather than a placeholder route. It supports both encoding and decoding, handles common punctuation, and keeps the word-separator rule visible while you work.",
        "The quick-reference section makes the page more useful in practice because most users want fast lookup and translation together, not as two separate tasks.",
        "The interface also stays explicit about spacing conventions, which is where a lot of Morse formatting mistakes happen. That makes the tool more reliable for puzzle work and teaching.",
        "Everything runs locally in the browser with immediate updates. That is the right interaction model for a signal-format utility: type, inspect, copy, and move on.",
        "The page is honest about scope. It helps with translation and learning very well, but it does not pretend Morse is a modern secure encryption method.",
      ]}
      faqs={[
        {
          q: "How do I separate words in Morse code?",
          a: "Use a slash `/` between words. Letters within the same word should be separated by spaces.",
        },
        {
          q: "Can this translator decode Morse back into text?",
          a: "Yes. Switch the mode to Morse-to-text and enter Morse tokens separated by spaces, with slashes between words.",
        },
        {
          q: "Does it support numbers and punctuation?",
          a: "Yes. The translator includes letters, digits, and a set of common punctuation marks used in standard Morse references.",
        },
        {
          q: "Why is my decoded text blank or wrong?",
          a: "The most common issue is formatting. Check that letters are separated by spaces and full word breaks are separated with `/`.",
        },
        {
          q: "What is SOS in Morse code?",
          a: "SOS is written as `... --- ...`, one of the most widely recognized Morse sequences.",
        },
        {
          q: "Is Morse code a cipher?",
          a: "No. Morse code is an encoding and signaling system. It does not provide secrecy in the way a real cipher or encryption method would.",
        },
        {
          q: "Can I use this for classroom or puzzle work?",
          a: "Yes. That is one of the best uses for it. The page is designed for learning, scavenger hunts, clue creation, and signal-format exercises.",
        },
        {
          q: "Does the page save my messages?",
          a: "No. The values stay in the current browser state only. The tool is built for quick local translation and copy-paste use.",
        },
      ]}
      relatedTools={[
        { title: "Caesar Cipher Tool", slug: "encryption-decoder", icon: <Target className="w-4 h-4" />, color: 35, benefit: "Open another classic text-transformation tool" },
        { title: "Hash Generator", slug: "hash-generator", icon: <Shield className="w-4 h-4" />, color: 145, benefit: "Move into one-way text hashing" },
        { title: "Binary to Text Converter", slug: "text-to-binary-converter", icon: <ArrowLeftRight className="w-4 h-4" />, color: 210, benefit: "Use another reversible text encoding tool" },
        { title: "Regex Tester", slug: "regex-tester", icon: <Search className="w-4 h-4" />, color: 300, benefit: "Open another text-analysis utility" },
        { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Copy className="w-4 h-4" />, color: 265, benefit: "Check symbol-length and rate changes numerically" },
        { title: "Word Counter", slug: "word-counter", icon: <RotateCcw className="w-4 h-4" />, color: 20, benefit: "Measure plain-text length before translation" },
      ]}
      ctaTitle="Need Another Text Security Utility?"
      ctaDescription="Keep moving through the security category and continue replacing placeholder routes with real tools."
      ctaHref="/category/security"
    />
  );
}
