# USOnlineTools.com — Antigravity Full SEO / AEO / GEO Recovery & Growth Execution System

> **Project:** USOnlineTools.com  
> **Website:** https://usonlinetools.com/  
> **Business model:** 400+ simple browser/client-side tools, calculators, converters, generators, editors and utilities  
> **Primary goal:** Repair technical SEO, restore indexing, improve content quality, strengthen AEO/GEO/AI visibility, configure measurement, prioritize useful tools, grow Tier-1 organic traffic, and prepare the repository for GitHub → Hostinger deployment.  
> **Final target:** Build a sustainable path toward **1,000,000 organic clicks/month**, with strong traffic from the United States, United Kingdom, Canada, Australia and other high-value markets.  
> **Execution engine:** Antigravity  
> **Working method:** Phase-by-phase only. Do not make uncontrolled site-wide changes.

---

# MASTER INSTRUCTION TO ANTIGRAVITY

You are the technical SEO, product SEO, frontend engineering, analytics, information architecture, content optimization, AEO/GEO and deployment agent for this project.

Your job is not to produce a theoretical SEO report.

Your job is to:

1. inspect the actual repository,
2. inspect the live website,
3. identify all relevant problems,
4. fix them in the codebase,
5. test every important fix,
6. improve the content and architecture,
7. configure SEO/AEO/GEO foundations,
8. configure Search Console and analytics implementation where access exists,
9. create reliable automated QA,
10. prepare the final production-ready repository,
11. stop and ask the user for the GitHub repository URL only when the codebase is ready,
12. upload/push the completed repository to GitHub after the user provides the repository,
13. provide the exact Hostinger Git deployment instructions,
14. wait until the user confirms the updated version is live,
15. audit the live production website again,
16. provide a final before/after SEO implementation report.

Do not skip phases.

Do not declare a phase complete without testing it.

Do not claim an issue is fixed merely because code was changed.

A fix is complete only when the acceptance criteria for that phase pass.

---

# IMPORTANT WORKFLOW RULE

Work in this order:

```text
AUDIT
→ FIX
→ TEST
→ DOCUMENT
→ COMMIT/CHANGELOG
→ NEXT PHASE
```

At the end of every phase, return:

```markdown
## Phase X Complete

### What was found
- ...

### What was changed
- ...

### Files changed
- ...

### Tests performed
- ...

### Results
- PASS / FAIL

### Remaining risks
- ...

### Next phase
Phase X+1 — ...
```

Then continue only if the workflow is configured to proceed automatically.

If the user has asked for step-by-step execution, stop after the phase summary and wait for `NEXT`.

---

# PROJECT SAFETY RULES

## Never break tool functionality

The website contains hundreds of tools.

Do not:

- replace real formulas with placeholder formulas,
- simplify working tools merely to standardize the UI,
- remove validation required by an existing calculator,
- change output values without testing,
- replace browser processing with server processing without a real need,
- remove useful features because they are difficult to preserve.

Before changing tool logic, create tests.

---

# NEVER MAKE THESE SEO MISTAKES

Do not:

- generate hundreds of thin AI pages,
- create keyword doorway pages,
- create a page for every tiny long-tail query,
- mass-translate all 400+ tools into many languages,
- add fake reviews,
- add fake ratings,
- add fake authors,
- invent expert reviewers,
- invent citations,
- invent official rules,
- keyword-stuff titles,
- keyword-stuff internal anchor text,
- add FAQ schema to every page,
- treat `llms.txt` as a Google ranking factor,
- create fake “GEO schema,”
- change all URLs just to make them look cleaner,
- delete old URLs without redirect analysis,
- put redirecting URLs in the sitemap,
- use robots.txt as a replacement for proper noindex/canonical decisions,
- update every `lastmod` date on every deploy,
- add structured data that is not represented on the page,
- claim every tool is private/client-side unless technically verified.

---

# KNOWN AUDIT ISSUES TO VERIFY FIRST

Previous analysis identified the following serious issues.

Antigravity must verify them independently against the repository and live website.

## Critical

1. Root homepage has been seen returning an HTTP `404`.
2. Individual tool pages can return `200`.
3. Some important URLs are reported as:
   `Crawled - currently not indexed`.
4. The sitemap audit exposed far fewer URLs than the claimed 400+ tools.
5. Duplicate/legacy URL patterns exist.
6. Ratio Calculator has had several competing URLs.
7. Category pages are thin and weak as topical hubs.
8. Internal linking is shallow.
9. Some localized pages do not use `hreflang`.
10. Tool page content appears heavily templated.
11. The site has had significant loss of Search Console impressions/clicks.
12. Several tools historically had impressions but have weak current visibility.

---

# HISTORICALLY INTERESTING TOOLS

Do not remove these without Search Console and intent analysis.

Examples of tools that previously showed search signals include:

```text
Number to Words Converter
Loan Interest Calculator
Ovulation Calculator
Exponent Calculator
Image Filter Editor
Matrix Calculator
Hourly to Salary Calculator
BMI Calculator
Roof Area Calculator
Depreciation Calculator
Cycling Calories Calculator
Homework Time Calculator
TikTok Character Counter
CSS Triangle Generator
Event Countdown Timer
Character Counter
Business Days Calculator
```

These are starting points, not guaranteed winners.

---

# SUCCESS MODEL

The project is not considered successful because:

```text
400 pages are indexed
```

Success means:

