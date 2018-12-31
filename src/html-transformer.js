const parse5 = require("parse5")
const fromParse5 = require("hast-util-from-parse5")

const toArr = val => (Array.isArray(val) ? val : val ? [val] : [])

const createPath = (node, index, parentPath) => {
  return {
    node: node,
    get index() {
      if (this.parentPath) {
        return this.parentPath.node.children.findIndex(child => child === node)
      }
      return index
    },
    parentPath,
    insertAfter(target) {
      if (this.parentPath) {
        this.parentPath.node.children.splice(this.index + 1, 0, target.node)
        target.remove()
        target.parentPath = this.parentPath
      }
    },
    insertBefore(target) {
      if (this.parentPath) {
        this.parentPath.node.children.splice(this.index, 0, target.node)
        target.remove()
        target.parentPath = this.parentPath
      }
    },
    remove() {
      if (this.parentPath) {
        let index = this.index
        this.parentPath.node.children.splice(index, 1)
      }
    },
    append(target) {
      target.remove()
      this.node.children.push(target.node)
      target.parentPath = this
    }
  }
}

const traverse = (node, callback) => {
  const visitor = (node, index, parentPath) => {
    const path = createPath(node, index, parentPath)
    if (node) callback(path)
    if (node && node.children) {
      ;[...node.children].forEach((child, index) => {
        visitor(child, index, path)
      })
    }
  }
  return visitor(node, 0)
}

const updatePostion = (origin, target, root) => {
  if (target.position && origin.position) {
    target.position.start.line += origin.position.start.line - 1
    target.position.start.offset += origin.position.start.offset
    target.position.end.line += origin.position.start.line - 1
    target.position.end.offset += origin.position.start.offset
  }
}

const blockStartRE = /BLOCK_START/i
const blockEndRE = /BLOCK_END/i

module.exports = (h, node, pathStack) => {
  const origin = node
  const ast = parse5.parseFragment(node.value, { sourceCodeLocationInfo: true })
  const hast = fromParse5(ast, { file: node.value, verbose: true })
  hast.tagName = "div"
  hast.type = "element"
  hast.properties = {}

  traverse(hast, path => {
    updatePostion(origin, path.node, hast)
    if (path.node.type === "comment" && blockStartRE.test(path.node.value)) {
      path.node.type = "macro"
      path.node.properties = {}
      path.node.value = String(path.node.value || "")
        .split(/\s*:\s*/)
        .map(s => s.trim())
      path.node.children = []
      pathStack.push(path)
    } else if (
      path.node.type === "comment" &&
      blockEndRE.test(path.node.value)
    ) {
      const startPath = pathStack.pop()
      if (startPath) {
        startPath.node.position.after = path.node.position
      }
    } else if (pathStack.length) {
      pathStack[pathStack.length - 1].append(path)
    }
  })
  return h.augment(node, hast)
}
