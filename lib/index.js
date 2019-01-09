"use strict";

function _async(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

function _continueIgnored(value) {
  if (value && value.then) {
    return value.then(_empty);
  }
}

function _empty() {}

function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
}

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

var _require = require('loader-utils'),
    getOptions = _require.getOptions;

var transformMarkdown = require('./remark-transformer');

var transformJSCode = require('./js-transformer');

var _require2 = require('@babel/code-frame'),
    codeFrameColumns = _require2.codeFrameColumns;

var chalk = require('chalk');

var createErrorComponent = function createErrorComponent(msg) {
  return "\n  const React = require('react');\n  module.exports = function(){ \n     return React.createElement('pre',{ style: { background: \"#000\",padding:10,color:'red' } },\n        React.createElement('code',{}," + JSON.stringify(msg) + ")\n     )\n  }\n  ";
};

module.exports = function demoLoader(source) {
  var options = getOptions(this) || {};
  var demos = [];
  var callback = this.async();
  transformMarkdown(source, {
    onCode: function onCode(name, source) {
      demos.push({
        name: name,
        source: source
      });
    },
    resourcePath: this.resourcePath
  }).then(_async(function (source) {
    return _continueIgnored(_catch(function () {
      return _await(transformJSCode(source, demos), function (_ref) {
        var map = _ref.map,
            code = _ref.code;
        callback(null, code, map);
      });
    }, function (e) {
      var formatMsg = e.msg;
      if (e.loc && e.source) formatMsg = codeFrameColumns(e.source, {
        start: e.loc
      });
      console.log(chalk.red('React Demo Loader Parse Failed\n'));
      console.log(chalk.red(formatMsg));
      callback(null, createErrorComponent(formatMsg));
    }));
  }));
  return '';
};