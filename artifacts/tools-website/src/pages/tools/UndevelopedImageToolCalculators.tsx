import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  Copy,
  Download,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Stamp,
  Upload,
} from "lucide-react";
import {
  canvasToBlob,
  downloadBlob,
  fileBaseName,
  formatBytes,
  loadImageFile,
  type LoadedImage,
} from "./imageToolUtils";

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";

type RenderResult = {
  blob: Blob;
  url: string;
};

function useObjectUrl() {
  const [result, setResult] = useState<RenderResult | null>(null);

  useEffect(() => {
    return () => {
      if (result?.url) {
        window.URL.revokeObjectURL(result.url);
      }
    };
  }, [result]);

  const replace = (next: RenderResult | null) => {
    setResult((current) => {
      if (current?.url) {
        window.URL.revokeObjectURL(current.url);
      }
      return next;
    });
  };

  return [result, replace] as const;
}

function positionRect(width: number, height: number, boxWidth: number, boxHeight: number, margin: number, position: Position) {
  if (position === "top-left") return { x: margin, y: margin };
  if (position === "top-right") return { x: width - boxWidth - margin, y: margin };
  if (position === "bottom-left") return { x: margin, y: height - boxHeight - margin };
  if (position === "center") return { x: (width - boxWidth) / 2, y: (height - boxHeight) / 2 };
  return { x: width - boxWidth - margin, y: height - boxHeight - margin };
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const rawLines = text.split("\n");
  const finalLines: string[] = [];

  rawLines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      finalLines.push("");
      return;
    }

    const words = trimmed.split(/\s+/);
    let current = "";

    words.forEach((word) => {
      const candidate = current ? `${current} ${word}` : word;
      if (ctx.measureText(candidate).width <= maxWidth || !current) {
        current = candidate;
      } else {
        finalLines.push(current);
        current = word;
      }
    });

    if (current) {
      finalLines.push(current);
    }
  });

  return finalLines.length ? finalLines : [text];
}

function drawOutlinedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  y: number,
  width: number,
  fontSize: number,
) {
  const lines = wrapText(ctx, text, width * 0.9);
  const lineHeight = fontSize * 1.08;

  lines.forEach((line, index) => {
    const lineY = y + index * lineHeight;
    ctx.strokeText(line, width / 2, lineY);
    ctx.fillText(line, width / 2, lineY);
  });

  return lines.length * lineHeight;
}

async function loadFile(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0] ?? null;
  if (!file) return null;
  return loadImageFile(file);
}

