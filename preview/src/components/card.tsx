import type { JSX } from 'solid-js';

type CardProps = {
  title: string;
  children: JSX.Element;
};

export const Card = (props: CardProps) => (
  <section class="card">
    <h2 class="card__title">{props.title}</h2>
    <div class="card__content">{props.children}</div>
  </section>
);
