# LinkedIn Referral Agent for Claude Code

A Claude Code **skill + subagent + slash commands** for finding jobs on
LinkedIn and asking for referrals. It runs through the
[Playwright MCP](https://github.com/microsoft/playwright-mcp) browser, with
you logged in yourself.

Given your résumé and preferences, it:

1. Searches LinkedIn Jobs by role, city, work mode, seniority and recency.
2. Reads each job description in full, compares the experience asked for with
   your real experience, and scores fit from 1 to 5. It lists the gaps
   honestly and drops roles that won't work (too senior, immediate joiners
   only, salary below your floor).
3. Gets each company's **careers-site link and req ID**. Referrers need these
   for their internal referral portal.
4. Finds the right people: the hiring manager or someone on the same team,
   then a senior engineer, then the recruiter. It confirms each profile before
   using it.
5. Drafts referral notes that fit LinkedIn's limits (200 characters on free
   accounts), using only facts from your résumé.
6. Sends only the drafts you approve, confirms each send, and reports how many
   invites you have left.
7. Keeps a tracker and a `follow_up.md`. The next day, it checks who accepted
   or replied and drafts follow-ups that include the careers link.

It works as a copilot and is not built for spamming. You log in yourself and
approve every outward action. The pacing stays well inside LinkedIn's limits.

## What's in the repo

```
agents/linkedin-referral-agent.md    subagent: search / send / check modes, tool list, hard rules
commands/linkedin-hunt.md            /linkedin-hunt  - search, shortlist, draft (sends nothing)
commands/linkedin-send.md            /linkedin-send  - send the drafts you approved
commands/linkedin-check.md           /linkedin-check - check invites + replies, draft follow-ups
linkedin-referral/                   the skill
  SKILL.md                           full workflow, rules, gotchas
  reference/linkedin_urls.md         jobs + people search URL parameters
  reference/message_templates.md     notes, follow-ups, referral pack
  reference/profile_template.md      your preferences (copied to ~/job-hunt/)
  reference/follow_up_template.md    shape of the follow_up.md state file
  scripts/extract_jobs.js            browser_evaluate: scrape a job search page (scrolls the pane)
  scripts/extract_job_detail.js      browser_evaluate: JD, years, hiring poster, careers link
  scripts/extract_people.js          browser_evaluate: people search results
  scripts/check_invites.js           browser_evaluate: pending sent invitations
  scripts/tracker.py                 CSV tracker: init/add/update/list/due/count
mcp/playwright.mcp.json              MCP server config
install.sh / install.ps1             one-step install
```

## Requirements

- [Claude Code](https://claude.com/claude-code)
- Node.js 18+ (for `npx @playwright/mcp`)
- Python 3.8+ (for `tracker.py`; standard library only)
- A LinkedIn account

### Tools the agent uses

| Tool | Why |
|---|---|
| `mcp__playwright__browser_navigate` / `_navigate_back` | open search, job, profile and messaging pages |
| `mcp__playwright__browser_evaluate` | run the `scripts/*.js` extractors |
| `mcp__playwright__browser_snapshot` | read dialogs and buttons before clicking |
| `mcp__playwright__browser_click` / `_type` / `_press_key` | Connect → Add a note → type → Send |
| `mcp__playwright__browser_wait_for` | wait for job descriptions to load; pauses between sends |
| `mcp__playwright__browser_file_upload` | upload the résumé for Easy Apply (only after approval) |
| `mcp__playwright__browser_take_screenshot` / `_tabs` | debugging, external apply tabs |
| `Read`, `Write`, `Edit`, `Glob`, `Grep` | résumé PDF, preferences, tracker, follow-up file |
| `Bash` | `python tracker.py …` |

## Install

```bash
git clone https://github.com/rahulsaw13/linkedin-referral-skill
cd linkedin-referral-skill
./install.sh              # macOS / Linux / Git Bash
# or, on Windows PowerShell:
./install.ps1
```

The installer copies the skill, agent and commands into `~/.claude/`,
registers the Playwright MCP server at user scope, and creates
`~/job-hunt/linkedin_profile.md` for you to fill in.

To install by hand instead, copy `linkedin-referral/` to
`~/.claude/skills/`, `agents/*.md` to `~/.claude/agents/`, and
`commands/*.md` to `~/.claude/commands/`. Then run
`claude mcp add --scope user playwright -- npx @playwright/mcp@latest`.

## Use

1. Fill in `~/job-hunt/linkedin_profile.md`: résumé path, roles, cities, work
   mode, salary floor, notice period.
2. In Claude Code, say "open LinkedIn login", then **log in yourself** in the
   Playwright browser window.
3. Run the commands in order:

```
/linkedin-hunt                          # shortlist + careers links + drafted notes
/linkedin-send 2-4                      # send only the drafts you approve
/linkedin-check                         # next day: acceptances, replies, follow-up drafts
```

You can also ask in plain words, for example: "Find ML Engineer jobs in
Bangalore or remote, 25 LPA+, and draft referral notes for the hiring
managers."

Tracker commands:

```bash
python ~/.claude/skills/linkedin-referral/scripts/tracker.py --file ~/job-hunt/linkedin_tracker.csv due
python ~/.claude/skills/linkedin-referral/scripts/tracker.py count "Hi Neha, ..." --limit 200
```

## Things we learned the hard way

- **Free-account notes are capped at 200 characters**, not the 300 LinkedIn
  documents. You also get only about 5 personalised invites a month, and the
  dialog shows how many remain. Spend them on hiring managers.
- **"Message" on someone who isn't a connection** usually means paid Premium
  InMail, and no compose box opens. The agent falls back to a connect request.
- **Job search shows about 7 results** unless the results pane is scrolled;
  `extract_jobs.js` handles the scrolling.
- **Job descriptions load after the header.** Wait for "About the job" before
  reading, or you get an empty description.
- **The careers link** is inside the "Apply on company website" button, behind
  LinkedIn's safety redirect. `extract_job_detail.js` pulls it out, and the req
  ID is usually in the URL.
- **People-search cards** can link to a mutual connection instead of the
  person, so always open and confirm the profile before drafting.

## Safety

- The agent never types your password, OTP or captcha answers.
- Nothing is sent without approval of that exact item and text.
- Default limits are 15 or fewer invites a day, 20–60 s between sends, and a
  full stop at any LinkedIn warning or verification page.
- Messages contain only facts from your résumé.
- Automating LinkedIn is against its User Agreement. Use this at your own risk
  and keep the volume human.
- Keep `linkedin_profile.md`, `linkedin_tracker.csv` and `follow_up.md` out of
  git; `.gitignore` already excludes them.

## License

MIT
