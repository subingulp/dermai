import { motion } from 'motion/react';
import CountUp from './CountUp';
import { riseIn } from '../../animations';

export default function MetricCard({ metric, value }) {
  const { label, Icon } = metric;
  return (
    <motion.div className="metric" variants={riseIn}>
      <div className="metric__head">
        <span>{label}</span>
        <Icon size={16} strokeWidth={2} aria-hidden="true" />
      </div>
      <p className="metric__value">
        <CountUp value={value} />
      </p>
      <div className="metric__track" aria-hidden="true">
        <motion.div
          className="metric__fill"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </motion.div>
  );
}
