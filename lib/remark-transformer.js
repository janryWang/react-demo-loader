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

/**
 *
 * 代码转换器，将MD文档转换成jsx
 *
 */
var unified = require("unified");

var markdown = require("remark-parse");

var matter = require("remark-frontmatter");

var parseFormatter = require("remark-parse-yaml");

var slug = require("remark-slug");

var md2react = require("./remark-react");

module.exports = _async(function (code, options) {
  return _await(unified().use(markdown, {
    type: "yaml",
    marker: "-"
  }).use(matter).use(parseFormatter).use(slug).use(md2react, options).process(code), function (parsed) {
    return parsed.contents;
  });
});