---
description: Fill and submit approved job applications (Easy Apply, Greenhouse, Ashby, Phenom, Workday, Google Careers)
argument-hint: "<which jobs, e.g. 'Wayfair MLS II, GitLab AI Engineer' or tracker rows>"
---

The user approved applying to: $ARGUMENTS

Use the `linkedin-referral-agent` subagent in **apply** mode, working in
`~/job-hunt/`. Pass it, for each approved job: the company, role, job URL or
careers link, and the req ID if known.

The agent must use only the confirmed answers in `linkedin_profile.md`, follow
`reference/ats_playbook.md`, and log every answer to `applications_log.md`. It
must leave consents, certifications, sensitive self-identification, sign-ins
and any unknown question for the user.

When it returns, show the user:
- what was submitted, with the confirmation seen;
- what is waiting for them, with the browser tab and the exact fields;
- any questions they need to answer, so you can resume the application.
