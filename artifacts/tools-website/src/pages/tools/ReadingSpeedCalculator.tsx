import { useMemo, useState } from "react";
import { BookOpen, Clock, Target } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

function formatMinutes(value: number) {
  const minutes = Math.floor(value);
  const seconds = Math.round((value - minutes) * 60);
  if (minutes <= 0) return `${seconds} sec`;
  if (seconds === 0) return `${minutes} min`;
  return `${minutes} min ${seconds} sec`;
}

export default function ReadingSpeedCalculator() {
  const [wordsRead, setWordsRead] = useState("750");
  const [minutes, setMinutes] = useState("5");
  const [seconds, setSeconds] = useState("0");

  const result = useMemo(() => {
    const words = parseFloat(wordsRead);
    const mins = parseFloat(minutes) || 0;
    const secs = parseFloat(seconds) || 0;
    const totalMinutes = mins + secs / 60;

    if (!Number.isFinite(words) || words <= 0 || totalMinutes <= 0) return null;

    const wpm = words / totalMinutes;
    const paceLabel =
      wpm < 150 ? "Careful or developing reader" :
      wpm < 250 ? "Average reading pace" :
      wpm < 350 ? "Strong reading pace" :
      "Fast reading pace";

    return {
      wpm,
      paceLabel,
      timeFor500: 500 / wpm,
      timeFor1000: 1000 / wpm,
      timeFor2000: 2000 / wpm,
    };
  }, [minutes, seconds, wordsRead]);

  return (
    <StudentToolPageShell
      title="Reading Speed Calculator"
      seoTitle="Reading Speed Calculator - Measure Words Per Minute"
      seoDescription="Measure your reading speed in words per minute with this free reading speed calculator. Estimate reading pace and reading time for longer passages instantly."
      canonical="https://usonlinetools.com/education/reading-speed-calculator"
      heroDescription="Measure your reading speed in words per minute, estimate how long longer passages will take, and get a clearer picture of your natural reading pace for school, study, and test prep."
      heroIcon={<BookOpen className="w-3.5 h-3.5" />}
      calculatorLabel="Words Per Minute"
      calculatorDescription="Enter how many words you read and how long it took to calculate WPM."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Reading speed test</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Words Read</label>
                <input type="number" min="1" value={wordsRead} onChange={(event) => setWordsRead(event.target.value)} className="tool-calc-input w-full" placeholder="750" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Minutes</label>
                <input type="number" min="0" value={minutes} onChange={(event) => setMinutes(event.target.value)} className="tool-calc-input w-full" placeholder="5" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Seconds</label>
                <input type="number" min="0" max="59" value={seconds} onChange={(event) => setSeconds(event.target.value)} className="tool-calc-input w-full" placeholder="0" />
              </div>
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Reading Speed</p>
                  <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{formatPercent(result.wpm, 1)} WPM</p>
                  <p className="text-sm text-muted-foreground mt-2">{result.paceLabel}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">500 Words</p>
                    <p className="text-2xl font-black text-foreground">{formatMinutes(result.timeFor500)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">1,000 Words</p>
                    <p className="text-2xl font-black text-foreground">{formatMinutes(result.timeFor1000)}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">2,000 Words</p>
                    <p className="text-2xl font-black text-foreground">{formatMinutes(result.timeFor2000)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Enter a word count and a reading time greater than zero.</p>
            )}
          </div>

          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-violet-500" />
              <h3 className="text-lg font-bold text-foreground">How to use your result</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use your WPM result to estimate how long assigned passages, exam prompts, or research material will take. This is especially useful when planning reading sessions before tests or deadlines.
            </p>
          </div>
        </div>
      }
      howToTitle="How to Use the Reading Speed Calculator"
      howToIntro="This tool measures words per minute, which is the standard way to estimate reading speed for study, comprehension practice, and timed exam preparation."
      howSteps={[
        {
          title: "Count how many words you read",
          description: "Use the exact number of words in the passage if possible. If the text came from an article, book, or assignment sheet, the word count may already be available.",
        },
        {
          title: "Enter the total reading time",
          description: "Add the minutes and seconds it took you to finish reading. Try to use uninterrupted time so the result reflects your true reading pace.",
        },
        {
          title: "Use the projected reading times",
          description: "The calculator estimates how long 500, 1,000, and 2,000 words would take at the same pace. That helps with planning reading homework and exam revision.",
        },
      ]}
      formulaTitle="Reading Speed Formula"
      formulaIntro="Reading speed is typically measured in words per minute, often shortened to WPM."
      formulaCards={[
        {
          label: "Words Per Minute",
          formula: "WPM = Words Read / Time In Minutes",
          detail: "If you read 750 words in 5 minutes, your reading speed is 150 WPM.",
        },
        {
          label: "Projected Reading Time",
          formula: "Time = Word Count / WPM",
          detail: "Once you know your WPM, you can estimate how long a 1,000-word reading assignment or article will take.",
        },
      ]}
      examplesTitle="Reading Speed Examples"
      examplesIntro="These examples show how the same WPM result can help with class reading, study planning, and longer passages."
      examples={[
        {
          title: "Careful Reading",
          value: "150 WPM",
          detail: "A 150 WPM pace is common when students read dense academic text and focus on understanding every paragraph.",
        },
        {
          title: "General Reading",
          value: "230 WPM",
          detail: "A reading speed around 200 to 250 WPM is a common everyday pace for many students reading standard material.",
        },
        {
          title: "Long Article",
          value: "4.3 min",
          detail: "At 230 WPM, a 1,000-word article takes about 4.3 minutes to read, not including note-taking or review.",
        },
      ]}
      contentTitle="Why Reading Speed Matters For Students"
      contentIntro="Reading speed is not just about reading quickly. It is about balancing speed and comprehension so you can finish assignments on time without losing understanding."
      contentSections={[
        {
          title: "Why WPM is useful",
          paragraphs: [
            "Words per minute gives students a clear benchmark for planning reading tasks. It helps answer practical questions like whether an assigned chapter will take 15 minutes or 45 minutes.",
            "That makes reading speed especially useful for study schedules, exam prep, and daily homework planning.",
          ],
        },
        {
          title: "Speed versus comprehension",
          paragraphs: [
            "A higher WPM is not automatically better. Dense textbooks, technical documents, and unfamiliar topics naturally reduce speed because careful comprehension matters more than rushing.",
            "The most useful reading pace is one that matches your goal. Fast skimming and close reading are different skills.",
          ],
        },
        {
          title: "Using reading speed in study planning",
          paragraphs: [
            "If you know your reading pace, you can budget time for textbooks, articles, and revision notes more accurately. That reduces last-minute overload before tests and deadlines.",
            "It also helps you spot whether a task feels hard because the content is difficult or simply because the reading volume is larger than expected.",
          ],
        },
      ]}
      faqs={[
        {
          q: "How do I calculate reading speed in WPM?",
          a: "Divide the number of words you read by the number of minutes it took you to read them. That gives your words-per-minute reading speed.",
        },
        {
          q: "What is a good reading speed for students?",
          a: "It depends on the text and the goal. Many students read general material around 200 to 250 WPM, but difficult academic reading can be slower.",
        },
        {
          q: "Does faster reading always mean better reading?",
          a: "No. Reading speed matters only when comprehension stays strong. For technical or complex material, slower reading is often more effective.",
        },
        {
          q: "Can I use this for exam preparation?",
          a: "Yes. It is useful for estimating how long assigned passages, revision notes, and practice reading sections may take.",
        },
      ]}
      relatedTools={[
        { title: "Study Planner Calculator", href: "/education/study-planner-calculator", benefit: "Turn reading and revision workload into a practical daily plan." },
        { title: "Homework Time Calculator", href: "/education/homework-time-calculator", benefit: "Estimate total homework time including reading tasks." },
        { title: "Class Average Calculator", href: "/education/class-average-calculator", benefit: "Analyze score averages for study groups and class results." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Reading Practice", detail: "Useful for school reading, exam prep, and timed comprehension work." },
        { label: "Core Output", value: "WPM", detail: "Also projects reading time for common passage lengths." },
        { label: "Key Reminder", value: "Comprehension Matters", detail: "A useful pace is one that matches your understanding goal." },
      ]}
    />
  );
}
