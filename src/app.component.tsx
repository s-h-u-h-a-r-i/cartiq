import { type Component } from 'solid-js';

import { AuthProvider, useAuth } from './auth';
import { AppBackdropProvider } from './layout';

const Home: Component = () => {
  const auth = useAuth();

  return (
    <main>
      <h1>CartIQ</h1>
      <p>{auth.user().email}</p>
      <button type='button' onClick={() => void auth.signOut()}>
        Sign out
      </button>
    </main>
  );
};

const App: Component = () => {
  return (
    <AppBackdropProvider>
      <AuthProvider>
        <Home />
      </AuthProvider>
    </AppBackdropProvider>
  );
};

export default App;
