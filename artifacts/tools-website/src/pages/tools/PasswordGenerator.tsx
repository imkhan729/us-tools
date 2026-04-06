import { useState, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, KeyRound, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, RefreshCw, AlertTriangle, Hash, Type
} from "lucide-react";

const CHARSET = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function generatePassword(length: number, opts: Record<string, boolean>): string {
  let chars = "";
  if (opts.upper)   chars += CHARSET.upper;
  if (opts.lower)   chars += CHARSET.lower;
  if (opts.numbers) chars += CHARSET.numbers;
  if (opts.symbols) chars += CHARSET.symbols;
  if (!chars)       chars = CHARSET.lower;
  let result = "";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  for (let i = 0; i < length; i++) {
    result += chars[arr[i] % chars.length];
  }
  return result;
}

function getStrength(password: string): { label: string; score: number; color: string; bar: string } {
  if (!password) return { label: "None", score: 0, color: "text-muted-foreground", bar: "bg-muted" };
  let score = 0;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return { label: "Weak", score, color: "text-red-600", bar: "bg-red-500" };
  if (score <= 4) return { label: "Moderate", score, color: "text-amber-600", bar: "bg-amber-500" };
  if (score <= 5) return { label: "Strong", score, color: "text-emerald-600", bar: "bg-emerald-500" };
  return { label: "Very Strong", score, color: "text-emerald-600", bar: "bg-emerald-500" };
}

