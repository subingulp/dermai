import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ChartLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import CountUp from '../components/ui/CountUp';
import Modal from '../components/ui/Modal';
import RoutineCompareCard from '../components/ui/RoutineCompareCard';
import Segmented from '../components/ui/Segmented';
import Skeleton from '../components/ui/Skeleton';
import StateMessage from '../components/ui/StateMessage';
import TrendChart from '../components/ui/TrendChart';
import { METRICS, RANGES } from '../data/metrics';
import { useData } from '../context/DataContext';
import { deltaPP, describeDelta, recordsInRange } from '../utils/analysis';
import { fmtShort, fromISO, todayISO } from '../utils/dates';
import { riseIn, staggerParent } from '../animations';

export default function Data() {
  const navigate = useNavigate();
  const { status, error, reload, records, routines } = useData();
  const [range, setRange] = useState('1M');
  const [allOpen, setAllOpen] = useState(false);
  const today = todayISO();

  const series = useMemo(() => recordsInRange(records, range, today), [records, range, today]);
  const timeline = series.slice(-4);
  const sortedRoutines = useMemo(() => [...routines].sort((a, b) => b.date.localeCompare(a.date)), [routines]);

  return (
    <div className="scroll">
      <div className="page">
        <header className="titleblock">
          <h1>My Skin Data</h1>
          <p>See how your skin changes over time ✦</p>
        </header>

        <Segmented id="range" label="Date range" options={RANGES} value={range} onChange={setRange} />

        {status === 'loading' && (
          <div className="stack" aria-busy="true" aria-label="Loading charts">
            {METRICS.map((m) => (
              <Skeleton key={m.key} height={190} />
            ))}
          </div>
        )}

        {status === 'error' && (
          <StateMessage title="We couldn't load your skin data" actionLabel="Try again" onAction={reload}>
            {error}
          </StateMessage>
        )}

        {status === 'ready' && (
          <>
            <section className="block">
              <div className="block__head">
                <h2>Skin Trends</h2>
                <Badge tone="pale">AI MEASURED</Badge>
              </div>
              {series.length > 0 && (
                <p className="block__sub">
                  {fmtShort(series[0].date)}–{fmtShort(series[series.length - 1].date)}, {fromISO(series[series.length - 1].date).getFullYear()} ·
                  Demo values for illustration. pp = percentage points; changes are neutral observations.
                </p>
              )}

              {series.length === 0 ? (
                <StateMessage icon={ChartLine} title="No photos in this range" actionLabel="Take a Photo" onAction={() => navigate('/capture')}>
                  Try a longer range, or add a new photo.
                </StateMessage>
              ) : (
                <motion.div className="stack" key={range} variants={staggerParent} initial="hidden" animate="show">
                  {METRICS.map(({ key, label, Icon }) => {
                    const data = series.map((r) => ({ date: r.date, value: r.metrics[key] }));
                    const latest = data[data.length - 1].value;
                    return (
                      <motion.article className="chartcard" key={key} variants={riseIn}>
                        <div className="chartcard__head">
                          <h3>{label}</h3>
                          <Icon size={18} strokeWidth={2} aria-hidden="true" />
                        </div>
                        <p className="chartcard__value">
                          <strong>
                            <CountUp value={latest} />
                          </strong>
                          <span>{describeDelta(deltaPP(series, key), range)}</span>
                        </p>
                        <TrendChart data={data} label={label} />
                      </motion.article>
                    );
                  })}
                </motion.div>
              )}
            </section>

            {series.length > 0 && (
              <section className="block">
                <div className="block__head">
                  <h2>Skin Timeline</h2>
                  <button type="button" className="linkbtn" onClick={() => setAllOpen(true)}>
                    View all →
                  </button>
                </div>
                <div className="timeline">
                  {timeline.map((r, i) => (
                    <motion.button
                      key={r.id}
                      type="button"
                      className={`timeline__card${i === timeline.length - 1 ? ' is-selected' : ''}`}
                      whileTap={{ scale: 0.96 }}
                      whileHover={{ y: -2 }}
                      onClick={() => navigate(`/history/${r.id}`)}
                      aria-label={`Open analysis from ${fmtShort(r.date)}`}
                    >
                      <img src={r.imageUrl} alt="" draggable="false" />
                      <span>{fmtShort(r.date)}</span>
                      <i aria-hidden="true">↗</i>
                    </motion.button>
                  ))}
                </div>
                <p className="block__sub">Tap a date to explore that day's analysis.</p>
              </section>
            )}

            <section className="block">
              <div className="block__head">
                <h2>Skincare &amp; Skin Changes</h2>
                <button type="button" className="linkbtn" onClick={() => navigate('/me/routine')}>
                  Manage →
                </button>
              </div>
              {sortedRoutines.length === 0 ? (
                <StateMessage title="No routine entries yet" actionLabel="Add a routine" onAction={() => navigate('/me/routine')}>
                  Record a product you start, stop or change, and DermAI shows how your measurements looked around that date.
                </StateMessage>
              ) : (
                <motion.div className="stack" variants={staggerParent} initial="hidden" animate="show">
                  {sortedRoutines.slice(0, 4).map((rt) => (
                    <RoutineCompareCard key={rt.id} routine={rt} records={records} />
                  ))}
                </motion.div>
              )}
            </section>
          </>
        )}
      </div>

      <Modal open={allOpen} onClose={() => setAllOpen(false)} labelledBy="all-photos-title">
        <h2 id="all-photos-title" className="modal__title">
          All photos · {range}
        </h2>
        <div className="allgrid">
          {[...series].reverse().map((r) => (
            <button
              key={r.id}
              type="button"
              className="allgrid__item"
              onClick={() => {
                setAllOpen(false);
                navigate(`/history/${r.id}`);
              }}
            >
              <img src={r.imageUrl} alt="" draggable="false" />
              <span>{fmtShort(r.date)}</span>
            </button>
          ))}
        </div>
        <button type="button" className="btn btn--secondary" onClick={() => setAllOpen(false)}>
          Close
        </button>
      </Modal>
    </div>
  );
}
