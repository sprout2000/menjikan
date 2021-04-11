import path from 'path';
import { Configuration } from 'webpack';
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
    path: path.resolve(__dirname, 'docs'),
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
  plugins: isDev
    ? []
    : [
        new MiniCssExtractPlugin(),
        new WorkboxWebpackPlugin.GenerateSW({
          swDest: 'service-worker.js',
          skipWaiting: true,
          clientsClaim: true,
          inlineWorkboxRuntime: true,
          runtimeCaching: [
            {
              urlPattern: /\.(ico|js|html|png|mp3)$/,
              handler: 'NetworkFirst',
            },
          ],
        }),
      ],
  stats: 'errors-only',
  performance: { hints: false },
  devtool: isDev ? 'inline-source-map' : false,
  devServer: {
    contentBase: path.resolve(__dirname, 'docs'),
    port: 1233,
  },
};

export default config;
