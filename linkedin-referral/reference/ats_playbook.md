# Applicant-tracking-system playbook

How to fill each career site reliably. Learned on live applications in 2026.
Run `scripts/dump_form.js` after each step to see every field and its value.

General rules (all sites):
- Upload the user's **current** résumé. Copy it into `.playwright-mcp/` first,
  because the MCP only uploads from allowed roots. Delete the copy afterwards.
- Auto-fill from the résumé is often wrong. Always check that **every job**
  and **every degree** is present and in the right place.
- Phone fields: pick the country code in its own dropdown, then type **digits
  only** (`9852857975`). Formats like "(+91) …" get rejected.
- Never tick consent, certification or marketing boxes. Leave sensitive
  self-identification to the user (see the agent's hard rules).
- Free-text salary fields: "INR 25,00,000 - 30,00,000 per annum (negotiable)".
  Number-only fields need a single number, so ask the user.
- Record every answer in `applications_log.md`.

## LinkedIn Easy Apply
1. Job page → the button with `aria-label="Easy Apply to this job"`. Click it
   via `browser_evaluate` (`b.click()`): the modal isn't a `role=dialog`.
2. Page 1 contact: type the mobile number (country code is pre-set). Click
   "Next".
3. Résumé page: the user's saved résumés are listed. Confirm the right one is
   checked (`input[type=radio]:checked` aria-label).
4. Questions: textboxes take numbers ("years of experience with X"). Radio
   groups: click the Yes/No by `internal:role=radio[name="<question>"] >> nth=0|1`,
   or click the `<label>` via evaluate if the input is visually hidden.
   CTC boxes may be **numeric only** ("Invalid input" otherwise).
5. "Review" → read everything → "Submit application" → confirm with
   "Application submitted" on the job page.

## Greenhouse (job-boards.greenhouse.io)
- No account needed. Fields: first/last name, email, phone (+ country
  combobox), résumé "Attach" → file chooser, LinkedIn URL.
- Custom questions are react-select comboboxes. Click the combobox **by its
  accessible name**, type the value slowly, then press Enter. Don't set values
  through JS: the phone-country menu stays open and swallows the input.
- Demographic comboboxes (gender, race, veteran) are optional, so leave them.
- Submit → URL ends `/confirmation`, "Thank you for applying".

## Ashby (jobs.ashbyhq.com, e.g. OpenAI)
- No account needed. Location is a combobox: type the city, then pick the
  option. Start date is a date textbox (`MM/DD/YYYY`). Yes/No are buttons.
- There's usually a mandatory "I certify I personally completed this
  application" checkbox, so **leave it for the user**.

## Phenom (careers.<company>.com, e.g. eBay, Mastercard)
- No account needed. Reject the cookie banner first (`#onetrust-reject-all-handler`).
  Then "Upload Resume" → file chooser → accept the "uploaded successfully"
  alert with `browser_handle_dialog`.
- Fields have ids like `cntryFields.city`, `experienceData[0].title`,
  `educationData[0].degree`. Use `[id="…"]` selectors (brackets break CSS #ids).
- Month/year "From/To" fields open a **month picker**. Set the year `<select>`
  inside the popup through evaluate, then click the month text ("Jun").
- Remove bogus experience rows the parser invents (projects listed as jobs):
  click `Remove experience >> nth=k`, highest index first.
- The last step has NDA / terms consent checkboxes, so **the user ticks them**.

## Workday (*.myworkdayjobs.com: NVIDIA, Intel, Wells Fargo, Adobe…)
- **Needs an account**, which the user creates and signs into. Then go to
  `…/apply/autofillWithResume` (not "Use My Last Application", which errors
  when there's no previous application). Click "Select file" → upload →
  wait for "Successfully Uploaded" → Continue.
- My Information: fix ALL-CAPS names (autofill warns). Dropdown buttons have
  aria-labels like "Phone Device Type Home Required". Click them, then click
  `role=option` (use "Mobile"/"Personal Cell"/"Home Cellular").
  Multiselect prompts ("How Did You Hear About Us?", "Country Phone Code",
  "School", "Field of Study") are search inputs: type, press Enter, then click
  the matching option. Some have two levels (Job Board → LinkedIn).
- "Save and Continue" sometimes needs a second click; read the "Errors Found"
  box after each click.
- My Experience: autofill typically puts the newest job's text inside the
  oldest job and attaches the Master's to the Bachelor's school. Fix the text,
  then use the **section-scoped** "Add Another" button
  (`closest('[aria-labelledby="Work-Experience-section"]')` or
  `"Education-section"`). Date month inputs accept "062024" typed slowly. Tick
  "I currently work here" through its label.
- If a school isn't in the list, choose "Other". The degree list may be US
  style (M.S./B.S.); use the closest match and log it.
- Voluntary Disclosures / Personal Data (gender, citizenship, nationality) and
  Terms & Conditions are **the user's to fill**.

## Google Careers
- The user's Google account must be signed in. A saved "Careers profile" is
  reused; ask the user to check which résumé it holds.
- Role information: preferred location + work authorisation Yes/No radios.
- Voluntary self-identification (gender, race, disability, military) is **the
  user's**. Dashboard: `…/applications/dashboard` shows "Submitted".
- Limit: **3 applications per rolling 30 days**.

## Sites that need the user (stop and report)
- Equip (equip.co): email login.
- iCIMS (Atlassian and others): account.
- Oracle Candidate Experience (Amex): account/OTP.
