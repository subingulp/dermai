import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import ScanIllustration from '../components/ui/ScanIllustration';
import { useApp } from '../context/AppContext';
import { riseIn, staggerParent } from '../animations';
import PageTransition from '../components/layout/PageTransition';

export default function Welcome() {
  const navigate = useNavigate();
  const { enterAsGuest, tutorialSeen } = useApp();

  const continueAsGuest = () => {
    enterAsGuest();
    navigate(tutorialSeen ? '/app/main' : '/tutorial');
  };

  return (
    <PageTransition className="screen welcome">
      <motion.div className="welcome__body" variants={staggerParent} initial="hidden" animate="show">
        <motion.div className="welcome__brand" variants={riseIn}>
          <h1>DermAI</h1>
          <p>Your skin, understood over time.</p>
        </motion.div>

        <motion.div variants={riseIn}>
          <ScanIllustration variant="snap" />
        </motion.div>

        <motion.p className="welcome__desc" variants={riseIn}>
          Take a photo and let AI help you understand how your skin changes over time.
        </motion.p>

        <motion.div className="welcome__actions" variants={riseIn}>
          <Button variant="primary" onClick={continueAsGuest}>
            Continue as Guest
          </Button>
          <Button variant="text" onClick={() => navigate('/tutorial')}>
            How DermAI works →
          </Button>
          <small>A little clarity. One photo at a time.</small>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
