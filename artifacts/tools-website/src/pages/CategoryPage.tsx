import { useParams } from "wouter";
import { Layout } from "@/components/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { TOOL_CATEGORIES, getToolPath, type Tool } from "@/data/tools";
import { ChevronRight, ArrowRight,
  Calculator, DollarSign, Ruler, Clock, Heart, HardHat, Type, BookOpen, Gamepad2,
  Percent, TrendingUp, CreditCard, PiggyBank, ReceiptText, Landmark, BarChart3, Scale, Hash,
  Divide, Sigma, Infinity, FlaskConical, Dices, AlignLeft, FileText, Globe, Thermometer,
  Weight, Timer, AlarmClock, BicepsFlexed, Apple, Droplets, Activity, Building2,
  PaintBucket, Grid3x3, SquareStack, Swords, Trophy, Zap, Shuffle, ListOrdered,
  Binary, Link2, QrCode, KeyRound, Wrench, Lock, Palette, Car, Plug, Sun,
  Footprints, Wine, Smile, Code, Star, CalendarDays, Image, Film,
  ImageIcon, FileImage, Crop, Paintbrush, Pipette, RotateCw,
  Layers, ScanLine, Sparkles, Download, FileUp, FileDown,
  FileLock, FileKey, FileSignature, FileType, Stamp, GripVertical,
  Scissors, Minimize2, Maximize2, MonitorPlay,
  Braces, FileCode, TerminalSquare, Bug, RefreshCw,
  PenTool, Hexagon, Eye, Share2, AtSign, MessageCircle,
  Search as SearchIcon, Tag, MapPin,
  ShieldAlert, KeySquare, Fingerprint, UnlockKeyhole, ScanText,
} from "lucide-react";

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; light: string }> = {
  "math":         { bg: "bg-blue-500",    text: "text-blue-500",    border: "border-blue-500",    light: "bg-blue-50 dark:bg-blue-950/30" },
  "finance":      { bg: "bg-emerald-500", text: "text-emerald-500", border: "border-emerald-500", light: "bg-emerald-50 dark:bg-emerald-950/30" },
  "conversion":   { bg: "bg-purple-500",  text: "text-purple-500",  border: "border-purple-500",  light: "bg-purple-50 dark:bg-purple-950/30" },
  "time-date":    { bg: "bg-orange-500",  text: "text-orange-500",  border: "border-orange-500",  light: "bg-orange-50 dark:bg-orange-950/30" },
  "health":       { bg: "bg-red-500",     text: "text-red-500",     border: "border-red-500",     light: "bg-red-50 dark:bg-red-950/30" },
  "construction": { bg: "bg-yellow-500",  text: "text-yellow-600",  border: "border-yellow-500",  light: "bg-yellow-50 dark:bg-yellow-950/30" },
  "productivity": { bg: "bg-teal-500",    text: "text-teal-500",    border: "border-teal-500",    light: "bg-teal-50 dark:bg-teal-950/30" },
  "education":    { bg: "bg-indigo-500",  text: "text-indigo-500",  border: "border-indigo-500",  light: "bg-indigo-50 dark:bg-indigo-950/30" },
  "gaming":       { bg: "bg-pink-500",    text: "text-pink-500",    border: "border-pink-500",    light: "bg-pink-50 dark:bg-pink-950/30" },
  "image":        { bg: "bg-cyan-500",    text: "text-cyan-500",    border: "border-cyan-500",    light: "bg-cyan-50 dark:bg-cyan-950/30" },
  "pdf":          { bg: "bg-rose-500",    text: "text-rose-500",    border: "border-rose-500",    light: "bg-rose-50 dark:bg-rose-950/30" },
  "developer":    { bg: "bg-slate-500",   text: "text-slate-500",   border: "border-slate-500",   light: "bg-slate-50 dark:bg-slate-950/30" },
  "css-design":   { bg: "bg-fuchsia-500", text: "text-fuchsia-500", border: "border-fuchsia-500", light: "bg-fuchsia-50 dark:bg-fuchsia-950/30" },
  "seo":          { bg: "bg-lime-500",    text: "text-lime-500",    border: "border-lime-500",    light: "bg-lime-50 dark:bg-lime-950/30" },
  "security":     { bg: "bg-amber-500",   text: "text-amber-500",   border: "border-amber-500",   light: "bg-amber-50 dark:bg-amber-950/30" },
  "social-media": { bg: "bg-violet-500",  text: "text-violet-500",  border: "border-violet-500",  light: "bg-violet-50 dark:bg-violet-950/30" },
};

