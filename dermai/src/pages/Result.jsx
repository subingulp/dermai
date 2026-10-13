// "AI Skin Analysis Complete". Also used to open a saved record from the
// Main tab or the Data timeline.

import { motion } from 'motion/react'
import { Info } from 'lucide-react'
import { RegionPhoto, RiskCard } from '../components/Cards'
import MetricsGrid from '../components/MetricCard'
import Pipeline from '../components/Pipeline'
import Screen, { ScreenHeader } from '../components/Screen'
import { Badge, Button, Notice } from '../components/ui'
import { item, stagger } from '../components/motionPresets'
import { DEMO_TODAY } from '../data/mock'
import { formatShort } from '../utils/date'

export default function Result({ record, saved = true, nav }) {
  const dateText = `${record.date === DEMO_TODAY ? 'Today' : formatShort(record.date)} · ${record.time}`

  return (
    <Screen className="result">
      <motion.div className="stack-16" variants={stagger} initial="hidden" animate="show">
        <motion.div variants={item}>
          <ScreenHeader title="AI Skin Analysis Complete" onBack={nav.back} />
        </motion.div>

        <motion.div className="row-between" variants={item}>
          <Badge>{saved ? 'SAVED TO YOUR TIMELINE' : 'NOT SAVED'}</Badge>
          <span className="tiny">{dateText}</span>
        </motion.div>

        <motion.div className="photo-pair" variants={item}>
          <figure>
            <RegionPhoto src={record.photoUrl} alt="Your original skin photo" />
            <figcaption>Original skin photo</figcaption>
          </figure>
          <figure>
            <RegionPhoto src={record.photoUrl} regions={record.regions} showRegions alt="Your photo with the detected region outlined" />
            <figcaption>AI-detected regions</figcaption>
          </figure>
        </motion.div>

        <motion.p className="small" variants={item}>
          Regions are detected automatically by AI. A candidate region is not a diagnosis or a confirmed risk.
        </motion.p>

        <motion.div className="stack-8" variants={item}>
          <h2 className="h2">AI-generated measurements</h2>
          <p className="small">From this photo · illustrative values</p>
        </motion.div>
        <MetricsGrid metrics={record.metrics} />
        {record.isMock && (
          <motion.p className="tiny" variants={item}>
            Demo values: no real AI model is connected yet.
          </motion.p>
        )}

        <motion.section className="card pipeline-card" variants={item} aria-label="How AI Risk Assessment works">
          <h2 className="h3" style={{ fontSize: 18 }}>
            How AI Risk Assessment works
          </h2>
          <p className="small">From the full photo to an observational result — automatically.</p>
          <Pipeline record={record} />
        </motion.section>

        <RiskCard record={record} onOpen={() => nav.go('risk', { record })} linkLabel="View full assessment →" />

        <motion.div variants={item}>
          <Notice icon={Info}>AI results are for observation and reference, not medical diagnosis.</Notice>
        </motion.div>

        <motion.div className="stack-12" variants={item}>
          <Button
            onClick={() => {
              nav.setTab('data')
              nav.reset('tabs')
            }}
          >
            View My Skin Data →
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              nav.setTab('main')
              nav.reset('tabs')
            }}
          >
            Back to Main
          </Button>
        </motion.div>
      </motion.div>
    </Screen>
  )
}
