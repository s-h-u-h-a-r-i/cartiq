import { splitProps, type Component, type JSX } from 'solid-js';

import styles from './input.module.scss';

type TextInputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';

type TextInputProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  type?: TextInputType;
};

export const TextInput: Component<TextInputProps> = (props) => {
  const [local, inputProps] = splitProps(props, ['class']);

  return <input {...inputProps} class={[styles.input, local.class].filter(Boolean).join(' ')} />;
};
