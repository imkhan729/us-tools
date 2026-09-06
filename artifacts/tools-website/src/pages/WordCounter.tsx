import { type ReactNode, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getCanonicalToolPath } from "@/data/tools";
import { Link } from "wouter";
import {
  AlignLeft,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  FileText,
  Hash,
  Lock,
  Shield,
  Smartphone,
  Type,
  Zap,
} from "lucide-react";

const CANONICAL_URL = "https://usonlinetools.com/productivity/online-word-counter";
const SEO_TITLE = "Word Counter - Free Word and Character Counter";
const SEO_DESCRIPTION =
  "Use this free word counter to count words, characters, sentences, paragraphs, and reading time online. Paste text and get instant results.";

const RELATED_TOOLS = [
  { title: "Character Counter Tool", slug: "character-counter-tool", text: "Count characters with and without spaces." },
  { title: "Case Converter", slug: "case-converter", text: "Convert text to uppercase, lowercase, title case, and more." },
  { title: "Line Counter Tool", slug: "line-counter-tool", text: "Count lines in text, lists, or code." },
  { title: "Remove Duplicate Lines", slug: "remove-duplicate-lines", text: "Clean repeated lines from copied text." },
  { title: "Readability Score Checker", slug: "online-readability-checker", text: "Check reading grade level and clarity." },
];

const FAQS = [
  {
    question: "What is a word counter?",
    answer:
      "A word counter is an online tool that counts the number of words in pasted or typed text. This word counter also counts characters, sentences, paragraphs, characters without spaces, and estimated reading time.",
  },
  {
    question: "Is this word counter free?",
    answer:
      "Yes. This free word counter works online without signup. Paste your text, review the live word count and character count, then edit until your content fits the required limit.",
  },
  {
    question: "Does this count characters as well as words?",
    answer:
      "Yes. The tool shows total characters and characters without spaces. This makes it useful as a character counter for social media posts, meta descriptions, titles, essays, and short-form content.",
  },
  {
    question: "How is reading time calculated?",
    answer:
      "Reading time is estimated by dividing the word count by 225 words per minute and rounding up. Actual reading speed can change based on topic difficulty, formatting, and reader familiarity.",
  },
  {
    question: "Can I use this for essays and assignments?",
    answer:
      "Yes. Students can paste an essay, report, or assignment to check whether it is under or over the required word count. Always follow the exact counting rules from your teacher, school, or publisher.",
  },
  {
    question: "Can I use this word counter for SEO content?",
    answer:
      "Yes. Writers and marketers can use it to check article length, meta description drafts, page copy, product descriptions, and blog posts. Word count is only one SEO signal, so focus on usefulness and search intent first.",
  },
  {
    question: "Does my text get saved?",
    answer:
      "No. The counting happens in your browser for the current page session. If you refresh or close the page, the pasted text is cleared.",
  },
  {
    question: "What counts as a word?",
    answer:
      "This tool counts words by splitting text around spaces and line breaks. That works well for English and most space-separated languages, but languages without spaces may need specialized linguistic counting.",
  },
];

