import type { JSX } from 'solid-js';

import styles from './card.module.scss';

type CardProps = {
  title: string;
  children: JSX.Element;
};

export const Card = (props: CardProps) => (
  <section class={styles.card}>
    <h2 class={styles.title}>{props.title}</h2>
    <div class={styles.content}>{props.children}</div>
  </section>
);
