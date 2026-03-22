import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./components/ThemeProvider";
import { lazy, Suspense } from "react";

// Core Pages
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ToolPlaceholder from "./pages/ToolPlaceholder";
import NotFound from "./pages/not-found";

// Fully implemented tools
import PercentageCalculator from "./pages/PercentageCalculator";
import PasswordGenerator from "./pages/PasswordGenerator";
import WordCounter from "./pages/WordCounter";
import AgeCalculator from "./pages/AgeCalculator";
import ColorConverter from "./pages/ColorConverter";
import BmiCalculator from "./pages/BmiCalculator";
import TipCalculator from "./pages/TipCalculator";
import DiscountCalculator from "./pages/DiscountCalculator";
import RandomNumberGenerator from "./pages/RandomNumberGenerator";
import TemperatureConverter from "./pages/TemperatureConverter";

// New tool pages
const CompoundInterestCalculator = lazy(() => import("./pages/tools/CompoundInterestCalculator"));
const LoanEmiCalculator = lazy(() => import("./pages/tools/LoanEmiCalculator"));
const SimpleInterestCalculator = lazy(() => import("./pages/tools/SimpleInterestCalculator"));
const JsonFormatter = lazy(() => import("./pages/tools/JsonFormatter"));
const Base64EncoderDecoder = lazy(() => import("./pages/tools/Base64EncoderDecoder"));
const LoremIpsumGenerator = lazy(() => import("./pages/tools/LoremIpsumGenerator"));
const MetaTagGenerator = lazy(() => import("./pages/tools/MetaTagGenerator"));
const CssGradientGenerator = lazy(() => import("./pages/tools/CssGradientGenerator"));
const PasswordStrengthChecker = lazy(() => import("./pages/tools/PasswordStrengthChecker"));
const TwitterCharacterCounter = lazy(() => import("./pages/tools/TwitterCharacterCounter"));
const GpaCalculator = lazy(() => import("./pages/tools/GpaCalculator"));
const BmrCalculator = lazy(() => import("./pages/tools/BmrCalculator"));
const MortgagePaymentCalculator = lazy(() => import("./pages/tools/MortgagePaymentCalculator"));
const LengthConverter = lazy(() => import("./pages/tools/LengthConverter"));
const DateDifferenceCalculator = lazy(() => import("./pages/tools/DateDifferenceCalculator"));
const ConcreteCalculator = lazy(() => import("./pages/tools/ConcreteCalculator"));
const SalaryCalculator = lazy(() => import("./pages/tools/SalaryCalculator"));
const BodyFatCalculator = lazy(() => import("./pages/tools/BodyFatCalculator"));
const HexToRgbConverter = lazy(() => import("./pages/tools/HexToRgbConverter"));
const RoiCalculator = lazy(() => import("./pages/tools/RoiCalculator"));
const AverageCalculator = lazy(() => import("./pages/tools/AverageCalculator"));

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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />

      {/* Category pages */}
      <Route path="/category/:id" component={CategoryPage} />

      {/* Legacy /tools/ routes (redirect-friendly) */}
      <Route path="/tools/percentage-calculator" component={PercentageCalculator} />
      <Route path="/tools/password-generator" component={PasswordGenerator} />
      <Route path="/tools/word-counter" component={WordCounter} />
      <Route path="/tools/age-calculator" component={AgeCalculator} />
      <Route path="/tools/color-converter" component={ColorConverter} />
      <Route path="/tools/bmi-calculator" component={BmiCalculator} />
      <Route path="/tools/tip-calculator" component={TipCalculator} />
      <Route path="/tools/discount-calculator" component={DiscountCalculator} />
      <Route path="/tools/random-number-generator" component={RandomNumberGenerator} />
      <Route path="/tools/temperature-converter" component={TemperatureConverter} />

      {/* New SEO-friendly /:category/:tool routes — existing tools */}
      <Route path="/math/percentage-calculator" component={PercentageCalculator} />
      <Route path="/productivity/password-generator" component={PasswordGenerator} />
      <Route path="/productivity/word-counter" component={WordCounter} />
      <Route path="/time-date/age-calculator" component={AgeCalculator} />
      <Route path="/conversion/color-converter" component={ColorConverter} />
      <Route path="/health/bmi-calculator" component={BmiCalculator} />
      <Route path="/finance/tip-calculator" component={TipCalculator} />
      <Route path="/finance/discount-calculator" component={DiscountCalculator} />
      <Route path="/math/random-number-generator" component={RandomNumberGenerator} />
      <Route path="/conversion/temperature-converter" component={TemperatureConverter} />

      {/* New tool pages */}
      <Route path="/finance/compound-interest-calculator">{() => <LazyWrap><CompoundInterestCalculator /></LazyWrap>}</Route>
      <Route path="/finance/loan-emi-calculator">{() => <LazyWrap><LoanEmiCalculator /></LazyWrap>}</Route>
      <Route path="/finance/simple-interest-calculator">{() => <LazyWrap><SimpleInterestCalculator /></LazyWrap>}</Route>
      <Route path="/developer/json-formatter">{() => <LazyWrap><JsonFormatter /></LazyWrap>}</Route>
      <Route path="/developer/base64-encoder-decoder">{() => <LazyWrap><Base64EncoderDecoder /></LazyWrap>}</Route>
      <Route path="/developer/lorem-ipsum-generator">{() => <LazyWrap><LoremIpsumGenerator /></LazyWrap>}</Route>
      <Route path="/seo/meta-tag-generator">{() => <LazyWrap><MetaTagGenerator /></LazyWrap>}</Route>
      <Route path="/css-design/css-gradient-generator">{() => <LazyWrap><CssGradientGenerator /></LazyWrap>}</Route>
      <Route path="/security/password-strength-checker">{() => <LazyWrap><PasswordStrengthChecker /></LazyWrap>}</Route>
      <Route path="/social-media/twitter-character-counter">{() => <LazyWrap><TwitterCharacterCounter /></LazyWrap>}</Route>
      <Route path="/education/gpa-calculator">{() => <LazyWrap><GpaCalculator /></LazyWrap>}</Route>
      <Route path="/health/bmr-calculator">{() => <LazyWrap><BmrCalculator /></LazyWrap>}</Route>
      <Route path="/finance/mortgage-payment-calculator">{() => <LazyWrap><MortgagePaymentCalculator /></LazyWrap>}</Route>
      <Route path="/conversion/length-converter">{() => <LazyWrap><LengthConverter /></LazyWrap>}</Route>
      <Route path="/time-date/date-difference-calculator">{() => <LazyWrap><DateDifferenceCalculator /></LazyWrap>}</Route>
      <Route path="/construction/concrete-calculator">{() => <LazyWrap><ConcreteCalculator /></LazyWrap>}</Route>
      <Route path="/finance/salary-calculator">{() => <LazyWrap><SalaryCalculator /></LazyWrap>}</Route>
      <Route path="/health/body-fat-calculator">{() => <LazyWrap><BodyFatCalculator /></LazyWrap>}</Route>
      <Route path="/css-design/hex-to-rgb-converter">{() => <LazyWrap><HexToRgbConverter /></LazyWrap>}</Route>
      <Route path="/finance/roi-calculator">{() => <LazyWrap><RoiCalculator /></LazyWrap>}</Route>
      <Route path="/math/average-calculator">{() => <LazyWrap><AverageCalculator /></LazyWrap>}</Route>

      {/* Catch-all: /:category/:slug for unimplemented tools */}
      <Route path="/tools/:slug" component={ToolPlaceholder} />
      <Route path="/:categoryId/:slug" component={ToolPlaceholder} />
      <Route component={NotFound} />
    </Switch>
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
