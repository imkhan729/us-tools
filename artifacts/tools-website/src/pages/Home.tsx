import { SEO } from "@/components/SEO";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Search, ArrowRight, Zap, ShieldCheck, Smartphone, Ban,
  Calculator, KeyRound, Type, CalendarDays, Palette,
  DollarSign, Ruler, Clock, Heart, HardHat, BookOpen, Gamepad2,
  Star, Users, ChevronRight, Percent, TrendingUp, CreditCard,
  PiggyBank, ReceiptText, Landmark, BarChart3, Scale, Hash,
  Divide, Sigma, Infinity, FlaskConical, Dices, AlignLeft,
  FileText, Lock, Globe, Thermometer, Weight, Timer, AlarmClock,
  BicepsFlexed, Apple, Droplets, Activity, Building2, PaintBucket,
  Grid3x3, SquareStack, Swords, Trophy, Zap as ZapIcon, Shuffle,
  ListOrdered, Binary, Link2, QrCode, Image, Film,
  Car, Plug, Sun, Footprints, Wine, Smile, Code, Wrench,
  ImageIcon, FileImage, Crop, Paintbrush, Pipette, RotateCw,
  Layers, ScanLine, Sparkles, Download, FileUp, FileDown,
  FileLock, FileKey, FileSignature, FileType, Stamp, GripVertical,
  Scissors, Minimize2, Maximize2, MonitorPlay,
  Braces, FileCode, TerminalSquare, Bug, RefreshCw,
  PenTool, Hexagon, Eye, Share2, AtSign, MessageCircle,
  Search as SearchIcon, Tag, MapPin, Landmark as LandmarkIcon,
  ShieldAlert, KeySquare, Fingerprint, UnlockKeyhole, ScanText,
} from "lucide-react";
import { useState, useMemo } from "react";
import { TOOL_CATEGORIES, ALL_TOOLS, getToolPath, type Tool } from "@/data/tools";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "math": <Calculator className="w-7 h-7" />,
  "finance": <DollarSign className="w-7 h-7" />,
  "conversion": <Ruler className="w-7 h-7" />,
  "time-date": <Clock className="w-7 h-7" />,
  "health": <Heart className="w-7 h-7" />,
  "construction": <HardHat className="w-7 h-7" />,
  "productivity": <Type className="w-7 h-7" />,
  "education": <BookOpen className="w-7 h-7" />,
  "gaming": <Gamepad2 className="w-7 h-7" />,
  "image": <ImageIcon className="w-7 h-7" />,
  "pdf": <FileImage className="w-7 h-7" />,
  "developer": <Braces className="w-7 h-7" />,
  "css-design": <PenTool className="w-7 h-7" />,
  "seo": <SearchIcon className="w-7 h-7" />,
  "security": <ShieldAlert className="w-7 h-7" />,
  "social-media": <Share2 className="w-7 h-7" />,
};

const CATEGORY_ICON_SM: Record<string, React.ReactNode> = {
  "Math & Calculators": <Calculator className="w-4 h-4" />,
  "Finance & Cost": <DollarSign className="w-4 h-4" />,
  "Conversion Tools": <Ruler className="w-4 h-4" />,
  "Time & Date": <Clock className="w-4 h-4" />,
  "Health & Fitness": <Heart className="w-4 h-4" />,
  "Construction & DIY": <HardHat className="w-4 h-4" />,
  "Productivity & Text": <Type className="w-4 h-4" />,
  "Student & Education": <BookOpen className="w-4 h-4" />,
  "Gaming Calculators": <Gamepad2 className="w-4 h-4" />,
  "Image Tools": <ImageIcon className="w-4 h-4" />,
  "PDF Tools": <FileImage className="w-4 h-4" />,
  "Developer Tools": <Braces className="w-4 h-4" />,
  "CSS & Design Tools": <PenTool className="w-4 h-4" />,
  "SEO Tools": <SearchIcon className="w-4 h-4" />,
  "Security & Encryption": <ShieldAlert className="w-4 h-4" />,
  "Social Media Tools": <Share2 className="w-4 h-4" />,
};

const CATEGORY_ICON_BY_ID: Record<string, React.ReactNode> = {
  "math": <Calculator className="w-3.5 h-3.5" />,
  "finance": <DollarSign className="w-3.5 h-3.5" />,
  "conversion": <Ruler className="w-3.5 h-3.5" />,
  "time-date": <Clock className="w-3.5 h-3.5" />,
  "health": <Heart className="w-3.5 h-3.5" />,
  "construction": <HardHat className="w-3.5 h-3.5" />,
  "productivity": <Type className="w-3.5 h-3.5" />,
  "education": <BookOpen className="w-3.5 h-3.5" />,
  "gaming": <Gamepad2 className="w-3.5 h-3.5" />,
  "image": <ImageIcon className="w-3.5 h-3.5" />,
  "pdf": <FileImage className="w-3.5 h-3.5" />,
  "developer": <Braces className="w-3.5 h-3.5" />,
  "css-design": <PenTool className="w-3.5 h-3.5" />,
  "seo": <SearchIcon className="w-3.5 h-3.5" />,
  "security": <ShieldAlert className="w-3.5 h-3.5" />,
  "social-media": <Share2 className="w-3.5 h-3.5" />,
};

