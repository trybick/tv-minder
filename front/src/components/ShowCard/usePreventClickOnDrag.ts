import { type MouseEvent, type PointerEvent, useRef } from 'react';

const DRAG_THRESHOLD = 8;

export const usePreventClickOnDrag = () => {
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0) {
      return;
    }
    pointerStart.current = { x: event.clientX, y: event.clientY };
    dragged.current = false;
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!pointerStart.current) {
      return;
    }
    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;
    if (Math.hypot(dx, dy) >= DRAG_THRESHOLD) {
      dragged.current = true;
    }
  };

  const onPointerUp = () => {
    pointerStart.current = null;
  };

  const shouldCancelClick = (event: MouseEvent<HTMLElement>) => {
    if (!dragged.current) {
      return false;
    }
    event.preventDefault();
    event.stopPropagation();
    dragged.current = false;
    return true;
  };

  return {
    dragListeners: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
    shouldCancelClick,
  };
};
