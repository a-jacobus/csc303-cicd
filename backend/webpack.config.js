const swcDefaultConfig =
  require('@nestjs/cli/lib/compiler/defaults/swc-defaults').swcDefaultsFactory()
    .swcOptions;
const { WebpackPnpExternals } = require('webpack-pnp-externals');
const path = require('node:path');

module.exports = {
  externals: [WebpackPnpExternals({ exclude: ['webpack/hot/poll?100'] })],
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      '@app/typedorm': path.resolve(__dirname, 'libs/typedorm/src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: swcDefaultConfig,
        },
      },
    ],
  },
};
