import { createSignal, Show, type JSX, type ParentComponent } from 'solid-js';

import { joinClasses } from '@/shared/classes';
import styles from './app-shell.module.scss';

type MobilePanel = 'left' | 'main' | 'right';

interface AppShellProps {
  readonly leftSidebar: JSX.Element;
  readonly rightSidebar?: JSX.Element;
  readonly class?: string;
}

export const AppShell: ParentComponent<AppShellProps> = (props) => {
  const [mobilePanel, setMobilePanel] = createSignal<MobilePanel>('main');

  return (
    <div
      class={joinClasses(styles.shell, props.class)}
      classList={{
        [styles.showLeftPanel]: mobilePanel() === 'left',
        [styles.showMainPanel]: mobilePanel() === 'main',
        [styles.showRightPanel]: mobilePanel() === 'right',
      }}>
      <aside class={styles.leftSidebar} aria-label='Primary navigation'>
        {props.leftSidebar}
      </aside>

      <main class={styles.mainContent}>
        <div class={styles.mobileControls} aria-label='Workspace panels'>
          <button type='button' onClick={() => setMobilePanel('left')}>
            Navigation
          </button>
          <button type='button' onClick={() => setMobilePanel('main')}>
            Content
          </button>
          <button type='button' onClick={() => setMobilePanel('right')}>
            Tools
          </button>
        </div>

        {props.children}
      </main>

      <aside class={styles.rightSidebar} aria-label='Feature tools'>
        <Show when={props.rightSidebar} fallback={<div class={styles.emptyPanel} />}>
          {props.rightSidebar}
        </Show>
      </aside>
    </div>
  );
};
