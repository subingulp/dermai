import { useEffect, useRef, useState } from 'react';
import { animate } from 'motion/react';
import { useReduceMotion } from '../../context/AppContext';

/** Counts from the previous value to `value`. Skips the animation when motion is reduced. */
export default function CountUp({ value, duration = 0.9, delay = 0, suffix = '%' }) {
  const reduce = useReduceMotion();
  const [shown, setShown] = useState(reduce ? value : 0);
  const last = useRef(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      last.current = value;
      setShown(value);
      return undefined;
    }
    const controls = animate(last.current, value, {
      duration,
      delay,
      ease: 'easeOut',
      onUpdate: (v) => {
        last.current = v;
        setShown(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, reduce, duration, delay]);

  return (
    <>
      {shown}
      {suffix}
    </>
  );
}
