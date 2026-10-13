import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Info, Sparkles, TriangleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Disclaimer from '../components/ui/Disclaimer';
import ScanIllustration from '../components/ui/ScanIllustration';
import StateMessage from '../components/ui/StateMessage';
import PageTransition from '../components/layout/PageTransition';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { ANALYSIS_STAGES, analyzePhoto } from '../services/api';

export default function Analyzing() {
  const navigate = useNavigate();
  const { photo, releasePhoto, setSelectedDate } = useApp();
  const { addRecord } = useData();
  const [progress, setProgress] = useState({ pct: 0, stageIndex: 0 });
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Opened directly without a photo? Go back and pick one.
    if (!photo) {
      navigate('/capture', { replace: true });
      return undefined;
    }
    const ctrl = new AbortController();
    setError('');
    setProgress({ pct: 0, stageIndex: 0 });

    analyzePhoto(photo.file, { imageUrl: photo.url, signal: ctrl.signal, onProgress: setProgress })
      .then((record) => {
        addRecord(record);
        setSelectedDate(record.date);
        releasePhoto(); // the record now owns the photo URL
        navigate(`/results/${record.id}`, { replace: true, state: { fresh: true } });
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setError(e.message || 'Something went wrong.');
      });

    return () => ctrl.abort(); // leaving the screen cancels the simulated analysis
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const stage = ANALYSIS_STAGES[progress.stageIndex];
  const done = progress.pct >= 100;

  const items = [
    { label: 'Photo received', state: progress.stageIndex >= 1 ? 'done' : 'active' },
    { label: 'Automatic region detection', state: progress.stageIndex >= 2 ? 'done' : progress.stageIndex === 1 ? 'active' : 'idle' },
    { label: 'AI measurements & risk assessment', state: done ? 'done' : progress.stageIndex >= 2 ? 'active' : 'idle' },
  ];

  if (error) {
    return (
      <PageTransition className="screen analyzing">
        <div className="page page--center">
          <StateMessage
            icon={TriangleAlert}
            title="We couldn't analyze this photo"
            actionLabel="Try again"
            onAction={() => setAttempt((a) => a + 1)}
            secondaryLabel="Choose another photo"
            onSecondary={() => navigate('/capture')}
          >
            {error} Your photo was not saved.
          </StateMessage>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="screen analyzing">
      <div className="page page--center">
        <p className="brand brand--center">DermAI ✦</p>

        <ScanIllustration variant="measure" />

        <div className="analyzing__copy" aria-live="polite">
          <h1>Analyzing your skin…</h1>
          <p>Turning your photo into a little more clarity. No manual ratings needed.</p>
        </div>

        <section className="progress" aria-label="Analysis progress">
          <div className="progress__label">
            <span>{stage.label}</span>
            <strong>{progress.pct}%</strong>
          </div>
          <div className="progress__track" role="progressbar" aria-valuenow={progress.pct} aria-valuemin={0} aria-valuemax={100}>
            <motion.div className="progress__fill" animate={{ width: `${progress.pct}%` }} transition={{ duration: 0.2, ease: 'linear' }} />
          </div>
          <ul className="checklist">
            {items.map((it) => (
              <li key={it.label} className={`is-${it.state}`}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={it.state}
                    className="checklist__icon"
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    {it.state === 'done' ? <Check size={15} strokeWidth={3} /> : it.state === 'active' ? <Sparkles size={15} /> : <i />}
                  </motion.span>
                </AnimatePresence>
                {it.label}
              </li>
            ))}
          </ul>
        </section>

        <Disclaimer>AI results are for observation and reference, not medical diagnosis.</Disclaimer>
        <p className="demo-line">
          <Info size={12} aria-hidden="true" /> Demo build: this analysis is simulated.
        </p>
        <Button variant="text" onClick={() => navigate('/capture')}>
          Cancel
        </Button>
      </div>
    </PageTransition>
  );
}
