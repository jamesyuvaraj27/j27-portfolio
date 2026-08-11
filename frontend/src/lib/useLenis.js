import { useEffect } from "react";
import Lenis from "lenis";

// Smooth-scroll for the public site only. Deliberately NOT mounted globally
// (App-level) because it hijacks native document scroll, which fights with
// scrollable panels/modals inside the admin dashboard.
export function useLenis() {
  useEffect(() => {
    // Respect users who've asked their OS/browser for reduced motion.
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
