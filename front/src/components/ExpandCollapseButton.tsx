import { Button, Icon } from '@chakra-ui/react';
import { LuChevronDown } from 'react-icons/lu';

type Props = {
  expanded: boolean;
  onToggle: () => void;
  expandedLabel?: string;
  collapsedLabel: string;
};

export const ExpandCollapseButton = ({
  expanded,
  onToggle,
  expandedLabel = 'Show less',
  collapsedLabel,
}: Props) => {
  return (
    <Button
      variant="plain"
      size="sm"
      color="fg.muted"
      w="100%"
      mt={2}
      _hover={{ color: 'fg' }}
      onClick={onToggle}
    >
      {expanded ? expandedLabel : collapsedLabel}
      <Icon
        as={LuChevronDown}
        boxSize="16px"
        ml={1}
        transition="transform 0.2s ease"
        transform={expanded ? 'rotate(180deg)' : 'rotate(0deg)'}
      />
    </Button>
  );
};
