import { useCallback, useEffect } from 'react';
import { PlainFunction } from '~/types/common';

// Closing on 'Esc' is supported by Chakra UI however there seems to be issues with it on Mac
// (Windows seems to work). This hook was created to make sure the Esc works to close the modal.
export const useCloseModalOnPressEscape = ({
  onClose,
}: {
  onClose: PlainFunction;
}) => {
  const handleClickEsc = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleClickEsc, false);
    return () => {
      document.removeEventListener('keydown', handleClickEsc, false);
    };
  }, [handleClickEsc]);
};
