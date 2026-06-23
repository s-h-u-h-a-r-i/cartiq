/* @refresh reload */
import 'solid-devtools';
import { render } from 'solid-js/web';

import App from './app.component';
import { Auth } from './auth';
import { ProfileRepository } from './profile';
import { createSupabaseClient } from './supabase';
import './styles/index.scss';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?'
  );
}

const supabase = createSupabaseClient();
const auth = new Auth(supabase);
const profileRepository = new ProfileRepository(supabase);

render(
  () => <App auth={auth} profileRepository={profileRepository} />,
  root!
);
