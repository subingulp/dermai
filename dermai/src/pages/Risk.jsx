import { motion } from 'motion/react';
import { SearchX } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Disclaimer from '../components/ui/Disclaimer';
import PageHeader from '../components/ui/PageHeader';
import PhotoFrame, { RoiCrop } from '../components/ui/PhotoFrame';
import Skeleton from '../components/ui/Skeleton';
import StateMessage from '../components/ui/StateMessage';
import PageTransition from '../components/layout/PageTransition';
import { useData } from '../context/DataContext';
import { fmtDateTime } from '../utils/dates';
import { riseIn, staggerParent } from '../animations';

const LEVELS = [
  { key: 'none', label: 'No notable region' },
  { key: 'monitor', label: 'Worth monitoring' },
  { key: 'advice', label: 'Consider professional advice' },
];

const NEXT_STEPS = {
  none: [
    'Keep taking a photo in similar light every week or two.',
    'Watch the Data tab for slow changes rather than single days.',
    'If something looks or feels different to you, trust that and ask a dermatologist.',
  ],
  monitor: [
    'Take another photo in 1–2 weeks, in similar light, and compare.',
    'Note anything that itches, bleeds or changes shape or colour.',
    'If you are worried, or it changes, see a dermatologist. This app cannot tell you what it is.',
  ],
};

export default function Risk() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { status, getRecord } = useData();
  const record = getRecord(id);

  if (status === 'loading') {
    return (
      <PageTransition className="screen">
        <div className="page">
          <PageHeader title="AI Risk Assessment" back="/app/main" />
          <Skeleton height={140} />
          <Skeleton height={200} />
        </div>
      </PageTransition>
    );
  }

  if (!record) {
    return (
      <PageTransition className="screen">
        <div className="page page--center">
          <StateMessage icon={SearchX} title="We couldn't find that assessment" actionLabel="Back to Main" onAction={() => navigate('/app/main')}>
            Demo data only lasts for one visit.
          </StateMessage>
        </div>
      </PageTransition>
    );
  }

  const level = record.risk.level;

  return (
    <PageTransition className="screen">
      <div className="scroll">
        <motion.div className="page" variants={staggerParent} initial="hidden" animate="show">
          <PageHeader title="AI Risk Assessment" back={`/results/${record.id}`} />

          <motion.section className="risk risk--big" variants={riseIn}>
            <div className="risk__top">
              <h3>✦ AI Risk Assessment</h3>
              <Badge tone="cream">DEMO</Badge>
            </div>
            <p>{record.risk.headline}</p>
            <small>
              {record.risk.detail} · {fmtDateTime(record.date, record.time)}
            </small>
          </motion.section>

          <motion.section className="block" variants={riseIn}>
            <h2>Observation scale</h2>
            <p className="block__sub">A plain-language scale, not a probability or a diagnosis.</p>
            <ol className="scale" aria-label="Observation scale">
              {LEVELS.map((l) => (
                <li key={l.key} className={l.key === level ? 'is-current' : ''} aria-current={l.key === level ? 'true' : undefined}>
                  <span />
                  {l.label}
                </li>
              ))}
            </ol>
          </motion.section>

          <motion.section className="block" variants={riseIn}>
            <h2>Region reviewed</h2>
            <div className="regionrow">
              <PhotoFrame src={record.imageUrl} alt="Your photo with the reviewed region outlined" region={record.region} regionLabel={record.region.label} />
              <div className="regionrow__crop">
                <RoiCrop src={record.imageUrl} region={record.region} />
                <small>{record.region.label} · automatic ROI crop</small>
              </div>
            </div>
            <p className="fine">You didn't have to mark anything. DermAI found and cropped this region by itself.</p>
          </motion.section>

          <motion.section className="panel" variants={riseIn}>
            <h2 className="panel__title">Suggested next steps</h2>
            <ul className="bullets">
              {(NEXT_STEPS[level] || NEXT_STEPS.monitor).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </motion.section>

          <motion.div variants={riseIn}>
            <Disclaimer>AI results are for observation and reference, not medical diagnosis. This is demonstration output.</Disclaimer>
          </motion.div>

          <motion.div className="actions" variants={riseIn}>
            <Button variant="primary" onClick={() => navigate('/app/data')}>
              View My Skin Data →
            </Button>
            <Button variant="secondary" onClick={() => navigate(`/results/${record.id}`)}>
              Back to results
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
