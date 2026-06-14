import type { JSX } from 'solid-js';
import { Show, splitProps } from 'solid-js';

import { joinClasses } from '@/shared/classes';

import styles from './button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly fullWidth?: boolean;
  readonly loading?: boolean;
  readonly leadingIcon?: JSX.Element;
  readonly trailingIcon?: JSX.Element;
}

export function Button(props: ButtonProps) {
  const [local, buttonProps] = splitProps(props, [
    'children',
    'class',
    'disabled',
    'fullWidth',
    'leadingIcon',
    'loading',
    'size',
    'trailingIcon',
    'type',
    'variant',
  ]);

  const variant = () => local.variant ?? 'primary';
  const size = () => local.size ?? 'md';
  const isDisabled = () => local.disabled || local.loading;

  return (
    <button
      {...buttonProps}
      class={joinClasses(styles.button, local.class)}
      data-full-width={local.fullWidth ? '' : undefined}
      data-loading={local.loading ? '' : undefined}
      data-size={size()}
      data-variant={variant()}
      disabled={isDisabled()}
      type={local.type ?? 'button'}
      aria-busy={local.loading ? 'true' : undefined}>
      <Show when={local.loading}>
        <span class={styles.spinner} aria-hidden='true' />
      </Show>

      <Show when={!local.loading && local.leadingIcon}>
        <span class={styles.icon} aria-hidden='true'>
          {local.leadingIcon}
        </span>
      </Show>

      <span class={styles.label}>{local.children}</span>

      <Show when={!local.loading && local.trailingIcon}>
        <span class={styles.icon} aria-hidden='true'>
          {local.trailingIcon}
        </span>
      </Show>
    </button>
  );
}
