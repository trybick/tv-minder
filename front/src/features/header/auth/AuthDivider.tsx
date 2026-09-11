import type { ReactNode } from 'react';

import { InlineTextSeparator } from '~/components/InlineTextSeparator';

type Props = {
  children: ReactNode;
};

export const AuthDivider = ({ children }: Props) => {
  return (
    <InlineTextSeparator
      alignItems="center"
      color="fg.subtle"
      fontSize="sm"
      my="6"
      textAlign="center"
      whiteSpace="nowrap"
    >
      {children}
    </InlineTextSeparator>
  );
};
