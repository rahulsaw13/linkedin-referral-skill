// Paste as the `function` argument of browser_evaluate on a LinkedIn people
// search page (/search/results/people/?keywords=...). Returns one line per
// person: profileUrl | name | degree | headline | location | current role.
// Mutual-connection links inside a card also match /in/. The card text stays
// the result owner's, but the URL can belong to the mutual connection, so
// always open the profile and confirm the name before acting on it.
async () => {
  await new Promise(r => setTimeout(r, 2500));
  const seen = new Set();
  const out = [];
  document.querySelectorAll('a[href*="/in/"]').forEach(a => {
    const url = a.href.split('?')[0];
    if (seen.has(url)) return;
    const card = a.closest('li') || a.closest('div[role="listitem"]');
    if (!card) return;
    const parts = card.innerText.split('\n').map(s => s.trim()).filter(Boolean)
      .filter((v, i, arr) => arr.indexOf(v) === i && !/^(Connect|Message|Follow|View .*profile|Status is)/.test(v));
    if (parts.length < 2) return;
    seen.add(url);
    out.push(url + ' | ' + parts.slice(0, 6).join(' | '));
  });
  return out.slice(0, 12).join('\n') || (document.querySelector('main')?.innerText.slice(0, 400) ?? 'no results');
}
