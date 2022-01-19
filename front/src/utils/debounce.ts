import { MutableRefObject, useRef } from 'react';

export function useDebouncedFunction(func: (...args: any) => void, delay = 300) {
  const ref: MutableRefObject<number | undefined> = useRef(undefined);

  return (...args: any) => {
    window.clearTimeout(ref.current);
    ref.current = window.setTimeout(() => func(...args), delay);
  };
}
