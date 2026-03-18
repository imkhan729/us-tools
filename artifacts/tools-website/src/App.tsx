import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./components/ThemeProvider";

// Implemented Pages
import Home from "./pages/Home";
import PercentageCalculator from "./pages/PercentageCalculator";
import PasswordGenerator from "./pages/PasswordGenerator";
import WordCounter from "./pages/WordCounter";
import AgeCalculator from "./pages/AgeCalculator";
import ColorConverter from "./pages/ColorConverter";
import ToolPlaceholder from "./pages/ToolPlaceholder";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      {/* Fully implemented tools */}
      <Route path="/tools/percentage-calculator" component={PercentageCalculator} />
      <Route path="/tools/password-generator" component={PasswordGenerator} />
      <Route path="/tools/word-counter" component={WordCounter} />
      <Route path="/tools/age-calculator" component={AgeCalculator} />
      <Route path="/tools/color-converter" component={ColorConverter} />
      {/* Catch-all for all other tool pages (placeholder) */}
      <Route path="/tools/:slug" component={ToolPlaceholder} />
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