function schema() {
  return [
    {
      "@type": "WebApplication",
      name: "Word Counter",
      url: CANONICAL_URL,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      description:
        "A free online word counter and character counter that counts words, characters, sentences, paragraphs, and estimated reading time.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: {
        "@type": "Organization",
        name: "US Online Tools",
        url: "https://usonlinetools.com/",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://usonlinetools.com/" },
        { "@type": "ListItem", position: 2, name: "Productivity Tools", item: "https://usonlinetools.com/category/productivity" },
        { "@type": "ListItem", position: 3, name: "Word Counter", item: CANONICAL_URL },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="text-3xl font-black text-foreground">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-semibold text-foreground">{question}</span>
        <ChevronDown className={`h-5 w-5 text-primary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? <p className="border-t border-border px-5 pb-5 pt-4 text-sm leading-7 text-muted-foreground">{answer}</p> : null}
    </div>
  );
}

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed ? trimmed.split(/[.!?]+/).filter((item) => item.trim()).length : 0;
    const paragraphs = trimmed ? text.split(/\n+/).filter((item) => item.trim()).length : 0;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    const readingTime = words ? Math.max(1, Math.ceil(words / 225)) : 0;
    const speakingTime = words ? Math.max(1, Math.ceil(words / 150)) : 0;

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      lines,
      readingTime,
      speakingTime,
    };
  }, [text]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Layout>
      <SEO title={SEO_TITLE} description={SEO_DESCRIPTION} canonical={CANONICAL_URL} schema={schema()} />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-4 w-4 text-primary" />
          <Link href="/category/productivity" className="hover:text-foreground">Productivity Tools</Link>
          <ChevronRight className="h-4 w-4 text-primary" />
          <span className="text-foreground">Word Counter</span>
        </nav>

        <section className="mb-8 overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-6 md:p-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <Type className="h-4 w-4" />
            Free Text Tool
          </div>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight text-foreground md:text-6xl">
            Word Counter
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
            Use this free word counter to count words, characters, sentences, paragraphs, lines, reading time, and
            speaking time. Paste your essay, article, blog post, social media caption, meta description, or product
            copy and get instant results with no signup.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              ["Free word counter no sign up", BadgeCheck],
              ["Character counter", Hash],
              ["Reading time estimate", Clock],
              ["Browser based", Lock],
              ["Mobile friendly", Smartphone],
            ].map(([label, Icon]) => {
              const BadgeIcon = Icon as typeof Type;
              return (
                <span key={label as string} className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-bold text-foreground">
                  <BadgeIcon className="h-4 w-4 text-secondary" />
                  {label as string}
                </span>
              );
            })}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <section id="counter" className="rounded-lg border border-border bg-card shadow-sm">
              <div className="border-b border-border bg-muted/30 px-5 py-4 md:px-6">
                <h2 className="text-xl font-black tracking-tight text-foreground">Free Online Word Counter</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Type or paste text below. Counts update instantly as you edit.
                </p>
              </div>

              <div className="space-y-6 p-5 md:p-6">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <StatCard label="Words" value={stats.words.toLocaleString()} icon={<Type className="h-5 w-5" />} />
                  <StatCard label="Characters" value={stats.characters.toLocaleString()} icon={<Hash className="h-5 w-5" />} />
                  <StatCard label="Sentences" value={stats.sentences.toLocaleString()} icon={<AlignLeft className="h-5 w-5" />} />
                  <StatCard label="Paragraphs" value={stats.paragraphs.toLocaleString()} icon={<FileText className="h-5 w-5" />} />
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  <div className="rounded-lg border border-border bg-background p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Characters without spaces</p>
                    <p className="mt-2 text-2xl font-black text-foreground">{stats.charactersNoSpaces.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Lines</p>
                    <p className="mt-2 text-2xl font-black text-foreground">{stats.lines.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Reading time</p>
                    <p className="mt-2 text-2xl font-black text-primary">{stats.readingTime} min</p>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Speaking time</p>
                    <p className="mt-2 text-2xl font-black text-secondary">{stats.speakingTime} min</p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-border bg-background">
                  <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
                    <label htmlFor="word-counter-input" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      Your text
                    </label>
                    <button
                      type="button"
                      onClick={() => setText("")}
                      className="rounded-md px-2 py-1 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      Clear
                    </button>
                  </div>
                  <textarea
                    id="word-counter-input"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Type or paste your text here..."
                    className="min-h-[360px] w-full resize-y bg-transparent p-5 text-base leading-7 text-foreground outline-none placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Quick Answer: How many words is my text?",
                  text: "Paste your text into the box and the word count appears instantly. The counter updates as you type, delete, or edit.",
                },
                {
                  title: "Quick Answer: How many characters is my text?",
                  text: "The character counter shows total characters and characters without spaces, which helps with captions, titles, descriptions, and forms.",
                },
                {
                  title: "Quick Answer: How long will it take to read?",
                  text: "Reading time is estimated from the word count using 225 words per minute, then rounded up to the nearest minute.",
                },
              ].map((item) => (
                <article key={item.title} className="rounded-lg border border-border bg-card p-5">
                  <h2 className="text-base font-black leading-snug text-foreground">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
                </article>
              ))}
            </section>

            <section id="how-to-use" className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">How to Use This Word Counter</h2>
              <p className="mt-4 leading-8 text-muted-foreground">
                This online word counter is built for writers, students, marketers, editors, bloggers, and social media
                creators who need fast text statistics. It works as a word counter, character counter, sentence counter,
                paragraph counter, line counter, and reading time calculator in one page.
              </p>
              <ol className="mt-6 space-y-4">
                {[
                  "Paste or type your text into the large text area.",
                  "Review the live word count, character count, sentence count, paragraph count, and reading time.",
                  "Edit your draft until it fits the required word limit or character limit.",
                  "Use the related tools if you need to change case, count lines, remove duplicates, or check readability.",
                ].map((step, index) => (
                  <li key={step} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-black text-primary">
                      {index + 1}
                    </span>
                    <p className="pt-1 leading-7 text-muted-foreground">{step}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section id="limits" className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Common Word Count and Character Count Limits</h2>
              <p className="mt-4 leading-8 text-muted-foreground">
                People search for a word counter because many platforms and assignments have limits. Use these numbers
                as planning ranges, then confirm the final rules in the platform, school, publisher, or client brief.
              </p>
              <div className="mt-6 overflow-hidden rounded-lg border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Content type</th>
                      <th className="px-4 py-3">Typical limit or range</th>
                      <th className="hidden px-4 py-3 md:table-cell">Why it matters</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-foreground">X/Twitter post</td>
                      <td className="px-4 py-3 text-muted-foreground">280 characters</td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">Useful for short social posts and quick announcements.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-foreground">Meta description</td>
                      <td className="px-4 py-3 text-muted-foreground">About 140 to 160 characters</td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">Helps keep search snippets concise and readable.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-foreground">Product description</td>
                      <td className="px-4 py-3 text-muted-foreground">100 to 300 words</td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">Good for ecommerce copy, marketplace listings, and service blurbs.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-foreground">SEO blog post</td>
                      <td className="px-4 py-3 text-muted-foreground">800 to 2,500+ words</td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">The right length depends on search intent and topic depth.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-foreground">College essay</td>
                      <td className="px-4 py-3 text-muted-foreground">500 to 3,000 words</td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">Assignments often require a specific minimum or maximum.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="seo-writing" className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Word Counter for SEO, Essays, and Social Media</h2>
              <div className="mt-4 space-y-4 leading-8 text-muted-foreground">
                <p>
                  For SEO writing, word count should support search intent rather than replace it. A page about a simple
                  tool may only need concise instructions and FAQ content, while a competitive service page or guide may
                  need deeper examples, comparisons, definitions, and internal links.
                </p>
                <p>
                  For essays and assignments, word count helps you stay within the required range before submission.
                  If your draft is too short, expand the strongest points with evidence and examples. If it is too long,
                  remove repeated ideas and tighten sentences instead of cutting important context.
                </p>
                <p>
                  For social media, character count is often more important than word count. This tool works as a
                  character counter for captions, posts, ad copy, titles, short bios, and meta descriptions, while also
                  showing the broader writing structure.
                </p>
              </div>
            </section>

            <section id="faq" className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Word Counter FAQ</h2>
              <div className="mt-6 space-y-3">
                {FAQS.map((faq) => (
                  <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-sm font-black uppercase tracking-wide text-foreground">Related Tools</h2>
              <div className="mt-4 space-y-2">
                {RELATED_TOOLS.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={getCanonicalToolPath(tool.slug)}
                    className="group flex gap-3 rounded-lg p-2 transition hover:bg-muted"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                      <Shield className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-foreground group-hover:text-primary">{tool.title}</span>
                      <span className="block text-xs leading-5 text-muted-foreground">{tool.text}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-sm font-black uppercase tracking-wide text-foreground">On This Page</h2>
              <div className="mt-4 grid gap-2 text-sm">
                {[
                  ["Counter", "#counter"],
                  ["How to use", "#how-to-use"],
                  ["Limits", "#limits"],
                  ["SEO writing", "#seo-writing"],
                  ["FAQ", "#faq"],
                ].map(([label, href]) => (
                  <a key={href} href={href} className="text-muted-foreground hover:text-primary">
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-sm font-black uppercase tracking-wide text-foreground">Share This Tool</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Share the free word counter with someone who needs a quick word or character count.
              </p>
              <button
                type="button"
                onClick={copyLink}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-bold text-secondary-foreground hover:bg-secondary/90"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Link copied" : "Copy link"}
              </button>
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
