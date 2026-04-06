import { useEffect, useMemo, useRef, useState, type ChangeEvent, type MouseEvent, type ReactNode } from "react";
import { Image as ImageIcon, Layers, Link2, Palette, QrCode, RotateCw, ScanSearch, Shield, Sparkles, Wand2 } from "lucide-react";
import { useParams } from "wouter";
import ImageToolPageShell from "./ImageToolPageShell";
import QrCodeGeneratorCalculator from "./QrCodeGeneratorCalculator";
import {
  ImageToPngCalculator,
  ImageWatermarkCalculator,
  MemeGeneratorCalculator,
  PngToWebpCalculator,
  SvgToPngCalculator,
} from "./UndevelopedImageToolCalculators";
import ToolPlaceholder from "../ToolPlaceholder";
import { getRelatedTools, getToolBySlug } from "@/data/tools";
import { canvasToBlob, downloadBlob, fileBaseName, formatBytes, loadImageFile, type LoadedImage } from "./imageToolUtils";

type Variant = {
  hero: string;
  label: string;
  workflow: string[];
  intro: string;
  concepts: Array<{ label: string; formula: string; detail: string }>;
  examples: Array<{ title: string; value: string; detail: string }>;
  facts: Array<{ label: string; value: string; detail: string }>;
  icon?: ReactNode;
};

const DEFAULT_VARIANT: Variant = {
  hero: "Use this browser-based image tool with the same long-form structure as the site's flagship calculator pages, including workflow guidance, examples, FAQs, and related tool paths.",
  label: "Image Workflow Preview",
  workflow: ["Add the source image or data.", "Adjust the tool-specific options.", "Preview the result and export the final asset."],
  intro: "This page is organized around a simple image workflow so users can understand the task, prepare the source asset, and move to the next production step quickly.",
  concepts: [
    { label: "Source Input", formula: "Image/Data -> Browser Processing", detail: "The tool starts with a source asset and applies a focused browser-side transformation." },
    { label: "Final Output", formula: "Adjusted Asset -> Export/Copy", detail: "The goal is a clean output that is ready for publishing, embedding, or further editing." },
  ],
  examples: [
    { title: "Content Work", value: "Faster Prep", detail: "Prepare visuals for sites, forms, or campaign assets without opening a heavier editor." },
    { title: "Design Flow", value: "Cleaner Files", detail: "Handle one focused image step quickly before moving to the next tool." },
    { title: "Development", value: "Browser First", detail: "Keep the workflow local and lightweight for common asset tasks." },
  ],
  facts: [
    { label: "Category", value: "Image Tools", detail: "Part of the browser-based visual utility suite." },
    { label: "Best For", value: "Quick Asset Tasks", detail: "Useful for creators, marketers, and developers handling common image jobs." },
    { label: "Style", value: "Content First", detail: "Built around the same rich page structure used by the site's main calculator pages." },
  ],
};

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

const FAVICON_OUTPUTS = [
  { size: 16, filename: "favicon-16x16.png", use: "Browser tabs" },
  { size: 32, filename: "favicon-32x32.png", use: "Bookmarks and tabs" },
  { size: 48, filename: "favicon-48x48.png", use: "Windows shortcuts" },
  { size: 180, filename: "apple-touch-icon.png", use: "iPhone home screen" },
  { size: 192, filename: "android-chrome-192x192.png", use: "Android icons" },
  { size: 512, filename: "android-chrome-512x512.png", use: "High-res app icon" },
] as const;

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function joinAssetPath(basePath: string, filename: string) {
  const normalized = basePath.trim();

  if (!normalized || normalized === "/") {
    return `/${filename}`;
  }

  return `${normalized.replace(/\/+$/, "")}/${filename}`;
}

