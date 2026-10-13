import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { todayISO } from '../utils/dates';

const KEY = 'dermai.prefs.v1';

const DEFAULTS = {
  guest: false,
  tutorialSeen: false,
  settings: { reduceMotion: false },
  profile: { name: 'Guest User', skinType: '', concerns: [] },
};

// localStorage can throw (private windows, blocked storage) so every access is wrapped.
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!raw) return DEFAULTS;
    return {
      ...DEFAULTS,
      ...raw,
      settings: { ...DEFAULTS.settings, ...raw.settings },
      profile: { ...DEFAULTS.profile, ...raw.profile },
    };
  } catch {
    return DEFAULTS;
  }
}
function save(prefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [prefs, setPrefs] = useState(load);
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [photo, setPhotoState] = useState(null); // { file, url } waiting to be analysed

  // Nothing is written until something changes (and a reset leaves no trace behind).
  useEffect(() => {
    if (prefs !== DEFAULTS) save(prefs);
  }, [prefs]);

  const enterAsGuest = useCallback(() => setPrefs((p) => ({ ...p, guest: true })), []);
  const finishTutorial = useCallback(() => setPrefs((p) => ({ ...p, guest: true, tutorialSeen: true })), []);
  const updateSettings = useCallback((patch) => setPrefs((p) => ({ ...p, settings: { ...p.settings, ...patch } })), []);
  const updateProfile = useCallback((patch) => setPrefs((p) => ({ ...p, profile: { ...p.profile, ...patch } })), []);

  const setPhoto = useCallback((next) => {
    setPhotoState((old) => {
      if (old?.url && old.url !== next?.url) URL.revokeObjectURL(old.url);
      return next;
    });
  }, []);
  // After a successful analysis the record keeps using the photo URL, so we must not revoke it.
  const releasePhoto = useCallback(() => setPhotoState(null), []);

  const resetAll = useCallback(() => {
    setPhotoState((old) => {
      if (old?.url) URL.revokeObjectURL(old.url);
      return null;
    });
    setPrefs(DEFAULTS);
    setSelectedDate(todayISO());
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({
      ...prefs,
      selectedDate,
      setSelectedDate,
      photo,
      setPhoto,
      releasePhoto,
      enterAsGuest,
      finishTutorial,
      updateSettings,
      updateProfile,
      resetAll,
    }),
    [prefs, selectedDate, photo, setPhoto, releasePhoto, enterAsGuest, finishTutorial, updateSettings, updateProfile, resetAll],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
};

/** True when animations should be skipped (OS setting OR the in-app switch in Me > Settings). */
export function useReduceMotion() {
  const os = useReducedMotion();
  const { settings } = useApp();
  return Boolean(os || settings.reduceMotion);
}
