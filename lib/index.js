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

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

var _require = require("loader-utils"),
    getOptions = _require.getOptions;

var transformMarkdown = require("./remark-transformer");

var transformJSCode = require("./js-transformer");

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
    return _await(transformJSCode(source, demos), function (_ref) {
      var map = _ref.map,
          code = _ref.code;
      callback(null, code, map);
    });
  }));
  return "";
};