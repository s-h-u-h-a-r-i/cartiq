/* @refresh reload */
import { render } from 'solid-js/web';

import App from './app.component.tsx';
import './styles/index.scss';

const root = document.getElementById('root');

render(() => <App />, root!);
