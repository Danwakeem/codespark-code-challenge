const CONFIG_ENV = process.env.NEXT_PUBLIC_REACT_APP_ENV;

const cypressConfig = {
  env: CONFIG_ENV,
  cypress: true,
};

export { cypressConfig };