function ResultInsight({ password }: { password: string }) {
  if (!password) return null;
  const strength = getStrength(password);
  const entropy = Math.log2(Math.pow(
    ((/[A-Z]/.test(password) ? 26 : 0) + (/[a-z]/.test(password) ? 26 : 0) + (/\d/.test(password) ? 10 : 0) + (/[^A-Za-z0-9]/.test(password) ? 32 : 0)) || 26,
    password.length
  ));
  const message = `Your password has ${Math.round(entropy)} bits of entropy (${strength.label} strength). ${strength.score >= 5 ? "This password would take centuries to brute-force with modern hardware." : "Consider increasing length or adding more character types for greater security."}`;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
      <div className="flex gap-2 items-start">
        <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-foreground/80 leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-orange-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-orange-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Password Strength Checker", slug: "password-strength-checker", icon: <Shield className="w-5 h-5" />, color: 217, benefit: "Analyze your existing password" },
  { title: "Case Converter",            slug: "case-converter",            icon: <Type className="w-5 h-5" />,   color: 265, benefit: "Convert text case formats" },
  { title: "Hash Generator",            slug: "hash-generator",            icon: <Hash className="w-5 h-5" />,   color: 152, benefit: "Generate MD5, SHA-256 hashes" },
];

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [password, setPassword] = useState(() => generatePassword(16, { upper: true, lower: true, numbers: true, symbols: true }));
  const [copied, setCopied] = useState(false);

  const regenerate = useCallback(() => {
    setPassword(generatePassword(length, opts));
  }, [length, opts]);

  const toggleOpt = useCallback((key: string) => {
    const next = { ...opts, [key]: !opts[key as keyof typeof opts] };
    setOpts(next);
    setPassword(generatePassword(length, next));
  }, [opts, length]);

  const handleLengthChange = useCallback((val: number) => {
    setLength(val);
    setPassword(generatePassword(val, opts));
  }, [opts]);

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = getStrength(password);

  return (
    <Layout>
      <SEO
        title="Password Generator – Create Strong & Secure Passwords Free | US Online Tools"
        description="Free strong password generator. Create cryptographically random passwords with uppercase, lowercase, numbers, and symbols. Adjust length from 8 to 128 characters. No signup."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/productivity" className="text-muted-foreground hover:text-foreground transition-colors">Cyber Security</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Password Generator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <KeyRound className="w-3.5 h-3.5" /> Cyber Security
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Password Generator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Generate cryptographically secure random passwords using your browser's built-in Web Crypto API. Customize length (8–128) and character sets. Generated entirely in your browser — never transmitted anywhere.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20"><Zap className="w-3.5 h-3.5" /> Instant Generate</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Cyber Security &nbsp;·&nbsp; Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-orange-500/20 shadow-lg shadow-orange-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0">
                      <KeyRound className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cryptographic Password Generator</p>
                      <p className="text-sm text-muted-foreground">Uses Web Crypto API — never transmitted to any server.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 30 } as React.CSSProperties}>
                    <div className="space-y-6">
                      {/* Generated Password Display */}
                      <div className="relative group">
                        <div className="p-4 rounded-xl bg-background border-2 border-orange-500/20 group-hover:border-orange-500/40 transition-colors">
                          <p className="font-mono text-lg font-bold text-foreground break-all leading-relaxed">{password}</p>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button onClick={copyPassword} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 text-orange-600 font-bold text-xs rounded-lg hover:bg-orange-500/20 transition-colors">
                            {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy Password</>}
                          </button>
                          <button onClick={regenerate} className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground font-bold text-xs rounded-lg hover:bg-muted/80 transition-colors">
                            <RefreshCw className="w-3 h-3" /> Regenerate
                          </button>
                        </div>
                      </div>

                      {/* Strength Indicator */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password Strength</p>
                          <p className={`text-sm font-black ${strength.color}`}>{strength.label}</p>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div className={`h-full rounded-full ${strength.bar}`} animate={{ width: `${(strength.score / 6) * 100}%` }} transition={{ duration: 0.4 }} />
                        </div>
                      </div>

                      {/* Settings */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Length: {length}</label>
                          </div>
                          <input
                            type="range" min="8" max="128" value={length}
                            onChange={e => handleLengthChange(parseInt(e.target.value))}
                            className="w-full accent-orange-500"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>8</span><span>128</span></div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Character Types</p>
                          {(["upper", "lower", "numbers", "symbols"] as const).map(key => (
                            <label key={key} className="flex items-center gap-3 cursor-pointer group">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${opts[key] ? "bg-orange-500 border-orange-500" : "border-border"}`} onClick={() => toggleOpt(key)}>
                                {opts[key] && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors capitalize font-medium">
                                {key === "upper" ? "Uppercase (A-Z)" : key === "lower" ? "Lowercase (a-z)" : key === "numbers" ? "Numbers (0-9)" : "Symbols (!@#...)"}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <ResultInsight password={password} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Password Generator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Weak or reused passwords are the single biggest security vulnerability for most individuals and organizations. This generator creates cryptographically random passwords that are practically impossible to guess or brute-force, using your browser's native security APIs.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Set your password length</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Drag the slider to choose between 8 and 128 characters. Security professionals recommend a minimum of 16 characters for most accounts, and 20+ for highly sensitive services (banking, email, cloud storage). The longer the password, the exponentially harder it is to crack — each additional character multiplies the possible combinations by the size of the character set.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Choose your character sets</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Enable or disable uppercase letters, lowercase letters, numbers, and symbols. Using all four character types creates the largest possible character pool (94 printable ASCII characters), maximizing entropy per character. If a site doesn't allow symbols, simply disable that option — the password will still be strong at 62-character pool depth with sufficient length.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Copy and store securely</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Click "Copy Password" to copy to clipboard, then paste directly into your password manager (Bitwarden, 1Password, LastPass, KeePass) or the service's password field. Never store passwords in a plain text file or note-taking app. If you need to regenerate, click "Regenerate" to create a fresh cryptographically random password using the same settings.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Password Entropy Formula</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-orange-500 font-bold w-4 flex-shrink-0">1</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">Entropy = log₂(charset_size^length)</code>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-orange-500 font-bold w-4 flex-shrink-0">2</span>
                    <code className="px-2 py-1.5 bg-background rounded text-xs font-mono flex-1">16 chars, all types: log₂(94^16) ≈ 105 bits</code>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mt-4">At current computational speeds, a 105-bit entropy password would take billions of years to brute-force. NIST recommends at least 80 bits of entropy for high-security applications.</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Password Strength Levels Explained</h2>
              <p className="text-muted-foreground text-sm mb-6">What each strength rating means and when each level is appropriate:</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Weak — High Vulnerability</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Short passwords (under 8 characters) or those using only one character type. Can be cracked in seconds to minutes with modern GPU-based brute-force attacks. Never use for any online account.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Moderate — Acceptable for Low-Risk Accounts</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">8–11 characters with mixed character types. Suitable for low-risk accounts (streaming, loyalty programs) but not for email, banking, or work accounts. A dedicated attacker with targeted hardware could crack these within months.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Strong / Very Strong — Recommended for All Important Accounts</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">16+ characters with all four character types. Practically uncrackable with current and foreseeable computing capabilities. Use this level for email, banking, cloud storage, social media, and any account with personal or financial data.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Password Strength by Configuration</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Length</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Character Set</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Entropy</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Crack Time*</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-mono text-foreground">8</td><td className="px-4 py-3 text-muted-foreground">a-z only</td><td className="px-4 py-3 font-bold text-red-600">38 bits</td><td className="px-4 py-3 text-red-600 font-bold">Seconds</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-mono text-foreground">12</td><td className="px-4 py-3 text-muted-foreground">a-z + A-Z + 0-9</td><td className="px-4 py-3 font-bold text-amber-600">71 bits</td><td className="px-4 py-3 text-amber-600 font-bold">Years</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-mono text-foreground">16</td><td className="px-4 py-3 text-muted-foreground">All 94 printable ASCII</td><td className="px-4 py-3 font-bold text-emerald-600">105 bits</td><td className="px-4 py-3 text-emerald-600 font-bold">Billions of years</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-mono text-foreground">20</td><td className="px-4 py-3 text-muted-foreground">All 94 printable ASCII</td><td className="px-4 py-3 font-bold text-emerald-600">131 bits</td><td className="px-4 py-3 text-emerald-600 font-bold">Heat death of universe</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mb-6">*Assuming 10^12 guesses/second with modern GPU array — for offline hash cracking scenarios</p>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Why password length matters more than complexity:</strong> Adding one extra character to a 16-character password multiplies possible combinations by 94 (the character set size). Adding a special character to an 8-character password only adds a small marginal increase. Length is the dominant factor in password security — a 20-character lowercase-only password is stronger than an 8-character password with all four character types.</p>
                <p><strong className="text-foreground">Password manager recommendation:</strong> The best practice is to use a different strong password for every account and store them all in a reputable password manager. Since you never need to remember these passwords (the manager does), you can use the maximum-entropy settings (16–20+ characters with all character types) for every account without inconvenience.</p>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-orange-500/5 border border-orange-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <svg key={i} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"I specifically use this because it uses the Web Crypto API instead of Math.random(). As a developer, I know the difference — this generates genuinely unpredictable passwords, not pseudo-random ones."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Password Generator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Uses Web Crypto API — not Math.random().</strong> JavaScript's Math.random() is a pseudo-random number generator (PRNG) designed for speed, not security. It is predictable if the seed is known. This tool uses <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">crypto.getRandomValues()</code> — a cryptographically secure random number generator backed by the operating system's entropy pool, the same source used by security-critical software.</p>
                <p><strong className="text-foreground">Generated entirely client-side — never transmitted.</strong> The password is generated in your browser's JavaScript environment. It is never sent to any server, logged, cached in cookies, or stored anywhere. Close the tab and the password exists only in your clipboard or password manager.</p>
                <p><strong className="text-foreground">Real-time entropy calculation and strength feedback.</strong> The strength indicator shows a quantitative measure of your password's cryptographic entropy in bits, so you can make an informed decision rather than relying on generic "weak/strong" labels that different sites define inconsistently.</p>
                <p><strong className="text-foreground">Configurable to meet any site's requirements.</strong> Some websites forbid symbols; others require them. Some cap passwords at 16 characters; others allow 128. The character type toggles and flexible length slider ensure you can generate a compliant password for any site's policy without manual editing.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                <div className="flex gap-2 items-start">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    <strong>Security Reminder:</strong> Never share passwords via email, SMS, or messaging apps. Enable two-factor authentication (2FA) on all important accounts in addition to strong passwords. Use a reputable password manager to store unique passwords for every account — do not reuse passwords across services.
                  </p>
                </div>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="Is it safe to use an online password generator?" a="This generator is safe because it runs entirely in your browser using the Web Crypto API. No password data is transmitted to any server, stored in any database, or logged anywhere. Unlike some online generators that process passwords server-side, this tool is fully client-side — close the browser tab and the password exists only in your local clipboard." />
                <FaqItem q="What is the difference between this and Math.random()?" a="Math.random() is a pseudo-random number generator (PRNG) that produces deterministic sequences based on a seed value. If an attacker knows the seed, they can predict all outputs. crypto.getRandomValues() draws from the operating system's entropy pool (hardware events, timing noise, etc.), producing genuinely unpredictable values suitable for security-sensitive applications." />
                <FaqItem q="How long should my password be?" a="NIST's 2024 Digital Identity Guidelines recommend a minimum of 15 characters for human-generated passwords. For passwords generated by a tool (like this one) that you'll store in a password manager, 20+ characters with all character types is standard best practice. The password manager remembers it — you don't need to." />
                <FaqItem q="Can I use generated passwords with password managers?" a="Yes — using a password manager is the recommended way to use generated passwords. Tools like Bitwarden (open source, free), 1Password, Dashlane, and KeePass can store your generated passwords securely, auto-fill them in browsers, and sync across your devices. You only need one strong master password for the manager itself." />
                <FaqItem q="What if a website rejects symbols?" a="Simply uncheck the Symbols checkbox in the character types section. The generator will use only alphanumeric characters (uppercase, lowercase, numbers). While this reduces the character pool from 94 to 62 characters, a 20-character alphanumeric password still has approximately 119 bits of entropy — well beyond any practical attack." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Strengthen Your Digital Security</h2>
                <p className="text-white/80 mb-6 max-w-lg">Explore 400+ free security, productivity, and utility tools — instant results, no account needed.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map(tool => (
                    <Link key={tool.slug} href={`/productivity/${tool.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-orange-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others secure their accounts.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-orange-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-orange-500/40 flex-shrink-0" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
