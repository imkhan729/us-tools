import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CheckCircle2,
  Crop,
  Download,
  Image as ImageIcon,
  Instagram,
  Linkedin,
  Monitor,
  Smartphone,
  Sparkles,
  Upload,
  Youtube,
} from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";
import {
  LoadedImage,
  canvasToBlob,
  clamp,
  downloadBlob,
  drawImageToCanvas,
  extensionForMimeType,
  fileBaseName,
  formatBytes,
  loadImageFile,
} from "./imageToolUtils";

type PresetKey =
  | "instagram-post"
  | "instagram-story"
  | "instagram-reel"
  | "linkedin-post"
  | "linkedin-banner"
  | "youtube-thumbnail";

const PRESETS: Record<PresetKey, {
  label: string;
  width: number;
  height: number;
  detail: string;
  icon: ReactNode;
}> = {
  "instagram-post": {
    label: "Instagram Post",
    width: 1080,
    height: 1080,
    detail: "Square feed image for posts and carousels.",
    icon: <Instagram className="w-4 h-4" />,
  },
  "instagram-story": {
    label: "Instagram Story",
    width: 1080,
    height: 1920,
    detail: "Vertical story and full-screen mobile format.",
    icon: <Smartphone className="w-4 h-4" />,
  },
  "instagram-reel": {
    label: "Instagram Reel Cover",
    width: 1080,
    height: 1920,
    detail: "Vertical cover art for reels and shorts-style posts.",
    icon: <Instagram className="w-4 h-4" />,
  },
  "linkedin-post": {
    label: "LinkedIn Post",
    width: 1200,
    height: 627,
    detail: "Wide landscape post for feed sharing.",
    icon: <Linkedin className="w-4 h-4" />,
  },
  "linkedin-banner": {
    label: "LinkedIn Banner",
    width: 1584,
    height: 396,
    detail: "Profile or page banner layout with extreme width.",
    icon: <Linkedin className="w-4 h-4" />,
  },
  "youtube-thumbnail": {
    label: "YouTube Thumbnail",
    width: 1280,
    height: 720,
    detail: "Standard 16:9 thumbnail for YouTube videos.",
    icon: <Youtube className="w-4 h-4" />,
  },
};

