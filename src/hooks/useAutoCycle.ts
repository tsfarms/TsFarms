import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function useAutoCycle(count: number, intervalMs: number, enabled = true) {
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    setActive((current) => (count < 1 ? 0 : current % count));
  }, [count]);

  useEffect(() => {
    if (reduced || count < 2) return;

    const id = window.setInterval(() => {
      if (!enabledRef.current || document.visibilityState !== 'visible') return;
      setActive((current) => (current + 1) % count);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [count, intervalMs, reduced]);

  return [active, setActive] as const;
}
