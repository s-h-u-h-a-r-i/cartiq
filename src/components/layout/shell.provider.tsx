import {
  createContext,
  createSignal,
  onCleanup,
  onMount,
  useContext,
  type Accessor,
  type ParentComponent,
} from 'solid-js';

const MOBILE_QUERY = '(max-width: 680px)';
const PANEL_HIDDEN_QUERY = '(max-width: 960px)';
const DESKTOP_QUERY = '(min-width: 961px)';

interface ShellStore {
  isMobile: Accessor<boolean>;
  isPanelHidden: Accessor<boolean>;
  isDesktop: Accessor<boolean>;
  canShowDesktopSidebar: Accessor<boolean>;
  canShowSidePanel: Accessor<boolean>;
}

const ShellContext = createContext<ShellStore>();

export const ShellProvider: ParentComponent = (props) => {
  const isMobile = createMediaQuery(MOBILE_QUERY);
  const isPanelHidden = createMediaQuery(PANEL_HIDDEN_QUERY);
  const isDesktop = createMediaQuery(DESKTOP_QUERY);

  const store: ShellStore = {
    isMobile,
    isPanelHidden,
    isDesktop,
    canShowDesktopSidebar: () => !isMobile(),
    canShowSidePanel: () => !isPanelHidden(),
  };

  return <ShellContext.Provider value={store}>{props.children}</ShellContext.Provider>;
};

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) {
    throw new Error(`${useShell.name} must be used withing a ${ShellProvider.name}`);
  }
  return ctx;
}

function createMediaQuery(query: string) {
  const [matches, setMatches] = createSignal(false);

  onMount(() => {
    const mediaQuery = window.matchMedia(query);
    const syncMatches = () => setMatches(mediaQuery.matches);

    syncMatches();
    mediaQuery.addEventListener('change', syncMatches);

    onCleanup(() => mediaQuery.removeEventListener('change', syncMatches));
  });

  return matches;
}