function formatNumber(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function SocialMediaImageResizer() {
  const [source, setSource] = useState<LoadedImage | null>(null);
  const [preset, setPreset] = useState<PresetKey>("instagram-post");
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(50);
  const [offsetY, setOffsetY] = useState(50);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const activePreset = PRESETS[preset];
  const aspectRatio = activePreset.width / activePreset.height;

  useEffect(() => {
    return () => {
      if (outputUrl) {
        window.URL.revokeObjectURL(outputUrl);
      }
    };
  }, [outputUrl]);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    try {
      const loaded = await loadImageFile(file);
      setSource(loaded);
      setZoom(1);
      setOffsetX(50);
      setOffsetY(50);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load image.");
    }
  };

  const cropState = useMemo(() => {
    if (!source) return null;

    const { width, height } = source;
    const sourceRatio = width / height;

    const baseCropWidth = sourceRatio > aspectRatio ? height * aspectRatio : width;
    const baseCropHeight = sourceRatio > aspectRatio ? height : width / aspectRatio;

    const scaledCropWidth = clamp(baseCropWidth / zoom, 1, width);
    const scaledCropHeight = clamp(baseCropHeight / zoom, 1, height);

    const maxX = width - scaledCropWidth;
    const maxY = height - scaledCropHeight;

    const cropX = maxX * (offsetX / 100);
    const cropY = maxY * (offsetY / 100);

    return {
      cropX,
      cropY,
      cropWidth: scaledCropWidth,
      cropHeight: scaledCropHeight,
      sourceRatio,
    };
  }, [aspectRatio, offsetX, offsetY, source, zoom]);

  useEffect(() => {
    if (!source || !cropState) {
      setOutputBlob(null);
      setOutputUrl("");
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const canvas = drawImageToCanvas(source, activePreset.width, activePreset.height, (ctx, canvasEl) => {
          ctx.drawImage(
            source.image,
            cropState.cropX,
            cropState.cropY,
            cropState.cropWidth,
            cropState.cropHeight,
            0,
            0,
            canvasEl.width,
            canvasEl.height,
          );
        });

        const blob = await canvasToBlob(canvas, "image/png");
        const nextUrl = window.URL.createObjectURL(blob);

        if (cancelled) {
          window.URL.revokeObjectURL(nextUrl);
          return;
        }

        setOutputBlob(blob);
        setOutputUrl((current) => {
          if (current) window.URL.revokeObjectURL(current);
          return nextUrl;
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render resized image.");
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [activePreset.height, activePreset.width, cropState, source]);

  const downloadName =
    source && outputBlob
      ? `${fileBaseName(source.name)}-${preset}.${extensionForMimeType(outputBlob.type || "image/png")}`
      : "";

  const copyPresetSummary = async () => {
    const summary = [
      `Preset: ${activePreset.label}`,
      `Output size: ${activePreset.width} x ${activePreset.height}px`,
      `Zoom: ${zoom.toFixed(2)}x`,
      `Horizontal focus: ${offsetX}%`,
      `Vertical focus: ${offsetY}%`,
    ].join("\n");

    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const checklist = [
    {
      title: "Step 1: Pick the destination layout first",
      text: `${activePreset.label} uses ${activePreset.width} x ${activePreset.height}px. ${activePreset.detail}`,
      tone: "border-emerald-500/20 bg-emerald-500/5",
    },
    {
      title: "Step 2: Reframe the subject inside the crop",
      text: source
        ? `Zoom is ${zoom.toFixed(2)}x and the crop focus is ${offsetX}% horizontally and ${offsetY}% vertically. Use this to keep faces, products, or text inside the safe area.`
        : "Upload an image, then use zoom and crop position controls to keep the important subject inside the frame.",
      tone: "border-blue-500/20 bg-blue-500/5",
    },
    {
      title: "Step 3: Export the platform-ready image",
      text: outputBlob
        ? `The current render is ready as a PNG export at ${activePreset.width} x ${activePreset.height}px.`
        : "Once the preview is ready, download the rendered image and post it directly to the target platform.",
      tone: "border-cyan-500/20 bg-cyan-500/5",
    },
  ];

  const calculator = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Upload Image</label>
            <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-blue-500/30 bg-background px-4 py-5 text-sm font-medium text-foreground cursor-pointer hover:border-blue-500/50 transition-colors">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>{source ? source.name : "Choose PNG, JPG, WebP, or GIF"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(event) => void handleFileChange(event.target.files?.[0] ?? null)} />
            </label>
            <p className="mt-3 text-sm text-muted-foreground">
              Upload one image, choose a platform preset, then adjust crop position and zoom until the subject fits the target frame.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Platform Presets</p>
                <p className="text-sm text-muted-foreground">Switch formats without recalculating dimensions manually.</p>
              </div>
              <button onClick={copyPresetSummary} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                {copied ? "Copied" : "Copy Settings"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {(Object.keys(PRESETS) as PresetKey[]).map((key) => {
                const item = PRESETS[key];
                const active = key === preset;
                return (
                  <button
                    key={key}
                    onClick={() => setPreset(key)}
                    className={`rounded-2xl border p-4 text-left transition-colors ${active ? "border-blue-500/40 bg-card" : "border-border bg-card hover:border-blue-500/30"}`}
                  >
                    <div className="flex items-center gap-2 mb-2 text-blue-600">
                      {item.icon}
                      <p className="font-bold text-foreground">{item.label}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.width} x {item.height}</p>
                    <p className="mt-1 text-xs text-muted-foreground/80 leading-relaxed">{item.detail}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {source ? (
            <div className="rounded-2xl border border-blue-500/20 bg-card p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Zoom ({zoom.toFixed(2)}x)</label>
                  <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Horizontal Focus ({offsetX}%)</label>
                  <input type="range" min="0" max="100" step="1" value={offsetX} onChange={(event) => setOffsetX(Number(event.target.value))} className="w-full accent-blue-600" />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Vertical Focus ({offsetY}%)</label>
                  <input type="range" min="0" max="100" step="1" value={offsetY} onChange={(event) => setOffsetY(Number(event.target.value))} className="w-full accent-blue-600" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Original</p>
                  <p className="mt-2 text-2xl font-black text-foreground">{formatNumber(source.width)} x {formatNumber(source.height)}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Output</p>
                  <p className="mt-2 text-2xl font-black text-foreground">{activePreset.width} x {activePreset.height}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Aspect Ratio</p>
                  <p className="mt-2 text-2xl font-black text-foreground">{activePreset.width / 120}:{Math.round(activePreset.height / 120)}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Export</p>
                  <p className="mt-2 text-2xl font-black text-foreground">PNG</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Live Preview</p>
                <p className="text-sm text-muted-foreground">This frame matches the target platform ratio, not the original file ratio.</p>
              </div>
              <Monitor className="w-5 h-5 text-blue-500" />
            </div>

            <div className="rounded-3xl border border-border bg-muted/30 p-4">
              <div className="mx-auto overflow-hidden rounded-2xl border border-border bg-background" style={{ width: "100%", maxWidth: "320px", aspectRatio: `${activePreset.width} / ${activePreset.height}` }}>
                {outputUrl ? (
                  <img src={outputUrl} alt={`${activePreset.label} preview`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground px-6">
                    Upload an image to preview the social-media crop here.
                  </div>
                )}
              </div>
            </div>

            {source && outputBlob ? (
              <div className="mt-4 grid grid-cols-1 gap-3">
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="font-bold text-foreground">Ready export</p>
                  <p className="mt-1 text-sm text-muted-foreground">{activePreset.label} at {activePreset.width} x {activePreset.height}px. Estimated file size: {formatBytes(outputBlob.size)}.</p>
                </div>
                <button onClick={() => downloadBlob(outputBlob, downloadName)} className="rounded-xl bg-blue-600 text-white font-bold text-sm px-4 py-4 hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download Resized Image
                </button>
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Realtime Resizing Readout</p>
                <p className="text-sm text-muted-foreground">Use this checklist to validate ratio, crop, and export state before publishing.</p>
              </div>
              <Sparkles className="w-5 h-5 text-blue-500" />
            </div>

            <div className="space-y-3">
              {checklist.map((item) => (
                <div key={item.title} className={`rounded-2xl border p-4 ${item.tone}`}>
                  <p className="font-bold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Social-media resizing is mostly about framing. Matching the platform dimensions matters, but keeping the subject inside the visible crop matters more.
              </p>
            </div>
          </div>
        </div>
      </div>

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Online Social Media Image Resizer"
      seoTitle="Online Social Media Image Resizer - Resize for Instagram, LinkedIn, and YouTube"
      seoDescription="Free online social media image resizer with Instagram, LinkedIn, and YouTube presets, live crop preview, and browser-side PNG export."
      canonical="https://usonlinetools.com/social-media/online-social-media-image-resizer"
      categoryName="Social Media Tools"
      categoryHref="/category/social-media"
      heroDescription="Resize one image for social platforms without guessing the target dimensions. Upload the source, switch between Instagram, LinkedIn, and YouTube presets, then adjust zoom and crop position until the subject fits the final layout."
      heroIcon={<ImageIcon className="w-3.5 h-3.5" />}
      calculatorLabel="Platform Preset Resizer"
      calculatorDescription="Choose a social preset, reposition the crop, and export a platform-ready PNG."
      calculator={calculator}
      howSteps={[
        {
          title: "Upload the original image before choosing a preset",
          description:
            "Starting from the original file gives you the cleanest crop and avoids repeatedly resizing a file that was already compressed for another platform.",
        },
        {
          title: "Switch to the platform preset that matches the publishing slot",
          description:
            "Each platform uses different ratios. A square Instagram post, a tall story, and a wide LinkedIn image do not frame the same visual the same way, so choose the destination first.",
        },
        {
          title: "Use zoom and focus sliders to protect the subject",
          description:
            "The goal is not just to hit the dimensions. The goal is to keep faces, products, logos, or text safely inside the crop after the ratio changes.",
        },
        {
          title: "Download the rendered image only after previewing the final frame",
          description:
            "The preview shows the actual target ratio, which is the best check before posting. If the crop feels tight, adjust it before exporting instead of fixing it later in the app.",
        },
      ]}
      interpretationCards={[
        {
          title: "Preset dimensions are the publishing target",
          description:
            "The output size is fixed by the active platform preset. Changing the crop controls reframes the image inside that target instead of changing the target itself.",
        },
        {
          title: "Zoom increases crop tightness, not image quality",
          description:
            "A higher zoom value uses a smaller area of the original image. This helps framing, but it also means the crop depends more heavily on the original image quality.",
          className: "bg-cyan-500/5 border-cyan-500/20",
        },
        {
          title: "Wide, square, and tall layouts change what stays visible",
          description:
            "A design that works in a square post can lose important content in a banner or a story crop. Always check the actual destination ratio before exporting.",
          className: "bg-emerald-500/5 border-emerald-500/20",
        },
        {
          title: "Exporting once from the source file is cleaner than resizing multiple times",
          description:
            "Repeated edits on already-resized images compound compression and framing mistakes. This tool is designed to create the destination version directly from the original upload.",
          className: "bg-amber-500/5 border-amber-500/20",
        },
      ]}
      examples={[
        { scenario: "Instagram feed post", input: "Landscape photo uploaded to square preset", output: "Center the subject and export at 1080 x 1080" },
        { scenario: "Instagram story", input: "Wide promo image uploaded to vertical preset", output: "Reframe the subject for 1080 x 1920" },
        { scenario: "LinkedIn banner", input: "Brand header artwork", output: "Trim excess height and export a 1584 x 396 banner" },
        { scenario: "YouTube thumbnail", input: "Video cover image with title area", output: "Keep the focal subject visible in 1280 x 720" },
      ]}
      whyChoosePoints={[
        "This page uses real browser-side canvas rendering instead of a static placeholder or a fake preset list.",
        "Platform presets remove the need to remember dimensions for each destination, which is where most quick resizing mistakes start.",
        "The live preview uses the final ratio, so the user can fix framing problems before posting rather than after upload.",
        "The tool is useful even for experienced designers because it speeds up repetitive export work without opening a full editor.",
        "Everything stays local to the browser session, which is useful for drafts, client assets, and unpublished campaign creatives.",
      ]}
      faqs={[
        {
          q: "What platforms does this image resizer support?",
          a: "The current version includes Instagram post, story, and reel-cover presets, plus LinkedIn post and banner presets, and a YouTube thumbnail preset.",
        },
        {
          q: "Does this crop my image or just resize it?",
          a: "It does both in one workflow. The preset sets the output size, and the crop controls let you decide which part of the original image fills that frame.",
        },
        {
          q: "Why should I resize from the original file instead of from another resized image?",
          a: "Starting from the original gives you more detail and more room to crop. Resizing from an already-downscaled image usually reduces flexibility and can make the output softer.",
        },
        {
          q: "Can I download JPG instead of PNG?",
          a: "This version exports PNG to keep the workflow predictable and loss-resistant across platforms. If you need another format afterward, use the image format converter.",
        },
        {
          q: "Will this help with safe zones?",
          a: "It helps by showing the actual final ratio and letting you reframe the important subject. For text-heavy creatives, you should still leave breathing room near the edges.",
        },
        {
          q: "Does this tool upload my image to a server?",
          a: "No. The crop and resize logic runs in the browser, so the image stays local during editing.",
        },
        {
          q: "Can I make multiple platform sizes from one upload?",
          a: "Yes. Upload once, switch presets, and export each version separately while keeping the same source image.",
        },
        {
          q: "Is this the same as a full design editor?",
          a: "No. This tool is focused on resizing and reframing only. It is intended for fast platform-specific exports, not full graphic design workflows.",
        },
      ]}
      relatedTools={[
        { title: "Image Resizer", slug: "image-resizer", icon: <Crop className="w-4 h-4" />, color: 210, benefit: "Resize by exact pixels or percentage" },
        { title: "Image Cropper", slug: "image-cropper", icon: <Crop className="w-4 h-4" />, color: 160, benefit: "Handle generic crops outside social presets" },
        { title: "Instagram Caption Counter", slug: "instagram-caption-counter", icon: <Instagram className="w-4 h-4" />, color: 330, benefit: "Pair visuals with the right caption length" },
        { title: "LinkedIn Post Formatter", slug: "linkedin-post-formatter", icon: <Linkedin className="w-4 h-4" />, color: 200, benefit: "Format the post copy that goes with the image" },
        { title: "Image Compressor", slug: "image-compressor", icon: <Download className="w-4 h-4" />, color: 10, benefit: "Shrink exported assets after resizing" },
      ]}
      ctaTitle="Need Another Social Publishing Tool?"
      ctaDescription="Continue through the remaining social-media placeholders and replace them with real editing workflows."
      ctaHref="/category/social-media"
    />
  );
}
