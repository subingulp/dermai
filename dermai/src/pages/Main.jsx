import { useMemo } from 'react';
import { motion } from 'motion/react';
import { ImageOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Calendar from '../components/ui/Calendar';
import MetricCard from '../components/ui/MetricCard';
import PhotoCard from '../components/ui/PhotoCard';
import RiskCard from '../components/ui/RiskCard';
import ScanIllustration from '../components/ui/ScanIllustration';
import Skeleton from '../components/ui/Skeleton';
import StateMessage from '../components/ui/StateMessage';
import { METRICS } from '../data/metrics';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { latestPerDate } from '../utils/analysis';
import { fmtShort, greeting, todayISO } from '../utils/dates';
import { riseIn, staggerParent } from '../animations';

export default function Main() {
  const navigate = useNavigate();
  const { selectedDate, setSelectedDate } = useApp();
  const { status, error, reload, records } = useData();

  const byDate = useMemo(() => latestPerDate(records), [records]);
  const recordDates = useMemo(() => new Set(byDate.keys()), [byDate]);
  const record = byDate.get(selectedDate);
  const latest = records[0];
  const isToday = selectedDate === todayISO();

  return (
    <div className="scroll">
      <motion.div className="page" variants={staggerParent} initial="hidden" animate="show">
        <motion.header className="greet" variants={riseIn}>
          <div className="greet__row">
            <span className="brand brand--sm">DermAI</span>
            <Badge>YOUR DAILY MOMENT</Badge>
          </div>
          <h1>{greeting()} ♡</h1>
        </motion.header>

        <motion.div variants={riseIn}>
          <Calendar selected={selectedDate} onSelect={setSelectedDate} recordDates={recordDates} />
        </motion.div>

        <motion.section className="invite" variants={riseIn}>
          <div className="invite__row">
            <div>
              <h2>How's your skin today?</h2>
              <p>Take a photo to start your AI analysis.</p>
            </div>
            <ScanIllustration variant="snap" size="sm" floatingAi={false} />
          </div>
          <Button variant="primary" onClick={() => navigate('/capture')}>
            ＋ Take a Photo
          </Button>
        </motion.section>

        {status === 'loading' && (
          <div className="stack" aria-busy="true" aria-label="Loading your skin data">
            <Skeleton height={28} radius={10} className="w-60" />
            <div className="grid2">
              {METRICS.map((m) => (
                <Skeleton key={m.key} height={112} />
              ))}
            </div>
            <Skeleton height={120} />
          </div>
        )}

        {status === 'error' && (
          <StateMessage title="We couldn't load your skin data" actionLabel="Try again" onAction={reload}>
            {error}
          </StateMessage>
        )}

        {status === 'ready' && (
          <>
            <motion.section className="block" variants={riseIn}>
              <div className="block__head">
                <h2>{isToday ? "Today's Skin" : `Skin on ${fmtShort(selectedDate)}`}</h2>
                {record && <Badge tone="pale">DEMO DATA</Badge>}
              </div>
              {record ? (
                <p className="block__sub">AI-generated from {isToday ? 'your latest skin photo' : 'your photo on this day'}</p>
              ) : null}

              {record ? (
                <motion.div key={record.id} className="grid2" variants={staggerParent} initial="hidden" animate="show">
                  {METRICS.map((m) => (
                    <MetricCard key={m.key} metric={m} value={record.metrics[m.key]} />
                  ))}
                </motion.div>
              ) : (
                <StateMessage
                  icon={ImageOff}
                  compact
                  title="No analysis for this day"
                  actionLabel={isToday ? 'Take a Photo' : undefined}
                  onAction={() => navigate('/capture')}
                >
                  {isToday
                    ? 'Take a photo and your measurements will show up here.'
                    : 'Pick a date with a dot under it, or head to Data to see all your photos.'}
                </StateMessage>
              )}
            </motion.section>

            {record && (
              <RiskCard risk={record.risk} onView={() => navigate(`/risk/${record.id}`)} />
            )}

            {latest && (
              <motion.section className="block" variants={riseIn}>
                <h2>Your latest photo</h2>
                <PhotoCard record={latest} onOpen={() => navigate(`/history/${latest.id}`)} />
              </motion.section>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