function rgbToHsl(r: number, g: number, b: number) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) {
    return { h: 0, s: 0, l: Math.round(lightness * 100) };
  }

  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;

  if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
  else if (max === green) hue = (blue - red) / delta + 2;
  else hue = (red - green) / delta + 4;

  return {
    h: Math.round(hue * 60),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

function ImageColorPickerCalculator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [sample, setSample] = useState<{ x: number; y: number; hex: string; rgb: string; hsl: string } | null>(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const image = new Image();
    image.onload = () => {
      const maxWidth = 960;
      const scale = Math.min(1, maxWidth / image.width);
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      canvas.width = width;
      canvas.height = height;
      context.clearRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      setDimensions({ width: image.width, height: image.height });
      setSample(null);
    };
    image.src = imageSrc;
  }, [imageSrc]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  const handleCanvasClick = (event: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * canvas.height);
    const pixel = context.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
    const hsl = rgbToHsl(pixel[0], pixel[1], pixel[2]);

    setSample({
      x,
      y,
      hex,
      rgb: `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    });
  };

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
        <label htmlFor="image-color-input" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Upload Image
        </label>
        <input
          id="image-color-input"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
          onChange={handleFileChange}
          className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-cyan-600"
        />
        <p className="mt-3 text-sm text-muted-foreground">Upload an image, then click anywhere on it to sample the exact color of that pixel.</p>
      </div>

      {imageSrc ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Image Canvas</p>
              <p className="text-xs text-muted-foreground">
                {dimensions ? `${dimensions.width} x ${dimensions.height} source pixels` : "Loading image..."}
              </p>
            </div>
            <canvas ref={canvasRef} onClick={handleCanvasClick} className="w-full rounded-xl border border-border cursor-crosshair bg-muted/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Sampled Color</p>
              <div className="h-20 rounded-xl border border-border" style={{ backgroundColor: sample?.hex ?? "#E2E8F0" }} />
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">HEX</p>
              <p className="font-mono font-bold text-foreground break-all">{sample?.hex ?? "Click image"}</p>
              {sample ? <button onClick={() => copyValue("HEX", sample.hex)} className="mt-2 text-xs font-bold text-cyan-600">{copied === "HEX" ? "Copied" : "Copy HEX"}</button> : null}
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">RGB</p>
              <p className="font-mono font-bold text-foreground break-all">{sample?.rgb ?? "Click image"}</p>
              {sample ? <button onClick={() => copyValue("RGB", sample.rgb)} className="mt-2 text-xs font-bold text-cyan-600">{copied === "RGB" ? "Copied" : "Copy RGB"}</button> : null}
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">HSL</p>
              <p className="font-mono font-bold text-foreground break-all">{sample?.hsl ?? "Click image"}</p>
              {sample ? <button onClick={() => copyValue("HSL", sample.hsl)} className="mt-2 text-xs font-bold text-cyan-600">{copied === "HSL" ? "Copied" : "Copy HSL"}</button> : null}
            </div>
          </div>

          {sample ? (
            <div className="rounded-2xl border border-cyan-500/15 bg-card p-4">
              <p className="text-sm text-muted-foreground">Sampled pixel at canvas position <span className="font-semibold text-foreground">({sample.x}, {sample.y})</span>. Click a different point to inspect another color.</p>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-5 text-sm text-muted-foreground">
          Upload an image to start sampling colors directly from the picture.
        </div>
      )}
    </div>
  );
}

function FaviconGeneratorCalculator() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [sourceMeta, setSourceMeta] = useState<{ width: number; height: number } | null>(null);
  const [padding, setPadding] = useState(12);
  const [background, setBackground] = useState("#ffffff");
  const [transparent, setTransparent] = useState(true);
  const [basePath, setBasePath] = useState("/");
  const [copied, setCopied] = useState("");
  const [outputs, setOutputs] = useState<Array<{ size: number; filename: string; use: string; dataUrl: string }>>([]);

  useEffect(() => {
    if (!imageSrc) {
      setOutputs([]);
      setSourceMeta(null);
      return;
    }

    const image = new Image();
    image.onload = () => {
      setSourceMeta({ width: image.width, height: image.height });

      const generated = FAVICON_OUTPUTS.map((output) => {
        const canvas = document.createElement("canvas");
        canvas.width = output.size;
        canvas.height = output.size;
        const context = canvas.getContext("2d");

        if (!context) {
          return { ...output, dataUrl: "" };
        }

        if (!transparent) {
          context.fillStyle = background;
          context.fillRect(0, 0, output.size, output.size);
        }

        const crop = Math.min(image.width, image.height);
        const sourceX = Math.round((image.width - crop) / 2);
        const sourceY = Math.round((image.height - crop) / 2);
        const inset = Math.round((output.size * padding) / 100);
        const drawSize = Math.max(1, output.size - inset * 2);

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(image, sourceX, sourceY, crop, crop, inset, inset, drawSize, drawSize);

        return {
          ...output,
          dataUrl: canvas.toDataURL("image/png"),
        };
      });

      setOutputs(generated);
    };

    image.src = imageSrc;
  }, [background, imageSrc, padding, transparent]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  const htmlSnippet = useMemo(() => {
    return [
      `<link rel="icon" type="image/png" sizes="16x16" href="${joinAssetPath(basePath, "favicon-16x16.png")}" />`,
      `<link rel="icon" type="image/png" sizes="32x32" href="${joinAssetPath(basePath, "favicon-32x32.png")}" />`,
      `<link rel="apple-touch-icon" sizes="180x180" href="${joinAssetPath(basePath, "apple-touch-icon.png")}" />`,
      `<link rel="icon" type="image/png" sizes="192x192" href="${joinAssetPath(basePath, "android-chrome-192x192.png")}" />`,
      `<link rel="icon" type="image/png" sizes="512x512" href="${joinAssetPath(basePath, "android-chrome-512x512.png")}" />`,
    ].join("\n");
  }, [basePath]);

  const minDimension = sourceMeta ? Math.min(sourceMeta.width, sourceMeta.height) : 0;
  const sourceState = !sourceMeta ? "Upload a source image" : minDimension >= 512 ? "Strong source size" : minDimension >= 256 ? "Usable but limited" : "Small source image";
  const sourceMessage = !sourceMeta
    ? "A square or near-square logo works best."
    : minDimension >= 512
      ? "The source is large enough to generate the full PNG favicon set cleanly."
      : minDimension >= 256
        ? "This source can work, but the smallest icons may lose detail if the logo is complex."
        : "This source is small. Tiny favicon sizes may become blurry or hard to recognize.";

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  };

  const downloadAll = () => {
    outputs.forEach((output, index) => {
      window.setTimeout(() => {
        if (output.dataUrl) {
          downloadDataUrl(output.dataUrl, output.filename);
        }
      }, index * 180);
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-5">
          <div>
            <label htmlFor="favicon-input" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Upload Logo or Icon
            </label>
            <input
              id="favicon-input"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleFileChange}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-cyan-600"
            />
            <p className="mt-3 text-sm text-muted-foreground">
              Upload a clean logo, monogram, or app icon. The generator center-crops the image to a square and creates the common favicon PNG sizes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Source</p>
              <p className="mt-2 text-xl font-black text-foreground">{sourceMeta ? `${sourceMeta.width} x ${sourceMeta.height}` : "--"}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Outputs</p>
              <p className="mt-2 text-xl font-black text-foreground">{outputs.length}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Padding</p>
              <p className="mt-2 text-xl font-black text-foreground">{padding}%</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Background</p>
              <p className="mt-2 text-xl font-black text-foreground">{transparent ? "Transparent" : background.toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-cyan-500/15 bg-card p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Padding</label>
                <input type="range" min="0" max="28" value={padding} onChange={(event) => setPadding(Number(event.target.value))} className="w-full accent-cyan-500" />
                <p className="mt-2 text-xs text-muted-foreground">Extra breathing room around the icon keeps small sizes cleaner.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Background</label>
                <input type="color" value={background} onChange={(event) => setBackground(event.target.value)} className="h-11 w-full rounded-xl border border-border bg-background p-1" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Export Style</label>
                <button
                  onClick={() => setTransparent((value) => !value)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:border-cyan-500/40"
                >
                  {transparent ? "Transparent PNG" : "Solid Background PNG"}
                </button>
              </div>
            </div>
          </div>

          {outputs.length > 0 ? (
            <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Generated PNG Favicon Set</p>
                  <p className="text-sm text-muted-foreground">Preview each output size and download the exact PNG files you need.</p>
                </div>
                <button onClick={downloadAll} className="rounded-full bg-cyan-500 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-600">
                  Download All PNGs
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {outputs.map((output) => (
                  <div key={output.filename} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{output.size} x {output.size}</p>
                      <button onClick={() => downloadDataUrl(output.dataUrl, output.filename)} className="text-xs font-bold text-cyan-700 dark:text-cyan-400">
                        Download
                      </button>
                    </div>
                    <div className="flex h-24 items-center justify-center rounded-2xl border border-border bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08),transparent_65%)]">
                      <img src={output.dataUrl} alt={output.filename} className="max-h-16 max-w-16 rounded-md" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-foreground">{output.filename}</p>
                    <p className="text-xs text-muted-foreground">{output.use}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card p-5 text-sm text-muted-foreground">
              Upload a source image to generate favicon previews and PNG downloads.
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className={`rounded-2xl border p-5 ${sourceMeta ? (minDimension >= 512 ? "border-emerald-500/20 bg-emerald-500/5" : minDimension >= 256 ? "border-amber-500/20 bg-amber-500/5" : "border-rose-500/20 bg-rose-500/5") : "border-border bg-card"}`}>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Step 1: Source Readiness</p>
            <p className="text-lg font-black text-foreground">{sourceState}</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{sourceMessage}</p>
          </div>

          <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Step 2: Small-Size Check</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The 16x16 and 32x32 previews are the most important test. If the symbol loses shape there, increase padding or simplify the source icon before exporting.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/15 bg-card p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Head Snippet</p>
                <p className="text-sm text-muted-foreground">Copy the HTML tags that reference the generated favicon PNG files.</p>
              </div>
              <button onClick={() => copyValue("snippet", htmlSnippet)} className="text-xs font-bold text-cyan-700 dark:text-cyan-400">
                {copied === "snippet" ? "Copied" : "Copy"}
              </button>
            </div>

            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Base Path or CDN Prefix</label>
            <input
              value={basePath}
              onChange={(event) => setBasePath(event.target.value)}
              placeholder="/"
              className="tool-calc-input mb-3 w-full"
            />

            <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
              <code>{htmlSnippet}</code>
            </pre>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Step 3: Export Pack</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This generator outputs the most common PNG favicon sizes plus copy-ready HTML tags. If you also need a legacy `.ico` file, convert the exported 32x32 PNG externally after confirming the artwork reads clearly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

type BackgroundRemovalResult = {
  transparentBlob: Blob;
  transparentUrl: string;
  flatBlob: Blob;
  flatUrl: string;
  removedPixels: number;
  keptPixels: number;
  totalPixels: number;
  cornerHexes: string[];
};

function averageCornerSample(data: Uint8ClampedArray, width: number, height: number, x: number, y: number, radius: number) {
  let red = 0;
  let green = 0;
  let blue = 0;
  let count = 0;

  for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
    for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
      const px = Math.min(width - 1, Math.max(0, x + offsetX));
      const py = Math.min(height - 1, Math.max(0, y + offsetY));
      const index = (py * width + px) * 4;
      red += data[index];
      green += data[index + 1];
      blue += data[index + 2];
      count += 1;
    }
  }

  return {
    r: Math.round(red / count),
    g: Math.round(green / count),
    b: Math.round(blue / count),
  };
}

function colorDistance(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) {
  const red = a.r - b.r;
  const green = a.g - b.g;
  const blue = a.b - b.b;
  return Math.sqrt(red * red + green * green + blue * blue);
}

async function buildBackgroundRemoval(
  source: LoadedImage,
  tolerance: number,
  softness: number,
  previewColor: string,
): Promise<BackgroundRemovalResult> {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not supported in this browser.");
  }

  context.drawImage(source.image, 0, 0, source.width, source.height);
  const imageData = context.getImageData(0, 0, source.width, source.height);
  const { data } = imageData;
  const radius = Math.max(1, Math.round(Math.min(source.width, source.height) * 0.015));
  const cornerPoints = [
    { x: radius, y: radius },
    { x: source.width - 1 - radius, y: radius },
    { x: radius, y: source.height - 1 - radius },
    { x: source.width - 1 - radius, y: source.height - 1 - radius },
  ];
  const referenceColors = cornerPoints.map((point) => averageCornerSample(data, source.width, source.height, point.x, point.y, radius));
  const lowerBound = Math.max(0, tolerance - softness);
  const upperBound = tolerance + softness;
  let removedPixels = 0;

  for (let index = 0; index < data.length; index += 4) {
    const pixel = { r: data[index], g: data[index + 1], b: data[index + 2] };
    const distance = Math.min(...referenceColors.map((sample) => colorDistance(pixel, sample)));
    let alpha = 255;

    if (distance <= lowerBound) {
      alpha = 0;
    } else if (distance < upperBound) {
      const ratio = (distance - lowerBound) / Math.max(1, upperBound - lowerBound);
      alpha = Math.round(ratio * 255);
    }

    data[index + 3] = Math.min(data[index + 3], alpha);
    if (data[index + 3] <= 8) {
      removedPixels += 1;
    }
  }

  context.putImageData(imageData, 0, 0);

  const flatCanvas = document.createElement("canvas");
  flatCanvas.width = source.width;
  flatCanvas.height = source.height;
  const flatContext = flatCanvas.getContext("2d");

  if (!flatContext) {
    throw new Error("Canvas is not supported in this browser.");
  }

  flatContext.fillStyle = previewColor;
  flatContext.fillRect(0, 0, flatCanvas.width, flatCanvas.height);
  flatContext.drawImage(canvas, 0, 0);

  const transparentBlob = await canvasToBlob(canvas, "image/png");
  const flatBlob = await canvasToBlob(flatCanvas, "image/jpeg", 0.92);
  const totalPixels = source.width * source.height;

  return {
    transparentBlob,
    transparentUrl: window.URL.createObjectURL(transparentBlob),
    flatBlob,
    flatUrl: window.URL.createObjectURL(flatBlob),
    removedPixels,
    keptPixels: Math.max(0, totalPixels - removedPixels),
    totalPixels,
    cornerHexes: referenceColors.map((sample) => rgbToHex(sample.r, sample.g, sample.b)),
  };
}

function BackgroundRemoverCalculator() {
  const [source, setSource] = useState<LoadedImage | null>(null);
  const [tolerance, setTolerance] = useState(38);
  const [softness, setSoftness] = useState(18);
  const [previewColor, setPreviewColor] = useState("#ffffff");
  const [result, setResult] = useState<BackgroundRemovalResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    return () => {
      if (result) {
        window.URL.revokeObjectURL(result.transparentUrl);
        window.URL.revokeObjectURL(result.flatUrl);
      }
    };
  }, [result]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const loaded = await loadImageFile(file);
      setSource(loaded);
      setError("");
    } catch (loadError: unknown) {
      setSource(null);
      setResult((current) => {
        if (current) {
          window.URL.revokeObjectURL(current.transparentUrl);
          window.URL.revokeObjectURL(current.flatUrl);
        }
        return null;
      });
      setError(loadError instanceof Error ? loadError.message : "Failed to load image.");
    }
  };

  useEffect(() => {
    if (!source) {
      setResult((current) => {
        if (current) {
          window.URL.revokeObjectURL(current.transparentUrl);
          window.URL.revokeObjectURL(current.flatUrl);
        }
        return null;
      });
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        setIsProcessing(true);
        const nextResult = await buildBackgroundRemoval(source, tolerance, softness, previewColor);
        if (cancelled) {
          window.URL.revokeObjectURL(nextResult.transparentUrl);
          window.URL.revokeObjectURL(nextResult.flatUrl);
          return;
        }

        setResult((current) => {
          if (current) {
            window.URL.revokeObjectURL(current.transparentUrl);
            window.URL.revokeObjectURL(current.flatUrl);
          }
          return nextResult;
        });
        setError("");
      } catch (processingError: unknown) {
        if (!cancelled) {
          setError(processingError instanceof Error ? processingError.message : "Failed to remove background.");
        }
      } finally {
        if (!cancelled) {
          setIsProcessing(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [previewColor, softness, source, tolerance]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  };

  const summary = useMemo(() => {
    if (!source || !result) return "";
    const removedPercent = ((result.removedPixels / result.totalPixels) * 100).toFixed(1);
    return [
      `Source: ${source.name}`,
      `Dimensions: ${source.width} x ${source.height}`,
      `Tolerance: ${tolerance}`,
      `Softness: ${softness}`,
      `Removed pixels: ${result.removedPixels.toLocaleString()} (${removedPercent}%)`,
      `Corner palette: ${result.cornerHexes.join(", ")}`,
    ].join("\n");
  }, [result, softness, source, tolerance]);

  const removedPercent = result ? (result.removedPixels / result.totalPixels) * 100 : 0;
  const keptPercent = result ? (result.keptPixels / result.totalPixels) * 100 : 0;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-5">
          <div>
            <label htmlFor="background-remover-input" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Upload Image
            </label>
            <input
              id="background-remover-input"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
              onChange={handleFileChange}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-cyan-600"
            />
            <p className="mt-3 text-sm text-muted-foreground">
              Best results come from products, portraits, or logos placed against a fairly even background color. The tool samples the corner colors and removes pixels that match them.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Source</p>
              <p className="mt-2 text-xl font-black text-foreground">{source ? `${source.width} x ${source.height}` : "--"}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Status</p>
              <p className="mt-2 text-xl font-black text-foreground">{isProcessing ? "Processing" : result ? "Ready" : "Waiting"}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Tolerance</p>
              <p className="mt-2 text-xl font-black text-foreground">{tolerance}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Softness</p>
              <p className="mt-2 text-xl font-black text-foreground">{softness}</p>
            </div>
          </div>
        </div>
      </div>

      {source ? (
        <>
          <div className="rounded-2xl border border-cyan-500/15 bg-card p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Background Match Tolerance</label>
                <input type="range" min="8" max="120" value={tolerance} onChange={(event) => setTolerance(Number(event.target.value))} className="w-full accent-cyan-500" />
                <p className="mt-2 text-xs text-muted-foreground">Higher values remove more pixels that resemble the corner colors.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Edge Softness</label>
                <input type="range" min="0" max="60" value={softness} onChange={(event) => setSoftness(Number(event.target.value))} className="w-full accent-cyan-500" />
                <p className="mt-2 text-xs text-muted-foreground">Softness keeps cutout edges from looking too harsh when colors blend gradually.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Preview Background</label>
                <input type="color" value={previewColor} onChange={(event) => setPreviewColor(event.target.value)} className="h-11 w-full rounded-xl border border-border bg-background p-1" />
                <p className="mt-2 text-xs text-muted-foreground">This color is used for the flattened JPG preview and export button.</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setTolerance(38);
                  setSoftness(18);
                  setPreviewColor("#ffffff");
                }}
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:border-cyan-500/40"
              >
                Reset Controls
              </button>
              <button
                onClick={() => {
                  setTolerance(52);
                  setSoftness(24);
                  setPreviewColor("#f8fafc");
                }}
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:border-cyan-500/40"
              >
                Product Photo Preset
              </button>
              <button
                onClick={() => {
                  setTolerance(30);
                  setSoftness(12);
                  setPreviewColor("#ffffff");
                }}
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:border-cyan-500/40"
              >
                Portrait Preset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Original</p>
              <img src={source.src} alt="Original upload" className="w-full rounded-xl border border-border bg-muted/30 object-contain max-h-80" />
              <p className="mt-3 text-sm text-muted-foreground">{formatBytes(source.size)} source file</p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Transparent Cutout</p>
              {result ? (
                <>
                  <div className="rounded-xl border border-border bg-[linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(-45deg,#e2e8f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e2e8f0_75%),linear-gradient(-45deg,transparent_75%,#e2e8f0_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0px] p-3">
                    <img src={result.transparentUrl} alt="Transparent background removal preview" className="mx-auto max-h-72 w-full object-contain" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{formatBytes(result.transparentBlob.size)} transparent PNG</p>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-sm text-muted-foreground">Processing transparent preview...</div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Flat Preview</p>
              {result ? (
                <>
                  <div className="rounded-xl border border-border p-3" style={{ backgroundColor: previewColor }}>
                    <img src={result.flatUrl} alt="Flattened background removal preview" className="mx-auto max-h-72 w-full object-contain" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{formatBytes(result.flatBlob.size)} JPG on {previewColor.toUpperCase()}</p>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-sm text-muted-foreground">Processing flattened preview...</div>
              )}
            </div>
          </div>

          {result ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Removed</p>
                  <p className="text-2xl font-black text-foreground">{removedPercent.toFixed(1)}%</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Kept</p>
                  <p className="text-2xl font-black text-foreground">{keptPercent.toFixed(1)}%</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Pixels Checked</p>
                  <p className="text-2xl font-black text-foreground">{result.totalPixels.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Corner Palette</p>
                  <p className="text-sm font-black text-foreground">{result.cornerHexes[0]}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Export and Review</p>
                    <p className="text-sm text-muted-foreground">Download transparency-preserving PNG output or a flattened JPG using the preview color.</p>
                  </div>
                  <button onClick={() => copyValue("summary", summary)} className="text-xs font-bold text-cyan-700 dark:text-cyan-400">
                    {copied === "summary" ? "Copied" : "Copy Summary"}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-3">
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Detected Background Colors</p>
                    <div className="flex flex-wrap gap-2">
                      {result.cornerHexes.map((hex, index) => (
                        <button
                          key={`${hex}-${index}`}
                          onClick={() => copyValue(hex, hex)}
                          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-bold text-foreground hover:border-cyan-500/40"
                        >
                          <span className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: hex }} />
                          {copied === hex ? "Copied" : hex}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => downloadBlob(result.transparentBlob, `${fileBaseName(source.name)}-transparent.png`)}
                    className="rounded-xl bg-cyan-600 px-4 py-4 text-sm font-bold text-white hover:bg-cyan-700"
                  >
                    Download Transparent PNG
                  </button>
                  <button
                    onClick={() => downloadBlob(result.flatBlob, `${fileBaseName(source.name)}-flat.jpg`)}
                    className="rounded-xl border border-border bg-card px-4 py-4 text-sm font-bold text-foreground hover:border-cyan-500/40"
                  >
                    Download Flat JPG
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-5 text-sm text-muted-foreground">
          Upload an image to start background removal. Simple, evenly lit backgrounds will produce the cleanest cutouts.
        </div>
      )}

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </div>
  );
}

type CollageLayoutId = "grid-2x2" | "strip-3" | "stack-3" | "feature-3";
type CanvasPresetId = "square" | "landscape" | "portrait";

type CollageLayoutConfig = {
  id: CollageLayoutId;
  label: string;
  description: string;
  columns: number;
  rows: number;
  cells: Array<{ x: number; y: number; w: number; h: number }>;
};

type CollageRender = {
  blob: Blob;
  url: string;
  usedImages: number;
  slotCount: number;
  width: number;
  height: number;
};

const COLLAGE_LAYOUTS: CollageLayoutConfig[] = [
  {
    id: "grid-2x2",
    label: "2 x 2 Grid",
    description: "Balanced four-image layout for recaps, products, and before or after sets.",
    columns: 2,
    rows: 2,
    cells: [
      { x: 0, y: 0, w: 1, h: 1 },
      { x: 1, y: 0, w: 1, h: 1 },
      { x: 0, y: 1, w: 1, h: 1 },
      { x: 1, y: 1, w: 1, h: 1 },
    ],
  },
  {
    id: "strip-3",
    label: "3-Up Strip",
    description: "Wide comparison strip for product lineups and event highlights.",
    columns: 3,
    rows: 1,
    cells: [
      { x: 0, y: 0, w: 1, h: 1 },
      { x: 1, y: 0, w: 1, h: 1 },
      { x: 2, y: 0, w: 1, h: 1 },
    ],
  },
  {
    id: "stack-3",
    label: "Vertical Stack",
    description: "Story-friendly layout that stacks three frames for mobile-first sharing.",
    columns: 1,
    rows: 3,
    cells: [
      { x: 0, y: 0, w: 1, h: 1 },
      { x: 0, y: 1, w: 1, h: 1 },
      { x: 0, y: 2, w: 1, h: 1 },
    ],
  },
  {
    id: "feature-3",
    label: "Feature + Stack",
    description: "Hero image on the left with two supporting images on the right.",
    columns: 3,
    rows: 2,
    cells: [
      { x: 0, y: 0, w: 2, h: 2 },
      { x: 2, y: 0, w: 1, h: 1 },
      { x: 2, y: 1, w: 1, h: 1 },
    ],
  },
];

const COLLAGE_CANVAS_PRESETS: Record<CanvasPresetId, { width: number; height: number; label: string }> = {
  square: { width: 1200, height: 1200, label: "Square 1200 x 1200" },
  landscape: { width: 1600, height: 900, label: "Landscape 1600 x 900" },
  portrait: { width: 1080, height: 1350, label: "Portrait 1080 x 1350" },
};

function coverImageToRect(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number) {
  const scale = Math.max(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const offsetX = x + (width - drawWidth) / 2;
  const offsetY = y + (height - drawHeight) / 2;

  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}

async function buildCollageRender(
  sources: LoadedImage[],
  layoutId: CollageLayoutId,
  canvasPreset: CanvasPresetId,
  spacing: number,
  backgroundColor: string,
): Promise<CollageRender> {
  const layout = COLLAGE_LAYOUTS.find((item) => item.id === layoutId) ?? COLLAGE_LAYOUTS[0];
  const preset = COLLAGE_CANVAS_PRESETS[canvasPreset];
  const canvas = document.createElement("canvas");
  canvas.width = preset.width;
  canvas.height = preset.height;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not supported in this browser.");
  }

  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const padding = spacing;
  const unitWidth = (canvas.width - padding * 2 - spacing * (layout.columns - 1)) / layout.columns;
  const unitHeight = (canvas.height - padding * 2 - spacing * (layout.rows - 1)) / layout.rows;
  const usedImages = Math.min(layout.cells.length, sources.length);

  layout.cells.slice(0, usedImages).forEach((cell, index) => {
    const x = padding + cell.x * (unitWidth + spacing);
    const y = padding + cell.y * (unitHeight + spacing);
    const width = unitWidth * cell.w + spacing * (cell.w - 1);
    const height = unitHeight * cell.h + spacing * (cell.h - 1);

    context.save();
    context.beginPath();
    context.rect(x, y, width, height);
    context.clip();
    coverImageToRect(context, sources[index].image, x, y, width, height);
    context.restore();
  });

  const blob = await canvasToBlob(canvas, "image/png");

  return {
    blob,
    url: window.URL.createObjectURL(blob),
    usedImages,
    slotCount: layout.cells.length,
    width: canvas.width,
    height: canvas.height,
  };
}

function CollageMakerCalculator() {
  const [sources, setSources] = useState<LoadedImage[]>([]);
  const [layoutId, setLayoutId] = useState<CollageLayoutId>("grid-2x2");
  const [canvasPreset, setCanvasPreset] = useState<CanvasPresetId>("square");
  const [spacing, setSpacing] = useState(24);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [result, setResult] = useState<CollageRender | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    return () => {
      if (result) {
        window.URL.revokeObjectURL(result.url);
      }
    };
  }, [result]);

  const handleFilesChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(event.target.files ?? []).slice(0, 6);
    if (fileList.length === 0) return;

    try {
      const loaded = await Promise.all(fileList.map((file) => loadImageFile(file)));
      setSources(loaded);
      setError("");
    } catch (loadError: unknown) {
      setSources([]);
      setResult((current) => {
        if (current) {
          window.URL.revokeObjectURL(current.url);
        }
        return null;
      });
      setError(loadError instanceof Error ? loadError.message : "Failed to load images.");
    } finally {
      event.target.value = "";
    }
  };

  useEffect(() => {
    if (sources.length === 0) {
      setResult((current) => {
        if (current) {
          window.URL.revokeObjectURL(current.url);
        }
        return null;
      });
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        setIsRendering(true);
        const nextResult = await buildCollageRender(sources, layoutId, canvasPreset, spacing, backgroundColor);
        if (cancelled) {
          window.URL.revokeObjectURL(nextResult.url);
          return;
        }

        setResult((current) => {
          if (current) {
            window.URL.revokeObjectURL(current.url);
          }
          return nextResult;
        });
        setError("");
      } catch (renderError: unknown) {
        if (!cancelled) {
          setError(renderError instanceof Error ? renderError.message : "Failed to render collage.");
        }
      } finally {
        if (!cancelled) {
          setIsRendering(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [backgroundColor, canvasPreset, layoutId, spacing, sources]);

  const currentLayout = COLLAGE_LAYOUTS.find((item) => item.id === layoutId) ?? COLLAGE_LAYOUTS[0];
  const activePreset = COLLAGE_CANVAS_PRESETS[canvasPreset];
  const ignoredImages = Math.max(0, sources.length - currentLayout.cells.length);
  const summary = useMemo(() => {
    if (!result) return "";
    return [
      `Layout: ${currentLayout.label}`,
      `Canvas: ${result.width} x ${result.height}`,
      `Spacing: ${spacing}px`,
      `Background: ${backgroundColor.toUpperCase()}`,
      `Images used: ${result.usedImages}/${sources.length}`,
      `Ignored extras: ${ignoredImages}`,
    ].join("\n");
  }, [backgroundColor, currentLayout.label, ignoredImages, result, sources.length, spacing]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-5">
          <div>
            <label htmlFor="collage-maker-input" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Upload Images
            </label>
            <input
              id="collage-maker-input"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
              multiple
              onChange={handleFilesChange}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-cyan-600"
            />
            <p className="mt-3 text-sm text-muted-foreground">
              Upload up to 6 images. The active layout decides how many frames are shown, so extra images are ignored until you switch to a layout with more slots.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Images Loaded</p>
              <p className="mt-2 text-xl font-black text-foreground">{sources.length}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Layout Slots</p>
              <p className="mt-2 text-xl font-black text-foreground">{currentLayout.cells.length}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Canvas</p>
              <p className="mt-2 text-xl font-black text-foreground">{activePreset.width} x {activePreset.height}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Status</p>
              <p className="mt-2 text-xl font-black text-foreground">{isRendering ? "Rendering" : result ? "Ready" : "Waiting"}</p>
            </div>
          </div>
        </div>
      </div>

      {sources.length > 0 ? (
        <>
          <div className="rounded-2xl border border-cyan-500/15 bg-card p-5">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Layout Preset</label>
                <div className="grid grid-cols-1 gap-2">
                  {COLLAGE_LAYOUTS.map((layout) => (
                    <button
                      key={layout.id}
                      onClick={() => setLayoutId(layout.id)}
                      className={`rounded-xl border px-4 py-3 text-left transition-colors ${layoutId === layout.id ? "border-cyan-500 bg-cyan-500/10" : "border-border bg-card hover:border-cyan-500/40"}`}
                    >
                      <p className="text-sm font-bold text-foreground">{layout.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{layout.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Canvas Size</label>
                  <select value={canvasPreset} onChange={(event) => setCanvasPreset(event.target.value as CanvasPresetId)} className="tool-calc-input w-full">
                    {Object.entries(COLLAGE_CANVAS_PRESETS).map(([key, preset]) => (
                      <option key={key} value={key}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Spacing ({spacing}px)</label>
                  <input type="range" min="0" max="48" value={spacing} onChange={(event) => setSpacing(Number(event.target.value))} className="w-full accent-cyan-500" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Canvas / Border Color</label>
                  <input type="color" value={backgroundColor} onChange={(event) => setBackgroundColor(event.target.value)} className="h-11 w-full rounded-xl border border-border bg-background p-1" />
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setSources((current) => [...current].reverse())}
                  disabled={sources.length < 2}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:border-cyan-500/40 disabled:cursor-not-allowed disabled:text-muted-foreground"
                >
                  Reverse Image Order
                </button>
                <button
                  onClick={() => {
                    setSources([]);
                    setError("");
                  }}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:border-cyan-500/40"
                >
                  Clear Images
                </button>
                <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                  <p className="font-bold text-foreground">Active layout</p>
                  <p className="mt-1">{currentLayout.description}</p>
                  <p className="mt-2">Extra images ignored: <span className="font-semibold text-foreground">{ignoredImages}</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-500/15 bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Source Order</p>
                <p className="text-sm text-muted-foreground">Upload order controls placement. Reverse the list when the hero image should move to a different slot.</p>
              </div>
              <button onClick={() => copyValue("summary", summary)} disabled={!summary} className="text-xs font-bold text-cyan-700 disabled:text-muted-foreground dark:text-cyan-400">
                {copied === "summary" ? "Copied" : "Copy Summary"}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              {sources.map((source, index) => (
                <div key={`${source.name}-${index}`} className={`rounded-xl border p-3 ${index < currentLayout.cells.length ? "border-cyan-500/30 bg-cyan-500/5" : "border-border bg-muted/30"}`}>
                  <img src={source.src} alt={source.name} className="h-24 w-full rounded-lg border border-border bg-muted/30 object-cover" />
                  <p className="mt-2 truncate text-xs font-bold text-foreground">{index + 1}. {source.name}</p>
                  <p className="text-[11px] text-muted-foreground">{source.width} x {source.height}</p>
                </div>
              ))}
            </div>
          </div>

          {result ? (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-4">
                <div className="rounded-2xl border border-cyan-500/20 bg-card p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Collage Preview</p>
                  <div className="rounded-xl border border-border p-3" style={{ backgroundColor }}>
                    <img src={result.url} alt="Generated collage preview" className="mx-auto max-h-[34rem] w-full object-contain" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Used Images</p>
                      <p className="text-2xl font-black text-foreground">{result.usedImages}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Output Size</p>
                      <p className="text-2xl font-black text-foreground">{formatBytes(result.blob.size)}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Canvas</p>
                      <p className="text-lg font-black text-foreground">{result.width} x {result.height}</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Spacing</p>
                      <p className="text-2xl font-black text-foreground">{spacing}px</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Export Guidance</p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Square works well for feeds and marketplaces.</p>
                      <p>Landscape is better for banners, slides, and desktop promos.</p>
                      <p>Portrait fits story-style posts and mobile-first recap graphics.</p>
                    </div>
                    <button
                      onClick={() => downloadBlob(result.blob, `collage-${fileBaseName(sources[0]?.name || "image")}.png`)}
                      className="mt-4 w-full rounded-xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white hover:bg-cyan-700"
                    >
                      Download Collage PNG
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-5 text-sm text-muted-foreground">
          Upload multiple images to build a collage. Start with 3 to 4 images for the cleanest layouts.
        </div>
      )}

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </div>
  );
}

type FilterSettings = {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
};

const DEFAULT_FILTER_SETTINGS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
};

const FILTER_PRESETS: Array<{ label: string; settings: FilterSettings }> = [
  { label: "Natural", settings: { brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0 } },
  { label: "Punchy", settings: { brightness: 108, contrast: 118, saturation: 132, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0 } },
  { label: "Soft Glow", settings: { brightness: 110, contrast: 94, saturation: 108, blur: 1, grayscale: 0, sepia: 4, hueRotate: 0 } },
  { label: "Noir", settings: { brightness: 102, contrast: 122, saturation: 70, blur: 0, grayscale: 88, sepia: 0, hueRotate: 0 } },
  { label: "Warm Fade", settings: { brightness: 104, contrast: 96, saturation: 112, blur: 0, grayscale: 8, sepia: 24, hueRotate: -8 } },
];

type FilterRender = {
  blob: Blob;
  url: string;
  cssFilter: string;
};

function buildCssFilter(settings: FilterSettings) {
  return [
    `brightness(${settings.brightness}%)`,
    `contrast(${settings.contrast}%)`,
    `saturate(${settings.saturation}%)`,
    `blur(${settings.blur}px)`,
    `grayscale(${settings.grayscale}%)`,
    `sepia(${settings.sepia}%)`,
    `hue-rotate(${settings.hueRotate}deg)`,
  ].join(" ");
}

async function buildFilteredRender(source: LoadedImage, settings: FilterSettings, outputType: string): Promise<FilterRender> {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not supported in this browser.");
  }

  if (outputType === "image/jpeg") {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  const cssFilter = buildCssFilter(settings);
  context.filter = cssFilter;
  context.drawImage(source.image, 0, 0, canvas.width, canvas.height);
  context.filter = "none";

  const blob = await canvasToBlob(canvas, outputType, outputType === "image/png" ? undefined : 0.92);

  return {
    blob,
    url: window.URL.createObjectURL(blob),
    cssFilter,
  };
}

function FilterEditorCalculator() {
  const [source, setSource] = useState<LoadedImage | null>(null);
  const [settings, setSettings] = useState<FilterSettings>(DEFAULT_FILTER_SETTINGS);
  const [outputType, setOutputType] = useState("image/png");
  const [result, setResult] = useState<FilterRender | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    return () => {
      if (result) {
        window.URL.revokeObjectURL(result.url);
      }
    };
  }, [result]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const loaded = await loadImageFile(file);
      setSource(loaded);
      setError("");
    } catch (loadError: unknown) {
      setSource(null);
      setResult((current) => {
        if (current) {
          window.URL.revokeObjectURL(current.url);
        }
        return null;
      });
      setError(loadError instanceof Error ? loadError.message : "Failed to load image.");
    }
  };

  useEffect(() => {
    if (!source) {
      setResult((current) => {
        if (current) {
          window.URL.revokeObjectURL(current.url);
        }
        return null;
      });
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        setIsRendering(true);
        const nextResult = await buildFilteredRender(source, settings, outputType);
        if (cancelled) {
          window.URL.revokeObjectURL(nextResult.url);
          return;
        }

        setResult((current) => {
          if (current) {
            window.URL.revokeObjectURL(current.url);
          }
          return nextResult;
        });
        setError("");
      } catch (renderError: unknown) {
        if (!cancelled) {
          setError(renderError instanceof Error ? renderError.message : "Failed to apply filters.");
        }
      } finally {
        if (!cancelled) {
          setIsRendering(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [outputType, settings, source]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  };

  const summary = useMemo(() => {
    if (!source || !result) return "";
    return [
      `Source: ${source.name}`,
      `Dimensions: ${source.width} x ${source.height}`,
      `Output: ${outputType}`,
      `Filter: ${result.cssFilter}`,
      `Estimated file size: ${formatBytes(result.blob.size)}`,
    ].join("\n");
  }, [outputType, result, source]);

  const controls: Array<{ key: keyof FilterSettings; label: string; min: number; max: number; step: number; suffix: string }> = [
    { key: "brightness", label: "Brightness", min: 40, max: 180, step: 1, suffix: "%" },
    { key: "contrast", label: "Contrast", min: 40, max: 180, step: 1, suffix: "%" },
    { key: "saturation", label: "Saturation", min: 0, max: 220, step: 1, suffix: "%" },
    { key: "blur", label: "Blur", min: 0, max: 8, step: 0.1, suffix: "px" },
    { key: "grayscale", label: "Grayscale", min: 0, max: 100, step: 1, suffix: "%" },
    { key: "sepia", label: "Sepia", min: 0, max: 100, step: 1, suffix: "%" },
    { key: "hueRotate", label: "Hue Rotate", min: -180, max: 180, step: 1, suffix: "deg" },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-5">
          <div>
            <label htmlFor="filter-editor-input" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Upload Image
            </label>
            <input
              id="filter-editor-input"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
              onChange={handleFileChange}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-cyan-600"
            />
            <p className="mt-3 text-sm text-muted-foreground">
              Upload a photo or graphic, then adjust the filters to improve contrast, create a stronger mood, or stylize the final asset before export.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Source</p>
              <p className="mt-2 text-xl font-black text-foreground">{source ? `${source.width} x ${source.height}` : "--"}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Status</p>
              <p className="mt-2 text-xl font-black text-foreground">{isRendering ? "Rendering" : result ? "Ready" : "Waiting"}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Preset</p>
              <p className="mt-2 text-xl font-black text-foreground">{Object.entries(DEFAULT_FILTER_SETTINGS).every(([key, value]) => settings[key as keyof FilterSettings] === value) ? "Custom" : "Active"}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Output</p>
              <p className="mt-2 text-xl font-black text-foreground">{outputType.replace("image/", "").toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>

      {source ? (
        <>
          <div className="rounded-2xl border border-cyan-500/15 bg-card p-5">
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Preset Chips</p>
              <div className="flex flex-wrap gap-2">
                {FILTER_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setSettings(preset.settings)}
                    className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-cyan-500/40 hover:bg-muted"
                  >
                    {preset.label}
                  </button>
                ))}
                <button
                  onClick={() => setSettings(DEFAULT_FILTER_SETTINGS)}
                  className="rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:border-cyan-500/40 hover:bg-muted"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {controls.map((control) => (
                <div key={control.key}>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {control.label} ({settings[control.key]}{control.suffix})
                  </label>
                  <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={settings[control.key]}
                    onChange={(event) => setSettings((current) => ({ ...current, [control.key]: Number(event.target.value) }))}
                    className="w-full accent-cyan-500"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Export Format</label>
                <select value={outputType} onChange={(event) => setOutputType(event.target.value)} className="tool-calc-input w-full">
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">CSS Filter Output</p>
                <p className="mt-2 break-all font-mono text-xs text-foreground">{result?.cssFilter ?? buildCssFilter(settings)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Original</p>
              <img src={source.src} alt="Original upload preview" className="w-full rounded-xl border border-border bg-muted/30 object-contain max-h-[32rem]" />
              <p className="mt-3 text-sm text-muted-foreground">{formatBytes(source.size)} source file</p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-card p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Filtered Preview</p>
                <button onClick={() => copyValue("css", result?.cssFilter ?? buildCssFilter(settings))} className="text-xs font-bold text-cyan-700 dark:text-cyan-400">
                  {copied === "css" ? "Copied" : "Copy CSS"}
                </button>
              </div>
              {result ? (
                <>
                  <img src={result.url} alt="Filtered preview" className="w-full rounded-xl border border-border bg-muted/30 object-contain max-h-[32rem]" />
                  <p className="mt-3 text-sm text-muted-foreground">{formatBytes(result.blob.size)} exported {outputType.replace("image/", "").toUpperCase()}</p>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-sm text-muted-foreground">Rendering filtered preview...</div>
              )}
            </div>
          </div>

          {result ? (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto_auto] gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Copy-Ready Summary</p>
                <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100"><code>{summary}</code></pre>
              </div>
              <button
                onClick={() => copyValue("summary", summary)}
                className="rounded-xl border border-border bg-card px-4 py-4 text-sm font-bold text-foreground hover:border-cyan-500/40"
              >
                {copied === "summary" ? "Copied Summary" : "Copy Summary"}
              </button>
              <button
                onClick={() => downloadBlob(result.blob, `${fileBaseName(source.name)}-filtered.${outputType === "image/jpeg" ? "jpg" : outputType === "image/webp" ? "webp" : "png"}`)}
                className="rounded-xl bg-cyan-600 px-4 py-4 text-sm font-bold text-white hover:bg-cyan-700"
              >
                Download Filtered Image
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-5 text-sm text-muted-foreground">
          Upload an image to start adjusting filters. Brightness and contrast are the fastest way to improve low-contrast or underexposed assets.
        </div>
      )}

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </div>
  );
}

function greatestCommonDivisor(a: number, b: number): number {
  let left = Math.abs(Math.round(a));
  let right = Math.abs(Math.round(b));

  while (right !== 0) {
    const remainder = left % right;
    left = right;
    right = remainder;
  }

  return left || 1;
}

type JpgConversionResult = {
  blob: Blob;
  url: string;
};

function ImageToJpgCalculator() {
  const [source, setSource] = useState<LoadedImage | null>(null);
  const [quality, setQuality] = useState(88);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [result, setResult] = useState<JpgConversionResult | null>(null);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    if (!result) return undefined;

    return () => {
      window.URL.revokeObjectURL(result.url);
    };
  }, [result]);

  useEffect(() => {
    if (!source) {
      setResult(null);
      return undefined;
    }

    let cancelled = false;

    const render = async () => {
      setIsRendering(true);

      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas rendering is not available in this browser.");
        }

        canvas.width = source.width;
        canvas.height = source.height;
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(source.image, 0, 0, source.width, source.height);

        const blob = await canvasToBlob(canvas, "image/jpeg", quality / 100);

        if (cancelled) {
          return;
        }

        setResult({
          blob,
          url: window.URL.createObjectURL(blob),
        });
        setError("");
      } catch (renderError: unknown) {
        if (!cancelled) {
          setResult(null);
          setError(renderError instanceof Error ? renderError.message : "Failed to convert image to JPG.");
        }
      } finally {
        if (!cancelled) {
          setIsRendering(false);
        }
      }
    };

    void render();

    return () => {
      cancelled = true;
    };
  }, [backgroundColor, quality, source]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const loaded = await loadImageFile(file);
      setSource(loaded);
      setQuality(88);
      setBackgroundColor("#FFFFFF");
      setError("");
    } catch (loadError: unknown) {
      setSource(null);
      setResult(null);
      setError(loadError instanceof Error ? loadError.message : "Failed to load image.");
    }
  };

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  };

  const comparison = useMemo(() => {
    if (!source || !result) return null;

    const byteDelta = source.size - result.blob.size;
    const percentDelta = source.size > 0 ? (byteDelta / source.size) * 100 : 0;

    return {
      byteDelta,
      percentDelta,
      summary: [
        `Filename: ${source.name}`,
        `Original format: ${source.type || "unknown"}`,
        `Original size: ${formatBytes(source.size)}`,
        `Dimensions: ${source.width} x ${source.height}`,
        `JPG quality: ${quality}%`,
        `Background fill: ${backgroundColor}`,
        `Converted size: ${formatBytes(result.blob.size)}`,
        `Size change: ${byteDelta >= 0 ? "-" : "+"}${formatBytes(Math.abs(byteDelta))} (${percentDelta >= 0 ? "-" : "+"}${Math.abs(percentDelta).toFixed(1)}%)`,
      ].join("\n"),
    };
  }, [backgroundColor, quality, result, source]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
        <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-5">
          <div>
            <label htmlFor="image-to-jpg-input" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Upload Image
            </label>
            <input
              id="image-to-jpg-input"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/bmp,image/svg+xml"
              onChange={handleFileChange}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-cyan-600"
            />
            <p className="mt-3 text-sm text-muted-foreground">
              Convert PNG, WebP, GIF, BMP, SVG, or existing JPG images into a clean JPG export with quality control and a chosen flat background color for transparent areas.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Quality</p>
              <p className="mt-2 text-xl font-black text-foreground">{quality}%</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Export Type</p>
              <p className="mt-2 text-xl font-black text-foreground">JPG</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Dimensions</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{source ? `${source.width} x ${source.height}` : "--"}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Transparency</p>
              <p className="mt-2 text-sm font-semibold text-foreground">Flattened</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-5">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">JPG Quality</label>
            <input
              type="range"
              min="40"
              max="100"
              step="1"
              value={quality}
              onChange={(event) => setQuality(Number(event.target.value))}
              className="w-full accent-cyan-600"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Lower quality usually creates a smaller file. Higher quality keeps more detail but may reduce the file-size savings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Background Color</span>
              <input
                type="color"
                value={backgroundColor}
                onChange={(event) => setBackgroundColor(event.target.value)}
                className="h-12 w-28 rounded-xl border border-border bg-background p-2"
              />
            </label>
            <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              JPG does not support transparency. Any transparent or semi-transparent pixels are flattened onto this background color before export.
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["#FFFFFF", "#F4F1EA", "#000000"].map((color) => (
              <button
                key={color}
                onClick={() => setBackgroundColor(color)}
                className="rounded-xl border border-border bg-background px-3 py-3 text-sm font-semibold text-foreground hover:border-cyan-500/40"
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Conversion Snapshot</p>
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Source Size</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{source ? formatBytes(source.size) : "--"}</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">JPG Size</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{result ? formatBytes(result.blob.size) : isRendering ? "Rendering..." : "--"}</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Output Name</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{source ? `${fileBaseName(source.name)}.jpg` : "--"}</p>
            </div>
          </div>
        </div>
      </div>

      {source ? (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Original</p>
              <img src={source.src} alt="Original upload preview" className="w-full rounded-xl border border-border bg-muted/30 object-contain max-h-[32rem]" />
              <p className="mt-3 text-sm text-muted-foreground">
                {source.type || "Unknown format"} · {formatBytes(source.size)}
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-card p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">JPG Preview</p>
                {comparison ? (
                  <button onClick={() => copyValue("summary", comparison.summary)} className="text-xs font-bold text-cyan-700 dark:text-cyan-400">
                    {copied === "summary" ? "Copied" : "Copy Summary"}
                  </button>
                ) : null}
              </div>
              {result ? (
                <>
                  <img src={result.url} alt="JPG conversion preview" className="w-full rounded-xl border border-border bg-muted/30 object-contain max-h-[32rem]" />
                  <p className="mt-3 text-sm text-muted-foreground">{formatBytes(result.blob.size)} converted JPG</p>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-sm text-muted-foreground">
                  {isRendering ? "Rendering JPG preview..." : "Upload an image to generate the JPG conversion preview."}
                </div>
              )}
            </div>
          </div>

          {comparison && result ? (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto_auto] gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Copy-Ready Summary</p>
                <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100"><code>{comparison.summary}</code></pre>
              </div>
              <button
                onClick={() => copyValue("summary-secondary", comparison.summary)}
                className="rounded-xl border border-border bg-card px-4 py-4 text-sm font-bold text-foreground hover:border-cyan-500/40"
              >
                {copied === "summary-secondary" ? "Copied Summary" : "Copy Summary"}
              </button>
              <button
                onClick={() => downloadBlob(result.blob, `${fileBaseName(source.name)}.jpg`)}
                className="rounded-xl bg-cyan-600 px-4 py-4 text-sm font-bold text-white hover:bg-cyan-700"
              >
                Download JPG
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-5 text-sm text-muted-foreground">
          Upload an image to convert it to JPG for email attachments, CMS uploads, listings, and other destinations that prefer photo-friendly formats.
        </div>
      )}

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </div>
  );
}

type RotateFlipResult = {
  blob: Blob;
  url: string;
  width: number;
  height: number;
};

function RotateFlipCalculator() {
  const [source, setSource] = useState<LoadedImage | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [outputType, setOutputType] = useState("image/png");
  const [quality, setQuality] = useState(92);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [result, setResult] = useState<RotateFlipResult | null>(null);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const [isRendering, setIsRendering] = useState(false);

  const normalizedRotation = ((rotation % 360) + 360) % 360;

  useEffect(() => {
    if (!result) return undefined;

    return () => {
      window.URL.revokeObjectURL(result.url);
    };
  }, [result]);

  useEffect(() => {
    if (!source) {
      setResult(null);
      return undefined;
    }

    let cancelled = false;

    const render = async () => {
      setIsRendering(true);

      try {
        const radians = (normalizedRotation * Math.PI) / 180;
        const cosine = Math.cos(radians);
        const sine = Math.sin(radians);
        const width = Math.max(1, Math.ceil(Math.abs(source.width * cosine) + Math.abs(source.height * sine)));
        const height = Math.max(1, Math.ceil(Math.abs(source.width * sine) + Math.abs(source.height * cosine)));
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas rendering is not available in this browser.");
        }

        canvas.width = width;
        canvas.height = height;

        if (outputType === "image/jpeg") {
          context.fillStyle = backgroundColor;
          context.fillRect(0, 0, width, height);
        } else {
          context.clearRect(0, 0, width, height);
        }

        context.translate(width / 2, height / 2);
        context.rotate(radians);
        context.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
        context.drawImage(source.image, -source.width / 2, -source.height / 2, source.width, source.height);

        const blob = await canvasToBlob(canvas, outputType, outputType === "image/png" ? undefined : quality / 100);

        if (cancelled) {
          return;
        }

        setResult({
          blob,
          url: window.URL.createObjectURL(blob),
          width,
          height,
        });
        setError("");
      } catch (renderError: unknown) {
        if (!cancelled) {
          setResult(null);
          setError(renderError instanceof Error ? renderError.message : "Failed to render transformed image.");
        }
      } finally {
        if (!cancelled) {
          setIsRendering(false);
        }
      }
    };

    void render();

    return () => {
      cancelled = true;
    };
  }, [backgroundColor, flipHorizontal, flipVertical, normalizedRotation, outputType, quality, source]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const loaded = await loadImageFile(file);
      setSource(loaded);
      setRotation(0);
      setFlipHorizontal(false);
      setFlipVertical(false);
      setOutputType("image/png");
      setQuality(92);
      setBackgroundColor("#FFFFFF");
      setError("");
    } catch (loadError: unknown) {
      setSource(null);
      setResult(null);
      setError(loadError instanceof Error ? loadError.message : "Failed to load image.");
    }
  };

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  };

  const outputSummary = source && result
    ? [
        `Filename: ${source.name}`,
        `Original dimensions: ${source.width} x ${source.height}`,
        `Export dimensions: ${result.width} x ${result.height}`,
        `Rotation: ${normalizedRotation} deg`,
        `Flip horizontal: ${flipHorizontal ? "Yes" : "No"}`,
        `Flip vertical: ${flipVertical ? "Yes" : "No"}`,
        `Export format: ${outputType.replace("image/", "").toUpperCase()}`,
        `Export size: ${formatBytes(result.blob.size)}`,
        outputType === "image/jpeg" ? `Background fill: ${backgroundColor}` : "Background fill: Transparent when the source and export format support it",
      ].join("\n")
    : "";

  const rotateBy = (delta: number) => {
    setRotation((current) => current + delta);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-5">
          <div>
            <label htmlFor="rotate-flip-input" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Upload Image
            </label>
            <input
              id="rotate-flip-input"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/bmp,image/svg+xml"
              onChange={handleFileChange}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-cyan-600"
            />
            <p className="mt-3 text-sm text-muted-foreground">
              Upload any common image format, rotate it to an exact angle, mirror it horizontally or vertically, then export a corrected PNG, JPG, or WebP file.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Rotation</p>
              <p className="mt-2 text-xl font-black text-foreground">{normalizedRotation}&deg;</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Mirror Mode</p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {flipHorizontal || flipVertical ? `${flipHorizontal ? "Horizontal" : ""}${flipHorizontal && flipVertical ? " + " : ""}${flipVertical ? "Vertical" : ""}` : "Off"}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Source</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{source ? `${source.width} x ${source.height}` : "--"}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Export</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{result ? `${result.width} x ${result.height}` : "--"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-5">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Rotate Controls</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button onClick={() => rotateBy(-90)} className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:border-cyan-500/40">
                Rotate Left
              </button>
              <button onClick={() => rotateBy(90)} className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:border-cyan-500/40">
                Rotate Right
              </button>
              <button
                onClick={() => setFlipHorizontal((current) => !current)}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold ${flipHorizontal ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300" : "border-border bg-background text-foreground hover:border-cyan-500/40"}`}
              >
                Flip Horizontal
              </button>
              <button
                onClick={() => setFlipVertical((current) => !current)}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold ${flipVertical ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300" : "border-border bg-background text-foreground hover:border-cyan-500/40"}`}
              >
                Flip Vertical
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Exact Rotation Angle</span>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={rotation}
                onChange={(event) => setRotation(Number(event.target.value))}
                className="w-full accent-cyan-600"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Angle Input</span>
              <input
                type="number"
                min="-180"
                max="180"
                step="1"
                value={rotation}
                onChange={(event) => setRotation(Number(event.target.value))}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Export Format</span>
              <select
                value={outputType}
                onChange={(event) => setOutputType(event.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground"
              >
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/webp">WebP</option>
              </select>
            </label>

            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Quality</span>
              <input
                type="range"
                min="50"
                max="100"
                step="1"
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
                className="w-full accent-cyan-600"
              />
              <p className="mt-2 text-sm text-muted-foreground">{quality}% for JPG and WebP exports</p>
            </label>

            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">JPG Background</span>
              <input
                type="color"
                value={backgroundColor}
                onChange={(event) => setBackgroundColor(event.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-background p-2"
              />
            </label>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setRotation(0);
                  setFlipHorizontal(false);
                  setFlipVertical(false);
                  setOutputType("image/png");
                  setQuality(92);
                  setBackgroundColor("#FFFFFF");
                }}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:border-cyan-500/40"
              >
                Reset Controls
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Rotating by exact angles may increase the canvas bounds and create transparent corner space. Export as PNG or WebP to keep transparency, or use JPG with a chosen background fill.
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Transform Snapshot</p>
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">File</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{source?.name ?? "No image uploaded"}</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Source Size</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{source ? formatBytes(source.size) : "--"}</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Output Size</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{result ? formatBytes(result.blob.size) : isRendering ? "Rendering..." : "--"}</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Export Type</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{outputType.replace("image/", "").toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>

      {source ? (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Original</p>
              <img src={source.src} alt="Original upload preview" className="w-full rounded-xl border border-border bg-muted/30 object-contain max-h-[32rem]" />
              <p className="mt-3 text-sm text-muted-foreground">
                {source.width} x {source.height} · {formatBytes(source.size)}
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-card p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Transformed Preview</p>
                {result ? (
                  <button onClick={() => copyValue("summary", outputSummary)} className="text-xs font-bold text-cyan-700 dark:text-cyan-400">
                    {copied === "summary" ? "Copied" : "Copy Summary"}
                  </button>
                ) : null}
              </div>
              {result ? (
                <>
                  <img src={result.url} alt="Rotated and flipped preview" className="w-full rounded-xl border border-border bg-muted/30 object-contain max-h-[32rem]" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    {result.width} x {result.height} · {formatBytes(result.blob.size)}
                  </p>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-sm text-muted-foreground">
                  {isRendering ? "Rendering transformed preview..." : "Upload an image to generate the transformed preview."}
                </div>
              )}
            </div>
          </div>

          {result ? (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto_auto] gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Copy-Ready Summary</p>
                <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100"><code>{outputSummary}</code></pre>
              </div>
              <button
                onClick={() => copyValue("summary-secondary", outputSummary)}
                className="rounded-xl border border-border bg-card px-4 py-4 text-sm font-bold text-foreground hover:border-cyan-500/40"
              >
                {copied === "summary-secondary" ? "Copied Summary" : "Copy Summary"}
              </button>
              <button
                onClick={() => downloadBlob(result.blob, `${fileBaseName(source.name)}-rotated.${outputType === "image/jpeg" ? "jpg" : outputType === "image/webp" ? "webp" : "png"}`)}
                className="rounded-xl bg-cyan-600 px-4 py-4 text-sm font-bold text-white hover:bg-cyan-700"
              >
                Download Transformed Image
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-5 text-sm text-muted-foreground">
          Upload an image to correct sideways screenshots, mirror selfie shots, or reorient scanned documents before the next export step.
        </div>
      )}

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </div>
  );
}

function PixelCounterCalculator() {
  const [source, setSource] = useState<LoadedImage | null>(null);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const loaded = await loadImageFile(file);
      setSource(loaded);
      setError("");
    } catch (loadError: unknown) {
      setSource(null);
      setError(loadError instanceof Error ? loadError.message : "Failed to load image.");
    }
  };

  const details = useMemo(() => {
    if (!source) return null;

    const totalPixels = source.width * source.height;
    const megapixels = totalPixels / 1_000_000;
    const gcd = greatestCommonDivisor(source.width, source.height);
    const aspectRatio = `${source.width / gcd}:${source.height / gcd}`;
    const orientation = source.width === source.height ? "Square" : source.width > source.height ? "Landscape" : "Portrait";
    const print300 = `${(source.width / 300).toFixed(1)} x ${(source.height / 300).toFixed(1)} in`;
    const print150 = `${(source.width / 150).toFixed(1)} x ${(source.height / 150).toFixed(1)} in`;

    return {
      totalPixels,
      megapixels,
      aspectRatio,
      orientation,
      print300,
      print150,
      summary: [
        `Filename: ${source.name}`,
        `Dimensions: ${source.width} x ${source.height}`,
        `Total pixels: ${totalPixels.toLocaleString()}`,
        `Megapixels: ${megapixels.toFixed(2)}`,
        `Aspect ratio: ${aspectRatio}`,
        `Orientation: ${orientation}`,
        `Print at 300 DPI: ${print300}`,
        `Print at 150 DPI: ${print150}`,
        `File size: ${formatBytes(source.size)}`,
      ].join("\n"),
    };
  }, [source]);

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-5">
          <div>
            <label htmlFor="pixel-counter-input" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Upload Image
            </label>
            <input
              id="pixel-counter-input"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/bmp,image/svg+xml"
              onChange={handleFileChange}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-cyan-600"
            />
            <p className="mt-3 text-sm text-muted-foreground">
              Upload any image to inspect exact pixel dimensions, megapixel count, aspect ratio, and rough print-size expectations before you publish or resize it.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Width</p>
              <p className="mt-2 text-xl font-black text-foreground">{source ? source.width : "--"}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Height</p>
              <p className="mt-2 text-xl font-black text-foreground">{source ? source.height : "--"}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Megapixels</p>
              <p className="mt-2 text-xl font-black text-foreground">{details ? details.megapixels.toFixed(2) : "--"}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Orientation</p>
              <p className="mt-2 text-xl font-black text-foreground">{details ? details.orientation : "Waiting"}</p>
            </div>
          </div>
        </div>
      </div>

      {source && details ? (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4">
            <div className="rounded-2xl border border-cyan-500/20 bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Image Preview</p>
              <img src={source.src} alt={source.name} className="w-full rounded-xl border border-border bg-muted/30 object-contain max-h-[32rem]" />
              <p className="mt-3 text-sm text-muted-foreground">{formatBytes(source.size)} source file</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Pixels</p>
                  <p className="text-2xl font-black text-foreground">{details.totalPixels.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Aspect Ratio</p>
                  <p className="text-2xl font-black text-foreground">{details.aspectRatio}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Print @ 300 DPI</p>
                  <p className="text-lg font-black text-foreground">{details.print300}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Print @ 150 DPI</p>
                  <p className="text-lg font-black text-foreground">{details.print150}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Metadata Summary</p>
                    <p className="text-sm text-muted-foreground">Copy the dimension and resolution summary for QA notes, handoff docs, or upload validation.</p>
                  </div>
                  <button onClick={() => copyValue("summary", details.summary)} className="text-xs font-bold text-cyan-700 dark:text-cyan-400">
                    {copied === "summary" ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100"><code>{details.summary}</code></pre>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-5 text-sm text-muted-foreground">
          Upload an image to inspect dimensions, total pixels, aspect ratio, and print-size estimates.
        </div>
      )}

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </div>
  );
}

function getVariant(slug: string): Variant {
  if (slug === "image-rotate-flip") {
    return {
      hero: "Rotate images by exact angles or flip them horizontally and vertically for cleaner layouts, corrected phone photos, and faster asset prep.",
      label: "Rotate and Flip Workflow",
      workflow: ["Upload the image.", "Apply rotate or mirror controls.", "Preview the corrected orientation and export the result."],
      intro: "Rotation and flipping are frequent image fixes because orientation issues are common and usually do not justify a full design-editing session.",
      concepts: [
        { label: "Rotation", formula: "Canvas Rotates Around Center", detail: "Rotation changes orientation while preserving the visible content inside a new frame." },
        { label: "Flip", formula: "Horizontal/Vertical Mirror", detail: "A flip mirrors the image across an axis for layout or composition changes." },
      ],
      examples: [
        { title: "Phone Photos", value: "Correct Angle", detail: "Fix sideways or upside-down images fast." },
        { title: "Mockups", value: "Mirror Layout", detail: "Flip assets to fit a composition without remaking them." },
        { title: "Catalogs", value: "Consistent Framing", detail: "Standardize orientation before resizing or watermarking." },
      ],
      facts: [
        { label: "Best For", value: "Orientation Fixes", detail: "Correct angle and direction before export." },
        { label: "Core Task", value: "Rotate + Flip", detail: "A focused transform page for quick image correction." },
        { label: "Pairs With", value: "Crop and Resize", detail: "Orientation usually comes before trimming or scaling." },
      ],
      icon: <RotateCw className="w-3.5 h-3.5" />,
    };
  }

  if (slug === "image-color-picker") {
    return {
      hero: "Pick exact colors from an uploaded image and capture HEX, RGB, and HSL values for design systems, UI audits, and creative references.",
      label: "Color Sampling Workflow",
      workflow: ["Upload the image.", "Sample the exact point you need.", "Copy the color values into design or code work."],
      intro: "Image-based color picking is useful when the reference color already exists inside a screenshot, brand asset, or inspiration image.",
      concepts: [
        { label: "Pixel Sample", formula: "Selected Pixel -> RGB", detail: "The browser reads the channels of the pixel you select." },
        { label: "Format Output", formula: "RGB -> HEX/HSL", detail: "The sampled color can be exposed in the code format your workflow prefers." },
      ],
      examples: [
        { title: "Brand Audit", value: "Exact Codes", detail: "Capture colors from existing creative assets." },
        { title: "UI Review", value: "Match Screens", detail: "Pull interface colors from screenshots during QA or redesigns." },
        { title: "Palette Work", value: "Creative Input", detail: "Build a palette from inspiration images instead of guessing by eye." },
      ],
      facts: [
        { label: "Best For", value: "Sampling Colors", detail: "Extract values from real imagery rather than generic pickers." },
        { label: "Core Output", value: "HEX / RGB / HSL", detail: "Get the format needed for design systems or CSS." },
        { label: "Ideal Users", value: "Design + Dev", detail: "Helpful for both designers and front-end teams." },
      ],
      icon: <Palette className="w-3.5 h-3.5" />,
    };
  }

  if (slug === "image-watermark") {
    return {
      hero: "Add text or image watermarks to protect ownership, reinforce branding, or label draft visuals before they are shared or published.",
      label: "Watermark Workflow",
      workflow: ["Upload the source image.", "Add text or logo overlay settings.", "Preview placement and export the branded file."],
      intro: "Watermarking is mostly a placement and visibility problem. The mark needs to be present enough to do its job without overwhelming the image.",
      concepts: [
        { label: "Placement", formula: "Anchor + Offset = Final Position", detail: "Most watermark workflows position the mark relative to a corner, edge, or center." },
        { label: "Visibility", formula: "Opacity + Scale = Readability", detail: "A watermark should stay visible while preserving the content below it." },
      ],
      examples: [
        { title: "Portfolios", value: "Protect Work", detail: "Mark public previews before posting them online." },
        { title: "Drafts", value: "Status Labels", detail: "Stamp review, proof, or internal-use states on visuals." },
        { title: "Brand Assets", value: "Consistent Identity", detail: "Apply the same logo treatment across many images." },
      ],
      facts: [
        { label: "Best For", value: "Brand + Protection", detail: "Useful for public, internal, and draft visuals." },
        { label: "Core Controls", value: "Position + Opacity", detail: "Most watermark quality depends on placement and visibility." },
        { label: "Typical Use", value: "Drafts and Portfolios", detail: "A practical step before sharing images widely." },
      ],
      icon: <Shield className="w-3.5 h-3.5" />,
    };
  }

  if (slug === "image-filter-editor") {
    return {
      hero: "Adjust brightness, contrast, blur, grayscale, saturation, and other filters for quick browser-side visual styling before export.",
      label: "Filter Editing Workflow",
      workflow: ["Upload the image.", "Adjust one or more visual sliders.", "Review the styled result and export the final file."],
      intro: "A filter editor is ideal when the goal is quick visual treatment rather than deep retouching, especially for social, content, and mockup work.",
      concepts: [
        { label: "Filter Stack", formula: "Filter A + Filter B + Filter C", detail: "Multiple visual adjustments can be layered to create a stronger final look." },
        { label: "Intensity", formula: "Higher Value = Stronger Effect", detail: "Fine-tuning usually matters more than pushing every setting to an extreme." },
      ],
      examples: [
        { title: "Social Visuals", value: "Fast Styling", detail: "Apply quick moods and visual polish to campaign assets." },
        { title: "Mockups", value: "Preview Looks", detail: "Test alternate presentations without a full editor." },
        { title: "Content Sets", value: "Unified Tone", detail: "Bring a set of images closer to one visual style." },
      ],
      facts: [
        { label: "Best For", value: "Quick Styling", detail: "Ideal for fast mood, contrast, and clarity changes." },
        { label: "Core Controls", value: "Brightness to Blur", detail: "Common filters cover the most requested visual adjustments." },
        { label: "Workflow Type", value: "Preview First", detail: "Useful when teams want to test a look before export." },
      ],
      icon: <Wand2 className="w-3.5 h-3.5" />,
    };
  }

  if (slug === "image-background-remover") {
    return {
      hero: "Remove image backgrounds for product shots, profile pictures, graphics, and layered compositions without opening a heavier editing workflow.",
      label: "Background Removal Workflow",
      workflow: ["Upload the image.", "Detect and isolate the subject.", "Preview the transparent result and export it."],
      intro: "Background removal is one of the highest-value image edits because it unlocks cleaner product listings, thumbnails, and layered designs.",
      concepts: [
        { label: "Foreground Detection", formula: "Subject != Background", detail: "The workflow depends on separating the main object from the surrounding pixels." },
        { label: "Transparent Output", formula: "Removed Background -> Alpha Channel", detail: "The final result is usually most useful in a format that preserves transparency." },
      ],
      examples: [
        { title: "Product Listings", value: "Cleaner Catalogs", detail: "Remove busy backgrounds before uploading items to stores." },
        { title: "Portrait Assets", value: "Sharper Cutouts", detail: "Prepare people shots for slides, banners, and profile layouts." },
        { title: "Design Layers", value: "Reusable Subjects", detail: "Create isolated objects for composites and promos." },
      ],
      facts: [
        { label: "Best For", value: "Subject Isolation", detail: "Great for products, portraits, and design assets." },
        { label: "Ideal Output", value: "Transparent Image", detail: "Transparent export makes the result easier to reuse." },
        { label: "Common Need", value: "Ecommerce + Design", detail: "A frequent requirement for catalogs, thumbnails, and campaign work." },
      ],
      icon: <ScanSearch className="w-3.5 h-3.5" />,
    };
  }

  if (slug === "image-collage-maker") {
    return {
      hero: "Combine multiple images into a single collage layout for social posts, mood boards, recaps, and promotional graphics.",
      label: "Collage Workflow",
      workflow: ["Upload multiple images.", "Choose the layout and spacing.", "Preview the composition and export one final image."],
      intro: "Collage creation is mainly a layout problem. The structure, spacing, and scaling choices determine whether the final composition feels clean or cluttered.",
      concepts: [
        { label: "Grid Layout", formula: "Canvas -> Rows x Columns", detail: "A collage usually divides a frame into predictable cells." },
        { label: "Spacing", formula: "Cell Size - Gaps = Visible Area", detail: "Padding and margins affect both readability and density." },
      ],
      examples: [
        { title: "Campaign Recap", value: "Multiple Visuals", detail: "Show several moments or products inside one asset." },
        { title: "Mood Board", value: "Creative Direction", detail: "Combine references into one planning image." },
        { title: "Social Post", value: "One Export", detail: "Turn many photos into one publication-ready frame." },
      ],
      facts: [
        { label: "Best For", value: "Multi-Image Layouts", detail: "Useful for recaps, references, and promos." },
        { label: "Core Decision", value: "Layout + Spacing", detail: "Composition quality depends on structure as much as the images." },
        { label: "Typical Use", value: "Social and Mood Boards", detail: "Common for campaign, internal, and creative planning work." },
      ],
      icon: <Layers className="w-3.5 h-3.5" />,
    };
  }

  if (slug === "qr-code-generator") {
    return {
      hero: "Generate QR codes for URLs, text, Wi-Fi credentials, and campaign destinations, then export them as image assets for print or digital use.",
      label: "QR Asset Workflow",
      workflow: ["Enter the payload.", "Adjust size and output styling.", "Preview the code and export a scan-ready image."],
      intro: "QR code generation fits naturally in the image category because the output is a visual asset that needs to be exported cleanly for real-world placement.",
      concepts: [
        { label: "Encoded Payload", formula: "Text/URL/Data -> QR Matrix", detail: "The input content is converted into a scannable visual grid." },
        { label: "Scan Reliability", formula: "Contrast + Size + Quiet Zone", detail: "Readable QR codes usually need strong contrast and enough whitespace around them." },
      ],
      examples: [
        { title: "Print Material", value: "Poster Ready", detail: "Add scan points to menus, flyers, and signage." },
        { title: "Campaign Links", value: "Trackable Access", detail: "Move users from offline surfaces into landing pages and forms." },
        { title: "Wi-Fi Sharing", value: "Instant Join", detail: "Create a scan-based connection asset for guests and teams." },
      ],
      facts: [
        { label: "Best For", value: "Scan-Ready Assets", detail: "Useful when the output needs to be placed as an image." },
        { label: "Core Output", value: "Visual QR Code", detail: "Built for print, signage, slides, and web graphics." },
        { label: "Important", value: "Readable Contrast", detail: "The final asset must remain easy to scan." },
      ],
      icon: <QrCode className="w-3.5 h-3.5" />,
    };
  }

  if (slug === "meme-generator") {
    return {
      hero: "Turn images into shareable memes by adding bold caption text and arranging the layout for social-friendly export.",
      label: "Meme Workflow",
      workflow: ["Choose the base image.", "Add and style the caption text.", "Preview the meme and export the final image."],
      intro: "A meme generator is really a caption-and-layout tool. The image matters, but the text styling and placement determine whether the result works on mobile and in feeds.",
      concepts: [
        { label: "Caption Placement", formula: "Top/Bottom Text + Contrast", detail: "Captions need strong readability against the underlying image." },
        { label: "Shareable Output", formula: "Image + Text = Final Meme Asset", detail: "The finished file should stay clear in chat, feed, and mobile contexts." },
      ],
      examples: [
        { title: "Social Posts", value: "Fast Exports", detail: "Build reaction images quickly without opening a full editor." },
        { title: "Internal Teams", value: "Light Humor", detail: "Create quick graphics for chats, docs, and presentations." },
        { title: "Campaign Tests", value: "Variant Friendly", detail: "Try different caption directions against one base image." },
      ],
      facts: [
        { label: "Best For", value: "Captioned Images", detail: "Useful when text placement is the main creative task." },
        { label: "Core Output", value: "Shareable Graphic", detail: "Optimized around simple, feed-friendly exports." },
        { label: "Typical Use", value: "Social and Team Content", detail: "Common for quick creative communication." },
      ],
      icon: <Sparkles className="w-3.5 h-3.5" />,
    };
  }

  if (slug === "favicon-generator") {
    return {
      hero: "Generate favicon outputs from a source image so websites and apps have the small icon files they need for tabs, bookmarks, and shortcuts.",
      label: "Favicon Workflow",
      workflow: ["Upload a clean source image.", "Generate the required icon sizes.", "Download the favicon outputs for site use."],
      intro: "Favicons are tiny, but they are part of a site's identity. A focused favicon page helps turn one source image into the smaller outputs that websites usually need.",
      concepts: [
        { label: "Downscaling", formula: "Large Source -> Small Icon Sizes", detail: "The image needs to stay legible after being reduced heavily." },
        { label: "Multi-Size Export", formula: "One Source -> Many Variants", detail: "Favicon work usually means producing more than one size from the same asset." },
      ],
      examples: [
        { title: "Site Tabs", value: "Brand Identity", detail: "Add a clear icon to browser tabs and bookmarks." },
        { title: "App Shortcuts", value: "Compact Assets", detail: "Prepare small launcher icons from one source file." },
        { title: "Launch Prep", value: "Quick Packaging", detail: "Create favicon outputs without opening a design suite." },
      ],
      facts: [
        { label: "Best For", value: "Site Icons", detail: "Generate the tiny brand assets used around a site." },
        { label: "Core Need", value: "Multiple Sizes", detail: "Favicons usually require more than one target size." },
        { label: "Important", value: "Small-Scale Clarity", detail: "The source image should remain readable when reduced." },
      ],
      icon: <Link2 className="w-3.5 h-3.5" />,
    };
  }

  if (slug === "image-pixel-counter") {
    return {
      hero: "Count total pixels and inspect image dimensions so you can verify resolution, prepare assets, and catch mismatches before upload or export.",
      label: "Pixel Inspection Workflow",
      workflow: ["Upload the image.", "Read the width and height values.", "Use the pixel count to validate the file for the next step."],
      intro: "Pixel counting is mostly a validation task. It helps users confirm whether an image is large enough, too large, or simply mismatched for a target platform.",
      concepts: [
        { label: "Pixel Count", formula: "Total Pixels = Width x Height", detail: "Pixel count comes directly from the two core image dimensions." },
        { label: "Resolution Context", formula: "Dimensions -> Suitability", detail: "The same image may be perfect for one use case and weak for another." },
      ],
      examples: [
        { title: "Upload Checks", value: "Validate Size", detail: "Confirm that a file meets marketplace or CMS requirements." },
        { title: "Design QA", value: "Catch Mismatches", detail: "Spot resolution issues before final export or handoff." },
        { title: "Asset Review", value: "Quick Inspection", detail: "Check image dimensions without opening a full editor." },
      ],
      facts: [
        { label: "Best For", value: "Resolution Checks", detail: "Useful when suitability depends on exact dimensions." },
        { label: "Core Metric", value: "Width x Height", detail: "The page is built around straightforward pixel inspection." },
        { label: "Typical Use", value: "QA and Validation", detail: "Helpful before uploads, exports, and handoff." },
      ],
      icon: <ScanSearch className="w-3.5 h-3.5" />,
    };
  }

  if (slug === "image-to-png" || slug === "image-to-jpg" || slug === "png-to-webp" || slug === "svg-to-png") {
    return {
      hero: slug === "svg-to-png" ? "Convert SVG graphics into PNG when you need raster output for platforms that do not accept vector files." : "Use a focused single-output conversion page when you know the next workflow requires one exact image format.",
      label: "Format-Specific Conversion",
      workflow: ["Upload the source image.", "Confirm the target format and any export settings.", "Preview the converted result and download it."],
      intro: "Single-purpose converters are useful because they remove ambiguity. Instead of choosing from many outputs, the page is centered on one destination format and its common use cases.",
      concepts: [
        { label: "Source To Target", formula: "Input Format -> Target Format", detail: "The visible image may stay similar while the stored file type changes." },
        { label: "Export Traits", formula: "Target Format -> Different File Behavior", detail: "Each format changes compatibility, transparency, compression, or size characteristics." },
      ],
      examples: [
        { title: "Workflow Match", value: "Right Format", detail: "Convert purely because the next platform expects one exact output type." },
        { title: "Cleaner Delivery", value: "Better Fit", detail: "Move an image into the file format that suits the next publishing step." },
        { title: "Asset Prep", value: "Less Friction", detail: "Skip a general editor when only a format change is needed." },
      ],
      facts: [
        { label: "Best For", value: "Format-Specific Jobs", detail: "Useful when the destination format is already known." },
        { label: "Core Output", value: "Single Target Format", detail: "The page is optimized around one format goal." },
        { label: "Typical Need", value: "Workflow Compatibility", detail: "Teams often convert images simply to match platform rules." },
      ],
      icon: <ImageIcon className="w-3.5 h-3.5" />,
    };
  }

  return DEFAULT_VARIANT;
}

export default function ImageCategoryToolPage() {
  const params = useParams<{ slug: string }>();
  const tool = getToolBySlug(params.slug);

  if (!tool || tool.category !== "Image Tools") {
    return <ToolPlaceholder />;
  }

  const variant = getVariant(tool.slug);
  const pageTitle = tool.slug === "favicon-generator" ? "Online Favicon Generator" : tool.title;
  const relatedTools = getRelatedTools(tool.slug, tool.category, 4).map((item) => ({
    title: item.title,
    href: `/image/${item.slug}`,
    benefit: item.description,
  }));
  const isImageColorPicker = tool.slug === "image-color-picker";
  const isFaviconGenerator = tool.slug === "favicon-generator";
  const isBackgroundRemover = tool.slug === "image-background-remover";
  const isCollageMaker = tool.slug === "image-collage-maker";
  const isFilterEditor = tool.slug === "image-filter-editor";
  const isPixelCounter = tool.slug === "image-pixel-counter";
  const isRotateFlip = tool.slug === "image-rotate-flip";
  const isImageToPng = tool.slug === "image-to-png";
  const isImageToJpg = tool.slug === "image-to-jpg";
  const isPngToWebp = tool.slug === "png-to-webp";
  const isSvgToPng = tool.slug === "svg-to-png";
  const isImageWatermark = tool.slug === "image-watermark";
  const isMemeGenerator = tool.slug === "meme-generator";
  const isQrCodeGenerator = tool.slug === "qr-code-generator";
  const calculatorContent = isImageColorPicker ? (
    <ImageColorPickerCalculator />
  ) : isFaviconGenerator ? (
    <FaviconGeneratorCalculator />
  ) : isBackgroundRemover ? (
    <BackgroundRemoverCalculator />
  ) : isCollageMaker ? (
    <CollageMakerCalculator />
  ) : isFilterEditor ? (
    <FilterEditorCalculator />
  ) : isPixelCounter ? (
    <PixelCounterCalculator />
  ) : isRotateFlip ? (
    <RotateFlipCalculator />
  ) : isImageToPng ? (
    <ImageToPngCalculator />
  ) : isImageToJpg ? (
    <ImageToJpgCalculator />
  ) : isPngToWebp ? (
    <PngToWebpCalculator />
  ) : isSvgToPng ? (
    <SvgToPngCalculator />
  ) : isImageWatermark ? (
    <ImageWatermarkCalculator />
  ) : isMemeGenerator ? (
    <MemeGeneratorCalculator />
  ) : isQrCodeGenerator ? (
    <QrCodeGeneratorCalculator />
  ) : (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">{variant.label}</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {variant.workflow.map((step, index) => (
            <div key={step} className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">Step {index + 1}</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground">{step}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-cyan-500/15 bg-card p-5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          This page has been upgraded from the generic placeholder into the same structured image-tool layout used by the live image utilities, so the content architecture is now consistent across the image category.
        </p>
      </div>
    </div>
  );
  const calculatorDescription = isImageColorPicker
    ? "Upload an image, click any point, and copy exact HEX, RGB, and HSL values from the sampled pixel."
    : isFaviconGenerator
      ? "Upload a source image, generate the common PNG favicon sizes, preview them, and copy the head tags for deployment."
      : isBackgroundRemover
        ? "Upload an image, tune background detection tolerance, then download a transparent PNG or flattened JPG preview."
      : isCollageMaker
        ? "Upload multiple images, choose a layout preset, set spacing and canvas size, then export a ready-to-share collage PNG."
      : isFilterEditor
        ? "Upload an image, tune brightness, contrast, saturation, blur, and color effects, then export the filtered result."
      : isPixelCounter
        ? "Upload an image to inspect exact dimensions, total pixels, megapixels, aspect ratio, and print-size estimates."
      : isRotateFlip
        ? "Upload an image, rotate it left, right, or to any exact angle, apply mirror flips, then export the corrected image format you need."
      : isImageToPng
        ? "Upload an image, keep the original transparency behavior or flatten it onto a solid background, then export a PNG instantly."
      : isImageToJpg
        ? "Upload an image, choose JPG quality, flatten transparent areas onto a background color, then export a photo-friendly JPG."
      : isPngToWebp
        ? "Upload a PNG, tune WebP quality, compare output size, and decide whether to preserve transparency before export."
      : isSvgToPng
        ? "Upload an SVG or paste SVG markup, set the raster output size, and export a downloadable PNG preview."
      : isImageWatermark
        ? "Upload a base image, add a text or logo watermark, adjust opacity and placement, then export a branded PNG."
      : isMemeGenerator
        ? "Upload a base image, add top and bottom captions, tune text size and stroke, and export a share-ready meme graphic."
      : isQrCodeGenerator
        ? "Choose a content type, tune colors and recovery level, then download a live-generated PNG or SVG QR code."
    : "Every image-category page now follows the same full-width, content-led structure used by the site's main calculator pages.";

  const faqs = isImageToPng
    ? [
        { q: "Why convert an image to PNG?", a: "PNG is useful when you need crisp edges, screenshot clarity, or transparency support. It is often the safer export for logos, UI assets, diagrams, and layered design work." },
        { q: "Does PNG always make the file smaller?", a: "No. PNG is lossless, so it often keeps more detail but can create larger files than JPG or WebP, especially for photographic images." },
        { q: "What does the solid-background option do?", a: "It lets you flatten the image onto a chosen color before export. This is helpful when you want a consistent background instead of preserving any transparent pixels." },
        { q: "Will the dimensions change during conversion?", a: "No. The converter keeps the original pixel width and height, then changes the file encoding to PNG." },
        { q: "Is this good for logos and screenshots?", a: "Yes. PNG usually handles logos, interface captures, and text-heavy graphics better than JPG because it avoids the compression artifacts common in lossy photo formats." },
        { q: "Can I convert JPG or WebP into PNG here?", a: "Yes. Upload the raster image, preview the result, and download a browser-generated PNG file." },
        { q: "Does this upload my image anywhere?", a: "No. The conversion runs locally in the browser and the PNG export is generated in your session." },
      ]
    : isImageWatermark
      ? [
          { q: "Can I use text or a logo watermark?", a: "Yes. This page supports both a text watermark mode and a logo overlay mode so you can use a simple proof stamp or a branded mark." },
          { q: "Which watermark position is safest?", a: "Bottom-right or top-right is a common balance between visibility and low distraction. Center placement is harder to crop out but it covers more of the image." },
          { q: "Why does opacity matter so much?", a: "If opacity is too low, the watermark disappears after screenshots or reposts. If it is too high, it distracts from the underlying image. The best setting depends on how protective you need the mark to be." },
          { q: "Should I use a transparent logo file?", a: "Usually yes. Transparent PNG or SVG logos give cleaner overlays because only the logo shape appears over the image instead of a solid box." },
          { q: "What file does the tool export?", a: "The current workflow exports a PNG so the watermark preview and output stay consistent regardless of the original source format." },
          { q: "Can this do batch watermarking?", a: "No. This version is focused on one-image-at-a-time browser editing so the page stays fast and clear." },
          { q: "Does this upload my image anywhere?", a: "No. The source image and watermark render locally in the browser." },
        ]
      : isMemeGenerator
        ? [
            { q: "Does this support classic top-text and bottom-text memes?", a: "Yes. The generator is built around the common top-and-bottom caption layout used in classic meme formats and reaction images." },
            { q: "Why use all caps?", a: "All caps is the common meme convention because it reads better at small sizes and gives the caption more punch against busy images." },
            { q: "What does the stroke slider change?", a: "The stroke controls the black outline around the white caption text. Strong outlines improve readability when the image background is bright or complex." },
            { q: "Can I use sentence case instead?", a: "Yes. Toggle the caption style if you want a cleaner or less exaggerated meme format." },
            { q: "Does the text wrap automatically?", a: "Yes. Longer lines are wrapped so the caption stays inside the image width instead of running off the edges." },
            { q: "What file does the meme export as?", a: "The page exports a PNG so the text stays sharp and the output is easy to share." },
            { q: "Does this upload my meme image anywhere?", a: "No. Caption rendering and export happen locally in the browser." },
          ]
        : isPngToWebp
          ? [
              { q: "Why convert PNG to WebP?", a: "WebP often delivers a smaller file for websites, galleries, and content feeds while keeping very similar visual quality." },
              { q: "Can WebP keep transparency?", a: "Yes. If you keep transparency enabled, the exported WebP preserves transparent pixels instead of flattening the image onto a color." },
              { q: "What does the quality slider change?", a: "It controls WebP compression. Lower values usually reduce the file size more, while higher values preserve more detail." },
              { q: "Why might the WebP sometimes be larger?", a: "Some simple PNG graphics are already highly efficient. In those cases, especially with high quality settings, WebP may not always shrink the file." },
              { q: "When should I flatten transparency?", a: "Flatten transparency when the image will sit on a fixed background anyway and you want to test whether removing alpha helps file size." },
              { q: "Will the dimensions change?", a: "No. The exported WebP keeps the same pixel dimensions as the original PNG." },
              { q: "Does this upload my PNG anywhere?", a: "No. The conversion runs fully inside the browser session." },
            ]
          : isSvgToPng
            ? [
                { q: "Why convert SVG to PNG?", a: "PNG is required by many upload forms, presentation tools, marketplaces, and apps that do not accept SVG files directly." },
                { q: "What does the scale control do?", a: "It multiplies the raster output dimensions before export. Higher scale gives you a larger PNG from the same vector source." },
                { q: "Will the PNG stay infinitely scalable like SVG?", a: "No. Once exported, the PNG becomes a fixed raster image. That is why choosing the right width and height before download matters." },
                { q: "Can I paste raw SVG markup instead of uploading a file?", a: "Yes. This page supports both file upload and direct SVG markup editing." },
                { q: "What happens if the SVG is invalid?", a: "The render block shows an error when the browser cannot interpret the SVG markup cleanly." },
                { q: "Does transparency survive the conversion?", a: "Yes. Transparent areas in the SVG remain transparent in the exported PNG." },
                { q: "Does this upload my SVG anywhere?", a: "No. The browser renders the SVG locally and generates the PNG in-session." },
              ]
            : isBackgroundRemover
    ? [
        { q: "How does this background remover work?", a: "It samples the corner colors from your uploaded image and removes pixels that closely match that background palette. It works best when the background is fairly even." },
        { q: "What images work best?", a: "Product shots, portraits, and logos against white, gray, pastel, or otherwise uniform backgrounds usually give the cleanest cutouts." },
        { q: "What does the tolerance slider change?", a: "Tolerance controls how aggressively the tool treats colors as background matches. Higher tolerance removes more similar pixels." },
        { q: "What does the softness slider change?", a: "Softness feathers the transition between removed and kept pixels so edges look less harsh when the subject blends into the background slightly." },
        { q: "Why is part of my subject disappearing?", a: "The subject may share colors with the detected background. Lower the tolerance or softness and try a more conservative setting." },
        { q: "Which export should I choose?", a: "Use the transparent PNG when you want to place the cutout on other designs. Use the flat JPG when you want a quick result on a solid background color." },
        { q: "Does this upload my image anywhere?", a: "No. The processing runs in the browser, and the exported files are generated locally in your session." },
      ]
    : isCollageMaker
      ? [
          { q: "How many images can this collage maker use?", a: "You can upload up to 6 images, but the active layout controls how many appear in the final collage. Extra images stay loaded and can be used if you switch layouts." },
          { q: "Why are some uploaded images missing from the collage?", a: "Layouts have a fixed number of slots. If you upload more images than the layout supports, the extra images are ignored until you switch to a larger layout or reduce the upload set." },
          { q: "What does the spacing slider change?", a: "Spacing controls the gutter between each frame and the outer canvas padding. The selected background color shows through as the border between images." },
          { q: "Which canvas size should I choose?", a: "Square works well for feeds and ecommerce grids, landscape works for slides and banners, and portrait works for story-style social posts." },
          { q: "Does this crop my images?", a: "Yes. The collage uses a cover-style fit so every slot fills cleanly. Wide or tall images may be cropped slightly to avoid empty space." },
        { q: "Can I change the image order?", a: "Yes. The upload order determines placement, and the reverse-order control lets you quickly flip the sequence when the hero image should move." },
        { q: "Does this process images locally?", a: "Yes. The collage is rendered in the browser and exported locally as a PNG." },
      ]
    : isFilterEditor
      ? [
          { q: "What filters can I control here?", a: "The editor supports brightness, contrast, saturation, blur, grayscale, sepia, and hue rotation so you can handle both correction and stylized looks." },
          { q: "Does the preview update automatically?", a: "Yes. The filtered image is regenerated in the browser whenever you change a slider, preset, or export format." },
          { q: "Why does the output look slightly cropped or different than CSS filters in the browser?", a: "The tool renders the effect into a canvas export. The overall look should stay close, but small differences can happen between browser rendering paths and exported files." },
          { q: "Which preset should I start with?", a: "Start with Punchy for product shots, Soft Glow for softer lifestyle images, and Noir when you want a high-contrast monochrome treatment." },
          { q: "Can I reuse the effect in CSS?", a: "Yes. The page shows the generated CSS filter string so you can copy the same effect into front-end work or prototypes." },
          { q: "What format should I export?", a: "PNG is safest for crisp graphics, JPG is usually best for photos and lighter files, and WebP is useful when you want smaller web-ready assets." },
          { q: "Does this send my image anywhere?", a: "No. The image is processed and exported locally in the browser." },
        ]
    : isPixelCounter
      ? [
          { q: "What is the total pixel count?", a: "It is the image width multiplied by the image height. This is a quick way to understand how much actual image data the file contains." },
          { q: "What does megapixels mean here?", a: "Megapixels are the total pixels divided by one million. It is a simpler high-level measure for camera images and large creative assets." },
          { q: "Why is aspect ratio useful?", a: "Aspect ratio tells you the image shape, such as 16:9, 4:3, or 1:1, which helps when matching social, ad, print, or layout requirements." },
          { q: "Are the print sizes exact?", a: "They are estimates based on 300 DPI and 150 DPI. Real print suitability also depends on the content, viewing distance, and print method." },
          { q: "Can I use this to validate upload requirements?", a: "Yes. The tool is useful for checking whether an image meets marketplace, CMS, ad, or design handoff dimension requirements." },
          { q: "Does this change or compress my image?", a: "No. It only reads the file and reports its image metadata in the browser." },
          { q: "Does this upload my image anywhere?", a: "No. The file is inspected locally in the browser session." },
        ]
    : isRotateFlip
      ? [
          { q: "What is the difference between rotate and flip?", a: "Rotate changes the angle of the full image, while flip mirrors the image across a horizontal or vertical axis. They solve different orientation problems." },
          { q: "Will rotating an image make the canvas larger?", a: "Often yes. Any angle other than a clean 90-degree turn can expand the bounding box so the full image still fits without clipping." },
          { q: "Why do I see transparent corners after rotation?", a: "The new canvas must contain the full rotated rectangle. PNG and WebP can keep those corner areas transparent, while JPG fills them with the chosen background color." },
          { q: "Is this rotation lossless?", a: "The transform itself happens in the browser canvas. PNG exports usually preserve quality best, while JPG and WebP re-encode the output and may slightly change file size or quality." },
          { q: "When should I flip horizontally?", a: "Horizontal flip is useful for mirrored selfies, layout mockups, and reversing left-right direction without changing the subject itself." },
          { q: "Can I combine rotation and both flips?", a: "Yes. You can rotate to an exact angle, then toggle horizontal and vertical mirroring before exporting the final image." },
          { q: "Does this upload my image anywhere?", a: "No. Rotation and mirroring happen locally in the browser, and the downloaded export is generated in your session." },
        ]
    : isImageToJpg
      ? [
          { q: "Why convert an image to JPG?", a: "JPG is widely accepted by email clients, listing systems, CMS uploads, and marketplaces that prefer smaller photo-friendly files over transparency support." },
          { q: "What does the quality slider change?", a: "The quality setting controls JPG compression. Lower values usually reduce file size more aggressively, while higher values keep more visual detail." },
          { q: "Why do transparent images need a background color?", a: "JPG does not support transparency. Transparent or semi-transparent areas must be flattened onto a solid color before export." },
          { q: "Will the image dimensions change?", a: "No. This converter keeps the original pixel dimensions and only changes the file encoding to JPG." },
          { q: "Why is the JPG sometimes larger than the original?", a: "If the source file is already highly optimized or contains flat graphic areas, converting to JPG may not always create a smaller file. JPG works best for photographic content." },
          { q: "What background color should I choose?", a: "White is the safest default for product shots, documents, and screenshots, but you should match the expected page or listing background when transparency would otherwise be visible." },
          { q: "Does this upload my image anywhere?", a: "No. The conversion runs locally in the browser, and the JPG file is generated in your session." },
        ]
    : [
        { q: `Is ${tool.title} free to use?`, a: `Yes. ${tool.title} follows the same free-access pattern as the rest of the site's image tools.` },
        { q: `Will ${tool.title} work on mobile and desktop?`, a: "Yes. The page structure is responsive so the workflow and support content remain usable across screen sizes." },
        { q: "Does this image category focus on browser-side workflows?", a: "Yes. The image category is structured around privacy-friendly, browser-first processing expectations wherever the tool logic supports it." },
        { q: `Why was this page redesigned?`, a: "The image category was standardized onto the same richer content structure used by the site's flagship calculator pages so every image tool has stronger guidance and consistency." },
      ];

  const contentSections = isImageToPng
    ? [
        {
          title: "Why this workflow matters",
          paragraphs: [
            "PNG conversion is often a compatibility and quality-preservation step when the next destination expects sharp raster output or transparent edges.",
            "A focused browser-side converter is useful when the job is simple format preparation rather than a full editing session.",
          ],
        },
        {
          title: "How PNG output changes the file",
          paragraphs: [
            "PNG uses lossless compression, which keeps edge detail and text clarity stronger than typical photo-first formats.",
            "That same lossless behavior can make files larger, so PNG is best when clarity and transparency matter more than absolute size.",
          ],
        },
        {
          title: "How to export the right version",
          paragraphs: [
            "Keep transparency behavior when the image needs to sit on different backgrounds later in design or development workflows.",
            "Flatten onto a solid color when the final destination already has a fixed background and you want a cleaner, predictable export.",
          ],
        },
      ]
    : isImageWatermark
      ? [
          {
            title: "Why this workflow matters",
            paragraphs: [
              "Watermarking is a practical publishing step for proofs, portfolios, and draft visuals where brand presence or ownership needs to stay visible after sharing.",
              "A browser-side watermark tool is useful when the job is placement and visibility rather than detailed image retouching.",
            ],
          },
          {
            title: "How the controls affect the result",
            paragraphs: [
              "Opacity, margin, and position determine whether the watermark feels professional or distracting. Small changes have a large effect on readability and protection.",
              "Logo overlays usually feel more branded, while text overlays are faster for proofs, review stamps, and internal labels.",
            ],
          },
          {
            title: "How to export the right version",
            paragraphs: [
              "Use lighter opacity and edge placement for portfolio previews where the image still needs to be appreciated cleanly.",
              "Use stronger opacity or center placement when the real goal is deterring reposts or signaling draft status clearly.",
            ],
          },
        ]
      : isMemeGenerator
        ? [
            {
              title: "Why this workflow matters",
              paragraphs: [
                "A meme generator is really a text-layout tool for social images. The punchline depends as much on placement and readability as it does on the underlying image.",
                "A lightweight browser workflow is useful when you need to test caption directions quickly without opening a full design suite.",
              ],
            },
            {
              title: "How the controls affect the result",
              paragraphs: [
                "Larger caption size increases impact, but it also reduces the room available for wrapped lines. Stroke width matters because it protects readability against bright or busy backgrounds.",
                "All caps usually reads better at small thumbnail sizes, while sentence case can feel cleaner for niche or brand-led meme formats.",
              ],
            },
            {
              title: "How to export the right version",
              paragraphs: [
                "Keep captions short enough that the top line and bottom line still read clearly on mobile. Long paragraph-style captions rarely survive social preview sizes well.",
                "PNG export is the safer choice for meme text because the outlines and letter edges stay sharper than they would under stronger photo compression.",
              ],
            },
          ]
        : isPngToWebp
          ? [
              {
                title: "Why this workflow matters",
                paragraphs: [
                  "PNG to WebP conversion is a common web-performance step because many visual assets do not need the heavier file size that PNG often carries.",
                  "A focused browser-side converter is useful when the goal is simply reducing delivery weight before publishing to a website, gallery, or CMS.",
                ],
              },
              {
                title: "How WebP output changes the file",
                paragraphs: [
                  "WebP can combine smaller size with strong visual quality, but the result depends on the image content and the chosen quality setting.",
                  "Transparency can still survive in WebP, so you do not always need to give up alpha support just to compress the image.",
                ],
              },
              {
                title: "How to export the right version",
                paragraphs: [
                  "Start with transparency preserved when the PNG is used over multiple backgrounds, then test flattening only if size savings matter more than alpha support.",
                  "Use higher quality for UI graphics or product images with sharp edges, and lower quality for softer visuals where lighter delivery is the priority.",
                ],
              },
            ]
          : isSvgToPng
            ? [
                {
                  title: "Why this workflow matters",
                  paragraphs: [
                    "SVG is excellent for flexible vector artwork, but many publishing systems still need a fixed PNG output for uploads, slides, or marketplace assets.",
                    "A browser-side SVG renderer is useful when you need to test raster sizes quickly without leaving the page or opening a heavier design workflow.",
                  ],
                },
                {
                  title: "How vector-to-raster export changes the file",
                  paragraphs: [
                    "The SVG source stays mathematically scalable, but the PNG output becomes a fixed bitmap with locked dimensions.",
                    "That means export size is not a cosmetic setting. It directly determines how crisp the image will look in the next tool, platform, or upload flow.",
                  ],
                },
                {
                  title: "How to export the right version",
                  paragraphs: [
                    "Use a larger raster size when the PNG will be reused across decks, social posts, or listings that may need multiple crops.",
                    "Keep transparency in mind when designing the vector source, because transparent SVG backgrounds carry cleanly into the PNG export.",
                  ],
                },
              ]
            : isBackgroundRemover
    ? [
        {
          title: "Why this workflow matters",
          paragraphs: [
            "Background removal is often the first edit needed before a product photo, portrait, or logo can move into a listing, banner, or design system.",
            "A focused browser workflow is useful when the job is simple subject isolation rather than a full retouching session.",
          ],
        },
        {
          title: "When browser-side removal is a good fit",
          paragraphs: [
            "This page works best for clean source images with consistent background colors near the corners because that is where the detection logic samples the scene.",
            "For busy scenes or subjects that share the same color as the background, you may need to lower the tolerance or move to a more advanced editor.",
          ],
        },
        {
          title: "How to use the output well",
          paragraphs: [
            "Transparent PNG output is the safer export when the cutout will be layered into another design or uploaded to an ecommerce system.",
            "The flat JPG option is useful when you want a quick finished asset on a known solid background color for slides, documents, or internal previews.",
          ],
        },
      ]
    : isCollageMaker
      ? [
          {
            title: "Why this workflow matters",
            paragraphs: [
              "Collages are useful when several images need to tell one story together instead of being uploaded as separate files.",
              "A focused browser-side collage tool is faster than opening a full editor when the task is layout, spacing, and export rather than detailed retouching.",
            ],
          },
          {
            title: "How layout changes the outcome",
            paragraphs: [
              "The same image set can feel balanced, dramatic, or mobile-first depending on whether you use a grid, strip, stack, or feature layout.",
              "That is why this page keeps the layout preset above the fold and shows the source order clearly, since placement matters as much as the images themselves.",
            ],
          },
          {
            title: "How to export the right version",
            paragraphs: [
            "Use square canvases for catalog recaps and feed posts, landscape for presentation headers or web banners, and portrait for vertical campaign assets.",
            "Spacing and border color are part of the finished design, so treat them as brand and readability choices rather than just technical settings.",
          ],
        },
      ]
    : isFilterEditor
      ? [
          {
            title: "Why this workflow matters",
            paragraphs: [
              "A filter editor is useful when the image itself is already correct and only needs visual polish, mood adjustment, or a quick style pass before publishing.",
              "This browser-side workflow handles common tuning jobs without forcing users into a full editing suite for simple corrections.",
            ],
          },
          {
            title: "How the controls affect the result",
            paragraphs: [
              "Brightness, contrast, and saturation are the main correction controls for making dull or flat assets feel more usable.",
              "Blur, grayscale, sepia, and hue rotation are more stylized controls, and they work best in moderation unless the visual effect is intentionally dramatic.",
            ],
          },
          {
            title: "How to export the right version",
            paragraphs: [
              "PNG is safer for UI graphics, screenshots, and crisp edges, while JPG usually works better for photographic content where file size matters more than transparency.",
              "The CSS filter string can also be copied when you want the same visual treatment in a front-end prototype without baking the effect into a file.",
            ],
          },
        ]
    : isPixelCounter
      ? [
          {
            title: "Why this workflow matters",
            paragraphs: [
              "Pixel inspection is one of the fastest QA steps in image handling because it confirms whether a file is even suitable before anyone spends time editing or uploading it.",
              "A lightweight browser-side checker is useful for creative teams, marketers, and developers who just need exact numbers without opening a heavier editor.",
            ],
          },
          {
            title: "How the numbers should be interpreted",
            paragraphs: [
              "Width and height describe the true pixel dimensions, while megapixels give a simpler summary for comparing larger image files quickly.",
              "Aspect ratio matters because an image can have enough pixels overall but still be the wrong shape for the destination slot.",
            ],
          },
          {
            title: "How to use the output well",
            paragraphs: [
              "Use the dimension and ratio readout to decide whether the file should be resized, cropped, or rejected before it enters the next step of the workflow.",
              "The print-size estimates are useful as a rough check, but they should be treated as planning guidance rather than a final print-production guarantee.",
            ],
          },
        ]
    : isRotateFlip
      ? [
          {
            title: "Why this workflow matters",
            paragraphs: [
              "Orientation fixes are one of the most common image edits because sideways screenshots, phone photos, and scan outputs slow down publishing immediately.",
              "A focused browser-side rotate and flip tool is faster than opening a full editor when the job is just correcting direction, mirroring composition, or preparing the next export.",
            ],
          },
          {
            title: "How rotation and flipping change the result",
            paragraphs: [
              "Rotation changes the full image angle and may expand the canvas bounds so the original content is not clipped. That matters when you export assets for slides, uploads, or print handoff.",
              "Flipping does not change the angle at all. Instead, it mirrors the image on one axis, which is useful for selfie correction, layout balance, and product-image direction changes.",
            ],
          },
          {
            title: "How to export the right version",
            paragraphs: [
              "Use PNG or WebP when you want to keep transparent corner space after an angled rotation, especially for graphics and layered design work.",
              "Use JPG when the destination expects a photo-friendly format or smaller file size, but choose a background color first because JPG does not keep transparency.",
            ],
          },
        ]
    : isImageToJpg
      ? [
          {
            title: "Why this workflow matters",
            paragraphs: [
              "JPG conversion is a common final-mile task because many upload forms, email flows, and ecommerce systems still expect or strongly prefer JPG files.",
              "A focused browser-side converter is faster than opening a full editor when the real goal is just compatibility, smaller delivery, and a clean flattened export.",
            ],
          },
          {
            title: "How JPG output changes the file",
            paragraphs: [
              "JPG uses lossy compression, so the file behavior changes even when the visible image looks nearly identical. That is why quality control matters for text-heavy graphics and screenshots.",
              "Transparency is removed during conversion, which means logos, UI captures, and PNG graphics need a chosen background color before export.",
            ],
          },
          {
            title: "How to export the right version",
            paragraphs: [
              "Use higher quality settings for product photos, marketing images, or anything with visible gradients where compression artifacts would be distracting.",
              "Use lower quality settings when the priority is lighter attachments or faster uploads, but inspect the preview first because aggressive compression can soften sharp edges and small text.",
            ],
          },
        ]
    : [
        {
          title: "Why this page matters",
          paragraphs: [
            "Not every image task needs a full design suite. Focused browser tools are useful when the job is narrow, repeatable, and time-sensitive.",
            "That is why the image category now uses a richer, calculator-style page structure instead of the generic placeholder shell.",
          ],
        },
        {
          title: "Where it fits in a broader workflow",
          paragraphs: [
            "Image tasks often happen in sequence, such as crop -> resize -> compress or convert -> embed -> publish.",
            "The page structure is designed to explain the current step clearly and point users toward the next related image tool when they are done.",
          ],
        },
        {
          title: "Why the structure was standardized",
          paragraphs: [
            "A consistent layout improves both usability and SEO because users can find the tool, workflow, examples, FAQs, and related paths in the same place on every image page.",
            "That consistency also makes it easier to layer interactive controls into future image tools without rewriting the page architecture again.",
          ],
        },
      ];

  return (
    <ImageToolPageShell
      title={pageTitle}
      seoTitle={`${pageTitle} - Free Online Image Tool`}
      seoDescription={tool.metaDescription}
      canonical={`https://usonlinetools.com/image/${tool.slug}`}
      heroDescription={variant.hero}
      heroIcon={variant.icon}
      calculatorLabel={variant.label}
      calculatorDescription={calculatorDescription}
      calculator={calculatorContent}
      howToTitle={`How to Use ${pageTitle}`}
      howToIntro={variant.intro}
      howSteps={variant.workflow.map((step, index) => ({
        title: `Step ${index + 1}`,
        description: step,
      }))}
      formulaTitle={`${pageTitle} Key Concepts`}
      formulaIntro="Image workflows are usually driven by browser-side transformations and export choices rather than heavy calculations. These concepts explain the page logic."
      formulaCards={variant.concepts}
      examplesTitle={`${pageTitle} Examples`}
      examplesIntro="These examples show where this image tool fits into common content, design, and publishing workflows."
      examples={variant.examples}
      contentTitle={`Why Use ${pageTitle}?`}
      contentIntro={variant.intro}
      contentSections={contentSections}
      faqs={faqs}
      relatedTools={relatedTools}
      quickFacts={variant.facts}
    />
  );
}
