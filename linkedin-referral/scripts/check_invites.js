// Paste as the `function` argument of browser_evaluate on
// https://www.linkedin.com/mynetwork/invitation-manager/sent/
// It returns the people whose invitations are still pending. Anyone in the
// tracker with action=connect_sent who is NOT in this list has either accepted
// or ignored the invite. Open their profile: "Message" as the primary button
// plus "1st" means they accepted.
async () => {
  await new Promise(r => setTimeout(r, 2500));
  for (let i = 0; i < 5; i++) { window.scrollBy(0, 1200); await new Promise(r => setTimeout(r, 600)); }
  const seen = new Set();
  const out = [];
  document.querySelectorAll('a[href*="/in/"]').forEach(a => {
    const url = a.href.split('?')[0];
    if (seen.has(url)) return;
    const card = a.closest('li') || a.closest('div[role="listitem"]');
    if (!card) return;
    seen.add(url);
    const parts = card.innerText.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 3);
    out.push(url + ' | ' + parts.join(' | '));
  });
  return out.join('\n') || 'no pending invitations found';
}