```text
important pages return correct status codes
search engines can discover the full canonical site
priority tools are indexed
priority tools rank for relevant intent
Tier-1 impressions grow
CTR improves
tool usage grows
internal linking distributes authority
content is genuinely useful
crawl waste is reduced
analytics works
GSC data is clean
AI-assisted search can clearly understand the pages
```

---

# PHASE 0 — CREATE PROJECT CONTROL FILES

## Objective

Before changing the site, establish an auditable project workspace.

Create:

```text
/docs/seo/
```

Create these files:

```text
/docs/seo/MASTER_IMPLEMENTATION_PLAN.md
/docs/seo/PHASE_STATUS.md
/docs/seo/TECH_STACK.md
/docs/seo/BASELINE_AUDIT.md
/docs/seo/CHANGELOG.md
/docs/seo/DECISIONS.md
/docs/seo/REDIRECT_MAP.csv
/docs/seo/URL_INVENTORY.csv
/docs/seo/TOOL_SCORECARD.csv
/docs/seo/KEYWORD_MAP.csv
/docs/seo/INTERNAL_LINK_MAP.csv
/docs/seo/FINAL_LIVE_AUDIT.md
```

Copy this master plan into:

```text
/docs/seo/MASTER_IMPLEMENTATION_PLAN.md
```

Create the following phase table inside `PHASE_STATUS.md`:

| Phase | Name | Status | Date | Notes |
|---|---|---|---|---|
| 0 | Project controls | IN PROGRESS | | |
| 1 | Repository & live-site audit | NOT STARTED | | |
| 2 | Critical routing / HTTP repair | NOT STARTED | | |
| 3 | URL inventory & indexability | NOT STARTED | | |
| 4 | Duplicate URLs / canonicals / redirects | NOT STARTED | | |
| 5 | Sitemap / robots / crawl management | NOT STARTED | | |
| 6 | Site architecture / internal linking | NOT STARTED | | |
| 7 | Tool page quality system | NOT STARTED | | |
| 8 | Category hub rebuild | NOT STARTED | | |
| 9 | Metadata / CTR optimization | NOT STARTED | | |
| 10 | Structured data cleanup | NOT STARTED | | |
| 11 | AEO / GEO / AI retrieval | NOT STARTED | | |
| 12 | International SEO | NOT STARTED | | |
| 13 | Performance / Core Web Vitals | NOT STARTED | | |
| 14 | GSC implementation | NOT STARTED | | |
| 15 | Analytics implementation | NOT STARTED | | |
| 16 | Tool portfolio pruning/prioritization | NOT STARTED | | |
| 17 | Tier-1 growth pages | NOT STARTED | | |
| 18 | Authority / content engine | NOT STARTED | | |
| 19 | Automated SEO QA | NOT STARTED | | |
| 20 | Pre-deployment audit | NOT STARTED | | |
| 21 | GitHub handoff | NOT STARTED | | |
| 22 | Hostinger deployment handoff | NOT STARTED | | |
| 23 | Production live audit | NOT STARTED | | |
| 24 | Final report | NOT STARTED | | |

## Acceptance criteria

- All control files created.
- No functionality changed.
- Project can now be audited systematically.

---

# PHASE 1 — COMPLETE REPOSITORY + LIVE WEBSITE AUDIT

## Objective

Understand what actually exists before making decisions.

---

## 1.1 Detect the technical stack

Document:

```text
framework
language
frontend library
router
package manager
build system
rendering method
static generation
server-side rendering
client-side rendering
Hostinger deployment model
environment variables
SEO library
metadata implementation
schema implementation
sitemap implementation
robots implementation
redirect implementation
analytics implementation
```

Write findings to:

```text
/docs/seo/TECH_STACK.md
```

---

## 1.2 Count the actual tools

Do not trust marketing text saying “400+”.

Determine:

```text
total tool definitions
total public tool routes
total category routes
total language routes
total legacy routes
total redirect routes
total hidden/test routes
```

---

## 1.3 Crawl the live site

Audit all discoverable production URLs.

For each URL record:

```text
URL
HTTP status
final URL
redirect chain
canonical
robots status
meta robots
title
meta description
H1
language
hreflang
word count
internal links in
internal links out
structured data
indexability
sitemap presence
content type
category
```

Write to:

```text
/docs/seo/URL_INVENTORY.csv
```

---

## 1.4 Audit Search Console if access exists

If GSC access is available, analyze:

```text
last 28 days
last 90 days
last 6 months
previous-period comparisons
```

Collect:

```text
clicks
impressions
CTR
average position
top pages
top queries
countries
devices
indexing state
sitemap state
URL inspection samples
cannibalization
queries position 4–20
high-impression zero-click pages
```

If GSC access is unavailable:

Do NOT invent data.

Instead write:

```text
GSC ACCESS REQUIRED
```

and prepare the exact steps/query list for later execution.

---

## 1.5 Audit analytics if available

Check whether GA4 or another analytics platform exists.

Record:

```text
property/configuration
traffic volume
organic users
landing pages
country
device
engagement
tool events
conversions/key events
AI/referral traffic if measurable
```

If analytics is missing, mark it for Phase 15.

---

## 1.6 Audit content duplication

Identify:

- repeated intros,
- repeated FAQs,
- identical descriptions,
- near-duplicate tool pages,
- thin pages,
- duplicate search intent,
- translated pages with untranslated UI,
- outdated content,
- incorrect formulas,
- placeholder content.

---

## 1.7 Audit site trust

Review:

