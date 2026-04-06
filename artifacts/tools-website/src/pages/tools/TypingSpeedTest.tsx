import { useEffect, useMemo, useState } from "react";
import { Gauge, Keyboard, RotateCcw, Timer } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

const PASSAGES = [
  {
    label: "Academic Paragraph",
    text: "Effective study habits depend on consistency more than intensity. Short, focused sessions repeated across the week usually produce better recall than one long session completed at the last minute.",
  },
  {
    label: "Science Passage",
    text: "Careful observation, accurate measurement, and clear explanations are three habits that improve scientific writing. Good reports make complex ideas easier to understand and evaluate.",
  },
  {
    label: "History Passage",
    text: "Historical analysis involves more than memorizing dates. Students compare causes, consequences, and perspectives to understand why events happened and how they shaped later decisions.",
  },
];

export default function TypingSpeedTest() {
  const [selectedPassage, setSelectedPassage] = useState("0");
  const [durationSeconds, setDurationSeconds] = useState("60");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const passage = PASSAGES[Number(selectedPassage)] ?? PASSAGES[0];

  const resetTest = (nextDuration = durationSeconds) => {
    const duration = parseInt(nextDuration, 10);
    setUserInput("");
    setElapsedSeconds(0);
    setIsRunning(false);
    setIsComplete(false);
    setTimeLeft(Number.isFinite(duration) && duration > 0 ? duration : 60);
  };

  useEffect(() => {
    if (!isRunning || isComplete) return;

    const interval = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          setIsRunning(false);
          setIsComplete(true);
          return 0;
        }

        return current - 1;
      });

      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isComplete, isRunning]);

  const metrics = useMemo(() => {
    const typedLength = userInput.length;

    let correctChars = 0;
    for (let index = 0; index < typedLength; index += 1) {
      if (userInput[index] === passage.text[index]) {
        correctChars += 1;
      }
    }

    const mistakes = Math.max(0, typedLength - correctChars);
    const elapsedMinutes = elapsedSeconds > 0 ? elapsedSeconds / 60 : 0;
    const grossWpm = elapsedMinutes > 0 ? typedLength / 5 / elapsedMinutes : 0;
    const netWpm = elapsedMinutes > 0 ? correctChars / 5 / elapsedMinutes : 0;
    const cpm = elapsedMinutes > 0 ? correctChars / elapsedMinutes : 0;
    const accuracy = typedLength > 0 ? (correctChars / typedLength) * 100 : 100;
    const progress = passage.text.length > 0 ? Math.min(100, (correctChars / passage.text.length) * 100) : 0;

    return {
      correctChars,
      mistakes,
      grossWpm,
      netWpm,
      cpm,
      accuracy,
      progress,
    };
  }, [elapsedSeconds, passage.text, userInput]);

  const handleChange = (value: string) => {
    if (isComplete) return;

    if (!isRunning && value.length > 0) {
      setIsRunning(true);
    }

    setUserInput(value);

    if (value.length >= passage.text.length) {
      setIsRunning(false);
      setIsComplete(true);
    }
  };

  return (
    <StudentToolPageShell
      title="Typing Speed Test"
      seoTitle="Typing Speed Test - Measure WPM, Accuracy, And CPM"
      seoDescription="Test your typing speed with timed passages and instant WPM, accuracy, and CPM metrics using this free typing speed test."
      canonical="https://usonlinetools.com/education/typing-speed-test"
      heroDescription="Measure how quickly and accurately you type with a timed passage. Use the results to improve exam typing speed, assignment drafting, and general keyboard fluency."
      heroIcon={<Keyboard className="w-3.5 h-3.5" />}
      calculatorLabel="Live Typing Test"
      calculatorDescription="Run a timed typing test with live speed and accuracy metrics."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Timer className="h-4 w-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Set your test</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Passage</label>
                <select
                  value={selectedPassage}
                  onChange={(event) => {
                    setSelectedPassage(event.target.value);
                    resetTest();
                  }}
                  className="tool-calc-input w-full"
                >
                  {PASSAGES.map((item, index) => (
                    <option key={item.label} value={index}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Duration</label>
                <select
                  value={durationSeconds}
                  onChange={(event) => {
                    setDurationSeconds(event.target.value);
                    resetTest(event.target.value);
                  }}
                  className="tool-calc-input w-full"
                >
                  <option value="30">30 seconds</option>
                  <option value="60">60 seconds</option>
                  <option value="120">120 seconds</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Sample Text</p>
            <p className="text-sm leading-relaxed text-foreground">{passage.text}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-indigo-500/20 bg-background p-4 text-center">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Time Left</p>
              <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{timeLeft}s</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Net WPM</p>
              <p className="text-3xl font-black text-foreground">{formatPercent(metrics.netWpm, 1)}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Accuracy</p>
              <p className="text-3xl font-black text-foreground">{formatPercent(metrics.accuracy, 1)}%</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">CPM</p>
              <p className="text-3xl font-black text-foreground">{formatPercent(metrics.cpm, 0)}</p>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-violet-500/15 bg-violet-500/5 p-5">
            <textarea
              value={userInput}
              onChange={(event) => handleChange(event.target.value)}
              disabled={isComplete}
              className="tool-calc-input min-h-[180px] w-full resize-y"
              placeholder="Start typing the sample text here. The timer begins with your first keystroke."
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Gross WPM</p>
                <p className="text-2xl font-black text-foreground">{formatPercent(metrics.grossWpm, 1)}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Correct Chars</p>
                <p className="text-2xl font-black text-foreground">{metrics.correctChars}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Mistakes</p>
                <p className="text-2xl font-black text-foreground">{metrics.mistakes}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Progress</p>
                <p className="text-2xl font-black text-foreground">{formatPercent(metrics.progress, 0)}%</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => resetTest()} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold">
                <RotateCcw className="h-4 w-4" /> Reset Test
              </button>
              <div className="inline-flex items-center gap-2 rounded-xl bg-indigo-500/10 px-4 py-3 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                <Gauge className="h-4 w-4" />
                {isComplete ? "Test complete" : isRunning ? "Test running" : "Waiting to start"}
              </div>
            </div>
          </div>
        </div>
      }
      howToTitle="How to Use the Typing Speed Test"
      howToIntro="Typing tests are most useful when they measure both speed and accuracy, because fast but error-filled typing rarely helps in real school or work tasks."
      howSteps={[
        { title: "Choose a passage and test duration", description: "A shorter test gives a quick snapshot, while a longer test shows whether your speed holds up over time." },
        { title: "Start typing the sample text", description: "The timer begins on your first keystroke, so you can focus on typing naturally instead of pressing a separate start button." },
        { title: "Review WPM and accuracy together", description: "Use the results to decide whether your next goal is more speed, fewer mistakes, or better endurance." },
      ]}
      formulaTitle="Typing Test Metrics"
      formulaIntro="Typing speed tests usually rely on standardized word and character calculations so different results stay comparable."
      formulaCards={[
        { label: "Words Per Minute", formula: "WPM = Typed Characters / 5 / Minutes", detail: "Typing tests treat five characters as one standard word so speed can be compared across passages." },
        { label: "Accuracy", formula: "Accuracy = Correct Characters / Typed Characters x 100", detail: "Accuracy measures how much of your typed text matches the target passage instead of only counting raw speed." },
      ]}
      examplesTitle="Typing Test Examples"
      examplesIntro="These examples show common performance goals for students and general computer users."
      examples={[
        { title: "Developing Skill", value: "25 to 35 WPM", detail: "A beginner or occasional typist often falls in this range while still working on key familiarity." },
        { title: "Comfortable Speed", value: "40 to 55 WPM", detail: "This is a solid range for most school assignments, emails, and everyday keyboard tasks." },
        { title: "Strong Speed", value: "60+ WPM", detail: "Higher speeds are useful for long essays, notes, coding, and time-limited online tests." },
      ]}
      contentTitle="Why Typing Speed Practice Matters"
      contentIntro="Typing speed is not only about performance bragging rights. It affects how efficiently you can draft essays, take notes, and respond during timed digital assessments."
      contentSections={[
        { title: "Why accuracy matters as much as speed", paragraphs: ["A high WPM number looks good, but constant correction slows down real work. Accuracy gives a truer picture of usable typing performance.", "That is why this test shows both net speed and mistakes."] },
        { title: "Why timed practice helps", paragraphs: ["Short timed sessions build familiarity with the keyboard and make improvements easier to notice from week to week.", "They also show whether your concentration drops once the passage becomes longer."] },
        { title: "How to improve results", paragraphs: ["Focus on rhythm before raw speed, keep your eyes on the sample, and avoid looking down at the keyboard whenever possible.", "Regular short practice usually improves typing more reliably than occasional long sessions."] },
      ]}
      faqs={[
        { q: "What is a good typing speed for students?", a: "Around 40 WPM with solid accuracy is already useful for most school tasks, while faster speeds help with essays and digital exams." },
        { q: "Why is my net WPM lower than gross WPM?", a: "Net WPM reflects the portion of your typing that was correct, so mistakes reduce the usable speed result." },
        { q: "Does the timer start automatically?", a: "Yes. The countdown begins when you type the first character." },
        { q: "Can I repeat the test with a different passage?", a: "Yes. You can switch passages or durations and reset the test at any time." },
      ]}
      relatedTools={[
        { title: "Line Counter Tool", href: "/productivity/line-counter-tool", benefit: "Check text size and structure after typing longer passages." },
        { title: "Text Formatter Tool", href: "/productivity/text-formatter-tool", benefit: "Clean and transform typed text after drafting." },
        { title: "Reading Speed Calculator", href: "/education/reading-speed-calculator", benefit: "Compare typing speed with reading pace for study planning." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Typing Practice", detail: "Useful for essays, notes, coding, and timed digital exams." },
        { label: "Core Output", value: "WPM and Accuracy", detail: "Shows gross speed, net speed, accuracy, CPM, and mistakes." },
        { label: "Start Mode", value: "Auto Timer", detail: "The countdown starts with your first typed character." },
      ]}
    />
  );
}
