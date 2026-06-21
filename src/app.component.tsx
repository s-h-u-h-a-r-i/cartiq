import { type Component } from 'solid-js';

import { AppBackdropProvider } from './layout/app-backdrop';
import { AppShell } from './layout/app-shell';
import { AppSessionProvider } from './session';

const App: Component = () => (
  // TODO: Use Error and suspense boundary
  <AppBackdropProvider>
    <AppSessionProvider>
      <AppContent />
    </AppSessionProvider>
  </AppBackdropProvider>
);

export default App;

const AppContent: Component = () => {
  return (
    <AppShell title='Lists' leftSidebar={null} rightSidebar={null}>
      {null}
    </AppShell>
  );
};
