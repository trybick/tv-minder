import { Box, Flex, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { type DiscoverCarouselKey } from '~/store/tv/actions';

import { type CarouselConfig } from './DiscoverShows';

type Props = {
  items: CarouselConfig[];
};

/** Gap between scrolled-to section and top of page */
const SCROLL_OFFSET = 70;

export const DiscoverNav = ({ items }: Props) => {
  const firstKey = items[0]?.key ?? 'trending';
  const [activeKey, setActiveKey] = useState<DiscoverCarouselKey>(firstKey);

  const navRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Map<DiscoverCarouselKey, HTMLButtonElement>>(
    new Map()
  );

  // Prevents unwanted intermediate updates during the scroll animation
  const isClickScrolling = useRef(false);

  const scrollPillIntoView = useCallback((key: DiscoverCarouselKey) => {
    const pill = pillRefs.current.get(key);
    if (pill && navRef.current) {
      const nav = navRef.current;
      const pillLeft = pill.offsetLeft;
      const pillWidth = pill.offsetWidth;
      const navWidth = nav.offsetWidth;
      // Calculate scroll position to center the pill in the nav container
      const scrollLeft = pillLeft - navWidth / 2 + pillWidth / 2;
      nav.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, []);

  // Set up Intersection Observers to detect which carousel section is visible
  // This automatically updates the active pill as the user scrolls through the page
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const item of items) {
      const el = document.getElementById(`discover-${item.key}`);
      if (!el) {
        continue;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isClickScrolling.current) {
            setActiveKey(item.key);
            scrollPillIntoView(item.key);
          }
        },
        { rootMargin: '-20% 0px -60% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    }

    return () => observers.forEach(o => o.disconnect());
  }, [items, scrollPillIntoView]);

  const handleClick = (key: DiscoverCarouselKey) => {
    const el = document.getElementById(`discover-${key}`);
    if (!el) {
      return;
    }

    setActiveKey(key);
    scrollPillIntoView(key);
    isClickScrolling.current = true;

    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });

    // Re-enable Intersection Observer after scroll animation completes (~800ms)
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  };

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="10"
      bg={activeKey === firstKey ? 'bg/70' : 'bg/100'}
      mx={-3}
      px={3}
      py={3}
      mb={7}
      borderRadius="full"
    >
      <Flex
        ref={navRef}
        gap={1.5}
        overflowX="auto"
        css={{
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {items.map(item => {
          const isActive = item.key === activeKey;
          return (
            <Box
              key={item.key}
              as="button"
              ref={(el: HTMLButtonElement | null) => {
                if (el) {
                  pillRefs.current.set(item.key, el);
                }
              }}
              onClick={() => handleClick(item.key)}
              flexShrink={0}
              display="flex"
              alignItems="center"
              gap={1.5}
              px={3}
              py={1.5}
              borderRadius="full"
              fontSize="sm"
              fontWeight="medium"
              cursor="pointer"
              transition="all 0.2s"
              bg={isActive ? 'cyan.500/20' : 'whiteAlpha.50'}
              color={isActive ? 'cyan.300' : 'fg.muted'}
              borderWidth="1px"
              borderColor={isActive ? 'cyan.500/30' : 'transparent'}
              _hover={{
                bg: isActive ? 'cyan.500/25' : 'whiteAlpha.100',
                color: isActive ? 'cyan.300' : 'fg',
              }}
            >
              <Box fontSize="xs">{item.icon}</Box>
              <Text whiteSpace="nowrap">{item.title}</Text>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
};
