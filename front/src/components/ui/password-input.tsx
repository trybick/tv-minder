'use client';

import type { ButtonProps, GroupProps, InputProps } from '@chakra-ui/react';
import {
  IconButton,
  Input,
  InputGroup,
  mergeRefs,
  useControllableState,
} from '@chakra-ui/react';
import * as React from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';

export interface PasswordVisibilityProps {
  defaultVisible?: boolean;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  visibilityIcon?: { on: React.ReactNode; off: React.ReactNode };
}

export interface PasswordInputProps
  extends InputProps, PasswordVisibilityProps {
  rootProps?: GroupProps;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(function PasswordInput(props, ref) {
  const {
    rootProps,
    defaultVisible,
    visible: visibleProp,
    onVisibleChange,
    visibilityIcon = {
      on: <LuEye />,
      off: <LuEyeOff />,
    },
    ...rest
  } = props;

  const [visible, setVisible] = useControllableState({
    value: visibleProp,
    defaultValue: defaultVisible || false,
    onChange: onVisibleChange,
  });

  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <InputGroup
      endElement={
        <VisibilityTrigger
          disabled={rest.disabled}
          onPointerDown={e => {
            if (rest.disabled) {
              return;
            }
            if (e.button !== 0) {
              return;
            }
            e.preventDefault();
            setVisible(!visible);
          }}
        >
          {visible ? visibilityIcon.off : visibilityIcon.on}
        </VisibilityTrigger>
      }
      {...rootProps}
    >
      <Input
        {...rest}
        ref={mergeRefs(ref, inputRef)}
        type={visible ? 'text' : 'password'}
      />
    </InputGroup>
  );
});

const VisibilityTrigger = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function VisibilityTrigger(props, ref) {
    return (
      <IconButton
        aria-label="Toggle password visibility"
        aspectRatio="square"
        height="calc(100% - {spacing.2})"
        me="-2"
        ref={ref}
        size="sm"
        tabIndex={-1}
        variant="ghost"
        {...props}
      />
    );
  }
);
