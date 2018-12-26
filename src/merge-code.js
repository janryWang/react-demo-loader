const parser = require("@babel/parser")
const template = require("@babel/template").default
const traverse = require("@babel/traverse").default
const babel = require("@babel/core")
const get = require("lodash.get")

const babelConf = {
  presets: [["@babel/preset-env", { loose: true }], "@babel/preset-react"],
  ast: true
}

const getDefaultSpecifierName = specifiers => {
  return get(
    specifiers.find(node => node.type === "ImportDefaultSpecifier"),
    "local.name"
  )
}

const getSpecifierNames = specifiers => {
  return specifiers.filter(node => node.type === "ImportSpecifier")
}

const transformDemoAst = ast => {
  let ReactDOMDefault = "",
    ReactDOMSpecifiers = []
  traverse(ast, {
    enter(path) {
      if (
        path.parentPath &&
        path.parentPath.isExpressionStatement() &&
        path.isCallExpression()
      ) {
        if (
          get(path.node, "callee.property.name") === "render" &&
          get(path.node, "callee.object.name") === ReactDOMDefault
        ) {
          const jsx = get(path.node, "arguments[0]")
          path.insertAfter(template.ast`
          export default function(){ 
            return ${jsx}
          }
        `)
          path.remove()
        } else if (
          ReactDOMSpecifiers.some(spec => {
            return (
              spec.imported.name === "render" &&
              get(path.node, "callee.name") === spec.local.name
            )
          })
        ) {
          const jsx = get(path.node, "arguments[0]")
          path.insertAfter(template.ast`
          export default function(){ return ${jsx}}
          `)
          path.remove()
        }
      }
      if (path.isImportDeclaration()) {
        if (path.node.source.value === "react-dom") {
          ReactDOMDefault = getDefaultSpecifierName(path.node.specifiers)
          ReactDOMSpecifiers = getSpecifierNames(path.node.specifiers)
        }
      }
    }
  })
  return ast
}

const parseCode = source => {
  return parser.parse(source, {
    sourceType: "module",
    plugins: ["jsx", "flow"]
  })
}

module.exports = async function(master, demos) {
  const masterAst = parseCode(master)
  const demosAst = demos.map(({ name, source }) => {
    const ast = transformDemoAst(parseCode(source))
    const demoAst = babel.transformFromAstSync(ast, "", babelConf).ast
    return template.ast`
      var ${name} = __DefineComponent__(function(module,exports){
        ${demoAst.program.body}
      })
    `
  })
  traverse(masterAst, {
    enter(path) {
      if (
        path.isVariableDeclarator() &&
        get(path.node, "id.name") === "__MarkdownComponent__"
      ) {
        demosAst.forEach(node => {
          path.parentPath.insertBefore(node)
        })
      }
    }
  })
  const { code } = await babel.transformFromAst(masterAst)
  return code
}
