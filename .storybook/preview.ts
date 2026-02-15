import type { Preview } from '@storybook/sveltekit';
import '../src/app.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      value: [
        { name: 'dark', value: '#0f172a' },
        { name: 'light', value: '#f8fafc' },
      ],
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