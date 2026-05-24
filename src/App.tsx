import type { Component } from 'solid-js';

import { AuthStoreProvider } from './features/auth';
import { ProfileStoreProvider } from './features/profile';

const App: Component = () => {
  return (
    <AuthStoreProvider>
      <ProfileStoreProvider>
        <h1>Logged in</h1>
      </ProfileStoreProvider>
    </AuthStoreProvider>
  );
};

export default App;
