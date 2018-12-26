/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./test/fixtures/demo.md");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./test/fixtures/demo.md":
/*!*******************************!*\
  !*** ./test/fixtures/demo.md ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var React = __webpack_require__(/*! react */ "react");

var ReactDOM = __webpack_require__(/*! react-dom */ "react-dom");

var ReactCodeSnippet = __webpack_require__(/*! react-code-snippet */ "react-code-snippet");

var __DefineComponent__ = function (fn) {
  var module = {
    exports: {}
  };
  fn(module, exports);
  var component = module.__esModule && module['default'] || module;
  return typeof component === 'function' ? component : function () {
    return React.createElement('div', {}, 'Code snippet should export a component!');
  };
};

var Demo_aeadj_0 = __DefineComponent__(function (module, exports) {
  exports.__esModule = true;
  exports.default = void 0;

  var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

  var _reactDom = _interopRequireDefault(__webpack_require__(/*! react-dom */ "react-dom"));

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var _default = function _default() {
    return _react.default.createElement("div", null, "Hello world\uFF0C\u8FD9\u662F\u4E00\u4E2A\u6587\u6863\u63D2\u4EF6");
  };

  exports.default = _default;
});

var Demo_xeyfk_1 = __DefineComponent__(function (module, exports) {
  exports.__esModule = true;
  exports.default = _default;

  var _react = _interopRequireDefault(__webpack_require__(/*! react */ "react"));

  var _reactDom = __webpack_require__(/*! react-dom */ "react-dom");

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _default() {
    return _react.default.createElement("div", null, "\u8FD9\u662F\u7B2C\u4E8C\u4E2A\u6587\u6863");
  }
});

var __MarkdownComponent__ = function () {
  return React.createElement(React.Fragment, React.createElement("h1", {
    className: "react-demo-h1"
  }, "Hello world"), "\n", React.createElement(ReactCodeSnippet, {
    code: "import React from 'react'\nimport ReactDOM from 'react-dom'\n\nexport default ()=><div>Hello world，这是一个文档插件</div>\n",
    className: "react-demo-ReactCodeSnippet"
  }, React.createElement(Demo_aeadj_0, {
    className: "react-demo-Demo_aeadj_0"
  })), "\n", React.createElement("p", {
    className: "react-demo-p"
  }, "这是一个文档，它可以完全转换为js代码"), "\n", React.createElement(ReactCodeSnippet, {
    code: "import React from 'react'\nimport {render as renderDOM} from 'react-dom'\n\nrenderDOM(<div>这是第二个文档</div>, mountNode)\n",
    className: "react-demo-ReactCodeSnippet"
  }, React.createElement(Demo_xeyfk_1, {
    className: "react-demo-Demo_xeyfk_1"
  })));
};

module.exports = __MarkdownComponent__;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = react;

/***/ }),

/***/ "react-code-snippet":
/*!*************************************!*\
  !*** external "react-code-snippet" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = react-code-snippet;

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = react-dom;

/***/ })

/******/ });
//# sourceMappingURL=demo.js.map