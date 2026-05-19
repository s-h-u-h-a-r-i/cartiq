import type { Component } from 'solid-js';
import { AuthStoreProvider } from './features/auth';

const App: Component = () => {
  return (
    <AuthStoreProvider>
      <h1>Logged in</h1>
    </AuthStoreProvider>
  );
};

export default App;
