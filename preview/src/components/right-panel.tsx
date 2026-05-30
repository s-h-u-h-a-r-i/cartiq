import { Card } from './card';
import type { ShoppingList } from '../mock-data';

type RightPanelProps = {
  activeList: ShoppingList;
  completedCount: number;
  sheetOpen: boolean;
};

export const RightPanel = (props: RightPanelProps) => (
  <aside classList={{ 'sidebar-right': true, 'is-sheet-open': true, 'is-open': props.sheetOpen }} aria-label="Details panel">
    <span class="sheet-handle" aria-hidden="true" />
    <h2 class="panel-title">List details</h2>
    <p class="muted">{props.activeList.subtitle}</p>

    <div class="panel-stack">
      <Card title="Progress">
        <div class="progress">
          <span>{props.completedCount}</span>
          <span class="muted">of {props.activeList.items.length} checked</span>
        </div>
      </Card>
      <Card title="Suggestions">
        <ul class="mini-list">
          <li>Group pantry items together</li>
          <li>Check staples before checkout</li>
          <li>Repeat from last weekend</li>
        </ul>
      </Card>
    </div>
  </aside>
);
