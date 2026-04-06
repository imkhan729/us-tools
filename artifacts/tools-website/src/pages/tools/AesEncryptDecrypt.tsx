import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Copy, KeyRound, Lock, Shield, ShieldAlert, Unlock } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type Mode = "encrypt" | "decrypt";
type SourceMode = "bundle" | "manual";

const DEFAULT_ITERATIONS = 210000;

const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
};

const toBase64 = (bytes: Uint8Array) => {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const fromBase64 = (value: string) => {
  const binary = atob(value.trim());
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

const randomBytes = (length: number) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
};

async function deriveKey(passphrase: string, salt: Uint8Array, iterations: number) {
  const encoder = new TextEncoder();
  const imported = await crypto.subtle.importKey("raw", toArrayBuffer(encoder.encode(passphrase)), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: toArrayBuffer(salt), iterations, hash: "SHA-256" },
    imported,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptText(plaintext: string, passphrase: string, iterations: number) {
  const encoder = new TextEncoder();
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = await deriveKey(passphrase, salt, iterations);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: toArrayBuffer(iv) },
    key,
    toArrayBuffer(encoder.encode(plaintext)),
  );
  const ciphertext = toBase64(new Uint8Array(encrypted));
  const bundle = JSON.stringify(
    { v: 1, cipher: "AES-GCM", kdf: "PBKDF2-SHA-256", keyLength: 256, iterations, salt: toBase64(salt), iv: toBase64(iv), ciphertext },
    null,
    2,
  );
  return { bundle, ciphertext, salt: toBase64(salt), iv: toBase64(iv), bytes: new Uint8Array(encrypted).length };
}

async function decryptText(passphrase: string, ciphertext: string, salt: string, iv: string, iterations: number) {
  const key = await deriveKey(passphrase, fromBase64(salt), iterations);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: toArrayBuffer(fromBase64(iv)) },
    key,
    toArrayBuffer(fromBase64(ciphertext)),
  );
  return new TextDecoder().decode(decrypted);
}

function parseBundle(value: string) {
  const parsed = JSON.parse(value);
  if (!parsed || typeof parsed !== "object" || typeof parsed.ciphertext !== "string" || typeof parsed.salt !== "string" || typeof parsed.iv !== "string") {
    throw new Error("Bundle must include ciphertext, salt, and iv.");
  }
  return {
    ciphertext: parsed.ciphertext,
    salt: parsed.salt,
    iv: parsed.iv,
    iterations: typeof parsed.iterations === "number" ? parsed.iterations : DEFAULT_ITERATIONS,
  };
}

