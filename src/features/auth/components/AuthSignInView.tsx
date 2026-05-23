import { Show, createSignal, type Component } from 'solid-js';

import { CoffeeIcon } from '@/components/icons';
import { Button, Card } from '@/components/ui';
import { runEither } from '@/lib/runtime';
import { Either } from 'effect';
import { getSignInErrorMessage } from '../auth.errors';
import { AuthService } from '../auth.service';
import type { SignedInSession } from '../auth.types';
import styles from './AuthSignInView.module.scss';

const AuthSignInView: Component<{ onSignedIn: (session: SignedInSession) => void }> = (props) => {
  const [isSignInPending, setIsSignInPending] = createSignal(false);
  const [signInError, setSignInError] = createSignal<string | null>(null);

  const handleSignIn = async () => {
    setSignInError(null);
    setIsSignInPending(true);

    try {
      const result = await runEither(AuthService.signInWithGoogle);

      if (Either.isLeft(result)) {
        setSignInError(getSignInErrorMessage(result.left));
        return;
      }

      props.onSignedIn(result.right);
    } finally {
      setIsSignInPending(false);
    }
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
