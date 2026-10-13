import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Disclaimer from '../components/ui/Disclaimer';
import ScanIllustration from '../components/ui/ScanIllustration';
import PageTransition from '../components/layout/PageTransition';
import { useApp } from '../context/AppContext';
import { EASE } from '../animations';

const SLIDES = [
  {
    variant: 'snap',
    title: 'Take a skin photo',
    text: "Simply take or upload a photo of your skin. You don't need to manually record your skin condition.",
  },
  {
    variant: 'measure',
    title: 'AI analyzes your skin',
    text: 'DermAI automatically analyzes your photo and creates measurable skin-condition data.',
  },
  {
    variant: 'track',
    title: 'Track your changes',
    text: 'Your results are saved by date so you can see how your skin changes over days and months.',
  },
  {
    variant: 'roi',
    title: 'AI Risk Assessment',
    text: 'DermAI can automatically detect suspicious-looking regions and analyze them using a Few-shot Learning model.',
    note: true,
  },
];

const slide = {
  enter: (dir) => ({ opacity: 0, x: dir * 48 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.32, ease: EASE } },
  exit: (dir) => ({ opacity: 0, x: dir * -48, transition: { duration: 0.18 } }),
};

export default function Tutorial() {
  const navigate = useNavigate();
  const { finishTutorial } = useApp();
  const [[index, dir], setPage] = useState([0, 1]);
  const last = index === SLIDES.length - 1;
  const current = SLIDES[index];

  const go = useCallback((next) => {
    setPage(([i]) => (next < 0 || next >= SLIDES.length ? [i, 1] : [next, next > i ? 1 : -1]));
  }, []);

  const finish = useCallback(() => {
    finishTutorial();
    navigate('/app/main');
  }, [finishTutorial, navigate]);

  const next = useCallback(() => (last ? finish() : go(index + 1)), [last, finish, go, index]);

  // Arrow keys work too.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, go, index]);

  return (
    <PageTransition className="screen tutorial">
      <header className="tutorial__top">
        <span className="brand">DermAI</span>
        <Badge>
          {String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </Badge>
      </header>

      <div className="tutorial__stage">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={index}
            className="tutorial__slide"
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) next();
              else if (info.offset.x > 60) go(index - 1);
            }}
          >
            <ScanIllustration variant={current.variant} />
            <div className="tutorial__copy">
              <p className="eyebrow">MEET YOUR SKIN COMPANION</p>
              <h1>{current.title}</h1>
              <p>{current.text}</p>
              {current.note && <Disclaimer />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="tutorial__nav">
        <div className="dots" role="tablist" aria-label="Tutorial progress">
          {SLIDES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to step ${i + 1}: ${s.title}`}
              className={`dots__dot${i === index ? ' is-active' : ''}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <Button variant="primary" className="btn--auto" onClick={next}>
          {last ? 'Get Started →' : 'Next →'}
        </Button>
      </footer>
    </PageTransition>
  );
}
