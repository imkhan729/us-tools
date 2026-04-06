import { useMemo, useState } from "react";
import { BookOpen, Brain, TimerReset } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

export default function LearningTimeCalculator() {
  const [totalHoursNeeded, setTotalHoursNeeded] = useState("120");
  const [hoursPerWeek, setHoursPerWeek] = useState("8");
  const [sessionMinutes, setSessionMinutes] = useState("50");

  const result = useMemo(() => {
    const totalHours = parseFloat(totalHoursNeeded);
    const weeklyHours = parseFloat(hoursPerWeek);
    const minutesPerSession = parseFloat(sessionMinutes);

    if (
      !Number.isFinite(totalHours) ||
      !Number.isFinite(weeklyHours) ||
      !Number.isFinite(minutesPerSession) ||
      totalHours < 0 ||
      weeklyHours <= 0 ||
      minutesPerSession <= 0
    ) {
      return null;
    }

    const weeksNeeded = totalHours / weeklyHours;
    const monthsNeeded = weeksNeeded / 4.345;
    const sessionHours = minutesPerSession / 60;
    const sessionsNeeded = totalHours / sessionHours;
    const sessionsPerWeek = weeklyHours / sessionHours;

    return {
      weeksNeeded,
      monthsNeeded,
      sessionsNeeded,
      sessionsPerWeek,
      totalHours,
    };
  }, [totalHoursNeeded, hoursPerWeek, sessionMinutes]);

  return (
    <StudentToolPageShell
      title="Learning Time Calculator"
      seoTitle="Learning Time Calculator - Estimate How Long A Skill Will Take"
      seoDescription="Estimate how many weeks, months, and study sessions it will take to learn a new skill with this free online learning time calculator."
      canonical="https://usonlinetools.com/education/learning-time-calculator"
      heroDescription="Estimate how long a new skill, course, or subject will take based on the total learning hours required and the time you can consistently invest each week."
      heroIcon={<BookOpen className="w-3.5 h-3.5" />}
      calculatorLabel="Skill Learning Estimator"
      calculatorDescription="Convert a learning goal into weeks, months, and study sessions based on your available weekly time."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Estimate learning duration</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Learning Hours</label>
                <input type="number" min="0" value={totalHoursNeeded} onChange={(event) => setTotalHoursNeeded(event.target.value)} className="tool-calc-input w-full" placeholder="120" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Hours Available Per Week</label>
                <input type="number" min="0.25" step="0.25" value={hoursPerWeek} onChange={(event) => setHoursPerWeek(event.target.value)} className="tool-calc-input w-full" placeholder="8" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Minutes Per Study Session</label>
                <input type="number" min="5" step="5" value={sessionMinutes} onChange={(event) => setSessionMinutes(event.target.value)} className="tool-calc-input w-full" placeholder="50" />
              </div>
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Estimated Timeline</p>
                  <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{formatPercent(result.weeksNeeded)} weeks</p>
                  <p className="text-sm text-muted-foreground mt-2">About {formatPercent(result.monthsNeeded)} months at your current weekly pace.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Sessions Needed</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(result.sessionsNeeded)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Sessions Per Week</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(result.sessionsPerWeek)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Hours Required</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(result.totalHours)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Enter valid learning hours, weekly study time, and session length.</p>
            )}
          </div>

          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <TimerReset className="w-4 h-4 text-violet-500" />
              <h3 className="text-lg font-bold text-foreground">Weekly learning rhythm</h3>
            </div>
            {result ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Weekly Commitment</p>
                  <p className="text-3xl font-black text-violet-600 dark:text-violet-400">{hoursPerWeek} hrs</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Study Sessions / Week</p>
                  <p className="text-3xl font-black text-foreground">{formatPercent(result.sessionsPerWeek)}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Add a weekly time budget to see how the learning plan breaks into sessions.</p>
            )}
          </div>
        </div>
      }
      howToTitle="How to Use the Learning Time Calculator"
      howToIntro="Learning goals often fail because students focus on the destination without translating it into a realistic weekly commitment. This calculator does that translation for you."
      howSteps={[
        {
          title: "Estimate the total learning hours",
          description: "Use the number of hours you think the subject, language, software skill, or course will require overall.",
        },
        {
          title: "Enter the time you can study each week",
          description: "Use the weekly schedule you can realistically maintain, not the ideal schedule you might only follow for a few days.",
        },
        {
          title: "Set a typical session length",
          description: "This converts the full plan into sessions, which makes it easier to build a routine and see how many study blocks are still needed.",
        },
      ]}
      formulaTitle="Learning Time Formulas"
      formulaIntro="The core idea is simple: total required learning time divided by weekly study time gives a rough duration estimate. Adding session length makes the plan easier to schedule."
      formulaCards={[
        {
          label: "Weeks Needed",
          formula: "Weeks = Total Learning Hours / Weekly Study Hours",
          detail: "If a skill needs 120 hours and you study 8 hours per week, the plan will take roughly 15 weeks.",
        },
        {
          label: "Sessions Needed",
          formula: "Sessions = Total Learning Hours / Session Length In Hours",
          detail: "Breaking the plan into sessions helps you understand how many focused study blocks the skill will actually require.",
        },
      ]}
      examplesTitle="Learning Time Examples"
      examplesIntro="These examples show how students and self-learners use time estimates when planning longer-term goals."
      examples={[
        {
          title: "Language Goal",
          value: "15 weeks",
          detail: "A 120-hour learning goal at 8 hours per week takes about 15 weeks of consistent study.",
        },
        {
          title: "Session Count",
          value: "144 sessions",
          detail: "At 50 minutes per session, 120 learning hours turns into roughly 144 study sessions.",
        },
        {
          title: "Monthly View",
          value: "3.45 months",
          detail: "The same plan works out to just under three and a half months when averaged over a full calendar month.",
        },
      ]}
      contentTitle="Why Learning-Time Estimates Matter"
      contentIntro="Large learning goals usually feel easy at the start because the workload is invisible. A time estimate turns an abstract ambition into a schedule you can compare with your actual week."
      contentSections={[
        {
          title: "Why total hours are more useful than vague goals",
          paragraphs: [
            "Goals like 'learn Python' or 'improve in biology' are too broad to schedule effectively. Estimating the total time required makes the task concrete.",
            "Once the total hours are visible, you can quickly decide whether your current weekly capacity matches the timeline you want.",
          ],
        },
        {
          title: "Why weekly consistency matters more than occasional long sessions",
          paragraphs: [
            "A realistic weekly rhythm is usually more important than a high-intensity burst of study that you cannot maintain.",
            "This calculator emphasizes weekly time because consistent progress usually predicts completion better than one unusually productive weekend.",
          ],
        },
        {
          title: "How session length helps planning",
          paragraphs: [
            "Students often overestimate what can fit into a week because they think in hours, not in actual study blocks. Sessions provide a more practical planning unit.",
            "Knowing that a goal needs 140 or more sessions changes how you think about pacing, streaks, and time management.",
          ],
        },
      ]}
      faqs={[
        {
          q: "What does the learning time calculator estimate?",
          a: "It estimates how many weeks, months, and study sessions a learning goal may take based on the total hours required and the study time available each week.",
        },
        {
          q: "How do I choose the total learning hours?",
          a: "Use your best estimate based on course size, topic count, instructor guidance, or how long similar skills have taken you before.",
        },
        {
          q: "Why does session length matter?",
          a: "Because it converts the full goal into real study blocks, which is easier to schedule than thinking only in total hours.",
        },
        {
          q: "Is the result exact?",
          a: "No. It is a planning estimate. Actual learning speed depends on prior knowledge, difficulty, focus quality, and how consistently you follow the plan.",
        },
      ]}
      relatedTools={[
        { title: "Study Hours Tracker", href: "/education/study-hours-tracker", benefit: "Track whether your real study time matches the original plan." },
        { title: "Study Planner Calculator", href: "/education/study-planner-calculator", benefit: "Break a learning goal into a repeatable study schedule." },
        { title: "Exam Countdown Timer", href: "/education/exam-countdown-timer", benefit: "Match long-term learning plans with an actual exam deadline." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Skill Planning", detail: "Useful for languages, software skills, certifications, and difficult subjects." },
        { label: "Core Output", value: "Weeks Needed", detail: "Also estimates months and the total number of study sessions." },
        { label: "Planning Lens", value: "Long-Term", detail: "Helps students judge if a goal fits their weekly schedule." },
      ]}
    />
  );
}
