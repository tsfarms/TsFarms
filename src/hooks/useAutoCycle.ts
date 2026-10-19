import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function useAutoCycle(count: number, intervalMs: number, enabled = true) {
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();
  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    if (reduced || count < 2) return;

    const id = window.setInterval(() => {
      if (!enabledRef.current || document.visibilityState !== 'visible') return;
      setActive((current) => (current + 1) % count);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [count, intervalMs, reduced]);

  const safeActive = count < 1 ? 0 : active % count;
  return [safeActive, setActive] as const;
}
