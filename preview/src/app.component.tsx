import styles from './app.module.scss';
import { LeftSidebar } from './components/left-sidebar.component';
import { RightSidebar } from './components/right-sidebar.component';

const App = () => (
  <div class={styles.shell}>
    <LeftSidebar />

    <main class={styles.main}></main>

    <RightSidebar />
  </div>
);

export default App;
