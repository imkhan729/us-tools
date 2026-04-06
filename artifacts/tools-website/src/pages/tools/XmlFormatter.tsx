import { useMemo, useState } from "react";
import { Braces, Copy, FileCode2, Globe, RefreshCw, ScanText, Wand2 } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

function repeatIndent(size: number, level: number) {
  return " ".repeat(size * Math.max(level, 0));
}

function formatXmlNode(node: Node, indentSize: number, level: number): string {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = (node.textContent ?? "").trim();
    return text ? `${repeatIndent(indentSize, level)}${text}` : "";
  }

  if (node.nodeType === Node.CDATA_SECTION_NODE) {
    return `${repeatIndent(indentSize, level)}<![CDATA[${node.textContent ?? ""}]]>`;
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    return `${repeatIndent(indentSize, level)}<!--${(node.textContent ?? "").trim()}-->`;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const element = node as Element;
  const attributes = Array.from(element.attributes).map((attribute) => ` ${attribute.name}="${attribute.value}"`).join("");
  const children = Array.from(element.childNodes).map((child) => formatXmlNode(child, indentSize, level + 1)).filter(Boolean);

  if (!children.length) {
    return `${repeatIndent(indentSize, level)}<${element.tagName}${attributes} />`;
  }

  if (children.length === 1 && !children[0].includes("\n") && !children[0].trim().startsWith("<")) {
    return `${repeatIndent(indentSize, level)}<${element.tagName}${attributes}>${children[0].trim()}</${element.tagName}>`;
  }

  return `${repeatIndent(indentSize, level)}<${element.tagName}${attributes}>\n${children.join("\n")}\n${repeatIndent(indentSize, level)}</${element.tagName}>`;
}

