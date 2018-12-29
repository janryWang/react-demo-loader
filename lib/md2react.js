"use strict";

var toHAST = require("mdast-util-to-hast");

var detab = require("detab");

var generate = require("nanoid/generate");

var u = require("unist-builder");

var randomName = function randomName() {
  return generate("abcdefghijklmnopqrstuvwxyz", 5);
};

var headingRE = /h\d/;
var wsRE = /^\s*$/;

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
    return "React.createElement(" + (ast.isComponent ? ast.tagName : "\"" + ast.tagName + "\"") + ",{" + compileAttributes(ast.tagName, ast.isComponent ? ast.properties : appendClassName(ast.tagName, ast.properties)) + "}" + (ast.children.length ? "," + ast.children.reduce(function (buf, node) {
      var compiled = compileElement(node);
      return compiled ? buf.concat(compiled) : buf;
    }, []).join(",") : "") + ")";
  } else if (ast.type === "text") {
    return wsRE.test(ast.value) ? "" : JSON.stringify(ast.value);
  } else {
    return "React.createElement(\"div\",{dangerouslySetInnerHTML:{__html:" + JSON.stringify(ast.value) + "}})";
  }
};

var toReactSource = function toReactSource(ast, yaml) {
  return "\n  var React = require('react')\n  var ReactDOM = require('react-dom')\n  var ReactCodeSnippet = require('react-code-snippet')\n  var __DEFINE__ = function(fn){\n    var module = {\n      exports:{}\n    }\n    fn(module,module.exports)\n    var component = module.exports.__esModule && module.exports['default'] || module.exports\n    return typeof component === 'function' ? component : function(){\n      return React.createElement('div',{},'Code snippet should export a component!')\n    }\n  }\n  var __MARKDOWN__ = function(){\n    return React.createElement(\n      React.Fragment,\n      {},\n      " + ast.children.reduce(function (buf, node) {
    var compiled = compileElement(node);
    return compiled ? buf.concat(compiled) : buf;
  }, []).join(",") + "\n    )\n  }\n  __MARKDOWN__.meta = " + JSON.stringify(yaml) + "\n  module.exports = __MARKDOWN__\n  ";
};

module.exports = function (options) {
  var index = 0;

  this.Compiler = function (ast) {
    var _yaml = {};
    var newAst = toHAST(ast, {
      allowDangerousHTML: true,
      handlers: {
        yaml: function yaml(h, node) {
          _yaml = node.data.parsedValue;
        },
        code: function code(h, node) {
          var value = node.value ? detab(node.value + "\n") : "";
          var lang = node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/);
          var props = {};

          if (lang) {
            lang = lang[0];
            props.className = ["language-" + lang];
          }

          var component = "Demo_" + randomName() + "_" + index++;
          var isNotJsx = lang && lang !== "jsx" || !lang;

          var _node = u("element", {
            tagName: "ReactCodeSnippet",
            isComponent: true,
            properties: {
              code: value,
              justCode: isNotJsx,
              lang: lang
            },
            children: !isNotJsx ? [u("element", {
              tagName: component,
              isComponent: true,
              properties: {},
              children: []
            })] : []
          });

          if (!isNotJsx && options && options.onCode) {
            options.onCode(component, node.value);
          }

          return _node;
        }
      }
    });
    return toReactSource(newAst, _yaml);
  };
};