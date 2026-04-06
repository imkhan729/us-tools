import { useMemo, useState } from "react";
import { AlarmClock, CalendarDays } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default function ExamCountdownTimer() {
  const [examDate, setExamDate] = useState("2026-05-20");
  const [topicsLeft, setTopicsLeft] = useState("18");
  const [hoursPerTopic, setHoursPerTopic] = useState("2.5");

  const result = useMemo(() => {
    const targetDate = new Date(`${examDate}T00:00:00`);
    const topicCount = parseFloat(topicsLeft);
    const hoursNeededPerTopic = parseFloat(hoursPerTopic);

    if (
      Number.isNaN(targetDate.getTime()) ||
      !Number.isFinite(topicCount) ||
      !Number.isFinite(hoursNeededPerTopic) ||
      topicCount < 0 ||
      hoursNeededPerTopic < 0
    ) {
      return null;
    }

    const today = startOfLocalDay(new Date());
    const examDay = startOfLocalDay(targetDate);
    const rawDaysLeft = Math.ceil((examDay.getTime() - today.getTime()) / MS_PER_DAY);
    const daysLeft = Math.max(rawDaysLeft, 0);
    const activeStudyDays = Math.max(daysLeft, 1);
    const totalStudyHours = topicCount * hoursNeededPerTopic;
    const hoursPerDay = totalStudyHours / activeStudyDays;
    const topicsPerWeek = daysLeft > 0 ? topicCount / (daysLeft / 7) : topicCount;

    let paceLabel = "Steady pace";
    if (hoursPerDay > 5) paceLabel = "High intensity";
    else if (hoursPerDay < 1.5) paceLabel = "Comfortable pace";

    return {
      daysLeft,
      weeksLeft: daysLeft / 7,
      totalStudyHours,
      hoursPerDay,
      topicsPerWeek,
      paceLabel,
      isPast: rawDaysLeft < 0,
      isToday: rawDaysLeft === 0,
    };
  }, [examDate, hoursPerTopic, topicsLeft]);

  return (
    <StudentToolPageShell
      title="Exam Countdown Timer"
      seoTitle="Exam Countdown Timer - Days Left Until Your Exam"
      seoDescription="Track days left until your exam, estimate study hours required, and set a realistic revision pace with this free online exam countdown timer."
      canonical="https://usonlinetools.com/education/exam-countdown-timer"
      heroDescription="Count down to your next exam, see how much revision time is left, and turn the remaining days into a realistic topic-by-topic study plan."
      heroIcon={<CalendarDays className="w-3.5 h-3.5" />}
      calculatorLabel="Exam Countdown Planner"
      calculatorDescription="See days left, total study hours, and the daily pace needed to finish revision before exam day."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Days left until exam</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Exam Date</label>
                <input type="date" value={examDate} onChange={(event) => setExamDate(event.target.value)} className="tool-calc-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Topics Left</label>
                <input type="number" min="0" value={topicsLeft} onChange={(event) => setTopicsLeft(event.target.value)} className="tool-calc-input w-full" placeholder="18" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Hours Per Topic</label>
                <input type="number" min="0" step="0.25" value={hoursPerTopic} onChange={(event) => setHoursPerTopic(event.target.value)} className="tool-calc-input w-full" placeholder="2.5" />
              </div>
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Countdown</p>
                  <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{result.daysLeft}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {result.isPast
                      ? "That exam date has already passed."
                      : result.isToday
                        ? "Your exam is today."
                        : `About ${formatPercent(result.weeksLeft)} weeks remaining.`}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Study Hours Left</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(result.totalStudyHours)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Hours Per Day</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(result.hoursPerDay)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Topics Per Week</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(result.topicsPerWeek)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Enter a valid exam date, topics count, and hours per topic.</p>
            )}
          </div>

          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlarmClock className="w-4 h-4 text-violet-500" />
              <h3 className="text-lg font-bold text-foreground">Revision pace</h3>
            </div>
            {result ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Suggested Pace</p>
                  <p className="text-3xl font-black text-violet-600 dark:text-violet-400">{result.paceLabel}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Daily Goal</p>
                  <p className="text-3xl font-black text-foreground">{formatPercent(result.hoursPerDay)} hrs</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Add your exam date and revision estimate to see your pace.</p>
            )}
          </div>
        </div>
      }
      howToTitle="How to Use the Exam Countdown Timer"
      howToIntro="A countdown is most useful when it does more than display a date difference. This tool turns the remaining time into a practical revision target so you can decide whether your current plan is realistic."
      howSteps={[
        {
          title: "Choose your exam date",
          description: "Enter the exact day of the exam so the timer can calculate how many study days remain from today.",
        },
        {
          title: "Estimate how much revision is left",
          description: "Count the chapters, topics, or question sets you still need to complete and enter the average hours each one will take.",
        },
        {
          title: "Use the pace summary to plan your week",
          description: "The result shows total hours left, daily study time, and the number of topics you need to clear each week before exam day.",
        },
      ]}
      formulaTitle="Exam Countdown Formulas"
      formulaIntro="Exam preparation often starts with time pressure, but the useful part is translating time pressure into a study pace you can actually follow."
      formulaCards={[
        {
          label: "Days Left",
          formula: "Days Left = Exam Date - Today's Date",
          detail: "This counts how many calendar days remain until the exam so you know the size of the revision window.",
        },
        {
          label: "Required Daily Study Time",
          formula: "Hours Per Day = Total Study Hours Left / Days Left",
          detail: "If your revision backlog is 45 hours and you have 30 days left, you need about 1.5 focused study hours per day.",
        },
      ]}
      examplesTitle="Exam Countdown Examples"
      examplesIntro="These are typical ways students use countdown planners during the weeks before midterms, finals, and entrance exams."
      examples={[
        {
          title: "Midterm Revision",
          value: "24 days",
          detail: "A student with 24 days left and 12 topics remaining can immediately see whether their current study pace is enough.",
        },
        {
          title: "Revision Load",
          value: "45 hours",
          detail: "If 18 topics need 2.5 hours each, the student has around 45 hours of work remaining before the exam.",
        },
        {
          title: "Daily Plan",
          value: "1.9 hrs/day",
          detail: "Forty-five hours spread over 24 days means a manageable but consistent daily revision target.",
        },
      ]}
      contentTitle="Why an Exam Countdown Helps"
      contentIntro="Many students underestimate how quickly the final two or three weeks disappear. A plain calendar date does not create urgency by itself, but a countdown tied to revision workload makes the gap visible."
      contentSections={[
        {
          title: "Why counting days changes study behavior",
          paragraphs: [
            "When you know the exact number of days remaining, it becomes harder to postpone revision because the schedule stops feeling abstract.",
            "A countdown also helps you spot early whether your plan is realistic. If the required daily study time is too high, you can reduce scope or increase study time before the situation becomes urgent.",
          ],
        },
        {
          title: "Why topic estimates matter",
          paragraphs: [
            "Students usually think in chapters, modules, or past papers rather than raw hours. Estimating hours per topic converts the countdown into an actionable revision map.",
            "Even rough estimates are useful because they help you compare the remaining workload with the time actually left before the exam.",
          ],
        },
        {
          title: "Best way to use the result",
          paragraphs: [
            "Use the daily hours target as a planning benchmark, not a punishment. If the pace looks too high, split the work into high-priority and low-priority topics.",
            "Recalculate every few days as you finish topics. The planner becomes more accurate as your backlog shrinks and your exam date gets closer.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How is the exam countdown calculated?",
          a: "The tool compares today's local date with the exam date you enter, then reports the number of calendar days left before the exam.",
        },
        {
          q: "Why does the tool ask for topics left and hours per topic?",
          a: "That turns the countdown into a real revision planner by showing how many hours and topics you need to finish each day or week.",
        },
        {
          q: "What if my exam is today?",
          a: "The countdown shows zero days left, which is useful for last-day review and time awareness, but it also means your revision window has effectively ended.",
        },
        {
          q: "Should I include breaks in my hours per topic estimate?",
          a: "Yes. If you want a realistic schedule, include short breaks, review time, and any time you normally spend checking answers or notes.",
        },
      ]}
      relatedTools={[
        { title: "Study Planner Calculator", href: "/education/study-planner-calculator", benefit: "Turn your remaining work into a daily study schedule." },
        { title: "Homework Time Calculator", href: "/education/homework-time-calculator", benefit: "Estimate time needed for assignments and coursework." },
        { title: "Learning Time Calculator", href: "/education/learning-time-calculator", benefit: "Estimate how long a bigger skill-building plan will take." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Exam Prep", detail: "Useful before midterms, finals, board exams, and entrance tests." },
        { label: "Core Output", value: "Days Left", detail: "Also shows required study pace in hours per day and topics per week." },
        { label: "Planner Style", value: "Practical", detail: "Connects a countdown directly to remaining revision work." },
      ]}
    />
  );
}
