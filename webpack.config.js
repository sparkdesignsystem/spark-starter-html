const path = require('path');
const HandlebarsPlugin = require('handlebars-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');
const request = require('request');
const helpers = require('handlebars-helpers')();

const loadIcons = (cb) => {
  const fileStream = fs.createWriteStream(
    './src/pages/partials/sparkIcons.hbs',
  );
  request
    .get({
      uri:
        'https://www.rockomni.com/mcds/assets/GlobalContent/NonStockImages/Icons/spark-icons-v14.svg',
      rejectUnauthorized: false,
    })
    .on('error', (error) => {
      console.error(error);
    })
    .pipe(fileStream)
    .on('finish', cb);
};

loadIcons(() => {
  console.log('done fetching icons');
});

module.exports = {
  mode: 'production',
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
