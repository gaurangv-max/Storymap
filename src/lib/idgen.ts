// Thin wrapper around crypto.randomUUID so call sites stay tidy
// and we have a single place to swap the implementation later.
export function generateId(): string {
  return crypto.randomUUID();
}
