import { Text, TextProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

const TableHeader = ({
  children,
  textProps,
}: {
  children: ReactNode;
  textProps?: TextProps;
}) => (
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

export default TableHeader;
