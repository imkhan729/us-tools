import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, KeyRound, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Eye, EyeOff, ShieldAlert, ShieldCheck, AlertTriangle
} from "lucide-react";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-teal-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-teal-500">
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

const checkPasswordStrength = (pwd: string) => {
  let score = 0;
  const metrics = { length: false, upper: false, lower: false, num: false, special: false };
  const feedback: string[] = [];

  if (pwd.length === 0) return { score: 0, label: "Empty", color: "slate", metrics, feedback, maxScore: 6 };

  if (pwd.length >= 8) { score += 1; metrics.length = true; } else { feedback.push("Add more characters (at least 8)"); }
  if (pwd.length >= 12) score += 1;

  if (/[A-Z]/.test(pwd)) { score += 1; metrics.upper = true; } else { feedback.push("Add uppercase letters"); }
  if (/[a-z]/.test(pwd)) { score += 1; metrics.lower = true; } else { feedback.push("Add lowercase letters"); }
  if (/\d/.test(pwd)) { score += 1; metrics.num = true; } else { feedback.push("Add numbers"); }
  if (/[^A-Za-z0-9]/.test(pwd)) { score += 1; metrics.special = true; } else { feedback.push("Add special characters (!@#$)"); }

  // Penalties
  if (/^[a-zA-Z]+$/.test(pwd) || /^[0-9]+$/.test(pwd)) score = Math.max(1, score - 1); // Only letters or only numbers
  const repeatRegex = /(.)\1{2,}/g;
  if (repeatRegex.test(pwd)) { score = Math.max(1, score - 1); feedback.push("Avoid repeating characters"); }

  let label = "Very Weak";
  let color = "red";
  if (score >= 2 && score < 4) { label = "Weak"; color = "amber"; }
  if (score >= 4 && score < 5) { label = "Good"; color = "blue"; }
  if (score >= 5) { label = "Strong"; color = "emerald"; }

  const timeToCrack =
    score < 2 ? "Instantly" :
    score < 4 ? "A few hours to days" :
    score < 5 ? "Several months" : "Centuries";

  return { score, label, color, metrics, feedback, timeToCrack, maxScore: 6 };
};

