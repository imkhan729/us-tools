import { useEffect, useMemo, useState, type CSSProperties, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { getCanonicalToolPath, getRelatedTools, getToolBySlug, getToolPath, resolveToolSlug } from "@/data/tools";
import NotFound from "../not-found";
import { Link, useLocation, useParams } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { PDFDocument, StandardFonts, degrees, rgb, type PDFPage } from "pdf-lib";
import { ToolRightSidebar } from "@/components/ToolRightSidebar";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  FileImage,
  FileOutput,
  FileSignature,
  GripVertical,
  Hash,
  ImageUp,
  Layers,
  Lock,
  RotateCw,
  Scissors,
  Shield,
  Smartphone,
  Stamp,
  Type,
  Upload,
  Zap,
} from "lucide-react";

type OutputFile = {
  name: string;
  blob: Blob;
  note: string;
};

type ProcessResult = {
  outputs: OutputFile[];
  summary: string;
};

type PdfToolConfig = {
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  icon: LucideIcon;
  accept: string;
  multiple: boolean;
  helperText: string;
  howTo: string[];
  tips: string[];
};

type Position =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-rose-500/40 transition-colors">
      <button
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-rose-500"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RECENT_REDESIGN_PDF_SLUGS = new Set([
  "pdf-compress",
  "pdf-to-image",
  "pdf-password-protect",
  "pdf-unlock",
  "pdf-to-text",
]);

const SIDEBAR_COLOR_STOPS = [148, 336, 26, 266, 218, 46];

