export type PlainFunction = () => void;

export type DisclosureProps = {
  isOpen: boolean;
  onOpen: PlainFunction;
  onClose: PlainFunction;
};

export type ID = number;

export type GenericStringObject = { [key: string]: any };
export type GenericNumberObject = { [key: number]: any };
