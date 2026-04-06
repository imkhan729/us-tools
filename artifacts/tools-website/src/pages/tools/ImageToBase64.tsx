import { useState } from "react";
import { Copy, FileCode2, Image as ImageIcon, Upload } from "lucide-react";
import ImageToolPageShell from "./ImageToolPageShell";
import { LoadedImage, formatBytes, loadImageFile, stripDataUrlPrefix } from "./imageToolUtils";

export default function ImageToBase64() {
  const [source, setSource] = useState<LoadedImage | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"data" | "raw" | "">("");

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

  const dataUrl = source?.src ?? "";
  const rawBase64 = dataUrl ? stripDataUrlPrefix(dataUrl) : "";

  const copyText = async (value: string, mode: "data" | "raw") => {
    await navigator.clipboard.writeText(value);
    setCopied(mode);
    window.setTimeout(() => setCopied(""), 2000);
  };

  return (
    <ImageToolPageShell
      title="Image to Base64 Converter"
      seoTitle="Image To Base64 Converter - Encode Images In The Browser"
      seoDescription="Convert images to Base64 strings in your browser. Free image to Base64 converter with Data URL and raw Base64 output."
      canonical="https://usonlinetools.com/image/image-to-base64"
      heroDescription="Convert an uploaded image into Base64 text for inline HTML, CSS, email markup, JSON payloads, or developer workflows that need image data as a string. This page gives you both the full Data URL and the raw Base64 output so you can copy the exact version your implementation expects."
      heroIcon={<ImageIcon className="w-3.5 h-3.5" />}
      calculatorLabel="Image Encoder"
      calculatorDescription="Generate both Data URL and raw Base64 output, inspect the file details, and copy the right value for your code or payload."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Upload Image</label>
            <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-500/30 bg-background px-4 py-5 text-sm font-medium text-foreground cursor-pointer hover:border-cyan-500/50 transition-colors">
              <Upload className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{source ? source.name : "Choose an image to encode"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(event) => void handleFileChange(event.target.files?.[0] ?? null)} />
            </label>
          </div>

          {source ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">File Type</p>
                  <p className="text-lg font-black text-foreground">{source.type}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Dimensions</p>
                  <p className="text-lg font-black text-foreground">{source.width} x {source.height}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">File Size</p>
                  <p className="text-lg font-black text-foreground">{formatBytes(source.size)}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileCode2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <h3 className="text-lg font-bold text-foreground">Data URL</h3>
                </div>
                <textarea value={dataUrl} readOnly className="tool-calc-input w-full min-h-[140px] font-mono text-xs" />
                <button onClick={() => void copyText(dataUrl, "data")} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-cyan-600 text-white font-bold text-sm px-4 py-3 hover:bg-cyan-700 transition-colors">
                  <Copy className="w-4 h-4" /> {copied === "data" ? "Copied Data URL" : "Copy Data URL"}
                </button>
              </div>

              <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileCode2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <h3 className="text-lg font-bold text-foreground">Raw Base64</h3>
                </div>
                <textarea value={rawBase64} readOnly className="tool-calc-input w-full min-h-[140px] font-mono text-xs" />
                <button onClick={() => void copyText(rawBase64, "raw")} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-cyan-600 text-white font-bold text-sm px-4 py-3 hover:bg-cyan-700 transition-colors">
                  <Copy className="w-4 h-4" /> {copied === "raw" ? "Copied Base64" : "Copy Raw Base64"}
                </button>
              </div>
            </>
          ) : null}

          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
        </div>
      }
      howToTitle="How to Use the Image to Base64 Converter"
      howToIntro="Base64 encoding turns an image file into text, which is useful when the receiving environment expects a string instead of a normal file upload. This is common in frontend prototyping, API integrations, template systems, and content pipelines that need image data embedded directly into markup or payloads."
      howSteps={[
        { title: "Upload the image you want to encode", description: "Choose the file from your device and the tool reads it locally. Once loaded, the page produces both the full Data URL and the raw Base64 payload." },
        { title: "Copy the exact Base64 format your workflow expects", description: "Use the Data URL when you need the mime type included, such as in HTML or CSS. Use the raw Base64 output when another system already knows the file type and expects only the encoded string." },
        { title: "Paste the result into markup, JSON, or your application flow", description: "The copied value can be used in frontend code, CMS fields, email templates, API requests, or debugging workflows where image data must travel as text." },
      ]}
      formulaTitle="Base64 Encoding Concepts"
      formulaIntro="Base64 does not change the visible image itself. It changes the way the binary data is represented so the file can move through text-based systems more safely and conveniently."
      formulaCards={[
        { label: "Data URL", formula: "data:image/type;base64,<encoded-data>", detail: "A Data URL combines the mime type and the Base64 payload in one ready-to-paste string, which is why it is useful in HTML and CSS contexts." },
        { label: "Raw Base64", formula: "Encoded Data Only", detail: "Raw Base64 removes the mime prefix and leaves only the encoded image data, which is often what APIs and storage fields expect." },
      ]}
      examplesTitle="Image to Base64 Examples"
      examplesIntro="Encoding images to Base64 is mostly a developer and integration task. These are some of the most common situations where people need that conversion."
      examples={[
        { title: "Inline Frontend Asset", value: "Embed Directly", detail: "A small logo or icon can be pasted into an HTML tag or CSS background using a Data URL instead of a separate file reference." },
        { title: "JSON Or API Request", value: "Text Safe", detail: "Some APIs accept Base64 strings when file uploads need to travel inside JSON instead of multipart form data." },
        { title: "Template Workflow", value: "Single String", detail: "Email builders, exports, or controlled rendering pipelines sometimes prefer one portable encoded string over a linked asset." },
      ]}
      contentTitle="Why Convert An Image To Base64"
      contentIntro="Base64 is useful when an image needs to move through a system that handles text more naturally than files. It is not the best choice for every image workflow, but it is extremely practical when embedding, transporting, or debugging image data as a string."
      contentSections={[
        {
          title: "When Base64 is useful",
          paragraphs: [
            "Base64 is handy when you need to embed small assets directly into markup, styles, or structured payloads. That can simplify prototypes, reduce asset management during testing, and support systems that expect image data inside a text field.",
            "It is also useful in automation flows, exports, and integrations where an image needs to ride along with JSON, templates, or other text-friendly formats.",
          ],
        },
        {
          title: "When Base64 is not ideal",
          paragraphs: [
            "Base64 strings are longer than the original binary data, so large images usually become less efficient when embedded this way. That makes Base64 a poor default for normal production image delivery on most web pages.",
            "For many websites, linking to a properly optimized image file is still more practical than placing a large encoded string directly into the HTML, CSS, or response payload.",
          ],
        },
        {
          title: "Why Data URL and raw Base64 are different",
          paragraphs: [
            "A Data URL includes the mime prefix, so it is ready to paste directly into HTML or CSS without extra assembly. That makes it convenient when the rendering layer needs the full string as-is.",
            "Raw Base64 omits that prefix and leaves only the payload. That is useful when another system already knows the image type and wants only the encoded data.",
          ],
        },
      ]}
      faqs={[
        { q: "What is the difference between Data URL and raw Base64?", a: "A Data URL includes the mime type prefix such as data:image/png;base64,... while raw Base64 contains only the encoded payload." },
        { q: "Does Base64 make the image smaller?", a: "No. Base64 usually makes the text representation larger than the original binary file, which is why it is mainly used for transport or embedding rather than compression." },
        { q: "Is this conversion done locally?", a: "Yes. The file is encoded in your browser, so there is no need to upload the image to a server for conversion." },
        { q: "Can I use Base64 in HTML and CSS?", a: "Yes. Data URLs are commonly used in HTML image tags and CSS backgrounds for small embedded assets or tightly controlled frontend workflows." },
      ]}
      relatedTools={[
        { title: "Base64 to Image Converter", href: "/image/base64-to-image", benefit: "Decode Base64 strings back into downloadable images." },
        { title: "Image Format Converter", href: "/image/image-format-converter", benefit: "Convert the image before encoding it." },
        { title: "Image Compressor", href: "/image/image-compressor", benefit: "Shrink the file before converting to Base64." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Text-Based Image Workflows", detail: "Useful for inline markup, JSON payloads, templates, and developer tooling." },
        { label: "Core Output", value: "Data URL + Raw Base64", detail: "Copy the full string or just the encoded payload depending on the receiving system." },
        { label: "Privacy", value: "Encoded Locally", detail: "The browser handles the conversion without a remote upload step." },
      ]}
    />
  );
}
