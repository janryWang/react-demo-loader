"use strict";

var toHAST = require("mdast-util-to-hast");

var detab = require("detab");

var generate = require("nanoid/generate");

var u = require("unist-builder");

var randomName = function randomName() {
  return generate("abcdefghijklmnopqrstuvwxyz", 5);
};

var headingRE = /h\d/;

var compileAttributeValue = function compileAttributeValue(tag, key, value) {
  if (key == "className") {
    var className = Array.isArray(value) ? value.join(" ") : value;
    return JSON.stringify(className);
  }

  return JSON.stringify(value);
};

var compileAttributes = function compileAttributes(tag, props) {
  return Object.keys(props).reduce(function (buf, key) {
    return buf.concat(key + ":" + compileAttributeValue(tag, key, props[key]));
  }, []).join(",");
};

var appendClassName = function appendClassName(tag, props) {
  if (props.className) {
    props.className.push("react-demo-" + tag);
  } else {
    props.className = ["react-demo-" + tag];
  }

  return props;
};

var compileElement = function compileElement(ast) {
  if (ast.type === "element") {
    return "React.createElement(" + (ast.isComponent ? ast.tagName : "\"" + ast.tagName + "\"") + ",{" + compileAttributes(ast.tagName, ast.isComponent ? ast.properties : appendClassName(ast.tagName, ast.properties)) + "}" + (ast.children.length ? "," + ast.children.map(function (node) {
      return compileElement(node);
    }).join(",") : "") + ")";
  } else if (ast.type === "text") {
    return JSON.stringify(ast.value);
  }
};

var toReactSource = function toReactSource(ast) {
  return "\n  var React = require('react')\n  var ReactDOM = require('react-dom')\n  var ReactCodeSnippet = require('react-code-snippet')\n  var __DefineComponent__ = function(fn){\n    var module = {\n      exports:{}\n    }\n    fn(module,exports)\n    var component = module.__esModule && module['default'] || module\n    return typeof component === 'function' ? component : function(){\n      return React.createElement('div',{},'Code snippet should export a component!')\n    }\n  }\n  var __MarkdownComponent__ = function(){\n    return React.createElement(React.Fragment," + ast.children.map(function (node) {
    return compileElement(node);
  }).join(",") + ")\n  }\n  \n  module.exports = __MarkdownComponent__\n\n  \n  ";
};

module.exports = function (options) {
  var index = 0;

  this.Compiler = function (ast) {
    return toReactSource(toHAST(ast, {
      handlers: {
        code: function code(h, node) {
          var value = node.value ? detab(node.value + "\n") : "";
          var lang = node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/);
          var props = {};

          if (lang) {
            props.className = ["language-" + lang];
          }

          var component = "Demo_" + randomName() + "_" + index++;

          var _node = u("element", {
            tagName: "ReactCodeSnippet",
            isComponent: true,
            properties: {
              code: value
            },
            children: [u("element", {
              tagName: component,
              isComponent: true,
              properties: {},
              children: []
            })]
          });

          if (options && options.onCode) {
            options.onCode(component, node.value);
          }

          return _node;
        }
      }
    }));
  };
};