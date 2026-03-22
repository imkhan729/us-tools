import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, ArrowRight,
  Zap, CheckCircle2, Smartphone, Shield, Clock,
  MessageCircle, Lightbulb, Copy, Check, Type,
  AlignLeft, Hash, FileText, AtSign,
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

const PLATFORM_LIMITS = [
  { name: "Twitter/X Post", limit: 280, icon: "𝕏" },
  { name: "Twitter/X DM", limit: 10000, icon: "✉️" },
  { name: "Instagram Caption", limit: 2200, icon: "📸" },
  { name: "LinkedIn Post", limit: 3000, icon: "💼" },
  { name: "Facebook Post", limit: 63206, icon: "📘" },
  { name: "YouTube Title", limit: 100, icon: "▶️" },
  { name: "TikTok Caption", limit: 2200, icon: "🎵" },
  { name: "Pinterest Pin", limit: 500, icon: "📌" },
];

const RELATED_TOOLS = [
  { title: "Word Counter", slug: "word-counter", icon: <AlignLeft className="w-5 h-5" />, color: 217 },
  { title: "Lorem Ipsum Generator", slug: "lorem-ipsum-generator", icon: <FileText className="w-5 h-5" />, color: 152 },
  { title: "Meta Tag Generator", slug: "meta-tag-generator", icon: <Hash className="w-5 h-5" />, color: 340 },
  { title: "Password Generator", slug: "password-generator", icon: <Type className="w-5 h-5" />, color: 25 },
  { title: "Base64 Encoder/Decoder", slug: "base64-encoder-decoder", icon: <AtSign className="w-5 h-5" />, color: 265 },
  { title: "JSON Formatter", slug: "json-formatter", icon: <MessageCircle className="w-5 h-5" />, color: 45 },
];

