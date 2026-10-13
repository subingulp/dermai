import { motion } from 'motion/react';
import { SearchX } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Disclaimer from '../components/ui/Disclaimer';
import MetricCard from '../components/ui/MetricCard';
import PageHeader from '../components/ui/PageHeader';
import PhotoFrame, { RoiCrop } from '../components/ui/PhotoFrame';
import RiskCard from '../components/ui/RiskCard';
import Skeleton from '../components/ui/Skeleton';
import StateMessage from '../components/ui/StateMessage';
import PageTransition from '../components/layout/PageTransition';
import { METRICS } from '../data/metrics';
import { useData } from '../context/DataContext';
import { fmtDateTime } from '../utils/dates';
import { riseIn, staggerParent } from '../animations';

export const PIPELINE = [
  { title: 'Skin Photo', text: 'Your original image goes in.' },
  { title: 'Automatic Region Detection', text: 'AI locates candidate regions on its own.' },
  { title: 'ROI Crop', text: 'The region is cropped for a closer look.', crop: true },
  { title: 'Few-shot Learning Model', text: 'The cropped region is analyzed by the model.' },
  { title: 'AI Risk Assessment', text: 'An observational summary is generated.' },
];

export default function Results() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { status, getRecord, reload } = useData();
  const record = getRecord(id);
  const fresh = Boolean(state?.fresh);

  if (status === 'loading') {
    return (
      <PageTransition className="screen">
        <div className="scroll">
          <div className="page">
            <PageHeader title="Skin analysis" back="/app/main" />
            <Skeleton height={190} />
            <Skeleton height={230} />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!record) {
    return (
      <PageTransition className="screen">
        <div className="page page--center">
          <StateMessage
            icon={SearchX}
            title="We couldn't find that analysis"
            actionLabel="Back to Main"
            onAction={() => navigate('/app/main')}
            secondaryLabel={status === 'error' ? 'Try loading again' : undefined}
            onSecondary={reload}
          >
            It may have been cleared when the page was reloaded. Demo data only lasts for one visit.
          </StateMessage>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="screen">
      <div className="scroll">
        <motion.div className="page" variants={staggerParent} initial="hidden" animate="show">
          <PageHeader title={fresh ? 'AI Skin Analysis Complete' : 'Skin analysis'} back={fresh ? '/app/main' : -1} />

          <motion.div className="metaline" variants={riseIn}>
            <Badge>{fresh ? 'SAVED TO YOUR TIMELINE' : 'FROM YOUR TIMELINE'}</Badge>
            <span>{fmtDateTime(record.date, record.time).replace(',', ' ·')}</span>
          </motion.div>

          <motion.div className="demo-banner" variants={riseIn}>
            <strong>Demo data.</strong> These values are simulated. The real AI model isn't connected yet.
          </motion.div>

          <motion.div className="compare" variants={riseIn}>
            <figure>
              <figcaption>Original skin photo</figcaption>
              <PhotoFrame src={record.imageUrl} alt="Your original skin photo" />
            </figure>
            <figure>
              <figcaption>AI-detected regions</figcaption>
              <PhotoFrame src={record.imageUrl} alt="Your photo with the candidate region outlined" region={record.region} regionLabel={record.region.label} />
            </figure>
          </motion.div>
          <motion.p className="fine" variants={riseIn}>
            Regions are detected automatically by AI. A candidate region is not a diagnosis or a confirmed risk.
          </motion.p>

          <motion.section className="block" variants={riseIn}>
            <h2>AI-generated measurements</h2>
            <p className="block__sub">From this photo · illustrative values</p>
          </motion.section>
          <motion.div className="grid2" variants={staggerParent}>
            {METRICS.map((m) => (
              <MetricCard key={m.key} metric={m} value={record.metrics[m.key]} />
            ))}
          </motion.div>

          <motion.section className="how" variants={riseIn}>
            <h2>How AI Risk Assessment works</h2>
            <p className="block__sub">From the full photo to an observational result — automatically.</p>
            <ol>
              {PIPELINE.map((s, i) => (
                <li key={s.title}>
                  <span className="how__num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{s.title}</strong>
                    <small>{s.text}</small>
                  </div>
                  {s.crop && <RoiCrop src={record.imageUrl} region={record.region} className="how__crop" />}
                </li>
              ))}
            </ol>
          </motion.section>

          <RiskCard risk={record.risk} footer={record.risk.detail} onView={() => navigate(`/risk/${record.id}`)} actionLabel="See how this was assessed →" />

          <motion.div variants={riseIn}>
            <Disclaimer />
          </motion.div>

          <motion.div className="actions" variants={riseIn}>
            <Button variant="primary" onClick={() => navigate('/app/data')}>
              View My Skin Data →
            </Button>
            <Button variant="secondary" onClick={() => navigate('/app/main')}>
              Back to Main
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
