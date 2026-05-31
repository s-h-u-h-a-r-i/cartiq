import { splitProps, type Component, type JSX } from 'solid-js';

import styles from './button.module.scss';

type ButtonVariantProps = {
  children: JSX.Element;
  variant?: 'primary' | 'secondary';
  icon?: JSX.Element;
  loading?: boolean;
};

type ButtonProps = ButtonVariantProps & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: Component<ButtonProps> = (props) => {
  const [local, buttonProps] = splitProps(props, [
    'variant',
    'icon',
    'children',
    'class',
    'loading',
  ]);

  const variant = () => local.variant ?? 'primary';
  const disabled = () => Boolean(buttonProps.disabled || local.loading);

  return (
    <button
      {...buttonProps}
      class={`${styles.button} ${styles[variant()]} ${local.loading ? styles.loading : ''} ${local.class ?? ''}`.trim()}
      type={buttonProps.type ?? 'button'}
      disabled={disabled()}
      aria-busy={local.loading ? 'true' : undefined}>
      {!local.loading ? local.icon : null}
      <span class={styles.label}>{local.children}</span>
      {local.loading ? <span class={styles.spinner} aria-hidden="true" /> : null}
    </button>
  );
};
