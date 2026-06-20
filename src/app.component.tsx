import { type Component } from 'solid-js';

import { AuthProvider, useAuth } from './auth';
import { AppBackdropProvider } from './layout/app-backdrop';
import { AppShell } from './layout/app-shell';
import { ProfileProvider } from './profile';

const App: Component = () => (
  // TODO: Use Error and suspense boundary
  <AppBackdropProvider>
    <AuthProvider>
      <ProfileProvider>
        <AppContent />
      </ProfileProvider>
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
