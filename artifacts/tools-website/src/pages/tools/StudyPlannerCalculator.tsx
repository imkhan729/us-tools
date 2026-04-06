import { useMemo, useState } from "react";
import { Clock, GraduationCap, Target } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

export default function StudyPlannerCalculator() {
  const [topics, setTopics] = useState("12");
  const [daysLeft, setDaysLeft] = useState("14");
  const [studyHours, setStudyHours] = useState("28");
  const [sessionsPerDay, setSessionsPerDay] = useState("2");

  const result = useMemo(() => {
    const totalTopics = parseFloat(topics);
    const totalDays = parseFloat(daysLeft);
    const totalHours = parseFloat(studyHours);
    const dailySessions = parseFloat(sessionsPerDay);

    if (!Number.isFinite(totalTopics) || !Number.isFinite(totalDays) || !Number.isFinite(totalHours) || !Number.isFinite(dailySessions) || totalTopics <= 0 || totalDays <= 0 || totalHours <= 0 || dailySessions <= 0) {
      return null;
    }

    const hoursPerDay = totalHours / totalDays;
    const topicsPerDay = totalTopics / totalDays;
    const minutesPerSession = (hoursPerDay * 60) / dailySessions;
    const minutesPerTopic = (totalHours * 60) / totalTopics;

    return {
      hoursPerDay,
      topicsPerDay,
      minutesPerSession,
      minutesPerTopic,
    };
  }, [daysLeft, sessionsPerDay, studyHours, topics]);

  return (
    <StudentToolPageShell
      title="Study Planner Calculator"
      seoTitle="Study Planner Calculator - Build A Daily Study Schedule"
      seoDescription="Plan your study schedule based on topics, days left, study hours, and sessions per day. Free study planner calculator for students and exam prep."
      canonical="https://usonlinetools.com/education/study-planner-calculator"
      heroDescription="Turn your revision workload into a realistic day-by-day study plan. This study planner calculator helps you estimate daily hours, topics per day, and session length before exams."
      heroIcon={<GraduationCap className="w-3.5 h-3.5" />}
      calculatorLabel="Daily Study Plan"
      calculatorDescription="Estimate how much to study each day from your remaining workload."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Plan your study load</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Topics Or Chapters Left</label>
                <input type="number" min="1" value={topics} onChange={(event) => setTopics(event.target.value)} className="tool-calc-input w-full" placeholder="12" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Days Left</label>
                <input type="number" min="1" value={daysLeft} onChange={(event) => setDaysLeft(event.target.value)} className="tool-calc-input w-full" placeholder="14" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Study Hours Needed</label>
                <input type="number" min="1" value={studyHours} onChange={(event) => setStudyHours(event.target.value)} className="tool-calc-input w-full" placeholder="28" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Sessions Per Day</label>
                <input type="number" min="1" value={sessionsPerDay} onChange={(event) => setSessionsPerDay(event.target.value)} className="tool-calc-input w-full" placeholder="2" />
              </div>
            </div>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Daily Study Time</p>
                <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{formatPercent(result.hoursPerDay, 2)} hrs</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Topics Per Day</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.topicsPerDay, 2)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Minutes Per Session</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.minutesPerSession, 0)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Minutes Per Topic</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.minutesPerTopic, 0)}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid values greater than zero to build a study plan.</p>
          )}

          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-violet-500" />
              <h3 className="text-lg font-bold text-foreground">Practical tip</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If the daily hours feel too high, either reduce the total material, increase the number of days, or add more short sessions instead of relying on one long session.
            </p>
          </div>
        </div>
      }
      howToTitle="How to Use the Study Planner Calculator"
      howToIntro="This tool is designed for students who know roughly how much material is left and want a realistic daily study target before an exam or deadline."
      howSteps={[
        {
          title: "Estimate your remaining workload",
          description: "Count the chapters, topics, or major revision blocks you still need to cover. Use the same type of unit consistently across the plan.",
        },
        {
          title: "Enter the time you have left",
          description: "Add the number of days until your exam or target date, then estimate how many total study hours the remaining material will realistically require.",
        },
        {
          title: "Use sessions to make the plan practical",
          description: "Breaking the daily total into two or three sessions usually creates a more realistic plan than one long block, especially during school or college terms.",
        },
      ]}
      formulaTitle="Study Planning Formulas"
      formulaIntro="A study plan becomes useful when you break a large workload into daily and per-session targets."
      formulaCards={[
        {
          label: "Daily Hours",
          formula: "Daily Hours = Total Study Hours / Days Left",
          detail: "This gives the average amount of time you need to study each day to finish on schedule.",
        },
        {
          label: "Topics Per Day",
          formula: "Topics Per Day = Topics Left / Days Left",
          detail: "This turns a vague revision list into a concrete daily coverage goal.",
        },
      ]}
      examplesTitle="Study Planner Examples"
      examplesIntro="These examples show how a rough revision estimate can be turned into a manageable schedule."
      examples={[
        {
          title: "Two-Week Plan",
          value: "2 hrs/day",
          detail: "If you need 28 study hours over 14 days, your daily target is 2 hours.",
        },
        {
          title: "Topic Pace",
          value: "0.86/day",
          detail: "With 12 topics across 14 days, you need to cover just under one topic per day on average.",
        },
        {
          title: "Session Length",
          value: "60 min",
          detail: "If you study twice per day and need 2 hours total, each session is about 60 minutes.",
        },
      ]}
      contentTitle="Why Study Planning Works Better Than Guesswork"
      contentIntro="Students often underestimate how long revision will take. A simple planner turns that uncertainty into a realistic schedule that is easier to follow and adjust."
      contentSections={[
        {
          title: "Why daily targets matter",
          paragraphs: [
            "Large revision goals feel overwhelming because they are not tied to a daily action. Once the workload is converted into hours per day and topics per day, it becomes easier to start.",
            "A clear daily target also helps you spot early when the plan is unrealistic and still needs adjusting.",
          ],
        },
        {
          title: "Why short sessions can work better",
          paragraphs: [
            "Long study blocks often fail because energy and attention drop. Splitting the workload into shorter sessions can make the same total study time more sustainable.",
            "Session planning is especially useful for school days when students need to fit revision around classes, homework, or commuting.",
          ],
        },
        {
          title: "What this planner does not know",
          paragraphs: [
            "This calculator gives a structured estimate, but it cannot judge topic difficulty. Some topics will take much longer than others, so the plan should be reviewed and adjusted as you go.",
            "It also assumes all study hours are reasonably productive. If your real focus time is lower, reduce the daily topic target or increase available days.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How do I make a study plan for an exam?",
          a: "Estimate how many topics and study hours are left, divide them by the number of days available, and then break the daily workload into manageable sessions.",
        },
        {
          q: "What if the daily study hours are too high?",
          a: "That usually means the plan is too ambitious. Reduce the workload, increase the available days, or spread the time over more sessions.",
        },
        {
          q: "Should I plan by hours or topics?",
          a: "Both are useful. Hours show time commitment, while topics show content coverage. Combining them gives a more realistic plan.",
        },
        {
          q: "Can I use this for school homework too?",
          a: "Yes, but it works best for larger revision plans, exam prep, coursework backlog, or multi-day study schedules.",
        },
      ]}
      relatedTools={[
        { title: "Homework Time Calculator", href: "/education/homework-time-calculator", benefit: "Estimate task time and finish times for daily work." },
        { title: "Reading Speed Calculator", href: "/education/reading-speed-calculator", benefit: "Estimate how long reading-heavy topics may take." },
        { title: "Score Calculator", href: "/education/score-calculator", benefit: "Track assessment totals alongside your study plan." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Exam Prep", detail: "Useful for revision planning before tests, finals, and entrance exams." },
        { label: "Core Output", value: "Daily Plan", detail: "Shows hours per day, topics per day, and session length." },
        { label: "Key Reminder", value: "Adjust As You Go", detail: "Real study plans improve when you update them after a few days." },
      ]}
    />
  );
}
