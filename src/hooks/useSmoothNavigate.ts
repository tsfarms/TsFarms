export const NAVIGATE_EVENT = 'ts:navigate';

export function useSmoothNavigate() {
  return (target: string) => {
    window.dispatchEvent(new CustomEvent<string>(NAVIGATE_EVENT, { detail: target }));
    if (target === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(target);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
}