export function ImageToPngCalculator() {
  const [source, setSource] = useState<LoadedImage | null>(null);
  const [flattenBackground, setFlattenBackground] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [result, setResult] = useObjectUrl();

  useEffect(() => {
    if (!source) {
      setResult(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = source.width;
      canvas.height = source.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      if (flattenBackground) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(source.image, 0, 0, canvas.width, canvas.height);
      const blob = await canvasToBlob(canvas, "image/png");
      const url = window.URL.createObjectURL(blob);

      if (!cancelled) {
        setResult({ blob, url });
      } else {
        window.URL.revokeObjectURL(url);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [backgroundColor, flattenBackground, setResult, source]);

  const sourceVsOutput = useMemo(() => {
    if (!source || !result) return null;
    const delta = result.blob.size - source.size;
    return {
      sourceSize: formatBytes(source.size),
      outputSize: formatBytes(result.blob.size),
      deltaLabel: `${delta >= 0 ? "+" : ""}${formatBytes(Math.abs(delta))}`,
      deltaTone: delta <= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400",
    };
  }, [result, source]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
        <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Upload Source Image</label>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-500/30 bg-background px-4 py-5 text-sm font-medium text-foreground hover:border-cyan-500/50">
          <Upload className="w-4 h-4 text-cyan-600" />
          <span>{source ? source.name : "Choose JPG, PNG, WebP, GIF, or BMP"}</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
            className="hidden"
            onChange={(event) => void loadFile(event).then((loaded) => loaded && setSource(loaded))}
          />
        </label>
        <p className="mt-3 text-sm text-muted-foreground">Convert the uploaded file into a clean PNG export. Keep existing transparency or flatten onto a solid background before download.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">PNG Export Style</label>
            <button
              onClick={() => setFlattenBackground((value) => !value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:border-cyan-500/40"
            >
              {flattenBackground ? "Solid Background PNG" : "Preserve Source Transparency"}
            </button>
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Background Color</label>
            <input
              type="color"
              value={backgroundColor}
              disabled={!flattenBackground}
              onChange={(event) => setBackgroundColor(event.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background p-1 disabled:opacity-50"
            />
          </div>
          <div className="rounded-xl border border-border bg-muted/35 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Output</p>
            <p className="mt-2 text-2xl font-black text-foreground">PNG</p>
            <p className="mt-1 text-xs text-muted-foreground">Same pixel dimensions as the uploaded file.</p>
          </div>
        </div>
      </div>

      {source && result ? (
        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-5">
          <div className="rounded-2xl border border-cyan-500/15 bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">PNG Preview</p>
                <p className="text-sm text-muted-foreground">{source.width} x {source.height}px converted in the browser.</p>
              </div>
              <button
                onClick={() => downloadBlob(result.blob, `${fileBaseName(source.name)}.png`)}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-700"
              >
                <Download className="w-3.5 h-3.5" />
                Download PNG
              </button>
            </div>
            <div className="rounded-3xl border border-border bg-[linear-gradient(45deg,rgba(148,163,184,0.12)_25%,transparent_25%,transparent_75%,rgba(148,163,184,0.12)_75%),linear-gradient(45deg,rgba(148,163,184,0.12)_25%,transparent_25%,transparent_75%,rgba(148,163,184,0.12)_75%)] bg-[length:24px_24px] bg-[position:0_0,12px_12px] p-4">
              <img src={result.url} alt="PNG preview" className="mx-auto max-h-[420px] rounded-2xl border border-border bg-white object-contain" />
            </div>
          </div>

          <div className="space-y-5">
            {sourceVsOutput ? (
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Conversion Readout</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border bg-muted/35 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Source</p>
                    <p className="mt-2 text-2xl font-black text-foreground">{sourceVsOutput.sourceSize}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/35 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">PNG</p>
                    <p className="mt-2 text-2xl font-black text-foreground">{sourceVsOutput.outputSize}</p>
                  </div>
                </div>
                <p className={`mt-4 text-sm font-semibold ${sourceVsOutput.deltaTone}`}>Size change: {sourceVsOutput.deltaLabel}</p>
              </div>
            ) : null}

            <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">PNG Guidance</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">PNG is strongest when you need crisp screenshots, logos, UI assets, or transparent edges. If file size matters more than transparency, WebP or JPG may be the better next step.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
          Upload an image to generate a PNG preview and download-ready file.
        </div>
      )}
    </div>
  );
}

export function PngToWebpCalculator() {
  const [source, setSource] = useState<LoadedImage | null>(null);
  const [quality, setQuality] = useState(82);
  const [preserveTransparency, setPreserveTransparency] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [result, setResult] = useObjectUrl();

  useEffect(() => {
    if (!source) {
      setResult(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = source.width;
      canvas.height = source.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      if (!preserveTransparency) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(source.image, 0, 0);
      const blob = await canvasToBlob(canvas, "image/webp", quality / 100);
      const url = window.URL.createObjectURL(blob);

      if (!cancelled) {
        setResult({ blob, url });
      } else {
        window.URL.revokeObjectURL(url);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [backgroundColor, preserveTransparency, quality, setResult, source]);

  const savings = useMemo(() => {
    if (!source || !result) return null;
    const diff = source.size - result.blob.size;
    const percent = source.size > 0 ? (diff / source.size) * 100 : 0;
    return {
      source: formatBytes(source.size),
      output: formatBytes(result.blob.size),
      diff,
      percent,
    };
  }, [result, source]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
        <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Upload PNG</label>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-500/30 bg-background px-4 py-5 text-sm font-medium text-foreground hover:border-cyan-500/50">
          <Upload className="w-4 h-4 text-cyan-600" />
          <span>{source ? source.name : "Choose a PNG file"}</span>
          <input
            type="file"
            accept="image/png"
            className="hidden"
            onChange={(event) => void loadFile(event).then((loaded) => loaded && setSource(loaded))}
          />
        </label>
        <p className="mt-3 text-sm text-muted-foreground">Convert a PNG into WebP, compare file size savings, and decide whether to preserve transparency or flatten onto a solid background.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Quality ({quality})</label>
            <input type="range" min="30" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="w-full accent-cyan-600" />
            <p className="mt-2 text-xs text-muted-foreground">Lower quality usually means smaller file size.</p>
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Alpha Handling</label>
            <button
              onClick={() => setPreserveTransparency((value) => !value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:border-cyan-500/40"
            >
              {preserveTransparency ? "Keep Transparency" : "Flatten Transparency"}
            </button>
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Fill Color</label>
            <input
              type="color"
              value={backgroundColor}
              disabled={preserveTransparency}
              onChange={(event) => setBackgroundColor(event.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background p-1 disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {source && result && savings ? (
        <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-5">
          <div className="rounded-2xl border border-cyan-500/15 bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">WebP Preview</p>
                <p className="text-sm text-muted-foreground">Exported at {source.width} x {source.height}px with quality {quality}.</p>
              </div>
              <button
                onClick={() => downloadBlob(result.blob, `${fileBaseName(source.name)}.webp`)}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-700"
              >
                <Download className="w-3.5 h-3.5" />
                Download WebP
              </button>
            </div>
            <div className="rounded-3xl border border-border bg-[linear-gradient(45deg,rgba(148,163,184,0.12)_25%,transparent_25%,transparent_75%,rgba(148,163,184,0.12)_75%),linear-gradient(45deg,rgba(148,163,184,0.12)_25%,transparent_25%,transparent_75%,rgba(148,163,184,0.12)_75%)] bg-[length:24px_24px] bg-[position:0_0,12px_12px] p-4">
              <img src={result.url} alt="WebP preview" className="mx-auto max-h-[420px] rounded-2xl border border-border bg-white object-contain" />
            </div>
          </div>

          <div className="space-y-5">
            <div className={`rounded-2xl border p-5 ${savings.diff >= 0 ? "border-emerald-500/20 bg-emerald-500/5" : "border-amber-500/20 bg-amber-500/5"}`}>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Compression Snapshot</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Source PNG</p>
                  <p className="mt-2 text-2xl font-black text-foreground">{savings.source}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">WebP</p>
                  <p className="mt-2 text-2xl font-black text-foreground">{savings.output}</p>
                </div>
              </div>
              <p className={`mt-4 text-sm font-semibold ${savings.diff >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                {savings.diff >= 0 ? `${formatBytes(savings.diff)} smaller` : `${formatBytes(Math.abs(savings.diff))} larger`} ({Math.abs(savings.percent).toFixed(1)}%)
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">WebP Guidance</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">WebP usually reduces size for web delivery, product galleries, and blog images. If the source includes transparency that must survive, keep alpha enabled. If not, flattening can sometimes shrink the file further.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
          Upload a PNG to compare the original file size against a new WebP export.
        </div>
      )}
    </div>
  );
}

export function ImageWatermarkCalculator() {
  const [source, setSource] = useState<LoadedImage | null>(null);
  const [watermarkLogo, setWatermarkLogo] = useState<LoadedImage | null>(null);
  const [mode, setMode] = useState<"text" | "logo">("text");
  const [text, setText] = useState("Sample Preview");
  const [textSize, setTextSize] = useState(8);
  const [opacity, setOpacity] = useState(50);
  const [position, setPosition] = useState<Position>("bottom-right");
  const [margin, setMargin] = useState(4);
  const [color, setColor] = useState("#ffffff");
  const [logoScale, setLogoScale] = useState(20);
  const [result, setResult] = useObjectUrl();

  useEffect(() => {
    if (!source) {
      setResult(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = source.width;
      canvas.height = source.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.drawImage(source.image, 0, 0);
      ctx.globalAlpha = opacity / 100;

      const marginPx = Math.round((Math.min(source.width, source.height) * margin) / 100);

      if (mode === "logo" && watermarkLogo) {
        const targetWidth = Math.round((source.width * logoScale) / 100);
        const ratio = watermarkLogo.width / watermarkLogo.height || 1;
        const targetHeight = Math.max(1, Math.round(targetWidth / ratio));
        const { x, y } = positionRect(source.width, source.height, targetWidth, targetHeight, marginPx, position);
        ctx.drawImage(watermarkLogo.image, x, y, targetWidth, targetHeight);
      } else {
        const fontSize = Math.max(18, Math.round((Math.min(source.width, source.height) * textSize) / 100));
        ctx.font = `700 ${fontSize}px Inter, Arial, sans-serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        const metrics = ctx.measureText(text || "Watermark");
        const boxWidth = metrics.width;
        const boxHeight = fontSize * 1.2;
        const { x, y } = positionRect(source.width, source.height, boxWidth, boxHeight, marginPx, position);

        ctx.fillStyle = color;
        ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
        ctx.shadowBlur = Math.max(4, fontSize * 0.18);
        ctx.shadowOffsetY = Math.max(1, Math.round(fontSize * 0.06));
        ctx.fillText(text || "Watermark", x, y);
      }

      ctx.globalAlpha = 1;
      const blob = await canvasToBlob(canvas, "image/png");
      const url = window.URL.createObjectURL(blob);

      if (!cancelled) {
        setResult({ blob, url });
      } else {
        window.URL.revokeObjectURL(url);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [color, logoScale, margin, mode, opacity, position, setResult, source, text, textSize, watermarkLogo]);

  const summary = useMemo(() => {
    if (!source) return "";
    return [
      `Mode: ${mode === "text" ? "Text watermark" : "Logo watermark"}`,
      `Position: ${position}`,
      `Opacity: ${opacity}%`,
      mode === "text" ? `Text size: ${textSize}% of image short edge` : `Logo scale: ${logoScale}% of image width`,
      `Margin: ${margin}%`,
      `Source: ${source.width} x ${source.height}px`,
    ].join("\n");
  }, [logoScale, margin, mode, opacity, position, source, textSize]);

  const copySummary = async () => {
    await navigator.clipboard.writeText(summary);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
            <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Source Image</label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-500/30 bg-background px-4 py-5 text-sm font-medium text-foreground hover:border-cyan-500/50">
              <Upload className="w-4 h-4 text-cyan-600" />
              <span>{source ? source.name : "Choose the base image"}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
                className="hidden"
                onChange={(event) => void loadFile(event).then((loaded) => loaded && setSource(loaded))}
              />
            </label>
            <p className="mt-3 text-sm text-muted-foreground">Add a text watermark or overlay a logo file, then export a proof-ready PNG.</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex flex-wrap gap-2">
              <button onClick={() => setMode("text")} className={`rounded-full px-3 py-2 text-xs font-bold ${mode === "text" ? "bg-cyan-600 text-white" : "border border-border bg-background text-foreground"}`}>
                Text Watermark
              </button>
              <button onClick={() => setMode("logo")} className={`rounded-full px-3 py-2 text-xs font-bold ${mode === "logo" ? "bg-cyan-600 text-white" : "border border-border bg-background text-foreground"}`}>
                Logo Watermark
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mode === "text" ? (
                <>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Watermark Text</label>
                    <input value={text} onChange={(event) => setText(event.target.value)} className="tool-calc-input w-full" placeholder="Enter watermark text" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Text Color</label>
                    <input type="color" value={color} onChange={(event) => setColor(event.target.value)} className="h-11 w-full rounded-xl border border-border bg-background p-1" />
                  </div>
                  <div>
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Text Size ({textSize}%)</label>
                    <input type="range" min="4" max="18" value={textSize} onChange={(event) => setTextSize(Number(event.target.value))} className="w-full accent-cyan-600" />
                  </div>
                </>
              ) : (
                <>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Watermark Logo</label>
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background px-4 py-4 text-sm font-medium text-foreground hover:border-cyan-500/40">
                      <Stamp className="w-4 h-4 text-cyan-600" />
                      <span>{watermarkLogo ? watermarkLogo.name : "Choose a PNG, SVG, or transparent logo"}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        className="hidden"
                        onChange={(event) => void loadFile(event).then((loaded) => loaded && setWatermarkLogo(loaded))}
                      />
                    </label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Logo Scale ({logoScale}% of width)</label>
                    <input type="range" min="10" max="40" value={logoScale} onChange={(event) => setLogoScale(Number(event.target.value))} className="w-full accent-cyan-600" />
                  </div>
                </>
              )}

              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Opacity ({opacity}%)</label>
                <input type="range" min="10" max="100" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} className="w-full accent-cyan-600" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Margin ({margin}%)</label>
                <input type="range" min="1" max="12" value={margin} onChange={(event) => setMargin(Number(event.target.value))} className="w-full accent-cyan-600" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Position</label>
                <select value={position} onChange={(event) => setPosition(event.target.value as Position)} className="tool-calc-input w-full">
                  <option value="top-left">Top left</option>
                  <option value="top-right">Top right</option>
                  <option value="bottom-left">Bottom left</option>
                  <option value="bottom-right">Bottom right</option>
                  <option value="center">Center</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Live Watermark Preview</p>
                <p className="text-sm text-muted-foreground">Check placement and visibility before export.</p>
              </div>
              <button onClick={copySummary} className="text-xs font-bold text-cyan-700 dark:text-cyan-400">
                <Copy className="inline h-3.5 w-3.5 mr-1" />
                Copy Setup
              </button>
            </div>
            <div className="rounded-3xl border border-border bg-muted/35 p-4">
              {result ? (
                <img src={result.url} alt="Watermark preview" className="mx-auto max-h-[420px] rounded-2xl border border-border object-contain" />
              ) : (
                <div className="flex h-[300px] items-center justify-center rounded-2xl border border-dashed border-border bg-background text-sm text-muted-foreground">
                  Upload a base image to preview the watermark.
                </div>
              )}
            </div>
            {source && result ? (
              <button
                onClick={() => downloadBlob(result.blob, `${fileBaseName(source.name)}-watermarked.png`)}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-4 text-sm font-bold text-white hover:bg-cyan-700"
              >
                <Download className="w-4 h-4" />
                Download Watermarked PNG
              </button>
            ) : null}
          </div>

          <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Watermark Notes</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Bottom-right text watermarks usually work for proofs and portfolio images. Center placement is more protective but more intrusive. Keep opacity high enough to remain readable after screenshots or reposts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MemeGeneratorCalculator() {
  const [source, setSource] = useState<LoadedImage | null>(null);
  const [topText, setTopText] = useState("WHEN THE TOOL FINALLY SHIPS");
  const [bottomText, setBottomText] = useState("AND IT ACTUALLY WORKS");
  const [fontScale, setFontScale] = useState(9);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [uppercase, setUppercase] = useState(true);
  const [result, setResult] = useObjectUrl();

  useEffect(() => {
    if (!source) {
      setResult(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = source.width;
      canvas.height = source.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.drawImage(source.image, 0, 0);
      const fontSize = Math.max(22, Math.round((Math.min(source.width, source.height) * fontScale) / 100));
      const normalizedTop = uppercase ? topText.toUpperCase() : topText;
      const normalizedBottom = uppercase ? bottomText.toUpperCase() : bottomText;

      ctx.font = `900 ${fontSize}px Impact, Arial Black, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.lineJoin = "round";
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = Math.max(2, strokeWidth);

      drawOutlinedText(ctx, normalizedTop, fontSize * 0.3, canvas.width, fontSize);

      const bottomLines = wrapText(ctx, normalizedBottom, canvas.width * 0.9);
      const lineHeight = fontSize * 1.08;
      const blockHeight = bottomLines.length * lineHeight;
      bottomLines.forEach((line, index) => {
        const y = canvas.height - blockHeight - fontSize * 0.35 + index * lineHeight;
        ctx.strokeText(line, canvas.width / 2, y);
        ctx.fillText(line, canvas.width / 2, y);
      });

      const blob = await canvasToBlob(canvas, "image/png");
      const url = window.URL.createObjectURL(blob);

      if (!cancelled) {
        setResult({ blob, url });
      } else {
        window.URL.revokeObjectURL(url);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [bottomText, fontScale, setResult, source, strokeWidth, topText, uppercase]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
        <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Base Image</label>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-500/30 bg-background px-4 py-5 text-sm font-medium text-foreground hover:border-cyan-500/50">
          <ImageIcon className="w-4 h-4 text-cyan-600" />
          <span>{source ? source.name : "Choose a meme base image"}</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
            className="hidden"
            onChange={(event) => void loadFile(event).then((loaded) => loaded && setSource(loaded))}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-5">
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Top Text</label>
                <textarea value={topText} onChange={(event) => setTopText(event.target.value)} className="tool-calc-input min-h-[92px] w-full resize-y" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Bottom Text</label>
                <textarea value={bottomText} onChange={(event) => setBottomText(event.target.value)} className="tool-calc-input min-h-[92px] w-full resize-y" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Text Size ({fontScale}%)</label>
                <input type="range" min="5" max="16" value={fontScale} onChange={(event) => setFontScale(Number(event.target.value))} className="w-full accent-cyan-600" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Stroke ({strokeWidth}px)</label>
                <input type="range" min="2" max="12" value={strokeWidth} onChange={(event) => setStrokeWidth(Number(event.target.value))} className="w-full accent-cyan-600" />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Caption Style</label>
                <button onClick={() => setUppercase((value) => !value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:border-cyan-500/40">
                  {uppercase ? "ALL CAPS" : "Sentence Case"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Meme Preview</p>
                <p className="text-sm text-muted-foreground">Top and bottom captions are redrawn instantly.</p>
              </div>
              <Sparkles className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="rounded-3xl border border-border bg-muted/35 p-4">
              {result ? (
                <img src={result.url} alt="Meme preview" className="mx-auto max-h-[420px] rounded-2xl border border-border object-contain" />
              ) : (
                <div className="flex h-[300px] items-center justify-center rounded-2xl border border-dashed border-border bg-background text-sm text-muted-foreground">
                  Upload an image to generate the meme preview.
                </div>
              )}
            </div>
            {source && result ? (
              <button
                onClick={() => downloadBlob(result.blob, `${fileBaseName(source.name)}-meme.png`)}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-4 text-sm font-bold text-white hover:bg-cyan-700"
              >
                <Download className="w-4 h-4" />
                Download Meme
              </button>
            ) : null}
          </div>

          <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Caption Tips</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Keep the top line as the setup and the bottom line as the punchline. Strong contrast and shorter phrases read better on small social previews than long sentence blocks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SvgToPngCalculator() {
  const [svgMarkup, setSvgMarkup] = useState(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <rect width="640" height="360" rx="28" fill="#0f172a" />
  <circle cx="132" cy="180" r="72" fill="#06b6d4" />
  <rect x="228" y="108" width="288" height="32" rx="16" fill="#ffffff" opacity="0.92" />
  <rect x="228" y="162" width="226" height="22" rx="11" fill="#67e8f9" opacity="0.95" />
  <rect x="228" y="204" width="190" height="22" rx="11" fill="#38bdf8" opacity="0.85" />
</svg>`);
  const [sourceName, setSourceName] = useState("vector-art");
  const [baseWidth, setBaseWidth] = useState(640);
  const [baseHeight, setBaseHeight] = useState(360);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState("");
  const [result, setResult] = useObjectUrl();

  const outputWidth = Math.max(1, Math.round(baseWidth * scale));
  const outputHeight = Math.max(1, Math.round(baseHeight * scale));
  const previewDataUrl = useMemo(() => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`, [svgMarkup]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!svgMarkup.trim()) {
        setResult(null);
        return;
      }

      try {
        const image = new window.Image();
        const loaded = new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error("The SVG markup could not be rendered. Check the XML and try again."));
        });
        image.src = previewDataUrl;
        await loaded;

        const canvas = document.createElement("canvas");
        canvas.width = outputWidth;
        canvas.height = outputHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const blob = await canvasToBlob(canvas, "image/png");
        const url = window.URL.createObjectURL(blob);

        if (!cancelled) {
          setError("");
          setResult({ blob, url });
        } else {
          window.URL.revokeObjectURL(url);
        }
      } catch (err) {
        if (!cancelled) {
          setResult(null);
          setError(err instanceof Error ? err.message : "Failed to render SVG markup.");
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [outputHeight, outputWidth, previewDataUrl, setResult, svgMarkup]);

  const handleSvgFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const markup = await file.text();
    setSvgMarkup(markup);
    setSourceName(fileBaseName(file.name));

    const widthMatch = markup.match(/width="([\d.]+)"/i);
    const heightMatch = markup.match(/height="([\d.]+)"/i);
    const viewBoxMatch = markup.match(/viewBox="[\d.\s-]+ ([\d.]+) ([\d.]+)"/i);

    const parsedWidth = widthMatch ? Number(widthMatch[1]) : viewBoxMatch ? Number(viewBoxMatch[1]) : 640;
    const parsedHeight = heightMatch ? Number(heightMatch[1]) : viewBoxMatch ? Number(viewBoxMatch[2]) : 360;

    setBaseWidth(Number.isFinite(parsedWidth) && parsedWidth > 0 ? parsedWidth : 640);
    setBaseHeight(Number.isFinite(parsedHeight) && parsedHeight > 0 ? parsedHeight : 360);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-5">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Upload SVG or Paste Markup</label>
            <label className="mb-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-500/30 bg-background px-4 py-4 text-sm font-medium text-foreground hover:border-cyan-500/50">
              <Layers className="w-4 h-4 text-cyan-600" />
              <span>Choose an SVG file</span>
              <input type="file" accept=".svg,image/svg+xml" className="hidden" onChange={(event) => void handleSvgFile(event)} />
            </label>
            <textarea value={svgMarkup} onChange={(event) => setSvgMarkup(event.target.value)} className="tool-calc-input min-h-[220px] w-full resize-y font-mono text-xs" spellCheck={false} />
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Base Width</label>
              <input type="number" min="1" value={baseWidth} onChange={(event) => setBaseWidth(Math.max(1, Number(event.target.value) || 1))} className="tool-calc-input w-full" />
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Base Height</label>
              <input type="number" min="1" value={baseHeight} onChange={(event) => setBaseHeight(Math.max(1, Number(event.target.value) || 1))} className="tool-calc-input w-full" />
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Scale ({scale.toFixed(1)}x)</label>
              <input type="range" min="0.5" max="4" step="0.1" value={scale} onChange={(event) => setScale(Number(event.target.value))} className="w-full accent-cyan-600" />
              <p className="mt-2 text-xs text-muted-foreground">Final raster output: {outputWidth} x {outputHeight}px</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-5">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Vector Preview</p>
          <div className="rounded-3xl border border-border bg-muted/35 p-4">
            <img src={previewDataUrl} alt="SVG preview" className="mx-auto max-h-[360px] rounded-2xl border border-border bg-white object-contain" />
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">PNG Output</p>
                <p className="text-sm text-muted-foreground">Rasterized at {outputWidth} x {outputHeight}px.</p>
              </div>
              {result ? (
                <button onClick={() => downloadBlob(result.blob, `${sourceName}.png`)} className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-700">
                  <Download className="w-3.5 h-3.5" />
                  Download PNG
                </button>
              ) : null}
            </div>
            <div className="rounded-3xl border border-border bg-muted/35 p-4">
              {result ? (
                <img src={result.url} alt="PNG output" className="mx-auto max-h-[360px] rounded-2xl border border-border bg-white object-contain" />
              ) : (
                <div className="flex h-[280px] items-center justify-center rounded-2xl border border-dashed border-border bg-background text-sm text-muted-foreground">
                  A PNG preview will appear here after the SVG renders.
                </div>
              )}
            </div>
          </div>

          <div className={`rounded-2xl border p-5 ${error ? "border-rose-500/20 bg-rose-500/5" : "border-cyan-500/15 bg-cyan-500/5"}`}>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Raster Guidance</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{error || "SVG stays sharp at any size because it is vector-based. Once you export PNG, the chosen width and height become fixed pixels, so set the output large enough for the destination platform."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
