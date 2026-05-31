import { splitProps, type Component, type JSX } from 'solid-js';

import styles from './input.module.scss';

type InputProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  type?: 'text' | 'password';
};

export const Input: Component<InputProps> = (props) => {
  const [local, inputProps] = splitProps(props, ['class', 'type']);

  return (
    <input
      {...inputProps}
      class={`${styles.input} ${local.class ?? ''}`.trim()}
      type={local.type ?? 'text'}
    />
  );
};
