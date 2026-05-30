import { Show, createMemo, createSignal } from 'solid-js';

import { BottomNav } from './components/bottom-nav';
import { LeftSidebar } from './components/left-sidebar';
import { MobileHeader } from './components/mobile-header';
import { RightPanel } from './components/right-panel';
import { HistoryView } from './views/history-view';
import { ListView } from './views/list-view';
import { ProfileView } from './views/profile-view';
import { lists, type ShoppingList } from './mock-data';
import type { View } from './types';

export const App = () => {
  const [view, setView] = createSignal<View>('list');
  const [activeListId, setActiveListId] = createSignal(lists[0]?.id ?? '');
  const [drawerOpen, setDrawerOpen] = createSignal(false);
  const [sheetOpen, setSheetOpen] = createSignal(false);

  const activeList = createMemo(() => lists.find((list) => list.id === activeListId()) ?? lists[0]);
  const completedCount = createMemo(() => activeList().items.filter((item) => item.checked).length);
  const remainingCount = createMemo(() => activeList().items.length - completedCount());

  const openList = (list: ShoppingList) => {
    setActiveListId(list.id);
    setView('list');
    setDrawerOpen(false);
  };

  const openView = (nextView: View) => {
    setView(nextView);
    setDrawerOpen(false);
  };

  return (
    <div class="app">
      <div
        classList={{ 'drawer-backdrop': true, 'is-visible': drawerOpen() }}
        onClick={() => setDrawerOpen(false)}
      />
      <div classList={{ 'sheet-backdrop': true, 'is-visible': sheetOpen() }} onClick={() => setSheetOpen(false)} />

      <MobileHeader
        activeList={activeList()}
        view={view()}
        onMenu={() => setDrawerOpen(true)}
        onPanel={() => setSheetOpen(true)}
      />

      <LeftSidebar
        activeList={activeList()}
        currentView={view()}
        drawerOpen={drawerOpen()}
        onList={openList}
        onView={openView}
      />

      <main class="main">
        <Show when={view() === 'list'}>
          <ListView activeList={activeList()} remainingCount={remainingCount()} onPanel={() => setSheetOpen(true)} />
        </Show>
        <Show when={view() === 'history'}>
          <HistoryView />
        </Show>
        <Show when={view() === 'profile'}>
          <ProfileView />
        </Show>
      </main>

      <RightPanel activeList={activeList()} completedCount={completedCount()} sheetOpen={sheetOpen()} />

      <BottomNav currentView={view()} onView={openView} />
    </div>
  );
};
