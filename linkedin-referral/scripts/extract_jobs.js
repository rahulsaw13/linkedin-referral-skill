// Paste as the `function` argument of browser_evaluate on a LinkedIn
// /jobs/search/ results page. It finds the scrollable results pane, scrolls it
// so lazy-loaded cards render, and returns one line per job:
//   jobId | title | company | location (work mode) | badges
// LinkedIn's class names are obfuscated and change, so this keys off
// /jobs/view/<id> links instead of CSS classes.
async () => {
  const first = document.querySelector('a[href*="/jobs/view/"]');
  let pane = first;
  while (pane && pane !== document.body) {
    const s = getComputedStyle(pane);
    if (/(auto|scroll)/.test(s.overflowY) && pane.scrollHeight > pane.clientHeight + 50) break;
    pane = pane.parentElement;
  }
  const noise = /with verification|alumni|Viewed|Promoted|Actively|review time|connection/;
  const seen = new Set();
  const rows = [];
  for (let pass = 0; pass < 12; pass++) {
    document.querySelectorAll('a[href*="/jobs/view/"]').forEach(a => {
      const id = (a.getAttribute('href').match(/\/jobs\/view\/(\d+)/) || [])[1];
      if (!id || seen.has(id)) return;
      const li = a.closest('li');
      if (!li || !li.innerText.trim()) return;
      seen.add(id);
      const parts = li.innerText.split('\n').map(s => s.trim()).filter(Boolean)
        .filter((v, i, arr) => arr.indexOf(v) === i && !noise.test(v));
      rows.push(id + ' | ' + parts.slice(0, 5).join(' | '));
    });
    if (pane && pane !== document.body) pane.scrollTop += 600; else window.scrollBy(0, 600);
    await new Promise(r => setTimeout(r, 600));
  }
  return rows.join('\n');
}
