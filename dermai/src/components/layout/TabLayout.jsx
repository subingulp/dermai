import { AnimatePresence } from 'motion/react';
import { useLocation, useOutlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import PageTransition from './PageTransition';

/** Main / Data / Me share one layout so the bottom navigation stays put while tabs cross-fade. */
export default function TabLayout() {
  const location = useLocation();
  // useOutlet() gives a fixed snapshot, so the leaving tab keeps its own content while it fades out.
  const outlet = useOutlet();
  return (
    <div className="screen screen--tabs">
      <div className="tabs__body">
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname} className="tabs__page">
            {outlet}
          </PageTransition>
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
}
