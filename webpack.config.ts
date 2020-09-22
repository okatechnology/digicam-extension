import path from 'path';
import { Configuration } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

export default (): Configuration => ({
  optimization: {
    minimizer: [new TerserPlugin({})],
  },
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'script.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
      },
      {
        test: /\.png$/i,
        use: [{ loader: 'file-loader', options: { name: '[name].png' } }],
      },
      {
        test: /\/custom\.css/i,
        use: [{ loader: 'file-loader', options: { name: 'custom.css' } }],
      },
      {
        test: /\/manifest\.json/i,
        use: [{ loader: 'file-loader', options: { name: 'manifest.json' } }],
        type: 'javascript/auto',
      },
      {
        test: /\/background\.ts/i,
        use: [
          {
            loader: 'file-loader',
            options: { name: 'background.js' },
          },
          {
            loader: 'ts-loader',
            options: { transpileOnly: true },
          },
        ],
        type: 'javascript/auto',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
});
