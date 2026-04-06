import { useMemo, useState } from "react";
import { BookOpen, Calculator, Target } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent, getLetterGrade } from "./studentGradeUtils";

export default function AssignmentGradeCalculator() {
  const [earnedPoints, setEarnedPoints] = useState("42");
  const [totalPoints, setTotalPoints] = useState("50");
  const [assignmentWeight, setAssignmentWeight] = useState("15");
  const [targetPercent, setTargetPercent] = useState("90");

  const result = useMemo(() => {
    const earned = parseFloat(earnedPoints);
    const total = parseFloat(totalPoints);
    const weight = parseFloat(assignmentWeight);
    const desiredPercent = parseFloat(targetPercent);

    if (!Number.isFinite(earned) || !Number.isFinite(total) || !Number.isFinite(weight) || total <= 0 || earned < 0 || earned > total || weight < 0 || weight > 100) {
      return null;
    }

    const percentage = (earned / total) * 100;
    const weightedContribution = percentage * (weight / 100);
    const missedPoints = total - earned;
    const targetPoints = Number.isFinite(desiredPercent) ? (desiredPercent / 100) * total : null;
    const additionalPointsNeeded = targetPoints === null ? null : Math.max(0, targetPoints - earned);
    const band = getLetterGrade(percentage);

    return {
      percentage,
      weightedContribution,
      missedPoints,
      targetPoints,
      additionalPointsNeeded,
      band,
    };
  }, [assignmentWeight, earnedPoints, targetPercent, totalPoints]);

  return (
    <StudentToolPageShell
      title="Assignment Grade Calculator"
      seoTitle="Assignment Grade Calculator - Calculate Assignment Percentage and Weight"
      seoDescription="Calculate assignment grade percentage, weighted course contribution, and target points needed. Free assignment grade calculator for homework, projects, and coursework."
      canonical="https://usonlinetools.com/education/assignment-grade-calculator"
      heroDescription="Calculate an assignment percentage from earned points, estimate how much that assignment contributes to the overall course grade, and see the points needed for a target assignment score."
      heroIcon={<BookOpen className="w-3.5 h-3.5" />}
      calculatorLabel="Assignment Score Planner"
      calculatorDescription="Convert assignment points into a percentage, weighted contribution, and target-points estimate."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Assignment grade</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Earned Points</label>
                <input type="number" min="0" value={earnedPoints} onChange={(event) => setEarnedPoints(event.target.value)} className="tool-calc-input w-full" placeholder="42" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Points</label>
                <input type="number" min="1" value={totalPoints} onChange={(event) => setTotalPoints(event.target.value)} className="tool-calc-input w-full" placeholder="50" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Assignment Weight %</label>
                <input type="number" min="0" max="100" value={assignmentWeight} onChange={(event) => setAssignmentWeight(event.target.value)} className="tool-calc-input w-full" placeholder="15" />
              </div>
            </div>

            {result ? (
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Assignment Percentage</p>
                    <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{formatPercent(result.percentage)}%</p>
                    <p className="mt-2 text-sm text-muted-foreground">{result.band.grade} band · GPA {result.band.gpa.toFixed(1)}</p>
                  </div>
                  <div className="rounded-2xl border border-violet-500/20 bg-background p-5 text-center">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Course Contribution</p>
                    <p className="text-5xl font-black text-violet-600 dark:text-violet-400">{formatPercent(result.weightedContribution)}</p>
                    <p className="mt-2 text-sm text-muted-foreground">Percentage points toward the final course grade</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Missed Points</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(result.missedPoints)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Weight Used</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(parseFloat(assignmentWeight), 0)}%</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Score Ratio</p>
                    <p className="text-2xl font-black text-foreground">
                      {formatPercent(parseFloat(earnedPoints), 0)} / {formatPercent(parseFloat(totalPoints), 0)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Enter valid point values. Earned points cannot be greater than total points.</p>
            )}
          </div>

          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-violet-500" />
              <h3 className="text-lg font-bold text-foreground">Target points planner</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_2fr]">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Target Assignment %</label>
                <input type="number" min="0" max="100" value={targetPercent} onChange={(event) => setTargetPercent(event.target.value)} className="tool-calc-input w-full" placeholder="90" />
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Needed for target</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {result && result.targetPoints !== null
                    ? `A ${formatPercent(parseFloat(targetPercent), 0)}% assignment score requires ${formatPercent(result.targetPoints)} points out of ${formatPercent(parseFloat(totalPoints), 0)}.`
                    : "Enter a target percentage to estimate the points needed on this assignment."}
                </p>
                {result && result.additionalPointsNeeded !== null && (
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {result.additionalPointsNeeded <= 0
                      ? "You are already at or above the target assignment percentage."
                      : `You need ${formatPercent(result.additionalPointsNeeded)} more points to reach the target.`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      }
      howToTitle="How to Use the Assignment Grade Calculator"
      howToIntro="Use this calculator when you want to know both your raw assignment percentage and how much that assignment matters inside a weighted course."
      howSteps={[
        {
          title: "Enter the points you earned and the total available",
          description: "This gives the assignment's raw percentage score. The tool works for homework, projects, essays, lab reports, and classroom tasks.",
        },
        {
          title: "Add the assignment weight if the course uses weighted grading",
          description: "If the assignment counts for 10%, 15%, or another portion of the final course grade, enter that percentage to see its direct contribution.",
        },
        {
          title: "Use the target planner for improvement or retake goals",
          description: "If you want to know the score needed for an A-level assignment or a pass threshold, the target section converts that percentage into required points.",
        },
      ]}
      formulaTitle="Assignment Grade Formulas"
      formulaIntro="Assignment grading is usually a two-part question: first the assignment percentage, then the weighted course impact if the assignment counts toward a larger final grade."
      formulaCards={[
        {
          label: "Assignment Percentage",
          formula: "Assignment % = (Earned Points / Total Points) x 100",
          detail: "If you score 42 out of 50, your assignment percentage is 84%.",
        },
        {
          label: "Weighted Contribution",
          formula: "Course Contribution = Assignment % x (Weight / 100)",
          detail: "An assignment score of 84% with a 15% course weight contributes 12.6 percentage points to the course grade.",
        },
      ]}
      examplesTitle="Assignment Grade Examples"
      examplesIntro="These examples show how one assignment can matter differently depending on the course structure."
      examples={[
        {
          title: "Homework Score",
          value: "84%",
          detail: "Scoring 42 out of 50 gives an assignment percentage of 84%.",
        },
        {
          title: "Weighted Course Impact",
          value: "12.6 points",
          detail: "If that assignment is worth 15% of the course, it contributes 12.6 percentage points to the final grade.",
        },
        {
          title: "A-Target Example",
          value: "45 points",
          detail: "A target score of 90% on a 50-point assignment requires 45 points.",
        },
      ]}
      contentTitle="Why Assignment Grade Tracking Matters"
      contentIntro="Students often focus on the percentage shown on one assignment, but the more useful question is how that assignment affects the full course and what score would have changed the outcome."
      contentSections={[
        {
          title: "Why raw points can be misleading",
          paragraphs: [
            "A score of 18 lost points sounds large on a 100-point assignment but severe on a 20-point quiz. Converting points to percentage makes the result easier to interpret.",
            "That conversion also lets you compare assignments with different total marks on a common scale.",
          ],
        },
        {
          title: "Why assignment weight matters",
          paragraphs: [
            "Not all coursework carries the same importance. A project worth 25% of the course matters far more than a worksheet worth 3%.",
            "Weighted contribution helps students see which assignments changed the course result the most and where future effort will matter most.",
          ],
        },
        {
          title: "When a target planner is useful",
          paragraphs: [
            "Students often need to know how many points correspond to a target like 70%, 85%, or 90% before submitting or revising work.",
            "That reverse calculation is useful for rubrics, retakes, resubmissions, and final checklist reviews before handing in an assignment.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How do I calculate assignment percentage?",
          a: "Divide earned points by total points and multiply by 100. For example, 42 out of 50 becomes 84%.",
        },
        {
          q: "What does assignment weight mean?",
          a: "Assignment weight is the percentage share that the assignment contributes to the full course grade. A 15% weight means that assignment controls 15% of the final course result.",
        },
        {
          q: "Can I use this for projects and essays too?",
          a: "Yes. The calculator works for any graded task as long as you know the earned points, total points, and optional course weight.",
        },
        {
          q: "Why is weighted contribution smaller than the assignment percentage?",
          a: "Because the assignment usually counts as only part of the course. A high assignment percentage is multiplied by the smaller course weight.",
        },
      ]}
      relatedTools={[
        { title: "Weighted Grade Calculator", href: "/education/weighted-grade-calculator", benefit: "Combine multiple assignments into a full course grade." },
        { title: "Percentage Grade Calculator", href: "/education/percentage-grade-calculator", benefit: "Convert assignment percentage into a letter grade estimate." },
        { title: "Final Grade Calculator", href: "/education/final-grade-calculator", benefit: "Plan the score needed on your remaining major exam." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Homework and Projects", detail: "Useful for assignments, coursework, lab work, and essays." },
        { label: "Core Output", value: "Assignment %", detail: "Also shows weighted course impact and target points needed." },
        { label: "Important Note", value: "Weight Is Optional", detail: "Leave the course interpretation to the weighted contribution when your syllabus uses weighted grading." },
      ]}
    />
  );
}
