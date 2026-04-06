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
  GraduationCap,
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

interface StudentToolPageShellProps {
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
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-indigo-500/40 transition-colors">
      <button onClick={() => setOpen((value) => !value)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-indigo-500">
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

export default function StudentToolPageShell({
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
}: StudentToolPageShellProps) {
  const [copied, setCopied] = useState(false);
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
          applicationCategory: "EducationalApplication",
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
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <Link href="/category/education" className="text-muted-foreground hover:text-foreground transition-colors">
            Student &amp; Education
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-indigo-500" strokeWidth={3} />
          <span className="text-foreground">{pageHeading}</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-indigo-500/15 bg-gradient-to-br from-indigo-500/5 via-card to-violet-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            {heroIcon ?? <GraduationCap className="w-3.5 h-3.5" />}
            Student &amp; Education
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
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-full border border-indigo-500/20">
              <Zap className="w-3.5 h-3.5" /> Instant Results
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
            Category: Student &amp; Education &nbsp;·&nbsp; Last updated: April 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-violet-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-400 flex items-center justify-center flex-shrink-0 text-white">
                      {heroIcon ?? <GraduationCap className="w-4 h-4" />}
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

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{howToIntro}</p>
              <ol className="space-y-5">
                {howSteps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-foreground mb-1">{step.title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section id="formula" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">{formulaTitle}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{formulaIntro}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formulaCards.map((card) => (
                  <div key={card.label} className="rounded-xl border border-indigo-500/15 bg-indigo-500/5 p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">{card.label}</p>
                    <code className="block rounded-lg bg-background px-3 py-2 text-xs font-mono text-foreground mb-3">{card.formula}</code>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">{examplesTitle}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{examplesIntro}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {examples.map((example) => (
                  <div key={example.title} className="rounded-xl border border-border bg-muted/30 p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{example.title}</p>
                    <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-2">{example.value}</p>
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
                  <div key={section.title}>
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
              <div className="overflow-hidden rounded-2xl border border-indigo-500/15 bg-card shadow-sm">
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-400" />
                <div className="p-4">
                <h3 className="text-sm font-black uppercase tracking-tight text-foreground mb-1">Related Tools</h3>
                <p className="text-xs text-muted-foreground mb-3">Jump to the next calculator students usually need once this number is clear.</p>
                <div className="space-y-2">
                  {relatedTools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group flex items-start gap-3 rounded-xl border border-border bg-muted/25 px-3 py-3 transition-all hover:-translate-y-0.5 hover:border-indigo-500/30 hover:bg-indigo-500/5"
                    >
                      <div className="mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4"
                        style={{ background: "linear-gradient(135deg, hsl(214 70% 55%), hsl(214 75% 42%))" }}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground/70 mb-1">Study Flow</p>
                        <p className="text-sm font-bold leading-snug text-foreground group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">{tool.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="mt-1 w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-all group-hover:translate-x-0.5" />
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
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-400 text-white text-sm font-bold rounded-xl hover:-translate-y-1 active:translate-y-0.5 transition-transform"
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
                    <a key={item.href} href={item.href} className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-muted-foreground hover:bg-indigo-500/5 hover:text-indigo-500 font-medium transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 flex-shrink-0" />
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
