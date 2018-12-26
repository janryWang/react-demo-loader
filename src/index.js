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
    .then(async source => {
      const { map, code } = await mergeCode(source, demos)
      callback(null, code, map)
    })
}