const PDF_TOOL_CONFIGS: Record<string, PdfToolConfig> = {
  "pdf-merge": {
    slug: "pdf-merge",
    title: "PDF Merge",
    description: "Combine multiple PDF files into a single document in the order you upload them.",
    metaDescription: "Free online PDF merger. Combine multiple PDFs into one file in your browser.",
    icon: Layers,
    accept: "application/pdf",
    multiple: true,
    helperText: "Upload two or more PDF files. They will be merged in the order shown below.",
    howTo: [
      "Upload the PDF files you want to combine.",
      "Check the file order before processing.",
      "Click Merge PDF and download the final combined document.",
    ],
    tips: [
      "Use already-finalized source files before merging to avoid duplicate edits later.",
      "If order matters, upload files in the exact sequence you want in the final document.",
      "Very large files may take longer because processing happens locally in your browser.",
    ],
  },
  "pdf-split": {
    slug: "pdf-split",
    title: "PDF Split",
    description: "Split one PDF into separate output files using custom page groups.",
    metaDescription: "Free online PDF splitter. Extract pages from PDFs into separate files.",
    icon: Scissors,
    accept: "application/pdf",
    multiple: false,
    helperText: "Use semicolons to separate output files. Example: 1-2; 3-5; 6.",
    howTo: [
      "Upload a single PDF file.",
      "Enter page groups using semicolons between each output document.",
      "Click Split PDF and download each generated part separately.",
    ],
    tips: [
      "Use page ranges like 2-6 for long contiguous sections.",
      "Single pages like 4 can be mixed with ranges in the same split plan.",
      "Each semicolon creates a separate downloadable PDF output.",
    ],
  },
  "pdf-compress": {
    slug: "pdf-compress",
    title: "PDF Compressor",
    description: "Rebuild and optimize PDF structure to reduce file size for sharing and upload workflows.",
    metaDescription: "Free online PDF compressor. Rebuild PDF files in-browser and reduce size when possible.",
    icon: FileOutput,
    accept: "application/pdf",
    multiple: false,
    helperText: "Upload one PDF file and choose a compression profile.",
    howTo: [
      "Upload a PDF file.",
      "Choose a compression profile that matches your quality and size preference.",
      "Click Compress PDF and download the optimized file.",
    ],
    tips: [
      "Compression results vary by source file structure and embedded media quality.",
      "Scanned PDFs with large images usually compress more than text-only PDFs.",
      "Use balanced mode first, then test maximum compression if needed.",
    ],
  },
  "pdf-to-image": {
    slug: "pdf-to-image",
    title: "PDF to Image Converter",
    description: "Extract embedded JPG and PNG image assets from a PDF into separate downloadable files.",
    metaDescription: "Free PDF to image converter. Extract embedded JPG and PNG images from PDF files online.",
    icon: FileImage,
    accept: "application/pdf",
    multiple: false,
    helperText: "Upload one PDF file. This browser version extracts embedded raster images (JPG/PNG).",
    howTo: [
      "Upload a PDF file.",
      "Choose whether to keep original formats or force JPG/PNG output.",
      "Click Extract Images and download the generated image files.",
    ],
    tips: [
      "Best results come from scanned or image-heavy PDFs containing raster assets.",
      "Vector-only PDFs may not contain embedded raster images to extract.",
      "Use the format conversion option when your destination requires one image type.",
    ],
  },
  "image-to-pdf": {
    slug: "image-to-pdf",
    title: "Image to PDF Converter",
    description: "Convert one or more PNG or JPG images into a multi-page PDF document.",
    metaDescription: "Free image to PDF converter. Convert JPG, PNG images to PDF online.",
    icon: ImageUp,
    accept: ".png,.jpg,.jpeg,image/png,image/jpeg",
    multiple: true,
    helperText: "Upload PNG or JPG images. Each image becomes a separate PDF page.",
    howTo: [
      "Upload one or more images from your device.",
      "Keep them in the order you want the PDF pages to appear.",
      "Click Convert to PDF and download the generated document.",
    ],
    tips: [
      "Use higher-resolution images if the PDF is meant for printing.",
      "Portrait images create portrait-sized pages and landscape images create landscape pages.",
      "PNG and JPG are supported in this first release.",
    ],
  },
  "jpg-to-pdf": {
    slug: "jpg-to-pdf",
    title: "JPG to PDF Converter",
    description: "Turn one or more JPG images into a single PDF file without leaving your browser.",
    metaDescription: "Free JPG to PDF converter. Convert JPG images to PDF online.",
    icon: ImageUp,
    accept: ".jpg,.jpeg,image/jpeg",
    multiple: true,
    helperText: "Upload one or more JPG files. They will be turned into a single PDF in upload order.",
    howTo: [
      "Upload the JPG files you want in the final document.",
      "Check the order shown in the selected file list.",
      "Click Convert JPG to PDF and download the finished file.",
    ],
    tips: [
      "Use JPG when smaller file size matters more than lossless image quality.",
      "Large JPG photos can create large PDF files, especially across many pages.",
      "If you need PNG support, use Image to PDF instead.",
    ],
  },
  "pdf-rotate": {
    slug: "pdf-rotate",
    title: "PDF Page Rotator",
    description: "Rotate every page or just selected page ranges by 90, 180, or 270 degrees.",
    metaDescription: "Free online PDF page rotator. Rotate PDF pages by 90, 180, or 270 degrees.",
    icon: RotateCw,
    accept: "application/pdf",
    multiple: false,
    helperText: "Use 'all' or a page list like 1,3,5-7 in the Pages field.",
    howTo: [
      "Upload a PDF file.",
      "Choose the rotation amount and select the pages to rotate.",
      "Click Rotate PDF and download the updated file.",
    ],
    tips: [
      "Use 90 degrees for sideways scans that need to be upright.",
      "The page list accepts single pages and ranges.",
      "Leaving the page selector as 'all' rotates the entire document.",
    ],
  },
  "pdf-page-remover": {
    slug: "pdf-page-remover",
    title: "PDF Page Remover",
    description: "Delete selected pages from a PDF and keep the remaining pages in order.",
    metaDescription: "Free PDF page remover. Delete unwanted pages from PDFs online.",
    icon: Scissors,
    accept: "application/pdf",
    multiple: false,
    helperText: "Enter pages to remove using a list like 2,4,8-10.",
    howTo: [
      "Upload a PDF file.",
      "Enter the page numbers or ranges you want to remove.",
      "Click Remove Pages and download the cleaned document.",
    ],
    tips: [
      "Double-check page numbers before removing pages from long files.",
      "Use ranges for large contiguous sections to save time.",
      "At least one page must remain after removal.",
    ],
  },
  "pdf-page-reorder": {
    slug: "pdf-page-reorder",
    title: "PDF Page Reorder",
    description: "Rebuild a PDF in a new page order using a simple comma-separated sequence.",
    metaDescription: "Free PDF page reorder tool. Rearrange PDF pages with drag and drop style ordering.",
    icon: GripVertical,
    accept: "application/pdf",
    multiple: false,
    helperText: "Enter a full page order like 3,1,2,4. Every page must appear exactly once.",
    howTo: [
      "Upload a PDF file.",
      "Enter the exact page order you want in the final document.",
      "Click Reorder Pages and download the rebuilt PDF.",
    ],
    tips: [
      "This first version uses a typed order list instead of a visual drag-and-drop canvas.",
      "Every source page must appear once in the order string.",
      "Use this to move cover pages, appendices, or inserts into the right place.",
    ],
  },
  "pdf-watermark": {
    slug: "pdf-watermark",
    title: "PDF Watermark Tool",
    description: "Add a text watermark across every page in your PDF.",
    metaDescription: "Free PDF watermark tool. Add custom watermarks to PDFs online.",
    icon: Stamp,
    accept: "application/pdf",
    multiple: false,
    helperText: "Add a simple text watermark like DRAFT, CONFIDENTIAL, or INTERNAL USE.",
    howTo: [
      "Upload a PDF file.",
      "Enter watermark text and choose style settings.",
      "Click Add Watermark and download the stamped PDF.",
    ],
    tips: [
      "Diagonal watermarks are useful for draft documents and internal review copies.",
      "Lower opacity keeps the source content more readable.",
      "Short labels usually look cleaner than long sentences.",
    ],
  },
  "pdf-password-protect": {
    slug: "pdf-password-protect",
    title: "PDF Password Protector",
    description: "Apply password protection to PDF files when browser encryption support is available.",
    metaDescription: "Free PDF password protector. Add password protection to PDF files in your browser.",
    icon: Lock,
    accept: "application/pdf",
    multiple: false,
    helperText: "Upload one PDF and provide a user password to protect opening access.",
    howTo: [
      "Upload a PDF file.",
      "Enter a user password and optional owner password.",
      "Click Protect PDF and download the secured output.",
    ],
    tips: [
      "Use a strong password and store it safely before sharing the file.",
      "Owner passwords can restrict editing and copying in supporting viewers.",
      "If your browser runtime lacks PDF encryption support, the tool reports it clearly.",
    ],
  },
  "pdf-unlock": {
    slug: "pdf-unlock",
    title: "PDF Unlock Tool",
    description: "Unlock password-protected PDF files and save an unencrypted copy when credentials are valid.",
    metaDescription: "Free PDF unlock tool. Remove password protection from PDFs using the correct password.",
    icon: Shield,
    accept: "application/pdf",
    multiple: false,
    helperText: "Upload one protected PDF and enter its password to unlock it.",
    howTo: [
      "Upload a password-protected PDF.",
      "Enter the correct open password.",
      "Click Unlock PDF and download the unlocked copy.",
    ],
    tips: [
      "You must have legal permission and the correct password for the document.",
      "If a file is already unlocked, the output is simply rebuilt without encryption.",
      "Some PDF encryption variants depend on browser runtime capabilities.",
    ],
  },
  "pdf-to-text": {
    slug: "pdf-to-text",
    title: "PDF to Text Extractor",
    description: "Extract likely readable text strings from a PDF into a plain TXT file.",
    metaDescription: "Free PDF to text extractor. Pull readable text strings from PDF files online.",
    icon: Type,
    accept: "application/pdf",
    multiple: false,
    helperText: "Upload one PDF file and extract text into a downloadable .txt output.",
    howTo: [
      "Upload a PDF file.",
      "Choose whether to preserve raw line flow.",
      "Click Extract Text and download the TXT output.",
    ],
    tips: [
      "Digitally generated PDFs usually extract better than scanned image-only files.",
      "If no text is found, the PDF is likely image-only and needs OCR.",
      "Use raw mode when you want less normalization of whitespace.",
    ],
  },
  "pdf-page-number": {
    slug: "pdf-page-number",
    title: "PDF Page Number Adder",
    description: "Add numbered page labels to your PDF with a starting number and position.",
    metaDescription: "Free PDF page number tool. Add page numbers to PDFs online.",
    icon: Hash,
    accept: "application/pdf",
    multiple: false,
    helperText: "Choose the starting number and where the page number appears on each page.",
    howTo: [
      "Upload a PDF file.",
      "Set the starting page number and display position.",
      "Click Add Page Numbers and download the numbered file.",
    ],
    tips: [
      "Start at 1 for new documents or use a later number for appendix sections.",
      "Bottom-right is the safest default for most document layouts.",
      "Top-center is useful for internal review documents and printouts.",
    ],
  },
  "pdf-header-footer": {
    slug: "pdf-header-footer",
    title: "PDF Header & Footer",
    description: "Add repeated header and footer text across every page in your PDF.",
    metaDescription: "Free PDF header and footer tool. Add headers and footers to PDFs.",
    icon: Type,
    accept: "application/pdf",
    multiple: false,
    helperText: "Use a short header, footer, or both. Common examples are company names, dates, and version labels.",
    howTo: [
      "Upload a PDF file.",
      "Enter the header text, footer text, or both.",
      "Click Add Header/Footer and download the updated PDF.",
    ],
    tips: [
      "Short repeated text usually works better than long paragraphs.",
      "Headers are best for titles or department labels.",
      "Footers work well for notices, dates, and internal version text.",
    ],
  },
  "pdf-sign": {
    slug: "pdf-sign",
    title: "PDF Signature Tool",
    description: "Stamp a typed signature or signature image onto the last page of a PDF.",
    metaDescription: "Free PDF signature tool. Sign PDF documents online in your browser.",
    icon: FileSignature,
    accept: "application/pdf",
    multiple: false,
    helperText: "Use a typed name, an uploaded PNG/JPG signature image, or both.",
    howTo: [
      "Upload the PDF you want to sign.",
      "Add a typed signature name or upload a signature image.",
      "Click Sign PDF and download the stamped version.",
    ],
    tips: [
      "This adds a visible signature mark. It is not a cryptographic digital signature.",
      "Transparent PNG signatures usually look cleaner than JPG images.",
      "This first version stamps the last page, which works well for approval sheets.",
    ],
  },
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function fileStem(name: string): string {
  const index = name.lastIndexOf(".");
  return index > 0 ? name.slice(0, index) : name;
}

function parsePositiveInteger(value: string, fallback = 1): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function buildRangeError(pageCount: number): Error {
  return new Error(`Use page numbers between 1 and ${pageCount}.`);
}

function parsePageSelection(spec: string, pageCount: number, allowAll = true): number[] {
  const trimmed = spec.trim().toLowerCase();
  if (allowAll && (!trimmed || trimmed === "all")) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages: number[] = [];
  const seen = new Set<number>();

  for (const rawToken of spec.split(",")) {
    const token = rawToken.trim();
    if (!token) continue;

    if (token.includes("-")) {
      const [startRaw, endRaw] = token.split("-");
      const start = Number(startRaw);
      const end = Number(endRaw);
      if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < 1 || start > end || end > pageCount) {
        throw buildRangeError(pageCount);
      }
      for (let page = start; page <= end; page += 1) {
        if (!seen.has(page)) {
          seen.add(page);
          pages.push(page);
        }
      }
      continue;
    }

    const value = Number(token);
    if (!Number.isInteger(value) || value < 1 || value > pageCount) {
      throw buildRangeError(pageCount);
    }
    if (!seen.has(value)) {
      seen.add(value);
      pages.push(value);
    }
  }

  if (pages.length === 0) {
    throw new Error("Enter at least one valid page number.");
  }

  return pages;
}

