import { useMemo, useState } from "react";
import { Copy, Dices, KeyRound, RefreshCw, Shield, Type, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}<>?/|~";
const AMBIGUOUS = "O0Il1|`'\"";

function parseWhole(value: string, fallback: number, min: number, max: number) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function uniqueChars(value: string) {
  return Array.from(new Set(value.split(""))).join("");
}

function randomIndex(limit: number) {
  const buffer = new Uint32Array(1);
  const maxUint = 0xffffffff;
  const cutoff = maxUint - ((maxUint + 1) % limit);
  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0] > cutoff);
  return buffer[0] % limit;
}

function makeString(length: number, pool: string) {
  let output = "";
  for (let index = 0; index < length; index += 1) {
    output += pool[randomIndex(pool.length)];
  }
  return output;
}

export default function RandomStringGenerator() {
  const [lengthInput, setLengthInput] = useState("24");
  const [countInput, setCountInput] = useState("5");
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  const [custom, setCustom] = useState("");
  const [customOnly, setCustomOnly] = useState(false);
  const [results, setResults] = useState<string[]>([
    "3vFaT8jQmL2xR7nP6wYcK4dH",
    "rN9mQ2sV7xB4kT6pL5cW8fJ",
    "H6yP2tR9mZ4qV8nK3wX7dC5",
  ]);
  const [copied, setCopied] = useState("");

  const derived = useMemo(() => {
    const length = parseWhole(lengthInput, 24, 1, 256);
    const count = parseWhole(countInput, 5, 1, 50);
    let pool = "";
    if (!customOnly) {
      if (upper) pool += UPPERCASE;
      if (lower) pool += LOWERCASE;
      if (numbers) pool += NUMBERS;
      if (symbols) pool += SYMBOLS;
    }
    pool += custom;
    pool = uniqueChars(pool);
    if (excludeAmbiguous) {
      pool = pool.split("").filter((char) => !AMBIGUOUS.includes(char)).join("");
    }
    const entropy = pool.length > 0 ? length * Math.log2(pool.length) : 0;
    return { length, count, pool, poolSize: pool.length, entropy };
  }, [countInput, custom, customOnly, excludeAmbiguous, lengthInput, lower, numbers, symbols, upper]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  };

  const generate = () => {
    if (derived.poolSize === 0) {
      setResults([]);
      return;
    }
    setResults(Array.from({ length: derived.count }, () => makeString(derived.length, derived.pool)));
  };

  const setPreset = (kind: "api" | "coupon" | "full") => {
    if (kind === "api") {
      setLengthInput("32");
      setCountInput("3");
      setUpper(true);
      setLower(true);
      setNumbers(true);
      setSymbols(false);
      setExcludeAmbiguous(true);
      setCustom("");
      setCustomOnly(false);
      return;
    }
    if (kind === "coupon") {
      setLengthInput("12");
      setCountInput("8");
      setUpper(true);
      setLower(false);
      setNumbers(true);
      setSymbols(false);
      setExcludeAmbiguous(true);
      setCustom("");
      setCustomOnly(false);
      return;
    }
    setLengthInput("20");
    setCountInput("4");
    setUpper(true);
    setLower(true);
    setNumbers(true);
    setSymbols(true);
    setExcludeAmbiguous(false);
    setCustom("");
    setCustomOnly(false);
  };

  const batch = results.join("\n");
  const summary = `Length: ${derived.length}\nBatch: ${derived.count}\nPool: ${derived.poolSize}\nEntropy: ${derived.entropy.toFixed(0)} bits\nSample: ${results[0] ?? "(none)"}`;

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setPreset("api")} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">API Key Preset</button>
        <button onClick={() => setPreset("coupon")} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">Coupon Preset</button>
        <button onClick={() => setPreset("full")} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">Full Charset</button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Generator Controls</p>
                <p className="text-sm text-muted-foreground">Set the length, batch size, and character pool for browser-side random strings.</p>
              </div>
              <Wand2 className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">String Length</label>
                <input type="number" min="1" max="256" value={lengthInput} onChange={(event) => setLengthInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Batch Size</label>
                <input type="number" min="1" max="50" value={countInput} onChange={(event) => setCountInput(event.target.value)} className="tool-calc-input w-full" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center gap-3"><input type="checkbox" checked={upper} onChange={(event) => setUpper(event.target.checked)} />Include uppercase</label>
              <label className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center gap-3"><input type="checkbox" checked={lower} onChange={(event) => setLower(event.target.checked)} />Include lowercase</label>
              <label className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center gap-3"><input type="checkbox" checked={numbers} onChange={(event) => setNumbers(event.target.checked)} />Include numbers</label>
              <label className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center gap-3"><input type="checkbox" checked={symbols} onChange={(event) => setSymbols(event.target.checked)} />Include symbols</label>
              <label className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center gap-3"><input type="checkbox" checked={excludeAmbiguous} onChange={(event) => setExcludeAmbiguous(event.target.checked)} />Remove ambiguous</label>
              <label className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium flex items-center gap-3"><input type="checkbox" checked={customOnly} onChange={(event) => setCustomOnly(event.target.checked)} />Use only custom</label>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Custom Characters</label>
              <input type="text" value={custom} onChange={(event) => setCustom(event.target.value)} placeholder="Optional fixed alphabet such as ABCDEF0123456789" className="tool-calc-input w-full" />
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Pool Size</p><p className="mt-2 text-2xl font-black text-foreground">{derived.poolSize}</p></div>
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Length</p><p className="mt-2 text-2xl font-black text-foreground">{derived.length}</p></div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Entropy</p><p className="mt-2 text-2xl font-black text-emerald-600">{derived.entropy.toFixed(0)}b</p></div>
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Strings</p><p className="mt-2 text-2xl font-black text-foreground">{results.length}</p></div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={generate} className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-black text-white hover:bg-blue-600 transition-colors"><RefreshCw className="w-4 h-4" />Generate Strings</button>
              <button onClick={() => copyValue("batch", batch)} disabled={results.length === 0} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-black text-foreground disabled:cursor-not-allowed disabled:opacity-50"><Copy className="w-4 h-4" />{copied === "batch" ? "Copied" : "Copy Batch"}</button>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Generated Strings</p>
                <p className="text-sm text-muted-foreground">Each run generates a fresh batch with the active pool.</p>
              </div>
              <Dices className="w-5 h-5 text-blue-500" />
            </div>

            <div className="space-y-3">
              {results.length > 0 ? results.map((value, index) => (
                <div key={`${value}-${index}`} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">String {index + 1}</p>
                    <button onClick={() => copyValue(`row-${index}`, value)} className="text-xs font-bold text-blue-600 hover:text-blue-700">{copied === `row-${index}` ? "Copied" : "Copy"}</button>
                  </div>
                  <p className="mt-2 break-all rounded-xl bg-slate-950 px-3 py-3 font-mono text-sm text-slate-100">{value}</p>
                </div>
              )) : <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">Turn on at least one charset or add custom characters.</div>}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Reading</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4"><p className="font-bold text-foreground">Strength Snapshot</p><p className="mt-1">With a pool of {derived.poolSize} characters and length {derived.length}, each string carries about {derived.entropy.toFixed(1)} bits of entropy.</p></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4"><p className="font-bold text-foreground">Readable Codes</p><p className="mt-1">Removing ambiguous characters helps when users must read or type the output manually.</p></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4"><p className="font-bold text-foreground">Custom Pool</p><p className="mt-1">Custom-only mode is useful for restricted alphabets such as hex-like IDs or fixed coupon formats.</p></div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            <div className="space-y-3">
              {[{ label: "Generation summary", value: summary }, { label: "Batch output", value: batch || "(none)" }].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                    <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600 hover:text-blue-700">{copied === item.label ? "Copied" : "Copy"}</button>
                  </div>
                  <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100"><code>{item.value}</code></pre>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-muted-foreground">Use generated values with sane storage practices. Do not hard-code real secrets into client code or public repos.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Random String Generator"
      seoTitle="Online Random String Generator - Secure Custom Token Builder"
      seoDescription="Free online random string generator. Build browser-side strings with uppercase, lowercase, numbers, symbols, custom characters, and copy-ready batch output."
      canonical="https://usonlinetools.com/security/random-string-generator"
      categoryName="Security & Encryption"
      categoryHref="/category/security"
      heroDescription="Generate secure random strings for passwords, tokens, coupon codes, fixture data, or internal IDs. Adjust the character pool, remove ambiguous characters for human entry, add custom characters for fixed formats, and create one or many strings in a single run."
      heroIcon={<KeyRound className="w-3.5 h-3.5" />}
      calculatorLabel="Random String Workspace"
      calculatorDescription="Generate one or many browser-side random strings with a controlled character pool."
      calculator={calculator}
      howSteps={[
        { title: "Set the length and batch size", description: "Longer strings usually provide more entropy, while the batch size controls how many fresh values you need in one run." },
        { title: "Choose the character pool", description: "Enable uppercase, lowercase, numbers, symbols, or custom characters based on the format rules of the system that will receive the string." },
        { title: "Remove ambiguous characters if people must type the result", description: "Characters such as O and 0 or I and l are easy to confuse. Removing them trades a bit of search space for cleaner operations." },
        { title: "Generate and copy the output", description: "Create a fresh batch instantly, copy individual strings or the whole set, and move them into the target workflow." },
      ]}
      interpretationCards={[
        { title: "Entropy depends on both pool size and length", description: "Broad pools and longer strings usually produce stronger results than short values built from narrow alphabets." },
        { title: "Readable codes are often intentionally simpler", description: "Invite codes and coupons may avoid confusing characters even if that lowers the theoretical search space.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Custom-only mode is format-driven", description: "Use it when the target system accepts only a very specific alphabet, such as uppercase hex-style IDs.", className: "bg-emerald-500/5 border-emerald-500/20" },
        { title: "Batch output is useful for QA and admin work", description: "Generating several values at once speeds up test setup, invite creation, and other repetitive tasks.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Readable invite code", input: "Uppercase + numbers, ambiguous removed", output: "8K4QZ2N7TX" },
        { scenario: "API-style token", input: "32 chars, upper + lower + numbers", output: "v2L9aT7qR5mP8xK3cN4wB6hJ1sD0fYz" },
        { scenario: "Symbol-heavy secret", input: "20 chars, full charset", output: "a7#Qm!2Lp@9Zv$4Nc%Tx" },
        { scenario: "Custom pool", input: "ABCDEF0123456789 only", output: "A4D90C7E31BF58D2" },
      ]}
      whyChoosePoints={[
        "This page is a real interactive generator instead of a placeholder route. It lets you tune the actual character pool rather than relying on a fixed preset.",
        "The ambiguous-character option solves a real operational problem for typed codes and support workflows.",
        "Custom characters make the page flexible enough for restricted alphabets, internal formats, and coupon systems.",
        "Batch output and copy controls make it practical for QA, staging, and admin work where you need several values at once.",
        "Everything runs locally in the browser and uses the Web Crypto API for randomness.",
      ]}
      faqs={[
        { q: "Is this secure?", a: "The page uses the browser Web Crypto API for randomness. The final security still depends on how you store and use the generated value." },
        { q: "Why remove ambiguous characters?", a: "It helps when a human has to read or type the string and you want to avoid mistakes like O versus 0." },
        { q: "Can I generate multiple strings at once?", a: "Yes. Increase the batch size and the generator will return several unique values in one run." },
        { q: "What does custom-only mode do?", a: "It ignores the built-in character groups and generates strings only from the custom characters you provide." },
        { q: "Can I use this for API keys?", a: "You can create strong random values here, but production secret storage and rotation should still follow your platform rules." },
        { q: "Does the page save my strings?", a: "No. The values remain in the current browser state unless you copy them elsewhere." },
      ]}
      relatedTools={[
        { title: "Password Generator", slug: "password-generator", icon: <KeyRound className="w-4 h-4" />, color: 35, benefit: "Generate a password-focused secret" },
        { title: "Password Strength Checker", slug: "password-strength-checker", icon: <Shield className="w-4 h-4" />, color: 145, benefit: "Evaluate an existing password" },
        { title: "Base64 Encoder Decoder", slug: "base64-encoder-decoder", icon: <Copy className="w-4 h-4" />, color: 210, benefit: "Encode a generated value for transport" },
        { title: "Caesar Cipher Tool", slug: "encryption-decoder", icon: <RefreshCw className="w-4 h-4" />, color: 265, benefit: "Open another security text utility" },
        { title: "Morse Code Translator", slug: "morse-code-translator", icon: <Type className="w-4 h-4" />, color: 300, benefit: "Use another reversible text encoder" },
        { title: "Word Counter", slug: "word-counter", icon: <Type className="w-4 h-4" />, color: 20, benefit: "Check text length before formatting" },
      ]}
      ctaTitle="Need Another Security Utility?"
      ctaDescription="Continue through the security category and keep replacing placeholder routes with real browser tools."
      ctaHref="/category/security"
    />
  );
}