const CATEGORY_ICONS_LG: Record<string, React.ReactNode> = {
  "math": <Calculator className="w-8 h-8" />,
  "finance": <DollarSign className="w-8 h-8" />,
  "conversion": <Ruler className="w-8 h-8" />,
  "time-date": <Clock className="w-8 h-8" />,
  "health": <Heart className="w-8 h-8" />,
  "construction": <HardHat className="w-8 h-8" />,
  "productivity": <Type className="w-8 h-8" />,
  "education": <BookOpen className="w-8 h-8" />,
  "gaming": <Gamepad2 className="w-8 h-8" />,
  "image": <ImageIcon className="w-8 h-8" />,
  "pdf": <FileImage className="w-8 h-8" />,
  "developer": <Braces className="w-8 h-8" />,
  "css-design": <PenTool className="w-8 h-8" />,
  "seo": <SearchIcon className="w-8 h-8" />,
  "security": <ShieldAlert className="w-8 h-8" />,
  "social-media": <Share2 className="w-8 h-8" />,
};

const TOOL_ICON_MAP: Record<string, React.ReactNode> = {
  "percentage-calculator": <Percent className="w-4 h-4" />,
  "percentage-increase-calculator": <TrendingUp className="w-4 h-4" />,
  "percentage-decrease-calculator": <TrendingUp className="w-4 h-4 rotate-180" />,
  "ratio-calculator": <Scale className="w-4 h-4" />,
  "average-calculator": <BarChart3 className="w-4 h-4" />,
  "scientific-calculator": <FlaskConical className="w-4 h-4" />,
  "standard-deviation-calculator": <Sigma className="w-4 h-4" />,
  "power-calculator": <Zap className="w-4 h-4" />,
  "logarithm-calculator": <Infinity className="w-4 h-4" />,
  "factorial-calculator": <Hash className="w-4 h-4" />,
  "prime-number-checker": <Hash className="w-4 h-4" />,
  "lcm-calculator": <ListOrdered className="w-4 h-4" />,
  "gcd-calculator": <ListOrdered className="w-4 h-4" />,
  "random-number-generator": <Dices className="w-4 h-4" />,
  "mean-median-mode-calculator": <BarChart3 className="w-4 h-4" />,
  "simple-interest-calculator": <Percent className="w-4 h-4" />,
  "compound-interest-calculator": <TrendingUp className="w-4 h-4" />,
  "loan-emi-calculator": <Landmark className="w-4 h-4" />,
  "discount-calculator": <ReceiptText className="w-4 h-4" />,
  "profit-margin-calculator": <TrendingUp className="w-4 h-4" />,
  "savings-calculator": <PiggyBank className="w-4 h-4" />,
  "tip-calculator": <ReceiptText className="w-4 h-4" />,
  "salary-calculator": <CreditCard className="w-4 h-4" />,
  "tax-calculator": <ReceiptText className="w-4 h-4" />,
  "mortgage-payment-calculator": <Landmark className="w-4 h-4" />,
  "gst-calculator": <ReceiptText className="w-4 h-4" />,
  "inflation-calculator": <TrendingUp className="w-4 h-4" />,
  "commission-calculator": <DollarSign className="w-4 h-4" />,
  "investment-growth-calculator": <TrendingUp className="w-4 h-4" />,
  "budget-calculator": <PiggyBank className="w-4 h-4" />,
  "temperature-converter": <Thermometer className="w-4 h-4" />,
  "weight-converter": <Weight className="w-4 h-4" />,
  "length-converter": <Ruler className="w-4 h-4" />,
  "area-converter": <Grid3x3 className="w-4 h-4" />,
  "color-converter": <SquareStack className="w-4 h-4" />,
  "number-base-converter": <Binary className="w-4 h-4" />,
  "currency-converter": <DollarSign className="w-4 h-4" />,
  "data-storage-converter": <Binary className="w-4 h-4" />,
  "speed-converter": <Zap className="w-4 h-4" />,
  "volume-converter": <FlaskConical className="w-4 h-4" />,
  "age-calculator": <Clock className="w-4 h-4" />,
  "date-difference-calculator": <Clock className="w-4 h-4" />,
  "time-zone-converter": <Globe className="w-4 h-4" />,
  "countdown-timer": <AlarmClock className="w-4 h-4" />,
  "unix-timestamp-converter": <Timer className="w-4 h-4" />,
  "bmi-calculator": <Activity className="w-4 h-4" />,
  "bmr-calculator": <Activity className="w-4 h-4" />,
  "tdee-calculator": <BicepsFlexed className="w-4 h-4" />,
  "calorie-intake-calculator": <Apple className="w-4 h-4" />,
  "water-intake-calculator": <Droplets className="w-4 h-4" />,
  "ideal-weight-calculator": <Scale className="w-4 h-4" />,
  "sleep-calculator": <AlarmClock className="w-4 h-4" />,
  "heart-rate-calculator": <Heart className="w-4 h-4" />,
  "concrete-volume-calculator": <Building2 className="w-4 h-4" />,
  "paint-calculator": <PaintBucket className="w-4 h-4" />,
  "brick-calculator": <Building2 className="w-4 h-4" />,
  "flooring-calculator": <Grid3x3 className="w-4 h-4" />,
  "tile-calculator": <Grid3x3 className="w-4 h-4" />,
  "word-counter": <FileText className="w-4 h-4" />,
  "character-counter": <AlignLeft className="w-4 h-4" />,
  "password-generator": <KeyRound className="w-4 h-4" />,
  "text-case-converter": <Type className="w-4 h-4" />,
  "lorem-ipsum-generator": <AlignLeft className="w-4 h-4" />,
  "url-encoder-decoder": <Link2 className="w-4 h-4" />,
  "base64-encoder-decoder": <Binary className="w-4 h-4" />,
  "json-formatter": <FileText className="w-4 h-4" />,
  "text-reverser": <Shuffle className="w-4 h-4" />,
  "qr-code-generator": <QrCode className="w-4 h-4" />,
  "uuid-generator": <Hash className="w-4 h-4" />,
  "gpa-calculator": <BookOpen className="w-4 h-4" />,
  "grade-calculator": <BookOpen className="w-4 h-4" />,
  "binary-converter": <Binary className="w-4 h-4" />,
  "roman-numeral-converter": <Binary className="w-4 h-4" />,
  "roblox-tax-calculator": <Gamepad2 className="w-4 h-4" />,
  "minecraft-circle-calculator": <Grid3x3 className="w-4 h-4" />,
  "valorant-sensitivity-calculator": <Swords className="w-4 h-4" />,
  "dnd-dice-roller": <Dices className="w-4 h-4" />,
  "pokemon-damage-calculator": <Trophy className="w-4 h-4" />,
  "blox-fruits-calculator": <Swords className="w-4 h-4" />,
  // Extended icons for all tools
  "rounding-numbers-calculator": <Calculator className="w-4 h-4" />,
  "exponents-calculator": <Zap className="w-4 h-4" />,
  "variance-calculator": <BarChart3 className="w-4 h-4" />,
  "number-sequence-generator": <ListOrdered className="w-4 h-4" />,
  "divisibility-checker": <Hash className="w-4 h-4" />,
  "expense-calculator": <ReceiptText className="w-4 h-4" />,
  "cost-per-unit-calculator": <DollarSign className="w-4 h-4" />,
  "price-per-unit-calculator": <DollarSign className="w-4 h-4" />,
  "payback-period-calculator": <TrendingUp className="w-4 h-4" />,
  "loan-interest-calculator": <Landmark className="w-4 h-4" />,
  "savings-goal-calculator": <PiggyBank className="w-4 h-4" />,
  "revenue-calculator": <BarChart3 className="w-4 h-4" />,
  "cost-split-calculator": <Scale className="w-4 h-4" />,
  "frequency-converter": <Activity className="w-4 h-4" />,
  "fuel-efficiency-converter": <Zap className="w-4 h-4" />,
  "number-to-words-converter": <FileText className="w-4 h-4" />,
  "words-to-number-converter": <Hash className="w-4 h-4" />,
  "base-converter": <Binary className="w-4 h-4" />,
  "binary-to-hex-converter": <Binary className="w-4 h-4" />,
  "hex-to-binary-converter": <Binary className="w-4 h-4" />,
  "octal-converter": <Binary className="w-4 h-4" />,
  "unit-price-converter": <DollarSign className="w-4 h-4" />,
  "density-converter": <FlaskConical className="w-4 h-4" />,
  "binary-to-decimal-converter": <Binary className="w-4 h-4" />,
  "decimal-to-binary-converter": <Binary className="w-4 h-4" />,
  "hex-to-decimal-converter": <Hash className="w-4 h-4" />,
  "days-between-dates-calculator": <CalendarDays className="w-4 h-4" />,
  "working-days-calculator": <CalendarDays className="w-4 h-4" />,
  "time-subtraction-calculator": <Timer className="w-4 h-4" />,
  "time-addition-calculator": <Timer className="w-4 h-4" />,
  "meeting-time-calculator": <Clock className="w-4 h-4" />,
  "shift-schedule-calculator": <Clock className="w-4 h-4" />,
  "deadline-calculator": <AlarmClock className="w-4 h-4" />,
  "study-time-calculator": <Timer className="w-4 h-4" />,
  "reading-time-calculator": <Timer className="w-4 h-4" />,
  "event-countdown-timer": <AlarmClock className="w-4 h-4" />,
  "hourly-time-calculator": <Clock className="w-4 h-4" />,
  "shift-hours-calculator": <Clock className="w-4 h-4" />,
  "time-tracking-calculator": <Timer className="w-4 h-4" />,
  "time-duration-calculator": <Timer className="w-4 h-4" />,
  "overtime-calculator": <Clock className="w-4 h-4" />,
  "stopwatch": <Timer className="w-4 h-4" />,
  "half-birthday-calculator": <CalendarDays className="w-4 h-4" />,
  "lean-body-mass-calculator": <BicepsFlexed className="w-4 h-4" />,
  "daily-calories-burn-calculator": <Activity className="w-4 h-4" />,
  "one-rep-max-calculator": <BicepsFlexed className="w-4 h-4" />,
  "body-type-calculator": <Activity className="w-4 h-4" />,
  "fitness-age-calculator": <Heart className="w-4 h-4" />,
  "walking-calories-calculator": <Activity className="w-4 h-4" />,
  "cycling-calories-calculator": <Activity className="w-4 h-4" />,
  "macro-nutrient-calculator": <Apple className="w-4 h-4" />,
  "fat-intake-calculator": <Apple className="w-4 h-4" />,
  "workout-duration-calculator": <Timer className="w-4 h-4" />,
  "step-counter-estimator": <Activity className="w-4 h-4" />,
  "pregnancy-due-date-calculator": <Heart className="w-4 h-4" />,
  "calorie-deficit-calculator": <Apple className="w-4 h-4" />,
  "cat-age-calculator": <Heart className="w-4 h-4" />,
  "dog-age-calculator": <Heart className="w-4 h-4" />,
  "concrete-volume-calculator": <Building2 className="w-4 h-4" />,
  "cement-calculator": <Building2 className="w-4 h-4" />,
  "steel-weight-calculator": <Scale className="w-4 h-4" />,
  "room-area-calculator": <Grid3x3 className="w-4 h-4" />,
  "roof-area-calculator": <Building2 className="w-4 h-4" />,
  "water-tank-calculator": <Droplets className="w-4 h-4" />,
  "asphalt-calculator": <Building2 className="w-4 h-4" />,
  "fence-length-calculator": <Ruler className="w-4 h-4" />,
  "wall-area-calculator": <Grid3x3 className="w-4 h-4" />,
  "pipe-volume-calculator": <FlaskConical className="w-4 h-4" />,
  "sand-calculator": <Grid3x3 className="w-4 h-4" />,
  "excavation-calculator": <Building2 className="w-4 h-4" />,
  "material-cost-calculator": <DollarSign className="w-4 h-4" />,
  "deck-area-calculator": <Grid3x3 className="w-4 h-4" />,
  "plaster-calculator": <PaintBucket className="w-4 h-4" />,
  "insulation-calculator": <Building2 className="w-4 h-4" />,
  "concrete-block-calculator": <Building2 className="w-4 h-4" />,
  "paver-calculator": <Grid3x3 className="w-4 h-4" />,
  "bitumen-calculator": <Building2 className="w-4 h-4" />,
  "pool-salt-calculator": <Droplets className="w-4 h-4" />,
  "random-name-generator": <Dices className="w-4 h-4" />,
  "password-strength-checker": <Lock className="w-4 h-4" />,
  "dice-roller": <Dices className="w-4 h-4" />,
  "coin-flip": <Dices className="w-4 h-4" />,
  "random-color-generator": <Palette className="w-4 h-4" />,
  "case-converter": <Type className="w-4 h-4" />,
  "alphabetical-sort": <ListOrdered className="w-4 h-4" />,
  "palindrome-checker": <Type className="w-4 h-4" />,
  "slug-generator": <Link2 className="w-4 h-4" />,
  "hashtag-generator": <Hash className="w-4 h-4" />,
  "random-letter-generator": <Dices className="w-4 h-4" />,
  "random-picker-tool": <Dices className="w-4 h-4" />,
  "spin-wheel-generator": <Dices className="w-4 h-4" />,
  "line-counter-tool": <ListOrdered className="w-4 h-4" />,
  "remove-extra-spaces-tool": <Type className="w-4 h-4" />,
  "sort-text-lines-tool": <ListOrdered className="w-4 h-4" />,
  "list-randomizer-tool": <Shuffle className="w-4 h-4" />,
  "text-formatter-tool": <Type className="w-4 h-4" />,
  "percentage-grade-calculator": <BookOpen className="w-4 h-4" />,
  "attendance-percentage-calculator": <BookOpen className="w-4 h-4" />,
  "reading-speed-calculator": <Timer className="w-4 h-4" />,
  "marks-percentage-calculator": <BookOpen className="w-4 h-4" />,
  "marks-to-gpa-converter": <BookOpen className="w-4 h-4" />,
  "class-average-calculator": <BarChart3 className="w-4 h-4" />,
  "score-calculator": <BookOpen className="w-4 h-4" />,
  "study-planner-calculator": <CalendarDays className="w-4 h-4" />,
  "homework-time-calculator": <Timer className="w-4 h-4" />,
  "exam-countdown-timer": <AlarmClock className="w-4 h-4" />,
  "assignment-grade-calculator": <BookOpen className="w-4 h-4" />,
  "semester-planner-tool": <CalendarDays className="w-4 h-4" />,
  "quiz-score-calculator": <BookOpen className="w-4 h-4" />,
  "flashcard-timer-tool": <Timer className="w-4 h-4" />,
  "exam-score-predictor": <TrendingUp className="w-4 h-4" />,
  "study-hours-tracker": <Clock className="w-4 h-4" />,
  "grade-improvement-calculator": <TrendingUp className="w-4 h-4" />,
  "test-score-analyzer": <BarChart3 className="w-4 h-4" />,
  "learning-time-calculator": <Timer className="w-4 h-4" />,
  "school-schedule-planner": <CalendarDays className="w-4 h-4" />,
  "revision-planner-tool": <CalendarDays className="w-4 h-4" />,
  "xp-level-calculator": <Trophy className="w-4 h-4" />,
  "clash-of-clans-upgrade-calculator": <Swords className="w-4 h-4" />,
  "damage-calculator": <Swords className="w-4 h-4" />,
  "game-currency-converter": <DollarSign className="w-4 h-4" />,
  // Batch 2 tools
  "matrix-calculator": <Grid3x3 className="w-4 h-4" />,
  "quadratic-equation-solver": <Calculator className="w-4 h-4" />,
  "permutation-calculator": <Shuffle className="w-4 h-4" />,
  "combination-calculator": <Shuffle className="w-4 h-4" />,
  "modulo-calculator": <Hash className="w-4 h-4" />,
  "proportion-calculator": <Scale className="w-4 h-4" />,
  "depreciation-calculator": <TrendingUp className="w-4 h-4 rotate-180" />,
  "net-worth-calculator": <DollarSign className="w-4 h-4" />,
  "retirement-calculator": <PiggyBank className="w-4 h-4" />,
  "car-loan-calculator": <Car className="w-4 h-4" />,
  "credit-card-payoff-calculator": <CreditCard className="w-4 h-4" />,
  "down-payment-calculator": <Landmark className="w-4 h-4" />,
  "amortization-calculator": <BarChart3 className="w-4 h-4" />,
  "stock-profit-calculator": <TrendingUp className="w-4 h-4" />,
  "dividend-calculator": <DollarSign className="w-4 h-4" />,
  "currency-exchange-calculator": <DollarSign className="w-4 h-4" />,
  "hourly-to-salary-calculator": <CreditCard className="w-4 h-4" />,
  "power-converter": <Plug className="w-4 h-4" />,
  "torque-converter": <Wrench className="w-4 h-4" />,
  "force-converter": <Activity className="w-4 h-4" />,
  "electric-current-converter": <Plug className="w-4 h-4" />,
  "shoe-size-converter": <Footprints className="w-4 h-4" />,
  "cooking-converter": <Apple className="w-4 h-4" />,
  "era-calculator": <CalendarDays className="w-4 h-4" />,
  "unix-timestamp-converter": <Timer className="w-4 h-4" />,
  "zodiac-sign-calculator": <Star className="w-4 h-4" />,
  "chinese-zodiac-calculator": <Star className="w-4 h-4" />,
  "age-in-days-calculator": <CalendarDays className="w-4 h-4" />,
  "retirement-age-calculator": <Clock className="w-4 h-4" />,
  "calorie-calculator": <Apple className="w-4 h-4" />,
  "bac-calculator": <Wine className="w-4 h-4" />,
  "waist-to-hip-ratio-calculator": <Activity className="w-4 h-4" />,
  "keto-calculator": <Apple className="w-4 h-4" />,
  "intermittent-fasting-calculator": <Timer className="w-4 h-4" />,
  "vo2-max-calculator": <Activity className="w-4 h-4" />,
  "rebar-calculator": <Building2 className="w-4 h-4" />,
  "drywall-calculator": <Building2 className="w-4 h-4" />,
  "wallpaper-calculator": <SquareStack className="w-4 h-4" />,
  "mulch-calculator": <Grid3x3 className="w-4 h-4" />,
  "soil-calculator": <Grid3x3 className="w-4 h-4" />,
  "solar-panel-calculator": <Sun className="w-4 h-4" />,
  "electrical-load-calculator": <Plug className="w-4 h-4" />,
  "lorem-ipsum-generator": <AlignLeft className="w-4 h-4" />,
  "qr-code-generator": <QrCode className="w-4 h-4" />,
  "uuid-generator": <Hash className="w-4 h-4" />,
  "json-formatter": <Code className="w-4 h-4" />,
  "base64-encoder-decoder": <Binary className="w-4 h-4" />,
  "url-encoder-decoder": <Link2 className="w-4 h-4" />,
  "color-picker": <Palette className="w-4 h-4" />,
  "emoji-picker": <Smile className="w-4 h-4" />,
  "markdown-previewer": <FileText className="w-4 h-4" />,
  "cgpa-calculator": <BookOpen className="w-4 h-4" />,
  "sat-score-calculator": <BookOpen className="w-4 h-4" />,
  "typing-speed-test": <Type className="w-4 h-4" />,
  "scholarship-calculator": <DollarSign className="w-4 h-4" />,
  "college-gpa-calculator": <BookOpen className="w-4 h-4" />,
  "genshin-impact-calculator": <Swords className="w-4 h-4" />,
  "cs2-sensitivity-calculator": <Swords className="w-4 h-4" />,
  "pokemon-iv-calculator": <Trophy className="w-4 h-4" />,
  "gaming-fps-calculator": <Gamepad2 className="w-4 h-4" />,
  "esports-earnings-calculator": <Trophy className="w-4 h-4" />,
  "fortnite-dpi-calculator": <Swords className="w-4 h-4" />,
  // Image Tools
  "image-resizer": <Maximize2 className="w-4 h-4" />,
  "image-compressor": <Minimize2 className="w-4 h-4" />,
  "image-cropper": <Crop className="w-4 h-4" />,
  "image-format-converter": <FileImage className="w-4 h-4" />,
  "image-to-base64": <Code className="w-4 h-4" />,
  "base64-to-image": <ImageIcon className="w-4 h-4" />,
  "image-rotate-flip": <RotateCw className="w-4 h-4" />,
  "image-color-picker": <Pipette className="w-4 h-4" />,
  "image-watermark": <Stamp className="w-4 h-4" />,
  "image-filter-editor": <Paintbrush className="w-4 h-4" />,
  "image-to-png": <FileImage className="w-4 h-4" />,
  "image-to-jpg": <FileImage className="w-4 h-4" />,
  "png-to-webp": <FileImage className="w-4 h-4" />,
  "svg-to-png": <FileImage className="w-4 h-4" />,
  "image-background-remover": <Sparkles className="w-4 h-4" />,
  "image-collage-maker": <Layers className="w-4 h-4" />,
  "qr-code-generator": <QrCode className="w-4 h-4" />,
  "meme-generator": <Smile className="w-4 h-4" />,
  "favicon-generator": <ImageIcon className="w-4 h-4" />,
  "image-pixel-counter": <ScanLine className="w-4 h-4" />,
  // PDF Tools
  "pdf-merge": <Layers className="w-4 h-4" />,
  "pdf-split": <Scissors className="w-4 h-4" />,
  "pdf-compress": <Minimize2 className="w-4 h-4" />,
  "image-to-pdf": <FileUp className="w-4 h-4" />,
  "pdf-to-image": <FileDown className="w-4 h-4" />,
  "pdf-rotate": <RotateCw className="w-4 h-4" />,
  "pdf-page-remover": <FileImage className="w-4 h-4" />,
  "pdf-page-reorder": <GripVertical className="w-4 h-4" />,
  "pdf-watermark": <Stamp className="w-4 h-4" />,
  "pdf-password-protect": <FileLock className="w-4 h-4" />,
  "pdf-unlock": <FileKey className="w-4 h-4" />,
  "pdf-to-text": <FileType className="w-4 h-4" />,
  "pdf-page-number": <Hash className="w-4 h-4" />,
  "pdf-header-footer": <FileImage className="w-4 h-4" />,
  "jpg-to-pdf": <FileUp className="w-4 h-4" />,
  "pdf-sign": <FileSignature className="w-4 h-4" />,
  // Developer Tools
  "json-formatter": <Braces className="w-4 h-4" />,
  "json-validator": <Braces className="w-4 h-4" />,
  "json-to-csv": <FileCode className="w-4 h-4" />,
  "csv-to-json": <FileCode className="w-4 h-4" />,
  "json-minifier": <Braces className="w-4 h-4" />,
  "html-formatter": <FileCode className="w-4 h-4" />,
  "html-minifier": <FileCode className="w-4 h-4" />,
  "css-minifier": <FileCode className="w-4 h-4" />,
  "css-formatter": <FileCode className="w-4 h-4" />,
  "javascript-minifier": <FileCode className="w-4 h-4" />,
  "javascript-formatter": <FileCode className="w-4 h-4" />,
  "regex-tester": <Bug className="w-4 h-4" />,
  "base64-encoder-decoder": <Binary className="w-4 h-4" />,
  "url-encoder-decoder": <Link2 className="w-4 h-4" />,
  "html-entity-encoder": <FileCode className="w-4 h-4" />,
  "jwt-decoder": <KeyRound className="w-4 h-4" />,
  "uuid-generator": <Hash className="w-4 h-4" />,
  "xml-formatter": <FileCode className="w-4 h-4" />,
  "sql-formatter": <TerminalSquare className="w-4 h-4" />,
  "markdown-previewer": <FileText className="w-4 h-4" />,
  "diff-checker": <FileCode className="w-4 h-4" />,
  "lorem-ipsum-generator": <AlignLeft className="w-4 h-4" />,
  "slug-generator": <Link2 className="w-4 h-4" />,
  "cron-expression-generator": <Timer className="w-4 h-4" />,
  "unix-timestamp-converter": <Clock className="w-4 h-4" />,
  "color-code-converter": <Palette className="w-4 h-4" />,
  "hash-generator": <Hash className="w-4 h-4" />,
  "html-to-markdown": <FileCode className="w-4 h-4" />,
  "markdown-to-html": <FileCode className="w-4 h-4" />,
  "json-to-xml": <FileCode className="w-4 h-4" />,
  "yaml-to-json": <FileCode className="w-4 h-4" />,
  "string-escape-unescape": <Code className="w-4 h-4" />,
  "json-path-tester": <Braces className="w-4 h-4" />,
  // CSS & Design Tools
  "css-gradient-generator": <PenTool className="w-4 h-4" />,
  "css-box-shadow-generator": <PenTool className="w-4 h-4" />,
  "css-text-shadow-generator": <PenTool className="w-4 h-4" />,
  "css-border-radius-generator": <PenTool className="w-4 h-4" />,
  "css-flexbox-generator": <Grid3x3 className="w-4 h-4" />,
  "css-grid-generator": <Grid3x3 className="w-4 h-4" />,
  "css-animation-generator": <RefreshCw className="w-4 h-4" />,
  "css-clip-path-generator": <PenTool className="w-4 h-4" />,
  "css-filter-generator": <Paintbrush className="w-4 h-4" />,
  "color-palette-generator": <Palette className="w-4 h-4" />,
  "color-contrast-checker": <Eye className="w-4 h-4" />,
  "color-picker": <Pipette className="w-4 h-4" />,
  "hex-to-rgb-converter": <Hexagon className="w-4 h-4" />,
  "rgb-to-hex-converter": <Hexagon className="w-4 h-4" />,
  "tailwind-color-generator": <Palette className="w-4 h-4" />,
  "glassmorphism-generator": <PenTool className="w-4 h-4" />,
  "neumorphism-generator": <PenTool className="w-4 h-4" />,
  "css-triangle-generator": <PenTool className="w-4 h-4" />,
  // SEO Tools
  "meta-tag-generator": <Tag className="w-4 h-4" />,
  "open-graph-generator": <Share2 className="w-4 h-4" />,
  "twitter-card-generator": <Share2 className="w-4 h-4" />,
  "robots-txt-generator": <FileText className="w-4 h-4" />,
  "sitemap-generator": <MapPin className="w-4 h-4" />,
  "keyword-density-checker": <SearchIcon className="w-4 h-4" />,
  "serp-preview-tool": <SearchIcon className="w-4 h-4" />,
  "schema-markup-generator": <Braces className="w-4 h-4" />,
  "canonical-tag-generator": <Tag className="w-4 h-4" />,
  "htaccess-redirect-generator": <FileCode className="w-4 h-4" />,
  "readability-checker": <Eye className="w-4 h-4" />,
  "word-frequency-counter": <BarChart3 className="w-4 h-4" />,
  "heading-tag-checker": <FileCode className="w-4 h-4" />,
  "favicon-checker": <ImageIcon className="w-4 h-4" />,
  // Security & Encryption
  "password-strength-checker": <ShieldAlert className="w-4 h-4" />,
  "md5-hash-generator": <Fingerprint className="w-4 h-4" />,
  "sha256-hash-generator": <Fingerprint className="w-4 h-4" />,
  "sha1-hash-generator": <Fingerprint className="w-4 h-4" />,
  "sha512-hash-generator": <Fingerprint className="w-4 h-4" />,
  "bcrypt-hash-generator": <Fingerprint className="w-4 h-4" />,
  "aes-encrypt-decrypt": <Lock className="w-4 h-4" />,
  "rsa-key-generator": <KeySquare className="w-4 h-4" />,
  "hmac-generator": <Fingerprint className="w-4 h-4" />,
  "random-string-generator": <Shuffle className="w-4 h-4" />,
  "encryption-decoder": <UnlockKeyhole className="w-4 h-4" />,
  "binary-to-text": <Binary className="w-4 h-4" />,
  "hex-to-text": <Hash className="w-4 h-4" />,
  "morse-code-translator": <ScanText className="w-4 h-4" />,
  // Social Media Tools
  "twitter-character-counter": <MessageCircle className="w-4 h-4" />,
  "instagram-caption-counter": <MessageCircle className="w-4 h-4" />,
  "hashtag-generator": <Hash className="w-4 h-4" />,
  "social-media-image-resizer": <ImageIcon className="w-4 h-4" />,
  "youtube-thumbnail-checker": <Film className="w-4 h-4" />,
  "emoji-picker": <Smile className="w-4 h-4" />,
  "text-to-emoji": <Smile className="w-4 h-4" />,
  "linkedin-post-formatter": <FileText className="w-4 h-4" />,
  "bio-generator": <AtSign className="w-4 h-4" />,
  "unicode-text-converter": <Type className="w-4 h-4" />,
  "tiktok-character-counter": <MessageCircle className="w-4 h-4" />,
  "social-post-scheduler-planner": <CalendarDays className="w-4 h-4" />,
};

