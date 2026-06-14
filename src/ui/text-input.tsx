import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import { joinClasses } from '@/shared/classes';

import styles from './text-input.module.scss';

type TextInputSize = 'sm' | 'md' | 'lg';

const sizeClass = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
} satisfies Record<TextInputSize, string>;

interface TextInputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  readonly fullWidth?: boolean;
  readonly invalid?: boolean;
  readonly size?: TextInputSize;
}

export function TextInput(props: TextInputProps) {
  const [local, inputProps] = splitProps(props, ['class', 'fullWidth', 'invalid', 'size']);

  const size = () => local.size ?? 'md';

  return (
    <input
      {...inputProps}
      class={joinClasses(styles.input, sizeClass[size()], local.class)}
      classList={{
        [styles.fullWidth]: local.fullWidth,
        [styles.invalid]: local.invalid,
      }}
      aria-invalid={local.invalid ? 'true' : inputProps['aria-invalid']}
    />
  );
}
