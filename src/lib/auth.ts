import { useSyncExternalStore } from 'react';

// Lightweight, in-memory "auth" flag — no backend, no persistence.
// It resets on every full page load, so opening the app always starts at
// /login until the user signs in (then routing allows the dashboard).

let signedIn = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function signIn() {
  signedIn = true;
  emit();
}

export function signOut() {
  signedIn = false;
  emit();
}

// React hook to read the current sign-in state.
export function useIsSignedIn(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => signedIn,
    () => signedIn
  );
}
