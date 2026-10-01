// Paste as the `function` argument of browser_evaluate on a Google search
// results page (https://www.google.com/search?q=...&tbs=qdr:m). Returns
// "title | url" per organic result, or CAPTCHA if Google blocks the browser.
// Use with site: queries on job boards, e.g.
//   site:job-boards.greenhouse.io ("AI Engineer" OR Agentic) (Bengaluru OR "Remote India")
//   site:myworkdayjobs.com ("agentic" OR "LLM") Python (Bengaluru OR Hyderabad)
// Always open each hit: many are closed, US-only or too senior.
async () => {
  await new Promise(r => setTimeout(r, 2500));
  if (/unusual traffic|captcha|not a robot/i.test(document.body.innerText.slice(0, 2000))) {
    return 'CAPTCHA: ask the user to solve it in the browser, then rerun';
  }
  return [...document.querySelectorAll('a h3')]
    .map(h => `${h.innerText.trim()} | ${h.closest('a').href}`)
    .slice(0, 20)
    .join('\n') || 'no results';
}
