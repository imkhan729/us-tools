import { useState } from "react";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { differenceInYears, differenceInMonths, differenceInDays, addYears, format, isValid, parseISO, isAfter } from "date-fns";
import { CalendarDays, Gift, Clock, Hash } from "lucide-react";
import { motion } from "framer-motion";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [compareDate, setCompareDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const calculateAge = () => {
    const start = parseISO(birthDate);
    const end = parseISO(compareDate);

    if (!isValid(start) || !isValid(end)) return null;
    if (isAfter(start, end)) return { error: "Birth date must be before compare date." };

    const years = differenceInYears(end, start);
    const dateAfterYears = addYears(start, years);
    const months = differenceInMonths(end, dateAfterYears);
    const dateAfterMonths = new Date(dateAfterYears.setMonth(dateAfterYears.getMonth() + months));
    const days = differenceInDays(end, dateAfterMonths);

    // Total stats
    const totalMonths = differenceInMonths(end, start);
    const totalDays = differenceInDays(end, start);

    // Next birthday
    const currentYearBirthday = new Date(start.getFullYear() + years, start.getMonth(), start.getDate());
    let nextBirthday = currentYearBirthday;
    if (isAfter(end, currentYearBirthday) || format(end, 'MM-dd') === format(currentYearBirthday, 'MM-dd')) {
      nextBirthday = new Date(currentYearBirthday.getFullYear() + 1, currentYearBirthday.getMonth(), currentYearBirthday.getDate());
    }
    const daysToBirthday = differenceInDays(nextBirthday, end);

    return { years, months, days, totalMonths, totalDays, daysToBirthday, nextBirthday };
  };

  const stats = calculateAge();

  const ToolUI = (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="glass-card p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400"></div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-emerald-400 uppercase tracking-wider">Date of Birth</label>
          <div className="relative">
            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              type="date" 
              className="glass-input w-full pl-12 pr-4 py-4 text-lg"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground uppercase tracking-wider">Age at the Date of</label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              type="date" 
              className="glass-input w-full pl-12 pr-4 py-4 text-lg"
              value={compareDate}
              onChange={(e) => setCompareDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {stats && !('error' in stats) ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main Age */}
          <div className="lg:col-span-2 glass-card p-8 rounded-3xl flex flex-col justify-center border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <h3 className="text-xl font-medium text-muted-foreground mb-6">Exact Age</h3>
            <div className="flex flex-wrap items-baseline gap-4 md:gap-8">
              <div className="text-center">
                <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
                  {stats.years}
                </span>
                <span className="block text-lg font-medium text-emerald-400 mt-2">Years</span>
              </div>
              <div className="text-center">
                <span className="text-5xl md:text-6xl font-black text-white/80">
                  {stats.months}
                </span>
                <span className="block text-base font-medium text-muted-foreground mt-2">Months</span>
              </div>
              <div className="text-center">
                <span className="text-5xl md:text-6xl font-black text-white/80">
                  {stats.days}
                </span>
                <span className="block text-base font-medium text-muted-foreground mt-2">Days</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Next Birthday */}
            <div className="glass-card p-6 rounded-3xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <Gift className="w-6 h-6 text-pink-400" />
                <h3 className="font-bold text-white">Next Birthday</h3>
              </div>
              <div className="text-4xl font-black text-pink-400 mb-1">{stats.daysToBirthday}</div>
              <p className="text-sm font-medium text-muted-foreground">days away</p>
              <p className="text-xs text-muted-foreground/70 mt-3 pt-3 border-t border-white/10">
                {format(stats.nextBirthday, 'EEEE, MMMM do, yyyy')}
              </p>
            </div>

            {/* Extra Stats */}
            <div className="glass-card p-6 rounded-3xl">
              <div className="flex items-center space-x-3 mb-4">
                <Hash className="w-6 h-6 text-blue-400" />
                <h3 className="font-bold text-white">Total Time</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-muted-foreground">Total Months:</span>
                  <span className="text-white font-medium">{stats.totalMonths.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Days:</span>
                  <span className="text-white font-medium">{stats.totalDays.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : stats && 'error' in stats ? (
        <div className="glass-card p-6 rounded-2xl bg-red-500/10 border-red-500/20 text-red-400 text-center">
          {stats.error}
        </div>
      ) : (
        <div className="glass-card p-12 rounded-3xl text-center flex flex-col items-center justify-center opacity-50">
          <CalendarDays className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium text-white">Enter dates to calculate age</h3>
        </div>
      )}
    </div>
  );

  return (
    <ToolPageLayout
      title="Age Calculator"
      description="Find out your exact age in years, months, and days. Countdown the days to your next birthday."
      tool={ToolUI}
      howToUse={
        <>
          <p>To calculate your age accurately:</p>
          <ol>
            <li>Select your Date of Birth in the first field.</li>
            <li>The "Age at the Date of" field defaults to today's date, but you can change it to calculate age at a specific past or future event.</li>
            <li>The tool will instantly display your precise age, total days lived, and countdown to your next birthday.</li>
          </ol>
        </>
      }
      faq={[
        { q: "Does the calculator account for leap years?", a: "Yes, our age calculator uses standard date-time libraries that perfectly account for leap years and different month lengths." },
        { q: "Can I find out how old someone was when they died?", a: "Yes. Simply put their birth date in the first field, and the date they passed away in the second field." },
      ]}
      related={[
        { title: "Percentage Calculator", path: "/tools/percentage-calculator", icon: <CalendarDays className="w-5 h-5" /> },
      ]}
    />
  );
}
