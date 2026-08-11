import { useEffect, useState } from "react";

// Responsive column count for JS-driven masonry (can't use CSS `columns-N`
// for this since each column needs its own independent parallax transform).
export function useColumnCount({ base = 2, sm = 3, lg = 4 } = {}) {
  const [count, setCount] = useState(() => {
    if (typeof window === "undefined") return base;
    if (window.innerWidth >= 1024) return lg;
    if (window.innerWidth >= 640) return sm;
    return base;
  });

  useEffect(() => {
    const compute = () => {
      if (window.innerWidth >= 1024) setCount(lg);
      else if (window.innerWidth >= 640) setCount(sm);
      else setCount(base);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [base, sm, lg]);

  return count;
}
