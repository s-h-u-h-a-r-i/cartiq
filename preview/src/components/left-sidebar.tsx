import { For } from 'solid-js';

import { lists, profile, type ShoppingList } from '../mock-data';
import type { ListHandler, View, ViewHandler } from '../types';

type LeftSidebarProps = {
  activeList: ShoppingList;
  currentView: View;
  drawerOpen: boolean;
  onList: ListHandler;
  onView: ViewHandler;
};

export const LeftSidebar = (props: LeftSidebarProps) => (
  <aside classList={{ 'sidebar-left': true, 'is-open': props.drawerOpen }} aria-label="Preview sidebar">
    <div class="sidebar-left__top">
      <div class="brand">CartIQ</div>
      <nav class="nav" aria-label="Primary">
        <button
          classList={{ nav__btn: true, 'is-active': props.currentView === 'list' }}
          type="button"
          onClick={() => props.onView('list')}
        >
          Lists
        </button>
        <button
          classList={{ nav__btn: true, 'is-active': props.currentView === 'history' }}
          type="button"
          onClick={() => props.onView('history')}
        >
          History
        </button>
      </nav>
    </div>

    <section class="lists-block" aria-label="Shopping lists">
      <div class="lists-block__head">
        <span class="lists-block__label">Shopping lists</span>
        <button class="btn btn--ghost" type="button">
          New
        </button>
      </div>

      <For each={lists}>
        {(list) => (
          <button
            classList={{ 'list-btn': true, 'is-active': props.currentView === 'list' && props.activeList.id === list.id }}
            type="button"
            onClick={() => props.onList(list)}
          >
            <span class="list-btn__main">
              <span class="list-btn__title">{list.name}</span>
              <span class="list-btn__sub">{list.subtitle}</span>
            </span>
            <span classList={{ badge: true, 'badge--today': list.id === 'today' }}>{list.badge}</span>
          </button>
        )}
      </For>
    </section>

    <footer class="profile-foot">
      <button class="profile-btn" type="button" onClick={() => props.onView('profile')}>
        <span class="avatar" aria-hidden="true">
          {profile.avatar}
        </span>
        <span class="profile-btn__text">
          <span class="profile-btn__name">{profile.name}</span>
          <span class="profile-btn__sub">{profile.email}</span>
        </span>
      </button>
    </footer>
  </aside>
);
