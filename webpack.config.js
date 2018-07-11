var BundleTracker = require('webpack-bundle-tracker');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var CompressionPlugin = require("compression-webpack-plugin");
var resolve = path.resolve.bind(path, __dirname);

var extractCssPlugin;
var fileLoaderPath;
var output;

if (process.env.NODE_ENV === 'production') {
  output = {
    path: resolve('saleor/static/assets/'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: process.env.STATIC_URL || '/static/assets/'
  };
  fileLoaderPath = 'file-loader?name=[name].[hash].[ext]&emitFile=false';
  extractCssPlugin = new MiniCssExtractPlugin({
    filename: '[name].[chunkhash].css',
    chunkFilename: '[id].[chunkhash].css'
  });
} else {
  output = {
    path: resolve('saleor/static/assets/'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/static/assets/'
  };
  fileLoaderPath = 'file-loader?name=[name].[ext]&emitFile=false';
  extractCssPlugin = new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[name].css'
  });
}

var bundleTrackerPlugin = new BundleTracker({
  filename: 'webpack-bundle.json'
});

var providePlugin = new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
  'window.jQuery': 'jquery',
  'Popper': 'popper.js',
  'query-string': 'query-string'
});

var config = {
  entry: {
    dashboard: './saleor/static/dashboard/js/dashboard.js',
    document: './saleor/static/dashboard/js/document.js',
    storefront: './saleor/static/js/storefront.js'
  },
  output: output,
  cache: true,
  target : 'web',
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        use:[
          {
            loader: 'expose-loader',
            options: 'jQuery'
          },
          {
            loader: 'expose-loader',
            options: '$'
          },
          {
            loader: 'expose-loader',
            options: 'window.jQuery'
          },
          ]
      },
      {
        test: require.resolve('popper.js'),
        use:[
          {
            loader: 'expose-loader',
            options: 'Popper'
          }
          ]
      },
      {
        test: require.resolve('query-string'),
        use:[
          {
            loader: 'expose-loader',
            options: 'query-string'
          }
          ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,    //to support @font-face rule
        loader: "url-loader",
        query:{
          limit:'10000',
          name:'[name].[ext]',
          outputPath:'fonts/'
          //the fonts will be emmited to public/assets/fonts/ folder
          //the fonts will be put in the DOM <style> tag as eg. @font-face{ src:url(assets/fonts/font.ttf); }
        }
      },
      {
        test: /\.css$/,
        loader: ["style-loader","css-loader"]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              'sourceMap': true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              'sourceMap': true,
              'plugins': function () {
                return [autoprefixer];
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              'sourceMap': true
            }
          }
        ]
      },
      {
         test: /\.vue$/,
         loader: 'vue-loader'
       },
      {
        test: /\.(ani|cur)$/,
        loader : 'url-loader',
        query: { limit: 100000 }
      },
      {
        test: /\.(otf|png|jpg|gif|woff)(\?v=[0-9.]+)?$/,
        loader: fileLoaderPath,
        include: [
          resolve('node_modules'),
          resolve('saleor/static/fonts'),
          resolve('saleor/static/images'),
          resolve('saleor/static/dashboard/images')
        ] 
      },
      
    ]
  },
  plugins: [
    bundleTrackerPlugin,
    extractCssPlugin,
    providePlugin,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0
    })
  ],
  resolve: {
    alias: {
      'jquery': resolve('node_modules/jquery/dist/jquery.js'),
      'react': resolve('node_modules/react/dist/react.min.js'),
      'react-dom': resolve('node_modules/react-dom/dist/react-dom.min.js'),
      'vue$': resolve('node_modules/vue/dist/vue.esm.js'),
    },
  },
};

module.exports = config;
