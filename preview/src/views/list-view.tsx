import { For, Show } from 'solid-js';

import { Card } from '../components/card';
import type { ShoppingList } from '../mock-data';

type ListViewProps = {
  activeList: ShoppingList;
  remainingCount: number;
  onPanel: () => void;
};

export const ListView = (props: ListViewProps) => (
  <section>
    <div class="section-head">
      <div>
        <h1>{props.activeList.name}</h1>
        <p class="muted">
          {props.remainingCount} left · {props.activeList.subtitle}
        </p>
      </div>
      <div class="toolbar">
        <button class="btn btn--secondary" type="button" onClick={props.onPanel}>
          Details
        </button>
        <button class="btn btn--primary" type="button">
          Add item
        </button>
      </div>
    </div>

    <Card title="Current list">
      <ul class="items">
        <For each={props.activeList.items}>
          {(item) => (
            <li classList={{ item: true, 'is-checked': item.checked }}>
              <span class="item__check" aria-hidden="true">
                {item.checked ? '✓' : ''}
              </span>
              <span class="item__body">
                <span class="item__name">{item.name}</span>
                <span class="item__meta">
                  {item.quantity}
                  <Show when={item.note}> · {item.note}</Show>
                </span>
              </span>
              <span class="item__actions">
                <button class="btn btn--ghost" type="button">
                  Edit
                </button>
              </span>
            </li>
          )}
        </For>
      </ul>
    </Card>
  </section>
);
