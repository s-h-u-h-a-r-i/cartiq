import { Component, createSignal, Show } from 'solid-js';

import { Button } from '@/ui';

export type SignInResult = { readonly ok: true } | { readonly ok: false; readonly message: string };

export const SignInView: Component<{ onSignInWithGoogle(): Promise<SignInResult> }> = (props) => {
  const [isPending, setIsPending] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const signIn = async () => {
    setIsPending(true);
    setError(null);
    const result = await props.onSignInWithGoogle();
    if (!result.ok) setError(result.message);
    setIsPending(false);
  };

  return (
    <main>
      <h1>CartIQ</h1>
      <Button loading={isPending()} onClick={() => void signIn()}>
        {isPending() ? 'Signing in...' : 'Continue with Google'}
      </Button>
      <Show when={error()}>{(errMsg) => <p>{errMsg()}</p>}</Show>
    </main>
  );
};
