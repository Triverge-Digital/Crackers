'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Height pinned above `el`: the site header, plus the sticky toolbar when `el` scrolls underneath it. */
function topOffset(el: HTMLElement) {
  const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 96;
  const toolbar = document.querySelector<HTMLElement>('[data-sticky-toolbar]');
  const underToolbar = toolbar?.parentElement?.contains(el) && !toolbar.contains(el);
  return header + (underToolbar ? toolbar!.getBoundingClientRect().height : 0) + 12;
}

export function scrollToId(id: string, behavior: ScrollBehavior = 'smooth') {
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY - topOffset(el);
  window.scrollTo({ top, behavior });
  return true;
}

/** After navigation, scroll to the #hash target below the sticky header (Next handles scroll-to-top). */
export default function ScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.slice(1);
      // Sections render after route transition; retry briefly until the target exists.
      let attempts = 0;
      const tick = () => {
        if (scrollToId(id) || attempts++ > 20) return;
        window.setTimeout(tick, 50);
      };
      tick();
    }
  }, [pathname]);

  return null;
}
