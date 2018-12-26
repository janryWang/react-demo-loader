/**
 *
 * 代码转换器，将MD文档转换成jsx
 *
 */
const unified = require("unified")
const markdown = require("remark-parse")
const md2react = require("./md2react")

exports.transform = async (code, options) => {
  const parsed = await unified()
    .use(markdown)
    .use(md2react, options)
    .process(code)
  return parsed.contents
}
