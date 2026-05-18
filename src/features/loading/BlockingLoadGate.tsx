import { Show, type Component, type JSX } from 'solid-js';

import styles from './BlockingLoadGate.module.scss';

type BlockingLoadGateProps = {
  isLoading: boolean;
  children: JSX.Element;
  loadingMessage?: string;
  loadingLabel?: string;
};

export const BlockingLoadGate: Component<BlockingLoadGateProps> = (props) => {
  const loadingMessage = () => props.loadingMessage ?? 'Loading...';
  const loadingLabel = () => props.loadingLabel ?? 'Application loading state';

  return (
    <Show
      when={!props.isLoading}
      fallback={
        <main class={styles.surface} aria-live='polite' aria-label={loadingLabel()}>
          <div class={styles.root}>
            <span class={styles.label}>{loadingLabel()}</span>
            <div class={styles.messageRow}>
              <span class={styles.dots} aria-hidden='true'>
                <span class={styles.dot} />
                <span class={styles.dot} />
                <span class={styles.dot} />
              </span>
              <Show when={loadingMessage()} keyed>
                {(message) => <p class={styles.message}>{message}</p>}
              </Show>
            </div>
          </div>
        </main>
      }>
      {props.children}
    </Show>
  );
};
