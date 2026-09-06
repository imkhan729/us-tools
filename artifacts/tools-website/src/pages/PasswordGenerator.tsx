import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getCanonicalToolPath } from "@/data/tools";
import { Link } from "wouter";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  Hash,
  KeyRound,
  Lock,
  RefreshCw,
  Shield,
  Smartphone,
  Type,
  Zap,
} from "lucide-react";

const CANONICAL_URL = "https://usonlinetools.com/security/online-password-generator";
const SEO_TITLE = "Password Generator - Free Secure Random Password Generator";
const SEO_DESCRIPTION =
  "Use this free password generator to create strong, secure random passwords with numbers, symbols, uppercase, and lowercase letters. No signup.";

const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

const RELATED_TOOLS = [
  {
    title: "Password Strength Checker",
    slug: "password-strength-checker",
    icon: Shield,
    text: "Test whether a password is weak, fair, good, or strong.",
  },
  {
    title: "Random Number Generator",
    slug: "random-number-generator",
    icon: Hash,
    text: "Generate random numbers for quick decisions and testing.",
  },
  {
    title: "Hash Generator",
    slug: "hash-generator",
    icon: KeyRound,
    text: "Create MD5, SHA, and other text hashes online.",
  },
  {
    title: "Base64 Encoder",
    slug: "base64-encoder",
    icon: Type,
    text: "Encode and decode Base64 text in your browser.",
  },
  {
    title: "UUID Generator",
    slug: "uuid-generator",
    icon: Zap,
    text: "Create unique identifiers for apps and databases.",
  },
];

const FAQS = [
  {
    question: "What is a password generator?",
    answer:
      "A password generator is an online tool that creates random passwords using the length and character types you choose. This password generator can include uppercase letters, lowercase letters, numbers, and symbols so you can create stronger passwords for online accounts.",
  },
  {
    question: "Is this password generator free?",
    answer:
      "Yes. This free password generator works in your browser and does not require signup for normal use. You can generate, refresh, show, hide, and copy passwords without creating an account.",
  },
  {
    question: "Are passwords created by this tool stored?",
    answer:
      "No. The generated password is created in your browser for the current session. Do not paste sensitive passwords into unknown websites, and store any password you decide to use in a trusted password manager.",
  },
  {
    question: "How long should a strong password be?",
    answer:
      "For most accounts, a password of at least 14 to 16 characters is a practical starting point. For important accounts such as email, banking, cloud storage, and password manager master passwords, consider 20 or more characters if the service allows it.",
  },
  {
    question: "Should I include symbols in a password?",
    answer:
      "Use symbols when the website or app allows them. Symbols increase the character pool and make a random password harder to guess. If a website rejects symbols, use a longer password with uppercase letters, lowercase letters, and numbers.",
  },
  {
    question: "What is the best random password generator setting?",
    answer:
      "A strong default setting is 16 or more characters with uppercase letters, lowercase letters, numbers, and symbols enabled. Longer passwords are usually better, especially when stored in a password manager.",
  },
  {
    question: "Can I use this secure password generator for WiFi?",
    answer:
      "Yes, if your router supports the selected length and characters. A long random WiFi password is usually safer than a short word, address, phone number, or predictable phrase.",
  },
  {
    question: "Can a password generator make a password impossible to crack?",
    answer:
      "No tool can promise that a password is impossible to crack. A random password generator can make stronger passwords, but security also depends on the website, password storage, two-factor authentication, breach exposure, and whether you reuse passwords.",
  },
];

