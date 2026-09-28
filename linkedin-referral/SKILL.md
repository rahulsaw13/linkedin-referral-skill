---
name: linkedin-referral
description: >-
  Drive LinkedIn through the Playwright MCP browser to hunt jobs and ask for
  referrals: read the user's résumé, search LinkedIn Jobs for target roles and
  locations, filter by seniority / recency / work mode / salary floor, shortlist
  matches with a fit score, find the hiring manager, senior engineers and
  recruiter at each company, draft a personalised connection note or referral
  message per person, and send each one only after the user approves it —
  logging everything to a tracker. Can also fill LinkedIn Easy Apply forms.
  Use when the user asks to "find jobs on LinkedIn", "ask for referrals",
  "ping hiring managers", "apply to jobs for me", "job hunt", or anything
  about automating a LinkedIn job search or referral outreach.
---

# LinkedIn Referral Hunter

Semi-automated job hunt: Claude does the searching, filtering, people-finding
and drafting; **the user logs in and approves every message and every
application**. It is a copilot, not a spam bot.

## Hard rules (read first)

1. **Never handle credentials.** Open `https://www.linkedin.com/login` and let
   the user sign in (password, OTP, captcha) in the Playwright window. Wait for
   them to say they are in; confirm by checking the page URL is `/feed` or
   similar. If a checkpoint / captcha appears later, stop and hand back.
2. **Approval before every outward action.** Connection requests, messages,
   InMails and Easy Apply submissions are sent only after the user approves
   that specific item (they may approve a batch they have seen in full, e.g.
   "send 1–5"). Approval of one batch does not carry to the next.
3. **Rate limits** (LinkedIn restricts accounts that act like bots):
   - ≤ 15 connection requests per day, ≤ 80 per week (free accounts are
     capped near 100/week and ~5–10 personalised notes/month on some plans —
     if LinkedIn says the note quota is used up, offer to send without a note
     or to message instead).
   - ≤ 20 messages per day. ≤ 10 Easy Apply submissions per day.
   - Pause 20–60 s (randomised) between sends: `browser_wait_for` with `time`.
   - Never scrape hundreds of profiles; open only people you will draft for.
4. **One person per company per role first.** Do not carpet-bomb a team. Go
   to a second person only if the first does not respond in ~5 days.
5. **Truthful messages only.** Every claim in a draft must come from the
   résumé. No invented numbers, titles, or familiarity ("loved your post")
   unless it is true and visible.
6. Stop immediately and report if LinkedIn shows a warning, "unusual
   activity", restriction, or verification wall.

## Inputs to collect

Load the résumé first (PDF via Read, or ask for path/paste). Then confirm or
ask for anything missing — use `reference/profile_template.md` as the form:

| Field | Example |
|---|---|
| Target roles | Senior Data Engineer, ML Engineer, AI Engineer, Senior Python Developer |
| Locations (ranked) | Remote > Hybrid; Kolkata, Delhi NCR, Bangalore, Hyderabad |
| Work mode | Remote / Hybrid first, on-site last |
| Salary floor | 25 LPA (stretch 30+) |
| Experience | derive from résumé (sum of full-time roles) |
| Companies to avoid | current employer, blacklist |
| Outreach mode | connection request + note / message only / both |
| Daily cap | default 10–15 |

If a profile file already exists in the working directory
(`linkedin_profile.md`), read it and skip the questions it answers.

## Workflow

### 1. Open and log in
`browser_navigate` → `https://www.linkedin.com/login`. Tell the user to log in
in the browser window. If navigate fails with "Browser is already in use",
another Chrome holds the Playwright profile — find it
(`chrome.exe` whose command line contains `ms-playwright-mcp`, no `--type=`)
and ask before killing it.

### 2. Search jobs
Build search URLs directly — faster and more reliable than typing into the UI.
See `reference/linkedin_urls.md` for all parameters. Typical:

```
https://www.linkedin.com/jobs/search/?keywords=Senior%20Data%20Engineer
  &location=India&f_WT=2,3&f_E=4&f_TPR=r604800&sortBy=DD
```

- `f_WT`: 1 on-site, 2 remote, 3 hybrid. `f_E`: 3 associate, 4 mid-senior, 5 director.
- `f_TPR=r604800` last 7 days (`r86400` = 24 h). `f_AL=true` Easy Apply only.
- Run one search per role × location group. Use `browser_snapshot` (not
  screenshots) to read the result list; scroll the left pane with
  `browser_evaluate` if needed.

