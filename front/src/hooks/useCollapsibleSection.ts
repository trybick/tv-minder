import { type RefObject, useEffect, useRef, useState } from 'react';

type Options = {
  collapsedHeight: number | ((element: HTMLElement) => number);
  isActive?: boolean;
  showToggle?: boolean | 'overflow';
  deps?: unknown[];
};

type Result = {
  contentRef: RefObject<HTMLDivElement | null>;
  expanded: boolean;
  toggleExpanded: () => void;
  contentHeight: number;
  collapsedHeight: number;
  isCollapsible: boolean;
  maxHeight: string | undefined;
  transition: string | undefined;
};

export const useCollapsibleSection = ({
  collapsedHeight: collapsedHeightOption,
  isActive = true,
  showToggle = 'overflow',
  deps = [],
}: Options): Result => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [collapsedHeight, setCollapsedHeight] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setContentHeight(0);
      setCollapsedHeight(0);
      return;
    }

    const contentElement = contentRef.current;
    if (!contentElement) {
      return;
    }

    const measure = () => {
      const nextContentHeight = contentElement.scrollHeight;
      setContentHeight(nextContentHeight);

      const nextCollapsedHeight =
        typeof collapsedHeightOption === 'number'
          ? collapsedHeightOption
          : collapsedHeightOption(contentElement);

      setCollapsedHeight(nextCollapsedHeight);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(contentElement);
    measure();

    return () => observer.disconnect();
  }, [collapsedHeightOption, isActive, ...deps]);

  const isOverflowing = contentHeight > collapsedHeight + 1;
  const isCollapsible =
    isActive &&
    (showToggle === 'overflow' ? isOverflowing : !!showToggle);

  return {
    contentRef,
    expanded,
    toggleExpanded: () => setExpanded(prev => !prev),
    contentHeight,
    collapsedHeight,
    isCollapsible,
    maxHeight:
      isCollapsible && collapsedHeight
        ? `${expanded ? contentHeight : collapsedHeight}px`
        : undefined,
    transition: isCollapsible ? 'max-height 0.24s ease' : undefined,
  };
};
