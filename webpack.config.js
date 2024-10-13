const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.tsx?$/,
        use:  'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

//   plugins: [
//     new BundleAnalyzerPlugin()
//   ],

  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 8080
  }

};
