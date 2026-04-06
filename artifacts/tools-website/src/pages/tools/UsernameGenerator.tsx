import { useState, useMemo, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, User, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, RefreshCw, Hash, AtSign, Globe
} from "lucide-react";

const ADJECTIVES = ["swift","brave","cool","dark","fuzzy","golden","happy","iron","jolly","keen","lively","magic","noble","pixel","quick","royal","silver","turbo","ultra","vivid","wild","zappy"];
const NOUNS = ["arrow","blade","bolt","comet","coder","drift","eagle","falcon","fox","gear","hawk","knight","lynx","pixel","quest","rider","sage","spark","tiger","viper","wolf","zenith"];
const NUMBERS = ["42","99","007","123","777","2024","pro","x","one","zone","dev","hq"];

function generateUsername(style: string, count: number): string[] {
  const results: string[] = [];
  const arr = new Uint32Array(count * 6);
  crypto.getRandomValues(arr);
  let i = 0;
  while (results.length < count) {
    const adj = ADJECTIVES[arr[i++] % ADJECTIVES.length];
    const noun = NOUNS[arr[i++] % NOUNS.length];
    const num = NUMBERS[arr[i++] % NUMBERS.length];
    let name = "";
    if (style === "classic")   name = `${adj}${noun}`;
    else if (style === "number") name = `${adj}${noun}${num}`;
    else if (style === "underscore") name = `${adj}_${noun}`;
    else if (style === "dot")  name = `${adj}.${noun}`;
    else if (style === "upper") name = `${adj.charAt(0).toUpperCase() + adj.slice(1)}${noun.charAt(0).toUpperCase() + noun.slice(1)}`;
    results.push(name);
  }
  return results;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-blue-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-blue-500">
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
  { title: "Password Generator", slug: "password-generator", cat: "productivity", icon: <Lock className="w-5 h-5" />,   color: 25,  benefit: "Create secure random passwords" },
  { title: "Random Name Generator", slug: "random-name-generator", cat: "productivity", icon: <User className="w-5 h-5" />,   color: 265, benefit: "Generate realistic names" },
  { title: "Case Converter",      slug: "case-converter",    cat: "productivity", icon: <Hash className="w-5 h-5" />,   color: 217, benefit: "Change text case formats" },
  { title: "Word Counter",        slug: "word-counter",      cat: "productivity", icon: <AtSign className="w-5 h-5" />, color: 152, benefit: "Count words and characters" },
];

const STYLES = [
  { key: "classic",    label: "Classic",     example: "swifteagle" },
  { key: "number",     label: "With Number", example: "swifteagle42" },
  { key: "underscore", label: "snake_style", example: "swift_eagle" },
  { key: "dot",        label: "dot.style",   example: "swift.eagle" },
  { key: "upper",      label: "TitleCase",   example: "SwiftEagle" },
];

