import { useState, useEffect, useRef, type RefObject } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Once true, stays true — element never "un-observes". Default: true */
  freezeOnceVisible?: boolean;
}

/**
 * useIntersectionObserver
 *
 * Returns [ref, isVisible].
 * Attach `ref` to the element you want to observe.
 * `isVisible` becomes true once the element enters the viewport and (by default) stays true.
 *
 * Usage:
 *   const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
 *   return <div ref={ref}>{isVisible && <HeavyComponent />}</div>;
 */
export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T | null>, boolean] {
  const {
    threshold = 0,
    root = null,
    rootMargin = '200px', // pre-load 200px before element enters viewport
    freezeOnceVisible = true,
  } = options;

  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If already visible and frozen, skip re-observing
    if (freezeOnceVisible && isVisible) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: make everything visible if IO not supported
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (freezeOnceVisible) {
            observer.disconnect();
          }
        } else if (!freezeOnceVisible) {
          setIsVisible(false);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin, freezeOnceVisible, isVisible]);

  return [ref, isVisible];
}
