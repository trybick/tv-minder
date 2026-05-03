import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { trackEvent } from '~/utils/analytics';

import { CommandPaletteDialog } from './CommandPaletteDialog';

type CommandPaletteContextType = {
  openPalette: () => void;
};

const CommandPaletteContext = createContext<CommandPaletteContextType | null>(
  null
);

export const useCommandPalette = () => {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error(
      'useCommandPalette must be used within CommandPaletteProvider'
    );
  }
  return context;
};

type Props = {
  children: ReactNode;
};

export const CommandPaletteProvider = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const contextValue = useMemo(
    () => ({ openPalette: () => setIsOpen(true) }),
    []
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        trackEvent({
          category: 'Command Palette',
          action: 'Opened via Keyboard Shortcut',
        });
        setIsOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <CommandPaletteContext.Provider value={contextValue}>
      {children}
      <CommandPaletteDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </CommandPaletteContext.Provider>
  );
};
