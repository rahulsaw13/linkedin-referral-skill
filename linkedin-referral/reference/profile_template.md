# linkedin_profile.md — copy to your working directory and fill in

The skill reads this file (if present as `linkedin_profile.md` in the working
directory) so it doesn't ask the same questions every run. Keep it local —
don't commit personal details to a public repo.

```yaml
resume_path: "C:/path/to/Resume.pdf"

target_roles:
  - Senior Data Engineer
  - Machine Learning Engineer
  - AI Engineer (Agents / LLM)
  - Senior Python Developer

locations:          # ranked, first = most preferred
  - Remote
  - Kolkata, West Bengal, India
  - Delhi NCR, India
  - Bengaluru, Karnataka, India
  - Hyderabad, Telangana, India

work_mode: [remote, hybrid]      # on-site excluded unless city is top-ranked
experience_level: mid-senior     # f_E=4
salary_floor_lpa: 25
salary_target_lpa: 30
posted_within: week              # day | week | month

avoid_companies:
  - <current employer>

outreach_mode: connect_with_note # connect_with_note | message_only | both
daily_connect_cap: 15
daily_apply_cap: 10
easy_apply: ask                  # ask | never | yes_after_review

# Confirmed screening answers: the skill only uses what's here (blank → it asks)
notice_period_days:
current_ctc: ""            # e.g. "20 LPA fixed + 10% bonus + ESPP"
expected_ctc: ""           # e.g. "25-30 LPA"; top-paying: "market-competitive"
expected_ctc_single_number: # for number-only fields, e.g. 28
willing_to_relocate:
work_authorization_country: # e.g. India
visa_sponsorship_needed:
non_compete_or_restrictions:
years_by_skill:             # be honest; must match the résumé
  agentic_ai:
  llm_apps:
llm_ecosystem: ""           # e.g. "Anthropic, OpenAI, Copilot, self-hosted"
phone: ""
email: ""
address: ""                 # Workday sites require it
linkedin_url: ""
current_location: ""
```
