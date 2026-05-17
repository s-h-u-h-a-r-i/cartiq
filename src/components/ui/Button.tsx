import { splitProps, type Component, type JSX } from 'solid-js';

import styles from './Button.module.scss';

type ButtonVariantProps = {
  children: JSX.Element;
  variant?: 'primary' | 'secondary';
  icon?: JSX.Element;
};

type ButtonProps = ButtonVariantProps & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: Component<ButtonProps> = (props) => {
  const [local, buttonProps] = splitProps(props, ['variant', 'icon', 'children', 'class']);

  const variant = () => local.variant ?? 'primary';

  return (
    <button
      {...buttonProps}
      class={`${styles.button} ${styles[variant()]} ${local.class ?? ''}`.trim()}
      type={buttonProps.type ?? 'button'}>
      {local.icon}
      <span>{local.children}</span>
    </button>
  );
};