function parseSplitGroups(spec: string, pageCount: number): number[][] {
  const groups = spec
    .split(";")
    .map((group) => group.trim())
    .filter(Boolean);

  if (groups.length === 0) {
    throw new Error("Enter at least one page group. Example: 1-2; 3-5; 6.");
  }

  return groups.map((group) => parsePageSelection(group, pageCount, false));
}

function parseExactPageOrder(spec: string, pageCount: number): number[] {
  const order = parsePageSelection(spec, pageCount, false);
  if (order.length !== pageCount) {
    throw new Error(`Enter every page exactly once. This file has ${pageCount} pages.`);
  }
  return order;
}

function getTextCoordinates(
  pageWidth: number,
  pageHeight: number,
  textWidth: number,
  fontSize: number,
  position: Position,
) {
  const margin = 24;

  switch (position) {
    case "top-left":
      return { x: margin, y: pageHeight - margin - fontSize };
    case "top-center":
      return { x: (pageWidth - textWidth) / 2, y: pageHeight - margin - fontSize };
    case "top-right":
      return { x: pageWidth - margin - textWidth, y: pageHeight - margin - fontSize };
    case "center":
      return { x: (pageWidth - textWidth) / 2, y: pageHeight / 2 - fontSize / 2 };
    case "bottom-left":
      return { x: margin, y: margin };
    case "bottom-center":
      return { x: (pageWidth - textWidth) / 2, y: margin };
    case "bottom-right":
    default:
      return { x: pageWidth - margin - textWidth, y: margin };
  }
}

async function embedImage(pdfDoc: PDFDocument, file: File) {
  const bytes = await file.arrayBuffer();
  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg") || file.type === "image/jpeg") {
    return pdfDoc.embedJpg(bytes);
  }

  if (lowerName.endsWith(".png") || file.type === "image/png") {
    return pdfDoc.embedPng(bytes);
  }

  throw new Error("Only JPG and PNG images are supported in this release.");
}

function readUint32BigEndian(bytes: Uint8Array, offset: number): number {
  return ((bytes[offset] << 24) >>> 0) + (bytes[offset + 1] << 16) + (bytes[offset + 2] << 8) + bytes[offset + 3];
}

function decodePdfLiteralText(value: string): string {
  let output = "";
  for (let index = 0; index < value.length; index += 1) {
    const current = value[index];
    if (current !== "\\") {
      output += current;
      continue;
    }

    const next = value[index + 1];
    if (!next) break;

    if (next === "n") output += "\n";
    else if (next === "r") output += "\r";
    else if (next === "t") output += "\t";
    else if (next === "b") output += "\b";
    else if (next === "f") output += "\f";
    else if (next === "(" || next === ")" || next === "\\") output += next;
    else if (/[0-7]/.test(next)) {
      const octal = value.slice(index + 1, index + 4).match(/^[0-7]{1,3}/)?.[0] ?? next;
      output += String.fromCharCode(parseInt(octal, 8));
      index += octal.length - 1;
    } else {
      output += next;
    }

    index += 1;
  }

  return output;
}

function extractLikelyPdfText(bytes: Uint8Array): string[] {
  const raw = new TextDecoder("latin1").decode(bytes);
  const extracted: string[] = [];

  const literalMatches = raw.matchAll(/\(([^()\\]*(?:\\.[^()\\]*)*)\)\s*T[Jj]/g);
  for (const match of literalMatches) {
    const decoded = decodePdfLiteralText(match[1]).replace(/\s+/g, " ").trim();
    if (decoded.length >= 2) extracted.push(decoded);
  }

  const hexMatches = raw.matchAll(/<([0-9A-Fa-f]{4,})>\s*T[Jj]/g);
  for (const match of hexMatches) {
    const hex = match[1].length % 2 === 0 ? match[1] : `${match[1]}0`;
    const bytesArray = new Uint8Array(hex.length / 2);
    for (let idx = 0; idx < hex.length; idx += 2) {
      bytesArray[idx / 2] = Number.parseInt(hex.slice(idx, idx + 2), 16);
    }
    const decoded = new TextDecoder("utf-8", { fatal: false }).decode(bytesArray).replace(/\s+/g, " ").trim();
    if (decoded.length >= 2) extracted.push(decoded);
  }

  const unique = Array.from(new Set(extracted));
  return unique.filter((line) => /[A-Za-z0-9]/.test(line));
}

function extractEmbeddedImagesFromPdf(bytes: Uint8Array): Array<{ blob: Blob; extension: "jpg" | "png" }> {
  const images: Array<{ blob: Blob; extension: "jpg" | "png" }> = [];

  for (let index = 0; index < bytes.length - 1; index += 1) {
    if (bytes[index] === 0xff && bytes[index + 1] === 0xd8) {
      const start = index;
      index += 2;
      while (index < bytes.length - 1 && !(bytes[index] === 0xff && bytes[index + 1] === 0xd9)) {
        index += 1;
      }
      if (index < bytes.length - 1) {
        const end = index + 2;
        if (end - start > 512) {
          images.push({
            blob: new Blob([bytes.slice(start, end)], { type: "image/jpeg" }),
            extension: "jpg",
          });
        }
        index = end - 1;
      }
    }
  }

  const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let index = 0; index < bytes.length - pngSignature.length; index += 1) {
    const matchesSignature = pngSignature.every((value, offset) => bytes[index + offset] === value);
    if (!matchesSignature) continue;

    const start = index;
    let cursor = index + pngSignature.length;
    let isValid = false;

    while (cursor + 8 <= bytes.length) {
      const chunkLength = readUint32BigEndian(bytes, cursor);
      const chunkType = String.fromCharCode(
        bytes[cursor + 4],
        bytes[cursor + 5],
        bytes[cursor + 6],
        bytes[cursor + 7],
      );
      const nextCursor = cursor + 8 + chunkLength + 4;
      if (nextCursor > bytes.length) break;
      cursor = nextCursor;

      if (chunkType === "IEND") {
        isValid = true;
        break;
      }
    }

    if (isValid && cursor - start > 128) {
      images.push({
        blob: new Blob([bytes.slice(start, cursor)], { type: "image/png" }),
        extension: "png",
      });
      index = cursor - 1;
    }
  }

  return images;
}

