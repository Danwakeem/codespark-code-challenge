import { commonConfig } from './common.config';
import { devConfig } from './dev.config';
import { cypressConfig } from './cypress.config';

const configs = {
  dev: devConfig,
  cypress: cypressConfig,
};

const getConfigForEnvironment = (environment) => {
  const currentConfig = configs[environment];

  if (!currentConfig) {
    throw new Error('Could not find config file');
  }

  const config = { ...commonConfig, ...currentConfig };

  return config;
};

export { getConfigForEnvironment };
