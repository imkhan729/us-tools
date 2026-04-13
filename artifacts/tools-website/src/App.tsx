import { Switch, Route, Router as WouterRouter, useLocation, useParams } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./components/ThemeProvider";
import { SEO } from "./components/SEO";
import { lazy, Suspense, useEffect } from "react";
import { getCanonicalToolPath, getToolBySlug } from "./data/tools";

// Core Pages
import About from "./pages/About";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/not-found";

// Fully implemented tools
import PercentageCalculator from "./pages/PercentageCalculator";
import PasswordGenerator from "./pages/PasswordGenerator";
import WordCounter from "./pages/WordCounter";
import AgeCalculator from "./pages/AgeCalculator";
import ColorConverter from "./pages/ColorConverter";
import BmiCalculator from "./pages/BmiCalculator";
import DiscountCalculator from "./pages/DiscountCalculator";
import RandomNumberGenerator from "./pages/RandomNumberGenerator";
import TemperatureConverter from "./pages/TemperatureConverter";

// New tool pages
const CompoundInterestCalculator = lazy(() => import("./pages/tools/CompoundInterestCalculator"));
const LoanEmiCalculator = lazy(() => import("./pages/tools/LoanEmiCalculator"));
const SimpleInterestCalculator = lazy(() => import("./pages/tools/SimpleInterestCalculator"));
const JsonFormatter = lazy(() => import("./pages/tools/JsonFormatter"));
const Base64EncoderDecoder = lazy(() => import("./pages/tools/Base64EncoderDecoder"));
const ColorCodeConverter = lazy(() => import("./pages/tools/ColorCodeConverter"));
const CronExpressionGenerator = lazy(() => import("./pages/tools/CronExpressionGenerator"));
const CssFormatter = lazy(() => import("./pages/tools/CssFormatter"));
const CssMinifier = lazy(() => import("./pages/tools/CssMinifier"));
const HashGenerator = lazy(() => import("./pages/tools/HashGenerator"));
const HtmlEntityEncoder = lazy(() => import("./pages/tools/HtmlEntityEncoder"));
const HtmlFormatter = lazy(() => import("./pages/tools/HtmlFormatter"));
const HtmlMinifier = lazy(() => import("./pages/tools/HtmlMinifier"));
const HtmlToMarkdownConverter = lazy(() => import("./pages/tools/HtmlToMarkdownConverter"));
const JavaScriptFormatter = lazy(() => import("./pages/tools/JavaScriptFormatter"));
const JavaScriptMinifier = lazy(() => import("./pages/tools/JavaScriptMinifier"));
const MarkdownToHtmlConverter = lazy(() => import("./pages/tools/MarkdownToHtmlConverter"));
const JwtDecoder = lazy(() => import("./pages/tools/JwtDecoder"));
const JsonMinifier = lazy(() => import("./pages/tools/JsonMinifier"));
const JsonPathTester = lazy(() => import("./pages/tools/JsonPathTester"));
const JsonValidator = lazy(() => import("./pages/tools/JsonValidator"));
const RegexTester = lazy(() => import("./pages/tools/RegexTester"));
const SqlFormatter = lazy(() => import("./pages/tools/SqlFormatter"));
const StringEscapeUnescape = lazy(() => import("./pages/tools/StringEscapeUnescape"));
const TextDiffChecker = lazy(() => import("./pages/tools/TextDiffChecker"));
const JsonToCsvConverter = lazy(() => import("./pages/tools/JsonToCsvConverter"));
const JsonToXmlConverter = lazy(() => import("./pages/tools/JsonToXmlConverter"));
const XmlFormatter = lazy(() => import("./pages/tools/XmlFormatter"));
const YamlToJsonConverter = lazy(() => import("./pages/tools/YamlToJsonConverter"));
const DndDiceRoller = lazy(() => import("./pages/tools/DndDiceRoller"));
const BloxFruitsCalculator = lazy(() => import("./pages/tools/BloxFruitsCalculator"));
const BloxFruitsTradeCalculator = lazy(() => import("./pages/tools/BloxFruitsTradeCalculator"));
const Cs2SensitivityCalculator = lazy(() => import("./pages/tools/Cs2SensitivityCalculator"));
const ValorantSensitivityCalculator = lazy(() => import("./pages/tools/ValorantSensitivityCalculator"));
const FortniteDpiCalculator = lazy(() => import("./pages/tools/FortniteDpiCalculator"));
const RobloxTaxCalculator = lazy(() => import("./pages/tools/RobloxTaxCalculator"));
const MinecraftCircleCalculator = lazy(() => import("./pages/tools/MinecraftCircleCalculator"));
const XpLevelCalculator = lazy(() => import("./pages/tools/XpLevelCalculator"));
const GameCurrencyConverter = lazy(() => import("./pages/tools/GameCurrencyConverter"));
const EsportsEarningsCalculator = lazy(() => import("./pages/tools/EsportsEarningsCalculator"));
const GamingFpsCalculator = lazy(() => import("./pages/tools/GamingFpsCalculator"));
const DamageCalculator = lazy(() => import("./pages/tools/DamageCalculator"));
const ClashOfClansUpgradeCalculator = lazy(() => import("./pages/tools/ClashOfClansUpgradeCalculator"));
const GenshinImpactCalculator = lazy(() => import("./pages/tools/GenshinImpactCalculator"));
const PokemonIvCalculator = lazy(() => import("./pages/tools/PokemonIvCalculator"));
const CaesarCipherTool = lazy(() => import("./pages/tools/CaesarCipherTool"));
const MorseCodeTranslator = lazy(() => import("./pages/tools/MorseCodeTranslator"));
const RandomStringGenerator = lazy(() => import("./pages/tools/RandomStringGenerator"));
const LoremIpsumGenerator = lazy(() => import("./pages/tools/LoremIpsumGenerator"));
const MetaTagGenerator = lazy(() => import("./pages/tools/MetaTagGenerator"));
const HtaccessRedirectGenerator = lazy(() => import("./pages/tools/HtaccessRedirectGenerator"));
const FaviconCodeGenerator = lazy(() => import("./pages/tools/FaviconCodeGenerator"));
const GoogleSerpPreview = lazy(() => import("./pages/tools/GoogleSerpPreview"));
const OpenGraphGenerator = lazy(() => import("./pages/tools/OpenGraphGenerator"));
const TwitterCardGenerator = lazy(() => import("./pages/tools/TwitterCardGenerator"));
const SchemaMarkupGenerator = lazy(() => import("./pages/tools/SchemaMarkupGenerator"));
const CanonicalTagGenerator = lazy(() => import("./pages/tools/CanonicalTagGenerator"));
const HmacGenerator = lazy(() => import("./pages/tools/HmacGenerator"));
const BcryptHashGenerator = lazy(() => import("./pages/tools/BcryptHashGenerator"));
const AesEncryptDecrypt = lazy(() => import("./pages/tools/AesEncryptDecrypt"));
const RsaKeyGenerator = lazy(() => import("./pages/tools/RsaKeyGenerator"));
const HexToTextConverter = lazy(() => import("./pages/tools/HexToTextConverter"));
const InstagramCaptionCounter = lazy(() => import("./pages/tools/InstagramCaptionCounter"));
const TikTokCaptionCounter = lazy(() => import("./pages/tools/TikTokCaptionCounter"));
const LinkedinPostFormatter = lazy(() => import("./pages/tools/LinkedinPostFormatter"));
const SocialMediaBioGenerator = lazy(() => import("./pages/tools/SocialMediaBioGenerator"));
const SocialMediaImageResizer = lazy(() => import("./pages/tools/SocialMediaImageResizer"));
const SocialPostPlanner = lazy(() => import("./pages/tools/SocialPostPlanner"));
const TextToEmojiConverter = lazy(() => import("./pages/tools/TextToEmojiConverter"));
const UnicodeTextConverter = lazy(() => import("./pages/tools/UnicodeTextConverter"));
const YouTubeThumbnailChecker = lazy(() => import("./pages/tools/YouTubeThumbnailChecker"));
const RobotsTxtGenerator = lazy(() => import("./pages/tools/RobotsTxtGenerator"));
const SitemapGenerator = lazy(() => import("./pages/tools/SitemapGenerator"));
const HeadingTagChecker = lazy(() => import("./pages/tools/HeadingTagChecker"));
const KeywordDensityChecker = lazy(() => import("./pages/tools/KeywordDensityChecker"));
const ReadabilityChecker = lazy(() => import("./pages/tools/ReadabilityChecker"));
const CssGradientGenerator = lazy(() => import("./pages/tools/CssGradientGenerator"));
const CssBoxShadowGenerator = lazy(() => import("./pages/tools/CssBoxShadowGenerator"));
const CssClipPathGenerator = lazy(() => import("./pages/tools/CssClipPathGenerator"));
const CssFlexboxGenerator = lazy(() => import("./pages/tools/CssFlexboxGenerator"));
const CssGridGenerator = lazy(() => import("./pages/tools/CssGridGenerator"));
const CssFilterGenerator = lazy(() => import("./pages/tools/CssFilterGenerator"));
const CssTextShadowGenerator = lazy(() => import("./pages/tools/CssTextShadowGenerator"));
const CssTriangleGenerator = lazy(() => import("./pages/tools/CssTriangleGenerator"));
const GlassmorphismGenerator = lazy(() => import("./pages/tools/GlassmorphismGenerator"));
const NeumorphismGenerator = lazy(() => import("./pages/tools/NeumorphismGenerator"));
const CssBorderRadiusGenerator = lazy(() => import("./pages/tools/CssBorderRadiusGenerator"));
const CssAnimationGenerator = lazy(() => import("./pages/tools/CssAnimationGenerator"));
const PasswordStrengthChecker = lazy(() => import("./pages/tools/PasswordStrengthChecker"));
const SlugGenerator = lazy(() => import("./pages/tools/SlugGenerator"));
const TwitterCharacterCounter = lazy(() => import("./pages/tools/TwitterCharacterCounter"));
const BmrCalculator = lazy(() => import("./pages/tools/BmrCalculator"));
const MortgagePaymentCalculator = lazy(() => import("./pages/tools/MortgagePaymentCalculator"));
const LengthConverter = lazy(() => import("./pages/tools/LengthConverter"));
const DateDifferenceCalculator = lazy(() => import("./pages/tools/DateDifferenceCalculator"));
const ConcreteCalculator = lazy(() => import("./pages/tools/ConcreteCalculator"));
const SalaryCalculator = lazy(() => import("./pages/tools/SalaryCalculator"));
const BodyFatCalculator = lazy(() => import("./pages/tools/BodyFatCalculator"));
const HexToRgbConverter = lazy(() => import("./pages/tools/HexToRgbConverter"));
const RgbToHexConverter = lazy(() => import("./pages/tools/RgbToHexConverter"));
const RoiCalculator = lazy(() => import("./pages/tools/RoiCalculator"));
const AverageCalculator = lazy(() => import("./pages/tools/AverageCalculator"));
const WeightConverter = lazy(() => import("./pages/tools/WeightConverter"));
const TaxCalculator = lazy(() => import("./pages/tools/TaxCalculator"));
const BinaryToDecimalConverter = lazy(() => import("./pages/tools/BinaryToDecimalConverter"));
const StandardDeviationCalculator = lazy(() => import("./pages/tools/StandardDeviationCalculator"));
const CarLoanCalculator = lazy(() => import("./pages/tools/CarLoanCalculator"));
const SavingsCalculator = lazy(() => import("./pages/tools/SavingsCalculator"));
const ProfitMarginCalculator = lazy(() => import("./pages/tools/ProfitMarginCalculator"));
const InflationCalculator = lazy(() => import("./pages/tools/InflationCalculator"));
const AreaConverter = lazy(() => import("./pages/tools/AreaConverter"));
const VolumeConverter = lazy(() => import("./pages/tools/VolumeConverter"));
const SpeedConverter = lazy(() => import("./pages/tools/SpeedConverter"));
const PercentageChangeCalculator = lazy(() => import("./pages/tools/PercentageChangeCalculator"));
const FractionToDecimalCalculator = lazy(() => import("./pages/tools/FractionToDecimalCalculator"));
const DecimalToFractionCalculator = lazy(() => import("./pages/tools/DecimalToFractionCalculator"));
const ScientificCalculator = lazy(() => import("./pages/tools/ScientificCalculator"));
const CalorieCalculator = lazy(() => import("./pages/tools/CalorieCalculator"));
const BodySurfaceAreaCalculator = lazy(() => import("./pages/tools/BodySurfaceAreaCalculator"));
const RatioCalculator = lazy(() => import("./pages/tools/RatioCalculator"));
const SquareRootCalculator = lazy(() => import("./pages/tools/SquareRootCalculator"));
const CubeRootCalculator = lazy(() => import("./pages/tools/CubeRootCalculator"));
const PowerCalculator = lazy(() => import("./pages/tools/PowerCalculator"));
const LogarithmCalculator = lazy(() => import("./pages/tools/LogarithmCalculator"));
const FactorialCalculator = lazy(() => import("./pages/tools/FactorialCalculator"));
const PrimeNumberChecker = lazy(() => import("./pages/tools/PrimeNumberChecker"));
const LcmCalculator = lazy(() => import("./pages/tools/LcmCalculator"));
const GcdCalculator = lazy(() => import("./pages/tools/GcdCalculator"));
const MeanMedianModeCalculator = lazy(() => import("./pages/tools/MeanMedianModeCalculator"));
const RoundingNumbersCalculator = lazy(() => import("./pages/tools/RoundingNumbersCalculator"));
const ExponentsCalculator = lazy(() => import("./pages/tools/ExponentsCalculator"));
const VarianceCalculator = lazy(() => import("./pages/tools/VarianceCalculator"));
const NumberSequenceGenerator = lazy(() => import("./pages/tools/NumberSequenceGenerator"));
const DivisibilityChecker = lazy(() => import("./pages/tools/DivisibilityChecker"));
const ModuloCalculator = lazy(() => import("./pages/tools/ModuloCalculator"));
const ProportionCalculator = lazy(() => import("./pages/tools/ProportionCalculator"));
const MatrixCalculator = lazy(() => import("./pages/tools/MatrixCalculator"));
const QuadraticEquationSolver = lazy(() => import("./pages/tools/QuadraticEquationSolver"));
const PermutationCalculator = lazy(() => import("./pages/tools/PermutationCalculator"));
const CombinationCalculator = lazy(() => import("./pages/tools/CombinationCalculator"));
const MarkupCalculator = lazy(() => import("./pages/tools/MarkupCalculator"));
const BreakEvenCalculator = lazy(() => import("./pages/tools/BreakEvenCalculator"));
const FinanceToolSuite = lazy(() => import("./pages/tools/FinanceToolSuite"));
const PaybackPeriodCalculator = lazy(() => import("./pages/tools/PaybackPeriodCalculator"));
const CagrCalculator = lazy(() => import("./pages/tools/CagrCalculator"));
const DebtToIncomeCalculator = lazy(() => import("./pages/tools/DebtToIncomeCalculator"));
const LoanToValueCalculator = lazy(() => import("./pages/tools/LoanToValueCalculator"));
const LoanInterestCalculator = lazy(() => import("./pages/tools/LoanInterestCalculator"));
const SavingsGoalCalculator = lazy(() => import("./pages/tools/SavingsGoalCalculator"));
const RevenueCalculator = lazy(() => import("./pages/tools/RevenueCalculator"));
const CostSplitCalculator = lazy(() => import("./pages/tools/CostSplitCalculator"));
const DepreciationCalculator = lazy(() => import("./pages/tools/DepreciationCalculator"));
const NetWorthCalculator = lazy(() => import("./pages/tools/NetWorthCalculator"));
const RetirementCalculator = lazy(() => import("./pages/tools/RetirementCalculator"));
const CreditCardPayoffCalculator = lazy(() => import("./pages/tools/CreditCardPayoffCalculator"));
const DownPaymentCalculator = lazy(() => import("./pages/tools/DownPaymentCalculator"));
const AmortizationCalculator = lazy(() => import("./pages/tools/AmortizationCalculator"));
const StockProfitCalculator = lazy(() => import("./pages/tools/StockProfitCalculator"));
const DividendCalculator = lazy(() => import("./pages/tools/DividendCalculator"));
const CurrencyExchangeCalculator = lazy(() => import("./pages/tools/CurrencyExchangeCalculator"));
const HourlyToSalaryCalculator = lazy(() => import("./pages/tools/HourlyToSalaryCalculator"));
const DecimalToBinaryConverter = lazy(() => import("./pages/tools/DecimalToBinaryConverter"));
const HexToDecimalConverter = lazy(() => import("./pages/tools/HexToDecimalConverter"));
const RomanNumeralConverter = lazy(() => import("./pages/tools/RomanNumeralConverter"));
const DataStorageConverter = lazy(() => import("./pages/tools/DataStorageConverter"));
const EnergyConverter = lazy(() => import("./pages/tools/EnergyConverter"));
const PressureConverter = lazy(() => import("./pages/tools/PressureConverter"));
const TimeConverter = lazy(() => import("./pages/tools/TimeConverter"));
const AngleConverter = lazy(() => import("./pages/tools/AngleConverter"));
const FrequencyConverter = lazy(() => import("./pages/tools/FrequencyConverter"));
const FuelEfficiencyConverter = lazy(() => import("./pages/tools/FuelEfficiencyConverter"));
const NumberToWordsConverter = lazy(() => import("./pages/tools/NumberToWordsConverter"));
const WordsToNumberConverter = lazy(() => import("./pages/tools/WordsToNumberConverter"));
const BaseConverter = lazy(() => import("./pages/tools/BaseConverter"));
const BinaryToHexConverter = lazy(() => import("./pages/tools/BinaryToHexConverter"));
const OctalConverter = lazy(() => import("./pages/tools/OctalConverter"));
const UnitPriceConverter = lazy(() => import("./pages/tools/UnitPriceConverter"));
const DensityConverter = lazy(() => import("./pages/tools/DensityConverter"));
const PowerConverter = lazy(() => import("./pages/tools/PowerConverter"));
const TorqueConverter = lazy(() => import("./pages/tools/TorqueConverter"));
const ForceConverter = lazy(() => import("./pages/tools/ForceConverter"));
const ElectricCurrentConverter = lazy(() => import("./pages/tools/ElectricCurrentConverter"));
const ShoeSizeConverter = lazy(() => import("./pages/tools/ShoeSizeConverter"));
const CookingConverter = lazy(() => import("./pages/tools/CookingConverter"));
const PdfToolSuite = lazy(() => import("./pages/tools/PdfToolSuite"));