export default function TwitterCharacterCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const stats = useMemo(() => {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const hashtags = (text.match(/#\w+/g) || []).length;
    const mentions = (text.match(/@\w+/g) || []).length;
    const urls = (text.match(/https?:\/\/\S+/g) || []).length;
    const emojis = (text.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []).length;
    const remaining = 280 - chars;
    return { chars, words, sentences, hashtags, mentions, urls, emojis, remaining };
  }, [text]);

  const isOverLimit = stats.remaining < 0;
  const percent = Math.min((stats.chars / 280) * 100, 100);

  return (
    <Layout>
      <SEO
        title="Twitter Character Counter - Free Online Tool | Count Characters for X Posts"
        description="Free Twitter/X character counter. Check your post length against the 280-character limit. Count words, hashtags, mentions, and more. Track all social media limits."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <Link href="/category/social-media" className="text-muted-foreground hover:text-foreground transition-colors">Social Media</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
          <span className="text-foreground">Twitter Character Counter</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            <section>
              <div className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <MessageCircle className="w-3.5 h-3.5" /> Social Media Tools
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-3">Twitter Character Counter</h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Count characters for Twitter/X posts, track the 280-character limit, and check compatibility with all major social media platforms — free, instant, and private.
              </p>
            </section>

            <section className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Zap className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="font-bold text-foreground text-sm">Real-time counting</p>
                <p className="text-muted-foreground text-sm">Start typing below — character count updates instantly as you type.</p>
              </div>
            </section>

            <section className="space-y-5">
              <div className="tool-calc-card" style={{ "--calc-hue": 195 } as React.CSSProperties}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="tool-calc-number">1</div>
                  <h3 className="text-lg font-bold text-foreground">Twitter/X Character Counter</h3>
                </div>

                <div className="mb-4">
                  <textarea
                    rows={6}
                    placeholder="Type or paste your tweet here..."
                    className="tool-calc-input w-full resize-y text-base"
                    value={text}
                    onChange={e => setText(e.target.value)}
                  />
                </div>

                {/* Progress bar */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-sm font-bold ${isOverLimit ? "text-red-500" : stats.remaining <= 20 ? "text-amber-500" : "text-emerald-500"}`}>
                      {isOverLimit ? `${Math.abs(stats.remaining)} over limit` : `${stats.remaining} characters remaining`}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">{stats.chars}/280</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      className={`h-full rounded-full transition-colors ${isOverLimit ? "bg-red-500" : stats.remaining <= 20 ? "bg-amber-500" : "bg-emerald-500"}`}
                    />
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">Characters</div>
                    <div className="text-lg font-black text-foreground">{stats.chars}</div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">Words</div>
                    <div className="text-lg font-black text-foreground">{stats.words}</div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">Hashtags</div>
                    <div className="text-lg font-black text-foreground">{stats.hashtags}</div>
                  </div>
                  <div className="tool-calc-result text-center">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">Mentions</div>
                    <div className="text-lg font-black text-foreground">{stats.mentions}</div>
                  </div>
                </div>

                {/* Platform compatibility */}
                {text && (
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-3">Platform Compatibility</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PLATFORM_LIMITS.map(p => {
                        const fits = stats.chars <= p.limit;
                        return (
                          <div key={p.name} className={`p-2.5 rounded-lg text-center text-xs font-semibold border ${fits ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-red-500/5 border-red-500/20 text-red-600 dark:text-red-400"}`}>
                            <div className="text-base mb-0.5">{p.icon}</div>
                            <div className="truncate">{p.name}</div>
                            <div className="text-[10px] opacity-70">{fits ? "✓" : "✗"} {p.limit}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {text && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex gap-2 items-start">
                      <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        Your text has {stats.chars} characters, {stats.words} words{stats.hashtags > 0 ? `, ${stats.hashtags} hashtag${stats.hashtags !== 1 ? "s" : ""}` : ""}{stats.mentions > 0 ? `, ${stats.mentions} mention${stats.mentions !== 1 ? "s" : ""}` : ""}. {isOverLimit ? `It exceeds the Twitter/X limit by ${Math.abs(stats.remaining)} characters.` : `It fits within the Twitter/X 280-character limit with ${stats.remaining} characters to spare.`}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Social Media Character Limits (2024)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-bold text-foreground">Platform</th>
                      <th className="text-left py-3 px-4 font-bold text-foreground">Post Type</th>
                      <th className="text-right py-3 px-4 font-bold text-foreground">Character Limit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PLATFORM_LIMITS.map(p => (
                      <tr key={p.name} className="border-b border-border/50">
                        <td className="py-3 px-4 text-foreground font-medium">{p.icon} {p.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">Standard post</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-foreground">{p.limit.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Why Use This Tool?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <Zap className="w-4 h-4" />, text: "Real-time character counting as you type" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Multi-platform compatibility check" },
                  { icon: <Shield className="w-4 h-4" />, text: "Counts hashtags, mentions, and URLs" },
                  { icon: <Smartphone className="w-4 h-4" />, text: "Works on all devices and browsers" },
                  { icon: <Clock className="w-4 h-4" />, text: "No signup or downloads needed" },
                  { icon: <MessageCircle className="w-4 h-4" />, text: "Visual progress bar for limits" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">Twitter/X Character Limit Guide</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>Twitter (now X) imposes a 280-character limit on standard posts. This limit was doubled from the original 140 characters in November 2017. Understanding and optimizing your character usage is essential for effective social media communication and engagement.</p>
                <p>This free Twitter character counter helps social media managers, content creators, and marketers craft the perfect post. It tracks characters, words, hashtags, mentions, and checks compatibility with 8 major social media platforms simultaneously.</p>
                <h3 className="text-xl font-bold text-foreground pt-2">Tips for Writing Effective Tweets</h3>
                <ul className="space-y-2 ml-1">
                  {[
                    "Keep tweets under 280 characters — shorter tweets (under 100 chars) get 17% more engagement",
                    "Use 1-2 relevant hashtags for discoverability without cluttering",
                    "Include a clear call-to-action to drive engagement",
                    "Use thread format for longer content that exceeds the limit",
                    "Emojis count as 2 characters each in Twitter's system",
                    "URLs are automatically shortened to 23 characters by Twitter",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" /><span>{item}</span></li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is the Twitter/X character limit?" a="Twitter/X allows 280 characters per standard post. X Premium subscribers can post up to 25,000 characters. Direct messages support up to 10,000 characters." />
                <FaqItem q="Do URLs count toward the character limit?" a="Yes, but Twitter automatically shortens all URLs to 23 characters regardless of the original length. This applies to both http and https URLs." />
                <FaqItem q="Do emojis count as one character?" a="On Twitter, most emojis count as 2 characters because they use Unicode surrogate pairs. Some complex emojis (like flags or skin-toned emojis) can count as even more." />
                <FaqItem q="How many hashtags should I use?" a="Twitter recommends 1-2 relevant hashtags per tweet. Research shows that tweets with 1-2 hashtags get 21% more engagement than those with 3 or more." />
                <FaqItem q="Is this tool free?" a="100% free with no ads, no signup, and no data tracking. Type your post and see the character count instantly." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">More Social Media & Content Tools</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-lg">Try our word counter, meta tag generator, and 400+ more free tools for content creators.</p>
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
                <p className="text-sm text-muted-foreground mb-4">Help others count characters for social media.</p>
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
