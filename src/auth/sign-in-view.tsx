import { Component, createSignal, onMount, Show } from 'solid-js';

import { useAppBackdrop } from '@/layout';
import { Button } from '@/ui/button';
import { Logo } from '@/ui/logo';

import styles from './sign-in-view.module.scss';

export type SignInResult = { readonly ok: true } | { readonly ok: false; readonly message: string };

const SignInView: Component<{ onSignInWithGoogle(): Promise<SignInResult> }> = (props) => {
  const backdrop = useAppBackdrop();
  const [isPending, setIsPending] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  onMount(() => {
    backdrop.setRadialPosition({ x: '25%', y: '30%' });
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
          <Logo labelId='sign-in-title' size='lg' />
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
