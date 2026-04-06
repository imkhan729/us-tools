import { useMemo, useState } from "react";
import { BookOpen, ListChecks, Percent, Target } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent, getLetterGrade } from "./studentGradeUtils";

function parseQuizList(input: string) {
  return input
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => Number(item))
    .filter((value) => Number.isFinite(value) && value >= 0 && value <= 100);
}

export default function QuizScoreCalculator() {
  const [correctAnswers, setCorrectAnswers] = useState("18");
  const [totalQuestions, setTotalQuestions] = useState("20");
  const [pointsPerQuestion, setPointsPerQuestion] = useState("1");
  const [quizScores, setQuizScores] = useState("82, 90, 76, 88");
  const [targetAverage, setTargetAverage] = useState("85");

  const singleQuizResult = useMemo(() => {
    const correct = parseFloat(correctAnswers);
    const total = parseFloat(totalQuestions);
    const points = parseFloat(pointsPerQuestion);

    if (!Number.isFinite(correct) || !Number.isFinite(total) || !Number.isFinite(points) || total <= 0 || points <= 0 || correct < 0 || correct > total) {
      return null;
    }

    const percentage = (correct / total) * 100;
    const score = correct * points;
    const totalScore = total * points;

    return {
      percentage,
      score,
      totalScore,
      incorrect: total - correct,
      band: getLetterGrade(percentage),
    };
  }, [correctAnswers, pointsPerQuestion, totalQuestions]);

  const averageResult = useMemo(() => {
    const scores = parseQuizList(quizScores);
    const desiredAverage = parseFloat(targetAverage);

    if (scores.length === 0) return null;

    const total = scores.reduce((sum, value) => sum + value, 0);
    const average = total / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const neededNextQuiz = Number.isFinite(desiredAverage) ? desiredAverage * (scores.length + 1) - total : null;

    return {
      count: scores.length,
      average,
      highest,
      lowest,
      neededNextQuiz,
    };
  }, [quizScores, targetAverage]);

  return (
    <StudentToolPageShell
      title="Quiz Score Calculator"
      seoTitle="Quiz Score Calculator - Calculate Quiz Percentage and Average"
      seoDescription="Calculate quiz score percentage from correct answers and average multiple quiz results. Free quiz score calculator for students, teachers, and practice tests."
      canonical="https://usonlinetools.com/education/quiz-score-calculator"
      heroDescription="Calculate a quiz percentage from correct answers, convert the result into points and grade context, and average multiple quiz scores to track progress over time."
      heroIcon={<BookOpen className="w-3.5 h-3.5" />}
      calculatorLabel="Quiz Score Tracker"
      calculatorDescription="Score one quiz from answers and average several quiz percentages in the same page."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Percent className="h-4 w-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Single quiz score</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Correct Answers</label>
                <input type="number" min="0" value={correctAnswers} onChange={(event) => setCorrectAnswers(event.target.value)} className="tool-calc-input w-full" placeholder="18" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Questions</label>
                <input type="number" min="1" value={totalQuestions} onChange={(event) => setTotalQuestions(event.target.value)} className="tool-calc-input w-full" placeholder="20" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Points Per Question</label>
                <input type="number" min="0.1" step="0.1" value={pointsPerQuestion} onChange={(event) => setPointsPerQuestion(event.target.value)} className="tool-calc-input w-full" placeholder="1" />
              </div>
            </div>

            {singleQuizResult ? (
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Quiz Percentage</p>
                    <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{formatPercent(singleQuizResult.percentage)}%</p>
                    <p className="mt-2 text-sm text-muted-foreground">{singleQuizResult.band.grade} band · {singleQuizResult.band.note}</p>
                  </div>
                  <div className="rounded-2xl border border-violet-500/20 bg-background p-5 text-center">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Points Score</p>
                    <p className="text-5xl font-black text-violet-600 dark:text-violet-400">
                      {formatPercent(singleQuizResult.score)} / {formatPercent(singleQuizResult.totalScore)}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">Based on the points-per-question setting</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Correct</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(parseFloat(correctAnswers), 0)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Incorrect</p>
                    <p className="text-2xl font-black text-foreground">{formatPercent(singleQuizResult.incorrect, 0)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Accuracy Ratio</p>
                    <p className="text-2xl font-black text-foreground">
                      {formatPercent(parseFloat(correctAnswers), 0)} / {formatPercent(parseFloat(totalQuestions), 0)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Enter valid answer counts and point values. Correct answers cannot exceed total questions.</p>
            )}
          </div>

          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-violet-500" />
              <h3 className="text-lg font-bold text-foreground">Quiz average tracker</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Quiz Percentages</label>
                <textarea value={quizScores} onChange={(event) => setQuizScores(event.target.value)} className="tool-calc-input min-h-[140px] w-full" placeholder="82, 90, 76, 88" />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Target Average %</label>
                  <input type="number" min="0" max="100" value={targetAverage} onChange={(event) => setTargetAverage(event.target.value)} className="tool-calc-input w-full" placeholder="85" />
                </div>

                {averageResult ? (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Quiz Average</p>
                      <p className="text-3xl font-black text-violet-600 dark:text-violet-400">{formatPercent(averageResult.average)}%</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 text-center">
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Highest / Lowest</p>
                      <p className="text-lg font-black text-foreground">
                        {formatPercent(averageResult.highest)}% / {formatPercent(averageResult.lowest)}%
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4">
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Next quiz needed</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {averageResult.neededNextQuiz !== null && averageResult.neededNextQuiz <= 100
                          ? `You need ${formatPercent(averageResult.neededNextQuiz)}% on the next quiz to reach a ${formatPercent(parseFloat(targetAverage), 0)}% running average.`
                          : "The target average would require more than 100% on the next quiz, so it is not reachable in one attempt."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Add at least one valid quiz percentage from 0 to 100.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      }
      howToTitle="How to Use the Quiz Score Calculator"
      howToIntro="This page handles the two most common quiz questions: what was my score on one quiz, and what is my average across several quizzes?"
      howSteps={[
        {
          title: "Enter the correct and total questions for one quiz",
          description: "This calculates the percentage score and the raw points earned based on the points-per-question value you set.",
        },
        {
          title: "Add quiz percentages to the tracker if you want an average",
          description: "Paste scores separated by commas, spaces, or new lines to calculate a running quiz average, highest score, and lowest score.",
        },
        {
          title: "Use the target average estimate for planning",
          description: "The next-quiz estimate helps you understand what percentage would be required to pull your running average up to a desired level.",
        },
      ]}
      formulaTitle="Quiz Score Formulas"
      formulaIntro="Quiz grading usually starts with a simple accuracy formula, and quiz averages then build on the same percentage-based scoring."
      formulaCards={[
        {
          label: "Quiz Percentage",
          formula: "Quiz % = (Correct Answers / Total Questions) x 100",
          detail: "If you answer 18 questions correctly out of 20, the quiz score is 90%.",
        },
        {
          label: "Quiz Average",
          formula: "Average = Sum Of Quiz Percentages / Number Of Quizzes",
          detail: "A running quiz average helps you track consistency over time instead of judging performance from only one quiz.",
        },
      ]}
      examplesTitle="Quiz Score Examples"
      examplesIntro="These examples show the kinds of quiz calculations students and teachers use most often."
      examples={[
        {
          title: "Single Quiz",
          value: "90%",
          detail: "Correctly answering 18 out of 20 questions gives a 90% quiz score.",
        },
        {
          title: "Running Average",
          value: "84%",
          detail: "A set of quiz scores like 82%, 90%, 76%, and 88% averages to 84%.",
        },
        {
          title: "Target Recovery",
          value: "89%",
          detail: "If your average is slightly low, the target planner estimates the next quiz score needed to recover the running average.",
        },
      ]}
      contentTitle="Why Quiz Score Tracking Matters"
      contentIntro="Quiz scores are small compared with final exams, but they are often the first signal of whether your understanding is consistent or slipping over time."
      contentSections={[
        {
          title: "Why one quiz score is only part of the story",
          paragraphs: [
            "A single quiz might reflect one topic, one difficult day, or one easy unit. That is why many students look at quiz averages instead of treating one result as final evidence of performance.",
            "The average tracker helps you see whether a lower result is a one-off dip or part of a broader pattern.",
          ],
        },
        {
          title: "Why correct answers and point totals both matter",
          paragraphs: [
            "Some quizzes grade every question equally, while others attach different point values or bonus items. The points-per-question option helps translate answer counts into score values more clearly.",
            "That is especially useful for quick classroom quizzes and practice tests where raw answer counts are the first numbers students see.",
          ],
        },
        {
          title: "When next-quiz planning helps",
          paragraphs: [
            "Students often want to know what score they need on the next quiz to recover an average before a progress check or report cycle.",
            "Even a simple target estimate can help prioritize revision before the next short assessment arrives.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How do I calculate my quiz score percentage?",
          a: "Divide the number of correct answers by the total number of questions and multiply by 100.",
        },
        {
          q: "Can I average multiple quizzes here?",
          a: "Yes. Paste several quiz percentages into the tracker and the page will calculate the average, highest score, and lowest score.",
        },
        {
          q: "What if my quiz questions have different values?",
          a: "This page assumes a constant points-per-question setting for the single quiz section. If the quiz uses mixed values, calculate the earned and total points separately first.",
        },
        {
          q: "Why does the next-quiz estimate say more than 100% is needed?",
          a: "That means the target running average cannot be reached with only one more quiz under the current numbers.",
        },
      ]}
      relatedTools={[
        { title: "Percentage Grade Calculator", href: "/education/percentage-grade-calculator", benefit: "Convert a quiz percentage into a grade band." },
        { title: "Class Average Calculator", href: "/education/class-average-calculator", benefit: "Average a whole class or study group score list." },
        { title: "Assignment Grade Calculator", href: "/education/assignment-grade-calculator", benefit: "Calculate assignment percentages and course contribution." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Practice and Classroom Quizzes", detail: "Useful for short tests, topic checks, and revision sessions." },
        { label: "Core Output", value: "Quiz % and Average", detail: "Handles both one-quiz scoring and multi-quiz tracking." },
        { label: "Input Style", value: "Flexible List", detail: "The average tracker accepts commas, spaces, and line breaks." },
      ]}
    />
  );
}
