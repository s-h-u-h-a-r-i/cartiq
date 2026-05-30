export type Item = {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
  note?: string;
};

export type ShoppingList = {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  items: Item[];
};

export type HistoryEntry = {
  id: string;
  title: string;
  meta: string;
  total: string;
};

export const profile = {
  name: 'Amina Carter',
  email: 'amina@example.com',
  plan: 'Home planner',
  avatar: 'A',
};

export const lists: ShoppingList[] = [
  {
    id: 'today',
    name: 'Today',
    subtitle: 'Dinner and basics',
    badge: '8 left',
    items: [
      { id: 'tomatoes', name: 'Roma tomatoes', quantity: '6', checked: false, note: 'Firm, not overripe' },
      { id: 'basil', name: 'Fresh basil', quantity: '1 bunch', checked: false },
      { id: 'pasta', name: 'Rigatoni', quantity: '500 g', checked: true },
      { id: 'milk', name: 'Oat milk', quantity: '2 cartons', checked: false },
      { id: 'soap', name: 'Dish soap', quantity: '1', checked: false },
    ],
  },
  {
    id: 'weekend',
    name: 'Weekend stock-up',
    subtitle: 'Pantry, fruit, and freezer',
    badge: '12 left',
    items: [
      { id: 'rice', name: 'Jasmine rice', quantity: '2 kg', checked: false },
      { id: 'berries', name: 'Mixed berries', quantity: '3 punnets', checked: false },
      { id: 'yogurt', name: 'Greek yogurt', quantity: '1 tub', checked: true },
      { id: 'peas', name: 'Frozen peas', quantity: '2 bags', checked: false },
    ],
  },
  {
    id: 'braai',
    name: 'Braai night',
    subtitle: 'Guests arriving at 18:00',
    badge: '5 left',
    items: [
      { id: 'charcoal', name: 'Charcoal', quantity: '1 bag', checked: false },
      { id: 'corn', name: 'Corn', quantity: '8 ears', checked: false },
      { id: 'salad', name: 'Green salad mix', quantity: '2 bags', checked: true },
      { id: 'rolls', name: 'Bread rolls', quantity: '12', checked: false },
    ],
  },
];

export const history: HistoryEntry[] = [
  { id: 'h1', title: 'Weekly shop', meta: 'Completed yesterday', total: '24 items' },
  { id: 'h2', title: 'Quick pharmacy run', meta: 'Completed Friday', total: '4 items' },
  { id: 'h3', title: 'Dinner party', meta: 'Completed 12 May', total: '18 items' },
];
