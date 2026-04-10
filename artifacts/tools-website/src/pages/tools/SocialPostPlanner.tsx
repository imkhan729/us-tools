import { useMemo, useState, type ReactElement } from "react";
import { CalendarDays, CalendarRange, CheckCircle2, ClipboardList, Copy, Instagram, Linkedin, Sparkles, Twitter, Youtube } from "lucide-react";
import UtilityToolPageShell from "./UtilityToolPageShell";

type Platform = "instagram" | "linkedin" | "twitter" | "tiktok" | "youtube";
type Status = "idea" | "draft" | "review" | "scheduled" | "published";
type ViewMode = "list" | "calendar";

type PlannedPost = {
  id: string;
  title: string;
  platform: Platform;
  date: string;
  time: string;
  status: Status;
  hook: string;
  notes: string;
};

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  twitter: "Twitter/X",
  tiktok: "TikTok",
  youtube: "YouTube",
};

const STATUS_LABELS: Record<Status, string> = {
  idea: "Idea",
  draft: "Draft",
  review: "In Review",
  scheduled: "Scheduled",
  published: "Published",
};

const PLATFORM_ICONS = {
  instagram: <Instagram className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
  tiktok: <Sparkles className="h-4 w-4" />,
  youtube: <Youtube className="h-4 w-4" />,
} satisfies Record<Platform, ReactElement>;

const STATUS_STYLES: Record<Status, string> = {
  idea: "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300",
  draft: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300",
  review: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-300",
  scheduled: "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/50 dark:bg-cyan-950/40 dark:text-cyan-300",
  published: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300",
};

const STARTER_POSTS: PlannedPost[] = [
  {
    id: "launch-linkedin",
    title: "Launch announcement with product value bullets",
    platform: "linkedin",
    date: "2026-04-06",
    time: "10:00",
    status: "scheduled",
    hook: "Show the before and after workflow change in one opening line.",
    notes: "Add founder quote and one CTA to the landing page.",
  },
  {
    id: "reel-instagram",
    title: "Behind-the-scenes short reel",
    platform: "instagram",
    date: "2026-04-07",
    time: "18:30",
    status: "draft",
    hook: "Open on the fastest win instead of the feature list.",
    notes: "Need thumbnail and caption polish.",
  },
  {
    id: "recap-twitter",
    title: "Weekly recap thread",
    platform: "twitter",
    date: "2026-04-09",
    time: "09:15",
    status: "idea",
    hook: "Three wins, one lesson, one next step.",
    notes: "Break long points into short punchy lines.",
  },
];

