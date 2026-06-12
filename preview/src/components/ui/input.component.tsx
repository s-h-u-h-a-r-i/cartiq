import { splitProps, type Component, type JSX } from 'solid-js';

import styles from './input.module.scss';

type InputProps = JSX.InputHTMLAttributes<HTMLInputElement>;

export const Input: Component<InputProps> = (props) => {
  const [local, inputProps] = splitProps(props, ['class']);

  return <input {...inputProps} class={`${styles.input} ${local.class ?? ''}`.trim()} />;
};
