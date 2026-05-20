import { Show, createSignal, type Component } from 'solid-js';

import { CoffeeIcon } from '@/components/icons';
import { Button, Card } from '@/components/ui';
import { runSignIn } from '../auth.runner';
import type { SignedInSession } from '../auth.service';
import styles from './AuthSignInView.module.scss';

const AuthSignInView: Component<{ onSignedIn: (session: SignedInSession) => void }> = (props) => {
  const [isSignInPending, setIsSignInPending] = createSignal(false);
  const [signInError, setSignInError] = createSignal<string | null>(null);

  const handleSignIn = () => {
    setSignInError(null);
    setIsSignInPending(true);
    void runSignIn(props.onSignedIn, (message) => setSignInError(message)).finally(() =>
      setIsSignInPending(false)
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
