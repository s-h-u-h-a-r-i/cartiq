import type { ParentComponent } from 'solid-js';

import styles from './app-shell.module.scss';
import { LeftSidebar } from './left-sidebar.component';

export const AppShell: ParentComponent = (props) => {
  return (
    <div class={styles.shell}>
      <LeftSidebar />

      <main class={styles.main}>{props.children}</main>
    </div>
  );
};