// 18 unique color hues for card themes
const CARD_HUES = [
  217, 265, 152, 25, 340, 175, 45, 290, 120,
  355, 195, 310, 60, 230, 15, 165, 275, 85,
];

const CARD_BADGES = [
  "FREE", "\u26A1 POPULAR", "\u2713 VERIFIED", "FREE",
  "\uD83D\uDD25 HOT", "NEW", "PRO", "\u2605 4.9", "\uD83D\uDEE1 SECURE",
  "\u2728 TOP", "FAST", "\u2764 LOVED", "EASY", "\u26A1 QUICK",
  "TRUSTED", "\u2B50 5.0", "BEST", "SMART",
];

function splitToolTitle(title: string): [string, string] {
  const subtitleWords = ["Calculator", "Converter", "Generator", "Checker", "Planner", "Counter", "Timer", "Tool", "Tracker", "Analyzer", "Estimator", "Remover", "Roller"];
  const lastSpace = title.lastIndexOf(" ");
  if (lastSpace === -1) return [title, ""];
  const lastWord = title.slice(lastSpace + 1);
  if (subtitleWords.includes(lastWord)) return [title.slice(0, lastSpace), lastWord];
  return [title, ""];
}

function getIcon(slug: string) {
  return TOOL_ICON_MAP[slug] ?? <Wrench className="w-4 h-4" />;
}

