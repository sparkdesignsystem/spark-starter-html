const path = require('path');
const HandlebarsPlugin = require('handlebars-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const helpers = require('handlebars-helpers')();

module.exports = {
  mode: 'development',
  entry: {
    js: './src/js/main.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    }),
    new HandlebarsPlugin({
      entry: path.join(process.cwd(), 'src/pages', '*.html'),
      output: path.join(process.cwd(), 'dist', '[name].html'),
      partials: [path.join(process.cwd(), 'src', 'pages', 'partials', '*.hbs')],
      helpers,
    }),
  ],
};
