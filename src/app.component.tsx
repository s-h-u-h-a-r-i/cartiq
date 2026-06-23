import { type Component } from 'solid-js';

import { AuthProvider, type Auth } from './auth';
import { AppBackdropProvider } from './layout/app-backdrop';
import { AppShell } from './layout/app-shell';
import { ProfileProvider, type ProfileRepository } from './profile';

interface AppProps {
  readonly auth: Auth;
  readonly profileRepository: ProfileRepository;
}

const App: Component<AppProps> = (props) => (
  <AppBackdropProvider>
    <AuthProvider auth={props.auth}>
      <ProfileProvider repository={props.profileRepository}>
        <AppContent />
      </ProfileProvider>
    </AuthProvider>
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
