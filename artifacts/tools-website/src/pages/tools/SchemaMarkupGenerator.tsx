import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDashed,
  Code2,
  Copy,
  FileText,
  HelpCircle,
  Package,
  Search,
  Shield,
  Smartphone,
  Sparkles,
  Store,
  Tags,
  Zap,
} from "lucide-react";

type SchemaType = "Article" | "FAQPage" | "LocalBusiness" | "Product";

type FaqDraft = {
  id: number;
  question: string;
  answer: string;
};

type FieldStatus = {
  label: string;
  value: string;
  required?: boolean;
};

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-lime-500/40 transition-colors">
      <button
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-lime-500"
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
            <p className="px-5 pb-5 pt-1 text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cleanValue<T>(value: T): T | undefined {
  if (value === null || value === undefined) return undefined;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return (trimmed ? trimmed : undefined) as T | undefined;
  }

  if (Array.isArray(value)) {
    const cleaned = value
      .map((item) => cleanValue(item))
      .filter((item): item is NonNullable<typeof item> => item !== undefined);

    return (cleaned.length ? cleaned : undefined) as T | undefined;
  }

  if (typeof value === "object") {
    const cleaned = Object.entries(value)
      .map(([key, nestedValue]) => [key, cleanValue(nestedValue)] as const)
      .filter(([, nestedValue]) => nestedValue !== undefined);

    return (cleaned.length ? Object.fromEntries(cleaned) : undefined) as T | undefined;
  }

  return value;
}

const RELATED_TOOLS = [
  {
    title: "Canonical Tag Generator",
    href: "/seo/canonical-tag-generator",
    benefit: "Pair structured data with the right canonical URL.",
    icon: <Tags className="w-4 h-4" />,
    color: 45,
  },
  {
    title: "Open Graph Generator",
    href: "/seo/open-graph-generator",
    benefit: "Keep sharing tags and search markup aligned.",
    icon: <Sparkles className="w-4 h-4" />,
    color: 152,
  },
  {
    title: "Twitter Card Generator",
    href: "/seo/twitter-card-generator",
    benefit: "Generate matching metadata for X cards.",
    icon: <Code2 className="w-4 h-4" />,
    color: 275,
  },
  {
    title: "Robots.txt Generator",
    href: "/seo/robots-txt-generator",
    benefit: "Finish the technical SEO setup.",
    icon: <Search className="w-4 h-4" />,
    color: 217,
  },
];