async function convertImageBlob(blob: Blob, format: "jpg" | "png"): Promise<Blob> {
  if (format === "jpg" && blob.type === "image/jpeg") return blob;
  if (format === "png" && blob.type === "image/png") return blob;

  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Unable to convert extracted image."));
      img.src = objectUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is unavailable in this browser.");
    if (format === "jpg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(image, 0, 0);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (nextBlob) => (nextBlob ? resolve(nextBlob) : reject(new Error("Could not generate output image."))),
        format === "jpg" ? "image/jpeg" : "image/png",
        0.92,
      );
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function processPdfTool(
  slug: string,
  files: File[],
  settings: Record<string, string>,
  signatureFile: File | null,
): Promise<ProcessResult> {
  if (slug === "pdf-merge") {
    if (files.length < 2) throw new Error("Upload at least two PDF files to merge.");

    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      const sourcePdf = await PDFDocument.load(await file.arrayBuffer());
      const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
      copiedPages.forEach((page: PDFPage) => mergedPdf.addPage(page));
    }

    const outputBytes = await mergedPdf.save();
    return {
      outputs: [
        {
          name: "merged-document.pdf",
          blob: new Blob([outputBytes], { type: "application/pdf" }),
          note: `${files.length} source PDFs merged into one file.`,
        },
      ],
      summary: `Merged ${files.length} PDF files into a single document.`,
    };
  }

  if (slug === "pdf-split") {
    if (files.length !== 1) throw new Error("Upload one PDF file to split.");

    const sourceFile = files[0];
    const sourcePdf = await PDFDocument.load(await sourceFile.arrayBuffer());
    const groups = parseSplitGroups(settings.splitGroups || "", sourcePdf.getPageCount());

    const outputs: OutputFile[] = [];
    for (let index = 0; index < groups.length; index += 1) {
      const pages = groups[index];
      const partPdf = await PDFDocument.create();
      const copiedPages = await partPdf.copyPages(
        sourcePdf,
        pages.map((page) => page - 1),
      );
      copiedPages.forEach((page: PDFPage) => partPdf.addPage(page));
      const bytes = await partPdf.save();
      outputs.push({
        name: `${fileStem(sourceFile.name)}-part-${index + 1}.pdf`,
        blob: new Blob([bytes], { type: "application/pdf" }),
        note: `Pages ${pages.join(", ")}.`,
      });
    }

    return {
      outputs,
      summary: `Created ${outputs.length} split PDF file${outputs.length === 1 ? "" : "s"} from ${sourceFile.name}.`,
    };
  }

  if (slug === "pdf-compress") {
    if (files.length !== 1) throw new Error("Upload one PDF file to compress.");

    const sourceFile = files[0];
    const sourceBytes = await sourceFile.arrayBuffer();
    const sourcePdf = await PDFDocument.load(sourceBytes);
    const profile = settings.compressProfile || "balanced";

    const saveOptions: Record<string, unknown> = {};
    if (profile === "maximum") {
      saveOptions.useObjectStreams = true;
      saveOptions.objectsPerTick = 1000;
    } else if (profile === "balanced") {
      saveOptions.useObjectStreams = true;
      saveOptions.objectsPerTick = 200;
    } else {
      saveOptions.useObjectStreams = false;
      saveOptions.objectsPerTick = 100;
    }

    const compressedBytes = await (sourcePdf as unknown as { save: (opts?: Record<string, unknown>) => Promise<ArrayBuffer> }).save(saveOptions);
    const inputSize = sourceFile.size;
    const outputSize = compressedBytes.byteLength;
    const deltaPercent = inputSize === 0 ? 0 : ((inputSize - outputSize) / inputSize) * 100;
    const direction = deltaPercent >= 0 ? "reduced" : "increased";
    const absolutePercent = Math.abs(deltaPercent).toFixed(2);

    return {
      outputs: [
        {
          name: `${fileStem(sourceFile.name)}-compressed.pdf`,
          blob: new Blob([compressedBytes], { type: "application/pdf" }),
          note: `Input ${formatBytes(inputSize)} -> output ${formatBytes(outputSize)} (${direction} by ${absolutePercent}%).`,
        },
      ],
      summary: `Compression ${direction} file size by ${absolutePercent}% using ${profile} profile.`,
    };
  }

  if (slug === "pdf-to-image") {
    if (files.length !== 1) throw new Error("Upload one PDF file to extract images.");

    const sourceFile = files[0];
    const sourceBytes = new Uint8Array(await sourceFile.arrayBuffer());
    const format = (settings.imageFormat || "original") as "original" | "jpg" | "png";
    const extracted = extractEmbeddedImagesFromPdf(sourceBytes);

    if (extracted.length === 0) {
      throw new Error("No embedded raster images were found in this PDF. This browser version extracts embedded JPG/PNG assets.");
    }

    const outputs: OutputFile[] = [];
    for (let index = 0; index < extracted.length; index += 1) {
      const image = extracted[index];
      let blob = image.blob;
      let extension = image.extension;

      if (format !== "original") {
        blob = await convertImageBlob(image.blob, format);
        extension = format;
      }

      outputs.push({
        name: `${fileStem(sourceFile.name)}-image-${index + 1}.${extension}`,
        blob,
        note: `Extracted embedded ${image.extension.toUpperCase()} asset${format !== "original" ? ` and converted to ${format.toUpperCase()}` : ""}.`,
      });
    }

    return {
      outputs,
      summary: `Extracted ${outputs.length} embedded image${outputs.length === 1 ? "" : "s"} from the PDF.`,
    };
  }

  if (slug === "pdf-to-text") {
    if (files.length !== 1) throw new Error("Upload one PDF file to extract text.");

    const sourceFile = files[0];
    const sourceBytes = new Uint8Array(await sourceFile.arrayBuffer());
    const preserveLineBreaks = settings.textFlowMode === "raw";
    const lines = extractLikelyPdfText(sourceBytes);

    if (lines.length === 0) {
      throw new Error("No readable text blocks were extracted. This file may be image-only and require OCR.");
    }

    const text = preserveLineBreaks ? lines.join("\n") : lines.join("\n\n");
    const textBlob = new Blob([text], { type: "text/plain;charset=utf-8" });
    return {
      outputs: [
        {
          name: `${fileStem(sourceFile.name)}.txt`,
          blob: textBlob,
          note: `Extracted ${lines.length} unique text segment${lines.length === 1 ? "" : "s"}.`,
        },
      ],
      summary: `Text extraction completed with ${lines.length} readable segment${lines.length === 1 ? "" : "s"}.`,
    };
  }

  if (slug === "pdf-password-protect") {
    if (files.length !== 1) throw new Error("Upload one PDF file to protect.");

    const sourceFile = files[0];
    const userPassword = (settings.userPassword || "").trim();
    const ownerPassword = (settings.ownerPassword || userPassword).trim();

    if (userPassword.length < 4) {
      throw new Error("Enter a user password with at least 4 characters.");
    }

    let protectedBytes: ArrayBuffer;
    try {
      const sourcePdf = await (PDFDocument as unknown as { load: (bytes: ArrayBuffer, options?: Record<string, unknown>) => Promise<PDFDocument> }).load(
        await sourceFile.arrayBuffer(),
        { ignoreEncryption: true },
      );

      protectedBytes = await (sourcePdf as unknown as { save: (options?: Record<string, unknown>) => Promise<ArrayBuffer> }).save({
        useObjectStreams: true,
        userPassword,
        ownerPassword,
        permissions: {
          printing: "highResolution",
          modifying: false,
          copying: false,
          annotating: false,
          fillingForms: true,
          contentAccessibility: true,
          documentAssembly: false,
        },
      });
    } catch {
      throw new Error("PDF password encryption is not available in this browser runtime for the selected file.");
    }

    const serialized = new TextDecoder("latin1").decode(new Uint8Array(protectedBytes));
    if (!serialized.includes("/Encrypt")) {
      throw new Error("Encryption could not be verified in the generated PDF. Try another browser/runtime.");
    }

    return {
      outputs: [
        {
          name: `${fileStem(sourceFile.name)}-protected.pdf`,
          blob: new Blob([protectedBytes], { type: "application/pdf" }),
          note: "Applied password protection and saved an encrypted PDF copy.",
        },
      ],
      summary: "PDF password protection was applied successfully.",
    };
  }

  if (slug === "pdf-unlock") {
    if (files.length !== 1) throw new Error("Upload one PDF file to unlock.");

    const sourceFile = files[0];
    const password = (settings.unlockPassword || "").trim();
    if (!password) throw new Error("Enter the PDF password to continue.");

    let unlockedBytes: ArrayBuffer;
    try {
      const sourcePdf = await (PDFDocument as unknown as { load: (bytes: ArrayBuffer, options?: Record<string, unknown>) => Promise<PDFDocument> }).load(
        await sourceFile.arrayBuffer(),
        { password },
      );
      unlockedBytes = await (sourcePdf as unknown as { save: (options?: Record<string, unknown>) => Promise<ArrayBuffer> }).save({
        useObjectStreams: true,
      });
    } catch {
      throw new Error("Could not unlock this PDF. Check the password and browser encryption support.");
    }

    const serialized = new TextDecoder("latin1").decode(new Uint8Array(unlockedBytes));
    if (serialized.includes("/Encrypt")) {
      throw new Error("The output still appears encrypted. This encryption mode is not fully supported in this runtime.");
    }

    return {
      outputs: [
        {
          name: `${fileStem(sourceFile.name)}-unlocked.pdf`,
          blob: new Blob([unlockedBytes], { type: "application/pdf" }),
          note: "Removed open-password protection and rebuilt the PDF.",
        },
      ],
      summary: "PDF unlock completed and an unencrypted copy is ready.",
    };
  }

  if (slug === "image-to-pdf" || slug === "jpg-to-pdf") {
    if (files.length === 0) throw new Error("Upload at least one image.");

    const pdfDoc = await PDFDocument.create();
    for (const file of files) {
      const embedded = await embedImage(pdfDoc, file);
      const dimensions = embedded.scale(1);
      const page = pdfDoc.addPage([dimensions.width, dimensions.height]);
      page.drawImage(embedded, {
        x: 0,
        y: 0,
        width: dimensions.width,
        height: dimensions.height,
      });
    }

    const outputBytes = await pdfDoc.save();
    const outputName = slug === "jpg-to-pdf" ? "jpg-to-pdf.pdf" : "image-to-pdf.pdf";
    return {
      outputs: [
        {
          name: outputName,
          blob: new Blob([outputBytes], { type: "application/pdf" }),
          note: `${files.length} image${files.length === 1 ? "" : "s"} converted into a PDF.`,
        },
      ],
      summary: `Built a ${files.length}-page PDF from your uploaded image${files.length === 1 ? "" : "s"}.`,
    };
  }

  if (
    slug === "pdf-rotate" ||
    slug === "pdf-page-remover" ||
    slug === "pdf-page-reorder" ||
    slug === "pdf-watermark" ||
    slug === "pdf-page-number" ||
    slug === "pdf-header-footer" ||
    slug === "pdf-sign"
  ) {
    if (files.length !== 1) throw new Error("Upload one PDF file to continue.");

    const sourceFile = files[0];
    const sourcePdf = await PDFDocument.load(await sourceFile.arrayBuffer());
    const pageCount = sourcePdf.getPageCount();

    if (slug === "pdf-rotate") {
      const rotateAmount = Number(settings.rotateAmount || "90");
      const selectedPages = parsePageSelection(settings.rotatePages || "all", pageCount, true);
      selectedPages.forEach((pageNumber) => {
        const page = sourcePdf.getPage(pageNumber - 1);
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + rotateAmount) % 360));
      });
      const bytes = await sourcePdf.save();
      return {
        outputs: [
          {
            name: `${fileStem(sourceFile.name)}-rotated.pdf`,
            blob: new Blob([bytes], { type: "application/pdf" }),
            note: `Rotated ${selectedPages.length} page${selectedPages.length === 1 ? "" : "s"} by ${rotateAmount} degrees.`,
          },
        ],
        summary: `Rotated ${selectedPages.length} selected page${selectedPages.length === 1 ? "" : "s"}.`,
      };
    }

    if (slug === "pdf-page-remover") {
      const pagesToRemove = parsePageSelection(settings.removePages || "", pageCount, false).sort((a, b) => b - a);
      if (pagesToRemove.length >= pageCount) {
        throw new Error("At least one page must remain after removal.");
      }
      pagesToRemove.forEach((pageNumber) => sourcePdf.removePage(pageNumber - 1));
      const bytes = await sourcePdf.save();
      return {
        outputs: [
          {
            name: `${fileStem(sourceFile.name)}-trimmed.pdf`,
            blob: new Blob([bytes], { type: "application/pdf" }),
            note: `Removed ${pagesToRemove.length} page${pagesToRemove.length === 1 ? "" : "s"}.`,
          },
        ],
        summary: `Removed the selected pages and rebuilt the PDF.`,
      };
    }

    if (slug === "pdf-page-reorder") {
      const order = parseExactPageOrder(settings.reorderPages || "", pageCount);
      const outputPdf = await PDFDocument.create();
      const copiedPages = await outputPdf.copyPages(
        sourcePdf,
        order.map((page) => page - 1),
      );
      copiedPages.forEach((page: PDFPage) => outputPdf.addPage(page));
      const bytes = await outputPdf.save();
      return {
        outputs: [
          {
            name: `${fileStem(sourceFile.name)}-reordered.pdf`,
            blob: new Blob([bytes], { type: "application/pdf" }),
            note: `Applied page order: ${order.join(", ")}.`,
          },
        ],
        summary: `Reordered all ${pageCount} pages into a new sequence.`,
      };
    }

    const font = await sourcePdf.embedFont(StandardFonts.Helvetica);
    const pages = sourcePdf.getPages();

    if (slug === "pdf-watermark") {
      const watermarkText = (settings.watermarkText || "").trim();
      if (!watermarkText) throw new Error("Enter watermark text before processing.");
      const opacity = Math.max(0.05, Math.min(0.9, Number(settings.watermarkOpacity || "0.2")));
      const watermarkMode = settings.watermarkMode || "diagonal";

      for (const page of pages) {
        const { width, height } = page.getSize();
        const fontSize = Math.max(24, Math.min(56, width / 9));
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);

        if (watermarkMode === "diagonal") {
          page.drawText(watermarkText, {
            x: (width - textWidth) / 2,
            y: height / 2,
            size: fontSize,
            font,
            color: rgb(0.78, 0.1, 0.2),
            opacity,
            rotate: degrees(45),
          });
        } else {
          const position = watermarkMode === "footer" ? "bottom-center" : "center";
          const coords = getTextCoordinates(width, height, textWidth, fontSize, position);
          page.drawText(watermarkText, {
            x: coords.x,
            y: coords.y,
            size: fontSize,
            font,
            color: rgb(0.78, 0.1, 0.2),
            opacity,
          });
        }
      }

      const bytes = await sourcePdf.save();
      return {
        outputs: [
          {
            name: `${fileStem(sourceFile.name)}-watermarked.pdf`,
            blob: new Blob([bytes], { type: "application/pdf" }),
            note: `Added "${watermarkText}" across ${pageCount} page${pageCount === 1 ? "" : "s"}.`,
          },
        ],
        summary: "Applied a visible text watermark to the PDF.",
      };
    }

    if (slug === "pdf-page-number") {
      const startingNumber = parsePositiveInteger(settings.pageNumberStart || "1", 1);
      const position = (settings.pageNumberPosition || "bottom-right") as Position;
      pages.forEach((page: PDFPage, index: number) => {
        const pageNumberText = String(startingNumber + index);
        const { width, height } = page.getSize();
        const fontSize = 11;
        const textWidth = font.widthOfTextAtSize(pageNumberText, fontSize);
        const coords = getTextCoordinates(width, height, textWidth, fontSize, position);
        page.drawText(pageNumberText, {
          x: coords.x,
          y: coords.y,
          size: fontSize,
          font,
          color: rgb(0.22, 0.22, 0.22),
        });
      });
      const bytes = await sourcePdf.save();
      return {
        outputs: [
          {
            name: `${fileStem(sourceFile.name)}-numbered.pdf`,
            blob: new Blob([bytes], { type: "application/pdf" }),
            note: `Added page numbers starting from ${startingNumber}.`,
          },
        ],
        summary: `Numbered all ${pageCount} pages in the selected position.`,
      };
    }

    if (slug === "pdf-header-footer") {
      const headerText = (settings.headerText || "").trim();
      const footerText = (settings.footerText || "").trim();
      if (!headerText && !footerText) {
        throw new Error("Enter header text, footer text, or both.");
      }

      pages.forEach((page: PDFPage) => {
        const { width, height } = page.getSize();
        const fontSize = 10;

        if (headerText) {
          const textWidth = font.widthOfTextAtSize(headerText, fontSize);
          const coords = getTextCoordinates(width, height, textWidth, fontSize, "top-center");
          page.drawText(headerText, {
            x: coords.x,
            y: coords.y,
            size: fontSize,
            font,
            color: rgb(0.18, 0.18, 0.18),
          });
        }

        if (footerText) {
          const textWidth = font.widthOfTextAtSize(footerText, fontSize);
          const coords = getTextCoordinates(width, height, textWidth, fontSize, "bottom-center");
          page.drawText(footerText, {
            x: coords.x,
            y: coords.y,
            size: fontSize,
            font,
            color: rgb(0.18, 0.18, 0.18),
          });
        }
      });

      const bytes = await sourcePdf.save();
      return {
        outputs: [
          {
            name: `${fileStem(sourceFile.name)}-header-footer.pdf`,
            blob: new Blob([bytes], { type: "application/pdf" }),
            note: "Applied repeated header and footer text to every page.",
          },
        ],
        summary: "Added repeated header/footer text across the document.",
      };
    }

    if (slug === "pdf-sign") {
      const signerName = (settings.signatureName || "").trim();
      if (!signerName && !signatureFile) {
        throw new Error("Enter a typed signature name or upload a signature image.");
      }

      const lastPage = pages[pages.length - 1];
      const { width, height } = lastPage.getSize();
      const position = (settings.signaturePosition || "bottom-right") as Position;
      const targetBoxWidth = 160;
      const targetBoxHeight = 60;

      if (signatureFile) {
        const embeddedSignature = await embedImage(sourcePdf, signatureFile);
        const scale = Math.min(
          targetBoxWidth / embeddedSignature.width,
          targetBoxHeight / embeddedSignature.height,
        );
        const drawWidth = embeddedSignature.width * scale;
        const drawHeight = embeddedSignature.height * scale;
        const coords = getTextCoordinates(width, height, drawWidth, drawHeight, position);
        lastPage.drawImage(embeddedSignature, {
          x: coords.x,
          y: coords.y,
          width: drawWidth,
          height: drawHeight,
        });
      } else {
        const fontSize = 22;
        const textWidth = font.widthOfTextAtSize(signerName, fontSize);
        const coords = getTextCoordinates(width, height, textWidth, fontSize, position);
        lastPage.drawText(signerName, {
          x: coords.x,
          y: coords.y,
          size: fontSize,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });
      }

      const bytes = await sourcePdf.save();
      return {
        outputs: [
          {
            name: `${fileStem(sourceFile.name)}-signed.pdf`,
            blob: new Blob([bytes], { type: "application/pdf" }),
            note: "Stamped the last page with a visible signature mark.",
          },
        ],
        summary: "Added a visible signature mark to the final page.",
      };
    }
  }

  throw new Error("Unsupported PDF tool configuration.");
}

