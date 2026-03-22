import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock,
  Lock, Lightbulb, Copy, Check, Eye, EyeOff,
  Key, ShieldCheck, AlertTriangle, Hash,
} from "lucide-react";
import { getToolPath } from "@/data/tools";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary"><ChevronDown className="w-5 h-5" /></motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type Strength = "very-weak" | "weak" | "fair" | "strong" | "very-strong";

function analyzePassword(pw: string): { strength: Strength; score: number; feedback: string[]; crackTime: string } {
  if (!pw) return { strength: "very-weak", score: 0, feedback: [], crackTime: "instant" };

  let score = 0;
  const feedback: string[] = [];

  // Length scoring
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (pw.length >= 16) score += 1;
  if (pw.length < 8) feedback.push("Use at least 8 characters");

  // Character diversity
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasDigit = /[0-9]/.test(pw);
  const hasSpecial = /[^a-zA-Z0-9]/.test(pw);

  if (hasLower) score += 1;
  if (hasUpper) score += 1;
  if (hasDigit) score += 1;
  if (hasSpecial) score += 1;

  if (!hasUpper) feedback.push("Add uppercase letters (A-Z)");
  if (!hasLower) feedback.push("Add lowercase letters (a-z)");
  if (!hasDigit) feedback.push("Add numbers (0-9)");
  if (!hasSpecial) feedback.push("Add special characters (!@#$%)");

  // Common patterns
  if (/^[a-zA-Z]+$/.test(pw)) { score -= 1; feedback.push("Don't use only letters"); }
  if (/^[0-9]+$/.test(pw)) { score -= 1; feedback.push("Don't use only numbers"); }
  if (/(.)\1{2,}/.test(pw)) { score -= 1; feedback.push("Avoid repeated characters (aaa, 111)"); }
  if (/^(123|abc|qwerty|password|admin)/i.test(pw)) { score -= 2; feedback.push("Avoid common patterns like '123', 'abc', 'password'"); }

  const clampedScore = Math.max(0, Math.min(score, 7));
  let strength: Strength;
  if (clampedScore <= 1) strength = "very-weak";
  else if (clampedScore <= 2) strength = "weak";
  else if (clampedScore <= 4) strength = "fair";
  else if (clampedScore <= 5) strength = "strong";
  else strength = "very-strong";

  // Estimated crack time
  const charsetSize = (hasLower ? 26 : 0) + (hasUpper ? 26 : 0) + (hasDigit ? 10 : 0) + (hasSpecial ? 33 : 0) || 26;
  const combinations = Math.pow(charsetSize, pw.length);
  const guessesPerSecond = 1e10; // 10 billion guesses/sec
  const seconds = combinations / guessesPerSecond / 2;
  let crackTime: string;
  if (seconds < 1) crackTime = "instant";
  else if (seconds < 60) crackTime = `${Math.round(seconds)} seconds`;
  else if (seconds < 3600) crackTime = `${Math.round(seconds / 60)} minutes`;
  else if (seconds < 86400) crackTime = `${Math.round(seconds / 3600)} hours`;
  else if (seconds < 31536000) crackTime = `${Math.round(seconds / 86400)} days`;
  else if (seconds < 31536000 * 1000) crackTime = `${Math.round(seconds / 31536000)} years`;
  else if (seconds < 31536000 * 1e6) crackTime = `${Math.round(seconds / 31536000 / 1000)}K years`;
  else crackTime = "centuries+";

  return { strength, score: clampedScore, feedback, crackTime };
}

const STRENGTH_CONFIG: Record<Strength, { label: string; color: string; bg: string; percent: number }> = {
  "very-weak": { label: "Very Weak", color: "text-red-500", bg: "bg-red-500", percent: 10 },
  "weak": { label: "Weak", color: "text-orange-500", bg: "bg-orange-500", percent: 30 },
  "fair": { label: "Fair", color: "text-yellow-500", bg: "bg-yellow-500", percent: 55 },
  "strong": { label: "Strong", color: "text-emerald-500", bg: "bg-emerald-500", percent: 80 },
  "very-strong": { label: "Very Strong", color: "text-green-500", bg: "bg-green-500", percent: 100 },
};

