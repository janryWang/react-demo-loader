"use strict";

var toHAST = require("mdast-util-to-hast");

var detab = require("detab");

var path = require("path");

var fs = require("fs-extra");

var generate = require("nanoid/generate");

var commentMaker = require("mdast-comment-marker");

var u = require("unist-builder");

var transfromHTMLAST = require("./html-transformer");

var randomName = function randomName() {
  return generate("abcdefghijklmnopqrstuvwxyz", 5);
};

var _require = require("./utils"),
    renderTablePropsToFile = _require.renderTablePropsToFile;

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

var createMacroElement = function createMacroElement(node, opts) {
  if (node.value[1] === "COMPONENT_PROPS" && node.value[2]) {
    node.position.after && renderTablePropsToFile(opts.resourcePath, path.resolve(path.dirname(opts.resourcePath), node.value[2]), node.position.end.offset, node.position.after.start.offset);
    return "\n    React.createElement(ReactPropsTable,{\n      of:require(\"" + node.value[2] + "\")\n    }" + (node.children.length ? "," + node.children.reduce(function (buf, node) {
      var compiled = compileElement(node);
      return compiled ? buf.concat(compiled) : buf;
    }, []).join(",") : "") + ")\n    ";
  }

  return "";
};

var compileElement = function compileElement(ast, opts) {
  if (ast.type === "element") {
    return "React.createElement(" + (ast.isComponent ? ast.tagName : "\"" + ast.tagName + "\"") + ",{" + compileAttributes(ast.tagName, ast.isComponent ? ast.properties : appendClassName(ast.tagName, ast.properties), opts) + "}" + (ast.children.length ? "," + ast.children.reduce(function (buf, node) {
      var compiled = compileElement(node, opts);
      return compiled ? buf.concat(compiled) : buf;
    }, []).join(",") : "") + ")";
  } else if (ast.type === "text") {
    return wsRE.test(ast.value) ? "" : JSON.stringify(ast.value);
  } else if (ast.type === "comment") {
    return;
  } else if (ast.type === "macro") {
    return createMacroElement(ast, opts);
  } else {
    return "React.createElement(\"div\",{dangerouslySetInnerHTML:{__html:" + JSON.stringify(ast.value) + "}})";
  }
};

var toReactSource = function toReactSource(ast, yaml, opts) {
  return "\n  var React = require('react')\n  var ReactDOM = require('react-dom')\n  var ReactCodeSnippet = require('react-code-snippet')\n  var ReactPropsTable = require('react-props-table')\n  var __DEFINE__ = function(fn){\n    var module = {\n      exports:{}\n    }\n    fn(module,module.exports)\n    var component = module.exports.__esModule && module.exports['default'] || module.exports\n    return typeof component === 'function' ? component : function(){\n      return React.createElement('div',{},'Code snippet should export a component!')\n    }\n  }\n  var __MARKDOWN__ = function(){\n    return React.createElement(\n      React.Fragment,\n      {},\n      " + ast.children.reduce(function (buf, node) {
    var compiled = compileElement(node, opts);
    return compiled ? buf.concat(compiled) : buf;
  }, []).join(",") + "\n    )\n  }\n  __MARKDOWN__.meta = " + JSON.stringify(yaml) + "\n  module.exports = __MARKDOWN__\n  ";
};

module.exports = function (options) {
  var identify_index = 0;

  this.Compiler = function (ast) {
    var _yaml = {};
    var newAst = toHAST(ast, {
      allowDangerousHTML: true,
      handlers: {
        yaml: function yaml(h, node) {
          _yaml = node.data.parsedValue;
        },
        html: function html(h, node) {
          return transfromHTMLAST(h, node);
        },
        code: function code(h, node) {
          var value = node.value ? detab(node.value + "\n") : "";
          var lang = node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/);
          var props = {};

          if (lang) {
            lang = lang[0];
            props.className = ["language-" + lang];
          }

          var component = "Demo_" + randomName() + "_" + identify_index++;
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
        },
        block_comment: function block_comment(h, node) {
          console.log(node);
        }
      }
    });
    return toReactSource(newAst, _yaml, options);
  };
};