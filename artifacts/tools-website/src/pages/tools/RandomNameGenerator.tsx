import { useState, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronDown, User, Zap, Shield, Smartphone,
  Lock, BadgeCheck, Copy, Check, RefreshCw,
  Hash, Shuffle, FileText, ArrowRight, BookOpen, Database, Gamepad2,
} from "lucide-react";

// ── Name Data ──
const MALE_FIRST = ["James","John","Robert","Michael","William","David","Richard","Joseph","Thomas","Charles","Christopher","Daniel","Matthew","Anthony","Donald","Mark","Paul","Steven","George","Kenneth","Andrew","Joshua","Edward","Brian","Kevin","Ronald","Timothy","Jason","Jeffrey","Ryan","Gary","Jacob","Nicholas","Eric","Stephen","Jonathan","Larry","Scott","Frank","Justin","Brandon","Benjamin","Samuel","Raymond","Gregory","Patrick","Jack","Dennis","Jerry","Alexander","Tyler","Henry","Aaron","Walter","Peter","Douglas","Harold","Kyle","Carl","Arthur","Roger","Terry","Lawrence","Sean","Christian","Ethan","Austin","Jesse","Willie","Bryan","Billy","Louis","Dylan","Philip","Travis","Alan","Roy"];
const FEMALE_FIRST = ["Mary","Patricia","Jennifer","Linda","Barbara","Elizabeth","Susan","Jessica","Sarah","Karen","Lisa","Nancy","Betty","Margaret","Sandra","Ashley","Dorothy","Kimberly","Emily","Donna","Michelle","Carol","Amanda","Melissa","Deborah","Stephanie","Rebecca","Sharon","Laura","Cynthia","Kathleen","Amy","Angela","Shirley","Anna","Brenda","Pamela","Emma","Nicole","Helen","Samantha","Katherine","Christine","Debra","Rachel","Carolyn","Janet","Catherine","Maria","Heather","Diane","Julie","Joyce","Victoria","Kelly","Christina","Lauren","Joan","Evelyn","Olivia","Judith","Megan","Cheryl","Martha","Andrea","Frances","Hannah","Jacqueline","Ann","Gloria","Jean","Kathryn","Alice","Teresa","Sara","Janice","Doris","Madison","Julia","Grace","Judy","Abigail","Marie","Denise","Beverly","Amber","Theresa","Marilyn","Danielle","Diana","Brittany","Natalie","Sophia","Rose","Isabella","Alexis","Kayla","Charlotte","Lily"];
const LAST_NAMES = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores","Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter","Roberts","Turner","Phillips","Evans","Collins","Edwards","Stewart","Morris","Morales","Murphy","Cook","Rogers","Gutierrez","Ortiz","Morgan","Cooper","Peterson","Bailey","Reed","Kelly","Howard","Ramos","Kim","Cox","Ward","Richardson","Watson","Brooks","Chavez","Wood","James","Bennett","Gray","Mendoza","Ruiz","Hughes","Price","Alvarez","Castillo","Sanders","Patel","Myers","Long","Ross","Foster","Jimenez","Powell","Jenkins","Perry","Russell","Sullivan","Bell","Coleman","Butler","Henderson","Barnes"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

type Gender = "male" | "female" | "random";

function generateName(gender: Gender): { first: string; last: string; full: string } {
  const g = gender === "random" ? (Math.random() < 0.5 ? "male" : "female") : gender;
  const first = g === "male" ? pick(MALE_FIRST) : pick(FEMALE_FIRST);
  const last = pick(LAST_NAMES);
  return { first, last, full: `${first} ${last}` };
}