function buildInitialSettings(slug: string): Record<string, string> {
  switch (slug) {
    case "pdf-split":
      return { splitGroups: "1; 2" };
    case "pdf-compress":
      return { compressProfile: "balanced" };
    case "pdf-to-image":
      return { imageFormat: "original" };
    case "pdf-rotate":
      return { rotateAmount: "90", rotatePages: "all" };
    case "pdf-page-remover":
      return { removePages: "2" };
    case "pdf-page-reorder":
      return { reorderPages: "1,2,3" };
    case "pdf-watermark":
      return { watermarkText: "CONFIDENTIAL", watermarkOpacity: "0.2", watermarkMode: "diagonal" };
    case "pdf-password-protect":
      return { userPassword: "", ownerPassword: "" };
    case "pdf-unlock":
      return { unlockPassword: "" };
    case "pdf-to-text":
      return { textFlowMode: "normalized" };
    case "pdf-page-number":
      return { pageNumberStart: "1", pageNumberPosition: "bottom-right" };
    case "pdf-header-footer":
      return { headerText: "Internal Draft", footerText: "For review only" };
    case "pdf-sign":
      return { signatureName: "Approved", signaturePosition: "bottom-right" };
    default:
      return {};
  }
}

function renderToolSpecificFields(
  slug: string,
  settings: Record<string, string>,
  setSettings: Dispatch<SetStateAction<Record<string, string>>>,
) {
  const update = (key: string, value: string) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };
  const fieldLabelClass = "text-[11px] font-black uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400";
  const fieldInputClass =
    "w-full h-11 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white/95 dark:bg-slate-900 px-3 text-[14px] font-semibold text-foreground shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15";
  const fieldSelectClass = `${fieldInputClass} cursor-pointer`;

  switch (slug) {
    case "pdf-split":
      return (
        <label className="space-y-1.5">
          <span className={fieldLabelClass}>Page groups</span>
          <input
            type="text"
            className={fieldInputClass}
            value={settings.splitGroups ?? ""}
            onChange={(event) => update("splitGroups", event.target.value)}
            placeholder="1-2; 3-5; 6"
          />
        </label>
      );
    case "pdf-compress":
      return (
        <label className="space-y-1.5">
          <span className={fieldLabelClass}>Compression profile</span>
          <select
            className={fieldSelectClass}
            value={settings.compressProfile ?? "balanced"}
            onChange={(event) => update("compressProfile", event.target.value)}
          >
            <option value="light">Light (higher compatibility)</option>
            <option value="balanced">Balanced</option>
            <option value="maximum">Maximum (smallest size goal)</option>
          </select>
        </label>
      );
    case "pdf-to-image":
      return (
        <label className="space-y-1.5">
          <span className={fieldLabelClass}>Output image format</span>
          <select
            className={fieldSelectClass}
            value={settings.imageFormat ?? "original"}
            onChange={(event) => update("imageFormat", event.target.value)}
          >
            <option value="original">Keep original embedded format</option>
            <option value="jpg">Convert all to JPG</option>
            <option value="png">Convert all to PNG</option>
          </select>
        </label>
      );
    case "pdf-rotate":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="space-y-1.5">
            <span className={fieldLabelClass}>Rotate by</span>
            <select
              className={fieldSelectClass}
              value={settings.rotateAmount ?? "90"}
              onChange={(event) => update("rotateAmount", event.target.value)}
            >
              <option value="90">90 degrees</option>
              <option value="180">180 degrees</option>
              <option value="270">270 degrees</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className={fieldLabelClass}>Pages</span>
            <input
              type="text"
              className={fieldInputClass}
              value={settings.rotatePages ?? "all"}
              onChange={(event) => update("rotatePages", event.target.value)}
              placeholder="all or 1,3,5-7"
            />
          </label>
        </div>
      );
    case "pdf-page-remover":
      return (
        <label className="space-y-1.5">
          <span className={fieldLabelClass}>Pages to remove</span>
          <input
            type="text"
            className={fieldInputClass}
            value={settings.removePages ?? ""}
            onChange={(event) => update("removePages", event.target.value)}
            placeholder="2,4,8-10"
          />
        </label>
      );
    case "pdf-page-reorder":
      return (
        <label className="space-y-1.5">
          <span className={fieldLabelClass}>New page order</span>
          <input
            type="text"
            className={fieldInputClass}
            value={settings.reorderPages ?? ""}
            onChange={(event) => update("reorderPages", event.target.value)}
            placeholder="3,1,2,4"
          />
        </label>
      );
    case "pdf-watermark":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="space-y-1.5 sm:col-span-2">
            <span className={fieldLabelClass}>Watermark text</span>
            <input
              type="text"
              className={fieldInputClass}
              value={settings.watermarkText ?? ""}
              onChange={(event) => update("watermarkText", event.target.value)}
              placeholder="CONFIDENTIAL"
            />
          </label>
          <label className="space-y-1.5">
            <span className={fieldLabelClass}>Opacity</span>
            <input
              type="number"
              min="0.05"
              max="0.9"
              step="0.05"
              className={fieldInputClass}
              value={settings.watermarkOpacity ?? "0.2"}
              onChange={(event) => update("watermarkOpacity", event.target.value)}
            />
          </label>
          <label className="space-y-1.5">
            <span className={fieldLabelClass}>Placement</span>
            <select
              className={fieldSelectClass}
              value={settings.watermarkMode ?? "diagonal"}
              onChange={(event) => update("watermarkMode", event.target.value)}
            >
              <option value="diagonal">Diagonal</option>
              <option value="center">Center</option>
              <option value="footer">Footer</option>
            </select>
          </label>
        </div>
      );
    case "pdf-password-protect":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="space-y-1.5">
            <span className={fieldLabelClass}>User password</span>
            <input
              type="password"
              className={fieldInputClass}
              value={settings.userPassword ?? ""}
              onChange={(event) => update("userPassword", event.target.value)}
              placeholder="Required to open file"
            />
          </label>
          <label className="space-y-1.5">
            <span className={fieldLabelClass}>Owner password (optional)</span>
            <input
              type="password"
              className={fieldInputClass}
              value={settings.ownerPassword ?? ""}
              onChange={(event) => update("ownerPassword", event.target.value)}
              placeholder="Optional permissions password"
            />
          </label>
        </div>
      );
    case "pdf-unlock":
      return (
        <label className="space-y-1.5">
          <span className={fieldLabelClass}>Current PDF password</span>
          <input
            type="password"
            className={fieldInputClass}
            value={settings.unlockPassword ?? ""}
            onChange={(event) => update("unlockPassword", event.target.value)}
            placeholder="Enter password to unlock"
          />
        </label>
      );
    case "pdf-to-text":
      return (
        <label className="space-y-1.5">
          <span className={fieldLabelClass}>Text flow mode</span>
          <select
            className={fieldSelectClass}
            value={settings.textFlowMode ?? "normalized"}
            onChange={(event) => update("textFlowMode", event.target.value)}
          >
            <option value="normalized">Normalized paragraphs</option>
            <option value="raw">Raw line-by-line</option>
          </select>
        </label>
      );
    case "pdf-page-number":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="space-y-1.5">
            <span className={fieldLabelClass}>Starting number</span>
            <input
              type="number"
              min="1"
              className={fieldInputClass}
              value={settings.pageNumberStart ?? "1"}
              onChange={(event) => update("pageNumberStart", event.target.value)}
            />
          </label>
          <label className="space-y-1.5">
            <span className={fieldLabelClass}>Position</span>
            <select
              className={fieldSelectClass}
              value={settings.pageNumberPosition ?? "bottom-right"}
              onChange={(event) => update("pageNumberPosition", event.target.value)}
            >
              <option value="top-left">Top left</option>
              <option value="top-center">Top center</option>
              <option value="top-right">Top right</option>
              <option value="bottom-left">Bottom left</option>
              <option value="bottom-center">Bottom center</option>
              <option value="bottom-right">Bottom right</option>
            </select>
          </label>
        </div>
      );
    case "pdf-header-footer":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="space-y-1.5">
            <span className={fieldLabelClass}>Header text</span>
            <input
              type="text"
              className={fieldInputClass}
              value={settings.headerText ?? ""}
              onChange={(event) => update("headerText", event.target.value)}
              placeholder="Internal Draft"
            />
          </label>
          <label className="space-y-1.5">
            <span className={fieldLabelClass}>Footer text</span>
            <input
              type="text"
              className={fieldInputClass}
              value={settings.footerText ?? ""}
              onChange={(event) => update("footerText", event.target.value)}
              placeholder="For review only"
            />
          </label>
        </div>
      );
    case "pdf-sign":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="space-y-1.5">
            <span className={fieldLabelClass}>Typed signature name</span>
            <input
              type="text"
              className={fieldInputClass}
              value={settings.signatureName ?? ""}
              onChange={(event) => update("signatureName", event.target.value)}
              placeholder="Approved"
            />
          </label>
          <label className="space-y-1.5">
            <span className={fieldLabelClass}>Placement</span>
            <select
              className={fieldSelectClass}
              value={settings.signaturePosition ?? "bottom-right"}
              onChange={(event) => update("signaturePosition", event.target.value)}
            >
              <option value="bottom-right">Bottom right</option>
              <option value="bottom-center">Bottom center</option>
              <option value="bottom-left">Bottom left</option>
              <option value="top-right">Top right</option>
            </select>
          </label>
        </div>
      );
    default:
      return null;
  }
}

