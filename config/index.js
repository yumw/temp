'use strict'
// Template version: 1.2.6
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const env = require(`./${process.env.env_config}.env`)

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
       //target: 'http://11.215.108.23:8080',
        target: 'http://10.192.172.86:8080',
        //target: 'http://10.192.172.9:8080',
        // target: 'http://11.113.0.92:8181', // 接口的域名 sit
        // target: 'http://11.114.0.74:8181', // 接口的域名 uat
        // target: 'http://10.126.196.222:8181', // 接口的域名 pre
        // secure: false,  // 如果是https接口，需要配置这个参数
        // changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '^/api': ''
        }
      },
      '/login':{
        // target: 'http://11.113.0.92:8181', // 接口的域名 sit
        target: 'http://11.114.0.74:8181', // 接口的域名 uat
      },
      '/me':{
        // target: 'http://11.113.0.92:8181', // 接口的域名 sit
        target: 'http://11.114.0.74:8181', // 接口的域名 uat
      },
      '/logout':{
        target: 'http://11.113.0.92:8181', // 接口的域名 sit
        // target: 'http://11.114.0.74:8181', // 接口的域名 uat
      }
    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 9528, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: false,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, `${env.outputDirname}/index.html`),

    // Paths
    assetsRoot: path.resolve(__dirname, env.outputDirname),
    assetsSubDirectory: 'static',

    // you can set by youself according to actual condition
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
