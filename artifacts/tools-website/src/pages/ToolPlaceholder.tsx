import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getCanonicalToolPath, getToolBySlug, getRelatedTools, getToolPath, TOOL_CATEGORIES } from "@/data/tools";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Hammer,
  HeartPulse,
  Lock,
  Shield,
  Smartphone,
  Sparkles,
  Wrench,
} from "lucide-react";

function FaqItem({ question, answer, accentClass }: { question: string; answer: string; accentClass: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <button
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{question}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`flex-shrink-0 ${accentClass}`}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 pt-1 text-muted-foreground leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CATEGORY_STYLES: Record<
  string,
  {
    hero: string;
    border: string;
    soft: string;
    accent: string;
    chip: string;
    icon: LucideIcon;
  }
> = {
  "Math & Calculators": {
    hero: "from-blue-500/8 via-card to-cyan-500/8",
    border: "border-blue-500/20",
    soft: "bg-blue-500/6",
    accent: "text-blue-600 dark:text-blue-400",
    chip: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: Calculator,
  },
  "Finance & Cost": {
    hero: "from-emerald-500/8 via-card to-green-500/8",
    border: "border-emerald-500/20",
    soft: "bg-emerald-500/6",
    accent: "text-emerald-600 dark:text-emerald-400",
    chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: Calculator,
  },
  "Health & Fitness": {
    hero: "from-rose-500/8 via-card to-orange-500/8",
    border: "border-rose-500/20",
    soft: "bg-rose-500/6",
    accent: "text-rose-600 dark:text-rose-400",
    chip: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: HeartPulse,
  },
  "Construction & DIY": {
    hero: "from-amber-500/8 via-card to-yellow-500/8",
    border: "border-amber-500/20",
    soft: "bg-amber-500/6",
    accent: "text-amber-600 dark:text-amber-400",
    chip: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    icon: Hammer,
  },
  "Time & Date": {
    hero: "from-violet-500/8 via-card to-fuchsia-500/8",
    border: "border-violet-500/20",
    soft: "bg-violet-500/6",
    accent: "text-violet-600 dark:text-violet-400",
    chip: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    icon: Clock,
  },
};

const DEFAULT_STYLE = {
  hero: "from-slate-500/8 via-card to-zinc-500/8",
  border: "border-slate-500/20",
  soft: "bg-slate-500/6",
  accent: "text-slate-700 dark:text-slate-300",
  chip: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
  icon: Wrench,
};

export default function ToolPlaceholder() {
  const params = useParams<{ slug: string }>();
  const [location, setLocation] = useLocation();
  const slug = params.slug;
  const tool = getToolBySlug(slug);
  const [copied, setCopied] = useState(false);

  const canonicalDestination = tool ? getCanonicalToolPath(tool.slug) : undefined;

  useEffect(() => {
    if (!tool || tool.implemented === false || !canonicalDestination) return;
    if (location === canonicalDestination) return;
    setLocation(canonicalDestination, { replace: true });
  }, [canonicalDestination, location, setLocation, tool]);

  if (!tool) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-black text-foreground uppercase">Tool Not Found</h1>
          <p className="text-muted-foreground mt-4 text-lg">This tool doesn&apos;t exist yet.</p>
          <Link
            href="/"
            className="inline-block mt-8 px-8 py-4 bg-primary text-primary-foreground font-black uppercase rounded-xl border-2 border-foreground hard-shadow"
          >
            Go Home
          </Link>
        </div>
      </Layout>
    );
  }

  if (tool.implemented !== false) {
    return (
      <Layout>
        <SEO
          title="Redirecting to the canonical tool page"
          description="This legacy placeholder URL now points to the live canonical tool page."
          canonical={canonicalDestination}
          noindex
        />
        <div className="min-h-screen bg-background" />
      </Layout>
    );
  }

  const related = getRelatedTools(slug, tool.category, 5);
  const category = TOOL_CATEGORIES.find((entry) => entry.name === tool.category);
  const categoryHref = category ? `/category/${category.id}` : "/";
  const styles = CATEGORY_STYLES[tool.category] ?? DEFAULT_STYLE;
  const CategoryIcon = styles.icon;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    url: `https://usonlinetools.com${getToolPath(tool.slug)}`,
    description: tool.metaDescription,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const faqItems = [
    {
      question: `What will the ${tool.title} do?`,
      answer: `${tool.title} is planned as a browser-based tool that helps you ${tool.description.toLowerCase()} The finished page will follow the same fast, no-signup workflow used by the live calculator pages.`,
    },
    {
      question: `Is the ${tool.title} free to use?`,
      answer: `Yes. Like the rest of US Online Tools, the ${tool.title} will be free to use without subscriptions, gated features, or account creation.`,
    },
    {
      question: "Will it work on mobile and desktop?",
      answer: "Yes. The page shell is already responsive, and the finished calculator will be built to work cleanly on phones, tablets, and larger screens.",
    },
    {
      question: "What can I use in the meantime?",
      answer: related.length
        ? `Until this page is complete, use the related tools shown on this page. They are the closest live alternatives in the same category.`
        : "Until this page is complete, browse the category page for other live tools with similar workflows and output patterns.",
    },
  ];

  return (
    <Layout>
      <SEO
        title={`${tool.title} - Free Online Tool`}
        description={tool.metaDescription}
        canonical={`https://usonlinetools.com${getToolPath(tool.slug)}`}
        schema={structuredData}
        noindex
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className={`w-4 h-4 mx-2 ${styles.accent}`} strokeWidth={3} />
          <Link href={categoryHref} className="text-muted-foreground hover:text-foreground transition-colors">
            {tool.category}
          </Link>
          <ChevronRight className={`w-4 h-4 mx-2 ${styles.accent}`} strokeWidth={3} />
          <span className="text-foreground">{tool.title}</span>
        </nav>

        <section
          className={`rounded-2xl overflow-hidden border bg-gradient-to-br ${styles.hero} ${styles.border} px-8 md:px-12 py-10 md:py-14 mb-10`}
        >
          <div className={`inline-flex items-center gap-1.5 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5 border ${styles.chip}`}>
            <CategoryIcon className="w-3.5 h-3.5" />
            {tool.category}
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            {tool.title}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            {tool.description} This page is still in development, but the structure is ready and the full tool will follow the same content-first pattern as the live calculator pages.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className={`inline-flex items-center gap-1.5 font-bold text-xs px-3 py-1.5 rounded-full border ${styles.chip}`}>
              <BadgeCheck className="w-3.5 h-3.5" /> Free Tool
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Page Shell Ready
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>

          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: {tool.category} | Status: In development
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section className="space-y-5">
              <div className={`rounded-2xl overflow-hidden border shadow-lg ${styles.border}`}>
                <div className="h-1.5 w-full bg-gradient-to-r from-foreground/80 via-foreground/60 to-transparent" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`w-9 h-9 rounded-xl ${styles.soft} flex items-center justify-center flex-shrink-0`}>
                      <Wrench className={`w-4 h-4 ${styles.accent}`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tool Preview</p>
                      <p className="text-sm text-muted-foreground">The final calculator will live in this section with instant browser-side results.</p>
                    </div>
                  </div>

                  <div className={`rounded-2xl border ${styles.border} ${styles.soft} p-5 md:p-6`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Input</p>
                        <div className="space-y-3">
                          <div className="h-11 rounded-xl border border-dashed border-border bg-muted/30" />
                          <div className="h-11 rounded-xl border border-dashed border-border bg-muted/30" />
                          <div className="h-11 rounded-xl border border-dashed border-border bg-muted/30" />
                        </div>
                      </div>
                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Output</p>
                        <div className="h-[124px] rounded-xl border border-dashed border-border bg-muted/30 flex items-center justify-center">
                          <span className={`text-sm font-bold uppercase tracking-wider ${styles.accent}`}>Instant results</span>
                        </div>
                      </div>
                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Actions</p>
                        <div className="space-y-3">
                          <div className="h-11 rounded-xl border border-dashed border-border bg-muted/30" />
                          <div className="h-11 rounded-xl border border-dashed border-border bg-muted/30" />
                          <div className="h-11 rounded-xl border border-dashed border-border bg-muted/30" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        href={categoryHref}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-foreground text-background font-bold text-sm"
                      >
                        Browse {tool.category}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      {related[0] && (
                        <Link
                          href={getToolPath(related[0].slug)}
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-background text-foreground font-bold text-sm"
                        >
                          Try {related[0].title}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Clear Inputs",
                  text: `The finished ${tool.title} will use a focused input flow with plain-language labels and fast validation.`,
                },
                {
                  title: "Instant Results",
                  text: "Results will update as values change, matching the quick-feedback interaction used on the better-developed pages.",
                },
                {
                  title: "Helpful Context",
                  text: "This page will include explanation blocks, usage guidance, and related tools instead of a thin utility-only layout.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-sm font-black uppercase tracking-wider text-foreground mb-2">{item.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How This Page Will Work</h2>
              <div className="space-y-4">
                {[
                  `Open ${tool.title} and enter the values or selections relevant to your task.`,
                  "See the result update instantly without page refreshes or form submissions.",
                  "Use the explanation and helper sections to understand what the output means.",
                  "Jump to related live tools if you need a nearby workflow before this one is finished.",
                ].map((text, index) => (
                  <div key={text} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${styles.chip}`}>
                      {index + 1}
                    </div>
                    <p className="text-muted-foreground leading-relaxed pt-2">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">About {tool.title}</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">{tool.title}</strong> is planned as a free browser-based utility for users who want to {tool.description.toLowerCase()}
                </p>
                <p>
                  The final version will keep the same practical structure used by stronger pages in the project: a strong hero, a focused calculator block, explanation sections, FAQ content, and internal links to related tools.
                </p>
                <p>
                  This page works as a structured holding page instead of a bare placeholder message, so users still get context and useful navigation.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Frequently Asked Questions</h2>
              {faqItems.map((item) => (
                <FaqItem
                  key={item.question}
                  question={item.question}
                  answer={item.answer}
                  accentClass={styles.accent}
                />
              ))}
            </section>
          </div>

          <div className="space-y-8">
            <div className="sticky top-28 space-y-6">
              {related.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-black tracking-tight text-foreground mb-5">Related Tools</h3>
                  <div className="space-y-3">
                    {related.map((item) => (
                      <Link
                        key={item.slug}
                        href={getToolPath(item.slug)}
                        className="group flex items-center gap-3 rounded-xl border border-border p-3 bg-background hover:bg-muted/40 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-xl ${styles.soft} flex items-center justify-center flex-shrink-0`}>
                          <ArrowRight className={`w-4 h-4 ${styles.accent}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-foreground leading-tight">{item.title}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {category && (
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-black tracking-tight text-foreground mb-2">Category</h3>
                  <Link href={categoryHref} className={`inline-flex items-center gap-2 font-bold hover:underline ${styles.accent}`}>
                    {category.name}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-sm text-muted-foreground mt-3">{category.description}</p>
                  <p className="text-xs text-muted-foreground/70 mt-3">{category.tools.length} tools listed in this category.</p>
                </div>
              )}

              <div className={`rounded-2xl border p-6 ${styles.border} ${styles.soft}`}>
                <h3 className="text-lg font-black tracking-tight text-foreground mb-2">Share This Page</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Keep this URL handy or share it with someone who may want the finished tool when it goes live.
                </p>
                <button
                  onClick={copyLink}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground text-background font-bold text-sm"
                >
                  {copied ? "Link Copied" : "Copy Link"}
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
