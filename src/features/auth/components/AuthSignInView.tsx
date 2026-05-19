import { Show, createSignal, type Component } from 'solid-js';

import { CoffeeIcon } from '@/components/icons';
import { Button, Card } from '@/components/ui';
import { TaskResult } from '@/lib/result';
import { getSignInErrorMessage, type AuthError } from '../auth.errors';
import styles from './AuthSignInView.module.scss';

type AuthSignInViewProps = {
  onSignIn: TaskResult<void, AuthError>;
};

const AuthSignInView: Component<AuthSignInViewProps> = (props) => {
  const [isSignInPending, setIsSignInPending] = createSignal(false);
  const [signInError, setSignInError] = createSignal<string | null>(null);

  const handleSignIn = () => {
    setSignInError(null);
    setIsSignInPending(true);
    void TaskResult.unwrap(
      TaskResult.pipe(
        props.onSignIn,
        TaskResult.tapErr((error) =>
          TaskResult.sync(() => void setSignInError(getSignInErrorMessage(error)))
        ),
        TaskResult.finally(() => TaskResult.sync(() => void setIsSignInPending(false)))
      )
    );
  };

  return (
    <main class={styles.root}>
      <div class={styles.card}>
        <Card title='Welcome Back'>
          <p class={styles.description}>
            Sign in with Google to continue and connect your shopping data.
          </p>
          <div class={styles.actions}>
            <Button
              loading={isSignInPending()}
              onClick={handleSignIn}
              icon={<CoffeeIcon size={16} />}>
              Continue with Google
            </Button>
          </div>
          <Show when={signInError()} keyed>
            {(message) => <p class={styles.error}>{message}</p>}
          </Show>
        </Card>
      </div>
    </main>
  );
};

export default AuthSignInView;
