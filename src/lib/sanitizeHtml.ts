// Lightweight HTML sanitizer for the rich-text description field.
// No external dependency (keeps the bundle small). Parses the markup, then
// walks it removing anything not on a small allowlist of formatting tags and
// stripping all event handlers / javascript: URLs. Good enough for a local,
// single-user app to neutralise pasted or stored markup that could execute
// script (e.g. <img onerror>, <script>, <iframe>, on*= handlers).

// Inline + block formatting the editor's toolbar can produce.
const ALLOWED_TAGS = new Set([
  'B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE', 'DEL',
  'OL', 'UL', 'LI', 'A', 'P', 'BR', 'DIV', 'SPAN', 'BLOCKQUOTE',
]);

// Per-tag attribute allowlist. Everything else (incl. all on* handlers,
// style, src, etc.) is dropped.
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  A: new Set(['href', 'target', 'rel']),
};

function isSafeHref(value: string): boolean {
  const v = value.trim().toLowerCase();
  // Block javascript:, data:, vbscript: and similar script-bearing schemes.
  // Allow http(s), mailto, tel, and relative/anchor links.
  if (v.startsWith('javascript:') || v.startsWith('data:') || v.startsWith('vbscript:')) {
    return false;
  }
  return true;
}

function sanitizeNode(node: Element): void {
  // Depth-first: snapshot children first since we may replace/remove nodes.
  const children = Array.from(node.children);

  for (const child of children) {
    if (!ALLOWED_TAGS.has(child.tagName)) {
      // Disallowed element: drop it entirely along with its subtree.
      // (For script/img/iframe etc. we do NOT keep inner content/handlers.)
      child.remove();
      continue;
    }

    // Strip every attribute not explicitly allowed for this tag.
    const allowed = ALLOWED_ATTRS[child.tagName] ?? new Set<string>();
    for (const attr of Array.from(child.attributes)) {
      const name = attr.name.toLowerCase();
      if (!allowed.has(name) || name.startsWith('on')) {
        child.removeAttribute(attr.name);
        continue;
      }
      if (name === 'href' && !isSafeHref(attr.value)) {
        child.removeAttribute(attr.name);
      }
    }

    // Recurse into the (now-clean) element.
    sanitizeNode(child);
  }
}

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';
  const doc = new DOMParser().parseFromString(dirty, 'text/html');
  sanitizeNode(doc.body);
  return doc.body.innerHTML;
}
