import { LeftSidebar } from './components/left-sidebar';
import { RightSidebar } from './components/right-sidebar';
import styles from './app.module.scss';

export const App = () => (
  <div class={styles.shell}>
    <LeftSidebar />

    <main class={styles.main}></main>

    <RightSidebar />
  </div>
);
