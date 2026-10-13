// Screens reached from the Me tab: skin profile, skincare routine,
// analysis settings, privacy & data, about.

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FlaskConical, Info, Plus, Trash2 } from 'lucide-react'
import Modal from '../components/Modal'
import Screen, { ScreenHeader } from '../components/Screen'
import { Button, EmptyState, Notice, Toggle } from '../components/ui'
import { DEMO_TODAY, ROUTINE_CATEGORIES } from '../data/mock'
import { addSkincare } from '../services/api'
import { useApp } from '../state/AppContext'
import { formatShort } from '../utils/date'

/* ---------------- My Skin Profile ---------------- */
const SKIN_TYPES = ['Dry', 'Oily', 'Combination', 'Normal', 'Sensitive']
const CONCERNS = ['Redness', 'Breakouts', 'Dryness', 'Oiliness']

export function Profile({ nav }) {
  const { profile, dispatch } = useApp()
  const toggleConcern = (c) =>
    dispatch({
      type: 'SET_PROFILE',
      profile: { concerns: profile.concerns.includes(c) ? profile.concerns.filter((x) => x !== c) : [...profile.concerns, c] },
    })

  return (
    <Screen>
      <div className="stack-16">
        <ScreenHeader title="My Skin Profile" onBack={nav.back} subtitle="Optional. This only personalises how you read your own data." />
        <section className="card panel stack-12">
          <h2 className="h3">Skin type</h2>
          <div className="chips">
            {SKIN_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                className="chip"
                aria-pressed={profile.skinType === t}
                onClick={() => dispatch({ type: 'SET_PROFILE', profile: { skinType: profile.skinType === t ? null : t } })}
              >
                {t}
              </button>
            ))}
          </div>
        </section>
        <section className="card panel stack-12">
          <h2 className="h3">What would you like to watch?</h2>
          <div className="chips">
            {CONCERNS.map((c) => (
              <button key={c} type="button" className="chip" aria-pressed={profile.concerns.includes(c)} onClick={() => toggleConcern(c)}>
                {c}
              </button>
            ))}
          </div>
        </section>
        <p className="tiny">Saved on this device for this session only (demo).</p>
      </div>
    </Screen>
  )
}

