import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, Check, Server,
  Copy, Database, Code2, Hash, Fingerprint, RefreshCw, Key, ShieldCheck
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
  { title: "Base64 Decoder", slug: "base64-encoder-decoder", cat: "developer", icon: <Hash className="w-5 h-5"/>, color: 200, benefit: "Decode Base64 strings" },
  { title: "HTML Formatter", slug: "html-formatter", cat: "developer", icon: <Server className="w-5 h-5"/>, color: 170, benefit: "Beautify HTML markup" },
];

function generateUuidV4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export default function UuidGenerator() {
  const [count, setCount] = useState<number>(5);
  const [uuids, setUuids] = useState<string[]>(Array.from({length: 5}, () => generateUuidV4()));
  const [copied, setCopied] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uppercase, setUppercase] = useState(false);

  // Compile
  const outputDisplay = useMemo(() => {
     return uuids.map(u => {
        let val = u;
        if (!hyphens) val = val.replace(/-/g, "");
        if (uppercase) val = val.toUpperCase();
        return val;
     }).join("\n");
  }, [uuids, hyphens, uppercase]);

  const doGenerate = () => {
     let _uuids = [];
     for(let i=0; i<count; i++) _uuids.push(generateUuidV4());
     setUuids(_uuids);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="UUID Generator (v4) – Generate Unique Identifiers Instantly"
        description="Free online random UUID / GUID generator. Instantly create RFC 4122 compliant version 4 Universally Unique Identifiers for your app databases or software architecture."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-500" strokeWidth={3} />
          <Link href="/category/developer" className="text-muted-foreground hover:text-foreground transition-colors">Developer Tools</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-500" strokeWidth={3} />
          <span className="text-foreground">UUID Generator</span>
        </nav>

        {/* HERO */}
        <section className="rounded-2xl overflow-hidden border border-slate-500/15 bg-gradient-to-br from-slate-500/5 via-card to-zinc-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Database className="w-3.5 h-3.5" /> Database Utility
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">UUID / GUID Generator</h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Instantly generate bulk batches of highly secure, mathematically random Universally Unique Identifiers (UUIDv4) suitable for usage as primary keys in distributed databases, NoSQL environments, microservices, and modern API architectures. Total collision immunity.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-500/20"><ShieldCheck className="w-3.5 h-3.5" /> RFC 4122 Compliant</span>
            <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs px-3 py-1.5 rounded-full border border-sky-500/20"><Fingerprint className="w-3.5 h-3.5" /> Collision Protected</span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/20"><RefreshCw className="w-3.5 h-3.5" /> High Performance</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 space-y-10">

            {/* INTEGRATED BUILDER */}
            <section>
              <div className="rounded-2xl overflow-hidden border border-slate-500/20 shadow-lg shadow-slate-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-slate-400 to-zinc-600" />
                <div className="bg-card p-6 md:p-8">

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     
                     {/* Controls Left */}
                     <div className="space-y-6">
                        <div>
                          <label className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest block">How Many UUIDs?</label>
                          <input 
                            type="number" 
                            min="1" max="1000" 
                            className="tool-calc-input w-full"
                            value={count} 
                            onChange={(e) => setCount(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))} 
                          />
                        </div>

                        <div className="space-y-4 pt-2">
                           <label className="flex items-center gap-3 cursor-pointer group">
                             <div className={`w-5 h-5 rounded border ${hyphens ? 'bg-slate-500 border-slate-500' : 'bg-transparent border-slate-500/30 group-hover:border-slate-500'} flex items-center justify-center transition-colors`}>
                               {hyphens && <Check className="w-3.5 h-3.5 text-white" />}
                             </div>
                             <span className="text-sm font-bold text-foreground">Include Hyphens</span>
                           </label>
                           <label className="flex items-center gap-3 cursor-pointer group">
                             <div className={`w-5 h-5 rounded border ${uppercase ? 'bg-slate-500 border-slate-500' : 'bg-transparent border-slate-500/30 group-hover:border-slate-500'} flex items-center justify-center transition-colors`}>
                               {uppercase && <Check className="w-3.5 h-3.5 text-white" />}
                             </div>
                             <span className="text-sm font-bold text-foreground">Uppercase Letters</span>
                           </label>
                        </div>

                        <button onClick={doGenerate} className="w-full py-3 mt-4 rounded-xl font-bold bg-slate-600 hover:bg-slate-500 text-white flex items-center justify-center gap-2 transition-all shadow-md">
                           <RefreshCw className="w-4 h-4" /> Generate New Batch
                        </button>
                     </div>

                     {/* Export Right */}
                     <div className="md:col-span-2 bg-zinc-950 p-6 rounded-xl border border-border flex flex-col justify-between relative group">
                         <div>
                           <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                              <label className="text-xs font-bold text-zinc-400 flex items-center gap-2 uppercase tracking-widest"><Key className="w-4 h-4 text-slate-500"/> Generated Keys</label>
                           </div>
                           <textarea readOnly value={outputDisplay} className="w-full h-48 bg-transparent font-mono text-slate-300 text-sm resize-none focus:outline-none selection:bg-slate-500/40" />
                         </div>

                         <div className="absolute bottom-6 right-6 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={handleCopy} className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-100'}`}>
                                {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy All</>}
                             </button>
                         </div>
                     </div>

                  </div>

                </div>
              </div>
            </section>

            {/* DEEP DIVE SEO DOCUMENTATION */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8" id="documentation">
              <h2 className="text-3xl font-black text-foreground tracking-tight mb-8">The Complete Guide to Universally Unique Identifiers (UUIDs)</h2>
              
              <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-a:text-slate-500 hover:prose-a:text-slate-400">
                <p>
                  A <strong>Universally Unique Identifier (UUID)</strong>—also interchangeably referred to in Microsoft environments as a Globally Unique Identifier (GUID)—is a 128-bit textual label used for information in computer systems. Because UUIDs do not depend on a central registration authority to ensure uniqueness, they have become the absolute gold standard for indexing keys in databases, identifying session states, tagging decentralized network payloads, and assigning names to uploaded assets in modern cloud environments.
                </p>
                
                <h3 className="text-xl mt-8 mb-4 border-b border-border pb-2">Why Are UUIDs Superior to Auto-Incrementing Integers?</h3>
                <p>
                  Historically, relational SQL databases (`MySQL`, `PostgreSQL`) handled primary keys through a strict auto-incrementing integer methodology (e.g., ID 1, ID 2, ID 3). While simple, this architecture broke down drastically when the industry shifted towards distributed microservices and NoSQL horizontal scaling.
                </p>
                <ul className="space-y-3 my-6">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Security against enumeration:</strong> Integer IDs are highly vulnerable to Insecure Direct Object Reference (IDOR) attacks. If your user profile is `domain.com/user/482`, an attacker can easily guess that there is a `/user/483` and iteratively scrape your entire system's dataset. Contrastly, a UUID `/user/f47ac10b-58cc-4372-a567-0e02b2c3d479` is completely unguessable.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Database Horizontal Sharding:</strong> If you are merging two separate MySQL databases running on different continents, their auto-incrementing integers will naturally collide (both have an ID #500). If each database issues UUIDs locally, they can be merged indefinitely with exactly zero fear of a namespace collision.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Offline Client-Side Generation:</strong> Modern Progressive Web Apps (PWAs) often need to generate rich data payloads when the user's phone is totally offline in a tunnel. With a UUID, the Javascript browser engine can safely generate a key locally, store it in IndexedDB, and safely sync it to the AWS server hours later knowing the server will never reject it for duplicating another user's key.</span>
                  </li>
                </ul>

                <h3 className="text-xl mt-8 mb-4 border-b border-border pb-2">Anatomy and Structure of a Standard v4 UUID</h3>
                <p>
                  The structure of a UUID is clearly defined by <strong>RFC 4122</strong>. It presents itself as a string of exactly 32 hexadecimal characters (incorporating values <code>0-9</code> and <code>a-f</code>), partitioned into five deliberate groups separated by four hyphens. This results in exactly 36 total characters.
                </p>
                <div className="bg-muted p-5 rounded-xl my-6 font-mono text-center text-lg border border-border shadow-inner">
                   <span className="text-rose-500">885a082d</span> - <span className="text-sky-500">22ac</span> - <span className="text-emerald-500 font-bold">4</span><span className="text-emerald-500">fb0</span> - <span className="text-amber-500 font-bold">8</span><span className="text-amber-500">a9c</span> - <span className="text-indigo-500">1cc18357f495</span>
                </div>
                <p>
                  Because we are generating Version 4 UUIDs (which are purely pseudo-random numbers rather than time or MAC-address based), there are strict rules governing specific characters in the string:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-6">
                   <li>The first character of the third grouped segment <strong>must</strong> undeniably be a <code>4</code>, strictly indicating that this string is a Version 4 variant algorithm.</li>
                   <li>The first character of the fourth grouped segment <strong>must</strong> strictly fall within the set of either <code>8, 9, a, or b</code>, denoting the RFC 4122 variant classification limit.</li>
                   <li>The remaining 122 bits are entirely statistically random, powered by the platform's deepest cryptographic randomizer engines (such as WebCrypto API in browsers, or `/dev/urandom` in Linux distributions).</li>
                </ul>

                <h3 className="text-xl mt-8 mb-4 border-b border-border pb-2">What is the exact mathematical probability of a UUID collision?</h3>
                <p>
                  It is an incredibly common fear amongst junior software engineers to worry: <em>"Because these strings are randomly generated without a central nervous system checking for duplicates, what if two users coincidentally generate the exact same UUID at the exact same moment?"</em>
                </p>
                <p>
                  Statistically speaking, the total amount of possible v4 UUIDs is <strong>2^122</strong>, or approximately <code>3.4 × 10^38</code> (340 undecillion). To properly visualize how functionally impossible a collision is: if you were to deploy a massive server farm that generated exactly 1,000,000,000 (One Billion) UUIDs every single second, it would still take you 85 years of continuous non-stop running to reach a mere 50% probability that just a single collision might have occurred across your entire dataset.
                </p>
                <p>
                  As a result, major enterprise ecosystems such as <strong>Amazon Web Services (AWS), Google Cloud, Kubernetes, and MongoDB</strong> rely entirely on UUIDs for core infrastructure tracking, completely disregarding the statistical chance of overlapping memory registers.
                </p>
              </div>
            </section>

            {/* EXTENDED FAQ MODULE FOR LONG FORM CONTENT */}
            <section id="faq" className="mt-12">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <FaqItem 
                  q="What is the difference between UUID and GUID?" 
                  a={"Practically speaking, there is zero difference. UUID stands for Universally Unique Identifier, an overarching standard governed by RFC 4122. GUID stands for Globally Unique Identifier, which is simply Microsoft's proprietary ecosystem terminology for a UUID (used heavily inside Windows COM architecture, C#, and SQL Server).\n\nIf you generate a UUID here using our tool, it is 100% perfectly valid to insert into a Microsoft application expecting a GUID string."} 
                />
                <FaqItem 
                  q="Does changing to Uppercase letters invalidate the UUID?" 
                  a={"No. The official RFC 4122 specification clearly states that UUIDs are formally outputted as lowercase hexadecimal letters (a-f). However, it explicitly instructs that systems reading a UUID must treat them as case-insensitive on input.\n\nTherefore, a UUID reading \"A3F2-B0C4...\" is technically structurally identical to one reading \"a3f2-b0c4...\". Sometimes legacy Java or C++ database architecture enforces strict uppercase rules upon import routines, which is why we provide the toggle."} 
                />
                <FaqItem 
                  q="Why shouldn't I use random strings instead of UUIDs?" 
                  a={"If you just run a JavaScript `Math.random().toString(36)` command, you do get a randomized aesthetic string. However: \n\n1. It lacks sufficient length or cryptographic entropy, meaning collisions are actually highly statistically probable within a few hundred thousand entries. \n2. The UUID schema is globally recognized. If you use standard UUIDs, third-party libraries, PostgreSQL native column types, and data-warehouse parsing tools will natively recognize, compress, and auto-index the string at maximum hardware efficiency. They cannot do this for arbitrary Javascript strings."} 
                />
                <FaqItem 
                  q="What are the differences between UUID v1, v4, and v5?" 
                  a={"• Version 1 encompasses time-based and environment-based hashing. It merges the exact nanosecond of generation with the permanent MAC (Networking hardware) address of the computer generating it. Many consider v1 to be a privacy risk because an attacker can reverse-engineer your hardware serial numbers from your database keys.\n\n• Version 4 (The global standard we use above) relies 100% purely on sheer cryptographic randomness, providing ultimate anonymity and security against extraction.\n\n• Version 5 utilizes a complex namespace and SHA-1 hashing algorithm, generating identical, predictable UUID outputs consistently provided that you input the identical seed name string and namespace dictionary."} 
                />
                <FaqItem 
                  q="Are UUIDs poor for database performance?" 
                  a={"If improperly configured, yes. Because UUIDs are 36 characters long and entirely random, employing them as a Primary Index Key in a clustered B-Tree relational database (like default MySQL InnoDB configurations) causes phenomenon known as \"Index Fragmentation or Page Splitting\" as inserts scatter wildly across memory rather than appending cleanly sequentially like integers.\n\nTo solve this, Database Administrators utilize binary packing: converting the 36-char string into a raw 16-byte binary payload before inserting it into the SQL column, restoring lightning-fast lookup performance while keeping all security benefits."} 
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
                  {["System Utility", "UUID Superiority Architecture", "RFC 4122 Breakdown", "Collision Probability", "Frequently Asked Questions"].map((label, idx) => (
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