const TOOL_ICON_MAP: Record<string, React.ReactNode> = {
  "percentage-calculator": <Percent className="w-4 h-4" />,
  "percentage-increase-calculator": <TrendingUp className="w-4 h-4" />,
  "percentage-decrease-calculator": <TrendingUp className="w-4 h-4 rotate-180" />,
  "percentage-difference-calculator": <Divide className="w-4 h-4" />,
  "fraction-to-decimal-calculator": <Divide className="w-4 h-4" />,
  "decimal-to-fraction-calculator": <Divide className="w-4 h-4" />,
  "ratio-calculator": <Scale className="w-4 h-4" />,
  "average-calculator": <BarChart3 className="w-4 h-4" />,
  "scientific-calculator": <FlaskConical className="w-4 h-4" />,
  "standard-deviation-calculator": <Sigma className="w-4 h-4" />,
  "square-root-calculator": <Calculator className="w-4 h-4" />,
  "cube-root-calculator": <Calculator className="w-4 h-4" />,
  "power-calculator": <ZapIcon className="w-4 h-4" />,
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
  "markup-calculator": <TrendingUp className="w-4 h-4" />,
  "break-even-calculator": <BarChart3 className="w-4 h-4" />,
  "roi-calculator": <TrendingUp className="w-4 h-4" />,
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
  "length-converter": <Ruler className="w-4 h-4" />,
  "weight-converter": <Weight className="w-4 h-4" />,
  "temperature-converter": <Thermometer className="w-4 h-4" />,
  "speed-converter": <ZapIcon className="w-4 h-4" />,
  "area-converter": <Grid3x3 className="w-4 h-4" />,
  "volume-converter": <FlaskConical className="w-4 h-4" />,
  "time-converter": <Timer className="w-4 h-4" />,
  "data-storage-converter": <Binary className="w-4 h-4" />,
  "color-converter": <Palette className="w-4 h-4" />,
  "number-base-converter": <Binary className="w-4 h-4" />,
  "currency-converter": <DollarSign className="w-4 h-4" />,
  "energy-converter": <ZapIcon className="w-4 h-4" />,
  "pressure-converter": <Activity className="w-4 h-4" />,
  "angle-converter": <Scale className="w-4 h-4" />,
  "age-calculator": <CalendarDays className="w-4 h-4" />,
  "date-difference-calculator": <CalendarDays className="w-4 h-4" />,
  "time-zone-converter": <Globe className="w-4 h-4" />,
  "countdown-timer": <AlarmClock className="w-4 h-4" />,
  "unix-timestamp-converter": <Timer className="w-4 h-4" />,
  "days-until-calculator": <CalendarDays className="w-4 h-4" />,
  "work-hours-calculator": <Clock className="w-4 h-4" />,
  "time-addition-calculator": <Timer className="w-4 h-4" />,
  "day-of-week-calculator": <CalendarDays className="w-4 h-4" />,
  "leap-year-checker": <CalendarDays className="w-4 h-4" />,
  "week-number-calculator": <CalendarDays className="w-4 h-4" />,
  "business-days-calculator": <CalendarDays className="w-4 h-4" />,
  "bmi-calculator": <Activity className="w-4 h-4" />,
  "bmr-calculator": <Activity className="w-4 h-4" />,
  "tdee-calculator": <BicepsFlexed className="w-4 h-4" />,
  "calorie-intake-calculator": <Apple className="w-4 h-4" />,
  "water-intake-calculator": <Droplets className="w-4 h-4" />,
  "ideal-weight-calculator": <Scale className="w-4 h-4" />,
  "body-fat-calculator": <Activity className="w-4 h-4" />,
  "pregnancy-calculator": <Heart className="w-4 h-4" />,
  "ovulation-calculator": <CalendarDays className="w-4 h-4" />,
  "sleep-calculator": <AlarmClock className="w-4 h-4" />,
  "macro-calculator": <Apple className="w-4 h-4" />,
  "protein-intake-calculator": <Apple className="w-4 h-4" />,
  "heart-rate-calculator": <Heart className="w-4 h-4" />,
  "running-pace-calculator": <Timer className="w-4 h-4" />,
  "due-date-calculator": <CalendarDays className="w-4 h-4" />,
  "blood-type-calculator": <Activity className="w-4 h-4" />,
  "vo2-max-calculator": <Activity className="w-4 h-4" />,
  "concrete-calculator": <Building2 className="w-4 h-4" />,
  "paint-calculator": <PaintBucket className="w-4 h-4" />,
  "mulch-calculator": <Grid3x3 className="w-4 h-4" />,
  "gravel-calculator": <Grid3x3 className="w-4 h-4" />,
  "roofing-calculator": <Building2 className="w-4 h-4" />,
  "flooring-calculator": <Grid3x3 className="w-4 h-4" />,
  "tile-calculator": <Grid3x3 className="w-4 h-4" />,
  "fence-calculator": <Building2 className="w-4 h-4" />,
  "stair-calculator": <Building2 className="w-4 h-4" />,
  "drywall-calculator": <Building2 className="w-4 h-4" />,
  "lumber-calculator": <Ruler className="w-4 h-4" />,
  "wallpaper-calculator": <SquareStack className="w-4 h-4" />,
  "soil-calculator": <Grid3x3 className="w-4 h-4" />,
  "brick-calculator": <Building2 className="w-4 h-4" />,
  "word-counter": <FileText className="w-4 h-4" />,
  "character-counter": <AlignLeft className="w-4 h-4" />,
  "password-generator": <KeyRound className="w-4 h-4" />,
  "text-case-converter": <Type className="w-4 h-4" />,
  "lorem-ipsum-generator": <AlignLeft className="w-4 h-4" />,
  "url-encoder-decoder": <Link2 className="w-4 h-4" />,
  "base64-encoder-decoder": <Binary className="w-4 h-4" />,
  "json-formatter": <FileText className="w-4 h-4" />,
  "markdown-previewer": <FileText className="w-4 h-4" />,
  "text-reverser": <Shuffle className="w-4 h-4" />,
  "duplicate-line-remover": <AlignLeft className="w-4 h-4" />,
  "word-frequency-counter": <BarChart3 className="w-4 h-4" />,
  "text-to-slug-converter": <Link2 className="w-4 h-4" />,
  "uuid-generator": <Hash className="w-4 h-4" />,
  "qr-code-generator": <QrCode className="w-4 h-4" />,
  "username-generator": <KeyRound className="w-4 h-4" />,
  "gpa-calculator": <BookOpen className="w-4 h-4" />,
  "grade-calculator": <BookOpen className="w-4 h-4" />,
  "test-grade-calculator": <BookOpen className="w-4 h-4" />,
  "final-grade-calculator": <BookOpen className="w-4 h-4" />,
  "weighted-grade-calculator": <BookOpen className="w-4 h-4" />,
  "roman-numeral-converter": <Binary className="w-4 h-4" />,
  "binary-converter": <Binary className="w-4 h-4" />,
  "hex-calculator": <Hash className="w-4 h-4" />,
  "reading-time-calculator": <Timer className="w-4 h-4" />,
  "words-per-minute-calculator": <Timer className="w-4 h-4" />,
  "roblox-tax-calculator": <Gamepad2 className="w-4 h-4" />,
  "blox-fruits-calculator": <Swords className="w-4 h-4" />,
  "blox-fruits-trade-calculator": <Shuffle className="w-4 h-4" />,
  "minecraft-circle-calculator": <Grid3x3 className="w-4 h-4" />,
  "valorant-sensitivity-calculator": <Swords className="w-4 h-4" />,
  "fortnite-dpi-calculator": <Swords className="w-4 h-4" />,
  "elden-ring-calculator": <Swords className="w-4 h-4" />,
  "pokemon-damage-calculator": <Trophy className="w-4 h-4" />,
  "dnd-dice-roller": <Dices className="w-4 h-4" />,
  "esports-earnings-calculator": <Trophy className="w-4 h-4" />,
  // New math tools
  "rounding-numbers-calculator": <Calculator className="w-4 h-4" />,
  "exponents-calculator": <ZapIcon className="w-4 h-4" />,
  "variance-calculator": <BarChart3 className="w-4 h-4" />,
  "number-sequence-generator": <ListOrdered className="w-4 h-4" />,
  "divisibility-checker": <Hash className="w-4 h-4" />,
  // New finance tools
  "expense-calculator": <ReceiptText className="w-4 h-4" />,
  "cost-per-unit-calculator": <DollarSign className="w-4 h-4" />,
  "price-per-unit-calculator": <DollarSign className="w-4 h-4" />,
  "payback-period-calculator": <TrendingUp className="w-4 h-4" />,
  "loan-interest-calculator": <Landmark className="w-4 h-4" />,
  "savings-goal-calculator": <PiggyBank className="w-4 h-4" />,
  "revenue-calculator": <BarChart3 className="w-4 h-4" />,
  "cost-split-calculator": <Scale className="w-4 h-4" />,
  // New conversion tools
  "frequency-converter": <Activity className="w-4 h-4" />,
  "fuel-efficiency-converter": <ZapIcon className="w-4 h-4" />,
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
  // New time & date tools
  "days-between-dates-calculator": <CalendarDays className="w-4 h-4" />,
  "working-days-calculator": <CalendarDays className="w-4 h-4" />,
  "time-subtraction-calculator": <Timer className="w-4 h-4" />,
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
  // New health tools
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
  // New construction tools
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
  // New productivity tools
  "random-name-generator": <Dices className="w-4 h-4" />,
  "password-strength-checker": <Lock className="w-4 h-4" />,
  "dice-roller": <Dices className="w-4 h-4" />,
  "coin-flip": <Dices className="w-4 h-4" />,
  "random-color-generator": <Palette className="w-4 h-4" />,
  "case-converter": <Type className="w-4 h-4" />,
  "text-reverser": <Shuffle className="w-4 h-4" />,
  "alphabetical-sort": <ListOrdered className="w-4 h-4" />,
  "palindrome-checker": <Type className="w-4 h-4" />,
  "slug-generator": <Link2 className="w-4 h-4" />,
  "hashtag-generator": <Hash className="w-4 h-4" />,
  "random-letter-generator": <Dices className="w-4 h-4" />,
  "random-picker": <Dices className="w-4 h-4" />,
  "spin-wheel-generator": <Dices className="w-4 h-4" />,
  "character-counter": <AlignLeft className="w-4 h-4" />,
  "line-counter": <ListOrdered className="w-4 h-4" />,
  "remove-extra-spaces": <Type className="w-4 h-4" />,
  "sort-text-lines": <ListOrdered className="w-4 h-4" />,
  "list-randomizer": <Shuffle className="w-4 h-4" />,
  "text-formatter": <Type className="w-4 h-4" />,
  // New education tools
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
  "semester-planner": <CalendarDays className="w-4 h-4" />,
  "quiz-score-calculator": <BookOpen className="w-4 h-4" />,
  "flashcard-timer": <Timer className="w-4 h-4" />,
  "exam-score-predictor": <TrendingUp className="w-4 h-4" />,
  "study-hours-tracker": <Clock className="w-4 h-4" />,
  "grade-improvement-calculator": <TrendingUp className="w-4 h-4" />,
  "test-score-analyzer": <BarChart3 className="w-4 h-4" />,
  "learning-time-calculator": <Timer className="w-4 h-4" />,
  "school-schedule-planner": <CalendarDays className="w-4 h-4" />,
  "revision-planner": <CalendarDays className="w-4 h-4" />,
  // Gaming tools
  "xp-level-calculator": <Trophy className="w-4 h-4" />,
  "clash-of-clans-upgrade-calculator": <Swords className="w-4 h-4" />,
  "damage-calculator": <Swords className="w-4 h-4" />,
  "game-currency-converter": <DollarSign className="w-4 h-4" />,
  // New math tools (batch 2)
  "matrix-calculator": <Grid3x3 className="w-4 h-4" />,
  "quadratic-equation-solver": <Calculator className="w-4 h-4" />,
  "permutation-calculator": <Shuffle className="w-4 h-4" />,
  "combination-calculator": <Shuffle className="w-4 h-4" />,
  "modulo-calculator": <Hash className="w-4 h-4" />,
  "proportion-calculator": <Scale className="w-4 h-4" />,
  // New finance tools (batch 2)
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
  // New conversion tools (batch 2)
  "power-converter": <Plug className="w-4 h-4" />,
  "torque-converter": <Wrench className="w-4 h-4" />,
  "force-converter": <Activity className="w-4 h-4" />,
  "electric-current-converter": <Plug className="w-4 h-4" />,
  "shoe-size-converter": <Footprints className="w-4 h-4" />,
  "cooking-converter": <Apple className="w-4 h-4" />,
  // New time tools (batch 2)
  "era-calculator": <CalendarDays className="w-4 h-4" />,
  "unix-timestamp-converter": <Timer className="w-4 h-4" />,
  "zodiac-sign-calculator": <Star className="w-4 h-4" />,
  "chinese-zodiac-calculator": <Star className="w-4 h-4" />,
  "age-in-days-calculator": <CalendarDays className="w-4 h-4" />,
  "retirement-age-calculator": <Clock className="w-4 h-4" />,
  // New health tools (batch 2)
  "calorie-calculator": <Apple className="w-4 h-4" />,
  "bac-calculator": <Wine className="w-4 h-4" />,
  "waist-to-hip-ratio-calculator": <Activity className="w-4 h-4" />,
  "keto-calculator": <Apple className="w-4 h-4" />,
  "intermittent-fasting-calculator": <Timer className="w-4 h-4" />,
  "vo2-max-calculator": <Activity className="w-4 h-4" />,
  // New construction tools (batch 2)
  "rebar-calculator": <Building2 className="w-4 h-4" />,
  "drywall-calculator": <Building2 className="w-4 h-4" />,
  "wallpaper-calculator": <SquareStack className="w-4 h-4" />,
  "mulch-calculator": <Grid3x3 className="w-4 h-4" />,
  "soil-calculator": <Grid3x3 className="w-4 h-4" />,
  "solar-panel-calculator": <Sun className="w-4 h-4" />,
  "electrical-load-calculator": <Plug className="w-4 h-4" />,
  // New productivity tools (batch 2)
  "lorem-ipsum-generator": <AlignLeft className="w-4 h-4" />,
  "qr-code-generator": <QrCode className="w-4 h-4" />,
  "uuid-generator": <Hash className="w-4 h-4" />,
  "json-formatter": <Code className="w-4 h-4" />,
  "base64-encoder-decoder": <Binary className="w-4 h-4" />,
  "url-encoder-decoder": <Link2 className="w-4 h-4" />,
  "color-picker": <Palette className="w-4 h-4" />,
  "emoji-picker": <Smile className="w-4 h-4" />,
  "markdown-previewer": <FileText className="w-4 h-4" />,
  // New education tools (batch 2)
  "cgpa-calculator": <BookOpen className="w-4 h-4" />,
  "sat-score-calculator": <BookOpen className="w-4 h-4" />,
  "typing-speed-test": <Type className="w-4 h-4" />,
  "scholarship-calculator": <DollarSign className="w-4 h-4" />,
  "college-gpa-calculator": <BookOpen className="w-4 h-4" />,
  // New gaming tools (batch 2)
  "genshin-impact-calculator": <Swords className="w-4 h-4" />,
  "cs2-sensitivity-calculator": <Swords className="w-4 h-4" />,
  "pokemon-iv-calculator": <Trophy className="w-4 h-4" />,
  "dnd-dice-roller": <Dices className="w-4 h-4" />,
  "gaming-fps-calculator": <Gamepad2 className="w-4 h-4" />,
  "esports-earnings-calculator": <Trophy className="w-4 h-4" />,
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

const HERO_TILES = [
  { label: "CALCULATORS", hue: 217, icon: <Calculator className="w-8 h-8" /> },
  { label: "CONVERTERS", hue: 152, icon: <Ruler className="w-8 h-8" /> },
  { label: "FINANCE", hue: 25, icon: <DollarSign className="w-8 h-8" /> },
  { label: "HEALTH", hue: 340, icon: <Heart className="w-8 h-8" /> },
  { label: "PASSWORDS", hue: 265, icon: <KeyRound className="w-8 h-8" /> },
  { label: "TEXT TOOLS", hue: 175, icon: <Type className="w-8 h-8" /> },
];

const CATEGORY_COLORS: Record<string, string> = {
  "math": "bg-blue-500 text-white",
  "finance": "bg-emerald-500 text-white",
  "conversion": "bg-purple-500 text-white",
  "time-date": "bg-orange-500 text-white",
  "health": "bg-red-500 text-white",
  "construction": "bg-yellow-500 text-foreground",
  "productivity": "bg-teal-500 text-white",
  "education": "bg-indigo-500 text-white",
  "gaming": "bg-pink-500 text-white",
  "image": "bg-cyan-500 text-white",
  "pdf": "bg-rose-500 text-white",
  "developer": "bg-slate-500 text-white",
  "css-design": "bg-fuchsia-500 text-white",
  "seo": "bg-lime-500 text-foreground",
  "security": "bg-amber-500 text-foreground",
  "social-media": "bg-violet-500 text-white",
};

const CATEGORY_BG: Record<string, string> = {
  "math": "border-blue-500",
  "finance": "border-emerald-500",
  "conversion": "border-purple-500",
  "time-date": "border-orange-500",
  "health": "border-red-500",
  "construction": "border-yellow-500",
  "productivity": "border-teal-500",
  "education": "border-indigo-500",
  "gaming": "border-pink-500",
  "image": "border-cyan-500",
  "pdf": "border-rose-500",
  "developer": "border-slate-500",
  "css-design": "border-fuchsia-500",
  "seo": "border-lime-500",
  "security": "border-amber-500",
  "social-media": "border-violet-500",
};

// 18 unique color hues for card themes
const CARD_HUES = [
  217,  // blue
  265,  // purple
  152,  // emerald
  25,   // orange
  340,  // rose
  175,  // teal
  45,   // amber
  290,  // violet
  120,  // green
  355,  // red
  195,  // cyan
  310,  // fuchsia
  60,   // yellow-green
  230,  // royal blue
  15,   // vermillion
  165,  // mint
  275,  // lavender
  85,   // lime
];

// Badge labels (cycle through)
const CARD_BADGES = [
  "FREE", "\u26A1 POPULAR", "\u2713 VERIFIED", "FREE",
  "\uD83D\uDD25 HOT", "NEW", "PRO", "\u2605 4.9", "\uD83D\uDEE1 SECURE",
  "\u2728 TOP", "FAST", "\u2764 LOVED", "EASY", "\u26A1 QUICK",
  "TRUSTED", "\u2B50 5.0", "BEST", "SMART",
];

// Extract subtitle from title (e.g., "Simple Interest Calculator" → ["Simple Interest", "Calculator"])
function splitToolTitle(title: string): [string, string] {
  const subtitleWords = ["Calculator", "Converter", "Generator", "Checker", "Planner", "Counter", "Timer", "Tool", "Tracker", "Analyzer", "Estimator", "Remover", "Roller"];
  const lastSpace = title.lastIndexOf(" ");
  if (lastSpace === -1) return [title, ""];
  const lastWord = title.slice(lastSpace + 1);
  if (subtitleWords.includes(lastWord)) return [title.slice(0, lastSpace), lastWord];
  return [title, ""];
}

function ToolCard({ tool, colorIndex }: { tool: Tool; colorIndex: number }) {
  const hue = CARD_HUES[colorIndex % CARD_HUES.length];
  const badge = CARD_BADGES[colorIndex % CARD_BADGES.length];
  const icon = TOOL_ICON_MAP[tool.slug] ?? CATEGORY_ICON_SM[tool.category] ?? <Calculator className="w-5 h-5" />;
  const [mainTitle, subtitle] = splitToolTitle(tool.title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link
        href={getToolPath(tool.slug)}
        className="tool-card-active group"
        style={{ "--card-hue": hue } as React.CSSProperties}
      >
        <div className="flex items-start gap-3.5 flex-1">
          <div className="tool-icon-circle">
            {icon}
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


export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTools = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q && activeCategory === "all") return null;
    return ALL_TOOLS.filter(t => {
      const matchesSearch = !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      const matchesCat = activeCategory === "all" || TOOL_CATEGORIES.find(c => c.id === activeCategory)?.name === t.category;
      return matchesSearch && matchesCat;
    });
  }, [search, activeCategory]);

  const totalTools = ALL_TOOLS.length;
  const liveTools = ALL_TOOLS.filter(t => t.implemented).length;

  return (
    <Layout>
      <SEO
        title="Free Online Tools - US Online Tools"
        description={`${totalTools}+ free online tools including calculators, converters, generators, and utilities. No signup required. 100% free at usonlinetools.com.`}
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b-4 border-foreground">
        <div className="absolute inset-0 hero-gradient opacity-60 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-10 md:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border-2 border-primary font-bold uppercase text-sm px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4" /> {totalTools}+ Free Tools — No Signup
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter leading-[0.9] uppercase mb-4">
              YOUR #1 SOURCE FOR{" "}
              <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rotate-[-1deg] mt-1">FREE</span>{" "}
              ONLINE TOOLS
            </h1>
            <p className="text-lg text-muted-foreground font-medium mb-6 max-w-lg">
              Stop bookmarking dozens of sites. US Online Tools brings every calculator, converter, and generator you need — all in one place, always free.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#all-tools" className="px-6 py-3 bg-primary text-primary-foreground font-black uppercase tracking-wider rounded-xl border-2 border-foreground hard-shadow hover:-translate-y-1 transition-transform">
                Explore Tools
              </a>
              <a href="#categories" className="px-6 py-3 bg-background text-foreground font-black uppercase tracking-wider rounded-xl border-2 border-foreground hard-shadow hover:-translate-y-1 transition-transform">
                Browse Categories
              </a>
            </div>
          </div>
          {/* Right — 3D shiny tile grid */}
          <div className="hidden lg:grid grid-cols-3 gap-4">
            {HERO_TILES.map((tile, i) => (
              <motion.div
                key={tile.label}
                initial={{ opacity: 0, y: 24, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -6, scale: 1.05, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.97 }}
                transition={{ delay: i * 0.08, duration: 0.5, type: "spring", stiffness: 200 }}
                className="hero-tile cursor-pointer"
                style={{ "--tile-hue": tile.hue } as React.CSSProperties}
              >
                <div className="hero-tile-icon">
                  {tile.icon}
                </div>
                <span className="mt-2.5 font-extrabold uppercase tracking-wider text-[11px] text-center leading-tight">{tile.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-foreground text-background py-8 border-b-4 border-primary">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 divide-x divide-background/20">
          {[
            { number: `${totalTools}+`, label: "Tools Available" },
            { number: "0", label: "Data Collected" },
            { number: "100%", label: "Free Forever" },
            { number: `${liveTools}`, label: "Live Tools" },
          ].map(({ number, label }) => (
            <div key={label} className="px-6 py-2 text-center">
              <div className="text-4xl font-black text-primary">{number}</div>
              <div className="text-sm font-bold uppercase tracking-wider text-background/70 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEARCH + FILTERS ── */}
      <section id="all-tools" className="relative py-16 bg-background overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Search heading with animated accent */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            >
              <Search className="w-3.5 h-3.5" />
              Instant Search
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
              Find the <span className="text-primary">Perfect Tool</span>
            </h2>
            <p className="text-muted-foreground font-medium mt-3 text-lg">{totalTools}+ free tools at your fingertips</p>
          </div>

          {/* Search bar — elevated glass card */}
          <div className="relative max-w-3xl mx-auto mb-10">
            <div className="search-bar-container">
              <div className="flex items-center justify-center w-14 h-14 flex-shrink-0">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <input
                type="search"
                placeholder={`Search ${totalTools}+ tools — try 'JSON', 'PDF', 'gradient'...`}
                className="flex-1 bg-transparent py-4 pr-4 text-foreground placeholder:text-muted-foreground font-medium focus:outline-none text-base"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mr-3 w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all text-lg font-black flex-shrink-0"
                >
                  ×
                </button>
              )}
              <div className="hidden md:flex items-center gap-1 mr-4 text-[11px] text-muted-foreground font-bold border border-border rounded-lg px-2 py-1 flex-shrink-0 bg-muted/50">
                <span>⌘</span><span>K</span>
              </div>
            </div>

            {/* Animated bottom glow when typing */}
            {search && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0.8 }}
                animate={{ opacity: 1, scaleX: 1 }}
                className="absolute inset-x-8 -bottom-3 h-6 bg-primary/15 blur-xl rounded-full pointer-events-none"
              />
            )}
          </div>

          {/* Category cards — scrollable row with 3D pill style */}
          <div className="category-filter-scroll mb-12">
            <div className="flex gap-2 pb-2 justify-center flex-wrap">
              <button
                onClick={() => { setActiveCategory("all"); setSearch(""); }}
                className={`category-pill ${activeCategory === "all" ? "category-pill-active" : ""}`}
              >
                <Zap className="w-3.5 h-3.5" />
                All Tools
                <span className="category-pill-count">{totalTools}</span>
              </button>
              {TOOL_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSearch(""); }}
                  className={`category-pill ${activeCategory === cat.id ? "category-pill-active" : ""}`}
                >
                  {CATEGORY_ICON_BY_ID[cat.id]}
                  {cat.name}
                  <span className="category-pill-count">{cat.tools.length}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {filteredTools !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-border" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex-shrink-0">
                  {filteredTools.length} result{filteredTools.length !== 1 ? "s" : ""} found
                </p>
                <div className="h-px flex-1 bg-border" />
              </div>
              {filteredTools.length === 0 ? (
                <div className="text-center py-20 glass-card rounded-2xl">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Search className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-black text-foreground">No tools found</h3>
                  <p className="text-muted-foreground mt-2">Try a different search term or browse categories above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTools.map((tool, i) => <ToolCard key={tool.slug} tool={tool} colorIndex={i} />)}
                </div>
              )}
            </motion.div>
          )}

          {/* All categories (default) */}
          {filteredTools === null && (
            <div className="space-y-16">
              {TOOL_CATEGORIES.map(cat => (
                  <div key={cat.id} id={cat.id}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${CATEGORY_COLORS[cat.id]} flex items-center justify-center border-2 border-foreground`}>
                          {CATEGORY_ICONS[cat.id]}
                        </div>
                        <div>
                          <h2 className={`text-2xl font-black uppercase tracking-tight text-foreground border-l-4 ${CATEGORY_BG[cat.id]} pl-3`}>
                            {cat.name}
                          </h2>
                          <p className="text-sm text-muted-foreground font-medium">{cat.tools.length} Powerful Tools</p>
                        </div>
                      </div>
                      <Link
                        href={`/category/${cat.id}`}
                        className="hidden sm:flex items-center gap-2 text-sm font-bold text-primary hover:underline uppercase tracking-wider"
                      >
                        VIEW ALL <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cat.tools.map((tool, i) => <ToolCard key={tool.slug} tool={tool} colorIndex={i} />)}
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-6 py-3 text-sm text-muted-foreground font-medium">
                      <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Free Tools</span>
                      <span className="inline-flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Instant Results</span>
                      <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-blue-500" /> No Signup Required</span>
                      <span className="inline-flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-purple-500" /> Mobile Friendly</span>
                    </div>
                  </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CATEGORIES SHOWCASE ── */}
      <section id="categories" className="py-20 bg-muted/30 border-t-4 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-foreground border-l-8 border-primary pl-4">
              Browse by Category
            </h2>
            <p className="text-muted-foreground font-medium mt-2 ml-5">
              {TOOL_CATEGORIES.length} categories · {totalTools}+ tools total
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOOL_CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); document.getElementById("all-tools")?.scrollIntoView({ behavior: "smooth" }); }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group text-left bg-card border-2 border-border hover:border-primary rounded-xl p-6 hard-shadow hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl ${CATEGORY_COLORS[cat.id]} flex items-center justify-center border-2 border-foreground mb-4`}>
                  {CATEGORY_ICONS[cat.id]}
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-1 group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-muted-foreground font-medium mb-3">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {cat.tools.length} tools
                  </span>
                  <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 bg-background border-t-4 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-foreground">
              Why Choose US Online Tools?
            </h2>
            <p className="text-muted-foreground font-medium mt-3 max-w-2xl mx-auto">
              Built for simplicity, speed, and privacy. Everything you need, nothing you don't.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Zap className="w-7 h-7" />, color: "bg-[#FFD23F] text-foreground", title: "100% Free Forever", desc: "No paywalls, no subscriptions, no credit cards. Every tool is free." },
              { icon: <Users className="w-7 h-7" />, color: "bg-[#FF6B35] text-white", title: "No Registration", desc: "Start using any tool instantly. We never ask for your email or personal info." },
              { icon: <ShieldCheck className="w-7 h-7" />, color: "bg-[#00D4AA] text-white", title: "Privacy First", desc: "All tools run in your browser. Your data never leaves your device." },
              { icon: <Smartphone className="w-7 h-7" />, color: "bg-indigo-500 text-white", title: "Mobile Friendly", desc: "Fully responsive. Works perfectly on any phone, tablet, or desktop." },
              { icon: <Ban className="w-7 h-7" />, color: "bg-red-500 text-white", title: "No Annoying Ads", desc: "Clean, distraction-free experience. No pop-ups or interruptions." },
              { icon: <Star className="w-7 h-7" />, color: "bg-pink-500 text-white", title: "Always Growing", desc: "New tools added regularly. Bookmark usonlinetools.com and check back often." },
            ].map(({ icon, color, title, desc }) => (
              <div key={title} className="bg-card border-2 border-border rounded-xl p-6 hover:border-primary transition-colors hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center border-2 border-foreground mb-4`}>
                  {icon}
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground font-medium text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-primary text-center mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { n: "01", title: "Find Your Tool", desc: "Search or browse by category to find the tool you need from our library of 120+ utilities." },
              { n: "02", title: "Enter Your Data", desc: "Type in your values — no forms, no sign-ups, no loading screens. Just instant results." },
              { n: "03", title: "Get Results", desc: "See your answer instantly. Copy, share, or bookmark the result with a single click." },
            ].map(({ n, title, desc }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-8xl font-black text-primary leading-none mb-4">{n}</div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-background mb-3">{title}</h3>
                <p className="text-background/70 font-medium">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO CONTENT ── */}
      <section className="py-16 bg-background border-t-4 border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-8 border-primary pl-6 bg-card border-2 border-border rounded-r-xl p-8">
            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-4">
              About US Online Tools
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed mb-4">
              <strong className="text-foreground">US Online Tools</strong> (usonlinetools.com) is your go-to source for free, fast, and private online utilities. Whether you need a{" "}
              <Link href="/tools/percentage-calculator" className="text-primary font-bold hover:underline">Percentage Calculator</Link>,{" "}
              <Link href="/tools/password-generator" className="text-primary font-bold hover:underline">Password Generator</Link>,{" "}
              <Link href="/tools/bmi-calculator" className="text-primary font-bold hover:underline">BMI Calculator</Link>,{" "}
              <Link href="/tools/loan-emi-calculator" className="text-primary font-bold hover:underline">Loan EMI Calculator</Link>,{" "}
              <Link href="/tools/color-converter" className="text-primary font-bold hover:underline">Color Converter</Link>, or a{" "}
              <Link href="/tools/gpa-calculator" className="text-primary font-bold hover:underline">GPA Calculator</Link>{" "}
              — we have everything covered across {TOOL_CATEGORIES.length} categories.
            </p>
            <p className="text-muted-foreground font-medium leading-relaxed">
              All tools run entirely in your browser with no data collection, no registration, and no hidden fees. From finance calculators like the{" "}
              <Link href="/tools/compound-interest-calculator" className="text-primary font-bold hover:underline">Compound Interest Calculator</Link> to gaming tools like the{" "}
              <Link href="/tools/roblox-tax-calculator" className="text-primary font-bold hover:underline">Roblox Tax Calculator</Link>,{" "}
              usonlinetools.com is built for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-primary border-t-4 border-foreground py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-primary-foreground mb-4">
            Bookmark usonlinetools.com
          </h2>
          <p className="text-primary-foreground/80 font-medium text-xl mb-8">
            Never struggle with online tasks again. {totalTools}+ tools, all free, all instant.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#all-tools" className="px-8 py-4 bg-background text-foreground font-black uppercase tracking-wider rounded-xl border-2 border-foreground hard-shadow hover:-translate-y-1 transition-transform">
              Explore All Tools
            </a>
            <button
              onClick={() => navigator.clipboard.writeText("https://usonlinetools.com")}
              className="px-8 py-4 bg-primary-foreground/10 text-primary-foreground font-black uppercase tracking-wider rounded-xl border-2 border-primary-foreground hover:-translate-y-1 transition-transform"
            >
              Copy Site URL
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
