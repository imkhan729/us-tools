import { useMemo, useState } from "react";
import { BookOpen, CalendarDays, GraduationCap, Plus, Trash2 } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

interface CourseItem {
  id: number;
  name: string;
  credits: string;
  weeklyHours: string;
  difficulty: "light" | "standard" | "heavy";
}

let nextSemesterCourseId = 4;

const DIFFICULTY_MULTIPLIER: Record<CourseItem["difficulty"], number> = {
  light: 0.8,
  standard: 1,
  heavy: 1.3,
};

export default function SemesterPlannerTool() {
  const [courses, setCourses] = useState<CourseItem[]>([
    { id: 1, name: "Calculus", credits: "4", weeklyHours: "5", difficulty: "heavy" },
    { id: 2, name: "English Composition", credits: "3", weeklyHours: "3", difficulty: "standard" },
    { id: 3, name: "Computer Science", credits: "4", weeklyHours: "6", difficulty: "heavy" },
  ]);

  const result = useMemo(() => {
    const valid = courses.filter((course) => course.name.trim() && course.credits !== "" && course.weeklyHours !== "");
    if (valid.length === 0) return null;

    let totalCredits = 0;
    let totalWeeklyHours = 0;
    let weightedLoad = 0;
    let heavyCourses = 0;

    for (const course of valid) {
      const credits = parseFloat(course.credits);
      const weeklyHours = parseFloat(course.weeklyHours);
      if (!Number.isFinite(credits) || !Number.isFinite(weeklyHours) || credits <= 0 || weeklyHours < 0) return null;

      totalCredits += credits;
      totalWeeklyHours += weeklyHours;
      weightedLoad += weeklyHours * DIFFICULTY_MULTIPLIER[course.difficulty];
      if (course.difficulty === "heavy") heavyCourses += 1;
    }

    return {
      totalCredits,
      totalWeeklyHours,
      averageCredits: totalCredits / valid.length,
      weightedLoad,
      heavyCourses,
      status:
        totalCredits <= 15 && totalWeeklyHours <= 18
          ? "Balanced"
          : totalCredits <= 19 && totalWeeklyHours <= 25
            ? "Busy"
            : "Heavy",
    };
  }, [courses]);

  const updateCourse = (id: number, field: keyof CourseItem, value: string) => {
    setCourses((current) => current.map((course) => (course.id === id ? { ...course, [field]: value } : course)));
  };

  const addCourse = () => {
    setCourses((current) => [
      ...current,
      { id: nextSemesterCourseId++, name: "", credits: "", weeklyHours: "", difficulty: "standard" },
    ]);
  };

  const removeCourse = (id: number) => {
    setCourses((current) => current.filter((course) => course.id !== id));
  };

  return (
    <StudentToolPageShell
      title="Semester Planner Tool"
      seoTitle="Semester Planner Tool - Plan Courses, Credits, And Weekly Study Load"
      seoDescription="Plan your semester by adding courses, credits, weekly study hours, and workload difficulty with this free semester planner tool."
      canonical="https://usonlinetools.com/education/semester-planner-tool"
      heroDescription="Plan a realistic semester before registration or at the start of term. Add your courses, credits, and weekly study hours to estimate whether the semester looks balanced, busy, or overloaded."
      heroIcon={<GraduationCap className="w-3.5 h-3.5" />}
      calculatorLabel="Semester Load Planner"
      calculatorDescription="Estimate credit load, weekly study time, and course intensity for the term."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Build your semester</h3>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-[1.8fr_0.8fr_1fr_1fr_auto] gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
                <span>Course</span>
                <span>Credits</span>
                <span>Weekly Hours</span>
                <span>Difficulty</span>
                <span />
              </div>
              {courses.map((course) => (
                <div key={course.id} className="grid grid-cols-[1.8fr_0.8fr_1fr_1fr_auto] gap-2 items-center">
                  <input type="text" value={course.name} onChange={(event) => updateCourse(course.id, "name", event.target.value)} className="tool-calc-input text-sm" placeholder="Course name" />
                  <input type="number" min="1" value={course.credits} onChange={(event) => updateCourse(course.id, "credits", event.target.value)} className="tool-calc-input text-sm text-center" placeholder="3" />
                  <input type="number" min="0" value={course.weeklyHours} onChange={(event) => updateCourse(course.id, "weeklyHours", event.target.value)} className="tool-calc-input text-sm text-center" placeholder="4" />
                  <select value={course.difficulty} onChange={(event) => updateCourse(course.id, "difficulty", event.target.value)} className="tool-calc-input text-sm">
                    <option value="light">Light</option>
                    <option value="standard">Standard</option>
                    <option value="heavy">Heavy</option>
                  </select>
                  <button onClick={() => removeCourse(course.id)} className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-500/30 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={addCourse} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">
              <Plus className="w-4 h-4" /> Add course
            </button>
          </div>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Semester Load Status</p>
                <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{result.status}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Credits</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.totalCredits, 1)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Weekly Hours</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.totalWeeklyHours, 1)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Avg Credits</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(result.averageCredits, 1)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Heavy Courses</p>
                  <p className="text-2xl font-black text-foreground">{result.heavyCourses}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-violet-500" />
                  <p className="font-bold text-foreground">Weighted study-load estimate</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Based on your difficulty settings, this semester carries an adjusted workload score of{" "}
                  <span className="font-bold text-foreground">{formatPercent(result.weightedLoad, 1)}</span>. Use this as a planning signal, not a hard academic rule.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid course names, credits, and weekly hours to estimate your semester load.</p>
          )}
        </div>
      }
      howToTitle="How to Use the Semester Planner Tool"
      howToIntro="This planner helps students estimate whether a semester is realistically balanced before registration or during the first week of classes."
      howSteps={[
        { title: "List your planned courses", description: "Add each course separately so you can see the total credit load and the number of high-effort classes in one place." },
        { title: "Enter credits and expected weekly hours", description: "Credits show academic weight, while weekly hours show how much time you expect to spend attending, studying, or completing work." },
        { title: "Mark course difficulty honestly", description: "Some courses demand much more energy than their raw credit count suggests, so the difficulty setting helps reflect real workload." },
      ]}
      formulaTitle="Semester Planning Metrics"
      formulaIntro="Semester planning is less about one academic formula and more about combining credits, hours, and difficulty into a usable workload picture."
      formulaCards={[
        { label: "Total Credits", formula: "Total Credits = sum(All Course Credits)", detail: "This is the core academic load measure that most institutions use when defining full-time or part-time status." },
        { label: "Weekly Hours", formula: "Weekly Hours = sum(All Study Hours)", detail: "This estimates the time commitment required each week across classes, assignments, and revision." },
      ]}
      examplesTitle="Semester Planner Examples"
      examplesIntro="These examples show how students often use a planner before committing to a course mix."
      examples={[
        { title: "Balanced Term", value: "15 credits", detail: "A moderate credit load with manageable weekly hours often leaves room for part-time work or extracurriculars." },
        { title: "Busy Schedule", value: "20+ hrs/week", detail: "A schedule with several reading-heavy or technical courses may still be possible but needs careful planning." },
        { title: "Heavy Mix", value: "Multiple hard courses", detail: "Even a normal credit total can feel much harder when several courses are high-effort at the same time." },
      ]}
      contentTitle="Why Semester Planning Matters"
      contentIntro="Many students think only in credits, but weekly hours and course difficulty usually shape real semester stress more than credits alone."
      contentSections={[
        { title: "Credits do not tell the full story", paragraphs: ["Two courses with the same credit value can require very different effort depending on labs, reading volume, projects, or exam intensity.", "That is why a planner that includes difficulty and weekly hours gives a more realistic picture than registration numbers alone."] },
        { title: "Why early planning reduces overload", paragraphs: ["It is easier to adjust your course mix before the semester becomes stressful than after assignments start piling up.", "A quick semester plan helps you spot overload before it turns into missed deadlines or poor time management."] },
        { title: "Use this as a planning guide, not a policy tool", paragraphs: ["The tool estimates practical workload. It does not replace institutional credit rules, advisor guidance, or major-specific progression requirements.", "Its value is in helping you compare possible schedules and think through the real week-to-week impact."] },
      ]}
      faqs={[
        { q: "What is a good semester credit load?", a: "That depends on the institution, the subject mix, and your outside commitments. Many students treat roughly 12 to 15 credits as manageable, but course intensity matters a lot." },
        { q: "Why include weekly study hours?", a: "Credits show official academic weight, but weekly hours help estimate how demanding the semester will actually feel." },
        { q: "Can this replace advice from an academic advisor?", a: "No. This tool is for workload planning, while an advisor helps with degree progression, prerequisites, and institutional requirements." },
        { q: "Should I avoid semesters marked heavy?", a: "Not always, but a heavy result is a signal to review your schedule carefully, especially if you also work, commute, or have other large commitments." },
      ]}
      relatedTools={[
        { title: "Study Planner Calculator", href: "/education/study-planner-calculator", benefit: "Break down weekly study targets after you choose your semester load." },
        { title: "Homework Time Calculator", href: "/education/homework-time-calculator", benefit: "Estimate daily assignment time across your courses." },
        { title: "School Schedule Planner", href: "/education/school-schedule-planner", benefit: "Map your weekly timetable after choosing courses." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Course Planning", detail: "Useful before registration and during the first week of term." },
        { label: "Core Output", value: "Load Estimate", detail: "Shows credits, weekly hours, and an overall workload status." },
        { label: "Big Risk", value: "Hidden Intensity", detail: "Several hard courses together can feel much heavier than credits alone suggest." },
      ]}
    />
  );
}
