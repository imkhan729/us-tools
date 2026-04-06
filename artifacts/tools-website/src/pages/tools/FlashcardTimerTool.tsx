import { useEffect, useMemo, useState } from "react";
import { Clock3, Pause, Play, RotateCcw, Timer } from "lucide-react";
import StudentToolPageShell from "./StudentToolPageShell";
import { formatPercent } from "./studentGradeUtils";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

type Phase = "idle" | "study" | "break" | "complete";

export default function FlashcardTimerTool() {
  const [studyMinutes, setStudyMinutes] = useState("15");
  const [breakMinutes, setBreakMinutes] = useState("3");
  const [rounds, setRounds] = useState("4");
  const [phase, setPhase] = useState<Phase>("idle");
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [currentRound, setCurrentRound] = useState(1);
  const [isRunning, setIsRunning] = useState(false);

  const plan = useMemo(() => {
    const study = parseFloat(studyMinutes);
    const rest = parseFloat(breakMinutes);
    const totalRounds = parseFloat(rounds);
    if (!Number.isFinite(study) || !Number.isFinite(rest) || !Number.isFinite(totalRounds) || study <= 0 || rest < 0 || totalRounds <= 0) return null;

    return {
      study,
      rest,
      totalRounds,
      totalFocus: study * totalRounds,
      totalBreak: rest * Math.max(0, totalRounds - 1),
      sessionMinutes: study * totalRounds + rest * Math.max(0, totalRounds - 1),
    };
  }, [breakMinutes, rounds, studyMinutes]);

  useEffect(() => {
    if (!isRunning || phase === "idle" || phase === "complete") return;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current > 1) return current - 1;

        if (!plan) {
          setIsRunning(false);
          setPhase("idle");
          return 0;
        }

        if (phase === "study") {
          if (currentRound >= plan.totalRounds) {
            setPhase("complete");
            setIsRunning(false);
            return 0;
          }

          setPhase("break");
          return Math.round(plan.rest * 60);
        }

        setPhase("study");
        setCurrentRound((round) => round + 1);
        return Math.round(plan.study * 60);
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [currentRound, isRunning, phase, plan]);

  const startTimer = () => {
    if (!plan) return;

    if (phase === "idle" || phase === "complete") {
      setCurrentRound(1);
      setPhase("study");
      setSecondsLeft(Math.round(plan.study * 60));
    }
    setIsRunning(true);
  };

  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    if (!plan) return;
    setIsRunning(false);
    setPhase("idle");
    setCurrentRound(1);
    setSecondsLeft(Math.round(plan.study * 60));
  };

  return (
    <StudentToolPageShell
      title="Flashcard Timer Tool"
      seoTitle="Flashcard Timer Tool - Time Flashcard Study Sessions"
      seoDescription="Run timed flashcard study rounds with built-in break intervals and total session planning using this free flashcard timer tool."
      canonical="https://usonlinetools.com/education/flashcard-timer-tool"
      heroDescription="Time focused flashcard sessions without guessing when to stop or break. Set study rounds, break lengths, and total cycles so revision feels more deliberate and less exhausting."
      heroIcon={<Timer className="w-3.5 h-3.5" />}
      calculatorLabel="Flashcard Session Timer"
      calculatorDescription="Run timed study rounds and built-in rest breaks for flashcard practice."
      calculator={
        <div className="space-y-5">
          <div className="rounded-2xl border border-indigo-500/15 bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock3 className="w-4 h-4 text-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">Set your timer plan</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Study Minutes</label>
                <input type="number" min="1" value={studyMinutes} onChange={(event) => setStudyMinutes(event.target.value)} className="tool-calc-input w-full" placeholder="15" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Break Minutes</label>
                <input type="number" min="0" value={breakMinutes} onChange={(event) => setBreakMinutes(event.target.value)} className="tool-calc-input w-full" placeholder="3" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Rounds</label>
                <input type="number" min="1" value={rounds} onChange={(event) => setRounds(event.target.value)} className="tool-calc-input w-full" placeholder="4" />
              </div>
            </div>
          </div>

          {plan ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-indigo-500/20 bg-background p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{phase === "idle" ? "Ready to Start" : phase === "complete" ? "Session Complete" : phase === "study" ? "Study Round" : "Break Time"}</p>
                <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{phase === "complete" ? "Done" : formatTime(secondsLeft)}</p>
                <p className="mt-2 text-sm text-muted-foreground">Round {currentRound} of {plan.totalRounds}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={startTimer} className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-600">
                  <Play className="w-4 h-4" /> {isRunning ? "Running" : phase === "idle" || phase === "complete" ? "Start Session" : "Resume"}
                </button>
                <button onClick={pauseTimer} disabled={!isRunning} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold disabled:opacity-50">
                  <Pause className="w-4 h-4" /> Pause
                </button>
                <button onClick={resetTimer} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold">
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Focus</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(plan.totalFocus, 0)} min</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Total Break</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(plan.totalBreak, 0)} min</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Session Length</p>
                  <p className="text-2xl font-black text-foreground">{formatPercent(plan.sessionMinutes, 0)} min</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Enter valid study, break, and round values to prepare a session.</p>
          )}
        </div>
      }
      howToTitle="How to Use the Flashcard Timer Tool"
      howToIntro="Flashcard study is usually more effective when it is broken into focused rounds rather than one long unstructured session."
      howSteps={[
        { title: "Set a study round length", description: "Choose how many minutes you want to focus on flashcards before taking a break." },
        { title: "Set a short break", description: "Short recovery time helps keep concentration high between rounds without fully breaking momentum." },
        { title: "Choose the number of rounds", description: "Use a small number for quick revision or more rounds for longer review blocks before exams." },
      ]}
      formulaTitle="Flashcard Session Metrics"
      formulaIntro="The timer combines focus rounds and rest intervals into one predictable revision block."
      formulaCards={[
        { label: "Total Focus Time", formula: "Focus Time = Study Minutes x Rounds", detail: "This shows how much actual flashcard review time is included in the session." },
        { label: "Total Session Length", formula: "Session = Focus Time + Break Time", detail: "Breaks matter because they affect when the full revision block will finish." },
      ]}
      examplesTitle="Flashcard Timer Examples"
      examplesIntro="These examples show practical ways students use timed flashcard revision."
      examples={[
        { title: "Quick Review", value: "3 x 10 min", detail: "A short session is useful for vocabulary, formulas, or last-minute recall work." },
        { title: "Standard Session", value: "4 x 15 min", detail: "This format gives solid repetition without making the session feel endless." },
        { title: "Longer Prep Block", value: "6 rounds", detail: "Extra rounds can work for major exam periods if you still keep short breaks." },
      ]}
      contentTitle="Why Flashcard Timing Helps"
      contentIntro="Flashcards are excellent for repetition, but students often either stop too soon or push too long and lose recall quality. A timer makes the session more deliberate."
      contentSections={[
        { title: "Why rounds improve focus", paragraphs: ["A clear study round creates urgency and helps you stay mentally engaged with active recall instead of passive reviewing.", "Short, repeated blocks are often easier to sustain than one long open-ended session."] },
        { title: "Why breaks still matter", paragraphs: ["Breaks reduce mental fatigue and make it easier to return with attention for the next round.", "Even a small pause can improve consistency across multiple flashcard cycles."] },
        { title: "How to use this with real revision", paragraphs: ["Use the timer for one deck, one chapter, or one concept group at a time so the session has a clear focus.", "After the session, review difficult cards separately or move them into your next round plan."] },
      ]}
      faqs={[
        { q: "What is a good flashcard study interval?", a: "Many students use 10 to 20 minute study rounds with short breaks, but the best interval depends on attention span and subject difficulty." },
        { q: "Can I pause the timer?", a: "Yes. You can pause and resume at any point during the session." },
        { q: "Does this save sessions after I leave the page?", a: "No. This timer runs in the current browser session and does not store progress permanently." },
        { q: "Should I use more rounds or longer rounds?", a: "If attention drops quickly, more shorter rounds are usually better. If you stay focused easily, slightly longer rounds may work well." },
      ]}
      relatedTools={[
        { title: "Study Planner Calculator", href: "/education/study-planner-calculator", benefit: "Fit flashcard sessions into a wider exam plan." },
        { title: "Revision Planner Tool", href: "/education/revision-planner-tool", benefit: "Prioritize weak and medium topics before timing sessions." },
        { title: "Exam Countdown Timer", href: "/education/exam-countdown-timer", benefit: "Track how much time is left before the exam date." },
      ]}
      quickFacts={[
        { label: "Best For", value: "Active Recall", detail: "Useful for vocabulary, formulas, facts, and short-answer review." },
        { label: "Core Output", value: "Timed Rounds", detail: "Shows the current phase, round number, and total session length." },
        { label: "Main Benefit", value: "Consistency", detail: "A timer makes revision more repeatable and less mentally vague." },
      ]}
    />
  );
}
