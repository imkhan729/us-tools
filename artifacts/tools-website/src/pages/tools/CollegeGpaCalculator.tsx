import { useMemo, useState } from "react";
import { BarChart3, BookOpen, GraduationCap, Plus, Trash2 } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { LETTER_GRADE_SCALE, formatPercent } from "./studentGradeUtils";

interface CollegeCourse {
  id: number;
  name: string;
  grade: string;
  credits: string;
}

const GRADE_POINTS = Object.fromEntries(LETTER_GRADE_SCALE.map((item) => [item.grade, item.gpa])) as Record<string, number>;

let nextCollegeCourseId = 4;

export default function CollegeGpaCalculator() {
  const [currentCgpa, setCurrentCgpa] = useState("3.28");
  const [earnedCredits, setEarnedCredits] = useState("48");
  const [courses, setCourses] = useState<CollegeCourse[]>([
    { id: 1, name: "Calculus II", grade: "A-", credits: "4" },
    { id: 2, name: "Psychology", grade: "B+", credits: "3" },
    { id: 3, name: "Computer Science", grade: "A", credits: "4" },
  ]);

  const result = useMemo(() => {
    const validCourses = courses.filter((course) => course.grade && course.credits !== "");
    if (validCourses.length === 0) return null;

    let currentSemesterCredits = 0;
    let currentSemesterPoints = 0;

    for (const course of validCourses) {
      const credits = parseFloat(course.credits);
      if (!Number.isFinite(credits) || credits <= 0) {
        return null;
      }

      currentSemesterCredits += credits;
      currentSemesterPoints += GRADE_POINTS[course.grade] * credits;
    }

    const semesterGpa = currentSemesterPoints / currentSemesterCredits;
    const priorGpa = parseFloat(currentCgpa);
    const priorCredits = parseFloat(earnedCredits);
    const hasProjection = Number.isFinite(priorGpa) && Number.isFinite(priorCredits) && priorGpa >= 0 && priorCredits > 0;
    const projectedCgpa = hasProjection
      ? (priorGpa * priorCredits + currentSemesterPoints) / (priorCredits + currentSemesterCredits)
      : semesterGpa;

    return {
      currentSemesterCredits,
      currentSemesterPoints,
      semesterGpa,
      projectedCgpa,
      hasProjection,
      totalCreditsAfterTerm: hasProjection ? priorCredits + currentSemesterCredits : currentSemesterCredits,
    };
  }, [courses, currentCgpa, earnedCredits]);

  const updateCourse = (id: number, field: keyof CollegeCourse, value: string) => {
    setCourses((current) => current.map((course) => (course.id === id ? { ...course, [field]: value } : course)));
  };

  const addCourse = () => {
    setCourses((current) => [...current, { id: nextCollegeCourseId++, name: "", grade: "B", credits: "3" }]);
  };

  const removeCourse = (id: number) => {
    setCourses((current) => current.filter((course) => course.id !== id));
  };

  return (
    <StudentToolPageShell
      title="College GPA Calculator"
      seoTitle="College GPA Calculator - Calculate Semester GPA And Project Cumulative GPA"
      seoDescription="Calculate college GPA with weighted credits, current semester courses, and projected cumulative GPA using this free college GPA calculator."
      canonical="https://usonlinetools.com/education/college-gpa-calculator"
      heroDescription="Calculate a weighted college GPA for the current term and see how it could change your cumulative GPA. Add courses, letter grades, and credits to get a more realistic academic forecast."
      heroIcon={<GraduationCap className="w-3.5 h-3.5" />}
      calculatorLabel="College GPA Planner"
      calculatorDescription="Calculate semester GPA and project how the term affects cumulative GPA."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Starting academic record</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Cumulative GPA</label>
                <input type="number" min="0" max="4" step="0.01" value={currentCgpa} onChange={(event) => setCurrentCgpa(event.target.value)} className="tool-calc-input w-full" placeholder="3.28" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Earned Credits So Far</label>
                <input type="number" min="0" step="0.5" value={earnedCredits} onChange={(event) => setEarnedCredits(event.target.value)} className="tool-calc-input w-full" placeholder="48" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-violet-500" />
              <h3 className="text-lg font-bold text-foreground">Current semester courses</h3>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-[1.7fr_0.8fr_0.8fr_auto] gap-2 px-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <span>Course</span>
                <span>Grade</span>
                <span>Credits</span>
                <span />
              </div>

              {courses.map((course) => (
                <div key={course.id} className="grid grid-cols-[1.7fr_0.8fr_0.8fr_auto] items-center gap-2">
                  <input
                    type="text"
                    value={course.name}
                    onChange={(event) => updateCourse(course.id, "name", event.target.value)}
                    className="tool-calc-input text-sm"
                    placeholder="Course name"
                  />
                  <select value={course.grade} onChange={(event) => updateCourse(course.id, "grade", event.target.value)} className="tool-calc-input text-sm">
                    {LETTER_GRADE_SCALE.map((grade) => (
                      <option key={grade.grade} value={grade.grade}>
                        {grade.grade}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={course.credits}
                    onChange={(event) => updateCourse(course.id, "credits", event.target.value)}
                    className="tool-calc-input text-sm"
                    placeholder="3"
                  />
                  <button
                    onClick={() => removeCourse(course.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-red-500/30 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={addCourse} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400">
              <Plus className="h-4 w-4" /> Add course
            </button>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Semester GPA</p>
                  <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{formatPercent(result.semesterGpa)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Based only on the current term courses listed below</p>
                </div>
                <div className="rounded-2xl border border-violet-500/20 bg-background p-5 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Projected Cumulative GPA</p>
                  <p className="text-5xl font-black text-violet-600 dark:text-violet-400">{formatPercent(result.projectedCgpa)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{result.hasProjection ? "Combines your existing record with this semester" : "Using semester GPA because no prior record was provided"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Semester Credits</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.currentSemesterCredits)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Quality Points</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.currentSemesterPoints)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Credits After Term</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.totalCreditsAfterTerm)}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid course grades and credit values to calculate the term GPA.</p>
          )}
        </div>
      }
      howToTitle="How to Use the College GPA Calculator"
      howToIntro="College GPA planning is most useful when you separate the current semester from the cumulative record you already built."
      howSteps={[
        { title: "Enter your current cumulative GPA and earned credits", description: "If you already have a college record, these values let the calculator project how the new term could change the cumulative result." },
        { title: "Add the current semester courses with grades and credits", description: "Each course contributes grade points according to its credit weight, so a 4-credit course changes the term GPA more than a 1-credit elective." },
        { title: "Compare semester GPA with projected cumulative GPA", description: "This helps you see whether one strong term will meaningfully move your overall GPA or only shift it slightly." },
      ]}
      formulaTitle="College GPA Formulas"
      formulaIntro="College GPA is a weighted average, which means credits matter just as much as the letter grade itself."
      formulaCards={[
        { label: "Semester Quality Points", formula: "Quality Points = sum(Grade Points x Course Credits)", detail: "Every course contributes grade points based on its letter grade and credit weight." },
        { label: "Projected CGPA", formula: "Projected CGPA = (Prior GPA x Prior Credits + Semester Quality Points) / Total Credits", detail: "This combines the existing record with the current term to estimate the new cumulative result." },
      ]}
      examplesTitle="College GPA Examples"
      examplesIntro="These examples show the kinds of projections students often need during a semester."
      examples={[
        { title: "Term Check", value: "3.60 GPA", detail: "A student can use current course grades to estimate the semester result before final grades are posted." },
        { title: "Cumulative Impact", value: "Small or Large Shift", detail: "A good semester changes cumulative GPA more when the student has fewer completed credits so far." },
        { title: "Credit Weight", value: "4-credit effect", detail: "Higher-credit courses influence GPA more heavily than light electives or lab-only classes." },
      ]}
      contentTitle="Why College GPA Forecasting Helps"
      contentIntro="Many students know how to calculate one semester GPA, but they still underestimate how hard it is to move a cumulative GPA after many credits have already been completed."
      contentSections={[
        { title: "Why term GPA and cumulative GPA differ", paragraphs: ["A strong semester GPA is valuable, but its effect on the cumulative GPA depends on how many credits are already on the transcript.", "That is why projection matters when setting realistic grade goals."] },
        { title: "Why credit weighting matters", paragraphs: ["College GPA is not a simple grade average. A heavier course load contributes more quality points and therefore has more influence.", "This is especially important in majors where core courses often carry more credits than electives."] },
        { title: "How to use projections well", paragraphs: ["Use projected GPA to set targets early in the term rather than waiting for final grades.", "If the projected change is smaller than expected, that usually means the cumulative record is already large and will move slowly."] },
      ]}
      faqs={[
        { q: "Can I use this for both semester GPA and cumulative GPA?", a: "Yes. It calculates the current semester GPA and, if you enter an existing record, projects a new cumulative GPA too." },
        { q: "What if I do not know my current cumulative GPA?", a: "You can still use the tool to calculate just the current semester GPA from the courses listed." },
        { q: "Does this support plus and minus grades?", a: "Yes. The calculator includes the common A+ through F 4.0 scale with plus and minus grades." },
        { q: "Will one good semester completely fix a low cumulative GPA?", a: "Not always. The more credits you already have, the slower the cumulative GPA moves." },
      ]}
      relatedTools={[
        { title: "GPA Calculator", href: "/education/gpa-calculator", benefit: "Calculate GPA from a simple course list without cumulative projection." },
        { title: "CGPA Calculator", href: "/education/cgpa-calculator", benefit: "Track cumulative GPA across multiple completed semesters." },
        { title: "Grade Improvement Calculator", href: "/education/grade-improvement-calculator", benefit: "Estimate the performance needed to reach a target GPA." },
      ]}
      quickFacts={[
        { label: "Best For", value: "College Term Planning", detail: "Useful before finals or while projecting end-of-semester outcomes." },
        { label: "Core Output", value: "Semester and Projected CGPA", detail: "Shows the term result and how it may affect the wider record." },
        { label: "Main Insight", value: "Credits Drive Impact", detail: "Cumulative GPA shifts more slowly when many credits are already completed." },
      ]}
    />
  );
}