export default function SchemaMarkupGenerator() {
  const [schemaType, setSchemaType] = useState<SchemaType>("Article");
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const [articleHeadline, setArticleHeadline] = useState("Schema Markup Generator for Technical SEO");
  const [articleDescription, setArticleDescription] = useState(
    "Generate valid JSON-LD structured data for articles, FAQs, products, and local business pages."
  );
  const [articleUrl, setArticleUrl] = useState("https://usonlinetools.com/seo/schema-markup-generator");
  const [articleImage, setArticleImage] = useState("https://usonlinetools.com/images/schema-generator-cover.jpg");
  const [articleAuthor, setArticleAuthor] = useState("Utility Hub Editorial Team");
  const [articlePublisher, setArticlePublisher] = useState("Utility Hub");
  const [articlePublished, setArticlePublished] = useState("2026-04-02");
  const [articleModified, setArticleModified] = useState("2026-04-02");

  const [faqUrl, setFaqUrl] = useState("https://usonlinetools.com/seo/schema-markup-generator");
  const [faqItems, setFaqItems] = useState<FaqDraft[]>([
    {
      id: 1,
      question: "What is schema markup?",
      answer: "Schema markup is structured data that helps search engines understand what a page represents.",
    },
    {
      id: 2,
      question: "Where should JSON-LD go?",
      answer: "Place the generated script on the same page it describes, usually in the head or body template.",
    },
  ]);

  const [businessName, setBusinessName] = useState("Utility Hub Doha");
  const [businessDescription, setBusinessDescription] = useState(
    "Technical SEO consultancy focused on structured data, on-page cleanup, and launch QA."
  );
  const [businessUrl, setBusinessUrl] = useState("https://utilityhub.example/local-seo");
  const [businessImage, setBusinessImage] = useState("https://utilityhub.example/images/storefront.jpg");
  const [businessPhone, setBusinessPhone] = useState("+974 5555 1234");
  const [businessStreet, setBusinessStreet] = useState("West Bay Tower 3");
  const [businessCity, setBusinessCity] = useState("Doha");
  const [businessRegion, setBusinessRegion] = useState("Doha");
  const [businessPostal, setBusinessPostal] = useState("00000");
  const [businessCountry, setBusinessCountry] = useState("QA");
  const [businessHours, setBusinessHours] = useState("Su-Th 09:00-18:00");
  const [businessPriceRange, setBusinessPriceRange] = useState("$$");

  const [productName, setProductName] = useState("Utility Hub SEO Audit");
  const [productDescription, setProductDescription] = useState(
    "A technical SEO audit package covering metadata, structured data, crawlability, and content templates."
  );
  const [productBrand, setProductBrand] = useState("Utility Hub");
  const [productSku, setProductSku] = useState("SEO-AUDIT-001");
  const [productPrice, setProductPrice] = useState("249");
  const [productCurrency, setProductCurrency] = useState("USD");
  const [productAvailability, setProductAvailability] = useState("InStock");
  const [productUrl, setProductUrl] = useState("https://utilityhub.example/services/seo-audit");
  const [productImage, setProductImage] = useState("https://utilityhub.example/images/seo-audit.jpg");

  const faqMainEntity = faqItems
    .filter((item) => item.question.trim() && item.answer.trim())
    .map((item) => ({
      "@type": "Question",
      name: item.question.trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.trim(),
      },
    }));

  const activeFields = useMemo<FieldStatus[]>(() => {
    switch (schemaType) {
      case "Article":
        return [
          { label: "Headline", value: articleHeadline, required: true },
          { label: "Description", value: articleDescription, required: true },
          { label: "Canonical URL", value: articleUrl, required: true },
          { label: "Image URL", value: articleImage, required: true },
          { label: "Author", value: articleAuthor, required: true },
          { label: "Publisher", value: articlePublisher, required: true },
          { label: "Published date", value: articlePublished, required: true },
          { label: "Modified date", value: articleModified, required: true },
        ];
      case "FAQPage":
        return [
          { label: "Page URL", value: faqUrl, required: true },
          { label: "Complete Q&A pairs", value: String(faqMainEntity.length), required: true },
        ];
      case "LocalBusiness":
        return [
          { label: "Business name", value: businessName, required: true },
          { label: "Description", value: businessDescription, required: true },
          { label: "Page URL", value: businessUrl, required: true },
          { label: "Phone", value: businessPhone, required: true },
          { label: "Street address", value: businessStreet, required: true },
          { label: "City", value: businessCity, required: true },
          { label: "Country code", value: businessCountry, required: true },
        ];
      case "Product":
        return [
          { label: "Product name", value: productName, required: true },
          { label: "Description", value: productDescription, required: true },
          { label: "Brand", value: productBrand, required: true },
          { label: "Price", value: productPrice, required: true },
          { label: "Currency", value: productCurrency, required: true },
          { label: "Availability", value: productAvailability, required: true },
          { label: "Product URL", value: productUrl, required: true },
        ];
    }
  }, [
    articleAuthor,
    articleDescription,
    articleHeadline,
    articleImage,
    articleModified,
    articlePublished,
    articlePublisher,
    articleUrl,
    businessCity,
    businessCountry,
    businessDescription,
    businessName,
    businessPhone,
    businessStreet,
    businessUrl,
    faqMainEntity.length,
    faqUrl,
    productAvailability,
    productBrand,
    productCurrency,
    productDescription,
    productName,
    productPrice,
    productUrl,
    schemaType,
  ]);

  const requiredFields = activeFields.filter((field) => field.required);
  const completedRequiredFields = requiredFields.filter((field) => field.value.trim() !== "" && field.value !== "0").length;
  const completionPercent = Math.round((completedRequiredFields / requiredFields.length) * 100);

  const schemaObject = useMemo(() => {
    switch (schemaType) {
      case "Article":
        return cleanValue({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: articleHeadline,
          description: articleDescription,
          mainEntityOfPage: articleUrl ? { "@type": "WebPage", "@id": articleUrl } : undefined,
          image: articleImage ? [articleImage] : undefined,
          author: articleAuthor ? { "@type": "Person", name: articleAuthor } : undefined,
          publisher: articlePublisher ? { "@type": "Organization", name: articlePublisher } : undefined,
          datePublished: articlePublished,
          dateModified: articleModified,
        });
      case "FAQPage":
        return cleanValue({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          url: faqUrl,
          mainEntity: faqMainEntity,
        });
      case "LocalBusiness":
        return cleanValue({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: businessName,
          description: businessDescription,
          url: businessUrl,
          image: businessImage ? [businessImage] : undefined,
          telephone: businessPhone,
          openingHours: businessHours,
          priceRange: businessPriceRange,
          address: {
            "@type": "PostalAddress",
            streetAddress: businessStreet,
            addressLocality: businessCity,
            addressRegion: businessRegion,
            postalCode: businessPostal,
            addressCountry: businessCountry,
          },
        });
      case "Product":
        return cleanValue({
          "@context": "https://schema.org",
          "@type": "Product",
          name: productName,
          description: productDescription,
          brand: productBrand ? { "@type": "Brand", name: productBrand } : undefined,
          sku: productSku,
          image: productImage ? [productImage] : undefined,
          url: productUrl,
          offers:
            productPrice && productCurrency
              ? {
                  "@type": "Offer",
                  price: productPrice,
                  priceCurrency: productCurrency,
                  availability: `https://schema.org/${productAvailability}`,
                  url: productUrl,
                }
              : undefined,
        });
    }
  }, [
    articleAuthor,
    articleDescription,
    articleHeadline,
    articleImage,
    articleModified,
    articlePublished,
    articlePublisher,
    articleUrl,
    businessCity,
    businessCountry,
    businessDescription,
    businessHours,
    businessImage,
    businessName,
    businessPhone,
    businessPostal,
    businessPriceRange,
    businessRegion,
    businessStreet,
    businessUrl,
    faqMainEntity,
    faqUrl,
    productAvailability,
    productBrand,
    productCurrency,
    productDescription,
    productImage,
    productName,
    productPrice,
    productSku,
    productUrl,
    schemaType,
  ]);

  const generatedJson = useMemo(() => JSON.stringify(schemaObject ?? {}, null, 2) ?? "{}", [schemaObject]);
  const generatedScript = `<script type="application/ld+json">\n${generatedJson}\n</script>`;

  const validationNotes = useMemo(() => {
    const notes: string[] = [];
    const absoluteUrlPattern = /^https?:\/\//i;
    const urls =
      schemaType === "Article"
        ? [articleUrl, articleImage]
        : schemaType === "FAQPage"
          ? [faqUrl]
          : schemaType === "LocalBusiness"
            ? [businessUrl, businessImage]
            : [productUrl, productImage];

    if (schemaType === "FAQPage" && faqMainEntity.length === 0) {
      notes.push("Add at least one complete question-and-answer pair before publishing FAQPage schema.");
    }
    if (urls.some((value) => value.trim() && !absoluteUrlPattern.test(value.trim()))) {
      notes.push("Use absolute URLs for page and image fields so crawlers resolve them correctly.");
    }
    if (schemaType === "Product" && !/^[A-Z]{3}$/.test(productCurrency.trim())) {
      notes.push("Use a 3-letter ISO currency code such as USD, EUR, or QAR.");
    }
    if (schemaType === "Article" && articlePublished && articleModified && articleModified < articlePublished) {
      notes.push("The modified date should not be earlier than the published date.");
    }

    return notes;
  }, [
    articleImage,
    articleModified,
    articlePublished,
    articleUrl,
    businessImage,
    businessUrl,
    faqMainEntity.length,
    faqUrl,
    productCurrency,
    productImage,
    productUrl,
    schemaType,
  ]);

  const workflowSteps = [
    { label: "Choose the schema type", done: true, detail: schemaType },
    {
      label: "Fill the required fields",
      done: completedRequiredFields === requiredFields.length,
      detail: `${completedRequiredFields} of ${requiredFields.length} required fields completed`,
    },
    { label: "Review the generated JSON-LD", done: generatedJson.length > 0, detail: `${generatedJson.split("\n").length} lines generated` },
    {
      label: "Copy and deploy the snippet",
      done: completedRequiredFields === requiredFields.length && validationNotes.length === 0,
      detail: validationNotes.length === 0 ? "Ready to paste" : `${validationNotes.length} note(s) to review`,
    },
  ];

  const updateFaqItem = (id: number, key: "question" | "answer", value: string) => {
    setFaqItems((items) => items.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  };

  const addFaqItem = () => {
    setFaqItems((items) => [...items, { id: Date.now(), question: "", answer: "" }]);
  };

  const removeFaqItem = (id: number) => {
    setFaqItems((items) => (items.length > 1 ? items.filter((item) => item.id !== id) : items));
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const copyPageLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    window.setTimeout(() => setLinkCopied(false), 1800);
  };

  return (
    <Layout>
      <SEO
        title="Schema Markup Generator - Create JSON-LD Structured Data | US Online Tools"
        description="Free schema markup generator. Build Article, FAQPage, LocalBusiness, and Product JSON-LD with instant browser-side output and copy-ready script tags."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-lime-500" strokeWidth={3} />
          <Link href="/category/seo" className="text-muted-foreground hover:text-foreground transition-colors">SEO Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-lime-500" strokeWidth={3} />
          <span className="text-foreground">Schema Markup Generator</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-lime-500/15 bg-gradient-to-br from-lime-500/5 via-card to-green-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            SEO Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Schema Markup Generator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Generate clean JSON-LD for articles, FAQ pages, local businesses, and product pages. The code updates instantly as you type, with live step-by-step progress so you can see what is ready to publish.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><BadgeCheck className="w-3.5 h-3.5" /> 100% Free</span>
            <span className="inline-flex items-center gap-1.5 bg-lime-500/10 text-lime-600 dark:text-lime-400 font-bold text-xs px-3 py-1.5 rounded-full border border-lime-500/20"><Zap className="w-3.5 h-3.5" /> Instant Results</span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><Shield className="w-3.5 h-3.5" /> Browser-Side</span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20"><Smartphone className="w-3.5 h-3.5" /> Mobile Ready</span>
          </div>
          <p className="text-xs text-muted-foreground/70 font-medium">
            Use it for rich results, implementation handoff, launch QA, and metadata cleanup
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">
            <section id="generator">
              <div className="rounded-2xl overflow-hidden border border-lime-500/20 shadow-lg shadow-lime-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-lime-500 to-green-400" />
                <div className="bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-500 to-green-400 flex items-center justify-center flex-shrink-0">
                      <Code2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Structured Data Builder</p>
                      <p className="text-sm text-muted-foreground">Fill the fields and copy production-ready JSON-LD.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-6">
                    <div className="space-y-5">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Schema Type</label>
                        <select value={schemaType} onChange={(event) => setSchemaType(event.target.value as SchemaType)} className="tool-calc-input w-full">
                          <option value="Article">Article</option>
                          <option value="FAQPage">FAQPage</option>
                          <option value="LocalBusiness">LocalBusiness</option>
                          <option value="Product">Product</option>
                        </select>
                      </div>

                      {schemaType === "Article" && (
                        <div className="space-y-5">
                          <input value={articleHeadline} onChange={(event) => setArticleHeadline(event.target.value)} placeholder="Headline" className="tool-calc-input w-full" />
                          <textarea value={articleDescription} onChange={(event) => setArticleDescription(event.target.value)} placeholder="Description" className="tool-calc-input w-full min-h-[120px] resize-y" />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <input value={articleUrl} onChange={(event) => setArticleUrl(event.target.value)} placeholder="Canonical URL" className="tool-calc-input w-full" />
                            <input value={articleImage} onChange={(event) => setArticleImage(event.target.value)} placeholder="Image URL" className="tool-calc-input w-full" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <input value={articleAuthor} onChange={(event) => setArticleAuthor(event.target.value)} placeholder="Author" className="tool-calc-input w-full" />
                            <input value={articlePublisher} onChange={(event) => setArticlePublisher(event.target.value)} placeholder="Publisher" className="tool-calc-input w-full" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <input type="date" value={articlePublished} onChange={(event) => setArticlePublished(event.target.value)} className="tool-calc-input w-full" />
                            <input type="date" value={articleModified} onChange={(event) => setArticleModified(event.target.value)} className="tool-calc-input w-full" />
                          </div>
                        </div>
                      )}

                      {schemaType === "FAQPage" && (
                        <div className="space-y-5">
                          <input value={faqUrl} onChange={(event) => setFaqUrl(event.target.value)} placeholder="Page URL" className="tool-calc-input w-full" />
                          <div className="space-y-4">
                            {faqItems.map((item, index) => (
                              <div key={item.id} className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-sm font-bold text-foreground">FAQ Pair {index + 1}</p>
                                  <button onClick={() => removeFaqItem(item.id)} className="text-xs font-bold text-muted-foreground hover:text-red-500 transition-colors">Remove</button>
                                </div>
                                <input value={item.question} onChange={(event) => updateFaqItem(item.id, "question", event.target.value)} placeholder="Question" className="tool-calc-input w-full" />
                                <textarea value={item.answer} onChange={(event) => updateFaqItem(item.id, "answer", event.target.value)} placeholder="Answer" className="tool-calc-input w-full min-h-[100px] resize-y" />
                              </div>
                            ))}
                            <button onClick={addFaqItem} className="inline-flex items-center gap-2 rounded-xl bg-lime-500/10 text-lime-700 dark:text-lime-400 px-4 py-2.5 text-sm font-bold border border-lime-500/20">
                              <Sparkles className="w-4 h-4" />
                              Add Another FAQ
                            </button>
                          </div>
                        </div>
                      )}

                      {schemaType === "LocalBusiness" && (
                        <div className="space-y-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <input value={businessName} onChange={(event) => setBusinessName(event.target.value)} placeholder="Business name" className="tool-calc-input w-full" />
                            <input value={businessPhone} onChange={(event) => setBusinessPhone(event.target.value)} placeholder="Phone" className="tool-calc-input w-full" />
                          </div>
                          <textarea value={businessDescription} onChange={(event) => setBusinessDescription(event.target.value)} placeholder="Description" className="tool-calc-input w-full min-h-[110px] resize-y" />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <input value={businessUrl} onChange={(event) => setBusinessUrl(event.target.value)} placeholder="Page URL" className="tool-calc-input w-full" />
                            <input value={businessImage} onChange={(event) => setBusinessImage(event.target.value)} placeholder="Image URL" className="tool-calc-input w-full" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <input value={businessStreet} onChange={(event) => setBusinessStreet(event.target.value)} placeholder="Street address" className="tool-calc-input w-full" />
                            <input value={businessCity} onChange={(event) => setBusinessCity(event.target.value)} placeholder="City" className="tool-calc-input w-full" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <input value={businessRegion} onChange={(event) => setBusinessRegion(event.target.value)} placeholder="Region" className="tool-calc-input w-full" />
                            <input value={businessPostal} onChange={(event) => setBusinessPostal(event.target.value)} placeholder="Postal code" className="tool-calc-input w-full" />
                            <input value={businessCountry} onChange={(event) => setBusinessCountry(event.target.value)} placeholder="Country code" className="tool-calc-input w-full" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <input value={businessHours} onChange={(event) => setBusinessHours(event.target.value)} placeholder="Opening hours" className="tool-calc-input w-full" />
                            <input value={businessPriceRange} onChange={(event) => setBusinessPriceRange(event.target.value)} placeholder="Price range" className="tool-calc-input w-full" />
                          </div>
                        </div>
                      )}

                      {schemaType === "Product" && (
                        <div className="space-y-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <input value={productName} onChange={(event) => setProductName(event.target.value)} placeholder="Product name" className="tool-calc-input w-full" />
                            <input value={productBrand} onChange={(event) => setProductBrand(event.target.value)} placeholder="Brand" className="tool-calc-input w-full" />
                          </div>
                          <textarea value={productDescription} onChange={(event) => setProductDescription(event.target.value)} placeholder="Description" className="tool-calc-input w-full min-h-[110px] resize-y" />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <input value={productSku} onChange={(event) => setProductSku(event.target.value)} placeholder="SKU" className="tool-calc-input w-full" />
                            <input value={productUrl} onChange={(event) => setProductUrl(event.target.value)} placeholder="Product URL" className="tool-calc-input w-full" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <input value={productImage} onChange={(event) => setProductImage(event.target.value)} placeholder="Image URL" className="tool-calc-input w-full" />
                            <select value={productAvailability} onChange={(event) => setProductAvailability(event.target.value)} className="tool-calc-input w-full">
                              <option value="InStock">InStock</option>
                              <option value="OutOfStock">OutOfStock</option>
                              <option value="PreOrder">PreOrder</option>
                              <option value="BackOrder">BackOrder</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <input value={productPrice} onChange={(event) => setProductPrice(event.target.value)} placeholder="Price" className="tool-calc-input w-full" />
                            <input value={productCurrency} onChange={(event) => setProductCurrency(event.target.value.toUpperCase())} placeholder="Currency (USD)" className="tool-calc-input w-full" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-lime-500/20 bg-lime-500/5 p-5">
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-lime-700 dark:text-lime-400">Live Build Progress</p>
                            <p className="text-sm text-muted-foreground">The generator updates each step in real time.</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-foreground">{completionPercent}%</p>
                            <p className="text-xs text-muted-foreground">required fields ready</p>
                          </div>
                        </div>
                        <div className="h-2 rounded-full bg-background overflow-hidden mb-4">
                          <div className="h-full bg-gradient-to-r from-lime-500 to-green-400" style={{ width: `${completionPercent}%` }} />
                        </div>
                        <div className="space-y-3">
                          {workflowSteps.map((step) => (
                            <div key={step.label} className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-background border border-border flex-shrink-0">
                                {step.done ? <CheckCircle2 className="w-4 h-4 text-lime-500" /> : <CircleDashed className="w-4 h-4 text-muted-foreground" />}
                              </div>
                              <div>
                                <p className="font-bold text-sm text-foreground">{step.label}</p>
                                <p className="text-xs text-muted-foreground">{step.detail}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-background p-5">
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Generated JSON-LD</p>
                            <p className="text-sm text-muted-foreground">Ready-to-paste script output.</p>
                          </div>
                          <button onClick={copyCode} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${copied ? "bg-emerald-500 text-white" : "bg-lime-500 text-zinc-950 hover:bg-lime-400"}`}>
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? "Copied" : "Copy Snippet"}
                          </button>
                        </div>
                        <textarea readOnly value={generatedScript} className="w-full h-[360px] rounded-xl bg-zinc-950 text-lime-400 p-4 text-sm font-mono resize-none outline-none" />
                      </div>

                      <div className="rounded-2xl border border-border bg-card p-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Validation Notes</p>
                        <div className="space-y-3">
                          {validationNotes.length === 0 ? (
                            <div className="flex items-start gap-3">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-muted-foreground">No immediate issues detected in the current draft. Keep the markup synchronized with visible page content.</p>
                            </div>
                          ) : (
                            validationNotes.map((note) => (
                              <div key={note} className="flex items-start gap-3">
                                <HelpCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-muted-foreground">{note}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="how-to-use">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Schema Markup Generator</h2>
              <ol className="space-y-5">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">1</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Pick the schema type that matches the page</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Use `Article` for editorial content, `FAQPage` for visible Q&A sections, `LocalBusiness` for location-based businesses, and `Product` for single product pages.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">2</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Fill in the required fields and watch the steps complete</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">The progress block updates instantly, so you can see in real time whether the schema is still missing core data or is ready to deploy.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">3</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Review the JSON-LD and fix any notes</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Absolute URLs, correct dates, and complete FAQ entries matter. The notes panel highlights the most common issues before you copy the snippet.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">4</div>
                  <div>
                    <p className="font-bold text-foreground mb-1">Publish it on the exact page it describes</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">Structured data works best when the markup faithfully mirrors what users can actually read on the live page.</p>
                  </div>
                </li>
              </ol>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="rules">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Tag and Markup Rules</h2>
              <div className="space-y-4">
                <div className="p-5 rounded-xl border border-lime-500/20 bg-lime-500/5">
                  <p className="font-bold text-foreground mb-2">Match the schema type to the visible page content</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">Do not publish FAQPage schema on a page that does not actually show the same questions and answers. Search engines expect the markup to reflect the live page honestly.</p>
                </div>
                <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                  <p className="font-bold text-foreground mb-2">Use stable absolute URLs for pages and images</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">JSON-LD should reference the final canonical URL and crawlable image URLs. Relative paths and staging links create avoidable ambiguity.</p>
                </div>
                <div className="p-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
                  <p className="font-bold text-foreground mb-2">Prefer accurate fields over inflated markup</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">A smaller but truthful schema block is safer than adding fake ratings, fabricated reviews, or placeholder business details just to fill fields.</p>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="implementation-guide">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Implementation Guide</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">Paste the output as JSON-LD.</strong> The generator wraps your data in a script tag, so you can drop it straight into a page template, a CMS head field, or a metadata component.</p>
                <p><strong className="text-foreground">Keep one source of truth.</strong> The headline, product price, business phone, and FAQ answers in the markup should stay synchronized with what visitors see on the page.</p>
                <p><strong className="text-foreground">Validate after deployment.</strong> This tool gives you clean output, but final QA still matters. Check the live HTML and make sure you are not shipping conflicting schema blocks.</p>
              </div>
              <div className="mt-6 rounded-2xl bg-zinc-950 text-lime-400 p-5 font-mono text-sm overflow-x-auto">
                {`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Example headline"
}
</script>`}
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="examples">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Quick Examples</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-2xl border border-border p-5 bg-muted/20">
                  <div className="flex items-center gap-3 mb-3"><FileText className="w-5 h-5 text-lime-500" /><p className="font-bold text-foreground">Article schema</p></div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Use it for blog posts, case studies, newsroom articles, and documentation pages that have a clear headline, author, date, and canonical URL.</p>
                </div>
                <div className="rounded-2xl border border-border p-5 bg-muted/20">
                  <div className="flex items-center gap-3 mb-3"><HelpCircle className="w-5 h-5 text-lime-500" /><p className="font-bold text-foreground">FAQPage schema</p></div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Ideal for support pages, service landing pages, pricing FAQs, and onboarding hubs with visible question-and-answer content.</p>
                </div>
                <div className="rounded-2xl border border-border p-5 bg-muted/20">
                  <div className="flex items-center gap-3 mb-3"><Store className="w-5 h-5 text-lime-500" /><p className="font-bold text-foreground">LocalBusiness schema</p></div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Best for agencies, clinics, restaurants, shops, and local service businesses that need address, phone, hours, and business identity data.</p>
                </div>
                <div className="rounded-2xl border border-border p-5 bg-muted/20">
                  <div className="flex items-center gap-3 mb-3"><Package className="w-5 h-5 text-lime-500" /><p className="font-bold text-foreground">Product schema</p></div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Use it on product detail pages where the price, currency, availability, brand, and product URL all belong to one specific offer.</p>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="why-choose">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Why Use This Schema Markup Generator?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
                <p><strong className="text-foreground">It is built for implementation work.</strong> This is a real schema builder with live output and validation notes, not placeholder copy.</p>
                <p><strong className="text-foreground">The workflow stays local and fast.</strong> Everything runs in the browser, which makes it useful for draft pages, QA passes, and client handoff without shipping your inputs anywhere else.</p>
                <p><strong className="text-foreground">The page follows the same content anatomy as the percentage calculator.</strong> You get a full production-style tool page, adapted for structured data instead of arithmetic.</p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <FaqItem q="What is JSON-LD schema markup?" a="JSON-LD is a structured data format that helps search engines understand entities and page meaning. It is usually easier to maintain than inline microdata." />
                <FaqItem q="Does schema markup guarantee rich results?" a="No. It improves clarity and eligibility, but search engines still decide whether to show rich results based on page quality, trust, and query context." />
                <FaqItem q="Can I add more than one schema block to a page?" a="Yes, if the blocks describe real visible content on that page and do not contradict each other." />
                <FaqItem q="Where should I place the generated script?" a="Most teams place JSON-LD in the head, but it can also be in the body as long as it renders on the final page HTML." />
                <FaqItem q="Why should the page URL be canonical and absolute?" a="It helps crawlers tie the schema to the correct final page instead of a preview, parameterized, or relative URL." />
                <FaqItem q="Should I fill every possible field?" a="No. Focus on the fields you can keep accurate over time. Truthful structured data is more valuable than bloated markup." />
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-lime-500 to-green-400 p-8 text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h2 className="text-2xl font-black tracking-tight mb-2">Need the Rest of the Metadata Stack?</h2>
                <p className="text-white/85 mb-6 max-w-xl">Pair structured data with canonical tags, Open Graph markup, and robots rules so the same page is consistent across search, sharing, and crawl control.</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/category/seo" className="inline-flex items-center gap-2 rounded-xl bg-white text-green-700 px-5 py-3 font-bold">
                    Explore SEO Tools
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED_TOOLS.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all"
                    >
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5"
                        style={{ background: `linear-gradient(135deg, hsl(${tool.color} 70% 55%), hsl(${tool.color} 75% 42%))` }}
                      >
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate">{tool.benefit}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-lime-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-1.5">Share This Tool</h3>
                <p className="text-xs text-muted-foreground mb-3">Share this schema builder with your SEO workflow.</p>
                <button
                  onClick={copyPageLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-lime-500 to-green-400 text-white text-sm font-bold rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                >
                  {linkCopied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                </button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {[
                    "Generator",
                    "How to Use",
                    "Rules",
                    "Implementation Guide",
                    "Examples",
                    "Why Choose",
                    "FAQ",
                  ].map((label) => (
                    <a
                      key={label}
                      href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-lime-500 font-medium py-1.5 transition-colors"
                    >
                      <div className="w-1 h-1 rounded-full bg-lime-500/40 flex-shrink-0" />
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
