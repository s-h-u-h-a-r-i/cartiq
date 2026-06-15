import { Component, onCleanup, onMount } from 'solid-js';

import { Logo } from '@/ui';
import { useAppBackdrop } from './app-backdrop';
import styles from './loading-screen.module.scss';

interface LoadingScreenProps {
  readonly label?: string;
}

export const LoadingScreen: Component<LoadingScreenProps> = (props) => {
  const backdrop = useAppBackdrop();

  onMount(() => {
    let positionIndex = 0;

    backdrop.setRadialPosition(loadingRadialPositions[positionIndex]);

    const intervalId = window.setInterval(() => {
      positionIndex = (positionIndex + 1) % loadingRadialPositions.length;
      backdrop.setRadialPosition(loadingRadialPositions[positionIndex]);
    }, 2200);

    onCleanup(() => {
      window.clearInterval(intervalId);
    });
  });

  return (
    <main
      class={styles.screen}
      aria-busy='true'
      aria-live='polite'
      aria-label={props.label ?? 'Loading CartIQ'}>
      <Logo size='xl' animation='bounce' animationLoop />
    </main>
  );
};

const loadingRadialPositions = [
  { x: '50%', y: '12%' },
  { x: '18%', y: '26%' },
  { x: '82%', y: '30%' },
  { x: '62%', y: '78%' },
  { x: '28%', y: '70%' },
] as const;
