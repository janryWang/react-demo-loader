"use strict";

var parse5 = require("parse5");

var fromParse5 = require("hast-util-from-parse5");

var toArr = function toArr(val) {
  return Array.isArray(val) ? val : val ? [val] : [];
};

var createPath = function createPath(node, index, parentPath) {
  return {
    node: node,

    get index() {
      if (this.parentPath) {
        return this.parentPath.node.children.findIndex(function (child) {
          return child === node;
        });
      }

      return index;
    },

    parentPath: parentPath,
    insertAfter: function insertAfter(target) {
      if (this.parentPath) {
        this.parentPath.node.children.splice(this.index + 1, 0, target.node);
        target.remove();
        target.parentPath = this.parentPath;
      }
    },
    insertBefore: function insertBefore(target) {
      if (this.parentPath) {
        this.parentPath.node.children.splice(this.index, 0, target.node);
        target.remove();
        target.parentPath = this.parentPath;
      }
    },
    remove: function remove() {
      if (this.parentPath) {
        var _index = this.index;
        this.parentPath.node.children.splice(_index, 1);
      }
    },
    append: function append(target) {
      target.remove();
      this.node.children.push(target.node);
      target.parentPath = this;
    }
  };
};

var traverse = function traverse(node, callback) {
  var visitor = function visitor(node, index, parentPath) {
    var path = createPath(node, index, parentPath);
    if (node) callback(path);

    if (node && node.children) {
      ;
      [].concat(node.children).forEach(function (child, index) {
        visitor(child, index, path);
      });
    }
  };

  return visitor(node, 0);
};

var updatePostion = function updatePostion(origin, target, root) {
  if (target.position && origin.position) {
    target.position.start.line += origin.position.start.line - 1;
    target.position.start.offset += origin.position.start.offset;
    target.position.end.line += origin.position.start.line - 1;
    target.position.end.offset += origin.position.start.offset;
  }
};

var blockStartRE = /BLOCK_START/i;
var blockEndRE = /BLOCK_END/i;

module.exports = function (h, node) {
  var origin = node;
  var ast = parse5.parseFragment(node.value, {
    sourceCodeLocationInfo: true
  });
  var hast = fromParse5(ast, {
    file: node.value,
    verbose: true
  });
  hast.tagName = "div";
  hast.type = "element";
  hast.properties = {};
  var pathStack = [],
      currentPath;
  traverse(hast, function (path) {
    updatePostion(origin, path.node, hast);

    if (path.node.type === "comment" && blockStartRE.test(path.node.value)) {
      path.node.type = "macro";
      path.node.properties = {};
      path.node.value = String(path.node.value || "").split(/\s*:\s*/).map(function (s) {
        return s.trim();
      });
      path.node.children = [];
      pathStack.push(path);
      currentPath = path;
    } else if (path.node.type === "comment" && blockEndRE.test(path.node.value)) {
      var startPath = pathStack.pop();

      if (startPath) {
        startPath.node.position.after = path.node.position;
      }

      currentPath = null;
    } else if (pathStack.length) {
      currentPath.append(path);
    }
  });
  return h.augment(node, hast);
};