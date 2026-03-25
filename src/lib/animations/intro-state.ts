import { browser } from '$app/environment';

export const INTRO_DONE_EVENT = 'preloader:done';
const INTRO_DONE_DATASET_KEY = 'preloaderDone';
const VISITED_STORAGE_KEY = 'visited';
const INTRO_SESSION_KEY = 'preloaderHasRun';

export function isIntroDone(): boolean {
  if (!browser) return false;
  return document.documentElement.dataset[INTRO_DONE_DATASET_KEY] === 'true';
}

export function markIntroDone(): void {
  if (!browser) return;
  document.documentElement.dataset[INTRO_DONE_DATASET_KEY] = 'true';
  sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
}

export function dispatchIntroDone(): void {
  if (!browser) return;
  window.dispatchEvent(new CustomEvent(INTRO_DONE_EVENT));
}

export function isFirstVisit(): boolean {
  if (!browser) return false;
  return !localStorage.getItem(VISITED_STORAGE_KEY);
}

export function markVisited(): void {
  if (!browser) return;
  localStorage.setItem(VISITED_STORAGE_KEY, 'true');
}
