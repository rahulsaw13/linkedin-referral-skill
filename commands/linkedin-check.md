---
description: Check LinkedIn referral invites and replies, update the tracker, draft follow-ups
---

Use the `linkedin-referral-agent` subagent in **check** mode.

Working directory: `~/job-hunt/`. Run `tracker.py due` first, then check sent
invitations and messages for everyone in the tracker with `connect_sent` or
`message_sent`.

Show the user who accepted, who replied (quote the reply), who is still
pending, and the drafted follow-ups (with the company careers link and req
ID). Ask before sending any follow-up.
