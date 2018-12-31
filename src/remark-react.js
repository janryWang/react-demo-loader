const toHAST = require("mdast-util-to-hast")
const detab = require("detab")
const path = require("path")
const fs = require("fs-extra")
const generate = require("nanoid/generate")
const commentMaker = require("mdast-comment-marker")
const u = require("unist-builder")
const transfromHTMLAST = require("./html-transformer")
const randomName = () => generate("abcdefghijklmnopqrstuvwxyz", 5)
const { renderTablePropsToFile } = require("./utils")

const headingRE = /h\d/

const wsRE = /^\s*$/

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

const createMacroElement = (node, opts) => {
  if (node.value[1] === "COMPONENT_PROPS" && node.value[2]) {
    node.position.after &&
      renderTablePropsToFile(
        opts.resourcePath,
        path.resolve(path.dirname(opts.resourcePath), node.value[2]),
        node.position.end.offset,
        node.position.after.start.offset
      )
    return `
    React.createElement(ReactPropsTable,{
      of:require("${node.value[2]}")
    }${
      node.children.length
        ? `,${node.children
            .reduce((buf, node) => {
              let compiled = compileElement(node)
              return compiled ? buf.concat(compiled) : buf
            }, [])
            .join(",")}`
        : ""
    })
    `
  }

  return ""
}

const compileElement = (ast, opts) => {
  if (ast.type === "element") {
    return `React.createElement(${
      ast.isComponent ? ast.tagName : `"${ast.tagName}"`
    },{${compileAttributes(
      ast.tagName,
      ast.isComponent
        ? ast.properties
        : appendClassName(ast.tagName, ast.properties),
      opts
    )}}${
      ast.children.length
        ? `,${ast.children
            .reduce((buf, node) => {
              let compiled = compileElement(node, opts)
              return compiled ? buf.concat(compiled) : buf
            }, [])
            .join(",")}`
        : ""
    })`
  } else if (ast.type === "text") {
    return wsRE.test(ast.value) ? "" : JSON.stringify(ast.value)
  } else if (ast.type === "comment") {
    return
  } else if (ast.type === "macro") {
    return createMacroElement(ast, opts)
  } else {
    return `React.createElement("div",{dangerouslySetInnerHTML:{__html:${JSON.stringify(
      ast.value
    )}}})`
  }
}

const toReactSource = (ast, yaml, opts) => {
  return `
  var React = require('react')
  var ReactDOM = require('react-dom')
  var ReactCodeSnippet = require('react-code-snippet')
  var ReactPropsTable = require('react-props-table')
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
      ${ast.children
        .reduce((buf, node) => {
          let compiled = compileElement(node, opts)
          return compiled ? buf.concat(compiled) : buf
        }, [])
        .join(",")}
    )
  }
  __MARKDOWN__.meta = ${JSON.stringify(yaml)}
  module.exports = __MARKDOWN__
  `
}

module.exports = function(options) {
  let identify_index = 0

  this.Compiler = ast => {
    let yaml = {}
    let newAst = toHAST(ast, {
      allowDangerousHTML: true,
      handlers: {
        yaml(h, node) {
          yaml = node.data.parsedValue
        },
        html(h, node) {
          return transfromHTMLAST(h, node)
        },
        code(h, node) {
          let value = node.value ? detab(node.value + "\n") : ""
          let lang = node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/)
          const props = {}
          if (lang) {
            lang = lang[0]
            props.className = ["language-" + lang]
          }
          const component = `Demo_${randomName()}_${identify_index++}`
          const isNotJsx = (lang && lang !== "jsx") || !lang
          const _node = u("element", {
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
        },
        block_comment(h, node) {
          console.log(node)
        }
      }
    })
    return toReactSource(newAst, yaml, options)
  }
}
