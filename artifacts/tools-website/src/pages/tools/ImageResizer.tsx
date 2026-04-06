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

function formatNumber(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function ImageResizer() {
  const [source, setSource] = useState<LoadedImage | null>(null);
  const [mode, setMode] = useState<"dimensions" | "percentage">("dimensions");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [percentage, setPercentage] = useState("50");
  const [keepAspect, setKeepAspect] = useState(true);
  const [outputType, setOutputType] = useState("original");
  const [quality, setQuality] = useState("92");
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
      setWidth(String(loaded.width));
      setHeight(String(loaded.height));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load image.");
    }
  };

  const handleWidthChange = (value: string) => {
    setWidth(value);
    if (!keepAspect || !source) return;
    const nextWidth = parseFloat(value);
    if (!Number.isFinite(nextWidth) || nextWidth <= 0) return;
    setHeight(String(Math.max(1, Math.round((nextWidth / source.width) * source.height))));
  };

  const handleHeightChange = (value: string) => {
    setHeight(value);
    if (!keepAspect || !source) return;
    const nextHeight = parseFloat(value);
    if (!Number.isFinite(nextHeight) || nextHeight <= 0) return;
    setWidth(String(Math.max(1, Math.round((nextHeight / source.height) * source.width))));
  };

  const resizedDimensions = useMemo(() => {
    if (!source) return null;

    if (mode === "percentage") {
      const scalePercent = parseFloat(percentage);
      if (!Number.isFinite(scalePercent) || scalePercent <= 0) return null;
      return {
        width: Math.max(1, Math.round(source.width * (scalePercent / 100))),
        height: Math.max(1, Math.round(source.height * (scalePercent / 100))),
      };
    }

    const parsedWidth = parseFloat(width);
    const parsedHeight = parseFloat(height);
    if (!Number.isFinite(parsedWidth) || !Number.isFinite(parsedHeight) || parsedWidth <= 0 || parsedHeight <= 0) return null;

    return {
      width: Math.max(1, Math.round(parsedWidth)),
      height: Math.max(1, Math.round(parsedHeight)),
    };
  }, [height, mode, percentage, source, width]);

  useEffect(() => {
    if (!source || !resizedDimensions) {
      setOutputBlob(null);
      setOutputUrl("");
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const mimeType = normalizeOutputMimeType(outputType, source.type);
        const canvas = drawImageToCanvas(source, resizedDimensions.width, resizedDimensions.height, (ctx, canvasEl) => {
          ctx.drawImage(source.image, 0, 0, canvasEl.width, canvasEl.height);
        });
        const qualityValue = clamp((parseFloat(quality) || 92) / 100, 0.1, 1);
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
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to resize image.");
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [outputType, quality, resizedDimensions, source]);

  const downloadName =
    source && outputBlob
      ? `${fileBaseName(source.name)}-resized.${extensionForMimeType(outputBlob.type || source.type)}`
      : "";

  return (
    <ImageToolPageShell
      title="Image Resizer"
      seoTitle="Image Resizer - Resize Images By Pixels Or Percentage"
      seoDescription="Resize images to exact pixel dimensions or by percentage in your browser. Free image resizer with preview, quality control, and instant download."
      canonical="https://usonlinetools.com/image/image-resizer"
      heroDescription="Resize images by exact pixel dimensions or by percentage while keeping full control over aspect ratio, output format, and preview quality. This page is built for real resize jobs such as blog banners, product images, email attachments, social posts, and lightweight web graphics."
      heroIcon={<ImageIcon className="w-3.5 h-3.5" />}
      calculatorLabel="Dimension + Scale Resizer"
      calculatorDescription="Resize by width and height or switch to percentage mode, then export in the format that fits your workflow."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Upload Image</label>
            <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-500/30 bg-background px-4 py-5 text-sm font-medium text-foreground cursor-pointer hover:border-cyan-500/50 transition-colors">
              <Upload className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{source ? source.name : "Choose PNG, JPG, WebP, GIF, or SVG"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(event) => void handleFileChange(event.target.files?.[0] ?? null)} />
            </label>
          </div>

          {source ? (
            <>
              <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
                <div className="flex rounded-lg overflow-hidden border border-border mb-4 sm:w-fit">
                  <button onClick={() => setMode("dimensions")} className={`px-4 py-2 text-sm font-bold transition-colors ${mode === "dimensions" ? "bg-cyan-600 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>
                    Exact Size
                  </button>
                  <button onClick={() => setMode("percentage")} className={`px-4 py-2 text-sm font-bold transition-colors ${mode === "percentage" ? "bg-cyan-600 text-white" : "bg-card text-muted-foreground hover:text-foreground"}`}>
                    Percentage
                  </button>
                </div>

                {mode === "dimensions" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Width (px)</label>
                      <input type="number" min="1" value={width} onChange={(event) => handleWidthChange(event.target.value)} className="tool-calc-input w-full" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Height (px)</label>
                      <input type="number" min="1" value={height} onChange={(event) => handleHeightChange(event.target.value)} className="tool-calc-input w-full" />
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Scale Percentage</label>
                    <input type="number" min="1" value={percentage} onChange={(event) => setPercentage(event.target.value)} className="tool-calc-input w-full" />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Output Format</label>
                    <select value={outputType} onChange={(event) => setOutputType(event.target.value)} className="tool-calc-input w-full">
                      <option value="original">Keep Original Format</option>
                      <option value="image/png">PNG</option>
                      <option value="image/jpeg">JPG</option>
                      <option value="image/webp">WebP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Quality ({quality}%)</label>
                    <input type="range" min="10" max="100" step="1" value={quality} onChange={(event) => setQuality(event.target.value)} className="w-full accent-cyan-600" />
                  </div>
                </div>

                {mode === "dimensions" && (
                  <label className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" checked={keepAspect} onChange={(event) => setKeepAspect(event.target.checked)} />
                    Keep original aspect ratio when editing width or height
                  </label>
                )}
              </div>

              {resizedDimensions && outputUrl && outputBlob ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Original</p>
                      <img src={source.src} alt="Original upload preview" className="w-full rounded-xl border border-border bg-muted/30 object-contain max-h-72" />
                      <p className="text-sm text-muted-foreground mt-3">{formatNumber(source.width)} x {formatNumber(source.height)} px | {formatBytes(source.size)}</p>
                    </div>
                    <div className="rounded-2xl border border-cyan-500/20 bg-card p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Resized</p>
                      <img src={outputUrl} alt="Resized preview" className="w-full rounded-xl border border-border bg-muted/30 object-contain max-h-72" />
                      <p className="text-sm text-muted-foreground mt-3">{formatNumber(resizedDimensions.width)} x {formatNumber(resizedDimensions.height)} px | {formatBytes(outputBlob.size)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Original Size</p>
                      <p className="text-2xl font-black text-foreground">{formatBytes(source.size)}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Resized File</p>
                      <p className="text-2xl font-black text-foreground">{formatBytes(outputBlob.size)}</p>
                    </div>
                    <button onClick={() => downloadBlob(outputBlob, downloadName)} className="rounded-xl bg-cyan-600 text-white font-bold text-sm px-4 py-4 hover:bg-cyan-700 transition-colors inline-flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> Download Resized Image
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}

          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
        </div>
      }
      howToTitle="How to Use the Image Resizer"
      howToIntro="This image resizer is designed for the two most common resizing workflows: setting an exact output size in pixels or shrinking the original file by a simple percentage. Because the resize happens in the browser, you can test sizes quickly, compare the output preview, and download the version that actually fits the slot you are designing for."
      howSteps={[
        { title: "Upload the original file and review its starting size", description: "Select a PNG, JPG, WebP, GIF, or SVG from your device. The tool reads the original dimensions immediately so you can tell whether the image needs a light reduction or a more aggressive downscale." },
        { title: "Pick the resize method that matches the job", description: "Use exact dimensions when a website, marketplace, CMS, or ad platform requires a specific width and height. Switch to percentage mode when you simply want to shrink a large image quickly without calculating target pixels yourself." },
        { title: "Fine-tune output settings and download the result", description: "Keep aspect ratio enabled when you want to avoid distortion, then choose the output format and quality. The preview updates automatically so you can confirm the resized image before downloading." },
      ]}
      formulaTitle="Image Resizing Formulas"
      formulaIntro="Resizing is fundamentally about redrawing the original image onto a new pixel grid. The rules below explain how the new size is calculated and why aspect ratio protection matters when you want clean results."
      formulaCards={[
        { label: "Scale By Percentage", formula: "New Width = Original Width x (Percentage / 100)", detail: "In percentage mode the same scale factor is applied to height, which makes it a fast way to shrink large photos evenly." },
        { label: "Aspect Ratio Lock", formula: "New Height = New Width x (Original Height / Original Width)", detail: "When aspect ratio is preserved, the second dimension is recalculated automatically so the image does not look stretched or squashed." },
      ]}
      examplesTitle="Image Resizer Examples"
      examplesIntro="Most resize tasks are practical production jobs. These examples mirror the kinds of changes people usually make before publishing, uploading, or sending images."
      examples={[
        { title: "Large Photo Reduction", value: "50%", detail: "A 2400 x 1600 photo resized to 50% becomes 1200 x 800, which is often much easier to upload or place in a CMS." },
        { title: "Homepage Banner", value: "1600 px", detail: "Exact dimensions are useful when a design system, page builder, or ad slot expects a fixed width for consistent layouts." },
        { title: "Aspect Ratio Safety", value: "No Stretch", detail: "Keeping the ratio locked protects portraits, product shots, and logos from accidental distortion during quick edits." },
      ]}
      contentTitle="Why An Image Resizer Is Useful"
      contentIntro="Resizing is one of the most common image-editing tasks because almost every publishing workflow has a target dimension in mind. Whether the goal is faster pages, cleaner layouts, or easier uploads, the right size usually matters more than the original camera resolution."
      contentSections={[
        {
          title: "Why pixel dimensions matter",
          paragraphs: [
            "A homepage banner, blog image, marketplace listing, or document attachment usually has a practical target width. When the source image is far larger than that slot, you end up shipping extra pixels that do nothing except increase file size.",
            "Resizing before upload is normally the cleaner workflow because you control the final output instead of relying on a platform to scale it unpredictably after the fact.",
          ],
        },
        {
          title: "Why percentage resizing is practical",
          paragraphs: [
            "Percentage resizing is ideal when you do not need an exact target width and simply want a large image to become smaller fast. A 50% or 25% reduction is often enough to make camera photos workable for email, messaging, or CMS uploads.",
            "It is also useful during experimentation because you can quickly compare a few relative sizes before committing to a final export.",
          ],
        },
        {
          title: "Why aspect ratio should be preserved",
          paragraphs: [
            "Changing width and height independently can distort a photo, stretch a logo, or make product images look unprofessional. Preserving aspect ratio keeps the image shape visually correct while still letting you resize efficiently.",
            "The lock option removes the need for manual calculation, which makes the tool faster for routine publishing work and safer for non-design users.",
          ],
        },
      ]}
      faqs={[
        { q: "Does resizing reduce file size too?", a: "Usually yes. Fewer pixels often mean a smaller file, although the final result also depends on the selected format and quality setting." },
        { q: "Will this tool crop my image?", a: "No. The resizer keeps the full image and changes only its output dimensions. If you need to remove edges or reframe the subject, use the image cropper instead." },
        { q: "Can I resize images without uploading them to a server?", a: "Yes. The resize runs in your browser, which is useful for quick edits and helps keep the source file on your device." },
        { q: "Should I use PNG, JPG, or WebP after resizing?", a: "PNG is often best for sharp graphics, JPG is common for photos, and WebP is a strong choice when you want smaller modern web files." },
      ]}
      relatedTools={[
        { title: "Image Compressor", href: "/image/image-compressor", benefit: "Reduce file size further after resizing." },
        { title: "Image Cropper", href: "/image/image-cropper", benefit: "Trim the image to a tighter frame before export." },
        { title: "Image Format Converter", href: "/image/image-format-converter", benefit: "Switch between PNG, JPG, and WebP." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Dimension Changes", detail: "Use it for banners, thumbnails, listings, blog images, and oversized uploads." },
        { label: "Core Output", value: "Pixels + Format", detail: "Change size, keep or switch format, and verify the result before export." },
        { label: "Privacy", value: "Local Only", detail: "The resize happens in your browser rather than through a remote upload pipeline." },
      ]}
    />
  );
}
