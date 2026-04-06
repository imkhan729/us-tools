import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Check, Server,
  Copy, Database, Code2, RefreshCw, Key, ShieldCheck, 
  FileBox, FileJson, ArrowRightLeft, Maximize2
} from "lucide-react";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-slate-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-slate-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4 whitespace-pre-wrap">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED = [
  { title: "JSON Formatter", slug: "json-formatter", cat: "developer", icon: <Code2 className="w-5 h-5"/>, color: 210, benefit: "Format code objects" },
  { title: "UUID Generator", slug: "uuid-generator", cat: "developer", icon: <Key className="w-5 h-5"/>, color: 200, benefit: "Generate Database Keys" },
  { title: "HTML Formatter", slug: "html-formatter", cat: "developer", icon: <Server className="w-5 h-5"/>, color: 170, benefit: "Beautify HTML markup" },
];

export default function CsvToJsonConverter() {
  const [csvInput, setCsvInput] = useState<string>("id,name,role,department\n1,Alice Smith,Engineer,Backend\n2,Bob Johnson,Manager,Sales\n3,Carol Williams,Designer,UX");
  const [copied, setCopied] = useState(false);
  const [hasHeaders, setHasHeaders] = useState(true);
  const [delimiter, setDelimiter] = useState<"," | ";" | "tab">(",");

  // Helper parser avoiding complex npm installs, using raw JS logic suitable for simple CSV
  const parseCSV = (str: string, del: string) => {
     let arr = [];
     let row = [];
     let inString = false;
     let temp = "";
     
     for(let i=0; i<str.length; i++) {
         let c = str[i];
         let nextC = str[i+1];
         
         if (c === '"' && inString && nextC === '"') {
             temp += '"';
             i++;
         } else if (c === '"') {
             inString = !inString;
         } else if (c === del && !inString) {
             row.push(temp);
             temp = "";
         } else if ((c === '\n' || c === '\r') && !inString) {
             if (c === '\r' && nextC === '\n') { i++; } // Skip CRLF
             row.push(temp);
             arr.push(row);
             temp = "";
             row = [];
         } else {
             temp += c;
         }
     }
     
     if (temp !== "" || row.length > 0) {
         row.push(temp);
         arr.push(row);
     }
     
     return arr.filter(r => r.length > 0 && r.some(c => c.trim() !== ""));
  };

  const jsonOutput = useMemo(() => {
     if(!csvInput.trim()) return "[]";
     
     try {
         const actualDelim = delimiter === "tab" ? "\t" : delimiter;
         const parsed = parseCSV(csvInput, actualDelim);
         
         if(parsed.length === 0) return "[]";
         
         if(hasHeaders && parsed.length > 1) {
             const headers = parsed[0].map(h => h.trim());
             const result = [];
             for(let i=1; i<parsed.length; i++) {
                 let obj: any = {};
                 for(let j=0; j<headers.length; j++) {
                     // Try converting numbers
                     let val = parsed[i][j] ? parsed[i][j].trim() : "";
                     if (!isNaN(Number(val)) && val !== "") {
                         obj[headers[j]] = Number(val);
                     } else if (val.toLowerCase() === "true") {
                         obj[headers[j]] = true;
                     } else if (val.toLowerCase() === "false") {
                         obj[headers[j]] = false;
                     } else {
                         obj[headers[j]] = val;
                     }
                 }
                 result.push(obj);
             }
             return JSON.stringify(result, null, 2);
         } else {
             // Array of Arrays
             return JSON.stringify(parsed, null, 2);
         }
     } catch (e) {
         return "[\n  // Error parsing CSV. Check layout and quoting.\n]";
     }
  }, [csvInput, hasHeaders, delimiter]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="CSV to JSON Converter – Parse Excel Data to Objects"
        description="Free online CSV to JSON converter. Convert Comma Separated Values or Excel spreadsheet exports directly into structured JSON arrays for API requests and databases."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-500" strokeWidth={3} />
          <Link href="/category/developer" className="text-muted-foreground hover:text-foreground transition-colors">Developer Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-500" strokeWidth={3} />
          <span className="text-foreground">CSV to JSON</span>
        </nav>

        {/* HERO */}
        <section className="rounded-2xl overflow-hidden border border-slate-500/15 bg-gradient-to-br from-slate-500/5 via-card to-zinc-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <ArrowRightLeft className="w-3.5 h-3.5" /> Payload Interop
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">CSV to JSON Converter</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Seamlessly transform raw <code>.csv</code> spreadsheet exports—complete with headers, tricky escaped edge quotes, and multiple delimiters—directly into beautiful, structured Array-of-Objects format for NoSQL databases and modern frontend web components.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs px-3 py-1.5 rounded-full border border-sky-500/20"><FileBox className="w-3.5 h-3.5" /> Table Support</span>
            <span className="inline-flex items-center gap-1.5 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 font-bold text-xs px-3 py-1.5 rounded-full border border-fuchsia-500/20"><FileJson className="w-3.5 h-3.5" /> JSON Structure</span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><ShieldCheck className="w-3.5 h-3.5" /> Client Computation</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* INTEGRATED BUILDER */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-slate-500/20 shadow-lg shadow-slate-500/5">
                
                <div className="bg-muted p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-4 h-4 rounded border ${hasHeaders ? 'bg-slate-500 border-slate-500' : 'bg-transparent border-slate-500/30 group-hover:border-slate-500'} flex items-center justify-center transition-colors`}>
                           {hasHeaders && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Row is Headers</span>
                       </label>
                       <div className="w-px h-4 bg-border" />
                       <div className="flex items-center gap-2 bg-background border border-border rounded-md p-0.5">
                          <button onClick={() => setDelimiter(",")} className={`text-xs px-2 py-1 rounded font-bold ${delimiter === "," ? 'bg-slate-500 text-white' : 'text-muted-foreground'}`}>Comma</button>
                          <button onClick={() => setDelimiter(";")} className={`text-xs px-2 py-1 rounded font-bold ${delimiter === ";" ? 'bg-slate-500 text-white' : 'text-muted-foreground'}`}>Semicolon</button>
                          <button onClick={() => setDelimiter("tab")} className={`text-xs px-2 py-1 rounded font-bold ${delimiter === "tab" ? 'bg-slate-500 text-white' : 'text-muted-foreground'}`}>Tab</button>
                       </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                   
                   {/* Left CSV INPUT */}
                   <div className="bg-card flex flex-col h-[500px]">
                      <div className="p-4 border-b border-border bg-card/50 flex justify-between items-center">
                         <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                           <FileBox className="w-4 h-4" /> CSV Input
                         </h3>
                         <button onClick={() => setCsvInput("")} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-rose-500 transition-colors">Clear</button>
                      </div>
                      <textarea 
                         value={csvInput} 
                         onChange={(e) => setCsvInput(e.target.value)}
                         className="flex-1 w-full bg-transparent font-mono text-sm p-5 resize-none focus:outline-none selection:bg-slate-500/20 text-foreground leading-relaxed placeholder:text-muted-foreground/50 whitespace-pre"
                         placeholder="Paste your CSV rows here..."
                         spellCheck={false}
                      />
                   </div>

                   {/* Right JSON OUTPUT */}
                   <div className="bg-zinc-950 flex flex-col h-[500px] relative group">
                      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                         <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                           <FileJson className="w-4 h-4 text-emerald-500" /> JSON Output
                         </h3>
                      </div>
                      <textarea 
                         readOnly
                         value={jsonOutput}
                         className="flex-1 w-full bg-transparent font-mono text-sm p-5 resize-none focus:outline-none selection:bg-slate-500/40 text-slate-300 leading-relaxed whitespace-pre"
                      />
                      
                      <div className="absolute bottom-5 right-5 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={handleCopy} className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xl border ${copied ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white'}`}>
                           {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy JSON</>}
                        </button>
                      </div>
                   </div>

                </div>
              </div>
            </section>

            {/* DEEP DIVE SEO DOCUMENTATION */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="documentation">
              <h2 className="text-3xl font-black text-foreground tracking-tight mb-8">Comprehensive Guide to CSV and JSON Engineering Translations</h2>
              
              <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-a:text-slate-500 hover:prose-a:text-slate-400">
                <p>
                  As an overarching rule in software architecture, massive historical datasets generated from marketing dashboards, HR personnel records, or SQL data warehouse dumps arrive formatted rigidly in flat files natively operating as <strong>CSV (Comma-Separated Values)</strong>. Conversely, active network transactions interacting within contemporary frameworks—like fetching React endpoints, mounting Vue stores, powering GraphQL mutations, or writing document geometries in MongoDB—mandate strict object encapsulation exclusively via <strong>JSON (JavaScript Object Notation)</strong>.
                </p>

                <p>
                  Because these formats reflect entirely disparate computing paradigms spanning decades, web developers must repeatedly transform simple 2-dimensional string matrices (CSV) into deeply nested explicit data-typed syntactic trees (JSON). Doing this at scale requires sophisticated Regex or string parsing. Our tool instantly resolves mapping challenges privately within your browser canvas.
                </p>
                
                <h3 className="text-xl mt-8 mb-4 border-b border-border pb-2">The Architectural Friction: What Makes Translating Complicated?</h3>
                <p>
                  On the absolute surface level, separating text using simply commas appears mathematically trivial. However, a developer rapidly collides against three extreme parsing hazards rendering naive <code>String.split(",")</code> scripts brutally destructive against corporate data:
                </p>

                <ul className="space-y-4 my-6 list-none p-0">
                  <li className="flex items-start gap-3 bg-muted/40 p-4 rounded-xl border border-border">
                    <Maximize2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                       <strong className="block text-foreground mb-1">Inline Quotation Escaping (RFC 4180 Violations)</strong>
                       <span className="text-sm">When a user exports a product spreadsheet, the item title might inherently contain commas, for example: <code>"TV, 55-Inch, Black"</code>. If we parse by commas without checking for quote boundaries sequentially, it shatters the single column into exactly three defective columns, throwing off every subsequent JSON key mapping.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 bg-muted/40 p-4 rounded-xl border border-border">
                    <Maximize2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                       <strong className="block text-foreground mb-1">Implicit vs. Explicit Data Typing</strong>
                       <span className="text-sm">In CSV files, everything technically exists purely as a string. Number configurations (<code>25</code>), raw booleans (<code>true</code>), and dates are printed unformatted. A competent converter must recursively verify fields algorithmically during translation to dynamically cast numbers back precisely into floats/integers—enabling JSON to map <code>"age": 25</code> structurally rather than rendering explicitly as the string <code>"age": "25"</code>.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 bg-muted/40 p-4 rounded-xl border border-border">
                    <Maximize2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                       <strong className="block text-foreground mb-1">Encoding Delimiters and Line Feed Discrepancies</strong>
                       <span className="text-sm">Regional dialects across Europe commonly utilize Semicolons (;) rather than commas due to localization decimal syntax rendering decimals like <code>3,14</code>. Futhermore, Linux prints line feeds strictly as (LF <code>\n</code>), whereas Windows inherently attaches carriage returns causing structural breaks (CRLF <code>\r\n</code>). Valid translations require aggressive regex scrubbing spanning the operating system delta.</span>
                    </div>
                  </li>
                </ul>

                <h3 className="text-xl mt-8 mb-4 border-b border-border pb-2">Unpacking The Resulting Arrays and Objects</h3>
                <p>
                  When selecting the <strong>"First Row is Headers"</strong> feature, our browser algorithm structurally ingests the immediate top array boundary as structural keys. Every remaining array recursively loops inside its boundaries assembling an individual container appending the column variables dynamically. Let us analyze a simplified architectural mapping demonstration:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="bg-card p-4 rounded border border-border text-sm font-mono overflow-auto">
                        <span className="text-emerald-500 font-bold">id,username,active</span><br/>
                        1,AdminRoot,true<br/>
                        2,TestClient,false<br/>
                    </div>
                    <div className="bg-zinc-950 p-4 rounded border border-border text-sm font-mono text-zinc-300 overflow-auto whitespace-pre">
{`[\n  {\n    "id": 1,\n    "username": "AdminRoot",\n    "active": true\n  },\n  {\n    "id": 2,\n    "username": "TestClient",\n    "active": false\n  }\n]`}
                    </div>
                </div>

                <p>
                  The converter intelligently parsed the numeric variables and recognized boolean flags globally!
                </p>
                
                <h3 className="text-xl mt-8 mb-4 border-b border-border pb-2">Client-Side Architecture Security Metrics</h3>
                <p>
                  A vastly overlooked component of formatting tools involves raw data sensitivity. CSV exports heavily encompass proprietary business contacts, unencrypted API hashes, email datasets, and internal corporate accounting architectures. Submitting your file contents against standard third-party converter domains mathematically demands that your private data is intercepted, pushed across foreign HTTP domains, compiled via back-end node applications, and transmitted back.
                </p>
                <p>
                  By strictly deploying a purely stateless, natively interpreted client-side algorithm using React states, <strong>zero percent</strong> of your raw CSV buffer is transmitted externally. The total loop is assembled solely across your browser hardware isolating memory leaks effortlessly.
                </p>

              </div>
            </section>

            {/* EXTENDED FAQ MODULE */}
            <section id="faq" className="mt-12">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <FaqItem 
                  q="Why is my CSV outputting 'Error parsing CSV'?" 
                  a={"CSV parsing natively crashes if strings encapsulate unevenly formatted double-quotations. For instance, if a spreadsheet cell directly stores \"He said \"hello\" but I disagree\" without appropriately double-escaping the internal quotes (like \"He said \"\"hello\"\"...\"), standard parsing rules inevitably shatter because the internal quotes prematurely resolve the string boundary trigger.\n\nYou should ensure malicious characters inside your CSV are cleaned thoroughly via Excel or Google Sheets string cleansing prior to exporting the core CSV syntax."} 
                />
                <FaqItem 
                  q="Does the tool handle TSV (Tab Separated Values)?" 
                  a={"Yes. Within our parameter configurations above the CSV editor, you can seamlessly toggle the active delimiter to utilize Tab constraints or Semicolons. This permits frictionless interaction processing TSV dumps strictly extracted directly from massive corporate server database managers natively mapping columns using \\t configurations."} 
                />
                <FaqItem 
                  q="What if my CSV has completely missing fields or blank rows?" 
                  a={"Our algorithmic mapper is completely fortified to ignore erratic trailing linebreaks (LF or CRLF variables identically) and it accurately ignores any 100% empty horizontal row spans. If a row strictly possesses data but omits intermediate columns (e.g., Row 4 possesses an ID, but entirely lacks a Username argument resulting in merely two commas `,,`), the resulting JSON injects \"\" natively tracking empty index locations preserving database validation schema."} 
                />
                <FaqItem 
                  q="Does it automatically cast numbers?" 
                  a={"Yes. It mathematically scrubs iterating variable outputs through a standard `isNaN()` verification gate. If a CSV array variable is unambiguously numerical (such as `user_id` mapped to 15302), the JSON generator forcibly eliminates the surrounding string encapsulation mapping it as an Integer or Float perfectly formatting nested data natively."} 
                />
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR MENU */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight mb-3 uppercase">Related Tools</h3>
                <div className="space-y-0.5">
                  {RELATED.map(t => (
                    <Link key={t.slug} href={`/${t.cat}/${t.slug}`} className="group flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-all">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-white flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5" style={{ background: `linear-gradient(135deg, hsl(${t.color} 70% 55%), hsl(${t.color} 75% 42%))` }}>{t.icon}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">{t.title}</p><p className="text-[10px] text-muted-foreground/60 truncate">{t.benefit}</p></div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-slate-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-sm font-black text-foreground tracking-tight uppercase mb-3">On This Page</h3>
                <div className="space-y-0.5">
                  {["CSV / JSON Interface Parser", "Architectural Discrepancies", "Solving Edge Case Interpolation", "Datatyping Intelligence Architecture", "Frequently Asked Questions"].map((label) => (
                    <a key={label} href={`#`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-slate-500 font-medium py-1.5 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-slate-500/40 flex-shrink-0" />{label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
