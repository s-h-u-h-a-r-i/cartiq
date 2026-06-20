export type Subscription<T> = (value: T) => void;
export type SubscriptionUpdater<T> = (currentValue: T) => T;

export function createSubscriptionStore<T>(initialValue: T) {
  let currentValue = initialValue;
  const listeners = new Set<Subscription<T>>();

  const get = () => currentValue;

  const set = (nextValue: T) => {
    currentValue = nextValue;

    for (const listener of listeners) {
      listener(currentValue);
    }
  };

  const update = (updater: SubscriptionUpdater<T>) => {
    const nextValue = updater(currentValue);
    set(nextValue);
    return nextValue;
  };

  const subscribe = (listener: Subscription<T>) => {
    listeners.add(listener);
    queueMicrotask(() => listener(currentValue));
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    get,
    set,
    update,
    subscribe,
  };
}