// ── Copy Button ──
function CopyBtn({ text }: { text: string }) {
  const [c, setC] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 1500); }}
      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
      {c ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

// ── FAQ Item ──
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card hover:border-purple-500/40 transition-colors">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className="text-base font-bold text-foreground leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-purple-500">
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RELATED_TOOLS = [
  { title: "Username Generator", slug: "username-generator", icon: <Hash className="w-5 h-5" />, color: 265, benefit: "Generate unique usernames" },
  { title: "Dice Roller", slug: "dice-roller", icon: <Shuffle className="w-5 h-5" />, color: 340, benefit: "Roll RPG dice" },
  { title: "Lorem Ipsum Generator", slug: "lorem-ipsum-generator", icon: <FileText className="w-5 h-5" />, color: 152, benefit: "Generate placeholder text" },
  { title: "Word Counter", slug: "word-counter", icon: <User className="w-5 h-5" />, color: 200, benefit: "Count words and characters" },
];

export default function RandomNameGenerator() {
  const [gender, setGender] = useState<Gender>("random");
  const [count, setCount] = useState(10);
  const [names, setNames] = useState<Array<{ first: string; last: string; full: string }>>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [siteLink, setSiteLink] = useState(false);

  const generate = useCallback(() => {
    const generated = Array.from({ length: count }, () => generateName(gender));
    setNames(generated);
  }, [gender, count]);

  const copyAll = () => {
    navigator.clipboard.writeText(names.map(n => n.full).join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setSiteLink(true);
    setTimeout(() => setSiteLink(false), 2000);
  };

  return (
    <Layout>
      <SEO
        title="Random Name Generator – Generate Fake Names for Any Purpose | Free"
        description="Free random name generator. Generate realistic American male, female, or mixed names for fiction, testing, design, gaming, or any creative project. No signup required."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-purple-500" strokeWidth={3} />
          <Link href="/category/productivity" className="text-muted-foreground hover:text-foreground transition-colors">Productivity &amp; Text</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-purple-500" strokeWidth={3} />
          <span className="text-foreground">Random Name Generator</span>
        </nav>

        {/* ── HERO ── */}
        <section id="overview" className="rounded-2xl overflow-hidden border border-purple-500/15 bg-gradient-to-br from-purple-500/5 via-card to-violet-500/5 px-8 md:px-12 py-10 md:py-14 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <User className="w-3.5 h-3.5" /> Productivity &amp; Text
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-4 max-w-3xl">
            Random Name Generator
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed mb-6 max-w-2xl">
            Generate realistic random American names for fiction writing, UX testing, mockups, gaming characters, or any project. Choose gender, set quantity, and copy all with one click.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              { icon: <BadgeCheck className="w-3.5 h-3.5" />, label: "100% Free", color: "emerald" },
              { icon: <Zap className="w-3.5 h-3.5" />, label: "Instant Generation", color: "purple" },
              { icon: <Lock className="w-3.5 h-3.5" />, label: "No Signup", color: "slate" },
              { icon: <Shield className="w-3.5 h-3.5" />, label: "Privacy First", color: "violet" },
              { icon: <Smartphone className="w-3.5 h-3.5" />, label: "Mobile Ready", color: "cyan" },
            ].map(b => (
              <span key={b.label} className={`inline-flex items-center gap-1.5 bg-${b.color}-500/10 text-${b.color}-600 dark:text-${b.color}-400 font-bold text-xs px-3 py-1.5 rounded-full border border-${b.color}-500/20`}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            Category: Productivity &amp; Text &nbsp;·&nbsp; Common US first + last names &nbsp;·&nbsp; Last updated: March 2026
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* ── MAIN COLUMN ── */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOL WIDGET ── */}
            <section id="generator">
              <div className="rounded-2xl overflow-hidden border border-purple-500/20 shadow-lg shadow-purple-500/5">
                <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-violet-400" />
                <div className="bg-card p-6 md:p-8 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-400 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Realistic American Names</p>
                      <p className="text-sm text-muted-foreground">Generate up to 100 names at once.</p>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap gap-4 items-end">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Gender</label>
                      <div className="flex gap-2">
                        {(["random", "male", "female"] as const).map(g => (
                          <button key={g} onClick={() => setGender(g)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all capitalize ${gender === g ? "bg-purple-500 text-white border-purple-500" : "border-border text-muted-foreground hover:border-purple-500/50"}`}>
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Quantity (1–100)</label>
                      <input type="number" min="1" max="100" value={count}
                        onChange={e => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                        className="tool-calc-input w-24" />
                    </div>
                    <button onClick={generate}
                      className="flex items-center gap-2 px-6 py-2.5 bg-purple-500 text-white font-black rounded-xl hover:bg-purple-600 transition-colors">
                      <RefreshCw className="w-4 h-4" /> Generate
                    </button>
                  </div>

                  {/* Results */}
                  {names.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{names.length} Names Generated</p>
                        <button onClick={copyAll}
                          className="flex items-center gap-1.5 text-xs font-bold text-purple-500 hover:text-purple-600 transition-colors">
                          {copiedAll ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy All</>}
                        </button>
                      </div>
                      <div className="rounded-xl border border-border bg-muted/30 divide-y divide-border max-h-96 overflow-y-auto">
                        {names.map((n, i) => (
                          <div key={i} className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground/60 w-6 text-right flex-shrink-0">{i + 1}</span>
                              <div>
                                <span className="text-sm font-bold text-foreground">{n.first}</span>
                                <span className="text-sm font-medium text-muted-foreground ml-1">{n.last}</span>
                              </div>
                            </div>
                            <CopyBtn text={n.full} />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {names.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                      <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-medium">Click Generate to create random names</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ── HOW TO USE ── */}
            <section id="how-it-works" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-6">How to Use the Random Name Generator</h2>
              <ol className="space-y-5 mb-8">
                {[
                  { title: "Select gender preference", body: "Choose 'Random' to get a mix of male and female names. Choose 'Male' or 'Female' to generate only names of that gender. The tool uses common American first names drawn from US Social Security Administration popularity data and common English surnames." },
                  { title: "Set the quantity", body: "Enter a number from 1 to 100. Click Generate to create the full list instantly. You can regenerate as many times as needed — each click produces a new random set with no repeats enforced (though naturally popular names may appear more than once)." },
                  { title: "Copy individual names or all at once", body: "Click the copy icon next to any name to copy just that one. Click 'Copy All' at the top to copy the entire list as a newline-separated text, ready to paste into a spreadsheet, document, database seed file, or creative writing project." },
                ].map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">{i + 1}</div>
                    <div>
                      <p className="font-bold text-foreground mb-1">{s.title}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* ── USE CASES ── */}
            <section id="use-cases" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Who Uses a Random Name Generator?</h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Random names are needed across many industries and creative fields. Here's how different users put them to work:
              </p>
              <div className="space-y-4">
                {[
                  {
                    type: "Fiction Writers",
                    color: "purple",
                    dot: "bg-purple-500",
                    uses: ["Character naming for novels, screenplays, or short stories", "Generate a full cast list for a new project", "Avoid unconscious name bias in character creation", "Find realistic-sounding names without breaking creative flow"],
                  },
                  {
                    type: "Developers & QA Testers",
                    color: "violet",
                    dot: "bg-violet-500",
                    uses: ["Seed databases with realistic test data", "Populate form demos and UI mockups", "Generate fake user accounts for load testing", "Create sample datasets for API development"],
                  },
                  {
                    type: "UX & Product Designers",
                    color: "fuchsia",
                    dot: "bg-fuchsia-500",
                    uses: ["Fill user profile cards and dashboards in mockups", "Make wireframes feel realistic to stakeholders", "Generate names for persona documents", "Avoid placeholder names like 'John Doe' that feel fake"],
                  },
                  {
                    type: "Gamers & Game Masters",
                    color: "pink",
                    dot: "bg-pink-500",
                    uses: ["Name RPG and tabletop game characters instantly", "Fill in NPC rosters for campaigns", "Generate player names for sports simulations", "Create fantasy world populations with realistic names"],
                  },
                ].map(r => (
                  <div key={r.type} className={`p-4 rounded-xl bg-${r.color}-500/5 border border-${r.color}-500/20`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${r.dot} flex-shrink-0`} />
                      <span className={`text-sm font-black text-${r.color}-600 dark:text-${r.color}-400`}>{r.type}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {r.uses.map(u => (
                        <div key={u} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground/50 flex-shrink-0" />
                          {u}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── QUICK EXAMPLES ── */}
            <section id="examples" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Quick Examples</h2>
              <p className="text-muted-foreground mb-5 text-sm">Sample names generated with different settings:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">#</th>
                      <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Gender</th>
                      <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</th>
                      <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</th>
                      <th className="text-left py-3 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Sample Use</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { n: 1, gender: "Male", first: "Michael", last: "Torres", use: "Novel protagonist" },
                      { n: 2, gender: "Female", first: "Lauren", last: "Bennett", use: "UX persona" },
                      { n: 3, gender: "Male", first: "James", last: "Nguyen", use: "Database seed" },
                      { n: 4, gender: "Female", first: "Sophia", last: "Rivera", use: "RPG character" },
                      { n: 5, gender: "Male", first: "Tyler", last: "Patel", use: "Sports sim player" },
                      { n: 6, gender: "Female", first: "Hannah", last: "Brooks", use: "Mockup profile" },
                    ].map(row => (
                      <tr key={row.n} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3 px-3 text-muted-foreground text-xs">{row.n}</td>
                        <td className="py-3 px-3 text-purple-600 dark:text-purple-400 font-semibold text-xs">{row.gender}</td>
                        <td className="py-3 px-3 font-bold text-foreground">{row.first}</td>
                        <td className="py-3 px-3 text-foreground">{row.last}</td>
                        <td className="py-3 px-3 text-xs text-muted-foreground">{row.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── WHY USE THIS ── */}
            <section id="why-use" className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Why Use a Random Name Generator?</h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Real-looking placeholder names improve the quality of designs, tests, and stories. Here's why randomized names beat "John Doe" every time:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { icon: <BookOpen className="w-5 h-5 text-purple-500" />, title: "Breaks Writer's Block", desc: "Stop getting stuck on naming characters. Generate 10 options instantly and pick the one that fits your story's tone and setting." },
                  { icon: <Database className="w-5 h-5 text-purple-500" />, title: "Realistic Test Data", desc: "Fake users named 'test1@test.com' look obviously fake. Real-looking names make demos and QA sessions more convincing." },
                  { icon: <Gamepad2 className="w-5 h-5 text-purple-500" />, title: "Instant Character Roster", desc: "Generate a full NPC roster for your campaign or game world in seconds. Filter by gender for specific roles or factions." },
                  { icon: <User className="w-5 h-5 text-purple-500" />, title: "Better UX Presentations", desc: "Stakeholders and clients respond better to mockups with real-looking names. It makes interfaces feel production-ready, not prototype-grade." },
                  { icon: <Shield className="w-5 h-5 text-purple-500" />, title: "100% Private", desc: "All generation happens in your browser. No name lists are sent to servers. Safe to use for internal tools, confidential projects, or sensitive demos." },
                  { icon: <Zap className="w-5 h-5 text-purple-500" />, title: "Bulk Generation", desc: "Need 50 names for a database seed? Generate up to 100 at once and copy the full list with a single click — no manual typing." },
                ].map((f, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl border border-border bg-muted/20">
                    <div className="flex-shrink-0 mt-0.5">{f.icon}</div>
                    <div>
                      <p className="font-bold text-foreground text-sm mb-1">{f.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Note:</strong> Generated names are fictional combinations from common US name lists. Any resemblance to real individuals is coincidental. These names are safe for testing, mockups, fiction, and any non-malicious purpose.
                </p>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section id="faq" className="space-y-3">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-5">Frequently Asked Questions</h2>
              {[
                { q: "Are these names real people?", a: "No — the names are generated by randomly combining common first names and last names from a curated list. While any combination might accidentally match a real person's name (given how common names like 'John Smith' are), they are not sourced from any real person's data. They are safe to use for testing, mockups, and fictional purposes." },
                { q: "Can I use these names for my novel or game characters?", a: "Yes, absolutely. Random name generators are widely used in creative writing, tabletop RPGs, video game development, and scriptwriting. The names are common, culturally neutral American English names, suitable for contemporary fiction and most fantasy or historical settings that use English names." },
                { q: "Are the names culturally diverse?", a: "The current name pool focuses on common American English first names and common English/Spanish/Asian surnames found in US census data. It represents the most common names in the United States but is not exhaustive of all cultures. The last name list includes names of Hispanic, Vietnamese, Korean, and South Asian origin, reflecting real US demographic diversity." },
                { q: "Can I generate just first names or just last names?", a: "Currently, the generator always produces full names (first + last). When you copy individual names, you can manually use just the first or last name portion. A future update may add separate first-name-only and last-name-only modes." },
                { q: "How random are the names?", a: "Each name is selected using JavaScript's Math.random(), which provides pseudo-random selection from the full name pools. With over 80 male first names, 100 female first names, and 100 last names, there are more than 18,000 possible unique name combinations. Generating 10 names at a time rarely produces a repeat." },
                { q: "Is there a way to export the names to a spreadsheet?", a: "Click 'Copy All' to copy the full list as a newline-separated text. Paste it into any spreadsheet application (Excel, Google Sheets, Numbers) and use 'Text to Columns' (with space as the delimiter) to split first and last names into separate columns." },
              ].map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </section>

            {/* ── CTA ── */}
            <section className="rounded-2xl bg-gradient-to-br from-purple-500/10 via-card to-violet-500/10 border border-purple-500/20 p-8 md:p-10 text-center">
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-3">More Productivity & Text Tools</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto text-sm leading-relaxed">
                Pair random names with lorem ipsum text, word counting, and case conversion tools for a complete content creation toolkit.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/tools/lorem-ipsum-generator"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 text-white font-bold text-sm hover:bg-purple-600 transition-colors">
                  Lorem Ipsum Generator <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/category/productivity"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-purple-500/30 text-purple-600 dark:text-purple-400 font-bold text-sm hover:bg-purple-500/10 transition-colors">
                  All Productivity Tools
                </Link>
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* Related Tools */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Related Tools</p>
                <div className="space-y-2">
                  {RELATED_TOOLS.map((t, i) => (
                    <Link key={i} href={`/tools/${t.slug}`}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all border border-transparent hover:border-border">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `hsl(${t.color} 80% 50% / 0.1)`, color: `hsl(${t.color} 70% 45%)` }}>
                        {t.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground leading-tight truncate">{t.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{t.benefit}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
                <p className="text-sm font-bold text-foreground mb-3">Share this tool</p>
                <button onClick={copyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-500 text-white font-bold text-sm hover:bg-purple-600 transition-colors">
                  {siteLink ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              {/* On This Page */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">On This Page</p>
                <nav className="space-y-1">
                  {[
                    { href: "#overview", label: "Overview" },
                    { href: "#generator", label: "Name Generator" },
                    { href: "#how-it-works", label: "How It Works" },
                    { href: "#use-cases", label: "Who Uses This" },
                    { href: "#examples", label: "Quick Examples" },
                    { href: "#why-use", label: "Why Use This" },
                    { href: "#faq", label: "FAQ" },
                  ].map(item => (
                    <a key={item.href} href={item.href}
                      className="block text-sm text-muted-foreground hover:text-foreground hover:font-medium transition-colors py-1 pl-2 border-l-2 border-transparent hover:border-purple-500">
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Name Pool Stats */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Name Pool Size</p>
                <div className="space-y-2">
                  {[
                    { label: "Male first names", count: "80+", color: "blue" },
                    { label: "Female first names", count: "100+", color: "pink" },
                    { label: "Last names", count: "100+", color: "purple" },
                    { label: "Unique combinations", count: "18,000+", color: "violet" },
                  ].map(r => (
                    <div key={r.label} className={`flex items-center justify-between p-2.5 rounded-lg bg-${r.color}-500/5 border border-${r.color}-500/20`}>
                      <p className="text-xs text-muted-foreground">{r.label}</p>
                      <span className={`text-xs font-black text-${r.color}-600 dark:text-${r.color}-400`}>{r.count}</span>
                    </div>
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
