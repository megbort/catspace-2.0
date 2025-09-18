import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  staticDirs: [
    { from: '../src/assets/i18n', to: '/i18n' },
    { from: '../src/assets/images', to: '/images' },
  ],
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@chromatic-com/storybook',
    '@storybook/addon-docs'
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};

export default config;
