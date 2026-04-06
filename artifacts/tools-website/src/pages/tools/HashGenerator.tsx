import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Fingerprint,
  Hash,
  KeyRound,
  RefreshCw,
  SearchCheck,
  ShieldAlert,
  Wand2,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type OutputFormat = "hex" | "base64";
type CompareAlgorithm = "md5" | "sha1" | "sha256" | "sha512";

interface HashValue {
  hex: string;
  base64: string;
}

interface HashState {
  md5: HashValue;
  sha1: HashValue;
  sha256: HashValue;
  sha512: HashValue;
}

const emptyHashValue: HashValue = { hex: "", base64: "" };
const emptyHashes: HashState = {
  md5: emptyHashValue,
  sha1: emptyHashValue,
  sha256: emptyHashValue,
  sha512: emptyHashValue,
};

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function toBase64(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function md5Bytes(input: Uint8Array) {
  const originalLength = input.length;
  const bitLength = originalLength * 8;
  const withPaddingLength = (((originalLength + 8) >>> 6) + 1) * 64;
  const buffer = new Uint8Array(withPaddingLength);
  buffer.set(input);
  buffer[originalLength] = 0x80;

  const view = new DataView(buffer.buffer);
  view.setUint32(withPaddingLength - 8, bitLength >>> 0, true);
  view.setUint32(withPaddingLength - 4, Math.floor(bitLength / 0x100000000), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  const shifts = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  const constants = Array.from({ length: 64 }, (_, index) => Math.floor(Math.abs(Math.sin(index + 1)) * 0x100000000) >>> 0);

  for (let offset = 0; offset < buffer.length; offset += 64) {
    const chunk = new Uint32Array(16);
    for (let index = 0; index < 16; index += 1) {
      chunk[index] = view.getUint32(offset + index * 4, true);
    }

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let index = 0; index < 64; index += 1) {
      let f = 0;
      let g = 0;

      if (index < 16) {
        f = (b & c) | (~b & d);
        g = index;
      } else if (index < 32) {
        f = (d & b) | (~d & c);
        g = (5 * index + 1) % 16;
      } else if (index < 48) {
        f = b ^ c ^ d;
        g = (3 * index + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * index) % 16;
      }

      const rotateInput = (a + f + constants[index] + chunk[g]) >>> 0;
      const rotated = ((rotateInput << shifts[index]) | (rotateInput >>> (32 - shifts[index]))) >>> 0;

      a = d;
      d = c;
      c = b;
      b = (b + rotated) >>> 0;
    }

    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  const output = new Uint8Array(16);
  const outputView = new DataView(output.buffer);
  outputView.setUint32(0, a0, true);
  outputView.setUint32(4, b0, true);
  outputView.setUint32(8, c0, true);
  outputView.setUint32(12, d0, true);
  return output;
}

async function digestHash(algorithm: "SHA-1" | "SHA-256" | "SHA-512", bytes: Uint8Array): Promise<HashValue> {
  const digestInput = bytes.slice().buffer;
  const buffer = await crypto.subtle.digest(algorithm, digestInput);
  const digestBytes = new Uint8Array(buffer);
  return {
    hex: toHex(digestBytes),
    base64: toBase64(digestBytes),
  };
}

async function generateHashes(value: string): Promise<HashState> {
  const bytes = new TextEncoder().encode(value);
  const md5Digest = md5Bytes(bytes);
  const [sha1, sha256, sha512] = await Promise.all([
    digestHash("SHA-1", bytes),
    digestHash("SHA-256", bytes),
    digestHash("SHA-512", bytes),
  ]);

  return {
    md5: {
      hex: toHex(md5Digest),
      base64: toBase64(md5Digest),
    },
    sha1,
    sha256,
    sha512,
  };
}

export default function HashGenerator() {
  const [input, setInput] = useState("Utility Hub");
  const [saltPrefix, setSaltPrefix] = useState("");
  const [saltSuffix, setSaltSuffix] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("hex");
  const [compareAlgorithm, setCompareAlgorithm] = useState<CompareAlgorithm>("sha256");
  const [compareValue, setCompareValue] = useState("");
  const [hashes, setHashes] = useState<HashState>(emptyHashes);
  const [isWorking, setIsWorking] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState("");

  const composedInput = useMemo(() => `${saltPrefix}${input}${saltSuffix}`, [input, saltPrefix, saltSuffix]);
  const compareTarget = hashes[compareAlgorithm][outputFormat];
  const compareNormalized = compareValue.trim();
  const comparisonState = compareNormalized
    ? compareNormalized === compareTarget
      ? "match"
      : "different"
    : "idle";

  useEffect(() => {
    let cancelled = false;
    setIsWorking(true);

    generateHashes(composedInput)
      .then((next) => {
        if (!cancelled) {
          setHashes(next);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsWorking(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [composedInput]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => {
    setInput("release-2026-landing-page");
    setSaltPrefix("client:");
    setSaltSuffix(":v3");
    setCompareAlgorithm("sha256");
    setCompareValue("");
  };

  const clearAll = () => {
    setInput("");
    setSaltPrefix("");
    setSaltSuffix("");
    setCompareValue("");
  };

  const outputs = [
    {
      key: "md5" as const,
      title: "MD5",
      note: "Fast legacy checksum, not suitable for password security.",
      accent: "border-amber-500/20 bg-amber-500/5",
    },
    {
      key: "sha1" as const,
      title: "SHA-1",
      note: "Legacy integrity use only. Avoid for new security-sensitive systems.",
      accent: "border-orange-500/20 bg-orange-500/5",
    },
    {
      key: "sha256" as const,
      title: "SHA-256",
      note: "Modern general-purpose choice for checksums and signatures.",
      accent: "border-emerald-500/20 bg-emerald-500/5",
    },
    {
      key: "sha512" as const,
      title: "SHA-512",
      note: "Longer digest for high-integrity workflows and comparisons.",
      accent: "border-cyan-500/20 bg-cyan-500/5",
    },
  ];

  const howSteps = [
    {
      title: "Enter the exact text you want to hash",
      description:
        "Hash functions are deterministic, so the smallest input difference changes the output completely. That includes spaces, punctuation, line breaks, prefixes, suffixes, and casing. If you are trying to match a checksum from another tool, the most important part of the workflow is making sure the text in this tool is byte-for-byte identical to the source used elsewhere.",
    },
    {
      title: "Choose the output format and optional prefix or suffix salt",
      description:
        "Hexadecimal output is the most common format for checksums, signatures, and developer tooling. Base64 can be convenient when a compact transport string is easier to store or compare. Prefix and suffix fields are included because many real systems hash more than just the plain visible text. They may prepend tenant IDs, append version markers, or combine other internal values before generating the digest.",
    },
    {
      title: "Read all four algorithms side by side instead of guessing",
      description:
        "A practical hash generator should not force you to switch pages just to compare digest families. Showing MD5, SHA-1, SHA-256, and SHA-512 together makes the page more useful for migration work, legacy system support, quick debugging, and release verification. You can compare lengths, formats, and compatibility behavior in a single pass instead of bouncing between single-purpose tools.",
    },
    {
      title: "Use the comparison panel to validate a known digest",
      description:
        "When you already have a checksum from another system, paste it into the comparison area and select the corresponding algorithm. The page immediately tells you whether the generated digest matches. That is useful for integrity checks, API signing tests, fixture generation, build validation, and confirming that a string has not changed between environments or copy steps.",
    },
  ];

  const interpretationCards = [
    {
      title: "A hash is one-way output, not encrypted text",
      description:
        "This tool creates digests, not reversible encrypted content. A hash is designed so you can verify whether input changed, but not recover the original text from the digest. That distinction matters because developers sometimes mix up hashing and encryption even though they solve different problems.",
    },
    {
      title: "MD5 and SHA-1 still exist for compatibility, not modern trust",
      description:
        "You may still see MD5 and SHA-1 in legacy checksum systems, old APIs, or backward-compatible integrations. They are not considered strong choices for new security-sensitive designs. Their presence here is practical, not an endorsement for password storage or new signature schemes.",
      className: "border-amber-500/20 bg-amber-500/5",
    },
    {
      title: "SHA-256 is usually the default safe starting point",
      description:
        "For general integrity checks, release checksums, content validation, and many modern workflows, SHA-256 is the most common baseline. It is widely supported, has a predictable fixed length, and fits cleanly into developer tooling, CI pipelines, and documentation habits.",
      className: "border-emerald-500/20 bg-emerald-500/5",
    },
    {
      title: "Mismatches usually mean input drift, not a broken hash function",
      description:
        "If two digests do not match, the cause is often hidden whitespace, different line endings, a changed salt, a different encoding assumption, or selecting the wrong algorithm or output format. The comparison panel helps narrow that quickly, but the real debugging work usually starts with checking the exact input bytes.",
      className: "border-cyan-500/20 bg-cyan-500/5",
    },
  ];

  const examples = [
    { scenario: "Generate a release checksum", input: "release-2026-landing-page", output: "SHA-256 digest for deployment verification" },
    { scenario: "Match a legacy system digest", input: "client:invoice-1182:v3", output: "MD5 or SHA-1 for compatibility comparison" },
    { scenario: "Store a compact digest string", input: "Text plus prefix and suffix salt", output: "Base64 digest for transport or config use" },
    { scenario: "Validate a copied checksum", input: "Same source text as another environment", output: "Match or mismatch signal in the compare panel" },
  ];

  const whyChoosePoints = [
    "This hash generator is built around real developer behavior instead of a thin placeholder tool. It calculates four common digest families at once, supports both hex and Base64 output, adds optional prefix and suffix inputs, includes copy actions, and provides a comparison workflow for validation. That makes it useful for debugging, integration work, release checks, and compatibility testing in a way that single-output tools often are not.",
    "The page also handles a common practical gap: many users do not just want to generate a hash, they want to confirm whether it matches another value from another system. The built-in comparison panel turns the page from a simple converter into a verification surface. That is much closer to how developers actually use checksum tools during support, QA, migrations, and API troubleshooting.",
    "Long-form supporting content matters here because the search intent around hashes is mixed. Some people want a checksum generator, some want to understand MD5 versus SHA-256, and some need help diagnosing mismatches. This page answers all three without burying the working tool, which is a stronger fit for both usability and the site structure your prompt requires.",
    "Everything runs in the browser, which is the right default for ad hoc hashing of notes, payload fragments, API test strings, or release metadata. If the text belongs to a private client project, staging launch, internal token test, or unpublished product copy, keeping the operation local avoids unnecessary exposure to a third-party service for a job that the browser can do directly.",
    "The tool is also honest about algorithm strength. MD5 and SHA-1 are included because developers still encounter them, not because they should be the default choice for new secure systems. That clarity improves the page quality and makes the tool more credible than a generic hash page that lists algorithms without explaining when they are appropriate or outdated.",
  ];

  const faqs = [
    {
      q: "What is the difference between MD5, SHA-1, SHA-256, and SHA-512?",
      a: "They are different hashing algorithms that produce different digest lengths and have different security profiles. MD5 and SHA-1 are legacy algorithms mainly kept for compatibility and old checksum workflows. SHA-256 and SHA-512 are stronger modern SHA-2 family algorithms and are the better default for new integrity-related use cases.",
    },
    { q: "Can I reverse a hash back into the original text?", a: "No. A hash is designed as a one-way digest. You can compare whether two inputs produce the same output, but you should not expect to recover the original text from the hash. That is one of the core differences between hashing and encryption." },
    { q: "Why does changing one character create a completely different hash?", a: "That is a normal property of cryptographic hash functions, often called the avalanche effect. A tiny input change should produce a substantially different output. This is useful because it makes hashes effective for integrity checks and mismatch detection." },
    { q: "Should I use MD5 or SHA-1 for passwords?", a: "No. MD5 and SHA-1 are not appropriate for modern password storage. Password hashing should use dedicated password hashing functions such as bcrypt, scrypt, or Argon2 with proper salts and cost settings. This tool is for general hashing and compatibility checks, not secure password storage design." },
    { q: "Why would I use Base64 output instead of hex?", a: "Hex is more traditional and easier to read in many developer contexts, but Base64 can be shorter and more convenient when embedding digests into configs, headers, or compact transport strings. The best choice depends on the system you need to match." },
    { q: "What does the prefix or suffix salt field do?", a: "It lets you add extra text before or after the main input before hashing. This is useful when a real system hashes a compound string rather than plain text alone. It also helps when reproducing digests from integrations that concatenate IDs, versions, or tenant markers before generating a checksum." },
    { q: "Why is my generated hash different from another tool?", a: "The cause is usually a mismatch in the exact input, not the algorithm itself. Check for hidden spaces, line endings, different salts, uppercase versus lowercase text, encoding assumptions, the selected algorithm, and whether the other tool is showing hex or Base64 output." },
    { q: "Who is this hash generator useful for?", a: "It is useful for developers, QA engineers, DevOps teams, agencies, support engineers, and technical marketers who need quick checksums, payload validation, release verification, API testing, or one-screen digest comparisons during day-to-day work." },
  ];

  const relatedTools = [
    { title: "Base64 Encoder & Decoder", slug: "base64-encoder-decoder", icon: <KeyRound className="h-4 w-4" />, color: 28, benefit: "Work with encoded strings alongside digest output" },
    { title: "Password Strength Checker", slug: "password-strength-checker", icon: <ShieldAlert className="h-4 w-4" />, color: 350, benefit: "Evaluate password quality separately from hashing" },
    { title: "JSON Formatter", slug: "json-formatter", icon: <Hash className="h-4 w-4" />, color: 210, benefit: "Clean request payloads before signing or hashing" },
    { title: "URL Encoder & Decoder", slug: "url-encoder-decoder", icon: <Copy className="h-4 w-4" />, color: 190, benefit: "Prepare query values before checksum workflows" },
    { title: "Cron Expression Generator", slug: "cron-expression-generator", icon: <RefreshCw className="h-4 w-4" />, color: 135, benefit: "Build scheduled automation around verification jobs" },
    { title: "Color Code Converter", slug: "color-code-converter", icon: <Wand2 className="h-4 w-4" />, color: 305, benefit: "Switch to another developer tool without leaving the hub" },
  ];

  return (
    <UtilityToolPageShell
      title="Hash Generator (MD5, SHA)"
      seoTitle="Hash Generator (MD5, SHA-1, SHA-256, SHA-512) Online"
      seoDescription="Free hash generator for MD5, SHA-1, SHA-256, and SHA-512 with real-time output, hex or Base64 format, salt fields, and hash verification."
      canonical="https://usonlinetools.com/developer/hash-generator"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Generate MD5, SHA-1, SHA-256, and SHA-512 digests from text in your browser. This free hash generator is built for developers who need quick checksums, integrity comparisons, API test data, release verification, or compact one-screen comparison across multiple algorithms without sending text to a remote service."
      heroIcon={<Fingerprint className="w-3.5 h-3.5" />}
      calculatorLabel="Hash Generator"
      calculatorDescription="Enter text, choose hex or Base64 output, optionally add prefix or suffix salt, and compare the generated digest instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div>
                <label htmlFor="hash-format" className="mb-2 block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Output Format</label>
                <select id="hash-format" value={outputFormat} onChange={(event) => setOutputFormat(event.target.value as OutputFormat)} className="tool-calc-input w-full">
                  <option value="hex">Hexadecimal</option>
                  <option value="base64">Base64</option>
                </select>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Optional Salt Pattern</p>
                <div>
                  <label htmlFor="hash-prefix" className="mb-1.5 block text-xs font-bold text-muted-foreground">Prefix</label>
                  <input id="hash-prefix" value={saltPrefix} onChange={(event) => setSaltPrefix(event.target.value)} placeholder="client:" className="tool-calc-input w-full" />
                </div>
                <div>
                  <label htmlFor="hash-suffix" className="mb-1.5 block text-xs font-bold text-muted-foreground">Suffix</label>
                  <input id="hash-suffix" value={saltSuffix} onChange={(event) => setSaltSuffix(event.target.value)} placeholder=":v3" className="tool-calc-input w-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={loadSample} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                  <Wand2 className="h-4 w-4" />
                  Sample
                </button>
                <button onClick={clearAll} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                  <RefreshCw className="h-4 w-4" />
                  Clear
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Input Stats</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">Visible characters</span><span className="text-sm font-bold text-foreground">{input.length}</span></div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">Final hashed input</span><span className="text-sm font-bold text-foreground">{composedInput.length}</span></div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">Output mode</span><span className="text-sm font-bold text-foreground">{outputFormat === "hex" ? "Hex" : "Base64"}</span></div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Security Note</p>
                <p className="text-sm leading-relaxed text-muted-foreground">MD5 and SHA-1 are included for compatibility and checksum workflows, not for new password storage or modern security design. Prefer SHA-256 or SHA-512 for new integrity-related use cases.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Source Text</p>
                  <p className="text-xs text-muted-foreground">{isWorking ? "Updating hashes..." : "Live output"}</p>
                </div>
                <textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type or paste the text you want to hash..." spellCheck={false} className="min-h-[180px] w-full resize-none rounded-2xl border border-border bg-background p-4 font-mono text-sm leading-relaxed text-foreground outline-none" />
                <div className="mt-3 rounded-xl border border-border bg-muted/30 px-3 py-2.5">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground mb-1">Final String Being Hashed</p>
                  <code className="block break-all text-xs text-foreground">{composedInput || "(empty string)"}</code>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {outputs.map((item) => {
                  const value = hashes[item.key][outputFormat];
                  return (
                    <div key={item.key} className={`rounded-2xl border p-5 ${item.accent}`}>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.note}</p>
                        </div>
                        <button onClick={() => copyValue(item.title, value)} className="text-xs font-bold text-blue-600 hover:text-blue-700">{copiedLabel === item.title ? "Copied" : "Copy"}</button>
                      </div>
                      <textarea readOnly value={value} spellCheck={false} className="min-h-[120px] w-full resize-none rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none" />
                      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border bg-white/50 px-3 py-2.5 dark:bg-slate-900/40">
                        <span className="text-sm text-muted-foreground">Length</span>
                        <span className="text-sm font-bold text-foreground">{value.length || 0} chars</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Compare a Known Hash</p>
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3 mb-3">
                    <select value={compareAlgorithm} onChange={(event) => setCompareAlgorithm(event.target.value as CompareAlgorithm)} className="tool-calc-input w-full">
                      <option value="md5">MD5</option>
                      <option value="sha1">SHA-1</option>
                      <option value="sha256">SHA-256</option>
                      <option value="sha512">SHA-512</option>
                    </select>
                    <input value={compareValue} onChange={(event) => setCompareValue(event.target.value)} placeholder={`Paste a ${compareAlgorithm.toUpperCase()} ${outputFormat} digest to compare`} className="tool-calc-input w-full" />
                  </div>
                  <div className={`rounded-2xl border p-4 ${comparisonState === "match" ? "border-emerald-500/20 bg-emerald-500/5" : comparisonState === "different" ? "border-rose-500/20 bg-rose-500/5" : "border-border bg-muted/30"}`}>
                    <div className="flex items-start gap-3">
                      {comparisonState === "match" ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" /> : comparisonState === "different" ? <ShieldAlert className="mt-0.5 h-5 w-5 text-rose-600" /> : <SearchCheck className="mt-0.5 h-5 w-5 text-blue-600" />}
                      <div>
                        <p className="mb-1 font-bold text-foreground">
                          {comparisonState === "match"
                            ? "Digest matches the generated output"
                            : comparisonState === "different"
                              ? "Digest does not match the generated output"
                              : "Paste a hash to compare against the generated digest"}
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {comparisonState === "match"
                            ? "The generated value and the pasted digest are identical for the selected algorithm and output format."
                            : comparisonState === "different"
                              ? "Check the input text, prefix or suffix salt, selected algorithm, and output format. A single character change produces a completely different digest."
                              : "This is useful for quick checksum validation, test fixtures, API signing checks, and confirming that two systems hashed the same exact input."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
                  <div className="space-y-3">
                    {[
                      { label: "SHA-256", value: hashes.sha256[outputFormat] },
                      { label: "SHA-512", value: hashes.sha512[outputFormat] },
                      { label: "Checksum Record", value: `sha256=${hashes.sha256.hex}\nsha512=${hashes.sha512.hex}` },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                          <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600 hover:text-blue-700">{copiedLabel === item.label ? "Copied" : "Copy"}</button>
                        </div>
                        <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                          <code>{item.value}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={howSteps}
      interpretationCards={interpretationCards}
      examples={examples}
      whyChoosePoints={whyChoosePoints}
      faqs={faqs}
      relatedTools={relatedTools}
      ctaTitle="Need More Developer Utilities?"
      ctaDescription="Keep moving through the developer toolset for encoding, formatting, conversion, validation, and front-end workflow tasks."
      ctaHref="/category/developer"
    />
  );
}
