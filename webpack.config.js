const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
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
      },
      {
        test: /\.s[ac]ss$/i,

        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({ template: "./public/index.hbs" }),
    new MiniCssExtractPlugin({
      filename: "bundle.css"
    })
  ]
};
