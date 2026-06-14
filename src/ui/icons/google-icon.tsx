import { Component, type JSX } from 'solid-js';

export const GoogleIcon: Component<JSX.SvgSVGAttributes<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox='0 0 24 24' fill='none' role='img' aria-label='Google'>
    <path
      d='M21 12.24c0-.74-.07-1.45-.2-2.13h-8.58v3.92h4.92a4.2 4.2 0 0 1-1.82 2.76v2.58h2.96C20 17.78 21 15.38 21 12.24Z'
      fill='currentColor'
      opacity='0.86'
    />
    <path
      d='M12.22 21c2.46 0 4.52-.81 6.03-2.2l-2.96-2.58c-.82.55-1.86.87-3.07.87-2.36 0-4.36-1.59-5.08-3.73H4.08v2.66A9.1 9.1 0 0 0 12.22 21Z'
      fill='currentColor'
      opacity='0.7'
    />
    <path
      d='M7.14 13.36a5.46 5.46 0 0 1 0-3.48V7.22H4.08a9.1 9.1 0 0 0 0 8.8l3.06-2.66Z'
      fill='currentColor'
      opacity='0.56'
    />
    <path
      d='M12.22 6.15c1.34 0 2.55.46 3.5 1.36l2.6-2.6A8.77 8.77 0 0 0 12.22 3a9.1 9.1 0 0 0-8.14 5.02l3.06 2.66c.72-2.14 2.72-3.73 5.08-3.73Z'
      fill='currentColor'
    />
  </svg>
);
