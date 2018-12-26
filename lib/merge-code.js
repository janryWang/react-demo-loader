"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _taggedTemplateLiteralLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteralLoose"));

function _templateObject3() {
  var data = (0, _taggedTemplateLiteralLoose2.default)(["\n      var ", " = __DefineComponent__(function(module,exports){\n        ", "\n      })\n    "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
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
  presets: [["@babel/preset-env", {
    loose: true
  }], "@babel/preset-react"],
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
    plugins: ["jsx", "flow"]
  });
};

module.exports =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(master, demos) {
    var masterAst, demosAst, _ref3, code;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            masterAst = parseCode(master);
            demosAst = demos.map(function (_ref2) {
              var name = _ref2.name,
                  source = _ref2.source;
              var ast = transformDemoAst(parseCode(source));
              var demoAst = babel.transformFromAstSync(ast, "", babelConf).ast;
              return template.ast(_templateObject3(), name, demoAst.program.body);
            });
            traverse(masterAst, {
              enter: function enter(path) {
                if (path.isVariableDeclarator() && get(path.node, "id.name") === "__MarkdownComponent__") {
                  demosAst.forEach(function (node) {
                    path.parentPath.insertBefore(node);
                  });
                }
              }
            });
            _context.next = 5;
            return babel.transformFromAst(masterAst);

          case 5:
            _ref3 = _context.sent;
            code = _ref3.code;
            return _context.abrupt("return", code);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();