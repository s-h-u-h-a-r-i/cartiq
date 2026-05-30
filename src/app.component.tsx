import type { Component } from 'solid-js';

import { AuthProvider } from './features/auth';
import { ProfileProvider } from './features/profile';

const App: Component = () => {
  return (
    <AuthProvider>
      <ProfileProvider>
        <h1>Logged in</h1>
      </ProfileProvider>
    </AuthProvider>
  );
};

export default App;
