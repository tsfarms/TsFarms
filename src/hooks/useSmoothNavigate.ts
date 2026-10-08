import { useLocation, useNavigate } from 'react-router-dom';

export const NAVIGATE_EVENT = 'ts:navigate';
export const ORDER_FILTER_EVENT = 'ts:order-filter';

export type NavigateOptions = {
  filter?: string;
};

export function dispatchOrderFilter(filter: string) {
  window.dispatchEvent(new CustomEvent<string>(ORDER_FILTER_EVENT, { detail: filter }));
}

export function scrollToTarget(target: string) {
  if (target === 'hero') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function useSmoothNavigate() {
  const navigate = useNavigate();
  const location = useLocation();

  return (target: string, options?: NavigateOptions) => {
    if (target.startsWith('/')) {
      navigate(target);
      return;
    }

    const apply = () => {
      if (options?.filter) dispatchOrderFilter(options.filter);
      window.dispatchEvent(new CustomEvent<string>(NAVIGATE_EVENT, { detail: target }));
      scrollToTarget(target);
    };

    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: target, filter: options?.filter } });
      return;
    }

    apply();
  };
}
