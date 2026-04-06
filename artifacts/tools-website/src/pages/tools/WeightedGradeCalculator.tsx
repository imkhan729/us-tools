import { useMemo, useState } from "react";
import { BarChart3, GraduationCap, Plus, Trash2 } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent, getLetterGrade } from "./studentGradeUtils";

interface WeightedItem {
  id: number;
  name: string;
  score: string;
  total: string;
  weight: string;
}

let nextWeightedItemId = 4;

export default function WeightedGradeCalculator() {
  const [items, setItems] = useState<WeightedItem[]>([
    { id: 1, name: "Homework", score: "88", total: "100", weight: "20" },
    { id: 2, name: "Midterm", score: "78", total: "100", weight: "30" },
    { id: 3, name: "Project", score: "92", total: "100", weight: "25" },
  ]);

  const result = useMemo(() => {
    const valid = items.filter((item) => item.score !== "" && item.total !== "" && item.weight !== "");
    if (valid.length === 0) return null;

    let weightedPoints = 0;
    let completedWeight = 0;

    for (const item of valid) {
      const score = parseFloat(item.score);
      const total = parseFloat(item.total);
      const weight = parseFloat(item.weight);

      if (!Number.isFinite(score) || !Number.isFinite(total) || !Number.isFinite(weight) || total <= 0 || weight < 0 || score < 0) {
        return null;
      }

      weightedPoints += (score / total) * weight;
      completedWeight += weight;
    }

    if (completedWeight <= 0) return null;

    const currentWeightedGrade = (weightedPoints / completedWeight) * 100;
    const remainingWeight = Math.max(0, 100 - completedWeight);

    return {
      weightedPoints,
      completedWeight,
      currentWeightedGrade,
      remainingWeight,
      band: getLetterGrade(currentWeightedGrade),
    };
  }, [items]);

  const updateItem = (id: number, field: keyof WeightedItem, value: string) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addItem = () => {
    setItems((current) => [...current, { id: nextWeightedItemId++, name: "", score: "", total: "100", weight: "10" }]);
  };

  const removeItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <StudentToolPageShell
      title="Weighted Grade Calculator"
      seoTitle="Weighted Grade Calculator - Calculate Course Grades By Weight"
      seoDescription="Calculate weighted grades from assignments, homework, projects, and exams. Free weighted grade calculator with live updates and clear course-grade breakdowns."
      canonical="https://usonlinetools.com/education/weighted-grade-calculator"
      heroDescription="Calculate your weighted course grade from assignments, quizzes, projects, and exams. See your current grade, completed course weight, remaining weight, and grade band in real time."
      heroIcon={<GraduationCap className="w-3.5 h-3.5" />}
      calculatorLabel="Weighted Course Grade"
      calculatorDescription="Add any number of graded items and calculate a live weighted average."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Assignment table</h3>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground px-1 mb-2">
                  <span>Item</span>
                  <span>Score</span>
                  <span>Total</span>
                  <span>Weight %</span>
                  <span />
                </div>

                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 items-center">
                      <input type="text" value={item.name} onChange={(event) => updateItem(item.id, "name", event.target.value)} className="tool-calc-input text-sm" placeholder="Assignment name" />
                      <input type="number" value={item.score} onChange={(event) => updateItem(item.id, "score", event.target.value)} className="tool-calc-input text-sm text-center" placeholder="88" min="0" />
                      <input type="number" value={item.total} onChange={(event) => updateItem(item.id, "total", event.target.value)} className="tool-calc-input text-sm text-center" placeholder="100" min="1" />
                      <input type="number" value={item.weight} onChange={(event) => updateItem(item.id, "weight", event.target.value)} className="tool-calc-input text-sm text-center" placeholder="20" min="0" />
                      <button onClick={() => removeItem(item.id)} className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-500/30 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={addItem} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">
              <Plus className="w-4 h-4" /> Add graded item
            </button>
          </div>

          {result ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Current Weighted Grade</p>
                <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{formatPercent(result.currentWeightedGrade)}%</p>
                <p className="text-sm text-muted-foreground mt-2">{result.band.grade} · GPA {result.band.gpa.toFixed(1)}</p>
              </div>
              <div className="rounded-2xl border border-violet-500/20 bg-background p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Course Weight Completed</p>
                <p className="text-5xl font-black text-violet-600 dark:text-violet-400">{formatPercent(result.completedWeight)}%</p>
                <p className="text-sm text-muted-foreground mt-2">{formatPercent(result.remainingWeight)}% of the course is still ungraded</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Weighted Points Earned</p>
                <p className="text-2xl font-black text-foreground">{formatPercent(result.weightedPoints)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Grade Status</p>
                <p className="text-2xl font-black text-foreground">{result.band.note}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid scores, totals, and weights to calculate a weighted grade.</p>
          )}
        </div>
      }
      howToTitle="How to Use the Weighted Grade Calculator"
      howToIntro="Weighted grades are common in schools and colleges because final exams, projects, and coursework do not all count equally. This calculator helps you combine them correctly."
      howSteps={[
        {
          title: "List every graded item that already has a score",
          description: "Enter the assignment name, the score you earned, the total possible score, and the weight that item carries in the course. Use the official syllabus weights whenever possible.",
        },
        {
          title: "Check the completed weight",
          description: "The calculator shows how much of the course has already been graded. That helps you understand whether your current weighted grade is based on 40%, 70%, or almost the full course.",
        },
        {
          title: "Interpret the current grade correctly",
          description: "The main grade shown is normalized across completed work. If only part of the course is graded, your course can still move significantly once the remaining weight is added.",
        },
      ]}
      formulaTitle="Weighted Grade Formulas"
      formulaIntro="Weighted grading is different from a simple average because each assignment contributes in proportion to its official course weight."
      formulaCards={[
        {
          label: "Weighted Points",
          formula: "Weighted Points = sum((Score / Total) x Weight)",
          detail: "Each assignment contributes only according to its weight. A final exam worth 40% matters far more than a quiz worth 5%.",
        },
        {
          label: "Current Weighted Grade",
          formula: "Current Grade = (Weighted Points / Completed Weight) x 100",
          detail: "This normalizes the result across the graded portion of the course so far, which gives a clearer picture of current performance.",
        },
      ]}
      examplesTitle="Weighted Grade Examples"
      examplesIntro="These scenarios show why weighted grading can feel very different from a plain average."
      examples={[
        {
          title: "Strong Coursework",
          value: "85.3%",
          detail: "Scoring well on homework and projects can keep your current grade strong even before a large final exam is graded.",
        },
        {
          title: "Heavy Final",
          value: "40% left",
          detail: "If the final exam still carries 40% of the course, your current grade is informative but not final.",
        },
        {
          title: "Misleading Simple Average",
          value: "Avoid it",
          detail: "A simple arithmetic average can be wrong when a quiz counts 5% but a final counts 35%. Weighted grading fixes that.",
        },
      ]}
      contentTitle="Why Weighted Grades Matter"
      contentIntro="Weighted grade calculators are essential because most real courses are not scored with equal-value assignments. A weighted result reflects the actual course policy more accurately than a simple average."
      contentSections={[
        {
          title: "Why a simple average can be misleading",
          paragraphs: [
            "If you average raw assignment percentages without weights, a small quiz can influence your result as much as a major exam. That does not reflect how most course syllabi are structured.",
            "Weighted grading solves that by scaling each component according to its official importance in the course.",
          ],
        },
        {
          title: "Why completed weight is important",
          paragraphs: [
            "A current grade based on only 35% of the course should be interpreted differently from a grade based on 95% of the course. The completed-weight figure shows how stable the result really is.",
            "When a large final exam or project is still ungraded, the course outcome can move much more than students expect.",
          ],
        },
        {
          title: "Common data-entry mistakes",
          paragraphs: [
            "Students often confuse a raw score with a percentage, or enter a weight as a decimal instead of a percentage. Another common error is entering total points instead of assignment weight in the weight field.",
            "Use the same scoring system for each row and confirm that your weights match the syllabus before relying on the result.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How is weighted grade different from average grade?",
          a: "A weighted grade gives each assignment a different influence based on its official course weight. A simple average treats everything equally, which is often wrong for real courses.",
        },
        {
          q: "Do the weights need to add up to exactly 100?",
          a: "For a complete course plan, yes. But this calculator can still show your current grade even when only part of the course has been graded so far.",
        },
        {
          q: "Why does my current weighted grade look high even with weight remaining?",
          a: "The calculator normalizes across completed work. If your strongest work is graded first, the current grade may be high even though a large final exam could still change it.",
        },
        {
          q: "Should I enter percentages or raw scores?",
          a: "Enter the score you earned and the total possible score for each item. The calculator converts each row to a percentage before applying the weight.",
        },
      ]}
      relatedTools={[
        { title: "Final Grade Calculator", href: "/education/final-grade-calculator", benefit: "See the exam score needed after your current weighted grade." },
        { title: "Percentage Grade Calculator", href: "/education/percentage-grade-calculator", benefit: "Convert a score directly into a grade band." },
        { title: "Marks Percentage Calculator", href: "/education/marks-percentage-calculator", benefit: "Calculate raw score percentages quickly." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Coursework", detail: "Useful for classes with assignments, quizzes, projects, and exams." },
        { label: "Core Output", value: "Weighted %", detail: "Shows current grade, earned weighted points, and completed course weight." },
        { label: "Important Note", value: "Use Syllabus Weights", detail: "Accurate weights matter more than precise score rounding." },
      ]}
    />
  );
}
