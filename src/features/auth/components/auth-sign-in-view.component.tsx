import { Effect, Either } from 'effect';
import { Show, createSignal, type Component } from 'solid-js';

import { CoffeeIcon } from '@/components/icons';
import { Button, Card } from '@/components/ui';
import { run } from '@/lib/runtime';

import { AuthService } from '../auth.service';
import styles from './auth-sign-in-view.module.scss';

const AuthSignInView: Component = () => {
  const [isSignInPending, setIsSignInPending] = createSignal(false);
  const [signInError, setSignInError] = createSignal<string | null>(null);

  const handleSignIn = async () => {
    setSignInError(null);
    setIsSignInPending(true);

    try {
      const result = await run(Effect.either(AuthService.signInWithGoogle));

      if (Either.isLeft(result)) {
        setSignInError(result.left.message);
      }
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