function addSchema() {
  return [
    {
      "@type": "WebApplication",
      name: "Password Generator",
      url: CANONICAL_URL,
      applicationCategory: "SecurityApplication",
      operatingSystem: "Any",
      description:
        "A free secure password generator for creating strong random passwords with uppercase letters, lowercase letters, numbers, symbols, and custom length options.",
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
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://usonlinetools.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Security Tools",
          item: "https://usonlinetools.com/category/security",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Password Generator",
          item: CANONICAL_URL,
        },
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

function createRandomPassword(length: number, sets: string[]) {
  const charset = sets.join("");
  if (!charset) return "";

  const randomValues = new Uint32Array(length);
  window.crypto.getRandomValues(randomValues);

  const requiredCharacters = sets.map((set) => {
    const random = new Uint32Array(1);
    window.crypto.getRandomValues(random);
    return set[random[0] % set.length];
  });

  const passwordCharacters = Array.from(randomValues, (value) => charset[value % charset.length]);
  for (let index = 0; index < requiredCharacters.length && index < passwordCharacters.length; index += 1) {
    passwordCharacters[index] = requiredCharacters[index];
  }

  for (let index = passwordCharacters.length - 1; index > 0; index -= 1) {
    const random = new Uint32Array(1);
    window.crypto.getRandomValues(random);
    const swapIndex = random[0] % (index + 1);
    [passwordCharacters[index], passwordCharacters[swapIndex]] = [
      passwordCharacters[swapIndex],
      passwordCharacters[index],
    ];
  }

  return passwordCharacters.join("");
}

function getStrength({
  length,
  characterTypes,
}: {
  length: number;
  characterTypes: number;
}) {
  const score = length + characterTypes * 4;

  if (score < 18) {
    return {
      label: "Weak",
      bar: "w-1/4 bg-red-500",
      text: "text-red-600 dark:text-red-400",
      note: "Use a longer password with more character types.",
    };
  }

  if (score < 28) {
    return {
      label: "Fair",
      bar: "w-1/2 bg-amber-500",
      text: "text-amber-600 dark:text-amber-400",
      note: "Good for low-risk accounts, but longer is better.",
    };
  }

  if (score < 38) {
    return {
      label: "Strong",
      bar: "w-3/4 bg-secondary",
      text: "text-secondary",
      note: "A practical setting for most online accounts.",
    };
  }

  return {
    label: "Very Strong",
    bar: "w-full bg-primary",
    text: "text-primary",
    note: "Best used with a trusted password manager.",
  };
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

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);

  const characterSets = useMemo(() => {
    const sets: string[] = [];
    if (uppercase) sets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    if (lowercase) sets.push("abcdefghijklmnopqrstuvwxyz");
    if (numbers) sets.push("0123456789");
    if (symbols) sets.push(SYMBOLS);
    return sets;
  }, [lowercase, numbers, symbols, uppercase]);

  const strength = getStrength({
    length,
    characterTypes: characterSets.length,
  });

  const generatePassword = () => {
    setPassword(createRandomPassword(length, characterSets));
  };

  useEffect(() => {
    generatePassword();
  }, [characterSets, length]);

  const copyPassword = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    window.setTimeout(() => setLinkCopied(false), 1800);
  };

  return (
    <Layout>
      <SEO
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        canonical={CANONICAL_URL}
        schema={addSchema()}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-4 w-4 text-primary" />
          <Link href="/category/security" className="hover:text-foreground">Security Tools</Link>
          <ChevronRight className="h-4 w-4 text-primary" />
          <span className="text-foreground">Password Generator</span>
        </nav>

        <section className="mb-8 overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-6 md:p-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <Shield className="h-4 w-4" />
            Free Security Tool
          </div>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight text-foreground md:text-6xl">
            Password Generator
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
            Use this free password generator to create strong, secure random passwords for email, banking, WiFi,
            work apps, social media, and password managers. Choose the password length, include numbers and
            symbols, then copy a new random password instantly with no signup.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              ["Secure random password generator", BadgeCheck],
              ["No signup", Lock],
              ["Numbers and symbols", Hash],
              ["Mobile friendly", Smartphone],
            ].map(([label, Icon]) => {
              const BadgeIcon = Icon as typeof Shield;
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
            <section id="generator" className="rounded-lg border border-border bg-card shadow-sm">
              <div className="border-b border-border bg-muted/30 px-5 py-4 md:px-6">
                <h2 className="text-xl font-black tracking-tight text-foreground">Free Secure Password Generator</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Adjust the settings below. A new password is generated automatically.
                </p>
              </div>

              <div className="space-y-6 p-5 md:p-6">
                <div className="rounded-lg border border-border bg-background p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <p
                      className="min-h-10 flex-1 break-all font-mono text-xl font-semibold tracking-wide text-foreground md:text-2xl"
                      style={{
                        filter: showPassword ? "none" : "blur(7px)",
                        userSelect: showPassword ? "auto" : "none",
                      }}
                    >
                      {password || "Select at least one character type"}
                    </p>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground"
                        aria-label="Generate another password"
                      >
                        <RefreshCw className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={copyPassword}
                        disabled={!password}
                        className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Password strength</p>
                    <p className={`text-sm font-black ${strength.text}`}>{strength.label}</p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full transition-all ${strength.bar}`} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{strength.note}</p>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <label htmlFor="password-length" className="text-sm font-bold text-foreground">
                      Password length
                    </label>
                    <span className="rounded-md bg-primary/10 px-2 py-1 text-sm font-black text-primary">
                      {length} characters
                    </span>
                  </div>
                  <input
                    id="password-length"
                    type="range"
                    min={6}
                    max={64}
                    value={length}
                    onChange={(event) => setLength(Number(event.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>6</span>
                    <span>16 recommended</span>
                    <span>64</span>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-bold text-foreground">Include character types</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      ["Uppercase letters", "A-Z", uppercase, setUppercase],
                      ["Lowercase letters", "a-z", lowercase, setLowercase],
                      ["Numbers", "0-9", numbers, setNumbers],
                      ["Symbols", "!@#$", symbols, setSymbols],
                    ].map(([label, example, value, setter]) => (
                      <label
                        key={label as string}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-4 transition hover:border-primary/40"
                      >
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(event) => (setter as (value: boolean) => void)(event.target.checked)}
                          className="h-5 w-5 accent-primary"
                        />
                        <span>
                          <span className="block text-sm font-semibold text-foreground">{label as string}</span>
                          <span className="block font-mono text-xs text-muted-foreground">{example as string}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Quick Answer: What is a strong password?",
                  text: "A strong password is long, random, unique, and hard to guess. For most accounts, use 16 or more characters with a mix of letters, numbers, and symbols.",
                },
                {
                  title: "Quick Answer: Is this a random password generator?",
                  text: "Yes. This tool creates random passwords from the character sets you select, including uppercase, lowercase, numbers, and symbols.",
                },
                {
                  title: "Quick Answer: Can I reuse one strong password?",
                  text: "No. Use a different strong password for every account. Reusing a password can expose multiple accounts after one breach.",
                },
              ].map((item) => (
                <article key={item.title} className="rounded-lg border border-border bg-card p-5">
                  <h2 className="text-base font-black leading-snug text-foreground">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
                </article>
              ))}
            </section>

            <section id="how-to-use" className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">How to Use This Password Generator</h2>
              <p className="mt-4 leading-8 text-muted-foreground">
                This online password generator is built for people who need a quick secure password without installing
                software. It is useful for new account signups, WiFi passwords, admin logins, temporary credentials,
                and password manager entries.
              </p>
              <ol className="mt-6 space-y-4">
                {[
                  "Choose the password length. Longer passwords are usually harder to guess.",
                  "Keep uppercase letters, lowercase letters, numbers, and symbols enabled for the strongest result.",
                  "Click refresh if you want another random password with the same settings.",
                  "Use the copy button and save the password inside a trusted password manager.",
                  "Avoid reusing the same generated password on more than one website.",
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

            <section id="best-settings" className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Best Password Generator Settings</h2>
              <p className="mt-4 leading-8 text-muted-foreground">
                Searchers often ask for the best password generator settings because many websites have different
                password rules. The safest practical choice is usually a long random password with all character types
                enabled. If a website blocks symbols, increase the length and keep letters and numbers enabled.
              </p>
              <div className="mt-6 overflow-hidden rounded-lg border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Use case</th>
                      <th className="px-4 py-3">Recommended setting</th>
                      <th className="hidden px-4 py-3 md:table-cell">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-foreground">Everyday accounts</td>
                      <td className="px-4 py-3 text-muted-foreground">16 characters, all types</td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">Strong balance of security and compatibility.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-foreground">Email or banking</td>
                      <td className="px-4 py-3 text-muted-foreground">20 to 24 characters, all types</td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">Primary accounts deserve a larger security margin.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-foreground">WiFi password</td>
                      <td className="px-4 py-3 text-muted-foreground">18 to 32 characters</td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">Long random WiFi passwords are harder to guess.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-foreground">Sites that block symbols</td>
                      <td className="px-4 py-3 text-muted-foreground">20+ letters and numbers</td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">Length helps compensate for fewer character types.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="why-strong-passwords-matter" className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Why Strong Random Passwords Matter</h2>
              <div className="mt-4 space-y-4 leading-8 text-muted-foreground">
                <p>
                  Weak passwords are easy to guess because they use common words, names, dates, keyboard patterns, or
                  short number strings. A secure password generator avoids those patterns by creating a random password
                  that is not based on your personal information.
                </p>
                <p>
                  The most important rule is uniqueness. Even a strong password becomes risky if you reuse it across
                  multiple accounts. If one website is breached, attackers may try the same email and password on other
                  services. Generate a new password for every account and keep it in a password manager.
                </p>
                <p>
                  A password generator is only one layer of account security. For important accounts, also enable
                  two-factor authentication, keep recovery email addresses updated, avoid phishing links, and change a
                  password quickly if a service reports a breach.
                </p>
              </div>
            </section>

            <section id="faq" className="rounded-lg border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Password Generator FAQ</h2>
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
                {RELATED_TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.slug}
                      href={getCanonicalToolPath(tool.slug)}
                      className="group flex gap-3 rounded-lg p-2 transition hover:bg-muted"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-foreground group-hover:text-primary">{tool.title}</span>
                        <span className="block text-xs leading-5 text-muted-foreground">{tool.text}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-sm font-black uppercase tracking-wide text-foreground">On This Page</h2>
              <div className="mt-4 grid gap-2 text-sm">
                {[
                  ["Generator", "#generator"],
                  ["How to use", "#how-to-use"],
                  ["Best settings", "#best-settings"],
                  ["Why strong passwords matter", "#why-strong-passwords-matter"],
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
                Share the free password generator with someone who needs a strong random password.
              </p>
              <button
                type="button"
                onClick={copyLink}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-bold text-secondary-foreground hover:bg-secondary/90"
              >
                {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {linkCopied ? "Link copied" : "Copy link"}
              </button>
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/10 p-5">
              <h2 className="text-sm font-black uppercase tracking-wide text-foreground">Security Note</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                This tool helps create stronger passwords, but it does not replace a password manager, two-factor
                authentication, or good account recovery practices.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
