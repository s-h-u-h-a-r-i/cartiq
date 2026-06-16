import { createSignal, type JSX, type ParentComponent } from 'solid-js';

import { joinClasses } from '@/shared/classes';
import { MenuIcon, PanelRightOpenIcon, XIcon } from '@/shared/icons';
import styles from './app-shell.module.scss';

type OpenMobileSidebar = 'left' | 'right' | null;

interface AppShellProps {
  readonly title: string;
  readonly leftSidebar: JSX.Element;
  readonly rightSidebar?: JSX.Element;
  readonly class?: string;
}

export const AppShell: ParentComponent<AppShellProps> = (props) => {
  const [openMobileSidebar, setOpenMobileSidebar] = createSignal<OpenMobileSidebar>(null);

  const closeMobileSidebar = () => setOpenMobileSidebar(null);

  return (
    <div class={joinClasses(styles.shell, props.class)}>
      <header class={styles.topBar}>
        <button
          class={styles.iconButton}
          type='button'
          aria-label='Open navigation'
          aria-expanded={openMobileSidebar() === 'left'}
          onClick={() => setOpenMobileSidebar('left')}>
          <MenuIcon aria-hidden='true' />
        </button>

        <div class={styles.title}>{props.title}</div>

        <button
          class={styles.iconButton}
          type='button'
          aria-label='Open tools'
          aria-expanded={openMobileSidebar() === 'right'}
          onClick={() => setOpenMobileSidebar('right')}>
          <PanelRightOpenIcon aria-hidden='true' />
        </button>
      </header>

      <aside
        class={joinClasses(styles.sidebar, styles.leftSidebar)}
        classList={{ [styles.isOpen]: openMobileSidebar() === 'left' }}
        aria-label='Primary navigation'>
        <div class={styles.sidebarHeader}>
          <button
            class={styles.iconButton}
            type='button'
            aria-label='Close navigation'
            onClick={closeMobileSidebar}>
            <XIcon aria-hidden='true' />
          </button>
        </div>
        {props.leftSidebar}
      </aside>

      <main class={styles.mainContent}>{props.children}</main>

      <aside
        class={joinClasses(styles.sidebar, styles.rightSidebar)}
        classList={{ [styles.isOpen]: openMobileSidebar() === 'right' }}
        aria-label='Feature label'>
        <div class={styles.sidebarHeader}>
          <button
            class={styles.iconButton}
            type='button'
            aria-label='Close tools'
            onClick={closeMobileSidebar}>
            <XIcon aria-hidden='true' />
          </button>
        </div>
        {props.rightSidebar}
      </aside>

      <button
        class={styles.scrim}
        classList={{ [styles.isScrimVisible]: openMobileSidebar() !== null }}
        type='button'
        aria-label='Close sidebar'
        aria-hidden={openMobileSidebar() === null ? 'true' : undefined}
        tabIndex={openMobileSidebar() === null ? -1 : undefined}
        onClick={closeMobileSidebar}
      />
    </div>
  );
};
