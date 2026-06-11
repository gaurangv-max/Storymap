// localStorage size helpers used to warn the user before they hit the
// browser's ~5MB origin limit (base64 attachments are the main risk).

export const STORAGE_WARN_BYTES = 4 * 1024 * 1024; // soft warning threshold
export const ATTACHMENT_WARN_BYTES = 1 * 1024 * 1024; // per-file warning

// Approximate bytes currently used by this origin's localStorage.
// Uses UTF-16 (2 bytes/char), matching how browsers store strings.
export function getStorageUsageBytes(): number {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    const value = localStorage.getItem(key) ?? '';
    total += (key.length + value.length) * 2;
  }
  return total;
}

export function isStorageNearlyFull(): boolean {
  return getStorageUsageBytes() >= STORAGE_WARN_BYTES;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
