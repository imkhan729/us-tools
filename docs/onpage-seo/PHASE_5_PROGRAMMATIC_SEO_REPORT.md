# Phase 5: Programmatic SEO Discovery, Clustering & Gating

## 1. Executive Summary

Phase 5 defines strict gating criteria and architectural boundaries for Programmatic SEO (pSEO). To protect USOnlineTools.com from Google algorithmic helpful content and doorway penalties, thin parameterized doorway URLs are strictly **prohibited**, while high-value, dedicated unit pair converters are conditionally **approved**.

---

## 2. Programmatic SEO Gating Principles

```text
┌─────────────────────────────────────────────────────────────┐
│                    pSEO DECISION MATRIX                     │
├───────────────────────────────┬─────────────────────────────┤
│ ❌ REJECTED (DOORWAY / SPAM)   │ ✅ APPROVED (LEGITIMATE)    │
├───────────────────────────────┼─────────────────────────────┤
│ • URL per integer/number      │ • Discrete unit-to-unit     │
│   (/number-to-words/5000)     │   conversion pairs          │
│ • URL per salary figure       │   (/celsius-to-fahrenheit)  │
│   (/salary/50000-to-hourly)   │ • Verified independent      │
│ • URL per calendar day count  │   Google search demand      │
│   (/business-days/10-days)    │ • Unique formula & worked   │
│ • Single-variable parameter   │   conversion reference      │
│   doorways with templated text│   tables per unit pair      │
└───────────────────────────────┴─────────────────────────────┘
```

---

## 3. Rejected Programmatic Patterns (Doorway Spam Prevention)

| Candidate Pattern | Status | Strategic & SEO Risk Rationale |
|---|---|---|
| `/number-to-words/{number}` | **REJECTED** | Classic doorway spam. Thousands of URLs differing only by a single integer value produce near-duplicate thin pages that dilute crawl budget and risk domain-level algorithmic suppression. Handled dynamically via tool client UI. |
| `/salary/{amount}-to-hourly` | **REJECTED** | Scaled salary doorways (e.g. 45k, 50k, 55k) lack differentiated content or unique user value. Replaced by a single comprehensive interactive `/finance/salary-calculator`. |
| `/business-days/{days}-days-from-today` | **REJECTED** | Date permutation doorway pages. Handled cleanly inside `/time-date/business-days-calculator` using dynamic date pickers. |
| `/percentage/{x}-percent-of-{y}` | **REJECTED** | Infinite permutation matrix of percentage queries. Consolidated into master `/math/online-percentage-calculator`. |

---

## 4. Approved Programmatic Candidates (High-Intent Conversion Pairs)

| Candidate Pattern | Status | Search Demand & Justification |
|---|---|---|
| `/conversion/celsius-to-fahrenheit` | **APPROVED** | High independent search demand with unique temperature conversion formula, boiling/freezing points reference table, and specific thermal use cases. |
| `/conversion/fahrenheit-to-celsius` | **APPROVED** | Dedicated reciprocal search intent, formula, and distinct user mental models. |
| `/conversion/kg-to-lbs` | **APPROVED** | High search volume, distinct imperial/metric conversion factors (1 kg approx 2.20462 lbs), and international fitness/shipping search queries. |
| `/conversion/lbs-to-kg` | **APPROVED** | Dedicated reciprocal search volume in US/UK/Canada markets. |
| `/conversion/hex-to-decimal` | **APPROVED** | Core developer and computer science query with radix conversion steps, bitwise representation tables, and ASCII mappings. |

---

## 5. Implementation Rules for Approved Pairs

When generating approved unit pair pages:
1. **No Pure Boilerplate:** Every pair page must contain the exact bidirectional conversion formula, mathematical derivation, a worked quick-reference table, and FAQ schema.
2. **Client-Side Live Recalculation:** The interactive tool must remain visible above the fold and allow instant custom inputs without requiring page reloads.
3. **Cross-Linkage Mesh:** Every unit pair must link back to its master category hub and its reciprocal pair.

---

## 6. Output Artifacts

- **Candidate Evaluation Dataset:** `docs/onpage-seo/PROGRAMMATIC_SEO_CANDIDATES.csv` (7 rows x 5 columns)
- **Detailed Policy Report:** `docs/onpage-seo/PHASE_5_PROGRAMMATIC_SEO_REPORT.md`