```text
About
Contact
Privacy
Terms
Editorial/process explanation
Data processing claims
Health disclaimers
Finance disclaimers
Construction disclaimers
Source citations
```

---

## 1.8 Baseline report

Create:

```text
/docs/seo/BASELINE_AUDIT.md
```

Include severity:

```text
CRITICAL
HIGH
MEDIUM
LOW
OPPORTUNITY
```

Do not begin mass fixes until this report exists.

---

# PHASE 2 — CRITICAL ROUTING & HTTP REPAIR

## Objective

Repair problems that can prevent the entire site from ranking.

---

## 2.1 Homepage

Verify:

```text
https://usonlinetools.com/
```

returns:

```text
200
```

from:

- browser,
- curl/server request,
- mobile user agent,
- crawler-compatible request.

If it returns 404:

Find the actual cause.

Possible sources:

```text
SPA rewrite
static build output
index.html missing
Hostinger rewrite rule
.htaccess
router fallback
framework config
deployment path
```

Fix the root cause.

---

## 2.2 Correct 404 behavior

Fake route:

```text
/random-page-that-does-not-exist-938392
```

must return:

```text
404
```

Do not return 200.

Create a useful custom 404 page:

```text
search
popular tools
categories
homepage link
```

Do not make it indexable.

---

## 2.3 Server-side discoverability

Important pages must not return server 404 and only appear after JavaScript routing.

For every important canonical URL:

```text
initial request
→ valid page response
```

---

## 2.4 Essential pages

Verify:

```text
/
about
privacy-policy
terms-of-service
categories
priority tools
localized priority tools
robots.txt
sitemap.xml
```

---

## Acceptance gate

Do not proceed until:

```text
homepage = 200
valid tools = 200
invalid URLs = 404
robots.txt = 200
sitemap.xml = 200
```

Document proof.

---

# PHASE 3 — URL INVENTORY & INDEXABILITY

## Objective

Decide exactly what Google should and should not index.

Every public route must receive one classification:

```text
INDEX
NOINDEX
REDIRECT
REMOVE
REVIEW
```

---

## INDEX

Use for:

- unique working tools,
- strong category hubs,
- useful guides,
- properly localized tools,
- About/important trust resources where appropriate.

---

## NOINDEX

Possible examples:

```text
internal search results
filter states
test pages
internal utilities
temporary campaign pages
account areas
```

---

## REDIRECT

Use for:

- old tool route,
- duplicate route,
- trailing-slash duplicate,
- old category path,
- misspelled slug with history.

---

## REMOVE

Use cautiously.

Only use for:

```text
test pages
accidental garbage routes
unrecoverable junk
```

If the URL has history or backlinks, prefer redirect.

---

## Important

Do not classify “zero clicks” as “remove”.

Indexation problems must be repaired first.

---

# PHASE 4 — CANONICALS, DUPLICATES & REDIRECTS

## Objective

Create one authoritative URL per intent.

---

## 4.1 URL policy

Choose:

```text
HTTPS
one hostname
lowercase
hyphenated slugs
one trailing-slash convention
```

Document it.

---

## 4.2 Canonical policy

Every indexable page must have one self-referencing canonical.

Example:

```html
<link rel="canonical" href="https://usonlinetools.com/...">
```

Canonical must:

```text
return 200
not redirect
not be noindex
not point to another language accidentally
```

---

## 4.3 Known duplicates

Investigate examples such as:

```text
/tools/ratio-calculator
/math/ratio-calculator
/math/ratio-calculator/
```

Choose one final URL.

Redirect others using 301.

---

## 4.4 Redirect map

Maintain:

```text
/docs/seo/REDIRECT_MAP.csv
```

Columns:

```text
old_url
new_url
reason
status
tested
```

---

## 4.5 No redirect chains

Bad:

```text
A → B → C
```

Good:

```text
A → C
B → C
```

---

## 4.6 Update internal links

Never rely on internal links to old URLs.

Point all navigation directly to final canonical pages.

---

# PHASE 5 — SITEMAP, ROBOTS & CRAWL MANAGEMENT

## Objective

Expose the real canonical site clearly.

---

## 5.1 Generate sitemap from canonical source of truth

The sitemap must be generated automatically from actual routes/tool data.

Do not manually maintain hundreds of URLs.

---

## 5.2 Sitemap inclusion rules

Include only:

```text
200
canonical
indexable
production
```

Exclude:

```text
301
302
404
410
noindex
duplicate
test
search result
filter URL
```

---

## 5.3 Sitemap structure

Recommended:

```text
/sitemap.xml
/sitemaps/tools.xml
/sitemaps/categories.xml
/sitemaps/guides.xml
/sitemaps/ar.xml
/sitemaps/tr.xml
/sitemaps/pt-br.xml
/sitemaps/id.xml
```

Only create language sitemaps when they have content.

---

## 5.4 `lastmod`

Only change `lastmod` when:

```text
tool functionality changed
substantial content changed
important data/rules changed
```

Do not set all pages to today's date during every build.

---

## 5.5 robots.txt

Default:

```text
User-agent: *
Allow: /

Sitemap: https://usonlinetools.com/sitemap.xml
```

Add targeted exclusions only when needed.

Do not block:

```text
CSS
JS required for rendering
important pages
```

---

## 5.6 Search Console sitemap

If access exists:

- submit clean sitemap,
- remove obsolete sitemap submissions when safe,
- verify processing,
- record discovered/indexed state.

---

## 5.7 IndexNow

Optional but recommended for Bing ecosystem.

