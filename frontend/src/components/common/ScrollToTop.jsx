import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 * Ensures that on any route navigation, page load, or browser reload,
 * the window and body scroll positions reset precisely to the top (0, 0).
 */
const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Prevent browser auto-scroll restoration on page reload
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const forceScrollTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // If there is an explicit hash targeting an element ID, scroll to it smoothly
    if (hash) {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Reset scroll immediately
    forceScrollTop();

    // Secondary micro-resets to handle Framer Motion animations & dynamic content layout shifts
    const rafId = requestAnimationFrame(forceScrollTop);
    const timer1 = setTimeout(forceScrollTop, 50);
    const timer2 = setTimeout(forceScrollTop, 150);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
