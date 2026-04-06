import { useMemo, useState } from "react";
import { BookCheck, GraduationCap, Layers } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

export default function RevisionPlannerTool() {
  const [weakTopics, setWeakTopics] = useState("5");
  const [mediumTopics, setMediumTopics] = useState("7");
  const [strongTopics, setStrongTopics] = useState("4");
  const [daysLeft, setDaysLeft] = useState("12");
  const [sessionsPerDay, setSessionsPerDay] = useState("3");
  const [minutesPerSession, setMinutesPerSession] = useState("40");

  const result = useMemo(() => {
    const weak = parseFloat(weakTopics);
    const medium = parseFloat(mediumTopics);
    const strong = parseFloat(strongTopics);
    const days = parseFloat(daysLeft);
    const sessions = parseFloat(sessionsPerDay);
    const minutes = parseFloat(minutesPerSession);

    if ([weak, medium, strong, days, sessions, minutes].some((value) => !Number.isFinite(value) || value < 0) || days <= 0 || sessions <= 0 || minutes <= 0) {
      return null;
    }

    const totalTopics = weak + medium + strong;
    const revisionBlocks = weak * 3 + medium * 2 + strong;
    const totalSessions = days * sessions;
    const blocksPerDay = revisionBlocks / days;
    const blocksPerSession = revisionBlocks / totalSessions;
    const dailyMinutes = sessions * minutes;
    const focus = totalTopics > 0 ? (weak / totalTopics) * 100 : 0;

    return {
      totalTopics,
      revisionBlocks,
      totalSessions,
      blocksPerDay,
      blocksPerSession,
      dailyMinutes,
      focus,
      recommendation:
        focus >= 45 ? "Heavy weak-topic focus"
        : focus >= 25 ? "Balanced recovery plan"
          : "Light revision mix",
    };
  }, [daysLeft, mediumTopics, minutesPerSession, sessionsPerDay, strongTopics, weakTopics]);

  return (
    <StudentToolPageShell
      title="Revision Planner Tool"
      seoTitle="Revision Planner Tool - Plan Revision Sessions Before Exams"
      seoDescription="Plan revision sessions by weak, medium, and strong topics with days left and daily study sessions using this free revision planner tool."
      canonical="https://usonlinetools.com/education/revision-planner-tool"
      heroDescription="Build a realistic revision plan before exams by separating weak, medium, and strong topics. The planner converts that priority mix into daily revision blocks and session targets."
      heroIcon={<GraduationCap className="w-3.5 h-3.5" />}
      calculatorLabel="Revision Load Planner"
      calculatorDescription="Prioritize weak topics and convert them into a day-by-day revision plan."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <BookCheck className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Set your revision mix</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Weak Topics</label>
                <input type="number" min="0" value={weakTopics} onChange={(event) => setWeakTopics(event.target.value)} className="tool-calc-input w-full" placeholder="5" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Medium Topics</label>
                <input type="number" min="0" value={mediumTopics} onChange={(event) => setMediumTopics(event.target.value)} className="tool-calc-input w-full" placeholder="7" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Strong Topics</label>
                <input type="number" min="0" value={strongTopics} onChange={(event) => setStrongTopics(event.target.value)} className="tool-calc-input w-full" placeholder="4" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Days Left</label>
                <input type="number" min="1" value={daysLeft} onChange={(event) => setDaysLeft(event.target.value)} className="tool-calc-input w-full" placeholder="12" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Sessions Per Day</label>
                <input type="number" min="1" value={sessionsPerDay} onChange={(event) => setSessionsPerDay(event.target.value)} className="tool-calc-input w-full" placeholder="3" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Minutes Per Session</label>
                <input type="number" min="1" value={minutesPerSession} onChange={(event) => setMinutesPerSession(event.target.value)} className="tool-calc-input w-full" placeholder="40" />
              </div>
            </div>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Revision Recommendation</p>
                <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{result.recommendation}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Revision Blocks</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.revisionBlocks, 1)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Blocks Per Day</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.blocksPerDay, 2)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Blocks Per Session</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.blocksPerSession, 2)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Daily Minutes</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.dailyMinutes, 0)}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-violet-500" />
                  <p className="font-bold text-foreground">Weak-topic emphasis</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Weak topics account for about <span className="font-bold text-foreground">{formatPercent(result.focus)}%</span> of your topic pool, so the revision plan should keep returning to them more often than strong topics.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid topic counts, days, sessions, and session length to build a revision plan.</p>
          )}
        </div>
      }
      howToTitle="How to Use the Revision Planner Tool"
      howToIntro="A good revision plan is not just about how many topics remain. It is about which topics are weak, which are stable, and how much time is left before the exam."
      howSteps={[
        { title: "Separate weak, medium, and strong topics", description: "This matters because weak topics usually need more than one revision pass, while strong topics may only need a brief refresh." },
        { title: "Set the time you actually have left", description: "Enter the number of days, sessions per day, and session length so the plan matches your real revision window." },
        { title: "Use blocks instead of vague topic totals", description: "The planner converts topic difficulty into revision blocks so weak topics naturally receive more attention." },
      ]}
      formulaTitle="Revision Planning Logic"
      formulaIntro="Not all topics deserve the same revision effort. This planner weights weaker topics more heavily so the schedule reflects where improvement is actually needed."
      formulaCards={[
        { label: "Revision Blocks", formula: "Blocks = (Weak x 3) + (Medium x 2) + (Strong x 1)", detail: "Weak topics are intentionally counted multiple times because they usually need repeated review." },
        { label: "Blocks Per Day", formula: "Blocks Per Day = Total Revision Blocks / Days Left", detail: "This shows how much revision density your remaining schedule needs to handle." },
      ]}
      examplesTitle="Revision Planner Examples"
      examplesIntro="These examples show how revision planning changes once topic strength is considered."
      examples={[
        { title: "Weak-topic heavy plan", value: "More repeat review", detail: "If many topics are weak, the planner increases block count so they are revisited more than once." },
        { title: "Balanced revision window", value: "Steady daily load", detail: "A moderate number of daily blocks is easier to sustain than trying to cram all review into the final days." },
        { title: "Session structure", value: "Blocks per session", detail: "This helps you see whether each revision session looks realistic or overloaded." },
      ]}
      contentTitle="Why Revision Planning Should Be Weighted"
      contentIntro="Students often treat every chapter equally even when some topics are already strong and others are weak. That wastes time close to an exam."
      contentSections={[
        { title: "Why weak topics need repeat exposure", paragraphs: ["A topic you barely understand usually needs multiple passes, active recall, and mistake review before it becomes stable.", "That is why the planner gives weak topics more revision blocks than strong ones."] },
        { title: "Why strong topics still matter", paragraphs: ["Strong topics still need some revision so they stay fresh for exam day, but they usually do not need the same repeated depth.", "A good plan protects strong topics without letting them dominate the revision timetable."] },
        { title: "Why daily block planning helps", paragraphs: ["When revision is converted into daily blocks, it becomes easier to see whether the plan is practical before exam pressure peaks.", "This gives you time to adjust sessions, reduce scope, or start earlier if the numbers feel too high."] },
      ]}
      faqs={[
        { q: "Why count weak topics more than strong topics?", a: "Weak topics usually need repeated revision, so a weighted plan is more realistic than giving every topic the same attention." },
        { q: "What is a revision block?", a: "A revision block is one planned review unit. It could be a topic pass, a flashcard cycle, a problem set, or a focused recap." },
        { q: "Can I use this with flashcards or practice questions?", a: "Yes. The block idea works with flashcards, summaries, question drills, or mixed revision methods." },
        { q: "What if the blocks per day are too high?", a: "That usually means the revision window is too short or the topic pool is too large, so you may need to increase sessions, reduce scope, or start earlier." },
      ]}
      relatedTools={[
        { title: "Flashcard Timer Tool", href: "/education/flashcard-timer-tool", benefit: "Run timed rounds for the blocks you plan here." },
        { title: "Study Planner Calculator", href: "/education/study-planner-calculator", benefit: "Turn the revision load into daily time estimates." },
        { title: "Exam Countdown Timer", href: "/education/exam-countdown-timer", benefit: "Keep the revision plan anchored to the exam date." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Exam Revision", detail: "Useful when you need to prioritize topics rather than just list them." },
        { label: "Core Output", value: "Daily Blocks", detail: "Shows how many revision units you need per day and per session." },
        { label: "Main Principle", value: "Weighted Review", detail: "Weak topics deserve more repeat attention than strong ones." },
      ]}
    />
  );
}