export default function PdfToolSuite() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [location, setLocation] = useLocation();
  const resolvedSlug = resolveToolSlug(slug) ?? slug;
  const suiteConfig = PDF_TOOL_CONFIGS[resolvedSlug];
  const tool = getToolBySlug(slug);
  const config = suiteConfig;
  const processSlug = resolvedSlug;
  const isPdfTool = Boolean(tool && tool.category === "PDF Tools");
  const isSupported = Boolean(config && isPdfTool);
  const isRecentRedesign = RECENT_REDESIGN_PDF_SLUGS.has(resolvedSlug);

  const [files, setFiles] = useState<File[]>([]);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>(() => buildInitialSettings(resolvedSlug));
  const [outputs, setOutputs] = useState<OutputFile[]>([]);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setFiles([]);
    setSignatureFile(null);
    setSettings(buildInitialSettings(resolvedSlug));
    setOutputs([]);
    setSummary("");
    setError("");
  }, [resolvedSlug]);

  const relatedTools = useMemo(() => {
    if (!tool) return [];
    return getRelatedTools(tool.slug, tool.category, 6).filter((item) => Boolean(PDF_TOOL_CONFIGS[item.slug]));
  }, [tool]);

  const onThisPageItems = [
    "Calculator",
    "How to Use",
    "Result Interpretation",
    "Quick Examples",
    "Why Choose This",
    "FAQ",
  ];

  const destination = isPdfTool && tool ? getCanonicalToolPath(tool.slug) : undefined;

  useEffect(() => {
    if (!destination) return;
    if (location === destination) return;
    setLocation(destination, { replace: true });
  }, [destination, location, setLocation]);

  if (!config || !tool || !isSupported) {
    return <NotFound />;
  }

  const pageHeading = /^online\b/i.test(config.title) ? config.title : `Online ${config.title}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: pageHeading,
    description: config.metaDescription,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: `https://usonlinetools.com${getCanonicalToolPath(tool.slug)}`,
  };

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []);
    setFiles(nextFiles);
    setOutputs([]);
    setSummary("");
    setError("");
  };

  const handleSignatureFile = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    setSignatureFile(nextFile);
    setOutputs([]);
    setSummary("");
    setError("");
  };

  const runProcessor = async () => {
    setProcessing(true);
    setError("");
    setOutputs([]);
    setSummary("");

    try {
      const result = await processPdfTool(processSlug, files, settings, signatureFile);
      setOutputs(result.outputs);
      setSummary(result.summary);
    } catch (processError) {
      const message = processError instanceof Error ? processError.message : "Unable to process the selected files.";
      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  const Icon = config.icon;
  const faq = [
    {
      q: `Is this ${config.title.toLowerCase()} processed locally?`,
      a: "Yes. The current implementation runs in your browser, so your files stay on your device during processing.",
    },
    {
      q: "What file types are supported?",
      a: config.helperText,
    },
    {
      q: "Do all PDF tool pages here run as live processors?",
      a: "Yes. Every PDF slug in this category now maps to an active processor flow instead of a placeholder fallback.",
    },
    {
      q: "Will the output look exactly like the source file?",
      a: "For merge, split, rotate, reorder, and page removal, the output preserves existing pages. Tools that add content, such as watermarks or page numbers, modify the visible document by design.",
    },
  ];

  return (
    <Layout>
      <SEO title={pageHeading} description={config.metaDescription} canonical={`https://usonlinetools.com${getCanonicalToolPath(tool.slug)}`} schema={schema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-rose-500" strokeWidth={3} />
          <Link href="/category/pdf" className="text-muted-foreground hover:text-foreground transition-colors">
            PDF Tools
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 text-rose-500" strokeWidth={3} />
          <span className="text-foreground">{pageHeading}</span>
        </nav>

        <section className="rounded-2xl overflow-hidden border border-rose-500/15 bg-gradient-to-br from-rose-500/5 via-card to-red-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <FileImage className="w-3.5 h-3.5" />
            PDF Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            {pageHeading}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            {config.description} This page follows the same content-first layout as the stronger calculator pages, but the core action here is local file processing instead of numeric calculation.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20">
              <BadgeCheck className="w-3.5 h-3.5" /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs px-3 py-1.5 rounded-full border border-rose-500/20">
              <Zap className="w-3.5 h-3.5" /> Browser Processing
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20">
              <Lock className="w-3.5 h-3.5" /> No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-xs px-3 py-1.5 rounded-full border border-violet-500/20">
              <Shield className="w-3.5 h-3.5" /> Privacy First
            </span>
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs px-3 py-1.5 rounded-full border border-cyan-500/20">
              <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
            </span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">Category: PDF Tools | Last updated: March 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 min-w-0 space-y-10">
            <section id="calculator" className="space-y-5">
              <div className={`rounded-2xl overflow-hidden border shadow-lg ${isRecentRedesign ? "border-blue-500/20 shadow-blue-500/5" : "border-rose-500/20 shadow-rose-500/5"}`}>
                <div className={`h-1.5 w-full bg-gradient-to-r ${isRecentRedesign ? "from-blue-500 to-cyan-400" : "from-rose-500 to-red-400"}`} />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 ${isRecentRedesign ? "from-blue-500 to-cyan-400" : "from-rose-500 to-red-400"}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">PDF Workflow</p>
                      <p className="text-sm text-muted-foreground">Upload files, configure the tool, then download your output.</p>
                    </div>
                  </div>

                  <div className="tool-calc-card rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-gradient-to-b from-white/90 to-white/70 dark:from-slate-900/70 dark:to-slate-900/40 p-5 md:p-6" style={{ "--calc-hue": isRecentRedesign ? 210 : 350 } as CSSProperties}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-black tracking-tight text-foreground mb-2">1. Upload source file{config.multiple ? "s" : ""}</p>
                          <label className="block">
                            <div className={`w-full min-h-[132px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-2.5 cursor-pointer px-4 transition-colors ${isRecentRedesign ? "border-blue-500/35 bg-blue-500/5 hover:bg-blue-500/10" : "border-rose-500/35 bg-rose-500/5 hover:bg-rose-500/10"}`}>
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isRecentRedesign ? "bg-blue-500/12" : "bg-rose-500/12"}`}>
                                <Upload className={`w-5 h-5 ${isRecentRedesign ? "text-blue-500" : "text-rose-500"}`} />
                              </div>
                              <span className="text-sm font-bold text-foreground tracking-tight">
                                Choose {config.multiple ? "files" : "a file"}
                              </span>
                              <span className="text-xs text-muted-foreground leading-relaxed max-w-[320px]">{config.helperText}</span>
                            </div>
                            <input
                              type="file"
                              accept={config.accept}
                              multiple={config.multiple}
                              className="sr-only"
                              onChange={handleFiles}
                            />
                          </label>

                          {files.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {files.map((file) => (
                                <div key={`${file.name}-${file.size}`} className="rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white/80 dark:bg-slate-900/40 px-4 py-3 shadow-sm">
                                  <p className="text-sm font-bold text-foreground break-all">{file.name}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">{formatBytes(file.size)}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {slug === "pdf-sign" && (
                          <div>
                            <p className="text-sm font-black tracking-tight text-foreground mb-2">2. Optional signature image</p>
                            <label className="block">
                              <div className="w-full min-h-[92px] rounded-2xl border-2 border-dashed border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 transition-colors flex flex-col items-center justify-center text-center gap-2 px-4 cursor-pointer">
                                <FileSignature className={`w-5 h-5 ${isRecentRedesign ? "text-blue-500" : "text-rose-500"}`} />
                                <span className="text-sm font-bold text-foreground tracking-tight">Upload PNG or JPG signature</span>
                                <span className="text-xs text-muted-foreground">Optional. If omitted, typed signature text will be used.</span>
                              </div>
                              <input
                                type="file"
                                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                                className="sr-only"
                                onChange={handleSignatureFile}
                              />
                            </label>
                            {signatureFile && (
                              <div className="mt-3 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white/80 dark:bg-slate-900/40 px-4 py-3 shadow-sm">
                                <p className="text-sm font-bold text-foreground break-all">{signatureFile.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{formatBytes(signatureFile.size)}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-black tracking-tight text-foreground mb-2">2. Configure this tool</p>
                          <div className="space-y-3">
                            {renderToolSpecificFields(slug, settings, setSettings) ?? (
                              <div className="rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white/80 dark:bg-slate-900/40 px-4 py-3 text-sm text-muted-foreground">
                                No extra options are required for this tool. Upload your files and run it.
                              </div>
                            )}
                          </div>
                        </div>

                        <div className={`rounded-2xl border p-4 ${isRecentRedesign ? "border-blue-500/25 bg-blue-500/5" : "border-rose-500/25 bg-rose-500/5"}`}>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Output note</p>
                          <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                            Generated files are produced locally in your browser session. Nothing is uploaded to a server in this workflow.
                          </p>
                        </div>

                        <button
                          onClick={runProcessor}
                          disabled={processing || files.length === 0}
                          className={`w-full h-12 inline-flex items-center justify-center gap-2 px-5 rounded-2xl text-white text-[15px] font-black tracking-tight disabled:opacity-50 disabled:cursor-not-allowed transition-all ${isRecentRedesign ? "bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5" : "bg-rose-600 hover:bg-rose-700"}`}
                        >
                          {processing ? "Processing..." : config.title}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {error && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                        <p className="text-sm text-foreground/80 leading-relaxed">{error}</p>
                      </motion.div>
                    )}

                    {summary && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 p-4 rounded-xl border ${isRecentRedesign ? "bg-blue-500/5 border-blue-500/20" : "bg-rose-500/5 border-rose-500/20"}`}>
                        <p className="text-sm text-foreground/80 leading-relaxed font-medium">{summary}</p>
                      </motion.div>
                    )}

                    {outputs.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {outputs.map((output) => (
                          <div key={output.name} className="rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white/85 dark:bg-slate-900/50 p-4 shadow-sm">
                            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Output file</div>
                            <div className={`text-[15px] font-black break-all leading-snug ${isRecentRedesign ? "text-blue-600 dark:text-blue-400" : "text-rose-600 dark:text-rose-400"}`}>
                              {output.name}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{output.note}</p>
                            <button
                              onClick={() => downloadBlob(output.blob, output.name)}
                              className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background text-sm font-bold hover:opacity-90 transition-opacity"
                            >
                              <FileOutput className="w-4 h-4" />
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section id="how-to-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the {config.title}</h2>
              <ol className="space-y-5">
                {config.howTo.map((step, index) => (
                  <li key={step} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section id="result-interpretation" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">What This Tool Does Well</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="font-bold text-foreground mb-2">Fast local workflow</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">The processing runs on-device, which keeps the interaction direct and private.</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="font-bold text-foreground mb-2">Task-specific controls</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">Each PDF page exposes only the controls needed for that specific workflow instead of a bloated editor UI.</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="font-bold text-foreground mb-2">Direct downloads</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">Outputs are ready as separate downloadable files as soon as processing completes.</p>
                </div>
              </div>
            </section>

            <section id="quick-examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <div id="why-choose-this" />
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Usage Tips</h2>
              <div className="space-y-3">
                {config.tips.map((tip) => (
                  <div key={tip} className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/5 border border-rose-500/15">
                    <Check className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="faq" className="space-y-4">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Frequently Asked Questions</h2>
              {faq.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </section>
          </div>

          <ToolRightSidebar
            relatedTools={relatedTools.map((item, index) => ({
              title: item.title,
              href: getToolPath(item.slug),
              benefit: item.description,
              color: SIDEBAR_COLOR_STOPS[index % SIDEBAR_COLOR_STOPS.length],
            }))}
            onThisPageItems={[
              { label: "Calculator", href: "#calculator" },
              { label: "How to Use", href: "#how-to-use" },
              { label: "Result Interpretation", href: "#result-interpretation" },
              { label: "Quick Examples", href: "#quick-examples" },
              { label: "Why Choose This", href: "#why-choose-this" },
              { label: "FAQ", href: "#faq" },
            ]}
          />
        </div>
      </div>
    </Layout>
  );
}
