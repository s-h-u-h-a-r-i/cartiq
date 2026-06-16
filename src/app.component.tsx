import { type Component } from 'solid-js';

import { AuthProvider, useAuth } from './auth';
import { AppBackdropProvider, AppShell } from './layout';

const App: Component = () => (
  <AppBackdropProvider>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </AppBackdropProvider>
);

export default App;

const AppContent: Component = () => {
  const auth = useAuth();

  return (
    <AppShell title='Lists' leftSidebar={null} rightSidebar={null}>
      {null}
    </AppShell>
  );
};
