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

# Answers for Easy Apply screening questions (leave blank → skill asks)
notice_period_days:
current_ctc_lpa:
expected_ctc_lpa:
willing_to_relocate:
```
