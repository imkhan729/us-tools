import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  Languages,
  ArrowRight,
  Zap,
  Smartphone,
  Shield,
  Lightbulb,
  Copy,
  Check,
  BadgeCheck,
  Lock,
  ArrowLeftRight,
  Hash,
  BookOpen,
  ListChecks,
} from "lucide-react";

type ParseSuccess = {
  normalized: string;
  rawValue: string;
  formattedValue: string;
  wholeFormatted: string;
  decimalDigits: string;
  tokenCount: number;
  isNegative: boolean;
  magnitudeLabel: string;
  summary: string;
};

type ParseFailure = {
  normalized: string;
  error: string;
};

const SMALL_NUMBERS: Record<string, bigint> = {
  zero: 0n,
  one: 1n,
  two: 2n,
  three: 3n,
  four: 4n,
  five: 5n,
  six: 6n,
  seven: 7n,
  eight: 8n,
  nine: 9n,
  ten: 10n,
  eleven: 11n,
  twelve: 12n,
  thirteen: 13n,
  fourteen: 14n,
  fifteen: 15n,
  sixteen: 16n,
  seventeen: 17n,
  eighteen: 18n,
  nineteen: 19n,
  a: 1n,
  an: 1n,
};

const TENS_NUMBERS: Record<string, bigint> = {
  twenty: 20n,
  thirty: 30n,
  forty: 40n,
  fifty: 50n,
  sixty: 60n,
  seventy: 70n,
  eighty: 80n,
  ninety: 90n,
};

const SCALE_NUMBERS: Record<string, bigint> = {
  thousand: 1_000n,
  million: 1_000_000n,
  billion: 1_000_000_000n,
  trillion: 1_000_000_000_000n,
  quadrillion: 1_000_000_000_000_000n,
};

const DECIMAL_DIGITS: Record<string, string> = {
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  oh: "0",
  o: "0",
};

const EXAMPLES = [
  {
    input: "two thousand forty-six",
    output: "2,046",
    useCase: "Invoice or legal document values",
  },
  {
    input: "negative seven hundred twelve",
    output: "-712",
    useCase: "Accounting adjustments or score changes",
  },
  {
    input: "one million three hundred thousand",
    output: "1,300,000",
    useCase: "Budgets, traffic, or population figures",
  },
  {
    input: "zero point zero five",
    output: "0.05",
    useCase: "Measurements, ratios, and lab values",
  },
  {
    input: "nine hundred ninety-nine thousand nine hundred ninety-nine",
    output: "999,999",
    useCase: "Large written numbers in reports",
  },
];

