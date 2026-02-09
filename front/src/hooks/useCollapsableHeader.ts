import { type RefObject, useEffect, useState } from 'react';

import { applyViewTransition } from '~/utils/viewTransition';

export function useCollapsibleHeader(ref: RefObject<HTMLDivElement | null>) {
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);

  const toggleHeader = () => {
    applyViewTransition(() => {
      setIsHeaderOpen(prev => !prev);
    });
  };

  const closeHeader = () => {
    applyViewTransition(() => {
      setIsHeaderOpen(false);
    });
  };

  useEffect(() => {
    function closeHeaderOnOutsideClick(event: Event) {
      const isClickOutside =
        ref.current && !ref.current.contains(event.target as Node);
      if (isClickOutside && isHeaderOpen) {
        closeHeader();
      }
    }
    document.addEventListener('mousedown', closeHeaderOnOutsideClick);
    return () => {
      document.removeEventListener('mousedown', closeHeaderOnOutsideClick);
    };
  }, [isHeaderOpen, ref]);

  return { isHeaderOpen, closeHeader, toggleHeader };
}
