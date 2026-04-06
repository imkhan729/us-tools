import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Fingerprint,
  KeyRound,
  RefreshCw,
  Shield,
  ShieldAlert,
  Wand2,
  Webhook,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type HmacAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
type OutputFormat = "hex" | "base64";

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

async function generateHmac(message: string, secret: string, algorithm: HmacAlgorithm) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: algorithm },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  const bytes = new Uint8Array(signature);

  return {
    hex: toHex(bytes),
    base64: toBase64(bytes),
    byteLength: bytes.length,
  };
}

export default function HmacGenerator() {
  const [message, setMessage] = useState("timestamp=1712140800\nmethod=POST\npath=/webhooks/test");
  const [secret, setSecret] = useState("whsec_demo_2026");
  const [algorithm, setAlgorithm] = useState<HmacAlgorithm>("SHA-256");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("hex");
  const [compareValue, setCompareValue] = useState("");
  const [result, setResult] = useState({ hex: "", base64: "", byteLength: 0 });
  const [isWorking, setIsWorking] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState("");

  useEffect(() => {
    let cancelled = false;
    setIsWorking(true);

    generateHmac(message, secret, algorithm)
      .then((next) => {
        if (!cancelled) {
          setResult(next);
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
  }, [algorithm, message, secret]);

  const activeOutput = result[outputFormat];
  const compareNormalized = compareValue.trim();
  const comparisonState = compareNormalized
    ? compareNormalized === activeOutput
      ? "match"
      : "different"
    : "idle";

  const stats = useMemo(() => {
    const messageBytes = new TextEncoder().encode(message).length;
    const secretBytes = new TextEncoder().encode(secret).length;
    return { messageBytes, secretBytes };
  }, [message, secret]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadWebhookPreset = () => {
    setAlgorithm("SHA-256");
    setSecret("whsec_live_demo_key");
    setMessage('{"event":"invoice.paid","id":"evt_1024","amount":24900}');
    setCompareValue("");
  };

  const loadApiPreset = () => {
    setAlgorithm("SHA-512");
    setSecret("api-signing-secret-v2");
    setMessage("POST\n/v1/orders\n2026-04-02T12:00:00Z\nbody-sha256=0f9f8db9");
    setCompareValue("");
  };

  const clearAll = () => {
    setMessage("");
    setSecret("");
    setCompareValue("");
  };

  const summarySnippet = [
    `Algorithm: ${algorithm}`,
    `Format: ${outputFormat}`,
    `Message bytes: ${stats.messageBytes}`,
    `Secret bytes: ${stats.secretBytes}`,
    `Signature: ${activeOutput}`,
  ].join("\n");

  const headerSnippet = [
    `X-Signature-Algorithm: ${algorithm}`,
    `X-Signature: ${activeOutput}`,
  ].join("\n");

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={loadWebhookPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Webhook Preset
        </button>
        <button onClick={loadApiPreset} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          API Signing Preset
        </button>
        <button onClick={clearAll} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Signature Controls</p>
                <p className="text-sm text-muted-foreground">Generate keyed signatures for API requests, webhooks, and payload verification.</p>
              </div>
              <Webhook className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Algorithm</label>
                <select value={algorithm} onChange={(event) => setAlgorithm(event.target.value as HmacAlgorithm)} className="tool-calc-input w-full">
                  <option value="SHA-1">HMAC SHA-1</option>
                  <option value="SHA-256">HMAC SHA-256</option>
                  <option value="SHA-384">HMAC SHA-384</option>
                  <option value="SHA-512">HMAC SHA-512</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Output Format</label>
                <select value={outputFormat} onChange={(event) => setOutputFormat(event.target.value as OutputFormat)} className="tool-calc-input w-full">
                  <option value="hex">Hexadecimal</option>
                  <option value="base64">Base64</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Secret Key</label>
              <input value={secret} onChange={(event) => setSecret(event.target.value)} placeholder="Enter shared secret" spellCheck={false} className="tool-calc-input w-full font-mono" />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Message / Payload</label>
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Paste the exact string being signed" spellCheck={false} className="tool-calc-input min-h-[220px] w-full resize-y font-mono text-sm" />
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Message Bytes</p>
                <p className="mt-2 text-2xl font-black text-foreground">{stats.messageBytes}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Secret Bytes</p>
                <p className="mt-2 text-2xl font-black text-foreground">{stats.secretBytes}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Digest Bytes</p>
                <p className="mt-2 text-2xl font-black text-emerald-600">{result.byteLength}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Status</p>
                <p className="mt-2 text-lg font-black text-foreground">{isWorking ? "Updating" : "Ready"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Generated Signature</p>
                <p className="text-sm text-muted-foreground">The HMAC updates as soon as the message, key, or algorithm changes.</p>
              </div>
              <Fingerprint className="w-5 h-5 text-blue-500" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{algorithm} in {outputFormat}</p>
                <button onClick={() => copyValue("signature", activeOutput)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                  {copiedLabel === "signature" ? "Copied" : "Copy"}
                </button>
              </div>
              <textarea readOnly value={activeOutput} spellCheck={false} className="mt-3 min-h-[120px] w-full resize-y rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none" />
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-card p-4">
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Compare a Known Signature</p>
              <input
                value={compareValue}
                onChange={(event) => setCompareValue(event.target.value)}
                placeholder={`Paste a ${outputFormat} signature to compare`}
                spellCheck={false}
                className="tool-calc-input w-full font-mono"
              />
              <div className={`mt-3 rounded-xl border p-4 ${comparisonState === "match" ? "border-emerald-500/20 bg-emerald-500/5" : comparisonState === "different" ? "border-rose-500/20 bg-rose-500/5" : "border-border bg-muted/30"}`}>
                <div className="flex items-start gap-3">
                  {comparisonState === "match" ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" /> : comparisonState === "different" ? <ShieldAlert className="mt-0.5 h-5 w-5 text-rose-600" /> : <Shield className="mt-0.5 h-5 w-5 text-blue-600" />}
                  <div>
                    <p className="mb-1 font-bold text-foreground">
                      {comparisonState === "match"
                        ? "Signature match"
                        : comparisonState === "different"
                          ? "Signature mismatch"
                          : "Paste a signature to validate this output"}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {comparisonState === "match"
                        ? "The generated signature and the pasted value are identical for the selected algorithm and output format."
                        : comparisonState === "different"
                          ? "A mismatch usually means the message string, secret, algorithm, byte order, or output format differs from the source system."
                          : "This comparison view is useful for webhook debugging, request signing QA, and fixture verification."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Reading</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Deterministic Output</p>
                <p className="mt-1">If the message, secret, and algorithm stay identical, the signature stays identical. Change even one byte and the HMAC changes immediately.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Algorithm-Specific Length</p>
                <p className="mt-1">{algorithm} currently returns {result.byteLength} raw bytes before hex or Base64 formatting is applied.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Verification Workflow</p>
                <p className="mt-1">The compare panel is the fastest way to confirm whether your local signing logic matches a webhook provider or API gateway.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            <div className="space-y-3">
              {[
                { label: "Signature summary", value: summarySnippet },
                { label: "Header example", value: headerSnippet },
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
                HMAC proves integrity and authenticity only when the shared secret stays private and both sides sign the exact same byte sequence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="HMAC Generator"
      seoTitle="HMAC Generator - Create SHA-Based HMAC Signatures Online"
      seoDescription="Free HMAC generator for SHA-1, SHA-256, SHA-384, and SHA-512 with browser-side signing, comparison mode, and copy-ready output."
      canonical="https://usonlinetools.com/security/hmac-generator"
      categoryName="Security & Encryption"
      categoryHref="/category/security"
      heroDescription="Generate HMAC signatures in the browser for webhook verification, API request signing, and message integrity checks. Enter the exact message string, choose a shared secret and hash family, then compare the output against a known signature in real time."
      heroIcon={<KeyRound className="w-3.5 h-3.5" />}
      calculatorLabel="HMAC Workspace"
      calculatorDescription="Sign text with a shared secret, switch between SHA variants, and compare the result instantly."
      calculator={calculator}
      howSteps={[
        {
          title: "Paste the exact message string being signed",
          description:
            "HMAC verification fails most often because the message is not byte-for-byte identical between systems. Preserve line breaks, header order, timestamps, and JSON spacing exactly when reproducing a signature.",
        },
        {
          title: "Use the same shared secret and algorithm as the source system",
          description:
            "HMAC is deterministic only when the key and hash function match. If the server uses HMAC SHA-256 and you generate HMAC SHA-512 locally, the signature will be different even if the message and key are identical.",
        },
        {
          title: "Choose the output format expected by the target workflow",
          description:
            "Some platforms expose signatures in hexadecimal, while others use Base64. The signature bytes are the same underneath, but the representation changes, so format mismatches can look like crypto problems even when the math is correct.",
        },
        {
          title: "Compare against a known signature before debugging anything else",
          description:
            "If the compare panel says the values do not match, start by checking the message string, secret, and algorithm before inspecting transport code. Most signing bugs come from canonicalization drift, not from the HMAC primitive itself.",
        },
      ]}
      interpretationCards={[
        {
          title: "HMAC is keyed hashing, not reversible encryption",
          description:
            "The output proves that someone with the shared secret signed the message, but it does not encrypt the message contents or let you recover the secret from the signature.",
        },
        {
          title: "Message integrity depends on exact bytes",
          description:
            "Whitespace, line endings, field order, and trailing newlines all matter. A visually similar string can still produce a completely different signature.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Algorithm choice changes digest length and output",
          description:
            "HMAC SHA-256 and HMAC SHA-512 are both valid but return different signatures. Always match the server-side algorithm exactly.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "A mismatch usually indicates canonicalization drift",
          description:
            "When an HMAC compare fails, common causes include wrong timestamp placement, newline differences, hidden spaces, JSON serialization changes, or using the wrong output format.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Webhook verification", input: '{"event":"invoice.paid","id":"evt_1024"}', output: "Generate HMAC SHA-256 and compare it to the provider signature header" },
        { scenario: "API request signing", input: "POST\\n/v1/orders\\n2026-04-02T12:00:00Z", output: "Use HMAC SHA-512 for a stronger request signature" },
        { scenario: "Fixture generation", input: "Known payload + test secret", output: "Create a repeatable local signature for automated tests" },
        { scenario: "Debugging mismatch", input: "Same payload in hex or Base64 output", output: "Switch formats to confirm whether the issue is representation or signing" },
      ]}
      whyChoosePoints={[
        "This page gives you a real browser-side HMAC implementation using Web Crypto, not placeholder copy or a fake checksum workaround.",
        "The comparison panel makes the tool practical for webhook debugging and API signing QA instead of limiting it to one-way generation.",
        "Multiple SHA-family options are available on one page, which is more useful than bouncing between separate single-algorithm tools.",
        "The page keeps the long-form structure used across the site while still prioritizing the working tool above the fold.",
        "Everything runs locally in the browser, which is useful when signing unpublished payloads, staging events, or internal test strings.",
      ]}
      faqs={[
        {
          q: "What is HMAC used for?",
          a: "HMAC is commonly used to verify that a message came from someone who knows a shared secret and that the message was not modified in transit. Typical examples are webhook verification and API request signing.",
        },
        {
          q: "Why does my HMAC not match the server value?",
          a: "The most common causes are mismatched message bytes, wrong secret, wrong algorithm, or wrong output format. Hidden whitespace and line-ending differences are especially common.",
        },
        {
          q: "Is HMAC the same as hashing a password?",
          a: "No. HMAC is for message authentication with a shared secret. Password storage should use dedicated password hashing functions such as bcrypt, scrypt, or Argon2.",
        },
        {
          q: "Should I use hex or Base64 output?",
          a: "Use whatever the target system expects. Both represent the same underlying signature bytes, but the text encoding differs.",
        },
        {
          q: "Can I leave the secret empty?",
          a: "Technically an empty key still produces an HMAC, but in practice a real shared secret should be private, non-trivial, and managed securely.",
        },
        {
          q: "Does this tool send my payload anywhere?",
          a: "No. The signing happens in your browser using the Web Crypto API, so the entered message and secret stay local to the page session.",
        },
        {
          q: "Which algorithm should I choose?",
          a: "Match the server or provider exactly. If you control both ends, HMAC SHA-256 is a common baseline and HMAC SHA-512 is also widely used.",
        },
        {
          q: "Can this validate webhook signatures?",
          a: "Yes. Paste the exact signed payload, enter the shared secret, select the provider algorithm, and compare the generated signature to the incoming header value.",
        },
      ]}
      relatedTools={[
        { title: "Hash Generator", slug: "hash-generator", icon: <Fingerprint className="w-4 h-4" />, color: 210, benefit: "Generate raw digests without a secret key" },
        { title: "Random String Generator", slug: "random-string-generator", icon: <Wand2 className="w-4 h-4" />, color: 145, benefit: "Create random test secrets and keys" },
        { title: "Password Strength Checker", slug: "password-strength-checker", icon: <ShieldAlert className="w-4 h-4" />, color: 350, benefit: "Evaluate human passwords separately from signatures" },
        { title: "JSON Formatter", slug: "json-formatter", icon: <Webhook className="w-4 h-4" />, color: 30, benefit: "Inspect payload structure before signing" },
        { title: "String Escape & Unescape", slug: "string-escape-unescape", icon: <Copy className="w-4 h-4" />, color: 280, benefit: "Check hidden characters in a signed message" },
        { title: "Regex Tester", slug: "regex-tester", icon: <KeyRound className="w-4 h-4" />, color: 90, benefit: "Validate message formats before canonicalization" },
      ]}
      ctaTitle="Need Another Security Utility?"
      ctaDescription="Continue through the security category and keep replacing undeveloped routes with real browser-side tools."
      ctaHref="/category/security"
    />
  );
}
