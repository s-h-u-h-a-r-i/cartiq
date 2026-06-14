import type { JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import { joinClasses } from '@/shared/classes';

import styles from './logo.module.scss';

interface LogoProps extends JSX.HTMLAttributes<HTMLDivElement> {
  readonly labelId?: string;
}

export function Logo(props: LogoProps) {
  const [local, logoProps] = splitProps(props, ['class', 'labelId']);

  return (
    <div {...logoProps} class={joinClasses(styles.logo, local.class)} aria-labelledby={local.labelId}>
      <span class={styles.cart}>Cart</span>
      <span class={styles.iq}>IQ</span>
    </div>
  );
}