function formatXml(input: string, indentSize: number) {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(input, "application/xml");
  const parserError = documentNode.querySelector("parsererror");
  if (parserError) {
    throw new Error(parserError.textContent?.replace(/\s+/g, " ").trim() || "Invalid XML");
  }

  const declarationMatch = input.match(/<\?xml[\s\S]*?\?>/i);
  const declaration = declarationMatch ? `${declarationMatch[0]}\n` : "";
  const body = Array.from(documentNode.childNodes)
    .filter((node) => node.nodeType !== Node.PROCESSING_INSTRUCTION_NODE && !(node.nodeType === Node.TEXT_NODE && !(node.textContent ?? "").trim()))
    .map((node) => formatXmlNode(node, indentSize, 0))
    .filter(Boolean)
    .join("\n");

  return `${declaration}${body}`.trim();
}

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?><records><record id="1"><name>Ava Stone</name><role>admin</role><notes><![CDATA[<strong>Priority</strong> account]]></notes></record><record id="2"><name>Leo Marsh</name><role>editor</role></record></records>`;

export default function XmlFormatter() {
  const [input, setInput] = useState(SAMPLE_XML);
  const [indentSize, setIndentSize] = useState(2);
  const [copiedLabel, setCopiedLabel] = useState("");

  const result = useMemo(() => {
    try {
      return { output: formatXml(input, indentSize), error: "" };
    } catch (error) {
      return { output: "", error: error instanceof Error ? error.message : "Invalid XML" };
    }
  }, [indentSize, input]);

  const stats = useMemo(
    () => ({
      tags: (input.match(/<([A-Za-z_][A-Za-z0-9_.:-]*)\b/g) || []).length,
      comments: (input.match(/<!--[\s\S]*?-->/g) || []).length,
      cdata: (input.match(/<!\[CDATA\[[\s\S]*?\]\]>/g) || []).length,
    }),
    [input],
  );

  const copyValue = async (label: string, value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(""), 1800);
  };

  const loadSample = () => {
    setInput(SAMPLE_XML);
    setIndentSize(2);
  };

  const clearAll = () => setInput("");

  return (
    <UtilityToolPageShell
      title="XML Formatter & Beautifier"
      seoTitle="XML Formatter & Beautifier - Format XML Online"
      seoDescription="Free XML formatter and beautifier with indentation control, parser validation, CDATA preservation, and copy-ready formatted XML output."
      canonical="https://usonlinetools.com/developer/xml-formatter"
      categoryName="Developer Tools"
      categoryHref="/category/developer"
      heroDescription="Format and beautify XML directly in the browser with parser validation, indentation controls, and preserved CDATA and comment blocks. This XML formatter is built for integration payloads, feeds, configs, imports, SOAP-style messages, and any workflow where raw XML needs to become readable again before review or debugging."
      heroIcon={<FileCode2 className="w-3.5 h-3.5" />}
      calculatorLabel="XML Formatting Workspace"
      calculatorDescription="Paste XML, choose indentation, validate the structure, and copy clean readable output instantly."
      calculator={
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
            <div className="space-y-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Indent Size</label>
                <select value={String(indentSize)} onChange={(event) => setIndentSize(Number(event.target.value))} className="tool-calc-input w-full">
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={loadSample} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                  <Wand2 className="w-4 h-4" />
                  Sample
                </button>
                <button onClick={clearAll} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground hover:bg-muted">
                  <RefreshCw className="w-4 h-4" />
                  Clear
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">XML Snapshot</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">Tags</span><span className="text-sm font-bold text-foreground">{stats.tags}</span></div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">Comments</span><span className="text-sm font-bold text-foreground">{stats.comments}</span></div>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"><span className="text-sm text-muted-foreground">CDATA blocks</span><span className="text-sm font-bold text-foreground">{stats.cdata}</span></div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-card p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Formatter Note</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  XML is much easier to debug when nesting, CDATA sections, attributes, and repeated elements are visually separated. Beautifying the structure often makes parsing problems or schema mismatches easier to spot.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">XML Input</p>
                    <p className="text-xs text-muted-foreground">{input.length} characters</p>
                  </div>
                  <textarea value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} className="min-h-[340px] w-full rounded-2xl border border-border bg-background p-4 font-mono text-sm leading-relaxed text-foreground outline-none resize-none" />
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Formatted Output</p>
                    <button onClick={() => copyValue("output", result.output)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!result.output}>
                      {copiedLabel === "output" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <textarea readOnly value={result.output || result.error} spellCheck={false} className="min-h-[340px] w-full rounded-2xl border border-border bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none resize-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-4">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Copy-Ready Snippets</p>
                  <div className="space-y-3">
                    {[
                      { label: "Formatted XML", value: result.output },
                      { label: "XML string", value: `const xml = ${JSON.stringify(result.output)};` },
                      { label: "SOAP body", value: result.output ? `<soap:Body>\n${result.output}\n</soap:Body>` : "" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                          <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600 hover:text-blue-700" disabled={!item.value}>
                            {copiedLabel === item.label ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100"><code>{item.value || "Available after formatting."}</code></pre>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">Best Uses</p>
                    <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Clean XML feeds before review.</p>
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Inspect SOAP-style payloads.</p>
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Read import/export XML more safely.</p>
                      <p className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">Spot malformed nesting faster.</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Practical Tip</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      If an XML document is hard to reason about, format it before editing anything else. Structural errors are much easier to spot when nesting and repeated elements are visually clear.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      howSteps={[
        { title: "Paste the XML you want to clean up", description: "This tool is useful for feeds, SOAP payloads, config files, import documents, CMS exports, and other XML-heavy workflows where the markup is technically valid but too compressed or messy to review safely by eye." },
        { title: "Choose the indentation size that fits your review style", description: "Indentation affects scan speed. Smaller indents keep large XML trees compact, while larger indents can make nested relationships easier to see in deep structures. Giving you control over that spacing makes the output easier to use in the next step instead of forcing more edits." },
        { title: "Let the parser validate the document before formatting", description: "A formatter becomes much more useful when it also refuses broken XML. That prevents you from copying output that only looks improved on the surface while still containing structural errors such as mismatched tags or malformed nodes." },
        { title: "Copy the cleaned XML or one of the prepared snippets", description: "Once the XML is readable, it often goes straight into a debug note, integration document, support case, code sample, or follow-up transformation step. Ready-made copy paths make the tool practical instead of just decorative." },
      ]}
      interpretationCards={[
        { title: "Readable XML reduces debugging friction", description: "Nested tags, attributes, comments, and CDATA sections are much easier to inspect when the structure is clearly indented and no longer compressed into long unreadable lines." },
        { title: "Parser validation matters as much as formatting", description: "If the XML is malformed, there is no safe formatted output to trust. A useful XML beautifier should make that clear immediately instead of pretending the problem is only visual.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "CDATA blocks are part of the document structure", description: "CDATA content often carries important embedded text or markup-like content, so preserving those blocks during formatting helps you inspect the real payload instead of flattening it into less readable escaped text.", className: "bg-violet-500/5 border-violet-500/20" },
        { title: "Formatting helps people, not transport size", description: "Beautified XML is for readability and review. If you later need compact transfer output, that is a separate minification concern rather than a formatting concern.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Beautify a feed export", input: "<records><record>...</record></records>", output: "Indented readable XML tree" },
        { scenario: "Inspect SOAP body content", input: "<soap:Body>...</soap:Body>", output: "Clear nested payload structure" },
        { scenario: "Keep CDATA readable", input: "<![CDATA[<div>Hi</div>]]>", output: "Preserved CDATA block" },
        { scenario: "Catch malformed XML early", input: "Broken closing tag", output: "Parser error instead of misleading output" },
      ]}
      whyChoosePoints={[
        "This XML formatter and beautifier is built as a real readability and validation tool rather than a placeholder. It parses the document, preserves structural content such as CDATA and comments, formats the tree with clean indentation, and provides copy-ready output for the next workflow step.",
        "The page is designed around how XML is usually handled in real work: not as greenfield authored markup, but as imported feeds, integration payloads, service responses, and export files that need to be understood quickly. In those situations readability and parser feedback matter more than novelty.",
        "Formatting XML often shortens debugging time because structural problems become visible. Repeated elements, nested sections, and tag boundaries are much easier to reason about once they are separated onto lines and indented consistently.",
        "This tool is also useful for communication. Teams often need to paste XML into support notes, documentation, migration comments, or code discussions. A formatted version is substantially easier for someone else to review than a compressed raw string copied from logs or integrations.",
        "Everything runs locally in the browser, which is the right default when the XML contains internal schemas, customer payloads, import records, or service responses that should not be uploaded elsewhere just to add line breaks and indentation.",
      ]}
      faqs={[
        { q: "What does an XML formatter do?", a: "An XML formatter reorganizes an XML document into a cleaner, more readable structure with indentation and line breaks so humans can inspect the hierarchy more easily." },
        { q: "Does formatting XML validate it too?", a: "This page parses the XML first, so invalid XML produces an error instead of a misleading formatted result. That makes the tool useful as both a beautifier and a quick structural check." },
        { q: "Why is XML formatting useful if the system already reads the XML?", a: "Because readable XML helps humans debug, review, explain, and maintain payloads more safely. It is especially useful when XML comes from logs, exports, or integrations in a compressed form." },
        { q: "Will CDATA sections survive formatting?", a: "Yes. CDATA blocks are preserved so the output remains structurally faithful to the source and embedded text-like content stays readable in its original form." },
        { q: "Can this format full documents and fragments?", a: "It is most useful with complete XML documents or well-formed XML fragments that can be parsed reliably. The parser step is what allows the formatter to produce trustworthy structure." },
        { q: "Does formatting change the meaning of the XML?", a: "It should not. Formatting changes presentation for readability, not the logical structure or payload content." },
        { q: "Who uses an XML formatter most often?", a: "Developers, QA teams, integration engineers, agencies, support teams, and analysts use XML formatters when reviewing service payloads, feeds, imports, and schema-based data exchange files." },
        { q: "Does the XML leave the browser?", a: "No. Parsing and formatting happen locally in the browser, which is useful for internal or sensitive XML documents that should stay on your machine." },
      ]}
      relatedTools={[
        { title: "JSON to XML Converter", slug: "json-to-xml", icon: <Braces className="w-4 h-4" />, color: 150, benefit: "Generate XML from structured JSON first" },
        { title: "JSON Formatter", slug: "json-formatter", icon: <ScanText className="w-4 h-4" />, color: 210, benefit: "Clean JSON before or after XML workflows" },
        { title: "HTML Formatter & Beautifier", slug: "html-formatter", icon: <Globe className="w-4 h-4" />, color: 265, benefit: "Format adjacent markup workflows too" },
        { title: "Text Diff Checker", slug: "diff-checker", icon: <Copy className="w-4 h-4" />, color: 28, benefit: "Compare XML revisions line by line" },
        { title: "YAML to JSON Converter", slug: "yaml-to-json", icon: <Wand2 className="w-4 h-4" />, color: 330, benefit: "Work across other structured data formats" },
        { title: "SQL Formatter", slug: "sql-formatter", icon: <FileCode2 className="w-4 h-4" />, color: 185, benefit: "Keep other integration text readable too" },
      ]}
      ctaTitle="Need More XML and Structured Data Tools?"
      ctaDescription="Keep formatting, converting, and validating payloads with adjacent developer utilities in the same tool hub."
      ctaHref="/category/developer"
    />
  );
}
