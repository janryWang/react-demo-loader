"use strict";

exports.__esModule = true;
exports.renderTablePropsToFile = void 0;

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

function _awaitIgnored(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(_empty) : Promise.resolve();
  }
}

function _empty() {}

var fs = require("fs-extra");

var ReactPropsTable = require("react-props-table");

var React = require("react");

var docGen = require("react-docgen");

var ReactDOMServer = require("react-dom/server");

var renderTablePropsToFile = _async(function (filePath, componentPath, startOffset, endOffset) {
  return _await(fs.access(filePath), function () {
    return _await(fs.access(componentPath), function () {
      return _await(fs.readFile(componentPath, "utf-8"), function (component) {
        return _await(fs.readFile(filePath, "utf-8"), function (file) {
          var __docgenInfo = docGen.parse(component);

          console.log(__docgenInfo);
          return _awaitIgnored(fs.writeFile(filePath, file.slice(0, startOffset) + "\n" + ReactDOMServer.renderToString(React.createElement(ReactPropsTable, {
            of: {
              __docgenInfo: __docgenInfo
            }
          })) + "\n" + file.slice(endOffset)));
        });
      });
    });
  });
});

exports.renderTablePropsToFile = renderTablePropsToFile;