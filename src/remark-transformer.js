/**
 *
 * 代码转换器，将MD文档转换成jsx
 *
 */
const unified = require("unified")
const markdown = require("remark-parse")
const matter = require("remark-frontmatter")
const parseFormatter = require("remark-parse-yaml")
const slug = require("remark-slug")
const md2react = require("./remark-react")

module.exports = async (code, options) => {
  const parsed = await unified()
    .use(markdown, { type: "yaml", marker: "-" })
    .use(matter)
    .use(parseFormatter)
    .use(slug)
    .use(md2react, options)
    .process(code)
  return parsed.contents
}
