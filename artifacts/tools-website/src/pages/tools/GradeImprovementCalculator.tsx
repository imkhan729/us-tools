import { useMemo, useState } from "react";
import { GraduationCap, LineChart, Target } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

export default function GradeImprovementCalculator() {
  const [currentGpa, setCurrentGpa] = useState("2.8");
  const [completedCredits, setCompletedCredits] = useState("60");
  const [targetGpa, setTargetGpa] = useState("3.2");
  const [futureCredits, setFutureCredits] = useState("30");

  const result = useMemo(() => {
    const current = parseFloat(currentGpa);
    const completed = parseFloat(completedCredits);
    const target = parseFloat(targetGpa);
    const upcoming = parseFloat(futureCredits);

    if (!Number.isFinite(current) || !Number.isFinite(completed) || !Number.isFinite(target) || !Number.isFinite(upcoming) || current < 0 || completed < 0 || target < 0 || upcoming <= 0) {
      return null;
    }

    const neededFutureGpa = (target * (completed + upcoming) - current * completed) / upcoming;
    const cgpaWithStraightAs = (current * completed + 4 * upcoming) / (completed + upcoming);
    const cgpaWithThreePointFive = (current * completed + 3.5 * upcoming) / (completed + upcoming);

    return {
      neededFutureGpa,
      cgpaWithStraightAs,
      cgpaWithThreePointFive,
      achievableWithStraightAs: neededFutureGpa <= 4,
      alreadyAtTarget: current >= target,
    };
  }, [completedCredits, currentGpa, futureCredits, targetGpa]);

  return (
    <StudentToolPageShell
      title="Grade Improvement Calculator"
      seoTitle="Grade Improvement Calculator - GPA Improvement Planning Tool"
      seoDescription="Calculate the future GPA needed to raise your current GPA to a target. Free grade improvement calculator for students planning semester recovery and long-term GPA goals."
      canonical="https://usonlinetools.com/education/grade-improvement-calculator"
      heroDescription="Work backward from your current GPA, completed credits, and target GPA to estimate the semester average you need next and see whether the target is realistically achievable."
      heroIcon={<GraduationCap className="w-3.5 h-3.5" />}
      calculatorLabel="GPA Recovery Planner"
      calculatorDescription="Estimate the average GPA needed over upcoming credits to lift your cumulative GPA to a target."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <LineChart className="h-4 w-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">GPA improvement inputs</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Current GPA</label>
                <input type="number" min="0" max="4" step="0.01" value={currentGpa} onChange={(event) => setCurrentGpa(event.target.value)} className="tool-calc-input w-full" placeholder="2.8" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Completed Credits</label>
                <input type="number" min="0" step="0.5" value={completedCredits} onChange={(event) => setCompletedCredits(event.target.value)} className="tool-calc-input w-full" placeholder="60" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Target GPA</label>
                <input type="number" min="0" max="4" step="0.01" value={targetGpa} onChange={(event) => setTargetGpa(event.target.value)} className="tool-calc-input w-full" placeholder="3.2" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Future Credits To Plan</label>
                <input type="number" min="0.5" step="0.5" value={futureCredits} onChange={(event) => setFutureCredits(event.target.value)} className="tool-calc-input w-full" placeholder="30" />
              </div>
            </div>

            {result ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Needed Future GPA</p>
                  <p
                    className={`text-5xl font-black ${
                      result.alreadyAtTarget
                        ? "text-emerald-600 dark:text-emerald-400"
                        : result.achievableWithStraightAs
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {result.alreadyAtTarget ? "0.00" : result.achievableWithStraightAs ? formatPercent(result.neededFutureGpa) : ">4.00"}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {result.alreadyAtTarget
                      ? "Your current GPA is already at or above the target."
                      : result.achievableWithStraightAs
                        ? "Average GPA needed across the upcoming credits"
                        : "Target is not reachable with a standard 4.0-scale semester average"}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Current GPA</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(parseFloat(currentGpa))}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Target GPA</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(parseFloat(targetGpa))}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Future Credits</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(parseFloat(futureCredits))}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Enter valid GPA and credit values to estimate a recovery plan.</p>
            )}
          </div>

          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-violet-500" />
              <h3 className="text-lg font-bold text-foreground">Scenario check</h3>
            </div>

            {result ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">CGPA With 3.5 Average</p>
                  <p className="text-3xl font-black text-violet-600 dark:text-violet-400">{formatPercent(result.cgpaWithThreePointFive)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">CGPA With Straight A Average</p>
                  <p className="text-3xl font-black text-foreground">{formatPercent(result.cgpaWithStraightAs)}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Enter your GPA details above to compare improvement scenarios.</p>
            )}
          </div>
        </div>
      }
      howToTitle="How to Use the Grade Improvement Calculator"
      howToIntro="This calculator is built for students who want to know whether a GPA goal is still realistic and what semester average would be required to reach it."
      howSteps={[
        {
          title: "Enter your current GPA and completed credits",
          description: "These values represent where you stand right now. The completed-credit count matters because older coursework continues to influence your cumulative GPA.",
        },
        {
          title: "Set a target GPA and the future credits you still plan to complete",
          description: "Use the number of credits remaining in the next semester, year, or degree plan depending on the time horizon you are evaluating.",
        },
        {
          title: "Read both the needed future GPA and the scenario outcomes",
          description: "The page shows the average GPA you would need going forward and also what your cumulative GPA would become under strong and perfect-semester scenarios.",
        },
      ]}
      formulaTitle="Grade Improvement Formulas"
      formulaIntro="Improving GPA is a weighted-average problem. You must account for both the quality of future grades and the amount of coursework still left."
      formulaCards={[
        {
          label: "Current Quality Points",
          formula: "Current Quality Points = Current GPA x Completed Credits",
          detail: "This turns your existing GPA into a weighted total that can be combined with future performance.",
        },
        {
          label: "Needed Future GPA",
          formula: "Needed GPA = (Target x Total Credits - Current GPA x Completed Credits) / Future Credits",
          detail: "This works backward from the desired cumulative GPA to show the average GPA required across your remaining credits.",
        },
      ]}
      examplesTitle="Grade Improvement Examples"
      examplesIntro="These examples show why GPA recovery is mostly about both timing and the number of credits still available."
      examples={[
        {
          title: "Early Recovery",
          value: "More flexible",
          detail: "Students with fewer completed credits can often raise GPA faster because future coursework has more room to shift the average.",
        },
        {
          title: "Late Recovery",
          value: "Harder lift",
          detail: "Once many credits are already locked in, even very strong semesters move the cumulative GPA more slowly.",
        },
        {
          title: "Reality Check",
          value: "Reachable or not",
          detail: "If the needed future GPA is above 4.0, the target is mathematically out of reach without grade replacement or a policy exception.",
        },
      ]}
      contentTitle="Why GPA Improvement Needs a Weighted Plan"
      contentIntro="Students often underestimate how much completed coursework anchors the GPA. A recovery target needs to consider both the current average and the number of credits still left to influence it."
      contentSections={[
        {
          title: "Why low GPAs are easier to fix early",
          paragraphs: [
            "If you have completed only a small number of credits, each future course has more influence over the cumulative average.",
            "That makes early intervention important. Waiting until the final semesters usually means the same strong grades produce a much smaller improvement.",
          ],
        },
        {
          title: "Why target GPA can become impossible",
          paragraphs: [
            "A target becomes unreachable when the future GPA needed exceeds the top of the grading scale. On a standard 4.0 scale, anything above 4.0 means the target cannot be reached through normal coursework alone.",
            "In those cases, students may need to lower the target, extend the planning horizon, or use grade-replacement policies if their school offers them.",
          ],
        },
        {
          title: "How to use the scenario outputs",
          paragraphs: [
            "The scenario checks are useful because students rarely earn the exact needed GPA average. Comparing a realistic strong semester, such as 3.5, against a perfect 4.0 helps set expectations.",
            "That comparison also helps with decisions about course load, retakes, and whether the target should be adjusted.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How do I calculate the GPA needed to improve my cumulative GPA?",
          a: "Use your current GPA, completed credits, target GPA, and future planned credits. The calculator solves the weighted-average equation for the future GPA required.",
        },
        {
          q: "Why is my needed GPA above 4.0?",
          a: "That means the target is mathematically unreachable under a normal 4.0 system with the number of future credits entered.",
        },
        {
          q: "Can I still improve my GPA even if I miss the target?",
          a: "Yes. Missing one target does not mean no improvement is possible. The calculator is for planning the level of improvement, not only all-or-nothing success.",
        },
        {
          q: "Should I include transferred or repeated credits?",
          a: "Include them only if they count toward your institution's cumulative GPA. Policies differ on transfer grades and course retakes.",
        },
      ]}
      relatedTools={[
        { title: "CGPA Calculator", href: "/education/cgpa-calculator", benefit: "Track cumulative GPA across multiple semesters." },
        { title: "GPA Calculator", href: "/education/gpa-calculator", benefit: "Calculate GPA from current course grades and credits." },
        { title: "Final Grade Calculator", href: "/education/final-grade-calculator", benefit: "Estimate the score needed in one course to protect your GPA." },
      ]}
      quickFacts={[
        { label: "Best For", value: "GPA Recovery Planning", detail: "Useful for semester planning, academic probation recovery, and long-term goal setting." },
        { label: "Core Output", value: "Needed Future GPA", detail: "Shows the average GPA required across upcoming credits." },
        { label: "Important Note", value: "Credits Control Recovery", detail: "The more completed credits you already have, the harder large GPA jumps become." },
      ]}
    />
  );
}
