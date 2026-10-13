import { motion } from 'motion/react';
import { fmtRelative } from '../../utils/dates';
import { riseIn } from '../../animations';

/** "Last analyzed" card: thumbnail, time and a details link. */
export default function PhotoCard({ record, onOpen }) {
  return (
    <motion.button type="button" className="photocard" variants={riseIn} whileTap={{ scale: 0.985 }} onClick={onOpen}>
      <img src={record.imageUrl} alt="Your latest skin photo" draggable="false" />
      <span className="photocard__text">
        <strong>Last analyzed</strong>
        <span>{fmtRelative(record.date, record.time)}</span>
        <em>View Details →</em>
      </span>
    </motion.button>
  );
}
