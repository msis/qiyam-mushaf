import type { Preview } from '@storybook/sveltekit';
import '../src/app.css';

const preview: Preview = {
  initialGlobals: {
    backgrounds: { value: 'dark' }
  },
  parameters: {
    backgrounds: {
      options: {
        dark: { name: 'Dark', value: '#111827' }
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    },
    docs: {
      theme: 'dark'
    }
  },
};

export default preview;
