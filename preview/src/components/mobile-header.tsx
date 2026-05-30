import type { ShoppingList } from '../mock-data';
import type { View } from '../types';

type MobileHeaderProps = {
  activeList: ShoppingList;
  view: View;
  onMenu: () => void;
  onPanel: () => void;
};

export const MobileHeader = (props: MobileHeaderProps) => (
  <header class="mobile-header">
    <button class="btn btn--icon mobile-header__menu" type="button" aria-label="Open menu" onClick={props.onMenu}>
      ☰
    </button>
    <div class="mobile-header__center">
      <div class="mobile-header__title">{props.view === 'list' ? props.activeList.name : titleForView(props.view)}</div>
      <div class="mobile-header__sub">{props.view === 'list' ? props.activeList.subtitle : 'Preview workspace'}</div>
    </div>
    <button class="btn btn--icon mobile-header__action" type="button" aria-label="Open panel" onClick={props.onPanel}>
      ◌
    </button>
  </header>
);

const titleForView = (view: View) => {
  if (view === 'history') return 'History';
  if (view === 'profile') return 'Profile';
  return 'Lists';
};
