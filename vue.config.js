const webpack = require('webpack');
const path = require('path');

const devServerPort = 9527;
const title = '应用管理系统';

module.exports = {
  publicPath: process.env.VUE_APP_BASE_URL,
  productionSourceMap: false,

  outputDir: path.resolve(__dirname, '/') + process.env.VUE_APP_BASE_URL,

  devServer: {
    port: devServerPort,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    progress: false
  },
  assetsDir: './src/assets',

  configureWebpack: {
    performance: {
      hints: 'warning',
      maxEntrypointSize: 60000000,
      maxAssetSize: 40000000,
      assetFilter: function(assetFilename) {
        return assetFilename.endsWith('.js');
      }
    },
    resolve: {
      alias: {
        '@primary': path.resolve(__dirname, './src')
      }
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: []
    }
  },

  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  },

  chainWebpack(config) {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.set('name', title);

    // https://webpack.js.org/configuration/devtool/#development
    config.when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-eval-source-map'));

    // remove vue-cli-service's progress output
    config.plugins.delete('progress');
    // replace with another progress output plugin to solve the this bug:
    // https://github.com/vuejs/vue-cli/issues/4557
    config.plugin('simple-progress-webpack-plugin').use(require.resolve('simple-progress-webpack-plugin'), [
      {
        format: 'compact'
      }
    ]);

    config.when(process.env.NODE_ENV !== 'development', config => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          }
        }
      });
      config.optimization.runtimeChunk('single');
    });
  }
};
