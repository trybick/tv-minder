import { RefObject, useRef } from 'react';

export function useDebouncedFunction(func: (...args: any) => void, delay = 300) {
  const ref: RefObject<number | undefined> = useRef(undefined);

  return (...args: any) => {
    window.clearTimeout(ref.current);
    ref.current = window.setTimeout(() => func(...args), delay);
  };
}
