// Paste as the `function` argument of browser_evaluate on a job page
// (https://www.linkedin.com/jobs/view/<id>/). Run browser_wait_for
// { text: "About the job" } first, because the description loads after the header.
// Returns: header (company, title, location, age, applicants, salary),
// the lines that mention years of experience, the "Meet the hiring team" poster,
// the external "Apply on company website" URL (unwrapped from LinkedIn's
// safety redirect), and the first part of the description plus the requirements.
() => {
  const t = (document.querySelector('main') || document.body).innerText.replace(/\n{2,}/g, '\n');
  const header = t.split('\n').slice(0, 5).join(' | ');
  const years = (t.match(/[^\n]*\d+\+?\s*(?:-|to|–)?\s*\d*\+?\s*years?[^\n]*/gi) || [])
    .slice(0, 3).join(' // ').slice(0, 400);
  const team = ((t.match(/Meet the hiring team\n([\s\S]{0,200})/) || ['', ''])[1])
    .split('\n').slice(0, 4).join(' | ');
  const apply = [...document.querySelectorAll('a')]
    .filter(a => /Apply/i.test(a.getAttribute('aria-label') || a.innerText || ''))
    .map(a => { try { return decodeURIComponent(new URL(a.href).searchParams.get('url') || a.href); } catch (e) { return a.href; } })
    .filter(h => !/linkedin\.com\/jobs\/search/.test(h))
    .slice(0, 1).join('');
  const easyApply = [...document.querySelectorAll('button')].some(b => /Easy Apply/i.test(b.innerText || ''));
  const i = t.indexOf('About the job');
  const q = t.search(/What we need to see|Qualifications|Requirements|What you.ll bring|Must have|Who you are|About You|Skills Required/i);
  return [
    'HEADER: ' + header,
    'YEARS: ' + years,
    'POSTER: ' + team,
    'APPLY: ' + (apply || (easyApply ? 'Easy Apply only' : 'none found')),
    'JD: ' + (i >= 0 ? t.slice(i + 13, i + 700) : ''),
    'REQ: ' + (q > 0 ? t.slice(q, q + 1100) : ''),
  ].join('\n');
}
