import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FlaskConical, Trash2 } from 'lucide-react';
import SubPage from './SubPage';
import Button from '../../components/ui/Button';
import StateMessage from '../../components/ui/StateMessage';
import { useData } from '../../context/DataContext';
import { fmtShort, todayISO } from '../../utils/dates';

const ACTIONS = ['Added', 'Stopped', 'Changed'];

export default function Routine() {
  const { routines, addRoutine, removeRoutine } = useData();
  const [action, setAction] = useState('Added');
  const [name, setName] = useState('');
  const [date, setDate] = useState(todayISO());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setDone('');
    if (!name.trim()) return setError('Please enter a product or step name.');
    if (!date || date > todayISO()) return setError('Please choose today or an earlier date.');
    setError('');
    setBusy(true);
    try {
      await addRoutine({ action, name, date });
      setName('');
      setDone(`${action} ${name.trim()} · ${fmtShort(date)}`);
    } catch (err) {
      setError(err.message || "We couldn't save that. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const sorted = [...routines].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <SubPage title="My Skincare Routine">
      <form className="panel" onSubmit={submit} noValidate>
        <h2 className="panel__title">Add an entry</h2>
        <div className="chips" role="radiogroup" aria-label="What happened">
          {ACTIONS.map((a) => (
            <button
              key={a}
              type="button"
              role="radio"
              aria-checked={action === a}
              className={`chip${action === a ? ' is-on' : ''}`}
              onClick={() => setAction(a)}
            >
              {a}
            </button>
          ))}
        </div>

        <label className="field">
          <span>Product or step</span>
          <input type="text" value={name} maxLength={40} placeholder="e.g. Retinol serum" onChange={(e) => setName(e.target.value)} />
        </label>

        <label className="field">
          <span>Date</span>
          <input type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} />
        </label>

        {error && (
          <p className="formerror" role="alert">
            {error}
          </p>
        )}
        {done && (
          <p className="formok" role="status">
            Saved: {done}
          </p>
        )}

        <Button variant="primary" type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Add to routine'}
        </Button>
      </form>

      <section className="block">
        <h2>Your entries</h2>
        {sorted.length === 0 ? (
          <StateMessage compact icon={FlaskConical} title="Nothing here yet">
            Add the first product or step above.
          </StateMessage>
        ) : (
          <ul className="entries">
            <AnimatePresence initial={false} mode="popLayout">
              {sorted.map((r) => (
                <motion.li
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.22 }}
                >
                  <span className="routine__icon">
                    <FlaskConical size={18} aria-hidden="true" />
                  </span>
                  <div>
                    <small>{fmtShort(r.date)}</small>
                    <strong>
                      {r.action} {r.name}
                    </strong>
                  </div>
                  <button type="button" className="iconbtn iconbtn--ghost" aria-label={`Remove ${r.action} ${r.name}`} onClick={() => removeRoutine(r.id)}>
                    <Trash2 size={17} />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>
    </SubPage>
  );
}
