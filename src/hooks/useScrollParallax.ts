import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export function useScrollParallax<T extends HTMLElement = HTMLDivElement>() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<T>(null);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    let isIntersecting = false;
    let ticking = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
      },
      { rootMargin: '25% 0px 25% 0px' },
    );

    observer.observe(el);

    const update = () => {
      if (isIntersecting && el) {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // Progress from -1 (entering bottom) to 1 (leaving top), 0 when vertically centered
        const progress = Math.max(-1.5, Math.min(1.5, (vh / 2 - (rect.top + rect.height / 2)) / (vh / 2)));
        el.style.setProperty('--parallax-progress', progress.toFixed(4));
        el.style.setProperty('--parallax-slow', `${(progress * 25).toFixed(1)}px`);
        el.style.setProperty('--parallax-mid', `${(progress * 50).toFixed(1)}px`);
        el.style.setProperty('--parallax-fast', `${(progress * 85).toFixed(1)}px`);
        el.style.setProperty('--parallax-reverse', `${(-progress * 30).toFixed(1)}px`);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking && isIntersecting) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [reduced]);

  return ref;
}
