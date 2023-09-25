module.exports = (config, properties) => {
  /* config.module.rules.push({
    test: /\.(graphql|gql)$/,
    use: [
      {
        loader: 'graphql-tag/loader',
      },
    ],
  }); */
  config.module.rules.push({
    test: /\.(graphql|gql)$/,
    use: [
      {
        loader: 'webpack-graphql-loader',
      },
    ],
  });

  return config;
};
