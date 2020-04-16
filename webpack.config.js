const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
const htmlPlugin = new HtmlWebPackPlugin({
  template: "./public/template.html",
  filename: "./index.html",
});
module.exports = {
  entry: "./public/index.js",
  output: {
    // NEW
    path: path.join(__dirname, "public"),
    filename: "[name].js",
  }, // NEW Ends
  plugins: [htmlPlugin],
  module: {
    rules: [
      {
        test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=100000",
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};
