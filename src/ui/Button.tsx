import type { JSX } from 'solid-js';
import { Show, splitProps } from 'solid-js';

import { joinClasses } from '@/shared/classes';

import styles from './button.module.scss';

type ButtonAppearance = 'solid' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly appearance?: ButtonAppearance;
  readonly size?: ButtonSize;
  readonly fullWidth?: boolean;
  readonly loading?: boolean;
  readonly leadingIcon?: JSX.Element;
  readonly trailingIcon?: JSX.Element;
}

export function Button(props: ButtonProps) {
  const [local, buttonProps] = splitProps(props, [
    'appearance',
    'children',
    'class',
    'disabled',
    'fullWidth',
    'leadingIcon',
    'loading',
    'size',
    'trailingIcon',
    'type',
  ]);

  const appearance = () => local.appearance ?? 'solid';
  const size = () => local.size ?? 'md';
  const isDisabled = () => local.disabled || local.loading;

  return (
    <button
      {...buttonProps}
      class={joinClasses(styles.button, local.class)}
      data-full-width={local.fullWidth ? '' : undefined}
      data-loading={local.loading ? '' : undefined}
      data-size={size()}
      data-appearance={appearance()}
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
