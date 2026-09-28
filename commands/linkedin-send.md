---
description: Send LinkedIn referral notes or follow-ups that the user has approved
argument-hint: "<which drafts, e.g. '2-4' or 'Tower/Neha, Amex/Pavan'>"
---

The user approved these items: $ARGUMENTS

Find the exact draft text for each approved item earlier in this conversation.
If any item is unclear or has no draft, ask the user and do not send it.

Then use the `linkedin-referral-agent` subagent in **send** mode. Pass it, for
each approved item: company, role, recipient name, profile URL, and the exact
note text. Tell it to send only those items.

Report what was confirmed sent and how many personalised invites are left.
