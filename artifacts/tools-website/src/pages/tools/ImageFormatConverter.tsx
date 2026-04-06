import { useEffect, useState } from "react";
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
} from "./imageToolUtils";

export default function ImageFormatConverter() {
  const [source, setSource] = useState<LoadedImage | null>(null);
  const [outputType, setOutputType] = useState("image/png");
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
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load image.");
    }
  };

  useEffect(() => {
    if (!source) {
      setOutputBlob(null);
      setOutputUrl("");
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        const qualityValue = clamp((parseFloat(quality) || 92) / 100, 0.1, 1);
        const canvas = drawImageToCanvas(source, source.width, source.height, (ctx, canvasEl) => {
          ctx.drawImage(source.image, 0, 0, canvasEl.width, canvasEl.height);
        });
        const blob = await canvasToBlob(canvas, outputType, outputType === "image/jpeg" || outputType === "image/webp" ? qualityValue : undefined);
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
        setError("");
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to convert image.");
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [outputType, quality, source]);

  const downloadName =
    source && outputBlob
      ? `${fileBaseName(source.name)}-converted.${extensionForMimeType(outputBlob.type)}`
      : "";

  return (
    <ImageToolPageShell
      title="Image Format Converter"
      seoTitle="Image Format Converter - Convert PNG, JPG, And WebP"
      seoDescription="Convert images between PNG, JPG, and WebP formats in your browser. Free image format converter with preview and instant download."
      canonical="https://usonlinetools.com/image/image-format-converter"
      heroDescription="Convert images between PNG, JPG, and WebP when a platform, workflow, or design requirement calls for a different file type. This tool is built for practical conversion tasks such as web optimization, upload compatibility, photo export, and quick browser-side format cleanup."
      heroIcon={<ImageIcon className="w-3.5 h-3.5" />}
      calculatorLabel="Format Switcher"
      calculatorDescription="Preview a converted image locally, compare file size, and download the output format that fits the next step in your workflow."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Upload Image</label>
            <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-500/30 bg-background px-4 py-5 text-sm font-medium text-foreground cursor-pointer hover:border-cyan-500/50 transition-colors">
              <Upload className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{source ? source.name : "Choose an image to convert"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(event) => void handleFileChange(event.target.files?.[0] ?? null)} />
            </label>
          </div>

          {source ? (
            <>
              <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Convert To</label>
                    <select value={outputType} onChange={(event) => setOutputType(event.target.value)} className="tool-calc-input w-full">
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
              </div>

              {outputBlob && outputUrl ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Original</p>
                      <img src={source.src} alt="Original image preview" className="w-full rounded-xl border border-border bg-muted/30 object-contain max-h-72" />
                      <p className="text-sm text-muted-foreground mt-3">{source.type || "unknown"} | {formatBytes(source.size)}</p>
                    </div>
                    <div className="rounded-2xl border border-cyan-500/20 bg-card p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Converted</p>
                      <img src={outputUrl} alt="Converted image preview" className="w-full rounded-xl border border-border bg-muted/30 object-contain max-h-72" />
                      <p className="text-sm text-muted-foreground mt-3">{outputBlob.type} | {formatBytes(outputBlob.size)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Original Type</p>
                      <p className="text-2xl font-black text-foreground">{source.type || "unknown"}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Output Type</p>
                      <p className="text-2xl font-black text-foreground">{outputBlob.type}</p>
                    </div>
                    <button onClick={() => downloadBlob(outputBlob, downloadName)} className="rounded-xl bg-cyan-600 text-white font-bold text-sm px-4 py-4 hover:bg-cyan-700 transition-colors inline-flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> Download Converted File
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}

          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
        </div>
      }
      howToTitle="How to Use the Image Format Converter"
      howToIntro="Image format conversion matters because file types behave differently. Some formats are better for photos, some are better for graphics, and some are simply required by the platform where the image will be uploaded. This tool makes it easy to test the new format before you download it."
      howSteps={[
        { title: "Upload the original image once", description: "Choose the source file from your device. The tool loads it locally and prepares a preview so you can compare the converted result against the original." },
        { title: "Choose the output format and quality", description: "Select PNG when you want lossless export, JPG for standard photo output, or WebP for smaller modern web delivery. If the chosen format supports quality control, use the slider to tune the result." },
        { title: "Compare and export the converted version", description: "The preview refreshes automatically after conversion. When the image looks correct and the output size makes sense, download the new file in the selected format." },
      ]}
      formulaTitle="Image Conversion Concepts"
      formulaIntro="Format conversion changes how image data is encoded, even when the visible dimensions stay the same. These two ideas explain why a converted file may behave differently from the original."
      formulaCards={[
        { label: "Pixel Grid", formula: "Width and Height stay the same unless resized separately", detail: "A format conversion normally preserves the original dimensions. If you need a different size as well, resizing is a separate step." },
        { label: "Encoding Method", formula: "PNG = lossless | JPG/WebP = compressed output", detail: "Different formats store image data differently, which is why the file size and visual characteristics can change after conversion." },
      ]}
      examplesTitle="Image Format Converter Examples"
      examplesIntro="Format conversion is usually triggered by compatibility, optimization, or editing needs. These are some of the most common situations where switching formats is useful."
      examples={[
        { title: "PNG To JPG", value: "Smaller Photos", detail: "Converting a photo-heavy PNG to JPG often produces a much lighter file for email, forms, and general uploads." },
        { title: "JPG To PNG", value: "Clean Export", detail: "PNG can be useful when you want a lossless file for further editing or for graphics that need sharper edges." },
        { title: "Any To WebP", value: "Modern Web", detail: "WebP is commonly chosen when the main objective is smaller web delivery with broad modern browser support." },
      ]}
      contentTitle="Why An Image Format Converter Is Useful"
      contentIntro="Different image formats exist because different jobs have different priorities. Sometimes you need smaller files, sometimes you need cleaner graphics, and sometimes you just need a file type that a platform will accept. A quick converter solves that without sending the image into a heavier editing workflow."
      contentSections={[
        {
          title: "Why formats matter",
          paragraphs: [
            "Some platforms require a specific file type, while some workflows benefit from a different balance of quality, transparency, compatibility, and file size.",
            "A lightweight converter helps you move between those formats quickly without opening a full desktop editor for what is often a simple export task.",
          ],
        },
        {
          title: "When PNG, JPG, and WebP make sense",
          paragraphs: [
            "PNG is useful for graphics, crisp edges, and workflows where lossless output matters. JPG is a common choice for photos, and WebP is often preferred for smaller modern web delivery.",
            "The best format depends on what the image contains and where it is going next, which is why previewing the converted result is valuable before download.",
          ],
        },
        {
          title: "Why file size may change after conversion",
          paragraphs: [
            "Changing file format changes the encoding method, so a converted file can become larger or smaller even when width and height do not change at all.",
            "Photo-heavy images often shrink when converted to JPG or WebP, while flat graphics and transparent assets may behave differently depending on the destination format.",
          ],
        },
      ]}
      faqs={[
        { q: "Does converting formats reduce image quality?", a: "It depends on the output format. PNG is lossless, while JPG and WebP can use compression settings that may reduce quality in exchange for smaller files." },
        { q: "Will the image dimensions change?", a: "No. This converter keeps the original width and height. If you want to change dimensions too, use the image resizer separately." },
        { q: "Which format should I use for websites?", a: "WebP is often a strong choice for modern web images, JPG is common for photos, and PNG is usually preferred for graphics that need crisp edges or transparency." },
        { q: "Is the conversion handled locally?", a: "Yes. The conversion runs in your browser, so the image does not need to be sent to a remote server for processing." },
      ]}
      relatedTools={[
        { title: "Image Resizer", href: "/image/image-resizer", benefit: "Change dimensions alongside format conversion." },
        { title: "Image Compressor", href: "/image/image-compressor", benefit: "Reduce file size after converting." },
        { title: "Image to Base64 Converter", href: "/image/image-to-base64", benefit: "Turn the converted image into a Base64 string." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Format Changes", detail: "Useful when a platform, CMS, or workflow requires PNG, JPG, or WebP." },
        { label: "Core Output", value: "Preview + Export", detail: "Compare the converted image and download the format that fits the next use case." },
        { label: "Privacy", value: "Processed Locally", detail: "The browser handles the conversion directly on your device." },
      ]}
    />
  );
}
