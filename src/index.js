const { getOptions } = require("loader-utils")
const transformMarkdown = require("./remark-transformer")
const transformJSCode = require("./js-transformer")
const { codeFrameColumns } = require("@babel/code-frame")
const chalk = require("chalk")
const createErrorComponent = msg => {
  return `
  const React = require('react');
  module.exports = function(){ 
     return React.createElement('pre',{ style: { background: "#000",padding:10,color:'red' } },
        React.createElement('code',{},${JSON.stringify(msg)})
     )
  }
  `
}

module.exports = function demoLoader(source) {
  const options = getOptions(this) || {}
  const demos = []
  var callback = this.async()
  transformMarkdown(source, {
    onCode: (name, source) => {
      demos.push({ name, source })
    },
    resourcePath: this.resourcePath
  }).then(async source => {
    try {
      const { map, code } = await transformJSCode(source, demos)
      callback(null, code, map)
    } catch (e) {
      let formatMsg = e && e.message
      if (e.loc && e.source)
        formatMsg = codeFrameColumns(e.source, { start: e.loc })
      console.log(chalk.red(`\n${e.message}(${this.resourcePath})\n`))
      console.log(chalk.red(formatMsg))
      callback(null, createErrorComponent(formatMsg))
    }
  })
  return ""
}
