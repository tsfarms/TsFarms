import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Tracks a container's scroll progress (0..1) using a single rAF-throttled
 * scroll listener that writes to a ref. A state mirror is also kept so the
 * component can re-render when progress crosses thresholds, but the hot path
 * (every scroll frame) only touches the ref + CSS variables — no React render.
 *
 * Returns [ref, progress] where progress is the 0..1 value (state, for
 * threshold-based renders) and ref.current also carries a `.progress` number.
 */
export function useScrollProgress<T extends HTMLElement>(): [RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const lastProgressRef = useRef(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      rafRef.current = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the section's top hits the top of the viewport,
      // 1 when the section's bottom leaves the bottom of the viewport.
      const total = rect.height - vh;
      if (total <= 0) {
        if (lastProgressRef.current !== 0) {
          lastProgressRef.current = 0;
          setProgress(0);
        }
        return;
      }
      const scrolled = Math.max(0, -rect.top);
      const p = Math.min(1, Math.max(0, scrolled / total));
      (el as HTMLElement & { progress?: number }).progress = p;

      // Only trigger a React render when progress changes by >0.5%
      const rounded = Math.round(p * 200) / 200;
      if (rounded !== lastProgressRef.current) {
        lastProgressRef.current = rounded;
        setProgress(rounded);
      }
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return [ref, progress];
}
