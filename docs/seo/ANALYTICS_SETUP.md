# Analytics & User Engagement Measurement Architecture

**Domain:** https://usonlinetools.com/
**System:** Google Analytics 4 (GA4) / Custom Client-Side Data Layer
**Privacy Architecture:** Zero-PII, Zero-Payload Local Execution Guarantee

---

## 1. Measurement Objective

Track real organic tool engagement, calculation completion rates, feature usage, and referral attribution without compromising user privacy or violating data-handling standards.

---

## 2. Event Specification

All analytics events are implemented in `src/lib/analytics.ts` and dispatch safe, generic parameters to `window.dataLayer` and `gtag`:

| Event Name | Trigger | Parameters | Purpose |
|---|---|---|---|
| `tool_view` | Tool page load / mount | `tool_name`, `category`, `language` | Measure tool demand and catalog discovery |
| `tool_calculate` | User submits or calculates a result | `tool_name`, `category` | Measure calculation completion & utility |
| `tool_reset` | User clicks reset / clear | `tool_name`, `category` | Measure session restart behavior |
| `tool_copy_result` | User copies calculation output | `tool_name`, `category` | Measure task success & practical utility |
| `tool_download` | User exports PDF, CSV, or image | `tool_name`, `category`, `file_type` | Track file generation engagement |
| `related_tool_click` | User clicks a companion tool card | `tool_name`, `target_tool`, `category` | Measure internal authority link flows |
| `category_click` | User navigates to a category hub | `category` | Measure topical hub navigation |
| `ai_referral` | User lands from AI search engine | `source`, `landing_page` | Attribute traffic from AI retrieval engines |

---

## 3. Strict Privacy & Data Protection Rules

To adhere to our local-first browser privacy architecture, the analytics pipeline enforces:

1. **Zero Payload Logging:** No numerical inputs, financial values, health numbers, dates of birth, passwords, hash inputs, or text strings are sent.
2. **Zero Personal Identifiers:** No user IDs, email addresses, IP overrides, or cookies tracking across third-party websites.
3. **Client-Side Processing:** All computations execute inside the user's browser runtime; analytics only receives the generic event classification.

---

## 4. AI Referral Attribution Tracking

Automatically parses `document.referrer` on route changes to identify traffic from AI answer engines:
- **ChatGPT:** `chatgpt.com`, `openai.com`
- **Perplexity:** `perplexity.ai`
- **Claude:** `claude.ai`, `anthropic.com`
- **Microsoft Copilot:** `copilot.microsoft.com`, `bing.com/chat`
- **Google Gemini:** `gemini.google.com`

---

## 5. Deployment Configuration

To connect a live Google Analytics 4 property:
1. Provide the GA4 Measurement ID (e.g., `G-XXXXXXXXXX`).
2. Add to Hostinger environment variables or configure via tag manager.
3. The client-side utility in `src/lib/analytics.ts` gracefully no-ops when analytics is unconfigured, preventing any console errors.
