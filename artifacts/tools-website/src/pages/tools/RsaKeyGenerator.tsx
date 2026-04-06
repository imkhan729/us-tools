import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Copy, Download, FileKey2, KeyRound, LockKeyhole, RefreshCcw, Shield, ShieldAlert } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type KeySize = 2048 | 3072 | 4096;

type GeneratedPair = {
  algorithm: string;
  modulusLength: KeySize;
  publicPem: string;
  privatePem: string;
  publicFingerprint: string;
  publicBytes: number;
  privateBytes: number;
};

const KEY_SIZES: KeySize[] = [2048, 3072, 4096];

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function formatPem(label: string, base64: string) {
  const wrapped = base64.match(/.{1,64}/g)?.join("\n") ?? base64;
  return `-----BEGIN ${label}-----\n${wrapped}\n-----END ${label}-----`;
}

async function fingerprintFromBuffer(buffer: ArrayBuffer) {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(":");
}

async function exportPem(key: CryptoKey, label: "PUBLIC KEY" | "PRIVATE KEY") {
  const format = label === "PUBLIC KEY" ? "spki" : "pkcs8";
  const exported = await crypto.subtle.exportKey(format, key);
  return {
    bytes: exported.byteLength,
    pem: formatPem(label, arrayBufferToBase64(exported)),
    raw: exported,
  };
}

async function generatePair(modulusLength: KeySize): Promise<GeneratedPair> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  );

  const publicExport = await exportPem(keyPair.publicKey, "PUBLIC KEY");
  const privateExport = await exportPem(keyPair.privateKey, "PRIVATE KEY");
  const publicFingerprint = await fingerprintFromBuffer(publicExport.raw);

  return {
    algorithm: "RSA-OAEP / SHA-256",
    modulusLength,
    publicPem: publicExport.pem,
    privatePem: privateExport.pem,
    publicFingerprint,
    publicBytes: publicExport.bytes,
    privateBytes: privateExport.bytes,
  };
}