// Pair 14: Health
const CyclingCaloriesCalculator = lazy(() => import("./pages/tools/CyclingCaloriesCalculator"));
const DailyCaloriesBurnCalculator = lazy(() => import("./pages/tools/DailyCaloriesBurnCalculator"));
// Pair 13: Health
const LeanBodyMassCalculator = lazy(() => import("./pages/tools/LeanBodyMassCalculator"));
const WalkingCaloriesCalculator = lazy(() => import("./pages/tools/WalkingCaloriesCalculator"));
// Pair 12: Health
const DogAgeCalculator = lazy(() => import("./pages/tools/DogAgeCalculator"));
const CatAgeCalculator = lazy(() => import("./pages/tools/CatAgeCalculator"));
// Pair 11: Health
const CalorieIntakeCalculator = lazy(() => import("./pages/tools/CalorieIntakeCalculator"));
// Pair 10: Health
const CalorieDeficitCalculator = lazy(() => import("./pages/tools/CalorieDeficitCalculator"));
const OneRepMaxCalculator = lazy(() => import("./pages/tools/OneRepMaxCalculator"));
// Pair 9: Health + Education
const HeartRateCalculator = lazy(() => import("./pages/tools/HeartRateCalculator"));
const GradeCalculator = lazy(() => import("./pages/tools/GradeCalculator"));
// Pair 8: Health
const RunningPaceCalculator = lazy(() => import("./pages/tools/RunningPaceCalculator"));
const ProteinIntakeCalculator = lazy(() => import("./pages/tools/ProteinIntakeCalculator"));
// Pair 7: Time & Health
const LeapYearChecker = lazy(() => import("./pages/tools/LeapYearChecker"));
const MacroNutrientCalculator = lazy(() => import("./pages/tools/MacroNutrientCalculator"));
// Pair 1: Health
const TdeeCalculator = lazy(() => import("./pages/tools/TdeeCalculator"));
const WaterIntakeCalculator = lazy(() => import("./pages/tools/WaterIntakeCalculator"));
// Pair 2: Productivity
const CaseConverter = lazy(() => import("./pages/tools/CaseConverter"));
const CoinFlip = lazy(() => import("./pages/tools/CoinFlip"));
// Pair 3: Health
const SleepCalculator = lazy(() => import("./pages/tools/SleepCalculator"));
const IdealWeightCalculator = lazy(() => import("./pages/tools/IdealWeightCalculator"));
// Pair 4: Time & Date
const CountdownTimer = lazy(() => import("./pages/tools/CountdownTimer"));
const TimeDurationCalculator = lazy(() => import("./pages/tools/TimeDurationCalculator"));
const HalfBirthdayCalculator = lazy(() => import("./pages/tools/HalfBirthdayCalculator"));
const WeekNumberCalculator = lazy(() => import("./pages/tools/WeekNumberCalculator"));
const OvertimeCalculator = lazy(() => import("./pages/tools/OvertimeCalculator"));
const TimeAdditionCalculator = lazy(() => import("./pages/tools/TimeAdditionCalculator"));
const TimeSubtractionCalculator = lazy(() => import("./pages/tools/TimeSubtractionCalculator"));
const TimeZoneConverter = lazy(() => import("./pages/tools/TimeZoneConverter"));
const StopwatchTool = lazy(() => import("./pages/tools/StopwatchTool"));
const MeetingTimeCalculator = lazy(() => import("./pages/tools/MeetingTimeCalculator"));
const ShiftScheduleCalculator = lazy(() => import("./pages/tools/ShiftScheduleCalculator"));
const DeadlineCalculator = lazy(() => import("./pages/tools/DeadlineCalculator"));
const StudyTimeCalculator = lazy(() => import("./pages/tools/StudyTimeCalculator"));
const ReadingTimeCalculator = lazy(() => import("./pages/tools/ReadingTimeCalculator"));
const EventCountdownTimer = lazy(() => import("./pages/tools/EventCountdownTimer"));
const HourlyTimeCalculator = lazy(() => import("./pages/tools/HourlyTimeCalculator"));
const ShiftHoursCalculator = lazy(() => import("./pages/tools/ShiftHoursCalculator"));
const TimeTrackingCalculator = lazy(() => import("./pages/tools/TimeTrackingCalculator"));
const EraCalculator = lazy(() => import("./pages/tools/EraCalculator"));
const MilitaryTimeConverter = lazy(() => import("./pages/tools/MilitaryTimeConverter"));
const ZodiacSignCalculator = lazy(() => import("./pages/tools/ZodiacSignCalculator"));
const ChineseZodiacCalculator = lazy(() => import("./pages/tools/ChineseZodiacCalculator"));
const DaysBetweenDatesCalculator = lazy(() => import("./pages/tools/DaysBetweenDatesCalculator"));
const WorkingDaysCalculator = lazy(() => import("./pages/tools/WorkingDaysCalculator"));
const UnixTimestampConverter = lazy(() => import("./pages/tools/UnixTimestampConverter"));
const AgeInDaysCalculator = lazy(() => import("./pages/tools/AgeInDaysCalculator"));
const RetirementAgeCalculator = lazy(() => import("./pages/tools/RetirementAgeCalculator"));
const PregnancyDueDateCalculator = lazy(() => import("./pages/tools/PregnancyDueDateCalculator"));
const BodyTypeCalculator = lazy(() => import("./pages/tools/BodyTypeCalculator"));
const OvulationCalculator = lazy(() => import("./pages/tools/OvulationCalculator"));
const FitnessAgeCalculator = lazy(() => import("./pages/tools/FitnessAgeCalculator"));
const FatIntakeCalculator = lazy(() => import("./pages/tools/FatIntakeCalculator"));
const WorkoutDurationCalculator = lazy(() => import("./pages/tools/WorkoutDurationCalculator"));
const StepCounterEstimator = lazy(() => import("./pages/tools/StepCounterEstimator"));
const BacCalculator = lazy(() => import("./pages/tools/BacCalculator"));
const WaistToHipRatioCalculator = lazy(() => import("./pages/tools/WaistToHipRatioCalculator"));
const KetoCalculator = lazy(() => import("./pages/tools/KetoCalculator"));
const IntermittentFastingCalculator = lazy(() => import("./pages/tools/IntermittentFastingCalculator"));
const VO2MaxCalculator = lazy(() => import("./pages/tools/VO2MaxCalculator"));
const WorkHoursCalculator = lazy(() => import("./pages/tools/WorkHoursCalculator"));
// Pair 5: Productivity
const TextReverser = lazy(() => import("./pages/tools/TextReverser"));
const DiceRoller = lazy(() => import("./pages/tools/DiceRoller"));
// Pair 6: Time & Productivity
const BusinessDaysCalculator = lazy(() => import("./pages/tools/BusinessDaysCalculator"));
const RandomNameGenerator = lazy(() => import("./pages/tools/RandomNameGenerator"));
// New productivity tools
const UsernameGenerator = lazy(() => import("./pages/tools/UsernameGenerator"));
const RandomColorGenerator = lazy(() => import("./pages/tools/RandomColorGenerator"));
const DuplicateLineRemover = lazy(() => import("./pages/tools/DuplicateLineRemover"));
const AlphabeticalSort = lazy(() => import("./pages/tools/AlphabeticalSort"));
const PalindromeChecker = lazy(() => import("./pages/tools/PalindromeChecker"));
const CharacterCounterTool = lazy(() => import("./pages/tools/CharacterCounterTool"));
const RandomLetterGenerator = lazy(() => import("./pages/tools/RandomLetterGenerator"));
const RandomPickerTool = lazy(() => import("./pages/tools/RandomPickerTool"));
const LineCounterTool = lazy(() => import("./pages/tools/LineCounterTool"));
const RemoveExtraSpacesTool = lazy(() => import("./pages/tools/RemoveExtraSpacesTool"));
const SortTextLinesTool = lazy(() => import("./pages/tools/SortTextLinesTool"));
const TextFormatterTool = lazy(() => import("./pages/tools/TextFormatterTool"));
const SpinWheelGenerator = lazy(() => import("./pages/tools/SpinWheelGenerator"));
const ListRandomizerTool = lazy(() => import("./pages/tools/ListRandomizerTool"));
const MarkdownPreviewer = lazy(() => import("./pages/tools/MarkdownPreviewer"));
const ColorPaletteGenerator = lazy(() => import("./pages/tools/ColorPaletteGenerator"));
const ColorPickerTool = lazy(() => import("./pages/tools/ColorPickerTool"));
const TailwindColorGenerator = lazy(() => import("./pages/tools/TailwindColorGenerator"));
const EmojiPickerTool = lazy(() => import("./pages/tools/EmojiPickerTool"));
// Additional productivity tools
const HashtagGenerator = lazy(() => import("./pages/tools/HashtagGenerator"));
const WordFrequencyCounter = lazy(() => import("./pages/tools/WordFrequencyCounter"));
// Developer & Math tools
const TextToBinaryConverter = lazy(() => import("./pages/tools/TextToBinaryConverter"));
const UrlEncoderDecoder = lazy(() => import("./pages/tools/UrlEncoderDecoder"));
const PercentageErrorCalculator = lazy(() => import("./pages/tools/PercentageErrorCalculator"));
// Finance & Education tools
const TipCalculator = lazy(() => import("./pages/tools/TipCalculator"));
const GpaCalculator = lazy(() => import("./pages/tools/GpaCalculator"));
const AttendancePercentageCalculator = lazy(() => import("./pages/tools/AttendancePercentageCalculator"));
const MarksPercentageCalculator = lazy(() => import("./pages/tools/MarksPercentageCalculator"));
const MarksToGpaConverter = lazy(() => import("./pages/tools/MarksToGpaConverter"));
const PercentageGradeCalculator = lazy(() => import("./pages/tools/PercentageGradeCalculator"));
const WeightedGradeCalculator = lazy(() => import("./pages/tools/WeightedGradeCalculator"));
const FinalGradeCalculator = lazy(() => import("./pages/tools/FinalGradeCalculator"));
const ReadingSpeedCalculator = lazy(() => import("./pages/tools/ReadingSpeedCalculator"));
const ClassAverageCalculator = lazy(() => import("./pages/tools/ClassAverageCalculator"));
const AssignmentGradeCalculator = lazy(() => import("./pages/tools/AssignmentGradeCalculator"));
const ScoreCalculator = lazy(() => import("./pages/tools/ScoreCalculator"));
const StudyPlannerCalculator = lazy(() => import("./pages/tools/StudyPlannerCalculator"));
const HomeworkTimeCalculator = lazy(() => import("./pages/tools/HomeworkTimeCalculator"));
const QuizScoreCalculator = lazy(() => import("./pages/tools/QuizScoreCalculator"));
const GradeImprovementCalculator = lazy(() => import("./pages/tools/GradeImprovementCalculator"));
const CgpaCalculator = lazy(() => import("./pages/tools/CgpaCalculator"));
const ExamCountdownTimer = lazy(() => import("./pages/tools/ExamCountdownTimer"));
const ExamScorePredictor = lazy(() => import("./pages/tools/ExamScorePredictor"));
const StudyHoursTracker = lazy(() => import("./pages/tools/StudyHoursTracker"));
const LearningTimeCalculator = lazy(() => import("./pages/tools/LearningTimeCalculator"));
const ScholarshipCalculator = lazy(() => import("./pages/tools/ScholarshipCalculator"));
const SemesterPlannerTool = lazy(() => import("./pages/tools/SemesterPlannerTool"));
const FlashcardTimerTool = lazy(() => import("./pages/tools/FlashcardTimerTool"));
const TestScoreAnalyzer = lazy(() => import("./pages/tools/TestScoreAnalyzer"));
const RevisionPlannerTool = lazy(() => import("./pages/tools/RevisionPlannerTool"));
const SchoolSchedulePlanner = lazy(() => import("./pages/tools/SchoolSchedulePlanner"));
const TypingSpeedTest = lazy(() => import("./pages/tools/TypingSpeedTest"));
const SatScoreCalculator = lazy(() => import("./pages/tools/SatScoreCalculator"));
const CollegeGpaCalculator = lazy(() => import("./pages/tools/CollegeGpaCalculator"));
const UuidGenerator = lazy(() => import("./pages/tools/UuidGenerator"));
const CsvToJsonConverter = lazy(() => import("./pages/tools/CsvToJsonConverter"));
const ColorContrastChecker = lazy(() => import("./pages/tools/ColorContrastChecker"));
const BrickCalculator = lazy(() => import("./pages/tools/BrickCalculator"));
const RebarCalculator = lazy(() => import("./pages/tools/RebarCalculator"));
const DrywallCalculator = lazy(() => import("./pages/tools/DrywallCalculator"));
const WallpaperCalculator = lazy(() => import("./pages/tools/WallpaperCalculator"));
const MulchCalculator = lazy(() => import("./pages/tools/MulchCalculator"));
const SoilCalculator = lazy(() => import("./pages/tools/SoilCalculator"));
const CementCalculator = lazy(() => import("./pages/tools/CementCalculator"));
const PaintCalculator = lazy(() => import("./pages/tools/PaintCalculator"));
const SteelWeightCalculator = lazy(() => import("./pages/tools/SteelWeightCalculator"));
const TileCalculator = lazy(() => import("./pages/tools/TileCalculator"));
const FlooringCalculator = lazy(() => import("./pages/tools/FlooringCalculator"));
const RoomAreaCalculator = lazy(() => import("./pages/tools/RoomAreaCalculator"));
const RoofAreaCalculator = lazy(() => import("./pages/tools/RoofAreaCalculator"));
const WaterTankCalculator = lazy(() => import("./pages/tools/WaterTankCalculator"));
const AsphaltCalculator = lazy(() => import("./pages/tools/AsphaltCalculator"));
const GravelCalculator = lazy(() => import("./pages/tools/GravelCalculator"));
const FenceLengthCalculator = lazy(() => import("./pages/tools/FenceLengthCalculator"));
const LumberCalculator = lazy(() => import("./pages/tools/LumberCalculator"));
const WallAreaCalculator = lazy(() => import("./pages/tools/WallAreaCalculator"));
const PipeVolumeCalculator = lazy(() => import("./pages/tools/PipeVolumeCalculator"));
const SandCalculator = lazy(() => import("./pages/tools/SandCalculator"));
const ExcavationCalculator = lazy(() => import("./pages/tools/ExcavationCalculator"));
const StairCalculator = lazy(() => import("./pages/tools/StairCalculator"));
const MaterialCostCalculator = lazy(() => import("./pages/tools/MaterialCostCalculator"));
const DeckAreaCalculator = lazy(() => import("./pages/tools/DeckAreaCalculator"));
const PlasterCalculator = lazy(() => import("./pages/tools/PlasterCalculator"));
const InsulationCalculator = lazy(() => import("./pages/tools/InsulationCalculator"));
const ConcreteBlockCalculator = lazy(() => import("./pages/tools/ConcreteBlockCalculator"));
const PaverCalculator = lazy(() => import("./pages/tools/PaverCalculator"));
const BitumenCalculator = lazy(() => import("./pages/tools/BitumenCalculator"));
const PoolSaltCalculator = lazy(() => import("./pages/tools/PoolSaltCalculator"));
const ElectricalLoadCalculator = lazy(() => import("./pages/tools/ElectricalLoadCalculator"));
const SolarPanelCalculator = lazy(() => import("./pages/tools/SolarPanelCalculator"));
const ImageResizer = lazy(() => import("./pages/tools/ImageResizer"));
const ImageCompressor = lazy(() => import("./pages/tools/ImageCompressor"));
const ImageCropper = lazy(() => import("./pages/tools/ImageCropper"));
const ImageFormatConverter = lazy(() => import("./pages/tools/ImageFormatConverter"));
const ImageToBase64 = lazy(() => import("./pages/tools/ImageToBase64"));
const Base64ToImage = lazy(() => import("./pages/tools/Base64ToImage"));
const QrCodeGeneratorPage = lazy(() => import("./pages/tools/QrCodeGeneratorPage"));
const ImageCategoryToolPage = lazy(() => import("./pages/tools/ImageCategoryToolPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: false,
    },
  },
});

function LazyWrap({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen bg-background" />}>{children}</Suspense>;
}

function ToolSlugRedirect() {
  const params = useParams<{ slug: string; categoryId?: string }>();
  const [, setLocation] = useLocation();
  const slug = params.slug;
  const requestedCategoryId = params.categoryId?.toLowerCase();
  const tool = getToolBySlug(slug);
  const destination = tool ? getCanonicalToolPath(slug) : undefined;
  const canonicalCategoryId = destination?.split("/")[1];
  const hasCategoryMismatch =
    Boolean(requestedCategoryId && canonicalCategoryId && requestedCategoryId !== canonicalCategoryId);
  const safeDestination = hasCategoryMismatch ? undefined : destination;

  useEffect(() => {
    if (!safeDestination) return;
    setLocation(safeDestination, { replace: true });
  }, [safeDestination, setLocation]);

  if (!tool || hasCategoryMismatch) {
    return <NotFound />;
  }

  return (
    <>
      <SEO
        title="Redirecting to the canonical tool page"
        description="This legacy tool URL has moved to a preferred canonical path."
        canonical={destination}
        noindex
      />
      <div className="min-h-screen bg-background" />
    </>
  );
}

function StaticPathRedirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation(to, { replace: true });
  }, [setLocation, to]);

  return (
    <>
      <SEO
        title="Redirecting to the canonical page"
        description="This legacy URL has moved to a preferred canonical path."
        canonical={to}
        noindex
      />
      <div className="min-h-screen bg-background" />
    </>
  );
}

