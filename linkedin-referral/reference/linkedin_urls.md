# LinkedIn URL cheat-sheet

Building URLs is more reliable than clicking filters. URL-encode spaces as
`%20`, commas as `%2C`. LinkedIn changes these occasionally — if a filter is
ignored, apply it once in the UI and copy the resulting URL.

## Jobs search

Base: `https://www.linkedin.com/jobs/search/?`

| Param | Values | Meaning |
|---|---|---|
| `keywords` | text | Role / skills. Quotes work: `%22Data%20Engineer%22` |
| `location` | text | `India`, `Bengaluru%2C%20Karnataka%2C%20India`, `Kolkata%2C%20West%20Bengal%2C%20India`, `Delhi%2C%20India`, `Hyderabad%2C%20Telangana%2C%20India` |
| `geoId` | number | Optional; India = `102713980`. Take city IDs from a UI search URL rather than guessing |
| `f_WT` | `1`,`2`,`3` (comma list) | On-site, Remote, Hybrid |
| `f_E` | `1`–`6` | Internship, Entry, Associate, Mid-Senior, Director, Executive |
| `f_TPR` | `r86400`, `r604800`, `r2592000` | Past 24 h / week / month |
| `f_AL` | `true` | Easy Apply only |
| `f_JT` | `F`,`C`,`P` | Full-time, Contract, Part-time |
| `f_C` | company id(s) | Restrict to companies |
| `sortBy` | `DD`, `R` | Most recent, Most relevant |
| `start` | 0, 25, 50 … | Pagination |
| `currentJobId` | id | Opens that job in the right pane |

Salary filter (`f_SB2`) exists only for some countries (not reliably India) —
read salary from the posting instead.

Examples:

```
Remote + hybrid, mid-senior, last week, India:
https://www.linkedin.com/jobs/search/?keywords=Senior%20Data%20Engineer&location=India&f_WT=2%2C3&f_E=4&f_TPR=r604800&sortBy=DD

Hybrid in Kolkata:
https://www.linkedin.com/jobs/search/?keywords=Machine%20Learning%20Engineer&location=Kolkata%2C%20West%20Bengal%2C%20India&f_WT=3&f_E=4&f_TPR=r604800
```

Job page: `https://www.linkedin.com/jobs/view/<jobId>/`

## People search

Base: `https://www.linkedin.com/search/results/people/?`

| Param | Values | Meaning |
|---|---|---|
| `keywords` | text | `Acme%20Engineering%20Manager` |
| `network` | `%5B%22F%22%5D`, `%5B%22S%22%5D`, `%5B%22O%22%5D` | 1st / 2nd / 3rd+ (JSON list, can combine: `%5B%22F%22%2C%22S%22%5D`) |
| `currentCompany` | `%5B%22<companyId>%22%5D` | Company id from the company page URL / job page |
| `schoolFilter` | `%5B%22<schoolId>%22%5D` | Alumni |
| `titleFreeText` | text | Title filter |
| `origin` | `FACETED_SEARCH` | Needed with facets |

Example — 2nd-degree engineering managers at a company:

```
https://www.linkedin.com/search/results/people/?keywords=engineering%20manager&currentCompany=%5B%221234%22%5D&network=%5B%22S%22%5D&origin=FACETED_SEARCH
```

## Useful titles to search per role

| Target role | Referrer titles |
|---|---|
| Data Engineer | Engineering Manager Data, Data Engineering Lead, Senior/Staff Data Engineer, Head of Data Platform |
| ML / AI Engineer | ML Engineering Manager, Applied Scientist, Senior ML Engineer, AI Platform Lead |
| Python Developer | Engineering Manager, Tech Lead, Senior Software Engineer (Python) |
| Any | Technical Recruiter, Talent Acquisition Partner (tech hiring) |
