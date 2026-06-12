import { splitProps, type Component, type JSX } from 'solid-js';

import styles from './field.module.scss';

type FieldProps = JSX.HTMLAttributes<HTMLDivElement> & {
  orientation?: 'vertical' | 'horizontal';
};

type FieldLabelProps = JSX.LabelHTMLAttributes<HTMLLabelElement>;

type FieldDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement>;

type FieldErrorProps = JSX.HTMLAttributes<HTMLParagraphElement>;

export const Field: Component<FieldProps> = (props) => {
  const [local, fieldProps] = splitProps(props, ['class', 'orientation']);

  return (
    <div
      {...fieldProps}
      class={[styles.field, styles[local.orientation ?? 'vertical'], local.class]
        .filter(Boolean)
        .join(' ')}
    />
  );
};

export const FieldLabel: Component<FieldLabelProps> = (props) => {
  const [local, labelProps] = splitProps(props, ['class']);

  return <label {...labelProps} class={[styles.label, local.class].filter(Boolean).join(' ')} />;
};

export const FieldDescription: Component<FieldDescriptionProps> = (props) => {
  const [local, descriptionProps] = splitProps(props, ['class']);

  return (
    <p {...descriptionProps} class={[styles.description, local.class].filter(Boolean).join(' ')} />
  );
};

export const FieldError: Component<FieldErrorProps> = (props) => {
  const [local, errorProps] = splitProps(props, ['class']);

  return <p {...errorProps} class={[styles.error, local.class].filter(Boolean).join(' ')} />;
};
