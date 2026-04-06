import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, BookOpen, ArrowRight,
  Zap, Smartphone, Shield, Lightbulb, Copy, Check,
  BadgeCheck, Lock, Clock, Info, Type
} from "lucide-react";

function useReadingCalc() {
  const [text, setText] = useState("");
  const [wpm, setWpm] = useState(225);

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const totalSeconds = words > 0 ? Math.round((words / wpm) * 60) : 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return { words, chars, minutes, seconds, totalSeconds };
  }, [text, wpm]);

  return { text, setText, wpm, setWpm, stats };
}

function ResultInsight({ stats }: { stats: any }) {
  if (stats.words === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-6 p-6 rounded-2xl bg-orange-500/10 border border-orange-500/20"
    >
       <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-orange-600/20">
             <Clock className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-600 mb-2">Estimated Reading Time</span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-3 leading-none">
             {stats.minutes}m {stats.seconds}s
          </h2>
          <div className="flex gap-4">
             <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                {stats.words.toLocaleString()} Words
             </div>
             <div className="w-px h-4 bg-border" />
             <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                {stats.chars.toLocaleString()} Characters
             </div>
          </div>
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
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
             <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const READ_PRESETS = [
  { label: "Slow", wpm: 150, desc: "Learning / Complex" },
  { label: "Average", wpm: 225, desc: "Casual reading" },
  { label: "Fast", wpm: 350, desc: "Scanning / Skimming" },
];

const RELATED_TOOLS = [
  { title: "Study Time Calculator", slug: "study-time-calculator", icon: <BookOpen className="w-5 h-5" /> },
  { title: "Time Duration Calculator", slug: "time-duration-calculator", icon: <Clock className="w-5 h-5" /> },
  { title: "Hourly Time Calculator", slug: "hourly-time-calculator", icon: <BadgeCheck className="w-5 h-5" /> },
];

export default function ReadingTimeCalculator() {
  const calc = useReadingCalc();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Reading Time Calculator – Estimate Content Duration Instantly"
        description="Calculate how long it takes to read any text. Accurate WPM estimates for blogs, scripts, and books. Perfect for content creators and students."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <Link href="/category/time-date" className="text-muted-foreground hover:text-foreground transition-colors">Time & Date</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-orange-500" strokeWidth={3} />
          <span className="text-foreground">Reading Time Calculator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-orange-500/15 bg-gradient-to-br from-orange-500/5 via-card to-amber-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            Content Optimization
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Reading Time Calculator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Estimate how long your audience will take to finish your draft. Perfect for bloggers, presenters, and students planning their reading time.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> WPM Pro
            </span>
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs px-3 py-1.5 rounded-full border border-orange-500/20">
              <Zap className="w-3.5 h-3.5" /> Live Counting
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            {/* Tool Widget */}
            <section className="space-y-6">
              <div className="rounded-2xl border border-orange-500/20 shadow-xl bg-card overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 to-amber-400" />
                <div className="p-6 md:p-10 space-y-8">
                  <div className="space-y-4">
                     <label className="text-xs font-black text-muted-foreground uppercase tracking-widest block">Paste Your Text Below</label>
                     <textarea 
                       className="tool-calc-input w-full min-h-[250px] p-5 font-medium leading-relaxed resize-y scrollbar-thin overflow-y-auto" 
                       placeholder="Start typing or paste your content here..."
                       value={calc.text} 
                       onChange={e => calc.setText(e.target.value)} 
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-muted/30 p-6 rounded-2xl border border-border">
                    <div className="space-y-4">
                       <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Reading Speed (WPM)</label>
                          <span className="text-sm font-black text-orange-600">{calc.wpm} <span className="text-[10px] text-muted-foreground uppercase ml-1">Words / Min</span></span>
                       </div>
                       <input 
                         type="range" 
                         min="50" 
                         max="600" 
                         step="5"
                         className="w-full accent-orange-500 h-2 rounded-full cursor-pointer bg-border"
                         value={calc.wpm} 
                         onChange={e => calc.setWpm(parseInt(e.target.value))} 
                       />
                       <div className="flex justify-between text-[10px] font-bold text-muted-foreground/60 uppercase">
                          <span>Slow</span>
                          <span>Average (225)</span>
                          <span>Speed Reader</span>
                       </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                       {READ_PRESETS.map(p => (
                         <button 
                           key={p.label}
                           onClick={() => calc.setWpm(p.wpm)}
                           className={`p-3 rounded-xl border transition-all text-center ${
                             calc.wpm === p.wpm 
                               ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20' 
                               : 'bg-card border-border text-foreground hover:border-orange-500/40'
                           }`}
                         >
                            <span className="block font-black text-xs leading-none mb-1">{p.label}</span>
                            <span className="block text-[8px] uppercase font-bold opacity-60">{p.wpm} WPM</span>
                         </button>
                       ))}
                    </div>
                  </div>

                  <ResultInsight stats={calc.stats} />
                </div>
              </div>
            </section>

            {/* Content Section */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
               <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Optimizing for the Human Eye</h2>
               <p className="text-muted-foreground leading-relaxed mb-6">
                 In the digital age, attention is currency. Knowing exactly how long it takes to read your article allows you to place "Read Time" badges on your blog, which has been shown to improve engagement and click-through rates.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                     <Type className="w-8 h-8 text-orange-600 mb-4" />
                     <h4 className="font-black text-foreground mb-2">Word Count</h4>
                     <p className="text-xs text-muted-foreground leading-relaxed">Instantly filter out whitespace and punctuation for an accurate net word count.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                     <Zap className="w-8 h-8 text-orange-600 mb-4" />
                     <h4 className="font-black text-foreground mb-2">Speech Planning</h4>
                     <p className="text-xs text-muted-foreground leading-relaxed">Average speaking rates are 130-150 WPM. Adjust the slider to plan your presentation slides.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                     <Shield className="w-8 h-8 text-orange-600 mb-4" />
                     <h4 className="font-black text-foreground mb-2">Privacy First</h4>
                     <p className="text-xs text-muted-foreground leading-relaxed">Your text remains local. We don't upload your drafts to any server — everything stays in your browser.</p>
                  </div>
               </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Reading FAQ</h2>
              <div className="space-y-3">
                <FaqItem
                  q="What is the average reading speed?"
                  a="Most adults read at a rate of 200 to 250 words per minute (WPM). When reading on digital screens, this often drops slightly due to scrolling and glare, which is why 225 WPM is our recommended baseline."
                />
                <FaqItem
                  q="How do I use this for speech timing?"
                  a="Since we speak slower than we read, set the slider to 140 WPM. This will give you a very close estimate of how long a speech written in that text will take to deliver."
                />
                <FaqItem
                  q="Does formatting affect the time?"
                  a="Technically, yes. Text with many images, bullet points, or bold headers may take longer to process mentally. Our tool focuses on the core text length as the primary metric."
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
             <div className="sticky top-28 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-4">
                   <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-2">Share Tool</h3>
                   <button
                    onClick={copyLink}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 transition-transform shadow-md"
                  >
                    {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                  </button>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5">
                   <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-4 tracking-widest">Related Tools</h3>
                   <div className="space-y-4">
                      {RELATED_TOOLS.map(t => (
                        <Link key={t.slug} href={`/time-date/${t.slug}`} className="flex items-center gap-3 group">
                           <div className="w-8 h-8 rounded bg-muted flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                              {t.icon}
                           </div>
                           <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">{t.title}</span>
                        </Link>
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
