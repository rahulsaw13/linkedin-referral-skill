// Paste as the `function` argument of browser_evaluate on any application
// form (Easy Apply, Greenhouse, Ashby, Phenom, Workday, Google Careers).
// Lists every visible field with its label and current value, the selected
// items of multiselect prompts, the current step, and any error box. Run it
// after each step and before Review so nothing is left blank or wrong.
() => {
  const label = el => {
    const byFor = el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
    const lbl = el.getAttribute('aria-label') || (byFor && byFor.innerText) ||
      el.closest('fieldset')?.querySelector('legend')?.innerText || el.name || el.id || '';
    return lbl.replace(/\s+/g, ' ').trim().slice(0, 70);
  };
  const val = el => {
    if (el.tagName === 'SELECT') return el.options[el.selectedIndex]?.text || '';
    if (el.type === 'checkbox' || el.type === 'radio') return el.checked ? '[x]' : '[ ]';
    if (el.tagName === 'BUTTON') return el.innerText.trim();
    return el.value;
  };
  const fields = [...document.querySelectorAll('input:not([type=hidden]), select, textarea, button[aria-haspopup="listbox"]')]
    .filter(e => e.offsetParent && !/search|typehead|gllocation|language|settings/i.test(e.id + (e.getAttribute('aria-label') || '')))
    .map(e => `${label(e)} = ${String(val(e) || '').replace(/\s+/g, ' ').slice(0, 60)}`);
  const selected = [...document.querySelectorAll('[data-automation-id="selectedItem"]')].map(e => e.innerText.trim());
  const t = document.body.innerText;
  const step = (t.match(/(current step \d of \d|\d\/\d pages)/) || [''])[0];
  const err = (t.match(/(Errors Found|Please enter all required fields|This field is required|Invalid input)[\s\S]{0,300}/) || [''])[0].replace(/\s+/g, ' ');
  const files = [...new Set((t.match(/[\w ()-]+\.(pdf|docx?)/gi) || []))];
  return [`STEP: ${step}`, `ERRORS: ${err || 'none'}`, `FILES: ${files.join(', ')}`,
    `SELECTED: ${selected.join(' | ')}`, ...fields].join('\n');
}
