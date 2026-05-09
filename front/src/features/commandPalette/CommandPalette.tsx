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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        trackEvent({
          category: 'Command Palette',
          action: 'Opened via Keyboard Shortcut',
        });
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () =>
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, []);

  return (
    <CommandPaletteContext.Provider value={contextValue}>
      {children}
      <CommandPaletteDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </CommandPaletteContext.Provider>
  );
};
