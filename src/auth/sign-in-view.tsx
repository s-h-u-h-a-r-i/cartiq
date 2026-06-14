import { Component, createSignal, onMount, Show } from 'solid-js';

import { useAppBackdrop } from '@/layout';
import { Button, Logo } from '@/ui';

import styles from './sign-in-view.module.scss';

export type SignInResult = { readonly ok: true } | { readonly ok: false; readonly message: string };

const SignInView: Component<{ onSignInWithGoogle(): Promise<SignInResult> }> = (props) => {
  const backdrop = useAppBackdrop();
  const [isPending, setIsPending] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  onMount(() => {
    backdrop.setRadialPosition({ x: '50%', y: '12%' });
  });

  const signIn = async () => {
    setIsPending(true);
    setError(null);
    const result = await props.onSignInWithGoogle();
    if (!result.ok) setError(result.message);
    setIsPending(false);
  };

  return (
    <main class={styles.page}>
      <section class={styles.panel} aria-labelledby='sign-in-title'>
        <div class={styles.heading}>
          <Logo labelId='sign-in-title' />
          <h1 id='sign-in-title' class={styles.title}>
            CartIQ
          </h1>
          <p>Smarter shopping starts here.</p>
        </div>

        <Button
          appearance='outline'
          size='lg'
          fullWidth
          loading={isPending()}
          onClick={() => void signIn()}>
          {isPending() ? 'Signing in...' : 'Continue with Google'}
        </Button>

        <Show when={error()}>{(errMsg) => <p class={styles.error}>{errMsg()}</p>}</Show>
      </section>
    </main>
  );
};

export default SignInView;
