import { useMemo, useState } from "react";
import { CheckCircle2, Copy, Globe, Image as ImageIcon, Link2, Palette, Shield } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

function joinAssetPath(basePath: string, filename: string) {
  const normalized = basePath.trim();

  if (!normalized || normalized === "/") {
    return `/${filename}`;
  }

  return `${normalized.replace(/\/+$/, "")}/${filename}`;
}

function normalizeSiteUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  try {
    const candidate = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
    const parsed = new URL(candidate);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return "";
  }
}

export default function FaviconCodeGenerator() {
  const [siteName, setSiteName] = useState("Example Site");
  const [siteUrl, setSiteUrl] = useState("https://example.com");
  const [basePath, setBasePath] = useState("/");
  const [themeColor, setThemeColor] = useState("#0f172a");
  const [maskIconColor, setMaskIconColor] = useState("#0f172a");
  const [includeManifest, setIncludeManifest] = useState(true);
  const [includeAppleTouch, setIncludeAppleTouch] = useState(true);
  const [copied, setCopied] = useState("");

  const headCode = useMemo(() => {
    const lines = [
      `<link rel="icon" type="image/png" sizes="32x32" href="${joinAssetPath(basePath, "favicon-32x32.png")}" />`,
      `<link rel="icon" type="image/png" sizes="16x16" href="${joinAssetPath(basePath, "favicon-16x16.png")}" />`,
      `<link rel="shortcut icon" href="${joinAssetPath(basePath, "favicon.ico")}" />`,
    ];

    if (includeAppleTouch) {
      lines.push(`<link rel="apple-touch-icon" sizes="180x180" href="${joinAssetPath(basePath, "apple-touch-icon.png")}" />`);
    }

    lines.push(`<link rel="mask-icon" href="${joinAssetPath(basePath, "safari-pinned-tab.svg")}" color="${maskIconColor}" />`);

    if (includeManifest) {
      lines.push(`<link rel="manifest" href="${joinAssetPath(basePath, "site.webmanifest")}" />`);
    }

    lines.push(`<meta name="theme-color" content="${themeColor}" />`);
    lines.push(`<meta name="msapplication-TileColor" content="${themeColor}" />`);

    return lines.join("\n");
  }, [basePath, includeAppleTouch, includeManifest, maskIconColor, themeColor]);

  const manifestJson = useMemo(
    () =>
      JSON.stringify(
        {
          name: siteName,
          short_name: siteName.length > 12 ? `${siteName.slice(0, 12).trim()}...` : siteName,
          icons: [
            {
              src: joinAssetPath(basePath, "android-chrome-192x192.png"),
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: joinAssetPath(basePath, "android-chrome-512x512.png"),
              sizes: "512x512",
              type: "image/png",
            },
          ],
          theme_color: themeColor,
          background_color: themeColor,
          display: "standalone",
        },
        null,
        2,
      ),
    [basePath, siteName, themeColor],
  );

  const deploymentSummary = useMemo(
    () =>
      [
        `Site name: ${siteName}`,
        `Site URL: ${siteUrl}`,
        `Base path: ${basePath}`,
        `Theme color: ${themeColor}`,
        `Apple touch icon: ${includeAppleTouch ? "Included" : "Skipped"}`,
        `Manifest file: ${includeManifest ? "Included" : "Skipped"}`,
        `Mask icon color: ${maskIconColor}`,
      ].join("\n"),
    [basePath, includeAppleTouch, includeManifest, maskIconColor, siteName, siteUrl, themeColor],
  );

  const normalizedSiteUrl = useMemo(() => normalizeSiteUrl(siteUrl), [siteUrl]);

  const faviconCheck = useMemo(() => {
    if (!siteUrl.trim()) {
      return {
        status: "Missing site URL",
        detail: "Enter your site URL to validate and preview final favicon file URLs.",
        sampleUrl: "",
      };
    }

    if (!normalizedSiteUrl) {
      return {
        status: "Invalid URL format",
        detail: "Use a valid domain like https://example.com or example.com.",
        sampleUrl: "",
      };
    }

    return {
      status: "URL looks valid",
      detail: "Use the sample URL below to quickly test whether your favicon is publicly reachable.",
      sampleUrl: `${normalizedSiteUrl}${joinAssetPath(basePath, "favicon.ico")}`,
    };
  }, [basePath, normalizedSiteUrl, siteUrl]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  };

  const calculator = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setSiteName("Example Site");
            setSiteUrl("https://example.com");
            setBasePath("/");
            setThemeColor("#0f172a");
            setMaskIconColor("#0f172a");
            setIncludeManifest(true);
            setIncludeAppleTouch(true);
          }}
          className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:border-blue-500/40 hover:bg-muted transition-colors"
        >
          Root Site Preset
        </button>
        <button
          onClick={() => {
            setSiteName("Docs Portal");
            setSiteUrl("https://docs.example.com");
            setBasePath("/docs");
            setThemeColor("#2563eb");
            setMaskIconColor("#111827");
            setIncludeManifest(true);
            setIncludeAppleTouch(true);
          }}
          className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:border-blue-500/40 hover:bg-muted transition-colors"
        >
          Subfolder Preset
        </button>
        <button
          onClick={() => {
            setSiteName("Landing Page");
            setSiteUrl("https://campaign.example.com");
            setBasePath("/");
            setThemeColor("#16a34a");
            setMaskIconColor("#16a34a");
            setIncludeManifest(false);
            setIncludeAppleTouch(true);
          }}
          className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:border-blue-500/40 hover:bg-muted transition-colors"
        >
          Marketing Preset
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Favicon Controls</p>
                <p className="text-sm text-muted-foreground">Generate the HTML head tags and manifest JSON needed for modern browser and device favicon support.</p>
              </div>
              <ImageIcon className="h-5 w-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Site Name</label>
                <input value={siteName} onChange={(event) => setSiteName(event.target.value)} spellCheck={false} className="tool-calc-input w-full" placeholder="Site name" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Site URL</label>
                <input value={siteUrl} onChange={(event) => setSiteUrl(event.target.value)} spellCheck={false} className="tool-calc-input w-full font-mono" placeholder="https://example.com" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Asset Base Path</label>
                <input value={basePath} onChange={(event) => setBasePath(event.target.value || "/")} spellCheck={false} className="tool-calc-input w-full font-mono" placeholder="/" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Theme Color</label>
                <input type="color" value={themeColor} onChange={(event) => setThemeColor(event.target.value)} className="h-11 w-full rounded-xl border border-border bg-background p-1" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Mask Icon Color</label>
                <input type="color" value={maskIconColor} onChange={(event) => setMaskIconColor(event.target.value)} className="h-11 w-full rounded-xl border border-border bg-background p-1" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                <input type="checkbox" checked={includeAppleTouch} onChange={(event) => setIncludeAppleTouch(event.target.checked)} className="mt-0.5" />
                <span>
                  <span className="block font-bold text-foreground">Include Apple touch icon</span>
                  <span className="block mt-1">Adds the iPhone and iPad home-screen icon line for `apple-touch-icon.png`.</span>
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                <input type="checkbox" checked={includeManifest} onChange={(event) => setIncludeManifest(event.target.checked)} className="mt-0.5" />
                <span>
                  <span className="block font-bold text-foreground">Include site manifest</span>
                  <span className="block mt-1">Adds the `site.webmanifest` line and generates manifest JSON below for Android or PWA-style installs.</span>
                </span>
              </label>
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Favicon PNG</p><p className="mt-2 text-xl font-black text-foreground">16 / 32</p></div>
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Apple Icon</p><p className="mt-2 text-xl font-black text-foreground">{includeAppleTouch ? "180" : "Off"}</p></div>
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Manifest</p><p className="mt-2 text-xl font-black text-foreground">{includeManifest ? "On" : "Off"}</p></div>
              <div className="rounded-xl border border-border bg-card p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Theme</p><p className="mt-2 text-xl font-black text-foreground">{themeColor.toUpperCase()}</p></div>
            </div>

            <div className="mt-4 rounded-xl border border-blue-500/20 bg-background p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">URL Check</p>
                <span className={`text-xs font-bold ${faviconCheck.status === "URL looks valid" ? "text-emerald-600" : "text-amber-600"}`}>{faviconCheck.status}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{faviconCheck.detail}</p>
              {faviconCheck.sampleUrl ? <p className="mt-2 font-mono text-xs text-foreground break-all">{faviconCheck.sampleUrl}</p> : null}
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Head Tag Output</p>
                <p className="text-sm text-muted-foreground">Paste these tags into the document head of your site or framework layout.</p>
              </div>
              <button onClick={() => copyValue("head", headCode)} className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-xs font-bold text-foreground hover:bg-muted">
                <Copy className="h-3.5 w-3.5" />
                {copied === "head" ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea readOnly value={headCode} spellCheck={false} className="min-h-[180px] w-full resize-y rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none" />
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Manifest JSON</p>
                <p className="text-sm text-muted-foreground">Use this as `site.webmanifest` when you want installable or Android-friendly favicon metadata.</p>
              </div>
              <button onClick={() => copyValue("manifest", manifestJson)} disabled={!includeManifest} className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-xs font-bold text-foreground hover:bg-muted disabled:opacity-50">
                <Copy className="h-3.5 w-3.5" />
                {copied === "manifest" ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea readOnly value={includeManifest ? manifestJson : "Manifest output is disabled. Turn on the manifest option to generate the JSON file."} spellCheck={false} className="min-h-[180px] w-full resize-y rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none" />
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Implementation Reading</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Base Path Handling</p>
                <p className="mt-1">Use `/` for root-hosted sites, or a subfolder like `/docs` when your favicon assets live inside a nested deployment path.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Apple Touch Icon</p>
                <p className="mt-1">This is still important for iPhone and iPad home-screen shortcuts, even if your site is not a full PWA.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Manifest File</p>
                <p className="mt-1">The manifest is useful when you want Android install support, app-style naming, or a fuller icon set beyond the basic favicon lines.</p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="font-bold text-foreground">Keep Asset Filenames Consistent</p>
                <p className="mt-1">The generated HTML assumes standard favicon filenames. If your pipeline outputs different names, update the code before deploying.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Copy-Ready Notes</p>
            {[
              { label: "Deployment summary", value: deploymentSummary },
              { label: "Asset checklist", value: ["favicon.ico", "favicon-16x16.png", "favicon-32x32.png", includeAppleTouch ? "apple-touch-icon.png" : null, includeManifest ? "site.webmanifest" : null, "android-chrome-192x192.png", "android-chrome-512x512.png", "safari-pinned-tab.svg"].filter(Boolean).join("\n") },
            ].map((item) => (
              <div key={item.label} className="mb-3 rounded-xl border border-border bg-muted/40 p-3 last:mb-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                  <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600">
                    {copied === item.label ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100"><code>{item.value}</code></pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Favicon Code Generator"
      seoTitle="Favicon Code Generator - HTML Head Tags and Manifest Builder"
      seoDescription="Free favicon code generator. Create HTML head tags and web manifest JSON for modern favicon support across browsers and devices."
      canonical="https://usonlinetools.com/seo/favicon-checker"
      categoryName="SEO Tools"
      categoryHref="/category/seo"
      heroDescription="Generate the favicon HTML tags and manifest JSON needed for browser tabs, iPhone home-screen icons, Android installs, and Safari pinned tabs. Configure the base path and theme colors, then copy production-ready code."
      heroIcon={<ImageIcon className="h-3.5 w-3.5" />}
      calculatorLabel="Favicon Head Builder"
      calculatorDescription="Set the asset path and site details, then copy the head tags and optional manifest file output."
      calculator={calculator}
      howSteps={[
        { title: "Set the base path where the favicon files live", description: "Use `/` when the icons are served from the site root, or point to a subfolder like `/docs` when the site is deployed beneath a nested path." },
        { title: "Choose whether to include Apple touch and manifest support", description: "Apple touch icons help on iPhone and iPad home screens, while the manifest adds Android and install-related metadata." },
        { title: "Copy the generated head tags into your global layout", description: "Paste the HTML lines into the document head used by your site or framework so every page loads the same favicon references." },
        { title: "Save the manifest JSON if that option is enabled", description: "Use the generated JSON as `site.webmanifest`, then make sure the referenced PNG files actually exist at the paths shown in the code." },
      ]}
      interpretationCards={[
        { title: "Favicon HTML is still multi-file by default", description: "Modern sites usually need more than one icon size to cover tabs, home-screen icons, Android launches, and Safari pinned tabs.", className: "bg-blue-500/5 border-blue-500/20" },
        { title: "Base path errors break icons quietly", description: "If the path is wrong, browsers simply fail to load the icon assets, so matching the generated paths to your deployment is critical.", className: "bg-amber-500/5 border-amber-500/20" },
        { title: "Theme color affects browser chrome and installs", description: "Theme color is used by some browsers and install prompts to tint UI surfaces around your site or app.", className: "bg-emerald-500/5 border-emerald-500/20" },
        { title: "Manifest support is useful beyond full PWAs", description: "Even simple sites can benefit from a manifest when they want stronger Android icon handling or install-like behavior.", className: "bg-cyan-500/5 border-cyan-500/20" },
      ]}
      examples={[
        { scenario: "Root-hosted marketing site", input: "Base path `/` with standard favicon filenames", output: "Copy head tags directly into the main site layout" },
        { scenario: "Docs site under a subfolder", input: "Base path `/docs`", output: "Generate favicon links that resolve correctly inside nested deployments" },
        { scenario: "PWA-style setup", input: "Include manifest + Android icon files", output: "Get both head tags and ready-to-save manifest JSON" },
        { scenario: "Rebrand rollout", input: "New theme color + mask icon color", output: "Update browser and pinned-tab visuals across devices" },
      ]}
      whyChoosePoints={[
        "This page generates real favicon head code and manifest JSON instead of generic SEO placeholder text.",
        "The base-path control makes it usable for both root-hosted and subfolder deployments.",
        "Apple touch, Safari pinned tab, and Android manifest support are covered in one workflow.",
        "The output is copy-ready for framework layouts, HTML documents, or CMS header areas.",
        "The page follows the same long-form structure as the site's flagship calculator pages while keeping the working generator above the fold.",
      ]}
      faqs={[
        { q: "Why do I need more than one favicon file?", a: "Different browsers and devices use different sizes and file types, so a fuller favicon setup usually includes PNGs, an ICO, and sometimes a manifest and mask icon." },
        { q: "What should I enter for the base path?", a: "Use `/` if the icon files live at the root of the site. Use a nested path like `/docs` if the assets are served from a subfolder." },
        { q: "Do I need the Apple touch icon?", a: "It is recommended if you want the site to look correct when saved to an iPhone or iPad home screen." },
        { q: "Do I need the manifest file?", a: "It is useful when you want Android icon support, install prompts, or broader app-like metadata. Simple sites can still use it." },
        { q: "What does the Safari mask icon line do?", a: "It points Safari pinned tabs to a monochrome SVG icon and applies the chosen color to that tab treatment." },
        { q: "Can I use different filenames than the defaults here?", a: "Yes, but then you should edit the generated code so the paths match your actual asset output." },
        { q: "Does this page generate the image files too?", a: "No. It generates the code and manifest references. Use the existing favicon image generator to create the icon files themselves." },
        { q: "Where should I place the generated HTML?", a: "Put it in the global head area used across your site so the favicon references are available on every page." },
      ]}
      relatedTools={[
        { title: "Favicon Generator", slug: "favicon-generator", icon: <ImageIcon className="h-4 w-4" />, color: 210, benefit: "Create the actual PNG and favicon image files first" },
        { title: "Open Graph Generator", slug: "open-graph-generator", icon: <Globe className="h-4 w-4" />, color: 145, benefit: "Update social metadata during a launch or redesign" },
        { title: "Canonical Tag Generator", slug: "canonical-tag-generator", icon: <Link2 className="h-4 w-4" />, color: 40, benefit: "Pair favicon cleanup with other technical head tags" },
        { title: "Meta Tag Generator", slug: "meta-tag-generator", icon: <CheckCircle2 className="h-4 w-4" />, color: 280, benefit: "Generate the rest of the core head metadata" },
        { title: "Robots.txt Generator", slug: "robots-txt-generator", icon: <Shield className="h-4 w-4" />, color: 90, benefit: "Handle another common technical SEO file" },
        { title: "XML Sitemap Generator", slug: "sitemap-generator", icon: <Copy className="h-4 w-4" />, color: 15, benefit: "Finish the wider technical SEO launch checklist" },
      ]}
      ctaTitle="Need Another SEO Utility?"
      ctaDescription="Continue replacing placeholder SEO routes with working generators and validators that are ready for real deployment workflows."
      ctaHref="/category/seo"
    />
  );
}
