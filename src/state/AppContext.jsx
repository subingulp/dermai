// App-wide state: skin records, skincare routines, selected date and settings.
// A reducer keeps every change in one readable place.

import { createContext, useContext, useMemo, useReducer } from 'react'
import { DEMO_TODAY, SEED_RECORDS, SEED_ROUTINES } from '../data/mock'

const AppContext = createContext(null)

const initialState = {
  records: SEED_RECORDS,
  routines: SEED_ROUTINES,
  selectedDate: DEMO_TODAY,
  settings: { saveToTimeline: true },
  profile: { skinType: null, concerns: [] },
}

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_DATE':
      return { ...state, selectedDate: action.date }

    case 'ADD_RECORD': {
      // One record per day: a new photo replaces the earlier one for that date.
      const others = state.records.filter((r) => r.date !== action.record.date)
      const records = [...others, action.record].sort((a, b) => a.date.localeCompare(b.date))
      return { ...state, records }
    }

    case 'ADD_ROUTINE':
      return { ...state, routines: [...state.routines, action.routine] }

    case 'REMOVE_ROUTINE':
      return { ...state, routines: state.routines.filter((r) => r.id !== action.id) }

    case 'SET_SETTING':
      return { ...state, settings: { ...state.settings, [action.key]: action.value } }

    case 'SET_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.profile } }

    case 'CLEAR_USER_DATA':
      return {
        ...state,
        records: state.records.filter((r) => !r.userAdded),
        routines: state.routines.filter((r) => !r.userAdded),
      }

    case 'RESET_DEMO':
      return { ...initialState }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = useMemo(() => ({ ...state, dispatch }), [state])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}

export const recordForDate = (records, date) => records.find((r) => r.date === date) ?? null
export const latestRecord = (records) => records[records.length - 1] ?? null
