// The measurement that runs inside the page, shared by every runner (Chrome, WebKit and Firefox) so they cannot drift apart. It
// must stay self-contained: a runner serializes it with `toString()`.

/**
 * Reads the baseline of every element that holds text and how far it is from a grid line.
 *
 * @param {{ grid: number, tolerance: number }} options - the grid row in px and the distance that still counts as on it.
 * @returns {{ key: string, bad: boolean, entry: string }[]} one row per element, grouped by `key`.
 */
export function measureText({ grid, tolerance }) {
  const name = (e) =>
    (e && (e.className || '').toString().split(' ')[0]) || (e ? e.tagName.toLowerCase() : '');
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const style = getComputedStyle(el);
    if (
      ['inline', 'none', 'contents'].includes(style.display) ||
      el.closest('svg,script,style,[hidden]')
    )
      continue;
    // The inside of a closed disclosure is laid out but never drawn.
    if (el.closest('details:not([open])') && !el.closest('summary')) continue;
    // Text that is only there for screen readers is clipped to a pixel and never seen.
    let clipped = false;
    for (let up = el; up && up !== document.body; up = up.parentElement) {
      const box = up.getBoundingClientRect();
      if (box.width <= 1 || box.height <= 1) clipped = true;
    }
    if (clipped) continue;
    if (![...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) continue;
    // In a flex or grid container the text is an anonymous item, and a probe beside it would be an item of its own, so the
    // text goes into a span (also an item, with the same layout) that holds the probe.
    const items = /flex|grid/.test(style.display);
    const holder = items ? document.createElement('span') : el;
    const first = [...el.childNodes].find((c) => c.nodeType === 3 && c.textContent.trim());
    if (items) el.insertBefore(holder, first);
    const probe = document.createElement('span');
    probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    holder.insertBefore(probe, holder.firstChild);
    if (items) holder.appendChild(first);
    const baseline = probe.getBoundingClientRect().bottom + scrollY;
    if (items) {
      el.insertBefore(first, holder);
      holder.remove();
    } else {
      probe.remove();
    }
    const rest = ((baseline % grid) + grid) % grid;
    const distance = Math.min(rest, grid - rest);
    let entry = '';
    if (distance > tolerance) {
      // Where the offset enters: the highest ancestor that is off the grid while its parent is on it. What sits above it
      // (its previous sibling, its parent's padding or border) is what is a fraction of a row tall.
      const offTop = (node) => {
        const rem = (((node.getBoundingClientRect().top + scrollY) % grid) + grid) % grid;
        return Math.min(rem, grid - rem) > tolerance;
      };
      let node = el;
      while (
        node.parentElement &&
        node.parentElement !== document.body &&
        offTop(node.parentElement)
      )
        node = node.parentElement;
      const prev = node.previousElementSibling;
      const label = (n) => `${n.tagName.toLowerCase()}.${name(n).replace(/--.*/, '')}`;
      const parentStyle = getComputedStyle(node.parentElement);
      entry = `${label(node)} after ${prev ? `${label(prev)} h${prev.getBoundingClientRect().height.toFixed(1)} mb${getComputedStyle(prev).marginBottom}` : `nothing (parent ${label(node.parentElement)} pt${parentStyle.paddingTop} bt${parentStyle.borderTopWidth})`}`;
    }
    out.push({
      entry,
      key: `${el.tagName.toLowerCase()}.${name(el).replace(/--.*/, '')} < ${name(el.parentElement).replace(/--.*/, '')} [${style.display}]`,
      bad: distance > tolerance,
    });
  }
  return out;
}
