import { useEffect } from 'react';
import { SITE_NAME, SITE_URL } from '../../constants';

type Props = { title?: string; description?: string; path?: string };

/** Per-route document title, description and canonical URL for a client-rendered SPA. */
export default function Seo({ title, description, path }: Props) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} Sivakasi | 2026 Price List – Flat 80% Off, Direct Delivery`;
    document.title = fullTitle;

    const setMeta = (selector: string, attr: string, value: string) => {
      const el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
      if (el) el.setAttribute(attr, value);
    };
    if (description) {
      setMeta('meta[name="description"]', 'content', description);
      setMeta('meta[property="og:description"]', 'content', description);
    }
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    const url = `${SITE_URL}${path ?? window.location.pathname}`;
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[property="og:url"]', 'content', url);
  }, [title, description, path]);

  return null;
}
