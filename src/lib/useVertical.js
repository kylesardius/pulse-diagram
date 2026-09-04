import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_VERTICAL, getVertical, verticals } from '../data/verticals.js';

const STORAGE_KEY = 'selectedVertical';
export const FADE_MS = 200;

function initialVertical() {
  if (typeof window === 'undefined') return DEFAULT_VERTICAL;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (verticals.some((v) => v.id === stored)) return stored;
  } catch (e) {
    /* localStorage unavailable — fall through */
  }
  return DEFAULT_VERTICAL;
}

/**
 * Active vertical, persisted, with a fade window on change: the caller drops
 * content to zero opacity, the swap happens unseen, then it fades back.
 */
export default function useVertical() {
  const [verticalId, setVerticalId] = useState(initialVertical);
  const [pendingId, setPendingId] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, verticalId);
    } catch (e) {
      /* ignore write failures (private mode, etc.) */
    }
  }, [verticalId]);

  useEffect(() => {
    if (!pendingId) return undefined;
    const timer = setTimeout(() => {
      setVerticalId(pendingId);
      setPendingId(null);
    }, FADE_MS);
    return () => clearTimeout(timer);
  }, [pendingId]);

  const selectVertical = useCallback(
    (id) => {
      setPendingId((current) => (id === verticalId ? current : id));
    },
    [verticalId]
  );

  return {
    vertical: getVertical(verticalId),
    verticalId,
    // The control tracks the click immediately; the content catches up after
    // the fade, so the dropdown never looks unresponsive.
    selectedId: pendingId || verticalId,
    selectVertical,
    isFading: pendingId !== null
  };
}
