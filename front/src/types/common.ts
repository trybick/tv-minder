export type PlainFunction = () => void;

export type DisclosureProps = {
  isOpen: boolean;
  onOpen: PlainFunction;
  onClose: PlainFunction;
};

export type ID = number;