Submit only:

```text
new URLs
material updates
removed URLs
```

Do not resubmit entire site on every small deploy.

---

# PHASE 6 — INFORMATION ARCHITECTURE & INTERNAL LINKING

## Objective

Turn a 400+ tools warehouse into an understandable topical ecosystem.

---

## 6.1 Main clusters

Potential top-level clusters:

```text
Calculators
Conversion
Construction
Finance
Math
Education
Time & Date
Developer
CSS & Design
Image
PDF
Productivity & Text
SEO
Social Media
Security
Health
Gaming
```

Use actual inventory.

---

## 6.2 Subclusters

Example:

```text
Construction
├── Concrete & Masonry
├── Roofing
├── Flooring
├── Landscaping
├── Material Estimates
├── Electrical
└── Measurement
```

Example:

```text
Developer
├── JSON
├── XML
├── YAML
├── Encoding
├── Regex
└── Web/CSS
```

---

## 6.3 Crawl depth

Priority pages should generally be:

```text
Home → Category → Tool
```

or:

```text
Home → Category → Subcategory → Tool
```

Maximum desired depth for important pages:

```text
3 clicks
```

---

## 6.4 Related tools

Every priority tool should have 6–10 contextually related tools.

No random “SEO link blocks”.

---

## 6.5 Breadcrumbs

Example:

```text
Home > Construction > Concrete Calculator
```

Use normal anchor links.

---

## 6.6 Homepage

The homepage should contain:

```text
site search
popular tools
major categories
featured clusters
recently improved tools
trust/privacy explanation
about/methodology link
```

Do not list all 400+ tools in one giant wall.

---

## 6.7 Orphan check

Automate detection of indexable URLs with:

```text
0 internal links in
```

No strategic tool should remain orphaned.

---

# PHASE 7 — TOOL PAGE QUALITY SYSTEM

## Objective

Upgrade actual product quality rather than merely adding SEO text.

---

## Recommended page structure

```text
Breadcrumb
H1
Short purpose statement
Tool UI
Result/output
How to use
Formula/method
Worked example
Interpretation
Assumptions
Common mistakes
Related tools
Sources when relevant
FAQ only if useful
Last reviewed where needed
```

Do not force every section onto every tool.

---

## Tool position

The main tool should appear near the top.

Never force users to read long SEO content before using the tool.

---

## Minimum uniqueness

Every priority tool should have unique:

```text
purpose
inputs
output explanation
example
method
edge cases
related tools
```

---

## Do not generate filler

Bad:

```text
Our free online calculator is easy to use and very useful.
This free online calculator helps users calculate values online.
Use our free online calculator today.
```

Delete content like this.

---

## Tool features

Where appropriate add:

```text
copy result
reset
download
print
CSV
PDF
unit switch
shareable state
scenario comparison
visualization
```

Do not add useless buttons.

---

## Testing

Add tests for formulas.

Test:

```text
normal case
zero
decimal
large number
invalid input
boundary values
```

---

# PHASE 8 — CATEGORY HUB REBUILD

## Objective

Make category pages rankable, useful, and powerful internal linking hubs.

---

## Category template

Example:

```text
H1

Short category explanation

Featured tools

Subcategory 1
- tool cards

Subcategory 2
- tool cards

How to choose the right tool

Important concept/reference section

Popular related tools

FAQ only if it genuinely helps
```

---

## Content

Do not target arbitrary word count.

Most useful hubs may naturally contain:

```text
600–1500 words
```

But utility is the target.

---

## Internal linking

Each hub must link to important tools in the category.

High-value tools should be featured higher.

---

# PHASE 9 — METADATA & CTR OPTIMIZATION

## Objective

Improve relevance and turn impressions into clicks.

---

## Titles

Avoid uniform titles such as:

```text
Online X | US Online Tools
```

Use intent-rich titles.

Examples:

```text
Concrete Calculator — Estimate Volume & Material
JSON Formatter & Validator — Format JSON Online
Number to Words Converter — Convert Numbers to English Words
Business Days Calculator — Count Working Days Between Dates
```

---

## Meta descriptions

Use:

```text
what it does
+ meaningful feature
+ context
```

Avoid generic claims.

---

## Search Console CTR workflow

If GSC access exists:

Find pages with:

```text
high impressions
position 3–20
low CTR
```

For each:

1. inspect queries,
2. inspect live SERP intent,
3. improve title,
4. improve meta,
5. improve content match,
6. log the change date.

Do not change every title at once.

---

## Keyword mapping

Create:

```text
/docs/seo/KEYWORD_MAP.csv
```

Columns:

```text
url
primary_intent
primary_keyword
secondary_queries
country
language
intent
priority
notes
```

One canonical URL should own one primary intent cluster.

---

# PHASE 10 — STRUCTURED DATA CLEANUP

## Objective

Use truthful schema, not schema spam.

---

## Site level

Use when correct:

```text
Organization
WebSite
```

---

## Tool pages

Use only what accurately represents the page.

Potential:

```text
WebPage
BreadcrumbList
SoftwareApplication
WebApplication
```

Do not blindly attach every schema type.

---

## Remove unsupported/fake markup

Never invent:

```text
reviewCount
ratingValue
offers
price
author expertise
awards
```

---

## FAQ

Human-readable FAQs are allowed.

Do not build the site around FAQ rich result expectations.

Use FAQ structured data only when current Google rules support the page/use case and it accurately reflects visible content.

---

