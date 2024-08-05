const { createWebpackConfigAsync } = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createWebpackConfigAsync(env, argv);
  
  config.resolve.alias['react-native$'] = 'react-native-web';

  config.module.rules.push({
    test: /\.svg$/,
    use: [
      {
        loader: 'babel-loader',
      },
      {
        loader: 'react-native-svg-loader',
        options: {
          svgo: {
            plugins: [
              { removeTitle: false },
            ],
            floatPrecision: 2,
          },
        },
      },
    ],
  });

  return config;
};
