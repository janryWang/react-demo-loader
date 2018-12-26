const parser = require("@babel/parser")
const template = require("@babel/template").default
const traverse = require("@babel/traverse").default
const babel = require("@babel/core")
const get = require("lodash.get")

const babelConf = {
  presets: [["@babel/preset-env", { loose: true }], "@babel/preset-react"],
  ast: true
}

module.exports = async function(master, demos) {
  const masterAst = parser.parse(master, {
    sourceType: "module",
    plugins: ["jsx", "flow"]
  })
  const demosAst = demos.map(({ name, source }) => {
    return template.ast`
      var ${name} = __DefineComponent__(function(module,exports){
        ${get(babel.transformSync(source, babelConf), "ast.program.body")}
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