function ToolCard({ tool, colorIndex }: { tool: Tool; colorIndex: number }) {
  const hue = CARD_HUES[colorIndex % CARD_HUES.length];
  const badge = CARD_BADGES[colorIndex % CARD_BADGES.length];
  const [mainTitle, subtitle] = splitToolTitle(tool.title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25 }}
      className="h-full"
    >
      <Link
        href={getToolPath(tool.slug)}
        className="tool-card-active group"
        style={{ "--card-hue": hue } as React.CSSProperties}
      >
        <div className="flex items-start gap-3.5 flex-1">
          <div className="tool-icon-circle">
            {getIcon(tool.slug)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-[15px] text-foreground leading-tight">{mainTitle}</p>
            {subtitle && <p className="text-sm font-semibold text-muted-foreground">{subtitle}</p>}
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{tool.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="tool-badge">{badge}</span>
          <span className="tool-open-btn">
            Open Tool <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CategoryPage() {
  const params = useParams<{ id: string }>();
  const catId = params.id;
  const category = TOOL_CATEGORIES.find(c => c.id === catId);

  if (!category) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-black uppercase text-foreground mb-4">Category Not Found</h1>
          <Link href="/" className="text-primary font-bold hover:underline">← Back to Home</Link>
        </div>
      </Layout>
    );
  }

  const colors = CATEGORY_COLORS[catId] ?? CATEGORY_COLORS["math"];
  const liveCount = category.tools.filter(t => t.implemented).length;
  const otherCategories = TOOL_CATEGORIES.filter(c => c.id !== catId);

  return (
    <Layout>
      <SEO
        title={`${category.name} — Free Online Tools`}
        description={`${category.description}. ${category.tools.length} free online ${category.name.toLowerCase()} tools. No signup required.`}
      />

      {/* ── HEADER BANNER ── */}
      <section className={`${colors.light} border-b-4 border-border`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm font-bold uppercase tracking-wider mb-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-primary" strokeWidth={3} />
            <span className="text-foreground">{category.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className={`w-20 h-20 rounded-2xl ${colors.bg} text-white flex items-center justify-center border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] flex-shrink-0`}>
              {CATEGORY_ICONS_LG[catId]}
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter uppercase leading-none mb-3">
                {category.name}
              </h1>
              <p className="text-lg text-muted-foreground font-medium max-w-2xl">{category.description}</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { label: "Total Tools", value: category.tools.length },
              { label: "Live Now", value: liveCount },
              { label: "Free to Use", value: "100%" },
              { label: "Signup Required", value: "None" },
            ].map(s => (
              <div key={s.label} className="bg-card border-2 border-border rounded-xl px-5 py-3 flex items-center gap-3">
                <span className={`text-2xl font-black ${colors.text}`}>{s.value}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOOLS GRID ── */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-3xl font-black uppercase tracking-tight text-foreground border-l-8 ${colors.border} pl-4`}>
              All {category.name}
            </h2>
            <span className="text-sm font-bold text-muted-foreground bg-card border-2 border-border px-3 py-1 rounded-full">
              {category.tools.length} tools
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.tools.map((tool, i) => (
              <ToolCard key={tool.slug} tool={tool} colorIndex={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── OTHER CATEGORIES ── */}
      <section className="py-16 bg-muted/30 border-t-4 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-foreground border-l-8 border-primary pl-4 mb-8">
            Browse Other Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {otherCategories.map(cat => {
              const c = CATEGORY_COLORS[cat.id] ?? CATEGORY_COLORS["math"];
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  className="group flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-[0_4px_16px_hsl(var(--foreground)/0.1)] transition-all duration-200"
                >
                  <div className={`w-10 h-10 rounded-lg ${c.bg}/10 ${c.text} flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors`}>
                    {CATEGORY_ICONS_LG[cat.id]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat.tools.length} tools</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
