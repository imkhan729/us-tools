import { useEffect, useMemo, useState } from "react";
import { Download, Image as ImageIcon, Upload } from "lucide-react";
import ImageToolPageShell from "./ImageToolPageShell";
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
  normalizeOutputMimeType,
} from "./imageToolUtils";

export default function ImageCompressor() {
  const [source, setSource] = useState<LoadedImage | null>(null);
  const [outputType, setOutputType] = useState("image/webp");
  const [quality, setQuality] = useState("80");
  const [maxWidth, setMaxWidth] = useState("");
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (outputUrl) window.URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    try {
      const loaded = await loadImageFile(file);
      setSource(loaded);
      setMaxWidth(String(loaded.width));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load image.");
    }
  };

  const targetDimensions = useMemo(() => {
    if (!source) return null;
    const parsedMaxWidth = parseFloat(maxWidth);
    if (!Number.isFinite(parsedMaxWidth) || parsedMaxWidth <= 0 || parsedMaxWidth >= source.width) {
      return { width: source.width, height: source.height };
    }

    const ratio = parsedMaxWidth / source.width;
    return {
      width: Math.max(1, Math.round(parsedMaxWidth)),
      height: Math.max(1, Math.round(source.height * ratio)),
    };
  }, [maxWidth, source]);

  useEffect(() => {
    if (!source || !targetDimensions) {
      setOutputBlob(null);
      setOutputUrl("");
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const mimeType = normalizeOutputMimeType(outputType, source.type);
        const qualityValue = clamp((parseFloat(quality) || 80) / 100, 0.1, 1);
        const canvas = drawImageToCanvas(source, targetDimensions.width, targetDimensions.height, (ctx, canvasEl) => {
          ctx.drawImage(source.image, 0, 0, canvasEl.width, canvasEl.height);
        });
        const blob = await canvasToBlob(canvas, mimeType, mimeType === "image/jpeg" || mimeType === "image/webp" ? qualityValue : undefined);
        const nextUrl = window.URL.createObjectURL(blob);

        if (cancelled) {
          window.URL.revokeObjectURL(nextUrl);
          return;
        }

        setError("");
        setOutputBlob(blob);
        setOutputUrl((current) => {
          if (current) window.URL.revokeObjectURL(current);
          return nextUrl;
        });
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to compress image.");
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [outputType, quality, source, targetDimensions]);

  const savings = source && outputBlob ? ((source.size - outputBlob.size) / source.size) * 100 : null;
  const downloadName =
    source && outputBlob
      ? `${fileBaseName(source.name)}-compressed.${extensionForMimeType(outputBlob.type || source.type)}`
      : "";

  return (
    <ImageToolPageShell
      title="Image Compressor"
      seoTitle="Image Compressor - Reduce Image File Size In Your Browser"
      seoDescription="Compress images in your browser using JPG or WebP quality settings. Free image compressor with preview, size comparison, and instant download."
      canonical="https://usonlinetools.com/image/image-compressor"
      heroDescription="Compress images for websites, email attachments, forms, CMS uploads, and mobile sharing by controlling both quality and output width. This page is built for practical file-size reduction, with side-by-side previewing so you can choose the right balance between weight and visual clarity."
      heroIcon={<ImageIcon className="w-3.5 h-3.5" />}
      calculatorLabel="Compression + Downscale"
      calculatorDescription="Control output format, quality, and maximum width to create smaller image files without leaving the browser."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Upload Image</label>
            <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-500/30 bg-background px-4 py-5 text-sm font-medium text-foreground cursor-pointer hover:border-cyan-500/50 transition-colors">
              <Upload className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{source ? source.name : "Choose an image to compress"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(event) => void handleFileChange(event.target.files?.[0] ?? null)} />
            </label>
          </div>

          {source ? (
            <>
              <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Compressed Format</label>
                    <select value={outputType} onChange={(event) => setOutputType(event.target.value)} className="tool-calc-input w-full">
                      <option value="image/webp">WebP</option>
                      <option value="image/jpeg">JPG</option>
                      <option value="original">Keep Original Format</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Max Width (px)</label>
                    <input type="number" min="1" value={maxWidth} onChange={(event) => setMaxWidth(event.target.value)} className="tool-calc-input w-full" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Quality ({quality}%)</label>
                  <input type="range" min="10" max="100" step="1" value={quality} onChange={(event) => setQuality(event.target.value)} className="w-full accent-cyan-600" />
                </div>
              </div>

              {outputUrl && outputBlob && targetDimensions ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Original</p>
                      <img src={source.src} alt="Original image preview" className="w-full rounded-xl border border-border bg-muted/30 object-contain max-h-72" />
                      <p className="text-sm text-muted-foreground mt-3">{source.width} x {source.height} px | {formatBytes(source.size)}</p>
                    </div>
                    <div className="rounded-2xl border border-cyan-500/20 bg-card p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Compressed</p>
                      <img src={outputUrl} alt="Compressed image preview" className="w-full rounded-xl border border-border bg-muted/30 object-contain max-h-72" />
                      <p className="text-sm text-muted-foreground mt-3">{targetDimensions.width} x {targetDimensions.height} px | {formatBytes(outputBlob.size)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Original</p>
                      <p className="text-2xl font-black text-foreground">{formatBytes(source.size)}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Compressed</p>
                      <p className="text-2xl font-black text-foreground">{formatBytes(outputBlob.size)}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Savings</p>
                      <p className="text-2xl font-black text-cyan-700 dark:text-cyan-400">{savings !== null ? `${savings.toFixed(1)}%` : "--"}</p>
                    </div>
                    <button onClick={() => downloadBlob(outputBlob, downloadName)} className="rounded-xl bg-cyan-600 text-white font-bold text-sm px-4 py-4 hover:bg-cyan-700 transition-colors inline-flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> Download Compressed
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}

          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
        </div>
      }
      howToTitle="How to Use the Image Compressor"
      howToIntro="Image compression is rarely just about making a file smaller. The real goal is to reduce weight enough for the platform or use case while keeping the image visually acceptable. This tool helps by combining format selection, quality control, optional downscaling, and a direct before-and-after comparison."
      howSteps={[
        { title: "Upload the original image and inspect its starting size", description: "Select the file you want to compress. The tool reads its dimensions and file size so you can immediately see how heavy the original is before making changes." },
        { title: "Choose the compression strategy that fits the job", description: "Select WebP, JPG, or keep the original format, then adjust quality based on how aggressively you want to reduce size. Lower quality usually creates a smaller file, but the preview helps you judge whether the tradeoff is acceptable." },
        { title: "Reduce dimensions if needed and export the lighter file", description: "If quality reduction alone is not enough, lower the maximum width too. The comparison updates automatically so you can stop once the compressed version is small enough for the intended use." },
      ]}
      formulaTitle="Image Compression Concepts"
      formulaIntro="Compression is a mix of encoding and pixel reduction rather than one single formula. These relationships explain the two biggest reasons a compressed image becomes lighter."
      formulaCards={[
        { label: "Size Savings", formula: "Savings % = (Original Size - New Size) / Original Size x 100", detail: "This shows how much smaller the compressed file is than the original upload, which is useful when you need to hit upload or performance targets." },
        { label: "Dimension Reduction", formula: "New Height = Original Height x (New Width / Original Width)", detail: "When you lower maximum width, the tool scales height proportionally so the image remains visually correct while shedding pixels." },
      ]}
      examplesTitle="Image Compressor Examples"
      examplesIntro="Most compression jobs happen because an image is too heavy for the place where it needs to go. These examples show the common reasons people compress before publishing or sharing."
      examples={[
        { title: "Website Images", value: "Smaller Pages", detail: "Compressed blog images, product photos, and landing-page visuals usually load faster and consume less bandwidth." },
        { title: "Upload Limits", value: "Less MB", detail: "Reducing file size helps images fit under email, CRM, and online form limits without opening desktop editing software." },
        { title: "Modern Export", value: "WebP", detail: "Switching to WebP often reduces file size more effectively than keeping a heavy PNG or high-quality JPG for web delivery." },
      ]}
      contentTitle="Why An Image Compressor Matters"
      contentIntro="Image compression matters because large files create friction everywhere: slower page loads, failed uploads, oversized attachments, and heavier storage use. A browser-based compressor gives you a quick path to smaller files without needing a full editing suite."
      contentSections={[
        {
          title: "Why file size matters",
          paragraphs: [
            "Smaller files upload faster, download faster, and place less strain on storage and mobile data. That matters whether you are publishing a website, attaching an image to an email, or sending assets through an internal workflow.",
            "Compression is especially valuable for phone and camera photos because the original files are often far larger than the final destination actually requires.",
          ],
        },
        {
          title: "Why format choice changes the result",
          paragraphs: [
            "JPEG is the classic choice for compressed photo export, while WebP is often chosen for more efficient modern web delivery. Both respond to quality settings, but the results can differ depending on the image content.",
            "PNG is still useful for flat graphics and transparency, but it is usually not the best option when the main goal is aggressive file-size reduction for photographic images.",
          ],
        },
        {
          title: "When dimension reduction helps",
          paragraphs: [
            "If the source image is much larger than the final display area, quality tweaks alone may not be enough. Reducing maximum width often creates a larger file-size win than lowering quality aggressively.",
            "That is why this tool combines quality-based compression with optional downscaling, giving you more than one lever to reach the target size cleanly.",
          ],
        },
      ]}
      faqs={[
        { q: "Will image compression always reduce quality?", a: "Not always in an obvious way. Many images can be compressed significantly before visual differences become noticeable, especially at normal web display sizes." },
        { q: "What is the best format for compression?", a: "For many web images, WebP is a strong choice, while JPG remains a common option for photos. The best format depends on the content and where the image will be used." },
        { q: "Why would I reduce dimensions and quality together?", a: "Dimension reduction lowers the total pixel count, while quality settings reduce how much data is stored for those pixels. Using both together often creates the biggest savings." },
        { q: "Does this upload my image to a server?", a: "No. The compression runs in your browser, so the file stays on your device during the editing process." },
      ]}
      relatedTools={[
        { title: "Image Resizer", href: "/image/image-resizer", benefit: "Resize to exact dimensions before or after compression." },
        { title: "Image Format Converter", href: "/image/image-format-converter", benefit: "Switch between PNG, JPG, and WebP output." },
        { title: "Image Cropper", href: "/image/image-cropper", benefit: "Trim away unused edges before compressing." },
      ]}
      quickFacts={[
        { label: "Best For", value: "File-Size Reduction", detail: "Use it for site images, email attachments, form uploads, and messaging-ready exports." },
        { label: "Core Output", value: "Preview + Savings", detail: "Compare original and compressed versions before downloading the lighter file." },
        { label: "Privacy", value: "Local Processing", detail: "Compression happens in your browser rather than through a remote service." },
      ]}
    />
  );
}
