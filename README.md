# linkedin-referral — a Claude Code skill

A Claude Code skill that uses the [Playwright MCP](https://github.com/microsoft/playwright-mcp)
browser to search LinkedIn for jobs that match your résumé, find the hiring
manager, senior engineers and recruiter at each company, draft personalised
referral requests, and send each one only after you approve it. It logs every
action to a CSV tracker.

It works as a copilot and is not built for spamming. You log in yourself and
approve every outward action. The skill also paces itself well under
LinkedIn's limits.

## What it does

1. Reads your résumé (PDF) and your preferences: roles, cities, remote or
   hybrid, and salary floor.
2. Builds LinkedIn Jobs search URLs with filters for seniority, recency and
   work mode, then reads the results.
3. Filters and scores each job for fit (skills overlap, seniority, location,
   recency). It drops roles below your salary floor and flags roles with no
   listed salary as `unverified`.
4. For each job you pick, it finds 1–2 people to ask: the job poster or
   hiring team first, then 2nd-degree engineers and managers, then a recruiter.
5. Drafts connection notes (300 characters or fewer) or messages, using only
   facts from your résumé.
6. Sends each approved draft with a randomised pause between sends. It can
   also fill Easy Apply forms, and shows you the review page before submitting.
7. Appends every action to `linkedin_tracker.csv` and lists the follow-ups due
   on your next run.

## Install

```bash
git clone https://github.com/rahulsaw13/linkedin-referral-skill
cp -r linkedin-referral-skill/linkedin-referral ~/.claude/skills/
```

The Playwright MCP server also needs to be configured in Claude Code:

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

## Use

In Claude Code:

> Find Senior Data Engineer and ML Engineer jobs on LinkedIn, remote or hybrid
> in Bangalore/Kolkata/Delhi, 25 LPA+, and ask the hiring managers for referrals.
> My résumé is at C:/…/Resume.pdf

To skip the questions on each run, copy
`linkedin-referral/reference/profile_template.md` into your working directory
as `linkedin_profile.md` and fill it in. Keep that file private.

## Safety

- The skill never handles your password or OTP. You log in yourself in the
  Playwright browser window.
- Default limits are 15 or fewer connection requests a day, 20 or fewer
  messages, 10 or fewer applications, with 20–60 s between sends.
- It stops at any LinkedIn warning, captcha or "unusual activity" prompt.
- Automating LinkedIn is against its User Agreement, so use this at your own
  risk and keep the volume human.

## Files

```
linkedin-referral/
  SKILL.md                       workflow + rules Claude follows
  reference/linkedin_urls.md     jobs / people search URL parameters
  reference/message_templates.md connection notes, messages, follow-ups
  reference/profile_template.md  preferences file template
```

## License

MIT
