const toHAST = require("mdast-util-to-hast")
const detab = require("detab")
const generate = require("nanoid/generate")
const u = require("unist-builder")

const randomName = () => generate("abcdefghijklmnopqrstuvwxyz", 5)

const headingRE = /h\d/

const compileAttributeValue = (tag, key, value) => {
  if (key == "className") {
    const className = Array.isArray(value) ? value.join(" ") : value
    return JSON.stringify(className)
  }
  return JSON.stringify(value)
}

const compileAttributes = (tag, props) => {
  return Object.keys(props)
    .reduce((buf, key) => {
      return buf.concat(`${key}:${compileAttributeValue(tag, key, props[key])}`)
    }, [])
    .join(",")
}

const appendClassName = (tag, props) => {
  if (props.className) {
    props.className.push(`react-demo-${tag}`)
  } else {
    props.className = [`react-demo-${tag}`]
  }
  return props
}

const compileElement = ast => {
  if (ast.type === "element") {
    return `React.createElement(${
      ast.isComponent ? ast.tagName : `"${ast.tagName}"`
    },{${compileAttributes(
      ast.tagName,
      ast.isComponent
        ? ast.properties
        : appendClassName(ast.tagName, ast.properties)
    )}}${
      ast.children.length
        ? `,${ast.children.map(node => compileElement(node)).join(",")}`
        : ""
    })`
  } else if (ast.type === "text") {
    return JSON.stringify(ast.value)
  }
}

const toReactSource = ast => {
  return `
  var React = require('react')
  var ReactDOM = require('react-dom')
  var ReactCodeSnippet = require('react-code-snippet')
  var __DEFINE__ = function(fn){
    var module = {
      exports:{}
    }
    fn(module,module.exports)
    var component = module.exports.__esModule && module.exports['default'] || module.exports
    return typeof component === 'function' ? component : function(){
      return React.createElement('div',{},'Code snippet should export a component!')
    }
  }
  var __MARKDOWN__ = function(){
    return React.createElement(
      React.Fragment,
      {},
      ${ast.children.map(node => compileElement(node)).join(",")}
    )
  }
  module.exports = __MARKDOWN__
  `
}

module.exports = function(options) {
  let index = 0
  this.Compiler = ast => {
    return toReactSource(
      toHAST(ast, {
        handlers: {
          code(h, node) {
            var value = node.value ? detab(node.value + "\n") : ""
            var lang = node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/)
            var props = {}
            if (lang) {
              lang = lang[0]
              props.className = ["language-" + lang]
            }
            const component = `Demo_${randomName()}_${index++}`
            const isNotJsx = (lang && lang !== "jsx") || !lang
            let _node = u("element", {
              tagName: "ReactCodeSnippet",
              isComponent: true,
              properties: {
                code: value,
                justCode: isNotJsx,
                lang
              },
              children: !isNotJsx
                ? [
                    u("element", {
                      tagName: component,
                      isComponent: true,
                      properties: {},
                      children: []
                    })
                  ]
                : []
            })
            if (!isNotJsx && options && options.onCode) {
              options.onCode(component, node.value)
            }
            return _node
          }
        }
      })
    )
  }
}
