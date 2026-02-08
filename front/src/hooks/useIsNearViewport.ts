import { useEffect, useRef, useState } from 'react';

const ROOT_MARGIN = '400px';

export const useIsNearViewport = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: ROOT_MARGIN }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isNear };
};
