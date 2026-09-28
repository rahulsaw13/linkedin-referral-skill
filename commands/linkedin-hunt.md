---
description: Search LinkedIn jobs that fit my résumé, find referrers and draft notes (sends nothing)
argument-hint: "[extra instructions, e.g. roles, cities, 'past month']"
---

Use the `linkedin-referral-agent` subagent in **search** mode.

Working directory: `~/job-hunt/` (read `linkedin_profile.md` and `linkedin_tracker.csv` there first).
Extra instructions from the user: $ARGUMENTS

When the agent returns, show its shortlist and numbered drafts to the user
exactly as reported, including character counts and the remaining invite
quota. Ask which numbers to send. Do not send anything in this command.
