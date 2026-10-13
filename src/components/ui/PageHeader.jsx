import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function PageHeader({ title, back, right }) {
  const navigate = useNavigate();
  return (
    <header className="pageheader">
      {back && (
        <motion.button
          type="button"
          className="iconbtn"
          aria-label="Go back"
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(back)}
        >
          <ArrowLeft size={18} strokeWidth={2.2} />
        </motion.button>
      )}
      <div className="pageheader__row">
        <h1>{title}</h1>
        {right}
      </div>
    </header>
  );
}
