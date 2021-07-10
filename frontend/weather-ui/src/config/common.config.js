const commonConfig = {
  env: process.env.NEXT_PUBLIC_REACT_APP_ENV,
  cypress: false,
  api: 'http://localhost:4000/graphql',
};

export { commonConfig };
