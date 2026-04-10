import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getCanonicalToolPath } from "@/data/tools";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Shield, KeyRound, Copy, RefreshCw, Check,
  ArrowRight, Zap, Smartphone, BadgeCheck, Lock, Type, Hash,
  Calculator, Star, Lightbulb, Eye, EyeOff
} from "lucide-react";

// ── FAQ Item Component ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-blue-500/40 transition-colors">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-blue-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Related Tools ──
const RELATED_TOOLS = [
  { title: "Random Number Generator", slug: "random-number-generator", icon: <Hash className="w-4 h-4" />, color: 275, benefit: "Generate random numbers in any range" },
  { title: "UUID Generator", slug: "uuid-generator", icon: <KeyRound className="w-4 h-4" />, color: 217, benefit: "Generate unique identifiers" },
  { title: "Hash Generator", slug: "hash-generator", icon: <Shield className="w-4 h-4" />, color: 152, benefit: "Hash text with MD5, SHA-256 & more" },
  { title: "Word Counter", slug: "word-counter", icon: <Type className="w-4 h-4" />, color: 45, benefit: "Count words and characters" },
  { title: "Base64 Encoder", slug: "base64-encoder", icon: <Calculator className="w-4 h-4" />, color: 340, benefit: "Encode and decode Base64 strings" },
  { title: "IP Address Lookup", slug: "ip-address-lookup", icon: <Zap className="w-4 h-4" />, color: 25, benefit: "Find your public IP address" },
];

