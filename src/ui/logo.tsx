import type { Component, JSX } from 'solid-js';
import { Show, splitProps } from 'solid-js';

import { joinClasses } from '@/shared/classes';

import styles from './logo.module.scss';

type LogoVariant = 'full' | 'mark';
type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
type LogoTone = 'default' | 'muted' | 'inverse';
type LogoAnimationName = 'bounce' | 'shake';

interface LogoProps extends JSX.HTMLAttributes<HTMLDivElement> {
  readonly label?: string;
  readonly labelId?: string;
  readonly variant?: LogoVariant;
  readonly size?: LogoSize;
  readonly tone?: LogoTone;
  readonly animation?: LogoAnimationName;
  readonly animationLoop?: boolean;
}

export const Logo: Component<LogoProps> = (props: LogoProps) => {
  const [local, logoProps] = splitProps(props, [
    'class',
    'label',
    'labelId',
    'variant',
    'size',
    'tone',
    'animation',
    'animationLoop',
  ]);

  const variant = () => local.variant ?? 'full';
  const size = () => local.size ?? 'md';
  const tone = () => local.tone ?? 'default';
  const label = () => local.label ?? 'CartIQ';

  return (
    <div
      {...logoProps}
      class={joinClasses(
        styles.logo,
        sizeClassByName[size()],
        toneClassByName[tone()],
        local.class
      )}
      aria-label={local.labelId ? undefined : label()}
      aria-labelledby={local.labelId}>
      <Show when={variant() === 'full'}>
        <span class={styles.cart}>Cart</span>
      </Show>
      <span
        class={joinClasses(
          styles.badge,
          local.animation && animationClassByName[local.animation],
          local.animation &&
            (local.animationLoop ? styles.isAnimationLooping : styles.isAnimationSingleRun)
        )}>
        IQ
      </span>
    </div>
  );
};

const sizeClassByName: Record<LogoSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
};

const toneClassByName: Record<LogoTone, string> = {
  default: styles.toneDefault,
  muted: styles.toneMuted,
  inverse: styles.toneInverse,
};

const animationClassByName: Record<LogoAnimationName, string> = {
  bounce: styles.animationBounce,
  shake: styles.animationShake,
};
