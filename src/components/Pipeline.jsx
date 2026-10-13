// "How AI Risk Assessment works": the five pipeline steps, shown on the
// results screen. This mirrors the planned FastAPI pipeline.

import { motion } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { RoiThumb } from './Cards'
import { item, stagger } from './motionPresets'

const STEPS = [
  { title: 'Skin Photo', text: 'Your original image is the input.' },
  { title: 'Automatic Region Detection', text: 'AI locates suspicious-looking candidate regions.' },
  { title: 'ROI Crop', text: 'Region A is cropped for a closer look.', roi: true },
  { title: 'Few-shot Learning Model', text: 'The cropped region is analyzed by the model.' },
  { title: 'AI Risk Assessment', text: 'An observational summary is generated.' },
]

export default function Pipeline({ record }) {
  return (
    <motion.ol className="pipeline" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
      {STEPS.map((s, i) => (
        <motion.li key={s.title} variants={item}>
          <div className="pipeline__step">
            <span className="pipeline__num">{String(i + 1).padStart(2, '0')}</span>
            <div className="pipeline__copy">
              <p className="pipeline__title">{s.title}</p>
              <p className="tiny">{s.text}</p>
            </div>
            {s.roi && <RoiThumb record={record} />}
          </div>
          {i < STEPS.length - 1 && <ArrowDown className="pipeline__arrow" size={14} aria-hidden="true" />}
        </motion.li>
      ))}
    </motion.ol>
  )
}