export default function RsaKeyGenerator() {
  const [keySize, setKeySize] = useState<KeySize>(2048);
  const [pair, setPair] = useState<GeneratedPair | null>(null);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateKeys = async (nextSize = keySize) => {
    try {
      if (!window.crypto?.subtle) {
        throw new Error("Web Crypto is not available in this browser.");
      }
      setIsGenerating(true);
      setError("");
      const generated = await generatePair(nextSize);
      setPair(generated);
    } catch (generationError: unknown) {
      setPair(null);
      setError(generationError instanceof Error ? generationError.message : "RSA key generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    void generateKeys(2048);
  }, []);

  const keyStats = useMemo(
    () => ({
      publicLines: pair?.publicPem.split("\n").length ?? 0,
      privateLines: pair?.privatePem.split("\n").length ?? 0,
      fingerprintShort: pair ? `${pair.publicFingerprint.slice(0, 23)}...` : "--",
    }),
    [pair],
  );

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  };

  const downloadValue = (filename: string, value: string) => {
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  };

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setKeySize(2048);
            void generateKeys(2048);
          }}
          className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted"
        >
          Fast Preset
        </button>
        <button
          onClick={() => {
            setKeySize(4096);
            void generateKeys(4096);
          }}
          className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted"
        >
          High Security Preset
        </button>
        <button
          onClick={() => {
            setPair(null);
            setError("");
          }}
          className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted"
        >
          Clear Output
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">RSA Controls</p>
                <p className="text-sm text-muted-foreground">Generate a fresh browser-side RSA key pair and export PEM files for testing or lab workflows.</p>
              </div>
              <FileKey2 className="h-5 w-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Algorithm</label>
                <input readOnly value="RSA-OAEP with SHA-256" className="tool-calc-input w-full bg-muted/40 text-sm" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Key Size</label>
                <select
                  value={keySize}
                  onChange={(event) => setKeySize(Number(event.target.value) as KeySize)}
                  className="tool-calc-input w-full"
                >
                  {KEY_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size} bit
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => void generateKeys()}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                <RefreshCcw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                {isGenerating ? "Generating Keys..." : "Generate Key Pair"}
              </button>
              <button
                onClick={() => pair && downloadValue(`rsa-${pair.modulusLength}-public.pem`, pair.publicPem)}
                disabled={!pair}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:border-blue-500/40 hover:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground"
              >
                <Download className="h-4 w-4" />
                Download Public Key
              </button>
              <button
                onClick={() => pair && downloadValue(`rsa-${pair.modulusLength}-private.pem`, pair.privatePem)}
                disabled={!pair}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:border-blue-500/40 hover:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground"
              >
                <Download className="h-4 w-4" />
                Download Private Key
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Modulus</p>
                <p className="mt-2 text-2xl font-black text-foreground">{pair?.modulusLength ?? keySize}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Public Bytes</p>
                <p className="mt-2 text-2xl font-black text-foreground">{pair?.publicBytes ?? "--"}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Private Bytes</p>
                <p className="mt-2 text-2xl font-black text-foreground">{pair?.privateBytes ?? "--"}</p>
              </div>
              <div className={`rounded-xl border p-4 ${error ? "border-rose-500/20 bg-rose-500/5" : "border-emerald-500/20 bg-emerald-500/5"}`}>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Status</p>
                <p className={`mt-2 text-lg font-black ${error ? "text-rose-600" : "text-emerald-600"}`}>{isGenerating ? "Working" : error ? "Error" : "Ready"}</p>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl border p-4 ${error ? "border-rose-500/20 bg-rose-500/5" : "border-emerald-500/20 bg-emerald-500/5"}`}>
            <div className="flex items-start gap-3">
              {error ? <ShieldAlert className="mt-0.5 h-5 w-5 text-rose-600" /> : <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />}
              <div>
                <p className="mb-1 font-bold text-foreground">{error ? "Key generation failed" : pair ? "Fresh key pair generated locally" : "Ready to generate"}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {error || (pair ? "The PEM blocks below were generated in this browser session. Keep the private key secret and only share the public key." : "Choose a modulus length, then generate a new RSA pair for testing, demos, or staging workflows.")}
                </p>
              </div>
            </div>
          </div>

          {[
            {
              label: "Public Key PEM",
              value: pair?.publicPem ?? "",
              copyLabel: "public-key",
              filename: pair ? `rsa-${pair.modulusLength}-public.pem` : "rsa-public.pem",
              icon: <KeyRound className="h-5 w-5 text-blue-500" />,
            },
            {
              label: "Private Key PEM",
              value: pair?.privatePem ?? "",
              copyLabel: "private-key",
              filename: pair ? `rsa-${pair.modulusLength}-private.pem` : "rsa-private.pem",
              icon: <LockKeyhole className="h-5 w-5 text-blue-500" />,
            },
          ].map((block) => (
            <div key={block.label} className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {block.icon}
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">{block.label}</p>
                    <p className="text-sm text-muted-foreground">{block.label === "Public Key PEM" ? "Share this key with systems or teammates that need to encrypt to you." : "Keep this key private. It decrypts data encrypted with the matching public key."}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => copyValue(block.copyLabel, block.value)}
                    disabled={!block.value}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copied === block.copyLabel ? "Copied" : "Copy"}
                  </button>
                  <button
                    onClick={() => downloadValue(block.filename, block.value)}
                    disabled={!block.value}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                </div>
              </div>
              <textarea
                readOnly
                value={block.value}
                spellCheck={false}
                className="min-h-[220px] w-full resize-y rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none"
              />
            </div>
          ))}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Algorithm Notes</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Public vs Private Key</p>
                <p className="mt-1">The public key can be shared safely. The private key must stay secret because it is the key that decrypts protected data.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">PEM Export Format</p>
                <p className="mt-1">Public keys are exported as SPKI PEM and private keys are exported as PKCS#8 PEM so they can move into common developer tooling.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">RSA-OAEP Use Case</p>
                <p className="mt-1">This generator targets encryption-style RSA workflows. For signing flows like JWT RS256, the key pair still helps for labs, but the algorithm usage differs.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Output and Safety Notes</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="font-bold text-foreground">Fingerprint</p>
                <p className="mt-1 break-all">{pair?.publicFingerprint ?? "--"}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Short Fingerprint View</p>
                <p className="mt-1">{keyStats.fingerprintShort}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">PEM Length</p>
                <p className="mt-1">Public key lines: {keyStats.publicLines || "--"} | Private key lines: {keyStats.privateLines || "--"}</p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="font-bold text-foreground">Do Not Commit Private Keys</p>
                <p className="mt-1">This page is suitable for demos, development, and staging. Production key management should use a controlled secret store or hardware-backed workflow.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            {[
              {
                label: "OpenSSL-style summary",
                value: pair
                  ? `Algorithm: ${pair.algorithm}\nModulus: ${pair.modulusLength} bits\nPublic fingerprint (SHA-256): ${pair.publicFingerprint}\nPublic bytes: ${pair.publicBytes}\nPrivate bytes: ${pair.privateBytes}`
                  : "",
              },
              {
                label: "Public PEM only",
                value: pair?.publicPem ?? "",
              },
            ].map((item) => (
              <div key={item.label} className="mb-3 rounded-xl border border-border bg-muted/40 p-3 last:mb-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                  <button
                    onClick={() => copyValue(item.label, item.value)}
                    disabled={!item.value}
                    className="text-xs font-bold text-blue-600 disabled:text-muted-foreground"
                  >
                    {copied === item.label ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                  <code>{item.value || "Generate a key pair to populate this summary."}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="RSA Key Pair Generator"
      seoTitle="RSA Key Pair Generator - Browser-Side PEM Export Tool"
      seoDescription="Free RSA key generator with browser-side Web Crypto key creation, PEM export, SHA-256 fingerprinting, and public or private key download."
      canonical="https://usonlinetools.com/security/rsa-key-generator"
      categoryName="Security & Encryption"
      categoryHref="/category/security"
      heroDescription="Generate RSA public and private keys directly in the browser, export them as PEM files, and inspect fingerprint details before using them in development or staging workflows."
      heroIcon={<FileKey2 className="h-3.5 w-3.5" />}
      calculatorLabel="RSA Workspace"
      calculatorDescription="Choose a modulus length, generate a new RSA pair locally, then copy or download PEM output."
      calculator={calculator}
      howSteps={[
        { title: "Choose the key size you want to generate", description: "Pick 2048-bit for quick testing, or larger sizes like 3072-bit and 4096-bit when you want stronger keys and do not mind slower generation." },
        { title: "Generate the key pair in your browser", description: "The page uses Web Crypto to create a fresh RSA-OAEP key pair locally, then exports both keys into copy-ready PEM blocks." },
        { title: "Copy or download the PEM files you need", description: "Use the public key for encryption-style sharing and keep the private key in a secure place that is not committed to source control." },
        { title: "Verify the fingerprint before distribution", description: "The SHA-256 fingerprint helps you confirm that teammates or systems are using the exact same public key you generated." },
      ]}
      interpretationCards={[
        { title: "Longer keys are stronger but slower", description: "2048-bit keys are still common for application compatibility, while 3072-bit and 4096-bit keys cost more time and produce larger PEM output.", className: "bg-blue-500/5 border-blue-500/20" },
        { title: "The public key is safe to share", description: "Its job is to let other systems encrypt to you. The private key is the secret half and should not be exposed.", className: "bg-emerald-500/5 border-emerald-500/20" },
        { title: "PEM is just a transport wrapper", description: "The PEM blocks package Base64-encoded key material into a format commonly accepted by app servers, CLIs, and libraries.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Use controlled key management for production", description: "Browser generation is useful for labs, demos, and internal staging, but production secrets should live in a managed key store or hardware-backed system.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "JWT lab setup", input: "Generate 2048-bit PEM pair", output: "Use the keys in local RS256 experiments and auth demos" },
        { scenario: "Internal encryption testing", input: "Share only the public key", output: "Let a teammate encrypt test payloads while you keep the private key" },
        { scenario: "Staging environment bootstrap", input: "Download 3072-bit public/private PEM files", output: "Load them into a temporary non-production config" },
        { scenario: "Key verification", input: "Compare SHA-256 public fingerprint", output: "Confirm the deployed public key matches the one you generated" },
      ]}
      whyChoosePoints={[
        "This page generates actual RSA keys in the browser with Web Crypto instead of showing static placeholder text.",
        "Public and private keys are exported in familiar PEM formats that fit common development workflows.",
        "Fingerprint output gives you a quick way to verify the public key across machines or teammates.",
        "Copy and download actions are built into the main widget so the page is immediately usable after generation.",
        "The page follows the same long-form structure as the site’s flagship calculator pages while still prioritizing a working security tool above the fold.",
      ]}
      faqs={[
        { q: "What algorithm does this generator use?", a: "It generates extractable RSA-OAEP keys with SHA-256 using the browser Web Crypto API." },
        { q: "Can I share the public key?", a: "Yes. The public key is intended to be shared with systems or people that need to encrypt data for you." },
        { q: "Can I share the private key?", a: "No. The private key should stay secret because it can decrypt data encrypted with the matching public key." },
        { q: "What PEM formats are exported?", a: "The public key is exported as SPKI PEM and the private key is exported as PKCS#8 PEM." },
        { q: "Which key size should I choose?", a: "2048-bit is usually the fastest option for testing. 3072-bit and 4096-bit provide larger keys at the cost of slower generation and bigger files." },
        { q: "Does this page upload my keys anywhere?", a: "No. Generation and export happen in the browser session through Web Crypto." },
        { q: "Is this intended for production key management?", a: "Not by itself. Use it for demos, development, or staging. Production keys should be managed in a proper secret or key management system." },
        { q: "Can I use these keys for signing too?", a: "They are generated for RSA-OAEP encryption workflows. Some labs may still reuse PEM material conceptually, but real signing flows normally use an RSA signing algorithm such as RSASSA-PKCS1-v1_5 or RSA-PSS." },
      ]}
      relatedTools={[
        { title: "AES Encrypt & Decrypt", slug: "aes-encrypt-decrypt", icon: <Shield className="h-4 w-4" />, color: 210, benefit: "Protect reversible text payloads with symmetric encryption" },
        { title: "Bcrypt Hash Generator", slug: "bcrypt-hash-generator", icon: <LockKeyhole className="h-4 w-4" />, color: 145, benefit: "Use one-way hashing for passwords instead of key pairs" },
        { title: "HMAC Generator", slug: "hmac-generator", icon: <KeyRound className="h-4 w-4" />, color: 40, benefit: "Generate message authentication codes for integrity checks" },
        { title: "Hex to Text Converter", slug: "hex-to-text", icon: <Copy className="h-4 w-4" />, color: 260, benefit: "Inspect encoded payload fragments around key workflows" },
        { title: "Random String Generator", slug: "random-string-generator", icon: <RefreshCcw className="h-4 w-4" />, color: 315, benefit: "Create test secrets and identifiers alongside generated keys" },
        { title: "JWT Decoder", slug: "jwt-decoder", icon: <ShieldAlert className="h-4 w-4" />, color: 15, benefit: "Inspect tokens while working through auth and crypto demos" },
      ]}
      ctaTitle="Need Another Security Utility?"
      ctaDescription="Move through the security category and keep replacing placeholder routes with real browser-side tools."
      ctaHref="/category/security"
    />
  );
}