### 3. Filter and score
For each result open the job (click card), read the description, and extract:
title, company, location, work mode, posted date, applicants, salary (if
shown), required years, key skills, Easy Apply yes/no, job URL.

Discard when: salary shown and max < floor; required years clearly beyond
résumé + 2; on-site in a non-preferred city; company on avoid list; staffing
agency reposts with no real employer.

**Salary unknown** (most Indian postings): keep only if the employer is a
product company, GCC / captive centre, well-funded startup, or big-tech — the
tiers that usually pay ≥ floor at this experience — and mark
`salary: unverified`. Never claim a salary the posting does not show.

Score fit 1–5: skill overlap with résumé (heaviest), seniority match,
location rank, recency, applicant count (fewer is better). Present a table of
the top 5–10 and let the user pick which to pursue.

### 4. Find people
For each chosen job, in order of usefulness:
1. The job poster / "Meet the hiring team" box on the job page (best signal).
2. People search: `https://www.linkedin.com/search/results/people/?keywords=<Company>%20Engineering%20Manager%20Data`
   and `...<Company>%20Senior%20Data%20Engineer`. Prefer 2nd-degree
   connections, alumni of the user's colleges (`schoolFilter`), and people in
   the role's city.
3. A recruiter / talent-acquisition partner at the company.

Pick 1 primary + 1 backup per job. Record name, title, profile URL, degree
(1st/2nd/3rd), and why chosen.

### 5. Draft
Use `reference/message_templates.md`. Rules:
- Connection note: **≤ 200 characters on free accounts** (300 on Premium) — the note dialog shows the real cap as "0/200"; check it before drafting. Free accounts also get only ~5 personalised invites per month (dialog shows "N personalized invitations remaining") — spend them on hiring managers, not peers. Put the req/job ID in the note (referral portals search by it); send full company careers link in the follow-up message after they accept.
- Message / InMail ≤ ~700 characters, 3 short sentences + ask.
- Personalise: their name, the exact role and job ID/link, 1–2 résumé facts
  that match the JD's top requirements.
- Ask clearly and make it easy: "Would you be open to referring me? I can
  send my résumé and a 2-line summary for the referral form."

Show every draft to the user in a numbered list with the character count.

### 6. Send (after approval)
- Connect: open profile → "Connect" (may be under "More") → "Add a note" →
  type note → "Send". If only "Follow" shows, use "More → Connect".
- Message (1st-degree or open profile): "Message" → type → send.
- After each send, `browser_snapshot` to confirm it went ("Pending" / message
  shows in thread), then wait 20–60 s before the next.

### 7. Easy Apply (optional, after approval)
Open job → "Easy Apply". Fill contact info from résumé, upload résumé via
`browser_file_upload`, answer screening questions **only from facts the user
has given** — if a question needs a number or opinion not on record (notice
period, current CTC, expected CTC, relocation), ask the user. Show the review
page to the user before pressing "Submit application". Skip external-site
applications; give the link instead.

### 8. Log
Append each action to `linkedin_tracker.csv` in the working directory
(create with header if missing):

```
date,company,role,job_url,salary,fit,person,person_title,profile_url,action,status,notes
```

`action` ∈ {shortlisted, connect_sent, message_sent, applied, skipped};
`status` starts `pending`. On a later run, read the tracker first: skip jobs
already actioned, and list follow-ups due (connect accepted but no reply after
4–5 days → draft a short follow-up; no acceptance after 7 days → try backup
person).

End each session with a summary: searched / shortlisted / sent / applied
counts, today's remaining quota, follow-ups due next run.

## Gotchas

- Prefer `browser_snapshot` for reading; LinkedIn class names are obfuscated
  and change — click by accessible name/role from the snapshot, not CSS.
- Job list lazy-loads: scroll the results pane, then snapshot again.
- "Connect" is hidden behind "More" on many profiles; 3rd-degree profiles may
  offer only "Follow" / InMail.
- A modal "How do you know X?" or email-required prompt means LinkedIn wants
  the recipient's email — skip that person, do not guess.
- Location param accepts free text ("Kolkata, West Bengal, India"); for
  several cities run separate searches rather than one combined query.
- Don't leave the Playwright browser open between sessions unnecessarily —
  a stale Chrome locks the profile for the next run.
