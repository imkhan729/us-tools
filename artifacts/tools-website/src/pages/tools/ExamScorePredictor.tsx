import { useMemo, useState } from "react";
import { BookOpen, Calculator, Target } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}

export default function ExamScorePredictor() {
  const [courseworkScore, setCourseworkScore] = useState("78");
  const [courseworkWeight, setCourseworkWeight] = useState("40");
  const [practiceExamScore, setPracticeExamScore] = useState("74");
  const [expectedImprovement, setExpectedImprovement] = useState("6");
  const [targetFinalScore, setTargetFinalScore] = useState("85");

  const result = useMemo(() => {
    const coursework = parseFloat(courseworkScore);
    const courseworkWt = parseFloat(courseworkWeight);
    const practice = parseFloat(practiceExamScore);
    const improvement = parseFloat(expectedImprovement);
    const targetFinal = parseFloat(targetFinalScore);

    if (
      !Number.isFinite(coursework) ||
      !Number.isFinite(courseworkWt) ||
      !Number.isFinite(practice) ||
      !Number.isFinite(improvement) ||
      !Number.isFinite(targetFinal) ||
      courseworkWt < 0 ||
      courseworkWt > 100
    ) {
      return null;
    }

    const examWeight = 100 - courseworkWt;
    const predictedExamScore = clampPercent(practice + improvement);
    const courseworkContribution = (courseworkWt / 100) * coursework;
    const examContribution = (examWeight / 100) * predictedExamScore;
    const predictedFinal = courseworkContribution + examContribution;
    const requiredExamForTarget = examWeight === 0 ? 0 : (targetFinal - courseworkContribution) / (examWeight / 100);

    return {
      examWeight,
      predictedExamScore,
      predictedFinal,
      courseworkContribution,
      requiredExamForTarget,
      reachable: examWeight === 0 ? targetFinal <= courseworkContribution : requiredExamForTarget <= 100,
    };
  }, [courseworkScore, courseworkWeight, practiceExamScore, expectedImprovement, targetFinalScore]);

  return (
    <StudentToolPageShell
      title="Exam Score Predictor"
      seoTitle="Exam Score Predictor - Estimate Your Final Course Score"
      seoDescription="Predict your final course score from coursework weight, practice exam performance, and expected improvement with this free exam score predictor."
      canonical="https://usonlinetools.com/education/exam-score-predictor"
      heroDescription="Estimate your likely final result from current coursework, practice-test performance, and the exam weight left in the course."
      heroIcon={<BookOpen className="w-3.5 h-3.5" />}
      calculatorLabel="Exam Outcome Estimator"
      calculatorDescription="Project your final score and check the exam score needed to reach a target course result."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Predict your final score</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Current Coursework %</label>
                <input type="number" min="0" max="100" value={courseworkScore} onChange={(event) => setCourseworkScore(event.target.value)} className="tool-calc-input w-full" placeholder="78" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Coursework Weight %</label>
                <input type="number" min="0" max="100" value={courseworkWeight} onChange={(event) => setCourseworkWeight(event.target.value)} className="tool-calc-input w-full" placeholder="40" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Practice Exam %</label>
                <input type="number" min="0" max="100" value={practiceExamScore} onChange={(event) => setPracticeExamScore(event.target.value)} className="tool-calc-input w-full" placeholder="74" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Expected Improvement %</label>
                <input type="number" min="0" max="100" value={expectedImprovement} onChange={(event) => setExpectedImprovement(event.target.value)} className="tool-calc-input w-full" placeholder="6" />
              </div>
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Predicted Final Score</p>
                  <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{formatPercent(result.predictedFinal)}%</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Exam Weight</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(result.examWeight)}%</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Predicted Exam</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(result.predictedExamScore)}%</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Coursework Contribution</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(result.courseworkContribution)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Enter valid percentages. Coursework weight must stay between 0 and 100.</p>
            )}
          </div>

          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-violet-500" />
              <h3 className="text-lg font-bold text-foreground">Target score check</h3>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Target Final Score %</label>
              <input type="number" min="0" max="100" value={targetFinalScore} onChange={(event) => setTargetFinalScore(event.target.value)} className="tool-calc-input w-full md:max-w-xs" placeholder="85" />
            </div>

            {result ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Exam Score Needed</p>
                  <p className="text-3xl font-black text-violet-600 dark:text-violet-400">
                    {result.requiredExamForTarget <= 0 ? "0%" : `${formatPercent(result.requiredExamForTarget)}%`}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Target Status</p>
                  <p className="text-3xl font-black text-foreground">{result.reachable ? "Reachable" : "Very High"}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Add valid percentages to calculate the exam score needed for your target.</p>
            )}
          </div>
        </div>
      }
      howToTitle="How to Use the Exam Score Predictor"
      howToIntro="Final exam performance rarely exists in isolation. Most students already have coursework marks, quiz averages, or internal assessments on record, so the real question is how those existing marks interact with the exam weight."
      howSteps={[
        {
          title: "Enter your current coursework percentage",
          description: "Use the average already earned from assignments, coursework, internal assessments, or class tests.",
        },
        {
          title: "Enter the coursework weight and your practice exam level",
          description: "The predictor uses your practice score plus an improvement estimate to model your likely final exam performance.",
        },
        {
          title: "Check the predicted final score and target requirement",
          description: "The result shows your projected course total and the exam percentage you would need to reach a specific target overall score.",
        },
      ]}
      formulaTitle="Exam Prediction Formulas"
      formulaIntro="This predictor uses weighted-score logic. Coursework and the final exam do not count equally unless each part has the same percentage weight in the course."
      formulaCards={[
        {
          label: "Predicted Final Score",
          formula: "Final = (Coursework x Weight) + (Predicted Exam x Remaining Weight)",
          detail: "Each component is multiplied by its course weight, then added together to estimate the total course outcome.",
        },
        {
          label: "Exam Score Needed For A Target",
          formula: "Needed Exam = (Target Final - Coursework Contribution) / Exam Weight",
          detail: "This tells you what percentage must come from the exam component to hit your desired final score.",
        },
      ]}
      examplesTitle="Exam Prediction Examples"
      examplesIntro="These examples show how students typically use score prediction near the end of a term."
      examples={[
        {
          title: "Current Standing",
          value: "31.2 pts",
          detail: "A coursework average of 78% with a 40% weight already contributes 31.2 points to the final course score.",
        },
        {
          title: "Predicted Exam",
          value: "80%",
          detail: "A practice exam score of 74% plus 6% expected improvement gives a predicted exam result of 80%.",
        },
        {
          title: "Projected Final",
          value: "79.2%",
          detail: "Combining the coursework contribution and predicted exam contribution gives an estimated course total of 79.2%.",
        },
      ]}
      contentTitle="Why Exam Score Prediction Is Useful"
      contentIntro="Students often know their target grade but do not know what the exam must contribute to reach it. A weighted predictor closes that gap by showing both the likely outcome and the performance requirement."
      contentSections={[
        {
          title: "Why practice scores are helpful but incomplete",
          paragraphs: [
            "Practice tests give a baseline, but they are usually taken under different conditions from the real exam. That is why the improvement field matters.",
            "A realistic improvement estimate makes the prediction more useful than simply copying a mock score directly into the final-exam slot.",
          ],
        },
        {
          title: "Why weights matter more than students expect",
          paragraphs: [
            "A strong coursework average can protect your final result when the exam has a smaller weight, but the same coursework average offers less protection when the exam weight is very high.",
            "This is why two students with identical coursework averages can need very different exam scores, depending on course structure.",
          ],
        },
        {
          title: "How to use the target result",
          paragraphs: [
            "If the required exam score is already comfortably below your predicted exam score, your revision plan may just need consistency rather than drastic changes.",
            "If the required score is above 90% or above 100%, it signals that the target is difficult or impossible under the current weighting, and you may need to adjust expectations.",
          ],
        },
      ]}
      faqs={[
        {
          q: "What does the exam score predictor estimate?",
          a: "It estimates your likely final course score based on your current coursework result, the coursework weight, your practice exam score, and expected improvement.",
        },
        {
          q: "Why does coursework weight matter?",
          a: "Because the final course score is weighted. A 40% coursework block contributes less to the total than a 60% block, even if the raw percentage is the same.",
        },
        {
          q: "Can the target score be impossible?",
          a: "Yes. If the exam score needed for your target is above 100%, then that target cannot be reached under the current weighting and coursework result.",
        },
        {
          q: "Should I use my latest mock score or my average mock score?",
          a: "Use the number that best represents your current level. If your latest mock was unusually high or low, an average of recent mocks may be a more stable estimate.",
        },
      ]}
      relatedTools={[
        { title: "Final Grade Calculator", href: "/education/final-grade-calculator", benefit: "Work backward from your current grade to the score needed on the final exam." },
        { title: "Grade Improvement Calculator", href: "/education/grade-improvement-calculator", benefit: "See what performance jump is needed to move into the next grade band." },
        { title: "Weighted Grade Calculator", href: "/education/weighted-grade-calculator", benefit: "Calculate a full weighted course score from multiple assessment categories." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Final Exams", detail: "Useful when coursework is already locked in and one major exam remains." },
        { label: "Core Output", value: "Predicted %", detail: "Shows both the projected final score and the exam score needed for a target." },
        { label: "Method", value: "Weighted", detail: "Uses coursework weight and remaining exam weight instead of raw averaging." },
      ]}
    />
  );
}
