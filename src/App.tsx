import { AuthStoreProvider } from './features/auth';

function App() {
  return (
    <AuthStoreProvider>
      <h1>Logged In</h1>
    </AuthStoreProvider>
  );
}

export default App;
