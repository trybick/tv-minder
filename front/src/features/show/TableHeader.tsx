import { Text, type TextProps } from '@chakra-ui/react';
import { type ReactNode } from 'react';

export const TableHeader = ({
  children,
  ...textProps
}: { children: ReactNode } & TextProps) => (
  <Text
    color="fg.muted"
    fontSize="xs"
    fontWeight="bold"
    textTransform="uppercase"
    {...textProps}
  >
    {children}
  </Text>
);
