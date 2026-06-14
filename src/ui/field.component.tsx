import type { JSX } from 'solid-js';
import { Show, createUniqueId, splitProps } from 'solid-js';

import { joinClasses } from '@/shared/classes';
import styles from './field.module.scss';

interface FieldControlProps {
  readonly id: string;
  readonly 'aria-describedby'?: string;
  readonly invalid?: boolean;
}

interface FieldProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
  readonly children: JSX.Element | ((controlProps: FieldControlProps) => JSX.Element);
  readonly error?: string | null;
  readonly hint?: string;
  readonly htmlFor?: string;
  readonly label: string;
}

export function Field(props: FieldProps) {
  const fallbackId = createUniqueId();
  const [local, fieldProps] = splitProps(props, [
    'children',
    'class',
    'error',
    'hint',
    'htmlFor',
    'label',
  ]);

  const controlId = () => local.htmlFor ?? fallbackId;
  const hintId = () => `${controlId()}-hint`;
  const errorId = () => `${controlId()}-error`;
  const describedBy = () =>
    joinClasses(local.hint && hintId(), local.error && errorId()) || undefined;
  const controlProps = (): FieldControlProps => ({
    id: controlId(),
    'aria-describedby': describedBy(),
    invalid: Boolean(local.error),
  });
  const children = () => {
    if (typeof local.children === 'function') return local.children(controlProps());

    return local.children;
  };

  return (
    <div {...fieldProps} class={joinClasses(styles.field, local.class)}>
      <label class={styles.label} for={controlId()}>
        {local.label}
      </label>

      <Show when={local.hint}>
        {(hint) => (
          <p class={styles.hint} id={hintId()}>
            {hint()}
          </p>
        )}
      </Show>

      {children()}

      <Show when={local.error}>
        {(error) => (
          <p class={styles.error} id={errorId()}>
            {error()}
          </p>
        )}
      </Show>
    </div>
  );
}
