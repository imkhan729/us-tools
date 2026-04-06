import { useEffect, useMemo, useState } from "react";
import bcrypt from "bcryptjs";
import { CheckCircle2, Copy, Fingerprint, KeyRound, Lock, ShieldAlert, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

function hashPassword(password: string, rounds: number) {
  return new Promise<string>((resolve, reject) => {
    bcrypt.hash(password, rounds, (error: Error | null, hash?: string) => {
      if (error || !hash) {
        reject(error ?? new Error("Hashing failed"));
        return;
      }
      resolve(hash);
    });
  });
}

function comparePassword(password: string, hash: string) {
  return new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(password, hash, (error: Error | null, same?: boolean) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(Boolean(same));
    });
  });
}

export default function BcryptHashGenerator() {
  const [password, setPassword] = useState("AdminPanel!2026");
  const [rounds, setRounds] = useState(12);
  const [hashValue, setHashValue] = useState("");
  const [hashError, setHashError] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [copied, setCopied] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("AdminPanel!2026");
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyState, setVerifyState] = useState<"idle" | "match" | "mismatch" | "error">("idle");
  const [verifyError, setVerifyError] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (!password) {
      setHashValue("");
      setHashError("");
      setIsWorking(false);
      return;
    }

    setIsWorking(true);
    setHashError("");

    hashPassword(password, rounds)
      .then((nextHash) => {
        if (!cancelled) setHashValue(nextHash);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setHashValue("");
          setHashError(error instanceof Error ? error.message : "Unable to generate bcrypt hash.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsWorking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [password, rounds]);

  useEffect(() => {
    let cancelled = false;
    const nextHash = verifyHash.trim();

    if (!verifyPassword || !nextHash) {
      setVerifyState("idle");
      setVerifyError("");
      return;
    }

    comparePassword(verifyPassword, nextHash)
      .then((same) => {
        if (!cancelled) setVerifyState(same ? "match" : "mismatch");
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setVerifyState("error");
          setVerifyError(error instanceof Error ? error.message : "Invalid bcrypt hash.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [verifyHash, verifyPassword]);

  const passwordBytes = useMemo(() => new TextEncoder().encode(password).length, [password]);
  const derivedRounds = useMemo(() => {
    try {
      return hashValue ? bcrypt.getRounds(hashValue) : null;
    } catch {
      return null;
    }
  }, [hashValue]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  };

  const presets = (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => { setPassword("AdminPanel!2026"); setRounds(12); setVerifyPassword("AdminPanel!2026"); setVerifyHash(""); }} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
        Admin Preset
      </button>
      <button onClick={() => { setPassword("SupportPortal#Temp42"); setRounds(10); setVerifyPassword("SupportPortal#Temp42"); setVerifyHash(""); }} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
        Support Preset
      </button>
      <button onClick={() => { setPassword(""); setHashValue(""); setVerifyPassword(""); setVerifyHash(""); setVerifyState("idle"); setHashError(""); setVerifyError(""); }} className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted">
        Clear
      </button>
    </div>
  );

  const calculator = (
    <div className="space-y-6">
      {presets}

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Hash Controls</p>
                <p className="text-sm text-muted-foreground">Generate salted bcrypt hashes for passwords and test credentials.</p>
              </div>
              <Fingerprint className="w-5 h-5 text-blue-500" />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Plaintext Password</label>
              <input value={password} onChange={(event) => setPassword(event.target.value)} spellCheck={false} className="tool-calc-input w-full font-mono" placeholder="Enter password to hash" />
              <p className="mt-2 text-xs text-muted-foreground">Bcrypt is one-way. Store the hash, not the original password.</p>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Cost Factor</label>
                <span className="text-xs font-bold text-blue-600">Rounds {rounds}</span>
              </div>
              <input type="range" min="4" max="14" value={rounds} onChange={(event) => setRounds(Number(event.target.value))} className="w-full accent-blue-500" />
              <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>Lower for dev speed</span>
                <span>{`2^${rounds} = ${Math.pow(2, rounds).toLocaleString("en-US")}`}</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Password Bytes</p>
                <p className="mt-2 text-2xl font-black text-foreground">{passwordBytes}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Rounds</p>
                <p className="mt-2 text-2xl font-black text-foreground">{rounds}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Derived</p>
                <p className="mt-2 text-2xl font-black text-emerald-600">{derivedRounds ?? "--"}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Status</p>
                <p className="mt-2 text-lg font-black text-foreground">{isWorking ? "Hashing" : hashError ? "Error" : "Ready"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Generated Hash</p>
                <p className="text-sm text-muted-foreground">The same password hashes differently each time because bcrypt embeds a fresh salt.</p>
              </div>
              <KeyRound className="w-5 h-5 text-blue-500" />
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Bcrypt Output</p>
                <button onClick={() => copyValue("hash", hashValue)} disabled={!hashValue} className="text-xs font-bold text-blue-600 disabled:text-muted-foreground">
                  {copied === "hash" ? "Copied" : "Copy"}
                </button>
              </div>
              <textarea readOnly value={hashError || hashValue} spellCheck={false} className="mt-3 min-h-[120px] w-full resize-y rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none" />
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-card p-4">
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Verify Password Against Existing Hash</p>
              <div className="space-y-3">
                <input value={verifyPassword} onChange={(event) => setVerifyPassword(event.target.value)} spellCheck={false} className="tool-calc-input w-full font-mono" placeholder="Enter plaintext to verify" />
                <textarea value={verifyHash} onChange={(event) => setVerifyHash(event.target.value)} spellCheck={false} className="tool-calc-input min-h-[110px] w-full resize-y font-mono text-sm" placeholder="Paste an existing bcrypt hash" />
              </div>
              <div className={`mt-3 rounded-xl border p-4 ${verifyState === "match" ? "border-emerald-500/20 bg-emerald-500/5" : verifyState === "mismatch" ? "border-rose-500/20 bg-rose-500/5" : verifyState === "error" ? "border-amber-500/20 bg-amber-500/5" : "border-border bg-muted/30"}`}>
                <div className="flex items-start gap-3">
                  {verifyState === "match" ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" /> : verifyState === "mismatch" ? <ShieldAlert className="mt-0.5 h-5 w-5 text-rose-600" /> : <Lock className="mt-0.5 h-5 w-5 text-blue-600" />}
                  <div>
                    <p className="mb-1 font-bold text-foreground">
                      {verifyState === "match" ? "Password matches the supplied hash" : verifyState === "mismatch" ? "Password does not match this hash" : verifyState === "error" ? "The supplied value is not a valid bcrypt hash" : "Paste a hash to test verification"}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {verifyState === "match" ? "This is the standard login flow: compare the entered plaintext with the stored bcrypt string." : verifyState === "mismatch" ? "Mismatches usually mean the wrong plaintext or an incomplete copied hash." : verifyState === "error" ? (verifyError || "Bcrypt hashes typically begin with $2a$, $2b$, or $2y$.") : "Use this panel for seeded credentials, auth QA, and demo app setup."}
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
                <p className="font-bold text-foreground">Salted Every Time</p>
                <p className="mt-1">Two bcrypt hashes can differ completely and still both verify the same password.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Adaptive Cost</p>
                <p className="mt-1">Raising the rounds value increases brute-force resistance but also increases login latency.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">For Password Storage</p>
                <p className="mt-1">Bcrypt is for one-way verification, not for encrypting data that must be recovered later.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Snippets</p>
            {[
              { label: "Hash summary", value: `Rounds: ${rounds}\nPassword bytes: ${passwordBytes}\nHash: ${hashValue}` },
              { label: "Env example", value: `BCRYPT_ROUNDS=${rounds}\nSEEDED_HASH=${hashValue}` },
            ].map((item) => (
              <div key={item.label} className="mb-3 rounded-xl border border-border bg-muted/40 p-3 last:mb-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                  <button onClick={() => copyValue(item.label, item.value)} disabled={!hashValue} className="text-xs font-bold text-blue-600 disabled:text-muted-foreground">
                    {copied === item.label ? "Copied" : "Copy"}
                  </button>
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
  );

  return (
    <UtilityToolPageShell
      title="Online Bcrypt Hash Generator"
      seoTitle="Online Bcrypt Hash Generator - Create Password Hashes Online"
      seoDescription="Free bcrypt hash generator with adjustable cost factor, browser-side verification, and copy-ready output for seeded passwords and auth testing."
      canonical="https://usonlinetools.com/security/online-bcrypt-hash-generator"
      categoryName="Security & Encryption"
      categoryHref="/category/security"
      heroDescription="Generate real bcrypt password hashes locally in the browser, tune the cost factor, and verify plaintext against existing hashes without sending credentials to a server."
      heroIcon={<Fingerprint className="w-3.5 h-3.5" />}
      calculatorLabel="Bcrypt Workspace"
      calculatorDescription="Hash a plaintext password, change the cost factor, and verify against an existing bcrypt string."
      calculator={calculator}
      howSteps={[
        { title: "Enter the plaintext you want to hash", description: "Use the exact password or seed value your app will verify later." },
        { title: "Choose the bcrypt cost factor", description: "Higher rounds increase security but also increase hash and login time." },
        { title: "Copy the generated hash", description: "Store the bcrypt output in your app or test fixtures instead of storing the original password." },
        { title: "Verify against existing hashes", description: "Paste a stored bcrypt string into the verification panel to simulate a login check." },
      ]}
      interpretationCards={[
        { title: "Different hashes for the same password are expected", description: "Bcrypt adds a fresh salt to every hash, so repeated outputs differ while still verifying correctly." },
        { title: "Cost factor is a tradeoff", description: "Higher rounds slow down attackers, but they also slow down your own authentication flow.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Bcrypt is one-way", description: "Use bcrypt when you need verification only. It is not reversible encryption.", className: "bg-emerald-500/5 border-emerald-500/20" },
        { title: "Verification failures usually mean wrong plaintext or broken copy/paste", description: "Truncated hashes and whitespace issues are common sources of mismatch.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Seeded admin account", input: "AdminPanel!2026 at 12 rounds", output: "Create a realistic starter login for a staging app" },
        { scenario: "Auth QA", input: "Known plaintext + stored bcrypt hash", output: "Check whether the saved credential still verifies" },
        { scenario: "Local tutorial app", input: "SupportPortal#Temp42 at 10 rounds", output: "Generate a sample users-table password hash" },
        { scenario: "Security demo", input: "Hash the same password twice", output: "Show why salted bcrypt strings differ between runs" },
      ]}
      whyChoosePoints={[
        "This page uses real bcrypt hashing instead of placeholder text or a generic SHA workaround.",
        "The verification panel makes the tool useful for auth testing instead of limiting it to one-way generation.",
        "Rounds are adjustable in one place, which helps when matching development and production policies.",
        "Everything runs inside the browser session, which is useful for unpublished credentials and internal demos.",
        "The page follows the long-form site structure with working UI above the fold plus guidance, FAQs, and related tools.",
      ]}
      faqs={[
        { q: "What is bcrypt used for?", a: "Bcrypt is primarily used for password storage. It turns plaintext passwords into salted one-way hashes that applications can verify later." },
        { q: "Can I decrypt a bcrypt hash?", a: "No. Bcrypt is intentionally one-way. Verification happens by comparing plaintext against the stored hash." },
        { q: "Why does the hash change every time?", a: "Because bcrypt generates a new salt on every run. That is expected and improves security." },
        { q: "What rounds value should I use?", a: "Use the value your application expects. Lower values are common for local demos, while production typically uses a higher cost factor after benchmarking." },
        { q: "Is bcrypt better than SHA-256 for passwords?", a: "Yes. Fast general-purpose hashes are not ideal for password storage. Bcrypt is deliberately slow and salted." },
        { q: "Does this tool send my password anywhere?", a: "No. Hashing and verification run in the browser." },
        { q: "Why does verification fail when the hash looks right?", a: "Common causes are the wrong plaintext, a truncated hash, or extra whitespace from copy/paste." },
        { q: "Should I use bcrypt for encrypted notes or API keys I need to recover?", a: "No. Use encryption when you need reversibility. Use bcrypt when you need one-way verification only." },
      ]}
      relatedTools={[
        { title: "HMAC Generator", slug: "hmac-generator", icon: <KeyRound className="w-4 h-4" />, color: 210, benefit: "Generate keyed signatures for request verification" },
        { title: "Password Strength Checker", slug: "password-strength-checker", icon: <ShieldAlert className="w-4 h-4" />, color: 350, benefit: "Check password quality before hashing it" },
        { title: "Random String Generator", slug: "random-string-generator", icon: <Wand2 className="w-4 h-4" />, color: 145, benefit: "Create temporary test credentials and seed values" },
        { title: "Hash Generator", slug: "hash-generator", icon: <Fingerprint className="w-4 h-4" />, color: 30, benefit: "Compare bcrypt with fast one-way digests" },
        { title: "JWT Decoder", slug: "jwt-decoder", icon: <Copy className="w-4 h-4" />, color: 275, benefit: "Inspect auth payloads alongside password testing" },
        { title: "Regex Tester", slug: "regex-tester", icon: <Lock className="w-4 h-4" />, color: 90, benefit: "Validate password policy patterns before hashing" },
      ]}
      ctaTitle="Need Another Security Utility?"
      ctaDescription="Continue through the security category and keep replacing undeveloped routes with real browser-side tools."
      ctaHref="/category/security"
    />
  );
}
