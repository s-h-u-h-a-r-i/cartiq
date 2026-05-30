import { For } from 'solid-js';

import { Card } from '../components/card';
import { history } from '../mock-data';

export const HistoryView = () => (
  <section>
    <div class="section-head">
      <div>
        <h1>History</h1>
        <p class="muted">Recent completed shops and repeats.</p>
      </div>
    </div>

    <div class="stack">
      <For each={history}>
        {(entry) => (
          <Card title={entry.title}>
            <div class="history-row">
              <span class="muted">{entry.meta}</span>
              <span class="badge">{entry.total}</span>
            </div>
          </Card>
        )}
      </For>
    </div>
  </section>
);
