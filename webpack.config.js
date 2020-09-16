'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const webpack = require('webpack');
const extension = require('./extension');
const camelCase = require('camelcase');
const capitalize = require('capitalize');
const createEntryFile = require('./createEntryFile');

const entries = {};
const plugins = [];

module.exports = env => {
  // Each view becomes its own "app". These are automatically generated based on naming convention.
  ['event', 'condition', 'action', 'dataElement', 'configuration'].forEach(
    type => {
      const typePluralized = type + 's';
      const delegates =
        type === 'configuration'
          ? [extension['configuration']]
          : extension[typePluralized];

      delegates.forEach(itemDescriptor => {
        let itemNameCapitalized;
        let chunkName;

        if (itemDescriptor && itemDescriptor.viewPath) {
          if (type === 'configuration') {
            itemNameCapitalized = 'Configuration';
            chunkName = 'configuration/configuration';
          } else {
            const itemName = itemDescriptor.name;
            const itemNameCamelized = camelCase(itemName);
            itemNameCapitalized = capitalize(itemNameCamelized);
            chunkName = `${typePluralized}/${itemNameCamelized}`;
          }

          const entryPath = `./.entries/${chunkName}.js`;
          createEntryFile(entryPath, itemNameCapitalized, chunkName);
          entries[chunkName] = entryPath;

          plugins.push(
            new HtmlWebpackPlugin({
              title: itemDescriptor.displayName,
              filename: `${chunkName}.html`,
              template: 'src/view/template.html',
              chunks: ['common', chunkName],
              react_dev_hook:
                env === 'sandbox'
                  ? '<script> try { __REACT_DEVTOOLS_GLOBAL_HOOK__ = parent.__REACT_DEVTOOLS_GLOBAL_HOOK__ } catch(error) {}</script>'
                  : ''
            })
          );
        }
      });
    }
  );

  plugins.push(
    new webpack.DefinePlugin({
      'process.env.SCALE_MEDIUM': 'true',
      'process.env.SCALE_LARGE': 'false',
      'process.env.THEME_LIGHT': 'false',
      'process.env.THEME_LIGHTEST': 'true',
      'process.env.THEME_DARK': 'false',
      'process.env.THEME_DARKEST': 'false'
    })
  );

  if (env === 'sandbox') {
    // This allows us to run the sandbox after the initial build takes place. By not starting up the
    // sandbox while simultaneously building the view, we ensure:
    // (1) Whatever we see in the browser contains the latest view files.
    // (2) The sandbox can validate our extension.json and find that the view files it references
    // actually exist because they have already been built.
    plugins.push(
      new WebpackShellPlugin({
        onBuildEnd: ['./node_modules/.bin/reactor-sandbox']
      })
    );
  }

  return {
    optimization: {
      runtimeChunk: false,
      splitChunks: {
        cacheGroups: {
          default: false,
          commons: {
            name: 'common',
            chunks: 'all',
            minChunks: Math.round(Object.keys(entries).length / 4)
          }
        }
      }
    },
    entry: entries,
    plugins: plugins,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      chunkFilename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: /src\/view/,
          exclude: /__tests__/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/react', '@babel/env'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        },
        {
          test: /\.js$/,
          include: /\.entries/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env']
          }
        },
        {
          test: /\.styl/,
          include: /src\/view/,
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1
              }
            },
            require.resolve('stylus-loader')
          ]
        },
        {
          test: /\.css/,
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1
              }
            }
          ]
        },
        {
          test: /\.(jpe?g|png|gif)$/,
          loader: 'file-loader'
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    }
  };
};
