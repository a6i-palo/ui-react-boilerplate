const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
const CLASS_HASH_STRATEGY = '[name]__[local]___[hash:base64:5]';
const PATH_TO_COMPONENTS = path.join(process.cwd(), './components');
const PATH_TO_REACT_ENTRY = path.join(process.cwd(), './index.js');
const PATH_TO_STYLESHEETS = path.join(process.cwd(), './components/StyleSheets');

const entry = [
  '@babel/polyfill',
  'cross-fetch/polyfill',
  ...(isDev ? ['react-hot-loader/patch'] : []),
  PATH_TO_REACT_ENTRY,
];

const rules = [
  // Fix for Apollo build errors when building with Webpack 4 copied from UI-Employer
  // apollo is exporting mjs which are handled by Webpack and causes a lot of error
  // temporary fix should be removed ASAP because we shouldnt need this
  {
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto',
  },
  {
    test: /\.(j|t)sx?$/,
    loader: 'babel-loader',
    include: path.resolve('./'),
    exclude: [
      (modulePath) => {
        return (
          // Look for both / and \ as a possible path separator so this works cross-platform
          /(\/|\\)node_modules(\/|\\)/.test(modulePath) &&
          !/(\/|\\)node_modules(\/|\\)@govtechsg(\/|\\)redux-account-middleware/.test(modulePath)
        );
      },
    ],
  },
  {
    test: /\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
        },
      },
    ],
    exclude: /offline-js/,
  },
  {
    test: /\.scss$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
        },
      },
      'postcss-loader',
    ],
    include: [PATH_TO_STYLESHEETS],
  },
  {
    test: /\.scss$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          camelCase: true,
          importLoaders: 1,
          localIdentName: CLASS_HASH_STRATEGY,
          modules: true,
        },
      },
      'sass-loader',
      'postcss-loader',
    ],
    exclude: [PATH_TO_STYLESHEETS],
    include: [PATH_TO_COMPONENTS],
  },
  {
    test: /\.(png|jpg|jpeg|gif|svg|eot|woff|woff2|ttf)$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: '[name]-[hash].[ext]',
      outputPath: 'images',
    },
  },
  {
    test: /\.(graphql|gql)$/,
    loader: 'graphql-tag/loader',
    exclude: /node_modules/,
  },
];

const output = {
  filename: `[name].[hash:7].js`,
  publicPath: '/',
};
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const config = require('./config');

let plugins = [];

const basePlugins = [
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
  new webpack.DefinePlugin(config.env),
  new webpack.NamedModulesPlugin(),
  new CopyWebpackPlugin([
    {from: 'node_modules/offline-js/themes/offline-theme-hubspot.css', to: 'css/'},
    {from: 'node_modules/offline-js/themes/offline-language-english.css', to: 'css/'},
    {from: 'node_modules/offline-js/offline.min.js', to: 'js/'},
    'static',
  ]),
  new HtmlWebpackPlugin({
    template: './components/HTML/index.html',
    templateParameters: config.meta,
  }),
  new HtmlWebpackIncludeAssetsPlugin({
    assets: ['css/offline-theme-hubspot.css', 'css/offline-language-english.css', 'js/offline.min.js'],
    append: false,
    hash: true,
  }),
];

// These plugins aren't applicable when running in Cypress
// And in the case of brotli which use native bindings, will error when required probably due to V8 version mismatches between electron and node
// This is annoying to configure correctly and since they aren't applicable, its easier to just conditionally load them
if (!process.env.CYPRESS_ENV) {
  if (isDev) {
    const devPlugins = [new webpack.HotModuleReplacementPlugin()];
    plugins = basePlugins.concat(devPlugins);
  } else {
    const CompressionPlugin = require('compression-webpack-plugin');
    const BrotliPlugin = require('brotli-webpack-plugin');
    const zopfli = require('@gfx/zopfli');

    const productionPlugins = [
      new CompressionPlugin({
        filename: '[path].gz[query]',
        test: /\.(js|css|html|svg)$/,
        compressionOptions: {
          numiterations: 15,
        },
        algorithm(input, compressionOptions, callback) {
          return zopfli.gzip(input, compressionOptions, callback);
        },
      }),
      new BrotliPlugin({
        asset: '[path].br[query]',
        test: /\.(js|css|html|svg)$/,
      }),
    ];
    plugins = basePlugins.concat(productionPlugins);
  }
} else {
  plugins = basePlugins;
}

const splitChunksConfig = {
  cacheGroups: {
    vendors: {
      test: /(\/|\\)node_modules(\/|\\)/,
      filename: 'vendor.[hash:7].js',
      name: 'vendor',
      chunks: 'all',
    },
  },
};

const optimization = {
  // Disable code splitting if running in Cypress, as it can't find tests if code splitting is on
  // See https://github.com/cypress-io/cypress-webpack-preprocessor/issues/31
  splitChunks: !process.env.CYPRESS_ENV ? splitChunksConfig : undefined,
};

const devServer = {
  contentBase: './',
  historyApiFallback: true,
  clientLogLevel: 'warning',
  disableHostCheck: true,
  port: 3000,
  hot: true,
  inline: true, // required for hot reload
};

const root = path.resolve('.');

const hotLoaderReactDom = isDev
  ? {
      'react-dom': '@hot-loader/react-dom',
    }
  : {};

module.exports = {
  mode: 'development', // override with --mode production
  entry,
  devtool: isDev ? 'cheap-eval-source-map' : false, // switch to inline-source-map to debug
  module: {
    rules,
  },
  output,
  optimization,
  plugins,
  devServer,
  resolve: {
    // Remember to also update tsconfig.json when changing this
    alias: Object.assign(
      {
        '~': root,
      },
      hotLoaderReactDom,
    ),
    extensions: ['.mjs', '.tsx', '.ts', '.js'],
  },
};
