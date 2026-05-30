import type { View, ViewHandler } from '../types';

type BottomNavProps = {
  currentView: View;
  onView: ViewHandler;
};

export const BottomNav = (props: BottomNavProps) => (
  <nav class="bottom-nav" aria-label="Mobile">
    <button
      classList={{ 'bottom-nav__btn': true, 'is-active': props.currentView === 'list' }}
      type="button"
      onClick={() => props.onView('list')}
    >
      <span class="bottom-nav__icon" aria-hidden="true">
        L
      </span>
      Lists
    </button>
    <button
      classList={{ 'bottom-nav__btn': true, 'is-active': props.currentView === 'history' }}
      type="button"
      onClick={() => props.onView('history')}
    >
      <span class="bottom-nav__icon" aria-hidden="true">
        H
      </span>
      History
    </button>
    <button
      classList={{ 'bottom-nav__btn': true, 'is-active': props.currentView === 'profile' }}
      type="button"
      onClick={() => props.onView('profile')}
    >
      <span class="bottom-nav__icon" aria-hidden="true">
        P
      </span>
      Profile
    </button>
  </nav>
);