const RELATED = [
  { title: "Password Generator",slug: "password-generator", cat: "productivity", icon: <KeyRound className="w-5 h-5" />,   color: 20, benefit: "Create secure random passwords quickly" },
  { title: "Username Generator",slug: "username-generator", cat: "productivity", icon: <Lock className="w-5 h-5" />,       color: 160, benefit: "Generate catchy, unique usernames" },
  { title: "Base64 Encoder",    slug: "base64-encoder-decoder",cat: "developer", icon: <Shield className="w-5 h-5" />,     color: 217, benefit: "Safely encode data formats" },
];

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const analysis = useMemo(() => checkPasswordStrength(password), [password]);

  return (
    <Layout>
      <SEO
        title="Password Strength Checker – Test Your Password Security | US Online Tools"
        description="Free password strength checker. Test how secure your password is against cracking, check for common vulnerabilities, and learn how to improve password security offline."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-teal-500" strokeWidth={3} />
          <Link href="/category/productivity" className="text-muted-foreground hover:text-foreground transition-colors">Productivity &amp; Text</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-teal-500" strokeWidth={3} />
          <span className="text-foreground">Password Strength Checker</span>
        </nav>

        {/* HERO */}
        <section className="rounded-2xl overflow-hidden border border-teal-500/15 bg-gradient-to-br from-teal-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Lock className="w-3.5 h-3.5" /> Security Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Password Strength Checker</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Test how secure your password is. Our client-side algorithm estimates the time it takes to crack your password and provides instant feedback on vulnerabilities. All processing happens locally in your browser — nothing is sent to a server.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><ShieldCheck className="w-3.5 h-3.5" /> Client-Side Only</span>
            <span className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs px-3 py-1.5 rounded-full border border-teal-500/20"><Zap className="w-3.5 h-3.5" /> Instant Feedback</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Network Let</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Productivity &amp; Security &nbsp;·&nbsp; Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* TOOL WIDGET */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-teal-500/20 shadow-lg shadow-teal-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-cyan-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                      <KeyRound className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Security Tester</p>
                      <p className="text-sm text-muted-foreground">Type a password below to analyze its strength.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 180 } as React.CSSProperties}>
                    <div className="relative mb-6">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Type a password to test..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full pl-12 pr-12 py-4 rounded-xl font-mono text-lg bg-background border-2 transition-all outline-none 
                          ${password.length > 0 ? `border-${analysis.color}-500/50 focus:border-${analysis.color}-500` : 'border-border focus:border-teal-500'}`}
                        autoComplete="off"
                        spellCheck="false"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-3 w-full bg-muted rounded-full overflow-hidden mb-8">
                      <motion.div
                        className={`absolute top-0 left-0 h-full bg-${analysis.color}-500`}
                        initial={{ width: 0 }}
                        animate={{ width: password.length > 0 ? `${(analysis.score / analysis.maxScore) * 100}%` : "0%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                    </div>

                    <AnimatePresence mode="wait">
                      {password.length > 0 ? (
                        <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                          <div className={`p-6 rounded-xl border-2 bg-${analysis.color}-500/5 border-${analysis.color}-500/20 mb-6 text-center`}>
                            <p className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-1">Overall Strength</p>
                            <h2 className={`text-3xl font-black mb-2 text-${analysis.color}-600 dark:text-${analysis.color}-400`}>
                              {analysis.label}
                            </h2>
                            <div className="flex items-center justify-center gap-2 text-sm text-foreground/80">
                              <ShieldAlert className="w-4 h-4 opacity-70" />
                              <span>Est. Crack Time: <strong>{analysis.timeToCrack}</strong></span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Checklist */}
                            <div>
                              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Password Requirements</h3>
                              <ul className="space-y-3">
                                {[
                                  { label: "At least 8 characters", valid: analysis.metrics.length },
                                  { label: "Uppercase Letters (A-Z)", valid: analysis.metrics.upper },
                                  { label: "Lowercase Letters (a-z)", valid: analysis.metrics.lower },
                                  { label: "Numbers (0-9)", valid: analysis.metrics.num },
                                  { label: "Special Characters (!@#$)", valid: analysis.metrics.special },
                                ].map((req, i) => (
                                  <li key={i} className={`flex items-center gap-3 text-sm font-medium ${req.valid ? "text-foreground" : "text-muted-foreground"}`}>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${req.valid ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground/50"}`}>
                                      {req.valid ? <Check className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                    </div>
                                    {req.label}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Recommendations */}
                            {analysis.feedback.length > 0 && (
                              <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">How to Improve</h3>
                                <ul className="space-y-2">
                                  {analysis.feedback.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-2 rounded-lg">
                                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {f}
                                    </li>
                                  ))}
                                </ul>
                                <div className="mt-4 p-3 bg-card border border-border rounded-lg flex items-center gap-3 hover:border-teal-500/40 transition-colors cursor-pointer" onClick={() => (window as any).location.href = '/productivity/password-generator'}>
                                  <div className="w-8 h-8 rounded bg-teal-500/10 flex items-center justify-center flex-shrink-0"><KeyRound className="w-4 h-4 text-teal-600" /></div>
                                  <div className="flex-1"><p className="text-sm font-bold text-foreground">Need a strong password?</p><p className="text-xs text-muted-foreground">Use our secure generator</p></div>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ) : (
                        <div className="text-center py-8 opacity-50">
                          <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                          <p className="font-bold text-lg text-foreground">Awaiting Input</p>
                          <p className="text-sm text-muted-foreground">Enter a password above to begin analysis safely.</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Assess Password Strength</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Password strength refers to how resilient a password is to guessing or brute-force attacks by malicious actors. Our tool runs algorithmic checks locally entirely within your browser to verify structural integrity without exposing your secret.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Type your intended password safely</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Enter the password you wish to evaluate. As you type, the strength meter updates automatically. You can test variations to see how adding specific characters dramatically increases complexity.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Review the complexity checklist</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The tool checks for five fundamental traits: minimum length (8+ chars), presence of uppercase letters, lowercase letters, numerals, and special symbols. Green checkmarks appear as you meet each condition.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Apply algorithmic feedback</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">If there are specific weaknesses—like repeating the same character or omitting numbers—the algorithm generates "How to Improve" recommendations. Address these alerts to push the progress bar into the "Strong" (green) zone.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-orange-500/5 border border-orange-500/20">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-foreground mb-1 text-sm">A Note on Real Passwords</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">While this tool is 100% client-side and transmits zero data, cybersecurity best practice dictates that you should <strong className="text-foreground">never enter an active, in-use password</strong> into third-party web forms. Use this tool to test the <em>pattern</em> or structure you intend to use (e.g., test "Tigr@!!2024" but actually use "Puma#$!2025" elsewhere).</p>
                  </div>
                </div>
              </div>
            </section>

            {/* QUICK EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Password Brute Force Times</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Password Structure</th><th className="text-left px-4 py-3 font-bold text-foreground">Example Pattern</th><th className="text-left px-4 py-3 font-bold text-foreground">Est. Crack Time (Modern GPUs)</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-medium text-foreground">8 Lowercase Letters</td><td className="px-4 py-3 font-mono text-muted-foreground">password</td><td className="px-4 py-3 font-bold text-red-500">Instant</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-medium text-foreground">8 Mixed Chars (A-Z, 0-9)</td><td className="px-4 py-3 font-mono text-muted-foreground">Apples22</td><td className="px-4 py-3 font-bold text-amber-500">1 Hour</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-medium text-foreground">10 Mixed Chars</td><td className="px-4 py-3 font-mono text-muted-foreground">Oranges246</td><td className="px-4 py-3 font-bold text-amber-600">7 Months</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-medium text-foreground">12 Full Mix (+ Symbols)</td><td className="px-4 py-3 font-mono text-muted-foreground">B^n@n@s!9876</td><td className="px-4 py-3 font-bold text-emerald-500">34,000 Years</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-medium text-foreground">16 Lowercase (Passphrase)</td><td className="px-4 py-3 font-mono text-muted-foreground">correcthorsebattery</td><td className="px-4 py-3 font-bold text-emerald-600">Millions of Years</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Length Trumps Complexity:</strong> Notice how a 16-character phrase using only lowercase letters is mathematically safer than a complex 8-character string with symbols. Passphrases are highly recommended by security experts as they are easy to memorize but extremely difficult for computers to brute-force due to sheer character count.</p>
              </div>
            </section>

            {/* WHY CHOOSE THIS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use Our Strength Checker?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">100% Private, Zero Network Requests.</strong> Server-side password checkers log what you type. Our application transfers the entire evaluation algorithm to your local browser upon page load. Once loaded, you can even disconnect your internet router, and the tool will continue functioning perfectly, ensuring your input never traverses the internet.</p>
                <p><strong className="text-foreground">Actionable Heuristics.</strong> We don't just output an arbitrary score. We tell you exactly why the score is low—whether you missed uppercase letters, relied purely on an unbroken string of numbers, or repeated the same letter sequentially too many times.</p>
                <p><strong className="text-foreground">Real-Time Fluid Updates.</strong> The progress bar and checkmarks map seamlessly to your keystrokes. This instantaneous feedback loop allows you to rapidly iterate on your structure until you achieve a 'Strong' rating.</p>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="Are the passwords I test here recorded or stored?" a="Absolutely not. There is no backend database connected to this tool, and no analytics software logs the contents of the password input field. The logic runs entirely via client-side JavaScript within your web browser." />
                <FaqItem q="What makes a password 'Strong'?" a="A strong password is generally at least 12 characters long and uses a mix of uppercase and lowercase letters, numbers, and special symbols. Alternatively, an exceptionally long 'passphrase' consisting of 4 or 5 completely unrelated words (e.g., 'table-orchestra-sunset-rocket') provides immense brute-force resistance while remaining memorable." />
                <FaqItem q="Why does my password say 'Instantly' cracked when it has 8 letters?" a="Modern GPU hardware arrays can guess offline password hashes billions of times per second. An 8-character lowercase password has roughly 208 billion combinations, a space size that a single modern graphics card can brute-force in less than one minute." />
                <FaqItem q="Is it better to change passwords frequently or keep one strong one?" a="Recent National Institute of Standards and Technology (NIST) guidelines advise against mandatory frequent password rotations (e.g., every 90 days), as it inevitably leads users to pick weaker, predictable passwords (changing 'Pass1!' to 'Pass2!'). It is better to choose a highly complex, unique password and only change it if a breach occurs." />
                <FaqItem q="Can I use replacing letters with numbers like 'p@ssw0rd'?" a="While better than 'password', replacing letters with common visual equivalents ('l33tspeak') is a known pattern. Hackers build this exact substitution logic into their cracking dictionaries. It is mathematically much safer to just add more characters rather than relying entirely on common substitutions." />
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED.map(t => (
                    <Link key={t.slug} href={`/${t.cat}/${t.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${t.color} 70% 55%), hsl(${t.color} 75% 42%))` }}>{t.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{t.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{t.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-teal-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Calculator","How to Use","Quick Examples","Why Choose This","FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g,"-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-teal-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-teal-500/40 flex-shrink-0" />{label}
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
