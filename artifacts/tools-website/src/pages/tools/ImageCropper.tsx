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

const ASPECT_OPTIONS: Record<string, number | null> = {
  free: null,
  square: 1,
  "4:3": 4 / 3,
  "16:9": 16 / 9,
};

export default function ImageCropper() {
  const [source, setSource] = useState<LoadedImage | null>(null);
  const [cropX, setCropX] = useState("0");
  const [cropY, setCropY] = useState("0");
  const [cropWidth, setCropWidth] = useState("");
  const [cropHeight, setCropHeight] = useState("");
  const [aspectPreset, setAspectPreset] = useState("free");
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

  const applyAspectPreset = (preset: string, loaded: LoadedImage) => {
    const ratio = ASPECT_OPTIONS[preset];
    if (!ratio) {
      setCropX("0");
      setCropY("0");
      setCropWidth(String(loaded.width));
      setCropHeight(String(loaded.height));
      return;
    }

    let nextWidth = loaded.width;
    let nextHeight = Math.round(nextWidth / ratio);

    if (nextHeight > loaded.height) {
      nextHeight = loaded.height;
      nextWidth = Math.round(nextHeight * ratio);
    }

    const nextX = Math.max(0, Math.round((loaded.width - nextWidth) / 2));
    const nextY = Math.max(0, Math.round((loaded.height - nextHeight) / 2));

    setCropX(String(nextX));
    setCropY(String(nextY));
    setCropWidth(String(nextWidth));
    setCropHeight(String(nextHeight));
  };

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    try {
      const loaded = await loadImageFile(file);
      setSource(loaded);
      setAspectPreset("free");
      setCropX("0");
      setCropY("0");
      setCropWidth(String(loaded.width));
      setCropHeight(String(loaded.height));
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

    const x = clamp(Math.round(parseFloat(cropX) || 0), 0, source.width - 1);
    const y = clamp(Math.round(parseFloat(cropY) || 0), 0, source.height - 1);
    const width = clamp(Math.round(parseFloat(cropWidth) || 0), 1, source.width - x);
    const height = clamp(Math.round(parseFloat(cropHeight) || 0), 1, source.height - y);
    const qualityValue = clamp((parseFloat(quality) || 92) / 100, 0.1, 1);

    let cancelled = false;

    const run = async () => {
      try {
        const canvas = drawImageToCanvas(source, width, height, (ctx) => {
          ctx.drawImage(source.image, x, y, width, height, 0, 0, width, height);
        });
        const blob = await canvasToBlob(canvas, outputType, outputType === "image/jpeg" || outputType === "image/webp" ? qualityValue : undefined);
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
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to crop image.");
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [cropHeight, cropWidth, cropX, cropY, outputType, quality, source]);

  const downloadName =
    source && outputBlob
      ? `${fileBaseName(source.name)}-cropped.${extensionForMimeType(outputBlob.type || source.type)}`
      : "";

  return (
    <ImageToolPageShell
      title="Image Cropper"
      seoTitle="Image Cropper - Crop Images To Custom Dimensions Or Ratios"
      seoDescription="Crop images in your browser using custom crop dimensions or common aspect ratios. Free image cropper with preview and instant download."
      canonical="https://usonlinetools.com/image/image-cropper"
      heroDescription="Crop images to the exact frame you need using manual pixel coordinates or quick presets like square, 4:3, and 16:9. This tool is built for real-world jobs such as profile photos, marketplace thumbnails, banner images, product closeups, and cleaner content framing."
      heroIcon={<ImageIcon className="w-3.5 h-3.5" />}
      calculatorLabel="Coordinate-Based Cropper"
      calculatorDescription="Trim by crop box, choose an output format, preview the framing, and download the result immediately."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Upload Image</label>
            <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-500/30 bg-background px-4 py-5 text-sm font-medium text-foreground cursor-pointer hover:border-cyan-500/50 transition-colors">
              <Upload className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{source ? source.name : "Choose an image to crop"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(event) => void handleFileChange(event.target.files?.[0] ?? null)} />
            </label>
          </div>

          {source ? (
            <>
              <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Aspect Preset</label>
                    <select
                      value={aspectPreset}
                      onChange={(event) => {
                        const preset = event.target.value;
                        setAspectPreset(preset);
                        applyAspectPreset(preset, source);
                      }}
                      className="tool-calc-input w-full"
                    >
                      <option value="free">Free Crop</option>
                      <option value="square">Square</option>
                      <option value="4:3">4:3</option>
                      <option value="16:9">16:9</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Output Format</label>
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">X</label>
                    <input type="number" min="0" value={cropX} onChange={(event) => setCropX(event.target.value)} className="tool-calc-input w-full" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Y</label>
                    <input type="number" min="0" value={cropY} onChange={(event) => setCropY(event.target.value)} className="tool-calc-input w-full" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Width</label>
                    <input type="number" min="1" value={cropWidth} onChange={(event) => setCropWidth(event.target.value)} className="tool-calc-input w-full" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Height</label>
                    <input type="number" min="1" value={cropHeight} onChange={(event) => setCropHeight(event.target.value)} className="tool-calc-input w-full" />
                  </div>
                </div>
              </div>

              {outputUrl && outputBlob ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Original</p>
                      <img src={source.src} alt="Original image preview" className="w-full rounded-xl border border-border bg-muted/30 object-contain max-h-72" />
                      <p className="text-sm text-muted-foreground mt-3">{source.width} x {source.height} px | {formatBytes(source.size)}</p>
                    </div>
                    <div className="rounded-2xl border border-cyan-500/20 bg-card p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Cropped Preview</p>
                      <img src={outputUrl} alt="Cropped image preview" className="w-full rounded-xl border border-border bg-muted/30 object-contain max-h-72" />
                      <p className="text-sm text-muted-foreground mt-3">{cropWidth} x {cropHeight} px | {formatBytes(outputBlob.size)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Crop Box</p>
                      <p className="text-2xl font-black text-foreground">{cropX}, {cropY}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Output Size</p>
                      <p className="text-2xl font-black text-foreground">{cropWidth} x {cropHeight}</p>
                    </div>
                    <button onClick={() => downloadBlob(outputBlob, downloadName)} className="rounded-xl bg-cyan-600 text-white font-bold text-sm px-4 py-4 hover:bg-cyan-700 transition-colors inline-flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> Download Cropped Image
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}

          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
        </div>
      }
      howToTitle="How to Use the Image Cropper"
      howToIntro="Cropping is the fastest way to improve composition when the original image contains too much background, awkward spacing, or the wrong shape for the destination. This tool lets you control the crop area numerically, which is especially useful when you need repeatable output sizes or preset aspect ratios."
      howSteps={[
        { title: "Upload the source image and inspect the full frame", description: "Choose the image you want to trim. The tool reads its original width and height so your crop coordinates and output dimensions stay grounded in the real pixel size of the file." },
        { title: "Set the crop box manually or start from a preset ratio", description: "Use the aspect preset when you need a square, 4:3, or 16:9 output fast, or enter X, Y, width, and height yourself when the crop needs to match a precise layout requirement." },
        { title: "Review the cropped preview and export it", description: "The preview updates as the crop box changes. When the framing is right, choose PNG, JPG, or WebP and download the trimmed version." },
      ]}
      formulaTitle="Image Cropping Concepts"
      formulaIntro="Cropping keeps only a selected rectangle from the original image, which means both composition and output size are controlled by the crop box. These are the two rules that matter most when you are trimming an image with intention."
      formulaCards={[
        { label: "Crop Area", formula: "Output Pixels = Crop Width x Crop Height", detail: "Only the pixels inside the selected crop rectangle are kept. Everything outside that box is removed from the exported image." },
        { label: "Aspect Ratio", formula: "Aspect Ratio = Crop Width / Crop Height", detail: "Ratios like 1:1, 4:3, and 16:9 create predictable shapes for avatars, cards, banners, and other layout-driven placements." },
      ]}
      examplesTitle="Image Cropper Examples"
      examplesIntro="Most cropping jobs fall into a few clear patterns: removing clutter, matching a required shape, or tightening focus around the subject. These examples reflect those common outcomes."
      examples={[
        { title: "Profile Image", value: "1:1", detail: "A square crop is ideal for avatars, author photos, and thumbnail grids where every image needs the same shape." },
        { title: "Banner Or Cover", value: "16:9", detail: "A 16:9 crop works well for hero sections, video thumbnails, and wide cards that need a balanced landscape frame." },
        { title: "Subject Emphasis", value: "Less Clutter", detail: "Cropping away empty margins or distractions around the edges usually produces a cleaner, more intentional image." },
      ]}
      contentTitle="Why An Image Cropper Is Useful"
      contentIntro="Cropping is one of the highest-impact image edits because it changes the framing, not just the file size. A better crop can make a product clearer, a profile photo tighter, or a banner more visually balanced without any heavy editing workflow."
      contentSections={[
        {
          title: "Why cropping improves composition",
          paragraphs: [
            "Many images start with too much background, uneven spacing, or distracting elements near the edges. Cropping removes that visual noise and lets the main subject take up the space it deserves.",
            "That is especially useful for product images, profile photos, article thumbnails, and marketplace listings where a tighter frame usually performs better than a loose one.",
          ],
        },
        {
          title: "Why aspect ratios matter",
          paragraphs: [
            "Different destinations expect different shapes. Square crops fit profile images and grid thumbnails, while wide crops are common for banners, cards, and video covers.",
            "Choosing the correct ratio before upload reduces the risk of a platform auto-cropping the image in a way that cuts off the subject or breaks the composition.",
          ],
        },
        {
          title: "When to crop before resizing",
          paragraphs: [
            "If you only need a portion of the original image, cropping first is usually the cleaner workflow. It removes unwanted pixels before you spend time resizing or compressing the final output.",
            "After the crop is finalized, you can still resize or compress the result for the target platform without carrying unnecessary content through the rest of the workflow.",
          ],
        },
      ]}
      faqs={[
        { q: "Does cropping change file size?", a: "Usually yes. Because the cropped result contains fewer pixels than the original, the exported file is often smaller too." },
        { q: "What is the difference between cropping and resizing?", a: "Cropping removes part of the image to change the framing. Resizing keeps the full image but changes its output dimensions." },
        { q: "Can I crop to a square or widescreen shape?", a: "Yes. The tool includes quick presets for square, 4:3, and 16:9, and you can still enter exact crop dimensions manually when needed." },
        { q: "Is the crop done locally?", a: "Yes. The crop is rendered in your browser, so the uploaded image stays on your device during the edit." },
      ]}
      relatedTools={[
        { title: "Image Resizer", href: "/image/image-resizer", benefit: "Resize the cropped output to a final pixel size." },
        { title: "Image Compressor", href: "/image/image-compressor", benefit: "Reduce the cropped file size after trimming." },
        { title: "Image Format Converter", href: "/image/image-format-converter", benefit: "Export the cropped image in another format." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Framing Changes", detail: "Ideal for avatars, hero images, product shots, and cleaner visual focus." },
        { label: "Core Output", value: "Crop Box Export", detail: "Choose the exact rectangle you want to keep, then download it in the format you need." },
        { label: "Privacy", value: "Browser Based", detail: "The crop preview and export are created on your device instead of a remote editor." },
      ]}
    />
  );
}
