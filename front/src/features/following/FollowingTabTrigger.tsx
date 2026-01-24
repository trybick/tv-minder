import { Tabs } from '@chakra-ui/react';

import { useIsMobile } from '~/hooks/useIsMobile';

type TabTriggerProps = {
  value: string;
  label: string;
  isDisabled?: boolean;
};

export const FollowingTabTrigger = ({
  value,
  label,
  isDisabled,
}: TabTriggerProps) => {
  const isMobile = useIsMobile();

  return (
    <Tabs.Trigger
      disabled={isDisabled}
      value={value}
      fontSize={isMobile ? 'sm' : 'md'}
      minW={isMobile ? 'max-content' : undefined}
      flexShrink={isMobile ? 0 : 1}
      px={isMobile ? 2 : 5}
    >
      {label}
    </Tabs.Trigger>
  );
};