# PHASE 11 — AEO / GEO / AI SEARCH OPTIMIZATION

## Objective

Make pages easy for answer engines and AI-assisted search systems to interpret and cite.

Do this through clarity and usefulness.

Do not create fake “GEO tricks”.

---

## 11.1 Direct answer sections

Where helpful:

```markdown
## What is a concrete calculator?

A concrete calculator estimates how much concrete is required from project dimensions and converts the result into units such as cubic feet, cubic yards or cubic meters.
```

Short.

Clear.

Accurate.

---

## 11.2 Explicit formulas

Example:

```text
Volume = Length × Width × Thickness
```

Explain units.

---

## 11.3 Worked examples

Use original examples with actual numbers.

---

## 11.4 Semantic headings

Prefer:

```text
How it works
Formula
Example
Result interpretation
Assumptions
Common mistakes
Units
```

Avoid vague headings.

---

## 11.5 Sources

For claims that depend on external facts:

Prefer:

```text
government
standards organization
official documentation
primary scientific source
official tax authority
```

Do not cite low-quality aggregators when primary sources exist.

---

## 11.6 Citation-ready content

Write concise factual blocks that can stand independently.

Do not stuff keywords.

---

## 11.7 Unique value

AI can answer basic facts.

The website must provide value AI cannot replace easily:

```text
interactive tools
visual output
scenario analysis
downloadable results
validation
batch processing
conversion
privacy/local processing
reference data
tested formulas
```

---

## 11.8 About / methodology pages

Create or strengthen:

```text
About
How tools are built/tested
Privacy/data handling
Corrections/contact
```

Do not invent experts.

---

## 11.9 llms.txt

Optional.

If implemented:

```text
/llms.txt
```

Use it as a documentation/discovery aid only.

Do not claim it increases Google rankings.

---

# PHASE 12 — INTERNATIONAL SEO

## Objective

Make multilingual pages coherent, accurate and technically connected.

---

## Verify existing languages

Likely examples:

```text
Arabic
Turkish
Portuguese
Indonesian
```

Determine actual inventory.

---

## lang attribute

Use correct page language:

```html
<html lang="ar">
<html lang="tr">
<html lang="pt-BR">
<html lang="id">
```

---

## hreflang

Use only for true equivalents.

Example:

```html
<link rel="alternate" hreflang="en" href="...">
<link rel="alternate" hreflang="tr" href="...">
<link rel="alternate" hreflang="x-default" href="...">
```

Every language page in a cluster should return reciprocal references.

---

## Full localization

Translate:

```text
tool labels
validation
buttons
examples
metadata
explanatory content
units/currency context
```

Do not translate only the H1.

---

## Arabic

Ensure proper RTL layout.

Tool inputs that require left-to-right numeric behavior should remain usable.

---

## International content quality

Do not bulk-translate hundreds of weak pages.

Only expand localized tools after:

```text
search demand
low/moderate competition
clear usefulness
```

---

# PHASE 13 — PERFORMANCE & CORE WEB VITALS

## Objective

Fast mobile tools with stable layouts.

---

## Targets

Aim for:

```text
LCP <= 2.5 seconds
INP <= 200 ms
CLS <= 0.1
```

---

## Audit

Check:

```text
JS bundle size
unused packages
third-party scripts
ad scripts
font loading
images
layout shift
tool result rendering
hydration
route loading
```

---

## Improvements

Use:

```text
code splitting
lazy loading
deferred noncritical scripts
responsive images
explicit image dimensions
reserved ad slots
system fonts where suitable
```

---

## Client-side tools

Large data transformations may need:

```text
Web Workers
debouncing
size limits
streaming/incremental processing
```

---

# PHASE 14 — GOOGLE SEARCH CONSOLE IMPLEMENTATION

## Objective

Use GSC as the SEO control system.

---

## If GSC is accessible

Verify:

```text
correct property
sitemap
indexing
manual actions
security issues
HTTPS
Core Web Vitals
page indexing
```

---

## Submit clean sitemap

After deployment:

```text
https://usonlinetools.com/sitemap.xml
```

---

## Inspect representative pages

Inspect:

```text
homepage
top category
top English tool
localized tool
historically strong tool
new/updated tool
```

---

## Build GSC monitoring views

Track:

### Pages

```text
high impressions
low CTR
positions 4–20
losing clicks
new impressions
```

### Countries

Prioritize:

```text
US
UK
Canada
Australia
Germany
Netherlands
Switzerland
Nordics
```

### Queries

Group by:

```text
construction
developer
conversion
math
finance
health
time/date
productivity
```

---

## Record baseline

Save GSC baseline in documentation before deployment.

---

# PHASE 15 — ANALYTICS IMPLEMENTATION

## Objective

Measure whether people actually use the tools.

---

## GA4

If GA4 exists:

Audit current setup.

If not:

Prepare implementation.

---

## Recommended events

```text
tool_view
tool_calculate
tool_reset
tool_copy_result
tool_download
tool_print
related_tool_click
category_click
site_search
site_search_result_click
```

---

## Privacy

Do not send:

```text
health inputs
financial amounts
personal identifiers
user-entered text that may be private
uploaded file content
```

Use generic event metadata.

Example:

```text
tool_name
category
language
action
```

---

## Key metrics

Track:

```text
organic users
tool usage
calculation completion
returning users
country
device
landing page
related tool navigation
```

---

## AI referral tracking

Where measurable, track referrals from:

```text
ChatGPT
Perplexity
Copilot
Gemini
Claude
```

