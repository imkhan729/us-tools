import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Check,
  Copy,
  Film,
  Monitor,
  Smartphone,
  Sparkles,
  Upload,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";
import { loadImageFile, formatBytes, type LoadedImage } from "./imageToolUtils";

function luminance(red: number, green: number, blue: number) {
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function analyzeThumbnail(source: LoadedImage | null) {
  if (!source) return null;

  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 36;
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  ctx.drawImage(source.image, 0, 0, canvas.width, canvas.height);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const values: number[] = [];
  const centerValues: number[] = [];

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const index = (y * canvas.width + x) * 4;
      const value = luminance(data[index], data[index + 1], data[index + 2]);
      values.push(value);

      if (x >= 10 && x <= 54 && y >= 8 && y <= 28) {
        centerValues.push(value);
      }
    }
  }

  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length;
  const contrastScore = Math.sqrt(variance);

  const centerAverage = centerValues.reduce((sum, value) => sum + value, 0) / centerValues.length;
  const centerVariance = centerValues.reduce((sum, value) => sum + (value - centerAverage) ** 2, 0) / centerValues.length;
  const centerContrast = Math.sqrt(centerVariance);

  const aspectRatio = source.width / source.height;
  const ratioDelta = Math.abs(aspectRatio - 16 / 9);

  return {
    contrastScore,
    centerContrast,
    aspectRatio,
    ratioDelta,
  };
}

