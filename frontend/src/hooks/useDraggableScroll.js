import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * Enhanced smooth draggable scroll hook with momentum physics, touch swipe optimization,
 * drag-click protection, and smooth scrolling controls.
 */
export function useDraggableScroll() {
  const ref = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const velX = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const animFrame = useRef(null);

  const checkScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [checkScroll]);

  // Momentum physics decay loop for ultra-smooth release
  const applyMomentum = () => {
    const el = ref.current;
    if (!el) return;

    if (Math.abs(velX.current) > 0.4) {
      el.scrollLeft += velX.current;
      velX.current *= 0.92; // Smooth friction
      animFrame.current = requestAnimationFrame(applyMomentum);
    } else {
      velX.current = 0;
      setTimeout(() => setIsDragging(false), 50);
    }
  };

  const onMouseDown = (e) => {
    const el = ref.current;
    if (!el) return;
    if (animFrame.current) cancelAnimationFrame(animFrame.current);

    setIsMouseDown(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);

    lastX.current = e.pageX;
    lastTime.current = performance.now();
    velX.current = 0;
  };

  const onMouseLeave = () => {
    if (isMouseDown) {
      setIsMouseDown(false);
      applyMomentum();
    }
  };

  const onMouseUp = () => {
    if (isMouseDown) {
      setIsMouseDown(false);
      applyMomentum();
    }
  };

  const onMouseMove = (e) => {
    if (!isMouseDown) return;
    const el = ref.current;
    if (!el) return;

    const x = e.pageX - el.offsetLeft;
    const walk = x - startX;

    if (Math.abs(walk) > 4) {
      setIsDragging(true);
    }

    const now = performance.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      const dx = e.pageX - lastX.current;
      velX.current = -dx * 0.85;
    }
    lastX.current = e.pageX;
    lastTime.current = now;

    el.scrollLeft = scrollLeftState - walk * 1.25;
  };

  const scrollByAmount = (amount) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const scrollLeft = () => scrollByAmount(-260);
  const scrollRight = () => scrollByAmount(260);

  return {
    ref,
    isDragging,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
    dragProps: {
      onMouseDown,
      onMouseLeave,
      onMouseUp,
      onMouseMove,
    },
  };
}
