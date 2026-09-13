/**
 * Privacy-focused GA4 & Custom Event Measurement Library
 * Strict privacy guarantee: Zero user inputs, financial amounts, health data,
 * passwords, text payloads, or file contents are ever sent to analytics.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type EventCategory =
  | "math"
  | "finance"
  | "conversion"
  | "time-date"
  | "health"
  | "construction"
  | "productivity"
  | "education"
  | "gaming"
  | "image"
  | "pdf"
  | "developer"
  | "css-design"
  | "seo"
  | "security"
  | "social-media"
  | "general";

interface GenericEventParams {
  tool_name?: string;
  category?: string;
  language?: string;
  action_type?: string;
  target_tool?: string;
  file_type?: string;
  source?: string;
  [key: string]: unknown;
}

/**
 * Dispatches an event to GA4 dataLayer / gtag if available
 */
export function trackEvent(eventName: string, params: GenericEventParams = {}): void {
  try {
    if (typeof window === "undefined") return;

    // Dispatch to gtag if configured
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...params,
      });
    }

    // Optional debug logging in development
    if (process.env.NODE_ENV === "development") {
      // console.debug(`[Analytics] ${eventName}:`, params);
    }
  } catch {
    // Fail silently without disrupting tool operation
  }
}

/**
 * Tracks tool page view
 */
export function trackToolView(toolName: string, category: string, language = "en-US"): void {
  trackEvent("tool_view", {
    tool_name: toolName,
    category,
    language,
  });
}

/**
 * Tracks calculator / tool calculation execution
 */
export function trackToolCalculate(toolName: string, category: string): void {
  trackEvent("tool_calculate", {
    tool_name: toolName,
    category,
  });
}

/**
 * Tracks result copy action
 */
export function trackToolCopy(toolName: string, category: string): void {
  trackEvent("tool_copy_result", {
    tool_name: toolName,
    category,
  });
}

/**
 * Tracks tool reset action
 */
export function trackToolReset(toolName: string, category: string): void {
  trackEvent("tool_reset", {
    tool_name: toolName,
    category,
  });
}

/**
 * Tracks file export / download action
 */
export function trackToolDownload(toolName: string, category: string, fileType = "file"): void {
  trackEvent("tool_download", {
    tool_name: toolName,
    category,
    file_type: fileType,
  });
}

/**
 * Tracks navigation to companion/related tools
 */
export function trackRelatedToolClick(fromTool: string, toTool: string, category: string): void {
  trackEvent("related_tool_click", {
    tool_name: fromTool,
    target_tool: toTool,
    category,
  });
}

/**
 * Tracks category hub navigation
 */
export function trackCategoryClick(categoryId: string): void {
  trackEvent("category_click", {
    category: categoryId,
  });
}

/**
 * Detects and tracks referrals from AI search & answer engines
 */
export function detectAndTrackAiReferral(): void {
  if (typeof document === "undefined" || !document.referrer) return;

  const ref = document.referrer.toLowerCase();
  let aiEngine: string | null = null;

  if (ref.includes("chatgpt.com") || ref.includes("openai.com")) {
    aiEngine = "ChatGPT";
  } else if (ref.includes("perplexity.ai")) {
    aiEngine = "Perplexity";
  } else if (ref.includes("claude.ai") || ref.includes("anthropic.com")) {
    aiEngine = "Claude";
  } else if (ref.includes("copilot.microsoft.com") || ref.includes("bing.com/chat")) {
    aiEngine = "Copilot";
  } else if (ref.includes("gemini.google.com")) {
    aiEngine = "Gemini";
  }

  if (aiEngine) {
    trackEvent("ai_referral", {
      source: aiEngine,
      landing_page: window.location.pathname,
    });
  }
}