function ScrollToTopOnRouteChange() {
  const [location] = useLocation();

  useEffect(() => {
    if (location.includes("#")) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTopOnRouteChange />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />

      {/* Category pages */}
      <Route path="/category/:id" component={CategoryPage} />

      {/* Legacy /tools/ routes (redirect-friendly) */}
      <Route path="/tools/percentage-calculator" component={PercentageCalculator} />
      <Route path="/tools/password-generator">{() => <StaticPathRedirect to="/security/online-password-generator" />}</Route>
      <Route path="/security/password-generator">{() => <StaticPathRedirect to="/security/online-password-generator" />}</Route>
      <Route path="/security/online-password-generator" component={PasswordGenerator} />
      <Route path="/tools/word-counter" component={WordCounter} />
      <Route path="/tools/age-calculator" component={AgeCalculator} />
      <Route path="/tools/color-converter" component={ColorConverter} />
      <Route path="/tools/bmi-calculator" component={BmiCalculator} />
      <Route path="/tools/tip-calculator" component={TipCalculator} />
      <Route path="/tools/discount-calculator" component={DiscountCalculator} />
      <Route path="/tools/random-number-generator" component={RandomNumberGenerator} />
      <Route path="/tools/temperature-converter" component={TemperatureConverter} />
      <Route path="/tools/cube-root-calculator">{() => <LazyWrap><CubeRootCalculator /></LazyWrap>}</Route>
      <Route path="/tools/power-calculator">{() => <LazyWrap><PowerCalculator /></LazyWrap>}</Route>
      <Route path="/tools/logarithm-calculator">{() => <LazyWrap><LogarithmCalculator /></LazyWrap>}</Route>
      <Route path="/tools/factorial-calculator">{() => <LazyWrap><FactorialCalculator /></LazyWrap>}</Route>
      <Route path="/tools/prime-number-checker">{() => <LazyWrap><PrimeNumberChecker /></LazyWrap>}</Route>
      <Route path="/tools/lcm-calculator">{() => <StaticPathRedirect to="/math/online-lcm-calculator" />}</Route>
      <Route path="/tools/gcd-calculator">{() => <StaticPathRedirect to="/math/online-gcd-calculator" />}</Route>
      <Route path="/tools/mean-median-mode-calculator">{() => <LazyWrap><MeanMedianModeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/rounding-numbers-calculator">{() => <LazyWrap><RoundingNumbersCalculator /></LazyWrap>}</Route>
      <Route path="/tools/exponents-calculator">{() => <LazyWrap><ExponentsCalculator /></LazyWrap>}</Route>
      <Route path="/tools/variance-calculator">{() => <LazyWrap><VarianceCalculator /></LazyWrap>}</Route>
      <Route path="/tools/number-sequence-generator">{() => <LazyWrap><NumberSequenceGenerator /></LazyWrap>}</Route>
      <Route path="/tools/divisibility-checker">{() => <LazyWrap><DivisibilityChecker /></LazyWrap>}</Route>
      <Route path="/tools/modulo-calculator">{() => <LazyWrap><ModuloCalculator /></LazyWrap>}</Route>
      <Route path="/tools/proportion-calculator">{() => <LazyWrap><ProportionCalculator /></LazyWrap>}</Route>
      <Route path="/tools/matrix-calculator">{() => <StaticPathRedirect to="/math/online-matrix-calculator" />}</Route>
      <Route path="/tools/quadratic-equation-solver">{() => <StaticPathRedirect to="/math/online-quadratic-equation-solver" />}</Route>
      <Route path="/tools/permutation-calculator">{() => <LazyWrap><PermutationCalculator /></LazyWrap>}</Route>
      <Route path="/tools/combination-calculator">{() => <LazyWrap><CombinationCalculator /></LazyWrap>}</Route>

      {/* New SEO-friendly /:category/:tool routes — existing tools */}
      <Route path="/math/percentage-calculator">{() => <StaticPathRedirect to="/math/online-percentage-calculator" />}</Route>
      <Route path="/math/online-percentage-calculator" component={PercentageCalculator} />
      <Route path="/productivity/password-generator">{() => <StaticPathRedirect to="/security/online-password-generator" />}</Route>
      <Route path="/productivity/online-password-generator">{() => <StaticPathRedirect to="/security/online-password-generator" />}</Route>
      <Route path="/productivity/word-counter" component={WordCounter} />
      <Route path="/productivity/online-word-counter" component={WordCounter} />
      <Route path="/productivity/hashtag-generator">{() => <LazyWrap><HashtagGenerator /></LazyWrap>}</Route>
      <Route path="/productivity/word-frequency-counter">{() => <LazyWrap><WordFrequencyCounter /></LazyWrap>}</Route>
      <Route path="/time-date/age-calculator" component={AgeCalculator} />
      <Route path="/time-date/online-age-calculator" component={AgeCalculator} />
      <Route path="/conversion/color-converter" component={ColorConverter} />
      <Route path="/health/bmi-calculator" component={BmiCalculator} />
      <Route path="/health/online-bmi-calculator" component={BmiCalculator} />
      <Route path="/finance/tip-calculator" component={TipCalculator} />
      <Route path="/finance/discount-calculator" component={DiscountCalculator} />
      <Route path="/math/random-number-generator" component={RandomNumberGenerator} />
      <Route path="/conversion/temperature-converter" component={TemperatureConverter} />
      <Route path="/conversion/online-temperature-converter" component={TemperatureConverter} />

      {/* New tool pages */}
      <Route path="/finance/compound-interest-calculator">{() => <StaticPathRedirect to="/finance/online-compound-interest-calculator" />}</Route>
      <Route path="/finance/online-compound-interest-calculator">{() => <LazyWrap><CompoundInterestCalculator /></LazyWrap>}</Route>
      <Route path="/finance/loan-emi-calculator">{() => <StaticPathRedirect to="/finance/online-loan-emi-calculator" />}</Route>
      <Route path="/finance/online-loan-emi-calculator">{() => <LazyWrap><LoanEmiCalculator /></LazyWrap>}</Route>
      <Route path="/finance/simple-interest-calculator">{() => <StaticPathRedirect to="/finance/online-simple-interest-calculator" />}</Route>
      <Route path="/finance/online-simple-interest-calculator">{() => <LazyWrap><SimpleInterestCalculator /></LazyWrap>}</Route>
      <Route path="/developer/json-formatter">{() => <LazyWrap><JsonFormatter /></LazyWrap>}</Route>
      <Route path="/developer/online-json-formatter">{() => <LazyWrap><JsonFormatter /></LazyWrap>}</Route>
      <Route path="/developer/base64-encoder-decoder">{() => <LazyWrap><Base64EncoderDecoder /></LazyWrap>}</Route>
      <Route path="/developer/online-base64-encoder-decoder">{() => <LazyWrap><Base64EncoderDecoder /></LazyWrap>}</Route>
      <Route path="/developer/color-code-converter">{() => <LazyWrap><ColorCodeConverter /></LazyWrap>}</Route>
      <Route path="/developer/cron-expression-generator">{() => <LazyWrap><CronExpressionGenerator /></LazyWrap>}</Route>
      <Route path="/developer/css-formatter">{() => <LazyWrap><CssFormatter /></LazyWrap>}</Route>
      <Route path="/developer/online-css-formatter">{() => <LazyWrap><CssFormatter /></LazyWrap>}</Route>
      <Route path="/developer/css-minifier">{() => <LazyWrap><CssMinifier /></LazyWrap>}</Route>
      <Route path="/developer/online-css-minifier">{() => <LazyWrap><CssMinifier /></LazyWrap>}</Route>
      <Route path="/developer/hash-generator">{() => <LazyWrap><HashGenerator /></LazyWrap>}</Route>
      <Route path="/developer/online-hash-generator">{() => <LazyWrap><HashGenerator /></LazyWrap>}</Route>
      <Route path="/security/md5-hash-generator">{() => <LazyWrap><HashGenerator /></LazyWrap>}</Route>
      <Route path="/security/sha1-hash-generator">{() => <LazyWrap><HashGenerator /></LazyWrap>}</Route>
      <Route path="/security/sha256-hash-generator">{() => <LazyWrap><HashGenerator /></LazyWrap>}</Route>
      <Route path="/security/sha512-hash-generator">{() => <LazyWrap><HashGenerator /></LazyWrap>}</Route>
      <Route path="/developer/html-entity-encoder">{() => <LazyWrap><HtmlEntityEncoder /></LazyWrap>}</Route>
      <Route path="/developer/html-formatter">{() => <LazyWrap><HtmlFormatter /></LazyWrap>}</Route>
      <Route path="/developer/online-html-formatter">{() => <LazyWrap><HtmlFormatter /></LazyWrap>}</Route>
      <Route path="/developer/html-minifier">{() => <LazyWrap><HtmlMinifier /></LazyWrap>}</Route>
      <Route path="/developer/online-html-minifier">{() => <LazyWrap><HtmlMinifier /></LazyWrap>}</Route>
      <Route path="/developer/html-to-markdown">{() => <LazyWrap><HtmlToMarkdownConverter /></LazyWrap>}</Route>
      <Route path="/developer/javascript-formatter">{() => <LazyWrap><JavaScriptFormatter /></LazyWrap>}</Route>
      <Route path="/developer/online-javascript-formatter">{() => <LazyWrap><JavaScriptFormatter /></LazyWrap>}</Route>
      <Route path="/developer/javascript-minifier">{() => <LazyWrap><JavaScriptMinifier /></LazyWrap>}</Route>
      <Route path="/developer/online-javascript-minifier">{() => <LazyWrap><JavaScriptMinifier /></LazyWrap>}</Route>
      <Route path="/developer/markdown-to-html">{() => <LazyWrap><MarkdownToHtmlConverter /></LazyWrap>}</Route>
      <Route path="/developer/jwt-decoder">{() => <LazyWrap><JwtDecoder /></LazyWrap>}</Route>
      <Route path="/developer/online-jwt-decoder">{() => <LazyWrap><JwtDecoder /></LazyWrap>}</Route>
      <Route path="/developer/json-minifier">{() => <LazyWrap><JsonMinifier /></LazyWrap>}</Route>
      <Route path="/developer/json-path-tester">{() => <StaticPathRedirect to="/developer/online-json-path-tester" />}</Route>
      <Route path="/developer/online-json-path-tester">{() => <LazyWrap><JsonPathTester /></LazyWrap>}</Route>
      <Route path="/developer/json-validator">{() => <LazyWrap><JsonValidator /></LazyWrap>}</Route>
      <Route path="/developer/online-json-validator">{() => <LazyWrap><JsonValidator /></LazyWrap>}</Route>
      <Route path="/developer/regex-tester">{() => <LazyWrap><RegexTester /></LazyWrap>}</Route>
      <Route path="/developer/online-regex-tester">{() => <LazyWrap><RegexTester /></LazyWrap>}</Route>
      <Route path="/developer/sql-formatter">{() => <LazyWrap><SqlFormatter /></LazyWrap>}</Route>
      <Route path="/developer/online-sql-formatter">{() => <LazyWrap><SqlFormatter /></LazyWrap>}</Route>
      <Route path="/developer/string-escape-unescape">{() => <LazyWrap><StringEscapeUnescape /></LazyWrap>}</Route>
      <Route path="/developer/diff-checker">{() => <LazyWrap><TextDiffChecker /></LazyWrap>}</Route>
      <Route path="/developer/text-diff-checker">{() => <LazyWrap><TextDiffChecker /></LazyWrap>}</Route>
      <Route path="/developer/json-to-csv">{() => <StaticPathRedirect to="/developer/online-json-to-csv" />}</Route>
      <Route path="/developer/online-json-to-csv">{() => <LazyWrap><JsonToCsvConverter /></LazyWrap>}</Route>
      <Route path="/developer/json-to-xml">{() => <LazyWrap><JsonToXmlConverter /></LazyWrap>}</Route>
      <Route path="/developer/xml-formatter">{() => <LazyWrap><XmlFormatter /></LazyWrap>}</Route>
      <Route path="/developer/yaml-to-json">{() => <LazyWrap><YamlToJsonConverter /></LazyWrap>}</Route>
      <Route path="/developer/lorem-ipsum-generator">{() => <StaticPathRedirect to="/developer/online-lorem-ipsum-generator" />}</Route>
      <Route path="/developer/online-lorem-ipsum-generator">{() => <LazyWrap><LoremIpsumGenerator /></LazyWrap>}</Route>
      <Route path="/gaming/dnd-dice-roller">{() => <LazyWrap><DndDiceRoller /></LazyWrap>}</Route>
      <Route path="/gaming/blox-fruits-calculator">{() => <LazyWrap><BloxFruitsCalculator /></LazyWrap>}</Route>
      <Route path="/gaming/blox-fruits-trade-calculator">{() => <LazyWrap><BloxFruitsTradeCalculator /></LazyWrap>}</Route>
      <Route path="/gaming/cs2-sensitivity-calculator">{() => <LazyWrap><Cs2SensitivityCalculator /></LazyWrap>}</Route>
      <Route path="/gaming/valorant-sensitivity-calculator">{() => <LazyWrap><ValorantSensitivityCalculator /></LazyWrap>}</Route>
      <Route path="/gaming/fortnite-dpi-calculator">{() => <LazyWrap><FortniteDpiCalculator /></LazyWrap>}</Route>
      <Route path="/gaming/roblox-tax-calculator">{() => <LazyWrap><RobloxTaxCalculator /></LazyWrap>}</Route>
      <Route path="/gaming/minecraft-circle-calculator">{() => <LazyWrap><MinecraftCircleCalculator /></LazyWrap>}</Route>
      <Route path="/gaming/xp-level-calculator">{() => <LazyWrap><XpLevelCalculator /></LazyWrap>}</Route>
      <Route path="/gaming/game-currency-converter">{() => <LazyWrap><GameCurrencyConverter /></LazyWrap>}</Route>
      <Route path="/gaming/esports-earnings-calculator">{() => <LazyWrap><EsportsEarningsCalculator /></LazyWrap>}</Route>
      <Route path="/gaming/gaming-fps-calculator">{() => <LazyWrap><GamingFpsCalculator /></LazyWrap>}</Route>
      <Route path="/gaming/damage-calculator">{() => <LazyWrap><DamageCalculator /></LazyWrap>}</Route>
      <Route path="/gaming/clash-of-clans-upgrade-calculator">{() => <LazyWrap><ClashOfClansUpgradeCalculator /></LazyWrap>}</Route>
      <Route path="/gaming/genshin-impact-calculator">{() => <LazyWrap><GenshinImpactCalculator /></LazyWrap>}</Route>
      <Route path="/gaming/pokemon-iv-calculator">{() => <LazyWrap><PokemonIvCalculator /></LazyWrap>}</Route>
      <Route path="/security/encryption-decoder">{() => <LazyWrap><CaesarCipherTool /></LazyWrap>}</Route>
      <Route path="/security/morse-code-translator">{() => <StaticPathRedirect to="/security/online-morse-code-translator" />}</Route>
      <Route path="/security/online-morse-code-translator">{() => <LazyWrap><MorseCodeTranslator /></LazyWrap>}</Route>
      <Route path="/security/random-string-generator">{() => <LazyWrap><RandomStringGenerator /></LazyWrap>}</Route>
      <Route path="/security/hmac-generator">{() => <LazyWrap><HmacGenerator /></LazyWrap>}</Route>
      <Route path="/security/bcrypt-hash-generator">{() => <StaticPathRedirect to="/security/online-bcrypt-hash-generator" />}</Route>
      <Route path="/security/online-bcrypt-hash-generator">{() => <LazyWrap><BcryptHashGenerator /></LazyWrap>}</Route>
      <Route path="/security/aes-encrypt-decrypt">{() => <StaticPathRedirect to="/security/online-aes-encrypt-decrypt" />}</Route>
      <Route path="/security/online-aes-encrypt-decrypt">{() => <LazyWrap><AesEncryptDecrypt /></LazyWrap>}</Route>
      <Route path="/security/rsa-key-generator">{() => <LazyWrap><RsaKeyGenerator /></LazyWrap>}</Route>
      <Route path="/security/hex-to-text">{() => <LazyWrap><HexToTextConverter /></LazyWrap>}</Route>
      <Route path="/seo/meta-tag-generator">{() => <LazyWrap><MetaTagGenerator /></LazyWrap>}</Route>
      <Route path="/seo/htaccess-redirect-generator">{() => <LazyWrap><HtaccessRedirectGenerator /></LazyWrap>}</Route>
      <Route path="/seo/favicon-checker">{() => <LazyWrap><FaviconCodeGenerator /></LazyWrap>}</Route>
      <Route path="/seo/serp-preview-tool">{() => <LazyWrap><GoogleSerpPreview /></LazyWrap>}</Route>
      <Route path="/seo/open-graph-generator">{() => <LazyWrap><OpenGraphGenerator /></LazyWrap>}</Route>
      <Route path="/seo/twitter-card-generator">{() => <LazyWrap><TwitterCardGenerator /></LazyWrap>}</Route>
      <Route path="/seo/schema-markup-generator">{() => <LazyWrap><SchemaMarkupGenerator /></LazyWrap>}</Route>
      <Route path="/seo/canonical-tag-generator">{() => <LazyWrap><CanonicalTagGenerator /></LazyWrap>}</Route>
      <Route path="/seo/robots-txt-generator">{() => <StaticPathRedirect to="/seo/online-robots-txt-generator" />}</Route>
      <Route path="/seo/online-robots-txt-generator">{() => <LazyWrap><RobotsTxtGenerator /></LazyWrap>}</Route>
      <Route path="/seo/sitemap-generator">{() => <StaticPathRedirect to="/seo/online-sitemap-generator" />}</Route>
      <Route path="/seo/online-sitemap-generator">{() => <LazyWrap><SitemapGenerator /></LazyWrap>}</Route>
      <Route path="/seo/heading-tag-checker">{() => <StaticPathRedirect to="/seo/online-heading-tag-checker" />}</Route>
      <Route path="/seo/online-heading-tag-checker">{() => <LazyWrap><HeadingTagChecker /></LazyWrap>}</Route>
      <Route path="/seo/keyword-density-checker">{() => <StaticPathRedirect to="/seo/online-keyword-density-checker" />}</Route>
      <Route path="/seo/online-keyword-density-checker">{() => <LazyWrap><KeywordDensityChecker /></LazyWrap>}</Route>
      <Route path="/seo/readability-checker">{() => <StaticPathRedirect to="/seo/online-readability-checker" />}</Route>
      <Route path="/seo/online-readability-checker">{() => <LazyWrap><ReadabilityChecker /></LazyWrap>}</Route>
      <Route path="/css-design/css-gradient-generator">{() => <LazyWrap><CssGradientGenerator /></LazyWrap>}</Route>
      <Route path="/security/password-strength-checker">{() => <LazyWrap><PasswordStrengthChecker /></LazyWrap>}</Route>
      <Route path="/productivity/password-strength-checker">{() => <LazyWrap><PasswordStrengthChecker /></LazyWrap>}</Route>
      <Route path="/productivity/slug-generator">{() => <LazyWrap><SlugGenerator /></LazyWrap>}</Route>
      <Route path="/developer/slug-generator">{() => <LazyWrap><SlugGenerator /></LazyWrap>}</Route>
      <Route path="/developer/url-slug-generator">{() => <LazyWrap><SlugGenerator /></LazyWrap>}</Route>
      <Route path="/social-media/twitter-character-counter">{() => <LazyWrap><TwitterCharacterCounter /></LazyWrap>}</Route>
      <Route path="/social-media/instagram-caption-counter">{() => <StaticPathRedirect to="/social-media/online-instagram-caption-counter" />}</Route>
      <Route path="/social-media/tiktok-character-counter">{() => <LazyWrap><TikTokCaptionCounter /></LazyWrap>}</Route>
      <Route path="/social-media/online-instagram-caption-counter">{() => <LazyWrap><InstagramCaptionCounter /></LazyWrap>}</Route>
      <Route path="/social-media/linkedin-post-formatter">{() => <StaticPathRedirect to="/social-media/online-linkedin-post-formatter" />}</Route>
      <Route path="/social-media/online-linkedin-post-formatter">{() => <LazyWrap><LinkedinPostFormatter /></LazyWrap>}</Route>
      <Route path="/social-media/bio-generator">{() => <LazyWrap><SocialMediaBioGenerator /></LazyWrap>}</Route>
      <Route path="/social-media/social-media-bio-generator">{() => <LazyWrap><SocialMediaBioGenerator /></LazyWrap>}</Route>
      <Route path="/social-media/social-post-scheduler-planner">{() => <StaticPathRedirect to="/social-media/online-social-post-scheduler-planner" />}</Route>
      <Route path="/social-media/online-social-post-scheduler-planner">{() => <LazyWrap><SocialPostPlanner /></LazyWrap>}</Route>
      <Route path="/social-media/text-to-emoji">{() => <LazyWrap><TextToEmojiConverter /></LazyWrap>}</Route>
      <Route path="/social-media/text-to-emoji-converter">{() => <LazyWrap><TextToEmojiConverter /></LazyWrap>}</Route>
      <Route path="/social-media/unicode-text-converter">{() => <LazyWrap><UnicodeTextConverter /></LazyWrap>}</Route>
      <Route path="/social-media/social-media-image-resizer">{() => <StaticPathRedirect to="/social-media/online-social-media-image-resizer" />}</Route>
      <Route path="/social-media/youtube-thumbnail-checker">{() => <LazyWrap><YouTubeThumbnailChecker /></LazyWrap>}</Route>
      <Route path="/social-media/online-social-media-image-resizer">{() => <LazyWrap><SocialMediaImageResizer /></LazyWrap>}</Route>
      <Route path="/education/gpa-calculator">{() => <LazyWrap><GpaCalculator /></LazyWrap>}</Route>
      <Route path="/health/bmr-calculator">{() => <LazyWrap><BmrCalculator /></LazyWrap>}</Route>
      <Route path="/health/online-bmr-calculator">{() => <LazyWrap><BmrCalculator /></LazyWrap>}</Route>
      <Route path="/finance/mortgage-payment-calculator">{() => <StaticPathRedirect to="/finance/online-mortgage-payment-calculator" />}</Route>
      <Route path="/finance/online-mortgage-payment-calculator">{() => <LazyWrap><MortgagePaymentCalculator /></LazyWrap>}</Route>
      <Route path="/conversion/length-converter">{() => <LazyWrap><LengthConverter /></LazyWrap>}</Route>
      <Route path="/conversion/online-length-converter">{() => <LazyWrap><LengthConverter /></LazyWrap>}</Route>
      <Route path="/time-date/date-difference-calculator">{() => <LazyWrap><DateDifferenceCalculator /></LazyWrap>}</Route>
      <Route path="/construction/concrete-calculator">{() => <LazyWrap><ConcreteCalculator /></LazyWrap>}</Route>
      <Route path="/construction/brick-calculator">{() => <LazyWrap><BrickCalculator /></LazyWrap>}</Route>
      <Route path="/construction/rebar-calculator">{() => <LazyWrap><RebarCalculator /></LazyWrap>}</Route>
      <Route path="/tools/rebar-calculator">{() => <LazyWrap><RebarCalculator /></LazyWrap>}</Route>
      <Route path="/construction/drywall-calculator">{() => <LazyWrap><DrywallCalculator /></LazyWrap>}</Route>
      <Route path="/tools/drywall-calculator">{() => <LazyWrap><DrywallCalculator /></LazyWrap>}</Route>
      <Route path="/construction/wallpaper-calculator">{() => <LazyWrap><WallpaperCalculator /></LazyWrap>}</Route>
      <Route path="/tools/wallpaper-calculator">{() => <LazyWrap><WallpaperCalculator /></LazyWrap>}</Route>
      <Route path="/construction/mulch-calculator">{() => <LazyWrap><MulchCalculator /></LazyWrap>}</Route>
      <Route path="/tools/mulch-calculator">{() => <LazyWrap><MulchCalculator /></LazyWrap>}</Route>
      <Route path="/construction/soil-calculator">{() => <LazyWrap><SoilCalculator /></LazyWrap>}</Route>
      <Route path="/tools/soil-calculator">{() => <LazyWrap><SoilCalculator /></LazyWrap>}</Route>
      <Route path="/construction/cement-calculator">{() => <LazyWrap><CementCalculator /></LazyWrap>}</Route>
      <Route path="/construction/paint-calculator">{() => <LazyWrap><PaintCalculator /></LazyWrap>}</Route>
      <Route path="/tools/paint-calculator">{() => <LazyWrap><PaintCalculator /></LazyWrap>}</Route>
      <Route path="/construction/steel-weight-calculator">{() => <LazyWrap><SteelWeightCalculator /></LazyWrap>}</Route>
      <Route path="/tools/steel-weight-calculator">{() => <LazyWrap><SteelWeightCalculator /></LazyWrap>}</Route>
      <Route path="/construction/tile-calculator">{() => <LazyWrap><TileCalculator /></LazyWrap>}</Route>
      <Route path="/tools/tile-calculator">{() => <LazyWrap><TileCalculator /></LazyWrap>}</Route>
      <Route path="/construction/flooring-calculator">{() => <LazyWrap><FlooringCalculator /></LazyWrap>}</Route>
      <Route path="/tools/flooring-calculator">{() => <LazyWrap><FlooringCalculator /></LazyWrap>}</Route>
      <Route path="/construction/room-area-calculator">{() => <LazyWrap><RoomAreaCalculator /></LazyWrap>}</Route>
      <Route path="/tools/room-area-calculator">{() => <LazyWrap><RoomAreaCalculator /></LazyWrap>}</Route>
      <Route path="/construction/roof-area-calculator">{() => <LazyWrap><RoofAreaCalculator /></LazyWrap>}</Route>
      <Route path="/tools/roof-area-calculator">{() => <LazyWrap><RoofAreaCalculator /></LazyWrap>}</Route>
      <Route path="/construction/water-tank-calculator">{() => <LazyWrap><WaterTankCalculator /></LazyWrap>}</Route>
      <Route path="/tools/water-tank-calculator">{() => <LazyWrap><WaterTankCalculator /></LazyWrap>}</Route>
      <Route path="/construction/gravel-calculator">{() => <LazyWrap><GravelCalculator /></LazyWrap>}</Route>
      <Route path="/tools/gravel-calculator">{() => <LazyWrap><GravelCalculator /></LazyWrap>}</Route>
      <Route path="/construction/fence-length-calculator">{() => <LazyWrap><FenceLengthCalculator /></LazyWrap>}</Route>
      <Route path="/tools/fence-length-calculator">{() => <LazyWrap><FenceLengthCalculator /></LazyWrap>}</Route>
      <Route path="/construction/lumber-calculator">{() => <LazyWrap><LumberCalculator /></LazyWrap>}</Route>
      <Route path="/tools/lumber-calculator">{() => <LazyWrap><LumberCalculator /></LazyWrap>}</Route>
      <Route path="/construction/wall-area-calculator">{() => <LazyWrap><WallAreaCalculator /></LazyWrap>}</Route>
      <Route path="/tools/wall-area-calculator">{() => <LazyWrap><WallAreaCalculator /></LazyWrap>}</Route>
      <Route path="/construction/pipe-volume-calculator">{() => <LazyWrap><PipeVolumeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/pipe-volume-calculator">{() => <LazyWrap><PipeVolumeCalculator /></LazyWrap>}</Route>
      <Route path="/construction/sand-calculator">{() => <LazyWrap><SandCalculator /></LazyWrap>}</Route>
      <Route path="/tools/sand-calculator">{() => <LazyWrap><SandCalculator /></LazyWrap>}</Route>
      <Route path="/construction/excavation-calculator">{() => <LazyWrap><ExcavationCalculator /></LazyWrap>}</Route>
      <Route path="/tools/excavation-calculator">{() => <LazyWrap><ExcavationCalculator /></LazyWrap>}</Route>
      <Route path="/construction/stair-calculator">{() => <LazyWrap><StairCalculator /></LazyWrap>}</Route>
      <Route path="/tools/stair-calculator">{() => <LazyWrap><StairCalculator /></LazyWrap>}</Route>
      <Route path="/construction/material-cost-calculator">{() => <LazyWrap><MaterialCostCalculator /></LazyWrap>}</Route>
      <Route path="/tools/material-cost-calculator">{() => <LazyWrap><MaterialCostCalculator /></LazyWrap>}</Route>
      <Route path="/construction/deck-area-calculator">{() => <LazyWrap><DeckAreaCalculator /></LazyWrap>}</Route>
      <Route path="/tools/deck-area-calculator">{() => <LazyWrap><DeckAreaCalculator /></LazyWrap>}</Route>
      <Route path="/construction/plaster-calculator">{() => <LazyWrap><PlasterCalculator /></LazyWrap>}</Route>
      <Route path="/tools/plaster-calculator">{() => <LazyWrap><PlasterCalculator /></LazyWrap>}</Route>
      <Route path="/construction/asphalt-calculator">{() => <LazyWrap><AsphaltCalculator /></LazyWrap>}</Route>
      <Route path="/tools/asphalt-calculator">{() => <LazyWrap><AsphaltCalculator /></LazyWrap>}</Route>
      <Route path="/construction/insulation-calculator">{() => <LazyWrap><InsulationCalculator /></LazyWrap>}</Route>
      <Route path="/tools/insulation-calculator">{() => <LazyWrap><InsulationCalculator /></LazyWrap>}</Route>
      <Route path="/construction/concrete-block-calculator">{() => <LazyWrap><ConcreteBlockCalculator /></LazyWrap>}</Route>
      <Route path="/tools/concrete-block-calculator">{() => <LazyWrap><ConcreteBlockCalculator /></LazyWrap>}</Route>
      <Route path="/construction/paver-calculator">{() => <LazyWrap><PaverCalculator /></LazyWrap>}</Route>
      <Route path="/tools/paver-calculator">{() => <LazyWrap><PaverCalculator /></LazyWrap>}</Route>
      <Route path="/construction/bitumen-calculator">{() => <LazyWrap><BitumenCalculator /></LazyWrap>}</Route>
      <Route path="/tools/bitumen-calculator">{() => <LazyWrap><BitumenCalculator /></LazyWrap>}</Route>
      <Route path="/construction/pool-salt-calculator">{() => <LazyWrap><PoolSaltCalculator /></LazyWrap>}</Route>
      <Route path="/tools/pool-salt-calculator">{() => <LazyWrap><PoolSaltCalculator /></LazyWrap>}</Route>
      <Route path="/construction/electrical-load-calculator">{() => <LazyWrap><ElectricalLoadCalculator /></LazyWrap>}</Route>
      <Route path="/tools/electrical-load-calculator">{() => <LazyWrap><ElectricalLoadCalculator /></LazyWrap>}</Route>
      <Route path="/construction/solar-panel-calculator">{() => <LazyWrap><SolarPanelCalculator /></LazyWrap>}</Route>
      <Route path="/tools/solar-panel-calculator">{() => <LazyWrap><SolarPanelCalculator /></LazyWrap>}</Route>
      <Route path="/tools/cement-calculator">{() => <LazyWrap><CementCalculator /></LazyWrap>}</Route>
      <Route path="/tools/brick-calculator">{() => <LazyWrap><BrickCalculator /></LazyWrap>}</Route>
      <Route path="/finance/salary-calculator">{() => <StaticPathRedirect to="/finance/online-salary-calculator" />}</Route>
      <Route path="/finance/online-salary-calculator">{() => <LazyWrap><SalaryCalculator /></LazyWrap>}</Route>
      <Route path="/health/body-fat-calculator">{() => <LazyWrap><BodyFatCalculator /></LazyWrap>}</Route>
      <Route path="/css-design/hex-to-rgb-converter">{() => <LazyWrap><HexToRgbConverter /></LazyWrap>}</Route>
      <Route path="/tools/hex-to-rgb-converter">{() => <LazyWrap><HexToRgbConverter /></LazyWrap>}</Route>
      <Route path="/css-design/rgb-to-hex-converter">{() => <LazyWrap><RgbToHexConverter /></LazyWrap>}</Route>
      <Route path="/tools/rgb-to-hex-converter">{() => <LazyWrap><RgbToHexConverter /></LazyWrap>}</Route>
      <Route path="/finance/roi-calculator">{() => <StaticPathRedirect to="/finance/online-roi-calculator" />}</Route>
      <Route path="/finance/online-roi-calculator">{() => <LazyWrap><RoiCalculator /></LazyWrap>}</Route>
      <Route path="/math/average-calculator">{() => <LazyWrap><AverageCalculator /></LazyWrap>}</Route>
      <Route path="/conversion/weight-converter">{() => <LazyWrap><WeightConverter /></LazyWrap>}</Route>
      <Route path="/conversion/online-weight-converter">{() => <LazyWrap><WeightConverter /></LazyWrap>}</Route>
      <Route path="/finance/tax-calculator">{() => <StaticPathRedirect to="/finance/online-tax-calculator" />}</Route>
      <Route path="/finance/online-tax-calculator">{() => <LazyWrap><TaxCalculator /></LazyWrap>}</Route>
      <Route path="/conversion/binary-to-decimal-converter">{() => <LazyWrap><BinaryToDecimalConverter /></LazyWrap>}</Route>
      <Route path="/conversion/online-binary-to-decimal-converter">{() => <LazyWrap><BinaryToDecimalConverter /></LazyWrap>}</Route>
      <Route path="/math/standard-deviation-calculator">{() => <StaticPathRedirect to="/math/online-standard-deviation-calculator" />}</Route>
      <Route path="/math/online-standard-deviation-calculator">{() => <LazyWrap><StandardDeviationCalculator /></LazyWrap>}</Route>
      <Route path="/finance/car-loan-calculator">{() => <StaticPathRedirect to="/finance/online-car-loan-calculator" />}</Route>
      <Route path="/finance/online-car-loan-calculator">{() => <LazyWrap><CarLoanCalculator /></LazyWrap>}</Route>
      <Route path="/finance/savings-calculator">{() => <LazyWrap><SavingsCalculator /></LazyWrap>}</Route>
      <Route path="/finance/profit-margin-calculator">{() => <LazyWrap><ProfitMarginCalculator /></LazyWrap>}</Route>
      <Route path="/finance/cagr-calculator">{() => <StaticPathRedirect to="/finance/online-cagr-calculator" />}</Route>
      <Route path="/tools/cagr-calculator">{() => <StaticPathRedirect to="/finance/online-cagr-calculator" />}</Route>
      <Route path="/finance/online-cagr-calculator">{() => <LazyWrap><CagrCalculator /></LazyWrap>}</Route>
      <Route path="/finance/debt-to-income-calculator">{() => <StaticPathRedirect to="/finance/online-debt-to-income-calculator" />}</Route>
      <Route path="/tools/debt-to-income-calculator">{() => <StaticPathRedirect to="/finance/online-debt-to-income-calculator" />}</Route>
      <Route path="/finance/online-debt-to-income-calculator">{() => <LazyWrap><DebtToIncomeCalculator /></LazyWrap>}</Route>
      <Route path="/finance/loan-to-value-calculator">{() => <StaticPathRedirect to="/finance/online-loan-to-value-calculator" />}</Route>
      <Route path="/tools/loan-to-value-calculator">{() => <StaticPathRedirect to="/finance/online-loan-to-value-calculator" />}</Route>
      <Route path="/finance/online-loan-to-value-calculator">{() => <LazyWrap><LoanToValueCalculator /></LazyWrap>}</Route>
      <Route path="/finance/inflation-calculator">{() => <StaticPathRedirect to="/finance/online-inflation-calculator" />}</Route>
      <Route path="/finance/online-inflation-calculator">{() => <LazyWrap><InflationCalculator /></LazyWrap>}</Route>
      <Route path="/conversion/area-converter">{() => <LazyWrap><AreaConverter /></LazyWrap>}</Route>
      <Route path="/conversion/online-area-converter">{() => <LazyWrap><AreaConverter /></LazyWrap>}</Route>
      <Route path="/conversion/volume-converter">{() => <LazyWrap><VolumeConverter /></LazyWrap>}</Route>
      <Route path="/conversion/online-volume-converter">{() => <LazyWrap><VolumeConverter /></LazyWrap>}</Route>
      <Route path="/conversion/speed-converter">{() => <LazyWrap><SpeedConverter /></LazyWrap>}</Route>
      <Route path="/conversion/online-speed-converter">{() => <LazyWrap><SpeedConverter /></LazyWrap>}</Route>
      <Route path="/math/percentage-change-calculator">{() => <StaticPathRedirect to="/math/percentage-calculator#calculator" />}</Route>
      <Route path="/math/percentage-increase-calculator">{() => <StaticPathRedirect to="/math/percentage-calculator#calculator" />}</Route>
      <Route path="/math/percentage-decrease-calculator">{() => <StaticPathRedirect to="/math/percentage-calculator#calculator" />}</Route>
      <Route path="/math/percentage-difference-calculator">{() => <StaticPathRedirect to="/math/percentage-calculator#calculator" />}</Route>
      <Route path="/math/fraction-to-decimal-calculator">{() => <LazyWrap><FractionToDecimalCalculator /></LazyWrap>}</Route>
      <Route path="/math/decimal-to-fraction-calculator">{() => <LazyWrap><DecimalToFractionCalculator /></LazyWrap>}</Route>
      <Route path="/math/scientific-calculator">{() => <StaticPathRedirect to="/math/online-scientific-calculator" />}</Route>
      <Route path="/math/online-scientific-calculator">{() => <LazyWrap><ScientificCalculator /></LazyWrap>}</Route>
      <Route path="/health/calorie-calculator">{() => <LazyWrap><CalorieCalculator /></LazyWrap>}</Route>
      <Route path="/health/body-surface-area-calculator">{() => <StaticPathRedirect to="/health/online-body-surface-area-calculator" />}</Route>
      <Route path="/tools/body-surface-area-calculator">{() => <StaticPathRedirect to="/health/online-body-surface-area-calculator" />}</Route>
      <Route path="/health/online-body-surface-area-calculator">{() => <LazyWrap><BodySurfaceAreaCalculator /></LazyWrap>}</Route>
      <Route path="/math/ratio-calculator">{() => <LazyWrap><RatioCalculator /></LazyWrap>}</Route>
      <Route path="/math/square-root-calculator">{() => <LazyWrap><SquareRootCalculator /></LazyWrap>}</Route>
      <Route path="/math/cube-root-calculator">{() => <LazyWrap><CubeRootCalculator /></LazyWrap>}</Route>
      <Route path="/math/power-calculator">{() => <LazyWrap><PowerCalculator /></LazyWrap>}</Route>
      <Route path="/math/logarithm-calculator">{() => <LazyWrap><LogarithmCalculator /></LazyWrap>}</Route>
      <Route path="/math/factorial-calculator">{() => <LazyWrap><FactorialCalculator /></LazyWrap>}</Route>
      <Route path="/math/prime-number-checker">{() => <LazyWrap><PrimeNumberChecker /></LazyWrap>}</Route>
      <Route path="/math/lcm-calculator">{() => <StaticPathRedirect to="/math/online-lcm-calculator" />}</Route>
      <Route path="/math/online-lcm-calculator">{() => <LazyWrap><LcmCalculator /></LazyWrap>}</Route>
      <Route path="/math/gcd-calculator">{() => <StaticPathRedirect to="/math/online-gcd-calculator" />}</Route>
      <Route path="/math/online-gcd-calculator">{() => <LazyWrap><GcdCalculator /></LazyWrap>}</Route>
      <Route path="/math/mean-median-mode-calculator">{() => <LazyWrap><MeanMedianModeCalculator /></LazyWrap>}</Route>
      <Route path="/math/rounding-numbers-calculator">{() => <LazyWrap><RoundingNumbersCalculator /></LazyWrap>}</Route>
      <Route path="/math/exponents-calculator">{() => <LazyWrap><ExponentsCalculator /></LazyWrap>}</Route>
      <Route path="/math/variance-calculator">{() => <LazyWrap><VarianceCalculator /></LazyWrap>}</Route>
      <Route path="/math/number-sequence-generator">{() => <LazyWrap><NumberSequenceGenerator /></LazyWrap>}</Route>
      <Route path="/math/divisibility-checker">{() => <LazyWrap><DivisibilityChecker /></LazyWrap>}</Route>
      <Route path="/math/modulo-calculator">{() => <LazyWrap><ModuloCalculator /></LazyWrap>}</Route>
      <Route path="/math/proportion-calculator">{() => <LazyWrap><ProportionCalculator /></LazyWrap>}</Route>
      <Route path="/math/matrix-calculator">{() => <StaticPathRedirect to="/math/online-matrix-calculator" />}</Route>
      <Route path="/math/online-matrix-calculator">{() => <LazyWrap><MatrixCalculator /></LazyWrap>}</Route>
      <Route path="/math/quadratic-equation-solver">{() => <StaticPathRedirect to="/math/online-quadratic-equation-solver" />}</Route>
      <Route path="/math/online-quadratic-equation-solver">{() => <LazyWrap><QuadraticEquationSolver /></LazyWrap>}</Route>
      <Route path="/math/permutation-calculator">{() => <LazyWrap><PermutationCalculator /></LazyWrap>}</Route>
      <Route path="/math/combination-calculator">{() => <LazyWrap><CombinationCalculator /></LazyWrap>}</Route>
      <Route path="/finance/markup-calculator">{() => <LazyWrap><MarkupCalculator /></LazyWrap>}</Route>
      <Route path="/tools/markup-calculator">{() => <LazyWrap><MarkupCalculator /></LazyWrap>}</Route>
      <Route path="/finance/break-even-calculator">{() => <LazyWrap><BreakEvenCalculator /></LazyWrap>}</Route>
      <Route path="/tools/break-even-calculator">{() => <LazyWrap><BreakEvenCalculator /></LazyWrap>}</Route>
      <Route path="/finance/payback-period-calculator">{() => <LazyWrap><PaybackPeriodCalculator /></LazyWrap>}</Route>
      <Route path="/tools/payback-period-calculator">{() => <LazyWrap><PaybackPeriodCalculator /></LazyWrap>}</Route>
      <Route path="/finance/loan-interest-calculator">{() => <LazyWrap><LoanInterestCalculator /></LazyWrap>}</Route>
      <Route path="/tools/loan-interest-calculator">{() => <LazyWrap><LoanInterestCalculator /></LazyWrap>}</Route>
      <Route path="/finance/savings-goal-calculator">{() => <LazyWrap><SavingsGoalCalculator /></LazyWrap>}</Route>
      <Route path="/tools/savings-goal-calculator">{() => <LazyWrap><SavingsGoalCalculator /></LazyWrap>}</Route>
      <Route path="/finance/revenue-calculator">{() => <LazyWrap><RevenueCalculator /></LazyWrap>}</Route>
      <Route path="/tools/revenue-calculator">{() => <LazyWrap><RevenueCalculator /></LazyWrap>}</Route>
      <Route path="/finance/cost-split-calculator">{() => <LazyWrap><CostSplitCalculator /></LazyWrap>}</Route>
      <Route path="/tools/cost-split-calculator">{() => <LazyWrap><CostSplitCalculator /></LazyWrap>}</Route>
      <Route path="/finance/depreciation-calculator">{() => <LazyWrap><DepreciationCalculator /></LazyWrap>}</Route>
      <Route path="/tools/depreciation-calculator">{() => <LazyWrap><DepreciationCalculator /></LazyWrap>}</Route>
      <Route path="/finance/net-worth-calculator">{() => <LazyWrap><NetWorthCalculator /></LazyWrap>}</Route>
      <Route path="/tools/net-worth-calculator">{() => <LazyWrap><NetWorthCalculator /></LazyWrap>}</Route>
      <Route path="/finance/retirement-calculator">{() => <StaticPathRedirect to="/finance/online-retirement-calculator" />}</Route>
      <Route path="/finance/online-retirement-calculator">{() => <LazyWrap><RetirementCalculator /></LazyWrap>}</Route>
      <Route path="/tools/retirement-calculator">{() => <StaticPathRedirect to="/finance/online-retirement-calculator" />}</Route>
      <Route path="/finance/credit-card-payoff-calculator">{() => <LazyWrap><CreditCardPayoffCalculator /></LazyWrap>}</Route>
      <Route path="/tools/credit-card-payoff-calculator">{() => <LazyWrap><CreditCardPayoffCalculator /></LazyWrap>}</Route>
      <Route path="/finance/down-payment-calculator">{() => <LazyWrap><DownPaymentCalculator /></LazyWrap>}</Route>
      <Route path="/tools/down-payment-calculator">{() => <LazyWrap><DownPaymentCalculator /></LazyWrap>}</Route>
      <Route path="/finance/amortization-calculator">{() => <LazyWrap><AmortizationCalculator /></LazyWrap>}</Route>
      <Route path="/finance/online-amortization-calculator">{() => <LazyWrap><AmortizationCalculator /></LazyWrap>}</Route>
      <Route path="/tools/amortization-calculator">{() => <LazyWrap><AmortizationCalculator /></LazyWrap>}</Route>
      <Route path="/finance/stock-profit-calculator">{() => <LazyWrap><StockProfitCalculator /></LazyWrap>}</Route>
      <Route path="/tools/stock-profit-calculator">{() => <LazyWrap><StockProfitCalculator /></LazyWrap>}</Route>
      <Route path="/finance/dividend-calculator">{() => <LazyWrap><DividendCalculator /></LazyWrap>}</Route>
      <Route path="/tools/dividend-calculator">{() => <LazyWrap><DividendCalculator /></LazyWrap>}</Route>
      <Route path="/finance/currency-exchange-calculator">{() => <LazyWrap><CurrencyExchangeCalculator /></LazyWrap>}</Route>
      <Route path="/finance/online-currency-exchange-calculator">{() => <LazyWrap><CurrencyExchangeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/currency-exchange-calculator">{() => <LazyWrap><CurrencyExchangeCalculator /></LazyWrap>}</Route>
      <Route path="/finance/hourly-to-salary-calculator">{() => <LazyWrap><HourlyToSalaryCalculator /></LazyWrap>}</Route>
      <Route path="/tools/hourly-to-salary-calculator">{() => <LazyWrap><HourlyToSalaryCalculator /></LazyWrap>}</Route>
      <Route path="/conversion/decimal-to-binary-converter">{() => <LazyWrap><DecimalToBinaryConverter /></LazyWrap>}</Route>
      <Route path="/tools/decimal-to-binary-converter">{() => <LazyWrap><DecimalToBinaryConverter /></LazyWrap>}</Route>
      <Route path="/conversion/hex-to-decimal-converter">{() => <LazyWrap><HexToDecimalConverter /></LazyWrap>}</Route>
      <Route path="/tools/hex-to-decimal-converter">{() => <LazyWrap><HexToDecimalConverter /></LazyWrap>}</Route>
      <Route path="/conversion/roman-numeral-converter">{() => <LazyWrap><RomanNumeralConverter /></LazyWrap>}</Route>
      <Route path="/conversion/online-roman-numeral-converter">{() => <LazyWrap><RomanNumeralConverter /></LazyWrap>}</Route>
      <Route path="/tools/roman-numeral-converter">{() => <LazyWrap><RomanNumeralConverter /></LazyWrap>}</Route>
      <Route path="/conversion/data-storage-converter">{() => <LazyWrap><DataStorageConverter /></LazyWrap>}</Route>
      <Route path="/tools/data-storage-converter">{() => <LazyWrap><DataStorageConverter /></LazyWrap>}</Route>
      <Route path="/conversion/energy-converter">{() => <LazyWrap><EnergyConverter /></LazyWrap>}</Route>
      <Route path="/tools/energy-converter">{() => <LazyWrap><EnergyConverter /></LazyWrap>}</Route>
      <Route path="/conversion/pressure-converter">{() => <LazyWrap><PressureConverter /></LazyWrap>}</Route>
      <Route path="/tools/pressure-converter">{() => <LazyWrap><PressureConverter /></LazyWrap>}</Route>
      <Route path="/conversion/time-converter">{() => <LazyWrap><TimeConverter /></LazyWrap>}</Route>
      <Route path="/tools/time-converter">{() => <LazyWrap><TimeConverter /></LazyWrap>}</Route>
      <Route path="/conversion/angle-converter">{() => <LazyWrap><AngleConverter /></LazyWrap>}</Route>
      <Route path="/tools/angle-converter">{() => <LazyWrap><AngleConverter /></LazyWrap>}</Route>
      <Route path="/conversion/frequency-converter">{() => <LazyWrap><FrequencyConverter /></LazyWrap>}</Route>
      <Route path="/tools/frequency-converter">{() => <LazyWrap><FrequencyConverter /></LazyWrap>}</Route>
      <Route path="/conversion/fuel-efficiency-converter">{() => <LazyWrap><FuelEfficiencyConverter /></LazyWrap>}</Route>
      <Route path="/tools/fuel-efficiency-converter">{() => <LazyWrap><FuelEfficiencyConverter /></LazyWrap>}</Route>
      <Route path="/conversion/number-to-words-converter">{() => <LazyWrap><NumberToWordsConverter /></LazyWrap>}</Route>
      <Route path="/tools/number-to-words-converter">{() => <LazyWrap><NumberToWordsConverter /></LazyWrap>}</Route>
      <Route path="/conversion/words-to-number-converter">{() => <LazyWrap><WordsToNumberConverter /></LazyWrap>}</Route>
      <Route path="/tools/words-to-number-converter">{() => <LazyWrap><WordsToNumberConverter /></LazyWrap>}</Route>
      <Route path="/conversion/base-converter">{() => <LazyWrap><BaseConverter /></LazyWrap>}</Route>
      <Route path="/tools/base-converter">{() => <LazyWrap><BaseConverter /></LazyWrap>}</Route>
      <Route path="/conversion/binary-to-hex-converter">{() => <LazyWrap><BinaryToHexConverter /></LazyWrap>}</Route>
      <Route path="/tools/binary-to-hex-converter">{() => <LazyWrap><BinaryToHexConverter /></LazyWrap>}</Route>
      <Route path="/conversion/hex-to-binary-converter">{() => <LazyWrap><BinaryToHexConverter /></LazyWrap>}</Route>
      <Route path="/tools/hex-to-binary-converter">{() => <LazyWrap><BinaryToHexConverter /></LazyWrap>}</Route>
      <Route path="/conversion/octal-converter">{() => <LazyWrap><OctalConverter /></LazyWrap>}</Route>
      <Route path="/tools/octal-converter">{() => <LazyWrap><OctalConverter /></LazyWrap>}</Route>
      <Route path="/conversion/unit-price-converter">{() => <LazyWrap><UnitPriceConverter /></LazyWrap>}</Route>
      <Route path="/tools/unit-price-converter">{() => <LazyWrap><UnitPriceConverter /></LazyWrap>}</Route>
      <Route path="/conversion/density-converter">{() => <LazyWrap><DensityConverter /></LazyWrap>}</Route>
      <Route path="/tools/density-converter">{() => <LazyWrap><DensityConverter /></LazyWrap>}</Route>
      <Route path="/conversion/power-converter">{() => <LazyWrap><PowerConverter /></LazyWrap>}</Route>
      <Route path="/tools/power-converter">{() => <LazyWrap><PowerConverter /></LazyWrap>}</Route>
      <Route path="/conversion/torque-converter">{() => <LazyWrap><TorqueConverter /></LazyWrap>}</Route>
      <Route path="/tools/torque-converter">{() => <LazyWrap><TorqueConverter /></LazyWrap>}</Route>
      <Route path="/conversion/force-converter">{() => <LazyWrap><ForceConverter /></LazyWrap>}</Route>
      <Route path="/tools/force-converter">{() => <LazyWrap><ForceConverter /></LazyWrap>}</Route>
      <Route path="/conversion/electric-current-converter">{() => <LazyWrap><ElectricCurrentConverter /></LazyWrap>}</Route>
      <Route path="/tools/electric-current-converter">{() => <LazyWrap><ElectricCurrentConverter /></LazyWrap>}</Route>
      <Route path="/conversion/shoe-size-converter">{() => <LazyWrap><ShoeSizeConverter /></LazyWrap>}</Route>
      <Route path="/conversion/online-shoe-size-converter">{() => <LazyWrap><ShoeSizeConverter /></LazyWrap>}</Route>
      <Route path="/tools/shoe-size-converter">{() => <LazyWrap><ShoeSizeConverter /></LazyWrap>}</Route>
      <Route path="/conversion/cooking-converter">{() => <LazyWrap><CookingConverter /></LazyWrap>}</Route>
      <Route path="/conversion/online-cooking-converter">{() => <LazyWrap><CookingConverter /></LazyWrap>}</Route>
      <Route path="/tools/cooking-converter">{() => <LazyWrap><CookingConverter /></LazyWrap>}</Route>

      {/* Image tools */}
      <Route path="/image/image-resizer">{() => <StaticPathRedirect to="/image/online-image-resizer" />}</Route>
      <Route path="/tools/image-resizer">{() => <StaticPathRedirect to="/image/online-image-resizer" />}</Route>
      <Route path="/image/online-image-resizer">{() => <LazyWrap><ImageResizer /></LazyWrap>}</Route>

      <Route path="/image/image-compressor">{() => <StaticPathRedirect to="/image/online-image-compressor" />}</Route>
      <Route path="/tools/image-compressor">{() => <StaticPathRedirect to="/image/online-image-compressor" />}</Route>
      <Route path="/image/online-image-compressor">{() => <LazyWrap><ImageCompressor /></LazyWrap>}</Route>

      <Route path="/image/image-cropper">{() => <StaticPathRedirect to="/image/online-image-cropper" />}</Route>
      <Route path="/tools/image-cropper">{() => <StaticPathRedirect to="/image/online-image-cropper" />}</Route>
      <Route path="/image/online-image-cropper">{() => <LazyWrap><ImageCropper /></LazyWrap>}</Route>
      <Route path="/image/image-format-converter">{() => <LazyWrap><ImageFormatConverter /></LazyWrap>}</Route>
      <Route path="/tools/image-format-converter">{() => <LazyWrap><ImageFormatConverter /></LazyWrap>}</Route>
      <Route path="/image/image-to-base64">{() => <LazyWrap><ImageToBase64 /></LazyWrap>}</Route>
      <Route path="/tools/image-to-base64">{() => <LazyWrap><ImageToBase64 /></LazyWrap>}</Route>
      <Route path="/image/base64-to-image">{() => <StaticPathRedirect to="/image/online-base64-to-image" />}</Route>
      <Route path="/tools/base64-to-image">{() => <StaticPathRedirect to="/image/online-base64-to-image" />}</Route>
      <Route path="/image/online-base64-to-image">{() => <LazyWrap><Base64ToImage /></LazyWrap>}</Route>

      <Route path="/image/qr-code-generator">{() => <StaticPathRedirect to="/image/online-qr-code-generator" />}</Route>
      <Route path="/tools/qr-code-generator">{() => <StaticPathRedirect to="/image/online-qr-code-generator" />}</Route>
      <Route path="/image/online-qr-code-generator">{() => <LazyWrap><QrCodeGeneratorPage /></LazyWrap>}</Route>
      <Route path="/image/:slug">{() => <LazyWrap><ImageCategoryToolPage /></LazyWrap>}</Route>

      {/* PDF tools */}
      <Route path="/pdf/:slug">{() => <LazyWrap><PdfToolSuite /></LazyWrap>}</Route>
      <Route path="/tools/pdf-merge">{() => <StaticPathRedirect to="/pdf/online-pdf-merge" />}</Route>
      <Route path="/tools/pdf-split">{() => <StaticPathRedirect to="/pdf/online-pdf-split" />}</Route>
      <Route path="/tools/pdf-compress">{() => <StaticPathRedirect to="/pdf/online-pdf-compress" />}</Route>
      <Route path="/tools/image-to-pdf">{() => <StaticPathRedirect to="/pdf/online-image-to-pdf" />}</Route>
      <Route path="/tools/jpg-to-pdf">{() => <StaticPathRedirect to="/pdf/online-jpg-to-pdf" />}</Route>
      <Route path="/tools/pdf-to-image">{() => <StaticPathRedirect to="/pdf/online-pdf-to-image" />}</Route>
      <Route path="/tools/pdf-rotate">{() => <StaticPathRedirect to="/pdf/online-pdf-rotate" />}</Route>
      <Route path="/tools/pdf-page-remover">{() => <StaticPathRedirect to="/pdf/online-pdf-page-remover" />}</Route>
      <Route path="/tools/pdf-page-reorder">{() => <StaticPathRedirect to="/pdf/online-pdf-page-reorder" />}</Route>
      <Route path="/tools/pdf-watermark">{() => <StaticPathRedirect to="/pdf/online-pdf-watermark" />}</Route>
      <Route path="/tools/pdf-password-protect">{() => <StaticPathRedirect to="/pdf/online-pdf-password-protect" />}</Route>
      <Route path="/tools/pdf-unlock">{() => <StaticPathRedirect to="/pdf/online-pdf-unlock" />}</Route>
      <Route path="/tools/pdf-to-text">{() => <StaticPathRedirect to="/pdf/online-pdf-to-text" />}</Route>
      <Route path="/tools/pdf-page-number">{() => <StaticPathRedirect to="/pdf/online-pdf-page-number" />}</Route>
      <Route path="/tools/pdf-header-footer">{() => <StaticPathRedirect to="/pdf/online-pdf-header-footer" />}</Route>
      <Route path="/tools/pdf-sign">{() => <StaticPathRedirect to="/pdf/online-pdf-sign" />}</Route>

      {/* Pair 14 routes */}
      <Route path="/health/cycling-calories-calculator">{() => <LazyWrap><CyclingCaloriesCalculator /></LazyWrap>}</Route>
      <Route path="/tools/cycling-calories-calculator">{() => <LazyWrap><CyclingCaloriesCalculator /></LazyWrap>}</Route>
      <Route path="/health/daily-calories-burn-calculator">{() => <LazyWrap><DailyCaloriesBurnCalculator /></LazyWrap>}</Route>
      <Route path="/tools/daily-calories-burn-calculator">{() => <LazyWrap><DailyCaloriesBurnCalculator /></LazyWrap>}</Route>

      {/* Pair 13 routes */}
      <Route path="/health/lean-body-mass-calculator">{() => <LazyWrap><LeanBodyMassCalculator /></LazyWrap>}</Route>
      <Route path="/tools/lean-body-mass-calculator">{() => <LazyWrap><LeanBodyMassCalculator /></LazyWrap>}</Route>
      <Route path="/health/walking-calories-calculator">{() => <LazyWrap><WalkingCaloriesCalculator /></LazyWrap>}</Route>
      <Route path="/tools/walking-calories-calculator">{() => <LazyWrap><WalkingCaloriesCalculator /></LazyWrap>}</Route>

      {/* Pair 12 routes */}
      <Route path="/health/dog-age-calculator">{() => <LazyWrap><DogAgeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/dog-age-calculator">{() => <LazyWrap><DogAgeCalculator /></LazyWrap>}</Route>
      <Route path="/health/cat-age-calculator">{() => <LazyWrap><CatAgeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/cat-age-calculator">{() => <LazyWrap><CatAgeCalculator /></LazyWrap>}</Route>

      {/* Pair 11 routes */}
      <Route path="/health/bmr-calculator">{() => <LazyWrap><BmrCalculator /></LazyWrap>}</Route>
      <Route path="/tools/bmr-calculator">{() => <LazyWrap><BmrCalculator /></LazyWrap>}</Route>
      <Route path="/health/calorie-intake-calculator">{() => <LazyWrap><CalorieIntakeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/calorie-intake-calculator">{() => <LazyWrap><CalorieIntakeCalculator /></LazyWrap>}</Route>

      {/* Pair 10 routes */}
      <Route path="/health/calorie-deficit-calculator">{() => <LazyWrap><CalorieDeficitCalculator /></LazyWrap>}</Route>
      <Route path="/tools/calorie-deficit-calculator">{() => <LazyWrap><CalorieDeficitCalculator /></LazyWrap>}</Route>
      <Route path="/health/one-rep-max-calculator">{() => <LazyWrap><OneRepMaxCalculator /></LazyWrap>}</Route>
      <Route path="/tools/one-rep-max-calculator">{() => <LazyWrap><OneRepMaxCalculator /></LazyWrap>}</Route>

      {/* Pair 9 routes */}
      <Route path="/health/heart-rate-calculator">{() => <LazyWrap><HeartRateCalculator /></LazyWrap>}</Route>
      <Route path="/tools/heart-rate-calculator">{() => <LazyWrap><HeartRateCalculator /></LazyWrap>}</Route>
      <Route path="/education/grade-calculator">{() => <LazyWrap><GradeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/grade-calculator">{() => <LazyWrap><GradeCalculator /></LazyWrap>}</Route>

      {/* Pair 8 routes */}
      <Route path="/health/running-pace-calculator">{() => <LazyWrap><RunningPaceCalculator /></LazyWrap>}</Route>
      <Route path="/tools/running-pace-calculator">{() => <LazyWrap><RunningPaceCalculator /></LazyWrap>}</Route>
      <Route path="/health/protein-intake-calculator">{() => <LazyWrap><ProteinIntakeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/protein-intake-calculator">{() => <LazyWrap><ProteinIntakeCalculator /></LazyWrap>}</Route>

      {/* Pair 7 routes */}
      <Route path="/time-date/leap-year-checker">{() => <LazyWrap><LeapYearChecker /></LazyWrap>}</Route>
      <Route path="/tools/leap-year-checker">{() => <LazyWrap><LeapYearChecker /></LazyWrap>}</Route>
      <Route path="/health/macro-nutrient-calculator">{() => <LazyWrap><MacroNutrientCalculator /></LazyWrap>}</Route>
      <Route path="/tools/macro-nutrient-calculator">{() => <LazyWrap><MacroNutrientCalculator /></LazyWrap>}</Route>

      {/* Health tools */}
      <Route path="/health/tdee-calculator">{() => <LazyWrap><TdeeCalculator /></LazyWrap>}</Route>
      <Route path="/health/online-tdee-calculator">{() => <LazyWrap><TdeeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/tdee-calculator">{() => <LazyWrap><TdeeCalculator /></LazyWrap>}</Route>
      <Route path="/health/water-intake-calculator">{() => <LazyWrap><WaterIntakeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/water-intake-calculator">{() => <LazyWrap><WaterIntakeCalculator /></LazyWrap>}</Route>
      <Route path="/health/sleep-calculator">{() => <LazyWrap><SleepCalculator /></LazyWrap>}</Route>
      <Route path="/tools/sleep-calculator">{() => <LazyWrap><SleepCalculator /></LazyWrap>}</Route>
      <Route path="/health/ideal-weight-calculator">{() => <LazyWrap><IdealWeightCalculator /></LazyWrap>}</Route>
      <Route path="/tools/ideal-weight-calculator">{() => <LazyWrap><IdealWeightCalculator /></LazyWrap>}</Route>

      {/* Time & Date tools */}
      <Route path="/time-date/time-duration-calculator">{() => <LazyWrap><TimeDurationCalculator /></LazyWrap>}</Route>
      <Route path="/tools/time-duration-calculator">{() => <LazyWrap><TimeDurationCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/half-birthday-calculator">{() => <LazyWrap><HalfBirthdayCalculator /></LazyWrap>}</Route>
      <Route path="/tools/half-birthday-calculator">{() => <LazyWrap><HalfBirthdayCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/week-number-calculator">{() => <LazyWrap><WeekNumberCalculator /></LazyWrap>}</Route>
      <Route path="/tools/week-number-calculator">{() => <LazyWrap><WeekNumberCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/overtime-calculator">{() => <LazyWrap><OvertimeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/overtime-calculator">{() => <LazyWrap><OvertimeCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/time-addition-calculator">{() => <LazyWrap><TimeAdditionCalculator /></LazyWrap>}</Route>
      <Route path="/tools/time-addition-calculator">{() => <LazyWrap><TimeAdditionCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/time-subtraction-calculator">{() => <LazyWrap><TimeSubtractionCalculator /></LazyWrap>}</Route>
      <Route path="/tools/time-subtraction-calculator">{() => <LazyWrap><TimeSubtractionCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/time-zone-converter">{() => <LazyWrap><TimeZoneConverter /></LazyWrap>}</Route>
      <Route path="/time-date/online-time-zone-converter">{() => <LazyWrap><TimeZoneConverter /></LazyWrap>}</Route>
      <Route path="/tools/time-zone-converter">{() => <LazyWrap><TimeZoneConverter /></LazyWrap>}</Route>
      <Route path="/time-date/stopwatch">{() => <LazyWrap><StopwatchTool /></LazyWrap>}</Route>
      <Route path="/time-date/online-stopwatch">{() => <LazyWrap><StopwatchTool /></LazyWrap>}</Route>
      <Route path="/tools/stopwatch">{() => <LazyWrap><StopwatchTool /></LazyWrap>}</Route>
      <Route path="/time-date/meeting-time-calculator">{() => <LazyWrap><MeetingTimeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/meeting-time-calculator">{() => <LazyWrap><MeetingTimeCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/shift-schedule-calculator">{() => <LazyWrap><ShiftScheduleCalculator /></LazyWrap>}</Route>
      <Route path="/tools/shift-schedule-calculator">{() => <LazyWrap><ShiftScheduleCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/deadline-calculator">{() => <LazyWrap><DeadlineCalculator /></LazyWrap>}</Route>
      <Route path="/tools/deadline-calculator">{() => <LazyWrap><DeadlineCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/study-time-calculator">{() => <LazyWrap><StudyTimeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/study-time-calculator">{() => <LazyWrap><StudyTimeCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/reading-time-calculator">{() => <LazyWrap><ReadingTimeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/reading-time-calculator">{() => <LazyWrap><ReadingTimeCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/event-countdown-timer">{() => <LazyWrap><EventCountdownTimer /></LazyWrap>}</Route>
      <Route path="/tools/event-countdown-timer">{() => <LazyWrap><EventCountdownTimer /></LazyWrap>}</Route>
      <Route path="/time-date/hourly-time-calculator">{() => <LazyWrap><HourlyTimeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/hourly-time-calculator">{() => <LazyWrap><HourlyTimeCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/shift-hours-calculator">{() => <LazyWrap><ShiftHoursCalculator /></LazyWrap>}</Route>
      <Route path="/tools/shift-hours-calculator">{() => <LazyWrap><ShiftHoursCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/time-tracking-calculator">{() => <LazyWrap><TimeTrackingCalculator /></LazyWrap>}</Route>
      <Route path="/tools/time-tracking-calculator">{() => <LazyWrap><TimeTrackingCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/era-calculator">{() => <LazyWrap><EraCalculator /></LazyWrap>}</Route>
      <Route path="/tools/era-calculator">{() => <LazyWrap><EraCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/military-time-converter">{() => <LazyWrap><MilitaryTimeConverter /></LazyWrap>}</Route>
      <Route path="/time-date/online-military-time-converter">{() => <LazyWrap><MilitaryTimeConverter /></LazyWrap>}</Route>
      <Route path="/tools/military-time-converter">{() => <LazyWrap><MilitaryTimeConverter /></LazyWrap>}</Route>
      <Route path="/time-date/zodiac-sign-calculator">{() => <LazyWrap><ZodiacSignCalculator /></LazyWrap>}</Route>
      <Route path="/tools/zodiac-sign-calculator">{() => <LazyWrap><ZodiacSignCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/chinese-zodiac-calculator">{() => <LazyWrap><ChineseZodiacCalculator /></LazyWrap>}</Route>
      <Route path="/tools/chinese-zodiac-calculator">{() => <LazyWrap><ChineseZodiacCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/days-between-dates-calculator">{() => <LazyWrap><DaysBetweenDatesCalculator /></LazyWrap>}</Route>
      <Route path="/tools/days-between-dates-calculator">{() => <LazyWrap><DaysBetweenDatesCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/working-days-calculator">{() => <LazyWrap><WorkingDaysCalculator /></LazyWrap>}</Route>
      <Route path="/tools/working-days-calculator">{() => <LazyWrap><WorkingDaysCalculator /></LazyWrap>}</Route>
      <Route path="/developer/unix-timestamp-converter">{() => <StaticPathRedirect to="/developer/online-unix-timestamp-converter" />}</Route>
      <Route path="/developer/online-unix-timestamp-converter">{() => <LazyWrap><UnixTimestampConverter /></LazyWrap>}</Route>
      <Route path="/time-date/unix-timestamp-converter">{() => <StaticPathRedirect to="/developer/online-unix-timestamp-converter" />}</Route>
      <Route path="/time-date/online-unix-timestamp-converter">{() => <StaticPathRedirect to="/developer/online-unix-timestamp-converter" />}</Route>
      <Route path="/tools/unix-timestamp-converter">{() => <LazyWrap><UnixTimestampConverter /></LazyWrap>}</Route>
      <Route path="/time-date/age-in-days-calculator">{() => <LazyWrap><AgeInDaysCalculator /></LazyWrap>}</Route>
      <Route path="/tools/age-in-days-calculator">{() => <LazyWrap><AgeInDaysCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/retirement-age-calculator">{() => <LazyWrap><RetirementAgeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/retirement-age-calculator">{() => <LazyWrap><RetirementAgeCalculator /></LazyWrap>}</Route>
      <Route path="/health/pregnancy-due-date-calculator">{() => <LazyWrap><PregnancyDueDateCalculator /></LazyWrap>}</Route>
      <Route path="/tools/pregnancy-due-date-calculator">{() => <LazyWrap><PregnancyDueDateCalculator /></LazyWrap>}</Route>
      <Route path="/health/body-type-calculator">{() => <LazyWrap><BodyTypeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/body-type-calculator">{() => <LazyWrap><BodyTypeCalculator /></LazyWrap>}</Route>
      <Route path="/health/ovulation-calculator">{() => <LazyWrap><OvulationCalculator /></LazyWrap>}</Route>
      <Route path="/tools/ovulation-calculator">{() => <LazyWrap><OvulationCalculator /></LazyWrap>}</Route>
      <Route path="/health/fitness-age-calculator">{() => <LazyWrap><FitnessAgeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/fitness-age-calculator">{() => <LazyWrap><FitnessAgeCalculator /></LazyWrap>}</Route>
      <Route path="/health/fat-intake-calculator">{() => <LazyWrap><FatIntakeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/fat-intake-calculator">{() => <LazyWrap><FatIntakeCalculator /></LazyWrap>}</Route>
      <Route path="/health/workout-duration-calculator">{() => <LazyWrap><WorkoutDurationCalculator /></LazyWrap>}</Route>
      <Route path="/tools/workout-duration-calculator">{() => <LazyWrap><WorkoutDurationCalculator /></LazyWrap>}</Route>
      <Route path="/health/step-counter-estimator">{() => <LazyWrap><StepCounterEstimator /></LazyWrap>}</Route>
      <Route path="/tools/step-counter-estimator">{() => <LazyWrap><StepCounterEstimator /></LazyWrap>}</Route>
      <Route path="/health/bac-calculator">{() => <LazyWrap><BacCalculator /></LazyWrap>}</Route>
      <Route path="/tools/bac-calculator">{() => <LazyWrap><BacCalculator /></LazyWrap>}</Route>
      <Route path="/health/waist-to-hip-ratio-calculator">{() => <LazyWrap><WaistToHipRatioCalculator /></LazyWrap>}</Route>
      <Route path="/tools/waist-to-hip-ratio-calculator">{() => <LazyWrap><WaistToHipRatioCalculator /></LazyWrap>}</Route>
      <Route path="/health/keto-calculator">{() => <LazyWrap><KetoCalculator /></LazyWrap>}</Route>
      <Route path="/tools/keto-calculator">{() => <LazyWrap><KetoCalculator /></LazyWrap>}</Route>
      <Route path="/health/intermittent-fasting-calculator">{() => <LazyWrap><IntermittentFastingCalculator /></LazyWrap>}</Route>
      <Route path="/tools/intermittent-fasting-calculator">{() => <LazyWrap><IntermittentFastingCalculator /></LazyWrap>}</Route>
      <Route path="/health/vo2-max-calculator">{() => <LazyWrap><VO2MaxCalculator /></LazyWrap>}</Route>
      <Route path="/tools/vo2-max-calculator">{() => <LazyWrap><VO2MaxCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/countdown-timer">{() => <LazyWrap><CountdownTimer /></LazyWrap>}</Route>
      <Route path="/time-date/online-countdown-timer">{() => <LazyWrap><CountdownTimer /></LazyWrap>}</Route>
      <Route path="/tools/countdown-timer">{() => <LazyWrap><CountdownTimer /></LazyWrap>}</Route>
      <Route path="/time-date/work-hours-calculator">{() => <LazyWrap><WorkHoursCalculator /></LazyWrap>}</Route>
      <Route path="/tools/work-hours-calculator">{() => <LazyWrap><WorkHoursCalculator /></LazyWrap>}</Route>
      <Route path="/time-date/business-days-calculator">{() => <LazyWrap><BusinessDaysCalculator /></LazyWrap>}</Route>
      <Route path="/tools/business-days-calculator">{() => <LazyWrap><BusinessDaysCalculator /></LazyWrap>}</Route>

      {/* Productivity tools */}
      <Route path="/productivity/case-converter">{() => <LazyWrap><CaseConverter /></LazyWrap>}</Route>
      <Route path="/tools/case-converter">{() => <LazyWrap><CaseConverter /></LazyWrap>}</Route>
      <Route path="/productivity/text-reverser">{() => <LazyWrap><TextReverser /></LazyWrap>}</Route>
      <Route path="/tools/text-reverser">{() => <LazyWrap><TextReverser /></LazyWrap>}</Route>
      <Route path="/productivity/random-name-generator">{() => <LazyWrap><RandomNameGenerator /></LazyWrap>}</Route>
      <Route path="/tools/random-name-generator">{() => <LazyWrap><RandomNameGenerator /></LazyWrap>}</Route>
      <Route path="/productivity/coin-flip">{() => <LazyWrap><CoinFlip /></LazyWrap>}</Route>
      <Route path="/tools/coin-flip">{() => <LazyWrap><CoinFlip /></LazyWrap>}</Route>
      <Route path="/productivity/dice-roller">{() => <LazyWrap><DiceRoller /></LazyWrap>}</Route>
      <Route path="/tools/dice-roller">{() => <LazyWrap><DiceRoller /></LazyWrap>}</Route>
      <Route path="/productivity/username-generator">{() => <LazyWrap><UsernameGenerator /></LazyWrap>}</Route>
      <Route path="/tools/username-generator">{() => <LazyWrap><UsernameGenerator /></LazyWrap>}</Route>
      <Route path="/productivity/random-color-generator">{() => <LazyWrap><RandomColorGenerator /></LazyWrap>}</Route>
      <Route path="/tools/random-color-generator">{() => <LazyWrap><RandomColorGenerator /></LazyWrap>}</Route>
      <Route path="/productivity/duplicate-line-remover">{() => <LazyWrap><DuplicateLineRemover /></LazyWrap>}</Route>
      <Route path="/tools/duplicate-line-remover">{() => <LazyWrap><DuplicateLineRemover /></LazyWrap>}</Route>
      <Route path="/productivity/alphabetical-sort">{() => <LazyWrap><AlphabeticalSort /></LazyWrap>}</Route>
      <Route path="/tools/alphabetical-sort">{() => <LazyWrap><AlphabeticalSort /></LazyWrap>}</Route>
      <Route path="/productivity/palindrome-checker">{() => <LazyWrap><PalindromeChecker /></LazyWrap>}</Route>
      <Route path="/tools/palindrome-checker">{() => <LazyWrap><PalindromeChecker /></LazyWrap>}</Route>
      <Route path="/productivity/character-counter-tool">{() => <LazyWrap><CharacterCounterTool /></LazyWrap>}</Route>
      <Route path="/tools/character-counter-tool">{() => <LazyWrap><CharacterCounterTool /></LazyWrap>}</Route>
      <Route path="/productivity/random-letter-generator">{() => <LazyWrap><RandomLetterGenerator /></LazyWrap>}</Route>
      <Route path="/tools/random-letter-generator">{() => <LazyWrap><RandomLetterGenerator /></LazyWrap>}</Route>
      <Route path="/productivity/random-picker-tool">{() => <LazyWrap><RandomPickerTool /></LazyWrap>}</Route>
      <Route path="/tools/random-picker-tool">{() => <LazyWrap><RandomPickerTool /></LazyWrap>}</Route>
      <Route path="/productivity/line-counter-tool">{() => <LazyWrap><LineCounterTool /></LazyWrap>}</Route>
      <Route path="/tools/line-counter-tool">{() => <LazyWrap><LineCounterTool /></LazyWrap>}</Route>
      <Route path="/productivity/remove-extra-spaces-tool">{() => <LazyWrap><RemoveExtraSpacesTool /></LazyWrap>}</Route>
      <Route path="/tools/remove-extra-spaces-tool">{() => <LazyWrap><RemoveExtraSpacesTool /></LazyWrap>}</Route>
      <Route path="/productivity/sort-text-lines-tool">{() => <LazyWrap><SortTextLinesTool /></LazyWrap>}</Route>
      <Route path="/tools/sort-text-lines-tool">{() => <LazyWrap><SortTextLinesTool /></LazyWrap>}</Route>
      <Route path="/productivity/text-formatter-tool">{() => <LazyWrap><TextFormatterTool /></LazyWrap>}</Route>
      <Route path="/tools/text-formatter-tool">{() => <LazyWrap><TextFormatterTool /></LazyWrap>}</Route>
      <Route path="/productivity/spin-wheel-generator">{() => <LazyWrap><SpinWheelGenerator /></LazyWrap>}</Route>
      <Route path="/tools/spin-wheel-generator">{() => <LazyWrap><SpinWheelGenerator /></LazyWrap>}</Route>
      <Route path="/productivity/list-randomizer-tool">{() => <LazyWrap><ListRandomizerTool /></LazyWrap>}</Route>
      <Route path="/tools/list-randomizer-tool">{() => <LazyWrap><ListRandomizerTool /></LazyWrap>}</Route>
      <Route path="/productivity/markdown-previewer">{() => <StaticPathRedirect to="/developer/online-markdown-previewer" />}</Route>
      <Route path="/developer/markdown-previewer">{() => <StaticPathRedirect to="/developer/online-markdown-previewer" />}</Route>
      <Route path="/developer/online-markdown-previewer">{() => <LazyWrap><MarkdownPreviewer /></LazyWrap>}</Route>
      <Route path="/tools/markdown-previewer">{() => <StaticPathRedirect to="/developer/online-markdown-previewer" />}</Route>
      <Route path="/productivity/hashtag-generator">{() => <LazyWrap><HashtagGenerator /></LazyWrap>}</Route>
      <Route path="/tools/hashtag-generator">{() => <LazyWrap><HashtagGenerator /></LazyWrap>}</Route>
      <Route path="/productivity/word-frequency-counter">{() => <LazyWrap><WordFrequencyCounter /></LazyWrap>}</Route>
      <Route path="/tools/word-frequency-counter">{() => <LazyWrap><WordFrequencyCounter /></LazyWrap>}</Route>
      <Route path="/productivity/json-formatter">{() => <LazyWrap><JsonFormatter /></LazyWrap>}</Route>
      <Route path="/productivity/base64-encoder-decoder">{() => <LazyWrap><Base64EncoderDecoder /></LazyWrap>}</Route>
      <Route path="/productivity/uuid-generator">{() => <StaticPathRedirect to="/developer/online-uuid-generator" />}</Route>
      <Route path="/productivity/url-encoder-decoder">{() => <LazyWrap><UrlEncoderDecoder /></LazyWrap>}</Route>

      {/* Developer encoding tools */}
      <Route path="/developer/text-to-binary-converter">{() => <LazyWrap><TextToBinaryConverter /></LazyWrap>}</Route>
      <Route path="/tools/text-to-binary-converter">{() => <LazyWrap><TextToBinaryConverter /></LazyWrap>}</Route>
      <Route path="/security/binary-to-text">{() => <LazyWrap><TextToBinaryConverter /></LazyWrap>}</Route>
      <Route path="/developer/url-encoder-decoder">{() => <LazyWrap><UrlEncoderDecoder /></LazyWrap>}</Route>
      <Route path="/tools/url-encoder-decoder">{() => <LazyWrap><UrlEncoderDecoder /></LazyWrap>}</Route>
      {/* Math tools */}
      <Route path="/math/percentage-error-calculator">{() => <LazyWrap><PercentageErrorCalculator /></LazyWrap>}</Route>
      <Route path="/tools/percentage-error-calculator">{() => <LazyWrap><PercentageErrorCalculator /></LazyWrap>}</Route>
      {/* Finance tools */}
      <Route path="/finance/tip-calculator">{() => <LazyWrap><TipCalculator /></LazyWrap>}</Route>
      <Route path="/tools/tip-calculator">{() => <LazyWrap><TipCalculator /></LazyWrap>}</Route>
      {/* Education tools */}
      <Route path="/education/gpa-calculator">{() => <LazyWrap><GpaCalculator /></LazyWrap>}</Route>
      <Route path="/education/online-gpa-calculator">{() => <LazyWrap><GpaCalculator /></LazyWrap>}</Route>
      <Route path="/tools/gpa-calculator">{() => <LazyWrap><GpaCalculator /></LazyWrap>}</Route>
      <Route path="/education/attendance-percentage-calculator">{() => <LazyWrap><AttendancePercentageCalculator /></LazyWrap>}</Route>
      <Route path="/tools/attendance-percentage-calculator">{() => <LazyWrap><AttendancePercentageCalculator /></LazyWrap>}</Route>
      <Route path="/education/marks-percentage-calculator">{() => <LazyWrap><MarksPercentageCalculator /></LazyWrap>}</Route>
      <Route path="/tools/marks-percentage-calculator">{() => <LazyWrap><MarksPercentageCalculator /></LazyWrap>}</Route>
      <Route path="/education/marks-to-gpa-converter">{() => <LazyWrap><MarksToGpaConverter /></LazyWrap>}</Route>
      <Route path="/tools/marks-to-gpa-converter">{() => <LazyWrap><MarksToGpaConverter /></LazyWrap>}</Route>
      <Route path="/education/percentage-grade-calculator">{() => <LazyWrap><PercentageGradeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/percentage-grade-calculator">{() => <LazyWrap><PercentageGradeCalculator /></LazyWrap>}</Route>
      <Route path="/education/weighted-grade-calculator">{() => <LazyWrap><WeightedGradeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/weighted-grade-calculator">{() => <LazyWrap><WeightedGradeCalculator /></LazyWrap>}</Route>
      <Route path="/education/final-grade-calculator">{() => <LazyWrap><FinalGradeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/final-grade-calculator">{() => <LazyWrap><FinalGradeCalculator /></LazyWrap>}</Route>
      <Route path="/education/reading-speed-calculator">{() => <LazyWrap><ReadingSpeedCalculator /></LazyWrap>}</Route>
      <Route path="/tools/reading-speed-calculator">{() => <LazyWrap><ReadingSpeedCalculator /></LazyWrap>}</Route>
      <Route path="/education/class-average-calculator">{() => <LazyWrap><ClassAverageCalculator /></LazyWrap>}</Route>
      <Route path="/tools/class-average-calculator">{() => <LazyWrap><ClassAverageCalculator /></LazyWrap>}</Route>
      <Route path="/education/assignment-grade-calculator">{() => <LazyWrap><AssignmentGradeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/assignment-grade-calculator">{() => <LazyWrap><AssignmentGradeCalculator /></LazyWrap>}</Route>
      <Route path="/education/score-calculator">{() => <LazyWrap><ScoreCalculator /></LazyWrap>}</Route>
      <Route path="/tools/score-calculator">{() => <LazyWrap><ScoreCalculator /></LazyWrap>}</Route>
      <Route path="/education/quiz-score-calculator">{() => <LazyWrap><QuizScoreCalculator /></LazyWrap>}</Route>
      <Route path="/tools/quiz-score-calculator">{() => <LazyWrap><QuizScoreCalculator /></LazyWrap>}</Route>
      <Route path="/education/study-planner-calculator">{() => <LazyWrap><StudyPlannerCalculator /></LazyWrap>}</Route>
      <Route path="/tools/study-planner-calculator">{() => <LazyWrap><StudyPlannerCalculator /></LazyWrap>}</Route>
      <Route path="/education/homework-time-calculator">{() => <LazyWrap><HomeworkTimeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/homework-time-calculator">{() => <LazyWrap><HomeworkTimeCalculator /></LazyWrap>}</Route>
      <Route path="/education/grade-improvement-calculator">{() => <LazyWrap><GradeImprovementCalculator /></LazyWrap>}</Route>
      <Route path="/tools/grade-improvement-calculator">{() => <LazyWrap><GradeImprovementCalculator /></LazyWrap>}</Route>
      <Route path="/education/cgpa-calculator">{() => <LazyWrap><CgpaCalculator /></LazyWrap>}</Route>
      <Route path="/tools/cgpa-calculator">{() => <LazyWrap><CgpaCalculator /></LazyWrap>}</Route>
      <Route path="/education/exam-countdown-timer">{() => <LazyWrap><ExamCountdownTimer /></LazyWrap>}</Route>
      <Route path="/tools/exam-countdown-timer">{() => <LazyWrap><ExamCountdownTimer /></LazyWrap>}</Route>
      <Route path="/education/exam-score-predictor">{() => <LazyWrap><ExamScorePredictor /></LazyWrap>}</Route>
      <Route path="/tools/exam-score-predictor">{() => <LazyWrap><ExamScorePredictor /></LazyWrap>}</Route>
      <Route path="/education/study-hours-tracker">{() => <LazyWrap><StudyHoursTracker /></LazyWrap>}</Route>
      <Route path="/tools/study-hours-tracker">{() => <LazyWrap><StudyHoursTracker /></LazyWrap>}</Route>
      <Route path="/education/learning-time-calculator">{() => <LazyWrap><LearningTimeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/learning-time-calculator">{() => <LazyWrap><LearningTimeCalculator /></LazyWrap>}</Route>
      <Route path="/education/scholarship-calculator">{() => <LazyWrap><ScholarshipCalculator /></LazyWrap>}</Route>
      <Route path="/tools/scholarship-calculator">{() => <LazyWrap><ScholarshipCalculator /></LazyWrap>}</Route>
      <Route path="/education/semester-planner-tool">{() => <LazyWrap><SemesterPlannerTool /></LazyWrap>}</Route>
      <Route path="/tools/semester-planner-tool">{() => <LazyWrap><SemesterPlannerTool /></LazyWrap>}</Route>
      <Route path="/education/flashcard-timer-tool">{() => <LazyWrap><FlashcardTimerTool /></LazyWrap>}</Route>
      <Route path="/tools/flashcard-timer-tool">{() => <LazyWrap><FlashcardTimerTool /></LazyWrap>}</Route>
      <Route path="/education/test-score-analyzer">{() => <LazyWrap><TestScoreAnalyzer /></LazyWrap>}</Route>
      <Route path="/tools/test-score-analyzer">{() => <LazyWrap><TestScoreAnalyzer /></LazyWrap>}</Route>
      <Route path="/education/revision-planner-tool">{() => <LazyWrap><RevisionPlannerTool /></LazyWrap>}</Route>
      <Route path="/tools/revision-planner-tool">{() => <LazyWrap><RevisionPlannerTool /></LazyWrap>}</Route>
      <Route path="/education/school-schedule-planner">{() => <LazyWrap><SchoolSchedulePlanner /></LazyWrap>}</Route>
      <Route path="/tools/school-schedule-planner">{() => <LazyWrap><SchoolSchedulePlanner /></LazyWrap>}</Route>
      <Route path="/education/typing-speed-test">{() => <LazyWrap><TypingSpeedTest /></LazyWrap>}</Route>
      <Route path="/tools/typing-speed-test">{() => <LazyWrap><TypingSpeedTest /></LazyWrap>}</Route>
      <Route path="/education/sat-score-calculator">{() => <LazyWrap><SatScoreCalculator /></LazyWrap>}</Route>
      <Route path="/tools/sat-score-calculator">{() => <LazyWrap><SatScoreCalculator /></LazyWrap>}</Route>
      <Route path="/education/college-gpa-calculator">{() => <LazyWrap><CollegeGpaCalculator /></LazyWrap>}</Route>
      <Route path="/tools/college-gpa-calculator">{() => <LazyWrap><CollegeGpaCalculator /></LazyWrap>}</Route>
      <Route path="/tools/compound-interest-calculator">{() => <StaticPathRedirect to="/finance/online-compound-interest-calculator" />}</Route>
      <Route path="/tools/password-strength-checker">{() => <LazyWrap><PasswordStrengthChecker /></LazyWrap>}</Route>
      <Route path="/tools/slug-generator">{() => <LazyWrap><SlugGenerator /></LazyWrap>}</Route>
      <Route path="/tools/json-formatter">{() => <LazyWrap><JsonFormatter /></LazyWrap>}</Route>
      <Route path="/tools/loan-emi-calculator">{() => <StaticPathRedirect to="/finance/online-loan-emi-calculator" />}</Route>
      <Route path="/tools/twitter-character-counter">{() => <LazyWrap><TwitterCharacterCounter /></LazyWrap>}</Route>
      <Route path="/tools/instagram-caption-counter">{() => <StaticPathRedirect to="/social-media/online-instagram-caption-counter" />}</Route>
      <Route path="/tools/linkedin-post-formatter">{() => <StaticPathRedirect to="/social-media/online-linkedin-post-formatter" />}</Route>
      <Route path="/tools/bio-generator">{() => <LazyWrap><SocialMediaBioGenerator /></LazyWrap>}</Route>
      <Route path="/tools/social-post-scheduler-planner">{() => <StaticPathRedirect to="/social-media/online-social-post-scheduler-planner" />}</Route>
      <Route path="/tools/text-to-emoji">{() => <LazyWrap><TextToEmojiConverter /></LazyWrap>}</Route>
      <Route path="/tools/social-media-image-resizer">{() => <StaticPathRedirect to="/social-media/online-social-media-image-resizer" />}</Route>
      <Route path="/productivity/lorem-ipsum-generator">{() => <StaticPathRedirect to="/developer/online-lorem-ipsum-generator" />}</Route>
      <Route path="/tools/lorem-ipsum-generator">{() => <LazyWrap><LoremIpsumGenerator /></LazyWrap>}</Route>
      <Route path="/health/bmr-calculator">{() => <LazyWrap><BmrCalculator /></LazyWrap>}</Route>
      <Route path="/tools/bmr-calculator">{() => <LazyWrap><BmrCalculator /></LazyWrap>}</Route>
      <Route path="/seo/meta-tag-generator">{() => <LazyWrap><MetaTagGenerator /></LazyWrap>}</Route>
      <Route path="/tools/serp-preview-tool">{() => <LazyWrap><GoogleSerpPreview /></LazyWrap>}</Route>
      <Route path="/tools/open-graph-generator">{() => <LazyWrap><OpenGraphGenerator /></LazyWrap>}</Route>
      <Route path="/tools/twitter-card-generator">{() => <LazyWrap><TwitterCardGenerator /></LazyWrap>}</Route>
      <Route path="/tools/schema-markup-generator">{() => <LazyWrap><SchemaMarkupGenerator /></LazyWrap>}</Route>
      <Route path="/tools/canonical-tag-generator">{() => <LazyWrap><CanonicalTagGenerator /></LazyWrap>}</Route>
      <Route path="/tools/robots-txt-generator">{() => <StaticPathRedirect to="/seo/online-robots-txt-generator" />}</Route>
      <Route path="/tools/sitemap-generator">{() => <StaticPathRedirect to="/seo/online-sitemap-generator" />}</Route>
      <Route path="/tools/heading-tag-checker">{() => <StaticPathRedirect to="/seo/online-heading-tag-checker" />}</Route>
      <Route path="/tools/keyword-density-checker">{() => <StaticPathRedirect to="/seo/online-keyword-density-checker" />}</Route>
      <Route path="/tools/readability-checker">{() => <StaticPathRedirect to="/seo/online-readability-checker" />}</Route>
      <Route path="/tools/meta-tag-generator">{() => <LazyWrap><MetaTagGenerator /></LazyWrap>}</Route>
      <Route path="/developer/base64-encoder-decoder">{() => <LazyWrap><Base64EncoderDecoder /></LazyWrap>}</Route>
      <Route path="/tools/base64-encoder-decoder">{() => <LazyWrap><Base64EncoderDecoder /></LazyWrap>}</Route>
      <Route path="/tools/color-code-converter">{() => <LazyWrap><ColorCodeConverter /></LazyWrap>}</Route>
      <Route path="/tools/cron-expression-generator">{() => <LazyWrap><CronExpressionGenerator /></LazyWrap>}</Route>
      <Route path="/tools/css-formatter">{() => <LazyWrap><CssFormatter /></LazyWrap>}</Route>
      <Route path="/tools/css-minifier">{() => <LazyWrap><CssMinifier /></LazyWrap>}</Route>
      <Route path="/tools/hash-generator">{() => <LazyWrap><HashGenerator /></LazyWrap>}</Route>
      <Route path="/tools/html-entity-encoder">{() => <LazyWrap><HtmlEntityEncoder /></LazyWrap>}</Route>
      <Route path="/tools/html-formatter">{() => <LazyWrap><HtmlFormatter /></LazyWrap>}</Route>
      <Route path="/tools/html-minifier">{() => <LazyWrap><HtmlMinifier /></LazyWrap>}</Route>
      <Route path="/tools/html-to-markdown">{() => <LazyWrap><HtmlToMarkdownConverter /></LazyWrap>}</Route>
      <Route path="/tools/javascript-formatter">{() => <LazyWrap><JavaScriptFormatter /></LazyWrap>}</Route>
      <Route path="/tools/javascript-minifier">{() => <LazyWrap><JavaScriptMinifier /></LazyWrap>}</Route>
      <Route path="/tools/markdown-to-html">{() => <LazyWrap><MarkdownToHtmlConverter /></LazyWrap>}</Route>
      <Route path="/tools/jwt-decoder">{() => <LazyWrap><JwtDecoder /></LazyWrap>}</Route>
      <Route path="/tools/json-minifier">{() => <LazyWrap><JsonMinifier /></LazyWrap>}</Route>
      <Route path="/tools/json-path-tester">{() => <StaticPathRedirect to="/developer/online-json-path-tester" />}</Route>
      <Route path="/tools/json-validator">{() => <LazyWrap><JsonValidator /></LazyWrap>}</Route>
      <Route path="/tools/regex-tester">{() => <LazyWrap><RegexTester /></LazyWrap>}</Route>
      <Route path="/tools/sql-formatter">{() => <LazyWrap><SqlFormatter /></LazyWrap>}</Route>
      <Route path="/tools/string-escape-unescape">{() => <LazyWrap><StringEscapeUnescape /></LazyWrap>}</Route>
      <Route path="/tools/diff-checker">{() => <LazyWrap><TextDiffChecker /></LazyWrap>}</Route>
      <Route path="/tools/json-to-csv">{() => <StaticPathRedirect to="/developer/online-json-to-csv" />}</Route>
      <Route path="/tools/json-to-xml">{() => <LazyWrap><JsonToXmlConverter /></LazyWrap>}</Route>
      <Route path="/tools/xml-formatter">{() => <LazyWrap><XmlFormatter /></LazyWrap>}</Route>
      <Route path="/tools/yaml-to-json">{() => <LazyWrap><YamlToJsonConverter /></LazyWrap>}</Route>
      <Route path="/tools/dnd-dice-roller">{() => <LazyWrap><DndDiceRoller /></LazyWrap>}</Route>
      <Route path="/tools/blox-fruits-calculator">{() => <LazyWrap><BloxFruitsCalculator /></LazyWrap>}</Route>
      <Route path="/tools/blox-fruits-trade-calculator">{() => <LazyWrap><BloxFruitsTradeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/cs2-sensitivity-calculator">{() => <LazyWrap><Cs2SensitivityCalculator /></LazyWrap>}</Route>
      <Route path="/tools/valorant-sensitivity-calculator">{() => <LazyWrap><ValorantSensitivityCalculator /></LazyWrap>}</Route>
      <Route path="/tools/fortnite-dpi-calculator">{() => <LazyWrap><FortniteDpiCalculator /></LazyWrap>}</Route>
      <Route path="/tools/roblox-tax-calculator">{() => <LazyWrap><RobloxTaxCalculator /></LazyWrap>}</Route>
      <Route path="/tools/minecraft-circle-calculator">{() => <LazyWrap><MinecraftCircleCalculator /></LazyWrap>}</Route>
      <Route path="/tools/xp-level-calculator">{() => <LazyWrap><XpLevelCalculator /></LazyWrap>}</Route>
      <Route path="/tools/game-currency-converter">{() => <LazyWrap><GameCurrencyConverter /></LazyWrap>}</Route>
      <Route path="/tools/esports-earnings-calculator">{() => <LazyWrap><EsportsEarningsCalculator /></LazyWrap>}</Route>
      <Route path="/tools/gaming-fps-calculator">{() => <LazyWrap><GamingFpsCalculator /></LazyWrap>}</Route>
      <Route path="/tools/damage-calculator">{() => <LazyWrap><DamageCalculator /></LazyWrap>}</Route>
      <Route path="/tools/clash-of-clans-upgrade-calculator">{() => <LazyWrap><ClashOfClansUpgradeCalculator /></LazyWrap>}</Route>
      <Route path="/tools/genshin-impact-calculator">{() => <LazyWrap><GenshinImpactCalculator /></LazyWrap>}</Route>
      <Route path="/tools/pokemon-iv-calculator">{() => <LazyWrap><PokemonIvCalculator /></LazyWrap>}</Route>
      <Route path="/tools/encryption-decoder">{() => <LazyWrap><CaesarCipherTool /></LazyWrap>}</Route>
      <Route path="/tools/morse-code-translator">{() => <StaticPathRedirect to="/security/online-morse-code-translator" />}</Route>
      <Route path="/tools/random-string-generator">{() => <LazyWrap><RandomStringGenerator /></LazyWrap>}</Route>
      <Route path="/tools/hmac-generator">{() => <LazyWrap><HmacGenerator /></LazyWrap>}</Route>
      <Route path="/tools/bcrypt-hash-generator">{() => <StaticPathRedirect to="/security/online-bcrypt-hash-generator" />}</Route>
      <Route path="/tools/aes-encrypt-decrypt">{() => <StaticPathRedirect to="/security/online-aes-encrypt-decrypt" />}</Route>
      <Route path="/tools/rsa-key-generator">{() => <LazyWrap><RsaKeyGenerator /></LazyWrap>}</Route>
      <Route path="/tools/hex-to-text">{() => <LazyWrap><HexToTextConverter /></LazyWrap>}</Route>
      <Route path="/tools/htaccess-redirect-generator">{() => <LazyWrap><HtaccessRedirectGenerator /></LazyWrap>}</Route>
      <Route path="/tools/favicon-checker">{() => <LazyWrap><FaviconCodeGenerator /></LazyWrap>}</Route>
      <Route path="/css-design/css-gradient-generator">{() => <LazyWrap><CssGradientGenerator /></LazyWrap>}</Route>
      <Route path="/tools/css-gradient-generator">{() => <LazyWrap><CssGradientGenerator /></LazyWrap>}</Route>
      <Route path="/css-design/css-border-radius-generator">{() => <LazyWrap><CssBorderRadiusGenerator /></LazyWrap>}</Route>
      <Route path="/tools/css-border-radius-generator">{() => <LazyWrap><CssBorderRadiusGenerator /></LazyWrap>}</Route>
      <Route path="/css-design/css-box-shadow-generator">{() => <LazyWrap><CssBoxShadowGenerator /></LazyWrap>}</Route>
      <Route path="/tools/css-box-shadow-generator">{() => <LazyWrap><CssBoxShadowGenerator /></LazyWrap>}</Route>
      <Route path="/css-design/css-clip-path-generator">{() => <LazyWrap><CssClipPathGenerator /></LazyWrap>}</Route>
      <Route path="/tools/css-clip-path-generator">{() => <LazyWrap><CssClipPathGenerator /></LazyWrap>}</Route>
      <Route path="/css-design/css-flexbox-generator">{() => <LazyWrap><CssFlexboxGenerator /></LazyWrap>}</Route>
      <Route path="/tools/css-flexbox-generator">{() => <LazyWrap><CssFlexboxGenerator /></LazyWrap>}</Route>
      <Route path="/css-design/css-grid-generator">{() => <LazyWrap><CssGridGenerator /></LazyWrap>}</Route>
      <Route path="/tools/css-grid-generator">{() => <LazyWrap><CssGridGenerator /></LazyWrap>}</Route>
      <Route path="/css-design/css-filter-generator">{() => <LazyWrap><CssFilterGenerator /></LazyWrap>}</Route>
      <Route path="/tools/css-filter-generator">{() => <LazyWrap><CssFilterGenerator /></LazyWrap>}</Route>
      <Route path="/css-design/css-text-shadow-generator">{() => <LazyWrap><CssTextShadowGenerator /></LazyWrap>}</Route>
      <Route path="/tools/css-text-shadow-generator">{() => <LazyWrap><CssTextShadowGenerator /></LazyWrap>}</Route>
      <Route path="/css-design/css-triangle-generator">{() => <LazyWrap><CssTriangleGenerator /></LazyWrap>}</Route>
      <Route path="/tools/css-triangle-generator">{() => <LazyWrap><CssTriangleGenerator /></LazyWrap>}</Route>
      <Route path="/css-design/glassmorphism-generator">{() => <LazyWrap><GlassmorphismGenerator /></LazyWrap>}</Route>
      <Route path="/tools/glassmorphism-generator">{() => <LazyWrap><GlassmorphismGenerator /></LazyWrap>}</Route>
      <Route path="/css-design/neumorphism-generator">{() => <LazyWrap><NeumorphismGenerator /></LazyWrap>}</Route>
      <Route path="/tools/neumorphism-generator">{() => <LazyWrap><NeumorphismGenerator /></LazyWrap>}</Route>
      <Route path="/css-design/css-animation-generator">{() => <LazyWrap><CssAnimationGenerator /></LazyWrap>}</Route>
      <Route path="/tools/css-animation-generator">{() => <LazyWrap><CssAnimationGenerator /></LazyWrap>}</Route>
      <Route path="/css-design/color-palette-generator">{() => <LazyWrap><ColorPaletteGenerator /></LazyWrap>}</Route>
      <Route path="/tools/color-palette-generator">{() => <LazyWrap><ColorPaletteGenerator /></LazyWrap>}</Route>
      <Route path="/css-design/color-picker">{() => <LazyWrap><ColorPickerTool /></LazyWrap>}</Route>
      <Route path="/css-design/color-picker-tool">{() => <LazyWrap><ColorPickerTool /></LazyWrap>}</Route>
      <Route path="/tools/color-picker">{() => <LazyWrap><ColorPickerTool /></LazyWrap>}</Route>
      <Route path="/css-design/tailwind-color-generator">{() => <LazyWrap><TailwindColorGenerator /></LazyWrap>}</Route>
      <Route path="/tools/tailwind-color-generator">{() => <LazyWrap><TailwindColorGenerator /></LazyWrap>}</Route>
      <Route path="/social-media/emoji-picker">{() => <LazyWrap><EmojiPickerTool /></LazyWrap>}</Route>
      <Route path="/social-media/emoji-picker-and-copier">{() => <LazyWrap><EmojiPickerTool /></LazyWrap>}</Route>
      <Route path="/tools/emoji-picker">{() => <LazyWrap><EmojiPickerTool /></LazyWrap>}</Route>
      {/* Catch-all: /:category/:slug for unimplemented tools */}
      <Route path="/finance/credit-card-payoff-calculator">{() => <LazyWrap><CreditCardPayoffCalculator /></LazyWrap>}</Route>
      <Route path="/tools/credit-card-payoff-calculator">{() => <LazyWrap><CreditCardPayoffCalculator /></LazyWrap>}</Route>
      <Route path="/finance/:slug">{() => <LazyWrap><FinanceToolSuite /></LazyWrap>}</Route>
      <Route path="/developer/uuid-generator">{() => <StaticPathRedirect to="/developer/online-uuid-generator" />}</Route>
      <Route path="/developer/online-uuid-generator">{() => <LazyWrap><UuidGenerator /></LazyWrap>}</Route>
      <Route path="/tools/uuid-generator">{() => <LazyWrap><UuidGenerator /></LazyWrap>}</Route>
      <Route path="/developer/csv-to-json">{() => <LazyWrap><CsvToJsonConverter /></LazyWrap>}</Route>
      <Route path="/developer/csv-to-json-converter">{() => <LazyWrap><CsvToJsonConverter /></LazyWrap>}</Route>
      <Route path="/tools/csv-to-json-converter">{() => <LazyWrap><CsvToJsonConverter /></LazyWrap>}</Route>
      <Route path="/css-design/color-contrast-checker">{() => <LazyWrap><ColorContrastChecker /></LazyWrap>}</Route>
      <Route path="/tools/color-contrast-checker">{() => <LazyWrap><ColorContrastChecker /></LazyWrap>}</Route>
        <Route path="/tools/:slug" component={ToolSlugRedirect} />
        <Route path="/:categoryId/:slug" component={ToolSlugRedirect} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="us-online-tools-theme">
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </HelmetProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
