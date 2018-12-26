const { getOptions } = require("loader-utils")
const transformer = require("./transformer")
const mergeCode = require("./merge-code")

module.exports = function demoLoader(source) {
  const options = getOptions(this) || {}
  const demos = []
  var callback = this.async()
  transformer
    .transform(source, {
      onCode: (name, source) => {
        demos.push({ name, source })
      }
    })
    .then(async code => {
      const newCode = await mergeCode(code, demos)
      callback(null, newCode)
    })
}
