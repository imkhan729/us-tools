import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Check, ArrowRight,
  Zap, Smartphone, Shield, Copy, Twitter, Info,
  BadgeCheck, MessageSquare, AlertTriangle, RefreshCcw, Eraser
} from "lucide-react";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-sky-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-sky-500">
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

const RELATED = [
  { title: "Word Counter",       slug: "word-counter",             cat: "productivity", icon: <MessageSquare className="w-5 h-5" />, color: 200, benefit: "Count specific words and reading time" },
  { title: "Hashtag Generator",  slug: "hashtag-generator",        cat: "productivity", icon: <BadgeCheck className="w-5 h-5" />,    color: 25,  benefit: "Generate trending hashtags instantly" },
  { title: "Duplicate Remover",  slug: "duplicate-line-remover",   cat: "productivity", icon: <Info className="w-5 h-5" />,          color: 20,  benefit: "Remove text duplicates automatically" },
];

export default function TwitterCharacterCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  // X (Twitter) logic:
  // Standard limits: 280 characters for normal users, 10,000 for Twitter Blue / X Premium
  const MAX_LIMIT = 280;
  const PREMIUM_LIMIT = 10000;

  const count = useMemo(() => {
    // Basic counting. Twitter counts URLs as 23 characters regardless of length.
    // For a simple browser tool, we'll do raw character count with a note, 
    // or a simple regex to replace http://... with 23 spaces for counting.
    let countText = text;

    // Advanced URL substitution (approx): replace any generic http/https block with 23 chars
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    countText = countText.replace(urlRegex, '12345678901234567890123');
    
    // Emojis count as 2 chars in JS by default due to surrogate pairs, Twitter counts them differently 
    // in V2 API but for standard visual counting, raw string split or Array.from is closer to Twitter's visual count.
    const chars = Array.from(countText).length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    
    return {
      chars,
      words,
      remainingStandard: MAX_LIMIT - chars,
      remainingPremium: PREMIUM_LIMIT - chars,
      percentStandard: Math.min(100, (chars / MAX_LIMIT) * 100),
      percentPremium: Math.min(100, (chars / PREMIUM_LIMIT) * 100)
    };
  }, [text]);

  const copyResult = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  
  const clearText = () => setText("");

  return (
    <Layout>
      <SEO
        title="Twitter/X Character Counter – Check 280 Limit | US Online Tools"
        description="Free online Twitter/X character counter. Check your tweet length, calculate remaining characters for the 280 limit, and optimize your tweets with built-in URL logic."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-sky-500" strokeWidth={3} />
          <Link href="/category/social-media" className="text-muted-foreground hover:text-foreground transition-colors">Social Media Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-sky-500" strokeWidth={3} />
          <span className="text-foreground">Twitter/X Character Counter</span>
        </nav>

        {/* HERO */}
        <section className="rounded-2xl overflow-hidden border border-sky-500/15 bg-gradient-to-br from-sky-500/5 via-card to-blue-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Twitter className="w-3.5 h-3.5" /> Social Media Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">Twitter Character Counter</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Never hit the tweet length error again. Paste your draft to see exactly how many characters you're using. We accurately track X's specific character limits.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs px-3 py-1.5 rounded-full border border-sky-500/20"><Zap className="w-3.5 h-3.5" /> Live Updates</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Shield className="w-3.5 h-3.5" /> Client-Side Privacy</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* TOOL WIDGET */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-sky-500/20 shadow-lg shadow-sky-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-sky-500 to-blue-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-400 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tweet Length Evaluator</p>
                      </div>
                    </div>
                    
                    <button onClick={clearText} className="text-xs font-bold text-muted-foreground hover:text-rose-500 transition-colors bg-muted px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <Eraser className="w-3.5 h-3.5" /> Clear Input
                    </button>
                  </div>

                  <div className="tool-calc-card" style={{ "--calc-hue": 200 } as React.CSSProperties}>
                    <div className="relative mb-6">
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What is happening?!"
                        className={`w-full h-40 md:h-56 p-5 rounded-2xl font-sans text-lg bg-background border-2 border-border focus:border-sky-500 outline-none resize-none transition-all ${count.remainingStandard < 0 ? 'focus:border-rose-500 border-rose-500/50' : ''}`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                       {/* Standard X limit panel */}
                       <div className={`p-5 rounded-xl border-2 transition-colors ${count.remainingStandard < 0 ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400' : 'bg-card border-border hover:border-sky-500/40 text-foreground'}`}>
                         <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Standard Tweet Limit</p>
                         <p className="text-5xl font-black tracking-tight mb-2">
                            {count.remainingStandard}
                         </p>
                         <p className="text-sm font-medium opacity-80">
                           {count.chars} / 280 used
                         </p>
                         <div className="w-full h-1.5 bg-muted rounded-full mt-4 overflow-hidden">
                           <div className={`h-full transition-all ${count.remainingStandard < 0 ? 'bg-rose-500' : count.remainingStandard < 20 ? 'bg-amber-500' : 'bg-sky-500'}`} style={{ width: `${Math.min(100, count.percentStandard)}%` }} />
                         </div>
                       </div>
                       
                       {/* X Premium limit panel */}
                       <div className="p-5 rounded-xl border-2 border-border bg-card text-foreground opacity-90">
                         <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2 flex items-center justify-center gap-1.5"><BadgeCheck className="w-3 h-3 text-sky-500"/> X Premium (Blue)</p>
                         <p className="text-5xl font-black tracking-tight mb-2">
                            {count.remainingPremium.toLocaleString()}
                         </p>
                         <p className="text-sm font-medium opacity-80">
                           {count.chars.toLocaleString()} / 10,000 used
                         </p>
                         <div className="w-full h-1.5 bg-muted rounded-full mt-4 overflow-hidden">
                           <div className="h-full bg-sky-500 transition-all" style={{ width: `${count.percentPremium}%` }} />
                         </div>
                       </div>
                    </div>
                    
                    <button onClick={copyResult} className="w-full mt-6 py-4 bg-sky-500 text-white font-bold text-sm rounded-xl hover:bg-sky-600 transition-colors flex items-center justify-center gap-2">
                       {copied ? <><Check className="w-4 h-4" /> Copied Text!</> : <><Copy className="w-4 h-4" /> Copy Tweet to Clipboard</>}
                    </button>
                    
                    <div className="mt-4 flex items-center gap-2 bg-amber-500/5 p-3 rounded-lg border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <p><strong>Note:</strong> We automatically account for URLs (weighing 23 characters globally on X), but advanced nested Emoji combinations may slightly vary from X's internal counter.</p>
                    </div>

                  </div>
                </div>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How Twitter Character Counting Works</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Twitter/X uses a highly specific backend algorithm to count characters, preventing users from overwhelming the feed while still allowing for rich media sharing.
              </p>
              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Standard vs Premium Lengths</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Free X accounts are restricted to exactly 280 characters. However, users subscribed to X Premium (formerly Twitter Blue) can write monolithic long-form posts spanning up to 10,000 characters.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">URLs and Links (The 23-Character Rule)</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Regardless of how long a hyperlink is (even if it's 150 characters long), Twitter's `t.co` link shortener automatically truncates its weight. In our tool and on the platform, any URL uniformly takes up exactly 23 characters of your limit.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Media and Images</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Historically, attaching an image or GIF would deduct 24 characters from your total. Twitter permanently reversed this policy. Media attachments no longer consume character counts.</p>
                  </div>
                </li>
              </ol>
            </section>

            {/* QUICK EXAMPLES */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="quick-examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Tweet Strategy Reference Guide</h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60"><th className="text-left px-4 py-3 font-bold text-foreground">Content Type</th><th className="text-left px-4 py-3 font-bold text-foreground">Ideal Length</th><th className="text-left px-4 py-3 font-bold text-foreground">Why It Matters</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-medium text-foreground">Promotional Link Tweet</td><td className="px-4 py-3 text-emerald-500 font-bold">100 - 120 Characters</td><td className="px-4 py-3 text-muted-foreground">Short text draws the eyes immediately to the link attachment. High CTR.</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-medium text-foreground">Thread Hook (1/x)</td><td className="px-4 py-3 text-emerald-500 font-bold">200 - 250 Characters</td><td className="px-4 py-3 text-muted-foreground">Allows maximal screen real-estate to sell the "click to read more" premise.</td></tr>
                    <tr className="hover:bg-muted/30"><td className="px-4 py-3 font-medium text-foreground">X Premium Long Form</td><td className="px-4 py-3 text-emerald-500 font-bold">1,000+ Characters</td><td className="px-4 py-3 text-muted-foreground">Bypasses the thread UX, increasing read-times directly on a single post.</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">FAQ</h2>
              <div className="space-y-3">
                <FaqItem q="How many characters in a Tweet?" a="Standard free-tier users have exactly 280 characters to utilize per tweet. Threads can circumvent this, but each node in a thread is capped at 280. Verified X Premium accounts have a cap of 10,000." />
                <FaqItem q="Do hashtags count towards my tweet limit?" a="Yes, hashtags count identically to regular alphabetical letters. A `#` takes up 1 character, and the word following it takes up standard characters." />
                <FaqItem q="Why are my Japanese or Chinese characters reducing the count faster?" a="Asian linguistic characters (CJK scripts) structurally take up '2 characters' of space internally in Twitter's backend due to encoding complexities. Standard tweets using CJK are restricted roughly to 140 CJK characters." />
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
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-sky-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["Evaluator","How to Use", "Quick Examples", "FAQ"].map(label => (
                    <a key={label} href={`#${label.toLowerCase().replace(/\s/g,"-")}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-sky-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-sky-500/40 flex-shrink-0" />{label}
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
