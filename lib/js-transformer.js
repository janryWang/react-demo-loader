"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _taggedTemplateLiteralLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteralLoose"));

function _templateObject3() {
  var data = (0, _taggedTemplateLiteralLoose2.default)(["\n      var ", " = __DEFINE__(function(module,exports){\n        ", "\n      })\n    "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

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

function _templateObject2() {
  var data = (0, _taggedTemplateLiteralLoose2.default)(["\n          export default function(){ return ", "}\n          "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteralLoose2.default)(["\n          export default function(){ \n            return ", "\n          }\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var parser = require("@babel/parser");

var template = require("@babel/template").default;

var traverse = require("@babel/traverse").default;

var babel = require("@babel/core");

var get = require("lodash.get");

var babelConf = {
  presets: [[require.resolve("@babel/preset-env"), {
    loose: true
  }], require.resolve("@babel/preset-react")],
  plugins: [[require.resolve("@babel/plugin-proposal-decorators"), {
    legacy: true
  }], require.resolve("@babel/plugin-proposal-class-properties"), require.resolve('@babel/plugin-syntax-dynamic-import')],
  ast: true
};

var getDefaultSpecifierName = function getDefaultSpecifierName(specifiers) {
  return get(specifiers.find(function (node) {
    return node.type === "ImportDefaultSpecifier";
  }), "local.name");
};

var getSpecifierNames = function getSpecifierNames(specifiers) {
  return specifiers.filter(function (node) {
    return node.type === "ImportSpecifier";
  });
};

var transformDemoAst = function transformDemoAst(ast) {
  var ReactDOMDefault = "",
      ReactDOMSpecifiers = [];
  traverse(ast, {
    enter: function enter(path) {
      if (path.parentPath && path.parentPath.isExpressionStatement() && path.isCallExpression()) {
        if (get(path.node, "callee.property.name") === "render" && get(path.node, "callee.object.name") === ReactDOMDefault) {
          var jsx = get(path.node, "arguments[0]");
          path.insertAfter(template.ast(_templateObject(), jsx));
          path.remove();
        } else if (ReactDOMSpecifiers.some(function (spec) {
          return spec.imported.name === "render" && get(path.node, "callee.name") === spec.local.name;
        })) {
          var _jsx = get(path.node, "arguments[0]");

          path.insertAfter(template.ast(_templateObject2(), _jsx));
          path.remove();
        }
      }

      if (path.isImportDeclaration()) {
        if (path.node.source.value === "react-dom") {
          ReactDOMDefault = getDefaultSpecifierName(path.node.specifiers);
          ReactDOMSpecifiers = getSpecifierNames(path.node.specifiers);
        }
      }
    }
  });
  return ast;
};

var parseCode = function parseCode(source) {
  return parser.parse(source, {
    sourceType: "module",
    plugins: ["jsx", "flow", "classProperties", "decorators-legacy", "dynamicImport", "exportDefaultFrom", "exportDefaultFrom", "exportDefaultFrom"]
  });
};

module.exports = _async(function (master, demos) {
  var masterAst = parseCode(master);
  return _await(Promise.all(demos.map(_async(function (_ref) {
    var name = _ref.name,
        source = _ref.source;
    var ast = transformDemoAst(parseCode(source));
    return _await(babel.transformFromAst(ast, "", babelConf).ast, function (demoAst) {
      return template.ast(_templateObject3(), name, demoAst.program.body);
    });
  }))), function (demosAst) {
    traverse(masterAst, {
      enter: function enter(path) {
        if (path.isVariableDeclarator() && get(path.node, "id.name") === "__MARKDOWN__") {
          demosAst.forEach(function (node) {
            path.parentPath.insertBefore(node);
          });
        }
      }
    });
    return _await(babel.transformFromAst(masterAst), function (_ref2) {
      var ast = _ref2.ast,
          code = _ref2.code,
          map = _ref2.map,
          metadata = _ref2.metadata,
          sourceType = _ref2.sourceType;

      if (map && (!map.sourcesContent || !map.sourcesContent.length)) {
        map.sourcesContent = [source];
      }

      return {
        ast: ast,
        code: code,
        map: map,
        metadata: metadata,
        sourceType: sourceType
      };
    });
  });
});