Do not confuse Google AI Overview traffic with a separate reliable referral channel if it cannot be separated.

---

# PHASE 16 — TOOL PORTFOLIO PRIORITIZATION

## Objective

Decide what to improve, merge or eventually remove.

---

## Create TOOL_SCORECARD.csv

Columns:

```text
url
tool
category
indexed
clicks_28d
impressions_28d
clicks_90d
impressions_90d
clicks_6m
impressions_6m
avg_position
ctr
tier1_relevance
tool_usage
internal_links
duplicate_risk
competition
unique_value
accuracy_risk
decision
priority
```

---

## Classes

```text
A — HERO
B — GROWTH
C — MAINTAIN
D — MERGE
E — REMOVE/NOINDEX
```

---

## HERO

Top 30–50 tools.

Receive:

```text
content
UX
testing
links
CTR work
authority work
```

first.

---

## MERGE

Use when two pages satisfy the same search intent and user job.

Redirect weaker page.

---

## REMOVE

Only after:

```text
indexing is healthy
page has had enough observation time
no search demand
no usage
no links
no strategic value
```

---

# PHASE 17 — TIER-1 ORGANIC GROWTH PLAN

## Objective

Grow high-value traffic rather than only total page count.

---

## Priority markets

```text
United States
United Kingdom
Canada
Australia
Germany
Netherlands
Switzerland
Norway
Sweden
Denmark
```

---

## Strong clusters to prioritize

### Construction

Potential:

```text
Concrete Calculator
Concrete Slab Calculator
Asphalt Calculator
Gravel Calculator
Roof Area Calculator
Drywall Calculator
Fence Calculator
Flooring Calculator
Paint Calculator
Mulch Calculator
Rebar Calculator
Brick Calculator
```

---

### Developer/CSS

Potential:

```text
JSON Formatter
JSON Minifier
JSON Path Tester
YAML to JSON
XML Formatter
Regex Tester
Base64
URL Encode/Decode
CSS Shadow Generator
CSS Gradient Generator
CSS Grid Generator
CSS Flexbox Generator
Color Contrast Checker
```

---

### Time / productivity

Potential:

```text
Business Days Calculator
Time Duration Calculator
Countdown
Reading Time
Character Counter
Line Counter
Duplicate Line Remover
Random Picker
```

---

### Country-specific

Only after validating official rules.

Examples:

```text
US Sales Tax
UK VAT
Canada GST/HST
Australia GST
Germany MwSt
```

These require maintenance.

---

## New page gate

Never create a new tool unless:

```text
[ ] real user problem
[ ] measurable demand
[ ] not duplicate intent
[ ] technically feasible
[ ] can be more useful than existing SERP results
[ ] correct formula/method available
[ ] internal link cluster exists
[ ] clear canonical URL
[ ] maintenance burden understood
```

---

# PHASE 18 — CONTENT & AUTHORITY ENGINE

## Objective

Build authority with useful assets.

---

## Avoid generic blog spam

Do not publish:

```text
Top 10 Online Tools
Why Calculators Are Useful
Benefits of Online Tools
```

unless there is genuinely unique value.

---

## Build reference assets

Examples:

```text
Construction material reference tables
Unit conversion references
JSON reference pages
CSS reference pages
Social platform character limits
Time/date reference guides
```

---

## Build link-worthy features

Examples:

```text
embeddable calculator
accessible developer tool
downloadable template
interactive reference
original comparison table
```

---

## Outreach

Target:

```text
teachers
universities
developer sites
construction publications
small-business resources
technical blogs
resource pages
```

No spam.

---

# PHASE 19 — AUTOMATED SEO QA

## Objective

Prevent regressions.

Create automated scripts for:

```text
homepage status
route status
canonical validity
duplicate title
missing title
duplicate H1
missing H1
broken internal links
orphan URLs
sitemap validation
redirects in sitemap
404s in sitemap
noindex in sitemap
JSON-LD syntax
hreflang reciprocity
```

---

## Suggested commands

Adapt to actual stack:

```bash
npm run seo:audit
npm run seo:links
npm run seo:sitemap
npm run seo:metadata
npm run seo:hreflang
npm run test
npm run build
```

---

## CI

Create GitHub Actions after the repository setup is known.

The deployment pipeline should block:

```text
failed build
homepage route failure
invalid sitemap
broken canonical
critical internal link errors
```

---

# PHASE 20 — PRE-DEPLOYMENT FULL AUDIT

## Objective

Do not send broken code to GitHub.

Run all project tests.

---

## Pre-deployment checklist

```text
[ ] build PASS
[ ] lint PASS
[ ] unit tests PASS
[ ] calculator tests PASS
[ ] SEO audit PASS
[ ] sitemap PASS
[ ] redirects PASS
[ ] homepage local/prod-preview PASS
[ ] fake route 404 PASS
[ ] robots PASS
[ ] canonical PASS
[ ] hreflang PASS
[ ] schema PASS
[ ] mobile UI PASS
[ ] analytics code validated
[ ] no secrets committed
```

---

## Create final pre-deploy report

Write:

```text
/docs/seo/PRE_DEPLOY_REPORT.md
```

Include:

```text
issues found
issues fixed
issues intentionally deferred
tests
remaining risks
```

---

# PHASE 21 — GITHUB HANDOFF

## Objective

Only after the project passes Phase 20, prepare to upload the finished code.

---

## STOP POINT

At this point Antigravity must say:

```text
The updated repository is ready for GitHub.

Please provide the GitHub repository URL.
```

