"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _require = require('loader-utils'),
    getOptions = _require.getOptions;

var transformer = require('./transformer');

var mergeCode = require('./merge-code');

module.exports = function demoLoader(source) {
  var options = getOptions(this) || {};
  var demos = [];
  var callback = this.async();
  transformer.transform(source, {
    onCode: function onCode(name, source) {
      demos.push({
        name: name,
        source: source
      });
    }
  }).then(
  /*#__PURE__*/
  function () {
    var _ref = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(code) {
      var newCode;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return mergeCode(code, demos);

            case 2:
              newCode = _context.sent;
              callback(null, newCode);

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
};