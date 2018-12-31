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

/***/ "./test/fixtures/Button.js":
/*!*********************************!*\
  !*** ./test/fixtures/Button.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Button = function Button() {
  return React.createElement("button", null, "This is Button");
};

Button.propTypes = {
  /**
    Label for the button.
  */
  label: React.PropTypes.string,

  /**
    Triggered when clicked on the button.
  */
  onClick: React.PropTypes.func
};
/* harmony default export */ __webpack_exports__["default"] = (Button);
Button.__docgenInfo = {
  "description": "",
  "methods": [],
  "displayName": "Button",
  "props": {
    "label": {
      "type": {
        "name": "custom",
        "raw": "React.PropTypes.string"
      },
      "required": false,
      "description": "Label for the button."
    },
    "onClick": {
      "type": {
        "name": "custom",
        "raw": "React.PropTypes.func"
      },
      "required": false,
      "description": "Triggered when clicked on the button."
    }
  }
};

/***/ }),

/***/ "./test/fixtures/demo.md":
/*!*******************************!*\
  !*** ./test/fixtures/demo.md ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var React = __webpack_require__(/*! react */ "react");

var ReactDOM = __webpack_require__(/*! react-dom */ "react-dom");

var ReactCodeSnippet = __webpack_require__(/*! react-code-snippet */ "react-code-snippet");

var ReactPropsTable = __webpack_require__(/*! react-props-table */ "react-props-table");

var __DEFINE__ = function (fn) {
  var module = {
    exports: {}
  };
  fn(module, module.exports);
  var component = module.exports.__esModule && module.exports['default'] || module.exports;
  return typeof component === 'function' ? component : function () {
    return React.createElement('div', {}, 'Code snippet should export a component!');
  };
};

var Demo_pqrar_2 = __DEFINE__(function (module, exports) {
  ReactDOM.render(React.createElement("div", null, "Hello world"));
});

var Demo_jyavb_3 = __DEFINE__(function (module, exports) {
  ReactDOM.render(React.createElement("div", null, "Hello world123"));
});

var __MARKDOWN__ = function () {
  return React.createElement(React.Fragment, {}, React.createElement("h1", {
    id: "clean-node-modules",
    className: "react-demo-h1"
  }, "Clean Node Modules"), React.createElement("h3", {
    id: "install",
    className: "react-demo-h3"
  }, "Install"), React.createElement(ReactCodeSnippet, {
    code: "npm install -g serve-demo\n",
    justCode: true,
    lang: "bash"
  }), React.createElement("h3", {
    id: "usage",
    className: "react-demo-h3"
  }, "Usage"), React.createElement(ReactCodeSnippet, {
    code: "serve-demo ~\n",
    justCode: true,
    lang: "bash"
  }), React.createElement(ReactCodeSnippet, {
    code: "ReactDOM.render(<div>Hello world</div>)\n",
    justCode: false,
    lang: "jsx"
  }, React.createElement(Demo_pqrar_2, {})), React.createElement(ReactCodeSnippet, {
    code: "ReactDOM.render(<div>Hello world123</div>)\n",
    justCode: false,
    lang: "jsx"
  }, React.createElement(Demo_jyavb_3, {})), React.createElement("div", {
    className: "react-demo-div"
  }, React.createElement("div", {
    className: "asdad react-demo-div"
  }, React.createElement("div", {
    className: "react-demo-div"
  }), React.createElement(ReactPropsTable, {
    of: __webpack_require__(/*! ./Button.js */ "./test/fixtures/Button.js")
  }, React.createElement("table", {
    className: "PropsTable react-demo-table"
  }), React.createElement("thead", {
    className: "react-demo-thead"
  }), React.createElement("tr", {
    className: "react-demo-tr"
  }), React.createElement("th", {
    className: "PropsTable--property react-demo-th"
  }), "Property", React.createElement("th", {
    className: "PropsTable--type react-demo-th"
  }), "Type", React.createElement("th", {
    className: "PropsTable--required react-demo-th"
  }), "Required", React.createElement("th", {
    className: "PropsTable--default react-demo-th"
  }), "Default", React.createElement("th", {
    width: "40%",
    className: "PropsTable--description react-demo-th"
  }), "Description", React.createElement("tbody", {
    className: "react-demo-tbody"
  }), React.createElement("tr", {
    className: "react-demo-tr"
  }), React.createElement("td", {
    className: "react-demo-td"
  }), "label", React.createElement("td", {
    className: "react-demo-td"
  }), "Custom", React.createElement("td", {
    className: "react-demo-td"
  }), "false", React.createElement("td", {
    className: "react-demo-td"
  }), React.createElement("em", {
    className: "react-demo-em"
  }), "-", React.createElement("td", {
    className: "react-demo-td"
  }), "Label for the button.", React.createElement("tr", {
    className: "react-demo-tr"
  }), React.createElement("td", {
    className: "react-demo-td"
  }), "onClick", React.createElement("td", {
    className: "react-demo-td"
  }), "Custom", React.createElement("td", {
    className: "react-demo-td"
  }), "false", React.createElement("td", {
    className: "react-demo-td"
  }), React.createElement("em", {
    className: "react-demo-em"
  }), "-", React.createElement("td", {
    className: "react-demo-td"
  }), "Triggered when clicked on the button."))));
};

__MARKDOWN__.meta = {
  "metadata": "this is metadata",
  "tags": ["one", "two"]
};
module.exports = __MARKDOWN__;

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

/***/ }),

/***/ "react-props-table":
/*!************************************!*\
  !*** external "react-props-table" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = react-props-table;

/***/ })

/******/ });
//# sourceMappingURL=demo.js.map