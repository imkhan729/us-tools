import { ReactNode, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Image as ImageIcon,
  Lightbulb,
  Lock,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react";

interface HowStep {
  title: string;
  description: string;
}

interface FormulaCard {
  label: string;
  formula: string;
  detail: string;
}

interface ExampleCard {
  title: string;
  value: string;
  detail: string;
}

interface ContentSection {
  title: string;
  paragraphs: string[];
}

interface FaqItemData {
  q: string;
  a: string;
}

interface RelatedTool {
  title: string;
  href: string;
  benefit: string;
}

interface QuickFact {
  label: string;
  value: string;
  detail: string;
}

interface ImageToolPageShellProps {
  title: string;
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  heroDescription: string;
  heroIcon?: ReactNode;
  calculatorLabel: string;
  calculatorDescription: string;
  calculator: ReactNode;
  howToTitle: string;
  howToIntro: string;
  howSteps: HowStep[];
  formulaTitle: string;
  formulaIntro: string;
  formulaCards: FormulaCard[];
  examplesTitle: string;
  examplesIntro: string;
  examples: ExampleCard[];
  contentTitle: string;
  contentIntro: string;
  contentSections: ContentSection[];
  faqs: FaqItemData[];
  relatedTools: RelatedTool[];
  quickFacts: QuickFact[];
}

function FaqItem({ q, a }: FaqItemData) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-cyan-500/40 transition-colors">
      <button onClick={() => setOpen((value) => !value)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-cyan-500">
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
            <p className="px-5 pb-5 pt-4 border-t border-border text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ImageToolPageShell({
  title,
  seoTitle,
  seoDescription,
  canonical,
  heroDescription,
  heroIcon,
  calculatorLabel,
  calculatorDescription,
  calculator,
  howToTitle,
  howToIntro,
  howSteps,
  formulaTitle,
  formulaIntro,
  formulaCards,
  examplesTitle,
  examplesIntro,
  examples,
  contentTitle,
  contentIntro,
  contentSections,
  faqs,
  relatedTools,
  quickFacts,
}: ImageToolPageShellProps) {
  const [copied, setCopied] = useState(false);
  const spotlightFacts = quickFacts.slice(0, 3);
  const featuredExamples = examples.slice(0, 3);
  const pageHeading = /^online\b/i.test(title) ? title : `Online ${title}`;
  const resolvedSeoTitle = /\bonline\b/i.test(seoTitle) ? seoTitle : `Online ${seoTitle}`;

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          name: pageHeading,
          url: canonical,
          description: seoDescription,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        },
        {
          "@type": "FAQPage",
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        },
      ],
    }),
    [canonical, faqs, pageHeading, seoDescription],
  );

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const onThisPageItems = [
    { label: "Calculator", href: "#calculator" },
    { label: "Use Cases", href: "#use-cases" },
    { label: howToTitle, href: "#how-to-use" },
    { label: formulaTitle, href: "#formula" },
    { label: examplesTitle, href: "#quick-examples" },
    { label: contentTitle, href: "#why-choose-this" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <Layout>
      <SEO title={resolvedSeoTitle} description={seoDescription} canonical={canonical} schema={schema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-cyan-500" strokeWidth={3} />
          <Link href="/category/image" className="text-muted-foreground hover:text-foreground transition-colors">
            Image Tools
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-cyan-500" strokeWidth={3} />
          <span className="text-foreground">{pageHeading}</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-cyan-500/15 bg-gradient-to-br from-cyan-500/5 via-card to-blue-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            {heroIcon ?? <ImageIcon className="w-3.5 h-3.5" />}
            Image Tools
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            {pageHeading}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            {heroDescription}
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Zap className="w-3.5 h-3.5" /> Browser Based
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Shield className="w-3.5 h-3.5" /> Local Processing
            </span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>

          {spotlightFacts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              {spotlightFacts.map((fact, index) => (
                <div key={fact.label} className="rounded-2xl border border-white/10 bg-background/70 backdrop-blur-sm p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-2">
                    0{index + 1} · {fact.label}
                  </p>
                  <p className="text-xl md:text-2xl font-black text-foreground mb-1">{fact.value}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{fact.detail}</p>
                </div>
              ))}
            </div>
          ) : null}

          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Image Tools | Last updated: April 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 to-blue-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center flex-shrink-0 text-white">
                      {heroIcon ?? <ImageIcon className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{calculatorLabel}</p>
                      <p className="text-sm text-muted-foreground">{calculatorDescription}</p>
                    </div>
                  </div>
                  {calculator}
                </div>
              </div>
            </section>

            <section id="use-cases" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Use Cases</p>
                  <h2 className="text-2xl font-black text-foreground tracking-tight">What You Can Do With {title}</h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">{examplesIntro}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredExamples.map((example, index) => (
                  <div key={example.title} className="rounded-2xl border border-border bg-muted/35 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-3">
                      0{index + 1} · {example.title}
                    </p>
                    <p className="text-3xl font-black text-cyan-700 dark:text-cyan-400 mb-2">{example.value}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{example.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">{howToTitle}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{howToIntro}</p>
              <ol className="space-y-5 mb-8">
                {howSteps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-foreground mb-1">{step.title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {quickFacts.length > 0 ? (
                <div className="rounded-xl border border-border bg-muted/55 p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Before You Download</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {quickFacts.map((fact) => (
                      <div key={fact.label} className="rounded-xl border border-border bg-background p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{fact.label}</p>
                        <p className="text-base font-black text-foreground mb-1">{fact.value}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{fact.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>

            <section id="formula" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">{formulaTitle}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{formulaIntro}</p>
              <div className="rounded-xl border border-border bg-muted/55 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Core Image Rules</p>
                <div className="space-y-4">
                  {formulaCards.map((card, index) => (
                    <div key={card.label} className="flex gap-3 items-start">
                      <span className="w-6 h-6 rounded-md bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                        {index + 1}
                      </span>
                      <div className="flex-1 rounded-xl border border-border bg-background p-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400 mb-2">{card.label}</p>
                        <code className="block rounded-lg bg-muted/60 px-3 py-2 text-xs font-mono text-foreground mb-3">{card.formula}</code>
                        <p className="text-sm text-muted-foreground leading-relaxed">{card.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">{examplesTitle}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{examplesIntro}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {examples.map((example, index) => (
                  <div key={example.title} className="rounded-2xl border border-border bg-muted/30 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground mb-2">
                      Example {index + 1} · {example.title}
                    </p>
                    <p className="text-3xl font-black text-cyan-700 dark:text-cyan-400 mb-2">{example.value}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{example.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">{contentTitle}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{contentIntro}</p>
              <div className="space-y-6">
                {contentSections.map((section) => (
                  <div key={section.title} className="border-l-2 border-cyan-500/20 pl-5">
                    <h3 className="text-lg font-bold text-foreground mb-2">{section.title}</h3>
                    <div className="space-y-3">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="text-sm text-muted-foreground leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="faq" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqs.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1 space-y-8 lg:sticky lg:top-24 self-start">
            <div className="sticky top-24 space-y-6">
              <div className="overflow-hidden rounded-2xl border border-cyan-500/15 bg-card shadow-sm">
                <div className="h-1 w-full bg-gradient-to-r from-cyan-500 to-blue-400" />
                <div className="p-4">
                <h3 className="text-sm font-black uppercase tracking-tight text-foreground mb-1">Related Tools</h3>
                <p className="text-xs text-muted-foreground mb-3">Stay in the same image workflow for resize, cleanup, export, and publish prep.</p>
                <div className="space-y-2">
                  {relatedTools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group flex items-start gap-3 rounded-xl border border-border bg-muted/25 px-3 py-3 transition-all hover:-translate-y-0.5 hover:border-cyan-500/30 hover:bg-cyan-500/5"
                    >
                      <div className="mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4"
                        style={{ background: "linear-gradient(135deg, hsl(180 70% 55%), hsl(180 75% 42%))" }}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground/70 mb-1">Image Workflow</p>
                        <p className="text-sm font-bold leading-snug text-foreground group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">{tool.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="mt-1 w-4 h-4 text-muted-foreground group-hover:text-cyan-500 flex-shrink-0 transition-all group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="p-4">
                <h3 className="text-sm font-black uppercase tracking-tight text-foreground mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Help others calculate faster and share this page.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-400 text-white text-sm font-bold rounded-xl hover:-translate-y-1 active:translate-y-0.5 transition-transform"
                >
                  {copied ? (
                    <><Check className="w-3.5 h-3.5" /> Copied!</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> Copy Link</>
                  )}
                </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="p-4">
                <h3 className="text-sm font-black uppercase tracking-tight text-foreground mb-3">On This Page</h3>
                <div className="space-y-1">
                  {onThisPageItems.map((item) => (
                    <a key={item.href} href={item.href} className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-muted-foreground hover:bg-cyan-500/5 hover:text-cyan-500 font-medium transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 flex-shrink-0" />
                      {item.label}
                    </a>
                  ))}
                </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