Do not guess the URL.

Do not create a new repository unless the user explicitly asks.

---

## After user provides GitHub URL

1. Verify Git status.
2. Confirm `.gitignore`.
3. Confirm no secrets.
4. Add remote if required.
5. Pull/fetch carefully if repository already contains code.
6. Avoid overwriting unrelated remote work.
7. Resolve conflicts safely.
8. Commit all completed work.
9. Push to the requested branch.
10. Return:
   - repository URL,
   - branch,
   - commit hash,
   - commit message,
   - files changed summary.

Recommended final commit:

```text
feat(seo): complete USOnlineTools technical SEO, AEO, GEO and analytics rebuild
```

If the project has multiple commits, preserve the phase commits.

---

# PHASE 22 — HOSTINGER DEPLOYMENT HANDOFF

## Objective

Prepare safe Git deployment from GitHub to Hostinger.

The user intends to deploy using Hostinger's Git functionality.

Do not deploy before GitHub is successfully updated.

---

## Determine deployment model

Based on actual stack:

### Static / PHP

Likely deploy to:

```text
public_html
```

but verify structure.

### Node.js / Next / React SSR

Use Hostinger's Node.js/web app deployment flow.

Do not copy source blindly to `public_html`.

Determine:

```text
Node version
install command
build command
start command
output directory
environment variables
```

---

## Provide exact instructions

Create:

```text
/docs/seo/HOSTINGER_DEPLOYMENT.md
```

Include project-specific:

```text
GitHub repository
branch
deployment directory
build command
start command
environment variables
post-deploy checks
rollback instructions
```

---

## Do not deploy secrets

Environment variables should be configured in Hostinger.

Never put them in Git.

---

## Production tag

Before deployment, create or recommend:

```text
production-pre-seo-rebuild
```

so rollback is easy.

---

# PHASE 23 — POST-DEPLOYMENT LIVE WEBSITE AUDIT

## Objective

After the user deploys from GitHub to Hostinger, verify the actual production site.

---

## WAIT CONDITION

Do not run this phase until the user confirms:

```text
The new version is live.
```

Then audit:

```text
https://usonlinetools.com/
```

---

## 23.1 HTTP audit

Check:

```text
homepage = 200
important categories = 200
priority tools = 200
old duplicates = 301
fake URL = 404
robots.txt = 200
sitemap.xml = 200
```

---

## 23.2 Sitemap audit

Verify:

```text
count
canonical URLs
no redirects
no 404
no noindex
correct host
correct protocol
language sitemaps
```

---

## 23.3 Metadata audit

Sample at least:

```text
homepage
5 categories
20 hero tools
10 growth tools
5 localized pages
```

Check:

```text
title
description
H1
canonical
robots
language
hreflang
schema
```

---

## 23.4 Internal link audit

Check:

```text
orphan pages
broken links
crawl depth
related tools
breadcrumbs
category linking
```

---

## 23.5 Performance audit

Check mobile performance.

Measure or estimate:

```text
LCP
INP
CLS
JS weight
layout shift
tool responsiveness
```

---

## 23.6 Analytics validation

Confirm:

```text
page view
tool event
organic channel
country/device
```

Do not submit sensitive input values.

---

## 23.7 Search Console

If GSC access exists:

- resubmit sitemap if required,
- inspect updated homepage,
- inspect representative tools,
- record current states,
- note that indexing/ranking recovery takes time.

Do not claim immediate ranking recovery.

---

# PHASE 24 — FINAL LIVE REPORT

## Objective

Provide the user with a clear implementation and production status report.

Create:

```text
/docs/seo/FINAL_LIVE_AUDIT.md
```

Also return the report in chat.

---

## Required report structure

# USOnlineTools.com Final SEO / AEO / GEO Report

## 1. Executive summary

State:

```text
what was wrong
what was repaired
what remains
```

---

## 2. Before vs After

Table:

| Area | Before | After | Status |
|---|---|---|---|
| Homepage status | | | |
| Canonicals | | | |
| Sitemap | | | |
| Duplicate URLs | | | |
| Internal linking | | | |
| Category pages | | | |
| Tool quality | | | |
| Metadata | | | |
| Structured data | | | |
| hreflang | | | |
| Performance | | | |
| Analytics | | | |
| GSC | | | |
| AEO/GEO readiness | | | |

---

## 3. Critical checks

Use:

```text
PASS
WARNING
FAIL
```

---

## 4. Tool portfolio

Report:

```text
Hero tools
Growth tools
Maintain
Merge
Remove/review
```

---

## 5. Tier-1 opportunity

Show strongest clusters for:

```text
US
UK
Canada
Australia
Europe
```

---

## 6. Search Console baseline

If available:

```text
clicks
impressions
CTR
position
indexed pages
```

State date.

Do not promise ranking outcomes.

---

## 7. Analytics

Report:

```text
events implemented
tracking status
privacy notes
```

---

## 8. Remaining work

Separate:

```text
Technical
Content
Authority
Growth
Measurement
```

---

## 9. 30 / 60 / 90 day plan

### Next 30 days

Focus on:

```text
indexing
GSC
hero tools
errors
```

### 60 days

Focus on:

```text
CTR
positions 4–20
growth pages
category hubs
```

### 90 days

Focus on:

```text
authority
Tier-1 expansion
new validated tools
```

---

# PRIORITY CONTENT CLUSTERS

These should be investigated first, not blindly expanded.

---

## Construction & DIY

