// AI Risk Assessment detail: what the (mock) pipeline looked at and how to read it.

import { motion } from 'motion/react'
import { Info } from 'lucide-react'
import { RegionPhoto, RiskCard, RoiThumb } from '../components/Cards'
import Screen, { ScreenHeader } from '../components/Screen'
import { Button, Notice } from '../components/ui'
import { item, stagger } from '../components/motionPresets'
import { formatShort } from '../utils/date'

export default function RiskDetail({ record, nav }) {
  const region = record.regions[0]
  return (
    <Screen className="risk">
      <motion.div className="stack-16" variants={stagger} initial="hidden" animate="show">
        <motion.div variants={item}>
          <ScreenHeader title="AI Risk Assessment" onBack={nav.back} subtitle={`From your photo on ${formatShort(record.date)} · ${record.time}`} />
        </motion.div>

        <RiskCard record={record} />

        {record.isMock && (
          <motion.div variants={item}>
            <Notice icon={Info}>Demo result. No real AI model is connected yet, so this is placeholder wording.</Notice>
          </motion.div>
        )}

        <motion.section className="card risk__region" variants={item}>
          <h2 className="h3" style={{ fontSize: 17 }}>
            What DermAI looked at
          </h2>
          <div className="risk__pair">
            <RegionPhoto src={record.photoUrl} regions={record.regions} showRegions alt="Photo with candidate region outlined" />
            <RoiThumb record={record} />
          </div>
          <p className="small">
            Candidate region {region.id} was found automatically, then cropped (ROI) and passed to the few-shot learning model.
            You never need to draw or select anything yourself.
          </p>
        </motion.section>

        <motion.section className="card risk__how" variants={item}>
          <h2 className="h3" style={{ fontSize: 17 }}>
            How to read this
          </h2>
          <ul className="risk__list">
            <li>It describes what the model observed in one photo, not what a condition is.</li>
            <li>A highlighted region is a candidate for a closer look, not a confirmed risk.</li>
            <li>Lighting, angle and image quality can change what the model sees.</li>
            <li>Trends across several photos tell you more than any single result.</li>
          </ul>
        </motion.section>

        <motion.div variants={item}>
          <Notice icon={Info}>
            If a spot is changing, growing, bleeding or painful, or you are worried about it, please talk to a dermatologist or doctor.
            DermAI cannot diagnose or rule out any condition.
          </Notice>
        </motion.div>

        <motion.div variants={item}>
          <Button onClick={nav.back}>Done</Button>
        </motion.div>
      </motion.div>
    </Screen>
  )
}
