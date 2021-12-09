const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const fs = require('fs');

function generateHtmlTemplate(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map((item) => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
    });
  });
}

const htmlPlugins = generateHtmlTemplate('./src/view');

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `js/app.min.js?v=${Date.now()}`,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      // {
      //   test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
      //   loader: 'url-loader?limit=100000'
      // },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: `css/style.min.css?v=${Date.now()}`,
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     // {
    //     //   from: 'src/images/',
    //     //   to: 'images/',
    //     // },
    //     // {
    //     //   from: "src/fonts/",
    //     //   to: "fonts/"
    //     // }
    //   ],
    // }),
  ].concat(htmlPlugins),
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8000,
  },
  optimization: {
    minimize: true,
  },
};
