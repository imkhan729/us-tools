import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  Copy,
  RotateCcw,
  Search,
  Shield,
  Target,
  Unlock,
  Wand2,
  Zap,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type Mode = "encrypt" | "decrypt";

function toNumber(input: string, fallback = 0) {
  const value = Number.parseFloat(input);
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function format(value: number, digits = 2) {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

function shiftChar(char: string, shift: number) {
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90) {
    return String.fromCharCode(((code - 65 + shift + 26 * 10) % 26) + 65);
  }
  if (code >= 97 && code <= 122) {
    return String.fromCharCode(((code - 97 + shift + 26 * 10) % 26) + 97);
  }
  return char;
}

function caesar(text: string, shift: number) {
  return text
    .split("")
    .map((char) => shiftChar(char, shift))
    .join("");
}

export default function CaesarCipherTool() {
  const [mode, setMode] = useState<Mode>("encrypt");
  const [shiftInput, setShiftInput] = useState("3");
  const [textInput, setTextInput] = useState("Attack at dawn");
  const [copiedLabel, setCopiedLabel] = useState("");

  const result = useMemo(() => {
    const normalizedShift = clamp(Math.round(toNumber(shiftInput, 0)), -25, 25);
    const effectiveShift = mode === "encrypt" ? normalizedShift : -normalizedShift;
    const output = caesar(textInput, effectiveShift);
    const bruteForce = Array.from({ length: 26 }, (_, index) => ({
      shift: index,
      text: caesar(textInput, -index),
    }));

    return {
      normalizedShift,
      output,
      bruteForce,
      lettersChanged: textInput.replace(/[^A-Za-z]/g, "").length,
    };
  }, [mode, shiftInput, textInput]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const resetAll = () => {
    setMode("encrypt");
    setShiftInput("3");
    setTextInput("Attack at dawn");
  };

  const loadDecryptPreset = () => {
    setMode("decrypt");
    setShiftInput("3");
    setTextInput("Dwwdfn dw gdzq");
  };

  const summarySnippet = [
    `Mode: ${mode}`,
    `Shift: ${format(result.normalizedShift, 0)}`,
    `Letters changed: ${format(result.lettersChanged, 0)}`,
    `Output: ${result.output}`,
  ].join("\n");

  const bruteForceSnippet = result.bruteForce
    .slice(0, 10)
    .map((row) => `Shift ${row.shift}: ${row.text}`)
    .join("\n");

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={loadDecryptPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Load Decrypt Example
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
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Cipher Controls</p>
                <p className="text-sm text-muted-foreground">Encrypt or decrypt alphabetic text with a classic Caesar shift while keeping punctuation and spaces intact.</p>
              </div>
              <Wand2 className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Mode</label>
                <select value={mode} onChange={(event) => setMode(event.target.value as Mode)} className="tool-calc-input w-full">
                  <option value="encrypt">Encrypt</option>
                  <option value="decrypt">Decrypt</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Shift</label>
                <input type="number" min="-25" max="25" step="1" value={shiftInput} onChange={(event) => setShiftInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Input Text</label>
                <textarea value={textInput} onChange={(event) => setTextInput(event.target.value)} rows={8} className="tool-calc-input min-h-[180px] w-full resize-y" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Output Text</label>
                  <button onClick={() => copyValue("output", result.output)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                    {copiedLabel === "output" ? "Copied" : "Copy"}
                  </button>
                </div>
                <textarea value={result.output} readOnly rows={8} className="tool-calc-input min-h-[180px] w-full resize-y" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Shift</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(result.normalizedShift, 0)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Letters Changed</p>
                <p className="mt-2 text-2xl font-black text-foreground">{format(result.lettersChanged, 0)}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Mode</p>
                <p className="mt-2 text-2xl font-black text-emerald-600">{mode === "encrypt" ? "Encode" : "Decode"}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Character Safety</p>
                <p className="mt-2 text-lg font-black text-foreground">Spaces kept</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Brute Force Viewer</p>
                <p className="text-sm text-muted-foreground">Use the quick shift table to inspect likely plaintext when the original shift is unknown.</p>
              </div>
              <Search className="w-5 h-5 text-blue-500" />
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60">
                    <th className="px-4 py-3 text-left font-bold text-foreground">Shift</th>
                    <th className="px-4 py-3 text-left font-bold text-foreground">Candidate Text</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {result.bruteForce.map((row) => (
                    <tr key={row.shift}>
                      <td className="px-4 py-3 font-mono text-foreground">{row.shift}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.text}</td>
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
                <p className="font-bold text-foreground">Cipher Result</p>
                <p className="mt-1">The current {mode} run applies a shift of {format(result.normalizedShift, 0)} and produces the output shown on the right without changing punctuation or spaces.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Shift Search</p>
                <p className="mt-1">If the shift is unknown, the brute-force table lets you scan all 26 possibilities quickly and spot readable plaintext by eye.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Best Use</p>
                <p className="mt-1">This tool is most useful for learning, puzzles, CTF warmups, and classic cipher demonstrations rather than modern secure encryption.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            <div className="space-y-3">
              {[
                { label: "Cipher summary", value: summarySnippet },
                { label: "Bruteforce sample", value: bruteForceSnippet },
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
                Caesar cipher is a historical teaching cipher, not modern encryption. It is trivial to brute-force and should never be used to protect sensitive data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Caesar Cipher Tool"
      seoTitle="Online Caesar Cipher Tool - Encrypt, Decrypt, and Brute Force Shifts"
      seoDescription="Free online Caesar cipher tool. Encrypt and decrypt text with a shift value, preserve punctuation, and inspect all 26 brute-force shift candidates."
      canonical="https://usonlinetools.com/security/encryption-decoder"
      categoryName="Security & Encryption"
      categoryHref="/category/security"
      heroDescription="Use this online Caesar cipher tool to encrypt and decrypt alphabetic text with a classic letter-shift algorithm. Enter a shift, switch between encode and decode mode, and use the built-in brute-force table to inspect all 26 candidate outputs when the original key is unknown. The page is designed for puzzles, classrooms, warm-up cryptography exercises, and lightweight text experiments."
      heroIcon={<Unlock className="w-3.5 h-3.5" />}
      calculatorLabel="Caesar Cipher Workspace"
      calculatorDescription="Encode, decode, and brute-force classic Caesar shift text directly in the browser."
      calculator={calculator}
      howSteps={[
        {
          title: "Choose whether you are encrypting or decrypting",
          description:
            "The Caesar cipher uses the same basic operation in both directions, but the sign of the shift changes. Encrypting moves letters forward through the alphabet. Decrypting moves them backward. Starting with the correct mode keeps the workflow simple and avoids the usual confusion when the output looks almost right but the direction is reversed.",
        },
        {
          title: "Enter the shift and text together",
          description:
            "A Caesar cipher depends entirely on the shift value. Once the shift is known, the text can be transformed instantly. This page keeps the shift input next to the text area so the relationship between key and output is always visible while you work.",
        },
        {
          title: "Use the brute-force table when the shift is unknown",
          description:
            "One of the main reasons the Caesar cipher is considered insecure is that there are only 26 practical shift options to test. The brute-force viewer takes advantage of that by showing each candidate plaintext directly. For puzzles and teaching, this is useful because it shows exactly how weak simple substitution ciphers can be.",
        },
        {
          title: "Treat the result as a learning or puzzle tool, not secure encryption",
          description:
            "The Caesar cipher is historically important and still useful in games, cryptography exercises, and lightweight obfuscation demos, but it is not real modern security. The page is strongest when used as an educational cipher tool rather than a privacy tool.",
        },
      ]}
      interpretationCards={[
        {
          title: "A Caesar shift changes only letters",
          description:
            "Spaces, punctuation, and non-alphabetic characters are left intact, which is why the output remains easy to format and read structurally.",
        },
        {
          title: "Brute-force success is expected, not exceptional",
          description:
            "If the brute-force table reveals the plaintext quickly, that is normal. The small keyspace is the reason the Caesar cipher is not secure.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Negative shifts work just as well as positive ones",
          description:
            "A shift of -3 is just a rotation in the opposite direction. The page handles both directions directly.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Readable plaintext is often the easiest validation check",
          description:
            "When you are brute-forcing a message, the correct shift usually stands out immediately because the output becomes naturally readable.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Basic encryption", input: "Attack at dawn with shift 3", output: "Dwwdfn dw gdzq" },
        { scenario: "Basic decryption", input: "Dwwdfn dw gdzq with shift 3", output: "Attack at dawn" },
        { scenario: "Unknown key puzzle", input: "Ciphertext with unknown shift", output: "Use the brute-force table to scan all 26 candidate plaintexts" },
        { scenario: "Negative shift", input: "Shift -5", output: "Letters rotate backward through the alphabet" },
      ]}
      whyChoosePoints={[
        "This Caesar Cipher Tool is a real interactive cipher page rather than a placeholder route. It supports direct encryption, direct decryption, and full brute-force shift inspection in one place, which covers the main practical uses of the cipher.",
        "The brute-force viewer is especially useful for education because it demonstrates immediately why the Caesar cipher is historically interesting but cryptographically weak. Seeing every possible shift makes the weakness tangible.",
        "The page also keeps punctuation and spacing intact, which makes the output easier to inspect and more useful in classrooms, puzzle design, and lightweight demonstrations.",
        "Everything runs locally in the browser and responds instantly. That is the right interaction model for a simple classical cipher utility: enter text, inspect the result, copy it, and move on.",
        "The tool stays clear about its limits. It helps with classic shift-cipher tasks well, but it does not pretend to be modern secure encryption.",
      ]}
      faqs={[
        {
          q: "What is a Caesar cipher?",
          a: "A Caesar cipher is a classic substitution cipher that shifts each letter in the alphabet by a fixed number of positions. It is one of the oldest and simplest cipher systems.",
        },
        {
          q: "How do I decrypt Caesar cipher text?",
          a: "If you know the shift, switch to decrypt mode and enter the same shift. If you do not know the shift, use the brute-force viewer to inspect all 26 candidates.",
        },
        {
          q: "Why is Caesar cipher considered weak?",
          a: "Because there are very few possible keys. An attacker can simply try every shift quickly and spot the readable plaintext, which is exactly what the brute-force table demonstrates.",
        },
        {
          q: "Does this tool preserve punctuation and spaces?",
          a: "Yes. Only alphabetic characters are shifted. Spaces, punctuation, and other symbols remain unchanged.",
        },
        {
          q: "Can I use negative shifts?",
          a: "Yes. Negative shifts rotate letters in the opposite direction, and the tool supports them directly.",
        },
        {
          q: "Is this safe for private messages?",
          a: "No. Caesar cipher is not secure by modern standards and should not be used to protect sensitive information.",
        },
        {
          q: "What is the brute-force table for?",
          a: "It shows every possible shift result so you can identify the correct plaintext when the original key is unknown.",
        },
        {
          q: "Does the page save my text?",
          a: "No. The values stay in the current browser state only. The tool is designed for quick local cipher work and demonstrations.",
        },
      ]}
      relatedTools={[
        { title: "Hash Generator", slug: "hash-generator", icon: <Shield className="w-4 h-4" />, color: 145, benefit: "Use a stronger one-way text utility" },
        { title: "Password Generator", slug: "password-generator", icon: <Target className="w-4 h-4" />, color: 35, benefit: "Move into another security-related generator" },
        { title: "Binary to Text Converter", slug: "text-to-binary-converter", icon: <ArrowLeftRight className="w-4 h-4" />, color: 210, benefit: "Use another reversible text transform" },
        { title: "Damage Calculator", slug: "damage-calculator", icon: <Zap className="w-4 h-4" />, color: 300, benefit: "Browse another newly completed utility page" },
        { title: "Percentage Calculator", slug: "percentage-calculator", icon: <Copy className="w-4 h-4" />, color: 265, benefit: "Work with shifts and pattern deltas numerically" },
        { title: "Regex Tester", slug: "regex-tester", icon: <Search className="w-4 h-4" />, color: 20, benefit: "Open another text-analysis tool" },
      ]}
      ctaTitle="Need Another Security Text Tool?"
      ctaDescription="Keep moving through the security category and continue replacing placeholder routes with real tools."
      ctaHref="/category/security"
    />
  );
}
