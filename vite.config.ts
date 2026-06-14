import path from 'node:path';
import devtools from 'solid-devtools/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig(({ mode }) => {
  const environmentPath =
    mode === 'mock'
      ? '/src/environment/mock.environment.ts'
      : '/src/environment/real.environment.ts';

  return {
    plugins: [devtools(), solidPlugin()],
    resolve: {
      alias: [
        {
          find: '@/environment',
          replacement: path.resolve(__dirname, environmentPath),
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        },
      ],
    },
    server: {
      port: 3000,
    },
    build: {
      target: 'esnext',
    },
  };
});
