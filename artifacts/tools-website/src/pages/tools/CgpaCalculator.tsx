import { useMemo, useState } from "react";
import { BarChart3, GraduationCap, Plus, Trash2 } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

interface SemesterEntry {
  id: number;
  name: string;
  gpa: string;
  credits: string;
}

let nextSemesterId = 4;

export default function CgpaCalculator() {
  const [semesters, setSemesters] = useState<SemesterEntry[]>([
    { id: 1, name: "Semester 1", gpa: "3.2", credits: "15" },
    { id: 2, name: "Semester 2", gpa: "3.5", credits: "18" },
    { id: 3, name: "Semester 3", gpa: "3.8", credits: "16" },
  ]);

  const result = useMemo(() => {
    const valid = semesters.filter((semester) => semester.gpa !== "" && semester.credits !== "");
    if (valid.length === 0) return null;

    let totalCredits = 0;
    let totalQualityPoints = 0;
    let gpaSum = 0;

    for (const semester of valid) {
      const gpa = parseFloat(semester.gpa);
      const credits = parseFloat(semester.credits);

      if (!Number.isFinite(gpa) || !Number.isFinite(credits) || gpa < 0 || credits <= 0) {
        return null;
      }

      totalCredits += credits;
      totalQualityPoints += gpa * credits;
      gpaSum += gpa;
    }

    return {
      cgpa: totalQualityPoints / totalCredits,
      averageSemesterGpa: gpaSum / valid.length,
      totalCredits,
      totalQualityPoints,
      semesterCount: valid.length,
    };
  }, [semesters]);

  const updateSemester = (id: number, field: keyof SemesterEntry, value: string) => {
    setSemesters((current) => current.map((semester) => (semester.id === id ? { ...semester, [field]: value } : semester)));
  };

  const addSemester = () => {
    setSemesters((current) => [...current, { id: nextSemesterId++, name: `Semester ${current.length + 1}`, gpa: "", credits: "15" }]);
  };

  const removeSemester = (id: number) => {
    setSemesters((current) => current.filter((semester) => semester.id !== id));
  };

  return (
    <StudentToolPageShell
      title="CGPA Calculator"
      seoTitle="CGPA Calculator - Calculate Cumulative GPA Across Semesters"
      seoDescription="Calculate cumulative GPA across multiple semesters with credits. Free CGPA calculator with semester tracking, quality points, and weighted cumulative results."
      canonical="https://usonlinetools.com/education/cgpa-calculator"
      heroDescription="Calculate cumulative GPA across multiple semesters, combine different credit loads correctly, and track how each semester contributes to your long-term academic standing."
      heroIcon={<GraduationCap className="w-3.5 h-3.5" />}
      calculatorLabel="Cumulative GPA Tracker"
      calculatorDescription="Add each semester's GPA and credits to calculate an accurate cumulative GPA."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Semester list</h3>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 px-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <span>Semester</span>
                <span>GPA</span>
                <span>Credits</span>
                <span />
              </div>

              {semesters.map((semester) => (
                <div key={semester.id} className="grid grid-cols-[2fr_1fr_1fr_auto] items-center gap-2">
                  <input type="text" value={semester.name} onChange={(event) => updateSemester(semester.id, "name", event.target.value)} className="tool-calc-input text-sm" placeholder="Semester 1" />
                  <input type="number" min="0" step="0.01" value={semester.gpa} onChange={(event) => updateSemester(semester.id, "gpa", event.target.value)} className="tool-calc-input text-center text-sm" placeholder="3.5" />
                  <input type="number" min="0.5" step="0.5" value={semester.credits} onChange={(event) => updateSemester(semester.id, "credits", event.target.value)} className="tool-calc-input text-center text-sm" placeholder="15" />
                  <button
                    onClick={() => removeSemester(semester.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-red-500/30 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={addSemester} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400">
              <Plus className="h-4 w-4" /> Add semester
            </button>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Cumulative GPA</p>
                  <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{formatPercent(result.cgpa)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Weighted by total completed credits</p>
                </div>
                <div className="rounded-2xl border border-violet-500/20 bg-background p-5 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Average Semester GPA</p>
                  <p className="text-5xl font-black text-violet-600 dark:text-violet-400">{formatPercent(result.averageSemesterGpa)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Simple average across listed semesters</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Semesters</p>
                  <p className="text-2xl font-black text-foreground">{result.semesterCount}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Credits</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.totalCredits)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Quality Points</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.totalQualityPoints)}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid semester GPAs and credit values to calculate CGPA.</p>
          )}
        </div>
      }
      howToTitle="How to Use the CGPA Calculator"
      howToIntro="CGPA is a weighted cumulative result, so each semester should be entered with both the GPA earned and the credits completed in that term."
      howSteps={[
        {
          title: "Enter one row for each completed semester",
          description: "Use the semester GPA exactly as shown on your transcript or grade portal and pair it with the number of credits earned that semester.",
        },
        {
          title: "Make sure each semester has the correct credit load",
          description: "CGPA depends on weighting, so a 20-credit semester influences the cumulative result more than a 9-credit semester.",
        },
        {
          title: "Read the cumulative GPA rather than only the simple average",
          description: "The cumulative GPA is the academically correct metric because it weights each semester by credits instead of treating all terms equally.",
        },
      ]}
      formulaTitle="CGPA Formulas"
      formulaIntro="Cumulative GPA is not just an average of semester GPAs. It must account for the credit load completed in each term."
      formulaCards={[
        {
          label: "Quality Points",
          formula: "Semester Quality Points = Semester GPA x Semester Credits",
          detail: "Each semester earns quality points based on both the GPA and the number of credits completed.",
        },
        {
          label: "Cumulative GPA",
          formula: "CGPA = Total Quality Points / Total Credits",
          detail: "This weighted formula gives the correct cumulative result across semesters with different course loads.",
        },
      ]}
      examplesTitle="CGPA Examples"
      examplesIntro="These examples show why cumulative GPA can differ from a simple average of semester GPAs."
      examples={[
        {
          title: "Balanced Progress",
          value: "3.50 CGPA",
          detail: "A student with steady performance across multiple semesters often sees a cumulative GPA close to the semester average.",
        },
        {
          title: "Heavy Semester Effect",
          value: "Bigger Impact",
          detail: "A strong or weak semester with a high credit load changes CGPA more than a lighter semester.",
        },
        {
          title: "Transcript Ready",
          value: "Weighted Result",
          detail: "CGPA is the figure most schools, employers, and graduate programs expect when they ask for cumulative performance.",
        },
      ]}
      contentTitle="Why CGPA Matters More Than One Semester GPA"
      contentIntro="A single semester GPA shows short-term performance. CGPA shows your long-term academic standing by combining all completed work on one weighted scale."
      contentSections={[
        {
          title: "Why cumulative GPA is used",
          paragraphs: [
            "Schools, scholarship committees, and graduate programs usually care about cumulative performance because it reflects consistency over time, not just one strong or weak semester.",
            "CGPA is also useful for tracking whether academic improvement is strong enough to shift your long-term standing.",
          ],
        },
        {
          title: "Why weighting by credits matters",
          paragraphs: [
            "A semester with more credits includes more coursework and therefore should influence the final cumulative result more heavily.",
            "That is why a direct average of semester GPAs can be misleading when credit loads vary.",
          ],
        },
        {
          title: "When to recalculate CGPA",
          paragraphs: [
            "You should recalculate CGPA after each completed semester, after transferred credits are finalized, or after grade replacement rules are applied.",
            "Keeping the cumulative figure current makes planning for honors, scholarships, and admissions much easier.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How is CGPA different from GPA?",
          a: "GPA often refers to one semester or one set of courses. CGPA means cumulative GPA across multiple semesters or the full transcript.",
        },
        {
          q: "Can I just average semester GPAs?",
          a: "Not if semesters have different credit totals. CGPA should be weighted by credits to stay accurate.",
        },
        {
          q: "What are quality points?",
          a: "Quality points are the product of GPA and credits. They are used to combine semester results into one weighted cumulative GPA.",
        },
        {
          q: "Should repeated courses be counted twice?",
          a: "That depends on your institution's policy. Some schools replace the old grade, while others count both attempts in CGPA.",
        },
      ]}
      relatedTools={[
        { title: "GPA Calculator", href: "/education/gpa-calculator", benefit: "Calculate GPA from individual courses and credits." },
        { title: "Grade Improvement Calculator", href: "/education/grade-improvement-calculator", benefit: "See what future GPA is needed to raise your cumulative result." },
        { title: "Marks to GPA Converter", href: "/education/marks-to-gpa-converter", benefit: "Convert percentage marks into a GPA estimate." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Multi-Semester Tracking", detail: "Useful for long-term academic planning and transcript review." },
        { label: "Core Output", value: "Weighted CGPA", detail: "Combines semester GPA values using the correct credit weighting." },
        { label: "Important Note", value: "Credits Matter", detail: "Heavier semesters should contribute more to the final cumulative result." },
      ]}
    />
  );
}
