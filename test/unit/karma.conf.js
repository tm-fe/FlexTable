const webpackConfig = require('../../build/webpack.test.config');

module.exports = function(config) {
  const configuration = {
    browsers: ['ChromeHeadless'],
    frameworks: ['mocha', 'sinon-chai'],
    reporters: ['spec'],
    files: ['index.js'],
    preprocessors: {
        'index.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    coverageReporter: {
        dir: './coverage',
        reporters: [
            { type: 'lcov', subdir: '.' }, 
            { type: 'text-summary' }
        ]
    },
    client: {
      mocha: {
        timeout: 4000
      }
    }
  };

  config.set(configuration);
};