import { Show, type Component } from 'solid-js';

import { useAuth } from '@/features/auth';
import { useProfile } from '@/features/profile';
import styles from './left-sidebar.module.scss';

export const LeftSidebar: Component = () => {
  const authStore = useAuth();
  const profileStore = useProfile();

  const displayName = () => profileStore.profile().displayName ?? 'CartIQ user';
  const email = () => authStore.user().email ?? '';
  const avatarUrl = () => profileStore.profile().avatarUrl;
  const initials = () => displayName().trim().slice(0, 1).toUpperCase();

  return (
    <aside class={styles.sidebar} aria-label='App sidebar'>
      <div class={styles.top}>
        <div class={styles.brand}>CartIQ</div>
      </div>

      <div class={styles.body}></div>

      <footer class={styles.profileFoot}>
        <button class={styles.profileButton} type='button'>
          <span class={styles.avatar} aria-hidden='true'>
            <Show when={avatarUrl()} fallback={initials()}>
              <img src={avatarUrl()!} alt='' />
            </Show>
          </span>

          <span class={styles.profileText}>
            <span class={styles.profileName}>{displayName()}</span>
            <span class={styles.profileSub}>{email()}</span>
          </span>
        </button>
      </footer>
    </aside>
  );
};
