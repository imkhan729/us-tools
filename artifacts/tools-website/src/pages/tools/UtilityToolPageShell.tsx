import { ReactNode, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getToolPath } from "@/data/tools";
import { ToolRightSidebar } from "@/components/ToolRightSidebar";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Lock,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react";

interface HowStep {
  title: string;
  description: string;
}

interface InterpretationCard {
  title: string;
  description: string;
  className?: string;
}

interface ExampleRow {
  scenario: string;
  input: string;
  output: string;
}

interface FaqItemData {
  q: string;
  a: string;
}

interface RelatedTool {
  title: string;
  slug: string;
  href?: string;
  icon: ReactNode;
  color: number;
  benefit: string;
}

interface UtilityToolPageShellProps {
  title: string;
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  categoryName: string;
  categoryHref: string;
  heroDescription: string;
  heroIcon: ReactNode;
  calculatorLabel: string;
  calculatorDescription: string;
  calculator: ReactNode;
  howSteps: HowStep[];
  interpretationCards: InterpretationCard[];
  examples: ExampleRow[];
  whyChoosePoints: string[];
  faqs: FaqItemData[];
  relatedTools: RelatedTool[];
  ctaTitle?: string;
  ctaDescription?: string;
  ctaHref?: string;
}

function FaqItem({ q, a }: FaqItemData) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-blue-500/40 transition-colors">
      <button onClick={() => setOpen((value) => !value)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-blue-500">
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

export default function UtilityToolPageShell({
  title,
  seoTitle,
  seoDescription,
  canonical,
  categoryName,
  categoryHref,
  heroDescription,
  heroIcon,
  calculatorLabel,
  calculatorDescription,
  calculator,
  howSteps,
  interpretationCards,
  examples,
  whyChoosePoints,
  faqs,
  relatedTools,
  ctaTitle = "Need More Tools?",
  ctaDescription = "Explore more utilities across this hub.",
  ctaHref = "/",
}: UtilityToolPageShellProps) {
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
          applicationCategory: "UtilityApplication",
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

  const onThisPageItems = [
    { label: "Calculator", href: "#calculator" },
    { label: "How to Use", href: "#how-to-use" },
    { label: "Result Interpretation", href: "#result-interpretation" },
    { label: "Quick Examples", href: "#quick-examples" },
    { label: "Why Choose This", href: "#why-choose-this" },
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
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <Link href={categoryHref} className="text-muted-foreground hover:text-foreground transition-colors">
            {categoryName}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-blue-500" strokeWidth={3} />
          <span className="text-foreground">{pageHeading}</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-blue-500/15 bg-gradient-to-br from-blue-500/5 via-card to-cyan-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            {heroIcon}
            {categoryName}
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-4xl">{pageHeading}</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-3xl">{heroDescription}</p>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs px-3 py-1.5 rounded-full border border-blue-500/20">
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

          <p className="text-xs text-muted-foreground/60 font-medium">Category: {categoryName} | Last updated: April 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 min-w-0 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0 text-white">
                      {heroIcon}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{calculatorLabel}</p>
                      <p className="text-sm text-muted-foreground">{calculatorDescription}</p>
                    </div>
                  </div>
                  <div className="min-w-0 overflow-x-auto rounded-[1.35rem] border border-border/80 bg-gradient-to-br from-background via-card to-blue-500/5 p-4 md:p-5 shadow-[inset_0_1px_0_hsl(0_0%_100%_/_0.55)]">
                    {calculator}
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use {title}</h2>
              <ol className="space-y-5">
                {howSteps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-foreground mb-1">{step.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Result Interpretation</h2>
              <p className="text-sm text-muted-foreground mb-6">Use these checks to understand the output correctly.</p>
              <div className="space-y-3">
                {interpretationCards.map((card) => (
                  <div key={card.title} className={`p-4 rounded-xl border ${card.className ?? "bg-blue-500/5 border-blue-500/20"}`}>
                    <p className="font-bold text-foreground mb-1">{card.title}</p>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Scenario</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Input</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Output</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {examples.map((row) => (
                      <tr key={`${row.scenario}-${row.input}`}>
                        <td className="px-4 py-3 text-muted-foreground">{row.scenario}</td>
                        <td className="px-4 py-3 font-mono text-foreground">{row.input}</td>
                        <td className="px-4 py-3 font-bold text-blue-600">{row.output}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Choose This Tool?</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                {whyChoosePoints.map((point) => (
                  <p key={point}>{point}</p>
                ))}
              </div>
            </section>

            <section id="faq" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqs.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black mb-2">{ctaTitle}</h2>
                <p className="text-white/80 mb-6 max-w-lg">{ctaDescription}</p>
                <Link href={ctaHref} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl">
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          <ToolRightSidebar
            relatedTools={relatedTools.map((tool) => ({
              title: tool.title,
              href: tool.href ?? getToolPath(tool.slug),
              benefit: tool.benefit,
              icon: tool.icon,
              color: tool.color,
            }))}
            onThisPageItems={onThisPageItems}
          />
        </div>
      </div>
    </Layout>
  );
}
