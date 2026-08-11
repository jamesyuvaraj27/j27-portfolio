import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

// Counts up from 0 to `value` once it scrolls into view. Pass suffix="%" or prefix="$" as needed.
const Counter = ({ value, prefix = "", suffix = "", duration = 1.6, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  const displayRef = useRef(null);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (displayRef.current) {
          displayRef.current.textContent = `${prefix}${Math.round(latest)}${suffix}`;
        }
      }),
    [springValue, prefix, suffix]
  );

  return (
    <span ref={ref} className={className}>
      <span ref={displayRef}>{prefix}0{suffix}</span>
    </span>
  );
};

export default Counter;