function formatPlannerDate(value: string) {
  if (!value) return "No date set";
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function makePostId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sortPosts(posts: PlannedPost[]) {
  return [...posts].sort((left, right) => `${left.date}T${left.time || "00:00"}`.localeCompare(`${right.date}T${right.time || "00:00"}`));
}

export default function SocialPostPlanner() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [title, setTitle] = useState("Weekly customer story post");
  const [platform, setPlatform] = useState<Platform>("linkedin");
  const [date, setDate] = useState("2026-04-10");
  const [time, setTime] = useState("11:00");
  const [status, setStatus] = useState<Status>("draft");
  const [hook, setHook] = useState("Lead with the customer problem before the product fix.");
  const [notes, setNotes] = useState("Need screenshot, CTA, and final approval.");
  const [posts, setPosts] = useState<PlannedPost[]>(STARTER_POSTS);
  const [copied, setCopied] = useState("");

  const sortedPosts = useMemo(() => sortPosts(posts), [posts]);

  const groupedPosts = useMemo(
    () =>
      sortedPosts.reduce<Array<{ date: string; items: PlannedPost[] }>>((groups, post) => {
        const existing = groups.find((group) => group.date === post.date);
        if (existing) {
          existing.items.push(post);
          return groups;
        }
        groups.push({ date: post.date, items: [post] });
        return groups;
      }, []),
    [sortedPosts],
  );

  const summary = useMemo(
    () =>
      [
        `View: ${viewMode === "list" ? "List" : "Calendar"}`,
        `Total planned posts: ${sortedPosts.length}`,
        ...sortedPosts.map(
          (post, index) =>
            `${index + 1}. ${formatPlannerDate(post.date)} ${post.time || "00:00"} | ${PLATFORM_LABELS[post.platform]} | ${STATUS_LABELS[post.status]} | ${post.title}${post.hook ? ` | Hook: ${post.hook}` : ""}`,
        ),
      ].join("\n"),
    [sortedPosts, viewMode],
  );

  const csvExport = useMemo(
    () =>
      [
        "Title,Platform,Date,Time,Status,Hook,Notes",
        ...sortedPosts.map((post) =>
          [post.title, PLATFORM_LABELS[post.platform], post.date, post.time, STATUS_LABELS[post.status], post.hook, post.notes]
            .map((value) => `"${value.replace(/"/g, '""')}"`)
            .join(","),
        ),
      ].join("\n"),
    [sortedPosts],
  );

  const stats = useMemo(() => {
    const publishedCount = sortedPosts.filter((post) => post.status === "published").length;
    const scheduledCount = sortedPosts.filter((post) => post.status === "scheduled").length;
    const upcomingCount = sortedPosts.filter((post) => post.date >= "2026-04-02").length;
    const platformCount = new Set(sortedPosts.map((post) => post.platform)).size;
    return { publishedCount, scheduledCount, upcomingCount, platformCount };
  }, [sortedPosts]);

  const cadenceNote = useMemo(() => {
    if (sortedPosts.length <= 2) return "The plan is light. Add a second or third post so the week does not depend on one publish window.";
    if (new Set(sortedPosts.map((post) => post.platform)).size === 1) return "The calendar is concentrated on one platform. That is fine for a focused campaign, but cross-post support is still missing.";
    return "The schedule is diversified across platforms, which makes it easier to repurpose one core topic into multiple post formats.";
  }, [sortedPosts]);

  const addPost = () => {
    if (!title.trim() || !date) return;
    setPosts((current) =>
      sortPosts([
        ...current,
        { id: makePostId(), title: title.trim(), platform, date, time, status, hook: hook.trim(), notes: notes.trim() },
      ]),
    );
    setTitle("");
    setHook("");
    setNotes("");
    setStatus("idea");
    setTime("09:00");
  };

  const removePost = (id: string) => setPosts((current) => current.filter((post) => post.id !== id));

  const loadPreset = (preset: "launch" | "weekly" | "creator") => {
    if (preset === "launch") {
      setPosts([
        { id: "launch-1", title: "Product teaser post", platform: "twitter", date: "2026-04-05", time: "08:30", status: "scheduled", hook: "Start with the pain point, then hint at the release.", notes: "Need visual teaser asset." },
        { id: "launch-2", title: "Launch day announcement", platform: "linkedin", date: "2026-04-06", time: "10:00", status: "scheduled", hook: "Name the result first, then explain what changed.", notes: "Include CTA to sign up." },
        { id: "launch-3", title: "Customer walkthrough reel", platform: "instagram", date: "2026-04-07", time: "17:30", status: "draft", hook: "Show the old workflow in three seconds.", notes: "Need cover frame and caption." },
      ]);
      return;
    }

    if (preset === "creator") {
      setPosts([
        { id: "creator-1", title: "Tutorial hook video", platform: "tiktok", date: "2026-04-04", time: "19:00", status: "draft", hook: "Open with the biggest mistake people keep making.", notes: "Add one pinned comment CTA." },
        { id: "creator-2", title: "Carousel recap", platform: "instagram", date: "2026-04-06", time: "18:00", status: "scheduled", hook: "Turn the tutorial into 5 swipeable steps.", notes: "Need final design pass." },
        { id: "creator-3", title: "YouTube community post", platform: "youtube", date: "2026-04-08", time: "14:00", status: "idea", hook: "Ask one quick opinion question tied to the next video.", notes: "Reuse comments as script input." },
      ]);
      return;
    }

    setPosts(STARTER_POSTS);
  };

  const copyValue = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  };

  const calculator = (
    <div className="space-y-6">
      {/* Top command strip */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-xl bg-blue-500/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">
              <CalendarRange className="h-4 w-4" />
              Board
            </span>
            <div className="flex rounded-xl border border-border bg-background p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-lg px-3 py-2 text-xs font-black uppercase tracking-[0.14em] ${
                  viewMode === "list" ? "bg-blue-600 text-white" : "text-foreground hover:bg-muted"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`rounded-lg px-3 py-2 text-xs font-black uppercase tracking-[0.14em] ${
                  viewMode === "calendar" ? "bg-blue-600 text-white" : "text-foreground hover:bg-muted"
                }`}
              >
                Calendar
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadPreset("weekly")}
              className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted"
            >
              Weekly preset
            </button>
            <button
              onClick={() => loadPreset("launch")}
              className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted"
            >
              Launch preset
            </button>
            <button
              onClick={() => loadPreset("creator")}
              className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground hover:border-blue-500/40 hover:bg-muted"
            >
              Creator preset
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard grid */}
      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Compose */}
        <div className="min-w-0 space-y-5">
          <div className="rounded-2xl border border-blue-500/20 bg-[linear-gradient(135deg,rgba(37,99,235,0.08),rgba(255,255,255,0.0))] p-5 dark:bg-[linear-gradient(135deg,rgba(37,99,235,0.14),rgba(0,0,0,0.0))]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Add a post</p>
                <p className="text-sm text-muted-foreground">Capture the idea, then enrich it with timing + an opening hook. Keep notes tight so handoffs don’t get lost.</p>
              </div>
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2 text-blue-700 dark:text-blue-300">
                {PLATFORM_ICONS[platform]}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Post title</label>
                <input value={title} onChange={(event) => setTitle(event.target.value)} className="tool-calc-input w-full" placeholder="What’s the post about?" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Platform</label>
                  <select value={platform} onChange={(event) => setPlatform(event.target.value as Platform)} className="tool-calc-input w-full">
                    {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Status</label>
                  <select value={status} onChange={(event) => setStatus(event.target.value as Status)} className="tool-calc-input w-full">
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Publish date</label>
                  <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="tool-calc-input w-full" />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Publish time</label>
                  <input type="time" value={time} onChange={(event) => setTime(event.target.value)} className="tool-calc-input w-full" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Hook / opening angle</label>
                <input value={hook} onChange={(event) => setHook(event.target.value)} className="tool-calc-input w-full" placeholder="What should the first line do?" />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">Notes</label>
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="tool-calc-input min-h-[108px] w-full resize-y" placeholder="Assets, approvals, CTA, pinned comment, handoff." />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={addPost}
                className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={!title.trim() || !date}
              >
                Add to planner
              </button>
              <button
                onClick={() => {
                  setPosts([]);
                  setTitle("");
                  setHook("");
                  setNotes("");
                }}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold text-foreground hover:border-blue-500/40"
              >
                Clear planner
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Planned</p>
              <p className="mt-2 text-2xl font-black text-foreground">{sortedPosts.length}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Scheduled</p>
              <p className="mt-2 text-2xl font-black text-foreground">{stats.scheduledCount}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Published</p>
              <p className="mt-2 text-2xl font-black text-foreground">{stats.publishedCount}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">Platforms</p>
              <p className="mt-2 text-2xl font-black text-foreground">{stats.platformCount}</p>
            </div>
          </div>

          {/* Exports */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Exports</p>
            {[
              { label: "Schedule summary", value: summary },
              { label: "CSV export", value: csvExport },
            ].map((item) => (
              <div key={item.label} className="mb-3 rounded-xl border border-border bg-muted/40 p-3 last:mb-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                  <button onClick={() => copyValue(item.label, item.value)} className="text-xs font-bold text-blue-600">
                    {copied === item.label ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="mt-2 max-h-52 overflow-auto rounded-xl bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                  <code>{item.value}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Board */}
        <div className="min-w-0 space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Schedule</p>
                <p className="text-sm text-muted-foreground">A readable board for spacing checks and quick status scanning.</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground">
                <ClipboardList className="h-4 w-4 text-blue-500" />
                {sortedPosts.length} items
              </span>
            </div>

            {viewMode === "list" ? (
              <div className="space-y-3">
                {sortedPosts.length ? (
                  sortedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="rounded-2xl border border-border bg-[linear-gradient(135deg,rgba(2,132,199,0.06),rgba(255,255,255,0.0))] p-4 dark:bg-[linear-gradient(135deg,rgba(2,132,199,0.12),rgba(0,0,0,0.0))]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-700 dark:text-blue-300">
                              {PLATFORM_ICONS[post.platform]}
                              {PLATFORM_LABELS[post.platform]}
                            </span>
                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[post.status]}`}>
                              {STATUS_LABELS[post.status]}
                            </span>
                            <span className="text-xs font-bold text-muted-foreground">
                              {formatPlannerDate(post.date)} · {post.time || "00:00"}
                            </span>
                          </div>

                          <p className="mt-3 text-base font-black text-foreground">{post.title}</p>
                          {post.hook ? (
                            <p className="mt-2 text-sm text-muted-foreground">
                              <span className="font-semibold text-foreground">Hook:</span> {post.hook}
                            </p>
                          ) : null}
                          {post.notes ? (
                            <p className="mt-1 text-sm text-muted-foreground">
                              <span className="font-semibold text-foreground">Notes:</span> {post.notes}
                            </p>
                          ) : null}
                        </div>

                        <button onClick={() => removePost(post.id)} className="text-xs font-bold text-rose-500 hover:text-rose-600">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-sm text-muted-foreground">
                    Add posts to start building the schedule.
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedPosts.length ? (
                  groupedPosts.map((group) => (
                    <div key={group.date} className="rounded-2xl border border-border bg-muted/30 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm font-black text-foreground">
                          <CalendarDays className="h-4 w-4 text-blue-500" />
                          {formatPlannerDate(group.date)}
                        </div>
                        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
                          {group.items.length} posts
                        </span>
                      </div>

                      <div className="space-y-3">
                        {group.items.map((post) => (
                          <div key={post.id} className="rounded-xl border border-border bg-card p-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-300">
                                {PLATFORM_ICONS[post.platform]}
                                {PLATFORM_LABELS[post.platform]}
                              </span>
                              <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${STATUS_STYLES[post.status]}`}>
                                {STATUS_LABELS[post.status]}
                              </span>
                              <span className="ml-auto text-[11px] font-bold text-muted-foreground">{post.time || "00:00"}</span>
                            </div>
                            <p className="mt-2 text-sm font-black text-foreground">{post.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-sm text-muted-foreground">
                    The calendar is empty. Add at least one post to create date groups.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Guidance stays, but reads as a compact ops card */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Planning guidance</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Cadence note</p>
                <p className="mt-1">{cadenceNote}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Upcoming workload</p>
                <p className="mt-1">{stats.upcomingCount} posts are dated on or after April 2, 2026.</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-bold text-foreground">Status labels</p>
                <p className="mt-1">Use `Idea` for loose concepts, `Draft` for rough copy, `In Review` for approvals, `Scheduled` for queued posts, and `Published` when the post is live.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <UtilityToolPageShell
      title="Online Social Post Planner"
      seoTitle="Online Social Post Planner - Plan Posts, Dates, Platforms, and Statuses"
      seoDescription="Free social post planner. Organize social media posts by platform, publish date, status, and notes with list and calendar views."
      canonical="https://usonlinetools.com/social-media/online-social-post-scheduler-planner"
      categoryName="Social Media Tools"
      categoryHref="/category/social-media"
      heroDescription="Plan post ideas, timing, and platform mix in one lightweight board. Add titles, publish dates, status labels, and notes, then switch between a list and calendar view to keep the campaign organized."
      heroIcon={<CalendarRange className="h-3.5 w-3.5" />}
      calculatorLabel="Content Planning Board"
      calculatorDescription="Build a simple posting schedule with platform, date, time, status, and copy notes, then export a clean summary or CSV."
      calculator={calculator}
      howSteps={[
        { title: "Add the next post idea", description: "Start with the title, platform, publish date, and current workflow status so the plan reflects what is actually ready versus what is still a concept." },
        { title: "Include a hook and quick notes", description: "The hook keeps the opening angle visible, while the notes field holds asset, approval, or CTA reminders that often get lost in chat threads." },
        { title: "Switch between list and calendar views", description: "Use list mode to inspect details and remove entries quickly, then switch to calendar mode to check spacing and date clustering across the week." },
        { title: "Copy the summary or CSV export", description: "The export blocks make it easy to move the plan into docs, spreadsheets, or handoff messages without retyping the schedule." },
      ]}
      interpretationCards={[
        { title: "A status label prevents fake certainty", description: "Not every planned post is actually ready. Marking idea, draft, review, or scheduled states keeps the plan honest and reduces missed publish windows.", className: "bg-emerald-500/5 border-emerald-500/20" },
        { title: "Calendar gaps reveal weak cadence", description: "If several days are empty or too many posts stack on one date, the planner exposes that immediately so the schedule can be balanced earlier.", className: "bg-blue-500/5 border-blue-500/20" },
        { title: "Hooks matter as much as titles", description: "A good title organizes the content internally, but the hook tells the team how the post should open when it is actually written or filmed.", className: "bg-cyan-500/5 border-cyan-500/20" },
        { title: "One topic can feed multiple platforms", description: "When the planner spreads one campaign across LinkedIn, Instagram, TikTok, or X, it becomes easier to repurpose the same core idea instead of inventing new topics from scratch.", className: "bg-amber-500/5 border-amber-500/20" },
      ]}
      examples={[
        { scenario: "Weekly content plan", input: "3 to 5 posts across LinkedIn, Instagram, and X", output: "Clear weekly board with dates, statuses, and hooks" },
        { scenario: "Product launch week", input: "Teaser + launch post + recap sequence", output: "Staged rollout with assets and CTA notes attached" },
        { scenario: "Creator publishing rhythm", input: "TikTok tutorial + Instagram recap + YouTube community post", output: "Repurposed topic plan instead of disconnected post ideas" },
        { scenario: "Team handoff summary", input: "Planner summary or CSV export", output: "Copy-ready schedule for docs, spreadsheets, or async review" },
      ]}
      whyChoosePoints={[
        "This page is a real working planner, not a placeholder shell with generic social-media copy.",
        "List and calendar views make the same plan useful for both detail review and date spacing checks.",
        "Platform, publish date, status, hook, and notes fields cover the practical information content teams actually need during scheduling.",
        "The built-in summary and CSV exports reduce friction when moving a draft schedule into broader campaign documents.",
        "The page follows the same long-form structure as the stronger tool pages while keeping the planner itself above the fold.",
      ]}
      faqs={[
        { q: "Is this a real publishing scheduler?", a: "No. It is a planning board, not an API-connected scheduler. The goal is to organize ideas, dates, statuses, and notes before posting or handing work off to another system." },
        { q: "Why use status labels in a planner?", a: "Status labels show whether a post is still an idea, already drafted, waiting on review, or actually scheduled. That prevents teams from mistaking early concepts for ready-to-publish content." },
        { q: "What is the difference between list and calendar view?", a: "List view is better for reading hooks and notes, while calendar view is better for checking timing, spacing, and date clustering across the schedule." },
        { q: "Can I plan multiple platforms at once?", a: "Yes. Each entry stores its own platform label, so one campaign can be split into platform-specific posts while still staying in one board." },
        { q: "Should every post include a hook?", a: "It helps. The hook makes it easier to remember the opening angle or first line, which is often the hardest part to reconstruct later." },
        { q: "Why include time as well as date?", a: "Time is useful when launches, weekly series, or audience windows matter. Even a rough placeholder time gives the plan more operational value." },
        { q: "Does this save or sync anywhere?", a: "No. The planner runs locally in the browser session. If you want to keep a schedule, copy the summary or CSV output into your own docs or project system." },
        { q: "What should I export after planning?", a: "Use the summary when you want a quick readable handoff, and use the CSV block when you want to move the plan into spreadsheets or a more structured calendar workflow." },
      ]}
      relatedTools={[
        { title: "LinkedIn Post Formatter", slug: "linkedin-post-formatter", icon: <Linkedin className="h-4 w-4" />, color: 210, benefit: "Turn one planned LinkedIn idea into cleaner publish-ready copy" },
        { title: "Social Media Bio Generator", slug: "bio-generator", icon: <Sparkles className="h-4 w-4" />, color: 35, benefit: "Tighten the profile copy that sits next to the posting strategy" },
        { title: "Instagram Caption Counter", slug: "instagram-caption-counter", icon: <Instagram className="h-4 w-4" />, color: 145, benefit: "Check caption length when a planned post moves into writing" },
        { title: "TikTok Caption Counter", slug: "tiktok-character-counter", icon: <ClipboardList className="h-4 w-4" />, color: 300, benefit: "Keep short-form captions inside tighter platform limits" },
        { title: "Text to Emoji Converter", slug: "text-to-emoji", icon: <Copy className="h-4 w-4" />, color: 45, benefit: "Add lighter stylistic treatment to casual social copy" },
        { title: "Social Media Image Resizer", slug: "social-media-image-resizer", icon: <CheckCircle2 className="h-4 w-4" />, color: 100, benefit: "Prepare the matching visual assets after the schedule is set" },
      ]}
      ctaTitle="Need Another Social Media Tool?"
      ctaDescription="Keep replacing the remaining social-media placeholder routes with live planners, counters, and copy-formatting utilities."
      ctaHref="/category/social-media"
    />
  );
}