Potential priority:

```text
Concrete Calculator
Concrete Block Calculator
Cement Calculator
Brick Calculator
Asphalt Calculator
Gravel Calculator
Sand Calculator
Rebar Calculator
Roof Area Calculator
Flooring Calculator
Tile Calculator
Paint Calculator
Drywall Calculator
Lumber Calculator
Stair Calculator
Steel Weight Calculator
Pipe Volume Calculator
Excavation Calculator
Soil Calculator
Mulch Calculator
Fence Calculator
Water Tank Calculator
```

Possible product improvements:

```text
metric / imperial
waste %
cost estimate
material breakdown
print
PDF
unit conversion
```

---

## Developer / CSS

Potential:

```text
JSON Formatter
JSON Minifier
JSON Path Tester
XML Formatter
YAML to JSON
String Escape/Unescape
URL Encode/Decode
Base64
Regex Tester
CSS Box Shadow
CSS Gradient
CSS Grid
CSS Flexbox
CSS Clip Path
CSS Triangle
Color Contrast
Hex/RGB
```

Useful features:

```text
live preview
syntax highlighting
validation errors
copy
download
privacy
keyboard shortcuts
```

---

## Time / Date / Productivity

Potential:

```text
Business Days Calculator
Time Duration
Time Addition
Countdown
Event Timer
Stopwatch
Reading Time
Week Number
Military Time
Character Counter
Line Counter
Duplicate Line Remover
Whitespace Cleaner
Random Picker
```

---

# HIGH-RISK CONTENT AREAS

## Health

Requirements:

```text
clear methodology
primary source
limitations
informational disclaimer
no diagnosis/treatment claim
```

Do not use fabricated medical authors.

---

## Finance / Tax

Requirements:

```text
formula
assumptions
estimate notice
official source for jurisdiction rules
effective date
last reviewed date
```

---

## Construction

Requirements:

```text
estimate disclaimer
assumptions
units
waste allowance
not a structural-engineering substitute
```

---

# CONTENT IMPROVEMENT ENGINE

For every HERO/GROWTH tool, improve only where useful.

Potential sections:

```text
What the tool does
How to use it
Formula/method
Worked example
Units
Interpretation
Common mistakes
Limitations
Related tools
Sources
```

Never add sections simply to make the page longer.

---

# PROGRAMMATIC SEO RULE

Programmatic generation is allowed only when each page has genuine utility.

Do not generate:

```text
10,000 numeric conversion pages
thousands of city pages
thousands of near-identical calculator pages
keyword permutation pages
```

unless the underlying user experience and search intent clearly justify independent URLs.

Prefer interactive tools that answer many long-tail queries on one canonical page.

---

# AEO / GEO RULES

Use:

```text
concise direct answers
clear formulas
semantic headings
original examples
structured data that matches content
primary sources
stable canonical pages
strong entity/about information
```

Do not use:

```text
fake AI keywords
hidden answer blocks
fake citations
GEO keyword stuffing
```

---

# GSC OPERATING SYSTEM

After launch, run weekly:

```text
new pages receiving impressions
high-impression low-CTR pages
positions 4–20
pages losing clicks
pages losing indexation
US/UK/CA/AU performance
```

Monthly:

```text
category performance
hero tool performance
query clusters
cannibalization
indexing coverage
Tier-1 share
```

---

# ANALYTICS OPERATING SYSTEM

Weekly:

```text
tool_calculate
tool_download
related_tool_click
organic landing pages
top countries
mobile vs desktop
```

Monthly:

```text
engaged tool users
return visitors
top tools by use
top tools by organic acquisition
tools with search traffic but low usage
tools with high usage but weak search visibility
```

---

# BACKLINK / AUTHORITY RULES

Never buy:

```text
bulk backlinks
PBN links
spam comments
sitewide footer links
low-quality directory bundles
```

Focus on assets worthy of citation.

---

# FINAL DEPLOYMENT CHECKLIST

Before user deploys to Hostinger:

```text
[ ] GitHub repository updated
[ ] correct branch confirmed
[ ] build passing
[ ] no secrets
[ ] sitemap valid
[ ] robots valid
[ ] homepage tested
[ ] redirect map tested
[ ] tool tests pass
[ ] analytics configured
[ ] Hostinger instructions generated
[ ] rollback commit/tag known
```

---

# FINAL ANTIGRAVITY HANDOFF RULE

Antigravity must not end the project after coding.

The full project ends only after these steps:

```text
1. All implementation phases complete
2. Pre-deployment audit complete
3. User provides GitHub URL
4. Updated project pushed to GitHub
5. Hostinger Git deployment instructions provided
6. User deploys the updated GitHub version
7. User confirms production is live
8. Antigravity re-audits the live website
9. Search Console / analytics production checks are performed where access exists
10. FINAL_LIVE_AUDIT.md is created
11. Final before/after report is delivered
```

---

# FIRST ACTION

Start with:

```text
PHASE 0
```

Then complete:

```text
PHASE 1 — COMPLETE REPOSITORY + LIVE WEBSITE AUDIT
```

Do not start by creating new tools.

Do not start by rewriting hundreds of pages.

Do not start by changing the design.

First understand the repository, live routes, indexing model, existing content, actual tool inventory and measurement configuration.

The primary goal is:

> **Make the existing 400+ tool platform technically healthy, indexable, differentiated, measurable, internally connected, AI-readable and strong enough to earn Tier-1 organic traffic before expanding the page count.**

---

# END
