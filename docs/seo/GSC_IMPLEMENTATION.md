# Google Search Console (GSC) Implementation & Monitoring Protocol

**Domain:** https://usonlinetools.com/
**Property Configuration:** Domain Property (usonlinetools.com) & URL Prefix Property (https://usonlinetools.com/)
**Status:** Pre-Deployment Specifications Complete; Awaiting Production Deployment Verification (Phase 22/23)

---

## 1. Sitemap Submission Protocol

Upon deployment to Hostinger, submit the master sitemap index:

```text
https://usonlinetools.com/sitemap.xml
```

The master index automatically declares all 18 modular sub-sitemaps (1 pages sitemap, 1 localized tools sitemap, and 16 category-specific tool sitemaps) containing exactly **430 canonical INDEX URLs**:
- `https://usonlinetools.com/sitemap-pages.xml` (Static pages & 16 category hubs)
- `https://usonlinetools.com/sitemap-new-tools.xml` (10 localized tools)
- `https://usonlinetools.com/sitemap-tools-math.xml` (30 math tools)
- `https://usonlinetools.com/sitemap-tools-finance.xml` (40 finance tools)
- `https://usonlinetools.com/sitemap-tools-conversion.xml` (32 conversion tools)
- `https://usonlinetools.com/sitemap-tools-time-date.xml` (32 time & date tools)
- `https://usonlinetools.com/sitemap-tools-health.xml` (34 health tools)
- `https://usonlinetools.com/sitemap-tools-construction.xml` (34 construction tools)
- `https://usonlinetools.com/sitemap-tools-productivity.xml` (26 productivity tools)
- `https://usonlinetools.com/sitemap-tools-education.xml` (31 education tools)
- `https://usonlinetools.com/sitemap-tools-gaming.xml` (16 gaming tools)
- `https://usonlinetools.com/sitemap-tools-image.xml` (20 image tools)
- `https://usonlinetools.com/sitemap-tools-pdf.xml` (16 PDF tools)
- `https://usonlinetools.com/sitemap-tools-developer.xml` (34 developer tools)
- `https://usonlinetools.com/sitemap-tools-css-design.xml` (18 CSS tools)
- `https://usonlinetools.com/sitemap-tools-seo.xml` (13 SEO tools)
- `https://usonlinetools.com/sitemap-tools-security.xml` (15 security tools)
- `https://usonlinetools.com/sitemap-tools-social-media.xml` (11 social media tools)

---

## 2. Priority URL Inspection Checklist (Post-Deploy)

Following live deployment on Hostinger, inspect the following representative URLs in GSC URL Inspection Tool and request indexing:

1. **Homepage:** https://usonlinetools.com/ (Verify 200 OK, root rewrite resolution)
2. **Top Category Hubs:**
   - https://usonlinetools.com/category/math
   - https://usonlinetools.com/category/construction
   - https://usonlinetools.com/category/finance
3. **High-Value English Tools:**
   - https://usonlinetools.com/math/online-percentage-calculator
   - https://usonlinetools.com/construction/concrete-calculator
   - https://usonlinetools.com/finance/online-compound-interest-calculator
   - https://usonlinetools.com/time-date/online-business-days-calculator
   - https://usonlinetools.com/developer/json-formatter-and-validator
4. **Multilingual & Localized Tools:**
   - https://usonlinetools.com/yuzde-hesaplama (Turkish Percentage Calculator)
   - https://usonlinetools.com/ar/hesab-alomr (Arabic Age Calculator with RTL)
   - https://usonlinetools.com/calculo-rescisao (Portuguese CLT Termination Calculator)
5. **Historical Overrides:**
   - https://usonlinetools.com/calculators/ovulation-calculator/ (Trailing slash canonical preserved)

---

## 3. GSC Monitoring Views & Priority Segmentation

### A. Performance Segmentation by Country (Tier-1 Growth Focus)
Monitor and segment impressions, clicks, CTR, and average position for high-value organic markets:
- **Primary Tier-1:** United States (USA), United Kingdom (GBR), Canada (CAN), Australia (AUS)
- **Secondary High-Value:** Germany (DEU), Netherlands (NLD), Switzerland (CHE), Nordic countries (SWE, NOR, DNK, FIN)

### B. CTR Optimization Matrix (Positions 4–20)
Track queries and pages exhibiting:
- **High Impressions (> 1,000 / month) + Low CTR (< 2.5%)** with average positions between 4 and 20.
- Execute iterative title and meta description enhancements per the CTR optimization workflow in docs/seo/MASTER_IMPLEMENTATION_PLAN.md.

### C. Topical Intent Groups
Filter queries into 8 strategic topic clusters:
1. Construction & Materials (concrete, gravel, paint, roofing, mulch, stairs, bricks)
2. Finance & Money (interest, loan EMI, mortgage, profit margin, ROI, tax, CAGR)
3. Developer & Web (JSON, regex, Base64, UUID, URL encode, CSS gradient, hash)
4. Math & Arithmetic (percentage, fractions, decimals, ratios, standard deviation, roots)
5. Health & Body (BMI, BMR, TDEE, calories, body fat, sleep cycle, pregnancy due date)
6. Time & Date (age calculation, working days, event countdown, time zones)
7. PDF & Document Tools (merge, split, compress, PDF to JPG, rotate)
8. Image & Media Tools (resize, compress, PNG to JPG, color picker, contrast checker)

---

## 4. Indexing Health & Error Elimination Protocol

Monitor the **Page Indexing** report weekly:
- **Expected Valid Index:** 430 canonical URLs.
- **Excluded by 'noindex' tag:** Exactly 1 URL (https://usonlinetools.com/404.html).
- **Page with redirect (301):** 637 legacy /tools/:slug and legacy category routes smoothly resolving to canonicals.
- **Duplicate without user-selected canonical:** Target = 0.
- **Alternate page with proper canonical tag:** Target = 0 unexpected entries.
- **Not found (404):** Target = 0 canonical pages returning 404.
