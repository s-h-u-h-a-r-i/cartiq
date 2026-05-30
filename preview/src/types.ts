import type { ShoppingList } from './mock-data';

export type View = 'list' | 'history' | 'profile';

export type ViewHandler = (view: View) => void;

export type ListHandler = (list: ShoppingList) => void;
