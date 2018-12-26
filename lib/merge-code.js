"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _taggedTemplateLiteralLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteralLoose"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteralLoose2.default)(["\n      var ", " = __DefineComponent__(function(module,exports){\n        ", "\n      })\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var parser = require('@babel/parser');

var template = require('@babel/template').default;

var traverse = require('@babel/traverse').default;

var babel = require('@babel/core');

var get = require('lodash.get');

var babelConf = {
  presets: [['@babel/preset-env', {
    loose: true
  }], '@babel/preset-react'],
  ast: true
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
            masterAst = parser.parse(master, {
              sourceType: 'module',
              plugins: ['jsx', 'flow']
            });
            demosAst = demos.map(function (_ref2) {
              var name = _ref2.name,
                  source = _ref2.source;
              return template.ast(_templateObject(), name, get(babel.transformSync(source, babelConf), 'ast.program.body'));
            });
            traverse(masterAst, {
              enter: function enter(path) {
                if (path.isVariableDeclarator() && get(path.node, 'id.name') === '__MarkdownComponent__') {
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