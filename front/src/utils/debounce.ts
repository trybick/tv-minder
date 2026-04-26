import { type RefObject, useCallback, useRef } from 'react';

export const useDebouncedFunction = (
  func: (...args: any[]) => void,
  delay = 300
) => {
  const timerRef: RefObject<number | undefined> = useRef(undefined);
  const funcRef = useRef(func);
  funcRef.current = func;

  return useCallback(
    (...args: any[]) => {
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(
        () => funcRef.current(...args),
        delay
      );
    },
    [delay]
  );
};
