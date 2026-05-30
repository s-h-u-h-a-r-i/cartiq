import { Show } from 'solid-js';

import { profile } from '../mock-data';
import styles from './left-sidebar.module.scss';

export const LeftSidebar = () => {
  const initials = () => profile.name.trim().slice(0, 1).toUpperCase();

  return (
    <aside class={styles.sidebar} aria-label="App sidebar">
      <div class={styles.top}>
        <div class={styles.brand}>CartIQ</div>
      </div>

      <div class={styles.body}></div>

      <footer class={styles.profileFoot}>
        <button class={styles.profileButton} type="button">
          <span class={styles.avatar} aria-hidden="true">
            <Show when={profile.avatarUrl} fallback={initials()}>
              <img src={profile.avatarUrl!} alt="" />
            </Show>
          </span>

          <span class={styles.profileText}>
            <span class={styles.profileName}>{profile.name}</span>
            <span class={styles.profileSub}>{profile.email}</span>
          </span>
        </button>
      </footer>
    </aside>
  );
};
