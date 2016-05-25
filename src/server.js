const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const winston = require('winston');

const options = { logger: winston };
const config = require('../config');
const api = require('./server/api')(options);

const port = config.port;

function makeApp() {
  if (process.env.BABEL_ENV === 'hot') {
    // Set up webpack dev server.
    const webpack = require('webpack');
    const WebpackDevServer = require('webpack-dev-server');
    const webpackConfig = require('../webpack.config');
    webpackConfig.entry.unshift(
      `webpack-dev-server/client?http://localhost:${port}/`,
      'webpack/hot/dev-server');
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    const webpackCompiler = webpack(webpackConfig);
    return new WebpackDevServer(webpackCompiler, {
      contentBase: 'public',
      hot: true,
      publicPath: webpackConfig.output.publicPath,
      stats: {
        hash: true,
        version: true,
        timings: true,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: true,
        errorDetails: true,
        warnings: true,
        publicPath: true,
        colors: true
      }
    });
  }

  const app = express();
  app.use(morgan('combined'));
  app.use('/', express.static('public'));
  app.use(config.basePath, express.static('public'));
  app.use(`${config.basePath}/generated`, express.static('generated'));
  return app;
}

if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
  throw new Error('Use the right values in config.soap.serverCA instead of disabling TLS cert validation!');
}

const app = makeApp();
app.use(bodyParser.json());
app.use(`${config.apiRoot}/application`, api);

app.listen(port);
