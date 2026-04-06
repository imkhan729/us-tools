import { useMemo, useState } from "react";
import { ArrowLeftRight, CheckCircle2, Copy, FileCode2, ShieldAlert, Type } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type Mode = "hex-to-text" | "text-to-hex";
type Charset = "utf-8" | "ascii";

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(" ");
}

function normalizeHex(value: string) {
  return value.replace(/0x/gi, "").replace(/[^0-9a-f]/gi, "").toLowerCase();
}

function hexToBytes(value: string) {
  const normalized = normalizeHex(value);
  if (!normalized) return new Uint8Array();
  if (normalized.length % 2 !== 0) throw new Error("Hex input must contain complete byte pairs.");

  const bytes = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < normalized.length; i += 2) {
    bytes[i / 2] = Number.parseInt(normalized.slice(i, i + 2), 16);
  }
  return bytes;
}

function decodeBytes(bytes: Uint8Array, charset: Charset) {
  if (charset === "ascii") {
    if (Array.from(bytes).some((byte) => byte > 127)) {
      throw new Error("ASCII mode only supports bytes from 00 to 7F.");
    }
  }

  return new TextDecoder(charset === "ascii" ? "ascii" : "utf-8", { fatal: false }).decode(bytes);
}

function encodeText(value: string, charset: Charset) {
  if (charset === "ascii" && Array.from(value).some((char) => char.charCodeAt(0) > 127)) {
    throw new Error("ASCII mode only supports basic ASCII characters.");
  }
  return new TextEncoder().encode(value);
}

