import type { SavedResult } from '../types';

const STORAGE_KEY = 'aiFortuneResults';

export const getSavedResults = (): SavedResult[] => {
  try {
    if (typeof window === 'undefined') return [];
    const results = localStorage.getItem(STORAGE_KEY);
    return results ? JSON.parse(results) : [];
  } catch (error) {
    console.error("Failed to parse saved results from localStorage", error);
    return [];
  }
};

export const saveResult = (result: SavedResult): void => {
  if (typeof window === 'undefined') return;
  const results = getSavedResults();
  const newResults = [result, ...results];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newResults));
};

export const deleteResult = (id: string): void => {
  if (typeof window === 'undefined') return;
  const results = getSavedResults();
  const newResults = results.filter(result => result.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newResults));
};
