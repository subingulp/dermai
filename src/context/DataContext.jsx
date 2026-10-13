import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../services/api';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [error, setError] = useState(null);
  const [records, setRecords] = useState([]); // newest first
  const [routines, setRoutines] = useState([]);

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const [h, r] = await Promise.all([api.getSkinHistory(), api.getSkincare()]);
      setRecords(h);
      setRoutines(r);
      setStatus('ready');
    } catch (e) {
      setError(e.message || 'Something went wrong.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addRecord = useCallback((rec) => setRecords((prev) => [rec, ...prev]), []);

  const addRoutine = useCallback(async (entry) => {
    const created = await api.addSkincare(entry);
    setRoutines((prev) => [...prev, created]);
    return created;
  }, []);

  const removeRoutine = useCallback(async (id) => {
    await api.deleteSkincare(id);
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const getRecord = useCallback((id) => records.find((r) => r.id === id), [records]);

  const value = useMemo(
    () => ({ status, error, records, routines, reload: load, addRecord, addRoutine, removeRoutine, getRecord }),
    [status, error, records, routines, load, addRecord, addRoutine, removeRoutine, getRecord],
  );
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside <DataProvider>');
  return ctx;
};
