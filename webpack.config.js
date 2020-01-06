const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); //installed via npm
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      { test: /\.hbs$/,
        loader: "handlebars-loader",
        options: {
          // Path to your custom js file, which has Handlebars with custom helpers registered
          runtime: path.join(__dirname, 'hbs.js'),
          precompileOptions: {
            knownHelpersOnly: false,
          },
          attrs: ['img:src']
        }
      },
      {
        test: /\.s[ac]ss$/i,

        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      {
        test: /\.html$/,

        use: [
          {
            loader: "html-loader",
            options: {
              attrs: ['img:src']
            },
          }
        ]
      },
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({ template: "./public/index.hbs" }),
    new MiniCssExtractPlugin({
      filename: "bundle.css"
    })
  ]
};