export default function HexToTextConverter() {
  const [mode, setMode] = useState<Mode>("hex-to-text");
  const [charset, setCharset] = useState<Charset>("utf-8");
  const [input, setInput] = useState("48 65 6c 6c 6f 20 55 74 69 6c 69 74 79 20 48 75 62");
  const [copied, setCopied] = useState("");

  const result = useMemo(() => {
    try {
      if (!input.trim()) {
        return { output: "", bytes: 0, normalized: "", error: "" };
      }

      if (mode === "hex-to-text") {
        const bytes = hexToBytes(input);
        return {
          output: decodeBytes(bytes, charset),
          bytes: bytes.length,
          normalized: normalizeHex(input),
          error: "",
        };
      }

      const bytes = encodeText(input, charset);
      return {
        output: bytesToHex(bytes),
        bytes: bytes.length,
        normalized: bytesToHex(bytes).replace(/\s+/g, ""),
        error: "",
      };
    } catch (error: unknown) {
      return {
        output: "",
        bytes: 0,
        normalized: "",
        error: error instanceof Error ? error.message : "Conversion failed.",
      };
    }
  }, [charset, input, mode]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  };

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[
          { value: "hex-to-text", label: "Hex to Text" },
          { value: "text-to-hex", label: "Text to Hex" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setMode(item.value as Mode)}
            className={`rounded-full border px-4 py-2 text-xs font-bold ${mode === item.value ? "border-blue-500 bg-blue-500 text-white" : "border-border bg-card text-foreground hover:border-blue-500/40 hover:bg-muted"}`}
          >
            {item.label}
          </button>
        ))}
        <button onClick={() => setInput(mode === "hex-to-text" ? "48 65 6c 6c 6f 20 57 6f 72 6c 64" : "Hello World")} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Example
        </button>
        <button onClick={() => setInput("")} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Conversion Controls</p>
                <p className="text-sm text-muted-foreground">Switch direction, choose UTF-8 or ASCII interpretation, and convert instantly.</p>
              </div>
              <ArrowLeftRight className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Mode</label>
                <input readOnly value={mode === "hex-to-text" ? "Hex -> Text" : "Text -> Hex"} className="tool-calc-input w-full bg-muted/40 text-sm" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Charset</label>
                <select value={charset} onChange={(event) => setCharset(event.target.value as Charset)} className="tool-calc-input w-full">
                  <option value="utf-8">UTF-8</option>
                  <option value="ascii">ASCII</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{mode === "hex-to-text" ? "Hex Input" : "Text Input"}</label>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                spellCheck={false}
                className="tool-calc-input min-h-[220px] w-full resize-y font-mono text-sm"
                placeholder={mode === "hex-to-text" ? "Paste hex bytes like 48 65 6c 6c 6f" : "Enter the text to encode"}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Byte Count</p>
                <p className="mt-2 text-2xl font-black text-foreground">{result.bytes}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Pairs</p>
                <p className="mt-2 text-2xl font-black text-foreground">{result.bytes}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Charset</p>
                <p className="mt-2 text-2xl font-black text-emerald-600">{charset.toUpperCase()}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Status</p>
                <p className="mt-2 text-lg font-black text-foreground">{result.error ? "Error" : "Ready"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Converted Output</p>
                <p className="text-sm text-muted-foreground">Whitespace and optional `0x` prefixes are ignored in hex mode.</p>
              </div>
              {mode === "hex-to-text" ? <Type className="w-5 h-5 text-blue-500" /> : <FileCode2 className="w-5 h-5 text-blue-500" />}
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{mode === "hex-to-text" ? "Decoded Text" : "Encoded Hex"}</p>
                <button onClick={() => copyValue("output", result.output)} disabled={!result.output} className="text-xs font-bold text-blue-600 disabled:text-muted-foreground">
                  {copied === "output" ? "Copied" : "Copy"}
                </button>
              </div>
              <textarea readOnly value={result.error || result.output} spellCheck={false} className="mt-3 min-h-[150px] w-full resize-y rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none" />
            </div>

            <div className={`mt-4 rounded-2xl border p-4 ${result.error ? "border-rose-500/20 bg-rose-500/5" : result.output ? "border-emerald-500/20 bg-emerald-500/5" : "border-border bg-muted/30"}`}>
              <div className="flex items-start gap-3">
                {result.error ? <ShieldAlert className="mt-0.5 h-5 w-5 text-rose-600" /> : result.output ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" /> : <ArrowLeftRight className="mt-0.5 h-5 w-5 text-blue-600" />}
                <div>
                  <p className="mb-1 font-bold text-foreground">{result.error ? "Conversion failed" : result.output ? "Conversion succeeded" : "Enter input to convert"}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {result.error || (mode === "hex-to-text"
                      ? "Decoded text reflects the selected charset. UTF-8 supports multibyte characters, while ASCII accepts only bytes from 00 to 7F."
                      : "Encoded hex shows the raw byte sequence for the selected charset, spaced into readable byte pairs.")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Reading</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4"><p className="font-bold text-foreground">Hex Works in Byte Pairs</p><p className="mt-1">Every two hex characters represent one byte, so incomplete pairs like `4` or `abc` are invalid until completed.</p></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4"><p className="font-bold text-foreground">UTF-8 Handles Multibyte Text</p><p className="mt-1">Non-English characters often occupy more than one byte, which is why UTF-8 output can expand more than expected.</p></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4"><p className="font-bold text-foreground">ASCII Is Strict</p><p className="mt-1">ASCII mode is useful for logs, legacy protocols, and byte-level debugging when all values must stay below 80 hex.</p></div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            {[{ label: "Normalized hex", value: result.normalized }, { label: "Current output", value: result.output }].map((item) => (
              <div key={item.label} className="mb-3 rounded-xl border border-border bg-muted/40 p-3 last:mb-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                  <button onClick={() => copyValue(item.label, item.value)} disabled={!item.value} className="text-xs font-bold text-blue-600 disabled:text-muted-foreground">
                    {copied === item.label ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100"><code>{item.value}</code></pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Hex to Text Converter"
      seoTitle="Hex to Text Converter - Decode Hex Or Encode Text Online"
      seoDescription="Free hex to text converter with UTF-8 and ASCII support, live validation, byte-pair normalization, and browser-side encode or decode workflows."
      canonical="https://usonlinetools.com/security/hex-to-text"
      categoryName="Security & Encryption"
      categoryHref="/category/security"
      heroDescription="Decode hexadecimal byte strings into readable text or encode plain text back into hex instantly. This is useful for protocol debugging, payload inspection, fixture creation, and legacy text handling where raw byte values matter."
      heroIcon={<FileCode2 className="w-3.5 h-3.5" />}
      calculatorLabel="Hex Workspace"
      calculatorDescription="Switch between hex decode and text encode mode, choose UTF-8 or ASCII, and convert entirely in the browser."
      calculator={calculator}
      howSteps={[
        { title: "Choose the conversion direction first", description: "Use hex-to-text when you already have byte values and want to inspect them, or text-to-hex when you need a raw byte representation for testing and debugging." },
        { title: "Pick the charset that matches the source system", description: "UTF-8 is the modern default and supports multibyte text. ASCII is stricter and useful for legacy protocols, byte-level troubleshooting, and simple payloads." },
        { title: "Paste the input exactly as it appears", description: "Hex mode ignores spaces and optional `0x` prefixes, but it still requires complete byte pairs. Text mode preserves the actual characters you enter before encoding them into bytes." },
        { title: "Read validation errors as input-format issues first", description: "Most problems come from odd-length hex strings, invalid characters, or choosing ASCII for data that contains non-ASCII bytes or characters." },
      ]}
      interpretationCards={[
        { title: "Every byte is two hex characters", description: "Hex is a text representation of binary data, so values like `48 65 6c 6c 6f` are really byte pairs, not standalone decimal numbers." },
        { title: "UTF-8 output can expand for non-English text", description: "Characters outside the basic ASCII range often use multiple bytes, so the hex output length may be longer than the visible character count.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "ASCII mode is intentionally strict", description: "ASCII is best when you need values limited to `00` through `7F`. It should fail for higher byte values because those are outside the ASCII range.", className: "bg-emerald-500/5 border-emerald-500/20" },
        { title: "Whitespace is for readability, not meaning", description: "Spaces between hex pairs help humans read the data, but the actual byte values are determined only by the hex digits themselves.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Inspecting a payload", input: "48 54 54 50 2f 31 2e 31", output: "Decode byte pairs into readable protocol text" },
        { scenario: "Fixture generation", input: "Hello World", output: "Encode simple text into hex for tests and demos" },
        { scenario: "Legacy ASCII check", input: "41 42 43 7e", output: "Validate that all bytes stay inside the ASCII range" },
        { scenario: "UTF-8 debugging", input: "e2 9c 93", output: "Decode multibyte UTF-8 characters correctly instead of treating them as separate letters" },
      ]}
      whyChoosePoints={[
        "This page gives you a real browser-side encoder and decoder instead of static reference text.",
        "UTF-8 and ASCII support are available on one page, which makes it practical for modern apps and older byte-oriented workflows.",
        "Hex normalization removes whitespace and `0x` clutter so you can focus on the actual byte sequence.",
        "Validation is explicit, which helps when debugging malformed test payloads and incomplete byte strings.",
        "The page keeps the same long-form structure as the site’s main tools while still prioritizing working conversion UI above the fold.",
      ]}
      faqs={[
        { q: "What does hex to text conversion do?", a: "It interprets hexadecimal byte values as encoded text using a chosen character set such as UTF-8 or ASCII." },
        { q: "Why does my hex input fail to decode?", a: "Common causes are odd-length hex strings, invalid characters, or choosing ASCII for bytes above 7F." },
        { q: "What is the difference between UTF-8 and ASCII here?", a: "UTF-8 supports multibyte characters and modern text, while ASCII only supports the basic 7-bit range used by older systems and protocols." },
        { q: "Do spaces matter in hex input?", a: "No. Spaces are ignored and are only there to make byte pairs easier to read." },
        { q: "Can I paste values with `0x` prefixes?", a: "Yes. The converter strips optional `0x` prefixes before decoding the byte stream." },
        { q: "Why is the output longer than the number of characters I typed?", a: "Some characters use multiple bytes in UTF-8, so the resulting hex can be longer than the visible character count." },
        { q: "Does this tool send my payload anywhere?", a: "No. Encoding and decoding happen entirely in the browser." },
        { q: "When is ASCII mode useful?", a: "ASCII mode is useful for legacy protocols, low-level logs, and debugging workflows where every byte must remain in the 00 to 7F range." },
      ]}
      relatedTools={[
        { title: "AES Encrypt & Decrypt", slug: "aes-encrypt-decrypt", icon: <ShieldAlert className="w-4 h-4" />, color: 210, benefit: "Encrypt or decrypt text after inspecting raw bytes" },
        { title: "HMAC Generator", slug: "hmac-generator", icon: <ShieldAlert className="w-4 h-4" />, color: 145, benefit: "Sign payloads once the byte representation looks correct" },
        { title: "JWT Decoder", slug: "jwt-decoder", icon: <Type className="w-4 h-4" />, color: 260, benefit: "Inspect auth payloads alongside raw text conversions" },
        { title: "String Escape & Unescape", slug: "string-escape-unescape", icon: <Copy className="w-4 h-4" />, color: 30, benefit: "Prepare string literals before encoding them into bytes" },
        { title: "Base64 Encoder Decoder", slug: "base64-encoder-decoder", icon: <ArrowLeftRight className="w-4 h-4" />, color: 280, benefit: "Move between byte-friendly text encodings" },
        { title: "Binary to Text Converter", slug: "binary-to-text", icon: <FileCode2 className="w-4 h-4" />, color: 90, benefit: "Compare hex workflows with binary string conversions" },
      ]}
      ctaTitle="Need Another Security Utility?"
      ctaDescription="Continue through the security category and keep replacing undeveloped routes with real browser-side tools."
      ctaHref="/category/security"
    />
  );
}
