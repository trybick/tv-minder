import { Tabs } from '@chakra-ui/react';

import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';

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
  const { isMobile } = useResponsiveLayout();

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
