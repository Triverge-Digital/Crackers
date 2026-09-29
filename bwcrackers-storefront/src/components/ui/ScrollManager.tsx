import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HEADER_OFFSET = 96;

export function scrollToId(id: string, behavior: ScrollBehavior = 'smooth') {
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top, behavior });
  return true;
}

/** Scroll to top on route change, or to the #hash target when one is present. */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      // Sections render after route transition; retry briefly until the target exists.
      let attempts = 0;
      const tick = () => {
        if (scrollToId(id) || attempts++ > 20) return;
        window.setTimeout(tick, 50);
      };
      tick();
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [pathname, hash]);

  return null;
}