export default function AesEncryptDecrypt() {
  const [mode, setMode] = useState<Mode>("encrypt");
  const [sourceMode, setSourceMode] = useState<SourceMode>("bundle");
  const [passphrase, setPassphrase] = useState("WorkspaceSecret!2026");
  const [iterations, setIterations] = useState(DEFAULT_ITERATIONS);
  const [plaintext, setPlaintext] = useState("Confidential deployment note:\nRotate preview credentials after launch day.");
  const [bundle, setBundle] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [salt, setSalt] = useState("");
  const [iv, setIv] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [encryptError, setEncryptError] = useState("");
  const [decryptError, setDecryptError] = useState("");
  const [copied, setCopied] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!plaintext || !passphrase) {
      setBundle("");
      setCiphertext("");
      setSalt("");
      setIv("");
      setEncryptError("");
      setIsWorking(false);
      return;
    }
    setIsWorking(true);
    encryptText(plaintext, passphrase, iterations)
      .then((result) => {
        if (!cancelled) {
          setBundle(result.bundle);
          setCiphertext(result.ciphertext);
          setSalt(result.salt);
          setIv(result.iv);
          setEncryptError("");
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) setEncryptError(error instanceof Error ? error.message : "Encryption failed.");
      })
      .finally(() => {
        if (!cancelled) setIsWorking(false);
      });
    return () => { cancelled = true; };
  }, [iterations, passphrase, plaintext]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        if (!passphrase) {
          setDecrypted("");
          setDecryptError("");
          return;
        }
        const source = sourceMode === "bundle" ? parseBundle(bundle) : { ciphertext: ciphertext.trim(), salt: salt.trim(), iv: iv.trim(), iterations };
        if (!source.ciphertext || !source.salt || !source.iv) {
          setDecrypted("");
          setDecryptError("");
          return;
        }
        const value = await decryptText(passphrase, source.ciphertext, source.salt, source.iv, source.iterations);
        if (!cancelled) {
          setDecrypted(value);
          setDecryptError("");
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setDecrypted("");
          setDecryptError(error instanceof Error ? error.message : "Decryption failed.");
        }
      }
    };
    run();
    return () => { cancelled = true; };
  }, [bundle, ciphertext, iv, iterations, passphrase, salt, sourceMode]);

  const stats = useMemo(() => {
    const encoder = new TextEncoder();
    return { textBytes: encoder.encode(plaintext).length, passphraseBytes: encoder.encode(passphrase).length };
  }, [passphrase, plaintext]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  };

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => { setPassphrase("WorkspaceSecret!2026"); setIterations(DEFAULT_ITERATIONS); setPlaintext("Confidential deployment note:\nRotate preview credentials after launch day."); }} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">Note Preset</button>
        <button onClick={() => { setPassphrase("OpsBundle#Safe"); setIterations(260000); setPlaintext('{"env":"staging","token":"preview-only","expires":"2026-04-30"}'); }} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">JSON Preset</button>
        <button onClick={() => { setPlaintext(""); setBundle(""); setCiphertext(""); setSalt(""); setIv(""); setDecrypted(""); setEncryptError(""); setDecryptError(""); }} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">Clear</button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["encrypt", "decrypt"].map((value) => (
          <button key={value} onClick={() => setMode(value as Mode)} className={`rounded-full border px-4 py-2 text-xs font-bold ${mode === value ? "border-blue-500 bg-blue-500 text-white" : "border-border bg-card text-foreground hover:border-blue-500/40 hover:bg-muted"}`}>
            {value === "encrypt" ? "Encrypt" : "Decrypt"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">AES Controls</p>
                <p className="text-sm text-muted-foreground">Encrypt or decrypt locally with AES-GCM and a 256-bit derived key.</p>
              </div>
              {mode === "encrypt" ? <Lock className="w-5 h-5 text-blue-500" /> : <Unlock className="w-5 h-5 text-blue-500" />}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Passphrase</label>
                <input value={passphrase} onChange={(event) => setPassphrase(event.target.value)} spellCheck={false} className="tool-calc-input w-full font-mono" placeholder="Enter passphrase" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Key Derivation</label>
                <input readOnly value="PBKDF2-SHA-256 -> AES-GCM 256" className="tool-calc-input w-full bg-muted/40 text-sm" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Iterations</label>
                <input type="number" min="10000" step="10000" value={iterations} onChange={(event) => setIterations(Number(event.target.value) || DEFAULT_ITERATIONS)} className="tool-calc-input w-full" />
              </div>
            </div>

            {mode === "encrypt" ? (
              <div className="mt-4">
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Plaintext</label>
                <textarea value={plaintext} onChange={(event) => setPlaintext(event.target.value)} spellCheck={false} className="tool-calc-input min-h-[200px] w-full resize-y font-mono text-sm" placeholder="Enter text to encrypt" />
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {["bundle", "manual"].map((value) => (
                    <button key={value} onClick={() => setSourceMode(value as SourceMode)} className={`rounded-full border px-3 py-2 text-xs font-bold ${sourceMode === value ? "border-blue-500 bg-blue-500 text-white" : "border-border bg-card text-foreground hover:border-blue-500/40 hover:bg-muted"}`}>
                      {value === "bundle" ? "Bundle" : "Manual Fields"}
                    </button>
                  ))}
                </div>

                {sourceMode === "bundle" ? (
                  <textarea value={bundle} onChange={(event) => setBundle(event.target.value)} spellCheck={false} className="tool-calc-input min-h-[220px] w-full resize-y font-mono text-sm" placeholder='Paste JSON bundle with ciphertext, salt, iv, and iterations' />
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <textarea value={ciphertext} onChange={(event) => setCiphertext(event.target.value)} spellCheck={false} className="tool-calc-input min-h-[110px] w-full resize-y font-mono text-sm" placeholder="Ciphertext (Base64)" />
                    <input value={salt} onChange={(event) => setSalt(event.target.value)} spellCheck={false} className="tool-calc-input w-full font-mono" placeholder="Salt (Base64)" />
                    <input value={iv} onChange={(event) => setIv(event.target.value)} spellCheck={false} className="tool-calc-input w-full font-mono" placeholder="IV / nonce (Base64)" />
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Text Bytes</p><p className="mt-2 text-2xl font-black text-foreground">{stats.textBytes}</p></div>
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Passphrase Bytes</p><p className="mt-2 text-2xl font-black text-foreground">{stats.passphraseBytes}</p></div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Cipher Bytes</p><p className="mt-2 text-2xl font-black text-emerald-600">{ciphertext ? Math.round((ciphertext.length * 3) / 4) : "--"}</p></div>
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Status</p><p className="mt-2 text-lg font-black text-foreground">{isWorking ? "Working" : "Ready"}</p></div>
            </div>
          </div>

          {mode === "encrypt" ? (
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div><p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Encrypted Output</p><p className="text-sm text-muted-foreground">The bundle contains ciphertext, salt, IV, and iterations.</p></div>
                <KeyRound className="w-5 h-5 text-blue-500" />
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">JSON Bundle</p>
                  <button onClick={() => copyValue("bundle", bundle)} disabled={!bundle} className="text-xs font-bold text-blue-600 disabled:text-muted-foreground">{copied === "bundle" ? "Copied" : "Copy"}</button>
                </div>
                <textarea readOnly value={encryptError || bundle} spellCheck={false} className="mt-3 min-h-[150px] w-full resize-y rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none" />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div className={`rounded-2xl border p-4 ${decryptError ? "border-rose-500/20 bg-rose-500/5" : decrypted ? "border-emerald-500/20 bg-emerald-500/5" : "border-border bg-muted/30"}`}>
                <div className="flex items-start gap-3">
                  {decryptError ? <ShieldAlert className="mt-0.5 h-5 w-5 text-rose-600" /> : decrypted ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" /> : <Shield className="mt-0.5 h-5 w-5 text-blue-600" />}
                  <div>
                    <p className="mb-1 font-bold text-foreground">{decryptError ? "Decryption failed" : decrypted ? "Authenticated and decrypted successfully" : "Paste encrypted data to decrypt"}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{decryptError || (decrypted ? "The passphrase and parameters matched the original encryption settings." : "Use the bundle tab for the easiest workflow, or manual fields when you need explicit IV and salt control.")}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Recovered Plaintext</p>
                  <button onClick={() => copyValue("decrypted", decrypted)} disabled={!decrypted} className="text-xs font-bold text-blue-600 disabled:text-muted-foreground">{copied === "decrypted" ? "Copied" : "Copy"}</button>
                </div>
                <textarea readOnly value={decrypted} spellCheck={false} className="mt-3 min-h-[150px] w-full resize-y rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none" />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Reading</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4"><p className="font-bold text-foreground">AES-256 via Derived Key</p><p className="mt-1">The passphrase is stretched with PBKDF2-SHA-256, then used to derive a 256-bit AES-GCM key locally.</p></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4"><p className="font-bold text-foreground">IV and Salt Must Match</p><p className="mt-1">Decryption requires the same salt, IV, passphrase, and iteration count used during encryption.</p></div>
              <div className="rounded-xl border border-border bg-muted/40 p-4"><p className="font-bold text-foreground">AES-GCM Authenticates Too</p><p className="mt-1">Modified ciphertext or the wrong key causes failure instead of corrupted plaintext.</p></div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            {[{ label: "Encryption summary", value: `Cipher: AES-GCM\nKDF: PBKDF2-SHA-256\nIterations: ${iterations}\nSalt: ${salt}\nIV: ${iv}\nCiphertext: ${ciphertext}` }, { label: "Bundle example", value: bundle }].map((item) => (
              <div key={item.label} className="mb-3 rounded-xl border border-border bg-muted/40 p-3 last:mb-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                  <button onClick={() => copyValue(item.label, item.value)} disabled={!item.value} className="text-xs font-bold text-blue-600 disabled:text-muted-foreground">{copied === item.label ? "Copied" : "Copy"}</button>
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
      title="Online AES Encrypt & Decrypt"
      seoTitle="Online AES Encrypt & Decrypt - Browser-Side AES-256 Tool"
      seoDescription="Free AES encryption tool with browser-side AES-GCM encryption, PBKDF2 key derivation, bundle export, and manual IV or salt handling."
      canonical="https://usonlinetools.com/security/online-aes-encrypt-decrypt"
      categoryName="Security & Encryption"
      categoryHref="/category/security"
      heroDescription="Encrypt or decrypt text locally in the browser using AES-GCM with a 256-bit derived key. Export a self-contained JSON bundle or decrypt with manual salt and IV fields when needed."
      heroIcon={<Lock className="w-3.5 h-3.5" />}
      calculatorLabel="AES Workspace"
      calculatorDescription="Encrypt text into a bundle or decrypt an existing AES payload with bundle or manual field input."
      calculator={calculator}
      howSteps={[
        { title: "Enter the plaintext and passphrase", description: "Choose the text to protect and the passphrase both sides of the workflow will know." },
        { title: "Copy the full JSON bundle by default", description: "The bundle includes ciphertext, salt, IV, and iterations, which makes decryption safer and easier later." },
        { title: "Use manual fields only when your system stores parameters separately", description: "Some systems keep ciphertext, salt, and IV in different columns or headers. The manual mode supports that workflow." },
        { title: "Treat failures as parameter mismatches first", description: "Wrong passphrase, salt, IV, iteration count, or ciphertext will cause AES-GCM authentication to fail." },
      ]}
      interpretationCards={[
        { title: "AES is reversible encryption", description: "Use it for data you may need to recover later. If you lose the passphrase or bundle parameters, the ciphertext is not practically recoverable." },
        { title: "PBKDF2 stretches the passphrase", description: "The iteration count makes brute-force attempts more expensive than using the raw passphrase directly.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "AES-GCM protects integrity too", description: "Modified ciphertext and wrong keys are rejected instead of silently returning damaged plaintext.", className: "bg-emerald-500/5 border-emerald-500/20" },
        { title: "IV and salt are required decryption inputs", description: "They are not optional metadata. Moving the full bundle is safer than handling fields separately unless your system requires it.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Secure note sharing", input: "Plaintext note + passphrase", output: "Generate one JSON bundle to send through chat or docs" },
        { scenario: "Environment secret handoff", input: "Ciphertext stored with separate IV and salt", output: "Use manual fields to recover the original secret" },
        { scenario: "Internal JSON payload", input: '{"env":"staging","token":"preview-only"}', output: "Encrypt structured text for temporary secure transport" },
        { scenario: "Debugging decryption", input: "Same ciphertext with wrong IV or passphrase", output: "See AES-GCM fail cleanly instead of producing bad plaintext" },
      ]}
      whyChoosePoints={[
        "This page uses real browser-side AES-GCM via Web Crypto instead of placeholder obfuscation.",
        "The bundle workflow is practical because it packages ciphertext together with the required decryption parameters.",
        "Manual salt and IV handling is available when you need to match an existing system.",
        "Everything runs locally in the browser session, which is useful for internal notes and staging secrets.",
        "The page keeps the same long-form structure as the site’s flagship calculator pages while still prioritizing a working encryption UI above the fold.",
      ]}
      faqs={[
        { q: "Is this AES-256?", a: "Yes. The tool derives a 256-bit AES-GCM key from your passphrase using PBKDF2-SHA-256." },
        { q: "Why does decryption fail even when the passphrase seems correct?", a: "A mismatch in salt, IV, iteration count, or ciphertext will also cause failure." },
        { q: "What is the IV and why does it matter?", a: "The IV, or nonce, is a unique value used during encryption and required again during decryption." },
        { q: "What is the salt used for?", a: "The salt is used by PBKDF2 so the same passphrase produces different derived keys across sessions." },
        { q: "Should I store the salt and IV secretly?", a: "Not usually. They normally travel with the ciphertext. The passphrase is the secret." },
        { q: "Does this replace bcrypt for passwords?", a: "No. AES is reversible encryption, while bcrypt is one-way password hashing." },
        { q: "Does this tool send my plaintext anywhere?", a: "No. Encryption and decryption happen in the browser using Web Crypto." },
        { q: "When should I use the JSON bundle instead of manual fields?", a: "Use the bundle by default. Use manual fields only when your application stores or transports each parameter separately." },
      ]}
      relatedTools={[
        { title: "Bcrypt Hash Generator", slug: "bcrypt-hash-generator", icon: <KeyRound className="w-4 h-4" />, color: 210, benefit: "Store passwords with one-way hashing instead of reversible encryption" },
        { title: "HMAC Generator", slug: "hmac-generator", icon: <Shield className="w-4 h-4" />, color: 145, benefit: "Authenticate messages separately from encrypting them" },
        { title: "Random String Generator", slug: "random-string-generator", icon: <Lock className="w-4 h-4" />, color: 260, benefit: "Create stronger passphrases or test secrets" },
        { title: "Hash Generator", slug: "hash-generator", icon: <Copy className="w-4 h-4" />, color: 30, benefit: "Compare encryption with digest-only workflows" },
        { title: "JWT Decoder", slug: "jwt-decoder", icon: <Unlock className="w-4 h-4" />, color: 280, benefit: "Inspect token payloads alongside encrypted notes" },
        { title: "String Escape & Unescape", slug: "string-escape-unescape", icon: <ShieldAlert className="w-4 h-4" />, color: 90, benefit: "Prepare copy-safe text before transport" },
      ]}
      ctaTitle="Need Another Security Utility?"
      ctaDescription="Continue through the security category and keep replacing undeveloped routes with real browser-side tools."
      ctaHref="/category/security"
    />
  );
}
