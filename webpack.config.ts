import path from 'path';
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const isDev = process.env.NODE_ENV === 'development';

const config: Configuration = {
  mode: isDev ? 'development' : 'production',
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  entry: {
    app: './src/main.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '',
    filename: '[name].js',
    assetModuleFilename: 'assets/[name][ext]',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: isDev },
          },
        ],
      },
      {
        test: /\.(mp3|png|woff?2?|eot)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({ patterns: [{ from: 'assets', to: '.' }] }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './src/favicon.ico',
      filename: 'index.html',
      inject: 'body',
      minify: !isDev,
      scriptLoading: 'defer',
    }),
    new WorkboxWebpackPlugin.GenerateSW({
      swDest: 'service-worker.js',
      skipWaiting: true,
      clientsClaim: true,
      inlineWorkboxRuntime: true,
    }),
  ],
  stats: 'errors-only',
  performance: { hints: false },
  devtool: isDev ? 'inline-source-map' : false,
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    port: 1233,
  },
};

export default config;
