import type { Accessor, JSX, ParentComponent } from 'solid-js';
import { createContext, createSignal, splitProps, useContext } from 'solid-js';

import { joinClasses } from '@/shared/classes';

import styles from './app-backdrop.module.scss';

type RadialCoordinate = `${number}%` | `${number}px` | `${number}rem`;

export interface AppBackdropRadialPosition {
  readonly x: RadialCoordinate;
  readonly y: RadialCoordinate;
}

interface AppBackdropContextValue {
  readonly radialPosition: Accessor<AppBackdropRadialPosition>;
  setRadialPosition(position: AppBackdropRadialPosition): void;
}

interface AppBackdropProviderProps extends JSX.HTMLAttributes<HTMLDivElement> {
  readonly initialRadialPosition?: AppBackdropRadialPosition;
}

const defaultRadialPosition: AppBackdropRadialPosition = {
  x: '50%',
  y: '12%',
};

const AppBackdropContext = createContext<AppBackdropContextValue>();

export const AppBackdropProvider: ParentComponent<AppBackdropProviderProps> = (props) => {
  const [local, backdropProps] = splitProps(props, [
    'children',
    'class',
    'initialRadialPosition',
    'style',
  ]);
  const [radialPosition, setRadialPosition] = createSignal(
    local.initialRadialPosition ?? defaultRadialPosition
  );

  const backdropStyle = (): JSX.CSSProperties => ({
    ...((local.style as JSX.CSSProperties | undefined) ?? {}),
    '--app-backdrop-radial-x': radialPosition().x,
    '--app-backdrop-radial-y': radialPosition().y,
  });

  return (
    <AppBackdropContext.Provider value={{ radialPosition, setRadialPosition }}>
      <div
        {...backdropProps}
        class={joinClasses(styles.backdrop, local.class)}
        style={backdropStyle()}>
        {local.children}
      </div>
    </AppBackdropContext.Provider>
  );
};

export function useAppBackdrop() {
  const ctx = useContext(AppBackdropContext);
  if (!ctx) {
    throw new Error(`${useAppBackdrop.name} must be used within ${AppBackdropProvider.name}`);
  }
  return ctx;
}