/* ---------------- My Skincare Routine ---------------- */
function AddRoutineForm({ onDone }) {
  const { dispatch } = useApp()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Treatment')
  const [date, setDate] = useState(DEMO_TODAY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const next = {}
    const trimmed = name.trim()
    if (trimmed.length < 2) next.name = 'Enter a product or routine name (at least 2 characters).'
    if (trimmed.length > 40) next.name = 'Please keep the name under 40 characters.'
    if (!date) next.date = 'Choose the date you started.'
    else if (date > DEMO_TODAY) next.date = 'The start date can’t be in the future.'
    setErrors(next)
    if (Object.keys(next).length) return

    setSaving(true)
    const routine = await addSkincare({ name: trimmed, category, date })
    dispatch({ type: 'ADD_ROUTINE', routine })
    setSaving(false)
    onDone()
  }

  return (
    <form className="stack-16" onSubmit={submit} noValidate>
      <h2 id="routine-title" className="modal__title">
        Add to your routine
      </h2>
      <label className="field">
        <span className="field__label">Product or routine</span>
        <input
          className="field__input"
          value={name}
          maxLength={60}
          placeholder="e.g. Retinol serum"
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(errors.name)}
          autoFocus
        />
        {errors.name && <span className="field__error">{errors.name}</span>}
      </label>
      <div className="field">
        <span className="field__label">Type</span>
        <div className="chips">
          {ROUTINE_CATEGORIES.map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={category === c} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <label className="field">
        <span className="field__label">Started on</span>
        <input className="field__input" type="date" value={date} max={DEMO_TODAY} onChange={(e) => setDate(e.target.value)} aria-invalid={Boolean(errors.date)} />
        {errors.date && <span className="field__error">{errors.date}</span>}
      </label>
      <div className="modal__actions">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save to routine'}
        </Button>
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export function Routine({ nav }) {
  const { routines, dispatch } = useApp()
  const [adding, setAdding] = useState(false)
  const sorted = [...routines].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <Screen>
      <div className="stack-16">
        <ScreenHeader title="My Skincare Routine" onBack={nav.back} subtitle="Dated events appear on the Data tab next to your measurements." />

        {sorted.length ? (
          <ul className="routine-list">
            <AnimatePresence initial={false}>
              {sorted.map((r) => (
                <motion.li
                  key={r.id}
                  className="card routine-row"
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
                >
                  <span className="routine__icon">
                    <FlaskConical size={20} />
                  </span>
                  <span className="routine-row__text">
                    <span className="routine-row__name">{r.name}</span>
                    <span className="tiny">
                      {r.category} · started {formatShort(r.date)}
                    </span>
                  </span>
                  <motion.button
                    type="button"
                    className="icon-btn"
                    aria-label={`Remove ${r.name}`}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => dispatch({ type: 'REMOVE_ROUTINE', id: r.id })}
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <EmptyState icon={FlaskConical} title="Nothing recorded yet">
            Add a product or routine to compare it with your skin measurements.
          </EmptyState>
        )}

        <Button onClick={() => setAdding(true)}>
          <Plus size={18} /> Add product or routine
        </Button>
        <p className="tiny">Comparisons show how measurements changed around a date. They do not show that a product caused the change.</p>
      </div>

      <Modal open={adding} onClose={() => setAdding(false)} labelledBy="routine-title">
        <AddRoutineForm onDone={() => setAdding(false)} />
      </Modal>
    </Screen>
  )
}

/* ---------------- AI Analysis Settings ---------------- */
export function Settings({ nav }) {
  const { settings, dispatch } = useApp()
  const [resetDone, setResetDone] = useState(false)
  return (
    <Screen>
      <div className="stack-16">
        <ScreenHeader title="AI Analysis Settings" onBack={nav.back} />
        <section className="card panel">
          <div className="setting">
            <div>
              <p className="h3" style={{ fontSize: 15 }}>
                Save analyses to my timeline
              </p>
              <p className="tiny">When off, results are shown once and not stored.</p>
            </div>
            <Toggle label="Save analyses to my timeline" checked={settings.saveToTimeline} onChange={(v) => dispatch({ type: 'SET_SETTING', key: 'saveToTimeline', value: v })} />
          </div>
        </section>
        <section className="card panel stack-8">
          <h2 className="h3">Analysis pipeline</h2>
          <p className="small">Skin Photo → Automatic Region Detection → ROI Crop → Few-shot Learning Model → AI Risk Assessment</p>
          <p className="tiny">In this demo the pipeline is simulated. No photo leaves your browser.</p>
        </section>
        <Button
          variant="secondary"
          onClick={() => {
            dispatch({ type: 'RESET_DEMO' })
            setResetDone(true)
          }}
        >
          Reset demo data
        </Button>
        {resetDone && (
          <p className="tiny" role="status">
            Demo data restored to its starting state.
          </p>
        )}
      </div>
    </Screen>
  )
}

/* ---------------- Privacy & Data ---------------- */
export function Privacy({ nav }) {
  const { records, routines, dispatch } = useApp()
  const [confirm, setConfirm] = useState(false)
  const yours = records.filter((r) => r.userAdded).length + routines.filter((r) => r.userAdded).length

  return (
    <Screen>
      <div className="stack-16">
        <ScreenHeader title="Privacy & Data" onBack={nav.back} />
        <section className="card panel stack-8">
          <h2 className="h3">Where your photos go</h2>
          <p className="small">
            In this demo build, photos stay in your browser tab. Nothing is uploaded, and everything you add is cleared when you
            close or refresh the page.
          </p>
        </section>
        <section className="card panel stack-8">
          <h2 className="h3">Your guest data</h2>
          <p className="small">
            {yours ? `${yours} item${yours === 1 ? '' : 's'} you added (photos and routines).` : 'You have not added any photos or routines yet.'}
          </p>
        </section>
        <Button variant="secondary" disabled={!yours} onClick={() => setConfirm(true)}>
          Delete my photos &amp; data
        </Button>
        <Notice icon={Info}>Sample records that ship with the demo are not affected.</Notice>
      </div>

      <Modal open={confirm} onClose={() => setConfirm(false)} labelledBy="del-title">
        <h2 id="del-title" className="modal__title">
          Delete your data?
        </h2>
        <p className="modal__text">This removes the photos and routines you added. It can’t be undone.</p>
        <div className="modal__actions">
          <Button
            onClick={() => {
              dispatch({ type: 'CLEAR_USER_DATA' })
              setConfirm(false)
            }}
          >
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setConfirm(false)}>
            Keep my data
          </Button>
        </div>
      </Modal>
    </Screen>
  )
}

/* ---------------- About DermAI ---------------- */
export function About({ nav }) {
  return (
    <Screen>
      <div className="stack-16">
        <ScreenHeader title="About DermAI" onBack={nav.back} />
        <section className="card panel stack-8">
          <p className="brand" style={{ fontSize: 22 }}>
            DermAI ✦
          </p>
          <p className="small">A little clarity, every day. DermAI turns one photo into dated skin measurements so you can see how your skin changes over time.</p>
          <p className="tiny">Version 1.0 (frontend demo with mock data)</p>
        </section>
        <Notice icon={Info}>Observation over time. Never a medical diagnosis.</Notice>
        <Button variant="secondary" onClick={() => nav.go('tutorial')}>
          Replay the tutorial
        </Button>
      </div>
    </Screen>
  )
}