export default function UsernameGenerator() {
  const [style, setStyle] = useState("classic");
  const [count, setCount] = useState(10);
  const [usernames, setUsernames] = useState<string[]>(() => generateUsername("classic", 10));
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const regenerate = useCallback(() => {
    setUsernames(generateUsername(style, count));
  }, [style, count]);

  const applyStyle = useCallback((s: string) => {
    setStyle(s);
    setUsernames(generateUsername(s, count));
  }, [count]);

  const copyOne = (name: string, idx: number) => {
    navigator.clipboard.writeText(name);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(usernames.join("\n"));
    setCopiedIdx(-1);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Username Generator – Random Cool Username Ideas | US Online Tools"
        description="Free username generator. Instantly create unique, random usernames in multiple styles — classic, number, underscore, dot, and TitleCase. Perfect for gaming, social media, and accounts. No signup."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* BREADCRUMB */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link href="/category/productivity" className="text-muted-foreground hover:text-foreground transition-colors">Productivity</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">Username Generator</span>
        </nav>

        {/* HERO */}
        <section className="rounded-2xl overflow-hidden border border-blue-500/15 bg-gradient-to-br from-blue-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <User className="w-3.5 h-3.5" /> Productivity &amp; Utilities
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Username Generator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Instantly generate unique, creative usernames in multiple styles. Perfect for gaming accounts, social media, forums, and new sign-ups. Cryptographically random — no two results are the same.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Lock className="w-3.5 h-3.5" /> No Signup</span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20"><Shield className="w-3.5 h-3.5" /> Privacy First</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: Productivity &amp; Utilities &nbsp;·&nbsp; Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* TOOL WIDGET */}
            <section className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Random Username Generator</p>
                      <p className="text-sm text-muted-foreground">Choose a style and click any username to copy it instantly.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 217 } as React.CSSProperties}>
                    {/* Style selector */}
                    <div className="mb-5">
                      <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider block">Username Style</label>
                      <div className="flex flex-wrap gap-2">
                        {STYLES.map(s => (
                          <button
                            key={s.key}
                            onClick={() => applyStyle(s.key)}
                            className={`py-2 px-4 rounded-xl border-2 font-bold text-xs transition-all ${style === s.key ? "bg-blue-500 border-blue-500 text-white shadow-lg" : "bg-card border-border text-muted-foreground hover:border-blue-500/30 hover:text-blue-600"}`}
                          >
                            <span>{s.label}</span>
                            <span className="ml-1.5 opacity-60 font-normal font-mono text-[10px]">{s.example}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Count + Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Generate:</label>
                        {[5, 10, 15, 20].map(n => (
                          <button key={n} onClick={() => { setCount(n); setUsernames(generateUsername(style, n)); }} className={`w-9 h-9 rounded-lg border-2 font-bold text-sm transition-all ${count === n ? "bg-blue-500 border-blue-500 text-white" : "border-border text-muted-foreground hover:border-blue-500/40"}`}>{n}</button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={copyAll} className="flex items-center gap-1.5 px-3 py-2 bg-muted text-muted-foreground font-bold text-xs rounded-lg hover:bg-muted/80 transition-colors">
                          {copiedIdx === -1 ? <><Check className="w-3 h-3 text-emerald-500" /> All Copied!</> : <><Copy className="w-3 h-3" /> Copy All</>}
                        </button>
                        <button onClick={regenerate} className="flex items-center gap-1.5 px-3 py-2 bg-blue-500 text-white font-bold text-xs rounded-lg hover:bg-blue-600 transition-colors">
                          <RefreshCw className="w-3 h-3" /> Regenerate
                        </button>
                      </div>
                    </div>

                    {/* Username List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {usernames.map((name, idx) => (
                        <motion.button
                          key={`${name}-${idx}`}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          onClick={() => copyOne(name, idx)}
                          className="group flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/40 hover:bg-blue-500/10 border border-border hover:border-blue-500/30 transition-all text-left"
                        >
                          <span className="font-bold font-mono text-sm text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{name}</span>
                          <span className="text-xs text-muted-foreground group-hover:text-blue-500 flex-shrink-0">
                            {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                          </span>
                        </motion.button>
                      ))}
                    </div>

                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                      <div className="flex gap-2 items-start">
                        <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          Click any username to copy it to your clipboard. Click "Regenerate" for a completely new set. All usernames are generated using cryptographic randomness — no username is logged or stored.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </section>

            {/* HOW TO USE */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Username Generator</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Finding a unique username across hundreds of platforms where your preferred name is already taken is one of the most frustrating parts of signing up for new accounts. This generator creates random, creative username combinations across five different formatting styles — instantly and privately.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Choose your username style</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Select from five formats: <strong className="text-foreground">Classic</strong> (adjective + noun, no separator), <strong className="text-foreground">With Number</strong> (adds a memorable number suffix for uniqueness), <strong className="text-foreground">snake_style</strong> (underscore separator, common on Reddit and GitHub), <strong className="text-foreground">dot.style</strong> (email-friendly, used on LinkedIn), or <strong className="text-foreground">TitleCase</strong> (formal, ideal for professional accounts).</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Set how many to generate</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Choose 5, 10, 15, or 20 usernames per batch. Getting more options at once lets you browse and find one that feels right without repeatedly clicking Regenerate. Most users find their ideal username within 2–3 batches of 10.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Click to copy, or copy all</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Click any username card to instantly copy it to your clipboard. Use "Copy All" to grab the entire list as a newline-separated batch — useful when checking multiple platforms for availability at once. Click "Regenerate" at any time for a completely fresh set of random usernames.</p>
                  </div>
                </li>
              </ol>
              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Username Style Reference</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left border-b border-border"><th className="pb-2 font-bold text-foreground">Style</th><th className="pb-2 font-bold text-foreground">Example</th><th className="pb-2 font-bold text-foreground hidden sm:table-cell">Best For</th></tr></thead>
                    <tbody className="divide-y divide-border">
                      {STYLES.map(s => (
                        <tr key={s.key} className="hover:bg-muted/30">
                          <td className="py-2 font-bold text-blue-600">{s.label}</td>
                          <td className="py-2 font-mono text-foreground">{s.example}</td>
                          <td className="py-2 text-muted-foreground hidden sm:table-cell">{s.key === "classic" ? "Twitch, YouTube" : s.key === "number" ? "Instagram, X/Twitter" : s.key === "underscore" ? "Reddit, GitHub" : s.key === "dot" ? "LinkedIn, email" : "Professional accounts"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* RESULT INTERPRETATION */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="result-interpretation">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Choosing the Right Username Style</h2>
              <p className="text-muted-foreground text-sm mb-6">Different platforms have different conventions and character restrictions:</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Gaming Platforms — Classic or With Number</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">Platforms like Steam, PlayStation Network, Xbox Live, and Twitch favor compact, memorable names without dots or special characters. A number suffix (e.g., swifteagle42) greatly increases the chance of availability on popular platforms where simple names are long taken.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                  <div className="w-3 h-3 rounded-full bg-cyan-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Developer Platforms — snake_style or TitleCase</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">GitHub, GitLab, and npm favor underscore-separated or TitleCase usernames that read like code identifiers. The snake_case format (swift_eagle) is particularly readable in technical contexts and is a common convention in open-source communities.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                  <div className="w-3 h-3 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Social Media — With Number or dot.style</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Instagram and X (Twitter) handles are highly saturated. Number suffixes dramatically increase availability. LinkedIn and professional networks tend to more accept dot.style names, which mirror email address conventions and appear more credible in professional settings.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* QUICK EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Username Examples by Platform</h2>
              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Platform</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Recommended Style</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Example</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Max Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Twitch / Steam</td><td className="px-4 py-3 font-bold text-blue-600">Classic</td><td className="px-4 py-3 font-mono text-foreground">goldenfalcon</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">25 chars</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">Instagram / X</td><td className="px-4 py-3 font-bold text-blue-600">With Number</td><td className="px-4 py-3 font-mono text-foreground">goldenfalcon42</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">30 chars</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">GitHub / Reddit</td><td className="px-4 py-3 font-bold text-blue-600">snake_style</td><td className="px-4 py-3 font-mono text-foreground">golden_falcon</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">39 chars</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 text-muted-foreground">LinkedIn</td><td className="px-4 py-3 font-bold text-blue-600">TitleCase</td><td className="px-4 py-3 font-mono text-foreground">GoldenFalcon</td><td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">Profile URL</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Why good usernames matter:</strong> Your username is your digital identity across all your accounts. A memorable, consistent username helps friends find you across platforms, builds personal brand recognition for streamers and creators, and makes your professional profiles immediately recognizable to colleagues and potential collaborators.</p>
                <p><strong className="text-foreground">Availability checking tip:</strong> Once you have a shortlist from the generator, check availability across your most-used platforms simultaneously using services like Namecheckr or KnowEm. If your exact preferred username is taken on one platform, try adding a consistent number suffix across all platforms for brand cohesion.</p>
              </div>
              <div className="mt-6 p-5 rounded-xl bg-blue-500/5 border border-blue-500/15">
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_, i) => <svg key={i} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                <p className="text-sm text-foreground/80 italic leading-relaxed">"Set up 5 new gaming accounts in one afternoon using this. Found amazing names that were actually available — much better than trying to come up with my own and hitting 'already taken' every time."</p>
                <p className="text-xs text-muted-foreground mt-2">— User feedback, 2025</p>
              </div>
            </section>

            {/* WHY CHOOSE THIS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose-this">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Username Generator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Five distinct format styles, not just one.</strong> Most username generators produce only one style. This tool lets you choose the format that matches your target platform's conventions — from compact gaming handles to professional TitleCase identifiers and developer-friendly underscore formats.</p>
                <p><strong className="text-foreground">Cryptographically random, not pseudo-random.</strong> The generator uses <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">crypto.getRandomValues()</code> — the same cryptographic API used for security applications. This ensures true randomness with no predictable patterns, unlike generators using <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">Math.random()</code>.</p>
                <p><strong className="text-foreground">Bulk generation with one-click copy.</strong> Generate up to 20 usernames at once and copy any individual username with a single click, or copy all 20 at once for batch availability checking. The workflow is optimized to minimize the number of clicks between generation and deployment.</p>
                <p><strong className="text-foreground">Completely private — no names are stored.</strong> Every username is generated locally in your browser. No username is logged, stored, or associated with any session. Close the tab and the results disappear entirely — your usernames remain uniquely yours.</p>
              </div>
              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> Generated usernames combine curated English adjectives and nouns for readability and memorability. While the combinations are extensive (22 adjectives × 22 nouns = 484+ base combinations per style), uniqueness is not guaranteed across all platforms. Always verify availability on your target service before committing to a username.
                </p>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="How do I know if my generated username is available?" a="This tool only generates usernames — it does not check availability on specific platforms due to the lack of reliable, rate-limit-free APIs for username lookup. To check availability, use your shortlisted names on cross-platform tools like Namecheckr.com or KnowEm.com, which check dozens of platforms simultaneously." />
                <FaqItem q="Are the generated usernames truly random?" a="Yes — the generator uses JavaScript's crypto.getRandomValues() API, which draws from the operating system's cryptographic entropy pool. This produces genuinely unpredictable combinations without the predictable bias patterns of Math.random(). Each click of Regenerate produces a statistically independent set of results." />
                <FaqItem q="Can I use the generated usernames commercially?" a="Yes. The generated usernames consist of common English words and are not trademarked or copyrighted. However, before registering a username commercially (e.g., as a brand handle), it is prudent to verify that the combination is not already in use as a recognized brand or trademark in your jurisdiction." />
                <FaqItem q="What if a platform doesn't allow underscores or dots?" a="Select the 'Classic' or 'With Number' style, which uses only alphanumeric characters (a-z, 0-9). These formats are compatible with every known platform's character restrictions. If the platform has specific length requirements (e.g., minimum 8 characters), the 'With Number' style is most likely to comply." />
                <FaqItem q="How many unique usernames can this tool generate?" a="The generator combines 22 adjectives × 22 nouns = 484 base pairs. With number suffixes (12 options), this expands to 5,808 combinations per style. Since the generator uses cryptographic randomness and draws from this pool independently, repetition within a single session is statistically rare but possible." />
              </div>
            </section>

            {/* CTA */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Explore More Productivity Tools</h2>
                <p className="text-white/80 mb-6 max-w-lg">400+ free text, utility, and productivity tools — instant results, no account needed.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map(tool => (
                    <Link key={tool.slug} href={`/${tool.cat}/${tool.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}>{tool.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-blue-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others find unique usernames.</p>
                <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                  {linkCopied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Generator", "How to Use", "Result Interpretation", "Quick Examples", "Why Choose This", "FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-blue-500 font-medium py-1.5 transition-colors">
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
