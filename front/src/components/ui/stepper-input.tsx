import { HStack, IconButton, NumberInput } from '@chakra-ui/react';
import * as React from 'react';
import { LuMinus, LuPlus } from 'react-icons/lu';

export interface StepperInputProps extends NumberInput.RootProps {
  label?: React.ReactNode;
}

export const StepperInput = React.forwardRef<HTMLDivElement, StepperInputProps>(
  function StepperInput(props, ref) {
    const { label, ...rest } = props;
    return (
      <NumberInput.Root {...rest} ref={ref} unstyled>
        {label && <NumberInput.Label>{label}</NumberInput.Label>}
        <HStack gap="2">
          <DecrementTrigger />
          <NumberInput.ValueText fontSize="lg" minW="3ch" textAlign="center" />
          <IncrementTrigger />
        </HStack>
      </NumberInput.Root>
    );
  }
);

const DecrementTrigger = React.forwardRef<HTMLButtonElement, NumberInput.DecrementTriggerProps>(
  function DecrementTrigger(props, ref) {
    return (
      <NumberInput.DecrementTrigger {...props} ref={ref} asChild>
        <IconButton size="sm" variant="outline">
          <LuMinus />
        </IconButton>
      </NumberInput.DecrementTrigger>
    );
  }
);

const IncrementTrigger = React.forwardRef<HTMLButtonElement, NumberInput.IncrementTriggerProps>(
  function IncrementTrigger(props, ref) {
    return (
      <NumberInput.IncrementTrigger {...props} ref={ref} asChild>
        <IconButton size="sm" variant="outline">
          <LuPlus />
        </IconButton>
      </NumberInput.IncrementTrigger>
    );
  }
);