export default function YouTubeThumbnailChecker() {
  const [source, setSource] = useState<LoadedImage | null>(null);
  const [safeZone, setSafeZone] = useState(true);
  const [copied, setCopied] = useState(false);
  const analysis = useMemo(() => analyzeThumbnail(source), [source]);

  const qaSummary = useMemo(() => {
    if (!source || !analysis) return "";

    const ratioLabel = analysis.ratioDelta < 0.02 ? "Good 16:9 fit" : "Off-ratio";
    const sizeLabel = source.width >= 1280 && source.height >= 720 ? "Meets 1280x720 target" : "Below 1280x720 target";
    const contrastLabel =
      analysis.centerContrast > 55 ? "High center contrast" : analysis.centerContrast > 32 ? "Medium center contrast" : "Low center contrast";

    return [
      `Source: ${source.name}`,
      `Dimensions: ${source.width} x ${source.height}px`,
      `File size: ${formatBytes(source.size)}`,
      `Aspect ratio: ${analysis.aspectRatio.toFixed(3)} (${ratioLabel})`,
      `Resolution check: ${sizeLabel}`,
      `Contrast heuristic: ${contrastLabel}`,
      `Safe zone overlay: ${safeZone ? "On" : "Off"}`,
    ].join("\n");
  }, [analysis, safeZone, source]);

  const copySummary = async () => {
    await navigator.clipboard.writeText(qaSummary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const checklist = useMemo(() => {
    if (!source || !analysis) {
      return [
        {
          title: "Step 1: Upload a thumbnail",
          text: "Add the thumbnail image you plan to publish. The tool will then check size, ratio fit, and a center-weighted contrast heuristic.",
          tone: "border-blue-500/20 bg-blue-500/5",
        },
      ];
    }

    return [
      {
        title: "Step 1: Resolution and ratio",
        text:
          source.width >= 1280 && source.height >= 720 && analysis.ratioDelta < 0.02
            ? "The image meets the common 1280x720 16:9 target, so it should scale cleanly into standard YouTube thumbnail surfaces."
            : "The image is either below 1280x720 or noticeably off the 16:9 shape. It can still be usable, but text and composition may crop or soften more easily.",
        tone:
          source.width >= 1280 && source.height >= 720 && analysis.ratioDelta < 0.02
            ? "border-emerald-500/20 bg-emerald-500/5"
            : "border-amber-500/20 bg-amber-500/5",
      },
      {
        title: "Step 2: Center readability",
        text:
          analysis.centerContrast > 55
            ? "The center zone shows strong tonal separation, which usually gives titles, faces, or products a better chance of reading at small sizes."
            : analysis.centerContrast > 32
              ? "The center zone has moderate contrast. It may be usable, but small text or low-contrast subjects could still get muddy on mobile."
              : "The center zone has weak tonal separation. Simplify the layout, increase contrast, or make the subject larger before publishing.",
        tone:
          analysis.centerContrast > 55
            ? "border-emerald-500/20 bg-emerald-500/5"
            : analysis.centerContrast > 32
              ? "border-amber-500/20 bg-amber-500/5"
              : "border-rose-500/20 bg-rose-500/5",
      },
      {
        title: "Step 3: Safe-zone check",
        text: safeZone
          ? "Keep the key face, object, and headline inside the safe-zone frame so they remain readable when the thumbnail is reduced or displayed beside competing content."
          : "Turn the safe-zone overlay back on when you want to check whether the main visual lives in the most dependable reading area.",
        tone: "border-cyan-500/20 bg-cyan-500/5",
      },
    ];
  }, [analysis, safeZone, source]);

  const calculator = (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
        <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Upload Thumbnail</label>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-blue-500/30 bg-background px-4 py-5 text-sm font-medium text-foreground hover:border-blue-500/50">
          <Upload className="w-4 h-4 text-blue-600" />
          <span>{source ? source.name : "Choose a thumbnail image"}</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              if (!file) return;
              void loadImageFile(file).then(setSource);
            }}
          />
        </label>
        <p className="mt-3 text-sm text-muted-foreground">Preview how the thumbnail reads in smaller cards, check 16:9 fit, and use the safe-zone overlay to keep the important visual in the most dependable area.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Full Thumbnail Check</p>
                <p className="text-sm text-muted-foreground">Use the safe-zone overlay to keep the subject, face, and headline away from the edges.</p>
              </div>
              <button onClick={() => setSafeZone((value) => !value)} className="rounded-full border border-border bg-background px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40">
                {safeZone ? "Hide Safe Zone" : "Show Safe Zone"}
              </button>
            </div>

            <div className="rounded-3xl border border-border bg-muted/35 p-4">
              <div className="relative mx-auto w-full max-w-[720px] overflow-hidden rounded-2xl border border-border bg-background" style={{ aspectRatio: "16 / 9" }}>
                {source ? <img src={source.src} alt="Thumbnail preview" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">Upload a thumbnail to preview the safe zone.</div>}
                {source && safeZone ? (
                  <div className="pointer-events-none absolute inset-[10%] rounded-xl border-2 border-white/80 shadow-[0_0_0_999px_rgba(15,23,42,0.18)]">
                    <div className="absolute left-3 top-3 rounded-full bg-slate-950/75 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">Text-Safe Zone</div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Preview Cards</p>
                <p className="text-sm text-muted-foreground">Check whether the thumbnail still feels readable once it shrinks into typical browsing surfaces.</p>
              </div>
              <Sparkles className="w-5 h-5 text-blue-500" />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center gap-2 text-blue-600">
                  <Monitor className="w-4 h-4" />
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">Desktop Search Card</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-[220px] overflow-hidden rounded-xl border border-border bg-background" style={{ aspectRatio: "16 / 9" }}>
                    {source ? <img src={source.src} alt="Desktop thumbnail preview" className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground line-clamp-2">Example title preview for a standard YouTube search result</p>
                    <p className="mt-1 text-xs text-muted-foreground">Desktop cards still give the thumbnail more room, but crowded layouts can already start feeling busy here.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center gap-2 text-blue-600">
                  <Smartphone className="w-4 h-4" />
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">Mobile Feed Card</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-[148px] overflow-hidden rounded-xl border border-border bg-background" style={{ aspectRatio: "16 / 9" }}>
                    {source ? <img src={source.src} alt="Mobile thumbnail preview" className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground line-clamp-2">This is where oversized text and weak contrast usually start breaking down.</p>
                    <p className="mt-1 text-xs text-muted-foreground">If the subject does not read here, the thumbnail is too dependent on large-screen viewing.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center gap-2 text-blue-600">
                  <Film className="w-4 h-4" />
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">Suggested / Sidebar Size</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-[120px] overflow-hidden rounded-xl border border-border bg-background" style={{ aspectRatio: "16 / 9" }}>
                    {source ? <img src={source.src} alt="Small thumbnail preview" className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground line-clamp-2">Tiny previews reward one strong subject, one clear headline, and strong tonal separation.</p>
                    <p className="mt-1 text-xs text-muted-foreground">This is a quick check against overdesigned thumbnails with too many competing details.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">QA Summary</p>
                <p className="text-sm text-muted-foreground">Copy the thumbnail check summary for review notes or handoff.</p>
              </div>
              {source && analysis ? (
                <button onClick={copySummary} className="text-xs font-bold text-blue-600">
                  {copied ? <><Check className="inline h-3.5 w-3.5 mr-1" />Copied</> : <><Copy className="inline h-3.5 w-3.5 mr-1" />Copy</>}
                </button>
              ) : null}
            </div>

            {source && analysis ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border bg-muted/35 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Dimensions</p>
                    <p className="mt-2 text-2xl font-black text-foreground">{source.width} x {source.height}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/35 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">File Size</p>
                    <p className="mt-2 text-2xl font-black text-foreground">{formatBytes(source.size)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/35 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Ratio</p>
                    <p className="mt-2 text-xl font-black text-foreground">{analysis.aspectRatio.toFixed(2)}:1</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/35 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Center Contrast</p>
                    <p className="mt-2 text-xl font-black text-foreground">{analysis.centerContrast.toFixed(0)}</p>
                  </div>
                </div>

                <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-100"><code>{qaSummary}</code></pre>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                Upload a thumbnail to generate the QA summary.
              </div>
            )}
          </div>

          <div className="space-y-3">
            {checklist.map((item) => (
              <div key={item.title} className={`rounded-2xl border p-4 ${item.tone}`}>
                <p className="font-bold text-foreground">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Important Note</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">The contrast score here is a heuristic, not OCR. It tells you whether the thumbnail has strong tonal separation, which usually helps titles, faces, and products read better at small sizes.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="YouTube Thumbnail Checker"
      seoTitle="YouTube Thumbnail Checker - Check Small-Size Readability Before Publishing"
      seoDescription="Free YouTube thumbnail checker with small-screen mockups, safe-zone overlay, ratio checks, and contrast-focused QA guidance."
      canonical="https://usonlinetools.com/social-media/youtube-thumbnail-checker"
      categoryName="Social Media Tools"
      categoryHref="/category/social-media"
      heroDescription="Check how your YouTube thumbnail reads when it shrinks into search cards, mobile feeds, and suggested-video slots. Upload the image, inspect the safe zone, and use the QA checklist to catch weak contrast, crowded composition, or off-ratio exports before publishing."
      heroIcon={<Film className="w-3.5 h-3.5" />}
      calculatorLabel="Thumbnail QA Workspace"
      calculatorDescription="Upload a thumbnail, preview it at smaller sizes, and check ratio fit, safe zone, and contrast heuristics."
      calculator={calculator}
      howSteps={[
        { title: "Upload the exact thumbnail you plan to publish", description: "Run the actual export, not the layered design file, so you are checking the same crop, compression, and final framing that viewers will see." },
        { title: "Check 16:9 fit and thumbnail size first", description: "A strong design can still suffer if the exported file is off-ratio or below the common 1280x720 target. Start with the technical fit before judging the creative layout." },
        { title: "Use the safe-zone overlay to center the important visual", description: "Keep the headline, face, or main object inside the safer middle region so the thumbnail still reads when it appears small and surrounded by competing content." },
        { title: "Look at the smallest preview before you publish", description: "If the thumbnail only works at full size, it is too dependent on details viewers may never notice. The smallest preview usually reveals whether the concept is actually clear." },
      ]}
      interpretationCards={[
        { title: "1280x720 at 16:9 is the common starting target", description: "If the export is smaller or off-shape, it can still work, but you lose margin for cropping, scaling, and small-size clarity.", className: "bg-emerald-500/5 border-emerald-500/20" },
        { title: "Center contrast is a readability heuristic", description: "The score is not reading text directly. It measures tonal separation in the center-weighted area, which often correlates with how well the key subject stands out.", className: "bg-blue-500/5 border-blue-500/20" },
        { title: "The smallest preview is the hardest test", description: "If the thumbnail still feels obvious in the tiny suggested-video card, the composition is usually strong enough for larger surfaces too.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "Safe zones protect clarity, not creativity", description: "You can still design boldly, but the main face, object, or title should remain inside the zone where reduced-size previews are most dependable.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Video publish QA", input: "Final thumbnail export before scheduling", output: "Catch weak contrast or crowded layouts before going live" },
        { scenario: "A/B thumbnail review", input: "Two alternate concepts with different text and crops", output: "Compare which concept still reads at the smallest card size" },
        { scenario: "Channel consistency check", input: "New upload against an existing thumbnail style", output: "Keep composition and safe-zone behavior consistent across a series" },
        { scenario: "Client handoff review", input: "Final JPG/PNG from a design team", output: "Copy a QA summary with ratio, size, and readability notes" },
      ]}
      whyChoosePoints={[
        "This page gives you a working thumbnail QA preview instead of a placeholder or generic image uploader.",
        "Desktop, mobile, and tiny suggested-video cards are shown together because YouTube thumbnails succeed or fail at reduced size.",
        "The safe-zone overlay and center-contrast heuristic make the tool useful even when you are reviewing someone else's finished export.",
        "Everything runs locally in the browser, which keeps unpublished thumbnail concepts private.",
        "The page follows the same longer-form structure as the stronger calculator pages while still keeping the preview tool above the fold.",
      ]}
      faqs={[
        { q: "What size should a YouTube thumbnail be?", a: "A common target is 1280x720 pixels in a 16:9 ratio. This gives you a standard HD-sized thumbnail shape that fits well across most YouTube surfaces." },
        { q: "Why does the smallest preview matter so much?", a: "Suggested-video and mobile cards shrink the thumbnail dramatically. If the concept breaks there, it is depending too much on detail that viewers may never notice." },
        { q: "What does the safe-zone overlay mean?", a: "It marks a tighter central area where the most important face, title, or subject should ideally live so the composition remains clear at smaller sizes." },
        { q: "Is the contrast score reading my title text?", a: "No. It is a tonal contrast heuristic based on the image pixels, especially around the center. It helps identify thumbnails that may feel visually muddy." },
        { q: "Can I use this for Shorts covers or other social thumbnails?", a: "You can use the preview logic as a general QA check, but the current framing is tuned around standard YouTube thumbnail workflows." },
        { q: "Does this upload my image anywhere?", a: "No. The thumbnail stays in the browser session for local preview and analysis." },
        { q: "Why might an off-ratio thumbnail still look okay here?", a: "A strong image can still feel visually good, but ratio mismatches reduce flexibility and can create cropping or scaling issues in real platform surfaces." },
        { q: "Should I avoid text on thumbnails completely?", a: "Not necessarily. Text can work very well, but it needs to be short, bold, and high-contrast enough to survive the smallest preview sizes." },
      ]}
      relatedTools={[
        { title: "Social Media Image Resizer", slug: "social-media-image-resizer", icon: <Monitor className="h-4 w-4" />, color: 205, benefit: "Resize the source image to platform-ready dimensions before thumbnail QA" },
        { title: "Image Filter Editor", slug: "image-filter-editor", href: "/image/image-filter-editor", icon: <Sparkles className="h-4 w-4" />, color: 170, benefit: "Boost contrast or clarity if the thumbnail feels muddy" },
        { title: "Image Pixel Counter", slug: "image-pixel-counter", href: "/image/image-pixel-counter", icon: <BadgeCheck className="h-4 w-4" />, color: 190, benefit: "Inspect exact dimensions before uploading the thumbnail" },
        { title: "Image to PNG Converter", slug: "image-to-png", href: "/image/image-to-png", icon: <Copy className="h-4 w-4" />, color: 30, benefit: "Re-export graphics or screenshots as PNG before the thumbnail check" },
        { title: "TikTok Caption Counter", slug: "tiktok-character-counter", icon: <Smartphone className="h-4 w-4" />, color: 300, benefit: "Plan the short-form caption once the thumbnail concept is locked" },
        { title: "Social Post Planner", slug: "social-post-scheduler-planner", icon: <Film className="h-4 w-4" />, color: 180, benefit: "Organize uploads and thumbnail reviews inside a wider content plan" },
      ]}
      ctaTitle="Need More Publishing QA Tools?"
      ctaDescription="Use the rest of the social-media and image suite for resizing, caption planning, and export prep before your content goes live."
      ctaHref="/category/social-media"
    />
  );
}
