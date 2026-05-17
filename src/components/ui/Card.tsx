import type { Component, JSX } from 'solid-js';

import styles from './Card.module.scss';

type CardProps = {
  children: JSX.Element;
  title: string;
};

export const AppCard: Component<CardProps> = (props: CardProps) => (
  <section class={styles.card}>
    <h2 class={styles.title}>{props.title}</h2>
    <div class={styles.content}>{props.children}</div>
  </section>
);
