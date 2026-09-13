# Phase 8: Cannibalization Prevention & Internal Linking Plan

## 1. Executive Summary

Phase 8 defines clear query boundaries across overlapping search terms and establishes a complete, contextual internal linking network across all **400 core tools**. This architecture eliminates internal cannibalization while maximizing crawl efficiency and PageRank distribution.

---

## 2. Cannibalization Conflict Boundaries

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   QUERY INTENT DISAMBIGUATION RULES                    │
├───────────────────────────────┬────────────────────────────────────────┤
│ Tool URL                      │ Unique Search Intent & Content Boundary│
├───────────────────────────────┼────────────────────────────────────────┤
│ /finance/salary-calculator    │ • Master wage conversions              │
│                               │   (Annual ↔ Hourly ↔ Monthly ↔ Weekly) │
│ /time-date/work-hours-calc    │ • Daily work shift time tracking       │
│                               │   (Start time, end time, lunch breaks) │
├───────────────────────────────┼────────────────────────────────────────┤
│ /math/online-percentage-calc  │ • General % calculations (X% of Y, etc)│
│ /math/percentage-error-calc   │ • Experimental vs theoretical accuracy │
│ /education/marks-percentage   │ • Exam score and grade conversions     │
├───────────────────────────────┼────────────────────────────────────────┤
│ /health/online-bmi-calculator │ • Body Mass Index (height vs weight)   │
│ /health/online-bmr-calculator │ • Basal Metabolic Rate (resting cals)  │
│ /health/online-tdee-calculator│ • Total Daily Energy Exp (active cals) │
└───────────────────────────────┴────────────────────────────────────────┘
```

---

## 3. High-Risk Cluster Disambiguation Guidelines

### 1. Wage & Time Tracking Cluster
- **`/finance/salary-calculator`**: Targets gross/net annualized salary conversions, pay frequencies, and tax baselines.
- **`/time-date/work-hours-calculator`**: Strictly targets daily punch-in/punch-out shift hours and overtime duration.
- **`/time-date/hourly-time-calculator`**: Focuses on clock arithmetic (e.g. adding 7 hours 30 mins to 2:15 PM).

### 2. Percentage & Grading Cluster
- **`/math/online-percentage-calculator`**: Master general calculator for standard percentage increase, decrease, and difference.
- **`/math/percentage-error-calculator`**: Exclusively targets physics/chemistry laboratory error estimation formulas ($|\text{experimental} - \text{theoretical}| / \text{theoretical}$).
- **`/education/percentage-grade-calculator`**: Exclusively targets GPA letters and academic course grading curves.

### 3. Date & Duration Cluster
- **`/time-date/business-days-calculator`**: Exclusively handles working days and federal bank holiday exclusions.
- **`/time-date/date-difference-calculator`**: Handles exact total days, months, and years between calendar dates.
- **`/time-date/age-in-days-calculator`**: Dedicated lifestyle/milestone query for total days lived since birth.

---

## 4. Contextual Internal Linking Architecture

Every tool page is embedded within a 5-link mesh:
1. **Vertical Hierarchy Link**: Breadcrumb and hub link back to the parent Category Hub (e.g. `/category/finance`).
2. **Horizontal Peer Links (4 per tool)**: Contextually related sibling tools chosen for natural user transition:
   - Example for **Roof Area Calculator**: Links to Concrete Calculator (slab foundation), Drywall Calculator (interior walls), Gravel Calculator (ground prep), and Room Area Calculator.
   - Example for **JSONPath Tester**: Links to JSON Formatter, JSON to CSV Converter, Regex Tester, and Base64 Encoder/Decoder.

---

## 5. Output Artifacts

- **Cannibalization Boundary Map:** `docs/onpage-seo/CANNIBALIZATION_MAP.csv` (6 conflict clusters)
- **Internal Linking Matrix:** `docs/onpage-seo/INTERNAL_LINK_PLAN.csv` (400 tools mapped with hubs and 4 contextual peers)
- **Detailed Report:** `docs/onpage-seo/PHASE_8_INTERNAL_LINKING_REPORT.md`