const RELATED_TOOLS = [
  { title: "Password Generator", slug: "password-generator", icon: <Key className="w-5 h-5" />, color: 340 },
  { title: "Base64 Encoder/Decoder", slug: "base64-encoder-decoder", icon: <Hash className="w-5 h-5" />, color: 265 },
  { title: "Word Counter", slug: "word-counter", icon: <CheckCircle2 className="w-5 h-5" />, color: 217 },
  { title: "JSON Formatter", slug: "json-formatter", icon: <Lock className="w-5 h-5" />, color: 152 },
  { title: "Random Number Generator", slug: "random-number-generator", icon: <ShieldCheck className="w-5 h-5" />, color: 25 },
  { title: "Meta Tag Generator", slug: "meta-tag-generator", icon: <AlertTriangle className="w-5 h-5" />, color: 45 },
];

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const analysis = useMemo(() => analyzePassword(password), [password]);
  const config = STRENGTH_CONFIG[analysis.strength];

  return (
    <Layout>
      <SEO
        title="Password Strength Checker - Free Online Tool | Test Password Security"
        description="Free online password strength checker. Test how strong your password is instantly. Get feedback on improving security. 100% private — nothing is sent to any server."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/security" className="text-muted-foreground hover:text-foreground transition-colors">Security & Encryption</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Password Strength Checker</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            <section>
              <div className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <Shield className="w-3.5 h-3.5" /> Security & Encryption
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">Password Strength Checker</h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Test how strong your password is instantly. Get real-time feedback, estimated crack time, and improvement suggestions — 100% private, runs entirely in your browser.
              </p>
            </section>

            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Zap className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="font-bold text-foreground text-sm">100% private</p>
                <p className="text-muted-foreground text-sm">Your password never leaves your device. All analysis happens locally in your browser.</p>
              </div>
            </section>

            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 340 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Password Strength Checker</h3>
                </div>

                <div className="mb-5">
                  <label className="text-sm font-semibold text-muted-foreground mb-1.5 block">Enter Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Type your password here..."
                      className="tool-calc-input w-full pr-12 font-mono"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {password && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    {/* Strength bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-bold ${config.color}`}>{config.label}</span>
                        <span className="text-xs text-muted-foreground font-semibold">Crack time: {analysis.crackTime}</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${config.percent}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className={`h-full rounded-full ${config.bg}`}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="tool-calc-result text-center">
                        <div className="text-xs font-semibold text-muted-foreground mb-1">Length</div>
                        <div className="text-lg font-black text-foreground">{password.length}</div>
                      </div>
                      <div className="tool-calc-result text-center">
                        <div className="text-xs font-semibold text-muted-foreground mb-1">Uppercase</div>
                        <div className="text-lg font-black text-foreground">{(password.match(/[A-Z]/g) || []).length}</div>
                      </div>
                      <div className="tool-calc-result text-center">
                        <div className="text-xs font-semibold text-muted-foreground mb-1">Numbers</div>
                        <div className="text-lg font-black text-foreground">{(password.match(/[0-9]/g) || []).length}</div>
                      </div>
                      <div className="tool-calc-result text-center">
                        <div className="text-xs font-semibold text-muted-foreground mb-1">Symbols</div>
                        <div className="text-lg font-black text-foreground">{(password.match(/[^a-zA-Z0-9]/g) || []).length}</div>
                      </div>
                    </div>

                    {/* Feedback */}
                    {analysis.feedback.length > 0 && (
                      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                        <h4 className="font-bold text-foreground text-sm mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" /> Improvement Suggestions
                        </h4>
                        <ul className="space-y-1.5">
                          {analysis.feedback.map((f, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-amber-500 mt-0.5">•</span> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.strength === "very-strong" && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                        <div className="flex gap-2 items-start">
                          <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-foreground/80 leading-relaxed">Excellent! Your password is very strong with {password.length} characters, mixed case, numbers, and special characters. Estimated crack time: {analysis.crackTime}.</p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How Password Strength Is Measured</h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Length</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Longer passwords are exponentially harder to crack. Each additional character multiplies the number of possible combinations. Aim for 12+ characters minimum.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Character Diversity</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Using uppercase, lowercase, numbers, and symbols increases the character set size. A 10-character password with all 4 types has 95^10 (≈6 × 10^19) possible combinations.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Pattern Avoidance</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">Avoiding common patterns (dictionary words, keyboard sequences, repeated characters) prevents attackers from using optimized cracking dictionaries.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Tool?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Real-time strength analysis as you type" },
                  { icon: <Shield className="w-4 h-4" />, text: "100% client-side — zero data transmission" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Estimated crack time calculation" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Works on all devices and browsers" },
                  { icon: <Clock className="w-4 h-4" />, text: "No signup, no downloads required" },
                  { icon: <Lock className="w-4 h-4" />, text: "Actionable improvement suggestions" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Password Security Best Practices</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>Password security is your first line of defense against unauthorized access. Weak passwords are responsible for over 80% of data breaches according to Verizon's Data Breach Investigations Report. This free password strength checker helps you evaluate and improve your passwords before using them.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">Tips for Creating Strong Passwords</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Use at least 12 characters — longer is always better",
                    "Mix uppercase, lowercase, numbers, and special characters",
                    "Never reuse passwords across different accounts",
                    "Avoid personal information (names, birthdays, addresses)",
                    "Consider using a passphrase — a memorable sentence with substitutions",
                    "Use a password manager to generate and store unique passwords",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" /><span>{item}</span></li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="Is my password sent to any server?" a="Absolutely not. This password strength checker runs 100% in your browser. Your password never leaves your device — no network requests, no data storage, no tracking." />
                <FaqItem q="What makes a password strong?" a="A strong password has 12+ characters, uses uppercase and lowercase letters, numbers, and special characters, avoids dictionary words and common patterns, and is unique to each account." />
                <FaqItem q="How is crack time estimated?" a="We estimate based on a brute-force attack at 10 billion guesses per second (modern GPU capability). The calculation considers password length and character set size to determine total possible combinations." />
                <FaqItem q="Should I use a password manager?" a="Yes. Password managers generate, store, and auto-fill unique strong passwords for every account. This eliminates password reuse — the most common security vulnerability. Popular options include 1Password, Bitwarden, and LastPass." />
                <FaqItem q="Is this tool free?" a="100% free with no ads, no signup, and complete privacy. Your passwords are never stored or transmitted anywhere." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need to Generate a Strong Password?</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">Try our password generator, hash tools, and 400+ more free security and utility tools.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-4">Related Tools</h3>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((tool) => (
                    <Link key={tool.slug} href={getToolPath(tool.slug)} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-snug">{tool.title}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-lg font-black text-foreground tracking-tight mb-2">Share This Tool</h3>
                <p className="text-sm text-muted-foreground mb-4">Help others check their password strength.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
