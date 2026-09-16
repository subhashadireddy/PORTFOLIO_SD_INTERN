import { useEffect } from 'react';
import { prefersReducedMotion } from '../utils/animations';

/**
 * Custom hook to smoothly reveal elements as they enter the viewport.
 * Observes elements with `.reveal-on-scroll`, `.reveal-slide-left`, and `.reveal-slide-right`.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (prefersReducedMotion()) {
      document.querySelectorAll('.reveal-on-scroll, .reveal-slide-left, .reveal-slide-right').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          // Once revealed, unobserve to keep performance high
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const observeElements = () => {
      const targets = document.querySelectorAll(
        '.reveal-on-scroll:not(.is-revealed), .reveal-slide-left:not(.is-revealed), .reveal-slide-right:not(.is-revealed)'
      );
      targets.forEach((target) => observer.observe(target));
    };

    // Initial pass
    observeElements();

    // Listen for DOM additions via MutationObserver to support dynamically rendered items (tabs, filters)
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
