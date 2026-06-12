import type { Component } from 'solid-js';

import { AppShell } from './components/layout';
import { AuthProvider } from './features/auth';
import { ProfileProvider } from './features/profile';

const App: Component = () => {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AppShell />
      </ProfileProvider>
    </AuthProvider>
  );
};

export default App;