const RELATED = [
  {
    title: "Number to Words Converter",
    slug: "number-to-words-converter",
    category: "conversion",
    icon: <ArrowLeftRight className="w-5 h-5" />,
    color: 215,
    benefit: "Turn digits back into written words",
  },
  {
    title: "Base Converter",
    slug: "base-converter",
    category: "conversion",
    icon: <Hash className="w-5 h-5" />,
    color: 185,
    benefit: "Convert numbers across bases 2 to 36",
  },
  {
    title: "Roman Numeral Converter",
    slug: "roman-numeral-converter",
    category: "conversion",
    icon: <BookOpen className="w-5 h-5" />,
    color: 28,
    benefit: "Convert modern numbers and Roman numerals",
  },
  {
    title: "Scientific Calculator",
    slug: "online-scientific-calculator",
    category: "math",
    icon: <ListChecks className="w-5 h-5" />,
    color: 265,
    benefit: "Handle advanced math after conversion",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-violet-500/40 transition-colors">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-violet-500"
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
            <p className="px-5 pb-5 pt-4 text-muted-foreground leading-relaxed border-t border-border">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatBigIntWithCommas(value: bigint): string {
  const raw = value.toString();
  return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function magnitudeLabel(value: bigint): string {
  if (value >= SCALE_NUMBERS.quadrillion) return "Quadrillion scale";
  if (value >= SCALE_NUMBERS.trillion) return "Trillion scale";
  if (value >= SCALE_NUMBERS.billion) return "Billion scale";
  if (value >= SCALE_NUMBERS.million) return "Million scale";
  if (value >= SCALE_NUMBERS.thousand) return "Thousand scale";
  return "Under one thousand";
}

function parseWholeNumberTokens(tokens: string[]): { value: bigint; seenNumber: boolean; error?: string } {
  let total = 0n;
  let current = 0n;
  let seenNumber = false;

  for (const token of tokens) {
    if (token === "and") {
      continue;
    }

    if (token in SMALL_NUMBERS) {
      current += SMALL_NUMBERS[token];
      seenNumber = true;
      continue;
    }

    if (token in TENS_NUMBERS) {
      current += TENS_NUMBERS[token];
      seenNumber = true;
      continue;
    }

    if (token === "hundred") {
      current = (current === 0n ? 1n : current) * 100n;
      seenNumber = true;
      continue;
    }

    if (token in SCALE_NUMBERS) {
      current = current === 0n ? 1n : current;
      total += current * SCALE_NUMBERS[token];
      current = 0n;
      seenNumber = true;
      continue;
    }

    return {
      value: 0n,
      seenNumber,
      error: `"${token}" is not a supported English number word.`,
    };
  }

  return { value: total + current, seenNumber };
}

function parseWordsToNumber(input: string): ParseSuccess | ParseFailure | null {
  const normalized = input
    .toLowerCase()
    .replace(/,/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return null;
  }

  const tokens = normalized.split(" ");
  let isNegative = false;
  let workingTokens = [...tokens];

  if (workingTokens[0] === "negative" || workingTokens[0] === "minus") {
    isNegative = true;
    workingTokens = workingTokens.slice(1);
  }

  if (workingTokens.length === 0) {
    return {
      normalized,
      error: "Add at least one number word after the sign.",
    };
  }

  const pointIndex = workingTokens.indexOf("point");
  const wholeTokens = pointIndex >= 0 ? workingTokens.slice(0, pointIndex) : workingTokens;
  const decimalTokens = pointIndex >= 0 ? workingTokens.slice(pointIndex + 1) : [];

  const wholeResult = parseWholeNumberTokens(wholeTokens);
  if (wholeResult.error) {
    return { normalized, error: wholeResult.error };
  }

  if (!wholeResult.seenNumber && decimalTokens.length === 0) {
    return {
      normalized,
      error: "Use English number words like 'twenty one' or 'one hundred five'.",
    };
  }

  let decimalDigits = "";
  if (pointIndex >= 0) {
    if (decimalTokens.length === 0) {
      return {
        normalized,
        error: "Add digit words after 'point', for example 'point five' or 'point zero two'.",
      };
    }

    for (const token of decimalTokens) {
      if (token === "and") {
        continue;
      }

      if (!(token in DECIMAL_DIGITS)) {
        return {
          normalized,
          error: `After "point", use single digit words like zero, one, or five. "${token}" is not supported there.`,
        };
      }

      decimalDigits += DECIMAL_DIGITS[token];
    }

    if (!decimalDigits) {
      return {
        normalized,
        error: "The decimal portion must contain at least one digit word.",
      };
    }
  }

  const wholeFormatted = formatBigIntWithCommas(wholeResult.value);
  const rawValue = `${isNegative ? "-" : ""}${wholeResult.value.toString()}${decimalDigits ? `.${decimalDigits}` : ""}`;
  const formattedValue = `${isNegative ? "-" : ""}${wholeFormatted}${decimalDigits ? `.${decimalDigits}` : ""}`;

  let summary = `Parsed the phrase as ${formattedValue}.`;
  if (decimalDigits) {
    summary += ` The words after "point" were read digit by digit as ${decimalDigits}.`;
  }
  if (isNegative) {
    summary += " The opening sign word makes the final value negative.";
  }
  summary += " This converter uses standard US English short-scale numbering.";

  return {
    normalized,
    rawValue,
    formattedValue,
    wholeFormatted,
    decimalDigits,
    tokenCount: tokens.length,
    isNegative,
    magnitudeLabel: magnitudeLabel(wholeResult.value),
    summary,
  };
}

export default function WordsToNumberConverter() {
  const [input, setInput] = useState("two thousand forty-six");
  const [copiedResult, setCopiedResult] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const result = useMemo(() => parseWordsToNumber(input), [input]);

  const copyResult = () => {
    if (!result || "error" in result) {
      return;
    }

    navigator.clipboard.writeText(result.rawValue);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Words to Number Converter - English Number Words to Digits"
        description="Free Words to Number Converter. Turn English number words like 'two thousand forty-six' into digits instantly. Supports negatives, decimals after point, and large short-scale numbers."
        canonical="https://usonlinetools.com/conversion/words-to-number-converter"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Words to Number Converter",
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
          description:
            "Convert English number words into digits instantly. Supports negatives, decimals spoken after point, and large short-scale numbers.",
          url: "https://usonlinetools.com/conversion/words-to-number-converter",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <Link href="/category/conversion" className="text-muted-foreground hover:text-foreground transition-colors">
            Conversion Tools
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-violet-500" strokeWidth={3} />
          <span className="text-foreground">Words to Number Converter</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-violet-500/15 bg-gradient-to-br from-violet-500/5 via-card to-fuchsia-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Languages className="w-3.5 h-3.5" />
            Conversion Tools
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-4xl">
            Words to Number Converter
          </h1>

          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-3xl">
            Convert English number words like &quot;two thousand forty-six&quot; into digits instantly. This tool is built for people first: clear output, practical examples, and direct explanations instead of filler text or keyword stuffing.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" />
              100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Zap className="w-3.5 h-3.5" />
              Instant Results
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" />
              No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 font-bold text-xs px-3 py-1.5 rounded-full border border-fuchsia-500/20">
              <Shield className="w-3.5 h-3.5" />
              Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" />
              Mobile Ready
            </span>
          </div>

          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Conversion Tools | Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className="rounded-2xl overflow-hidden border border-violet-500/20 shadow-lg shadow-violet-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 to-fuchsia-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-400 flex items-center justify-center flex-shrink-0">
                      <ArrowLeftRight className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        English Words to Digits
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Paste a written number and the numeric result updates as you type.
                      </p>
                    </div>
                  </div>

                  <div className="tool-calc-card">
                    <div className="grid grid-cols-1 gap-5">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest block">
                          Number Words
                        </label>
                        <textarea
                          value={input}
                          onChange={(event) => setInput(event.target.value)}
                          placeholder="Example: one million two hundred thirty-four thousand five hundred sixty-seven"
                          className="w-full h-36 p-4 rounded-xl bg-background border-2 border-border focus:border-violet-500 outline-none text-sm leading-relaxed resize-none"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Supports negatives and decimals spoken after &quot;point&quot;, such as &quot;negative twelve point zero five&quot;.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {EXAMPLES.map((example) => (
                          <button
                            key={example.input}
                            onClick={() => setInput(example.input)}
                            className="px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-700 dark:text-violet-300 text-xs font-bold hover:bg-violet-500/10 transition-colors"
                          >
                            {example.input}
                          </button>
                        ))}
                      </div>

                      {result && !("error" in result) && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                          <div className="rounded-2xl border-2 border-violet-500/25 bg-violet-500/5 p-6 text-center">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                              Converted Number
                            </p>
                            <p className="text-4xl md:text-5xl font-black text-violet-700 dark:text-violet-300 break-words">
                              {result.formattedValue}
                            </p>
                            <p className="text-sm text-muted-foreground mt-3">
                              Normalized input: <span className="text-foreground font-medium">{result.normalized}</span>
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div className="text-center p-3 rounded-xl bg-muted/60 border border-border">
                              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Raw Output</p>
                              <p className="text-sm font-black text-foreground break-all">{result.rawValue}</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-muted/60 border border-border">
                              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Whole Part</p>
                              <p className="text-sm font-black text-foreground">{result.wholeFormatted}</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-muted/60 border border-border">
                              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Decimals</p>
                              <p className="text-sm font-black text-foreground">{result.decimalDigits ? result.decimalDigits.length : 0}</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-muted/60 border border-border">
                              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Scale</p>
                              <p className="text-sm font-black text-foreground">{result.magnitudeLabel}</p>
                            </div>
                          </div>

                          <button
                            onClick={copyResult}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                          >
                            {copiedResult ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                Copy Number
                              </>
                            )}
                          </button>

                          <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                            <div className="flex gap-2 items-start">
                              <Lightbulb className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-foreground/80 leading-relaxed">{result.summary}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {result && "error" in result && (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                          <p className="text-sm font-semibold text-red-600">{result.error}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Try phrases like &quot;twenty one&quot;, &quot;one hundred five&quot;, or &quot;zero point seven five&quot;.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Words to Number Converter</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                This page is designed to be helpful and direct. Enter the number exactly the way you would say or write it in plain English, and the tool converts it into digits without extra steps.
              </p>

              <ol className="space-y-5 mb-8">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Type a number phrase in normal English</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Examples include &quot;two thousand forty-six&quot;, &quot;one million three hundred thousand&quot;, or &quot;negative twelve&quot;. Hyphens and commas are fine because the parser normalizes them automatically.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Use &quot;point&quot; for decimals</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      After the word &quot;point&quot;, say each decimal digit individually. For example, &quot;zero point zero five&quot; becomes 0.05 and &quot;twelve point seven&quot; becomes 12.7.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Copy the numeric output</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Use the formatted result for reading and the raw output for spreadsheets, calculations, forms, or data entry. Both are generated instantly inside your browser.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="p-5 rounded-xl bg-muted/60 border border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Best Input Patterns</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-background border border-border p-3">
                    <p className="font-bold text-foreground mb-1">Whole numbers</p>
                    <p className="text-muted-foreground">one hundred twenty-five</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border p-3">
                    <p className="font-bold text-foreground mb-1">Large values</p>
                    <p className="text-muted-foreground">three billion two million ten</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border p-3">
                    <p className="font-bold text-foreground mb-1">Negative values</p>
                    <p className="text-muted-foreground">negative forty-two</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border p-3">
                    <p className="font-bold text-foreground mb-1">Decimals</p>
                    <p className="text-muted-foreground">six point zero two</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="supported-input" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">What This Converter Understands</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Clear scope is better than vague promises. These are the input formats supported on this page.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                  <div className="w-3 h-3 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Standard English cardinal numbers</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Words from zero through quadrillion are supported using standard short-scale US English naming. That covers everyday phrases from simple counts to very large written figures.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-fuchsia-500/5 border border-fuchsia-500/20">
                  <div className="w-3 h-3 rounded-full bg-fuchsia-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Decimals spoken after &quot;point&quot;</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Decimal digits are read one by one after the word &quot;point&quot;. This keeps the behavior predictable and matches how people usually say decimal values aloud.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                  <div className="w-3 h-3 rounded-full bg-cyan-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Negative values</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Start the phrase with &quot;negative&quot; or &quot;minus&quot; to create a negative number. The converter applies the sign to the final output.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="font-bold text-foreground mb-1">Known limits</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This version focuses on plain English number words. It does not try to guess ambiguous currency phrases, fractions, or non-English languages. That makes the output more reliable and easier to verify.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>

              <div className="overflow-x-auto rounded-xl border border-border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/60">
                      <th className="text-left px-4 py-3 font-bold text-foreground">Words</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground">Digits</th>
                      <th className="text-left px-4 py-3 font-bold text-foreground hidden sm:table-cell">Common Use</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {EXAMPLES.map((example) => (
                      <tr key={example.input} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">{example.input}</td>
                        <td className="px-4 py-3 font-bold text-violet-600 dark:text-violet-400">{example.output}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{example.useCase}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Example 1 - paperwork and admin:</strong> If a form, invoice, or agreement spells out a number in words, this converter gives you the matching digits instantly. That helps when you need to re-enter the value into software that expects numeric input only.
                </p>
                <p>
                  <strong className="text-foreground">Example 2 - education and accessibility:</strong> Teachers, students, and support staff often move between spoken numbers, written language, and numeric notation. Converting both ways makes worksheets, captions, and reading support materials easier to prepare.
                </p>
                <p>
                  <strong className="text-foreground">Example 3 - data cleanup:</strong> Imported text fields sometimes contain written numbers instead of digits. Using a focused words-to-number parser is faster and safer than manually retyping each value.
                </p>
              </div>
            </section>

            <section id="why-choose-this" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Words to Number Converter?</h2>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p>
                  <strong className="text-foreground">Helpful, specific content instead of generic filler.</strong> The page explains exactly what the tool handles, how decimals work, and where the limits are. That keeps it more useful for real people and more aligned with people-first content guidance.
                </p>
                <p>
                  <strong className="text-foreground">Readable output with a raw value for copy-paste.</strong> You get a comma-formatted version for easy scanning and a plain numeric version for forms, spreadsheets, and calculations. No extra cleanup step is needed.
                </p>
                <p>
                  <strong className="text-foreground">Private by default.</strong> Every conversion happens in the browser. If you are working with financial figures, internal notes, or sensitive records, your input stays on your device.
                </p>
                <p>
                  <strong className="text-foreground">Fast enough for repetitive work.</strong> Because the output updates as you type, this page works well for checking multiple phrases one after another during proofreading, QA, or content review.
                </p>
              </div>

              <div className="mt-6 p-4 rounded-xl border border-border bg-muted/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> This tool is for English number words written in the short scale. If you need fractions, currencies written as checks, or other languages, use the result here as a quick first pass and verify any critical values manually.
                </p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem
                  q="Can this converter read decimals?"
                  a='Yes. Use the word "point" and then say each digit individually. For example, "three point one four" becomes 3.14 and "zero point zero five" becomes 0.05.'
                />
                <FaqItem
                  q="Does it understand negative numbers?"
                  a='Yes. Start the phrase with "negative" or "minus" and the output will include a leading minus sign.'
                />
                <FaqItem
                  q="Does the tool follow US or UK large-number naming?"
                  a="It uses the modern short scale commonly used in the US and in most current English-language software: billion means 1,000,000,000 and trillion means 1,000,000,000,000."
                />
                <FaqItem
                  q="Why does the tool ask for digit words after point?"
                  a='That rule removes ambiguity. Phrases like "point twenty five" can be interpreted in different ways, while "point two five" is always 0.25.'
                />
                <FaqItem
                  q="Can I paste commas or hyphenated words?"
                  a='Yes. Inputs like "twenty-one" or "one thousand, five hundred" are normalized before parsing, so hyphens and commas do not break the conversion.'
                />
                <FaqItem
                  q="Is this page safe for sensitive numbers?"
                  a="Yes. The conversion runs locally in your browser and does not require an account, so the text you enter is not sent to a server by this tool."
                />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need More Number Converters?</h2>
                <p className="text-white/80 mb-6 max-w-lg">
                  Explore more conversion and calculator tools for digits, words, bases, and numeric formatting.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-600 font-bold rounded-xl hover:-translate-y-0.5 transition-transform"
                >
                  Explore All Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/${tool.category}/${tool.slug}`}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">
                          {tool.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-violet-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share with writers, editors, teachers, and teams.</p>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    ["Calculator", "#calculator"],
                    ["How to Use", "#how-to-use"],
                    ["Supported Input", "#supported-input"],
                    ["Quick Examples", "#quick-examples"],
                    ["Why Choose This", "#why-choose-this"],
                    ["FAQ", "#faq"],
                  ].map(([label, href]) => (
                    <a
                      key={label}
                      href={href}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-violet-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-violet-500/40 flex-shrink-0" />
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