// ── Main Component ──
export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const generatePassword = () => {
    let charset = "";
    if (uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) charset += "0123456789";
    if (symbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!charset) {
      setPassword("");
      return;
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [length, uppercase, lowercase, numbers, symbols]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const getStrength = () => {
    const typesCount = [uppercase, lowercase, numbers, symbols].filter(Boolean).length;
    if (!password || length < 8 || typesCount < 2) {
      return { label: "Weak", color: "bg-red-500", textColor: "text-red-500", width: "25%" };
    }
    if (length < 12 || typesCount < 3) {
      return { label: "Fair", color: "bg-yellow-500", textColor: "text-yellow-500", width: "50%" };
    }
    if (length < 16 || typesCount < 4) {
      return { label: "Good", color: "bg-blue-500", textColor: "text-blue-500", width: "75%" };
    }
    return { label: "Strong", color: "bg-emerald-500", textColor: "text-emerald-500", width: "100%" };
  };

  const strength = getStrength();

  return (
    <Layout>
      <SEO
        title="Online Password Generator – Create Strong, Secure Random Passwords Free | US Online Tools"
        description="Free secure password generator. Create strong random passwords up to 64 characters with uppercase, lowercase, numbers, and symbols. Passwords generated in your browser — never stored."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link href="/category/security" className="text-muted-foreground hover:text-foreground transition-colors">Security &amp; Privacy</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">Online Password Generator</span>
        </nav>

        {/* ── HERO SECTION (Full Width) ── */}
        <section className="rounded-2xl overflow-hidden border border-blue-500/15 bg-gradient-to-br from-blue-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          {/* Category pill */}
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Shield className="w-3.5 h-3.5" />
            Security &amp; Privacy
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Online Password Generator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Generate strong, random passwords instantly. Customize length up to 64 characters, choose character types, and copy with one click. All passwords are generated in your browser — never stored or transmitted.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20">
              <Shield className="w-3.5 h-3.5" /> Never Stored
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <KeyRound className="w-3.5 h-3.5" /> Up to 64 Chars
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>

          {/* Meta */}
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Security &amp; Privacy &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── 2. TOOL WIDGET ── */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Secure Password Generator</p>
                      <p className="text-sm text-muted-foreground">Password regenerates automatically as you adjust settings.</p>
                    </div>
                  </div>

                  {/* Password Display */}
                  <div className="bg-muted/40 rounded-2xl p-5 flex items-center justify-between border border-border">
                    <p
                      className="font-mono text-xl md:text-2xl text-foreground tracking-wider break-all mr-4 flex-1 transition-all duration-200"
                      style={{ filter: showPassword ? "none" : "blur(6px)", userSelect: showPassword ? "auto" : "none" }}
                    >
                      {password || <span className="text-muted-foreground text-base font-sans not-italic">Select at least one character type</span>}
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setShowPassword(v => !v)}
                        className="p-2 rounded-xl bg-muted/50 hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-all"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={generatePassword}
                        className="p-2 rounded-xl bg-muted/50 hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-all"
                        title="Generate new password"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={copyToClipboard}
                        disabled={!password}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold hover:-translate-y-0.5 active:translate-y-0 transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                      >
                        {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                      </button>
                    </div>
                  </div>

                  {/* Strength Meter */}
                  {password && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password Strength</p>
                        <span className={`text-xs font-bold ${strength.textColor}`}>{strength.label}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${strength.color} transition-all duration-500`}
                          style={{ width: strength.width }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Length Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-bold text-foreground">Password Length</label>
                      <span className="text-sm font-black text-blue-500 tabular-nums">{length} characters</span>
                    </div>
                    <input
                      type="range"
                      min={6}
                      max={64}
                      value={length}
                      onChange={e => setLength(Number(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                      <span>6</span>
                      <span>16 (recommended)</span>
                      <span>64</span>
                    </div>
                  </div>

                  {/* Character Type Options */}
                  <div>
                    <p className="text-sm font-bold text-foreground mb-3">Character Types</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "Uppercase A–Z", value: uppercase, setter: setUppercase, example: "ABC…XYZ" },
                        { label: "Lowercase a–z", value: lowercase, setter: setLowercase, example: "abc…xyz" },
                        { label: "Numbers 0–9", value: numbers, setter: setNumbers, example: "0123456789" },
                        { label: "Symbols !@#$", value: symbols, setter: setSymbols, example: "!@#$%^&*()" },
                      ].map(({ label, value, setter, example }) => (
                        <label
                          key={label}
                          className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors select-none"
                        >
                          <div className="relative flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={e => setter(e.target.checked)}
                              className="peer appearance-none w-5 h-5 border-2 border-border rounded checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer"
                            />
                            <Check className="absolute inset-0 w-full h-full p-0.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground leading-none mb-0.5">{label}</p>
                            <p className="text-xs text-muted-foreground font-mono">{example}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 3. HOW TO USE ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Password Generator</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                Generating a secure password takes seconds. This tool automatically creates a new password whenever you adjust settings, so you always see a fresh result without having to click a button. Here's exactly how to get the most secure password for your needs.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Adjust the length slider (12+ recommended for security)</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Drag the slider between 6 and 64 characters. The default is 16, which provides a strong balance between security and usability. For critical accounts — banking, email, cloud storage — consider 20 or more characters. Password length is the single most important factor in password strength; each additional character exponentially increases the number of possible combinations an attacker must test.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Select character types: uppercase, lowercase, numbers, symbols</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Toggle the checkboxes to include or exclude character sets. Using all four types — uppercase, lowercase, numbers, and symbols — creates the maximum character pool, making brute-force attacks computationally impractical. Some websites restrict certain characters (e.g., no symbols), so adjust accordingly. At least two character types are recommended for any password.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Password auto-generates as you change settings — click refresh for a new one</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Every time you move the slider or toggle a checkbox, a brand-new password is generated instantly using your browser's built-in random number capabilities. If you don't like the current password, click the refresh button to generate another with the same settings. You can repeat this as many times as you like — there's no rate limit.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">4</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Click Copy to save to clipboard</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Hit the Copy button to send the password directly to your clipboard, then paste it into your password manager or registration form. The button briefly shows "Copied!" to confirm the action. Use the eye icon to toggle visibility if you're in a public space. We strongly recommend saving generated passwords in a reputable password manager rather than writing them down.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Password Strength Guide</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold text-foreground">Weak</span>
                      <span className="text-muted-foreground"> — Less than 8 characters or only 1 character type — easily cracked in seconds</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold text-foreground">Fair</span>
                      <span className="text-muted-foreground"> — 8–11 characters with 2 types — guessable with brute force over hours or days</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold text-foreground">Good</span>
                      <span className="text-muted-foreground"> — 12–15 characters with 3 types — reasonable for low-risk accounts</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold text-foreground">Strong</span>
                      <span className="text-muted-foreground"> — 16+ characters using all 4 types — recommended for all accounts</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 4. RESULT INTERPRETATION ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Understanding Password Strength Levels</h2>
              <p className="text-muted-foreground text-sm mb-6">How each strength rating maps to real-world security risk:</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Weak — Less than 8 characters or only one character type</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Weak passwords can be cracked in milliseconds using dictionary attacks or brute-force tools that run billions of guesses per second on modern hardware. A password like "password" or "12345678" will appear in every attacker's first attempt. Even a random 6-character lowercase string has only about 300 million combinations — trivial for automated tools. Never use weak passwords for any account that holds sensitive data.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Fair — 8–11 characters with 2 character types</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Fair passwords offer modest protection — perhaps enough for low-stakes accounts like forum registrations or trial service logins. However, with 2 character types and 8–11 characters, a determined attacker using cloud-based cracking can still break these within hours to days. If you're using 2-factor authentication (2FA), a fair password may be acceptable. Without 2FA, upgrade to at least Good strength.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Good — 12–15 characters with 3 character types</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Good passwords strike a practical balance. At 12+ characters with mixed case and numbers, the keyspace exceeds 10²¹ combinations — beyond the practical reach of brute-force attacks with current technology when hashed properly. This tier is suitable for streaming services, social media, and any account that doesn't hold financial or medical data. Consider enabling 2FA alongside a Good-strength password for best results.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Strong — 16+ characters using all 4 character types</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Strong passwords are the gold standard for account security. At 16 characters using uppercase, lowercase, numbers, and symbols, the search space exceeds 10³⁰ — completely impractical to crack even with future computing advances over the next several decades. Use Strong passwords for email accounts (which can reset all other passwords), banking, cloud storage, password managers themselves, and any account containing PII or financial data.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <div className="flex gap-2 items-start">
                  <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">The strength meter is a practical heuristic based on length and character diversity. Actual cracking resistance also depends on the hashing algorithm the website uses to store passwords — a Strong password stored as plain text is still vulnerable to a server breach. Always prefer services that use modern hashing (bcrypt, Argon2) and enable 2FA wherever available.</p>
                </div>
              </div>
            </section>

            {/* ── 5. QUICK EXAMPLES ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Length</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Character Types</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Strength</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">8</td>
                      <td className="px-4 py-3 text-muted-foreground">Lowercase only</td>
                      <td className="px-4 py-3 font-bold text-red-600 dark:text-red-400">Weak</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">"password" style — avoid for any real account</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">12</td>
                      <td className="px-4 py-3 text-muted-foreground">Upper + lower + numbers</td>
                      <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">Good</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Social media, streaming accounts</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">16</td>
                      <td className="px-4 py-3 text-muted-foreground">All 4 types</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">Strong</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Recommended default for all accounts</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">24</td>
                      <td className="px-4 py-3 text-muted-foreground">All 4 types</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">Very Strong</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Banking, email, cloud storage, critical accounts</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-foreground">64</td>
                      <td className="px-4 py-3 text-muted-foreground">All 4 types</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">Maximum</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Maximum security — use with a password manager</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">8-character lowercase password:</strong> This is the type of password that many older websites enforced as a "minimum" — and it's dramatically insufficient by modern standards. Tools like Hashcat running on a consumer GPU can exhaust the entire lowercase-only 8-character keyspace in under a minute. If you're still using passwords of this style anywhere, replace them immediately with at least a 12-character mixed password.
                </p>
                <p>
                  <strong className="text-foreground">12-character with three character types:</strong> This configuration — uppercase, lowercase, and digits — is good for everyday accounts like social media, streaming platforms, and forum logins. With roughly 3.2 trillion possible combinations at this length and character diversity, an offline brute-force attack would take years on typical hardware. Combined with 2FA, this is sufficient for most consumer accounts.
                </p>
                <p>
                  <strong className="text-foreground">16-character with all four types (recommended default):</strong> A 16-character password using all character types (roughly 92 possible characters per position) produces a keyspace of 92¹⁶ — approximately 4.4 × 10³¹ combinations. Even at a trillion guesses per second, cracking this would take longer than the age of the universe. This is the right choice for email, work accounts, and password manager master passwords.
                </p>
                <p>
                  <strong className="text-foreground">24+ characters for critical accounts:</strong> For accounts that serve as "skeleton keys" — your primary email, iCloud or Google account, or anything tied to financial or medical records — use 24 or more characters. The additional length provides a massive safety margin against any near-future improvements in cracking technology, including theoretical quantum computing advances in the coming decades.
                </p>
                <p>
                  <strong className="text-foreground">64-character maximum-length password:</strong> Some password managers and security-conscious applications support very long passwords. Generating a 64-character password with all four character types is essentially uncrackable by any conceivable technology. The practical limit is that you'll never type this manually — it must live in a password manager. That's a good thing: storing it in a manager is far more secure than memorizing a short, predictable password.
                </p>
              </div>

              {/* Testimonial */}
              <div className="mt-6 p-5 rounded-xl bg-blue-500/5 border border-blue-500/15">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"I use this every time I create a new account. The one-click copy and instant regeneration make it so fast — I never use weak passwords anymore."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* ── 6. WHY CHOOSE THIS ── */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Password Generator?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Completely free — no registration, no ads, no limits.</strong> Many password generators hide advanced options behind a paywall or force you to sign up before generating passwords. This tool has no paywalls, no advertisements interrupting your workflow, and no account required. Generate as many passwords as you need, at any length, with any character configuration — always free.
                </p>
                <p>
                  <strong className="text-foreground">Your passwords are never transmitted or stored.</strong> Every password is generated entirely within your browser using JavaScript. No password value, no settings, and no usage data is ever sent to any server. When you close the tab, the password is gone. This is critical: a password generator that transmits your password to a server has already compromised your security before you even use it.
                </p>
                <p>
                  <strong className="text-foreground">One-click copy for a frictionless workflow.</strong> The Copy button places your password directly on the clipboard in a single click, with a clear visual confirmation. No selecting text, no right-click menus, no accidental partial selections. On mobile, this eliminates the frustrating experience of trying to precisely select a long string of random characters from a small screen.
                </p>
                <p>
                  <strong className="text-foreground">Flexible customization without the complexity.</strong> Four simple toggles and one slider give you precise control over the output without overwhelming you with options. You can disable character types that a specific website doesn't support, increase length for high-security accounts, and regenerate instantly until you get a password you're satisfied with. The strength meter updates in real time so you always know what you're creating.
                </p>
                <p>
                  <strong className="text-foreground">Part of a 400+ tool ecosystem.</strong> This generator is one tool in a growing suite of over 400 free online utilities covering security, developer tools, finance calculators, text processing, unit converters, and more. Every tool shares the same clean interface, dark/light mode support, and mobile-optimized layout — making your whole toolkit consistent and accessible from any device.
                </p>
              </div>

              {/* Note / Limitation */}
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> This tool is designed for generating user account passwords and is not suitable for cryptographic key generation, token minting, or security-sensitive programmatic use cases. For maximum security, use a hardware random number generator or the Web Crypto API. Always store generated passwords in a reputable password manager — never reuse passwords across accounts.
                </p>
              </div>
            </section>

            {/* ── 7. FAQ ── */}
            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="What makes a password strong?"
                  a="Password strength comes from two factors: length and character diversity. Length is the most important — each additional character multiplies the number of possible combinations an attacker must try. Character diversity (using uppercase, lowercase, numbers, and symbols) increases the size of the pool each character can be drawn from, which compounds the effect of length. A 16-character password using all four character types has approximately 92¹⁶ possible combinations — a number so large that even a trillion-guess-per-second attack would take longer than the age of the universe. Avoid dictionary words, personal information like birthdays or names, and sequential patterns like '1234' or 'abcd' — these are the first things attackers try."
                />
                <FaqItem
                  q="Are my generated passwords stored anywhere?"
                  a="No — absolutely not. Every password is generated locally in your browser using JavaScript. No password value, no configuration settings, and no usage data is ever sent to any server. There is no backend, no database, and no logging. When you close the tab or navigate away, the password exists only on your clipboard (if you copied it) or in your memory. This is by design: the only secure password generator is one that never transmits your password over any network."
                />
                <FaqItem
                  q="How long should a password be?"
                  a="For most accounts, 16 characters is the recommended minimum — this is the default setting in this tool. For critical accounts like your primary email, banking login, or password manager master password, use 20–24 characters or more. Shorter passwords (under 12 characters) are increasingly vulnerable to brute-force attacks as computing power improves year over year. The good news is that with a password manager, you never need to remember or type these passwords — so there's no practical reason to use anything shorter than 16 characters for any account."
                />
                <FaqItem
                  q="Should I use symbols in my password?"
                  a="Yes, whenever a website permits them. Including symbols (like !@#$%^&*) expands the character pool from 62 (letters and digits only) to roughly 92+ characters, which significantly increases the number of possible combinations for each character position. Some websites restrict certain symbols due to poor input sanitization — if a site rejects your password, try disabling the symbols option and generating a new one. A longer all-alphanumeric password is preferable to a short password that forces symbols — prioritize length first."
                />
                <FaqItem
                  q="What is the difference between a passphrase and a password?"
                  a="A password is typically a random string of characters — like the output of this generator. A passphrase is a sequence of random words (e.g., 'correct-horse-battery-staple'), which can be easier to remember while still being very long. Both approaches can achieve equivalent security: a 4-word passphrase with common words achieves roughly the same entropy as a 10-character random password. This generator focuses on traditional random character passwords, which are ideal for use with a password manager. If you need a memorable password you'll type frequently (like a computer login), a passphrase may be more practical."
                />
                <FaqItem
                  q="How often should I change my passwords?"
                  a="Modern security guidance has shifted away from mandatory periodic password changes — forcing regular changes often leads users to make predictable incremental modifications (e.g., 'Password1' → 'Password2') that are easier to crack than the original. Current NIST guidelines recommend changing a password only when: (1) you suspect it has been compromised, (2) the service announces a data breach, or (3) you've shared it with someone who no longer needs access. Instead of rotating passwords on a schedule, focus on using unique, strong passwords for every account and enabling 2-factor authentication wherever available."
                />
                <FaqItem
                  q="Can I use this for WiFi passwords?"
                  a="Yes — this is an excellent use case. WiFi passwords (WPA2/WPA3 pre-shared keys) support up to 63 characters and benefit from all four character types. A 16–20 character random password is far more secure than the typical router default (which is often based on the device's serial number or MAC address — both potentially discoverable). After generating and setting your WiFi password, store it in your password manager so you can retrieve it when connecting new devices. Your router's admin panel will show a QR code option in many cases, which makes sharing with guests easier without revealing the password string."
                />
                <FaqItem
                  q="Is this tool safe to use at work?"
                  a="Yes. Because all generation happens locally in your browser, there is no network traffic associated with password creation — corporate firewalls, IT monitoring systems, and network logs will not capture your generated passwords. The tool requires no plugins, no downloads, and no software installation. However, always consult your organization's IT security policy before using any external password generator for work-related credentials. For enterprise environments, a company-approved password manager (such as 1Password Teams, Bitwarden Business, or Dashlane for Business) may be the preferred solution."
                />
              </div>
            </section>

            {/* ── 8. FINAL CTA ── */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Security Tools?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore 400+ free tools including hash generators, UUID generators, encoders, developer utilities, and more — all free, all instant, all private.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Related Tools */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={getCanonicalToolPath(tool.slug)}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-blue-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others generate secure passwords easily.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {linkCopied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    "Generator",
                    "How to Use",
                    "Result Interpretation",
                    "Quick Examples",
                    "Why Choose This",
                    "FAQ",
                  ].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-blue-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-blue-500/40 flex-shrink-0" />
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
