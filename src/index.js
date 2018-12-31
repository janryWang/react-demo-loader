const { getOptions } = require("loader-utils")
const transformMarkdown = require("./remark-transformer")
const transformJSCode = require("./js-transformer")

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
    const { map, code } = await transformJSCode(source, demos)
    callback(null, code, map)
  })
  return ""
}
